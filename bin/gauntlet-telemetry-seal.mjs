#!/usr/bin/env node

// src/bins/gauntlet-telemetry-seal.mjs
import { existsSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute as isAbsolute2, join } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

// extensions/lib/gauntlet-settings.ts
import path from "node:path";
function mergeGauntlet(preset, repo) {
  return { ...preset ?? {}, ...repo ?? {} };
}
var nonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
var joinWarn = (ws) => ws.length ? ws.join("; ") : void 0;
var DEFAULT_TELEMETRY_DIR = ".pi/gauntlet/telemetry";
var DEFAULT_TELEMETRY_BUCKETS = [
  ["test", ["**/test/**", "**/tests/**", "**/__tests__/**", "**/*.test.*", "**/*.spec.*", "**/*_test.*"]],
  ["docs", ["**/*.md"]],
  ["config", ["**/*.json", "**/*.yaml", "**/*.yml", "**/*.toml", "**/*.lock", "**/*-lock.*"]]
];
function resolveTelemetry(g) {
  const t = g.telemetry;
  const warnings = [];
  const enabled = t?.enabled !== false;
  let dir = DEFAULT_TELEMETRY_DIR;
  if (t?.dir !== void 0) {
    const value = nonEmptyString(t.dir) ? t.dir.trim().replace(/\/+$/, "") : "";
    const canonical = value.replace(/\\/g, "/");
    const normalized = path.posix.normalize(canonical);
    if (value && path.win32.parse(canonical).root === "" && normalized !== ".." && !normalized.startsWith("../")) dir = normalized;
    else warnings.push("telemetry.dir must be a non-empty path relative to the git toplevel; using the default");
  }
  let buckets = DEFAULT_TELEMETRY_BUCKETS;
  if (t?.buckets !== void 0) {
    const b = t.buckets;
    const valid = b !== null && typeof b === "object" && !Array.isArray(b) && Object.keys(b).length > 0 && Object.values(b).every((v) => Array.isArray(v) && v.length > 0 && v.every(nonEmptyString));
    if (valid) buckets = Object.entries(b).map(([name, globs]) => [name, [...globs]]);
    else warnings.push("telemetry.buckets is not an object of non-empty glob arrays; using the defaults");
  }
  return { enabled, dir, buckets, warning: joinWarn(warnings) };
}

// extensions/lib/telemetry-paths.ts
import { isAbsolute, matchesGlob, relative, resolve } from "node:path";

// extensions/lib/phase-tracker-helpers.ts
var STMT_START = "(?:^|[\\n;&|(])\\s*";

