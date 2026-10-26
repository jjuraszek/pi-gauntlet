# PR-list rework subject Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Rework related open PRs on the first retained PR's branch, preserve every member's provenance, and gate member closure after a successful home push and description update.

**Architecture:** Pass an ordered array of the existing PR value shape through the existing instruction pipeline. Merge members before the base, record one identity/head/thread group per PR, and consume those groups in finish and resume without adding runtime state or changing planning or verification engines.

**Tech Stack:** Markdown instruction contracts, Node.js node:test wording checks, existing text-replay eval harness, Git and GitHub CLI recipes.

**Spec:** `doc/specs/2026-10-26-gh-89-pr-list-rework-subject.md`

**Verification:** `npm test`

**Ticket:** `#89`

---

## Recon and execution constraints

- This is a ticket subject. The fenced Rework record example is not this run's record; use ordinary verification.
- The overrides have no Happy path, lint or formatter commands. `package.json:59-64` and `scripts/ci.mjs` define the full check, bundling instruction, stage, brief, model-literal and eval lint with deterministic tests. No formatter is configured. Task-local style: `git diff --check`, `node --check` for changed JavaScript, and instruction review against `skills/forge-skill/SKILL.md:32-49`.
- Scoped test commands use `node --test` with one file. Existing seams: `scripts/brainstorming-contract.test.mjs:1-176` reads shipped instructions; `scripts/finish-verification.test.mjs:1-109` uses scratch Git fixtures; `scripts/brief-contract-lint.test.mjs:1-125` checks grammar ownership.
- Read each whole instruction file before editing; use imperative voice, compact tables and minimal owner-local edits. The finish skill is exactly 500 lines. Keep its modified units concise and the resulting file at or below 500 lines without dropping obligations or reflowing unrelated sections. This avoids introducing a reference absent from the eval baseline: `eval/run.mjs:185-217` reads every bundled path on both arms and refuses missing paths.
- Evals use synthetic narrated observations, not live tracker operations. Model calls and committed evidence generation belong to Task 5, not Baseline. `eval/README.md:35-145` owns assembly, intent SHA and runner rules. Do not perform live PR merges, pushes or closes while implementing instructions.
- The predecessor already has the approved partial supersession banner at `doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md:3`. Verify and preserve it rather than appending a duplicate. No new feature documentation, bin, extension, dependency or AGENTS edit is needed.
- Amendment continuation: Tasks 1, 3 and 4 reopen only for the regression-safety clarifications below; preserve their completed list behavior. Task 5 remains in progress and owns all four targets' raw results as well as intents and reports. Task 6 remains pending. Keep all task titles and wave positions unchanged.

## Baseline provenance

Initial BASE: `1dbc90b5`. Initial per-file inventory: `?? doc/plans/2026-10-26-gh-89-pr-list-rework-subject.md`; this exact plan path was admitted. The approved spec path was also allowed but had no status entry. No other path was dirty or admitted. Executed every task's Tests command unchanged: Tasks 1, 4 and 6 each ran 33 tests; Task 2 ran 23; Task 3 ran 1; Task 5 ran 14. All six executions exited 0 with tests executed. After each execution, HEAD remained `1dbc90b5` and status remained only the untracked plan; no generated artifacts or contamination occurred.

Amendment BASE: `c23c02fe`. Initial per-file inventory: empty (clean worktree); only `doc/plans/2026-10-26-gh-89-pr-list-rework-subject.md` and `doc/specs/2026-10-26-gh-89-pr-list-rework-subject.md` were admitted, with no in-flight paths. The endpoint-tree proof `git diff --quiet 1dbc90b5 c23c02fe -- . ':!doc/specs/' ':!doc/plans/'` exited 1, so no evidence was retained. Reran all six task Tests commands unchanged: Tasks 1, 4 and 6 each ran 34 tests; Task 2 ran 37; Task 3 ran 1; Task 5 ran 14. Every execution exited 0 with tests executed. After each run HEAD remained `c23c02fe` and status was empty; no generated artifacts or contamination occurred.

Regression-safety amendment BASE: `6f144da7`. Initial per-file inventory: ` M doc/specs/2026-10-26-gh-89-pr-list-rework-subject.md`. Admitted exactly that parent-supplied in-flight spec path and `doc/plans/2026-10-26-gh-89-pr-list-rework-subject.md`; no other path was dirty or admitted. The endpoint-tree proof `git diff --quiet c23c02fe HEAD -- . ':!doc/specs/' ':!doc/plans/'` at HEAD `6f144da7` exited 1, so no evidence was retained. Reran all six task Tests commands unchanged: Tasks 1, 4 and 6 each ran 39 tests; Task 2 ran 37; Task 3 ran 1; Task 5 ran 14. All six executions exited 0 with tests executed. After each execution HEAD remained `6f144da7` and status remained only the admitted modified spec; no generated artifacts or contamination occurred. Before checker repair, status listed only the same spec and plan, both modified and admitted; HEAD remained `6f144da7`. The proof `git diff --quiet 6f144da7 HEAD -- . ':!doc/specs/' ':!doc/plans/'` exited 0. All six unchanged commands retain their executed evidence at the same SHA; no re-stamping was needed.

## Files

**Modify - instructions:**
- `skills/using-git-worktrees/reference/pr-head.md`
- `skills/brainstorming/SKILL.md`
- `skills/brainstorming/reference/pr-subject.md`
- `skills/brainstorming/gatherer.md`
- `skills/brainstorming/reference/spec-finalization.md`
- `skills/brainstorming/reference/ticket-acceptance.md`
- `skills/brainstorming/reference/amendment-surface.md`
- `skills/finishing-a-development-branch/SKILL.md`
- `skills/gauntlet-handoff/SKILL.md`
- `skills/gauntlet-resume/SKILL.md`
- `skills/gauntlet-resume/reference/brief-contract.md`
- `skills/gauntlet-resume/reference/reconstruction.md`

**Modify - deterministic checks:**
- `scripts/brainstorming-contract.test.mjs`
- `scripts/finish-verification.test.mjs`
- `scripts/brief-contract-lint.test.mjs`

**Modify - existing samples:**
- `eval/using-git-worktrees/samples/pr-head/case.md`
- `eval/using-git-worktrees/samples/pr-head/expected.md`
- `eval/finishing-a-development-branch/samples/pr-subject-push/case.md`
- `eval/brainstorming/samples/pr-subject-resolution/case.md`
- `eval/brainstorming/samples/pr-subject-resolution/expected.md`

**Create - sample cases and expected facts:** exact paths are enumerated in the owning Tasks 1-4 below. The sample names by target are:

| Target directory | New sample directories under samples/ |
|---|---|
| `eval/using-git-worktrees` | `pr-list-member-merge-order`, `pr-list-member-conflict-unresolved`, `pr-list-member-conflict-repaired`, `pr-list-interrupted-recovery` |
| `eval/finishing-a-development-branch` | `pr-list-push-and-close`, `pr-list-push-rejected`, `pr-list-body-edit-failed`, `pr-list-member-advanced` |
| `eval/gauntlet-resume` | `pr-list-brief` |
| `eval/brainstorming` | `pr-list-admission-mixed-base`, `pr-list-admission-issue-in-list`, `pr-list-relatedness-split`, `pr-list-per-pr-attribution`, `pr-list-record-missing-member` |

