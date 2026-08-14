import assert from "node:assert/strict";
import { test } from "node:test";
import registerPlanTracker from "./plan-tracker.ts";

type ToolResult = {
  content: { type: string; text: string }[];
  details: { action: string; tasks: { name: string; status: string }[]; error?: string };
};

function harness(branch: unknown[] = []) {
  const tools: { name: string; execute: (...args: any[]) => unknown }[] = [];
  const pi = {
    on(_event: string, _handler: unknown) {},
    registerTool(tool: { name: string; execute: (...args: any[]) => unknown }) {
      tools.push(tool);
    },
  };
  registerPlanTracker(pi as any);
  const ctx = { hasUI: false, sessionManager: { getBranch: () => branch } };
  const call = async (params: Record<string, unknown>): Promise<ToolResult> =>
    (await tools[0].execute("id", params, undefined, undefined, ctx)) as ToolResult;
  return { call };
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
