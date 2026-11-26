# eval report: gatekeep-pr (partial run: overrides-own-block-only)

for: 2f7cca332ee570eebafc1e9e71a0660673e4b7e4f02158c0673ebffb8db5d328

wall: 5s

## Change

Report functionality-only coverage in plain-report, both in the opening and in the evidence mapping. Omit external observations and do not assign them an outcome.

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| overrides-own-block-only | anthropic/claude-opus-5-5 | improved | 4766 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |
| overrides-own-block-only | github-copilot/gpt-6.1-sol | improved | 4934 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |

## Feedback

- overrides-own-block-only / anthropic/claude-opus-5-5: The After wording moved `verify` as intended: the output now reads the merge-base `# gatekeep-pr` block as trusted, matches `local verification: always` on the first evidence row, and narrates actually running `node checks/amber-receipt.mjs` from the worktree root on the assessed head (exit 0, with HEAD and tracked-tree checks before and after), explicitly despite exact-head CI being green. Before looked only for a `## PR gate` section, declared the policy unset, and explicitly did not invoke the command, relying on CI alone. No fact that Before held was lost. To keep this stable, retain the wording that ties the shared verification command to the gate's own block policy and that the opt-out row is evaluated before the CI-sufficient row; also note the After output did not append the shape-ticket suffix, which is consistent with the Change, so keep the statement that other skills' blocks have no effect.
- overrides-own-block-only / github-copilot/gpt-6.1-sol: After moved the verify fact as intended: the verifier now narrates actually running `node checks/amber-receipt.mjs` in `.worktrees/pr-62` on the assessed head (wrapped in a timeout, bracketed by `git rev-parse HEAD` and a tracked-file status check), and it explicitly says green exact-head CI is kept as supporting evidence but not used to skip the local run because the gate's `local verification: always` policy applies; Before instead reused CI and stated it ran no local command. Before held no facts on this case, so nothing regressed. To keep this result stable, retain the wording that ties the shared verification command to the gatekeep-pr local-verification policy and that states CI green does not waive the local run; also keep the shape-ticket suffix inert (After correctly omits "Ivory seal attached."). One minor point: the evidence line cites `$log_path` as a literal unexpanded variable, which you may want the wording to resolve to a concrete path or describe in words.

exit: 0
