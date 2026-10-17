---
name: gauntlet-performance
description: Use when a human asks how gauntlet runs perform across the recorded telemetry - explicit invocation only (/skill:gauntlet-performance [--dir <path>]... [--since <version>]).
disable-model-invocation: true
---

# Gauntlet Performance

The CLI parses and aggregates; you reason. Never open a telemetry YAML record yourself.

## Run the digest

1. Resolve the CLI: `<directory of this SKILL.md>/../../bin/gauntlet-performance.mjs`.
2. Run it from the repo root, passing the user's `--dir` and `--since` arguments verbatim:
   `node <bin>/gauntlet-performance.mjs [--dir <path>]... [--since <version>]`.
   Default corpus is the current repo; each `--dir` adds a repo root or a telemetry dir.
3. If the command is missing or the output contains `no records found`, relay that line and stop - no menu.

## Read the digest

`runs` has one row per record; `shipped*` marks a truncated run (no ship phase recorded - an older salvage stamped it at landing; its `wall` is `-` and it feeds no aggregate). `by version` groups by pi-gauntlet version: `n` counts every row, `shipped` counts the rows behind the p50/max columns. `grants` is `fix_round_grants` - the fix-round proxy (human-granted extra review rounds); schema 1 has no code-review round count. Read `council` by roster: counts are blocker/major/minor, `uniq_appl_nonminor/run` counts unique-and-applied blocker/major findings per run, and `chair:` summarizes synthesis and retries. Read severity as the chair's consolidated severity (the highest any co-raiser assigned), not the member's own. A roster with fewer than five runs is not assessed, and older records can have no council data.

## Reply - exactly this, in this order

1. **Recommendation** (2-4 sentences). One claim, led by the run that exemplifies it: quote its `spec` slug, `run_id`, and the 1-3 numbers that carry the claim. When `grants` is the evidence, call it the fix-round proxy. If no version group has `shipped >= 2`, the recommendation is "sample too small" with the `n`/`shipped` counts per version.
2. **Cornerstones**: 3-5 bullets of aggregate facts from `by version` - corpus size, truncated count, the p50s and model tallies that moved between versions.
3. **Council assessment**: Render this block independently of the version sample gate, even when item 1 says "sample too small". If the digest prints `no council data in selected records`, render only `council: no data`. If the most recent roster has fewer than 5 runs, render only `council: <roster> - not enough runs to assess (N of 5)`. Otherwise render one line per `flag:` of the most recent roster as the roster-change recommendations; when an older roster exists, add one line comparing the two rosters' `uniq_appl_nonminor/run` and rejected share as groups. Compare rosters as groups, never a member across rosters.
4. **Menu**, numbered, at most 3 items, rendered exactly as:
   - `1. render report` - ask for a target path; write markdown there: the digest verbatim, then the recommendation and cornerstones above. If the file exists, ask before overwriting. Write nothing unless this item is chosen.
   - `2. open recommendation as ticket` - hand the claim and its numbers to `/skill:shape-ticket`; never create a ticket directly.
   - `3. drill into <slug>` - re-run the CLI with `--json` and show that run's fields.

Nothing else: no preamble, no restated digest, no file written before item 1 is chosen.

## Project overrides

If a gauntlet overrides file exists - checked in order:
`.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`,
`<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read
and apply `## conventions` whenever present, without a relevance
judgment.
Give this skill's named section precedence over conflicting
`## conventions` rules. Use other relevant sections - by name match,
by topic (routing,
verification, worktrees, etc.), or by workflow convention - to override or
extend the instructions above. Project-local `AGENTS.md` is already in
context - check it for project-specific routing tables, service paths, and
verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
