import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import registerPhaseTracker from "./phase-tracker.ts";

const tempDirs: string[] = [];
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

const tempCwd = (settings?: unknown) => {
  const dir = mkdtempSync(join(tmpdir(), "phase-tracker-test-"));
  tempDirs.push(dir);
  if (settings !== undefined) {
    mkdirSync(join(dir, ".pi"), { recursive: true });
    writeFileSync(join(dir, ".pi", "settings.json"), JSON.stringify(settings));
  }
  return dir;
};

const PHASES = ["brainstorm", "plan", "implement", "verify", "ship"] as const;
type Phase = (typeof PHASES)[number];
type Status = "pending" | "in_progress" | "complete" | "skipped";

const phases = (overrides: Partial<Record<Phase, Status>> = {}) =>
  Object.fromEntries(PHASES.map((phase) => [phase, { status: overrides[phase] ?? "pending" }])) as Record<
    Phase,
    { status: Status }
  >;

const phaseResult = (action: string, state: Record<Phase, { status: Status }>) => ({
  type: "message",
  message: { role: "toolResult", toolName: "phase_tracker", details: { action, phases: state } },
});

const assistant = (stopReason = "stop") => ({ type: "message", message: { role: "assistant", stopReason } });

const enteredBranch = (state: Record<Phase, { status: Status }>, extra: unknown[] = []) => [
  phaseResult("start", phases({ brainstorm: "in_progress" })),
  phaseResult("complete", state),
  ...extra,
];

const resumedBranch = (rest: Partial<Record<Phase, Status>>) => [
  phaseResult("start", phases({ brainstorm: "in_progress" })),
  phaseResult("skip", phases({ brainstorm: "skipped" })),
  phaseResult("start", phases({ brainstorm: "skipped", plan: "in_progress" })),
  phaseResult("complete", phases({ brainstorm: "skipped", ...rest })),
];

function harness(options: { cwd?: string; branch?: unknown[]; idle?: boolean; beforeSettled?: (setIdle: (idle: boolean) => void) => void; sendThrows?: boolean } = {}) {
  const handlers = new Map<string, ((event: unknown, ctx: unknown) => unknown)[]>();
  const tools: { name: string; execute: (...args: any[]) => unknown }[] = [];
  const sent: { message: any; options: any }[] = [];
  let idle = options.idle ?? true;
  const ctx = {
    cwd: options.cwd ?? tempCwd(),
    hasUI: false,
    isIdle: () => idle,
    sessionManager: { getBranch: () => options.branch ?? [] },
  };
  const pi = {
    on(event: string, handler: (event: unknown, context: unknown) => unknown) {
      const registered = handlers.get(event) ?? [];
      registered.push(handler);
      handlers.set(event, registered);
    },
    registerTool(tool: { name: string; execute: (...args: any[]) => unknown }) {
      tools.push(tool);
    },
    sendMessage(message: unknown, sendOptions: unknown) {
      sent.push({ message, options: sendOptions });
      if (options.sendThrows) throw new Error("send failed");
    },
  };
  if (options.beforeSettled) pi.on("agent_settled", () => options.beforeSettled!(next => (idle = next)));
  registerPhaseTracker(pi as any);
  const emit = async (event: string) => {
    for (const handler of handlers.get(event) ?? []) await handler({ type: event }, ctx);
  };
  const emitEvent = async (name: string, event: unknown) => {
    const results: unknown[] = [];
    for (const handler of handlers.get(name) ?? []) results.push(await handler(event, ctx));
    return results;
  };
  return { emit, emitEvent, sent, tools, ctx, setIdle: (next: boolean) => (idle = next) };
}

const settle = async (h: ReturnType<typeof harness>) => {
  await h.emit("session_start");
  await h.emit("agent_settled");
};

test("agent_settled nudges each exact edge with persisted details", async () => {
  for (const [state, edge, skill] of [
    [phases({ brainstorm: "complete", plan: "complete" }), "plan-implement", "/skill:subagent-driven-development"],
    [
      phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete" }),
      "verify-ship",
      "/skill:finishing-a-development-branch",
    ],
  ] as const) {
    const h = harness({ branch: enteredBranch(state, [assistant()]) });
    await settle(h);
    assert.equal(h.sent.length, 1);
    assert.deepEqual(h.sent[0].options, { triggerTurn: true });
    assert.equal(h.sent[0].message.customType, "pi-gauntlet-transition-recovery");
    assert.equal(h.sent[0].message.display, true);
    assert.deepEqual(h.sent[0].message.details, { piGauntletRecoveryEdge: edge });
    assert.match(h.sent[0].message.content, new RegExp(skill.replace(/[/-]/g, "\\$&")));
  }
});

