import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import registerPlanTracker, { validateSnapshot } from "./plan-tracker.ts";

type ToolResult = {
  content: { type: string; text: string }[];
  details: { action: string; tasks: { name: string; status: string; label?: string }[]; error?: string };
};

function harness(branch: unknown[] = [], cwd = process.cwd()) {
  const tools: {
    name: string;
    description: string;
    executionMode?: string;
    parameters: any;
    execute: (...args: any[]) => unknown;
    renderResult: (result: unknown, options: unknown, theme: unknown) => { text?: string };
  }[] = [];
  const handlers: { event: string; handler: (event: unknown, ctx: unknown) => Promise<void> }[] = [];
  const pi = {
    on(event: string, handler: (event: unknown, ctx: unknown) => Promise<void>) {
      handlers.push({ event, handler });
    },
    registerTool(tool: any) {
      tools.push(tool);
    },
  };
  registerPlanTracker(pi as any);
  let widgetText: string | undefined;
  const theme = { fg: (_c: string, s: string) => s, bold: (s: string) => s };
  const ctx = {
    cwd,
    hasUI: true,
    ui: {
      setWidget(_id: string, cb?: (tui: unknown, theme: unknown) => { text: string }) {
        widgetText = cb ? cb(undefined, theme).text : undefined;
      },
    },
    sessionManager: { getBranch: () => branch },
  };
  const call = async (params: Record<string, unknown>): Promise<ToolResult> =>
    (await tools[0].execute("id", params, undefined, undefined, ctx)) as ToolResult;
  const fire = async (event: string) => {
    for (const h of handlers) if (h.event === event) await h.handler({}, ctx);
  };
  return {
    call,
    fire,
    tool: () => tools[0],
    theme,
    widget: () => widgetText,
    parameters: () => tools[0].parameters,
    description: () => tools[0].description,
    executionMode: () => tools[0].executionMode,
  };
}

test("add appends pending tasks and preserves existing statuses", async () => {
  const { call } = harness();
  await call({ action: "init", tasks: ["a", "b", "c"] });
  await call({ action: "update", index: 0, status: "complete" });
  const res = await call({ action: "add", tasks: ["d", "e"] });
  assert.equal(res.details.error, undefined);
  assert.equal(res.details.action, "add");
  assert.deepEqual(
    res.details.tasks.map((t) => [t.name, t.status]),
    [["a", "complete"], ["b", "pending"], ["c", "pending"], ["d", "pending"], ["e", "pending"]],
  );
});

test("add with no active plan creates one", async () => {
  const { call } = harness();
  const res = await call({ action: "add", tasks: ["g1"] });
  assert.equal(res.details.error, undefined);
  assert.deepEqual(res.details.tasks, [{ name: "g1", status: "pending" }]);
});

test("add result carries the FULL merged list (reconstruction invariant)", async () => {
  const { call } = harness();
  await call({ action: "init", tasks: ["a"] });
  await call({ action: "update", index: 0, status: "in_progress" });
  const res = await call({ action: "add", tasks: ["b"] });
  // reconstructState rebuilds wholesale from the latest details.tasks:
  // the add result alone must reproduce the whole plan.
  assert.deepEqual(res.details.tasks, [
    { name: "a", status: "in_progress" },
    { name: "b", status: "pending" },
  ]);
});

test("add with empty/missing tasks errors and preserves state", async () => {
  const { call } = harness();
  await call({ action: "init", tasks: ["a"] });
  const res = await call({ action: "add", tasks: [] });
  assert.equal(res.details.error, "tasks required");
  assert.deepEqual(res.details.tasks, [{ name: "a", status: "pending" }]);
  const res2 = await call({ action: "add" });
  assert.equal(res2.details.error, "tasks required");
});

test("update to failed round-trips and is excluded from complete count", async () => {
  const { call } = harness();
  await call({ action: "init", tasks: ["a", "b", "c"] });
  await call({ action: "update", index: 0, status: "complete" });
  const res = await call({ action: "update", index: 1, status: "failed" });
  assert.equal(res.details.error, undefined);
  assert.deepEqual(
    res.details.tasks.map((t) => [t.name, t.status]),
    [["a", "complete"], ["b", "failed"], ["c", "pending"]],
  );
  assert.match(res.content[0].text, /1\/3 done/);
  assert.match(res.content[0].text, /1 failed/);
});

test("reconstruction preserves failed status from serialized details", async () => {
  const branch = [
    {
      type: "message",
      message: {
        role: "toolResult",
        toolName: "plan_tracker",
        details: {
          action: "update",
          tasks: [
            { name: "a", status: "complete" },
            { name: "b", status: "failed" },
          ],
        },
      },
    },
  ];
  const { call, fire } = harness(branch);
  await fire("session_start");
  const res = await call({ action: "status" });
  assert.deepEqual(
    res.details.tasks.map((t) => [t.name, t.status]),
    [["a", "complete"], ["b", "failed"]],
  );
  assert.match(res.content[0].text, /\u2717 \[1\] b/);
});

test("widget renders failed as \u2717, keeps failed out of complete count and current", async () => {
  const { call, widget } = harness();
  await call({ action: "init", tasks: ["a", "b"] });
  await call({ action: "update", index: 0, status: "failed" });
  const w = widget();
  assert.ok(w);
  assert.match(w!, /\u2717/);
  assert.match(w!, /\(0\/2\)/);
  assert.match(w!, /b$/); // current = first pending, never the failed task
});

