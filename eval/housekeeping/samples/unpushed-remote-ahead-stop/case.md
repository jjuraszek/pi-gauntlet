bundle-: skills/housekeeping/reference/check.md
bundle-: skills/housekeeping/reference/base-rules.md
bundle-: skills/housekeeping/reference/card.md
bundle-: skills/brainstorming/reference/menu-layout.md
bundle-: skills/chase-bug/hotfix.md
bundle-: skills/chase-bug/reference/verdict-report.md

The human invoked `/skill:housekeeping` with no argument. Select has observed the facts below. Produce the next user-facing message now.

Observed state:
- This session is in the primary checkout, on the actual default branch main.
- The one status observation, `git status --porcelain --untracked-files=normal`, exited 0 with no output.
- `git fetch origin main` succeeded.
- HEAD is 1111111111111111111111111111111111111111; origin/main is 2222222222222222222222222222222222222222.
- `git rev-list --count origin/main..HEAD` printed 2.
- `git merge-base --is-ancestor origin/main HEAD` exited 1: origin/main is not an ancestor of HEAD.
- The run folder was created at /tmp/housekeeping.remote-ahead.
- No source file has been checked. No findings, cards or decisions exist.
- Nothing has been edited, staged, committed, reset, pushed, filed or opened.
