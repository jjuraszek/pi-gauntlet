import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, test } from "node:test";
import { parse, stringify } from "yaml";
import type { Deps } from "./telemetry.ts";
import { isolatedGitEnv } from "./test-support/git-env.mjs";
import { resolveTelemetry } from "./lib/gauntlet-settings.ts";

const gitEnv = isolatedGitEnv(mkdtempSync(join(tmpdir(), "telemetry-leg-rounds-env-")));
const originalGitEnv = Object.fromEntries(Object.keys(gitEnv).map(key => [key, process.env[key]]));
Object.assign(process.env, gitEnv);
// vcs.ts snapshots the environment at import time, including publisher subprocess settings.
const { default: registerTelemetry, realFs } = await import("./telemetry.ts");

const originalDepth = process.env.PI_SUBAGENT_DEPTH;
process.env.PI_SUBAGENT_DEPTH = "0";
after(() => {
  for (const [key, value] of Object.entries(originalGitEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  if (originalDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
  else process.env.PI_SUBAGENT_DEPTH = originalDepth;
});

for (const [skill, section, lines] of [
  ["shape-ticket", "tickets", ["#42: written", "team/product#42: no-op", "https://example.test/team/product/issues/42: written"]],
  ["gatekeep-pr", "prs", ["#42@abc123: approved", "https://example.test/team/product/pull/42@def456: merged", "#42@fed321: approved"]],
] as const) {
  test(`${skill} repeats append distinct records and digest chronological rounds`, async () => {
    const root = mkdtempSync(join(tmpdir(), "telemetry-rounds-"));
    const records = new Map<string, string>();
    const handlers = new Map<string, ((event: any, ctx: any) => unknown)[]>();
    let round = 0;
    const timestamps = ["2026-11-06T12:34:56.001Z", "2026-11-06T12:34:56.002Z", "2026-11-06T12:34:56.002Z"];
    const deps: Deps = {
      fs: realFs, now: () => timestamps[round],
      settings: () => ({ telemetry: resolveTelemetry({}), specDirs: [], planDirs: [], errors: [], versions: { "pi-gauntlet": "8.2.1" } }),
      git: async (args) => ({ code: 0, stderr: "", stdout: args[0] === "config" ? "Tester\n" : `${root}\n${root}/.git\n${root}/.git\n` }),
      telemetryRepo: () => "team/product",
      syncTelemetryBranch: (_root, incoming) => {
        for (const [path, bytes] of incoming) records.set(path, bytes);
        return { ok: true, committed: true, pushed: true };
      },
    };
    registerTelemetry({
      on: (name: string, handler: (event: any, ctx: any) => unknown) => handlers.set(name, [...(handlers.get(name) ?? []), handler]),
      sendMessage: () => {},
    } as any, deps);
    const ctx = { cwd: root, sessionManager: { getBranch: () => [], getSessionId: () => round < 2 ? "same-session" : "third-session" } };
    const emit = async (name: string, event: unknown = {}) => {
      for (const handler of handlers.get(name) ?? []) await handler(event, ctx);
    };
    await emit("session_start");
    for (round = 0; round < lines.length; round++) {
      if (round === 2) {
        await emit("before_agent_start", { messageType: "user", prompt: "What is the weather?" });
        await emit("message_end", { message: { role: "assistant", content: [{ type: "text", text: "It is sunny." }] } });
        await emit("agent_settled", { aborted: false });
        assert.equal(records.size, 2, "an unrelated follow-up without settlement writes nothing");
        await emit("session_switch");
        await emit("before_agent_start", { messageType: "user", prompt: "Check that again" });
        await emit("message_end", { message: { role: "assistant", content: [{ type: "text", text: `gauntlet: done settled\n${lines[round]}` }] } });
        await emit("agent_settled", { aborted: false });
        assert.equal(records.size, 2, "session navigation clears the remembered skill");
      }
      if (round === 1) {
        await emit("input", { source: "interactive", text: "Check that again" });
        await emit("before_agent_start", { messageType: "user", prompt: "Check that again" });
      } else {
        await emit("input", { source: "interactive", text: `/skill:${skill}` });
      }
      await emit("message_end", { message: { role: "assistant", content: [{ type: "text", text: `gauntlet: done settled\n${lines[round]}` }], usage: { input: round + 1, cost: 0.25 } } });
      await emit("agent_settled", { aborted: false });
      assert.equal(records.size, round + 1, "repeating in one second must not overwrite an earlier leg");
    }
    assert.deepEqual([...records.values()].map(bytes => parse(bytes).tokens.input), [1, 2, 3], "each leg starts with fresh counters");
    const write = (path: string, bytes: string) => {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, bytes);
    };
    // Reverse file order and repeat the corpus to exercise chronological sorting and identity deduplication.
    for (const [i, bytes] of [...records.values()].reverse().entries()) write(join(root, `round-${i}.yaml`), bytes);
    const first = parse([...records.values()][0]);
    write(join(root, "z-duplicate.yaml"), stringify(first));
    const other = { ...first, repo: "other/product", session: "other-session", items: [{ ...first.items[0], key: "#42" }] };
    write(join(root, "a-other-repo.yaml"), stringify(other));
    write(join(root, "bad-leg.yaml"), stringify({ skill, ts: timestamps[0] }));
    const cli = new URL("../src/bins/gauntlet-performance.mjs", import.meta.url).pathname;
    const invoke = (args: string[], entrypoint = cli) => {
      const result = spawnSync(process.execPath, [entrypoint, "--dir", root, ...args], { encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
      return result.stdout;
    };
    const digest = JSON.parse(invoke(["--dir", root, "--json"]));
    assert.deepEqual(JSON.parse(invoke(["--dir", root, "--json"], new URL("../bin/gauntlet-performance.mjs", import.meta.url).pathname)), digest);
    assert.equal(digest.runs.length, 0, "legs are not brainstorming runs");
    assert.equal(digest[section].length, 2, "repo-local numbers must not merge across repositories");
    const group = digest[section].find((row: any) => row.repo === "team/product");
    assert.equal(group.key, "team/product#42");
    assert.equal(group.rounds.length, 3, "a different head or session is another round of the same ref");
    assert.deepEqual(group.rounds.map((r: any) => [r.session, r.ts, r.items[0].outcome]), [
      ["same-session", timestamps[0], skill === "shape-ticket" ? "written" : "approved"],
      ["same-session", timestamps[1], skill === "shape-ticket" ? "no-op" : "merged"],
      ["third-session", timestamps[2], skill === "shape-ticket" ? "written" : "approved"],
    ]);
    assert.equal(digest.skipped.filter((s: any) => s.reason === "not a leg record").length, 2);
    assert.match(invoke([]), new RegExp(`${section}\\n[\\s\\S]*team/product#42\\s+3`));
    assert.deepEqual(JSON.parse(invoke(["--since", "8.2.2", "--json"]))[section], []);
  });
}
