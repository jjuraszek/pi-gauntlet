# Minor findings ride along in fix rounds, never buy one

> **Superseded by:** [doc/specs/2026-10-19-gh-71-drop-sequential-mode.md](./2026-10-19-gh-71-drop-sequential-mode.md) - D6 `## Fix delta` definitions only

**Ticket:** jjuraszek/pi-gauntlet#56
**Goal:** A Minor code-review finding never triggers an implementer dispatch or a re-review on its own; it is fixed when a round is already forced by a Critical or Moderate finding, and the whole-diff review's Minors reach the finish gate as an informational, opt-in list. Re-reviews stop buying rounds through out-of-delta findings. Conformance keeps no severity. Telemetry counts the tags the code-reviewer persona emits.

Supersedes `doc/specs/2026-09-23-gh-47-review-contract-single-owner.md`, scope: the `requesting-code-review` "Fix rounds" clause on Minor handling only. Its single-owner structure (persona owns the report shape, `requesting-code-review` owns what the recipient does with it, dispatchers point) is what this design relies on and stays.

## Problem

`agents/code-reviewer.md` already grades Minor as "the only severity declinable without a fix round or re-review" and makes Minor-only reports `SHIP` (gh-30). `requesting-code-review` already says "Minor findings never trigger the fan-out". Orchestrators still buy rounds for them, because the text they execute - `skills/subagent-driven-development/SKILL.md` Fix-Loop Rounds - says "Issues -> dispatch fix" and "Any clean review ends the loop", and a `SHIP` report listing four Minors reads as "issues", not "clean". Per-task step 6 (`:65`) and wave step 6 (`:173`) say "quality reviewer finds issues -> re-dispatch implementer -> re-review" with no severity filter.

Observed in the gridstrong E-2761 session (2026-08-17, 26 code-reviewer and ~75 implementer dispatches): six implementer tasks followed `SHIP` reports that carried only Minors ("Fix two minor code-review findings", "Two tiny non-blocking cleanups", "Four cosmetic cleanups", "One-comment fix", "Final polish pass"), four of them followed by a re-review. The issue reports the same pattern in run `48de28ea` (17 of 27 reviews `SHIP` with Minors only, 6 followed by polish dispatches; not independently reproduced here).

The same session shows a second round-buyer: re-reviews raise new Moderates in code the fix never touched, so loops run to a third and fourth round while `TRAJECTORY:` reads `CONVERGING`, and gh-47's escalation never fires. Nothing in the persona scopes a re-review; the re-review dispatch pastes the prior report and asks for `TRAJECTORY:`, and the reviewer re-reads the whole task diff.

Telemetry: `extensions/lib/telemetry-collect.ts` `FINDING_TAG_RE` is `/\[(blocker|major|minor)\]/gi`, while the persona emits `[Critical]`/`[Moderate]`/`[Minor]`, so every code review records 0 blocker / 0 major, and the change cannot be measured.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#56, "Acceptance Criteria", rows verbatim:

- [ ] Review loops
  in-scope
- [ ] `skills/subagent-driven-development/SKILL.md` "Fix-Loop Rounds" defines an issue-bearing code review as verdict FIX_FIRST and a clean one as verdict SHIP; per-task step 6 and whole-diff step 2 use that same definition.
  in-scope
- [ ] The same file states that a fix round's implementer task carries only the report's Critical and Moderate findings, for every verdict, and that every Minor finding - from SHIP and FIX_FIRST reports alike - is appended to a deferred-Minors list and produces no implementer dispatch and no re-review.
  deviates: user chose ride-along (Q1). A FIX_FIRST fix task carries the whole report, Minors included; a SHIP report's Minors are dropped; there is no deferred-Minors list. The "no implementer dispatch and no re-review" part for SHIP Minors is adopted and restated in Design D1.
- [ ] The same file includes a worked example of a FIX_FIRST report with 1 Moderate and 3 Minor findings: the implementer task holds the Moderate only, and the 3 Minors land in the deferred-Minors list.
  deviates: under ride-along the worked example's outcome is inverted (Moderate plus the 3 Minors in one task). The example ships with the ride-along outcome, in `requesting-code-review` (the rule's owner), not SDD - Design D1.
- [ ] `skills/requesting-code-review/SKILL.md`'s Minor wording ("never trigger the fan-out", "defer Minor items explicitly") points to the same deferred-Minors list.
  deviates: no list exists; the wording is replaced by the ride-along rule (Design D1).
