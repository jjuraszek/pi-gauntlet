# Ledger - loop engine
**Spec:** `doc/specs/2026-11-18-gatekeep-discovery-roster.md`
base: 769b1abc3661fb0313520e093d7d0e128b21a150
verification: npm test
checks: commands
iterations: 6
allowance: 10
returned: 8 | home | 5e8a756fa44d7db1ccb378bb15bc2ead637dc634

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/gatekeep-comment-reconcile.test.mjs; 78 passed, 0 failed; no-arg-discovery-note baseline and candidate replayed on two models, n1 holds on both |
| 2 | done | 0 | timeout -k 30 60 node --test scripts/gatekeep-comment-reconcile.test.mjs; 79 passed, 0 failed; no-arg-discovery-note n3 holds on both models |
| 3 | done | 1 | timeout -k 30 60 node --test --test-reporter=dot scripts/gatekeep-comment-reconcile.test.mjs; 81 passed, 0 failed; no-arg-discovery-single f1 moved from fails to holds on both models |
| 4 | done | 1 | timeout -k 30 60 node --test --test-reporter=dot scripts/gatekeep-comment-reconcile.test.mjs; 81 passed, 0 failed; no-arg-discovery-over-cap and no-arg-discovery-cc-multi f1 moved from fails to holds on both models |
| 5 | done | 0 | timeout -k 30 60 node --test --test-reporter=dot scripts/gatekeep-comment-reconcile.test.mjs; 80 passed, 0 failed; no-arg-discovery-note n1 and n2 hold on both models |
| 6 | done | 0 | timeout -k 30 60 node --test --test-reporter=dot scripts/gatekeep-comment-reconcile.test.mjs; 81 passed, 0 failed; no-arg-discovery-note n2 holds on both models for own-address links and plain IDs after a failed lookup |
| 7 | done | 1 | timeout -k 30 60 node --test --test-reporter=dot scripts/gatekeep-comment-reconcile.test.mjs; 81 passed, 0 failed; no-arg-discovery-note n1 holds on both models for matching team slugs; no-arg-discovery-under-cap and no-arg-discovery-zero f1 hold on both models, with review requested for the unmatched team |
| 8 | done | 1 | timeout -k 30 60 node --test --test-reporter=dot scripts/gatekeep-comment-reconcile.test.mjs; 82 passed, 0 failed; role-line-team t1, t3 and t4 moved from fails to holds on both models for discovered and typed PRs, authors and direct requests; role-line-requested r1-r4 held on both models |
| 9 | done | 0 | timeout -k 30 60 node --test --test-reporter=dot scripts/gatekeep-comment-reconcile.test.mjs; 82 passed, 0 failed; role-line-team t2 moved from fails to holds on both models for a failed membership read and two pending teams |
| 10 | done | 0 | timeout -k 30 60 node --test --test-reporter=dot scripts/gatekeep-comment-reconcile.test.mjs; 81 passed, 0 failed; no-arg-discovery-note n4 holds on both models for an instruction to approve in the PR description |
| 11 | open | 0 | |
| 12 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Discovery prints one linked entry per surviving PR in size order before provisioning, with counts, reason, ticket and a short description. | Reuse the list entry and ticket rules in verification-brief.md for typed PRs and the no-arg-discovery-note sample for discovery checks.
row 2 done | The list has no first-line marker and gating continues without waiting for a reply. | The discovery-continues parameter case in gatekeep-comment-reconcile.test.mjs pins the message boundary for later stop and admission checks.
row 5 done | The list links each PR to its GitHub page and each GitHub ticket to its issue page. | The GitHub links case in gatekeep-comment-reconcile.test.mjs checks closing-reference URLs and the origin issue URL used for branch and title hints.
row 6 done | A Linear ticket uses its PR's own address first, then the trusted workspace, agreeing PR addresses or one lookup; an unresolved ID stays plain text. | The Linear links case in gatekeep-comment-reconcile.test.mjs pins that lookup order for typed and discovered entries.
row 10 done | Both replays described the settings change without following the PR description's instruction to approve it. | nothing new to build on
row 3 done | Both replays printed one linked PR under `Open PR to gate:` and handed its origin URL to the single-PR gate without a pause or a pasteable line. | Reuse the no-arg-discovery-single fixture to check the list and handoff when GH_REPO differs from origin.
row 4 done | Both models listed six PRs before the cap stop and three before the Claude Code stop; each stop opened with its stuck marker and ended with the rejection and one plain numbers line. | Reuse the no-arg-discovery-over-cap and no-arg-discovery-cc-multi fixtures to check list order and the stop message boundary.
row 7 done | Both models listed team-only PRs, named the viewer's team on a slug match, and said only `review requested` when no membership matched. | Reuse the no-arg-discovery-under-cap fixture to check that an unmatched team request stays in the admitted set without a membership claim.
row 8 done | Both models named the viewer's requested teams in the two-sentence opening on discovered and typed PRs, including alongside authorship or a direct request. | Reuse the role-line-team snapshots to check team disclosure after a same-head refresh without replaying discovery or menus.
row 9 done | Both models said team memberships could not be read and named both requested teams in order without claiming either belonged to the viewer. | Reuse the team-unreadable assertion in gatekeep-comment-reconcile.test.mjs to check the fallback when memberships cannot be read.
