# Explicit Extension Entrypoints

## Problem

pi-gauntlet v4.5.0 declares the entire `extensions/` directory as its Pi extension resource. Pi expands that directory into every top-level TypeScript or JavaScript file. Commit `7f67f5d` added `extensions/phase-tracker.test.ts` at the top level, so Pi attempts to load the test module as an extension and reports that it does not export a valid factory function.

The existing release checks pass because they validate syntax, execute tests, and inspect tarball presence, but do not verify that the Pi manifest resolves only to extension factory modules.

## Chosen design

Declare the three runtime factories explicitly in `package.json#pi.extensions`:

- `extensions/plan-tracker.ts`
- `extensions/phase-tracker.ts`
- `extensions/verify-before-ship.ts`

Tests and helper modules remain in the npm tarball and continue to run from the repository, but Pi no longer treats them as runtime entrypoints. Explicit entrypoints are preferred over filename-based exclusions because the runtime set is small, stable, and auditable; adding a future extension requires intentionally adding it to the manifest.

Update `scripts/ci.mjs` so manifest validation accepts the existing skills directory and explicit extension files, verifies every declared extension is a TypeScript or JavaScript file, and asserts the exact expected runtime entrypoint set. This regression check must fail if a test/helper is declared or a runtime factory is omitted.

## Alternatives rejected

- Move the test below `extensions/lib/`: this hides the current symptom but preserves accidental directory-wide discovery and allows the same regression with any future top-level helper.
- Add a manifest exclusion such as `!extensions/**/*.test.ts`: this remains permissive for unrelated top-level TypeScript helpers and makes the runtime boundary depend on naming conventions.
- Exclude tests from the npm tarball only: packaging size is not the root issue; Pi's runtime resource declaration is.

## Error handling and compatibility

No runtime extension behavior or settings contract changes. Existing Pi versions that support package manifests already accept file entries. The package remains installable from npm, and all three current extensions continue loading from their unchanged paths.

## Testing

- Add/adjust CI assertions so `package.json#pi.extensions` equals the three known runtime factory paths and every path resolves to a file with a supported extension.
- Run `npm test`.
- Inspect `npm pack --dry-run --json` to confirm runtime files and their imported helpers remain shipped.
- Install or point Pi at the packed/package worktree and confirm resource loading reports no attempt to load `phase-tracker.test.ts`.

## Release

Ship as patch release v4.5.1 because this restores package startup behavior without changing public configuration or extension contracts. Add a matching `CHANGELOG.md` section describing the v4.5.0 packaging regression and explicit-entrypoint fix, then use the repository release workflow.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` - release-visible regression and fix
- Derived / memory docs invalidated: none

The documentation assessment follows `skills/brainstorming/reference/documentation-impact.md`.

## Out of scope

- Renaming or relocating extension/test files.
- Changing Pi's package discovery behavior.
- Removing development tests or helpers from the npm tarball.
