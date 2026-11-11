# Ledger - loop engine
**Spec:** `doc/specs/2026-11-11-leg-trees-located-not-recorded.md`
base: 4dcd1f4c71da8f2ee56a8491727e40233ca4733f
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
| 11 | open | 0 | timeout -k 30 10 python3 -c 'assert "Resolve an absent location from the leg" not in __import__("pathlib").Path("skills/gauntlet-resume/reference/brief-contract.md").read_text(), "absent companion still derives its location from recorded home"'; exit 1: absent companion still derives its location from recorded home; no paid or external action launched; paid eval hold retained: bare 5 did not approve the fourteen-call bound |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 1
