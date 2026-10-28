# Amendment aftermath feeds its own failures back into the batch

**Goal:** A `plan_check` FAIL or a baseline failure that the amendment surface's own plan-writer re-dispatch produces, and that cites text the batch just wrote, becomes one more item on that batch - restored, re-amended, re-planned - instead of a question to the human; writing-plans step 6 keeps its human stops for first-time planning.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves

## Problem

The implement phase is meant to run hands-free: the orchestrator retries its own mistakes and stops only for a direction decision. The repo already has the loop for spec mistakes - SDD classifies a question whose candidate answers are all spec edits as "an amendment batch, never a decision", `amendment-surface.md` section 1 batches "every amendment pending at this decision point", and section 5's aftermath re-plans (plan-writer `Amend:` dispatch, then `plan_check`). The loop has one exit that bypasses it: the aftermath delegates to `writing-plans` "Author the plan" steps 5-6, and step 6's failure branches (`PLAN WRITTEN` + the same `FAIL` twice, `- Task N: ... fails on <sha>`, `dirtied tracked source`) were written for first-time planning, where the human is the only one who can answer. Inside an aftermath the human is not the answer; the amendment is.

Seed run (session `2026-10-28T12-05-51` on this repo): the implementer returned `BLOCKED` because the plan put `node eval/run.mjs shape-ticket <sample>` in step text, outside `SCOPED_TEST_COMMANDS`. The orchestrator took the amendment route under a standing grant and moved the replays into Task 1's `**Tests:**` - its own mistake, since `plan-contract.md` L32 requires every `Tests:` segment to carry a `Test:` path token. The plan-writer rehearsed the amended command at BASE; the replay overwrote `eval/shape-ticket/report.md` and `results/audit-grounding/{baseline,candidate}.json` (replays rewrite tracked records by design, `eval/run.mjs` L351-373), `plan_check` returned `FAIL (15 findings)`, and the plan-writer reported the three dirtied paths. Step 6 row `dirtied tracked source` then told the orchestrator to "take every test-dirtied path to the human to commit, discard, or move; never clean automatically" - so it asked, holding both the cause (its own edit) and the proof (the FAIL lines). Nobody misbehaved: the implementer, the plan-writer, and the orchestrator each followed their rule.

Premises checked: `writing-plans/SKILL.md` step 6 table (L78-82) and its `never clean automatically` rule (L80); `plan-contract.md` L30-32 (baseline forms, `Test:` path segment rule); `agents/plan-writer.md` L41 (no restore/clean); `agents/implementer.md` L41; `subagent-driven-development/SKILL.md` Implementer Status and "When a Subagent Fails" (two attempts); `amendment-surface.md` Standing grants, section 1, section 5; predecessor `doc/specs/2026-10-26-selective-baseline-rerun-on-amend.md` (an `Amend:` re-dispatch retains evidence for unchanged commands only while its tree-equivalence proof holds and reruns every command otherwise, so retention never proves attribution; the Design's text comparison does). Unverified and not load-bearing: replay model credentials.

Framing: kept - the user set plan/implement as hands-free: the orchestrator retries its own mistakes and escalates only on a direction decision. The scout's alternative (a plan-contract carrier for eval replays) is a Design clause for this spec's own replays and an open question for the contract; the general "restore run-dirtied paths" grant the user first asked about is out of scope.

Extends `doc/specs/2026-10-22-gh-74-respect-amend-grant.md` (standing grant honored in implement); relies on `doc/specs/2026-10-26-selective-baseline-rerun-on-amend.md` (retained baseline evidence). Supersedes neither.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] Under an active grant with amend permission, when the aftermath's plan-writer re-dispatch returns the same `plan_check` FAIL a second time (writing-plans' own first `Findings:` retry runs as written), a `fails on <sha>` row, or a `dirtied tracked source` row, and the finding is attributable to text this batch wrote, the orchestrator restores the eligible row's tracked paths, amends the spec again, re-dispatches the plan-writer, and addresses no question to the human.
  in-scope
- [ ] Without amend permission, the same outcome renders the amendment reviewer-and-menu path for the proposed spec fix (sections 2-4: prefilter, reviewer, human batch) and ends the turn, not step 6's commit/discard/move choice; nothing re-dispatches before the reply.
  in-scope
