import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';

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

test('terminal stop saves missing draft bodies before reporting paths or deleting drafts', () => {
  const loop = read('../skills/gatekeep-pr/reference/post-selection-loop.md');
  const teardown = loop.split('### Teardown\n')[1];
  assert.ok(teardown, 'stop must not depend on entering Post steps');
  const save = teardown.indexOf('Save every unrun or failed drafted reply and coverage body');
  assert.ok(save >= 0, 'teardown must write bodies that have no file yet');
  const preparation = teardown.slice(save, teardown.indexOf('\n\n', save));
  assert.match(preparation, /reuse existing body files/);
  assert.match(preparation, /before printing their paths or deleting drafts/);
  for (const state of ['final', 'merge-queued', 'post']) {
    assert.ok(preparation.includes(`\`${state}\``), `${state} stop preserves bodies`);
  }
  assert.ok(save < teardown.indexOf('After the terminal marker and settlement row'));
  assert.ok(save < teardown.indexOf('Delete both finding artifacts'));
  assert.match(teardown, /except retained post payload files/);
});

test('historical saved replies: post selections cover sets, inspection, reply ids and invalid picks', () => {
  read(`${root}/samples/${sample}/case.md`);
  const expected = read(`${root}/samples/${sample}/expected.md`);
  const facts = parseExpected(expected).facts;
  assert.equal(facts.length, 14);
  for (const id of ['subset', 'union', 'typed-reply', 'inspection', 'stop', 'mixed-stop', 'out-of-range', 'approved-freshness', 'all-rows', 'typed-stop', 'failure-continuation', 'nested-pause', 'closing-commands', 'queued-stop']) {
    assert.ok(facts.some((fact) => fact.id === id), id);
  }
  const saved = JSON.parse(read(`${root}/results/${sample}/candidate.json`));
  read(`${root}/replay.md`);
  assert.match(saved.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
  assert.match(saved.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
  assert.ok(saved.models.replay.length > 0);
  for (const model of saved.models.replay) {
    const output = saved.outputs[model];
    const judge = saved.judge[model];
    assert.equal(output.status, 'ok', model);
    assert.match(judge.factsSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded facts hash');
    assert.equal(judge.candidateOutputSha, sha256(output.text), model);
    for (const { id } of facts) assert.equal(judge.facts[id]?.after, 'holds', `${model}: ${id}`);
  }
});
