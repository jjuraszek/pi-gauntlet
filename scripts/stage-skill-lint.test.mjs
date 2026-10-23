import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as stageSkillLint from "./stage-skill-lint.mjs";

const { STAGE_SKILL_DIRS, lintStageSkill } = stageSkillLint;

const fenced = (...lines) => ["```bash", ...lines, "```"].join("\n");
const msgs = (text) => lintStageSkill(text).map((f) => `${f.line}:${f.rule}`);

assert.deepEqual(STAGE_SKILL_DIRS, [
  "skills/brainstorming",
  "skills/writing-plans",
  "skills/subagent-driven-development",
  "skills/loop-implementation",
  "skills/finishing-a-development-branch",
  "skills/using-git-worktrees",
]);

// prohibited: cd at statement start (bare, after separator, in $(...))
assert.deepEqual(msgs(fenced('cd "$WT"')), ["2:cd"]);
assert.deepEqual(msgs(fenced('make ci && cd "$WT"')), ["2:cd"]);
assert.deepEqual(msgs(fenced('ROOT=$(cd "$(git rev-parse --git-dir)" && pwd -P)')), ["2:cd"]);
assert.deepEqual(msgs(fenced("  cd .worktrees/foo")), ["2:cd"]);

// allowed: subshell form, git -C, cd inside prose, the word cd inside another token
assert.deepEqual(msgs(fenced('(cd "$WT" && make ci)')), []);
assert.deepEqual(msgs(fenced('git -C "$WT" rev-parse --show-toplevel')), []);
assert.deepEqual(msgs('Plain prose: cd "$WT" is not linted outside fences.'), []);
assert.deepEqual(msgs(fenced("abcd foo")), []);

// prohibited: bare --show-toplevel derivation in a fence
assert.deepEqual(msgs(fenced("ROOT=$(git rev-parse --show-toplevel)")), ["2:show-toplevel"]);
assert.deepEqual(msgs(fenced("git   rev-parse --show-toplevel")), ["2:show-toplevel"]);

// prohibited prose phrases, case-insensitive, prose only
assert.deepEqual(msgs("2. Switch into the worktree."), ["1:prose"]);
assert.deepEqual(msgs("Run it from inside the worktree."), ["1:prose"]);
assert.deepEqual(msgs("From Inside The Worktree"), ["1:prose"]);
assert.deepEqual(msgs("carry the worktree path as a value"), []);

// fences close only with a matching character and run length
assert.deepEqual(
  msgs(["````markdown", "```bash", "cd nested", "```", "cd x", "````"].join("\n")),
  ["3:cd", "5:cd"],
);

// fences toggle correctly with ~~~ and multiple blocks; a line reports each rule once
assert.deepEqual(msgs(["~~~", "cd x", "~~~", "cd in prose is fine", "```", "cd y", "```"].join("\n")), ["2:cd", "6:cd"]);

assert.equal(typeof stageSkillLint.lintStageSkillDirs, "function");
const tmp = mkdtempSync(join(tmpdir(), "stage-skill-lint-"));
try {
  const skillDir = join(tmp, "skills/brainstorming");
  mkdirSync(join(skillDir, "reference"), { recursive: true });
  writeFileSync(join(skillDir, "SKILL.md"), fenced('cd "$WT"'));
  writeFileSync(join(skillDir, "reference/prose.md"), "Switch into the worktree\n");
  writeFileSync(join(skillDir, "reference/show.md"), fenced("ROOT=$(git rev-parse --show-toplevel)"));
  writeFileSync(
    join(skillDir, "reference/allowed.md"),
    fenced('(cd "$WT" && npm test)', 'git -C "$WT" rev-parse --show-toplevel'),
  );
  writeFileSync(join(skillDir, "reference/ignored.txt"), fenced('cd "$WT"'));

  const rows = stageSkillLint
    .lintStageSkillDirs(tmp, ["skills/brainstorming"])
    .map(({ file, line, rule }) => ({ file, line, rule }))
    .sort((a, b) => a.file.localeCompare(b.file));
  assert.deepEqual(rows, [
    { file: "skills/brainstorming/reference/prose.md", line: 1, rule: "prose" },
    { file: "skills/brainstorming/reference/show.md", line: 2, rule: "show-toplevel" },
    { file: "skills/brainstorming/SKILL.md", line: 2, rule: "cd" },
  ]);
  assert.deepEqual(stageSkillLint.lintStageSkillDirs(tmp, ["skills/missing"]), []);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log("stage-skill-lint fixtures pass");
