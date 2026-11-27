# eval report: waves (partial run: tracker-auto-start)

for: 2377daf9ceaecac1832e69f11b615cd91d1807d2be16a373f03cf80fdea15758

wall: 39s

## Change

Read chain recovery and escalation only at their triggers; run clean waves, ordinary repairs and successful lookups without either file. Keep prerequisites in the wave driver. The selected samples test narrated procedure reads, not live traces.

Dispatch a wave without marking each task in progress. Keep task completion after the wave commit.

Compose committed-originals and accepted-wave messages through the shared commit-message reference using held spec metadata and manifest headings. Preserve scoped entry staging, delegated source reads, isolated reset semantics and completion after the wave commit. Keep wave-commit-wording/boundary passing.
Rebuild Delete ownership from the wave base: strip path line annotations, remove Create paths first, and restore deduplicated Modify/Test plus Delete paths printed by the restricted base-tree listing, excluding Create paths. Skip empty commands and preserve siblings. The rebuild-delete-paths sample covers this behavior change; its report is partial coverage.
Recover suppressed apply JSON from exactly one bounded success capture satisfying unchanged APPLY_SCHEMA. Stop without retry only on the exact baseline-read marker, quoting command/stderr; preserve the ordinary one-retry gate. Establish committed plan/spec originals through path-scoped entry commits before dispatch. The missing-baseline and uncommitted-entry samples cover these changes; delegated-amendment and local-amend-revalidation now use committed originals while retaining failure history and parent gates. Model evidence remains verification-owned.
Recover every missing task result from bounded identity-matched success captures before diagnosis, including accepted siblings hidden by chain failure. Use a named read-only delegate only for absent/rejected captures, stop on duplicate identity, and count missing/empty initial patches without integration. Preserve report bounds, source delegation, in-place gate/review and nonempty initial apply-failure stops.
The bounded-read overflow check names the `Parallel-safe:` line as the report footer (`TRAJECTORY:` on a re-review), not the first-line `Verdict:`.
Localize implement amendments to affected entries and historical evidence, preserving staged repairs during no-execution maintenance. Attribute retained failures by command/assertion/path plus corresponding repair evidence, not task membership. Derive semantic inventory from committed home plan/spec originals before edits and on retry, with previousApplyReport for findings only; keep grant, redraw and unrelated-regression stops and parent stamping. The local-amend-revalidation sample exercises these distinctions. Full model reports/results remain parent verification-owned.
Replace per-task spec and per-wave code review with one post-gate integrated wave review. Read unresolved child reports directly once at limit 300 with one compact retry; retain delegated source/spec/plan reads. Repair on the current integrated tree, using committed clean snapshots and delta-only apply for isolated waves, direct edits in-place. Rebuild only after repair delta apply failure; preserve siblings and original wave base. Fold escalation, convergence, funding and transcript-only recovery into one transition table. These are behavior-changing instructions; parent verification owns model results.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| tracker-auto-start | anthropic/claude-opus-5-5 | improved | 4835 | dispatch: fails -> holds (intended change); commit: holds -> holds (held) |
| tracker-auto-start | github-copilot/gpt-6.1-sol | improved | 5563 | dispatch: fails -> holds (intended change); commit: holds -> holds (held) |

## Feedback

- tracker-auto-start / anthropic/claude-opus-5-5: After moved the dispatch fact by dropping the pre-dispatch `plan_tracker` in_progress fan-out that Before issued for both indices, and by stating outright that the handoff tracker list is used as-is, never re-initialized, and both tasks stay pending until the wave commits; the dispatch section is explicitly labelled 'with no tracker write'. The commit fact is kept in both: each output places the two `status: "complete"` updates at the existing plan indices strictly after the successful wave commit, with nothing written at worker return. To keep this stable, retain wording that pairs the two instructions explicitly: dispatch performs no tracker write and no reinitialization, and completion is written for every wave task index only after the wave commit succeeds. Keeping that ordering in a short ordered summary, as After does, helps prevent a reader from reintroducing an in-progress write at dispatch or shifting completion to worker return or integration.
- tracker-auto-start / github-copilot/gpt-6.1-sol: The After wording moved the dispatch fact as intended: Before explicitly wrote two in_progress tracker updates ahead of dispatch (while not reinitializing), whereas After states 'No tracker write before dispatch' and 'Do not reinitialize the tracker', dispatching both implementers together. The commit fact is kept in both: each marks both existing plan indices complete only after the successful wave commit, and Before explicitly says worker DONE does not complete a task. One side effect to watch: After opened with 'Stopped before dispatch' because prerequisites were not supplied and collapsed the narration into a terse ordered list with no concrete dispatch or plan_tracker call shapes, where Before still showed the full calls with placeholders. The facts still hold because the ordering and tracker behavior are stated explicitly, but to make this robust, word the prerequisite guard so that a narration-only request still walks through the dispatch call and the two post-commit complete writes (with placeholders for unsupplied paths/indices), and keep the explicit statements that no in-progress writes precede dispatch, the tracker is not reinitialized, and completion follows the wave commit rather than worker return.

exit: 0

## Earlier PR replay: worker-decision-taken

This evidence predates the merged prompt; no replay was run for the merge.

for: fc995a19625ae3417395ad239a44309e3fb9ae8f802d543bf249cdd341197adb

wall: 51s

## Change

Repeat an identified, unwritten interrupted dispatch in the same turn; take recommended in-spec worker decisions with or without amend permission. The selected replays check routing rather than real recovery or commit creation.

