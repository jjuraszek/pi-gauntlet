# eval report: writing-plans (partial run: leg-checkout-by-branch)

for: f23e54bba108936cbb56506a6510ce372eb1f3a2de2ee8dde43cc1be6b800f12

wall: 99s

## Change

Partition writing-plans by reader. Keep only the planning flow in SKILL.md and move the authoring rules into the complete plan contract. Send four paths, not a skill path, to the child. Load open-questions.md only on substantive questions or the second identical parent FAIL, and stop when that reference is unreadable. Preserve stamping, one finished-plan read and execution handoff.

The selected fresh-child-authors-plan replay checks that the parent dispatches four paths and reads neither reference on a clean run. The selected parent-offers-fix-first-narrow-amend replay checks a narrated read before the recovery menu, while gate-line-first checks the user-facing first line and pause without narration. These interpretation and read-order choices require model replay; deterministic checks establish the file partition and branch pointers, not the narrated behavior. Coverage is sample-scoped, not an instrumented plan-phase run or a target-wide pass.

The child-reads-one-contract replay checks that the plan-writer reads the whole contract at its supplied path before writing, without reading SKILL.md or requesting a fifth path. Baseline-fails-on-base, removal-lists-delete and maintenance-after-delete check retained failure evidence, Delete ownership and ordinary/implement-only maintenance after the move. The local checker validates both recorded removal plans; it observes neither live reads nor a live plan phase. Preserve leg routing and PR-subject verification; their selected replays remain separate coverage.

The leg-checkout-by-branch case selects the replay's existing Role: plan-writer branch and drops the parent skill slice. This removes conflicting parent dispatch/no-write instructions from the child exercise while preserving all six expected facts. Reseed and replay only this sample; retain the two passing PR records and all other sample evidence.

The latest run reseeded and replayed only leg-checkout-by-branch (four replay calls, three judge calls, one automatic confirmation). Both models retain the home path. One model still omits Modify ownership for the edited test in its primary and confirmation replies; its primary reply also leaves PLAN WRITTEN unscoped after case C. All six facts hold on the other model. The spec's word-for-word rule forbids adding a new ownership sentence to the contract without an amendment.

## Retained evidence

These samples were not rerun. Their saved candidate records retain passing facts on both models; the two PR records remain unchanged. Coverage is sample-scoped, not a target-wide pass or a live plan-phase run.

| sample | retained candidate record |
|---|---|
| fresh-child-authors-plan | [record](results/fresh-child-authors-plan/candidate.json) |
| parent-offers-fix-first-narrow-amend | [record](results/parent-offers-fix-first-narrow-amend/candidate.json) |
| gate-line-first | [record](results/gate-line-first/candidate.json) |
| child-reads-one-contract | [record](results/child-reads-one-contract/candidate.json) |
| removal-lists-delete | [record](results/removal-lists-delete/candidate.json) |
| maintenance-after-delete | [record](results/maintenance-after-delete/candidate.json) |
| baseline-fails-on-base | [record](results/baseline-fails-on-base/candidate.json) |
| pr-subject-threads | [record](results/pr-subject-threads/candidate.json) |
| pr-subject-sync-repair | [record](results/pr-subject-sync-repair/candidate.json) |

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| leg-checkout-by-branch | anthropic/claude-opus-5-5 | regressed | 17369 | branch-lookup: holds -> holds (held); path-roots: holds -> fails (regression); home-plan: holds -> holds (held); baseline: holds -> holds (held); recorded-home: holds -> holds (held); missing: holds -> fails (regression) |
| leg-checkout-by-branch | github-copilot/gpt-6.1-sol | unchanged | 16550 | branch-lookup: holds -> holds (held); path-roots: holds -> holds (held); home-plan: holds -> holds (held); baseline: holds -> holds (held); recorded-home: holds -> holds (held); missing: holds -> holds (held) |

## Feedback

- leg-checkout-by-branch / anthropic/claude-opus-5-5: Two facts moved from holds to fails in After, and neither is on the expected-to-move list. First, path-roots: After's Files block lists tests/settings.test.mjs only as Test, while Before listed it as both Modify and Test; After's narration also calls it only "the Test anchor", even though Step 1 edits the file. The moved contract should say outright that an existing test file the task edits is declared under both Modify: and Test:, and that all four kinds (Create, Modify, Delete, Test) resolve against the leg checkout. Second, missing: After ends with an unlabelled "PLAN WRITTEN /workspace/home/active/doc/plans/settings.md" directly under the C section, right after "I write no plan", so it reads as a success result for C; Before scoped the same line under a "Result (A)" heading. The contract should require that the result line is tied to the case or leg it covers, and that an unresolved-worktree stop ends with only the "cannot resolve worktree" report and no PLAN WRITTEN line. The other four facts survive: After still looks up by branch with the identity checks, keeps the plan and Spec header at home with Leg: team/widget before Files, uses baseline 2222222 (and now states the cd into /workspace/tree-pool/settings-73 explicitly, which is an improvement worth keeping), and ignores trees/fixed-slot in B. Separately, After narrates a plan_check run with "No findings", which is a live-tool claim the case forbids; it moves no listed fact but the contract could say to describe the check rather than claim its result in text-only exercises.
- leg-checkout-by-branch / github-copilot/gpt-6.1-sol: No fact moved: all six hold in both outputs, so dropping the parent skill slice and running the plan-writer on the contract alone kept the leg-checkout behaviour intact. Three things in After sit close to the facts and are worth tightening in the contract wording. First, After ends with a bare `OPEN QUESTIONS <plan path>` line even though A's plan has no open questions and no longer carries an Open Questions section, whereas Before ended with `PLAN WRITTEN` and tied `OPEN QUESTIONS` explicitly to C; say which terminal line applies to which outcome, and that an unresolved leg yields the stop message rather than a plan-path status, so the missing fact stays unambiguous. Second, the full contract now produces a top-level `## Files` block ahead of the task, so the `Leg: team/widget` line no longer precedes the first Files content; home-plan still holds because that block's heading names team/widget and the task-level Leg line precedes the task's `**Files:**`, but stating that the Leg line must come immediately before the per-task Files list (and that any plan-level file map is labelled by leg) would keep it robust. Third, After adds material beyond the spec and the supplied observations (extra null/undefined/boolean/object/array inputs, a commit step, a `plan_check` call), which lengthens the response towards the 900-word cap; a line telling the writer to keep test inputs to the spec's stated cases would preserve the brevity Before had while still delivering the four-path, single-contract change.

exit: 1
