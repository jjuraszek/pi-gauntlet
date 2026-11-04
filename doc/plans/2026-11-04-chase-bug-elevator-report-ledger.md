# Ledger - loop engine
**Spec:** `doc/specs/2026-11-04-chase-bug-elevator-report.md`
base: 78e63174692a261a5864a27b17f8ba3727a388aa
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
| 9 | open | 0 | node -e '[["skills/chase-bug/SKILL.md",500],["skills/chase-bug/reference/verdict-report.md",2000]].forEach(([p,cap]) => (s => require("node:assert").ok([Buffer.byteLength(s) < 50000, s.split("\n").length - Number(s.endsWith("\n")) < cap].every(Boolean), p))(require("node:fs").readFileSync(p,"utf8")))'; exit 1: missing skills/chase-bug/reference/verdict-report.md; SKILL.md passes size limits at 484 lines and 27000 bytes |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: add the report contract and its selected behavioral check
