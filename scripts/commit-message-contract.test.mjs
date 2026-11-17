import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { parseCase } from '../eval/lib/replay.mjs';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { judgmentCurrent } from '../eval/lib/records.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const reference = 'skills/finishing-a-development-branch/reference/commit-message.md';
const read = (path) => readFileSync(resolve(root, path), 'utf8');
function historicalModels(record, candidate = record) {
  const models = [];
  for (const model of record.models.replay) {
    const output = record.outputs[model];
    const context = `${record.sample}/${record.arm}/${model}`;
    if (output?.status === 'error') {
      assert.equal(output.status, 'error', `${context}: errored replay excluded from evidence`);
      assert.ok(typeof output.error === 'string' && output.error.trim().length > 0, `${context}: errored replay excluded from evidence needs an error string`);
      console.log(`${context}: errored replay excluded from evidence`);
      continue;
    }
    assert.equal(output?.status, 'ok', context);
    assert.ok(typeof output.text === 'string' && output.text.trim().length > 0, `${context}: nonempty reply text`);
    const hash = candidate.judge?.[model]?.[`${record.arm}OutputSha`];
    // Failed paired replays have no judgment of the successful arm.
    if (hash === undefined && candidate.outputs[model]?.status === 'error') continue;
    assert.equal(hash, sha256(output.text), `${context}: recorded output hash`);
    models.push(model);
  }
  assert.ok(models.length > 0, `${record.sample}/${record.arm}: at least one hash-verified ok reply`);
  return models;
}

test('historical saved replies reject unusable cells and exclude errors from judgments', () => {
  const record = () => ({
    sample: 'saved-reply-contract', arm: 'candidate', models: { replay: ['ok-model'] },
    outputs: { 'ok-model': { status: 'ok', text: 'reply' } },
    judge: { 'ok-model': { candidateOutputSha: sha256('reply') } },
  });
  for (const [name, mutate, message] of [
    ['blank text', r => { r.outputs['ok-model'].text = ''; }, /nonempty reply text/],
    ['stale hash', r => { r.outputs['ok-model'].text = 'edited reply'; }, /recorded output hash/],
    ['missing hash', r => { delete r.judge['ok-model'].candidateOutputSha; }, /recorded output hash/],
    ['empty error', r => { r.outputs['ok-model'] = { status: 'error', error: '' }; }, /needs an error string/],
    ['only errors', r => { r.outputs['ok-model'] = { status: 'error', error: 'provider failure' }; }, /at least one hash-verified ok reply/],
  ]) {
    const malformed = record();
    mutate(malformed);
    assert.throws(() => historicalModels(malformed), message, name);
  }
  const mixed = record();
  mixed.models.replay.push('error-model');
  mixed.outputs['error-model'] = { status: 'error', error: 'provider failure' };
  Object.defineProperty(mixed.judge, 'error-model', {
    get() { assert.fail('an errored replay must not read a judgment'); },
  });
  assert.deepEqual(historicalModels(mixed), ['ok-model']);
});

const sites = [
  'agents/loop-implementer.md',
  'skills/loop-implementation/SKILL.md',
  'skills/loop-implementation/reference/interrupted-recovery.md',
  'skills/loop-implementation/reference/coordinated-legs.md',
  'skills/loop-implementation/reference/unreachable-returns.md',
  'skills/gatekeep-pr/reference/fix-wave.md',
  'skills/gatekeep-pr/reference/post-selection-loop.md',
  'skills/gatekeep-pr/reference/menus.md',
  'skills/chase-bug/hotfix.md',
  'skills/housekeeping/reference/fix.md',
  'skills/subagent-driven-development/SKILL.md',
  'skills/writing-plans/SKILL.md',
  'skills/writing-plans/reference/plan-contract.md',
  'skills/brainstorming/reference/spec-finalization.md',
  'skills/brainstorming/reference/amendment-surface.md',
  'skills/brainstorming/reference/legs.md',
  'skills/gauntlet-resume/reference/brief-contract.md',
  'skills/gauntlet-resume/reference/reconstruction.md',
  'skills/finishing-a-development-branch/SKILL.md',
  'skills/finishing-a-development-branch/reference/legs.md',
  'skills/verification-before-completion/reference/conformance-check.md',
  'skills/finishing-a-development-branch/reference/disposition-protocol.md',
  'skills/using-git-worktrees/SKILL.md',
  'skills/using-git-worktrees/reference/pr-head.md',
  ['skills/using-git-worktrees/reference/pr-head.md', 'Merge the fetched base'],
];

