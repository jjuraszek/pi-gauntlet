```file SKILL.md
---
name: pr-checklist
description: Use before opening a pull request to run the project's pre-merge checks.
---

# PR Checklist

## Overview

Run the checks and report each as pass or fail.

## Procedure

1. Read `reference/checks.md` now.
2. Run every check it lists, in order.
3. Report one line per check: `<name>: pass|fail - <evidence>`.
4. Stop. The reviewer decides.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it and apply its `## conventions` section.
```
```file reference/checks.md
# Checks

- tests: run the project's test command; pass when it exits 0.
- lint: run the project's lint command; pass when it reports zero offenses.
- changelog: pass when CHANGELOG.md has a new bullet under `## Unreleased`; you should consider skipping this for docs-only changes if appropriate.
- secrets: pass when `git diff main --stat` lists no file under `secrets/`.
```
```request
Tighten the changelog check: a docs-only change (every changed path ends in .md) passes without a bullet; every other change needs the bullet. Keep the other checks as they are.
```
