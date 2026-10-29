import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

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

test('failed apply retains original changed-task inventory for a fresh retry', () => {
  const writer = read('agents/plan-writer.md');
  const surface = read('skills/brainstorming/reference/amendment-surface.md');
  assert.match(writer, /original task numbers, titles, spec anchors, and wave positions in the existing saved apply report/);
  assert.match(writer, /retain that original inventory on every return, including failures/);
  assert.match(writer, /`previousApplyReport`[^.]*read the original inventory/);
  assert.match(writer, /deltas against that original inventory rather than the already-mutated plan/);
  assert.match(writer, /Missing original inventory fails the retry/);
  assert.match(writer, /idempotently without duplicating already-applied edits/);
  assert.match(surface, /`previousApplyReport` set to the first apply report path/);
  assert.match(surface, /original inventory rather than the already-mutated plan/);
  assert.match(surface, /Missing original inventory fails the retry/);
});
