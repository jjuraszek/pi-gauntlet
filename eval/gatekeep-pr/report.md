# eval report: gatekeep-pr (partial run: post-menu-combined)

for: 1e0e326d4e8c00118f54ab0afb38b9ed29bbec6a157c38d5e310a0d61b13ed1e

wall: 56s

## Change

Collect terminal follow-ups in one post menu. Recommend a combination that names its member rows, keep each runnable step separately selectable, omit the duplicate PR coverage copy from the combination, and settle after the selected set finishes. Keep pre-merge drafted replies available, separate cleanup overrides from checkout cleanup, and preserve skipped-step reasons and unrun payloads.

Select only post-menu-combined for this increment. It covers one merged PR with a drafted reply, two coverage destinations, partially runnable checkout cleanup, a notification and a fully skipped release. Retain all other sample results as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification. Set parsing edge cases, batch scheduling and PR-named command resolution are not covered by this sample.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-menu-combined | anthropic/claude-opus-5-5 | improved | 22978 | single-menu: fails -> holds (intended change); combination: fails -> holds (intended change); runnable-rows: fails -> holds (intended change); guards: fails -> holds (intended change); draft: fails -> holds (intended change); execution: fails -> holds (intended change) |
| post-menu-combined | github-copilot/gpt-6.1-sol | improved | 19950 | single-menu: fails -> holds (intended change); combination: fails -> holds (intended change); runnable-rows: fails -> holds (intended change); guards: fails -> holds (intended change); draft: fails -> holds (intended change); execution: fails -> holds (intended change) |

## Feedback

- post-menu-combined / anthropic/claude-opus-5-5: After moves every fact from fails to holds and regresses nothing. Before had a single menu but used the old 'Pick one:' prompt, folded notify and release into the cleanup row, offered no row for robin's drafted reply, and after reply 1 ran only checkout cleanup while leaving the ticket coverage and reply unposted. After renders one own-merge menu with 'Pick one, or several separated by commas', puts the duplicate-PR-copy reason above the prompt, makes row 1 the sole recommendation naming its labels and member rows 2, 3, 5 and 6, gives reply, ticket coverage, PR coverage, cleanup and notify their own rows with exact commands or post destinations, lists release unnumbered under the rows with the base-not-synced reason, keeps the base pull skip and no-switch guarantee inside the single cleanup row, executes the picked set in reply/ticket/cleanup/notify order without posting the PR copy, and closes with 'gauntlet: done merged' plus the settlement row and a did-not-run list that gives each skipped or unpicked step its reason and command or payload path. Two small things worth watching in the wording, though neither breaks a fact here: the teardown step deletes the run record and the reply draft after posting, which is fine for a posted reply but would need an explicit 'retain unposted payloads' clause if a post failed, and the base sub-step's 'can run after you switch the primary to main yourself' advice should stay phrased as human action so no reader infers the gate might switch the branch.
- post-menu-combined / github-copilot/gpt-6.1-sol: After moved every fact from fails to holds and matches the Change exactly. Before used a cleanup-only recommendation under a single-pick "Pick one:" prompt, folded notify and the release skip into the cleanup row, dropped the pre-merge drafted reply entirely, and re-rendered a second terminal menu after the pick instead of settling. After fixes each of these: one header line, the comma-separated prompt, row 1 naming the four member labels and their row numbers (2, 3, 5, 6) with the duplicate-PR-coverage exclusion stated above the prompt, a dedicated reply row with robin's subject and the thread-reply command, separate rows for ticket coverage, PR coverage, cleanup (worktree removal, prune, branch delete, and the skipped base pull with the maintenance reason) and notify with its resolved command, an unnumbered "Skipped: release" line under the rows, stop last, and show-evidence as a hint only. The simulated reply 1 executes the four members once in post-step order, never posts the PR copy, prints per-step results, then ends with `gauntlet: done merged` and the `#642@9c1e4f2: merged` settlement row, with the closing naming the unpicked PR coverage command and payload path and the skipped release reason and command. Nothing regressed; the wording is sound as written. One optional tightening: in the pre-prompt paragraph, name the release skip reason as "local base not synced" in addition to "primary on maintenance" so the recommendation paragraph and the Skipped line use identical phrasing.

exit: 0
