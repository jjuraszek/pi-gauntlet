# eval report: gatekeep-pr (partial run: overrides-own-block-only)

for: 86ce8f841905b943733cd3646c98f214d90f5a291d8910b74c8a4a5a47797e56

wall: 6s

## Change

Report functionality-only coverage in plain-report, both in the opening and in the evidence mapping. Omit external observations and do not assign them an outcome.

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| overrides-own-block-only | anthropic/claude-opus-5-5 | improved | 5434 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |
| overrides-own-block-only | github-copilot/gpt-6.1-sol | improved | 4644 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |

## Feedback

- overrides-own-block-only / anthropic/claude-opus-5-5: The After wording moved `verify` as intended: the output now treats the merge-base `# gatekeep-pr` block's `local verification: always` as trusted, combines it with the shared `verification command`, and narrates actually running `node checks/amber-receipt.mjs` from the worktree at the assessed head (exit 0, log captured, cleanliness and HEAD re-checked) despite green exact-head CI. Before explicitly said the policy was not set because it looked for a `## PR gate` section, reused CI, and stated it did not invoke the command. No fact that Before kept was lost, since this was the only fact. The After output also correctly left the shape-ticket suffix out and rendered no menu. To keep this stable, keep the wording that names the skill's own block plus the shared block as the recognized configuration source and that the opt-out row is evaluated first, ahead of the CI-sufficient row; one small thing to watch is that After says the PR body has no material claims, whereas the digest says no claims need a separate command, so wording that distinguishes 'no claims' from 'claims needing no extra command' would avoid drift there.
- overrides-own-block-only / github-copilot/gpt-6.1-sol: After moved the verify fact: it narrates the verifier actually running `timeout 900 node checks/amber-receipt.mjs` in `.worktrees/pr-62` on the assessed head, states explicitly that green exact-head CI is kept only as supporting evidence and does not skip the local run, and cites `local verification: always` as the reason; Before reused CI and reported `Local commands run: none`, so the fact failed there. Nothing Before held was lost, since this was the only fact and Before failed it. To keep this result, preserve the wording that combines the shared verification command with the gatekeep-pr local-verification policy and that says CI green does not substitute for the local run; keep the command shown as an executed step rather than only in a configuration recap. The shape-ticket suffix correctly does not appear in either output, and that should stay scoped out.

exit: 0
