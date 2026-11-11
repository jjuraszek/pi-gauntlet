import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { inputSha, parseCase } from '../eval/lib/replay.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const root = '../eval/gatekeep-pr';
const sample = 'post-menu-combined';

test('terminal post menu expands one recommendation and settles without another gate', () => {
  const menus = read('../skills/gatekeep-pr/reference/menus.md');
  const post = menus.split('## post\n')[1]?.split('\n## ')[0];
  assert.ok(post, 'one post archetype owns terminal steps');
  assert.match(post, /row 1.*combination.*labels and row numbers/);
  assert.match(post, /PR copy of coverage.*ticket copy/);
  assert.match(post, /Only number a step with work to execute/);
  assert.match(post, /exact command or what it posts and where/);
  assert.match(post, /Pick one, or several separated by commas:/);
  assert.match(post, /post-selection-loop\.md.*### Next action/);
  const loop = read('../skills/gatekeep-pr/reference/post-selection-loop.md');
  assert.match(loop, /Run the picked steps in.*step order/);
  assert.match(loop, /without another gatekeep-pr menu/);
  assert.match(loop, /post_steps/);
  const cleanup = read('../skills/gatekeep-pr/reference/cleanup.md');
  assert.match(cleanup, /Run only the picked step/);
  assert.doesNotMatch(cleanup, /set `cleanup_done`|re-render the same terminal menu/);
  assert.doesNotMatch(menus, /A post re-renders this template/);
});

test('saved post replay offers each runnable step and ends after the combination pick', () => {
  const parsed = parseCase(read(`${root}/samples/${sample}/case.md`));
  const expected = read(`${root}/samples/${sample}/expected.md`);
  const facts = parseExpected(expected).facts;
  const saved = JSON.parse(read(`${root}/results/${sample}/candidate.json`));
  assert.equal(saved.inputSha, inputSha(read(`${root}/replay.md`), parsed.text, parsed.bundle));
  assert.ok(saved.models.replay.length > 0);
  for (const model of saved.models.replay) {
    const output = saved.outputs[model];
    const judge = saved.judge[model];
    assert.equal(output.status, 'ok', model);
    assert.equal(judge.factsSha, sha256(expected), model);
    assert.equal(judge.candidateOutputSha, sha256(output.text), model);
    for (const { id } of facts) assert.equal(judge.facts[id]?.after, 'holds', `${model}: ${id}`);
    assert.equal((output.text.match(/gauntlet: gate=gatekeep-pr\/own-merge/g) ?? []).length, 1, model);
    assert.match(output.text, /gauntlet: done merged/, model);
  }
});
