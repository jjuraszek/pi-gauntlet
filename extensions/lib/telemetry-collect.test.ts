import assert from "node:assert/strict";
import { test } from "node:test";
import { COUNTED_USER_PHASES, REVIEWER_AGENTS, countFindings, countOpenGaps, hasReopen, insertedText, planTotals, textOf, usageToTokens } from "./telemetry-collect.ts";

const usage = (input: number, output = 0, cost = 0) => ({ input, output, cacheRead: 0, cacheWrite: 0, totalTokens: input + output, cost: { input: cost, output: 0, cacheRead: 0, cacheWrite: 0, total: cost } });

test("usageToTokens maps pi Usage to snake_case tokens; all-zero -> undefined", () => {
  assert.deepEqual(usageToTokens(usage(10, 5, 0.25)), { input: 10, output: 5, cache_read: 0, cache_write: 0, cost: 0.25 });
  assert.equal(usageToTokens(usage(0)), undefined);
  assert.equal(usageToTokens(undefined), undefined);
  assert.deepEqual(usageToTokens({ input: 1, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 1, cost: 0.5 }), { input: 1, output: 0, cache_read: 0, cache_write: 0, cost: 0.5 });
});

test("countFindings tallies [blocker]/[major]/[minor] tags; none -> undefined", () => {
  assert.deepEqual(countFindings("- [major] x\n- [minor] y\n- [MINOR] z\n[blocker] w"), { blocker: 1, major: 1, minor: 2 });
  assert.equal(countFindings("all good"), undefined);
});

test("countFindings aliases persona tags [Critical]/[Moderate]/[Minor] onto blocker/major/minor", () => {
  const report = "[Critical] F1: a\n[Moderate] F2: b\n[Moderate] F3: c\n[Minor] F4: d\n[Minor] F5: e\n[Minor] F6: f";
  assert.deepEqual(countFindings(report), { blocker: 1, major: 2, minor: 3 });
  assert.deepEqual(countFindings("[Critical] x\n[blocker] y\n[MODERATE] z"), { blocker: 2, major: 1, minor: 0 });
});

test("countOpenGaps returns the latest conformance result's open gap count", () => {
  assert.equal(countOpenGaps("Conformance verdict: CONFORMS"), 0);
  assert.equal(countOpenGaps("Conformance verdict: GAPS\nG1:\n  verdict: MISSING\nG2:\n  verdict: PARTIAL\nG1:\n  evidence: repeated"), 2);
  assert.equal(countOpenGaps("unrelated reviewer text"), undefined);
});

test("planTotals counts tasks by terminal status", () => {
  assert.deepEqual(planTotals([{ status: "complete" }, { status: "skipped" }, { status: "failed" }, { status: "complete" }]), { tasks: 4, complete: 2, failed: 1, skipped: 1 });
});

test("hasReopen detects complete -> in_progress at the same index only", () => {
  assert.equal(hasReopen([{ status: "complete" }, { status: "pending" }], [{ status: "in_progress" }, { status: "pending" }]), true);
  assert.equal(hasReopen([{ status: "complete" }], [{ status: "complete" }]), false);
  assert.equal(hasReopen(undefined, [{ status: "in_progress" }]), false);
  assert.equal(hasReopen([{ status: "pending" }], [{ status: "in_progress" }]), false);
});

test("insertedText joins edit newText values or returns write content", () => {
  assert.equal(insertedText({ path: "x", edits: [{ oldText: "a", newText: "b" }, { oldText: "c", newText: "d" }] }), "b\nd");
  assert.equal(insertedText({ path: "x", content: "body" }), "body");
  assert.equal(insertedText({ path: "x" }), "");
});

test("textOf concatenates text content blocks", () => {
  assert.equal(textOf([{ type: "text", text: "a" }, { type: "image" }, { type: "text", text: "b" }]), "a\n\nb");
  assert.equal(textOf("nope"), "");
});

test("structured findings use only Outputs, including zero counts and repeated Stop summaries", async () => {
  const { countStructuredFindings } = await import("./telemetry-collect.ts");
  const carrier = (value: unknown) => `## Outputs\n### Step 1\n#### Task 1 (wave-reviewer, as review)\n\`\`\`json\n${JSON.stringify({ structured: value })}\n\`\`\`\nOutput saved to: /tmp/review.md`;
  for (const [name, value, expected] of [
    ["counts", { findings: { critical: 1, moderate: 2, minor: 3 } }, { blocker: 1, major: 2, minor: 3 }],
    ["zeros", { findings: { critical: 0, moderate: 0, minor: 0 } }, { blocker: 0, major: 0, minor: 0 }],
    ["absent", {}, undefined],
    ["negative", { findings: { critical: -1, moderate: 2, minor: 3 } }, undefined],
    ["fraction", { findings: { critical: 0.5, moderate: 2, minor: 3 } }, undefined],
    ["missing", { findings: { critical: 1, minor: 3 } }, undefined],
  ] as const) {
    const text = carrier(value);
    assert.deepEqual(countStructuredFindings(`${text}\n## Stop\n${text.replace("## Outputs", "summary")}`), expected, name);
  }
  assert.equal(countStructuredFindings(carrier({ findings: { critical: 1, moderate: 2, minor: 3 } }).replace("## Outputs", "## Other")), undefined);
  assert.equal(countStructuredFindings("## Outputs\n```json\n{invalid}\n```"), undefined);
  assert.deepEqual(countStructuredFindings('## Outputs\n### Step 1\n#### Task 1 (wave-reviewer)\n```json\n{"findings":{"critical":1,"moderate":2,"minor":3}}\n```\nOutput saved to: /tmp/review.md'), { blocker: 1, major: 2, minor: 3 });
  assert.deepEqual(countFindings("spec-reviewer [Critical]\ncode-reviewer [Moderate]"), { blocker: 1, major: 1, minor: 0 });
});

test("constant sets", () => {
  assert.deepEqual([...REVIEWER_AGENTS], ["wave-reviewer", "conformance-reviewer"]);
  assert.deepEqual([...COUNTED_USER_PHASES], ["plan", "implement", "verify", "ship"]);
});
