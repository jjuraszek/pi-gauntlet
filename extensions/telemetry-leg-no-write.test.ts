import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { parse } from "yaml";
import registerTelemetry, { realFs, type Deps } from "./telemetry.ts";
import { resolveTelemetry } from "./lib/gauntlet-settings.ts";

const originalDepth = process.env.PI_SUBAGENT_DEPTH;
process.env.PI_SUBAGENT_DEPTH = "0";
after(() => {
  if (originalDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
  else process.env.PI_SUBAGENT_DEPTH = originalDepth;
});

for (const [skill, row, expected] of [
  ["shape-ticket", "#42: declined", { kind: "ticket", key: "#42", outcome: "declined" }],
  ["shape-ticket", "#42: no-op", { kind: "ticket", key: "#42", outcome: "no-op" }],
  ["gatekeep-pr", "#42@abc123: stopped", { kind: "pr", key: "#42@abc123", outcome: "stopped" }],
  ["check-delivery", "#42: declined", { kind: "ticket", key: "#42", outcome: "declined" }],
  ["shape-ticket", "Uncreated ticket: declined", { kind: "ticket", outcome: "declined" }],
  ["shape-ticket", "Uncreated ticket: dropped", { kind: "ticket", outcome: "dropped" }],
] as const) {
  test(`${skill} ${row} records without tracker or checkout writes`, async () => {
    const root = mkdtempSync(join(tmpdir(), "telemetry-no-write-"));
    const trackerPath = join(root, "tracker.json");
    writeFileSync(trackerPath, JSON.stringify({
      ticket: { body: "Ticket body\n", state: "open", labels: ["bug"], reviews: [] },
      pr: { body: "PR body\n", state: "open", labels: ["review"], reviews: [{ state: "COMMENTED", body: "Keep this review\n" }] },
    }, null, 2));
    const before = readFileSync(trackerPath);
    const records = new Map<string, string>();
    const writes: unknown[] = [];
    const warnings: unknown[] = [];
    const handlers = new Map<string, ((event: any, ctx: any) => unknown)[]>();
    const forbidden = (...args: unknown[]): never => {
      writes.push(args);
      throw new Error("no-write settlement attempted a non-telemetry write");
    };
    let pushes = 0;
    const deps: Deps = {
      fs: { ...realFs, writeFileSync: forbidden, renameSync: forbidden, mkdirSync: forbidden, unlinkSync: forbidden },
      now: () => "2026-11-06T12:34:56.123Z",
      settings: () => ({ telemetry: resolveTelemetry({}), specDirs: [], planDirs: [], errors: [], versions: { "pi-gauntlet": "8.2.1" } }),
      git: async (args) => {
        if (args[0] === "rev-parse") return { code: 0, stdout: `${root}\n${root}/.git\n${root}/.git\n`, stderr: "" };
        if (args[0] === "config" && args.length === 2 && ["user.name", "user.email"].includes(args[1])) {
          return { code: 0, stdout: "Tester\n", stderr: "" };
        }
        return forbidden(args);
      },
      telemetryRepo: () => "team/product",
      syncTelemetryBranch: (_root, incoming) => {
        pushes++;
        for (const [path, bytes] of incoming) records.set(path, bytes);
        return { ok: true, committed: true, pushed: true };
      },
    };
    registerTelemetry({
      on: (name: string, handler: (event: any, ctx: any) => unknown) => handlers.set(name, [...(handlers.get(name) ?? []), handler]),
      exec: forbidden,
      sendMessage: (message: unknown) => warnings.push(message),
    } as any, deps);
    const ctx = { cwd: root, sessionManager: { getBranch: () => [], getSessionId: () => "no-write-session" } };
    const emit = async (name: string, event: unknown = {}) => {
      for (const handler of handlers.get(name) ?? []) await handler(event, ctx);
    };
    await emit("session_start");
    await emit("input", { source: "interactive", text: `/skill:${skill}` });
    await emit("message_end", { message: {
      role: "assistant", content: [{ type: "text", text: `gauntlet: done settled\n${row}` }],
      usage: { input: 12, output: 4, cost: 0.125 },
    } });
    assert.equal(records.size, 0, "only settlement may publish the record");
    await emit("agent_settled", { aborted: false });
    await emit("agent_settled", { aborted: false });
    assert.equal(pushes, 1);
    assert.equal(records.size, 1);
    const path = `team/product/${skill}/20261106T123456.123Z-no-write-session.yaml`;
    const record = parse(records.get(path)!);
    assert.deepEqual(record.items, [expected]);
    assert.equal(record.cost, 0.125);
    assert.equal(record.tokens.input, 12);
    assert.equal(record.tokens.output, 4);
    assert.deepEqual(writes, [], "no tracker command or checkout write may accompany telemetry");
    assert.deepEqual(warnings, []);
    assert.deepEqual(readFileSync(trackerPath), before, "ticket and PR body, state, labels and reviews remain byte-identical");
  });
}
