# Ledger - loop engine
**Spec:** `doc/specs/2026-11-16-gh-151-delivery-stage-audit-exclusion.md`
base: 3171d0e124e361836d163217ff976af02c86cf2f
verification: npm test
checks: commands
iterations: 6
allowance: 10
returned: 6 | home | f241bcf71d748d324d6787c21e35bc0c3d439ae1

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test eval/conformance-reviewer/legs-verification-line.test.mjs; 1 passed, 0 failed; selected model eval legs-verification-line improved on both replay models; file and behavior clauses DELIVERED without PR-gate or ship-evidence gaps |
| 2 | done | 1 | timeout -k 30 60 node --test eval/conformance-reviewer/stage-exclusion.test.mjs; 2 passed, 0 failed; selected model evals stage-only-sentences and mixed-row improved on both replay models; stage clauses omitted with no PR and with an open PR |
| 3 | done | 0 | timeout -k 30 60 node --test eval/conformance-reviewer/stage-exclusion.test.mjs; 2 passed, 0 failed; mixed-row holds all facts on both replay models; each acceptance row has one DELIVERED requirement and a behavior-only origin quote |
| 4 | done | 1 | timeout -k 30 60 node --test eval/conformance-reviewer/prompt-stage-sentence.test.mjs; 1 passed, 0 failed; prompt-stage-sentence model eval: 2 improved cells, all 8 facts hold; 4 replays, 2 judgments, 0 confirmations |
| 5 | done | 1 | timeout -k 30 60 node --test eval/conformance-reviewer/ci-step-is-the-change.test.mjs; 1 passed, 0 failed; ci-step-is-the-change model eval holds all four facts on both arms and both replay models; CI-file and bundle gaps retain recommended: fix and spec origins |
| 6 | done | 1 | timeout -k 30 60 node --test scripts/delivery-stage-authoring.test.mjs; 3 cached checks passed, 22 judged facts hold on two models; selected model evals: pr-body-proof, pr-body-drafted-row, post-action-sorted; authoring contract: 67 passed, 0 failed |
| 7 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 6: reuse scripts/brainstorming-contract.test.mjs to widen the ticket gate and drafting rules
row 1 done | The audit drops delivery-stage clauses while retaining delivered file and behavior requirements on the same leg line. | Reuse eval/conformance-reviewer and its legs-verification-line fixture and cached replay check to test the remaining audit exclusions.
row 2 done | Added passing audit coverage that omits stage-only sentences with and without an existing pull request. | Reuse eval/conformance-reviewer/stage-exclusion.test.mjs to replay the stage-only-sentences and mixed-row fixtures and cached judgments.
row 3 done | Confirmed each mixed acceptance row retains one delivered requirement and quotes only its behavior clause. | nothing new to build on
row 4 done | Added a prompt-only CI sample proving the audit omits stage requirements and drift while keeping delivered behavior. | Reuse eval/conformance-reviewer/prompt-stage-sentence.test.mjs to check the fixture and cached model judgments locally.
row 5 done | Preserved fix gaps for missing CI-file changes and regenerated bundles, retaining spec origins when the prompt repeats them. | Reuse eval/conformance-reviewer/ci-step-is-the-change.test.mjs for cached CI-file and bundle regression checks.
row 6 done | Expanded ticket and drafting rules to reject PR proof, preserve generated PR text, and sort operator steps into narrative context. | Reuse scripts/delivery-stage-authoring.test.mjs to replay the three cached authoring samples and guard PR-text-as-product behavior.
