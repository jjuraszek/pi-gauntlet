# Outside-ledger return file transport

Use these filesystem recipes from gatekeep and hotfix. Keep result validation and ledger accounting in the caller's admission rules. Return files stay separate from stage scratch.

## Stage scratch

Set `CHECKOUT` to the checkout doing this stage's work, never the launch directory. Run this block before writing scratch; stop on any error without an OS-temp fallback:

<!-- stage-scratch-shell -->
```bash
SCRATCH="$(git -C "$CHECKOUT" rev-parse --path-format=absolute --git-dir)/gauntlet/tmp" || exit 1
mkdir -p "$SCRATCH" || exit 1
```

Reuse `SCRATCH` for this checkout. On git-dir lookup failure, confirm a plain jj workspace with `jj -R "$CHECKOUT" root` and no `.git` at that root before using `SCRATCH=$(mktemp -d "${TMPDIR:-/tmp}/gauntlet.XXXXXX")`; report that directory. Keep ordinary Git failures on the stop path. Treat Claude Code's protected-path permission prompt as expected; obtain approval without redirecting scratch elsewhere.

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
