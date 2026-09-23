import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const loop = readFileSync(new URL('../skills/gatekeep-pr/reference/post-selection-loop.md', import.meta.url), 'utf8');
const menu = readFileSync(new URL('../skills/gatekeep-pr/reference/decision-menu.md', import.meta.url), 'utf8');
const brief = readFileSync(new URL('../skills/gatekeep-pr/verification-brief.md', import.meta.url), 'utf8');

// Static source contracts only: these do not execute the skill, a reviewer, or gh.
test('all comment-refetch entrypoints reconcile source-backed body deltas', () => {
  assert.match(loop, /Before a merge executes[^\n]*### Re-render.*steps 1-5/);
  const rerender = loop.split('### Re-render\n')[1].split('### Wait course\n')[0];
  assert.match(rerender, /After every push[^\n]*Then refetch comments/);
  assert.match(rerender, /^4\. Reconcile the body delta/m);
  assert.match(rerender, /^5\.[^\n]*Only after that review completes/m);
  assert.match(loop, /On (?:completion or )?timeout[^\n]*steps 1-5/i);
  assert.match(loop, /body delta[^\n]*digest's `comments`|digest's `comments`[^\n]*body delta/i);
  assert.match(loop, /same-head identical-body[^\n]*no source review/i);
});

test('new concerns block stale merge consent, including anyway, but failed fetch retains override', () => {
  assert.match(loop, /new or changed-body delta[^\n]*aborts[^\n]*merge/i);
  assert.match(menu, /`anyway`[^\n]*not[^\n]*unreviewed delta/i);
  assert.match(loop, /failed refetch[^\n]*`anyway`|`anyway`[^\n]*refetch-failure/i);
});

test('source review is not comment triage or blind bot promotion', () => {
  assert.match(loop, /Review each eligible delta[^\n]*source[^\n]*merged rubric/i);
  assert.match(loop, /Phase 4[^\n]*deduplicat/i);
  assert.match(brief, /comment triage never\s+mints `P#`\/`L#`/i);
  assert.match(brief, /inline\[ \{ id, updated_at, user_type, body,/);
  assert.match(brief, /top_level\[ \{ id, updated_at, user_type, body,/);
});

test('wait polling preserves the review baseline and checks freshness before reusing evidence', () => {
  const wait = loop.split('### Wait course\n')[1].split('### Teardown\n')[0];
  assert.match(wait, /polling refetch[^\n]*leave[^\n]*digest[^\n]*ledger[^\n]*untouched/i);
  assert.match(wait, /head[^\n]*advanced[^\n]*re-assessment[^\n]*before[^\n]*evidence/i);
});