- [ ] An aftermath outcome not attributable to the batch - a command or plan text the batch did not add or change, or a writer-only plan defect - takes `writing-plans` step 6 as written; in a mixed output only the attributable lines form the item.
  in-scope
- [ ] A third human-facing outcome in one batch, or an item whose evidence repeats an already-applied item's evidence in that batch, takes step 6 as written and lists the batch's retry items with their evidence.
  in-scope
- [ ] The restore runs `git checkout --` (plain jj: a `root:` fileset restore) on exactly the tracked, unprotected paths an eligible `dirtied tracked source` row names, one quoted path per command; a row naming an untracked, spec, plan, or `In-flight:` path is not restored at all and takes step 6; `artifacts:` paths and `In-flight:` paths are untouched.
  in-scope
- [ ] The batch lands as one `amend:` commit whose body records each retry item with its evidence, so `git revert` of that commit undoes the retries with the batch.
  in-scope
- [ ] `skills/writing-plans/SKILL.md`, `skills/writing-plans/reference/plan-contract.md`, `agents/plan-writer.md`, and `plan_check` are not modified; first-time planning keeps every step-6 stop.
  in-scope
- [ ] `eval/brainstorming` slices amendment-surface section 5 and carries the four samples `aftermath-retry-grant`, `aftermath-retry-no-grant`, `aftermath-unchanged-command`, `aftermath-budget-exhausted`; `node eval/run.mjs brainstorming` (the full target; one sample at a time only while iterating) runs before the finish and its full-target `report.md` and records ship with the change.
  in-scope

## Design

Everything lands in `skills/brainstorming/reference/amendment-surface.md`; the flow reuses the existing spec-fix -> replan -> retry loop and names no new construct.

**Section 5 - aftermath finding (the rule).** Directly after "then run that section's steps 5-6 (the parent `plan_check` and its branches)", add one paragraph:

