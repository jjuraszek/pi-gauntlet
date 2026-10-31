import test from 'node:test';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const skill = readFileSync(new URL('../skills/subagent-driven-development/SKILL.md', import.meta.url), 'utf8');
const template = readFileSync(new URL('../skills/requesting-code-review/wave-reviewer.md', import.meta.url), 'utf8');
const wave = skill.split('## The Wave Loop')[1].split('## When a Subagent Fails')[0];

const loadReference = name => { const path = new URL(`../skills/subagent-driven-development/reference/${name}.md`, import.meta.url); return existsSync(path) ? readFileSync(path, 'utf8') : ''; };
const dispatch = loadReference('dispatch-contract');
const amendments = loadReference('implement-amendments');

test('integrated wave contract uses implementers then one post-gate wave review', () => {
  assert.doesNotMatch(wave, /agent: "(?:spec-reviewer|code-reviewer)"|SPEC_VERDICT_SCHEMA|CODE_VERDICT_SCHEMA/);
  for (const token of ['WAVE_VERDICT_SCHEMA', 'repair-base-shell', 'rebuild: task <n> - delta apply failed', 'failed[n]', 'converged[n]', 'escalated[n]', '4 + N', 'Compact report: findings and footer only, at most 150 lines']) assert.ok(skill.includes(token), token);
  assert.ok(wave.indexOf('**Test gate.**') < wave.indexOf('**Review.**'));
  assert.match(skill, /limit: 300/);
  assert.match(skill, /no `context: "fresh"`/);
  assert.match(skill, /initial patch.*fails[\s\S]*staged[\s\S]*stop/);
});
test('unified schema requires counted findings and preserves amendment carriers', () => {
  const schema = JSON.parse(dispatch.match(/const WAVE_VERDICT_SCHEMA = (.*);/)[1]);
  assert.deepEqual(schema.required, ['verdict', 'reasoning', 'findingCount', 'findings']);
  assert.deepEqual(schema.properties.verdict.enum, ['SHIP', 'FIX_FIRST', 'REJECT']);
  assert.equal(schema.additionalProperties, false);
  for (const severity of ['critical','moderate','minor']) assert.equal(schema.properties.findings.properties[severity].minimum, 0);
  assert.doesNotMatch(dispatch, /SPEC_VERDICT_SCHEMA|CODE_VERDICT_SCHEMA|behaviourChange/);
  for (const name of ['IMPLEMENTER_STATUS_SCHEMA','ANSWER_SCHEMA','DIAGNOSIS_SCHEMA','PREPARE_SCHEMA','APPLY_SCHEMA']) assert.ok(dispatch.includes(name));
  for (const token of ['redraws','previousApplyReport','failLines']) assert.ok(amendments.includes(token));
});
test('replacement samples and retired protocol inventory', () => {
  for (const name of ['one-review-per-wave','direct-report-read','repair-on-top','gate-repair-before-review','empty-delta-attempt','apply-failure-rebuild','escalation-same-tree','convergence-exception','funded-failure-stop','reject-stop','blocked-resume-tree']) {
    for (const file of ['case','expected']) assert.ok(existsSync(new URL(`../eval/subagent-driven-development/samples/${name}/${file}.md`, import.meta.url)), name);
  }
  for (const name of ['chain-wave-dispatch', 'patch-review-snapshot', 'report-by-path-fix', 'test-gate-repair']) assert.equal(existsSync(new URL(`../eval/subagent-driven-development/samples/${name}`, import.meta.url)), false, name);
  for (const path of ['reference/fix-loop.md','spec-reviewer-prompt.md','code-quality-reviewer-prompt.md']) assert.equal(existsSync(new URL(`../skills/subagent-driven-development/${path}`, import.meta.url)), false);
});
test('planning and wave dispatch bind task roots and Rules to admitted legs', () => {
  const writer = readFileSync(new URL('../skills/writing-plans/SKILL.md', import.meta.url), 'utf8');
  const contract = readFileSync(new URL('../skills/writing-plans/reference/plan-contract.md', import.meta.url), 'utf8');
  for (const token of ['Leg: <repo>', 'Baseline <repo>: <sha>', '(leg, path)', 'leg-unknown', 'home:', 'NAME']) assert.ok(contract.includes(token), token);
  for (const token of ['Rules: root only - paths unresolved', 'owning checkout', 'tree-equivalence', 'per-leg']) assert.ok(writer.includes(token), token);
  for (const token of ['leg-homogeneous', 'before capturing `WAVE_BASE_SHA`', 'combined spec/task `Rules:`', 'home spec', 'every leg']) assert.ok(skill.includes(token), token);
  for (const name of ['implementer', 'wave-reviewer']) {
    const persona = readFileSync(new URL(`../agents/${name}.md`, import.meta.url), 'utf8');
    assert.match(persona, /Read (?:the )?combined spec\/task `Rules:`(?: files)? before acting/);
  }
});