**Modify - evidence:** `intent.md`, `report.md` and existing `results/**/*.json` in each of those four target directories. **Create - evidence:** each new sample's `baseline.json` and `candidate.json`, all enumerated in Task 5. The bounded Modify globs cover only these four targets because the runner determines which existing cells are stale. Task 5 ships the raw cells in the checkout, not only eight intent/report paths or a cache outside it.

**Modify - public docs:** `README.md`, `CHANGELOG.md`.

**Delete:** none.

## Wave 1 - Independent receiving contracts

Tasks 1-3 own disjoint files and test fixtures. They use no shared mutable runtime resource; model calls are deferred to Task 5. Each implements the spec-defined receiving contract without needing a sibling patch.

### Task 1: Merge and recover admitted member heads on home

**TDD scenario:** Modifying tested code - run existing tests, add wording regressions, then change the instructions.

**Spec:** doc/specs/2026-10-26-gh-89-pr-list-rework-subject.md § "Acceptance criteria" L31-L32, § "Acceptance criteria" L33-L34, § "Acceptance criteria" L37-L38, § "Acceptance criteria" L39-L40, § "Design" L87, § "Design" L89, § "Design" L91-L95, § "Design" L97, § "Design" L99, § "Design" L101, § "Design" L166, § "Errors and edge cases" L175, § "Errors and edge cases" L176, § "Errors and edge cases" L177, § "Out of scope" L224

**Files:**
- Modify: `skills/using-git-worktrees/reference/pr-head.md:3-100`
- Modify: `scripts/brainstorming-contract.test.mjs:123-150`
- Modify: `eval/using-git-worktrees/samples/pr-head/case.md`
- Modify: `eval/using-git-worktrees/samples/pr-head/expected.md`
- Create: `eval/using-git-worktrees/samples/pr-list-member-merge-order/case.md`
- Create: `eval/using-git-worktrees/samples/pr-list-member-merge-order/expected.md`
- Create: `eval/using-git-worktrees/samples/pr-list-member-conflict-unresolved/case.md`
- Create: `eval/using-git-worktrees/samples/pr-list-member-conflict-unresolved/expected.md`
- Create: `eval/using-git-worktrees/samples/pr-list-member-conflict-repaired/case.md`
- Create: `eval/using-git-worktrees/samples/pr-list-interrupted-recovery/case.md`
- Create: `eval/using-git-worktrees/samples/pr-list-member-conflict-repaired/expected.md`
- Create: `eval/using-git-worktrees/samples/pr-list-interrupted-recovery/expected.md`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: 6f144da7 pass
- via: `skills/using-git-worktrees/reference/pr-head.md` provisioning, recovery and unresolved-threads recipe

Decision: reuse `pr-head.md`'s "Merge the fetched base" helper/completion checks and documented scoped-runner selection. Resolve BASE_SHA before any member helper needs fetched-base overrides. Member failure stops; base failure retains the existing unresolved-merge plan continuation. The selected home path is carried as WORKTREE; the validated no-worktree branch is attached with `git -C "$ROOT" worktree add "$WORKTREE" <headRefName>`, without updating that branch ref (`pr-head.md` "Provision the exact head").

L166 boundary: this task owns recovery/helper commands. Task 4 owns `brainstorming/reference/ticket-acceptance.md` enumeration provenance and `brainstorming/reference/amendment-surface.md` human review plus `loop: amend` versus `loop: cut row N`; Task 3 owns `gauntlet-resume/SKILL.md` continuation. Task 5 checks their combined regression safety without expanding this task's file ownership.

- [ ] **Step 1: Run existing tests.** Run the Tests command; expect green.
- [ ] **Step 2: Write failing provisioning assertions.** In `scripts/brainstorming-contract.test.mjs`, assert the member loop, recovery subject/second-parent checks, already-landed report, stop-before-base behavior and widened exception. Check member reachability stops occur before worktree writes. Add regression assertions for the explicit no-worktree recovery command and selected-worktree targeting of helper/completion commands. Run the Tests command; expect the new assertions to fail.
- [ ] **Step 3: Widen pre-write checks.** Consume the ordered array; select home by its `headRefName` and set `PRE_REWORK_HEAD` to its `headRefOid`. After `fetch origin`, check every member's original object is reachable and its remote-tracking branch still equals that head before any worktree write. Preserve home fork, elsewhere, race, wrapper and dirty-tree safeguards from `pr-head.md:3-32`. `/skill:brainstorming #12 #13 #14` supplies three heads, all retained.
- [ ] **Step 4: Add interrupted-run recovery.** Replace the list-only `HEAD == headRefOid` check with the spec's first-parent `%H %P %s` walk after home's supplied head. Require home ancestry, merge commits only, canonical member subject, admitted member identity and original head as second parent. Inspect the actual local home branch tip when it has no worktree, not the caller's HEAD. Reject unrelated commits/dirt before writes, with the spec's path/branch/head stop. Skip recognized merges and print `Member merge:` with `(already landed)` and the existing merge SHA. `git merge --no-ff` of an ancestor makes no commit; do not invent one. No reset, rebase or deletion; N=1 retains exact-head behavior. Spell out `git -C "$ROOT" worktree add "$WORKTREE" <headRefName>` for successful validated recovery with no worktree; then verify `git -C "$WORKTREE" rev-parse HEAD` equals the validated tip. Do not add `-b` or force/update the recovered branch.
- [ ] **Step 5: Add ordered merges.** Merge remaining original heads with `--no-ff` and the spec's `merge PR #<N> head <sha7> into PR #<home>` subject in listed order before the base. On conflict, dispatch a fresh foreground `implementer` with only conflicted paths, fetched-base SCOPED_TEST_COMMANDS and `git add` per resolved path, targeted as `git -C "$WORKTREE" add`; forbid helper commits and outside edits. Use `git -C "$WORKTREE" diff --name-only --diff-filter=U`, `git -C "$WORKTREE" diff --cached --name-only` and `git -C "$WORKTREE" status --porcelain` for completion checks; require empty unmerged index, each path staged and status delta contained, then `git -C "$WORKTREE" commit --no-edit`. Keep every helper/completion command targeted at the selected worktree even when the caller is elsewhere.
- [ ] **Step 6: Add member failure and report recipes.** On helper/completion failure run `git -C "$WORKTREE" merge --abort`, leaving last-good home state. Preserve the existing abort-exit, branch, HEAD and clean-status proofs before claiming restoration; a failed proof requires manual recovery, not reset or clean. Transcribe the spec's stop naming PR, paths, worktree, branch, last-good SHA, earlier merged members and manual merge/rerun or drop-member recovery. Stop before base/spec/plan/later merges/push/close. A manual resolution must retain the canonical merge subject to satisfy the specified recovery walk. On success run the existing base merge; report one `PR:`/`Pre-rework head:` pair per PR home first, member lines then base outcome. Preserve all-original-head ancestry checks after every base outcome. Carry `MEMBER_HEADS` as `{ number, url, title, headRefName, headRefOid }`.
- [ ] **Step 7: Widen the exception and fail closed on gather thread fetch.** Match `brainstorming/SKILL.md`'s future owner text: "the base merge and each admitted member-head merge, their conflict helpers' edits to the conflicted files, and their scoped conflict tests". Preserve thread pagination, comment ordering and location fallback. Replace the gather continuation on fetch failure with the per-PR stop before gather, including N=1. Finish still owns its distinct post-verification fetch-failure reporting.
- [ ] **Step 8: Add four eval samples.** Follow existing `pr-head` bundle loading. Assert #13 then #14 then origin/main; helper/abort and no base/spec for unresolved #14 after #13; `commit --no-edit` and base after repaired #14; and validated #13 recovery with #14 next plus a stray-non-merge refusal variant. Cover all-head ancestry and report order. Extend existing `pr-head` input/expected facts only for the intentional N=1 thread-fetch stop; preserve its other guards. Retain all current recovery/helper must-hold facts when applying the small command clarifications.
- [ ] **Step 9: Confirm green and style.** Run the Tests command, `node --check scripts/brainstorming-contract.test.mjs`, and `git diff --check`; expect pass, valid syntax and no whitespace errors. Review instructions against forge-skill.
- [ ] **Step 10: Commit.** Stage only declared writes and run `git commit -m "Merge admitted PR members on home (ref #89)"`. State that this changes agent behavior and name the worktree samples whose reports Task 5 supplies.

