import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { intentBody, parseIntent } from '../eval/lib/intent.mjs';
import { lintTarget } from '../eval/lib/lint.mjs';
import { judgmentCurrent, readRecord } from '../eval/lib/records.mjs';
import { assemble, baseReader, inputSha, parseCase, treeReader } from '../eval/lib/replay.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = treeReader(root);
const dir = 'eval/gauntlet-resume';
const target = JSON.parse(read(`${dir}/target.json`));
const stages = ['brainstorm', 'plan', 'ship'];

test('C3 inputs pass the runner preflight against the required baseline', () => {
  assert.deepEqual(lintTarget(`${root}${dir}`, {
    baselineHas(path) {
      try { baseReader(root, '09c9f4e1')(path); return true; }
      catch { return false; }
    },
    treeHas: path => existsSync(`${root}${path}`),
  }), []);
  const intent = parseIntent(read(`${dir}/intent.md`), sha256(assemble(target, read)));
  assert.equal(intent.status, 'ok', intent.reason);
});

for (const stage of stages) {
  const sample = `current-${stage}-brief`;
  test(`${sample}: current producer shape and stage-specific facts`, () => {
    const { text } = parseCase(read(`${dir}/samples/${sample}/case.md`));
    const { facts } = parseExpected(read(`${dir}/samples/${sample}/expected.md`));
    const brief = text.split('```text\n')[1]?.split('\n```')[0];
    assert.ok(brief, 'complete brief in a text fence');
    assert.match(brief, /^# Handoff: /);
    assert.deepEqual([...brief.matchAll(/^## (.+)$/gm)].map(match => match[1]),
      ['Intent', 'Repo state', 'Decisions', 'Open questions', 'Skills loaded: none', 'Process state']);
    assert.match(brief, new RegExp(`^  → ${stage}(?:\\(|$)`, 'm'));
    assert.equal((brief.match(/^  → /gm) ?? []).length, 1);
    assert.match(brief, /\nActive task: .+\nGate history not restored - re-validate before advancing\.$/);
    assert.deepEqual(facts.map(fact => fact.id), ['calls', 'snapshot', 'gates']);
    assert.doesNotMatch(brief, /^legs:|^Ledger:|^PR:/m);
  });

  test(`${sample}: paired recorded-input equivalence`, () => {
    const results = `${root}${dir}/results`;
    for (const arm of ['baseline', 'candidate']) {
      assert.ok(existsSync(`${results}/${sample}/${arm}.json`),
        `C3 ${sample}/${arm}.json missing: the primary session runs the selected paired replay`);
    }
    const baseline = readRecord(results, sample, 'baseline');
    const candidate = readRecord(results, sample, 'candidate');
    const { bundle, drop, text } = parseCase(read(`${dir}/samples/${sample}/case.md`));
    const selected = { ...target, skillFiles: target.skillFiles.filter(file => !drop.includes(file.path)) };
    const newPaths = target.skillFiles.filter(file => file.new).map(file => file.path);
    const expected = read(`${dir}/samples/${sample}/expected.md`);
    const { facts } = parseExpected(expected);
    const input = inputSha(read(`${dir}/replay.md`), text, bundle);
    assert.equal(baseline.skillSha, sha256(assemble(selected, baseReader(root, '09c9f4e1'), bundle, { arm: 'baseline', newPaths })));
    assert.equal(candidate.skillSha, sha256(assemble(selected, read, bundle)));
    assert.equal(baseline.inputSha, input);
    assert.equal(candidate.inputSha, input);
    assert.ok(candidate.models.replay.length > 0, 'paired replay must select models');
    assert.deepEqual(candidate.models.replay, baseline.models.replay);
    for (const model of candidate.models.replay) {
      const before = baseline.outputs[model];
      const after = candidate.outputs[model];
      for (const output of [before, after]) {
        assert.equal(output?.status, 'ok', model);
        assert.ok(output.text.trim(), `${model}: nonempty replay`);
      }
      const judgment = candidate.judge?.[model];
      assert.ok(judgmentCurrent(judgment, {
        factsSha: sha256(expected), judgePromptSha: sha256(read('eval/judge.md')),
        intentSha: sha256(intentBody(read(`${dir}/intent.md`))),
        baselineOutputSha: sha256(before.text), candidateOutputSha: sha256(after.text),
      }), `${model}: current judgment bound to both outputs`);
      for (const fact of facts) {
        assert.equal(judgment.facts[fact.id]?.before, 'holds', `${model}/${fact.id}: baseline`);
        assert.equal(judgment.facts[fact.id]?.after, 'holds', `${model}/${fact.id}: candidate`);
      }
    }
  });
}
