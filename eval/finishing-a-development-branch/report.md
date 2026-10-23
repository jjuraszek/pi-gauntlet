# eval report: finishing-a-development-branch (partial run: pr-subject-push)

for: c62e8914c9b61cc41095da4963091eb73afaeaa2fe807738747975550beb141b

wall: 65s

## Change

Step 6 reads the overrides file's `## using-git-worktrees` section at finish time. With a keyed contract it matches `$WORKTREE` against `home:` with `<name>` matched inside one path segment, runs `destroy:` with the recovered name or the built-in `git worktree remove` + `prune`, and keeps the branch when `destroy:` fails; a non-matching path is host-owned. Without a section the legacy three homes decide, unchanged. Successful keyed cleanup explicitly continues to `git -C "$PRIMARY" branch -D "$FEATURE"`, with no built-in remove or prune after a successful `destroy:`.

Step 4 applies the shared menu-layout contract to both finishing menus, separating generated options from preceding ordered observations and echoing a mapped legacy numeric pick before acting.

The PR-subject finish is detected from the selected spec record, verifies the scoped task union, proves preserved history and a non-force landing, and appends a thread-evidenced Rework block without rewriting the description. Baseline for the new sample: `1b0f7dd2bbbf926a8ff65109414d05aa97acaa58` (references committed). The default target remains the Step 6 slice, so its assembly and `for:` hash remain unchanged; the new sample bundles the full finish skill and PR-head reference.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-subject-push | anthropic/claude-opus-5-5 | improved | 27850 | menus: fails -> holds (intended change); verification: fails -> holds (intended change); guards: fails -> holds (intended change); divergence: fails -> holds (intended change); landing: fails -> holds (intended change); threads: fails -> holds (intended change); body: fails -> holds (intended change); failures: holds -> holds (intended but unchanged) |
| pr-subject-push | github-copilot/gpt-6.1-sol | improved | 30797 | menus: fails -> holds (intended change); verification: fails -> fails (intended but unchanged); guards: fails -> holds (intended change); divergence: fails -> holds (intended change); landing: fails -> holds (intended change); threads: fails -> holds (intended change); body: fails -> holds (intended change); failures: holds -> holds (intended but unchanged) |

## Feedback

- pr-subject-push / anthropic/claude-opus-5-5: After delivers the PR-subject finishing contract that Before declared unspecified: the six-row menu with PR consequences, the task-union verification with sentinel handling, the spec-naming missing-prehead stop, withheld-row treatment with ancestry-proven suffix and the 1/5/6 reply mapping, the refs/gauntlet/pre-rework/pr-42 save plus --no-follow-tags non-force push after strip and seal, thread evidence captured (the grep precedes the plan rm) with fixed-in/fallback/open/declined/omitted renderings, and the fresh-fetched body with Rework block and supersedes rule. Nothing Before held was lost; failures was already satisfied in Before and remains so. Two wordings worth tightening so they cannot be misread: 'Rows 2-6 map to Options 1-5' could suggest renumbering rather than rows 2-6 keeping their numbers while mapping to the standard options (say 'rows keep numbers 2-6, mapping to standard options 1-5'), and the F3 evidence row should state explicitly that missing post-fix evidence for any command, not only a failing test-retry, blocks menu return.
- pr-subject-push / github-copilot/gpt-6.1-sol: After delivers the PR-subject finish almost entirely: the six-row menu with consequences, withheld-row treatment with both SHAs and the proven-ancestry suffix, named stops, --no-follow-tags non-force push to refs/heads/fix-timeout, the pre-rework ref, fresh body fetch with exact bytes plus blank line and the Rework block, T2/T3 complete-task fallback, and the superseding rule. The one fact it does not settle is verification, and only in the F3 section: 'commands lint, format, test-timeout, test-retry under either header' says the sentinel header still dispatches lint and format, whereas the contract makes the sentinel header dispatch only the task union (test-timeout, test-retry) and never the sentinel. Reword to something like 'under the lint/format header dispatch lint, format, test-timeout, test-retry; under the sentinel header dispatch only test-timeout and test-retry (never `none`)'. Also make the ordinary-spec menu count explicit ('ordinary spec keeps the five-option menu even with an open PR') rather than relying on 'Rows 2–6 map to Options 1–5' and the verification sentence to imply it. Before already held failures, and After keeps that, so no regression there.

exit: 0
