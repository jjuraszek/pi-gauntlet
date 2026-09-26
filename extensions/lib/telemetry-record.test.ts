import assert from "node:assert/strict";
import { test } from "node:test";
import {
  capEvents, derive, diffPhases, emptyAccumulators, emptyPhases, foldAccumulators, implementAutoCompletes,
  newRecord, parseRecord, serializeRecord, type Accumulators, type TelemetryEvent,
} from "./telemetry-record.ts";

const ev = (over: Partial<TelemetryEvent> & { kind: string }): TelemetryEvent =>
  ({ ts: "2026-09-17T10:00:00Z", session: "s1", phase: "unphased", ...over }) as TelemetryEvent;

test("diffPhases: start/complete/skip emit one transition per changed phase; status/substep/grant emit none; reset emits reset", () => {
  const a = emptyPhases();
  const b = { ...a, brainstorm: { status: "in_progress" as const } };
  assert.deepEqual(diffPhases(a, b, "start"), [{ action: "start", name: "brainstorm" }]);
  const c = { ...b, brainstorm: { status: "complete" as const } };
  assert.deepEqual(diffPhases(b, c, "complete"), [{ action: "complete", name: "brainstorm" }]);
  assert.deepEqual(diffPhases(b, { ...b, brainstorm: { status: "in_progress", substep: "gather" } }, "substep"), []);
  assert.deepEqual(diffPhases(b, b, "status"), []);
  assert.deepEqual(diffPhases(b, b, "grant_fix_rounds"), []);
  assert.deepEqual(diffPhases(c, a, "reset"), [{ action: "reset" }]);
});

test("implementAutoCompletes only when implement is in progress and every task is complete|skipped", () => {
  const p = { ...emptyPhases(), implement: { status: "in_progress" as const } };
  assert.equal(implementAutoCompletes(p, [{ status: "complete" }, { status: "skipped" }]), true);
  assert.equal(implementAutoCompletes(p, [{ status: "complete" }, { status: "failed" }]), false);
  assert.equal(implementAutoCompletes(p, []), false);
  assert.equal(implementAutoCompletes(emptyPhases(), [{ status: "complete" }]), false);
});

test("foldAccumulators sums counts/tokens, maxes peak_context, takes last_sha256 from the later block, and is associative", () => {
  const a: Accumulators = { ...emptyAccumulators(), amendments: 1, phases: { plan: { tokens: { input: 10, output: 1, cache_read: 0, cache_write: 0, cost: 0.5 }, peak_context: 100, user_messages: 2 } }, spec_writes: { brainstorm: { count: 2, last_sha256: "aa" } }, personas: { implementer: { dispatches: 1, models: ["m1"] } } };
  const b: Accumulators = { ...emptyAccumulators(), amendments: 2, phases: { plan: { tokens: { input: 5, output: 1, cache_read: 2, cache_write: 0, cost: 0.25 }, peak_context: 50, compactions: 1 } }, spec_writes: { brainstorm: { count: 1, last_sha256: "bb" } }, personas: { implementer: { dispatches: 2, models: ["m1", "m2"] } } };
  const c: Accumulators = { ...emptyAccumulators(), gates: { spec_rounds: 1, plan_rounds: 0, fix_round_grants: 0, task_reopens: 0 } };
  const ab = foldAccumulators(a, b);
  assert.equal(ab.amendments, 3);
  assert.deepEqual(ab.phases.plan, { tokens: { input: 15, output: 2, cache_read: 2, cache_write: 0, cost: 0.75 }, peak_context: 100, user_messages: 2, compactions: 1 });
  assert.deepEqual(ab.spec_writes.brainstorm, { count: 3, last_sha256: "bb" });
  assert.deepEqual(ab.personas.implementer, { dispatches: 3, models: ["m1", "m2"] });
  assert.deepEqual(foldAccumulators(ab, c), foldAccumulators(a, foldAccumulators(b, c)));
});

test("capEvents drops oldest non-lifecycle events first and reports the drop count", () => {
  const events: TelemetryEvent[] = [ev({ kind: "phase", action: "start", name: "brainstorm" } as any)];
  for (let i = 0; i < 305; i++) events.push(ev({ kind: "dispatch", agent: `a${i}` } as any));
  events.push(ev({ kind: "ship", option: "squash" } as any));
  const { events: kept, dropped } = capEvents(events, 300);
  assert.equal(kept.length, 300);
  assert.equal(dropped, 7);
  assert.equal(kept[0].kind, "phase");
  assert.equal((kept[1] as any).agent, "a7");
  assert.equal(kept.at(-1)!.kind, "ship");
});

