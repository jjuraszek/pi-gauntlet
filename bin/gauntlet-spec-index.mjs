#!/usr/bin/env node

// src/bins/gauntlet-spec-index.mjs
import { readFileSync, appendFileSync, existsSync, statSync, lstatSync, readdirSync, mkdirSync, rmSync as rmSync2, realpathSync, openSync, readSync, closeSync } from "node:fs";
import { join as join2, dirname, basename, isAbsolute, matchesGlob } from "node:path";
import { homedir } from "node:os";
import { execFileSync as execFileSync2 } from "node:child_process";
import process2 from "node:process";
import { parse as parseYaml } from "yaml";

// extensions/lib/gauntlet-settings.ts
function mergeGauntlet(preset, repo) {
  return { ...preset ?? {}, ...repo ?? {} };
}
var nonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
var joinWarn = (ws) => ws.length ? ws.join("; ") : void 0;
var DEFAULT_SPEC_DIRS = ["doc/specs", "docs/specs"];
var normalizeDir = (d) => d.trim().replace(/^\.\//, "").replace(/\/+$/, "");
function resolveFlowGuards(g) {
  const fg = g.flowGuards;
  const enforce = fg?.enforce !== false;
  const rawDirs = fg?.specDirs;
  const specDirs = Array.isArray(rawDirs) && rawDirs.length > 0 && rawDirs.every(nonEmptyString) ? rawDirs.map(normalizeDir) : [...DEFAULT_SPEC_DIRS];
  return { enforce, specDirs };
}
function planDirsFor(specDirs) {
  const out = /* @__PURE__ */ new Set();
  for (const dir of specDirs) {
    const parts = dir.split("/").filter((c) => c.length > 0);
    if (parts.length === 0) continue;
    out.add([...parts.slice(0, -1), "plans"].join("/"));
  }
  return [...out];
}
var DEFAULT_TELEMETRY_BUCKETS = [
  ["test", ["**/test/**", "**/tests/**", "**/__tests__/**", "**/*.test.*", "**/*.spec.*", "**/*_test.*"]],
  ["docs", ["**/*.md"]],
  ["config", ["**/*.json", "**/*.yaml", "**/*.yml", "**/*.toml", "**/*.lock", "**/*-lock.*"]]
];
function resolveTelemetry(g) {
  const t = g.telemetry;
  const warnings = [];
  const enabled = t?.enabled !== false;
  if (t && Object.hasOwn(t, "dir")) {
    warnings.push("piGauntlet.telemetry.dir is retired; records live on the gauntlet/telemetry branch - set piGauntlet.telemetry.remote to redirect them");
  }
  let buckets = DEFAULT_TELEMETRY_BUCKETS;
  if (t?.buckets !== void 0) {
    const b = t.buckets;
    const valid = b !== null && typeof b === "object" && !Array.isArray(b) && Object.keys(b).length > 0 && Object.values(b).every((v) => Array.isArray(v) && v.length > 0 && v.every(nonEmptyString));
    if (valid) buckets = Object.entries(b).map(([name, globs]) => [name, [...globs]]);
    else warnings.push("telemetry.buckets is not an object of non-empty glob arrays; using the defaults");
  }
  const remote = nonEmptyString(t?.remote) ? t.remote.trim() : void 0;
  if (t?.remote !== void 0 && !remote) warnings.push("telemetry.remote must be a non-empty URL; using origin");
  return { enabled, ...remote ? { remote } : {}, buckets, warning: joinWarn(warnings) };
}

// extensions/lib/telemetry-branch.ts
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// extensions/lib/vcs.ts
import { spawnSync } from "node:child_process";

// extensions/lib/checkout.ts
import { execFileSync } from "node:child_process";
var commandSync = (bin) => (args, cwd) => {
  try {
    const stdout = execFileSync(bin, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5e3 });
    return { code: 0, stdout };
  } catch (e) {
    const status = e.status;
    return { code: typeof status === "number" ? status : 1, stdout: "" };
  }
};
var gitSync = commandSync("git");
var jjSync = commandSync("jj");

