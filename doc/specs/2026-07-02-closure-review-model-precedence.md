# closureReview model: repo-first precedence + guard match-check

## Problem

Two pi-gauntlet flows resolve a `piGauntlet.*` settings key across the same two
files (repo-local `.pi/settings.json` and the agent preset
`$PI_CODING_AGENT_DIR/settings.json`), but with **inconsistent rules**:

| Consumer | Read-site | Current rule |
|---|---|---|
| `specCouncil` | `roasting-the-spec` "Configuration and gating"; `brainstorming` "Spec Council" | repo-local first, preset second, first file that defines the key wins |
| `closureReview.model`, `closureReview.maxFixRounds` | `verification-before-completion/reference/conformance-check.md`; `subagent-driven-development` | **preset only** (`$PI_CODING_AGENT_DIR` only) |

Consequence: a repo that sets `piGauntlet.closureReview.model` in its own
`.pi/settings.json` is silently ignored. The conformance-reviewer dispatch reads
the preset value (or, when the preset is also unset, omits `model:` and inherits
the parent session's model). This is the observed failure: a conformance audit
ran on the parent's model instead of the repo-configured one.

Separately, the `phase-tracker.ts` closure guard only checks **presence/absence**
of `model:` on the dispatch. An explicit-but-wrong model passes the guard
silently, so the call-site injection is honor-system only.

## Goals

1. `closureReview` key resolution honors repo-local `.pi/settings.json` over the
   preset, reusing one shared statement of the two-file lookup that `specCouncil`
   already uses (DRY on source order and mechanics).
2. The closure guard is upgraded from a presence-check to a **match-check** that
   blocks bare omission (unchanged) and **warns** (non-blocking) on an
   explicit-but-mismatched model.

## Non-goals

- No change to `specCouncil`'s resolution behavior - it is the reference for the
  shared file-order rule.
- No change to pi's own settings merge, or to `pi.settings` semantics.
- No new automated test harness for extensions (none exists in this repo).

## Key design decision: both keys resolve whole-object

> Correction (post-conformance review): an earlier draft of this spec specified a
> per-leaf deep-merge for `closureReview` and a whole-object rule for `specCouncil`,
> claiming pi's `pi.settings` merges nested objects recursively. That is **false**.
> pi's `deepMergeSettings` merges only the **top-level** Settings keys (incl.
> `piGauntlet`) with a one-level spread; within `piGauntlet` each second-level key
> (`closureReview`, `specCouncil`, `flowGuards`) is replaced **whole-object** when
> the repo defines it. Both keys therefore resolve the same way, which is also
> closer to the original "same mechanism" request. The section below reflects the
> corrected, verified behavior.

`specCouncil` and `closureReview` share the **two-file source order** (repo-local
first, preset second), the **mechanics** (comments tolerated, `$PI_CODING_AGENT_DIR`
expanded, malformed repo file -> warn + fall back to preset), **and** the merge
granularity:

- **Both keys - whole-object.** If the repo `.pi/settings.json` defines the key,
  that definition **replaces** the preset's entirely; the two are never merged
  leaf-by-leaf. If the repo file does not define the key, the preset's value is
  used unchanged. An empty `members` in the repo file is still an explicit "no
  council here" - a natural consequence of whole-object replace, not a special case.

This matches pi exactly: the guard resolves `configured =
pi.settings.piGauntlet.closureReview.model`, and `pi.settings` is the same
whole-object-replaced merge the skills reproduce by reading repo-first. Skill and
guard therefore agree on the resolved `model` in every case - there is no
false-BLOCK scenario, because when the repo redefines `closureReview` both sides
see the repo's block (and both see the preset's when it does not).

**Caveat - partial definitions drop siblings.** Because the replace is whole-object,
a repo `closureReview: { "model": "..." }` with no `enforce`/`maxFixRounds` drops the
preset's values for those leaves; they fall back to code defaults (`enforce` true,
`maxFixRounds` 2), not to the preset. Define every leaf you need together.

## Design

### 1. Canonical precedence reference

