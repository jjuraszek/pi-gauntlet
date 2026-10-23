# PR as Brainstorm Subject Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Rework an open in-repository PR on its existing branch, using current base constraints and preserving its history, while retaining the ticket and free-text paths.

**Architecture:** Put subject classification and the rework record in one brainstorming reference, and PR-head provisioning, base merge, and the paginated thread query in one worktree reference. Add narrow call-site branches for gathering, planning, finishing, and handoff; do not move gatekeep's contracts or change settings, personas, bins, or pi-cohort. Commit the two new references before activating their callers so model-eval baseline and candidate arms can both assemble them.

**Tech Stack:** Markdown skills and references; Node.js >=24.15.0 deterministic tests and text evals; Git and GitHub CLI command recipes.

**Spec:** `doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md`

**Verification:** `npm test`

**Ticket:** `#78`

The header entrypoint, scripts/ci.mjs, bundles deterministic tests, instruction lint and size limits, eval structure and hygiene, bundle freshness, and package checks. This verifies delivery of this change, not the scoped policy generated for future PR reworks. No separate Markdown formatter is configured. The Task 7 model replays are separate evidence, not proven by the header entrypoint.

---

## Files

Paths are worktree-relative. No file is deleted. New sample directories contain case.md and expected.md; generated records belong only to Task 7.

**Create - canonical owners (Task 1):**
- `skills/brainstorming/reference/pr-subject.md`
- `skills/using-git-worktrees/reference/pr-head.md`

**Modify - brainstorming (Task 2):**
- `skills/brainstorming/SKILL.md`
- `skills/brainstorming/gatherer.md`
- `skills/brainstorming/reference/spec-finalization.md`
- `skills/brainstorming/reference/amendment-surface.md`
- `skills/brainstorming/reference/pr-subject.md`
- `scripts/brainstorming-contract.test.mjs`
- `eval/brainstorming/intent.md`

**Create - brainstorming samples (Task 2):**
- `eval/brainstorming/samples/pr-subject-resolution/case.md`
- `eval/brainstorming/samples/pr-subject-resolution/expected.md`
- `eval/brainstorming/samples/pr-subject-rule-added-later/case.md`
- `eval/brainstorming/samples/pr-subject-rule-added-later/expected.md`
- `eval/brainstorming/samples/pr-subject-weakened-rule/case.md`
- `eval/brainstorming/samples/pr-subject-weakened-rule/expected.md`
- `eval/brainstorming/samples/pr-subject-repair-over-rewrite/case.md`
- `eval/brainstorming/samples/pr-subject-repair-over-rewrite/expected.md`

**Modify / create - other callers and samples (Tasks 3-6):**
- Modify `skills/using-git-worktrees/SKILL.md`
- Modify `eval/using-git-worktrees/intent.md`
- Create `eval/using-git-worktrees/samples/pr-head/case.md`
- Create `eval/using-git-worktrees/samples/pr-head/expected.md`
- Modify `skills/writing-plans/SKILL.md`
- Modify `skills/writing-plans/reference/plan-contract.md`
- Modify `skills/verification-before-completion/SKILL.md`
- Modify `eval/writing-plans/intent.md`
- Create `eval/writing-plans/samples/pr-subject-threads/case.md`
- Create `eval/writing-plans/samples/pr-subject-threads/expected.md`
- Modify `skills/finishing-a-development-branch/SKILL.md`
- Modify `eval/finishing-a-development-branch/intent.md`
- Create `eval/finishing-a-development-branch/samples/pr-subject-push/case.md`
- Create `eval/finishing-a-development-branch/samples/pr-subject-push/expected.md`
- Modify `skills/gauntlet-handoff/SKILL.md`
- Modify `skills/gauntlet-resume/reference/brief-contract.md`
- Modify `skills/gauntlet-resume/reference/reconstruction.md`
- Modify `eval/gauntlet-resume/intent.md`
- Create `eval/gauntlet-resume/samples/pr-subject-brief/case.md`
- Create `eval/gauntlet-resume/samples/pr-subject-brief/expected.md`

**Modify - generated evidence (Task 7):**
- `eval/brainstorming/report.md`, `eval/brainstorming/results/**/*.json`
- `eval/using-git-worktrees/report.md`, `eval/using-git-worktrees/results/**/*.json`
- `eval/writing-plans/report.md`, `eval/writing-plans/results/**/*.json`
- `eval/finishing-a-development-branch/report.md`, `eval/finishing-a-development-branch/results/**/*.json`
- `eval/gauntlet-resume/report.md`, `eval/gauntlet-resume/results/**/*.json`
- `eval/gatekeep-pr/report.md`, `eval/gatekeep-pr/results/**/*.json`
- Create the baseline.json and candidate.json pair under each new sample's results directory, enumerated in Task 7.

**Modify - cross-cutting docs (Task 8):**
- `README.md`
- `AGENTS.md` outside the shared agents-core block

## Execution conventions

- Apply skills/forge-skill/SKILL.md Authoring rules to every instruction edit: imperative voice, observable branches, minimal edits, ASCII punctuation, no duplicate ownership. Preserve frontmatter and unowned sections. Keep touched skills within the 500-line extraction threshold without reflowing unrelated content; finishing currently has 444 lines.
- The overrides file has no Happy path table, deployment split, lint runner, or formatter. Root package.json defines the single verification entrypoint in the header. Scoped tests use `node --test <file>`; checker tests use `node --experimental-strip-types --test <file>`.
- Deterministic Tests blocks are execution wave gates. Model replays are explicit Task 7 steps, after both references exist in a committed baseline. Do not run model evals from the parallel source-edit tasks: they share result/report trees and the configured model service.
- Scoped instruction lint, with owned paths appended, is `node --input-type=module -e 'import {readFileSync} from "node:fs"; import assert from "node:assert/strict"; import {lintStageSkill} from "./scripts/stage-skill-lint.mjs"; for(const p of process.argv.slice(1)) assert.deepEqual(lintStageSkill(readFileSync(p,"utf8")),[]);'`. The API is scripts/stage-skill-lint.mjs:35-61. Run size lint with `node --input-type=module -e 'import assert from "node:assert/strict"; import {lintSkillSizes} from "./scripts/skill-size-lint.mjs"; assert.deepEqual(lintSkillSizes(process.cwd()),[]);'`. No automatic formatter is configured; review compact tables and changed-line punctuation directly.
- Repo-wide style during Task 7 uses `node --input-type=module -e 'import assert from "node:assert/strict"; import {lintModelLiterals} from "./scripts/model-literal-lint.mjs"; import {lintAll} from "./eval/lib/lint.mjs"; assert.deepEqual(lintModelLiterals(process.cwd()),[]); for(const errors of Object.values(lintAll("eval"))) assert.deepEqual(errors,[]);'`. The header entrypoint bundles the remaining repo-wide lint and hygiene gates.
- Capture the integrated preparatory wave commit SHA after Task 1; forward it to Task 7 as PR_SUBJECT_EVAL_BASE. It is a Git baseline, not an intent hash. Each intent.md's for remains SHA-256 of the bundle-free candidate assembly; record the preparatory Git SHA in its Change paragraph.
- Decision: do not introduce eval/gauntlet-handoff or eval/verification-before-completion targets. The approved Tests table assigns these behaviors to gauntlet-resume and writing-plans. Use new case.md bundle+ declarations, leaving every target.json and old case.md/expected.md unchanged.
- Task commits record `Behavior-change: yes` and #78. Task 1 also records that the references are preparatory and inactive. Generated evidence lands only in Task 7. Commit commands below use bare git in the executor's task worktree.
- Amendment execution state: the parent reports model replays complete and accepted, with all 220 current comparisons unchanged/improved and all 100 new required assertions holding. Retain Task 7's commands as the implementation recipe; do not repeat model calls for this amendment. Source, spec, samples, and records are committed and are not edited by this plan repair. The parent folds this plan into the amendment commit.
- Baseline execution on 028de7f: Tasks 1-7 executed 7, 41, 15, 113, 36, 15, and 46 tests respectively, each with exit 0. HEAD remained 028de7f and porcelain was empty before and after every command. No artifact suffix or baseline-failure row was needed.

## Wave 1 - Canonical reference contracts

### Task 1: Add the two PR-subject reference owners before activating callers

**TDD scenario:** New instruction contracts - preparatory reference-only commit; baseline must contain the complete new files before model replay.

**Spec:** doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md § "Acceptance criteria" L38-L39, § "Acceptance criteria" L40-L41, § "Acceptance criteria" L42-L43, § "Acceptance criteria" L44-L45, § "Ownership" L62-L62, § "Ownership" L63-L63, § "Ownership" L69-L69, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L73-L73, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L75-L79, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L81-L81, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L83-L83, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L85-L85, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L87-L87, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L89-L89, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L93-L93, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L95-L102, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L106-L106, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L107-L107, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L108-L108, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L109-L109, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L111-L111, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L113-L113, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L115-L118, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L119-L119, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L120-L120, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L122-L122, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L124-L124, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L127-L127, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L130-L130, § "Gather (`gatherer.md`)" L134-L134, § "Spec content for a PR subject" L138-L138, § "Spec content for a PR subject" L141-L151, § "Spec content for a PR subject" L154-L154, § "Errors and edge cases" L211-L212, § "Errors and edge cases" L213-L213, § "Errors and edge cases" L214-L215, § "Errors and edge cases" L216-L216, § "Errors and edge cases" L217-L218, § "Errors and edge cases" L219-L219, § "Errors and edge cases" L220-L220, § "Errors and edge cases" L221-L221, § "Errors and edge cases" L222-L222, § "Errors and edge cases" L223-L223, § "Errors and edge cases" L224-L224, § "Errors and edge cases" L225-L225, § "Errors and edge cases" L226-L227, § "Errors and edge cases" L228-L228, § "Errors and edge cases" L229-L229, § "Errors and edge cases" L230-L230, § "Errors and edge cases" L231-L231, § "Tests" L246-L248, § "Out of scope" L270-L270, § "Out of scope" L274-L274