test("renderResult status path shows \u2717 for failed and excludes it from complete", async () => {
  const { call, tool, theme } = harness();
  await call({ action: "init", tasks: ["a", "b"] });
  await call({ action: "update", index: 0, status: "failed" });
  const res = await call({ action: "status" });
  const rendered = tool().renderResult(res as any, {}, theme as any);
  const text = (rendered as any).text as string;
  assert.match(text, /0\/2 done/);
  assert.match(text, /\u2717/);
});

test("renderResult status header appends failed count when a task has failed", async () => {
  const { call, tool, theme } = harness();
  await call({ action: "init", tasks: ["a", "b", "c"] });
  await call({ action: "update", index: 0, status: "complete" });
  await call({ action: "update", index: 1, status: "failed" });
  const res = await call({ action: "status" });
  const rendered = tool().renderResult(res as any, {}, theme as any);
  const text = (rendered as any).text as string;
  assert.match(text, /1\/3 done, 1 failed/);
});

test("renderResult status header omits failed count when no task has failed", async () => {
  const { call, tool, theme } = harness();
  await call({ action: "init", tasks: ["a", "b"] });
  await call({ action: "update", index: 0, status: "complete" });
  const res = await call({ action: "status" });
  const rendered = tool().renderResult(res as any, {}, theme as any);
  const text = (rendered as any).text as string;
  assert.match(text, /^1\/2 done\n/);
  assert.doesNotMatch(text, /failed/);
});

test("renderResult update case appends failed count when a task has failed", async () => {
  const { call, tool, theme } = harness();
  await call({ action: "init", tasks: ["a", "b", "c"] });
  await call({ action: "update", index: 0, status: "complete" });
  const res = await call({ action: "update", index: 1, status: "failed" });
  const rendered = tool().renderResult(res as any, {}, theme as any);
  const text = (rendered as any).text as string;
  assert.match(text, /^\u2713 Updated \(1\/3 done, 1 failed\)$/);
});

test("renderResult update case omits failed count when no task has failed", async () => {
  const { call, tool, theme } = harness();
  await call({ action: "init", tasks: ["a", "b"] });
  const res = await call({ action: "update", index: 0, status: "complete" });
  const rendered = tool().renderResult(res as any, {}, theme as any);
  const text = (rendered as any).text as string;
  assert.match(text, /^\u2713 Updated \(1\/2 done\)$/);
  assert.doesNotMatch(text, /failed/);
});

const S = (code: string) =>
  [...code].map((c, i) => ({
    name: `t${i}`,
    status: ({ o: "pending", ">": "in_progress", k: "complete", x: "failed", "/": "skipped" } as const)[c as "o" | ">" | "k" | "x" | "/"],
  }));

test("validateSnapshot: pending must trail every non-pending task", () => {
  for (const code of ["kkkoo", "kk>>oo", "kk>kk", "x>o", "ooo", "///", "", "k"]) {
    assert.deepEqual(validateSnapshot(S(code)), [], code);
  }
  assert.deepEqual(validateSnapshot(S("okoo")), [0]);
  assert.deepEqual(validateSnapshot(S("kkk>ookkkk")), [4, 5]);
  assert.deepEqual(validateSnapshot(S("o>")), [0]);
  assert.deepEqual(validateSnapshot(S("ook")), [0, 1]);
});

test("update past a pending index is rejected with every offender, fixes, and the current snapshot", async () => {
  const { call } = harness();
  await call({ action: "init", tasks: ["gather", "resolve evidence", "claim-check", "provision worktree", "review", "verify claims"] });
  for (const i of [0, 1, 2]) await call({ action: "update", index: i, status: "complete" });
  const res = await call({ action: "update", index: 5, status: "complete" });
  assert.equal(res.details.error, "pending-suffix violation: 3,4");
  assert.deepEqual(
    res.details.tasks.map((t) => t.status),
    ["complete", "complete", "complete", "pending", "pending", "pending"],
  );
  const text = res.content[0].text;
  assert.equal(
    text,
    [
      'Error: cannot set task 5 "verify claims" to complete: pending tasks precede it: 3 "provision worktree", 4 "review".',
      "Rule: pending tasks must trail every started or finished task.",
      "Fix first, then retry: update each listed task to in_progress (working on it now), complete, failed, or skipped (not applicable in this run); or, if the list order itself is wrong, re-init with {name, status}[] keeping every task and its true status so the untouched ones trail.",
      "Never clear, drop tasks, or record a status the work has not actually reached.",
      "Current: 0 gather=complete, 1 resolve evidence=complete, 2 claim-check=complete, 3 provision worktree=pending, 4 review=pending, 5 verify claims=pending",
    ].join("\n"),
  );
  const after = await call({ action: "status" });
  assert.deepEqual(after.details.tasks.map((t) => t.status), ["complete", "complete", "complete", "pending", "pending", "pending"]);
});

test("update -> pending is rejected in execute and names reopen and re-init", async () => {
  const { call } = harness();
  await call({ action: "init", tasks: ["a", "b", "claim-check"] });
  for (const i of [0, 1, 2]) await call({ action: "update", index: i, status: "complete" });
  const res = await call({ action: "update", index: 2, status: "pending" });
  assert.equal(res.details.error, "update cannot set pending");
  assert.deepEqual(res.details.tasks.map((t) => t.status), ["complete", "complete", "complete"]);
  assert.equal(
    res.content[0].text,
    [
      'Error: cannot set task 2 "claim-check" to pending: update never sets pending; a task is pending only from init/add.',
      "To redo it, update it to in_progress. To recreate the whole list, re-init with {name, status}[].",
      "Current: 0 a=complete, 1 b=complete, 2 claim-check=complete",
    ].join("\n"),
  );
});

