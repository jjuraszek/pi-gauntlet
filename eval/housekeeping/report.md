# eval report: housekeeping (partial run: unpushed-remote-ahead-stop)

for: daf8af197ba62b5ce63e53bb68509aeb89e0ffd2cf064e2a84761b296702c694

wall: 15s

## Change

Separate specs from content checks and skip plan folders. Offer fully superseded specs in one Delete-or-Keep card in every run, with no Ticket choice or hotfix eligibility test. Recommend Keep when a tracked file outside the spec and plan dirs names a spec, otherwise Delete. State the deletion and the run's delivery, disclose outside readers and retain the text in git history. Keep ordinary directory and PR cards unchanged. Restrict Delete to accepted spec paths, verify their absence and preserve unrelated files and the in-place index. Review deletions against the spec rule without hotfix eligibility. Split no-argument runs after one status observation: dirt retains uncommitted selection and discloses commits ahead of the unfetched local ref; a clean checkout selects unpushed commits with amend delivery. Refuse unpushed selection after fetch failure, divergent ancestry, remote containment or a matching squash receipt. Selected replays cover card checkpoints and a divergent unpushed stop, not live selection, banner searches or deletion; deterministic assertions pin selection and deletion authority outside those checkpoints.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| unpushed-remote-ahead-stop | anthropic/claude-opus-5-5 | improved | 8451 | commits: fails -> holds (unplanned improvement); ancestry-reason: fails -> holds (unplanned improvement); no-card: fails -> holds (unplanned improvement); run-folder: holds -> holds (held); marker: fails -> holds (unplanned improvement) |
| unpushed-remote-ahead-stop | github-copilot/gpt-6.1-sol | improved | 5592 | commits: fails -> holds (unplanned improvement); ancestry-reason: fails -> holds (unplanned improvement); no-card: fails -> holds (unplanned improvement); run-folder: fails -> holds (unplanned improvement); marker: fails -> holds (unplanned improvement) |

## Feedback

- unpushed-remote-ahead-stop / anthropic/claude-opus-5-5: Three facts moved from fails to holds even though none were expected to move, and no fact that Before kept was lost. Before treated the clean checkout as an empty uncommitted run ("done empty", "no files to check"), so it named neither hash, gave no ancestry reason and ended as empty. After's split of no-argument runs after the single status observation routes a clean checkout to unpushed selection, and its divergent-ancestry refusal produces the stuck stop. That stop names both full hashes, says origin/main is not an ancestor of HEAD, explains that an amend must not rewrite a commit the remote has moved past, presents no card or Fix/Ignore choice, and states that no checks or writes ran. The run folder is named in both outputs. To keep this, preserve the wording that makes the refusal state both commit ids, the ancestry reason tied to amend delivery, and the run folder line. Two small tightenings would help: have the stop call the run folder retained explicitly, and keep the "reconcile, then run again" advice clearly phrased as a new run so it is never read as continuing this one. The Results block is mostly "none" lines for a run that stopped at admission and could be shortened for this stop without affecting any fact.
- unpushed-remote-ahead-stop / github-copilot/gpt-6.1-sol: Before emitted only `gauntlet: done empty`, which names neither commit, gives no ancestry reason, omits the run folder, and ends as empty, so all four facts fail there. After moves all four to holds: the `stuck` line states that origin/main is not an ancestor of HEAD and that an amend must not rewrite a commit the remote has moved past, the bullets give both full hashes, 'No files checked; nothing changed' avoids any claim of checks or writes with no card or Fix/Ignore choices, and the run folder is named. Although nothing was listed as expected to move, these movements are all improvements and follow from the Change's divergent-ancestry refusal for unpushed selection. To keep this, retain the wording that requires the divergent stop to report both hashes, the ancestry reason, the no-checks/no-writes statement and the run folder path; consider making it explicit that the stop concerns the unpushed selection (e.g. 'unpushed run stops before checking or amending') and that the run folder is retained, so the ancestry-reason and run-folder facts hold without relying on reader inference.

exit: 0
