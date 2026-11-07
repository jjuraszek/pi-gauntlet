# eval report: gatekeep-pr (partial run: per-ref-settlement)

for: 5c40065243cd4229a4c6ae4a8b80f87942aa996667d7519022212b7098a032f1

wall: 19s

## Change

Emit plain per-PR settlement rows with assessed full heads, terminal outcomes and only observed ticket refs after cleanup and follow-ons finish. Retain retired PR rows until final set settlement and keep intermediate retirement nonterminal. Run only per-ref-settlement for this edit and preserve historical results; this is sample-scoped coverage, not a target-wide pass.

Move gatekeep-pr's pi file-finding fix wave to loop-implementer companion rows with a persisted ledger and derived spec. Admit successful and ordinary failed commits with selective evidence, charge attempts without double-counting a source-changing round, preserve partial work and retry guidance, reopen carried findings and partially resolved nit batches without resetting attempts, and bound retries through row exhaustion and escalation. Keep prior-review delta accounting, description compare-and-swap updates, and the independent Claude Code helper path intact. The samples selected for this PR's loop-engine edit are loop-worker, nit-batch-row, prior-review-delta, reviewer-row-reopen, row-exhaustion, blockers-bare-fix, and description-not-a-row. This attribution and intent correction rejudges only prior-review-delta's stored outputs; it changes no skill or persona behavior. The evidence is sample-scoped narration, not a target-wide pass or live admission/push verification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| per-ref-settlement | anthropic/claude-opus-5-5 | improved | 10136 | settled: fails -> holds (unplanned improvement); terminal: fails -> holds (intended change); merged: fails -> holds (intended change); stopped: fails -> holds (intended change) |
| per-ref-settlement | github-copilot/gpt-6.1-sol | improved | 9767 | settled: holds -> holds (held); terminal: fails -> holds (intended change); merged: fails -> holds (intended change); stopped: fails -> holds (intended change) |

## Feedback

- per-ref-settlement / anthropic/claude-opus-5-5: After satisfies the fact: a single terminal settlement line opens the message, followed by plain per-PR rows in roster order (#31 then #32), each carrying its full 40-char assessed head, with the ticket annotation only on #31 and the exact stuck reason on #32, and nothing after it opens a menu or new action. Before fails because its rows truncate #31's head to abc1234, omit #32's head entirely, render the rows as prose bullets, and declare 'done' despite a stopped item. Two small risks in After worth tightening without losing anything: the literal '<scratch>' placeholder in the #32 cleanup note reads like an unrendered template variable (substitute the real path or drop the parenthetical), and the #31 cleanup note cites integration commit 1111111 while the prompt said to use the assessed head — keep that mention clearly scoped to the base fast-forward description or omit it so a reader never confuses it with the row's head.
- per-ref-settlement / github-copilot/gpt-6.1-sol: Nothing moved on this fact: both outputs open with a single settlement line, list #31 then #32 with full assessed heads, annotate only #31 with #12, and close without any menu or new action. After actually tightens things the Change wanted — the header says `stuck retired` instead of Before's `done retired`, which misreported a roster with a stopped item as done, and the PR rows are plain `#N@head: outcome` lines rather than prose bullets, with #32 carrying the exact stuck reason. Keep the After wording as-is; if you want extra safety, make the spec say the header state is the worst terminal outcome across the roster (merged < stuck) and that cleanup lines follow the rows as plain text, so no future rewording drifts back to a `done` header or to bulleted rows.

exit: 0
