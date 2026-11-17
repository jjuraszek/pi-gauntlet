# gatekeep-pr: rejection note

Read from `findings.md` and `report.md` at step 5, and from the loop for a reject-menu `back` pick.

## Draft note

While the PR is OPEN, `work_started == false`, `reject_withdrawn == false` and at least one approach blocker remains open, prepare the note before rendering the first menu. Use every open approach blocker and nothing else, including needless machinery even when its ground does not recommend reject. A non-blocking overlay, dropped entry or overruled conflict contributes no note text.

Write exactly these three headings in this order, with one short paragraph or one list per section:

| Heading | Content |
|---|---|
| `### What this PR builds` | Name the mechanisms the PR adds, from the entries' `builds:` fields. |
| `### Why it does not fit this repo` | Explain each conflict using its base evidence, or its concrete smaller alternative and why the machinery is unnecessary. |
| `### What to do instead` | Give the entries' `instead:` remedies as literal changes that preserve the intended outcome. |

Keep the whole note under 180 words, headings included. Use `../../chase-bug/reference/verdict-report.md` `## Register`: write for a reader with neither the code nor the run's notes open; state each component's everyday role before its name, expand necessary shorthand, and keep internal IDs out. Introduce components role-first even in the first section: "the process that starts work at set times, the scheduler". Use the everyday role alone on later mentions. Before saving, read the note alone and rewrite every first mention whose name precedes its role. A base path trails the claim it supports. Cut restatement, not a conflict or the remedy; keep all three sections. Leave ordinary blockers, nits, menus and process narration outside the note.

Run SKILL.md `### Output done-check` on the draft once before its first display. Save the checked text to `mktemp "${TMPDIR:-/tmp}/gatekeep-note.XXXXXX"`, calculate its SHA-256 from the saved bytes, and persist `reject: { note_path, note_sha256, menu_open: false }` in the run record. Display that file in full through `report.md`, not a second composition. From this preview onward, the file's bytes are the note for every display and the posted review's `body`; never rewrite the saved note during display or at post time. A pre-post done-check verifies it without editing it.

| Observed event | File and record action |
|---|---|
| Step-5 re-entry with the same open approach blockers on the same head, including a refresh, `show evidence` or refused command | Reuse the file and hash; do not redraft. |
| File missing or unreadable at a render | Redraft, done-check, save and hash; display the new preview. |
| Open approach blockers change after an overrule or head-move rejudgment | Delete the old file, redraft from the remaining blockers, done-check, save and hash; display the new preview. |
| No open approach blockers, or `work_started` or `reject_withdrawn` becomes true | Delete the file and set `reject` to null; omit the note. |

Keep the post-time review composition rule in `findings.md` separate: it does not compose this note. Retain an unposted note after a failed or skipped note step or a reject-menu stop and name its path among unrun post payloads. Delete a posted note at teardown; delete the note on every ending outside the reject menu with the run's other temporary files.

## Back

Accept `back` only as a sole pick on the reject menu before any reject step has run. Set `reject_withdrawn` true and persist it, delete the saved note file and set `reject` to null. Leave `work_started`, course, usage and every blocker unchanged. State that nothing was posted or closed, then run the pre-menu refresh and re-render the first action menu through `menus.md`; its rejection predicate keeps `reject` absent for the rest of this run. Keep the ordinary blocker-based recommendation. Run no repair, review post, close or cleanup on this pick.
