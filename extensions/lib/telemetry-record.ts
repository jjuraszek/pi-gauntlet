// Telemetry record model (#33): phases, events, accumulators, derive, YAML.
import { Document, isCollection, isMap, isSeq, parse as parseYaml, stringify as stringifyYaml, type YAMLMap } from "yaml";
import type { BucketStat, ShipOption } from "./telemetry-paths.ts";
import type { CouncilBlock } from "./telemetry-council.ts";

export const PHASES = ["brainstorm", "plan", "implement", "verify", "ship"] as const;
export type Phase = (typeof PHASES)[number];
export type PhaseKey = Phase | "unphased";
export type PhaseStatus = "pending" | "in_progress" | "complete" | "skipped";
export type PhaseMap = Record<Phase, { status: PhaseStatus; substep?: string; reason?: string }>;
export const emptyPhases = (): PhaseMap => Object.fromEntries(PHASES.map((p) => [p, { status: "pending" }])) as PhaseMap;
export const currentPhase = (phases: PhaseMap): PhaseKey => PHASES.find((p) => phases[p].status === "in_progress") ?? "unphased";
export type PhaseAction = "start" | "complete" | "skip" | "reset";
export interface PhaseTransition { action: PhaseAction; name?: Phase }
export function diffPhases(prev: PhaseMap, next: PhaseMap, action: string): PhaseTransition[] {
  if (action === "reset") return [{ action: "reset" }];
  if (action !== "start" && action !== "complete" && action !== "skip") return [];
  return PHASES.filter((p) => prev[p].status !== next[p].status).map((name) => ({ action, name }));
}
export const implementAutoCompletes = (phases: PhaseMap, tasks: { status: string }[] | undefined): boolean =>
  phases.implement.status === "in_progress" && Array.isArray(tasks) && tasks.length > 0 && tasks.every((t) => t.status === "complete" || t.status === "skipped");

export interface BaseEvent { ts: string; session: string; phase: PhaseKey }
export type TelemetryEvent = BaseEvent & (
  | { kind: "phase"; action: PhaseAction; name?: Phase; model?: string; thinking?: string }
  | { kind: "engine"; engine: "loop" | "waves" }
  | { kind: "plan_check"; pass: boolean; spec?: string; plan?: string }
  | { kind: "dispatch"; agent: string; model?: string; exit?: number }
  | { kind: "gate"; gate: "fix_round_grant" | "task_reopen"; rounds?: number }
  | { kind: "config_change"; model?: string; thinking?: string }
  | { kind: "ship"; option: ShipOption | "keep" | "discard"; command?: string }
  | { kind: "ship_failed" }
  | { kind: "spec_renamed"; from: string; to: string }
  | { kind: "warning"; message: string }
);
// Lifecycle events are never dropped because derive depends on their complete history.
const LIFECYCLE_KINDS = new Set(["engine", "phase", "ship", "ship_failed", "spec_renamed"]);
export const EVENT_CAP = 300;
export function capEvents(events: TelemetryEvent[], cap = EVENT_CAP): { events: TelemetryEvent[]; dropped: number } {
  let kept = events, dropped = 0;
  if (kept.length > cap) {
    let excess = kept.length - cap;
    kept = kept.filter((e) => {
      if (excess > 0 && !LIFECYCLE_KINDS.has(e.kind)) { excess--; dropped++; return false; }
      return true;
    });
  }
  return { events: kept, dropped };
}

