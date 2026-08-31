# Concurrent whole-diff review and full verification (gh-21)

Ticket: [#21](https://github.com/jjuraszek/pi-gauntlet/issues/21)

## Context

`skills/subagent-driven-development/SKILL.md` § "After All Tasks Complete" runs step 1
(whole-diff code review via `/skill:requesting-code-review`, dispatched with
`SCOPED_TEST_COMMANDS: none`) and step 2 (the plan header's full `**Verification:**`
set, run once by the orchestrator) strictly serially. Both are audits of the same
integrated, committed HEAD: the reviewer is read-only by profile, and the
verification run is the orchestrator's own bash. Serializing them wastes wall-clock
on every SDD run.

Issue #21's acceptance criteria (verbatim):

- SDD § After All Tasks steps 1-2 and The Process step "After all tasks" state the
  concurrent dispatch and the join: both results in hand before any fix-round or
  ship decision.
- A recorded orchestration transcript (harness fixture or session excerpt) shows the
  review dispatch and the verification command both started before either completes,
  no disposition before both results, and a fix commit triggering a fresh
  verification run before ship.
- The invalidation rule survives in effect: after any fix commits land, the full
  verification set re-runs before ship.

## Problem

Two independent read-only audits over a frozen HEAD run back-to-back for no
correctness reason. The one real hazard: a consumer's verification set may include
commands that **rewrite tracked files** (format `--write`, `lint --fix`, codegen,
migrations that regenerate checked-in dumps) - running such a set while the reviewer
reads the tree gives the review a mutating substrate. Concurrency must therefore be
the encouraged default (mirroring plan-wave auto-select) but admitted only when the
verification set is classified safe, degrading to today's serial order otherwise -
with no human gate in either direction.

## Design

Prose-only change to `skills/subagent-driven-development/SKILL.md`. No extensions,
agents, settings keys, or new files. Three touch points. The new text references
existing rules (`Parallel-safe:` fan-out, verify-phase evidence) rather than
restating them, and is written for prompt hygiene - every sentence load-bearing, no
fixed line budget: the classifier, dispatch shape, join invariant, notice, and
generalized invalidation are each must-keep content.

### 1. Classification (the safety net)

Before dispatching, the orchestrator classifies the plan header's `**Verification:**`
commands:

- **Unsafe:** any command that can rewrite tracked files - formatters in write mode
  (`--write`, `-w`), autofixers (`--fix`, `-u` snapshot updates), code generation,
  migrations regenerating checked-in artifacts.
- **Safe:** commands established to write only ignored/untracked paths (coverage,
  caches, build output) - test runners, check-mode linters/formatters (`--check`,
  `--diff`), type checkers. Builds are safe only when their outputs are
  untracked/ignored; a build that regenerates checked-in bundles, schema dumps, or
  snapshots is unsafe. Examples are illustrative, not authoritative - the rule is
  the write destination.
- **Wrappers** (`script/verify`, `package.json` aliases, `Makefile` targets): read
  one level in and classify what it invokes - safe iff every invoked command
  classifies safe under the rules above. Deeper nesting or an undeterminable write
  destination -> unsafe. Worked dogfood example: this repo's `npm test` unwraps to
  `node scripts/ci.mjs`, a read-only validator -> safe, so this repo's own SDD runs
  take the concurrent path.
- **Tie-break:** unclear -> serial. This is orchestrator judgment, not config - the
  same self-certification posture as plan-wave disjointness. No new settings key.

Classification runs once per verify entry. Post-fix re-runs are serial by nature
(no concurrent review to pair with), so no re-classification.

### 2. Concurrent path (default when safe)

1. `phase_tracker start verify` - unchanged.
2. Dispatch the whole-diff review with the exact shape the skill will state:
   `subagent({ agent: "code-reviewer", context: "fresh", async: true, cwd: <worktree>, output: <absolute $TMPDIR path>, task: <requesting-code-review template + SCOPED_TEST_COMMANDS: none> })`.
   The output path is $TMPDIR-rooted and non-colliding (never relative - a relative
   path lands untracked in the worktree); capture the returned run id. The review
   content and inputs are unchanged from today; only `async: true` + the output file
   are new. Step 1's current "Address Critical and Moderate findings before handoff"
   clause **moves post-join** - it is a disposition and may not fire between the two
   audits in either path.
3. In the same turn, run the full verification set foreground in orchestrator bash -
   evidence stays first-hand, satisfying the verify phase's fresh-evidence rule
   unchanged.
4. **Join:** per pi-cohort's async contract, never busy-wait. After verification
   returns, check the review once via `subagent({ action: "status", id: <run id> })`
   if needed; if the child is still running, **end the turn with no disposition** -
   pi delivers the async completion. The delivered completion plus the output file
   (read only after terminal completion) is the join.
5. Ordering invariant, stated in the skill: **no disposition of either result - no
   fix dispatch, no finding triage, no verify-complete claim, and no
   `conformance-reviewer` dispatch - before both results are in hand and any
   fix-triggered re-run is green.**

Both audits bind to the same committed HEAD; a verification result is valid only
while HEAD is unchanged. Because verification now runs against the pre-fix HEAD,
the skill's invalidation clause **generalizes** (today it names only conformance
fix rounds): any post-join fix commit - review-derived or conformance-derived -
invalidates the verification result, and the full set re-runs before
conformance/ship.

