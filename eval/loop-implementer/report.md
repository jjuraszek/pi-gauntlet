# eval report: loop-implementer (partial run: reading-picked, stand-in-built, silence-bound-and-unreachable)

for: 9cbb02052a07a8ad2988616c59e7430acda2d9e36909252b01b81599b6664bfa

wall by sample: reading-picked: 32s, stand-in-built: 45s, silence-bound-and-unreachable: 84s

Only the three named samples have fresh candidate replies on both models; their baselines were reused. The earlier silence-bound-and-unreachable result rejudged saved replies; this result is a fresh replay after the scratch-folder fact correction. The stand-in-not-buildable rows retain earlier evidence and were not rerun.

## Change

Compare missing inputs with and without a known format. Check the stand-in and closing commit line in stand-in-built, the unreachable return in stand-in-not-buildable, and preserve the credential boundary in silence-bound-and-unreachable. These are simulated worker returns.

The worker marks an unnamed paid or outside-repository action separately from a missing prerequisite. The loop's unnamed-action-asks replay covers the driver response; the worker's marker is checked by the local action contract test.

Select reading-picked to check the choice between two permitted labels and what reaches the row commit. Design's recommendation takes precedence over the size of the change; with no preference, choose the smaller edit. This is a replay of the choice, not a live commit.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| reading-picked | anthropic/claude-opus-5-5 | improved | 5437 | reading: holds -> holds (intended but unchanged); choice: fails -> holds (intended change) |
| reading-picked | github-copilot/gpt-6.1-sol | improved | 5428 | reading: holds -> holds (intended but unchanged); choice: fails -> holds (intended change) |
| stand-in-built | anthropic/claude-opus-5-5 | improved | 9142 | local: holds -> holds (intended but unchanged); disclosure: fails -> holds (intended change) |
| stand-in-built | github-copilot/gpt-6.1-sol | improved | 5709 | local: fails -> holds (intended change); disclosure: fails -> holds (intended change) |
| stand-in-not-buildable (not rerun) | anthropic/claude-opus-5-5 | unchanged | 4530 | unreachable: holds -> holds (held) |
| stand-in-not-buildable (not rerun) | github-copilot/gpt-6.1-sol | unchanged | 4422 | unreachable: holds -> holds (held) |
| silence-bound-and-unreachable | anthropic/claude-opus-5-5 | unchanged | 20908 | named-action: fails -> fails (pre-existing); unreachable: holds -> holds (held); rerun: fails -> fails (pre-existing); named-runs: fails -> fails (pre-existing); local-evidence: holds -> holds (held); bounded-contract: holds -> holds (held); blocking-bound: holds -> holds (held); owned-session: holds -> holds (held); timeout-cleanup: holds -> holds (held); safe-stop: holds -> holds (held) |
| silence-bound-and-unreachable | github-copilot/gpt-6.1-sol | unchanged | 28528 | named-action: holds -> holds (held); unreachable: holds -> holds (held); rerun: holds -> holds (held); named-runs: holds -> holds (held); local-evidence: holds -> holds (held); bounded-contract: holds -> holds (held); blocking-bound: holds -> holds (held); owned-session: holds -> holds (held); timeout-cleanup: holds -> holds (held); safe-stop: holds -> holds (held) |

## Feedback

- reading-picked: Both models already chose the recommended label when Design specified one and the smaller edit when it did not. After, both added one `- choice | what | why` line per commit body without row or task numbers.
- stand-in-built: Both models added one `- stand-in` line naming the absent file and the hand-built CSV. Opus already followed the test-first sequence in Before; GPT did so only in After.
- stand-in-not-buildable (not rerun): Both saved comparisons kept `unreachable:` as the first result after the local check, named the missing export and its owner, and did not invent a format or claim closure.

- silence-bound-and-unreachable / anthropic/claude-opus-5-5: No fact moved between Before and After on this case. The six process and boundary facts hold in both: unreachable returns in B and C, local-test-first evidence, the bounded reply and single attributed commit, timeout-wrapped calls, the owned Python session in F, and the safe stops in G and H. The three action-record facts (named-action, rerun, named-runs) fail in both for the same reason: row 2's ledger evidence carries a capture record. Before wrote `chart-capture ran (sandbox) and wrote fixtures/chart.json` and `chart-capture reran ...`; After only moved the note to the end, as `chart-capture ran once with sandbox input` and `chart-capture rerun because fixture was absent`. After also adds count language in A ("This is the single execution", "ran once"), which reads like a bound-spent record. The new distinction between an unnamed action and a missing prerequisite shows up cleanly in B (`unreachable: unnamed action chart-capture - ...`) against C (`unreachable: sandbox credential - ...`) without disturbing the unreachable fact, so keep that. To flip the three failing facts while still delivering the Change, say that evidence for a done row holds only the local check command and its pass/fail counts. Say also that a named action's execution, rerun or count is never noted in the ledger, jobs file or commit; the committed fixture is the only trace, and any explanation of why the capture ran belongs in the reply's sentence.
- silence-bound-and-unreachable / github-copilot/gpt-6.1-sol: No fact moved on this case: After still runs the named capture in A, D, E, I, J and K without asking or writing action records, keeps B and C as a failing replay followed immediately by `unreachable:`, and keeps every command under `timeout -k 30` with separate bounded polls in F. The new wording shows in B's marker (`unreachable: unnamed action chart-capture - credentialed sandbox worker`), which now distinguishes an unnamed action from C's missing credential while still naming where it can run; keep that 'where it can run' segment mandatory so the marker never shrinks to the label alone. Three places got closer to the line and are worth pinning in the wording. First, H now writes row 2 as failed with attempts 1 and appends a decision uncommitted, where Before left the row open, 0 attempts and empty; it still holds because After explicitly says no return replacement, no commit and no clean-completion claim, but say outright that an ownership-mismatch stop leaves the target cells untouched, so it cannot be read as an ordinary failed return. Second, F's controller is now a fragment plus prose, and the poll, controller-exit check and jobs-line removal are unshown scripts or prose; require the worker to show the jobs write, the wait/reap/record step and the single-line removal as Before did. Third, neither output preflights `timeout` explicitly, only implicitly by wrapping the `python3 --version` check, so name both preflights. The remark 'There is no stand-in or ambiguous implementation reading requiring a body entry' is harmless here and correctly keeps the commit body empty.

exit by sample: reading-picked: 0, stand-in-built: 0, silence-bound-and-unreachable: 0
