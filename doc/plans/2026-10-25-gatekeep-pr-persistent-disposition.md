# Gatekeep-pr one course per run Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace repeated repair picks with one assess or deliver course, bounded repair and sync budgets, and fresh terminal decisions.

**Architecture:** Keep the portable continuation record, fresh helpers, scoped-test wave, and evidence reconciliation. Replace retained grants with a course-driven exit-check loop; separate menu templates from verb availability and keep terminal writes outside delivery authority. Raise the shared default without changing the verify-phase guard's counting mechanism.

**Tech Stack:** Markdown skill protocols, Node node:test, TypeScript settings resolver, esbuild bundles, existing text replay evaluator.

**Spec:** `doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md`

**Verification:** `npm test` && `node eval/run.mjs gatekeep-pr --base "$(git log --diff-filter=A --format=%H -- skills/gatekeep-pr/reference/menus.md)"` && `node eval/run.mjs gatekeep-pr-scope --base "$(git log --diff-filter=A --format=%H -- skills/gatekeep-pr/reference/menus.md)"` && `node eval/run.mjs gatekeep-pr-merge-state --base "$(git log --diff-filter=A --format=%H -- skills/gatekeep-pr/reference/menus.md)"` - includes pi.settings-ban enforcement.

---

## Recon and execution constraints

- Worktree: `/Users/jacek/repos/pi-gauntlet/.worktrees/gatekeep-persistent-disposition`. Run every task command there. No overrides Happy path table or deployment topology exists; use one plan with no deployment split.
- `package.json:30-35` and `scripts/ci.mjs:405-465` own verification. The header's first command bundles structural instruction lint, model-literal lint, size lint, eval structural/hygiene checks, bundle freshness, tests and packed-install smoke. There is no configured formatter, standalone scoped lint CLI, or separate repository format command. Match neighboring formatting; use the scoped syntax checks below, not an invented formatter.
- Read `skills/forge-skill/SKILL.md` `## Authoring rules` for every instruction edit. Preserve persona frontmatter byte-for-byte (`doc/personas.md` frontmatter knobs). Every edited `skills/gatekeep-pr/` Markdown file must stay below 500 lines and 50,000 bytes, stricter than repository-wide size lint.
- `eval/lib/replay.mjs:35-46,73-79` assembles candidate-listed files from both trees; `eval/run.mjs:171-190` refuses a missing baseline file. Task 2 first extracts the old menus without changing behavior. The header selects the commit that introduced `menus.md`, so the baseline contains that file and still represents the old grant semantics. Keep that extraction committed before Task 3; do not squash it with the behavior rewrite before model verification. The path is new and has exactly one addition commit in this branch.
- Task steps describing runtime git, forge, or helper operations are instructions to author in skills, not permission to run a live PR gate while implementing this plan. Only task-local tests, lint, build, and commits run during implementation. Full model targets run at verification; the evaluator owns its generated records and reports.

## Files

### Settings and generated distribution

**Modify:**
- `extensions/lib/gauntlet-settings.ts`
- `extensions/lib/gauntlet-settings.test.ts`
- `extensions/phase-tracker.test.ts`
- `bin/gauntlet-telemetry-seal.mjs`
- `bin/gauntlet-performance.mjs`
- `bin/gauntlet-spec-index.mjs`

Rebuild all three bundles; retain only actual generated differences. Do not edit `extensions/phase-tracker.ts`.

### Single-PR and batch protocols

**Create:**
- `skills/gatekeep-pr/reference/menus.md`

**Modify:**
- `skills/gatekeep-pr/SKILL.md`
- `skills/gatekeep-pr/verification-brief.md`
- `skills/gatekeep-pr/reference/assessment.md`
- `skills/gatekeep-pr/reference/decision-menu.md`
- `skills/gatekeep-pr/reference/post-selection-loop.md`
- `skills/gatekeep-pr/reference/fix-wave.md`
- `skills/gatekeep-pr/reference/findings.md`
- `skills/gatekeep-pr/reference/report.md`
- `skills/gatekeep-pr/reference/sync.md` (only stale menu/caller references, not entry-sync mechanics)
- `skills/gatekeep-pr/reference/cleanup.md`
- `skills/gatekeep-pr/reference/batch.md`
- `agents/pr-gatekeeper.md`
- `scripts/gatekeep-comment-reconcile.test.mjs`

### Replay evidence

**Create:** each following directory gets exactly `case.md` and `expected.md`:
- `eval/gatekeep-pr/samples/course-deliver-no-mid-menu/`
- `eval/gatekeep-pr/samples/course-deliver-nits/`
- `eval/gatekeep-pr/samples/course-ready-at-first-report/`
- `eval/gatekeep-pr/samples/course-assess-terminal/`
- `eval/gatekeep-pr/samples/course-cap-exhausted/`
- `eval/gatekeep-pr/samples/course-obstacle-unknown/`
- `eval/gatekeep-pr/samples/course-stop-cleanup/`
- `eval/gatekeep-pr/samples/menu-rows-omitted/`

**Modify:**
- `eval/gatekeep-pr/target.json`, `eval/gatekeep-pr/intent.md`, `eval/gatekeep-pr/report.md`
- `eval/gatekeep-pr-scope/target.json`, `eval/gatekeep-pr-scope/intent.md`, `eval/gatekeep-pr-scope/report.md`
- `eval/gatekeep-pr-merge-state/target.json`, `eval/gatekeep-pr-merge-state/intent.md`
- Existing `case.md` and `expected.md` files beneath these three targets' `samples/` directories, only for changed course/menu assumptions.
- Existing `results/*/baseline.json` and `results/*/candidate.json` under the three targets, generated by their full runs.

**Create:** `eval/gatekeep-pr-merge-state/report.md` and evaluator-generated `baseline.json` and `candidate.json` in the eight new `eval/gatekeep-pr/results/` sample directories. Missing records for existing samples are also evaluator output, never hand-authored evidence.

### Cross-cutting documentation

**Modify:**
- `README.md`
- `doc/configuration.md`
- `CHANGELOG.md`
- `skills/verification-before-completion/reference/settings-precedence.md`
- `skills/verification-before-completion/reference/conformance-check.md`

**Delete:** none. Rewrite legacy replay samples in place rather than losing their independent safety assertions.

## Baseline provenance

Amendment provenance: `40d6c9e4`; initial `git status --porcelain --untracked-files=all` returned only ` M doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md`. Admitted paths are `doc/plans/2026-10-25-gatekeep-pr-persistent-disposition.md` and `doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md`; the parent-supplied In-flight path is that same spec. All five task commands were rerun because the prior evidence was on `08b6d35f`. Task 1 executed 194 tests; Tasks 2, 3 and 4 each executed 46 tests; Task 5 executed 60 tests, all exit 0 with zero failures. After every command HEAD remained `40d6c9e4` and the sole status entry remained the modified spec. No source edits or generated artifacts were admitted.

## Wave 1 - Independent defaults and menu extraction

Tasks 1 and 2 own disjoint files. Their node:test suites use isolated scratch directories, no live PRs, shared service, port, or fixed mutable fixture. Commit Task 2's extraction before the next wave; that committed tree is the model replay baseline.

### Task 1: Raise the shared repair default to five

**TDD scenario:** Modifying tested code - run existing tests first.

**Spec:** doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md § "D0 Authoring constraints" L35, § "Tests" L223, § "Out of scope" L243

**Files:**
- Modify: `extensions/lib/gauntlet-settings.ts:80-94`
- Modify: `extensions/lib/gauntlet-settings.test.ts:167-174`
- Modify: `extensions/phase-tracker.test.ts:1552-1561`
- Modify: `extensions/phase-tracker.test.ts:1732-1745`
- Modify: `bin/gauntlet-telemetry-seal.mjs`
- Modify: `bin/gauntlet-performance.mjs`
- Modify: `bin/gauntlet-spec-index.mjs`
- Test: `extensions/lib/gauntlet-settings.test.ts`
- Test: `extensions/phase-tracker.test.ts`

