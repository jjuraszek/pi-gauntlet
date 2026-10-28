anonymized: true
- primary: judged: First checkpoint scout brief reads /repos/viewer as the found sibling despite ssh config and https stored origin.
- home: judged: First checkpoint home cwd remains /repos/pi-gauntlet/.worktrees/x, not the primary checkout.
- external-git-dir: judged: External Git directory checkpoint selects /repos/viewer beside /repos/app, independent of Git metadata location.
- submodule: judged: Submodule checkpoint selects /repos/app/vendor/viewer beside /repos/app/vendor/lib.
- unresolved: judged: No-primary checkpoint reports unresolved: no primary checkout found; expected beside it as viewer and continues single-repo without a gate or stop.
- not-worktree: mechanical: lacks "/repos/pi-gauntlet/.worktrees/viewer"
- not-external: mechanical: lacks "/store/viewer"
- not-modules: mechanical: lacks "/repos/app/.git/modules/viewer"