test("update at index 0 / first pending index, direct jumps, and reopens are accepted", async () => {
  const { call } = harness();
  await call({ action: "init", tasks: ["a", "b", "c", "d"] });
  assert.equal((await call({ action: "update", index: 0, status: "complete" })).details.error, undefined);
  assert.equal((await call({ action: "update", index: 1, status: "failed" })).details.error, undefined);
  assert.equal((await call({ action: "update", index: 2, status: "skipped" })).details.error, undefined);
  assert.equal((await call({ action: "update", index: 0, status: "in_progress" })).details.error, undefined);
  assert.equal((await call({ action: "update", index: 1, status: "in_progress" })).details.error, undefined);
  const res = await call({ action: "status" });
  assert.deepEqual(res.details.tasks.map((t) => t.status), ["in_progress", "in_progress", "skipped", "pending"]);
});

test("wave fan-out: in_progress in increasing order succeeds, out of order is rejected naming earlier pending indices", async () => {
  const ok = harness();
  await ok.call({ action: "init", tasks: ["a", "b", "c"] });
  for (const i of [0, 1, 2]) assert.equal((await ok.call({ action: "update", index: i, status: "in_progress" })).details.error, undefined);
  const bad = harness();
  await bad.call({ action: "init", tasks: ["a", "b", "c"] });
  const res = await bad.call({ action: "update", index: 2, status: "in_progress" });
  assert.equal(res.details.error, "pending-suffix violation: 0,1");
  assert.match(res.content[0].text, /pending tasks precede it: 0 "a", 1 "b"\./);
});

test("init: strings, objects, and mixed forms normalize; ordering violation rejects the whole list", async () => {
  const { call } = harness();
  const strings = await call({ action: "init", tasks: ["a", "b"] });
  assert.deepEqual(strings.details.tasks, [{ name: "a", status: "pending" }, { name: "b", status: "pending" }]);
  const objects = await call({ action: "init", tasks: [{ name: "a", status: "complete" }, { name: "b", status: "skipped" }, "c"] });
  assert.equal(objects.details.error, undefined);
  assert.deepEqual(objects.details.tasks, [
    { name: "a", status: "complete" },
    { name: "b", status: "skipped" },
    { name: "c", status: "pending" },
  ]);
  const bad = await call({ action: "init", tasks: [{ name: "a", status: "complete" }, "b", { name: "c", status: "complete" }] });
  assert.equal(bad.details.error, "pending-suffix violation: 1");
  assert.equal(
    bad.content[0].text,
    [
      'Error: cannot init: pending tasks precede started or finished ones: 1 "b".',
      "Rule: pending tasks must trail every started or finished task.",
      "Reorder the list or restate those statuses truthfully, then retry.",
      "Proposed: 0 a=complete, 1 b=pending, 2 c=complete",
    ].join("\n"),
  );
  assert.doesNotMatch(bad.content[0].text, /Current:/);
  assert.deepEqual(bad.details.tasks.map((t) => t.status), ["complete", "skipped", "pending"]);
});

test("init ordering violation with no prior plan leaves no plan", async () => {
  const { call, widget } = harness();
  const bad = await call({ action: "init", tasks: ["a", { name: "b", status: "complete" }] });
  assert.equal(bad.details.error, "pending-suffix violation: 0");
  assert.deepEqual(bad.details.tasks, []);
  assert.equal(widget(), undefined);
});

test("skipped round-trips, replays, renders \u2298, counts as done, and is never current", async () => {
  const { call, widget, tool, theme } = harness();
  await call({ action: "init", tasks: ["a", "b", "c"] });
  await call({ action: "update", index: 0, status: "complete" });
  const res = await call({ action: "update", index: 1, status: "skipped" });
  assert.equal(res.details.error, undefined);
  assert.match(res.content[0].text, /Plan: 2\/3 done \(1 pending, 1 skipped\)/);
  assert.match(res.content[0].text, /\u2298 \[1\] b/);
  const w = widget()!;
  assert.match(w, /\u2298/);
  assert.match(w, /\(2\/3\)/);
  assert.match(w, /c$/);
  const rendered = (tool().renderResult(res as any, {}, theme as any) as any).text as string;
  assert.match(rendered, /^\u2713 Updated \(2\/3 done, 1 skipped\)$/);
  const status = await call({ action: "status" });
  const statusText = (tool().renderResult(status as any, {}, theme as any) as any).text as string;
  assert.match(statusText, /^2\/3 done, 1 skipped\n/);

  const replay = harness([{ type: "message", message: { role: "toolResult", toolName: "plan_tracker", details: res.details } }]);
  await replay.fire("session_start");
  const after = await replay.call({ action: "status" });
  assert.deepEqual(after.details.tasks.map((t) => t.status), ["complete", "skipped", "pending"]);
});

test("all tasks skipped renders (M/M)", async () => {
  const { call, widget } = harness();
  await call({ action: "init", tasks: ["a", "b"] });
  await call({ action: "update", index: 0, status: "skipped" });
  await call({ action: "update", index: 1, status: "skipped" });
  assert.match(widget()!, /\(2\/2\)/);
});

