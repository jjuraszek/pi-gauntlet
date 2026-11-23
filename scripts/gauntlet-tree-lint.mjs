import { globSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const tree = "skills/gauntlet";
const phases = ["brainstorm", "plan", "implement", "verify", "ship"];
const directories = new Set([...phases, "implement/waves", "implement/loop"]);

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
