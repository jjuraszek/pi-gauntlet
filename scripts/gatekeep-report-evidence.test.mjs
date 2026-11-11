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

test("saved plain-report candidates keep labels, field names, row numbers and counters behind inspection", () => {
  const candidate = JSON.parse(read("eval/gatekeep-pr/results/plain-report/candidate.json"));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, "ok", model);
    const inspection = output.text.match(/\n---\n\n(gauntlet: gate=gatekeep-pr\/initial recommended=1\n\n)([\s\S]*?)(?=^This PR )/m);
    assert.ok(inspection, `${model}: show-evidence checkpoint must precede the repeated report`);
    const evidence = inspection[2];
    assert.match(evidence, /^(?:show evidence:|state:)/, `${model}: show-evidence record`);
    const reports = output.text.replace(inspection[0], `\n---\n\n${inspection[1]}`);
    assert.match(evidence, /\b7001\b/, `${model}: CI run id`);
    assert.match(evidence, /build[^\n]*success/, `${model}: build check`);
    assert.match(evidence, /unit[^\n]*(?:pending|required, running)/, `${model}: required unit check`);
    assert.match(evidence, /\b9c1e4f2\b/, `${model}: head commit id`);
    assert.match(evidence, /\b8a0b1c2\b/, `${model}: prior-review commit id`);
    assert.match(evidence, /repair rounds 1 of 4|repair\.rounds_used: 1\nrepair\.rounds_cap: 4/, `${model}: repair usage`);
    assert.match(evidence, /syncs 1 of 4|repair\.syncs_used: 1\nrepair\.syncs_cap: 4/, `${model}: sync usage`);
    assert.doesNotMatch(reports, /9c1e4f2|8a0b1c2|700[123]|\/tmp\/gatekeep-export\.log|\b(?:MERGEABLE|CLEAN|BLOCKED|APPROVED|REVIEW_REQUIRED)\b/, model);
    assert.doesNotMatch(reports, /\b(?:source|head|course|merge_state_status|bypass_eligible|reviewDecision|exit_code)\s*[:=]/, model);
    assert.doesNotMatch(reports, /binding[- ]pending(?:[- ]check)?\s*(?:count)?\s*[:=]\s*\d/i, model);
    assert.doesNotMatch(reports, /\b(?:Evidence|Role|Prior review|Sync|Verdict|Delivers|Not offered):/i, model);
    assert.doesNotMatch(reports, /\b(?:rounds_used|rounds_cap|syncs_used|syncs_cap|failed-prerequisite|failed_prerequisite|log_path|checked_at)\b/i, model);
    assert.doesNotMatch(reports, /\b(?:requirements?|AC|acceptance (?:criteria|rows?))\s*(?:#|rows?\s*)?\d/i, model);
    assert.doesNotMatch(reports, /\b(?:repair|sync|rounds?|attempts?)\b[^\n.]{0,45}\d+\s*(?:of|\/)\s*\d+/i, model);
    assert.match(output.text, /no (?:new )?commits|no .*commits since|has not changed|no changes since|nothing has been committed since/i, model);
    assert.match(output.text, /show evidence/i, model);
    const facts = candidate.judge[model].facts;
    assert.equal(Object.keys(facts).length, 8);
    for (const [id, fact] of Object.entries(facts)) assert.equal(fact.after, "holds", `${model}: ${id}`);
  }
});