### Task 2: Gate absorbed-member closure after a successful home update

**TDD scenario:** Modifying tested code - add ordering and failure checks before changing the finish recipe.

**Spec:** doc/specs/2026-10-26-gh-89-pr-list-rework-subject.md § "Acceptance criteria" L45-L46, § "Acceptance criteria" L47-L48, § "Design" L134, § "Design" L140, § "Design" L142, § "Design" L144, § "Design" L146, § "Design" L148-L154, § "Design" L156, § "Errors and edge cases" L178, § "Errors and edge cases" L180, § "Out of scope" L223

**Files:**
- Modify: `skills/finishing-a-development-branch/SKILL.md:35-46`
- Modify: `skills/finishing-a-development-branch/SKILL.md:185-204`
- Modify: `skills/finishing-a-development-branch/SKILL.md:269-299`
- Modify: `skills/finishing-a-development-branch/SKILL.md:458-466`
- Modify: `scripts/finish-verification.test.mjs`
- Modify: `eval/finishing-a-development-branch/samples/pr-subject-push/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-push-and-close/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-push-and-close/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-push-rejected/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-push-rejected/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-body-edit-failed/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-body-edit-failed/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-member-advanced/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-member-advanced/expected.md`
- Test: `scripts/finish-verification.test.mjs`

**Tests:**
- `node --test scripts/finish-verification.test.mjs`
- baseline: 6f144da7 pass
- via: `skills/finishing-a-development-branch/SKILL.md` Step 1, preflight and PR-subject row 1

Decision: retain the existing inline recipe and sample's full-skill `bundle+` loading. Keep the modified paragraphs and close-question block within 500 total lines by removing blank-line padding inside the touched units, not by deleting rules. This preserves a baseline-loadable assembly (`eval/run.mjs:185-217`).

- [ ] **Step 1: Run existing tests and add red checks.** Run Tests first. Add assertions for all-head ancestry, every original-head local ref, home-only push, successful body edit prerequisite, member eligibility, exact target authorization, no deletion, and the final closing sentence. Run again; expect new failures.
- [ ] **Step 2: Read the plural record and widen proofs.** Parse top-level `PR:`/`Pre-rework head:` pairs home first. Only home drives `gh pr view` branch/state confirmation. Prove every original head is an ancestor and stop on first exit 1 with that head's SHA; preserve non-0/1 error handling and remote ancestry withholding. Read combined `Base:`, `Keeps:`, `Changes:`, `Dropped claims:` and `Scoped tests:` only. Ignore lowercase `keeps:`/`changes:`/`dropped claims:` provenance under the new `spec-finalization.md` grammar. N=1 has `Threads:` after `Pre-rework head:` and a `### PR #<N>` subsection in the record, but its finish output stays unchanged.
- [ ] **Step 3: Extend row 1 without changing its safety gates.** Preserve scoped evidence capture, strip/seal order and whole-PR seal base. Write local pre-rework refs for every PR, then push home without force. Refresh threads once per recorded PR with the existing paginated `$n` query. Home retains accepted-complete task resolution and `git log --first-parent` evidence; member threads retain recorded dispositions and mark newly opened/resolved states, never use home's first-parent history as member-fix proof.
- [ ] **Step 4: Append an attributed body.** Add `Absorbs:` after `Before:` in `## Rework` and label each PR's `Threads:` list. Keep original description bytes, scratch-file construction and no extra approval for `gh pr edit`. A rejected push skips the body; failed body fetch/edit prints the block for paste and skips closure. N=1 omits member additions.
- [ ] **Step 5: Select eligible close targets.** Save the pushed home head. After successful push and body edit, refresh each member's state/current head; require `OPEN` and current-head ancestry of the pushed SHA. Exclude and name moved/closed members, including `#14 skipped: state CLOSED`. Render the spec's fully instantiated single close question, with one actual target/comment per line using that member's recorded pre-head SHA, and `1 - yes, close #13, #14` for the two-member fixture. Ask nothing when no target qualifies; no N=1 member line or question.
- [ ] **Step 6: Execute approved pairs only.** On `1`, re-fetch state/head immediately before each `gh pr close` and skip changed targets under stale authorization. Use the exact displayed comment/repository and no `--delete-branch`; report a failed close once without retry. On `2`, leave members open. Mark ship complete afterward. Cover `Closed: #13, #14`, partial-close failure and `Member PRs #13, #14 left open.`; instantiate `Member PRs ... left open.` with actual members. Rows 2-6 and withheld/failed ancestry/push/body paths never offer closure and name untouched members. End row 1 with exactly `Post no review-thread replies, merge no PR, change no ticket state, and close no PR other than the absorbed members through the question above.`
- [ ] **Step 7: Add four narrated samples.** Cover ordered success with three distinct heads and attributed threads; rejected push; failed body edit; and advanced #14 excluded while #13 remains eligible. Include variants for decline, stale authorization, already-closed state, failed close and non-row-1 choices. Load the existing full skill and query reference using the existing `pr-subject-push` pattern. Move that existing fixture's record Threads group to the new N=1 position and add its provenance subsection; retain its unchanged output expectations.
- [ ] **Step 8: Confirm green and style.** Run Tests, `node --check scripts/finish-verification.test.mjs`, and `git diff --check`; count the finish skill's lines and keep at most 500. Expect green and no whitespace errors; preserve exact comment and stop templates from the spec.
- [ ] **Step 9: Commit.** Stage task writes and run `git commit -m "Gate closure of absorbed PR members (ref #89)"`; name the behavior change and finish samples in the body.

### Task 3: Carry ordered PR provenance through handoff and resume

**TDD scenario:** Modifying tested code - extend grammar assertions before editing producer and consumer instructions.

**Spec:** doc/specs/2026-10-26-gh-89-pr-list-rework-subject.md § "Acceptance criteria" L49-L50, § "Design" L160, § "Design" L162, § "Design" L166, § "Errors and edge cases" L179, § "Errors and edge cases" L180

**Files:**
- Modify: `skills/gauntlet-handoff/SKILL.md:78-91`
- Modify: `skills/gauntlet-resume/SKILL.md:155-172`
- Modify: `skills/gauntlet-resume/reference/brief-contract.md:25-60`
- Modify: `skills/gauntlet-resume/reference/brief-contract.md:117-123`
- Modify: `skills/gauntlet-resume/reference/reconstruction.md:25-45`
- Modify: `scripts/brief-contract-lint.test.mjs`
- Create: `eval/gauntlet-resume/samples/pr-list-brief/case.md`
- Create: `eval/gauntlet-resume/samples/pr-list-brief/expected.md`
- Test: `scripts/brief-contract-lint.test.mjs`

