import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { assemble, inputSha, parseCase } from '../eval/lib/replay.mjs';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { intentBody } from '../eval/lib/intent.mjs';
import { cellReusable, judgmentCurrent } from '../eval/lib/records.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const reference = 'skills/finishing-a-development-branch/reference/commit-message.md';
const read = (path) => readFileSync(resolve(root, path), 'utf8');
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
];

test('shared wording reference owns all five parts and ticket resolution', () => {
  const text = read(reference);
  for (const heading of ['Subject', 'Body', 'Landed message', 'Word sources', 'Squash-default note']) {
    assert.ok(text.includes(`## ${heading}\n`), heading);
  }
  for (const token of ['72 characters', '**Ticket:**', 'refs:', 'ticket:', 'wording:', 'COMMIT_MESSAGES', 'PR_BODY', 'BLANK']) {
    assert.ok(text.includes(token), token);
  }
});

for (const path of sites) {
  test(`${path} cites the shared wording source`, () => {
    const text = read(path);
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

test('worktree ignore commit uses the shared bookkeeping sentence', () => {
  const text = read('skills/using-git-worktrees/SKILL.md').split('### 2b.')[1].split('### 2c.')[0];
  assert.match(text, /commit-message\.md/);
  assert.match(text, /commit -m "\$IGNORE_SUBJECT"/);
  assert.doesNotMatch(text, /commit -m "Ignore \.worktrees\//);
});

for (const [targetName, sample] of [
  ['brainstorming', 'spec-and-grant-message'],
  ['housekeeping', 'commit-subject'],
  ['using-git-worktrees', 'ignore-subject'],
  ['gauntlet-resume', 'plan-citation-subject'],
]) {
  test(`${targetName}/${sample} saved replies hold every current message fact`, () => {
    const dir = `eval/${targetName}`;
    const target = JSON.parse(read(`${dir}/target.json`));
    const { bundle, drop, text } = parseCase(read(`${dir}/samples/${sample}/case.md`));
    const selected = { ...target, skillFiles: target.skillFiles.filter(({ path }) => !drop.includes(path)) };
    const expected = read(`${dir}/samples/${sample}/expected.md`);
    const { facts } = parseExpected(expected);
    assert.ok(facts.length > 0);
    const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
    const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline.json`));
    assert.deepEqual(candidate.models, baseline.models);
    assert.ok(candidate.models.replay.length > 0);
    for (const model of candidate.models.replay) {
      assert.ok(cellReusable(candidate, model, {
        skillSha: sha256(assemble(selected, read, bundle)),
        inputSha: inputSha(read(`${dir}/replay.md`), text, bundle),
        kind: target.kind, assembly: target.assembly, thinking: candidate.models.thinking,
      }), `${model}: missing or stale candidate output`);
      const judgment = candidate.judge[model];
      assert.ok(judgmentCurrent(judgment, {
        factsSha: sha256(expected), judgePromptSha: sha256(read('eval/judge.md')),
        intentSha: sha256(intentBody(read(`${dir}/intent.md`))),
        baselineOutputSha: sha256(baseline.outputs[model].text),
        candidateOutputSha: sha256(candidate.outputs[model].text),
      }), `${model}: stale judgment`);
      for (const { id } of facts) assert.equal(judgment.facts[id]?.after, 'holds', `${model}: ${id}`);
      assert.ok(['improved', 'unchanged'].includes(judgment.verdict), `${model}: ${judgment.verdict}`);
    }
  });
}

test('plan task, plan handoff and wave commit sites delegate wording without templates', () => {
  const plan = read('skills/writing-plans/SKILL.md');
  const wave = read('skills/subagent-driven-development/SKILL.md');
  for (const text of [plan, wave]) assert.doesNotMatch(text, /commit -m "plan:|<imperative subject> \(ref/);
  assert.match(plan.slice(plan.indexOf('**Step 6: Commit**'), plan.indexOf('## Spec Coverage Table')), /commit-message\.md/);
  assert.match(plan.slice(plan.indexOf('## Execution Handoff')), /commit-message\.md/);
  assert.match(wave.slice(wave.indexOf('7. **Commit.**'), wave.indexOf('`WAVE_BASE_SHA` is fixed')), /commit-message\.md/);
  assert.match(wave, /spec H1/);
  assert.match(wave, /manifest.*heading|heading.*manifest/);
  assert.match(wave, /ticket:/);
  assert.match(wave, /wording:/);
  assert.ok(wave.includes('-m "wave integrated snapshot"'));
});
