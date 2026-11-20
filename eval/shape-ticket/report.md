# eval report: shape-ticket (selected samples)

for: 1b18dfc61d0a4241388c5bde4e5bfff5a90e0546e3d7e6a67ef0cd46481e0ead

| Partial report | Verdict | What both candidate replies showed |
|---|---|---|
| [workflow-stage-proof-create](results/workflow-stage-proof-create/report.md) | unchanged | The create draft kept the missing-id error criterion verbatim and moved the CI-only criterion to the proposed Reporter note with its retired-proof label. |
| [workflow-stage-proof](results/workflow-stage-proof/report.md) | unchanged | Repair dropped standalone and bundled stage proof without losing the behavior; a ticket left with no criterion needed recovery or parking. |
| [pr-body-proof](results/pr-body-proof/report.md) | unchanged | The draft dropped the PR-description checklist, kept the release script's generated text as a behavior, and labeled the retired row in the note. |

Only these three step-4 samples ran. They test draft text with the shared class table in context, not tracker writes or the rest of the ticket workflow.
