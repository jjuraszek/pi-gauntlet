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

Claude Code harness; parallel.maxTasks 4. `git remote get-url origin` returns `git@github.com:acme/widgets.git`; `gh api user --jq .login` returns alex. `gh api user/teams` succeeds with an empty list. Origin's default-branch overrides set `tracker: github`. The current branch has unrelated PR 999. The one list call exits 0. All list metadata is in hand; no metadata lookup remains after the sort.

Review-requested query rows:
```json
[
  {"number":112,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":3,"deletions":3,"url":"https://github.com/acme/widgets/pull/112","title":"Trim empty labels","author":{"login":"pat"},"headRefName":"trim-labels","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":101,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":1,"deletions":1,"url":"https://github.com/acme/widgets/pull/101","title":"Retry slow requests","author":{"login":"sam"},"headRefName":"retry","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":97,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":2,"deletions":2,"url":"https://github.com/acme/widgets/pull/97","title":"Show elapsed time","author":{"login":"robin"},"headRefName":"elapsed","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]}
]
```

## Entry

Start at argument resolution. First give a separate chronological trace: name the commands or file reads, mark where ticket links are resolved and where the final sort happens, and identify the first tool call after the sort and which reply carries it. Keep reply labels and call annotations in the trace. Follow the trace with exactly two horizontal rules (`---` on its own line with a blank line on each side), each introducing one reply's visible text only. End at rejection; execute nothing.
