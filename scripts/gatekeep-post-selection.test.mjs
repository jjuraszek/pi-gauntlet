import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
function historicalModels(record) {
  const models = [];
  for (const model of record.models.replay) {
    const output = record.outputs[model];
    const context = `${record.sample}/${model}`;
    if (output?.status === 'error') {
      assert.equal(output.status, 'error', `${context}: errored replay excluded from evidence`);
      assert.ok(typeof output.error === 'string' && output.error.trim().length > 0, `${context}: errored replay excluded from evidence needs an error string`);
      console.log(`${context}: errored replay excluded from evidence`);
      continue;
    }
    assert.equal(output?.status, 'ok', context);
    assert.ok(typeof output.text === 'string' && output.text.trim().length > 0, `${context}: nonempty reply text`);
    assert.equal(record.judge?.[model]?.candidateOutputSha, sha256(output.text), `${context}: recorded output hash`);
    models.push(model);
  }
  assert.ok(models.length > 0, `${record.sample}: at least one hash-verified ok reply`);
  return models;
}

const root = '../eval/gatekeep-pr';
const sample = 'post-menu-set-reply';

test('post picks expand and deduplicate only after validating the whole reply', () => {
  const loop = read('../skills/gatekeep-pr/reference/post-selection-loop.md');
  const next = loop.split('### Next action\n')[1].split('\n### Post steps')[0];
  for (const rule of [
    /comma-separated set of row numbers against the retained rendered mapping/,
    /Expand the combination to its member steps and collapse duplicates/,
    /Exact `reply <n>`.*selects drafted reply n, not menu row n/,
    /number outside 1-N, back or stop combined with another number.*asks one clarifying question.*runs nothing/,
    /On a second invalid reply, leave the same menu waiting; emit no new question or `gauntlet: question` marker/,
    /Show evidence.*re-render the same menu without settlement/,
  ]) assert.match(next, rule);
  assert.match(loop, /Run the picked steps in.*step order, not reply order/);
});

test('terminal stop saves missing draft bodies before reporting paths or deleting drafts', () => {
  const loop = read('../skills/gatekeep-pr/reference/post-selection-loop.md');
  const teardown = loop.split('### Teardown\n')[1];
  assert.ok(teardown, 'stop must not depend on entering Post steps');
  const save = teardown.indexOf('Collect every unrun or failed drafted reply and coverage body into `KEEP`');
  assert.ok(save >= 0, 'teardown must collect kept bodies even outside Post steps');
  const preparation = teardown.slice(save, teardown.indexOf('\n\n', save));
  assert.match(preparation, /write a body without a file there first/);
  assert.match(preparation, /run the marked block below before composing the closing message/);
  for (const state of ['final', 'merge-queued', 'post']) {
    assert.ok(preparation.includes(`\`${state}\``), `${state} stop preserves bodies`);
  }
  assert.ok(save < teardown.indexOf('After the terminal marker and settlement row'));
  assert.ok(save < teardown.indexOf('<!-- gate-teardown-shell -->'));
  assert.match(teardown, /Name its printed kept paths in the not-run sentences/);
  assert.match(teardown, /skip the block: move and delete nothing/);
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
  for (const model of historicalModels(saved)) {
    const output = saved.outputs[model];
    const judge = saved.judge[model];
    assert.equal(output.status, 'ok', model);
    assert.match(judge.factsSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded facts hash');
    assert.equal(judge.candidateOutputSha, sha256(output.text), model);
    for (const { id } of facts) assert.equal(judge.facts[id]?.after, 'holds', `${model}: ${id}`);
  }
});
