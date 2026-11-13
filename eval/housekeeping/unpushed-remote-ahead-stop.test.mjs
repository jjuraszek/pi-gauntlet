import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseCase, inputSha } from "../lib/replay.mjs";
import { parseExpected, runMechanical, sha256 } from "../lib/checks.mjs";
import { cellReusable, judgmentCurrent } from "../lib/records.mjs";
import { MODELS } from "../lib/models.mjs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const select = read("../../skills/housekeeping/reference/select.md");

const admission = (field) => select.split("\n").find((line) => line.startsWith(`| ${field} |`))?.split("|").slice(1, -1).map((cell) => cell.trim());

test("AC 10 conformance: unpushed admission selects the full range with Fix/Ignore and amend delivery", () => {
  assert.deepEqual(admission("Field"), ["Field", "directory", "uncommitted", "PR", "unpushed"]);
  const precondition = admission("Precondition")[4];
  for (const pattern of [
    /Primary checkout, default branch checked out/,
    /`git status --porcelain --untracked-files=normal` empty/,
    /fetch `origin <default>`/,
    /require `origin\/<default>` to be an ancestor of HEAD/,
    /`git branch -r --contains HEAD` to print nothing/,
    /no delivery receipt to name HEAD/,
  ]) assert.match(precondition, pattern);
  for (const [field, expected] of [
    ["Candidates", "Files added, modified or renamed across `origin/<default>..HEAD`."],
    ["`root`", "Primary checkout"], ["`rules-from`", "Working tree"],
    ["`picks`", "fix, ignore"], ["`bounds`", "off"], ["`delivery`", "`amend`"], ["`parallel`", "1"],
  ]) assert.equal(admission(field)[4], expected, field);
  assert.match(select, /For an unpushed run, record changed line ranges against `origin\/<default>`/);
  assert.match(select, /Keep `commit` as the last unpushed commit/);
  assert.match(select, /Use one filter for every input's candidate set/);
  assert.match(select, /`git check-ignore --no-index`[\s\S]*Drop deleted paths[\s\S]*rename keep its new path[\s\S]*Exclude symlinks and binary files before the split/);
  assert.match(select, /`git -C <primary> rev-parse --path-format=absolute --git-common-dir`/);
  assert.match(select, /`<common dir>\/gauntlet\/receipts\/`[\s\S]*`delivered:` line naming `squash <HEAD's full SHA>`/);
  assert.match(select, /Treat a missing folder as no receipt; read receipts without writing or removing them/);
});

test("AC 11 conformance: zero ahead is empty; failed fetch, divergence and published commits stop", () => {
  assert.match(admission("Precondition")[4], /With `git rev-list --count origin\/<default>\.\.HEAD` at zero, end as an empty selection\. Otherwise require/);
  assert.match(select, /At zero ahead, return no candidates whether HEAD equals or is behind the fetched ref; apply the ancestor stop only at one or more commits ahead/);
  for (const row of [
    "| Unpushed run: fetch of `origin <default>` failed, or `origin/<default>` does not exist | Carry the fetch error; never treat it as nothing to check. |",
    "| Unpushed run: one or more commits ahead and fetched `origin/<default>` is not an ancestor of HEAD | State the two commits; an amend must not rewrite a commit the remote has moved past. |",
    "| Unpushed run: `git branch -r --contains HEAD` prints a ref | Name the ref; an amend must not rewrite a commit a remote-tracking ref holds. |",
    "| Unpushed run: a delivery receipt names HEAD as its squash | Name the receipt file; a coordinated-finish retry needs that commit reachable from the default branch. |",
  ]) assert.ok(select.includes(row), row);
});

test("AC 11 replay: unpushed-remote-ahead-stop names both commits without a card", () => {
  const sample = "unpushed-remote-ahead-stop";
  const target = JSON.parse(read("target.json"));
  const { text, bundle, drop } = parseCase(read(`samples/${sample}/case.md`));
  assert.equal(bundle.length, 0);
  assert.deepEqual(target.skillFiles.filter(({ path }) => !drop.includes(path)).map(({ path }) => path), [
    "skills/housekeeping/SKILL.md", "skills/housekeeping/reference/select.md",
  ]);
  const expected = read(`samples/${sample}/expected.md`);
  const { facts } = parseExpected(expected);
  assert.ok(facts.length > 0);
  const baseline = JSON.parse(read(`results/${sample}/baseline.json`));
  const candidate = JSON.parse(read(`results/${sample}/candidate.json`));
  for (const [arm, record] of [["baseline", baseline], ["candidate", candidate]]) {
    assert.equal(record.arm, arm);
    assert.equal(record.sample, sample);
    assert.deepEqual(record.models, MODELS);
    assert.match(record.repoSha, /^[a-f0-9]{40}$/);
    assert.match(record.skillSha, /^[a-f0-9]{64}$/);
    assert.deepEqual(Object.keys(record.outputs).sort(), [...MODELS.replay].sort());
    for (const model of MODELS.replay) assert.ok(cellReusable(record, model, {
      kind: target.kind, assembly: target.assembly, thinking: MODELS.thinking,
      inputSha: inputSha(read("replay.md"), text, bundle), skillSha: record.skillSha,
    }), `${arm}: successful reply with retained provenance`);
  }
  assert.deepEqual(Object.keys(candidate.judge).sort(), [...MODELS.replay].sort());
  for (const model of MODELS.replay) {
    const output = candidate.outputs[model].text;
    assert.ok(Object.values(runMechanical(facts, output)).every((result) => result === "holds"));
    assert.doesNotMatch(output, /^\d+\. \[[ x]\]/m);
    const judged = candidate.judge[model];
    assert.match(judged.intentSha, /^[a-f0-9]{64}$/);
    assert.ok(judgmentCurrent(judged, {
      factsSha: sha256(expected), judgePromptSha: sha256(read("../judge.md")), intentSha: judged.intentSha,
      baselineOutputSha: sha256(baseline.outputs[model].text), candidateOutputSha: sha256(output),
    }));
    for (const { id } of facts) assert.equal(judged.facts[id]?.after, "holds", `${model}: ${id}`);
    assert.ok(["improved", "unchanged"].includes(judged.verdict));
  }
});

test("AC 9 conformance: observe no-argument status once and report local ahead commits without fetching", () => {
  assert.match(select, /With no argument, resolve the primary checkout and actual default branch first/);
  assert.match(select, /test the shared primary\/default-branch precondition before picking an input/);
  assert.match(select, /Run the status observation once/);
  for (const row of [
    "| None, and `git -C <primary> status --porcelain --untracked-files=normal` prints at least one line | uncommitted |",
    "| None, and that command prints nothing | unpushed |",
    "| No-argument run: the status observation exits nonzero | Carry its error; pick neither input. |",
    "| Directory or no-argument run outside the primary or off the default branch | Name the PR input in one line: use `/skill:housekeeping <PR>`. |",
  ]) assert.ok(select.includes(row), row);
  assert.match(select, /Untracked files count; ignored files do not/);
  assert.match(select, /Keep the chosen input even when Selection skips every uncommitted path/);
  assert.match(select, /never re-resolve it/);
  assert.match(select, /For an uncommitted run, count `git rev-list --count origin\/<default>\.\.HEAD` against the local ref without fetching/);
  assert.match(select, /With a positive count, add `<n> commits ahead of the local origin\/<default> ref \(not fetched\) - not checked while the checkout has uncommitted files` to `not-checked`/);
  assert.match(select, /With no local ref or a zero count, add nothing/);
  assert.match(select, /not a current reading of the remote/);
  const spine = read("../../skills/housekeeping/SKILL.md");
  assert.match(spine, /files and commits not checked or not reviewed with reasons/);
  assert.match(spine, /For an empty selection, list only not-checked items from the run record/);
});
