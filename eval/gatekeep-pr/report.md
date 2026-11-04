# eval report: gatekeep-pr (partial run: blockers-bare-fix)

for: 0d9e52ed95f3a1b17bb5de7faa3aca51c757fc4e1ca1843916484b3a70b38261

wall: 90s

## Change

Retain finding artifact locators and row history across wave settlement and private handoffs until terminal teardown, with missing-locator validation at the continuation owners. Admit failed needs/contract-exception companion results without charging a round; charge an independent ordinary source-changing result in the same pass once. Selected samples are blockers-bare-fix (two serial loop rows and scoped commands), description-not-a-row (no row for body-only work, stale head/body comparison, readback and affected-claim recheck), and prior-review-delta (separate needs-stop and successful prior-closure checkpoints). Preserve the posted text and locator for open prior-review items. This is sample-scoped coverage, not a target-wide pass or live admission/push verification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| blockers-bare-fix | anthropic/claude-opus-5-5 | improved | 22226 | b1: fails -> holds (unplanned improvement); b2: holds -> holds (held); b3: holds -> holds (held); b4: holds -> holds (held) |
| blockers-bare-fix | github-copilot/gpt-6.1-sol | improved | 28019 | b1: fails -> holds (unplanned improvement); b2: holds -> holds (held); b3: holds -> holds (held); b4: holds -> holds (held) |

## Feedback

- blockers-bare-fix / anthropic/claude-opus-5-5: After satisfies all four facts: two serial `loop-implementer` rows (row 1 -> P1, row 2 -> P2) with ledger pending tuples, nits excluded with no payload or helper, the pytest scoped command on the P1 task, and the rspec command for P2 chosen by the `dashboard/` prefix with the path made relative. Before fails b1 only on its literal wording: it dispatches two serial `implementer` helpers with no row/ledger concept and never names `loop-implementer`, so a careful reader cannot say 'two loop-implementer rows' were dispatched; this is the sample the Change targets, so the wording delivered the intended `loop-implementer` row structure. One caution on b3 in After: the ledger file carries `verification: sh scripts/run-all-tests.sh` and the row task passes that ledger as a parameter; the task text itself does not carry the command and explicitly says 'never record the verification command', so b3 holds, but to keep it unambiguous, state in the dispatch narration that the verification line is ledger metadata the helper must not run, and keep `SCOPED_TEST_COMMANDS` as the only test command string placed in the task.
- blockers-bare-fix / github-copilot/gpt-6.1-sol: After moves b1 from fails to holds only because Before never dispatches `loop-implementer` rows at all: it dispatches two plain `agent: "implementer"` subagents with no spec/ledger row structure, so a careful reader cannot say "two loop-implementer rows" of that text, whereas After names the agent, numbers row 1 (P1) and row 2 (P2), and dispatches them synchronously one after the other. Two things in After are worth tightening so b3 and b4 stay robust: the ledger written in step 3 records `verification sh scripts/run-all-tests.sh`, and both tasks carry the absolute ledger path plus a reference to "the full verification command"; the task text itself never contains the string, so b3 still holds, but a sentence such as "the ledger's verification entry is retained for the reviewer only; neither task text names `sh scripts/run-all-tests.sh`" would remove the ambiguity. For b4, neither Before nor After actually states that the rspec runner was chosen by the `dashboard/` directory prefix of the finding's file over the Python runner — both just list the two commands and note the relative path — so adding one line in step 3 like "row 2's file sits under `dashboard/`, so the `## routing` dashboard runner wins over the Python runner" would make the fact explicit rather than inferred.

exit: 0
