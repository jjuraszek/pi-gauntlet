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

Pi harness; parallel.maxTasks 4; viewer login alex. `git remote get-url origin` returns `git@github.com:acme/widgets.git`; `gh api user --jq .login` returns alex. `gh api user/teams` succeeds with an empty list. Origin's default-branch overrides set `tracker: github`. Current branch has unrelated PR 999. Both open-list queries exit 0. All rows below are complete command outputs.
GH_REPO=other/project; gh default also names other/project.

Author query rows:
```json
[{"number":101,"isDraft":false,"reviewDecision":"REVIEW_REQUIRED","additions":1,"deletions":1,"url":"https://github.com/acme/widgets/pull/101","title":"Retry slow requests","author":{"login":"alex"},"headRefName":"retry","closingIssuesReferences":[],"reviewRequests":[],"body":"Raise the default retry timeout.","linearRefs":[]}]
```
Review-requested query rows:
```json
[]
```

## Entry

Start at argument resolution. Render the messages the human sees and name the next step. Stop at the single-PR handoff, before gathering or provisioning. Treat these synthetic observations as command results; execute nothing.
