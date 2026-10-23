# Parallel gatekeep-pr Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Assess PR sets in isolated children and queue per-PR decisions for parallel execution without changing single-PR behavior.

**Architecture:** Put batch admission, serialized provisioning, menus, and parent-child coordination in a new reference. A dispatch-capable persona uses existing gatekeep duties and continuation records; add no settings, grant schema, or executable framework.

**Tech Stack:** Markdown instructions/personas, pi-cohort tasks, Node test runner, existing text evals, Git/GitHub CLI.

**Spec:** `doc/specs/2026-10-23-gh-79-parallel-gatekeep-prs.md`

**Verification:** `npm test && node eval/run.mjs gatekeep-pr --base "$(git log -1 --format=%H --diff-filter=A -- skills/gatekeep-pr/reference/batch.md)" && node eval/run.mjs gatekeep-pr-scope`

**Ticket:** `#79`

---

## Recon and verification decisions

- Root overrides have no Happy path or deployment topology. Keep one plan; its first commit is an eval-readable baseline, not a deployment split.
- Existing source: `skills/gatekeep-pr/SKILL.md:14-49` owns arguments, routing, and harness notes; `reference/assessment.md:5-20` owns provisioning and `:88-101` owns sequential Verify/Review; `reference/sync.md:13-85` owns recovery; `reference/post-selection-loop.md:5-29,192-225` owns records/refresh/teardown. Existing references and marketplace remain unchanged.
- Persona authoring follows `skills/forge-skill/SKILL.md:35-74` and `doc/personas.md:40-70`. Runtime truth: `node_modules/pi-cohort/src/runs/shared/pi-args.ts:77-111`, `src/agents/agents.ts:38-75,153-164`, and `src/runs/shared/acceptance.ts:241-269`.
- Read cohort config at the active agent profile's `extensions/pi-cohort/config.json`, not gauntlet settings: `parallel.maxTasks` defaults to 8; `parallel.concurrency` defaults to 4. Omit a child extensions allowlist; include dispatch tools, explicitly inject the skill, and leave model/thinking unset.
- `scripts/gatekeep-comment-reconcile.test.mjs:1-37,198-213,313-321` is the existing source-contract suite. `eval/lib/lint.test.mjs` is the scoped assembly-lint suite. Preserve old assertions and old eval cases/expected files.
- No formatter or standalone repo-wide lint script exists. Use scoped JavaScript syntax/whitespace checks and imperative ASCII/compact-table review. The header validator bundles all repo lint, package smoke, and deterministic tests. No bin source changes or generated bin edits belong here.
- `eval/run.mjs` accepts target/sample filters. `eval/lib/replay.mjs:43-63` supports local bundles but runs text replay with no tools. Commit both new instruction files first and retain that SHA as the bundle base. Full runs are header-owned; commit runner-generated records/reports before finish. Live nesting smoke must run from the parent verification session, not a nested implementer.

## Files

**Create - instruction surfaces:**
- `skills/gatekeep-pr/reference/batch.md`
- `agents/pr-gatekeeper.md`

**Create - eval sources:**
- `eval/gatekeep-pr/samples/batch-summary-queue/case.md`
- `eval/gatekeep-pr/samples/batch-summary-queue/expected.md`
- `eval/gatekeep-pr/samples/batch-failure-retry/case.md`
- `eval/gatekeep-pr/samples/batch-failure-retry/expected.md`
- `eval/gatekeep-pr/samples/batch-rebase-answers/case.md`
- `eval/gatekeep-pr/samples/batch-rebase-answers/expected.md`
- `eval/gatekeep-pr/samples/batch-cleanup-stop/case.md`
- `eval/gatekeep-pr/samples/batch-cleanup-stop/expected.md`

**Create - runner-owned records:**
- `eval/gatekeep-pr/results/batch-summary-queue/baseline.json`
- `eval/gatekeep-pr/results/batch-summary-queue/candidate.json`
- `eval/gatekeep-pr/results/batch-failure-retry/baseline.json`
- `eval/gatekeep-pr/results/batch-failure-retry/candidate.json`
- `eval/gatekeep-pr/results/batch-rebase-answers/baseline.json`
- `eval/gatekeep-pr/results/batch-rebase-answers/candidate.json`
- `eval/gatekeep-pr/results/batch-cleanup-stop/baseline.json`
- `eval/gatekeep-pr/results/batch-cleanup-stop/candidate.json`

**Modify - implementation/evidence:**
- `skills/gatekeep-pr/SKILL.md`
- `scripts/gatekeep-comment-reconcile.test.mjs`
- `eval/gatekeep-pr/intent.md`
- `eval/gatekeep-pr/report.md`
- `eval/gatekeep-pr/results/*/baseline.json`
- `eval/gatekeep-pr/results/*/candidate.json`
- `eval/gatekeep-pr-scope/intent.md`
- `eval/gatekeep-pr-scope/report.md`
- `eval/gatekeep-pr-scope/results/*/baseline.json`
- `eval/gatekeep-pr-scope/results/*/candidate.json`

