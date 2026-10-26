# eval report: finishing-a-development-branch (partial run: pr-list-member-advanced)

for: c62e8914c9b61cc41095da4963091eb73afaeaa2fe807738747975550beb141b

wall: 49s

## Change

Finish loop ledgers using their verification command and Spec header; strip both plan candidates while preserving spec/telemetry, and include loop cut/amend grants in the amendment digest. The loop-ledger sample expands the default Step 6 cleanup slice to cover the hard gate and strip.
Step 6 reads the overrides file's `## using-git-worktrees` section at finish time. With a keyed contract it matches `$WORKTREE` against `home:` with `<name>` matched inside one path segment, runs `destroy:` with the recovered name or the built-in `git worktree remove` + `prune`, and keeps the branch when `destroy:` fails; a non-matching path is host-owned. Without a section the legacy three homes decide, unchanged. Successful keyed cleanup explicitly continues to `git -C "$PRIMARY" branch -D "$FEATURE"`, with no built-in remove or prune after a successful `destroy:`.

Step 4 applies the shared menu-layout contract to both finishing menus, separating generated options from preceding ordered observations and echoing a mapped legacy numeric pick before acting.

The PR-subject finish is detected from the selected spec record, verifies the scoped task union, proves preserved history and a non-force landing, and appends a thread-evidenced Rework block without rewriting the description. Baseline for the new sample: `1b0f7dd2bbbf926a8ff65109414d05aa97acaa58` (references committed). The default target remains the Step 6 slice, so its assembly and `for:` hash remain unchanged; the new sample bundles the full finish skill and PR-head reference.

Extend rework finishing to ordered PR lists: prove every original head before non-force push, append Absorbs and per-PR thread lists without altering the description, and require successful body editing before eligibility refresh and the exact per-target close-with-comment question. Recheck displayed targets immediately, exclude moved heads outside pushed history, and leave members open on failed push or body edit. Preserve untouched single-PR verification, ancestry, thread evidence and no-member-close behavior, plus ordinary cleanup and menus. New narrated samples are setup-only coverage; both-arm held/pre-existing facts do not establish a behavior improvement, and no must-hold fact is relaxed. The current run uses the runner's merge-base baseline; the earlier explicit baseline describes the historical single-PR addition.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-list-member-advanced | anthropic/claude-opus-5-5 | improved | 18675 | eligibility: fails -> holds (intended change); targets: fails -> holds (unplanned improvement); variants: fails -> holds (unplanned improvement) |
| pr-list-member-advanced | github-copilot/gpt-6.1-sol | improved | 14540 | eligibility: fails -> holds (intended change); targets: fails -> holds (unplanned improvement); variants: fails -> holds (unplanned improvement) |

## Feedback

- pr-list-member-advanced / anthropic/claude-opus-5-5: After delivers all three facts: the refresh runs only after the body edit succeeds, #14's advanced head is fetched before the ancestry test against the saved pushed home E, the exact `#14 skipped: head moved to 9999999, not in home` line appears in both the eligibility step and the final report, the close question carries the spec comment with bbbbbbb and the home link with option 1 naming only #13, the recheck precedes `gh pr close` without `--delete-branch`, and both variants (contained-head eligible with per-PR rechecks, no-eligible with no question) keep their facts. Before fell short on all three: it never printed the required skipped line or a reported reason for #14 in the completion, offered a generic 'comment links #12' instead of the bbbbbbb-bearing comment, and used home's first-parent walk as evidence for MEMBER13, flipping its recorded `fix` to `still open`. The After wording that keeps this working is the explicit 'Home's first-parent history is not used as proof for member fixes' line plus the verbatim skip-reason string reused in the report; keep those sentences fixed, and ensure the per-PR threads block always echoes the recorded resolution for member threads rather than recomputing it, so no future tightening reintroduces home-history proof for members.
- pr-list-member-advanced / github-copilot/gpt-6.1-sol: After moves all three facts to holds and loses nothing Before kept: it saves the pushed home head E only after the push and body edit succeed, fetches #14's missing head X before the ancestry test, prints the exact '#14 skipped: head moved to 9999999, not in home' line, renders the close question with only #13's spec comment (bbbbbbb plus the home link) and an option 1 naming only #13, rechecks #13 immediately, closes without --delete-branch, and reports '#13 closed, #14 left open (skipped)'; the contained-head variant keeps #14 eligible and the no-eligible variant asks no question. Before stalled on a 'blocking protocol omission' and never rendered the question or the skip line. To keep this robust, consider tying the skip reason to the final report line explicitly ('#14 left open: head moved to 9999999, not in home') rather than relying on the earlier line, and keep the fetch-before-ancestry step and the saved-pushed-SHA wording verbatim so the unfetched-SHA case never reads as a whole-closure error.

exit: 0
