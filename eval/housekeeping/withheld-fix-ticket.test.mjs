import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assemble, inputSha, parseCase } from "../lib/replay.mjs";
import { parseExpected, runMechanical, sha256 } from "../lib/checks.mjs";
import { MODELS } from "../lib/models.mjs";
import { cellReusable, judgmentCurrent } from "../lib/records.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const targetDir = "eval/housekeeping";

test("withheld-fix-ticket: a public-contract change withholds Fix and recommends Ticket", (t) => {
  const target = JSON.parse(read(`${targetDir}/target.json`));
  const sample = "withheld-fix-ticket";
  const { text, bundle, drop } = parseCase(read(`${targetDir}/samples/${sample}/case.md`));
  const selected = { ...target, skillFiles: target.skillFiles.filter(({ path }) => !drop.includes(path)) };
  const skill = assemble(selected, read, bundle);
  const expected = read(`${targetDir}/samples/${sample}/expected.md`);
  const { facts } = parseExpected(expected);
  const candidate = JSON.parse(read(`${targetDir}/results/${sample}/candidate.json`));
  const baseline = JSON.parse(read(`${targetDir}/results/${sample}/baseline.json`));
  // Archived provenance is checked for consistency, not rebuilt from historical Git objects.
  t.diagnostic(`Archived ${sample} replies from ${candidate.repoSha} are stale-to-HEAD evidence, not a current-source replay (saved skillSha ${candidate.skillSha}; current ${sha256(skill)}).`);
  const identity = {
    kind: target.kind, assembly: target.assembly, thinking: MODELS.thinking,
    inputSha: inputSha(read(`${targetDir}/replay.md`), text, bundle),
  };
  for (const record of [baseline, candidate]) {
    assert.equal(record.sample, sample);
    assert.match(record.repoSha, /^[a-f0-9]{40}$/, `${record.arm}: recorded source commit`);
    assert.match(record.skillSha, /^[a-f0-9]{64}$/, `${record.arm}: recorded assembly hash`);
    assert.deepEqual(record.models, MODELS, `${record.arm}: recorded model identity`);
    assert.equal(record.thinking, MODELS.thinking);
  }
  assert.equal(baseline.arm, "baseline");
  assert.equal(candidate.arm, "candidate");
  const recordedIntentSha = candidate.judge[MODELS.replay[0]].intentSha;
  assert.match(recordedIntentSha, /^[a-f0-9]{64}$/, "recorded intent hash");
  for (const model of MODELS.replay) {
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
    const picks = output.text.split("\nPick one:\n")[1];
    assert.ok(picks, `${model}: numbered picks`);
    assert.match(picks, /^1\. \[ \] Fix - unavailable: .+/m, `${model}: Fix has an unavailable reason`);
    assert.match(picks, /^2\. \[ \] Ticket[^\n]*\[recommended\]/m, `${model}: Ticket is recommended`);
    assert.match(picks, /^3\. \[ \] Ignore/m, `${model}: Ignore remains available`);
    assert.equal((picks.match(/\[recommended\]/g) ?? []).length, 1, `${model}: one recommendation`);
    assert.doesNotMatch(picks, /\[[xX]\]/, `${model}: no choice is recorded`);
  }
  const card = read("skills/housekeeping/reference/card.md");
  assert.ok(card.includes("A failed safety invariant (1-3) makes Fix unavailable"));
  assert.ok(card.includes("and reject that pick."));
  assert.ok(card.includes("| Fix unavailable | Ticket when offered, otherwise Ignore |"));
});
