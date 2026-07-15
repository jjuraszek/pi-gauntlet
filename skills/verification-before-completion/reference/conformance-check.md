# Deliverable Conformance Check

Tests passing proves the code runs. It does **not** prove the code does what was
asked. This check confronts deliverables (code **and** docs) against the
requirements. Docs named in a spec's "Documentation impact" section - any of
the three classes (introduced, materially amended, derived/memory invalidated) -
are origin requirements the same as code: a missing or drifted doc from that
section is a conformance gap, not a code-review nit. See
`../../brainstorming/reference/documentation-impact.md` for what that section
contains and how its entries are scoped.

## Why this is distinct from code review

Work flows `prompt/spec → plan → code/doc`. Each hop is lossy: the plan can
drop or reinterpret a requirement, and code can drift from the plan. Reviewing
**plan vs code** (what `/skill:requesting-code-review` does) is *single-step*
verification — it confirms the last hop, but inherits any drift the plan already
introduced.

This check is the **closing loop**: confront the final outcome (code + doc)
against the *origin* (spec + original prompt), skipping the plan. It catches
requirements lost anywhere in the chain, not just in the last step. Run it even
when plan-vs-code review passed clean — they measure different things against
different reference points.

## Dispatch a fresh reviewer (primary path)

The main session built the thing — it has confirmation bias. Delegate the check
to a fresh-context **`conformance-reviewer`** — a persona built for exactly this
gate: its priorities are requirement coverage and intent fidelity, not code
quality, and it emits a per-requirement coverage verdict rather than a bug list.
It reads the requirements vs the diff cold and cannot see session history, so
pass in:

- The **spec** (path).
- The **original prompt** (verbatim — it holds inline requirements + any ticket ref).
- The **diff** to audit (code + docs).

Dispatch it as its **own** call — do not fold the conformance check into the
whole-PR code-quality review. Fusing the two subordinates intent-coverage to a
code-quality system prompt and compresses the conformance result to an
afterthought. Code quality is one dispatch; conformance is another.

