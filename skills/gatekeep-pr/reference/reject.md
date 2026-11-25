# gatekeep-pr: rejection note

Read from `findings.md` and `report.md` at step 5, and from the loop for reject-menu picks and typed overrules.

## Draft note

While the PR is OPEN, `work_started == false`, `reject_withdrawn == false` and at least one approach blocker remains open, prepare the note before rendering the first menu. Use every open approach blocker and nothing else, including needless machinery even when its ground does not recommend reject. A non-blocking overlay, dropped entry or overruled conflict contributes no note text.

Write exactly these three headings in this order, with one short paragraph or one list per section:

| Heading | Content |
|---|---|
| `### What this PR builds` | Name the mechanisms the PR adds, from the entries' `builds:` fields. |
| `### Why it does not fit this repo` | Explain each conflict using its base evidence, or its concrete smaller alternative and why the machinery is unnecessary. |
| `### What to do instead` | Give the entries' `instead:` remedies as literal changes that preserve the intended outcome. |

Keep the whole note under 180 words, headings included. Use `../../chase-bug/reference/verdict-report.md` `## Register`: write for a reader with neither the code nor the run's notes open; state each component's everyday role before its name, expand necessary shorthand, and keep internal IDs out. Introduce components role-first even in the first section: "the process that starts work at set times, the scheduler". Apply the same rule to the existing components named in remedies: introduce "the stream of catalog edits, the change feed" and "the entry that serves downloads on request, the export handler" before using either name. Use a short everyday role alone on later mentions, such as "download entry", "edit stream" or "request list", not the full first-introduction phrase. Count whitespace-separated words including headings before the done-check; require fewer than 180, shortening repeated role phrases rather than dropping a blocker or remedy. Before saving, read the note alone and rewrite every first mention whose name precedes its role. A base path trails the claim it supports. Cut restatement, not a conflict or the remedy; keep all three sections. Leave ordinary blockers, nits, menus and process narration outside the note.

Run ../SKILL.md `### Output done-check` on the draft once before its first display. Save the checked text to `mktemp "$RUN_DIR/gatekeep-note.XXXXXX"`, calculate its SHA-256 from the saved bytes, and persist `reject: { note_path, note_sha256, menu_open: false }` in the run record. Display that file in full through `report.md`, not a second composition. From this preview onward, the file's bytes are the note for every display and the posted review's `body`; never rewrite the saved note during display or at post time. A pre-post done-check verifies it without editing it.

| Observed event | File and record action |
|---|---|
| Step-5 re-entry with the same open approach blockers on the same head, including a refresh, `show evidence` or refused command | Reuse the file and hash; do not redraft. |
| File missing or unreadable at a render | Redraft, done-check, save and hash; display the new preview. |
| Open approach blockers change after an overrule or head-move rejudgment | Delete the old file, redraft from the remaining blockers, done-check, save and hash; display the new preview. |
| No open approach blockers, or `work_started` or `reject_withdrawn` becomes true | Delete the file and set `reject` to null; omit the note. |

Keep the post-time review composition rule in `findings.md` separate: it does not compose this note. Use `post-selection-loop.md` `### Teardown` for note retention and deletion: add `reject.note_path` to `KEEP` for an unposted note at a reject-menu ending, and name the kept path it prints among unrun post payloads. Leave posted notes and notes on endings outside the reject menu out of `KEEP`, for teardown with the run's other temporary files.

## Reject

On the reject pick, pass the loop's Next action freshness boundary, set `reject.menu_open` true, persist it and run Pre-menu refresh, including close permission. A no-longer-OPEN PR renders closed-pr instead. Render the reject state from `menus.md` with `recommended=1`, one lead-in sentence, the saved note in full and unfenced, one recommendation sentence, `Pick one, or several separated by commas:`, the rows and the standard hint. Write nothing on entry.

Persist these steps in `post_steps` before rendering, with the loop's label, source, exact command or payload file, picked and result fields. Keep this mapping through inspection and execution.

