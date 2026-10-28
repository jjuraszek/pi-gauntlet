# PR subject

## Resolve before provisioning

Parse only a trimmed leading run of one or more GitHub references: `#N`, `owner/repo#N`, or a GitHub `/pull/N` or `/issues/N` URL, separated by whitespace or commas. The first token that is not a ref starts intent text; carry it verbatim without looking up later references. Read `#12 #13 #14` as three PRs, `#12, #13 tighten the retry path` as two plus intent, and `#12 fix the retry path, see #13 for context` as one plus intent. Route mid-sentence mentions through the free-text path with context-builder: for `make the retry logic work like #55 did`, gather #55 as context, not a PR subject; skip PR classification and PR-head provisioning. Keep Linear/Jira and other free-text subjects on their existing paths.

When the first intent token is `merge-forward`, set `SYNC=merge` and strip only that token from intent; otherwise set `SYNC=rebase`. Preserve all remaining intent. Pass SYNC beside the admitted PR array only to provisioning. Carry `SYNC` nowhere else; infer the mode later from the record.

Resolve and admit in listed order before any write; stop at the first failing ref with its observed reason. Create no worktree and leave existing worktrees unchanged on admission failure. Complete classification in order, never in parallel: `gh issue view` can return a PR as an issue.

1. Run `gh pr view <N> [-R owner/repo] --json number,url,state,isDraft,title,body,headRefName,headRefOid,headRepository,isCrossRepository,baseRefName`. Accept exit 0 with `state: OPEN`, including `isDraft` true.
2. Only a not-a-PR result reaches `gh issue view <N>`. Keep an isolated issue on the existing ticket path; stop for an issue in a list.
3. For neither, stop: `#N resolves to neither a pull request nor an issue in <owner/repo>.`

Parse the PR base repository from `url` and this checkout's repository from `git remote get-url origin`; compare lowercase owner/repo identities. Resolve bare `#N` in this checkout. Compare duplicates by resolved repository and number, including URL/bare duplicates. Require every PR, home included, to pass these checks; instantiate all refs, states, repositories, fork names, and branches from observations:

| Check | Stop text | Remedy |
|---|---|---|
| State not OPEN | `#13 is MERGED; only an open PR can be reworked.` | none |
| Issue in list | `#13 is an issue, not a pull request; a list admits only PRs. Drop #13 from the list, or brainstorm it alone as a ticket.` | direct correction |
| Foreign repository | `PR <owner/repo#N> belongs to <repo>, not this checkout (<origin owner/repo>).` | umbrella |
| isCrossRepository true | `PR #13's head lives on fork <nameWithOwner>; rework needs an in-repo branch.` | umbrella |
| Different baseRefName from first PR | `#13 targets release-2 but home #12 targets main; mixed bases are not admitted.` | umbrella |
| Duplicate resolved identity | `#13 is listed twice; list each PR once.` | direct correction |

Append this paragraph only for foreign-repository, fork, and mixed-base failures: To rework these together anyway, merge the heads into one branch by hand, open one PR, and brainstorm that PR.

## Spec-PR classifier

Immediately after ordered admission and before binding, classify N=1 read-only. Derive ROOT from the absolute git common directory using pr-head's Step 0 submodule guard before fetching. N>1 always follows relatedness and rework. Fetch `git -C "$ROOT" fetch origin <baseRefName> <headRefName>`, resolve `BASE_SHA=$(git -C "$ROOT" rev-parse origin/<baseRefName>)`, and inspect `git -C "$ROOT" diff --name-status <BASE_SHA>...<headRefOid>`. Stop on command errors. Apply [spec-pr.md](spec-pr.md)'s shared shape predicate with pinned BASE_SHA/headRefOid, inspecting modified hunks; read the added spec through `git show <headRefOid>:<path>` before testing its exact deferred header marker.

| Observation | Route |
|---|---|
| Shape fails | Pass the selected SYNC to provisioning. Continue unchanged through bind, gather, scout, and Rework record. |
| Shape passes, marker absent | Force `SYNC=merge` for provisioning. Print `spec-only PR without the gate marker - running lint and council`. Provision the one-element admitted PR array through pr-head's checkout, base merge, and Step 4 report with no thread fetch (bypass its `## Fetch unresolved review threads` as on the marked route). Skip ticket binding, context-builder, the PR scout block, and gather; never write a `## Rework record`. Resume at checklist step 4 with the carried spec file at `<worktree>/<path>` as the draft, as a redraw does (recon falls to the questionary); spec-writing overwrites that file at its carried path. Run lint, council, and the gate as for any spec, with 6 withheld (`Withheld: draft PR - #N already exists`). On approval 1/2/4/5 persist `**Engine:**`, `**Amend-grant:**`, and `**PR:** <owner/repo#N>` as a new commit per spec-pr.md's re-gate persistence. |
| Shape and marker pass | Force `SYNC=merge` for provisioning. Provision the one-element admitted PR array through pr-head's checkout/base merge/Step 4, then follow spec-pr.md's re-gate. Skip binding and all before-gather thread queries. Treat draft and ready PRs equally. |