- A step-6 outcome that would address the human - the same `FAIL` output a second time (writing-plans' own first `Findings:` retry runs as written), a `- Task N: ... fails on <sha>` row, a `dirtied tracked source` row (each on its first occurrence) - is a finding at this decision point. A finding attributable to this batch's amendment (next bullet) is an amendment item unconditionally: no candidate-answer test (step 6's commit/discard/move answers are not spec edits, and the seed must qualify) and no grant test (the grant re-read below decides apply versus sections 2-4, never classification). A finding from this batch's own aftermath joins this batch; section 1's "a later finding is a new batch" applies after this batch's commit.
- Attribution: a `plan_check` FAIL line is `<check> @ line <planLine>: <reason>` plus the quoted plan line, not a spec anchor, so compare the quoted plan text (FAIL) or the row's command (baseline row) with what the batch changed. It matches when the task owning that line or command has a `Spec:` anchor naming a section in the batch's `Amend:` block, or its `Tests:` text differs from HEAD's copy of the plan (`git -C <abs worktree path> show HEAD:<plan path>`). A plan line number or task membership alone is no match, and retained baseline evidence proves nothing (Baseline reruns every command when its tree-equivalence proof fails, so an unchanged command can appear in the row). Not attributable - a command or plan text the batch did not add or change, so the base is genuinely broken, or a writer-only plan defect (malformed bullet, missing `baseline:` line) with no spec text behind it - takes step 6 as written. A mixed output: the attributable lines form the item; the unrelated lines take step 6 as written, never the whole output as amendment authority.
- Restore, when the finding carries a `dirtied tracked source` row: the row is eligible only when every path it names is tracked (`git -C <abs worktree path> ls-files -- "<path>"` prints it; writing-plans also files a new `??` at a `Create:`/`Test:` path under that row) and is neither the spec, the plan, nor an `In-flight:` path. One command per path, each path quoted: `git -C <abs worktree path> checkout -- "<path>"` (plain jj: `jj -R <abs worktree path> restore -- "root:\"<path>\""` - the `root:` fileset anchors at the workspace root; jj resolves bare paths against cwd, not `-R`). That returns the tree to section 1's invariant ("the working tree stays at pre-batch HEAD until apply" plus the batch's own edits). A row naming an untracked or protected path takes step 6 as written, with no partial restore; `artifacts:` (untracked) and `In-flight:` (parent-owned) paths stay. Nonzero exit -> the shell-error stop below.
- Then hold one item: `evidence` = the FAIL lines or the baseline row verbatim, `recommended` = the correction (`accept` or a named `alt-n`), `location` = the amended section. Re-run section 1's grant re-read for the item: amend permission applies it without a stop and prints `amended the spec: <title> - <what>`; budget-only, `none`, or absent renders sections 2-4 (prefilter, reviewer, human menu) and ends the turn - nothing re-dispatches before the reply; on the reply apply only that item's chosen edit, and a redirect or drop returns the finding to the step-6 exit it came from, with no re-dispatch over an unfixed spec. Then re-run this aftermath's plan-writer dispatch - the same `Amend:` form naming the item's sections, with the FAIL lines or baseline row quoted inside the `Amend:` rule sentence (writing-plans step 3 allows one block, `Findings:` or `Amend:`, never both; a `Findings:` block would also import plan-writer's finding budget and its Open Questions exit), and the `In-flight:` list including the amended spec and the plan - and steps 5-6 again. The tracker update and the one `amend:` commit run once, after the loop exits on `PASS`; step 7's phase completion still does not run.
- Bound: at most two items from aftermath findings per batch. The third human-facing outcome, or an item whose `evidence` repeats an already-applied item's `evidence` in this batch, takes step 6 as written, with the batch's retry items and their evidence listed in that message.
- Ledger present: section 5 already skips `plan-writer` and `plan_check`, so no aftermath finding exists and nothing changes.

**Section 5 - commit.** The "One commit per batch" body already records every item; state that aftermath items appear there like any other (`granted` under a grant, `accepted`/`alt-n` otherwise, each with its evidence), so the batch still lands as one `amend:` commit and the existing `git revert` of that commit undoes the retries.

**Replays for this spec.** `node eval/run.mjs brainstorming <sample>` per new sample while iterating (the runner takes one target and at most one sample: `eval/run.mjs` L379-383 exits 2 on more positionals), then `node eval/run.mjs brainstorming` once before the finish per AGENTS.md "Change process" and `eval/README.md` "Iterating on a skill edit"; never as a task `Tests:` command (plan-contract L32 cannot carry it). The new `skillFiles` entry joins every sample's assembly (`bundle-` drops by path, and one of the 44 samples drops `amendment-surface.md`), so that final run replays the whole target on both models - accepted cost, no selective-bundling machinery - and its full-target `eval/brainstorming/report.md` and `results/<sample>/*.json` ship with the change; the four new samples are not the whole validation scope.

**Remove:** none.

**Add:**
- `skills/brainstorming/reference/amendment-surface.md` § 5 "Apply, aftermath, commit": the aftermath-finding paragraph (rule, attribution, restore, re-run, bound, ledger note) and the one-clause commit-body addition.
- `eval/brainstorming/target.json`: a `skillFiles` slice of `skills/brainstorming/reference/amendment-surface.md` from `## 5. Apply, aftermath, commit` to `## Conformance entry` (every existing sample's assembly changes; see Replays).
- `eval/brainstorming/samples/aftermath-retry-grant/`, `aftermath-retry-no-grant/`, `aftermath-unchanged-command/`, `aftermath-budget-exhausted/` (`case.md`, `expected.md` per `eval/_template`), synthetic report-runner spec like the existing `amendment-menu-*` samples.
- `eval/brainstorming/intent.md`: the aftermath-finding intent, its `for:` line rebound to the new bundle-free assembly SHA; then `node eval/run.mjs brainstorming --baseline-only` once to reseed the baseline arm (the new entry changes `skillSha` on both arms) before the candidate run.
- `CHANGELOG.md`: `## Unreleased` entry.

Authoring follows `/skill:forge-skill` (imperative voice, low conditionality, minimal diff); `amendment-surface.md` is 27,139 bytes, so the size lint has room.

## Errors and edge cases

- Restore command exits nonzero -> stop with the shell error, as every other git step in this file.
- Redraw-class finding (the plan can pass only if a component is added, removed, or re-bounded) -> commit the batch as it stands so nothing is lost; hand any `dirtied tracked source` paths to step 6 as written (commit, discard, or move) before the SKILL.md redraw path - the spec-and-plan commit is not cleanup, and automatic restoration never covers a redraw finding; never an aftermath item.
- Grant line malformed at the re-read -> stop and print the offending line(s), as section 1 does today.
- No plan yet when the batch runs -> no aftermath dispatch, nothing to feed back (section 5 commits the spec and continues).
- Ledger batch -> inert (no `plan_check` outcome).
- The seed replays as: `OPEN QUESTIONS` + FAIL with a `dirtied tracked source` row naming three tracked eval files, attributable through Task 1's amended `Tests:` text -> `checkout --` each of the three -> item "replays are not `Tests:` commands; move them to the final verification step" -> `Amend:` re-dispatch quoting the FAIL lines -> `PASS` -> plan read, tracker update, one `amend:` commit; no message to the human.

## Tests

- Grant active, second identical FAIL citing the batch's `Tests:` text plus a `dirtied tracked source` row with three tracked paths -> restore, `amended the spec:` line for the retry item, `Amend:` re-dispatch quoting the FAIL lines (no `Findings:` block), no question to the human - `eval/brainstorming/samples/aftermath-retry-grant`
- Same input, no grant -> the amendment menu for the retry item and the turn ends; no commit/discard/move menu, no re-dispatch before the reply - `eval/brainstorming/samples/aftermath-retry-no-grant`
- FAIL or baseline row citing a command the batch did not write -> step 6's existing response for that outcome kind: the verbatim FAIL lines for a second identical FAIL, the fix-first/narrow/amend menu for `fails on <sha>`, commit/discard/move for `dirtied tracked source` - named per outcome in `aftermath-unchanged-command/expected.md` - `eval/brainstorming/samples/aftermath-unchanged-command`
- Third human-facing outcome in one batch -> step 6 as written, retry items listed with evidence; and, as an independent second trace in the same input, a second outcome whose evidence repeats an already-applied item's -> step 6 as written with that item listed - `eval/brainstorming/samples/aftermath-budget-exhausted` (two labeled traces in one `# Input`, the shape `loop-ledger-amend/case.md` already uses)
- Restore names exactly the eligible row's tracked paths, one quoted path per command; `artifacts:` and `In-flight:` untouched; a row with an untracked or protected path -> step 6, no restore - a must-hold fact in `aftermath-retry-grant/expected.md`
- One `amend:` commit body carrying the retry item with its evidence - a must-hold fact in `aftermath-retry-grant/expected.md`
- writing-plans, plan-contract, plan-writer, `plan_check` unmodified - none: observed on the diff; `npm test` guards the skill and eval lint
- Four samples structurally valid against `eval/_template` - `npm test` (`scripts/ci.mjs` runs `lintAll` over the real samples; `eval/lib/lint.test.mjs` only tests the linter's own fixtures)
- Ledger batch inert - none: the precondition (a `plan_check` outcome) cannot occur; the existing `loop-ledger-amend` sample guards the skip
- Nonzero restore exit stops with the shell error - none: the existing shell-error stop pattern, not sample-worthy

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` - `## Unreleased` entry (major procedures / conventions: the aftermath no longer stops the human for its own amendment's failures)
- Derived / memory docs invalidated: none - the spec-gate grant text ("every later spec amendment in this flow applies without asking; only a redraw still stops") already covers aftermath items; `README.md` and `doc/configuration.md` describe the grant at that level and stay correct

Bar: `reference/documentation-impact.md`.

## Out of scope

- A plan-contract carrier for eval replays (`Tests:` cannot hold them; today they live outside the task contract) - open question below.
- A general grant to restore implement-phase test damage (scoped tests that write tracked files) - the plan-writer's `dirtied tracked source` row is the only restore list this spec uses.
- Any change to `writing-plans` step 6, `plan-contract.md`, `agents/plan-writer.md`, `plan_check`, or the implementer's `SCOPED_TEST_COMMANDS` contract.
- Model choice for the orchestrator (the seed's behavior was rule-driven, not model-driven).

## Open questions

- Where does a skill-edit plan carry `node eval/run.mjs <target> <samples>` so an implementer may run it and Baseline never does? Candidates: a plan-level `## Replays` section executed once in verify by `/skill:verification-before-completion`, or a per-task `**Replays:**` block. Follow-up spec; this spec runs its own replays before the finish.
