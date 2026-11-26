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