The persona ships model-free. Get the model from `gauntlet_setting({ key: "closureReview" }).model`.
If `gauntlet_setting` is unavailable, stop and report - never fall back to a manual bash/JSON
settings merge. Inject the model **call-site** on the dispatch (omit `model:` when it is `undefined` to inherit
the parent's model) — the same mechanism the spec-council chair uses. If the configured model
is unreachable, retry once with the inherited model. Point it at the strongest reasoning model
the resolved config can reach — this is the last correctness gate. `thinking` stays
frontmatter-pinned at `xhigh` and is not call-site overridable, so the config supplies only
`model`.

Self-checking in the main session is the fallback when delegation isn't possible.

## Source of truth (priority order)

| Order | Source | Why |
|---|---|---|
| 1 | The written spec (`doc/specs/…`) | Canonical. Brainstorm already fetched the ticket, reconciled its ACs, recorded deviations here. |
| 2 | Original prompt | Catches inline requirements never folded into the spec. |
| 3 | Re-fetch the ticket | **Fallback only**, when no spec exists. Skip when a spec exists — the live ticket may have drifted. |

Project's issue-tracker skill (for the fallback) is named in `.pi/gauntlet-overrides.md`.

## Drift = red flag

Spec vs prompt/ticket disagree → **STOP and reconcile**, do not absorb silently.

- Intentional, recorded deviation → spec wins (it was review-gated).
- Unrecorded divergence → spec silently dropped/altered a requirement = conformance
  failure. Fix spec or code, re-verify. No completion claim over unreconciled drift.

## Coverage rule

Default: **1 requirement source = 1 spec = code covering every requirement.**
The requirement source is whatever sits at the top of the priority table — a
ticket if there is one, otherwise the spec + original prompt. No ticket is fine;
spec + prompt is a first-class source, not a degraded one. "Every requirement" =
explicit acceptance criteria / spec clauses **+** implicit notes (ticket body,
comments, or inline in the prompt). Source and solution must end in sync.

Multi-spec effort → allowed **only if the spec explicitly says** it covers a
defined subset and names the deferred requirements. Silent partial coverage = failure.

## When the check finds gaps

The reviewer **proposes, it does not dispose.** It emits structured gap blocks
(see `agents/conformance-reviewer.md`); the orchestrator (the main session running
the verify gate) drives disposition, fixes, and re-audit. The reviewer never edits,
dispatches, or re-audits itself.

### Disposition — verdict-then-`recommended` partition, no menu

Render the enumerated gap list — each as `Gn [VERDICT] origin — remediation
(recommended: fix|accept|rescope)` — then partition and act, in this exact order.
No prompt, no menu: this partition is deterministic and exhaustive.

1. **Verdict `CONFORMS`** (no gaps) → record the verdict in the completion
   summary's closure section and proceed. No loop.
2. **Any gap is `UNAUTHORIZED`** → that gap **always** defers to the finish gate,
   regardless of its `recommended` value. Never auto-remove or auto-accept
   unrequested code here.
3. **Every remaining `PARTIAL`/`MISSING`/`DRIFTED` gap**:
   - `recommended: fix` → auto-run the fix loop below — **unless a declared
     fix-loop precondition is unavailable** (`maxFixRounds: 0`, or no eligible
     named-branch worktree), in which case carry the gap **OPEN** (see the fix
     loop's precondition and `maxFixRounds: 0` notes).
   - `recommended: accept` or `recommended: rescope` → carry the gap **OPEN**,
     deferred to the finish gate. Do not apply a spec edit here — the finish
     gate owns disposition of deferred gaps.

So the fast path (all gaps `recommended: fix`, none `UNAUTHORIZED`, cap > 0,
eligible named-branch worktree) therefore auto-runs the fix loop with no menu,
stop, or confirmation; any other mix carries the
`accept`/`rescope`/`UNAUTHORIZED` gaps OPEN while the `fix` gaps run. Record every gap's outcome (`CONFORMS`-closed or carried OPEN) in the
`## Closure / conformance` block (schema below).

**Re-partition after every re-audit.** A re-audit can introduce `Gn+1` or flip a
carried gap's `recommended`. Re-run steps 1-3 above over the **full current
open-gap set** each time the reviewer returns a report — never reuse a stale
partition from an earlier round.

### Fix loop — SDD Parallel-Wave mirror, per round

Mirrors `subagent-driven-development` Parallel-Wave Mode and reuses its
`plan_tracker` progress surface. Runs entirely inside the gate — it invokes
**no** `phase_tracker` calls (`phase_tracker({ phase: "implement" })` errors
while verify is `in_progress`) and does **not** enter SDD's phase machinery.
Only the fan-out/integrate/review shape and `plan_tracker` are reused.

**Precondition — worktree required.** The loop needs a worktree HEAD to branch
fixes from. On the ad-hoc `finishing-a-development-branch` paths that run in a
normal repo (`GIT_DIR == GIT_COMMON`) or detached HEAD, there is no such HEAD:
skip this loop, carry every `fix` gap OPEN, and resolve it at finish via the
canonical Disposition catalog and availability table below. `fix-now` is
unavailable there; any other disposition is offered only when its table
prerequisites hold.

Per round:

1. **`plan_tracker` init** with the round's gaps as tasks. Wave-prefix tasks
   when the reviewer's `Parallel-safe:` line marks a `conflicts` pair (file OR
   `touched-resources` overlap) — that pair runs in separate serial waves;
   `disjoint` gaps share one wave. Lifecycle per gap: `pending` →
   `in_progress` → `complete`. This re-init **replaces** the implement phase's
   completed task list in the singleton widget — state-safe, since
   `phase-tracker.ts` `applyPlanActivity` only auto-completes `implement`
   while it is `in_progress`; the widget now shows fix-wave progress during
   verify.
2. **Per gap** (task → `in_progress`): dispatch `implementer` (fresh context,
   `worktree: true`, `cwd` = the conformance worktree, `touched-files` from the
   gap block as an explicit ownership boundary) → dispatch `spec-reviewer` on
   the gap-block reference contract below → task → `complete`.
3. **Integrate** serially via `git apply` onto the worktree HEAD, one gap's
   patch at a time. Failure handling is inherited verbatim from
   `dispatching-parallel-agents` "Review and Integrate": textual conflict →
   re-run one agent sequentially with the other's integrated changes as
   context; semantic conflict (applies clean, suite fails) → re-run the
   offending task sequentially on integrated HEAD; a failed agent → integrate
   the successes, then retry the failure with fresh context including the
   integrated changes. A `BLOCKED`/`NEEDS_CONTEXT` return surfaces to the user.
4. **Test gate** on the integrated tree, using the project's canonical test
   command. A failure re-enters the failure-handling rules above.
5. **`code-reviewer` once** on the round's cumulative fix delta (not per gap).
6. **Re-audit**: re-dispatch `conformance-reviewer` over the fixes **plus** the
   regression guard (any prior-`DELIVERED` requirement whose `evidence` file
   the fix diff touched). Pass the full prior conformance report (every row,
   including DELIVERED rows and their `evidence` `file:line`) and the round's
   fix diff. Inject `model:` call-site per `gauntlet_setting({ key:
   "closureReview" }).model` — same mechanism as the initial audit; omit
   `model:` when it is `undefined` to inherit the parent's model. The
   phase-tracker closure guard blocks a dispatch that omits `model:` when
   `closureReview.model` is set, and warns (non-blocking) on one whose model
   differs.
7. **Converge or continue**: verdict `CONFORMS` → record it, done. Open gaps
   within the cap → re-partition (per the rule above) and start the next
   round. Cap (`gauntlet_setting({ key: "closureReview" }).maxFixRounds`,
   default `2`, floors negatives at `0`, coerces non-integers to `2`) reached
   with an open `fix` gap → **escalate to the human** with the per-gap
   round-by-round verdict trail. Escalation is the sole non-completing
   terminal state — no silent re-loop, no auto-ship.

Commit each per-gap fix with the message **`conformance fix Gn`** (durable,
`git log`-readable pre-squash) so the finish gate and any revert can identify
auto-applied fixes.

**`maxFixRounds: 0`**: skip this loop entirely. Every `recommended: fix` gap
becomes carried OPEN to the finish gate instead of auto-running — the user
opted out of auto-fix, so treat `fix` gaps like any other deferred gap. This
differs from a cap > 0 that is *exhausted*: that case escalates mid-verify
because the loop tried and could not converge.

### `spec-reviewer` gap-block reference contract

Per-gap `spec-reviewer` in step 2 above is a **pre-integration mechanical
check**, distinct from the round-level re-audit in step 6 (which still
references the *origin* — spec + original prompt — unchanged). Frame the
per-gap dispatch against the **gap block**, not a plan task:

- **Requirement** = the gap's `origin` + `remediation` (what must be true
  after the fix).
