bundle+: skills/gatekeep-pr/review-baseline.md
bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
bundle-: skills/finishing-a-development-branch/reference/commit-message.md
## Entry

Render only the recommendation sentence and first menu for each of the three independent checkpoints below. Start each checkpoint with its gate line and put its case label outside that message. The first report's problems and note preview have already been displayed. Do not repeat them or narrate note preparation. No human has picked a row. Stop at each menu's hint; simulate no pick, helper, external write, repair, cleanup or rejection steps. Use the supplied validated findings rather than reviewing them again.

## Shared observations

PR 88 in example/widgets is OPEN at aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, base main. The completed assessment and pre-menu refresh agree on head, body and base. Exact-head CI is green, claims match, there are no comments, nits or ordinary blockers, and no contract proposal. course null, work_started false, reject_withdrawn false. The current checked rejection note has been saved and previewed, with its SHA-256 retained and reject.menu_open false. The rubric is the shipped baseline, with no overlay. maxFixRounds is 5. Every listed approach conflict remains a blocker with an instead remedy that replaces its main mechanism; none has been overruled. Their promised outcomes are settled in the PR text, so repairing these blockers needs no author decision.

| Checkpoint | Completed menu state and permissions | Open approach blockers in report order |
|---|---|---|
| A | initial; viewer is the human author; WRITE, head pushable, helpers present; draft PR | Second mechanism: a separate catalog copy for indexing breaks the catalog's one-owner rule in docs/architecture.md:12; instead remove the copy and consume the existing change feed. Weakened guard: an alternate import entry bypasses the validation required in docs/imports.md:9; instead use the validated entry. |
| B | initial; viewer is the human author; WRITE, head pushable, helpers present; non-draft | Needless machinery only: an export queue, scheduler and worker serve on-demand downloads; extending the existing export handler to stream the same download preserves the outcome without a queue. Instead remove the queue and stream from that handler. |
| C | obstacle on the first report; viewer is another author's requested reviewer with READ, cannot close or push, helpers absent; non-draft; GitHub reports BLOCKED without eligible bypass or a local repair of that merge restriction | Architecture boundary: an indexing job writes directly to the catalog's private table, contrary to docs/architecture.md:21; instead consume its public change feed. Posting the conflict to the author remains possible. |

All base paths above were checked on origin/main. A and B are MERGEABLE except for their open approach blockers, which withhold merging. In C, BLOCKED is an additional merge withhold, not a reason to suppress the design conflict.

## Arguments

`88`