export interface Tokens { input: number; output: number; cache_read: number; cache_write: number; cost: number }
export interface PhaseAcc { tokens?: Tokens; compactions?: number; user_messages?: number; peak_context?: number; parent_calls?: [number, number, number][] }
export interface PersonaAcc { dispatches: number; models: string[]; tokens?: Tokens }
export interface ReviewAcc { dispatches: number; nonzero_exit: number; findings?: { blocker: number; major: number; minor: number } }
export interface Gates { spec_rounds: number; plan_rounds: number; fix_round_grants: number; task_reopens: number }
export interface Accumulators {
  phases: Partial<Record<PhaseKey, PhaseAcc>>; personas: Record<string, PersonaAcc>; reviews: Record<string, ReviewAcc>;
  spec_writes: Partial<Record<PhaseKey, { count: number; last_sha256: string }>>; gates: Gates;
  conformance_loops: number; conformance_open_gaps?: number; amendments: number; spec_edits_after_ship: number; events_dropped: number;
}
export const emptyAccumulators = (): Accumulators => ({ phases: {}, personas: {}, reviews: {}, spec_writes: {}, gates: { spec_rounds: 0, plan_rounds: 0, fix_round_grants: 0, task_reopens: 0 }, conformance_loops: 0, amendments: 0, spec_edits_after_ship: 0, events_dropped: 0 });
export const zeroTokens = (): Tokens => ({ input: 0, output: 0, cache_read: 0, cache_write: 0, cost: 0 });
export const addTokens = (a: Tokens | undefined, b: Tokens): Tokens => ({ input: (a?.input ?? 0) + b.input, output: (a?.output ?? 0) + b.output, cache_read: (a?.cache_read ?? 0) + b.cache_read, cache_write: (a?.cache_write ?? 0) + b.cache_write, cost: (a?.cost ?? 0) + b.cost });
const optSum = (a?: number, b?: number): number | undefined => a === undefined && b === undefined ? undefined : (a ?? 0) + (b ?? 0);
const optMax = (a?: number, b?: number): number | undefined => a === undefined ? b : b === undefined ? a : Math.max(a, b);
export const compact = <T extends object>(o: T): T => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
export function foldAccumulators(a: Accumulators, b: Accumulators): Accumulators {
  const out = emptyAccumulators();
  for (const k of new Set([...Object.keys(a.phases), ...Object.keys(b.phases)]) as Set<PhaseKey>) {
    const x = a.phases[k] ?? {}, y = b.phases[k] ?? {};
    out.phases[k] = compact({ tokens: x.tokens && y.tokens ? addTokens(x.tokens, y.tokens) : x.tokens ?? y.tokens, compactions: optSum(x.compactions, y.compactions), user_messages: optSum(x.user_messages, y.user_messages), peak_context: optMax(x.peak_context, y.peak_context), parent_calls: x.parent_calls || y.parent_calls ? [...(x.parent_calls ?? []), ...(y.parent_calls ?? [])] : undefined });
  }
  for (const k of new Set([...Object.keys(a.personas), ...Object.keys(b.personas)])) {
    const x = a.personas[k], y = b.personas[k];
    out.personas[k] = compact({ dispatches: (x?.dispatches ?? 0) + (y?.dispatches ?? 0), models: [...new Set([...(x?.models ?? []), ...(y?.models ?? [])])], tokens: x?.tokens && y?.tokens ? addTokens(x.tokens, y.tokens) : x?.tokens ?? y?.tokens });
  }
  for (const k of new Set([...Object.keys(a.reviews), ...Object.keys(b.reviews)])) {
    const x = a.reviews[k], y = b.reviews[k];
    const findings = x?.findings || y?.findings ? { blocker: (x?.findings?.blocker ?? 0) + (y?.findings?.blocker ?? 0), major: (x?.findings?.major ?? 0) + (y?.findings?.major ?? 0), minor: (x?.findings?.minor ?? 0) + (y?.findings?.minor ?? 0) } : undefined;
    out.reviews[k] = compact({ dispatches: (x?.dispatches ?? 0) + (y?.dispatches ?? 0), nonzero_exit: (x?.nonzero_exit ?? 0) + (y?.nonzero_exit ?? 0), findings });
  }
  for (const k of new Set([...Object.keys(a.spec_writes), ...Object.keys(b.spec_writes)]) as Set<PhaseKey>) {
    const x = a.spec_writes[k], y = b.spec_writes[k]; out.spec_writes[k] = { count: (x?.count ?? 0) + (y?.count ?? 0), last_sha256: y?.last_sha256 ?? x?.last_sha256 ?? "" };
  }
  for (const g of Object.keys(out.gates) as (keyof Gates)[]) out.gates[g] = a.gates[g] + b.gates[g];
  out.conformance_loops = a.conformance_loops + b.conformance_loops; out.conformance_open_gaps = b.conformance_open_gaps ?? a.conformance_open_gaps; out.amendments = a.amendments + b.amendments;
  out.spec_edits_after_ship = a.spec_edits_after_ship + b.spec_edits_after_ship; out.events_dropped = a.events_dropped + b.events_dropped;
  return out;
}

