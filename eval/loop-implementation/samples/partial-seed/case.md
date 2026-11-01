bundle-: agents/loop-implementer.md

Act only at seed return admission. Stop after admission or rejection, before seed retry or target selection. Tools are unavailable; narrate the calls, not successful execution. Treat each snapshot independently.

Home saved ledger: checks: commands, iterations: 0, allowance: 4, verification: npm test. Rows 1, 2 and 3 are open attempts 0 evidence empty. Row 4 is cut attempts 0 evidence deferred: later. No decisions exist. The driver persisted iterations: 1 and pending: seed | home | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa before dispatch. The returned home tree is clean with exactly one new commit after that SHA, subject loop: seed evidence. The first body lines are the exact pending tuple and iteration: 1. Its ledger clears pending and otherwise preserves headers, prior decisions and every row except the changes below.

A. Only row 2 gets evidence check-state; assertion mismatch, remaining open with attempts 0. Append row 0 done | seeded 1 rows, closed 0 on baseline | row 1. Rows 1 and 3 remain open with empty evidence. Decide admission and state the surviving ledger cells and counters. Check-state is a supplied check name; do not validate its command syntax.

B. Give rows 1 and 2 passing evidence check-label; passed and check-state; passed, both done with attempts 0. Row 3 stays open with empty evidence. The single seed decision reports seeded 2 rows, closed 2 on baseline, next row 3. Decide admission. Also decide the full-coverage variant where all three open rows receive passing evidence and the decision reports seeded 3 rows, closed 3 on baseline, none remaining.

C. Independently change A to: (1) no row receives evidence and the decision reports seeded 0 rows; (2) row 2 attempts becomes 1; (3) row 2 becomes failed; (4) the cut row changes; (5) report seeded 3 rows despite only row 2 receiving evidence; (6) omit the seed decision; (7) append a second seed decision. Decide every variant. Do not prescribe retry or repair behavior in this snapshot.

D. Coordinated companion: home has rows 1 and 4, companion repo-b has rows 2, 3 and 5, with row 5 cut. All open rows start attempts 0 with empty evidence. The mapping, bases, allowance 4 and seeded repo-a: yes are held. Home durably contains iterations: 2, seeded repo-b: no and pending: seed | repo-b | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb. Home HEAD is unchanged with only the expected bump/tuple dirt. Companion is clean with one new commit after its pending SHA, subject loop: seed evidence and body:

pending: seed | repo-b | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
iteration: 2

| 3 | done | 0 | check-state; passed |

row 0 done | seeded 1 rows, closed 1 on baseline | row 2

Decide admission, the rows/decision/SHA to record in the single parent ledger commit, seeded flag, tuple removal and counters. Row 2 is intentionally absent from the returned rows. Also decide variants with row 1 (foreign) or row 5 (cut) substituted, an empty row list with seeded 0, and a count of seeded 2 with the same single returned row. Preserve all omitted rows, mappings and foreign state. Do not continue to dispatch selection.

Across A-D, state whether the parent runs any evidence check, gate or full verification during admission. This exercise covers seed admission, not ordinary returns or seed retry policy.