test('shared wording reference owns all five parts and ticket resolution', () => {
  const text = read(reference);
  for (const heading of ['Subject', 'Body', 'Landed message', 'Word sources', 'Squash-default note']) {
    assert.ok(text.includes(`## ${heading}\n`), heading);
  }
  for (const token of ['72 characters', '**Ticket:**', 'refs:', 'ticket:', 'wording:', 'COMMIT_MESSAGES', 'PR_BODY', 'BLANK']) {
    assert.ok(text.includes(token), token);
  }
  assert.match(text, /\| Member pull request merge commit \|[^\n]+\n\| Base-sync merge commit \|[^\n]*`Sync with the fetched base`/);
});

for (const site of sites) {
  const [path, heading] = Array.isArray(site) ? site : [site];
  test(`${path}${heading ? `#${heading}` : ''} cites the shared wording source`, () => {
    const source = read(path);
    const text = heading ? source.split(`### ${heading}\n`)[1]?.split(/^#{2,3}\s/m)[0] ?? '' : source;
    if (path.startsWith('agents/')) {
      assert.ok(/wording:/.test(text), 'the persona must consume the absolute wording input');
      assert.ok(/ticket:/.test(text), 'the persona must consume the dispatched ticket');
      return;
    }
    const links = [...text.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)].map((match) => resolve(root, dirname(path), match[1]));
    assert.ok(links.includes(resolve(root, reference)), `${path} has no resolving commit-message.md citation`);
  });
}

