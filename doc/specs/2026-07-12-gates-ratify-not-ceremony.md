# Gates ratify, not ceremony: auto-apply mechanical changes, one human ratification

## Context

The gauntlet's premise is minimizing human intervention to the moments where a human
decision is actually load-bearing. Two gates currently stop the human for changes that
carry no decision:

1. **Conformance GAPS menu** (`verification-before-completion/reference/conformance-check.md`)
   renders `[1] apply all / [2] per-gap` on *every* GAPS verdict, including one whose gaps
   are all `recommended: fix`. A `fix` only drags the deliverable back to match the
   **already-ratified spec** - it is mechanical, worktree-local, pre-squash, reversible. The
   pause is ceremony. Observed in session `2026-07-12T11-04-29` (v4.4.0 run): 3 gaps
   (G1/G2 `fix`, G3 `accept`); the two fixes needed no human, only G3 did, yet the menu
   blocked on all three.

2. **Spec council path** (`roasting-the-spec` steps 3->5) makes the parent *propose*
   dispositions, gates the user, then applies *after* approval. So `brainstorming`'s single
   review gate shows the user a **pre-disposition** spec plus council clusters as adjacent
   lines, and `brainstorming` checklist item 10 ("re-scan for placeholders **its edits** may
   have introduced") is false on this path - nothing was applied yet. The worker critique
   path already auto-applies in place; the council path is the inconsistent one.

Every other hop in the workflow already refuses ceremony: `brainstorming` -> `writing-plans`
"no further prompt"; SDD Continuous Execution "do not pause between tasks"; SDD -> finishing
"no confirmation prompt"; phase-tracker SHIP_ADVISORY "do not add a 'ready to finish?' prompt".

## Problem

Two gates stop the human to ratify an **intermediate** artifact when the only load-bearing
ratification is of the **final** one. Fix both so automation applies mechanical/drafting
changes and the human ratifies the finished artifact once.

## Governing principle

> A change may be auto-applied iff it does not leave an **already-ratified contract**
> altered without a subsequent human ratification of the result.

- Conformance `fix`: runs **after** the spec was ratified; restores the deliverable to that
  contract. Auto-apply. The re-audit + the finish contract review are the downstream
  ratification of the result.
- Conformance `accept`/`rescope`, and any `UNAUTHORIZED` gap: **rewrite or subtract from**
  the ratified contract (or destroy possibly-wanted code). Defer to the human.
- Council edit: mutates the spec **before** it is ratified; the single `brainstorming` gate
  **is** that ratification. Auto-apply before the gate, ratify the finished spec once ("a
  gate without a gate" - the main-loop model adjudicates inline, the human ratifies the
  result).

The safety valve for both: the human can **revert** any auto-applied change at its review
gate (council edit at the `brainstorming` gate; conformance fix or council edit at the
finishing gate - see "Revert semantics").

## Change 1 - Conformance auto-close (verify phase)

### GAPS handling: partition by verdict then `recommended`, act without a menu

Replace the unconditional `[1]/[2]` menu in `conformance-check.md` "GAPS - disposition menu".
Partition precedence is **verdict first, then `recommended`** (this resolves the
`{G1 fix, G2 UNAUTHORIZED/fix}` overlap the reviewer's raw `recommended` field would create):

1. **Verdict `CONFORMS`** (no gaps) -> record and proceed. **No loop.**
2. **Any `UNAUTHORIZED` gap** -> that gap **always defers** to the finish gate, regardless of
   its `recommended` value (`fix`=remove-unrequested-code or `accept`=keep-and-document both
   need a human; silent code removal is destructive and requirement-*subtracting*).
3. **Remaining gaps** (verdict `PARTIAL`/`MISSING`/`DRIFTED`):
   - `recommended: fix` -> **auto-run** the fix loop below.
   - `recommended: accept`/`rescope` -> **carry OPEN** (deferred to finish; they rewrite the
     ratified contract).

So the fast path is: **all gaps `recommended: fix` AND none `UNAUTHORIZED`** -> auto-run the
loop, no menu, no stop. If any gap is `UNAUTHORIZED`/`accept`/`rescope`, auto-run the `fix`
gaps and **carry the rest OPEN**; verify completes and records them in the completion summary
(schema below). **Re-partition the full open-gap set after every re-audit** - a re-audit may
introduce `Gn+1` or flip a carried gap's `recommended`.

`agents/conformance-reviewer.md` `recommended` policy is made deterministic for the partition:
for an `UNAUTHORIZED` row, `accept` if harmless else `fix` (= remove) - both defer, but the
value must be present and unambiguous.

### Fix loop: SDD Parallel-Wave mirror, per round

The fix loop mirrors `subagent-driven-development` Parallel-Wave Mode and surfaces progress
via `plan_tracker` (the tracker the implement phase uses). Per round:

1. **`plan_tracker` init** with the round's gaps as tasks (wave-prefixed when a `conflicts`
   pair forces serial waves, per the reviewer's `Parallel-safe:` line). Lifecycle
   `pending -> in_progress -> complete` per gap. Widget-UX note: this re-init replaces the
   implement phase's completed task list in the singleton widget - state-safe (the implement
   auto-complete is inert once `implement` is `complete`), and the widget now shows fix-wave
   progress during verify.
2. **Per gap** (task -> `in_progress`): `implementer` (fresh, `worktree: true`, `cwd` =
   conformance worktree, `touched-files` ownership boundary) -> `spec-reviewer` (gap-block
   reference contract below) -> task -> `complete`.
3. **Integrate** serially (`git apply` onto worktree HEAD). Grouping trust: gap
   parallel-safety comes from the reviewer's `Parallel-safe:`/`conflicts` line; on any
   conflict the inherited `dispatching-parallel-agents` "Review and Integrate" fallback
   re-runs the offending task serially.
4. **Test gate** on the integrated tree (project canonical test command).
5. **`code-reviewer` once** on the round's cumulative fix delta (not per gap).
6. **Re-audit**: re-dispatch `conformance-reviewer` (call-site `model:` injection per
   `closureReview.model`, same as the initial audit) over the fixes **+** the regression
   guard (any prior-`DELIVERED` requirement whose `evidence` file the fix diff touched).
7. Converge -> record `CONFORMS`, done. Open gaps within cap -> next round. Cap
   (`closureReview.maxFixRounds`, default 2) reached with open `fix` gaps -> **escalate**.

Each per-gap fix is committed with the message convention **`conformance fix Gn`** so the
finish gate (and any revert) can identify auto-applied fixes durably (survives context
pruning; readable via `git log` pre-squash).

Failure handling (textual/semantic conflict, failed agent, `BLOCKED`/`NEEDS_CONTEXT`) is
inherited verbatim from `dispatching-parallel-agents` "Review and Integrate". The loop
invokes **no** `phase_tracker` calls (never `phase_tracker implement`, which errors during
verify) and does **not** enter SDD Parallel-Wave Mode's phase machinery - it reuses only the
fan-out/integrate/review shape plus `plan_tracker` for visibility.

### `spec-reviewer` gap-block reference contract

The old exclusion in `conformance-check.md` ("`spec-reviewer` is excluded - plan-vs-code is
the wrong reference point") was about the **round-level re-audit**, which must reference the
**origin** - and it still does (step 6 above, unchanged). The **per-gap** `spec-reviewer` is
a distinct **pre-integration mechanical check** with a different reference: the **gap block**.
Reconcile the exclusion text and define the mapping the dispatch passes to `spec-reviewer`:

- **Requirement** = the gap's `origin` + `remediation` (what must be true after the fix).
- **Closure proof** = the patch satisfies that requirement within the gap's `touched-files`,
  nothing missing and nothing extra.
- **Output** = `spec-reviewer`'s normal MATCH/DRIFT verdict, referenced to the gap block
  (not a plan task).

This is a task-framing contract in the dispatch; no new persona.

### Verify completion criterion + carried-open handoff schema

`subagent-driven-development` (After All Tasks Complete) and `verification-before-completion`
change the completion criterion to:

> Verify completes when **every gap is either fixed (`CONFORMS`) or carried-open as a
> deferred `accept`/`rescope`/`UNAUTHORIZED` gap.** The one non-completing terminal state is
> **escalation** (cap reached with an unresolved `fix` gap) - a human is needed *now*.

The completion summary MUST include a durable, parseable **`## Closure / conformance`** block
(the source Step 3.5 consumes even if session context was pruned) listing, per carried-open
gap: `Gn`, verdict, `recommended`, `touched-files`, round-by-round history, and which
auto-applied changes (`conformance fix Gn` commits) are revertable.

### Finish gate: the single human stop for deferred gaps

`finishing-a-development-branch` Step 3.5 is upgraded from "surface + block" to an
**enforced disposition gate**. It reads the `## Closure / conformance` block, renders each
carried-open gap, and offers a per-gap decision:

- **apply now** - `accept-into-spec` / `rescope-into-spec` (main session folds a dated
  decision into the spec, never a subagent), or `fix-now`.
- **custom disposition** - e.g. **capture as a follow-up ticket** (rescoped material is
  often real future work), per the project's issue-tracker convention in
  `.pi/gauntlet-overrides.md`.
- **revert** an auto-applied change (see "Revert semantics").

**`fix-now` loop scope at finish:** commit any `accept`/`rescope`-into-spec edits from this
gate **before** dispatching (a dirty tree rejects `worktree: true`, and the re-audit must
read the amended spec); run the **full** loop (implementer -> integrate -> test ->
`code-reviewer` -> re-audit); re-run Step 1's test verification; re-enter Step 3.5 with the
re-audited verdict before re-presenting ship options.

The human decides; no auto-proceed past unresolved deferred gaps. On the ad-hoc non-worktree
finish paths (`GIT_DIR == GIT_COMMON` / detached HEAD) the menu offers `accept`/`rescope`/
custom and manual fix-in-place only (no `fix-now` dispatch) - unchanged precondition.

## Change 2 - Spec council auto-apply (brainstorming gate)

`roasting-the-spec` keeps ownership of council mechanics (separation-of-powers lives there).
Reorder its steps so the parent applies before returning:

- **Merge steps 3 and 5 to run before the gate.** The parent - the **main-loop model
  running the `roasting-the-spec` skill inline (not a dispatched subagent), which holds full
  `edit`/`write` tools** - derives dispositions (apply / defer / reject) **and applies the
  apply-set to the spec under `doc/specs/`** before returning to `brainstorming`. It also
  **owns external-ref inlining**: any `external-ref:` cluster the parent has context for
  (e.g. a ticket fetched during brainstorming) is inlined as part of the apply-set. It
  returns a structured **audit**.
- **Audit render format** (gate-only, not a committed spec section): three labelled lists -
  `Applied:` (cluster -> concrete edit), `Deferred:` (cluster -> where it belongs),
  `Rejected:` (cluster -> one-line reason).
- **Durable record for finish-time revert:** the audit is written into the **body of the
  `brainstorming` spec commit message** (git-native, non-contractual, readable pre-squash) -
  this is how it stays "not a committed spec section" yet remains available at finish.
- **Role shift, acknowledged:** the parent = advocate now *also executes* its own apply-set
  (advocate + executor). Justification: the applier was always the main-loop model (it
  applied post-approval in the old step 5); moving the apply before the gate does not add a
  new decider - members remain witnesses, chair remains judge, and the **user remains the
  sole jury**, ratifying (or reverting) the finished spec at the one gate.

`brainstorming` changes:

- **Single user gate** shows the verbatim spec-only summary of the **final (post-apply)**
  spec + the council audit as adjacent lines. Both critique paths (worker and council) now
  apply **before** the summary, so checklist item 10 is reduced to a **re-scan** (placeholder
  scan over the applied result) and is true on both paths; external-ref inlining moves into
  the apply-set (roasting) rather than a separate item-10 step.
- **Revert valve** at the gate: "revert applied council edit X" -> normal change-request loop
  (revise the spec, re-dispatch the summarizer with a **fresh** temp path, re-present).
- The council still runs unconditionally when `gauntlet_setting({ key: "specCouncil" })`
  returns verdict `council`; the worker path is unchanged (it already auto-applies).

## Revert semantics

- **Council edit reverted at the `brainstorming` gate** - cheap: the spec is not yet plan-
  or code-bearing; revise and re-present.
- **Conformance fix reverted at finish** - light: revert the `conformance fix Gn` commit(s),
  re-audit; the gap re-opens for a fresh disposition.
- **Council edit reverted at finish** - heavy: it rewrites the **already-ratified contract**
  that drove the plan and code. This is a contract re-open, not a menu toggle: amend spec ->
  re-approve (summary/gate as needed) -> regenerate affected plan/code -> re-run verify
  before ship. The finish gate names this cost explicitly rather than presenting it as a
  lightweight action. The council audit in the spec commit body is what lets the human see
  which edits are candidates.

## Authoring constraints (all edited files)

These edits change **LLM-facing instructions**. The reworked prose must be followable by a
small model on one read. Every edit in this spec is bound by:

- **Single source of truth, referenced not restated.** The partition rule, the fix-loop
  shape, and the `## Closure / conformance` schema are defined **once** in
  `conformance-check.md`. `subagent-driven-development` and `finishing-a-development-branch`
  **link** to them ("see conformance-check.md") - they do not paraphrase or re-list the steps.
  Duplicated logic across files is a defect.
- **Replace, don't layer.** Delete superseded text (the old `[1]/[2]` GAPS menu, the old
  `spec-reviewer` exclusion sentence, the old SHIP_ADVISORY wording) in the same edit that
  introduces the replacement. No "old rule ... new rule" scars, no commented-out prose.
- **Deterministic branches.** Every decision point is an ordered, exhaustive rule a small
  model can execute without judgment: the GAPS partition is a numbered precedence list
  (verdict first, then `recommended`), not a paragraph. Prefer a short ordered list or a
  compact table over discursive "you might also consider" prose.
- **Imperative and concrete.** "Do X", "if A then B else C". No `consider`, `probably`,
  `as appropriate`. Name the tool, the field, the file.
- **No new instruction without a trigger.** Add a sentence only if an implementer would act
  wrongly without it. Do not restate existing skill conventions the file already inherits.
- **Net-tighten where possible.** These are gate simplifications; the reworked sections
  should not grow materially. A section that gets longer must justify it with new
  branch-coverage, not repetition.

The conformance gate verifies these constraints as origin requirements (clarity/non-
duplication are acceptance criteria, not style nits).

## Per-file edit map

| File | Edit |
|---|---|
| `skills/verification-before-completion/reference/conformance-check.md` | Replace GAPS menu with verdict-then-`recommended` partition (UNAUTHORIZED always defers; CONFORMS no loop; re-partition each round); restructure fix loop to the SDD Parallel-Wave mirror (per-gap `spec-reviewer` gap-block contract, `plan_tracker` progress, `conformance fix Gn` commit convention, keep no-`phase_tracker` rule); reconcile the L182-183 `spec-reviewer` exclusion; `maxFixRounds: 0` -> carry `fix` gaps to finish; add the `## Closure / conformance` handoff schema; deferred gaps -> finish gate. |
| `skills/verification-before-completion/SKILL.md` | Verify completion criterion: fixed-or-carried-open, escalation as the sole non-completing terminal state. |
| `skills/subagent-driven-development/SKILL.md` | After All Tasks Complete: conformance auto-close (no menu on all-`fix`), verify completion criterion, `plan_tracker` allowed for the fix wave, emit the `## Closure / conformance` block. |
| `skills/finishing-a-development-branch/SKILL.md` | Step 3.5 -> enforced disposition gate (apply-now / custom-ticket / revert); `fix-now` loop scope; consume the `## Closure / conformance` block; revert semantics. |
| `skills/roasting-the-spec/SKILL.md` | Reorder steps 3->5: parent applies apply-set (incl. external-ref inlining) before returning; audit render format; write audit to spec commit body; adjust separation-of-powers prose + red flags. |
| `skills/brainstorming/SKILL.md` | Checklist 9-12 + "Spec Council" + "User Review Gate": council path applies before summary; item 10 -> re-scan; gate renders final spec + audit; revert valve; commit-body audit. |
| `agents/conformance-reviewer.md` | Make `recommended` deterministic for `UNAUTHORIZED` (`accept` if harmless else `fix`); ensure gap block exposes `origin`/`remediation`/`touched-files` for the `spec-reviewer` contract (already present - confirm). |
| `extensions/phase-tracker.ts` | Reword `SHIP_ADVISORY` (see below). **Description string only - no logic change.** |
| `extensions/plan-tracker.ts` | Amend the tool `description` to permit conformance-remediation waves during verify while still banning brainstorming/planning checklists. **Description string only - no logic change.** |
| `README.md` | Amend the conformance-gate description (see Documentation impact). |

**Extension changes are two model-facing description strings only; no runtime logic changes.**
`plan_tracker` logic is already phase-agnostic and `phase-tracker.ts` `applyPlanActivity`
auto-completes `implement` only while it is `in_progress`, so verify-phase `plan_tracker` is
state-safe. No snapshot tests reference either string (verified: no matches in `test/`,
`tests/`, `scripts/`). The phase-tracker closure guard is unchanged (it only asserts a
`conformance-reviewer` dispatch happened).

### SHIP_ADVISORY reword (phase-tracker.ts L73-79)

Current:

> Verify is complete and ship is pending. If the conformance verdict is resolved (CONFORMS,
> or every gap dispositioned and approved), invoke /skill:finishing-a-development-branch now -
> do not add a 'ready to finish?' prompt; its squash/PR/keep/discard menu is the human gate.
> If a requirement decision is still open, you should not have completed verify - reopen it
> and surface the open decision instead.

Proposed:

> Verify is complete and ship is pending. Verify may complete when the conformance verdict is
> CONFORMS, or every gap is either fixed or carried open as a deferred accept/rescope/
> unauthorized decision. Invoke /skill:finishing-a-development-branch now - do not add a
> 'ready to finish?' prompt; its disposition + squash/PR/keep/discard menu is the human gate
> that resolves any carried-open decision. Only reopen verify if a `fix` gap was left
> unresolved (neither fixed nor deferred).

## Error handling and edge cases

- **Council all-members-fail** -> abort council, nothing applied, gate shows the spec as-is
  (existing roasting behavior). **Council all-reject** -> nothing applied; audit lists
  rejections with reasons.
- **Conformance first audit `CONFORMS`** -> zero stops, no loop. **All-`fix`, none
  `UNAUTHORIZED`** -> auto-loop; cap non-convergence -> escalate.
- **`maxFixRounds: 0`** -> no auto-fix dispatch; `fix` gaps become carried-open to the finish
  gate. Rationale for the asymmetry with cap>0 escalation: `maxFixRounds: 0` means the user
  opted out of auto-fix, so unresolved `fix` gaps are treated like any deferred gap (finish
  handles them); a cap>0 that is *exhausted* means the loop tried and could not converge -
  suspected fault warranting a human *now* (escalate mid-verify).
- **Deferred gap whose resolution implies code** -> `fix-now` at finish (worktree HEAD
  present). Accepted limitation: the auto-fix loop does not attempt fixes that depend on how a
  deferred gap is dispositioned.

## Testing approach

Extension changes are description strings only -> no new logic surface. Verification:

- `npm test` (`scripts/ci.mjs`) green: frontmatter on all skills/agents, `version ==
  CHANGELOG top`, AGENTS core-sync, rename-token scan over skills/extensions/agents,
  extension type-check (both edited extensions still `--check` clean), no `pi.settings` reads,
  `npm pack` sanity.
- Generic-skills grep zero matches - the "capture as follow-up ticket" disposition stays
  generic; project tracker deferred to `.pi/gauntlet-overrides.md`.
- Internal-consistency review of cross-references: `brainstorming` <-> `roasting-the-spec`
  (apply-before-gate, commit-body audit), `conformance-check.md` <-> SDD verify criterion <->
  `finishing` Step 3.5 (the `## Closure / conformance` block is produced and consumed with
  matching field names), SHIP_ADVISORY <-> completion criterion, README <-> new behavior.
- No pre-merge runtime test of the new gate flow (gate protocols are prose; the two extension
  strings are guidance, not asserted). Do not bump version mid-implementation (CHANGELOG
  heading is release-time).

## Documentation impact

See `../../../skills/brainstorming/reference/documentation-impact.md` for the materiality bar
and the three doc classes. Skill/reference/agent bodies and extension description strings
edited here are implementation surface, not entries below.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md`, two spots:
  - Step 4 (line ~40), currently: *"the **conformance gate** - a subagent reads the finished
    code and docs against your *original words* from step 1, not the plan, and reports
    per-requirement: delivered, partial, missing, drifted, or unauthorized. This gate is
    machine-blocked from being skipped."* -> add that requirement-restoring (`fix`) gaps are
    auto-closed by an isolated fix+re-audit loop, and origin-altering dispositions
    (accept/rescope/unauthorized) are deferred to the finishing gate.
  - Glossary "Conformance gate" (line ~77), currently: *"The closing check: does the
    delivered code + docs match your *original prompt*, not the derived plan? Per-requirement
    verdict, **no auto-fix**."* -> replace "no auto-fix" with "auto-fixes requirement-
    restoring gaps; origin-altering decisions deferred to the finishing gate". (Step 5 /
    "Human gate 2" framing stays accurate - finishing remains the human gate and now also
    resolves deferred conformance decisions.)
  - `doc/personas.md` and `doc/configuration.md` stay accurate (the reviewer still only
    proposes; `maxFixRounds` mechanics unchanged) - not listed.
- Derived / memory docs invalidated: none (repo `AGENTS.md` has no gate-flow prose to stale);
  `CHANGELOG.md` - deferred: release

## Out of scope

- No new `piGauntlet.*` settings key; `maxFixRounds` / `closureReview` / `specCouncil` schemas
  unchanged.
- No change to the phase-tracker **closure guard** logic or the "no ready-to-finish prompt"
  SHIP_ADVISORY stance (only its verify-complete wording changes).
- No change to the worker's auto-apply *mechanism* (it already applies in place). Its
  external-ref *handling* now mirrors the council's - inline what it has context for, flag
  the rest - a direct consequence of checklist item 10 no longer inlining (see the
  decisions log). Not a new gate, not a scope expansion.
- No automatic re-roast loop for the council (single pass, unchanged).
- No new reviewer persona (the per-gap `spec-reviewer` uses a gap-block task contract).

## Decisions / deviations log

- 2026-07-12 Q1 accept/rescope sign-off timing -> **B (defer to finish)**: verify may
  complete with `accept`/`rescope`/`UNAUTHORIZED` gaps carried open; the finish gate is the
  single human stop. The finish contract review can also revert any auto-applied change, so
  one final review covers it.
- 2026-07-12 `UNAUTHORIZED` -> **always defer** (regardless of `recommended`): never
  auto-delete unrequested code; the human chooses remove vs keep-and-document at finish.
- 2026-07-12 Conformance fix review shape -> **A (full SDD Parallel-Wave mirror)**: per-gap
  `implementer` + `spec-reviewer` (gap-block contract), `plan_tracker` progress, per-round
  `code-reviewer` + re-audit.
- 2026-07-12 Council apply ownership -> **roasting-the-spec keeps it**; parent applies the
  apply-set before returning, audit is gate-only (recorded in the spec commit body for
  finish-time visibility). Rejected: inlining apply into brainstorming (duplicates council
  mechanics, splits ownership).
- 2026-07-12 Worker external-ref handling (code-review reconciliation): since item 10 no
  longer inlines external refs on either path, the worker now inlines refs already in its
  problem-statement context and flags the rest - symmetric with the council parent. The
  worker's auto-apply mechanism is unchanged; only its ref handling moved. The original
  Out-of-Scope line "No change to the worker critique path" was internally inconsistent with
  Change 2 and is corrected above.
- 2026-07-12 Council dispositions (this spec's own council): applied SHIP_ADVISORY reword,
  plan_tracker description amend, UNAUTHORIZED precedence, durable handoff schema + commit
  conventions, fix-now loop scope, spec-reviewer gap-block contract, audit format,
  maxFixRounds asymmetry rationale, README inline, re-partition rule. Rejected: inlining the
  full `documentation-impact.md` materiality bar (canonical in-repo doc cited by relative
  path per existing convention; classification already resolved in the section).