**Modify - documentation:**
- `README.md`
- `doc/personas.md`
- `CHANGELOG.md`
- `eval/gatekeep-pr/README.md`

**Delete:** none.

## Wave 1 - Batch contract and dispatch-capable persona

### Task 1: Define the isolated parent-child batch contract

**TDD scenario:** Modifying tested code - existing tests first, failing contract assertions, implementation, green.

**Spec:** doc/specs/2026-10-23-gh-79-parallel-gatekeep-prs.md § "Acceptance criteria" L30-L49, § "Entry and argument grammar" L55-L57, § "Components" L61-L66, § "Data flow" L70-L78, § "Child results" L82, § "Outcome adapter" L86-L98, § "Pre-report asks" L102-L111, § "Private handoff" L115, § "Summary" L119-L123, § "Pick round" L127-L132, § "Grants and retained authority" L136, § "Progress tracking" L140, § "Persona" L144, § "Errors and edge cases" L148-L155, § "Tests" L163, § "Tests" L166, § "Out of scope" L176, § "Out of scope" L181-L182

**Files:**
- Create: `skills/gatekeep-pr/reference/batch.md`
- Create: `agents/pr-gatekeeper.md`
- Modify: `scripts/gatekeep-comment-reconcile.test.mjs:1-37`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`

**Tests:**
- `node --test scripts/gatekeep-comment-reconcile.test.mjs`
- baseline: 526135c pass
- via: `skills/gatekeep-pr/reference/batch.md`, `agents/pr-gatekeeper.md`, existing source-contract `test()` cases

Decision: Add `acceptance: { level: "none", reason: "the gatekeep child result line is the handoff contract" }` per outer task; cohort's acceptance formatter otherwise appends another contract. Keep the specified completion guard pin independently. This does not change existing inner-helper contracts.

Decision: Supply the workflow through task text and explicit skill injection; keep the persona a standalone system prompt without skill discovery or reference-loading instructions, per forge's persona rules.

**Exact contract vocabulary:** Preserve these source literals in their owning instructions, rather than substituting aliases:
- Entry/claims: `/skill:gatekeep-pr 12 15 18 [--rebase [base]]`, `--rebase`, `eval/gatekeep-pr`, `skills/gatekeep-pr/SKILL.md`, `SKILL.md`, `## Arguments`, `maxTasks`, `gauntlet_setting`, `parallel.maxTasks`, `8`, `scripts/gatekeep-comment-reconcile.test.mjs:199`, `node eval/run.mjs gatekeep-pr`, `npm test`, `report.md`.
- Files/owners: `reference/batch.md`, `reference/assessment.md`, `reference/sync.md`, `reference/post-selection-loop.md`, `reference/fix-wave.md`, `reference/decision-menu.md`, `reference/report.md`, `reference/cleanup.md`, `verification-brief.md`, `AGENTS.md`, `doc/personas.md`, `## Frontmatter knobs`, `extensions/plan-tracker.ts:84`.
- Sections: `## Provision the worktree`, `## Other-author confirmation`, `## Conflict stop`, `## Failure path`, `## Preconditions`, `## Baseline`, `## Push`, `## Helpers`, `## Configuration`, `## Select the scope contract`, `## Conflicts`, `## cleanup`, `### Continuation record`, `### Child results`, `### Outcome adapter`, `### Pre-report asks`, `### Private handoff`, `### Summary`, `### Pick round`, `### Pre-menu refresh`, `### Next action`, `### Teardown`, `## Progress tracking`, `### Persona`.
- Results/verbs: `pending`, `report`, `conflicting`, `failed`, `stopped`, `retired`, `assess`, `execute`, `REPORT`, `CONFLICTING`, `FAILED`, `STOPPED`, `retry`, `fix`, `fix 2`, `fix + nits`, `merge base`, `update branch`, `reply`, `wait`, `cleanup`, `stop`, `show evidence`, `post coverage to ticket`, `post coverage to PR`, `own merge`, `approved`, `merged or closed`, `rebased locally`, `no-op`, `skipped`, `sync: declined - other author's branch`, `implementer returned open`, `residue outside conflicted files`, `[recommended]`.
- State: `consent.target`, `pr`, `pr.files`, `status_checks[]`, `actions_runs[]`, `permissions`, `permissions.head_pushable`, `scope`, `sync`, `approved_head`, `pr.state`, `pr.merge_commit`, `repair.*`, `cleanup_done`, `Verdict:`, `evidence`, `source`, `blockers`, `P#`, `unknown`, `Shared files:`, `none`.
- Safety/API: `${TMPDIR:-/tmp}`, `git fetch origin`, `git worktree add`, `gh api user --jq .login`, `HEAD == headRefOid`, `concurrency`, `gh pr checks --watch`, `create:`, `home:`, `## using-git-worktrees`, `.git/rebase-merge`, `rebase-apply`, `requires credentials: true`, `not run`, `head not pushable`, `push`, `mergeable`, `mergeStateStatus`, `UNKNOWN`, `init`, `update`, `in_progress`, `complete`, `plan_tracker`, `log_path`, `skill: gatekeep-pr`, `async: false`, `context: "fresh"`, `cwd`, `tasks`, `yes`, `no`, `not asked`.
- Ask/assembly: `STOPPED - verification command - <subproject dirs seen>`, `STOPPED - spec candidate - <paths>`, `verification command: <command>`, `spec: <path>`, `bundle+: skills/gatekeep-pr/reference/batch.md`, `bundle+: agents/pr-gatekeeper.md`, `bundle+`, `eval/README.md`, `intent.md`.

