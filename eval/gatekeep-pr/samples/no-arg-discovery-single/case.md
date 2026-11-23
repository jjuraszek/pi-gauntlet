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
bundle-: skills/gauntlet/commit-message.md
## Arguments

`(no PR token)`

## Digest

Pi harness; parallel.maxTasks 4; viewer login alex. `git remote get-url origin` returns `git@github.com:acme/widgets.git`; `gh api user --jq .login` returns alex. `gh api user/teams` returns `acme/reviewers`. Origin's default-branch overrides set `tracker: github`. Current branch has unrelated PR 999. The review-requested list exits 0. The viewer also authored #85, which requests review from the viewer's team; the list result below is complete.
GH_REPO=other/project; gh default also names other/project.

Review-requested query rows:
```json
[{"number":101,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":1,"deletions":1,"url":"https://github.com/acme/widgets/pull/101","title":"Retry slow requests","author":{"login":"pat"},"headRefName":"retry","closingIssuesReferences":[],"reviewRequests":[{"__typename":"User","login":"alex"}],"body":"Raise the default retry timeout.","linearRefs":[]}]
```

## Entry

Start at argument resolution. Name the list command with its origin and search arguments. Render the messages the human sees and name the next step. Stop at the single-PR handoff, before gathering or provisioning. Treat these synthetic observations as command results; execute nothing.
