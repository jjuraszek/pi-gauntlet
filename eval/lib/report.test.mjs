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
test("unplanned improvement appears in the facts column", () => {
  const report = renderReport({ target: "t", forSha: "abc", change: "CH", rows: [{ sample: "s", model: "m", verdict: "improved", facts: { f1: { before: "fails", after: "holds", label: "unplanned improvement" } } }], exit: 0 });
  assert.ok(report.includes("| s | m | improved |  | f1: fails -> holds (unplanned improvement) |"));
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
  assert.ok(r.includes("| s1 | m2 | inconclusive |  | f2: fails |"));
  assert.ok(r.includes("| s2 | m1 | error |  |  |"));
  assert.ok(r.includes("- s2 / m1: error - Replay timed out."));
  assert.equal(r.split("- s1 / m1: Say X.").length - 1, 1);
});

test("report carries the run wall time and each judgment's wallMs", () => {
  const r = renderReport({ target: "t", forSha: "abc", change: "CH", rows: [{ ...rows[0], wallMs: 1234 }], partial: null, exit: 1, wallMs: 61499 });
  assert.ok(r.includes("for: abc\n\nwall: 61s\n"));
  assert.ok(r.includes("| sample | model | verdict | judge ms | facts |"));
  assert.ok(r.includes("| s1 | m1 | regressed | 1234 | f1: holds -> fails (regression)"));
});

test("mechanical facts already present in facts appear once", () => {
  const report = renderReport({ target: "t", forSha: "abc", change: "CH", rows: [{ sample: "s", model: "m", mechanical: { f1: "fails", f2: "holds" }, ...cell }], exit: 1 });
  assert.equal(report.split("f1:").length - 1, 1);
  assert.ok(report.includes("f2: holds"));
});

for (const { status, exit } of [{ status: "complete", exit: 1 }, { status: "interrupted", exit: 130 }]) {
  test(`${status} refresh report identifies partial coverage and candidate audit`, () => {
    const report = renderReport({ target: "t", forSha: "abc", change: "CH", rows: [
      ...rows,
      { sample: "s1", model: "m2", verdict: "error", error: "Interrupted." },
    ], partial: "s1", exit, wallMs: 2000, refresh: { sample: "s1", models: ["m1", "m2"], status } });
    assert.ok(report.startsWith("# eval report: t (partial run: s1)\n"));
    assert.ok(report.includes(`wall: 2s\n\nrefresh: ${status}; sample: s1; models: m1, m2\naudit: [candidate.json](results/s1/candidate.json)\n\n## Change\n\nCH`));
    assert.ok(report.includes("| sample | model | verdict | judge ms | facts |"));
    assert.ok(report.includes("| s1 | m1 | regressed |"));
    assert.ok(report.includes("| s1 | m2 | error |"));
    assert.ok(report.includes("## Feedback\n\n- s1 / m1: Say X.\n- s1 / m2: error - Interrupted."));
    assert.ok(report.endsWith(`exit: ${exit}\n`));
  });
}

test("omitting refresh preserves ordinary report bytes", () => {
  const options = { target: "t", forSha: "abc", change: "CH", rows, partial: null, exit: 1 };
  const expected = "# eval report: t\n\nfor: abc\n\nwall: 0s\n\n## Change\n\nCH\n\n## Cells\n\n| sample | model | verdict | judge ms | facts |\n|---|---|---|---|---|\n| s1 | m1 | regressed |  | f1: holds -> fails (regression); f2: holds |\n\n## Feedback\n\n- s1 / m1: Say X.\n\nexit: 1\n";
  assert.equal(renderReport(options), expected);
  assert.equal(renderReport({ ...options, refresh: null }), expected);
});
