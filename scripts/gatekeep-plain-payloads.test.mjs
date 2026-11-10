import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const fence = /(?:^|\n)[ \t]*(?:`{3,}|~{3,})/;

test("wording owns unfenced output and coverage keeps its literal checklist", () => {
  const wording = read("skills/gatekeep-pr/SKILL.md").split("## Wording rules\n")[1].split("## Red flags")[0];
  assert.match(wording, /Keep output unfenced/);
  assert.match(wording, /Preserve these exceptions verbatim:.*coverage.*heading and checkbox rows/s);
  const loop = read("skills/gatekeep-pr/reference/post-selection-loop.md");
  const merge = loop.split("### Merge course\n")[1].split("### Re-render")[0];
  assert.doesNotMatch(merge, fence);
  for (const line of ["## AC coverage", "- [ ] <row 1 text verbatim> - covered", "- [ ] <row 3 text verbatim> - deferred per spec to <ref>"]) {
    assert.ok(merge.includes(line), line);
  }
});

test("saved reports, menus and posted payloads have no code fences", () => {
  for (const sample of ["plain-report", "plain-payloads"]) {
    const candidate = JSON.parse(read(`eval/gatekeep-pr/results/${sample}/candidate.json`));
    assert.equal(Object.keys(candidate.outputs).length, 2);
    for (const [model, output] of Object.entries(candidate.outputs)) {
      assert.equal(output.status, "ok", `${sample}: ${model}`);
      assert.doesNotMatch(output.text, fence, `${sample}: ${model}`);
      for (const [id, fact] of Object.entries(candidate.judge[model].facts)) {
        assert.equal(fact.after, "holds", `${sample}: ${model}: ${id}`);
      }
      if (sample === "plain-payloads") {
        assert.equal(Object.keys(candidate.judge[model].facts).length, 5);
        assert.match(output.text, /^## AC coverage$/m);
        for (const line of [
          "- [ ] Export includes a header row. - covered",
          "- [ ] Schedule nightly exports. - deferred per spec to acme/widgets#46",
          "- [ ] Stream large exports. - deviates per spec: buffer CSV in memory",
        ]) assert.ok(output.text.includes(line), `${model}: ${line}`);
      }
    }
  }
});
