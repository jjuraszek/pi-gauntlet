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

Run B (independent): `97`

## Digest

Both runs use pi, origin `git@github.com:acme/widgets.git`, and `parallel.maxTasks` 4. The viewer login read returns `alex`; the team read returns `acme/reviewers`. Origin's default branch resolves and has no tracker override. No worktree exists for any of the PRs.

Run A: the roster passes admission. The parent run folder can be created. Here are the two successful gather results, in argument order:

```json
[
  {"number":112,"author":{"login":"pat"},"headRefOid":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","headRefName":"settings","baseRefName":"main","isCrossRepository":false,"headRepository":{"name":"widgets"},"state":"OPEN","files":[{"path":"settings.js"}],"url":"https://github.com/acme/widgets/pull/112","title":"Centralize settings reads","body":"Use one resolver for settings.","additions":300,"deletions":80,"closingIssuesReferences":[{"number":22,"url":"https://github.com/acme/widgets/issues/22","repository":{"name":"widgets","owner":{"login":"acme"}}}],"reviewRequests":[],"linearRefs":[]},
  {"number":101,"author":{"login":"alex"},"headRefOid":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","headRefName":"gh-45-retry","baseRefName":"main","isCrossRepository":false,"headRepository":{"name":"widgets"},"state":"OPEN","files":[{"path":"retry.js"}],"url":"https://github.com/acme/widgets/pull/101","title":"Retry slow requests","body":"Raise the default retry timeout.","additions":3,"deletions":1,"closingIssuesReferences":[],"reviewRequests":[],"linearRefs":[]}
]
```

Run B: Section A is already in context. The first PR view succeeds and returns open PR #97 at https://github.com/acme/widgets/pull/97 by `robin` on branch `csv-export`, titled `Export the widget list`, description `Add a CSV export button.`, additions 40, deletions 12. Use the view's URL as the repository source in Run B; only Run A's admission uses a separate origin-URL lookup. The pending request is `{"__typename":"User","login":"alex"}`; closing references are empty. For Run B's Ticket display, the default-branch ref is `origin/main` and none of the three override paths exists. No ticket is named.

## Entry

Start each invocation from its arguments. Narrate through the gather, render the messages the human sees before provisioning, then name the next step. Delimit each visible list reply with a line containing only `---` immediately before its heading and immediately after its last entry, with no blank lines inside those delimiters. Put narration and labels outside these delimiters. Between the `Run B:` heading and the opening list delimiter, put only one fenced `bash` block listing every pre-list shell call in order, one command per line with no comments. Use the full fixed commands with `97` as the PR-view token and `origin/main` and the literal paths for any override reads. On the very next line after Run B's closing delimiter, with no intervening blank line, write `Paired call:` followed by the paired call's bare shell command in inline code, without the tool name or a JSON wrapper. Keep that call and the initialization steps in workflow order in the narration. Stop before provisioning; do not provision, dispatch, or render a menu. Treat the observations as command results; execute nothing.
