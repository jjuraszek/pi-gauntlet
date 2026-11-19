for: b7d1d19e3f97043f57bcc7aa2658bff7f95f970de71669e65277ca254677ed87

## Change

Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing.

## Expected to move

- no-arg-discovery-answered/f1: fails -> holds - Look up only the three surviving changes-requested PRs, in numeric order.
- no-arg-discovery-answered/f2: fails -> holds - List and route the re-requested PR and the PR with a later commit, but not the unanswered one.
- no-arg-discovery-answered/f3: fails -> holds - Use the first GitHub error line and print no list after a failed lookup.
- no-arg-discovery-answered/f4: fails -> holds - Stop before listing when a review lookup returns unreadable data.
- no-arg-discovery-answered/f5: fails -> holds - Stop before listing when a review connection has another page.