**Tests:**
- `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/lib/gauntlet-settings.test.ts extensions/phase-tracker.test.ts`
- baseline: 40d6c9e4 pass
- via: `resolveClosureReview()` and the phase-tracker fix-round guard

- [ ] **Step 1: Run the existing scoped command.** Expect all resolver and phase-tracker tests green before changing assertions.
- [ ] **Step 2: Update the normalization table and guard boundary.** In `extensions/lib/gauntlet-settings.test.ts:167-172`, assert missing and `1.5` normalize to `5`, explicit `0` stays zero, `-3` clamps to `0`, and explicit `maxFixRounds: 3` stays three. In `extensions/phase-tracker.test.ts:1552-1561`, dispatch five waves successfully and assert the sixth reports `cap of 5`. In the grant-credit test `grant: funds extra waves and rejects another grant while credits remain` at `extensions/phase-tracker.test.ts:1732`, set its harness to `guardedHarness({ piGauntlet: { closureReview: { enforce: true, maxFixRounds: 3 } } })`. Keep its three-round exhaustion, two extra credits, rejection while credits remain, and final `cap of 3` assertions unchanged. Preserve the separate explicit three-round harness at `:1778` unchanged.

  Decision: pin the grant-credit fixture to three rather than increasing its exhaustion count - `extensions/phase-tracker.test.ts:1732-1745` tests credit behavior at an exhausted configured cap, while `:1552-1561` owns the shared-default boundary. The amended spec's Tests clause requires this separation.
- [ ] **Step 3: Run the scoped command and observe red.** The old resolver still supplies three; only the changed default/boundary assertions fail.
- [ ] **Step 4: Change the resolver fallback.** Keep the existing expression and change only the final default to five:

  ```ts
  const maxFixRounds = typeof raw === "number" && Number.isInteger(raw) ? (raw < 0 ? 0 : raw) : 5;
  ```

  Decision: keep the verify-phase runtime guard at `1 x maxFixRounds` - `extensions/phase-tracker.ts` consumes this resolver and counts successful implementer dispatches; no multiplier or guard bypass belongs in that file. `closureReview.maxFixRounds` is the existing shared setting, not a new gatekeep setting.
- [ ] **Step 5: Re-run scoped tests.** Expect five default waves allowed, sixth blocked, and explicit override tests green. The grant-credit fixture must still exhaust its explicit three rounds, allow exactly two granted waves, and block the next wave without depending on the new default.
- [ ] **Step 6: Regenerate bundles and check style.** Run: `npm run build:bins`. Run: `node --check extensions/lib/gauntlet-settings.ts`. Match existing TypeScript style; no formatter is configured. Review generated differences only; no hand-edits to `bin/`.
- [ ] **Step 7: Commit.** Stage the three source/test files and actual regenerated bundle differences. Commit subject: `Raise the shared repair default to five`.

### Task 2: Extract the existing menus before changing behavior

**TDD scenario:** Modifying tested instructions - run existing tests first; behavior-preserving extraction.

**Spec:** doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md § "D0 Authoring constraints" L33-L34, § "D5 Menus" L119

**Files:**
- Create: `skills/gatekeep-pr/reference/menus.md`
- Modify: `skills/gatekeep-pr/SKILL.md:26-36`
- Modify: `skills/gatekeep-pr/reference/decision-menu.md`
- Modify: `scripts/gatekeep-comment-reconcile.test.mjs`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`

**Tests:**
- `node --test scripts/gatekeep-comment-reconcile.test.mjs`
- baseline: 40d6c9e4 pass
- via: `SKILL.md` step 6 and the menu source-contract assertions

- [ ] **Step 1: Run the scoped assertions.** Expect the current consent menus to pass.
- [ ] **Step 2: Introduce an extraction assertion.** Read `menus.md` separately; require the moved `## Consent table`, `## Overlays`, and fixtures there while retaining `## Availability` and `## Withhold reason resolver` in `decision-menu.md`. Keep assertions of existing behavior over an assembled view of the two files until Task 3 changes their meaning. Run the scoped command; the missing menu file or new location assertion fails.
- [ ] **Step 3: Move, do not rewrite.** Extract those existing sections into `skills/gatekeep-pr/reference/menus.md` and replace them with read-now pointers at their original headings. Update `SKILL.md` step 6 to read both files. Leave `merge base`, `update branch`, `wait`, `show evidence`, `stop`, `merge queued`, and `[recommended]` semantics unchanged in this intermediate commit. Task 3 installs the final ten templates and hint-only evidence. This creates a usable old-behavior tree for both replay arms without modifying the evaluator.
- [ ] **Step 4: Re-run the source assertions.** Expect the same behavioral assertions green with their new location. Preserve fresh-helper and evidence safety assertions; do not delete tests merely to accommodate a move.
- [ ] **Step 5: Read back and measure.** Read the changes against forge-skill `## Authoring rules`. Run: `wc -l skills/gatekeep-pr/SKILL.md skills/gatekeep-pr/reference/decision-menu.md skills/gatekeep-pr/reference/menus.md`. Run: `wc -c skills/gatekeep-pr/SKILL.md skills/gatekeep-pr/reference/decision-menu.md skills/gatekeep-pr/reference/menus.md`. Require each below 500 lines and 50,000 bytes. Keep `post-selection-loop.md` under the same limits when its body changes in Task 3; this applies to all `skills/gatekeep-pr/` edits.
- [ ] **Step 6: Commit the extraction separately.** Stage only this task's files and commit with subject `Extract gatekeep menu baseline`. Body records behavior-preserving extraction, forge-skill Authoring rules read-back and measured sizes. Preserve this addition commit in branch history until full model verification completes. Its addition of `menus.md` is the header's baseline selector.

## Wave 2 - Course state machine

Depends on Wave 1: Task 3 replaces the extracted old menus and uses the shared five-round default. It owns the single-PR protocol as one task because menu authority, exit ordering, and accounting share the same record and source assertions.

### Task 3: Replace retained grants with the course-driven delivery loop

**TDD scenario:** Modifying tested instructions - change source-contract assertions before the owning instructions.

**Spec:** doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md § "D0 Authoring constraints" L33-L34, § "D0 Authoring constraints" L35, § "D0 Authoring constraints" L33-L36, § "D1 Course" L40-L44, § "D2 assess" L48, § "D3 deliver" L52-L58, § "Exit check" L62-L92, § "Loop sync" L96-L105, § "D4 Round accounting" L109-L115, § "D5 Menus" L119-L138, § "D5 Menus" L143-L151, § "D5 Menus" L154, § "D5 Menus" L156, § "D5 Menus" L158, § "D6 Drift guard" L162-L177, § "Errors and edge cases" L203-L213, § "Errors and edge cases" L215-L218, § "Tests" L222, § "Out of scope" L238-L243

**Files:**
- Modify: `skills/gatekeep-pr/SKILL.md`
- Modify: `skills/gatekeep-pr/verification-brief.md`
- Modify: `skills/gatekeep-pr/reference/assessment.md:71`
- Create: `skills/gatekeep-pr/reference/menus.md`
- Modify: `skills/gatekeep-pr/reference/decision-menu.md`
- Modify: `skills/gatekeep-pr/reference/post-selection-loop.md`
- Modify: `skills/gatekeep-pr/reference/fix-wave.md`
- Modify: `skills/gatekeep-pr/reference/findings.md`
- Modify: `skills/gatekeep-pr/reference/report.md`
- Modify: `skills/gatekeep-pr/reference/sync.md`
- Modify: `scripts/gatekeep-comment-reconcile.test.mjs`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`

**Tests:**
- `node --test scripts/gatekeep-comment-reconcile.test.mjs`
- baseline: 40d6c9e4 pass
- via: `### Continuation record`, `### Next action`, `### Pre-menu refresh`, `### Wait course`, `fix-wave.md` `## Wave`, `## Sync`, `assessment.md` `## Select the scope contract`, and the ten `menus.md` templates

