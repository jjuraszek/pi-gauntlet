import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseCase, inputSha } from "../lib/replay.mjs";
import { parseExpected, runMechanical, sha256 } from "../lib/checks.mjs";
import { cellReusable, judgmentCurrent } from "../lib/records.mjs";
import { MODELS } from "../lib/models.mjs";

const read = (path) => readFileSync(new URL(`../../skills/housekeeping/${path}`, import.meta.url), "utf8");
const select = read("reference/select.md");
const check = read("reference/check.md");
const selection = select.split("## Selection\n")[1]?.split("\n## ")[0] ?? "";
const local = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("AC 1 conformance: split spec candidates from files and exclude content rules", () => {
  assert.match(selection, /spec dir[^\n]*`specs`/i,
    "Selection must put a spec-dir candidate in specs rather than the ordinary files list");
  assert.match(selection, /(?:never in|out of|exclude[^\n]*from) `files`/i,
    "Spec candidates must not remain in files");
  assert.match(check, /`files` against every compiled row except `spec-superseded`/,
    "Content checks must operate on files, not specs");
  assert.match(check, /`specs` against that row alone/,
    "Specs must receive only the spec-superseded check");
  assert.ok(read("reference/base-rules.md").includes("| spec-superseded | Specs | Remove a spec whose title block carries a fully-superseded banner. |"),
    "The spec-only route must name a defined base rule");
  assert.match(check, /no repo or overrides rule compiles against the Specs kind/i,
    "Repo and overrides content rules must not compile for specs");
  assert.match(check, /helpers receive no `specs` path/i,
    "Content-check helpers must not receive spec candidates");
  assert.match(selection, /contiguous run[\s\S]*services\/x\/doc\/specs\/a\.md/,
    "The spec-dir split must use component membership, including nested paths");
  assert.match(selection, /sorted, outside `budget`/,
    "Specs must not consume the content-file budget");
  assert.match(select, /copies of every `files` and `specs` file with its mode/,
    "Expected state must protect spec contents and modes too");
  assert.match(check, /For a content command[\s\S]*documented scoped form[\s\S]*leaves out the spec and plan dirs/,
    "Content commands must exclude spec and plan dirs, not just read helpers");
  assert.match(check, /no documented form excludes the spec and plan folders/,
    "An unscopable content command must be listed as not run");
  assert.match(check, /Drop at validation any finding of a row other than `spec-superseded` whose item sits in a spec or plan dir/,
    "Validation must reject content findings that escape the selection fence");
});

test("AC 4 conformance: one Delete/Keep card overrides every run's picks", () => {
  const card = read("reference/card.md");
  assert.match(card, /Group findings by check id into issue classes, one card per class/);
  assert.match(card, /For `spec-superseded`, replace the picks in every run with exactly these two rows/);
  assert.match(card, /1\. \[ \] Delete - remove the listed specs; <delivery from the table below>\n2\. \[ \] Keep - leave them in the spec folder/);
  assert.match(card, /Record Delete as `fix` and Keep as `ignore`/);
  assert.match(card, /For `spec-superseded`, keep Delete available without evaluating hotfix predicates/);
  assert.match(card, /Fix \(Delete on the spec card\) number followed by text/);
  assert.match(card, /\| `amend` \| Make one commit for this class on the default branch in the primary checkout, fold the kept fixes into the last unpushed commit after the last class, and push nothing\. \|/);
  assert.ok(check.includes('^> \\*\\*Superseded by:\\*\\* \\[.*\\]\\(.*\\) - fully$'));
  assert.match(check, /between the H1 and the first `## ` heading or code fence/);
  assert.match(check, /Record each hit as one `line` finding quoting the banner/);
});

for (const [sample, recommended] of [["spec-card-delete-keep", 1], ["spec-card-named-keep", 2]]) {
  test(`AC 4 replay: ${sample} has only Delete and Keep`, () => {
    const target = JSON.parse(local("target.json"));
    const { text, bundle } = parseCase(local(`samples/${sample}/case.md`));
    const expected = local(`samples/${sample}/expected.md`);
    const { facts } = parseExpected(expected);
    assert.ok(facts.length > 0);
    const baseline = JSON.parse(local(`results/${sample}/baseline.json`));
    const candidate = JSON.parse(local(`results/${sample}/candidate.json`));
    const models = candidate.models;
    assert.deepEqual(models, MODELS);
    assert.deepEqual(baseline.models, models);
    assert.ok(models.replay.length > 0);
    assert.deepEqual(Object.keys(candidate.judge).sort(), [...models.replay].sort());
    for (const record of [baseline, candidate]) {
      assert.equal(record.sample, sample);
      assert.match(record.repoSha, /^[a-f0-9]{40}$/);
      assert.match(record.skillSha, /^[a-f0-9]{64}$/);
      assert.deepEqual(Object.keys(record.outputs).sort(), [...models.replay].sort());
      for (const model of models.replay) {
        assert.ok(cellReusable(record, model, {
          kind: target.kind, assembly: target.assembly, thinking: models.thinking,
          inputSha: inputSha(local("replay.md"), text, bundle), skillSha: record.skillSha,
        }), `${sample}: successful ${record.arm} with retained provenance`);
      }
    }
    assert.equal(baseline.arm, "baseline");
    assert.equal(candidate.arm, "candidate");
    for (const model of models.replay) {
      const output = candidate.outputs[model].text;
      const picks = output.split("\n").filter((line) => /^\d+\. \[/.test(line));
      assert.equal(picks.length, 2);
      for (const [index, label] of ["Delete", "Keep"].entries()) {
        assert.match(picks[index], new RegExp(`^${index + 1}\\. \\[ \\] ${label}\\b`));
        assert.equal(picks[index].includes("[recommended]"), index + 1 === recommended);
      }
      assert.ok(Object.values(runMechanical(facts, output)).every((value) => value === "holds"));
      const judged = candidate.judge[model];
      assert.match(judged.intentSha, /^[a-f0-9]{64}$/);
      assert.ok(judgmentCurrent(judged, {
        factsSha: sha256(expected), judgePromptSha: sha256(local("../judge.md")),
        intentSha: judged.intentSha,
        baselineOutputSha: sha256(baseline.outputs[model].text), candidateOutputSha: sha256(output),
      }));
      for (const { id } of facts) assert.equal(judged.facts[id]?.after, "holds", `${sample}: ${id}`);
      assert.ok(["improved", "unchanged"].includes(judged.verdict));
    }
  });
}

test("AC 2 conformance: skip plan-dir candidates before populating either list", () => {
  assert.match(selection, /(?:candidate in a plan dir is skipped|(?:Skip|Drop) (?:every |each )?(?:candidate|path)[^\n.]*plan dir)/i,
    "Selection must skip plan-dir candidates, leaving them in neither files nor specs");
});

test("AC 3 conformance: a harness without gauntlet_setting uses the four default dirs", () => {
  const fallback = selection.split("\n").find((line) => /(?:without|no|unavailable|absent|missing)[^\n]*(?:tool|gauntlet_setting)/i.test(line));
  assert.ok(fallback, "Selection must define a fallback for a harness without the settings tool");
  for (const dir of ["doc/specs", "docs/specs", "doc/plans", "docs/plans"]) {
    assert.ok(fallback.includes(`\`${dir}\``), `The no-tool fallback must include ${dir}`);
  }
});
