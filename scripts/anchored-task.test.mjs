import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const roles = [
  ['implementer', 'BLOCKED', '67da899a5bf8cf4a3fb001148e0e85eda6d5fe73769540a96d6469053c75107c'],
  ['wave-reviewer', 'REJECT', '25babb738b6108c8472024ba13ad72851904ff34b189dc34770dfb48f519def5'],
];
for (const [role, failure, frontmatter] of roles) {
  test(`${role}: anchored loading, inline fallback, mirrored failure and unchanged knobs`, () => {
    const text = read(`agents/${role}.md`);
    let knobs = text.match(/^---\n[\s\S]*?\n---\n/)[0];
    if (role === 'implementer') {
      assert.match(knobs, /^completionGuard: false$/m);
      knobs = knobs.replace(/^completionGuard: false$/m, 'completionGuard: true');
    }
    if (role === 'wave-reviewer') {
      assert.match(knobs, /^name: wave-reviewer$/m);
      assert.match(knobs, /^description: Wave review over an integrated diff: spec-clause table when a spec anchor is supplied plus prioritized code findings \(Critical and Moderate block, Minor is a nit\)\. Read-only - does not edit\.$/m);
      knobs = knobs.replace(/^name: wave-reviewer$/m, 'name: code-reviewer')
        .replace(/^description: .*$/m, 'description: Production-readiness code review with prioritized findings (Critical and Moderate block merge, Minor is a nit). Read-only — does not edit.');
    }
    assert.equal(createHash('sha256').update(knobs).digest('hex'), frontmatter);
    for (const fragment of ['planPath', 'anchor`/`anchors', '### Task 4:', '### Task 40:', '^#{2,3}\\s', 'union', 'Spec:', 'Files:', 'Tests:', 'Rules:', '## Legs', 'Leg:', 'first `### Leg:`', 'inline', 'structured output', 'anchorUnreadable', 'Reasoning: anchor unreadable: <path>#<anchor>']) {
      assert.ok(text.includes(fragment), `${role} missing ${fragment}`);
    }
    assert.match(text, new RegExp(`unreadable[^\\n]*${failure}`));
    assert.match(text, /mirrors the report/);
    if (role === 'implementer') assert.match(text, /concerns\?: string\[\].*required for DONE_WITH_CONCERNS/);
    if (role === 'wave-reviewer') {
      assert.doesNotMatch(text, /Behaviour-change:|behaviourChange/);
      assert.match(text, /met \| unmet \| out-of-scope/);
      assert.match(text, /findingCount: number/);
      assert.match(text, /findings: \{ critical, moderate, minor \}/);
      assert.match(text, /unmet.*out-of-scope.*FIX_FIRST/);
      assert.match(text, /Without spec anchors, omit the clause table/);
      for (const retired of ['code-reviewer', 'spec-reviewer']) {
        assert.equal(existsSync(new URL(`../agents/${retired}.md`, import.meta.url)), false);
      }
    }
  });
}

test('SDD local templates pass paths, independent scope and preserve review triggers', () => {
  for (const name of ['implementer', 'wave-reviewer']) {
    const text = read(`skills/subagent-driven-development/${name}-prompt.md`);
    for (const field of ['planPath:', 'anchor:', 'anchors:', 'Spec:', 'SCOPED_TEST_COMMANDS:', 'structured output']) assert.ok(text.includes(field), `${name} missing ${field}`);
    assert.doesNotMatch(text, /FULL TEXT|paste it here|pasted verbatim|\[From implementer's report\]|Read `Verdict:`/);
    assert.match(text, /Previous review report \(re-review trigger\)/);
  }
  const cr = read('skills/subagent-driven-development/wave-reviewer-prompt.md');
  assert.match(cr, /HEAD_SHA:.*WORKTREE/);
  assert.match(cr, /TRAJECTORY: CONVERGING/);
  assert.doesNotMatch(cr, /Behaviour-change:|behaviourChange/);
  assert.match(cr, /sole authority/);
  assert.match(cr, /met \| unmet \| out-of-scope/);
});
