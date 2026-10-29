bundle+: skills/finishing-a-development-branch/SKILL.md
bundle+: skills/finishing-a-development-branch/reference/spec-pr.md
bundle+: skills/finishing-a-development-branch/reference/legs.md
bundle+: skills/brainstorming/reference/legs.md
## Header-linked coordinated finish checkpoints
Synthetic observations only. No tools or live forge actions exist; narrate calls and printed outcomes, never execute them. Use shared preparation then independent deltas, maximum 1800 words.

Home acme/widget at /work/widget/.worktrees/shared, companion acme/helper at /work/helper/.worktrees/shared; both branches shared. Selected spec doc/specs/shared.md has Engine waves, PR acme/widget#42, no Rework record. Its two original ACs are home output and helper output. Home block then companion block:
```markdown
## Legs
### Leg: acme/widget
branch: shared
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: test-widget
Rules: AGENTS.md
scope: AC 1
design: home output
### Leg: acme/helper
branch: shared
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: test-helper
Rules: AGENTS.md
scope: AC 2
design: helper output
```
Companion doc/specs/shared.md carries the exact companion block and `**Home:** acme/widget shared doc/specs/shared.md`. Origins and canonical common dirs match declared primaries. Home overrides declares sibling https://github.com/acme/helper.git. Home common dir /work/widget/.git; companion receipt location /work/widget/.git/gauntlet/receipts/shared.md/acme/helper. Every fresh test-widget/test-helper and conformance check passes in its own checkout with its own Rules and original scoped AC. All closure gates pass. Audited clean HEADs: home bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, companion cccccccccccccccccccccccccccccccccccccccc; immediate staged/unstaged/untracked comparisons unchanged. Home view returns number42, URL https://github.com/acme/widget/pull/42, OPEN, isDraft true, headRefName shared, baseRefName release. Fetch succeeds; origin/shared aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa is ancestor of home HEAD. No receipts initially. Creates/push/seal/ready succeed unless overridden. Companion create returns https://github.com/acme/helper/pull/9, OPEN, matching cccccccccccccccccccccccccccccccccccccccc. Home body bytes are `Original description\n` and must remain exact.

A select row1: show both-leg verification/conformance, companion push and ready PR create, receipt, single home strip/seal including base and companion argument, home push then home ready. Show Home pointer and shipped summary home last, removal of receipts and user keeping summary for cross-repo review.
B independently select row2: create companion draft, push home and leave draft, no ready calls.
C retry row1 after partial B: receipt attempted-head and delivered-head both cccccccccccccccccccccccccccccccccccccccc, verification passed; live receipt PR OPEN, same head, isDraft true. Validate live state/head/draft, ready companion and refresh receipt before seal/home; no duplicate create. Companion worktree may be missing only here, requiring receipt proof before exemption.
D retry row2 after partial A: same valid receipt but live isDraft false, present clean companion tree; leave companion ready, do not redraft.
Independent failures: companion create returns `GraphQL: create denied`; companion ready in C returns `GraphQL: ready denied`; live receipt state CLOSED; home seal after companion delivery exits1 `seal: invalid telemetry`; home ready after push returns `GraphQL: home ready denied`; home push rejected `remote: stale head`. Show exact shipped/not-shipped status, retained deliveries/receipts and stops without rollback or false completion. Seal failure must name home and bin output. Home-ready failure must disclose already-completed push and all shipped companions.
Home preflight divergence independently withholds1/2: no companion delivery starts. Deferred Engine independently stops before verification. Rows3-5 retain coordinated squash/keep/discard and existing cleanup confirmations; do not narrate their full recipes.