The `Create:` path is introduced by Task 2; replace its contents in place here, preserving the earlier addition commit for replay baseline selection.

- [ ] **Step 1: Run the current scoped assertions.** Expect green after Task 2's extraction. Read the complete touched procedures before editing; source-contract tests at lines 144-320, 372-441 and 467-564 currently enforce the old grant and watch semantics.
- [ ] **Step 2: Replace obsolete assertions with the new state contract.** Assert `course: assess | deliver | deliver-nits`, both budgets, own-push-only window renewal, and exit checks before each iteration and after state changes. Assert exactly ten level-two template headings: initial, final, assess terminal, obstacle, contract exception, own merge, merge queued, approved, closed PR, batch summary. Assert `decision-menu.md` defines none of `wait`, `merge base`, `update branch`, `show evidence` as row verbs; keep queued `wait` in its template. Replace the old `/else 3; a cap of ` assertion at line 475 with `2 x 5`. Add negative assertions for all superseded D6 red flags. Keep target freshness, comment delta deduplication, claim-only rechecks, scoped testing, and no orchestrator tracked edits as positive guards. Extend the existing `assessment` read and scope assertions (`scripts/gatekeep-comment-reconcile.test.mjs:31,149-161,336-342`) to reject `consent.scope_at_grant` in both the brief and assessment while requiring `original_intent` preservation in `scope` after body edits. Add guards for the loop sync's separate `pre_head` and `expected_remote_head`, fresh remote comparisons before sync/push, immutable remote expectation through repair/rebase, and lease-versus-rollback consumers in `## Evidence after push`, `### Compare-and-swap`, and `### Pre-menu refresh`. Pin the remote A -> local repair B -> rebase C example: lease A, restore B; a remote mismatch cannot replace A. Keep the entry-time `sync.md` lease on its own `pre_head`. Assert final `fix nits` records selected work before the entry exit check, blocks readiness with `course` unset or `deliver`, executes one complete iteration, then releases that one-shot hold without changing course. Run the scoped command; new schema/template/accounting, scope-consumer, lease and terminal-nit assertions fail.
- [ ] **Step 3: Replace record authority at its boundary.** In `verification-brief.md` remove `consent.fix`, `consent.merge_base`, `consent.scope_at_grant` and the `revoke` grammar. Add nullable `course`, `repair.rounds_cap`, `repair.syncs_used`, and `repair.syncs_cap`; retain `repair.rounds_used`, `repair.poll_deadline`, and `repair.wave`. Extend that existing wave checkpoint with nullable `sync: { pre_head, expected_remote_head }` for a loop rewrite and optional `action: fix-nits` for a terminal one-shot nit iteration; `selected_ids` remains the nit payload snapshot. In `### Continuation record`, mint one record before tracking, set a course only from the initial numeric pick, and persist before course-authorized writes. Missing/malformed/mismatched state returns `stuck - run record unreadable` without resetting `repair.*`. No new session discovers or resumes a course.

  Decision: retain `consent.target` solely as immutable PR/base identity, not authority - D1 explicitly removes three grant fields, while `verification-brief.md:70-90` and current live-base comparison need the target. Keep the selected `scope` block and its `original_intent` as the course's contract baseline instead of introducing a second scope store. In the direct consumer `assessment.md` `## Select the scope contract`, remove the instruction to retain intent in `consent.scope_at_grant`; retain original `{ title, body }` only as `scope.original_intent`, and keep judging/rendering it after description edits. Refresh fetched body/digest values without overwriting that baseline; `### Contract decision` alone replaces it after the owning amendment succeeds.

  Decision: store loop recovery/lease values and the one-shot marker within `repair.wave`, not a sibling authority record - the brief already persists `pre_wave_head`, `selected_ids`, and apply/review/push checkpoints, and D3/D5 require restoration of these operations. Absence of `repair.wave.sync` leaves the distinct entry-sync record's semantics unchanged; a malformed loop checkpoint must fail closed rather than substitute local HEAD for its remote expectation.
- [ ] **Step 4: Implement course selection and assess.** First report ready goes straight to final with course unset. Otherwise initial rows offer `assess`, `deliver`, and `deliver with nits` when eligible. Use `viewer.is_author` (`viewer.login == pr.author.login`) and `author_is_bot`, not old consent-table labels. Assess uses the existing `review` payload from `findings.md` `## Namespaces`: open `Blockers` plus locators, one `gh` review with `--request-changes` for someone else, `--comment` on the human's own PR; zero blockers posts nothing. Keep drafted `C#` thread replies behind `reply`. Assess performs no repair or sync and permits `approve` only with zero blockers on someone else's non-draft PR. A bot-authored head always takes someone-else defaults and never a rewrite.
- [ ] **Step 5: Write the fixed body in `### Next action`.** With course set and no exit, run only the D3 body: repair all source-backed and CI-minted `P#` blockers; add every current and later nit for `deliver-nits`; sync only on `mergeable` `CONFLICTING`, `merge_state_status` `BEHIND`, or local `merge-tree` conflict, through `### Loop sync`; pre-push review and one push through `## Evidence after push`; bounded CI watch; own-push `### Re-render`; return to `### Exit check`. Preserve independent `P#`/`L#` contributor IDs and close only reviewer `resolved` lines. Critical/Moderate carried findings re-enter repair without a menu or push; at exhaustion retain unpushed commits and name the reviewer's top finding. `### Pre-menu refresh` refreshes evidence, never starts an independent watch. Keep the merge preconditions and exact-head comment/claim reconciliation; no whole-diff review or full suite merely for a comment delta.
- [ ] **Step 6: Implement exits and obstacles as an ordered table.** Evaluate readiness first, obstacles second, cap third before iteration and after every head/digest/record change. Readiness requires `### Merge preconditions`; `deliver-nits` additionally requires every opted-in and subsequently minted nit resolved. A terminal `fix nits` selection with outstanding work also withholds readiness for that iteration, independent of course: consume its recorded payloads and complete the required repair/sync/review/push/watch/re-review before reevaluating readiness, as Step 10 specifies. Obstacles, caps and unsafe-state stops still apply. Keep `merge` omitted with `Not offered: merge (draft)` on a draft and with the needs-WRITE reason below `WRITE`; permission does not turn a repairable source gap into readiness. Implement each following row, with no open-ended retry:

  | Observed state | Instruction to author |
  |---|---|
  | Same check red twice | Compare the intervening pushed repair-wave commit, not any SHA move; absent source repair, exit `stuck - test red twice without a source change` for a check named test and offer the exact disposition hint. |
  | No failed log and no source lead | After missing `--log-failed` evidence, request one run re-run inside the wave; the repeated-red rule owns its result. |
  | Helper cannot repair | `open - needs` returns the concrete needs obstacle; `open - contract exception` enters the contract template instead of an obstacle. |
  | No-progress result | HEAD equals `pre_wave_head` with all payloads `open`, or scoped test unchanged-red after restore: append `### No-progress obstacle` evidence and exit without spending a round. Extension alone never clears that checkpoint. |
  | Undispositionable `mergeStateStatus` `BLOCKED` | Render `GitHub reports BLOCKED, no local repair applies`, with no invented rule attribution. |
  | `UNKNOWN` or `unreadable`, green CI, no other withhold | One re-poll, then `stuck - merge state unknown`; spend neither budget. |
  | Refresh/refetch failure | One retry for nonzero `gh` or incomplete pagination, then a refresh-failed obstacle with the actual reason. |
  | Incomplete comment source review | One fresh reviewer retry, then `stuck - comment source review incomplete`. |
  | Deadline exhausted with binding checks | Exit with the elapsed `timeout minutes`; an obstacle deliver pick opens one additional window only. |
  | `action_required` | Under own-author and `viewer_permission` at least `WRITE`, run `approve workflow run` then watch under the course. Otherwise `stuck - workflow run awaiting approval` with that row available under its existing permission check. |
  | Lost `head_pushable` | Exit, keep local commits, and name the destination and branch. |
  | Refused lease or moved remote under local rewrite | Compare against this loop sync's recorded `expected_remote_head`; reset to its separate local `pre_head`, assert exact HEAD and tracked-clean state, then `stuck - remote head moved`. Never overwrite the expected remote SHA on mismatch. |
  | Sync failure | Restore and assert before the sync-failed obstacle; failed assertion is a hard stop. |
  | Disallowed merge method | At readiness resolve the existing repository merge-policy flags and name the disabled policy. |
  | PR `state` no longer open | Render closed PR, not another iteration. |
  | Runtime guard refused dispatch | Surface `stuck - phase-tracker fix-round guard: <its reason>` verbatim; never bypass the guard. |

  Include every actual unmet `### Merge preconditions` reason in the resolver rather than an implicit spin: credentials or unresolved fallback evidence, dirty/residual helper output, unreadable target, unreviewed comment delta, and failed push all end at their concrete missing-evidence/input or unsafe-state obstacle. Retain failed prerequisites and append history; a repeated obstacle `deliver` must re-exit until the actual input changes. `flaky` under `findings.md` `## Dispositions`, followed by a numeric deliver selection, can resume; no helper can disposition a check. Document the no-cross-session rule through README `## Architecture` in Task 6.
