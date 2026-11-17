# finishing-a-development-branch eval report

for: a0884ca933d96ad47df4de3cc79e567ff17754b66eef8bf8c283a3e228fcc652

## Scope

Selected ticket #158 finishing-recovery samples with moved owner files. Both samples ran baseline-only and comparison against `09c9f4e1`. `reference/commit-message.md` is no longer incorrectly declared new: that file exists at the baseline. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected.

Model columns show runner verdict and candidate facts held/total in its recorded judgment. An `unchanged` or `improved` verdict is not a claim that every expected fact holds. Sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| ledger-pending-return | improved; 6/6 | unchanged; 6/6 |
| ledger-post-strip | unchanged; 5/5 | unchanged; 5/5 |

## Findings

- No fact that holds in the baseline arm fails in the candidate arm in either recorded judgment; both models hold every fact of both samples in the candidate arm.
- Both cases bundle `skills/loop-implementation/SKILL.md`, which lost five clauses that named a ledger conversion, a legacy grant or a migrated row, so both candidate arms reran. `ledger-post-strip` reran against its existing baseline with no case or fact change.
- `ledger-pending-return`, fixture: the case now also bundles `skills/loop-implementation/reference/interrupted-recovery.md`, byte-identical to `09c9f4e1`. Its step 3 is the only owner of the failed-row evidence `iteration <i>: interrupted - <reason>` with the reason `<k> commits` that the `rejection` fact quotes; the driver says to read it in full, and without it neither arm could know the cell. Case A now asks how the return-file path is recomputed and which of its lines are matched, and case C asks for both reset targets, the repaired row 2 cells and the repair decision, so the `admission` and `rejection` observables are requested rather than volunteered. The case changed, so both arms reran: baseline-only first, then the comparison.
- `ledger-pending-return`, `rejection`, expected fact: it read "evidence iteration 3: interrupted - 2 commits, appends one matching repair decision". With the reference bundled, both models wrote `iteration 2: interrupted - 2 commits` in the row and `repair row 2 | interrupted - 2 commits | iteration 3` as the decision, in both arms. That is the rule: step 3 writes the row evidence with the dispatch iteration `<i>` (the task carried `iteration: 2`) and the decision with the consumed count (3). `loop-implementation` `interrupted-child-redispatch` `row-budget` ("evidence iteration 6 ... iterations 7") and `scripts/loop-home-admission.test.mjs` (`iteration 2` in the row, `iteration 3` in the decision) pin the same pair. The fact now names both literals: "evidence iteration 2: interrupted - 2 commits, appends the one decision repair row 2 | interrupted - 2 commits | iteration 3". The saved replies were rejudged against it without a replay; both models hold it in both arms.
- `ledger-pending-return`, gpt-6.1-sol: `admission` and `rejection` now hold in both arms; before the fixture repair both failed in both arms. Opus is `improved` on `once` because this judgment fails the saved baseline reply, which names one refresh without the absolute ledger path; the candidate reply names the path. The move is not an intended one.
- `ledger-post-strip`: both models hold 5/5. `reference/verification-set.md` and `reference/legs.md`, which own its rules, are in both assemblies and differ from `09c9f4e1` only by one link target.

## Reproduction

Run `EVAL_CONCURRENCY=2 node eval/run.mjs finishing-a-development-branch <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above. Each cell is its first reply on the current input; `ledger-pending-return` was rejudged once after the `rejection` literal was corrected.
