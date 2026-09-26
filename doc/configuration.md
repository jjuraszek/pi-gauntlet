# Configuration reference

Deep reference for pi-gauntlet's gates. See the [README](../README.md) for the workflow overview.

## Conformance gate model

`conformance-reviewer` ships without a `model:` in its frontmatter — like the spec-council personas, its model is supplied per preset so each profile points the last correctness gate at the strongest reasoning model its providers can reach. The verify-step skills resolve `piGauntlet.closureReview.model` **repo-local first** (a repo's `.pi/settings.json` overrides the preset whole-object - defining `closureReview` there replaces the preset's entire block, so set every leaf you need together) and inject it **call-site** on the conformance dispatch (the same mechanism the spec-council chair uses). Add it to each preset's `settings.json` (or a repo's `.pi/settings.json` to override per repo):

```json
{
  "piGauntlet": {
    "closureReview": { "model": "<provider/model>", "enforce": true, "maxFixRounds": 3 }
  }
}
```

Frontmatter pins `thinking: xhigh` and `defaultContext: fresh` (the gate always runs cold, with max reasoning) and `thinking` is not call-site overridable, so the config supplies only `model`. If `closureReview.model` is unset the dispatch omits `model:` (the `agentOverrides` pin applies, else the main loop); if the configured model is unreachable it retries once with the main loop's own string passed explicitly (see [Dispatch model precedence](#dispatch-model-precedence)).

When `closureReview.model` **is** set, the phase-tracker match-checks call-site injection **inside a brainstorming-entered flow**: a `subagent` dispatch of `conformance-reviewer` that omits `model:` is **blocked at tool-call time** (before it runs) so the gate can never silently degrade to the parent's builder model, and a dispatch whose `model:` **differs** from the configured value gets a non-blocking **warning** appended to the result (drift is surfaced, not blocked). The documented one-retry fallback still works - pass an explicit model and it runs (with a warning if it differs). Outside a brainstorming-entered flow the guard is dormant (an ad-hoc conformance-reviewer dispatch is never blocked); disabling `closureReview.enforce` disables it too.

Independently of `closureReview.model`, inside the same window (brainstorming-entered flow, `verify` in progress, a successful `conformance-reviewer` result observed) a lone top-level `agent: "implementer"` `subagent` dispatch is **blocked** at tool-call time - pi-cohort honours `worktree: true` only in `tasks` mode, so a lone implementer runs unisolated and yields no patch for the loop's integrate step. The reason text names the one-task `tasks` rewrite. `async: true` is not a bypass; management calls (`action: ...`) are skipped. Dormant before the first audit, in `implement` and `ship`, and in flows not entered via `start brainstorm`. Disabled by `closureReview.enforce: false`.

`closureReview.enforce` (default `true`) controls the phase-tracker gate that, inside a brainstorming-entered flow, blocks `complete verify` until the conformance-reviewer has run; set `false` to disable enforcement for a preset. Outside such a flow the gate never arms regardless of this value.