- [ ] **Step 1: Run the existing suite, add red assertions, rerun.**

  Run: `node --test scripts/gatekeep-comment-reconcile.test.mjs`

  Expected initially: 34 pass. Reuse `readOrEmpty()` and add table-driven cases for persona tools/pins, both modes, admission-before-effects, serial primary writes, one foreground fanout, supplied paths, all adapter rows, parent-only UI/consequences, refresh-before-write, no grant reset, and PR-local trackers. Rerun the same command; expect new assertions only to fail on absent files.

- [ ] **Step 2: Write admission and serialized provisioning in the batch reference.**

  Parse sets before rebase and reject positional issues, duplicate identities across URL/number forms, repo/origin mismatch, oversized sets, and Claude Code before dispatch/confirmation/provisioning. Read cohort's active-profile config and default 8; never chunk. Preserve `multi-PR mode takes at most <max> PRs (pi-cohort parallel.maxTasks); got <n>`.

  Gather `gh pr view --json number,author,headRefOid,headRefName,baseRefName,isCrossRepository,headRepository,state,files` per PR. Resolve trusted worktree config. Fetch origin once plus fork heads, gitignore-first when home is in-primary, and provision roster-order with existing reuse/divergence/keyed-create/HEAD checks. No concurrent primary fetch/add. A failed PR gets `failed: provisioning - <reason>` and no child; siblings proceed. Preserve nonzero-create stops without fallback.

- [ ] **Step 3: Write confirmation, roster, and handoff initialization.**

  After fetching, exclude no-op and merge-containing heads using sync preconditions 4-5; compare remaining authors with viewer login. Explain rewrite effects once and ask once for eligible other/unreadable authors only. Supply `rebase confirmation: yes | no | not asked` per task. Preserve sync's own safety fetch; skip only duplicate provisioning work.

  Mint one OS-temp JSON roster using `mktemp gatekeep-roster.XXXXXX`, recording number/worktree/record/report/status/reason/pick. Pre-mint report paths and initialize existing-format records once: identity/worktree, null grants, zero rounds, null approved head, cleanup false. Add no schema. Parent owns initialization/direct picks; children own assessment/execution fields. Put answers in task text, never in records; do not overwrite grants, counters, deadline, ledger, or helper paths.

- [ ] **Step 4: Write assess dispatch and exact child results.**

  Specify one foreground fresh `subagent` tasks call, one `pr-gatekeeper` per provisioned PR, worktree cwd, `skill: "gatekeep-pr"`, no-acceptance override, mode/PR/base/rebase/answer/paths. Include `worktree provisioned at <path> on <headRefOid>; fetch and gitignore done - skip the fetch, run no worktree add, verify HEAD`.

  Child validates record/head and runs existing steps 1-5 with sequential fresh Verify then Review in its worktree. It writes the supplied report and ends with exactly `REPORT <report path>`, `CONFLICTING <report path> - <sync record>`, `FAILED - <reason>`, or `STOPPED - <ask> - <what the user must supply>`. It mints no second record/report. Parent classifies nonzero, timeout, missing/off-contract lines using first error; await all siblings. If all PRs are already terminal, parent builds terminal states/reports and dispatches no helpers.

- [ ] **Step 5: Transcribe the recovery-first adapter and enumerated asks.**

  Unresolved/open/residue/reviewer sync failures restore/assert pre-head/clean tree, then return conflicting without a rendered report. Rebase-command or server push failures recover then fail. Terminal sync stops/baseline mismatch/lease refusal fail, not conflict. Without rebase, false/unreadable pushability fails before Verify. An unavailable required fallback fails for no evidence. Empty/off-contract/nonzero/async nested output fails with role/reason. Every other step 1-5/7 result reports. Leave single-PR owners unchanged and never label unsafe recovery retry-ready.

  Parent handles unresolved create tokens. Child returns the two enumerated STOPPED asks for verification command/spec candidates and stops; reassess same record with answer supplied only to that ask. UNKNOWN merge state reports withholding merge. Step-7 contract/no-progress/budget decisions return reports, not child questions.

- [ ] **Step 6: Write summary, ordered menus, and retry safety.**

  Render `#<N> <verdict line> | evidence: <ci | local | pending | unknown> | blockers: <count | unknown>` from each record/result, unknown before Verify/review. List all shared changed paths with PR numbers; missing files metadata gets `#<N> - files unknown`, no overlap gets none. Never schedule merges.

  Print reports verbatim and apply existing menus in roster order; conflicts get existing conflict rows plus evidence, failures get retry/evidence/stop, STOPPED gets its recorded ask. Use `retry - re-dispatch this PR's assessment with the same record`, recommended only for clean recovered checkout without rebase. Resolve actual gitdir for linked worktrees. Otherwise show `Not offered: retry (worktree dirty or mid-rebase: <state>)`. Provisioning retry re-provisions only after the obstacle clears.

