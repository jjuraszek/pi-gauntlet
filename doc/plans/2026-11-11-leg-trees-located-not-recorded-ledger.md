# Ledger - loop engine
**Spec:** `doc/specs/2026-11-11-leg-trees-located-not-recorded.md`
base: 4dcd1f4c71da8f2ee56a8491727e40233ca4733f
verification: npm test
checks: commands
iterations: 6
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 230 passed, 0 failed; no paid or external action launched; paid eval hold retained: bare 5 did not approve the fourteen-call bound |
| 2 | done | 1 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 235 passed, 0 failed; no paid or external action launched; paid eval hold retained: bare 5 did not approve the fourteen-call bound |
| 3 | done | 1 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/verify-before-ship.test.ts; 32 passed, 0 failed; no paid or external action launched; paid eval hold retained: bare 5 did not approve the fourteen-call bound |
| 4 | done | 2 | timeout -k 30 10 python3 -c 'assert len((r:=__import__("json").loads(__import__("pathlib").Path("eval/brainstorming/results/multi-repo-script-placed-leg/candidate.json").read_text()))["judge"]) == len(r["outputs"]) == 2 and all(c["status"] == "ok" for c in r["outputs"].values()) and all(len(c["facts"]) == 6 and all(f["after"] == "holds" for f in c["facts"].values()) for c in r["judge"].values())'; 12 candidate facts hold, replay 4 judge 2 confirm 0, exit 0; bound spent: brainstorming/multi-repo-script-placed-leg (1 of 3); ran brainstorming/multi-repo-script-placed-leg (1 of 3) |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |
| 11 | open | 0 | timeout -k 30 10 python3 -c 'assert "Resolve an absent location from the leg" not in __import__("pathlib").Path("skills/gauntlet-resume/reference/brief-contract.md").read_text(), "absent companion still derives its location from recorded home"'; exit 1: absent companion still derives its location from recorded home; no paid or external action launched; paid eval hold retained: bare 5 did not approve the fourteen-call bound |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | plan_check now locates script-placed companions by branch regardless of recorded home, verified by 230 tests. | Reuse the moved-worktree matrix in extensions/phase-tracker.test.ts to extend branch-lookup coverage.
row 2 done | Added five real-Git checks proving plan_check rejects unlinked, primary-only, detached, stale, and duplicate branch matches; 235 tests pass. | Reuse the branch-lookup rejection matrix in extensions/phase-tracker.test.ts for additional invalid-worktree cases.
row 3 done | Ship verification now selects companion primary settings by repo and live branch, leaving other branches and detached trees on local settings; 32 tests pass. | Reuse the branch-membership matrix in extensions/verify-before-ship.test.ts for policy selection with absent, literal, mismatching home and duplicate branch trees.
row 4 failed | Recorded the missing fourteen-call approval blocking the required selected behavior eval; no paid or external action launched. | Retry only after explicit fourteen-call approval for brainstorming/multi-repo-script-placed-leg; do not treat bare 5 or the amendment grant as spending authority.
row 4 done | Recorded creator-specific contracts; bound spent: brainstorming/multi-repo-script-placed-leg (1 of 3); ran brainstorming/multi-repo-script-placed-leg (1 of 3). | Reuse skills/brainstorming/reference/legs.md for branch lookup and portable templates, and the selected sample's saved eval results for local checks.