**Files:**
- Create: `skills/brainstorming/reference/pr-subject.md`
- Create: `skills/using-git-worktrees/reference/pr-head.md`
- Test: `scripts/stage-skill-lint.test.mjs`
- Test: `scripts/skill-size-lint.test.mjs`

**Tests:**
- `node --test scripts/stage-skill-lint.test.mjs scripts/skill-size-lint.test.mjs`
- baseline: 028de7f pass
- via: `lintStageSkill`, `lintSkillSizes`

- [ ] **Step 1: Run the declared deterministic tests.** Expected: stage routing, statement-vs-example distinctions, and size fixtures pass before the new files exist.
- [ ] **Step 2: Write pr-subject.md's classification and binding contract.** Match only a trimmed leading GitHub reference (#N, owner/repo#N, /pull/N or /issues/N URL), plus optional intent suffix. Complete gh pr view first with the exact JSON field list at spec L77; only a not-a-PR result reaches gh issue view. Open drafts proceed; non-open, neither, and foreign-repository results copy the exact one-line stops at L77-L81. Compare lowercase origin/PR-url repository identities. Mid-sentence references and Linear/Jira retain today's path. Bind from title, then body first line; never branch, commit subjects, or closingIssuesReferences. Unbound PRs use `none - no ticket`, the pr-N filename, and raw title/body as intent, not invented AC rows.
- [ ] **Step 3: Write pr-subject.md's gather and record contract.** Pass number, URL, title, headRefName, headRefOid, baseRefName, isCrossRepository, and headRepository.nameWithOwner to provisioning as values without a write. Discover PR-carried specs using the resolved spec dirs, gather them as the stated contract, and mark predecessors only when superseded. Require BASE_SHA reads of AGENTS.md, first-found overrides, REVIEW.md, and cited constraint documents on every merge outcome. Treat PR policy edits as proposals. Specify smallest repair, full thread comments, new-since-fork constraints, the draft PR section, Problem content, and the exact record grammar at L138-L154, including none/not-fetched/exception/scoped-result variants.
- [ ] **Step 4: Write pr-head.md's ordered stops and provisioning table.** Resolve ROOT/home without adopting the session tree. Fetch origin, then check fork, branch elsewhere, unreachable or moved digest head, and ahead/diverged local branch in that order, copying exact stop templates at L99-L102. Reuse only the selected home on headRefName; perform the existing dirty ask first, ff-only sync, and exact-HEAD check. For an ancestor local branch, update-ref only after proving ancestry; never use `git -C "$ROOT" branch -f`. For no local branch explain unique-remote DWIM checkout, not the generic -b create. Respect home and wrapper conventions; skip -b/-B create overrides with the exact note, use headRefName with slashes replaced as name, and verify location and head. On a post-create race leave the tree for the user and name its path and SHAs. Capture PRE_REWORK_HEAD and fetched BASE_SHA; add PR, pre-head, and base-SHA lines after Base in the report.
- [ ] **Step 5: Write the merge/conflict recipe.** Preserve every commit reachable from `PRE_REWORK_HEAD`; forbid rebase and any reset/amend replacing that history. Leave this flow's appended spec approval amend and wave fold unchanged. Use the spec's no-ff/no-edit base merge and distinct no-op/clean markers. On conflict snapshot status and dispatch one fresh foreground implementer with only conflicted paths, fetched base, and documented scoped commands. Require both intents, staging of every listed file, and no helper commit/abort/outside-list edit. The orchestrator requires an empty unmerged index and a status delta contained in the list before completing the merge; a contract exception lands and is named in Changes. Otherwise abort and record unresolved files while continuing on the original head, with merge as the eventual plan's Task 1. Read runner/credentials from BASE_SHA overrides only; missing runner or credentials true yields none with its reason. Do not infer file scope from a full-suite script. Conflict tests are the sole pre-approval test exception; add no reviewer or push.
- [ ] **Step 6: Commit the exact reviewThreads query once in pr-head.md.** Copy spec L124-L130 verbatim, including endCursor, pageInfo, all fields, and comment ordering. Require every page, unresolved filtering, full replies, line/originalLine/path fallback, and fetch-failure marker. Other callers cite this owner, never duplicate the query. Leave gatekeep's assessment, sync, brief, fix-wave, assembly, and all personas/extensions/bins/settings/cohort unchanged.
- [ ] **Step 7: Run scoped lint on the two references and the size check.** Review their instructions against forge-skill, and compare every query/stop/record literal to the spec. Expected: complete, lint-clean references with no active call site.
- [ ] **Step 8: Commit the preparatory files.** Run `git add skills/brainstorming/reference/pr-subject.md skills/using-git-worktrees/reference/pr-head.md` and `git commit -m "Add PR-subject reference contracts (ref #78)" -m "Behavior-change: yes. Preparatory references; no active caller yet."`. The orchestrator records the integrated wave SHA as PR_SUBJECT_EVAL_BASE before Wave 2.

Decision: the history boundary is the pre-rework history, not newly appended commits - amended spec L113 explicitly preserves `commit --amend --no-edit` in `brainstorming/reference/spec-finalization.md` and `reset --soft "$WAVE_BASE_SHA"` in `subagent-driven-development/SKILL.md`, where `WAVE_BASE_SHA` descends from `PRE_REWORK_HEAD`. Leave both callers' commit mechanics unchanged.

Contract literals for the two reference recipes and their callers:
- Match/bind: `#N`, `owner/repo#N`, `/pull/N`, `/issues/N`, `state: OPEN`, `isDraft`, `url`, `owner/repo`, `git remote get-url origin`, `closingIssuesReferences`, `reference/ticket-acceptance.md`, `## Acceptance criteria`, `## Problem`, `**Predecessor:**`, `reference/superseding.md`, `Pre-rework head:`, `git log`. Pass exactly `{ number, url, title, headRefName, headRefOid, baseRefName, isCrossRepository, headRepository.nameWithOwner }` by value.
- Call sites and scope: `brainstorming/SKILL.md`, `### 3`, `gatherer.md`, `reference/spec-finalization.md`, `Human input`, `using-git-worktrees/SKILL.md`, `reference/pr-head.md`, `pr-head.md`, `assessment.md`, `sync.md`, `verification-brief.md`, `fix-wave.md`, `eval/gatekeep-pr`, `merge base`, `agents/`, `extensions/`, `src/bins/`, `--rebase`, `/skill:gatekeep-pr`, `close`.
- Provisioning: `git -C "$ROOT" fetch origin`, `isCrossRepository`, `headRefName`, `git worktree list --porcelain`, `headRefOid`, `-b`, `-B`, `create:`, `create: override skipped (contains -b)`, `/`, `-`, `git -C "$WORKTREE" rev-parse HEAD`, `Base:`, `git rebase`, `reset`, `commit --amend`, `.worktrees/pr-<N>`.
- Merge/helper: `implementer`, `cwd`, `async: false`, `git diff --name-only --diff-filter=U`, `SCOPED_TEST_COMMANDS`, `git add`, `done`, `## Rework record`, `--diff-filter=U`, `git status --porcelain`, `git commit --no-edit`, `git merge --abort`, `merge --abort`, `BASE_SHA`, `## PR gate`, `## verification-before-completion`, `requires credentials`, `true`, `requires credentials: true`, `none`, `using-git-worktrees/reference/pr-head.md`, `reviewThreads`, `isResolved == false`, `line`.
- Gather/record: `AGENTS.md`, `REVIEW.md`, `changes:`, `dropped claims:`, `## PR under rework`, `keeps:`, `constraints added since fork:`, `## Codebase recon`, `SKILL.md`, `Framing:`, `Threads: none`, `Changes:`. Preserve the template's full SHA and every none/failure form, including `none - ticket not fetched (<reason>)` and `none run (<reason>)` as instantiated by the observed reason.
- Baseline: `pr-subject.md`, `intent.md`, `eval/README.md`, `target.json`, `bundle+`, `case.md`, `skillSha`.

## Wave 2 - Activate the file-disjoint callers

Depends on Wave 1: all callers can read the committed references. Tasks 2-6 own disjoint source, sample, and intent files. Shared test paths are read-only; these tasks make no GitHub calls, bind no ports, and run no model replays. Task 7 serializes replay writes and service use.

### Task 2: Wire PR classification, trusted gathering, and record preservation

**TDD scenario:** Modifying tested instructions - existing tests first, failing routing assertions, sample definitions, then the caller change.

**Spec:** doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md § "Acceptance criteria" L38-L39, § "Acceptance criteria" L40-L41, § "Acceptance criteria" L44-L45, § "Acceptance criteria" L50-L51, § "Ownership" L62-L62, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L73-L73, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L75-L79, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L81-L81, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L83-L83, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L85-L85, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L87-L87, § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L89-L89, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L113-L113, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L119-L119, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L122-L122, § "Gather (`gatherer.md`)" L134-L134, § "Spec content for a PR subject" L138-L138, § "Spec content for a PR subject" L141-L151, § "Spec content for a PR subject" L154-L154, § "`brainstorming/SKILL.md` edits" L204-L204, § "Errors and edge cases" L210-L210, § "Errors and edge cases" L211-L212, § "Errors and edge cases" L213-L213, § "Errors and edge cases" L222-L222, § "Errors and edge cases" L223-L223, § "Errors and edge cases" L224-L224, § "Errors and edge cases" L226-L227, § "Errors and edge cases" L228-L228, § "Errors and edge cases" L229-L229, § "Errors and edge cases" L230-L230, § "Errors and edge cases" L240-L240, § "Tests" L246-L248, § "Tests" L252-L252, § "Tests" L253-L253, § "Tests" L254-L254, § "Tests" L255-L255