- [ ] **Step 7: Write queued execution, grants, consequences, and tracking.**

  Only show evidence runs/re-asks in place. Queue every other pick until last menu. Between completed batches, parent runs cleanup guards/ordered overrides, keeps that PR and post rows with cleanup gone; stop performs rebased-local reset/assertions, human-selected ordinary teardown naming discarded commits, terminal leave-as-found, per-PR record/helper/log deletion, then retirement. Never touch a live child's tree.

  Next batch mixes retry/answered-ask assess with ordinary execute. Execute refreshes first; moved head/unavailable row returns fresh report without stale action. Otherwise use existing next-action/fix-wave/retained grants scoped to that PR. Preserve caps/deadlines/no-progress. Waits are independently bounded. Await every batch, re-render non-retired roster, repeat. Parent tasks `pr-<N> state: <record path>` become in-progress on dispatch, complete on retirement, failed on un-retried failure. Child trackers remain session-local; retain checklist fallback.

- [ ] **Step 8: Write the standalone persona and turn tests green.**

  ```yaml
  ---
  name: pr-gatekeeper
  description: runs one PR of a gatekeep-pr multi-PR set to its report or executes one queued pick
  tools: read, grep, find, ls, bash, edit, write, subagent, gauntlet_setting, plan_tracker
  defaultContext: fresh
  inheritProjectContext: true
  inheritSkills: false
  systemPromptMode: replace
  completionGuard: false
  ---
  ```

  Leave `thinking`, `model`, and extensions unset. Put role/reason and output contract before method; state supplied identity/paths, modes, no reinitialization, task-answer substitution, fresh helpers, recovery-first mapping, direct-human authority, and parent-only UI/consequences. Delegate tracked source edits/commits to implementer helpers. No skill-discovery/reference-loading machinery in the body; returned closing line has nothing after it.

  Run: `node --test scripts/gatekeep-comment-reconcile.test.mjs`

  Expected: existing/new assertions pass.

- [ ] **Step 9: Check scoped style and make the readable baseline commit.**

  Run: `node --check scripts/gatekeep-comment-reconcile.test.mjs`

  Run: `git diff --check -- agents/pr-gatekeeper.md skills/gatekeep-pr/reference/batch.md scripts/gatekeep-comment-reconcile.test.mjs`

  Expected: valid JavaScript/no whitespace errors. Review imperative ASCII, compact tables, generic paths, exact pins, both new files under 500 lines. Commit the three owned files with subject `Define isolated gatekeep batch orchestration (ref #79)` and body `Behavior-change: add the multi-PR parent-child contract; eval samples follow after this readable baseline commit.` Retain this commit for bundle baseline reads.

## Wave 2 - Public entry routing and behavioral evidence

Depends on Wave 1: both new bundled files must already be committed; this wave also extends the same source-contract file.

### Task 2: Route PR sets and prove independent queued execution

**TDD scenario:** Modifying tested code - existing tests, red routing/sample guards, minimal routing and synthetic cases, green.

**Spec:** doc/specs/2026-10-23-gh-79-parallel-gatekeep-prs.md § "Acceptance criteria" L30-L49, § "Entry and argument grammar" L55-L57, § "Tests" L159-L165, § "Tests" L165, § "Tests" L166, § "Out of scope" L181-L182

