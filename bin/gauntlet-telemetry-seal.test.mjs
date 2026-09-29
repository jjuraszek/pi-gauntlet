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
const SPEC2 = "docs/specs/y.md";
const REC2 = ".pi/gauntlet/telemetry/docs/specs/y.yaml";
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
const docsRepo = () => {
  const root = mkdtempSync(join(tmpdir(), "gts-"));
  git(root, ["init", "-q", "-b", "main"]);
  write(root, "README.md", "# fixture\n");
  commit(root, "init", "README.md");
  git(root, ["checkout", "-q", "-b", "feat"]);
  write(root, SPEC2, "# Spec Y\n\n**Goal:** g.\n");
  write(root, "src/a.ts", "export const a = 1;\n");
  write(root, "docs/plans/x.md", "# Plan X\n");
  commit(root, "Add spec and code", SPEC2, "src/a.ts", "docs/plans/x.md");
  write(root, REC2, RECORD.replace("spec: doc/specs/x.md", `spec: ${SPEC2}`));
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

test("docs/specs record seals with --spec (no path classification)", (t) => {
  const root = docsRepo(); cleanup(t, root);
  const r = run(root, ["--spec", SPEC2]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC2}`]);
});

test("docs/specs record seals without --spec: candidates are records whose spec: is in the changed set", (t) => {
  const root = docsRepo(); cleanup(t, root);
  const r = run(root);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC2}`]);
  const rec = parseYaml(readFileSync(join(root, REC2), "utf8"));
  assert.ok(!rec.derived.modified_files.includes("docs/plans/x.md"), "docs/plans excluded from modified_files");
});

test("renamed spec still selects the record at its old path", (t) => {
  const root = mkdtempSync(join(tmpdir(), "gts-")); cleanup(t, root);
  git(root, ["init", "-q", "-b", "main"]);
  write(root, SPEC, "# Spec X\n\n**Goal:** g.\n");
  commit(root, "Add original spec", SPEC);
  git(root, ["checkout", "-q", "-b", "feat"]);
  assert.equal(git(root, ["mv", SPEC, "doc/specs/renamed.md"]).status, 0);
  commit(root, "Rename spec", SPEC, "doc/specs/renamed.md");
  write(root, REC, RECORD);
  const r = run(root);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
});

test("unparseable walked record warns while another candidate seals", (t) => {
  const root = repo(); cleanup(t, root);
  const bad = ".pi/gauntlet/telemetry/bad.yaml";
  write(root, bad, "schema: 1\nspec: doc/specs/x.md\n");
  const r = run(root);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stderr, `warning: unparseable record ${bad}`);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
});

