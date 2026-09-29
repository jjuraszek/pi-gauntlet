#!/usr/bin/env node

// src/bins/gauntlet-telemetry-seal.mjs
import { existsSync as existsSync2, readdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute as isAbsolute2, join as join2, relative as relative2 } from "node:path";
import process2 from "node:process";

// extensions/lib/gauntlet-settings.ts
import path from "node:path";
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
function patchBlockPath(headers) {
  const plus = headers.find((l) => l.startsWith("+++ b/"));
  if (plus) return plus.slice(6);
  const renameTo = headers.find((l) => l.startsWith("rename to "));
  if (renameTo) return renameTo.slice(10);
  const minus = headers.find((l) => l.startsWith("--- a/"));
  if (minus && headers.includes("+++ /dev/null")) return minus.slice(6);
  if (!headers[0].startsWith("diff --git a/")) return void 0;
  const rest = headers[0].slice("diff --git a/".length);
  const mid = (rest.length - 3) / 2;
  if (Number.isInteger(mid) && mid > 0 && rest.slice(mid, mid + 3) === " b/" && rest.slice(0, mid) === rest.slice(mid + 3)) return rest.slice(0, mid);
  return void 0;
}
function parsePatchBlock(block) {
  const hunk = block.findIndex((l) => l.startsWith("@@"));
  const headers = hunk < 0 ? block : block.slice(0, hunk);
  const path2 = patchBlockPath(headers);
  if (path2 === void 0) return void 0;
  let added = 0;
  let removed = 0;
  for (const line of hunk < 0 ? [] : block.slice(hunk)) {
    if (line.startsWith("+")) added++;
    else if (line.startsWith("-")) removed++;
  }
  return { added, removed, path: path2 };
}
function parsePatchNumstat(patch) {
  if (!patch.trim()) return [];
  const lines = patch.split("\n");
  if (!lines.find((l) => l.trim()).startsWith("diff --git ")) return null;
  const blocks = [];
  for (const line of lines) {
    if (line.startsWith("diff --git ")) blocks.push([line]);
    else if (blocks.length) blocks[blocks.length - 1].push(line);
  }
  const rows = [];
  for (const block of blocks) {
    const row = parsePatchBlock(block);
    if (!row) return null;
    rows.push(row);
  }
  return rows;
}

// extensions/lib/vcs.ts
import { spawnSync } from "node:child_process";

// extensions/lib/checkout.ts
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
var CHECKOUT_ARGS = ["rev-parse", "--path-format=absolute", "--show-toplevel", "--git-dir", "--git-common-dir"];
function parseCheckout(r) {
  if (r.code !== 0) return void 0;
  const lines = r.stdout.trim().split("\n").map((l) => l.trim());
  if (lines.length < 3 || !lines[0]) return void 0;
  return { toplevel: lines[0], isPrimary: lines[1] === lines[2] };
}
var isDir = (p) => {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
};
function nearestExistingDir(absPath) {
  let p = absPath;
  while (!(existsSync(p) && isDir(p))) {
    const parent = dirname(p);
    if (parent === p) return p;
    p = parent;
  }
  return p;
}
var JJ_ROOT_ARGS = ["root"];
function parseJjRoot(r) {
  if (r.code !== 0) return void 0;
  const toplevel = r.stdout.trim();
  if (!toplevel) return void 0;
  return { toplevel, isPrimary: isDir(join(toplevel, ".jj", "repo")) };
}
function checkoutOfSync(absPath, git = gitSync, jj = jjSync) {
  const cwd = nearestExistingDir(absPath);
  const g = parseCheckout(git(CHECKOUT_ARGS, cwd));
  if (g) return { ...g, via: "git" };
  const j = parseJjRoot(jj(JJ_ROOT_ARGS, cwd));
  return j ? { ...j, via: "jj" } : void 0;
}
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

