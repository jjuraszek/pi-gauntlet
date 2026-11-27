# eval report: ship (selected sample only)

Both models met every candidate fact in [pr-body-integration](results/pr-body-integration/report.md) on the merged instructions. The sample checks the proposed PR bodies and create command, not live publication. All other samples retain their pre-rebase results; none were replayed.

Before the rebase, `pr-body-integration` was unchanged on both models: `offer`, `create` and `update` already held on the baseline. Its [saved candidate record](results/pr-body-integration/candidate.json) now contains the merged-instructions replay.

## Samples recorded before the rebase onto main and not replayed on the merged instructions

| Sample (saved candidate) | Outcome on both models |
|---|---|
| [choices-list-legs](results/choices-list-legs/candidate.json) | Both models improved on `home-list` and `bodies`: the shared menu included the companion's stand-in, and only its PR Summary repeated it. The later run also improved on `receipt-range`, reading the companion range from the recorded feature SHA. |
| [choices-list](results/choices-list/candidate.json) | Both runs improved on `register`, `disclosure` and `overflow`: the list explained choices in everyday words and kept each stand-in, even past the word limit. |
| [stand-in-linked-and-rework-body](results/stand-in-linked-and-rework-body/candidate.json) | Both models improved on `sole-entry`, `linked` and `rework`: the menu showed the single disclosure and the proposed bodies repeated it in the existing draft's Summary or the reworked PR's Rework block. |
| [digest-from-record-lines](results/digest-from-record-lines/candidate.json) | Both models improved on `source` and `digest`: they read commit bodies oldest first and kept repeated choices separate. The `menu` fact already held. |
