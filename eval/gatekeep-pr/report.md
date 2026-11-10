# eval report: gatekeep-pr (partial run: pr-body-false-claim)

for: da59b6fec3f5471bab1b76d1733913ccc2c893bce674150c07a27540d8d13c86

wall: 129s

## Change

Put the recommended action first in every gatekeep-pr menu, including stop when it is recommended, and emit recommended=1 on the gate line. Preserve availability, numeric authority, and execution mechanics. Keep non-recommended stop last.

Recommend deliver for another author's PR when every blocker has a drafted repair needing no author decision, the head is pushable, and deliver is offered. Distinguish missing requirements, acceptance-criteria changes, and scope choices from drafted code or description repairs. Explain the recommendation above the prompt without granting write authority.

Select only pr-body-false-claim for this increment. Its other-author, description-only blocker exercises the repairable path and retains the decline, readback, local-evidence, and pending-evidence checks. Retain gate-line-first and all other saved results as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-false-claim | anthropic/claude-opus-5-5 | improved | 17522 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (held); f7: holds -> holds (held); f8: holds -> holds (held); recommendation: fails -> holds (intended change) |
| pr-body-false-claim | github-copilot/gpt-6.1-sol | improved | 16432 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (held); f7: holds -> holds (held); f8: holds -> holds (held); recommendation: fails -> holds (intended change) |

## Feedback

- pr-body-false-claim / anthropic/claude-opus-5-5: After delivers the Change cleanly: the initial menu now puts deliver on row 1 with [recommended], emits recommended=1 on the gate line, and places one prose sentence above Pick one tying the recommendation to the drafted, in-scope description repair that needs no author decision, while no body write or comment occurs until the human picks a number. Nothing regressed: A still prints the old-to-new preview under the blocker and writes only the review after a numeric pick; B still requires the compare-and-swap, readback, and description-recheck worker before clearing P1, preserves unrelated body text, and does not re-propose the correction on the unchanged refresh; description-only repair still dispatches no implementer, creates no commit, and runs no suite; C keeps source: local with the original log_path and D keeps source: pending and goes to the watch/obstacle path rather than treating the recheck as sufficient evidence. The reordering of later menus (stop first when recommended, approve before merge on the final menu) is consistent with the Change and did not move any fact. One small polish: in C's final menu, 'show evidence: /tmp/guard-log.synthetic' inside the show-evidence parenthetical reads slightly awkwardly; 'log /tmp/guard-log.synthetic' would be clearer while still surfacing the preserved path.
- pr-body-false-claim / github-copilot/gpt-6.1-sol: After moved only the intended fact: the initial menu now places deliver on row 1 with [recommended], emits recommended=1 on the gate line, and puts one prose sentence above Pick one tying the recommendation to the drafted, scope-preserving description repair, while A still writes nothing and keeps the compact old->new preview under the blocker. Before recommended assess purely because the PR belonged to someone else, which is exactly what the Change replaces. Everything else survived the rewording: B still does the pre-write snapshot, body-file edit, readback, and narrow description-recheck helper before closing P1 and shows no blocker on the next refresh; no file implementer, commit, or verification suite runs; C keeps the local evidence and /tmp/guard-log.synthetic without inventing CI; D keeps pending evidence and treats the helper's P1 resolved as description-only closure, then correctly puts recommended stop first and non-recommended rows after it. One small drift worth watching: the Delivers line changed from the PR title's "Reject unsigned events." to "Rejects unsigned events." — harmless here, but keep Delivers quoting the assessed intent verbatim so later readback/claim facts can't be argued either way. Otherwise the After wording delivers the Change with no regressions.

exit: 0