**Files:**
- Modify: `skills/brainstorming/SKILL.md:15-35`
- Modify: `skills/brainstorming/SKILL.md:77-85`
- Modify: `skills/brainstorming/SKILL.md:109-145`
- Modify: `skills/brainstorming/SKILL.md:245-251`
- Modify: `skills/brainstorming/gatherer.md:40-65`
- Modify: `skills/brainstorming/gatherer.md:143-161`
- Modify: `skills/brainstorming/gatherer.md:186-207`
- Modify: `skills/brainstorming/reference/spec-finalization.md:5-46`
- Modify: `skills/brainstorming/reference/spec-finalization.md:50-52`
- Modify: `skills/brainstorming/reference/amendment-surface.md:109-109`
- Modify: `skills/brainstorming/reference/pr-subject.md:17-17`
- Modify: `scripts/brainstorming-contract.test.mjs`
- Modify: `eval/brainstorming/intent.md`
- Create: `eval/brainstorming/samples/pr-subject-resolution/case.md`
- Create: `eval/brainstorming/samples/pr-subject-resolution/expected.md`
- Create: `eval/brainstorming/samples/pr-subject-rule-added-later/case.md`
- Create: `eval/brainstorming/samples/pr-subject-rule-added-later/expected.md`
- Create: `eval/brainstorming/samples/pr-subject-weakened-rule/case.md`
- Create: `eval/brainstorming/samples/pr-subject-weakened-rule/expected.md`
- Create: `eval/brainstorming/samples/pr-subject-repair-over-rewrite/case.md`
- Create: `eval/brainstorming/samples/pr-subject-repair-over-rewrite/expected.md`
- Test: `scripts/brainstorming-contract.test.mjs`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs eval/lib/lint.test.mjs`
- baseline: 028de7f pass
- via: `brainstorming checklist`, `scout task template`, `lintTarget`

- [ ] **Step 1: Run existing tests and add failing routing assertions.** Extend the existing source-reading tests to assert resolution at checklist step 2 after reset, the exact named merge exception, BASE_SHA scout constraints and PR section, preservation/linting of the record, and raw PR council input. Retain numbered-checklist, framing, and grant assertions. Expected red: absent PR hooks, not a test harness failure.
- [ ] **Step 2: Write pr-subject-resolution.** Begin case.md with `bundle+: skills/brainstorming/reference/pr-subject.md`. Give separate observations for open PR, actual issue, neither, mid-sentence mention, and foreign owner/repo. Use synthetic acme/widget identities. Stable judged facts require lookup ordering, one selected path, headRefName/pr-N routing, unchanged issue behavior, both repositories in the foreign stop, title-before-body binding, and unbound no-ticket behavior.
- [ ] **Step 3: Write the other three samples.** Each bundles pr-subject.md. Rule-added-later supplies a compliant fork and a new base rule; facts require the rule in Problem, repair in Changes, and original commits in Keeps. Weakened-rule supplies a clean merge with a PR edit to AGENTS.md; base policy still governs and the edit is changes/dropped claims, never a constraint. Repair-over-rewrite supplies a valid two-line fix; facts require it rather than replacement history. Keep existing expected files unchanged.
- [ ] **Step 4: Add only the five authorized SKILL hooks.** Insert the exact merge exception, checklist resolver route, framing check against the PR diff, same-branch/spec-append sentence in Worktree First, and bound/unbound filename rule. Preserve tracker order, consent, questionary, and every unowned section. PR and issue lookups never run in parallel. Retain the behavior-preserving replay clarifications in the owned references: pr-subject.md requires the concrete date/number/title-derived filename; amendment-surface.md confines its batch menu grammar to amendment batches and preserves the questionary's labeled recommendation and full cancelled-cut re-ask. Neither clarification changes classification, grant, or approval behavior.
- [ ] **Step 5: Wire gatherer.md by values.** Scout stays unconditional and context-builder receives a bound ticket on the PR branch. Pass raw title/body, carried specs, BASE_SHA-to-PRE_REWORK_HEAD paths, full threads/failure marker, merge result, and authoritative base constraint texts. Require claim checks, smallest repair, keeps/changes/dropped/new-constraints/thread dispositions. Place the PR section after Codebase recon; retain existing degradation and AC extraction. Title wins conflicting ticket references and the other becomes Problem context.
- [ ] **Step 6: Preserve the record and council input.** Derive Rework record from the PR draft section and place it after Acceptance criteria. Lint loss of the record on a PR overwrite. Preserve full SHA, merge status, dispositions, exceptions, and scoped test outcomes. Council Human input receives verbatim PR title/body beside ticket rows. Ordinary specs omit the record. Leave approval-time amend behavior unchanged: it amends the flow's appended spec commit, not any commit reachable from PRE_REWORK_HEAD.
- [ ] **Step 7: Update intent and validate.** Preserve applicable prior rationale/moves, name the preparatory SHA in Change, add new sample facts, and compute the bundle-free for with Task 7's recipe. Run declared tests, scoped lint on the five owned instruction files, and size lint. Expected: old and new deterministic assertions pass.
- [ ] **Step 8: Commit.** Stage only owned instruction/test/intent/sample paths and run `git commit -m "Gather PR subjects under base-HEAD constraints (ref #78)" -m "Behavior-change: yes. PR samples and expected facts are exercised in the final eval wave."`.

Decision: only the record-preservation and council-input clauses change in spec-finalization; amended Worktree L113 explicitly retains its spec-gate `commit --amend --no-edit` and the executor's `reset --soft "$WAVE_BASE_SHA"` - no commit at or below `PRE_REWORK_HEAD` may be replaced.

Contract literals for caller edits and fixtures:
- Classifier: `#N`, `owner/repo#N`, `/pull/N`, `/issues/N`, `state: OPEN`, `isDraft`, `url`, `owner/repo`, `git remote get-url origin`, `closingIssuesReferences`, `reference/ticket-acceptance.md`, `none - no ticket`, `## Acceptance criteria`, `## Problem`, `**Predecessor:**`, `reference/superseding.md`, `Pre-rework head:`, `git log`. Forward exactly `{ number, url, title, headRefName, headRefOid, baseRefName, isCrossRepository, headRepository.nameWithOwner }` by value.
- Owner hooks: `skills/brainstorming/reference/pr-subject.md`, `brainstorming/SKILL.md`, `### 3`, `gatherer.md`, `reference/spec-finalization.md`, `Human input`, `reference/pr-subject.md`, `/skill:using-git-worktrees`, `pr-<N>`, `pr-head.md`, `using-git-worktrees/SKILL.md`, `brainstorming/reference/spec-finalization.md`, `subagent-driven-development/SKILL.md`, `WAVE_BASE_SHA`, `git rebase`, `reset`, `commit --amend`.
- Merge inputs/results: `implementer`, `cwd`, `async: false`, `git diff --name-only --diff-filter=U`, `SCOPED_TEST_COMMANDS`, `git add`, `done`, `## Rework record`, `--diff-filter=U`, `git status --porcelain`, `git commit --no-edit`, `git merge --abort`, `merge --abort`, `using-git-worktrees/reference/pr-head.md`, `BASE_SHA`, `AGENTS.md`, `REVIEW.md`, `Changes:`, `changes:`, `dropped claims:`, `line`.
- Draft/record: `## PR under rework`, `keeps:`, `constraints added since fork:`, `## Codebase recon`, `SKILL.md`, `Framing:`, `Threads: none`, `Keeps:`. Keep the specified instantiated thread-fetch, outdated-location, and bound-ticket-failure forms rather than treating a failure as an empty set. Ordinary creation still uses `-b` and `gh pr create`.
- Eval identity/facts: `pr-subject.md`, `intent.md`, `eval/README.md`, `target.json`, `bundle+`, `case.md`, `skillSha`, `eval/brainstorming`, `eval/using-git-worktrees`, `eval/finishing-a-development-branch`, `eval/gauntlet-resume`, `pr-subject-resolution`, `pr-subject-rule-added-later`, `pr-subject-weakened-rule`, `pr-subject-repair-over-rewrite`, `headRefName`.

### Task 3: Route PR-head worktrees ahead of generic linked-worktree reuse

**TDD scenario:** Modifying tested instructions - existing tests first, new PR-head case, then the routing change.

**Spec:** doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md § "Acceptance criteria" L38-L39, § "Acceptance criteria" L42-L43, § "Acceptance criteria" L50-L51, § "Ownership" L63-L63, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L93-L93, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L95-L102, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L106-L106, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L107-L107, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L108-L108, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L109-L109, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L111-L111, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L113-L113, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L115-L118, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L119-L119, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L120-L120, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L122-L122, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L124-L124, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L127-L127, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L130-L130, § "Errors and edge cases" L214-L215, § "Errors and edge cases" L216-L216, § "Errors and edge cases" L217-L218, § "Errors and edge cases" L219-L219, § "Errors and edge cases" L220-L220, § "Errors and edge cases" L221-L221, § "Errors and edge cases" L222-L222, § "Errors and edge cases" L223-L223, § "Errors and edge cases" L225-L225, § "Errors and edge cases" L226-L227, § "Errors and edge cases" L231-L231, § "Errors and edge cases" L240-L240, § "Tests" L246-L248, § "Tests" L256-L256, § "Out of scope" L270-L270

