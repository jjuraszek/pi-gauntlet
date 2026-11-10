# eval report: gatekeep-pr (partial run: batch-post-menu)

for: fb4e03b48655bb4ae13b9b70b027afd8aaa03bf91d9488dfcaf9b32153abf6ab

wall: 93s

## Change

In set mode, render one post menu per merged PR in its own message and retire each PR after its chosen steps or stop, without a post-menu ladder. Recommend a shared cleanup override only on the last merged PR in the round; an early explicit selection runs it then, and the parent retains that execution across rounds to prevent a second run or later offer. Keep PR-specific items local, collect all picks before executing in roster order, and copy the child's standing sentence unchanged in the summary. Retain per-PR not-run sentences for the single parent closing message.

Select only batch-post-menu for this increment. Its two synthetic variants cover recommended picks and an explicit early shared-item pick followed by stop on the other PR. Keep all other saved sample results as historical evidence, not current coverage. No live PR, multi-PR dispatch or external cleanup is exercised.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| batch-post-menu | anthropic/claude-opus-5-5 | improved | 29631 | separate: fails -> holds (intended change); shared: holds -> holds (intended but unchanged); once: holds -> holds (intended but unchanged); queue: holds -> holds (held); retirement: fails -> holds (intended change); standing: fails -> holds (intended change) |
| batch-post-menu | github-copilot/gpt-6.1-sol | improved | 20941 | separate: fails -> holds (intended change); shared: fails -> holds (intended change); once: fails -> holds (intended change); queue: fails -> holds (unplanned improvement); retirement: fails -> holds (intended change); standing: holds -> holds (intended but unchanged) |

## Feedback

- batch-post-menu / anthropic/claude-opus-5-5: After moves every targeted fact and keeps the ones Before held. Before failed separate because #12's menu was folded into the batch-summary message (its first line was gate=gatekeep-pr/batch-summary, not own-merge); After gives each PR its own gate=gatekeep-pr/own-merge recommended=1 message (A2/A4, B2/B4) with no re-render. Before failed retirement because the `gauntlet: retired #12` marker was printed as the first line of the message that then ran the steps (and even carried the queue acknowledgement beneath it), so the PR appeared retired before its steps finished; After runs the steps (A6/A8, B6) and emits the retired marker afterward (A7/A9, B7/B8), then one `gauntlet: done retired` message that in B names #15's unpicked cleanup and announce with their exact commands. Before failed standing by appending `| evidence: ci | blockers: 0` to the copied sentence; After copies both sentences verbatim with no extra fields. shared, once and queue hold in both: After keeps publish docs as individual row 4 on #12, out of #12's row 1 and in #15's row 1 only, runs it once at the picked PR with the roster recording that fact, and prints the exact `Queued until all picks are collected` acknowledgement before any roster-order execution in the parent. No wording regressions to fix; if anything, keep the explicit 'parent roster records that shared publish docs has run' sentence, since that is what carries the once fact across rounds.
- batch-post-menu / github-copilot/gpt-6.1-sol: Before refused the whole replay with a stuck marker, so it kept only the standing fact; After delivers every fact: one own-merge menu per PR in its own message, shared publish as an individual row 4 on #12 but inside row 1 only on #15, the exact 'Queued until all picks are collected' acknowledgement before any execution, roster-order execution in the parent, per-PR 'gauntlet: retired #N' markers, a single 'gauntlet: done retired' closing that names #15's unpicked cleanup and announce with commands in B, a once-only publish that later menus omit, and the standing sentences copied verbatim without verdict fields. Two things to tighten so the facts stay robust: After rewrites the snapshot's cleanup commands as `git -C /tmp/widgets worktree remove ...` rather than the stipulated `git worktree remove /tmp/widgets-pr-12`, and quotes the announce args as `'#12'`; since the Entry asks for exact commands, the wording should instruct the parent to reproduce the supplied command strings verbatim. It also appends ' - merged' to the retired markers and introduces `H12`/`H15` placeholders the snapshot never supplied; prefer the bare `gauntlet: retired #12` marker and omit invented head identifiers so a strict reader cannot dispute the marker or the settlement lines.

exit: 0
