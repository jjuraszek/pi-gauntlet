---
name: gatekeep-pr
description: Use when gating a pull request before it merges - whether you authored it or are reviewing someone else's work. Consent-gated - verification is read-only, every externally visible mutation (fix commits, pushes, reviews, merges) waits for explicit selection.
disable-model-invocation: true
argument-hint: "<pr> [issue-ref]  (e.g. 123, or 123 gh-45)"
---

# gatekeep-pr

Verify, don't trust. A PR description is a claim, not proof: over-claimed coverage,
hallucinated references, and "tests pass" that were never rerun are the normal case,
not the exception - especially on generated code. This skill gathers evidence, runs
the project's own verification command, reviews the diff against a rubric, and
presents a deterministic, authorship-aware menu. Authorship sets which row carries
`[recommended]`; it never changes which rows are offered.

**Consent gate.** The only actions this skill performs before you pick a menu row are:
read-only gathering, provisioning the worktree, and applying uncommitted, worktree-local
doc-drift fixes discovered as a blocking finding. Every other action - code fixes,
pushes, reviews, comments, merges - happens only on your explicit selection.

**Residual risk.** Running the verification command executes PR code with the
operator's ambient credentials. There is no sandbox. Only run this skill against PRs
you are willing to execute.

## Arguments

- PR number or URL. If omitted: `gh pr view --json number,url` on the current branch;
  no PR found there -> STOP and report.
- Optional issue reference. If omitted: infer from `closingIssuesReferences`, then
  branch name, PR title, body, or commits. None found -> judge the PR against its
  stated intent only; never invent acceptance criteria.

## Configuration resolution

Applied per concern, first match wins, evaluated unconditionally - never delegated to
a wrapper skill:

1. **Repo root `REVIEW.md`** (rubric concerns only). Always wins over the shipped
   baseline and reviewer-persona defaults on any conflict.
2. **Gauntlet overrides file** (3-location discovery, first found wins): the
   `## PR gate` section (verification command, `timeout minutes`, `requires credentials`, issue
   fetch, worktree wrapper, merge policy). An existing `## verification-before-completion`
   section is an accepted equivalent source for the verification command.
3. **Repo documentation** - an explicitly documented command or tool (e.g. `AGENTS.md`'s
   canonical test entrypoint, a documented worktree wrapper, a documented tracker CLI,
   or documented merge policy/branch rules). Reading documentation is not inference.
   Discovery-only: consumers are never told to add gatekeep-pr configuration here.
4. **Ask the user.** Never guessed from lockfiles, file heuristics, or vibes.

The `## PR gate` overrides schema (all keys optional except the verification command,
which is required unless documented elsewhere):

```markdown
## PR gate
- verification command: <command>            # required unless documented elsewhere
- timeout minutes: 15                        # optional; default 15
- requires credentials: false                # optional; true => skill reports "not run" as missing evidence
- worktree wrapper: <command>                # optional
- issue fetch: <command with <ref> placeholder>   # optional, replaces gh issue view
- merge policy: squash | merge-commit        # optional
```

**Thin-wrapper contract.** A consumer wrapper skill is a pure proxy: trigger phrases
plus "follow `/skill:gatekeep-pr`" - zero configuration data. All customization lives
in the repo's `REVIEW.md` (rubric) and the gauntlet overrides file's `## PR gate`
section (everything else); anything a wrapper carries beyond trigger phrases is
misplaced and belongs in one of those two homes instead.

All of the above is read from the **merge-base of the PR's base branch**, never from
the PR's head tree - a PR cannot weaken its own rubric or swap the command that will
gate it. Recipe: `MB=$(git merge-base origin/<baseRefName> <headRefOid>)`, then for
each ladder source `git show "$MB:<path>"` (e.g. `git show "$MB:REVIEW.md"`,
`git show "$MB:AGENTS.md"`). A plain cwd read (`cat REVIEW.md`, reading the file open
in the PR worktree) is invalid for any ladder source - it reads the PR's head, exactly
what this rule forbids - even when the assessment happens to run from inside the PR's
worktree. Exception: if the PR itself changes `REVIEW.md` or the overrides file, that
diff is review subject matter, surfaced as a finding - it is not applied to this run's
configuration.

