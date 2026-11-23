Evaluate the plan contract's coverage decision with the approved spec and repository observations below. Produce the plan Markdown that the plan-writer would write, not the parent's dispatch or the persona's status reply. This is a text-only contract exercise: use the supplied observations, make no live-tool or file-write claims, and stop after the plan. Keep the response under 900 words.

Home: /workspace/project. Spec: /workspace/project/doc/specs/scan.md. Plan: /workspace/project/doc/plans/scan.md.

Observed state:
- No plan exists. HEAD is abc1234 and status is clean. There are no additional overrides or legs. The full verification entrypoint is npm test, with no happy-path command.
- src/scan.mjs currently counts every line in records.txt, including blank lines. scripts/release.mjs currently writes only the release title into a pull-request body. CHANGELOG.md has a Release notes section that the script can read; no changelog edit is needed.
- tests/scan.test.mjs and tests/release.test.mjs exist. Extend these tests for the specified behaviors. The commands node --test tests/scan.test.mjs and node --test tests/release.test.mjs each exit 0 at abc1234 with 2 passing tests, 0 failures, no artifacts and no working-tree or HEAD changes. The scan test enumerates the full tracked tree without using an external service.
- Source inspection confirms these facts. Use the supplied measured baselines. Task grouping is up to the plan contract. The parent owns stamping and task initialization.
- Include the Spec coverage table. For each task and coverage row, use the relevant exact heading and line range from the numbered spec below. Line numbers are citation aids, not file content.

Approved spec:
```text
1 # Scan records and publish release notes
2
3 ## Design
4 Ignore blank lines in `records.txt` when counting records in `src/scan.mjs`.
5 The release script `scripts/release.mjs` writes the changelog section into the pull request body.
6 **Post-deployment housekeeping.** After merge, a repository admin creates the `DEPLOY_TOKEN` secret.
7
8 ## Acceptance criteria
9 - [ ] `node --test tests/scan.test.mjs` passes over the full tracked tree, in its venue: the `slow` job on the PR head.
10   in-scope
11
12 ## Tests
13 Blank-line counting - `tests/scan.test.mjs`.
14 Changelog section rendering - `tests/release.test.mjs`.
```
