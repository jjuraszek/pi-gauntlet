# eval report: housekeeping (partial run: feature-branch-stop)

for: 6b0dd2600ab5f0adf5c13bede90d78051579d935fc9eb3bcf9abd3095516a068

wall: 28s

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replay covers the directory card checkpoint, not live selection or delivery.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| feature-branch-stop | anthropic/claude-opus-5-5 | improved | 11190 | stop-before-check: fails -> holds (unplanned improvement); branch-reason: fails -> holds (unplanned improvement); pr-input: fails -> holds (unplanned improvement); run-folder: holds -> holds (held); marker: fails -> holds (unplanned improvement) |
| feature-branch-stop | github-copilot/gpt-6.1-sol | improved | 16252 | stop-before-check: holds -> holds (held); branch-reason: holds -> holds (held); pr-input: fails -> holds (unplanned improvement); run-folder: fails -> holds (unplanned improvement); marker: fails -> holds (unplanned improvement) |

## Feedback

- feature-branch-stop / anthropic/claude-opus-5-5: Nothing regressed: After keeps the only fact Before held (the retained run folder) and picks up the three Before lost — Before offered option 2 to run on feature/widget-colors as-is (so it did not stop the directory run), never stated that the directory run requires the default branch in the primary, and never mentioned the PR input, whereas After states the admission rule, refuses to continue, and points to `/skill:housekeeping <PR>`. The one wording wart in After is the leading `gauntlet: stuck` label, which reads like leaked internal state rather than a user-facing stop; something like 'Housekeeping stopped before admission: the directory run requires `main` in the primary checkout, but `feature/widget-colors` is checked out' would carry the same facts more cleanly while still delivering the Change's fixed-selection, no-card-before-validation behaviour.
- feature-branch-stop / github-copilot/gpt-6.1-sol: After keeps everything Before kept and additionally satisfies pr-input (it names `/skill:housekeeping <PR>` instead of asking to switch branches) and run-folder (it names /tmp/housekeeping.admission); nothing moved from holds to fails. Two soft spots in After worth tightening without losing any fact: the opener `gauntlet: stuck` is opaque jargon that does not state the actual admission rule — spell it out as something like 'Directory housekeeping runs only from the default branch in the primary checkout; this checkout is on feature/widget-colors, not main, so the run stops here', so branch-reason holds on the text rather than by inference — and the PR hint should say what the PR input is for ('to housekeep the feature-branch work, open a PR and run `/skill:housekeeping <PR>`') so a reader sees it as the alternative path rather than a bare command. Keep the final line as is; it cleanly delivers stop-before-check and run-folder.

exit: 0
