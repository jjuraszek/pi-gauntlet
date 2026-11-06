import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, realpathSync, symlinkSync, chmodSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { isolatedGitEnv } from "../extensions/test-support/git-env.mjs";

const CLI = join(dirname(fileURLToPath(import.meta.url)), "gauntlet-telemetry-seal.mjs");
const SPEC = "doc/specs/x.md";
const REC = ".git/gauntlet/telemetry/doc/specs/x.yaml";
const REF = "refs/heads/gauntlet/telemetry";
const BLOB = "team/product/brainstorming/doc/specs/x.yaml";
const RECORD = `schema: 1
spec: doc/specs/x.md
run_id: r-1
status: in_progress
created_at: 2026-09-17T16:00:00Z
sessions: [s1]
derived:
  duration_s: 60
  phases: {}
  personas: {}
  conformance_loops: 0
  gates: { spec_rounds: 0, plan_rounds: 0, fix_round_grants: 0, task_reopens: 0 }
  amendments: 0
  spec_edits_after_ship: 0
  spec_writes: {}
  events_dropped: 0
accumulators: {}
events:
  - { ts: 2026-09-17T16:00:00Z, session: s1, phase: brainstorm, kind: phase, action: start, name: brainstorm }
`;
const SEALED = RECORD.replace("status: in_progress", "status: shipped\nshipped_at: 2026-09-17T18:00:00Z");
const EMPTY_AGENT = mkdtempSync(join(tmpdir(), "gts-env-"));
const GIT_ENV = isolatedGitEnv(EMPTY_AGENT);
process.on("exit", () => rmSync(EMPTY_AGENT, { recursive: true, force: true }));
const git = (root, args) => {
  const r = spawnSync("git", ["-c", "commit.gpgsign=false", ...args], { cwd: root, encoding: "utf8", env: { ...process.env, ...GIT_ENV } });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
};
const write = (root, rel, text) => {
  mkdirSync(join(root, dirname(rel)), { recursive: true });
  writeFileSync(join(root, rel), text);
};
const commit = (root, ...paths) => {
  git(root, ["add", "--", ...paths]);
  git(root, ["commit", "-qm", "fixture"]);
};
const repo = (t, { record = RECORD, spec = SPEC } = {}) => {
  const root = mkdtempSync(join(tmpdir(), "gts-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  git(root, ["init", "-q", "-b", "main"]);
  git(root, ["remote", "add", "origin", "https://example.test/team/product.git"]);
  git(root, ["config", `url.${root}.insteadOf`, "https://example.test/team/product.git"]);
  write(root, "README.md", "# fixture\n");
  commit(root, "README.md");
  git(root, ["checkout", "-qb", "feat"]);
  write(root, spec, "# Spec\n\n**Goal:** g.\n");
  write(root, "src/a.ts", "export const a = 1;\n");
  write(root, "docs/plans/x.md", "# Plan\n");
  commit(root, spec, "src/a.ts", "docs/plans/x.md");
  if (record !== null) write(root, `.git/gauntlet/telemetry/${spec.replace(/\.md$/, ".yaml")}`, record.replace(`spec: ${SPEC}`, `spec: ${spec}`));
  return root;
};
const invoke = (args, env = {}) => {
  const r = spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8", env: { ...process.env, ...GIT_ENV, PI_CODING_AGENT_DIR: EMPTY_AGENT, ...env } });
  return { status: r.status, stderr: r.stderr.trim(), lines: r.stdout.split("\n").filter(Boolean) };
};
const run = (root, args = [], env = {}) => invoke(["--worktree", root, "--option", "squash", "--base", "main", ...args], env);
const blob = (root, spec = SPEC) => git(root, ["show", `${REF}:team/product/brainstorming/${spec.replace(/\.md$/, ".yaml")}`]);
const record = (root) => parseYaml(blob(root));
const head = (root) => git(root, ["rev-parse", "HEAD"]);
const recPath = (root, spec = SPEC) => join(realpathSync(root), `.git/gauntlet/telemetry/${spec.replace(/\.md$/, ".yaml")}`);

test("seals the common-dir record: stamp, ship event, diff and re-derived duration in an orphan commit only", (t) => {
  const root = repo(t);
  const before = head(root);
  const index = readFileSync(join(root, ".git/index"));
  const r = run(root, ["--spec", SPEC]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${recPath(root)}`]);
  const rec = record(root);
  assert.equal(rec.status, "shipped");
  assert.match(rec.shipped_at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  assert.equal(rec.derived.gates.ship_option, "squash");
  assert.equal(rec.events.at(-1).kind, "ship");
  assert.equal(rec.events.at(-1).option, "squash");
  assert.deepEqual(rec.derived.modified_files, ["src/a.ts"]);
  assert.equal(rec.derived.diff.commits, 1);
  assert.equal(rec.derived.diff.buckets.code.files, 1);
  assert.ok(rec.derived.duration_s > 60);
  assert.equal(head(root), before);
  assert.deepEqual(readFileSync(join(root, ".git/index")), index);
  assert.equal(git(root, ["status", "--porcelain"]), "");
  assert.equal(git(root, ["rev-list", "--parents", "-1", REF]).split(" ").length, 1);
  assert.equal(git(root, ["ls-tree", "-r", "--name-only", REF]), BLOB);
  assert.equal(existsSync(join(root, REC)), false, "in-flight file removed only after commit");
});

test("shipped CLI records companion legs and validates complete retry sets", (t) => {
  const root = repo(t);
  const args = ["--spec", SPEC, "--leg", "repo-b=abc1234", "--leg", "repo-c=https://example.test/pull/2?q=yes"];
  assert.equal(run(root, args).status, 0);
  assert.deepEqual(record(root).legs, [{ repo: "repo-b", sha: "abc1234" }, { repo: "repo-c", pr: "https://example.test/pull/2?q=yes" }]);
  const tip = git(root, ["rev-parse", REF]);
  assert.equal(run(root, ["--spec", SPEC, "--leg", args[5], "--leg", args[3]]).status, 0);
  for (const legs of [[], ["--leg", "repo-b=abc1234"], ["--leg", "repo-b=changed", "--leg", args[5]]]) {
    const retry = run(root, ["--spec", SPEC, ...legs]);
    assert.equal(retry.status, 1);
    assert.match(retry.stderr, /legs differ/);
  }
  assert.equal(git(root, ["rev-parse", REF]), tip);
});

test("shipped CLI rejects malformed leg values before sealing", () => {
  for (const value of ["missing", "=abc", "repo=", "repo= "]) {
    const r = invoke(["--leg", value]);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /invalid --leg/);
    assert.ok(r.stderr.includes(value.trim()));
  }
});

test("docs/specs records seal with explicit and changed-spec selection, excluding plans", async (t) => {
  for (const explicit of [true, false]) await t.test(explicit ? "explicit" : "discovered", (t) => {
    const spec = "docs/specs/y.md";
    const root = repo(t, { spec });
    const r = run(root, explicit ? ["--spec", spec] : []);
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(r.lines, [`sealed ${recPath(root, spec)}`]);
    assert.deepEqual(parseYaml(blob(root, spec)).derived.modified_files, ["src/a.ts"]);
  });
});

test("unrelated and malformed records do not prevent changed-spec selection", (t) => {
  const root = repo(t);
  write(root, ".git/gauntlet/telemetry/bad.yaml", "schema: 1\nspec: bad.md\n");
  write(root, ".git/gauntlet/telemetry/doc/specs/other.yaml", RECORD.replace(SPEC, "doc/specs/other.md"));
  const r = run(root);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${recPath(root)}`]);
  assert.equal(existsSync(join(root, ".git/gauntlet/telemetry/bad.yaml")), true);
  assert.equal(git(root, ["ls-tree", "-r", "--name-only", REF]), BLOB);
});

test("seal preserves derived.council through the shipped stamp", (t) => {
  const council = { chair: { model: "p/chair:medium", dispatches: 1, clusters: 0, members_reported: 0 }, members: {} };
  const root = repo(t, { record: RECORD.replace("  spec_writes: {}", `  council: ${JSON.stringify(council)}\n  spec_writes: {}`) });
  assert.equal(run(root, ["--spec", SPEC]).status, 0);
  assert.deepEqual(record(root).derived.council, council);
});

test("--spec resolves absolute, symlinked and dot-relative checkout paths", async (t) => {
  for (const form of ["absolute", "symlink", "relative"]) await t.test(form, (t) => {
    const root = repo(t);
    const links = mkdtempSync(join(tmpdir(), "gts-link-"));
    t.after(() => rmSync(links, { recursive: true, force: true }));
    symlinkSync(root, join(links, "checkout"));
    const spec = form === "absolute" ? join(realpathSync(root), SPEC) : form === "symlink" ? join(links, "checkout", SPEC) : `./${SPEC}`;
    const r = run(root, ["--spec", spec]);
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(r.lines, [`sealed ${recPath(root)}`]);
  });
});

test("--option pr is recorded when discovering existing changed-spec records", (t) => {
  const root = repo(t);
  const r = invoke(["--worktree", root, "--option", "pr", "--base", "main"]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(record(root).derived.gates.ship_option, "pr");
});

test("shipped in-flight bytes commit as is, then branch-only retry is a no-op", (t) => {
  const root = repo(t, { record: SEALED });
  const before = head(root);
  const r = run(root);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.lines, [`sealed ${recPath(root)}`]);
  assert.equal(blob(root), SEALED.trim());
  const tip = git(root, ["rev-parse", REF]);
  assert.deepEqual(run(root, ["--spec", SPEC]).lines, [`already sealed ${recPath(root)}`]);
  assert.equal(git(root, ["rev-parse", REF]), tip);
  assert.equal(head(root), before);
});

test("abandoned in-flight records publish without a shipped stamp", (t) => {
  const root = repo(t, { record: RECORD.replace("status: in_progress", "status: abandoned") });
  assert.equal(run(root, ["--spec", SPEC]).status, 0);
  assert.equal(record(root).status, "abandoned");
  assert.equal(record(root).shipped_at, undefined);
});

test("missing runs and malformed records are non-blocking and remain untouched", async (t) => {
  for (const content of [null, "schema: 1\nspec: doc/specs/x.md\n"]) await t.test(content === null ? "missing" : "malformed", (t) => {
    const root = repo(t, { record: content });
    for (const args of [["--spec", SPEC], []]) {
      const r = run(root, args);
      assert.equal(r.status, 0, r.stderr);
      assert.match(r.lines.join("\n"), content === null ? /no telemetry run/ : /telemetry: skipped \(unparseable record/);
    }
    if (content !== null) assert.equal(readFileSync(recPath(root), "utf8"), content);
  });
});

test("telemetry disabled leaves the common-dir record untouched", (t) => {
  const root = repo(t);
  write(root, ".pi/settings.json", JSON.stringify({ piGauntlet: { telemetry: { enabled: false } } }));
  assert.deepEqual(run(root, ["--spec", SPEC]).lines, ["telemetry disabled"]);
  assert.equal(readFileSync(recPath(root), "utf8"), RECORD);
});

test("failed branch commit keeps the shipped in-flight record for a successful retry", (t) => {
  const root = repo(t);
  const before = head(root);
  const index = readFileSync(join(root, ".git/index"));
  const hook = ".git/hooks/reference-transaction";
  write(root, hook, '#!/bin/sh\nif [ "$1" = prepared ]; then echo rejected >&2; exit 1; fi\n');
  chmodSync(join(root, hook), 0o755);
  const failed = run(root, ["--spec", SPEC]);
  assert.equal(failed.status, 0, failed.stderr);
  assert.match(failed.lines.join("\n"), /telemetry: not pushed/);
  const kept = readFileSync(recPath(root), "utf8");
  assert.equal(parseYaml(kept).status, "shipped");
  assert.equal(head(root), before);
  assert.deepEqual(readFileSync(join(root, ".git/index")), index);
  write(root, hook, "#!/bin/sh\nexit 0\n");
  const retried = run(root, ["--spec", SPEC]);
  assert.equal(retried.status, 0, retried.stderr);
  assert.deepEqual(retried.lines, [`sealed ${recPath(root)}`]);
  assert.equal(blob(root), kept.trim());
  assert.equal(existsSync(recPath(root)), false);
});

test("checkout hooks do not run for plumbing-only telemetry commits", (t) => {
  const root = repo(t);
  write(root, ".git/hooks/pre-commit", "#!/bin/sh\necho rejected >&2\nexit 1\n");
  chmodSync(join(root, ".git/hooks/pre-commit"), 0o755);
  assert.equal(run(root, ["--spec", SPEC]).status, 0);
  assert.equal(record(root).status, "shipped");
});

test("usage and environment errors exit 1", (t) => {
  const root = repo(t);
  assert.match(invoke([]).stderr, /^usage: gauntlet-telemetry-seal/);
  assert.equal(invoke(["--worktree", root, "--option", "rebase", "--base", "main"]).status, 1);
  assert.equal(invoke(["--worktree", root, "--option", "squash"]).status, 1);
  assert.equal(run(root, ["--base", "nope"]).stderr, "no base ref nope");
  assert.match(run(root, ["--spec", "/tmp/elsewhere/doc/specs/x.md"]).stderr, /^usage:/);
  const noGit = mkdtempSync(join(tmpdir(), "gts-nogit-"));
  t.after(() => rmSync(noGit, { recursive: true, force: true }));
  assert.equal(run(noGit).stderr, "not a git or jj checkout");
});
