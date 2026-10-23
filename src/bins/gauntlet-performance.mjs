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

import { BIG_CACHE_WRITE, PHASES, TOKEN_KEYS, cmpSemver, num, obj, semver, str, sumOrNull } from "./performance/shared.mjs";
import * as runs from "./performance/runs.mjs";
import * as versions from "./performance/versions.mjs";
import * as council from "./performance/council.mjs";

const SECTIONS = [runs, versions, council];

const usage = () => {
  process.stderr.write("usage: gauntlet-performance [--dir <repo root or telemetry dir>]... [--since <version>] [--json]\n");
  process.exit(1);
};

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
      phases: Object.keys(perPhase).length ? perPhase : undefined,
    },
    council: derived.council ?? null,
  };
}

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
  const entries = [];
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
  console.log(`corpus: ${Object.entries(corpus).map(([k, v]) => `${k}=${v}`).join(", ")}${opts.since === undefined ? "" : `   since: ${opts.since}`}`);
  if (entries.length === 0) {
    console.log(`no records found in ${corpora.map((c) => c.dir).join(", ") || process.cwd()}`);
  } else {
    console.log(aggregates.map(([s, agg]) => s.renderText(agg)).join("\n\n"));
  }
  if (entries.length && skipped.length) console.log("");
  if (entries.length) for (const s of skipped) console.log(`skipped: ${s.file}: ${s.reason}`);
}

main();
