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

Pi harness; parallel.maxTasks 4. `git remote get-url origin` returns `git@github.com:acme/widgets.git`; `gh api user --jq .login` returns alex. `gh api user/teams` succeeds with an empty list. Origin's default-branch overrides set `tracker: github`. The current branch has unrelated PR 999. Both open-list queries exit 0. All rows below are complete command outputs.

Author query rows:
```json
[
  {"number":104,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":5,"deletions":5,"url":"https://github.com/acme/widgets/pull/104","title":"Expire cached labels","author":{"login":"alex"},"headRefName":"expire-labels","closingIssuesReferences":[],"reviewRequests":[],"body":"","linearRefs":[]},
  {"number":88,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":4,"deletions":4,"url":"https://github.com/acme/widgets/pull/88","title":"Restore keyboard navigation","author":{"login":"alex"},"headRefName":"keyboard","closingIssuesReferences":[],"reviewRequests":[],"body":"","linearRefs":[]},
  {"number":101,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":1,"deletions":1,"url":"https://github.com/acme/widgets/pull/101","title":"Retry slow requests","author":{"login":"alex"},"headRefName":"retry","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":130,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":4,"deletions":4,"url":"https://github.com/acme/widgets/pull/130","title":"Hide archived widgets","author":{"login":"alex"},"headRefName":"archive","closingIssuesReferences":[],"reviewRequests":[],"body":"","linearRefs":[]},
  {"number":200,"isDraft":true,"reviewDecision":"REVIEW_REQUIRED","additions":1,"deletions":1},
  {"number":201,"isDraft":false,"reviewDecision":"APPROVED","additions":1,"deletions":1}
]
```
Review-requested query rows:
```json
[
  {"number":112,"isDraft":false,"reviewDecision":null,"additions":3,"deletions":3,"url":"https://github.com/acme/widgets/pull/112","title":"Trim empty labels","author":{"login":"robin"},"headRefName":"trim-labels","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":97,"isDraft":false,"reviewDecision":"","additions":2,"deletions":2,"url":"https://github.com/acme/widgets/pull/97","title":"Show elapsed time","author":{"login":"robin"},"headRefName":"elapsed","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":101,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":1,"deletions":1,"url":"https://github.com/acme/widgets/pull/101","title":"Retry slow requests","author":{"login":"alex"},"headRefName":"retry","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"","linearRefs":[]},
  {"number":202,"isDraft":false,"reviewDecision":"CHANGES_REQUESTED","additions":1,"deletions":1}
]
```

## Entry

Start at argument resolution. Render only what the human sees, separating messages with a horizontal rule. End at rejection; execute nothing.
