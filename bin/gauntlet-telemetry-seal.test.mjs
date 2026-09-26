import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, chmodSync, realpathSync, symlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const CLI = join(dirname(fileURLToPath(import.meta.url)), "gauntlet-telemetry-seal.mjs");
const SPEC = "doc/specs/x.md";
const REC = ".pi/gauntlet/telemetry/doc/specs/x.yaml";
const RECORD = [
  "schema: 1",
  "spec: doc/specs/x.md",
  "run_id: r-1",
  "status: in_progress",
  "created_at: 2026-09-17T16:00:00Z",
  "sessions: [s1]",
  "derived:",
  "  duration_s: 60",
  "  phases: {}",
  "  personas: {}",
  "  conformance_loops: 0",
  "  gates: { spec_rounds: 0, plan_rounds: 0, fix_round_grants: 0, task_reopens: 0 }",
  "  amendments: 0",
  "  spec_edits_after_ship: 0",
  "  spec_writes: {}",
  "  events_dropped: 0",
  "accumulators: {}",
  "events:",
  "  - { ts: 2026-09-17T16:00:00Z, session: s1, phase: brainstorm, kind: phase, action: start, name: brainstorm }",
  "",
].join("\n");
const SEALED = RECORD.replace("status: in_progress", "status: shipped\nshipped_at: 2026-09-17T18:00:00Z");

const git = (cwd, args, env = {}) =>
  spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", ...args], { cwd, encoding: "utf8", env: { ...process.env, ...env } });
const out = (cwd, args) => git(cwd, args).stdout.trim();
const write = (root, rel, text) => {
  mkdirSync(join(root, dirname(rel)), { recursive: true });
  writeFileSync(join(root, rel), text);
};
const commit = (root, msg, ...paths) => {
  git(root, ["add", "-f", "--", ...paths]);
  git(root, ["commit", "-q", "-m", msg, "--", ...paths]);
  return out(root, ["rev-parse", "HEAD"]);
};
// main: README only. feat: spec + src/a.ts; the record is untracked unless a test commits it.
const repo = (options = {}) => {
  const record = Object.hasOwn(options, "record") ? options.record : RECORD;
  const root = mkdtempSync(join(tmpdir(), "gts-"));
  git(root, ["init", "-q", "-b", "main"]);
  write(root, "README.md", "# fixture\n");
  commit(root, "init", "README.md");
  git(root, ["checkout", "-q", "-b", "feat"]);
  write(root, SPEC, "# Spec X\n\n**Goal:** g.\n");
  write(root, "src/a.ts", "export const a = 1;\n");
  commit(root, "Add spec and code", SPEC, "src/a.ts");
  if (record !== undefined) write(root, REC, record);
  return root;
};
const EMPTY_AGENT = mkdtempSync(join(tmpdir(), "gts-empty-agent-"));
process.on("exit", () => rmSync(EMPTY_AGENT, { recursive: true, force: true }));
const IDENTITY = { GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@t", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@t" };
const invoke = (args, env = {}) => {
  const r = spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8", env: { ...process.env, ...IDENTITY, PI_CODING_AGENT_DIR: EMPTY_AGENT, ...env } });
  return { status: r.status, stdout: r.stdout.trim(), stderr: r.stderr.trim(), lines: r.stdout.split("\n").filter(Boolean) };
};
const run = (root, args = [], env = {}) => invoke(["--worktree", root, "--option", "squash", "--base", "main", ...args], env);
const head = (root) => out(root, ["rev-parse", "HEAD"]);
const commitCount = (root) => Number(out(root, ["rev-list", "--count", "HEAD"]));
const headSubject = (root) => out(root, ["log", "-1", "--format=%s"]);
const headFiles = (root) => out(root, ["show", "--name-only", "--format=", "HEAD"]).split("\n").filter(Boolean);
const porcelain = (root) => out(root, ["status", "--porcelain", "--untracked-files=all"]);
const record = (root) => parseYaml(readFileSync(join(root, REC), "utf8"));
const cleanup = (t, ...roots) => t.after(() => roots.forEach((r) => rmSync(r, { recursive: true, force: true })));

