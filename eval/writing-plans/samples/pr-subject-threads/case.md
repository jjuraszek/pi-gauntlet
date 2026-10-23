bundle+: skills/writing-plans/SKILL.md
bundle+: skills/verification-before-completion/SKILL.md

# Input

Act as the plan-writer describing the plan's task structure and header, then describe the verify-phase commands and evidence. Do not dispatch tools or claim commands actually ran. Stay under 950 words.

Approved spec doc/specs/retry.md contains:

## Rework record

PR: example/widgets#42 - Preserve retry behavior
Pre-rework head: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
Base: main @ bbbbbbb - merge: unresolved - src/retry.mjs
Keeps: original commits and retry API
Changes: repair timeout and delay handling
Dropped claims: none
Threads:
- src/retry.mjs:12 THREAD_timeout - fix
- src/delay.mjs:8 THREAD_delay - fix
- src/retry.mjs:30 THREAD_metrics - keep open
- src/delay.mjs:20 THREAD_rewrite - decline: rewriting the API is out of scope
Scoped tests: none run

Design opens with merge origin/main and resolve src/retry.mjs. THREAD_timeout requests retaining the timeout across retries, exercised through retryRequest(); THREAD_delay requests clamping negative delay, exercised through retryDelay(). Existing tests are tests/retry.test.mjs and tests/delay.test.mjs. Scoped commands are node --test tests/retry.test.mjs and node --test tests/delay.test.mjs. Both pass at base 702a851 with tests executed; the clean-worktree and post-run provenance checks pass. The merge task can use tests/retry.test.mjs read-only. Later tasks modifying the same source run in later waves. Existing checker grammar, baseline evidence and Spec coverage still apply.

The overrides document npm run lint and npm run format:check as lint/format commands and npm test as the full suite. The PR-subject flow must not run npm test. State the header without copying either task test command into it; name the union used at verify, not just the header.

Also give a no-style subcase: same record, tasks and scoped commands, but no documented lint or format commands. State the exact header and explain what runs at verify and what the sentinel means. Finally state what verification an ordinary ticket/free-text spec without ## Rework record uses, even if its branch already has an open PR. Preserve freshness, conformance and phase gates in all cases.