**Tests:**
- `node --test scripts/brief-contract-lint.test.mjs`
- baseline: 6f144da7 pass
- via: `skills/gauntlet-resume/reference/brief-contract.md` Producers and Process-state restore; `skills/gauntlet-resume/SKILL.md` Post-restore continuation

Decision: grammar remains solely in `brief-contract.md`, as `scripts/brief-contract-lint.test.mjs:7-48` requires; handoff links it rather than inlining the layout. Reconstruction reads candidate contents before choosing (`reconstruction.md:33-45`); use their record and Problem metadata to filter member-carried paths before the multi-spec prompt, without treating artifact presence as approval. The no-ledger call-table mapping comes from `skills/loop-implementation/SKILL.md` Entry steps 1-5, not the existing-ledger continuation.

L166 boundary: Task 1 owns `pr-head.md` recovery/helper commands; Task 4 owns `brainstorming/reference/ticket-acceptance.md` enumeration provenance and `brainstorming/reference/amendment-surface.md` human review plus `loop: amend` versus `loop: cut row N`. This task owns only the resume continuation clarification; Task 5 checks the combined regression safety.

- [ ] **Step 1: Run existing tests and add red assertions.** Run Tests; add plural-pair checks for producer/table/loop wording, first-pair-only identity fetch, order stop and candidate exclusion. Pin the no-ledger Entry steps 1-5 mapping in the Post-restore continuation row, including clean worktree, ledger check/commit and implement start. Run again; expect new checks to fail.
- [ ] **Step 2: Widen the canonical producer grammar.** In `brief-contract.md`'s `## Process state` table, `## Producers` and loop alternative, require one or more consecutive PR/head pairs, one per record group, home first, record order. Keep the gate-history line after the last pair. Make `gauntlet-handoff/SKILL.md` step 6 copy every top-level pair. No record uses the ordinary brief. N=1 is still one `PR:`/`Pre-rework head:` pair; `Threads:` and the record's `### PR #<N>` subsection are not new brief fields.
- [ ] **Step 3: Validate binding before tracker writes.** Under `## Process-state restore`, fetch `headRefName` for the first pair only and compare with the actual worktree branch. Preserve the exact mismatch template. Compare ordered brief identities to top-level `## Rework record` `PR:` identities; stop with both orders on mismatch. Carry every original head downstream, without fetching member branches for the identity check. Preserve entry checks, grants, task status snapshots and no fabricated gate history.
- [ ] **Step 4: Filter reconstruction candidates.** Keep first-pair pre-head as scan base. Read member-carried spec paths under each member in `## Problem`; exclude exactly those paths from new-rework candidates, then retain plan/spec pairing and human confirmation. Keep ordinary no-pair reconstruction. Do not choose by filename alone when candidates remain genuinely ambiguous.
- [ ] **Step 4a: Clarify no-ledger continuation.** In `gauntlet-resume/SKILL.md`'s approved-loop-spec/no-ledger row, preserve check 6 and brainstorm arming/skip, then explicitly map Entry 1 to settings, 2 to verification, 3 to the driver's plan skip, 4 to the clean named-branch check and ledger creation, and 5 to `plan_check`, commit and `start implement`. Carry the absolute worktree/spec and resolved plan directory. Keep the no-writing-plans/no-task-tracker rule and the separate existing-ledger continuation unchanged; edit only the owning row.
- [ ] **Step 5: Add the brief sample.** Create `pr-list-brief` with three complete pairs, home-branch success, `pr-list-brief-mismatch` and `pr-list-brief-order` variants, plus a merged-in member spec excluded from candidates. Assert both branch names/orders on stops and no tracker calls. Use the existing `pr-subject-brief` bundle pattern, adding the existing handoff and reconstruction owners so the sample can exercise producer and candidate behavior.
- [ ] **Step 6: Confirm green and style.** Run Tests, `node --check scripts/brief-contract-lint.test.mjs`, and `git diff --check`; expect grammar ownership and new checks green.
- [ ] **Step 7: Commit.** Stage task writes and run `git commit -m "Preserve PR-list provenance across resume (ref #89)"`; identify the behavior change and sample in the body.

## Wave 2 - Resolve, gather and record the list

Depends on Wave 1: Task 4 consumes the ordered provisioning/report contract and checks completed finish/brief receivers. It also owns the same deterministic test file as Task 1, so the two cannot share a wave.

### Task 4: Resolve a leading PR run and retain every member's contract

**TDD scenario:** Modifying tested code - write wording and input-sensitive record tests before replacing scalar instructions.

**Spec:** doc/specs/2026-10-26-gh-89-pr-list-rework-subject.md § "Acceptance criteria" L31-L32, § "Acceptance criteria" L33-L34, § "Acceptance criteria" L35-L36, § "Acceptance criteria" L37-L38, § "Acceptance criteria" L41-L42, § "Acceptance criteria" L43-L44, § "Acceptance criteria" L51-L52, § "Acceptance criteria" L56, § "Design" L62, § "Design" L64, § "Design" L66-L75, § "Design" L77, § "Design" L79, § "Design" L83, § "Design" L101, § "Design" L105, § "Design" L109-L132, § "Design" L134, § "Design" L136, § "Design" L162, § "Design" L166, § "Errors and edge cases" L174, § "Errors and edge cases" L177, § "Errors and edge cases" L180, § "Errors and edge cases" L181, § "Tests" L185, § "Tests" L187, § "Out of scope" L221, § "Out of scope" L222

**Files:**
- Modify: `skills/brainstorming/SKILL.md:3-19`
- Modify: `skills/brainstorming/SKILL.md:47`
- Modify: `skills/brainstorming/SKILL.md:167-175`
- Modify: `skills/brainstorming/reference/pr-subject.md`
- Modify: `skills/brainstorming/gatherer.md:129-151`
- Modify: `skills/brainstorming/gatherer.md:182-188`
- Modify: `skills/brainstorming/gatherer.md:222-228`
- Modify: `skills/brainstorming/reference/spec-finalization.md:19-26`
- Modify: `skills/brainstorming/reference/spec-finalization.md:60-64`
- Modify: `skills/brainstorming/reference/ticket-acceptance.md:49-61`
- Modify: `skills/brainstorming/reference/amendment-surface.md:72-84`
- Modify: `skills/brainstorming/reference/amendment-surface.md:159-173`
- Modify: `scripts/brainstorming-contract.test.mjs`
- Modify: `eval/brainstorming/samples/pr-subject-resolution/case.md`
- Modify: `eval/brainstorming/samples/pr-subject-resolution/expected.md`
- Create: `eval/brainstorming/samples/pr-list-admission-mixed-base/case.md`
- Create: `eval/brainstorming/samples/pr-list-admission-mixed-base/expected.md`
- Create: `eval/brainstorming/samples/pr-list-admission-issue-in-list/case.md`
- Create: `eval/brainstorming/samples/pr-list-admission-issue-in-list/expected.md`
- Create: `eval/brainstorming/samples/pr-list-relatedness-split/case.md`
- Create: `eval/brainstorming/samples/pr-list-relatedness-split/expected.md`
- Create: `eval/brainstorming/samples/pr-list-per-pr-attribution/case.md`
- Create: `eval/brainstorming/samples/pr-list-per-pr-attribution/expected.md`
- Create: `eval/brainstorming/samples/pr-list-record-missing-member/case.md`
- Create: `eval/brainstorming/samples/pr-list-record-missing-member/expected.md`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: 6f144da7 pass
- via: `skills/brainstorming/reference/pr-subject.md` leading-run grammar and record; `skills/brainstorming/reference/spec-finalization.md` input-sensitive inline lint; `ticket-acceptance.md` Tree-wide integrity; `amendment-surface.md` prefilter and ledger aftermath

