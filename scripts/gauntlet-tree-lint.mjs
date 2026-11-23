import { globSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const tree = "skills/gauntlet";
const phases = ["brainstorm", "plan", "implement", "verify", "ship"];
const directories = new Set([...phases, "implement/waves", "implement/loop"]);

const [entry, overrides, ...steps] = `
brainstorming
gauntlet-overrides
writing-plans
subagent-driven-development
loop-implementation
roasting-the-spec
finishing-a-development-branch
using-git-worktrees
verification-before-completion
requesting-code-review
receiving-code-review
dispatching-parallel-agents
test-driven-development
`.trim().split("\n");
export const retiredNames = { entry, overrides, steps };

export function lintRetiredNames(root) {
  const inputs = new Set([entry, overrides, ...steps]);
  const pattern = new RegExp([...steps, overrides, `/skill:${entry}\\b`, `skills/${entry}\\b`, `\\b${entry}/[a-z0-9-]+`, `#{1,2}\\s+${entry}\\b`].join("|"));
  const scope = ["{skills,agents,extensions,bin,src/bins,scripts,test,tests,doc}/**/*", "README.md", "AGENTS.md", ".pi/*.md", "gauntlet.md", `${overrides}.md`, "eval/**/*"];
  const exclude = ["doc/specs", "doc/plans", "eval/**/results", "eval/*/report.md", "eval/*/records.jsonl", "eval/*/replay/results.md"];
  const hits = [];
  for (const file of globSync(scope, { cwd: root, exclude, withFileTypes: true })) {
    const path = relative(root, join(file.parentPath, file.name)).split(sep).join("/");
    if (file.isDirectory() && path === `eval/${file.name}` && (steps.includes(file.name) || file.name === entry)) hits.push(`${path}: retired target name`);
    if (!file.isFile()) continue;
    if (file.name === `${overrides}.md`) hits.push(`${path}: retired overrides filename`);
    const text = readFileSync(join(root, path), "utf8");
    const lines = text.split("\n");
    for (const [i, line] of lines.entries()) {
      if (path === "scripts/gauntlet-tree-lint.mjs" && inputs.has(line)) continue;
      const match = line.replaceAll("\\/", "/").match(pattern);
      if (match) hits.push(`${path}:${i + 1}: ${match[0]}`);
    }
  }
  return hits.sort();
}

export function lintPlacementRule(root) {
  const guide = "skills/forge-skill/SKILL.md";
  const files = globSync(["AGENTS.md", "README.md", "CHANGELOG.md", "doc/*.md", "{skills,agents,extensions,bin}/**/*.{md,ts,mjs}"], { cwd: root });
  const read = file => readFileSync(join(root, file), "utf8");
  const guideText = files.includes(guide) ? read(guide) : "";
  const section = guideText.split(/^### Gauntlet file placement\s*$/m)[1]?.split(/^#{1,3} /m, 1)[0] ?? "";
  const crossPhase = paragraph => /(?:more than one phase|(?:different|multiple|two) phases|across phases)/i.test(paragraph)
    && /(?:beside|alongside|next to) (?:the )?entry|(?:tree|skill) root/i.test(paragraph);
  const outside = paragraph => /skills outside the run|non-run skills/i.test(paragraph)
    && /(?:not|never) (?:change|determine|affect|move)|without (?:changing|moving)/i.test(paragraph);
  const paragraphs = text => text.split(/\n\s*\n/).map(p => p.replace(/\s+/g, " "));
  const rules = paragraphs(section);
  const errors = [];
  if (!rules.some(crossPhase) || !rules.some(outside)) errors.push(`${guide}: missing placement rule for cross-phase or external readers`);
  if (!files.includes("AGENTS.md") || !read("AGENTS.md").includes(`](${guide}#gauntlet-file-placement)`)) errors.push(`AGENTS.md: link to ${guide}#gauntlet-file-placement`);
  for (const file of files) {
    const text = read(file);
    const rest = file === guide ? text.replace(section, "") : text;
    if (paragraphs(rest).some(p => crossPhase(p) || outside(p) || /lowest directory containing .*phase readers/i.test(p))) {
      errors.push(`${file}: link to the placement rule instead of restating it`);
    }
  }
  return errors;
}

export function lintTreeShape(root) {
  const base = join(root, tree);
  const entries = readdirSync(base, { recursive: true, withFileTypes: true });
  const found = new Set();
  const errors = [];
  for (const entry of entries) {
    const path = relative(base, join(entry.parentPath, entry.name)).split(sep).join("/");
    if (entry.isDirectory()) {
      found.add(path);
      if (!directories.has(path)) errors.push(`${tree}/${path}: unexpected directory`);
    } else if (entry.name === "SKILL.md" && path !== "SKILL.md") {
      errors.push(`${tree}/${path}: nested skill entry`);
    }
  }
  for (const phase of phases) {
    if (!found.has(phase)) errors.push(`${tree}/${phase}: missing phase directory`);
  }
  return errors;
}
