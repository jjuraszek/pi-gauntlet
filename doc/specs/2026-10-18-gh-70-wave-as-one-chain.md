# Wave implementers and spec reviewers as one chain (gh-70)

Ticket: [jjuraszek/pi-gauntlet#70](https://github.com/jjuraszek/pi-gauntlet/issues/70)

**Goal:** In Parallel-Wave Mode, dispatch a wave's implementers and its first spec reviews as one pi-cohort `chain:` call - each reviewer's `cwd` is the `{outputs.impl_<n>.treePath}` checkout pi-cohort 7.4.0 builds from the implementer's base commit plus patch - so an all-`DONE` wave costs one parent `subagent()` call for steps 2-3 instead of two; every other path (stop, chain error, spec gap, re-review, older pi-cohort, sequential mode) runs today's text unchanged, including the parent-built spec-review snapshot.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

Supersedes `doc/specs/2026-05-31-parallel-wave-execution.md`, "Design Overview" implementer fan-out and spec-review dispatch shape only (two foreground fan-outs become one chain on the all-`DONE` path; integration, test gate, code review, commit, and tracker rules stay live there).
Supersedes `doc/specs/2026-07-06-parallel-wave-spec-reviewer-dispatch.md`, the dispatch mechanics of the per-patch `spec-reviewer` fan-out only (it becomes the chain's second step on the all-`DONE` path and stays a plain fan-out over snapshots otherwise); the SR contract it defines, as already narrowed by `2026-08-23-gh-13-plan-fidelity-anchors.md`, stays live.

## Problem

Each parent turn in the implement phase re-sends the parent's whole context (median 260k tokens at peak over 58 recorded runs, per the ticket), so the parent's turn count is the cost driver. Today's wave loop spends two `subagent()` turns on the clean path - one implementer fan-out, then a parent-built snapshot per patch and one spec-reviewer fan-out (`skills/subagent-driven-development/SKILL.md` Parallel-Wave steps 2-3 and "Spec-review snapshots") - and a third on code review after integration.

The blocker named when 7.18.0 shipped the side fixes without the chain (`8e14e30`: "a pi-cohort chain step cannot materialize base + patch as its cwd") is gone: pi-cohort 7.4.0 (installed and published; `pi-cohort/CHANGELOG.md` `## [7.4.0] - 2026-10-19`) lets a later chain child set `cwd: "{outputs.<name>.treePath}"`, a lazy detached checkout of the producer's base commit with its captured patch applied via `git apply --index`, shared per name and removed at chain end (`pi-cohort/doc/agents-and-chains.md:317-321`). Only `treePath` is allowed in `cwd`, never on a `worktree: true` step. 7.3.0's `stopOn: { path, in }` over schema-validated structured output retains every finished sibling's text and structured output on a stop. 7.4.0 also tells a child with acceptance plus `outputSchema` to write its acceptance report before calling `structured_output`; in the live fixture implementers complied and every spec reviewer skipped the report (acceptance `rejected`: "Structured acceptance report not found."), so only the implementer step, which `stopOn` needs, carries a schema.

Framing: pivoted to a fresh delta on `main` 27ab87b - the earlier `gh-70` branch predates 2df7fc8 (snapshots, `git apply --index` integration, `BASE_SHA`/`HEAD_SHA: WORKTREE` code review, in-place CR repairs) and its diff deleted that flow; the user chose to reset the branch and keep only the design. Within that, the chain covers implementers plus the first spec review only; code review stays the separate post-integration call: a pure implementers -> SR -> CR chain has no integrator step, and `git apply` plus the scoped test gate are parent actions between spec review and code review (pi-cohort `doc/specs/2026-10-18-gh-23-chain-verdict-stop-conditions.md`, D8).

## Acceptance criteria

Ticket #70, `### Acceptance Criteria`, rows verbatim:

- [ ] On a fixture plan with one wave of 3 independent tasks that all pass review, the implement-phase parent transcript shows one `subagent()` call for the wave's implementers, spec reviewers, and code reviewer together, and the telemetry record shows 3 implementer, 3 spec-reviewer, and 1 code-reviewer dispatches.
  deviates: user chose the implementer -> spec-reviewer chain with code review as a separate call, because code review must see the integrated, test-gated diff and pi-cohort has no integrator step (pi-cohort gh-23 spec, D8). The implementer + spec-reviewer part is D1; the persona counts are the live fixture run in Tests.
- [ ] On a fixture plan where one task's spec reviewer returns `FAIL`, the chain stops before the code reviewer runs (zero code-reviewer dispatches at that point), the parent runs the fix loop on that task only, and the code reviewer runs once after the re-review passes.
  in-scope
- [ ] An implementer status of `NEEDS_CONTEXT` or `BLOCKED` stops the chain before any spec reviewer runs, and the parent handles it as the skill does today.
  in-scope
- [ ] Escalation sentinels (`TRAJECTORY: STAGNANT`, `DIVERGING`, max severity Critical) and the one-escalation-per-loop rule behave as today; the skill's fix-loop section is unchanged in meaning.
  in-scope
- [ ] `plan_tracker` statuses and the per-persona telemetry counts for a run are identical to the pre-change engine on the same fixture plan, except for the parent's call count, which is tabulated in the PR (baseline about 2 parent calls per dispatch).
  in-scope
- [ ] `eval/subagent-driven-development/` gains a sample whose must-hold facts are: one chain call per wave, stop on `FAIL` before code review, fix loop only for the failed task; `node eval/run.mjs subagent-driven-development` is run and its `report.md` committed.
  in-scope
- [ ] `package.json` names the minimum pi-cohort version that ships the stop condition, and the skill states what happens when the installed pi-cohort is older (fall back to today's per-dispatch calls, or refuse with a message naming the version).
  in-scope

Readings for in-scope rows, as Design clauses:

- Row 2: "the chain stops before the code reviewer" holds because the chain's last step is spec review; a spec gap completes the chain, and code review is dispatched only after every spec verdict is `COMPLIANT`, the parent has integrated, and the test gate passed (D1, D3).
- Row 3: "stops the chain before any spec reviewer runs" holds on both shapes a `BLOCKED`/`NEEDS_CONTEXT` implementer can take (an exit-0 stop record, or a completion-guard failure because it made no edits); neither runs the SR step (D3).
- Row 5: "the same fixture plan" is the two fixture plans rows 1 and 2 name (all-pass; one spec gap). Parity is asserted on persona counts and `plan_tracker` status sequences from those two runs on `main` and on the candidate. "Tabulated in the PR" lands in the ship commit body (this repo ships through `/skill:release`; the overrides file names no PR gate on `main`), and in the PR body when the finish opens one.
- Row 6: the target already exists with four samples (2df7fc8); the row's sample is D5's `chain-wave-dispatch` plus `chain-stop-blocked`, and `report.md` is regenerated from the final full run.
- Row 7: "installed pi-cohort is older" chooses fallback, not refusal (D4); the minimum is 7.4.0 because `treePath`, not `stopOn` (7.3.0), is the newest construct the chain needs.

## Design

### D1. Wave dispatch shape

Parallel-Wave steps 2 and 3 become one chain call on the all-`DONE` path. Step 2's text becomes: "Record `WAVE_BASE_SHA`, mark every wave index `in_progress`, run the D4 version preflight, then make one chain dispatch (shape below): an implementer step, `worktree: true`, `context: "fresh"`, followed by a spec-reviewer step whose tasks run in each implementer's `treePath`." Step 3's text becomes: "Read the chain result (statuses, verdicts, patches, reports as named below). All implementers `DONE` and all verdicts `COMPLIANT` -> step 4. Anything else -> Chain stopped or failed." The chain block replaces the current `tasks:` block; "Chain stopped or failed" is a `###` heading placed after the chain block and before `## Spec-review snapshots`. The parent still runs steps 4-7 itself.

```ts
REPORT_DIR=$(mktemp -d)   // as today

subagent({
  async: false,
  context: "fresh",
  cwd: "<abs worktree path>",         // children branch from this HEAD
  chain: [
    {
      parallel: [
        { agent: "implementer", as: "impl_1", outputSchema: IMPLEMENTER_STATUS_SCHEMA,
          output: "<REPORT_DIR>/wave<w>-task1.md",
          task: "<task text + owned files + SCOPED_TEST_COMMANDS + status protocol> pi-cohort saves your final report to the output path; do not write that file yourself, and it is not a concern about owned files." },
        // one entry per wave task, as: "impl_<n>" in plan index order
      ],
      worktree: true,                 // step-level; binds {outputs.impl_<n>.patchPath} and .treePath
      concurrency: 4,
      stopOn: { path: "/status", in: ["BLOCKED", "NEEDS_CONTEXT", "DONE_WITH_CONCERNS"] },
    },
    {
      parallel: [
        { agent: "spec-reviewer", as: "sr_1",
          cwd: "{outputs.impl_1.treePath}",   // base commit + patch, built and removed by pi-cohort
          output: "<REPORT_DIR>/wave<w>-sr1.md",
          acceptance: { level: "none", reason: "the parent reads each SR Verdict: line; review trees are staged by design" },
          task: "<task text + absolute spec path (in the implementation worktree) + Spec: anchors + Tests: block + Test: paths> The patch under review is the file at {outputs.impl_1.patchPath}; the working tree you run in already has it applied. The implementer's report is at <REPORT_DIR>/wave<w>-task1.md; read it for the 'What Implementer Claims They Built' section." },
        // one entry per wave task, paired by index
      ],
      concurrency: 4,
    },
  ],
})
```

The schema appears once in the skill text:

```ts
IMPLEMENTER_STATUS_SCHEMA = { type: "object", required: ["status"], additionalProperties: true,
  properties: { status: { type: "string", enum: ["DONE", "DONE_WITH_CONCERNS", "NEEDS_CONTEXT", "BLOCKED"] } } }
```

SR tasks carry no `outputSchema`: no `stopOn` reads their verdict, and the persona's prose `Verdict:` line in its `output:` report is the verdict source, as on the non-chain path.

Rules the skill text carries:

- `context`, `async`, and top-level `cwd` are invocation-level; `worktree`, `concurrency`, and `stopOn` are step-level; `as`, `outputSchema`, `cwd`, `output`, `acceptance`, and `task` are per-task. The SR step carries no `worktree` flag, no `stopOn` (it is the last step; nothing follows to skip), and no `outputSchema`. Per-task `cwd` outranks step and run `cwd` (`pi-cohort/doc/agents-and-chains.md`).
- The SR task text keeps today's contract: review starts from the diff (hunks carry `file:line`), reads each touched file in full from its `cwd`, never executes tests, reads anchored ranges from the authoritative spec at its absolute path in the implementation worktree; deleted files are read from `WAVE_BASE_SHA`. The implementer's claims come from its `output:` report file, whose path is known when the chain is built. Output references resolve only in `task` strings and in `cwd` (`treePath` only), never in `reads:`; the parent pastes no diff.
- `as:` names are positional (`impl_<n>`, `sr_<n>`, 1-based wave position); the parent maps results back to plan indices by position.
- pi-cohort injects the `structured_output` instruction when `outputSchema` is set and, with acceptance on, orders the acceptance report before it (7.4.0); the enum constrains the implementer value to the persona's own status vocabulary, so the prompt files do not change.
- **What the parent reads, and from where** (the tool result text is the only surface the parent sees; `details` is not): implementer statuses from the result's `## Outputs` section (one fenced JSON per exit-0 implementer) and `## Stop` line, present on completion and on a `stopOn` stop; SR verdicts from the `Verdict:` line of each SR `output:` report, one of the persona's `COMPLIANT`, `NEEDS_REWORK`, or `OUT_OF_SCOPE_CHANGES`. Each implementer's patch is `<Artifacts dir>/worktree-diffs/step-0/task-<i>-implementer.patch` (`<i>` = 0-based wave position; the `Artifacts:` footer names the dir) - this is the path step 4's `git apply --index`, the spec-gap re-dispatch, and D2's snapshot block take. Each exit-0 task's report is its `output:` file; the fix loop carries that file's full contents verbatim under `## Previous review report` (never the `Output saved to:` pointer that `outputMode: "file-only"` puts in the inline text). A task that exited non-zero has no `output:` file and no bound output. Recover its prose from its session `subagent-artifacts` output file (`<runId>_implementer_<index>_output.md`, as defined by pi-cohort `src/shared/artifacts.ts`), using the run/task identity in the result or session transcript, not the chain's empty `parallel-0/` directories. If artifacts are disabled, missing, or cannot be unambiguously matched, use When a Subagent Fails with the visible diagnostic; never invent a status.
- The implementer task string states that pi-cohort writes the `output:` file. In the live candidate spec-gap fixture an implementer told to own one file read pi-cohort's injected "Write your findings to:" line as a conflict, returned `DONE_WITH_CONCERNS`, and stopped a chain whose code was clean; pi-cohort persists the final output to that path itself (`src/runs/shared/single-output.ts`).
- Each SR task disables pi-cohort acceptance with `acceptance: { level: "none", reason: ... }` (per task: a static `parallel` step has no `acceptance` field in pi-cohort 7.4.0, `src/shared/settings.ts` `ParallelStep`), the same form `writing-plans` uses for `plan-writer`. pi-cohort's `inferLevel` (`src/runs/shared/acceptance.ts`) grades a task from its free text: a write word such as "edit" or "fix" without a read-only phrase gives `checked`, and a risky word such as "security" or "migration" gives `reviewed` before the read-only check runs; an explicit level only raises the inferred one, and only `none` with a reason lowers it. `checked` and above fail `no-staged-files` on the `treePath` tree, which pi-cohort stages with `git apply --index`. In the live candidate fixtures chained SR acceptance was `attested` or `rejected` depending only on the parent's wording, while the flow never reads that ledger; the verdict is the `Verdict:` line. Main's unchanged snapshot re-review and integrated code review keep inferred acceptance as today.
- Per-task `output:` paths stay under `REPORT_DIR` as today; the large-wave `outputMode: "file-only"` hint is kept for the SR step, with the read rule above.
- The chain is the only dispatch shape for steps 2-3 on the all-`DONE` path with pi-cohort >= 7.4.0. Every other dispatch in the wave - fix-round implementer re-dispatch (a one-entry `tasks` array with invocation-level `worktree: true`, `context: "fresh"`, `cwd`), re-reviews, re-dispatch by cause, escalation, code review, in-place repair, sequential mode - keeps its current shape.

### D2. Spec-review snapshots stay for every non-chain review

The "Spec-review snapshots" section and its shell block are unchanged. Its lead sentence gains the scope: the block materializes a patch for every spec review the chain did not run - the sibling patches retained after a chain stop or error, the replacement patch of a fix-round re-review, and every review on the fallback path. First reviews on the all-`DONE` path use the chain's `treePath` instead. Post-integration SR still reviews the implementation worktree directly. The fail-closed rule stands everywhere: a review runs only against a materialized base-plus-patch tree; a missing patch, an empty capture, or a failed apply stops that task's review for diagnosis, never a review of the unchanged tree.

### D3. Chain outcomes: the existing path, under one heading

Step 3's current text (parse statuses first, judge `DONE_WITH_CONCERNS`, answer `NEEDS_CONTEXT`, diagnose `BLOCKED`, then the spec-reviewer fan-out over snapshots of accepted patches, then the spec-gap loop within Fix-Loop Rounds) stays in full under the `### Chain stopped or failed` heading, prefixed by one rule:

> Read the chain result once. Inspect failed tasks regardless of whether `## Stop` is also present: pi-cohort evaluates the stop condition before checking sibling failures, so both can coexist. Read exit-0 statuses from `## Outputs` when present or their `output:` reports; recover failed-task prose using D1's session-artifact rule, including its unavailable-artifact fallback. `## Stop` reports an exit-0 `BLOCKED`, `NEEDS_CONTEXT`, or `DONE_WITH_CONCERNS` task, not successful completion of every sibling. Completion-guard failures (including no-edit blocked tasks), rejected or missing `structured_output`, failed `treePath`, and sibling process failures all receive failed-task diagnosis. Continue below as if step 2 had been a plain fan-out. Handle a recoverable `BLOCKED` or `NEEDS_CONTEXT` through its status matrix; a task with no recoverable status, or an accepted task whose patch is missing or empty, goes through When a Subagent Fails. Successful siblings are never re-run. Keep any exit-0 SR verdict obtained in a materialized tree; snapshot-backed SR covers only accepted patches without one. Never dispatch a second chain in the same wave.

Chain completed without a stop: every implementer is `DONE` and every verdict is in hand. All `COMPLIANT` -> step 4. Any `NEEDS_REWORK` or `OUT_OF_SCOPE_CHANGES` -> the existing spec-gap loop for those tasks only: re-dispatch the implementer carrying the prior patch (artifacts path) and the reviewer's findings (the SR `output:` file, verbatim), snapshot the replacement patch (D2), one plain re-review with the `## Previous review report` marker, within Fix-Loop Rounds; passing siblings keep their patches and verdicts.

Red Flags gains one row: "Second chain call in the same wave after a stop or a chain error - the retained results are the fan-out result; continue on the snapshot path."

### D4. Version floor and preflight

`package.json` `peerDependencies.pi-cohort` moves from `>=7.3.1` to `>=7.4.0`; in `README.md:125` only that version token changes and one sentence is appended ("In Parallel-Wave Mode a wave's implementers and first spec reviews are one chain call"), keeping the bullet's `async: false` / `forceTopLevelAsync` text. Pi does not auto-install peers for managed packages, so the field is declarative. A pi-cohort below 7.4.0 does not reject the chain: 7.3.x validates output references in task strings only, runs the implementers, then hands the SR children a literal `{outputs.impl_1.treePath}` cwd. The runtime gate is therefore a preflight the parent runs once per implement phase, before the first wave:

```bash
COHORT_DIR=$(pi list | grep -A1 'pi-cohort$' | tail -1 | tr -d ' ')
COHORT_VERSION=$(node -p "require('$COHORT_DIR/package.json').version")
```

`COHORT_VERSION` >= 7.4.0 (semver compare on the three numbers) -> the chain shape. Lower, or either command fails -> every wave in this run uses today's two fan-outs (step 2 as a plain implementer `tasks` fan-out, step 3 as "Chain stopped or failed" reads it); the parent notes `pi-cohort <version>: chain disabled` once. The skill's Parallel-Wave section states: "Requires pi-cohort >= 7.4.0 for `treePath` (`stopOn` is 7.3.0); below it, the preflight turns the chain off and the wave runs as today's two fan-outs."

### D5. Eval target `eval/subagent-driven-development/`

The existing target keeps its four samples (`committed-sequential-review`, `integrated-wave-repair`, `patch-review-snapshot`, `snapshot-apply-failure`) and they must still hold. `patch-review-snapshot`'s `case.md` premise gains one line - the preflight found pi-cohort 7.3.1 - so it exercises D4's fallback on both sides and keeps its snapshot facts; `intent.md` names it as the fallback-path sample. `target.json` slices gain the chain block and the "Chain stopped or failed" heading. `intent.md` gains one paragraph: one chain per all-`DONE` wave on >= 7.4.0; snapshots for every other review; never re-chain; fail-closed trees. Two samples are added, each a baseline-vs-candidate text replay:

| Sample | Scenario | Must-hold facts |
|---|---|---|
| `chain-wave-dispatch` | 2 tasks, pi-cohort 7.4.0, all `DONE`; SR 2 `NEEDS_REWORK` | exactly one `subagent` call with `chain:` for steps 2-3, `worktree: true` + `stopOn` on the implementer step, each SR task `cwd` = `{outputs.impl_n.treePath}`; no parent snapshot before that call; chain completes on the spec gap; no code-reviewer dispatch before task 2 is repaired; one implementer re-dispatch for task 2 only, carrying the artifacts patch and the SR report file; its re-review uses the snapshot block; code review once, after step 5 |
| `chain-stop-blocked` | task 2 `BLOCKED` (the replay states only the status, not whether it edited), task 1 `DONE` | no spec reviewer ran for task 2; `BLOCKED` handled per the status table; exactly one snapshot-backed SR for task 1 from its artifacts patch; no second chain |

`chain-wave-dispatch` carries the ticket's row-6 facts. `report.md` is regenerated from the final full run and committed.

## Errors and edge cases

| Case | pi-cohort behavior | Parent action |
|---|---|---|
| Implementer `BLOCKED` / `NEEDS_CONTEXT` / `DONE_WITH_CONCERNS`, exit 0 (it made edits) | `## Stop` set after all siblings finish; SR step never runs; statuses and patches retained | D3: judge, answer, diagnose as today; snapshot + plain SR fan-out over accepted sibling patches |
| Implementer `BLOCKED` / `NEEDS_CONTEXT` with no edits | completion guard fails that task (exit 1); chain error, possibly with a sibling's `## Stop`; siblings retained; SR step never runs | D3: recover prose from session artifacts or use When a Subagent Fails if unavailable; handle recovered status through the matrix; snapshot SR for accepted siblings |
| Implementer `DONE` with no edits, or an empty/missing patch capture | `{outputs.impl_<n>.*}` unresolvable; that SR task fails without a child; sibling SRs run and are retained | D3; verdicts in hand kept; that task goes through When a Subagent Fails - no review without a materialized tree |
| `treePath` fails to materialize (apply error on pi-cohort's side) | that SR task fails; siblings retained | D3; same as the row above - the patch is diagnosed, never reviewed against the unchanged tree |
| Missing or invalid `structured_output` call | task exits 1; no `output:` file, no bound output | D3; recover prose from session artifacts if available, independently of any stop record; implementer patch from the artifacts path if captured, else When a Subagent Fails |
| Spec `NEEDS_REWORK` / `OUT_OF_SCOPE_CHANGES` | chain completes; verdicts are the `Verdict:` lines of the SR `output:` reports | D3 spec-gap loop for those tasks; re-review on a parent snapshot (D2) |
| pi-cohort < 7.4.0 | would run implementers then fail every SR child on a literal cwd | never reached: D4 preflight disables the chain for the run |
| Wave of one task | chain of one implementer and one reviewer | no special case |
| Textual conflict at integrate, test-gate failure, doc-only wave CR skip | unchanged | unchanged (steps 4-6) |

The chain never retries. A wave's `subagent()` count on the clean path is 1 (chain) + 1 (code review); the non-clean counts are what the fixture table in Tests records. `plan_tracker` lifecycle is unchanged (`in_progress` before the chain call, `complete` at wave commit).

## Tests

- `npm test` (`scripts/ci.mjs`): skill lint, eval structural lint for the two new samples, `package.json` shape and version/CHANGELOG match, pack contents, model-literal lint, packed-install smoke.
- `scripts/wave-review.test.mjs` (run by `npm test`): three regex tests pin the chained wording in `skills/subagent-driven-development/SKILL.md` - the chain block's shape, the SR `cwd` tree reference, and the retained plain two-fan-out fallback - beside the file's existing snapshot-text tests; rewording the skill updates them.
- `node eval/run.mjs subagent-driven-development`: the six samples (four existing, two new). Sample-local runs while iterating, one full run at the end, cells under `EVAL_CONCURRENCY`; `report.md` committed. Replay runs with tools disabled, so it judges what the parent says it dispatches, not what runs.
- Live fixture run, once per side, bounded: a scratch git repo under `mktemp -d` holding a pre-written `doc/plans/fixture.md` with one wave of 3 tasks, each touching one file (AC row 1's fixture), and a copy where task 2's `**Spec:**` anchor names a requirement its task text omits so SR returns `NEEDS_REWORK` (AC row 2's fixture). Entry per run: a fresh pi session in the scratch repo, `phase_tracker({ action: "start", phase: "implement" })`, `plan_tracker({ action: "init", tasks })`, then `/skill:subagent-driven-development` on the plan; `main` side with `pi install -l` pointing at 27ab87b, candidate side at the branch. Four runs total, each capped at eight minutes, concurrent in isolated scratch sessions where possible. Counts read from the session transcript (parent `subagent` calls per wave) and the telemetry record `.pi/gauntlet/telemetry/doc/plans/fixture.yaml` in the scratch repo (per-persona dispatch counts), plus the `plan_tracker` status sequence. Expected: parity on persona counts and tracker statuses, one fewer parent call per clean wave on the candidate. Wall-clock is not a claim.

## Documentation impact

Materiality bar: `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - the requirements bullet's version token becomes `>=7.4.0` and gains one sentence that a wave's implementers and first spec reviews are one chain call (operations / tunable parameters: the floor an installer must meet); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: none - this change consumes pi-cohort's existing `treePath` contract without altering it; `doc/configuration.md` and `doc/personas.md` do not describe dispatch shape

## Out of scope

- A full implementer -> spec-reviewer -> code-reviewer chain: needs a write-capable integrator child, which the parent-owns-integration rule and the ticket's own out-of-scope line exclude.
- Moving the fix loop into the chain: pi-cohort has no loop step; two mechanisms for one job.
- Sequential mode, its removal, or chaining its per-task pair (sequential implementers commit in place; no `patchPath`).
- Persona frontmatter or body edits; prompt-file edits; pi-cohort runtime or doc changes; extension and bin changes.

## Open questions

- Flip to "stop only on `BLOCKED` / `NEEDS_CONTEXT`, SR reviews `DONE_WITH_CONCERNS` in the chain" if telemetry shows concerns on most waves; decided from later telemetry, not now.
