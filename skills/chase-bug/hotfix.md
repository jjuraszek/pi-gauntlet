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

1. **Read the record; print the eligibility line.** Before resolving anything,
   detect the harness:

   | Tools present | Route |
   |---|---|
   | Both `subagent` and `gauntlet_setting` | Pi path below |
   | Neither | Harness fallback |
   | Exactly one | Abort (pre-land, nothing created), naming the missing tool |

   Require the record's `## Acceptance criteria`, `## Invariants`, and fenced
   `## Bug report` sections, plus `evidence-command` on the dependency exception;
   missing -> abort (pre-land, nothing created). Reprint the menu-time evaluation
   verbatim: `eligible` or `not eligible: <predicate>`. Never re-derive, never block.
2. **Resolve before mutating.** `SCOPED_TEST_COMMANDS`: the gauntlet overrides
   file's verification section (`## verification-before-completion`, or a section
   matching the verification topic), else `AGENTS.md` or the project's documented
   test command. The full project test target is acceptable. Add the record's repro
   command when present. No exact command -> abort (pre-land). On the pi path,
   resolve `gauntlet_setting({ key: "loopEngine" })` and use
   `maxIterationsPerRow` (default 4) as the ledger allowance; a settings error ->
   abort (pre-land). Nothing exists yet.
3. **Worktree.** From the primary checkout:

   ```bash
   PRIMARY_ROOT=$(git rev-parse --show-toplevel)
   DEFAULT=$(git symbolic-ref --short refs/remotes/origin/HEAD) && DEFAULT=${DEFAULT#origin/}
   BASE_SHA=$(git rev-parse "$DEFAULT")
   ORIG_BRANCH=$(git branch --show-current)
   ORIG_HEAD=$(git rev-parse HEAD)
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
   git worktree add "$PRIMARY_ROOT/.worktrees/hotfix/<slug>" -b "hotfix/<slug>" "$DEFAULT"
   WORKTREE=$(git -C "$PRIMARY_ROOT/.worktrees/hotfix/<slug>" rev-parse --show-toplevel)
   ```

   Success sets both flags; `WORKTREE` is set only after `git worktree add`
   succeeds - empty `WORKTREE` -> abort (pre-land, both flags set so cleanup runs)
   - and is the literal the child is compared against - both sides come from `git
   rev-parse --show-toplevel`, so a symlinked `.worktrees/` cannot make them
   disagree. Before installing dependencies, write
   `$TMPDIR/hotfix-<slug>-ledger.md`; not writable -> abort (pre-land):

   ```markdown
   # Ledger - loop engine
   **Spec:** `<absolute $TMPDIR/hotfix-<slug>.md path>`
   base: <BASE_SHA>
   verification: <first SCOPED_TEST_COMMANDS command>
   checks: commands
   iterations: 0
   allowance: <maxIterationsPerRow>

   | row | status | attempts | evidence |
   |---|---|---|---|
   | 1 | open | 0 | |

   ## Leg mapping

   | row | ac | leg |
   |---|---|---|
   | 1 | 1 | hotfix |

   ## Decisions
   ```

   Keep this parent-owned ledger outside the hotfix branch; validate its sole
   mapping locally as `1 | 1 | hotfix`, without tracker tools or the loop driver's
   coordinated admission shell. Remove the ledger as the last action of every
   exit: after step 9's evidence on squash or PR exit, or after the abort class's
   bash block and report. Leave the handoff record in place.

   Run the project's dependency install inside the worktree. Every dispatch
   below: `cwd` = the worktree path, `output:` an absolute `$TMPDIR` path. Reuse
   the full step 4 dispatch for every repair in steps 5-7, with `target: 1`,
   the latest decision and the round's hint; never seed again.