test("legacy-invalid snapshot: first update is rejected listing legacy offenders; truthful object-form re-init repairs it", async () => {
  const branch = [
    {
      type: "message",
      message: {
        role: "toolResult",
        toolName: "plan_tracker",
        details: {
          action: "update",
          tasks: [
            { name: "a", status: "pending" },
            { name: "b", status: "pending" },
            { name: "c", status: "complete" },
          ],
        },
      },
    },
  ];
  const { call, fire } = harness(branch);
  await fire("session_start");
  const rejected = await call({ action: "update", index: 0, status: "complete" });
  assert.equal(rejected.details.error, "pending-suffix violation: 1");
  assert.deepEqual(rejected.details.tasks.map((t) => t.status), ["pending", "pending", "complete"]);
  const repaired = await call({
    action: "init",
    tasks: [{ name: "a", status: "complete" }, { name: "b", status: "skipped" }, { name: "c", status: "complete" }],
  });
  assert.equal(repaired.details.error, undefined);
  assert.deepEqual(repaired.details.tasks.map((t) => t.status), ["complete", "skipped", "complete"]);
});

const descriptions = [
  "Keep cut requirements visible", "Reject malformed allowance replies", "Verify loop behavior and recovery",
  "Report failed checks", "Preserve completed work", "Start the next criterion",
];
const spec = (criteria = descriptions) => `# Spec\n\n## Acceptance criteria\n${criteria.map(text => `- [ ] ${text}`).join("\n")}\n`;
function ledgerFixture(prefix: string) {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  execFileSync("git", ["init", "-q", dir]);
  writeFileSync(join(dir, "spec.md"), spec(descriptions.map(text => `${text}\n  in-scope`)));
  return dir;
}
const ledger = (rows: string[], tail = "", pending = "") => [
  "# Ledger - loop engine", "**Spec:** `spec.md`", pending,
  "| row | status | attempts | evidence |", "|---|---|---|---|",
  ...rows.map(row => `| ${row} |`), "", "## Decisions", tail,
].join("\n");

test("refresh projects ledger states, numeric pending targets and live leg mappings", async () => {
  const dir = ledgerFixture("plan-refresh-");
  const path = join(dir, "ledger.md");
  const cases = [
    {
      name: "cut, baseline, dispatched, failed, in flight and pending without cap",
      text: ledger(["1 | cut | 0 | deferred: #1", "2 | done | 0 | baseline", "3 | done | 1 | check \\| passed", "4 | failed | 1 | check failed", "5 | open | 0 |", "6 | open | 0 |"], "row 3 done | passed | row 4\n## Notes\nrow 2 done | not a decision | none", "pending: 5 | home | abc1234"),
      expected: [["row 1", "skipped"], ["row 2", "skipped"], ["row 3", "complete"], ["row 4", "failed"], ["row 5", "in_progress"], ["row 6", "pending"]],
    },
    { name: "retry overrides failed", text: ledger(["1 | failed | 1 | failed"], "", "pending: 1 | home | abc1234"), expected: [["row 1", "in_progress"]] },
    { name: "leading-zero target names its numeric row", text: ledger(["1 | open | 0 |"], "", "pending: 01 | home | abc1234"), expected: [["row 1", "in_progress"]] },
    { name: "done beats stale pending", text: ledger(["1 | done | 1 | passed"], "row 1 done | passed | none", "pending: 1 | home | abc1234"), expected: [["row 1", "complete"]] },
    { name: "cut beats stale pending and all cut are skipped", text: ledger(["1 | cut | 0 | deferred: #1"], "", "pending: 1 | home | abc1234"), expected: [["row 1", "skipped"]] },
    { name: "seed names no row", text: ledger(["1 | failed | 1 | failed", "2 | open | 0 |"], "", "pending: seed | home | abc1234"), expected: [["row 1", "failed"], ["row 2", "pending"]] },
    {
      name: "mapped home and companion tasks sort non-pending first",
      text: ledger(["1 | open | 0 |", "2 | done | 1 | passed", "3 | failed | 1 | failed"], "row 2 done | passed | row 3\n\n## Leg mapping\n| row | ac | leg |\n|---|---|---|\n| 1 | 1 | repo-a |\n| 2 | 1 | repo-b |\n| 3 | 2 | repo-a |", "pending: 3 | repo-a | abc1234"),
      expected: [["row 2 (repo-b)", "complete"], ["row 3 (repo-a)", "in_progress"], ["row 1 (repo-a)", "pending"]],
    },
  ];
  for (const row of cases) {
    writeFileSync(path, row.text);
    const h = harness([], dir);
    const result = await h.call({ action: "refresh", path: "ledger.md" });
    assert.equal(result.details.error, undefined, row.name);
    assert.equal(result.details.action, "refresh", row.name);
    assert.deepEqual(result.details.tasks.map(t => [t.name, t.status]), row.expected, row.name);
    assert.deepEqual(validateSnapshot(result.details.tasks as any), [], row.name);
    assert.deepEqual((await h.call({ action: "status" })).details.tasks, result.details.tasks, row.name);
    const done = result.details.tasks.filter(t => ["complete", "skipped"].includes(t.status)).length;
    assert.ok(h.widget()!.includes(`(${done}/${row.expected.length})`), row.name);
  }
});

