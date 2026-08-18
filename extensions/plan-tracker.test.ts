import assert from "node:assert/strict";
import { test } from "node:test";
import registerPlanTracker from "./plan-tracker.ts";

type ToolResult = {
  content: { type: string; text: string }[];
  details: { action: string; tasks: { name: string; status: string }[]; error?: string };
};

function harness(branch: unknown[] = []) {
  const tools: {
    name: string;
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
  return { call, fire, tool: () => tools[0], theme, widget: () => widgetText };
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
  assert.match(res.content[0].text, /1\/3 complete/);
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
  await call({ action: "update", index: 1, status: "failed" });
  const res = await call({ action: "status" });
  const rendered = tool().renderResult(res as any, {}, theme as any);
  const text = (rendered as any).text as string;
  assert.match(text, /0\/2 complete/);
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
  assert.match(text, /1\/3 complete, 1 failed/);
});

test("renderResult status header omits failed count when no task has failed", async () => {
  const { call, tool, theme } = harness();
  await call({ action: "init", tasks: ["a", "b"] });
  await call({ action: "update", index: 0, status: "complete" });
  const res = await call({ action: "status" });
  const rendered = tool().renderResult(res as any, {}, theme as any);
  const text = (rendered as any).text as string;
  assert.match(text, /^1\/2 complete\n/);
  assert.doesNotMatch(text, /failed/);
});

test("renderResult update case appends failed count when a task has failed", async () => {
  const { call, tool, theme } = harness();
  await call({ action: "init", tasks: ["a", "b", "c"] });
  await call({ action: "update", index: 0, status: "complete" });
  const res = await call({ action: "update", index: 1, status: "failed" });
  const rendered = tool().renderResult(res as any, {}, theme as any);
  const text = (rendered as any).text as string;
  assert.match(text, /^\u2713 Updated \(1\/3 complete, 1 failed\)$/);
});

test("renderResult update case omits failed count when no task has failed", async () => {
  const { call, tool, theme } = harness();
  await call({ action: "init", tasks: ["a", "b"] });
  const res = await call({ action: "update", index: 0, status: "complete" });
  const rendered = tool().renderResult(res as any, {}, theme as any);
  const text = (rendered as any).text as string;
  assert.match(text, /^\u2713 Updated \(1\/2 complete\)$/);
  assert.doesNotMatch(text, /failed/);
});
