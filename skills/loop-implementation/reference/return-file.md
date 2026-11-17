# Outside-ledger return file transport

Use these filesystem recipes from gatekeep and hotfix. Keep result validation and ledger accounting in the caller's admission rules. Return files stay separate from stage scratch.

## Return files

Set `CHECKOUT` to the worker checkout, `HEAD_BEFORE` to the pending tuple's SHA and `ITERATION` to the consumed ledger count. Resolve the path on dispatch and recovery with the checkout-local Git directory, not the common directory. Stop on a failed read.

<!-- return-path-shell -->
```bash
GIT_DIR=$(git -C "$CHECKOUT" rev-parse --path-format=absolute --git-dir) || exit 1
RETURN_FILE="$GIT_DIR/gauntlet/returns/$HEAD_BEFORE-$ITERATION.md"
```

Before dispatch only, prepare that exact path. Stop before dispatch on either failure. Pass `return: <absolute path>` to the worker. On recovery retain the file for admission instead of preparing it again.

<!-- return-prepare-shell -->
```bash
mkdir -p -- "$(dirname "$RETURN_FILE")" || exit 1
rm -f -- "$RETURN_FILE" || exit 1
```

Delete the file at the caller's admission, validation-miss or teardown boundary. Run this before removing its checkout's Git directory. Report a deletion failure and dispatch no further worker.

<!-- return-delete-shell -->
```bash
rm -f -- "$RETURN_FILE" || exit 1
```

## Scratch folder

Set `CHECKOUT` to the checkout doing this stage's work, never the launch directory. Run this block before writing scratch; on a failed Git lookup apply only the plain-jj exception below, and stop on every other error:

<!-- stage-scratch-shell -->
```bash
GIT_DIR=$(git -C "$CHECKOUT" rev-parse --path-format=absolute --git-dir) || exit 1
SCRATCH="$GIT_DIR/gauntlet/tmp"
mkdir -p "$SCRATCH" || exit 1
```

Reuse `SCRATCH` for this checkout. On git-dir lookup failure, confirm a plain jj workspace with `jj -R "$CHECKOUT" root` and no `.git` at that root before using `SCRATCH=$(mktemp -d "${TMPDIR:-/tmp}/gauntlet.XXXXXX")`; stop on mint failure. Mint this fallback only once per stage invocation, retain its absolute path across turns, and remove that exact directory at the handled terminal exit; report the path. Keep ordinary Git failures on the stop path. For jobs files, reuse the supplied scratch path or require a successful checkout-local Git lookup; worker and driver stop with the Git error, never a fallback. Treat Claude Code's protected-path permission prompt as expected; obtain approval without redirecting scratch elsewhere.

Mint files with `mktemp "$SCRATCH/<role>.XXXXXX"` and folders with `mktemp -d "$SCRATCH/<role>.XXXXXX"`; stop on failure. Delete only a path this stage minted, by that exact path.
