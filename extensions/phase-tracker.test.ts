import assert from "node:assert/strict";
import { after, test } from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, realpathSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { isAbsolute, join } from "node:path";
import registerPhaseTracker from "./phase-tracker.ts";

const originalSubagentDepth = process.env.PI_SUBAGENT_DEPTH;
process.env.PI_SUBAGENT_DEPTH = "0";

const tempDirs: string[] = [];
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
  if (originalSubagentDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
  else process.env.PI_SUBAGENT_DEPTH = originalSubagentDepth;
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

// Primary checkout with one linked worktree at .worktrees/x. Real git: plan_check and Guard 2
// resolve checkouts with gitSync, and macOS temp paths need realpath to compare toplevels.
const gitPrimary = () => {
  const primary = realpathSync(tempCwd());
  const git = (...args: string[]) => execFileSync("git", ["-C", primary, ...args], { stdio: "pipe" });
  git("init", "-q");
  git("-c", "user.email=t@example.com", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "init");
  mkdirSync(join(primary, "doc"));
  git("worktree", "add", "-q", join(primary, ".worktrees", "x"), "-b", "x");
  return { primary, worktree: join(primary, ".worktrees", "x") };
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

function harness(options: { cwd?: string; branch?: unknown[]; idle?: boolean; beforeSettled?: (setIdle: (idle: boolean) => void) => void; sendThrows?: boolean; model?: { provider: string; id: string }; thinkingLevel?: string } = {}) {
  const handlers = new Map<string, ((event: unknown, ctx: unknown) => unknown)[]>();
  const tools: { name: string; executionMode?: string; parameters?: any; execute: (...args: any[]) => unknown }[] = [];
  const sent: { message: any; options: any }[] = [];
  let idle = options.idle ?? true;
  let branch = options.branch ?? [];
  const ctx = {
    cwd: options.cwd ?? tempCwd(),
    hasUI: false,
    isIdle: () => idle,
    sessionManager: { getBranch: () => branch },
    model: options.model,
    thinkingLevel: options.thinkingLevel,
  };
  const pi = {
    on(event: string, handler: (event: unknown, context: unknown) => unknown) {
      const registered = handlers.get(event) ?? [];
      registered.push(handler);
      handlers.set(event, registered);
    },
    registerTool(tool: { name: string; executionMode?: string; parameters?: any; execute: (...args: any[]) => unknown }) {
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

test("brainstorm write confinement: a docs/specs write under the default dirs does not warn", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  delete process.env.PI_SUBAGENT_DEPTH;
  try {
    const h = harness({ cwd: tempCwd(), branch: [phaseResult("start", phases({ brainstorm: "in_progress" }))] });
    await h.emit("session_start");
    await h.emitEvent("tool_call", writeCall("t1", "docs/specs/x.md"));
    assert.equal((await h.emitEvent("tool_result", writeResult("t1")))[0], undefined);
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

test("plan activity auto-completes implement with complete+skipped, not with failed, not from an errored result", async () => {
  const implementStatus = async (tasks: { status: string }[], isError = false) => {
    const h = harness({ branch: implementBranch() });
    await h.emit("session_start");
    await h.emitEvent("tool_execution_end", {
      toolName: "plan_tracker",
      isError,
      result: { details: { tasks } },
    });
    const tool = h.tools.find((t) => t.name === "phase_tracker")!;
    const status = (await tool.execute("t1", { action: "status" }, undefined, undefined, h.ctx)) as {
      details: { phases: { implement: { status: string } } };
    };
    return status.details.phases.implement.status;
  };
  assert.equal(await implementStatus([{ status: "complete" }, { status: "skipped" }]), "complete");
  assert.equal(await implementStatus([{ status: "skipped" }, { status: "skipped" }]), "complete");
  assert.equal(await implementStatus([{ status: "complete" }, { status: "failed" }]), "in_progress");
  assert.equal(await implementStatus([{ status: "complete" }, { status: "skipped" }], true), "in_progress");
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
    if (priorDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
    else process.env.PI_SUBAGENT_DEPTH = priorDepth;
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

**Spec:** \`doc/specs/spec.md\`

**Verification:** npm test

---

## Wave 1 - Two parallel tasks

### Task 1: Implement helper

**Spec:** spec.md § "Design" L4-L6

**Files:**
- Create: lib/task1.ts
- Create: lib/task1.test.ts
- Modify: file-a.ts
- Test: lib/task1.test.ts

**Tests:**
- \`node --test lib/task1.test.ts\`

This task implements helperFn() for parsing.

### Task 2: Implement naming

**Spec:** spec.md § "Design" L4-L4

**Files:**
- Create: lib/task2.ts
- Create: lib/task2.test.ts
- Modify: file-b.ts
- Test: lib/task2.test.ts

**Tests:**
- \`node --test lib/task2.test.ts\`

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
  const planPath = join(dir, "doc/plans/plan.md");
  const specPath = join(dir, "doc/specs/spec.md");
  mkdirSync(join(dir, "doc/plans"), { recursive: true });
  mkdirSync(join(dir, "doc/specs"), { recursive: true });
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

test("plan_check roots at the plan's checkout: worktree plan passes from <primary>/doc (AC 1)", async () => {
  const { primary, worktree } = gitPrimary();
  const { planPath } = writePlanFixture(worktree);
  const h = harness({ cwd: join(primary, "doc") });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "plan_check")!;
  const res = (await tool.execute("t1", { planPath }, undefined, undefined, h.ctx)) as { content: { text: string }[]; details: { status: string; specPath: string } };
  assert.match(res.content[0].text, /^PASS/);
  assert.equal(res.details.specPath, join(worktree, "doc/specs/spec.md"));
});

test("plan_check outside any checkout: input finding", async () => {
  const dir = tempCwd();
  const { planPath } = writePlanFixture(dir);
  const h = harness({ cwd: dir });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "plan_check")!;
  const res = (await tool.execute("t1", { planPath }, undefined, undefined, h.ctx)) as { content: { text: string }[]; details: { status: string } };
  assert.equal(res.details.status, "fail");
  assert.match(res.content[0].text, /input @ line 0: plan is not inside a git checkout/);
});

const bashCall = (id: string, command: string) => ({ toolName: "bash", toolCallId: id, input: { command } });
const blocked = (results: unknown[]) => (results[0] as { block?: boolean } | undefined)?.block === true;

test("Guard 2 evaluates the command's target checkout (AC 3)", async () => {
  const { primary, worktree } = gitPrimary();
  const h = harness({ cwd: join(primary, "doc"), branch: [phaseResult("start", phases({ brainstorm: "in_progress" }))] });
  await h.emit("session_start");
  assert.ok(blocked(await h.emitEvent("tool_call", bashCall("b1", "git switch -c y"))), "bare switch from <primary>/doc blocks");
  assert.ok(blocked(await h.emitEvent("tool_call", bashCall("b2", `git -C ${primary} switch -c y`))), "-C <primary> blocks");
  assert.ok(!blocked(await h.emitEvent("tool_call", bashCall("b3", `git -C ${worktree} switch -c y`))), "-C <worktree> passes");
  assert.ok(!blocked(await h.emitEvent("tool_call", bashCall("b4", `cd ${worktree} && git checkout -b y`))), "cd <worktree> passes");
  assert.ok(!blocked(await h.emitEvent("tool_call", bashCall("b5", "git -C /nonexistent/dir switch -c y"))), "unresolvable target passes");
  assert.ok(!blocked(await h.emitEvent("tool_call", bashCall("b6", "git worktree add .worktrees/y -b y"))), "git worktree is exempt");
});

test("plan_check pass: text, details, and stamp arming when a flow is entered", async () => {
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
  const { planPath } = writePlanFixture(dir);
  const h = harness({ cwd: dir });
  await h.emit("session_start");
  const tool = h.tools.find((t) => t.name === "plan_check")!;
  const res = (await tool.execute("t1", { planPath }, undefined, undefined, h.ctx)) as { content: { text: string }[] };
  assert.match(res.content[0].text, /^PASS \(no flow to stamp\)/);
});

test("plan_check fail: mutated plan body, no error key, clears stamp", async () => {
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
  const { planPath } = writePlanFixture(dir, {
    mutatePlan: (t) => t.replace("**Spec:** `doc/specs/spec.md`", "**Spec:** `missing-spec.md`"),
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
  const dir = gitPrimary().primary;
  const { planPath } = writePlanFixture(dir, {
    mutatePlan: (t) =>
      t
        .replace("**Spec:** `doc/specs/spec.md`\n\n", "")
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
  const dir = gitPrimary().primary;
  const { planPath } = writePlanFixture(dir, {
    mutatePlan: (t) => t.replace("**Spec:** `doc/specs/spec.md`\n\n", ""),
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
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
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
  const dir = gitPrimary().primary;
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

test("gauntlet_setting escalationLoop: setting absent -> ctx-derived main-loop model; setting wins when set", async () => {
  const h = harness({ cwd: tempCwd({ piGauntlet: {} }), model: { provider: "p", id: "main" }, thinkingLevel: "medium" });
  const tool = h.tools.find((t) => t.name === "gauntlet_setting")!;
  const absent = (await tool.execute("g1", { key: "escalationLoop" }, undefined, undefined, h.ctx)) as { details: { key: string; implModel?: string; errors: string[] } };
  assert.deepEqual(absent.details, { key: "escalationLoop", implModel: "p/main:medium", errors: [] });

  const set = harness({ cwd: tempCwd({ piGauntlet: { escalationLoop: { implModel: "p/strong:high" } } }), model: { provider: "p", id: "main" }, thinkingLevel: "medium" });
  const res = (await set.tools.find((t) => t.name === "gauntlet_setting")!.execute("g2", { key: "escalationLoop" }, undefined, undefined, set.ctx)) as { details: { implModel?: string } };
  assert.equal(res.details.implModel, "p/strong:high");
});

test("gauntlet_setting flowGuards: default dirs + derived plan dirs; repo override replaces them", async () => {
  const h = harness({ cwd: tempCwd({ piGauntlet: {} }) });
  const tool = h.tools.find((t) => t.name === "gauntlet_setting")!;
  const def = (await tool.execute("f1", { key: "flowGuards" }, undefined, undefined, h.ctx)) as { details: unknown };
  assert.deepEqual(def.details, { key: "flowGuards", enforce: true, specDirs: ["doc/specs", "docs/specs"], planDirs: ["doc/plans", "docs/plans"], errors: [] });
  const set = harness({ cwd: tempCwd({ piGauntlet: { flowGuards: { specDirs: ["design/specs"] } } }) });
  const res = (await set.tools.find((t) => t.name === "gauntlet_setting")!.execute("f2", { key: "flowGuards" }, undefined, undefined, set.ctx)) as { details: { specDirs: string[]; planDirs: string[] } };
  assert.deepEqual(res.details.specDirs, ["design/specs"]);
  assert.deepEqual(res.details.planDirs, ["design/plans"]);
});

// --- Conformance fix-loop dispatch guard (spec 2026-09-13-conformance-dispatch-guard) ---

const verifyBranch = (extra: unknown[] = []) => [
  ...implementBranch(),
  phaseResult("complete", phases({ brainstorm: "complete", plan: "complete", implement: "complete" })),
  phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "in_progress" })),
  ...extra,
];

const subagentCall = (id: string, input: unknown) => ({ toolName: "subagent", toolCallId: id, input });
const loneImplementer = (extra: Record<string, unknown> = {}) => ({ agent: "implementer", task: "fix G1", ...extra });
const implementerWave = (n = 1) => ({
  tasks: Array.from({ length: n }, (_, i) => ({ agent: "implementer", task: `fix G${i + 1}`, worktree: true })),
});

const firstCallResult = async (h: ReturnType<typeof harness>, id: string, input: unknown) =>
  (await h.emitEvent("tool_call", subagentCall(id, input)))[0] as { block?: boolean; reason?: string } | undefined;

test("shape guard: lone implementer blocked in verify after the audit, with and without closureReview.model, async or not", async () => {
  for (const settings of [
    { piGauntlet: { closureReview: { enforce: true } } },
    { piGauntlet: { closureReview: { enforce: true, model: "x/y" } } },
  ]) {
    const h = harness({ cwd: tempCwd(settings), branch: verifyBranch([subagentResult(["conformance-reviewer"])]) });
    await h.emit("session_start");
    const sync = await firstCallResult(h, "s1", loneImplementer());
    assert.equal(sync?.block, true);
    assert.match(sync?.reason ?? "", /dispatch implementers as a one-task tasks wave/);
    assert.match(sync?.reason ?? "", /piGauntlet\.closureReview\.enforce: false/);
    const async = await firstCallResult(h, "s2", loneImplementer({ async: true }));
    assert.equal(async?.block, true);
  }
});

test("shape guard: lone implementer passes before the audit, in implement, in ship, and on management calls", async () => {
  const preLatch = harness({ branch: verifyBranch() });
  await preLatch.emit("session_start");
  assert.equal(await firstCallResult(preLatch, "s1", loneImplementer()), undefined);

  const implement = harness({ branch: implementBranch([subagentResult(["conformance-reviewer"])]) });
  await implement.emit("session_start");
  assert.equal(await firstCallResult(implement, "s1", loneImplementer()), undefined);

  const ship = harness({
    branch: verifyBranch([
      subagentResult(["conformance-reviewer"]),
      phaseResult("complete", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete" })),
      phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete", ship: "in_progress" })),
    ]),
  });
  await ship.emit("session_start");
  assert.equal(await firstCallResult(ship, "s1", loneImplementer()), undefined);

  const mgmt = harness({ branch: verifyBranch([subagentResult(["conformance-reviewer"])]) });
  await mgmt.emit("session_start");
  assert.equal(await firstCallResult(mgmt, "s1", { action: "status", agent: "implementer" }), undefined);
});

test("shape guard: dormant when the flow was never entered (cold start verify) and when closureReview.enforce is false", async () => {
  const cold = harness({
    cwd: tempCwd({ piGauntlet: { closureReview: { maxFixRounds: 0 } } }),
    branch: [phaseResult("start", phases({ verify: "in_progress" })), subagentResult(["conformance-reviewer"])],
  });
  await cold.emit("session_start");
  assert.equal(await firstCallResult(cold, "s1", loneImplementer()), undefined);
  assert.equal(await firstCallResult(cold, "s2", implementerWave(1)), undefined);
  assert.equal(await firstCallResult(cold, "s3", { chain: [{ agent: "implementer", task: "fix" }] }), undefined);

  const off = harness({
    cwd: tempCwd({ piGauntlet: { closureReview: { enforce: false } } }),
    branch: verifyBranch([subagentResult(["conformance-reviewer"])]),
  });
  await off.emit("session_start");
  assert.equal(await firstCallResult(off, "s1", loneImplementer()), undefined);
});

test("shape guard: a one-task tasks wave and a chain step are not the lone shape", async () => {
  const h = harness({ branch: verifyBranch([subagentResult(["conformance-reviewer"])]) });
  await h.emit("session_start");
  assert.equal(await firstCallResult(h, "s1", implementerWave(1)), undefined);
  assert.equal(await firstCallResult(h, "s2", { chain: [{ agent: "implementer", task: "fix" }] }), undefined);
});

const waveResult = (id: string, results: { agent: string; exitCode: number }[], isError = false) => ({
  toolName: "subagent",
  toolCallId: id,
  isError,
  content: [],
  details: { results },
});
const okWave = (id: string) => waveResult(id, [{ agent: "implementer", exitCode: 0 }]);

const guardedHarness = (settings: unknown, extra: unknown[] = []) =>
  harness({ cwd: tempCwd(settings), branch: verifyBranch([subagentResult(["conformance-reviewer"]), ...extra]) });

test("cap guard: default 3 waves pass, the fourth is blocked with the escalation text", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { enforce: true } } });
  await h.emit("session_start");
  for (let i = 1; i <= 3; i++) {
    assert.equal(await firstCallResult(h, `c${i}`, implementerWave(2)), undefined, `round ${i} passes`);
    await h.emitEvent("tool_result", okWave(`c${i}`));
  }
  const blocked = await firstCallResult(h, "c4", implementerWave(1));
  assert.equal(blocked?.block, true);
  assert.match(blocked?.reason ?? "", /3 fix round\(s\) used against a cap of 3 \(granted rounds included\); escalate to the human/);
});

test("cap guard: maxFixRounds 0 blocks the first wave; 1 blocks the second; a chain implementer is cap-checked and counted", async () => {
  const zero = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
  await zero.emit("session_start");
  assert.equal((await firstCallResult(zero, "c1", implementerWave(1)))?.block, true);

  const one = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 1 } } });
  await one.emit("session_start");
  assert.equal(await firstCallResult(one, "c1", { chain: [{ agent: "implementer", task: "fix" }] }), undefined);
  await one.emitEvent("tool_result", okWave("c1"));
  assert.equal((await firstCallResult(one, "c2", implementerWave(1)))?.block, true);
});

test("counter: results while closure review enforcement is off do not consume budget", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { enforce: false, maxFixRounds: 1 } } });
  await h.emit("session_start");
  await h.emitEvent("tool_result", okWave("c1"));
  await h.emitEvent("tool_result", okWave("c2"));
  writeFileSync(
    join(h.ctx.cwd, ".pi", "settings.json"),
    JSON.stringify({ piGauntlet: { closureReview: { enforce: true, maxFixRounds: 1 } } }),
  );
  assert.equal(await firstCallResult(h, "c3", implementerWave(1)), undefined);
});

test("fix-loop guard and counter are dormant in subagent children", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  process.env.PI_SUBAGENT_DEPTH = "1";
  let live: ReturnType<typeof harness>;
  let replay: ReturnType<typeof harness>;
  try {
    live = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
    replay = guardedHarness(
      { piGauntlet: { closureReview: { maxFixRounds: 2 } } },
      [subagentResult(["implementer"]), subagentResult(["implementer"])],
    );
  } finally {
    if (priorDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
    else process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }

  await live.emit("session_start");
  assert.equal(await firstCallResult(live, "c1", loneImplementer()), undefined);
  assert.equal(await firstCallResult(live, "c2", implementerWave(1)), undefined);
  await live.emitEvent("tool_result", okWave("c2"));
  await replay.emit("session_start");
  assert.equal(await firstCallResult(replay, "c3", implementerWave(1)), undefined);
});

test("cap guard: non-implementer dispatches never blocked; enforce false passes everything", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
  await h.emit("session_start");
  assert.equal(await firstCallResult(h, "r1", { agent: "conformance-reviewer", task: "re-audit" }), undefined);
  assert.equal(await firstCallResult(h, "r2", { agent: "code-reviewer", task: "review" }), undefined);

  const off = guardedHarness({ piGauntlet: { closureReview: { enforce: false, maxFixRounds: 0 } } });
  await off.emit("session_start");
  assert.equal(await firstCallResult(off, "c1", implementerWave(1)), undefined);
  assert.equal(await firstCallResult(off, "c2", loneImplementer()), undefined);
});

test("counter: blocked, errored, empty, non-implementer, and out-of-window results do not count; non-zero exit does", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 1 } } });
  await h.emit("session_start");
  await h.emitEvent("tool_result", waveResult("e1", [{ agent: "implementer", exitCode: 0 }], true));
  await h.emitEvent("tool_result", waveResult("e2", []));
  await h.emitEvent("tool_result", waveResult("e3", [{ agent: "code-reviewer", exitCode: 0 }]));
  const blockedLone = await firstCallResult(h, "b1", loneImplementer());
  assert.equal(blockedLone?.block, true);
  assert.equal(await firstCallResult(h, "c1", implementerWave(1)), undefined, "budget untouched");
  await h.emitEvent("tool_result", waveResult("c1", [{ agent: "implementer", exitCode: 1 }]));
  assert.equal((await firstCallResult(h, "c2", implementerWave(1)))?.block, true);
});

test("counter: a ship-phase implementer wave with the latch set does not count", async () => {
  const h = harness({
    cwd: tempCwd({ piGauntlet: { closureReview: { maxFixRounds: 1 } } }),
    branch: verifyBranch([
      subagentResult(["conformance-reviewer"]),
      phaseResult("complete", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete" })),
      phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete", ship: "in_progress" })),
      subagentResult(["implementer"]),
      phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "in_progress", ship: "in_progress" })),
    ]),
  });
  await h.emit("session_start");
  assert.equal(await firstCallResult(h, "c1", implementerWave(1)), undefined);
});

test("counter reset: start implement and reset zero it; start verify --force keeps it", async () => {
  const mk = () => guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 1 }, flowGuards: { enforce: false } } }, [subagentResult(["implementer"])]);

  const force = mk();
  await force.emit("session_start");
  const forceTool = force.tools.find((t) => t.name === "phase_tracker")!;
  const forced = (await forceTool.execute("p1", { action: "start", phase: "verify", force: true }, undefined, undefined, force.ctx)) as { details: { error?: string } };
  assert.equal(forced.details.error, undefined);
  assert.equal((await firstCallResult(force, "c1", implementerWave(1)))?.block, true, "budget survives verify --force");

  const impl = mk();
  await impl.emit("session_start");
  const implTool = impl.tools.find((t) => t.name === "phase_tracker")!;
  for (const [id, input] of [
    ["p1", { action: "skip", phase: "verify", reason: "amendment" }],
    ["p2", { action: "start", phase: "implement", force: true }],
    ["p3", { action: "complete", phase: "implement" }],
    ["p4", { action: "start", phase: "verify", force: true }],
  ] as const) {
    const result = (await implTool.execute(id, input, undefined, undefined, impl.ctx)) as { details: { error?: string } };
    assert.equal(result.details.error, undefined);
  }
  assert.equal(await firstCallResult(impl, "c1", loneImplementer()), undefined, "latch cleared by start implement");
  await impl.emitEvent("tool_result", waveResult("audit", [{ agent: "conformance-reviewer", exitCode: 0 }]));
  assert.equal(await firstCallResult(impl, "c2", implementerWave(1)), undefined, "counter cleared by start implement");

  const reset = mk();
  await reset.emit("session_start");
  const resetTool = reset.tools.find((t) => t.name === "phase_tracker")!;
  const resetResult = (await resetTool.execute("p1", { action: "reset" }, undefined, undefined, reset.ctx)) as { details: { error?: string } };
  assert.equal(resetResult.details.error, undefined);
  assert.equal(await firstCallResult(reset, "c1", loneImplementer()), undefined, "dormant after reset");
});

test("replay: two implementer waves after the audit in verify restore fixRounds 2; the same waves in ship restore 0", async () => {
  const inVerify = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 2 } } }, [
    subagentResult(["implementer"]),
    subagentResult(["implementer", "code-reviewer"]),
  ]);
  await inVerify.emit("session_start");
  assert.equal((await firstCallResult(inVerify, "c1", implementerWave(1)))?.block, true);

  const inShip = harness({
    cwd: tempCwd({ piGauntlet: { closureReview: { maxFixRounds: 2 } } }),
    branch: verifyBranch([
      subagentResult(["conformance-reviewer"]),
      phaseResult("complete", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete" })),
      phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete", ship: "in_progress" })),
      subagentResult(["implementer"]),
      subagentResult(["implementer"]),
      phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "in_progress", ship: "in_progress" })),
    ]),
  });
  await inShip.emit("session_start");
  assert.equal(await firstCallResult(inShip, "c1", implementerWave(1)), undefined);
});

// --- Human overrule of the fix-round cap (spec 2026-09-14-fix-round-human-overrule) ---

const grantResult = (rounds: number, reason = "human approved") => ({
  type: "message",
  message: { role: "toolResult", toolName: "phase_tracker", details: {
    action: "grant_fix_rounds", rounds, reason,
    phases: phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "in_progress" }),
  } },
});

const grant = async (h: ReturnType<typeof harness>, id: string, input: Record<string, unknown>) =>
  (await h.tools.find((t) => t.name === "phase_tracker")!.execute(id, { action: "grant_fix_rounds", ...input }, undefined, undefined, h.ctx)) as {
    content: { type: string; text: string }[];
    details: { action: string; rounds?: number; reason?: string; error?: string };
  };

const exhaust = async (h: ReturnType<typeof harness>, rounds: number, prefix = "x") => {
  for (let i = 1; i <= rounds; i++) {
    assert.equal(await firstCallResult(h, `${prefix}${i}`, implementerWave(1)), undefined);
    await h.emitEvent("tool_result", okWave(`${prefix}${i}`));
  }
};

test("grant: funds extra waves and rejects another grant while credits remain", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { enforce: true } } });
  await h.emit("session_start");
  await exhaust(h, 3);
  const res = await grant(h, "g1", { rounds: 2, reason: "I'm approving 2 more rounds" });
  assert.equal(res.details.error, undefined);
  assert.deepEqual([res.details.rounds, res.details.reason], [2, "I'm approving 2 more rounds"]);
  assert.equal((await grant(h, "g2", { rounds: 1, reason: "more" })).details.error, "grant_fix_rounds: 2 granted round(s) still unused; spend them before granting more");
  await exhaust(h, 2, "c");
  const blocked = await firstCallResult(h, "c3", implementerWave(1));
  assert.equal(blocked?.block, true);
  assert.match(blocked?.reason ?? "", /5 fix round\(s\) used against a cap of 3 \(granted rounds included\)/);
});

test("grant: schema declares rounds as integer 1..MAX_SAFE_INTEGER; missing rounds or empty reason error without state change", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
  await h.emit("session_start");
  const params = h.tools.find((t) => t.name === "phase_tracker")!.parameters;
  const roundOptions = params.args[0].rounds.args[0].args[0];
  assert.equal(params.args[0].rounds.args[0].kind, "Integer");
  assert.deepEqual([roundOptions.minimum, roundOptions.maximum], [1, Number.MAX_SAFE_INTEGER]);
  assert.ok(params.args[0].action.values.includes("grant_fix_rounds"));

  const noRounds = await grant(h, "g1", { reason: "ok" });
  assert.equal(noRounds.details.error, "grant_fix_rounds requires rounds: a positive integer");
  assert.equal(noRounds.details.rounds, undefined);
  const noReason = await grant(h, "g2", { rounds: 1, reason: "   " });
  assert.equal(noReason.details.error, "grant_fix_rounds requires reason: the human's approval, quoted");
  assert.equal(noReason.details.rounds, undefined);
  assert.equal((await firstCallResult(h, "c1", implementerWave(1)))?.block, true, "no credit was granted");
});

test("grant: rejected when no cap block is live - before the audit, in implement, below the cap, enforce off, and in a child", async () => {
  const expectNotLive = async (h: ReturnType<typeof harness>, used: number, cap: number) => {
    const res = await grant(h, "g", { rounds: 1, reason: "ok" });
    assert.equal(res.details.error, `grant_fix_rounds: no fix-round cap block is active (${used} used, cap ${cap}); nothing to overrule`);
  };

  const preAudit = harness({ cwd: tempCwd({ piGauntlet: { closureReview: { maxFixRounds: 0 } } }), branch: verifyBranch() });
  await preAudit.emit("session_start");
  await expectNotLive(preAudit, 0, 0);

  const implement = harness({ cwd: tempCwd({ piGauntlet: { closureReview: { maxFixRounds: 0 } } }), branch: implementBranch([subagentResult(["conformance-reviewer"])]) });
  await implement.emit("session_start");
  await expectNotLive(implement, 0, 0);

  const below = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 3 } } });
  await below.emit("session_start");
  await exhaust(below, 2);
  await expectNotLive(below, 2, 3);

  const off = guardedHarness({ piGauntlet: { closureReview: { enforce: false, maxFixRounds: 0 } } });
  await off.emit("session_start");
  await expectNotLive(off, 0, 0);

  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  process.env.PI_SUBAGENT_DEPTH = "1";
  let child: ReturnType<typeof harness>;
  try {
    child = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
  } finally {
    if (priorDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
    else process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
  await child.emit("session_start");
  await expectNotLive(child, 0, 0);
});

test("grant: only qualifying synchronous parent task waves spend credits", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
  await h.emit("session_start");
  await grant(h, "g", { rounds: 1, reason: "ok" });
  await h.emitEvent("tool_result", waveResult("e1", [{ agent: "code-reviewer", exitCode: 0 }]));
  await h.emitEvent("tool_result", waveResult("e2", [{ agent: "implementer", exitCode: 0 }], true));
  await h.emitEvent("tool_result", waveResult("e3", []));
  assert.equal((await firstCallResult(h, "a", { ...implementerWave(1), async: true }))?.block, true);
  assert.equal((await firstCallResult(h, "l", loneImplementer()))?.block, true);
  assert.equal(await firstCallResult(h, "c", implementerWave(1)), undefined);
  await h.emitEvent("tool_result", okWave("c"));
  assert.equal((await firstCallResult(h, "d", implementerWave(1)))?.block, true);

  // In a child (PI_SUBAGENT_DEPTH >= 1, fixed at registration) both the cap gate and observeFixWave
  // are dormant, so credit consumption has no public effect; the observable contract is dormancy.
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  process.env.PI_SUBAGENT_DEPTH = "1";
  let child: ReturnType<typeof harness>;
  try {
    child = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } }, [grantResult(1), subagentResult(["implementer"])]);
  } finally {
    if (priorDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
    else process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
  await child.emit("session_start");
  assert.equal(await firstCallResult(child, "child-wave", implementerWave(1)), undefined, "child session: cap gate and observer are dormant, so the replayed grant and implementer result have no observable effect");
});

test("grant replay restores and spends the recorded pool independent of current cap; rejected grants restore no credit", async () => {
  const trail = [subagentResult(["implementer"]), subagentResult(["implementer"]), subagentResult(["implementer"]), grantResult(2), subagentResult(["implementer"])];
  const h = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 3 } } }, trail);
  await h.emit("session_start");
  assert.equal(
    (await grant(h, "g", { rounds: 1, reason: "more" })).details.error,
    "grant_fix_rounds: 1 granted round(s) still unused; spend them before granting more",
  );
  assert.equal(await firstCallResult(h, "c", implementerWave(1)), undefined);
  await h.emitEvent("tool_result", okWave("c"));
  const blocked = await firstCallResult(h, "d", implementerWave(1));
  assert.equal(blocked?.block, true);
  assert.match(blocked?.reason ?? "", /5 fix round\(s\) used against a cap of 3 \(granted rounds included\)/);

  // Same trail at cap 5: replay yields fixRounds = 4 (cap not live yet); lowering the live cap
  // exposes the one replayed credit, then wave 5 passes on the counter and wave 6 blocks.
  const capChanged = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 5 } } }, trail);
  await capChanged.emit("session_start");
  assert.equal(
    (await grant(capChanged, "g", { rounds: 1, reason: "more" })).details.error,
    "grant_fix_rounds: no fix-round cap block is active (4 used, cap 5); nothing to overrule",
    "replayed fixRounds = 4 regardless of cap on disk",
  );
  // Lower the cap on disk without spending a wave: the block goes live at 4 >= 3 and the grant
  // probe now reads the replayed pool - exactly one credit, independent of the cap at replay time.
  writeFileSync(join(capChanged.ctx.cwd, ".pi", "settings.json"), JSON.stringify({ piGauntlet: { closureReview: { maxFixRounds: 3 } } }));
  assert.equal(
    (await grant(capChanged, "g2", { rounds: 1, reason: "more" })).details.error,
    "grant_fix_rounds: 1 granted round(s) still unused; spend them before granting more",
    "same credits regardless of cap on disk",
  );
  writeFileSync(join(capChanged.ctx.cwd, ".pi", "settings.json"), JSON.stringify({ piGauntlet: { closureReview: { maxFixRounds: 5 } } }));
  assert.equal(await firstCallResult(capChanged, "c", implementerWave(1)), undefined);
  await capChanged.emitEvent("tool_result", okWave("c"));
  const blockedAt5 = await firstCallResult(capChanged, "d", implementerWave(1));
  assert.equal(blockedAt5?.block, true);
  assert.match(blockedAt5?.reason ?? "", /5 fix round\(s\) used against a cap of 5 \(granted rounds included\)/);

  const rejected = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } }, [{
    type: "message",
    message: {
      role: "toolResult",
      toolName: "phase_tracker",
      details: { action: "grant_fix_rounds", error: "grant_fix_rounds requires rounds: a positive integer", phases: phases({ verify: "in_progress" }) },
    },
  }]);
  await rejected.emit("session_start");
  assert.equal((await firstCallResult(rejected, "c1", implementerWave(1)))?.block, true, "no credits from a rejected grant");
});

test("grant reset: start implement and reset zero credits (live and replay); start verify --force keeps them", async () => {
  const settings = { piGauntlet: { closureReview: { maxFixRounds: 0 }, flowGuards: { enforce: false } } };

  const force = guardedHarness(settings, [grantResult(1)]);
  await force.emit("session_start");
  await force.tools.find((t) => t.name === "phase_tracker")!.execute("p", { action: "start", phase: "verify", force: true }, undefined, undefined, force.ctx);
  assert.equal(await firstCallResult(force, "c", implementerWave(1)), undefined);

  const liveImpl = guardedHarness(settings);
  await liveImpl.emit("session_start");
  await grant(liveImpl, "g", { rounds: 1, reason: "ok" });
  const tool = liveImpl.tools.find((t) => t.name === "phase_tracker")!;
  for (const [id, input] of [
    ["p1", { action: "skip", phase: "verify", reason: "amendment" }],
    ["p2", { action: "start", phase: "implement", force: true }],
    ["p3", { action: "complete", phase: "implement" }],
    ["p4", { action: "start", phase: "verify", force: true }],
  ] as const) {
    assert.equal(((await tool.execute(id, input, undefined, undefined, liveImpl.ctx)) as { details: { error?: string } }).details.error, undefined);
  }
  await liveImpl.emitEvent("tool_result", waveResult("audit", [{ agent: "conformance-reviewer", exitCode: 0 }]));
  assert.equal((await firstCallResult(liveImpl, "c1", implementerWave(1)))?.block, true, "credits zeroed by start implement (cap 0 blocks)");

  const reset = guardedHarness(settings);
  await reset.emit("session_start");
  await grant(reset, "g", { rounds: 1, reason: "ok" });
  const resetTool = reset.tools.find((t) => t.name === "phase_tracker")!;
  await resetTool.execute("p", { action: "reset" }, undefined, undefined, reset.ctx);
  assert.match((await grant(reset, "g2", { rounds: 1, reason: "ok" })).details.error ?? "", /no fix-round cap block is active/);
  for (const [id, input] of [
    ["p1", { action: "start", phase: "brainstorm" }],
    ["p2", { action: "complete", phase: "brainstorm" }],
    ["p3", { action: "start", phase: "plan" }],
    ["p4", { action: "complete", phase: "plan" }],
    ["p5", { action: "start", phase: "implement" }],
    ["p6", { action: "complete", phase: "implement" }],
    ["p7", { action: "start", phase: "verify" }],
  ] as const) {
    assert.equal(((await resetTool.execute(id, input, undefined, undefined, reset.ctx)) as { details: { error?: string } }).details.error, undefined);
  }
  await reset.emitEvent("tool_result", waveResult("audit", [{ agent: "conformance-reviewer", exitCode: 0 }]));
  assert.equal((await firstCallResult(reset, "c1", implementerWave(1)))?.block, true, "credits zeroed by reset (cap 0 blocks)");

  const replayImpl = harness({
    cwd: tempCwd(settings),
    branch: verifyBranch([
      subagentResult(["conformance-reviewer"]),
      grantResult(1),
      phaseResult("skip", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "skipped" })),
      phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "in_progress", verify: "skipped" })),
      phaseResult("complete", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "skipped" })),
      phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "in_progress" })),
      subagentResult(["conformance-reviewer"]),
    ]),
  });
  await replayImpl.emit("session_start");
  assert.equal((await firstCallResult(replayImpl, "c1", implementerWave(1)))?.block, true, "replayed start implement zeroed credits");

  const replayReset = harness({
    cwd: tempCwd(settings),
    branch: verifyBranch([
      subagentResult(["conformance-reviewer"]),
      grantResult(1),
      phaseResult("reset", phases({})),
      phaseResult("start", phases({ brainstorm: "in_progress" })),
      phaseResult("complete", phases({ brainstorm: "complete" })),
      phaseResult("start", phases({ brainstorm: "complete", plan: "in_progress" })),
      phaseResult("complete", phases({ brainstorm: "complete", plan: "complete" })),
      phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "in_progress" })),
      phaseResult("complete", phases({ brainstorm: "complete", plan: "complete", implement: "complete" })),
      phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "in_progress" })),
      subagentResult(["conformance-reviewer"]),
    ]),
  });
  await replayReset.emit("session_start");
  assert.equal((await firstCallResult(replayReset, "c1", implementerWave(1)))?.block, true, "replayed reset zeroed credits");
});

test("grant: block reason gives action, settings path, and live-read guidance", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
  await h.emit("session_start");
  const reason = (await firstCallResult(h, "c", implementerWave(1)))?.reason ?? "";
  assert.match(reason, /phase_tracker\(\{ action: "grant_fix_rounds"/);
  assert.ok(reason.includes(join(h.ctx.cwd, ".pi", "settings.json")));
  assert.match(reason, /no restart.*restate model and maxFixRounds/s);
});

test("gauntlet_setting registration requests sequential execution", () => {
  assert.equal(harness().tools.find((t) => t.name === "gauntlet_setting")!.executionMode, "sequential");
});

test("grant renderResult shows count and reason", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
  await h.emit("session_start");
  const res = await grant(h, "g", { rounds: 2, reason: "go on" });
  const tool = h.tools.find((t) => t.name === "phase_tracker")! as any;
  const rendered = tool.renderResult(res, {}, { fg: (_c: string, s: string) => s, bold: (s: string) => s });
  assert.match(JSON.stringify(rendered), /2.*go on/);
});

test("grant: child sessions cannot overrule even a zero cap", async () => {
  const priorDepth = process.env.PI_SUBAGENT_DEPTH;
  process.env.PI_SUBAGENT_DEPTH = "1";
  let child: ReturnType<typeof harness>;
  try {
    child = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
  } finally {
    if (priorDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
    else process.env.PI_SUBAGENT_DEPTH = priorDepth;
  }
  await child.emit("session_start");
  assert.match((await grant(child, "g", { rounds: 1, reason: "ok" })).details.error ?? "", /no fix-round cap block is active/);
});

test("grant: accepts MAX_SAFE_INTEGER and current on-disk cap controls whether the block is live", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
  await h.emit("session_start");
  const result = await grant(h, "g", { rounds: Number.MAX_SAFE_INTEGER, reason: "approved" });
  assert.equal(result.details.rounds, Number.MAX_SAFE_INTEGER);

  const changed = guardedHarness({ piGauntlet: { closureReview: { maxFixRounds: 0 } } });
  await changed.emit("session_start");
  writeFileSync(join(changed.ctx.cwd, ".pi", "settings.json"), JSON.stringify({ piGauntlet: { closureReview: { maxFixRounds: 1 } } }));
  assert.match((await grant(changed, "g", { rounds: 1, reason: "ok" })).details.error ?? "", /0 used, cap 1/);
});

const eightTasks = (open: number[]) =>
  Array.from({ length: 8 }, (_, i) => ({ name: `T${i + 1} task`, status: open.includes(i) ? "in_progress" : "complete" }));

const resultText = async (h: ReturnType<typeof harness>, id: string, isError = false) => {
  const [res] = (await h.emitEvent("tool_result", waveResult(id, [{ agent: "implementer", exitCode: 0 }], isError))) as (
    | { content: { text: string }[] }
    | undefined
  )[];
  return res?.content[0]?.text;
};

test("open-task nudge: verify-phase implementer wave lists mid-list open rows with the closure instruction, before any audit", async () => {
  const h = harness({ branch: verifyBranch([taskSnapshot(eightTasks([3]))]) });
  await h.emit("session_start");
  const text = await resultText(h, "w1");
  assert.ok(text, "nudge present");
  assert.match(text, /^Plan tasks still open after this repair wave:\n3: T4 task \(in_progress\)\nOnce this wave's repair is integrated and its re-review or re-audit accepts it, close that task: plan_tracker\(\{ action: "update", index: N, status: "complete" \}\)\. Leave unaccepted repairs in_progress\. A pending row is a task still to run, not to close\. Open tasks block complete verify\.$/);
  assert.doesNotMatch(text, /0: T1 task/);
});

// fixRounds is observed through the cap guard: one nudged wave against maxFixRounds 1
// blocks the next dispatch exactly as an un-nudged wave would.
test("open-task nudge: fires on every qualifying wave and leaves fix-round counting unchanged", async () => {
  const h = guardedHarness({ piGauntlet: { closureReview: { enforce: true, maxFixRounds: 1 } } }, [taskSnapshot(eightTasks([0, 3]))]);
  await h.emit("session_start");
  assert.equal(await firstCallResult(h, "c1", implementerWave(1)), undefined);
  assert.match((await resultText(h, "c1")) ?? "", /0: T1 task \(in_progress\)\n3: T4 task \(in_progress\)/);
  const blocked = await firstCallResult(h, "c2", implementerWave(1));
  assert.equal(blocked?.block, true, "one wave counted, cap 1 reached");
  const h2 = guardedHarness({ piGauntlet: { closureReview: { enforce: true } } }, [taskSnapshot(eightTasks([3]))]);
  await h2.emit("session_start");
  assert.match((await resultText(h2, "a")) ?? "", /^Plan tasks still open/);
  assert.match((await resultText(h2, "b")) ?? "", /^Plan tasks still open/);
});

// The closure-model mismatch warning is stashed at tool_call; it must render first.
test("open-task nudge: a stashed tool_call warning stays ahead of the nudge on the same result", async () => {
  const h = harness({
    cwd: tempCwd({ piGauntlet: { closureReview: { enforce: true, model: "p/configured" } } }),
    branch: verifyBranch([taskSnapshot(eightTasks([3]))]),
  });
  await h.emit("session_start");
  const call = { tasks: [{ agent: "conformance-reviewer", model: "p/other", task: "audit" }, { agent: "implementer", task: "fix", worktree: true }] };
  assert.equal(await firstCallResult(h, "m1", call), undefined);
  const text = (await resultText(h, "m1")) ?? "";
  const warningAt = text.indexOf("p/other");
  const nudgeAt = text.indexOf("Plan tasks still open after this repair wave:");
  assert.ok(warningAt >= 0 && nudgeAt > warningAt, `warning first, nudge second: ${text}`);
});

test("open-task nudge: silent outside the verify window and without open rows", async () => {
  const cases: [string, ReturnType<typeof harness>][] = [
    ["implement in progress", harness({ branch: implementBranch([taskSnapshot(eightTasks([3]))]) })],
    [
      "ship in progress",
      harness({
        branch: verifyBranch([
          phaseResult("complete", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete" })),
          phaseResult("start", phases({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete", ship: "in_progress" })),
          taskSnapshot(eightTasks([3])),
        ]),
      }),
    ],
    ["all tasks complete or skipped", harness({ branch: verifyBranch([taskSnapshot([...eightTasks([]).slice(0, 7), { name: "T8 task", status: "skipped" }])]) })],
    ["no snapshot on the branch", harness({ branch: verifyBranch() })],
    ["latest snapshot is a clear", harness({ branch: verifyBranch([taskSnapshot(eightTasks([3])), taskSnapshot([])]) })],
    ["rejected update is skipped, prior all-complete snapshot used", harness({ branch: verifyBranch([taskSnapshot(eightTasks([])), { type: "message", message: { role: "toolResult", toolName: "plan_tracker", details: { tasks: eightTasks([3]), error: "rejected" } } }]) })],
    ["flowGuards.enforce: false", harness({ cwd: tempCwd({ piGauntlet: { flowGuards: { enforce: false } } }), branch: verifyBranch([taskSnapshot(eightTasks([3]))]) })],
    ["async handle results: []", harness({ branch: verifyBranch([taskSnapshot(eightTasks([3]))]) })],
  ];
  for (const [label, h] of cases) {
    await h.emit("session_start");
    if (label === "async handle results: []") {
      assert.deepEqual(await h.emitEvent("tool_result", waveResult("x", [])), [undefined], label);
      continue;
    }
    assert.equal(await resultText(h, "x"), undefined, label);
  }
});

test("open-task nudge: closureReview.enforce: false does not silence it", async () => {
  const h = harness({ cwd: tempCwd({ piGauntlet: { closureReview: { enforce: false } } }), branch: verifyBranch([taskSnapshot(eightTasks([3]))]) });
  await h.emit("session_start");
  assert.match((await resultText(h, "k")) ?? "", /^Plan tasks still open/);
});

test("open-task nudge: silent on an isError result, a degraded settings read, and in a subagent child", async () => {
  const errored = harness({ branch: verifyBranch([taskSnapshot(eightTasks([3]))]) });
  await errored.emit("session_start");
  assert.equal(await resultText(errored, "e", true), undefined, "isError result");

  const malformed = tempCwd();
  mkdirSync(join(malformed, ".pi"), { recursive: true });
  writeFileSync(join(malformed, ".pi", "settings.json"), "{ not json");
  const degraded = harness({ cwd: malformed, branch: verifyBranch([taskSnapshot(eightTasks([3]))]) });
  await degraded.emit("session_start");
  assert.equal(await resultText(degraded, "d"), undefined, "settings errors");

  process.env.PI_SUBAGENT_DEPTH = "1";
  try {
    const child = harness({ branch: verifyBranch([taskSnapshot(eightTasks([3]))]) });
    await child.emit("session_start");
    assert.equal(await resultText(child, "c"), undefined, "subagent child");
  } finally {
    process.env.PI_SUBAGENT_DEPTH = "0";
  }
});
