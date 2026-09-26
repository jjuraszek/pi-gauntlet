#!/usr/bin/env node
// Seal a gauntlet telemetry record at finish: stamp shipped, compute the ship diff,
// re-derive, and commit the record once as `telemetry: <spec>`. The recorder never
// commits; this is the only place the record enters git history.
import { existsSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";
import { mergeGauntlet, resolveTelemetry } from "../../extensions/lib/gauntlet-settings.ts";
import { isSpecPath, recordPathFor, repoRelativeToolPath } from "../../extensions/lib/telemetry-paths.ts";
import { computeGitDiff } from "../../extensions/lib/telemetry-diff.ts";
import { derive, parseRecord, serializeRecord } from "../../extensions/lib/telemetry-record.ts";

const GIT_TIMEOUT_MS = 10_000;
const COMMIT_TIMEOUT_MS = 30_000;
const GIT_ENV = { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_EDITOR: "true" };
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

function git(cwd, args, timeout = GIT_TIMEOUT_MS) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", env: GIT_ENV, timeout });
  const timedOut = r.error?.code === "ETIMEDOUT";
  const stderr = timedOut ? "timed out" : (r.stderr ?? "").trim().split("\n")[0] || r.error?.message || `git exited ${r.status}`;
  return { ok: !timedOut && r.status === 0, code: timedOut ? 1 : (r.status ?? 1), stdout: (r.stdout ?? "").trim(), stderr };
}
const gitRunner = (args, cwd) => {
  const r = git(cwd, args);
  return { code: r.code, stdout: r.stdout, stderr: r.stderr };
};

function readLayer(file) {
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    process.stderr.write(`warning: ${file}: ${e.message}; using {} for this layer\n`);
    return {};
  }
}

// Resolves piGauntlet.telemetry from the same two layers the recorder reads
// (gauntlet-settings-loader.ts), without the pi import.
function telemetrySettings(root) {
  const agentDir = process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
  const preset = readLayer(join(agentDir, "settings.json"));
  const repo = readLayer(join(root, ".pi", "settings.json"));
  return resolveTelemetry(mergeGauntlet(preset?.piGauntlet, repo?.piGauntlet));
}

const isoNow = () => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

// A shipped record is already sealed when tracked and clean (git ls-files --error-unmatch, git diff --quiet HEAD).
const trackedAndClean = (root, rec) =>
  git(root, ["ls-files", "--error-unmatch", "--", rec]).ok && git(root, ["diff", "--quiet", "HEAD", "--", rec]).ok;

async function seal(root, rec, o) {
  const abs = join(root, rec);
  if (!existsSync(abs)) fail(2, `no record at ${rec}`);
  const prior = readFileSync(abs);
  const parsed = parseRecord(prior.toString("utf8"));
  if (!parsed) fail(2, `unparseable record ${rec}: schema 1 with spec and run_id required`);
  if (parsed.status !== "in_progress") {
    if (parsed.status !== "shipped" || trackedAndClean(root, rec)) return console.log(`already sealed ${rec}`);
    // A previous seal stamped the file but its commit failed: commit the bytes as they are.
  } else {
    const now = isoNow();
    parsed.status = "shipped";
    parsed.shipped_at = now;
    parsed.events.push({ ts: now, session: parsed.sessions.at(-1) ?? "seal", phase: "ship", kind: "ship", option: o.option });
    const out = await computeGitDiff({ git: gitRunner, cwd: root, spec: parsed.spec, dir: o.dir, buckets: o.buckets, base: o.base });
    if (out.warning) parsed.events.push({ ts: now, session: parsed.sessions.at(-1) ?? "seal", phase: "ship", kind: "warning", message: out.warning });
    parsed.derived.diff = out.diff;
    parsed.derived.modified_files = out.modified_files;
    parsed.derived = derive(parsed, now); // derive(rec, shipped_at): duration_s and gates.ship_option consistent at seal time
    writeFileSync(abs, serializeRecord(parsed));
  }
  // Restore the pre-seal bytes on add/commit failure.
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
  const override = opts.dir === undefined ? undefined : resolveTelemetry({ telemetry: { enabled: true, dir: opts.dir } });
  if (override?.warning) usage();
  const top = existsSync(opts.worktree) ? git(opts.worktree, ["rev-parse", "--show-toplevel"]) : { ok: false };
  if (!top.ok) fail(1, "not a git checkout");
  const root = top.stdout;
  let rel;
  if (opts.spec) {
    // root is git's realpath'd toplevel; an absolute --spec may spell a symlinked prefix.
    const specAbs = isAbsolute(opts.spec) && existsSync(opts.spec) ? realpathSync(opts.spec) : opts.spec;
    rel = repoRelativeToolPath(root, root, specAbs);
    if (!rel || !isSpecPath(rel)) usage();
  }
  const telemetry = telemetrySettings(root);
  if (telemetry.warning) process.stderr.write(`warning: ${telemetry.warning}\n`);
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
