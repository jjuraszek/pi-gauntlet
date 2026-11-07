anonymized: true
- command: judged: E narrates exactly one merge attempt with --match-head-commit 2222222222222222222222222222222222222222, --rebase and --admin, not --squash or --auto.
- refusal: judged: E prints `GraphQL: Pull request merge refused by repository policy (mergePullRequest)` verbatim, consumes the selection, and makes no second merge attempt with or without the bypass flag.
- refresh: judged: E re-runs pre-menu refresh after the refusal, including viewer-relative eligibility and exact-head CI, before rendering the next menu.
- route: judged: E renders the final template with a fresh ordinary merge selection on ruleset bypass authority and CI evidence stands, not merge queued, own merge, stuck, or blocked-by-GitHub withhold.
- vocabulary: judged: E names no rule as the cause of BLOCKED and never calls the viewer an admin. The GitHub field viewerCanMergeAsAdmin and gh flag --admin appear only as narrated execution mechanisms, not user-facing report or menu labels. The canonical Evidence locator `merge_state_status BLOCKED (bypass eligible; reviewDecision REVIEW_REQUIRED)` and digest-field narration are allowed.
