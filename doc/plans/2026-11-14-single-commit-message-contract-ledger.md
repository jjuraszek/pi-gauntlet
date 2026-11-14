# Ledger - loop engine
**Spec:** `doc/specs/2026-11-14-single-commit-message-contract.md`
base: 04389adbc9a13d809c958d34ff2d96f3247f6a19
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | failed | 1 | timeout -k 30 10 python3 -c 'assert "wording:" in __import__("pathlib").Path("agents/loop-implementer.md").read_text(), "loop worker still prescribes local subjects instead of the shared wording input"'; exit 1: worker citation and wording input are missing; shared reference added with five sections and fixed bookkeeping subjects; no model samples run |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |
| 11 | open | 0 | |
| 12 | open | 0 | |
| 13 | open | 0 | |
| 14 | open | 0 | |
| 15 | open | 0 | |
| 16 | open | 0 | |
| 17 | open | 0 | |
| 18 | open | 0 | |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 1: add the shared reference and check its rules and commit-site citations
row 1 failed | Added the shared wording reference, but the worker still lacks its wording input and commit sites retain local templates. | Reuse commit-message.md; replace commit-site templates and pass wording/ticket inputs, then run the spec's selected evals.
