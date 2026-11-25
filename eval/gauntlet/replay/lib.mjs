import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, chmodSync, mkdtempSync, symlinkSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const CONFIG = JSON.parse(readFileSync(join(HERE, "cases.json"), "utf8"));
export const RUNS = join(HERE, "runs");
export const VARIANTS = mkdtempSync(join(process.env.TMPDIR || "/tmp", "replay-skills-"));
export const CASES = join(HERE, "cases");

export const pi = await import(pathToFileURL(join(CONFIG.piPackage, "dist/index.js")).href);
export const { Type } = await import(pathToFileURL(join(CONFIG.piPackage, "node_modules/typebox/build/index.mjs")).href);

export function parseModelSpec(spec) {
  const [provider, rest] = spec.split("/");
  const [id, thinking = "medium"] = rest.split(":");
  const model = runtime.getModel(provider, id);
  if (!model) throw new Error(`model not found: ${spec}`);
  return { model, thinkingLevel: thinking };
}

export const slug = (s) => s.replace(/[^A-Za-z0-9]+/g, "-");
export const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
export const ensure = (dir) => (mkdirSync(dir, { recursive: true }), dir);
export const writeJson = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
export const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
export const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });

export const ISO_HOME = join(process.env.TMPDIR || "/tmp", `brainstorm-replay-home-${process.pid}`);
rmSync(ISO_HOME, { recursive: true, force: true });
ensure(ISO_HOME);
const SHIM = ensure(join(ISO_HOME, "bin"));
symlinkSync(sh("which", ["git"]).trim(), join(SHIM, "git"));
symlinkSync(process.execPath, join(SHIM, "node"));
for (const name of ["rg", "fd"]) {
  let target;
  try { target = sh("which", [name]).trim(); } catch { continue; }
  symlinkSync(target, join(SHIM, name));
}
for (const name of ["linearis", "gh", "glab", "jira"]) {
  const path = join(SHIM, name);
  writeFileSync(path, '#!/bin/sh\necho "replay: $0 is unavailable in this environment - work from the checkout only" >&2\nexit 75\n');
  chmodSync(path, 0o755);
}
process.env.PATH = [SHIM, "/usr/bin", "/bin"].join(":");
process.env.HOME = ISO_HOME;
for (const k of Object.keys(process.env)) if (/^(LINEAR|GH_|GITHUB|JIRA|GLAB|ANTHROPIC|OPENAI|COPILOT|MISE|npm_|PI_|GOOGLE|GEMINI|AWS_|OPENROUTER|GROQ|MISTRAL|XAI|AZURE|CLAUDE|VERTEX|BEDROCK|DEEPSEEK|TOGETHER|FIREWORKS|CEREBRAS|HF_|HUGGING)/i.test(k) || /(_API_KEY|_TOKEN|_SECRET)$/i.test(k)) delete process.env[k];
writeFileSync(join(ISO_HOME, ".gitconfig"), "[user]\n\tname = replay\n\temail = replay@example.invalid\n[safe]\n\tdirectory = *\n");

export const runtime = await pi.ModelRuntime.create({
  authPath: join(CONFIG.agentDir, "auth.json"),
  modelsPath: join(CONFIG.agentDir, "models.json"),
});

export function lastAssistantText(session) {
  const msgs = session.messages.filter((m) => m.role === "assistant");
  const last = msgs[msgs.length - 1];
  if (!last) return "";
  return (last.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n");
}

export function toolCallsOf(session, fromIndex) {
  const out = [];
  for (const m of session.messages.slice(fromIndex)) {
    if (m.role !== "assistant") continue;
    for (const c of m.content || []) if (c.type === "toolCall") out.push(`${c.name}(${JSON.stringify(c.arguments).slice(0, 160)})`);
  }
  return out;
}

/** Scratch agent dir: no skills, extensions, auth, or settings are discovered from the real one. */
export function scratchAgentDir(tag) {
  const dir = join(process.env.TMPDIR || "/tmp", `brainstorm-replay-agent-${tag}-${process.pid}`);
  rmSync(dir, { recursive: true, force: true });
  return ensure(dir);
}

/** One-shot completion with no tools and no skills; returns the assistant text. */
export async function oneShot(modelSpec, systemText, userText) {
  const { model, thinkingLevel } = parseModelSpec(modelSpec);
  const agentDir = scratchAgentDir("oneshot");
  const settingsManager = pi.SettingsManager.inMemory({});
  const loader = new pi.DefaultResourceLoader({
    cwd: agentDir, agentDir, settingsManager,
    noExtensions: true, noSkills: true, noPromptTemplates: true, noThemes: true, noContextFiles: true,
    systemPromptOverride: () => systemText, appendSystemPromptOverride: () => [],
  });
  await loader.reload();
  const { session } = await pi.createAgentSession({
    cwd: agentDir, agentDir, modelRuntime: runtime, model, thinkingLevel, noTools: "all",
    resourceLoader: loader, settingsManager, sessionManager: pi.SessionManager.inMemory(agentDir),
  });
  try {
    await session.prompt(userText);
    return lastAssistantText(session);
  } finally {
    session.dispose();
    rmSync(agentDir, { recursive: true, force: true });
  }
}

export function extractJson(text) {
  const m = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

/** Isolated shallow checkout of the base commit; caller removes it. */
export function consumerWorktree(label, base, tag) {
  const dir = join(process.env.TMPDIR || "/tmp", `ws-${createHash("sha1").update(`${label}-${tag}-${process.pid}`).digest("hex").slice(0, 10)}`);
  rmSync(dir, { recursive: true, force: true });
  sh("git", ["init", "-q", dir]);
  sh("git", ["-C", dir, "fetch", "-q", "--depth", "1", CONFIG.consumerRepo, base]);
  sh("git", ["-C", dir, "checkout", "-q", "--detach", "FETCH_HEAD"]);
  try { sh("git", ["-C", dir, "remote", "remove", "origin"], { stdio: "ignore" }); } catch {}
  return dir;
}

export function removeWorktree(dir) {
  rmSync(dir, { recursive: true, force: true });
}

export const exists = existsSync;