- [ ] **Step 7: Replace `fix-wave.md` `## Conflicts` with `## Sync`.** Keep `sync.md` as the separate once-per-invocation `--rebase [base]` procedure. Loop triggers are only the freshness/conflict failures. Read `sync.md` `## Permitted orchestrator git writes`, `## Conflict stop`, `## Review before push`; use those proven operations and helper continue checks. For each loop rewrite, persist `repair.wave.sync.pre_head` from `git rev-parse HEAD` as the fresh local recovery SHA after repair, and separately persist `repair.wave.sync.expected_remote_head` from the assessed/pushed remote SHA. Verify that remote expectation with a fresh remote-head read before sync and again before push; preserve it through local repair/rebase and reject a mismatch without replacing it. Own non-bot branch with no merge commits uses rebase and `GIT_EDITOR=true rebase --continue`, `rebase --abort`, and a lease on every rewritten-head push. Use the complete loop push form `git push --no-follow-tags --force-with-lease=<head_ref>:<expected_remote_head> <head_url> HEAD:refs/heads/<head_ref>`. For remote A, local repair B, rebase C, `pre_head` is B and `expected_remote_head` is A: push C with lease A, and rollback restores B, not A or C.

  Update the direct consumers in `## Evidence after push`, `### Compare-and-swap`, and `### Pre-menu refresh`: for a loop rewrite, compare live remote against `repair.wave.sync.expected_remote_head` and recover to `repair.wave.sync.pre_head`. The entry-time `rebased locally` path without a loop checkpoint keeps using its own `sync.md` record's `pre_head` for both purposes, because its Baseline requires local/remote equality. Do not convert an entry record to loop authority or re-enter step 2b. Preserve the loop checkpoint through pre-push reads and any local-head assessment; clear it only after successful push/rebinding or recorded recovery, so no later read mistakes B for the last pushed remote. Someone else's/bot branch or own merge-containing history uses a fresh implementer base merge and ordinary push; the latter says `sync: merged base - head contains merge commits`. Replay review uses range-diff and resolved-file diff against the local recovery head; wave review uses the post-replay pushed-head boundary; base merge uses remerge-diff. Preserve closure lines against wave `P#`/`L#` IDs. Successful push writes `repair.wave.pushed_head` and `headRefOid`, then `### Re-render` rebinds evidence and carries dispositions. Recovery uses abort while in progress, reset otherwise, and exact local pre-head/clean assertions; repair B survives rollback. Increment only `repair.syncs_used` for each sync. Change stale row names in `sync.md` to the new initial/terminal template pointers without altering its fetch, confirmation, rebase, lease, recovery, or once-only semantics.
- [ ] **Step 8: Implement accounting and watches at their owners.** In `## Wave`, count once only after at least one repair payload dispatch leaves a new source-changing commit, including a source-changing carried-set retry. Persist a counted checkpoint in `repair.wave` so interrupted reconciliation cannot double-charge. Base-only conflict commits, description-only writes, watches, re-reviews, empty waves, and restored failures cost no round. At course pick resolve `gauntlet_setting({ key: "closureReview" })` and initialize both caps to `2 x closureReview.maxFixRounds`; no-tool fallback `2 x 5`. An obstacle continue adds exactly `2 x maxFixRounds` to each cap before work without resetting either usage counter; timeout continue instead extends neither cap and opens exactly one watch window. Cap `0` or missing helpers omits delivery rows. Keep `closureReview.enforce`, `extensions/phase-tracker.ts`, its `verify` phase and `1 x maxFixRounds` counting unchanged; the gate's `2 x` multiplier is only protocol accounting.

  In `### Wait course`, run one bounded watch per D3 step 4 with `## PR gate` `timeout minutes` default 15. A null first window starts once; only the gate's own push renews an existing window automatically. Base movement, refresh, repeated entry, or unrelated head/body/check changes never renew it. An elapsed window is the `timeout` obstacle, not a `wait` menu. Classify pending checks with the existing verifier binding rule; open evidence-dependent blockers do not disable the watch. A base move during watch queues next-iteration sync (`syncs_used`) without spending a round or renewing the deadline.
- [ ] **Step 9: Install ten templates and typed-command dispatch.** Replace the extracted old `## Consent table`/`## Overlays` with the D5 state map and exactly ten template headings in `menus.md`. Keep only verb definitions, `## Availability`, and `## Withhold reason resolver` in `decision-menu.md`. Initial recommends deliver for own human PR, assess for someone else; final recommends own merge or other's approve when available, otherwise merge; assess terminal and obstacle recommend stop; contract exception recommends preserve contract; terminal cleanup and queued wait keep their specified recommendations. One `[recommended]`, flat numbers, `stop` last, `show evidence` in every hint only. Leave `menu-layout.md` bare-numeric mapping unchanged; no `2A`/`2B`. Recognize only exact `show evidence`, `reply <n>`, and `check <name> flaky | real | ci-broken` before numeric lookup; every other non-numeric string is a change request, including typed deliver even when a delivery row exists. `show evidence` prints the record through `report.md` `## What stays out` and re-renders without settlement. Explain `+2 x maxFixRounds` on obstacle delivery; map `deliver with nits` to stored `deliver-nits`. Omit zero-nit, cap-zero, missing-helper and non-pushable initial delivery rows with reasons. Preserve `approved_head`, `MERGED`/`OPEN`, successful `post coverage to ticket` and `post coverage to PR` suppression and failed-post retention. `wait` survives only in merge queued. The `batch.md` parent owns terminal posts and uses the batch summary template, while Task 4 changes its caller. Keep `merge policy` (`squash | merge-commit | rebase`) as the `gh pr merge` flag selector, never approval or sync strategy. Treat `approve (round 1) / approve (round 2)` as spec approval history, not menu configuration. Use this exact initial example:

  ```text
  Verdict: not ready - 2 blockers, 1 nit

  Pick one:
  1. assess - post the review to the PR; then approve or stop, no repairs.
  2. deliver - repair blockers, rebase on main, watch CI, repeat until merge is offered. [recommended]
  3. deliver with nits - deliver, and fold the 1 nit into the repairs.
  4. stop - remove the worktree, leave the PR as is.

  Course holds until the final menu; `show evidence` prints the full record.
  ```

