# gatekeep-pr: assessment

Read from SKILL.md `## Assess`. Four phases run in order; Phases 1-3 are read-only.

## Phase 1 - Gather

Run `../verification-brief.md` Section A in full: the fixed `gh` command set
(`gh pr view`, `gh api user`, `gh pr diff`, both paginated comment endpoints,
review threads, issue fetch, `git worktree list --porcelain` for discovery
only). It produces the normative gather digest.

## Phase 2 - Provision worktree

The orchestrator's mutation - a state machine.

| State | In-repo PR | Fork PR | On divergence |
|---|---|---|---|
| A worktree exists on the expected branch (`headRefName` for in-repo PRs, a fork-local `pr-<N>` branch for fork PRs), at any path | Reuse unconditionally; sync with `git fetch origin` + `git pull --ff-only` (the local branch tracks `origin/<headRefName>`) | Reuse unconditionally; the local `pr-<N>` branch has no upstream - sync with `git fetch origin pull/<N>/head` + `git merge --ff-only FETCH_HEAD` | STOP and surface on divergence, dirt, or local-only commits; never force, never create a duplicate |
| The default path `.worktrees/pr-<N>` exists but holds a different branch | STOP and surface; never repurpose | STOP and surface; never repurpose | - |
| Nothing exists (an overrides worktree wrapper can relocate it, following `using-git-worktrees` conventions, gitignore-first) | Create at `.worktrees/pr-<N>`; `git fetch origin` + `git worktree add .worktrees/pr-<N> <headRefName>`; verify post-checkout that HEAD == the digest's `headRefOid` | Create at `.worktrees/pr-<N>`; `git fetch origin pull/<N>/head:pr-<N>` first, then add on that local branch; verify post-checkout that HEAD == the digest's `headRefOid` | - |

Record create-vs-reuse; it drives the non-merge teardown rule in `post-selection-loop.md`
`### Teardown`.

After provisioning, re-poll `mergeable` once (`gh pr view --json mergeable`) when
Section A reported `UNKNOWN`. Still `UNKNOWN` after this single re-poll is treated as
not merge-ready and surfaced (merge preconditions per SKILL.md `## Verdict`).

## Phase 3 - Verify, then review

Sequential, same worktree - deliberate: the verification command can write to the tree
while the Reviewer reads it.

Run `../verification-brief.md` Section B: resolve the verification evidence per its
Evidence resolution table (green exact-head CI is the default evidence). Run the
resolved verification command only when the table selects a fallback or opt-out row,
under its safety contract: self-contained and non-interactive (no prompts, under a
non-interactive environment), bounded by a timeout (default 15 minutes, `timeout
minutes` override) via the first available mechanism - the harness's own bash timeout
parameter, else the `timeout`/`gtimeout` CLI when installed, else a background-and-kill
fallback. Then check material claims against the PR body.

After a local run, assert tracked-only cleanliness: `git status --porcelain
--untracked-files=no` empty, equivalently `git diff --quiet && git diff --cached
--quiet`; HEAD unmoved. Untracked gate artifacts, including the Verifier's `log_path`,
are expected and do not fail this check as long as `log_path` sits under a gitignored
path inside the worktree. Any tracked change invalidates the run: re-provision and
re-run once.

Run `../verification-brief.md` Section C: review the source behind the diff against
the merged rubric - shipped `../review-baseline.md` overlaid by base-branch
`REVIEW.md` - and triage existing comments. The Reviewer emits its native output
format only; AC coverage is not part of its contract.

## Phase 4 - Integrate

Orchestrator step.

- **Provenance:** `worktree_root` matches the provisioned path, every `run_cwd` sits
  inside it, `head_sha` matches the digest's `headRefOid`. On mismatch, re-fetch the
  PR head once and re-sync + re-run Phase 3 when it advanced; a second mismatch, or
  any path mismatch, counts as missing evidence - not merge-ready. The claim stated
  in output names its source. Local path: precisely "reproduced locally under the
  project's documented verification command" - nothing stronger; never worded to
  imply a deployed, staging, or CI environment. CI path (`source: ci`): precisely
  `verified by CI: <check name(s)> succeeded on <sha> (run <url>)` - never phrased as
  local reproduction, never implying the local command ran; `<sha>` is the assessed
  `headRefOid`, `<url>` degrades to `unavailable` when absent. Provenance checks on
  `worktree_root`/`run_cwd` bind only to the local path.
- **Evidence:** on the CI path, list each satisfying check's name, conclusion,
  assessed SHA, and run URL - there is no command or `raw_tail` to paste. On the
  local path, paste each run's `command` and `raw_tail` verbatim, fenced - never
  paraphrased. Any authored summary is labeled as a summary and never substitutes for
  `raw_tail`.
- **Severity translation:** Critical -> blocking, Moderate -> blocking, Minor ->
  non-blocking follow-up. A repo `REVIEW.md` severity mapping overrides this; any
  severity it names but does not map is fail-safe **blocking**, noted in the output.
- **AC coverage:** the orchestrator computes `met` / `partial` / `missing` per
  acceptance criterion from the issue's ACs, the diff, and the Reviewer's findings -
  an integration product, not raw persona output. Only `met` is merge-ready;
  `partial` or `missing` is blocking. Skip entirely when no issue is linked.
- **Claims:** a failed local gate is a hard merge failure. A `contradicted` material
  claim is a blocking finding. An `unverifiable-pre-merge` claim used as merge proof
  (appears in the PR body's evidence/result/test-plan content) is blocking; stated as
  an explicit post-merge observation instead, it is a non-blocking follow-up.
- **CI checks:** disposition a failing or pending check per `findings.md`
  `## Dispositions`.
- **Doc drift:** when the review finds committed doc drift as a **blocking** finding,
  apply the doc fixes in the provisioned worktree (created or reused), as part of
  assessment - real edits, uncommitted, worktree-local. Present the result in
  `## Findings`, the edits themselves under `## Drafted fixes / review`. Pushing them
  is a separate, later menu selection. Follow-ups alone never trigger doc fixes; only
  blocking drift does.

## Inline-first execution

> This section is an optional optimization. Delete it and the rest of the skill still
> works: the orchestrator can run every phase in this file itself, inline, with no
> subagent system.

The inline path is primary: the orchestrator runs the brief's sections itself, in
order, self-contained. When pi-cohort is available, delegation is an optimization
layered on top, never a hard dependency.

| Phase role | Persona | Detail |
|---|---|---|
| Gatherer | `scout` builtin | dispatched as a prior sync run producing the gather digest |
| Verifier | `worker` builtin | dispatched with the report-only constraint prepended to its task ("report only - do not edit, fix, or commit anything") |
| Reviewer | the existing `code-reviewer` agent | emits its native output format (never overridden at call time) |

Verifier and Reviewer share the provisioned worktree via `cwd`, dispatched
**sequentially** (Verify before Review, per `## Phase 3 - Verify, then review`) - never `worktree: true`,
which would provision a separate isolated worktree and break the shared-tree contract
this skill depends on. A subagent that fails, or violates its section's output
schema, is re-dispatched once demanding the schema; a second failure means that
section runs inline instead.