4. **Implement.** Dispatch `loop-implementer` sequentially in companion mode:
   first `target: seed`, then, only after admitting the seed, `target: 1`.
   Use `context: "fresh"` and `cwd: <WORKTREE>` for both. The record is the
   child's spec; its sole AC is row 1 and R2/R3 are invariants, not extra rows.
   The child leaves the parent-owned ledger untouched and returns its row and
   decision in its commit body under its Companion result commit contract.

   Resolve `Rules:` in the worktree: check `test -f <WORKTREE>/<path>` for
   `AGENTS.md`, then the overrides path located in step 2. Supply one line per
   existing repo-relative path, in that order; none present -> `Rules: none`.
   Never substitute a primary-checkout path for a Rules path.

   Before each dispatch, save row 1's `attempts`, the ledger's current
   `iterations` as `i`, and the worktree HEAD as `HEAD_BEFORE`;
   write `iterations: i + 1` and
   `pending: <target> | hotfix | <HEAD_BEFORE>` to the ledger. Pass that exact
   tuple to the child, with the pre-bump `iteration: <i>`:

   ```text
   subagent({ agent: "loop-implementer", context: "fresh", async: false,
     cwd: <WORKTREE>, output: <absolute $TMPDIR path>, outputMode: "file-only",
     acceptance: { level: "none", reason: "the parent validates the commit and keeps the ledger" },
     task: "<binding block>\n\niteration: <i>\nspec: <absolute $TMPDIR/hotfix-<slug>.md path>\nledger: <absolute $TMPDIR/hotfix-<slug>-ledger.md path>\nbase: <BASE_SHA>\ntarget: <seed | 1>\nprevious decision: <line or none>\nhint: <text or none>\nLeg: hotfix\nmapped original AC: row 1 -> AC 1, leg hotfix\nRules: <repo-relative path or none>\npending: <target> | hotfix | <HEAD_BEFORE>\nSCOPED_TEST_COMMANDS: <commands>" })
   ```

   Use `previous decision: none` for seed, then the admitted seed decision for
   the first row attempt. Set the seed hint to `apply your seed contract: write
   or identify the failing regression test for row 1 and record its command`.
   On the dependency exception, replace it with `apply your seed contract: the
   evidence command for row 1 is <evidence-command from the record>; run it and
   record it`. Add to either seed hint: `when seeding changes no tracked file,
   commit once with git -C <WORKTREE> commit --allow-empty carrying the same
   subject and body`. Set the first row attempt's hint to `none`.

   Insert this binding block verbatim into each task. Substitute literal step 3
   values for `<WORKTREE>` and `<PRIMARY_ROOT>`, never a `$VAR` for the child to
   resolve:

   > Worktree binding: your checkout is <WORKTREE>. Your first command, before any
   > other, is
   >   actual=$(git rev-parse --show-toplevel); [ "$actual" = "<WORKTREE>" ] || echo "MISMATCH: $actual != <WORKTREE>"
   > On MISMATCH run nothing else; your final message opens with the line
   > `BLOCKED: toplevel <actual> != <WORKTREE>` and ends with `STATUS: BLOCKED`.
   > Every mutating git command (add, commit, checkout, reset, stash) runs as
   > `git -C <WORKTREE> ...`. Never `cd` out of <WORKTREE>; never run a command
   > against <PRIMARY_ROOT>.

   Keep the `BLOCKED:` opening line: pi-cohort treats it as a dispatch error
   carrying the full output before the child's completion guard runs.
   After each return, run `binding_check` before reading the decision or handling
   a dispatch error; a failed check -> `binding_abort`. Then apply these checks
   in order, reading the commit rather than trusting the child's reply:

   **Boundary.** Run `git -C <WORKTREE> status --porcelain` and
   `git -C <WORKTREE> rev-list <HEAD_BEFORE>..HEAD --count`. Non-empty porcelain
   or more than one new commit -> abort (pre-land), naming the dirt or count;
   leave attempts unchanged and the ledger untouched. Never discard changes
   to make a return admissible.

   **Commit body and evidence.** Require body lines 1-2, immediately after the
   subject's blank separator, to equal the dispatched `pending:` tuple and
   `iteration: <i + 1>`. Require a blank line, exactly one four-column row
   without a header, then a blank line and the decision. In the evidence cell,
   require one runnable, selective evidence command up to the first unescaped
   semicolon, plus at most three semicolon-separated result lines. Require plain
   text in one physical Markdown cell with pipes escaped as `\|`. The command
   must contain no `;`, `|`, or `&&`, select a file, test id, filter, or assertion,
   and differ from the ledger's full `verification:` command. Require a check
   that exits nonzero when no test is selected; verify a filter's no-match exit
   once, otherwise require the file invocation.

   **Seed admission (`target: seed`).** Require exactly one new commit with
   subject `loop: seed evidence`, the body above, row
   `| 1 | open | 0 | <evidence> |`, and the exact decision
   `row 0 done | seeded 1 rows, closed 0 on baseline | 1`. Inspect
   `git -C <WORKTREE> diff <HEAD_BEFORE>..HEAD` for tracked changes:

   | Seed result | Action |
   |---|---|
   | Row status `done` | Abort (pre-land): `baseline already passes: repro not captured` |
   | Empty diff | Admit only when the evidence command equals the record's `evidence-command` or names a path present at `BASE_SHA`, proved by `git -C <WORKTREE> cat-file -e <BASE_SHA>:<path>`; otherwise treat as a seed miss |
   | Zero commits, dispatch error without a commit, wrong subject, malformed body, row, counts, or decision, or any other seed miss | Abort (pre-land), no seed retry |
   | All checks pass | Apply the admitted result below, then issue the first row attempt |

   **Row admission (`target: 1`).** Require exactly one new commit with subject
   `loop: row 1 done` or `loop: row 1 failed`, the body above, and row
   `| 1 | <status> | <attempts> | <evidence> |`. Require attempts = saved attempts + 1
   and identical status in the subject, row, and decision. Match the decision to
   `^row 1 (done|failed) \| .{1,200} \| .{1,200}$`. Inspect
   `git -C <WORKTREE> diff <HEAD_BEFORE>..HEAD`; a diff changing no tracked file
   is a validation miss (no progress).

   **Admitted result.** The parent writes the row, appends the decision to
   `## Decisions`, clears `pending:`, and resets the consecutive-miss count.
   For row 1, `done` -> step 5; `failed` -> next attempt under Attempt budget,
   with the admitted decision as `previous decision`.

   **Validation miss (`target: 1` only).** Treat zero commits, a dispatch error
   without a commit, malformed subject/body/row/decision, attempts not equal to
   saved attempts + 1, status disagreement, or an empty row commit as a miss.
   Write row 1 `failed`, attempts = saved attempts + 1, and evidence
   `attempt <n>: <concrete miss>`; clear `pending:` and use
   `previous decision: none` for the next dispatch under Attempt budget.
   Count consecutive misses across row returns; the second consecutive miss ->
   abort (pre-land).
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
7. **Review - last mutation gate.** One fresh `wave-reviewer` over
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
   Binding aborts: worktree and `hotfix/<slug>` both present; no removal command
   is run.
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