**Files:**
- Modify: `skills/gatekeep-pr/SKILL.md:14-39`
- Modify: `scripts/gatekeep-comment-reconcile.test.mjs:198-213`
- Create: `eval/gatekeep-pr/samples/batch-summary-queue/case.md`
- Create: `eval/gatekeep-pr/samples/batch-summary-queue/expected.md`
- Create: `eval/gatekeep-pr/samples/batch-failure-retry/case.md`
- Create: `eval/gatekeep-pr/samples/batch-failure-retry/expected.md`
- Create: `eval/gatekeep-pr/samples/batch-rebase-answers/case.md`
- Create: `eval/gatekeep-pr/samples/batch-rebase-answers/expected.md`
- Create: `eval/gatekeep-pr/samples/batch-cleanup-stop/case.md`
- Create: `eval/gatekeep-pr/samples/batch-cleanup-stop/expected.md`
- Create: `eval/gatekeep-pr/results/batch-summary-queue/baseline.json`
- Create: `eval/gatekeep-pr/results/batch-summary-queue/candidate.json`
- Create: `eval/gatekeep-pr/results/batch-failure-retry/baseline.json`
- Create: `eval/gatekeep-pr/results/batch-failure-retry/candidate.json`
- Create: `eval/gatekeep-pr/results/batch-rebase-answers/baseline.json`
- Create: `eval/gatekeep-pr/results/batch-rebase-answers/candidate.json`
- Create: `eval/gatekeep-pr/results/batch-cleanup-stop/baseline.json`
- Create: `eval/gatekeep-pr/results/batch-cleanup-stop/candidate.json`
- Modify: `eval/gatekeep-pr/intent.md`
- Modify: `eval/gatekeep-pr/report.md`
- Modify: `eval/gatekeep-pr/results/*/baseline.json`
- Modify: `eval/gatekeep-pr/results/*/candidate.json`
- Modify: `eval/gatekeep-pr-scope/intent.md`
- Modify: `eval/gatekeep-pr-scope/report.md`
- Modify: `eval/gatekeep-pr-scope/results/*/baseline.json`
- Modify: `eval/gatekeep-pr-scope/results/*/candidate.json`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test scripts/gatekeep-comment-reconcile.test.mjs`
- baseline: 526135c pass
- via: `skills/gatekeep-pr/SKILL.md`, `reference/batch.md`, `agents/pr-gatekeeper.md`
- `node --test eval/lib/lint.test.mjs`
- baseline: 526135c pass
- via: `parseCase()`, `lintTarget()`

Decision: Keep dispatch/config detail out of the short skill rule: existing Harness-notes isolation and 120-line assertions stay intact. Keep both target manifests and old cases/facts unchanged; sample-local bundles are supported by `eval/lib/replay.mjs:43-59`.

**Exact entry/test vocabulary:** `/skill:gatekeep-pr 12 15 18 [--rebase [base]]`, `--rebase`, `eval/gatekeep-pr`, `SKILL.md`, `## Arguments`, `origin`, `maxTasks`, `gauntlet_setting`, `parallel.maxTasks`, `8`, `scripts/gatekeep-comment-reconcile.test.mjs:199`, `reference/batch.md`, `reference/sync.md`, `## Conflict stop`, `## Failure path`, `## Preconditions`, `## Baseline`, `## Push`, `verification-brief.md`, `permissions.head_pushable`, `### Outcome adapter`, `### Pre-report asks`, `### Pick round`, `### Summary`, `conflicting`, `failed`, `stop`, `rebased locally`, `REPORT`, `FAILED - head not pushable`, `FAILED - head not pushable: ...`, `FAILED - sync: ...`, `assess`, `execute`, `retry`, `show evidence`, `rebase confirmation: no`, `sync: declined - other author's branch`, `skipped`, `yes`, `cleanup`, `own merge`, `bundle+`, `eval/README.md`, `intent.md`, `report.md`, `eval/gatekeep-pr-scope`, `target.json`, `plan_tracker`, `npm test`.

- [ ] **Step 1: Add red routing/sample guards after existing tests pass.**

  Run: `node --test scripts/gatekeep-comment-reconcile.test.mjs`

  Add checks for set grammar, positional-issue refusal, route before old steps, one-PR fallthrough, four sample declarations/bundles/facts, and unchanged line cap. Rerun; expect only new assertions red. Preserve old tests.

- [ ] **Step 2: Add one argument rule and one batch routing row.**

  Document numeric/URL sets before rebase and pi-only admission through the reference. Preserve zero/one-PR behavior, old rows, issue discovery, trackers/re-entry, and Claude single-PR notes byte-for-byte. No raw dispatch syntax outside Harness notes.

- [ ] **Step 3: Add summary/queue and failure/retry samples.**

  All four cases open with these exact lines:

  ```text
  bundle+: skills/gatekeep-pr/reference/batch.md
  bundle+: agents/pr-gatekeeper.md
  ```

  Use synthetic `acme/widgets`, OS-temp paths and observed-tool snapshots; follow existing digest/Entry grammar and request narration, not tools. Begin no-write observation after provisioned roster snapshots, since provisioning itself is required to write.

  `batch-summary-queue`: PRs12/15/18, 12+15 touch `src/export.ts`, only18 eligible other-author, unresolved stop `4e2a1b7`. Facts s1-s7: confirmation once naming18; exact summary/source/count/shared-path fields; `conflicting - sync: failed - unresolved stop in 4e2a1b7` plus conflict rows after recovery; roster-order verbatim reports; no post-assessment write beyond sync push before first menu; fix12 queues before menu15/execution; single fresh foreground batch with supplied paths/skill and nested helpers.

  `batch-failure-retry`: timeout/no-line, unpushable failure, sibling report. Facts f1-f6: independent reasons/sibling; failed retry/evidence/stop not conflict rows; retry assess beside execute in next batch; same records; unsafe dirty/mid-rebase retry omitted; failed provisioning dispatched no child and cleared obstacle re-provisions.

