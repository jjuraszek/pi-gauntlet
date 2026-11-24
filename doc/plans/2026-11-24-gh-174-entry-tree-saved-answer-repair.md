# Repair saved answers and text checks for the gauntlet entry tree — Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Repair the 17 failing checks without changing the instructions they exercise, and document the two upgrade behaviors a porter needs to know.

**Architecture:** Keep deterministic text assertions and historical replay fingerprints separate from tests that require current model output. Refresh only those twelve samples through the existing runner; their reports are regression upkeep, not new evidence for the move.

**Tech Stack:** Node.js ESM, node:test, Git, the local pi-backed eval runner.

**Spec:** `doc/specs/2026-11-24-gh-174-entry-tree-saved-answer-repair.md`
**Verification:** none - PR subject, scoped
**Ticket:** `#174`

Baseline jjuraszek/pi-gauntlet: c15f5532

Baseline provenance: jjuraszek/pi-gauntlet at c15f5532; only `?? doc/plans/2026-11-24-gh-174-entry-tree-saved-answer-repair.md` was present and admitted. All three changed commands ran; Tasks 1, 2 and 3 exited 0 with 76, 13 and 19 tests passing respectively. HEAD and inventory remained unchanged after each. No paid runs performed.

---

## Files

- Text checks: modify `scripts/gatekeep-comment-reconcile.test.mjs` only.
- Historical checks: modify `scripts/replay-facts.mjs`, `scripts/brainstorming-bare-approve.test.mjs`, `scripts/brainstorming-draft-publication.test.mjs` and `scripts/ci.mjs`.
- Saved answers: modify the two JSON records in each Task 3 sample directory; create nine per-sample reports and replace the three existing ones. Two target reports may change; four are restored after each attempt. No deletions.
- Upgrade notes: modify `CHANGELOG.md`. No edits to either spec or any shipped procedure.

## Wave 1 — Deterministic repairs

### Task 1: Match the installed procedure and wording owner
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested code — run existing tests first.

**Spec:** doc/specs/2026-11-24-gh-174-entry-tree-saved-answer-repair.md § "1. Text assertions" L235-L236, § "1. Text assertions" L237-L240, § "Tests" L317-L317

**Files:**
- Modify: `scripts/gatekeep-comment-reconcile.test.mjs`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`

**Tests:**
- `node --test --test-reporter=tap --test-skip-pattern 'discovery and role replay structure:' --test-skip-pattern 'multi-PR contract: handoff and foreground batch' --test-skip-pattern 'report.md renders three unlabeled parts and delegates the recommendation' scripts/gatekeep-comment-reconcile.test.mjs`
- baseline: c15f5532 pass
- via: batch contract and findings text assertions at lines 181 and 540 (exercised separately in the red/green steps)

- [ ] Run `node --test --test-name-pattern 'multi-PR contract: handoff and foreground batch' --test-name-pattern 'report.md renders three unlabeled parts and delegates the recommendation' scripts/gatekeep-comment-reconcile.test.mjs`. Expect both tests to FAIL on the stale patterns; saved discovery samples belong to the later wave.
- [ ] Replace `/Resolve all named procedure dependencies relative to this root, never the PR worktree or cwd/` with a regex for `Use this root to locate the installed procedure. Follow each relative link from the file that contains it, never the PR worktree or cwd` from `skills/gatekeep-pr/reference/batch.md:49`. Escape the sentence period.
- [ ] In the existing posted-review regex replace `through SKILL.md` with `through ../SKILL.md` (escape dots and slash). Keep the `## Wording rules` suffix and the rest of the wording owner assertion from `skills/gatekeep-pr/reference/findings.md:144`.
- [ ] Repeat the step's two-name command; expect both repaired tests to PASS. Run Tests; expect the other 76 to pass, no instruction edits. Check whitespace with `git diff --check -- scripts/gatekeep-comment-reconcile.test.mjs`; no standalone JS formatter is configured.
- [ ] Commit: read `/Users/jacek/.pi/agent/npm/node_modules/pi-gauntlet/skills/finishing-a-development-branch/reference/commit-message.md` (Subject, Body, Word sources); use the task title and #174. `git add scripts/gatekeep-comment-reconcile.test.mjs`, then `git commit -F -` with the message on stdin.

