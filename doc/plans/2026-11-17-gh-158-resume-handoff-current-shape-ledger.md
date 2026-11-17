# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-158-resume-handoff-current-shape.md`
base: 2fec03a78deb7343441354d76dd9c625b5a86efc
verification: npm test
checks: commands
iterations: 8
allowance: 10
returned: 1 | home | 4d57405281ff83efb1629b381ce8686ac8c011fa

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | failed | 4 | timeout -k 30 30 node --test scripts/resume-read-traces.test.mjs; unreachable: C1 ledger and task-plan traces captured on the split references - primary session using eval/gauntlet-resume/tool-traces/README.md; 1 passed, 2 failed: saved captures predate the split and read neither restore-loop.md nor restore-plan.md; split built: scripts/resume-routes.test.mjs 8 passed, loop route 41,875 bytes, plan route 36,510 |
| 2 | done | 3 | timeout -k 30 30 node --test scripts/resume-current-stages.test.mjs; 7 passed, 0 failed; C3 brainstorm, plan and ship pairs hold calls, snapshots and gates on both replay models; instruction, input and judgment hashes are current |
| 3 | open | 0 | |
| 4 | done | 0 | timeout -k 30 10 python3 -c 'assert (files := [*__import__("pathlib").Path("skills/gauntlet-resume").rglob("*.md"), *__import__("pathlib").Path("skills/gauntlet-handoff").rglob("*.md")]) and not (hits := [(str(path), term) for path in files for term in ("legacy", "migrat", "conversion") if term in path.read_text().lower()]), locals().get("hits", "No instruction files selected")'; exit 0: no legacy, migrat or conversion term in any resume or handoff instruction file; the old-format headings are deleted, so no route can read them; a ledger with cap: or without allowance: or returned: stops at ledger admission |
| 5 | cut | 0 | deviates: the request removes backward compatibility, so such a ledger stops instead of converting |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 4
row 1 failed | Checked for saved tool-enabled resume transcripts and recorded the missing C1 evidence. | Capture C1 ledger and task-plan traces from the primary session, then pass those artifacts to this worker; do not substitute text-only evals.
amended | cut row 1 | Unavailable single-repo read trace
row 2 failed | Checked the saved resume fixtures and found no recorded plan-stage brief for the required C3 paired restore. | Supply C3 paired stage replays from a primary session allowed to launch Pi; do not substitute static call-table assertions for recorded-input equivalence.
amended | 2 item(s) | Restore row 1 and authorize C1-C4 primary-session evidence
row 2 failed | Prepared three C3 stage fixtures and a freshness-bound paired-replay check; primary-session replay records are still missing. | Reuse current-*-brief samples with --base 09c9f4e1 in the primary session, then run scripts/resume-current-stages.test.mjs; do not recreate fixtures.
row 2 done | Verified current brainstorm, plan and ship paired replays preserve tracker calls, task snapshots and gate boundaries with fresh hashes. | nothing new to build on.
row 1 failed | Prepared valid ledger and task-plan scratch fixtures and a freshness-bound C1 read-trace check. | Reuse tool-traces/prepare.mjs; split restore references, then capture C1 JSON traces in the primary session; do not substitute text replays.
row 1 failed | Rechecked the C1 trace fixture: both saved engine captures are absent, while scratch admission passes. | Do not repeat worker-only retries; split the references, then capture both C1 traces in primary sessions with tool-traces/README.md before redispatch.
row 1 escalated | implModel round | allowed attempts 10
row 1 failed | Split resume rules into restore-loop, restore-plan, plan-repair and coordinated references under the 42,000 and 37,000 ceilings; saved C1 traces predate the split. | Keep the split and recapture both C1 traces in a primary session before redispatch; row 2's C3 replays are now stale, and Design 8-9 eval, plan-check.ts and commit-message.md edits remain open.
row 4 done | Removed every old-format rule from the resume and handoff files; a ledger with cap: or without allowance: or returned: now stops at ledger admission. | Reuse scripts/resume-routes.test.mjs for route ceilings and forbidden terms; restore-loop.md "Ledger admission" holds the stop sentences.
