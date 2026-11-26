# eval report: gatekeep-pr (partial run: overrides-own-block-only)

for: 9618b7440b981c85f9653e57a54094884a6c6bac479ecaa758afb289f81ebb1f

wall: 6s

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. Keep `differs` for missing or changed ticket rows; neither result changes the judgment.

Report functionality-only coverage in plain-report, both in the opening and in the evidence mapping. Omit Integration entries and their statuses from the report, evidence, and menus; retain the informational cross-check and actions already offered by the post-merge menu. A spec path named inside the PR body's Integration block is not a contract candidate for the merge gate.

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| overrides-own-block-only | anthropic/claude-opus-5-5 | improved | 5124 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |
| overrides-own-block-only | github-copilot/gpt-6.1-sol | improved | 4327 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |

## Feedback

- overrides-own-block-only / anthropic/claude-opus-5-5: The After wording moved `verify` as intended: the verifier now reads the merge-base `gauntlet.md` so that the `# shared` verification command combines with the `# gatekeep-pr` `local verification: always` policy, explicitly lets the opt-out row win over CI-sufficient, and narrates an actual local run of `node checks/amber-receipt.mjs` on head `1111111` (exit 0, log captured, cleanliness check), whereas Before said no recognized `## PR gate` section existed, relied on CI alone and stated it did not invoke the command. Before held no facts that After lost, so nothing needs restoring. To keep this stable, retain the explicit wording that the gate's own block plus the shared block are both trusted configuration and that local verification runs even on an already green head; note After also correctly left out the shape-ticket suffix, so keep the statement that other skills' blocks have no effect. One minor inconsistency to watch: After says the PR body has no material claims while the digest says no claims need a separate command; this does not affect the fact but tighter wording would avoid drift.
- overrides-own-block-only / github-copilot/gpt-6.1-sol: The After wording moved `verify` from fails to holds: Before explicitly said the verifier reused exact-head CI and ran "no local verification command" ("Local commands run: none"), while After narrates the verifier actually running `node checks/amber-receipt.mjs` in `.worktrees/pr-62` on the assessed head, with exit code 0, and cites `local verification: always` as the reason despite green CI. That is the expected movement and the only fact in this case, so nothing Before held was lost. To keep it stable, preserve wording that makes the gatekeep-pr block's local-verification policy combine with the shared verification command as an actual run step (not merely a configuration recap), and keep the shape-ticket suffix inert as it is here (no "Ivory seal attached." appeared in either output). After also complied with the entry's stop conditions: no menu and no discussion of discarded instructions.

exit: 0
