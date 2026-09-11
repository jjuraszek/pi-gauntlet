# pi-gauntlet overrides (pi-gauntlet)

Read by pi-gauntlet skills through their "Project overrides" hook. Sections below override or extend the matching skill instructions for this repo.

## Issue tracker

- tracker: github
- repo: jjuraszek/pi-gauntlet
- refs: `#N` in commit bodies and CHANGELOG entries; `(#N)` trailing in CHANGELOG bullets

Write-gate carve-out: a user instruction that names the write ("close #12 with a comment", "comment the changelog on #12") is the confirmation - execute, then report. Agent-initiated bodies and comments keep the package confirm gate. Status changes (`gh issue close/reopen`) are announced, not gated.

## Release (any skill that ships)

`/skill:release` is the only ship path; there is no PR gate on `main`. A user instruction naming the level (`release patch`) authorizes the whole run - `release.sh <level>` through `verify` - with no proposal step and no re-confirmation. Follow-ups bundled in the same instruction (close a ticket, post the CHANGELOG section as a comment) run after `verify` prints the version.
