# Hotfix attempt budget

Before writing `pending:` or bumping `iterations:`, read `allowance:` and the applicable counter from the ledger. Permit a dispatch only while that counter is below the allowance; otherwise abort pre-land with the exhaustion report.

| Budget | Counter used | Pi escalation |
|---|---|---|
| Seed (`target: seed`) | Count of `repair seed` lines in `## Decisions` | Never |
| Row (`target: 1` before its first pass) | Row 1's `attempts` cell | `attempts == allowance - 1` |
| Repair (`target: 1` after its first pass) | `attempts - k`, with `k` from the first-pass marker | `attempts - k == allowance - 1` |

## Seed

On a retryable seed miss in step 4:

1. Append `repair seed | seed miss: <concrete miss> | iteration <consumed>` to `## Decisions`. Use the bumped `iterations:` value. Leave row 1 `| 1 | open | 0 | |`.
2. Clear `pending:`. On pi, delete the return file through step 4's deletion recipe. Keep any missed commit on the hotfix branch; start the next attempt from its tip without resetting. Squash delivery keeps its surviving tree changes; PR delivery keeps the commit in branch history.
3. Count the `repair seed` lines again. At the allowance, abort pre-land with the exhaustion report, without another attempt. Below the allowance, redo the inline seed or repeat the full pi dispatch with `target: seed`, `previous decision: none`, and `seed miss: <concrete miss>` appended to the original seed hint.

## Row and repair

On the first admitted `done`, append `row 1 passed | first done | attempts <k>` to `## Decisions`, using the admitted attempts value for `k`. Keep that single snapshot on every later pass. Count every `target: 1` admission or validation miss in `attempts`; never reset or reduce it.

On a red gate, open conformance gap or `FIX_FIRST`, reopen before checking the repair budget. Write row 1 `failed`, attempts unchanged, with evidence `<stage> red: <command>; <first result line>` (for a reviewer, use its dispatch and first gap or finding). Append `row 1 reopened | <stage>: <bounded reason, 200 chars> | 1` and pass that line as `previous decision`. This records the final reopen even when no repair remains.

Route each repair through step 4 with `target: 1`. Invalidate earlier step 6 and 7 approvals on every admitted repair. Only `done` resumes at step 5: require a passing gate, conformance pass and `SHIP` on the same final HEAD. After `failed` or a validation miss, keep row 1 `failed` and recheck the repair budget without another reopen or gate run. Pass the admitted failure as `previous decision`, or `none` after a miss. Keep reviewer redispatch limits, `REJECT` and invariant-violation aborts outside the budgets.

## Pi escalation

For the last permitted row or repair dispatch, require resolved `escalationLoop.implModel` (the resolver's main-loop fallback counts). If undefined, abort pre-land with `Problem: escalationLoop.implModel unavailable`, without dispatch or escalation line. Otherwise append the applicable line to `## Decisions` before dispatch:

- Row: `row 1 escalated | implModel round | allowed attempts <allowance>`
- Repair: `row 1 escalated | implModel repair round | allowed repairs <allowance>`

Add `model: <implModel>` only to those two dispatches. At allowance 1, each is its budget's only dispatch. Keep the `previous decision` and hint the dispatch would otherwise carry; the escalation line supplies neither.

## Repair hints

| Repair source | Hint |
|---|---|
| Red gate | `hint: gate failed: <command> \| checkout <WORKTREE> \| exit <code> \| log <absolute $TMPDIR log path>`; the child reads the log |
| Conformance gap | One `gap: <requirement> - <reviewer's one-line reason>` per gap, at most 20 lines, plus `report: <absolute $TMPDIR path>` for the full verdict |
| Review | One `finding: <severity> <file:line> - <title>` per Critical or Moderate finding, at most 20 lines, plus `report: <absolute $TMPDIR path>` for the full verdict |

## Two-miss hint

Read the streak from `## Decisions`: count `repair row 1` lines since the last admitted `row 1 done` or `row 1 failed` decision, or from the start when neither exists. Ignore seed lines and `row 1 reopened`, `row 1 escalated` and `row 1 passed` markers. An admitted row return ends the streak even when the row remains `failed`.

At two or more consecutive misses, append `two returns broke the contract: <concrete miss>` to the next permitted `target: 1` dispatch's hint, after any repair hint lines. Use the concrete miss from the latest miss evidence. Below two, omit this line. The hint grants no extra attempt.

## Exhaustion report

On pi and inline, print these before step 3 tears down the ledger:

1. `seed: <s> of <allowance>`, where `s` counts `repair seed` lines, not dispatches.
2. Row 1's `attempts` cell verbatim.
3. `repairs: <attempts - k> of <allowance>`, or `repairs: none - row 1 never passed` without the pass marker.
4. Every `## Decisions` line verbatim in ledger order, including the final reopen.

## Terms in the hotfix procedure

Read "no attempt remaining" in steps 5-7 as no dispatch permitted by the applicable budget. In the protected blocks, "implementer" means the `loop-implementer` child; "the child's status line" means its admitted decision or mandated `BLOCKED:` first line. Route no `NEEDS_CONTEXT`: no child emits it. Read "red after retry" as a red gate run with the applicable budget exhausted; "unfixable conformance gap" as a gap still open with the repair budget exhausted; and "a non-`SHIP` re-review" as `FIX_FIRST` with the repair budget exhausted, `REJECT`, or an invariant violation.
