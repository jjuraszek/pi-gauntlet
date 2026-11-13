import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("AC 5 conformance: apply source path skips before searching title blocks for fully superseded banners", () => {
  const check = read("skills/housekeeping/reference/check.md");
  assert.match(check, /For `spec-superseded`, apply path skips from the `rules-from` sources before searching `specs`\./,
    "Check must apply source path skips before the spec banner search so skipped specs reach no card");
  assert.ok(check.includes('^> \\*\\*Superseded by:\\*\\* \\[.*\\]\\(.*\\) - fully$'));
  assert.match(check, /between the H1 and the first `## ` heading or code fence/);
  assert.match(check, /Record each hit as one `line` finding quoting the banner/);
});

test("AC 7 conformance: specs-only selections continue to Check instead of ending empty", () => {
  const select = read("skills/housekeeping/reference/select.md");
  const skill = read("skills/housekeeping/SKILL.md");
  assert.match(select, /With both `files` and `specs` empty, skip Check, Decide and Fix and go to Report\./,
    "Selection must require both lists to be empty before skipping Check");
  assert.match(select, /With non-empty `specs` and empty `files`, go to Check\./,
    "A specs-only selection must reach its banner check");
  assert.doesNotMatch(select, /An empty `files` list skips Check/,
    "The old files-only shortcut must not remain");
  assert.match(skill, /Go directly to Report only with both `files` and `specs` empty\./,
    "The spine's shortcut must agree with Selection");
  assert.match(skill, /\| Both `files` and `specs` empty \| `gauntlet: done empty`/,
    "Report must distinguish empty from a specs-only selection with no findings");
  assert.match(skill, /With no surviving findings, go to Report\./,
    "A specs-only selection without a hit still reaches the clean report");
});
