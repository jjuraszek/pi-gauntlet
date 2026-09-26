# Run telemetry recorder (#33)

> **Superseded by:** [doc/specs/2026-09-17-gh-37-worktree-by-path.md](./2026-09-17-gh-37-worktree-by-path.md) - session-toplevel binding and record commit checkout only
> **Superseded by:** [doc/specs/2026-09-24-gh-51-jj-telemetry-diff.md](./2026-09-24-gh-51-jj-telemetry-diff.md) - `### Diff (computed at ship attempt)` section, plain jj workspaces only
> **Superseded by:** [doc/specs/2026-09-25-gauntlet-bound-telemetry.md](./2026-09-25-gauntlet-bound-telemetry.md) - `### Binder`, `### Ship`, `### Record store`, `### Flusher`, and `### Diff (computed at ship attempt)` sections (git checkouts): bind requires the gauntlet-entered marker, checkpoint commits and in-extension ship detection are removed, the seal bin stamps and commits once at finish

**Goal:** A pi extension that mechanically records one committed YAML telemetry record per gauntlet run, keyed by spec path, without any skill-body edits - and hosts one narrow hard guard against re-brainstorming into a shipped spec.

Ticket: GitHub #33. Consumers: #34 (reads `modified_files`, `shipped_at`, `status` at query time), #35 (aggregates records; its "run ID" is the spec path - see Decisions).

## Problem

Gauntlet runs leave no durable, machine-readable trace: how long each phase took, which models and personas were dispatched, how many gate rounds and fix rounds a run needed, what shipped. Everything lives in session JSONL that is neither committed nor keyed by spec. #34 and #35 need this data; today nothing produces it.

## Decisions (from the questionary)

| # | Decision |
|---|---|
| 1 | The extension commits the record itself (`git commit -q -m "telemetry: <spec>" -- <record paths>`, pathspec commit) at commit checkpoints. At ship, a `tool_call` interceptor on `bash` detects the ship command while `ship` is in progress, flushes shipped state, commits, then lets the command run; a failed command is reconciled (see Ship). Skill bodies are never edited. |
| 2 | One record per spec path = one gauntlet run. Sessions are an attribute on events, not a structural unit. No `runs:` nesting, no per-run files. #35 treats the spec path as the run ID (#35 wording to be amended separately). |
| 3 | Binding is reconstructed from session history on `session_start`, otherwise established by the first qualifying spec interaction (see Binder). A spec rename rebinds and moves the record. A `plan_check` pass (`details.specPath`) confirms or corrects the binding. Events before binding buffer in memory, and accumulator inputs observed before binding (dispatch tokens, usage, peak context, gate counts, compactions) accumulate in a pending block that merges into the live session block at bind; session shutdown before binding drops both - no orphan files. |
| 4 | Hard guard: block only `write` to a spec path whose record has `shipped_at`, only while `brainstorm` is in progress in this session. `edit` is never blocked (supersession banner, typos). `bash` is not inspected for spec edits. Paths without a shipped record are unguarded. |
| 5 | Tokens: assistant `message_end` usage sums into the in-progress phase (else `unphased`); child usage from `subagent` result `details.results[].usage` sums into the same phase and a per-persona bucket. Tokens are accumulators, not events. Gate counters: spec-gate rounds = `spec-summarizer` dispatches; plan-gate rounds = `plan_check` calls; fix-round signals = `grant_fix_rounds` actions + `plan_tracker` complete->in_progress reopens. |
| 6 | Approach A: event-sourced record. `events:` is append-only lifecycle facts; `derived:` is recomputed from events + accumulators at every flush and written first in the file. Size is bounded (see Size bound): typical run 40-70 events, worst case ~300 lines. Consumers read `derived:` only; `events`/`accumulators` are opaque receipts. |
| 7 | YAML: add `yaml` (2.x) as a direct dependency of pi-gauntlet (first runtime dependency). The record must be parsed back on rehydrate. CI and local-install consequences are in Scope. Supersession banner detection stays regex-based. |
| 8 | Parent-only writer: when `Number(process.env.PI_SUBAGENT_DEPTH ?? "0") > 0` every handler no-ops (pi-cohort children load the same extensions; phase-tracker uses the same signal). Child usage reaches the record only through the parent's `subagent` results. |

