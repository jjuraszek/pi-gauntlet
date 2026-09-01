# Deterministic plan checker and Parallel-safe probe (gh-19)

**Ticket:** jjuraszek/pi-gauntlet#19
**Predecessor context (not superseded):** `doc/specs/2026-08-23-gh-13-plan-fidelity-anchors.md` introduced the anchor grammar, the `## Spec coverage` table, and the Self-Review check content this spec mechanizes. This spec inlines the grammar it needs and is **authoritative** wherever the two disagree; the gh-13 spec remains history/rationale.

## Context

`writing-plans` § Self-Review is a checklist run by the same LLM that wrote the plan, in the same context that produced its errors (`skills/writing-plans/SKILL.md:293-316` - eleven bullets). Nothing downstream verifies it ran or passed: § Execution Handoff (`:320-333`) completes the plan phase and auto-invokes `/skill:subagent-driven-development` with no checker artifact. Separately, the review-boundary `Parallel-safe:` line - grammar `Parallel-safe: <group>[; <group>]*` where `<group> = <comma-separated finding-id list> " disjoint" | <finding-id> " conflicts " <finding-id> " (" <reason> ")"`, pinned byte-identical (modulo id prefix) across **five** files with "change them together or not at all" comments (`agents/code-reviewer.md`, `agents/spec-reviewer.md`, `agents/conformance-reviewer.md`, `skills/requesting-code-review/code-reviewer.md`, `skills/subagent-driven-development/spec-reviewer-prompt.md`) - degrades **silently** to fully-sequential fixes when missing or malformed (`skills/dispatching-parallel-agents/SKILL.md:115`). Session evidence in the ticket: ~35% of actionable whole-diff reviews omitted the line.

The repo already has the enforcement machinery this needs: `extensions/phase-tracker.ts` registers tools (`gauntlet_setting` at `:642`, `phase_tracker` at `:661`), rebuilds its in-memory flow state by replaying session tool results (`reconstructState`, `:362-399`, fired on session start/switch/fork/tree; it skips results whose details carry `error`), and enforces gates two ways: the `tool_call` guard (closure-model guard `:436-482`, gated by `closureReview.enforce`; non-write/edit/bash tools early-return at `:492`) and tool-execute-time rejection (the `complete verify` closure gate, `:737-751`). Flow guards resolve `piGauntlet.flowGuards.enforce` as a **boolean** - enforcing unless explicitly `false` (`extensions/lib/gauntlet-settings.ts:97`); there is no warn rung. Pure logic lives in `extensions/lib/` with paired unit tests (`gauntlet-settings.ts` precedent), wired into `npm test` via `scripts/ci.mjs`.

## Problem

Two honor-system mechanical contracts:

1. **Plan Self-Review.** The purely mechanical checks (set operations, greps, path probes over already-authored text) are executed by LLM attention. A skipped or botched check poisons the entire execution run: every implementer, reviewer, and the conformance gate consume the defective plan.
2. **`Parallel-safe:` consumption.** The fix fan-out trigger reads the reviewer's partition certificate with no structural validation and a silent sequential fallback - the ~35% omission rate silently forfeits parallelism with no visible signal.

## Goals

- Exactly the mechanical subset of Self-Review runs as **one deterministic command** (`plan_check` tool) with a pass/fail result; findings name the check and the offending plan line(s); all violations reported in one run.
- Execution start is blocked **by mechanism, not instruction**: a pass stamp bound to hashes of the plan and spec file bytes, verified at implement-start. "Checker failed", "checker never ran", and "plan or spec edited after stamping" are all mechanically detected.
- The `Parallel-safe:` probe is **encouraged, not forced**: a prose-level structural contract at the consumer boundary - fixed grammar check, one reviewer re-ask, then explicit (never silent) sequential fallback. No tool, no guard.
- No new human gate. Checker findings are assessed and fixed by the main model autonomously; the human gates remain spec approval and the end gate. (The pre-existing Open Questions halt is the one sanctioned stop - see the fix-loop bound below.)
- No new settings key. Enforcement rides `piGauntlet.flowGuards.enforce` (existing boolean: enforcing unless explicitly `false`).
- Surgical prompt footprint: skill-body deltas are minimal line counts, not rewrites.

