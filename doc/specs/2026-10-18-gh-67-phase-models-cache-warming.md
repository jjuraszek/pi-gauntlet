# Phase models and cache-warming warning (#67)

**Goal:** Let `settings.json#piGauntlet.phaseModels` switch the parent's model and thinking level at a phase's start, persistently; warn at implement start when the active model declares no `promptCache` lifetime; record each parent call's cache usage in telemetry so `gauntlet-performance` shows how many parent calls rewrote the whole context.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** #67. Follow-ups split out by the ticket owner and out of scope here: #69 (plan written in a fresh child), #70 (wave as one chain, blocked on pi-cohort#23).
**Predecessor:** `doc/specs/2026-09-26-council-telemetry-roster-assessment.md` owns the `foldAccumulators`/digest shape that this spec extends with a new optional field; no section of it is replaced, so it carries no supersession banner.

## Problem

In the cleanup-menu run recorded on the ticket, 24 of 265 parent calls wrote more than 50k cache tokens and together held 91% of the run's 5.81M cache-write tokens; 14 of those were in the implement phase, where the parent only dispatches children and matches verdicts. Seven followed gaps longer than the 5-minute cache lifetime and five followed prune edits. Two levers exist and neither is reachable from gauntlet today: the parent runs the same expensive model from brainstorm through ship although no creative parent work remains after plan approval, and pi's cache warmer (`cacheWarming`, default `streaming`) only warms models whose catalog entry declares a `promptCache` lifetime - the parent models in that run declared none, so no warming happened and nothing told the user why. Telemetry sums tokens per phase and cannot say how many calls were full rewrites, so the effect of any fix is invisible without reading session logs.

Framing: kept. Pi already owns both mechanisms - `pi.setModel` / `pi.setThinkingLevel` for the switch and `promptCache` in `models.json` for warming - so this change is a settings key, one transition hook, one warning, and one per-call array. The ticket's `ctx.setModel` was corrected to `pi.setModel` (`@earendil-works/pi-coding-agent/dist/core/extensions/types.d.ts:1298`) during brainstorming and the ticket was repaired to match.

Switch semantics (user decision, ticket repaired to match): a switch is persistent. Pi's `setModel` sets the session model, appends a `model_change` entry replayed on resume, and never reverts (`dist/core/agent-session.js:1978-1995`); every switch opens a new prompt-cache namespace, so reverting at phase end would pay a full-context rewrite twice more per run. An unset phase key leaves whatever is active - configured earlier or chosen by hand - in place.

## Acceptance criteria

Ticket #67, `Acceptance Criteria`, rows verbatim:

- [ ] With `piGauntlet.phaseModels.implement` set to a `provider/id:level` string and the session started on a different model and thinking level, starting the implement phase switches both: the implement-phase telemetry record shows the configured model, the brainstorm and plan records show the original, and pi's active thinking level after the transition is the configured one.
  in-scope
- [ ] With `piGauntlet.phaseModels` unset, every phase's telemetry record shows the session model (today's behavior). A phase without its own key leaves the active model and thinking level unchanged, including a selection the user made by hand; a configured key applies at that phase's start and is not reverted at phase end: with only `implement` set, the verify and ship records show the implement model and the thinking level stays the implement one.
  in-scope
- [ ] A configured phase string whose model cannot be resolved, whose `:level` token is not a pi thinking level, or whose provider has no auth (`pi.setModel` returns false), produces one warning line at the transition and leaves the session model and thinking level unchanged.
  in-scope
- [ ] At implement start, after any phase-model switch, when the active model declares no `promptCache` lifetime, the phase tracker prints one warning naming the model and the `promptCache` key; when it declares one, nothing is printed.
  in-scope
- [ ] `doc/configuration.md` documents `piGauntlet.phaseModels` (keys, unset behavior) and the `promptCache` requirement with the two places it can be declared.
  in-scope
