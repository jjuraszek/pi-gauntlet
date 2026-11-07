import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { parse } from "yaml";
import { isolatedGitEnv } from "./test-support/git-env.mjs";
import { resolveTelemetry } from "./lib/gauntlet-settings.ts";
import type { ReadToolCallEvent } from "@earendil-works/pi-coding-agent";

const gitEnv = isolatedGitEnv(mkdtempSync(join(tmpdir(), "telemetry-leg-env-")));
const originalGitEnv = Object.fromEntries(Object.keys(gitEnv).map(key => [key, process.env[key]]));
Object.assign(process.env, gitEnv);
// vcs.ts snapshots the environment at import time, including publisher subprocess settings.
const { default: registerTelemetry, realDeps } = await import("./telemetry.ts");
const { registerLegTelemetry } = await import("./lib/telemetry-leg.ts");

const ref = "refs/telemetry/records";
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

for (const skill of ["shape-ticket", "gatekeep-pr", "check-delivery"] as const) {
  test(`${skill} read tool_call opens a leg before any tool_result`, async () => {
    const handlers = new Map<string, (event: unknown, ctx: unknown) => unknown>();
    const live = registerLegTelemetry({
      on: (name: string, handler: (event: unknown, ctx: unknown) => unknown) => handlers.set(name, handler),
    } as any, {
      ...realDeps,
      now: () => "2026-11-06T12:34:56Z",
      settings: () => ({ telemetry: resolveTelemetry({}), specDirs: [], planDirs: [], errors: [], versions: {} }),
    }, () => false);
    const ctx = { cwd: tmpdir(), sessionManager: { getSessionId: () => `session-${skill}` } };
    const event: ReadToolCallEvent = {
      type: "tool_call", toolCallId: "load-skill", toolName: "read",
      input: { path: `/package/skills/${skill}/SKILL.md` },
    };
    assert.equal(live(), undefined);
    await handlers.get("tool_call")!(event, ctx);
    assert.ok(live(), "the read call must open the accumulator without waiting for a result");
  });
}