L162 ownership here is limited to the gather/record producer paths for member-carried specs in `## Problem`; Task 3 retains consumer ownership of `## Process-state restore` and reconstruction. For L166, Task 3 owns the `gauntlet-resume/SKILL.md` continuation clarification and Task 1 owns recovery/helper commands; this task owns the brainstorming rules and compact sample.

Decision: no production parser module is required. These are model-read contracts: use `text.includes`/regex wording checks plus a test-local set-completeness fixture, not new runtime machinery. Preserve ordered `gh pr view` then `gh issue view`; an isolated issue keeps the ticket path. Regression clarifications belong to the existing Tree-wide row, design recap and amendment prefilter/aftermath; keep their other rules intact. The attribution sample's cap is 1400 words (`eval/brainstorming/target.json`), not a limit to raise.

- [ ] **Step 1: Run existing tests and add red checks.** Run Tests. Add assertions for caller description/checklist, leading grammar, admission stops, umbrella, both exception owners, per-PR scout blocks, record shape/completeness, finish closing rule/body-edit prerequisite/eligibility/comment lines, and plural brief producer/table. Replace the old scout assertion requiring `threads: not fetched (<reason>)` continuation with the fail-closed rule. Add assertions for missing-family enumeration provenance, approved presentation details in the recap, human review of a re-bounded row without a grant, and single-cut versus mixed-ledger commit subjects. Defer README assertion to Task 6. Run again; expect new wording assertions to fail.
- [ ] **Step 2: Implement leading-run grammar.** In `pr-subject.md`, accept whitespace/comma-separated leading `#N`, `owner/repo#N`, GitHub `/pull/N` and `/issues/N` URL forms. Preserve `#12 #13 #14`, `#12, #13 tighten the retry path` and `#12 fix the retry path, see #13 for context` examples. First non-ref starts intent; no later-ref lookup. Resolve and admit in listed order before any write; stop at first failing ref with observed reason.
- [ ] **Step 3: Implement admission and remedy.** Require `OPEN`, lowercase origin repository identity, no `isCrossRepository`, same `baseRefName` and unique resolved repository/number (URL/bare duplicates included). Copy `#13 is MERGED; only an open PR can be reworked.`, `#13 is an issue, not a pull request; a list admits only PRs. Drop #13 from the list, or brainstorm it alone as a ticket.`, `#13 targets release-2 but home #12 targets main; mixed bases are not admitted.`, and `#13 is listed twice; list each PR once.` Instantiate repository/fork templates from actual observations. Keep one paragraph with `To rework these together anyway, merge the heads into one branch by hand, open one PR, and brainstorm that PR.`; append it only for foreign-repository, fork and mixed-base failures.
- [ ] **Step 4: Add relatedness preflight.** With N>1 fetch title/body and `gh pr diff` per PR before provisioning; failed fetch names the ref/reason. Group by hunk behavior/contract/defect, not shared paths; do not call `shape-ticket/reference/split-axes.md`. Render multiple groups in questionary format with PRs/concerns, no all option and `Recommendation:` for the initial-home group. Retain selected listed order, promote its first PR to home, name dropped PRs and exclude them from merges/records/closure. Re-ask an unrecognized response once then stop. Keep this separate from question one, gather, `### 3` framing and post-worktree `### 2 Scope check`.
- [ ] **Step 5: Wire caller and ticket binding.** Change `brainstorming/SKILL.md` description to "one open PR or a leading list of related open PRs reworked on the home PR's branch" and checklist item 2 to resolve via `reference/pr-subject.md`, passing the ordered per-PR array home first to `/skill:using-git-worktrees`. Each value remains `{ number, url, title, headRefName, headRefOid, baseRefName, isCrossRepository, headRepository.nameWithOwner }`; N=1 is one element. Bind only home's title/body-first-line ticket and ACs. Name member bindings in `## Problem` as context without AC extraction. `/skill:brainstorming #12 #13 #14` feeds the `--no-ff` member loop; `/skill:brainstorming #12 fix the retry path, see #13 for context` stays one subject. Widen HARD CONSTRAINT to the exact base/member/helper/scoped-test exception, matching Task 1's `pr-head.md`.
- [ ] **Step 6: Gather combined code with attributed claims.** Require all retained PR titles/bodies/specs/threads before writing the spec; thread query failure stops before gather even for N=1. Supply scout combined post-member/post-base changed paths and worktree diff against BASE_SHA ending at HEAD, not home's original head. Keep `PRE_REWORK_HEAD` as home `Before:` provenance in `## Rework`. Supply per-PR title/body verbatim, own changed paths, carried specs and full threads; put member-carried spec paths under each member in `## Problem` for resume. Pass `Member merge:` and base outcomes. Render `## PR under rework` with one PR subsection per retained PR, home first, each `keeps:`, `changes:`, `dropped claims:` and thread dispositions. Render `constraints added since fork:` once for home, retaining fetched-base policy authority, scout-always and home-ticket-only context-builder behavior.
- [ ] **Step 7: Replace record grammar.** In `pr-subject.md`, write `## Rework record` with repeated `PR:` / `Pre-rework head:` / `Threads:` groups, then one `Base:`, `Keeps:`, `Changes:`, `Dropped claims:`, `Scoped tests:` set, then one lowercase provenance subsection per PR. Preserve 40-character heads, thread disposition grammar and unresolved base-merge handling. `Threads: none` stays legal; `Threads: not fetched (<reason>)` no longer continues gathering. No member merge-SHA field: `Absorbs:` derives from identities and SHAs remain in `git log`. N=1 still renders one group and subsection, with `Threads:` immediately after `Pre-rework head:`. Finish/handoff copy capitalized fields only, not lowercase provenance into `## Rework`; test the successful `gh pr edit` prerequisite at the finish owner.
- [ ] **Step 8: Add input-sensitive lint and fixtures.** Update `spec-finalization.md`'s fixed-line-grammar instruction and Ticket contract present lint: derive expected PRs from Step 4's home plus `MEMBER_HEADS`, require each identity/head/thread group and PR subsection, name each missing member. In `scripts/brainstorming-contract.test.mjs`, create a record with groups/subsections for #12/#13 against listed `{12, 13, 14}`; a test-local validator compares those sets and must name `#14`. A complete counterpart passes; a missing-subsection variant fails. Pair these tests with assertions that the shipped lint uses input membership, not record membership alone. Tests prove the wording and fixture rule, not model execution.
- [ ] **Step 9: Add five eval samples and extend one.** Cover mixed-base with umbrella; issue-in-list with direct correction only; same-file unrelated hunks splitting into named groups with retained-home promotion and later framing; #13's unique claim/thread in its own groups using combined HEAD input; and missing #14 rejection. Extend `pr-subject-resolution` with the trailing-context prompt and no-#13-lookup fact. Add N=1 thread-fetch stop, duplicate-form and rejected-group response observations to the appropriate cases. Use synthetic identities and relevant existing bundle subsets. In `pr-list-per-pr-attribution/case.md`, request compact output under the existing 1400-word cap, covering only the requested sections/commands without repeated narration. Preserve every fact in `expected.md`, including original-head reads of both carried specs, distinct five/three-attempt claims, RT13, ordered record groups, combined HEAD input and the N=1 fetch stop; do not loosen facts or raise the cap.
- [ ] **Step 9a: Clarify enumeration provenance.** In `brainstorming/reference/ticket-acceptance.md`'s Tree-wide row, require the human or Design to supply the missing complete family enumeration. Keep the stop for absent, partial or unrelated enumerations. Explicitly prevent question options and recommendations from inventing families or filling a partial list; preserve verbatim ticket-row handling and the existing cut question.
- [ ] **Step 9b: Preserve approved recap details.** In `brainstorming/SKILL.md`'s design-presentation owner, explicitly retain user-approved presentation details in the design recap along with the already-preserved design details. Change only that instruction, not the two-round gate or presentation format.
- [ ] **Step 9c: Clarify amendment review and ledger subjects.** In `brainstorming/reference/amendment-surface.md`, make human review of a re-bounded row explicit when there is no standing amend grant; preserve redraw classification for approved drafted-row text/add/remove changes. In the ledger aftermath use `loop: cut row N` instantiated with the row number only for a batch consisting of one cut, and `loop: amend` for a mixed batch, including one cut plus another amendment. Preserve attempts, iterations, reopening rules, audit body and the no-plan-writer ledger path. Do not change standing-grant semantics.
- [ ] **Step 10: Confirm green and style.** Run Tests, `node --check scripts/brainstorming-contract.test.mjs`, and `git diff --check`. Read edited instruction units and links against forge-skill; expect all non-README assertions green.
- [ ] **Step 11: Commit.** Stage task writes and run `git commit -m "Resolve and record related PR lists (ref #89)"`; name the behavior change and brainstorming samples in the body.

