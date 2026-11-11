import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { inputSha, parseCase } from '../eval/lib/replay.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const root = '../eval/gatekeep-pr';
const sample = 'post-menu-set-reply';

test('post picks expand and deduplicate only after validating the whole reply', () => {
  const loop = read('../skills/gatekeep-pr/reference/post-selection-loop.md');
  const next = loop.split('### Next action\n')[1].split('\n### Post steps')[0];
  for (const rule of [
    /comma-separated set of row numbers against the retained rendered mapping/,
    /Expand the combination to its member steps and collapse duplicates/,
    /Exact `reply <n>`.*selects drafted reply n, not menu row n/,
    /number outside 1-N, stop combined with another number.*asks one clarifying question.*runs nothing/,
    /On a second invalid reply, leave the same menu waiting; emit no new question or `gauntlet: question` marker/,
    /Show evidence.*re-render the same menu without settlement/,
  ]) assert.match(next, rule);
  assert.match(loop, /Run the picked steps in.*step order, not reply order/);
});

test('saved post selections cover sets, inspection, reply ids and invalid picks', () => {
  const parsed = parseCase(read(`${root}/samples/${sample}/case.md`));
  const expected = read(`${root}/samples/${sample}/expected.md`);
  const facts = parseExpected(expected).facts;
  assert.equal(facts.length, 14);
  for (const id of ['subset', 'union', 'typed-reply', 'inspection', 'stop', 'mixed-stop', 'out-of-range', 'approved-freshness', 'all-rows', 'typed-stop', 'failure-continuation', 'nested-pause', 'closing-commands', 'queued-stop']) {
    assert.ok(facts.some((fact) => fact.id === id), id);
  }
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
  }
});
