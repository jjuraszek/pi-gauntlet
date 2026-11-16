# eval report: conformance-reviewer (partial run: legs-verification-line)

for: 45d48bd3ee0afb7ecc98812c2f6e7bc614d3ef12927593316fbdc0dd0f55a965

wall: 32s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The selected sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence. Coverage is limited to legs-verification-line.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| legs-verification-line | anthropic/claude-opus-5-5 | improved | 9429 | f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); f1: fails -> holds (intended change) |
| legs-verification-line | github-copilot/gpt-6.1-sol | improved | 8237 | f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); f1: fails -> holds (intended change) |

## Feedback

- legs-verification-line / anthropic/claude-opus-5-5: The After wording moved f2 only. Before raised MISSING rows and gap blocks for the PR gate `npm run pr-check` and the green exact-head CI ship evidence (G2, G3), and its origin-drift line named the ship-evidence requirements. After has no row, gap block, drift note or skipped-clause explanation for any stage clause and reports CONFORMS. f3 and f4 did not move as you expected, because Before already satisfied them: it had DELIVERED rows for trimming and lowercasing citing src/label.mjs:2, and its own DELIVERED row quoting "regenerated bundles committed" with evidence in bin/widget.mjs. The change therefore preserved those facts on this sample rather than fixing them. To keep them stable, keep the wording explicit that a leg verification line is split clause by clause: file deliverables such as committed regenerated bundles stay as requirements with their own row, quoted origin and file evidence, while delivery-stage clauses (PR gate commands, CI or ship evidence, test runs with no supplied result) are dropped silently, with no row, no gap block, no drift entry and no note explaining the omission. After also silently drops `npm test`, which fits the Change, but the wording should say whether test-run clauses count as stage clauses so that does not vary between runs.
- legs-verification-line / github-copilot/gpt-6.1-sol: The After wording moved f2: Before raised G2 and G3 as MISSING gaps quoting "PR gate npm run pr-check" and "ship evidence is green CI on the exact PR head", while After has no row, gap block or drift line mentioning either and does not list or explain skipped stage clauses. f3 and f4 did not move as expected, because Before already satisfied them: its R2 and R3 were DELIVERED with src/label.mjs:2 and bin/widget.mjs:2 evidence, and its R4 was a DELIVERED row quoting "regenerated bundles committed" with bin/widget.mjs evidence. After keeps all of this, with R4 still quoting the file clause from the verification line alongside the prompt sentence, so nothing Before held was lost. Note that After also drops Before's "npm test" gap (G1) without comment; none of the facts here cover that, but if the wording is only meant to exclude the PR gate and ship evidence, state explicitly whether running the test command counts as a delivery-stage clause. To keep the result stable, keep the wording that splits the verification line clause by clause, treating file deliverables such as committed bundles as requirements with their own row and excluding stage clauses silently.

exit: 0
