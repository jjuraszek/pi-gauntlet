# eval report: chase-bug

for: 3e166d28f1e9cd0634670ce8f524fb4b80cd04b6563c400c90dd16f82b15ff89

wall: 4s

## Change

Chase-bug cites the ticket link shape-ticket returned in both the addressable draft and the unaddressable summary, rather than assuming a newly created ticket. The completed handoff can return an existing ticket. Both baseline replay outputs already cite the supplied existing reference without claiming creation, so this sample expects those facts to remain held rather than forcing a movement.

The verdict menu sites apply the shared menu-layout contract so generated gates stay separated from numbered findings and legacy numeric replies are echoed by their mapped action before handoff.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| menu-after-numbered-findings | anthropic/claude-opus-5-5 | unchanged | 16242 | layout: holds -> holds (intended but unchanged); mapped-pick: holds -> holds (intended but unchanged) |
| menu-after-numbered-findings | github-copilot/gpt-6.1-sol | unchanged | 8908 | layout: holds -> holds (intended but unchanged); mapped-pick: holds -> holds (intended but unchanged) |
| returned-ticket-link | anthropic/claude-opus-5-5 | unchanged | 3256 | returned-reference: holds -> holds (held); no-new-creation: holds -> holds (held) |
| returned-ticket-link | github-copilot/gpt-6.1-sol | unchanged | 3537 | returned-reference: holds -> holds (held); no-new-creation: holds -> holds (held) |

## Feedback

- menu-after-numbered-findings / anthropic/claude-opus-5-5: Neither fact moved: both outputs already separate the generated 1.-4. menu from the numbered findings with intervening prose (Before with the fix-cost paragraph plus "Pick one:", After with the prior-report line plus "Pick one:"), and both open checkpoint 2 with the single echo "Taking 5 as option 2 - brainstorm now" before the summary and brainstorming handoff, without acting on a raw option 5 or asking for a retry. The After wording therefore preserves every fact Before held while delivering the shared menu-layout contract. Two small things worth tightening in After so the facts stay robust across runs: checkpoint 1 dropped Before's explicit "Stopping here for your pick" line, which is the clearest textual signal that the gate is a stop rather than a continuation, and the explanatory L/N paragraph in checkpoint 2 sits between the echo and the summary rather than before the echo - fine as written, but keeping the echo as the very first line after the heading (as After does) should be made an explicit instruction so a future rewording does not bury it under the arithmetic.
- menu-after-numbered-findings / github-copilot/gpt-6.1-sol: Neither fact moved: both Before and After place the prose line "Pick one:" between the three numbered findings and the 1.-4. gate, so the ordered findings never adjoin the options by blank lines alone, and both Checkpoint 2 replies open with the single echo sentence "Taking 5 as option 2 - brainstorm now." before the summary and brainstorming handoff rather than acting on raw 5 or asking for a retry. After differs from Before only cosmetically (em dashes, backticked skill names, folding the falsification note into the proof line, a tighter handoff paragraph), none of which affects either fact. The After wording keeps everything Before kept and is consistent with the menu-layout contract; no change is needed for this sample, though if you want the separation to be more robust against future rephrasing, keeping an explicit prose lead-in or a horizontal rule immediately before the gate is the safest form to standardize.
- returned-ticket-link / anthropic/claude-opus-5-5: Before and After are textually identical, so nothing moved. Both cite the exact returned reference https://github.com/example/widgets/issues/42 as the next step, and both explicitly state that shape-ticket found an existing ticket and created no new ticket and made no tracker change, which matches the supplied result. The After wording preserves both facts; no revision is needed for this sample, and the menu-layout changes in the Change paragraph do not touch this unaddressable-summary path.
- returned-ticket-link / github-copilot/gpt-6.1-sol: Before and After are textually identical: both cite the returned reference https://github.com/example/widgets/issues/42 under Next step and explicitly state no new ticket was created and no tracker mutation occurred, so neither fact moved. The After wording correctly preserves the existing-ticket result from shape-ticket without inventing a creation claim; no adjustment is needed for this sample. The expected menu-layout movements (menu-after-numbered-findings/layout and mapped-pick) are not exercised by this completed-handoff case, so they cannot be assessed here.

exit: 0
