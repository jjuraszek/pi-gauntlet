#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/bins/gauntlet-performance.mjs
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join as join2, resolve } from "node:path";
import { spawnSync as spawnSync2 } from "node:child_process";
import process2 from "node:process";
import { parse as parseYaml } from "yaml";

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
  const remote = nonEmptyString(t?.remote) ? t.remote.trim() : void 0;
  if (t?.remote !== void 0 && !remote) warnings.push("telemetry.remote must be a non-empty URL; using origin");
  return { enabled, dir, ...remote ? { remote } : {}, buckets, warning: joinWarn(warnings) };
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
  const git = (args, input) => {
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
  const resolve2 = (ref) => {
    const result = gitRun(["rev-parse", "--verify", ref], root);
    return result.ok ? result.stdout : void 0;
  };
  const commit = (tree, parent, message) => git(["-c", "commit.gpgsign=false", "commit-tree", tree, ...parent ? ["-p", parent] : [], "-m", message]);
  let committed = false;
  try {
    let tip = resolve2(TELEMETRY_REF);
    committed = !!tip;
    fetch();
    let upstream = resolve2(tracking);
    if (records.size) {
      const parent = tip ?? upstream;
      git(parent ? ["read-tree", parent] : ["read-tree", "--empty"]);
      for (const [path2, content] of records) {
        const blob = git(["hash-object", "-w", "--stdin"], content);
        git(["update-index", "--add", "--cacheinfo", "100644", blob, path2]);
      }
      const tree = git(["write-tree"]);
      const next = parent && git(["rev-parse", `${parent}^{tree}`]) === tree ? parent : commit(tree, parent, "telemetry: update records");
      git(["update-ref", TELEMETRY_REF, next, tip ?? ""]);
      tip = next;
      committed = true;
    }
    const pending = () => tip ? git(["rev-list", "--reverse", "--topo-order", tip, ...upstream ? [`^${upstream}`] : []]).split("\n").filter(Boolean) : [];
    if (!pending().length) return { ok: true, committed, pushed: false, warning: fetchWarning };
    const push = () => gitRun(["push", remote, `${TELEMETRY_REF}:${TELEMETRY_REF}`], root);
    const first = push();
    if (first.ok) return { ok: true, committed, pushed: true, warning: fetchWarning };
    const fetched = fetch();
    if (!fetched.ok) throw new Error(`${first.stderr}; refresh failed: ${fetched.stderr}`);
    upstream = resolve2(tracking);
    let replayed = upstream;
    for (const sha of pending()) {
      git(replayed ? ["read-tree", replayed] : ["read-tree", "--empty"]);
      const changes = git(["diff-tree", "--root", "--no-commit-id", "--raw", "--no-abbrev", "--no-renames", "-r", "-z", sha]).split("\0");
      for (let i = 0; i + 1 < changes.length; i += 2) {
        const [, mode, , blob] = changes[i].split(" ");
        const path2 = changes[i + 1];
        git(mode === "000000" ? ["update-index", "--force-remove", "--", path2] : ["update-index", "--add", "--cacheinfo", mode, blob, path2]);
      }
      replayed = commit(git(["write-tree"]), replayed, git(["log", "-1", "--format=%B", sha]));
    }
    if (replayed) git(["update-ref", TELEMETRY_REF, replayed, tip]);
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
      const [meta, path2] = entry.split("	");
      const [, type, sha] = meta.split(" ");
      if (type !== "blob" || !path2.startsWith(prefix) || !path2.endsWith(".yaml")) continue;
      const blob = gitRun(["cat-file", "blob", sha], root, void 0, { raw: true });
      if (!blob.ok) throw new Error(blob.stderr);
      records.push({ path: path2, bytes: blob.stdout });
    }
    return { records, warning };
  } catch (error) {
    return { records, warning: [warning, `read failed: ${error.message}`].filter(Boolean).join("; ") };
  }
}

