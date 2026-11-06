#!/usr/bin/env node
// Lexical search over spec and docs corpora (FTS5, bm25, shared confidence rule); telemetry joined for specs only.
import { readFileSync, appendFileSync, existsSync, statSync, lstatSync, readdirSync, mkdirSync, rmSync, realpathSync, openSync, readSync, closeSync } from "node:fs";
import { join, dirname, basename, isAbsolute, matchesGlob } from "node:path";
import { homedir } from "node:os";
import { execFileSync } from "node:child_process";
import process from "node:process";
import { parse as parseYaml } from "yaml";
import { mergeGauntlet, planDirsFor, resolveFlowGuards, resolveTelemetry } from "../../extensions/lib/gauntlet-settings.ts";
import { readTelemetryBranch, telemetryRepo } from "../../extensions/lib/telemetry-branch.ts";

const SCHEMA_VERSION = 3;
const EVIDENCE_DF_FRACTION = 0.5;
const MIN_EVIDENCE_TOKENS = 2;
const SCORE_RATIO = 0.5;
// Policy floor, not derived from the rule: below it an empty result says little about coverage.
const MIN_CORPUS = 10;
// Default banner grammar of skills/brainstorming/reference/superseding.md; a named-section
// scope or anything after `- fully` keeps the spec live.
const FULLY_BANNER = /^> \*\*Superseded by:\*\* \[.*\]\(.*\) - fully$/;
const MIN_NODE = [24, 15, 0];
const DRAFT_MARKER = "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing";
const EXCLUDE_LINE = "/.pi/gauntlet/index.sqlite*";
const SKIP_DIRS = new Set([".worktrees", "node_modules", "build"]);
const FENCE = /^\s*(`{3,}|~{3,})/;
const DOC_INCLUDES = ["**/doc/**/*.md", "**/docs/**/*.md", "README.md", "AGENTS.md"];
const DOC_EXCLUDE_GLOBS = ["**/node_modules/**", ".pi/gauntlet/**", ".worktrees/**"];
const OVERRIDES_FILES = [".pi/gauntlet-overrides.md", "gauntlet-overrides.md", "doc/gauntlet-overrides.md"];
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS meta  (key TEXT PRIMARY KEY, value TEXT);
  CREATE TABLE IF NOT EXISTS files (corpus TEXT NOT NULL, path TEXT NOT NULL, mtime_ms INTEGER, size INTEGER, PRIMARY KEY (corpus, path));
  CREATE VIRTUAL TABLE IF NOT EXISTS specs USING fts5(
    path UNINDEXED, service UNINDEXED, title, goal, headings, body, state UNINDEXED,
    tokenize = 'porter unicode61');
  CREATE VIRTUAL TABLE IF NOT EXISTS docs USING fts5(
    path UNINDEXED, title, headings, body,
    tokenize = 'porter unicode61');
`;

const usage = () => {
  process.stderr.write('usage: gauntlet-spec-index --query "<text>" [--corpus specs|docs] [--limit N] [--exclude <repo-relative path>]...\n');
  process.exit(1);
};
const die = (msg) => {
  process.stderr.write(`${msg}\n`);
  process.exit(2);
};

function parseArgs(argv) {
  let query;
  let corpus = "specs";
  let limit = 10;
  const exclude = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--query" && argv[i + 1] !== undefined) query = argv[++i];
    else if (argv[i] === "--corpus" && Object.hasOwn(CORPORA, argv[i + 1] ?? "")) corpus = argv[++i];
    else if (argv[i] === "--limit" && /^[1-9]\d*$/.test(argv[i + 1] ?? "")) limit = Number(argv[++i]);
    else if (argv[i] === "--exclude" && argv[i + 1] !== undefined) exclude.push(argv[++i]);
    else usage();
  }
  if (query === undefined) usage();
  return { query, corpus, limit, exclude };
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

function readLayer(file) {
  if (!existsSync(file)) return {};
  try { return JSON.parse(readFileSync(file, "utf8")); } catch (e) { process.stderr.write(`warning: ${file}: ${e.message}; using {} for this layer\n`); return {}; }
}
function settingsFor(root) {
  const agentDir = process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
  return mergeGauntlet(readLayer(join(agentDir, "settings.json"))?.piGauntlet, readLayer(join(root, ".pi", "settings.json"))?.piGauntlet);
}
function specDirsFor(root) {
  const specDirs = resolveFlowGuards(settingsFor(root)).specDirs;
  return { specDirs, planDirs: planDirsFor(specDirs) };
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
  const { specDirs } = specDirsFor(root);
  const svc = services(root).sort((a, b) => a.localeCompare(b));
  for (const d of specDirs) {
    collect(d, "root");
    for (const s of svc) collect(`${s}/${d}`, s);
  }
  return out;
}

// Top-level directories discover() would scan; a slash-free include also matches one level under them.
function services(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => (e.isDirectory() || e.isSymbolicLink()) && !e.name.startsWith(".") && !SKIP_DIRS.has(e.name))
    .map((e) => e.name);
}

