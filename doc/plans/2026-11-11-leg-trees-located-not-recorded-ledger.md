# Ledger - loop engine
**Spec:** `doc/specs/2026-11-11-leg-trees-located-not-recorded.md`
base: 4dcd1f4c71da8f2ee56a8491727e40233ca4733f
verification: npm test
checks: commands
iterations: 11
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 230 passed, 0 failed; no paid or external action launched; paid eval hold retained: bare 5 did not approve the fourteen-call bound |
| 2 | done | 1 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 235 passed, 0 failed; no paid or external action launched; paid eval hold retained: bare 5 did not approve the fourteen-call bound |
| 3 | done | 1 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/verify-before-ship.test.ts; 32 passed, 0 failed; no paid or external action launched; paid eval hold retained: bare 5 did not approve the fourteen-call bound |
| 4 | done | 2 | timeout -k 30 10 python3 -c 'assert len((r:=__import__("json").loads(__import__("pathlib").Path("eval/brainstorming/results/multi-repo-script-placed-leg/candidate.json").read_text()))["judge"]) == len(r["outputs"]) == 2 and all(c["status"] == "ok" for c in r["outputs"].values()) and all(len(c["facts"]) == 6 and all(f["after"] == "holds" for f in c["facts"].values()) for c in r["judge"].values())'; 12 candidate facts hold, replay 4 judge 2 confirm 0, exit 0; bound spent: brainstorming/multi-repo-script-placed-leg (1 of 3); ran brainstorming/multi-repo-script-placed-leg (1 of 3) |
| 5 | done | 2 | timeout -k 30 10 python3 -c 'assert len((r:=__import__("json").loads(__import__("pathlib").Path("eval/spec-gate/results/option-6-handoff/candidate.json").read_text()))["judge"]) == len(r["outputs"]) == 2 and all(c["status"] == "ok" for c in r["outputs"].values()) and all(len(c["facts"]) == 13 and all(f["after"] == "holds" for f in c["facts"].values()) for c in r["judge"].values()), "publication fact fails: one candidate omitted the literal quoted heredoc"'; 26 candidate facts hold, replay 4 judge 2 confirm 0, exit 0; bound spent: spec-gate/option-6-handoff (1 of 3), bound spent: spec-gate/option-6-handoff (2 of 3); ran spec-gate/option-6-handoff (1 of 3), ran spec-gate/option-6-handoff (2 of 3) |
| 6 | done | 1 | timeout -k 30 10 python3 -c 'assert len((r:=__import__("json").loads(__import__("pathlib").Path("eval/brainstorming/results/spec-pr-publish-legs/candidate.json").read_text()))["judge"]) == len(r["outputs"]) == 2 and all(c["status"] == "ok" for c in r["outputs"].values()) and all(len(c["facts"]) == 13 and all(f["after"] == "holds" for f in c["facts"].values()) for c in r["judge"].values()), "coordinated cleanup lacks passing branch deletion and read-back facts"'; 26 candidate facts hold, replay 4 judge 2 confirm 0, exit 0; bound spent: brainstorming/spec-pr-publish-legs (1 of 3); ran brainstorming/spec-pr-publish-legs (1 of 3) |
| 7 | failed | 2 | iteration 10: decision words exceed 200 characters; bound spent: brainstorming/spec-pr-regate-legs (1 of 3), ran brainstorming/spec-pr-regate-legs (1 of 3), bound spent: using-git-worktrees/pr-head-caller-root (1 of 3), ran using-git-worktrees/pr-head-caller-root (1 of 3), bound spent: using-git-worktrees/pr-head-caller-root (2 of 3), ran using-git-worktrees/pr-head-caller-root (2 of 3) |
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
row 5 failed | Implemented gated cleanup; bound spent: spec-gate/option-6-handoff (1 of 3); ran spec-gate/option-6-handoff (1 of 3). | Keep cleanup and saved eval records; fix missing quoted-heredoc narration in option-6-handoff before another selected run.
row 5 done | Fixed narration; bound spent: spec-gate/option-6-handoff (1 of 3); ran spec-gate/option-6-handoff (1 of 3); bound spent: spec-gate/option-6-handoff (2 of 3); ran spec-gate/option-6-handoff (2 of 3). | Reuse spec-pr.md cleanup and eval/spec-gate/results/option-6-handoff/candidate.json for local replay checks; all 26 facts hold.
row 6 done | Verified coordinated cleanup; bound spent: brainstorming/spec-pr-publish-legs (1 of 3); ran brainstorming/spec-pr-publish-legs (1 of 3). | Reuse eval/brainstorming/samples/spec-pr-publish-legs for cleanup cases and its saved candidate.json for local replay checks; all 26 facts hold.
row 7 failed | Implemented no-home continuation; ran brainstorming/spec-pr-regate-legs (1 of 3); ran using-git-worktrees/pr-head-caller-root (1 of 3); caller-root regressed. | Keep no-home cases and regate results; fix caller-root's ready-after-abort and abbreviated race SHA narration before rerunning affected samples.