test("repeated settlement and persisted matching recovery details suppress a second nudge", async () => {
  const state = phases({ brainstorm: "complete", plan: "complete" });
  const h = harness({ branch: enteredBranch(state, [assistant()]) });
  await settle(h);
  await h.emit("agent_settled");
  assert.equal(h.sent.length, 1);

  const restored = harness({
    branch: enteredBranch(state, [
      { type: "custom_message", customType: "pi-gauntlet-transition-recovery", details: { piGauntletRecoveryEdge: "plan-implement" } },
      assistant(),
    ]),
  });
  await settle(restored);
  assert.equal(restored.sent.length, 0);
});

test("foreign or malformed custom-message details do not suppress recovery", async () => {
  const state = phases({ brainstorm: "complete", plan: "complete" });
  for (const entry of [
    { type: "custom_message", customType: "other", details: { piGauntletRecoveryEdge: "plan-implement" } },
    { type: "custom_message", customType: "pi-gauntlet-transition-recovery", details: null },
    { type: "custom_message", customType: "pi-gauntlet-transition-recovery", details: { piGauntletRecoveryEdge: "nope" } },
  ]) {
    const h = harness({ branch: enteredBranch(state, [entry, assistant()]) });
    await settle(h);
    assert.equal(h.sent.length, 1);
  }
});

test("only brainstorming-entered, non-aborted settled flows recover", async () => {
  const state = phases({ brainstorm: "complete", plan: "complete" });
  const cold = harness({ branch: [phaseResult("complete", state), assistant()] });
  await settle(cold);
  assert.equal(cold.sent.length, 0);

  const branch = enteredBranch(state, [assistant("aborted")]);
  const aborted = harness({ branch });
  await settle(aborted);
  assert.equal(aborted.sent.length, 0);
  branch.push(assistant());
  await aborted.emit("agent_settled");
  assert.equal(aborted.sent.length, 1);
});

test("active phases, non-idleness, and earlier competing handlers do not spend recovery", async () => {
  for (const phase of PHASES) {
    const h = harness({ branch: enteredBranch(phases({ brainstorm: phase === "brainstorm" ? "in_progress" : "complete", plan: phase === "plan" ? "in_progress" : "complete", implement: phase === "implement" ? "in_progress" : "pending", verify: phase === "verify" ? "in_progress" : "pending", ship: phase === "ship" ? "in_progress" : "pending" }), [assistant()]) });
    await settle(h);
    assert.equal(h.sent.length, 0, phase);
  }

  const state = phases({ brainstorm: "complete", plan: "complete" });
  const notIdle = harness({ branch: enteredBranch(state, [assistant()]), idle: false });
  await settle(notIdle);
  notIdle.setIdle(true);
  await notIdle.emit("agent_settled");
  assert.equal(notIdle.sent.length, 1);

  const ordered = harness({
    branch: enteredBranch(state, [assistant()]),
    beforeSettled: setIdle => setIdle(false),
  });
  await settle(ordered);
  assert.equal(ordered.sent.length, 0);
});

test("a throwing send spends the in-memory edge", async () => {
  const h = harness({ branch: enteredBranch(phases({ brainstorm: "complete", plan: "complete" }), [assistant()]), sendThrows: true });
  await h.emit("session_start");
  await assert.rejects(h.emit("agent_settled"), /send failed/);
  await h.emit("agent_settled");
  assert.equal(h.sent.length, 1);
});

const writeCall = (id: string, path: string) => ({ toolName: "write", toolCallId: id, input: { path } });
const writeResult = (id: string) => ({ toolName: "write", toolCallId: id, content: [{ type: "text", text: "ok" }] });

