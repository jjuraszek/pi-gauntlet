bundle+: skills/shape-ticket/SKILL.md

Use only the inline snapshots, documents and audit files below. Tools are disabled; describe prescribed calls and writes, never claim live execution. Treat each independent checkpoint separately. Keep the entire reply at most 1200 words. Emit selected paths only, not rejected candidate paths.

Prepare the run for repair ABC-801. Resolved overrides ## shape-ticket contains `- sibling: git@github.com:acme/viewer.git`. Supply the home cwd and sibling read paths in the scout brief and any parent-retained report lines. No other siblings are configured.

First checkpoint: cwd and `git rev-parse --show-toplevel` are /repos/pi-gauntlet/.worktrees/x. `git worktree list --porcelain` begins `worktree /repos/pi-gauntlet`. /repos/viewer is a checkout with stored origin https://github.com/acme/viewer.git.

Independent external Git directory checkpoint: cwd and top level /repos/app, Git directory /store/git/app.git, first entry `worktree /repos/app`; /repos/viewer has the same stored origin as above.

Independent submodule checkpoint: cwd and top level /repos/app/vendor/lib, Git directory /repos/app/.git/modules/lib; first entry `worktree /repos/app/vendor/lib`. /repos/app/vendor/viewer is a checkout with stored origin https://github.com/acme/viewer.git.

Scenario: resolve sibling read paths from supplied Git facts without live execution.

Independent no-primary checkpoint: cwd and top level /repos/app. `git worktree list --porcelain` succeeds but has no `worktree` entry. State the sibling report and continuing audit disposition.
anonymized: true