function includes(root) {
  const file = OVERRIDES_FILES.map((rel) => join(root, rel)).find((abs) => existsSync(abs));
  if (!file) return DOC_INCLUDES;
  const globs = [];
  let inSection = false;
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch (e) {
    die(`gauntlet-spec-index: unreadable overrides file ${file}: ${e.message}`);
  }
  for (const line of text.split(/\r?\n/)) {
    if (/^## /.test(line)) { inSection = line.trim() === "## Spec index"; continue; }
    if (!inSection) continue;
    const m = /^-\s+docs:\s*(.+?)\s*$/.exec(line);
    if (m) globs.push(m[1].replace(/^[`"']+|[`"']+$/g, ""));
  }
  return globs.length ? globs : DOC_INCLUDES;
}

function firstLine(abs) {
  const fd = openSync(abs, "r");
  try {
    const buf = Buffer.alloc(128);
    const n = readSync(fd, buf, 0, 128, 0);
    return buf.toString("utf8", 0, n).split(/\r?\n/, 1)[0];
  } finally {
    closeSync(fd);
  }
}

// Literal path-component containment: a doc under any configured spec or plan dir is never a docs row.
function underDirs(rel, dirs) {
  const parts = rel.split("/");
  return dirs.some((d) => {
    const dp = d.split("/");
    for (let i = 0; i + dp.length < parts.length; i++) if (dp.every((c, j) => parts[i + j] === c)) return true;
    return false;
  });
}

function discoverDocs(root, globs) {
  const { specDirs, planDirs } = specDirsFor(root);
  const skip = [...specDirs, ...planDirs];
  const svc = services(root);
  const patterns = globs.flatMap((g) => (g.includes("/") ? [g] : [g, ...svc.map((s) => `${s}/${g}`)]));
  const listed = execFileSync("git", ["-C", root, "ls-files", "-co", "--exclude-standard", "-z", "--", "*.md"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\0").filter(Boolean);
  const out = [];
  for (const rel of listed) {
    if (!patterns.some((p) => matchesGlob(rel, p))) continue;
    if (DOC_EXCLUDE_GLOBS.some((p) => matchesGlob(rel, p)) || underDirs(rel, skip)) continue;
    let st;
    try {
      st = lstatSync(join(root, rel));
      if (!st.isFile() || firstLine(join(root, rel)) === DRAFT_MARKER) continue;
    } catch {
      continue;
    }
    out.push({ path: rel, mtime_ms: Math.trunc(st.mtimeMs), size: st.size });
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

function fenceMask(lines) {
  const mask = new Array(lines.length).fill(false);
  let open = null;
  for (let i = 0; i < lines.length; i++) {
    const m = FENCE.exec(lines[i]);
    if (open) {
      mask[i] = true;
      if (m && m[1][0] === open.ch && m[1].length >= open.len) open = null;
    } else if (m) {
      mask[i] = true;
      open = { ch: m[1][0], len: m[1].length };
    }
  }
  return mask;
}

function extract(text, path) {
  const lines = text.split(/\r?\n/);
  const fenced = fenceMask(lines);
  const h1 = lines.findIndex((l, i) => !fenced[i] && l.startsWith("# "));
  const title = (h1 >= 0 ? lines[h1].slice(2).trim() : "") || basename(path, ".md");
  const goal = lines.find((l) => l.startsWith("**Goal:**"))?.slice("**Goal:**".length).trim() ?? "";
  const headings = lines.filter((l, i) => !fenced[i] && /^##{1,2} /.test(l)).map((l) => l.replace(/^#+ /, "")).join("\n");
  let state = "live";
  if (h1 >= 0) {
    // Title block: everything after the H1 up to the first H2 heading or code fence.
    for (const l of lines.slice(h1 + 1)) {
      if (/^## /.test(l) || FENCE.test(l)) break;
      if (FULLY_BANNER.test(l)) { state = "superseded"; break; }
    }
  }
  return { title, goal, headings, state };
}

function refresh(db, root, corpus) {
  const { table } = corpus;
  const found = corpus.discover(root);
  const known = new Map(db.prepare("SELECT path, mtime_ms, size FROM files WHERE corpus = ?").all(table).map((r) => [r.path, r]));
  const present = new Set(found.map((f) => f.path));
  const delRow = db.prepare(`DELETE FROM ${table} WHERE path = ?`);
  const delFile = db.prepare("DELETE FROM files WHERE corpus = ? AND path = ?");
  const insRow = db.prepare(`INSERT INTO ${table} (${corpus.columns.join(", ")}) VALUES (${corpus.columns.map(() => "?").join(", ")})`);
  const putFile = db.prepare("INSERT OR REPLACE INTO files (corpus, path, mtime_ms, size) VALUES (?, ?, ?, ?)");
  db.exec("BEGIN IMMEDIATE");
  try {
    for (const path of known.keys()) if (!present.has(path)) { delRow.run(path); delFile.run(table, path); }
    for (const f of found) {
      const k = known.get(f.path);
      if (k && k.mtime_ms === f.mtime_ms && k.size === f.size) continue;
      const text = readFileSync(join(root, f.path), "utf8");
      delRow.run(f.path);
      if (text.split(/\r?\n/, 1)[0] === DRAFT_MARKER) { delFile.run(table, f.path); continue; }
      insRow.run(...corpus.row(text, f));
      putFile.run(table, f.path, f.mtime_ms, f.size);
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

const tokens = (query) => query.split(/[^\p{L}\p{N}\p{Co}]+/u).filter((t) => t.length >= 2);
const quote = (t) => `"${t.replaceAll('"', '""')}"`;
const toMatch = (toks) => toks.map(quote).join(" OR ");

// Porter is not idempotent (manatee -> manate -> manat), so MATCH always receives an
// original token; the vocab pass only decides which tokens are the same term.
function representatives(db, toks) {
  const mem = new db.constructor(":memory:");
  try {
    mem.exec("CREATE VIRTUAL TABLE q USING fts5(t, tokenize = 'porter unicode61'); CREATE VIRTUAL TABLE qi USING fts5vocab(q, 'instance')");
    const ins = mem.prepare("INSERT INTO q (rowid, t) VALUES (?, ?)");
    toks.forEach((t, i) => ins.run(i + 1, t));
    const rep = new Map();
    for (const r of mem.prepare("SELECT term, doc FROM qi ORDER BY doc, offset").all()) if (!rep.has(r.term)) rep.set(r.term, toks[r.doc - 1]);
    return rep;
  } finally {
    mem.close();
  }
}

function confidenceFilter(rows, evidence) {
  return rows.filter((r) => {
    const hits = evidence.filter((e) => e.all.has(r.rowid)).length;
    const strong = evidence.filter((e) => e.strong.has(r.rowid)).length;
    return hits >= MIN_EVIDENCE_TOKENS && strong >= MIN_EVIDENCE_TOKENS;
  });
}

function query(db, corpus, toks, { limit, exclude }) {
  const { table } = corpus;
  const n = db.prepare(`SELECT count(*) AS n FROM ${table}`).get().n;
  const rowids = (match) => new Set(db.prepare(`SELECT rowid FROM ${table} WHERE ${table} MATCH ?`).all(match).map((r) => r.rowid));
  const reps = representatives(db, toks);
  const terms = [...new Set(reps.values())];
  const evidence = [];
  for (const tok of terms) {
    const all = rowids(quote(tok));
    if (all.size === 0 || all.size >= n * EVIDENCE_DF_FRACTION) continue;
    evidence.push({ all, strong: rowids(corpus.strong.map((f) => `${f}:${quote(tok)}`).join(" OR ")) });
  }
  if (evidence.length < MIN_EVIDENCE_TOKENS) return { rows: [], n };
  const rows = db.prepare(
    `SELECT rowid, ${corpus.select}, bm25(${table}, ${corpus.weights.map((w) => w.toFixed(1)).join(", ")}) AS score
     FROM ${table} WHERE ${table} MATCH ?`,
  ).all(toMatch(terms)).filter((r) => !exclude.includes(r.path));
  const kept = confidenceFilter(rows, evidence);
  const live = (r) => !corpus.hasState || r.state === "live";
  kept.sort((a, b) => Number(!live(a)) - Number(!live(b)) || a.score - b.score);
  const best = kept.find(live);
  const cut = best ? kept.filter((r) => Math.abs(r.score) >= SCORE_RATIO * Math.abs(best.score)) : kept;
  return { rows: cut.slice(0, limit), n };
}

function telemetryCorpus(root) {
  const settings = resolveTelemetry(settingsFor(root));
  if (settings.warning) process.stderr.write(`warning: ${settings.warning}\n`);
  if (!settings.enabled) return new Map();
  const repo = telemetryRepo(root) ?? `local/${basename(root)}`;
  const prefix = `${repo}/brainstorming/`;
  const result = readTelemetryBranch(root, { remote: settings.remote, prefix });
  if (result.warning) process.stderr.write(`warning: ${result.warning}\n`);
  return new Map(result.records.map(({ path, bytes }) => [path.slice(prefix.length), bytes]));
}

function telemetry(root, specPath, records) {
  const blank = { status: null, shipped_at: null, files: "" };
  const p = specPath.replace(/\.md$/, ".yaml");
  const bytes = records.get(p);
  if (bytes === undefined) return blank;
  let rec;
  try {
    rec = parseYaml(bytes);
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

function docSnippet(r) {
  if (!r.hsnip.includes("\u0001")) return r.bsnip;
  const fragment = r.hsnip.split("\n").find((line) => line.includes("\u0001")).replace(/[\u0001\u0002]/g, "");
  return r.headings.split("\n").find((line) => line.includes(fragment));
}

const CORPORA = {
  specs: {
    table: "specs",
    columns: ["path", "service", "title", "goal", "headings", "body", "state"],
    strong: ["title", "goal"],
    weights: [0, 0, 10, 5, 2, 1, 0],
    hasState: true,
    header: ["score", "path", "service", "title", "status", "shipped_at", "state", "files", "snippet"],
    select: "path, service, title, state, snippet(specs, 5, '', '', '...', 12) AS snippet",
    discover,
    row: (text, f) => {
      const x = extract(text, f.path);
      return [f.path, f.service, x.title, x.goal, x.headings, text, x.state];
    },
    format: (root, r, records) => {
      const t = telemetry(root, r.path, records);
      return [...[r.score.toFixed(3), r.path, r.service, r.title, t.status, t.shipped_at, r.state].map(cell), filesCell(t.files), cell(r.snippet)];
    },
  },
  docs: {
    table: "docs",
    columns: ["path", "title", "headings", "body"],
    strong: ["title", "headings"],
    weights: [0, 10, 3, 1],
    hasState: false,
    header: ["score", "path", "title", "snippet"],
    select: "path, title, headings, snippet(docs, 2, '\u0001', '\u0002', '', 12) AS hsnip, snippet(docs, 3, '', '', '...', 12) AS bsnip",
    discover: (root) => discoverDocs(root, includes(root)),
    row: (text, f) => {
      const x = extract(text, f.path);
      return [f.path, x.title, x.headings, text];
    },
    format: (root, r) => [r.score.toFixed(3), r.path, r.title, docSnippet(r)].map(cell),
  },
};

async function main() {
  if (!nodeOk()) die(`gauntlet-spec-index needs Node >=24.15.0 (found ${process.versions.node})`);
  const { query: text, corpus: name, limit, exclude } = parseArgs(process.argv.slice(2));
  const toks = tokens(text);
  if (!toks.length) usage();
  const root = repoRoot();
  const corpus = CORPORA[name];
  const db = await openDb(root);
  refresh(db, root, corpus);
  const { rows, n } = query(db, corpus, toks, { limit, exclude });
  const records = name === "specs" ? telemetryCorpus(root) : new Map();
  const out = [corpus.header.join("\t")];
  for (const r of rows) out.push(corpus.format(root, r, records).join("\t"));
  process.stdout.write(out.join("\n") + "\n");
  if (rows.length === 0 && n < MIN_CORPUS) {
    process.stderr.write(`gauntlet-spec-index: ${name} corpus has ${n} documents - too small for the confidence rule; no rows returned\n`);
  }
  db.close();
}

main().catch((e) => {
  if (e?.code === "ERR_SQLITE_ERROR") die(`gauntlet-spec-index: ${e.message}`);
  throw e;
});