test("shipped-but-uncommitted docs/specs record is committed on retry without --spec", (t) => {
  const root = docsRepo(); cleanup(t, root);
  write(root, REC2, RECORD.replace("spec: doc/specs/x.md", `spec: ${SPEC2}`).replace("status: in_progress", "status: shipped\nshipped_at: 2026-09-17T18:00:00Z"));
  const r = run(root);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC2}`]);
});

test("a record whose spec did not change on the branch is ignored", (t) => {
  const root = repo(); cleanup(t, root);
  write(root, ".pi/gauntlet/telemetry/doc/specs/other.yaml", RECORD.replace("spec: doc/specs/x.md", "spec: doc/specs/other.md"));
  const r = run(root);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
});

test("seal preserves derived.council through the shipped stamp", (t) => {
  const council = { chair: { model: "p/chair:medium", dispatches: 1, clusters: 0, members_reported: 0 }, members: {} };
  const root = repo({ record: RECORD.replace("  spec_writes: {}", `  council: ${JSON.stringify(council)}\n  spec_writes: {}`) }); cleanup(t, root);
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(record(root).status, "shipped");
  assert.deepEqual(record(root).derived.council, council);
  assert.deepEqual(parseYaml(out(root, ["show", `HEAD:${REC}`])).derived.council, council);
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
  const invalid = run(root, ["--spec", "/tmp/elsewhere/doc/specs/x.md"]);
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /^usage:/);
  const noRec = run(root, ["--spec", "README.md"]);
  assert.equal(noRec.status, 2);
  assert.equal(noRec.stderr, "no record at .pi/gauntlet/telemetry/README.yaml");
  write(root, ".pi/settings.json", JSON.stringify({ piGauntlet: { telemetry: { enabled: false } } }));
  const disabledInvalid = run(root, ["--spec", "/tmp/elsewhere/doc/specs/x.md"]);
  assert.equal(disabledInvalid.status, 1);
  assert.match(disabledInvalid.stderr, /^usage:/);
  const notGit = mkdtempSync(join(tmpdir(), "gts-nogit-")); cleanup(t, notGit);
  const ng = invoke(["--worktree", notGit, "--option", "squash", "--base", "main"]);
  assert.equal(ng.status, 1);
  assert.equal(ng.stderr, "not a git or jj checkout");
});

test("--dir overrides the telemetry dir", (t) => {
  const root = repo({ record: undefined }); cleanup(t, root);
  write(root, "tele/doc/specs/x.yaml", RECORD);
  const r = run(root, ["--spec", SPEC, "--dir", "tele"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, ["sealed tele/doc/specs/x.yaml"]);
  assert.deepEqual(headFiles(root), ["tele/doc/specs/x.yaml"]);
});

// --- Plain jj workspace (no .git). git and jj are PATH shims: git always fails
// rev-parse and only logs; jj answers from a per-test JSON script. CI has no jj.
const JJ_FORK = "f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9";
// src/a.ts: +10 -2; the spec and the record ride along to prove modified_files filters them out.
const JJ_PATCH = [
  "diff --git a/src/a.ts b/src/a.ts",
  "index 1111111..2222222 100644",
  "--- a/src/a.ts",
  "+++ b/src/a.ts",
  "@@ -1,4 +1,12 @@",
  ...Array.from({ length: 10 }, (_, i) => `+added ${i}`),
  "-removed 1",
  "-removed 2",
  " context",
  "diff --git a/doc/specs/x.md b/doc/specs/x.md",
  "new file mode 100644",
  "index 0000000..3333333",
  "--- /dev/null",
  "+++ b/doc/specs/x.md",
  "@@ -0,0 +1,5 @@",
  ...Array.from({ length: 5 }, (_, i) => `+spec ${i}`),
  "diff --git a/.pi/gauntlet/telemetry/doc/specs/x.yaml b/.pi/gauntlet/telemetry/doc/specs/x.yaml",
  "new file mode 100644",
  "index 0000000..4444444",
  "--- /dev/null",
  "+++ b/.pi/gauntlet/telemetry/doc/specs/x.yaml",
  "@@ -0,0 +1,3 @@",
  "+schema: 1",
  "+spec: doc/specs/x.md",
  "+run_id: r-1",
  "",
].join("\n");
const GIT_SHIM = (log) => `#!${process.execPath}
require("node:fs").appendFileSync(${JSON.stringify(log)}, "git " + process.argv.slice(2).join(" ") + "\\n");
process.stderr.write("fatal: not a git repository (or any of the parent directories): .git\\n");
process.exit(128);
`;
const JJ_SHIM = (log, scriptPath) => `#!${process.execPath}
const fs = require("node:fs");
const a = process.argv.slice(2);
fs.appendFileSync(${JSON.stringify(log)}, "jj " + a.join(" ") + "\\n");
const script = JSON.parse(fs.readFileSync(${JSON.stringify(scriptPath)}, "utf8"));
const s = a.join(" ");
const send = (r) => { const res = r ?? { code: 1, stderr: "unscripted jj call" }; process.stdout.write(res.stdout ?? ""); process.stderr.write(res.stderr ?? ""); process.exit(res.code ?? 0); };
if (s === "root") send(script.root);
if (s.includes("--limit")) send(script.base);
if (s.includes("--count")) send(script.count);
if (s.includes("fork_point(")) send(script.fork);
if (s.includes("--name-only")) send(script.names);
send(script.patch);
`;
const jjWorkspace = (t, script, { recordText = RECORD } = {}) => {
  const root = mkdtempSync(join(tmpdir(), "gts-jj-"));
  write(root, SPEC, "# Spec X\n\n**Goal:** g.\n");
  if (recordText !== undefined) write(root, REC, recordText);
  const shims = mkdtempSync(join(tmpdir(), "gts-shim-"));
  const log = join(shims, "calls.log");
  writeFileSync(log, "");
  const scriptPath = join(shims, "script.json");
  writeFileSync(scriptPath, JSON.stringify({ root: { code: 0, stdout: root + "\n" }, ...script }));
  for (const [name, body] of [["git", GIT_SHIM(log)], ["jj", JJ_SHIM(log, scriptPath)]]) {
    const p = join(shims, name);
    writeFileSync(p, body);
    chmodSync(p, 0o755);
  }
  cleanup(t, root, shims);
  return { root, log, env: { PATH: `${shims}:${process.env.PATH}` } };
};
const happyJj = {
  base: { code: 0, stdout: JJ_FORK + "\n" },
  fork: { code: 0, stdout: JJ_FORK + "\n" },
  count: { code: 0, stdout: "2\n" },
  patch: { code: 0, stdout: JJ_PATCH },
};

test("jj workspace: record stamped shipped from the jj diff, one git probe, no git writes, no commit step", (t) => {
  const { root, log, env } = jjWorkspace(t, happyJj);
  const r = run(root, ["--spec", SPEC], env);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
  const rec = record(root);
  assert.equal(rec.status, "shipped");
  assert.equal(rec.events.at(-1).kind, "ship");
  assert.equal(rec.events.at(-1).option, "squash");
  assert.deepEqual(rec.derived.modified_files, ["src/a.ts"], "spec and telemetry-dir paths filtered");
  assert.equal(rec.derived.diff.base, JJ_FORK);
  assert.equal(rec.derived.diff.commits, 2);
  assert.deepEqual(rec.derived.diff.buckets.code, { files: 1, insertions: 10, deletions: 2 });
  const calls = readFileSync(log, "utf8").split("\n").filter(Boolean);
  assert.deepEqual(calls.filter((c) => c.startsWith("git ")).map((c) => c.split(" ")[1]), ["rev-parse"], "git is only the failed checkout probe");
  assert.ok(calls.some((c) => c === "jj root"));
});

test("jj workspace with unresolved mainline: warning recorded, diff fields absent, record still sealed", (t) => {
  const { root, env } = jjWorkspace(t, { ...happyJj, fork: { code: 0, stdout: "" } });
  const r = run(root, ["--spec", SPEC], env);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${REC}`]);
  const rec = record(root);
  assert.equal(rec.status, "shipped");
  assert.ok(!("diff" in rec.derived) && !("modified_files" in rec.derived));
  assert.equal(rec.events.find((e) => e.kind === "warning")?.message, "diff omitted: jj mainline unresolved (trunk() is root(); no main/master bookmark)");
});

