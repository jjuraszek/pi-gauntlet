# eval report: using-git-worktrees (partial run: pr-list-member-conflict-unresolved)

for: d9d494aa0f35d34dc0f270ef2b9571bfd3221d41a3255d6a968f60f515b09bd9

wall: 141s

## Change

Honor explicit primary ROOT and shared BRANCH for keyed leg provisioning; preserve all existing single-member provisioning facts.

Evaluate committed deb4f434 against the runner's merge-base baseline. Route resolved PR values through reference/pr-head.md before generic linked-worktree reuse; preserve merge-forward PR history, appended-spec amend and appended-wave fold, and non-PR provisioning. Merge ordered member original heads with canonical --no-ff subjects before the base merge, preserve every original head first, and prove all against final HEAD. Restrict conflict repair to supplied paths and scoped tests; verify abort restoration and residual state honestly. Validate interrupted first-parent member merges and recover a validated existing local branch without a worktree without overwriting its tip. Explicitly target the selected worktree in helper discovery, status, staging, completion, commit and abort commands while process cwd remains unchanged. Source behavior is unchanged since 71b39d7e; the Task 1 pr-head wording in 1a319685 is already captured. Subsequent replay-fixture clarifications and the partition into pr-head, pr-head-base-merge and pr-head-threads are setup-only: all 13 original required facts remain verbatim, no failure is accepted, and the word cap remains 1200. The for hash binds the bundle-free candidate assembly, not the commit or sample-added reference.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-list-member-conflict-unresolved | anthropic/claude-opus-5-5 | unchanged | 16072 | helper: holds -> holds (held); abort: holds -> holds (intended but unchanged); residual: holds -> holds (held); abort-failed: holds -> holds (held); stop: holds -> holds (held); boundary: holds -> holds (held) |
| pr-list-member-conflict-unresolved | github-copilot/gpt-6.1-sol | inconclusive | 34366 | helper: holds -> holds (held); abort: holds -> holds (intended but unchanged); residual: holds -> fails (regression); abort-failed: fails -> holds (unplanned improvement); stop: holds -> holds (held); boundary: holds -> holds (held) |

## Feedback

- pr-list-member-conflict-unresolved / anthropic/claude-opus-5-5: No fact moved: After keeps the same helper contract (fresh foreground implementer in /work/widget/.worktrees/fix-retry, exactly the two conflict paths, `node --test test/retry.test.mjs` read from BASE_SHA, git add required, commit/abort/outside edits forbidden), the same abort sequence with exit-0, HEAD, branch and empty `--untracked-files=all` status checks before claiming restoration, the same canonical STOP text, and both checkpoints honestly report actual state (` M README.md` / `UU src/retry.ts`), saved last-good eeee…, #13 already merged, manual recovery, no reset/clean, no base merge or downstream. Two small softenings worth tightening so the wording stays robust: After's step 21 says only 'still lists an unmerged path' where Before named `src/retry.ts` explicitly, and the helper instructions dropped the explicit 'fetched base origin/main @ dddd…' reference (the scoped command is still base-derived in step 18). Restoring the named unmerged path in the completion check and the fetched-base line in the helper brief would keep the detection and provenance as explicit as Before while preserving the new selected-worktree targeting and `(already landed)` recovery note.
- pr-list-member-conflict-unresolved / github-copilot/gpt-6.1-sol: After tightened the failed-abort stop (it now names PR #14, both conflict paths, the unmerged src/retry.ts, abort error, exit 1, observed SHA/branch, and merged #13, where Before only said 'unmerged path' with no PR number or conflict list), but it regressed the residual-edit stop: 'PR #14 recovery is incomplete … HEAD is the saved SHA on fix/retry, #13 remains merged, and README.md remains modified' drops the two conflict paths and the explicit 'failed' framing that Before carried via 'conflicted files are the two listed above'. Make both actual-state stops use the same checklist the failed-abort tail already uses — failing PR, both conflict paths (src/retry.ts, test/retry.test.mjs), selected worktree path, saved last-good eeeeeeee… SHA, observed HEAD/branch, the residual or unmerged entries from status, #13 already merged, manual recovery required, no restoration claim, no reset/clean — so the residual variant keeps every item Before kept. Also consider naming the two paths literally inside the helper instructions ('Resolve only src/retry.ts and test/retry.test.mjs') rather than 'those two files', so the scope boundary is self-contained in the quoted dispatch.

exit: 1
