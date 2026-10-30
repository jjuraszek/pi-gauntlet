import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const roles = [
  ['implementer', 'BLOCKED', '67da899a5bf8cf4a3fb001148e0e85eda6d5fe73769540a96d6469053c75107c'],
  ['spec-reviewer', 'NEEDS_REWORK', 'b6558789ee0eee77ea203972eaf21a345ab3b68abcf6c086d742d8ac79b41548'],
  ['code-reviewer', 'REJECT', '25babb738b6108c8472024ba13ad72851904ff34b189dc34770dfb48f519def5'],
];
for (const [role, failure, frontmatter] of roles) {
  test(`${role}: anchored loading, inline fallback, mirrored failure and unchanged knobs`, () => {
    const text = read(`agents/${role}.md`);
    assert.equal(createHash('sha256').update(text.match(/^---\n[\s\S]*?\n---\n/)[0]).digest('hex'), frontmatter);
    for (const fragment of ['planPath', 'anchor`/`anchors', '### Task 4:', '### Task 40:', '^#{2,3}\\s', 'union', 'Spec:', 'Files:', 'Tests:', 'Rules:', '## Legs', 'Leg:', 'first `### Leg:`', 'inline', 'structured output', 'anchorUnreadable', 'Reasoning: anchor unreadable: <path>#<anchor>']) {
      assert.ok(text.includes(fragment), `${role} missing ${fragment}`);
    }
    assert.match(text, new RegExp(`unreadable[^\\n]*${failure}`));
    assert.match(text, /mirrors the report/);
    if (role === 'implementer') assert.match(text, /concerns\?: string\[\].*required for DONE_WITH_CONCERNS/);
    if (role === 'spec-reviewer') assert.match(text, /Never run tests, linters, or type-checkers/);
    if (role === 'code-reviewer') assert.match(text, /behaviourChange: boolean \(every report, mirrors `Behaviour-change:`\)/);
  });
}

test('SDD local templates pass paths, independent scope and preserve review triggers', () => {
  for (const name of ['implementer', 'spec-reviewer', 'code-quality-reviewer']) {
    const text = read(`skills/subagent-driven-development/${name}-prompt.md`);
    for (const field of ['planPath:', 'anchor:', 'anchors:', 'Spec:', 'SCOPED_TEST_COMMANDS:', 'structured output']) assert.ok(text.includes(field), `${name} missing ${field}`);
    assert.doesNotMatch(text, /FULL TEXT|paste it here|pasted verbatim|\[From implementer's report\]|Read `Verdict:`/);
    assert.match(text, /Previous review report \(re-review trigger\)/);
  }
  const cr = read('skills/subagent-driven-development/code-quality-reviewer-prompt.md');
  assert.match(cr, /HEAD_SHA:.*WORKTREE/);
  assert.match(cr, /TRAJECTORY: CONVERGING/);
  assert.match(cr, /after `Behaviour-change:`/);
  const sr = read('skills/subagent-driven-development/spec-reviewer-prompt.md');
  assert.match(sr, /spec is the sole authority/);
  assert.match(sr, /You never run the commands/);
});
