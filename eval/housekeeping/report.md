# eval report: housekeeping (partial run: unpushed-amend-report)

for: 8b9fd810cb685cb2e6a423f06a14262d24de9c5ff89f02c0172513179b6f45c5

wall: 12s

refresh: complete; sample: unpushed-amend-report; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](results/unpushed-amend-report/candidate.json)

## Change

Separate specs from content checks and skip plan folders. Offer fully superseded specs in one Delete-or-Keep card in every run, with no Ticket choice or hotfix eligibility test. Recommend Keep when a tracked file outside the spec and plan dirs names a spec, otherwise Delete. State the deletion and the run's delivery, disclose outside readers and retain the text in git history. Keep ordinary directory and PR cards unchanged. Restrict Delete to accepted spec paths, verify their absence and preserve unrelated files and the in-place index. Review deletions against the spec rule without hotfix eligibility. Split no-argument runs after one status observation: dirt retains uncommitted selection and discloses commits ahead of the unfetched local ref; a clean checkout selects unpushed commits with amend delivery. Refuse unpushed selection after fetch failure, divergent ancestry, remote containment or a matching squash receipt. Fold kept unpushed classes into the last unpushed commit, preserving its parents and message and the pre-fold tree, without pushing. Refuse the fold when publication, receipts or unexpected primary state make it unsafe; restore class commits on a failed fold and report those classes open. Report folded classes under amended and name the before/after commit. Selected replays cover card checkpoints, a divergent unpushed stop and an amended report; scratch Git tests execute the fold and hook-failure restoration, while live selection, banner searches and deletion remain conformance reads.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| unpushed-amend-report | anthropic/claude-opus-5-5 | improved | 9972 | before-after: holds -> holds (held); no-push: holds -> holds (held); class-count: holds -> holds (held); spec-count: fails -> holds (unplanned improvement); marker: fails -> holds (unplanned improvement) |
| unpushed-amend-report | github-copilot/gpt-6.1-sol | improved | 12211 | before-after: fails -> holds (unplanned improvement); no-push: holds -> holds (held); class-count: holds -> holds (held); spec-count: fails -> holds (unplanned improvement); marker: fails -> holds (unplanned improvement) |

## Feedback

- unpushed-amend-report / anthropic/claude-opus-5-5: After keeps every fact Before kept and gains one: the new closing line "Specs searched for the banner: 0" makes spec-count hold, where Before said nothing about specs at all. That is an improvement, though it was not listed under Expected to move, so confirm it is intended. The line only just satisfies the fact, because it says "the banner" rather than "the superseded banner" and does not say specs were searched for the banner only; wording such as "Specs searched for the superseded banner only: 0" would make it unambiguous. The other three facts are, if anything, clearer in After: the "amended=2" marker and "Amended" heading replace Before's "commits=2" and "Commits" heading, which could be misread as two new commits on top; the separate "Before the fold" / "After the fold" lines name both commits in full; and "Pushed: nothing" is explicit alongside PRs and tickets none. Keep those three elements and the explicit "Open classes: none" line in any further rewording.
- unpushed-amend-report / github-copilot/gpt-6.1-sol: After loses no fact that Before kept, and it gains two, even though none were expected to move. The explicit Before/After pair under "Last unpushed commit" satisfies before-after, where Before named only the post-fold commit 2222… and never mentioned 1111…. The line "Specs searched for the banner only: 0." satisfies spec-count, where Before said nothing about specs. The `amended=2` marker and "Folded two classes into the last unpushed commit" also make class-count unambiguous; Before held only on its body text, because its `commits=2` marker could be read as two new commits left on top. no-push holds in both through "Nothing was pushed" and no PR, ticket or remote write claimed. To keep all of this, retain the `amended=N` marker, the before/after commit pair, the explicit "Nothing was pushed" sentence and the zero-count specs line even when specs are empty. After drops Before's explicit "No PRs, tickets or open classes" and "no files left unchecked / no checks skipped" lines; no fact here requires them, since the done marker implies no open classes, but restoring a one-line "No open classes; no PR or ticket created" would make no-push and class-count hold without relying on implication.

exit: 0
