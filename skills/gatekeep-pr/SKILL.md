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
- **Required CI checks:** a failing or pending **required** status
  check withholds merge from every pre-composed course until the user explicitly
  dispositions it - flaky (proceed via the custom row) or real (it blocks). Non-required
  checks are informational, listed in Evidence only.
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
re-poll withholds merge, same as `CONFLICTING`); no undispositioned failing required
check; evidence pasted with clean provenance; worktree clean and synced with the remote
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

Plus always: a final **custom row** composing the full action vocabulary (apply code
fixes / push doc fixes / post review / reply to thread / merge / tracker comment when
a tracker tool resolved). Rows GitHub would refuse (branch protection, missing
permissions, `viewerPermission` too low) are listed as unavailable with the reason.
Approving your own PR is not offered. Nothing executes until explicit selection.

## Output

```markdown
## Outcome
<one line + the deciding factor>

## Evidence
<verbatim command + raw_tail per run; claims checked; CI rollup with required-check disposition>

## Findings (blocking)
<file:line, defect, fix>

## Non-blocking follow-ups
<list, or "None">

## Decision
<the menu>

## Drafted fixes / review
<the exact payload to be applied or posted>
```

Empty lists say "None". For code fixes, "Drafted fixes / review" holds the concrete
edit per finding; for reviews, the full body - one summary sentence, then numbered
file:line findings, ending on the fix.

## Post-selection loop

The menu is a state machine, not a one-shot report:

1. **Compare-and-swap before every external write:** re-fetch `headRefOid`, `state`,
   `mergeable`. Any change since assessment invalidates the current state - re-sync
   the worktree, re-run Phase 3, re-render the menu.
2. Execute only the selected row: code fixes -> commit on the PR branch (subject
   names the fix), re-run the gate, push. Doc fixes -> stage + commit (subject names
   what is documented), re-run the gate, push. Reviews and comments -> `gh pr review`
   / `gh api`, non-interactive, with the drafted body.
3. After any mutation that can change readiness (fix pushed, docs pushed, PR head
   moved), re-run Verify + Review on the synced worktree and re-render `## Outcome`,
   `## Evidence`, `## Findings`, and the menu.
4. Loop until the user selects merge or an explicit stop/no-action row.

**Teardown:** merge success -> tear down the worktree, whether it was reused or
created (the sync precondition guarantees no local-only work is stranded, and the
branch is gone remotely). A non-merge stop: offer teardown of a **created** worktree
(never autonomous; warn if unpushed doc edits would be discarded); a **reused**
worktree is left as found - if unpushed doc edits remain in it, say so explicitly and
let the user choose leave-or-discard.

## Red flags - STOP

- Approving your own PR
- Any mutation (fix, push, review, merge) without an explicit menu selection
- Pasting paraphrased evidence instead of verbatim `raw_tail`
- A provenance mismatch (worktree, `run_cwd`, or `head_sha`) noticed and ignored
- Merging around an undispositioned blocking finding or required-check failure
- Reading configuration (rubric, verification command, or ladder sources) from the
  PR's head instead of the base branch's merge-base

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Any sections relevant to this skill - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - override or extend the instructions above. Project-local `AGENTS.md` is already in context - check it for project-specific routing tables, service paths, and verification commands.
