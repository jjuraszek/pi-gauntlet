```file SKILL.md
---
name: release-notes
description: Use when asked to draft release notes from a merged changelog section.
---

# Release Notes

## Overview

Turn the top `## Unreleased` section of CHANGELOG.md into a release-notes paragraph for the tag message.

## Edit procedure

1. Read CHANGELOG.md in full.
2. Copy every bullet under `## Unreleased` into a scratch list.
3. Group the bullets by their bold lead phrase.
4. Write one sentence per group, present tense, naming the user-visible change.
5. Drop every bullet that names only an internal refactor.
6. Join the sentences into one paragraph of at most 120 words.
7. Read the paragraph back against the bullets; every bullet is covered or dropped in step 5.
8. Print the paragraph and stop.

## Rules

- Present tense.
- Name the observable behavior, never the file that changed.
- One paragraph; no headings, no bullets.
- ASCII punctuation.
- Keep the changelog's terms for user-visible features.

## Red flags

- A sentence that names a path.
- A paragraph over 120 words.
- A dropped bullet that names a user-visible change.
- A claim that has no matching changelog bullet.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it and apply its `## conventions` section.
```
```request
Step 6 caps the paragraph at 120 words and the Red Flags list restates that cap. Change the cap to 80 words in both places; nothing else changes.
```
