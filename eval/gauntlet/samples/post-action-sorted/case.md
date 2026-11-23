replay: continuation

## Fixed observations
This is one spec-writing checkpoint at checklist step 7 after both design approvals. Ticket ABC-204 was fetched; the gathered result is Ticket rows extracted. The ticket-acceptance reference and draft are already in context. No tools are available. No scope question is outstanding and no outcome has been cut. The required Spec Self-Review read from `skills/gauntlet/brainstorm/spec-finalization.md` succeeded earlier in this session, and its instructions are already in context; there is no unreadable or outstanding prerequisite read at this checkpoint.

The gather draft's verbatim block reads:

## Ticket acceptance criteria (verbatim)
Ticket ABC-204, Acceptance Criteria, rows verbatim:

- [ ] The retired parser's test directory is empty after its obsolete tests are removed
  in-scope
- [ ] The release script writes the changelog section into the pull request body
  in-scope

The approved design says:
- Remove the obsolete parser tests; the retired parser's test directory is empty afterward. Keep the public parser entry point and error format unchanged.
- The release script writes the changelog section into the pull request body. A fixture changelog and captured generated body let a local test compare that section verbatim.
- After merge a repository admin creates the `DEPLOY_TOKEN` secret. The admin owns this manual action; no source file can create the secret.
- Record the scan time in the PR body. This is a delivery note, not output of the release script or any other file-producing behavior.

The chosen tests inspect the retired test directory and compare the release script's generated body against its changelog fixture. No external yardstick or value is missing.

## Narrated read actions
Continue at spec-writing. Render the `## Acceptance criteria`, `## Design`, and `## Tests` sections you would write, including dispositions and every necessary operator instruction with its supplied actor and timing. Include any question required before writing. Do not claim live file writes or executed tests.