**Files:**
- Modify: `skills/using-git-worktrees/SKILL.md:16-46`
- Modify: `skills/using-git-worktrees/SKILL.md:242-252`
- Modify: `eval/using-git-worktrees/intent.md`
- Create: `eval/using-git-worktrees/samples/pr-head/case.md`
- Create: `eval/using-git-worktrees/samples/pr-head/expected.md`
- Test: `scripts/stage-skill-lint.test.mjs`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test scripts/stage-skill-lint.test.mjs eval/lib/lint.test.mjs`
- baseline: 028de7f pass
- via: `using-git-worktrees Step 0`, `reference/pr-head.md`, `lintTarget`

- [ ] **Step 1: Run existing tests.** Expected: stage-skill and eval bundle declaration fixtures pass.
- [ ] **Step 2: Write the provisioning sample.** Bundle pr-head.md. Supply labeled observations for unrelated linked entry, normal checkout, ancestor local branch, fork, branch elsewhere, unreachable/moved head, local ahead/diverged, branch-creating override, and post-checkout race. Facts require exact head/branch, no caller -b, merge report, no unrelated-tree adoption, and exact one-line stops with no writes before failed preconditions.
- [ ] **Step 3: Add merge and thread observations.** Include no-op, clean merge, helper success/exception/failure, credentials true, and missing scoped runner. Judge list-contained status validation, no helper commit, accurate test results or no-run reason, unresolved merge as Task 1, and base authority after abort. Provide three thread pages, a repair-changing reply, outdated location, and a separate fetch failure. Require all pages/replies and correct location/failure rendering.
- [ ] **Step 4: Add the narrow SKILL hooks.** Before linked reuse in Step 0, route a resolved PR to pr-head.md instead of Steps 0/1. Add the PR-head Step 1 entry and merge-not-rebase sentence in Keeping a Worktree Current. Preserve non-PR detection, keyed contract, wrapper, dirty ask, sandbox, and report path. Do not duplicate query/provisioning tables or change gatekeep.
- [ ] **Step 5: Update intent and validate.** Name preparatory SHA and new facts, compute bundle-free for, then run declared tests, scoped lint on the worktree SKILL, and size lint. Existing target.json and samples stay unchanged.
- [ ] **Step 6: Commit.** Stage owned SKILL/intent/sample paths; run `git commit -m "Provision reworks on the PR head branch (ref #78)" -m "Behavior-change: yes. Preserve the existing non-PR worktree path."`.

Decision: the narrow merge-forward sentence protects pre-rework commits, not the flow's appended spec and wave commits - Worktree L113 retains `commit --amend --no-edit` in `brainstorming/reference/spec-finalization.md` and `reset --soft "$WAVE_BASE_SHA"` in `subagent-driven-development/SKILL.md`; leave those callers unchanged.

Contract literals for routing and the provisioning replay:
- Owners/entry: `skills/using-git-worktrees/reference/pr-head.md`, `using-git-worktrees/SKILL.md`, `pr-head.md`, `reference/pr-head.md`, `reviewThreads`, `#N`, `owner/repo#N`, `eval/brainstorming`, `eval/using-git-worktrees`, `eval/finishing-a-development-branch`, `eval/gauntlet-resume`.
- Provisioning: `git -C "$ROOT" fetch origin`, `isCrossRepository`, `headRefName`, `git worktree list --porcelain`, `headRefOid`, `-b`, `-B`, `create:`, `create: override skipped (contains -b)`, `/`, `-`, `git -C "$WORKTREE" rev-parse HEAD`, `Base:`, `.worktrees/pr-<N>`, `gh pr view`. Prohibit `git -C "$ROOT" branch -f`; only the proven-ancestor update-ref path is allowed.
- History/merge: `PRE_REWORK_HEAD`, `WAVE_BASE_SHA`, `git rebase`, `reset`, `commit --amend`, `implementer`, `cwd`, `async: false`, `git diff --name-only --diff-filter=U`, `SCOPED_TEST_COMMANDS`, `git add`, `done`, `## Rework record`, `--diff-filter=U`, `git status --porcelain`, `git commit --no-edit`, `git merge --abort`, `merge --abort`, `BASE_SHA`, `## PR gate`, `## verification-before-completion`, `requires credentials`, `true`, `requires credentials: true`, `none`, `brainstorming/SKILL.md`, `using-git-worktrees/reference/pr-head.md`, `Changes:`, `isResolved == false`, `line`.
- Baseline and boundaries: `pr-subject.md`, `intent.md`, `eval/README.md`, `target.json`, `bundle+`, `case.md`, `skillSha`, `pr-head`, `--rebase`, `/skill:gatekeep-pr`, `gh pr create`. Copy all command/stop/result templates from pr-head.md into the fixture's expected facts with concrete synthetic identities, keeping the two no-run reasons and thread-fetch failure distinct from success.

### Task 4: Add thread-task planning and PR-scoped verification policy

**TDD scenario:** Modifying tested instructions - checker tests first, new PR-thread case, then the lint-only header and union-consumer policy.

**Spec:** doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md § "Acceptance criteria" L44-L45, § "Acceptance criteria" L50-L51, § "Ownership" L64-L65, § "Ownership" L69-L69, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L113-L113, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L119-L119, § "Spec content for a PR subject" L156-L156, § "Errors and edge cases" L223-L223, § "Tests" L244-L244, § "Tests" L246-L248, § "Tests" L257-L257

**Files:**
- Modify: `skills/writing-plans/SKILL.md:184-210`
- Modify: `skills/writing-plans/SKILL.md:266-287`
- Modify: `skills/writing-plans/SKILL.md:289-352`
- Modify: `skills/writing-plans/reference/plan-contract.md:39-47`
- Modify: `skills/verification-before-completion/SKILL.md:47-49`
- Modify: `skills/verification-before-completion/SKILL.md:172-180`
- Modify: `eval/writing-plans/intent.md`
- Create: `eval/writing-plans/samples/pr-subject-threads/case.md`
- Create: `eval/writing-plans/samples/pr-subject-threads/expected.md`
- Test: `extensions/lib/plan-check.test.ts`

**Tests:**
- `node --experimental-strip-types --test extensions/lib/plan-check.test.ts`
- baseline: 028de7f pass
- via: `plan_check`, `writing-plans Task Structure`, `verification evidence paragraph`, `verify-phase run`

Decision: the new case bundles the complete writing-plans SKILL and verification-before-completion SKILL, because current target.json slices omit the header and verification policy (eval/writing-plans/target.json). Keep target.json unchanged. The amended spec L156 keeps task commands outside the header, so the existing checker's header-only entrypoint rule needs no extension change.

- [ ] **Step 1: Run current checker tests.** Expected: current header-only/full-entrypoint tests pass. Do not edit extensions/lib/plan-check.ts or its tests under the no-extensions scope.
- [ ] **Step 2: Write the PR-thread sample.** Supply an unresolved base merge, two distinct fix ids, keep-open and declined threads, scoped tests, documented lint/format, and a full-suite command which must not be selected. Facts require merge Task 1, one task per fix id with named request and seam, no repair task for non-fix dispositions, and lint/format-only header. Add a no-documented-style subcase requiring `none - PR subject, scoped`. Judge verify's actual union of task commands plus documented header commands, treating the sentinel as no extra command; no task command may be copied into the header. Keep ordinary full-suite headers unchanged.
- [ ] **Step 3: Add PR-only plan rules.** Detect the approved `## Rework record`; place unresolved merge first and thread ids in fix task titles, with the thread request named in `Tests:`/via. In the plan header owner, select only overrides-documented lint/format, or the literal sentinel when absent. State the same PR specialization in Header-only entrypoint in the contract: task `Tests:` commands remain task-owned, and consumers derive the union. Preserve Baseline and checker mechanics; do not evade duplicate rejection with equivalent spellings.
- [ ] **Step 4: Add both verification clauses.** Amend the evidence paragraph and the verify-phase run instruction so a spec carrying `## Rework record` runs the union of all plan task `Tests:` commands and executable lint/format commands from the header. The sentinel adds no command. Preserve freshness, conformance, completion gates, and the ordinary full-suite rule. Add no target/settings/runner bypass and no implement-phase change; its wave gate already runs the task union. Finishing Step 1 is the matching consumer owned by Task 5.
- [ ] **Step 5: Update intent and validate.** Name baseline SHA and new facts, compute for, run checker tests and scoped instruction/size lint. Require the PR sample's lint-only and no-style headers to obey existing duplicate rejection; all candidate must-hold facts are checked in Task 7.
- [ ] **Step 6: Commit.** Stage owned instruction/intent/sample paths; run `git commit -m "Plan PR thread repairs with scoped verification (ref #78)" -m "Behavior-change: yes. Use the approved PR-subject verification contract."`.

Decision: retain `git log` ancestry and appended-commit mechanics - Worktree L113 preserves `commit --amend --no-edit` in `brainstorming/reference/spec-finalization.md` and `reset --soft "$WAVE_BASE_SHA"` in `subagent-driven-development/SKILL.md` with `WAVE_BASE_SHA` after `PRE_REWORK_HEAD`. No executor or spec-gate history edit belongs here.