## Wave 1 tasks continued

### Task 2: Recognize the three archived answers and enroll the two menu readers
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested code — run existing tests first.

**Spec:** doc/specs/2026-11-24-gh-174-entry-tree-saved-answer-repair.md § "2. Accepted pre-move answers" L244-L244, § "2. Accepted pre-move answers" L246-L248, § "2. Accepted pre-move answers" L249-L250, § "2. Accepted pre-move answers" L252-L252, § "4. Check list and release notes" L284-L284, § "Tests" L320-L322, § "Tests" L328-L328, § "Errors and edge cases" L313-L313, § "Out of scope" L343-L344

**Files:**
- Modify: `scripts/replay-facts.mjs`
- Modify: `scripts/brainstorming-bare-approve.test.mjs`
- Modify: `scripts/brainstorming-draft-publication.test.mjs`
- Modify: `scripts/ci.mjs`
- Test: `scripts/brainstorming-bare-approve.test.mjs`
- Test: `scripts/brainstorming-draft-publication.test.mjs`
- Test: `scripts/brainstorming-allowance-approval.test.mjs`
- Test: `scripts/brainstorming-budget-only-approval.test.mjs`
- Test: `scripts/brainstorming-funded-approval.test.mjs`
- Test: `scripts/brainstorming-rejected-replies.test.mjs`
- Test: `scripts/brainstorming-stop-approval.test.mjs`

**Tests:**
- `node --test --test-reporter=tap --test-skip-pattern 'saved all-none replays' --test-skip-pattern 'saved flag-replies replays' --test-skip-pattern 'saved row-4 publication replay' scripts/brainstorming-bare-approve.test.mjs scripts/brainstorming-draft-publication.test.mjs scripts/brainstorming-allowance-approval.test.mjs scripts/brainstorming-budget-only-approval.test.mjs scripts/brainstorming-funded-approval.test.mjs scripts/brainstorming-rejected-replies.test.mjs scripts/brainstorming-stop-approval.test.mjs`
- baseline: c15f5532 pass
- via: `replayFactsSha` and both saved models' existing status, judgment, output and fact checks

- [ ] Run `node --test --test-name-pattern 'saved all-none replays' --test-name-pattern 'saved flag-replies replays' --test-name-pattern 'saved row-4 publication replay' scripts/brainstorming-bare-approve.test.mjs scripts/brainstorming-draft-publication.test.mjs`; expect all three to FAIL on the saved facts hash. Leave `spec-gate/all-none`, `spec-gate/flag-replies` and `spec-gate/option-6-handoff` records unchanged. Do not add `gatekeep-pr/no-arg-discovery-cc-multi` to the archive.
- [ ] In the `archived` map add `8b65e167301569e59ea6977c0bb1e0099fe49fe3151238db6cdc6629af06ed8a/all-none` → `bd18e257b5467e29f2e2663085382d8f42f2e2b8135b86ebb1e0eee73136aad6` and `bb16ff311a260eadfb4dcd259df3c85c1caa75ac395f9daf147e0096386a0e39/option-6-handoff` → `69f3a0dec6cab946c7b4cc77cbaed6bbf8c6d9aa93d1be315070431a17644ae3`. Retain the existing flag entry and fallback hash.
- [ ] Replace only the `sha256(expected.md)` comparison of `factsSha` in both readers. Import `replayFactsSha` from the sibling helper; pass the saved record and the UTF-8 `expected.md` text just as the allowance reader does. Keep the `sha256` import for output validation.
- [ ] At `scripts/ci.mjs:558`, next to its `scripts/brainstorming-*.test.mjs` inputs, add `scripts/brainstorming-council-reply.test.mjs` and `scripts/brainstorming-draft-publication.test.mjs` exactly once. Keep stop-approval manual. Do not enroll `scripts/resume-read-traces.test.mjs`, `scripts/resume-coordinated-evidence.test.mjs`, `eval/housekeeping/unpushed-amend-report`, `eval/housekeeping/unpushed-remote-ahead-stop`, `scripts/commit-contract-docs` or `scripts/resume-current-stages`.
- [ ] Repeat the three-name command; expect all three to PASS. Run Tests; expect the other 13 to pass, including five unchanged flag readers. Inspect `git diff --check -- scripts` and CI list diff; no generated file should change.
- [ ] Commit: read `/Users/jacek/.pi/agent/npm/node_modules/pi-gauntlet/skills/finishing-a-development-branch/reference/commit-message.md` (Subject, Body, Word sources); use the title and #174. `git add scripts/replay-facts.mjs scripts/brainstorming-bare-approve.test.mjs scripts/brainstorming-draft-publication.test.mjs scripts/ci.mjs`; `git commit -F -` on stdin.

