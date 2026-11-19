# eval report: gatekeep-pr (partial run: typed-list-note)

for: 25e6c5ed9063b42495ad6cf1fa0f8f34111f9204d1b0f959ea094f54966315c0

wall: 52s

## Change

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, gather only the list metadata and show the list before minting the run folder, creating the continuation record, or initializing the tracker. Reuse the initial PR and viewer reads in Gather before reading CI runs, the diff or comments. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| typed-list-note | anthropic/claude-opus-5-5 | improved | 10327 | e1: fails -> holds (intended change); e2: holds -> holds (held); e3: fails -> holds (intended change) |
| typed-list-note | github-copilot/gpt-6.1-sol | improved | 8554 | e1: fails -> holds (intended change); e2: holds -> holds (held); e3: fails -> holds (intended change) |

## Feedback

- typed-list-note / anthropic/claude-opus-5-5: The After wording moved e1 and e3 as intended and kept e2. For e1, Before printed a plain `PRs to gate:` line, while After prints the bold `**PRs to gate:**` heading as visible reply text, with both entries linked, in typed order (#112 then #101), each with its ticket and a short change phrase. For e3, Before minted the run folder and initialized the tracker first, then ran the full Gather (CI runs, diff, comments) before showing an unbolded list. After runs only the PR view and the two viewer lookups plus the ticket display reads, shows `**PR to gate:**` before the run folder, continuation record and tracker exist, and then says Gather reuses the saved PR and viewer reads. e2 held in both: `by pat` carries no review-request wording, no `discovered, smallest first:` line is printed, and the message asks for nothing. To keep these results, retain the explicit ordering for one typed PR (list metadata reads, then visible bold list, then run folder, continuation record and tracker), the statement that the list is the visible text of the reply carrying the next tool call with no marker and no wait, and the instruction that Gather reuses the initial reads instead of rerunning them. One thing to watch: in Run A After still mints the parent run folder before gathering and listing. No fact here forbids that for sets, but if you want the set path to match the single-PR ordering, the wording should say so explicitly.
- typed-list-note / github-copilot/gpt-6.1-sol: The After wording moved e1 and e3 in the intended direction and kept e2. For e1, Run A now shows the list under the bold `**PRs to gate:**` heading as visible reply text before provisioning; Before printed the same two linked entries in typed order but under an unbolded `PRs to gate:` label. For e3, Run B now runs the initial PR view and the two viewer lookups first, resolves ticket display, shows the bold `**PR to gate:**` entry, and only then mints the run folder, creates the continuation record and initializes the tracker; it then explicitly reuses the saved reads before the CI run, diff and comment reads. Before created the run folder and tracker first and listed the PR only after the full gather. e2 holds in both: the #112 entry reads `by pat` with no review-request wording, there is no `discovered, smallest first:` line, and neither output waits for a reply. To keep this, retain the explicit ordering language (list before run-folder, continuation-record and tracker initialization; reuse initial reads in Gather) and the bold-heading requirement for visible reply text. One thing to consider: in Run A the parent still creates the run folder and continuation record before the gather and the list, so if you want the set path to match the single-PR ordering, say so explicitly.

exit: 0
