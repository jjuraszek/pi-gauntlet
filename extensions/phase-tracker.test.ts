import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { isAbsolute, join } from "node:path";
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
  let branch = options.branch ?? [];
  const ctx = {
    cwd: options.cwd ?? tempCwd(),
    hasUI: false,
    isIdle: () => idle,
    sessionManager: { getBranch: () => branch },
  };
  const pi = {
    on(event: string, handler: (event: unknown, context: unknown) => unknown) {
      const registered = handlers.get(event) ?? [];
      registered.push(handler);
      handlers.set(event, registered);
    },
    registerTool(tool: { name: string; executionMode?: string; execute: (...args: any[]) => unknown }) {
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
  return { emit, emitEvent, sent, tools, ctx, setIdle: (next: boolean) => (idle = next), setBranch: (next: unknown[]) => (branch = next) };
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

test("restarting implement clears a resumed conformance dispatch latch", async () => {
  const h = harness({
    cwd: tempCwd({ piGauntlet: { flowGuards: { enforce: false }, closureReview: { enforce: true } } }),
    branch: [
      ...resumedBranch({ plan: "complete", implement: "complete", verify: "complete", ship: "in_progress" }),
      subagentResult(["conformance-reviewer"]),
    ],
  });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "phase_tracker")!;
  await tool.execute("t1", { action: "skip", phase: "ship", reason: "amendment reopened Task 1" }, undefined, undefined, h.ctx);
  await tool.execute("t2", { action: "start", phase: "implement", force: true }, undefined, undefined, h.ctx);
  await tool.execute("t3", { action: "skip", phase: "implement", reason: "amendment implementation tested separately" }, undefined, undefined, h.ctx);
  await tool.execute("t4", { action: "start", phase: "verify", force: true }, undefined, undefined, h.ctx);
  const res = (await tool.execute("t5", { action: "complete", phase: "verify" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.equal(res.details.error, "no conformance-reviewer dispatch observed");
});

test("replayed implement restart clears a persisted conformance dispatch latch", async () => {
  const h = harness({
    cwd: tempCwd({ piGauntlet: { flowGuards: { enforce: false }, closureReview: { enforce: true } } }),
    branch: [
      ...resumedBranch({ plan: "complete", implement: "complete", verify: "complete", ship: "in_progress" }),
      subagentResult(["conformance-reviewer"]),
      phaseResult("skip", phases({ brainstorm: "skipped", plan: "complete", implement: "complete", verify: "complete", ship: "skipped" })),
      phaseResult("start", phases({ brainstorm: "skipped", plan: "complete", implement: "in_progress", verify: "complete", ship: "skipped" })),
      phaseResult("skip", phases({ brainstorm: "skipped", plan: "complete", implement: "skipped", verify: "complete", ship: "skipped" })),
      phaseResult("start", phases({ brainstorm: "skipped", plan: "complete", implement: "skipped", verify: "in_progress", ship: "skipped" })),
    ],
  });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await tool.execute("t1", { action: "complete", phase: "verify" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.equal(res.details.error, "no conformance-reviewer dispatch observed");
});

const taskSnapshot = (tasks: { name: string; status: string }[], isError = false) => ({
  type: "message",
  message: { role: "toolResult", toolName: "plan_tracker", isError, details: { tasks } },
});

const completePhase = async (h: ReturnType<typeof harness>, phase: "implement" | "verify") => {
  const tool = h.tools.find((t) => t.name === "phase_tracker")!;
  return (await tool.execute("complete", { action: "complete", phase }, undefined, undefined, h.ctx)) as {
    content: { text: string }[];
    details: { error?: string; phases: Record<Phase, { status: string }> };
  };
};

test("phase_tracker registration requests sequential execution", () => {
  const h = harness();
  assert.equal(h.tools.find((t) => t.name === "phase_tracker")!.executionMode, "sequential");
});

test("all-complete plan activity auto-completes an active implement phase", async () => {
  const h = harness({ branch: implementBranch() });
  await h.emit("session_start");
  await h.emitEvent("tool_execution_end", {
    toolName: "plan_tracker",
    isError: false,
    result: { details: { tasks: [{ status: "complete" }, { status: "complete" }] } },
  });
  const tool = h.tools.find((t) => t.name === "phase_tracker")!;
  const status = (await tool.execute("t1", { action: "status" }, undefined, undefined, h.ctx)) as {
    details: { phases: { implement: { status: string } } };
  };
  assert.equal(status.details.phases.implement.status, "complete");
});

test("cold implement and verify completions ignore unfinished snapshots", async () => {
  for (const phase of ["implement", "verify"] as const) {
    const h = harness({
      branch: [
        phaseResult("start", phases({ [phase]: "in_progress" })),
        taskSnapshot([{ name: "standalone task", status: "pending" }]),
      ],
    });
    await h.emit("session_start");
    const completed = await completePhase(h, phase);
    assert.equal(completed.details.error, undefined, phase);
    assert.equal(completed.details.phases[phase].status, "complete", phase);
  }
});

test("completion backstop rejects unfinished snapshot indices, preserves state, and permits same-index retry", async () => {
  const branch: unknown[] = [
    ...resumedBranch({ plan: "complete", implement: "complete", verify: "in_progress" }),
    subagentResult(["conformance-reviewer"]),
    taskSnapshot([
      { name: "T1 implementation", status: "complete" },
      { name: "G1 conformance", status: "pending" },
      { name: "G2 conformance", status: "in_progress" },
    ]),
  ];
  const h = harness({ branch });
  await h.emit("session_start");
  const rejected = await completePhase(h, "verify");
  assert.equal(rejected.details.error, "unfinished tasks");
  assert.equal(rejected.details.phases.verify.status, "in_progress");
  assert.match(rejected.content[0].text, /1: G1 conformance \(pending\)/);
  assert.match(rejected.content[0].text, /2: G2 conformance \(in_progress\)/);

  branch.push(taskSnapshot([
    { name: "T1 implementation", status: "complete" },
    { name: "G1 conformance", status: "complete" },
    { name: "G2 conformance", status: "complete" },
  ]));
  const completed = await completePhase(h, "verify");
  assert.equal(completed.details.error, undefined);
  assert.equal(completed.details.phases.verify.status, "complete");
});

test("completion backstop uses the latest successful current-branch snapshot", async () => {
  const branch: unknown[] = [
    ...resumedBranch({ plan: "complete", implement: "in_progress" }),
    taskSnapshot([{ name: "old", status: "pending" }]),
    taskSnapshot([{ name: "errored", status: "pending" }], true),
  ];
  const h = harness({ branch });
  await h.emit("session_start");
  const rejected = await completePhase(h, "implement");
  assert.equal(rejected.details.error, "unfinished tasks");
  assert.match(rejected.content[0].text, /0: old \(pending\)/);

  branch.push(taskSnapshot([])); // clear/init supersedes the old snapshot
  assert.equal((await completePhase(h, "implement")).details.phases.implement.status, "complete");

  const resetOnlyBranch: unknown[] = [
    ...resumedBranch({ plan: "complete", implement: "in_progress" }),
    taskSnapshot([{ name: "retained through reset", status: "in_progress" }]),
    phaseResult("reset", phases()),
    ...resumedBranch({ plan: "complete", implement: "in_progress" }),
  ];
  const resetOnly = harness({ branch: resetOnlyBranch });
  await resetOnly.emit("session_start");
  assert.equal((await completePhase(resetOnly, "implement")).details.error, "unfinished tasks");
  resetOnlyBranch.push(taskSnapshot([{ name: "retained through reset", status: "complete" }]));
  assert.equal((await completePhase(resetOnly, "implement")).details.phases.implement.status, "complete");
});

test("completion backstop preserves exclusions and closure-error precedence", async () => {
  const unfinished = taskSnapshot([{ name: "failed", status: "failed" }]);
  const explicitImplement = harness({ branch: [...resumedBranch({ plan: "complete", implement: "in_progress" }), unfinished] });
  await explicitImplement.emit("session_start");
  assert.equal((await completePhase(explicitImplement, "implement")).details.phases.implement.status, "complete");

  const closureFirst = harness({
    branch: [...resumedBranch({ plan: "complete", implement: "complete", verify: "in_progress" }), taskSnapshot([{ name: "T1", status: "pending" }])],
  });
  await closureFirst.emit("session_start");
  assert.equal((await completePhase(closureFirst, "verify")).details.error, "no conformance-reviewer dispatch observed");

  const disabled = harness({
    cwd: tempCwd({ piGauntlet: { flowGuards: { enforce: false } } }),
    branch: [...resumedBranch({ plan: "complete", implement: "in_progress" }), taskSnapshot([{ name: "T1", status: "pending" }])],
  });
  await disabled.emit("session_start");
  assert.equal((await completePhase(disabled, "implement")).details.phases.implement.status, "complete");

  const adHoc = harness({ branch: [taskSnapshot([{ name: "T1", status: "pending" }])] });
  await adHoc.emit("session_start");
  const tool = adHoc.tools.find((t) => t.name === "phase_tracker")!;
  assert.equal((await tool.execute("x", { action: "complete", phase: "plan" }, undefined, undefined, adHoc.ctx)).details.error, undefined);
});

test("completion backstop leaves no/empty snapshots and skip alone, and uses the switched branch", async () => {
  const noSnapshot = harness({ branch: resumedBranch({ plan: "complete", implement: "in_progress" }) });
  await noSnapshot.emit("session_start");
  assert.equal((await completePhase(noSnapshot, "implement")).details.phases.implement.status, "complete");

  const skipped = harness({
    branch: [...resumedBranch({ plan: "complete", implement: "in_progress" }), taskSnapshot([{ name: "T1", status: "pending" }])],
  });
  await skipped.emit("session_start");
  const skipTool = skipped.tools.find((t) => t.name === "phase_tracker")!;
  assert.equal((await skipTool.execute("skip", { action: "skip", phase: "implement", reason: "waived" }, undefined, undefined, skipped.ctx)).details.error, undefined);

  const switched = harness({
    branch: [...resumedBranch({ plan: "complete", implement: "in_progress" }), taskSnapshot([{ name: "off branch", status: "pending" }])],
  });
  await switched.emit("session_start");
  switched.setBranch([...resumedBranch({ plan: "complete", implement: "in_progress" }), taskSnapshot([{ name: "active", status: "complete" }])]);
  await switched.emit("session_switch");
  assert.equal((await completePhase(switched, "implement")).details.phases.implement.status, "complete");

  const closureOff = harness({
    cwd: tempCwd({ piGauntlet: { closureReview: { enforce: false } } }),
    branch: [...resumedBranch({ plan: "complete", implement: "complete", verify: "in_progress" }), taskSnapshot([{ name: "T1", status: "pending" }])],
  });
  await closureOff.emit("session_start");
  assert.equal((await completePhase(closureOff, "verify")).details.error, "unfinished tasks");
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

// --- plan_check tool + hash stamp + replay + implement-start gate (gh-19) ---

const sha256Hex = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

const FIXTURE_SPEC = [
  "# Fixture Spec",
  "",
  "## Design",
  "Line A.",
  "This part defines `helperFn()` config.",
  "Another line here.",
].join("\n");

const FIXTURE_PLAN = `# Fixture Plan

**Spec:** \`spec.md\`

**Verification:** npm test

---

## Wave 1 - Two parallel tasks

### Task 1: Implement helper

**Spec:** spec.md § "Design" L4-L6

**Files:**
- Create: lib/task1.ts
- Modify: file-a.ts

This task implements helperFn() for parsing.

### Task 2: Implement naming

**Spec:** spec.md § "Design" L4-L4

**Files:**
- Create: lib/task2.ts
- Modify: file-b.ts

This task handles naming details.

## Spec coverage

| anchor | requirement | owner |
|---|---|---|
| § "Design" L4-L6 | parser grammar basics | Task 1 |
| § "Design" L4-L4 | helper naming | Task 2 |
`;

function writePlanFixture(
  dir: string,
  opts: { mutatePlan?: (t: string) => string; mutateSpec?: (t: string) => string } = {},
) {
  const planText = opts.mutatePlan ? opts.mutatePlan(FIXTURE_PLAN) : FIXTURE_PLAN;
  const specText = opts.mutateSpec ? opts.mutateSpec(FIXTURE_SPEC) : FIXTURE_SPEC;
  const planPath = join(dir, "plan.md");
  const specPath = join(dir, "spec.md");
  writeFileSync(planPath, planText);
  writeFileSync(specPath, specText);
  writeFileSync(join(dir, "file-a.ts"), "// a\n");
  writeFileSync(join(dir, "file-b.ts"), "// b\n");
  return { planPath, specPath, planText, specText };
}

const readyForImplementBranch = implementBranch().slice(0, 4);

const planCheckResult = (details: unknown) => ({
  type: "message",
  message: { role: "toolResult", toolName: "plan_check", details },
});

test("plan_check is registered", () => {
  const h = harness();
  assert.ok(h.tools.some((t) => t.name === "plan_check"));
});

test("plan_check pass: text, details, and stamp arming when a flow is entered", async () => {
  const dir = tempCwd();
  const { planPath, specPath, planText, specText } = writePlanFixture(dir);
  const h = harness({ cwd: dir, branch: readyForImplementBranch });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "plan_check")!;
  const res = (await tool.execute("t1", { planPath }, undefined, undefined, h.ctx)) as {
    content: { text: string }[];
    details: { status: string; planPath: string; planSha256: string; specPath: string; specSha256: string };
  };
  assert.match(res.content[0].text, /^PASS/);
  assert.equal(res.details.status, "pass");
  assert.equal(res.details.planPath, planPath);
  assert.equal(res.details.specPath, specPath);
  assert.equal(res.details.planSha256, sha256Hex(readFileSync(planPath)));
  assert.equal(res.details.specSha256, sha256Hex(readFileSync(specPath)));
  assert.ok(isAbsolute(res.details.planPath));
  assert.ok(isAbsolute(res.details.specPath));

  // stamp armed: implement-start now succeeds.
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const start = (await phaseTool.execute("t2", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string; phases: { implement: { status: string } } };
  };
  assert.equal(start.details.error, undefined);
  assert.equal(start.details.phases.implement.status, "in_progress");
  void planText;
  void specText;
});

test("plan_check pass outside a flow: no stamp, plain-linter text", async () => {
  const dir = tempCwd();
  const { planPath } = writePlanFixture(dir);
  const h = harness({ cwd: dir });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "plan_check")!;
  const res = (await tool.execute("t1", { planPath }, undefined, undefined, h.ctx)) as { content: { text: string }[] };
  assert.match(res.content[0].text, /^PASS \(no flow to stamp\)/);
});

test("plan_check fail: mutated plan body, no error key, clears stamp", async () => {
  const dir = tempCwd();
  const { planPath } = writePlanFixture(dir, {
    mutatePlan: (t) => t.replace("implements helperFn() for parsing.", "implements the helper for parsing."),
  });
  const h = harness({ cwd: dir, branch: readyForImplementBranch });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "plan_check")!;
  const res = (await tool.execute("t1", { planPath }, undefined, undefined, h.ctx)) as {
    content: { text: string }[];
    details: { status: string; error?: string };
  };
  assert.match(res.content[0].text, /^FAIL/);
  assert.equal(res.details.status, "fail");
  assert.equal("error" in res.details, false);

  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const start = (await phaseTool.execute("t2", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.match(start.details.error ?? "", /plan_check/);
});

test("plan_check fail: unresolvable spec path", async () => {
  const dir = tempCwd();
  const { planPath } = writePlanFixture(dir, {
    mutatePlan: (t) => t.replace("**Spec:** `spec.md`", "**Spec:** `missing-spec.md`"),
  });
  const h = harness({ cwd: dir, branch: readyForImplementBranch });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "plan_check")!;
  const res = (await tool.execute("t1", { planPath }, undefined, undefined, h.ctx)) as {
    content: { text: string }[];
    details: { status: string; findings?: { check: string }[]; error?: string };
  };
  assert.match(res.content[0].text, /^FAIL/);
  assert.equal(res.details.status, "fail");
  assert.equal("error" in res.details, false);
  assert.ok(res.details.findings?.some((f) => f.check === "input"));

  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const start = (await phaseTool.execute("t2", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.match(start.details.error ?? "", /plan_check/);
});

test("plan_check fail: header **Spec:** extraction is confined to the header (a path-only-looking line below the separator does not count)", async () => {
  const dir = tempCwd();
  const { planPath } = writePlanFixture(dir, {
    mutatePlan: (t) =>
      t
        .replace("**Spec:** `spec.md`\n\n", "")
        .replace(
          "## Wave 1 - Two parallel tasks",
          "## Wave 1 - Two parallel tasks\n\n**Spec:** `not-the-header-spec.md`\n",
        ),
  });
  const h = harness({ cwd: dir, branch: readyForImplementBranch });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "plan_check")!;
  const res = (await tool.execute("t1", { planPath }, undefined, undefined, h.ctx)) as {
    content: { text: string }[];
    details: { status: string; findings?: { check: string; reason: string }[] };
  };
  assert.match(res.content[0].text, /^FAIL/);
  assert.equal(res.details.status, "fail");
  assert.ok(
    res.details.findings?.some((f) => f.reason.includes("no path-only **Spec:** header line found in plan")),
    `expected the missing-header-spec finding, got: ${JSON.stringify(res.details.findings)}`,
  );
});

test("plan_check fail: plan header has no path-only **Spec:** line at all", async () => {
  const dir = tempCwd();
  const { planPath } = writePlanFixture(dir, {
    mutatePlan: (t) => t.replace("**Spec:** `spec.md`\n\n", ""),
  });
  const h = harness({ cwd: dir, branch: readyForImplementBranch });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "plan_check")!;
  const res = (await tool.execute("t1", { planPath }, undefined, undefined, h.ctx)) as {
    content: { text: string }[];
    details: { status: string; findings?: { check: string }[] };
  };
  assert.match(res.content[0].text, /^FAIL/);
  assert.equal(res.details.status, "fail");
  assert.ok(res.details.findings?.some((f) => f.check === "input"));

  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const start = (await phaseTool.execute("t2", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.match(start.details.error ?? "", /plan_check/);
});

test("implement-start gate: rejects with no stamp, names plan_check remedy", async () => {
  const h = harness({ branch: readyForImplementBranch });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await tool.execute("t1", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    content: { text: string }[];
    details: { error?: string };
  };
  assert.match(res.content[0].text, /plan_check/);
  assert.ok(res.details.error);
});

test("implement-start gate: stale plan bytes rejected, names the stale file", async () => {
  const dir = tempCwd();
  const { planPath } = writePlanFixture(dir);
  const h = harness({ cwd: dir, branch: readyForImplementBranch });
  await h.emit("session_start");
  const planCheck = h.tools.find((t) => t.name === "plan_check")!;
  await planCheck.execute("t1", { planPath }, undefined, undefined, h.ctx);
  writeFileSync(planPath, readFileSync(planPath, "utf8") + "\nx");
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await phaseTool.execute("t2", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.match(res.details.error ?? "", /stale/);
  assert.match(res.details.error ?? "", new RegExp(planPath.replace(/[/.]/g, "\\$&")));
});

test("implement-start gate: stale spec bytes rejected, names the stale file", async () => {
  const dir = tempCwd();
  const { planPath, specPath } = writePlanFixture(dir);
  const h = harness({ cwd: dir, branch: readyForImplementBranch });
  await h.emit("session_start");
  const planCheck = h.tools.find((t) => t.name === "plan_check")!;
  await planCheck.execute("t1", { planPath }, undefined, undefined, h.ctx);
  writeFileSync(specPath, readFileSync(specPath, "utf8") + "\nx");
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await phaseTool.execute("t2", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.match(res.details.error ?? "", /stale/);
  assert.match(res.details.error ?? "", new RegExp(specPath.replace(/[/.]/g, "\\$&")));
});

test("implement-start gate: missing stamped file rejected, names the missing path", async () => {
  const dir = tempCwd();
  const { planPath } = writePlanFixture(dir);
  const h = harness({ cwd: dir, branch: readyForImplementBranch });
  await h.emit("session_start");
  const planCheck = h.tools.find((t) => t.name === "plan_check")!;
  await planCheck.execute("t1", { planPath }, undefined, undefined, h.ctx);
  rmSync(planPath);
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await phaseTool.execute("t2", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.match(res.details.error ?? "", /missing/);
  assert.match(res.details.error ?? "", new RegExp(planPath.replace(/[/.]/g, "\\$&")));
});

test("implement-start gate: enforce false skips the gate entirely", async () => {
  const dir = tempCwd({ piGauntlet: { flowGuards: { enforce: false } } });
  const h = harness({ cwd: dir, branch: readyForImplementBranch });
  await h.emit("session_start");
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await phaseTool.execute("t1", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string; phases: { implement: { status: string } } };
  };
  assert.equal(res.details.error, undefined);
  assert.equal(res.details.phases.implement.status, "in_progress");
});

test("replay: a passing plan_check result restores the stamp without re-running the tool", async () => {
  const dir = tempCwd();
  const { planPath, specPath } = writePlanFixture(dir);
  const passDetails = {
    status: "pass",
    planPath,
    planSha256: sha256Hex(readFileSync(planPath)),
    specPath,
    specSha256: sha256Hex(readFileSync(specPath)),
  };
  const h = harness({ cwd: dir, branch: [...readyForImplementBranch, planCheckResult(passDetails)] });
  await h.emit("session_start");
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await phaseTool.execute("t1", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string; phases: { implement: { status: string } } };
  };
  assert.equal(res.details.error, undefined);
  assert.equal(res.details.phases.implement.status, "in_progress");
});

test("replay: pass then fail clears the stamp", async () => {
  const dir = tempCwd();
  const { planPath, specPath } = writePlanFixture(dir);
  const passDetails = {
    status: "pass",
    planPath,
    planSha256: sha256Hex(readFileSync(planPath)),
    specPath,
    specSha256: sha256Hex(readFileSync(specPath)),
  };
  const failDetails = { status: "fail", planPath };
  const h = harness({
    cwd: dir,
    branch: [...readyForImplementBranch, planCheckResult(passDetails), planCheckResult(failDetails)],
  });
  await h.emit("session_start");
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await phaseTool.execute("t1", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.match(res.details.error ?? "", /plan_check/);
});

test("replay: a plan_check pass observed before any flow entry does not arm the stamp, and a live walk with no live plan_check is rejected", async () => {
  const dir = tempCwd();
  const { planPath, specPath } = writePlanFixture(dir);
  const passDetails = {
    status: "pass",
    planPath,
    planSha256: sha256Hex(readFileSync(planPath)),
    specPath,
    specSha256: sha256Hex(readFileSync(specPath)),
  };
  // plan_check pass happens with gauntletEntered still false: no phase_tracker
  // history precedes it in the branch.
  const h = harness({ cwd: dir, branch: [planCheckResult(passDetails)] });
  await h.emit("session_start");
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  await phaseTool.execute("t1", { action: "start", phase: "brainstorm" }, undefined, undefined, h.ctx);
  await phaseTool.execute("t2", { action: "complete", phase: "brainstorm" }, undefined, undefined, h.ctx);
  await phaseTool.execute("t3", { action: "start", phase: "plan" }, undefined, undefined, h.ctx);
  await phaseTool.execute("t4", { action: "complete", phase: "plan" }, undefined, undefined, h.ctx);
  const res = (await phaseTool.execute("t5", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.match(res.details.error ?? "", /plan_check/);
});

test("replay: a phase_tracker reset clears the stamp", async () => {
  const dir = tempCwd();
  const { planPath, specPath } = writePlanFixture(dir);
  const passDetails = {
    status: "pass",
    planPath,
    planSha256: sha256Hex(readFileSync(planPath)),
    specPath,
    specSha256: sha256Hex(readFileSync(specPath)),
  };
  const h = harness({
    cwd: dir,
    branch: [
      ...readyForImplementBranch,
      planCheckResult(passDetails),
      phaseResult("reset", phases()),
      ...readyForImplementBranch,
    ],
  });
  await h.emit("session_start");
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await phaseTool.execute("t1", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.match(res.details.error ?? "", /plan_check/);
});

test("replay via session_fork: a passing plan_check result restores the stamp without re-running the tool", async () => {
  const dir = tempCwd();
  const { planPath, specPath } = writePlanFixture(dir);
  const passDetails = {
    status: "pass",
    planPath,
    planSha256: sha256Hex(readFileSync(planPath)),
    specPath,
    specSha256: sha256Hex(readFileSync(specPath)),
  };
  const h = harness({ cwd: dir, branch: [...readyForImplementBranch, planCheckResult(passDetails)] });
  // The child fork inherits the parent's branch; phase-tracker must rebuild
  // phases/gauntletEntered/the stamp from replay on session_fork exactly as it
  // does on session_start. Without that rebuild, gauntletEntered would stay
  // false (its un-replayed default) and the implement-start gate below would
  // be skipped entirely rather than genuinely satisfied - the plan.status
  // assertion is what tells the two apart (a skipped gate leaves plan pending).
  await h.emit("session_fork");
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await phaseTool.execute("t1", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string; phases: { plan: { status: string }; implement: { status: string } } };
  };
  assert.equal(res.details.error, undefined);
  assert.equal(res.details.phases.plan.status, "complete");
  assert.equal(res.details.phases.implement.status, "in_progress");
});

test("replay via session_tree: a passing plan_check result restores the stamp without re-running the tool", async () => {
  const dir = tempCwd();
  const { planPath, specPath } = writePlanFixture(dir);
  const passDetails = {
    status: "pass",
    planPath,
    planSha256: sha256Hex(readFileSync(planPath)),
    specPath,
    specSha256: sha256Hex(readFileSync(specPath)),
  };
  const h = harness({ cwd: dir, branch: [...readyForImplementBranch, planCheckResult(passDetails)] });
  // Fork/tree sessions follow the same branch-replay semantics as fork/switch:
  // phase-tracker must rebuild phases/gauntletEntered/the stamp from replay on
  // session_tree exactly as it does on the other three events. Without that
  // rebuild, gauntletEntered would stay false (its un-replayed default) and
  // the implement-start gate below would be skipped entirely rather than
  // genuinely satisfied - the plan.status assertion is what tells the two
  // apart (a skipped gate leaves plan pending).
  await h.emit("session_tree");
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await phaseTool.execute("t1", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string; phases: { plan: { status: string }; implement: { status: string } } };
  };
  assert.equal(res.details.error, undefined);
  assert.equal(res.details.phases.plan.status, "complete");
  assert.equal(res.details.phases.implement.status, "in_progress");
});

test("replay via session_switch: pass then fail clears the stamp, rebuilt from replay rather than a live run", async () => {
  const dir = tempCwd();
  const { planPath, specPath } = writePlanFixture(dir);
  const passDetails = {
    status: "pass",
    planPath,
    planSha256: sha256Hex(readFileSync(planPath)),
    specPath,
    specSha256: sha256Hex(readFileSync(specPath)),
  };
  const failDetails = { status: "fail", planPath };
  const h = harness({
    cwd: dir,
    branch: [...readyForImplementBranch, planCheckResult(passDetails), planCheckResult(failDetails)],
  });
  // session_switch must rebuild gauntletEntered (true, from the replayed
  // readyForImplementBranch entries) and the stamp (armed by the pass, then
  // cleared by the fail) purely from replay - no plan_check tool call happens
  // in this test. If the rebuild didn't run, gauntletEntered would stay false
  // and the implement-start gate would be skipped (no error) instead of
  // rejecting for a stale/missing stamp, so this assertion distinguishes the
  // two.
  await h.emit("session_switch");
  const phaseTool = h.tools.find((t) => t.name === "phase_tracker")!;
  const res = (await phaseTool.execute("t1", { action: "start", phase: "implement" }, undefined, undefined, h.ctx)) as {
    details: { error?: string };
  };
  assert.match(res.details.error ?? "", /plan_check/);
});
