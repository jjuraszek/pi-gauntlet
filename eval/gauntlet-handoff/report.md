# eval report: gauntlet-handoff

for: 102fcd8d5b0faeb0ca6862419addca22f2a2f2ed90655d81b9568eba403955d7

wall: 14s

## Change

Mark the step-1 key/output question before any announcement.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| gate-line-first | anthropic/claude-opus-5-5 | improved | 4593 | target: holds -> holds (held); first-line: fails -> holds (intended change) |
| gate-line-first | github-copilot/gpt-6.1-sol | improved | 10961 | target: holds -> holds (held); first-line: fails -> holds (intended change) |

## Feedback

- gate-line-first / anthropic/claude-opus-5-5: Both outputs ask for --key or --out because HEAD is detached and state that no brief was written and no tracker was mutated, so the target fact holds on both sides. After adds the shared question marker (`gauntlet: question`) as the very first line, ahead of the skill announcement, which delivers the Change without dropping any of Before's substance: it still names the detached-HEAD cause, the empty `git branch --show-current`, the absent run worktree, the no-write/no-tracker guarantee, both rerun options with their path semantics, and the one-flag-only constraint. No fact moved for the worse; keep the marker on line one and the announcement on line two as After does.
- gate-line-first / github-copilot/gpt-6.1-sol: After delivers the change: the first line is the shared `gauntlet: question` marker, placed ahead of the skill announcement, and the message still asks for `--key <name>` or `--out <path>` because HEAD is detached while doing nothing else. One thing it quietly dropped, though, is Before's explicit closing assurance "No brief was written and no tracker was changed." A careful reader can still infer no mutation from After (it only asks and takes no action), so the target fact holds, but the explicit statement is what makes that unambiguous. Suggested wording: keep the marker and announcement as in After, then "Stopped: the session checkout is on detached HEAD (`git branch --show-current` returned empty), so I can't derive a safe handoff key. Which explicit target should I use: `--key <name>` or `--out <path>`? No brief was written and no tracker was changed." That keeps the gate marker first while preserving Before's explicit no-side-effects statement.

exit: 0
