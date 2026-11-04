# Ledger - loop engine
**Spec:** `doc/specs/2026-11-04-check-delivery-multi-ticket.md`
base: d3aa93b651f89223161c6039446cd8af3ee3296c
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
| 10 | open | 0 | node -e '["skills/check-delivery/SKILL.md", "skills/check-delivery/reference/batch.md"].map(p => require("node:fs").readFileSync(p, "utf8")).forEach(s => [require("node:assert").ok(Buffer.byteLength(s) < 50000), require("node:assert").ok(s.split("\n").length - Number(s.endsWith("\n")) < 2000), require("node:assert").ok(!s.includes("Input is exactly one tracker ref"))])'; exit 1: ENOENT skills/check-delivery/reference/batch.md; batch reference is missing |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 10