## Wave 3 - Behavioral evidence

Depends on Waves 1-2: all instructions and sample contracts must exist before assembly-bound intents and reports. A single task prevents concurrent model runs from rewriting shared target evidence.

### Task 5: Record current evidence for all four list-aware targets

**TDD scenario:** Modifying tested fixtures - validate structure, run focused replays, then full targets.

**Spec:** doc/specs/2026-10-26-gh-89-pr-list-rework-subject.md § "Acceptance criteria" L53-L54, § "Design" L166, § "Tests" L189-L199, § "Tests" L200-L203, § "Tests" L204-L207, § "Tests" L208, § "Tests" L209, § "Out of scope" L220, § "Out of scope" L225

**Files:**
- Modify: `eval/brainstorming/intent.md`
- Modify: `eval/using-git-worktrees/intent.md`
- Modify: `eval/finishing-a-development-branch/intent.md`
- Modify: `eval/gauntlet-resume/intent.md`
- Modify: `eval/brainstorming/report.md`
- Modify: `eval/using-git-worktrees/report.md`
- Modify: `eval/finishing-a-development-branch/report.md`
- Modify: `eval/gauntlet-resume/report.md`
- Modify: `eval/brainstorming/results/**/*.json`
- Modify: `eval/using-git-worktrees/results/**/*.json`
- Modify: `eval/finishing-a-development-branch/results/**/*.json`
- Modify: `eval/gauntlet-resume/results/**/*.json`
- Create: `eval/brainstorming/results/pr-list-admission-mixed-base/baseline.json`
- Create: `eval/brainstorming/results/pr-list-admission-mixed-base/candidate.json`
- Create: `eval/brainstorming/results/pr-list-admission-issue-in-list/baseline.json`
- Create: `eval/brainstorming/results/pr-list-admission-issue-in-list/candidate.json`
- Create: `eval/brainstorming/results/pr-list-relatedness-split/baseline.json`
- Create: `eval/brainstorming/results/pr-list-relatedness-split/candidate.json`
- Create: `eval/brainstorming/results/pr-list-per-pr-attribution/baseline.json`
- Create: `eval/brainstorming/results/pr-list-per-pr-attribution/candidate.json`
- Create: `eval/brainstorming/results/pr-list-record-missing-member/baseline.json`
- Create: `eval/brainstorming/results/pr-list-record-missing-member/candidate.json`
- Create: `eval/using-git-worktrees/results/pr-list-member-merge-order/baseline.json`
- Create: `eval/using-git-worktrees/results/pr-list-member-merge-order/candidate.json`
- Create: `eval/using-git-worktrees/results/pr-list-member-conflict-unresolved/baseline.json`
- Create: `eval/using-git-worktrees/results/pr-list-member-conflict-unresolved/candidate.json`
- Create: `eval/using-git-worktrees/results/pr-list-member-conflict-repaired/baseline.json`
- Create: `eval/using-git-worktrees/results/pr-list-member-conflict-repaired/candidate.json`
- Create: `eval/using-git-worktrees/results/pr-list-interrupted-recovery/baseline.json`
- Create: `eval/using-git-worktrees/results/pr-list-interrupted-recovery/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-push-and-close/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-push-and-close/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-push-rejected/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-push-rejected/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-body-edit-failed/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-body-edit-failed/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-member-advanced/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-member-advanced/candidate.json`
- Create: `eval/gauntlet-resume/results/pr-list-brief/baseline.json`
- Create: `eval/gauntlet-resume/results/pr-list-brief/candidate.json`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: 6f144da7 pass
- via: `lintTarget()` and the existing `eval/run.mjs` text-target assembly contract

Decision: keep existing target.json selections and use sample-local `bundle+` for already-existing owners, matching current PR samples. `for:` binds the bundle-free assembly SHA, not a commit; the runner's mismatch refusal prints the current value before model calls. No preparatory `--base` commit is needed. A text replay demonstrates instruction following on supplied observations, not live GitHub correctness. The prior eight-path restriction is not the ownership contract: all four `results/**/*.json` sets above are deliverables. The existing raw cache at `/var/folders/ww/xlm_qdzd2vn1k7gb4gs8kh8w0000gn/T/tmp.OCaWGNOqFB/tree` may supply cells only when the normal runner freshness checks accept them (`eval/lib/records.mjs:18-34`); never hand-edit hashes, outcomes or judgments to make a cell current.

L166 evidence covers `pr-head.md` recovery/helper commands (Task 1), `brainstorming/reference/ticket-acceptance.md` enumeration provenance and `brainstorming/reference/amendment-surface.md` human review with `loop: amend` versus `loop: cut row N` (Task 4), and `gauntlet-resume/SKILL.md` Entry mapping (Task 3). Return failed observations to those owners; this task writes evidence, not instructions or must-hold facts.

