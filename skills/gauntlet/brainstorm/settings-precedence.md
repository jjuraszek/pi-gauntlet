# Settings precedence: repo-local first

How a `piGauntlet.<key>` value is resolved when both a repo and an agent preset
define it. Both the spec-critique gate (`specCouncil`) and the conformance gate
(`closureReview`) use this rule; it is stated once here.

## The rule

Repo settings override the preset, **whole-object at the second level**:

- Preset: `$PI_CODING_AGENT_DIR/settings.json`.
- Repo: `<repo-root>/.pi/settings.json`.

If the repo file defines a `piGauntlet.<key>` at all, that definition **replaces**
the preset's for that key entirely - the two are never merged leaf-by-leaf. If the
repo file does not define the key, the preset's value is used unchanged. This is
exactly pi's own `deepMergeSettings` behaviour: it spreads the second-level keys
(`specCouncil`, `closureReview`, `flowGuards`, `verifyBeforeShip`, `escalationLoop`) wholesale, and
does not recurse into their leaves.

**Caveat - partial definitions drop siblings.** Because the replace is
whole-object, a repo file that sets only *one* leaf of a key silently drops the
preset's other leaves for that key. A repo `closureReview: { "model": "..." }` with
no `enforce`/`maxFixRounds` makes those fall back to their code defaults
(`enforce` true, `maxFixRounds` 5), **not** to the preset's values. Define every
leaf you care about together in the file that owns the key. (Sibling keys are
unaffected - only the key the repo redefines is replaced.)

**Settings files are strict JSON.** pi's `SettingsManager` parses them with
`JSON.parse`; comments make the file invalid to pi itself, so never add them.

## The single operational path

Do **not** read or merge these files by hand. Resolution is centralized:

- **Skills** resolve `piGauntlet.*` via the `gauntlet_setting` tool (registered by
  the `phase-tracker` extension): `gauntlet_setting({ key: "specCouncil" })` or
  `gauntlet_setting({ key: "closureReview" })`. The tool returns the merged value
  (repo over preset) in its result content. If the tool is unavailable, stop and
  report - never fall back to a manual bash/JSON merge (that fallback is exactly
  the failure mode this centralization removes).
- **Extensions** call `loadGauntletSettings(ctx.cwd)` from
  `extensions/lib/gauntlet-settings-loader.ts`, which returns `{ gauntlet, errors, root }`
  with `root` set to that toplevel, then call the matching resolver in
  `extensions/lib/gauntlet-settings.ts`.

Both paths go through pi's own `SettingsManager`, so they resolve the same merged
value. The `phase-tracker.ts` closure guard reads via `loadGauntletSettings` +
`resolveClosureReview`, resolving the same value the tool returns.

## Scope: the session cwd's checkout

The tool and loader resolve the repo layer from the git toplevel of pi's session cwd
(`ctx.cwd`): launched in the primary checkout or any of its subdirectories, that is
`<primary>/.pi/settings.json`; launched inside a linked worktree, that worktree's own
file. One checkout, one file - a worktree's `.pi/settings.json` is not consulted when
pi runs in the primary.
