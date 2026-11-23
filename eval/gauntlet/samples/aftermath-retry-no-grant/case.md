# Input

## Narrated read actions
No tools are available. Narrate required reads and proposed stage actions from these synthetic observations; render the actual human amendment menu in that narration, then end the turn. Do not claim live writes.

Worktree /tmp/report-worktree, waves engine, phase implement, no ledger. Spec doc/specs/report-runner.md re-read observes `**Amend-grant:** none`. Plan doc/plans/report-runner.md exists. This batch already changed only spec Tests from "replays at final verification" to "replays in Task 1 Tests"; it is uncommitted. No scope or boundary change. Current Task 1 Spec: doc/specs/report-runner.md#tests (in Amend: Tests); current Tests: `node eval/run.mjs report-runner audit`. HEAD Task 1 Tests from `git -C /tmp/report-worktree show HEAD:doc/plans/report-runner.md`: `node --test eval/lib/lint.test.mjs` baseline: 3a8fad8c pass; via: lintAll; Test: eval/lib/lint.test.mjs.

Writing-plans has already used its first Findings repair. The second parent check is identical:
FAIL (1 findings)
command-contract @ line 24: Tests segment requires a Test: path token
> Tests: `node eval/run.mjs report-runner audit`

Writer observation: OPEN QUESTIONS
- Task 1: `node eval/run.mjs report-runner audit` dirtied tracked source: eval/report-runner/report.md, eval/report-runner/results/audit/baseline.json, eval/report-runner/results/audit/candidate.json
artifacts: /tmp/report-runner-artifacts/audit.log (untracked, outside row)
In-flight: doc/specs/report-runner.md, doc/plans/report-runner.md
Each named dirty path prints exactly itself from git ls-files in /tmp/report-worktree, is tracked and unprotected. Restore success is a supplied observation if restoration is narrated. There is no subsequent PASS or human reply.

Prepared correction: handle replay; title Move replay to verification; location Tests; old replays in Task 1 Tests -> new replays at final verification; what move behavioral replays out of Task 1 Tests; why the Tests contract requires a Test: path token that this runner CLI cannot carry; example Task 1 replay -> final verification replay; recommended accept, no alternatives. Evidence: verbatim FAIL and dirtied row above. Applying it would reopen Task 1, no phase change. It is factual verification text outside human-owned sections, scope-neutral. A fresh review's fixed outcome (not a live dispatch claim): `replay: escalate - final verification placement needs confirmation - probed: runner CLI - no Test: path argument`. Use that result after the prefilter/reviewer route.

Independently reset this same state for B: spec value `fund 2 fix rounds` only; C: Amend-grant header absent. Explain whether either can skip the prefilter/reviewer and pause. Neither trace has a human reply. No writer re-dispatch or commit has occurred.
