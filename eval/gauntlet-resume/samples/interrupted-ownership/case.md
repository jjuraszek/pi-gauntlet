bundle+: skills/loop-implementation/SKILL.md
bundle+: skills/loop-implementation/reference/coordinated-legs.md

Narrate only pending recovery and its next action for each independent snapshot. Entry checks, legal phase restoration and tuple/before-image recovery already passed. Do not use tools. Give concrete commands, counter changes and stop headers rather than generic references to the driver.

All snapshots resume an implement-stage loop with approval option 5, allowance 5, iterations 8 on disk and 7 in the saved pre-dispatch home ledger. Saved row 2 is open attempts 1; row 1 is done attempts 2. No retries or escalation; other rows and decisions stay unchanged. Neither returned work nor its decisions have been admitted. The whole pending HEAD..HEAD range, not HEAD^..HEAD, is the validation range. Retained runtime evidence says the child launched no background work; no jobs file exists. There is no attribution ambiguity or missing before-image.

A. Home pending tuple is `pending: 2 | home | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`. Child returned non-DONE after writing an uncommitted file. The retained dispatch/write provenance accounts for every changed path and commit as this child's output; all writers are quiescent. The driver's authorized reset and clean commands succeed; status is empty and the pending HEAD..HEAD count is 0. Describe the repair and next action without human discard authorization.

B. Same home tuple and dirty return, except an unrelated user write occurred after dispatch and exclusive checkout provenance cannot be established. The child has exited and no jobs remain. State what is preserved and the stop header, not a reset followed by checking what survived. No user has authorized discarding this work.

C. Companion tuple is `pending: 2 | repo-b | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`. Repo-b returned zero commits with dirty child files. The saved home HEAD is unchanged and home dirt is exactly the expected iterations bump and pending write. Repo-b's retained exclusive dispatch/write provenance accounts for every changed path; all writers are quiescent. Reset/clean and status/count checks succeed in repo-b. Foreign home and repo-c rows, leg mappings and seeded flags must remain intact. Describe the home repair and continuation, including which checkout is never reset.
