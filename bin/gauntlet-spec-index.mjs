#!/usr/bin/env node
// Lexical search over the spec corpus. Build-on-query: refresh a per-worktree
// FTS5 cache by mtime+size, then rank with bm25 and join telemetry at output.
import { readFileSync, appendFileSync, existsSync, statSync, readdirSync, mkdirSync, rmSync, realpathSync } from "node:fs";
import { join, dirname, basename, isAbsolute } from "node:path";
import { execFileSync } from "node:child_process";
import process from "node:process";
import { parse as parseYaml } from "yaml";

const SCHEMA_VERSION = 1;
const MIN_NODE = [24, 15, 0];
const DRAFT_MARKER = "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing";
const EXCLUDE_LINE = "/.pi/gauntlet/index.sqlite*";
const SKIP_DIRS = new Set([".worktrees", "node_modules", "build"]);
const HEADER = ["score", "path", "service", "title", "status", "shipped_at", "files", "snippet"];
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS meta  (key TEXT PRIMARY KEY, value TEXT);
  CREATE TABLE IF NOT EXISTS files (path TEXT PRIMARY KEY, mtime_ms INTEGER, size INTEGER);
  CREATE VIRTUAL TABLE IF NOT EXISTS specs USING fts5(
    path UNINDEXED, service UNINDEXED, title, goal, headings, body,
    tokenize = 'porter unicode61');
`;

const usage = () => {
  process.stderr.write('usage: gauntlet-spec-index --query "<text>" [--limit N]\n');
  process.exit(1);
};
const die = (msg) => {
  process.stderr.write(`${msg}\n`);
  process.exit(2);
};

function parseArgs(argv) {
  let query;
  let limit = 10;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--query" && argv[i + 1] !== undefined) query = argv[++i];
    else if (argv[i] === "--limit" && /^[1-9]\d*$/.test(argv[i + 1] ?? "")) limit = Number(argv[++i]);
    else usage();
  }
  if (query === undefined) usage();
  return { query, limit };
}

function nodeOk() {
  const cur = process.versions.node.split(".").map(Number);
  for (let i = 0; i < 3; i++) if (cur[i] !== MIN_NODE[i]) return cur[i] > MIN_NODE[i];
  return true;
}

const git = (cwd, args) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

function repoRoot() {
  try {
    return git(process.cwd(), ["rev-parse", "--show-toplevel"]);
  } catch {
    return die("gauntlet-spec-index: not inside a git repository");
  }
}

function discover(root) {
  const out = [];
  const seen = new Set();
  const collect = (relDir, service) => {
    const abs = join(root, relDir);
    let real;
    try {
      real = realpathSync(abs);
      if (!statSync(real).isDirectory()) return;
    } catch {
      return;
    }
    if (seen.has(real)) return;
    seen.add(real);
    for (const name of readdirSync(abs).sort()) {
      if (!name.endsWith(".md")) continue;
      const rel = `${relDir}/${name}`;
      const st = statSync(join(root, rel));
      if (st.isFile()) out.push({ path: rel, service, mtime_ms: Math.trunc(st.mtimeMs), size: st.size });
    }
  };
  collect("doc/specs", "root");
  const entries = readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const e of entries) {
    if (e.name.startsWith(".") || SKIP_DIRS.has(e.name)) continue;
    if (!e.isDirectory() && !e.isSymbolicLink()) continue;
    collect(`${e.name}/doc/specs`, e.name);
  }
  return out;
}

function ensureExclude(root) {
  const rel = git(root, ["rev-parse", "--git-path", "info/exclude"]);
  const abs = isAbsolute(rel) ? rel : join(root, rel);
  const cur = existsSync(abs) ? readFileSync(abs, "utf8") : "";
  if (cur.split("\n").includes(EXCLUDE_LINE)) return;
  mkdirSync(dirname(abs), { recursive: true });
  appendFileSync(abs, `${cur.length && !cur.endsWith("\n") ? "\n" : ""}${EXCLUDE_LINE}\n`);
}

async function openDb(root) {
  const { DatabaseSync } = await import("node:sqlite");
  const dbPath = join(root, ".pi/gauntlet/index.sqlite");
  mkdirSync(dirname(dbPath), { recursive: true });
  const fresh = !existsSync(dbPath);
  const create = () => {
    const db = new DatabaseSync(dbPath);
    db.exec("PRAGMA busy_timeout = 2000");
    try {
      db.exec(SCHEMA);
    } catch (e) {
      if (/fts5/i.test(e.message)) die("gauntlet-spec-index: this Node's SQLite has no FTS5 module");
      throw e;
    }
    db.prepare("INSERT OR REPLACE INTO meta VALUES ('schema_version', ?)").run(String(SCHEMA_VERSION));
    return db;
  };
  const rebuild = (db) => {
    try { db?.close(); } catch {}
    for (const suffix of ["", "-journal", "-wal", "-shm"]) rmSync(dbPath + suffix, { force: true });
    return create();
  };
  if (fresh) ensureExclude(root);
  let db;
  try {
    db = new DatabaseSync(dbPath);
    db.exec("PRAGMA busy_timeout = 2000");
    const row = db.prepare("SELECT value FROM meta WHERE key = 'schema_version'").get();
    if (Number(row?.value) !== SCHEMA_VERSION) return rebuild(db);
    return db;
  } catch (e) {
    const missingMeta = e?.code === "ERR_SQLITE_ERROR" && e.errcode === 1 && /no such table:\s*meta/i.test(e.message);
    const corrupt = e?.code === "ERR_SQLITE_ERROR" && (e.errcode === 11 || e.errcode === 26);
    if (missingMeta || corrupt) return rebuild(db);
    try { db?.close(); } catch {}
    throw e;
  }
}

function extract(text, path) {
  const lines = text.split(/\r?\n/);
  const title = lines.find((l) => l.startsWith("# "))?.slice(2).trim() || basename(path, ".md");
  const goal = lines.find((l) => l.startsWith("**Goal:**"))?.slice("**Goal:**".length).trim() ?? "";
  const headings = lines.filter((l) => /^##{1,2} /.test(l)).map((l) => l.replace(/^#+ /, "")).join("\n");
  return { title, goal, headings };
}

function refresh(db, root, corpus) {
  const known = new Map(db.prepare("SELECT path, mtime_ms, size FROM files").all().map((r) => [r.path, r]));
  const present = new Set(corpus.map((f) => f.path));
  const delSpec = db.prepare("DELETE FROM specs WHERE path = ?");
  const delFile = db.prepare("DELETE FROM files WHERE path = ?");
  const insSpec = db.prepare("INSERT INTO specs (path, service, title, goal, headings, body) VALUES (?, ?, ?, ?, ?, ?)");
  const putFile = db.prepare("INSERT OR REPLACE INTO files (path, mtime_ms, size) VALUES (?, ?, ?)");
  db.exec("BEGIN IMMEDIATE");
  try {
    for (const path of known.keys()) if (!present.has(path)) { delSpec.run(path); delFile.run(path); }
    for (const f of corpus) {
      const k = known.get(f.path);
      if (k && k.mtime_ms === f.mtime_ms && k.size === f.size) continue;
      const text = readFileSync(join(root, f.path), "utf8");
      delSpec.run(f.path);
      if (text.split(/\r?\n/, 1)[0] === DRAFT_MARKER) { delFile.run(f.path); continue; }
      const x = extract(text, f.path);
      insSpec.run(f.path, f.service, x.title, x.goal, x.headings, text);
      putFile.run(f.path, f.mtime_ms, f.size);
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

const toMatch = (query) =>
  query.split(/\s+/).filter((t) => t.length >= 2).map((t) => `"${t.replaceAll('"', '""')}"`).join(" OR ");

