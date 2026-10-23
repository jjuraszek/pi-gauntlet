import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

// Keeps the five stage skills on the "process in primary, work by path" contract (#37):
// no `cd` that changes the process cwd, no `git rev-parse --show-toplevel` derivation,
// no "switch into / from inside the worktree" prose.

export const STAGE_SKILL_DIRS = [
  "skills/brainstorming",
  "skills/writing-plans",
  "skills/subagent-driven-development",
  "skills/loop-implementation",
  "skills/finishing-a-development-branch",
  "skills/using-git-worktrees",
];

const FENCE_OPEN = /^\s*(`{3,}|~{3,})/;
const FENCE_CLOSE = /^\s*(`+|~+)\s*$/;
// Spec grammar: `(^|[;&|]\s*)cd\s` not immediately preceded by `(`; the `(` alternative
// below lets the subshell head match so the "$(" exclusion can be checked in one pass.
const CD_AT_STMT_START = /(^|[;&|(])(\s*)cd\s/g;
const SHOW_TOPLEVEL = /\bgit\s+rev-parse\s+--show-toplevel/;
const PROSE = /switch into the worktree|from inside the worktree/i;

// A `cd` passes only as the head of a plain subshell `(cd ... && ...)`; `$(cd ...)` fails.
function hasBareCd(line) {
  for (const m of line.matchAll(CD_AT_STMT_START)) {
    const before = m[1];
    const subshell = before === "(" && line[m.index - 1] !== "$";
    if (!subshell) return true;
  }
  return false;
}

// Returns [{ line, rule, text }]; line is 1-based.
export function lintStageSkill(text) {
  const findings = [];
  let fence;
  text.split("\n").forEach((raw, i) => {
    const line = i + 1;
    if (!fence) {
      const opening = raw.match(FENCE_OPEN);
      if (opening) {
        fence = { character: opening[1][0], length: opening[1].length };
        return;
      }
    } else {
      const closing = raw.match(FENCE_CLOSE)?.[1];
      if (closing?.[0] === fence.character && closing.length >= fence.length) {
        fence = undefined;
        return;
      }
    }
    if (fence) {
      if (hasBareCd(raw)) findings.push({ line, rule: "cd", text: raw.trim() });
      if (SHOW_TOPLEVEL.test(raw)) findings.push({ line, rule: "show-toplevel", text: raw.trim() });
    } else if (PROSE.test(raw)) {
      findings.push({ line, rule: "prose", text: raw.trim() });
    }
  });
  return findings;
}

export function lintStageSkillDirs(root, dirs = STAGE_SKILL_DIRS) {
  const findings = [];

  function scan(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name);
      if (entry.isDirectory()) scan(file);
      else if (entry.isFile() && file.endsWith(".md")) {
        for (const finding of lintStageSkill(readFileSync(file, "utf8"))) {
          findings.push({ file: relative(root, file), ...finding });
        }
      }
    }
  }

  for (const dir of dirs) {
    const path = join(root, dir);
    if (existsSync(path)) scan(path);
  }
  return findings;
}
