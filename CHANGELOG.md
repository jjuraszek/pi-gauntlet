# Changelog

## v0.1.1 — 2026-05-28

- Drop `peerDependencies` from `package.json`. The relationship is informational only — pi loads this package via its own package manager (not via `require()` / `import`) so npm's peer-dep auto-install pulled ~138 transitive packages with no runtime benefit. The host requirement is still documented in `README.md` and `AGENTS.md`. `npm install` now does effectively zero work (just runs `postinstall` to relink agents).

## v0.1.0 — 2026-05-28

Initial extraction from `gridstrong/.pi/` of the obra/superpowers-inspired workflow framework.

Includes 13 skills, 3 agents (implementer, code-reviewer, spec-reviewer), 2 extensions (plan-tracker, verify-before-ship).
