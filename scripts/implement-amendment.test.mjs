import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Amend-prepare contracts require the completion guard no-edit sentence', () => {
  for (const path of [
    'skills/subagent-driven-development/reference/implement-amendments.md',
    'skills/brainstorming/reference/amendment-surface.md',
    'agents/plan-writer.md',
  ]) assert.ok(read(path).includes('Do not edit any file.'), path);
});

test('implement amendment modes bound preparation and granted apply without changing ordinary planning', () => {
  const text = read('agents/plan-writer.md');
  assert.equal(text.match(/^---\n[\s\S]*?\n---/)[0], `---
name: plan-writer
description: Writes, checks, and repairs the gauntlet implementation plan for one approved spec in a fresh context; the plan file is its only output. Dispatched only by the writing-plans skill; not for direct dispatch.
tools: read, grep, find, ls, bash, write, plan_check
inheritProjectContext: false
inheritSkills: false
completionGuard: true
systemPromptMode: replace
---`);
  const modes = text.slice(text.indexOf('## Implement-only amendment modes'), text.indexOf('## Procedure'));
  for (const marker of ['Amend-prepare:', 'Amend-apply:', 'writes nothing', 'one paragraph', 'structured output', 'concerns', 'question', 'redraw', 'granted items verbatim', 'named spec sections', 'pre-apply task numbers', 'tasksAdded', 'tasksAnchorChanged', 'tasksRemoved', 'amendedSections', 'passed', 'failLines', 'substantive baseline', 'parent owns stamping', 'Baseline']) assert.ok(modes.includes(marker), marker);
  assert.ok(text.indexOf('## Implement-only amendment modes') < text.indexOf('## Procedure'));
  for (const marker of ['five absolute paths', '`Findings:`', '`Amend:`', 'preserve every task title and wave position', 'The plan path is the only file you write', 'Never call `plan_tracker`, `phase_tracker`, or `subagent`']) assert.ok(text.includes(marker), marker);
  assert.match(text, /Outside these implement-only modes, keep the ordinary output contract and shell restrictions/);
});

test('implement surface delegates through the gate and reconciles only after parent checking', () => {
  const text = read('skills/brainstorming/reference/amendment-surface.md');
  assert.match(text, /## 1\. Prepare - never apply yet\n\n\*\*Implement callers only, with a task plan:\*\*/);
  for (const marker of ['Implement callers only', 'Amend-prepare:', 'Amend-apply:', 'one-step chain', 'granted items verbatim', 'fresh manifest', 'pre-apply task numbers', 'passed: false', 'failLines', 'second failure', 'without reading the plan or spec', 'Planning callers keep', 'structured `concerns`/`question`']) assert.ok(text.includes(marker), marker);
  for (const marker of ['**Value decoding**', 'malformed -> stop', '## 4. Human batch', 'In-flight:', 'One commit per batch:', 'never the plan-writer or implementer']) assert.ok(text.includes(marker), marker);
});

for (const path of ['agents/plan-writer.md', 'skills/brainstorming/reference/amendment-surface.md']) {
  test(`${path} carries redraw-only and mixed batches across the structured boundary`, () => {
    const text = read(path);
    assert.match(text, /items: \[\{ evidence,[^\n]*redraws: \[\{ location: "<spec section>", reason: string \(max 300 characters\) \}\]/);
    assert.match(text, /(?:Both `items` and `redraws` arrays are required|Require both `items` and `redraws` arrays), including when empty/);
    assert.match(text, /redraw proposals appear only in `redraws`, never in `items`/);
    assert.match(text, /nonempty `redraws` array holds the whole batch[^.]*before grant evaluation or applying any sibling item/);
    assert.match(text, /Fail malformed preparation output/);
    assert.match(text, /never opens the preparation report to discover redraws/);
  });
}

test('implement apply patches locally and compares semantic obligations against original inventory', () => {
  const writer = read('agents/plan-writer.md');
  for (const marker of ['anchored obligation text', 'task bodies and Tests', 'patch only affected task entries', 'meaning-preserving rewording', 'line offsets', '**Baseline policy:** implement-local', 'no endpoint-tree equivalence', 'nonzero executed-test count']) assert.ok(writer.includes(marker), marker);
  const contract = read('skills/subagent-driven-development/reference/dispatch-contract.md');
  assert.match(contract, /tasksAnchorChanged[^\n]*semantic obligation or work changes/);
});

test('apply uses committed home originals at every binding site and fails before writes', () => {
  for (const path of ['agents/plan-writer.md', 'skills/brainstorming/reference/amendment-surface.md', 'skills/writing-plans/SKILL.md', 'skills/writing-plans/reference/plan-contract.md', 'skills/subagent-driven-development/reference/dispatch-contract.md', 'skills/subagent-driven-development/reference/implement-amendments.md']) {
    const text = read(path);
    assert.match(text, /committed (?:home )?plan\/spec originals/, path);
    assert.doesNotMatch(text, /Missing original inventory fails the retry|capture the original task numbers[^.]*saved apply report/i, path);
  }
  const writer = read('agents/plan-writer.md');
  for (const marker of ['git -C "<abs home worktree>" show HEAD:<home-relative plan path>', 'git -C "<abs home worktree>" show HEAD:<home-relative spec path>', 'before the first edit', 'baseline read failed: git -C ', 'first stderr line', 'writes nothing', 'previousApplyReport', 'findings only', 'idempotently without duplicating already-applied edits']) assert.ok(writer.includes(marker), marker);
});

test('suppressed apply capture is schema-checked and only the exact baseline marker skips retry', () => {
  for (const path of ['skills/subagent-driven-development/reference/implement-amendments.md', 'skills/brainstorming/reference/amendment-surface.md']) {
    const text = read(path);
    for (const marker of ['APPLY_SCHEMA', 'success envelope', 'zero or two', 'baseline read failed: git -C ', 'retry once', 'previousApplyReport', 'parent PASS']) assert.ok(text.includes(marker), `${path}: ${marker}`);
  }
});

test('handoff and implement entry establish originals with path-scoped staging', () => {
  const plans = read('skills/writing-plans/SKILL.md');
  const handoff = plans.slice(plans.indexOf('\n## Execution Handoff\n'));
  assert.ok(handoff.indexOf('git -C') < handoff.indexOf('action: "init"'));
  assert.match(handoff, /status --porcelain -- "<home-relative plan path>"/);
  assert.ok(handoff.indexOf('status --porcelain') < handoff.indexOf('add --'));
  assert.match(handoff, /On empty output, skip staging and commit/);
  assert.match(handoff, /Stop on any status, staging or commit failure/);
  assert.match(handoff, /add -- "<home-relative plan path>"/);
  assert.match(handoff, /commit -m "plan: <spec title>" -- "<home-relative plan path>"/);
  const sdd = read('skills/subagent-driven-development/SKILL.md');
  assert.match(sdd, /status --porcelain -- "<home-relative plan path>" "<home-relative spec path>"/);
  assert.match(sdd, /add -- "<home-relative plan path>" "<home-relative spec path>"/);
});