- [ ] **Step 1: Check deterministic structure.** Run Tests; expect 14 baseline tests or more after implementation. Run `node --input-type=module -e 'import {lintTarget} from "./eval/lib/lint.mjs"; const targets=["brainstorming","using-git-worktrees","finishing-a-development-branch","gauntlet-resume"]; const errors=targets.flatMap(t=>lintTarget("eval/"+t).map(e=>t+": "+e)); if(errors.length){console.error(errors.join("\n"));process.exitCode=1;}'`; expect no errors. Keep the valid existing `eval/lib/lint.test.mjs` command; do not substitute nonexistent suite paths.
- [ ] **Step 2: Update four intents.** In each `intent.md`, update Change and `## Expected to move` with every corresponding new sample/fact id, the `pr-subject-resolution` trailing-context fact and the intentional N=1 fetch-stop change. Get each `for:` SHA from the runner's pre-model mismatch refusal and write that value. Preserve meaningful unrelated intent entries; never widen intent to excuse an unexplained regression. Preserve existing must-hold outcomes for enumeration, recap details, amendment review/ledger subjects, recovery/helper commands and no-ledger resume; the clarifications restore those outcomes, not authorize new failures.
- [ ] **Step 2a: Admit reusable raw evidence.** Inspect the supplied cache's four target results and copy only saved baseline/candidate JSON into the declared corresponding results paths when absent or needed for reuse. Let the subsequent ordinary runner calls decide reuse from skill/input hashes, kind, assembly, replay-model membership, thinking and successful status, then judgment currency. Rerun stale/failed cells; keep failed observations and confirmation evidence in runner-written records. Copying a cache or a report alone is not verification, and the cache stays outside the shipped checkout.
- [ ] **Step 3: Replay brainstorming cases.** Run `node eval/run.mjs brainstorming pr-list-admission-mixed-base`, `node eval/run.mjs brainstorming pr-list-admission-issue-in-list`, `node eval/run.mjs brainstorming pr-list-relatedness-split`, `node eval/run.mjs brainstorming pr-list-per-pr-attribution`, `node eval/run.mjs brainstorming pr-list-record-missing-member`, and `node eval/run.mjs brainstorming pr-subject-resolution` separately. Check mandated `#13`, `release-2`, `main`, `gh pr diff`, `### PR #13`, `#14`, and `#12 fix the retry path, see #13 for context` facts, including combined `<BASE_SHA>...HEAD` input. Report failed cells rather than authoring evidence. The compact attribution reply must retain all facts under the unchanged word cap.
- [ ] **Step 4: Replay worktree cases.** Run `node eval/run.mjs using-git-worktrees pr-list-member-merge-order`, `node eval/run.mjs using-git-worktrees pr-list-member-conflict-unresolved`, `node eval/run.mjs using-git-worktrees pr-list-member-conflict-repaired`, and `node eval/run.mjs using-git-worktrees pr-list-interrupted-recovery`. Require `merge --no-ff`, `origin/main`, three `Pre-rework head:` lines, `merge --abort` and no base/spec on failure; `commit --no-edit` and `Member merge:` before base on repair; and `(already landed)` with stray-commit refusal on recovery.
- [ ] **Step 5: Replay finish and resume cases.** Run `node eval/run.mjs finishing-a-development-branch pr-list-push-and-close`, `node eval/run.mjs finishing-a-development-branch pr-list-push-rejected`, `node eval/run.mjs finishing-a-development-branch pr-list-body-edit-failed`, `node eval/run.mjs finishing-a-development-branch pr-list-member-advanced`, and `node eval/run.mjs gauntlet-resume pr-list-brief`. Require `Absorbs:`, per-member `#<N>:` threads, successful `gh pr edit` before the question, `1 - yes, close #13, #14`, exact `gh pr close` with no `--delete-branch`, `Closed: #13, #14`, and `Member PRs #13, #14 left open.` on failed paths. Require moved #14 exclusion and both `pr-list-brief-mismatch` and `pr-list-brief-order` stops.
- [ ] **Step 6: Generate full reports.** Run `node eval/run.mjs brainstorming`, `node eval/run.mjs using-git-worktrees`, `node eval/run.mjs finishing-a-development-branch`, and `node eval/run.mjs gauntlet-resume`, one target at a time. Require exit 0 and complete current reports without regressions, inconclusive cells or errors. Credentials/runner failures block evidence; never manufacture reports. Return instruction regressions to their owning task for repair before rerunning affected targets. Read each full report with its candidate JSON, retain failed observations in the raw evidence and preserve all must-hold facts. No partial report substitutes for a full target report.
- [ ] **Step 7: Review and commit evidence.** Run Tests and `git diff --check`; confirm reports cover every sample and records match current observations. Add no `close` verdict, disk-backed continuation, `/skill:gatekeep-pr`, pi-cohort, `extensions/`, `bin/`, `writing-plans` or `verification-before-completion` changes. Stage all four intents, full reports and owned raw baseline/candidate results in the checkout, not just the eight intent/report files, and run `git commit -m "Record PR-list behavioral eval evidence (ref #89)"`. Describe replay limitations and unrelated pre-existing notes in the body.

## Wave 4 - Public workflow documentation

Depends on Waves 1-3: Task 6 describes the implemented workflow and closes README coverage in the shared test file. Keep cross-cutting docs in this trailing wave.

### Task 6: Document list rework and preserve scoped supersession

**TDD scenario:** Modifying tested docs - assert new README wording before editing it.

**Spec:** doc/specs/2026-10-26-gh-89-pr-list-rework-subject.md § "Design" L170, § "Tests" L185, § "Documentation impact" L212, § "Documentation impact" L213, § "Documentation impact" L214

**Files:**
- Modify: `README.md:20-30`
- Modify: `CHANGELOG.md:7-9`
- Modify: `scripts/brainstorming-contract.test.mjs`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: 6f144da7 pass
- via: `README.md` What a run looks like and the predecessor supersession banner

Decision: the predecessor banner already satisfies the spec (`doc/specs/2026-10-23-gh-78-pr-as-brainstorm-subject.md:3`); assert and preserve without another write. Design explicitly requires an Unreleased note now; Documentation impact defers release, not the note. No version bump.