## Wave 2 — Re-record selected answers (in-place)

Depends on Wave 1: the gatekeep reader must accept the installed text before its refreshed records can pass. Work in the PR checkout; serialize the whole list to avoid shared report writes.

### Task 3: Re-record twelve selected answers and preserve the evidence reports
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested fixtures — run existing tests first.

**Spec:** doc/specs/2026-11-24-gh-174-entry-tree-saved-answer-repair.md § "Design" L225-L225, § "Reading of ticket row 37" L229-L229, § "3. Re-recorded answers" L256-L271, § "3. Re-recorded answers" L274-L274, § "3. Re-recorded answers" L275-L275, § "3. Re-recorded answers" L276-L276, § "3. Re-recorded answers" L277-L277, § "3. Re-recorded answers" L278-L278, § "3. Re-recorded answers" L279-L280, § "Paid and external actions" L297-L301, § "Paid and external actions" L303-L303, § "Errors and edge cases" L307-L307, § "Errors and edge cases" L308-L308, § "Errors and edge cases" L309-L309, § "Errors and edge cases" L310-L310, § "Errors and edge cases" L311-L311, § "Errors and edge cases" L312-L312, § "Tests" L318-L319, § "Tests" L323-L327

**Files:**
- Modify: `eval/shape-ticket/results/pr-body-proof/*`
- Modify: `eval/gauntlet/results/pr-body-drafted-row/*`
- Modify: `eval/gauntlet/results/post-action-sorted/*`
- Modify: `eval/conformance-reviewer/results/ci-step-is-the-change/*.json`
- Modify: `eval/conformance-reviewer/results/legs-verification-line/*.json`
- Modify: `eval/conformance-reviewer/results/prompt-stage-sentence/*.json`
- Modify: `eval/conformance-reviewer/results/stage-only-sentences/*.json`
- Modify: `eval/conformance-reviewer/results/mixed-row/*.json`
- Modify: `eval/spec-council-applier/results/pr-description-finding/*.json`
- Modify: `eval/gatekeep-pr/results/no-arg-discovery-cc-multi/*.json`
- Modify: `eval/gatekeep-pr/results/typed-list-note/*.json`
- Modify: `eval/spec-gate/results/row-3-reply/*.json`
- Create: `eval/conformance-reviewer/results/ci-step-is-the-change/report.md`
- Create: `eval/conformance-reviewer/results/legs-verification-line/report.md`
- Create: `eval/conformance-reviewer/results/prompt-stage-sentence/report.md`
- Create: `eval/conformance-reviewer/results/stage-only-sentences/report.md`
- Create: `eval/conformance-reviewer/results/mixed-row/report.md`
- Create: `eval/spec-council-applier/results/pr-description-finding/report.md`
- Create: `eval/gatekeep-pr/results/no-arg-discovery-cc-multi/report.md`
- Create: `eval/gatekeep-pr/results/typed-list-note/report.md`
- Create: `eval/spec-gate/results/row-3-reply/report.md`
- Modify: `eval/gauntlet/report.md`
- Modify: `eval/gatekeep-pr/report.md`
- Modify: `eval/shape-ticket/report.md`
- Modify: `eval/spec-gate/report.md`
- Modify: `eval/conformance-reviewer/report.md`
- Modify: `eval/spec-council-applier/report.md`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`
- Test: `scripts/gatekeep-reject.test.mjs`
- Test: `scripts/brainstorming-council-reply.test.mjs`
- Test: `scripts/delivery-stage-authoring.test.mjs`
- Test: `eval/conformance-reviewer/ci-step-is-the-change.test.mjs`
- Test: `eval/conformance-reviewer/legs-verification-line.test.mjs`
- Test: `eval/conformance-reviewer/prompt-stage-sentence.test.mjs`
- Test: `eval/conformance-reviewer/stage-exclusion.test.mjs`
- Test: `eval/spec-council-applier/pr-description-finding.test.mjs`

**Tests:**
- `node --test --test-reporter=tap scripts/gatekeep-reject.test.mjs`
- baseline: c15f5532 pass
- via: the second `typed-list-note` reader checks the saved replay input and judgment

- [ ] Run Tests; expect 19 passes before re-recording. Use the per-sample reader commands below to identify the twelve stale cases. Keep `gauntlet/handoff-follows-pointer`, `gauntlet/ordinary-request-no-run` and `gatekeep-pr/overrides-own-block-only` as the only move evidence. Touch no `skills/`, `agents/`, `extensions/`, `src/bins/`, `bin/`, `eval/run.mjs` or `eval/lib/` implementation. No `intent.md`, `target.json`, `judge.md`, `replay.md` or `samples/` changes: `intentSha` binds the complete intent text.
- [ ] Make a unique checkout-local scratch folder as in `doc/configuration.md#scratch-storage` under the absolute checkout git dir's gauntlet/tmp. Before each sample's first attempt snapshot its entire existing results directory and target report there, separately by target/sample. Restore the **directory**, including original absence of a per-sample report; a partial save is not evidence.
- [ ] For each pair below, in order, run `node eval/run.mjs` with exactly its two arguments from the PR tree. Use `git merge-base HEAD origin/main`, local `pi` and models fixed in `eval/lib/models.mjs`. Do not run any target-wide or cross-target eval. Repeat the snapshot, reader, save and restoration steps per pair before starting the next; no concurrent model jobs.

  | target | sample (one invocation per name, left to right) | reader immediately after exit 0 |
  |---|---|---|
  | `shape-ticket` | `pr-body-proof` | delivery-stage-authoring |
  | `gauntlet` | `pr-body-drafted-row`, `post-action-sorted` | delivery-stage-authoring |
  | `conformance-reviewer` | `ci-step-is-the-change`, `legs-verification-line`, `prompt-stage-sentence` | matching sample-named test file |
  | `conformance-reviewer` | `stage-only-sentences`, `mixed-row` | stage-exclusion |
  | `spec-council-applier` | `pr-description-finding` | sample-named test file |
  | `gatekeep-pr` | `no-arg-discovery-cc-multi`, `typed-list-note` | gatekeep-comment-reconcile; also gatekeep-reject for the latter |
  | `spec-gate` | `row-3-reply` | brainstorming-council-reply |

