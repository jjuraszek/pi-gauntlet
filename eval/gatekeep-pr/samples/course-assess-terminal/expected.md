anonymized: true
- f1: judged: A posts the blockers exactly once with gh api --method POST repos/acme/widgets/pulls/42/reviews and event REQUEST_CHANGES; B uses the same REST endpoint with event COMMENT on the own PR, never REQUEST_CHANGES. Neither uses the unpinned gh pr review command for assess.
- f2: judged: C and D with zero blockers send no review post; none of the five checkpoints repairs or syncs.
- f3: judged: Assess terminal offers approve only for someone else with zero blockers (C), not A, B, D or E; stop is recommended and last.
- f4: judged: Drafted C1 thread replies stay separate behind a reply pick; assess does not post them or infer approval.
- f5: judged: Both A and B send commit_id 1111111111111111111111111111111111111111 plus the composed blocker body with src/guard.mjs:8, after the existing explicit pick and compare-and-swap; read the equal response commit_id and confirm the review as the assessed-head baseline.
- f6: judged: E sends COMMENT with commit_id 1111111111111111111111111111111111111111, then prints review posted at 2222222, not the assessed 1111111 on response mismatch; does not claim an assessed-head baseline or retry the POST.
- f7: judged: Empty prior REST reviews produce no ancestry check or Prior review report line. C and D leave that baseline null and carry no locally cleared span into a fresh session; their zero-blocker assess does not create a review baseline.