- **Closure proof** = the patch satisfies that requirement within the gap's
  `touched-files` — nothing missing, nothing extra.
- **Output** = `spec-reviewer`'s normal MATCH/DRIFT verdict, referenced to the
  gap block instead of a plan task.

This is a task-framing contract in the dispatch, not a new persona.

## Concern decomposition

The main verification orchestrator — **not** `conformance-reviewer` — decomposes
each carried-open gap into concerns when it writes the completion summary. A
**gap** is the reviewer's overall finding; a **concern** (`Gn/Cn`) is one
consequence within it that could reasonably receive a *different* disposition.
Observations that necessarily move together stay one concern.

The orchestrator reasons from:

- The final reviewer coverage row and structured gap block.
- The origin spec and original prompt already supplied to verification.
- Session-observed blockers, prerequisite checks, and fix-loop outcomes.
- The round history and current touched-file/resource ownership.

Per gap, apply these rules **in order**:

1. Extract atomic unmet clauses and remediation actions from `origin`,
   `evidence`, and `remediation`. Add a session-observed blocker **only** when a
   tool result or fix-loop outcome established it.
2. **Split** two points when either could be fixed, accepted, rescoped, or
   followed up without imposing the same disposition on the other.
3. **Keep together** when one action is meaningful only with the other, or no
   different disposition could be executed independently.
4. Map **every** unmet clause, remediation action, and established blocker to at
   least one concern. Do **not** add a requirement absent from the origin or
   prompt — invent nothing.
5. Order concerns by first appearance in the origin/remediation and assign
   `C1`, `C2`, and so on (source order).

