import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const runFiles = (...paths) => paths.map(path => `skills/gauntlet/${path}.md`);

export const STAGE_FILES = runFiles(
  "SKILL", "amendment-surface", "commit-message", "documentation-impact", "legs", "menu-layout", "pr-head", "return-file", "worktrees",
  "brainstorm/gatherer", "brainstorm/opening-message", "brainstorm/pr-subject", "brainstorm/spec-finalization", "brainstorm/spec-pr", "brainstorm/superseding", "brainstorm/ticket-acceptance",
  "plan/open-questions", "plan/plan-contract", "plan/plan",
  "implement/happy-path-run", "implement/loop/coordinated-legs", "implement/loop/driver-holds", "implement/loop/empty-child-stagnation", "implement/loop/interrupted-recovery", "implement/loop/loop", "implement/loop/unreachable-returns",
  "implement/waves/dispatch-contract", "implement/waves/implement-amendments", "implement/waves/implementer-prompt", "implement/waves/prerequisites", "implement/waves/stop-note", "implement/waves/wave-reviewer-prompt", "implement/waves/waves",
  "ship/disposition-protocol", "ship/legs", "ship/ship", "ship/spec-pr", "ship/verification-set",
);

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

export const TEMP_PATH_SCOPE = [
  ...STAGE_FILES,
  ...runFiles("brainstorm/council", "verify/verify", "conformance-check", "whole-diff-minors", "brainstorm/settings-precedence"),
  "skills/gatekeep-pr",
  "agents/loop-implementer.md",
];

const TEMP_EXCEPTIONS = new Map([
  ["skills/gauntlet/return-file.md", "${TMPDIR:-/tmp}/gauntlet.XXXXXX"],
  ["skills/gatekeep-pr/reference/post-selection-loop.md", "${TMPDIR:-/tmp}/gate-kept.XXXXXX"],
]);

export function lintTempPaths(text, file) {
  const findings = [];
  const exception = TEMP_EXCEPTIONS.get(file);
  const gate = file.startsWith("skills/gatekeep-pr/");
  text.split("\n").forEach((raw, i) => {
    const report = () => findings.push({ line: i + 1, rule: "temp-path", text: raw.trim() });
    // Look ahead for the argument so it cannot hide nested mktemp occurrences.
    for (const match of raw.matchAll(/\bmktemp\b(?=(?:[ \t]+-[\w-]+)*[ \t]*(?:"([^"]*)"|'([^']*)'|([^\s`;)|]+))?)/g)) {
      const argument = match[1] ?? match[2] ?? match[3] ?? "";
      const rooted = gate
        ? /^\$(?:RUN_DIR|\{RUN_DIR\})\//.test(argument) || argument.endsWith("/gauntlet/tmp/gate.XXXXXX")
        : /^\$(?:SCRATCH|\{SCRATCH\})\//.test(argument) || argument.includes("gauntlet/tmp");
      if (!rooted && !(exception && argument === exception)) report();
    }
    for (const match of raw.matchAll(/TMPDIR/g)) {
      const start = match.index - 2;
      if (!exception || raw.slice(start, start + exception.length) !== exception || /[^\s"'`);]/.test(raw[start + exception.length] ?? "")) report();
    }
  });
  return findings;
}

function lintScope(root, scope, lint) {
  const findings = [];
  function scan(path) {
    if (!existsSync(path)) return;
    if (statSync(path).isDirectory()) {
      for (const entry of readdirSync(path)) scan(join(path, entry));
    } else if (path.endsWith(".md")) {
      const file = relative(root, path);
      for (const finding of lint(readFileSync(path, "utf8"), file)) {
        findings.push({ file, ...finding });
      }
    }
  }
  for (const entry of scope) scan(join(root, entry));
  return findings;
}

export function lintTempPathScope(root, scope = TEMP_PATH_SCOPE) {
  return lintScope(root, scope, lintTempPaths);
}

export function lintStageFiles(root, scope = STAGE_FILES) {
  return lintScope(root, scope, lintStageSkill);
}
