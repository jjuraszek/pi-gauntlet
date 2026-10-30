import test from 'node:test';
import { lintTarget } from '../eval/lib/lint.mjs';
import { lintSkillSizes } from './skill-size-lint.mjs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const skill = readFileSync(new URL('../skills/subagent-driven-development/SKILL.md', import.meta.url), 'utf8');
const template = readFileSync(new URL('../skills/requesting-code-review/code-reviewer.md', import.meta.url), 'utf8');
const wave = skill.split('## The Wave Loop')[1].split('## Spec-review snapshots')[0];

const loadReference = name => { const path = new URL(`../skills/subagent-driven-development/reference/${name}.md`, import.meta.url); return existsSync(path) ? readFileSync(path, 'utf8') : ''; };
const dispatch = loadReference('dispatch-contract');
const amendments = loadReference('implement-amendments');

test('wave chain isolates anchored implementers and returns structured SR verdicts', () => {
  const chain = [...wave.matchAll(/```ts\n([\s\S]*?)\n```/g)].map(m => m[1]).find(b => b.includes('chain:'));
  assert.ok(chain);
  assert.match(chain, /SCOPED_TEST_COMMANDS: <this task's manifest tests; none when empty>/);
  assert.match(skill, /isolated implementers.*own task's `tests`.*`none` when empty/);
  assert.match(skill, /in-place implementers.*wave union/);
  assert.match(wave, /isolated spec-gap redispatch.*own task's `tests`/);
  assert.match(dispatch, /isolated implementers.*own task's manifest `tests`/);
  assert.match(dispatch, /integrated gate, in-place repairs and code reviews.*wave union/);
  assert.equal((chain.match(/parallel:/g) || []).length, 2);
  assert.equal((chain.match(/outputMode: "file-only"/g) || []).length, 2);
  for (const token of ['async: false', 'context: "fresh"', 'worktree: true', 'concurrency: 4', 'as: "impl_1"', 'as: "sr_1"', 'outputSchema: IMPLEMENTER_STATUS_SCHEMA', 'outputSchema: SPEC_VERDICT_SCHEMA', 'planPath:', 'anchor:', '{outputs.impl_1.treePath}', '{outputs.impl_1.patchPath}']) assert.ok(chain.includes(token), token);
  assert.match(chain, /the parent takes each SR verdict from the chain's ## Outputs structured JSON; review trees are staged by design/);
  assert.equal((chain.match(/stopOn:/g) || []).length, 1);
  assert.match(wave, /Read the tool-result text, not `details`/);
  assert.match(wave, /statuses and verdicts from.*`## Outputs`/);
  assert.match(skill, /Pasting task text, spec excerpts, or report contents into a dispatch, or opening the plan, spec, a report, or a source file in the primary/);
});

test('dispatch schemas mirror persona reports and one-step carriers expose Outputs', () => {
  const code = [...dispatch.matchAll(/```ts\n([\s\S]*?)\n```/g)][0][1];
  const schemas = runInNewContext(code + '; ({ IMPLEMENTER_STATUS_SCHEMA, SPEC_VERDICT_SCHEMA, CODE_VERDICT_SCHEMA, ANSWER_SCHEMA, DIAGNOSIS_SCHEMA, PREPARE_SCHEMA, APPLY_SCHEMA })', Object.create(null));
  for (const name of ['IMPLEMENTER_STATUS_SCHEMA', 'SPEC_VERDICT_SCHEMA', 'CODE_VERDICT_SCHEMA']) assert.ok(schemas[name].required.includes('reasoning'));
  assert.equal(schemas.IMPLEMENTER_STATUS_SCHEMA.properties.reasoning.maxLength, 300);
  assert.ok(schemas.CODE_VERDICT_SCHEMA.required.includes('behaviourChange'));
  assert.deepEqual(Array.from(schemas.PREPARE_SCHEMA.required), ['items', 'redraws']);
  assert.equal(schemas.PREPARE_SCHEMA.properties.redraws.items.properties.reason.maxLength, 300);
  assert.deepEqual(Array.from(schemas.ANSWER_SCHEMA.required), ['answer', 'evidence']);
  assert.match(dispatch, /chain: \[\{ parallel:/);
  assert.match(dispatch, /outputMode: "file-only"/);
  assert.match(dispatch, /stopOn: \{ path: "\/status", in: \["BLOCKED"\] \}/);
  const diagnosis = wave.split('### Chain stopped or failed')[1];
  const block = diagnosis.match(/```ts\n([\s\S]*?)\n```/)[1];
  assert.match(block, /chain: \[\{/);
  assert.match(block, /context: "fresh"/);
  assert.match(block, /outputSchema: DIAGNOSIS_SCHEMA/);
  assert.match(block, /stopOn: \{ path: "\/decision", in: \["retry", "repair", "stop"\] \}/);
  assert.doesNotMatch(block, /agent:|parallel:|tasks:/);
});

test('manifest routing, bounded recovery and transcript-only dynamic state', () => {
  for (const token of ['## Orchestrator holds', 'plan_check({ planPath })', 'plan_tracker({ action: "status" })', 'manifest-size', 'tests', 'files', 'leg', 'mode', 'in-place', 'wave <w> base <sha>', 'wave <w> task <n> <status|verdict> <value> report <path> patch <path>', 'wave <w> review <k> tree <path>', 'never rerun accepted siblings', 'previous report path', 'exit status', 'orchestrator']) assert.ok(skill.includes(token), token);
  assert.match(skill, /missing.*lines.*stop/i);
  assert.match(skill, /never repeat the initial wave chain/i);
  assert.match(skill, /required.*failed.*siblings/i);
  assert.match(skill, /diff --stat/);
  assert.match(skill, /git diff.*without.*--stat/);
  assert.match(wave, /<!-- pi-cohort-preflight-shell -->/);
});

test('delegated amendments fail closed on redraws and retain first apply inventory for retry', () => {
  for (const token of ['items', 'redraws', 'Fail malformed preparation', 'before grant evaluation or applying any sibling item', 'previousApplyReport', 'original task numbers, titles, spec anchors, and wave positions', 'including failures', 'Missing original inventory fails the retry', 'idempotently', 'failLines', 'second failure', 'parent PASS', 'tasksAnchorChanged', 'in_progress']) assert.ok(amendments.includes(token), token);
});

test('planning and wave dispatch bind task roots and Rules to admitted legs', () => {
  const writer = readFileSync(new URL('../skills/writing-plans/SKILL.md', import.meta.url), 'utf8');
  const contract = readFileSync(new URL('../skills/writing-plans/reference/plan-contract.md', import.meta.url), 'utf8');
  for (const token of ['Leg: <repo>', 'Baseline <repo>: <sha>', '(leg, path)', 'leg-unknown', 'home:', 'NAME']) assert.ok(contract.includes(token), token);
  for (const token of ['Rules: root only - paths unresolved', 'owning checkout', 'tree-equivalence', 'per-leg']) assert.ok(writer.includes(token), token);
  for (const token of ['leg-homogeneous', 'before capturing `WAVE_BASE_SHA`', 'combined spec/task `Rules:`', 'home spec', 'every leg']) assert.ok(skill.includes(token), token);
  for (const name of ['implementer', 'spec-reviewer', 'code-reviewer']) {
    const persona = readFileSync(new URL(`../agents/${name}.md`, import.meta.url), 'utf8');
    assert.match(persona, /Read the combined spec\/task `Rules:` files before acting/);
  }
});

test('delegation eval scenarios use the six planned sample paths and snapshot carriers', () => {
  const facts = {
    'no-plan-read-wave': ['clean-wave', 'in-place', 'orchestrator', 'size'],
    'delegated-source-investigation': ['delegated-answer', 'no-primary-read', 'bounded-failure'],
    'repair-compaction-recovery': ['static-recovery', 'partial-transcript', 'missing-transcript', 'resumable-transcript'],
    'report-by-path-fix': ['report-path', 'behaviour-routing', 'fix-delta', 'funded-carriers'],
    'chain-error-diagnosis': ['sequential-diagnosis', 'structured-routing', 'missing-sibling'],
    'delegated-amendment': ['preparation', 'grant-boundaries', 'redraw-gate', 'inventory-retry', 'failed-retry', 'measured-value'],
  };
  for (const [sample, names] of Object.entries(facts)) {
    const root = new URL(`../eval/subagent-driven-development/samples/${sample}/`, import.meta.url);
    assert.ok(existsSync(new URL('case.md', root)), sample);
    const expected = readFileSync(new URL('expected.md', root), 'utf8');
    for (const name of names) assert.ok(expected.includes(`- ${name}: judged:`), `${sample}/${name}`);
  }
  const snapshot = readFileSync(new URL('../eval/subagent-driven-development/samples/patch-review-snapshot/expected.md', import.meta.url), 'utf8');
  assert.match(snapshot, /one-step.*file-only.*schema/);
  assert.doesNotMatch(snapshot, /plain snapshot-backed SR dispatches/);
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

function snapshot({ repo, base, patch }) {
  const block = skill.match(/<!-- spec-review-snapshot-shell -->\s*```bash\n([\s\S]*?)\n```/);
  assert.ok(block, 'per-patch spec review must materialize the implementation before whole-file reads');
  let script = block[1];
  for (const [key, value] of Object.entries({ WORKTREE: repo, BASE_SHA: base, PATCH_PATH: patch })) script = script.replaceAll(`{{${key}}}`, () => quote(value));
  return spawnSync('bash', ['-c', script], { encoding: 'utf8' });
}

function review(repo, base, head) {
  const block = template.match(/```bash\n([\s\S]*?)\n```/);
  assert.ok(block);
  const command = block[1].replaceAll('{BASE_SHA}', base).replaceAll('{HEAD_SHA}', head);
  return spawnSync('bash', ['-e', '-c', command], { cwd: repo, encoding: 'utf8' });
}

test('per-patch spec review reads changed, added and deleted files without changing the parent', () => {
  const f = fixture();
  git(f.repo, 'reset', '--hard', f.base);
  const before = git(f.repo, 'status', '--porcelain');
  const result = snapshot(f);
  assert.equal(result.status, 0, result.stderr);
  const path = result.stdout.match(/^snapshot: (.+)$/m)?.[1];
  assert.ok(path, result.stdout);
  assert.equal(readFileSync(join(path, 'existing.txt'), 'utf8'), 'after\n');
  assert.equal(readFileSync(join(path, 'new.txt'), 'utf8'), 'new content\n');
  assert.equal(existsSync(join(path, 'removed.txt')), false);
  assert.equal(readFileSync(join(f.repo, 'existing.txt'), 'utf8'), 'before\n');
  assert.equal(existsSync(join(f.repo, 'new.txt')), false);
  assert.equal(git(f.repo, 'status', '--porcelain'), before);
  assert.equal(git(f.repo, 'rev-parse', 'HEAD'), f.base);
  git(f.repo, 'worktree', 'remove', '--force', path);
});

test('an invalid patch cannot produce a reviewable snapshot', () => {
  const f = fixture();
  writeFileSync(f.patch, 'not a patch\n');
  const result = snapshot(f);
  assert.notEqual(result.status, 0);
  assert.doesNotMatch(result.stdout, /^snapshot:/m);
});

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

const fixReference = new URL('../skills/subagent-driven-development/reference/fix-loop.md', import.meta.url);
const fixRules = skill.split('## Fix-Loop Rounds')[1].split('## Fix delta')[0] + (existsSync(fixReference) ? readFileSync(fixReference, 'utf8') : '');
const stopNote = readFileSync(new URL('../skills/subagent-driven-development/stop-note.md', import.meta.url), 'utf8');

test('amendment owners honor permission before fact and decision routing', () => {
  const prerequisite = skill.split('## Prerequisites')[1].split('## Fix-Loop Rounds')[0];
  assert.match(prerequisite, /amend permission on the `\*\*Amend-grant:\*\*` line/);
  const status = skill.split('## Implementer Status')[1].split('## Model')[0];
  const rows = status.split('\n').filter(line => /^\| `(NEEDS_CONTEXT|BLOCKED)`/.test(line));
  assert.equal(rows.length, 2);
  for (const row of rows) {
    assert.match(row, /spec-defect citation.*amendment route.*Resolve fact asks/);
  }
  assert.match(status, /candidate answers are each edits to the spec, plan, or an approved rule.*amendment batch.*never a decision/);
  assert.match(status, /drafted AC row text correction.*quoted implementer evidence.*granted `amend:` audit body/);
  assert.match(status, /redraws: ticket rows, row add\/remove, reviewer-only or taste objections, problem changes, or component boundary changes/);
  assert.match(status, /another-round approval.*only.*no funded round left/);
  for (const text of ['recommended', 'alt-n', 'amended the spec: <title> - <what>', 'plan-writer', 'plan_check', 'tracker update', 'amend:']) assert.ok((status + amendments).includes(text), text);
  assert.match(skill, /`NEEDS_CONTEXT`, `BLOCKED`, a fix-loop escalation, a workflow warning, a redraw, or an amend with no standing grant\./);
});

test('funded rounds preserve escalated isolation, task ownership and fail-closed resume', () => {
  assert.match(skill, /An escalated round fails with no funded round left/);
  for (const text of ['Value decoding', 'funded round <k> of <N> for task <n>', 'context: "fresh"', 'async: false', 'one implementer, no fan-out', 'same review gate', 'spent starting at zero', 'every touched task', 'SR-to-CR', 'not recovered on resume']) assert.ok(fixRules.includes(text), text);
  assert.match(fixRules, /non-`DONE` status or a dispatch error -> stop note/);
  assert.match(fixRules, /funded.*`STAGNANT`.*stop/i);
  assert.match(fixRules, /Errors and non-`DONE`.*spent.*stop/);
  assert.match(fixRules, /review-3 convergence exception.*never re-arm/);
  assert.match(fixRules, /no wave-level allowance/);
  assert.match(fixRules, /recoverable.*exhausted/);
  assert.match(skill, /continuing past `STAGNANT` instead of escalating \(or, on a funded re-review, stopping\)/);
  assert.match(readFileSync(fixReference, 'utf8').split('## Funded rounds')[1], /escalated-round failure with no funded round left/);
});

test('recovery requires terminal funded outcomes, not merely transcript categories', () => {
  const recovery = skill.split('### Recovery')[1].split('## Spec-review snapshots')[0];
  assert.match(recovery, /all transcript line categories.*not sufficient/);
  assert.match(recovery, /missing terminal funded-worker outcome.*repair state/);
  const sample = new URL('../eval/subagent-driven-development/samples/repair-compaction-recovery/', import.meta.url);
  const scenario = readFileSync(new URL('case.md', sample), 'utf8');
  const expected = readFileSync(new URL('expected.md', sample), 'utf8');
  assert.match(scenario, /In C.*terminal/s);
  assert.match(scenario, /tree-before [a-f0-9]{40} tree-after [a-f0-9]{40}/);
  assert.match(expected, /partial-transcript: judged:.*Stops.*terminal funded-worker outcome/);
  assert.match(expected, /resumable-transcript: judged:.*round 2 of 2/);
});

test('funded rounds own stop-note funding rules and preserve the base stop note', () => {
  const funded = readFileSync(fixReference, 'utf8').split('## Funded rounds')[1];
  assert.match(funded, /While a budget token exists, include `budget: <spent> of <N> spent` in every stop note after `Problem:` and any `Searched:` lines and before the file finding/);
  for (const text of ['pre-escalation', 'missing `implModel`', 'exhausted fact lookups at spent zero', 'only round-history exception', '(not recovered on resume)', 'omit the line without a token']) assert.ok(funded.includes(text), text);
  for (const token of ['gauntlet: question', 'Problem:', 'Searched:', 'Fix options:', 'Pick one, or give another fix.', 'One screen', 'delegated']) assert.ok(stopNote.includes(token), token);
  for (const block of [...stopNote.matchAll(/```\n([\s\S]*?)\n```/g)]) {
    assert.match(block[1], /^gauntlet: question\n/);
    assert.match(block[1], /Recommendation: (?:<option>|[a-c]|none) - [^\n]+$/);
  }
  assert.doesNotMatch(stopNote, /budget: <spent> of <N> spent/);
});

const failureReference = readFileSync(new URL('../skills/subagent-driven-development/reference/fix-loop.md', import.meta.url), 'utf8');

test('execution failures take authorized decisions before a single isolated escalation', () => {
  const execution = failureReference.split('## Implementer-failure stops')[1];
  assert.ok(execution, 'execution stops need their own procedure, not review funding');
  const ordered = ['1. **Hard stops**', '2. **Takeable decision**', '3. **Execution escalation**', '4. **Resulting decision**'];
  for (let i = 0; i < ordered.length; i++) {
    assert.ok(execution.includes(ordered[i]), ordered[i]);
    if (i) assert.ok(execution.indexOf(ordered[i - 1]) < execution.indexOf(ordered[i]));
  }
  for (const text of ['Value decoding', 'took recommendation: <option> for task <n>',
    'count every re-dispatch as an ordinary attempt', 'escalated round for task <n> after 2 failed attempts',
    'gauntlet_setting({ key: "escalationLoop" })', 'model: <implModel>', 'context: "fresh"', 'async: false',
    'SCOPED_TEST_COMMANDS', 'complete prior report verbatim', 'same payload and isolation',
    'dispatch error or non-`DONE`', 'no fourth unnamed repair', 'unrecoverable means spent',
    'whitespace', 'file:line', 'failing command plus assertion',
    'Recommendation: none - evidence repeats task <n>', '/skill:shape-ticket',
    'funded re-review `STAGNANT`', '`REJECT`', 'budget-only']) assert.ok(execution.includes(text), text);
  const hardStops = execution.split('2. **Takeable decision**')[0];
  for (const stop of ['malformed grants', 'missing `implModel`', 'unavailable settings tools', 'dirty-tree', 'commit-boundary', 'empty-commit stagnation', 'cap', 'funded re-review `STAGNANT`', '`REJECT`']) assert.ok(hardStops.includes(stop), stop);
  assert.match(execution, /implModel` undefined stops with the existing note/);
  assert.match(execution, /matching task's transcript, not a review escalation or sibling line/);
  assert.match(execution, /mid-loop grant or explicit retry never re-arms/);
  assert.doesNotMatch(execution, /when it cannot be recovered, stop rather than claim fresh evidence/);
  assert.match(execution, /Success still runs the ordinary scoped tests and SR\/CR gates/);
  for (const row of skill.split('\n').filter(line => /^\| `(NEEDS_CONTEXT|BLOCKED)`/.test(line))) {
    assert.match(row, /decisions under amend permission.*Implementer-failure stops/);
  }
  assert.match(skill, /After 2 failed attempts:[^\n]*Implementer-failure stops/);
  assert.match(skill, /drafted AC row text correction[^\n]*implementer evidence/);
});

test('execution eval assembly includes failure routing and remains within authoring limits', () => {
  const root = new URL('../', import.meta.url).pathname;
  assert.deepEqual(lintTarget(join(root, 'eval/subagent-driven-development')), []);
  assert.deepEqual(lintSkillSizes(root), []);
  assert.ok(Buffer.byteLength(skill) < 50000);
  assert.ok(skill.split('\n').length <= 500);
  const expected = readFileSync(join(root, 'eval/subagent-driven-development/samples/blocked-decision-auto-taken/expected.md'), 'utf8');
  assert.match(expected, /stop note ending in Recommendation: none - <why>/);
  const target = JSON.parse(readFileSync(join(root, 'eval/subagent-driven-development/target.json'), 'utf8'));
  assert.equal(target.skillFiles.find(file => file.slice === '## Fix-Loop Rounds').sliceTo, '## After All Tasks Complete');
  for (const sample of ['blocked-decision-auto-taken', 'third-attempt-escalated', 'ac-row-correction-amend']) {
    for (const file of ['case.md', 'expected.md']) assert.ok(existsSync(join(root, 'eval/subagent-driven-development/samples', sample, file)));
  }
});
