# eval report: housekeeping (partial run: commit-subject)

for: 84c473acaabe97403eb60ee62b9c23b7496765acd8a7c0981d738e5078535363

wall: 36s

## Deterministic fold check

`timeout -k 30 120 node --test scripts/routine-commit-message.test.mjs` passes 23 checks. The extracted amend command failed the raw-message assertion on trailing spaces and blank lines with `--no-edit` alone; `--cleanup=verbatim` preserves those bytes, original parents and the pre-fold tree. The other checks pin routine callers' word sources, execute the spec heredoc, retain amendment audit fixtures and inspect saved message examples.

The fold-verbatim-message sample starts at the admitted pre-fold checkpoint and stops at the command. No model call, workflow replay, fetch or push ran. The commit-subject records and judgments below are preserved historical evidence: their full fix.md bundle and intent changed, so they are not current-bundle proof. Other housekeeping behavior is not re-proven.

## Change

Pass the shared wording reference and the card's ticket to each committing fix helper. Compose the class message from the card title, retaining file scope, one-commit and no-push boundaries. Run only commit-subject for this edit; its supplied observations cover payload and message composition, not live fixes or delivery. Preserve earlier results without claiming target-wide coverage.

Separate specs from content checks and skip plan folders. Offer fully superseded specs in one Delete-or-Keep card in every run, with no Ticket choice or hotfix eligibility test. Recommend Keep when a tracked file outside the spec and plan dirs names a spec, otherwise Delete. State the deletion and the run's delivery, disclose outside readers and retain the text in git history. Write card sections as prose without lists; keep ordinary directory and PR cards otherwise unchanged. Restrict Delete to accepted spec paths, verify their absence and preserve unrelated files and the in-place index. Review deletions against the spec rule without hotfix eligibility. Split no-argument runs after one status observation: dirt retains uncommitted selection and discloses commits ahead of the unfetched local ref; a clean checkout selects unpushed commits with amend delivery. Refuse unpushed selection after fetch failure, divergent ancestry, remote containment or a matching squash receipt. Fold kept unpushed classes into the last unpushed commit, preserving its parents and message and the pre-fold tree, without pushing. Refuse the fold when publication, receipts or unexpected primary state make it unsafe; restore class commits on a failed fold and report those classes open. Report folded classes under amended and name the before/after commit. Selected replays cover card checkpoints, a divergent unpushed stop and an amended report; scratch Git tests execute the fold and hook-failure restoration, while live selection, banner searches and deletion remain conformance reads.

## Preserved selected evidence

Only commit-subject was checked for this edit. The [pr-card-no-ticket replies and judgments](results/pr-card-no-ticket/candidate.json) remain unchanged: both model cells were unchanged with all seven facts holding at bundle a255ce178e136e2085a3930d220bc3e5ab17e4be2a44366cc537bb9744c53c5b. That historical result is not coverage of the current bundle.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| commit-subject | anthropic/claude-opus-5-5 | improved | 13244 | dispatch: fails -> holds (intended change); wording: fails -> holds (intended change); bounds: holds -> holds (held) |
| commit-subject | github-copilot/gpt-6.1-sol | improved | 16042 | dispatch: fails -> holds (intended change); wording: fails -> holds (intended change); bounds: holds -> holds (held) |

## Feedback

- commit-subject / anthropic/claude-opus-5-5: Both expected moves happened and nothing regressed. Dispatch moved because After resolves /package/skills/finishing-a-development-branch/reference/commit-message.md from the loaded skill directory and passes it as `wording:` beside `ticket: #241` and the card title, telling the helper to read the file, use its "Housekeeping class commit" recipe and never derive a ticket; Before passed no wording path and embedded a main-session-composed message instead. Wording moved because of the unreadable-reference fallback: After has the helper write one plain imperative sentence and continue, where Before ended with BLOCKED and committed nothing; the title-only subject, `Refs #241` in the body and the ticket-free no-ticket message were already present in Before. Bounds held in both: only test/cache.test.mjs is edited, the check stays `node --test test/cache.test.mjs`, there is exactly one commit and a clean tree, and no push, PR or ticket operation is delegated. To keep this robust, put the ban on starting other helpers inside the helper task text itself, since After states it only in the narrated boundaries list. Also say whether the fallback message still carries the supplied `Refs #241` body line, because After's fallback example drops it without saying so. Keep the explicit `Allowed files` line and the verbatim scoped check command, which are what hold the bounds fact.
- commit-subject / github-copilot/gpt-6.1-sol: Both expected moves happened and no fact regressed. After moves dispatch by passing `wording:` and `ticket: #241` as labelled fields with the card title, and by telling the helper to read the wording file and use its Housekeeping class commit recipe without deriving or fetching a ticket; Before passed the path but said the reference contained no wording rules and dictated the message itself. After moves wording by replacing Before's BLOCKED stop on an unreadable reference with a plain imperative sentence and an instruction to continue, while keeping the `Replace deprecated assertions` subject, `Refs #241` in the body and a bare subject for the no-ticket card. Bounds still holds in After, but less firmly than in Before. Before said `Edit only test/cache.test.mjs`, `Make exactly one commit` and `Start no helpers` outright. After relies on `allowed files:` plus generic branches for spec-superseded, in-place and "for a commit delivery", and it drops the explicit no-helpers line, so the fact holds only because nothing delegates helper spawning. To keep bounds safe, restore one concrete sentence for this class (edit only test/cache.test.mjs, commit exactly once, run no push, PR or ticket operation, start no helpers) and remove the branches that do not apply to this card. Also consider trimming the hard-coded `Refs #241` from the task so the helper composes it from the recipe and the ticket field rather than being handed the result.

exit: 0