test("seals an untracked in_progress record: stamp, ship event, diff, re-derived duration, one telemetry: commit touching only the record", (t) => {
  const root = repo(); cleanup(t, root);
  const n = commitCount(root);
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
  const rec = record(root);
  assert.equal(rec.status, "shipped");
  assert.match(rec.shipped_at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  assert.equal(rec.derived.gates.ship_option, "squash");
  assert.equal(typeof rec.derived.gates.ship_option, "string");
  assert.equal(rec.events.at(-1).kind, "ship");
  assert.equal(rec.events.at(-1).option, "squash");
  assert.deepEqual(rec.derived.modified_files, ["src/a.ts"]);
  assert.equal(rec.derived.diff.commits, 1, "the seal commit is excluded from the count");
  assert.equal(rec.derived.diff.buckets.code.files, 1);
  // created_at is 2026-09-17; sealing now re-derives duration_s from created_at to shipped_at, far above the recorded 60.
  assert.ok(rec.derived.duration_s > 60, `duration re-derived at seal time, got ${rec.derived.duration_s}`);
  assert.equal(commitCount(root), n + 1);
  assert.equal(headSubject(root), `telemetry: ${SPEC}`);
  assert.deepEqual(headFiles(root), [REC]);
  assert.equal(porcelain(root), "");
});

test("--spec accepts an absolute path within the checkout", (t) => {
  const root = repo(); cleanup(t, root);
  const r = run(root, ["--spec", join(realpathSync(root), SPEC)]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
});

test("--spec absolute through a symlinked prefix still resolves to the repo-relative record", (t) => {
  const root = repo();
  const linkDir = mkdtempSync(join(tmpdir(), "gts-link-"));
  cleanup(t, root, linkDir);
  const link = join(linkDir, "checkout");
  symlinkSync(root, link);
  const r = run(root, ["--spec", join(link, SPEC)]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
});

test("--spec accepts a dot-relative path", (t) => {
  const root = repo(); cleanup(t, root);
  const r = run(root, ["--spec", `./${SPEC}`]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
});

test("--option pr is recorded; without --spec the candidates are the existing records of changed specs", (t) => {
  const root = repo(); cleanup(t, root);
  const r = invoke(["--worktree", root, "--option", "pr", "--base", "main"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
  assert.equal(record(root).derived.gates.ship_option, "pr");
});

test("already sealed: a shipped, tracked, clean record is left alone", (t) => {
  const root = repo({ record: SEALED }); cleanup(t, root);
  commit(root, "telemetry: doc/specs/x.md", REC);
  const before = head(root);
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`already sealed ${REC}`]);
  assert.equal(head(root), before);
  assert.equal(record(root).shipped_at, "2026-09-17T18:00:00Z");
});

test("an abandoned record is already sealed even when untracked", (t) => {
  const root = repo({ record: RECORD.replace("status: in_progress", "status: abandoned") }); cleanup(t, root);
  const before = head(root);
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`already sealed ${REC}`]);
  assert.equal(head(root), before);
  assert.equal(record(root).status, "abandoned");
});

test("a shipped but untracked record (previous commit failed) is committed as is on retry", (t) => {
  const root = repo({ record: SEALED }); cleanup(t, root);
  const n = commitCount(root);
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
  assert.equal(commitCount(root), n + 1);
  assert.equal(record(root).shipped_at, "2026-09-17T18:00:00Z", "bytes committed as they were");
  assert.equal(porcelain(root), "");
});

test("--spec with no record -> no record at <path>, exit 2, no commit", (t) => {
  const root = repo({ record: undefined }); cleanup(t, root);
  const n = commitCount(root);
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 2);
  assert.equal(r.stderr, `no record at ${REC}`);
  assert.equal(commitCount(root), n);
});

test("unparseable record -> parser message, exit 2, file untouched", (t) => {
  const root = repo({ record: "schema: 1\nspec: doc/specs/x.md\n" }); cleanup(t, root);
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, new RegExp(`^unparseable record ${REC.replace(/\./g, "\\.")}`));
  assert.equal(readFileSync(join(root, REC), "utf8"), "schema: 1\nspec: doc/specs/x.md\n");
});

