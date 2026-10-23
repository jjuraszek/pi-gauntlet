# eval report: gatekeep-pr (partial run: batch-cleanup-stop)

for: 67d5913a76bde6e6d1ebf08eab1f23429b3a884fef11913e8a670f4c30b2fb91

wall: 93s

## Change

Route sets of two or more PR numbers or URLs before the single-PR steps through the pi-only batch procedure. Preserve zero/one-PR behavior and existing sample facts. Assess each PR in an isolated fresh child, summarize results, collect unchanged per-PR menus in roster order, and execute queued picks independently in the next foreground batch. Exercise isolated failures/retry, supplied rebase answers, cleanup and stop with retained authority, and parent-owned terminal posts/evidence after worktree removal.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| batch-cleanup-stop | anthropic/claude-opus-5-5 | unchanged | 19805 | c1: holds -> holds (held); c2: holds -> holds (held); c3: holds -> holds (held); c4: holds -> holds (held); c5: holds -> holds (held); c6: holds -> holds (held) |
| batch-cleanup-stop | github-copilot/gpt-6.1-sol | unchanged | 31358 | c1: holds -> holds (held); c2: holds -> holds (held); c3: holds -> holds (held); c4: holds -> holds (held); c5: holds -> holds (held); c6: holds -> holds (held) |

## Feedback

- batch-cleanup-stop / anthropic/claude-opus-5-5: After keeps every fact Before kept: validation of both records precedes any consequence, cleanup12 runs ownership/guard, destroy-from-primary, branch delete, ff-only pull, then the ordered overrides with the null-issue skip reason, an unleveled release that pauses the loop, and notify explicitly gated on release completion; stop15 resets to bbbbbbb with exact HEAD and empty-status assertions and deletes only PR15's files before retiring it; the terminal round handles show evidence in place and runs the post from /tmp/widgets with no child, no compare-and-swap, and successful-post suppression; stop21 only offers teardown naming ddddddd and eeeeeee, and execute24 refreshes, sends nothing, and returns a fresh report. Two wording points worth tightening so the batch route stays unambiguous: in stop15 step 3 After paraphrases the teardown offer ('states that no unpushed fix commits remain') rather than showing the leave-or-discard question and that the parent waits on it before step 4 — restoring Before's 'I wait for the human's leave-or-discard answer; on that handled exit, whichever answer' phrasing makes the human gate visible; and in the stop21 probe, After's added step 4 ('delete PR21's record... even if teardown is declined') should say 'only after the human's answer to the offer' in the same sentence as the deletion so a reader cannot mistake it for autonomous action. Otherwise the batch-procedure wording delivers the Change without moving any fact.
- batch-cleanup-stop / github-copilot/gpt-6.1-sol: No fact moved: After still sequences cleanup12 and stop15 after both child REPORTs and both picks, keeps the ownership/ancestry guards, recorded destroy from the primary, branch deletion, ff-only pull, the ordered overrides with the null-issue skip reason, the release pause blocking notify, cleanup_done with PR12 retained, the PR15 reset/assert/retire scoped to its own files, parent-owned evidence/post handling without a removed-cwd child or compare-and-swap, and the stale-reply24 / teardown-offer-only stop21 behavior. Two spots in After are weaker than Before and worth tightening so the batch-routing change stays unambiguous: (1) after the `gh pr comment` for PR12, After only says suppression is 'applied only after success' and never shows the re-rendered menu, whereas Before explicitly listed the follow-up menu as `show evidence` and `stop` with `stop` recommended—restore that explicit re-render line so c5's 're-renders with successful-post suppression' is visible rather than inferred; (2) After runs the `log origin/main..HEAD` and `merge-base --is-ancestor` eligibility checks with `-C /tmp/widgets-pr-12` instead of from the resolved primary as Before did, which is fine for c2 but slightly muddies the 'run from primary' story—prefer `git -C /tmp/widgets ... <PR12-local-HEAD>` like Before. Also consider keeping Before's concrete substituted notify command (PR12 URL and `aaaaaaa`) alongside the note that the URL comes from the record, so the substitution is shown rather than placeholdered.

exit: 0
