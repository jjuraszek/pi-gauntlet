import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

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