## Non-goals / out of scope

- Judgment checks stay prose (the exact post-edit bullet list is in "Skill-body deltas" below).
- Fix-round / conformance-loop task anchoring: settled closed by the #13 follow-up (gap-block `origin` + `remediation` is that loop's own mechanism). The checker's reach ends at the planning-phase plan document.
- Monitoring plan edits mid-execution. The stamp is consumed once, at implement-start; checkbox ticks and fix-round annotations after start are unvalidated by design.
- Validating spec content quality. The checker validates the plan grammar and plan-vs-spec mechanical relations only.
- Part-2 tooling (tool-mode probe, forcing reviews to disk). Rejected as disproportionate: the failure mode is correct-but-slower, and review results are in-context text with no byte-hashable artifact.
- The plan-time wave `Parallel-safe:` line in writing-plans (`SKILL.md:145-148`): deliberately different free-text form; source comments say do NOT unify. The probe targets only the review-boundary grammar.
- A warn enforcement rung. `flowGuards.enforce` stays boolean; no resolver or settings-schema change.

## Deviations from the ticket (requester-approved)

1. **Scoped-test coverage stays LLM-side** (ticket classified it mechanical). Deciding whether a `Run:` line is a *test* command (vs. format/lint/build) requires recognizing project-specific test entrypoints - a heuristic, not a deterministic predicate. The checker implements 8 checks, not the ticket's 9.
2. **§ Execution Handoff stays unchanged** (ticket asked it to document fix-then-rerun). The fix-then-rerun loop is documented in the replacement Self-Review bullet instead - where the checker is invoked - and the guard enforces silently at handoff; duplicating the mechanism into Handoff prose is the honor-system pattern this ticket removes.
3. **Part 2 ships without fixtures** (ticket asked for valid / invalid-then-valid / invalid-then-invalid fixtures). Part 2 is a prose contract with no code surface to test; the requester chose "encouraged, not forced".
4. Checker placement (left open by the ticket): extension-registered tool, no new extension file (see Design).

## Reconciling with #15's "no new gate on writing-plans problems" ruling

#15 explicitly ruled against a mechanical reverse-closure gate, keeping plan-problem fixes LLM-driven. This spec does not reverse that ruling; it distinguishes check *kinds*. #15's reverse-closure ("every normative clause has a row") needs LLM judgment to identify clause boundaries - mechanizing it would encode a wrong, brittle proxy. #19's subset is judgment-free by construction (set operations over headings/rows/anchors, literal search, path probes, hash comparison), and the ticket supplies failure evidence #15 lacked. The #15 principle survives intact as this spec's own boundary: everything requiring judgment stays prose, and findings are still fixed by the LLM - only the *detection* and the *did-it-run* proof become mechanical.

## Design

### Part 1: `plan_check` tool + stamp + guard

**New file `extensions/lib/plan-check.ts`** - pure functions, no I/O except the injected filesystem port:

- **Plan parser** (grammar normative here):
  - Wave header: `^## Wave (\d+) (—|-) (.+)$` - number, separator (em dash or ASCII hyphen), non-empty label.
  - Task header: `^### Task (\d+): `. A task's **body** = lines from its header to the next `##` or `###` heading (fenced blocks included).
  - `**Files:**` block: the `Create:` / `Modify:` / `Test:` list items under a task's `**Files:**` line. Paths are worktree-relative (resolved against the tool's cwd, the worktree root).
  - Task anchor line: `**Spec:** <path> § "<heading>" L<start>[-L<end>][, § "<heading>" L<start>[-L<end>]]*`. The single-line form `L<n>` is equivalent to `L<n>-L<n>` - it is the established plan convention (`writing-plans` uses it in its own coverage-table example), so the parser accepts both. The `§` marker discriminates task anchors from the plan header's backticked, path-only `**Spec:**` line (which supplies the spec path).
  - `Solo:` line: a body line directly under a wave header matching `^Solo: (.+)$`.
  - Header `**Verification:**` line: the trimmed remainder after the marker is **the entrypoint string** for check 8.
  - `## Spec coverage` rows: `| <anchor> | <requirement> | <owner> |`. Requirement rows: owner = comma-separated `Task <n>` list, or `waived: <reason>`. Mechanical rows: anchor cell `-`, requirement cell starting `mechanical: `.
