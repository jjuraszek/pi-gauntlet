#!/usr/bin/env node
// Seal a gauntlet telemetry record at finish: stamp shipped, compute the ship diff,
// re-derive, and commit the record once as `telemetry: <spec>`. The recorder never
// commits; on git this is the only place the record enters git history. A plain jj
// workspace (no .git) has no commit step: jj snapshots the stamped record into the
// working copy. All git/jj dispatch lives in extensions/lib/vcs.ts.
import { existsSync, readdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, relative } from "node:path";
import process from "node:process";
import { mergeGauntlet, planDirsFor, resolveFlowGuards, resolveTelemetry } from "../../extensions/lib/gauntlet-settings.ts";
import { recordPathFor, repoRelativeToolPath, toPosix } from "../../extensions/lib/telemetry-paths.ts";
import { changedNames, commitRecordFile, computeShipDiff, recordSealed, validateBase, vcsFor } from "../../extensions/lib/vcs.ts";
import { derive, parseRecord, serializeRecord } from "../../extensions/lib/telemetry-record.ts";

const OPTIONS = new Set(["pr", "squash"]);

const fail = (code, message) => {
  process.stderr.write(message + "\n");
  process.exit(code);
};
const usage = () => fail(1, "usage: gauntlet-telemetry-seal --worktree <abs path> --option <pr|squash> --base <ref> [--spec <spec path inside the checkout>] [--dir <telemetry dir>]");

function parseArgs(argv) {
  const opts = { worktree: undefined, option: undefined, base: undefined, spec: undefined, dir: undefined };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const value = argv[i + 1];
    const takes = (key) => {
      if (value === undefined || value.startsWith("--")) usage();
      opts[key] = argv[++i];
    };
    if (a === "--worktree") takes("worktree");
    else if (a === "--option") takes("option");
    else if (a === "--base") takes("base");
    else if (a === "--spec") takes("spec");
    else if (a === "--dir") takes("dir");
    else usage();
  }
  if (!opts.worktree || !isAbsolute(opts.worktree) || !opts.base || !OPTIONS.has(opts.option)) usage();
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

// Resolves piGauntlet.telemetry and the spec/plan dirs from the same two layers
// the recorder reads (gauntlet-settings-loader.ts), without the pi import.
function settings(root) {
  const agentDir = process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
  const preset = readLayer(join(agentDir, "settings.json"));
  const repo = readLayer(join(root, ".pi", "settings.json"));
  const merged = mergeGauntlet(preset?.piGauntlet, repo?.piGauntlet);
  return { telemetry: resolveTelemetry(merged), planDirs: planDirsFor(resolveFlowGuards(merged).specDirs) };
}

function walkRecords(absDir) {
  if (!existsSync(absDir)) return [];
  const out = [];
  for (const e of readdirSync(absDir, { withFileTypes: true })) {
    const p = join(absDir, e.name);
    if (e.isDirectory()) out.push(...walkRecords(p));
    else if (e.isFile() && e.name.endsWith(".yaml")) out.push(p);
  }
  return out;
}

const isoNow = () => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

async function seal(vcs, rec, o) {
  const abs = join(vcs.root, rec);
  if (!existsSync(abs)) fail(2, `no record at ${rec}`);
  const prior = readFileSync(abs);
  const parsed = parseRecord(prior.toString("utf8"));
  if (!parsed) fail(2, `unparseable record ${rec}: schema 1 with spec and run_id required`);
  if (parsed.status !== "in_progress") {
    if (parsed.status !== "shipped" || recordSealed(vcs, rec)) return console.log(`already sealed ${rec}`);
    // A previous seal stamped the file but its commit failed: commit the bytes as they are.
  } else {
    const now = isoNow();
    parsed.status = "shipped";
    parsed.shipped_at = now;
    parsed.events.push({ ts: now, session: parsed.sessions.at(-1) ?? "seal", phase: "ship", kind: "ship", option: o.option });
    const out = await computeShipDiff(vcs, { spec: parsed.spec, dir: o.dir, buckets: o.buckets, base: o.base, planDirs: o.planDirs });
    if (out.warning) parsed.events.push({ ts: now, session: parsed.sessions.at(-1) ?? "seal", phase: "ship", kind: "warning", message: out.warning });
    parsed.derived.diff = out.diff;
    parsed.derived.modified_files = out.modified_files;
    parsed.derived = derive(parsed, now); // derive(rec, shipped_at): duration_s and gates.ship_option consistent at seal time
    writeFileSync(abs, serializeRecord(parsed));
  }
  const commit = commitRecordFile(vcs, rec, `telemetry: ${parsed.spec}`);
  if (!commit.ok) {
    // Restore the pre-seal bytes on add/commit (jj: file track) failure.
    writeFileSync(abs, prior);
    fail(1, `seal failed ${rec}: ${commit.stderr}`);
  }
  console.log(`sealed ${rec}`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const override = opts.dir === undefined ? undefined : resolveTelemetry({ telemetry: { enabled: true, dir: opts.dir } });
  if (override?.warning) usage();
  const vcs = existsSync(opts.worktree) ? vcsFor(opts.worktree) : undefined;
  if (!vcs) fail(1, "not a git or jj checkout");
  const root = vcs.root;
  let rel;
  if (opts.spec) {
    // root is the resolved toplevel; an absolute --spec may spell a symlinked prefix.
    const specAbs = isAbsolute(opts.spec) && existsSync(opts.spec) ? realpathSync(opts.spec) : opts.spec;
    rel = repoRelativeToolPath(root, root, specAbs);
    if (!rel) usage();
  }
  const { telemetry, planDirs } = settings(root);
  if (telemetry.warning) process.stderr.write(`warning: ${telemetry.warning}\n`);
  if (!telemetry.enabled) return console.log("telemetry disabled");
  const dir = override?.dir ?? telemetry.dir;
  if (!validateBase(vcs, opts.base)) fail(1, `no base ref ${opts.base}`);
  const o = { option: opts.option, base: opts.base, dir, buckets: telemetry.buckets, planDirs };
  if (opts.spec) return seal(vcs, recordPathFor(dir, rel), o);
  const diff = changedNames(vcs, opts.base);
  if (!diff.ok) fail(1, `${vcs.kind} diff failed: ${diff.stderr}`);
  const changed = new Set(diff.stdout.split("\n").filter(Boolean));
  const records = walkRecords(join(root, dir)).filter((abs) => {
    const parsed = parseRecord(readFileSync(abs, "utf8"));
    if (!parsed) process.stderr.write(`warning: unparseable record ${toPosix(relative(root, abs))}\n`);
    return parsed && changed.has(parsed.spec);
  }).map((abs) => toPosix(relative(root, abs))).sort();
  if (records.length === 0) return console.log("no telemetry run");
  for (const rec of records) await seal(vcs, rec, o);
}

await main();
