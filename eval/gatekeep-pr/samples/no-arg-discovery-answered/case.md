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

Pi, origin `acme/widgets`, viewer `alex`, teams `[]`, tracker `github`, set cap 8. Discovery's review-requested list call succeeded. All six PRs are open and by `jo`. The table is the complete projected result; links are `https://github.com/acme/widgets/pull/<number>`. Every retained row has zero deletions, head `widget`, empty body, no ticket references and a pending User request to `alex`.

| number | isDraft | reviewDecision | additions | title |
|---|---|---|---|---|
| 27 | false | CHANGES_REQUESTED | 5 | Restore widget colors |
| 31 | true | CHANGES_REQUESTED | 1 | - |
| 19 | false | CHANGES_REQUESTED | 9 | Show widget names |
| 38 | false | APPROVED | 2 | - |
| 22 | false | CHANGES_REQUESTED | 2 | Remove old widgets |
| 40 | false | REVIEW_REQUIRED | 3 | Sort widgets |

Main run: these are the fixed command observations for a review lookup when invoked. Use each block's supplied stdout and exit status; do not compute a classification. All three commands exit 0. For #22 the requester's later plain comment is not an opinionated review.

#19, stdout `answered`:
```json
{"data":{"repository":{"pullRequest":{"latestOpinionatedReviews":{"pageInfo":{"hasNextPage":false},"nodes":[{"author":{"login":"Alex"},"state":"CHANGES_REQUESTED","submittedAt":"2026-01-02T00:00:00Z"}]},"reviewRequests":{"pageInfo":{"hasNextPage":false},"nodes":[{"requestedReviewer":{"__typename":"User","login":"alex"}}]},"commits":{"nodes":[{"commit":{"committedDate":"2026-01-01T00:00:00Z"}}]}}}}}
```
#22, stdout `unanswered`:
```json
{"data":{"repository":{"pullRequest":{"latestOpinionatedReviews":{"pageInfo":{"hasNextPage":false},"nodes":[{"author":{"login":"pat"},"state":"CHANGES_REQUESTED","submittedAt":"2026-01-02T00:00:00Z"}]},"reviewRequests":{"pageInfo":{"hasNextPage":false},"nodes":[{"requestedReviewer":{"__typename":"User","login":"alex"}}]},"commits":{"nodes":[{"commit":{"committedDate":"2026-01-01T00:00:00Z"}}]}}}}}
```
#27, stdout `answered`:
```json
{"data":{"repository":{"pullRequest":{"latestOpinionatedReviews":{"pageInfo":{"hasNextPage":false},"nodes":[{"author":{"login":"pat"},"state":"CHANGES_REQUESTED","submittedAt":"2026-01-02T00:00:00Z"}]},"reviewRequests":{"pageInfo":{"hasNextPage":false},"nodes":[{"requestedReviewer":{"__typename":"User","login":"alex"}}]},"commits":{"nodes":[{"commit":{"committedDate":"2026-01-03T00:00:00Z"}}]}}}}}
```

Three isolated runs start with the same list. Replace only the #19 lookup observation in each:

- Failed call: `gh` exits 1 with empty stdout and stderr `HTTP 502: Bad Gateway` followed by `retry later` on a second line.
- Unreadable lookup: `gh` returns `{"data":{"repository":{"pullRequest":null}}}`, block stdout `malformed`, exit 1.
- Incomplete lookup: `gh` returns `{"data":{"repository":{"pullRequest":{"latestOpinionatedReviews":{"pageInfo":{"hasNextPage":true},"nodes":[]},"reviewRequests":{"pageInfo":{"hasNextPage":false},"nodes":[]},"commits":{"nodes":[{"commit":{"committedDate":"2026-01-01T00:00:00Z"}}]}}}}}`, block stdout `incomplete`, exit 1.

## Entry

Start each run with the complete list result in hand. Narrate each lookup in order by PR number, not its GraphQL or jq source. Show what the user reads, then the numbers sent to set routing, or the stop. End there, before set admission, gathering or provisioning.
