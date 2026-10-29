bundle+: skills/using-git-worktrees/reference/pr-head.md

# PR-head routing and provisioning

Override the replay's primary-checkout premise only where a row says linked. These are independent synthetic runs, not successive mutations. Use only compact tables and shared command/record legends, at most 1000 words total. Budget: discovery and success legend 300 words; provisioning rows 600 (at most 50 per row); history 100. Define ROOT/W and full SHA aliases once; use aliases in commands and records. Each row gives only its delta from the shared legend, including exact stop text and write boundary; do not repeat shared commands, reports, or prose introductions. No real tools or tracker calls.

This is an N=1 independent singleton PR run. Caller passes resolved PR values: acme/widget#82, headRefName=fix/retry, headRefOid=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, baseRefName=main, isCrossRepository=false, headRepository.nameWithOwner=acme/widget. ROOT=/work/widget; selected default home=/work/widget/.worktrees/fix-retry. Fetched origin/fix/retry equals the head; origin/main has full SHA bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb and is already ancestor in successful provisioning rows. No submodule, dirt, native tool, wrapper, or overrides except where stated. Status commands succeed. Post-create worktree list includes the selected home; HEAD equals headRefOid except in race. Both SHAs exist. No local branch or PR worktree unless stated. Every listed observation overrides the replay's empty-output default.

## Provisioning rows

- linked: session is in unrelated linked /work/widget/.worktrees/other, branch other. Create the PR tree, not a nested tree or reuse of other. Base already ancestor.
- primary: normal checkout, otherwise same as linked.
- ancestor: local fix/retry is cccccccccccccccccccccccccccccccccccccccc; ancestry exits 0; no worktree.
- reuse: selected home already on fix/retry at ccccccc, ancestry exits 0; clean status; ff-only reaches aaaaaaa.
- fork: isCrossRepository=true, headRepository.nameWithOwner=contributor/widget.
- elsewhere: fix/retry listed at /work/widget/.worktrees/pr-82.
- unreachable: verify head commit fails after fetch; origin/fix/retry is ddddddd.
- moved: head exists but origin/fix/retry is ddddddd.
- ahead and diverged (two runs): local fix/retry is ccccccc; ancestry exits 1 in each.
- override: home default, create='helper create -b <branch> <name>'; built-in checkout succeeds.
- race: checkout completes but HEAD is dddddddddddddddddddddddddddddddddddddddd. Leave the created tree intact.

For every stop quote the exact one-line error and identify the pre-write boundary. For successful rows show exact checkout arguments (distinguish Git's DWIM from caller -b), head verification, captured full PRE_REWORK_HEAD/BASE_SHA, and report fields including the no-op merge outcome. Show merge-forward behavior without outlawing the flow's appended-spec amend or appended-wave fold. Narrate provisioning and history only; base-merge helper outcomes and thread fetching are separate cases.

Ordinary-home control: all successful singleton runs have no coordinated marked-home N>1 context and retain their PR reports, pre-rework refs and existing provisioning. In a separate ordinary singleton run local fix/retry is a clean two-parent base-sync merge ahead of origin/fix/retry; ancestry exits 1. This still stops, with no coordinated recovery exemption.