export interface DiffSummary { base: string; commits: number; buckets: Record<string, BucketStat> }
export interface Derived {
  engine: "loop" | "waves"; iterations?: number;
  duration_s: number; phases: Partial<Record<PhaseKey, PhaseAcc & { started_at?: string; completed_at?: string; duration_s?: number; model?: string; thinking?: string }>>;
  personas: Record<string, PersonaAcc>; reviews?: Record<string, ReviewAcc>; conformance_loops: number; conformance_open_gaps?: number; gates: Gates & { ship_option?: string };
  plan?: { tasks: number; complete: number; failed: number; skipped: number }; tests?: { command: string; result: "pass" | "fail" }; verification_runs?: number; amendments: number;
  spec_edits_after_ship: number; diff?: DiffSummary; modified_files?: string[]; council?: CouncilBlock; spec_writes: Accumulators["spec_writes"]; events_dropped: number;
}
export type RecordStatus = "in_progress" | "shipped" | "abandoned";
export type TelemetryLeg = { repo: string; sha: string; pr?: never } | { repo: string; pr: string; sha?: never };
export const validLegs = (legs: unknown): legs is TelemetryLeg[] => Array.isArray(legs) && legs.every((leg) =>
  leg && typeof leg.repo === "string" && leg.repo.trim().length > 0 &&
  ((typeof leg.sha === "string" && leg.sha.trim().length > 0 && leg.pr === undefined) ||
   (typeof leg.pr === "string" && /^https?:\/\/\S+$/.test(leg.pr) && leg.sha === undefined)));
export interface TelemetryRecord {
  legs?: TelemetryLeg[];
  schema: 1; spec: string; run_id: string; branch?: string; status: RecordStatus; created_at: string; approved_at?: string; shipped_at?: string; abandoned_at?: string;
  supersedes?: string[]; fixes?: string[]; versions?: Record<string, string>; author?: { name?: string; email?: string }; agent_overrides?: Record<string, unknown>;
  sessions: string[]; derived: Derived; accumulators: Record<string, Accumulators>; events: TelemetryEvent[];
}
export function newRecord(o: { spec: string; session: string; now: string; runId: string; branch?: string }): TelemetryRecord {
  return { schema: 1, spec: o.spec, run_id: o.runId, branch: o.branch, status: "in_progress", created_at: o.now, sessions: [o.session], derived: { engine: "waves", duration_s: 0, phases: {}, personas: {}, conformance_loops: 0, gates: { spec_rounds: 0, plan_rounds: 0, fix_round_grants: 0, task_reopens: 0 }, amendments: 0, spec_edits_after_ship: 0, spec_writes: {}, events_dropped: 0 }, accumulators: {}, events: [] };
}
export const totalAccumulators = (rec: TelemetryRecord): Accumulators => Object.values(rec.accumulators).reduce<Accumulators>((acc, block) => foldAccumulators(acc, block), emptyAccumulators());
const seconds = (a: string, b: string): number => Math.max(0, Math.round((Date.parse(b) - Date.parse(a)) / 1000));
export function liveShipEvent(events: TelemetryEvent[]): (TelemetryEvent & { kind: "ship" }) | undefined {
  let live: (TelemetryEvent & { kind: "ship" }) | undefined;
  for (const e of events) { if (e.kind === "ship") live = e; else if (e.kind === "ship_failed") live = undefined; }
  return live;
}
export function derive(rec: TelemetryRecord, now: string): Derived {
  const acc = totalAccumulators(rec), phases: Derived["phases"] = {};
  for (const e of rec.events) {
    if (e.kind !== "phase") continue;
    if (e.action === "reset") { for (const p of PHASES) if (phases[p]) phases[p] = compact({ ...phases[p], started_at: undefined, completed_at: undefined, duration_s: undefined, model: undefined, thinking: undefined }); continue; }
    if (!e.name) continue;
    const cur = phases[e.name] ?? {};
    if (e.action === "start") phases[e.name] = compact({ ...cur, started_at: e.ts, completed_at: undefined, duration_s: undefined, model: e.model, thinking: e.thinking });
    else if (cur.started_at) phases[e.name] = { ...cur, completed_at: e.ts, duration_s: seconds(cur.started_at, e.ts) };
  }
  for (const k of Object.keys(acc.phases) as PhaseKey[]) phases[k] = compact({ ...(phases[k] ?? {}), ...acc.phases[k] });
  const live = liveShipEvent(rec.events);
  return compact({ engine: rec.events.findLast((e) => e.kind === "engine")?.engine ?? "waves", iterations: acc.personas["loop-implementer"]?.dispatches, duration_s: seconds(rec.created_at, rec.shipped_at ?? rec.abandoned_at ?? now), phases, personas: acc.personas, reviews: Object.keys(acc.reviews).length ? acc.reviews : undefined, conformance_loops: acc.conformance_loops, conformance_open_gaps: acc.conformance_open_gaps, gates: compact({ ...acc.gates, ship_option: live?.option }), plan: rec.derived.plan, tests: rec.derived.tests, verification_runs: rec.derived.verification_runs, amendments: acc.amendments, spec_edits_after_ship: acc.spec_edits_after_ship, diff: rec.derived.diff, modified_files: rec.derived.modified_files, council: rec.derived.council, spec_writes: acc.spec_writes, events_dropped: acc.events_dropped }) as Derived;
}

