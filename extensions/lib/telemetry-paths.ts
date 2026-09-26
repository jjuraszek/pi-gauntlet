// Pure helpers for the telemetry extension (#33): record path mapping, pi-cwd
// path resolution, ship/test command matchers, diff buckets, spec banners.
// Ship detection matches the first statement against
//   STMT_START + git <global flags> (merge --squash | push) | gh pr create
// with STMT_START from phase-tracker-helpers.ts.
//
// Default bucket globs (DEFAULT_TELEMETRY_BUCKETS): test = **/test/**, **/tests/**,
// **/__tests__/**, **/*.test.*, **/*.spec.*, **/*_test.*; docs = **/*.md;
// config = **/*.json, **/*.yaml, **/*.yml, **/*.toml, **/*.lock, **/*-lock.*; else code.

import { isAbsolute, matchesGlob, relative, resolve } from "node:path";
import { buildTestCmdRegex } from "./gauntlet-settings.ts";
import { STMT_START } from "./phase-tracker-helpers.ts";

// ---- paths -------------------------------------------------------------------

export const toPosix = (p: string): string => p.split("\\").join("/");

export const isSpecPath = (rel: string): boolean => /(^|\/)doc\/specs\/[^/]+\.md$/.test(rel);
export const isPlanPath = (rel: string): boolean => /(^|\/)doc\/plans\/[^/]+\.md$/.test(rel);

// <dir>/<spec path with trailing .md replaced by .yaml>, nesting preserved.
export const recordPathFor = (dir: string, specRel: string): string => `${dir}/${specRel.replace(/\.md$/, ".yaml")}`;

// pi tools resolve a relative path against ctx.cwd; the record key is repo-relative
// to the owning toplevel so the same spec maps to one record from any cwd.
// Returns undefined for paths outside the toplevel.
export function repoRelativeToolPath(toplevel: string, cwd: string, p: string): string | undefined {
  const abs = isAbsolute(p) ? p : resolve(cwd, p);
  const rel = toPosix(relative(toplevel, abs));
  if (rel === "" || rel.startsWith("../") || rel === ".." || isAbsolute(rel)) return undefined;
  return rel;
}

