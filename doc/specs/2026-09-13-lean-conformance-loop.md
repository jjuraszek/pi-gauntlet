# Lean conformance fix loop

**Goal:** cut the conformance remediation round to the two dispatches that do the work (fix wave, delta re-audit) and move code review and the full test set to a single post-convergence step, so the verify phase stops costing more wall time than implement and leaves the model nothing to misread.

Supersedes [doc/specs/2026-07-02-conformance-remediation-loop.md](./2026-07-02-conformance-remediation-loop.md), section 4 "Bounded re-audit loop" only, and [doc/specs/2026-08-14-parallel-review-fix-waves.md](./2026-08-14-parallel-review-fix-waves.md), the conformance-loop rows of section 3 "Loop accounting" only.

## Problem

The fix loop in `skills/verification-before-completion/reference/conformance-check.md` ("Per round:" steps 1-7) runs, per round: implementer fan-out, one `spec-reviewer` per gap, serial `git apply`, the full plan-header `Verification` set, one `code-reviewer` over the round delta, then the delta re-audit. Four serial model dispatches plus a full test run per round, for a patch that is usually a few lines.

Session data (66 gridstrong sessions since 2026-08-20 that reached a conformance audit, dispatch shapes read from `subagent` calls) shows the loop is not even followed:

| Dispatch | Count | Reading |
|---|---|---|
| implementer, single `agent:` call | 414 | fixes run one at a time |
| implementer, parallel `tasks` wave | 32 | the wave fires ~7% of the time |
| code-reviewer | 246 | more CRs than audits (170) |
| code-reviewer right after one implementer | 182 | "round CR" collapsed into "CR after every fix" |
| spec-reviewer | 118 | per-gap SR mostly skipped |
| conformance -> conformance, nothing between | 23 | re-audits with no fix in between |

Root cause is the loop's size, not one bad sentence: three dispatch shapes in step 2 (parallel group, `conflicts` serial, singleton), three review checks that all read the same patch (SR vs gap block, CR for quality, re-audit vs origin), and a full test set the round does not need. Every extra step is a place to drift, and the per-gap `spec-reviewer` is worse than redundant: the `conformance-reviewer`'s gap block already carries the origin clause, so an SR pass can only agree with or overrule the audit that owns the requirement.

## Decisions

