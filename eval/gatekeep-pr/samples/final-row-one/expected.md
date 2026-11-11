anonymized: true
- own: judged: Case A recommends merge on row 1 and offers no approve row because the viewer is the author.
- other: judged: Case B recommends merge on row 1, not approve, even though the PR has another author and approve is available.
- bypass: judged: Case C recommends the ordinary merge action on row 1, with its consequence identifying the admin override or ruleset bypass. No separate bypass action is offered; the recommendation does not claim CI can be bypassed.
- approve: judged: Case D recommends approve on row 1 and omits the merge action because WRITE permission is missing; the report explains that reason.
- authority: judged: All four reports start with gauntlet: gate=gatekeep-pr/final recommended=1, put exactly one recommended tag on row 1, keep stop last and show evidence hint-only, and give a prose recommendation reason naming the case's state immediately above Pick one. No numeric pick or external action is simulated.