test("implement-write guard: warns once on parent write outside exempt dirs, exempt paths silent", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH; // isolate from an ambient subagent depth in the test-runner's own process
  try {
    const h = harness({ cwd: tempCwd(), branch: resumedBranch({ plan: "complete", implement: "in_progress" }) });
    await h.emit("session_start");
    await h.emitEvent("tool_call", writeCall("t1", "doc/specs/x.md"));
    assert.equal((await h.emitEvent("tool_result", writeResult("t1")))[0], undefined); // spec dir exempt
    await h.emitEvent("tool_call", writeCall("t2", "doc/plans/x.md"));
    assert.equal((await h.emitEvent("tool_result", writeResult("t2")))[0], undefined); // plans dir exempt
    await h.emitEvent("tool_call", writeCall("t3", "src/x.ts"));
    const warned = (await h.emitEvent("tool_result", writeResult("t3")))[0] as { content: { text: string }[] };
    assert.match(warned.content[0].text, /implement/);
    assert.match(warned.content[0].text, /subagent-driven-development/);
    assert.match(warned.content[0].text, /merge-conflict/);
    await h.emitEvent("tool_call", writeCall("t4", "src/y.ts"));
    assert.equal((await h.emitEvent("tool_result", writeResult("t4")))[0], undefined); // warn-once
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("implement-write guard: fires in the armed post-plan gap (plan complete, implement pending)", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH;
  try {
    const h = harness({ cwd: tempCwd(), branch: resumedBranch({ plan: "complete" }) });
    await h.emit("session_start");
    await h.emitEvent("tool_call", writeCall("t1", "src/x.ts"));
    const warned = (await h.emitEvent("tool_result", writeResult("t1")))[0] as { content: { text: string }[] };
    assert.match(warned.content[0].text, /implement/);
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("implement-write guard: silent when unarmed, when enforce is false, and in subagent children", async () => {
  const cold = harness({ cwd: tempCwd(), branch: [phaseResult("complete", phases({ plan: "complete", implement: "in_progress" }))] });
  await cold.emit("session_start");
  await cold.emitEvent("tool_call", writeCall("t1", "src/x.ts"));
  assert.equal((await cold.emitEvent("tool_result", writeResult("t1")))[0], undefined);

  const off = harness({
    cwd: tempCwd({ piGauntlet: { flowGuards: { enforce: false } } }),
    branch: resumedBranch({ plan: "complete", implement: "in_progress" }),
  });
  await off.emit("session_start");
  await off.emitEvent("tool_call", writeCall("t1", "src/x.ts"));
  assert.equal((await off.emitEvent("tool_result", writeResult("t1")))[0], undefined);

  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  process.env.PI_SUBAGENT_DEPTH = "1";
  try {
    const child = harness({ cwd: tempCwd(), branch: resumedBranch({ plan: "complete", implement: "in_progress" }) });
    await child.emit("session_start");
    await child.emitEvent("tool_call", writeCall("t1", "src/x.ts"));
    assert.equal((await child.emitEvent("tool_result", writeResult("t1")))[0], undefined);
  } finally {
    if (priorDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
    else process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("brainstorm write guard is unchanged by the implement guard", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH;
  try {
    const h = harness({ cwd: tempCwd(), branch: [phaseResult("start", phases({ brainstorm: "in_progress" }))] });
    await h.emit("session_start");
    await h.emitEvent("tool_call", writeCall("t1", "src/x.ts"));
    const warned = (await h.emitEvent("tool_result", writeResult("t1")))[0] as { content: { text: string }[] };
    assert.match(warned.content[0].text, /brainstorm/);
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("resumed session: plan-implement recovery edge fires (AC 3)", async () => {
  const h = harness({ cwd: tempCwd(), branch: [...resumedBranch({ plan: "complete" }), assistant()] });
  await settle(h);
  assert.equal(h.sent.length, 1);
  assert.deepEqual(h.sent[0].message.details, { piGauntletRecoveryEdge: "plan-implement" });
});

test("resumed session: closure gate blocks complete verify without a conformance dispatch (AC 3)", async () => {
  const h = harness({
    cwd: tempCwd(),
    branch: resumedBranch({ plan: "complete", implement: "complete", verify: "in_progress" }),
  });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await tool.execute("t1", { action: "complete", phase: "verify" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.equal(res.details.error, "no conformance-reviewer dispatch observed");
});

const subagentResult = (agents: string[]) => ({
  type: "message",
  message: {
    role: "toolResult",
    toolName: "subagent",
    details: { results: agents.map((agent) => ({ agent, exitCode: 0 })) },
  },
});

const implementBranch = (extra: unknown[] = []) => [
  phaseResult("start", phases({ brainstorm: "in_progress" })),
  phaseResult("complete", phases({ brainstorm: "complete" })),
  phaseResult("start", phases({ brainstorm: "complete", plan: "in_progress" })),
  phaseResult("complete", phases({ brainstorm: "complete", plan: "complete" })),
  phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "in_progress" })),
  ...extra,
];

const commitCall = (id: string) => ({
  toolName: "bash",
  toolCallId: id,
  input: { command: "git commit -m 'integrate wave'" },
});
const commitResult = (id: string) => ({
  toolName: "bash",
  toolCallId: id,
  isError: false,
  content: [{ type: "text", text: "ok" }],
});

test("implement-phase commit with implementer newer than both reviewers warns", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH; // isolate from an ambient subagent depth in the test-runner's own process
  try {
    const h = harness({ branch: implementBranch([subagentResult(["implementer"])]) });
    await h.emit("session_start");
    await h.emitEvent("tool_call", commitCall("c1"));
    const warned = (await h.emitEvent("tool_result", commitResult("c1")))[0] as { content: { text: string }[] };
    assert.match(warned.content[0].text, /no spec-reviewer or code-reviewer observed/);
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("cadence guard silent in subagent children", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  process.env.PI_SUBAGENT_DEPTH = "1";
  try {
    const branch = implementBranch([subagentResult(["implementer"])]);
    const h = harness({ branch });
    await h.emit("session_start");
    await h.emitEvent("tool_call", commitCall("c1"));
    assert.equal((await h.emitEvent("tool_result", commitResult("c1")))[0], undefined);
  } finally {
    if (priorDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
    else process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("fresh SR and CR after the implementer keep the commit silent", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH;
  try {
    const h = harness({
      branch: implementBranch([
        subagentResult(["implementer"]),
        subagentResult(["spec-reviewer"]),
        subagentResult(["code-reviewer"]),
      ]),
    });
    await h.emit("session_start");
    await h.emitEvent("tool_call", commitCall("c1"));
    assert.equal((await h.emitEvent("tool_result", commitResult("c1")))[0], undefined);
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("AND-logic: fresh SR with stale CR stays silent (doc-only wave shape)", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH;
  try {
    const h = harness({
      branch: implementBranch([subagentResult(["implementer"]), subagentResult(["spec-reviewer"])]),
    });
    await h.emit("session_start");
    await h.emitEvent("tool_call", commitCall("c1"));
    assert.equal((await h.emitEvent("tool_result", commitResult("c1")))[0], undefined);
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("fused implementer+reviewer results in one dispatch stay silent", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH;
  try {
    const h = harness({
      branch: implementBranch([subagentResult(["implementer", "spec-reviewer", "code-reviewer"])]),
    });
    await h.emit("session_start");
    await h.emitEvent("tool_call", commitCall("c1"));
    assert.equal((await h.emitEvent("tool_result", commitResult("c1")))[0], undefined);
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("no implementer observed: commit stays silent", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH;
  try {
    const h = harness({ branch: implementBranch() });
    await h.emit("session_start");
    await h.emitEvent("tool_call", commitCall("c1"));
    assert.equal((await h.emitEvent("tool_result", commitResult("c1")))[0], undefined);
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("guard silent outside implement and when flowGuards.enforce is false", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH;
  try {
    const planOnly = harness({
      branch: [
        phaseResult("start", phases({ brainstorm: "in_progress" })),
        phaseResult("complete", phases({ brainstorm: "complete" })),
        phaseResult("start", phases({ brainstorm: "complete", plan: "in_progress" })),
        subagentResult(["implementer"]),
      ],
    });
    await planOnly.emit("session_start");
    await planOnly.emitEvent("tool_call", commitCall("c1"));
    assert.equal((await planOnly.emitEvent("tool_result", commitResult("c1")))[0], undefined);

    const off = harness({
      cwd: tempCwd({ piGauntlet: { flowGuards: { enforce: false } } }),
      branch: implementBranch([subagentResult(["implementer"])]),
    });
    await off.emit("session_start");
    await off.emitEvent("tool_call", commitCall("c1"));
    assert.equal((await off.emitEvent("tool_result", commitResult("c1")))[0], undefined);
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("live tool_result observation updates the ledger", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH;
  try {
    const h = harness({ branch: implementBranch([subagentResult(["implementer"])]) });
    await h.emit("session_start");
    await h.emitEvent("tool_result", {
      toolName: "subagent",
      toolCallId: "s1",
      content: [],
      details: { results: [{ agent: "spec-reviewer", exitCode: 0 }, { agent: "code-reviewer", exitCode: 0 }] },
    });
    await h.emitEvent("tool_call", commitCall("c1"));
    assert.equal((await h.emitEvent("tool_result", commitResult("c1")))[0], undefined);
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});

test("second implementer after reviews re-arms the warning", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH;
  try {
    const h = harness({
      branch: implementBranch([
        subagentResult(["implementer"]),
        subagentResult(["spec-reviewer"]),
        subagentResult(["code-reviewer"]),
        subagentResult(["implementer"]),
      ]),
    });
    await h.emit("session_start");
    await h.emitEvent("tool_call", commitCall("c1"));
    const warned = (await h.emitEvent("tool_result", commitResult("c1")))[0] as { content: { text: string }[] };
    assert.match(warned.content[0].text, /no spec-reviewer or code-reviewer observed/);
  } finally {
    if (priorDepth !== undefined) process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
});
