import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assemble, baseReader, inputSha, parseCase } from "../lib/replay.mjs";
import { parseExpected, runMechanical, sha256 } from "../lib/checks.mjs";
import { MODELS } from "../lib/models.mjs";
import { cellReusable, judgmentCurrent } from "../lib/records.mjs";
import { intentBody } from "../lib/intent.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const targetDir = "eval/housekeeping";

test("pr-card-no-ticket: admit only a clean remote-head PR tree and promise one pushed commit per class", () => {
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

  const target = JSON.parse(read(`${targetDir}/target.json`));
  const sample = "pr-card-no-ticket";
  const { text, bundle, drop } = parseCase(read(`${targetDir}/samples/${sample}/case.md`));
  const selected = { ...target, skillFiles: target.skillFiles.filter(({ path }) => !drop.includes(path)) };
  const expected = read(`${targetDir}/samples/${sample}/expected.md`);
  const { facts } = parseExpected(expected);
  assert.ok(facts.length > 0, "the sample must assert facts");
  const candidate = JSON.parse(read(`${targetDir}/results/${sample}/candidate.json`));
  const baseline = JSON.parse(read(`${targetDir}/results/${sample}/baseline.json`));
  const pinnedSkill = assemble(selected, baseReader(root, candidate.repoSha), bundle);
  const identity = {
    kind: target.kind, assembly: target.assembly, thinking: MODELS.thinking,
    skillSha: sha256(pinnedSkill), inputSha: inputSha(read(`${targetDir}/replay.md`), text, bundle),
  };
  for (const model of MODELS.replay) {
    assert.ok(cellReusable(candidate, model, identity), `${model}: stale or failed candidate`);
    const output = candidate.outputs[model];
    const picks = output.text.split("\n").filter((line) => /^\d+\. \[/.test(line));
    assert.equal(picks.length, 2, `${model}: exactly two card rows`);
    assert.ok(picks.every((line) => /^\d+\. \[ \]/.test(line)), `${model}: unanswered choices keep empty boxes`);
    assert.equal(picks.filter((line) => line.includes("[recommended]")).length, 1, `${model}: label one recommendation without recording a pick`);
    assert.ok(Object.values(runMechanical(facts, output.text)).every((result) => result === "holds"), `${model}: mechanical facts`);
    const judged = candidate.judge[model];
    const pinnedIntent = baseReader(root, candidate.repoSha)(`${targetDir}/intent.md`);
    assert.ok(judgmentCurrent(judged, {
      factsSha: sha256(expected), judgePromptSha: sha256(read("eval/judge.md")),
      intentSha: sha256(intentBody(pinnedIntent)),
      baselineOutputSha: sha256(baseline.outputs[model].text), candidateOutputSha: sha256(output.text),
    }), `${model}: stale judgment`);
    for (const { id } of facts) assert.equal(judged.facts[id]?.after, "holds", `${model}: ${id}`);
    assert.ok(["improved", "unchanged"].includes(judged.verdict), `${model}: ${judged.verdict}`);
  }
});