Contract literals for the shared plan/verify rule: `skills/writing-plans/SKILL.md`, `reference/plan-contract.md`, `skills/verification-before-completion/SKILL.md`, `verification-before-completion/SKILL.md`, `fix`, `unresolved`, `**Verification:**`, `Tests:`, `extensions/lib/plan-check.ts:555`, `## Rework`, `Verification: scoped - <commands>; CI on this push holds the full run`. Preserve the named non-extension boundary: `assessment.md`, `sync.md`, `verification-brief.md`, `fix-wave.md`, `eval/gatekeep-pr`, `pr-head.md`, `merge base`, `agents/`, `extensions/`, `src/bins/`, `using-git-worktrees/SKILL.md`, `git rebase`, `reset`, `commit --amend`. Unresolved merge fixtures retain `implementer`, `cwd`, `async: false`, `git diff --name-only --diff-filter=U`, `SCOPED_TEST_COMMANDS`, `git add`, `done`, `--diff-filter=U`, `git status --porcelain`, `git commit --no-edit`, `git merge --abort`, `merge --abort`, `BASE_SHA`. Keep test populations separate (`scripts/ci.mjs`); baseline/sample identities are `pr-subject.md`, `intent.md`, `eval/README.md`, `target.json`, `bundle+`, `case.md`, `skillSha`, `eval/writing-plans`, `pr-subject-threads`, `eval/brainstorming`, `eval/using-git-worktrees`, `eval/finishing-a-development-branch`, `eval/gauntlet-resume`.

### Task 5: Add the PR-subject finishing menu and non-force push

**TDD scenario:** Modifying tested instructions - current skip-rule tests first; new finish replay distinguishes record-bearing reworks from ordinary ticket finishes.

**Spec:** doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md § "Acceptance criteria" L44-L45, § "Acceptance criteria" L46-L47, § "Acceptance criteria" L50-L51, § "Ownership" L66-L66, § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L113-L113, § "Spec content for a PR subject" L156-L156, § "Finishing" L160-L160, § "Finishing" L162-L162, § "Finishing" L167-L176, § "Finishing" L179-L179, § "Finishing" L181-L181, § "Finishing" L184-L193, § "Finishing" L196-L196, § "Errors and edge cases" L231-L231, § "Errors and edge cases" L232-L232, § "Errors and edge cases" L233-L233, § "Errors and edge cases" L234-L234, § "Errors and edge cases" L235-L235, § "Errors and edge cases" L236-L236, § "Errors and edge cases" L237-L237, § "Errors and edge cases" L238-L238, § "Errors and edge cases" L240-L240, § "Tests" L244-L244, § "Tests" L246-L248, § "Tests" L258-L258, § "Out of scope" L272-L272

**Files:**
- Modify: `skills/finishing-a-development-branch/SKILL.md:33-74`
- Modify: `skills/finishing-a-development-branch/SKILL.md:170-243`
- Modify: `skills/finishing-a-development-branch/SKILL.md:352-362`
- Modify: `skills/finishing-a-development-branch/SKILL.md:412-437`
- Modify: `eval/finishing-a-development-branch/intent.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-push/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-push/expected.md`
- Test: `scripts/finish-verification.test.mjs`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test scripts/finish-verification.test.mjs eval/lib/lint.test.mjs`
- baseline: 028de7f pass
- via: `finishing Step 1`, `Push to the PR branch`, `finish skip rule`

Decision: detect reworks from the spec record, not an open PR on FEATURE. Preserve the current hard gate and telemetry-only freshness exception. Capture completion evidence before the existing strip-and-seal block removes the plan (finishing SKILL L220-L243). For a rework, Step 1 derives the task `Tests:` union plus only the header's lint/format commands; `none - PR subject, scoped` adds no command. This matches Task 4's verify consumer and needs no extension edit.

- [ ] **Step 1: Run existing tests and write the replay.** Bundle the complete finishing SKILL and pr-head.md; the default target contains only Step 6. Supply rework and ordinary specs, missing pre-head, closed PR, wrong branch, rewritten ancestry, moved-origin with/without pre-head ancestry, and unexpected git error. Facts require six-vs-five menus, correct withholding/numbering and stops, and no unsupported origin-advanced claim. Include lint-only and no-style plan headers: Step 1 must still run the task command union, while the ordinary path uses its full header set. The body checks cover the explicit `Dropped claims: none` for the supplied no-drops record and one `No longer true: <claim>` line per dropped claim; neither outcome omits the Dropped claims field. Use the accepted replay evidence for this amendment; run no new model calls.
- [ ] **Step 2: Add record detection and PR base selection.** Read PR/pre-head from the selected spec; missing pre-head stops naming the path. Confirm number/url/headRefName/baseRefName/state, require OPEN and FEATURE equality, and use baseRefName as base. Derive the task-command union plus header lint/format as the scoped verification set. Ordinary specs never enter this path. Preserve the existing verified-commit/telemetry exclusion expressions byte-for-byte for their executable fixture tests.
- [ ] **Step 3: Add pre-menu ancestry checks and the exact menu.** Fetch origin; first prove PRE_REWORK_HEAD ancestor of HEAD, then origin/headRefName ancestor of HEAD. First exit 1 stops as rewritten history; second exit 1 withholds row 1 with both SHAs. The moved-past-base suffix needs its own proof; other exits are errors. Copy six rows and consequences from spec L167-L179, apply menu-layout to render and reply, and keep rows 2-6 numbered when push is withheld. Add no approval.
- [ ] **Step 4: Capture task-plus-commit resolution evidence.** Before plan stripping require the thread-id task to be accepted complete, then count naming first-parent commits in the post-merge/pre-head range. One plus complete gives fixed-in; zero/multiple plus complete gives the explicit task-complete/no-single-commit fallback. Missing/incomplete stays open; path touches or grep alone prove nothing. Refetch through pr-head.md, preserve dispositions, render new threads open, omit GitHub-resolved threads, and distinguish none from failure. Add independent sample facts for each rule.
- [ ] **Step 5: Add the non-force push action.** Use existing plan-strip/seal with option pr and origin/baseRefName; retain seal failure stops and whole-PR telemetry. Save the full before SHA at refs/gauntlet/pre-rework/pr-N, then push HEAD to refs/heads/headRefName on origin with --no-follow-tags and no force flag. Rejection is reported once, skips description edit, and returns the menu without retry. PR rows 2-6 map to unchanged old Options 1-5, including discard leaving origin untouched.
- [ ] **Step 6: Append the exact Rework block after successful push.** Fetch body fresh; write an outside-repo scratch body with exact original bytes, one blank line, and the spec L184-L194 template; use gh pr edit --body-file. Include keeps/changes, the exact template line `Dropped claims: <none | one "No longer true: <claim>" line per dropped claim>`, full portable pre-head/local ref, spec/head, scoped command set, whole-PR telemetry, and refreshed thread resolutions. Always emit the dropped-claims status: render `Dropped claims: none` when the record drops none; otherwise name each dropped claim with `No longer true: <claim>`. Add the supersedes-description line only when all claims are dropped. On edit failure keep the push and print the block for manual paste. Never reply to threads, merge, change a ticket, or rewrite body text. Add Quick Reference/Red Flags entries without duplicating the recipe.
- [ ] **Step 7: Update intent and validate.** Name baseline and facts; compute bundle-free for, which may be unchanged because default assembly is Step 6. Run declared tests and scoped/size lint. Keep the narrow PR branch within 500 lines using compact tables and one block template rather than duplicating old recipes.
- [ ] **Step 8: Commit.** Stage owned SKILL/intent/sample paths; run `git commit -m "Push reworks to the existing PR without force (ref #78)" -m "Behavior-change: yes. Preserve ordinary finishing choices and original body bytes."`.

Decision: the ancestry preflight protects all pre-rework commits (`git log`), while appended commits remain foldable - amended Worktree L113 retains `commit --amend --no-edit` in `brainstorming/reference/spec-finalization.md` and `reset --soft "$WAVE_BASE_SHA"` in `subagent-driven-development/SKILL.md`. Leave those mechanics unchanged.

Contract literals for the finishing implementation and replay:
- Detection/policy: `skills/finishing-a-development-branch/SKILL.md`, `## Rework record`, `PR:`, `Pre-rework head:`, `state`, `OPEN`, `headRefName`, `$FEATURE`, `baseRefName`, `skills/writing-plans/SKILL.md`, `fix`, `unresolved`, `**Verification:**`, `plan_check`, `extensions/lib/plan-check.ts:555`, `verification-before-completion/SKILL.md`, `Tests:`, `## Rework`, `Verification: scoped - <commands>; CI on this push holds the full run`.
- History/preflight: `PRE_REWORK_HEAD`, `WAVE_BASE_SHA`, `using-git-worktrees/SKILL.md`, `pr-head.md`, `git rebase`, `reset`, `commit --amend`, `git fetch origin`. The exact ancestry commands, rewrite stop, withhold line, moved-origin suffix, and stable withheld row come from spec L162/L179 and must be instantiated with the observed refs/SHAs, never approximated.
- Landing: `merge-base(HEAD, base)...HEAD`, `--force`, `--force-with-lease`, `-f`, `gh pr view --json body`, `refs/gauntlet/pre-rework/pr-<N>`, `supersedes the description above`, `still open`, `Threads: none`, `complete`, `fixed`, `keep open`, `decline`, `AGENTS.md`, `gh pr create`, `gh pr edit`, `-b`, `SKILL.md`, `update-ref`, `fixed in`, `fixed (task ... complete; no single commit names ...)`. Use the spec's exact strip/seal, save-ref, non-force push, edit, and per-thread evidence commands, not alternate spellings.
- Delivery/eval: `scripts/ci.mjs`, `SCOPED_TEST_COMMANDS`, `pr-subject.md`, `intent.md`, `eval/README.md`, `target.json`, `bundle+`, `case.md`, `skillSha`, `eval/brainstorming`, `eval/using-git-worktrees`, `eval/finishing-a-development-branch`, `eval/gauntlet-resume`, `pr-subject-push`.

### Task 6: Preserve PR identity and candidate base in handoff and resume

**TDD scenario:** Modifying tested grammar - existing brief tests first, then a producer/consumer replay in the current resume target.

