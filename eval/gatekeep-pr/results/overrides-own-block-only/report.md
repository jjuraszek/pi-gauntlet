# eval report: gatekeep-pr (partial run: overrides-own-block-only)

for: 2099f36cb63122afd71e9e395178bbf2bb68072f9ddcaf4e587c54ce49f4d4ca

wall: 20s

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. Keep `differs` for missing or changed ticket rows; neither result changes the judgment.

Report functionality-only coverage in plain-report, both in the opening and in the evidence mapping. Omit external observations and do not assign them an outcome. A spec path named inside the PR body's Integration block is not a contract candidate for the merge gate.

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| overrides-own-block-only | anthropic/claude-opus-5-5 | improved | 3940 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |
| overrides-own-block-only | github-copilot/gpt-6.1-sol | improved | 4175 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |

## Feedback

- overrides-own-block-only / anthropic/claude-opus-5-5: The After wording moved `verify` as intended: the verifier now reads the `local verification: always` line under `# gatekeep-pr` together with the shared verification command, so it narrates an actual local run of `node checks/amber-receipt.mjs` on the assessed head (head check, exit 0, cleanliness check, `source: local`) despite green exact-head CI, whereas Before concluded no recognized `## PR gate` section existed, treated the policy as unset, and explicitly ran no local command. No fact held in Before that was lost in After. To keep this stable, keep the wording explicit that the gate's own block in the trusted merge-base configuration supplies the local-verification policy, that the shared block supplies the command, and that the opt-out row takes precedence over CI-sufficient; one small thing to watch is that After says the PR has no material claims while the digest says none need a separate command, so consider wording that keeps claims being checked against the evidence rather than declared absent.
- overrides-own-block-only / github-copilot/gpt-6.1-sol: The After wording moved `verify` as intended: Before explicitly said the verifier reused exact-head CI and ran no local verification command ("Local commands run: none"), while After narrates the verifier actually running `node checks/amber-receipt.mjs` in `.worktrees/pr-62` on the confirmed head `1111111111111111111111111111111111111111`, states that the trusted configuration requires local verification even though CI passed, and reports exit code 0 with the reason `local verification: always`. This is an actual run, not a configuration recap, so the fact holds. Before kept no facts that After lost, so nothing needs restoring; to keep this result stable, preserve the wording that ties the shared verification command to the gatekeep-pr `local verification: always` policy and requires the run to be narrated as an executed step on the assessed head (with CI reused rather than substituted). After also correctly omits the shape-ticket "Ivory seal attached." suffix and renders no menu, consistent with the Change.

exit: 0
