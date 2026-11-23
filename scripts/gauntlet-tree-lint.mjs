import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const tree = "skills/gauntlet";
const phases = ["brainstorm", "plan", "implement", "verify", "ship"];
const directories = new Set([...phases, "implement/waves", "implement/loop"]);

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
