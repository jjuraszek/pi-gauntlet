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

test("pr-card-no-ticket: admit only a clean remote-head PR tree and promise one pushed commit per class", (t) => {
  const select = read("skills/housekeeping/reference/select.md");
  const prCell = (field) => select.split("\n").find((line) => line.startsWith(`| ${field} |`)).split("|")[4].trim();
  assert.equal(prCell("Precondition"), "Open PR in this repo, draft or ready; session outside its worktree; non-primary worktree clean and equal to the PR's remote head; push dry-run succeeds.");
  assert.equal(prCell("Candidates"), "Files added, modified or renamed against the PR merge-base.");
  assert.equal(prCell("`picks`"), "fix, ignore");
  assert.equal(prCell("`delivery`"), "`commit-push`");
  assert.ok(select.includes("| PR worktree dirty or diverged | Name the dirt or divergent commits; change nothing. |"));
  const fix = read("skills/housekeeping/reference/fix.md");
  assert.ok(fix.includes("| `commit-push` | Use one job in `root`, with Fix-picked classes in card order. | One commit per class. |"));
  assert.ok(fix.includes("For a commit delivery require exactly one class commit after the pre-class HEAD and a clean tree."));
  assert.ok(fix.includes("| `commit-push` | Push the kept commits once to the recorded PR head branch, without force. |"));
  assert.ok(!fix.includes("the job's absolute target tree, expected HEAD"), "dispatch must not reuse the kept-state HEAD after a class commits");
  for (const instruction of [
    "For commit deliveries, pass the pre-class HEAD to the initial fix, the validated class commit's HEAD to review and repair, and the validated amended HEAD to re-review.",
    "Apply [Fix's output and diff checks](#1-fix) after repair too.",
    "For `in-place`, pass the unchanged pre-class HEAD to every helper.",
    "Keep the pre-class state as the admission and undo baseline, separate from these per-helper HEADs.",
    "Save its pre-class state before dispatch; advance expected state only after a kept class.",
    "Keep a class only with `SHIP`, passing required checks and a valid allowed-file diff.",
    "Advance the expected copies and expected HEAD to that kept state; never advance the recorded index for `in-place`.",
    "Reset its worktree to the pre-class commit, preserving earlier kept class commits.",
  ]) assert.ok(fix.includes(instruction), instruction);

  const target = JSON.parse(read(`${targetDir}/target.json`));
  const sample = "pr-card-no-ticket";
  const { text, bundle, drop } = parseCase(read(`${targetDir}/samples/${sample}/case.md`));
  const selected = { ...target, skillFiles: target.skillFiles.filter(({ path }) => !drop.includes(path)) };
  const expected = read(`${targetDir}/samples/${sample}/expected.md`);
  const { facts } = parseExpected(expected);
  assert.ok(facts.length > 0, "the sample must assert facts");
  const candidate = JSON.parse(read(`${targetDir}/results/${sample}/candidate.json`));
  const baseline = JSON.parse(read(`${targetDir}/results/${sample}/baseline.json`));
  // Archived provenance is checked for consistency, not rebuilt from historical Git objects.
  t.diagnostic(`Archived PR replies from ${candidate.repoSha} are stale-to-HEAD evidence, not a current-source replay (saved skillSha ${candidate.skillSha}; current ${sha256(assemble(selected, read, bundle))}).`);
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
    const picks = output.text.split("\n").filter((line) => /^\d+\. \[/.test(line));
    assert.equal(picks.length, 2, `${model}: exactly two card rows`);
    assert.ok(picks.every((line) => /^\d+\. \[ \]/.test(line)), `${model}: unanswered choices keep empty boxes`);
    assert.equal(picks.filter((line) => line.includes("[recommended]")).length, 1, `${model}: label one recommendation without recording a pick`);
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
