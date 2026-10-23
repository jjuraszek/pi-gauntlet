bundle+: skills/gatekeep-pr/reference/batch.md
bundle+: agents/pr-gatekeeper.md
## Arguments

`12 15 18`

## Observed snapshots

Pi, origin acme/widgets, viewer alex, parallel.maxTasks 8. Primary /tmp/widgets; installed procedure root /tmp/procedures/gatekeep-pr. Provisioning already completed serially; heads verified; no rebase requested. Worktrees /tmp/widgets-pr-12, /tmp/widgets-pr-15, /tmp/widgets-pr-18; retained records /tmp/state-12, /tmp/state-15, /tmp/state-18; supplied reports /tmp/report-12, /tmp/report-15, /tmp/report-18. Records have matching consent.target, PR identity and existing worktree, independent grants/counters. Files respectively [src/a.ts], [src/b.ts], [src/c.ts].

One fresh foreground assess batch returned: PR12 timeout, first error `helper timeout after 600s`, no closing result line; PR15 `FAILED - head not pushable: https://github.com/acme/widgets:feature/b`; PR18 `REPORT /tmp/report-18`. PR15 failed before Verify; PR18 completed fresh Verify then Review, source ci and zero blockers. Its verbatim report:
Delivers
The encoder accepts empty input.
Verdict: mergeable - all mechanisms match

PR18 is another author's PR with WRITE permission and CLEAN merge state; its ordinary menu offers merge, approve, reply, show evidence, stop. Failed PRs have no source/review count, so unknown. PR12/15 safe retry reads show empty status --porcelain and no rebase-merge or rebase-apply in the actual gitdir. The human picks retry12, stop15, reply18; for ordinary teardown the human says retain the tree. No writes occur before the corresponding selection. PR18's comment draft is already in its retained record.

Separate safety/provisioning probe snapshots, not extra results for the first batch: a failed PR12 with ` M src/a.ts` or rebase-merge present cannot safely retry. A fresh roster member PR21 initially has `failed - provisioning - foreign branch at default path`, with no child; after the human clears that obstacle, provision retry observes expected branch, clean tree, fast-forward-only and HEAD==headRefOid, allowing assess with the original record /tmp/state-21 and report /tmp/report-21.

## Entry

Narrate the result handling, summary, menus and queued picks, then the mixed next batch without inventing its output. Explain how the separate unsafe and provisioning snapshots change retry. Describe requests, not live tool execution.
