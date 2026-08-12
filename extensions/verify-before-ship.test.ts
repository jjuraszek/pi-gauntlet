import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import registerVerifyBeforeShip from "./verify-before-ship.ts";

const tempDirs: string[] = [];
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

function harness() {
  const handlers = new Map<string, ((event: unknown, ctx: unknown) => unknown)[]>();
  const dir = mkdtempSync(join(tmpdir(), "verify-before-ship-test-"));
  tempDirs.push(dir);
  const ctx = { cwd: dir };
  const pi = {
    on(event: string, handler: (event: unknown, context: unknown) => unknown) {
      const registered = handlers.get(event) ?? [];
      registered.push(handler);
      handlers.set(event, registered);
    },
  };
  registerVerifyBeforeShip(pi as any);
  const emitEvent = async (name: string, event: unknown) => {
    const results: unknown[] = [];
    for (const handler of handlers.get(name) ?? []) results.push(await handler(event, ctx));
    return results;
  };
  return { emitEvent };
}

const bashCall = (id: string, command: string) => ({ toolName: "bash", toolCallId: id, input: { command } });
const bashResult = (id: string, isError = false) => ({
  toolName: "bash",
  toolCallId: id,
  isError,
  content: [{ type: "text", text: "ok" }],
});
const writeCall = (id: string, path: string) => ({ toolName: "write", toolCallId: id, input: { path } });

const editSource = async (h: ReturnType<typeof harness>) => {
  await h.emitEvent("tool_call", writeCall("w1", "src/x.ts"));
};

const warningOf = (results: unknown[]): string | undefined => {
  const r = results[0] as { content?: { text?: string }[] } | undefined;
  return r?.content?.[0]?.text;
};

test("git commit is not watched: no warning even when unverified", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("c1", "git commit -m 'wave 1'"));
  assert.equal((await h.emitEvent("tool_result", bashResult("c1")))[0], undefined);
});

test("git push warns when unverified", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("p1", "git push origin main"));
  const warning = warningOf(await h.emitEvent("tool_result", bashResult("p1")));
  assert.match(warning ?? "", /ran without verification/);
});

test("gh pr create warns when unverified", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("pr1", "gh pr create --fill"));
  const warning = warningOf(await h.emitEvent("tool_result", bashResult("pr1")));
  assert.match(warning ?? "", /ran without verification/);
});

test("a passing recognised run clears the warning for push", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("t1", "npm test"));
  await h.emitEvent("tool_result", bashResult("t1"));
  await h.emitEvent("tool_call", bashCall("p1", "git push"));
  assert.equal((await h.emitEvent("tool_result", bashResult("p1")))[0], undefined);
});

test("a failing recognised run does not clear", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("t1", "npm test"));
  await h.emitEvent("tool_result", bashResult("t1", true));
  await h.emitEvent("tool_call", bashCall("p1", "git push"));
  const warning = warningOf(await h.emitEvent("tool_result", bashResult("p1")));
  assert.match(warning ?? "", /ran without verification/);
});
