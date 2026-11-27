# eval report: waves (selected samples only)

No replay was run on the merged prompt.

## Earlier main replay: tracker-auto-start

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

## Earlier PR replays: blocked-decision-auto-taken, worker-decision-taken

This evidence predates the merged prompt.

for: 78cc162c9ac91943c7350fdf13ce813c59943a74276499fd64ae32d700a6d093

wall: 79s for blocked-decision-auto-taken; 43s for worker-decision-taken

## Change

Use blocked-decision-auto-taken and worker-decision-taken to check that permission to change the spec does not gate an in-spec repair. Hold each recommendation and its reason for the accepted wave commit.

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
| blocked-decision-auto-taken | anthropic/claude-opus-5-5 | improved | 12366 | taken: holds -> holds (held); attempts: holds -> holds (held); repeated: holds -> holds (held); controls: fails -> holds (intended change) |
| blocked-decision-auto-taken | github-copilot/gpt-6.1-sol | improved | 17967 | taken: fails -> holds (unplanned improvement); attempts: holds -> holds (held); repeated: holds -> holds (held); controls: fails -> holds (intended change) |
| worker-decision-taken | anthropic/claude-opus-5-5 | improved | 5595 | taken: fails -> holds (intended change); choice: fails -> holds (intended change); exceptions: fails -> holds (unplanned improvement) |
| worker-decision-taken | github-copilot/gpt-6.1-sol | improved | 12280 | taken: fails -> holds (intended change); choice: fails -> holds (intended change); exceptions: holds -> holds (held) |

## Feedback

- worker-decision-taken / anthropic/claude-opus-5-5: After moved all three facts in the intended direction. 'taken' now holds because After states the outcome is identical with or without a grant, prints `took recommendation: existing parser helper for task 3`, appends the helper answer and redispatches the retained payload in the same turn with no menu; Before gated this on the grant and ended the no-grant turn on a `gauntlet: question` stop with nothing dispatched. 'choice' now holds because After adds a `- choice | ... existing parser helper | It already handles blank names...` line to the wave commit body, whereas Before kept only the took-recommendation line in transcript/tracker, dropped the reason, and said the commit body carries no decision lines. 'exceptions' now holds because After routes discard, redraw and the unnamed purchase each to an explicit human question that ends the turn; Before only asked for the redraw, calling discard 'not available' and the purchase 'never takeable' without asking the human. Before kept none of these facts, so nothing was lost; to keep the gains stable, keep the literal 'with or without amend permission' phrasing next to the took-recommendation print, keep the choice line carrying both the selection and its reason tied explicitly to the accepted wave commit, and keep the three exceptions enumerated by name as ask-first stops so they are not read as mere refusals or as covered by a grant.
- worker-decision-taken / github-copilot/gpt-6.1-sol: After moves `taken` because it prints `took recommendation: use the existing parser helper for task 3` unconditionally, says outright that no amendment grant is needed, and appends the helper answer to the retained payload for redispatch with no user question; Before only did this under standing amend permission and, with no grant, stopped on a `gauntlet: question` menu without dispatching. After moves `choice` because it holds an explicit `choice | helper | reason` line for the accepted wave commit; Before kept the decision and reason only as an audit record, told the reader not to put it in the commit message, and recorded no choice at all in its no-grant branch. `exceptions` holds in both: neither takes discard, redraw or the unnamed purchase automatically, and After is in fact clearer, since Before's discard row said "not authorized, preserve the work" without explicitly saying to ask (a borderline hold). To keep these, keep the wording that separates an in-spec worker decision from a spec edit, with the grant gating only the latter, and keep the three explicit stop-and-ask rows. One thing to tighten: After hedges that isolation mode and literal paths must be resolved "before issuing a concrete dispatch", which a stricter reader could take as not actually redispatching; wording that makes the redispatch the same-turn action using the retained payload as-is would make `taken` more robust.

exit: 0