// extensions/lib/telemetry-ship.ts
function modifiedFilesFrom(nameOnly, spec, dir, planDirs) {
  const dirPrefix = dir.replace(/\/+$/, "") + "/";
  const planRes = planDirs.map((d) => new RegExp(`(^|/)${d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`));
  return nameOnly.split("\n").filter((f) => f && f !== spec && !planRes.some((re) => re.test(f)) && !f.startsWith(dirPrefix)).sort();
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
var JJ_MAINLINE = "coalesce(trunk() ~ root(), present(main), present(master))";
var JJ_FORK_POINT = `fork_point(${JJ_MAINLINE} | @) ~ root() & ::${JJ_MAINLINE}`;
var firstLine = (s) => s.trim().split("\n")[0];
async function computeJjDiff(o) {
  const failed = (sub, r) => ({ warning: `diff omitted: jj ${sub} failed: ${firstLine(r.stderr) || "unknown error"}` });
  const baseR = await o.jj(["--color=never", "log", "-r", JJ_FORK_POINT, "--no-graph", "-T", 'commit_id ++ "\\n"'], o.cwd);
  if (baseR.code !== 0) return failed("log", baseR);
  const base = firstLine(baseR.stdout).trim();
  if (!base) return { warning: "diff omitted: jj mainline unresolved (trunk() is root(); no main/master bookmark)" };
  const patch = await o.jj(["--color=never", "--config", "diff.git.show-path-prefix=true", "diff", "--from", base, "--to", "@", "--git"], o.cwd);
  if (patch.code !== 0) return failed("diff", patch);
  const rows = parsePatchNumstat(patch.stdout);
  if (!rows) return { warning: "diff omitted: jj diff unparseable" };
  const dir = o.dir.replace(/\/+$/, "");
  const count = await o.jj(["--color=never", "log", "-r", `(${base}::@ ~ ${base}) & files(~glob:"${dir}/**")`, "--count"], o.cwd);
  if (count.code !== 0) return failed("log", count);
  const n = count.stdout.trim();
  if (!/^\d+$/.test(n)) return { warning: `diff omitted: jj log --count unparseable: ${n}` };
  const files = modifiedFilesFrom(rows.map((r) => r.path).join("\n"), o.spec, o.dir, o.planDirs);
  const numstat = rows.map((r) => `${r.added}	${r.removed}	${r.path}`).join("\n");
  return { modified_files: files, diff: { base, commits: Number(n), buckets: aggregateNumstat(numstat, new Set(files), o.buckets) } };
}
async function computeGitDiff(o) {
  const mb = await o.git(["merge-base", "HEAD", o.base], o.cwd);
  if (mb.code !== 0 || !mb.stdout.trim()) return { warning: `diff omitted: merge-base failed: ${firstLine(mb.stderr)}` };
  const base = mb.stdout.trim();
  const names = await o.git(["diff", "--name-only", `${base}...HEAD`], o.cwd);
  const files = modifiedFilesFrom(names.stdout, o.spec, o.dir, o.planDirs);
  const numstat = await o.git(["diff", "--numstat", `${base}...HEAD`], o.cwd);
  const count = await o.git(["rev-list", "--count", "--invert-grep", "--grep=^telemetry: ", `${base}..HEAD`], o.cwd);
  return { modified_files: files, diff: { base, commits: Number(count.stdout.trim()) || 0, buckets: aggregateNumstat(numstat.stdout, new Set(files), o.buckets) } };
}

// extensions/lib/vcs.ts
var NO_PROMPT_ENV = { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_EDITOR: "true" };
var runBinary = (bin) => (args, cwd, timeoutMs = 1e4) => {
  const r = spawnSync(bin, args, { cwd, encoding: "utf8", env: NO_PROMPT_ENV, timeout: timeoutMs });
  const err = r.error;
  const timedOut = err?.code === "ETIMEDOUT";
  const stderr = timedOut ? "timed out" : (r.stderr ?? "").trim().split("\n")[0] || err?.message || `${bin} exited ${r.status}`;
  return { ok: !timedOut && r.status === 0, code: timedOut ? 1 : r.status ?? 1, stdout: (r.stdout ?? "").trim(), stderr };
};
function vcsFor(absPath) {
  const co = checkoutOfSync(absPath);
  return co && { kind: co.via, root: co.toplevel, run: runBinary(co.via) };
}
async function computeShipDiff(vcs, o) {
  return vcs.kind === "jj" ? computeJjDiff({ jj: vcs.run, cwd: vcs.root, spec: o.spec, dir: o.dir, planDirs: o.planDirs, buckets: o.buckets }) : computeGitDiff({ git: vcs.run, cwd: vcs.root, spec: o.spec, dir: o.dir, planDirs: o.planDirs, buckets: o.buckets, base: o.base });
}
function validateBase(vcs, base) {
  const r = vcs.kind === "jj" ? vcs.run(["--color=never", "log", "-r", base, "--limit", "1", "--no-graph", "-T", 'commit_id ++ "\\n"'], vcs.root) : vcs.run(["rev-parse", "--verify", "-q", `${base}^{commit}`], vcs.root);
  return r.ok && r.stdout !== "";
}
function changedNames(vcs, base) {
  if (vcs.kind === "git") return vcs.run(["diff", "--no-renames", "--name-only", `${base}...HEAD`], vcs.root);
  const forkR = vcs.run(["--color=never", "log", "-r", JJ_FORK_POINT, "--no-graph", "-T", 'commit_id ++ "\\n"'], vcs.root);
  if (!forkR.ok) return forkR;
  const fork = forkR.stdout.split("\n")[0];
  if (!fork) return { ok: false, code: 1, stdout: "", stderr: "jj mainline unresolved (trunk() is root(); no main/master bookmark)" };
  return vcs.run(["--color=never", "diff", "--name-only", "--from", fork, "--to", "@"], vcs.root);
}
function recordSealed(vcs, rel) {
  if (vcs.kind === "jj") return true;
  return vcs.run(["ls-files", "--error-unmatch", "--", rel], vcs.root).ok && vcs.run(["diff", "--quiet", "HEAD", "--", rel], vcs.root).ok;
}
function commitRecordFile(vcs, rel, message) {
  if (vcs.kind === "jj") return void 0;
  const add = vcs.run(["add", "-f", "--", rel], vcs.root);
  const commit = add.ok ? vcs.run(["commit", "-q", "-m", message, "--", rel], vcs.root, 3e4) : add;
  if (!commit.ok) vcs.run(["reset", "-q", "--", rel], vcs.root);
  return commit;
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
  return compact({ duration_s: seconds(rec.created_at, rec.shipped_at ?? rec.abandoned_at ?? now), phases, personas: acc.personas, reviews: Object.keys(acc.reviews).length ? acc.reviews : void 0, conformance_loops: acc.conformance_loops, conformance_open_gaps: acc.conformance_open_gaps, gates: compact({ ...acc.gates, ship_option: live?.option }), plan: rec.derived.plan, tests: rec.derived.tests, amendments: acc.amendments, spec_edits_after_ship: acc.spec_edits_after_ship, diff: rec.derived.diff, modified_files: rec.derived.modified_files, council: rec.derived.council, spec_writes: acc.spec_writes, events_dropped: acc.events_dropped });
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
  if (isMap(derivedNode)) {
    flowLeafChildren(derivedNode, /* @__PURE__ */ new Set(["modified_files", "council"]));
    const council = derivedNode.get("council", true);
    if (isMap(council)) flowLeafChildren(council);
  }
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
var OPTIONS = /* @__PURE__ */ new Set(["pr", "squash"]);
var fail = (code, message) => {
  process2.stderr.write(message + "\n");
  process2.exit(code);
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
function readLayer(file) {
  if (!existsSync2(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    process2.stderr.write(`warning: ${file}: ${e.message}; using {} for this layer
`);
    return {};
  }
}
function settings(root) {
  const agentDir = process2.env.PI_CODING_AGENT_DIR || join2(homedir(), ".pi", "agent");
  const preset = readLayer(join2(agentDir, "settings.json"));
  const repo = readLayer(join2(root, ".pi", "settings.json"));
  const merged = mergeGauntlet(preset?.piGauntlet, repo?.piGauntlet);
  return { telemetry: resolveTelemetry(merged), planDirs: planDirsFor(resolveFlowGuards(merged).specDirs) };
}
function walkRecords(absDir) {
  if (!existsSync2(absDir)) return [];
  const out = [];
  for (const e of readdirSync(absDir, { withFileTypes: true })) {
    const p = join2(absDir, e.name);
    if (e.isDirectory()) out.push(...walkRecords(p));
    else if (e.isFile() && e.name.endsWith(".yaml")) out.push(p);
  }
  return out;
}
var isoNow = () => (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d{3}Z$/, "Z");
async function seal(vcs, rec, o) {
  const abs = join2(vcs.root, rec);
  if (!existsSync2(abs)) fail(2, `no record at ${rec}`);
  const prior = readFileSync(abs);
  const parsed = parseRecord(prior.toString("utf8"));
  if (!parsed) fail(2, `unparseable record ${rec}: schema 1 with spec and run_id required`);
  if (parsed.status !== "in_progress") {
    if (parsed.status !== "shipped" || recordSealed(vcs, rec)) return console.log(`already sealed ${rec}`);
  } else {
    const now = isoNow();
    parsed.status = "shipped";
    parsed.shipped_at = now;
    parsed.events.push({ ts: now, session: parsed.sessions.at(-1) ?? "seal", phase: "ship", kind: "ship", option: o.option });
    const out = await computeShipDiff(vcs, { spec: parsed.spec, dir: o.dir, buckets: o.buckets, base: o.base, planDirs: o.planDirs });
    if (out.warning) parsed.events.push({ ts: now, session: parsed.sessions.at(-1) ?? "seal", phase: "ship", kind: "warning", message: out.warning });
    parsed.derived.diff = out.diff;
    parsed.derived.modified_files = out.modified_files;
    parsed.derived = derive(parsed, now);
    writeFileSync(abs, serializeRecord(parsed));
  }
  const commit = commitRecordFile(vcs, rec, `telemetry: ${parsed.spec}`);
  if (commit && !commit.ok) {
    writeFileSync(abs, prior);
    fail(1, `seal failed ${rec}: ${commit.stderr}`);
  }
  console.log(`sealed ${rec}`);
}
async function main() {
  const opts = parseArgs(process2.argv.slice(2));
  const override = opts.dir === void 0 ? void 0 : resolveTelemetry({ telemetry: { enabled: true, dir: opts.dir } });
  if (override?.warning) usage();
  const vcs = existsSync2(opts.worktree) ? vcsFor(opts.worktree) : void 0;
  if (!vcs) fail(1, "not a git or jj checkout");
  const root = vcs.root;
  let rel;
  if (opts.spec) {
    const specAbs = isAbsolute2(opts.spec) && existsSync2(opts.spec) ? realpathSync(opts.spec) : opts.spec;
    rel = repoRelativeToolPath(root, root, specAbs);
    if (!rel) usage();
  }
  const { telemetry, planDirs } = settings(root);
  if (telemetry.warning) process2.stderr.write(`warning: ${telemetry.warning}
`);
  if (!telemetry.enabled) return console.log("telemetry disabled");
  const dir = override?.dir ?? telemetry.dir;
  if (!validateBase(vcs, opts.base)) fail(1, `no base ref ${opts.base}`);
  const o = { option: opts.option, base: opts.base, dir, buckets: telemetry.buckets, planDirs };
  if (opts.spec) return seal(vcs, recordPathFor(dir, rel), o);
  const diff = changedNames(vcs, opts.base);
  if (!diff.ok) fail(1, `${vcs.kind} diff failed: ${diff.stderr}`);
  const changed = new Set(diff.stdout.split("\n").filter(Boolean));
  const records = walkRecords(join2(root, dir)).filter((abs) => {
    const parsed = parseRecord(readFileSync(abs, "utf8"));
    if (!parsed) process2.stderr.write(`warning: unparseable record ${toPosix(relative2(root, abs))}
`);
    return parsed && changed.has(parsed.spec);
  }).map((abs) => toPosix(relative2(root, abs))).sort();
  if (records.length === 0) return console.log("no telemetry run");
  for (const rec of records) await seal(vcs, rec, o);
}
await main();
