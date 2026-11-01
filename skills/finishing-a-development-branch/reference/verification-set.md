# Finish verification set

Read this reference at Step 1, before the skip proof and before stripping any plan. Retain the resolved set and accepted-complete task evidence through delivery.

## Resolve the set

| Subject | Set |
|---|---|
| Ledger (line 1 exactly `# Ledger - loop engine`), including a recovered pre-strip ledger | Read [the loop skill's `## Gate set`](../../loop-implementation/SKILL.md#gate-set) at its absolute path with `read`. Use that set's membership, ordering, deduplication and `## Leg mapping` ownership. Apply its missing `checks:` stop, never a full-command fallback. |
| Rework PR subject with a task plan | Use the union of every plan task's `Tests:` commands plus the executable lint/format commands in the header's `**Verification:**` line; treat `none - PR subject, scoped` as no header commands, not an empty task union. Capture this set and accepted-complete task evidence before stripping the plan. Apply the hard gate and skip rule below to this set. |
| Every other subject with a task plan | Run the plan header's `**Verification:**` set in the worktree: `(cd "$WORKTREE" && <command>)`. |
| No artifact, including no recovered ledger | With no plan in this session, run the verification command(s) of the affected services from the gauntlet overrides file or `AGENTS.md` (look for "verification", "CI", or "test" sections). |

For a ledger, record the resolved set as an ordered list of (leg, command) pairs. Retain each leg's worktree and primary: execute in its worktree before squash and its primary after squash. Supply the gate set as `SCOPED_TEST_COMMANDS` to the minors child, with each command's owning checkout.

At finish's first gate-set execution site, mint `LOG_DIR=$(mktemp -d)` once for this session; reuse it for every finish rerun. Do not rely on a verify-session shell variable. Follow the loop skill's foreground, fail-fast execution and one-line exit reporting. For a human stop, quote at most `tail -n 20` from the failing log, alongside its exit line. Commit verification-produced tracked changes, or stop; record the verified HEAD and clean status only afterward. Retain Step 1's scoping caveat and failure stop.

For ledger commands outside a checkout's configured test-command matcher, verify-before-ship may warn; do not run the full suite to clear the warning. Keep CI responsible for the full run.

## Skip proof

**Skip rule.** Skip the run only when this set passed on a known clean commit in the verify phase of this session and no edit or write landed outside `<telemetry.dir>` since. Check the current tree: `git -C "$WORKTREE" diff --quiet <commit the run passed on> -- . ':!<telemetry.dir>'` must exit 0, and `git -C "$WORKTREE" status --porcelain --untracked-files=all -- . ':!<telemetry.dir>'` must exit 0 with empty output (`<telemetry.dir>` defaults to `.pi/gauntlet/telemetry`). These checks cover committed, staged, unstaged, and untracked changes outside telemetry. Otherwise run it once; a missing verified commit, a failed check, or uncertainty means run.

Apply the proof independently in each owning checkout. Post-squash verification is mandatory; the skip proof does not cover a changed primary tree.

## Post-strip recovery

For a fresh-session retry after a ledger was stripped, recover the committed pre-strip ledger that supplied Step 1's rows and `## Leg mapping`: `git -C <home> show <strip commit>^:<ledger path>`. Locate the removal in that ledger path's history; use the home primary when the home worktree is absent. Reconstruct the gate pairs from that ledger, never from the spec's `contract:` `- verification:` lines. Keep the recovered artifact read-only and apply the same `checks:` admission. On a missing or ambiguous source, stop naming the ledger path; do not take the no-plan fallback. Preserve coordinated receipt validation and delivery exemptions from [coordinated finish](legs.md).

## Post-squash execution

For Option 3, run each delivered leg's retained pairs in order as `(cd "<leg primary>" && <command>) > "$LOG_DIR/gate-<i>.log" 2>&1`, one command per pair, retaining its gate index and fail-fast exit reporting. For coordinated delivery, run only the just-squashed leg's pairs at that leg's delivery step; every remaining leg gets its own post-squash run when delivered. A failed-squash receipt retry runs those same pairs against the delivered primary, not the feature worktree, and never repeats the squash. Retain the Step 1 command set and execution form for non-ledger subjects.
