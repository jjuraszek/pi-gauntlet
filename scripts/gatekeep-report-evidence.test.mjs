import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const report = read("skills/gatekeep-pr/reference/report.md");

test("reports reserve raw evidence and prior-review hashes for show evidence", () => {
  const prose = report.split("## Standing")[0];
  assert.doesNotMatch(prose, /name its short SHA|retain its short SHA|posted at that SHA/);
  assert.match(report, /prior-review and sync SHAs.*show evidence/);
  const inspection = report.split("Under `show evidence`")[1];
  for (const field of ["state:", "course", "immutable target", "scope baseline", "usage and caps", "checkpoints", "failed-prerequisite", "conclusion, SHA and run URL", "exit_code", "log_path", "claim dispositions", "AC outcomes", "check dispositions"]) {
    assert.ok(inspection.includes(field), field);
  }
  assert.match(inspection, /prior-review.*sync.*SHA/s);
});

test("plain-report snapshots omit raw evidence from action, final and obstacle prose", () => {
  const candidate = JSON.parse(read("eval/gatekeep-pr/results/plain-report/candidate.json"));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, "ok", model);
    assert.doesNotMatch(output.text, /9c1e4f2|8a0b1c2|700[123]|\/tmp\/gatekeep-export\.log|\b(?:MERGEABLE|CLEAN|BLOCKED|APPROVED|REVIEW_REQUIRED)\b/, model);
    assert.doesNotMatch(output.text, /\b(?:source|head|course|merge_state_status|bypass_eligible|reviewDecision|exit_code)\s*[:=]/, model);
    assert.doesNotMatch(output.text, /binding[- ]pending(?:[- ]check)?\s*(?:count)?\s*[:=]\s*\d/i, model);
    assert.match(output.text, /no (?:new )?commits|no .*commits since|has not changed|no changes since/i, model);
    assert.match(output.text, /show evidence/i, model);
    const facts = candidate.judge[model].facts;
    assert.equal(Object.keys(facts).length, 8);
    for (const [id, fact] of Object.entries(facts)) assert.equal(fact.after, "holds", `${model}: ${id}`);
  }
});