test("capEvents never drops lifecycle events and leaves derive unchanged when lifecycle events exceed the cap", () => {
  const rec = newRecord({ spec: "doc/specs/a.md", session: "s1", now: "2026-09-17T10:00:00Z", runId: "r1" });
  rec.events = [
    ...Array.from({ length: 305 }, (_, i) => ev({
      kind: "phase",
      action: i % 2 === 0 ? "start" : "complete",
      name: "brainstorm",
      ts: new Date(Date.parse("2026-09-17T10:00:00Z") + i * 1000).toISOString(),
    } as any)),
    ...Array.from({ length: 10 }, (_, i) => ev({ kind: "dispatch", agent: `a${i}` } as any)),
  ];
  const before = JSON.stringify(derive(rec, "2026-09-17T12:00:00Z"));
  const capped = capEvents(rec.events, 300);
  rec.events = capped.events;
  assert.equal(capped.events.length, 305);
  assert.ok(capped.events.every((event) => event.kind === "phase"));
  assert.equal(capped.dropped, 10);
  assert.equal(JSON.stringify(derive(rec, "2026-09-17T12:00:00Z")), before);
});

test("derive: phase timing from events, counts from accumulators, ship_option from the live ship event; unchanged by the cap", () => {
  const rec = newRecord({ spec: "doc/specs/a.md", session: "s1", now: "2026-09-17T10:00:00Z", runId: "r1" });
  rec.events.push(
    ev({ kind: "phase", action: "start", name: "brainstorm", model: "p/m", thinking: "high", ts: "2026-09-17T10:00:00Z" } as any),
    ev({ kind: "phase", action: "complete", name: "brainstorm", phase: "brainstorm", ts: "2026-09-17T10:10:00Z" } as any),
    ev({ kind: "phase", action: "start", name: "ship", ts: "2026-09-17T11:00:00Z" } as any),
    ev({ kind: "ship", option: "pr", phase: "ship", ts: "2026-09-17T11:05:00Z" } as any),
    ev({ kind: "ship_failed", phase: "ship", ts: "2026-09-17T11:06:00Z" } as any),
    ev({ kind: "ship", option: "squash", phase: "ship", ts: "2026-09-17T11:07:00Z" } as any),
  );
  rec.accumulators.s1 = { ...emptyAccumulators(), amendments: 1, events_dropped: 3, phases: { brainstorm: { tokens: { input: 1, output: 2, cache_read: 0, cache_write: 0, cost: 0.1 }, compactions: 1 }, unphased: { tokens: { input: 9, output: 0, cache_read: 0, cache_write: 0, cost: 0 } } }, gates: { spec_rounds: 2, plan_rounds: 1, fix_round_grants: 0, task_reopens: 0 } };
  rec.approved_at = "2026-09-17T10:10:00Z";
  rec.shipped_at = "2026-09-17T11:07:00Z";
  const d = derive(rec, "2026-09-17T12:00:00Z");
  assert.equal(d.duration_s, 67 * 60);
  assert.deepEqual(d.phases.brainstorm, { started_at: "2026-09-17T10:00:00Z", completed_at: "2026-09-17T10:10:00Z", duration_s: 600, model: "p/m", thinking: "high", tokens: { input: 1, output: 2, cache_read: 0, cache_write: 0, cost: 0.1 }, compactions: 1 });
  assert.deepEqual(d.phases.unphased, { tokens: { input: 9, output: 0, cache_read: 0, cache_write: 0, cost: 0 } });
  assert.equal(d.phases.ship?.started_at, "2026-09-17T11:00:00Z");
  assert.equal(d.phases.ship?.completed_at, undefined);
  assert.deepEqual(d.gates, { spec_rounds: 2, plan_rounds: 1, fix_round_grants: 0, task_reopens: 0, ship_option: "squash" });
  assert.equal(d.amendments, 1);
  assert.equal(d.spec_edits_after_ship, 0);
  assert.equal(d.events_dropped, 3);
  assert.equal("plan" in d, false);
  assert.equal("tests" in d, false);
  const before = JSON.stringify(d);
  rec.events = capEvents([...rec.events, ...Array.from({ length: 400 }, (_, i) => ev({ kind: "dispatch", agent: `x${i}`, phase: "plan" } as any))], 300).events;
  assert.equal(JSON.stringify(derive(rec, "2026-09-17T12:00:00Z")).replace(/"personas":\{[^}]*\}/, ""), before.replace(/"personas":\{[^}]*\}/, ""));
});

