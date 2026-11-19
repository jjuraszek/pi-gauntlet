for: 90ad308eed39a63b6bcc8c4f893ae2d9d20edbaf70b91693fa04650bd7a1e575

## Change

Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, list it before reading CI runs, the diff or comments.

## Expected to move

- typed-list-note/e1: fails -> holds - Show the set under a bold heading in typed order before provisioning.
- typed-list-note/e3: fails -> holds - Show the single PR under a bold heading before the substantive reads.
- no-arg-discovery-answered/f1: fails -> holds - Look up only the three surviving changes-requested PRs, in numeric order.
- no-arg-discovery-answered/f2: fails -> holds - List and route the re-requested PR and the PR with a later commit, but not the unanswered one.
- no-arg-discovery-answered/f3: fails -> holds - Use the first GitHub error line and print no list after a failed lookup.
- no-arg-discovery-answered/f4: fails -> holds - Stop before listing when a review lookup returns unreadable data.
- no-arg-discovery-answered/f5: fails -> holds - Stop before listing when a review connection has another page.
