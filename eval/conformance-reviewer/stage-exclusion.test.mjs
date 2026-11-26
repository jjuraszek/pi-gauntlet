import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { assemble, inputSha, parseCase } from "../lib/replay.mjs";
import { parseExpected, runMechanical, sha256 } from "../lib/checks.mjs";
import { intentBody } from "../lib/intent.mjs";
import { lintTarget } from "../lib/lint.mjs";
import { cellReusable, judgmentCurrent } from "../lib/records.mjs";
import { MODELS } from "../lib/models.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const dir = "eval/conformance-reviewer";

for (const sample of ["stage-only-sentences", "mixed-row"]) {
  test(`${sample}: functionality is covered without judging external clauses`, () => {
    assert.deepEqual(lintTarget(resolve(root, dir)), []);
    const target = JSON.parse(read(`${dir}/target.json`));
    const { text, bundle } = parseCase(read(`${dir}/samples/${sample}/case.md`));
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
      skillSha: sha256(assemble(target, read, bundle)),
    };
    for (const model of MODELS.replay) {
      assert.ok(cellReusable(candidate, model, identity), `${model}: stale or failed replay`);
      assert.ok(cellReusable(baseline, model, { ...identity, skillSha: baseline.skillSha }), `${model}: inconsistent baseline`);
      const output = candidate.outputs[model];
      assert.ok(Object.values(runMechanical(facts, output.text)).every((value) => value === "holds"), `${model}: mechanical facts`);
      assert.match(output.text, /Conformance verdict: CONFORMS/);
      assert.doesNotMatch(output.text, /\[(?:PARTIAL|MISSING|DRIFTED|UNAUTHORIZED)\]/);
      if (sample === "mixed-row") {
        assert.match(output.text, /legacy\//);
      } else {
        assert.doesNotMatch(output.text, /PR description|Ship evidence|root scan time/i);
      }
      const judged = candidate.judge[model];
      assert.ok(judgmentCurrent(judged, {
        factsSha: sha256(expected), judgePromptSha: sha256(read("eval/judge.md")),
        intentSha: sha256(intentBody(read(`${dir}/intent.md`))),
        baselineOutputSha: sha256(baseline.outputs[model].text), candidateOutputSha: sha256(output.text),
      }), `${model}: stale judgment`);
      for (const { id } of facts) assert.equal(judged.facts[id]?.after, "holds", `${model}: ${id}`);
      assert.ok(["improved", "unchanged"].includes(judged.verdict), `${model}: ${judged.verdict}`);
    }
  });
}