| # | Decision |
|---|---|
| D1 | The whole-diff `code-reviewer` stays **before** the R0 audit (SDD "After All Tasks" step 2). It settles file structure so R0 can lock `file:line` evidence. Unchanged. |
| D2 | A fix round is exactly: sync tracker -> one fix wave -> integrate -> scoped tests -> delta re-audit -> partition. No `spec-reviewer`, no `code-reviewer`, no full test set inside the round. |
| D3 | The fix wave is **one** parallel `subagent({ context: "fresh", async: false, tasks: [...] })` call, one `implementer` task per selected gap (a single gap is a one-task `tasks` call). Selection is greedy in `Gn` order: take a gap unless a partner it `conflicts` with is already taken; the certificate's `disjoint` grouping is ignored. The wave is never empty while an eligible `fix` gap exists; held gaps carry to the next round. A lone `agent: "implementer"` call inside this loop is forbidden. |
| D4 | After every re-audit that returns `CONFORMS`, once: the full plan-header `Verification` set (ad-hoc: the project's canonical test command), then one direct `code-reviewer` dispatch over `git diff <r0-head>..HEAD` with `SCOPED_TEST_COMMANDS: none` - not via `/skill:requesting-code-review` (its fix rounds nest a second review loop). An empty diff is nothing to review - no dispatch. |
| D5 | Convergence repair items = every failing full-set command + every Critical/Moderate CR finding. They re-enter the round at step 2 as one wave (finding/failure block as the task contract, `SCOPED_TEST_COMMANDS: none`), integrate as **one** commit `conformance fix CR`, re-audit, then Convergence runs again. That wave is a fix round against `maxFixRounds` like any `Gn` wave. `Behaviour-change: yes` on the delta CR is a repair item covered by the re-audit, never a `spec-reviewer` reroute. |
| D6 | `r0-head` = HEAD when the loop is entered (the R0 dispatch, or the finish-time fix-now entry). It is the fixed base of every convergence CR range; recoverable as the parent of the oldest `conformance fix` commit. `audited-base` keeps its single meaning: the HEAD SHA of the last audit, written in the closure sentinel. |
| D7 | The finish freshness gate (`conformance-check.md` "Freshness rule", `finishing-a-development-branch/SKILL.md` Step 3.5) is unchanged: a stale tree at finish still means unexpected post-audit work and still triggers a full audit. D5 guarantees the loop never leaves the tree stale. |
| D8 | Round-shape prose lives once, in `conformance-check.md`. SDD "After All Tasks" step 3 already defers to it ("Follow that reference for ... fix-loop mechanics; do not reimplement them here") and `dispatching-parallel-agents` "Fix fan-out" already says the re-review runs "per the consuming loop's own rules". Both are untouched; the loop inlines its own dispatch shape and cites DPA only for integration failure handling. |
| D9 | No persona, extension, or settings change. `conformance-reviewer.md` already reuses `Gn`, emits `DELIVERED` blocks on re-audit, emits the `Parallel-safe:` certificate, and takes prior report + fix diff as re-audit input. `code-reviewer.md` is read-only and reusable as-is. `implementer.md` already honours `SCOPED_TEST_COMMANDS`. `maxFixRounds` keeps its meaning: dispatched fix waves, default 2. |
| D10 | `conformance fix CR` is not a gap fix: it is absent from the `auto-applied fix commits` index and has no `revert conformance fix Gn` action at the finish gate. Finish grammar unchanged. |

## Design

### 1. The round (`conformance-check.md` "Per round:", step 1 unchanged, steps 2-7 replaced)

```
1. Sync tracker    (today's step 1 verbatim: Gn task per fix gap, never init, reuse index, mark in_progress)
2. Fix wave        select gaps greedily in Gn order, skipping any whose `conflicts` partner is already
                   selected. ONE call: subagent({ context: "fresh", async: false, tasks: [ one implementer
                   per selected gap: worktree: true, cwd = the conformance worktree, task = the gap block
                   verbatim + SCOPED_TEST_COMMANDS ] }). SCOPED_TEST_COMMANDS = the gap-relevant plan-declared
                   commands, or `none`; ad-hoc (no plan) = the project's canonical test command.
                   UNAUTHORIZED over-spec rule: today's sentence verbatim (adds the spec path to touched-files).
                   Never a lone `agent: "implementer"` call in this loop.
3. Integrate       git apply serially, commit `conformance fix Gn` per gap; a convergence repair wave commits
                   as one `conformance fix CR`. Failure handling per dispatching-parallel-agents
                   "Review and Integrate" (today's sentence).
4. Scoped tests    the round's SCOPED_TEST_COMMANDS union on the integrated tree; a failure follows step 3's
                   failure rules.
5. Re-audit        conformance-reviewer over the round diff + regression guard (prior-DELIVERED rows whose
                   evidence file the diff touched); pass the full prior report and the round diff. Model
                   injection and the phase-tracker closure-guard sentences: today's step 6 text verbatim.
                   Mark every Gn the re-audit reports DELIVERED `complete`; open ones stay in_progress.
6. Partition       CONFORMS -> Convergence. Open gaps and rounds under maxFixRounds -> next round.
                   Cap reached with an open fix gap or repair item -> escalate (today's step 7 text).
```

Kept verbatim from today: step 1; the `UNAUTHORIZED` over-spec `touched-files` sentence (CI requires `touched-files` and `over-spec` in one paragraph); the DPA integration failure-handling sentence; the model-injection and closure-guard sentences; the escalation sentence; the `conformance fix Gn` commit sentence; the `maxFixRounds: 0` paragraph.

Removed: "Then dispatch foreground `spec-reviewer` per gap ..." and the whole "### `spec-reviewer` gap-block reference contract" section; step 5 "Round CR and completion" (its `complete` marking moves to the re-audit step); "full plan-header `Verification` set" from the test gate; the `disjoint` / `conflicts`-serial / "run sequentially as before" wave prose.

### 2. Convergence (new heading after "Per round:", before the `maxFixRounds: 0` paragraph)

```
Runs after every CONFORMS re-audit, and after R0 CONFORMS:
a. Full plan-header Verification set (ad-hoc: the project's canonical test command).
   After R0 CONFORMS with no round run, the pre-R0 full run counts.
b. code-reviewer, direct dispatch, async: false, over `git diff <r0-head>..HEAD`, SCOPED_TEST_COMMANDS: none.
   Empty diff = no dispatch.
c. Repair items = failing commands from a + Critical/Moderate findings from b. None -> write the closure
   block; done. Any -> re-enter the round at step 2 with the items as task contracts (one wave, one
   `conformance fix CR` commit, SCOPED_TEST_COMMANDS: none, no Gn tracker task); the wave is a fix round.
```

The second and later convergence CRs use the same `<r0-head>..HEAD` range; re-reviewing already-accepted hunks in a small delta is the accepted cost of one fixed base.

### 3. Concern-scoped fix projection (`conformance-check.md` "Concern-scoped fix projection")

The projected contract "runs the round and Convergence above", with `r0-head` = HEAD at that entry. Drop "the pre-integration `spec-reviewer`", "reruns the project's tests, runs `code-reviewer`".

### 4. Call sites

None edited (D8). `skills/finishing-a-development-branch/` untouched (D7, D10). `skills/verification-before-completion/SKILL.md` untouched; its conformance bullet already defers to the reference file.

### 5. Attention budget

The reference file's line count after the edit is at or below today's. The loop reads as one flat numbered list; its only data-driven branches are "conflicts partner already selected", "empty diff", and "repair items: none / any". CI invariants that bind the rewrite (`scripts/ci.mjs` token checks): `touched-files` and `over-spec` in one paragraph; "keep `origin: none (scope creep)` verbatim" and "Unavailable: scope creep has no origin requirement to defer" still present; "always** defers to the finish gate" and "`accept`/`rescope`/`UNAUTHORIZED`" still absent.

## Error handling and edge cases

| Case | Behaviour |
|---|---|
| R0 `CONFORMS` | No round. Convergence a is the pre-R0 full run, b has an empty diff. Zero added cost. |
| Every fix gap conflicts with another | Greedy selection takes the lowest `Gn` and every later gap not conflicting with a taken one; the wave is never empty. A chain longer than `maxFixRounds` escalates - accepted cost, the cap is the cap. |
| Scoped tests fail after integrate | Step 3 failure rules (DPA "Review and Integrate"), inside the same round. |
| Full set or delta CR fails at Convergence | Repair wave per D5, one round against the cap; cap reached -> escalate with the CR/test trail. |
| Malformed `Parallel-safe:` certificate | Re-ask once (existing DPA probe); still malformed -> every gap `conflicts` with every other, so greedy selection yields one gap per wave. Same `tasks` shape. |
| Delta CR reports `Behaviour-change: yes` | A repair item like any other; the re-audit is the origin check. No `spec-reviewer`. |
| Legacy plan file | Closure block and sentinel unchanged; old blocks validate as before. |

## Testing approach

- `npm test` (`scripts/ci.mjs`): skill lint, hardcoded-path ban, CHANGELOG/version pairing, the token checks listed in Design 5.
- Grep gates at verify:
  - `rg -n "spec-reviewer" skills/verification-before-completion/` -> no matches.
  - `rg -n "Round CR|round's cumulative fix delta|run sequentially as before" skills/verification-before-completion/reference/conformance-check.md` -> no matches.
  - `rg -c "r0-head" skills/verification-before-completion/reference/conformance-check.md` >= 3 (definition, CR range, projection).
  - `wc -l` of the reference file <= 482.
- Read-through: the round is a flat numbered list; every dispatch in the loop is either the `tasks` wave, the `conformance-reviewer` re-audit, or the convergence `code-reviewer`.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/specs/2026-07-02-conformance-remediation-loop.md` (supersession banner, section 4), `doc/specs/2026-08-14-parallel-review-fix-waves.md` (supersession banner, conformance rows of section 3), `CHANGELOG.md` (Unreleased entry)
- Derived / memory docs invalidated: none (`doc/configuration.md` `maxFixRounds` prose stays accurate; `README.md` does not enumerate loop steps)

## Out of scope

- Runtime enforcement of the round shape in `extensions/phase-tracker.ts` (its cadence ledger is implement-phase only).
- Changing the finish freshness gate to run a delta re-audit (D7).
- Widening the regression guard beyond "DELIVERED evidence file touched by the diff".
- `spec-reviewer`'s role in the SDD per-task loop; it loses only its conformance-loop caller.
- Thinking level of `conformance-reviewer` re-audits.
- A finish-gate revert action for `conformance fix CR` (D10).

## Files changed

| File | Change |
|---|---|
| `skills/verification-before-completion/reference/conformance-check.md` | Steps 2-7 -> round shape (D2, D3); new Convergence block (D4-D6); delete SR contract section; projection wording |
| `doc/specs/2026-07-02-conformance-remediation-loop.md` | Supersession banner |
| `doc/specs/2026-08-14-parallel-review-fix-waves.md` | Supersession banner |
| `CHANGELOG.md` | Unreleased entry |
