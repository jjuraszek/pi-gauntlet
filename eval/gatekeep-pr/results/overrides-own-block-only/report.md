# eval report: gatekeep-pr (partial run: overrides-own-block-only)

for: e79b74cfe324e8bf6862879d634dbdb5923cfc76d856f7bb351d2d46623ff502

wall: 21s

## Change

Report functionality-only coverage in plain-report, both in the opening and in the evidence mapping. Omit external observations and do not assign them an outcome. A spec path named inside the PR body's Integration block is not a contract candidate for the merge gate.

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| overrides-own-block-only | anthropic/claude-opus-5-5 | improved | 4875 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |
| overrides-own-block-only | github-copilot/gpt-6.1-sol | improved | 5056 | verify: fails -> holds (intended change); foreign: holds -> holds (held) |

## Feedback

- overrides-own-block-only / anthropic/claude-opus-5-5: After moved the verify fact by having the helper read `local verification: always` from the `# gatekeep-pr` block as trusted merge-base configuration, select the Opt-out row ahead of the CI-sufficient row, and then actually run `node checks/amber-receipt.mjs` in `.worktrees/pr-62` on the assessed head (with a HEAD check before, exit 0, and a tracked-file cleanliness check after), reporting `source: local`. Before explicitly declined to run the command, claiming no recognized `## PR gate` section existed and reusing CI alone, so the fact failed there. Before held no facts that After lost, so nothing needs restoring; to keep this result stable, keep the wording that the gate's own block combines with the shared verification command and that green exact-head CI does not waive the local run. One minor note: After says it found no material claims while the digest says none need a separate command; this does not affect the fact, but wording the claim check as 'none needs a separate command' would track the input more closely. After also correctly ignored the shape-ticket suffix.
- overrides-own-block-only / github-copilot/gpt-6.1-sol: The After wording moved `verify` because the verifier now explicitly combines the shared verification command with gatekeep-pr's `local verification: always` policy: it narrates running `node checks/amber-receipt.mjs` in the assessed worktree on head 1111111…, with exit code 0, and states that green exact-head CI does not skip the local command; Before relied on CI alone and said 'Local commands run: none'. Before held no fact that After lost, so nothing needs to be restored. To keep this result stable, keep the wording that ties the shared command to the gate's own block (and only its own block — the shape-ticket suffix correctly did not appear), and keep the explicit statement that CI being green does not substitute for the local run. Note that the After output includes details not grounded in the case (15-minute timeout, RUN_DIR log path, pre/post `git rev-parse` and `git status` checks); these don't affect the fact, but if the entry asks for a brief result you may want the wording to discourage narrating steps beyond what the verifier is supplied with.

exit: 0
