# Brainstorming scout: predecessor anchors from recorded modified files

**Goal:** Give the brainstorming scout the repo-relative paths each predecessor spec's ship modified, so the questionary opens the right files instead of rediscovering them.

**Ticket:** [#52](https://github.com/jjuraszek/pi-gauntlet/issues/52)

**Supersedes:** `doc/specs/2026-09-17-gh-34-spec-search-index.md`, scope: `files` column semantics (count -> path list) and its test.

## Problem

The run telemetry recorder (`extensions/lib/telemetry-ship.ts:9-16`, `extensions/telemetry.ts:655-661`) already writes `derived.modified_files` - a sorted list of repo-relative paths - into every shipped spec's record at `.pi/gauntlet/telemetry/<spec path with .md -> .yaml>`. The spec index (`bin/gauntlet-spec-index.mjs:178-191`) reads that list and emits only its length in the `files` column; nothing consumes the count. The scout in `skills/brainstorming/gatherer.md` names predecessor specs by topic but has no way to learn which files those predecessors touched, so the questionary starts recon from scratch.

Related but separate: #51 covers records that lack `modified_files` because the ship ran in a plain jj workspace. That is producer-side and out of scope here; this change must behave correctly whether such records exist or not.

## Acceptance criteria

Ticket #52, `Acceptance criteria`, rows verbatim:

- [ ] Fixture repo with `doc/specs/a.md` (run record `derived.modified_files: [src/x.ts, src/gone.ts]`; `src/x.ts` exists under the fixture root, `src/gone.ts` does not) and `doc/specs/b.md` (run record without `derived.modified_files`). Running `node bin/gauntlet-spec-index.mjs --query '<term matching both>'` from the fixture root prints a `files` cell of exactly `src/x.ts` for `a.md` and exactly `missing` for `b.md`; a record whose every path is gone prints an empty cell. Covered by a unit test in `bin/gauntlet-spec-index.test.mjs`; existing tests pass, with any assertion on the old count updated to the new cell.
  in-scope
- [ ] `skills/brainstorming/gatherer.md` scout prompt states, in this order: emit a `Predecessor anchors` section after the `Predecessor:` lines only when at least one predecessor is named; list each path once, attributed to the first predecessor (index output order) whose cell lists it; one `<spec>: modified file list missing for this spec` line per named predecessor whose cell is `missing`; the existing sentence `Judge by topic; shared file paths never decide.` is retained. Verified by reading the prompt and by one recorded scout run on a repo with two predecessors sharing a path (handoff pasted in the PR) showing the path once.
  deviates: this repo ships to `main` via `/skill:release` with no PR; the recorded scout handoff is posted as a comment on #52 instead (user-authorized tracker write). Everything else in the row is in scope and restated in Design.
- [ ] `README.md#spec-search-index` documents the `files` column as a `;`-separated list of still-present paths, or `missing`.
  in-scope

## Design

### Producer: `bin/gauntlet-spec-index.mjs`

`telemetry(root, specPath)` keeps its signature and its per-row call site in `main()` (one YAML read per result row, no memoization). Its `files` field changes from a number-or-null to a string, resolved in one pass:

| Record state | `files` cell |
|---|---|
| No YAML at `.pi/gauntlet/telemetry/<spec>.yaml` | `""` |
| YAML fails to parse | `""` (existing `gauntlet-spec-index: warning: unreadable telemetry <path>` on stderr stays; exit 0) |
| YAML parses to a non-object (empty file -> `null`, bare scalar, top-level array) | `""` (the existing `!rec || typeof rec !== "object"` guard stays) |
| Record is an object, `derived.modified_files` absent or not an array | `missing` |
| Array present | string entries for which `fs.existsSync(path.join(root, p))` is true, joined with `;` in recorded order; empty after filtering -> `""` |

Rules:

- The distinction between blank and `missing` is deliberate: blank means "no data" (pre-telemetry spec, unreadable record, or nothing left to open); `missing` means "a record exists without the list" - an in-progress or abandoned record that never shipped, or a shipped record whose list was not derived (the #51 plain-jj shape).
- Non-string entries are dropped silently. A key present with a non-array value (string, object) is `missing`.
- `root` is the repository root the bin already resolves (`git rev-parse --show-toplevel` via `repoRoot()`), not the process cwd. Existence is `existsSync` only - no git lookup, no rename tracing; directories count if they exist. A renamed file drops out.
- Duplicates within one record are emitted as recorded.
- `;` is the separator. The `files` cell bypasses `cell()`'s whitespace collapse: only tabs and newlines (the column and row delimiters) are replaced, so a path with repeated spaces survives intact and two distinct filenames cannot merge into one anchor. Eight-column tab-separated framing is unchanged. A path containing `;` is not guarded (out of scope; the recorder derives from `git diff --name-only` and this repo has none).
- Always on. No flag, no extra column, no change to `--query`/`--limit`, SQLite schema, cache freshness, or ranking. The telemetry directory stays the hardcoded default; settings-awareness is not requested.
- The row emitter keeps `files` between `shipped_at` and the snippet; its only change is the whitespace rule above.
- The bin is plain source, not an esbuild bundle (`scripts/build-bins.mjs` covers only salvage and performance); no `npm run build:bins` step.

### Consumer: scout template in `skills/brainstorming/gatherer.md`

Add one instruction block to the scout task template directly after the sentence `Judge by topic; shared file paths never decide.`, so selection and anchoring read as one rule. That sentence is retained verbatim and joined onto one source line (it currently wraps across two blockquote lines, which defeats a literal grep). AC row 2's "in this order" governs the three anchor clauses (section rule, once/attribution, missing line); its fourth item is a retention constraint, not a position, and the retained sentence sits immediately before the block. The block states, in this order:

1. The `files` column of each candidate row is the `;`-separated list of repo-relative paths that predecessor's ship modified and that still exist, or the literal `missing`, or blank. Do not recompute it from git or telemetry.
2. After the `Predecessor:` line(s), and only when at least one predecessor is named, render a `Predecessor anchors` section.
3. List every attributed path exactly once, attributed to the first named predecessor in index output order whose cell lists it. No per-path commentary; bookkeeping paths such as `CHANGELOG.md` are listed like any other.
4. For each named predecessor whose cell is `missing`, write one line `<spec>: modified file list missing for this spec`, where `<spec>` is the spec path exactly as written in its `Predecessor:` line.
5. A blank cell contributes nothing for that spec. A named predecessor with no index row at all (reached by following a supersession banner, or named from the directory-listing fallback when the index command failed) contributes no path and no `missing` line.
6. When no path and no `missing` line results - including whenever the index was unavailable - omit the section entirely. `Predecessor: none` produces no anchors section.

This is a prompt-only change; pi-cohort's `scout` persona is untouched, matching how the predecessor check itself is specified today. The anchors are a recon hint, never a selection input.

### Data flow

Recorder writes `derived.modified_files` at ship -> bin filters and joins at query time -> scout reads the column from stdout -> handoff carries `Predecessor anchors` -> questionary opens those files. No new artifact; the telemetry record stays the single owner of the list.

### Out of scope

- Paths as a search or ranking signal.
- A count of dropped (stale) paths or a distinct `stale` marker.
- Populating `modified_files` in plain jj workspaces (#51).
- Honouring a non-default `telemetry.dir` in the bin.
- Guarding `;` inside a path.

## Tests

In `bin/gauntlet-spec-index.test.mjs`, test 6 changes in two places: its `[x, y]` record no longer asserts `"2"` (neither path exists in the fixture, so the cell is `""` unless the test creates them), and its `status: in_progress` record without a list flips from `""` to `missing`. A new test builds AC row 1's fixture literally - root-level `doc/specs/a.md` with record `[src/x.ts, src/gone.ts]` and `src/x.ts` created under the fixture root, root-level `doc/specs/b.md` with a record and no list (the shared `repo()` helper puts `b.md` under `svc-a/`, so this test builds its own) - and asserts both cells from one `--query` run. The following cases hold across the suite, with the DB-unchanged assertion retained and eight-column framing verified with a `;` cell:

| Fixture | Expected cell |
|---|---|
| `[src/x.ts, src/gone.ts]`, only `src/x.ts` exists | `src/x.ts` |
| two recorded paths, both exist | `a.js;b.js` in recorded order |
| a recorded path with repeated spaces, exists | emitted intact, spaces preserved |
| all recorded paths deleted | `""` |
| record without `modified_files` | `missing` |
| `modified_files: "x"` (non-array) | `missing` |
| YAML parses to `null` (empty file) | `""` |
| no record | `""` |
| malformed YAML | `""` plus the existing warning |

`npm test` (`scripts/ci.mjs`) runs the bin tests. The stage-skill lint does not check prompt wording, so `scripts/ci.mjs`'s existing presence table for `skills/brainstorming/gatherer.md` gains three rows: `Predecessor anchors`, `modified file list missing for this spec`, and the single-line `Judge by topic; shared file paths never decide.`.

### Evidence for the recorded scout run

A gather run through the installed `/skill:brainstorming` would load the installed package's template and bin, not this worktree's, so the evidence run is dispatched by hand after implementation: `subagent({ agent: "scout", cwd: <worktree>, task: <the worktree's edited scout template, pasted verbatim, with <SPEC_INDEX> = <worktree>/bin/gauntlet-spec-index.mjs> })` for a request whose index rows include two telemetry-bearing specs with lists sharing a path (every record with a list in this repo contains `CHANGELOG.md`; a request about telemetry recording surfaces several). If the scout names fewer than two predecessors, pick another request and rerun. The resulting handoff, showing the shared path once under `Predecessor anchors`, is posted at finish time with `gh issue comment 52 --body-file <handoff>` (user-authorized in the questionary).

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` "Spec search index" - the paragraph only enumerates column names today, so it gains one sentence glossing `files`: a `;`-separated list of repo-relative paths still present in the repo, or `missing` when the record has no list, or blank when there is no readable record or no path remains; `CHANGELOG.md` `## Unreleased` entry
- Derived / memory docs invalidated: none (the AGENTS.md routing row for the spec index points at README, which is amended)

Categories per `reference/documentation-impact.md`. `gatherer.md` is implementation surface, not a doc-impact entry. The #34 spec receives a supersession banner with scope `files column semantics`.

## Open questions

none