- [ ] **Step 1: Add red README coverage.** Run Tests first. Add wording assertions for the README exception/list/home sentence and finish close offer. Assert the existing banner points to this spec and scopes exactly to `"Subject resolution" single-reference grammar, single-head provisioning and single PR/Pre-rework head record shape, and the handoff "two lines" / brief-contract "exactly two lines" decision`. Run again; expect README assertions to fail.
- [ ] **Step 2: Amend the overview.** In What a run looks like step 1, use "permits only the base merge, each admitted member-head merge, their conflict resolution, and scoped conflict tests". Add one sentence explaining a leading open-PR list on one base is one subject, first is home, others merge in and are offered for closure at finish. Add one sentence to step 5 describing the exact-target/text confirmation after home push and description update.
- [ ] **Step 3: Add the release note and preserve scope.** Add `## Unreleased` with one #89 entry to CHANGELOG. Preserve the existing predecessor banner and its live `/skill:gatekeep-pr` exclusion. Introduce no feature doc and leave AGENTS.md routing unchanged.
- [ ] **Step 4: Confirm green and style.** Run Tests, `node --check scripts/brainstorming-contract.test.mjs`, and `git diff --check`. Check Tests L185 obligations now covered by `text.includes`/regex: `pr-subject.md`, `brainstorming/SKILL.md`, `pr-head.md`, README, `### PR #<N>` placement, recovery, finish closing/body/eligibility/comments and plural brief producer/table. Expect green.
- [ ] **Step 5: Commit.** Stage task writes and run `git commit -m "Document related PR-list rework (ref #89)"`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L31-L32 | AC1: ordered merges on home with all original heads retained | Task 1, Task 4 |
| § "Acceptance criteria" L33-L34 | AC2: every ref admitted before provisioning; first failure stops | Task 1, Task 4 |
| § "Acceptance criteria" L35-L36 | AC3: trailing prose is intent, not another lookup | Task 4 |
| § "Acceptance criteria" L37-L38 | AC4: both write-exception owners and wording tests | Task 1, Task 4 |
| § "Acceptance criteria" L39-L40 | AC5: fresh conflict helper, abort and stop on unresolved member | Task 1 |
| § "Acceptance criteria" L41-L42 | AC6: pre-provision concern selection excludes dropped PRs | Task 4 |
| § "Acceptance criteria" L43-L44 | AC7: complete per-PR claims/threads and missing-group lint | Task 4 |
| § "Acceptance criteria" L45-L46 | AC8: all-head proof, non-force push, body append, gated close | Task 2 |
| § "Acceptance criteria" L47-L48 | AC9: only row 1's successful post-push close exception | Task 2 |
| § "Acceptance criteria" L49-L50 | AC10: ordered brief pairs and home branch check | Task 3 |
| § "Acceptance criteria" L51-L52 | AC11: umbrella recipe for rejected sets | Task 4 |
| § "Acceptance criteria" L53-L54 | AC12: all four targets' evaluated samples and committed reports; final CI | Task 5 |
| § "Acceptance criteria" L56 | Reading clauses: row 1, preflight scope, N=1 fetch stop and successful edit | Task 4 |
| § "Design" L62 | Leading-run forms, separators, first non-ref and examples | Task 4 |
| § "Design" L64 | Caller description and ordered-array checklist | Task 4 |
| § "Design" L66-L75 | Ordered classification and six admission checks/stops | Task 4 |
| § "Design" L77 | Exact umbrella trailer only on applicable stops | Task 4 |
| § "Design" L79 | Home-only ticket ACs, member context and existing value shape | Task 4 |
| § "Design" L83 | Actual-diff relatedness, retained order, one re-ask and later framing | Task 4 |
| § "Design" L87 | Home checkout plus all-member reachability/race stops | Task 1 |
| § "Design" L89 | Validate first-parent merge history; skip landed members without reset | Task 1 |
| § "Design" L91-L95 | Merge remaining heads in order using the prescribed subject | Task 1 |
| § "Design" L97 | Scoped helper/completion checks, abort and recoverable member stop | Task 1 |
| § "Design" L99 | Base after members; ordered reports and member value handoff | Task 1 |
| § "Design" L101 | Both pre-approval exceptions name admitted member merges | Task 1, Task 4 |
| § "Design" L105 | Per-PR fail-closed fetch and combined code input with attributed provenance | Task 4 |
| § "Design" L109-L132 | Repeated identity/head/thread groups, combined fields and subsections | Task 4 |
| § "Design" L134 | N=1 uniform record; top-level versus lowercase field consumers | Task 2, Task 4 |
| § "Design" L136 | Input-sensitive completeness and member Problem context | Task 4 |
| § "Design" L140 | First pair selects home; all pairs proved and locally referenced | Task 2 |
| § "Design" L142 | Separate home task-evidence resolution from member dispositions | Task 2 |
| § "Design" L144 | Absorbs and per-PR threads; successful body edit before closing | Task 2 |
| § "Design" L146 | Current-state/head eligibility against pushed home | Task 2 |
| § "Design" L148-L154 | One instantiated close question and exact target comments | Task 2 |
| § "Design" L156 | Fresh authorization, no retry/delete, per-member outcomes and N=1 | Task 2 |
| § "Design" L160 | Canonical plural brief grammar and producer copy order | Task 3 |
| § "Design" L162 | Home-only branch lookup, ordered identity check and member-spec exclusion (Task 3 consumer); gather/record member-carried spec paths in Problem (Task 4 producer only) | Task 3, Task 4 |
| § "Design" L166 | Preserve existing outcomes across four full eval targets without new components or acceptance rows | Task 1, Task 3, Task 4, Task 5 |
| § "Design" L166 | Spell out no-worktree recovery on the validated branch; target helper/completion commands at selected worktree | Task 1 |
| § "Design" L166 | Obtain missing complete family enumeration from human or Design; never invent it in options or recommendations | Task 4 |
| § "Design" L166 | Preserve user-approved presentation details in design recap | Task 4 |
| § "Design" L166 | Human review for re-bounded row without grant; mixed ledger batch uses loop amendment subject, single cut uses row subject | Task 4 |
| § "Design" L166 | Keep no-ledger Entry steps 1-5 mapping explicit in resume call table | Task 3 |
| § "Design" L166 | Compact attribution sample stays under existing cap without dropping any fact | Task 4, Task 5 |
| § "Design" L166 | Preserve all must-hold facts, record failed observations and use existing eval-library tests | Task 5 |
| § "Design" L170 | README steps, scoped predecessor banner and Unreleased note | Task 6 |
| § "Errors and edge cases" L174 | No writes on preflight failure and appropriate remedy | Task 4 |
| § "Errors and edge cases" L175 | Repaired/unresolved conflicts and interrupted-run recovery | Task 1 |
| § "Errors and edge cases" L176 | Reject unrelated local commits without resets | Task 1 |
| § "Errors and edge cases" L177 | Any admitted PR thread failure stops before gather | Task 1, Task 4 |
| § "Errors and edge cases" L178 | Finish failures and eligibility races have per-member outcomes | Task 2 |
| § "Errors and edge cases" L179 | Resume stops with both names/orders | Task 3 |
| § "Errors and edge cases" L180 | N=1 migration, fetch failure and unchanged finish/brief output | Task 2, Task 3, Task 4 |
| § "Errors and edge cases" L181 | URL and bare references deduplicate by resolved identity | Task 4 |
| § "Tests" L185 | Specified wording checks, including README and receiver contracts | Task 4, Task 6 |
| § "Tests" L187 | Missing #14 fixture fails; complete record passes | Task 4 |
| § "Tests" L189-L199 | Evaluate five brainstorming cases plus extended single-ref observation | Task 5 |
| § "Tests" L200-L203 | Evaluate four provisioning cases: order, conflicts, recovery | Task 5 |
| § "Tests" L204-L207 | Evaluate four finish cases: push, edit and advancement failures | Task 5 |
| § "Tests" L208 | Evaluate list brief including branch/order mismatch variants | Task 5 |
| § "Tests" L209 | Current intents and complete committed eval reports | Task 5 |
| § "Documentation impact" L212 | No new feature documentation | Task 6 |
| § "Documentation impact" L213 | Amend README procedure; defer release | Task 6 |
| § "Documentation impact" L214 | Preserve scoped supersession; no AGENTS routing edit | Task 6 |
| § "Out of scope" L220 | No landing-order feature, close verdict or disk continuation | Task 5 |
| § "Out of scope" L221 | Fork-hosted and mixed-base members remain rejected | Task 4 |
| § "Out of scope" L222 | No AC rows from member tickets | Task 4 |
| § "Out of scope" L223 | No early closure, retry, branch deletion or implicit new merge | Task 2 |
| § "Out of scope" L224 | No reset/rebase recovery | Task 1 |
| § "Out of scope" L225 | Leave gatekeep, cohort, runtime, bins, planning and verification untouched | Task 5 |
