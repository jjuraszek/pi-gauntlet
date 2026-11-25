bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/menus.md
bundle-: skills/gatekeep-pr/reference/findings.md
bundle-: skills/gatekeep-pr/reference/post-selection-loop.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
bundle-: skills/gatekeep-pr/reference/reject.md
bundle-: skills/gatekeep-pr/reference/assessment.md
bundle-: skills/gauntlet/menu-layout.md
bundle-: skills/gauntlet/commit-message.md
## Arguments

No token for A, B, C and E. `123` for D.

## Digest

Each snapshot is a separate run. Discovery or the typed argument has already selected PR #123 in acme/widgets. The PR rejects empty widget names; this covers its stated scope. No work is deferred. Author: sam. The pre-menu refresh succeeded without a head change. No blockers, comments or prior review.

A: viewer.login alex; viewer.teams ["ACME/reviewers"]. Pending reviewRequests in API order: Team acme/reviewers, User robin.

B: same as A, except the viewer's teams read failed (viewer.teams unreadable), and the pending requests are Team acme/reviewers, Team acme/platform.

C: same as A, with User ALEx added to the pending requests before the Team entry.

D: same digest as A, entered by typed number rather than discovery.

E: same as A, except alex is also the PR author and the teams read includes acme/platform. Pending requests in order: Team acme/platform, User robin, Team acme/reviewers.

## Entry

Start each snapshot at the report opening, after the supplied refresh. Render just that opening for each labeled snapshot. Stop before the standing sentence. Do not replay discovery, gather or menus.
