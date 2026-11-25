bundle-: skills/gatekeep-pr/SKILL.md
bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/menus.md
bundle-: skills/gatekeep-pr/reference/findings.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
bundle-: skills/gatekeep-pr/reference/report.md
bundle-: skills/gatekeep-pr/verification-brief.md
bundle-: skills/gatekeep-pr/reference/assessment.md
bundle-: skills/gauntlet/menu-layout.md
bundle-: skills/gauntlet/commit-message.md
## Entry

Start at Teardown after the selected post steps finished. Stop at the closing message. Narrate commands as text only; execute nothing. This is one teardown operation, not a PR assessment, menu, provisioning or delivery replay.

PR #37 in acme/widgets is merged. The assessed head is aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa. The primary checkout is /work/widgets. The PR's linked checkout /work/widgets/.worktrees/pr-37 and its local branch pr-37 were removed by the successful selected cleanup step. The primary still exists. Its git common directory is /work/widgets/.git.

The validated saved-progress locator is /work/widgets/.git/gauntlet/tmp/gate.ABC123/state. That directory contains these regular files:

- state, state-spec.md, state-ledger.md
- verify.output, verify.log, review.output, review.log
- description.body, landed-body
- reply.body: the drafted reply "The parser now rejects an empty name." The selected reply failed with HTTP 503; do not retry it.
- coverage.body: the drafted coverage comment "PR #37 covers rejection of empty names." The coverage post was not picked.

A second gate run is still active beside it at /work/widgets/.git/gauntlet/tmp/gate.DEF456. It contains its own state, finding artifacts, helper outputs, logs and drafts. Its next step will read /work/widgets/.git/gauntlet/tmp/gate.DEF456/state.

TMPDIR is /tmp. That folder also contains an earlier ended run's gate-kept.OLD001 and gate-kept.OLD002, and older-package files gatekeep-state.OLD003, gatekeep-state.OLD004, gatekeep-verify.OLD005 and gatekeep-verify.OLD006. All contain saved content.

All filesystem checks and commands for this operation succeed. When called, the next two gate-kept.XXXXXX mints return /tmp/gate-kept.NEW001 and /tmp/gate-kept.NEW002, in reply then coverage order. Use these supplied results for the closing message, not invented random suffixes. There are no other post steps or drafts.