## Relatedness before provisioning

Start the message with `gauntlet: question` alone at column zero on the first physical line, followed by a newline, when asking the relatedness question, before premise correction or framing. Never append a colon to the marker. Follow the [first-line rule](menu-layout.md).

For N>1, fetch every admitted PR's title/body with `gh pr view <N> -R <owner/repo> --json title,body` and actual diff with `gh pr diff <N> -R <owner/repo>`. On failure stop before provisioning naming the ref and observed reason: `<ref>: title/body not fetched (<gh error>)` or `<ref>: diff not fetched (<gh error>)`.

Group by the hunks' behavior, contract, or defect, using titles and bodies as stated intent, not shared paths. Treat unrelated hunks in one file as separate concerns and related hunks across files as one concern. Define groups here, not through shape-ticket's split axes. For one group continue; for multiple groups ask one question in the questionary format: a lead-in naming the concerns, one lettered option per group with its PRs and shared concern on its own line, then `Recommendation:` on its own final line recommending the initial-home group. Offer no all option. For an answer naming no offered group, re-ask once, then stop.

Retain the chosen group's listed order; make its first PR home. Name dropped PRs and exclude them from merges, records, and closure. Apply all per-PR fetch and record requirements even to a retained group of one. Keep this preflight separate from question one: gather, the framing question in SKILL.md ### 3, and the post-worktree scope check still run afterward.

## Bind and pass the retained list

Bind the spec's ticket only from home's first tracker reference in the title, then the body's first line. Name each member binding in `## Problem` as `PR #13 binds <ref> (context)`; extract no member AC rows. Never bind from branch names, commit subjects, or `closingIssuesReferences`. Fetch a bound ticket, extract its AC rows using `reference/ticket-acceptance.md`, and dispatch context-builder for it. Preserve `none - ticket not fetched (<reason>)` on fetch failure. When title and first body line name different tickets, use the title's ticket and name the other in `## Problem` as context.

For an unbound home PR, retain the gather-time result `none - no ticket`; at spec-writing use `ticket-acceptance.md`'s drafted branch from the agreed rework design. Carry raw title/body as stated intent, not invented AC rows; derive the drafted outcomes from the agreed design, not the title/body carry-over. Name its spec `YYYY-MM-DD-pr-<N>-<topic>.md`; emit the concrete filename with the actual date, PR number, and topic slug derived from the PR title. For a bound ticket keep `YYYY-MM-DD-<ticket-id>-<topic>.md`.

Pass an ordered array, home first, of exactly `{ number, url, title, headRefName, headRefOid, baseRefName, isCrossRepository, headRepository.nameWithOwner }` by value beside SYNC to provisioning in `using-git-worktrees/reference/pr-head.md`; use a one-element array for N=1 and write nothing during resolution.

## Gather from the PR and fetched base

Apply this section's thread fetch, carried-spec discovery, scout dispatch, and `## PR under rework` rendering to the rework route only; the unmarked spec-only route skips gather. Require every retained PR's title/body, carried specs, and full threads before spec-writing. Stop before gather on any query failure, N=1 included: `threads for #<N> not fetched (<gh error>)`; name the ref and reason for unreadable title/body/specs too. Discover PR-carried specs per PR with `git diff --name-only <BASE_SHA>...<that PR's headRefOid> -- <each flowGuards.specDirs dir>` using the resolved spec directories. Read every carried spec's contents with `git show <that PR's headRefOid>:<path>` as that PR's stated contract beside its title/body; preserve the owning PR, original head, and path even when multiple PRs carry different versions of the same path. List member-carried spec paths under their PR in `## Problem` so resume can exclude them from new-spec candidates. Only when superseded, name it in `**Predecessor:**` and apply `reference/superseding.md`'s banner; that banner is the allowed spec-directory write.

On every sync outcome, including clean, no-op, and unresolved, read constraints using `git show <BASE_SHA>:<path>`: `AGENTS.md`, the first-found overrides file (check `.pi/gauntlet-overrides.md`, `gauntlet-overrides.md`, `doc/gauntlet-overrides.md` in order at BASE_SHA), `REVIEW.md`, and all cited constraint documents. Carry missing-document results explicitly. Use these fetched base-HEAD rules, never fork-point or worktree copies. Treat PR edits to policy documents as proposals recorded under `changes:` or `dropped claims:`, not governing constraints.

