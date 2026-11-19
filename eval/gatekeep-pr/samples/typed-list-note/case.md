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

Run A: `112 101`

Run B (independent): `https://github.com/acme/gadgets/pull/97`

## Digest

Both runs use pi, origin `git@github.com:acme/widgets.git`, and `parallel.maxTasks` 4. The viewer login read returns `alex`; the team read returns `acme/reviewers`. Origin's default branch resolves and has no tracker override. No worktree exists for any of the PRs.

Run A: the PR metadata reads return these two results, in argument order:

```json
[
  {"number":112,"author":{"login":"pat"},"headRefOid":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","headRefName":"settings","baseRefName":"main","isCrossRepository":false,"headRepository":{"name":"widgets"},"state":"OPEN","files":[{"path":"settings.js"}],"url":"https://github.com/acme/widgets/pull/112","title":"Centralize settings reads","body":"Use one resolver for settings.","additions":300,"deletions":80,"closingIssuesReferences":[{"number":22,"url":"https://github.com/acme/widgets/issues/22","repository":{"name":"widgets","owner":{"login":"acme"}}}],"reviewRequests":[],"linearRefs":[]},
  {"number":101,"author":{"login":"alex"},"headRefOid":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","headRefName":"gh-45-retry","baseRefName":"main","isCrossRepository":false,"headRepository":{"name":"widgets"},"state":"OPEN","files":[{"path":"retry.js"}],"url":"https://github.com/acme/widgets/pull/101","title":"Retry slow requests","body":"Raise the default retry timeout.","additions":3,"deletions":1,"closingIssuesReferences":[],"reviewRequests":[],"linearRefs":[]}
]
```

Run B: Section A is already in context. The first PR view returns open PR #97 at https://github.com/acme/gadgets/pull/97 by `robin` on branch `csv-export`, titled `Export the widget list`, description `Add a CSV export button.`, additions 40, deletions 12, and head `cccccccccccccccccccccccccccccccccccccccc`. The pending request is `{"__typename":"User","login":"alex"}`; closing references are empty. The default-branch read returns `origin/main`; none of the three override paths exists.

## Entry

Start each invocation from its arguments. Trace through Gather if reached, then name the next step; do not go into provisioning, dispatch, or menus. For each visible reply, show its full text between lines containing only `---`, without inserting blank lines at the boundaries. Put narration and labels outside those delimiters. Write the `Run B:` heading with nothing after the colon. Immediately after that heading, show any shell calls preceding the first visible reply in one fenced `bash` block, one full command per line with no comments. Spell the PR-view token without shell quotes and write actual refs and paths in any override reads. Immediately after each closing delimiter, write `Paired call:` followed by the attached call in inline code (bare shell command for shell calls, no JSON wrapper), or `none` if no call is attached. Keep all steps in chronological order. Treat the observations as command results; execute nothing.
