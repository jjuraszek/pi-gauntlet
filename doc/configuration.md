# Configuration reference

Deep reference for pi-gauntlet's gates. The [README front door](../README.md#configuring-the-gates) lists every key with its default; the overrides-file headings are at [Project-specific overrides](../README.md#project-specific-overrides).

## Conformance gate model

`conformance-reviewer` ships without a `model:` in its frontmatter — like the spec-council personas, its model is supplied per preset so each profile points the last correctness gate at the strongest reasoning model its providers can reach. The verify-step skills resolve `piGauntlet.closureReview.model` **repo-local first** (a repo's `.pi/settings.json` overrides the preset whole-object - defining `closureReview` there replaces the preset's entire block, so set every leaf you need together) and inject it **call-site** on the conformance dispatch (the same mechanism the spec-council chair uses). Add it to each preset's `settings.json` (or a repo's `.pi/settings.json` to override per repo):

```json
{
  "piGauntlet": {
    "closureReview": { "model": "<provider/model>", "enforce": true, "maxFixRounds": 5 }
  }
}
```

Frontmatter pins `thinking: xhigh` and `defaultContext: fresh` (the gate always runs cold, with max reasoning) and `thinking` is not call-site overridable, so the config supplies only `model`. If `closureReview.model` is unset the dispatch omits `model:` (the `agentOverrides` pin applies, else the main loop); if the configured model is unreachable it retries once with the main loop's own string passed explicitly (see [Dispatch model precedence](#dispatch-model-precedence)).

When `closureReview.model` **is** set, the phase-tracker match-checks call-site injection **inside a brainstorming-entered flow**: a `subagent` dispatch of `conformance-reviewer` that omits `model:` is **blocked at tool-call time** (before it runs) so the gate can never silently degrade to the parent's builder model, and a dispatch whose `model:` **differs** from the configured value gets a non-blocking **warning** appended to the result (drift is surfaced, not blocked). The documented one-retry fallback still works - pass an explicit model and it runs (with a warning if it differs). Outside a brainstorming-entered flow the guard is dormant (an ad-hoc conformance-reviewer dispatch is never blocked); disabling `closureReview.enforce` disables it too.

Independently of `closureReview.model`, inside the same window (brainstorming-entered flow, `verify` in progress, a successful `conformance-reviewer` result observed) a lone top-level `agent: "implementer"` `subagent` dispatch is **blocked** at tool-call time - pi-cohort honours `worktree: true` only in `tasks` mode, so a lone implementer runs unisolated and yields no patch for the loop's integrate step. The reason text names the one-task `tasks` rewrite. `async: true` is not a bypass; management calls (`action: ...`) are skipped. Dormant before the first audit, in `implement` and `ship`, and in flows not entered via `start brainstorm`. Disabled by `closureReview.enforce: false`.

`closureReview.enforce` (default `true`) controls the phase-tracker gate that, inside a brainstorming-entered flow, blocks `complete verify` until the conformance-reviewer has run; set `false` to disable enforcement for a preset. Outside such a flow the gate never arms regardless of this value.