- [ ] **Step 10: Keep terminal nit and contract paths bounded.** Final `fix nits` authorizes exactly one D3 iteration, including required sync/review/push/watch/re-review, and returns final or obstacle/cap without changing course. Before invoking the entry exit check, persist `repair.wave.action: fix-nits` and the selected nit IDs/payloads in the existing wave. That outstanding selection withholds readiness even with `course` unset or `deliver`; run its repair rather than immediately returning the already-green final menu. Keep the hold through the required iteration stages and release it only when the selected work and reconciliation complete, not when the helper merely commits. Obstacles/caps retain the checkpoint without fabricating completion or starting a standing nit course. After this single iteration, fresh readiness selects final or the concrete obstacle/cap; later independent nits remain outside the one-shot selection. Initialize missing accounting for a course-unset final nit pick from the same D4 defaults without setting a standing nit course. Under `### Contract decision`, `accept contract change` invokes the owning amendment before baseline update; `preserve contract` keeps the baseline, omits only the rejected payload from that re-run and preserves independent blockers. Both resume the course; `show evidence` settles nothing. Remove the old grant-covered routing, named-fix limits, revoke picks and per-description round charge from `findings.md`, `report.md`, and loop references. Retain body readback plus narrow recheck, stale proposal rejection, and independent contributor closure. `### Teardown` delegates non-final stop to `cleanup.md` `## Non-final stop`; terminal behavior remains distinct.
- [ ] **Step 11: Re-run scoped assertions and read changed instructions.** Expect green; do not weaken unrelated scope, claim, provenance, helper, CI and terminal-post assertions. Read back against forge-skill `## Authoring rules`; replace every D6 Today sentence, including the mutation red flag, ordinary fix-menu invariant, blockers-empty watch guard, old cleanup gate, old teardown offer, `consent.*` grant schema, and round-count rules. The only mid-course menu is the contract exception. Search the touched files for old `fix`, `revoke`, `merge base`, `update branch`, and grant references and distinguish deleted authority from preserved historical test comparisons or valid sync prose. Include `assessment.md` in the stale `consent.scope_at_grant` scan and read back its selected-scope contract; deleting the schema without deleting that consumer is not complete. Check the loop's remote comparisons and lease all use `expected_remote_head`, while rollback/range-diff use local `pre_head`; keep the entry-sync exception explicit. Check both course-unset and deliver final nit selections reach repair before readiness.
- [ ] **Step 12: Measure and lint owned files.** Run: `wc -l skills/gatekeep-pr/SKILL.md skills/gatekeep-pr/verification-brief.md skills/gatekeep-pr/reference/assessment.md skills/gatekeep-pr/reference/menus.md skills/gatekeep-pr/reference/decision-menu.md skills/gatekeep-pr/reference/post-selection-loop.md skills/gatekeep-pr/reference/fix-wave.md skills/gatekeep-pr/reference/findings.md skills/gatekeep-pr/reference/report.md skills/gatekeep-pr/reference/sync.md`. Run the identical explicit file list with `wc -c`; every edited file under `skills/gatekeep-pr/` must be below 500 lines and 50,000 bytes. Keep each concern in its named owner; menu extraction provides the space. Run: `node --check scripts/gatekeep-comment-reconcile.test.mjs`. No formatter is configured.
- [ ] **Step 13: Commit.** Stage only this task's files. Commit subject: `Run gatekeep repairs under a persistent course`. Body states `Behavior-change: yes`, the D0 `wc -l`/`wc -c` results and forge-skill `## Authoring rules` read-back. Do not claim model verification before Task 5 and the header runs.

Default inventory coordination: Task 1 changes `extensions/lib/gauntlet-settings.ts:92`; Task 6 updates `doc/configuration.md:12`, `:25`, `:192`, `README.md:542`, `:82`, `skills/verification-before-completion/reference/conformance-check.md:182` and `skills/verification-before-completion/reference/settings-precedence.md:25`. Those sites replace missing/non-integer default `3` with `5`; this task replaces `fix-wave.md` `## Wave`'s `else 3` and references `gauntlet_setting` without creating a new setting.

## Wave 3 - Cleanup and isolated batch integration

Depends on Wave 2: Task 4 consumes the new course record and menu state map. It also changes the same source-contract test, so it cannot run in parallel with Task 3.

### Task 4: Apply non-final stop and batch course ownership

**TDD scenario:** Modifying tested instructions - run existing tests first.

**Spec:** doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md § "D0 Authoring constraints" L33-L34, § "D7 stop on a non-final menu" L181-L187, § "D8 Batch mode" L191-L197, § "Errors and edge cases" L214

**Files:**
- Modify: `skills/gatekeep-pr/reference/cleanup.md`
- Modify: `skills/gatekeep-pr/reference/batch.md`
- Modify: `agents/pr-gatekeeper.md`
- Modify: `scripts/gatekeep-comment-reconcile.test.mjs`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`

**Tests:**
- `node --test scripts/gatekeep-comment-reconcile.test.mjs`
- baseline: 40d6c9e4 pass
- via: `cleanup.md` `## Non-final stop`, `batch.md`, and `pr-gatekeeper` report/execute contract

- [ ] **Step 1: Run existing scoped assertions.** Expect the single-PR course contract green before updating the batch fixtures.
- [ ] **Step 2: Add failing stop/batch guards.** Assert non-final stop accepts both created and reused eligible trees, retains unpushed or tracked-dirty trees, uses realpath ownership validation, and never executes terminal cleanup steps 2-4. Change batch source assertions from `assess | execute` to `report | execute`, grants to course and two budgets; assert terminal post/queued-read ownership remains parent-only and no live child tree is removed. Run scoped tests; new cleanup/mode assertions fail.
- [ ] **Step 3: Add `cleanup.md` `## Non-final stop`.** For initial, assess-terminal, obstacle and contract-exception stop, reset a `rebased locally` head first and assert the recorded pre-head and clean state. Remove only a non-primary `worktree.path`, with empty `git status --porcelain --untracked-files=no`, HEAD ancestor of last pushed head (`repair.wave.pushed_head` else assessed `headRefOid`), and valid keyed `## using-git-worktrees` ownership (`home:` and name through `realpath`). Untracked residue does not block removal. Use `worktree.destroy` when recorded, otherwise `git worktree remove --force` and `git worktree prune`; print `worktree: done`. Preserve trees with `unpushed commits <shas>`, `uncommitted changes`, `outside configured home`, or `ambiguous home match`, reporting the exact reason and path. Keep the primary even when clean. Failed custom destroy keeps the tree and reports its error; never fall back to force removal. Do not delete a branch, pull base, or run `## cleanup` overrides in this mode. Delegate record/helper/body-file deletion to `### Teardown`.

  Decision: reuse the existing cleanup step 1's primary and ownership computation, custom-destroy failure rule and terminal step order (`cleanup.md:5-23`); change eligibility only for the new entry mode. `post-selection-loop.md` calls this entry mode, not terminal steps 1-4. The read-only primary guard is an existing safety boundary, not a new terminal course.
- [ ] **Step 4: Patch only the D8 batch sentences and matching persona body.** Initialize `course` null, `repair.rounds_used`/`repair.syncs_used` zero, and `repair.rounds_cap`/`repair.syncs_cap` at twice the resolved shared value under D4. Retain the parent-owned pre-minted record/report paths. Parent mode becomes `report | execute`; course `assess` still means assessment posting, not dispatch mode. Record queued picks as the child's course or terminal verb, never grant grammar. A deliver child runs through a D3 readiness/obstacle/cap exit and returns `REPORT`; the parent renders the child's `menus.md` template. Keep admission, serial provisioning, roster, recovery adapter, result strings, confirmations, procedure-root resolution and helper isolation unchanged. Replace only the old budget/teardown phrases; parent runs non-final stop after every child has completed. Retain parent ownership of terminal posts and `merge queued` `wait`, even after worktree removal, with successful-post suppression and no removed cwd dispatch.

  Decision: change `agents/pr-gatekeeper.md:17-22` because it explicitly distinguishes current assess and execute modes; its caller is `batch.md` `## Foreground dispatch`. Leave all frontmatter and the `REPORT`, `CONFLICTING`, `FAILED`, `STOPPED` closing-line contract byte-identical. Batch supplies the initial numeric caps; only the first course pick may resolve its initial D4 allowance, and re-dispatch never reinitializes usage or caps.
