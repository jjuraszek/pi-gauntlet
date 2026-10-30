# Implement dispatch contract

Read these schemas and carrier rules before the first implement dispatch. Keep them available through recovery. Apply this contract only during implement; leave verification and the loop engine's contract unchanged.

## Schemas

Mirror each child's saved report, not an independent verdict calculation. Bound implementer reasoning to one sentence and 300 characters; keep concerns and evidence entries one line each, questions explicit, and delegated answers one paragraph. Preserve `parallelSafe` as the `Parallel-safe:` line verbatim and `trajectory.line` as the `TRAJECTORY:` line verbatim. Require `behaviourChange` on every CR report, mirroring `Behaviour-change:`. Use `measured` only for values an explicit `orchestrator` instruction consumes.

```ts
const IMPLEMENTER_STATUS_SCHEMA = {"type":"object","required":["status","reasoning"],"additionalProperties":false,"properties":{"status":{"type":"string","enum":["DONE","DONE_WITH_CONCERNS","NEEDS_CONTEXT","BLOCKED"]},"reasoning":{"type":"string","maxLength":300},"concerns":{"type":"array","items":{"type":"string"}},"question":{"type":"string"},"anchorUnreadable":{"type":"string"},"measured":{"type":"object"}},"allOf":[{"if":{"properties":{"status":{"const":"DONE_WITH_CONCERNS"}}},"then":{"required":["concerns"]}},{"if":{"properties":{"status":{"const":"NEEDS_CONTEXT"}}},"then":{"required":["question"]}}]};
const SPEC_VERDICT_SCHEMA = {"type":"object","required":["verdict","reasoning"],"additionalProperties":false,"properties":{"reasoning":{"type":"string"},"findingCount":{"type":"integer","minimum":0},"parallelSafe":{"type":"string"},"touchedTasks":{"type":"array","items":{"type":"integer"}},"trajectory":{"type":"object","required":["verdict","line"],"additionalProperties":false,"properties":{"verdict":{"type":"string","enum":["CONVERGING","DIVERGING","STAGNANT"]},"line":{"type":"string"}}},"anchorUnreadable":{"type":"string"},"verdict":{"type":"string","enum":["COMPLIANT","NEEDS_REWORK","OUT_OF_SCOPE_CHANGES"]},"maxSeverity":{"type":"string","enum":["PARTIAL","MISSING","SCOPE_CREEP"]}}};
const CODE_VERDICT_SCHEMA = {"type":"object","required":["verdict","reasoning","behaviourChange"],"additionalProperties":false,"properties":{"reasoning":{"type":"string"},"findingCount":{"type":"integer","minimum":0},"parallelSafe":{"type":"string"},"touchedTasks":{"type":"array","items":{"type":"integer"}},"trajectory":{"type":"object","required":["verdict","line"],"additionalProperties":false,"properties":{"verdict":{"type":"string","enum":["CONVERGING","DIVERGING","STAGNANT"]},"line":{"type":"string"}}},"anchorUnreadable":{"type":"string"},"verdict":{"type":"string","enum":["SHIP","FIX_FIRST","REJECT"]},"maxSeverity":{"type":"string","enum":["Critical","Moderate","Minor"]},"behaviourChange":{"type":"boolean"}}};
const ANSWER_SCHEMA = {"type":"object","required":["answer","evidence"],"additionalProperties":false,"properties":{"answer":{"type":"string"},"evidence":{"type":"array","items":{"type":"string"}}}};
const DIAGNOSIS_SCHEMA = {"type":"object","required":["tasks","decision","diagnostic"],"additionalProperties":false,"properties":{"tasks":{"type":"array","items":{"type":"object","required":["task","status","reportPath","diagnostic"],"additionalProperties":false,"properties":{"task":{"type":"integer"},"status":{"type":"string"},"reportPath":{"type":"string"},"patchPath":{"type":"string"},"diagnostic":{"type":"string"}}}},"decision":{"type":"string","enum":["retry","repair","stop"]},"diagnostic":{"type":"string"}}};
const PREPARE_SCHEMA = {"type":"object","required":["items","redraws"],"additionalProperties":false,"properties":{"items":{"type":"array","items":{"type":"object","required":["evidence","recommended","location","edit"],"additionalProperties":false,"properties":{"evidence":{"type":"string"},"recommended":{"type":"string","pattern":"^(accept|alt-[0-9]+)$"},"location":{"type":"string"},"edit":{"type":"string"}}}},"redraws":{"type":"array","items":{"type":"object","required":["location","reason"],"additionalProperties":false,"properties":{"location":{"type":"string"},"reason":{"type":"string","maxLength":300}}}}}};
const APPLY_SCHEMA = {"type":"object","required":["amendedSections","tasksAdded","tasksAnchorChanged","tasksRemoved","passed"],"additionalProperties":false,"properties":{"amendedSections":{"type":"array","items":{"type":"string"}},"tasksAdded":{"type":"array","items":{"type":"integer"}},"tasksAnchorChanged":{"type":"array","items":{"type":"integer"}},"tasksRemoved":{"type":"array","items":{"type":"integer"}},"passed":{"type":"boolean"},"failLines":{"type":"array","items":{"type":"string"}}}};
```