test('subagent failure guidance retains the two-attempt ladder', () => {
  const failure = skill.split('## When a Subagent Fails')[1].split('## After All Tasks Complete')[0];
  for (const token of ['1. **Attempt 1:**', '2. **Attempt 2:**', "3. after 2 failed attempts the transition table's escalated round runs; STOP only when that round and any funded round are spent."]) assert.ok(failure.includes(token), token);
});

const quote = value => `'${value.replaceAll("'", "'\\''")}'`;
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' }).trim();

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'wave-review-'));
  const repo = join(root, "repo's space");
  git(root, 'init', '-q', repo);
  for (const [key, value] of [['user.name', 'Test'], ['user.email', 'test@example.org'], ['commit.gpgsign', 'false'], ['core.hooksPath', '/dev/null']]) git(repo, 'config', key, value);
  writeFileSync(join(repo, 'existing.txt'), 'before\n');
  writeFileSync(join(repo, 'removed.txt'), 'remove me\n');
  git(repo, 'add', '.');
  git(repo, 'commit', '-qm', 'base');
  const base = git(repo, 'rev-parse', 'HEAD');
  writeFileSync(join(repo, 'existing.txt'), 'after\n');
  writeFileSync(join(repo, 'new.txt'), 'new content\n');
  git(repo, 'rm', 'removed.txt');
  git(repo, 'add', '.');
  const patch = join(root, 'task.patch');
  writeFileSync(patch, git(repo, 'diff', '--cached', '--binary', base) + '\n');
  return { root, repo, base, patch };
}

