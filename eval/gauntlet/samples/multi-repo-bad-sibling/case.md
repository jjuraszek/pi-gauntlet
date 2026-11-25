bundle-: skills/gauntlet/amendment-surface.md
bundle-: skills/gauntlet/brainstorm/ticket-acceptance.md
bundle-: skills/gauntlet/brainstorm/spec-finalization.md
bundle+: skills/gauntlet/legs.md
bundle+: skills/gauntlet/worktrees.md
# Input

Independent runs, home /work/repo-a. Ask explicitly selects repo-b. The declared sibling is git@github.com:acme/repo-b.git, with PATH /work/repo-b. A PATH does not exist. B PATH symlinks to /work/repo-a. C PATH exists but is not a git repo. Each has no created trees; no other selected siblings. The checkout for unselected git@github.com:acme/repo-c.git is missing.

Use the supplied synthetic observations as tool results. Narrate the prescribed actions and stops; do not execute tools. Treat independent observations as separate runs.