- The 8 checks (catalog below), each returning findings `{ check: <id>, line: <number(s)>, text: <offending line quoted>, reason: <one line> }`. All checks run to completion - the findings list reports **every** violation, no first-failure short-circuit.
- `sha256(bytes)` helper (node `crypto`).
- **Filesystem port** (injected, stubbed in tests): `{ exists(path): boolean, glob(pattern): string[] }`. `glob()` uses `node:fs` `globSync` semantics (`*`, `**`, `?`, braces), resolved against the worktree root. An invalid pattern or a thrown expansion = fail-closed finding on the offending line.

**New file `extensions/lib/plan-check.test.ts`** - fixture-driven unit tests (see Testing).

**`extensions/phase-tracker.ts` additions** (four localized deltas):

1. **Tool registration** `plan_check({ planPath })`:
   - Reads plan bytes at `planPath` (absolute, or resolved against cwd). Missing/unreadable plan -> finding `{ check: "input" }`, fail.
   - Extracts the spec path from the plan header's path-only `**Spec:**` line; reads spec bytes. Unresolvable or unreadable spec -> finding, fail (fail-closed - anchor/quote checks cannot run without it).
   - Runs the 8 checks via lib.
   - Findings present -> returns a **failure result**: text starts `FAIL`, one line per finding; structured details carry `{ status: "fail", planPath }`. Never a thrown tool error - thrown errors are invisible to state reconstruction (`reconstructState` skips `details.error`), and a fail must replay to clear a stale stamp. Clears the current flow's stamp.
   - Zero findings -> returns `PASS`; details carry `{ status: "pass", planPath, planSha256, specPath, specSha256 }`; writes the stamp into the current flow's in-memory state. Outside an entered flow: returns "pass (no flow to stamp)" - plain-linter mode, no stamp, no guard armed.
   - Any internal error -> finding `{ check: "internal" }`, fail, no stamp. Fail-closed always.