// src/bins/performance/shared.mjs
var PHASES = ["brainstorm", "plan", "implement", "verify", "ship"];
var TOKEN_KEYS = ["input", "output", "cache_read", "cache_write"];
var BIG_CACHE_WRITE = 5e4;
var semver = (s) => {
  const m = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(typeof s === "string" ? s.trim() : "");
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : void 0;
};
var cmpSemver = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
var num = (v) => typeof v === "number" && Number.isFinite(v) ? v : null;
var str = (v) => typeof v === "string" ? v : null;
var obj = (v) => v && typeof v === "object" && !Array.isArray(v) ? v : null;
var sumOrNull = (vals) => {
  const xs = vals.filter((v) => v !== null);
  return xs.length ? xs.reduce((a, b) => a + b, 0) : null;
};
var p50 = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
var stat = (rows, pick) => {
  const xs = rows.map(pick).filter((v) => v !== null && v !== void 0);
  return xs.length ? { p50: p50(xs), max: Math.max(...xs) } : { p50: null, max: null };
};
var dash = (v) => v === null || v === void 0 ? "-" : String(v);
var fmtMin = (s) => s === null ? "-" : `${Math.round(s / 60)}m`;
var fmtCount = (n) => n === null ? "-" : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n);
var fmtCost = (c) => c === null ? "-" : c.toFixed(2);
var pair = (s, f) => `${f(s.p50)}/${f(s.max)}`;
var findingsCell = (f) => f === null ? "-" : `${dash(f.blocker)}/${dash(f.major)}/${dash(f.minor)}`;
var table = (header, rows) => {
  const w = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  return [header, ...rows].map((r) => r.map((c, i) => c.padEnd(w[i])).join("  ").trimEnd()).join("\n");
};

// src/bins/performance/runs.mjs
var runs_exports = {};
__export(runs_exports, {
  aggregate: () => aggregate,
  key: () => key,
  renderText: () => renderText
});
var key = "runs";
var HEADER = ["run_id", "repo", "spec", "version", "status", "engine", "iterations", "wall", "b/p/i/v/s min", "tokens", "cost", "models", "disp", "disp/task", "coord", "grants", "reopens", "loops", "findings", "council", "big"];
var runRow = (r) => [
  r.run_id.slice(0, 8),
  r.repo,
  r.spec,
  r.version,
  `${dash(r.status)}${r.truncated ? "*" : ""}`,
  r.engine,
  r.iterations === null ? "" : String(r.iterations),
  fmtMin(r.wall_s),
  PHASES.map((p) => r.phase_min[p] === null ? "-" : String(Math.round(r.phase_min[p]))).join("/"),
  fmtCount(r.tokens),
  fmtCost(r.cost),
  r.models.join(",") || "-",
  dash(r.dispatches),
  r.dispatches_per_task === null ? "n/a" : r.dispatches_per_task.toFixed(2),
  r.coordinated ? "yes" : "no",
  dash(r.grants),
  dash(r.reopens),
  dash(r.loops),
  findingsCell(r.findings),
  dash(r.council),
  r.big_calls === null ? dash(null) : `${r.big_calls}/${r.big_write_share === null ? "-" : `${Math.round(r.big_write_share * 100)}%`}`
];
var aggregate = (entries) => entries.map((e) => e.row);
var renderText = (rows) => [`runs (${rows.length})`, table(HEADER, rows.map(runRow))].join("\n");