- [ ] Use `node --test --test-name-pattern "$sample" "$reader"` for files naming multiple samples, selecting the sample's registered test; use `node --test "$reader"` for a single-sample reader (including council-reply). For delivery-stage-authoring select the case by its registered sample test name. For gatekeep-comment-reconcile select `discovery and role replay structure: $sample`. Expect PASS immediately after the corresponding sample's run, with a nonzero executed count and no failures in **every** applicable reader; explicitly check `typed-list-note` against both readers, including all three `gauntlet.md` paths; require the two `brainstorm/user-review-gate` markers in the council reply. Don't mistake a different still-stale sibling for a failure of this attempt.
- [ ] Only after exit 0, both `baseline.json` and `candidate.json` saved by the runner and all applicable tests green, copy the target `report.md` byte-for-byte to that sample's results/report.md. Never hand-edit a record, hash, answer or verdict. After **every** attempt (including failures) restore the target report for gauntlet, gatekeep-pr, shape-ticket and spec-gate to `97a48eebcb0450175a2051328a60616a3b6b9174` using the exact committed bytes. Preserve `flag-replies` evidence. The other two target reports retain their last success.
- [ ] On exit 2 before writes, correct the refusal (including unavailable `origin/main`) then rerun the pair. On exit 130 rerun the interrupted unwritten sample. On provider/judge error, partial or failed save, inconclusive/regressed judgment, or a reader failure despite exit 0: identify the failed fact, restore the pre-attempt snapshot, and use the one authorized retry. Check the retry log shows actual candidate calls rather than cached reuse. On a second failure restore again, leave the reader red and return its fact and provider if relevant. No weakening a reader or changing instructions. No separate paid action beyond these twelve pairs without new authorization.
- [ ] Run Tests again (offline); expect all 19 tests green. `git diff 97a48eeb -- eval/gauntlet/report.md eval/gatekeep-pr/report.md eval/shape-ticket/report.md eval/spec-gate/report.md` must print nothing. Inspect `git diff --stat` and `git diff --check`; do not format runner output or count upkeep as move evidence.
- [ ] Commit: read `/Users/jacek/.pi/agent/npm/node_modules/pi-gauntlet/skills/finishing-a-development-branch/reference/commit-message.md` (Subject, Body, Word sources); use the title and #174. Stage only validated owned result directories and the two retained target reports with `git add --`; send the message to `git commit -F -`.