// extensions/lib/phase-tracker-helpers.ts
var STMT_START = "(?:^|[\\n;&|(])\\s*";

// extensions/lib/telemetry-paths.ts
var GIT_FLAGS = "git\\s+(?:-\\S+(?:\\s+\\S+)?\\s+)*";
var SHIP_RE = new RegExp(STMT_START + "(" + GIT_FLAGS + "(?:merge\\s+--squash|push)(?=\\s|$)|gh\\s+pr\\s+create)");
var SQUASH_RE = new RegExp("^" + GIT_FLAGS + "merge\\s+--squash");

// extensions/lib/telemetry-diff.ts
var JJ_MAINLINE = "coalesce(trunk() ~ root(), present(main), present(master))";
var JJ_FORK_POINT = `fork_point(${JJ_MAINLINE} | @) ~ root() & ::${JJ_MAINLINE}`;

// extensions/lib/vcs.ts
var NO_PROMPT_ENV = { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_EDITOR: "true" };
var runBinary = (bin) => (args, cwd, timeoutMs = 1e4, options = {}) => {
  const r = spawnSync(bin, args, { cwd, encoding: "utf8", input: options.input, env: { ...NO_PROMPT_ENV, ...options.env }, timeout: timeoutMs, maxBuffer: 64 * 1024 * 1024 });
  const err = r.error;
  const timedOut = err?.code === "ETIMEDOUT";
  const stderr = timedOut ? "timed out" : (r.stderr ?? "").trim().split("\n")[0] || err?.message || `${bin} exited ${r.status}`;
  return { ok: !timedOut && r.status === 0, code: timedOut ? 1 : r.status ?? 1, stdout: options.raw ? r.stdout ?? "" : (r.stdout ?? "").trim(), stderr };
};
var gitRun = runBinary("git");

