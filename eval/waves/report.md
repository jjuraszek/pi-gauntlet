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
