# eval report: gatekeep-pr (partial run: overrides-own-block-only)

for: 91a2f97b5f545e6ab8506198c1a2d45fe710e23a996bf492a8f06114fa1de314

wall: 47s

## Change

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| overrides-own-block-only | anthropic/claude-opus-5-5 | improved | 4710 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |
| overrides-own-block-only | github-copilot/gpt-6.1-sol | improved | 3697 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |

## Feedback

- overrides-own-block-only / anthropic/claude-opus-5-5: Before treated `local verification: always` as unset because it looked for a `## PR gate` section, so it reused CI and explicitly did not invoke `node checks/amber-receipt.mjs`; the fact failed. After reads the setting directly under `# gatekeep-pr`, combines it with the shared verification command, and narrates the verifier actually running `node checks/amber-receipt.mjs` in `.worktrees/pr-62` on head `1111111…` with exit 0 and `source: local`, despite green exact-head CI, so the fact holds. This is the expected movement and nothing Before kept was lost. To keep it stable, retain the wording that makes the gate's own block the place where `local verification: always` is recognized and that the opt-out row takes precedence over CI-sufficient, and keep the shared `# shared` verification command as the resolved command; also note After adds no mention of the shape-ticket suffix, which is correct and should stay that way.
- overrides-own-block-only / github-copilot/gpt-6.1-sol: Before explicitly states the verifier reuses exact-head CI and runs no local verification command, so the verify fact fails there; After narrates the verifier actually running `node checks/amber-receipt.mjs` in the worktree on the assessed head (bracketed by HEAD checks) and explains that trusted configuration requires local verification despite green CI, so the fact holds. The movement comes from the wording that combines the shared verification command with gatekeep-pr's `local verification: always` policy; keep that pairing explicit so the verifier does not fall back to CI-only reuse. No fact that Before held was lost. After also correctly leaves out the shape-ticket suffix and renders no menu, so nothing further needs to change for this case.

exit: 0