// src/bins/performance/versions.mjs
var versions_exports = {};
__export(versions_exports, {
  aggregate: () => aggregate2,
  key: () => key2,
  renderText: () => renderText2
});
var key2 = "by_version";
var HEADER2 = ["version", "n", "shipped", "truncated", "wall p50/max", "tokens p50/max", "cost p50/max", "disp p50", "grants p50/max", "reopens p50/max", "loops p50/max", "findings p50 b/M/m", "models"];
var versionOrder = (a, b) => {
  const x = semver(a), y = semver(b);
  return x && y ? cmpSemver(x, y) : x ? -1 : y ? 1 : 0;
};
function aggregate2(entries) {
  const rows = entries.map((e) => e.row);
  const groups = /* @__PURE__ */ new Map();
  for (const r of rows) {
    if (!groups.has(r.version)) groups.set(r.version, []);
    groups.get(r.version).push(r);
  }
  return [...groups.entries()].sort(([a], [b]) => versionOrder(a, b)).map(([version, all]) => {
    const shipped = all.filter((r) => r.status === "shipped" && !r.truncated);
    const models = {};
    for (const r of shipped) for (const m of r.models) models[m] = (models[m] ?? 0) + 1;
    return {
      version,
      n: all.length,
      shipped: shipped.length,
      truncated: all.filter((r) => r.truncated).length,
      wall_s: stat(shipped, (r) => r.wall_s),
      tokens: stat(shipped, (r) => r.tokens),
      cost: stat(shipped, (r) => r.cost),
      dispatches: { p50: stat(shipped, (r) => r.dispatches).p50 },
      grants: stat(shipped, (r) => r.grants),
      reopens: stat(shipped, (r) => r.reopens),
      loops: stat(shipped, (r) => r.loops),
      findings: {
        blocker: { p50: stat(shipped, (r) => r.findings?.blocker ?? null).p50 },
        major: { p50: stat(shipped, (r) => r.findings?.major ?? null).p50 },
        minor: { p50: stat(shipped, (r) => r.findings?.minor ?? null).p50 }
      },
      models
    };
  });
}
var versionRow = (g) => [
  g.version,
  String(g.n),
  String(g.shipped),
  String(g.truncated),
  pair(g.wall_s, fmtMin),
  pair(g.tokens, fmtCount),
  pair(g.cost, fmtCost),
  dash(g.dispatches.p50),
  pair(g.grants, dash),
  pair(g.reopens, dash),
  pair(g.loops, dash),
  `${dash(g.findings.blocker.p50)}/${dash(g.findings.major.p50)}/${dash(g.findings.minor.p50)}`,
  Object.entries(g.models).map(([m, n]) => `${m}:${n}`).join(",") || "-"
];
var renderText2 = (agg) => ["by version", table(HEADER2, agg.map(versionRow))].join("\n");

// src/bins/performance/council.mjs
var council_exports = {};
__export(council_exports, {
  aggregate: () => aggregate3,
  key: () => key3,
  renderText: () => renderText3
});
var key3 = "council";
var SEVERITIES = ["blocker", "major", "minor"];
var COUNTERS = ["total", "unique", "applied", "unique_applied", "deferred", "rejected"];
var MIN_RUNS = 5;
var HEADER3 = ["member", "total", "unique", "applied", "uniq_appl", "deferred", "rejected", "uniq_appl_nonminor/run"];
var zero = () => ({ blocker: 0, major: 0, minor: 0 });
var addInto = (acc, src) => {
  for (const s of SEVERITIES) acc[s] += num(obj(src)?.[s]) ?? 0;
};
var sum = (c) => c.blocker + c.major + c.minor;
var cell = (c) => `${c.blocker}/${c.major}/${c.minor}`;
var pct = (x) => `${Math.round(x * 100)}%`;
function flagsFor(members, runs) {
  const share = (m) => sum(m.total) === 0 ? null : sum(m.rejected) / sum(m.total);
  const quiet = Object.entries(members).filter(([, m]) => share(m) !== null && share(m) < 0.25);
  const out = [];
  for (const [name, m] of Object.entries(members)) {
    if (m.unique_applied_nonminor_per_run < 0.2) {
      out.push({ member: name, rule: "low_unique_applied", detail: `${m.unique_applied_nonminor_per_run.toFixed(2)} unique-and-applied blocker/major per run in ${runs} runs (total ${cell(m.total)})` });
    }
    const s = share(m);
    const other = quiet[0];
    if (s !== null && s > 0.5 && other) {
      out.push({ member: name, rule: "high_rejection", detail: `rejected ${pct(s)} vs ${other[0]} ${pct(share(other[1]))} (total ${cell(m.total)})` });
    }
  }
  return out;
}
function aggregate3(entries) {
  const groups = /* @__PURE__ */ new Map();
  for (const [i, e] of entries.entries()) {
    const members = obj(obj(e.council)?.members);
    if (!members) continue;
    const roster = Object.keys(members).sort();
    const k = roster.join(", ");
    if (!groups.has(k)) groups.set(k, { roster, entries: [] });
    groups.get(k).entries.push(e);
    groups.get(k).last = i;
  }
  return [...groups.values()].sort((a, b) => b.last - a.last).map((g) => {
    const runs = g.entries.length;
    const members = {};
    for (const m of g.roster) members[m] = { dispatches: 0, ...Object.fromEntries(COUNTERS.map((c) => [c, zero()])) };
    const chairs = /* @__PURE__ */ new Map();
    for (const e of g.entries) {
      for (const m of g.roster) {
        const src = obj(e.council.members[m]);
        members[m].dispatches += num(src?.dispatches) ?? 0;
        for (const c2 of COUNTERS) addInto(members[m][c2], src?.[c2]);
      }
      const ch = obj(e.council.chair);
      const model = str(ch?.model) ?? "unknown";
      const c = chairs.get(model) ?? { model, runs: 0, clusters: 0, reported: 0, retried_runs: 0 };
      c.runs += 1;
      c.clusters += num(ch?.clusters) ?? 0;
      c.reported += num(ch?.members_reported) ?? 0;
      if ((num(ch?.dispatches) ?? 1) > 1) c.retried_runs += 1;
      chairs.set(model, c);
    }
    for (const m of g.roster) members[m].unique_applied_nonminor_per_run = (members[m].unique_applied.blocker + members[m].unique_applied.major) / runs;
    const chairList = [...chairs.values()].sort((a, b) => b.runs - a.runs || a.model.localeCompare(b.model)).map((c) => ({ model: c.model, runs: c.runs, avg_clusters: c.clusters / c.runs, avg_members_reported: c.reported / c.runs, retried_runs: c.retried_runs }));
    return { roster: g.roster, runs, members, chairs: chairList, flags: runs >= MIN_RUNS ? flagsFor(members, runs) : [] };
  });
}
function renderText3(agg) {
  if (!agg.length) return "council\nno council data in selected records";
  const out = ["council", "severity is the chair's consolidated severity (highest any co-raiser assigned), not the member's own"];
  for (const g of agg) {
    out.push(`roster (${g.runs} runs): ${g.roster.join(", ")}`);
    const rows = g.roster.map((m) => {
      const x = g.members[m];
      return [m, cell(x.total), cell(x.unique), cell(x.applied), cell(x.unique_applied), cell(x.deferred), cell(x.rejected), x.unique_applied_nonminor_per_run.toFixed(2)];
    });
    for (const line of table(HEADER3, rows).split("\n")) out.push(`  ${line}`);
    for (const c of g.chairs) out.push(`  chair: ${c.model} - ${c.runs} runs, avg ${c.avg_clusters.toFixed(1)} clusters from ${c.avg_members_reported.toFixed(1)} members reported, retried in ${c.retried_runs}`);
    if (g.runs < MIN_RUNS) out.push(`  not enough runs to assess (${g.runs} of ${MIN_RUNS})`);
    for (const f of g.flags) out.push(`  flag: ${f.member} - ${f.detail}`);
  }
  return out.join("\n");
}

