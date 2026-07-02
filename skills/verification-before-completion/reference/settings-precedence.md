# Settings precedence: repo-local first

How to resolve a `piGauntlet.<key>` settings value that both a repo and an agent
preset may define. Both the spec-critique gate (`specCouncil`) and the conformance
gate (`closureReview`) use this rule; it is stated once here.

## Source order (both keys)

Read two files, **repo-local first**:

1. `<repo-root>/.pi/settings.json` - repo root from `git rev-parse --show-toplevel`
   (inside a worktree this is the worktree root).
2. `$PI_CODING_AGENT_DIR/settings.json` - the agent preset.

Mechanics for both files: they may contain comments - read them, do not pipe
through a strict JSON parser. Expand `$PI_CODING_AGENT_DIR`; never substitute a
hardcoded path for it (reading the repo `.pi/settings.json` as if it were the
preset is the classic miss - they are different files). On a malformed repo-local
file, the reading agent emits one warning line in its response and falls back to
the preset.

## Merge granularity (same for both keys): whole-object

Both `specCouncil` and `closureReview` resolve **whole-object**: if the repo file
defines the key at all, that definition **replaces** the preset's entirely; the two
are never merged leaf-by-leaf. If the repo file does not define the key, the
preset's value is used unchanged.

This is not a pi-gauntlet convention - it is exactly what pi's own settings merge
does. `deepMergeSettings` (pi's `SettingsManager`) merges only the **top-level**
Settings keys (of which `piGauntlet` is one) by a one-level spread
`{ ...preset.piGauntlet, ...repo.piGauntlet }`. That spread replaces each
**second-level** key (`closureReview`, `specCouncil`, `flowGuards`) wholesale when
the repo defines it; it does **not** recurse into that key's leaves. So the
`phase-tracker.ts` closure guard (which reads `pi.settings.piGauntlet.closureReview.model`)
and the skills (which read repo-first, whole-object) resolve the same value.

**Caveat - partial definitions drop siblings.** Because the replace is
whole-object, a repo file that sets only *one* leaf of a key silently drops the
preset's other leaves for that key. A repo `closureReview: { "model": "..." }` with
no `enforce`/`maxFixRounds` makes those fall back to their code defaults
(`enforce` true, `maxFixRounds` 2), **not** to the preset's values. Define every
leaf you care about together in the file that owns the key. (Sibling keys like
`specCouncil` are unaffected - only the key the repo redefines is replaced.)
