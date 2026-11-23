import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { after, test } from "node:test";

// Exercise the running Pi version locally and the pinned development host in CI.
const install = process.env.PI_MANAGED_INSTALL_ROOT;
const managed = install && join(install, "releases", readFileSync(join(install, "current-version"), "utf8").trim(), "node_modules/@earendil-works");
const tracker = fileURLToPath(new URL("../extensions/phase-tracker.ts", import.meta.url));
process.env.PI_SUBAGENT_DEPTH = "0";
const agentDir = mkdtempSync(join(tmpdir(), "phase-tracker-host-"));
after(() => rmSync(agentDir, { recursive: true, force: true }));
process.env.PI_CODING_AGENT_DIR = agentDir;
process.env.PI_OFFLINE = "1";
const { createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager } = await import(managed ? join(managed, "pi-coding-agent/dist/index.js") : "@earendil-works/pi-coding-agent");
const { fauxProvider, fauxAssistantMessage, fauxToolCall } = await import(managed ? join(managed, "pi-ai/dist/providers/faux.js") : "@earendil-works/pi-ai/providers/faux");

const work = "Work a wave.";
const summary = "The first wave is complete.";
const restart = "implement-continue";
const foreign = "Check the decision.";
const mark = "gauntlet: question";
const tasks = [{ name: "next task", status: "in_progress" }];
const latestAssistant = branch => branch.findLast(e => e.type === "message" && e.message.role === "assistant").message;

async function runWave(extensionFactories, { trackerOrder = "first", phase = "implement", status = "in_progress", engine } = {}) {
  const requests = [], errors = [];
  const faux = fauxProvider();
  const reply = ({ messages }) => {
    const last = messages.at(-1);
    const cause = last.role === "toolResult" ? last.toolName : last.content[0].text;
    requests.push(cause.startsWith("Your last message ended the turn during the implementation phase") ? restart : cause);
    if (cause === work) return fauxAssistantMessage(fauxToolCall("plan_tracker", {}), { stopReason: "toolUse" });
    return fauxAssistantMessage(cause === "plan_tracker" ? summary : cause === foreign ? mark : "Wave resumed.");
  };
  faux.setResponses(Array(5).fill(reply));
  const modelRuntime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false });
  modelRuntime.registerNativeProvider(faux.provider);
  const settingsManager = SettingsManager.inMemory({ compaction: { enabled: false }, retry: { enabled: false } });
  const resourceLoader = new DefaultResourceLoader({
    cwd: agentDir, agentDir, settingsManager, noExtensions: true,
    additionalExtensionPaths: trackerOrder === "omit" ? [] : [tracker], extensionFactories,
    extensionsOverride: result => {
      if (trackerOrder !== "last") return result;
      const [production, ...competitors] = result.extensions;
      assert.equal(production.resolvedPath, tracker);
      return { ...result, extensions: [...competitors, production] };
    },
  });
  await resourceLoader.reload();
  const sessionManager = SessionManager.inMemory(agentDir);
  const phaseNames = ["brainstorm", "plan", "implement", "verify", "ship"];
  for (const [current, currentStatus] of [["brainstorm", "in_progress"], [phase, status]]) {
    const phases = Object.fromEntries(phaseNames.map((name, index) => [name, {
      status: name === current ? currentStatus : index < phaseNames.indexOf(current) ? "complete" : "pending",
    }]));
    if (engine && phases.brainstorm.status === "complete") phases.brainstorm.engine = engine;
    sessionManager.appendMessage({ role: "toolResult", toolName: "phase_tracker", toolCallId: current, timestamp: Date.now(),
      content: [{ type: "text", text: `${current}: ${currentStatus}.` }], isError: false,
      details: { action: currentStatus === "complete" ? "complete" : "start", phases } });
  }
  const { session, extensionsResult } = await createAgentSession({
    agentDir, cwd: agentDir, resourceLoader, settingsManager, sessionManager,
    modelRuntime, model: faux.getModel(), tools: ["plan_tracker"], customTools: [{
      name: "plan_tracker", label: "Move a task", description: "Move a task", parameters: { type: "object", properties: {} },
      execute: async () => ({ content: [{ type: "text", text: "Task started." }], details: { tasks } }),
    }],
  });
  try {
    assert.deepEqual(extensionsResult.errors, []);
    await session.bindExtensions({ onError: error => errors.push(error) });
    await session.prompt(work);
    assert.deepEqual(errors, []);
    return { branch: sessionManager.getBranch(), requests };
  } finally { session.dispose(); }
}