A valid decomposition has no omitted source point, no invented requirement or
evidence, and a concern-scoped remediation plus ownership estimate for every
`fix-now` candidate. Shared evidence may appear in multiple concerns. When the
source cannot support a safe split, the fallback is **one indivisible `Gn/C1`**
concern carrying the complete gap and the known blocker; decomposition never
blocks on obtaining richer prose from the unchanged reviewer.

Field derivation is explicit: `title` and `unresolved` summarize the unmet
clause; `origin` narrows the gap `origin` to this concern's specific clause
without inventing a new requirement; `remediation` states the concern-scoped
remediation action drawn from the gap `remediation`; `impact` states the
consequence already implied by the origin requirement; `evidence` copies
reviewer evidence plus verified session observations;
`touched-files`/`touched-resources` narrow the gap ownership where supported,
otherwise `unknown`/`none`. For an `UNAUTHORIZED` concern there is no origin
requirement to narrow: keep `origin: none (scope creep)` verbatim — never invent
an origin clause; derive `unresolved` from the reviewer's `evidence`/`remediation`
as a plain description of the unrequested behavior; and derive `impact` from the
consequence of retaining, removing, or ratifying that behavior, not from an origin
requirement. These per-concern fields persist the exact contract
the concern-scoped fix projection consumes after pruning. **`evidence: absent`
is an unmet-delivery fact, not
an external blocker** — never relabel missing implementation evidence as a
blocker. A malformed structured reviewer gap block — missing its stable `Gn`
label or any required field (`verdict`, `origin`, `evidence`, `remediation`,
`touched-files`, `touched-resources`, `recommended`) — triggers a **fresh
audit**; a complete structured reviewer gap block does not — the orchestrator
decomposes it or emits the indivisible fallback.

## Disposition catalog and availability

Each concern lists **every** supported disposition, its concrete effect, and
current availability. This table is the single availability contract, referenced
by both this verify gate and `finishing-a-development-branch`:

|Disposition|Ordinary gap effect|`UNAUTHORIZED` effect|Available when|
|---|---|---|---|
|`fix-now`|Complete missing implementation or validation.|Remove the unrequested code or behavior.|Named-branch worktree; `maxFixRounds > 0`; concern ownership is known; every required local/external resource is accessible.|
|`accept-into-spec`|Ratify intentional implemented behavior when the written contract is stale.|Ratify the unrequested behavior as approved scope.|A writable spec exists and there is concrete behavior to ratify.|
|`rescope-into-spec`|Explicitly remove or defer the origin requirement from this workflow.|Unavailable: scope creep has no origin requirement to defer.|The verdict is not `UNAUTHORIZED` and a writable spec exists.|
|`follow-up`|Keep the concern valid but transfer it to separately owned work.|Transfer a separately valid decision or removal task.|The concern can stand alone and the project defines an executable issue-tracker convention. Without one, mark unavailable and direct the user to `custom` to name another durable owner.|
|`custom`|Execute another user-defined disposition after its effect is clarified.|Same.|Always visible; executable only after the user supplies a concrete effect. It is never an automatic recommendation.|

A failed condition leaves the disposition visible and names the exact missing
prerequisite. `touched-files: unknown` makes `fix-now` unavailable until
ownership is established. A normal checkout (`GIT_DIR == GIT_COMMON`) or detached
HEAD cannot dispatch the isolated fix loop at all - it has no named-branch
worktree to branch fixes from - so `fix-now` stays unavailable there regardless
of ownership; resolve those concerns manually at finish. `maxFixRounds: 0`
(audit-only) likewise leaves `fix-now` visible but unavailable — the user
configured no auto-fix loop, and finish-time selection never bypasses or resets
that cap; a concrete `custom`/manual-fix disposition remains possible. `UNAUTHORIZED` cards
replace the primary question with
`Should this unrequested behavior become part of the current workflow?`, so
removal and ratification are not presented as missing-feature choices.

Reviewer tokens map to executable concern recommendations:

