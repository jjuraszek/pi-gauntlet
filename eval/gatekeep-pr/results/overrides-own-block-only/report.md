# eval report: gatekeep-pr (partial run: overrides-own-block-only)

for: c2742e76c74da7545a1e8d72267d9f0dc7b36b5a4ddee124a4bb0a104a98ba2f

wall: 5s

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. Keep `differs` for missing or changed ticket rows; neither result changes the judgment.

Report functionality-only coverage in plain-report, both in the opening and in the evidence mapping. Omit Integration entries and their statuses from the report, evidence, and menus; retain the informational cross-check and PR-named steps, including open actions without trusted commands. Keep observation-only clauses out of post steps without promising a later judgment. A spec path named inside the PR body's Integration block is not a contract candidate for the merge gate.

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| overrides-own-block-only | anthropic/claude-opus-5-5 | improved | 4374 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |
| overrides-own-block-only | github-copilot/gpt-6.1-sol | improved | 5173 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |

## Feedback

- overrides-own-block-only / anthropic/claude-opus-5-5: The After output moved `verify` from fails to holds because it now treats the merge-base `gatekeep-pr` block's `local verification: always` as trusted configuration, lets that opt-out win over the CI-sufficient row, and narrates an actual local run of `node checks/amber-receipt.mjs` on the assessed head (head check, exit 0, cleanliness check, `source: local`). Before explicitly said the setting was not recognized, stayed CI-first, and stated it did not invoke the command, so the fact failed there. Before held no facts that After lost, so nothing needs restoring; to keep this result stable, keep the wording that the gate's own block supplies the local-verification policy and the shared block supplies the command, and that the opt-out is evaluated before the CI-sufficient row, so the command is shown as executed rather than merely listed in the configuration recap. The shape-ticket suffix correctly had no effect in After.
- overrides-own-block-only / github-copilot/gpt-6.1-sol: The After wording moved `verify` as intended: the verifier now combines the trusted shared verification command with gatekeep-pr's `local verification: always` policy, so it narrates actually running `node checks/amber-receipt.mjs` in `.worktrees/pr-62` on the assessed head (step 4, exit code 0) while explicitly reusing the green exact-head CI rather than relying on it; Before stated it ran no local verification command and relied on CI alone, so the fact failed there. Before kept no fact that After lost, so nothing needs restoring. To keep this stable, retain the explicit statement that the gate's local-verification policy applies even when exact-head CI is green and that the command comes from the shared block, and keep the shape-ticket suffix inert (After correctly omits 'Ivory seal attached.'). The added scaffolding (rev-parse checks, mktemp log, status check) does not affect the fact but lengthens a result the entry calls brief; consider trimming it if brevity matters elsewhere.

exit: 0