`closureReview.maxFixRounds` (default `5`) caps the conformance **remediation loop**: when a `GAPS` verdict's gaps are dispositioned `fix`, the orchestrator dispatches isolated fix waves and re-audits the delta, up to this many rounds before escalating to the user with the per-gap history. Missing or non-integer -> `5`; `< 0` clamps to `0`; `0` means audit-only: no isolated fix dispatch runs, `recommended: fix` gaps carry to finish as concern inventory, and `fix-now` stays visible but unavailable there. The available concern decisions then follow the canonical availability contract in `verification-before-completion/reference/conformance-check.md` and may include `accept-into-spec`, `rescope-into-spec`, `follow-up`, or a concrete `custom(...)` / manual effect. Inside a brainstorming-entered flow the phase-tracker enforces the cap at tool-call time: once `verify` is in progress and a successful `conformance-reviewer` result has been observed, each non-error `subagent` result carrying an `implementer` child counts as one round, and a further implementer dispatch at the cap is **blocked** with the escalation text, which names the way through: an explicit human approval recorded with `phase_tracker({ action: "grant_fix_rounds", rounds: N, reason: "<their words>" })` funds N more waves (accepted only while the block is live and no earlier grant is unspent; shape guards still apply; `async: true` waves stay blocked), and the last-resort escape `closureReview.enforce: false` in the session cwd's `.pi/settings.json` (applies on the next tool call, no restart; replaces the preset's whole `closureReview` block). `0` therefore blocks the first fix wave. The counter and any granted credits reset with the audit latch (`start implement`, `reset`); `start verify` with `force` keeps both. Disabled by `closureReview.enforce: false`. `/skill:gatekeep-pr` reads the same value through `gauntlet_setting` and initializes independent per-run repair-round and sync caps to `2 x` that value, with no-tool fallback `2 x 5` ([fix-wave round accounting](../skills/gatekeep-pr/reference/fix-wave.md#wave)). Source-changing implementer waves, including source-changing carried-set retries, spend rounds; conflict-only syncs spend the separate sync budget. Description-only work, watches, re-reviews, empty waves, and restored failures spend no round. Usage persists in the temporary continuation record without resetting on refresh or re-entry. `0` omits delivery rows. Obstacle `deliver` adds `2 x` the resolved value to both caps before work, without resetting usage; timeout continuation opens one additional watch window and extends neither cap. An unchanged failed prerequisite still blocks retry. These gatekeep budgets are a skill protocol; the verify-phase runtime guard above remains at `1 x` the resolved value and can block a gatekeep dispatch earlier.

## Spec council

`/skill:roasting-the-spec` runs a multi-model critique of a spec before the brainstorming user-review gate. It is the **critique half** of brainstorming's self-review: when a council is configured in the active preset's `settings.json`, brainstorming **auto-dispatches** it (no prompt); when none is configured, brainstorming runs a single fresh-`worker` critique instead. Each member runs on a different model (divergent critiques), and a neutral chair consolidates and adjudicates. Members and chair return saved-file references only; the main loop runs structural checks without ingesting their findings. A fresh `spec-council-applier` reads the chair report, decides apply/defer/reject, edits only the spec, and returns the audit. The main loop re-reads the spec before the unchanged gate, where you ratify or revert already-applied edits.

```json
{
  "piGauntlet": {
    "specCouncil": {
      "members": ["<provider/model>", "<provider/model>", "<provider/model>"],
      "chair": "<provider/model>"
    }
  }
}
```

- `members` (required) — roster of `provider/model` strings; council size = array length, one critique per model. Empty or absent → the council never runs; brainstorming falls back to a single fresh-`worker` critique (scope + ambiguity, auto-applied).
- `chair` (optional) — model for the consolidating synthesizer; when omitted the dispatch omits `model:` (the `agentOverrides` pin applies, else the main loop).

Rosters resolve **repo-local first**: a repo's `.pi/settings.json` overrides the preset (whole-object — the first file that defines `specCouncil` wins), otherwise each pi profile (`agent`, `agent.anthropic`, `agent.bedrock`, …) reads its own `settings.json`. List only models the resolving config's providers can reach. The member and chair personas (`spec-council-member` and `spec-council-synthesizer`) are model-free; their models resolve from this config or the chair fallback above, and both pin `thinking: xhigh`. The applier has no model or thinking pin and its dispatch supplies neither: both inherit the main loop unless `subagents.agentOverrides['spec-council-applier'].model` or `.thinking` overrides them.

## Escalation loop

When a review fix loop in `subagent-driven-development` reaches its escalate point, one more fix round runs on an explicitly resolved model in a fresh context before the human is stopped. The model is `piGauntlet.escalationLoop.implModel` (`provider/model[:thinking]`); when the block is absent or `implModel` is empty or not a string, the escalated round runs on the **main loop's model and thinking** (suffix always emitted; pi `max` maps to `xhigh`, unset to `off`). Set it only to escalate to a *different* model than the main loop:

```json
{
  "piGauntlet": {
    "escalationLoop": { "implModel": "<provider/model:thinking>" }
  }
}
```

Whole-object precedence applies (repo `.pi/settings.json` replaces the preset block). Skills read it via `gauntlet_setting({ key: "escalationLoop" })`, which returns the already-resolved `implModel`.

### Dispatch model precedence

A `subagent` dispatch carries `model:` only with a string resolved at runtime; skill text never supplies a provider or model name. Three provenances: (1) a `gauntlet_setting` role key - `closureReview.model`, `escalationLoop.implModel`, `specCouncil.members[]`, `specCouncil.chair`; (2) an explicit user instruction naming a model for that dispatch; (3) the main loop's own string, read from `$PI_PROVIDER`/`$PI_MODEL`, used where a skill must bypass a persona's frontmatter `thinking` pin for cost or pass an explicit fallback after a configured model is unreachable ([`doc/personas.md`](personas.md) documents this path). When `model:` is omitted, `subagents.agentOverrides.<agent>.model` applies, else the child inherits the main loop. `writing-plans` dispatches `plan-writer` this way: the persona ships model-free, so `subagents.agentOverrides.plan-writer.model` (and `.thinking`) is the `agentOverrides` knob and the main loop's model is the default - the model active when the plan phase starts, so a `piGauntlet.phaseModels.plan` switch (below) is what the child inherits when the knob is unset. `escalationLoop.implModel` is the exception to omission: it resolves to the main-loop string when unset and is always passed, because omitting it would reuse the implementer pin.

Pin review personas (`code-reviewer`, `spec-reviewer`, `conformance-reviewer`) at least as capable as `implementer`; false negatives in review cost more than the model does.

| Worker | Model pin | Dispatch behavior |
|---|---|---|
| `loop-implementer` | `subagents.agentOverrides.loop-implementer.model` | No dispatch `model:`; unset pin inherits the parent model. Model and thinking are unset in persona frontmatter. |

## Loop engine operations

The default waves engine plans tasks and reviews their implementation. At the brainstorming approval gate, experimental option 4 skips the task plan and iterates fresh workers over acceptance criteria; option 5 uses the same loop with option 2's auto-apply-amend grant. Option 4 uses option 1's amendment review: factual corrections may clear through the reviewer, while other amendments stop for approval. A redraw always stops. Options 4/5 appear for both ticket and drafted AC rows. Ticketless specs and specs whose fetched ticket has no AC get design-derived rows, shown verbatim at the gate and ratified by approval; only a not-fetched ticket leaves the loop unavailable. Changes to approved drafted-row text or membership require a redraw and full ratification; disposition-only changes keep the amendment route. See [Implement engines](implement-engines.md) for the authoring and lifecycle contract.

Every approval writes `**Engine:** loop` for 4/5 or `**Engine:** waves` for 1/2 directly below `**Amend-grant:**`. Option 6 (draft-PR handoff) writes `**Engine:** deferred` with `**Amend-grant:** none` - a 6 never grants - and selects no engine; the later re-gate on `brainstorming #N` replaces `deferred` with `waves` or `loop`, writes the decoded grant, and adds `**PR:** <owner/repo#N>` directly below `**Engine:**` as a new commit `spec: select engine and grant for PR #N` on the published branch, never an amend. Missing Engine means waves. Unfunded option 4 keeps `**Amend-grant:** none`; option 5 stores the auto-apply grant, and funded replies persist their decoded budget token. Every initial, unpublished approval, including plain 1 and 4, runs `git -C <worktree> add -- <spec path>` and `git -C <worktree> commit --amend --no-edit -q`, preserving the council audit body. The driver checks `git -C <worktree> show HEAD:<spec path>` for both selected Engine and valid grant values (and the `**PR:**` line at the re-gate) before continuing. Failure stops the transition. A spec still carrying `**Engine:** deferred` stops [finishing](../skills/finishing-a-development-branch/SKILL.md) and [gauntlet-resume](../skills/gauntlet-resume/SKILL.md) with `spec approved for handoff only - run brainstorming #N`; finishing reads `**PR:**` through [header-linked PR finishing](../skills/finishing-a-development-branch/reference/spec-pr.md). Publication and re-gate rules: [spec-pr.md](../skills/brainstorming/reference/spec-pr.md).

### Setting and command resolution

`piGauntlet.loopEngine.maxIterationsPerRow` is the only active `piGauntlet.loopEngine.*` setting. `gauntlet_setting({ key: "loopEngine" })` returns `maxIterationsPerRow` with any warning. Missing means 4. Integer values are floored at 1 (zero and negative integers become 1); fractional numbers are not rounded. Any non-integer value, including a string, falls back to 4 with `loopEngine.maxIterationsPerRow must be an integer; using default 4`. The removed key `loopEngine.maxIterations` is not an alias: its presence adds `loopEngine.maxIterations is removed; set loopEngine.maxIterationsPerRow`, and its value is ignored. When both warnings apply, they are joined with `; `, removed-key warning first.

Before seeding, the driver resolves verification once and prints `verification command: <command> (<source>)`:

1. Use the overrides `## PR gate` `- verification command:` value when present.
2. Otherwise, a `## verification-before-completion` section must contain exactly one backticked command; zero or several stops as a configuration error.
3. Otherwise discover the test entrypoint from actual project manifests/build instructions. Missing or ambiguous discovery stops, rather than guessing.

The parent runs this full command after all rows close. Workers run only row evidence checks, never the full verification command or suite. A failed exit run stops with output, without reopening rows or automatically rerunning it.

### Ledger and recovery

The artifact is `<resolved plan dir>/<spec stem>-ledger.md` (default `doc/plans/<spec stem>-ledger.md`), not a task plan. It starts with these headers; values below illustrate the grammar and are replaced with actual paths, SHA and command:

```markdown
# Ledger - loop engine
**Spec:** `doc/specs/example.md`
base: <base SHA>
verification: <resolved command>
iterations: 0
cap: 97

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |

## Decisions
```

Compute `cap:` once at entry as the number of rows not initialized `cut` times `maxIterationsPerRow`, plus 1 for the seed dispatch. The example cap of 97 assumes 24 non-cut rows at default 4; an all-cut ledger gets 1 and exits without a seed dispatch. Count every started dispatch, including seed and interrupted dispatches. Later cuts, reopening and requirement-preserving amendments leave the cap fixed; only a redraw deletes the ledger and recomputes it on reseeding.

Line 1 is exact. Spec is a path alone. Rows index every spec AC in order, without copying row text. Explicit/absent `in-scope` and `venue:` start `open`; only `deviates:`, `deferred:`, and `elsewhere:` start `cut`, with disposition evidence. Status vocabulary is `open`, `done`, `failed`, `cut`. Only the parent cuts through approved dispositions. A child marks passing checks `done` and failed checks `failed`.

Seed fills every open row's evidence and closes already-satisfied rows on passing baseline checks, leaving attempts 0. Ordinary attempts increment only the target row's counter; counters never reset. Evidence names the check plus at most three result lines in one cell, separated by semicolons with pipes escaped. No reasoning transcripts, angle markup or placeholders (`TODO`, `TBD`, `probably`, `etc.`) belong there. Empty evidence is valid only on an open row before seed.

Each child appends `row <n> <done|failed> | <what was done> | <what not to redo or try differently>` under Decisions, each sentence at most 200 characters. Seed uses `row 0 done | seeded <k> rows, closed <m> on baseline | <first row to take>`. The parent increments iterations before dispatch; the child's single commit persists it. The parent validates the clean tree, exactly one commit, target-only changes and new bounded decision. Ordinary validation misses get a repair commit; two consecutive misses stop. Seed validation misses stop immediately.

An unresolved row stops at 3 attempts, or 3 + funded N. `; fund N fix rounds` on 4/5 buys N extra attempts per row, never escalated-model rounds, cap extensions, or empty-commit bypasses. Spent funding is `max(0, attempts - 3)` per row. Two consecutive child row commits changing neither non-ledger files nor row status stop independently of funding. Closed rows never trigger stagnation; third-attempt success exits normally. With unresolved rows at `iterations >= cap`, the driver stops before dispatch and verification, naming the cap and every unresolved row with its attempts.

Stop notes quote concrete evidence and the last decision, offer retry with a hint, approved spec amendment, or stop, and keep implement active. Retry appends `row <n> retry | <hint> | allowed attempts <attempts + 1>` and commits `loop: retry row <n>`. It starts a new consecutive-stagnation window but resets neither attempts nor iterations. Dirty-tree or commit-boundary recovery requires human-authorized discard/reset and retains the interrupted dispatch in the count. Funding alone does not reset stagnation.

At a clean cap stop, offer `cap +N` beside retry, amend and stop. Accept only an anchored `cap +<n>` token with a positive integer matching `[1-9][0-9]*` and an end, whitespace or pipe boundary. Append `cap +<n> | <decision>` under `## Decisions`, trimming the optional remainder and optional leading pipe into the decision cell; bare `cap +50` writes `cap +50 |`. Add N to the header cap and commit both changes once as parent `loop: raise cap`, preserving all attempts and iterations, then return to the ordered checks. Invalid tokens such as `cap +0`, `cap +x`, `cap -5` or `cap +50x` ask once; a second invalid reply leaves the same stop with no commit. Grants reset neither stagnation nor validation-miss windows and do not count as child commits. Funding and cap grants are independent; when both allowances are exhausted, offer both but take separate replies. Dirty-tree and commit-boundary stops never offer cap grants; discard authorization comes first.

A legacy ledger missing `cap:` stops with `ledger has no cap: line - seeded under the old loopEngine contract`, even if every row is closed. On a clean tree, `cap +N` writes `cap: <iterations + N>` immediately after `iterations:` with the same decision and commit contract. Never derive a legacy cap from settings.

Amendments reconcile spec and ledger together: approved disposed rows become cut, requirement-preserving changes preserve rows, and a re-bounded done row reopens with `reopened by amendment`. Preserve counters; no plan writer, plan check or task tracker runs for this aftermath. Resume rechecks the ledger through `plan_check` and restores its cap, counters and decisions without resolving loop settings. Every ledger restore, including verify/ship, applies the missing-cap stop before phase continuation and stops on a dirty tree before dispatch. Finish strips the ledger while the spec and telemetry ship.

## Phase models

`piGauntlet.phaseModels` switches the parent session's model and thinking level when a phase starts. Keys: `plan`, `implement`, `verify`, `ship` (no `brainstorm` - the user picks the model the session starts on). Each value is `provider/id` or `provider/id:level`, where `level` is a pi thinking level (`off|minimal|low|medium|high|xhigh|max`); a trailing `:suffix` that is not a level is part of the model id (`ollama/qwen2.5-coder:7b`). A switch is persistent: pi records it in the session, replays it on resume, and nothing reverts it at phase end, so with only `implement` set the verify and ship phases keep the implement model. A phase without a key leaves the active model and thinking level unchanged, including a model the user picked by hand. Without `:level` the thinking level is pi's default for the new model. Whole-object precedence applies (repo `.pi/settings.json` replaces the preset block).

```json
{
  "piGauntlet": {
    "phaseModels": { "implement": "<provider/model:thinking>" }
  }
}
```

Each failure prints one warning in the `phase_tracker` result and leaves the model and thinking level unchanged; the phase still starts: the key is not a non-empty string; the model is not in pi's registry; the `:level` token is not a pi thinking level (only when the id without it resolves); `pi.setModel` returns `false` (no auth for the provider) or throws. A key that names the already-active model with a different level only changes the thinking level; naming the active model and level does nothing. Subagent children never switch.

## Extensions

### `plan-tracker`

A tool, not a hook. Skills call `plan_tracker({ action: "init" | "add" | "update" | "status" | "clear", ... })` to manage a task list; a TUI widget above the editor shows progress. State branches with the session, no config needed. Statuses: `pending ○ / in_progress → / complete ✓ / failed ✗ / skipped ⊘`. `failed` is terminal-negative (ran and did not pass; never counted done); `skipped` is terminal (not applicable in this run; counted done). The widget's `(N/M)` and the `done` counts are `complete + skipped`; neither `failed` nor `skipped` is ever the current task. **Pending-suffix rule:** pending tasks must trail every started or finished task - an `update` that would leave a `pending` task ahead of a non-pending one is rejected (state unchanged, `details.error` set) with a message listing every offending index, the legal fixes (`in_progress`, `complete`, `failed`, `skipped`, or a truthful re-`init`), and the current snapshot. `update` never sets `pending`; `init` and `add` do. `init` accepts task-name strings or `{ name, status }` elements (mixable) to recreate a list with known statuses - a fresh session, an amendment re-init, or repairing a legacy out-of-order snapshot - validated as one snapshot. `add` appends pending tasks at the tail, always valid. Review and whole-diff repairs reopen the owning existing plan-task indices (`in_progress`) instead of creating fix sub-wave entries; conformance remediation uses its durable `G<n>` entries, reusing the exact existing gap before adding a new one. The tool is registered with sequential execution, so same-message tracker calls run in source order and each validates against the previous one; pi serializes the whole tool batch of that message (as it already does for `phase_tracker`). Snapshots persisted by older sessions are not re-validated on replay. No settings key.

### `phase-tracker`

A tool, not a hook. Skills call `phase_tracker({ action: "start" | "complete" | "skip" | "status" | "reset" | "substep" | "grant_fix_rounds", phase?, reason?, substep?, rounds? })` to track workflow phase progress. A TUI widget shows the five-phase pipeline: `○ brainstorm → ○ plan → ○ implement → ○ verify → ○ ship`. State branches with the session, no config needed. Phases are entered **explicitly** by the phase-owning skills, so outside a gauntlet flow the widget stays dormant. The `brainstorming` skill resets both trackers on entry (new flow, clean slate); `/skill:gauntlet-resume` (human-only) is the only other way a flow becomes armed - it re-enters an interrupted flow in a fresh session by replaying `start brainstorm`, `skip` with `resume:` reasons up to the active stage, `plan_check` before implement-or-later (repairing plan citations on FAIL, per `skills/gauntlet-resume/reference/brief-contract.md` "Plan repair"), and `plan_tracker init` for the task list, never a direct later-phase `start`; `implement` auto-completes from `plan-tracker` once a skill has started it and every task is `complete` or `skipped` (`failed` blocks). The `substep` action accepts a free-string label on an `in_progress` phase (widget shows e.g. `brainstorm(gather)`); `substep: null` or omitted clears it. It errors when the target phase is not `in_progress`. Labels clear on `start`, `complete`, `skip`, and `reset`. The explicit callers use `gather` and `plan-write`. The `grant_fix_rounds` action records an explicit human approval of `rounds` more conformance fix rounds (`reason` quotes the human); it is accepted only while the fix-round cap block is live and no earlier grant is unspent, and each qualifying implementer wave then spends one granted round.

**Derived substeps.** Parent-session `subagent` and `plan_check` calls also set the active phase's label while a recognized dispatch runs; child-session calls do not relabel the parent. No in-progress phase means no derived label.

| Observed call | Label |
|---|---|
| `subagent` agent `scout` or `context-builder` | `gather` |
| `subagent` agent with prefix `spec-council-` | `council` |
| `subagent` agent `spec-reviewer` | `spec-review` |
| `subagent` agent `plan-writer` | `plan-write` |
| `plan_check` | `plan-check` |
| `subagent` agent `implementer` | `implement` |
| `subagent` agent `code-reviewer` | `code-review` |
| `subagent` agent `conformance-reviewer` | `conformance` |
| `subagent` dispatch containing both `implementer` and `spec-reviewer` | `implement+sr` |

A dispatch containing both implementer and SR takes precedence and keeps the single static label `implement+sr` for the whole call. Otherwise the first mapped agent in input order supplies the label. Unknown agents and management calls (`subagent` with an `action` field) do not derive labels. Calls blocked by the closure-review guards are neither labeled nor counted. Matching terminal events (`tool_result` or `tool_execution_end`) clear the derived label if it is still the dispatch's label. An executed call returning an error with empty `details` loses its temporary ordinal at completion.

Explicit and derived labels share one field: the last writer wins. An explicit `substep` call can replace or clear a live derived label; terminal cleanup leaves a different explicit label alone. Overlapping dispatches track only the newest call, so an older call's terminal event cannot clear the newer label. Completion never restores a pre-dispatch label or an older dispatch.

**Widget-only ordinals.** `verify(conformance)` marks the first `conformance-reviewer` dispatch; `verify(conformance #2)` marks the second in this `verify` phase. The `#n` suffix counts dispatches of that label within the phase, resets when that phase starts again (or on `reset`), and is not the conformance fix-round budget (`fixRounds`). At the rendering boundary, `phaseLabel(phase, substep, count?)` produces `name(substep)` for an absent count or a count below 2, and `name(substep #count)` otherwise. Only `formatWidget` passes `count = dispatchCounts[phase][substep] ?? 0`. Status text and substep tool-result rendering call `phaseLabel(phase, substep)` without counts; status and the resume brief retain `name(substep)` without a suffix.

Ordinals restart after a reload. Reconstruction starts with empty display counts and no live dispatch, ignores dispatch history for display state, and restores only labels from successful explicit `substep` actions that subsequent clears or phase transitions do not remove. An incidental `status` snapshot cannot persist a derived label; an explicit `gather` or `plan-write` can survive reconstruction.

**Process in primary, work by path.** The pi process stays in the primary checkout - its root or any subdirectory - and the linked `.worktrees/<name>` checkout is addressed by an explicit absolute path: skills pass it as dispatch `cwd`, as `git -C <path>`, or as `(cd "<path>" && <cmd>)`, and the runtime derives the checkout from the artifact it acts on (`git rev-parse --path-format=absolute --show-toplevel --git-dir --git-common-dir`, git >= 2.31). Every guard below is active from every subdirectory of the primary checkout. In a coordinated run the process stays in the home primary; dispatch `cwd` and command paths select each leg's worktree across repositories.

Home overrides and `.pi/settings.json#piGauntlet` govern flow policy (council, closure review, home flow guards, grants, tracker, response channels and finish choice). Each leg's first-found overrides and `.pi/settings.json`, read by file with the existing preset merge rules, govern its creation, teardown, spec/plan directories, rules, verification and PR body style. Repo top-level `piGauntlet` keys replace preset keys wholesale; absent keys fall through, and absent configuration uses defaults. `gauntlet_setting` resolves the session checkout only and is not a companion-settings reader.

| Overrides declaration | Readers | Default | Effect |
|---|---|---|---|
| `## shape-ticket` `- sibling: <clone url>` | shape-ticket (audit), brainstorming (membership), gauntlet-resume, finishing-a-development-branch | single-repo audit and run | audit siblings and eligible run companions; only companions explicitly selected by the ask or ticket join the run |

Discovery and the full headings table are in [Project-specific overrides](../README.md#project-specific-overrides). The [leg contract](../skills/brainstorming/reference/legs.md) records each leg's resolved `contract:` in the home spec's `## Legs`. Those recorded lines govern later stages, including finish and cleanup, for one-member and coordinated specs alike; amend the home block and affected companion file before using a changed contract. Overrides are not reread to replace recorded contracts. A legacy spec without `## Legs` is home-only and retains the finish-time reread.

Distinct from `plan-tracker`: `phase-tracker` answers "what stage of the workflow am I in?"; `plan-tracker` answers "which task within the current stage am I on?"

**Completion backstop.** With `piGauntlet.flowGuards.enforce: true` in a brainstorming-entered flow, explicit completion of `implement` or `verify` reads the latest successful current-branch tracker snapshot. It rejects only recorded `pending` and `in_progress` tasks, reports their zero-based indices, names, and statuses, and leaves the phase unchanged. Reconcile accepted work by updating those same indices and retry completion; do not clear or reinitialize the list. `failed` remains terminal-negative rather than authorization to ship, but does not itself trigger this unfinished-task rejection and follows the existing STOP/escalation path.

This backstop is bookkeeping, not proof that work was done: absent or empty tracker state is unaffected, as are cold/ad-hoc sessions, disabled flow guards, and other phases. A phase reset does not clear tracker history; a successful tracker `clear` or `init` supersedes it. The phase-tracker tool is registered with sequential execution so a tracker update and later phase completion in one model message persist in order. This needs Pi 0.85.1 or later; see the [README requirements](../README.md#requirements).

**Open-task nudge.** Under the same `piGauntlet.flowGuards.enforce` setting, every non-error `subagent` result carrying an `implementer` child while `verify` is in progress is prefixed with the backstop's view of the latest tracker snapshot: each `pending`/`in_progress` row (zero-based index, name, status) and the instruction to close a reopened task with `plan_tracker({ action: "update", index: N, status: "complete" })` once its repair's re-review or re-audit accepts. Advisory only: it never blocks, counts no fix round, and fires on every qualifying wave, before and after the conformance audit. Silent in other phases, in subagent children, without a snapshot, and when the settings read reports errors. A task reopened by a spec amendment during `verify` stays in `verify` and closes this way; phases never move backward.

**`gauntlet_setting` tool.** `phase-tracker` also registers `gauntlet_setting({ key: "specCouncil" | "closureReview" | "escalationLoop" | "flowGuards" })`, a gauntlet-internal tool through which skills resolve merged `piGauntlet.*` settings (repo `.pi/settings.json` over the agent preset, via pi's own `SettingsManager`). Repo settings are read from `<checkout toplevel>/.pi/settings.json` of the session cwd's checkout. It returns the resolved value as a JSON block in the tool result — `specCouncil` yields the council-vs-worker verdict, `closureReview` yields the conformance-gate `model`/`enforce`/`maxFixRounds`, `escalationLoop` yields the resolved escalated-fix `implModel`, and `flowGuards` yields `enforce`, `specDirs`, and the derived `planDirs` (alongside `key` and `errors`). It introduces no new settings key. The tool is registered with sequential execution, so a settings write and a `gauntlet_setting` read batched in one model message run in order and the read sees the write. Every `piGauntlet.*` read — the skills via this tool, both extensions directly — routes through one shared helper (`extensions/lib/gauntlet-settings*.ts`); no code reads `pi.settings` by hand.

**`plan_check` tool.** `plan_check({ planPath })` runs the deterministic plan-vs-spec checks defined in [skills/writing-plans/reference/plan-contract.md](../skills/writing-plans/reference/plan-contract.md); a pass stamps the plan+spec content hashes into flow state. `baseline-line` findings (missing or invalid base-commit test evidence) and `open-questions` findings (substantive rows or malformed content in `## Open Questions`) prevent a stamp. Findings are returned to the caller: the `plan-writer` child repairs baseline evidence by running Baseline, not by authoring results, and returns substantive open questions for the parent to resolve; other failures on the parent's stamping call re-dispatch the child with the findings. Outside a gauntlet flow it acts as a plain linter (no stamp). Paths in the plan (`**Spec:**`, `Modify:`, `Test:`) resolve against the toplevel of the checkout that contains the plan file, so a worktree plan verifies from any session cwd; a plan outside a git checkout fails with an `input` finding.

**Closure-review gate.** Inside a brainstorming-entered flow, `complete verify` is rejected unless a successful `conformance-reviewer` dispatch (a `subagent` result whose `results[]` contains the exact `agent: "conformance-reviewer"`, `exitCode: 0`, and `interrupted !== true`) has been observed since the last `reset`. A flow entered via any path other than a `start brainstorm` (e.g. a bare `start verify`) leaves the gate dormant, so ad-hoc verify tracking is never blocked. Management calls (`action: "list"` etc.) and async dispatches never qualify. Qualification is per child: a mixed batch or errored chain can still credit an earlier qualifying reviewer, but an explicitly interrupted reviewer never earns completion credit. An absent or false interruption flag preserves legacy success behavior. Live results and branch replay use the same predicate. A user waiver is recorded via `skip` with a reason - there is no `force` bypass on `complete`. Disable per preset with `settings.json#piGauntlet.closureReview.enforce: false` (default: enforced).

Completion exclusions do not change attempted-work accounting: interrupted implementer waves still spend fix rounds and granted credits under the existing rules, review nudges still reflect attempted work, and telemetry still counts dispatches and usage. Empty management results earn no completion credit. Gate windows, resets, grants, disabled behavior, and partial-council handling are unchanged. Pi-cohort's zero-exit paused cleanup diagnostics do not imply completed work; explicit resume starts a new child from its stored session, not the old OS process.

**Flow guards.** Eight guards, on by default, active **only inside a brainstorming-entered flow**. The first six are disabled per preset with `settings.json#piGauntlet.flowGuards.enforce: false`; the two fix-loop guards ride `piGauntlet.closureReview.enforce: false` instead. Outside such a flow (no `start brainstorm` observed) all eight stay dormant:

- **Worktree discipline (blocks).** During `brainstorm`/`plan`/`implement`, an in-place `git switch` / `git checkout -b`/`-B` is blocked — the bash call does not run. The block evaluates the command's target checkout - its `-C <path>` or leading `cd <path>`, else the session cwd - and fires only when that target is the primary checkout; `git -C <worktree> switch -c x` passes, `git -C <primary> switch` blocks from anywhere, an unresolvable target passes. `git worktree ...` and plain `git checkout <file>` never trip it. Override via `piGauntlet.flowGuards.enforce: false`.
- **Spec-phase confinement (advisory).** During `brainstorm`, a `write`/`edit` (or a bash mutation: `>`/`>>`/`tee`/`sed -i`/`git apply`) outside the spec dir warns that brainstorming may only touch the spec. Spec dirs come from `flowGuards.specDirs` (default `["doc/specs", "docs/specs"]`). Redirects to scratch paths (`/tmp`, `/var/folders`, `/dev`) are exempt. Warns once per brainstorm.

  `flowGuards.specDirs` is the spec-dir contract for every consumer: phase confinement, telemetry spec/plan classification, the seal's ship-diff plan exclusion, and `gauntlet-spec-index` collection; each spec dir's sibling `plans` dir is the plan dir.
- **Marker commit guard (brainstorm phase).** A `git commit` (including `git -C <path> commit` and `cd <path> && git commit` forms) is **blocked** while any file under `flowGuards.specDirs` still begins with the context-draft marker line (`# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing`). Line-1 match only — specs quoting the marker in the body do not trigger it. Skipped entirely when `piGauntlet.flowGuards.enforce` is `false`.
- **Implement-write advisory (warn-once).** A parent `write`/`edit` outside `flowGuards.specDirs` (and each spec dir's sibling `plans` dir) while `implement` is in progress — or after `plan` completes but before `implement` starts — warns once that implement-phase code is written by subagents (`/skill:subagent-driven-development`). Advisory, never blocks: merge-conflict resolution between parallel waves may proceed past it. Subagent children (`PI_SUBAGENT_DEPTH` >= 1) never trip it.
- **Review-cadence reminder (advisory).** A parent-session `git commit` while `implement` is in progress warns when an `implementer` dispatch completed more recently than both the last `spec-reviewer` and the last `code-reviewer` dispatch. Completed cadence requires an exact agent name (`implementer`, `spec-reviewer`, or `code-reviewer`), `exitCode: 0`, and `interrupted !== true`. Credit is per child, including qualifying earlier children in an errored chain or mixed batch; explicitly interrupted implementers and reviewers earn no completion credit. Live results and branch replay share this rule, including existing tie ordering. Presence-only (no verdict or ordering check); never blocks; honors `flowGuards.enforce`. Subagent children never trip it.
- **Plan-check gate (blocks).** Inside a gauntlet flow, phase_tracker start implement is rejected unless a passing plan_check stamp exists and both the plan and spec files still match their stamped content hashes (re-run plan_check after any edit). Block-only — no warn rung; disabled by `piGauntlet.flowGuards.enforce: false`.
- **Fix-loop dispatch shape (blocks).** While `verify` is in progress and a successful `conformance-reviewer` result has been observed, a `subagent` call with top-level `agent: "implementer"` is blocked; the reason names the one-task `tasks` rewrite. Governed by `piGauntlet.closureReview.enforce`, not `flowGuards.enforce`.
- **Fix-round cap (blocks).** Same window: each non-error `subagent` result containing an `implementer` child counts one round; a further dispatch containing an implementer (tasks, chain, or parallel) is blocked once the count reaches `closureReview.maxFixRounds` (default `5`; `0` blocks the first wave). Counted at result time, so a blocked call never spends a round. The block text names the way through: an explicit human approval recorded with `phase_tracker({ action: "grant_fix_rounds", rounds: N, reason })` funds N more waves (shape guards still apply; `async: true` waves stay blocked). It also names the last-resort escape - `closureReview.enforce: false` in the session cwd's `.pi/settings.json`, applied on the next tool call without a restart, replacing the preset's whole `closureReview` block. Rounds and granted credits reset with the audit latch on `start implement` and `reset`. Governed by `piGauntlet.closureReview.enforce`.
- **Foreground execution policy.** Gauntlet orchestration dispatches execution children with `async: false`, waiting for their terminal result before task or phase acceptance. This does not serialize independent implementation, spec-review, or council fan-outs: those remain parallel batches. `forceTopLevelAsync` in pi-cohort is incompatible with this policy; see [pi-cohort dispatch configuration](https://github.com/jjuraszek/pi-cohort/blob/main/doc/configuration.md). A child that detached from the foreground run remains incomplete work for the existing coordination path, and the policy does not lock user input.

### `verify-before-ship`

A hook on statement-start anchored `git merge --squash`, `git push`, and `gh pr create` commands; `git -C <path>` is accepted. Local commits are not ship events; commit-time review-cadence advisories come from the phase-tracker flow guard. If you haven't run a passing test command since your last source-file write in this session, an advisory warning is injected into the tool result. The warning clears automatically after a passing test run.

Default test-command regex matches: `make ci`, `make test`, `npm test`, `pnpm test`, `yarn test`, `pytest`, `rspec`, `cargo test`, `go test`.

Override in `.pi/settings.json`:

```json
{
  "piGauntlet": {
    "verifyBeforeShip": {
      "testCommands": ["make ci", "bundle exec rspec"],
      "warningReference": "doc/testing.md"
    }
  }
}
```

`testCommands` entries are regex fragments (anchored with `\b` automatically). `warningReference` is a doc path appended to the warning text — useful for pointing engineers at your testing conventions.

### `telemetry`

A recorder, not a tool. Inside a gauntlet flow it writes one YAML record per spec path at the toplevel of the checkout containing the spec (a worktree spec lands under the worktree even when pi runs in the primary), under `<dir>/<spec path with .md replaced by .yaml>` (default `.pi/gauntlet/telemetry/doc/specs/<spec>.yaml`, or `.pi/gauntlet/telemetry/docs/specs/<spec>.yaml` - the record mirrors the spec path). The recorder never stages or commits: the record is an untracked file, hidden from `git status` through one `<dir>/` line the recorder appends to `<git-common-dir>/info/exclude` at bind, until `finishing-a-development-branch` seals it. Only the parent session writes (children with `PI_SUBAGENT_DEPTH` >= 1 no-op); child usage arrives through the parent's `subagent` results.

The record is `schema: 1`: header (`spec`, `run_id`, `branch`, `status: in_progress | shipped | abandoned`, `created_at`, `approved_at`, `shipped_at`, `abandoned_at`, `supersedes`, `fixes`, `versions`, `author`, `agent_overrides`, `sessions`), then `derived:` (per-phase timing/model/thinking/tokens/compactions/peak context/user messages, per-phase `parent_calls` - one `[cache_read, cache_write, cache_write_1h]` triplet per parent assistant call, stored outside the capped event list; `cache_write_1h` is a subset of `cache_write` and is never summed into tokens, per-persona dispatches and tokens, reviewer findings (`blocker/major/minor` counts; a code-reviewer report's `[Critical]/[Moderate]` tags count as `blocker`/`major`, `[Minor]` as `minor`), council chair and per-member finding counts (`total`, `unique`, `applied`, `unique_applied`, `deferred`, `rejected` by blocker/major/minor, with `dispatches`; chair `model`, `dispatches`, `clusters`, `members_reported`), `conformance_loops` and the most recent `conformance_open_gaps` count, gate counters, plan totals, last test command, amendments, diff buckets and `modified_files` at seal), then `accumulators:` and `events:` (opaque receipts; events capped at 300). `conformance_open_gaps` is `0` for a `CONFORMS` verdict, counts distinct `G<n>:` blocks otherwise, and is omitted until a conformance result is observed. Consumers read `derived:` only; the `gauntlet-performance` big-call share divides the >50k calls' `cache_write` by the `cache_write` of every parent call (child usage reaches the phase `tokens` sums through subagent results but is excluded from `parent_calls` and from that denominator). `derived.council` is written only when every `raised-by` slug in the chair report and audit resolves to a member dispatch that exited 0 with a saved output file and the two carry the same multiset of (severity, raisers); empty clusters with an all-`none` audit are complete. Anything partial writes nothing, so an absent block means no council data, never zero; its chair and member rows serialize as YAML flow maps. Chair clusters are parsed from the inline result or, when absent there, from its `savedOutputPath`; an unreadable or malformed file leaves council data absent. Council dispositions are read from the applier result, audit lines of any `git ... commit` bash command while brainstorm is in progress (brainstorming prescribes a quoted-heredoc `git commit -q -F -` so each audit line starts a line), or assistant text carrying a complete audit; the first complete parsed audit wins. A commit whose audit is not in the command text, such as `-F <file>`, records nothing from the command. These sources preserve the same completeness, member-provenance, and schema rules. Unavailable data is omitted, never `null`. The `gauntlet-performance` report groups council findings by roster and flags `low_unique_applied` below 0.2 unique-and-applied blocker/major per run and `high_rejection` when rejected share exceeds 0.5 while another member is below 0.25; both flags require at least 5 runs per roster. `abandoned_at` and `status: abandoned` are no longer produced; old records carrying them still parse. `spec_edits_after_ship` is no longer produced; the field remains declared and old records still parse.

For coordinated runs, the home record also carries `legs:`, a list of companion `{ repo, sha }` or `{ repo, pr }` delivery results. Each entry requires a repo and a SHA or PR URL. Companion repositories receive no telemetry record; delivery receipts are separate home-owned recovery artifacts, not telemetry.

Arming and binding: the recorder derives the flow-entry marker from `phase_tracker` results with the same rule as phase-tracker (`start brainstorm` arms, `reset` disarms), live and on every session start/switch/fork/tree replay. While disarmed it records nothing - a spec written outside the gauntlet gets no record, and a hand-run `plan_check` is a lint. While armed and unbound, the first of these binds: a successful `write`/`edit` to a direct-child `.md` of a resolved spec dir, a passing `plan_check`, a plan-file read or write whose `**Spec:**` header names a spec, or a `phase_tracker skip brainstorm` with reason `resume: <spec path>` (gauntlet-resume's reconstruction). A `reset` unbinds and discards everything buffered since the previous run. A spec rename at spec-writing moves the record. A record that is already sealed on disk (`status` not `in_progress`) leaves the recorder unbound and eligible for another spec.

Seal: the shipped `gauntlet-telemetry-seal` bin stamps `status: shipped`, `shipped_at`, a `ship` event with the landing option, computes `modified_files` and diff buckets against the base (`git rev-list --count --invert-grep --grep='^telemetry: '` for the commit count), re-runs `derive` so `duration_s` and `gates.ship_option` are consistent at the seal time, and commits the record once as `telemetry: <spec>` (on git; jj snapshots it instead):

```
node <package>/bin/gauntlet-telemetry-seal.mjs --worktree <abs path> --option <pr|squash> --base <ref> [--spec <repo-relative spec path>] [--dir <telemetry dir>] [--leg <repo>=<sha|pr-url>]...
```

Repeat `--leg` once per companion after all companion deliveries succeed, before home delivery. Missing repo or result is refused as `invalid --leg <value>` with exit 1. A retry reuses an existing seal only when its `legs:` set matches the supplied companion results; mismatch exits 1 with `seal legs differ: stored ...; supplied ...`. A seal failure preserves delivery receipts and stops home delivery. Single-member runs omit `--leg`. The [coordinated finish contract](../skills/finishing-a-development-branch/reference/legs.md) defines ordered delivery and receipt validation.

The verify-before-ship advisory resolves each command target checkout's `piGauntlet.verifyBeforeShip` and tracks passing-test credit per checkout. A source edit invalidates only that checkout's credit; home's passing tests do not credit a companion.

It reads `piGauntlet.telemetry` from the same two layers as the recorder (preset `$PI_CODING_AGENT_DIR/settings.json`, default `~/.pi/agent`, under `<toplevel>/.pi/settings.json`; `--dir` overrides and is validated by the same resolver). With `--spec` the candidate is that record; without it, the records under `<dir>` whose `spec:` is a path changed in `<base>...HEAD` (on jj: in the fork-point diff to `@`). Per record it prints `sealed <path>` or `already sealed <path>` (shipped, tracked, clean). Bare outcomes: `no telemetry run`, `telemetry disabled`. Exit 2 with `no record at <path>` or `unparseable record <path>: <reason>`; exit 1 with usage, `not a git or jj checkout`, `no base ref <ref>`, or `seal failed <path>: <reason>` after restoring the pre-seal bytes. The seal stages with `git add -f`, so a gitignored telemetry dir behaves identically. In a plain jj workspace (no `.git`) the seal resolves the root through `jj root`, computes the same jj diff as the extension (`modified_files` and diff against the remote trunk or a local `main`/`master` bookmark, revisions touching only the telemetry directory not counted), validates `--base` as a jj revset, and replaces the commit with `jj file track --include-ignored` on the record: that snapshots the stamped record into the working-copy change, gitignored dir included, so a gitignored telemetry dir behaves identically there too. The jj-named warnings are `diff omitted: jj mainline unresolved (trunk() is root(); no main/master bookmark)`, `diff omitted: jj <subcommand> failed: <first stderr line>`, `diff omitted: jj diff unparseable`, or `diff omitted: jj log --count unparseable: <output>`. `phase_tracker complete ship` still seals in place for the extension's own Keep As-Is path.

Guard: during `brainstorm`, a `write` to a spec whose record has `shipped_at` is blocked (`edit` passes) with a reason naming the record and asking for a new date-slugged spec that supersedes it. Specs shipped before the extension existed have no record and are unguarded.

Call site: `finishing-a-development-branch` runs the seal on the feature branch after the plan strip and before the Option 1/2 `git push` or the Option 3 `git merge --squash`; a nonzero exit stops the landing. Keep As-Is leaves the record untracked and `in_progress`; Discard removes it with the worktree. `gatekeep-pr` never reads, checks, or stamps the record.

Example override (the `buckets` shown replace the defaults):

```json
{
  "piGauntlet": {
    "telemetry": {
      "enabled": true,
      "dir": ".pi/gauntlet/telemetry",
      "buckets": { "test": ["**/test/**", "**/*.test.*"], "docs": ["**/*.md"], "config": ["**/*.json", "**/*.yaml"] }
    }
  }
}
```

`enabled: false` turns every handler off (no file, no exclude line, no guard). `dir` is relative to the git toplevel. `buckets` is an ordered `{ name: [globs] }` object matched with `path.matchesGlob` against repo-relative paths; defaults are `test` = `**/test/**`, `**/tests/**`, `**/__tests__/**`, `**/*.test.*`, `**/*.spec.*`, `**/*_test.*`; `docs` = `**/*.md`; `config` = `**/*.json`, `**/*.yaml`, `**/*.yml`, `**/*.toml`, `**/*.lock`, `**/*-lock.*`; anything else `code`; first match wins. Read through the shared `gauntlet-settings` resolver (`resolveTelemetry`).

## Extensions summary

| Extension | Configurable | Settings key |
|---|---|---|
| `plan-tracker.ts` | No | - |
| `phase-tracker.ts` | Yes | `settings.json#piGauntlet.closureReview` (keys: `enforce`, `model`, `maxFixRounds`); `settings.json#piGauntlet.flowGuards` (keys: `enforce`, `specDirs`); `settings.json#piGauntlet.specCouncil` (keys: `members`, `chair`); `settings.json#piGauntlet.escalationLoop` (keys: `implModel`); `settings.json#piGauntlet.phaseModels` (keys: `plan`, `implement`, `verify`, `ship`) |
| `verify-before-ship.ts` | Yes | `settings.json#piGauntlet.verifyBeforeShip` (keys: `testCommands`, `warningReference`) |
| `telemetry.ts` | Yes | `settings.json#piGauntlet.telemetry` (keys: `enabled`, `dir`, `buckets`) |
