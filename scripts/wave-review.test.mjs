import test from 'node:test';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const skill = readFileSync(new URL('../skills/subagent-driven-development/SKILL.md', import.meta.url), 'utf8');
const template = readFileSync(new URL('../skills/requesting-code-review/code-reviewer.md', import.meta.url), 'utf8');
const wave = skill.split('## Parallel-Wave Mode')[1].split('## Spec-review snapshots')[0];

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
  assert.ok(blocks.some(block => block.includes('tasks:') && !block.includes('chain:')), 'retain plain fallback');
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
  const preflight = wave.indexOf('COHORT_DIR=$(pi list');
  const dispatch = wave.indexOf('subagent({');
  assert.ok(preflight >= 0 && preflight < dispatch, 'preflight before first dispatch');
  assert.match(wave, /three semver components numerically/);
  assert.match(wave, /unparseable/);
  assert.match(wave, /unknown/);
  assert.match(wave, /two fan-outs for every wave/);
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
  assert.match(redispatch, /Snapshot the replacement patch with \[Spec-review snapshots\]\(#spec-review-snapshots\) \(a setup failure stops dispatch and keeps the failed snapshot\)/);
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
