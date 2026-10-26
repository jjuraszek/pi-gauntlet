# brainstorming accepts a list of related open PRs as one rework subject

**Goal:** `/skill:brainstorming #12 #13 #14` provisions PR 12's branch as home, merges the heads of 13 and 14 into it with `--no-ff` in listed order, treats the result as one combined PR under rework (its code, carried specs, and every member's threads and claims, attributed per PR), finishes by pushing to the home branch without force, appends the `## Rework` block to the home PR, and then offers - behind one gated confirmation showing every target with its exact comment text - to close the absorbed PRs with a comment linking home; a single PR stays the N=1 case, differing from today only in the record's `Threads:` position and in a thread-fetch failure stopping before the spec (AC7).
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves
**Ticket:** #89
**Predecessor:** doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md (supersedes its "Subject resolution" single-reference grammar, its single-head provisioning and single `PR:`/`Pre-rework head:` record shape, and its handoff decision that `## Process state` appends "two lines" / the brief contract's "exactly two lines"; its other sections, including the `/skill:gatekeep-pr` out-of-scope bullet, stay live)

## Problem

`/skill:brainstorming #12 #13` reworks PR 12 and carries ` #13` as intent text: `skills/brainstorming/reference/pr-subject.md` line 5 matches "only a trimmed leading GitHub reference ... optionally followed by free text carried as intent", so the second reference is never fetched, merged, or recorded and nothing tells the user. Every downstream surface is scalar-shaped: `using-git-worktrees/reference/pr-head.md` takes one PR's values and captures one `PRE_REWORK_HEAD`; `finishing-a-development-branch/SKILL.md` runs one ancestry proof (lines 188-190) and reads one `Pre-rework head:` (line 37); `gauntlet-handoff/SKILL.md` (82-88) and `gauntlet-resume/reference/brief-contract.md` (`## Producers` 54-55 "exactly two lines", `## Process-state restore` 117-122) carry one `PR:`/`Pre-rework head:` pair. A consumer who inherits three related PRs from one author pays three sessions, three specs, three finishes, and makes every shared decision three times.

Framing: kept (ticket #89) - the ticket's Idea records the zero-skill-change umbrella recipe (merge the heads by hand into one PR, brainstorm that) and the reporter chose native list support after a roast cut the refuse-only "phase 1"; the umbrella recipe stays as the documented route for PR sets admission rejects.

Premises corrected during the questionary:

- The ticket's "finish Option 1" and "rule against changing PR state" are finishing's **PR-subject row 1** (Option 1 there is the ordinary "Push and Create PR") and its closing sentence `Post no review-thread replies, merge no PR, and change no ticket state.` (line 299). The Red Flags section (line 468) carries only force-push and cleanup rules and has no PR-state line; AC8 and AC9 bind to row 1's closing sentence alone.
- The reporter note's "existing conflict-helper recipe" (`pr-head.md` "Merge the fetched base") is reusable for dispatch and completion checks, but its failure path is abort, record `merge: unresolved - <files>`, continue, and make the merge plan Task 1. AC5 requires abort and stop for a member head, so the member failure path is new text and the asymmetry with the base merge is intended: a base conflict is the rework's own work and continues as Task 1; an unresolved member conflict is a merge failure that stops the run naming the PR and files. It is not a verdict on relatedness - home may simply be behind a base that the member already contains - so the stop names the recovery path (resolve by hand in the named worktree, then rerun) rather than calling the set two changes.
- Three things the ticket leans on do not exist: a same-base/duplicate admission check (`pr-head.md`'s stop table has four rows, none of these), a pre-provision relatedness check (`brainstorming/SKILL.md` `### 2 Scope check` runs after the worktree and tests spec splits), and an inline-lint rule for one record group per PR (`spec-finalization.md` requires only a complete record). All three are new text.
- `gh pr close <N> --comment <text> -R <owner/repo>` exists (`gh pr close --help`); `--delete-branch` is never passed. `gh pr diff <N>` returns a PR's diff (`gh pr diff --help`).
- Heading-keyed consumers (`writing-plans/SKILL.md` 181/189, `plan-contract.md` 52, `verification-before-completion/SKILL.md` 49/163) read `## Rework record` presence, its `- <path>:<line> <thread id> - fix | keep open | decline:` lines, and the base `merge:` outcome; none assumes one `PR:` line, so N groups need no change there.
- `eval/brainstorming/intent.md` `for:` binds to an assembly SHA; `pr-subject.md` and `pr-head.md` already exist on `main`, so no `--base` preparatory commit is needed.
- `brainstorming/SKILL.md` is scalar at two more places than the HARD CONSTRAINT exception: its frontmatter description (line 3, "one open PR") and checklist item 2 (line 47, "pass a PR subject's head"). Both are implementation edits below; editing only the reference would leave the entry caller passing one head.

Decisions taken in the questionary: the home PR's bound ticket is the spec's ticket contract; member PRs' bound tickets are named in `## Problem` as context only. The brainstorm input is the home branch after the member merges - one combined PR state. Closing happens at finish after a successful push and a successful home-description append, because until then the member commits exist only in the local worktree and the home PR does not yet name them. Approach A (list-aware pipeline, single PR = N=1) was chosen over an "assemble-then-close before push" pre-step (closes PRs before any rework exists and loses per-PR attribution) and over the refuse-with-umbrella stop (rejected by the ticket's roast).

## Acceptance criteria

Ticket #89, Acceptance Criteria, rows verbatim:

- [ ] Given `/skill:brainstorming #12 #13 #14` with all three open, in this checkout, not fork-hosted, and on the same base branch, the worktree checks out PR 12's branch and merges the heads of PR 13 and PR 14 into it with `--no-ff` in listed order; `git merge-base --is-ancestor <each original head> HEAD` exits 0 for all three.
  in-scope
- [ ] Every listed ref, home included, passes the same admission: open, in this checkout, not fork-hosted, same base branch, not a duplicate, and a pull request rather than an issue; the first failing ref stops the run before provisioning with a message naming that ref and the reason, no new worktree is created, and existing worktrees are unchanged.
  in-scope
- [ ] Given `/skill:brainstorming #12 fix the retry path, see #13 for context`, PR 12 is the subject and the text after it is carried as intent, as today.
  in-scope
- [ ] The pre-approval write exception in the brainstorming skill and the worktree reference names the base merge and each admitted member-head merge, and `scripts/brainstorming-contract.test.mjs` asserts that wording.
  in-scope
- [ ] A conflict while merging a member head goes to a fresh conflict-resolution helper; if it stays unresolved, the active merge is aborted, the run stops naming the PR and the conflicted files, no spec or plan is written, no later member is merged, and no PR is pushed or closed.
  in-scope
- [ ] Before the worktree is provisioned, the scope check compares the listed PRs' titles and diffs; given two PRs that name unrelated concerns (eval sample with synthetic PRs), it stops with the two groups named and asks which to keep; the kept group becomes the list, and dropped PRs are neither merged, recorded, nor closed; no selection ends the run.
  in-scope
- [ ] Each admitted PR's review threads and stated claims are fetched before the spec is written and attributed to that PR in `## PR under rework` (one keeps/changes/dropped-claims block per PR) and in `## Rework record` (one `PR:` / `Pre-rework head:` / `Threads:` group per PR, home first); a synthetic member with a unique thread and claim shows that content under its own PR; a failed fetch stops before the spec with the ref and reason; the brainstorming inline lint and `scripts/brainstorming-contract.test.mjs` fail when a listed PR lacks its group.
  in-scope
- [ ] Finish Option 1 checks that every recorded original head is an ancestor of HEAD, pushes to the home PR's branch without a force flag, appends the `## Rework` block to the home PR naming the absorbed PRs, and only then presents closing each non-home PR with a comment linking the home PR as one gated write showing the exact comment text and target PRs; declining leaves them open and the run still ends; a failed ancestry check or push skips the close offer.
  in-scope
- [ ] The finish skill's rule against changing PR state permits exactly this post-push close-with-comment; every other finish option, and Option 1 after a failed push, leaves the member PRs untouched and says so in its summary.
  in-scope
- [ ] A handoff brief carries one `PR:` and `Pre-rework head:` pair per listed PR, home first; resume confirms the worktree branch equals the home PR's branch and stops with both names on mismatch.
  in-scope
- [ ] The brainstorming skill's PR-subject text states the umbrella recipe (merge the PR heads into one branch, open one PR, brainstorm that PR) in one paragraph, for sets the admission rejects such as fork-hosted or mixed-base PRs.
  in-scope
- [ ] `eval/brainstorming`, `eval/using-git-worktrees`, `eval/finishing-a-development-branch` and `eval/gauntlet-resume` each gain a sample for their list behavior above, including an unresolved member conflict and a repaired one; `node eval/run.mjs <target>` reports are committed and `npm test` is green.
  in-scope

Reading clauses for ambiguous rows (Design, not dispositions): "Finish Option 1" in rows 8 and 9 is finishing's PR-subject row 1 (push to the PR branch). "The scope check" in row 6 is a new pre-provision relatedness check in `pr-subject.md`, distinct from the post-worktree `### 2 Scope check`. "Each admitted PR" in row 7 is every PR that passed admission and survived the relatedness selection, a kept group of one and a plain single-PR subject included: a failed thread fetch for any of them stops before the spec with the ref and reason. Today's `Threads: not fetched (<reason>)` continuation is retired for PR subjects; the single-issue ticket path (no PR) is untouched by this row. "Appends the `## Rework` block ... and only then presents closing" in row 8 makes a successful `gh pr edit` a precondition of the close question, alongside the ancestry proofs and the push.

## Design

### Subject resolution (`skills/brainstorming/reference/pr-subject.md`, owner of the grammar; `skills/brainstorming/SKILL.md` caller)

The leading reference becomes a leading run: one or more refs in the three accepted forms (`#N`, `owner/repo#N`, a GitHub `/pull/N` or `/issues/N` URL), separated by whitespace or commas; the first token that is not a ref starts the intent text. `#12 #13 #14` is a three-PR list with no intent; `#12, #13 tighten the retry path` is a two-PR list with intent; `#12 fix the retry path, see #13 for context` is a one-PR list with intent, as today. Only the leading run is parsed; mid-sentence refs stay intent.

`brainstorming/SKILL.md` changes at two places besides the HARD CONSTRAINT exception: the frontmatter description says the subject is "one open PR or a leading list of related open PRs reworked on the home PR's branch", and checklist item 2 says "resolve the leading run per `reference/pr-subject.md`; pass the ordered per-PR array (home first) to `/skill:using-git-worktrees`' PR-head path", replacing "pass a PR subject's head".

Each ref is classified in listed order with the existing ordered `gh pr view` then `gh issue view` sequence. Admission runs per ref, in listed order, before any write, and the first failure stops with `<ref>: <reason>`:

| Check | Stop text | Trailer |
|---|---|---|
| State not `OPEN` | `#13 is MERGED; only an open PR can be reworked.` (existing) | none |
| Resolves to an issue, N > 1 | `#13 is an issue, not a pull request; a list admits only PRs. Drop #13 from the list, or brainstorm it alone as a ticket.` (a single `#N` issue keeps the ticket path) | direct correction, no umbrella |
| Repository identity differs from `origin` | `PR <owner/repo#N> belongs to <repo>, not this checkout (<origin owner/repo>).` (existing) | umbrella |
| `isCrossRepository` true | `PR #13's head lives on fork <nameWithOwner>; rework needs an in-repo branch.` (existing stop, now at admission) | umbrella |
| `baseRefName` differs from the first ref's | `#13 targets release-2 but home #12 targets main; mixed bases are not admitted.` | umbrella |
| Same PR number already in the list | `#13 is listed twice; list each PR once.` | direct correction, no umbrella |

The umbrella sentence, `To rework these together anyway, merge the heads into one branch by hand, open one PR, and brainstorm that PR.`, trails only the stops where assembling one in-repo, single-base umbrella PR is the remedy: repository identity, fork-hosted, and mixed-base. It lives in one paragraph of `pr-subject.md`, which satisfies AC11. The issue and duplicate stops end with their direct correction instead.

Ticket binding is taken from the home PR only (title, then body first line, as today). Each member's bound ticket, when present, is listed in `## Problem` as `PR #13 binds <ref> (context)`; its AC rows are not extracted. The resolver passes an ordered array of the existing per-PR value shape (`{ number, url, title, headRefName, headRefOid, baseRefName, isCrossRepository, headRepository.nameWithOwner }`) to provisioning; N=1 is a one-element array.

### Relatedness check (new, `pr-subject.md`, before provisioning)

With two or more admitted PRs, fetch per PR `gh pr view <N> --json title,body` and the actual diff with `gh pr diff <N> -R <owner/repo>`; a failed fetch stops before provisioning with `<ref>: diff not fetched (<gh error>)`. Grouping is defined here, not by `shape-ticket/reference/split-axes.md` (that file slices tickets and specs and says never to split PRs): two PRs belong to one group when their titles, bodies, and diff hunks address one concern - the same behavior, contract, or defect - judged on the hunks' content, not on shared paths (two PRs editing the same file for different reasons are two groups; two PRs editing different files for one behavior are one group). One group: continue. Two or more groups: stop and ask, in the questionary question format, one option per group listing its PRs and the shared concern, no "all" option (the set already failed the test), `Recommendation:` the group containing the first-listed PR. This ask is a preflight interaction before the worktree exists; it is not the questionary's question one, and gather, the framing question in `### 3`, and the post-worktree `### 2 Scope check` (which still tests the spec's concerns for splits) run afterward unchanged. The kept group becomes the list with its listed order preserved; its first member is home; list admission, per-PR fetch stops, and the record grammar stay in force for a kept group of one. The message names the dropped PRs; they are never merged, recorded, or closed. An answer naming no offered group is re-asked once, then the run stops.

### Provisioning (`skills/using-git-worktrees/reference/pr-head.md`)

The stop table and checkout run for home as today (`<name>` from home's `headRefName`; `PRE_REWORK_HEAD` = home's `headRefOid`), with one widened row. Two member rows join the stop table, checked before any write for every member: `headRefOid` unreachable after `fetch origin` or `origin/<headRefName>` different from it -> the existing "branch moved" stop naming that PR.

Interrupted-run recovery (replaces the "already on `headRefName`" row's `HEAD == headRefOid` requirement for a list, and the local-branch-ancestor stop at line 14 when the branch is home's): when a worktree or local branch for home's `headRefName` already exists, walk `git log --first-parent --format='%H %P %s' <headRefOid>..HEAD`. Every commit must be a merge commit whose subject matches `merge PR #<N> head <sha7> into PR #<home>` for a member `N` in the admitted list whose recorded `headRefOid` is its second parent; otherwise stop with `worktree <path> on <headRefName> carries commits beyond PR #<home>'s head (<sha7>) that are not member merges from this list; resolve by hand or remove the worktree.` A clean walk continues from that HEAD: members already merged are skipped (`git merge --no-ff` of an ancestor is "Already up to date" and would produce no merge commit) and reported as `Member merge: #<N> <sha7> (already landed)` with the existing merge commit's sha7; the remaining members merge in listed order. Unrelated local changes, a dirty tree, or a HEAD that is not reachable this way stop before any write. No reset, rebase, or branch deletion happens on this path.

After home is provisioned (fresh or recovered) and before the base merge, each remaining member head merges into home in listed order:

```bash
git -C "$WORKTREE" merge --no-ff -m "merge PR #<N> head <sha7> into PR #<home>" <headRefOid>
```

A conflict dispatches the same fresh foreground `implementer` helper as the base merge (exact conflicted file list, SCOPED_TEST_COMMANDS from the base-SHA overrides, `git add` per resolved file, no commits, no edits outside the list), and the same completion checks (empty unmerged index, every listed file staged, status delta inside the list), then `git -C "$WORKTREE" commit --no-edit`. The failure branch differs from the base merge: unresolved means `git -C "$WORKTREE" merge --abort`, leave the worktree on the home branch at its last good state (home head, or the previous member's merge commit), and stop with `PR #<N> conflicts with home PR #<home> in <files>; the worktree at <path> is left on <headRefName> at <sha7> with #<earlier members> already merged; merge #<N> by hand there (git merge --no-ff <headRefOid>) and rerun the same list, or rerun without #<N>.` The base merge does not run after an unresolved member merge; no spec, no later member, nothing pushed. A rerun of the same list enters through the recovery walk above and resumes at the first unmerged member.

Then the base merge runs as today. The Step 4 report prints one `PR:`/`Pre-rework head:` pair per PR, home first, then one `Member merge: #<N> <sha7>` line per member (`(already landed)` suffix for recovered merges), then the base merge result. `MEMBER_HEADS` carries the members' `{ number, url, title, headRefName, headRefOid }` to gather.

The HARD CONSTRAINT exception in `brainstorming/SKILL.md` and the "sole preapproval write/run exception" sentence in `pr-head.md` both name "the base merge and each admitted member-head merge, their conflict helpers' edits to the conflicted files, and their scoped conflict tests".

### Gather (`skills/brainstorming/gatherer.md`, `pr-subject.md`)

The unresolved-threads query runs per admitted PR; any query failure stops before gather with `threads for #<N> not fetched (<gh error>)` (AC7), N=1 included. Scout's code input is the combined post-merge state: the file list from `git diff --name-only <BASE_SHA>...HEAD` run in the worktree after the member merges and the base merge, replacing `git diff --name-only <BASE_SHA>...<PRE_REWORK_HEAD>` (which ends at home's original head and omits member code and conflict resolutions), and the diff of those files read from the worktree. Scout also receives, per PR: title and body verbatim, PR-carried specs (paths from `git diff --name-only <BASE_SHA>...<that PR's headRefOid> -- doc/specs`), that PR's own changed paths for attribution, and its threads with ids and locations; plus the `Member merge:` lines and the base merge result. `PRE_REWORK_HEAD` stays the provenance anchor for home (`Before:` in the `## Rework` block, the record, the brief); it is no longer the code-input boundary. Scout renders `## PR under rework` as one `### PR #<N> - <title>` block per PR, home first, each with `keeps:`, `changes:`, `dropped claims:`, and thread dispositions; `constraints added since fork:` is rendered once for home (the fork point of the rework branch).

### Spec content (`pr-subject.md` record grammar, `spec-finalization.md` lint)

`## Rework record` is one grammar for every N. The first three lines repeat per PR, home first; the combined fields follow once; per-PR provenance subsections close the section:

```markdown
## Rework record

PR: <owner/repo#12> - <title>
Pre-rework head: <40-char sha>
Threads:
- <path>:<line> <thread id> - fix | keep open | decline: <reason>
PR: <owner/repo#13> - <title>
Pre-rework head: <40-char sha>
Threads: none
Base: <baseRefName> @ <sha7> - merge: <no-op | sha7 | unresolved - files>
Keeps: ...
Changes: ...
Dropped claims: ...
Scoped tests: ...

### PR #12 - <title>
keeps: ... / changes: ... / dropped claims: ... (copied from `## PR under rework`)

### PR #13 - <title>
...
```

For N=1 this moves `Threads:` from after `Dropped claims:` (today's grammar) to directly after `Pre-rework head:`; the `### PR #<N>` subsection is still rendered for one PR so that the shape is uniform, and nothing else changes. `spec-finalization.md`'s "exact fixed-line grammar" sentence is updated to this grammar. Finish and handoff read only the top-level capitalized fields (`PR:`, `Pre-rework head:`, `Threads:`, `Base:`, `Keeps:`, `Changes:`, `Dropped claims:`, `Scoped tests:`); the lowercase `keeps:`/`changes:`/`dropped claims:` lines inside `### PR #<N>` subsections are provenance and are never copied into the `## Rework` block. Member merge SHAs are not a record field: the ancestry proofs use `Pre-rework head:`, `Absorbs:` derives from the `PR:` groups, and the merge commits stay in `git log`.

The inline lint "Ticket contract present" bullet gains an input-sensitive completeness check: build the set of PR numbers from the Step 4 report (`MEMBER_HEADS` plus home) and require, for each, a `PR:`/`Pre-rework head:`/`Threads:` group and a `### PR #<N>` subsection; a record whose groups are a proper subset of that set fails lint naming the missing PR. `## Problem` names every member PR with its title and bound ticket.

### Finish (`skills/finishing-a-development-branch/SKILL.md`, PR-subject row 1 and preflight)

Step 1 reads every `PR:`/`Pre-rework head:` pair; the first is home and drives the `gh pr view` confirmation and the branch check. Preflight's first proof runs per pair, home first; the first exit-1 stops with the existing message naming that PR's sha7. Row 1 writes `refs/gauntlet/pre-rework/pr-<N>` per PR and pushes home as today.

Thread refresh runs per recorded PR (the existing single-`$n` reviewThreads query, once per `PR:` line), and each thread keeps its PR attribution. Home's threads go through the existing resolution table (`git log --first-parent ... <PRE_REWORK_HEAD>..HEAD`). Member threads are not run through that table: a fix for a member thread may live on the member's own history, which home's first-parent walk never sees, so each member's `#<N>:` list in the `## Rework` block copies the record's disposition for that thread and marks any thread the refresh reports as newly resolved or newly opened. The recipe states this distinction.

The `## Rework` block gains `Absorbs: #13 (<url>), #14 (<url>)` after `Before:` and one `Threads:` list per PR labeled `#<N>:`. The `gh pr edit` of home's body is a precondition for closing: it runs as today, and on a body-fetch or body-edit failure the block is printed for paste, the close question is skipped, and the summary ends with `Member PRs #13, #14 left open.` - the same ending as a failed push.

Only after a successful push and a successful body edit, refresh each member with `gh pr view <N> -R <owner/repo> --json state,headRefOid`. A member is eligible when its state is `OPEN` and `git merge-base --is-ancestor <current headRefOid> <pushed home head>` exits 0 (its current head is contained in the history just pushed, so a member that advanced and was re-merged still qualifies; one that advanced past the merge does not). Ineligible members are excluded from the question and named in the summary with the reason (`#14 skipped: head moved to <sha7>, not in home` / `#14 skipped: state CLOSED`); nothing is merged implicitly. Then one gated write renders, before the ship-phase mark:

```text
Close the absorbed PRs with these comments?
#13: "Reworked into #12 (<home url>) by the gauntlet; this PR's commits are merged there and remain reachable as <#13 pre-rework sha7>."
#14: "Reworked into #12 (<home url>) by the gauntlet; this PR's commits are merged there and remain reachable as <#14 pre-rework sha7>."
1 - yes, close #13, #14
2 - no, leave them open
```

Each target line carries that member's fully instantiated comment with its own recorded `Pre-rework head:` sha7; the affirmative option names the actual targets. `1` re-checks each target's state and head immediately before its command and runs `gh pr close <N> --comment "<that line's text>" -R <owner/repo>` per eligible member - no `--delete-branch` - executing only the displayed target/text pairs; a target whose state or head changed after approval is skipped and reported, never closed under the stale authorization. A failed close is reported and never retried. `2` leaves them open. Then the ship phase is marked complete and the completion message carries the per-member outcome: `Closed: #13, #14`, `Closed: #13; #14 close failed (<error>)`, or `Member PRs #13, #14 left open.` Rows 2-6, a withheld or rejected push, a failed ancestry proof, and a failed body edit end with `Member PRs #13, #14 left open.` and never reach the close question. Row 1's closing sentence becomes `Post no review-thread replies, merge no PR, change no ticket state, and close no PR other than the absorbed members through the question above.` For N=1 no question renders and the completion message carries no member line.

### Handoff and resume (`skills/gauntlet-handoff/SKILL.md`, `skills/gauntlet-resume/reference/brief-contract.md`, `reconstruction.md`)

`brief-contract.md` `## Producers` (lines 54-55) replaces "exactly two lines: `PR:` and `Pre-rework head:`" with "one or more consecutive `PR: <owner/repo#N>` / `Pre-rework head: <40-char sha>` pairs, one per record group, home first, in record order"; the section table's `## Process state` row and the loop-alternative sentence ("retaining the optional PR pair") change to the same plural wording; `gauntlet-handoff/SKILL.md` step 6 appends every pair from the record. The gate-history line still follows the last pair.

`## Process-state restore` fetches branch identity from the first pair only (`gh pr view <N> --repo <owner/repo> --json headRefName`; the brief pairs carry no branch name) and compares it with `git -C <worktree> branch --show-current`; a mismatch stops with `brief names PR #N on <headRefName>, worktree is on <branch>` as today; later pairs are not fetched for this check. A new stop, not an existing one: read the worktree spec's `## Rework record` `PR:` lines and stop with `brief lists <brief order>, record lists <record order>` when the brief's pair order differs from the record's. Reconstruction's scan base stays the first pair's pre-rework head; member-carried specs (the paths gather recorded from `git diff --name-only <BASE_SHA>...<member headRefOid> -- doc/specs`, listed in the spec's `## Problem` under each member) are excluded from the new-rework-spec candidate scan so the merged-in specs do not force a human pick.

### Regression safety during list integration

Preserve existing outcomes exercised by the four eval targets while extending list handling. In `pr-head.md`, spell out the successful no-worktree recovery command on the validated existing branch and keep every helper/completion command targeted at the selected worktree. In `brainstorming/reference/ticket-acceptance.md`, require the human or Design to supply a missing complete family enumeration; question options and recommendations must not invent the list or fill a partial one. Preserve user-approved presentation details in the brainstorming design recap. In `brainstorming/reference/amendment-surface.md`, keep human review of a re-bounded row explicit without a standing grant and use `loop: amend` for mixed ledger amendment batches, reserving `loop: cut row N` for a single cut. In `gauntlet-resume/SKILL.md`, keep the no-ledger continuation's Entry steps 1-5 mapping explicit. These are clarifications of existing rules, not new workflow components or acceptance rows. Keep narrated attribution within the existing eval word cap by requesting compact output in that sample without dropping any required fact. Preserve all must-hold facts and record failed observations; use the existing eval-library test files rather than nonexistent suite names.

### Documentation

README "What a run looks like" step 1: the existing sentence "permits only the base merge, conflict resolution, and scoped conflict tests" before approval becomes "permits only the base merge, each admitted member-head merge, their conflict resolution, and scoped conflict tests", matching the skill and worktree-reference exceptions; step 1 also adds one sentence (a leading list of open PRs on one base is one rework subject, first is home, the others are merged in and offered for closing at finish) and step 5 one sentence (the close offer). `doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md` gets the supersession banner with scope `"Subject resolution" single-reference grammar, single-head provisioning and single PR/Pre-rework head record shape, and the handoff "two lines" / brief-contract "exactly two lines" decision` (the predecessor's only multi-PR bullet is the `/skill:gatekeep-pr` exclusion, which this spec leaves live). CHANGELOG `## Unreleased` gets one entry (#89).

## Errors and edge cases

- Admission and relatedness (including the per-PR diff fetch) run before any write; a stop there creates no worktree and touches none. The umbrella sentence trails the repository, fork, and mixed-base stops; issue and duplicate stops give their direct correction.
- A member merge that the helper resolves is invisible to the developer beyond its `Member merge:` line; the unresolved case aborts, skips the base merge, stops, and names the worktree path, branch, SHA, and already-merged members so the developer can finish by hand or rerun; the rerun enters through the recovery walk and skips landed members.
- A worktree on home's branch with commits that are not this list's member merges stops before any write; nothing is reset.
- Thread-fetch failure for any admitted PR stops before gather.
- Finish: a failed ancestry proof for any pair stops before push; a withheld or rejected push skips the body edit and the close question; a body-fetch or body-edit failure after a successful push prints the block for paste, skips the close question, and ends with `Member PRs ... left open.`; a member that is no longer open or whose current head is outside the pushed home history is excluded from the question and named; a target that changes between approval and its close command is skipped; a failed close is reported per PR and the run ends; the completion message names every member's outcome.
- Resume: branch not equal to home's `headRefName` stops with both names; pair order differing from the record stops with both orders.
- N=1: the grammar renders one group plus one `### PR #<N>` subsection with `Threads:` after `Pre-rework head:`; a thread-fetch failure stops before the spec; finish and the brief render today's output; the close question never renders.
- A ref list mixing a URL form and `#N` for the same PR is a duplicate (compared by resolved number and repository).

## Tests

`scripts/brainstorming-contract.test.mjs` gains wording assertions (`text.includes` / regex over the shipped skill files) for: the leading-run grammar sentence in `pr-subject.md`; the description and checklist item 2 wording in `brainstorming/SKILL.md`; the mixed-base, duplicate, and issue-in-list stop texts and the umbrella sentence; the widened pre-approval exception in both `brainstorming/SKILL.md` and `pr-head.md` and in README step 1; the per-PR group grammar and `### PR #<N>` subsection placement in the record; the recovery-walk rule in `pr-head.md`; the finish's amended closing sentence, the body-edit precondition, the per-member eligibility refresh, and the close question's per-target comment lines; the brief contract's "one or more consecutive pairs, home first" wording in both the producer and the section table. These are wording checks only.

Record completeness (AC7) gets an input-sensitive test in the same file: a fixture record with groups for #12 and #13 is checked against a listed set `{12, 13, 14}` by the same rule the lint bullet states (every listed number has a `PR:` group and a `### PR #<N>` subsection), and the test asserts the missing-member failure names `#14`; the complete fixture passes.

Eval samples (synthetic PRs, narrated observations, no live tracker), one per behavior:

| Target | Sample | Must-hold facts |
|---|---|---|
| `eval/brainstorming` | `pr-list-admission-mixed-base` | stop names `#13`, `release-2`, `main`, umbrella sentence; no worktree command narrated |
| `eval/brainstorming` | `pr-list-admission-issue-in-list` | stop names `#13` as an issue with the direct correction; no umbrella sentence |
| `eval/brainstorming` | `pr-list-relatedness-split` | `gh pr diff` narrated per PR; two PRs that touch the same file for unrelated reasons form two groups named with their PRs; question in questionary format, not question one; kept group's first PR becomes home; dropped PR absent from every later line; framing question still asked later |
| `eval/brainstorming` | `pr-list-per-pr-attribution` | a member's unique thread id and claim appear under `### PR #13` and under its record group, not home's; scout's file list comes from `<BASE_SHA>...HEAD` after the merges |
| `eval/brainstorming` | `pr-list-record-missing-member` | a drafted record lacking #14's group is rejected by the inline lint naming `#14` |
| `eval/brainstorming` | `pr-subject-resolution` (existing, extended) | new observation with prompt `#12 fix the retry path, see #13 for context`: one PR resolved, intent `fix the retry path, see #13 for context` carried, no lookup of #13; listed under `## Expected to move` |
| `eval/using-git-worktrees` | `pr-list-member-merge-order` | `merge --no-ff` for #13 then #14, then `origin/main`; three `Pre-rework head:` lines, home first |
| `eval/using-git-worktrees` | `pr-list-member-conflict-unresolved` | helper dispatched; `merge --abort`; stop names #14, files, worktree path, SHA, and #13 as already merged; no spec, no base merge |
| `eval/using-git-worktrees` | `pr-list-member-conflict-repaired` | helper resolves; `commit --no-edit`; `Member merge: #14 <sha7>` line; base merge follows |
| `eval/using-git-worktrees` | `pr-list-interrupted-recovery` | worktree already on home's branch with #13's merge commit: recovery walk passes, `Member merge: #13 <sha7> (already landed)`, #14 merges next; a variant with a stray non-merge commit stops before any write |
| `eval/finishing-a-development-branch` | `pr-list-push-and-close` | three ancestry proofs; push without force; `Absorbs:` line; per-PR `#<N>:` thread lists; `gh pr edit` succeeds; member refresh; close question with one comment per target carrying that target's sha7 and option `1 - yes, close #13, #14`; `1` runs `gh pr close` per target without `--delete-branch`; completion message `Closed: #13, #14` |
| `eval/finishing-a-development-branch` | `pr-list-push-rejected` | no body edit, no close question, `Member PRs #13, #14 left open.` |
| `eval/finishing-a-development-branch` | `pr-list-body-edit-failed` | push succeeds, `gh pr edit` fails, block printed for paste, no close question, `Member PRs #13, #14 left open.` |
| `eval/finishing-a-development-branch` | `pr-list-member-advanced` | #14's current head is outside the pushed home history: excluded from the question with `#14 skipped: head moved to <sha7>, not in home`; #13 still offered |
| `eval/gauntlet-resume` | `pr-list-brief` | three pairs home first; branch equal to home resumes; `pr-list-brief-mismatch` variant stops with both names; `pr-list-brief-order` variant stops with both orders |

Each target's `intent.md` names these samples under `## Expected to move`; `node eval/run.mjs <target>` reports are committed; `npm test` is green.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md "What a run looks like" (step 1: the pre-approval write sentence names each admitted member-head merge, and a leading list of open PRs on one base is one rework subject, first is home; step 5: the finish closes absorbed PRs behind one gated confirmation) - clears "Major procedures / conventions"; CHANGELOG.md - deferred: release
- Derived / memory docs invalidated: `doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md` (supersession banner for its single-reference grammar, single-head provisioning and record shape, and the handoff "two lines" decision); AGENTS.md routing table unchanged

Skill bodies and `reference/` files are implementation surface and are listed in the plan, not here (`reference/documentation-impact.md`).

## Out of scope

- Landing order across PRs, a `close` verdict with evidence, and a disk-backed continuation record (dropped from #77; still follow-ups).
- Fork-hosted member heads stay a stop; mixed-base sets stay a stop.
- Member PRs' bound tickets contribute no AC rows (questionary decision A).
- Closing members at merge time or before push; retrying a failed close; deleting member branches; merging commits a member gained after provisioning.
- Resetting or rebasing a worktree left by an interrupted member merge; recovery is validate-and-continue only.
- `/skill:gatekeep-pr`, pi-cohort, `extensions/`, `bin/`, `writing-plans`, and `verification-before-completion` are unchanged.

## Open questions

- None.
