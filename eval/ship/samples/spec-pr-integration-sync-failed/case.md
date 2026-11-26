bundle-: skills/gauntlet/ship/verification-set.md
bundle-: skills/gauntlet/commit-message.md
bundle-: skills/gauntlet-resume/reference/restore-loop.md
bundle-: skills/gauntlet-resume/reference/coordinated.md
bundle+: skills/gauntlet/ship/spec-pr.md

At the home PR body edit in Push rows 1/2, a header-linked draft PR is open at acme/widget#42. The user picked row 1. Sealing and the push succeeded. The selected spec is `doc/specs/export.md`. The body read succeeded, and the spec's `## Integration` section differs from the body's. The attempted `gh pr edit 42 -R acme/widget --body-file -` failed with `HTTP 503`; the existing body is unchanged. The spec and checkout are intact. The ready command, if issued, succeeds.

Show the user-visible output and any command you would issue next, in order, from the edit result through the selected readiness action or stop. Do not execute commands.