const SPEC_HEADER_RE = /^\*\*Spec:\*\*\s*`?([^`\s]+)`?/m;
export const planSpecHeader = (planBody: string): string | undefined => SPEC_HEADER_RE.exec(planBody)?.[1];

// ---- command matchers ----------------------------------------------------------

const STATEMENT_END = /\n|;|&&|\|\||\|/;

export const truncateCommand = (s: string): string => (s.length > 120 ? s.slice(0, 120) : s);
export type ShipOption = "squash" | "pr";

// `git <global flags> <subcommand>`: same flags-span grammar as parseGitCommand in
// phase-tracker-helpers.ts, so `git -C <worktree> push` from the primary checkout counts.
const GIT_FLAGS = "git\\s+(?:-\\S+(?:\\s+\\S+)?\\s+)*";
const SHIP_RE = new RegExp(STMT_START + "(" + GIT_FLAGS + "(?:merge\\s+--squash|push)(?=\\s|$)|gh\\s+pr\\s+create)");
const SQUASH_RE = new RegExp("^" + GIT_FLAGS + "merge\\s+--squash");

export function matchShipStatement(command: string): { option: ShipOption; statement: string } | undefined {
  const m = SHIP_RE.exec(command);
  if (!m) return undefined;
  const statement = command.slice(m.index + m[0].indexOf(m[1])).split(STATEMENT_END)[0].trim();
  return { option: SQUASH_RE.test(statement) ? "squash" : "pr", statement };
}

// First statement matching one of the resolved verifyBeforeShip.testCommands
// fragments, using the same \b-anchored construction as verify-before-ship.ts.
export function matchTestStatement(command: string, testCommands: string[]): string | undefined {
  const re = buildTestCmdRegex(testCommands);
  for (const raw of command.split(STATEMENT_END)) {
    const statement = raw.trim();
    if (statement && re.test(statement)) return statement;
  }
  return undefined;
}

// ---- diff buckets --------------------------------------------------------------

export function classifyBucket(rel: string, buckets: [string, string[]][]): string {
  for (const [name, globs] of buckets) if (globs.some((g) => matchesGlob(rel, g))) return name;
  return "code";
}

export interface BucketStat {
  files: number;
  insertions: number;
  deletions: number;
}

// `git diff --numstat` rows: "<ins>\t<del>\t<path>"; binary rows use "-"; renames
// render as "a => b" or "{a => b}/rest" and count under the new path.
export function numstatPath(raw: string): string {
  const braced = raw.replace(/\{([^{}]*) => ([^{}]*)\}/g, (_m, _a, b: string) => b).replace(/\/\//g, "/");
  const arrow = braced.indexOf(" => ");
  return arrow >= 0 ? braced.slice(arrow + 4) : braced;
}

export interface PatchRow {
  added: number;
  removed: number;
  path: string;
}

function patchBlockPath(headers: string[]): string | undefined {
  const plus = headers.find((l) => l.startsWith("+++ b/"));
  if (plus) return plus.slice(6);
  const renameTo = headers.find((l) => l.startsWith("rename to "));
  if (renameTo) return renameTo.slice(10);
  const minus = headers.find((l) => l.startsWith("--- a/"));
  if (minus && headers.includes("+++ /dev/null")) return minus.slice(6);
  if (!headers[0].startsWith("diff --git a/")) return undefined;
  const rest = headers[0].slice("diff --git a/".length);
  const mid = (rest.length - 3) / 2;
  if (Number.isInteger(mid) && mid > 0 && rest.slice(mid, mid + 3) === " b/" && rest.slice(0, mid) === rest.slice(mid + 3)) return rest.slice(0, mid);
  return undefined;
}

function parsePatchBlock(block: string[]): PatchRow | undefined {
  const hunk = block.findIndex((l) => l.startsWith("@@"));
  const headers = hunk < 0 ? block : block.slice(0, hunk);
  const path = patchBlockPath(headers);
  if (path === undefined) return undefined;
  let added = 0;
  let removed = 0;
  for (const line of hunk < 0 ? [] : block.slice(hunk)) {
    if (line.startsWith("+")) added++;
    else if (line.startsWith("-")) removed++;
  }
  return { added, removed, path };
}

// jj has no numstat: --stat truncates paths and -T exposes no line counts.
// Headers end at the first @@; subsequent ---- and ++text lines count as content.
export function parsePatchNumstat(patch: string): PatchRow[] | null {
  if (!patch.trim()) return [];
  const lines = patch.split("\n");
  if (!lines.find((l) => l.trim())!.startsWith("diff --git ")) return null;
  const blocks: string[][] = [];
  for (const line of lines) {
    if (line.startsWith("diff --git ")) blocks.push([line]);
    else if (blocks.length) blocks[blocks.length - 1].push(line);
  }
  const rows: PatchRow[] = [];
  for (const block of blocks) {
    const row = parsePatchBlock(block);
    if (!row) return null;
    rows.push(row);
  }
  return rows;
}

// ---- spec banners --------------------------------------------------------------

const LINK_BANNER_RE = /^> \*\*(Supersedes|Fixes):\*\*\s*(.+)$/gm;
const MD_LINK_RE = /\[([^\]]+)\]\([^)]*\)/g;

function bannerTargets(rest: string): string[] {
  const labels: string[] = [];
  const remainder = rest.replace(MD_LINK_RE, (_m, label: string) => {
    labels.push(label.trim());
    return " ";
  });
  for (const tok of remainder.split(/[\s,]+/)) if (tok && tok !== "-") labels.push(tok);
  return labels;
}

export function parseSpecLinks(body: string): { supersedes: string[]; fixes: string[] } {
  const out = { supersedes: [] as string[], fixes: [] as string[] };
  for (const m of body.matchAll(LINK_BANNER_RE)) {
    const list = m[1] === "Supersedes" ? out.supersedes : out.fixes;
    for (const t of bannerTargets(m[2])) if (!list.includes(t)) list.push(t);
  }
  return out;
}

export const SUPERSEDED_BY_RE = /^> \*\*Superseded by:\*\*/m;

// True when the inserted text is a predecessor banner naming `successor` as its label.
export function isSupersededByBanner(inserted: string, successor: string): boolean {
  const m = /^> \*\*Superseded by:\*\*\s*\[([^\]]+)\]/m.exec(inserted);
  return m?.[1]?.trim() === successor;
}
