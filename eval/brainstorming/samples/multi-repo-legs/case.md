bundle-: skills/brainstorming/reference/amendment-surface.md
bundle-: skills/brainstorming/reference/ticket-acceptance.md
bundle+: skills/brainstorming/reference/legs.md
bundle+: skills/using-git-worktrees/SKILL.md
bundle+: skills/brainstorming/reference/spec-finalization.md
bundle+: skills/brainstorming/gatherer.md
# Input

At membership/provisioning and then spec finalization. Human selected repo-b and repo-c. Home primary /work/repo-a has no origin, Issue tracker repo: repo-a; siblings in order git@github.com:acme/repo-b.git, git@github.com:acme/repo-c.git, git@github.com:acme/repo-unused.git. Each companion has its basename as identifier. Use matching stored origins and /work/<NAME> as the checkout paths. Shared BRANCH feature/shared-change, NAME feature-shared-change. All selected primaries are clean; branch/path preflights pass. Do not inspect repo-unused.
repo-a overrides using-git-worktrees: home: .worktrees/<name>; create: script/tree create <name> <branch>; destroy: script/tree destroy <name>. repo-b legacy creator: script/worktree <subproject> <name> <branch>; only touched top-level directory pkg-x; cleanup: script/worktree-remove <subproject> <name>. repo-c has no overrides or wrapper. All use doc/specs and default preset settings. Creators report /work/repo-a/.worktrees/feature-shared-change, /work/repo-b/.worktrees/feature-shared-change, /work/repo-c/.worktrees/feature-shared-change on feature/shared-change.
Approved Problem: Shared result must stay readable. Shared Design: Readers retain compatibility. Errors and edge cases: Reject unknown versions. Out of scope: No transport replacement. AC 1 reader compatible belongs repo-a and repo-b; AC 2 writer compatible belongs repo-c. Home spec doc/specs/shared.md; final approval and council audit satisfied. Show home leg blocks and repo-b companion file, including commit order.

Use the supplied synthetic observations as tool results. Narrate the prescribed actions and stops; do not execute tools. Treat independent observations as separate runs.