## Wave 3 — Upgrade notes

Depends on Wave 2: finish with the cross-cutting documentation and confirm the PR's evidence boundary.

### Task 4: Document the two upgrade behaviors and retain the carried contract
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Documentation — review against the owning instructions.

**Spec:** doc/specs/2026-11-24-gh-174-entry-tree-saved-answer-repair.md § "4. Check list and release notes" L285-L286, § "4. Check list and release notes" L287-L287, § "5. Carried spec" L291-L293, § "Documentation impact" L338-L338, § "Tests" L329-L331

**Files:**
- Modify: `CHANGELOG.md`

**Tests:**
- none: release notes reviewed against the instruction files

- [ ] Under `## Unreleased` > `### Upgrade from 8.x`, add one sentence ending `(#174)` about checking reviewer findings against the diff at wave review and after a conformance fix; make no edit for a disproved finding. In that same sentence restrict recording a disputed verdict and stopping uncommitted to a green per-wave `FIX_FIRST` when all findings are disproved. Compare `skills/gauntlet/implement/waves/waves.md:117` (`waves.md:117`) with `skills/gauntlet/conformance-check.md` Convergence b; do not cancel independently failing commands.
- [ ] Add a second sentence ending `(#174)` explaining that only `- verification command:` under `# shared` > `## verification` configures the loop; otherwise it discovers the project's test entrypoint. A backticked command ported into `# gauntlet` > `## verify` is not taken. Check step 2 of `skills/gauntlet/implement/loop/loop.md`.
- [ ] Confirm the single existing predecessor banner below its title already limits supersession to the `### Eval` bullet and model row of `### Paid and external actions`; no spec edit. Leave the carried `## Tests`, all other AC mechanisms and housekeeping intact; this is not authority for `gh issue close 174` or `/skill:release major`. Read the two additions in context; `git diff --check -- CHANGELOG.md` should be clean.
- [ ] Commit: read `/Users/jacek/.pi/agent/npm/node_modules/pi-gauntlet/skills/finishing-a-development-branch/reference/commit-message.md` (Subject, Body, Word sources); use the title and #174. `git add CHANGELOG.md`; `git commit -F -` on stdin.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "1. Text assertions" L235-L236 | Replace the root regex without losing the caller-relative or forbidden-root clauses | Task 1 |
| § "1. Text assertions" L237-L240 | Replace the wording-owner regex without shortening it | Task 1 |
| § "2. Accepted pre-move answers" L244-L244 | Exactly the approved three historical answers; discovery remains current-only | Task 2 |
| § "2. Accepted pre-move answers" L246-L248 | Add precisely the two new historical fingerprints | Task 2 |
| § "2. Accepted pre-move answers" L249-L250 | Switch both readers to the shared helper | Task 2 |
| § "2. Accepted pre-move answers" L252-L252 | Preserve existing flag key and its five readers | Task 2 |
| § "4. Check list and release notes" L284-L284 | Add both approval-menu readers beside their peers in CI | Task 2 |
| § "Design" L225-L225 | Preserve instruction, runner and eval input bytes | Task 3 |
| § "Reading of ticket row 37" L229-L229 | Separate regression upkeep from the three behavior proofs | Task 3 |
| § "3. Re-recorded answers" L256-L271 | Run only the twelve listed pairs; validate all readers | Task 3 |
| § "3. Re-recorded answers" L274-L274 | Save a sample report only after both records and readers succeed | Task 3 |
| § "3. Re-recorded answers" L275-L275 | Snapshot results and report before the first attempt | Task 3 |
| § "3. Re-recorded answers" L276-L276 | Serialize by target; at most two targets | Task 3 |
| § "3. Re-recorded answers" L277-L277 | Restore four target reports after every attempt | Task 3 |
| § "3. Re-recorded answers" L278-L278 | Two target reports keep last success | Task 3 |
| § "3. Re-recorded answers" L279-L280 | Runner-only records; no broad replay | Task 3 |
| § "Paid and external actions" L297-L301 | Local configured runners only, selected pairs and permitted retries | Task 3 |
| § "Errors and edge cases" L307-L307 | Correct refusals then rerun | Task 3 |
| § "Errors and edge cases" L308-L308 | Repeat interrupted unwritten sample | Task 3 |
| § "Errors and edge cases" L309-L309 | Investigate and restore before a single real replay retry | Task 3 |
| § "Errors and edge cases" L310-L310 | Restore and escalate second failure with fact/provider; no instruction edits | Task 3 |
| § "Errors and edge cases" L311-L311 | Rejection reader also gates the typed-list sample | Task 3 |
| § "Errors and edge cases" L312-L312 | Never race target report writers | Task 3 |
| § "Errors and edge cases" L313-L313 | Exclude four main failures and two recorded sessions from CI | Task 2 |
| § "4. Check list and release notes" L285-L286 | Document both reviews and only the per-wave disputed stop | Task 4 |
| § "4. Check list and release notes" L287-L287 | Document loop key or discovery, not a verify-section backtick | Task 4 |
| § "5. Carried spec" L291-L293 | Single existing banner; all unrelated sections and gates stand | Task 4 |
| § "Documentation impact" L338-L338 | Two upgrade sentences in the existing changelog section | Task 4 |
| § "Out of scope" L343-L344 | Leave recorded-session and main-failing tests untouched and unenrolled | Task 2 |
| § "Out of scope" L345-L345 | Additional stale records | waived: unselected samples excluded |
| § "Out of scope" L346-L346 | Moved text changes to improve results | waived: instruction edits excluded |
| § "Out of scope" L347-L347 | Old-overrides compatibility | waived: no fallback provision |
| § "Out of scope" L350-L350 | Live two-engine proof | waived: live proof alone is deferred to #174; the two-engine behavior remains required |
