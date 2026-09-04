# Hotfix (chase-bug supplementary)

Consumed only by `SKILL.md` in this directory, at the real-bug menu handoff. Input:
the handoff record at `$TMPDIR/hotfix-<slug>.md` - read nothing else about the bug.
Automatic end to end: the menu pick was the consent. The only human gate left is
chase-bug's `send it`, reached in step 10 below.

## Boundaries

- Reads: anything.
- Writes: the hotfix worktree; exactly one squash commit on `<default>`, made in the
  primary checkout with a clean index, `<orig-branch>` restored after; `$TMPDIR`.
- Does NOT: run tests or create files in the primary checkout; push without an
  explicit request; touch tracker state; commit on the source checkout during setup;
  touch pre-existing dirt or any resource this run did not create.

## Ownership

Two flags, `created-worktree` and `created-branch`, set only when `git worktree add`
succeeds (it creates both). Every destructive command below is gated on its flag.

## Procedure

1. **Read the record; print the eligibility line.** Reprint the menu-time
   evaluation verbatim: `eligible` or `not eligible: <predicate>`. Never
   re-derive, never block.
2. **Resolve before mutating.** `SCOPED_TEST_COMMANDS`: the gauntlet overrides
   file's verification section (`## verification-before-completion`, or a section
   matching the verification topic), else `AGENTS.md` or the project's documented
   test command. The full project test target is acceptable. Add the record's repro
   command when present. No exact command -> abort (pre-land). Draft the implementer
   task text from the record; not writable -> abort (pre-land). Nothing exists yet.
3. **Worktree.** From the primary checkout:

   ```bash
   PRIMARY_ROOT=$(git rev-parse --show-toplevel)
   DEFAULT=$(git symbolic-ref --short refs/remotes/origin/HEAD) && DEFAULT=${DEFAULT#origin/}
   BASE_SHA=$(git rev-parse "$DEFAULT")
   ORIG_BRANCH=$(git branch --show-current)
   git status --porcelain > "$TMPDIR/hotfix-<slug>.baseline"
   ```

   Abort (pre-land, nothing created) when: `git rev-parse --git-dir` differs from
   `git rev-parse --git-common-dir` (inside a linked worktree); `DEFAULT` empty
   (never guess a squash target); `ORIG_BRANCH` empty (detached HEAD); `git status
   --porcelain --untracked-files=no` non-empty; `git check-ignore -q .worktrees/`
   fails (never commit on the source checkout); `git show-ref --verify -q
   refs/heads/hotfix/<slug>` succeeds or `.worktrees/hotfix/<slug>` exists (never
   reuse, never force); `git worktree add` itself failing (creation failure).

   ```bash
   git worktree add ".worktrees/hotfix/<slug>" -b "hotfix/<slug>" "$DEFAULT"
   ```

   Success sets both flags. Run the project's dependency install inside the
   worktree. Every dispatch below: `cwd` = the worktree path, the record path in the
   task text, `output:` (when used) an absolute `$TMPDIR` path.
4. **Implement.** One `implementer`, fork context:

   > Read `$TMPDIR/hotfix-<slug>.md`; the evidence pack is also inlined here:
   > <evidence pack>. The evidence pack replaces plan and spec; do
   > not report BLOCKED for a missing plan. TDD: write the regression test, run it,
   > confirm it fails, then the minimal fix (dependency-bump fallback: the repro
   > re-run is the regression evidence). SCOPED_TEST_COMMANDS: <commands>. Commit on
   > `hotfix/<slug>` before reporting. End with the SDD status line verbatim.

   `DONE` -> step 5. `DONE_WITH_CONCERNS` -> step 5 unless a concern names a safety
   invariant -> abort. `NEEDS_CONTEXT` or `BLOCKED` -> abort. A regression command
   named in the report joins `SCOPED_TEST_COMMANDS` only if it uses the resolved
   command's runner.
5. **Test.** Run `SCOPED_TEST_COMMANDS` in the worktree. Red -> one implementer
   retry -> red -> abort.
6. **Verify (advisory).** One fresh `conformance-reviewer`. Its entire origin, in
   the task text, located as `prompt`:

   > R1: the trigger `<trigger>` now yields `<expected>` (was `<observed>`).
   > R2: regression evidence exists (test or repro re-run).
   > R3: the diff stays inside the envelope: files implementing the mechanism at
   > the recorded `file:line`, the regression test, and (dependency exception)
   > manifest + lockfile.

   Parent filter: only rows located as `prompt` count; a row sourced from a spec
   file or ticket is not-a-gap. Real gaps -> one implementer round -> re-run step
   5 -> no second audit; unfixable -> abort. Dispatch failure or malformed output
   -> note it, continue.
7. **Review - last mutation gate.** One fresh `code-reviewer` over
   `<base-sha>..HEAD` in the worktree. Task text: the record path,
   `SCOPED_TEST_COMMANDS`, invariants 1-3 and predicates 4-6 as named review items
   (a predicate miss is Moderate unless it trips an invariant). `SHIP` -> step 8.
   `FIX_FIRST` -> one implementer round fixing every Critical and Moderate ->
   re-run step 5 -> one re-review; `SHIP` -> step 8, else abort. `REJECT` or any
   invariant violation -> abort, no round. Dispatch failure or malformed output ->
   one redispatch, then abort.
