# eval report: gatekeep-pr (partial run: list-send-if-missing)

for: 81dfb8d623191b726dabf67453a8c97ecc3582810ce6f7c27d7d4c8b463c9abb

wall: 27s

## Change

Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, list it before reading CI runs, the diff or comments. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| list-send-if-missing | anthropic/claude-opus-5-5 | improved | 14390 | s1: fails -> holds (intended change); s2: fails -> holds (intended change); s3: holds -> holds (held) |
| list-send-if-missing | github-copilot/gpt-6.1-sol | improved | 6351 | s1: fails -> holds (intended change); s2: fails -> holds (intended change); s3: holds -> holds (held) |

## Feedback

- list-send-if-missing / anthropic/claude-opus-5-5: No fact that Before kept was lost in After. s1 and s2 moved because After says outright that the reply carrying the first provisioning command holds the list as visible text: the bold heading appears once, the linked entries sit at the supplied URLs (#35 then #18 in Run B), and `git fetch origin` follows with no marker, question, wait or metadata fetch. Before showed the same list content before the command, but described sending it "as its own message" and then going on to provisioning, so the list was not in the command-carrying reply; that was a close call resting on that one phrase. s3 holds in both: Run C goes straight to `git fetch origin`, and After states that the reply has no visible text, so neither the heading nor the entry is repeated. To keep all three, keep the wording that ties the list to the same reply as the first provisioning command, and never to a separate message. Keep the test as "earlier reply text in view lacks the linked list", with shell output and the plain-number pasteable line explicitly not counting. Keep the rule that when the list is already visible the reply carries only the command. One risk to watch: After's Run C rationale names `PR to gate:` in the surrounding narration, so make sure the wording keeps such explanation out of the user-visible reply, or the heading could leak back in and break s3.
- list-send-if-missing / github-copilot/gpt-6.1-sol: The After wording moved s1 and s2 solely by making the headings bold: Before already sent the linked list in visible reply text before the provisioning command in Runs A and B, in the right order and at the supplied URLs, with no gate marker, question, wait or metadata fetch, but wrote `PR to gate:` and `Open PRs to gate, smallest first:` as plain text, so the exact `**...**` headings the facts require were missing. After emits each bold heading exactly once with the linked entries (#18 alone in A; #35 then #18 in B) and goes straight to `git fetch origin`. s3 held in both: in Run C neither output repeats the heading or the entry when the earlier reply already shows the list; After drops the filler sentence and carries only the command, which is fine. To keep all three, retain the explicit wording that the list is sent only when earlier assistant reply text in view lacks it (shell output and the pasteable `discovered, smallest first:` line do not count as the list), and keep the bold-heading requirement stated as the literal heading strings so the writer does not revert to plain headings or re-send the list when it is already visible.

exit: 0
