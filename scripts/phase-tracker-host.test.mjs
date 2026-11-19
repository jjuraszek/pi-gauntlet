import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

// Run the candidate delivery hook on the installed host, not the unit-test Pi stubs.
// The control uses the same boundary proposal without the idle guard.
const install = process.env.PI_MANAGED_INSTALL_ROOT;
assert.ok(install, "Run the host ordering check with a managed Pi install");
const version = readFileSync(join(install, "current-version"), "utf8").trim();
const host = join(install, "releases", version, "node_modules/@earendil-works");
const agentDir = mkdtempSync(join(tmpdir(), "phase-tracker-host-"));
after(() => rmSync(agentDir, { recursive: true, force: true }));
process.env.PI_CODING_AGENT_DIR = agentDir;
process.env.PI_OFFLINE = "1";
const { createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager } = await import(join(host, "pi-coding-agent/dist/index.js"));
const { fauxProvider, fauxAssistantMessage, fauxToolCall } = await import(join(host, "pi-ai/dist/providers/faux.js"));

const work = "Work a wave.";
const summary = "The first wave is complete.";
const restart = "implement-continue";
const foreign = "Check the decision.";
const mark = "gauntlet: question";
const tasks = [{ name: "next task", status: "in_progress" }];

for (const [name, requireIdle] of [["boundary delivery control", false], ["implement restart with the required idle guard", true]]) {
  test(`${name} runs once before a foreign extension's marked stop`, async (t) => {
    const requests = [], errors = [], trace = [];
    const faux = fauxProvider();
    const reply = ({ messages }) => {
      const last = messages.at(-1);
      const cause = last.role === "toolResult" ? last.toolName : last.content[0].text;
      requests.push(cause);
      if (cause === work) return fauxAssistantMessage(fauxToolCall("plan_tracker", {}), { stopReason: "toolUse" });
      return fauxAssistantMessage(cause === "plan_tracker" ? summary : cause === foreign ? mark : "Wave resumed.");
    };
    faux.setResponses(Array(5).fill(reply));
    const modelRuntime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"), modelsPath: null, refreshOnCreate: false });
    modelRuntime.registerNativeProvider(faux.provider);
    const settingsManager = SettingsManager.inMemory({ compaction: { enabled: false }, retry: { enabled: false } });
    let foreignRequested = false;
    const resourceLoader = new DefaultResourceLoader({
      cwd: agentDir, agentDir, settingsManager, noExtensions: true,
      extensionFactories: [pi => pi.on("agent_settled", (event, ctx) => {
        trace.push(`settled idle=${ctx.isIdle()} aborted=${event.aborted}`);
        if (foreignRequested) return;
        foreignRequested = true;
        pi.sendMessage({ customType: "other-extension", content: foreign, display: true }, { triggerTurn: true });
      }), pi => pi.on("agent_before_settle", (event, ctx) => {
        const branch = ctx.sessionManager.getBranch();
        const message = branch.findLast(e => e.type === "message" && e.message.role === "assistant").message;
        const text = message.content[0]?.text;
        trace.push(`before ${JSON.stringify(text)} idle=${ctx.isIdle()} pending=${ctx.hasPendingMessages()}`);
        if (text !== summary) return;
        assert.equal(message.stopReason, "stop");
        const snapshot = branch.findLast(e => e.type === "message" && e.message.toolName === "plan_tracker");
        assert.deepEqual(snapshot?.message.details.tasks, tasks);
        if (requireIdle && !ctx.isIdle()) return;
        return { entries: [...event.entries, {
          type: "custom_message", customType: "pi-gauntlet-transition-recovery", content: restart,
          details: { piGauntletRecoveryEdge: restart }, display: true,
        }], continue: true };
      })],
    });
    await resourceLoader.reload();
    const { session, extensionsResult } = await createAgentSession({
      agentDir, cwd: agentDir, resourceLoader, settingsManager, sessionManager: SessionManager.inMemory(agentDir),
      modelRuntime, model: faux.getModel(), tools: ["plan_tracker"], customTools: [{
        name: "plan_tracker", label: "Move a task", description: "Move a task", parameters: { type: "object", properties: {} },
        execute: async () => ({ content: [{ type: "text", text: "Task started." }], details: { tasks } }),
      }],
    });
    try {
      assert.deepEqual(extensionsResult.errors, []);
      await session.bindExtensions({ onError: error => errors.push(error) });
      await session.prompt(work);
      t.diagnostic(`Pi ${version}: ${trace.join(" -> ")}`);
      assert.deepEqual(errors, []);
      const last = session.sessionManager.getBranch().findLast(e => e.type === "message" && e.message.role === "assistant");
      assert.equal(last?.message.content[0].text, mark, "no restart may run past the marked stop");
      assert.deepEqual(requests, [work, "plan_tracker", restart, foreign], "the provider must see one restart before the competing request");
    } finally { session.dispose(); }
  });
}