- [ ] The telemetry recorder stores per parent call `cacheWrite`, `cacheRead`, and `cacheWrite1h`, and `gauntlet-performance` prints per run the count of parent calls whose cache write exceeded 50k tokens and their share of the run's cache-write tokens (baseline for the cleanup-menu run: 24 calls, 91%), so later runs can be compared without reading session logs.
  in-scope
- [ ] A matched before/after measurement on one fixture spec in this repo, run twice with the same spec - once with the parent model's catalog entry declaring no `promptCache` lifetime, once declaring one, `cacheWarming` at its default both times - is tabulated in the PR from the two telemetry records: implement-phase count of >50k cache-write calls, `cache_write / peak_context`, implement minutes, dispatch count. The after-run has fewer >50k calls, and the run contains at least one dispatch longer than the declared lifetime. If `cacheWrite1h` is still 0 on every call at measurement time, the PR states so and the measurement uses the 5-minute lifetime.
  deferred: #67 follow-up comment (measured in a later session; this session's model already declares a `promptCache` lifetime, so it is not a valid "before" run)

Design clauses that fix the reading of a row:

- Row 6, "stores per parent call": each phase's accumulator keeps a `parent_calls` array with one `[cache_read, cache_write, cache_write_1h]` triplet per parent assistant message, stored outside the capped event list (`EVENT_CAP = 300`, `extensions/lib/telemetry-record.ts:37`; the baseline run had 265 parent calls). "Per run" count and share are computed over every phase's parent calls, `unphased` included, with a parent-only denominator - child usage reaches the phase `tokens` sums through `onSubagentResults` and is excluded here.
- Row 7, "one fixture spec in this repo": the fixture is this spec. "Before" is this gauntlet run's own implement phase; "after" is a second implement run of the same approved plan in a scratch worktree branched from the plan commit, with a `promptCache` lifetime declared for the implement model and nothing else changed. The protocol is in Tests. The before run's telemetry record was written by the recorder that predates this change, so it has no `parent_calls`; its >50k count and share come from this session's log (assistant-message `usage.cacheWrite`, the ticket's own method) through a scratch script, and the PR says so - see Open questions.

## Design

### Settings (`extensions/lib/gauntlet-settings.ts`)

`PiGauntlet` gains `phaseModels?: { plan?: unknown; implement?: unknown; verify?: unknown; ship?: unknown }`. There is no `brainstorm` key: the user picks the model the session starts on.

`resolvePhaseModels(g): { phaseModels: Partial<Record<"plan"|"implement"|"verify"|"ship", string>>; warning: string | undefined }` sits beside `resolveEscalationLoop` and applies the same non-empty-string check as `implModel` (`nonEmptyString`, trimmed); unlike `implModel`, which falls back silently, a present key that fails the check is dropped and named in the `warning`, joined with `joinWarn` like the other warning-bearing resolvers (`piGauntlet.phaseModels.verify must be a "provider/id" or "provider/id:level" string`). The resolver does not parse or validate the string further - the one real check happens at the transition, where the registry is in hand. `mergeGauntlet` keeps its whole-object merge: a repo `phaseModels` replaces the preset block, like every other key (`doc/configuration.md` already states this rule).

The value grammar is the repo's existing `provider/id` or `provider/id:level` string, the inverse of what `mainLoopModel` emits (`gauntlet-settings.ts:107-115`), split inline at the use site with pi's own rule (`dist/core/model-resolver.js` `splitThinkingSuffix`): `provider` is the text before the first `/`; the text after the last `:` is the `level` only when it is one of pi's seven `ThinkingLevel` values (`off|minimal|low|medium|high|xhigh|max`, `@earendil-works/pi-agent-core/dist/types.d.ts:300`); otherwise the whole remainder after the first `/` is the `id` - so `ollama/qwen2.5-coder:7b` is a model id, not a bad level. No helper module.

### Switch (`extensions/phase-tracker.ts`, `phase_tracker` `start`)

`start` loads settings with `loadGauntletSettings(ctx.cwd)` the way the implement flow-guard check already does, and appends the resolver `warning`, when it names the phase being started, to the result text. Then, when `phaseModels[params.phase]` is set and `isSubagentChild` is false, the switch branch runs before `phases = { ...phases, [phase]: in_progress }`. Every exit below leaves only the switch branch: the phase starts regardless, and the active model and thinking level stay as they were.