test('wave commit roots every git command in the implementation worktree', () => {
  const primary = fixture();
  const implementation = fixture();
  const before = git(primary.repo, 'status', '--porcelain');
  const primaryHead = git(primary.repo, 'rev-parse', 'HEAD');
  const recipe = wave.match(/\*\*Commit\.\*\*[^\n]*isolated waves `([^`]+)`/)[1];
  const command = recipe.replaceAll('<worktree>', quote(implementation.repo))
    .replaceAll('$WAVE_BASE_SHA', implementation.base)
    .replaceAll('<message>', quote('wave commit'));
  const result = spawnSync('bash', ['-e', '-c', command], { cwd: primary.repo, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(git(primary.repo, 'rev-parse', 'HEAD'), primaryHead);
  assert.equal(git(primary.repo, 'status', '--porcelain'), before);
  assert.notEqual(git(implementation.repo, 'rev-parse', 'HEAD'), implementation.base);
  assert.equal(git(implementation.repo, 'status', '--porcelain'), '');
  assert.equal(git(implementation.repo, 'rev-parse', 'HEAD^'), implementation.base);
});

function review(repo, base, head) {
  const block = template.match(/```bash\n([\s\S]*?)\n```/);
  assert.ok(block);
  const command = block[1].replaceAll('{BASE_SHA}', base).replaceAll('{HEAD_SHA}', head);
  return spawnSync('bash', ['-e', '-c', command], { cwd: repo, encoding: 'utf8' });
}

test('uncommitted wave review includes staged additions and unstaged fixes while HEAD stays at base', () => {
  const f = fixture();
  writeFileSync(join(f.repo, 'existing.txt'), 'after repair\n');
  const result = review(f.repo, f.base, 'WORKTREE');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\+after repair/);
  assert.match(result.stdout, /\+new content/);
  assert.match(result.stdout, /deleted file mode/);
  assert.equal(git(f.repo, 'rev-parse', 'HEAD'), f.base);
});

test('committed review keeps the explicit range and excludes later uncommitted edits', () => {
  const f = fixture();
  git(f.repo, 'commit', '-qm', 'implementation');
  const head = git(f.repo, 'rev-parse', 'HEAD');
  writeFileSync(join(f.repo, 'existing.txt'), 'not reviewed\n');
  const result = review(f.repo, f.base, head);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\+after/);
  assert.match(result.stdout, /\+new content/);
  assert.doesNotMatch(result.stdout, /not reviewed/);
});

function captureTree(repo, scratch) {
  const block = skill.match(/<!-- fix-delta-tree-shell -->\s*```bash\n([\s\S]*?)\n```/);
  assert.ok(block, 'fix delta must record trees through the marked scratch-index block');
  return spawnSync('bash', ['-c', block[1].replaceAll('{{CHECKOUT}}', () => quote(repo))], {
    encoding: 'utf8', env: { ...process.env, TMPDIR: scratch },
  });
}

test('tree delta is repair-only regardless of committed, staged or unstaged repair state', () => {
  const f = fixture();
  const checkout = join(f.root, "linked tree's space");
  const scratch = join(f.root, 'scratch');
  mkdirSync(scratch);
  git(f.repo, 'worktree', 'add', '--detach', checkout, f.base);
  writeFileSync(join(checkout, 'existing.txt'), 'implementation\n');
  git(checkout, 'add', '-A');
  const implementationStatus = git(checkout, 'status', '--porcelain');
  const before = captureTree(checkout, scratch);
  assert.equal(before.status, 0, before.stderr);
  assert.equal(git(checkout, 'status', '--porcelain'), implementationStatus);
  assert.deepEqual(readdirSync(scratch), []);
  git(checkout, 'commit', '-qm', 'implementation');
  const implementation = git(checkout, 'rev-parse', 'HEAD');
  // The expected patch is independent of the capture and includes no implementation hunk.
  const repairBlob = execFileSync('git', ['-C', checkout, 'hash-object', '--stdin'], { input: 'repair\n', encoding: 'utf8' }).trim();
  const expected = `diff --git a/repair.txt b/repair.txt\nnew file mode 100644\nindex 0000000..${repairBlob.slice(0, 7)}\n--- /dev/null\n+++ b/repair.txt\n@@ -0,0 +1 @@\n+repair\n`;
  const deltas = [];
  for (const state of ['committed', 'staged', 'unstaged']) {
    git(checkout, 'reset', '--hard', implementation);
    writeFileSync(join(checkout, 'repair.txt'), 'repair\n');
    if (state !== 'unstaged') git(checkout, 'add', '-A');
    if (state === 'committed') git(checkout, 'commit', '-qm', 'repair');
    const status = git(checkout, 'status', '--porcelain');
    const after = captureTree(checkout, scratch);
    assert.equal(after.status, 0, `${state}: ${after.stderr}`);
    const delta = execFileSync('git', ['-C', checkout, 'diff', '--binary', before.stdout.trim(), after.stdout.trim()], { encoding: 'utf8' });
    assert.equal(delta, expected, state);
    deltas.push(delta);
    assert.equal(git(checkout, 'status', '--porcelain'), status, state);
    assert.deepEqual(readdirSync(scratch), [], state);
  }
  assert.equal(new Set(deltas).size, 1);
});

test('missing live index fails tree capture without a SHA or scratch residue', () => {
  const f = fixture();
  const checkout = join(f.root, "missing index's tree");
  const scratch = join(f.root, 'scratch');
  mkdirSync(scratch);
  git(f.repo, 'worktree', 'add', '--detach', checkout, f.base);
  unlinkSync(git(checkout, 'rev-parse', '--path-format=absolute', '--git-path', 'index'));
  const result = captureTree(checkout, scratch);
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout, '');
  assert.deepEqual(readdirSync(scratch), []);
});


test('implementer template carries task scope and evidence, not persona conduct', () => {
  const prompt = readFileSync(new URL('../skills/subagent-driven-development/implementer-prompt.md', import.meta.url), 'utf8');
  const ordered = ['planPath: [absolute plan path]', 'anchor: "### Task N:"', 'anchors: [use instead of anchor for a multi-task repair]', 'Spec: [absolute authoritative home spec path]', 'Work from: [worker checkout]', 'SCOPED_TEST_COMMANDS: [', 'Read the selected task sections, Spec anchors, Tests:/via: and Files: Create:/Test: paths yourself.', 'Tests call the via: seam directly', 'Create every Create: path at exactly that path.', 'one line per SCOPED_TEST_COMMANDS command', 'Any `unmet` -> `DONE_WITH_CONCERNS`.', '**Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT', 'Conduct (TDD scenarios, test economy, scope discipline, escalation, report shape) is your persona; this prompt carries only the task and its test scope.'];
  let previous = -1;
  for (const text of ordered) { const at = prompt.indexOf(text); assert.ok(at > previous, text); previous = at; }
  assert.doesNotMatch(prompt, /FULL TEXT|paste it here|don't make subagent read file|TEST_CONTRACT:/);
  assert.match(prompt, /one line per via:/);
  assert.match(prompt, /quote the last output line/);
  assert.doesNotMatch(prompt, /Commit your work|Code Organization|Over Your Head|Self-Review|read the plan|OWNED_FILES|owned-files/);
});

test('shipped peer-floor guard resolves adjacent package paths and stops unsupported dispatch', () => {
  const block = skill.match(/<!-- pi-cohort-preflight-shell -->\s*```bash\n([\s\S]*?)\n```/);
  assert.ok(block, 'executable preflight guard');
  const root = mkdtempSync(join(tmpdir(), 'peer guard '));
  const cohort = join(root, 'installed packages', 'pi-cohort');
  const own = join(root, 'installed packages', 'pi-gauntlet');
  const bin = join(root, 'bin');
  for (const dir of [cohort, own, bin]) mkdirSync(dir, { recursive: true });
  const cases = [
    ['equal', '7.4.3', '>=7.4.3', '', true],
    ['numeric above', '7.4.10', '>=7.4.2', '', true],
    ['pinned own', '7.4.3', '>=7.4.3', '', true],
    ['local own', '7.4.3', '>=7.4.3', '', true],
    ['filtered cohort', '7.4.3', '>=7.4.3', '', true],
    ['unrelated first', '7.4.3', '>=7.4.3', '', true],
    ['below', '7.3.1', '>=7.4.3', 'pi-cohort >= 7.4.3 required, found 7.3.1'],
    ['numeric below', '7.4.2', '>=7.4.10', 'pi-cohort >= 7.4.10 required, found 7.4.2'],
    ['missing cohort', '7.4.3', '>=7.4.3', 'pi-cohort not installed'],
    ['failed list', '7.4.3', '>=7.4.3', 'pi-cohort not installed'],
    ['unreadable own', '7.4.3', '>=7.4.3', 'cannot read peer floor'],
    ['absent peer', '7.4.3', undefined, 'cannot read peer floor'],
    ['malformed peer', '7.4.3', '^7.4.3', 'cannot read peer floor'],
    ['malformed version', '7.4.3-beta', '>=7.4.3', 'cannot parse pi-cohort version 7.4.3-beta'],
  ];
  for (const [name, version, peer, error, supported] of cases) {
    writeFileSync(join(cohort, 'package.json'), JSON.stringify({ name: 'pi-cohort', version }));
    writeFileSync(join(own, 'package.json'), name === 'unreadable own' ? 'invalid json' : JSON.stringify({ name: 'pi-gauntlet', version: '1.0.0', peerDependencies: { 'pi-cohort': peer } }));
    const unrelated = join(root, 'another package');
    mkdirSync(unrelated, { recursive: true });
    writeFileSync(join(unrelated, 'package.json'), JSON.stringify({ name: 'another-package', version: '1.0.0', peerDependencies: { 'pi-cohort': '>=99.0.0' } }));
    const cohortSource = name === 'filtered cohort' ? 'npm:pi-cohort (filtered)' : 'npm:pi-cohort';
    const ownSource = name === 'pinned own' ? 'npm:pi-gauntlet@7.19.0' : name === 'local own' ? '../pi-gauntlet' : 'npm:pi-gauntlet';
    const listing = `User packages:\n${name === 'unrelated first' ? `  npm:another-package\n    ${unrelated}\n` : ''}${name === 'missing cohort' ? '' : `  ${cohortSource}\n    ${cohort}\n`}  ${ownSource}\n    ${own}\n`;
    writeFileSync(join(bin, 'pi'), `#!/bin/sh\n${name === 'failed list' ? 'exit 1' : `printf %s ${quote(listing)}`}\n`, { mode: 0o755 });
    const result = spawnSync('bash', ['-c', block[1] + '\nprintf "dispatch sentinel\n"'], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}` } });
    assert.equal(result.status === 0, !!supported, `${name}: ${result.stderr}`);
    assert.equal(result.stdout.includes('dispatch sentinel'), !!supported, name);
    if (error) assert.ok(result.stderr.includes(error), `${name}: ${result.stderr}`);
  }
});


test('repair snapshot commits the integrated tree and exports only repair delta', () => {
  const f = fixture();
  writeFileSync(join(f.repo, 'sibling.txt'), 'sibling\n');
  const block = skill.match(/<!-- repair-base-shell -->\s*```bash\n([\s\S]*?)\n```/);
  assert.ok(block);
  const script = block[1].replaceAll('{{WORKTREE}}', quote(f.repo)).replaceAll('{{BASE_SHA}}', quote(f.base));
  const result = spawnSync('bash', ['-c', script], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const tree = result.stdout.match(/repair-base: (.*) [a-f0-9]{40}/)[1];
  assert.equal(git(tree, 'status', '--porcelain'), '');
  for (const path of ['existing.txt', 'new.txt', 'sibling.txt']) assert.equal(readFileSync(join(tree, path), 'utf8'), readFileSync(join(f.repo, path), 'utf8'));
  assert.equal(git(f.repo, 'rev-parse', 'HEAD'), f.base);
  const snapshot = git(tree, 'rev-parse', 'HEAD');
  writeFileSync(join(tree, 'existing.txt'), 'repaired\n');
  git(tree, 'add', '-A'); git(tree, 'commit', '-qm', 'repair');
  const delta = join(f.root, 'repair.patch');
  writeFileSync(delta, git(tree, 'diff', '--binary', snapshot, 'HEAD') + '\n');
  git(f.repo, 'apply', '--index', delta);
  assert.equal(readFileSync(join(f.repo, 'existing.txt'), 'utf8'), 'repaired\n');
  assert.equal(readFileSync(join(f.repo, 'sibling.txt'), 'utf8'), 'sibling\n');
  assert.equal(readFileSync(join(f.repo, 'new.txt'), 'utf8'), 'new content\n');
  assert.equal(git(f.repo, 'rev-parse', 'HEAD'), f.base);
});

test('rebuild removes Create/Test paths and restores deduplicated existing paths only', () => {
  const f = fixture();
  writeFileSync(join(f.repo, 'sibling.txt'), 'sibling\n'); git(f.repo, 'add', '-A');
  const paths = { Create: ['new.txt'], Modify: ['existing.txt'], Test: ['new.txt', 'existing.txt'] };
  const create = [...new Set(paths.Create)];
  const restore = [...new Set([...paths.Modify, ...paths.Test])].filter(p => !create.includes(p));
  git(f.repo, 'rm', '-q', '-f', '--ignore-unmatch', '--', ...create);
  git(f.repo, 'restore', `--source=${f.base}`, '--staged', '--worktree', '--', ...restore);
  assert.equal(existsSync(join(f.repo, 'new.txt')), false);
  assert.equal(readFileSync(join(f.repo, 'existing.txt'), 'utf8'), 'before\n');
  assert.equal(readFileSync(join(f.repo, 'sibling.txt'), 'utf8'), 'sibling\n');
  assert.match(wave, /deduplicated and excluding every `Create` path/);
});

test('CI rejects retired dispatches only on instruction surfaces and validates supersession', () => {
  const ci = readFileSync(new URL('./ci.mjs', import.meta.url), 'utf8');
  const code = ci.match(/\/\/ wave-contract-checks:begin\n([\s\S]*?)\/\/ wave-contract-checks:end/)[1];
  const { retiredDispatch, supersessionTarget } = runInNewContext(code + '\n({ retiredDispatch, supersessionTarget })');
  for (const [path, text, expected] of [
    ['skills/example/SKILL.md', 'agent: "spec-reviewer"', true],
    ['agents/example.md', 'agent: "code-reviewer"', true],
    ['extensions/example.ts', 'agent: "code-reviewer"', false],
    ['eval/example/case.md', 'agent: "spec-reviewer"', false],
    ['skills/example/SKILL.md', 'agent: "wave-reviewer"', false],
  ]) assert.equal(retiredDispatch(path, text), expected);
  const target = './2026-10-30-slim-subagent-dispatch.md';
  assert.equal(supersessionTarget(`> **Superseded by:** [spec](${target})`), target);
  assert.equal(supersessionTarget('no banner'), null);
  assert.notEqual(supersessionTarget('> **Superseded by:** [spec](./wrong.md)'), target);
  const predecessor = readFileSync(new URL('../doc/specs/2026-10-29-orchestrator-delegation-guard.md', import.meta.url), 'utf8');
  assert.equal(supersessionTarget(predecessor), target);
  assert.ok(existsSync(new URL('../doc/specs/' + target, import.meta.url)));
});
