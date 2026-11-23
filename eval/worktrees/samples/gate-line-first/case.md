# Input

This case overrides the generic replay's attached-HEAD assumption: observed `git symbolic-ref -q HEAD` returned no output and exit 1. HEAD is detached at def5678 in the primary checkout /work/app. The user requested an isolated workspace for timeout work but named no base. No worktree has been created and no branch/base choice has arrived. Produce only the next user-facing question at Detached HEAD, not a command narration. Wait for the branch/base choice.