8. **Finish.** Branch on the record's `delivery-mode`: `squash` -> squash path;
   `pr` -> PR path. Every command from `PRIMARY_ROOT`. Squash path, by state:

   ```bash
   cd "$PRIMARY_ROOT"
   [ -z "$(git status --porcelain --untracked-files=no)" ] || land_abort
   [ "$(git rev-parse "$DEFAULT")" = "$BASE_SHA" ] || land_abort   # base moved: never touch <default>
   git checkout "$DEFAULT" || land_abort                            # pre-squash ends here
   git merge --squash "hotfix/<slug>" || { git reset --hard "$BASE_SHA"; land_abort; }
   git diff --cached --quiet && { git reset --hard "$BASE_SHA"; land_abort; }   # empty squash
   git commit -m "fix: <slug>" -m "<fault story>" || { git reset --hard "$BASE_SHA"; land_abort; }
   [ "$(git rev-parse HEAD^{tree})" = "$(git rev-parse "hotfix/<slug>^{tree}")" ] \
     || { git reset --hard "$BASE_SHA"; land_abort; }              # proven; never reset after this line
   SHA=$(git rev-parse HEAD)
   [ "$ORIG_BRANCH" = "$DEFAULT" ] || git checkout "$ORIG_BRANCH"  # failure: report, commit stays
   git worktree remove --force ".worktrees/hotfix/<slug>" && git worktree prune \
     && git branch -D "hotfix/<slug>"                               # failure: keep commit, report residual
   ```

   `git branch -D` is forced by construction: a squash commit never has the branch
   tip as ancestor, so `-d` always refuses; the proven tree is the loss guard. The
   commit stays **unpushed**. Report: `$SHA`; revert line `git checkout <default>
   && git reset --hard <base-sha>` (unpushed) or `git revert <sha>` (after any
   push); `git status --porcelain` diff against the baseline (expected none); a
   push nudge.

   PR path, cwd = the worktree: `git push -u origin hotfix/<slug>` - failure ->
   report branch + worktree path, no URL, preserve. `gh pr create --base <default>
   --head hotfix/<slug>` - `gh` missing or failing after one retry -> report the
   pushed branch and compare URL. Worktree and branch preserved; print the closing
   line.
9. **Cleanup evidence.** Squash exit and pre-land aborts: `git worktree list`
   without the hotfix entry; `git branch --list hotfix/<slug>` empty; porcelain
   delta vs baseline none. PR exit and land-stage aborts: both present, plus
   `git worktree remove --force .worktrees/hotfix/<slug> && git branch -D hotfix/<slug>`.
10. **Response.** chase-bug step 5 rules apply unchanged: addressable -> draft
    citing `fixed in <SHA>` or the PR link -> `send it`; unaddressable -> summary.
    Abort never reaches this step - it returns to the menu.

## Eligibility predicates

Evaluated once by `SKILL.md` at menu time from the root cause; re-checked against
the diff in step 7.

Safety invariants (row availability):

1. No schema, migration, or persistence change.
2. No public API, contract, or config-shape change.
3. Rollback is reverting one commit - no data or state side effects.

Judgment predicates (`[recommended]` only; Moderate review items):

4. Existing code only - new files limited to the regression test.
5. Dependencies unchanged, one exception: a patch/minor bump whose upstream issue or
   changelog names the symptom, diff = manifest + lockfile, no call-site change.
   Replacement, major/breaking upgrade, new dependency -> fails.
6. Regression evidence writable in the existing harness (bump fallback: the repro).

## Abort

Both classes end with the baseline re-check, then chase-bug step 4 re-renders.

**Pre-land** (steps 2-7): unresolvable commands or task text; setup precondition
unmet; `NEEDS_CONTEXT`/`BLOCKED` or a concern naming an invariant; red after retry;
unfixable conformance gap; review `REJECT`, invariant violation, or a non-`SHIP`
re-review.

```bash
[ "$created_worktree" = 1 ] && git worktree remove --force ".worktrees/hotfix/<slug>"
git worktree prune
[ "$created_branch" = 1 ] && git branch -D "hotfix/<slug>"
```

Nothing else is touched. The re-rendered menu keeps the hotfix row when neither
flag was set, omits it otherwise.

**Land-stage** (step 8 before *proven*, after review `SHIP`): base moved, checkout failure, empty
squash, merge/commit failure, tree mismatch. `git reset --hard <base-sha>` only when
this run moved `<default>` (squash-applied or later) and `<default>` is checked
out (the step 8 lines do
exactly that); on base moved `<default>` is never touched and both SHAs are
reported. Restore `<orig-branch>`. Preserve worktree and branch (reviewed work).
Report path, tip SHA, closing line. The menu re-renders without the hotfix row.

**Baseline re-check**: `git status --porcelain --untracked-files=no` matches the
triage baseline; full porcelain delta reported; `<default>` == `<base-sha>` asserted
only when this run touched `<default>`. Pre-existing dirt is never touched.

## Harness fallback

No `subagent` tool and no personas (the Claude Code marketplace ships `agents: []`):
run the duties inline, same order. Write the failing regression test, confirm red,
minimal fix, confirm green, commit on `hotfix/<slug>`. Self-review the diff against
the record, invariants 1-3, predicates 4-6. Run `SCOPED_TEST_COMMANDS`. Apply the
abort classes as written. Finish and report per steps 8-9.

## Red Flags - STOP

- Any mutation before every step 3 precondition passes
- Reusing or force-replacing an existing `hotfix/<slug>` branch or path
- `git reset --hard` after *proven*, on `<orig-branch>`, or inside the worktree
- Re-running tests in the primary checkout
- Merging onto a moved base
- Landing a diff the last review did not see
- Pushing without an explicit request
