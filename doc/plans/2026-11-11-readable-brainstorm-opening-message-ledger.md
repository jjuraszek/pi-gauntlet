# Ledger - loop engine
**Spec:** `doc/specs/2026-11-11-readable-brainstorm-opening-message.md`
base: 19adc247477472360ead7877c939e838ab8a5491
verification: npm test
checks: commands
iterations: 3
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node -e 'require("node:assert/strict").deepEqual(Object.values(require("./eval/brainstorming/results/opening-message-shape/candidate.json").judge).map(j => Object.values(j.facts).map(f => f.after)), Array(2).fill(Array(6).fill("holds")))'; 2 replay models hold all 6 facts; bound spent: Model eval run (14 of 280), ran Model eval run (6 of 280); bound spent: Model eval run (28 of 280), ran Model eval run (10 of 280) |
| 2 | done | 0 | timeout -k 30 60 node -e 'require("node:assert/strict").deepEqual(Object.values(require("./eval/brainstorming/results/opening-message-shape/candidate.json").outputs).map(o => o.mechanical["word-bound"]), ["holds", "holds"])'; both replay models satisfy the 220-word span; cap and over-cap anchors pass the contract test |
| 3 | done | 1 | timeout -k 30 60 node -e 'require("node:assert/strict").deepEqual(Object.values(require("./eval/brainstorming/results/gate-line-first/candidate.json").judge).map(j => Object.values(j.facts).map(f => f.after)), Array(2).fill(Array(3).fill("holds")))'; 2 replay models hold all 3 facts with one locator-free Corrected line each; bound spent: Model eval run (42 of 280); ran Model eval run (34 of 280) |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | done | 0 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 58 passed, 0 failed; every checked claim is recorded before the opening message with both draft destinations |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 7
row 1 done | Added opening sections; bound spent: Model eval run (14 of 280); ran Model eval run (6 of 280); bound spent: Model eval run (28 of 280); ran Model eval run (10 of 280). | Reuse skills/brainstorming/reference/opening-message.md and the opening-message-shape saved replies to check later wording without model calls.
row 2 done | Checked both saved opening-message-shape replies against the 220-word fact and pinned the overflow rules. | nothing new to build on
row 7 done | Verified the evidence-write rule records held claims and names both draft destinations before sending. | nothing new to build on
row 3 done | Verified locator-free corrections; bound spent: Model eval run (42 of 280); ran Model eval run (34 of 280). | Reuse eval/brainstorming/results/gate-line-first/candidate.json for local correction and framing checks without model calls.