### 3. Serial fallback (unsafe/ambiguous)

Same two audits, review first then verification, plus one declarative notice naming
the offending command (e.g. `Serial review->verify: 'npm run fmt' writes tracked
files.`). Never a prompt. The join invariant is identical to the concurrent path -
findings are not addressed between the audits (that would be pre-join disposition);
only the start order changes. Serial is always legal; only dispositioning before
both results land is a violation.

### 4. Failure semantics at the join

- Verification fails, review clean -> dispatch fixes, re-run the set.
- Review has Critical/Moderate, verification green -> fix rounds land commits ->
  green run is stale -> re-run the full set (the generalized invalidation clause
  above).
- Both dirty -> strictly ordered, never merged: apply the review's certified
  `Parallel-safe:` fan-out first (when present, else sequential fixes), then the
  remaining verification failures sequentially, then one re-review and one full
  verification re-run. **Verification failures never join a `Parallel-safe:`
  group** - they carry no finding IDs and no disjointness certification, and
  `dispatching-parallel-agents` forbids orchestrator-invented partitions.
- Async review dispatch errors or the child dies -> re-dispatch the review
  **serially**; the verification result is already in hand.

## Edit surface

All in `skills/subagent-driven-development/SKILL.md`:

1. **§ "After All Tasks Complete" steps 1-2** - rewrite into
   classify / concurrent / serial-fallback shape per Design. The steps stay **two
   numbered steps** (step 1: classify + dispatch both audits; step 2: join +
   generalized invalidation), so downstream steps 3-5 (conformance, summary,
   finishing) keep their numbers. The #19 re-ask forward-reference stays **out of
   the skill body entirely** - the join is defined solely over the review's terminal
   result and the verification result.
2. **§ "The Process" step "After all tasks"** - reduce to a pointer at § "After All
   Tasks Complete" so the review is dispatched exactly once (today's text names the
   review dispatch itself, which under the new shape would double-dispatch).
3. **§ "Red Flags"** - one added line: dispositioning either result (fix dispatch,
   triage, verify-complete claim) before both the review and the verification run
   have completed.

Untouched: `requesting-code-review`, `verification-before-completion`,
`dispatching-parallel-agents`, `writing-plans`, all agents, all extensions.

## Out of scope

- Issue #19 (deterministic `Parallel-safe:` probe, plan self-review checker, the
  one-shot re-ask). No forward-reference to it enters the skill body; when #19
  ships, it amends the join itself.
- Any change to the `Parallel-safe:` grammar or its identity-pinned copies.
- Parallelizing fix rounds with anything - dispositions write the tree and stay
  strictly post-join.
- New settings keys or overrides schema. Consumers who want to pin a command's
  classification use the existing generic overrides mechanism (prose guidance, no
  new machinery).

## Testing approach

This repo's `npm test` (`scripts/ci.mjs`) is a structural validator with no
skill-prose semantics; it gates formatting/integrity only.

AC bullet 2's orchestration transcript: primary source is the session excerpt of
this change's own SDD run (which takes the concurrent path per the dogfood
classification above), captured at conformance/finish time with these markers -
review dispatch start, verification start, both terminal results before any
disposition, fix SHA, post-fix full-run result bound to that SHA. **Contingency:**
a clean run produces no organic fix commit, making the fix-SHA leg unattainable
from the excerpt alone; in that case, seed one deliberate Moderate-level finding
(or use a small scripted throwaway fixture) in a scratch SDD pass to produce the
fix-commit -> fresh-verification evidence, and note the seeding in the transcript.
The AC explicitly allows "harness fixture or session excerpt"; nothing is committed
to the repo either way.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none (skill bodies are implementation surface)
- Derived / memory docs invalidated: none

CHANGELOG entry rides the release commit, per repo convention.

## Open questions

None. Scope (#21 only), safety mechanism (orchestrator classification,
default-concurrent, fail-closed on ambiguity, no gates), and concurrency mechanics
(async review + foreground verification + completion-delivered join, no busy-wait)
were each fixed with the
requester during brainstorming.