All three classes end with the baseline re-check, then chase-bug step 4 re-renders.

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

**Binding** (after any implementer return, steps 4-7): the parent runs
`binding_check` from `PRIMARY_ROOT` before reading the child's status line or
handling a dispatch error - a `BLOCKED` or errored child may have mutated the
primary before stopping, and the pre-land cleanup would delete the evidence.

```bash
binding_check() {
  local head branch dirt default
  default=$(git -C "$PRIMARY_ROOT" rev-parse "$DEFAULT")    || binding_abort read "rev-parse $DEFAULT failed"
  head=$(git -C "$PRIMARY_ROOT" rev-parse HEAD)              || binding_abort read "rev-parse HEAD failed"
  branch=$(git -C "$PRIMARY_ROOT" branch --show-current)     || binding_abort read "branch --show-current failed"
  dirt=$(git -C "$PRIMARY_ROOT" status --porcelain --untracked-files=no) || binding_abort read "status failed"
  local moved=""
  [ "$default" = "$BASE_SHA" ] || moved="$moved <default>:$BASE_SHA..$default"
  [ "$head" = "$ORIG_HEAD" ]   || moved="$moved HEAD:$ORIG_HEAD..$head"
  [ "$branch" = "$ORIG_BRANCH" ] || moved="$moved branch:$ORIG_BRANCH->$branch"
  [ -z "$moved" ] && [ -z "$dirt" ] && return 0
  binding_abort drift "$moved" "$dirt"
}
```

Every read must succeed before any comparison: a failed read with empty stdout
would otherwise pass `-z "$dirt"` or be misread as HEAD drift. All observations
are collected first, so a stray commit plus tracked dirt is one abort. Three refs,
not one: a drifted child commits on whatever the primary has checked out, which is
`<orig-branch>`, and `<orig-branch>` may differ from `<default>`. The tracked-only
target is the empty string - the step 3 precondition already guarantees it.

`binding_abort` never touches the primary checkout: no `git reset`, no
`git checkout`, no stash - this run moved nothing, so the land-stage reset rule
already forbids it. The worktree and `hotfix/<slug>` are **preserved** as
evidence of what the child did where (a deliberate exception to pre-land
cleanup). Report, by kind: `read` - the failing command and its stderr, the
worktree path and `hotfix/<slug>` tip SHA, no drift claim; `drift` - for each
moved ref `<ref> moved from <old> to <new>` plus
`git --no-pager log --oneline <old>..<new>`
(branch switch: `checked-out branch changed from <orig-branch> to <branch>`),
for tracked dirt the path fields only (no `XY` codes), the full
`git status --porcelain` delta against the step 3 baseline file
(`$TMPDIR/hotfix-<slug>.baseline`, report-only as today), the worktree path and
`hotfix/<slug>` tip SHA. The non-executed repair line
`git checkout <ref> && git reset --hard <old-sha>` is printed only when tracked
dirt is empty -
with dirt present the parent cannot tell whose edits a reset would destroy. The
menu re-renders without the hotfix row.

**Baseline re-check**: `git status --porcelain --untracked-files=no` is empty (the
step 3 precondition; the tracked-only baseline is empty by construction); full
porcelain delta reported; `<default>` == `<base-sha>` asserted only when this run
touched `<default>`. Pre-existing dirt is never touched.

## Harness fallback

No `subagent` tool and no personas (the Claude Code marketplace ships `agents: []`):
run the duties inline, same order. Write the failing regression test, confirm red,
minimal fix, confirm green, commit on `hotfix/<slug>`. With no child the binding
block is moot, but `binding_check` still runs after the initial inline commit and
after each inline retry, conformance fix, or review fix, before tests continue.
Self-review the diff against the record, invariants 1-3, predicates 4-6. Run
`SCOPED_TEST_COMMANDS`. Apply the abort classes as written. Finish and report per
steps 8-9.

## Red Flags - STOP

- Any mutation before every step 3 precondition passes
- Reading an implementer's status line before `binding_check`
- Resetting or checking out any primary ref from `binding_abort`
- Reusing or force-replacing an existing `hotfix/<slug>` branch or path
- `git reset --hard` after *proven*, on `<orig-branch>`, or inside the worktree
- Re-running tests in the primary checkout
- Merging onto a moved base
- Landing a diff the last review did not see
- Pushing without an explicit request