**Spec:** doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md § "Acceptance criteria" L48-L49, § "Acceptance criteria" L50-L51, § "Ownership" L67-L67, § "Ownership" L69-L69, § "Handoff and resume" L200-L200, § "Errors and edge cases" L230-L230, § "Errors and edge cases" L239-L239, § "Errors and edge cases" L240-L240, § "Tests" L246-L248, § "Tests" L259-L259, § "Out of scope" L274-L274

**Files:**
- Modify: `skills/gauntlet-handoff/SKILL.md:85-101`
- Modify: `skills/gauntlet-resume/reference/brief-contract.md:27-60`
- Modify: `skills/gauntlet-resume/reference/brief-contract.md:108-153`
- Modify: `skills/gauntlet-resume/reference/reconstruction.md:24-47`
- Modify: `eval/gauntlet-resume/intent.md`
- Create: `eval/gauntlet-resume/samples/pr-subject-brief/case.md`
- Create: `eval/gauntlet-resume/samples/pr-subject-brief/expected.md`
- Test: `scripts/brief-contract-lint.test.mjs`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test scripts/brief-contract-lint.test.mjs eval/lib/lint.test.mjs`
- baseline: 028de7f pass
- via: `gauntlet-handoff step 6`, `Process-state restore`, `reconstruction Candidates`, `lintBriefGrammar`

Decision: preserve cohort's six-heading core and Repo state fields. Only the gauntlet Process state grammar owns the optional pair, and its terminal gate-history line stays last (brief-contract L45-L60 and scripts/brief-contract-lint.mjs:1-42).

- [ ] **Step 1: Run tests and write pr-subject-brief.** Bundle full handoff SKILL, brief-contract.md, and reconstruction.md. Supply producer cases with/without a record and consumer cases on correct/mismatched PR branches. Include an earlier PR spec predating pre-head plus rework spec/plan after it. Facts require exactly two optional lines before the terminal line, ordinary output unchanged, branch binding, and pre-head candidate selection without a multi-spec pick.
- [ ] **Step 2: Extend grammar and producer.** Document optional PR/pre-head in the section table and appended-block layout. Step 6 reads the run worktree's record to supply values and cites the canonical layout rather than restating the whole grammar. Preserve tracker blocks, Active task, and final line. Add no cohort change or extra durable file.
- [ ] **Step 3: Add branch binding before tracker writes.** With PR present, fetch headRefName and compare the live branch; mismatch uses the exact spec stop. Keep existing entry checks, grant parsing, plan repair, and task initialization. Infer no approval, review history, fix rounds, or gate evidence from PR fields.
- [ ] **Step 4: Override candidate base only.** Use the brief's full pre-head for added spec/plan scans. Preserve pairing, untracked candidates, task evidence, and human confirmation. The old PR spec is an input, not a newly added candidate. Without the optional pair, or on bare-worktree entry, retain current behavior.
- [ ] **Step 5: Update intent and validate.** Name baseline/new facts and compute for. Run declared tests and `node --input-type=module -e 'import assert from "node:assert/strict"; import {lintBriefGrammar,readSkillFiles} from "./scripts/brief-contract-lint.mjs"; assert.deepEqual(lintBriefGrammar(readSkillFiles(process.cwd())),[]);'`. Expected: only the contract owns grammar, both SKILLs cite it, old fixtures pass.
- [ ] **Step 6: Commit.** Stage owned instruction/intent/sample paths; run `git commit -m "Carry PR rework identity through handoff (ref #78)" -m "Behavior-change: yes. Use pre-rework candidate scans without changing cohort's core grammar."`.

Contract literals for the producer/consumer: `/skill:gauntlet-handoff`, `/skill:gauntlet-resume`, `## Process state`, `Pre-rework head:`, `skills/gauntlet-handoff/SKILL.md`, `skills/gauntlet-resume/reference/brief-contract.md`, `skills/gauntlet-resume/reference/reconstruction.md`, `gauntlet-handoff`, `gauntlet-resume`, `brief-contract.md`, `reconstruction.md`, `## Rework record`, `Active task:`, `PR:`, `headRefName`, `merge-base HEAD origin/HEAD`, `**Predecessor:**`. Preserve the exact branch lookup/stop from spec L200, with concrete worktree/PR values. Ordinary paths retain `-b` and `gh pr create`. Scope/baseline terms: `assessment.md`, `sync.md`, `verification-brief.md`, `fix-wave.md`, `eval/gatekeep-pr`, `pr-head.md`, `merge base`, `agents/`, `extensions/`, `src/bins/`, `pr-subject.md`, `intent.md`, `eval/README.md`, `target.json`, `bundle+`, `case.md`, `skillSha`, `eval/brainstorming`, `eval/using-git-worktrees`, `eval/finishing-a-development-branch`, `eval/gauntlet-resume`, `pr-subject-brief`, `reference/brief-contract.md`, `reference/reconstruction.md`, `close`.

## Wave 3 - Integrated replay evidence

Depends on Wave 2: caller changes, cases, and intent hashes are committed. This is one task because replays share reports/result trees and the configured model service. Source failures return to the owning task before replay; no instruction edit belongs in Task 7.

### Task 7: Replay all affected targets against the preparatory reference commit

**TDD scenario:** Integration evidence - compare baseline/candidate at the approved preparatory baseline and require new candidate facts plus unchanged legacy behavior.

**Spec:** doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md § "Acceptance criteria" L38-L39, § "Acceptance criteria" L40-L41, § "Acceptance criteria" L42-L43, § "Acceptance criteria" L48-L49, § "Acceptance criteria" L50-L51, § "Ownership" L69-L69, § "Errors and edge cases" L240-L240, § "Tests" L244-L244, § "Tests" L246-L248, § "Tests" L252-L252, § "Tests" L253-L253, § "Tests" L254-L254, § "Tests" L255-L255, § "Tests" L256-L256, § "Tests" L257-L257, § "Tests" L258-L258, § "Tests" L259-L259, § "Tests" L261-L261, § "Out of scope" L270-L270

**Files:**
- Modify: `eval/brainstorming/report.md`
- Modify: `eval/brainstorming/results/**/*.json`
- Modify: `eval/using-git-worktrees/report.md`
- Modify: `eval/using-git-worktrees/results/**/*.json`
- Modify: `eval/writing-plans/report.md`
- Modify: `eval/writing-plans/results/**/*.json`
- Modify: `eval/finishing-a-development-branch/report.md`
- Modify: `eval/finishing-a-development-branch/results/**/*.json`
- Modify: `eval/gauntlet-resume/report.md`
- Modify: `eval/gauntlet-resume/results/**/*.json`
- Modify: `eval/gatekeep-pr/report.md`
- Modify: `eval/gatekeep-pr/results/**/*.json`
- Create: `eval/brainstorming/results/pr-subject-resolution/baseline.json`
- Create: `eval/brainstorming/results/pr-subject-resolution/candidate.json`
- Create: `eval/brainstorming/results/pr-subject-rule-added-later/baseline.json`
- Create: `eval/brainstorming/results/pr-subject-rule-added-later/candidate.json`
- Create: `eval/brainstorming/results/pr-subject-weakened-rule/baseline.json`
- Create: `eval/brainstorming/results/pr-subject-weakened-rule/candidate.json`
- Create: `eval/brainstorming/results/pr-subject-repair-over-rewrite/baseline.json`
- Create: `eval/brainstorming/results/pr-subject-repair-over-rewrite/candidate.json`
- Create: `eval/using-git-worktrees/results/pr-head/baseline.json`
- Create: `eval/using-git-worktrees/results/pr-head/candidate.json`
- Create: `eval/writing-plans/results/pr-subject-threads/baseline.json`
- Create: `eval/writing-plans/results/pr-subject-threads/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-push/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-push/candidate.json`
- Create: `eval/gauntlet-resume/results/pr-subject-brief/baseline.json`
- Create: `eval/gauntlet-resume/results/pr-subject-brief/candidate.json`
- Test: `eval/lib/replay.test.mjs`
- Test: `eval/lib/checks.test.mjs`
- Test: `eval/lib/records.test.mjs`
- Test: `eval/lib/judge.test.mjs`

**Tests:**
- `node --test eval/lib/replay.test.mjs eval/lib/checks.test.mjs eval/lib/records.test.mjs eval/lib/judge.test.mjs`
- baseline: 028de7f pass
- via: `assemble`, `parseCase`, `parseExpected`, `cellReusable`, `deriveLabels`

Decision: for is not a Git SHA. eval/README.md:101-111 and eval/lib/replay.mjs:36-49 define sha256(assemble(target, treeReader(root))) without bundle+ files. Sample bundles affect their own identities; never widen target.json or old samples to force a result.

