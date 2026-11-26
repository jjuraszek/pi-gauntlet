import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { assemble, inputSha, parseCase } from '../eval/lib/replay.mjs';
import { parseExpected, runMechanical, sha256 } from '../eval/lib/checks.mjs';
import { intentBody } from '../eval/lib/intent.mjs';
import { lintTarget } from '../eval/lib/lint.mjs';
import { cellReusable, judgmentCurrent } from '../eval/lib/records.mjs';
import { MODELS } from '../eval/lib/models.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(resolve(root, path), 'utf8');

const [targetName, ...samples] = process.argv.slice(2);
assert.ok(!targetName || samples.length, 'name at least one sample for the selected target');
const selected = samples.map(sample => sample.includes('/') ? sample.split('/') : [targetName, sample]);
for (const name of targetName ? new Set(selected.map(([name]) => name)) : ['gauntlet', 'gatekeep-pr', 'loop']) {
  test(`${name}: intent binds to the current bundle-free assembly`, () => {
    const target = JSON.parse(read(`eval/${name}/target.json`));
    const binding = read(`eval/${name}/intent.md`).trimStart().split('\n')[0];
    assert.equal(binding, `for: ${sha256(assemble(target, read))}`);
  });
}

for (const [name, sample] of targetName ? selected : [
  ['conformance-reviewer', 'post-merge-action'],
  ['spec-council-member', 'non-criterion-row-flagged'],
  ['shape-ticket', 'venue-stripped'],
  ['shape-ticket', 'integration-sort'],
  ['shape-ticket', 'pr-body-proof'],
  ['gauntlet', 'workflow-stage-ticket-row'],
  ['gauntlet', 'ticket-all-rows-sorted'],
  ['gatekeep-pr-scope', 'integration-not-judged'],
  ['spec-gate', 'scope-cuts-listed'],
  ['gauntlet', 'pr-body-drafted-row'],
  ['gauntlet', 'post-action-sorted'],
  ['loop', 'seed-dispositions'],
  ['plan', 'post-action-no-task'],
]) {
  test(`${name}/${sample}: cached authoring facts hold on both models`, async () => {
    const dir = `eval/${name}`;
    const target = JSON.parse(read(`${dir}/target.json`));
    const { text, bundle, drop } = parseCase(read(`${dir}/samples/${sample}/case.md`));
    assert.deepEqual(lintTarget(resolve(root, dir)), []);
    const expected = read(`${dir}/samples/${sample}/expected.md`);
    const { facts } = parseExpected(expected);
    const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline.json`));
    const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
    assert.deepEqual(candidate.models, MODELS);
    assert.deepEqual(baseline.models, MODELS);
    assert.deepEqual(Object.keys(candidate.judge).sort(), [...MODELS.replay].sort());
    const identity = {
      kind: target.kind, assembly: target.assembly, thinking: MODELS.thinking,
      inputSha: inputSha(read(`${dir}/replay.md`), text, bundle),
      skillSha: sha256(assemble({ ...target, skillFiles: target.skillFiles.filter((file) => !drop.includes(file.path)) }, read, bundle)),
    };
    for (const model of MODELS.replay) {
      const judged = candidate.judge[model];
      assert.ok(judgmentCurrent(judged, {
        factsSha: sha256(expected), judgePromptSha: sha256(read('eval/judge.md')),
        intentSha: sha256(intentBody(read(`${dir}/intent.md`))),
        baselineOutputSha: sha256(baseline.outputs[model].text),
        candidateOutputSha: sha256(candidate.outputs[model].text),
      }), `${model}: stale judgment`);
      assert.ok(cellReusable(baseline, model, { ...identity, skillSha: baseline.skillSha }), `${model}: stale or failed baseline`);
      assert.ok(cellReusable(candidate, model, identity), `${model}: stale or failed candidate`);
      assert.ok(Object.values(runMechanical(facts, candidate.outputs[model].text)).every((value) => value === 'holds'), `${model}: mechanical facts`);
      for (const { id } of facts) assert.equal(judged.facts[id]?.after, 'holds', `${model}: ${id}`);
      assert.ok(['improved', 'unchanged'].includes(judged.verdict), `${model}: ${judged.verdict}`);
      if (name === 'plan' && sample === 'post-action-no-task') {
        const { createJiti } = await import('jiti');
        const { checkPlan } = await createJiti(import.meta.url).import('../extensions/lib/plan-check.ts');
        const spec = text.match(/```text\n([\s\S]*?)```/)[1].replace(/^\d+ ?/gm, '');
        const output = candidate.outputs[model].text;
        const plan = output.match(/^```markdown\n([\s\S]*)\n```/m)?.[1] ?? output;
        assert.equal(plan.split('release-audit --live').length - 1, 1, model);
        assert.match(plan, /^Excluded citation \(not work, not an acceptance condition\): `release-audit --live`\s*$/m);
        const paths = ['src/scan.mjs', 'scripts/release.mjs', 'tests/scan.test.mjs', 'tests/release.test.mjs', 'CHANGELOG.md', 'records.txt', 'doc/specs/scan.md'];
        assert.deepEqual(checkPlan(plan, spec, { exists: path => paths.includes(path), glob: () => [] }).findings, [], model);
      }
    }
  });
}
