import test from 'node:test';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const skill = readFileSync(new URL('../skills/subagent-driven-development/SKILL.md', import.meta.url), 'utf8');
const template = readFileSync(new URL('../skills/requesting-code-review/code-reviewer.md', import.meta.url), 'utf8');
const wave = skill.split('## The Wave Loop')[1].split('## Spec-review snapshots')[0];

test('wave chain isolates implementers then reviews their paired materialized trees', () => {
  const blocks = [...wave.matchAll(/```ts\n([\s\S]*?)\n```/g)].map(match => match[1]);
  const chain = blocks.find(block => block.includes('chain:'));
  assert.ok(chain, 'primary dispatch must be a chain');
  assert.equal((chain.match(/subagent\(/g) || []).length, 1);
  assert.equal((chain.match(/parallel:/g) || []).length, 2);
  assert.match(chain, /context: "fresh"/);
  assert.match(chain, /async: false/);
  assert.match(chain, /cwd: "<abs worktree path>"/);
  const [impl, sr] = chain.split(/\},\s*\{\s*parallel:/);
  const implTask = impl.match(/task: "([^"]*)"/)[1];
  assert.match(implTask, /^<full task text \+ owned files \+ SCOPED_TEST_COMMANDS \+ Tests: block \+ status protocol>/);
  assert.ok(implTask.endsWith('pi-cohort saves your final report to the output path; do not write that file yourself, and it is not a concern about owned files.'));
  assert.match(impl, /as: "impl_1"/);
  assert.match(impl, /outputSchema: IMPLEMENTER_STATUS_SCHEMA/);
  assert.match(impl, /worktree: true/);
  assert.match(impl, /concurrency: 4/);
  assert.match(impl, /stopOn: \{ path: "\/status", in: \["BLOCKED", "NEEDS_CONTEXT", "DONE_WITH_CONCERNS"\] \}/);
  assert.match(sr, /as: "sr_1"/);
  const srTask = sr.match(/task: "([^"]*)"/)[1];
  assert.doesNotMatch(srTask, /Review read-only; do not edit files\./);
  assert.ok(srTask.endsWith("read it for the 'What Implementer Claims They Built' section."));
  assert.match(sr, /output: "<REPORT_DIR>\/wave<w>-sr1\.md",\s*acceptance: \{ level: "none", reason: "the parent reads each SR Verdict: line; review trees are staged by design" \},\s*task:/);
  assert.doesNotMatch(sr.slice(sr.lastIndexOf('],') + 2), /\bacceptance:/);
  assert.doesNotMatch(impl, /\bacceptance:/);
  assert.equal((chain.match(/\bacceptance:/g) || []).length, 1);
  assert.doesNotMatch(sr, /\boutputSchema:/);
  assert.match(sr, /cwd: "\{outputs.impl_1.treePath\}"/);
  assert.match(sr, /\{outputs.impl_1.patchPath\}/);
  assert.match(sr, /concurrency: 4/);
  assert.doesNotMatch(sr, /\b(?:worktree|stopOn):/);
  assert.doesNotMatch(wave, /Older-runtime fallback|two fan-outs/);
  assert.match(wave, /structured_output` injection only for implementers carrying `outputSchema`/);
  assert.match(wave, /Keep SR schema-free because no `stopOn` reads its verdict\./);
  assert.doesNotMatch(wave, /acceptance contract identical to the plain fan-out/);
  assert.match(wave, /snapshot-backed spec reviews and code review carry no `acceptance` field/);
  assert.match(wave, /implementer statuses from fenced JSON in `## Outputs` and the `## Stop` line/);
  const readback = wave.match(/^Read the tool-result text, not `details`:[^\n]*/m)[0];
  assert.match(readback, /SR verdicts from the `Verdict:` line of each SR `output:` report/);
  for (const verdict of ['COMPLIANT', 'NEEDS_REWORK', 'OUT_OF_SCOPE_CHANGES']) {
    assert.ok(readback.includes(`\`${verdict}\``), `readback must name ${verdict}`);
  }
  assert.doesNotMatch(wave, /statuses and verdicts are fenced JSON/);
});

test('wave schema constrains only the implementer status vocabulary', () => {
  assert.doesNotMatch(skill, /SPEC_VERDICT_SCHEMA/);
  for (const [name, field, values] of [
    ['IMPLEMENTER_STATUS_SCHEMA', 'status', ['DONE', 'DONE_WITH_CONCERNS', 'NEEDS_CONTEXT', 'BLOCKED']],
  ]) {
    const definitions = [...wave.matchAll(new RegExp(`${name} = (\\{[^;]*?\\n[^\\n]*\\}\\s*\\}\\s*\\})`, 'g'))];
    assert.equal(definitions.length, 1, `${name} must be defined once`);
    const schema = JSON.parse(JSON.stringify(runInNewContext(`(${definitions[0][1]})`, Object.create(null))));
    assert.deepEqual(schema, { type: 'object', required: [field], additionalProperties: true,
      properties: { [field]: { type: 'string', enum: values } } });
  }
});

