# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-158-resume-handoff-current-shape.md`
base: 2fec03a78deb7343441354d76dd9c625b5a86efc
verification: npm test
checks: commands
iterations: 2
allowance: 10
returned: 1 | home | a1b512c94c3bb10545b653ad65340347efba16f9

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | cut | 1 | deviates: unreachable in this checkout - C1 read-call transcripts absent and agent launches prohibited in this worker; proof at primary Pi session in a scratch checkout |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | timeout -k 30 10 python3 -c 'assert (files := [*__import__("pathlib").Path("skills/gauntlet-resume").rglob("*.md"), *__import__("pathlib").Path("skills/gauntlet-handoff").rglob("*.md")]) and not (hits := [(str(path), term) for path in files for term in ("legacy", "migrat", "conversion") if term in path.read_text().lower()]), locals().get("hits", "No instruction files selected")'; exit 1: AssertionError with 7 forbidden-term hits across 3 resume files; reconstruction.md still contains Legacy repair markers and Legacy pending recovery; structural seed only, not a read trace |
| 5 | cut | 0 | deviates: the request removes backward compatibility, so such a ledger stops instead of converting |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 4
row 1 failed | Checked for saved tool-enabled resume transcripts and recorded the missing C1 evidence. | Capture C1 ledger and task-plan traces from the primary session, then pass those artifacts to this worker; do not substitute text-only evals.
amended | cut row 1 | Unavailable single-repo read trace