test("refresh replaces only whole ledger names, preserves Gn statuses and replays its snapshot", async () => {
  const dir = ledgerFixture("plan-refresh-kept-");
  const path = join(dir, "ledger.md");
  writeFileSync(path, ledger(["1 | open | 0 |", "2 | open | 0 |", "3 | done | 1 | passed"], "row 3 done | passed | row 1"));
  const h = harness();
  await h.call({ action: "init", tasks: [
    { name: "row 99", status: "complete" }, { name: "row 8 (old-repo)", status: "failed" },
    { name: "G1: closed", status: "complete" }, { name: "G2: working", status: "in_progress" },
    "row 4 notes", "G3: pending",
  ] });
  const result = await h.call({ action: "refresh", path });
  assert.equal(result.details.error, undefined);
  assert.deepEqual(result.details.tasks, [
    { name: "row 3", status: "complete", label: descriptions[2] },
    { name: "G1: closed", status: "complete" }, { name: "G2: working", status: "in_progress" },
    { name: "row 1", status: "pending", label: descriptions[0] }, { name: "row 2", status: "pending", label: descriptions[1] },
    { name: "row 4 notes", status: "pending" }, { name: "G3: pending", status: "pending" },
  ]);
  assert.deepEqual(validateSnapshot(result.details.tasks as any), []);
  const replay = harness([{ type: "message", message: { role: "toolResult", toolName: "plan_tracker", details: result.details } }]);
  await replay.fire("session_start");
  assert.deepEqual((await replay.call({ action: "status" })).details.tasks, result.details.tasks);
  assert.equal(replay.widget(), h.widget());
});

test("allowance labels count retry decisions, preserve identity and render on every status surface", async () => {
  const dir = ledgerFixture("plan-allowance-");
  const path = join(dir, "ledger.md");
  const text = ledger([
    "1 | cut | 3 | deferred: #1", "2 | done | 0 | baseline", "3 | open | 2 | check",
    "4 | failed | 7 | failed", "5 | done | 1 | passed", "6 | open | 0 | check",
  ], [
    "row 3 retry | hint | allowed attempts 5", "row 3 retry | next | allowed attempts 99",
    "row 3 escalated | implModel round | allowed attempts 100", "cap +20 | historical | cap 40",
    "row 4 retry | hint | allowed attempts 8", "row 5 done | passed | row 3",
    "## Notes", "row 3 retry | not a decision | allowed attempts 101",
    "## Leg mapping", "| row | ac | leg |", "|---|---|---|",
    "| 1 | 1 | repo-a |", "| 2 | 2 | repo-a |", "| 3 | 3 | repo-b |",
    "| 4 | 4 | repo-a |", "| 5 | 5 | repo-b |", "| 6 | 6 | repo-a |",
  ].join("\n"), "allowance: 4\npending: 3 | repo-b | abc1234");
  writeFileSync(path, text);
  const h = harness();
  await h.call({ action: "init", tasks: [{ name: "G1: fixed", status: "complete" }, "2/5: G2: pending"] });
  const result = await h.call({ action: "refresh", path });
  assert.equal(result.details.error, undefined);
  assert.deepEqual(result.details.tasks, [
    { name: "row 1 (repo-a)", status: "skipped", label: `${descriptions[0]} (repo-a)` },
    { name: "row 2 (repo-a)", status: "skipped", label: `${descriptions[1]} (repo-a)` },
    { name: "row 3 (repo-b)", status: "in_progress", label: `2/6: ${descriptions[2]} (repo-b)` },
    { name: "row 4 (repo-a)", status: "failed", label: `7/5: ${descriptions[3]} (repo-a)` },
    { name: "row 5 (repo-b)", status: "complete", label: `1/4: ${descriptions[4]} (repo-b)` },
    { name: "G1: fixed", status: "complete" },
    { name: "row 6 (repo-a)", status: "pending", label: `0/4: ${descriptions[5]} (repo-a)` },
    { name: "2/5: G2: pending", status: "pending" },
  ]);
  assert.match(h.widget()!, /2\/6: Verify loop behavior and recovery \(repo-b\)$/);
  assert.doesNotMatch(h.widget()!, /row 3/);
  assert.match(result.content[0].text, /\[2\] row 3 \(repo-b\) \| 2\/6: Verify loop behavior and recovery \(repo-b\)/);
  const status = await h.call({ action: "status" });
  assert.match(status.content[0].text, /\[4\] row 5 \(repo-b\) \| 1\/4: Preserve completed work \(repo-b\)/);
  const rendered = h.tool().renderResult(status, {}, h.theme).text!;
  assert.match(rendered, /row 3 \(repo-b\) \| 2\/6: Verify loop behavior and recovery \(repo-b\)/);
  assert.match(rendered, /row 4 \(repo-a\) \| 7\/5: Report failed checks \(repo-a\)/);
  const replay = harness([{ type: "message", message: { role: "toolResult", toolName: "plan_tracker", details: status.details } }]);
  await replay.fire("session_start");
  assert.equal(replay.widget(), h.widget());
  assert.deepEqual((await replay.call({ action: "status" })).details.tasks, status.details.tasks);

  writeFileSync(path, text.replace("allowance: 4", "allowance: 7"));
  const raised = await h.call({ action: "refresh", path });
  assert.deepEqual(raised.details.tasks.map(t => [t.name, t.status]), result.details.tasks.map(t => [t.name, t.status]));
  assert.equal(raised.details.tasks.find(t => t.name === "row 3 (repo-b)")!.label, `2/9: ${descriptions[2]} (repo-b)`);
  assert.equal(raised.details.tasks.find(t => t.name === "row 5 (repo-b)")!.label, `1/7: ${descriptions[4]} (repo-b)`);
  assert.equal(raised.details.tasks.length, result.details.tasks.length);
  writeFileSync(path, text.replace("allowance: 4", "cap: 49"));
  const legacy = await h.call({ action: "refresh", path });
  assert.equal(legacy.details.error, undefined);
  assert.deepEqual(legacy.details.tasks.filter(t => t.name.startsWith("row ")).map(t => t.label),
    descriptions.map((description, i) => `${description} (${[2, 4].includes(i) ? "repo-b" : "repo-a"})`));
});

