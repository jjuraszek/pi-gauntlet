# Configuration reference

Deep reference for pi-gauntlet's gates. See the [README](../README.md) for the workflow overview.

## Conformance gate model

`conformance-reviewer` ships without a `model:` in its frontmatter — like the spec-council personas, its model is supplied per preset so each profile points the last correctness gate at the strongest reasoning model its providers can reach. The verify-step skills resolve `piGauntlet.closureReview.model` **repo-local first** (a repo's `.pi/settings.json` overrides the preset whole-object - defining `closureReview` there replaces the preset's entire block, so set every leaf you need together) and inject it **call-site** on the conformance dispatch (the same mechanism the spec-council chair uses). Add it to each preset's `settings.json` (or a repo's `.pi/settings.json` to override per repo):

```json
{
  "piGauntlet": {
    "closureReview": { "model": "<provider/model>", "enforce": true, "maxFixRounds": 2 }
  }
}
```

Frontmatter pins `thinking: xhigh` and `defaultContext: fresh` (the gate always runs cold, with max reasoning) and `thinking` is not call-site overridable, so the config supplies only `model`. If `closureReview.model` is unset the dispatch omits `model:` and the gate inherits the parent's model; if the configured model is unreachable it retries once inherited.

When `closureReview.model` **is** set, the phase-tracker match-checks call-site injection: a `subagent` dispatch of `conformance-reviewer` that omits `model:` is **blocked at tool-call time** (before it runs) so the gate can never silently degrade to the parent's builder model, and a dispatch whose `model:` **differs** from the configured value gets a non-blocking **warning** appended to the result (drift is surfaced, not blocked). The documented one-retry fallback still works - pass an explicit model and it runs (with a warning if it differs). Disabling `closureReview.enforce` disables this guard too.

`closureReview.enforce` (default `true`) controls the phase-tracker gate that blocks `complete verify` until the conformance-reviewer has run; set `false` to disable enforcement for a preset.

`closureReview.maxFixRounds` (default `2`) caps the conformance **remediation loop**: when a `GAPS` verdict's gaps are dispositioned `fix`, the orchestrator dispatches isolated fix waves and re-audits the delta, up to this many rounds before escalating to the user with the per-gap history. Missing or non-integer -> `2`; `< 0` clamps to `0`; `0` disables fix dispatch (the gap menu offers accept / rescope only). Enforced by the protocol prose in `verification-before-completion/reference/conformance-check.md`, not by the phase-tracker extension.

## Spec council

`/skill:roasting-the-spec` runs a multi-model critique of a spec before the brainstorming user-review gate. It is the **critique half** of brainstorming's self-review: when a council is configured in the active preset's `settings.json`, brainstorming **auto-dispatches** it (no prompt); when none is configured, brainstorming runs a single fresh-`worker` critique instead. Each member runs on a different model (divergent critiques), a neutral chair consolidates and adjudicates, and you approve what gets applied.

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
- `chair` (optional) — model for the consolidating synthesizer; defaults to the inherited model when omitted.

Rosters resolve **repo-local first**: a repo's `.pi/settings.json` overrides the preset (whole-object — the first file that defines `specCouncil` wins), otherwise each pi profile (`agent`, `agent.anthropic`, `agent.bedrock`, …) reads its own `settings.json`. List only models the resolving config's providers can reach. The two personas it dispatches — `spec-council-member` and `spec-council-synthesizer` — are model-free; their model is injected per task from this config.

## Extensions

### `plan-tracker`

A tool, not a hook. Skills call `plan_tracker({ action: "init" | "update" | "status" | "clear", ... })` to manage a task list; a TUI widget above the editor shows progress (✓/→/○). State branches with the session, no config needed.

### `phase-tracker`

A tool, not a hook. Skills call `phase_tracker({ action: "start" | "complete" | "skip" | "status" | "reset", phase?, reason? })` to track workflow phase progress. A TUI widget shows the five-phase pipeline: `○ brainstorm → ○ plan → ○ implement → ○ verify → ○ ship`. State branches with the session, no config needed. Phases are entered **explicitly** by the phase-owning skills, so outside a gauntlet flow the widget stays dormant. The `brainstorming` skill resets both trackers on entry (new flow, clean slate); `implement` auto-completes from `plan-tracker` once a skill has started it.

Distinct from `plan-tracker`: `phase-tracker` answers "what stage of the workflow am I in?"; `plan-tracker` answers "which task within the current stage am I on?"

**`gauntlet_setting` tool.** `phase-tracker` also registers `gauntlet_setting({ key: "specCouncil" | "closureReview" })`, a gauntlet-internal tool through which skills resolve merged `piGauntlet.*` settings (repo `.pi/settings.json` over the agent preset, via pi's own `SettingsManager`). It returns the resolved value as a JSON block in the tool result — `specCouncil` yields the council-vs-worker verdict, `closureReview` yields the conformance-gate `model`/`enforce`/`maxFixRounds`. It introduces no new settings key. Every `piGauntlet.*` read — the skills via this tool, both extensions directly — routes through one shared helper (`extensions/lib/gauntlet-settings*.ts`); no code reads `pi.settings` by hand.

**Closure-review gate.** `complete verify` is rejected unless a successful `conformance-reviewer` dispatch (a `subagent` result whose `results[]` contains `agent: "conformance-reviewer"` with `exitCode: 0`) has been observed since the last `reset`. Management calls (`action: "list"` etc.) and async dispatches never qualify. A user waiver is recorded via `skip` with a reason — there is no `force` bypass on `complete`. Disable per preset with `settings.json#piGauntlet.closureReview.enforce: false` (default: enforced).

**Flow guards.** Two guards, on by default, disabled per preset with `settings.json#piGauntlet.flowGuards.enforce: false`:

- **Worktree discipline (blocks).** During `brainstorm`/`plan`/`implement`, an in-place `git switch` / `git checkout -b`/`-B` is blocked — the bash call does not run. Active **only when pi was launched in the primary checkout** (not a linked worktree); `git worktree ...` and plain `git checkout <file>` never trip it. Override via `piGauntlet.flowGuards.enforce: false`.
- **Spec-phase confinement (advisory).** During `brainstorm`, a `write`/`edit` (or a bash mutation: `>`/`>>`/`tee`/`sed -i`/`git apply`) outside the spec dir warns that brainstorming may only touch the spec. Spec dirs come from `flowGuards.specDirs` (default `["doc/specs"]`). Redirects to scratch paths (`/tmp`, `/var/folders`, `/dev`) are exempt. Warns once per brainstorm.

### `verify-before-ship`

A hook on `git commit` / `git push` / `gh pr create`. If you haven't run a passing test command since your last source-file write in this session, an advisory warning is injected into the tool result. The warning clears automatically after a passing test run.

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

## Extensions summary

| Extension | Configurable | Settings key |
| --- | --- | --- |
| `plan-tracker.ts` | No | — |
| `phase-tracker.ts` | Yes | `settings.json#piGauntlet.closureReview` (keys: `enforce`, `model`, `maxFixRounds`); `settings.json#piGauntlet.flowGuards` (keys: `enforce`, `specDirs`); `settings.json#piGauntlet.specCouncil` (keys: `members`, `chair`) |
| `verify-before-ship.ts` | Yes | `settings.json#piGauntlet.verifyBeforeShip` (keys: `testCommands`, `warningReference`) |