New file `skills/verification-before-completion/reference/settings-precedence.md`.
It ships inside an existing skill's `reference/` dir (the npm `files` allowlist
ships all of `skills/`, and `scripts/ci.mjs` requires every direct child of
`skills/` to contain a `SKILL.md`, so a standalone `skills/_shared/` dir is not
viable). It co-locates with `conformance-check.md`, which is already cross-read by
three skills, so cross-skill relative reads are an established pattern.

The reference states, parameterized by key name:

> Resolve `piGauntlet.<key>` from two settings files, **repo-local first**:
>
> 1. `<repo-root>/.pi/settings.json` - repo root from
>    `git rev-parse --show-toplevel` (inside a worktree this is the worktree root).
> 2. `$PI_CODING_AGENT_DIR/settings.json` - agent preset.
>
> Both files may contain comments - read them, do not pipe through a strict JSON
> parser. Expand `$PI_CODING_AGENT_DIR`; never substitute a hardcoded path. On a
> malformed repo-local file, the reading agent emits one warning line in its
> response and falls back to the preset.
>
> **Merge granularity - whole-object for both keys:** if the repo file defines
>   `specCouncil` or `closureReview`, that definition replaces the preset's
>   entirely (no leaf-by-leaf merge); if it does not, the preset's value stands.
>   This mirrors pi's own `pi.settings` merge, which replaces each second-level
>   `piGauntlet` child whole-object, so the extension guard and the skills resolve
>   the same value. A partial repo definition drops the preset's other leaves for
>   that key (they fall to code defaults), so define every leaf together.

### 2. Skill edits (point every consumer at the reference)

Each edit keeps a **one-line inline summary** of the rule plus a pointer to the
reference - never a bare pointer, so an agent that does not dereference still has
the essential "repo-local first" instruction:

- `skills/roasting-the-spec/SKILL.md` "Configuration and gating": replace the
  inline two-file prose with the one-liner + pointer (key = `specCouncil`,
  whole-object); keep the `members`/`chair` schema and the brainstorming-owns-the-gate
  note.
- `skills/brainstorming/SKILL.md` "Spec Council (Optional)": replace its
  duplicated lookup-order prose with the same one-liner + pointer
  (key = `specCouncil`), eliminating the duplication.
- `skills/verification-before-completion/reference/conformance-check.md`: change
  `closureReview.model` / `maxFixRounds` resolution from preset-only to the
  one-liner + pointer (key = `closureReview`, whole-object). This is the behavioral
  fix - the conformance dispatch now reads repo-first.
- `skills/subagent-driven-development/SKILL.md`: same change at its
  conformance-reviewer dispatch comment (key = `closureReview`, whole-object).

Consumers keep their key-specific schema inline; only the source-order rule and
mechanics are centralized.

### 3. Extension guard: presence-check -> match-check

`extensions/phase-tracker.ts`. `closureReviewModel()` reads
`pi.settings.piGauntlet.closureReview.model`. `pi.settings` is pi's deep-merged
project-over-global view (each second-level `piGauntlet` child is replaced
whole-object when the project file defines it), so the value is already repo-first
via pi's own merge - the extension delegates precedence to pi and adds no
git-rev-parse logic. With `closureReview` resolved whole-object on the skill side
too (section 1), guard and skills agree.

**Match-check contract.** At `tool_call` for a conformance-reviewer dispatch,
resolve `configured = closureReviewModel()` and classify **each**
conformance-reviewer entry (a dispatch may carry several via `tasks`/`chain`):

| Entry `model:` | `configured` | Classification |
|---|---|---|
| absent (missing, empty string, or null) | set | **missing** |
| present, trimmed `!= configured` | set | **mismatch** |
| present, trimmed `== configured` | set | ok |
| any | unset | ok (inheritance intentional when unconfigured) |

Comparison is trimmed exact string match on the `provider/model` value.

Aggregate per dispatch:
- **any entry missing** -> **BLOCK** (unchanged hard gate), naming the offending
  entries and `configured`.
- else **any entry mismatch** -> **WARN** (non-blocking), one warning naming each
  mismatched entry's model and `configured`.
- else pass.

