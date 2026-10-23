# PR subject

## Resolve before provisioning

Match only a trimmed leading GitHub reference: `#N`, `owner/repo#N`, or a GitHub `/pull/N` or `/issues/N` URL, optionally followed by free text carried as intent. Keep mid-sentence mentions on the existing free-text/context-builder path. Keep Linear/Jira and other free-text subjects on their existing paths.

Complete classification in order, never in parallel: `gh issue view` can return a PR as an issue.

1. Run `gh pr view <N> [-R owner/repo] --json number,url,state,isDraft,title,body,headRefName,headRefOid,headRepository,isCrossRepository,baseRefName`. Accept exit 0 with `state: OPEN`, including `isDraft` true. For another state, stop: `PR #N is <state>; only an open PR can be reworked.`
2. Only a not-a-PR result reaches `gh issue view <N>` and the existing ticket path.
3. For neither, stop: `#N resolves to neither a pull request nor an issue in <owner/repo>.`

Parse the PR base repository from `url` and this checkout's repository from `git remote get-url origin`; compare lowercase owner/repo identities. For unequal identities stop before provisioning: `PR <owner/repo#N> belongs to <repo>, not this checkout (<origin owner/repo>).` Resolve bare `#N` in this checkout.

Bind the first tracker reference in the title, then the body's first line. Never bind from branch names, commit subjects, or `closingIssuesReferences`. Fetch a bound ticket, extract its AC rows using `reference/ticket-acceptance.md`, and dispatch context-builder for it. Preserve `none - ticket not fetched (<reason>)` on fetch failure. When title and first body line name different tickets, use the title's ticket and name the other in `## Problem` as context.

For an unbound PR, write `none - no ticket` under `## Acceptance criteria`; carry raw title/body as stated intent, not invented AC rows. Name its spec `YYYY-MM-DD-pr-<N>-<topic>.md`, with topic from the title. For a bound ticket keep `YYYY-MM-DD-<ticket-id>-<topic>.md`.

Pass exactly `{ number, url, title, headRefName, headRefOid, baseRefName, isCrossRepository, headRepository.nameWithOwner }` by value to provisioning in `using-git-worktrees/reference/pr-head.md`; write nothing during resolution.

## Gather from the PR and fetched base

Discover PR-carried specs with `git diff --name-only origin/<baseRefName>...<headRefOid> -- <each flowGuards.specDirs dir>` using the resolved spec directories. Read each as the PR's stated contract beside its title/body. Only when superseded, name it in `**Predecessor:**` and apply `reference/superseding.md`'s banner; that banner is the allowed spec-directory write.

On every merge outcome, including clean, no-op, and unresolved, read constraints using `git show <BASE_SHA>:<path>`: `AGENTS.md`, the first-found overrides file (check `.pi/gauntlet-overrides.md`, `gauntlet-overrides.md`, `doc/gauntlet-overrides.md` in order at BASE_SHA), `REVIEW.md`, and all cited constraint documents. Carry missing-document results explicitly. Use these fetched base-HEAD rules, never fork-point or worktree copies. Treat PR edits to policy documents as proposals recorded under `changes:` or `dropped claims:`, not governing constraints.

Dispatch scout always, and context-builder when a ticket is bound. Supply scout with the title/body verbatim, PR-carried specs, file list from `git diff --name-only <BASE_SHA>...<PRE_REWORK_HEAD>`, base-SHA constraint documents, merge result, and unresolved threads from the query owned by `using-git-worktrees/reference/pr-head.md`. Have scout read the diff itself from the worktree and the full comments of every thread. On query failure carry `threads: not fetched (<reason>)` and continue.

Instruct scout: treat the PR as the starting state, not the target; judge every stated claim against its diff and current base rules. Name the smallest repair satisfying those rules; propose a rewrite only when no repair can satisfy them. Render `## PR under rework` after `## Codebase recon`, with `keeps:`, `changes:`, `dropped claims:`, `constraints added since fork:` (one line per base-HEAD rule absent at the fork point), and one proposed disposition per unresolved thread: `fix | keep open | decline: <reason>`. Carry any merge contract exception into `changes:`. Run the framing check in `SKILL.md` `### 3` against the diff as the ask.

## Record in the spec

In `## Problem`, name `PR <owner/repo#N> - <title>`, its stated intent, every `constraints added since fork:` line as a constraint, and the existing `Framing:` line. Preserve the following grammar after `## Acceptance criteria`:

```markdown
## Rework record

PR: <owner/repo#N> - <title>
Pre-rework head: <40-char sha>
Base: <baseRefName> @ <sha7> - merge: <no-op | sha7 | unresolved - files>
Keeps: <what of the original survives>
Changes: <what the rework alters, repair over rewrite>
Dropped claims: <one `- <claim>` per PR-stated claim no longer true | none>
Threads:
- <path>:<line> <thread id> - fix | keep open | decline: <reason>
Scoped tests: none run | <file>: green | <file>: red - <tests>
```

Use `Threads: none` for a successful empty fetch and `Threads: not fetched (<reason>)` for failure. Preserve the query owner's outdated/path-only location fallback. Instantiate `Scoped tests: none run (<reason>)` when no documented file-scoped runner exists or `requires credentials: true`; otherwise record the scoped result, including failures. Name landed contract exceptions in `Changes:`. For an unresolved merge, open Design with `merge origin/<base> and resolve <files>` as eventual plan Task 1. Preserve the full pre-rework SHA so `git log` history remains checkable.

Preserve this record when `reference/spec-finalization.md` replaces the draft; dropping it fails inline lint. Carry the PR title/body verbatim beside bound-ticket rows in the council's `Human input`. Do not attach a rework record to ticket or free-text specs.