test('version preflight and retained-result recovery surround the initial chain', () => {
  const preflight = wave.indexOf('<!-- pi-cohort-preflight-shell -->');
  assert.ok(preflight >= 0 && preflight < wave.indexOf('subagent({'));
  assert.match(wave, /peerDependencies/);
  assert.match(wave, /pi-cohort >= /);
  assert.match(skill.split('## Dispatch')[1].split('## The Wave Loop')[0], /dispatching-parallel-agents/);
  const after = skill.split('## After All Tasks Complete')[1];
  assert.ok(after.indexOf('reference/happy-path-run.md') < after.indexOf('Before marking verify complete'));
  assert.match(after, /absolute path/);
  assert.doesNotMatch(skill, /<!-- happy-path-shell -->/);
  assert.match(readFileSync(new URL('../skills/subagent-driven-development/reference/happy-path-run.md', import.meta.url), 'utf8'), /<!-- happy-path-shell -->/);
  const recovery = wave.indexOf('### Chain stopped or failed');
  assert.ok(recovery > wave.indexOf('chain:'));
  assert.match(wave.slice(recovery), /successful siblings are never re-run/i);
  assert.match(wave.slice(recovery), /only accepted patches without a verdict/);
  assert.match(wave, /session `subagent-artifacts`/);
  assert.match(wave, /<runId>_implementer_<index>_output\.md/);
  assert.match(wave, /run\/task identity in the result or session transcript/);
  assert.match(wave, /source-defined per-agent naming for a failed reviewer/);
  assert.doesNotMatch(wave, /read its prose under `<Artifacts dir>\/parallel-0\//);
  assert.match(wave, /artifacts are disabled, missing, or cannot be unambiguously matched[^\n]*When a Subagent Fails[^\n]*visible diagnostic[^\n]*never invent a status/);
  const retained = wave.slice(recovery);
  assert.match(retained, /Inspect failed tasks regardless of whether `## Stop` is also present/);
  assert.match(retained, /stop condition before checking sibling failures/);
  assert.match(retained, /Chain error, with or without `## Stop`/);
  assert.match(retained, /Exit-0 stop \(`## Stop`\) with no failed siblings/);
  assert.match(retained, /`DONE_WITH_CONCERNS`[^\n]*nonzero `BLOCKED`[^\n]*diagnose[^\n]*retain/i);
  assert.match(retained, /recoverable `BLOCKED` or `NEEDS_CONTEXT`[^\n]*status matrix[^\n]*no patch/);
  assert.match(retained, /no recoverable status, or an accepted task with a missing\/empty patch[^\n]*When a Subagent Fails[^\n]*visible diagnostic/);
  const redispatch = retained.match(/^\*\*Re-dispatch by cause:\*\*[^\n]*/m)[0];
  assert.match(redispatch, /Materialize the replacement patch in a new detached `WAVE_BASE_SHA` checkout with `git apply --index` per \[Spec-review snapshots\]\(#spec-review-snapshots\)/);
  assert.match(redispatch, /on setup or tree-capture failure, stop dispatch and retain the failed snapshot directory and shell output/);
  assert.match(redispatch, /After successful setup, record tree-after in that replacement snapshot before dispatching one plain re-review/);
  assert.match(skill, /Second chain call in the same wave after a stop or a chain error - the retained results are the fan-out result; continue on the snapshot path\./);
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
  const ordered = ["[FULL TEXT of task from plan - paste it here, don't make subagent read file]", 'SCOPED_TEST_COMMANDS: [', 'TEST_CONTRACT: [', 'Tests call the via: seam directly', 'Create every Create: path at exactly that path.', 'one line per SCOPED_TEST_COMMANDS command', 'Any `unmet` -> `DONE_WITH_CONCERNS`.', '**Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT', 'Conduct (TDD scenarios, test economy, scope discipline, escalation, report shape) is your persona; this prompt carries only the task and its test scope.'];
  let previous = -1;
  for (const text of ordered) { const at = prompt.indexOf(text); assert.ok(at > previous, text); previous = at; }
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
  assert.match(status, /changed problem statement; component added, removed, or re-bounded/);
  assert.match(status, /another-round approval.*only.*no funded round left/);
  for (const text of ['recommended', 'alt-n', 'amended the spec: <title> - <what>', 'plan-writer', 'plan_check', 'tracker update', 'amend:']) assert.ok(status.includes(text), text);
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

test('funded rounds own stop-note funding rules and preserve the base stop note', () => {
  const funded = readFileSync(fixReference, 'utf8').split('## Funded rounds')[1];
  assert.match(funded, /While a budget token exists, include `budget: <spent> of <N> spent` in every stop note after `Problem:` and any `Searched:` lines and before the file finding/);
  for (const text of ['pre-escalation', 'missing `implModel`', 'exhausted fact lookups at spent zero', 'only round-history exception', '(not recovered on resume)', 'omit the line without a token']) assert.ok(funded.includes(text), text);
  assert.equal(createHash('sha256').update(stopNote).digest('hex'), '1da67e1750e45a8f3c50bd1bd9c750b22db4be33b347a25c45465ba3954e74f6');
});
