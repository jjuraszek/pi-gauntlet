import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { CONFIG, RUNS, CASES, ensure, pi, Type, runtime, parseModelSpec, scratchAgentDir, lastAssistantText, toolCallsOf, consumerWorktree, removeWorktree, oneShot, extractJson, readJson, sha256, slug } from "./lib.mjs";

const ok = (text) => ({ content: [{ type: "text", text }], details: {} });

function stubTools(specDir) {
  return [
    pi.defineTool({ name: "phase_tracker", label: "phase_tracker", description: "Track workflow phase progress.", parameters: Type.Object({ action: Type.String(), phase: Type.Optional(Type.String()), substep: Type.Optional(Type.Union([Type.String(), Type.Null()])), reason: Type.Optional(Type.String()) }), execute: async () => ok('{"ok":true}') }),
    pi.defineTool({ name: "plan_tracker", label: "plan_tracker", description: "Track plan execution.", parameters: Type.Object({ action: Type.String(), tasks: Type.Optional(Type.Array(Type.Any())), index: Type.Optional(Type.Number()), status: Type.Optional(Type.String()) }), execute: async () => ok('{"ok":true}') }),
    pi.defineTool({ name: "gauntlet_setting", label: "gauntlet_setting", description: "Resolve merged piGauntlet.* settings.", parameters: Type.Object({ key: Type.String() }), execute: async (_id, { key }) => {
      const payloads = {
        flowGuards: { key, enforce: true, specDirs: [specDir], planDirs: [specDir.replace(/specs$/, "plans")], errors: [] },
        specCouncil: { key, verdict: "worker", members: [], chair: undefined, malformed: false, warning: "", errors: [] },
        closureReview: { key, enforce: true, model: undefined, maxFixRounds: 3, errors: [] },
        escalationLoop: { key, implModel: undefined, errors: [] },
      };
      const payload = payloads[key] || { key, errors: [`unknown key ${key}`] };
      return { ...ok("```json\n" + JSON.stringify(payload, null, 2) + "\n```"), details: payload };
    } }),
    pi.defineTool({ name: "subagent", label: "subagent", description: "Delegate to subagents.", parameters: Type.Object({}, { additionalProperties: true }), execute: async () => ({ content: [{ type: "text", text: "Error: subagent unavailable in replay - do the recon directly with read, grep, find, ls, and bash." }], details: {}, isError: true }) }),
  ];
}

const SIM_SYSTEM = `You play the human user in a design discussion with a coding agent. You answer ONLY from the facts below: the original ask and the recorded answers this user gave in the real discussion. Rules: pick the recorded answer whose question matches best and restate it in the user's voice, short; when the agent asks something the record does not cover, reply exactly "not decided - your call"; never invent requirements, never mention any shipped design, never propose alternatives of your own unless a recorded answer contains one. Classify the agent's message first. Output one JSON object and nothing else:
{"kind": "question" | "approaches" | "other", "reply": "<your reply, empty when kind is approaches>", "unanswered": <true when you replied not decided - your call>, "supplied_alternative": <true when your reply names a design alternative that came from the record>}
A message offering lettered options A)/B)/C) with a Recommendation: <letter> line is a QUESTION in this discussion format. Answer with the letter from the matching recorded answer, plus a short reason when the record has one; when the record does not cover it, reply exactly "not decided - your call". kind is "approaches" only when the message compares two or more named design approaches (architectures or implementation strategies, usually introduced as approaches or options with trade-offs), recommends one of them as the design to build, even when it ends with a question asking the user to pick an approach. An approaches message may end by asking the user to pick one of the approaches; that is still kind "approaches". kind is "other" for a status message or a statement that needs no answer; reply then with "go on".`;

const approachHeading = /^\s*(?:#{1,4}\s*|\*\*|-\s*\*\*)?Approach\s+[A-D1-3]\b/gim;
export const looksLikeQuestionaryQuestion = (t) => /^\s*(?:-\s*)?\**[A-D]\)/m.test(t) && /Recommendation:\s*\**[A-D]/.test(t) && (t.match(/approach/gi) || []).length < 2 && !(t.match(approachHeading) || []).length;
export const isApproachesMessage = (t) => !looksLikeQuestionaryQuestion(t) && !/A\) as framed/.test(t) && (t.match(approachHeading) || []).length >= 2 && /Recommendation:/i.test(t);

function simFacts(ask, qa) {
  return `## Original ask\n${ask}\n\n## Recorded answers (question excerpt -> answer)\n` + qa.map((p, i) => `${i + 1}. Q: ${p.question.replace(/\s+/g, " ").slice(-700)}\n   A: ${p.answer}`).join("\n");
}

