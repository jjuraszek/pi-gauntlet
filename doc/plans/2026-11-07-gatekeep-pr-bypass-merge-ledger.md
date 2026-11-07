# Ledger - loop engine
**Spec:** `doc/specs/2026-11-07-gatekeep-pr-bypass-merge.md`
base: b9dd8f39286fdf8d13eb84a612885b2b835e617c
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | failed | 1 | timeout -k 30 20 python3 -c 'assert "ruleset bypass authority" in __import__("pathlib").Path("skills/gatekeep-pr/reference/menus.md").read_text(), "final template lacks ruleset bypass authority"'; unreachable: non-admin bypass observations and bounded probe authorization absent - GitHub BLOCKED PR with a non-admin ruleset actor in always and pull_request modes; exit 1: final template lacks ruleset bypass authority; no paid or external actions launched |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | timeout -k 30 20 python3 -c 'assert (lambda t: all(s in t for s in ("ruleset bypass actor", "ordinary `merge` row", "CI evidence still binding")) and "every other merge precondition still withhold" not in t)(__import__("pathlib").Path("README.md").read_text()), "README lacks the bypass contract or still withholds unconditionally"'; exit 1: README lacks the bypass clause and still says every other merge precondition withholds; no paid or external actions launched |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 6
row 1 failed | Confirmed the missing bypass menu clause but could not settle its eligibility source without non-admin observations; no paid or external actions ran. | Supply anonymized non-admin GraphQL observations for always and pull_request modes from an authorized GitHub venue before source edits; do not infer eligibility from synthetic fixtures.