for (const [name, control] of [["boundary delivery control", true], ["phase tracker", false]]) {
  test(`${name} runs once before a foreign extension's marked stop`, async () => {
    let foreignRequested = false;
    const { branch, requests } = await runWave([pi => pi.on("agent_settled", () => {
      if (foreignRequested) return;
      foreignRequested = true;
      pi.sendMessage({ customType: "other-extension", content: foreign, display: true }, { triggerTurn: true });
    }), pi => pi.on("agent_before_settle", (event, ctx) => {
      if (!control) return;
      const history = ctx.sessionManager.getBranch();
      const message = latestAssistant(history);
      if (message.content[0]?.text !== summary) return;
      assert.equal(message.stopReason, "stop");
      const snapshot = history.findLast(e => e.type === "message" && e.message.toolName === "plan_tracker");
      assert.deepEqual(snapshot?.message.details.tasks, tasks);
      assert.equal(ctx.isIdle(), false);
      assert.equal(event.continue, false);
      assert.deepEqual(event.context.pendingMessages, []);
      return { entries: [...event.entries, {
        type: "custom_message", customType: "pi-gauntlet-transition-recovery", content: restart,
        details: { piGauntletRecoveryEdge: restart }, display: true,
      }], continue: true };
    })], { trackerOrder: control ? "omit" : "last" });
    const restarts = branch.filter(e => e.type === "custom_message" && e.customType === "pi-gauntlet-transition-recovery");
    assert.deepEqual(restarts.map(e => e.details?.piGauntletRecoveryEdge), [restart]);
    assert.equal(latestAssistant(branch).content[0].text, mark, "no restart may run past the marked stop");
    assert.deepEqual(requests, [work, "plan_tracker", restart, foreign], "the provider must see one restart before the competing request");
  });
}

test("an unsuccessful boundary delivery never queues a fallback", async () => {
  let declined = 0;
  const { branch, requests } = await runWave([pi => pi.on("agent_before_settle", event => {
    if (!event.continue) return;
    assert.equal(event.entries.at(-1)?.details?.piGauntletRecoveryEdge, restart);
    declined++;
    return { continue: false, entries: [] };
  })]);
  assert.equal(declined, 1);
  assert.equal(latestAssistant(branch).content[0].text, summary);
  assert.deepEqual(requests, [work, "plan_tracker"]);
});

for (const [phase, stepFile] of [
  ["plan", "implement/waves/waves.md"],
  ["verify", "ship/ship.md"],
]) {
  const path = fileURLToPath(new URL(`../skills/gauntlet/${stepFile}`, import.meta.url));
  const message = `Continue the approved workflow now. Read ${path}.`;
  test(`${phase} completion delivers its original handoff once without an implement restart`, async () => {
    const { branch, requests } = await runWave([], { phase, status: "complete", engine: "waves" });
    assert.deepEqual(requests, [work, "plan_tracker", message]);
    assert.ok(!branch.some(e => e.details?.piGauntletRecoveryEdge === restart));
  });
}

test("aborting after a normal stop skips the boundary and never queues a fallback", async () => {
  const events = [];
  const { branch, requests } = await runWave([pi => {
    pi.on("agent_end", (_event, ctx) => ctx.abort());
    pi.on("agent_before_settle", () => { events.push("before"); });
    pi.on("agent_settled", event => { events.push({ aborted: event.aborted }); });
  }]);
  assert.equal(latestAssistant(branch).stopReason, "stop");
  assert.equal(latestAssistant(branch).content[0].text, summary);
  assert.deepEqual(events, [{ aborted: true }]);
  assert.ok(!branch.some(e => e.details?.piGauntletRecoveryEdge === restart));
  assert.deepEqual(requests, [work, "plan_tracker"]);
});

test("aborting after the restart is drafted settles aborted without another provider request", async () => {
  const settlements = [];
  const { requests } = await runWave([pi => {
    pi.on("agent_before_settle", (event, ctx) => {
      assert.equal(event.continue, true);
      assert.equal(event.entries.at(-1)?.details?.piGauntletRecoveryEdge, restart);
      ctx.abort();
    });
    pi.on("agent_settled", event => { settlements.push(event.aborted); });
  }]);
  assert.deepEqual(settlements, [true]);
  assert.deepEqual(requests, [work, "plan_tracker"], "no provider requests after the boundary");
});