- `fix` maps to `fix-now`; for `UNAUTHORIZED`, that means removal.
- `accept` maps to `accept-into-spec`; for `UNAUTHORIZED`, that means ratification.
- `rescope` maps to `rescope-into-spec` and is invalid for `UNAUTHORIZED`.
- `follow-up` may replace an unavailable `fix-now`/`rescope-into-spec` **only**
  when the concern remains valid, has separate ownership, and the issue-tracker
  action is executable.

The orchestrator may choose another named disposition only when current evidence
supports its stated effect. If no named executable disposition is available, the
concern serializes `recommended: none` - the durable state for "no named
executable choice exists" - and its `rationale` must name the exact missing
prerequisites plus the concrete custom effect still required. `custom` is never
auto-recommended, so `none` never silently resolves to `custom`.

A concern with `recommended: none` is excluded from the recommended set. Before
any exhaustive `Apply recommended set`, the finish gate asks for a targeted
custom approval that supplies a concrete effect for that one concern (finishing
owns the exact reply syntax - a per-item `custom(...)` decision - not an `apply
recommended` variant). That reply approves only that concrete custom effect for
that concern. Validate and normalize it immediately: if the effect is ambiguous or
unexecutable, clarify and keep the concern open; if executable, record it as a
**pending approved custom decision** and remove that concern from the still-open
inventory used to build the recommended set. If other open concerns remain,
render the exhaustive recommended set for them and visibly carry the pending
approved custom decision through the existing action-order and freshness
barriers; `apply recommended` approves only the remaining recommendations. If no
other concerns remain, execute the approved custom directly through the existing
mechanics. The final disposition record keeps this concern as a `custom` result;
never relabel it as a model recommendation.

**Never recommend an unavailable disposition or an unexecutable `custom`
placeholder.**

`revert` is a separate action, not a generic concern disposition. The commit
index stays gap-granular (`conformance fix Gn`). A listed gap-level commit makes
revert visible on every concern card under that gap, with an explicit warning
that the **entire gap commit** is reverted. Existing light-revert semantics
remain: revert the indexed commit, re-audit, and return to the decision gate
only if a concern remains open.

## Closure / conformance

Emit this block in the verify completion summary. It is the durable handoff
`finishing-a-development-branch` Step 3.5 consumes — parseable even if session
context was pruned. Verify completes when every gap is either fixed
(`CONFORMS`) or carried OPEN as a deferred gap - `accept`/`rescope`/`UNAUTHORIZED`,
or a `recommended: fix` gap carried open because a declared fix-loop precondition
was unavailable so the loop never started (`maxFixRounds: 0`, or no eligible
named-branch worktree - normal checkout / detached HEAD). Escalation - a started
positive-cap loop that exhausted its rounds or blocked/failed with an open `fix`
gap - is the one non-completing terminal state; the precondition-unavailable
carried-open `fix` state is valid closure inventory, not escalation.

### Handoff sentinel and freshness anchor - every handoff

Every `## Closure / conformance` block - a `CONFORMS` no-card handoff and a
carried-open GAPS handoff alike - **opens with a two-line sentinel** that lets
the finish gate re-verify freshness after context pruning, with no session
history:

```text
status: CONFORMS (0 open)      # or: status: GAPS (N open)
audited-base: <full HEAD SHA at audit time>
```

`N` = count of open concerns (decision units), matching the number of emitted
concern cards. Record `audited-base` as the full 40-char HEAD SHA at audit time;
never abbreviate. This block is the **single source** for the freshness rule;
`finishing-a-development-branch` links here rather than restating it.

**Freshness rule.** The audit-input rule requires deliverables committed before
auditing, so `audited-base` captures the audited state; freshness compares that
commit to the **current working tree**, not to HEAD (a commit-to-commit diff
misses staged/unstaged edits when HEAD has not moved). Run two cheap commands:

```bash
ROOT=$(git rev-parse --show-toplevel)
git -C "$ROOT" diff --stat <audited-base> -- .          # tracked changes since the audited commit (staged + unstaged)
git -C "$ROOT" status --porcelain --untracked-files=all # new/untracked deliverables
```

Any output from either command, any doubt, a missing/mismatched sentinel, or any
closure block not opening with the two-line sentinel above (e.g. a legacy
`Gn: PARTIAL - recommended: ...` row) triggers a fresh audit - never infer
`CONFORMS` from the absence of cards. This is a lightweight freshness check (two
git commands, no hashing or identity fields).

