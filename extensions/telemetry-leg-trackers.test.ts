import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "yaml";
import registerTelemetry, { type Deps } from "./telemetry.ts";
import { resolveTelemetry } from "./lib/gauntlet-settings.ts";
import type { LegRecord } from "./lib/telemetry-leg.ts";

const originalDepth = process.env.PI_SUBAGENT_DEPTH;
process.env.PI_SUBAGENT_DEPTH = "0";
after(() => {
  if (originalDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
  else process.env.PI_SUBAGENT_DEPTH = originalDepth;
});

const root = mkdtempSync(join(tmpdir(), "telemetry-trackers-"));
const overrides = (tracker: string) => `# Project overrides\n\n## Issue tracker\n\n- tracker: ${tracker}\n- refs: prose, not a regular expression\n\n## Other settings\n- tracker: none\n`;

async function settle(skill: string, rows: string[], files: Record<string, string>) {
  const handlers = new Map<string, ((event: any, ctx: any) => unknown)[]>();
  const publications = new Map<string, string>();
  const warnings: unknown[] = [];
  const forbiddenCalls: unknown[] = [];
  const forbidden = (...args: unknown[]): never => {
    forbiddenCalls.push(args);
    throw new Error("telemetry must not call a tracker or write to the checkout");
  };
  const deps: Deps = {
    fs: {
      readFile: (path) => files[path], exists: (path) => path in files,
      writeFile: forbidden, rename: forbidden, mkdirp: forbidden, unlink: forbidden,
    },
    now: () => "2026-11-06T12:34:56Z",
    settings: () => ({ telemetry: resolveTelemetry({}), specDirs: [], planDirs: [], errors: [], versions: { "pi-gauntlet": "8.2.1" } }),
    git: async (args, cwd) => {
      assert.equal(cwd, root);
      if (args[0] === "rev-parse") return { code: 0, stdout: `${root}\n${root}/.git\n${root}/.git\n`, stderr: "" };
      if (args[0] === "config" && args.length === 2 && ["user.name", "user.email"].includes(args[1])) {
        return { code: 0, stdout: "Tester\n", stderr: "" };
      }
      return forbidden(args);
    },
    telemetryRepo: () => "team/product",
    syncTelemetryBranch: (cwd, incoming) => {
      assert.equal(cwd, root);
      for (const [path, bytes] of incoming) {
        assert.equal(publications.has(path), false, "one publication per settlement");
        publications.set(path, bytes);
      }
      return { ok: true, committed: true, pushed: true };
    },
  };
  registerTelemetry({
    on: (name: string, handler: (event: any, ctx: any) => unknown) => handlers.set(name, [...(handlers.get(name) ?? []), handler]),
    exec: forbidden,
    sendMessage: (message: unknown) => warnings.push(message),
  } as any, deps);
  const ctx = { cwd: root, sessionManager: { getBranch: () => [], getSessionId: () => "tracker-session" } };
  const emit = async (name: string, event: unknown = {}) => {
    for (const handler of handlers.get(name) ?? []) await handler(event, ctx);
  };
  await emit("session_start");
  await emit("input", { source: "interactive", text: `/skill:${skill} ${rows.join("\n")}` });
  await emit("message_end", { message: {
    role: "assistant", provider: "fixture", model: "model", usage: { input: 12, output: 4, cost: 0.125 },
    content: [{ type: "text", text: ["gauntlet: done settled", ...rows, "worktree: done", "#### heading: written", "Closing prose."].join("\n") }],
  } });
  assert.equal(publications.size, 0);
  await emit("agent_settled", { aborted: false });
  await emit("agent_settled", { aborted: false });
  assert.deepEqual(forbiddenCalls, [], "tracker commands and non-telemetry writes are forbidden");
  assert.deepEqual(warnings, []);
  return [...publications].map(([path, bytes]) => ({ path, record: parse(bytes) as LegRecord }));
}

for (const [skill, outcome] of [["shape-ticket", "written"], ["gatekeep-pr", "approved"], ["check-delivery", "delivered"]] as const) {
  test(`${skill} differs only in item refs across GitHub, Linear and no tracker`, async () => {
    let baseline: unknown;
    for (const [tracker, ref] of [["github", "#42"], ["linear", "OPS-42"], ["none", "local/backlog: rollout 7"]]) {
      const pr = skill === "gatekeep-pr";
      const key = pr ? "#9@abc123" : ref;
      const row = `${key}: ${outcome}${pr ? ` (${ref})` : ""}`;
      const records = await settle(skill, [row], { [`${root}/.pi/gauntlet-overrides.md`]: overrides(tracker) });
      assert.equal(records.length, 1, `${tracker} must publish the leg`);
      const { record } = records[0];
      assert.deepEqual(record.items, [{ kind: pr ? "pr" : "ticket", key, ...(pr ? { ticket: ref } : {}), outcome }]);
      assert.equal(record.cost, 0.125);
      assert.equal(record.tokens.input, 12);
      const normalized = { ...records[0], record: { ...record, items: record.items.map(({ key, ticket, ...item }) => item) } };
      if (baseline) assert.deepEqual(normalized, baseline, "tracker selection must not alter measured fields or record path");
      else baseline = normalized;
    }
  });
}

for (const [name, files, acceptsTypedRef] of [
  ["root fallback", { "gauntlet-overrides.md": overrides("none") }, true],
  ["doc fallback", { "doc/gauntlet-overrides.md": overrides("none") }, true],
  ["first file wins", { ".pi/gauntlet-overrides.md": overrides("github"), "gauntlet-overrides.md": overrides("none") }, false],
  ["first file lacks tracker section", { ".pi/gauntlet-overrides.md": "## Other settings\n- tracker: none\n", "doc/gauntlet-overrides.md": overrides("none") }, false],
  ["no overrides", {}, false],
] as const) {
  test(`tracker selection: ${name}`, async () => {
    const records = await settle("check-delivery", ["#42: delivered", "local/backlog: rollout 7: delivered"],
      Object.fromEntries(Object.entries(files).map(([path, content]) => [`${root}/${path}`, content])));
    assert.equal(records.length, 1);
    assert.deepEqual(records[0].record.items, [
      { kind: "ticket", key: "#42", outcome: "delivered" },
      ...(acceptsTypedRef ? [{ kind: "ticket", key: "local/backlog: rollout 7", outcome: "delivered" }] : []),
    ]);
  });
}