- [ ] **Step 5: Re-run tests and read back.** Expect scoped tests green, including unchanged admission and terminal-post checks. Read every changed instruction against forge-skill `## Authoring rules` and `## Persona rules`.
- [ ] **Step 6: Measure and check style.** Run: `wc -l skills/gatekeep-pr/reference/cleanup.md skills/gatekeep-pr/reference/batch.md agents/pr-gatekeeper.md`. Run: `wc -c skills/gatekeep-pr/reference/cleanup.md skills/gatekeep-pr/reference/batch.md agents/pr-gatekeeper.md`. Require the edited `skills/gatekeep-pr/` files below 500 lines and 50,000 bytes, as for `post-selection-loop.md`. Run: `node --check scripts/gatekeep-comment-reconcile.test.mjs`. No Markdown formatter is configured.
- [ ] **Step 7: Commit.** Stage only owned files. Commit subject: `Carry courses through batch execution and non-final stop`. Body states behavior change, measured sizes, forge-skill Authoring rules and Persona rules read-back.

## Wave 4 - Replay contracts

Depends on Waves 2-3: Task 5 records the final single-PR, cleanup and batch behavior. The model outputs are generated later by the header commands after all instruction and documentation edits settle.

### Task 5: Cover course exits and replace obsolete replay expectations

**TDD scenario:** New behavior fixtures - assert structure first, then author concrete replay cases and facts.

**Spec:** doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md § "Tests" L224-L225, § "D5 Menus" L158

**Files:**
- Modify: `scripts/gatekeep-comment-reconcile.test.mjs`
- Modify: `eval/gatekeep-pr/target.json`
- Modify: `eval/gatekeep-pr/intent.md`
- Modify: `eval/gatekeep-pr/report.md`
- Modify: `eval/gatekeep-pr/samples/*/case.md`
- Modify: `eval/gatekeep-pr/samples/*/expected.md`
- Modify: `eval/gatekeep-pr/results/*/*.json`
- Modify: `eval/gatekeep-pr-scope/target.json`
- Modify: `eval/gatekeep-pr-scope/intent.md`
- Modify: `eval/gatekeep-pr-scope/report.md`
- Modify: `eval/gatekeep-pr-scope/samples/*/case.md`
- Modify: `eval/gatekeep-pr-scope/samples/*/expected.md`
- Modify: `eval/gatekeep-pr-scope/results/*/*.json`
- Modify: `eval/gatekeep-pr-merge-state/target.json`
- Modify: `eval/gatekeep-pr-merge-state/intent.md`
- Create: `eval/gatekeep-pr-merge-state/report.md`
- Modify: `eval/gatekeep-pr-merge-state/samples/*/case.md`
- Modify: `eval/gatekeep-pr-merge-state/samples/*/expected.md`
- Modify: `eval/gatekeep-pr-merge-state/results/*/*.json`
- Create: `eval/gatekeep-pr/samples/course-deliver-no-mid-menu/case.md`
- Create: `eval/gatekeep-pr/samples/course-deliver-no-mid-menu/expected.md`
- Create: `eval/gatekeep-pr/samples/course-deliver-nits/case.md`
- Create: `eval/gatekeep-pr/samples/course-deliver-nits/expected.md`
- Create: `eval/gatekeep-pr/samples/course-ready-at-first-report/case.md`
- Create: `eval/gatekeep-pr/samples/course-ready-at-first-report/expected.md`
- Create: `eval/gatekeep-pr/samples/course-assess-terminal/case.md`
- Create: `eval/gatekeep-pr/samples/course-assess-terminal/expected.md`
- Create: `eval/gatekeep-pr/samples/course-cap-exhausted/case.md`
- Create: `eval/gatekeep-pr/samples/course-cap-exhausted/expected.md`
- Create: `eval/gatekeep-pr/samples/course-obstacle-unknown/case.md`
- Create: `eval/gatekeep-pr/samples/course-obstacle-unknown/expected.md`
- Create: `eval/gatekeep-pr/samples/course-stop-cleanup/case.md`
- Create: `eval/gatekeep-pr/samples/course-stop-cleanup/expected.md`
- Create: `eval/gatekeep-pr/samples/menu-rows-omitted/case.md`
- Create: `eval/gatekeep-pr/samples/menu-rows-omitted/expected.md`
- Test: `eval/lib/lint.test.mjs`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs scripts/gatekeep-comment-reconcile.test.mjs`
- baseline: 40d6c9e4 pass
- via: `lintTarget()`, `lintAll()`, and gatekeep replay-assembly source assertions

- [ ] **Step 1: Run the scoped command and add red structural checks.** In the existing gatekeep test, require all eight case/fact pairs, unique expected fact IDs and `skills/gatekeep-pr/reference/menus.md` in each target's `skillFiles`. Run again; absent new fixtures and menu entries fail. Do not add evaluator machinery.
- [ ] **Step 2: Add the eight new replay cases.** Use the existing synthetic acme/widgets records and finite snapshots; never ask text replay to execute tools. Each case names course/permission/head, cap usage, deterministic helper/forge results and the expected exit. Write these must-hold facts:

  | Sample | Required facts |
  |---|---|
  | `course-deliver-no-mid-menu` | One initial numeric deliver pick; source and CI-minted failures repaired, own push renews window, base movement triggers sync without renewal, no intermediate menu, final merge still selected separately. Include one repeated-red/no-source-change checkpoint and one source-less failure with only one re-run request. Include remote A, unpushed source repair B, then loop rebase C: the saved local recovery head is B, the separately saved remote expectation stays A through repair/rebase and is checked before sync/push, and C pushes with lease A. A supplied refusal/remote-move variant restores B and exits, never resets to A, leases B, or replaces the saved expectation. |
  | `course-deliver-nits` | Every current nit joins the wave and a nit from the last re-review blocks readiness until resolved; an already-mergeable source head with opted-in nits still repairs. |
  | `course-ready-at-first-report` | Final directly, course unset, `fix nits` exposed; a selected final nit action is one iteration, not standing authority. Include otherwise-ready snapshots with course unset and with `deliver`: persist the selected nit work before exit checking, withhold readiness until repair and the required sync/review/push/watch/re-review execute, then return final with the course unchanged. Reject an immediate final-menu no-op on selection. |
  | `course-assess-terminal` | Someone else's blockers post once as request-changes, own blockers as comment; no post at zero blockers; `approve` only for someone else with zero blockers; replies stay separate. |
  | `course-cap-exhausted` | At `2 x maxFixRounds`, default five gives ten source waves and ten syncs; conflict-only sync and description-only work do not consume rounds; obstacle delivery extends `repair.rounds_cap` and sync cap once, counters preserved. Include independent phase-guard refusal and no-progress checkpoint that cap extension cannot clear. |
  | `course-obstacle-unknown` | Green CI plus `UNKNOWN` after one re-poll exits without repair or sync; missing record and undispositionable BLOCKED also stop, never reset or attribute rules. |
  | `course-stop-cleanup` | Eligible created and reused non-primary trees removed on non-final stop; untracked residue removed; unpushed/dirty/foreign-home/ambiguous trees kept with reasons; no branch/base/override work. |
  | `menu-rows-omitted` | Zero nits, cap 0, missing helpers, unpushable head, closed PR, draft and sub-WRITE final rows obey omissions; typed deliver is a change request; show evidence is a hint, stop last and one recommendation. |

- [ ] **Step 3: Rewrite existing cases and facts in place.** Read each owned existing case and expected file before changing it. Replace `consent.fix`/`merge base` grants with explicit same-run courses and both cap/usage fields. Replace legacy fix/wait picks with numeric current-template picks; retain `wait` only for merge queued and replace `show evidence` rows with hint commands. Rewrite the old 15-minute never-renew claim to own-push renewal plus timeout obstacle. Keep record-mismatch, scope-neutral description, stale body/head, contributor independence, no-progress, contract-decision, named carried-set safety, and batch-isolation assertions. Convert revoke scenarios to course switch or change-request refusal rather than leaving obsolete authority alive. Update `batch-summary-queue`, `batch-failure-retry`, `batch-rebase-answers`, `batch-cleanup-stop` for report/execute and numeric queued courses without weakening result-line checks. In scope samples retain all AC semantics while updating post-merge, cleanup and ticket-drifted menus. In all six merge-state samples retain binding classification and refresh provenance, but expect initial/final/obstacle templates rather than ordinary wait rows. Preserve terminal successful/failed coverage posting tests using numeric rows.
- [ ] **Step 4: Update assemblies and intent.** Add `skills/gatekeep-pr/reference/menus.md` to `target.json` under `eval/gatekeep-pr`, `eval/gatekeep-pr-scope`, and `eval/gatekeep-pr-merge-state`. Text replay uses `--no-tools`: a linked reference is not loaded. Preserve needed bundle additions for batch/persona and remove no safety-relevant assembly fragment. Replace the existing merge-state intent stub with real intent. For each target, compute `for:` using `assemble()` from `eval/lib/replay.mjs` and `sha256()` from `eval/lib/checks.mjs` over its candidate bundle-free assembly. Record changed facts and approved direction in `## Expected to move`; do not bless unrelated regressions. Explain that legacy grant/wait expectations were rewritten, not silently dropped. Use Task 2's extraction commit for the model baseline; do not change the evaluator's missing-file policy.
- [ ] **Step 5: Run scoped deterministic tests and check syntax.** Expect all eight sample checks plus existing target lint green. Run: `node --check scripts/gatekeep-comment-reconcile.test.mjs`. No JSON/Markdown formatter is configured; preserve two-space JSON and compact fact rows. The header's later model runs must each finish with improved/unchanged, not regressed, inconclusive, error or a partial report. Stage generated reports and records only after those runs; never synthesize model evidence.
- [ ] **Step 6: Commit the fixtures and intent.** Commit subject: `Exercise course delivery and terminal menu boundaries`. Body states `Behavior-change: yes` and names the eight samples. The verify-stage evidence commit includes the three full reports and evaluator-owned result JSON, including new sample result directories; keep the extraction baseline commit until those runs finish.

