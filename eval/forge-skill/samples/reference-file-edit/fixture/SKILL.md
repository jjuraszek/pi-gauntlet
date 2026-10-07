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
