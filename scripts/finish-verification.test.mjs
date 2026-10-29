import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const skill = readFileSync(new URL("../skills/finishing-a-development-branch/SKILL.md", import.meta.url), "utf8");
const rule = skill.match(/\*\*Skip rule\.\*\*[^\n]+/)[0];
const commands = [...rule.matchAll(/`(git -C "\$WORKTREE"[^`]+)`/g)].map((m) => m[1]);
assert.ok(commands.length, "skip rule must contain executable Git checks");

test("ledger finish preserves verification, strip and amendment contracts", () => {
  assert.ok(skill.includes("# Ledger - loop engine"));
  assert.ok(skill.includes("verification:"));
  assert.ok(skill.includes("<spec stem>-ledger.md"));
  assert.match(skill, /--grep[^\n]*loop: cut row[^\n]*loop: amend/);
  assert.match(skill, /take the `auto-apply` and `granted` records from those commit bodies/);
});

for (const telemetry of [".pi/gauntlet/telemetry", "records/custom telemetry"]) {
  for (const scenario of [
    ["clean tree", true, () => {}],
    ["unstaged source edit", false, ({ write }) => write("source.txt", "changed")],
    ["staged source edit", false, ({ write, git }) => { write("source.txt", "changed"); git("add", "source.txt"); }],
    ["untracked source file", false, ({ write }) => write("new source.txt", "new")],
    ["committed source edit", false, ({ write, commit }) => { write("source.txt", "changed"); commit(); }],
    ["staged edit restored only in worktree", false, ({ write, git }) => { write("source.txt", "changed"); git("add", "source.txt"); write("source.txt", "original"); }],
    ["unstaged telemetry edit", true, ({ write }) => write(`${telemetry}/run.yaml`, "changed")],
    ["untracked telemetry file", true, ({ write }) => write(`${telemetry}/new.yaml`, "new")],
    ["committed telemetry edit", true, ({ write, commit }) => { write(`${telemetry}/run.yaml`, "changed"); commit(); }],
    ["telemetry-named sibling is not excluded", false, ({ write }) => write(`${telemetry}-other/source.txt`, "new")],
    ["unknown verified commit", false, ({ state }) => { state.sha = "missing-verified-commit"; }],
  ]) {
    const [name, maySkip, arrange] = scenario;
    test(`${telemetry}: ${name}`, () => {
      const worktree = mkdtempSync(join(tmpdir(), "finish-verification-"));
      const git = (...args) => execFileSync("git", ["-C", worktree, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
      const write = (path, value) => {
        mkdirSync(join(worktree, path, ".."), { recursive: true });
        writeFileSync(join(worktree, path), value);
      };
      const commit = () => { git("add", "."); git("commit", "-qm", "fixture"); };
      git("init", "-q");
      git("config", "user.name", "Fixture");
      git("config", "user.email", "fixture@example.invalid");
      git("config", "commit.gpgsign", "false");
      git("config", "core.hooksPath", "/dev/null");
      write("source.txt", "original");
      write(`${telemetry}/run.yaml`, "original");
      commit();
      const state = { sha: git("rev-parse", "HEAD") };
      arrange({ write, git, commit, state });
      const results = commands.map((command) => spawnSync("bash", ["-c", command
        .replaceAll("<commit the run passed on>", state.sha)
        .replaceAll("<telemetry.dir>", telemetry)], {
        cwd: tmpdir(),
        env: { ...process.env, WORKTREE: worktree },
        encoding: "utf8",
      }));
      const actual = results.every((r) => r.status === 0 && r.stdout.trim() === "");
      assert.equal(actual, maySkip, `skip=${actual}; ${JSON.stringify(results.map((r) => ({ status: r.status, stdout: r.stdout, stderr: r.stderr })))}`);
    });
  }
}

// Wording checks pin the finish-owned contract, not a live GitHub boundary.
for (const [name, pattern] of [
  ["ordered record pairs", /every top-level `PR:`\/`Pre-rework head:` pair, home first/],
  ["all original heads", /\| Merge \| For every recorded original head, home first, `git merge-base --is-ancestor <PRE_REWORK_HEAD> HEAD`/],
  ["per-PR refs", /Then probe each recorded PR with its own number using `git -C "\$WORKTREE" rev-parse -q --verify refs\/gauntlet\/pre-rework\/pr-<N>`; only when absent, run `git -C "\$WORKTREE" update-ref refs\/gauntlet\/pre-rework\/pr-<N> <PRE_REWORK_HEAD>` with that PR's original SHA/],
  ["home-only push", /Push only home/],
  ["body prerequisite", /Only after a successful push and successful home body edit/],
  ["member eligibility", /--json state,headRefOid/],
  ["pushed ancestry", /--is-ancestor <current headRefOid> <pushed home head>/],
  ["exact authorization", /only the displayed target\/text pairs/],
  ["no deletion", /never pass `--delete-branch`/],
  ["stale authorization", /state or head changed after approval/],
  ["failure no retry", /failed close once, never retry/],
  ["final closing rule", /Post no review-thread replies, merge no PR, change no ticket state, and close no PR other than the absorbed members through the question above\./],
]) {
  test(`PR-list finish: ${name}`, () => assert.match(skill, pattern));
}

test("finish preserves rendered template whitespace and the skill line budget", () => {
  for (const fragment of [
    "Tests failing (<N> failures). Must fix before completing:\n\n[Show failures]\n\nCannot proceed until tests pass.",
    "Implementation complete. What would you like to do?\n\n1. Push to the PR branch",
    "6. Discard this work (removes the worktree and local branch; the PR branch on origin is untouched)\n\nWhich option?",
    "```markdown\n## Rework\n\nBefore:",
  ]) {
    assert.ok(skill.includes(fragment), `missing preserved template: ${fragment}`);
  }
  assert.ok(skill.trimEnd().split("\n").length <= 500);
});

test("PR-list close question follows body edit and precedes completion", () => {
  const row = skill.slice(skill.indexOf("#### PR-subject row 1:"), skill.indexOf("#### Option 1:"));
  assert.ok(row.indexOf("gh pr edit") < row.indexOf("Close the absorbed PRs with these comments?"));
  assert.match(row, /#13: "Reworked into #12/);
  assert.match(row, /#14: "Reworked into #12/);
  assert.match(row, /1 - yes, close #13, #14/);
  assert.match(row, /Rows 2-6[\s\S]*never offer/);
});