Dispatch scout always, and context-builder only for the home-bound ticket. Supply per PR the title/body verbatim, own changed paths and PR-carried specs as attributed original-head text separately from the combined worktree code input, and full comment threads with ids and locations from the query owned by `using-git-worktrees/reference/pr-head.md`. Supply combined changed paths from `git diff --name-only <BASE_SHA>...HEAD` run in the worktree after member replays and base sync, and have scout read `git diff <BASE_SHA>...HEAD` there. Supply base-SHA constraint documents, `Member replay:` lines (member merge outcomes in merge mode), and base sync outcomes; do not pass the selector to scout. Keep `PRE_REWORK_HEAD` as home's original provenance anchor for Before, record, and brief, not the code-input boundary.

Instruct scout: treat the combined PR state as the starting state, not the target; judge every stated claim against its diff and current base rules. Name the smallest repair satisfying those rules; propose a rewrite only when no repair can satisfy them. Render `## PR under rework` after `## Codebase recon`, with one `### PR #<N> - <title>` subsection per PR, home first, each with lowercase `keeps:`, `changes:`, `dropped claims:`, and one disposition per unresolved thread: `fix | keep open | decline: <reason>`. Render `constraints added since fork:` once for home, one line per base-HEAD rule absent at its fork point. Carry sync contract exceptions into `changes:`. Run the framing check in SKILL.md ### 3 against the combined diff as the ask.

## Record in the spec

In `## Problem`, name every `PR <owner/repo#N> - <title>`, its stated intent, member ticket bindings and carried spec paths, every `constraints added since fork:` line as a constraint, and the existing `Framing:` line. Preserve this grammar after `## Acceptance criteria`: repeat the PR/Pre-rework head/Threads group for every retained PR, home first; write the combined fields once, then one provenance subsection per PR.

```markdown
## Rework record

PR: <owner/repo#N> - <title>
Pre-rework head: <40-char sha>
Threads:
- <path>:<line> <thread id> - fix | keep open | decline: <reason>
PR: <owner/repo#M> - <title>
Pre-rework head: <40-char sha>
Threads: none
Base: <baseRefName> @ <sha7> - <rebased: pre7..new7, n stop(s) in files | sync: no-op | sync: unresolved - files | merge: no-op | merge: sha7 | merge: unresolved - files>
Rework base: <40-char sha>
Member replay: #<M> <first7..last7 | empty | (already landed) | unresolved - files | pending>
Keeps: <what of the combined original survives>
Changes: <what the rework alters, repair over rewrite>
Dropped claims: <one `- <claim>` per PR-stated claim no longer true | none>
Scoped tests: none run | <file>: green | <file>: red - <tests>

### PR #<N> - <title>
keeps: <copied claim>
changes: <copied change>
dropped claims: <copied claims | none>

### PR #<M> - <title>
keeps: <copied claim>
changes: <copied change>
dropped claims: <copied claims | none>
```

Include Rework base only after a complete rebase sync; omit it for merge records and incomplete syncs. Put member replay outcomes in listed order after Base and optional Rework base, before combined claims; retain member merge outcomes for merge mode.

For N=1 render one group and one subsection; place `Threads:` immediately after `Pre-rework head:`. Use `Threads: none` for a successful empty fetch. A failed fetch stops before gather, never continues with `Threads: not fetched`. Preserve the query owner's outdated/path-only location fallback and all thread dispositions. Preserve full original heads; add no member merge SHA field. Keep lowercase provenance distinct from the capitalized combined fields: finish/handoff copy only top-level capitalized fields, never subsection claims.

Instantiate `Scoped tests: none run (<reason>)` when no documented file-scoped runner exists or `requires credentials: true`; otherwise record the scoped result, including failures. Name landed contract exceptions in `Changes:`. Open Design with the matching eventual Task 1: `rebase onto origin/<base> and resolve <files>` for `sync: unresolved`, `replay #<N> onto home and resolve <files>` for an unresolved member replay, or `merge origin/<base> and resolve <files>` for `merge: unresolved`. In rebase mode Task 1 also replays pending members in order and persists Rework base and final outcomes before finishing.

Preserve this record when `reference/spec-finalization.md` replaces the draft; dropping any retained PR fails inline lint. Use provisioning Step 4's home plus `MEMBER_HEADS` as the expected inputs. Carry every retained PR title/body verbatim beside home-bound-ticket rows in the council's `Human input`. Do not attach a rework record to ticket or free-text specs.
