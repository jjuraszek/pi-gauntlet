bundle-: skills/gauntlet/ship/pr-branch-push.md
bundle-: skills/gauntlet-resume/reference/coordinated.md
bundle+: skills/gauntlet-resume/reference/reconstruction.md
bundle+: skills/gauntlet/implement/loop/loop.md
bundle+: skills/gauntlet/implement/loop/coordinated-legs.md
bundle+: skills/gauntlet/implement/loop/interrupted-recovery.md
# Input

At finish Step 1 on an authorized ledger restore, before verification or new work, narrate the independent ledger-only observations below. Do not execute tools or deliver anything. Use at most 650 words. Identity, membership, spec approval and phase restoration are already admitted. Home repo-a worktree /work/repo-a/.worktrees/shared, companion repo-b worktree /work/repo-b/.worktrees/shared; primaries /work/repo-a and /work/repo-b. The durable home artifact doc/plans/shared-ledger.md is present and begins # Ledger - loop engine, **Spec:** doc/specs/shared.md, verification: npm test, checks: commands, allowance: 14, returned: none. Both legs are seeded. Mapping assigns row 1 to repo-a and row 2 to repo-b. The committed home ledger at unchanged home HEAD aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa has iterations: 2, row 1 done, attempts 1, evidence node --test test/home.mjs; passed, and row 2 open, attempts 0, evidence empty. One prior decision belongs to row 1.

A - interrupted companion return: only the expected dispatch dirt exists in home: iterations: 3 and pending: 2 | repo-b | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb; returned: none is unchanged. Repo-b is clean with exactly one new commit cccccccccccccccccccccccccccccccccccccccc after that pre-dispatch SHA. Its body is empty. Repo-b's git rev-parse --path-format=absolute --git-dir returns /work/repo-b/.git/worktrees/shared. The durable checkout-local return file /work/repo-b/.git/worktrees/shared/gauntlet/returns/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-3.md contains exactly:

```text
pending: 2 | repo-b | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
iteration: 3

| 2 | done | 1 | node --test test/shared.mjs; passed |

row 2 done | shared test passed | next row none
```

All attribution, evidence and decision validations pass. The dispatch task carried iteration: 2. No parent home-ledger record commit exists yet. Explain the admission boundary, how the return-file path is recomputed and which of its lines are matched against the tuple and consumed count, the pre-dispatch home snapshot used for expected-dirt comparison versus the bumped durable home ledger used for result admission, the exact once-only parent update/commit and refresh, and what precedes the first gate-set execution. Home artifact has not been stripped; its presence and the missing parent record are observed, not an absent pre-strip source.

B - repeat restore after A: the parent home-ledger record commit is already present, ledger clean, pending absent, iterations: 3, returned: 2 | repo-b | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, row 2 done attempts 1 with admitted evidence and companion SHA. The return file has been deleted after admission; the companion pre-dispatch SHA is not a home object. No new companion commit or unsettled home child return exists. Explain whether any parent update, dispatch or counter increment repeats; continue normal restore and require fresh verification, not historical gate credit.

C - rejected companion return: reset to A's persisted tuple/count and pre-dispatch rows, but there are two new companion commits after bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb. Home HEAD is unchanged with only expected dispatch dirt; the tuple and unchanged pre-dispatch home snapshot are recoverable. Reset/clean of both checkouts and the ledger-only repair commit succeed. Explain rejection before result admission, common interrupted recovery before refresh with both reset targets, once-only failed-attempt accounting with the repaired row 2 cells and repair decision, and return to the ordered table; never admit the two-commit result as successful or run verification over it.

D - unavailable before-image: independently, use C's observed two-commit companion boundary, but reading the pre-dispatch home ledger fails and no saved snapshot exists. Explain the stop before refresh, repair, verification or redispatch, preserving the on-disk tuple/count, rows, decisions and checkout bytes.