- [ ] The finish gate in `conformance-check.md` renders the deferred-Minors list with each item's finding text, `file:line`, and originating review; an item is fixed only when the human selects it there.
  deviates: the finish gate renders only the whole-diff review's Minors (Design D3, D4); the "fixed only when the human selects it" part is adopted for that list.
- [ ] Conformance
  in-scope
- [ ] `agents/conformance-reviewer.md` defines a non-blocking gap class and the rule that assigns it (the rule itself is settled in the spec); a non-blocking gap's `recommended:` is never `fix`, and it is carried OPEN to the finish gate through the existing `accept` / `rescope` flow, shown beside the deferred-Minors list.
  deviates: user chose no severity for conformance (Q2). A spec clause is an explicit human ask, so no legitimate gap is "non-blocking"; a class whose `recommended:` is never `fix` would let the reviewer decide which approved clauses matter. Every gap keeps default `fix` (Design D5).
- [ ] `agents/conformance-reviewer.md` includes worked examples under that rule: a design-detail drift that no acceptance criterion or deliverable depends on is non-blocking; a missing required deliverable (e.g. an unopened PR the spec requires) stays `recommended: fix`; a gap matching a deferred Minor gets no automatic fix unless it is blocking under the rule.
  deviates: no non-blocking class (Q2). The persona gains one clarifying sentence instead: a code-review finding with no origin clause is never a gap (Design D5).
- [ ] The `conformance-reviewer` dispatch inputs in `conformance-check.md` exclude the deferred-Minors list, and Convergence still repairs only Critical and Moderate findings.
  deviates: no deferred-Minors list exists to exclude; Convergence's Critical/Moderate filter is unchanged (restated as Design D5).
- [ ] Measurement
  in-scope
- [ ] A `telemetry-collect` unit test feeds a code-reviewer report containing 1 `[Critical]`, 2 `[Moderate]`, and 3 `[Minor]` findings and gets three distinguishable counts of 1, 2, and 3.
  in-scope
- [ ] The existing spec-council tag test (`[blocker]` / `[major]` / `[minor]`) passes unchanged.
  in-scope
- [ ] `gauntlet-performance` run rows and `--json` output show the Critical and Moderate counts for a fixture record that holds them, and a fixture record written before the change still renders.
  in-scope
- [ ] Release
  in-scope
- [ ] `CHANGELOG.md` `## Unreleased` names the change: Minor findings and non-blocking conformance gaps never trigger automatic fix work and are listed at the finish gate; telemetry counts Critical and Moderate code-review findings.
  deviates: no non-blocking conformance gaps exist (Q2); the entry names Minor ride-along, the whole-diff Minors list at the finish gate, re-review scoping, and the telemetry alias (Design D7).

## Design

Constraint from the user: minimal diff; every skill and persona edit follows `/skill:forge-skill` authoring rules (imperative voice, low conditionality, no new sections where a sentence suffices).

### D1 - Fix-round rule, single owner

`skills/requesting-code-review/SKILL.md` "Fix rounds" is the only place that states what a recipient does with a report. Replace "Minor findings never trigger the fan-out" and "defer Minor items explicitly" with:

- A `FIX_FIRST` report's fix round hands the implementer the whole report, Minors included. Sequential fix round (one task): every Minor rides. Fan-out (`Parallel-safe:` certifies >= 2 disjoint Critical/Moderate IDs): the certificate partitions the Critical/Moderate findings exactly as today, `dispatching-parallel-agents`' structural probe keeps Critical/Moderate as the actionable IDs, and each Minor then attaches once to the first task (in `Fn` order) whose ownership boundary (the union of its findings' `touched-files:`) already contains the Minor's `touched-files:`; a Minor no task's boundary contains is not dispatched this round. The boundary never grows for a Minor.
- The implementer fixes the Minors in its task; it may decline one with a stated reason (the persona's "declinable" sentence stands). A declined or unchanged Minor never drives `TRAJECTORY:` (D6).
- A `SHIP` report dispatches nothing and ends the loop; its Minors are not dispatched and not carried, with one exception: the whole-diff review's Minors are carried into the closure block (D3). `REJECT` is neither verdict: stop and report per `stop-note.md`; the loop never enters.
- Worked example: a `FIX_FIRST` report with 1 Moderate and 3 Minors -> one implementer task holding all four findings (one actionable ID, no fan-out); a `SHIP` report with 4 Minors -> no dispatch, loop ends.

### D2 - SDD uses the verdict words

`skills/subagent-driven-development/SKILL.md` Fix-Loop Rounds defines, once, in the "The sequence" paragraph: for code review, *issue-bearing* means verdict `FIX_FIRST` and *clean* means verdict `SHIP`, whatever Minors the report lists; spec review keeps its existing gaps/acceptance meaning. Per-task step 6 (`:65`), wave step 6 (`:173`) and whole-diff step 2 (`:224`) keep their shape and use those words ("If the quality review is issue-bearing -> re-dispatch the implementer per `/skill:requesting-code-review` Fix rounds -> re-review"); whole-diff step 2's "Address Critical and Moderate findings" is replaced by that pointer, and the step additionally says "carry the final report's Minors into the closure block's `whole-diff minors:` section". `REJECT` at any of the three: stop and report per `stop-note.md`. No new section, no policy text in SDD.

### D3 - Closure block carries whole-diff Minors

`skills/verification-before-completion/reference/conformance-check.md` "Closure / conformance": after the flat `auto-applied fix commits:` index, one trailing section present in every block (a `CONFORMS` handoff too):

```text
whole-diff minors: none
```

or one line per finding, the persona's finding line copied verbatim (`[Minor] F3: [shrink] path.ts:30 - ...`, so `Fn` stays the selector), or `whole-diff minors: not recorded` when no whole-diff review ran in this flow (the ad-hoc finish path). It is not a concern card: the sentinel `N`, card count, and freshness rule ignore it. Source is the last whole-diff report; when the whole-diff review itself went `FIX_FIRST` and re-reviewed, the re-review's `SHIP` report is the source. After a `fix minors` round (D4) the regenerated block carries the prior list minus the selected `Fn` lines plus one line `whole-diff minors fix: <full SHA>`, so the spent round survives pruning and resume. Any other re-audit that regenerates the block without the source report copies the prior block's section unchanged.

### D4 - Finish gate renders and offers a single opt-in round

`skills/finishing-a-development-branch/SKILL.md` Step 3.5 renders the section as one informational, non-blocking line in the `happy-path:` position - directly under `Closure / conformance: CONFORMS` on the zero-gap path, directly under the `Conformance: N decisions needed before shipping.` header on the GAPS path (`whole-diff minors (3, not blocking): F3, F7, F9` or `none` / `not recorded`; a closure block lacking the section renders `not recorded`, never a re-audit trigger). The reply point is the Step 4 menu, which both paths reach: `fix minors` (all) or `fix minors F3, F9` is a documented standalone extra reply there, listed under the numbered options like the existing one-off actions. It dispatches one `implementer` round (`cwd` = the worktree, task = the selected finding lines verbatim, `SCOPED_TEST_COMMANDS` = the plan-header verification set), commits `whole-diff minors fix`, and returns to Step 3.5, where the freshness rule re-audits conformance as for any working-tree change and the regenerated block records the spent round (D3); Step 4 then re-renders. No code review follows this round: the whole-diff review is an unscoped first review, so its Minors are graded Minors, not D6 downgrades. A second `fix minors` (the block carries `whole-diff minors fix:`) is refused with "minors round already spent". Any numbered choice ships without them.

### D5 - Conformance unchanged in substance

`agents/conformance-reviewer.md`, under the existing "origin quote or it isn't a gap" rule, one sentence: a code-review finding - style, naming, comment, micro-efficiency - with no origin clause is never a gap, whatever its severity. No severity field, `recommended:` defaults unchanged (`fix` for PARTIAL/MISSING/DRIFTED). `conformance-check.md` Convergence keeps repairing Critical/Moderate only; no text change there beyond D3.

### D6 - Re-review scope

`agents/code-reviewer.md`, one rule under the severity list: on a re-review (the `## Previous review report (re-review trigger)` marker is present), the job is (1) confirm each prior finding is resolved and (2) review the `## Fix delta` block, reading surrounding code as needed. A new finding located outside that delta blocks only when Critical; otherwise grade it `[Minor]` with the note `(outside fix delta)`. The whole-diff review and its re-reviews are never scoped; a whole-diff re-review dispatch carries no `## Fix delta` block, so its Minors are graded Minors (D3 and D4 rely on this).

SDD's re-review dispatch rule adds one block to the payload: `## Fix delta` holding the diff of the fix round just integrated - sequential mode `git diff <HEAD the prior review was dispatched against> HEAD`; wave mode (fixes applied in place on a dirty tree, HEAD unmoved until step 7) the applied fix patch(es) verbatim. Whole-diff re-reviews never carry the block. When the block is absent on a task re-review (a fresh-session resume), the reviewer treats the task's whole diff as the delta - today's behavior.

`skills/subagent-driven-development/code-quality-reviewer-prompt.md` trajectory block: `<n_prev>`/`<n_now>` count Critical and Moderate findings only; `STAGNANT` names a surviving Critical or Moderate; "the fix introduced any new finding" means a new Critical or Moderate. Minors - ride-along ones declined or unchanged, and `(outside fix delta)` downgrades alike - never move the line. The round budget is unchanged.

### D7 - Telemetry alias

`extensions/lib/telemetry-collect.ts`: `FINDING_TAG_RE` becomes `/\[(critical|blocker|moderate|major|minor)\]/gi` with a tag->key map `critical -> blocker`, `moderate -> major`, `minor -> minor`, `blocker`/`major` identity. Schema keys `derived.reviews.*.findings.{blocker,major,minor}`, `gauntlet-performance` columns, and existing records are unchanged; `gauntlet-performance` needs no code change. A report using both spellings counts both (distinct findings, no dedup). `npm run build:bins` regenerates `bin/*.mjs`.

`CHANGELOG.md` `## Unreleased` names: Minor findings ride along in FIX_FIRST fix rounds and never trigger one; the whole-diff review's Minors are listed at the finish gate for opt-in fixing; re-reviews are scoped to the fix delta; telemetry counts `[Critical]`/`[Moderate]` into `blocker`/`major`.

## Errors and edge cases

- FIX_FIRST Minors touching files the Critical/Moderate fix does not: still ride along; `Parallel-safe:` already partitions by file.
- Re-review returns `SHIP` with new Minors: loop ends; those Minors are dropped.
- Re-review out-of-delta Critical: blocks as today.
- Re-review dispatch without `## Fix delta` (e.g. a fresh-session resume): whole task diff is the delta.
- Wave-mode re-review: HEAD has not moved, so the delta is the applied fix patches, never a SHA range.
- `REJECT` from any code review: stop and report; no fix round, no loop entry.
- Fan-out round with a Minor whose file no Critical/Moderate task owns: not dispatched this round; the whole-diff review lists it again if it still stands.
- Whole-diff review `FIX_FIRST`: fix round as today; `whole-diff minors:` takes the final `SHIP` report.
- Closure block without `whole-diff minors:`: finish gate renders `not recorded`, continues; never a re-audit trigger.
- `fix minors` changes the working tree: the freshness rule re-audits conformance; that is the intended path, not an error.
- Telemetry: mixed-spelling reports count both; records written before the change read unchanged.

## Tests

- `extensions/lib/telemetry-collect.test.ts`: one `countFindings` case with a persona-format report (`[Critical]` x1, `[Moderate]` x2, `[Minor]` x3 -> `{blocker: 1, major: 2, minor: 3}`); the existing lowercase council case passes unchanged.
- `bin/gauntlet-performance.test.mjs`: a fixture record holding `blocker: 1, major: 2` renders the counts in run rows and `--json`; the existing pre-change fixture still renders (existing tests cover this; add none unless they do not).
- `npm test`: bin bundle freshness after `npm run build:bins`, skill/agent lint, stage-skill lint, model-literal lint.
- Skills and personas have no runtime tests; the behavioral claim is not testable on this branch (see Post-release measurement).

## Post-release measurement

Owner: #56 housekeeping row, not this change. After five released runs, count implementer dispatches following `SHIP` reports against the E-2761 baseline (six Minor-only implementer dispatches, four re-reviews).

## Documentation impact

Per `reference/documentation-impact.md`:

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` telemetry paragraph (`blocker/major/minor` counts also take `[Critical]/[Moderate]`); `CHANGELOG.md` Unreleased.
- Derived / memory docs invalidated: none. Dropped candidates: `doc/personas.md` "Where personas land" (rule change, not placement - code-mirror), `README.md` "What a run looks like" (no observable step changes), `README.md` "Severity mapping" (line 416 is the `gatekeep-pr` `REVIEW.md` starter rubric, a consumer-editable PR-gate template, not a description of the SDD loop; no current doc states Minor handling in the loop).

## Out of scope

- Re-reviews that raise new in-delta Moderates (legitimate; a round is owed).
- gh-47 `TRAJECTORY`/`STAGNANT` escalation mechanics.
- A severity grade or non-blocking class for conformance gaps (Q2).
- Renaming telemetry schema keys to `critical/moderate` (Q3).
- A mechanical guard on implementer-after-SHIP dispatch: the next task's implementer legitimately follows a SHIP; polish and progress are indistinguishable from the dispatch alone.
- Backfilling existing telemetry records; telemetry for deferred Minors or post-SHIP dispatches.

## Open questions

- The issue's 81-vs-79 Minor count discrepancy in run `48de28ea` is unexplained and not reconciled here; the alias only makes future counts truthful.