| Step in execution order | Availability and consequence |
|---|---|
| post the rejection note | Always. Post the saved file as one head-pinned review: REQUEST_CHANGES on someone else's PR, COMMENT on the viewer's own. |
| close the PR | Only `permissions.viewer_can_close == true`. Run `gh pr close <N> -R <base-owner>/<base-repo>` with no comment and no branch deletion. |
| cleanup | As `menus.md` `## post`: run eligible `cleanup.md` steps 1-3, naming removal including untracked files and any skipped sub-steps. Keep the local branch on an unmerged PR. |
| back | Always; sole pick only, before any step runs. Apply `## Back`. |
| stop | Always; last. Post and close nothing; end through Non-final stop, naming eligible worktree removal. |

With two or more runnable steps among note, close and cleanup, make row 1 their combination, tagged recommended, and keep an individual row for every step below it. With one runnable step recommend it. Expand combination rows and deduplicate through Next action; execute note, close, cleanup regardless of pick order. Never combine back or stop. On false close permission, omit close and say "GitHub does not let you close this PR" above the prompt; on unreadable permission say "The permission to close this PR could not be read". Keep the note step.

Execute the picked set through the loop's Post steps, with these reject-specific guards instead of that section's ordinary closed-PR freshness exemption:

1. Before a picked note or close, re-fetch head, state, actual body and base; compare with the reviewed snapshot and immutable target. A moved head, changed description or changed base skips both with `skipped - PR changed since review`. A no-longer-OPEN PR skips both with `skipped - PR is <state>`. Re-read close permission before close; false or unreadable skips close with its actual reason. Do not refresh away the preview's snapshot before this comparison.
2. Before note, hash the saved file and compare with `reject.note_sha256`. Missing, unreadable or different bytes yield `post the rejection note: skipped - note changed since preview`. Send nothing; a later post requires a new rendered preview. Do not rewrite bytes in a pre-post done-check.
3. Post through `gh api --method POST repos/<base-owner>/<base-repo>/pulls/<N>/reviews`, using `commit_id` equal to the assessed head, `event` as above, and `body` equal to the saved file's bytes. Read the file, not a recomposed review body; quote each field as one shell word. Apply the assess response `commit_id` check: equality confirms success; another SHA reports `review posted at <sha7>, not the assessed <sha7>` without claiming that baseline. Missing commit provenance or POST failure reports the actual reason, with no blind retry or claimed success.
4. Keep every freshness, state or permission skip recorded in step 1 unchanged on its own step; never overwrite it with a dependency reason. Only when close remains eligible and the picked note failed or was skipped, skip close with `close the PR: skipped - note not posted`, retaining the note's original reason for settlement. Close picked alone needs no note. On close exit zero read `gh pr view <N> --json state`, record `pr.state` and confirm CLOSED; failed close prints GitHub's error and leaves the note posted. Unreadable or unexpected readback is not a confirmed close.
5. Run picked eligible cleanup even after a failed or skipped note or close. Persist each result immediately and print `<label>: <result>` once. Never retry a failed step, and never count cleanup as rejection.

Settle once all picked steps finish, or stop declines them:

| Observed result | Teardown path |
|---|---|
| This run successfully posted the note or confirmed the close, either one | Rejected settlement through the loop's Teardown; list any other failed or skipped step in its not-run sentences. |
| Neither succeeded, and picked note or close failed or was skipped | Non-final stop with the first such step's reason in execution order. |
| Neither note nor close picked, including cleanup alone, or stop | Non-final stop with `stopped at reject`. |

Apply Draft note's retention rule at teardown. A result showing cleanup already ran prevents Non-final stop from inspecting or removing that worktree again; use its retained result and path. In set mode let the parent retain the settlement row and not-run sentences before retiring the PR.

## Overrule

