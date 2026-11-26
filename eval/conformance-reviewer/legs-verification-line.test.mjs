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

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const dir = "eval/conformance-reviewer";
const sample = "legs-verification-line";

test("leg verification retains file requirements and omits delivery-stage clauses", () => {
  const persona = read("agents/conformance-reviewer.md");
  assert.ok(persona.includes("Keep a file deliverable within the same sentence as its own requirement, even when missing."));
  assert.deepEqual(lintTarget(resolve(root, dir)), []);

  const target = JSON.parse(read(`${dir}/target.json`));
  const { text, bundle } = parseCase(read(`${dir}/samples/${sample}/case.md`));
  assert.ok(bundle.includes("skills/shape-ticket/reference/ac-classes.md"));
  assert.match(text, /^- verification: .*; regenerated bundles committed;/m);
  const expected = read(`${dir}/samples/${sample}/expected.md`);
  const { facts } = parseExpected(expected);
  const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline.json`));
  const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
  const models = candidate.models;
  assert.ok(models.replay.length > 0, "at least one recorded replay model");
  assert.deepEqual(baseline.models, models);
  assert.deepEqual(Object.keys(candidate.judge).sort(), [...models.replay].sort());
  const identity = {
    kind: target.kind, assembly: target.assembly, thinking: models.thinking,
    inputSha: inputSha(read(`${dir}/replay.md`), text, bundle),
    skillSha: sha256(assemble(target, read, bundle)),
  };
  for (const model of models.replay) {
    assert.ok(cellReusable(candidate, model, identity), `${model}: stale or failed candidate replay`);
    assert.ok(cellReusable(baseline, model, { ...identity, skillSha: baseline.skillSha }), `${model}: inconsistent baseline`);
    const output = candidate.outputs[model];
    assert.ok(Object.values(runMechanical(facts, output.text)).every((value) => value === "holds"), `${model}: mechanical facts`);
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
