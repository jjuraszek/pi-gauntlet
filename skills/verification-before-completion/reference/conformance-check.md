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
   - `recommended: fix` → auto-run the fix loop below — **unless `maxFixRounds:
     0`**, in which case carry the gap **OPEN** (see the fix loop's
     `maxFixRounds: 0` note).
   - `recommended: accept` or `recommended: rescope` → carry the gap **OPEN**,
     deferred to the finish gate. Do not apply a spec edit here — the finish
     gate owns disposition of deferred gaps.

So the fast path (all gaps `recommended: fix`, none `UNAUTHORIZED`, cap > 0)
therefore auto-runs the fix loop with no menu, stop, or confirmation; any other
mix carries the `accept`/`rescope`/`UNAUTHORIZED` gaps OPEN while the `fix` gaps
run. Record every gap's outcome (`CONFORMS`-closed or carried OPEN) in the
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
skip this loop, carry every `fix` gap OPEN, and resolve manually at finish
(`accept`/`rescope`/manual fix-in-place only).

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

## Closure / conformance

Emit this block in the verify completion summary. It is the durable handoff
`finishing-a-development-branch` Step 3.5 consumes — parseable even if session
context was pruned. Verify completes when every gap is either fixed
(`CONFORMS`) or carried OPEN as a deferred `accept`/`rescope`/`UNAUTHORIZED`
gap; escalation (cap reached with an open `fix` gap) is the one
non-completing terminal state.

For each carried-open gap:

```
Gn: <verdict> — recommended: <fix|accept|rescope> — touched-files: <paths>
  round history: R1 <verdict/action>, R2 <verdict/action>, ...
```

Then a single flat revert index of **every** `conformance fix Gn` commit the fix
loop produced this run — including gaps that later converged to `CONFORMS`
(a closed gap has no block above, so its commit lives only here) — since the
finish gate's revert option needs them all:

```
auto-applied fix commits: <Gn: SHA>, <Gm: SHA>, ... (revertable)
```

## Checklist

- [ ] Located canonical requirements (spec → prompt → ticket fallback)
- [ ] Enumerated every requirement: explicit ACs / spec clauses + implicit notes + inline prompt reqs
- [ ] Checked spec ↔ prompt/ticket drift; reconciled any divergence
- [ ] Each requirement mapped to where it's satisfied (code/doc) + evidence
- [ ] Multi-spec? Subset declared in spec; deferred ACs noted as out of scope
- [ ] Gaps reported, or all rows satisfied

Can't check all boxes (or unreconciled drift)? Not complete. Report the gap.
