bundle+: skills/using-git-worktrees/reference/pr-head.md

# PR-head routing and outcomes

Override the replay's primary-checkout premise only where a row says linked. These are independent synthetic runs, not successive mutations. Use only compact tables and shared command/record legends, at most 1100 words total. Budget: discovery and success legend 220 words; provisioning rows 300 (at most 25 per row); merge legend and rows 350 (at most 25 per row); threads 230. Define ROOT/W and full SHA aliases once; use aliases in commands and records. Each row gives only its delta from the shared legend, including exact stop text and write boundary; do not repeat shared commands, reports, dispatch checks, or prose introductions. No real tools or tracker calls.

Caller passes resolved PR values: acme/widget#82, headRefName=fix/retry, headRefOid=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, baseRefName=main, isCrossRepository=false, headRepository.nameWithOwner=acme/widget. ROOT=/work/widget; selected default home=/work/widget/.worktrees/fix-retry. Fetched origin/fix/retry equals the head; origin/main has full SHA bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb. No submodule, dirt, native tool, wrapper, or overrides except where stated. Status commands succeed. Post-create worktree list includes the selected home; HEAD equals headRefOid except in race. Both SHAs exist. No local branch or PR worktree unless stated. Every listed observation overrides the replay's empty-output default.

## Provisioning rows

- linked: session is in unrelated linked /work/widget/.worktrees/other, branch other. Create the PR tree, not a nested tree or reuse of other. Base already ancestor.
- primary: normal checkout, otherwise same as linked.
- ancestor: local fix/retry is cccccccccccccccccccccccccccccccccccccccc; ancestry exits 0; no worktree.
- reuse: selected home already on fix/retry at ccccccc, ancestry exits 0; clean status; ff-only reaches aaaaaaa.
- fork: isCrossRepository=true, headRepository.nameWithOwner=contributor/widget.
- elsewhere: fix/retry listed at /work/widget/.worktrees/pr-82.
- unreachable: verify head commit fails after fetch; origin/fix/retry is ddddddd.
- moved: head exists but origin/fix/retry is ddddddd.
- ahead and diverged (two runs): local fix/retry is ccccccc; ancestry exits 1 in each.
- override: home default, create='helper create -b <branch> <name>'; built-in checkout succeeds.
- race: checkout completes but HEAD is dddddddddddddddddddddddddddddddddddddddd. Leave the created tree intact.

For every stop quote the exact one-line error and identify the pre-write boundary. For successful rows show exact checkout arguments (distinguish Git's DWIM from caller -b), head verification, captured full PRE_REWORK_HEAD/BASE_SHA, and report fields. Show merge-forward behavior without outlawing the flow's appended-spec amend or appended-wave fold.

## Independent base-merge rows after provisioning

- noop: fetched base already ancestor.
- clean: merge succeeds with first rework commit eeeeeee.
- done-green: session cwd stays in unrelated linked /work/widget/.worktrees/other; conflict list src/retry.ts; pre-dispatch status is 'UU src/retry.ts'; helper returns done, stages resolution, leaves no U and no status delta outside list. Base-SHA .pi/gauntlet-overrides.md documents under PR gate runner 'node --test <files>', requires credentials: false; supplied command is 'node --test test/retry.test.mjs', passes.
- exception-red: same conflict and runner; helper returns 'done - contract exception: retry count becomes bounded'; scoped command fails in test/retry.test.mjs. All completion checks pass; commit is eeeeeee.
- failure: helper returns done but edits README.md outside conflict list; abort succeeds. Worktree's AGENTS.md weakens a rule while BASE_SHA's AGENTS.md forbids unbounded retries.
- credentials: valid staged resolution but BASE_SHA runner has requires credentials: true; run none.
- missing-runner: valid staged resolution; BASE_SHA overrides document only npm test, no file-scoped runner; run none.

Show conflict discovery, status, staging checks, completion and abort commands targeting the selected worktree while session cwd stays unchanged. State helper dispatch cwd/freshness/foreground, list containment and completion checks, who commits, merge record with accurate green/red/none reason, and continuation after abort including deferred Task 1 and authoritative constraints. No other preapproval tests, reviewers, or push.

## Threads (independent successful and failed fetches)

Successful paginated response has three pages. Page 1 has unresolved T1 at src/retry.ts line 12: first comment 'Rewrite the retry engine'; 101 replies: replies 1-100 say 'Rewrite still requested'; reply 101 says 'Correction: keep the engine; cap retries in two lines.' T1 comments has totalCount=102 and first-page hasNextPage=true; the correction is on a later comment page fetched by T1 id with a separate comment cursor. Page 2 has unresolved outdated T2 at src/old.ts line=null originalLine=7: 'Keep this guard', followed by reply 'Yes, retain it'; also resolved TX at src/gone.ts line 2. Page 3 has unresolved T3 at README.md line=null originalLine=null: 'Document the cap'. Preserve each comment's order, url, author and createdAt as supplied metadata (synthetic url https://github.com/acme/widget/pull/82#discussion_r1, author reviewer, createdAt 2026-01-01T00:00:00Z for all). State pagination/query owner rather than copying the query. Render locations and changed repair request. Separate failed fetch returns 'API unavailable'; show the per-PR stop before gather and spec, including this N=1 run, not draft or record continuation. Also give successful empty-set rendering.