Extract wave prerequisites to their required reference without changing their instructions. Include that reference in the replay assembly. Validate wiring and size deterministically only; preserve saved replies and report verdicts as earlier-revision evidence. No model replay or judgment runs in this repair.

Compose committed-originals and accepted-wave messages through the shared commit-message reference using held spec metadata and manifest headings. Preserve scoped entry staging, delegated source reads, isolated reset semantics and completion after the wave commit. Keep wave-commit-wording/boundary passing.
Rebuild Delete ownership from the wave base: strip path line annotations, remove Create paths first, and restore deduplicated Modify/Test plus Delete paths printed by the restricted base-tree listing, excluding Create paths. Skip empty commands and preserve siblings. The rebuild-delete-paths sample covers this behavior change; its report is partial coverage.
Recover suppressed apply JSON from exactly one bounded success capture satisfying unchanged APPLY_SCHEMA. Stop without retry only on the exact baseline-read marker, quoting command/stderr; preserve the ordinary one-retry gate. Establish committed plan/spec originals through path-scoped entry commits before dispatch. The missing-baseline and uncommitted-entry samples cover these changes; delegated-amendment and local-amend-revalidation now use committed originals while retaining failure history and parent gates. Model evidence remains verification-owned.
Recover every missing task result from bounded identity-matched success captures before diagnosis, including accepted siblings hidden by chain failure. Use a named read-only delegate only for absent/rejected captures, stop on duplicate identity, and count missing/empty initial patches without integration. Preserve report bounds, source delegation, in-place gate/review and nonempty initial apply-failure stops.
The bounded-read overflow check names the `Parallel-safe:` line as the report footer (`TRAJECTORY:` on a re-review), not the first-line `Verdict:`.
Localize implement amendments to affected entries and historical evidence, preserving staged repairs during no-execution maintenance. Attribute retained failures by command/assertion/path plus corresponding repair evidence, not task membership. Derive semantic inventory from committed home plan/spec originals before edits and on retry, with previousApplyReport for findings only; keep grant, redraw and unrelated-regression stops and parent stamping. The local-amend-revalidation sample exercises these distinctions. Full model reports/results remain parent verification-owned.
Replace per-task spec and per-wave code review with one post-gate integrated wave review. Read unresolved child reports directly once at limit 300 with one compact retry; retain delegated source/spec/plan reads. Repair on the current integrated tree, using committed clean snapshots and delta-only apply for isolated waves, direct edits in-place. Rebuild only after repair delta apply failure; preserve siblings and original wave base. Fold escalation, convergence, funding and transcript-only recovery into one transition table. These are behavior-changing instructions; parent verification owns model results.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| worker-decision-taken | anthropic/claude-opus-5-5 | improved | 14244 | taken: fails -> holds (intended change); choice: fails -> holds (intended change); exceptions: holds -> holds (held) |
| worker-decision-taken | github-copilot/gpt-6.1-sol | improved | 6090 | taken: fails -> holds (intended change); choice: holds -> holds (intended but unchanged); exceptions: holds -> holds (held) |

## Feedback

- worker-decision-taken / anthropic/claude-opus-5-5: The 'with or without amend permission' wording moved `taken`: After prints `took recommendation: ... for task 3`, appends the existing-helper answer and re-dispatches the retained payload in the same turn with no question, and says the behaviour is identical with or without a grant. Before did this only under an auto-apply grant and otherwise ended the turn on a `gauntlet: question` menu. The held-choice wording moved `choice`: After keeps an explicit `- choice | existing parser helper (task 3) | already handles blank names` line for the wave commit, whereas Before kept only the transcript 'took recommendation' line with no reason and said the commit carries no decision. `exceptions` holds in both, but narrowly in Before, which never auto-takes the three fixes yet calls discard 'not available' and the purchase 'a human-decided scope change' instead of explicitly asking; After ends the turn on a question for all three. To keep all three facts, keep the unconditional take sentence, the held choice-plus-reason line, and an explicit carve-out that discard, redraw and unnamed paid or outside-spec actions always stop and ask regardless of grant. Also tighten After's 'the commit states the choice, if at all, as a whole sentence', because 'if at all' leaves room for the choice and its reason to be dropped at commit time; say plainly where the held choice and reason land.
- worker-decision-taken / github-copilot/gpt-6.1-sol: After moved `taken` by stating up front that the helper choice is an in-spec implementation decision taken "without asking for permission", printing the `took recommendation` line for task 3 unconditionally, and repeating in the permission table that it is auto-taken "even with no amendment grant"; Before failed because its no-grant branch printed a `gauntlet: question` menu and dispatched no retry. `choice` holds in both: Before kept the decision and its blank-names reason in an audit record through the wave commit, and After keeps an explicit `choice | ... | reason` line as the wave's decision record, while both keep it out of the commit message. `exceptions` holds in both: Before stops for explicit approval or authorization on redraw and purchase and refuses to discard work, and After says stop and ask for discard and purchase and stop at the redraw gate. To keep these stable, retain the unconditional took-recommendation line and the retained-payload-plus-answer redispatch. Consider making the redraw row say explicitly that the human is asked (as the discard and purchase rows do) so `exceptions` does not rest on reading "stop at the redraw gate" as asking, and avoid conditionals such as "if the required tree or write-state observations are unavailable, stop" growing into something that reads as a question before the redispatch, since that would put `taken` at risk.

exit: 0
