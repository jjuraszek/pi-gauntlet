# eval report: writing-plans (partial run: leg-checkout-by-branch)

for: f23e54bba108936cbb56506a6510ce372eb1f3a2de2ee8dde43cc1be6b800f12

wall: 50s

## Change

Partition writing-plans by reader. Keep only the planning flow in SKILL.md and move the authoring rules into the complete plan contract. Send four paths, not a skill path, to the child. Load open-questions.md only on substantive questions or the second identical parent FAIL, and stop when that reference is unreadable. Preserve stamping, one finished-plan read and execution handoff.

The selected fresh-child-authors-plan replay checks that the parent dispatches four paths and reads neither reference on a clean run. The selected parent-offers-fix-first-narrow-amend replay checks a narrated read before the recovery menu, while gate-line-first checks the user-facing first line and pause without narration. These interpretation and read-order choices require model replay; deterministic checks establish the file partition and branch pointers, not the narrated behavior. Coverage is sample-scoped, not an instrumented plan-phase run or a target-wide pass.

The child-reads-one-contract replay checks that the plan-writer reads the whole contract at its supplied path before writing, without reading SKILL.md or requesting a fifth path. Baseline-fails-on-base, removal-lists-delete and maintenance-after-delete check retained failure evidence, Delete ownership and ordinary/implement-only maintenance after the move. The local checker validates both recorded removal plans; it observes neither live reads nor a live plan phase. Preserve leg routing and PR-subject verification; their selected replays remain separate coverage.

The leg-checkout-by-branch case selects the replay's existing Role: plan-writer branch and drops the parent skill slice. This removes conflicting parent dispatch/no-write instructions from the child exercise while preserving all six expected facts. Its case asks for every Files kind of each task path and scopes the final reply line to case A, because one reply covers three independent observations and case C writes no plan. The contract's ownership wording for an edited test file is moved text, unchanged by this edit. Reseed and replay only this sample; retain the two passing PR records and all other sample evidence.

The latest run reseeded and replayed only leg-checkout-by-branch after its case text changed (four replay calls, two judge calls, no confirmation). All six facts hold on both models: each reply declares the edited test as Modify and Test, closes case A with its own reply line and ends case C at the lookup report.

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
| leg-checkout-by-branch | anthropic/claude-opus-5-5 | unchanged | 11685 | branch-lookup: holds -> holds (held); path-roots: holds -> holds (held); home-plan: holds -> holds (held); baseline: holds -> holds (held); recorded-home: holds -> holds (held); missing: holds -> holds (held) |
| leg-checkout-by-branch | github-copilot/gpt-6.1-sol | unchanged | 13576 | branch-lookup: holds -> holds (held); path-roots: holds -> holds (held); home-plan: holds -> holds (held); baseline: holds -> holds (held); recorded-home: holds -> holds (held); missing: holds -> holds (held) |

## Feedback

- leg-checkout-by-branch / anthropic/claude-opus-5-5: No fact moved: all six hold in both outputs, so on this sample the role-scoped case and the moved contract text preserved leg lookup by branch, path resolution against /workspace/tree-pool/settings-73, the home plan path and header, the companion baseline, the recorded-home handling in B and the stop in C. After is slightly stronger on the baseline fact, because it writes the scoped command with an explicit `cd` into the companion tree, where Before left the run location implied by the admitted checkout; keep the contract wording that produces that explicit location. After is slightly less explicit than Before on two points that still hold: its lookup narration does not restate that recon comes only from the companion tree, and it says only 'Home carries only this plan and the spec' rather than naming where the plan lives. If you want those facts robust across replays, keep contract wording that tells the plan-writer to name the plan's home location and to state that companion recon never uses home source paths. After's step 3 also adds 'remove any test assertion that imports legacySetting' and its `git add` omits the deleted path (harmless after `git rm`); neither touches a listed fact.
- leg-checkout-by-branch / github-copilot/gpt-6.1-sol: No fact moved: After still locates the companion by branch from the /workspace/widget worktree list, validates checkout identity, resolves all four paths under /workspace/tree-pool/settings-73, keeps the plan at the home path with the home spec in the header, uses baseline 2222222 with npm test as verification, ignores the absent trees/fixed-slot in B, and stops in C with the exact cannot-resolve line and no PLAN WRITTEN line. Three details in After hold only narrowly and are worth pinning down in the contract wording. First, After adds a plan-level `## Files` section that appears before the task's `Leg: team/widget` line and lists tests/settings.test.mjs under Modify only; home-plan and path-roots hold because the per-task block still puts Leg before its Files and carries both Modify and Test. State that the per-task Files block is authoritative, that Leg precedes it, and that an edited test file gets both kinds wherever Files are listed. Second, the Spec header became an absolute /workspace/home/active/... path; say whether the header cites the home-relative doc/specs/settings.md or the absolute path so it stays unambiguously the home spec. Third, B shrank to "Repeat A unchanged" without naming the path; require B-style restatements to name the selected checkout (/workspace/tree-pool/settings-73) and say explicitly that the recorded home is neither planned against nor a stop condition.

exit: 0