- [ ] **Step 1: Confirm baseline and harness.** Run Tests. Read PR_SUBJECT_EVAL_BASE from Task 1, or recover with `git log --format=%H --diff-filter=A -1 -- skills/brainstorming/reference/pr-subject.md`; verify both references exist there and callers are inactive. Set the execution variable to that observed SHA, never fork point/current HEAD/an invented value.
- [ ] **Step 2: Check intent identities without editing them here.** Run `node --input-type=module -e 'import {readFileSync} from "node:fs"; import {assemble,treeReader} from "./eval/lib/replay.mjs"; import {sha256} from "./eval/lib/checks.mjs"; for(const t of process.argv.slice(1)){const target=JSON.parse(readFileSync("eval/"+t+"/target.json","utf8")); console.log(t,sha256(assemble(target,treeReader(process.cwd()))));}' brainstorming using-git-worktrees writing-plans finishing-a-development-branch gauntlet-resume`. Compare each output with for and verify Change names the baseline Git SHA. Mismatch returns to the source owner before model calls.
- [ ] **Step 3: Run the new samples individually.** Run `node eval/run.mjs brainstorming pr-subject-resolution --base "$PR_SUBJECT_EVAL_BASE"`, then the same command with pr-subject-rule-added-later, pr-subject-weakened-rule, and pr-subject-repair-over-rewrite as the sample. Run `node eval/run.mjs using-git-worktrees pr-head --base "$PR_SUBJECT_EVAL_BASE"`, `node eval/run.mjs writing-plans pr-subject-threads --base "$PR_SUBJECT_EVAL_BASE"`, `node eval/run.mjs finishing-a-development-branch pr-subject-push --base "$PR_SUBJECT_EVAL_BASE"`, and `node eval/run.mjs gauntlet-resume pr-subject-brief --base "$PR_SUBJECT_EVAL_BASE"`. Every candidate must-hold fact must hold, even when both arms failing would count as pre-existing. Errors/inconclusive outcomes are not passes.
- [ ] **Step 4: Run the full brainstorming target.** Run `node eval/run.mjs brainstorming --base "$PR_SUBJECT_EVAL_BASE"`. Require all four new cases' candidate facts and no unapproved legacy regression. Preserve existing accepted variance; never widen intent merely to silence a judgment.
- [ ] **Step 5: Run full worktree and plan targets.** Run `node eval/run.mjs using-git-worktrees --base "$PR_SUBJECT_EVAL_BASE"`, then `node eval/run.mjs writing-plans --base "$PR_SUBJECT_EVAL_BASE"`. Require current records and preserved legacy behavior.
- [ ] **Step 6: Run full finishing and resume targets.** Run `node eval/run.mjs finishing-a-development-branch --base "$PR_SUBJECT_EVAL_BASE"`, then `node eval/run.mjs gauntlet-resume --base "$PR_SUBJECT_EVAL_BASE"`. Require new facts and no lost cleanup, plan-repair, or brief behavior.
- [ ] **Step 7: Run gatekeep unchanged.** Run `node eval/run.mjs gatekeep-pr --base "$PR_SUBJECT_EVAL_BASE"`. No source/sample/target/intent edits are authorized for gatekeep. Cached reusable evidence may remain byte-identical; inspect regenerated records/report without inventing a behavioral change on reuse.
- [ ] **Step 8: Run style and inspect provenance.** Run the Execution conventions root-wide style and size commands. Verify target.json and old cases/expected files are unchanged and generated records have no private paths/secrets/stray handles or fabricated baselines. Read all six reports and route real failures to source owners. Never hand-edit outcomes or promote candidate into baseline as a shortcut.
- [ ] **Step 9: Commit generated evidence.** Stage only changed report/results paths in the six targets and run `git commit -m "Record PR-subject replay evidence (ref #78)" -m "Behavior-change: yes. Compare with the preparatory reference commit; existing expected facts are unchanged."`. Header verification belongs to verify, not this task's local gate.

Contract literals for the replay matrix: `#N`, `owner/repo#N`, `headRefName`, `headRefOid`, `-b`, `create:`, `gh pr create`, `/skill:gauntlet-handoff`, `/skill:gauntlet-resume`, `assessment.md`, `sync.md`, `verification-brief.md`, `fix-wave.md`, `eval/gatekeep-pr`, `pr-head.md`, `merge base`, `agents/`, `extensions/`, `src/bins/`, `scripts/ci.mjs`, `SCOPED_TEST_COMMANDS`, `Tests:`, `pr-subject.md`, `intent.md`, `eval/README.md`, `target.json`, `bundle+`, `case.md`, `skillSha`, `eval/brainstorming`, `eval/using-git-worktrees`, `eval/writing-plans`, `eval/finishing-a-development-branch`, `eval/gauntlet-resume`, `pr-subject-resolution`, `reference/pr-subject.md`, `pr-<N>`, `pr-subject-rule-added-later`, `## Problem`, `## Rework record`, `Changes:`, `Keeps:`, `pr-subject-weakened-rule`, `changes:`, `pr-subject-repair-over-rewrite`, `pr-head`, `reference/pr-head.md`, `pr-subject-threads`, `fix`, `unresolved`, `**Verification:**`, `pr-subject-push`, `SKILL.md`, `update-ref`, `## Rework`, `Threads: none`, `fixed in`, `pr-subject-brief`, `skills/gauntlet-handoff/SKILL.md`, `reference/brief-contract.md`, `reference/reconstruction.md`, `PR:`, `Pre-rework head:`, `--rebase`, `/skill:gatekeep-pr`. Judge the task-union/header-lint split, not a combined header test command; ordinary fixtures retain their full verification path.

## Wave 4 - Cross-cutting documentation

Depends on Wave 3: docs describe implemented behavior with current evidence. This trailing doc-only wave owns no instruction or eval file from earlier tasks.

### Task 8: Document PR entry, landing, and the Rework body exemption

**TDD scenario:** Documentation-only change - source-backed review; no Markdown formatter is configured.

**Spec:** doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md § "Acceptance criteria" L46-L47, § "Ownership" L69-L69, § "Finishing" L196-L196, § "Documentation impact" L265-L265, § "Documentation impact" L266-L266, § "Out of scope" L270-L270, § "Out of scope" L272-L272, § "Out of scope" L274-L274

**Files:**
- Modify: `README.md:34-45`
- Modify: `AGENTS.md:97-99`

**Tests:**
- none: documentation; no Markdown formatter is configured

- [ ] **Step 1: Update README step 1.** Add leading-reference PR entry, existing-branch rework, and current-base rules. Keep ticket/free-text and consent behavior; remove incomplete ticket-or-free-text-only framing in the touched unit.
- [ ] **Step 2: Update README step 5.** Describe push-to-existing-PR, appended Rework body, and refs/gauntlet/pre-rework/pr-N as a local before handle whose full SHA is portable. State no-force and retained original body; link the owner instead of adding another guide. Do not imply fork support, gatekeep multi-PR, thread replies, automatic merge, or ticket-state updates.
- [ ] **Step 3: Update the local AGENTS exemption.** Include finishing's Rework block beside PR title/body, outside shared core markers. Preserve exact-text gates for reporter-facing tracker/Slack writes. Do not edit AGENTS.core.md or siblings.
- [ ] **Step 4: Review and commit.** Resolve touched links, check source-backed commands and ASCII punctuation. Leave CHANGELOG.md to release as the spec directs. Run `git add README.md AGENTS.md` and `git commit -m "Document PR-subject entry and finishing (ref #78)" -m "Document the Rework description exemption and local pre-rework ref."`.

