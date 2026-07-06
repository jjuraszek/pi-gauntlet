# DRY gauntlet settings resolution via a shared helper + `gauntlet_setting` tool

## Problem

Two independent defects, same root:

**1. LLM-executed settings merge is unreliable (the trigger).** Skills resolve
`piGauntlet.specCouncil` (and `closureReview`) by hand-rolling a two-file,
repo-over-preset merge in prose + bash at every call site. The algorithm is
duplicated across several skill sites plus a canonical doc, and the LLM executes
it, so it is only as reliable as the model following every step.

Observed failure (session `2026-07-06T06-59-26-915Z_019f3639-...` in gridstrong):
the agent resolved `specCouncil` by reading **only** the repo `.pi/settings.json`
through a strict `python3 json.load`, got `ABSENT`, and fell back to the
poor-man's `worker` critique - never reading `$PI_CODING_AGENT_DIR/settings.json`,
which **did** define a 4-member council. The full council never ran. This is the
exact "classic miss" `settings-precedence.md` warns about, plus the strict-parse
footgun it bans.

**2. Every extension settings read is dead code (found during spec review).**
`phase-tracker.ts` and `verify-before-ship.ts` read `(pi.settings ?? {})`.
Verified against the installed pi 0.80.3 dist: `ExtensionAPI` exposes no `settings`
member and `SettingsManager.settings` is `private`, so `pi.settings` is
`undefined` at runtime and `(pi.settings ?? {})` is **always `{}`**. Consequences,
all currently silent:

- `closureReview.model` guard (phase-tracker) never fires - the conformance-gate
  model pin is unenforced.
- `closureReview.enforce` is never read - always defaults on.
- `flowGuards.enforce` / `flowGuards.specDirs` never read - always defaults
  (`enforce` on, `specDirs` `["doc/specs"]`); a consumer override is ignored.
- `verifyBeforeShip.testCommands` / `warningReference` never read - always the
  built-in defaults; a consumer override is ignored.

Both defects share one cause: **there is no single, correct place that reads
merged gauntlet settings.** Skills re-derive it in bash; extensions reach for an
API member that does not exist.

## Goal

One shared helper reads and merges gauntlet settings correctly, in typed and
tested code. Every consumer - the four extension config reads **and** the skill
call sites - routes through it. Skills reach it via one internal tool
(`gauntlet_setting`); extensions import it directly. After this change **no
ad-hoc settings read remains** in the codebase: no `pi.settings` reference, no
skill-side bash/JSON merge.

Precedence semantics are unchanged: repo-over-preset, whole-object at the second
level - the rule `settings-precedence.md` already documents. We implement that
rule once, in the helper.

## Non-goals

- No change to precedence rules, merge granularity, or the meaning of an empty
  `members` array (still an explicit "no council here").
- No validation that configured models exist or are reachable - resolution is
  structural only.
- No new settings key, no new extension file, no config schema change.
- No provenance / "which file" reporting (see Architecture).
- No worktree-aware cwd resolution (see D1 in Decisions); the helper reads from
  the session cwd (`ctx.cwd`), which is pi's launch directory.

## Decisions

- **D1 (resolved: use `ctx.cwd`).** The helper reads settings relative to
  `ctx.cwd` - the `ExtensionContext.cwd` handed to tool `execute` and to event
  handlers. This is pi's session/launch directory (the primary checkout), **not**
  the worktree brainstorming creates mid-session; pi's cwd does not follow a
  mid-session `git worktree add`, so neither `ctx.cwd` nor `process.cwd()` would
  point at the worktree without the skill passing a path explicitly. We accept
  the launch-dir scope: gauntlet settings live at the repo root or the preset and
  are shared across a repo's worktrees, so a per-branch `.pi/settings.json`
  divergence is the only case that differs, and that is not a supported workflow.
  `ctx.cwd` is used (not `process.cwd()`) because it is the API pi hands us and it
  tracks pi's own notion of the working directory.
- **D3 (resolved: fresh read per call, one read per event).** Every helper call
  reads the files fresh - no cross-call/cross-event cache, so a mid-session
  settings edit is always reflected (matters for the skill-facing tool). To avoid
  redundant reads, each extension **event handler invocation loads once** at the
  top and reuses that value for all guard checks in that event (today the
  closures re-read 2-4x per write/edit/bash event). Net: exactly one merged read
  per `tool_call` event and one per tool `execute`. See Error handling for the
  concurrent-write edge this leaves open.

