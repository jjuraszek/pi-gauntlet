# Ledger - loop engine
**Spec:** `doc/specs/2026-11-12-repo-housekeeping-skill.md`
base: 92eb7a087670521a6117c5e39c06066de0a5bbc7
verification: npm test
checks: commands
iterations: 1
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |
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
| 15 | open | 0 | timeout -k 30 10 python3 -c 'assert "disable-model-invocation: true" in __import__("pathlib").Path("skills/housekeeping/SKILL.md").read_text().split("---", 2)[1].splitlines() and "./skills/housekeeping" in __import__("json").loads(__import__("pathlib").Path(".claude-plugin/marketplace.json").read_text())["plugins"][0]["skills"]'; exit 1: skills/housekeeping/SKILL.md is missing; static registration check only, runtime loading untested; no paid or external action launched, no jobs file created |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