// Real plumbing stays local: origin's portable identity is rewritten to a scratch bare repo.
function harness(skill: string) {
  const scratch = mkdtempSync(join(tmpdir(), "telemetry-leg-"));
  const root = join(scratch, "product");
  const origin = join(scratch, "origin.git");
  mkdirSync(root);
  const git = (cwd: string, ...args: string[]) => execFileSync("git", ["-C", cwd, "-c", "commit.gpgsign=false", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git(scratch, "init", "--bare", origin);
  git(root, "init", "-b", "feature/example");
  git(root, "config", "user.name", "Leg Tester");
  git(root, "config", "user.email", "leg@example.test");
  git(root, "remote", "add", "origin", "https://example.test/team/product.git");
  git(root, "config", `url.${origin}.insteadOf`, "https://example.test/team/product.git");
  writeFileSync(join(root, "file.txt"), "base\n");
  git(root, "add", "file.txt");
  git(root, "commit", "-m", "initial");
  writeFileSync(join(root, "file.txt"), "staged user change\n");
  git(root, "add", "file.txt");
  writeFileSync(join(root, "file.txt"), "unstaged user change\n");
  const head = git(root, "rev-parse", "HEAD");
  const index = readFileSync(join(root, ".git/index"));
  const handlers = new Map<string, ((event: any, ctx: any) => unknown)[]>();
  const messages: unknown[] = [];
  const ctx = { cwd: root, sessionManager: { getBranch: () => [], getSessionId: () => `session-${skill}` } };
  registerTelemetry({
    on: (name: string, handler: (event: any, ctx: any) => unknown) => handlers.set(name, [...(handlers.get(name) ?? []), handler]),
    sendMessage: (message: unknown) => messages.push(message),
  } as any, {
    ...realDeps,
    now: () => "2026-11-06T12:34:56Z",
    settings: () => ({ telemetry: resolveTelemetry({}), specDirs: [], planDirs: [], errors: [], versions: { "pi-gauntlet": "8.2.1" } }),
  });
  const emit = async (name: string, event: unknown = {}) => {
    for (const handler of handlers.get(name) ?? []) await handler(event, ctx);
  };
  const say = (text: string) => emit("message_end", { message: { role: "assistant", content: [{ type: "text", text }] } });
  const hasRecord = () => spawnSync("git", ["-C", origin, "rev-parse", "--verify", ref], { stdio: "ignore" }).status === 0;
  return { root, origin, git, head, index, emit, say, hasRecord, messages };
}

for (const [skill, outcome, activation, empty] of [
  ["shape-ticket", "created", "input"],
  ["gatekeep-pr", "approved", "expanded"],
  ["check-delivery", "delivered", "read"],
  ["gatekeep-pr", "stopped", "input"],
  ["shape-ticket", "written", "input", true],
] as const) {
  test(`${skill} ${outcome}${empty ? " with no items" : ""} seals one session leg only after the final settlement and follow-on work`, async () => {
    const marker = outcome === "stopped" ? "stuck" : "done";
    const h = harness(skill);
    const localHeads = h.git(h.root, "show-ref", "--heads");
    await h.emit("session_start");
    // Terminal-looking text outside a selected skill is not a leg.
    await h.say(`gauntlet: done ${outcome}\n#42: ${outcome}`);
    await h.emit("agent_settled", { aborted: false });
    assert.equal(h.hasRecord(), false);
    if (activation === "input") await h.emit("input", { text: `/skill:${skill} create a ticket`, source: "interactive" });
    if (activation === "expanded") await h.emit("before_agent_start", { messageType: "user", prompt: `<skill name="${skill}" location="/package/skills/${skill}/SKILL.md">\nInstructions\n</skill>\n\n#42` });
    if (activation === "read") await h.emit("tool_call", { type: "tool_call", toolName: "read", toolCallId: "load-skill", input: { path: `/package/skills/${skill}/SKILL.md` } });
    await h.say("gauntlet: gate approval\n1. Approve\n2. Decline");
    await h.emit("agent_settled", { aborted: false });
    assert.equal(h.hasRecord(), false, "human gate is not completion");
    await h.say(`gauntlet: done ${outcome}\n#42: ${outcome}`);
    await h.emit("agent_end");
    assert.equal(h.hasRecord(), false, "agent_end can precede follow-on work");
    await h.emit("tool_call", { toolName: "bash", toolCallId: "follow-on", input: { command: "write approved result" } });
    await h.emit("tool_result", { toolName: "bash", toolCallId: "follow-on", input: {}, isError: false, content: [] });
    await h.say("Follow-on assessment is still running.");
    await h.emit("agent_settled", { aborted: false });
    assert.equal(h.hasRecord(), false, "an earlier terminal message cannot settle follow-on work");
    await h.say(`gauntlet: ${marker} ${outcome}\n#42: ${outcome}`);
    await h.emit("agent_settled", { aborted: true });
    assert.equal(h.hasRecord(), false, "aborting is not a terminal settlement");
    await h.emit("message_end", { message: {
      role: "assistant", content: [{ type: "text", text: `gauntlet: ${marker} ${outcome}${empty ? "\nworktree: done\nNo settled items." : `\n#42: ${outcome}`}` }],
      usage: { input: 12, output: 4, cost: 0.125 },
    } });
    await h.emit("agent_settled", { aborted: false });
    assert.equal(h.hasRecord(), true, "final settlement must push a leg record even without items");
    const path = `team/product/${skill}/20261106T123456Z-session-${skill}.yaml`;
    assert.equal(h.git(h.origin, "ls-tree", "-r", "--name-only", ref), path);
    const record = parse(h.git(h.origin, "show", `${ref}:${path}`));
    assert.equal(record.skill, skill);
    assert.equal(record.session, `session-${skill}`);
    assert.equal(record.repo, "team/product");
    assert.equal(record.ts, "2026-11-06T12:34:56Z");
    assert.deepEqual(record.items, empty ? [] : [{ kind: skill === "gatekeep-pr" ? "pr" : "ticket", key: "#42", outcome }]);
    assert.equal(record.cost, 0.125);
    assert.equal(record.tokens.input, 12);
    const tip = h.git(h.origin, "rev-parse", ref);
    await h.emit("agent_settled", { aborted: false });
    await h.say(`gauntlet: done settled\n#43: ${outcome}`);
    await h.emit("agent_settled", { aborted: false });
    await h.emit("session_shutdown");
    assert.equal(h.git(h.origin, "rev-parse", ref), tip, "duplicate lifecycle events do not append records");
    assert.equal(h.git(h.root, "rev-parse", "HEAD"), h.head);
    assert.deepEqual(readFileSync(join(h.root, ".git/index")), h.index);
    assert.equal(readFileSync(join(h.root, "file.txt"), "utf8"), "unstaged user change\n");
    assert.equal(h.git(h.root, "rev-parse", ref), tip);
    assert.equal(h.git(h.root, "show-ref", "--heads"), localHeads, "settlement must not create a local branch");
    assert.equal(h.git(h.root, "ls-remote", "--heads", "origin"), "", "settlement must not create a remote branch");
    assert.equal(h.git(h.root, "ls-remote", "origin", "refs/telemetry/*"), `${tip}\t${ref}`);
  });
}