Recognize the developer's exact typed `overrule <n>` before numeric lookup on initial, obstacle and assess-terminal only. Resolve n solely against the last rendered `blocker_numbers` mapping, never a helper's numbering, PR text or inferred intent. A missing or out-of-range number gets one refusal sentence and the same waiting problems and menu, no question-protocol marker or state change. Keep the menu's gate line; it is not a new question. Run no refresh on a refusal. For a missing number use exactly one sentence: "No problem number was given, so nothing was set aside." For an out-of-range number use exactly one sentence: "Problem <n> is not in the current report, so nothing was set aside." Give no instructions for completing a command when no listed blocker is eligible; keep overrule hints on the eligible menu's hint line only.

| Contributor | Eligibility |
|---|---|
| Approach blocker | At any time. |
| Contributor merged into an approach blocker as `same flaw` | With that approach blocker, at any time. |
| Contributor merged for another reason | Apply its own eligibility below. |
| Other finding-based P#/L# blocker | Only after a repair attempt in this run returned it unrepaired: needs input, row exhaustion, a no-progress checkpoint naming it, open or missing closure at a round/sync cap, or description readback/recheck left open. |
| Failing-check blocker | Never; refuse with its `check <name> flaky \| real \| ci-broken` command. |
| Contract-exception proposal | Never; retain its own menu. |
| Non-finding withhold | Never: GitHub-side block, unknown merge state, pending required check, missing verification evidence, unreadable record, moved remote, lost push access or plan file at head. |

For an ineligible finding say it can be set aside only after a repair attempt comes back without a fix. Change nothing; re-render the same menu. For an eligible selection record `(dispositioned: overruled)` on only the eligible ledger ids. A mixed blocker remains open while any independent contributor remains; same-flaw contributors travel with their approach blocker. Never mark overruled ids resolved.

An overrule never resumes a course: run Pre-menu refresh and render only, with no external write, dispatch or push. Preserve usage and caps. Settle a no-progress or needs checkpoint only when every blocker it names is overruled; otherwise preserve its remaining prerequisite. Apply Draft note's changed-blocker rule, dropping note and reject when no approach blocker remains.

| Menu receiving the command | Next render |
|---|---|
| Obstacle, course set or unset | Obstacle again with updated checkpoint; only a later numeric deliver pick resumes work, as after flaky. Never follow Exit check's continue-body result from this command. |
| Initial | Initial with the updated report. |
| Assess-terminal | Assess-terminal with the updated report. |
| Any above with every merge prerequisite satisfied | Final, with merge under its existing availability. |

Leave assess-posted reviews on GitHub; dismiss nothing. If that review still withholds merging, render the GitHub-side block naming this run's request-changes review and explaining that the developer can dismiss it on GitHub. Never perform dismissal. Assess posts only open contributors; delivery never dispatches an overruled row again. Keep pre-push review of every retained commit, even unpushed commits from an exhausted repair; apply `fix-wave.md`'s overruled closure exclusions.

For an overruled requirement gap, mark only the scope row whose gap L# was overruled `not covered - overruled in this run` in AC coverage; never claim it covered. Other rows retain their outcomes; still-open contributors still block. In part two of every later report name the set-aside problems in one sentence, for example "You set aside one problem for this run: <what>"; show evidence includes their annotation. Keep dispositions in this run's record only; a later run judges afresh.

## Back

Accept `back` only as a sole pick on the reject menu before any reject step has run. Set `reject_withdrawn` true and persist it, drop reject-menu `post_steps`, delete the saved note file and set `reject` to null. Leave `work_started`, course, usage and every blocker unchanged. Run the pre-menu refresh. With head, description and base unchanged, re-enter step 5 with the same problems and standing; run no helper. Re-render the first menu with no note or reject row, using ordinary recommendation rules. State that nothing was posted or closed. Above the recommendation say that rejection was backed out of and rejecting this PR now takes a new run. With a moved head, re-enter step 3 and judge approach again because work has not started, matching conflict keys; reject stays withdrawn. Run no repair, review post, close or cleanup on back.