Contract literals for the documented boundary: `README.md`, `AGENTS.md`, `CHANGELOG.md`, `refs/gauntlet/pre-rework/pr-<N>`, `## Rework`, `supersedes the description above`, `pr-head.md`, `still open`, `Threads: none`, `fix`, `complete`, `fixed`, `fixed (task ... complete; no single commit names ...)`, `keep open`, `decline`, `assessment.md`, `sync.md`, `verification-brief.md`, `fix-wave.md`, `eval/gatekeep-pr`, `merge base`, `agents/`, `extensions/`, `src/bins/`, `--rebase`, `/skill:gatekeep-pr`, `close`. Cite rather than duplicate the owner for resolution evidence, including its first-parent commit command, complete-task requirement, and zero/multiple-commit fallback.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L38-L39 | AC1: resolution, PR context, and base-rule fixture | Task 1, Task 2, Task 3, Task 7 |
| § "Acceptance criteria" L40-L41 | AC2: keeps/changes and small repair | Task 1, Task 2, Task 7 |
| § "Acceptance criteria" L42-L43 | AC3: PR branch/head and pre-write stops | Task 1, Task 3, Task 7 |
| § "Acceptance criteria" L44-L45 | AC4: append commits without replacing pre-rework history | Task 1, Task 2, Task 4, Task 5 |
| § "Acceptance criteria" L46-L47 | AC5: sixth action, saved ref, non-force push, thread block | Task 5, Task 8 |
| § "Acceptance criteria" L48-L49 | AC6: brief and same-worktree PR resume | Task 6, Task 7 |
| § "Acceptance criteria" L50-L51 | AC7: legacy facts unchanged, new PR samples, and header repository gate | Task 2, Task 3, Task 4, Task 5, Task 6, Task 7 |
| § "Ownership" L62-L62 | One subject/gather/record owner and narrow hooks | Task 1, Task 2 |
| § "Ownership" L63-L63 | One worktree/merge/query owner | Task 1, Task 3 |
| § "Ownership" L64-L65 | Thread planning, lint-only header, and task-union verification owners | Task 4 |
| § "Ownership" L66-L66 | Finishing detection, preflight, body, ref | Task 5 |
| § "Ownership" L67-L67 | Process-state pair and candidate base | Task 6 |
| § "Ownership" L69-L69 | Gatekeep text and assembly untouched | Task 1, Task 7 |
| § "Ownership" L69-L69 | No personas/extensions/bins/settings/cohort changes | Task 1, Task 4, Task 6, Task 8 |
| § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L73-L73 | Leading match plus suffix; mid-sentence free text | Task 1, Task 2 |
| § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L75-L79 | PR-before-issue, OPEN, neither stop | Task 1, Task 2 |
| § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L81-L81 | Lowercase origin/url identity; foreign stop | Task 1, Task 2 |
| § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L83-L83 | Bound/unbound filename instantiated with date, number, and title slug; other subjects unchanged | Task 1, Task 2 |
| § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L85-L85 | Title/body ticket precedence and unbound AC handling | Task 1, Task 2 |
| § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L87-L87 | Gather carried specs; supersession only when replaced | Task 1, Task 2 |
| § "Subject resolution (`pr-subject.md`, read at checklist step 2)" L89-L89 | Pass resolved fields without writing | Task 1, Task 2 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L93-L93 | Route before generic linked reuse | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L95-L102 | Ordered fork/elsewhere/unreachable/divergence stops | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L106-L106 | Home reuse, dirty ask, ff-only and exact head | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L107-L107 | Proven ancestor update-ref; no force branch | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L108-L108 | Unique-remote DWIM rather than generic create | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L109-L109 | Safe override, skip note, normalized name | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L111-L111 | Post-create check and pre-head/base/report values | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L113-L113 | Preserve all pre-rework history; appended spec amend and wave fold unchanged | Task 1, Task 2, Task 3, Task 4, Task 5 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L115-L118 | No-ff base merge, no-op vs first commit | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L119-L119 | Helper boundaries, stage/status proof, commit or abort | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L119-L119 | Record exceptions; unresolved merge is Task 1 | Task 1, Task 2, Task 3, Task 4 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L120-L120 | Base runner/credentials source, no invented file scope | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L122-L122 | Only named pre-approval merge/tests exception | Task 1, Task 2, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L124-L124 | One query owner, gatekeep prose unchanged | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L127-L127 | Exact paginated GraphQL query | Task 1, Task 3 |
| § "Worktree (`pr-head.md`, read from `using-git-worktrees/SKILL.md` Step 0 when the caller passes a PR)" L130-L130 | Every page, full comments, unresolved filtering, location fallback | Task 1, Task 3 |
| § "Gather (`gatherer.md`)" L134-L134 | Scout always, ticket context-builder when bound | Task 1, Task 2 |
| § "Gather (`gatherer.md`)" L134-L134 | Base documents and cited constraints govern every outcome | Task 1, Task 2 |
| § "Gather (`gatherer.md`)" L134-L134 | Raw PR/specs/diff paths/full threads/merge inputs | Task 1, Task 2 |
| § "Gather (`gatherer.md`)" L134-L134 | Claim checks, repair, keeps/changes/dropped/new rules/threads | Task 1, Task 2 |
| § "Gather (`gatherer.md`)" L134-L134 | PR draft after recon and diff-based framing | Task 1, Task 2 |
| § "Spec content for a PR subject" L138-L138 | Problem intent, new constraints, and record after AC | Task 1, Task 2 |
| § "Spec content for a PR subject" L141-L151 | Exact rework record grammar | Task 1, Task 2 |
| § "Spec content for a PR subject" L154-L154 | None/failure variants, preserve/lint record, council raw intent, ordinary omission | Task 1, Task 2 |
| § "Spec content for a PR subject" L156-L156 | Fix thread task/id/request in Tests | Task 4 |
| § "Spec content for a PR subject" L156-L156 | Unresolved merge is first task | Task 4 |
| § "Spec content for a PR subject" L156-L156 | Lint/format-only header or sentinel; verify/finish run task union plus header | Task 4, Task 5 |
| § "Finishing" L160-L160 | Spec detection, OPEN/head/missing-pre-head stops, base | Task 5 |
| § "Finishing" L162-L162 | Ancestry preflight, withholding, suffix proof, errors | Task 5 |
| § "Finishing" L167-L176 | Exact six rows and PR consequences | Task 5 |
| § "Finishing" L179-L179 | Withheld push render, stable numbering, no extra gate | Task 5 |
| § "Finishing" L181-L181 | Strip/seal, whole-PR telemetry, before ref, non-force/no-retry, fresh body append | Task 5 |
| § "Finishing" L184-L193 | Exact scoped Rework template, including explicit Dropped claims status for none and one No longer true line per dropped claim | Task 5 |
| § "Finishing" L196-L196 | Supersession marker only for all dropped claims | Task 5 |
| § "Finishing" L196-L196 | Refetch: old dispositions/new open/resolved omitted/none/failure | Task 5 |
| § "Finishing" L196-L196 | Complete task plus one naming commit yields fixed-in | Task 5 |
| § "Finishing" L196-L196 | Completion fallback; missing/incomplete stays open | Task 5 |
| § "Finishing" L196-L196 | Exemption documented and old actions retained | Task 5, Task 8 |
| § "Handoff and resume" L200-L200 | Optional pair before terminal line, ordinary output same | Task 6 |
| § "Handoff and resume" L200-L200 | Branch binding before restore and exact stop | Task 6 |
| § "Handoff and resume" L200-L200 | Pre-head scans exclude earlier spec, no other changes | Task 6 |
| § "`brainstorming/SKILL.md` edits" L204-L204 | Five named hooks only | Task 2 |
| § "Errors and edge cases" L210-L210 | Mid-sentence mention stays free text | Task 2 |
| § "Errors and edge cases" L211-L212 | Closed/merged stops and draft-open proceeds | Task 1, Task 2 |
| § "Errors and edge cases" L213-L213 | Foreign repository stops before provisioning | Task 1, Task 2 |
| § "Errors and edge cases" L214-L215 | Fork and branch elsewhere pre-write stops | Task 1, Task 3 |
| § "Errors and edge cases" L216-L216 | Unrelated session linked tree is not selected | Task 1, Task 3 |
| § "Errors and edge cases" L217-L218 | Behind fast-forward; ahead/diverged stop | Task 1, Task 3 |
| § "Errors and edge cases" L219-L219 | Branch-creating override skipped and noted | Task 1, Task 3 |
| § "Errors and edge cases" L220-L220 | Post-create race leaves tree, names SHAs/path | Task 1, Task 3 |
| § "Errors and edge cases" L221-L221 | Successful helper commits merge with test outcome | Task 1, Task 3 |
| § "Errors and edge cases" L222-L222 | Contract exception recorded in Changes | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L223-L223 | Failed helper aborts, trusted base, merge Task 1 | Task 1, Task 2, Task 3, Task 4 |
| § "Errors and edge cases" L224-L224 | Clean merged policy weakening is not trusted | Task 1, Task 2 |
| § "Errors and edge cases" L225-L225 | Credentials/no runner yields none with reason | Task 1, Task 3 |
| § "Errors and edge cases" L226-L227 | Fetch failure marker and outdated fallback | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L228-L228 | Bound-ticket failure uses current ticket contract | Task 1, Task 2 |
| § "Errors and edge cases" L229-L229 | Title wins ticket mismatch; other is context | Task 1, Task 2 |
| § "Errors and edge cases" L230-L230 | Earlier spec gathered/superseded, excluded from resume | Task 1, Task 2, Task 6 |
| § "Errors and edge cases" L231-L231 | Rebase forbidden; finishing catches rewritten ancestry | Task 1, Task 3, Task 5 |
| § "Errors and edge cases" L232-L232 | Moved origin withholds only push with SHAs | Task 5 |
| § "Errors and edge cases" L233-L233 | Ticket re-finish retains five rows | Task 5 |
| § "Errors and edge cases" L234-L234 | Closed PR finish stops, no create fallback | Task 5 |
| § "Errors and edge cases" L235-L235 | New threads stay open | Task 5 |
| § "Errors and edge cases" L236-L236 | Push rejection once, no edit, menu returns | Task 5 |
| § "Errors and edge cases" L237-L237 | Edit failure leaves push and prints manual block | Task 5 |
| § "Errors and edge cases" L238-L238 | Missing pre-head stop names spec | Task 5 |
| § "Errors and edge cases" L239-L239 | Brief/branch mismatch stops | Task 6 |
| § "Errors and edge cases" L240-L240 | Other subjects preserve existing behavior, including amendment-menu isolation and the unchanged questionary | Task 2, Task 3, Task 5, Task 6, Task 7 |
| § "Tests" L244-L244 | Delivery tests distinct from generated scoped workflow | Task 4, Task 5, Task 7 |
| § "Tests" L246-L248 | Preparatory references before sites, explicit base, no target edits, full target run | Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7 |
| § "Tests" L252-L252 | Resolution sample | Task 2, Task 7 |
| § "Tests" L253-L253 | New-base-rule sample | Task 2, Task 7 |
| § "Tests" L254-L254 | Weakened-rule sample | Task 2, Task 7 |
| § "Tests" L255-L255 | Repair-over-rewrite sample | Task 2, Task 7 |
| § "Tests" L256-L256 | PR-head/merge/pagination sample | Task 3, Task 7 |
| § "Tests" L257-L257 | Thread-task/lint-only-header sample | Task 4, Task 7 |
| § "Tests" L258-L258 | Finishing menu/push/body/evidence sample | Task 5, Task 7 |
| § "Tests" L259-L259 | Handoff/resume sample | Task 6, Task 7 |
| § "Tests" L261-L261 | Old touched-target and gatekeep samples unchanged | Task 7 |
| § "Documentation impact" L265-L265 | README entry/landing/ref and AGENTS exemption | Task 8 |
| § "Documentation impact" L265-L265 | Changelog remains release-owned | Task 8 |
| § "Documentation impact" L266-L266 | Replace incomplete entry framing | Task 8 |
| § "Out of scope" L270-L270 | Gatekeep multi-PR/rebase/claim work not included | Task 1, Task 3, Task 7, Task 8 |
| § "Out of scope" L271-L271 | No fork-hosted-head path | waived: explicitly excluded; stop only |
| § "Out of scope" L272-L272 | No thread replies; body dispositions only | Task 5, Task 8 |
| § "Out of scope" L273-L273 | No automatic PR merge or ticket-state write | waived: expressly excluded actions |
| § "Out of scope" L274-L274 | No close verdict, cross-PR landing order, or disk continuation store | Task 1, Task 6, Task 8 |
| § "Out of scope" L275-L275 | No pi-cohort change | waived: explicitly excluded dependency work |
