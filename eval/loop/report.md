# eval report: loop (selected samples only)

Both replay models met every candidate must-hold in the four selected samples. These are text replays of supplied observations, not live dispatch or tracker evidence.

| Sample | Observed behavior |
|---|---|
| [tracker-boundary](results/tracker-boundary/report.md) | Both replies repaired rejected returns without a tracker call, including on resume. |
| [tracker-refresh](results/tracker-refresh/report.md) | Both replies kept the one seed call and projected the returned row before retry. |
| [tracker-verify](results/tracker-verify/report.md) | Both replies handled repair, conformance and reopened rows without an extra ledger list call. |
| [seed-dispositions](results/seed-dispositions/report.md) | Both replies seeded the acceptance rows without assigning Integration entries. |

## Earlier PR replay: verify-repair-count

This evidence predates the merged prompt; no replay was run for the merge.

for: f31a47d0342cb5b63d795cd11149958442665fca461837b49e87c48f2fde47db

wall: 121s

## Change

Retry a failed row below allowance and dispatch a row reopened during verify without seeking a second authorization. The two selected replays narrate routing, not live execution.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| verify-repair-count | anthropic/claude-opus-5-5 | improved | 24542 | budget: holds -> holds (held); reservation: holds -> holds (held); exhaustion: holds -> holds (held); interruptions: holds -> holds (held); resume: holds -> holds (held); gate: holds -> holds (held); reopened: fails -> holds (intended change); failed-cleanup: holds -> holds (held) |
| verify-repair-count | github-copilot/gpt-6.1-sol | improved | 28750 | budget: holds -> holds (held); reservation: holds -> holds (held); exhaustion: holds -> holds (held); interruptions: holds -> holds (held); resume: holds -> holds (held); gate: holds -> holds (held); reopened: fails -> holds (intended change); failed-cleanup: holds -> holds (held) |

## Feedback

- verify-repair-count / anthropic/claude-opus-5-5: Only `reopened` moved, and it moved in the intended direction. Before paused option 4 on a `gauntlet: question` with an `authorize row 2's return to ledger implementation` / `stop` menu ahead of the dispatch. After treats options 4 and 5 as identical up to dispatch and goes straight from refresh and the Before-each-dispatch rules to the one-task `tasks` call, then ledger-return closure and a rerun of the full gate set, with attempts 3 stopping under rule 2 and no tracker-only close. The other seven facts held in both outputs: the shared count across legs, the pre-reservation no-model stop, reservation and marker shape, the exhaustion stop with amend/stop only, interrupted recovery with same-turn continuation, resume at count 3 without a second bump or dispatch, the gate rerun order, and held-count failure passes. To keep this stable, keep the wording that says approval of the amendment already authorizes the reopened row's return, and that rule 2 is the only thing that stops it. Two spots in After are loose and worth tightening: the snapshot 5 aside `3, or 5 if both old retries are row 2's` hedges the effective allowance and could erode the attempts-3-at-allowance-3 stop, and the `S-MODEL` stop borrows the exhaustion layout with a new header, so state explicitly that it happens before any bump or reservation and offers amend/stop only. It would also help to say outright that the interrupted-repair marker commit has no body records, since both outputs satisfy that only by omission.
- verify-repair-count / github-copilot/gpt-6.1-sol: The only fact that moved is `reopened`, and it moved the intended way. Before made option 4 stop at an 'Authorize row 2's return' menu, while After has both options treat the approved re-bound as authorization and dispatch the row-2 `tasks` call in the same turn, with normal boundaries, verify still active, closure on disk and a full A/B/C rerun. Every fact Before held still holds in After, but several now hold by implication rather than by statement, and tighter wording would protect them. The repair task no longer says the log is passed by path 'not pasted output'. The interrupted marker commit no longer names its subject `Record a verification repair` or says it is parented on the saved home HEAD. Snapshot 5 no longer says the `tasks` call carries exactly one task, and it names the pre-dispatch boundaries only loosely as 'normal checks/allowance/target/escalation' without calling out the rule-2 allowance check, pending-tuple recovery and clean boundary. The attempts-3 stop is phrased as conditional ('exhausted only if effective allowance is 3') instead of plainly saying both options stop without dispatching. Restoring those explicit phrases would keep `reservation`, `interruptions`, `failed-cleanup` and `reopened` robust while still delivering the no-second-authorization change.

exit: 0
