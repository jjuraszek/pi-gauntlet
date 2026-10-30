# eval report: gatekeep-pr (partial run: batch-summary-queue)

for: 56790d4fd3938d1894efbdf08b2cac55356a1951f9f4d2ea59d3dc2193ad9918

wall: 94s

## Change

Render one PR's report and menu per turn in the batch summary round: include the first PR with the summary, then collect each pick before presenting the next PR's report and menu instead of asking for all picks at once.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| batch-summary-queue | anthropic/claude-opus-5-5 | improved | 25173 | s1: holds -> holds (held); s2: holds -> holds (held); s3: holds -> holds (held); s4: holds -> holds (held); s5: holds -> holds (held); s6: fails -> holds (unplanned improvement); s7: holds -> holds (held); s8: fails -> holds (intended change) |
| batch-summary-queue | github-copilot/gpt-6.1-sol | improved | 30839 | s1: holds -> holds (held); s2: holds -> holds (held); s3: holds -> holds (held); s4: holds -> holds (held); s5: holds -> holds (held); s6: holds -> holds (held); s7: holds -> holds (held); s8: fails -> holds (intended change) |

## Feedback

- batch-summary-queue / anthropic/claude-opus-5-5: After delivers the Change cleanly: Turn 1 carries the summary plus only #12's verbatim report and menu, Turn 2 appears only after the #12 pick is recorded and queued, Turn 3 appears only after the #15 pick, and the parent never asks for a combined reply, which moves s8 (and the 'deliver12 queued before menu15' clause of s6) from fails to holds while keeping every fact Before held (fresh foreground batch envelope, single #18 confirmation, roster-order summary with CI-withheld merge for #15, #18 abort/clean/retry-then-stop with no fabricated report, verbatim reports, no non-sync write until all picks, PR-local course/caps/usage in batch 2). Two small wording inconsistencies in After are worth tightening so they don't later read as drift: the Turn 2 gauntlet line says `gate=gatekeep-pr/initial` while Turns 1 and 3 say `batch-summary` (use the same batch-summary gate for every per-PR turn in the round), and #18's child is said to close its `sync` stage as `skipped` right after recording `sync: failed` (say the stage closed `failed`, or just omit the stage-closure word). Otherwise keep the per-turn structure exactly as written: summary + first PR in Turn 1, 'The human replied N; the parent recorded and queued the pick' between turns, and the batch-2 description only after the final pick.
- batch-summary-queue / github-copilot/gpt-6.1-sol: After delivers the Change cleanly: the explicit 'First/Second/Third parent menu turn' headings, each carrying exactly one PR's verbatim report and menu, with the human pick and a 'Queued until all picks are collected (...)' line closing each turn before the next PR appears, make s8 unambiguously hold, whereas Before interleaved 'The human picks 2' between sections but never delineated turns, so a reader could not confirm that #12's menu turn carried no #15 or #18 menu. Nothing regressed: the single fresh report-mode batch envelope (s1), the one-time yes for 18 (s2), the roster-order summary with shared src/export.ts and #15's withheld merge (s3), PR18's abort/reset-then-clean recovery with retry-then-stop and hint-only evidence (s4), verbatim reports at their menu turns (s5), deferred execution with deliver12 queued before menu15 (s6), and the post-pick next batch with preserved courses, caps, usage and paths (s7) all survive. Two small suggestions to keep the facts robust: keep the per-turn 'Queued until all picks are collected' status line (it is what anchors s6 and s8 together), and consider restoring Before's more accurate #15 assess wording ('post nothing with no open blockers') rather than 'post the review to the PR', since a zero-blocker PR has nothing to post and a stricter reader could question whether the menu is honest about writes.

exit: 0
