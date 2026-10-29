# eval report: using-git-worktrees (partial run: pr-list-member-replay)

for: bd53d4314f314c3ba4341de00303426d9a06205147efaf6aeee94920a3a47c81

wall: 105s

## Change

Default PR-subject provisioning linearizes the home branch with --no-rebase-merges and replays members in listed order while preserving original local refs and leaving origin member branches untouched. Explicit merge-forward retains member-then-base merges. Rebase conflicts use one scoped helper per stop and orchestrator-only continuation; failures abort and prove restoration against the actual saved pre-attempt home tip, with unresolved and pending outcomes deferred to Task 1. Interrupted recovery validates rework-base and original refs, forces rebase mode and uses cherry to skip landed members; canonical merge-subject recovery retains merge mode. Successful rebase sync persists and reports Rework base. Admission, clean-tree checks, fetched-base constraints, helper scope, and unrelated provisioning behavior remain required; no failure is accepted. The for hash binds the bundle-free candidate assembly, not sample-added references.

Honor explicit primary ROOT and shared BRANCH for keyed leg provisioning; preserve all existing single-member provisioning facts.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-list-member-replay | anthropic/claude-opus-5-5 | unchanged | 13702 | order: holds -> holds (intended but unchanged); preflight: holds -> holds (held); ancestry: holds -> holds (held); report: holds -> holds (held) |
| pr-list-member-replay | github-copilot/gpt-6.1-sol | inconclusive | 12533 | order: holds -> fails (regression); preflight: holds -> holds (held); ancestry: holds -> fails (regression); report: holds -> fails (regression) |

## Feedback

- pr-list-member-replay / anthropic/claude-opus-5-5: Nothing moved: After keeps every fact Before kept. Both outputs rebase home onto origin/main first, then replay #13 and #14 in listed order with `rebase --no-rebase-merges --onto HEAD <BASE_SHA> <original head>`, follow each success with `update-ref refs/heads/fix/retry HEAD` and `checkout fix/retry`, and show a first-parent history with no merges. Both fetch and verify all three objects and remote heads before any write and state that a moved/unreachable #14 stops with a message naming #14 before `worktree add`/checkout. Both record pre-rework refs for all three heads, leave origin member branches at bbbb…/cccc…, persist rework-base at 1111… and validate its ancestry while explicitly not asserting original-head ancestry. Both reports list the three full PR/Pre-rework pairs home first, `Member replay: #13 fffffff..1111111`, `Member replay: #14 empty`, `rebased: aaaaaaa..1111111`, and the full Rework base immediately after Base SHA. The only visible After drift is cosmetic: `Threads: none` collapsed from the per-PR form, and the prose grew noticeably (tables, full gh query, extra read-back), which risks the 1100-word budget on longer cases; if you tighten, keep the per-member replay blocks, the pre-write #14 stop paragraph, and the report lines exactly as they are.
- pr-list-member-replay / github-copilot/gpt-6.1-sol: After keeps the preflight (fetch, three object checks, matching remote heads, and the #14 moved/unreachable stop placed before checkout), but then invents a rule that undescribed command outputs are empty and halts on the worktree list / branch --show-current read-backs, so it never performs the home rebase, the ordered #13/#14 detached replays with update-ref and checkout, the rework-base persistence and ancestry validation, or the Step 4 report — losing order, ancestry, and report. Nothing in the Change asks for a stop here; the case explicitly says status and ancestry checks succeed and supplies checkout HEAD aaaaaaa, so the wording that added 'required read-backs' for caller-supplied ROOT must state that read-backs whose success the caller's observations imply (worktree list showing the selected path, branch equal to BRANCH) count as satisfied, and that the narrator must not assign empty output to commands the case describes as succeeding. Keep Before's structure: preflight and stop location, provenance refs, home rebase then per-member rebase --no-rebase-merges --onto HEAD BASE_SHA <original head>, update-ref/checkout after each, rework-base at the final tip with its own ancestry check, and the home-first report with full Rework base immediately after Base SHA.

exit: 1
