# brainstorming accepts an open PR as its subject

**Goal:** `/skill:brainstorming <ref>` that resolves to an open pull request starts the gauntlet on the PR's own branch at its head SHA, merges the current base in before gather, gathers the PR's intent, diff, unresolved review threads, and bound ticket, records in the spec what the rework keeps and changes, appends every later commit to the PR branch, and finishes by pushing to that branch without force and appending a rework block to the PR description - while the ticket and free-text entry paths keep their exact current behavior.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval; fund 3 fix rounds
**Ticket:** #78
**Predecessor:** none

## Problem

An open PR has no entry into the gauntlet today. Every worktree create path in `skills/using-git-worktrees/SKILL.md` (Step 1a item 3, Step 2b) runs `git worktree add ... -b <new branch>` from the current ref, and `skills/finishing-a-development-branch/SKILL.md` Options 1 and 2 both run `gh pr create`, so a PR under rework would be rebuilt on a new branch and then collide with itself at the finish. The gatherer's trigger rule (`skills/brainstorming/gatherer.md` "Context-builder trigger rule") treats a bare `#N` as a ticket with no issue-vs-PR discrimination. The ticket's motivating failures (#77: eight pushes before review, review threads outdated by replacement commits, rules added to the base after the fork) all come from reworking a PR outside the flow.

gatekeep-pr already owns a PR-head worktree recipe - checkout on `headRefName` with no `-b`, HEAD == `headRefOid` check, STOP on divergence, fork via a local `pr-<N>` branch, a `head_pushable` dry-run probe (`skills/gatekeep-pr/reference/assessment.md` "Provision the worktree") - a per-commit rebase conflict stop (`skills/gatekeep-pr/reference/sync.md` "Conflict stop"), and a helper-owned base merge (`skills/gatekeep-pr/reference/fix-wave.md` row `merge base`). Those contracts are gatekeep's and differ from a rework's needs (reuse-at-any-path vs stop, `pr-<N>` naming vs the PR branch, rebase vs merge), so this spec gives the rework its own owner and leaves gatekeep's text in place.

Framing: kept - the smaller alternative (PR as gather context only, new branch, Option 1 PR) loses exactly the outdated-thread and attribution problems the ticket names; gatekeep's rubric-from-merge-base rule is anti-tamper for a reviewer and does not conflict with reading current rules for a rework. The scout's objection (three copies of gatekeep's PR prose) is answered by the single-owner design below, not by resizing the ask.

Premises corrected during the questionary:

- A worktree checked out at the PR head holds fork-point docs, and the scout reads cwd. "Constraints from the base branch's HEAD docs" (AC1) therefore needs the current base in the tree: this spec merges `origin/<baseRefName>` into the PR branch as the first commit of the rework, before gather. gatekeep reads its rubric from the merge-base for a different reason (a PR cannot weaken its own gate) and keeps doing so.
- `agents/scout.md` and `agents/context-builder.md` are pi-cohort builtins, not files in this repo; PR-aware gathering rides in `gatherer.md`'s task templates.
- The `reviewThreads` GraphQL query exists in `skills/gatekeep-pr/verification-brief.md` lines 45-47 as prose only; this spec commits the query text once, in the new worktree reference, and leaves gatekeep's prose untouched.
- A worktree checked out at the PR head after a clean base merge can still carry the PR's own edits to `AGENTS.md`, the overrides file, or `REVIEW.md`; the merge supplies the working tree, not the constraint source. Constraints are read from the fetched base SHA with `git show` on every PR path.
- `using-git-worktrees/SKILL.md` Step 0 reuses any linked worktree the session already sits in and skips Step 1; the PR-head path has to run before that reuse or a rework from an unrelated linked worktree lands on the wrong branch.
- `brainstorming/SKILL.md`'s HARD CONSTRAINT forbids writes outside spec dirs and any validation before approval; the base merge, its conflict helper, and its scoped tests need a named exception there.
- `gh issue view <N>` succeeds for a PR number and returns the PR as an issue, so PR classification has to complete before the issue lookup.
- `gh api graphql --paginate` requires the query to declare `$endCursor: String` and fetch `pageInfo{hasNextPage endCursor}` (`gh api graphql --help`).
- `subagent-driven-development` folds every wave into one wave commit (`reset --soft "$WAVE_BASE_SHA"`, step 7), so a review thread never maps to a per-task commit; thread resolution evidence is the plan task's `complete` status plus the wave commit that names the thread id.
- A PR produced by an earlier gauntlet run already carries a spec under `doc/specs`; `gauntlet-resume/reference/reconstruction.md` routes "more than one spec" to a human pick. The rework spec is the only spec added after the pre-rework head, so the brief's `Pre-rework head:` line is the resume candidate base for a PR subject and no pick is needed.
- The eval runner reads every assembled path from the baseline commit too (`eval/run.mjs`, refusing with `use --base <ref>` when a file is missing there), so new reference files land in a preparatory commit and eval runs pass `--base <that commit>` (the `gh-73` and `gh-74` specs' pattern).
- `## Repo state` in the handoff brief is pi-cohort-owned; `## Process state` is gauntlet-owned (`skills/gauntlet-resume/reference/brief-contract.md`). The PR fields land in `## Process state`, so no pi-cohort change and no paired release.
- There is no `eval/gauntlet-handoff/` target; the brief lines are exercised through `eval/gauntlet-resume`.
- `gauntlet-telemetry-seal --base` accepts any commit-ish (`extensions/lib/vcs.ts` `validateBase` runs `rev-parse --verify <base>^{commit}`), so passing the pre-rework head needs no bin change.

Decisions the user settled: validation depth is inspect-and-observe with no full verification run - the only tests brainstorming runs are gatekeep-style scoped tests at a conflict stop, and `requires credentials: true` under `## PR gate` suppresses even those; the merge resolves conflicts through a helper and never stops for a human; a ticket bound to the PR (title, then body first line) supplies the AC rows and an unbound PR is a free-text subject; finishing appends a rework block that names dropped claims and never edits the original description text; handoff carries exactly two lines; no new human gate anywhere in the flow.

## Acceptance criteria

Ticket #78, `## Acceptance criteria`, rows verbatim:

- [ ] `/skill:brainstorming <ref>` treats the reference as a PR subject when the tracker resolves it to a pull request (`#N`, `owner/repo#N`, or a PR URL), as a ticket subject when it resolves to an issue, and stops with a one-line error when it resolves to neither. For a PR subject it fetches the PR's title, body, diff, unresolved review threads, and linked ticket, and gathers from them as it gathers from a ticket; the spec's problem statement names the PR's intent, and its constraints are read from the base branch's HEAD docs, not the fork point. Check: a fixture PR compliant at its fork point whose base gained a rule afterwards; the spec names the new rule as a constraint.
  in-scope
- [ ] For a PR subject the spec records what the rework keeps of the original and what it changes, and where a repair of the original satisfies the current rules the spec proposes the repair, not a rewrite. Check: a fixture PR whose violation a two-line change fixes; the spec proposes that change and keeps the original commits.
  in-scope
- [ ] For a PR subject, worktree creation checks out the PR's head branch (same branch name, HEAD equal to the PR head SHA) instead of creating a branch from the base; a PR whose branch is already checked out in another worktree, whose head is unreachable, or whose head lives on a fork stops with a one-line error naming the case before any write.
  in-scope
- [ ] Spec and implementation commits are appended to the PR branch; after implement, `git log` of the branch still contains every commit SHA that was on the PR head before the rework.
  in-scope
- [ ] For a PR subject, finishing's landing menu offers "push to the PR branch" beside the existing options; choosing it saves the pre-rework head under a ref (name chosen by the implementer and documented), pushes without force, and appends to the PR description - leaving the existing description in place - a block that names the saved ref as the "before" state and one line per unresolved review thread with its resolution (the fixing commit, still open, or declined with the reason). A push that would need force stops at the menu with the reason.
  in-scope
- [ ] `/skill:gauntlet-handoff` after the spec commit writes a brief whose grammar carries the PR reference and the pre-rework head; `/skill:gauntlet-resume` on that brief in a fresh session resumes on the PR branch in the same worktree.
  in-scope
- [ ] A ticket or free-text subject behaves exactly as today: the existing `eval/brainstorming`, `eval/using-git-worktrees`, `eval/finishing-a-development-branch`, and `eval/gauntlet-resume` samples pass unchanged, a new sample per touched skill exercises the PR subject, and `npm test` passes.
  in-scope

Readings written as Design clauses: row 1's "fixture PR" checks are eval samples with synthetic gather drafts (eval cases are text-only; `eval/README.md`); row 1's "base branch's HEAD docs" is satisfied by reading the constraint documents from the fetched base SHA (Design "Gather"), with the base merge supplying the working tree (Design "Base merge"); row 3's "before any write" means before `git worktree add` and before any file in the primary or a worktree is created or modified; row 4's "still contains every commit SHA" means the PR branch advances by merge only, never rebase, and no commit at or below the pre-rework head is ever replaced; row 5's "beside the existing options" is a sixth menu row next to today's five, each of which keeps its action and gains its PR consequence (Design "Finishing"); row 5's ref name is `refs/gauntlet/pre-rework/pr-<N>`, a local ref, with the full pre-rework SHA as the portable handle; row 6's "grammar" is two lines in `## Process state`.

## Design

### Ownership

| Concern | Owner (new or changed file) | Cited by |
|---|---|---|
| Subject match rule, PR-first resolution, repository identity, bound-ticket rule, PR gather inputs, base-SHA constraint reads, PR-carried spec as predecessor, draft and spec sections for a PR subject | `skills/brainstorming/reference/pr-subject.md` (new) | `brainstorming/SKILL.md` HARD CONSTRAINT exception, checklist step 2, `### 3` framing check, "Worktree First", "Filename Convention"; `gatherer.md` trigger rule and scout template; `reference/spec-finalization.md` (record preservation, council `Human input`) |
| PR-head worktree provisioning routed before Step 0's reuse, pre-write stops, local-branch sync, base merge with helper-resolved conflicts, merge-forward rule, `reviewThreads` query text | `skills/using-git-worktrees/reference/pr-head.md` (new) | `using-git-worktrees/SKILL.md` Step 0 (PR-subject branch before the linked-worktree reuse), Step 1 (new "PR head" entry), "Keeping a Worktree Current" (merge-forward sentence) |
| Thread tasks whose titles carry the thread id, the merge task when `unresolved`, the PR-subject `**Verification:**` header (lint and format only) | `skills/writing-plans/SKILL.md` (plan header and task rules; `reference/plan-contract.md` if the header grammar lives there) | - |
| PR-subject verification set | `skills/verification-before-completion/SKILL.md` verify-phase run and evidence paragraph (one clause each: for a spec carrying `## Rework record` the set is the union of every plan task's `Tests:` commands plus the header's `**Verification:**` line) | - |
| Rework detection from the spec record, sixth menu row, non-ff preflight, thread refetch and resolution evidence, `## Rework` block, pre-rework ref | `skills/finishing-a-development-branch/SKILL.md` Step 1 (detection, verification set), Step 3, Step 4 menu, new Option section "Push to the PR branch", Quick Reference, Red Flags | - |
| Two `## Process state` lines; `Pre-rework head:` as the resume candidate base | `skills/gauntlet-handoff/SKILL.md` step 6, `skills/gauntlet-resume/reference/brief-contract.md` section table and "Process-state restore", `skills/gauntlet-resume/reference/reconstruction.md` "Candidates" | - |

gatekeep-pr does not change: `assessment.md`, `sync.md`, `verification-brief.md`, and `fix-wave.md` keep their text and their `eval/gatekeep-pr` assembly. `pr-head.md` restates in its own prose the `fix-wave.md` `merge base` helper rules that apply to a rework (one fresh implementer merges the fetched `origin/<baseRefName>` and resolves the conflicts in one commit; resolution that changes an agreed obligation is reported, not committed) and states its own provisioning, dirty-tree, and merge-failure behavior; nothing is moved out of or cited from gatekeep. No file under `agents/` changes. No `extensions/`, `src/bins/`, or settings change.

### Subject resolution (`pr-subject.md`, read at checklist step 2)

Runs after step 1 (tracker reset) and before the worktree. **Match rule:** the trimmed initial prompt is exactly one tracker reference for a GitHub tracker (`#N`, `owner/repo#N`, a GitHub `/pull/N` or `/issues/N` URL), optionally followed by free text that is carried as intent. A prompt that merely contains a reference mid-sentence ("make the retry logic work like #55 did") is a free-text subject: today's gatherer trigger rule dispatches context-builder for the mention and no PR step runs.

Order - load-bearing, because `gh issue view <N>` succeeds for a PR number and returns the PR as an issue; PR classification completes before the issue lookup and the two are never reversed or run in parallel:

1. `gh pr view <N> [-R owner/repo] --json number,url,state,isDraft,title,body,headRefName,headRefOid,headRepository,isCrossRepository,baseRefName`. Exit 0 with `state: OPEN` -> PR subject. Exit 0 with another state -> stop: `PR #N is <state>; only an open PR can be reworked.`
2. Not a PR -> `gh issue view <N>` as today -> ticket subject, unchanged behavior.
3. Neither -> stop: `#N resolves to neither a pull request nor an issue in <owner/repo>.`

**Repository identity.** The PR's base repository is the `<owner>/<repo>` of its `url`; this checkout's is the `owner/repo` parsed from `git remote get-url origin`, both lowercased. Unequal -> stop before provisioning: `PR <owner/repo#N> belongs to <repo>, not this checkout (<origin owner/repo>).` A bare `#N` is resolved in this checkout and always passes.

A free-text prompt or a Linear/Jira id never reaches this step. The slug: bound ticket (below) -> `YYYY-MM-DD-<ticket-id>-<topic>.md` as today; unbound -> `YYYY-MM-DD-pr-<N>-<topic>.md`, `<topic>` from the PR title.

**Bound ticket.** The PR title, then the PR body's first line; first tracker reference wins; none -> unbound. Branch name, commit subjects, and `closingIssuesReferences` do not bind. A bound ticket is fetched and its AC rows extracted exactly as a ticket subject (`reference/ticket-acceptance.md`); context-builder is dispatched for it. Unbound: `## Acceptance criteria` reads `none - no ticket`, and the PR title and body are the stated intent carried into `## Problem`, never rows.

**PR-carried spec.** `git diff --name-only origin/<baseRefName>...<headRefOid> -- <each flowGuards.specDirs dir>` lists the specs the PR added. Each is a gather input (the PR's stated contract, read beside its title and body). When the rework supersedes one, the new spec's `**Predecessor:**` names it and it gets the supersession banner per `reference/superseding.md`; the banner edit is the one write the HARD CONSTRAINT already allows.

The resolved `{ number, url, title, headRefName, headRefOid, baseRefName, isCrossRepository, headRepository.nameWithOwner }` is passed to the worktree step as values; nothing is written.

### Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)

**Routing.** `using-git-worktrees/SKILL.md` Step 0 gains one sentence before its linked-worktree reuse: a caller passing a PR reads `reference/pr-head.md` and follows it instead of Step 0 and Step 1; Step 0 and Step 1 are unchanged for every other caller. A session already inside a linked worktree is never adopted for a PR subject unless that worktree is the one `pr-head.md` selects below.

Pre-write stops, each one line, each before any write, checked in this order after `git -C "$ROOT" fetch origin`:

| Case | Line |
|---|---|
| `isCrossRepository` true | `PR #N's head lives on fork <headRepository.nameWithOwner>; rework needs an in-repo branch.` |
| `headRefName` listed by `git worktree list --porcelain` under a path other than the resolved home | `branch <headRefName> is checked out at <path>; finish or remove that worktree first.` |
| `git rev-parse --verify -q <headRefOid>^{commit}` fails after fetch, or `origin/<headRefName>` != `headRefOid` | `PR #N head <headRefOid7> is not reachable (origin/<headRefName> is at <sha7>); the branch moved.` |
| a local branch `<headRefName>` exists and `git merge-base --is-ancestor <headRefName> origin/<headRefName>` exits 1 | `local branch <headRefName> is at <sha7>, not an ancestor of origin/<headRefName> (<sha7>); rework needs the PR head.` |

**Provisioning**, in this order:

- A worktree at the resolved home on `headRefName` is reused: a dirty tree takes the existing Step 3 dirty ask first; then `git -C "$WORKTREE" merge --ff-only origin/<headRefName>`; then HEAD must equal `headRefOid`, else stop with both SHAs (an ahead or diverged local branch stops here, not silently).
- No worktree, local branch exists: `git -C "$ROOT" branch -f` is never used; the branch is fast-forwarded by the proven-ancestor check above (`git -C "$ROOT" update-ref refs/heads/<headRefName> origin/<headRefName>` only after that check passes), then `git -C "$ROOT" worktree add "<home>" <headRefName>`.
- No worktree, no local branch: `git -C "$ROOT" worktree add "<home>" <headRefName>` - git resolves a missing local branch name with exactly one matching remote-tracking branch to `--track -b <headRefName> "<home>" origin/<headRefName>`; the spec names this so the implementer never substitutes Step 1a's `-b` built-in or a `create:` override.
- An overrides `create:` command is used for a PR subject only when it contains no `-b`/`-B` and takes `<branch>` as an existing branch; otherwise the built-in form above runs and the Step 4 report notes `create: override skipped (contains -b)`. `<name>` is `headRefName` with `/` -> `-`.

Post-create: `git -C "$WORKTREE" rev-parse HEAD` must equal `headRefOid`, else stop with both SHAs. Record `PRE_REWORK_HEAD=<headRefOid>` and `BASE_SHA=$(git -C "$ROOT" rev-parse origin/<baseRefName>)`. The Step 4 report adds `PR: <owner/repo#N>`, `Pre-rework head: <sha>`, and `Base SHA: <sha7>` lines after `Base:`; `Base:` is `<headRefName> @ <sha7>`.

**Merge-forward rule.** A PR-subject branch advances by merge only, from entry to finish: no commit reachable from `PRE_REWORK_HEAD` is ever rewritten - never `git rebase` onto anything, and never `reset` or `commit --amend` to a commit at or below `PRE_REWORK_HEAD`. Commits this flow itself appends stay foldable as today: the spec gate's `commit --amend --no-edit` of the spec commit (`brainstorming/reference/spec-finalization.md`) and the wave fold's `reset --soft "$WAVE_BASE_SHA"` (`subagent-driven-development/SKILL.md` step 7; `WAVE_BASE_SHA` is always a descendant of `PRE_REWORK_HEAD`) are unchanged. `using-git-worktrees/SKILL.md` "Keeping a Worktree Current" gains the sentence "a PR-subject branch (`pr-head.md`) merges `origin/<base>`; never rebase it". Finishing verifies it (below).

**Base merge.** `git -C "$WORKTREE" merge --no-ff --no-edit origin/<baseRefName>`:

- `origin/<baseRefName>` already an ancestor -> `merge: no-op - head contains origin/<base>`; no commit.
- Clean -> the merge commit is the first rework commit; `merge: <sha7>`.
- Conflict -> one fresh `implementer`, `cwd` the worktree, `async: false`, with: the conflicted file list (`git diff --name-only --diff-filter=U`), the base being merged, `SCOPED_TEST_COMMANDS`, and the rule: resolve every listed file so both sides' intent survives, run exactly the supplied scoped commands, `git add` each resolved file, return `done`; when a resolution would change an obligation the PR or its bound ticket states, return `done - contract exception: <why>` so the spec's `## Rework record` names it; never commit, never abort, never edit outside the list. The orchestrator continues only when `--diff-filter=U` is empty, every listed file is staged, and `git status --porcelain` differs from the pre-dispatch snapshot only in the listed files; then `git commit --no-edit` completes the merge: `merge: <sha7>, <n> file(s) resolved, scoped tests <green | red in <file>: <tests> | none>`. Anything else -> `git merge --abort`, `merge: unresolved - <files>`; the flow continues on the unmerged head and the spec's Design opens with the clause "merge `origin/<base>` and resolve <files>" as the plan's task 1.
- `SCOPED_TEST_COMMANDS` is read from the base tree, never the conflicted one: `git show <BASE_SHA>:<overrides path>`; it is `none` unless that overrides file documents a file-scoped runner (for example `node --test <files>`) under `## PR gate` or `## verification-before-completion` and `requires credentials` is not `true`; a full-suite entrypoint such as `npm test` is never turned into a file-scoped form.

The HARD CONSTRAINT in `brainstorming/SKILL.md` gains one exception sentence: "For a PR subject, the base merge in `using-git-worktrees/reference/pr-head.md` - its merge commit, its conflict helper's edits to the conflicted files, and its scoped conflict tests - is the one pre-approval write and run outside the spec dirs; nothing else moves." No reviewer and no push at brainstorm; the end-of-flow code review covers the merge commit. No other test command runs in brainstorming.

**`reviewThreads` query** (committed once here; gatekeep's prose is not changed):

```
gh api graphql --paginate -f query='query($o:String!,$r:String!,$n:Int!,$endCursor:String){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100,after:$endCursor){pageInfo{hasNextPage endCursor} nodes{id isResolved isOutdated path line originalLine comments(first:100){nodes{url body author{login} createdAt}}}}}}}' -F o=<owner> -F r=<repo> -F n=<N>
```

filtered to `isResolved == false`, every page merged. Each thread carries all its comments in order: the first is the request, replies can change it, and the scout reads the whole thread. Location renders as `<path>:<line>`, else `<path>:<originalLine> (outdated)`, else `<path>`.

### Gather (`gatherer.md`)

The trigger rule gains the PR branch: a PR subject dispatches scout always and context-builder when a ticket is bound. **Constraint source:** on every PR path, clean merge included, the scout task carries the base-HEAD constraint documents read from `BASE_SHA` (`git show <BASE_SHA>:AGENTS.md`, the overrides file, `REVIEW.md`, and every constraint document those cite) and the instruction that these, not the worktree copies, govern; a PR change to any of them is a proposal the record names under `changes:` or `dropped claims:`, never a constraint. The scout task template gains one block for a PR subject, supplied as values: the PR title and body, any PR-carried spec paths, the file list from `git diff --name-only <BASE_SHA>...<PRE_REWORK_HEAD>` (the scout reads the diff itself from the worktree), the unresolved thread list from the query above with full comment threads (or `threads: not fetched (<reason>)`), the merge line, and the instruction: "The PR is the starting state, not the target. Judge its diff against the base-HEAD rules supplied here. For each PR-stated claim, say whether it holds in the diff. Name the smallest repair that satisfies the current rules where one exists; a rewrite is proposed only where no repair can. Render a `## PR under rework` section with `keeps:`, `changes:`, `dropped claims:`, `constraints added since fork:` (one line per rule in the base-HEAD documents the PR's fork point lacked), and one line per unresolved thread with a proposed disposition `fix | keep open | decline: <reason>`." The draft assembly adds `## PR under rework` after `## Codebase recon`. The questionary's framing check (`SKILL.md` `### 3`) runs against the PR's diff as the "ask". Everything else in gather is unchanged.

### Spec content for a PR subject

`## Problem` names the PR (`PR <owner/repo#N> - <title>`), its stated intent, every `constraints added since fork:` line as a constraint, and the `Framing:` line as today. A new section `## Rework record` follows `## Acceptance criteria`, with fixed lines a consumer keys on:

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

`Threads: none` when the fetch succeeded and returned nothing; `Threads: not fetched (<reason>)` on failure. A ticket or free-text spec never carries this section. `reference/spec-finalization.md` gains two rules: the write preserves `## Rework record` from the draft's `## PR under rework` (a full replacement that drops it fails the inline lint), and the council's `Human input` block for a PR subject carries the PR title and body verbatim beside the bound ticket's rows.

`skills/writing-plans/SKILL.md` gains the PR-subject rules: every `fix` thread becomes one task whose title carries the thread id and whose `Tests:` names the thread's request; the merge clause (when `unresolved`) is task 1; and the plan header's `**Verification:**` line carries only the overrides' documented lint and format commands (the literal `none - PR subject, scoped` when none is documented) - never the full test entrypoint and never a task's `Tests:` command, which `plan_check` rejects as a full-suite duplicate (`extensions/lib/plan-check.ts:555`). The scoped set is the union of every task's `Tests:` commands plus that header line: the implement phase's wave gate already runs the task union with no edit of its own; `verification-before-completion/SKILL.md`'s verify-phase run and evidence paragraph, and finishing's hard gate (Step 1 verification set), gain the clause that for a spec carrying `## Rework record` the set is that union plus the header line; the `## Rework` block states `Verification: scoped - <commands>; CI on this push holds the full run`.

### Finishing

**Detection at Step 1** keys on the run's spec: a spec with `## Rework record` makes this a PR-subject finish; `PR:` and `Pre-rework head:` are read from it. Then `gh pr view <N> --json number,url,headRefName,baseRefName,state` confirms: `state` not `OPEN` -> stop: `PR #N is <state>; the rework cannot be pushed to it.`; `headRefName` != `$FEATURE` -> stop with both names. A spec without the record keeps today's path exactly, whether or not an open PR exists on `$FEATURE` (a ticket run re-finished after Option 1/2 stays on the five-option menu). A record whose `Pre-rework head:` line is missing stops naming the spec path. `<base-branch>` (Step 3) is `baseRefName`.

**Before the menu:** `git fetch origin`, then two checks. `git merge-base --is-ancestor <PRE_REWORK_HEAD> HEAD` must exit 0 (every pre-rework commit is still an ancestor; AC4) - exit 1 stops: `PR branch history was rewritten: <PRE_REWORK_HEAD7> is not an ancestor of HEAD; the rework must be re-merged, not rebased.` Then `git merge-base --is-ancestor origin/<headRefName> HEAD`: exit 0 -> the push is a fast-forward; exit 1 -> the push row is withheld: `push withheld: origin/<headRefName> is at <sha7>, local HEAD at <sha7>; a non-force push cannot land` - and only when a further `git merge-base --is-ancestor <PRE_REWORK_HEAD> origin/<headRefName>` exits 0 does the line add `(origin moved past the rework's base <PRE_REWORK_HEAD7>)`; any exit other than 0 or 1 is a command error reported as such, not a withhold reason.

**PR-subject menu:** today's five rows stay, in their order, each with its PR consequence, and the push row sits beside them as row 1 (menu-layout rules apply):

```
Implementation complete. What would you like to do?

1. Push to the PR branch (PR #N, <headRefName>; appends the rework block to its description)
2. Push and create a Pull Request (PR #N already exists on this branch; gh refuses a second one)
3. Push and create a draft Pull Request (same: PR #N already exists)
4. Squash-merge to <base-branch> (no PR, no surviving branch; orphans PR #N - close it by hand)
5. Keep the branch as-is (I'll handle it later; nothing is pushed)
6. Discard this work (removes the worktree and local branch; the PR branch on origin is untouched)

Which option?
```

A withheld push row is replaced by `Withheld: push - <reason>` under the list and the remaining rows keep their numbers. No approval gate is added anywhere in this step.

**Option 1:** strip the plan and seal telemetry as Options 1-3 do today with `--option pr --base origin/<baseRefName>` - the seal measures the whole PR (its diff is `merge-base(HEAD, base)...HEAD`, so a `PRE_REWORK_HEAD` base would count the imported base changes as rework); the `## Rework` block states that scope. Then `git -C "$WORKTREE" update-ref refs/gauntlet/pre-rework/pr-<N> <PRE_REWORK_HEAD>`; `git -C "$WORKTREE" push --no-follow-tags origin HEAD:refs/heads/<headRefName>` - never `--force`, `--force-with-lease`, or `-f`; a server rejection is reported as that push's failure, once, with no retry. After a successful push, `gh pr edit <N> --body-file` with the existing body (fetched fresh, `gh pr view --json body`) followed by one blank line and the block below; the existing text is byte-identical above it:

```markdown
## Rework

Before: <PRE_REWORK_HEAD> (local ref `refs/gauntlet/pre-rework/pr-<N>` in the rework checkout; the SHA is the portable handle and stays on origin because the push was not forced)
Spec: <spec path> at <HEAD7>
Keeps: <from the record>
Changes: <from the record>
Dropped claims: <none | one "No longer true: <claim>" line per dropped claim>
Verification: scoped - <commands>; CI on this push holds the full run. Telemetry: whole PR against <baseRefName>.
Threads:
- <path>:<line> - fixed in <sha7> | fixed (task "<title>" complete; no single commit names <thread id>) | still open | declined - <reason>
```

`supersedes the description above` is the block's second line when every claim is dropped. **Threads** are refetched with the `pr-head.md` query before the block is composed: a thread in the record keeps its disposition; a thread not in the record (opened during the rework) renders `still open`; a thread resolved on GitHub since is omitted; an empty fetched set renders `Threads: none`; a failed fetch renders `Threads: not fetched (<reason>)` and never an empty list. Resolution evidence per `fix` thread, read before the plan is stripped: the plan task whose title carries the thread id is `complete` (granted only after spec review and code review accepted it) and `git log --first-parent --format=%h --grep '<thread id>' <merge-sha | PRE_REWORK_HEAD>..HEAD` returns exactly one commit -> `fixed in <sha7>`; task complete with zero or several naming commits -> the `fixed (task ... complete; no single commit names ...)` form; task not complete or absent -> `still open`. A touched path, a first-parent filter, or a commit subject alone never upgrades a thread to `fixed`. `keep open` -> `still open`; `decline` -> `declined - <reason>`. The description edit is not gated: the finishing exemption in `AGENTS.md` ("PR title/body is not reporter-facing") extends to this block, stated there in the same change. Options 2-6 behave as today's Options 1-5 (Option 6 removes only the worktree and local branch).

### Handoff and resume

`gauntlet-handoff` step 6, when the spec at the run worktree carries `## Rework record`, appends two lines between `Active task:` and the gate-history line: `PR: <owner/repo#N>` and `Pre-rework head: <sha>`. `brief-contract.md` lists them in the section table as optional, present only for a PR subject, and the appended block still ends with the gate-history line. `gauntlet-resume`'s process-state restore reads `PR:` when present and confirms `git -C <worktree> branch --show-current` equals the PR's `headRefName` (`gh pr view <N> --json headRefName`); mismatch -> stop: `brief names PR #N on <headRefName>, worktree is on <branch>`. `reconstruction.md` "Candidates" gains one sentence: when the brief carries `Pre-rework head:`, `<base>` for the spec and plan candidate scans is that SHA instead of `merge-base HEAD origin/HEAD`, so the PR's own earlier spec is never a candidate and the "more than one spec" pick is not reached. Nothing else in resume changes; a brief without the lines behaves as today.

### `brainstorming/SKILL.md` edits

HARD CONSTRAINT gains the one-sentence base-merge exception (Design "Base merge"). Checklist step 2 gains: "a tracker reference is resolved first per `reference/pr-subject.md`; a PR subject passes its head to `/skill:using-git-worktrees`' PR-head path." `### 3` gains the framing-check sentence (Design "Gather"). "Worktree First" gains one sentence: for a PR subject the worktree is the PR's branch and the spec commit is appended to it. "Filename Convention" gains the `pr-<N>` slug rule. Every other edit this spec names lives in the Ownership table; sections not named there do not change.

## Errors and edge cases

| Case | Behavior |
|---|---|
| Reference mentioned mid-sentence in a free-text prompt | free-text subject; context-builder as today; no PR step |
| PR closed, merged, or draft-closed | one-line stop at resolution; no worktree |
| Draft PR (`isDraft`) | proceeds; drafts are open |
| `owner/repo#N` or URL naming a PR in another repository | one-line stop before provisioning naming both repositories |
| Head on a fork | one-line stop before any write |
| `headRefName` checked out in another worktree (including gatekeep's `.worktrees/pr-<N>` when it is on that branch) | one-line stop naming the path |
| Session already inside an unrelated linked worktree | not adopted; `pr-head.md` provisions the PR branch's own worktree |
| Local branch `<headRefName>` behind origin | fast-forwarded after the ancestor check, then checked out |
| Local branch `<headRefName>` ahead of or diverged from origin | one-line stop before any write naming both SHAs |
| Overrides `create:` contains `-b` | override skipped for the PR subject; built-in checkout runs; report notes it |
| Head force-pushed between `gh pr view` and checkout | post-create HEAD check stops with both SHAs; the created worktree is left for the user, named in the stop |
| Base merge conflict, helper resolves | merge commit lands; scoped test results in the record |
| Base merge conflict, helper reports a contract exception | merge commit lands; the record's `Changes:` names the exception |
| Base merge conflict, helper fails | `merge --abort`; unmerged head; constraints still read from `BASE_SHA`; merge is the plan's task 1 |
| PR edits `AGENTS.md`, the overrides, or `REVIEW.md` and merges clean | base-SHA copies govern; the PR's edit is a `changes:`/`dropped claims:` line |
| `requires credentials: true` or no file-scoped runner documented | scoped tests `none`; record says `none run (<reason>)` |
| Thread query fails | `threads: not fetched (<reason>)` in the draft and record; no stop |
| Thread location outdated (`line` null) | `<path>:<originalLine> (outdated)`, else `<path>` |
| Bound ticket fetch fails | ticket-acceptance's `none - ticket not fetched (<reason>)` path, unchanged |
| Title and body first line name different tickets | title wins; the other is named in `## Problem` as context |
| PR carries a spec from an earlier gauntlet run | gathered as the stated contract; `**Predecessor:**` names it when superseded; resume scans from `Pre-rework head:` so no spec pick |
| Any later step tries to rebase the PR branch | forbidden by the merge-forward rule; finishing's ancestor check stops a rewritten history |
| At finish, `origin/<headRefName>` moved | push row withheld with both SHAs; "moved past the base" claimed only after the ancestry check; rows 2-6 remain |
| Ticket run re-finished with an open PR on `$FEATURE` | no `## Rework record` -> today's five-option menu |
| Rework PR closed or merged before finishing | one-line stop naming the state; no `gh pr create` fallback |
| Threads opened during the rework | refetched at finish; rendered `still open` |
| Push rejected by the server (protection) | reported once as the push's failure; no `gh pr edit`; menu re-presented |
| `gh pr edit` fails after a successful push | reported; the push stands; the block text is printed for a manual paste |
| Spec lacks `Pre-rework head:` at a PR-subject finish | stop naming the spec path |
| Resume brief `PR:` line and worktree branch disagree | stop with both names |
| Ticket or free-text subject | no PR step runs; `-b` create, `gh pr create` rows, today's brief - byte-for-byte current behavior |

## Tests

Two test populations, kept apart: **delivering this change** runs `npm test` (`scripts/ci.mjs`: skill lint, instruction-size lint, eval structural lint) and the eval targets below - the ticket's AC7; **the PR-rework workflow this change produces** runs only the conflict-scoped tests at brainstorm, the wave `SCOPED_TEST_COMMANDS` at implement, and the task `Tests:` union plus the header's lint and format line at verify and finish - never a full test entrypoint (Design "Spec content", last paragraph).

**Baseline.** `pr-subject.md` and `pr-head.md` land in a preparatory commit before any site edit; every eval run below passes `--base <that commit>` so both arms assemble the new files, and each target's `intent.md` names the commit (`eval/README.md`: a file with no version at the baseline refuses the run). Existing `target.json` files are not edited; new samples add their files with `bundle+` lines in `case.md`, so existing samples' assemblies and `skillSha` stay as they are.

Eval samples, one per touched target, each with `intent.md` updated and `node eval/run.mjs <target> --base <preparatory commit>` run at the end (per-sample partial runs while iterating):

| Target | Sample (`bundle+`) | Must hold |
|---|---|---|
| `eval/brainstorming` | `pr-subject-resolution` (`reference/pr-subject.md`) | a trimmed `#N` resolving to an open PR produces the PR-subject path (slug `pr-<N>`, worktree on `headRefName`), with the PR lookup before the issue lookup; the same `#N` resolving to an issue produces today's ticket path; neither -> the one-line stop; `#N` mid-sentence stays free text; `owner/repo#N` for another repository stops naming both |
| `eval/brainstorming` | `pr-subject-rule-added-later` (AC1 check; `reference/pr-subject.md`) | synthetic draft: PR compliant at fork, base gained a rule; the spec's `## Problem` names the rule as a constraint, `## Rework record` `Changes:` names the repair and `Keeps:` the original commits |
| `eval/brainstorming` | `pr-subject-weakened-rule` (`reference/pr-subject.md`) | synthetic draft: the PR edits a rule file and merges clean; the spec judges the diff by the base-SHA rule and lists the edit under `changes:`, never as a constraint |
| `eval/brainstorming` | `pr-subject-repair-over-rewrite` (AC2 check; `reference/pr-subject.md`) | synthetic draft: a two-line fix satisfies the rule; the record proposes that change, not a rewrite |
| `eval/using-git-worktrees` | `pr-head` (`reference/pr-head.md`) | entry from an unrelated linked worktree is not adopted; create without `-b`, HEAD == `headRefOid`, merge line rendered; the fork, checked-out-elsewhere, unreachable, and diverged-local cases each stop before any write with the named line; a `create:` with `-b` is skipped; three thread pages, a reply that changes the requested repair, and an outdated location each render |
| `eval/writing-plans` | `pr-subject-threads` | each `fix` thread is one task with the thread id in its title; `unresolved` merge is task 1; the header `**Verification:**` line carries lint and format only, never the full entrypoint or a task `Tests:` command |
| `eval/finishing-a-development-branch` | `pr-subject-push` (`SKILL.md`) | a spec with `## Rework record` renders the six-row menu, a spec without it the five-row menu even with an open PR on the branch; row 1 runs `update-ref`, a push without any force flag, and appends the `## Rework` block with the original body unchanged, one line per refetched thread, `Threads: none` on an empty set, `fixed in` only for a complete task plus one naming commit; moved-origin case withholds the push row with both SHAs; rewritten history stops |
| `eval/gauntlet-resume` | `pr-subject-brief` (`skills/gauntlet-handoff/SKILL.md`, `reference/brief-contract.md`, `reference/reconstruction.md`) | the handoff producer writes `PR:` and `Pre-rework head:` for a rework spec and nothing extra otherwise; a brief with the lines resumes on the PR branch and scans candidates from the pre-rework head (the PR's earlier spec is not a candidate); the mismatch case stops |

Existing samples in all touched targets and in `eval/gatekeep-pr` pass unchanged.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` "What a run looks like" (step 1 gains the PR subject entry form, step 5 the push-to-PR landing row and the `refs/gauntlet/pre-rework/pr-<N>` ref - major procedures); `AGENTS.md` "Gated writes to human channels" (the finishing exemption names the `## Rework` block - communication contract); `CHANGELOG.md` - deferred: release
- Derived / memory docs invalidated: `README.md` "What a run looks like" step 1 ("ticket or free text" is now incomplete)

## Out of scope

- Multi-PR gating, `--rebase` sync, and claim verification before merge (`/skill:gatekeep-pr`, #79).
- Fork-hosted PR heads (a stop, not a path).
- Replying to review threads on the PR; the `## Rework` block states dispositions, it does not post to threads.
- Merging the PR or changing the bound ticket's state.
- A `close` verdict, landing order across PRs, or a disk-backed continuation record (#77's dropped scope).
- pi-cohort changes of any kind.

## Open questions

none