// extensions/lib/telemetry-branch.ts
var TELEMETRY_REF = "refs/heads/gauntlet/telemetry";
function telemetryRepo(root) {
  const result = gitRun(["config", "--get", "remote.origin.url"], root);
  const match = result.stdout.match(/^(?:https?:\/\/[^/]+\/|ssh:\/\/(?:[^@/]+@)?[^/]+\/|[^@\s]+@[^:\s]+:)([^/\s]+\/[^/\s]+?)\/?$/);
  return result.ok && match ? match[1].replace(/\.git$/, "") : void 0;
}
var trackingRef = (remote) => `refs/remotes/${remote === "origin" ? "origin" : "telemetry"}/gauntlet/telemetry`;
var fetchBranch = (root, remote) => gitRun(["fetch", "--no-tags", remote, `+${TELEMETRY_REF}:${trackingRef(remote)}`], root);
function syncTelemetryBranch(root, records, remote = "origin") {
  const scratch = mkdtempSync(join(tmpdir(), "gauntlet-telemetry-index-"));
  const env = { GIT_INDEX_FILE: join(scratch, "index") };
  const git2 = (args, input) => {
    const result = gitRun(args, root, void 0, { env, input });
    if (!result.ok) throw new Error(result.stderr);
    return result.stdout;
  };
  const tracking = trackingRef(remote);
  let fetchWarning;
  const fetch = () => {
    const result = fetchBranch(root, remote);
    fetchWarning = result.ok ? void 0 : `fetch failed: ${result.stderr}`;
    return result;
  };
  const resolve = (ref) => {
    const result = gitRun(["rev-parse", "--verify", ref], root);
    return result.ok ? result.stdout : void 0;
  };
  const commit = (tree, parent, message) => git2(["-c", "commit.gpgsign=false", "commit-tree", tree, ...parent ? ["-p", parent] : [], "-m", message]);
  let committed = false;
  try {
    let tip = resolve(TELEMETRY_REF);
    committed = records.size === 0 && !!tip;
    fetch();
    let upstream = resolve(tracking);
    if (records.size) {
      const parent = tip ?? upstream;
      git2(parent ? ["read-tree", parent] : ["read-tree", "--empty"]);
      for (const [path, content] of records) {
        const blob = git2(["hash-object", "-w", "--stdin"], content);
        git2(["update-index", "--add", "--cacheinfo", "100644", blob, path]);
      }
      const tree = git2(["write-tree"]);
      const next = parent && git2(["rev-parse", `${parent}^{tree}`]) === tree ? parent : commit(tree, parent, "telemetry: update records");
      git2(["update-ref", TELEMETRY_REF, next, tip ?? ""]);
      tip = next;
      committed = true;
    }
    const pending = () => tip ? git2(["rev-list", "--reverse", "--topo-order", tip, ...upstream ? [`^${upstream}`] : []]).split("\n").filter(Boolean) : [];
    if (!pending().length) return { ok: true, committed, pushed: false, warning: fetchWarning };
    const push = () => gitRun(["push", remote, `${TELEMETRY_REF}:${TELEMETRY_REF}`], root);
    const first = push();
    if (first.ok) return { ok: true, committed, pushed: true, warning: fetchWarning };
    const fetched = fetch();
    if (!fetched.ok) throw new Error(`${first.stderr}; refresh failed: ${fetched.stderr}`);
    upstream = resolve(tracking);
    let replayed = upstream;
    for (const sha of pending()) {
      git2(replayed ? ["read-tree", replayed] : ["read-tree", "--empty"]);
      const changes = git2(["diff-tree", "--root", "--no-commit-id", "--raw", "--no-abbrev", "--no-renames", "-r", "-z", sha]).split("\0");
      for (let i = 0; i + 1 < changes.length; i += 2) {
        const [, mode, , blob] = changes[i].split(" ");
        const path = changes[i + 1];
        git2(mode === "000000" ? ["update-index", "--force-remove", "--", path] : ["update-index", "--add", "--cacheinfo", mode, blob, path]);
      }
      replayed = commit(git2(["write-tree"]), replayed, git2(["log", "-1", "--format=%B", sha]));
    }
    if (replayed) git2(["update-ref", TELEMETRY_REF, replayed, tip]);
    const second = push();
    if (!second.ok) throw new Error(second.stderr);
    return { ok: true, committed, pushed: true };
  } catch (error) {
    const reason = error.message;
    return { ok: false, committed, pushed: false, reason, warning: [fetchWarning, `telemetry: not pushed (${reason})`].filter(Boolean).join("; ") };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}
function readTelemetryBranch(root, { remote = "origin", prefix = "" } = {}) {
  const records = [];
  let warning;
  try {
    const synced = syncTelemetryBranch(root, /* @__PURE__ */ new Map(), remote);
    warning = synced.warning;
    if (synced.pushed) {
      const fetched = fetchBranch(root, remote);
      warning = fetched.ok ? void 0 : `fetch failed: ${fetched.stderr}`;
    }
    const tip = gitRun(["rev-parse", "--verify", trackingRef(remote)], root);
    if (!tip.ok) return { records, warning: [warning, "no telemetry ref fetched yet"].filter(Boolean).join("; ") };
    const tree = gitRun(["ls-tree", "-r", "-z", tip.stdout, ...prefix ? ["--", prefix] : []], root);
    if (!tree.ok) throw new Error(tree.stderr);
    for (const entry of tree.stdout.split("\0").filter(Boolean)) {
      const [meta, path] = entry.split("	");
      const [, type, sha] = meta.split(" ");
      if (type !== "blob" || !path.startsWith(prefix) || !path.endsWith(".yaml")) continue;
      const blob = gitRun(["cat-file", "blob", sha], root, void 0, { raw: true });
      if (!blob.ok) throw new Error(blob.stderr);
      records.push({ path, bytes: blob.stdout });
    }
    return { records, warning };
  } catch (error) {
    return { records, warning: [warning, `read failed: ${error.message}`].filter(Boolean).join("; ") };
  }
}

// src/bins/gauntlet-spec-index.mjs
var SCHEMA_VERSION = 3;
var EVIDENCE_DF_FRACTION = 0.5;
var MIN_EVIDENCE_TOKENS = 2;
var SCORE_RATIO = 0.5;
var MIN_CORPUS = 10;
var FULLY_BANNER = /^> \*\*Superseded by:\*\* \[.*\]\(.*\) - fully$/;
var MIN_NODE = [24, 15, 0];
var DRAFT_MARKER = "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing";
var EXCLUDE_LINE = "/.pi/gauntlet/index.sqlite*";
var SKIP_DIRS = /* @__PURE__ */ new Set([".worktrees", "node_modules", "build"]);
var FENCE = /^\s*(`{3,}|~{3,})/;
var DOC_INCLUDES = ["**/doc/**/*.md", "**/docs/**/*.md", "README.md", "AGENTS.md"];
var DOC_EXCLUDE_GLOBS = ["**/node_modules/**", ".pi/gauntlet/**", ".worktrees/**"];
var OVERRIDES_FILES = [".pi/gauntlet-overrides.md", "gauntlet-overrides.md", "doc/gauntlet-overrides.md"];
var SCHEMA = `
  CREATE TABLE IF NOT EXISTS meta  (key TEXT PRIMARY KEY, value TEXT);
  CREATE TABLE IF NOT EXISTS files (corpus TEXT NOT NULL, path TEXT NOT NULL, mtime_ms INTEGER, size INTEGER, PRIMARY KEY (corpus, path));
  CREATE VIRTUAL TABLE IF NOT EXISTS specs USING fts5(
    path UNINDEXED, service UNINDEXED, title, goal, headings, body, state UNINDEXED,
    tokenize = 'porter unicode61');
  CREATE VIRTUAL TABLE IF NOT EXISTS docs USING fts5(
    path UNINDEXED, title, headings, body,
    tokenize = 'porter unicode61');
`;
var usage = () => {
  process2.stderr.write('usage: gauntlet-spec-index --query "<text>" [--corpus specs|docs] [--limit N] [--exclude <repo-relative path>]...\n');
  process2.exit(1);
};
var die = (msg) => {
  process2.stderr.write(`${msg}
`);
  process2.exit(2);
};
function parseArgs(argv) {
  let query2;
  let corpus = "specs";
  let limit = 10;
  const exclude = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--query" && argv[i + 1] !== void 0) query2 = argv[++i];
    else if (argv[i] === "--corpus" && Object.hasOwn(CORPORA, argv[i + 1] ?? "")) corpus = argv[++i];
    else if (argv[i] === "--limit" && /^[1-9]\d*$/.test(argv[i + 1] ?? "")) limit = Number(argv[++i]);
    else if (argv[i] === "--exclude" && argv[i + 1] !== void 0) exclude.push(argv[++i]);
    else usage();
  }
  if (query2 === void 0) usage();
  return { query: query2, corpus, limit, exclude };
}
function nodeOk() {
  const cur = process2.versions.node.split(".").map(Number);
  for (let i = 0; i < 3; i++) if (cur[i] !== MIN_NODE[i]) return cur[i] > MIN_NODE[i];
  return true;
}
var git = (cwd, args) => execFileSync2("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
function repoRoot() {
  try {
    return git(process2.cwd(), ["rev-parse", "--show-toplevel"]);
  } catch {
    return die("gauntlet-spec-index: not inside a git repository");
  }
}
function readLayer(file) {
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    process2.stderr.write(`warning: ${file}: ${e.message}; using {} for this layer
`);
    return {};
  }
}
function settingsFor(root) {
  const agentDir = process2.env.PI_CODING_AGENT_DIR || join2(homedir(), ".pi", "agent");
  return mergeGauntlet(readLayer(join2(agentDir, "settings.json"))?.piGauntlet, readLayer(join2(root, ".pi", "settings.json"))?.piGauntlet);
}
function specDirsFor(root) {
  const specDirs = resolveFlowGuards(settingsFor(root)).specDirs;
  return { specDirs, planDirs: planDirsFor(specDirs) };
}
function discover(root) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const collect = (relDir, service) => {
    const abs = join2(root, relDir);
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
      const st = statSync(join2(root, rel));
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
function services(root) {
  return readdirSync(root, { withFileTypes: true }).filter((e) => (e.isDirectory() || e.isSymbolicLink()) && !e.name.startsWith(".") && !SKIP_DIRS.has(e.name)).map((e) => e.name);
}
function includes(root) {
  const file = OVERRIDES_FILES.map((rel) => join2(root, rel)).find((abs) => existsSync(abs));
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
    if (/^## /.test(line)) {
      inSection = line.trim() === "## Spec index";
      continue;
    }
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
  const patterns = globs.flatMap((g) => g.includes("/") ? [g] : [g, ...svc.map((s) => `${s}/${g}`)]);
  const listed = execFileSync2("git", ["-C", root, "ls-files", "-co", "--exclude-standard", "-z", "--", "*.md"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\0").filter(Boolean);
  const out = [];
  for (const rel of listed) {
    if (!patterns.some((p) => matchesGlob(rel, p))) continue;
    if (DOC_EXCLUDE_GLOBS.some((p) => matchesGlob(rel, p)) || underDirs(rel, skip)) continue;
    let st;
    try {
      st = lstatSync(join2(root, rel));
      if (!st.isFile() || firstLine(join2(root, rel)) === DRAFT_MARKER) continue;
    } catch {
      continue;
    }
    out.push({ path: rel, mtime_ms: Math.trunc(st.mtimeMs), size: st.size });
  }
  return out;
}
function ensureExclude(root) {
  const rel = git(root, ["rev-parse", "--git-path", "info/exclude"]);
  const abs = isAbsolute(rel) ? rel : join2(root, rel);
  const cur = existsSync(abs) ? readFileSync(abs, "utf8") : "";
  if (cur.split("\n").includes(EXCLUDE_LINE)) return;
  mkdirSync(dirname(abs), { recursive: true });
  appendFileSync(abs, `${cur.length && !cur.endsWith("\n") ? "\n" : ""}${EXCLUDE_LINE}
`);
}
async function openDb(root) {
  const { DatabaseSync } = await import("node:sqlite");
  const dbPath = join2(root, ".pi/gauntlet/index.sqlite");
  mkdirSync(dirname(dbPath), { recursive: true });
  const fresh = !existsSync(dbPath);
  const create = () => {
    const db2 = new DatabaseSync(dbPath);
    db2.exec("PRAGMA busy_timeout = 2000");
    try {
      db2.exec(SCHEMA);
    } catch (e) {
      if (/fts5/i.test(e.message)) die("gauntlet-spec-index: this Node's SQLite has no FTS5 module");
      throw e;
    }
    db2.prepare("INSERT OR REPLACE INTO meta VALUES ('schema_version', ?)").run(String(SCHEMA_VERSION));
    return db2;
  };
  const rebuild = (db2) => {
    try {
      db2?.close();
    } catch {
    }
    for (const suffix of ["", "-journal", "-wal", "-shm"]) rmSync2(dbPath + suffix, { force: true });
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
    try {
      db?.close();
    } catch {
    }
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
    for (const l of lines.slice(h1 + 1)) {
      if (/^## /.test(l) || FENCE.test(l)) break;
      if (FULLY_BANNER.test(l)) {
        state = "superseded";
        break;
      }
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
    for (const path of known.keys()) if (!present.has(path)) {
      delRow.run(path);
      delFile.run(table, path);
    }
    for (const f of found) {
      const k = known.get(f.path);
      if (k && k.mtime_ms === f.mtime_ms && k.size === f.size) continue;
      const text = readFileSync(join2(root, f.path), "utf8");
      delRow.run(f.path);
      if (text.split(/\r?\n/, 1)[0] === DRAFT_MARKER) {
        delFile.run(table, f.path);
        continue;
      }
      insRow.run(...corpus.row(text, f));
      putFile.run(table, f.path, f.mtime_ms, f.size);
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
var tokens = (query2) => query2.split(/[^\p{L}\p{N}\p{Co}]+/u).filter((t) => t.length >= 2);
var quote = (t) => `"${t.replaceAll('"', '""')}"`;
var toMatch = (toks) => toks.map(quote).join(" OR ");
function representatives(db, toks) {
  const mem = new db.constructor(":memory:");
  try {
    mem.exec("CREATE VIRTUAL TABLE q USING fts5(t, tokenize = 'porter unicode61'); CREATE VIRTUAL TABLE qi USING fts5vocab(q, 'instance')");
    const ins = mem.prepare("INSERT INTO q (rowid, t) VALUES (?, ?)");
    toks.forEach((t, i) => ins.run(i + 1, t));
    const rep = /* @__PURE__ */ new Map();
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
     FROM ${table} WHERE ${table} MATCH ?`
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
  if (settings.warning) process2.stderr.write(`warning: ${settings.warning}
`);
  if (!settings.enabled) return /* @__PURE__ */ new Map();
  const repo = telemetryRepo(root) ?? `local/${basename(root)}`;
  const prefix = `${repo}/brainstorming/`;
  const result = readTelemetryBranch(root, { remote: settings.remote, prefix });
  if (result.warning) process2.stderr.write(`warning: ${result.warning}
`);
  return new Map(result.records.map(({ path, bytes }) => [path.slice(prefix.length), bytes]));
}
function telemetry(root, specPath, records) {
  const blank = { status: null, shipped_at: null, files: "" };
  const p = specPath.replace(/\.md$/, ".yaml");
  const bytes = records.get(p);
  if (bytes === void 0) return blank;
  let rec;
  try {
    rec = parseYaml(bytes);
  } catch {
    process2.stderr.write(`gauntlet-spec-index: warning: unreadable telemetry ${p}
`);
    return blank;
  }
  if (!rec || typeof rec !== "object" || Array.isArray(rec)) return blank;
  const mf = rec.derived?.modified_files;
  const files = Array.isArray(mf) ? mf.filter((f) => typeof f === "string" && existsSync(join2(root, f))).join(";") : "missing";
  return { status: rec.status ?? null, shipped_at: rec.shipped_at ?? null, files };
}
var cell = (v) => v === null || v === void 0 ? "" : String(v).replace(/\s+/g, " ").trim();
var filesCell = (v) => v.replace(/[\t\r\n]+/g, " ");
function docSnippet(r) {
  if (!r.hsnip.includes("")) return r.bsnip;
  const fragment = r.hsnip.split("\n").find((line) => line.includes("")).replace(/[\u0001\u0002]/g, "");
  return r.headings.split("\n").find((line) => line.includes(fragment));
}
var CORPORA = {
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
    }
  },
  docs: {
    table: "docs",
    columns: ["path", "title", "headings", "body"],
    strong: ["title", "headings"],
    weights: [0, 10, 3, 1],
    hasState: false,
    header: ["score", "path", "title", "snippet"],
    select: "path, title, headings, snippet(docs, 2, '', '', '', 12) AS hsnip, snippet(docs, 3, '', '', '...', 12) AS bsnip",
    discover: (root) => discoverDocs(root, includes(root)),
    row: (text, f) => {
      const x = extract(text, f.path);
      return [f.path, x.title, x.headings, text];
    },
    format: (root, r) => [r.score.toFixed(3), r.path, r.title, docSnippet(r)].map(cell)
  }
};
async function main() {
  if (!nodeOk()) die(`gauntlet-spec-index needs Node >=24.15.0 (found ${process2.versions.node})`);
  const { query: text, corpus: name, limit, exclude } = parseArgs(process2.argv.slice(2));
  const toks = tokens(text);
  if (!toks.length) usage();
  const root = repoRoot();
  const corpus = CORPORA[name];
  const db = await openDb(root);
  refresh(db, root, corpus);
  const { rows, n } = query(db, corpus, toks, { limit, exclude });
  const records = name === "specs" ? telemetryCorpus(root) : /* @__PURE__ */ new Map();
  const out = [corpus.header.join("	")];
  for (const r of rows) out.push(corpus.format(root, r, records).join("	"));
  process2.stdout.write(out.join("\n") + "\n");
  if (rows.length === 0 && n < MIN_CORPUS) {
    process2.stderr.write(`gauntlet-spec-index: ${name} corpus has ${n} documents - too small for the confidence rule; no rows returned
`);
  }
  db.close();
}
main().catch((e) => {
  if (e?.code === "ERR_SQLITE_ERROR") die(`gauntlet-spec-index: ${e.message}`);
  throw e;
});