// src/bins/gauntlet-performance.mjs
var SECTIONS = [runs_exports, versions_exports, council_exports];
var usage = () => {
  process2.stderr.write("usage: gauntlet-performance [--dir <telemetry dir>]... [--since <version>] [--json]\n");
  process2.exit(1);
};
function parseArgs(argv) {
  const opts = { dirs: [], since: void 0, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir" && argv[i + 1] !== void 0 && !argv[i + 1].startsWith("--")) opts.dirs.push(argv[++i]);
    else if (a === "--since" && argv[i + 1] !== void 0 && !argv[i + 1].startsWith("--")) opts.since = argv[++i];
    else if (a === "--json") opts.json = true;
    else usage();
  }
  if (opts.since !== void 0 && !semver(opts.since)) usage();
  return opts;
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
function branchCorpus(root) {
  const agentDir = process2.env.PI_CODING_AGENT_DIR || join2(homedir(), ".pi", "agent");
  const preset = readLayer(join2(agentDir, "settings.json"));
  const repo = readLayer(join2(root, ".pi", "settings.json"));
  const t = resolveTelemetry(mergeGauntlet(preset?.piGauntlet, repo?.piGauntlet));
  if (t.warning) process2.stderr.write(`warning: ${t.warning}
`);
  const label = telemetryRepo(root) ?? `local/${basename(root)}`;
  if (!t.enabled) {
    process2.stderr.write("telemetry disabled\n");
    return { label, records: [] };
  }
  const result = readTelemetryBranch(root, { remote: t.remote, prefix: `${label}/` });
  if (result.warning) process2.stderr.write(`warning: ${result.warning}
`);
  return { label, records: result.records };
}
var gitToplevel = (cwd) => {
  const r = spawnSync2("git", ["-C", cwd, "rev-parse", "--show-toplevel"], { encoding: "utf8", timeout: 1e4 });
  return r.status === 0 ? r.stdout.trim() : void 0;
};
function corpusFor(path2) {
  const label = basename(resolve(path2));
  if (!existsSync(path2)) return { label, skip: "not found" };
  const abs = realpathSync(path2);
  if (!statSync(abs).isDirectory()) return { label, skip: "not a directory" };
  return { label, dir: abs };
}
function* yamlFiles(dir) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = join2(dir, e.name);
    if (e.isDirectory()) yield* yamlFiles(p);
    else if (e.isFile() && e.name.endsWith(".yaml")) yield p;
  }
}
function loadRecord(file, label, bytes) {
  let doc;
  try {
    doc = parseYaml(bytes);
  } catch {
    return { skip: "unparseable" };
  }
  const d = obj(doc);
  if (!d) return { skip: "unparseable" };
  if (d.schema !== 1) return { skip: `schema ${d.schema === void 0 ? "missing" : String(d.schema)}` };
  if (typeof d.spec !== "string" || typeof d.run_id !== "string") return { skip: "not a record" };
  const derived = obj(d.derived) ?? {};
  const phases = obj(derived.phases) ?? {};
  const ph = (p) => obj(phases[p]);
  const tok = (p) => obj(ph(p)?.tokens);
  const callsOf = (p) => {
    const raw = ph(p)?.parent_calls;
    if (!Array.isArray(raw)) return null;
    return raw.filter((c) => Array.isArray(c) && c.length === 3 && c.every((v) => num(v) !== null));
  };
  const bigStats = (calls) => {
    if (calls === null) return { big_calls: null, big_write_share: null };
    const total = calls.reduce((a, c) => a + c[1], 0);
    const bigs = calls.filter((c) => c[1] > BIG_CACHE_WRITE);
    const big = bigs.reduce((a, c) => a + c[1], 0);
    return { big_calls: bigs.length, big_write_share: total === 0 ? null : big / total };
  };
  const phaseKeys = [...PHASES, "unphased"];
  const perPhase = Object.fromEntries(phaseKeys.map((p) => [p, callsOf(p)]).filter(([, c]) => c !== null).map(([p, c]) => [p, bigStats(c)]));
  const allCalls = phaseKeys.map(callsOf).filter((c) => c !== null);
  const runBig = allCalls.length ? bigStats(allCalls.flat()) : { big_calls: null, big_write_share: null };
  const personas = obj(derived.personas) ?? {};
  const reviews = obj(derived.reviews);
  const gates = obj(derived.gates) ?? {};
  const version = str(obj(d.versions)?.["pi-gauntlet"]);
  const reviewEntries = reviews === null ? null : Object.values(reviews);
  const findings = reviewEntries === null ? null : reviewEntries.length === 0 ? { blocker: 0, major: 0, minor: 0 } : Object.fromEntries(["blocker", "major", "minor"].map((severity) => {
    const counters = reviewEntries.map((r) => {
      const review = obj(r);
      if (review === null) return null;
      if (!Object.hasOwn(review, "findings")) return 0;
      const reviewFindings = obj(review.findings);
      if (reviewFindings === null) return null;
      return Object.hasOwn(reviewFindings, severity) ? num(reviewFindings[severity]) : 0;
    });
    return [severity, counters.includes(null) ? null : counters.reduce((a, b) => a + b, 0)];
  }));
  const truncated = ph("ship") === null;
  const plan = obj(derived.plan);
  const tasks = num(plan?.tasks);
  const skipped = num(plan?.skipped);
  const inScope = tasks === null || skipped === null ? null : tasks - skipped;
  const implementDispatches = Array.isArray(d.events) ? d.events.filter((e) => e?.kind === "dispatch" && e.phase === "implement").length : 0;
  return {
    row: {
      run_id: d.run_id,
      engine: str(derived.engine) ?? "waves",
      iterations: num(derived.iterations),
      repo: label,
      spec: basename(file, ".yaml"),
      version: semver(version) ? version.trim() : "unknown",
      status: str(d.status),
      created_at: str(d.created_at),
      truncated,
      wall_s: truncated ? null : num(derived.duration_s),
      phase_min: Object.fromEntries(PHASES.map((p) => {
        const s = num(ph(p)?.duration_s);
        return [p, s === null ? null : s / 60];
      })),
      tokens: sumOrNull(PHASES.flatMap((p) => TOKEN_KEYS.map((k) => num(tok(p)?.[k])))),
      cost: sumOrNull(PHASES.map((p) => num(tok(p)?.cost))),
      models: [...new Set(PHASES.map((p) => str(ph(p)?.model)).filter((m) => m !== null))].sort(),
      dispatches: sumOrNull(Object.values(personas).map((p) => num(obj(p)?.dispatches))),
      dispatches_per_task: inScope === null || inScope === 0 || (num(derived.events_dropped) ?? 0) > 0 ? null : implementDispatches / inScope,
      coordinated: Array.isArray(d.legs) && d.legs.length > 0,
      grants: num(gates.fix_round_grants),
      reopens: num(gates.task_reopens),
      spec_rounds: num(gates.spec_rounds),
      plan_rounds: num(gates.plan_rounds),
      loops: num(derived.conformance_loops),
      open_gaps: num(derived.conformance_open_gaps),
      findings,
      council: num(obj(personas["spec-council-member"])?.dispatches),
      ship_option: str(gates.ship_option),
      tests: str(obj(derived.tests)?.result),
      big_calls: runBig.big_calls,
      big_write_share: runBig.big_write_share,
      phases: Object.keys(perPhase).length ? perPhase : void 0
    },
    council: derived.council ?? null
  };
}
function main() {
  const opts = parseArgs(process2.argv.slice(2));
  const corpora = [];
  const skipped = [];
  if (!opts.dirs.length) {
    const top = gitToplevel(process2.cwd());
    if (top === void 0) process2.stderr.write(`not a git checkout: ${process2.cwd()}
`);
    else corpora.push(branchCorpus(top));
  }
  for (const p of opts.dirs) {
    const c = corpusFor(p);
    if (c.skip) skipped.push({ file: p, reason: c.skip });
    else corpora.push(c);
  }
  const since = opts.since === void 0 ? void 0 : semver(opts.since);
  const seen = /* @__PURE__ */ new Set();
  const corpus = {};
  const entries = [];
  for (const c of corpora) {
    corpus[c.label] = corpus[c.label] ?? 0;
    const records = c.records ?? [...yamlFiles(c.dir)].map((path2) => ({ path: path2, bytes: readFileSync(path2, "utf8") }));
    for (const { path: file, bytes } of records) {
      const res = loadRecord(file, c.label, bytes);
      if (res.skip) {
        skipped.push({ file, reason: res.skip });
        continue;
      }
      if (seen.has(res.row.run_id)) {
        skipped.push({ file, reason: "duplicate run_id" });
        continue;
      }
      seen.add(res.row.run_id);
      const v = semver(res.row.version);
      if (since && (!v || cmpSemver(v, since) < 0)) continue;
      corpus[c.label]++;
      entries.push(res);
    }
  }
  entries.sort((a, b) => (a.row.created_at ?? "").localeCompare(b.row.created_at ?? "") || a.row.run_id.localeCompare(b.row.run_id));
  const aggregates = SECTIONS.map((s) => [s, s.aggregate(entries)]);
  if (opts.json) {
    const out = { corpus, since: opts.since ?? null };
    for (const [s, agg] of aggregates) out[s.key] = agg;
    out.skipped = skipped;
    console.log(JSON.stringify(out, null, 2));
    return;
  }
  console.log(`corpus: ${Object.entries(corpus).map(([k, v]) => `${k}=${v}`).join(", ")}${opts.since === void 0 ? "" : `   since: ${opts.since}`}`);
  if (entries.length === 0) {
    console.log(`no records found in ${corpora.map((c) => c.dir ?? c.label).join(", ") || process2.cwd()}`);
  } else {
    console.log(aggregates.map(([s, agg]) => s.renderText(agg)).join("\n\n"));
  }
  if (entries.length && skipped.length) console.log("");
  if (entries.length) for (const s of skipped) console.log(`skipped: ${s.file}: ${s.reason}`);
}
main();
