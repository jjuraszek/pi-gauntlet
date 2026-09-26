#!/usr/bin/env node
// Digest committed gauntlet telemetry records: one row per run plus p50/max per pi-gauntlet
// version. Parse and aggregate only; the gauntlet-performance skill reasons over the output.
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";
import { parse as parseYaml } from "yaml";
import { mergeGauntlet, resolveTelemetry } from "../../extensions/lib/gauntlet-settings.ts";

const PHASES = ["brainstorm", "plan", "implement", "verify", "ship"];
const TOKEN_KEYS = ["input", "output", "cache_read", "cache_write"];
const RUN_HEADER = ["run_id", "repo", "spec", "version", "status", "wall", "b/p/i/v/s min", "tokens", "cost", "models", "disp", "grants", "reopens", "loops", "findings", "council"];
const VERSION_HEADER = ["version", "n", "shipped", "truncated", "wall p50/max", "tokens p50/max", "cost p50/max", "disp p50", "grants p50/max", "reopens p50/max", "loops p50/max", "findings p50 b/M/m", "models"];

const usage = () => {
  process.stderr.write("usage: gauntlet-performance [--dir <repo root or telemetry dir>]... [--since <version>] [--json]\n");
  process.exit(1);
};

const semver = (s) => {
  const m = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(typeof s === "string" ? s.trim() : "");
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : undefined;
};
const cmpSemver = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

function parseArgs(argv) {
  const opts = { dirs: [], since: undefined, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir" && argv[i + 1] !== undefined && !argv[i + 1].startsWith("--")) opts.dirs.push(argv[++i]);
    else if (a === "--since" && argv[i + 1] !== undefined && !argv[i + 1].startsWith("--")) opts.since = argv[++i];
    else if (a === "--json") opts.json = true;
    else usage();
  }
  if (opts.since !== undefined && !semver(opts.since)) usage();
  return opts;
}

function readLayer(file) {
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    process.stderr.write(`warning: ${file}: ${e.message}; using {} for this layer\n`);
    return {};
  }
}

// Same two layers the recorder and the seal bin read.
function telemetryDirOf(root) {
  const agentDir = process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
  const preset = readLayer(join(agentDir, "settings.json"));
  const repo = readLayer(join(root, ".pi", "settings.json"));
  const t = resolveTelemetry(mergeGauntlet(preset?.piGauntlet, repo?.piGauntlet));
  if (t.warning) process.stderr.write(`warning: ${t.warning}\n`);
  return join(root, t.dir);
}

const gitToplevel = (cwd) => {
  const r = spawnSync("git", ["-C", cwd, "rev-parse", "--show-toplevel"], { encoding: "utf8", timeout: 10_000 });
  return r.status === 0 ? r.stdout.trim() : undefined;
};

// A git toplevel contributes its resolved telemetry dir; anything else is a telemetry dir itself.
function corpusFor(path) {
  const label = basename(resolve(path));
  if (!existsSync(path)) return { label, skip: "not found" };
  const abs = realpathSync(path);
  const top = gitToplevel(abs);
  if (top !== undefined && realpathSync(top) === abs) {
    const dir = telemetryDirOf(abs);
    return existsSync(dir) ? { label, dir } : { label, skip: "no telemetry dir" };
  }
  if (!statSync(abs).isDirectory()) return { label, skip: "not a directory" };
  return { label, dir: abs };
}

function* yamlFiles(dir) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* yamlFiles(p);
    else if (e.isFile() && e.name.endsWith(".yaml")) yield p;
  }
}

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const str = (v) => (typeof v === "string" ? v : null);
const obj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : null);
const sumOrNull = (vals) => {
  const xs = vals.filter((v) => v !== null);
  return xs.length ? xs.reduce((a, b) => a + b, 0) : null;
};

function loadRecord(file, label) {
  let doc;
  try {
    doc = parseYaml(readFileSync(file, "utf8"));
  } catch {
    return { skip: "unparseable" };
  }
  const d = obj(doc);
  if (!d) return { skip: "unparseable" };
  if (d.schema !== 1) return { skip: `schema ${d.schema === undefined ? "missing" : String(d.schema)}` };
  if (typeof d.spec !== "string" || typeof d.run_id !== "string") return { skip: "not a record" };
  const derived = obj(d.derived) ?? {};
  const phases = obj(derived.phases) ?? {};
  const ph = (p) => obj(phases[p]);
  const tok = (p) => obj(ph(p)?.tokens);
  const personas = obj(derived.personas) ?? {};
  const reviews = obj(derived.reviews);
  const gates = obj(derived.gates) ?? {};
  const version = str(obj(d.versions)?.["pi-gauntlet"]);
  const reviewEntries = reviews === null ? null : Object.values(reviews);
  const findings = reviewEntries === null
    ? null
    : reviewEntries.length === 0
      ? { blocker: 0, major: 0, minor: 0 }
      : Object.fromEntries(["blocker", "major", "minor"].map((severity) => {
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
  return {
    row: {
      run_id: d.run_id,
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
    },
  };
}

const p50 = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const stat = (rows, pick) => {
  const xs = rows.map(pick).filter((v) => v !== null && v !== undefined);
  return xs.length ? { p50: p50(xs), max: Math.max(...xs) } : { p50: null, max: null };
};
const versionOrder = (a, b) => {
  const x = semver(a), y = semver(b);
  return x && y ? cmpSemver(x, y) : x ? -1 : y ? 1 : 0;
};

function aggregate(rows) {
  const groups = new Map();
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
        minor: { p50: stat(shipped, (r) => r.findings?.minor ?? null).p50 },
      },
      models,
    };
  });
}