test("jj diff failure and unparseable patch each seal with a warning and no diff fields", (t) => {
  const failing = jjWorkspace(t, { ...happyJj, patch: { code: 1, stderr: "fatal: diff exploded\n" } });
  const r1 = run(failing.root, ["--spec", SPEC], failing.env);
  assert.equal(r1.status, 0, r1.stderr);
  let rec = record(failing.root);
  assert.equal(rec.status, "shipped");
  assert.ok(!("diff" in rec.derived) && !("modified_files" in rec.derived));
  assert.equal(rec.events.find((e) => e.kind === "warning")?.message, "diff omitted: jj diff failed: fatal: diff exploded");

  const garbage = jjWorkspace(t, { ...happyJj, patch: { code: 0, stdout: "not a git patch\n" } });
  const r2 = run(garbage.root, ["--spec", SPEC], garbage.env);
  assert.equal(r2.status, 0, r2.stderr);
  rec = record(garbage.root);
  assert.equal(rec.events.find((e) => e.kind === "warning")?.message, "diff omitted: jj diff unparseable");
});

test("jj workspace: an unresolvable or empty --base revset fails no base ref, exit 1", (t) => {
  const unknown = jjWorkspace(t, { ...happyJj, base: { code: 1, stderr: "Error: No such bookmark: nope\n" } });
  const r1 = invoke(["--worktree", unknown.root, "--option", "squash", "--base", "nope", "--spec", SPEC], unknown.env);
  assert.equal(r1.status, 1);
  assert.equal(r1.stderr, "no base ref nope");
  const empty = jjWorkspace(t, { ...happyJj, base: { code: 0, stdout: "" } });
  const r2 = invoke(["--worktree", empty.root, "--option", "squash", "--base", "none()"], empty.env);
  assert.equal(r2.status, 1);
  assert.equal(r2.stderr, "no base ref none()");
});

test("jj workspace without --spec discovers records from the jj fork-point diff", (t) => {
  const found = jjWorkspace(t, { ...happyJj, names: { code: 0, stdout: `${SPEC}\nsrc/a.ts\n` } });
  const r1 = run(found.root, [], found.env);
  assert.equal(r1.status, 0, r1.stderr);
  assert.deepEqual(r1.lines, [`sealed ${REC}`]);
  assert.ok(readFileSync(found.log, "utf8").includes(`jj --color=never diff --name-only --from ${JJ_FORK} --to @`));
  const none = jjWorkspace(t, { ...happyJj, names: { code: 0, stdout: "src/a.ts\n" } });
  const r2 = run(none.root, [], none.env);
  assert.equal(r2.status, 0, r2.stderr);
  assert.deepEqual(r2.lines, ["no telemetry run"]);
});

test("jj workspace: a shipped record is already sealed without any git checks", (t) => {
  const { root, log, env } = jjWorkspace(t, happyJj, { recordText: SEALED });
  const r = run(root, ["--spec", SPEC], env);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`already sealed ${REC}`]);
  assert.equal(record(root).shipped_at, "2026-09-17T18:00:00Z");
  const calls = readFileSync(log, "utf8").split("\n").filter(Boolean);
  assert.deepEqual(calls.filter((c) => c.startsWith("git ")).map((c) => c.split(" ")[1]), ["rev-parse"]);
});
