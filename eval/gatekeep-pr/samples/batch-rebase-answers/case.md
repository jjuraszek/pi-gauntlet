bundle+: skills/gatekeep-pr/reference/batch.md
bundle+: agents/pr-gatekeeper.md
## Arguments

Each independent invocation below uses a PR set with `--rebase main` in pi on origin acme/widgets. These are task snapshots from separate parent confirmations, NOT different answers to one shared question for equivalent candidates.

## Observed task snapshots

Every task has mode assess, skill gatekeep-pr, fresh foreground context, cwd /tmp/widgets-pr-N, record /tmp/state-N, report /tmp/report-N, installed procedure root /tmp/procedures/gatekeep-pr, and provisioned-HEAD/fetch/gitignore instruction. All records already match the PR/repo/base and retain their fields. All provisioning completed serially. No child asks the human.

A: PR12 is another author's eligible linear branch. In invocation A the parent's single eligible-candidate confirmation received no; task12 carries `rebase confirmation: no`. Tree clean, pushable, evidence ci, Review finds no blocker. No sync has run yet.

B: PR15 is another author's eligible linear branch in invocation B, whose shared parent confirmation received yes; task15 carries `rebase confirmation: yes`. Base exists, baseline equals pre_head, helper facility available. Rebase encounters a resolvable conflict; fresh implementer resolves only conflicted files, fresh reviewer returns no finding. Lease push succeeds; refreshed digest binds Verify then Review to pushed head. They return ci evidence and no blockers.

C: PR18 in invocation C has `rebase confirmation: not asked` because it is alex's own branch. Sync precondition reports `permissions.head_pushable: false`, head URL https://github.com/acme/widgets, ref feature/locked. Sync terminal stop before Verify, no report. Tree remains clean, no rebase operation; retry checks are safe.

Additional parent eligibility reads in a separate set: same-author PR21 needs no confirmation; other-author PR24 already contains origin/main (merge-base ancestor exits 0), so no-op; other-author PR27 contains a merge commit (rev-list --merges nonempty), so skipped. With only these three there are no eligible other-author candidates.

## Entry

Narrate each task's sync decision and expected closing result form, then the parent menu for failed18. Describe helper/review/lease binding for yes15 and the parent confirmation eligibility for the additional set. This is request narration from snapshots, not tool execution; do not invent a different shared answer within any invocation.
