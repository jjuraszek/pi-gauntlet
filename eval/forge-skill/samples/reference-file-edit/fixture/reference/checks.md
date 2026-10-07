# Checks

- tests: run the project's test command; pass when it exits 0.
- lint: run the project's lint command; pass when it reports zero offenses.
- changelog: pass when CHANGELOG.md has a new bullet under `## Unreleased`; you should consider skipping this for docs-only changes if appropriate.
- secrets: pass when `git diff main --stat` lists no file under `secrets/`.
