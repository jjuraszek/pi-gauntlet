import { test } from "node:test";
import assert from "node:assert/strict";
import { renderReport } from "./report.mjs";

const cell = { verdict: "regressed", feedback: "Say X.", facts: { f1: { before: "holds", after: "fails", label: "regression" } } };
const rows = [{ sample: "s1", model: "m1", mechanical: { f2: "holds" }, ...cell }];

test("full report has intent, rows, exit line", () => {
  const r = renderReport({ target: "t", forSha: "abc", change: "CH", rows, partial: null, exit: 1 });
  assert.ok(r.startsWith("# eval report: t\n"));
  assert.ok(r.includes("for: abc"));
  assert.ok(r.includes("## Change\n\nCH"));
  assert.ok(r.includes("## Cells"));
  assert.ok(r.includes("| s1 | m1 | regressed |"));
  assert.ok(r.includes("f1: holds -> fails (regression)"));
  assert.ok(r.includes("f2: holds"));
  assert.ok(r.includes("## Feedback\n\n- s1 / m1: Say X."));
  assert.ok(r.trimEnd().endsWith("exit: 1"));
});
test("partial run is titled", () => {
  const r = renderReport({ target: "t", forSha: "abc", change: "CH", rows, partial: "s1", exit: 0 });
  assert.ok(r.startsWith("# eval report: t (partial run: s1)\n"));
  assert.ok(r.trimEnd().endsWith("exit: 0"));
});
test("report includes every supplied cell and error reason", () => {
  const r = renderReport({ target: "t", forSha: "abc", change: "CH", rows: [
    ...rows,
    { sample: "s1", model: "m2", verdict: "inconclusive", mechanical: { f2: "fails" } },
    { sample: "s2", model: "m1", verdict: "error", error: "Replay timed out." },
  ], partial: null, exit: 1 });
  assert.ok(r.includes("| s1 | m2 | inconclusive | f2: fails |"));
  assert.ok(r.includes("| s2 | m1 | error |  |"));
  assert.ok(r.includes("- s2 / m1: error - Replay timed out."));
  assert.equal(r.split("- s1 / m1: Say X.").length - 1, 1);
});

test("mechanical facts already present in facts appear once", () => {
  const report = renderReport({ target: "t", forSha: "abc", change: "CH", rows: [{ sample: "s", model: "m", mechanical: { f1: "fails", f2: "holds" }, ...cell }], exit: 1 });
  assert.equal(report.split("f1:").length - 1, 1);
  assert.ok(report.includes("f2: holds"));
});