function telemetry(root, specPath) {
  const blank = { status: null, shipped_at: null, files: "" };
  const p = join(root, ".pi/gauntlet/telemetry", specPath.replace(/\.md$/, ".yaml"));
  if (!existsSync(p)) return blank;
  let rec;
  try {
    rec = parseYaml(readFileSync(p, "utf8"));
  } catch {
    process.stderr.write(`gauntlet-spec-index: warning: unreadable telemetry ${p}\n`);
    return blank;
  }
  if (!rec || typeof rec !== "object" || Array.isArray(rec)) return blank;
  const mf = rec.derived?.modified_files;
  const files = Array.isArray(mf)
    ? mf.filter((f) => typeof f === "string" && existsSync(join(root, f))).join(";")
    : "missing";
  return { status: rec.status ?? null, shipped_at: rec.shipped_at ?? null, files };
}

const cell = (v) => (v === null || v === undefined ? "" : String(v).replace(/\s+/g, " ").trim());
// Paths keep their spaces; only column and row delimiters are neutralised.
const filesCell = (v) => v.replace(/[\t\r\n]+/g, " ");

async function main() {
  if (!nodeOk()) die(`gauntlet-spec-index needs Node >=24.15.0 (found ${process.versions.node})`);
  const { query, limit } = parseArgs(process.argv.slice(2));
  const match = toMatch(query);
  if (!match) usage();
  const root = repoRoot();
  const db = await openDb(root);
  refresh(db, root, discover(root));
  const rows = db.prepare(
    `SELECT path, service, title,
            bm25(specs, 0, 0, 10.0, 5.0, 2.0, 1.0) AS score,
            snippet(specs, 5, '', '', '...', 12) AS snippet
     FROM specs WHERE specs MATCH ?
     ORDER BY score LIMIT ?`,
  ).all(match, limit);
  const out = [HEADER.join("\t")];
  for (const r of rows) {
    const t = telemetry(root, r.path);
    out.push([...[r.score.toFixed(3), r.path, r.service, r.title, t.status, t.shipped_at].map(cell), filesCell(t.files), cell(r.snippet)].join("\t"));
  }
  process.stdout.write(out.join("\n") + "\n");
  db.close();
}

main().catch((e) => {
  if (e?.code === "ERR_SQLITE_ERROR") die(`gauntlet-spec-index: ${e.message}`);
  throw e;
});
