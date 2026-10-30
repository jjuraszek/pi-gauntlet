# eval report: writing-plans (partial run: gate-line-first)

for: 9289dd5356dab5276a733fd9e154ac50234409facfab7a61bfed6f6933eb27bf

wall: 24s

## Change

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
| gate-line-first | anthropic/claude-opus-5-5 | unchanged | 16391 | failure: holds -> holds (held); menu: holds -> holds (held); pause: holds -> holds (held); first-line: holds -> holds (held) |
| gate-line-first | github-copilot/gpt-6.1-sol | error |  |  |

## Feedback

- gate-line-first / anthropic/claude-opus-5-5: No fact moved. Both outputs name Task 1, `node --test tests/timeout.test.ts` and exit 1 on `def5678` as the base failure; both list fix-first, narrow and amend one per line and close with a Recommendation line; both pause for the human without stamping, initializing plan_tracker or marking the plan complete. After adds an explicit trailing state line (`in_progress`, substep `plan-write`, nothing stamped, tracker uninitialized), which makes the pause fact easier to verify but was not needed for it to hold - Before already held it by simply asking the question and performing none of the forbidden actions. Note that the Expected-to-move entry `parent-offers-fix-first-narrow-amend/menu: fails -> holds` does not match this sample: Before already satisfied the menu fact, so this case is a no-regression control rather than a mover. If the author wants the After wording to be the stable no-grant control going forward, keep the three bare-labelled option lines plus the single Recommendation line and the closing state sentence; avoid turning the state sentence into a narrated procedure, since the prompt asks for only the recovery question.
- gate-line-first / github-copilot/gpt-6.1-sol: error - github-copilot API error (429): 429 quota exceeded

exit: 1
