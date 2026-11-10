import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { inputSha, parseCase } from '../eval/lib/replay.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const root = '../eval/gatekeep-pr';
const sample = 'post-step-pr-named';

test('PR-named actions resolve only through unique merge-base commands', () => {
  const findings = read('../skills/gatekeep-pr/reference/findings.md');
  const steps = findings.split('## PR-named steps\n')[1]?.split('\n## ')[0];
  assert.ok(steps, 'step 5 owns after-merge action discovery and command resolution');
  for (const rule of [
    /PR body.*spec at the assessed head/,
    /observation.*check-delivery/,
    /merge-base.*overrides file.*AGENTS\.md/,
    /one hop/,
    /same sentence, list item or table row/,
    /distinct command strings/,
    /Exactly one.*runnable/,
    /PR text.*never supplies.*command/,
    /No command.*two or more.*unfilled token.*open/,
    /every source sentence/,
    /cleanup.*item.*one row.*list order/,
    /post menu.*closing message.*source sentence/,
    /cleanup\.md.*dispatcher/,
  ]) assert.match(steps, rule);
  const post = read('../skills/gatekeep-pr/reference/menus.md').split('## post\n')[1].split('\n## ')[0];
  assert.match(post, /findings\.md.*## PR-named steps/);
  assert.match(post, /always include runnable PR-named steps/);
  assert.match(post, /show its source sentence beside its command/);
});

test('saved PR-named replay offers trusted steps and preserves unresolved sources', () => {
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
