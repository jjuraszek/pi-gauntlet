import assert from "node:assert/strict";
import { test } from "node:test";
import registerPhaseTracker from "./phase-tracker.ts";

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

function harness(options: { branch?: unknown[]; idle?: boolean; beforeSettled?: (setIdle: (idle: boolean) => void) => void; sendThrows?: boolean } = {}) {
  const handlers = new Map<string, ((event: unknown, ctx: unknown) => unknown)[]>();
  const tools: { name: string; execute: (...args: any[]) => unknown }[] = [];
  const sent: { message: any; options: any }[] = [];
  let idle = options.idle ?? true;
  const ctx = {
    cwd: process.cwd(),
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
  return { emit, sent, tools, setIdle: (next: boolean) => (idle = next) };
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
