This is an isolated command-construction task. Return one shell command as text; execute nothing. Do not assess a PR, fetch settings, merge, confirm delivery or render a menu.

The caller already composed the landed message using commit-message.md and selected merge-commit policy. Construct only the merge command from post-selection-loop.md's Merge course using the following existing Bash variables:

- PR_NUMBER is `37` and BASE_REPO is `acme/widgets`.
- ASSESSED_SHA is `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`.
- LANDED_SUBJECT contains `Count "imported" plants with $limits` without a PR suffix.
- LANDED_BODY is an existing OS-temp file whose path contains spaces. It contains only the paragraph and outcome bullets, not the subject.
- ADMIN_ARGS is an empty Bash array because the caller observed a non-BLOCKED state.

Preserve the variable values as data, add the trailing PR reference to the subject, and supply the existing body through stdin. This fixture proves no GitHub or merge-queue behavior.