// extensions/lib/telemetry-paths.ts
var toPosix = (p) => p.split("\\").join("/");
var isSpecPath = (rel) => /(^|\/)doc\/specs\/[^/]+\.md$/.test(rel);
var recordPathFor = (dir, specRel) => `${dir}/${specRel.replace(/\.md$/, ".yaml")}`;
function repoRelativeToolPath(toplevel, cwd, p) {
  const abs = isAbsolute(p) ? p : resolve(cwd, p);
  const rel = toPosix(relative(toplevel, abs));
  if (rel === "" || rel.startsWith("../") || rel === ".." || isAbsolute(rel)) return void 0;
  return rel;
}
var GIT_FLAGS = "git\\s+(?:-\\S+(?:\\s+\\S+)?\\s+)*";
var SHIP_RE = new RegExp(STMT_START + "(" + GIT_FLAGS + "(?:merge\\s+--squash|push)(?=\\s|$)|gh\\s+pr\\s+create)");
var SQUASH_RE = new RegExp("^" + GIT_FLAGS + "merge\\s+--squash");
function classifyBucket(rel, buckets) {
  for (const [name, globs] of buckets) if (globs.some((g) => matchesGlob(rel, g))) return name;
  return "code";
}
function numstatPath(raw) {
  const braced = raw.replace(/\{([^{}]*) => ([^{}]*)\}/g, (_m, _a, b) => b).replace(/\/\//g, "/");
  const arrow = braced.indexOf(" => ");
  return arrow >= 0 ? braced.slice(arrow + 4) : braced;
}

// extensions/lib/telemetry-ship.ts
function modifiedFilesFrom(nameOnly, spec, dir) {
  const dirPrefix = dir.replace(/\/+$/, "") + "/";
  return nameOnly.split("\n").filter((f) => f && f !== spec && !/(^|\/)doc\/plans\//.test(f) && !f.startsWith(dirPrefix)).sort();
}

// extensions/lib/telemetry-diff.ts
function aggregateNumstat(numstat, files, buckets) {
  const out = {};
  for (const line of numstat.split("\n")) {
    if (!line.trim()) continue;
    const [ins, del, ...rest] = line.split("	");
    const path2 = numstatPath(rest.join("	"));
    if (!files.has(path2)) continue;
    const bucket = classifyBucket(path2, buckets);
    const stat = out[bucket] ??= { files: 0, insertions: 0, deletions: 0 };
    stat.files += 1;
    stat.insertions += ins === "-" ? 0 : Number(ins) || 0;
    stat.deletions += del === "-" ? 0 : Number(del) || 0;
  }
  return out;
}
var firstLine = (s) => s.trim().split("\n")[0];
async function computeGitDiff(o) {
  const mb = await o.git(["merge-base", "HEAD", o.base], o.cwd);
  if (mb.code !== 0 || !mb.stdout.trim()) return { warning: `diff omitted: merge-base failed: ${firstLine(mb.stderr)}` };
  const base = mb.stdout.trim();
  const names = await o.git(["diff", "--name-only", `${base}...HEAD`], o.cwd);
  const files = modifiedFilesFrom(names.stdout, o.spec, o.dir);
  const numstat = await o.git(["diff", "--numstat", `${base}...HEAD`], o.cwd);
  const count = await o.git(["rev-list", "--count", "--invert-grep", "--grep=^telemetry: ", `${base}..HEAD`], o.cwd);
  return { modified_files: files, diff: { base, commits: Number(count.stdout.trim()) || 0, buckets: aggregateNumstat(numstat.stdout, new Set(files), o.buckets) } };
}

// extensions/lib/telemetry-record.ts
import { Document, isCollection, isMap, isSeq, parse as parseYaml, stringify as stringifyYaml } from "yaml";
var PHASES = ["brainstorm", "plan", "implement", "verify", "ship"];
var emptyAccumulators = () => ({ phases: {}, personas: {}, reviews: {}, spec_writes: {}, gates: { spec_rounds: 0, plan_rounds: 0, fix_round_grants: 0, task_reopens: 0 }, conformance_loops: 0, amendments: 0, spec_edits_after_ship: 0, events_dropped: 0 });
var addTokens = (a, b) => ({ input: (a?.input ?? 0) + b.input, output: (a?.output ?? 0) + b.output, cache_read: (a?.cache_read ?? 0) + b.cache_read, cache_write: (a?.cache_write ?? 0) + b.cache_write, cost: (a?.cost ?? 0) + b.cost });
var optSum = (a, b) => a === void 0 && b === void 0 ? void 0 : (a ?? 0) + (b ?? 0);
var optMax = (a, b) => a === void 0 ? b : b === void 0 ? a : Math.max(a, b);
var compact = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== void 0));
function foldAccumulators(a, b) {
  const out = emptyAccumulators();
  for (const k of /* @__PURE__ */ new Set([...Object.keys(a.phases), ...Object.keys(b.phases)])) {
    const x = a.phases[k] ?? {}, y = b.phases[k] ?? {};
    out.phases[k] = compact({ tokens: x.tokens && y.tokens ? addTokens(x.tokens, y.tokens) : x.tokens ?? y.tokens, compactions: optSum(x.compactions, y.compactions), user_messages: optSum(x.user_messages, y.user_messages), peak_context: optMax(x.peak_context, y.peak_context) });
  }
  for (const k of /* @__PURE__ */ new Set([...Object.keys(a.personas), ...Object.keys(b.personas)])) {
    const x = a.personas[k], y = b.personas[k];
    out.personas[k] = compact({ dispatches: (x?.dispatches ?? 0) + (y?.dispatches ?? 0), models: [.../* @__PURE__ */ new Set([...x?.models ?? [], ...y?.models ?? []])], tokens: x?.tokens && y?.tokens ? addTokens(x.tokens, y.tokens) : x?.tokens ?? y?.tokens });
  }
  for (const k of /* @__PURE__ */ new Set([...Object.keys(a.reviews), ...Object.keys(b.reviews)])) {
    const x = a.reviews[k], y = b.reviews[k];
    const findings = x?.findings || y?.findings ? { blocker: (x?.findings?.blocker ?? 0) + (y?.findings?.blocker ?? 0), major: (x?.findings?.major ?? 0) + (y?.findings?.major ?? 0), minor: (x?.findings?.minor ?? 0) + (y?.findings?.minor ?? 0) } : void 0;
    out.reviews[k] = compact({ dispatches: (x?.dispatches ?? 0) + (y?.dispatches ?? 0), nonzero_exit: (x?.nonzero_exit ?? 0) + (y?.nonzero_exit ?? 0), findings });
  }
  for (const k of /* @__PURE__ */ new Set([...Object.keys(a.spec_writes), ...Object.keys(b.spec_writes)])) {
    const x = a.spec_writes[k], y = b.spec_writes[k];
    out.spec_writes[k] = { count: (x?.count ?? 0) + (y?.count ?? 0), last_sha256: y?.last_sha256 ?? x?.last_sha256 ?? "" };
  }
  for (const g of Object.keys(out.gates)) out.gates[g] = a.gates[g] + b.gates[g];
  out.conformance_loops = a.conformance_loops + b.conformance_loops;
  out.conformance_open_gaps = b.conformance_open_gaps ?? a.conformance_open_gaps;
  out.amendments = a.amendments + b.amendments;
  out.spec_edits_after_ship = a.spec_edits_after_ship + b.spec_edits_after_ship;
  out.events_dropped = a.events_dropped + b.events_dropped;
  return out;
}
function newRecord(o) {
  return { schema: 1, spec: o.spec, run_id: o.runId, branch: o.branch, status: "in_progress", created_at: o.now, sessions: [o.session], derived: { duration_s: 0, phases: {}, personas: {}, conformance_loops: 0, gates: { spec_rounds: 0, plan_rounds: 0, fix_round_grants: 0, task_reopens: 0 }, amendments: 0, spec_edits_after_ship: 0, spec_writes: {}, events_dropped: 0 }, accumulators: {}, events: [] };
}
var totalAccumulators = (rec) => Object.values(rec.accumulators).reduce((acc, block) => foldAccumulators(acc, block), emptyAccumulators());
var seconds = (a, b) => Math.max(0, Math.round((Date.parse(b) - Date.parse(a)) / 1e3));
function liveShipEvent(events) {
  let live;
  for (const e of events) {
    if (e.kind === "ship") live = e;
    else if (e.kind === "ship_failed") live = void 0;
  }
  return live;
}
function derive(rec, now) {
  const acc = totalAccumulators(rec), phases = {};
  for (const e of rec.events) {
    if (e.kind !== "phase") continue;
    if (e.action === "reset") {
      for (const p of PHASES) if (phases[p]) phases[p] = compact({ ...phases[p], started_at: void 0, completed_at: void 0, duration_s: void 0, model: void 0, thinking: void 0 });
      continue;
    }
    if (!e.name) continue;
    const cur = phases[e.name] ?? {};
    if (e.action === "start") phases[e.name] = compact({ ...cur, started_at: e.ts, completed_at: void 0, duration_s: void 0, model: e.model, thinking: e.thinking });
    else if (cur.started_at) phases[e.name] = { ...cur, completed_at: e.ts, duration_s: seconds(cur.started_at, e.ts) };
  }
  for (const k of Object.keys(acc.phases)) phases[k] = compact({ ...phases[k] ?? {}, ...acc.phases[k] });
  const live = liveShipEvent(rec.events);
  return compact({ duration_s: seconds(rec.created_at, rec.shipped_at ?? rec.abandoned_at ?? now), phases, personas: acc.personas, reviews: Object.keys(acc.reviews).length ? acc.reviews : void 0, conformance_loops: acc.conformance_loops, conformance_open_gaps: acc.conformance_open_gaps, gates: compact({ ...acc.gates, ship_option: live?.option }), plan: rec.derived.plan, tests: rec.derived.tests, amendments: acc.amendments, spec_edits_after_ship: acc.spec_edits_after_ship, diff: rec.derived.diff, modified_files: rec.derived.modified_files, spec_writes: acc.spec_writes, events_dropped: acc.events_dropped });
}
var stripUndefined = (v) => {
  if (Array.isArray(v)) return v.map(stripUndefined);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).filter(([, x]) => x !== void 0).map(([k, x]) => [k, stripUndefined(x)]));
  return v;
};
var flowLeafChildren = (map, blockLists = /* @__PURE__ */ new Set()) => {
  for (const pair of map.items) {
    const key = String(pair.key);
    const child = pair.value;
    if (!isCollection(child) || blockLists.has(key)) continue;
    if (isMap(child) && child.items.length > 0 && child.items.every((item) => isMap(item.value))) {
      for (const item of child.items) if (isCollection(item.value)) item.value.flow = true;
    } else {
      child.flow = true;
    }
  }
};
var flowModelLists = (node) => {
  if (isMap(node)) {
    for (const pair of node.items) {
      if (String(pair.key) === "models" && isSeq(pair.value)) pair.value.flow = true;
      flowModelLists(pair.value);
    }
  } else if (isSeq(node)) {
    for (const item of node.items) flowModelLists(item);
  }
};
function serializeRecord(rec) {
  const { derived, accumulators, events, ...head } = rec;
  const body = stripUndefined({ ...head, derived, accumulators });
  const doc = new Document(body);
  const derivedNode = doc.get("derived", true);
  if (isMap(derivedNode)) flowLeafChildren(derivedNode, /* @__PURE__ */ new Set(["modified_files"]));
  const accumulatorNode = doc.get("accumulators", true);
  if (isMap(accumulatorNode)) {
    for (const session of accumulatorNode.items) if (isMap(session.value)) flowLeafChildren(session.value);
  }
  flowModelLists(doc.contents);
  const bodyText = doc.toString({ lineWidth: 0 });
  const eventLines = events.map((e) => "  - " + stringifyYaml(stripUndefined(e), { collectionStyle: "flow", lineWidth: 0 }).trim());
  return bodyText + "events:\n" + (eventLines.length ? eventLines.join("\n") + "\n" : "");
}
function parseRecord(text) {
  let doc;
  try {
    doc = parseYaml(text);
  } catch {
    return void 0;
  }
  if (!doc || typeof doc !== "object") return void 0;
  const d = doc;
  if (d.schema !== 1 || typeof d.spec !== "string" || typeof d.run_id !== "string") return void 0;
  const accumulators = Object.fromEntries(Object.entries(d.accumulators ?? {}).flatMap(
    ([session, block]) => block && typeof block === "object" && !Array.isArray(block) ? [[session, { ...emptyAccumulators(), ...block }]] : []
  ));
  return { ...d, sessions: Array.isArray(d.sessions) ? d.sessions : [], derived: d.derived ?? newRecord({ spec: d.spec, session: "", now: d.created_at ?? "", runId: d.run_id }).derived, accumulators, events: Array.isArray(d.events) ? d.events : [] };
}

