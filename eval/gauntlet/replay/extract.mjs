import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { CONFIG, CASES, VARIANTS, ISO_HOME, ensure, sh, writeJson } from "./lib.mjs";

const textOf = (msg) => (msg.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n");

export function extractCase(c) {
  const sessionPath = join(CONFIG.sessionsDir, c.session);
  let raw;
  try { raw = readFileSync(sessionPath, "utf8"); } catch { throw new Error(`case ${c.label}: transcript missing: ${sessionPath}`); }
  let shippedSpec;
  try { shippedSpec = sh("git", ["-C", CONFIG.consumerRepo, "show", `HEAD:${c.spec}`]); } catch { throw new Error(`case ${c.label}: shipped spec missing on main: ${c.spec}`); }
  try { sh("git", ["-C", CONFIG.consumerRepo, "cat-file", "-e", `${c.base}^{commit}`]); } catch { throw new Error(`case ${c.label}: base commit missing: ${c.base}`); }

  const events = raw.split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter((e) => e && e.type === "message");
  let draft = null, draftPath = null, draftIdx = -1, specIdx = -1, baselineModel = null;
  for (const e of raw.split("\n").filter(Boolean)) { try { const p = JSON.parse(e); if (p.type === "model_change") baselineModel = `${p.provider}/${p.modelId}`; } catch {} }
  events.forEach((e, i) => {
    const m = e.message;
    if (m.role === "assistant") for (const part of m.content || []) {
      if (part.type !== "toolCall" || part.name !== "write") continue;
      const content = part.arguments?.content || "";
      if (draftIdx < 0 && content.startsWith("# CONTEXT DRAFT")) { draftIdx = i; draft = content; draftPath = part.arguments.path; }
      else if (draftIdx >= 0 && specIdx < 0 && part.arguments?.path === draftPath) specIdx = i;
    }
  });
  if (draftIdx < 0) throw new Error(`case ${c.label}: no context draft write in transcript`);
  if (specIdx < 0) specIdx = events.length;

  const qa = [];
  let lastAssistant = "";
  for (let i = draftIdx; i < specIdx; i++) {
    const m = events[i].message;
    if (m.role === "assistant") { const t = textOf(m); if (t.trim()) lastAssistant = t; }
    if (m.role === "user") { const t = textOf(m).trim(); if (t && !t.startsWith("<skill")) qa.push({ question: lastAssistant.slice(-2500), answer: t }); }
  }
  const external = (draft.match(/## External context\n([\s\S]*?)(?=\n## Appended during questionary|$)/) || [, ""])[1].trim();
  const worktreeRoot = draftPath.endsWith(c.spec) ? draftPath.slice(0, draftPath.length - c.spec.length - 1) : null;

  const dir = ensure(join(CASES, c.label));
  writeFileSync(join(dir, "ask.md"), c.ask);
  writeFileSync(join(dir, "recorded-draft.md"), draft);
  writeFileSync(join(dir, "shipped-spec.md"), shippedSpec);
  writeJson(join(dir, "case.json"), { ...c, baselineModel, draftPath, worktreeRoot, external, qa });
  return { ...c, baselineModel, draftPath, worktreeRoot, external, qa, ask: c.ask, shippedSpec };
}

if (process.argv[1] && process.argv[1].endsWith("extract.mjs")) {
  try {
    for (const c of CONFIG.cases) { const r = extractCase(c); console.log(c.label, "qa", r.qa.length, "baseline", r.baselineModel, "root", r.worktreeRoot); }
  } finally {
    rmSync(VARIANTS, { recursive: true, force: true });
    rmSync(ISO_HOME, { recursive: true, force: true });
  }
}