test("refresh compacts long criteria while preserving budgets, owners and short criteria", async () => {
  const dir = ledgerFixture("plan-compact-labels-");
  const path = join(dir, "ledger.md");
  const compact = "Verify that refreshed ledger labels keep complete words within the";
  const long = `${compact} description budget while retaining attempts and repository ownership`;
  writeFileSync(join(dir, "spec.md"), spec([long, descriptions[1]]));
  for (const mapped of [false, true]) {
    const owner = mapped ? " (repo-a)" : "";
    writeFileSync(path, ledger(["1 | open | 2 | check", "2 | open | 0 |"], mapped
      ? "## Leg mapping\n| row | ac | leg |\n|---|---|---|\n| 1 | 1 | repo-a |\n| 2 | 2 | repo-a |" : "", "allowance: 4"));
    const h = harness([], dir);
    const result = await h.call({ action: "refresh", path });
    assert.equal(result.details.error, undefined);
    assert.deepEqual(result.details.tasks, [
      { name: `row 1${owner}`, status: "pending", label: `2/4: ${compact}...${owner}` },
      { name: `row 2${owner}`, status: "pending", label: `0/4: ${descriptions[1]}${owner}` },
    ]);
    assert.ok(`${compact}...`.length <= 80);
    assert.ok(h.widget()!.endsWith(`2/4: ${compact}...${owner}`));
    assert.ok(result.content[0].text.includes(`row 1${owner} | 2/4: ${compact}...${owner}`));
  }
});

test("allowance labels tolerate surrounding whitespace in the header value", async () => {
  const dir = ledgerFixture("plan-allowance-whitespace-");
  const path = join(dir, "ledger.md");
  const h = harness();
  const labels = [];
  for (const header of ["allowance: 4", "allowance:  4", "allowance: 4 "]) {
    writeFileSync(path, ledger(["1 | open | 0 |"], "", header));
    const result = await h.call({ action: "refresh", path });
    assert.equal(result.details.error, undefined, header);
    labels.push(result.details.tasks[0].label);
  }
  assert.deepEqual(labels, Array(3).fill(`0/4: ${descriptions[0]}`));
});

test("single-repo labels are projection-only and cannot enter through init or add", async () => {
  const dir = ledgerFixture("plan-label-input-");
  const path = join(dir, "ledger.md");
  writeFileSync(path, ledger(["3 | open | 2 | check"], "row 3 retry | hint | allowed attempts 99", "allowance: 4"));
  const h = harness();
  const projected = await h.call({ action: "refresh", path });
  assert.deepEqual(projected.details.tasks, [{ name: "row 3", status: "pending", label: `2/5: ${descriptions[2]}` }]);
  assert.match(h.widget()!, /2\/5: Verify loop behavior and recovery$/);
  const init = await h.call({ action: "init", tasks: [{ name: "row 3", status: "in_progress", label: "9/9" }] });
  assert.deepEqual(init.details.tasks, [{ name: "row 3", status: "in_progress" }]);
  const added = await h.call({ action: "add", tasks: [{ name: "G1: check", status: "pending", label: "9/9" }] });
  assert.ok(added.details.tasks.every(t => !Object.hasOwn(t, "label")));
  const objectSchema = h.parameters().args[0].tasks.args[0].args[0].args[0][1];
  assert.deepEqual(Object.keys(objectSchema.args[0]), ["name", "status"]);
});

test("refresh resolves the owning root, normalizes original AC text, and keeps labels stable across status changes", async () => {
  const dir = ledgerFixture("plan-descriptions-");
  const nested = join(dir, "doc", "plans");
  mkdirSync(nested, { recursive: true });
  const path = join(nested, "ledger.md");
  writeFileSync(join(dir, "spec.md"), [
    "# Spec", "```md", "## Acceptance criteria", "- [ ] Not a criterion", "```",
    "## Acceptance Criteria", "- [x] Keep   cut requirements", "  visible",
    "  deferred: #1", "    disposition continuation", "- [ ] Reject malformed allowance replies",
    "  elsewhere: repo-b#2", "- [ ] Verify loop behavior", "  and recovery | row 99 is only text",
    "  venue: staging - observe completion", "## Design", "- [ ] Not an acceptance criterion",
  ].join("\n"));
  const text = ledger(["1 | cut | 0 | deferred", "2 | done | 0 | baseline", "3 | open | 2 | check"], "", "allowance: 4");
  writeFileSync(path, text);
  const h = harness([], nested);
  const first = await h.call({ action: "refresh", path: "ledger.md" });
  assert.equal(first.details.error, undefined);
  assert.deepEqual(first.details.tasks.map(t => t.label), [
    "Keep cut requirements visible", descriptions[1], "2/4: Verify loop behavior and recovery | row 99 is only text",
  ]);
  assert.match(first.content[0].text, /row 3 \| 2\/4: Verify loop behavior and recovery \| row 99 is only text/);
  for (const [status, tail, pending] of [
    ["failed", "", ""], ["failed", "", "pending: 3 | home | abc1234"],
    ["done", "row 3 done | passed | none", ""],
  ]) {
    writeFileSync(path, text.replace("| 3 | open", `| 3 | ${status}`).replace("allowance: 4", `allowance: 4\n${pending}`) + tail);
    const next = await h.call({ action: "refresh", path });
    assert.equal(next.details.error, undefined);
    assert.deepEqual(next.details.tasks.map(t => [t.name, t.label]), first.details.tasks.map(t => [t.name, t.label]));
  }
  writeFileSync(join(dir, "spec.md"), spec([descriptions[0], descriptions[1], "Verify amended behavior"]));
  const amended = await h.call({ action: "refresh", path });
  assert.equal(amended.details.tasks[2].name, "row 3");
  assert.equal(amended.details.tasks[2].label, "2/4: Verify amended behavior");
  assert.equal(amended.details.tasks.length, 3);
});