const dash = (v) => (v === null || v === undefined ? "-" : String(v));
const fmtMin = (s) => (s === null ? "-" : `${Math.round(s / 60)}m`);
const fmtCount = (n) => (n === null ? "-" : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n));
const fmtCost = (c) => (c === null ? "-" : c.toFixed(2));
const pair = (s, f) => `${f(s.p50)}/${f(s.max)}`;
const findingsCell = (f) => (f === null ? "-" : `${dash(f.blocker)}/${dash(f.major)}/${dash(f.minor)}`);
const table = (header, rows) => {
  const w = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  return [header, ...rows].map((r) => r.map((c, i) => c.padEnd(w[i])).join("  ").trimEnd()).join("\n");
};
const runRow = (r) => [
  r.run_id.slice(0, 8), r.repo, r.spec, r.version, `${dash(r.status)}${r.truncated ? "*" : ""}`, fmtMin(r.wall_s),
  PHASES.map((p) => (r.phase_min[p] === null ? "-" : String(Math.round(r.phase_min[p])))).join("/"),
  fmtCount(r.tokens), fmtCost(r.cost), r.models.join(",") || "-", dash(r.dispatches), dash(r.grants), dash(r.reopens), dash(r.loops),
  findingsCell(r.findings), dash(r.council),
];
const versionRow = (g) => [
  g.version, String(g.n), String(g.shipped), String(g.truncated), pair(g.wall_s, fmtMin), pair(g.tokens, fmtCount), pair(g.cost, fmtCost),
  dash(g.dispatches.p50), pair(g.grants, dash), pair(g.reopens, dash), pair(g.loops, dash),
  `${dash(g.findings.blocker.p50)}/${dash(g.findings.major.p50)}/${dash(g.findings.minor.p50)}`,
  Object.entries(g.models).map(([m, n]) => `${m}:${n}`).join(",") || "-",
];

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const corpora = [];
  const skipped = [];
  const top = gitToplevel(process.cwd());
  if (top === undefined) process.stderr.write(`not a git checkout: ${process.cwd()}\n`);
  else corpora.push({ label: basename(top), dir: telemetryDirOf(top) });
  for (const p of opts.dirs) {
    const c = corpusFor(p);
    if (c.skip) skipped.push({ file: p, reason: c.skip });
    else corpora.push(c);
  }
  const since = opts.since === undefined ? undefined : semver(opts.since);
  const seen = new Set();
  const corpus = {};
  const rows = [];
  for (const c of corpora) {
    corpus[c.label] = corpus[c.label] ?? 0;
    for (const file of yamlFiles(c.dir)) {
      const res = loadRecord(file, c.label);
      if (res.skip) { skipped.push({ file, reason: res.skip }); continue; }
      if (seen.has(res.row.run_id)) { skipped.push({ file, reason: "duplicate run_id" }); continue; }
      seen.add(res.row.run_id);
      const v = semver(res.row.version);
      if (since && (!v || cmpSemver(v, since) < 0)) continue;
      corpus[c.label]++;
      rows.push(res.row);
    }
  }
  rows.sort((a, b) => (a.created_at ?? "").localeCompare(b.created_at ?? "") || a.run_id.localeCompare(b.run_id));
  const byVersion = rows.length ? aggregate(rows) : [];
  if (opts.json) {
    console.log(JSON.stringify({ corpus, since: opts.since ?? null, runs: rows, by_version: byVersion, skipped }, null, 2));
    return;
  }
  console.log(`corpus: ${Object.entries(corpus).map(([k, v]) => `${k}=${v}`).join(", ")}${opts.since === undefined ? "" : `   since: ${opts.since}`}`);
  if (rows.length === 0) {
    console.log(`no records found in ${corpora.map((c) => c.dir).join(", ") || process.cwd()}`);
  } else {
    console.log(`runs (${rows.length})`);
    console.log(table(RUN_HEADER, rows.map(runRow)));
    console.log("");
    console.log("by version");
    console.log(table(VERSION_HEADER, byVersion.map(versionRow)));
  }
  if (rows.length && skipped.length) console.log("");
  if (rows.length) for (const s of skipped) console.log(`skipped: ${s.file}: ${s.reason}`);
}

main();
