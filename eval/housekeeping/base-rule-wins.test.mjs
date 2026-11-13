import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assemble, inputSha, parseCase } from "../lib/replay.mjs";
import { parseExpected, runMechanical, sha256 } from "../lib/checks.mjs";
import { cellReusable, judgmentCurrent } from "../lib/records.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const targetDir = "eval/housekeeping";

test("base-rule-wins: the card applies the fixed base and names the overridden repo rule", (t) => {
  assert.ok(read("skills/housekeeping/reference/base-rules.md").includes("| code-debug | Code | Remove leftover debug statements. |"));
  assert.ok(read("skills/housekeeping/reference/check.md").includes("When it permits what a base rule forbids, retain the base rule and record the repo rule's file and heading in that row's `overrides` cell."));
  assert.ok(read("skills/housekeeping/reference/card.md").includes("name the overridden repo rule and file when the check row's overrides cell is not none"));

  const target = JSON.parse(read(`${targetDir}/target.json`));
  const sample = "base-rule-wins";
  const { text, bundle, drop } = parseCase(read(`${targetDir}/samples/${sample}/case.md`));
  const selected = { ...target, skillFiles: target.skillFiles.filter(({ path }) => !drop.includes(path)) };
  const skill = assemble(selected, read, bundle);
  const expected = read(`${targetDir}/samples/${sample}/expected.md`);
  const { facts } = parseExpected(expected);
  assert.ok(facts.length > 0, "the sample must assert facts");
  const candidate = JSON.parse(read(`${targetDir}/results/${sample}/candidate.json`));
  const baseline = JSON.parse(read(`${targetDir}/results/${sample}/baseline.json`));
  const models = candidate.models;
  assert.deepEqual(baseline.models, models, "baseline and candidate model identity");
  assert.ok(Array.isArray(models.replay) && models.replay.length > 0, "recorded replay models");
  for (const model of models.replay) assert.match(model, /^\S+\/\S+$/, "recorded replay model identity");
  assert.match(models.judge, /^\S+\/\S+$/, "recorded judge identity");
  assert.match(models.thinking, /^\S+$/, "recorded thinking level");
  assert.deepEqual(Object.keys(candidate.judge).sort(), [...models.replay].sort(), "judgments cover recorded models");
  // Archived provenance is checked for consistency, not rebuilt from historical Git objects.
  t.diagnostic(`Archived ${sample} replies from ${candidate.repoSha} are stale-to-HEAD evidence, not a current-source replay (saved skillSha ${candidate.skillSha}; current ${sha256(skill)}).`);
  const identity = {
    kind: target.kind, assembly: target.assembly, thinking: models.thinking,
    inputSha: inputSha(read(`${targetDir}/replay.md`), text, bundle),
  };
  for (const record of [baseline, candidate]) {
    assert.equal(record.sample, sample);
    assert.match(record.repoSha, /^[a-f0-9]{40}$/, `${record.arm}: recorded source commit`);
    assert.match(record.skillSha, /^[a-f0-9]{64}$/, `${record.arm}: recorded assembly hash`);
    assert.deepEqual(Object.keys(record.outputs).sort(), [...models.replay].sort(), `${record.arm}: outputs cover recorded models`);
    assert.equal(record.thinking, models.thinking);
  }
  assert.equal(baseline.arm, "baseline");
  assert.equal(candidate.arm, "candidate");
  const recordedIntentSha = candidate.judge[models.replay[0]].intentSha;
  assert.match(recordedIntentSha, /^[a-f0-9]{64}$/, "recorded intent hash");
  for (const model of models.replay) {
    for (const record of [baseline, candidate]) {
      assert.ok(cellReusable(record, model, { ...identity, skillSha: record.skillSha }), `${model}: inconsistent or failed ${record.arm}`);
    }
    const output = candidate.outputs[model];
    assert.ok(Object.values(runMechanical(facts, output.text)).every((result) => result === "holds"), `${model}: mechanical facts`);
    const judged = candidate.judge[model];
    assert.ok(judgmentCurrent(judged, {
      factsSha: sha256(expected), judgePromptSha: sha256(read("eval/judge.md")),
      intentSha: recordedIntentSha,
      baselineOutputSha: sha256(baseline.outputs[model].text), candidateOutputSha: sha256(output.text),
    }), `${model}: stale judgment`);
    for (const { id } of facts) assert.equal(judged.facts[id]?.after, "holds", `${model}: ${id}`);
    assert.ok(["improved", "unchanged"].includes(judged.verdict), `${model}: ${judged.verdict}`);
  }
});