- [ ] **Step 4: Add supplied-answer and cleanup/stop samples.**

  `batch-rebase-answers`: supplied task snapshots no for12, yes for15, unpushable terminal sync18. Facts r1-r5: no child ask;12 records declined/skipped/unsynced report;15 follows existing helper/review/lease sync;18 failed-sync gets failure menu not conflict rows; same-author/no-op/merge candidates cause no extra parent question. Task snapshots do not claim one shared parent answer gave different values to equivalent candidates.

  `batch-cleanup-stop`: own-merge cleanup plus rebased-local stop, records carrying grants/usage/ledger. Facts c1-c6: consequences await all results/menu picks; guarded ordered cleanup retains post rows and drops cleanup; stop resets/asserts pre-head/clean then retires; no record reset; no child after checkout removal and terminal post/evidence follows primary course; stale execute refresh returns fresh report without action. Ordinary teardown stays human-selected, naming discarded commits.

- [ ] **Step 5: Green deterministic tests and update both intents.**

  Run: `node --test scripts/gatekeep-comment-reconcile.test.mjs`

  Run: `node --test eval/lib/lint.test.mjs`

  Expected: all contract and assembly tests pass. Recompute intent hashes with documented `assemble()`/`sha256()` procedure in `eval/README.md:207-219`. Extend gatekeep intent for new sample facts and scope intent for no verdict change. Do not rewrite old expectations to hide failure.

- [ ] **Step 6: Iterate scoped model replays, leaving full runs header-owned.**

  ```bash
  GATEKEEP_BATCH_BASE=$(git log -1 --format=%H --diff-filter=A -- skills/gatekeep-pr/reference/batch.md)
  node eval/run.mjs gatekeep-pr batch-summary-queue --base "$GATEKEEP_BATCH_BASE"
  node eval/run.mjs gatekeep-pr batch-failure-retry --base "$GATEKEEP_BATCH_BASE"
  node eval/run.mjs gatekeep-pr batch-rebase-answers --base "$GATEKEEP_BATCH_BASE"
  node eval/run.mjs gatekeep-pr batch-cleanup-stop --base "$GATEKEEP_BATCH_BASE"
  node eval/run.mjs gatekeep-pr-scope cleanup-after-approve
  ```

  Expected: new facts hold in both cells, no regression/error/inconclusive. Inspect candidate JSON, not aggregate exit. Only runner writes records/reports. Repair owned routing/sample text and hashes; batch/persona defects require Task1-owned correction. Full verification replays both targets and commits observed final reports/records before finish, retaining the readable baseline commit.

- [ ] **Step 7: Hand the live failure-isolation smoke to parent verification.**

  Parent creates a scratch repo with two synthetic PR heads/worktrees and isolated synthetic forge authorization/read responses. Use real pi/cohort/persona and explicit scoped verification, not text replay or fake subagent implementation. Pre-mint two existing-format records and two report destinations outside the worktrees, with neither report file present before dispatch. Run one foreground parent batch without `--rebase`: force one head's pushability probe to fail, so that child returns `FAILED - head not pushable: <head_url>:<head_ref>` before Verify, dispatches no helper, and writes no report; its sibling dispatches Verify then Review as fresh helpers, uses its session-local `plan_tracker`, writes the supplied report path, and returns `REPORT <report path>`.

  Capture actual dispatch/child session evidence and filesystem checks: two distinct worktrees with matching HEAD/cwd identities; only the sibling's Verify/Review calls; sibling tracker updates separate from the parent's PR tasks; exactly the sibling's report at its supplied path and no file at the failed PR's supplied path; both supplied record identities preserved with no second continuation record. After both results, assert the failed PR's menu is `retry`/`show evidence`/`stop` and the sibling's menu is its ordinary menu. Record sanitized branch verification evidence including result lines and supplied record/report/helper paths. Missing tools/models/credentials mean missing proof; do not claim live success from text evals.

- [ ] **Step 8: Check style and commit owned routing/evidence.**

  Run: `node --check scripts/gatekeep-comment-reconcile.test.mjs`

  Run: `git diff --check -- skills/gatekeep-pr/SKILL.md scripts/gatekeep-comment-reconcile.test.mjs eval/gatekeep-pr eval/gatekeep-pr-scope`

  Expected: valid JavaScript/no whitespace errors, imperative ASCII/compact tables, old cases/manifests/references/marketplace untouched. Commit owned files with subject `Gate PR sets through queued per-PR menus (ref #79)` and body `Behavior-change: route sets through isolated children; preserve the single-PR pipeline and eval expectations.` Commit final full-run evidence before finish.

## Wave 3 - User-facing and persona documentation

Depends on Wave 2: document delivered grammar/pins and actual samples. This is the dedicated trailing doc-only wave.

### Task 3: Document the multi-PR invocation and dispatch boundary

**TDD scenario:** Trivial change - documentation-only updates from delivered source.

**Spec:** doc/specs/2026-10-23-gh-79-parallel-gatekeep-prs.md § "Documentation impact" L169-L171

**Files:**
- Modify: `README.md:43-82`
- Modify: `doc/personas.md:3-18`
- Modify: `doc/personas.md:40-70`
- Modify: `CHANGELOG.md:1-5`
- Modify: `eval/gatekeep-pr/README.md:1-27`

**Tests:**
- none: documentation; no Markdown formatter

Decision: Existing agents allowlist/install loops include the new persona automatically; no installer/package change. Keep marketplace unchanged and single-PR Claude support while documenting pi-only sets.