export async function driveRun({ caseLabel, candidate, variant, rep, variants }) {
  const c = readJson(join(CASES, caseLabel, "case.json"));
  const ask = readFileSync(join(CASES, caseLabel, "ask.md"), "utf8").trim();
  const outDir = ensure(join(RUNS, caseLabel, slug(candidate), variant));
  const wt = consumerWorktree(caseLabel, c.base, `drive-${variant}-${rep}`);
  const agentDir = scratchAgentDir(`drive-${caseLabel}-${variant}-${rep}`);
  const specPath = join(wt, c.spec);
  const specDir = dirname(c.spec);
  const skillsDir = variants[variant].skillsDir;
  const log = [];
  const run = { case: caseLabel, candidate, variant, rep, complete: false, incomplete_reason: null, turns: 0, facts: { approachesSkipped: false }, skill: {} };
  try {
    const draft = readFileSync(join(RUNS, caseLabel, "scout", `${variant}.md`), "utf8");
    mkdirSync(dirname(specPath), { recursive: true });
    const scout = readJson(join(RUNS, caseLabel, "scout", `${variant}.json`));
    const rewrittenDraft = draft.replaceAll(scout.wt, wt);
    writeFileSync(specPath, rewrittenDraft);
    const { model, thinkingLevel } = parseModelSpec(candidate);
    const settingsManager = pi.SettingsManager.inMemory({});
    const loader = new pi.DefaultResourceLoader({
      cwd: wt, agentDir, settingsManager, noExtensions: true, noPromptTemplates: true, noThemes: true,
      skillsOverride: () => pi.loadSkillsFromDir({ dir: skillsDir, source: "replay" }),
    });
    await loader.reload();
    const skill = loader.getSkills().skills.find((s) => s.name === "brainstorming");
    if (!skill || !skill.filePath.startsWith(skillsDir)) {
      run.incomplete_reason = `skill resolution failed for ${variant}: ${skill?.filePath ?? skillsDir}`;
      run.abort = "skill-resolution";
      throw new Error(run.incomplete_reason);
    }
    run.skill = { path: skill.filePath, skillMd: sha256(skill.filePath), gathererMd: sha256(join(skill.baseDir, "gatherer.md")) };
    if (run.skill.skillMd !== variants[variant].skillMd || run.skill.gathererMd !== variants[variant].gathererMd) {
      run.incomplete_reason = `skill hash mismatch for ${variant}: ${skill.filePath}`;
      run.abort = "hash-mismatch";
      throw new Error(run.incomplete_reason);
    }
    const { session } = await pi.createAgentSession({
      cwd: wt, agentDir, modelRuntime: runtime, model, thinkingLevel,
      tools: ["read", "bash", "edit", "write", "grep", "find", "ls"], customTools: stubTools(specDir),
      resourceLoader: loader, settingsManager, sessionManager: pi.SessionManager.inMemory(wt),
    });
    try {
      let questionsAnswered = 0;
      let approachesSkipped = false;
      let prompt = `/skill:brainstorming Resume at checklist step 4 with the draft at \`${specPath}\`; steps 1-3 are done. The draft's ticket content under \`## External context\` is the fetched ticket; the tracker CLI is unavailable in this environment, do not re-fetch.`;
      for (let turn = 1; turn <= CONFIG.turnCap; turn++) {
        const before = session.messages.length;
        log.push(`## Turn ${turn} - user${turn === 1 ? "" : "-sim"}\n\n${prompt}\n`);
        if (turn > 1) questionsAnswered++;
        await session.prompt(prompt);
        run.turns = turn;
        const text = lastAssistantText(session);
        const calls = toolCallsOf(session, before);
        log.push(`## Turn ${turn} - assistant (${candidate})\n\n${text}\n\n<tool calls>\n${calls.map((x) => "- " + x).join("\n")}\n`);
        const isQuestion = looksLikeQuestionaryQuestion(text);
        if (!isQuestion && isApproachesMessage(text)) {
          run.complete = true;
          log.push(`## Turn ${turn} - completion\n\ndeterministic: approach headings + Recommendation\n`);
          break;
        }
        const designOrSpec = /^#{1,4}\s.*\b(round 1|design)\b.*$/im.test(text) && /\b(responsibilit|data flow|architecture)\b/i.test(text) || calls.some((c) => c.startsWith("write(") && c.includes(JSON.stringify(specPath).slice(1, 80)));
        if (!isQuestion && designOrSpec && !run.complete) {
          run.complete = true;
          approachesSkipped = true;
          log.push(`## Turn ${turn} - completion\n\napproaches skipped: round-1 design or spec write reached\n`);
          break;
        }
        const simRaw = await oneShot(CONFIG.models.userSim, SIM_SYSTEM, `${simFacts(ask, c.qa)}\n\n## Agent message to classify and answer\n${text}${isQuestion ? '\n\nThis is a questionary question. Supply the reply; its kind is forced to "question".' : ""}`);
        const sim = extractJson(simRaw) || { kind: "other", reply: "go on", unanswered: false, supplied_alternative: false };
        log.push(`## Turn ${turn} - user-sim result\n\n${JSON.stringify({ ...sim, effectiveKind: isQuestion ? "question" : sim.kind })}\n`);
        if (isQuestion) sim.kind = "question";
        if (sim.kind === "approaches") { run.complete = true; break; }
        const tags = [sim.unanswered ? "unanswered" : null, sim.supplied_alternative ? "sim-supplied-alternative" : null].filter(Boolean);
        prompt = sim.reply;
        if (tags.length) log.push(`[${tags.join(", ")}]\n`);
      }
      if (!run.complete) run.incomplete_reason = `turn cap ${CONFIG.turnCap} reached without an approaches message`;
      const all = log.join("\n");
      run.facts = {
        approachesSkipped,
        questionsAnswered,
        patternLines: (all.match(/^\s*Pattern:/gm) || []).length,
        flipCondition: /flip|would change (the|my) recommendation|changes? the recommendation if/i.test(all),
        framingQuestion: /A\) as framed/.test(all),
        holdsStatement: /framing holds/i.test(all),
        toolCalls: toolCallsOf(session, 0).length,
      };
    } finally { session.dispose(); }
  } catch (err) {
    run.incomplete_reason = run.incomplete_reason || `error: ${err.message}`;
    log.push(`## Error\n\n${err.stack || err.message}\n`);
  } finally {
    removeWorktree(wt);
    rmSync(agentDir, { recursive: true, force: true });
  }
  writeFileSync(join(outDir, `${rep}.md`), `# ${caseLabel} / ${candidate} / ${variant} / rep ${rep}\n\n${log.join("\n")}`);
  writeFileSync(join(outDir, `${rep}.json`), JSON.stringify(run, null, 2) + "\n");
  return run;
}

