import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, statSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { sha256 } from "./checks.mjs";
import { MODELS, replayArg } from "./models.mjs";

export const PI_FLAGS = ["-p", "--no-skills", "--no-extensions", "--no-context-files", "--no-session"];

function level(h) { return /^(#+)/.exec(h)[1].length; }

// from: heading line prefix; to: optional heading line prefix the slice ends before.
export function sliceText(text, from, to) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.startsWith(from));
  if (start < 0) throw new Error(`heading not found: ${from}`);
  let end = lines.length;
  let fenced = false;
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (!to) {
      if (/^(```|~~~)/.test(l)) fenced = !fenced;
      if (fenced) continue;
    }
    if (to ? l.startsWith(to) : /^#{1,6} /.test(l) && level(l) <= level(from)) { end = i; break; }
  }
  if (to && end === lines.length) throw new Error(`heading not found: ${to}`);
  return lines.slice(start, end).join("\n") + "\n";
}

export function stripFrontmatter(text) {
  return text.replace(/^---\n[\s\S]*?\n---\n/, "");
}

// read(path) returns the file text for the arm (working tree or git show); extra = bundle+ paths.
export function assemble(target, read, extra = []) {
  const parts = [];
  for (const f of target.skillFiles) {
    let text = read(f.path);
    if (f.body) text = stripFrontmatter(text);
    if (f.slice) text = sliceText(text, f.slice, f.sliceTo);
    parts.push(target.assembly === "headed" ? `# ${f.path}\n${text}` : text);
  }
  for (const p of extra) { const text = read(p); parts.push(target.assembly === "headed" ? `# ${p}\n${text}` : text); }
  return parts.join("\n");
}

export function parseCase(text) {
  const bundle = [];
  const kept = [];
  for (const line of text.split("\n")) {
    const m = /^bundle\+: (\S+)\s*$/.exec(line);
    if (m && kept.length === 0) bundle.push(m[1]); else kept.push(line);
  }
  return { bundle, text: kept.join("\n") };
}

export function textArgs(model, systemPromptPath) {
  return [...PI_FLAGS, "--no-tools", ...replayArg(model), "--system-prompt", systemPromptPath];
}
export function editArgs(model, skillDir) {
  return [...PI_FLAGS, "--tools", "read,edit,write", "--skill", skillDir, ...replayArg(model)];
}

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_SYSTEM: "/dev/null" } });
}

export function baseReader(root, ref) {
  return (p) => git(root, "show", `${ref}:${p}`);
}

export function treeReader(root) {
  return (p) => readFileSync(join(root, p), "utf8");
}

export function prepareFixture(fixtureDir) {
  const scratch = mkdtempSync(join(tmpdir(), "eval-fixture-"));
  try {
    cpSync(fixtureDir, scratch, { recursive: true });
    git(scratch, "init", "-q");
    git(scratch, "-c", "user.name=eval", "-c", "user.email=eval@localhost", "add", "-A");
    git(scratch, "-c", "user.name=eval", "-c", "user.email=eval@localhost", "-c", "commit.gpgsign=false", "commit", "--no-verify", "-q", "-m", "fixture");
    return scratch;
  } catch (e) {
    rmSync(scratch, { recursive: true, force: true });
    throw e;
  }
}

function* walk(dir, base = dir) {
  for (const name of readdirSync(dir).sort()) {
    if (name === ".git") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p, base); else yield relative(base, p);
  }
}

export function captureEdit(scratch) {
  git(scratch, "add", "-A");
  const diff = git(scratch, "diff", "--cached", "HEAD");
  return { diff, tree: readTree(scratch) };
}

export function readTree(scratch) {
  const tree = {};
  for (const rel of walk(scratch)) { const content = readFileSync(join(scratch, rel), "utf8"); tree[rel] = { lines: content === "" ? 0 : content.split("\n").length - (content.endsWith("\n") ? 1 : 0), content }; }
  return tree;
}

export function inputSha(replayText, caseText, bundle, fixtureDir) {
  const parts = [replayText, caseText, ...bundle];
  if (fixtureDir && existsSync(fixtureDir)) for (const rel of walk(fixtureDir)) parts.push(rel, readFileSync(join(fixtureDir, rel), "utf8"));
  return sha256(...parts);
}

export { MODELS };
