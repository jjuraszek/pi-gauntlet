# eval report: writing-plans (partial run: baseline-menu-aftermath)

for: f837d41c69b7755a9843192aef5a1678bfd15a17bf9ca94facc7d7ce5c25cbbf

wall: 44s

## Change

Rebase-mode unresolved home/member synchronization becomes Task 1 before thread repairs. Consume pending members in record order, update the home rework-base ref and amend the approved record with final full Rework base/member outcomes before finishing. Retain legacy merge Task 1, scoped thread tests, wave/checker/baseline and approval gates. The synthetic pr-subject-sync-repair sample narrates these transitions without live writes; every new candidate fact must hold, with no regression acceptance.

Establish task-command base provenance before handoff, stop on existing failures without inventing baseline evidence, and derive boundary decisions from source rather than asking the human. The parent offers fix-first, narrow, and amend for baseline failures, retaining the paused planning state. Admit recorded disposable artifacts on Findings re-entry while excluding Create:/Test: paths, preserve their suffixes on retained and replacement evidence by merging still-untracked recorded paths with newly generated artifacts on reruns, and inventory individual untracked files for exact plan-path admission and generated-source contamination.

Keep the fresh plan-writer child, parent stamping check, single finished-plan read and one verbatim Findings retry with identical second FAIL halting for the human. Treat every singleton wave as an ordinary group with no Solo or plan-time Parallel-safe requirement, initialize tasks in wave order and hand off directly to subagent-driven-development without mode selection. The all-singleton-plan sample exercises this grouping and handoff. The existing parent-fail-redispatches-once fixture now uses wave-file-disjointness for tasks modifying src/shared.ts instead of the deleted solo-line check; its retry and halt facts remain stable. This is behavior-changing conformance evidence.

PR-subject behavior uses preparatory baseline `1b0f7dd2bbbf926a8ff65109414d05aa97acaa58` (`PR_SUBJECT_EVAL_BASE`). The pr-subject-threads sample bundles the complete writing-plans and verification-before-completion skills because the default target slices omit the header policy. Detect only the approved spec's Rework record, put an unresolved base merge first, map each fix thread to one id-titled task with request-specific scoped tests and seam, and preserve nonfix dispositions without repair tasks. Use documented lint/format only in the header, or the non-command sentinel; verify the task Tests union plus that header without changing ordinary full-suite verification or completion gates. This extends, rather than replaces, the baseline provenance and handoff rationale above. Model replays are deferred to the parent under the scoped implementation dispatch.

All-or-nothing endpoint equivalence outside the dispatched spec and plan directories permits retaining valid unchanged-command evidence across planning-only commits and re-stamping it to BASE, even when task steps change. Any failed proof reruns all commands, and the explicit forced-rerun override always wins. The baseline-equivalent-restamp supplied-observation scenarios exercise retention plus fresh evidence for an added task, and rerun-all after a source diff. The existing provenance note records retained evidence.

Place a rebase-form Task 1 alone in Wave 1 marked `in-place`; keep the merge-form Task 1 as an ordinary wave task. The pr-subject-sync-repair sample bundles subagent-driven-development to exercise this execution distinction.

Keep Leg before Files and leg-specific test baselines and rule routing; preserve existing task-contract facts.

Add grant variants as two new samples, baseline-menu-under-grant and baseline-menu-aftermath, while preserving the existing parent-offers-fix-first-narrow-amend sample's failure/menu/pause as the no-grant control. Decode amend permission before taking baseline recommendations in initial planning and unchanged-command amendment aftermath. No model replay runs during implementation; verification owns the generated report.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| baseline-menu-aftermath | anthropic/claude-opus-5-5 | improved | 11955 | aftermath: fails -> holds (intended change); repeated-evidence-stop: fails -> holds (unplanned improvement) |
| baseline-menu-aftermath | github-copilot/gpt-6.1-sol | improved | 11030 | aftermath: fails -> holds (intended change); repeated-evidence-stop: fails -> holds (unplanned improvement) |

## Feedback

- baseline-menu-aftermath / anthropic/claude-opus-5-5: After moves both facts to holds and regresses nothing. Before treated the unchanged-command failure as outside the grant and paused on the three-option menu, so it never performed the grant-aware narrow hook-config redispatch; After adds the explicit grant check (predicate, Value decoding, `took recommendation: narrow hook-config`) and the step-3 redispatch with the Findings row, while still keeping the row non-attributable (no new spec item), keeping budgets unchanged, refusing `git checkout` on the protected plan path, and enforcing the two-item cap. Before's repeated-evidence contrast also failed because it still rendered `Recommendation: narrow - …`, which under an active grant reads as an auto-apply path; After correctly overrides the plan-writer's recommendation with `Recommendation: none - evidence repeats item 1`, prints no `took recommendation` line, and dispatches nothing. Keep that structure: decode the grant before acting on any baseline recommendation, state that the recommendation buys no retries, and in the repeat-evidence and third-item contrasts always end on `Recommendation: none - <reason>` naming the applied item so the grant cannot pick anything up.
- baseline-menu-aftermath / github-copilot/gpt-6.1-sol: Both facts moved from fails to holds in After, and nothing Before kept was lost. Before treated the unchanged-command failure as an ordinary human stop ("The grant does not choose a baseline option") and, in the repeated-evidence contrast, still printed `Recommendation: narrow` rather than the required `Recommendation: none - evidence repeats item <n>`. After decodes the `auto-apply amends` grant, prints `took recommendation: narrow hook-config`, and redispatches plan-writer with `Findings: Task 1 Tests: narrow to hook-config` as a writer-level fix rather than a new attributable spec item, while the contrasts keep the protected plan path unrestored, enforce the two-item limit, render `Recommendation: none - evidence repeats item 1` with no dispatch, and hold attempts/iteration/cap unchanged. One minor robustness note: the After continuation reads an amendment-surface file under `/opt/pi/skills/brainstorming/...` that the case does not supply; anchoring the grant decode solely on the supplied spec header read (which it also does) would avoid an invented path without affecting either fact.

exit: 0