`closureReview.maxFixRounds` (default `3`) caps the conformance **remediation loop**: when a `GAPS` verdict's gaps are dispositioned `fix`, the orchestrator dispatches isolated fix waves and re-audits the delta, up to this many rounds before escalating to the user with the per-gap history. Missing or non-integer -> `3`; `< 0` clamps to `0`; `0` means audit-only: no isolated fix dispatch runs, `recommended: fix` gaps carry to finish as concern inventory, and `fix-now` stays visible but unavailable there. The available concern decisions then follow the canonical availability contract in `verification-before-completion/reference/conformance-check.md` and may include `accept-into-spec`, `rescope-into-spec`, `follow-up`, or a concrete `custom(...)` / manual effect. Inside a brainstorming-entered flow the phase-tracker enforces the cap at tool-call time: once `verify` is in progress and a successful `conformance-reviewer` result has been observed, each non-error `subagent` result carrying an `implementer` child counts as one round, and a further implementer dispatch at the cap is **blocked** with the escalation text, which names the way through: an explicit human approval recorded with `phase_tracker({ action: "grant_fix_rounds", rounds: N, reason: "<their words>" })` funds N more waves (accepted only while the block is live and no earlier grant is unspent; shape guards still apply; `async: true` waves stay blocked), and the last-resort escape `closureReview.enforce: false` in the session cwd's `.pi/settings.json` (applies on the next tool call, no restart; replaces the preset's whole `closureReview` block). `0` therefore blocks the first fix wave. The counter and any granted credits reset with the audit latch (`start implement`, `reset`); `start verify` with `force` keeps both. Disabled by `closureReview.enforce: false`.

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
- `chair` (optional) — model for the consolidating synthesizer; when omitted the dispatch omits `model:` (the `agentOverrides` pin applies, else the main loop).

Rosters resolve **repo-local first**: a repo's `.pi/settings.json` overrides the preset (whole-object — the first file that defines `specCouncil` wins), otherwise each pi profile (`agent`, `agent.anthropic`, `agent.bedrock`, …) reads its own `settings.json`. List only models the resolving config's providers can reach. The two personas it dispatches — `spec-council-member` and `spec-council-synthesizer` — are model-free; their model is injected per task from this config.

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

A `subagent` dispatch carries `model:` only with a string resolved at runtime; skill text never supplies a provider or model name. Three provenances: (1) a `gauntlet_setting` role key - `closureReview.model`, `escalationLoop.implModel`, `specCouncil.members[]`, `specCouncil.chair`; (2) an explicit user instruction naming a model for that dispatch; (3) the main loop's own string, read from `$PI_PROVIDER`/`$PI_MODEL`, used where a skill must bypass a persona's frontmatter `thinking` pin for cost or pass an explicit fallback after a configured model is unreachable ([`doc/personas.md`](personas.md) documents this path). When `model:` is omitted, `subagents.agentOverrides.<agent>.model` applies, else the child inherits the main loop. `escalationLoop.implModel` is the exception to omission: it resolves to the main-loop string when unset and is always passed, because omitting it would reuse the implementer pin.

Pin review personas (`code-reviewer`, `spec-reviewer`, `conformance-reviewer`) at least as capable as `implementer`; false negatives in review cost more than the model does.

## Extensions

### `plan-tracker`

A tool, not a hook. Skills call `plan_tracker({ action: "init" | "add" | "update" | "status" | "clear", ... })` to manage a task list; a TUI widget above the editor shows progress. State branches with the session, no config needed. Statuses: `pending ○ / in_progress → / complete ✓ / failed ✗ / skipped ⊘`. `failed` is terminal-negative (ran and did not pass; never counted done); `skipped` is terminal (not applicable in this run; counted done). The widget's `(N/M)` and the `done` counts are `complete + skipped`; neither `failed` nor `skipped` is ever the current task. **Pending-suffix rule:** pending tasks must trail every started or finished task - an `update` that would leave a `pending` task ahead of a non-pending one is rejected (state unchanged, `details.error` set) with a message listing every offending index, the legal fixes (`in_progress`, `complete`, `failed`, `skipped`, or a truthful re-`init`), and the current snapshot. `update` never sets `pending`; `init` and `add` do. `init` accepts task-name strings or `{ name, status }` elements (mixable) to recreate a list with known statuses - a fresh session, an amendment re-init, or repairing a legacy out-of-order snapshot - validated as one snapshot. `add` appends pending tasks at the tail, always valid. Review and whole-diff repairs reopen the owning existing plan-task indices (`in_progress`) instead of creating fix sub-wave entries; conformance remediation uses its durable `G<n>` entries, reusing the exact existing gap before adding a new one. The tool is registered with sequential execution, so same-message tracker calls run in source order and each validates against the previous one; pi serializes the whole tool batch of that message (as it already does for `phase_tracker`). Snapshots persisted by older sessions are not re-validated on replay. No settings key.

### `phase-tracker`

A tool, not a hook. Skills call `phase_tracker({ action: "start" | "complete" | "skip" | "status" | "reset" | "substep" | "grant_fix_rounds", phase?, reason?, substep?, rounds? })` to track workflow phase progress. A TUI widget shows the five-phase pipeline: `○ brainstorm → ○ plan → ○ implement → ○ verify → ○ ship`. State branches with the session, no config needed. Phases are entered **explicitly** by the phase-owning skills, so outside a gauntlet flow the widget stays dormant. The `brainstorming` skill resets both trackers on entry (new flow, clean slate); `/skill:gauntlet-resume` (human-only) is the only other way a flow becomes armed - it re-enters an interrupted flow in a fresh session by replaying `start brainstorm`, `skip` with `resume:` reasons up to the active stage, `plan_check` before implement-or-later, and `plan_tracker init` for the task list, never a direct later-phase `start`; `implement` auto-completes from `plan-tracker` once a skill has started it and every task is `complete` or `skipped` (`failed` blocks). The `substep` action sets a substep label on an `in_progress` phase (widget shows e.g. `brainstorm(gather)`); `substep: null` or omitted clears it. Cleared automatically by `complete`, `skip`, and `reset`. Errors when the target phase is not `in_progress`. Used by the brainstorming gather step. The `grant_fix_rounds` action records an explicit human approval of `rounds` more conformance fix rounds (`reason` quotes the human); it is accepted only while the fix-round cap block is live and no earlier grant is unspent, and each qualifying implementer wave then spends one granted round.

**Process in primary, work by path.** The pi process stays in the primary checkout - its root or any subdirectory - and the linked `.worktrees/<name>` checkout is addressed by an explicit absolute path: skills pass it as dispatch `cwd`, as `git -C <path>`, or as `(cd "<path>" && <cmd>)`, and the runtime derives the checkout from the artifact it acts on (`git rev-parse --path-format=absolute --show-toplevel --git-dir --git-common-dir`, git >= 2.31). Every guard below is active from every subdirectory of the primary checkout.

Distinct from `plan-tracker`: `phase-tracker` answers "what stage of the workflow am I in?"; `plan-tracker` answers "which task within the current stage am I on?"

**Completion backstop.** With `piGauntlet.flowGuards.enforce: true` in a brainstorming-entered flow, explicit completion of `implement` or `verify` reads the latest successful current-branch tracker snapshot. It rejects only recorded `pending` and `in_progress` tasks, reports their zero-based indices, names, and statuses, and leaves the phase unchanged. Reconcile accepted work by updating those same indices and retry completion; do not clear or reinitialize the list. `failed` remains terminal-negative rather than authorization to ship, but does not itself trigger this unfinished-task rejection and follows the existing STOP/escalation path.

This backstop is bookkeeping, not proof that work was done: absent or empty tracker state is unaffected, as are cold/ad-hoc sessions, disabled flow guards, and other phases. A phase reset does not clear tracker history; a successful tracker `clear` or `init` supersedes it. The phase-tracker tool is registered with sequential execution so a tracker update and later phase completion in one model message persist in order. This needs Pi 0.85.1 or later; see the [README requirements](../README.md#requirements).

**`gauntlet_setting` tool.** `phase-tracker` also registers `gauntlet_setting({ key: "specCouncil" | "closureReview" | "escalationLoop" })`, a gauntlet-internal tool through which skills resolve merged `piGauntlet.*` settings (repo `.pi/settings.json` over the agent preset, via pi's own `SettingsManager`). Repo settings are read from `<checkout toplevel>/.pi/settings.json` of the session cwd's checkout. It returns the resolved value as a JSON block in the tool result — `specCouncil` yields the council-vs-worker verdict, `closureReview` yields the conformance-gate `model`/`enforce`/`maxFixRounds`, `escalationLoop` yields the resolved escalated-fix `implModel`. It introduces no new settings key. The tool is registered with sequential execution, so a settings write and a `gauntlet_setting` read batched in one model message run in order and the read sees the write. Every `piGauntlet.*` read — the skills via this tool, both extensions directly — routes through one shared helper (`extensions/lib/gauntlet-settings*.ts`); no code reads `pi.settings` by hand.

**`plan_check` tool.** `plan_check({ planPath })` runs the deterministic plan-vs-spec checks defined in [skills/writing-plans/reference/plan-contract.md](../skills/writing-plans/reference/plan-contract.md); a pass stamps the plan+spec content hashes into flow state; findings are returned for the main loop to fix autonomously. Outside a gauntlet flow it acts as a plain linter (no stamp). Paths in the plan (`**Spec:**`, `Modify:`, `Test:`) resolve against the toplevel of the checkout that contains the plan file, so a worktree plan verifies from any session cwd; a plan outside a git checkout fails with an `input` finding.

**Closure-review gate.** Inside a brainstorming-entered flow, `complete verify` is rejected unless a successful `conformance-reviewer` dispatch (a `subagent` result whose `results[]` contains `agent: "conformance-reviewer"` with `exitCode: 0`) has been observed since the last `reset`. A flow entered via any path other than a `start brainstorm` (e.g. a bare `start verify`) leaves the gate dormant, so ad-hoc verify tracking is never blocked. Management calls (`action: "list"` etc.) and async dispatches never qualify. A user waiver is recorded via `skip` with a reason — there is no `force` bypass on `complete`. Disable per preset with `settings.json#piGauntlet.closureReview.enforce: false` (default: enforced).

**Flow guards.** Eight guards, on by default, active **only inside a brainstorming-entered flow**. The first six are disabled per preset with `settings.json#piGauntlet.flowGuards.enforce: false`; the two fix-loop guards ride `piGauntlet.closureReview.enforce: false` instead. Outside such a flow (no `start brainstorm` observed) all eight stay dormant:

- **Worktree discipline (blocks).** During `brainstorm`/`plan`/`implement`, an in-place `git switch` / `git checkout -b`/`-B` is blocked — the bash call does not run. The block evaluates the command's target checkout - its `-C <path>` or leading `cd <path>`, else the session cwd - and fires only when that target is the primary checkout; `git -C <worktree> switch -c x` passes, `git -C <primary> switch` blocks from anywhere, an unresolvable target passes. `git worktree ...` and plain `git checkout <file>` never trip it. Override via `piGauntlet.flowGuards.enforce: false`.
- **Spec-phase confinement (advisory).** During `brainstorm`, a `write`/`edit` (or a bash mutation: `>`/`>>`/`tee`/`sed -i`/`git apply`) outside the spec dir warns that brainstorming may only touch the spec. Spec dirs come from `flowGuards.specDirs` (default `["doc/specs"]`). Redirects to scratch paths (`/tmp`, `/var/folders`, `/dev`) are exempt. Warns once per brainstorm.
- **Marker commit guard (brainstorm phase).** A `git commit` (including `git -C <path> commit` and `cd <path> && git commit` forms) is **blocked** while any file under `flowGuards.specDirs` still begins with the context-draft marker line (`# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing`). Line-1 match only — specs quoting the marker in the body do not trigger it. Skipped entirely when `piGauntlet.flowGuards.enforce` is `false`.
- **Implement-write advisory (warn-once).** A parent `write`/`edit` outside `flowGuards.specDirs` (and each spec dir's sibling `plans` dir) while `implement` is in progress — or after `plan` completes but before `implement` starts — warns once that implement-phase code is written by subagents (`/skill:subagent-driven-development`). Advisory, never blocks: merge-conflict resolution between parallel waves may proceed past it. Subagent children (`PI_SUBAGENT_DEPTH` >= 1) never trip it.
- **Review-cadence reminder (advisory).** A parent-session `git commit` while `implement` is in progress warns when an `implementer` dispatch completed more recently than both the last `spec-reviewer` and the last `code-reviewer` dispatch. Presence-only (no verdict or ordering check); never blocks; honors `flowGuards.enforce`. Subagent children never trip it.
- **Plan-check gate (blocks).** Inside a gauntlet flow, phase_tracker start implement is rejected unless a passing plan_check stamp exists and both the plan and spec files still match their stamped content hashes (re-run plan_check after any edit). Block-only — no warn rung; disabled by `piGauntlet.flowGuards.enforce: false`.
- **Fix-loop dispatch shape (blocks).** While `verify` is in progress and a successful `conformance-reviewer` result has been observed, a `subagent` call with top-level `agent: "implementer"` is blocked; the reason names the one-task `tasks` rewrite. Governed by `piGauntlet.closureReview.enforce`, not `flowGuards.enforce`.
- **Fix-round cap (blocks).** Same window: each non-error `subagent` result containing an `implementer` child counts one round; a further dispatch containing an implementer (tasks, chain, or parallel) is blocked once the count reaches `closureReview.maxFixRounds` (default `3`; `0` blocks the first wave). Counted at result time, so a blocked call never spends a round. The block text names the way through: an explicit human approval recorded with `phase_tracker({ action: "grant_fix_rounds", rounds: N, reason })` funds N more waves (shape guards still apply; `async: true` waves stay blocked). It also names the last-resort escape - `closureReview.enforce: false` in the session cwd's `.pi/settings.json`, applied on the next tool call without a restart, replacing the preset's whole `closureReview` block. Rounds and granted credits reset with the audit latch on `start implement` and `reset`. Governed by `piGauntlet.closureReview.enforce`.
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

A recorder, not a tool. Inside a gauntlet flow it writes one YAML record per spec path at the toplevel of the checkout containing the spec (a worktree spec lands under the worktree even when pi runs in the primary), under `<dir>/<spec path with .md replaced by .yaml>` (default `.pi/gauntlet/telemetry/doc/specs/<spec>.yaml`). The recorder never stages or commits: the record is an untracked file, hidden from `git status` through one `<dir>/` line the recorder appends to `<git-common-dir>/info/exclude` at bind, until `finishing-a-development-branch` seals it. Only the parent session writes (children with `PI_SUBAGENT_DEPTH` >= 1 no-op); child usage arrives through the parent's `subagent` results.

The record is `schema: 1`: header (`spec`, `run_id`, `branch`, `status: in_progress | shipped | abandoned`, `created_at`, `approved_at`, `shipped_at`, `abandoned_at`, `supersedes`, `fixes`, `versions`, `author`, `agent_overrides`, `sessions`), then `derived:` (per-phase timing/model/thinking/tokens/compactions/peak context/user messages, per-persona dispatches and tokens, reviewer findings, `conformance_loops` and the most recent `conformance_open_gaps` count, gate counters, plan totals, last test command, amendments, diff buckets and `modified_files` at seal), then `accumulators:` and `events:` (opaque receipts; events capped at 300). `conformance_open_gaps` is `0` for a `CONFORMS` verdict, counts distinct `G<n>:` blocks otherwise, and is omitted until a conformance result is observed. Consumers read `derived:` only. Unavailable data is omitted, never `null`. `abandoned_at` and `status: abandoned` are no longer produced; old records carrying them still parse. `spec_edits_after_ship` is no longer produced; the field remains declared and old records still parse.

Arming and binding: the recorder derives the flow-entry marker from `phase_tracker` results with the same rule as phase-tracker (`start brainstorm` arms, `reset` disarms), live and on every session start/switch/fork/tree replay. While disarmed it records nothing - a spec written outside the gauntlet gets no record, and a hand-run `plan_check` is a lint. While armed and unbound, the first of these binds: a successful `write`/`edit` to `**/doc/specs/*.md`, a passing `plan_check`, a plan-file read or write whose `**Spec:**` header names a spec, or a `phase_tracker skip brainstorm` with reason `resume: <spec path>` (gauntlet-resume's reconstruction). A `reset` unbinds and discards everything buffered since the previous run. A spec rename at spec-writing moves the record. A record that is already sealed on disk (`status` not `in_progress`) leaves the recorder unbound and eligible for another spec.

Seal: the shipped `gauntlet-telemetry-seal` bin stamps `status: shipped`, `shipped_at`, a `ship` event with the landing option, computes `modified_files` and diff buckets against the base (`git rev-list --count --invert-grep --grep='^telemetry: '` for the commit count), re-runs `derive` so `duration_s` and `gates.ship_option` are consistent at the seal time, and commits the record once as `telemetry: <spec>`:

```
node <package>/bin/gauntlet-telemetry-seal.mjs --worktree <abs path> --option <pr|squash> --base <ref> [--spec <repo-relative spec path>] [--dir <telemetry dir>]
```

It reads `piGauntlet.telemetry` from the same two layers as the recorder (preset `$PI_CODING_AGENT_DIR/settings.json`, default `~/.pi/agent`, under `<toplevel>/.pi/settings.json`; `--dir` overrides and is validated by the same resolver). With `--spec` the candidate is that record; without it, the existing records of `doc/specs/*.md` files changed in `<base>...HEAD`. Per record it prints `sealed <path>` or `already sealed <path>` (shipped, tracked, clean). Bare outcomes: `no telemetry run`, `telemetry disabled`. Exit 2 with `no record at <path>` or `unparseable record <path>: <reason>`; exit 1 with usage, `not a git checkout`, `no base ref <ref>`, or `seal failed <path>: <reason>` after restoring the pre-seal bytes. The seal stages with `git add -f`, so a gitignored telemetry dir behaves identically. In a plain jj workspace (no `.git`) finishing does not run; there `phase_tracker complete ship` seals in place through jj (`modified_files` and diff against the remote trunk or a local `main`/`master` bookmark, revisions touching only the telemetry directory not counted), with the jj-named warnings `diff omitted: jj mainline unresolved (trunk() is root(); no main/master bookmark)`, `diff omitted: jj <subcommand> failed: <first stderr line>`, `diff omitted: jj diff unparseable`, or `diff omitted: jj log --count unparseable: <output>`.

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
| `phase-tracker.ts` | Yes | `settings.json#piGauntlet.closureReview` (keys: `enforce`, `model`, `maxFixRounds`); `settings.json#piGauntlet.flowGuards` (keys: `enforce`, `specDirs`); `settings.json#piGauntlet.specCouncil` (keys: `members`, `chair`); `settings.json#piGauntlet.escalationLoop` (keys: `implModel`) |
| `verify-before-ship.ts` | Yes | `settings.json#piGauntlet.verifyBeforeShip` (keys: `testCommands`, `warningReference`) |
| `telemetry.ts` | Yes | `settings.json#piGauntlet.telemetry` (keys: `enabled`, `dir`, `buckets`) |
