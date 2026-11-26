# eval report: gatekeep-pr (partial run: plain-report)

for: 86ce8f841905b943733cd3646c98f214d90f5a291d8910b74c8a4a5a47797e56

wall: 0s

## Change

Report functionality-only coverage in plain-report, both in the opening and in the evidence mapping. Omit external observations and do not assign them an outcome.

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| plain-report | anthropic/claude-opus-5-5 | unchanged | 24752 | prose: holds -> holds (held); role: holds -> holds (held); sync: holds -> holds (held); scope: holds -> holds (held); findings: holds -> holds (held); standing: holds -> holds (held); language: holds -> holds (held); choices: holds -> holds (held) |
| plain-report | github-copilot/gpt-6.1-sol | unchanged | 23615 | prose: holds -> holds (held); role: holds -> holds (held); sync: holds -> holds (held); scope: holds -> holds (held); findings: holds -> holds (held); standing: holds -> holds (held); language: holds -> holds (held); choices: holds -> holds (held) |

## Feedback

- plain-report / anthropic/claude-opus-5-5: No fact moved in this case: After still delivers the functionality-only coverage in the two-sentence opening and in the evidence row mapping, with no external observation and no `not judged` outcome, and it keeps the markers, row-1 recommendations, role and prior-review counts, blockers, nit, comment reply and evidence hint that Before kept. None of the Expected-to-move facts belong to this case, so it shows nothing about them. A few After wordings sit close to the edge and are worth tightening. A's sync sentence says the rebase "was pushed", which the supplied sync record does not state, and it drops "no commits dropped"; say only that the branch was rebased onto main with one conflict in src/export.ts resolved and no commits dropped. The stop rows in A and C now say "remove the worktree", which no snapshot supplies and which is inconsistent with B's "leave the checkout as it is"; unless the skill's menu rules mandate that text, keep Before's "end the run without repairs and leave the PR as it is". B no longer says the PR is approved, a supplied standing fact that Before kept; restore it. Keep the standing sentence first in the second part, keep SHAs, run IDs, the log path and usage counters only in the show evidence response, and keep C's block described as GitHub's without naming a rule.
- plain-report / github-copilot/gpt-6.1-sol: No fact moved in this case: both outputs keep the three-part prose reports, author/reviewer role, sync prose, functionality-only scope rows, findings, standing, plain language and the marker/menu structure, and none of the Expected-to-move facts (discovery, list-send, typed-list, verify) are exercised here. After is slightly stronger on standing in A, because the running required unit check now sits in the standing sentence instead of a later paragraph; keep that. Three After wordings are close to the edge and worth tightening. First, the evidence response prints usage as dotted keys (`repair.rounds_used: 1`, `repair.rounds_cap: 4`) rather than the plain "1 of 4 rounds; 1 of 4 syncs" that Before used; it still conveys the counters, but have the inspection state "1 of 4" directly so the scope fact cannot fail on a stricter read. Second, B's "no local verification run was needed" is weaker than Before's "no local verification run is claimed"; say outright that the evidence is CI and not a local run. Third, C's "this actor" and "origin/main" in A's sync sentence lean towards internal vocabulary; "you" and "main" are safer for the language fact. The functionality-only coverage wording in the openings and the row mapping is fine as written and introduces no external observation or `not judged` outcome.

exit: 0