## Wave 5 - Cross-cutting docs and default inventory

Depends on Waves 1-4: describe the implemented state machine and shared default, not an intermediate extraction or grant protocol. This is the trailing doc-only wave.

### Task 6: Document the course, cap multiplier, and stop lifecycle

**TDD scenario:** Documentation-only change - source parity and authoring read-back.

**Spec:** doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md § "D0 Authoring constraints" L35, § "D4 Round accounting" L113, § "Documentation impact" L231-L232, § "Tests" L226

**Files:**
- Modify: `README.md:74-82`
- Modify: `README.md:428-430`
- Modify: `README.md:542`
- Modify: `doc/configuration.md:8-25`
- Modify: `doc/configuration.md:192`
- Modify: `CHANGELOG.md:1-7`
- Modify: `skills/verification-before-completion/reference/settings-precedence.md:21-27`
- Modify: `skills/verification-before-completion/reference/conformance-check.md:181-183`

**Tests:**
- none: documentation and numeric-default parity; runtime and gatekeep contract tests belong to earlier tasks

- [ ] **Step 1: Update current user documentation.** Replace README `## Architecture` grant paragraphs and the gatekeep blurb at `README.md:82` with one course per run, assess posting, deliver and deliver-nits, first-report readiness bypass, own-author rebase versus other/bot base merge, final merge/approve separation, `2 x` independent round/sync budgets, own-push window renewal, and non-final stop teardown. Keep the no-cross-session-authority statement. Update the `## PR gate` `merge policy` row to say it chooses the `gh pr merge` flag for final `merge` only, never sync strategy or approval.
- [ ] **Step 2: Replace every stated shared default.** `closureReview.maxFixRounds` is `5`, missing/non-integer normalizes to `5`, negative clamps to `0`; gatekeep uses twice the resolved value and no-tool fallback twice five. Update `README.md:542`, `doc/configuration.md:12`, `:25`, `:192`, `skills/verification-before-completion/reference/settings-precedence.md:25`, and `skills/verification-before-completion/reference/conformance-check.md:182` (the local `reference/conformance-check.md:182` pointer names that same file). The resolver source is `extensions/lib/gauntlet-settings.ts:92`; Task 3 already replaced `fix-wave.md` `## Wave`'s `else 3`. Leave explicit configured values of `3` that are examples of overrides rather than defaults alone; keep `gauntlet_setting` as the settings API. The verify-phase guard still uses one times the resolved value, not gatekeep's multiplier.
- [ ] **Step 3: Add current change history.** Create `CHANGELOG.md` `## Unreleased` above the current version and add a Changed entry naming the course model, default `5`, `2 x` caps and eligible non-final `stop` removal. Do not bump package version or invoke `release.sh`; it promotes Unreleased later. No new user guide is needed.
- [ ] **Step 4: Read back default instruction edits.** Follow forge-skill `## Authoring rules` for the two verification reference changes; change only default values and normalization statements, not dispatch/guard mechanics. Re-read updated README links and current CLI statements against the owning code and course files.
- [ ] **Step 5: Record final D0 checks.** Before finish, run `wc -l` and `wc -c` over the explicit union of edited `skills/gatekeep-pr/**/*.md` files from Tasks 2-4 and require every file below 500 lines and 50,000 bytes. Read changed gatekeep instructions against forge-skill `## Authoring rules`. No Markdown formatter is configured. These acceptance checks and their observed results go in the commit body, not fabricated counts.
- [ ] **Step 6: Commit documentation.** Stage only owned files. Commit subject: `Document gatekeep courses and shared repair budgets`. Body names authoring read-back and the measured gatekeep file limits. Verification reads the header command set after this wave; no task repeats the repository-wide entrypoint.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "D0 Authoring constraints" L33-L34 | Edited gatekeep files stay below both limits; changed instructions get forge read-back and commit evidence | Task 2, Task 3, Task 4 |
| § "D0 Authoring constraints" L35 | Shared default five everywhere | Task 1, Task 3, Task 6 |
| § "D0 Authoring constraints" L33-L36 | One course; no delivery menu before an exit except contract decision | Task 3 |
| § "D1 Course" L40-L44 | Course field replaces grant fields and revoke grammar; persist authority and retain repair state; remove the scope-at-grant consumer in assessment while preserving original intent | Task 3 |
| § "D1 Course" L40-L44 | Ready first report skips course choice; unset course promises no nits | Task 3 |
| § "D1 Course" L40-L44 | Author identity controls sync/defaults; bot heads never rewritten | Task 3 |
| § "D2 assess" L48 | Assess posts blockers once with author-specific review flag; no repairs or sync; replies separate | Task 3 |
| § "D2 assess" L48 | Zero-blocker assess posts nothing; approval available only to another author | Task 3 |
| § "D3 deliver" L52-L58 | Exit checks wrap fixed repair, sync, review/push, watch, re-review order | Task 3 |
| § "D3 deliver" L52-L58 | Repair source and CI findings, including later nits only under opted-in course | Task 3 |
| § "D3 deliver" L52-L58 | Sync on conflict/freshness failure only; helper resolves conflicts | Task 3 |
| § "D3 deliver" L52-L58 | Unresolved carried Critical/Moderate prevents push and retries inside budget | Task 3 |
| § "D3 deliver" L52-L58 | Bounded watch renews on own push, not base movement | Task 3 |
| § "Exit check" L62-L92 | Readiness before obstacle before round/sync cap; evaluate after each state-changing step | Task 3 |
| § "Exit check" L62-L92 | Readiness includes all merge prerequisites and opted-in nit closure | Task 3 |
| § "Exit check" L62-L92 | Missing record exits without resetting state | Task 3 |
| § "Exit check" L62-L92 | Repeated red compares intervening pushed repair commit; no-source failures get one re-run | Task 3 |
| § "Exit check" L62-L92 | Needs input, empty wave and unchanged-red restored tests stop without spending rounds | Task 3 |
| § "Exit check" L62-L92 | Blocked or unknown forge state fails closed without invented rule attribution | Task 3 |
| § "Exit check" L62-L92 | Refresh and source-review failures retry once, then stop | Task 3 |
| § "Exit check" L62-L92 | Timeout needs one explicit extra window; own permitted held run auto-approves, other runs stop | Task 3 |
| § "Exit check" L62-L92 | Lost push permission, refused lease and sync failure preserve or restore safe local state | Task 3 |
| § "Exit check" L62-L92 | Disabled merge policy stops; terminal state changes select closed template; session loss never resumes | Task 3 |
| § "Exit check" L62-L92 | Continue requires actual obstacle clearance; no-progress history is append-only | Task 3 |
| § "Loop sync" L96-L105 | Separate loop Sync from entry sync; current conflict-free head skips it | Task 3 |
| § "Loop sync" L96-L105 | Own non-bot linear history rebases with fresh local recovery pre-head and separate remote lease expectation, one conflict helper per stop | Task 3 |
| § "Loop sync" L96-L105 | Preserve expected remote A through local repair B and rebase C; fresh comparisons and lease use A, rollback restores B; mismatch never overwrites expectation | Task 3 |
| § "Loop sync" L96-L105 | Other/bot and own merge-containing history use helper base merge | Task 3 |
| § "Loop sync" L96-L105 | Review replay and wave deltas separately; closure IDs and remerge-diff retained | Task 3 |
| § "Loop sync" L96-L105 | Rewritten-head push rebinds evidence/ledger, carries dispositions; abort/reset and assert on failure | Task 3 |
| § "Loop sync" L96-L105 | Sync increments only its own usage | Task 3 |
| § "D4 Round accounting" L109-L115 | Only committed source-changing repair waves count; empty/body/sync/watch/review do not | Task 3 |
| § "D4 Round accounting" L109-L115 | Both cumulative budgets start at twice shared setting; obstacle continue extends, timeout does not | Task 3 |
| § "D4 Round accounting" L109-L115 | Zero cap or missing helpers omits deliver; phase guard remains separate and its refusal surfaces | Task 3 |
| § "D4 Round accounting" L113 | Default and normalization documentation inventory agrees with resolver | Task 6 |
| § "D5 Menus" L119 | Extract menu storage while retaining verb/availability/resolver ownership | Task 2 |
| § "D5 Menus" L119-L138 | Ten templates and state map replace consent/overlay tables; caller steps name templates | Task 3 |
| § "D5 Menus" L119-L138 | Flat numbers, stop last, one recommendation; evidence is a hint, queued wait only | Task 3 |
| § "D5 Menus" L119-L138 | Only three typed special commands precede numeric mapping; other text is a change request | Task 3 |
| § "D5 Menus" L143-L151 | Initial example shows course duration and exact flat rows | Task 3 |
| § "D5 Menus" L154 | Initial omission rules honor nits, cap, helpers, pushability and closed state | Task 3 |
| § "D5 Menus" L156 | Merge policy selects the flag, never approval or sync; spec approval history is not configuration | Task 3 |
| § "D5 Menus" L158 | Final nit pick is one iteration, leaves course unchanged, and withholds readiness until its selected work executes even with course unset or deliver | Task 3, Task 5 |
| § "D5 Menus" L119-L138 | Assess/obstacle/contract templates have their own choices and recommendations | Task 3 |
| § "D5 Menus" L119-L138 | Own merge, queued, approved and closed templates preserve post suppression and re-read ownership | Task 3 |
| § "D5 Menus" L119-L138 | Batch summary uses child templates | Task 3 |
| § "D6 Drift guard" L162-L177 | Course continues unless exit; contract decision alone interrupts and resumes course | Task 3 |
| § "D6 Drift guard" L162-L177 | Replace every Today red flag, watch/teardown/menu/grant/sync/accounting sentence | Task 3 |
| § "D7 stop on a non-final menu" L181-L187 | Separate non-final stop entry resets local rewrite first | Task 4 |
| § "D7 stop on a non-final menu" L181-L187 | Remove eligible created or reused tree only with clean tracked state, ancestry and ownership | Task 4 |
| § "D7 stop on a non-final menu" L181-L187 | Keep unpushed/dirty/foreign/ambiguous trees with path and reason | Task 4 |
| § "D7 stop on a non-final menu" L181-L187 | Custom destroy or forced untracked-only removal; no branch/base/override cleanup | Task 4 |
| § "D7 stop on a non-final menu" L181-L187 | Delete record/helper/body files through existing teardown | Task 4 |
| § "D8 Batch mode" L191-L197 | Initialize course and both budgets without resetting ongoing records | Task 4 |
| § "D8 Batch mode" L191-L197 | Rename report/execute mode in caller and persona; picks are course or terminal verb | Task 4 |
| § "D8 Batch mode" L191-L197 | Deliver child returns at each exit; parent renders corresponding menu | Task 4 |
| § "D8 Batch mode" L191-L197 | Parent retains queued read/posts and non-final stop after children finish | Task 4 |
| § "D8 Batch mode" L191-L197 | Preserve admission, provisioning, roster, result lines and recovery adapter | Task 4 |
| § "Errors and edge cases" L203-L213 | Missing record never resets; BLOCKED and UNKNOWN stop without spinning | Task 3 |
| § "Errors and edge cases" L203-L213 | Source-less failure one re-run, then repeated-red obstacle | Task 3 |
| § "Errors and edge cases" L203-L213 | Rebase conflict helper, remote-expectation lease and local-head recovery, and merge-history fallback preserve safe sync | Task 3 |
| § "Errors and edge cases" L203-L213 | Base movement does not renew watch; timeout needs one explicit window | Task 3 |
| § "Errors and edge cases" L203-L213 | Contract exception resumes course; typed omitted deliver is change request; opted-in nits block readiness | Task 3 |
| § "Errors and edge cases" L214 | Dirty/unpushed stop keeps tree; untracked residue alone does not | Task 4 |
| § "Errors and edge cases" L215-L218 | Cap extension preserves usage; unchanged checkpoint re-exits; phase guard refusal surfaces; no cross-session resume | Task 3 |
| § "Tests" L222 | Source assertions pin new fields, window renewal, ten headings and deleted red flags | Task 3 |
| § "Tests" L223 | Resolver normalizes five; five default guard waves pass, sixth fails; explicit three stays; grant-credit fixture at :1732 sets `maxFixRounds: 3` explicitly | Task 1 |
| § "Tests" L224-L225 | Eight new named samples cover course/exits/nits/stop/omissions; old expectations rewritten | Task 5 |
| § "Tests" L224-L225 | All three text targets include menu file and updated facts before full runs | Task 5 |
| § "Tests" L226 | Measure every edited gatekeep file and record authoring read-back before finish | Task 6 |
| § "Tests" L227 | Repository structural lint, runtime checks and packed install pass | Verification |
| § "Documentation impact" L231-L232 | README Architecture/blurb/settings/merge policy describe course and tunables | Task 6 |
| § "Documentation impact" L231-L232 | Configuration examples, default normalization and both budget multipliers updated | Task 6 |
| § "Documentation impact" L231-L232 | Unreleased changelog and verification instruction defaults agree with implementation | Task 6 |
| § "Out of scope" L238-L243 | No new gatekeep setting, letter sub-options or preset course key | Task 3 |
| § "Out of scope" L238-L243 | No cross-session continuation; entry rebase mechanics and verify guard counting unchanged | Task 3 |
| § "Out of scope" L243 | Runtime guard stays single-multiplier; only shared default changes | Task 1 |
