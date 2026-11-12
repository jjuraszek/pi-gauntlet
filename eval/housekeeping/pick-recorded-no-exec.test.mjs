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

test("pick-recorded-no-exec: retain the pick outside the repo and advance without executing it", () => {
  const card = read("skills/housekeeping/reference/card.md");
  for (const clause of [
    "Keep `<run>/decisions.md` outside the repo.",
    "Record the class, pick, excluded items and any verbatim fix instruction.",
    "After a successful decision write with cards still unanswered, acknowledge the class, pick and decisions path between the marker and the next card's title; state that nothing has executed and the walk is still open.",
    "Never edit tracked files, commit, push, create a PR or file a ticket during the walk.",
    "| An available row number | Record its pick, then show the next card. |",
    "| `go` | End the walk; execute only recorded picks; carry unanswered classes as not decided. |",
    "| `stop` | End per Report with nothing executed; keep the decisions file and name the run folder. |",
    "After the last answer or `go`, pass the decisions to Fix.",
  ]) assert.ok(card.includes(clause), clause);
  const skillText = read("skills/housekeeping/SKILL.md");
  assert.ok(skillText.includes("Only the last answer or `go` starts Fix; `stop` goes to Report with nothing executed."));
  assert.ok(skillText.includes("Name the run folder on every stop after Select created it; keep its decisions."));

  const target = JSON.parse(read(`${targetDir}/target.json`));
  const sample = "pick-recorded-no-exec";
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
