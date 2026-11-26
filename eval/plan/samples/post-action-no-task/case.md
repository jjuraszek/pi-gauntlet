bundle-: skills/gauntlet/plan/plan.md
Evaluate the plan contract's coverage decision with the approved spec and repository observations below. Produce only the complete plan Markdown that the plan-writer would write, not the parent's dispatch or the persona's status reply. This is a text-only contract exercise: use the supplied observations, make no live-tool or file-write claims, and stop after the plan. Keep the response under 900 words.

Home: /workspace/project. Spec: /workspace/project/doc/specs/scan.md. Plan: /workspace/project/doc/plans/scan.md. Installed commit wording reference for all tasks: /opt/skills/gauntlet/commit-message.md. Ticket: none.

Observed state:
- No plan exists. HEAD is abc1234 and status is clean. There are no additional overrides or legs. The full verification entrypoint is npm test, with no happy-path command.
- src/scan.mjs currently counts every line in records.txt, including blank lines. scripts/release.mjs currently writes only the release title into a pull-request body. CHANGELOG.md has a Release notes section that the script can read; no changelog edit is needed.
- tests/scan.test.mjs and tests/release.test.mjs exist. Extend these tests for the specified behaviors. The commands node --test tests/scan.test.mjs and node --test tests/release.test.mjs each exit 0 at abc1234 with 2 passing tests, 0 failures, no artifacts and no working-tree or HEAD changes. The scan test reads local fixtures without using an external service.
- Source inspection confirms these facts. Use the supplied measured baselines. The parent owns stamping and task initialization.
- Use the plan header's --- separator before the first wave. Use the same exact anchors in the coverage table and the owning task's Spec line: Design L4 and Acceptance criteria L8-L9 for the scanner, Design L5 for the release script. Line numbers are citation aids, not file content.

Approved spec:
```text
1 # Scan records and publish release notes
2
3 ## Design
4 Ignore blank lines when counting records.
5 The release script writes the changelog section into the pull request body.
6
7 ## Acceptance criteria
8 - [ ] The scanner reports `EMPTY` for an input with no records, after which the operator runs `release-audit --live` on staging.
9   in-scope
10
11 ## Integration
12 - before merge - requester: confirm the vendor shipped the fix; done when the vendor's release notes list it
13 - before deploy to staging - operator: drain the queue; done when the queue length reads 0
14 - `not stated` - operator: run the cutover; done when `not stated`
15 - after merge - person merging: tag the release; done when the tag exists
16 - after deploy to staging - operator: log in through the real identity provider; done when the login succeeds
17 - after deploy to production - operator: compare the order total; done when it equals the total read before the deploy
18 - after which the operator runs `release-audit --live` on staging.
```