The warn path exists because the guard cannot distinguish a deliberate fallback
(the skills document "if the configured model is unreachable, retry once with an
explicit fallback/inherited model") from a mistake; blocking would break that
escape hatch. `closureReview.enforce = false` suppresses both BLOCK and WARN, as
today.

**WARN delivery.** The existing warning-prepend path fires only on `bash`/`write`/
`edit` tool results; the `subagent` branch of the `tool_result` handler returns
early (after marking the dispatch observed) and never consults pending warnings.
A WARN computed at `tool_call` must therefore be **stashed** keyed by the
dispatch's `toolCallId` and **prepended to the subagent `tool_result`** by
extending that early-return branch to drain the stash before returning. BLOCK
continues to fire at `tool_call` (it prevents the dispatch outright, so it needs
no delivery path).

## Error handling and edge cases

- **`closureReview.model` unset in both files** -> `configured` undefined; the
  guard passes every dispatch (including bare omission). Inheriting the parent
  model is intended when unconfigured. Matches today.
- **Repo file defines `closureReview` but not `model`** -> whole-object replace
  drops the preset's `model` (and `enforce`/`maxFixRounds`), so `model` is unset
  and the guard passes (unconfigured -> inherit). Guard and skill still agree,
  because both read the same pi-merged view. The fix for an operator who wants the
  preset's model is to restate it in the repo block, not a per-leaf merge.
- **Malformed repo-local `.pi/settings.json`** (skill read-path) -> the reading
  agent emits one warning line in its response and falls back to the preset, per
  the shared reference. Mirrors specCouncil's existing malformed handling. This is
  agent-emitted prose, not an extension code path.
- **No conformance-reviewer dispatch at all** -> covered by the existing separate
  "conformance dispatch observed" guard; out of scope here, unchanged.

## Accepted limitations

- **Launch-cwd vs worktree divergence.** `pi.settings`'s project layer follows
  pi's launch cwd, not the worktree root. If a worktree's `.pi/settings.json`
  diverges from the launch checkout, the guard (launch-dir view) and the skills
  (worktree view via `git rev-parse`) can resolve different models. Because the
  mismatch path is a non-blocking WARN, this degrades to a spurious warning, never
  a false block. Edge case (worktree settings are committed from the same repo);
  documented, not fixed.
- **Fallback vs mistake indistinguishable.** By design; resolved by warning
  rather than blocking on mismatch.

## Testing approach

No extension test runner exists in this repo. `npm test` runs `scripts/ci.mjs`,
which validates: `package.json` version == CHANGELOG top heading; every
`skills/*` dir has a `SKILL.md` with parseable frontmatter; stale-placeholder
token scan; each `extensions/*.ts` type-parses via `node --experimental-strip-types
--check`; and `npm pack` dry-run contents. Verification is therefore:

- `node --experimental-strip-types --check extensions/phase-tracker.ts` to confirm
  the guard change parses (the same check `ci.mjs` runs; no `tsc`/devDeps are
  available, so a full type-check is out of reach).
- Hand-trace every row of the match-check table and the per-dispatch aggregation
  (missing -> BLOCK, mismatch -> WARN, ok -> pass, unset -> pass) against
  constructed dispatch entries, including a multi-entry `tasks` dispatch and the
  stash-then-prepend WARN delivery on the subagent `tool_result` branch.
- `npm test` (`scripts/ci.mjs`) to confirm the full invariant set holds after the
  CHANGELOG entry and the new reference file are added.
- Grep the four edited skill read-sites to confirm none still names
  `$PI_CODING_AGENT_DIR/settings.json` as the *sole* source for `closureReview`.

The spec does not claim automated guard-branch coverage, because none exists.

## Documentation impact

- **New:** `skills/verification-before-completion/reference/settings-precedence.md`
  (the artifact).
- `README.md` - document repo-local-first resolution for `closureReview`; and
  correct the `specCouncil` section, which currently frames rosters as per-preset
  only ("each pi profile reads its own settings.json") with no repo-first language.
- `AGENTS.md` - the conformance-reviewer paragraph states the model is injected
  from `closureReview.model`; update to state repo-first (whole-object) resolution and
  that the guard now match-checks (BLOCK on omission, WARN on mismatch).
- `CHANGELOG.md` - new `## vX.Y.Z` entry.

## Versioning

**Minor.** The guard gains a match-check/warn behavior and skills change their
resolution source; no settings-key rename, no package rename, no extension API
removal.
