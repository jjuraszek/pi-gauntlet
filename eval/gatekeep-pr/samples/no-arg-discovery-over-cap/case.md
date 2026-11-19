bundle+: skills/gatekeep-pr/reference/batch.md
bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/menus.md
bundle-: skills/gatekeep-pr/reference/findings.md
bundle-: skills/gatekeep-pr/reference/post-selection-loop.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
bundle-: skills/gatekeep-pr/reference/report.md
bundle-: skills/gatekeep-pr/reference/reject.md
bundle-: skills/gatekeep-pr/reference/assessment.md
bundle-: skills/finishing-a-development-branch/reference/commit-message.md
## Arguments

`(no PR token)`

## Digest

Pi harness; parallel.maxTasks 4. `git remote get-url origin` returns `git@github.com:acme/widgets.git`; `gh api user --jq .login` returns alex. `gh api user/teams` succeeds with an empty list. Origin's default-branch overrides set `tracker: github`. The current branch has unrelated PR 999. The one list call succeeds; its complete post-jq result follows.

Review-requested query rows:
```json
[
  {"number":104,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":5,"deletions":5,"url":"https://github.com/acme/widgets/pull/104","title":"Expire cached labels","author":{"login":"pat"},"headRefName":"expire-labels","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":88,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":4,"deletions":4,"url":"https://github.com/acme/widgets/pull/88","title":"Restore keyboard navigation","author":{"login":"pat"},"headRefName":"keyboard","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":101,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":1,"deletions":1,"url":"https://github.com/acme/widgets/pull/101","title":"Retry slow requests","author":{"login":"sam"},"headRefName":"retry","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":130,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":4,"deletions":4,"url":"https://github.com/acme/widgets/pull/130","title":"Hide archived widgets","author":{"login":"sam"},"headRefName":"archive","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":200,"isDraft":true,"reviewDecision":"REVIEW_REQUIRED","additions":1,"deletions":1},
  {"number":201,"isDraft":false,"reviewDecision":"APPROVED","additions":1,"deletions":1},
  {"number":112,"isDraft":false,"reviewDecision":null,"additions":3,"deletions":3,"url":"https://github.com/acme/widgets/pull/112","title":"Trim empty labels","author":{"login":"robin"},"headRefName":"trim-labels","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":97,"isDraft":false,"reviewDecision":"","additions":2,"deletions":2,"url":"https://github.com/acme/widgets/pull/97","title":"Show elapsed time","author":{"login":"robin"},"headRefName":"elapsed","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":202,"isDraft":false,"reviewDecision":"CHANGES_REQUESTED","additions":1,"deletions":1,"url":"https://github.com/acme/widgets/pull/202","title":"Check label width","author":{"login":"sam"},"headRefName":"width","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]}
]
```

The #202 lookup exits 0 and returns `{"data":{"repository":{"pullRequest":{"latestOpinionatedReviews":{"pageInfo":{"hasNextPage":false},"nodes":[{"author":{"login":"pat"},"state":"CHANGES_REQUESTED","submittedAt":"2026-02-02T00:00:00Z"}]},"reviewRequests":{"pageInfo":{"hasNextPage":false},"nodes":[{"requestedReviewer":{"__typename":"User","login":"alex"}}]},"commits":{"nodes":[{"commit":{"committedDate":"2026-02-01T00:00:00Z"}}]}}}}}`. The review lookup block prints `unanswered`.

## Entry

Start at argument resolution. First give a separate chronological trace: name the commands or file reads, mark where ticket links are resolved and where the final sort happens, and identify the first tool call after the sort and which reply carries it. Keep reply labels and call annotations in the trace. After the trace, put a horizontal rule (`---` on its own line with a blank line on each side) before each reply's visible text. End at rejection; execute nothing.