test("serializeRecord -> parseRecord round-trips run_id, events, accumulators, and writes derived before accumulators/events", () => {
  const rec = newRecord({ spec: "doc/specs/a.md", session: "s1", now: "2026-09-17T10:00:00Z", runId: "r1" });
  rec.events.push(ev({ kind: "phase", action: "start", name: "brainstorm" } as any));
  rec.accumulators.s1 = { ...emptyAccumulators(), conformance_open_gaps: 2, amendments: 2 };
  rec.derived = derive(rec, "2026-09-17T10:01:00Z");
  const text = serializeRecord(rec);
  assert.ok(text.startsWith("schema: 1\nspec: doc/specs/a.md\nrun_id: r1\n"), text.slice(0, 80));
  assert.ok(text.indexOf("derived:") < text.indexOf("accumulators:") && text.indexOf("accumulators:") < text.indexOf("events:"));
  assert.match(text, /^  - \{ ts: .*kind: phase.*\}$/m);
  assert.doesNotMatch(text, /null/);
  const back = parseRecord(text)!;
  assert.equal(back.run_id, "r1");
  assert.deepEqual(back.events, rec.events);
  assert.deepEqual(back.accumulators, rec.accumulators);
  assert.equal(back.derived.conformance_open_gaps, 2);
  assert.ok(text.indexOf("conformance_loops:") < text.indexOf("conformance_open_gaps:"));
  assert.equal(parseRecord("not: [valid"), undefined);
  assert.equal(parseRecord("schema: 2\nspec: x"), undefined);
});

test("serializeRecord keeps a populated 300-event record under 450 lines with leaf objects in flow style", () => {
  const tokens = { input: 100, output: 20, cache_read: 30, cache_write: 4, cost: 0.5 };
  const phases = Object.fromEntries(["brainstorm", "plan", "implement", "verify", "ship"].map((phase) =>
    [phase, { tokens, peak_context: 20_000, user_messages: 3 }]
  ));
  const personas = Object.fromEntries(["brainstormer", "spec_reviewer", "planner", "plan_reviewer", "implementer", "reviewer", "verifier"].map((persona) =>
    [persona, { dispatches: 2, models: ["provider/model-a", "provider/model-b"], tokens }]
  ));
  const reviews = Object.fromEntries(["spec", "plan", "code"].map((review) =>
    [review, { dispatches: 2, nonzero_exit: 1, findings: { blocker: 0, major: 1, minor: 2 } }]
  ));
  const populated = (): Accumulators => ({
    ...emptyAccumulators(), phases, personas, reviews,
    gates: { spec_rounds: 2, plan_rounds: 2, fix_round_grants: 1, task_reopens: 1 },
  } as Accumulators);
  const rec = newRecord({ spec: "doc/specs/populated.md", session: "s1", now: "2026-09-17T10:00:00Z", runId: "populated", branch: "main" });
  rec.accumulators = { s1: populated(), s2: populated() };
  rec.derived = {
    ...rec.derived, phases, personas, reviews,
    gates: { spec_rounds: 4, plan_rounds: 4, fix_round_grants: 2, task_reopens: 2 },
    plan: { tasks: 10, complete: 8, failed: 1, skipped: 1 }, tests: { command: "node --test", result: "pass" },
    diff: { base: "main", commits: 3, buckets: { source: { files: 10, insertions: 100, deletions: 20 }, tests: { files: 5, insertions: 50, deletions: 5 }, docs: { files: 5, insertions: 25, deletions: 2 } } },
    modified_files: Array.from({ length: 20 }, (_, i) => `extensions/file-${i}.ts`),
  };
  rec.events = Array.from({ length: 300 }, (_, i) => ev({ kind: "dispatch", agent: `agent-${i}`, phase: "implement" } as any));

  const text = serializeRecord(rec);
  assert.ok(text.split("\n").length < 450, `serialized record has ${text.split("\n").length} lines`);
  assert.match(text, /^    implementer: \{ dispatches: /m);
  assert.deepEqual(parseRecord(text), rec);
});

test("parseRecord drops malformed accumulator blocks and fills missing fields", () => {
  const rec = newRecord({ spec: "doc/specs/a.md", session: "s1", now: "2026-09-17T10:00:00Z", runId: "r1" });
  const text = serializeRecord(rec).replace("accumulators: {}", "accumulators: { s1: null, s2: 5, s3: { amendments: 2 } }");
  const parsed = parseRecord(text)!;
  assert.deepEqual(Object.keys(parsed.accumulators), ["s3"]);
  assert.equal(parsed.accumulators.s3.amendments, 2);
  assert.deepEqual(parsed.accumulators.s3.phases, {});
  assert.doesNotThrow(() => derive(parsed, "2026-09-17T10:01:00Z"));
  assert.equal(derive(parsed, "2026-09-17T10:01:00Z").amendments, 2);
});