## Progress tracking

Use `plan_tracker`, never `phase_tracker`. Init with the stage names: `gather`,
`provision worktree`, `run verification`, `claim-check`, `review`, `consent menu`.
Append one task per material claim as the Verifier enumerates them. A passing stage or
a matched claim -> `complete`. A failed stage or a contradicted claim -> `failed`
(shown crossed, error color) and stays failed while the skill stops at the menu -
never marked complete to move on. On a harness without the `plan_tracker` tool: fall
back to a plain checklist (or skip if none is available); functionality is unchanged
either way.

## Assessment

Four phases, run in order, read-only through Phase 3:

**Phase 1 - Gather.** Run verification-brief.md Section A in full: the fixed `gh`
command set (`gh pr view`, `gh api user`, `gh pr diff`, both paginated comment
endpoints, review threads, issue fetch, `git worktree list --porcelain` for
discovery only), producing the normative gather digest.

**Phase 2 - Provision worktree** (the orchestrator's mutation - a state machine):

- A worktree already exists on the expected branch (`headRefName` for in-repo PRs,
  a fork-local `pr-<N>` branch for fork PRs), at any path -> reuse it unconditionally.
  In-repo PRs: `git fetch origin` + `git pull --ff-only` (the local branch tracks
  `origin/<headRefName>`). Fork PRs: the local `pr-<N>` branch has no upstream, so
  sync with `git fetch origin pull/<N>/head` + `git merge --ff-only FETCH_HEAD`
  instead. Either way, on divergence, dirt, or local-only commits -> STOP and surface.
  Never force, never create a duplicate.
- The default path `.worktrees/pr-<N>` exists but holds a different branch -> STOP
  and surface; never repurpose.
- Nothing exists -> create at `.worktrees/pr-<N>` (an overrides worktree wrapper may
  relocate it), following `using-git-worktrees` conventions (gitignore-first). In-repo
  PRs: `git fetch origin` + `git worktree add .worktrees/pr-<N> <headRefName>`. Fork
  PRs: `git fetch origin pull/<N>/head:pr-<N>` first, then add on that local branch.
  Verify post-checkout that HEAD == the digest's `headRefOid`.

Record create-vs-reuse; it drives the non-merge teardown rule below.

After provisioning, re-poll `mergeable` once (`gh pr view --json mergeable`) if Section
A reported `UNKNOWN` - still `UNKNOWN` after this single re-poll is treated as not
merge-ready and surfaced (see the merge preconditions below).

**Phase 3 - Verify, then Review** (sequential, same worktree - deliberate: the
verification command may write to the tree while the Reviewer reads it):

- Run verification-brief.md Section B: the resolved verification command under its
  safety contract - self-contained and non-interactive (no prompts; run under a
  non-interactive environment), bounded by a timeout (default 15 minutes, `timeout
  minutes` override) via the first available mechanism: the harness's own bash
  timeout parameter, else the `timeout`/`gtimeout` CLI when installed, else a
  background-and-kill fallback - then material-claim checking against the PR body.
  After the run,
  the orchestrator asserts tracked-only cleanliness (`git status --porcelain
  --untracked-files=no` empty, equivalently `git diff --quiet && git diff --cached
  --quiet`; HEAD unmoved) - untracked gate artifacts, including the Verifier's
  `log_path`, are expected and do not fail this check as long as `log_path` sits
  under a gitignored path inside the worktree. Any tracked change invalidates the
  run - re-provision and re-run once.
- Run verification-brief.md Section C: review the source behind the diff against the
  merged rubric (shipped `review-baseline.md` overlaid by base-branch `REVIEW.md`),
  triage existing comments. The Reviewer emits its native output format only - AC
  coverage is not part of its contract.

**Phase 4 - Integrate** (orchestrator):

- **Provenance:** `worktree_root` matches the provisioned path, every `run_cwd` is
  inside it, `head_sha` matches the digest's `headRefOid`. On mismatch, re-fetch the
  PR head once and re-sync + re-run Phase 3 if it advanced; a second mismatch, or any
  path mismatch, is treated as missing evidence - not merge-ready. The claim stated in
  output is precisely "reproduced locally under the project's documented verification
  command" - nothing stronger; never worded to imply a deployed, staging, or CI
  environment.
- **Evidence:** paste each run's `command` and `raw_tail` verbatim, fenced - never
  paraphrased. Any authored summary is labeled as a summary and never substitutes for
  `raw_tail`.
- **Severity translation:** Critical -> blocking, Moderate -> blocking, Minor ->
  non-blocking follow-up. A repo `REVIEW.md` severity mapping overrides this; any
  severity it names but does not map is fail-safe **blocking**, noted in the output.
- **AC coverage:** the orchestrator computes `met` / `partial` / `missing` per
  acceptance criterion from the issue's ACs, the diff, and the Reviewer's findings -
  it is an integration product, not raw persona output. Only `met` is merge-ready;
  `partial` or `missing` is blocking. Skipped entirely when no issue is linked.
- **Claims:** a failed local gate is a hard merge failure. A `contradicted` material
  claim is a blocking finding. An `unverifiable-pre-merge` claim used as merge proof
  (appears in the PR body's evidence/result/test-plan content) is blocking; stated as
  an explicit post-merge observation instead, it is a non-blocking follow-up.
- **Required CI checks:** a failing **required** status check withholds merge from
  every pre-composed course until the user explicitly dispositions it - flaky
  (proceed via the custom row) or real (it blocks); it mints a `P#`. A **pending**
  required check (still running - the normal case, not a defect) is **wait-until-
  green, not dispositionable**: it mints no `P#`, is never flaky/real-dispositioned,
  and the withhold auto-lifts the moment it turns green - or, if it instead fails,
  converts into an undispositioned failing check with its own `P#` at that point.
  While pending, the report notes it under Evidence and every merge course simply
  does not render (a pending-only PR is not a blocking verdict - findings groups can
  all read "None" - the recommended course falls to `stop` or `review-comment`,
  never a merge course, until it resolves). Non-required checks are informational,
  listed in Evidence only.
- **Doc drift:** when the review finds committed doc drift as a **blocking** finding,
  the orchestrator applies the doc fixes itself, in the provisioned worktree (created
  or reused), as part of assessment - real edits, uncommitted, worktree-local. The
  result is presented in `## Findings`, the edits themselves under
  `## Drafted fixes / review`. Pushing them is a separate, later menu selection.
  Follow-ups alone never trigger doc fixes - only blocking drift does.

## Inline-first execution

> This section is an optional optimization. Delete it and the rest of the skill still
> works: the orchestrator can run every phase above itself, inline, with no subagent
> system.

The inline path is primary: the orchestrator runs the brief's sections itself, in
order, self-contained. When pi-cohort is available, delegation is an optimization
layered on top, never a hard dependency:

- **Gatherer** -> `scout` builtin, as a prior sync run producing the gather digest.
- **Verifier** -> `worker` builtin, dispatched with the report-only constraint
  prepended to its task ("report only - do not edit, fix, or commit anything").
- **Reviewer** -> the existing `code-reviewer` agent, emitting its native output
  format (never overridden at call time).

Verifier and Reviewer share the provisioned worktree via `cwd`, dispatched
**sequentially** (Verify before Review, per Phase 3) - never `worktree: true`, which
would provision a separate isolated worktree and break the shared-tree contract this
skill depends on. A subagent that fails, or violates its section's output schema, is
re-dispatched once demanding the schema; a second failure means that section runs
inline instead.

## Verdict

Three states: **blocking findings** (failed gate, contradicted material claim, a
merge-proof unverifiable claim, `partial`/`missing` AC coverage, scope creep when an
issue is linked, committed doc drift, anything the merged rubric maps to blocking),
**follow-ups only** (never gate merge), or **clean**.

**Merge preconditions** (all must hold): gate green with every blocking finding fixed,
not deferred; `mergeable == MERGEABLE` (`UNKNOWN` after the one post-provision
re-poll withholds merge, same as `CONFLICTING`); no undispositioned failing or
pending required check; evidence pasted with clean provenance; worktree clean and synced with the remote
head (fixes pushed first); explicit selection with a head compare-and-swap that
passes. A merge selection while any precondition fails is refused, naming the failing
precondition, and the menu re-renders - never a dead end, never a silent merge. Merge
always executes as `gh pr merge --match-head-commit <assessed-sha>`; push and merge
are never bundled into one selection.

**Consent menu** (deterministic - this table is the golden-scenario oracle):

| Author | State | Offered rows (first = `[recommended]`) |
|---|---|---|
| you | clean / follow-ups only | merge (squash); merge (merge-commit); do not merge (leave it); post no-blockers comment |
| you | blocking | apply code fixes (named finding subset): skill edits in worktree, commits, re-runs gate, pushes - then merge re-offered; push applied doc fixes; do not act; post review-comment of findings |
| someone else | clean / follow-ups only | approve; merge (squash, offered-unrecommended); post no-blockers comment |
| someone else | blocking | post request-changes review; apply fixes on their branch (courtesy option 2); reply to existing threads; post comment |
| bot author | any | someone-else's rows for the same state, review actions recommended |
| fork (any) | any | post review (request-changes / comment / approve per state) - push and merge rows absent |
| any | draft PR | assessment rows only; merge and approve rows absent until ready-for-review |
| any | merged / closed | report-only; no mutation rows |

The consent table above remains the single oracle for what may be offered; the
Decision rendering section defines how its rows render as actions and numbered
courses. Rows GitHub would refuse (branch protection, missing permissions,
`viewerPermission` too low) are listed as unavailable with the reason. Approving
your own PR is not offered. Nothing executes until explicit selection.

## Output

The rendered report is terse by design: deciding factor, evidence lines, ID'd
findings, menu. No restating diffs, no narration, no recap prose.

```markdown
## Outcome
<one line + the deciding factor>

## Evidence
<verbatim command + raw_tail per run; claims checked; CI rollup with required-check disposition>

## Findings (blocking)
Blocking findings (P#):
  P1. **<source_ref>** - <defect>. Fix: <concrete change> | Action: <disposition/what unblocks>. [code | test | spec | security | performance | quality]
Requirement/doc drift (linked issue, committed doc drift, or spec conflict):
  L1. <doc-drift | spec-conflict | outdated-AC | missing-behavior> -> <action>

## Comment-thread replies (existing discussion - verdict-neutral)
  C1. <thread ref> -> <drafted reply>  (already-addressed | reasonable | judgment-call)

## Non-blocking follow-ups
  F1. **<source_ref>** - <action>. Owner: <pr-author | tracker | human>

## Decision
<action vocabulary + numbered courses - see Decision rendering>

## Drafted fixes / review
<payloads, each keyed by its finding ID>
```

**ID rules:**

- `<source_ref>` is a `file:line` where one exists, else the disputed thing (a
  quoted PR-body claim, a failing gate command, a required check name).
- **Precedence:** Phase 4 and the merged rubric decide blocking vs. follow-up (the
  severity translation, AC coverage, claims, and required-check rules above); this
  section only chooses **which namespace** (`P#` / `L#` / `F#`) renders that
  decision. Category tags and the triage bar below never override an upstream
  blocking classification - a Phase-4 Moderate is always blocking (`P#` or `L#`
  per Total mapping), never demoted to `F#` by tag or by judgment call.
- **Total mapping:** every blocking element of the Verdict maps to a `P#` or `L#` -
  a blocking verdict with "None" in both groups is a rendering bug. Concretely:
  failed gate -> `P#` `[test]` referencing the gate command; contradicted or
  merge-proof-unverifiable material claim -> `P#` `[spec]` referencing the claim;
  scope creep with a linked issue -> `L#` `spec-conflict`; committed doc drift ->
  `L#` `doc-drift`; `partial` AC coverage -> `L#` `outdated-AC`; `missing` AC
  coverage -> `L#` `missing-behavior`. `L#` covers exactly the drift the Verdict
  already blocks on (committed doc drift, AC coverage, spec conflict); it widens
  nothing. Code-level spec bugs (the diff contradicts the spec) are `P#` `[spec]`;
  requirement/doc mismatches (the spec or docs are stale relative to intent) are
  `L#`.
- **Required checks close by disposition, not by fix:** an undispositioned failing
  required check is `P#` `[test]` referencing the check name; it is never a target
  of a worktree `fix`. The user's Phase-4 disposition annotates the same ID rather
  than closing it outright: dispositioned **flaky** -> annotate
  `(dispositioned: flaky)`; this annotation excepts the `P#` from the unfixed-blocker
  set - it no longer counts against "every `P#` blocks" or the merge precondition
  "every blocking finding fixed", and the merge path is Phase 4's explicit flaky
  disposition via the custom row. Dispositioned **real** -> annotate
  `(dispositioned: real)` and the `P#` keeps blocking until the check is green.
- **Severity is decided at triage, not by the category tag:** a finding lands in
  `P#` only when it must be fixed before merge (correctness, security, material
  performance trap, a convention the repo enforces); improvements that don't
  change merge correctness are `F#`, whatever their category. `[quality]` on a
  `P#` is a category, never a downgrade - every `P#` blocks. This triage bar governs
  findings the orchestrator originates itself; it never re-triages a classification
  Phase 4 already made (see Precedence above).
- `C#` replies are verdict-neutral drafts: they never block and never gate merge;
  nothing posts until selected.
- `F#` items carry an owner so follow-ups don't evaporate; when no tracker tool
  resolved, the report itself is their durable home.
- **IDs are append-only for the run's lifetime:** minted at first assessment,
  never renumbered, never reused. A resolved finding keeps its ID annotated
  `(fixed in <sha>)`; later rounds continue each namespace's sequence.
- Empty groups say "None".

"Drafted fixes / review" holds, per finding ID, the concrete edit (for `fix`), the
reviewed doc-drift edit (for `push-docs`, keyed to its `L#`), or the reply text
(for `reply`) - each keyed to its finding ID, one selection mapping 1:1 to its
payload. A posted review body is not itself a finding: it is composed at post time
from the ID'd `P#`/`L#` findings being addressed - one summary sentence, then the
numbered findings, ending on the fix or asked action - and occupies its own
non-finding slot of this section.

## Decision rendering

`## Decision` has two parts: the action vocabulary, then the numbered courses.

**Action vocabulary** (bare verbs; availability constraints inline):

```markdown
Actions (compose freely in the custom row):
  fix <P#s|all>    apply blocking fixes in worktree, re-run gate, push  (in-repo PRs only)
  push-docs        push already-applied doc-drift edits                 (only when uncommitted
                                                                        reviewed doc edits exist
                                                                        in the worktree)
  merge-squash | merge-commit                                          (preconditions per Verdict;
                                                                        never bundled with a push)
  request-changes | review-comment | approve                           (approve: never own PR)
  reply <C#s>      post drafted thread replies
  tracker <act>    tracker action                                      (only when a tracker tool resolved)
  stop             leave the PR as-is / report-only exit
```

A `+ tracker <act>` suffix is available on any mutation course when a tracker tool
resolved.

**Selection grammar:** ID sets accept `all`, ranges (`P1-P4`), comma lists
(`P1,P3`), and exclusions (`all but P2`).

**Numbered courses** - a normative rendering of the consent table (never a second
offer source): per author x state cell, exactly one `[recommended]` course first,
the custom row always last. Courses are **atomic across pushes**: no course,
pre-composed or custom, bundles a push-producing action (`fix`, `push-docs`) with
`merge-*`; after a fix wave the menu re-renders with merge as row 1.

| Author | State | Courses (first = `[recommended]`) |
|---|---|---|
| you | clean / follow-ups only | 1. merge-squash; 2. merge-commit; 3. stop; 4. review-comment (post no-blockers note) |
| you | blocking | 1. fix (worktree-fixable P#s only - `all` covers only those) [+ push-docs when uncommitted doc edits exist]; 2. push-docs (alone, when doc edits exist); 3. stop; 4. review-comment (post findings). When no P# is worktree-fixable (blocking is required-check-only or L#-only), course 1 (fix) is not rendered: push-docs becomes first when doc edits exist, else stop is first |
| you | blocking, post-fix re-render (gate green, preconditions hold) | 1. merge-squash; 2. merge-commit; 3. stop; 4. review-comment |
| someone else | clean / follow-ups only | 1. approve; 2. merge-squash (offered-unrecommended); 3. review-comment (no-blockers note) |
| someone else | blocking | 1. request-changes; 2. fix all (courtesy, their branch - omitted when nothing is worktree-fixable); 3. reply <C#s> (omitted when the `C#` group is None); 4. review-comment |
| bot author | any | someone-else's rows for the same state; review actions recommended |
| any | draft | 1. request-changes / review-comment / reply <C#s> (omit the reply course when the `C#` group is None) / stop - `[recommended]` follows the same authorship rule as the non-draft cells, **except** on your own draft PR `request-changes` is never recommended (you cannot request changes on your own PR any more than you can approve it); the fallback recommendation there is `review-comment` when findings exist, else `stop`. Custom present but cannot compose `merge-*`/`approve`/`fix`/`push-docs` until ready-for-review |
| any | merged / closed | 1. stop; report-only, no other mutation courses at all; Custom present but cannot compose `merge-*`/`approve`/`fix`/`push-docs`/`request-changes`/`review-comment`/`reply`/`tracker` - nothing remains actionable |

**Fork overlay:** the consent-table fork row renders as an overlay on the authorship
cells (push/merge/fix absent; approve also dropped when the viewer authored the PR) -
it is not a distinct authorship cell. It overlays whichever authorship row above
applies (you vs. someone else), removing `fix`, `push-docs`, and `merge-*` (never
available on a fork). When you authored the fork PR, `approve` is
also dropped (never offered on your own PR) - fork|you|clean renders
`review-comment`/`stop` only; fork|you|blocking renders
`request-changes`/`review-comment`/`stop` (the someone-else courtesy fix-on-their-
branch course is also absent, since it is your own PR). A fork PR authored by someone
else uses the someone-else cells above with `fix`/`push-docs`/`merge-*` removed.

**Required-check gate on merge courses:** an undispositioned failing **or pending**
required check withholds every pre-composed course containing `merge-*` (per the
Verdict merge preconditions) - none render, whatever the author/state cell says. A
pending check mints no `P#` and is wait-until-green, not dispositionable (see Phase
4); a failing one mints a `P#` and takes a disposition. A **flaky** disposition does
not restore merge to a pre-composed course; merge proceeds only via the custom row
naming the disposition explicitly. A **real** disposition, or an unresolved pending
check, keeps every merge course withheld until the check is green - a pending-only
render is not itself a blocking verdict (findings groups may all read "None"); the
recommended course falls to `stop` or `review-comment` in the meantime. This never
falls through to the clean cell's recommended `merge-squash` - a required-check
failure or pend means the PR is not in the clean state to begin with.

Rows a cell offers but GitHub would refuse (branch protection, missing permission)
render listed-but-unavailable with the reason. Zero mutation courses is a legal
render (merged/closed) - the menu still appears, carrying findings and `stop`.

Example render (golden fixture 1 - own PR, blocking findings including committed doc
drift, so uncommitted reviewed doc edits exist):

```markdown
Pick one:
  1. fix all (P1-P10) + push-docs   [recommended]
  2. push-docs (docs only, hold code fixes)
  3. stop (leave as-is)
  4. review-comment (post findings, act later)
  5. Custom - compose: e.g. "fix P1-P8,P10 + push-docs" or "reply C1 + tracker comment"
```

Golden fixture 2 - the post-fix re-render after course 1's gate re-run passes:

```markdown
Pick one:
  1. merge-squash   [recommended]
  2. merge-commit
  3. stop (leave as-is)
  4. review-comment
  5. Custom
```

## Post-selection loop

The menu is a state machine, not a one-shot report:

1. **Compare-and-swap before every external write:** re-fetch `headRefOid`, `state`,
   `mergeable`. Any change since assessment invalidates the current state - re-sync
   the worktree, re-run Phase 3, re-render the menu. **Exception:** a course's own
   push updates the assessed head to the pushed SHA as part of that course's
   execution - this self-inflicted head move does not invalidate the course; the
   next CAS check runs against the new head on the next external write.
2. Execute only the selected course. **Fix wave** (`fix <set>`): first filter the
   selected set to worktree-fixable `P#`s - drop any `P#` closed by disposition
   (an undispositioned required-check failure is never a `fix` target; a **flaky**
   disposition already excepts it) - and route file-less `P#`s (a claim or a gate
   command as `source_ref`, no draft touching a file) to run inline/sequentially,
   never as part of a parallel file-batch.

   For the remaining worktree-fixable set, batch by the **union of files each
   finding's drafted edit in `## Drafted fixes / review` touches** (fallback to
   the `source_ref` file only when a finding has no draft) - findings whose
   drafts share a file share a batch.

   **Child contract (same for 1 batch or many):** children are `implementer`
   dispatches - `subagent({ agent: "implementer", context: "fresh", cwd: <PR
   worktree> })`, matching Inline-first execution's persona-naming style; this is
   the pi-cohort optimization path, inline is always valid per that section. The
   orchestrator owns commit, gate, and push - never a child. Every dispatched
   child gets `cwd` = the PR worktree, **`worktree: true` forbidden** (a separate
   isolated worktree breaks the shared-tree contract - see Inline-first
   execution); is **edit-only, no git commands, no verification runs**; and its
   task is that batch's `P#` lines **plus the drafted edit already keyed to each
   ID** in `## Drafted fixes / review` - the child applies the consented payload,
   it does not re-solve the finding. Below the cutoff (<= 2 worktree-fixable findings), the orchestrator
   applies inline instead of dispatching - the no-cohort path stays available at
   any batch count per Inline-first execution. Above the cutoff, when more than
   one batch results, dispatch the batches' children **in parallel**, all under
   the same contract.

   Once every dispatched/inline batch returns, the orchestrator commits the golden
   course as one local commit set - the code fixes plus any already-applied
   reviewed doc edits selected alongside them (one commit, or one per batch
   sequentially; subjects name the fixes) - then re-runs the gate **once**. **On
   green**, push **once**; gate and push are per-wave invariants, never per-fix or
   per-batch. **On red**, do not push: leave the commit(s) local, re-render with
   the unresolved `P#`s still open, and warn that unpushed fix commits sit in the
   worktree exactly like unpushed doc edits (see Teardown). Doc fixes (`push-docs`
   alone) follow the same green-gate-then-push rule: stage + commit (subject names
   what is documented), re-run the gate, push only on green. Reviews, replies, and
   tracker actions -> `gh pr review` / `gh api` / the tracker tool, non-interactive,
   with the drafted payload for the selected IDs.
3. After any mutation that can change readiness (fix wave pushed, docs pushed, PR
   head moved), re-run the claim-check and Review on the synced worktree: claims
   are re-checked against the new head and findings are re-rendered, but the
   verification command itself is **not** re-executed here - step 2's gate run
   already was the wave's one and only execution of it. Re-render the report:
   each selected `P#`/`L#` confirmed resolved is annotated `(fixed in <sha>)`
   under its original ID; unresolved ones stay open unchanged; new findings
   continue the sequence. Merge, if now available, renders as row 1.
4. Loop until the user selects merge or an explicit stop/no-action row.

**Teardown:** merge success -> tear down the worktree, whether it was reused or
created (the sync precondition guarantees no local-only work is stranded, and the
branch is gone remotely). A non-merge stop: offer teardown of a **created** worktree
(never autonomous; warn if unpushed doc edits would be discarded); a **reused**
worktree is left as found - if unpushed doc edits **or unpushed fix commits from a
red-gate hold** remain in it, say so explicitly and let the user choose
leave-or-discard.

## Output done-check

Before posting or committing any externally persisted payload - review bodies,
thread replies, commit subjects, tracker comments - re-read it against:

- ASCII only: `-`, `...`, straight quotes.
- No headings or template scaffolding on payloads under ~150 words - bullets and
  prose carry short content.
- Review findings are file:line-specific where one exists, else keyed to the
  finding's `source_ref`, and end on the fix or asked action, not a recap.
- Empty sections say "None"; never invent content to fill a section.

The check governs external payloads only - the skill's own rendered report keeps
its fixed headings regardless of length. Project rules extend this list via the
overrides file - see Project overrides.

## Red flags - STOP

- Approving your own PR
- Any mutation (fix, push, review, merge) without an explicit menu selection
- Pasting paraphrased evidence instead of verbatim `raw_tail`
- A provenance mismatch (worktree, `run_cwd`, or `head_sha`) noticed and ignored
- Merging around an undispositioned blocking finding or required-check failure
- Reading configuration (rubric, verification command, or ladder sources) from the
  PR's head instead of the base branch's merge-base
- Renumbering or reusing a finding ID between menu rounds
- Presenting findings without IDs, a blocking verdict with no `P#`/`L#`, or a
  `## Decision` rendered without its action vocabulary
- Treating `[quality]` or `[performance]` as a downgrade signal on a `P#` - only
  an explicit Phase-4 flaky disposition excepts a required-check `P#` from the
  unfixed-blocker set, never a category tag
- A course (pre-composed or custom) bundling a push-producing action with
  `merge-*`
- A pre-composed course, or a custom row, composing an action the overlay or the
  cell lists as unavailable
- Batching a file-less `P#` (a claim or a gate command as `source_ref`, no draft touching a file)
  into a parallel dispatch - a claim `P#` with a drafted file edit is
  worktree-fixable and may batch - dispatching parallel implementers over
  batches that share a file, or letting a fix-wave child run git commands or a
  verification pass in the shared worktree, or dispatching a fix-wave child with
  `worktree: true`
- A second execution of the verification command, a second push, or pushing fix
  commits after a red gate, within one fix wave - re-running Verify/Review to
  re-confirm claims and annotate IDs (step 3) is not a second gate execution
- Posting or committing an external payload without the output done-check

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Any sections relevant to this skill - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - override or extend the instructions above. Project-local `AGENTS.md` is already in context - check it for project-specific routing tables, service paths, and verification commands. A `## comms style` section in the overrides file extends the output done-check with project rules.
