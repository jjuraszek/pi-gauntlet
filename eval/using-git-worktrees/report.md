# eval report: using-git-worktrees (partial run: pr-list-member-conflict-unresolved)

for: 2579f7893eb9372929070231b045adb574e05f7ca4e5645f5f5691ce29185983

wall: 89s

## Change

Honor explicit primary ROOT and shared BRANCH for keyed leg provisioning; preserve all existing single-member provisioning facts.

Evaluate committed deb4f434 against the runner's merge-base baseline. Route resolved PR values through reference/pr-head.md before generic linked-worktree reuse; preserve merge-forward PR history, appended-spec amend and appended-wave fold, and non-PR provisioning. Merge ordered member original heads with canonical --no-ff subjects before the base merge, preserve every original head first, and prove all against final HEAD. Restrict conflict repair to supplied paths and scoped tests; verify abort restoration and residual state honestly. Validate interrupted first-parent member merges and recover a validated existing local branch without a worktree without overwriting its tip. Explicitly target the selected worktree in helper discovery, status, staging, completion, commit and abort commands while process cwd remains unchanged. Source behavior is unchanged since 71b39d7e; the Task 1 pr-head wording in 1a319685 is already captured. Subsequent replay-fixture clarifications and the partition into pr-head, pr-head-base-merge and pr-head-threads are setup-only: all 13 original required facts remain verbatim, no failure is accepted, and the word cap remains 1200. The for hash binds the bundle-free candidate assembly, not the commit or sample-added reference.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-list-member-conflict-unresolved | anthropic/claude-opus-5-5 | unchanged | 20362 | helper: holds -> holds (held); abort: holds -> holds (intended but unchanged); residual: holds -> holds (held); abort-failed: holds -> holds (held); stop: holds -> holds (held); boundary: holds -> holds (held) |
| pr-list-member-conflict-unresolved | github-copilot/gpt-6.1-sol | improved | 25739 | helper: holds -> holds (held); abort: holds -> holds (intended but unchanged); residual: holds -> holds (held); abort-failed: fails -> holds (unplanned improvement); stop: holds -> holds (held); boundary: holds -> holds (held) |

## Feedback

- pr-list-member-conflict-unresolved / anthropic/claude-opus-5-5: No fact moved between Before and After: both dispatch the scoped foreground implementer with the exact path list, git -C add requirement and commit/abort/outside-edit prohibitions; both abort at the selected home and verify exit 0, the full saved SHA, fix/retry and an empty --untracked-files=all status before issuing the restored-state STOP; both residual and failed-abort checkpoints report actual state (README.md or UU src/retry.ts, abort status/error, worktree, branch, HEAD, saved last-good, #13 merged) with manual recovery and no reset/clean or restoration claim; and both refuse the base merge, spec/plan, later merges, push and close. Two small spots in After are weaker than Before and worth tightening so they stay robust: step 24 says the completion check 'still lists an unmerged path' without naming src/retry.ts (Before names it, which makes the 'detects remaining unmerged path' reading unambiguous), and the main-path 'Not done after this stop' list omits Before's explicit 'the base-conflict continuation is not used' sentence; restoring 'still returns src/retry.ts' in step 24 and adding 'no base-conflict continuation' to the not-done list keeps every fact Before kept while preserving After's clearer numbered structure and provenance line.
- pr-list-member-conflict-unresolved / github-copilot/gpt-6.1-sol: After keeps every fact Before kept and gains abort-failed: Before's failed-abort stop listed the abort error, exit status, unmerged path, worktree, saved SHA and #13 but never named the failing PR or the two conflict paths in that stop, whereas After's stop explicitly says '#14 failed in the two listed conflict files' alongside branch, HEAD/saved SHA, exit 1, the unmerged src/retry.ts, and the manual-recovery requirement without any restoration claim. The helper dispatch, abort verification sequence (exit 0, HEAD vs saved full SHA, branch, empty status with untracked files before 'Restoration is verified'), residual README.md handling with no reset/clean, the canonical stop text, and the boundary statement all survive intact. One small risk to watch: After's failed-abort section says the abort diagnostic 'was not supplied' — keep stating that the stop carries the abort error as observed (as it does with 'Abort failed with exit 1') so a reader doesn't read it as omitting the error; and in the residual checkpoint, continue to spell out the two conflict path names rather than 'the two listed above' to keep that fact robust.

exit: 0