## Scope

In scope:
- `extensions/telemetry.ts` (the registered extension: handlers, phase mirror, binder, record store, flusher, ship, guard) and `extensions/telemetry.test.ts` (harness tests)
- pure helper modules with colocated tests: `extensions/lib/telemetry-paths.ts` (path mapping, command matchers, buckets, banners), `extensions/lib/telemetry-record.ts` (event/accumulator model, `derive`, fold, cap, YAML), `extensions/lib/telemetry-collect.ts` (usage/findings/dispatch/plan reducers), `extensions/lib/telemetry-ship.ts` (diff summary, guard reason)
- `extensions/lib/gauntlet-settings.ts` (+ its test): `PiGauntlet.telemetry?: { enabled?: unknown; dir?: unknown; buckets?: unknown }`, `resolveTelemetry()`
- `package.json`: `pi.extensions` entry, `dependencies.yaml`
- `scripts/ci.mjs`: manifest (four entries), test list
- `.github/workflows/test.yml` and `release.yml`: `npm install` step before `npm test` (lockfile stays gitignored)
- `doc/install-internals.md`: local `pi install -l` now needs `npm install` in the repo
- `doc/configuration.md`, `README.md` (extensions list), `CHANGELOG.md`

Out of scope: any `skills/*/SKILL.md` change (acceptance: `git diff --name-only <base>...HEAD | rg '^skills/.*/SKILL\.md$'` is empty); #34 index; #35 report; two interactive sessions writing one record at the same time; per-task or per-commit attribution; LLM-authored fields; records for specs shipped before this extension existed (invisible to guard and counters).

## Architecture

One registered extension file, `extensions/telemetry.ts`, holding the runtime (handlers and closure state). Pure functions live in `extensions/lib/telemetry-*.ts` modules at module top level so their tests import them directly (pattern: `extensions/lib/plan-check.ts`). The default export is `function (pi, deps = realDeps)` with `deps: { fs, git, now, settings }` as the test seam; `git` is an async bounded runner (`execFile`, 10 s timeout, never throws - returns `{ code, stdout, stderr }`).

Handlers are registered unconditionally; each resolves `resolveTelemetry(loadGauntletSettings(ctx.cwd))` and returns immediately when `enabled` is false (settings need an event `ctx`; there is no cwd at registration time).

### Settings

| Key | Default | Meaning |
|---|---|---|
| `piGauntlet.telemetry.enabled` | `true` | `false` -> every handler no-ops: no file, no commits, no warnings, no guard. |
| `piGauntlet.telemetry.dir` | `.pi/gauntlet/telemetry` | Relative to the git toplevel of the worktree that owns `ctx.cwd`. Non-string, empty, absolute, or escaping the toplevel -> default + one `warning` event at bind (the extension has no tool result to prepend a warning to, so the record is its channel). |
| `piGauntlet.telemetry.buckets` | see Diff | Ordered `{ <name>: [<glob>, ...] }`; replaces the default list wholesale. Globs match repo-relative paths via `path.matchesGlob`. |

### Phase mirror

The extension keeps its own copy of phase state: on `session_start` it replays `ctx.sessionManager.getBranch()` for successful `phase_tracker` results (`details.phases`, `!details.error`) exactly as `phase-tracker.ts` does, then updates from live `tool_result`s. Phase transitions are derived by diffing consecutive `details.phases` snapshots (the details object carries no phase name). Only `start | complete | skip | reset` produce `phase` events; `status`, `substep`, and failed calls produce nothing; `grant_fix_rounds` is a gate event only.

Implement auto-completion: phase-tracker completes `implement` from a `plan_tracker` snapshot whose tasks are all `complete | skipped` (no `phase_tracker complete implement` result exists on the default SDD path). The mirror applies the same rule on successful `plan_tracker` results while implement is in progress, emitting one synthetic `phase complete implement` event and recording `derived.plan` totals from that snapshot.

### Binder

State: `boundSpec: string | null` (repo-relative), `branch`, `buffer: Event[]`.