1. Split the string. `ctx.modelRegistry.find(provider, id)` undefined -> when the string ends in a `:suffix` that is not a level and `find(provider, id-without-that-suffix)` resolves, the warning is `phaseModels.<phase>: ":<suffix>" is not a pi thinking level (off|minimal|low|medium|high|xhigh|max)`; otherwise `phaseModels.<phase>: model <provider/id> not found in the registry`. Exit.
2. Target model equals `ctx.model` (same provider and id): level absent or equal to the current thinking level -> nothing, no line; level differs -> `pi.setThinkingLevel(level)` only, result line `thinking: <old> -> <new>`. `pi.setModel` is never called for the active model - it would append a `model_change` session entry and emit `model_select` for no change (`agent-session.js:1984-1995`). This rule also makes a re-`start` on resume or `force` a no-op.
3. Otherwise `await pi.setModel(model)` inside `try/catch`: `false` or a throw (the extension wrapper returns `false` only on `hasConfiguredAuth`; the session method still throws `No API key for ...` when `checkAuth` fails, `agent-session.js:1979-1981`, `:2776-2781`) -> warning `phaseModels.<phase>: cannot switch to <provider/id> - <"no auth configured for <provider>" or the error's first line>`. Exit.
4. `true` and a level present -> `pi.setThinkingLevel(level)`; absent -> the thinking level is whatever pi set for the new model. Result line `model: <old provider/id:level> -> <new provider/id:level>`.

Warnings and the `model:`/`thinking:` line are appended to the `start` result `content`, where `SHIP_ADVISORY` already lands for `complete`. `addGuardWarning` is not used: its `tool_result` drain covers only `subagent`, `bash`, `write`, and `edit` (`phase-tracker.ts:738-773`), so a warning stashed inside `phase_tracker`'s own `execute` would never print. Subagent children never switch: the parent owns its model and children replay phase state only.

The telemetry `tool_result` handler that records the phase `start` event reads `lastCtx.model` after `execute` returns (`extensions/telemetry.ts:434-466`), so the switch is already what the implement record shows; no telemetry change is needed for rows 1-2. Pi's `model_select` event (`source: "set"`) still produces the existing `config_change` telemetry event.

### Cache warning (`start implement` only)

After the switch branch (taken or not), read the active `ctx.model.promptCache`. The tier that matters is `long` when `PI_CACHE_RETENTION=long`, else `short`. When `promptCache` is undefined or lacks that tier, append one warning to the same result text:

`<provider/id> declares no promptCache.<tier> lifetime, so pi's cache warmer skips it. Declare it in <agent-dir>/models.json (default ~/.pi/agent): providers.<provider>.modelOverrides.<id>.promptCache for a built-in model, or providers.<provider>.models[].promptCache for a custom one; the lifetime is required by the warmer but not sufficient - see doc/configuration.md#phase-models.`

The key paths follow pi's `ProviderConfigSchema` (`dist/core/model-config.js`, `models` array and `modelOverrides` record under `providers.<provider>`, keyed by model id). When the tier is declared, nothing. Once per implement `start`.

### Telemetry

- `PhaseAcc` (`telemetry-record.ts:51`) gains optional `parent_calls?: [number, number, number][]` - `[cache_read, cache_write, cache_write_1h]` per parent assistant message with usage, appended in the `message_end` handler (`telemetry.ts:769-776`, already parent-only; child usage arrives through `onSubagentResults`) under the current phase key, `unphased` included. `cache_write_1h` is `usage.cacheWrite1h ?? 0`. `foldAccumulators` concatenates the arrays (`x ?? []` then `y ?? []`); `derive` carries them into `Derived.phases`.
- `Tokens` and `usageToTokens` are unchanged; `cacheWrite1h` is a subset of `cacheWrite` (`pi-ai/dist/types.d.ts:284-285`) and must not enter any sum.
- No cap on `parent_calls`: about 20 bytes per call, 5KB for the baseline run against records of 18-32KB today.
- `schema` stays `1`: the field is optional and absent on old records.