## One-step carrier

Use this shape for initial CR, repair implementers, post-repair SR fan-outs, SR/CR re-reviews, escalated/funded rounds, delegated answers and amendment workers. Set the persona and schema for each item; use `/status` for implementers and `/verdict` for reviewers with their non-clean enums. Put `output`, `outputMode` and `outputSchema` on every item, never on a `ParallelStep`. Keep `context: "fresh"` and `async: false` invocation-level. Omit `model` except a runtime-resolved setting or a user-named override. A schema-bound `anchorUnreadable` is a failed attempt, not permission for the primary to inspect the file.

```ts
subagent({ async: false, context: "fresh", cwd: "<owning checkout>",
  chain: [{ parallel: [
    { agent: "code-reviewer", output: "<REPORT_DIR>/wave<w>-cr<k>.md",
      outputMode: "file-only", outputSchema: CODE_VERDICT_SCHEMA,
      task: "planPath: <absolute plan>; anchors: <wave task prefixes>; Spec: <absolute home spec>; BASE_SHA: <WAVE_BASE_SHA>; HEAD_SHA: WORKTREE; SCOPED_TEST_COMMANDS: <manifest union>" }
  ], stopOn: { path: "/verdict", in: ["FIX_FIRST", "REJECT"] } }]
})
```

For answer/evidence, preparation and apply results, retain their approved schemas without adding a status field. Use carrier-only `stopOn: { path: "/status", in: ["BLOCKED"] }`: an absent pointer does not match, but the presence of stopOn exposes successful `## Outputs` JSON. Save each report under `REPORT_DIR`. Give delegated reads the question, artifact paths, owning checkout, and documented lookup ordering; let the child read source, provenance, task contents or current grants. Consume only `answer` and `evidence`. A delegated failure stops; never recursively diagnose delegated failures.

## Anchored payload

Pass `planPath: <absolute plan path>`, `anchor: "### Task N:"` or `anchors: [<exact prefixes>]`, and `Spec: <absolute authoritative home spec path>` to every implementer, SR and CR. `### Task 4:` never matches `### Task 40:`; end each selected section at `^#{2,3}\s`. Children read the union of selected sections, `Spec:`, `Files:`, `Tests:`, `Rules:` and `Leg:` themselves. Combine task Rules with that leg's Rules in home `## Legs`; absent Leg uses the first `### Leg:`. Resolve rules in the owning checkout. Pass isolated implementers only their own task's manifest `tests` as `SCOPED_TEST_COMMANDS`, or `none` when empty, including isolated spec-gap redispatch. Give the integrated gate, in-place repairs and code reviews the wave union; give initial in-place implementers that union too. Preserve command strings verbatim; keep dispatch-supplied commands independent of the Tests metadata children read.

Forward dependent context as the prior status line plus report path. Put the saved prior report path under `## Previous review report (re-review trigger)`; require the child to read it and apply the existing trajectory block. Findings and binary delta bytes stay child-owned.