Binding order on `session_start` (after the phase replay): last successful `plan_check` `details.specPath` on the branch wins; else the last successful `write` to `**/doc/specs/*.md`; else unbound. Unbound and no history -> bind on the first successful `write`/`edit` of a `**/doc/specs/*.md`, or the first `read`/`edit`/`write` of a `doc/plans/*.md` whose `**Spec:**` header resolves to an existing file. Paths are resolved the way pi's tools resolve them: relative to `ctx.cwd`, then made repo-relative against the owning toplevel; the same mapping serves binding, guard lookup, record path, and commits.

Rebind (rename) on a `write` to a different `**/doc/specs/*.md` while brainstorm is in progress and the bound file is either missing or its line 1 equals `CONTEXT_DRAFT_MARKER` (`extensions/lib/phase-tracker-helpers.ts:9`): `git mv` the record when tracked (else `fs.rename`), emit `spec_renamed`, and the next commit names both old and new record paths. If a record already exists at the destination, the move is refused with a `warning` event and the binding stays on the old path - a rename never overwrites another run's record.

Unbind on a `phase reset` event (a new brainstorm or redraw); the next qualifying write binds again - the same path loads the same record and continues it, a different path opens a new one.

On bind: load the record if it exists (see Record store) else mint `run_id` (UUID v4), `created_at` (= first retained event's `ts`), `author` (`git config user.name/email`), `versions`, `agent_overrides`. Flush buffered events with the bound path.

`approved_at` = `ts` of the first `phase complete brainstorm` or `phase skip brainstorm` event (skip is the resume-with-spec-in-hand path).

### Collector

Subscribes to `session_start`, `session_shutdown`, `tool_call`, `tool_result`, `message_end`, `turn_end`, `input`, `model_select`, `thinking_level_select`, `session_compact`. Every event carries `ts` (ISO-8601 UTC), `session`, `phase` (in-progress phase or `unphased`).

| Observation | Event / accumulator |
|---|---|
| phase mirror transition | `phase` event `{ action, name }`; `start` also snapshots `model` (`<provider>/<id>` from `ctx.model`, omitted when undefined) and `thinking` (`ctx.thinkingLevel`) |
| `plan_check` result | `plan_check` event `{ pass, spec, plan }` (repo-relative); counts `gates.plan_rounds` |
| `subagent` result `details.results[]` | one `dispatch` event per entry `{ agent, model (verbatim), exit }` with `exit` omitted when `0`; `usage` sums into phase + persona accumulators (`cost` = numeric `usage.cost`); `agent === "spec-summarizer"` counts `gates.spec_rounds`; reviewer personas also feed `reviews` (below). Async dispatches (`results: []`) contribute nothing. |
| reviewer results (`spec-reviewer`, `code-reviewer`, `conformance-reviewer`) | `reviews.<agent> = { dispatches, nonzero_exit, findings: { blocker, major, minor } }`, severities counted from `\[(blocker|major|minor)\]` tags in the result text; `findings` omitted when no tag matched. `conformance_loops` = `conformance-reviewer` dispatches while verify is in progress; `conformance_open_gaps` = the count of `Gn:` gap blocks in the text of the most recent `conformance-reviewer` result (`0` when its text carries `Conformance verdict: CONFORMS`; omitted when no conformance dispatch was observed) - the ticket's "open conformance gaps at closure" |
| `phase_tracker grant_fix_rounds`; `plan_tracker update` complete -> in_progress | `gate` event `{ kind: fix_round_grant \| task_reopen, rounds? }` |
| `plan_tracker` all-terminal snapshot (see Phase mirror) | `derived.plan = { tasks, complete, failed, skipped }` - counts only; the ticket's "per-task final status" is deliberately reduced to these totals to keep the record bounded (a per-task list is a #35 concern over the plan file, not this record) |
| successful `write`/`edit` on the bound spec | accumulator `spec_writes.<phase> = { count, last_sha256 }` (no event); after `approved_at`, consecutive spec writes with no `input` event between them count as one amendment; after `shipped_at` each counts in `spec_edits_after_ship` and prepends a one-line warning ("spec shipped at <ts>; write a follow-up spec that supersedes it") to that `tool_result`. An `edit` whose inserted text matches `^> \*\*Superseded by:\*\*` counts as neither. Links refresh: `supersedes`/`fixes` re-parsed from the spec body (`^> \*\*(Supersedes|Fixes):\*\*` banners, the value after the banner marker: a bare path, or the label of a markdown link - by the brainstorming banner convention the label is the repo-relative spec path and the href is file-relative, so the label is the identity) after every successful spec write; entries derived from a predecessor's `Superseded by:` edit are kept; both omitted when absent |
| `edit` on a **different** `**/doc/specs/*.md` inserting `> **Superseded by:** [<bound spec>]` | `supersedes` gains the edited predecessor path (deduplicated); no rebind, no other record touched |
| assistant `message_end` | phase tokens accumulator `{ input, output, cache_read, cache_write, cost }` with `cost = usage.cost.total`; an all-zero usage adds nothing |
| `turn_end` | `peak_context = max(peak_context, ctx.getContextUsage?.()?.tokens)` when the value is a number |
| `input` with `source !== "extension"` and text not starting with `/`, while phase in `plan \| implement \| verify \| ship` | `user_messages += 1` for that phase |
| `model_select` / `thinking_level_select` mid-phase | `config_change` event `{ model?, thinking? }` |
| `session_compact` | `compactions += 1` for the in-progress phase |
| `bash` `tool_call` while `ship` in progress, first statement matching `STMT_START + (git\s+merge\s+--squash|git\s+push|gh\s+pr\s+create)` (`STMT_START` from `phase-tracker-helpers.ts:39`) | Ship attempt (see Ship) |
| `bash` `tool_call` while `ship` in progress, first statement matching `STMT_START + git\s+(worktree\s+remove|branch\s+-D)` and no live ship event | Discard (see Ship) |
| `phase complete ship` with no live ship event | Option 3 keep: `shipped_at`, `status: shipped`, `ship` event `{ option: keep }`, flush + commit on the branch |

Last matched test command: a `bash` call during verify or ship whose first statement matches one of the resolved `verifyBeforeShip.testCommands` fragments (same regex construction as `verify-before-ship.ts`) records `derived.tests = { command: <matched statement, first 120 chars>, result: pass | fail }` from the `tool_result` exit; later matches overwrite. Omitted when nothing matched.

### Ship

Ship signals are keyed by tool call id. Only the **first** matching command while no ship event is live emits a ship attempt; later matches (Option 2 issues `git push` then `gh pr create`) are ignored.

Attempt: set `shipped_at`, `status: shipped`, append `ship` event `{ option: squash | pr, command: <matched statement, first 120 chars> }`, compute `diff`, flush and commit on the branch, then allow the command. On that call's `tool_result` with non-zero exit: append `ship_failed` event, clear `shipped_at`/`status: in_progress`, drop `diff`, flush (commit at the next checkpoint); the guard therefore never sees a false `shipped_at`, and a later ship signal may start a new attempt.

Discard: `status: abandoned`, `abandoned_at`, `ship` event `{ option: discard }`, flush and commit on the branch before the command runs. The record dies with the branch - that is the ticket's stated semantics for abandoned runs; nothing is written to the base checkout.

Freeze: after a `ship` event whose attempt succeeded (`squash`, `pr`, `discard`), the flusher stops writing and committing - the worktree may be gone (`squash`, `discard`) or the pushed branch must not gain unpushed commits (`pr`). `keep` does not freeze. Every fs or git error in the flusher becomes a `warning` event, never a throw, and never recreates a removed worktree directory.

### Record store

Path: `<toplevel>/<dir>/<spec-path with trailing .md replaced by .yaml>`, nested directories preserved (`doc/specs/x.md` -> `.pi/gauntlet/telemetry/doc/specs/x.yaml`). #34 uses the same mapping.

Load (on bind to a path with an existing record): parse YAML; take `run_id`, `created_at`, `approved_at`, `shipped_at`, `abandoned_at`, `status`, `events`, `accumulators`, `supersedes`, `fixes`, `plan`, `tests`. `sessions` gains the current session id. Write = serialize to `<record>.tmp` then `fs.rename` over the record.

`accumulators` holds every non-event input to derivation: per-phase tokens, per-persona tokens and dispatch counts, `reviews`, `spec_writes`, `compactions`, `user_messages`, `peak_context`, `amendments`, `spec_edits_after_ship`. It has at most two blocks: `total` (all closed sessions, merged) and `<current-session-id>` (live). On `session_shutdown` - and on load, for any non-`total` block whose session id is not the current one (a session that died without shutdown) - the block is folded into `total` (sums for counts and tokens, `max` for `peak_context`, `last_sha256` from the later block). `derived` = reduce(events) + `total` + live block; a later session's flush therefore preserves every earlier derived value.

### Size bound

- `events` is capped at 300 entries. On overflow the oldest events whose `kind` is not `phase`, `ship`, `ship_failed`, or `spec_renamed` are dropped, and `derived.events_dropped` records the running count. Lifecycle events (those four kinds) are never dropped: a run carries 10-20 of them, so the cap binds non-lifecycle events in practice and the only way to exceed 300 is a lifecycle-only overflow, which is accepted rather than guarded. `derived` is unaffected by truncation: every count and total lives in `accumulators`, events feed only phase timing, the dispatch list, and gate/plan_check facts already counted in accumulators.
- `accumulators` never exceeds two blocks (above).
- Per-event payload is one flow-style line; `command` fields are cut at 120 chars; `exit: 0` is omitted.
- Every leaf object in `derived` and `accumulators` (a `tokens` block, a persona/review/phase entry, `gates`, `plan`, `tests`) is serialized as one flow-style line, like events. Resulting envelope: header + `derived` ~40-60 lines, `accumulators` ~20-40, events 40-70 typical / 300 max (lifecycle-only overflow excepted). Worst case ~450 lines, typical 120-200; a populated 5-phase, 7-persona record with 300 events must serialize under 450 lines.

### Flusher

Write points (rederive + atomic write): every event, every accumulator change that lands on a flush boundary below, `session_shutdown`. Commit checkpoints (subset): `phase start | complete | skip | reset`, `plan_check` pass, ship attempt, discard, `session_shutdown`. Commit = `git add -f -- <record> [<old record>]` then `git commit -q -m "telemetry: <spec>" -- <record> [<old record>]`; skipped when the record is unchanged since the last commit or the toplevel is not a git repo. Unrelated index state is untouched (pathspec commit). Failure -> `warning` event with the first stderr line, retried at the next checkpoint; index lock -> one retry after 200 ms first.

### Diff (computed at ship attempt)

- `base` = `git merge-base HEAD <base-ref>`, `<base-ref>` = first existing of `origin/HEAD`, `main`, `master`; none -> `diff` omitted, `warning` event.
- `modified_files` = `git diff --name-only <base>...HEAD` minus the bound spec, `doc/plans/**`, and `<dir>/**`; sorted repo-relative paths (rename -> new path).
- `buckets.<name> = { files, insertions, deletions }` from `git diff --numstat <base>...HEAD` over the same file set; binary rows (`-`) count 0 lines. Bucket = first match, default order: `test` (`**/test/**`, `**/tests/**`, `**/__tests__/**`, `**/*.test.*`, `**/*.spec.*`, `**/*_test.*`), `docs` (`**/*.md`), `config` (`**/*.json`, `**/*.yaml`, `**/*.yml`, `**/*.toml`, `**/*.lock`, `**/*-lock.*`), else `code`.
- `commits` = `git rev-list --count --invert-grep --grep='^telemetry: ' <base>..HEAD`.

### Guard

`tool_call` handler for `write`: resolve `input.path` from `ctx.cwd`, map to the owning toplevel and the record path. If the record exists with `shipped_at` set **and** the phase mirror has `brainstorm` in progress -> return `{ block: true, reason: "spec <path> shipped at <ts> (record <record-path>). Write a new date-slugged spec that supersedes it instead of reusing this file." }` **before** any binding, buffering, or flush - the shipped record stays byte-identical. Otherwise pass.

### Versions and overrides snapshot

`versions`: `pi` from `@earendil-works/pi-coding-agent`'s exported `VERSION`; `pi-gauntlet` from this package's `package.json`; `pi-cohort`, `pi-quiver`, `pi-condense` from `<getAgentDir()>/npm/node_modules/<pkg>/package.json`; each omitted when unreadable. `agent_overrides`: the merged `subagents.agentOverrides` object read through `SettingsManager` at bind (a snapshot of another extension's setting, not a pi-gauntlet tunable - the `piGauntlet.*`-only rule governs tunables); omitted when absent.

## Schema

`schema: 1`. Field renames or removals bump it; additions do not. All on-disk keys snake_case. Unavailable data is omitted, never `0`/`null`; counters that are legitimately zero (`amendments`, `spec_edits_after_ship`, gate counts, `nonzero_exit`) are written as `0`.

```yaml
schema: 1
spec: doc/specs/2026-09-17-gh-33-run-telemetry-recorder.md
run_id: 4c5e...                  # UUID v4, minted at first flush, stable across sessions
branch: gh-33-run-telemetry-recorder
status: in_progress              # in_progress | shipped | abandoned
created_at: 2026-09-17T11:02:14Z
approved_at: 2026-09-17T12:40:01Z
shipped_at: ...                  # absent until a successful ship attempt
abandoned_at: ...                # absent unless discard
supersedes: [doc/specs/...]      # omitted when empty
fixes: [...]                     # omitted when empty
versions: { pi: 0.85.1, pi-gauntlet: 1.x, pi-cohort: ..., pi-quiver: ..., pi-condense: ... }
author: { name: ..., email: ... }
agent_overrides: { implementer: { model: ... }, ... }
sessions: [<id>, ...]
derived:
  duration_s: 9120               # created_at -> shipped_at | abandoned_at | last flush
  phases:
    brainstorm: { started_at, completed_at, duration_s, model, thinking, tokens: { input, output, cache_read, cache_write, cost }, compactions, peak_context }
    plan: { ..., user_messages }  # user_messages only for plan|implement|verify|ship
    unphased: { tokens: ... }
  personas:
    implementer: { dispatches: 6, models: [...], tokens: { ... } }
  reviews:
    code-reviewer: { dispatches: 2, nonzero_exit: 0, findings: { blocker: 0, major: 1, minor: 3 } }
  conformance_loops: 1
  conformance_open_gaps: 0
  gates: { spec_rounds: 2, plan_rounds: 1, fix_round_grants: 0, task_reopens: 1, ship_option: squash }
  plan: { tasks: 7, complete: 7, failed: 0, skipped: 0 }
  tests: { command: "npm test", result: pass }
  amendments: 1
  spec_edits_after_ship: 0
  diff: { base: <sha>, commits: 9, buckets: { code: { files: 2, insertions: 410, deletions: 12 }, test: {...}, docs: {...}, config: {...} } }
  modified_files: [extensions/telemetry.ts, ...]
  spec_writes: { brainstorm: { count: 41, last_sha256: ... }, plan: { count: 2, last_sha256: ... } }
  events_dropped: 0
accumulators:                    # rehydration source; consumers ignore; at most two blocks
  total: { phases: {...}, personas: {...}, reviews: {...}, spec_writes: {...}, amendments: 1, spec_edits_after_ship: 0 }
  <current-session-id>: { ... }
events:                          # capped at 300, see Size bound
  - { ts: ..., session: ..., phase: unphased, kind: phase, action: start, name: brainstorm, model: anthropic/claude-..., thinking: high }
  - { ts: ..., session: ..., phase: brainstorm, kind: dispatch, agent: scout, model: ... }
  - { ts: ..., session: ..., phase: ship, kind: ship, option: squash, command: "git merge --squash gh-33-run-telemetry-recorder" }
```

## Error handling and edge cases

| Case | Behaviour |
|---|---|
| `ctx.cwd` not in a git repo | record under `<cwd>/<dir>`, commits skipped, one `warning` event |
| commit or write fails | `warning` event, retry at next checkpoint; never thrown |
| `enabled: false` | every handler no-ops |
| child process (`PI_SUBAGENT_DEPTH > 0`) | every handler no-ops |
| session shuts down before binding | buffer dropped, nothing written |
| resume (`pi -c`, fresh session at plan/implement/verify/ship) | `session_start` replay binds from `plan_check` or last spec write; record loaded, `sessions` extended, `run_id` preserved |
| slug rename at spec-writing (write new, then delete draft) | rebind on the draft-marker rule; record moved; both paths in the next commit |
| `write` to a shipped spec during brainstorm | blocked before any state change; `edit` passes; banner `edit` counts nothing |
| ship command fails (conflict, rejected push) | `ship_failed`, terminal fields cleared, guard inactive, new attempt allowed |
| Option 2 (`git push` then `gh pr create`) | one attempt on the first match; second match ignored; frozen after success |
| discard (Option 4) | `abandoned` committed on the branch before removal; dies with the branch |
| redraw (`phase reset` mid-run) | unbind; next spec write binds the same path and continues the record; phase timings restart from the next start, earlier events kept |
| Option 3 keep branch | `shipped_at` at `phase complete ship`, committed, no freeze |
| compaction | no dependency on context; state is memory + record + branch replay |
| two sessions sequentially on one spec | read-modify-write; previous session's block folded into `accumulators.total`, values preserved |
| session killed without `session_shutdown` | its live block is folded into `total` at the next load |
| more than 300 events | oldest non-lifecycle events dropped, lifecycle events kept, `events_dropped` incremented, `derived` unchanged |
| `getContextUsage` absent or `tokens` null | `peak_context` omitted for that phase |
| spec under `<service>/doc/specs/` with `ctx.cwd` = `<service>` | pi-cwd resolution then repo-relative mapping; same record key from any cwd |
| gitignored `<dir>` in a consumer repo | `git add -f` stages it anyway |

## Testing

`extensions/telemetry.test.ts` and `extensions/lib/telemetry-*.test.ts` (`node:test`, each listed in `scripts/ci.mjs`, run under `extensions/test-support/pi-stubs.mjs`; `yaml` is a real import, hence the `npm install` step in CI):

- Pure: phase-snapshot diff -> transitions (incl. implement auto-complete); `derive(events, accumulators)`; record path mapping (nested, `.md` -> `.yaml`); pi-cwd path resolution for root and nested-service cwd; ship/discard/test-command matchers with `STMT_START` (an `rg "git push"` does not match); bucket classification with default and overridden globs and numstat aggregation; guard predicate; banner regexes; YAML serialize -> parse -> rehydrate round-trip preserving `run_id`, events, and every accumulator; event cap drops oldest non-lifecycle events first and leaves `derive()` output identical; accumulator fold (sum / max / last) is associative across two and three sessions.
- Harness: fake `pi` with `deps` injected (`fs` on a `mkdtempSync` dir, scripted `git`): bind on first write; `session_start` replay binds from `plan_check` details with no spec write; rename via write-then-delete rebinds and commits both paths; phase transitions commit exactly once each, substep/status calls commit nothing; ship attempt flushes and commits before the bash command, `git push` + `gh pr create` yields one ship event, non-zero exit clears terminal fields; freeze after squash writes nothing; `write` on a shipped spec is blocked without touching the record while `edit` passes; `enabled: false` and `PI_SUBAGENT_DEPTH=1` register no-ops; second-session rehydrate preserves user_messages, compactions, peak_context, persona tokens, plan, amendments and leaves exactly two accumulator blocks; a stale live block from a dead session is folded on load.
- `scripts/ci.mjs` manifest assertion updated to four entries; `gauntlet-settings` test covers `resolveTelemetry` defaults, invalid `dir`, and `buckets` validation.
- Manual acceptance (rescoped out of CI, run once on `main` after the squash): `pi install -l` this checkout in a scratch git repo, run a short brainstorm -> ship on a `doc/specs/` spec and on a `<service>/doc/specs/` spec, confirm one record each under `.pi/gauntlet/telemetry/` at the mapped path with `status: shipped`. The ticket's "scratch repo with the extension installed" AC is satisfied by this exercise, not by a fixture test.

## Documentation impact
- Feature / user-facing docs introduced: none (record schema and path mapping documented in `doc/configuration.md`, the doc that owns `piGauntlet.*` keys)
- Materially amended existing docs: `doc/configuration.md` (`piGauntlet.telemetry.{enabled,dir,buckets}`, guard behaviour, ship reconciliation, record path mapping, schema summary), `doc/install-internals.md` (`npm install` for local installs), `README.md` (extensions list), `CHANGELOG.md` (Unreleased)
- Derived / memory docs invalidated: none

## Open questions

- #34 hardcodes the default telemetry dir while #33 makes it configurable. Consumer resolution is #34's problem; this spec documents the mapping and the setting, nothing more.
- #35 wording ("backing run IDs", "multiple runs per spec") needs an amendment to "run ID = spec path" - tracker comment, outside this branch.
- `fixes:` has no producer in the workflow today; the field is defined (a `> **Fixes:**` banner in the spec) and stays omitted until a skill writes one.
