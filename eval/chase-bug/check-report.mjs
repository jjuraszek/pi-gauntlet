import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { assemble, baseReader, treeReader, parseCase, inputSha } from "../lib/replay.mjs";
import { parseExpected, runMechanical, sha256, wordCount } from "../lib/checks.mjs";
import { cellReusable, judgmentCurrent, readRecord } from "../lib/records.mjs";
import { intentBody, parseIntent } from "../lib/intent.mjs";
import { MODELS } from "../lib/models.mjs";

const [sample] = process.argv.slice(2);
assert.match(sample ?? "", /^[a-z0-9-]+$/, "name one sample");
const root = fileURLToPath(new URL("../../", import.meta.url));
const read = treeReader(root);
const dir = "eval/chase-bug";
const target = JSON.parse(read(`${dir}/target.json`));
const { bundle, drop, text } = parseCase(read(`${dir}/samples/${sample}/case.md`));
const expected = read(`${dir}/samples/${sample}/expected.md`);
const { facts } = parseExpected(expected);
assert.ok(facts.length > 0, "sample must select facts");
const intent = read(`${dir}/intent.md`);
const forSha = sha256(assemble(target, read));
assert.equal(parseIntent(intent, forSha).status, "ok", "current intent");
const selected = { ...target, skillFiles: target.skillFiles.filter((f) => !drop.includes(f.path)) };
const newPaths = target.skillFiles.filter((f) => f.new).map((f) => f.path);
const input = inputSha(read(`${dir}/replay.md`), text, bundle);
const records = {};
for (const arm of ["baseline", "candidate"]) {
  const reader = arm === "baseline" ? baseReader(root, "78e63174692a261a5864a27b17f8ba3727a388aa") : read;
  const skillSha = sha256(assemble(selected, reader, bundle, { arm, newPaths }));
  const record = readRecord(`${root}${dir}/results`, sample, arm);
  records[arm] = record;
  for (const model of MODELS.replay) {
    assert.ok(cellReusable(record, model, { skillSha, inputSha: input, kind: target.kind, assembly: target.assembly, thinking: MODELS.thinking }), `${arm}/${model}: current successful reply`);
    assert.ok(record.outputs[model].text.trim(), `${arm}/${model}: nonempty`);
    assert.ok(wordCount(record.outputs[model].text) <= target.wordCap, `${arm}/${model}: word cap`);
  }
}
for (const model of MODELS.replay) {
  const before = records.baseline.outputs[model], after = records.candidate.outputs[model];
  const judgment = records.candidate.judge?.[model];
  assert.equal(records.candidate.models.judge, MODELS.judge);
  assert.ok(judgmentCurrent(judgment, {
    factsSha: sha256(expected), judgePromptSha: sha256(read("eval/judge.md")), intentSha: sha256(intentBody(intent)),
    baselineOutputSha: sha256(before.text), candidateOutputSha: sha256(after.text),
  }), `${model}: current judgment`);
  assert.ok(["improved", "unchanged"].includes(judgment.verdict), `${model}: ${judgment.verdict}`);
  for (const fact of facts) assert.equal(judgment.facts[fact.id]?.after, "holds", `${model}/${fact.id}`);
  for (const [id, outcome] of Object.entries(runMechanical(facts, after.text))) assert.equal(outcome, "holds", `${model}/${id}`);
}
console.log(`${sample}: ${MODELS.replay.length} current model pairs, all ${facts.length} candidate facts hold; no model calls`);
