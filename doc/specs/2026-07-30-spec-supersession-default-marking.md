# Spec supersession: shipped default marking of predecessor specs

**Issue:** jjuraszek/pi-gauntlet#4 (post-roast adjudication, with one delta - see [Relation to issue #4](#relation-to-issue-4)).
**Goal:** backward navigation - a reader who opens a superseded spec sees, at the top of the file, that it is superseded and where the successor lives. Nothing more: no machine-parseable graph, no parser, no CI validation, no currentness catalog.

## Problem

When a new spec replaces a prior design, nothing directs the author to mark the *predecessor*. Forward references ("this supersedes X" in the new spec) happen unprompted, but a reader who lands on the OLD spec sees nothing and designs against stale decisions. Issue #4's adjudicated fix routes the marker *format* entirely to `.pi/gauntlet-overrides.md` - which means gauntlet does not work out of the box: a consumer with no overrides file gets an instruction with no format. Gauntlet must ship a working default; overrides may replace it.

## Decision summary

| Decision | Value |
|---|---|
| Marker location | After the title line of the OLD (superseded) spec: title, blank line, banner block |
| Default format | Blockquote banner, one line per successor (below) |
| Trigger | Event-driven only: brainstorming spec-writing (checklist step 7), when the author already knows a prior spec is replaced. The questionary asks once whether the design replaces a prior spec; never search, sweep, or audit |
| Scope values | `fully`, or named section(s) for partial supersession |
| Multiplicity | Append-only; one old spec may accumulate banners from multiple successors |
| Chain policy | No transitive rewrite - A points at B even after B is superseded by C; the reader hops |
| Retention default | Mark, never delete; delete/archive policy is consumer territory via overrides |
| Coverage semantics | Unmarked does NOT mean current; marked does NOT mean dead (partial supersession leaves live sections) |
| Aggregation | None - no promotion of accumulated partial banners to `fully`; that is a sweep in disguise |
| Cross-service predecessors | Out of scope - flag in the new spec's Open Questions instead of editing outside the write grant |
| Configuration | No new settings key. Overridable via the existing Project overrides block: the marker line's **syntax** only. Fixed semantics regardless of override: placement, append-only, no transitive rewrite, mark-never-delete. A syntax override must also restate the scout guidance (see Changes 2) |

## Default banner format

Inserted after the title line of the superseded spec - literal layout: title line, blank line, banner block:

```markdown
> **Superseded by:** [<repo-relative path to successor>](<href relative to THIS file>) - <scope>
```

- **Label vs href**: the visible label is the successor's repo-relative path (unambiguous in multi-spec-dir repos); the href is computed relative to the predecessor's own directory, because Markdown resolves relative links from the containing file. Same-directory: `[doc/specs/B.md](./B.md)`. Cross-directory: `[services/x/doc/specs/B.md](../../services/x/doc/specs/B.md)` (the real relative walk).
- `<scope>` is the value after the ` - ` separator: `fully`, or the named superseded section(s). The scope value itself carries no leading dash.
- Worked examples - full, partial, and the two-successor stack that append-only accumulation produces:

  ```markdown
  > **Superseded by:** [doc/specs/2026-08-01-new-design.md](./2026-08-01-new-design.md) - fully
  ```

  ```markdown
  > **Superseded by:** [doc/specs/2026-08-01-new-design.md](./2026-08-01-new-design.md) - "Settings resolution" section only
  > **Superseded by:** [doc/specs/2026-09-14-other-rework.md](./2026-09-14-other-rework.md) - "Error handling" section only
  ```

