# eval report: writing-plans (partial run: removal-lists-delete)

for: 88741d62aafef5ee340579cc1419bf371115e7e4eeaab2d2063fcee7314a8a20

wall: 39s

## Change

Declare each removed file as Delete in exactly one task, not Modify, even while the file still exists. Show Delete in the task template as literal-path write ownership without an existence requirement. The removal-lists-delete sample exercises fresh plan authoring; its checker half is the removal-only fixture in extensions/lib/plan-check.test.ts. Expect Delete ownership and the absence of Modify to move from fails to holds; keep the scoped test and measured baseline unchanged.

Preserve existing Delete ownership through ordinary Findings maintenance and implement-phase Amend-apply. The maintenance-after-delete sample checks unchanged Files entries, absent removed paths, untouched task-owned source and successful self-checks in both modes. These are invariants, not expected fact moves; the checker half is the Delete-before/after-removal fixture in extensions/lib/plan-check.test.ts. This sample adds partial coverage without changing the maintenance instructions.

Derive implement amendment deltas and retained evidence from committed home plan/spec originals read before edits and on retry; previousApplyReport holds findings only. Commit only the plan at handoff after parent PASS and before tracker initialization. Missing originals fail write-free with exact command/stderr marker. The from-head, untracked-plan and handoff samples exercise these changes; existing historical/changed-command samples retain staged-repair and truthful execution requirements. Model evidence remains verification-owned.

Specialize implement-phase Amend-apply for local patches and historical per-command evidence. Preserve original declarations, evidence suffixes and staged repairs when no execution is needed; compare semantic obligations rather than offsets. Execute changed commands only on identified trees with nonzero counts, and retain failure/resolution evidence. Initial planning and explicit full refresh remain unchanged. The two implement-amend samples exercise these boundaries; parent verification owns full model runs and real report/result updates.

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
| removal-lists-delete | anthropic/claude-opus-5-5 | improved | 9196 | delete-owner: fails -> holds (intended change); no-modify: fails -> holds (intended change); checker-shape: holds -> holds (held); scoped-check: holds -> holds (held) |
| removal-lists-delete | github-copilot/gpt-6.1-sol | improved | 9089 | delete-owner: fails -> holds (intended change); no-modify: fails -> holds (intended change); checker-shape: holds -> holds (held); scoped-check: holds -> holds (held) |

## Feedback

- removal-lists-delete / anthropic/claude-opus-5-5: After moves both target facts as intended: Task 1's Files block now reads `Delete: src/legacy.ts` with no `Modify:` line (Before used `Modify: src/legacy.ts (deleted by this task)`, which failed both delete-owner and no-modify). Nothing Before kept was lost: the `---` separator still sits between the header and Wave 1, the coverage rows still use the exact `§ "Design" L4-L5` and `§ "Acceptance criteria" L8-L9` anchors from Task 1's Spec line, the task still anchors `tests/retirement.test.mjs` as Test and runs `node --test tests/retirement.test.mjs` with `baseline: abc1234 pass`, and `npm test` appears only in the Verification header. The added self-check sentence stating the Delete writer has no matching Modify is a useful explicit confirmation; keep the wording that frames Delete as literal-path write ownership without an existence requirement, and avoid any template phrasing like "(deleted by this task)" under Modify, since that is exactly what caused Before to fail.
- removal-lists-delete / github-copilot/gpt-6.1-sol: After delivers the Change cleanly: Task 1's Files block now reads `Delete: src/legacy.ts` with no Modify entry, which moves delete-owner and no-modify from fails to holds exactly as expected, while Before's `Modify: src/legacy.ts (delete the entire file)` was the only thing failing those facts. Nothing regressed: After keeps the `---` separator between the header and Wave 1, the coverage rows still use the exact `§ "Design" L4-L5` and `§ "Acceptance criteria" L8-L9` anchors from the task's Spec line, `tests/retirement.test.mjs` remains anchored as Test with `node --test tests/retirement.test.mjs` and `baseline: abc1234 pass` in task Tests, and `npm test` stays in the Verification header only. The wording that makes this work is the literal-path `Delete:` entry treated as write ownership without an existence requirement; retain that phrasing and avoid any parenthetical that re-describes the deletion as a modification.

exit: 0
