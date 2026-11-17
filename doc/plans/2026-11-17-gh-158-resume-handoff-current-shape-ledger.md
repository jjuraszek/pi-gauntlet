# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-158-resume-handoff-current-shape.md`
base: 2fec03a78deb7343441354d76dd9c625b5a86efc
verification: npm test
checks: commands
iterations: 4
allowance: 10
returned: 2 | home | 201fb588c9d42c25d2f6fe3810a854a579eb613d

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 1 | reopened by amendment: C1 primary-session read traces authorized; route and byte requirements remain |
| 2 | failed | 2 | timeout -k 30 30 node --test scripts/resume-current-stages.test.mjs; unreachable: C3 paired replay records absent - primary Pi session; 4 preflight and fixture checks passed; 3 paired-record checks failed |
| 3 | open | 0 | |
| 4 | open | 0 | timeout -k 30 10 python3 -c 'assert (files := [*__import__("pathlib").Path("skills/gauntlet-resume").rglob("*.md"), *__import__("pathlib").Path("skills/gauntlet-handoff").rglob("*.md")]) and not (hits := [(str(path), term) for path in files for term in ("legacy", "migrat", "conversion") if term in path.read_text().lower()]), locals().get("hits", "No instruction files selected")'; exit 1: AssertionError with 7 forbidden-term hits across 3 resume files; reconstruction.md still contains Legacy repair markers and Legacy pending recovery; structural seed only, not a read trace |
| 5 | cut | 0 | deviates: the request removes backward compatibility, so such a ledger stops instead of converting |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 4
row 1 failed | Checked for saved tool-enabled resume transcripts and recorded the missing C1 evidence. | Capture C1 ledger and task-plan traces from the primary session, then pass those artifacts to this worker; do not substitute text-only evals.
amended | cut row 1 | Unavailable single-repo read trace
row 2 failed | Checked the saved resume fixtures and found no recorded plan-stage brief for the required C3 paired restore. | Supply C3 paired stage replays from a primary session allowed to launch Pi; do not substitute static call-table assertions for recorded-input equivalence.
amended | 2 item(s) | Restore row 1 and authorize C1-C4 primary-session evidence
row 2 failed | Prepared three C3 stage fixtures and a freshness-bound paired-replay check; primary-session replay records are still missing. | Reuse current-*-brief samples with --base 09c9f4e1 in the primary session, then run scripts/resume-current-stages.test.mjs; do not recreate fixtures.
