import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { parse } from "yaml";
import registerTelemetry, { realFs, type Deps } from "./telemetry.ts";
import { resolveTelemetry } from "./lib/gauntlet-settings.ts";
import { settlementItems } from "./lib/telemetry-leg.ts";

const originalDepth = process.env.PI_SUBAGENT_DEPTH;
process.env.PI_SUBAGENT_DEPTH = "0";
after(() => {
  if (originalDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
  else process.env.PI_SUBAGENT_DEPTH = originalDepth;
});

function harness() {
  const root = mkdtempSync(join(tmpdir(), "telemetry-fields-"));
  const handlers = new Map<string, ((event: any, ctx: any) => unknown)[]>();
  const writes: { path: string; record: any }[] = [];
  const deps: Deps = {
    fs: realFs,
    now: () => "2026-11-06T12:34:56Z",
    settings: () => ({ telemetry: resolveTelemetry({}), specDirs: [], planDirs: [], errors: [], versions: { "pi-gauntlet": "8.2.1" } }),
    git: async (args) => ({ code: 0, stderr: "", stdout: args[0] === "config"
      ? args[1] === "user.name" ? "Observed Author\n" : "author@example.test\n"
      : `${root}\n${root}/.git\n${root}/.git\n` }),
    telemetryRepo: () => "team/product",
    syncTelemetryBranch: (_root, records) => {
      for (const [path, bytes] of records) writes.push({ path, record: parse(bytes) });
      return { ok: true, committed: true, pushed: true };
    },
  };
  const ctx = { cwd: root, model: { provider: "test", id: "initial" }, sessionManager: { getBranch: () => [], getSessionId: () => "observed-session" } };
  registerTelemetry({
    on: (name: string, handler: (event: any, ctx: any) => unknown) => handlers.set(name, [...(handlers.get(name) ?? []), handler]),
    sendMessage: () => {},
  } as any, deps);
  const emit = async (name: string, event: unknown = {}) => {
    for (const handler of handlers.get(name) ?? []) await handler(event, ctx);
  };
  const say = (text: string, usage?: unknown) => emit("message_end", { message: {
    role: "assistant", provider: "test", model: "response", content: [{ type: "text", text }], usage,
  } });
  return { emit, say, writes };
}

for (const [skill, line, item] of [
  ["shape-ticket", "#42: written", { kind: "ticket", key: "#42", outcome: "written" }],
  ["gatekeep-pr", "#42@aBc123: approved (#17)", { kind: "pr", key: "#42@aBc123", ticket: "#17", outcome: "approved" }],
  ["check-delivery", "ENG-17: already recorded", { kind: "ticket", key: "ENG-17", outcome: "already recorded" }],
] as const) {
  test(`${skill} record fields use observations, never assistant claims`, async () => {
    const h = harness();
    await h.emit("session_start");
    await h.say("Not part of this leg", { input: 999, cost: 999 });
    await h.emit("input", { source: "interactive", text: `/skill:${skill}` });
    await h.say("Assessing", { input: 10, output: 2, cacheRead: 30, cacheWrite: 4, cost: { total: 0.25 } });
    await h.emit("model_select", { model: { provider: "test", id: "selected" } });
    await h.say(`gauntlet: done settled\n${line}\nworktree: done\n#### #55\nsession: forged\nauthor: forged\ngauntlet_version: forged\nmodels: forged\nrepo: forged\nts: forged\ntokens: 999\ncost: 999`,
      { input: 20, output: 3, cacheRead: 40, cacheWrite: 5, cost: 0.5 });
    await h.emit("agent_settled", { aborted: false });
    assert.equal(h.writes.length, 1);
    assert.equal(h.writes[0].path, `team/product/${skill}/20261106T123456Z-observed-session.yaml`);
    assert.deepEqual(h.writes[0].record, {
      skill, session: "observed-session", author: { name: "Observed Author", email: "author@example.test" },
      gauntlet_version: "8.2.1", models: ["test/initial", "test/response", "test/selected"],
      tokens: { input: 30, output: 5, cache_read: 70, cache_write: 9 }, cost: 0.75,
      repo: "team/product", ts: "2026-11-06T12:34:56Z", items: [item],
    });
  });
}

test("shape-ticket includes council member usage once through the run dispatch reducer", async () => {
  const h = harness();
  await h.emit("session_start");
  await h.emit("input", { source: "interactive", text: "/skill:shape-ticket" });
  await h.say("Roasting", { input: 5, output: 2, cost: { total: 0.25 } });
  await h.emit("tool_result", {
    toolName: "subagent", isError: false, content: [], details: { results: [
      { agent: "spec-council-member", model: "test/member-one", exitCode: 0, usage: { input: 10, output: 3, cacheRead: 7, cacheWrite: 1, cost: { total: 0.5 } } },
      { agent: "spec-council-member", model: "test/member-two", exitCode: 1, usage: { input: 20, output: 4, cacheRead: 8, cacheWrite: 2, cost: 0.75 } },
    ] },
  });
  await h.say("gauntlet: done written\n#42: written", { input: 6, output: 1, cost: 0.125 });
  await h.emit("agent_settled", { aborted: false });
  assert.equal(h.writes.length, 1);
  assert.deepEqual(h.writes[0].record.tokens, { input: 41, output: 10, cache_read: 15, cache_write: 3 });
  assert.equal(h.writes[0].record.cost, 1.625);
  assert.deepEqual(h.writes[0].record.models, ["test/initial", "test/response", "test/member-one", "test/member-two"]);
});

for (const [skill, lines, keys] of [
  ["shape-ticket", ["#11: written", "#12: declined", "#13: no-op"], ["#11", "#12", "#13"]],
  ["gatekeep-pr", ["#11@abcd: approved", "#12@dcba: stopped"], ["#11@abcd", "#12@dcba"]],
  ["check-delivery", ["ENG-11: delivered", "ENG-12: declined"], ["ENG-11", "ENG-12"]],
] as const) {
  test(`${skill} batches all settled refs into one cost-conserving record`, async () => {
    const h = harness();
    await h.emit("session_start");
    await h.emit("input", { source: "interactive", text: `/skill:${skill}` });
    await h.say("Assessing the set", { input: 5, cost: 0.25 });
    await h.emit("tool_result", {
      toolName: "subagent", isError: false, content: [], details: { results: [
        { agent: "reviewer", model: "test/child", exitCode: 0, usage: { output: 7, cost: { total: 0.5 } } },
      ] },
    });
    await h.say(`gauntlet: done settled\n${lines.join("\n")}`, { input: 3, output: 2, cost: 0.125 });
    await h.emit("agent_settled", { aborted: false });
    await h.emit("agent_settled", { aborted: false });
    assert.equal(h.writes.length, 1);
    assert.deepEqual(h.writes[0].record.items.map((item: any) => item.key), keys);
    assert.deepEqual(h.writes[0].record.tokens, { input: 8, output: 9, cache_read: 0, cache_write: 0 });
    assert.equal(h.writes[0].record.cost, 0.875);
  });
}

test("settlement items preserve identity, ticket annotations and complete outcome tokens", () => {
  for (const [skill, line, expected] of [
    ["shape-ticket", "team/product#42: close failed (comment: permission denied)", { kind: "ticket", key: "team/product#42", outcome: "close failed (comment: permission denied)" }],
    ["shape-ticket", "Create: a useful title: dropped", { kind: "ticket", outcome: "dropped" }],
    ["shape-ticket", "https://example.test/team/product/issues/42: close by hand", { kind: "ticket", key: "https://example.test/team/product/issues/42", outcome: "close by hand" }],
    ["gatekeep-pr", "#42@abcd: stuck - check: failed (ENG-17)", { kind: "pr", key: "#42@abcd", ticket: "ENG-17", outcome: "stuck - check: failed" }],
    ["gatekeep-pr", "#43@dcba: merged", { kind: "pr", key: "#43@dcba", outcome: "merged" }],
    ["check-delivery", "https://linear.app/team/issue/ENG-17/title: failed - deploy: missing", { kind: "ticket", key: "https://linear.app/team/issue/ENG-17/title", outcome: "failed - deploy: missing" }],
  ] as const) {
    assert.deepEqual(settlementItems(skill, `gauntlet: done settled\n${line}\nworktree: done\n#### #90\nSome prose: written`), [expected]);
  }
});
