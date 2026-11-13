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

test("pick-recorded-no-exec: retain the pick outside the repo and advance without executing it", (t) => {
  const card = read("skills/housekeeping/reference/card.md");
  for (const clause of [
    "Keep `<run>/decisions.md` outside the repo.",
    "Record the class, pick, excluded items and any verbatim fix instruction.",
    "After a successful decision write with cards still unanswered, acknowledge the class, pick and decisions path between the marker and the next card's title; state that nothing has executed and the walk is still open.",
    "Never edit tracked files, commit, push, create a PR or file a ticket during the walk.",
    "| An available row number | Record its pick, then show the next card. |",
    "| `go` | End the walk; execute only recorded picks; carry unanswered classes as not decided. |",
    "| `stop` | End per Report with nothing executed; keep the decisions file and name the run folder. |",
    "| An unavailable row, unknown item or unrecognized reply | Repeat the full card with one line naming the valid replies; keep this card open without recording a pick or advancing the walk. |",
    "After the last answer or `go`, pass the decisions to Fix.",
  ]) assert.ok(card.includes(clause), clause);
  assert.ok(read("doc/gate-contract.md").includes("An unavailable pick, unknown item or unrecognized reply repeats the full card with one line naming the valid replies; the card stays open without recording a pick or advancing the walk."));
  const skillText = read("skills/housekeeping/SKILL.md");
  assert.ok(skillText.includes("Only the last answer or `go` starts Fix; `stop` goes to Report with nothing executed."));
  assert.ok(skillText.includes("Name the run folder on every stop after Select created it; keep its decisions."));

  const target = JSON.parse(read(`${targetDir}/target.json`));
  const sample = "pick-recorded-no-exec";
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