test("no telemetry run: a changed spec without a record is not a candidate (supersession edit)", (t) => {
  const root = repo({ record: undefined }); cleanup(t, root);
  const r = run(root);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, ["no telemetry run"]);
});

test("telemetry disabled -> exit 0, nothing touched", (t) => {
  const root = repo(); cleanup(t, root);
  write(root, ".pi/settings.json", JSON.stringify({ piGauntlet: { telemetry: { enabled: false } } }));
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, ["telemetry disabled"]);
  assert.equal(record(root).status, "in_progress");
});

test("gitignored telemetry dir is staged with -f", (t) => {
  const root = repo(); cleanup(t, root);
  write(root, ".gitignore", ".pi/gauntlet/telemetry/\n");
  commit(root, "ignore telemetry", ".gitignore");
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(headFiles(root), [REC]);
});

test("commit failure (rejecting pre-commit hook) restores the pre-seal bytes, unstages, exits 1", (t) => {
  const root = repo(); cleanup(t, root);
  const hook = join(root, ".git/hooks/pre-commit");
  writeFileSync(hook, "#!/bin/sh\necho rejected >&2\nexit 1\n");
  chmodSync(hook, 0o755);
  const n = commitCount(root);
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /rejected/);
  assert.equal(readFileSync(join(root, REC), "utf8"), RECORD, "pre-seal bytes restored");
  assert.equal(out(root, ["diff", "--cached", "--name-only"]), "", "nothing left staged");
  assert.equal(commitCount(root), n);
});

test("commit failure restores a previously tracked record and clears the index", (t) => {
  const root = repo(); cleanup(t, root);
  commit(root, "Track ongoing telemetry", REC);
  const hook = join(root, ".git/hooks/pre-commit");
  writeFileSync(hook, "#!/bin/sh\necho rejected >&2\nexit 1\n");
  chmodSync(hook, 0o755);
  const n = commitCount(root);
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /rejected/);
  assert.equal(readFileSync(join(root, REC), "utf8"), RECORD);
  assert.equal(out(root, ["diff", "--cached", "--name-only"]), "");
  assert.equal(commitCount(root), n);
});

test("usage and environment errors exit 1", (t) => {
  const root = repo(); cleanup(t, root);
  const noArgs = invoke([]);
  assert.equal(noArgs.status, 1);
  assert.match(noArgs.stderr, /^usage: gauntlet-telemetry-seal --worktree <abs path> --option <pr\|squash> --base <ref> \[--spec <spec path inside the checkout>\] \[--dir <telemetry dir>\]/);
  assert.equal(invoke(["--worktree", root, "--option", "rebase", "--base", "main"]).status, 1);
  assert.equal(invoke(["--worktree", root, "--option", "squash"]).status, 1, "--base is required");
  const noBase = invoke(["--worktree", root, "--option", "squash", "--base", "nope"]);
  assert.equal(noBase.status, 1);
  assert.equal(noBase.stderr, "no base ref nope");
  for (const spec of ["/tmp/elsewhere/doc/specs/x.md", "README.md"]) {
    const invalid = run(root, ["--spec", spec]);
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /^usage:/);
  }
  write(root, ".pi/settings.json", JSON.stringify({ piGauntlet: { telemetry: { enabled: false } } }));
  const disabledInvalid = run(root, ["--spec", "/tmp/elsewhere/doc/specs/x.md"]);
  assert.equal(disabledInvalid.status, 1);
  assert.match(disabledInvalid.stderr, /^usage:/);
  const notGit = mkdtempSync(join(tmpdir(), "gts-nogit-")); cleanup(t, notGit);
  const ng = invoke(["--worktree", notGit, "--option", "squash", "--base", "main"]);
  assert.equal(ng.status, 1);
  assert.equal(ng.stderr, "not a git checkout");
});

test("--dir overrides the telemetry dir", (t) => {
  const root = repo({ record: undefined }); cleanup(t, root);
  write(root, "tele/doc/specs/x.yaml", RECORD);
  const r = run(root, ["--spec", SPEC, "--dir", "tele"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, ["sealed tele/doc/specs/x.yaml"]);
  assert.deepEqual(headFiles(root), ["tele/doc/specs/x.yaml"]);
});
