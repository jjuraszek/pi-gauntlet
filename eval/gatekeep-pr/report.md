# eval report: gatekeep-pr (partial run: nit-batch-row)

for: e1168838fb6fa50d4e26c2cb5f42e029e06fee5f268b0a3173087adea30031f1

wall: 149s

## Change

Retain assessment-only runs without finding artifacts and the viewer's newest posted review as the bounded review baseline on a second run. Refresh prior-review-delta's delivery fixture to use loop row result commits, including P2's admitted failed attempt, instead of native open returns. No instruction behavior changes in this iteration; prior-review selection and ancestry sources remain unchanged. Selected model coverage is prior-review-delta only, including explicit no-ledger checkpoints and failed-result narration, not live admission or lifecycle recovery. Preserve earlier selected sample records and partial reports.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| nit-batch-row | anthropic/claude-opus-5-5 | improved | 17825 | n1: fails -> holds (unplanned improvement); n2: fails -> holds (unplanned improvement); n3: fails -> holds (unplanned improvement); n4: fails -> holds (unplanned improvement); n5: fails -> holds (unplanned improvement); n6: holds -> holds (held); n7: fails -> holds (unplanned improvement); n8: holds -> holds (held) |
| nit-batch-row | github-copilot/gpt-6.1-sol | inconclusive | 20884 | n1: fails -> holds (unplanned improvement); n2: fails -> holds (unplanned improvement); n3: fails -> holds (unplanned improvement); n4: fails -> holds (unplanned improvement); n5: fails -> holds (unplanned improvement); n6: holds -> fails (regression); n7: fails -> holds (unplanned improvement); n8: holds -> holds (held) |

## Feedback

- nit-batch-row / anthropic/claude-opus-5-5: After moved n1, n2, n3, n4, n5 and n7 from fails to holds: Before explicitly denied that any derived spec or companion ledger exists, split N1 and N2 into separate wave rows, and wrote no sibling artifact paths, whereas After writes the spec and ledger beside the OS-temp record, persists their paths in repair.wave.spec/ledger, builds exactly three ACs/rows (P1+L2 with termination evidence, P2 with lost-error evidence, one nit batch for N1+N2 with the union of prefixed scoped commands), keeps npm test as the ledger's never-recorded verification command with no commands column, and repeats the same one-row shape for the terminal fix-nits checkpoint without a standing course. Both outputs keep n6 (P3 stays in description repair with compare-and-swap and a fresh recheck; C1 stays a draft behind a typed reply pick) and n8 (stop before any dispatch, review, push or external write; the ledger's iterations/pending write is narrated only as what would happen). No fact that Before held was lost, so the After wording delivers the change intact; the only caution is to keep the pre-dispatch ledger writes (iterations: 1, pending tuple) clearly conditional so a reader does not mistake them for having already happened before the stop.
- nit-batch-row / github-copilot/gpt-6.1-sol: After now produces the derived spec and companion ledger that Before explicitly refused to write, so n1–n5 and n7 flip from fails to holds: three ACs/rows with P1+L2 merged, P2 alone, one N1+N2 nit batch, the Scope block carrying title/body/original intent/spec path, sibling artifact paths persisted in repair.wave.spec/ledger, npm test confined to the ledger verification field, and the union of scoped commands handed to the nit row as task input. The one regression is n6: Before stated that P3's description repair would still run fresh head/body checks and a fresh description-recheck helper before closing only the source-backed claim contribution, whereas After only says the course 'authorizes its separate description-repair procedure' and that P3 'is not marked resolved' — a careful reader cannot see the fresh head/body comparison or claim recheck retained. To keep n6 while preserving the new artifacts, add one sentence to the P3 paragraph such as: 'When that procedure runs it still performs a fresh head/body comparison against the record and a claim recheck before closing only the contradicted-example contribution.' C1's handling is fine as written.

exit: 1