- [ ] **Step 1: Amend the existing README paragraph.**

  Add set invocation, one child/worktree per PR, ordered summary/menus, queued parallel execution, `parallel.maxTasks` default8, and once-per-set eligible-author confirmation. Update touched nine-persona count to ten. Avoid unrelated cleanup.

- [ ] **Step 2: Add `pr-gatekeeper` to the persona guide.**

  Update counts/install paragraph to ten, roster row/frontmatter column, exact tools/pins and unset model/thinking. Explain first `subagent`/extension-tool rights: per-PR context still needs fresh Verify/Review children, with explicit task skill injection. Preserve old persona values.

- [ ] **Step 3: Add changelog and refresh inventory.**

  Add `## Unreleased` above current version with invocation/persona bullet ending `(#79)`; no version bump. Update eval inventory43->47, four sample names/facts, local bundles versus global manifest, readable-baseline requirement, and text-versus-live evidence distinction.

- [ ] **Step 4: Check and commit docs.**

  Run: `git diff --check -- README.md doc/personas.md CHANGELOG.md eval/gatekeep-pr/README.md`

  Expected: no whitespace errors; ASCII/compact tables, working links, delivered grammar/defaults, ten personas and actual sample names. Header validator owns repo-wide style. Commit four docs with subject `Document multi-PR gatekeeping and nested dispatch (ref #79)`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L30-L49 | Set pipeline/fresh per-PR worktrees, inferred issues, positional refusal | Task 1, Task 2 |
