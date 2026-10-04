import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { CONFIG, RUNS, CASES, ensure, pi, runtime, parseModelSpec, scratchAgentDir, lastAssistantText, toolCallsOf, consumerWorktree, removeWorktree, readJson } from "./lib.mjs";

export function scoutTemplate(skillsDir, ask, specIndex) {
  const text = readFileSync(join(skillsDir, "brainstorming/gatherer.md"), "utf8");
  const block = text.slice(text.indexOf("Scout (always dispatched):"), text.indexOf("Context-builder (conditional):"));
  const body = block.split("\n").filter((l) => l.startsWith(">")).map((l) => l.replace(/^>\s?/, "")).join("\n");
  return body
    .replace("<initial prompt verbatim>", ask)
    .replaceAll("<SPEC_INDEX>", specIndex)
    + "\n\nWrite nothing to disk. Return the complete handoff as your final message.";
}

export async function runScout(caseLabel, variant, variants) {
  const c = readJson(join(CASES, caseLabel, "case.json"));
  const ask = readFileSync(join(CASES, caseLabel, "ask.md"), "utf8").trim();
  const skillsDir = variants[variant].skillsDir;
  const outDir = ensure(join(RUNS, caseLabel, "scout"));
  const wt = consumerWorktree(caseLabel, c.base, `scout-${variant}`);
  const agentDir = scratchAgentDir(`scout-${caseLabel}-${variant}`);
  try {
    const persona = readFileSync(CONFIG.scoutPersona, "utf8").replace(/^---[\s\S]*?---\n/, "");
    const { model, thinkingLevel } = parseModelSpec(CONFIG.models.scout);
    const settingsManager = pi.SettingsManager.inMemory({});
    const loader = new pi.DefaultResourceLoader({
      cwd: wt, agentDir, settingsManager, noExtensions: true, noSkills: true, noPromptTemplates: true, noThemes: true,
      systemPromptOverride: () => persona, appendSystemPromptOverride: () => [],
    });
    await loader.reload();
    const { session } = await pi.createAgentSession({
      cwd: wt, agentDir, modelRuntime: runtime, model, thinkingLevel, tools: ["read", "grep", "find", "ls", "bash"],
      resourceLoader: loader, settingsManager, sessionManager: pi.SessionManager.inMemory(wt),
    });
    let handoff = "";
    let toolCalls = [];
    try {
      await session.prompt(scoutTemplate(skillsDir, ask, variants.specIndex));
      handoff = lastAssistantText(session);
      toolCalls = toolCallsOf(session, 0);
    } finally { session.dispose(); }
    if (!handoff.trim()) throw new Error(`scout ${caseLabel}/${variant}: empty handoff`);
    const assembledDraft = `# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing\n\n## Codebase recon\n${handoff.trim()}\n\n## External context\n${c.external || "(none recorded)"}\n\n## Appended during questionary\n`;
    const draft = (c.worktreeRoot ? assembledDraft.replaceAll(c.worktreeRoot, wt) : assembledDraft)
      .replace(new RegExp(CONFIG.consumerRepo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[^/\\s`]*", "g"), wt)
      .replaceAll(CONFIG.consumerRepo, wt);
    writeFileSync(join(outDir, `${variant}.md`), draft);
    writeFileSync(join(outDir, `${variant}.tool-calls.md`), toolCalls.join("\n") + "\n");
    const framing = (handoff.match(/^Framing:.*$/m) || [null])[0];
    writeFileSync(join(outDir, `${variant}.json`), JSON.stringify({ wt, framingLine: framing, model: CONFIG.models.scout, toolCalls }, null, 2) + "\n");
    return { draft, framing };
  } finally {
    removeWorktree(wt);
    rmSync(agentDir, { recursive: true, force: true });
  }
}
