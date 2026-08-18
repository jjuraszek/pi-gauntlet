# gatekeep-pr: consent-gated pre-merge verification of a PR against its issue

Ticket: [jjuraszek/pi-gauntlet#9](https://github.com/jjuraszek/pi-gauntlet/issues/9)
Related: #10 (shares the plan-tracker `failed` prerequisite), #11 (downstream Claude Code constraint), #8 (shape-ticket precedent, shipped v4.10.0).

## Problem

The gauntlet ends at `finishing-a-development-branch` (squash / PR / keep / discard). Once a PR exists, nothing gates the PR artifact itself: PR descriptions are claims, not proof (over-claimed coverage, hallucinated references, unrerun "tests pass"); merges are decided by green CI plus vibes. There is no authorship-aware default (own PR -> fix then merge; someone else's -> request changes, never silently mutate), and no first-class home for project review rules.

An earlier project-specific PR-gate skill exists in a private consumer repo. This spec ports its proven mechanics into a generic pi-gauntlet skill; the consumer repo will keep only a **pure-proxy thin wrapper**, with all customization in that repo's root `REVIEW.md` and gauntlet overrides file.

## Goals

- New standalone user-invocable skill `gatekeep-pr <pr> [issue-ref]`, `disable-model-invocation: true`. Full scope as filed: read-only three-role **verification**, authorship matrix, and the complete consent menu - no descoping. Verification is read-only; **disposition is actual work the skill performs** on explicit selection: applying code fixes in the worktree, committing, re-running the gate, pushing, posting reviews, merging. Doc updates are equally actual work: doc-drift fixes are applied in the worktree during assessment and pushed on selection.
- New repo-root `REVIEW.md` convention (review rubric as **data, not operating instructions**), with a shipped baseline rubric so the skill is fully functional with no `REVIEW.md` present.
- Additive `failed` status in `extensions/plan-tracker.ts` (shared prerequisite with #10; #10 is unmerged, so this work implements it).
- Consumer thin-wrapper contract: a wrapper skill in a consumer repo carries zero data - name, trigger phrases, "follow `/skill:gatekeep-pr`". The two homes consumers *add content to* are `REVIEW.md` and the overrides file; repo documentation (e.g. `AGENTS.md`'s canonical test entrypoint) is a **read-only fallback discovery source** the skill may consult, never a place this skill asks consumers to put gatekeep-pr configuration.

## Non-goals

- No new agent persona. Gatherer = `scout` builtin, Verifier = `worker` builtin under an explicit report-only constraint, Reviewer = existing `agents/code-reviewer.md` emitting its native format (translated at integration; see Phase 4).
- No second doc-fix skill. The doc-true-up behavior is folded in as an **essential part of the flow**: when the review finds committed doc drift as a blocking finding, the orchestrator applies the doc fixes itself in the provisioned worktree during assessment - real edits, uncommitted, never pushed until selected (see Phase 4). Only the separate-skill packaging is dropped, not the behavior.
- No auto-insertion into `finishing-a-development-branch`'s menu. gatekeep-pr is a standalone post-PR, pre-merge tool; the README documents it in the happy path, other skills are not modified.
- No environment-verification taxonomy (the source's staging/experimental/production AC axis and its ownership vocabulary). A claim about deployed state is simply `unverifiable-pre-merge` (see claim-check); anything richer is consumer territory via `REVIEW.md`.
- No execution sandbox. Running a project's verification command over PR code is code execution; the mitigations are the trust-boundary rules below (config from trusted base, untrusted-text labeling, safety contract, timeout). Building a credential-scrubbed sandbox is out of scope; the residual risk is stated in `SKILL.md` so the operator running the skill on a hostile PR does so knowingly.
- No scripted transcript-test harness for skill behavior. No pi-gauntlet skill has one; the acceptance oracle is the deterministic menu table (golden scenarios) below plus the closing conformance gate.
- #11 (Claude Code marketplace manifest) is out of scope; this spec only honors its forward requirement that the inline no-subagent path reads as primary.
- No supersession: purely additive; no predecessor spec is marked.

## Acceptance criteria traceability (issue #9, inlined)

| # | AC (as filed) | Status in this spec |
|---|---|---|
| 1 | `skills/gatekeep-pr/SKILL.md` plus a portable verification-brief file; user-invocable, model invocation disabled | Shipped files (3 files: brief + baseline rubric added) |
| 2 | Read-only brief and worktree provisioning are the only pre-consent actions | Kept, plus a third pre-consent action: applying doc-drift fixes in the provisioned worktree (uncommitted, worktree-local - the folded-in doc-true-up behavior, per user decision). All other work - code fixes, pushes, reviews, merges - is performed by the skill only on explicit menu selection |
| 3 | Authorship matrix documented (own / someone else's / fork), recommended vs offered | Menu table below |
| 4 | Verifier evidence rules: verbatim paste, provenance check, missing evidence = not merge-ready | Phase 3/4; strengthened to bounded raw output capture |
| 5 | `REVIEW.md` convention in README (root discovery, project-over-persona precedence, starter template); functional without it | REVIEW.md convention section |
| 6 | Works with no linked issue: AC coverage skipped, judged against stated intent | Phase 1 + verdict rules |
| 7 | Progress via `plan_tracker` (stages + per-claim tasks), never `phase_tracker`; failed -> `failed` (X), never complete; functional without the tool | Progress tracking section |
| 8 | `plan_tracker` `failed` status - additive, existing statuses untouched; shared with #10 | plan-tracker section |
| 9 | README happy path, skill list + count updated | Documentation impact |
| 10 | Skill stays generic; `rg` placeholder check passes | Testing approach |
| A1 | **Amendment** to "verification command sourced from overrides only, never inferred": widened to the resolution ladder (overrides sections -> documented command in repo docs -> ask). "Never inferred" is preserved as "never guessed from lockfiles/heuristics" - only explicit documented sources or the user. User-directed. | Config resolution ladder |
| A2 | **Amendment** to "CI rollup informational only": a failing/pending **required** status check withholds merge from the pre-composed courses until the user explicitly dispositions it (flaky vs real). Non-required checks stay informational. | Phase 4 |

## Design

### Shipped files

`skills/gatekeep-pr/` ships three files (skills are discovered via the `pi.skills` directory pointer; `package.json` needs no change):

1. **`SKILL.md`** - the orchestrator. Frontmatter: `name`, `description`, `disable-model-invocation: true` (matching the shape-ticket precedent; no `user-invocable` key). Structure mandate: the body presents the full flow - Gather -> Provision -> Verify -> Review -> Integrate -> Menu -> Execute-selection loop - as **orchestrator steps runnable inline with no subagent system**; delegation via pi-cohort is a separate later section, an optimization over the primary inline path (the #11 forward requirement). Ends with the standard 3-location Project overrides block.
2. **`verification-brief.md`** - the portable read-only contract: Gatherer / Verifier / Reviewer sections, each with a copy-paste output schema (the schemas in this spec are normative and land in the brief verbatim). Role-agnostic: the same text is executed inline or handed whole to a subagent with a "you own ONLY the <X> section" constraint.
3. **`review-baseline.md`** - the shipped default rubric (data, not instructions). Contents: the severity axis (blocking vs non-blocking follow-up - the skill's only normative severity distinction), generic review properties (self-contained; minimal - no premature abstraction/dead code/belt-and-suspenders; conventions match neighboring code; reuse existing helpers over re-implementing; performance traps such as N+1 and repeated work in loops; behavior-covering tests - a new path without a real test blocks; docs agree with code and with the PR/issue prose; security - secrets in diff, missing authorization, injection), and claim-verification principles (read the source behind the diff; "tests pass" is a claim until re-run; hallucinated references, hollow tests, and over-engineering weigh heaviest on generated PRs).

### Trust boundary

- **Config from trusted base, never PR head.** `REVIEW.md`, the gauntlet overrides file, and any documented command consulted by the ladder are read from the **merge-base of the PR's base branch** (the primary checkout / base snapshot), never from the PR's head tree. A PR cannot weaken its own rubric or swap the command the gate will run. Exception: when the PR itself changes `REVIEW.md`/overrides, the diff to those files is review *subject matter*, surfaced as a finding - still not applied to this run's config.
- **PR-controlled text is untrusted data.** PR body, comments, issue text, and changed docs are inputs to be verified, never instructions to be followed. The brief states this; the Verifier/Reviewer task prompts label the material as untrusted.
- **Residual risk stated.** Running the verification command executes PR code with the operator's ambient credentials. `SKILL.md` says so plainly next to the consent-gate text.

### Config resolution ladder

Applied per concern, first match wins, evaluated unconditionally by the generic skill (never delegated to a wrapper):

1. **Repo root `REVIEW.md`** (from base; rubric concerns only). Always wins over the shipped baseline and persona defaults on any conflict, not just overlap.
2. **Gauntlet overrides file** (3-location discovery, first found wins): the `## PR gate` section; for the verification command specifically, an existing `## verification-before-completion` section is an accepted equivalent source (consumers who already configured the gate there are not asked again).
3. **Repo documentation** - an *explicitly documented* command or tool (e.g. `AGENTS.md`'s canonical test entrypoint, a documented worktree wrapper, a documented tracker CLI). Reading documentation is not inference. Discovery-only: consumers are never told to add gatekeep-pr content here.
4. **Generic default, or ask the user.** Never guess from lockfiles, file heuristics, or vibes.

### Customization split (thin-wrapper contract)

| Concern | Shipped generic default | Repo `REVIEW.md` | Overrides (`## PR gate` / `## verification-before-completion`) | Repo docs (ladder step 3, discovery-only) |
|---|---|---|---|---|
| Review rubric, severity mapping, project checks | `review-baseline.md` | overlay - always wins | - | - |
| Verification command + safety contract | none - must resolve via ladder | - | primary home | documented command; else ask |
| PR platform operations | `gh` (view / diff / review / merge) | - | override for exotic setups | - |
| Linked-issue tracker | GitHub Issues via `gh issue view` | - | full replacement command set for issue fetch | documented tracker CLI |
| Worktree creation | gatekeep-owned `.worktrees/pr-<N>` | - | wrapper command | documented wrapper script |
| Merge procedure / strategy | squash default, merge-commit offered | - | project policy | documented merge rules |
| Consent gate, authorship matrix, menu shape, provenance rules, claim-check | `SKILL.md` + `verification-brief.md` - **not customizable** | - | - | - |

A consumer wrapper skill is a pure proxy: trigger phrases + "follow `/skill:gatekeep-pr`". `SKILL.md` states this contract so wrapper authors have a checklist: anything beyond trigger phrases in a wrapper is misplaced - move it to `REVIEW.md` or the overrides file.

The `## PR gate` overrides snippet (documented in `SKILL.md`):

```markdown
## PR gate
- verification command: <command>            # required unless documented elsewhere
- timeout minutes: 15                        # optional; default 15
- requires credentials: false                # optional; true => skill reports "not run" as missing evidence
- worktree wrapper: <command>                # optional
- issue fetch: <command with <ref> placeholder>   # optional, replaces gh issue view
- merge policy: squash | merge-commit        # optional
```

### Assessment flow (pre-consent)

Pre-consent actions are exactly: the read-only brief, worktree provisioning, and worktree-only uncommitted doc edits (the folded-in doc-true-up, in the provisioned worktree - created or reused). All are local; nothing is pushed or posted. Delegation changes who runs the brief, never what is allowed.

**Phase 1 - Gather** (read-only). The portable `gh` access pattern, fixed in the brief:

```bash
gh pr view <N> --json number,title,body,author,state,isDraft,headRefName,baseRefName,isCrossRepository,mergeable,headRefOid,statusCheckRollup,files,additions,deletions,commits,reviews,closingIssuesReferences,reviewDecision
gh api user --jq .login                     # viewer_is_author = (login == pr.author.login)
gh api repos/{owner}/{repo} --jq .viewerPermission   # push/merge capability signal
gh pr diff <N>
gh api repos/{owner}/{repo}/pulls/<N>/comments --paginate    # inline review comments
gh api repos/{owner}/{repo}/issues/<N>/comments --paginate   # top-level comments
gh issue view <issue> --comments            # issue ref given, or from closingIssuesReferences / branch / title / body / commits
git worktree list --porcelain               # discovery only; Gatherer never creates/syncs
```

Review-thread resolution state, when needed for comment triage, comes from the GraphQL `reviewThreads` connection (`isResolved`, `isOutdated`); if unavailable, triage proceeds without resolution flags and says so. Pagination: `--paginate` everywhere; diffs and comment sets beyond ~200 KB are truncated with an explicit truncation note in the digest.

Missing `<pr>` argument -> `gh pr view --json number,url` on the current branch; no PR found -> STOP and report. Missing issue ref -> `closingIssuesReferences` first, then branch name, PR title, body, commits; none found -> judge against the PR's stated intent, skip AC coverage, never invent ACs. Linked-issue tracker default is GitHub Issues; an overrides `issue fetch` command replaces the fetch wholesale (no partial verb table - the tracker surface here is one read).

`mergeable: UNKNOWN` -> re-poll once after the worktree sync; still UNKNOWN -> treat as not merge-ready and surface. Bot author (author of bot type) noted. `statusCheckRollup` captured with each check's `isRequired` where exposed.

**Gatherer output schema (normative, lands in the brief):**

```text
- pr: { number, title, body, author, author_is_bot, state, isDraft, headRefName, baseRefName,
        isCrossRepository, mergeable, headRefOid, files, additions, deletions, reviewDecision }
- viewer: { login, is_author, permission }
- status_checks: [ { name, status, conclusion, required } ]   # informational except required-failing (A2)
- comments: { inline[], top_level[], review_threads[]? }
- issue: { ref, title, body, acceptance_criteria[], comments[] } | null
- worktree_discovery: { expected_path, exists, branch, dirty, ahead, behind } 
- truncation_notes: []
```

**Phase 2 - Worktree provision** (orchestrator mutation, state machine). The expected branch is `headRefName` for in-repo PRs, the fork-local `pr-<N>` branch for fork PRs.

- A worktree on the expected branch exists **at any path** (per the Gatherer's `git worktree list --porcelain` discovery) -> **reuse it unconditionally**: `git fetch origin` + `git pull --ff-only`; on divergence, dirt, or local-only commits STOP and surface (never force, never create a duplicate).
- The gatekeep-default path `.worktrees/pr-<N>` exists but holds a different branch -> STOP and surface; do not repurpose.
- Nothing exists -> create at `<repo>/.worktrees/pr-<N>` (overrides wrapper command may relocate): in-repo PRs `git fetch origin` + `git worktree add .worktrees/pr-<N> <headRefName>`; fork PRs `git fetch origin pull/<N>/head:pr-<N>` first, then add on that local branch. Verify post-checkout that HEAD == `headRefOid` (pin what you verify; a moved head is caught here or by provenance). The `.worktrees/` gitignore-first rule and dependency-install steps from `using-git-worktrees` apply.

Record create-vs-reuse; it drives the non-merge teardown rule.

**Phase 3 - Verify, then Review** (sequential, same worktree; serialization is deliberate - the verification command may write to the tree while the Reviewer reads it):

- *Verifier* (`worker` builtin under an explicit constraint, or inline): the task prompt states "report only - do not edit, fix, or commit anything; you are running a gate and claim-checking, not implementing". After the run the **orchestrator** asserts tracked-tree cleanliness (`git status --porcelain` empty, HEAD unmoved); any tracked change = contaminated run = evidence invalid, re-provision and re-run once. Run the resolved verification command with the safety contract (below). Then claim-check the PR body - **material claims only** (test/verification/behavior assertions: "added X", "tests cover Y", "fixed Z"), not qualitative prose. Dispositions: `matched` / `contradicted` / `unverifiable-pre-merge`, each with file:line or evidence.

  **Verifier output schema (normative):**

  ```text
  - worktree_root: <absolute path>
  - head_sha:      <git rev-parse HEAD at run time>
  - runs: [ { run_cwd, command (verbatim), exit_code, result: pass|fail,
              raw_tail: <last ~100 lines of combined stdout+stderr, verbatim, fenced>,
              log_path: <file inside the worktree holding the full captured output> } ]
  - claims: [ { claim, disposition: matched|contradicted|unverifiable-pre-merge, evidence } ]
  ```

  `raw_tail` is captured output, not authored prose; anything the Verifier writes in its own words is labeled `summary` and is never pasted as evidence. Full output is captured to `log_path` (inside the disposable worktree) with deterministic tail truncation.

- *Reviewer* (`code-reviewer` persona; task prompt carries the merged rubric and the untrusted-data note): the persona emits its **native** contract (verdict, Critical/Moderate/Minor findings) - no attempt to override its output format at call time (frontmatter pins it). Open the source behind the diff, not just the patch. Existing PR comments triaged: already-addressed / reasonable / judgment-call.

**Verification-command safety contract** (documented in `SKILL.md` as part of the overrides contract): the command must be self-contained and non-interactive; the orchestrator bounds it with a timeout (default 15 minutes, `timeout minutes` override) using the harness's bash timeout parameter where available, else `timeout`/`gtimeout` when installed, else background-and-kill - the mechanism is named in `SKILL.md`, not left to improvisation; `requires credentials: true` in overrides -> the skill does not run it and reports "verification requires credentials, not run" as missing evidence rather than prompting for secrets; artifacts stay inside the worktree (disposable - that is the cleanup story).

**Phase 4 - Integrate** (orchestrator):

- **Provenance check:** `worktree_root` == the provisioned path, every `run_cwd` inside it, `head_sha` == the digest's `headRefOid`. On `head_sha` mismatch, re-fetch the PR head once: if the PR advanced during assessment, re-sync the worktree and re-run Phase 3; a second mismatch or any path mismatch = evidence missing = not merge-ready, exactly like a failed gate. The claim stated in output is precisely "reproduced locally under the project's documented command" - nothing stronger.
- **Evidence:** paste each run's `command` + `raw_tail` fenced block verbatim into `## Evidence`. Authored summaries are labeled as summaries and never substitute for `raw_tail`.
- **Reviewer translation (default severity map, REVIEW.md may remap):** Critical -> blocking, Moderate -> blocking, Minor -> non-blocking follow-up. A repo `REVIEW.md` severity mapping overrides this map; severities it names but does not map are fail-safe **blocking**, with a note in the output. AC coverage (`met` / `partial` / `missing` per criterion; only `met` is merge-ready) is computed here by the orchestrator from the issue's ACs, the diff, and the Reviewer's findings - it is an integration product, not raw persona output.
- **Claims:** failed local gate -> hard merge failure. `contradicted` material claim -> blocking finding. `unverifiable-pre-merge` claim *used as merge proof* (it appears in the PR body's evidence/result/test-plan content) -> blocking; an explicit post-merge observation -> non-blocking follow-up.
- **CI rollup (A2):** a failing or pending **required** check withholds merge from the pre-composed courses until the user explicitly dispositions it (flaky -> proceed via custom selection; real -> it blocks). Non-required checks are informational, listed in Evidence.
- **Doc drift** found as a blocking finding -> the orchestrator applies the doc fixes in the provisioned worktree (created or reused) as part of assessment: real edits, uncommitted, worktree-local - the same pre-consent mutation class as the worktree itself. The per-file result is presented in `## Findings` and the edits themselves under `## Drafted fixes / review`. Pushing them (stage + commit with a subject naming what is documented + re-run gate + push) is a separately selectable menu action. Follow-ups alone never trigger doc fixes - only blocking drift does.

### Progress tracking

`plan_tracker`, explicitly never `phase_tracker`. Init with the named stages (`gather`, `provision worktree`, `run verification`, `claim-check`, `review`, `consent menu`); append one task per material claim as the Verifier enumerates them. Passing stage / matched claim -> `complete`. Failed stage / contradicted claim -> `failed` (X, error color) and stays visibly crossed while the skill STOPs at the menu - never ticked complete. On a harness without the tool: native task list if one exists, else skip; the skill is fully functional either way.

### Delegation and fallback

The inline path is **primary**: the orchestrator runs the brief's sections itself, in order, with no subagent system - `SKILL.md` reads correctly with the delegation section deleted. When pi-cohort is available, delegation is an optimization: Gatherer as a prior sync `subagent()` run, then Verifier and Reviewer as **sequential** dispatches sharing the provisioned worktree via `cwd` (never `worktree: true`). No `context:` override is requested (per-task context is not a call-time knob); the report-only constraint and post-run cleanliness assert - not dispatch flags - are what keep the Verifier read-only. Failure fallback: a subagent that fails or violates its section's output contract is re-dispatched once demanding the schema; a second failure -> run that section inline. Delegation is never a hard dependency.

### Verdict

Three states: **blocking findings** (failed gate, contradicted material claim, merge-proof unverifiable claim, `partial`/`missing` AC, scope creep - *only when an issue is linked*: PR work with no issue justification; with no issue, judge solely against stated intent and scope creep does not apply - committed doc drift, anything the merged rubric maps to blocking), **follow-ups only** (never gate merge), **clean**.

### Consent menu (deterministic; this table is the golden-scenario oracle)

Capability and PR state restrict the **offered** set (fork, draft, merged/closed, permissions, required checks); authorship picks the `[recommended]` row among what is offered. Pre-composed courses per cell - each row is one atomic action; multi-step courses are expressed as "row now, next row re-offered after re-assessment":

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

Plus always: a final **custom row** composing the full action vocabulary (apply code fixes / push doc fixes / post review / reply to thread / merge / tracker comment when a tracker tool resolved). **Push and merge are never bundled** - separate selections. Approving your own PR is not offered (`gh` errors on it). Rows GitHub would refuse (branch protection, missing permissions, `viewerPermission` too low) are listed as unavailable with the reason. Nothing executes until explicit selection.

**Post-selection loop** (the menu is a state machine, not a one-shot report):

1. **Compare-and-swap before every external write:** re-fetch `headRefOid`, `state`, `mergeable`. Any change since assessment -> invalidate, re-sync the worktree, re-run Phase 3, re-render. Merge always passes `--match-head-commit <assessed-sha>`.
2. Execute exactly the selected row: code fixes -> commit on the PR branch (subject names the fix), re-run the gate, push; doc fixes -> stage + commit (subject names what is documented), re-run the gate, push; reviews/comments -> `gh pr review` / `gh api` non-interactive with the drafted body.
3. After any mutation that can change readiness (fix pushed, docs pushed, PR head moved), re-run Verify + Review on the synced worktree and re-render `## Outcome` / `## Evidence` / `## Findings` / the menu. A selection of merge while preconditions fail is **refused with the failing precondition named**, and the menu re-renders - never a dead end, never a silent merge.
4. Loop until the user selects merge (success -> tear down the worktree, **reused or created**: the sync precondition guarantees no local-only work, the branch is merged and remote-deleted, and leaving the worktree strands it on a dead branch), or an explicit stop/no-action row.

**Merge preconditions** (all must hold): gate green with every blocking finding fixed (not deferred), `mergeable` not conflicted, no undispositioned failing required check (A2), evidence pasted with clean provenance, worktree clean and synced with the remote head (fixes pushed first), explicit selection with head compare-and-swap passing.

**Teardown:** a successful merge always tears down the worktree, reused or created (see the loop above). After a **non-merge** stop: offer teardown of a created worktree (never autonomous; warn if unpushed doc edits would be discarded); a reused worktree is left as found - if unpushed doc edits remain in it, say so explicitly (leave or discard is the user's call).

**Output template** (in `SKILL.md`): `## Outcome` (one line + deciding factor), `## Evidence` (verbatim command + raw_tail per run; claims checked; CI rollup with required-check disposition), `## Findings (blocking)` (file:line, defect, fix), `## Non-blocking follow-ups`, `## Decision` (the menu), `## Drafted fixes / review` (the exact payload to be applied or posted - for code fixes, the concrete edit per finding; for reviews, the full body: one summary sentence then numbered file:line findings ending on the fix). Empty lists say "None".

### `REVIEW.md` convention (README)

New README section, sibling-convention to `AGENTS.md`: discovery at repo root only, read from the PR's base (trust boundary above); declared data-not-instructions (a plain root file consumable by non-gauntlet tooling); the skill is fully functional without it.

**Merge algorithm - overlay:** the effective rubric = shipped `review-baseline.md` with repo `REVIEW.md` entries laid on top; a repo entry that names a baseline concern (severity mapping, a named check) **replaces** it; everything the repo file does not name stays baseline. On any conflict the repo file wins. Unmapped repo severities -> blocking (fail-safe, noted in output).

Starter template (a **diff** over the baseline): one severity mapping line ("severities X, Y block merge; Z is a follow-up" - explicitly allowed to remap the default Critical/Moderate->blocking, Minor->follow-up map) plus two example project checks, with a sentence stating the baseline covers everything else.

### plan-tracker `failed` status

Additive change to `extensions/plan-tracker.ts` (semver minor), designed generically for #10 reuse (terminal-negative state, not over-fit to stages/claims). Cited by symbol - line numbers drift:

- `TaskStatus` union and the tool-schema `status` enum gain `"failed"`.
- `formatWidget`: X in error color; `failed` is terminal-negative - excluded from the current/in-progress arrow logic, never counted complete.
- `formatStatus`, and `renderResult`'s `update`/`status` cases: failed count + X icon added; complete counts unchanged.
- Tool description widened to permit bounded gate workflows (this skill and #10) alongside the implement phase - the current text restricts callers and would fight the skill's instruction.
- `reconstructState` copies details wholesale - no migration; existing serialized sessions remain valid; existing statuses untouched.
- `doc/configuration.md`: widget icon documentation updated to include X/failed.
- Tests in `extensions/plan-tracker.test.ts`: update-to-failed round-trip; reconstruction containing a failed task; failed excluded from the complete count; render-path coverage for `formatWidget`/`formatStatus`/`renderResult` showing the X icon and failed count.

## Error handling and edge cases

- No linked issue: AC coverage skipped, judged against stated intent, ACs never invented, scope-creep rule inactive.
- No `REVIEW.md`: baseline rubric alone; fully functional.
- No resolvable verification command: ask the user; declined -> verification evidence reported missing, PR not merge-ready.
- Worktree ff-sync fails, or the owned path holds the wrong branch: STOP and surface; no force, no duplicate, no repurpose.
- Unpushed doc edits at session end: surfaced explicitly, never silently discarded (created worktree: teardown warns; reused worktree: user decides leave-or-discard).
- Verifier contaminated the tree (tracked change after the run): evidence invalid; re-provision + re-run once, then report as missing evidence.
- PR head moved mid-flow: caught by provenance (Phase 4) or compare-and-swap (menu loop); re-sync + re-assess, never act on a stale SHA.
- Subagent failure: re-dispatch once, then inline.
- No `plan_tracker` tool: native task list or skip; no functional change.
- Verification requires credentials: declared in overrides; reported "not run" as missing evidence, never prompts for secrets.
- `mergeable: UNKNOWN` after re-poll: not merge-ready, surfaced.

## Testing approach

- `npm test` (`scripts/ci.mjs`): frontmatter validation for the new skill, extension syntax + the new plan-tracker unit tests, pack contents.
- Genericity gate: the AGENTS.md `rg` pattern check over `skills/` plus a check that the source project's name appears nowhere in the spec, skill files, README additions, or commit content - zero matches required.
- Behavior oracle: the consent-menu table above is normative golden data - the shipped `SKILL.md` table must match it cell-for-cell; the closing conformance gate verifies spec-vs-shipped-content, including the menu table, output template, and both amendments (A1, A2).

## Documentation impact
- Feature / user-facing docs introduced: README `REVIEW.md` convention section (with starter template); `skills/gatekeep-pr/SKILL.md`, `verification-brief.md`, `review-baseline.md`.
- Materially amended existing docs: README (happy path: gatekeep-pr as the pre-merge stage after a PR exists; architecture skill list and count), CHANGELOG.md (minor release entry), `doc/configuration.md` (plan-tracker widget icons), AGENTS.md (extensions table row for plan-tracker if its description enumerates statuses).
- Derived / memory docs invalidated: none.

## Ticket closure

On finish (ship phase), close issue #9 with a comment linking the landed commit - a status transition, exempt from the shape-ticket write gate.

## Open questions

None.
