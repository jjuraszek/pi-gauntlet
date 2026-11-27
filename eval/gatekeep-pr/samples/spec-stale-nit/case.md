bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
bundle-: skills/gauntlet/commit-message.md

## Entry

Simulate six independent decisions. In A-D and F, start at step 5 with verification and review complete. For A show the first report and menu. For B-D and F show just the first report's standing and finding, without a menu. Limit each case to 180 words; omit command narration. Use the supplied rereads as command results. No worker, forge action or ticket read actually runs.

Shared facts: the viewer owns the open, pushable, mergeable PR; merge permission and all checks are green; no review requests, comments, approach conflicts, description defects or other findings. The PR and its spec aim to let readers find saved recipes quickly. The Design says "Sort saved recipes by title." The diff sorts by most recent use instead, with a test. Both sort orders are equally fast. No other clause mentions the sort order.

A. The reread ticket asks to sort saved recipes by most recent use rather than by title.

B. The reread ticket asks only for quick lookup and says nothing about sorting. Sorting by title still meets the lookup goal.

C. The ticket read fails with no step-2 copy. Here the only goal given by the spec and PR is "Change the sort order"; no separate reason to switch can be established.

D. Use A's ticket. The reviewer also found a new, untested branch for recipes that have never been opened. No test covers that branch; the existing sort test covers previously opened recipes only.

E. Start instead at the final menu from a completed assessment. The only point is an edit to doc/specs/recipe-search.md shown as `Sort saved recipes by title.` -> `Sort saved recipes by most recent use.` The author picks the displayed number for `fix nits`. Narrate the pi handoff and what happens to the stored scope as the following simulated results arrive: helper commits the exact edit; admission succeeds; pre-push reviewer confirms only this edit and passes; push succeeds; rebind and readback at the pushed head confirm exactly the selected delta. Stop after the baseline decision. Execute nothing.

F. Replace the sort scenario with a trail map app. Its spec goal, PR body and tested diff agree that hikers must be able to look up trail names without connectivity. No ticket. The existing spec has no clause for a local trail index and the PR adds one; disabling it leaves search dependent on a network connection. There is no other discrepancy.
