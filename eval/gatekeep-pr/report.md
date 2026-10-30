# eval report: gatekeep-pr (partial run: no-arg-discovery-failed)

for: 5e4657e3439fc47fb3523d19f52630eaae4c3f031be1d0e049824a213222093a

wall: 45s

## Change

Render one PR's report and menu per turn in the batch summary round: include the first PR with the summary, then collect each pick before presenting the next PR's report and menu instead of asking for all picks at once.

Exercise no-arg-discovery-over-cap, no-arg-discovery-single, no-arg-discovery-zero, no-arg-discovery-cc-multi, no-arg-discovery-failed and no-arg-discovery-under-cap for argument-resolution outcomes; exercise role-line-requested for refreshed pending relationships and report shape.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| no-arg-discovery-failed | anthropic/claude-opus-5-5 | improved | 12498 | f1: fails -> holds (intended change) |
| no-arg-discovery-failed | github-copilot/gpt-6.1-sol | improved | 8901 | f1: fails -> holds (intended change) |

## Feedback

- no-arg-discovery-failed / anthropic/claude-opus-5-5: Before narrated the right control flow (fail closed, no fallback to PR 999, no provisioning) but emitted its own ad hoc error strings — `author query exited 1 - HTTP 503...`, `returned 1000 rows at --limit 1000, so the open-PR list cannot be proven complete`, and `returned a row with no number field` — none of which match the contract strings in f1. After fixes this by printing exactly `discovery failed: HTTP 503: Service Unavailable`, `discovery failed: incomplete (author query hit --limit 1000)`, and `discovery failed: malformed gh pr list output`, and it explicitly states that B stops before the draft filter and that C stops before union/filter with no fallback, so f1 moves to holds. Nothing in After regressed relative to Before on this case; to keep it stable, keep the stop messages verbatim from the skill's discovery contract (quote only the first gh stderr line for the nonzero-exit case, use the fixed `incomplete (...)` and `malformed gh pr list output` strings) and retain the explicit 'no fallback to the current branch's PR' and 'stops before filtering' sentences rather than paraphrasing them.
- no-arg-discovery-failed / github-copilot/gpt-6.1-sol: Before fell back to `gh pr view` and resolved PR 999 in every scenario, never running the author query, so none of the three discovery-failure messages appeared and the current-branch fallback explicitly occurred. After now exercises the discovery contract: Scenario A stops on the first stderr line with the exact `discovery failed: HTTP 503: Service Unavailable`, Scenario B rejects the 1000-row result on count-equals-limit before draft filtering with the exact incomplete wording, and Scenario C rejects the row missing `number` with the exact malformed wording, and the closing paragraph states no minting, tracker init, provisioning, dispatch, or PR 999 fallback. Nothing regressed; to keep this stable, retain the verbatim error strings as standalone lines, the explicit 'before filtering' ordering in B, and the sentence that PR 999 is never used as a fallback, since those are the elements the fact checks most literally.

exit: 0