2. **State field**: `planCheckStamp?: { planPath: string, planSha256: string, specPath: string, specSha256: string }`. Last write wins (one flow, one active plan - matching plan_tracker's single-plan model). The stamp binds **both** files: quote-integrity and anchor-resolution results depend on spec bytes, and nothing mechanically freezes the spec between checking and implement-start.
3. **Reconstruct replay**: `reconstructState` gains a `plan_check` branch - replay `plan_check` tool results in branch order, last result wins: `status: "pass"` -> restore the stamp from details; `status: "fail"` -> clear it. Fork/tree sessions follow the same branch-replay semantics as the existing flags. (This is why fail is a failure *result*, not a thrown error.)
4. **Implement-start gate**, execute-time: inside `phase_tracker`'s own execute handler, matching the `complete verify` closure gate (`:737-751`) - **not** the `tool_call` guard, whose non-write/edit/bash early-return (`:492`) would make an appended branch dead code. When the flow is entered, `flowGuards.enforce` is not `false`, and the call is `{ action: "start", phase: "implement" }`:
   - No stamp -> reject: `plan not verified - run plan_check({ planPath: "<path or unknown>" }) and fix findings before starting implementation`.
   - Stamp present -> re-read both `stamp.planPath` and `stamp.specPath`, re-hash, compare. Either mismatch -> reject naming the stale file and the re-run remedy. Either file missing -> reject naming the missing path.
   - `enforce: false` -> silent, no gate; the tool still checks and stamps when invoked.

The gate fires at implement-start only. It does not inspect implementer dispatches (single enforcement point; SDD always starts the phase before dispatching) and does not re-check during execution.

### Part 1: skill-body deltas

`skills/writing-plans/SKILL.md` § Self-Review - per-bullet disposition of all **eleven** current bullets:

| current bullet | disposition |
|---|---|
| Table closure (three legs) | mechanized (check 1), **except** two legs that stay prose: waiver authorization ("waived only when the spec itself marks it out of scope"), Documentation-impact mapping ("each entry maps to a plan task or explicit none") |
| Code-vs-anchor sanity | stays verbatim |
| Quote integrity | mechanized (check 2) |
| Anchor resolution | mechanized (check 3) |
| Paths exist | mechanized (check 4) |
| Placeholder scan | mechanized (check 5) |
| Type / API consistency | stays verbatim |
| Wave disjointness | `Files:` half mechanized (check 6); runtime-resource half becomes its own prose bullet |
| Solo-wave justification | presence + non-empty reason mechanized (check 7); "the reason names a real blocker" becomes its own prose bullet |
| Scoped-test coverage | stays verbatim |
| Header-only entrypoint | mechanized (check 8) |

Post-edit § Self-Review = **one checker bullet + seven judgment bullets**. The checker bullet: run `plan_check({ planPath })` on the saved plan; assess and fix every finding yourself (no human involvement), re-run until pass - a pass writes the execution stamp. If the same finding survives 3 fix rounds, convert it to an explicit Open Question and stop. That halt is the **pre-existing** Open-Questions stop (resolved by the human in-session, as that section always intended) - the one sanctioned stop in the checker loop, not a new gate. The seven judgment bullets: code-vs-anchor sanity, type/API consistency, scoped-test coverage (all verbatim), plus runtime-resource disjointness, solo-reason validity, waiver authorization, and Documentation-impact mapping (extracted from their current host bullets).

§ Execution Handoff: unchanged. `skills/subagent-driven-development/SKILL.md`: no Part-1 change (the gate is self-describing at implement-start).

### Part 2: `Parallel-safe:` structural probe (prose, encouraged)

Consumer-boundary contract, applied where the certificate is consumed:

- **Probe:** the review result must contain **exactly one** line matching `^Parallel-safe: ` whose remainder parses as `<group>[; <group>]*` with `<group> = <comma-separated finding-id list> " disjoint" | <finding-id> " conflicts " <finding-id> " (" <reason> ")"`. Zero matching lines, an unparseable remainder, or **any second** `^Parallel-safe: ` line (identical or not) = malformed.
- **Applicability:** the probe runs whenever the consuming loop is about to make a fan-out decision - i.e. the report carries >= 2 actionable finding IDs. Actionable per producer: Critical/Moderate `F<n>` findings (code-reviewer); PARTIAL/MISSING/scope-creep `F<n>` findings (spec-reviewer); non-DELIVERED `G<n>` gaps (conformance-reviewer). Fewer than 2 actionable IDs -> skip (nothing to fan out).
- **Re-ask:** probe fails -> re-ask the reviewer **once**, quoting the expected grammar. The re-ask completes before any disposition or fan-out decision.
- **Fallback:** probe still failing after the re-ask -> fully sequential fixes, with an explicit one-line degradation notice in the orchestrator's visible output (never silent).
- **Well-formed but serial:** a probe-passing line with no >= 2-ID `disjoint` group is valid - sequential fixes, **no re-ask**, no notice required (this is the certificate saying "serial", not a malformation).
- Reviewer errors (no report at all) are out of scope - this is report-shape validation, not report-existence validation; existing dispatch-failure handling applies.

Edits (3-4 lines each, at existing consumption points):

- `skills/dispatching-parallel-agents/SKILL.md` § Fix fan-out: the **Degradation** paragraph (`:115`) changes from silent fallback to the probe -> one re-ask -> explicit-notice contract above, with the well-formed-serial case named separately (no re-ask).
- `skills/requesting-code-review/SKILL.md` § Fix rounds (`:60`): one sentence pointing the `Parallel-safe:` consumption at the probe contract in dispatching-parallel-agents (single source of truth there, not restated).
- `skills/subagent-driven-development/SKILL.md:244`: scope the existing red flag ("sequential despite a >= 2-ID disjoint group") to a **certified** (probe-passing) disjoint group, so the mandated post-re-ask sequential fallback does not trip it.

Producer side - all five pinned grammar copies (`agents/code-reviewer.md`, `agents/spec-reviewer.md`, `agents/conformance-reviewer.md`, `skills/requesting-code-review/code-reviewer.md`, `skills/subagent-driven-development/spec-reviewer-prompt.md`): **untouched**. The probe validates consumption.

## Check catalog (the 8 mechanical checks)

Check semantics originate in the corresponding writing-plans § Self-Review bullets; the operationalization below is normative:

| # | check id | predicate |
|---|---|---|
| 1 | `table-closure` | Every `## Spec coverage` requirement row's owner is a `Task <n>` list or `waived: <reason>`; every `### Task N` heading appears in >= 1 row; every requirement row's anchor is contained in the anchor set of **each** listed owner task's `**Spec:**` line; every anchor-less task has a mechanical row. Zero orphans on all legs. (Waiver authorization and Documentation-impact mapping stay judgment-side.) |
| 2 | `quote-integrity` | For every non-waived requirement row: each backtick-quoted literal inside the row's anchored spec lines (backticks stripped; spans containing `<placeholder>` segments skipped) appears verbatim (literal substring match) in **each** owning task's body. |
| 3 | `anchor-resolution` | Every task-level `§` anchor's quoted heading matches an ATX heading in the spec file (lines inside fenced code blocks excluded; an ambiguous heading match = finding) and `L<start>-L<end>` is in-bounds, non-empty, and within that heading's section. |
| 4 | `paths-exist` | Every literal `Modify:` path (trailing `:line[-line]` stripped) passes `exists()`; every `Modify:` glob's `glob()` expansion is non-empty. `Create:`/`Test:` exempt unless the `Test:` path is also listed under `Modify:`. |
| 5 | `placeholder-scan` | Plan text (fenced code blocks included) contains none of: `TODO`, `TBD`, `xxx`, `[fill in]`, `<example>`, `etc.`, `probably`, `something like` - all matches case-insensitive. **Exemption:** within a task's body, occurrences of a literal that check 2 requires that task to carry verbatim are exempt (a required quote can never be a placeholder violation). |
| 6 | `wave-file-disjointness` | For every wave with >= 2 tasks, the tasks' declared `Files:` path sets are pairwise disjoint. Overlap is decided over the current tree via the filesystem port: literal-vs-literal = string equality; literal-vs-glob = the literal appears in the glob's expansion; glob-vs-glob = the expansions intersect. |
| 7 | `solo-line` | Every single-task wave carries a `Solo:` line directly under its wave header with non-empty reason text. (Whether the reason names a real blocker stays judgment-side.) |
| 8 | `header-entrypoint` | The header entrypoint string (the trimmed remainder of the `**Verification:**` line) appears zero times in any wave or task body. |

Malformed or missing structural input (no `## Spec coverage` table, a task without `**Files:**`, an unparseable anchor, an invalid glob, an ambiguous heading match) **fails closed** with a finding naming the check and the line - never a crash, never a silent pass. A plan missing the gauntlet grammar entirely fails with findings naming the absent structures.

## Edge cases

- **Fix-it loop bound:** 3 rounds on the same finding -> Open Question + stop (the pre-existing Open-Questions halt, human-resolved in session; the one sanctioned stop).
- **Stale stamp at implement-start** (plan *or* spec edited after stamping): gate rejects; autonomous recovery is re-run `plan_check`, retry start. No human.
- **Plan renamed after stamping:** gate's re-read of `stamp.planPath` fails -> reject -> re-run on the new path.
- **CRLF / trailing newline:** hashes are over raw bytes; any byte change invalidates. No normalization.
- **Stamp self-invalidation:** impossible by construction - the stamp lives in phase-tracker state, not in the hashed files.
- **Resumed / forked session:** the stamp is rebuilt by the `reconstructState` replay branch (delta 3) - last `plan_check` result on the branch wins, pass restores, fail clears. An unmodified plan+spec passes the gate without re-running the checker.
- **`enforce: false`:** gate silent; tool still available, still stamps. No other rungs exist.
- **Duplicate `Parallel-safe:` lines in one review:** any second matching line = malformed -> re-ask (consistent with the probe's exactly-one rule).

## Testing

- **Unit (core):** `extensions/lib/plan-check.test.ts`, run by `scripts/ci.mjs` (added to its explicit test-file list). Shared fixtures: one minimal valid plan+spec pair, then per-check mutations. Per check: a passing fixture and a failing fixture asserting the finding names the check id and the offending line. One aggregate fixture with multiple simultaneous violations asserting **every** finding is reported (no short-circuit). Fail-closed fixtures: missing `Files:` block, unresolvable spec path, ambiguous anchor, invalid glob. Exemption fixture: a requirement row whose anchored spec lines quote a banned token (e.g. `TODO`) - check 2 requires it, check 5 exempts it, the fixture passes. Hash: same bytes -> same digest; one-byte edit -> mismatch.
- **Gate + replay integration:** extend `extensions/phase-tracker.test.ts` with the existing harness: no-stamp -> reject; matching stamp -> pass; stale plan bytes -> reject; stale spec bytes -> reject; `enforce: false` -> no rejection; reconstruct fixtures - replay a pass result -> stamp restored; pass-then-fail sequence -> stamp cleared; resume/fork rebuild. Plus tool-registration capture of `plan_check`.
- **CI wiring:** `scripts/ci.mjs` syntax-checks `extensions/lib/plan-check.ts` via its existing extension-syntax pass and runs the new test file.
- **Part 2:** no code, no fixtures (recorded deviation 3) - prose contract; the grammar's byte-identical pinning is already comment-enforced at the five copies.
- **Live check (during this feature's own gauntlet run):** `pi install -l <worktree>`, run `plan_check` against the plan this feature produces - the feature dogfoods itself.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (phase-tracker extension entry: `plan_check` tool + implement-start gate), `AGENTS.md` (extensions table, same row), `doc/configuration.md` (flow-guards section: sixth guard - implement-start rejected without a current stamp; block-only, disabled by `enforce: false`)
- Derived / memory docs invalidated: none

## Acceptance criteria

1. `plan_check({ planPath })` runs exactly the 8 catalog checks deterministically; findings name check id + offending line(s); all violations reported in one run; the parser implements the grammar in Design (wave header, task body bounds, anchor line, coverage-row tokenization, worktree-relative path resolution).
2. A pass writes a `{ planPath, planSha256, specPath, specSha256 }` stamp into phase-tracker flow state via a `PASS` result whose details carry those fields; a fail (including internal errors and malformed input) returns a failure **result** (never a thrown error), writes no stamp, and clears any prior stamp; `reconstructState` replays `plan_check` results (last wins) so the stamp survives resume/fork/tree.
3. With `flowGuards.enforce` not `false` and a flow entered: `phase_tracker({ start, implement })` is rejected at execute time when the stamp is missing, either hash is stale, or either file is gone - each rejection names the `plan_check` remedy. Fixtures prove failed-check, never-ran, stale-plan, and stale-spec paths all halt. `enforce: false` -> no rejection.
4. `writing-plans` § Self-Review matches the per-bullet disposition table: one checker bullet (with the autonomous fix loop and the 3-round Open-Questions bound) plus the seven named judgment bullets; § Execution Handoff unchanged; no **new** human pause anywhere in the loop (the pre-existing Open-Questions halt is the only sanctioned stop).
5. `dispatching-parallel-agents` § Fix fan-out specifies probe -> one re-ask -> explicit-notice sequential fallback, with the well-formed-serial case exempt from re-ask; `requesting-code-review` § Fix rounds points at it; SDD `:244`'s red flag is scoped to certified groups; all five producer grammar copies untouched.
6. `npm test` passes with the new unit + gate/replay tests wired into `scripts/ci.mjs`.
7. No new settings key, no settings-schema change; no new extension file; no new human gate.
