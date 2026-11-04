bundle-: skills/gatekeep-pr/reference/decision-menu.md
bundle-: skills/gatekeep-pr/reference/menus.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
bundle-: skills/gatekeep-pr/reference/report.md
bundle-: skills/brainstorming/reference/menu-layout.md
## Digest

- pr: { number: 81, title: "Bound retries", body: "Stop after the configured retry budget.", author: "river-example", state: OPEN, isDraft: false, headRefName: fix/retries, baseRefName: main, headRefOid: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, mergeable: MERGEABLE, mergeStateStatus: CLEAN }
- base_repository: orchard/widgets; viewer: { login: river-example, is_author: true }; permissions: { viewer_permission: WRITE, head_pushable: true, head_url: "git@git.example.invalid:orchard/widgets.git", head_ref: fix/retries }
- worktree: /work/widgets-pr-81; HEAD aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, clean; no sync trigger; merge-tree exits 0; MB bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
- harness: pi; sequential fresh helper facility available; closureReview.maxFixRounds 5; loopEngine.maxIterationsPerRow 5; loopEngine.escalateAfter 3; escalationLoop.implModel resolves to the configured model; no phase-tracker verify window
- configuration at MB: AGENTS.md documents `node --test <files>` as scoped; .pi/gauntlet-overrides.md resolves verification command `npm test`; no other scoped runner
- scope: { source: pr, original_intent: { title: "Bound retries", body: "Stop after the configured retry budget." } }
- P1: Moderate blocker, retry budget is never decremented (src/retry.mjs:9); failing test test/retry.test.mjs expects termination at zero; drafted payload adds a branch before the loop; the finding can instead be closed by decrementing after each attempt; N1 unselected nit renames a local
- continuation record: /tmp/gatekeep-81.record; repair.course deliver, rounds_used 0, rounds_cap 10, syncs_used 0, syncs_cap 10; current wave pre_wave_head and round_start_head aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, counted false
- pi companion artifacts already exist and parse: /tmp/gatekeep-81.record-spec.md contains Scope with the title/body and one AC, P1 with the evidence above; /tmp/gatekeep-81.record-ledger.md points to it, base MB, verification npm test, checks commands, iterations 0, allowance 5, row 1 open with attempts 0 and empty evidence, mapping row 1 -> AC 1, leg gatekeep, no decisions
- pi row worker returns exactly one tracked source-changing commit cccccccccccccccccccccccccccccccccccccccc and a clean tree; subject `loop: row 1 done`; body starts `pending: 1 | gatekeep | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`, then `iteration: 1`, blank line, `| 1 | done | 1 | node --test test/retry.test.mjs; 1 passed; 0 failed |`, blank line, `row 1 done | Decremented the retry budget after each attempt. | Reuse test/retry.test.mjs for retry termination checks.`
- All omitted reads are clean and preserve the specified head until the worker commits; no network write occurs in this exercise.

### Independent ordinary-failure checkpoint

Reset to the same initial pi head, companion artifacts and counters above, independently of the successful pi checkpoint. The same row 1 worker instead returns the following ordinary failed result (no external prerequisite or scope-contract change):

- Exactly one tracked source-changing commit cccccccccccccccccccccccccccccccccccccccc, parent aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, clean tree. Its diff adds a partial decrement in src/retry.mjs and a regression test in test/retry.test.mjs; the zero-budget case still fails.
- Subject: `loop: row 1 failed`. Complete body:

```text
pending: 1 | gatekeep | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
iteration: 1

| 1 | failed | 1 | node --test test/retry.test.mjs; 0 passed; 1 failed |

row 1 failed | Added a partial decrement and a zero-budget regression test; zero still retries. | Check zero before starting the next attempt; keep the regression test.
```

If the next eligible row worker is dispatched, it returns exactly one tracked source-changing commit dddddddddddddddddddddddddddddddddddddddd, parent cccccccccccccccccccccccccccccccccccccccc, clean tree. It extends the partial decrement with the zero-budget guard and retains the regression test. Subject: `loop: row 1 done`. Complete body:

```text
pending: 1 | gatekeep | cccccccccccccccccccccccccccccccccccccccc
iteration: 2

| 1 | done | 2 | node --test test/retry.test.mjs; 1 passed; 0 failed |

row 1 done | Added the zero-budget guard to the partial decrement; the regression test passes. | Keep the zero-budget regression test for retry termination checks.
```

## Entry

The human selected deliver, not deliver with nits. Start immediately before the first file worker dispatch with the pi companion artifacts supplied above. Show the shared task context once, then the exact pi dispatch fields and pi tail, the pre-dispatch state writes, and the return admission including the updated row, decisions and round count. Stop before the pre-push reviewer.

Next show the independent ordinary-failure checkpoint: the failed return's admission checks and ledger/decision/counter effects, what happens to its partial work, and the next eligible dispatch with its previous decision and pre-dispatch state. Show the supplied retry result's admission and the final row, decision history and round count in this same round. Reuse the shared context and initial dispatch fields instead of repeating them; show the retry's changed fields exactly. Stop before the pre-push reviewer.

Finally show an independent Claude Code checkpoint at the same initial head and finding, with no companion artifacts. Show the native helper prompt as the same shared context plus its own tail, and describe its return checks for a failing scoped test restored to the initial clean head. Do not show a menu or push, and do not carry either pi checkpoint's commits into this checkpoint. Keep the complete narration under 1800 words.

## Arguments

`81`
