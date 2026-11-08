import assert from "node:assert/strict";
import { test } from "node:test";
import { createPendingWarnings, prependWarning } from "./tool-result-warnings.ts";
import { mergeToolResult } from "../test-support/merge-tool-result.mjs";

for (const [name, toolName, structuredContent] of [
  ["bash payload", "bash", { output: "ok", exit_code: 0 }],
  ["write null", "write", null],
  ["edit false", "edit", false],
  ["zero", "codemode", 0],
  ["empty string", "read", ""],
  ["absent", "read", undefined],
] as const) {
  test(`prependWarning preserves the runner-merged result (${name})`, () => {
    const event = {
      toolName, toolCallId: "c1", input: {}, isError: true,
      ...(structuredContent !== undefined ? { structuredContent } : {}),
      content: [{ type: "text", text: "original" }, { type: "image", data: "AA==", mimeType: "image/png" }],
      details: { sentinel: "details" }, usage: { sentinel: "usage" },
    };
    const original = structuredClone(event);
    const ret = prependWarning(event as any, "warning");
    assert.deepEqual(ret, { content: [{ type: "text", text: "warning" }, ...event.content], structuredContent });
    assert.deepEqual(mergeToolResult(event, ret), { ...event, content: ret.content });
    assert.deepEqual(event, original);
  });
}

test("nested warning re-keys without changing the child or the fired latch, then delivers once", () => {
  const store = createPendingWarnings();
  const firedGuards = new Map([["guard", true]]);
  const child = {
    toolName: "bash", toolCallId: "c1/0", parentToolCallId: "c1", input: {}, isError: false,
    content: [{ type: "text", text: "ok" }], structuredContent: { output: "ok", exit_code: 0 },
  };
  const original = structuredClone(child);
  store.add(child.toolCallId, "warning");
  const ret = store.deliver(child as any, store.take(child.toolCallId)!);
  assert.equal(ret, undefined);
  assert.deepEqual(mergeToolResult(child, ret), original);
  assert.deepEqual(child, original);
  assert.equal(firedGuards.get("guard"), true);
  assert.equal(store.take(child.toolCallId), undefined);

  const parent = { ...child, toolName: "codemode", toolCallId: "c1", parentToolCallId: undefined, structuredContent: { value: 0 } };
  const text = store.take(parent.toolCallId)!;
  assert.equal(text, "warning");
  const delivered = store.deliver(parent as any, text)!;
  assert.deepEqual(mergeToolResult(parent, delivered), { ...parent, content: [{ type: "text", text }, ...parent.content] });
  assert.equal(store.take(parent.toolCallId), undefined);
});

test("two nested guards reach one parent once in arrival order", () => {
  const store = createPendingWarnings();
  for (const [id, text] of [["c1/0", "first guard"], ["c1/1", "second guard"]]) {
    store.add(id, text);
    assert.equal(store.deliver({ toolCallId: id, parentToolCallId: "c1" } as any, store.take(id)!), undefined);
    assert.equal(store.take(id), undefined);
  }
  const parent = { toolName: "codemode", toolCallId: "c1", isError: false, content: [], structuredContent: null };
  const ret = store.deliver(parent as any, store.take("c1")!)!;
  const merged = mergeToolResult(parent, ret);
  assert.deepEqual(merged.content, [{ type: "text", text: "first guard\n\nsecond guard" }]);
  assert.deepEqual(merged.structuredContent, parent.structuredContent);
  assert.equal(store.take("c1"), undefined);
});

test("depth-two nesting re-keys c1/0/2 -> c1/0 -> c1", () => {
  const store = createPendingWarnings();
  store.add("c1/0/2", "warning");
  for (const [toolCallId, parentToolCallId] of [["c1/0/2", "c1/0"], ["c1/0", "c1"]]) {
    const event = { toolName: "codemode", toolCallId, parentToolCallId, content: [], structuredContent: { value: 0 } };
    const ret = store.deliver(event as any, store.take(toolCallId)!);
    assert.equal(ret, undefined);
    assert.deepEqual(mergeToolResult(event, ret), event);
    assert.equal(store.take(toolCallId), undefined);
  }
  const parent = { toolCallId: "c1", content: [], structuredContent: { value: 0 } };
  const ret = store.deliver(parent as any, store.take("c1")!);
  const merged = mergeToolResult(parent, ret);
  assert.deepEqual(merged.content, [{ type: "text", text: "warning" }]);
  assert.deepEqual(merged.structuredContent, parent.structuredContent);
  assert.equal(store.take("c1"), undefined);
});

test("warning delivery tolerates missing content and preserves structuredContent", () => {
  const store = createPendingWarnings();
  const event = { toolName: "bash", toolCallId: "c1", isError: false, structuredContent: { output: "ok", exit_code: 0 } };
  store.add(event.toolCallId, "warning");
  const ret = store.deliver(event as any, store.take(event.toolCallId)!);
  assert.deepEqual(mergeToolResult(event, ret), { ...event, content: [{ type: "text", text: "warning" }] });
  assert.equal(store.take(event.toolCallId), undefined);
});

test("add concatenates warnings and clear discards all entries", () => {
  const store = createPendingWarnings();
  store.add("c1", "first");
  store.add("c1", "second");
  assert.equal(store.take("c1"), "first\n\nsecond");
  store.add("c1", "pending");
  store.add("c2", "another");
  store.clear();
  assert.equal(store.take("c1"), undefined);
  assert.equal(store.take("c2"), undefined);
});
