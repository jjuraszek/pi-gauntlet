for: 81dfb8d623191b726dabf67453a8c97ecc3582810ce6f7c27d7d4c8b463c9abb

## Change

Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, list it before reading CI runs, the diff or comments. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line.

## Expected to move

- list-send-if-missing/s1: fails -> holds - Show the typed PR in the reply carrying its first provisioning command when shell output was the only list.
- list-send-if-missing/s2: fails -> holds - Have the set parent show the linked list when earlier reply text contains only the pasteable line.
- typed-list-note/e1: fails -> holds - Show the set under a bold heading in typed order before provisioning.
- typed-list-note/e3: fails -> holds - Show the single PR under a bold heading before the substantive reads.
- no-arg-discovery-answered/f1: fails -> holds - Look up only the three surviving changes-requested PRs, in numeric order.
- no-arg-discovery-answered/f2: fails -> holds - List and route the re-requested PR and the PR with a later commit, but not the unanswered one.
- no-arg-discovery-answered/f3: fails -> holds - Use the first GitHub error line and print no list after a failed lookup.
- no-arg-discovery-answered/f4: fails -> holds - Stop before listing when a review lookup returns unreadable data.
- no-arg-discovery-answered/f5: fails -> holds - Stop before listing when a review connection has another page.