### `gauntlet-performance` (`src/bins/`)

`performance/shared.mjs` `TOKEN_KEYS` is unchanged (it is summed into the `tokens` cell; adding the 1h subset would double-count). `BIG_CACHE_WRITE = 50_000` lives in `shared.mjs`. `gauntlet-performance.mjs` `loadRecord` flattens `parent_calls` across all phases: `big_calls` = count with `cache_write > BIG_CACHE_WRITE`, `big_write_share` = sum of those calls' `cache_write` / sum of every parent call's `cache_write` (null when the denominator is 0 or `parent_calls` is absent everywhere). `runs.mjs` renders one added column `big` as `<big_calls>/<share%>` for the run; `--json` rows also carry the same two numbers per phase (`phases.implement.big_calls`, for row 7). Absent data renders `-` through the existing `dash()` convention. `npm run build:bins` regenerates `bin/gauntlet-performance.mjs`; CI's freshness check enforces the commit.

### Data flow

`settings.json` -> `resolvePhaseModels` (string check) -> `phase_tracker start` (split, registry lookup, `pi.setModel`, `pi.setThinkingLevel`, warnings in the result text) -> pi session (`model_change` persisted) -> telemetry `message_end` (`parent_calls` triplets) -> `gauntlet-performance` (count and share). No new extension, event, bin, or schema version.

## Errors and edge cases

| Case | Behavior |
|---|---|
| key present but not a non-empty string | resolver drops the key; the warning names the phase and prints on that phase's `start` result; other keys unaffected |
| no `/` in the string, or model not in registry | one warning, no switch |
| `:suffix` not a level and the id without it resolves | one "not a pi thinking level" warning, no switch |
| `:suffix` not a level and the full id resolves (`qwen2.5-coder:7b`) | ordinary switch, no level change |
| `pi.setModel` returns `false` or throws | one warning naming the cause, model and level unchanged, phase starts |
| target equals active model, level absent or equal | no call, no line |
| target equals active model, level differs | `setThinkingLevel` only, `thinking:` line |
| `:level` omitted on a real switch | model switched; thinking level is pi's choice for the new model |
| level unsupported by the new model (`xhigh` on a model capped at `high`) | pi clamps; no warning - pi's clamp is the contract |
| subagent child (`isSubagentChild`) | never switches, never warns |
| `phase_tracker skip` | applies no key |
| re-`start` of a phase (handoff resume, `force`) | key re-applied; the equal-target rule makes it a no-op when already active |
| implement model lacks `promptCache` for the active tier | one warning at implement start, including when no switch happened |
| `message_end` usage lacks `cacheWrite1h` | stored as 0 |
| old `schema: 1` record | `parent_calls` absent; `gauntlet-performance` prints `-` |

## Tests

TDD, all under `npm test` (`scripts/ci.mjs`):