test('spec, consent, housekeeping and citation-repair commits delegate wording', () => {
  const spec = read('skills/brainstorming/reference/spec-finalization.md');
  assert.match(spec.slice(spec.indexOf('Then commit the spec'), spec.indexOf('Evaluate the summary')), /commit-message\.md/);
  assert.match(spec, /same subject as the home spec commit/);
  const consent = read('skills/brainstorming/reference/amendment-surface.md').split('## Implement-local maintenance boundaries')[0];
  assert.match(consent, /commit-message\.md/);
  assert.doesNotMatch(consent, /printf 'grant:|batch's `amend:` commit/);
  const fix = read('skills/housekeeping/reference/fix.md');
  assert.match(fix, /wording: <absolute path>/);
  assert.match(fix, /ticket: <reference or none>/);
  assert.match(fix, /card's title/);
  const repair = read('skills/gauntlet-resume/reference/brief-contract.md').split('### Citation repair')[1];
  assert.match(repair, /commit-message\.md/);
  assert.doesNotMatch(repair, /commit[^\n]+-m "resume:|subject is not `amend:`/);
});

test('amendment batches and chosen spec dispositions use the shared message recipe', () => {
  const amendment = read('skills/brainstorming/reference/amendment-surface.md');
  const apply = amendment.split('## 5. Apply, aftermath, commit')[1].split('## Conformance entry')[0];
  assert.match(apply, /commit-message\.md/);
  assert.doesNotMatch(apply, /subject `loop:|^amend:|single `amend:`|subject marker/m);
  assert.match(apply, /<handle> \| <title> \| <what> \|/);
  assert.match(apply, /amended \| <cut row n, or N item\(s\)>/);
  const disposition = read('skills/finishing-a-development-branch/reference/disposition-protocol.md');
  assert.match(disposition.split('2. **Commit spec edits**')[1].split('\n3.')[0], /commit-message\.md/);
});

test('finish composes landed messages and reads amendment records without subject filters', () => {
  const finish = read('skills/finishing-a-development-branch/SKILL.md');
  const digest = finish.split('**Amendment digest (both variants).**')[1].split('**Rework PR subject')[0];
  assert.match(digest, /--format=%b/);
  assert.doesNotMatch(digest, /--grep|--extended-regexp/);
  assert.match(finish, /--title "\$LANDED_SUBJECT"/);
  assert.match(finish, /git -C "\$PRIMARY" commit -F - <<'EOF'\n<landed message>\nEOF/);
  assert.match(finish, /Squash-default note/);
  assert.doesNotMatch(finish, /commit -m "<imperative summary>|Commit `whole-diff minors fix`/);
  const minors = finish.split('**Standalone extra reply')[1].split('### Step 5')[0];
  assert.match(minors, /wording:/);
  assert.match(minors, /ticket:/);
  const legs = read('skills/finishing-a-development-branch/reference/legs.md');
  assert.match(legs, /commit-message\.md/);
  assert.match(legs, /Home: <repo> <shared branch>`/);
  assert.ok(finish.includes('commit -m "Remove ephemeral plan doc"'));
});

test('worktree ignore commit uses the shared bookkeeping sentence', () => {
  const text = read('skills/using-git-worktrees/SKILL.md').split('### 2b.')[1].split('### 2c.')[0];
  assert.match(text, /commit-message\.md/);
  assert.match(text, /commit -m "\$IGNORE_SUBJECT"/);
  assert.doesNotMatch(text, /commit -m "Ignore \.worktrees\//);
});

for (const [targetName, sample] of [
  ['brainstorming', 'spec-and-amendment-subjects'],
  ['using-git-worktrees', 'ignore-subject'],
  ['loop-implementer', 'home-plain-commit'],
  ['loop-implementer', 'companion-return-file'],
  ['loop-implementation', 'returned-line-admission'],
]) {
  test(`historical saved replies: ${targetName}/${sample} preserves completed message replies`, () => {
    const dir = `eval/${targetName}`;
    read(`${dir}/samples/${sample}/case.md`);
    const expected = read(`${dir}/samples/${sample}/expected.md`);
    const { facts } = parseExpected(expected);
    assert.ok(facts.length > 0);
    const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
    const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline.json`));
    assert.deepEqual(candidate.models, baseline.models);
    assert.ok(candidate.models.replay.length > 0);
    read(`${dir}/replay.md`);
    assert.match(candidate.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
    assert.match(candidate.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
    const baselineModels = historicalModels(baseline, candidate);
    const models = historicalModels(candidate).filter(model => baselineModels.includes(model));
    assert.ok(models.length > 0, `${sample}: requires a hash-verified ok reply pair`);
    for (const model of models) {
      assert.equal(candidate.outputs[model]?.status, 'ok', model);
      const judgment = candidate.judge[model];
      for (const key of ['factsSha', 'judgePromptSha', 'intentSha']) {
        assert.match(judgment[key], /^[a-f0-9]{64}$/, `historical saved replies: recorded ${key}`);
      }
      assert.ok(judgmentCurrent(judgment, {
        factsSha: judgment.factsSha, judgePromptSha: judgment.judgePromptSha,
        intentSha: judgment.intentSha,
        baselineOutputSha: sha256(baseline.outputs[model].text),
        candidateOutputSha: sha256(candidate.outputs[model].text),
      }), 'historical saved replies: judgment matches recorded outputs');
      for (const { id } of facts) assert.equal(judgment.facts[id]?.after, 'holds', `${model}: ${id}`);
      assert.ok(['improved', 'unchanged'].includes(judgment.verdict), `${model}: ${judgment.verdict}`);
    }
  });
}

test('loop worker and dispatcher carry wording and ledger-held home attribution', () => {
  const worker = read('agents/loop-implementer.md');
  const driver = read('skills/loop-implementation/SKILL.md');
  assert.match(worker, /wording:.*absolute path/);
  assert.match(worker, /ticket:/);
  assert.match(worker, /return:.*absolute path/);
  assert.match(worker, /returned:/);
  assert.doesNotMatch(worker, /subject `loop:|commit-body path|companion commit body|separate body lines/);
  assert.match(driver, /wording: <absolute path>/);
  assert.match(driver, /ticket: <reference or none>/);
  assert.match(driver, /returned: none/);
  assert.match(driver, /ledger has no returned: line - resume through/);
  assert.doesNotMatch(driver.split('\n## Validate the return\n')[1].split('\n## Unreachable returns\n')[0], /commit bod|subject `loop:/);
  assert.doesNotMatch(driver, /No committed tuple remains/);
});

test('companion admission reads attributed return files regardless of commit wording', () => {
  const source = read('skills/loop-implementation/reference/coordinated-legs.md');
  const script = source.match(/<!-- companion-return-shell -->\s*```bash\n([\s\S]*?)\n```/)[1];
  assert.match(script, /"\$RETURN_FILE"/);
  assert.doesNotMatch(script, /%B|subject/);
  for (const [name, change, accepted] of [
    ['plain subject', {}, true],
    ['arbitrary subject', { subject: 'A human chose this message' }, true],
    ['legacy label has no authority', { subject: 'loop: row 99 failed' }, true],
    ['wrong tuple', { tuple: 'pending: 1 | other | aaaaaaa' }, false],
    ['wrong consumed count', { iteration: 5 }, false],
    ['missing file', { missing: true }, false],
    ['foreign row', { row: 1 }, false],
    ['unchanged attempts', { attempts: 0 }, false],
    ['partial seed', { seed: true }, true],
  ]) {
    const dir = mkdtempSync(join(tmpdir(), 'commit-return-'));
    const checkout = join(dir, 'companion');
    mkdirSync(checkout);
    const git = (...args) => execFileSync('git', ['-C', checkout, ...args], {
      encoding: 'utf8', timeout: 10000,
      env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
        GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
        GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' },
    }).trim();
    git('init', '-q');
    git('commit', '--allow-empty', '-qm', 'Start fixture');
    const base = git('rev-parse', 'HEAD');
    const target = change.seed ? 'seed' : '2';
    const pending = `pending: ${target} | companion | ${base}`;
    const ledger = `# Ledger - loop engine\niterations: 6\nallowance: 10\nreturned: none\n${pending}\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n| 1 | open | 0 | |\n| 2 | open | 0 | |\n| 3 | open | 0 | |\n\n## Leg mapping\n| row | ac | leg |\n|---|---|---|\n| 1 | 1 | home |\n| 2 | 2 | companion |\n| 3 | 3 | companion |\n\n## Decisions\n`;
    const saved = join(dir, 'home-ledger.md');
    writeFileSync(saved, ledger);
    const returnFile = join(git('rev-parse', '--path-format=absolute', '--git-dir'), 'gauntlet', 'returns', `${base}-6.md`);
    mkdirSync(dirname(returnFile), { recursive: true });
    const row = change.row ?? 2;
    const rows = change.seed ? '| 2 | done | 0 | node --test totals.test.mjs; passed |\n| 3 | open | 0 | |' : `| ${row} | done | ${change.attempts ?? 1} | node --test totals.test.mjs; passed |`;
    const decision = change.seed ? 'row 0 done | seeded 1 rows, closed 1 on baseline | row 3' : `row ${row} done | Count imported plants | Reuse totals.test.mjs`;
    if (!change.missing) writeFileSync(returnFile, `${change.tuple ?? pending}\niteration: ${change.iteration ?? 6}\n\n${rows}\n\n${decision}\n`);
    git('commit', '--allow-empty', '-qm', change.subject ?? 'Count imported plants');
    const result = spawnSync('bash', ['-c', script], {
      encoding: 'utf8', timeout: 10000,
      env: { ...process.env, CHECKOUT: checkout, PENDING: pending, ITERATION: '6', SAVED_LEDGER: saved, RETURN_FILE: returnFile },
    });
    assert.equal(result.status === 0, accepted, `${name}: ${result.stderr}`);
    if (accepted) assert.equal(JSON.parse(result.stdout).decision, decision, name);
    assert.equal(readFileSync(saved, 'utf8'), ledger, 'admission never mutates home');
  }
});

for (const [path, required, forbidden] of [
  ['skills/gatekeep-pr/reference/fix-wave.md', [/wording:/, /ticket:/, /return:/, /--git-dir/, /return file/], /subject `loop:|commit.body|malformed subject/],
  ['skills/gatekeep-pr/reference/post-selection-loop.md', [/--subject/, /--body-file/, /squash_merge_commit_message/, /--match-head-commit/, /rebase.*neither/], /(?:--squash|--merge) -m/],
  ['skills/chase-bug/hotfix.md', [/wording:/, /ticket:/, /return:/, /--git-dir/, /commit -F -/, /--title/, /--body-file/], /subject `loop:|commit.body|malformed subject|commit -m "fix:/],
  ['skills/gauntlet-resume/reference/reconstruction.md', [/legacy-commit-labels:begin/, /legacy-commit-labels:end/, /returned: none/, /repair seed/, /Returns conversion on resume/], null],
  ['skills/verification-before-completion/reference/conformance-check.md', [/Conformance gap fix/, /Convergence repair/, /wording:/, /ticket:/, /record.*SHA/i], /commit(?:s| name| with the message)?[^\n]*`conformance fix|oldest `conformance fix`/],
  ['skills/using-git-worktrees/reference/pr-head.md', [/Member pull request merge commit/, /merge --no-ff -F -/, /second parent/], /%H %P %s|canonical subject|merge PR #<N> head/],
]) {
  test(`${path} delegates commit wording without using messages as state`, () => {
    const source = read(path);
    for (const pattern of required) assert.match(source, pattern);
    if (forbidden) assert.doesNotMatch(source, forbidden);
    if (path.endsWith('/reconstruction.md')) {
      const active = source.replace(/<!-- legacy-commit-labels:begin -->[\s\S]*?<!-- legacy-commit-labels:end -->/, '');
      assert.doesNotMatch(active, /loop: (?:row|seed|migrate|repair)|commit bod|--format=%B/);
      assert.match(active, /returned:.*pending:|pending:.*returned:/);
    }
  });
}

test('eval authoring docs require isolated boundaries and sample-selected commands', () => {
  const guide = read('eval/README.md');
  const template = read('eval/_template/README.md');
  for (const literal of ['## Isolate the behavior under test', 'Prefer deterministic tests',
    'entry boundary', 'stop boundary', 'one decision axis', 'Before a model call',
    'completed change summary and a bound ticket', 'passing these checks is not end-to-end process proof']) {
    assert.ok(guide.includes(literal), literal);
  }
  assert.match(template, /\]\(\.\.\/README\.md#isolate-the-behavior-under-test\)/);
  assert.match(template, /node eval\/run\.mjs <target> <sample> --baseline-only/);
  assert.doesNotMatch(template, /node eval\/run\.mjs <target> --baseline-only/);
});

for (const [targetName, sample, factId, historical] of [
  ['gatekeep-pr', 'merge-landed-message', 'message', true],
  ['gatekeep-pr', 'fix-row-return-file', 'admission', true],
  ['chase-bug', 'hotfix-return-file', 'admission', true],
  ['chase-bug', 'hotfix-plain-landing', 'message', false],
  ['gauntlet-resume', 'returned-line-recovery', 'home', true],
  ['gauntlet-resume', 'legacy-ledger-conversion', 'eligibility', true],
]) {
  test(`historical saved replies: ${targetName}/${sample} validates recorded cells beside the isolated sample`, () => {
    const dir = `eval/${targetName}`;
    const { text } = parseCase(read(`${dir}/samples/${sample}/case.md`));
    for (const heading of ['Entry boundary', 'Fixed inputs', 'Decision axis', 'Output', 'Stop boundary', 'Validation']) {
      assert.ok(text.includes(`## ${heading}\n`), heading);
    }
    const { facts } = parseExpected(read(`${dir}/samples/${sample}/expected.md`));
    assert.deepEqual(facts.map(({ id }) => id), [factId]);
    assert.match(text.split('## Stop boundary\n')[1].split('\n## ')[0], /Stop.*(?:output|decision|message)/);
    assert.match(read(`${dir}/report.md`), /historical/i);
    if (historical) {
      const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
      for (const arm of ['baseline', 'candidate']) {
        const record = JSON.parse(read(`${dir}/results/${sample}/${arm}.json`));
        read(`${dir}/replay.md`);
        assert.match(record.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
        assert.match(record.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
        historicalModels(record, candidate);
      }
    }
  });
}

for (const [targetName, sample, factIds] of [
  ['finishing-a-development-branch', 'landed-message', ['subject', 'shape', 'delivery', 'note', 'minors']],
  ['finishing-a-development-branch', 'digest-from-record-lines', ['source', 'digest', 'menu']],
  ['housekeeping', 'commit-subject', ['dispatch', 'wording', 'bounds']],
]) {
  test(`historical saved replies: ${targetName}/${sample} preserves completed message replies`, () => {
    const dir = `eval/${targetName}`;
    read(`${dir}/samples/${sample}/case.md`);
    const { facts } = parseExpected(read(`${dir}/samples/${sample}/expected.md`));
    assert.deepEqual(facts.map(({ id }) => id), factIds);
    const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
    read(`${dir}/replay.md`);
    assert.match(candidate.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
    assert.match(candidate.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
    assert.ok(candidate.models.replay.length > 0);
    for (const model of historicalModels(candidate)) {
      assert.equal(candidate.outputs[model]?.status, 'ok', model);
      for (const id of factIds) assert.equal(candidate.judge[model]?.facts[id]?.after, 'holds', `${model}: ${id}`);
      assert.ok(['improved', 'unchanged'].includes(candidate.judge[model]?.verdict), model);
    }
  });
}

test('plan task, plan handoff and wave commit sites delegate wording without templates', () => {
  const plan = read('skills/writing-plans/SKILL.md');
  const contract = read('skills/writing-plans/reference/plan-contract.md');
  const wave = read('skills/subagent-driven-development/SKILL.md');
  const prerequisites = read('skills/subagent-driven-development/reference/prerequisites.md');
  assert.match(wave, /Read \[wave prerequisites\]\(\.\/reference\/prerequisites\.md\) at its absolute path now; stop if unreadable/);
  for (const text of [plan, contract, wave, prerequisites]) assert.doesNotMatch(text, /commit -m "plan:|<imperative subject> \(ref/);
  assert.match(contract.slice(contract.indexOf('**Step 6: Commit**'), contract.indexOf('## Spec anchors')), /commit-message\.md/);
  assert.match(plan.slice(plan.indexOf('## Execution Handoff')), /commit-message\.md/);
  assert.match(wave.slice(wave.indexOf('7. **Commit.**'), wave.indexOf('`WAVE_BASE_SHA` is fixed')), /commit-message\.md/);
  assert.match(prerequisites, /spec H1/);
  assert.match(wave, /manifest.*heading|heading.*manifest/);
  assert.match(wave, /ticket:/);
  assert.match(wave, /wording:/);
  assert.ok(wave.includes('-m "wave integrated snapshot"'));
});
