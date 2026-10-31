// Pure reducers the telemetry collector applies to pi tool results (#33).
import type { PhaseKey, Tokens } from "./telemetry-record.ts";

// pi Usage -> snake_case tokens; cost is usage.cost.total (object) or a bare number.
export function usageToTokens(u: unknown): Tokens | undefined {
  const x = u as { input?: unknown; output?: unknown; cacheRead?: unknown; cacheWrite?: unknown; cost?: unknown } | undefined;
  if (!x || typeof x !== "object") return undefined;
  const n = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  const cost = typeof x.cost === "number" ? x.cost : n((x.cost as { total?: unknown } | undefined)?.total);
  const t: Tokens = { input: n(x.input), output: n(x.output), cache_read: n(x.cacheRead), cache_write: n(x.cacheWrite), cost };
  return t.input || t.output || t.cache_read || t.cache_write || t.cost ? t : undefined;
}

const FINDING_TAG_RE = /\[(critical|blocker|moderate|major|minor)\]/gi;
// Persona tags alias onto the persisted keys; the schema and gauntlet-performance stay on blocker/major/minor.
const FINDING_KEY: Record<string, "blocker" | "major" | "minor"> = { critical: "blocker", blocker: "blocker", moderate: "major", major: "major", minor: "minor" };
export function countFindings(text: string): { blocker: number; major: number; minor: number } | undefined {
  const out = { blocker: 0, major: 0, minor: 0 };
  let any = false;
  for (const m of text.matchAll(FINDING_TAG_RE)) {
    out[FINDING_KEY[m[1].toLowerCase()]] += 1;
    any = true;
  }
  return any ? out : undefined;
}

export function countOpenGaps(text: string): number | undefined {
  if (/Conformance verdict:\s*CONFORMS/.test(text)) return 0;
  const gaps = new Set([...text.matchAll(/^\s*G(\d+):/gm)].map((match) => match[1]));
  return gaps.size || undefined;
}

export function countStructuredFindings(text: string): { blocker: number; major: number; minor: number } | undefined {
  const outputs = /^## Outputs\s*$/m.exec(text);
  if (!outputs) return undefined;
  const body = text.slice(outputs.index + outputs[0].length).split(/^## /m)[0];
  const total = { blocker: 0, major: 0, minor: 0 };
  let found = false;
  for (const match of body.matchAll(/^```json\s*\n([\s\S]*?)^```/gm)) {
    try {
      const value = JSON.parse(match[1]);
      const findings = value?.structured?.findings ?? value?.findings;
      if (!findings || ![findings.critical, findings.moderate, findings.minor].every((n) => Number.isSafeInteger(n) && n >= 0)) continue;
      total.blocker += findings.critical;
      total.major += findings.moderate;
      total.minor += findings.minor;
      found = true;
    } catch {
      // A malformed carrier falls back to the historical severity tags.
    }
  }
  return found ? total : undefined;
}

export const REVIEWER_AGENTS = new Set(["wave-reviewer", "conformance-reviewer"]);
export const COUNTED_USER_PHASES = new Set<PhaseKey>(["plan", "implement", "verify", "ship"]);

export const textOf = (content: unknown): string =>
  Array.isArray(content) ? content.map((c) => (c && typeof c === "object" && (c as { type?: string }).type === "text" ? String((c as { text?: unknown }).text ?? "") : "")).join("\n") : "";

export interface PlanTotals {
  tasks: number;
  complete: number;
  failed: number;
  skipped: number;
}
export const planTotals = (tasks: { status: string }[]): PlanTotals => ({
  tasks: tasks.length,
  complete: tasks.filter((t) => t.status === "complete").length,
  failed: tasks.filter((t) => t.status === "failed").length,
  skipped: tasks.filter((t) => t.status === "skipped").length,
});

export const countReopens = (prev: { name?: string; status: string }[] | undefined, next: { name?: string; status: string }[]): number => {
  const complete = new Set(prev?.filter((t) => typeof t.name === "string" && t.status === "complete").map((t) => t.name));
  return new Set(next.filter((t) => typeof t.name === "string" && complete.has(t.name) && (t.status === "failed" || t.status === "in_progress")).map((t) => t.name)).size;
};

// The text an edit/write call inserts: joined newText values, or the write body.
export const insertedText = (input: unknown): string => {
  const i = input as { edits?: { newText?: unknown }[]; content?: unknown };
  if (Array.isArray(i.edits)) return i.edits.map((e) => String(e?.newText ?? "")).join("\n");
  return typeof i.content === "string" ? i.content : "";
};
