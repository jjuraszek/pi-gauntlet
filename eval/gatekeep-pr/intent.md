for: 973c94dce36ea2d84d32ac2f4d3b7942ed1a3ea48c66f6ae71c9dba0ac23c7be

## Change

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, list it before reading CI runs, the diff or comments. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line.

## Expected to move

- no-arg-discovery-zero/f1: fails -> holds - Report an empty review queue in origin using @me when the login is unreadable.
- no-arg-discovery-single/f1: fails -> holds - Bind the single search to origin, exclude the viewer's own team-requested PR and list the other author's PR.
- no-arg-discovery-failed/f1: fails -> holds - Name the review-requested query when the result reaches its limit.
- list-send-if-missing/s1: fails -> holds - Show the typed PR in the reply carrying its first provisioning command when shell output was the only list.
- list-send-if-missing/s2: fails -> holds - Have the set parent show the linked list when earlier reply text contains only the pasteable line.
- typed-list-note/e1: fails -> holds - Show the set under a bold heading in typed order before provisioning.
- typed-list-note/e3: fails -> holds - Show the single PR under a bold heading before the substantive reads.
- no-arg-discovery-answered/f1: fails -> holds - Look up only the three surviving changes-requested PRs, in numeric order.
- no-arg-discovery-answered/f2: fails -> holds - List and route the re-requested PR and the PR with a later commit, but not the unanswered one.
- no-arg-discovery-answered/f3: fails -> holds - Use the first GitHub error line and print no list after a failed lookup.
- no-arg-discovery-answered/f4: fails -> holds - Stop before listing when a review lookup returns unreadable data.
- no-arg-discovery-answered/f5: fails -> holds - Stop before listing when a review connection has another page.
