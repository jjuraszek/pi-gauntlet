# eval report: gatekeep-pr (partial run: prior-review-same-head)

for: 12f1102141382cc5a0a1b28b674d2988348ea450c306e8f161aa51be3815289f

wall: 103s

## Change

Append the no-commits-since suffix to nonempty same-head prior-review addressed counts, including items resolved by green CI or corrected descriptions without a commit. Exercise the existing empty-delta reviewer dispatch and explicit item closure on both harnesses. Keep the zero-item report form unchanged.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| prior-review-same-head | anthropic/claude-opus-5-5 | improved | 20804 | s1: fails -> holds (unplanned improvement); s2: holds -> holds (held); s3: fails -> holds (unplanned improvement); s4: holds -> holds (held); s5: fails -> holds (intended change); s6: fails -> holds (intended change) |
| prior-review-same-head | github-copilot/gpt-6.1-sol | improved | 21448 | s1: holds -> holds (held); s2: holds -> holds (held); s3: fails -> holds (unplanned improvement); s4: holds -> holds (held); s5: fails -> holds (intended change); s6: fails -> holds (intended change) |

## Feedback

- prior-review-same-head / anthropic/claude-opus-5-5: After delivers the Change cleanly: both reports now print exactly one `Prior review: N of 2 items addressed - no commits since 2222222` line in the right position (above Blockers in checkpoint 1, above the mergeable Verdict in checkpoint 2), and nothing that Before kept was lost - verification still precedes review in the worktree on the assessed head, R1 closes only on the explicit resolved line, and R2 stays an open blocker with its posted text and src/caller.mjs:19 locator. After also repaired two facts Before had already broken: Before fell back to reviewing the whole PR diff (`origin/main...2222…`) and supplied raw empty `git diff` output as the Fix delta, whereas After's `## Fix delta` is exactly `no commits since 2222222 - no code diff`, computes the path union with name-only commands only, and explicitly forbids base...head substitution on both pi and Claude Code. The wording to preserve is the pairing of `delta: ancestor` on the equal-commit pair with the single-line same-head delta and the 'verify each listed item against the current head, review no diff' instruction, plus rendering the open prior item in the Blockers list with its original posted sentence rather than a paraphrase; keep that combination and the suffix rule as written, and the zero-item report form (no Prior review line) remains untouched as intended.
- prior-review-same-head / github-copilot/gpt-6.1-sol: After delivers the Change cleanly and regresses nothing: both reports now print exactly one `Prior review: N of 2 items addressed - no commits since 2222222` line in the right position (above Blockers in the fixable report, above the mergeable Verdict in the second), while selection of review 702, the ancestor treatment, verify-before-review ordering, and explicit-closure-only integration all remain intact. After also fixes s3, which Before already failed in two ways - Before left the Fix delta section literally empty instead of carrying `no commits since 2222222 - no code diff`, and it handed the reviewer the gathered whole PR patch with a 'current source behind the whole PR' scope, which is exactly the base...head substitution the fact forbids; After instead populates the delta sentinel, lists the path-union commands, and states 'review no new diff and never substitute the gathered base-to-head patch' on both the pi task and the Claude Code prompt. Two cosmetic points worth tightening so the report form stays consistent across checkpoints: the first report's `gauntlet:` header is detached at the very top of the narration rather than adjacent to its report, and the second report's header is in its own fenced block while the body is plain prose - rendering each report as a single contiguous block (as Before did) would make the 'exactly one line directly above' structure unambiguous to a reader without changing any of the wording that moved s5 and s6.

exit: 0
