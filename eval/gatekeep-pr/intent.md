for: 2099f36cb63122afd71e9e395178bbf2bb68072f9ddcaf4e587c54ce49f4d4ca

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. Keep `differs` for missing or changed ticket rows; neither result changes the judgment.

Report functionality-only coverage in plain-report, both in the opening and in the evidence mapping. Omit external observations and do not assign them an outcome. A spec path named inside the PR body's Integration block is not a contract candidate for the merge gate.

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Expected to move
- overrides-own-block-only/verify: fails -> holds - Combine the trusted shared command with the gate's local-verification policy.

- no-arg-discovery-over-cap/f1: fails -> holds - Finish ticket resolution before sorting and send the discovered roster with the batch instructions read before rejecting the set.
- no-arg-discovery-cc-multi/f1: fails -> holds - Finish ticket resolution before sorting and send the discovered roster with the stop-format instructions read before rejecting the set.
- no-arg-discovery-zero/f1: fails -> holds - Report an empty review queue in origin using @me when the login is unreadable.
- no-arg-discovery-single/f1: fails -> holds - Bind the single search to origin, exclude the viewer's own team-requested PR and list the other author's PR.
- no-arg-discovery-failed/f1: fails -> holds - Name the review-requested query when the result reaches its limit.
- list-send-if-missing/s1: fails -> holds - Show the typed PR in the reply carrying its first provisioning command when shell output was the only list.
- list-send-if-missing/s2: fails -> holds - Have the set parent show the linked list when earlier reply text contains only the pasteable line.
- typed-list-note/e1: fails -> holds - Show the set under a bold heading in typed order before provisioning.
- typed-list-note/e3: fails -> holds - Pair the single-PR list with the first remaining Gather read, not initialization, and reuse those reads in the rest of Gather.
- no-arg-discovery-answered/f1: fails -> holds - Look up only the three surviving changes-requested PRs, in numeric order.
- no-arg-discovery-answered/f2: fails -> holds - List and route the re-requested PR and the PR with a later commit, but not the unanswered one.
- no-arg-discovery-answered/f3: fails -> holds - Use the first GitHub error line and print no list after a failed lookup.
- no-arg-discovery-answered/f4: fails -> holds - Stop before listing when a review lookup returns unreadable data.
- no-arg-discovery-answered/f5: fails -> holds - Stop before listing when a review connection has another page.
