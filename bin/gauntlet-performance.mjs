#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/bins/gauntlet-performance.mjs
import { existsSync as existsSync3, readdirSync, readFileSync as readFileSync2, realpathSync, statSync as statSync2 } from "node:fs";
import { homedir } from "node:os";
import { basename as basename2, join as join3, resolve } from "node:path";
import { spawnSync as spawnSync2 } from "node:child_process";
import process2 from "node:process";
import { parse as parseYaml } from "yaml";

// extensions/lib/gauntlet-settings.ts
function mergeGauntlet(preset, repo) {
  return { ...preset ?? {}, ...repo ?? {} };
}
var nonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
var joinWarn = (ws) => ws.length ? ws.join("; ") : void 0;
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
import { existsSync as existsSync2, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join as join2 } from "node:path";

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

// extensions/lib/vcs.ts
import { spawnSync } from "node:child_process";

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
  const match = result.stdout.match(/^(?:https?:\/\/[^/]+\/|ssh:\/\/(?:[^@/]+@)?[^/]+\/|(?:[^@\s]+@)?[^:\s/]+:)(.+)$/);
  const path = match?.[1].replace(/^\/+|\/+$/g, "").replace(/\.git$/, "");
  if (result.ok && path) return path;
  const top = checkoutOfSync(root)?.toplevel ?? root;
  for (const file of [".pi/gauntlet-overrides.md", "gauntlet-overrides.md", "doc/gauntlet-overrides.md"]) {
    const path2 = join2(top, file);
    if (!existsSync2(path2)) continue;
    const section = readFileSync(path2, "utf8").split(/^##\s+Issue tracker\s*$/m)[1]?.split(/^##\s/m)[0] ?? "";
    const repo = /^-[\t ]*repo:[\t ]*(\S[^\r\n]*)$/m.exec(section)?.[1].trim();
    if (repo) return repo;
    break;
  }
  const worktrees = gitRun(["worktree", "list", "--porcelain", "-z"], root);
  const primary = worktrees.ok ? /^worktree ([^\0]+)/.exec(worktrees.stdout)?.[1] : void 0;
  return `local/${basename(primary ?? top)}`;
}
var trackingRef = (remote) => `refs/remotes/${remote === "origin" ? "origin" : "telemetry"}/gauntlet/telemetry`;
var fetchBranch = (root, remote) => gitRun(["fetch", "--no-tags", remote, `+${TELEMETRY_REF}:${trackingRef(remote)}`], root);
function syncTelemetryBranch(root, records, remote = "origin") {
  const scratch = mkdtempSync(join2(tmpdir(), "gauntlet-telemetry-index-"));
  const env = { GIT_INDEX_FILE: join2(scratch, "index") };
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
    committed = records.size === 0 && !!tip;
    fetch();
    let upstream = resolve2(tracking);
    if (records.size) {
      const parent = tip ?? upstream;
      git(parent ? ["read-tree", parent] : ["read-tree", "--empty"]);
      for (const [path, content] of records) {
        const blob = git(["hash-object", "-w", "--stdin"], content);
        git(["update-index", "--add", "--cacheinfo", "100644", blob, path]);
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
        const path = changes[i + 1];
        git(mode === "000000" ? ["update-index", "--force-remove", "--", path] : ["update-index", "--add", "--cacheinfo", mode, blob, path]);
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
var HEADER2 = ["repo", "version", "n", "shipped", "truncated", "wall p50/max", "tokens p50/max", "cost p50/max", "disp p50", "grants p50/max", "reopens p50/max", "loops p50/max", "findings p50 b/M/m", "models"];
var versionOrder = (a, b) => {
  const x = semver(a), y = semver(b);
  return x && y ? cmpSemver(x, y) : x ? -1 : y ? 1 : 0;
};
function aggregate2(entries) {
  const rows = entries.map((e) => e.row);
  const groups = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const key4 = JSON.stringify([r.repo, r.version]);
    if (!groups.has(key4)) groups.set(key4, []);
    groups.get(key4).push(r);
  }
  return [...groups.values()].sort(([a], [b]) => a.repo.localeCompare(b.repo) || versionOrder(a.version, b.version)).map((all) => {
    const shipped = all.filter((r) => r.status === "shipped" && !r.truncated);
    const models = {};
    for (const r of shipped) for (const m of r.models) models[m] = (models[m] ?? 0) + 1;
    return {
      repo: all[0].repo,
      version: all[0].version,
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
  g.repo,
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
    const k = JSON.stringify([e.row.repo, roster]);
    if (!groups.has(k)) groups.set(k, { repo: e.row.repo, roster, entries: [] });
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
    return { repo: g.repo, roster: g.roster, runs, members, chairs: chairList, flags: runs >= MIN_RUNS ? flagsFor(members, runs) : [] };
  });
}
function renderText3(agg) {
  if (!agg.length) return "council\nno council data in selected records";
  const out = ["council", "severity is the chair's consolidated severity (highest any co-raiser assigned), not the member's own"];
  for (const g of agg) {
    out.push(`repo: ${g.repo}`, `roster (${g.runs} runs): ${g.roster.join(", ")}`);
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

// src/bins/performance/leg-rounds.mjs
var LEG_SKILLS = ["shape-ticket", "gatekeep-pr", "check-delivery"];
function loadLeg(doc) {
  if (![doc.session, doc.ts].every((v) => typeof v === "string" && v.length) || !Array.isArray(doc.items) || !doc.items.every((item) => obj(item) && ["ticket", "pr"].includes(item.kind) && str(item.outcome) !== null && (item.key === void 0 || str(item.key) !== null))) {
    return { skip: "not a leg record" };
  }
  return { leg: { ...doc, repo: str(doc.repo) ?? "unknown repo" } };
}
var legId = (leg) => JSON.stringify([leg.repo, leg.skill, leg.session, leg.ts]);
function itemKey(key4, repo) {
  if (!key4) return null;
  const ref = key4.replace(/@[a-f\d]+$/i, "");
  if (/^#\d+$/.test(ref)) return `${repo}${ref}`;
  const github = /^https?:\/\/[^/]+\/([^/]+\/[^/]+)\/(?:issues|pull)\/(\d+)\/?$/.exec(ref);
  if (github) return `${github[1]}#${github[2]}`;
  const linear = /^https?:\/\/[^/]+\/[^/]+\/issue\/([A-Z][A-Z0-9]*-\d+)(?:\/.*)?$/.exec(ref);
  return linear ? linear[1] : ref;
}
function groupRounds(legs, skill) {
  const groups = /* @__PURE__ */ new Map();
  for (const leg of legs.filter((leg2) => leg2.skill === skill).sort((a, b) => a.ts.localeCompare(b.ts) || a.session.localeCompare(b.session))) {
    const keys = new Set(leg.items.map((item) => itemKey(item.key, leg.repo)).filter(Boolean));
    for (const key4 of keys) {
      const id2 = JSON.stringify([leg.repo, key4]);
      if (!groups.has(id2)) groups.set(id2, { repo: leg.repo, key: key4, rounds: [] });
      groups.get(id2).rounds.push(leg);
    }
  }
  return [...groups.values()].sort((a, b) => a.repo.localeCompare(b.repo) || a.key.localeCompare(b.key));
}

// src/bins/performance/costs.mjs
var allocationNote = "costs: batch and multi-ticket records are split equally across their items; the rounding remainder lands on the last row";
var columns = ["shape", "run", "gatekeep", "delivery"];
var skillColumn = { "shape-ticket": "shape", "gatekeep-pr": "gatekeep", "check-delivery": "delivery" };
var id = (repo, key4) => JSON.stringify([repo, key4]);
var ordered = (map) => [...map.values()].sort((a, b) => a.repo.localeCompare(b.repo) || a.key.localeCompare(b.key));
var add = (row, column, cost) => {
  if (cost !== null) row[column] = (row[column] ?? 0) + cost;
};
var allocations = /* @__PURE__ */ new WeakMap();
var split = (cost, count) => Array(count).fill(cost === null ? null : cost / count);
function aggregateCosts(entries, legs) {
  const tickets = /* @__PURE__ */ new Map(), prs = /* @__PURE__ */ new Map(), unattributed = /* @__PURE__ */ new Map();
  const splits = [], links = [], cells = /* @__PURE__ */ new Map();
  const cell2 = (row, column) => {
    if (!cells.has(row)) cells.set(row, /* @__PURE__ */ new Map());
    const columns2 = cells.get(row);
    if (!columns2.has(column)) columns2.set(column, { row, column });
    return columns2.get(column);
  };
  const ensure = (map, repo, key4) => {
    const identity = id(repo, key4);
    if (!map.has(identity)) map.set(identity, { repo, key: key4, shape: null, run: null, gatekeep: null, delivery: null, rounds: [] });
    return map.get(identity);
  };
  for (const { row } of entries) {
    const keys = [...new Set(row.tickets.map((ref) => itemKey(ref, row.repo)))].sort();
    const shares = split(row.cost, keys.length || 1);
    if (!keys.length) add(ensure(unattributed, row.repo, row.session), "run", shares[0]);
    const recipients = keys.map((key4) => ensure(tickets, row.repo, key4));
    recipients.forEach((recipient, i) => add(recipient, "run", shares[i]));
    splits.push(recipients.map((row2) => cell2(row2, "run")));
  }
  const ticketPrs = /* @__PURE__ */ new Map();
  for (const leg of [...legs].sort((a, b) => a.ts.localeCompare(b.ts) || a.session.localeCompare(b.session))) {
    const items = [...leg.items].sort((a, b) => (itemKey(a.key, leg.repo) ?? "\uFFFF").localeCompare(itemKey(b.key, leg.repo) ?? "\uFFFF"));
    const shares = split(num(leg.cost), items.length || 1);
    const recipients = [];
    if (!items.length) add(ensure(unattributed, leg.repo, leg.session), skillColumn[leg.skill], shares[0]);
    const roundShares = /* @__PURE__ */ new Map();
    items.forEach((item, i) => {
      const key4 = itemKey(item.key, leg.repo);
      const ticket = item.kind === "ticket" ? key4 : itemKey(item.ticket, leg.repo);
      const row = ticket ? ensure(tickets, leg.repo, ticket) : ensure(unattributed, leg.repo, item.kind === "pr" && key4 ? key4 : leg.session);
      add(row, skillColumn[leg.skill], shares[i]);
      recipients.push(cell2(row, skillColumn[leg.skill]));
      if (item.kind !== "pr" || !key4 || leg.skill !== "gatekeep-pr") return;
      const pr = ensure(prs, leg.repo, key4);
      if (!roundShares.has(pr)) roundShares.set(pr, null);
      roundShares.set(pr, sumOrNull([roundShares.get(pr), shares[i]]));
      if (ticket) {
        const identity = id(leg.repo, ticket);
        if (!ticketPrs.has(identity)) ticketPrs.set(identity, /* @__PURE__ */ new Set());
        ticketPrs.get(identity).add(pr);
      }
    });
    splits.push(recipients);
    const roundCells = [];
    for (const [pr, cost] of roundShares) {
      pr.rounds.push(leg);
      (pr.round_costs ??= []).push(cost);
      roundCells.push(cell2(pr.round_costs, pr.round_costs.length - 1));
    }
    splits.push(roundCells);
  }
  for (const [identity, linked] of ticketPrs) {
    const cost = tickets.get(identity).run;
    const rows = [...linked].sort((a, b) => a.key.localeCompare(b.key));
    const shares = split(cost, rows.length);
    rows.forEach((row, i) => add(row, "run", shares[i]));
    links.push({ source: cell2(tickets.get(identity), "run"), targets: rows.map((row) => cell2(row, "run")) });
  }
  for (const group of groupRounds(legs, "shape-ticket")) {
    const row = tickets.get(id(group.repo, group.key));
    if (row) row.rounds = group.rounds;
  }
  for (const row of [...tickets.values(), ...unattributed.values()]) row.total = sumOrNull(columns.map((column) => row[column]));
  const prRows = ordered(prs);
  for (const row of prRows) {
    for (const column of ["shape", "gatekeep", "delivery"]) delete row[column];
    row.total = sumOrNull([row.run, ...row.round_costs]);
  }
  const result = { tickets: ordered(tickets), prs: prRows, unattributed: ordered(unattributed) };
  allocations.set(result, { splits, links });
  return result;
}
function displayCosts(costs) {
  const copies = /* @__PURE__ */ new Map();
  const result = Object.fromEntries(Object.entries(costs).map(([table2, rows]) => [table2, rows.map((row) => {
    const copy = { ...row };
    for (const column of columns) if (typeof copy[column] === "number") copy[column] = Math.round(copy[column] * 100) / 100;
    copies.set(row, copy);
    if (row.round_costs) {
      copy.round_costs = row.round_costs.map((cost) => cost === null ? null : Math.round(cost * 100) / 100);
      copies.set(row.round_costs, copy.round_costs);
    }
    return copy;
  })]));
  const { splits, links } = allocations.get(costs);
  const order = new Map([...copies.keys()].map((row, i) => [row, i]));
  const round = (groups, linked = false) => {
    const components = [];
    for (const group of groups) {
      const cells = new Set(linked ? group.targets : group);
      const sources = new Set(linked ? [group.source] : []);
      for (let i = components.length - 1; i >= 0; i--) {
        if (![...components[i].cells].some((cell2) => cells.has(cell2))) continue;
        for (const cell2 of components[i].cells) cells.add(cell2);
        for (const source of components[i].sources) sources.add(source);
        components.splice(i, 1);
      }
      if (cells.size) components.push({ cells, sources });
    }
    for (const { cells, sources } of components) {
      const active = [...cells].filter(({ row, column }) => row[column] !== null).sort((a, b) => order.get(a.row) - order.get(b.row));
      const total = sumOrNull([...linked ? sources : active].map(({ row, column }) => (linked ? copies.get(row) : row)[column]));
      let remaining = Math.round(total * 100);
      active.forEach(({ row, column }, i) => {
        const cents = i === active.length - 1 ? remaining : Math.round(row[column] * 100);
        copies.get(row)[column] = cents / 100;
        remaining -= cents;
      });
    }
  };
  round(splits);
  round(links, true);
  for (const rows of Object.values(costs)) for (const row of rows) {
    const copy = copies.get(row);
    const raw = row.round_costs ? [row.run, ...row.round_costs] : columns.map((column) => row[column]);
    const displayed = copy.round_costs ? [copy.run, ...copy.round_costs] : columns.map((column) => copy[column]);
    copy.total = row.total === null ? null : row.total + raw.reduce((delta, value, i) => delta + (value === null ? 0 : displayed[i] - Math.round(value * 100) / 100), 0);
  }
  return result;
}
function renderCosts(aggregate4) {
  const { tickets, prs, unattributed } = displayCosts(aggregate4);
  const roundCount = Math.max(0, ...prs.map((row) => row.round_costs.length));
  const costs = (rows) => rows.map((row) => [row.repo, row.key, ...columns.map((column) => fmtCost(row[column])), fmtCost(row.total)]);
  return [
    `tickets
${table(["repo", "ticket", "rounds", ...columns, "total"], costs(tickets).map((cells, i) => [...cells.slice(0, 2), String(tickets[i].rounds.length), ...cells.slice(2)]))}`,
    `prs
${table(["repo", "PR", "rounds", "run", ...Array.from({ length: roundCount }, (_, i) => `round ${i + 1}`), "total"], prs.map((row) => [row.repo, row.key, String(row.rounds.length), fmtCost(row.run), ...Array.from({ length: roundCount }, (_, i) => fmtCost(row.round_costs[i] ?? null)), fmtCost(row.total)]))}`,
    `unattributed
${table(["repo", "PR/session", ...columns, "total"], costs(unattributed))}`,
    allocationNote
  ].join("\n\n");
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
  if (!existsSync3(file)) return {};
  try {
    return JSON.parse(readFileSync2(file, "utf8"));
  } catch (e) {
    process2.stderr.write(`warning: ${file}: ${e.message}; using {} for this layer
`);
    return {};
  }
}
function branchCorpus(root) {
  const agentDir = process2.env.PI_CODING_AGENT_DIR || join3(homedir(), ".pi", "agent");
  const preset = readLayer(join3(agentDir, "settings.json"));
  const repo = readLayer(join3(root, ".pi", "settings.json"));
  const t = resolveTelemetry(mergeGauntlet(preset?.piGauntlet, repo?.piGauntlet));
  if (t.warning) process2.stderr.write(`warning: ${t.warning}
`);
  const label = telemetryRepo(root);
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
function corpusFor(path) {
  const label = basename2(resolve(path));
  if (!existsSync3(path)) return { label, skip: "not found" };
  const abs = realpathSync(path);
  if (!statSync2(abs).isDirectory()) return { label, skip: "not a directory" };
  return { label, dir: abs };
}
function* yamlFiles(dir) {
  if (!existsSync3(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = join3(dir, e.name);
    if (e.isDirectory()) yield* yamlFiles(p);
    else if (e.isFile() && e.name.endsWith(".yaml")) yield p;
  }
}
function loadRecord(file, bytes) {
  let doc;
  try {
    doc = parseYaml(bytes);
  } catch {
    return { skip: "unparseable" };
  }
  const d = obj(doc);
  if (!d) return { skip: "unparseable" };
  if (LEG_SKILLS.includes(d.skill)) return loadLeg(d);
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
      session: Array.isArray(d.sessions) && typeof d.sessions[0] === "string" ? d.sessions[0] : d.run_id,
      tickets: Array.isArray(d.tickets) ? d.tickets.filter((ref) => typeof ref === "string" && ref.length) : [],
      engine: str(derived.engine) ?? "waves",
      iterations: num(derived.iterations),
      repo: str(d.repo) ?? "unknown repo",
      spec: basename2(file, ".yaml"),
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
  const seenLegs = /* @__PURE__ */ new Set();
  const corpus = {};
  const entries = [];
  const legs = [];
  for (const c of corpora) {
    corpus[c.label] = corpus[c.label] ?? 0;
    const records = c.records ?? [...yamlFiles(c.dir)].map((path) => ({ path, bytes: readFileSync2(path, "utf8") }));
    for (const { path: file, bytes } of records) {
      const res = loadRecord(file, bytes);
      if (res.skip) {
        skipped.push({ file, reason: res.skip });
        continue;
      }
      if (res.leg) {
        const id2 = legId(res.leg);
        if (seenLegs.has(id2)) {
          skipped.push({ file, reason: "duplicate leg" });
          continue;
        }
        seenLegs.add(id2);
        const v2 = semver(res.leg.gauntlet_version);
        if (since && (!v2 || cmpSemver(v2, since) < 0)) continue;
        corpus[c.label]++;
        legs.push(res.leg);
        continue;
      }
      const runId = JSON.stringify([res.row.repo, res.row.run_id]);
      if (seen.has(runId)) {
        skipped.push({ file, reason: "duplicate run_id" });
        continue;
      }
      seen.add(runId);
      const v = semver(res.row.version);
      if (since && (!v || cmpSemver(v, since) < 0)) continue;
      corpus[c.label]++;
      entries.push(res);
    }
  }
  entries.sort((a, b) => (a.row.created_at ?? "").localeCompare(b.row.created_at ?? "") || a.row.run_id.localeCompare(b.row.run_id));
  const aggregates = SECTIONS.map((s) => [s, s.aggregate(entries)]);
  const hasRecords = entries.length + legs.length > 0;
  if (opts.json) {
    const out = { corpus, since: opts.since ?? null };
    for (const [s, agg] of aggregates) out[s.key] = agg;
    Object.assign(out, aggregateCosts(entries, legs));
    out.skipped = skipped;
    console.log(JSON.stringify(out, null, 2));
    return;
  }
  console.log(`corpus: ${Object.entries(corpus).map(([k, v]) => `${k}=${v}`).join(", ")}${opts.since === void 0 ? "" : `   since: ${opts.since}`}`);
  if (!hasRecords) {
    console.log(`no records found in ${corpora.map((c) => c.dir ?? c.label).join(", ") || process2.cwd()}`);
  } else {
    console.log([...aggregates.map(([s, agg]) => s.renderText(agg)), renderCosts(aggregateCosts(entries, legs, true))].join("\n\n"));
  }
  if (hasRecords && skipped.length) console.log("");
  if (hasRecords) for (const s of skipped) console.log(`skipped: ${s.file}: ${s.reason}`);
}
main();