## Conformance dispositions (post-implementation)

Dated decisions from the closing conformance gate; each accepts an implementation
that diverged from the spec text above because the divergence is an improvement or
trivia, not a regression.

- 2026-07-06 accept G3: resolvers add light structural validation (empty/non-string `specDirs`/`testCommands` and malformed `members`/`chair` fall back to defaults) rather than mirroring the old inline reads exactly - hardening with no behavior change for valid config, and the old reads were dead. (conformance gate)
- 2026-07-06 accept G4: D3.b is implemented as a lazy at-most-one-read memo plus a cheap in-memory phase pre-gate, so a `tool_call` that trips no guard performs zero settings I/O (spec said "loads once at the top"). Strictly less lock traffic, identical guard semantics. (conformance gate)
- 2026-07-06 accept G5: `roasting-the-spec` consumes `members`/`chair` from the council value `brainstorming` already resolved via `gauntlet_setting`, instead of calling the tool a second time itself - more DRY than the call-site table implied; resolution stays single-sourced in the brainstorming gate. (conformance gate)
- 2026-07-06 accept G6: markdownlint blank-line normalization landed in already-edited skill/doc files - trivial formatting within the carve-out. (conformance gate)

## Architecture

### Data source (the blocker fix)

The helper reads settings through pi's own `SettingsManager`, the same class pi
uses internally:

```ts
// getGlobalSettings() -> agentDir/settings.json   (the preset)
// getProjectSettings() -> cwd/.pi/settings.json    (the repo)
const sm = SettingsManager.create(cwd, getAgentDir());
```

Both getters are public and return the parsed `Settings` for one layer.
`getAgentDir()` (exported from the package index) is already the default second
argument to `create`; passing it explicitly documents intent. `cwd` is `ctx.cwd`
(D1).

`deepMergeSettings` is **not** exported, so the helper performs the documented
whole-object second-level merge itself:

```ts
const merged = { ...preset.piGauntlet, ...repo.piGauntlet };
```