| § "Acceptance criteria" L30-L49 | Byte-for-byte single-PR behavior and unchanged old eval outcomes | Task 1, Task 2 |
| § "Acceptance criteria" L30-L49 | Existing per-PR sync; recovered unresolved conflict isolates siblings | Task 1 |
| § "Acceptance criteria" L30-L49 | Child errors/timeouts/no evidence fail independently with reason | Task 1, Task 2 |
| § "Acceptance criteria" L30-L49 | Summary/shared files/ordered menus; no premature selected writes | Task 1, Task 2 |
| § "Acceptance criteria" L30-L49 | Queue every pick, PR-local loops and stop consequences before retirement | Task 1, Task 2 |
| § "Acceptance criteria" L30-L49 | Document entry and commit passing eval evidence/full validator | Task 1, Task 2 |
| § "Entry and argument grammar" L55-L57 | Two-plus tokens before rebase; unchanged one-token path and shared rebase parsing | Task 1, Task 2 |
| § "Entry and argument grammar" L55-L57 | Refuse positional issue, duplicate identity, repo mismatch, oversized set and Claude before effects | Task 1, Task 2 |
| § "Entry and argument grammar" L55-L57 | Cohort cap/default/exact size error; never chunk | Task 1 |
| § "Entry and argument grammar" L55-L57 | New batch reference, one short rule/row, cap, unchanged references | Task 1, Task 2 |
| § "Components" L61-L66 | Parent owns admission/provision/confirmation/roster/UI/picks/consequences | Task 1 |
| § "Components" L61-L66 | Child assesses/executes one PR with fresh helpers, supplied paths and no UI | Task 1 |
| § "Components" L61-L66 | OS-temp roster has identity/paths/status/reason/pick | Task 1 |
| § "Components" L61-L66 | Existing record grammar with parent initialization/picks and child assessment ownership | Task 1 |
| § "Data flow" L70-L78 | Fixed per-PR identity/author/head/base/fork/state/files gather | Task 1 |
| § "Data flow" L70-L78 | One shared fetch, per-fork fetches and gitignore-first setup | Task 1 |
| § "Data flow" L70-L78 | Serial unchanged provision/reuse/keyed checks, isolate failures, no primary races | Task 1 |
| § "Data flow" L70-L78 | Exclude no-op/merge heads; one eligible-author explanation/answer | Task 1 |
| § "Data flow" L70-L78 | Initialize supplied paths, one foreground fresh skilled worktree task each | Task 1 |
| § "Data flow" L70-L78 | Assess steps1-5, sequential helpers, supplied answer and adapter before report | Task 1 |
| § "Data flow" L70-L78 | Integrate all result forms; verbatim reports and correct conflict/failure/stopped menus | Task 1 |
| § "Data flow" L70-L78 | Persist picks and advance; only evidence in place | Task 1 |
| § "Data flow" L70-L78 | Parent consequences then mixed assess/execute batch; refresh rejects stale selection | Task 1 |
| § "Data flow" L70-L78 | Await batches; rerender until empty, never overlap | Task 1 |
| § "Child results" L82 | Exact four closing forms and supplied path; classify invalid/nonzero/timeout | Task 1 |
| § "Outcome adapter" L86-L98 | Mapping only in batch/persona, single-PR owners unchanged | Task 1 |
| § "Outcome adapter" L86-L98 | Conflict failures recover then conflicting without rendered report | Task 1 |
| § "Outcome adapter" L86-L98 | Rebase/server push errors recover then failed-sync | Task 1 |
| § "Outcome adapter" L86-L98 | Terminal sync stop/baseline mismatch/lease refusal get failed not conflict | Task 1 |
| § "Outcome adapter" L86-L98 | Unpushable non-rebase fails before Verify | Task 1 |
| § "Outcome adapter" L86-L98 | Required unavailable fallback fails for no evidence | Task 1 |
| § "Outcome adapter" L86-L98 | Invalid nested helper output fails with role/reason | Task 1 |
| § "Outcome adapter" L86-L98 | Other outcomes report; recovery assertions precede retry | Task 1 |
| § "Pre-report asks" L102-L111 | Stop/write no further at ask; parent renders and reassesses same record | Task 1 |
| § "Pre-report asks" L102-L111 | Parent owns unresolved create token; command/spec use exact task answers | Task 1 |
| § "Pre-report asks" L102-L111 | UNKNOWN not ask; no generic resume, step7 decisions report | Task 1 |
| § "Private handoff" L115 | Initialize target/worktree/null grants/zero usage/terminal defaults once | Task 1 |
| § "Private handoff" L115 | Child validates/owns all digest/evidence/findings/ledger/terminal/repair fields | Task 1 |
| § "Private handoff" L115 | Parent only init/picks, answers in task, fetched data never resets grants | Task 1 |
| § "Summary" L119-L123 | Fixed ordered verdict/source/count with unknown semantics | Task 1 |
| § "Summary" L119-L123 | Every shared path/PR list, unknown files, none, no landing schedule | Task 1 |
| § "Pick round" L127-L132 | Queue except in-place evidence | Task 1 |
| § "Pick round" L127-L132 | Batch-only safe retry/recommendation/omission, mixed assess+execute | Task 1 |
| § "Pick round" L127-L132 | Parent cleanup between batches retains roster/post rows | Task 1 |
| § "Pick round" L127-L132 | Parent stop reset/assert/teardown choice/terminal leave/deletion/retirement | Task 1 |
| § "Pick round" L127-L132 | Stale refresh returns report; parallel waits bounded and awaited | Task 1 |
| § "Grants and retained authority" L136 | Existing grant machinery, reentry consumption, PR-local scope/strategy | Task 1 |
| § "Progress tracking" L140 | Parent task names/statuses, child session stages and checklist fallback | Task 1 |
| § "Persona" L144 | Exact routing label/tools/pins, unset model/thinking, explicit skill and no UI/reset | Task 1 |
| § "Errors and edge cases" L148-L155 | Isolate child/provision failures and safe reprovision retry | Task 1 |
| § "Errors and edge cases" L148-L155 | All terminal: summary/terminal menus, no helpers | Task 1 |
| § "Errors and edge cases" L148-L155 | Shared paths unchanged menus; terminal PR retained until stop | Task 1 |
| § "Errors and edge cases" L148-L155 | Keyed home per PR, serial provision/consequences, pre-effect size refusal | Task 1 |
| § "Tests" L159-L165 | Three-PR summary/confirmation/conflict/no-write/menu/queue sample | Task 2 |
| § "Tests" L159-L165 | Timeout/unpushable/report isolation and mixed retry/execute sample | Task 2 |
| § "Tests" L159-L165 | Supplied rebase answer/skipped report/sibling sync/failed-sync sample | Task 2 |
| § "Tests" L159-L165 | Cleanup/stop/reset/retirement/no record reset sample | Task 2 |
| § "Tests" L163 | Both new bundled files in first readable implementation commit | Task 1 |
| § "Tests" L159-L165 | Local bundles, unchanged old assemblies/outcomes, intents and committed reports | Task 2 |
| § "Tests" L159-L165 | Replay scope target unchanged and commit evidence | Task 2 |
| § "Tests" L165 | Parent live scratch smoke: two worktrees; unpushable child fails before helpers with no report; sibling alone dispatches Verify/Review, tracks and reports at supplied path; no second record and correct menus | Task 2 |
| § "Tests" L166 | Deliver persona/size/cap validator conformance and unchanged marketplace | Task 1, Task 2 |
| § "Documentation impact" L169-L171 | Amend existing docs; no new feature guide | Task 3 |
| § "Documentation impact" L169-L171 | README invocation/cap/confirmation and persona rationale/pins | Task 3 |
| § "Documentation impact" L169-L171 | Unreleased invocation/persona ticket bullet and refreshed sample inventory | Task 3 |
| § "Out of scope" L176 | No combined batch menu/verbs beyond retry | Task 1 |
| § "Out of scope" L177 | Landing order, dependency scheduling and cross-PR close verdict | waived: expressly excluded |
| § "Out of scope" L178 | Rework against current rules | waived: expressly excluded |
| § "Out of scope" L179 | Claude multi-PR implementation | waived: expressly excluded |
| § "Out of scope" L181-L182 | No single-PR reference/sync edits; adapter only batch/persona | Task 1, Task 2 |
| § "Out of scope" L181-L182 | Enumerated asks and assess answers, not generic resume | Task 1, Task 2 |
