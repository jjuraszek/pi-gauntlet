# Chain recovery

## Chain stopped or failed

Retain accepted siblings; never repeat the initial chain or rerun accepted tasks. Inspect failed tasks alongside `## Stop`; a matched stop precedes sibling-error checking. Reconcile every dispatched task without a structured result in `## Outputs` or `## Stop`, including successful siblings suppressed by a chain failure. Repair rounds use this same recovery.

List captures once with `ls <Artifacts>/structured-output/*/output.json`. Read each listed file once with `limit: 300`, no offset or pagination. Accept only a complete `{"status":"success","value":{...}}` envelope whose `value` satisfies `IMPLEMENTER_STATUS_SCHEMA`: an allowed `value.status`, `question` for `NEEDS_CONTEXT`, `concerns` for `DONE_WITH_CONCERNS`, and exactly one identity. Match `value.anchor` to the dispatched anchor verbatim, or `value.anchors` to the dispatched heading list as a set. Read only this run's artifacts.

| Capture result | Action |
|---|---|
| One valid matching capture | Route `value.status` through [Implementer Status](./waves.md#implementer-status) and the [transition table](./waves.md#the-wave-loop) as an observed result. Reconcile accepted `DONE` / `DONE_WITH_CONCERNS` siblings through [step 3](./waves.md#the-wave-loop) in plan index order before handling unanswered tasks; route `NEEDS_CONTEXT` / `BLOCKED` through [Implementer Status](./waves.md#implementer-status); only on the takeable-decision branch follow the [ladder](./escalation.md#escalation-and-funding). For a batch identity, route once for every task in that batch. Print the existing `wave <w> task <n> <status> report <path> patch <path>` observation per task. |
| Two captures claim the same dispatched identity | Stop naming both paths; never guess. |
| No file, error envelope, missing value, malformed/rejected schema, stale or unmatched identity, or a read truncated before the closing brace | Treat the task's capture as absent; diagnose below. |

Only a task with no accepted capture takes delegated identity-matched artifact diagnosis, once. Dispatch one sequential chain step, never a `parallel` item, with `agent: "delegate"`, `DIAGNOSIS_SCHEMA` and `stopOn` on `/decision`; put the literal sentence `Do not edit any file.` on its own line in the task text. After `decision: repair`, use the ordinary one-step implementer carrier.

```ts
subagent({ async: false, context: "fresh", cwd: "<owning checkout>",
  chain: [{ agent: "delegate", task: `Diagnose <run/task identities>; Artifacts: <dir>; known reports: <paths>; session artifacts: <locations>.
Do not edit any file.
Return compact statuses and retry/repair/stop; never invent a verdict.`,
    output: "<REPORT_DIR>/wave<w>-diagnosis.md", outputMode: "file-only", outputSchema: DIAGNOSIS_SCHEMA,
    stopOn: { path: "/decision", in: ["retry", "repair", "stop"] } }]
})
```

Keep this a sequential step, not a parallel item. Let the child alone inspect identity-matched session failure artifacts, not empty parallel-0 directories; diagnosis is not a saved-report relay. Route diagnosis JSON through the [transition table](./waves.md#the-wave-loop). Stop on missing or ambiguous artifacts unless Recovery establishes an interrupted dispatch. Use Recovery for an interrupted diagnosis; stop on other delegated failures. Never recursively diagnose. An implementer anchor failure takes the failed-attempt path; reviewer anchorUnreadable hard-stops.

## Recovery

Recover static state only with `plan_check({ planPath })` and tracker status. Recover dynamic state only from the observations below. For an interruption before a result, first reconcile captures under Chain stopped or failed. Redispatch in the same turn only when printed observations establish the wave base, dispatch identity and that the interrupted step wrote nothing to the owning checkout. Repeat a read-only helper (answer/evidence lookup, `Amend-prepare:` or diagnosis) once with its retained payload; stop on a second failure. Route an interrupted isolated-wave worker through the dispatch-error row with its retained payload; charge `failed[n]` once and retain accepted siblings. Never guess whether an in-place worker wrote, replay `Amend-apply:` outside its own step-4 retry, or choose between two captures for one identity. Stop when the required base, identity, absence of writes, repair `applied` status or review outcome is unknown. Continue after a repair only with a terminal review after `applied yes` or a green gate after the last repair. Old tree-only review lines do not authorize continuation. Keep original base, report paths, tree IDs and funding spending; never infer integration. Recover funded spent only from `funded round` observations; absent history means exhausted, not reset. A funded observation records spending before dispatch, not a terminal outcome.

```text
wave <w> base <sha>
wave <w> task <n> <status> report <path> patch <path>
wave <w> integrated task <n>
wave <w> task <n> apply failed
wave <w> gate <i> exit <code>
wave <w> review <k> verdict <value> report <path> tree <sha>
wave <w> repair <k> task <n> <status> report <path> delta <path> applied <yes|no>
rebuild: task <n> - delta apply failed
escalated round for task <n> after 2 failed attempts
funded round <k> of <N> for task <n>
repair-base: <path> <sha>
```

For in-place repairs print `delta none applied n/a`.
