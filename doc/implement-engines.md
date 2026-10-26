# Implement engines

An implement engine turns an approved spec into a verified implementation. The default waves/task engine uses `writing-plans` and `subagent-driven-development`; the experimental loop engine uses `loop-implementation` and an acceptance-criteria ledger. Both enter the same phase guards and closing gates. See [Loop engine operations](configuration.md#loop-engine-operations) for operator choices and ledger details.

## Admission and phase state

Keep the engine artifact in the resolved plan directory as a file with a path-only `**Spec:**` header containing the repo-relative spec path, optionally backticked. `plan_check({ planPath })` resolves that spec before checking the artifact. In [plan-check.ts](../extensions/lib/plan-check.ts), line 1 exactly `# Ledger - loop engine` selects ledger validation; other input follows task-plan validation. A passing parent tool call stamps both artifact and spec paths and SHA-256 hashes.

The implement-start guard in [phase-tracker.ts](../extensions/phase-tracker.ts) is unchanged: in an armed flow with flow guards enforced, `start implement` requires the stamp, both files to exist, and both hashes to match. Skipping the plan phase does not bypass this guard. The loop driver stamps and commits its skeleton before starting implement. Once implement starts, ledger updates do not require repeated stamping; resume checks the current ledger again.

| Instance | Artifact | Execution |
|---|---|---|
| Waves/task engine | Task plan with waves, tasks, spec citations, scoped tests and verification headers | Task implementers and spec/code reviews, tracked by `plan_tracker` |
| Loop engine | `<resolved plan dir>/<spec stem>-ledger.md` | Fresh `loop-implementer` per seed or row iteration; no task tracker or implement-phase reviewers |

A non-file engine artifact is outside this contract. Supporting an engine whose plan cannot be a hashed file requires a phase-state engine field and corresponding admission changes; that field does not exist.

## Verification and finish

Complete implement only after full project verification passes. In verify, run full verification before whole-diff code review, then happy path when selected and the separate conformance review against the spec and original prompt. Repairs invalidate verification and require a successful rerun before the next gate. The loop reuses its passing exit run only while the verified HEAD and clean worktree still match. Its checklist is spec AC rows against the ledger, not tracker tasks. Follow the conformance continuation and closure schema in [loop-implementation](../skills/loop-implementation/SKILL.md) and [subagent-driven-development](../skills/subagent-driven-development/SKILL.md).

[Finish](../skills/finishing-a-development-branch/SKILL.md) reads a ledger's `verification:` command where a task plan supplies `**Verification:**`. Its hard verification gate precedes every menu option; its documented clean-commit/no-change skip rule is the only exception. Before landing, read the artifact's path-only Spec header for telemetry sealing, enumerate both the basename-paired task plan and sibling `<spec stem>-ledger.md`, and remove each tracked candidate. The spec and sealed telemetry ship in the squash; the engine artifact is stripped. Finish includes `loop: cut row <n>` and `loop: amend` audit bodies in its amendment digest alongside `amend:` commits.

## Resume and amendments

[Resume reconstruction](../skills/gauntlet-resume/reference/reconstruction.md) recognizes a ledger by line 1 and pairs it using its Spec header, not its basename. After human confirmation and entry checks it arms the flow through brainstorm, starts plan, calls `plan_check`, skips plan with a loop-engine resume reason, and starts implement. Findings stop reconstruction without task-plan repair. Restore base, verification, iterations, cap, attempts, funding and retry allowances without resolving loop settings; render cap, rows, counters, allowances and all decisions. Every ledger restore, including verify/ship, applies the [shared cap boundary](../skills/gauntlet-resume/reference/reconstruction.md#spec-with-ledger) before phase continuation; a missing cap takes the driver's legacy grant stop, never a settings-derived cap. The resume skill's implement-with-line-1-ledger route restores ledger cap and iterations/retry data, then continues at `Before each dispatch`; verify/ship continues at `After the loop` step 1. Never initialize the task tracker or overwrite a restored ledger. A loop spec without an artifact enters the loop driver's entry sequence to create one.

[Amendment aftermath](../skills/brainstorming/reference/amendment-surface.md) recognizes the same ledger discriminant. It reconciles approved dispositions without a plan writer, `plan_check`, or task-tracker lifecycle: cut disposed rows with disposition evidence, preserve requirement-preserving rows, and reopen re-bounded done rows with `reopened by amendment`. Preserve counters and commit spec plus ledger together with the amendment audit body. A redraw removes the ledger as it removes a task plan; it always stops for approval.

## Stops, models and telemetry

Preserve branch state on a stop and leave implement active. Use the existing [stop-note contract](../skills/subagent-driven-development/stop-note.md): one screen of plain words naming the concrete failing evidence and decision, with retry, approved amendment, or stop choices. The loop driver additionally enforces row allowances, empty-commit stagnation, a row-scaled durable total iteration cap and the one-commit/clean-tree return boundary. The cap is seeded from non-cut row count times the per-row multiplier plus one seed dispatch, stays fixed across cuts and reopening, and is recomputed only on redraw. A clean cap stop also offers the durable `cap +N` grant; see [Loop engine operations](configuration.md#ledger-and-recovery) for its contract. Never silently cut a row or reopen closed rows after failed exit verification.

Pin an engine worker through `subagents.agentOverrides.<persona>.model`, for example `subagents.agentOverrides.loop-implementer.model`. The loop dispatch omits `model:`; its persona leaves model and thinking unset, so an unset override inherits the parent model. A parent phase-model switch is not worker-model isolation without a pin.

The spec records `**Engine:** loop` or `**Engine:** waves` directly below `**Amend-grant:**`; absent means waves. The telemetry recorder emits `{ kind: "engine", engine: "loop" | "waves" }` on brainstorm completion or skip, including resume. [Telemetry derivation](../extensions/lib/telemetry-record.ts) takes the last engine event, defaulting to waves, and derives iterations from loop-implementer dispatches. `gauntlet-performance` prints both fields; legacy records show waves and empty iterations. The ledger's durable dispatch counter supports recovery; telemetry reports observed persona dispatches.