**Sentinel validation.** `status: CONFORMS` requires `N = 0` and **no** emitted
concern cards; `status: GAPS` requires `N > 0` exactly matching the emitted card
count (`Gn/Cn` blocks), not merely gap headers. A mismatch is stale -> re-audit.

**Audit-time input rule.** Stage or commit untracked deliverables before
auditing, since `git diff <base> -- .` omits untracked files from the reviewer
payload.

For each carried-open gap, emit a durable gap header plus one card per concern
(decomposition and derivation rules above). In rendered cards, recommendation
lists, clarification lists, and final disposition records, every user-facing
identifier carries both its ID **and** title; bare `Gn`/`Cn` or grouped
identifier lists without titles are prohibited. The only exceptions are the
machine/interaction tokens the grammar requires: bare `Gn/Cn` inside typed
response tokens, the literal `conformance fix Gn` commit/action identifiers, and
the flat `auto-applied fix commits` index below. The surrounding prompt or list
must map each token to its titled concern or gap before asking for input.

```text
G1 - Source-image validation is incomplete
  verdict: PARTIAL
  origin: <requirement source and clause>
  evidence: <current file:line or observed state>
  blocker: <specific blocker, or none>
  touched-files: <paths or unknown>
  touched-resources: <resources or none>
  round history: R1 <verdict/action>, R2 <verdict/action>, ...

  G1/C1 - End-to-end OCR output has not been validated
    unresolved: <plain statement of the concern>
    impact: <why it matters to the current workflow>
    origin: <requirement source and clause, narrowed from the gap origin; or none (scope creep) for UNAUTHORIZED>
    remediation: <concern-scoped remediation action>
    evidence: <concern-specific evidence or blocker>
    touched-files: <concern-scoped paths, narrowed from the gap; or unknown>
    touched-resources: <concern-scoped resources, narrowed from the gap; or none>
    available dispositions:
      fix-now: <effect and availability>
      accept-into-spec: <effect and availability>
      rescope-into-spec: <effect and availability>
      follow-up: <effect and availability>
      custom: <effect and availability>
    recommended: <available named disposition, or none>
    rationale: <why this is the best current choice; for none, the missing prerequisites and the concrete custom effect required>
```

All concerns in a gap must be represented.

Then a single flat revert index of **every** `conformance fix Gn` commit the fix
loop produced this run — including gaps that later converged to `CONFORMS`
(a closed gap has no card above, so its commit lives only here) — since the
finish gate's revert option needs them all:

```
auto-applied fix commits: <Gn: SHA>, <Gm: SHA>, ... (revertable)
```

## Concern-scoped fix projection

When the finish gate selects `fix-now` on some concerns of a gap, the fix loop
above runs against a **projected** contract, not the original whole-gap block.
For each parent gap with selected `fix-now` concerns, project only those
concerns into one gap-scoped fix contract:

- The parent gap ID.
- The selected concern IDs and titles.
- Their origin clauses, concern remediations, and evidence.
- The **union** of the selected concerns' touched files/resources (ownership
  boundary).

Rescoped, accepted, and followed-up sibling concerns are **excluded** from the
projection. The `implementer` and the pre-integration `spec-reviewer` receive
this projected contract in place of the original whole-gap block.

The projected task runs the existing full loop above: it retains the gap-level
`conformance fix Gn` commit name, reruns the project's tests, runs
`code-reviewer`, re-audits against the amended spec, and reenters the gate only
if concerns remain. Gap-level revert stays available through the flat commit
index. The gate records the final result by concern ID and title before showing
branch integration options.

## Checklist

- [ ] Located canonical requirements (spec → prompt → ticket fallback)
- [ ] Enumerated every requirement: explicit ACs / spec clauses + implicit notes + inline prompt reqs
- [ ] Checked spec ↔ prompt/ticket drift; reconciled any divergence
- [ ] Each requirement mapped to where it's satisfied (code/doc) + evidence
- [ ] Multi-spec? Subset declared in spec; deferred ACs noted as out of scope
- [ ] Gaps reported, or all rows satisfied

Can't check all boxes (or unreconciled drift)? Not complete. Report the gap.
