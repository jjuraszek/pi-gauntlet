# Ledger - loop engine
**Spec:** `doc/specs/2026-11-08-gh-132-scripted-dispatch-guard.md`
base: 53894d66119fe8dbd40107b5add28f6c66d58fb7
verification: npm test
checks: commands
iterations: 1
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | timeout -k 30 10 python3 -c 'assert all(term in __import__("pathlib").Path("doc/configuration.md").read_text().split("## Extensions\n", 1)[1].split("\n### ", 1)[0] for term in ("subagent", "direct-only", "`only`", "unsupported", "entered")), "codemode paragraph lacks direct-only dispatch and only-mode entered-flow restriction"'; exit 1: codemode paragraph lacks direct-only dispatch and only-mode entered-flow restriction; no paid/external actions or background jobs launched |
| 5 | open | 0 | |
| 6 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
