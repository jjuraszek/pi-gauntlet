bundle-: skills/gatekeep-pr/reference/assessment.md
bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/cleanup.md

## Scenario

Harness: pi. Gatekeep is in a deliver course on PR 84, "Bound retries", in synthetic repository example/widgets. Worktree /work/widgets-pr-84 is clean. The assessed pushed head is aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, local HEAD is bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, and MB is cccccccccccccccccccccccccccccccccccccccc. The PR promises that a zero retry limit never retries. Viewer is the human author with WRITE permission. The head is pushable, mergeable MERGEABLE and not BEHIND. No binding checks, description payloads, reply picks, sync conflict, or pending helper exists. The original intent remains authoritative. Source findings P1, P2 and P3 are Moderate file blockers with no shared files. Helpers are available. The runtime phase tracker has no active verify window.

The readable continuation record /tmp/gatekeep-state-row84 has course deliver, rounds_used 1, rounds_cap 10, syncs_used 0, syncs_cap 10, and repair.wave.spec /tmp/gatekeep-state-row84-spec.md and repair.wave.ledger /tmp/gatekeep-state-row84-ledger.md. The derived spec has AC 1 P1 (zero retries), AC 2 P2 (negative retries), AC 3 P3 (fractional retries), and row n maps to AC n, leg gatekeep. The ledger has allowance 4, iterations 5, no pending tuple, and these rows:

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | failed | 4 | node --test test/zero.test.mjs; zero still retries |
| 2 | failed | 1 | node --test test/negative.test.mjs; negative still retries |
| 3 | open | 0 | |

Existing decisions end with:
row 1 failed | Zero still retries. | Keep test/zero.test.mjs and repair the zero branch.
row 1 escalated | implModel round | allowed attempts 4
row 2 failed | Negative still retries. | Keep test/negative.test.mjs and repair the negative branch.

P1's last reviewer closure is open - zero still retries. Consecutive validation misses are zero for every row. Retained settings are loopEngine.maxIterationsPerRow 4, escalateAfter 3, closureReview.maxFixRounds 5, and escalationLoop.implModel is the opaque resolved value MODEL_ESC. SCOPED_TEST_COMMANDS is node --test test/negative.test.mjs for row 2, node --test test/fractional.test.mjs for row 3. Verification is npm test and remains whole-suite only.

## Entry

Process each independent checkpoint below from its stated state; do not combine them. Show the row disposition, persisted changes, and first next dispatch or obstacle. Do not invent a returned worker result. Keep all checkpoints together under 2000 words.

A. Continue from the ledger above. State which row runs next, what happens to P1 and its history, and what text P1's item carries if the user later explicitly selects a review post. Stop at the next dispatch, before a return.

B. Start from the same checkpoint, except row 2 is failed at attempts 2 after two consecutive validation misses (wrong body then empty diff), with evidence "attempt 2: empty diff" and no admitted decision for those misses. Row 3 is still open at attempts 0. Show the first next dispatch and which rows are not dispatched.

C. Use checkpoint B but row 3 is done at attempts 1 and P3's reviewer closure is resolved. The latest round ended counted false; no reviewer ran in it. No eligible row remains. Show the exit and retained information, including the available row 1 decision. Then the human selects obstacle deliver, raising both wave caps to 20 without changing any failed prerequisite; state whether that permits another P1 or P2 attempt.

D. Use checkpoint A except row 1 is done with P1 resolved, row 2 is failed at attempts 3 without an escalated marker, and retained implModel is undefined. Show the next action and every ledger/counter mutation, if any.

E. Three independent variants of D have MODEL_ESC available: (i) attempts 3, allowance 4, no marker; (ii) attempts 4, allowance 6, existing row 2 escalated marker from attempt 4; (iii) attempts 0, allowance 1, no marker. Show the next dispatch's model field or its omission and the escalation decision written before dispatch, if any; keep the existing attempts unchanged until a worker returns.

F. Start from checkpoint A but rounds_used equals rounds_cap at 10. Row 2 still has allowance left. Show whether the wave dispatches row 2 or exits and which state is retained.
