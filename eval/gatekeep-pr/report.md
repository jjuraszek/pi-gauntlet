# eval report: gatekeep-pr (partial run: nit-batch-row)

for: f93959199c9490c9c6a256a4364809bebf96e43f318d890b8ddd8225579461d2

wall: 77s

## Change

Consolidate menu availability, picks and recommendations in menus.md's States and action/final/post tables; delete decision-menu.md and route its readers to the owner. Preserve pick authority, bypass preconditions, capped work, payload freshness and terminal settlement. Preserve plain reports and the one-pick post lifecycle from the earlier increments.

Remove the deleted file's bundle exclusions from per-ref-settlement, reviewer-row-reopen, loop-worker and nit-batch-row. Select only those four samples: require every candidate fact on both models, including full-head settlement, grouped reviewer reopening, failed-row retry accounting and the single nit batch. Their expected facts do not change. Run them serially to isolate the shared report writes, with the runner's model-cell pool within each sample.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| nit-batch-row | anthropic/claude-opus-5-5 | unchanged | 17914 | n1: holds -> holds (held); n2: holds -> holds (held); n3: holds -> holds (held); n4: holds -> holds (held); n5: holds -> holds (held); n6: holds -> holds (held); n7: holds -> holds (held); n8: holds -> holds (held) |
| nit-batch-row | github-copilot/gpt-6.1-sol | unchanged | 20903 | n1: holds -> holds (held); n2: holds -> holds (held); n3: holds -> holds (held); n4: holds -> holds (held); n5: holds -> holds (held); n6: holds -> holds (held); n7: holds -> holds (held); n8: holds -> holds (held) |

## Feedback

- nit-batch-row / anthropic/claude-opus-5-5: No fact moved. After keeps every fact Before kept: the delivery checkpoint still mints exactly three ACs/rows (P1+L2 with termination evidence, P2 with lost-error evidence, one N1+N2 nit batch), the spec Scope still carries the PR title/body, original intent and the assessed-head doc/specs/retry-budget.md contract, the ledger header and rows match n3 exactly, both artifacts are written as record siblings in /tmp with their paths persisted in repair.wave.spec/ledger and explicitly never staged, the nit row carries the union of the two cd-prefixed scoped commands with npm test confined to the ledger verification line, P3 goes through description repair with a fresh head/body compare and a narrow claim recheck while C1 stays an unposted draft awaiting an explicit reply pick, the terminal checkpoint uses its own -terminal.record siblings with one AC/one row and no standing course, and both parts stop before any dispatch, review, push or external write. Two minor wording points worth watching, though neither broke a fact: After's C1 paragraph adds 'or a post-menu pick' alongside 'reply <n>'—keep it phrased as an explicit pick so n6 stays unambiguous—and After's P3 step 3 names 'gh pr edit' inside the described sequence; the 'None of that runs here' sentence is what keeps n8 intact, so retain an explicit no-run statement adjacent to any command named in a future-sequence description. The consolidation into menus.md's States/action/final/post tables is delivering the Change without loss here.
- nit-batch-row / github-copilot/gpt-6.1-sol: Nothing moved: After keeps every fact Before kept. Both outputs derive the same three ACs/rows (P1/L2 together, P2, one N1+N2 batch), the same Scope block with PR title/body, original intent and doc/specs/retry-budget.md at the assessed head, identical ledger headers and open rows mapped under gatekeep, sibling /tmp artifacts persisted in repair.wave.spec/ledger without staging or commit, the union of cd-prefixed scoped commands for the nit row with npm test confined to the ledger verification line, P3 and C1 kept out of the ledger with description-repair freshness and the unposted reply draft preserved, a one-AC/one-row terminal checkpoint with course null and no standing nit course, and a stop before any dispatch or external write. Two minor wording risks in After worth watching: the delivery checkpoint describes the nit row's commands in prose ("both commands above") rather than showing the literal task block as Before and the terminal section do, and the terminal sentence "I retain this selection through repair, review, push, watch, and reconciliation" could be misread as performing those stages; rendering the SCOPED_TEST_COMMANDS block for the delivery nit row and phrasing the retention as "would survive" future stages would make n5 and n8 unambiguous while still delivering the menus.md consolidation.

exit: 0
