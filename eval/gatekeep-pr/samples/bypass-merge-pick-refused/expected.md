anonymized: true
- command: judged: E narrates exactly one merge attempt with --match-head-commit 2222222222222222222222222222222222222222, --rebase and --admin, not --squash or --auto.
- refusal: judged: E prints `GraphQL: Pull request merge refused by repository policy (mergePullRequest)` verbatim, consumes the selection, and makes no second merge attempt with or without the bypass flag.
- refresh: judged: E re-runs pre-menu refresh after the refusal, including viewer-relative eligibility and exact-head CI, before rendering the next menu.
- route: judged: E renders the final template with a fresh ordinary merge selection saying using your admin override, with required checks still binding, not merge queued, own merge, stuck, or blocked-by-GitHub withhold.
- vocabulary: judged: E names no rule as the cause of BLOCKED and does not invent an admin identity. The report explains GitHub requires an admin override and required checks passed, while raw viewerCanMergeAsAdmin, merge-state and review-decision fields stay in narrated mechanisms or show evidence, never a labeled Evidence line.
