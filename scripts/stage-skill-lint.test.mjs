import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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

const stage = "skills/loop-implementation/SKILL.md";
const gate = "skills/gatekeep-pr/reference/assessment.md";
assert.deepEqual(stageSkillLint.TEMP_PATH_SCOPE, [
  ...STAGE_SKILL_DIRS,
  "skills/gatekeep-pr",
  "skills/roasting-the-spec",
  "skills/verification-before-completion",
  "agents/loop-implementer.md",
]);
for (const [file, text, count] of [
  [stage, "mktemp", 1],
  [stage, "`mktemp -d`", 1],
  [stage, 'mktemp "$SCRATCH/a.XXXXXX" then `mktemp`', 1],
  [gate, 'mktemp "$RUN_DIR/a.XXXXXX" then `mktemp -d`', 1],
  [gate, 'mktemp "$SCRATCH/a.XXXXXX"', 1],
  [stage, 'mktemp "$SCRATCH/a.XXXXXX"', 0],
  [stage, 'mktemp "/tmp/$SCRATCH/a.XXXXXX"', 1],
  ["skills/gatekeep-pr/reference/post-selection-loop.md", 'read "${TMPDIR:-/tmp}/gate-kept.XXXXXX-extra"', 1],
  [stage, 'mktemp -d "$GIT_DIR/gauntlet/tmp/a.XXXXXX"', 0],
  [gate, 'mktemp "$RUN_DIR/a.XXXXXX"', 0],
  [gate, 'mktemp -d "$COMMON_GIT/gauntlet/tmp/gate.XXXXXX"', 0],
  [stage, "Read `${TMPDIR:-/tmp}/loop-base-0.jobs`", 1],
  ["skills/loop-implementation/reference/return-file.md", 'mktemp -d "${TMPDIR:-/tmp}/gauntlet.XXXXXX"', 0],
  ["skills/gatekeep-pr/reference/post-selection-loop.md", 'mktemp "${TMPDIR:-/tmp}/gate-kept.XXXXXX"', 0],
  [gate, 'mktemp "${TMPDIR:-/tmp}/gate-kept.XXXXXX"', 2],
  [stage, 'mktemp "$SCRATCH/a.XXXXXX" and ${TMPDIR:-/tmp}', 1],
]) {
  const findings = stageSkillLint.lintTempPaths(text, file);
  assert.equal(findings.length, count, `${file}: ${text}`);
  assert.ok(findings.every((finding) => finding.rule === "temp-path" && finding.line === 1));
}
const root = dirname(dirname(fileURLToPath(import.meta.url)));
assert.deepEqual(stageSkillLint.lintTempPathScope(root), [], "all stage and gate mints use their owned scratch root");
const scratchReference = readFileSync(join(root, 'skills/loop-implementation/reference/return-file.md'), 'utf8');
const scratchBlock = scratchReference.match(/<!-- stage-scratch-shell -->\s*```bash\n([\s\S]*?)\n```/)?.[1];
assert.ok(scratchBlock, 'shared scratch recipe exists');
const fixture = mkdtempSync(join(tmpdir(), 'stage-scratch-'));
const primary = join(fixture, "primary's space");
const linked = join(fixture, "linked tree's space");
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' }).trim();
git(fixture, 'init', '-q', primary);
for (const [key, value] of [['user.name', 'Test'], ['user.email', 'test@example.org'], ['commit.gpgsign', 'false'], ['core.hooksPath', '/dev/null']]) git(primary, 'config', key, value);
git(primary, 'commit', '--allow-empty', '-qm', 'base');
git(primary, 'worktree', 'add', '--detach', linked, 'HEAD');
for (const checkout of [primary, linked]) {
  const result = spawnSync('bash', ['-c', scratchBlock + '\nprintf "%s\\n" "$SCRATCH"'], {
    cwd: fixture, env: { ...process.env, CHECKOUT: checkout }, encoding: 'utf8', timeout: 10000,
  });
  assert.equal(result.status, 0, result.stderr);
  const expected = join(git(checkout, 'rev-parse', '--path-format=absolute', '--git-dir'), 'gauntlet/tmp');
  assert.equal(result.stdout.trim(), expected);
  assert.ok(existsSync(expected));
  assert.equal(git(checkout, 'status', '--porcelain'), '');
}
const failedLookup = spawnSync('bash', ['-c', scratchBlock], { cwd: fixture, env: { ...process.env, CHECKOUT: fixture }, encoding: 'utf8', timeout: 10000 });
assert.notEqual(failedLookup.status, 0, 'no repository cannot silently redirect scratch');
const gateReference = readFileSync(join(root, 'skills/gatekeep-pr/reference/post-selection-loop.md'), 'utf8');
const teardownBlock = gateReference.match(/<!-- gate-teardown-shell -->\s*```bash\n([\s\S]*?)\n```/)?.[1];
assert.ok(teardownBlock, 'owned teardown recipe exists');
const runRoot = join(git(primary, 'rev-parse', '--path-format=absolute', '--git-common-dir'), 'gauntlet/tmp');
const kept = [];
for (const keepDrafts of [true, false]) {
  const runDir = mkdtempSync(join(runRoot, 'gate.'));
  for (const name of ['state', 'state-spec.md', 'state-ledger.md', 'verify.output', 'verify.log', 'controller.py', 'worker.jobs', 'description.body', 'reply.body', 'coverage.body']) {
    writeFileSync(join(runDir, name), name);
  }
  const result = spawnSync('bash', ['-c', `${keepDrafts ? 'KEEP=("$RUN_DIR/reply.body" "$RUN_DIR/coverage.body")' : 'KEEP=()'}\n${teardownBlock}`], {
    cwd: fixture, env: { ...process.env, PRIMARY: primary, RUN_DIR: runDir, TMPDIR: fixture }, encoding: 'utf8', timeout: 10000,
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(runDir), false, 'the entire ended run is gone');
  if (keepDrafts) {
    kept.push(...result.stdout.trim().split('\n').map(line => line.replace(/^kept /, '')));
    assert.equal(kept.length, 2);
    assert.ok(kept.every(path => path.startsWith(join(fixture, 'gate-kept.'))));
  }
  assert.deepEqual(kept.map(path => readFileSync(path, 'utf8')), ['reply.body', 'coverage.body'], 'named kept drafts survive both exits');
}
console.log("stage paths, owned teardown and kept drafts across later exits pass");