test("coordinated labels use mapped original AC indices, including shared criteria", async () => {
  const dir = ledgerFixture("plan-original-ac-");
  const path = join(dir, "ledger.md");
  writeFileSync(path, ledger(["1 | cut | 0 | cut", "2 | open | 1 | check", "3 | open | 0 | check"], [
    "## Leg mapping", "| row | ac | leg |", "|---|---|---|",
    "| 1 | 2 | repo-a |", "| 2 | 3 | repo-a |", "| 3 | 3 | repo-b |",
  ].join("\n"), "allowance: 4"));
  const result = await harness().call({ action: "refresh", path });
  assert.equal(result.details.error, undefined);
  assert.deepEqual(result.details.tasks.map(t => [t.name, t.label]), [
    ["row 1 (repo-a)", `${descriptions[1]} (repo-a)`],
    ["row 2 (repo-a)", `1/4: ${descriptions[2]} (repo-a)`],
    ["row 3 (repo-b)", `0/4: ${descriptions[2]} (repo-b)`],
  ]);
});

test("refresh rejects an unresolvable repository root without changing initialized tasks", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "plan-no-checkout-"));
  try {
    execFileSync("git", ["-C", dir, "rev-parse", "--show-toplevel"], { stdio: "ignore" });
    t.skip("temporary directory is inside a git repository");
    return;
  } catch {}
  writeFileSync(join(dir, "spec.md"), spec(["Keep prior tasks"]));
  const path = join(dir, "ledger.md");
  writeFileSync(path, ledger(["1 | open | 0 |"], "", "allowance: 4"));
  const h = harness([], dir);
  const initial = await h.call({ action: "init", tasks: [{ name: "G1: closed", status: "complete" }, "G2: pending"] });
  const result = await h.call({ action: "refresh", path });
  assert.match(result.details.error!, /cannot resolve repository root for Spec reference/);
  assert.equal(result.details.tasks, undefined);
  assert.deepEqual((await h.call({ action: "status" })).details.tasks, initial.details.tasks);
});

test("refresh rejects missing specs, missing criteria and empty descriptions atomically", async () => {
  const dir = ledgerFixture("plan-spec-errors-");
  const path = join(dir, "ledger.md");
  const valid = ledger(["1 | open | 0 | check"], "", "allowance: 4");
  writeFileSync(path, valid);
  const h = harness();
  const initial = await h.call({ action: "refresh", path });
  assert.equal(initial.details.error, undefined);
  const widget = h.widget();
  const cases = [
    { text: valid.replace("**Spec:** `spec.md`", ""), spec: spec(), error: /missing Spec reference/ },
    { text: valid.replace("`spec.md`", "`absent.md`"), spec: spec(), error: /cannot read spec .*absent\.md:/ },
    { text: valid, spec: "# Spec\n## Design\n- [ ] Not an AC", error: /row 1: spec .*spec\.md AC 1 is missing/ },
    { text: valid, spec: spec(["  \n  deferred: #1"]), error: /row 1: spec .*spec\.md AC 1 has an empty description/ },
    { text: ledger(["7 | open | 0 | check"]), spec: spec(), error: /row 7: spec .*spec\.md AC 7 is missing/ },
    { text: valid + "\n## Leg mapping\n| row | ac | leg |\n|---|---|---|\n| 1 | 9 | repo-a |", spec: spec(), error: /row 1: spec .*spec\.md AC 9 is missing/ },
  ];
  for (const row of cases) {
    writeFileSync(path, row.text);
    writeFileSync(join(dir, "spec.md"), row.spec);
    const result = await h.call({ action: "refresh", path });
    assert.match(result.details.error!, row.error);
    assert.equal(result.details.tasks, undefined);
    assert.equal(h.widget(), widget);
    assert.deepEqual((await h.call({ action: "status" })).details.tasks, initial.details.tasks);
  }
});

