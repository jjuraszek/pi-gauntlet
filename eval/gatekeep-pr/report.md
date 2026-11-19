# eval report: gatekeep-pr (partial run: typed-list-note)

for: 90ad308eed39a63b6bcc8c4f893ae2d9d20edbaf70b91693fa04650bd7a1e575

wall: 48s

## Change

Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, list it before reading CI runs, the diff or comments.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| typed-list-note | anthropic/claude-opus-5-5 | improved | 9247 | e1: fails -> holds (intended change); e2: holds -> holds (held); e3: fails -> holds (intended change) |
| typed-list-note | github-copilot/gpt-6.1-sol | improved | 9902 | e1: fails -> holds (intended change); e2: holds -> holds (held); e3: fails -> holds (intended change) |

## Feedback

- typed-list-note / anthropic/claude-opus-5-5: The After wording moved e1 and e3 in the intended direction and kept e2. For e1, Before printed a plain `PRs to gate:` line, while After prints the bold `**PRs to gate:**` heading in visible reply text before provisioning, with both PRs in typed order (#112 then #101), linked PR and issue pages, sizes, `by pat` / `yours`, tickets #22 and #45, and a short change phrase each. For e3, Before listed #97 only after the CI run list, diff and comment reads, and without bold; After places `**PR to gate:**` straight after the `gh pr view` and viewer lookups and explicitly before `gh run list`, the diff and the comments, then continues to provisioning without a wait. e2 holds in both: the #112 entry reads `by pat` with no review-request wording, no `discovered, smallest first:` line is printed (it is only mentioned as not printed), and neither run waits. To keep this, retain the instructions that the list goes in the reply carrying the next tool call, that the heading is bold, and that the single-PR list comes before the substantive reads; also keep the explicit 'no marker, no wait' and 'typed set prints no discovered line' wording, since those are what protect e2.
- typed-list-note / github-copilot/gpt-6.1-sol: The After wording moved e1 and e3 as intended and cost nothing Before kept. For e1, Before printed a plain `PRs to gate:` label, while After prints the bold `**PRs to gate:**` heading in visible reply text, with both entries in typed order (#112 then #101), linked PR and issue pages, sizes, authorship and a change phrase, all before provisioning. For e3, Before listed #97 only after the full gather (CI runs, diff, reviews, comments) and without bold; After emits `**PR to gate:**` right after the initial PR view, the viewer and team lookups and the overrides check, explicitly "before any further gather command", then goes on to the run list, diff and comments and names provisioning as the next step without waiting. e2 holds in both: the #112 entry reads `by pat` with no review-request wording, there is no `discovered, smallest first:` line, and neither output pauses for a reply. To keep this, retain the explicit instruction that the single-PR list comes before CI runs, the diff or comments, and that the heading is bold in reply text rather than inside narration or a code block. Also keep the wording that review-request text appears only when the viewer or their team is actually requested, and that the discovery line is reserved for no-argument runs, so the new discovery rules do not leak into typed-PR lists.

exit: 0
