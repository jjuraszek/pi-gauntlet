Resume during an active repair after compaction in /workspace/project. plan_check({ planPath: "/workspace/project/doc/plans/feature.md" }) and plan_tracker status are available; tracker says task 4 in_progress. Compare three alternatives. In A the transcript contains:
wave 1 base 1111111111111111111111111111111111111111
wave 1 task 4 status DONE report /tmp/reports/impl4.md patch /tmp/run/task4.patch
wave 1 task 4 verdict FIX_FIRST report /tmp/reports/cr4.md patch /tmp/run/task4.patch
wave 1 review 1 tree /tmp/review4
funded round 1 of 2 for task 4
No terminal funded-worker or funded-review result survives in A. The funded line was printed before dispatch.

In B those dynamic lines are absent. A current delegated grant read decoded two funded rounds for task 4, but no spending or terminal repair state survives. The active wave is known to be wave 1; its base, worker/review results and review-tree lines are missing.

In C the same initial lines survive, plus these terminal observations from the primary's transcript:
- Funded round 1 implementer returned structured status DONE, report /tmp/reports/funded1.md, in-place in /workspace/project. The scoped gate passed and the repaired deliverables were staged there.
- Funded round 1 CR re-review returned structured verdict FIX_FIRST, maxSeverity Moderate, findingCount 1, behaviourChange false, touchedTasks [4], trajectory { verdict: "CONVERGING", line: "TRAJECTORY: CONVERGING (3 -> 1, max severity Moderate)" }, report /tmp/reports/funded1-cr.md. The initial triggering CR also had behaviourChange false; no SR reroute is pending.
- The CR reviewed the integrated checkout /workspace/project, BASE_SHA 1111111111111111111111111111111111111111 and HEAD_SHA WORKTREE; its terminal result is recorded and no later dispatch occurred.
- Recorded Fix delta object IDs: tree-before aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa tree-after bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb. The latter is the tree recorded at the funded CR dispatch, retained for the next re-review's tree-before.
- The current grant was delegated and decoded as two funded rounds for task 4, with one spent; escalationLoop resolved implModel to the configured runtime string. The next funded dispatch still requires the current grant read/decoding prescribed by the skill.

Give recovery actions in all alternatives, without opening plan/spec/reports/source or guessing whether integration or acceptance happened. Do not issue verdicts or reset funded spending. In C identify the next operation solely from the terminal observations, forwarding the saved review report path and retaining the recorded tree IDs.