test("status rows round-trip through the brief identity grammar without description drift or duplicate tasks", async () => {
  const contract = readFileSync(new URL("../skills/gauntlet-resume/reference/brief-contract.md", import.meta.url), "utf8");
  const suffix = new RegExp(contract.match(/suffix pattern `([^`]+)`/)![1]);
  const prefix = new RegExp(contract.match(/prefix pattern `([^`]+)`/)![1]);
  const canonical = new RegExp(contract.match(/canonical pattern `([^`]+)`/)![1]);
  const restoreName = (name: string) => {
    const labeled = suffix.exec(name);
    if (labeled) return labeled[1];
    const plain = name.replace(prefix, "");
    return canonical.test(plain) ? plain : name;
  };
  for (const [input, expected] of [
    ["row 3", "row 3"], ["2/5: row 3", "row 3"], ["2/5: row 3 (repo-b)", "row 3 (repo-b)"],
    ["row 3 (repo-b) | 2/5: Verify | row 99", "row 3 (repo-b)"],
    ["2/5: G3: pending", "2/5: G3: pending"], ["G1: row 3 | description", "G1: row 3 | description"],
    ["row 3 notes | description", "row 3 notes | description"],
  ]) assert.equal(restoreName(input), expected);
  const dir = ledgerFixture("plan-brief-roundtrip-");
  const path = join(dir, "ledger.md");
  writeFileSync(join(dir, "spec.md"), spec([descriptions[0], descriptions[1], `${descriptions[2]} | row 99 is text`]));
  const text = ledger(["2 | cut | 0 | cut", "3 | done | 2 | passed"], "row 3 done | passed | none", "allowance: 5");
  writeFileSync(path, text);
  const h = harness();
  await h.call({ action: "init", tasks: [{ name: "G1: failed", status: "failed" }, { name: "G2: repair", status: "in_progress" }, "2/5: G3: pending"] });
  await h.call({ action: "refresh", path });
  const status = await h.call({ action: "status" });
  const brief = status.content[0].text;
  const statuses: Record<string, string> = { "\u2713": "complete", "\u2192": "in_progress", "\u2717": "failed", "\u2298": "skipped", "\u25cb": "pending" };
  const restored = [...brief.matchAll(/^\s*([\u2713\u2192\u2717\u2298\u25cb]) \[\d+\] (.+)$/gm)]
    .map(([, glyph, name]) => ({ name: restoreName(name), status: statuses[glyph] }));
  assert.deepEqual(restored, status.details.tasks.map(({ name, status }) => ({ name, status })));
  const resumed = harness();
  const init = await resumed.call({ action: "init", tasks: restored });
  assert.equal(init.details.error, undefined);
  assert.ok(init.details.tasks.every(t => !Object.hasOwn(t, "label")));
  writeFileSync(path, text.replace("allowance: 5", "allowance: 6"));
  const refreshed = await resumed.call({ action: "refresh", path });
  assert.deepEqual(refreshed.details.tasks.map(({ name, status }) => ({ name, status })), restored);
  assert.match(refreshed.content[0].text, /row 3 \| 2\/6: Verify loop behavior and recovery \| row 99 is text/);
  assert.equal(refreshed.details.tasks.filter(t => t.name === "row 3").length, 1);
});

test("refresh rejects unreadable or malformed ledgers atomically, including absent numeric pending rows", async () => {
  const dir = ledgerFixture("plan-refresh-error-");
  const path = join(dir, "ledger.md");
  const valid = ledger(["1 | open | 0 |"]);
  const h = harness();
  const initial = await h.call({ action: "init", tasks: [{ name: "G1: closed", status: "complete" }, "G2: pending"] });
  const widget = h.widget();
  const cases = [
    { name: "missing path", path: undefined, text: valid, error: /refresh: cannot read .*path required/ },
    { name: "unreadable path", path: join(dir, "absent.md"), text: valid, error: /refresh: cannot read .*absent\.md:/ },
    { name: "wrong discriminator", path, text: "# Plan", error: /line 1 is "# Plan", not a loop ledger/ },
    { name: "missing header", path, text: valid.replace("| row | status | attempts | evidence |", "| row | state | attempts | evidence |"), error: /row table malformed at line \d+/ },
    { name: "nonnumeric row", path, text: valid.replace("| 1 | open", "| x | open"), error: /row table malformed at line 6/ },
    { name: "invalid status", path, text: valid.replace("| 1 | open", "| 1 | unknown"), error: /row table malformed at line 6/ },
    ...["x", "-1", "1.5", ""].map(attempts => ({ name: `invalid attempts ${attempts}`, path, text: valid.replace("| 0 |", `| ${attempts} |`), error: /row table malformed at line 6/ })),
    { name: "absent pending row", path, text: "pending: 2 | home | abc1234", error: /pending: names row 2 which is absent/ },
    { name: "zero pending row", path, text: "pending: 0 | home | abc1234", error: /pending: names row 0 which is absent/ },
    { name: "leading-zero absent row", path, text: "pending: 02 | home | abc1234", error: /pending: names row 2 which is absent/ },
    { name: "absent mapping row", path, text: valid + "\n## Leg mapping\n| row | ac | leg |\n|---|---|---|\n| 2 | 1 | repo-a |", error: /leg mapping names row 2 which is absent/ },
  ];
  for (const row of cases) {
    writeFileSync(path, row.text.startsWith("pending:") ? ledger(["1 | open | 0 |"], "", row.text) : row.text);
    const result = await h.call({ action: "refresh", path: row.path });
    assert.match(result.details.error!, row.error, row.name);
    assert.equal(result.details.tasks, undefined, row.name);
    assert.equal(h.widget(), widget, row.name);
    assert.deepEqual((await h.call({ action: "status" })).details.tasks, initial.details.tasks, row.name);
    if (row.path) assert.ok(result.content[0].text.includes(row.path), row.name);
  }
});

test("registration: sequential, tasks schema is Array<Union<String, Object>>, description carries the contract", () => {
  const { executionMode, parameters, description } = harness();
  assert.equal(executionMode(), "sequential");
  const tasksSchema = parameters().args[0].tasks.args[0];
  assert.equal(tasksSchema.kind, "Array");
  assert.equal(tasksSchema.args[0].kind, "Union");
  assert.deepEqual(tasksSchema.args[0].args[0].map((s: { kind: string }) => s.kind), ["String", "Object"]);
  assert.match(description(), /skipped/);
  assert.match(description(), /pending tasks must trail every started or finished task/);
  assert.match(description(), /update never sets pending/);
});