- `extensions/lib/gauntlet-settings.test.ts`: `phaseModels` absent -> empty, no warning; a non-string key -> dropped, warning names it, siblings kept; whole-object merge replaces the preset block.
- `extensions/phase-tracker.test.ts` (stub `pi` with `setModel`/`setThinkingLevel` spies, stub `ctx.modelRegistry.find`, `tempCwd(settings)`): key set -> `setModel` then `setThinkingLevel` in that order, result text carries the `model:` line, phase is `in_progress`; unknown model, bad level, `setModel` false, `setModel` throw -> the warning is in the `execute` result text, `setThinkingLevel` not called, phase still `in_progress`; colon-id form (`provider/a:b` with `find(provider, "a:b")` resolving) -> switch, no warning; target equals active, level differs -> `setThinkingLevel` only; equal both -> neither called; child env -> neither called; resolver warning for the started phase -> in the result text; `ctx.model.promptCache` missing / lacking the `PI_CACHE_RETENTION` tier -> warning present; declared -> absent; the cache warning fires only on `start implement`.
- `extensions/lib/telemetry-record.test.ts`: `foldAccumulators` concatenates `parent_calls`; `derive` exposes them; a record without the field round-trips unchanged.
- `extensions/telemetry.test.ts`: two parent `message_end` events (one with `cacheWrite1h`, one without) plus one child result in the same phase -> `parent_calls` has two triplets, the child is absent from it, phase `tokens` still include the child.
- `bin/gauntlet-performance.test.mjs`: a fixture with `parent_calls` in two phases (one big call in each) renders `big` as the run-level count and share with a parent-only denominator and exposes per-phase counts under `--json`; the existing fixtures render `-`; `tokens` of a record with a non-zero `cache_write_1h` equals the old sum.
- Row 7 protocol (experiment, not a unit test; the "after" run happens after the plan is approved and the implementation has landed in this worktree). The PR tabulates both runs with: implement-phase >50k count and share, `cache_write / peak_context`, implement minutes, dispatch count; plus, for each run, the implement model and thinking level, `peak_context` at implement start, the checkout the run executed (this worktree at the plan commit for before; a scratch worktree branched from the same plan commit for after), and the exact `models.json` delta (the after run adds only the `promptCache` tier for that model string; the PR quotes the before run's catalog entry showing the tier absent). Before the after run, preflight the implement model against pi's other warmer gates (`dist/core/cache-warmer.js`: replayable request - an `anthropic-messages` model with thinking on needs `compat.forceAdaptiveThinking`; cost rates present; expected savings at or above $0.05) and record the warmer's status from `/session` after the run, with the longest dispatch's duration against the declared lifetime. If warming did not run, or the >50k count did not drop, the PR reports row 7 as failed with the recorded cause; the acceptance criterion is not relaxed. The before run's per-call columns come from the session log as stated in the row-7 design clause.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` - new `## Phase models` section after `## Escalation loop` (keys, grammar incl. colon ids, persistence, unset behavior, the warning cases, the `promptCache` requirement with a minimal `models.json` example for both declaration places and lifetime units in seconds, and the warmer's other gates: `cacheWarming` default, replayable request, cost rates, $0.05 threshold; operations / tunable parameters), `### telemetry` gains `parent_calls` and its parent-only denominator (operations), the Extensions summary row for `phase-tracker` gains `phaseModels`; `README.md` - `phaseModels.*` rows in the settings table under `#configuring-the-gates` (operations); `CHANGELOG.md` - deferred: release
- Derived / memory docs invalidated: none

Materiality per `reference/documentation-impact.md`. `AGENTS.md` is not amended: its Package rules already route every new key to `doc/configuration.md`. The scout's `Docs touched` candidate (`doc/configuration.md` `### phase-tracker` / `### telemetry`) is admitted under the operations category.

## Out of scope

- Writing the plan in a fresh child (#69) and running a wave as one chain (#70, blocked on pi-cohort#23): the ticket owner split them out. This spec changes nothing about what enters the parent's context.
- Phase-bounded switching (restore at phase end): rejected for the reasons in Problem.
- Validating `provider/id:level` strings at resolver time beyond the non-empty check; making the 50k threshold or the warning text configurable; a `gauntlet_setting` key for `phaseModels` (no skill reads it).
- Why `cacheWrite1h` is 0 under `PI_CACHE_RETENTION=long`: a pi/launcher question, outside this repo; row 7 carries the fallback.
- A per-call telemetry event (rejected: `EVENT_CAP`); `parent_calls` is a plain array on the phase accumulator instead.
- Reconstructing `parent_calls` into the before run's committed telemetry record from the session log: the numbers go into the PR table with their provenance, not into the record.

## Open questions

- Row 7 says the table comes "from the two telemetry records"; the before record predates the recorder change and cannot hold `parent_calls`, so its >50k count and share come from this session's log (stated in the PR). The user confirms this reading at the gate, or asks the cut question for row 7.
- Whether a `promptCache` lifetime on the implement model actually yields non-zero `cacheWrite1h` is what row 7's "after" run measures; the spec assumes nothing about it.