- New banners append below **any** existing supersession lines, formatted or free-form prose (e.g. this repo's `> **superseded in part** ...` note in `doc/specs/2026-06-17-gauntlet-flow-guards.md:3` stays; the banner goes below it). No migration, no dedup.
- Greppable anchor: `^> \*\*Superseded` - a convention, not a precise detector: fenced documentation examples (including this spec and the new SKILL.md subsection) self-match, and that is accepted. Frontmatter was rejected on the verified ground: gauntlet has no YAML parser anywhere (`extensions/` has none; `scripts/ci.mjs:112-134` validates only skill/agent frontmatter shape), so a frontmatter contract would demand new parsing machinery for zero runtime consumers.

## Changes

### 1. `skills/brainstorming/SKILL.md` - eight surgical insertions, no restructuring

1. **Checklist step 7**: one added sentence - after writing the spec, mark any known superseded predecessor(s) per the new subsection (anchor link), at the exact-order position defined in insertion 5.
2. **New subsection "Marking superseded specs"**, placed immediately after [Filename Convention], ~15 lines: banner format verbatim as a code block (label/href rule included); trigger condition (author already knows - never search); placement rule (title, blank line, banner block); scope rule; append-only + multiple-successors rule (below any existing supersession lines, formatted or prose); no-transitive-rewrite rule; mark-never-delete default; coverage-limits sentence (unmarked != current - code drift, abandoned designs, and partial ships produce no successor spec); cross-service out-of-scope rule; the override contract (syntax overridable via Project overrides, placement/append-only/no-transitive-rewrite/mark-never-delete fixed; a syntax override must also restate the scout guidance). Dense imperative prose, one rule per line, whole contract readable in one screen.
3. **HARD CONSTRAINT carve-out**: the "You may" list gains editing a predecessor spec in the project's spec directory (per Project Routing) to add the supersession banner, naming the target explicitly: the `edit`-prohibition at spec-writing binds the spec being written, not a predecessor file.
4. **Questionary guidance** ("Understand the idea"): one sentence - ask once whether the design replaces a prior spec, fully or in part, so the supersession event is captured before step 7 instead of relying on the author volunteering it.
5. **Spec self-review "exact order"**: a new step 4 - after the line-1 draft-marker check and before the inline lint, `edit` any known predecessor spec to insert the banner. This pins the predecessor edit's position so it can never slot between the write and the marker check.
6. **Spec self-review lint**: the internal-consistency bullet gains a clause - if the spec replaces a prior design, confirm the predecessor carries the banner and its href resolves to the spec's final filename (covers the slug-rename case: the banner is written after any rename).
7. **User Review Gate commit**: the unconditional gate commit stages the predecessor edit alongside the spec, and the gate's change-request path reconciles the predecessor banner whenever the new spec is renamed, materially revised, or dropped.
8. **Red Flags**: one new line - "About to finish spec-writing for a replacement design without marking the known predecessor."

### 2. `skills/brainstorming/gatherer.md` - one sentence in the scout task template

> If a spec you cite carries a supersession marker (default: a `> **Superseded by:**` banner; the project's overrides may define another format), follow the successor for the superseded scope and cite it instead; cite the old spec only for its unsuperseded sections.

No hard filter excluding banner-carrying specs from gathering - partial supersession makes exclusion wrong.

### 3. `README.md`

Document the shipped default supersession marking under the brainstorming skill's description; note that overrides may replace the format. No config-table row (no settings key).

### 4. `CHANGELOG.md`

Minor entry: new default behavior in an existing skill.

## Flow walk-through

New spec B supersedes old spec A's "Settings resolution" section:

1. Questionary/gather surfaces the fact that B replaces part of A (the only discovery mechanism).
2. Step 7, in the worktree: `write` B at its spec path (unchanged mechanics), confirm line 1 is no longer the draft marker, then `edit` A to insert the banner after its title line (exact-order step 4). Existing supersession lines on A, formatted or prose: append below.
3. Lint confirms the banner exists and its href resolves to B's final filename.
4. Critique/council/summarizer see only B; A's edit is inert to them.
5. The unconditional gate commit stages both files (B new, A modified) - insertion 7 makes this explicit.
6. The squash lands B and A's banner on `main` atomically with the implementation. Abandoned worktree = no banner ever reaches `main`.
7. Any later reader - human, scout, or `grep -rl '^> \*\*Superseded'` - opens A and is redirected at line 3.

The user-gate revert valve: both files are committed on the worktree branch only; nothing reaches `main` until approval and the squash. Any change request that renames, materially revises, or drops B also reconciles A's banner before recommitting and re-presenting (insertion 7).

## Edge cases

- **Predecessor in another service's spec dir**: out of scope; flag in the new spec's Open Questions.
- **Cited predecessor path does not exist**: the step-7 edit fails naturally; resolve the real path or record an open question. No fallback logic.
- **Existing prose "Superseded" note in a consumer corpus**: the banner appends below it; prose stays; no migration, no dedup.
- **Self-supersession** (spec revised in place): no banner; supersession is between files.
- **No backfill**: gauntlet's own 20-spec corpus and consumer corpora keep their free-form prose until an actual future spec supersedes them.

## Explicitly rejected

- Frontmatter `superseded_by:` lists on the NEW spec (forward-only reproduces the measured failure - 87/358 consumer specs already mark forward, essentially none backward; and frontmatter greps worse than the banner).
- Any sweep, audit, aggregation, or housekeeping step over historical specs.
- A parser, CI check, or runtime consumer of supersession data.
- Fusing the marker into `## Documentation impact` (those entries become plan tasks + conformance requirements; the marker is done at step 7, before any plan exists, and is a property of the spec corpus, not the implementation).
- Transitive rewriting of chains.

## Relation to issue #4

The issue's post-roast acceptance criteria, verbatim:

1. Step-7 `brainstorming` instruction to mark a known superseded predecessor: repo-relative path, section scope when partial.
2. Format-free; marker syntax routes to `.pi/gauntlet-overrides.md`.
3. Gauntlet marks, never decides mark-vs-delete; both route to overrides.
4. Red Flag: about to write a replacement spec without marking the predecessor.
5. Amend the `edit` carve-out (`SKILL.md:137-138`) to sanction the predecessor-marker edit.
6. Widen the singular `doc/specs/` write grant or declare cross-service marking out of scope.
7. Coverage limits named in the skill body.
8. Skill stays generic; no hardcoded `doc/specs`; resolve via Project Routing.
9. No new settings key.
10. README + CHANGELOG updated.

This spec implements them with exactly one delta: **AC 2** flips from "format-free; marker syntax routes to overrides" to "gauntlet ships the blockquote-banner default; overrides may replace the syntax". Rationale: out-of-the-box operation with zero configuration. All other ACs stand as written (AC 6 resolved as: cross-service marking out of scope). At ship time, `finishing-a-development-branch` closes issue #4 with a comment citing the landed commit and this delta.

## Testing

Prose-only change; no executable surface.

- `npm test` (`scripts/ci.mjs`) passes - body edits don't touch validated frontmatter.
- Genericity grep (AGENTS.md) stays at zero matches - the subsection uses placeholder paths only.
- Conformance gate verifies the shipped edits against this spec per requirement (eight SKILL.md sites, gatherer.md line, README, CHANGELOG).
- Link check: each worked example's href resolves from its hypothetical predecessor's directory (manual, one-time - no CI machinery).
- Live proof: the next replacement spec in this repo exercises the mechanic.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (default supersession marking, override note), `CHANGELOG.md` (minor entry)
- Derived / memory docs invalidated: none

`skills/brainstorming/SKILL.md` and `gatherer.md` are the implementation surface, not doc-impact entries.

## Semver

Minor - new default behavior in an existing skill; no rename, no breaking schema.