const stripUndefined = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(stripUndefined);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v as object).filter(([, x]) => x !== undefined).map(([k, x]) => [k, stripUndefined(x)]));
  return v;
};
const flowLeafChildren = (map: YAMLMap, blockLists: Set<string> = new Set()): void => {
  for (const pair of map.items) {
    const key = String(pair.key);
    const child = pair.value;
    if (!isCollection(child) || blockLists.has(key)) continue;
    if (isMap(child) && child.items.length > 0 && child.items.every((item) => isMap(item.value))) {
      for (const item of child.items) if (isCollection(item.value)) item.value.flow = true;
    } else {
      child.flow = true;
    }
  }
};
const flowModelLists = (node: unknown): void => {
  if (isMap(node)) {
    for (const pair of node.items) {
      if (String(pair.key) === "models" && isSeq(pair.value)) pair.value.flow = true;
      flowModelLists(pair.value);
    }
  } else if (isSeq(node)) {
    for (const item of node.items) flowModelLists(item);
  }
};
export function serializeRecord(rec: TelemetryRecord): string {
  const { derived, accumulators, events, ...head } = rec;
  const body = stripUndefined({ ...head, derived, accumulators }) as Record<string, unknown>;
  const doc = new Document(body);
  const derivedNode = doc.get("derived", true);
  if (isMap(derivedNode)) {
    flowLeafChildren(derivedNode, new Set(["modified_files", "council"]));
    const council = derivedNode.get("council", true);
    if (isMap(council)) flowLeafChildren(council);
  }
  const accumulatorNode = doc.get("accumulators", true);
  if (isMap(accumulatorNode)) {
    for (const session of accumulatorNode.items) if (isMap(session.value)) flowLeafChildren(session.value);
  }
  flowModelLists(doc.contents);
  const bodyText = doc.toString({ lineWidth: 0 });
  const eventLines = (events as unknown as Record<string, unknown>[]).map((e) => "  - " + stringifyYaml(stripUndefined(e), { collectionStyle: "flow", lineWidth: 0 }).trim());
  return bodyText + "events:\n" + (eventLines.length ? eventLines.join("\n") + "\n" : "");
}
export function parseRecord(text: string): TelemetryRecord | undefined {
  let doc: unknown;
  try { doc = parseYaml(text); } catch { return undefined; }
  if (!doc || typeof doc !== "object") return undefined;
  const d = doc as Partial<TelemetryRecord>;
  if (d.schema !== 1 || typeof d.spec !== "string" || typeof d.run_id !== "string") return undefined;
  if (d.legs !== undefined && !validLegs(d.legs)) return undefined;
  const accumulators = Object.fromEntries(Object.entries(d.accumulators ?? {}).flatMap(([session, block]) =>
    block && typeof block === "object" && !Array.isArray(block)
      ? [[session, { ...emptyAccumulators(), ...block }]]
      : []
  )) as Record<string, Accumulators>;
  return { ...(d as TelemetryRecord), sessions: Array.isArray(d.sessions) ? d.sessions : [], derived: d.derived ?? newRecord({ spec: d.spec, session: "", now: d.created_at ?? "", runId: d.run_id }).derived, accumulators, events: Array.isArray(d.events) ? d.events : [] };
}
