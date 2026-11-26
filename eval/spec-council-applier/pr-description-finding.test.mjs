import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { assemble, inputSha, parseCase, readTree } from "../lib/replay.mjs";
import { parseExpected, sha256 } from "../lib/checks.mjs";
import { intentBody } from "../lib/intent.mjs";
import { lintTarget } from "../lib/lint.mjs";
import { cellReusable, judgmentCurrent } from "../lib/records.mjs";
import { MODELS } from "../lib/models.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const dir = "eval/spec-council-applier";
const sample = "pr-description-finding";

// Model replays are run separately; this check reuses the saved fixture edits and judgments.
test("council edits restore ticket rows to their sections without adding deployment requirements", () => {
  const persona = read("agents/spec-council-applier.md");
  assert.match(persona, /AC definition:/);
  assert.equal(read(`${dir}/samples/${sample}/fixture/reference/ac-classes.md`), read("skills/shape-ticket/reference/ac-classes.md"));
  assert.match(persona, /clusters that assert data shape, ordering, or semantics/);
  assert.match(persona, /only for integrity \(wishful, tautological, unspecified-but-binding, or external-input dependency\)\./);

  const target = JSON.parse(read(`${dir}/target.json`));
  const { text, bundle } = parseCase(read(`${dir}/samples/${sample}/case.md`));
  assert.deepEqual(lintTarget(resolve(root, dir)), []);
  const fixture = resolve(root, dir, "samples", sample, "fixture");
  const before = readTree(fixture);
  const expected = read(`${dir}/samples/${sample}/expected.md`);
  const { facts } = parseExpected(expected);
  const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline.json`));
  const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
  assert.deepEqual(baseline.models, MODELS);
  assert.deepEqual(candidate.models, MODELS);
  assert.deepEqual(Object.keys(candidate.judge).sort(), [...MODELS.replay].sort());
  const identity = {
    kind: target.kind, assembly: target.assembly ?? "n/a", thinking: MODELS.thinking,
    inputSha: inputSha(read(`${dir}/replay.md`), text, bundle, fixture),
    skillSha: sha256(assemble(target, read, bundle)),
  };
  for (const model of MODELS.replay) {
    const judged = candidate.judge[model];
    assert.ok(cellReusable(baseline, model, { ...identity, skillSha: baseline.skillSha }), `${model}: stale or failed baseline`);
    assert.ok(cellReusable(candidate, model, identity), `${model}: stale or failed candidate`);
    assert.ok(judgmentCurrent(judged, {
      factsSha: sha256(expected), judgePromptSha: sha256(read("eval/judge.md")),
      intentSha: sha256(intentBody(read(`${dir}/intent.md`))),
      baselineOutputSha: sha256(baseline.outputs[model].text),
      candidateOutputSha: sha256(candidate.outputs[model].text),
    }), `${model}: stale judgment`);
    const tree = candidate.outputs[model].tree;
    assert.deepEqual(Object.keys(tree).sort(), Object.keys(before).sort(), `${model}: fixture paths`);
    for (const [path, content] of Object.entries(before)) {
      if (!["doc/specs/job-status.md", "council-audit.md"].includes(path)) {
        assert.deepEqual(tree[path], content, `${model}: changed input ${path}`);
      }
    }
    const spec = tree["doc/specs/job-status.md"].content;
    assert.equal(spec.match(/^\*\*Amend-grant:\*\*.*$/m)?.[0], before["doc/specs/job-status.md"].content.match(/^\*\*Amend-grant:\*\*.*$/m)?.[0]);
    const criteria = spec.match(/^## Acceptance criteria\n([\s\S]*?)(?=^## |(?![\s\S]))/m)?.[1];
    assert.deepEqual(criteria.match(/^- \[ \] .+$/gm)?.sort(), [
      "- [ ] the importer rejects a row without an id", "- [ ] the status report lists the rejected row's line number",
    ]);
    assert.match(criteria, /^- \[ \] the status report lists the rejected row's line number\n +in-scope$/m);
    const entries = spec.match(/^## Integration\n([\s\S]*?)(?=^## |(?![\s\S]))/m)?.[1];
    assert.match(entries, /^- the cutover steps are posted as a comment on the ticket\n +ticket row, not an acceptance criterion: tracker update$/m);
    assert.match(entries, /^- Before merging, a repository admin creates the DEPLOY_TOKEN secret\.$/m);
    assert.doesNotMatch(entries, /the status report lists the rejected row's line number/);
    for (const { id } of facts) assert.equal(judged.facts[id]?.after, "holds", `${model}: ${id}`);
    assert.ok(["improved", "unchanged"].includes(judged.verdict), `${model}: ${judged.verdict}`);
  }
});
