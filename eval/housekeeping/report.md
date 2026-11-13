# eval report: housekeeping (partial run: pr-card-no-ticket)

for: b72c67ad512f1876def46fcb199705e402f68ea33e48e1e2b7e6ca68c3860b03

wall: 13s

## Local shape check

The selected run made two replay calls and two judge calls, with no confirmation; both saved judgments are unchanged. `timeout -k 30 60 node --test eval/housekeeping/card-shape.test.mjs` still fails: the `anthropic/claude-opus-5-5` reply ends What was found with two bulleted file paths, violating the prose-only assertion. The reported eval exit below is not a pass for this local check. The other eleven `eval/housekeeping/*.test.mjs` files pass all 26 selected tests. No skill wording or test assertion changed; coverage remains limited to this checkpoint, and `intent.md` still requires ordinary PR cards to stay unchanged.

## Change

Separate specs from content checks and skip plan folders. Offer fully superseded specs in one Delete-or-Keep card in every run, with no Ticket choice or hotfix eligibility test. Recommend Keep when a tracked file outside the spec and plan dirs names a spec, otherwise Delete. State the deletion and the run's delivery, disclose outside readers and retain the text in git history. Keep ordinary directory and PR cards unchanged. Restrict Delete to accepted spec paths, verify their absence and preserve unrelated files and the in-place index. Review deletions against the spec rule without hotfix eligibility. Split no-argument runs after one status observation: dirt retains uncommitted selection and discloses commits ahead of the unfetched local ref; a clean checkout selects unpushed commits with amend delivery. Refuse unpushed selection after fetch failure, divergent ancestry, remote containment or a matching squash receipt. Fold kept unpushed classes into the last unpushed commit, preserving its parents and message and the pre-fold tree, without pushing. Refuse the fold when publication, receipts or unexpected primary state make it unsafe; restore class commits on a failed fold and report those classes open. Report folded classes under amended and name the before/after commit. Selected replays cover card checkpoints, a divergent unpushed stop and an amended report; scratch Git tests execute the fold and hook-failure restoration, while live selection, banner searches and deletion remain conformance reads.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-card-no-ticket | anthropic/claude-opus-5-5 | unchanged | 5382 | two-picks: holds -> holds (held); same-pr-commit: holds -> holds (held); fix-available: holds -> holds (held); selected-only: holds -> holds (held); no-execution: holds -> holds (held); card-prose: holds -> holds (held); marker: holds -> holds (held) |
| pr-card-no-ticket | github-copilot/gpt-6.1-sol | unchanged | 5786 | two-picks: holds -> holds (held); same-pr-commit: holds -> holds (held); fix-available: holds -> holds (held); selected-only: holds -> holds (held); no-execution: holds -> holds (held); card-prose: holds -> holds (held); marker: holds -> holds (held) |

## Feedback

- pr-card-no-ticket / anthropic/claude-opus-5-5: No fact moved: After still shows one unanswered card with Fix and Ignore in order, empty boxes, a single recommended pick, findings limited to the two changed import lines, and a last section stating the literal deletion and the one commit pushed to feature/widget-colors, which matches the Change's intent to leave ordinary PR cards untouched. Two small wording points are worth tightening to keep card-prose safe: the After title '2 unused imports in src/widgets are never used' is redundant (unused ... never used) and leans on the term 'import' before it is defined, whereas Before's '2 lines in the widget files load code that is never used' used a plainer noun and predicate; and After dropped Before's sentence that no separate test runs for this change, which was a useful disclosure for a read check with no regression command. Keeping the plain title form and that disclosure, while retaining After's 'No new pull request is opened' line, would preserve everything Before held.
- pr-card-no-ticket / github-copilot/gpt-6.1-sol: No fact moved, which matches the expectation that none should: After keeps the same title shape (count, plain noun, place, plain predicate), the same three everyday-prose sections, the same two numbered picks in Fix-then-Ignore order with empty boxes and a single recommended label on Fix, and the same promise of one commit for the class pushed to the existing PR branch, with no claim of anything executed. The differences are cosmetic rewordings ("not needed" for "unnecessary", "bring in names" for "import a name", "Verification is by reading the files; no test command is attached" for "No regression command is attached to this read-only check"), and they read slightly plainer without losing the literal change or the pushed commit. To keep this stable while delivering the spec-deletion and unpushed-fold changes, keep the new Delete-or-Keep card and amend-delivery wording scoped strictly to superseded-spec cards and no-argument clean-checkout runs, and state explicitly that ordinary PR cards keep the Fix/Ignore picks, the single recommended label, the commit-push Fix row naming the existing PR branch, and Fix availability when no regression command is attached to a read check.

exit: 0
