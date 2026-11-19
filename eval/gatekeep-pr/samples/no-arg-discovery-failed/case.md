bundle+: skills/gatekeep-pr/reference/batch.md
## Arguments

`(no PR token)`

## Digest

Pi harness; parallel.maxTasks 4; viewer login alex. `git remote get-url origin` returns `git@github.com:acme/widgets.git`; `gh api user --jq .login` returns alex. Current branch has unrelated PR 999. Each of three isolated invocations starts fresh. The one review-requested list call has these complete results:

Scenario A: exits 1, stderr first line `HTTP 503: Service Unavailable`, second line `try later`.
Scenario B: exits 0 at --limit 1000 with this deterministic inline family: exactly one object for each integer n=2000..2999 inclusive, {"number":n,"isDraft":true,"reviewDecision":"REVIEW_REQUIRED","additions":0,"deletions":0}. This describes all 1000 returned valid rows, not a truncated output.
Scenario C: exits 0 and prints `[{"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":1,"deletions":0}]` (an object without `number`).


## Entry

Start at argument resolution before tracker init, continuation minting, or provisioning; stop at discovery rejection. Narrate each isolated scenario separately and stop each at its error. Narrate only; these are synthetic text-only command observations, not tool execution.