Each second-level key (`specCouncil`, `closureReview`, `flowGuards`,
`verifyBeforeShip`) present in the repo layer replaces the preset's wholesale;
keys absent from the repo layer fall through to the preset. This is exactly what
pi's own `deepMergeSettings` does for the second level, and exactly the rule
`settings-precedence.md` specifies (including the "partial definition drops
siblings" caveat).

**Reads use strict `JSON.parse` (no comments).** `SettingsManager`'s
`loadFromStorage` parses with strict `JSON.parse` - a commented settings file is
invalid to pi itself, not just to us. This **corrects** `settings-precedence.md`,
which currently claims the files may contain comments; the recast states the
files must be strict JSON.

### Error handling is via `drainErrors()`, not try/catch

Verified against dist: `SettingsManager.create` / `getGlobalSettings` /
`getProjectSettings` do **not** throw on a corrupt or unreadable file -
`tryLoadFromStorage` catches internally, substitutes `{}` for that layer, and
records the error, retrievable via the public `drainErrors()`. So a naive
try/catch around `create` is dead code, and an unreadable repo file would
silently drop the repo layer - the exact silent-fallback class this spec exists
to kill. The helper therefore calls `drainErrors()` after loading and returns any
errors alongside the merged object, so callers can surface them (tool `content`;
extension warning line) instead of failing silent.

### Module split (the blocker fix): pure resolvers must not import pi

`@earendil-works/pi-coding-agent` is **not resolvable standalone** (it is not a
local dependency; a bare import throws `MODULE_NOT_FOUND` outside pi's runtime).
So a top-level pi import anywhere in the resolver module breaks `ci.mjs`, which
imports the pure resolvers directly with `node --test`. Two files:

- `extensions/lib/gauntlet-settings.ts` - **pure**, zero pi imports. Declares the
  `PiGauntlet` read-shape interface, the whole-object merge, and the four pure
  resolvers. This is what `ci.mjs` imports and unit-tests with fixtures.
- `extensions/lib/gauntlet-settings-loader.ts` - imports `SettingsManager` /
  `getAgentDir`, exposes `loadGauntletSettings(cwd, ...)` returning
  `{ gauntlet: PiGauntlet, errors: string[] }`. Imported by `phase-tracker.ts`
  and `verify-before-ship.ts` at runtime only (pi resolves the import); never
  imported by `ci.mjs`.

Both live in `lib/`, which matches neither pi discovery glob (`extensions/*.ts`,
`extensions/*/index.ts`), so pi never loads them as extensions - they are plain
importable modules (jiti resolves the relative `.ts` import at runtime).

### Why no provenance field

`SettingsManager`'s merged/private state is not exposed, and computing a
repo-vs-preset `source` label buys nothing the consumer acts on. The merged value
plus a baked verdict is what fixes the bug; provenance is dropped.

## Components

### Pure resolvers (`extensions/lib/gauntlet-settings.ts`)

`PiGauntlet` is a local interface declaring the read shape. The pi `Settings` type
is not exported from the package index; declaring the narrow shape locally is the
existing extension pattern (both extensions already define a local `Settings`
type today).

#### `resolveSpecCouncil(g)` ->

```
{ verdict: "council" | "worker",
  members: string[],            // provider/model strings; [] when none
  chair: string | undefined,    // echoed in every path, incl. worker/malformed
  malformed: boolean,
  warning: string | undefined }
```

- `members` a non-empty array whose entries are all non-empty strings ->
  `verdict: "council"`.
- absent, or an empty array -> `verdict: "worker"` (explicit "no council here";
  **not** malformed).
- `members` any other shape (not an array, or any entry not a non-empty string)
  -> `verdict: "worker"`, `malformed: true`, `warning` set - the "emit one
  warning line, fall back to worker" rule, computed once.
- `chair`: a non-empty string is echoed as-is in every path. A present-but-non-
  string `chair` sets `malformed: true` + `warning` and yields `chair: undefined`,
  but **never downgrades an otherwise-valid `members` verdict** - a valid
  `members` array with a bad `chair` still returns `verdict: "council"` (the skill
  gets the members and a warning; the chair is separately recoverable). Verdict is
  a function of `members` only.

Validation is structural only: entries are non-empty strings. No `provider/model`
slash or whitespace validation, no reachability check.

#### `resolveClosureReview(g)` ->

```
{ model: string | undefined,    // only when a non-empty string; else undefined
  enforce: boolean,             // default true; false only when explicitly false
  maxFixRounds: number }        // default 2; a non-negative integer; <0 -> 0; non-int/absent -> 2
```

`model` is surfaced only when it is a non-empty string, so the guard's
`model.trim()` cannot crash on a malformed value. `maxFixRounds` is included
because `conformance-check.md` already consumes it; omitting it would leave a
second hand-rolled read and defeat the DRY goal.

#### `resolveFlowGuards(g)` / `resolveVerifyBeforeShip(g, defaultTestCommands)`

Mirror the current inline logic exactly, now single-sourced:

- `resolveFlowGuards(g)` -> `{ enforce: boolean /*default true*/, specDirs: string[] /*default ["doc/specs"]*/ }`
- `resolveVerifyBeforeShip(g, defaultTestCommands)` -> `{ testCommands: string[], warningReference: string | undefined }`

`DEFAULT_TEST_COMMANDS` stays owned by `verify-before-ship.ts` and is **passed in**
as the `defaultTestCommands` argument (parameter injection). The resolver does not
import it, so there is no lib->extension import edge and no circular import; the
default lives in exactly one place.

### Loader (`extensions/lib/gauntlet-settings-loader.ts`)

`loadGauntletSettings(cwd, agentDir = getAgentDir())` ->
`{ gauntlet: PiGauntlet, errors: string[] }`. Constructs `SettingsManager.create`,
returns the whole-object-merged `piGauntlet` (`{}` when neither layer defines it)
plus `drainErrors()`. `cwd` is required from the caller (`ctx.cwd`).

### Tool (`gauntlet_setting`, registered in `phase-tracker.ts`)

- Param `key: "specCouncil" | "closureReview"` - a TypeBox string-literal union
  (StringEnum), closed. Only the two keys skills consume; `flowGuards` /
  `verifyBeforeShip` are extension-internal and get no tool surface.
- `execute(_id, { key }, _signal, _onUpdate, ctx)` calls
  `loadGauntletSettings(ctx.cwd)` then the matching resolver.
- **Output goes in `content`** as a single fenced ` ```json ` block carrying the
  full resolver payload plus any `errors` from the load
  (verdict/members/chair/malformed/warning/errors, or
  model/enforce/maxFixRounds/errors). Tool `details` are not part of the
  model-visible transcript, so the payload the skill branches on **must** be in
  `content`; `details` mirrors the same object for renderers/state only.
- Description marks it **gauntlet-internal, invoked by skills** in one sentence so
  the main-loop LLM does not call it ad hoc.
- Registration is a **second `pi.registerTool()` call** in `phase-tracker.ts`
  (alongside the existing `phase_tracker` tool); the file now owns two tools.

### Extension rewiring (no `pi.settings` survives)

- `phase-tracker.ts`: the `tool_call` handler loads **once** at the top of the
  handler (`const { gauntlet } = loadGauntletSettings(ctx.cwd)`), then derives
  `resolveClosureReview(gauntlet)` and `resolveFlowGuards(gauntlet)` from that one
  value - replacing the closures that today re-read `(pi.settings ?? {})` 2-4x per
  event. The handler signature gains `ctx`
  (`pi.on("tool_call", async (event, ctx) => ...)`; ctx is already the 2nd arg pi
  passes, as the existing `tool_execution_end` handler shows). The closureReview
  guard gains a **real** (previously dead) model check - a behavior change; see
  Rollout.
- `verify-before-ship.ts`: the activation-time `(pi.settings ?? {})` read ->
  `resolveVerifyBeforeShip(loadGauntletSettings(ctx.cwd).gauntlet, DEFAULT_TEST_COMMANDS)`,
  evaluated per event from that event's `ctx` (so a mid-session settings edit is
  honored, matching the tool).
- Post-change assertion: `grep -rn "pi.settings" extensions/` returns nothing.

## Call-site edits (skills: N prose/bash -> 1 tool call)

Exact set, verified by grep; the implementer reads each range and replaces the
manual resolution with the tool call, preserving surrounding intent:

| Site | Lines (approx) | Before | After |
|---|---|---|---|
| `brainstorming/SKILL.md` | Spec Council section, ~L227 | bash two-file resolve + precedence prose | `gauntlet_setting({key:"specCouncil"})` -> branch on `verdict`; use `members`/`chair`/`warning` |
| `roasting-the-spec/SKILL.md` | frontmatter/description + members/chair intake, ~L27 | prose two-file resolve | `gauntlet_setting({key:"specCouncil"})` -> use `members`/`chair` |
| `subagent-driven-development/SKILL.md` | closure model resolve, ~L89 and ~L114 | inline "resolve repo-first" prose | `gauntlet_setting({key:"closureReview"})` -> `model`/`maxFixRounds` |
| `verification-before-completion/reference/conformance-check.md` | ~L46 (model) + ~L208 (maxFixRounds) | prose "resolve repo-first" + maxFixRounds read | `gauntlet_setting({key:"closureReview"})` -> `model`/`maxFixRounds` |
| `verification-before-completion/reference/settings-precedence.md` | whole doc | full read-two-files runbook | conceptual rule + tool pointer (see below) |

**Tool-unavailable behavior (single, non-contradictory rule): fail loud, never
hand-roll.** Every skill call site states in one line: if `gauntlet_setting` is
unavailable, stop and report - do **not** fall back to a bash/JSON merge (that
path is the original bug). `settings-precedence.md`'s operational read-two-files
runbook is **deleted**, not kept as a degraded note - retaining it is an
attractive nuisance that reintroduces the trigger. The doc keeps only the
conceptual precedence rule (repo-over-preset, whole-object,
partial-definition-drops-siblings, strict-JSON) and a pointer to the tool as the
sole operational path.

## Data flow

Skill needs a setting -> `gauntlet_setting({key})` -> `loadGauntletSettings(ctx.cwd)`
(SettingsManager reads preset + repo, whole-object merge, drainErrors) -> resolver
returns verdict/value + errors in `content` -> skill branches on it. No file
reads, no parsing in the skill.

Extension needs config -> event handler loads once -> `resolve*(gauntlet, ...)` ->
same merged source, same resolvers. One implementation, N callers.

## Error handling and edge cases

- **Neither layer defines `piGauntlet`** -> merged `{}`; every resolver returns
  its documented default (`specCouncil` -> worker; `closureReview` ->
  `{model: undefined, enforce: true, maxFixRounds: 2}`; flowGuards/verifyBeforeShip
  -> built-in defaults).
- **`members: []`** -> worker, not malformed.
- **Malformed `specCouncil`** (non-array, or an entry not a non-empty string) ->
  worker + `malformed` + `warning`; skill surfaces the one warning line. A bad
  `chair` alone does not change a valid `members` verdict.
- **Non-string `closureReview.model`** -> `model: undefined`; guard cannot crash.
- **`maxFixRounds` non-int / negative** -> `2` / `0` respectively.
- **Corrupt / unreadable settings file** -> that layer loads as `{}` (SettingsManager
  does not throw); `drainErrors()` returns the reason, surfaced in tool `content`
  and the extension warning line - not swallowed.
- **Concurrent write to a settings file (lock contention).** Verified: reads go
  through `withLock` -> `lockSync` with a synchronous busy-wait (10x20ms) that
  throws `ELOCKED` after max attempts, which `tryLoadFromStorage` swallows to `{}`.
  Under D3.b (fresh per call) this means: if another process holds the write lock
  at read time, that single read degrades to defaults for that one event, then
  self-heals on the next event. Accepted because (a) uncontended `lockSync` is a
  few sub-ms syscalls, (b) contention only occurs during an actual settings write
  (rare), (c) guards are advisory warn-once and config-stable, and (d) the
  `drainErrors()` surfacing makes a degraded read visible rather than silent. The
  one-read-per-event rule bounds worst-case lock traffic to one acquisition per
  `tool_call` event / per tool `execute`.
- **Tool called with an unknown key** -> impossible via the closed StringEnum;
  schema rejects before `execute`.

## Testing approach

Harness is `scripts/ci.mjs` (the repo's `npm test`).

- **Resolver unit tests** via `node --test` in a new
  `extensions/lib/gauntlet-settings.test.ts` (pure, fixtures in / verdict out, no
  pi runtime, imports only the pure module): specCouncil council /
  worker-absent / worker-empty / malformed-non-array / malformed-entry-not-string /
  chair echoed in worker path / non-string chair does not downgrade a valid
  members verdict; closureReview model present / non-string / absent, enforce
  true/false/absent, maxFixRounds default/negative/non-int; flowGuards +
  verifyBeforeShip default vs override (verifyBeforeShip passed an explicit
  `defaultTestCommands` fixture). `ci.mjs` invokes `node --test` on this file.
- **Extension parse-check must recurse into `extensions/lib/`.** `ci.mjs`
  currently type-strip-checks `extensions/*.ts` non-recursively, so `lib/` files
  are unchecked. Extend the walk to include `extensions/lib/*.ts` (both the pure
  module and the loader). Type-strip requires native TS stripping (Node >= 23.6;
  CI pins 24), already the case.
- **Packaging assertion (positive):** the `npm pack --dry-run --json` file list
  **must contain** both `extensions/lib/gauntlet-settings.ts` and
  `extensions/lib/gauntlet-settings-loader.ts` (phase-tracker imports the loader
  at runtime; if the `files` allowlist drops either, the extension fails to load).
  Assert presence, not absence.
- **No-ad-hoc assertion:** a test asserts `grep -rn "pi.settings" extensions/`
  is empty, locking the invariant that all reads route through the helper.
- Existing `ci.mjs` checks (frontmatter counts, stale-token scan, pack list) stay
  green.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md (phase-tracker extension entry: note the `gauntlet_setting` tool and that all `piGauntlet.*` reads route through the shared helper); AGENTS.md (extensions table: phase-tracker hosts `gauntlet_setting`)
- Derived / memory docs invalidated: `verification-before-completion/reference/settings-precedence.md` - recast from a skill read-two-files runbook to the conceptual rule + tool pointer, and corrected to state settings files are strict JSON (no comments); amend in the same commit

Skill and agent bodies edited here (`brainstorming`, `roasting-the-spec`,
`subagent-driven-development`, `conformance-check.md`) are implementation surface
tracked in the plan's file list, not doc-impact entries (per
`skills/brainstorming/reference/documentation-impact.md`).

## Rollout / compatibility

- **Behaviour change (latent-bug fix):** consumers that set `closureReview`
  (`model`/`enforce`), `flowGuards` (`enforce`/`specDirs`), or `verifyBeforeShip`
  (`testCommands`/`warningReference`) and relied on the current silent no-op will
  now see those settings **take effect** for the first time. Most impactful:
  `closureReview.model` now actually pins the conformance-gate model and blocks a
  mismatched dispatch. CHANGELOG must call out that these reads were dead and are
  now live, so the change is not mistaken for a regression.
- Tool + helper + skill edits ship in one release; a given pi-gauntlet version is
  internally consistent.
- No pi-cohort dispatch-shape dependency -> pi-gauntlet releases alone. Semver:
  **minor** (new extension-hosted tool + shared helper); the latent-bug fix rides
  with it. README peer-dependency minimum unchanged.
</content>
