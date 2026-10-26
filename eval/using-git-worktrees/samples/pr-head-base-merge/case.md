bundle+: skills/using-git-worktrees/reference/pr-head.md

# PR-head base-merge outcomes

These are independent synthetic runs after successful provisioning, not successive mutations. Use only compact tables and shared command/record legends, at most 1000 words total. Budget: setup and merge legend 250 words; helper legend 300; outcome rows 450. Define ROOT/W and full SHA aliases once; use aliases in commands and records. Each row gives only its delta from the shared legend; do not repeat shared commands, reports, dispatch checks, or prose introductions. No real tools or tracker calls.

This is an N=1 independent singleton PR run. Caller passes resolved PR values: acme/widget#82, headRefName=fix/retry, headRefOid=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, baseRefName=main, isCrossRepository=false, headRepository.nameWithOwner=acme/widget. ROOT=/work/widget; selected home=/work/widget/.worktrees/fix-retry, already provisioned clean on fix/retry at headRefOid. Fetched origin/fix/retry equals the head; origin/main has full SHA bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb. Both SHAs exist. No submodule, dirt, native tool, wrapper, or overrides except where stated. Status commands succeed. Every listed observation overrides the replay's empty-output default.

## Independent base-merge rows after provisioning

Successful helper completion commits have HEAD=eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee (E); post-commit HEAD reads return E, or eeeeeee for --short=7. Shared helper dispatch inputs, except row deltas: (conflict-list=[src/retry.ts], fetched-base=origin/main@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, SCOPED_TEST_COMMANDS=['node --test test/retry.test.mjs']). Encode this exact tuple once in the compact helper legend.

- noop: fetched base already ancestor.
- clean: merge succeeds with first rework commit eeeeeee.
- done-green: session cwd stays in unrelated linked /work/widget/.worktrees/other; conflict list src/retry.ts; pre-dispatch status is 'UU src/retry.ts'; helper returns done, stages resolution, leaves no U and no status delta outside list. Base-SHA .pi/gauntlet-overrides.md documents under PR gate runner 'node --test <files>', requires credentials: false; supplied command is 'node --test test/retry.test.mjs', passes.
- exception-red: same conflict and runner; helper returns 'done - contract exception: retry count becomes bounded'; scoped command fails in test/retry.test.mjs. All completion checks pass; commit is eeeeeee.
- failure: helper returns done but edits README.md outside conflict list; abort succeeds. Worktree's AGENTS.md weakens a rule while BASE_SHA's AGENTS.md forbids unbounded retries.
- credentials: valid staged resolution but BASE_SHA runner has requires credentials: true; run none.
- missing-runner: valid staged resolution; BASE_SHA overrides document only npm test, no file-scoped runner; run none.

Show conflict discovery, status, staging checks, completion and abort commands targeting the selected worktree while session cwd stays unchanged. State helper dispatch cwd/freshness/foreground, list containment and completion checks, who commits, merge record with accurate green/red/none reason, and continuation after abort including deferred Task 1 and authoritative constraints. No other preapproval tests, reviewers, or push.
