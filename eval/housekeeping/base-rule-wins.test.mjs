import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assemble, inputSha, parseCase, treeReader } from "../lib/replay.mjs";
import { parseExpected, runMechanical, sha256 } from "../lib/checks.mjs";
import { MODELS } from "../lib/models.mjs";
import { cellReusable, judgmentCurrent } from "../lib/records.mjs";
import { intentBody } from "../lib/intent.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const targetDir = "eval/housekeeping";

test("base-rule-wins: the card applies the fixed base and names the overridden repo rule", () => {
  assert.ok(read("skills/housekeeping/reference/base-rules.md").includes("| code-debug | Code | Remove leftover debug statements. |"));
  assert.ok(read("skills/housekeeping/reference/check.md").includes("When it permits what a base rule forbids, retain the base rule and record the repo rule's file and heading in that row's `overrides` cell."));
  assert.ok(read("skills/housekeeping/reference/card.md").includes("name the overridden repo rule and file when the check row's overrides cell is not none"));

  const target = JSON.parse(read(`${targetDir}/target.json`));
  const sample = "base-rule-wins";
  const { text, bundle, drop } = parseCase(read(`${targetDir}/samples/${sample}/case.md`));
  const selected = { ...target, skillFiles: target.skillFiles.filter(({ path }) => !drop.includes(path)) };
  const skill = assemble(selected, treeReader(root), bundle);
  const expected = read(`${targetDir}/samples/${sample}/expected.md`);
  const { facts } = parseExpected(expected);
  assert.ok(facts.length > 0, "the sample must assert facts");
  const candidate = JSON.parse(read(`${targetDir}/results/${sample}/candidate.json`));
  const baseline = JSON.parse(read(`${targetDir}/results/${sample}/baseline.json`));
  const identity = {
    kind: target.kind, assembly: target.assembly, thinking: MODELS.thinking,
    skillSha: sha256(skill), inputSha: inputSha(read(`${targetDir}/replay.md`), text, bundle),
  };
  for (const model of MODELS.replay) {
    assert.ok(cellReusable(candidate, model, identity), `${model}: stale or failed candidate`);
    const output = candidate.outputs[model];
    assert.ok(Object.values(runMechanical(facts, output.text)).every((result) => result === "holds"), `${model}: mechanical facts`);
    const judged = candidate.judge[model];
    assert.ok(judgmentCurrent(judged, {
      factsSha: sha256(expected), judgePromptSha: sha256(read("eval/judge.md")),
      intentSha: sha256(intentBody(read(`${targetDir}/intent.md`))),
      baselineOutputSha: sha256(baseline.outputs[model].text), candidateOutputSha: sha256(output.text),
    }), `${model}: stale judgment`);
    for (const { id } of facts) assert.equal(judged.facts[id]?.after, "holds", `${model}: ${id}`);
    assert.ok(["improved", "unchanged"].includes(judged.verdict), `${model}: ${judged.verdict}`);
  }
});
