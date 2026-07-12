/**
 * Pure logic for phase-tracker's substep action and marker commit guard.
 * No fs/git access here — file access is injected so node --test covers it
 * (registered in scripts/ci.mjs alongside the settings resolvers).
 */

import { resolve } from "node:path";

export const CONTEXT_DRAFT_MARKER = "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing";

export type SubstepCheck = { ok: true } | { ok: false; error: string };

export function checkSubstep(phaseStatus: string): SubstepCheck {
  if (phaseStatus === "in_progress") return { ok: true };
  return { ok: false, error: `substep requires an in_progress phase (status is ${phaseStatus})` };
}

export function phaseLabel(name: string, substep?: string): string {
  return substep ? `${name}(${substep})` : name;
}

// Same statement-start anchor as the branch guards in phase-tracker.ts. Exported
// so Wave 2 wiring in phase-tracker.ts can drop its duplicate copy.
export const STMT_START = "(?:^|[\\n;&|(])\\s*";
// `git commit`, tolerating any global flags between `git` and `commit` (e.g.
// `-c user.email=x`, common in CI per-commit identity). Group 1 captures the
// whole flags span as ONE opaque block rather than -C directly: nesting a
// capture inside a repeated alternation resets it to undefined on iterations
// that take the other branch (JS regex semantics), so -C after a later flag
// (e.g. `-C /wt -c user.email=x commit`) would silently lose its capture.
// DASH_C below re-extracts -C from that span once, outside any repetition.
// `commit` must be followed by whitespace or end-of-string, not just a word
// boundary, so `commit-graph` / `commit-tree` don't false-positive.
const GIT_COMMIT = new RegExp(
  STMT_START + "git\\s+((?:-\\S+(?:\\s+\\S+)?\\s+)*)commit(?=\\s|$)",
);
const DASH_C = /(?:^|\s)-C\s+(\S+)/;
// Global, lookaround-delimited (not consuming) so adjacent `cd a && cd b &&`
// statements don't eat each other's anchor/`&&` and hide the second match.
// parseGitCommit picks the LAST cd before the matched git-commit position, so
// `cd /a && cd /b && git commit` resolves against /b, not the first cd found.
const LEADING_CD = /(?<=^|[\n;&|(])\s*cd\s+([^\s)]+)\s*(?=&&|\|\||[;)\n]|$)/g;

export interface CommitForm {
  cPath: string | undefined;
  cdPath: string | undefined;
}

// Textual match anchored at statement starts (^ ; & | ( or newline). Quoted text
// can still match when preceded by such a char (e.g. sh -c 'x; git commit') —
// accepted heuristic, same tolerance as the existing Guard 3 mutation checks.
export function parseGitCommit(command: string): CommitForm | undefined {
  const m = GIT_COMMIT.exec(command);
  if (!m) return undefined;
  let cdPath: string | undefined;
  for (const cd of command.matchAll(LEADING_CD)) {
    if (cd.index! < m.index!) cdPath = cd[1];
  }
  return { cPath: DASH_C.exec(m[1])?.[1], cdPath };
}

export function resolveRepoDir(form: CommitForm, sessionCwd: string): string {
  const base = form.cdPath ? resolve(sessionCwd, form.cdPath) : sessionCwd;
  return form.cPath ? resolve(base, form.cPath) : base;
}

// Line-1 anchoring prevents false positives on specs that QUOTE the marker.
// Working-tree read (not index) is an accepted false-negative window for a
// backstop whose primary check lives in the brainstorming skill.
export function findMarkerFile(
  repoDir: string,
  specDirs: string[],
  listFiles: (dir: string) => string[],
  readFirstLine: (file: string) => string | undefined,
): string | undefined {
  for (const dir of specDirs) {
    for (const file of listFiles(resolve(repoDir, dir))) {
      if (readFirstLine(file) === CONTEXT_DRAFT_MARKER) return file;
    }
  }
  return undefined;
}

// Transitions always build fresh state: a substep never survives start/complete/skip/reset.
export function transitionPhaseState(status: string, reason?: string): { status: string; reason?: string } {
  return reason === undefined ? { status } : { status, reason };
}

export function markerGuardApplies(flowGuardsEnforced: boolean, brainstormStatus: string): boolean {
  return flowGuardsEnforced && brainstormStatus === "in_progress";
}

export const markerBlockReason = (file: string): string =>
  `Blocked: ${file} still begins with the context-draft marker - the spec-writing ` +
  `overwrite has not happened. Overwrite the draft with the real spec (write tool, ` +
  `full replacement) before committing. ` +
  `To override, set piGauntlet.flowGuards.enforce: false.`;