// src/bins/gauntlet-telemetry-seal.mjs
var GIT_TIMEOUT_MS = 1e4;
var COMMIT_TIMEOUT_MS = 3e4;
var GIT_ENV = { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_EDITOR: "true" };
var OPTIONS = /* @__PURE__ */ new Set(["pr", "squash"]);
var fail = (code, message) => {
  process.stderr.write(message + "\n");
  process.exit(code);
};
var usage = () => fail(1, "usage: gauntlet-telemetry-seal --worktree <abs path> --option <pr|squash> --base <ref> [--spec <spec path inside the checkout>] [--dir <telemetry dir>]");
function parseArgs(argv) {
  const opts = { worktree: void 0, option: void 0, base: void 0, spec: void 0, dir: void 0 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const value = argv[i + 1];
    const takes = (key) => {
      if (value === void 0 || value.startsWith("--")) usage();
      opts[key] = argv[++i];
    };
    if (a === "--worktree") takes("worktree");
    else if (a === "--option") takes("option");
    else if (a === "--base") takes("base");
    else if (a === "--spec") takes("spec");
    else if (a === "--dir") takes("dir");
    else usage();
  }
  if (!opts.worktree || !isAbsolute2(opts.worktree) || !opts.base || !OPTIONS.has(opts.option)) usage();
  return opts;
}
function git(cwd, args, timeout = GIT_TIMEOUT_MS) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", env: GIT_ENV, timeout });
  const timedOut = r.error?.code === "ETIMEDOUT";
  const stderr = timedOut ? "timed out" : (r.stderr ?? "").trim().split("\n")[0] || r.error?.message || `git exited ${r.status}`;
  return { ok: !timedOut && r.status === 0, code: timedOut ? 1 : r.status ?? 1, stdout: (r.stdout ?? "").trim(), stderr };
}
var gitRunner = (args, cwd) => {
  const r = git(cwd, args);
  return { code: r.code, stdout: r.stdout, stderr: r.stderr };
};
function readLayer(file) {
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    process.stderr.write(`warning: ${file}: ${e.message}; using {} for this layer
`);
    return {};
  }
}
function telemetrySettings(root) {
  const agentDir = process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
  const preset = readLayer(join(agentDir, "settings.json"));
  const repo = readLayer(join(root, ".pi", "settings.json"));
  return resolveTelemetry(mergeGauntlet(preset?.piGauntlet, repo?.piGauntlet));
}
var isoNow = () => (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d{3}Z$/, "Z");
var trackedAndClean = (root, rec) => git(root, ["ls-files", "--error-unmatch", "--", rec]).ok && git(root, ["diff", "--quiet", "HEAD", "--", rec]).ok;
async function seal(root, rec, o) {
  const abs = join(root, rec);
  if (!existsSync(abs)) fail(2, `no record at ${rec}`);
  const prior = readFileSync(abs);
  const parsed = parseRecord(prior.toString("utf8"));
  if (!parsed) fail(2, `unparseable record ${rec}: schema 1 with spec and run_id required`);
  if (parsed.status !== "in_progress") {
    if (parsed.status !== "shipped" || trackedAndClean(root, rec)) return console.log(`already sealed ${rec}`);
  } else {
    const now = isoNow();
    parsed.status = "shipped";
    parsed.shipped_at = now;
    parsed.events.push({ ts: now, session: parsed.sessions.at(-1) ?? "seal", phase: "ship", kind: "ship", option: o.option });
    const out = await computeGitDiff({ git: gitRunner, cwd: root, spec: parsed.spec, dir: o.dir, buckets: o.buckets, base: o.base });
    if (out.warning) parsed.events.push({ ts: now, session: parsed.sessions.at(-1) ?? "seal", phase: "ship", kind: "warning", message: out.warning });
    parsed.derived.diff = out.diff;
    parsed.derived.modified_files = out.modified_files;
    parsed.derived = derive(parsed, now);
    writeFileSync(abs, serializeRecord(parsed));
  }
  const rollback = (reason) => {
    writeFileSync(abs, prior);
    git(root, ["reset", "-q", "--", rec]);
    fail(1, `seal failed ${rec}: ${reason}`);
  };
  const add = git(root, ["add", "-f", "--", rec]);
  if (!add.ok) rollback(add.stderr);
  const commit = git(root, ["commit", "-q", "-m", `telemetry: ${parsed.spec}`, "--", rec], COMMIT_TIMEOUT_MS);
  if (!commit.ok) rollback(commit.stderr);
  console.log(`sealed ${rec}`);
}
async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const override = opts.dir === void 0 ? void 0 : resolveTelemetry({ telemetry: { enabled: true, dir: opts.dir } });
  if (override?.warning) usage();
  const top = existsSync(opts.worktree) ? git(opts.worktree, ["rev-parse", "--show-toplevel"]) : { ok: false };
  if (!top.ok) fail(1, "not a git checkout");
  const root = top.stdout;
  let rel;
  if (opts.spec) {
    const specAbs = isAbsolute2(opts.spec) && existsSync(opts.spec) ? realpathSync(opts.spec) : opts.spec;
    rel = repoRelativeToolPath(root, root, specAbs);
    if (!rel || !isSpecPath(rel)) usage();
  }
  const telemetry = telemetrySettings(root);
  if (telemetry.warning) process.stderr.write(`warning: ${telemetry.warning}
`);
  if (!telemetry.enabled) return console.log("telemetry disabled");
  const dir = override?.dir ?? telemetry.dir;
  if (!git(root, ["rev-parse", "--verify", "-q", `${opts.base}^{commit}`]).ok) fail(1, `no base ref ${opts.base}`);
  const o = { option: opts.option, base: opts.base, dir, buckets: telemetry.buckets };
  if (opts.spec) return seal(root, recordPathFor(dir, rel), o);
  const diff = git(root, ["diff", "--name-only", `${opts.base}...HEAD`]);
  if (!diff.ok) fail(1, `git diff failed: ${diff.stderr}`);
  const records = diff.stdout.split("\n").filter((f) => f && isSpecPath(f)).map((f) => recordPathFor(dir, f)).filter((rec) => existsSync(join(root, rec)));
  if (records.length === 0) return console.log("no telemetry run");
  for (const rec of records) await seal(root, rec, o);
}
await main();
