# Coordinated draft-PR handoff Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Publish coordinated specs through one home draft PR, reconstruct companion worktrees at its marked re-gate, and deliver companion PRs before the header-linked home PR.

**Architecture:** Extend the four existing reference owners and the Step 0 companion routing clause. Keep membership in the committed Legs blocks, publication identity on origin, and delivery retries in the existing receipt contract; add no new runtime state or admission route.

**Tech Stack:** Markdown workflow instructions, synthetic text evals, Node.js node:test, existing Git/GitHub CLI recipes.

**Spec:** `doc/specs/2026-10-29-coordinated-draft-pr-handoff.md`

**Verification:** `npm test` && `node eval/run.mjs using-git-worktrees` && `node eval/run.mjs brainstorming` && `node eval/run.mjs spec-gate` && `node eval/run.mjs finishing-a-development-branch` (package test entrypoint: scripts/ci.mjs)

Baseline jjuraszek/pi-gauntlet: 7b473847

---

## Execution context and recon

The sole implementation leg is `jjuraszek/pi-gauntlet`, branch `coordinated-draft-pr`, in the caller-supplied worktree. The feature operates on coordinated consumer repositories; this implementation does not add companion repositories to its own spec. Use the recorded home `.worktrees/<name>` and spec/plan directories. No deployment topology or review-risk split applies. No Happy path table exists in the first-found `.pi/gauntlet-overrides.md`.

Rules walk: root `AGENTS.md` is the only applicable directory rule; no `CLAUDE.md` or nested rules apply to the task paths. Its one-hop local links are already in the spec's Rules list. Read that entire list with each task; additionally apply `skills/forge-skill/SKILL.md` authoring rules. Preserve compact tables, ASCII punctuation, imperative instructions, frontmatter, and the standard Project overrides block. No touched skill currently exceeds 500 lines; keep the additions bounded in the four existing references.

| Source | Recon finding |
|---|---|
| `skills/using-git-worktrees/SKILL.md:19-26,75-109,212-232` | Explicit ROOT exists for fresh members, but only PR values route to pr-head. Fresh branch collision and -b creation must be bypassed only for existing-remote companions. Step 4 already owns affirmative coordinated read-back. |
| `skills/using-git-worktrees/reference/pr-head.md:3-69,89-147` | Existing-head provisioning, rework recovery, and fetched-base merge helper are reusable. Companion mode must branch before PR-field reads. |
| `skills/brainstorming/reference/pr-subject.md:33-47` | Only the marked singleton classifier row admits this extension. Admission, relatedness, unmarked routing, and rework recording remain untouched. |
| `skills/brainstorming/reference/spec-pr.md:3-59,61-88` | Predicate, option-6 publication and marked re-gate are the authoritative owners. Retain pinned audit, new-commit approval, and published-home create-only retry. |
| `skills/finishing-a-development-branch/reference/spec-pr.md:3-50` | Header-only PR route already owns preflight, menus and non-force home push. |
| `skills/finishing-a-development-branch/reference/legs.md:13-105` | Reuse live receipt validation, checkout-local verification, ordered delivery and seal aggregation by reference; do not edit or duplicate its general contract. |
| `eval/lib/lint.test.mjs:80-83` | Existing real-tree test invokes lintAll over committed targets. It catches incomplete new samples, not behavioral correctness. |
| `eval/run.mjs:1-260`, `eval/README.md` | Model runner takes target/sample names, not test-file tokens. Full affected-target comparisons belong to Verification, not task Tests; do not invent a file-addressable runner. |
| `scripts/ci.mjs:478-575`, `package.json` | Full verification bundles structural, instruction-size, stage-skill and model-literal lint plus deterministic tests. No separate formatter or Markdown-format script is configured. |

Scoped structural runner: `node --test eval/lib/lint.test.mjs`. Scoped eval lint: call `lintTarget` from `eval/lib/lint.mjs` with the owning target path. Repo-wide style exports are `lintSkillSizes` from `scripts/skill-size-lint.mjs` and `lintModelLiterals` from `scripts/model-literal-lint.mjs`; CI invokes both. No source/bin rebuild is required for these instruction edits.

Model evidence is verifier-owned: retain the runner's reports and JSON records under each affected target's `report.md` and `results/`, including the four new sample result directories. Never hand-author outcomes or accept a structural pass as model evidence. Refresh each target's `intent.md` for the candidate assembly using the existing eval procedure, preserve accepted historical variance, and require every new must-hold fact on both replay models. A full target run follows all edits even when its cache reuses unchanged cells. Commit generated evidence before finish through the existing verify flow.

## Files

**Modify - instruction owners:**
- `skills/using-git-worktrees/SKILL.md` (Step 0 routing only)
- `skills/using-git-worktrees/reference/pr-head.md`
- `skills/brainstorming/reference/pr-subject.md` (marked classifier only)
- `skills/brainstorming/reference/spec-pr.md`
- `skills/finishing-a-development-branch/reference/spec-pr.md`

**Create - synthetic eval pairs:**
- `eval/using-git-worktrees/samples/pr-head-caller-root/case.md`
- `eval/using-git-worktrees/samples/pr-head-caller-root/expected.md`
- `eval/brainstorming/samples/spec-pr-publish-legs/case.md`
- `eval/brainstorming/samples/spec-pr-publish-legs/expected.md`
- `eval/brainstorming/samples/spec-pr-regate-legs/case.md`
- `eval/brainstorming/samples/spec-pr-regate-legs/expected.md`
- `eval/finishing-a-development-branch/samples/spec-pr-menu-legs/case.md`
- `eval/finishing-a-development-branch/samples/spec-pr-menu-legs/expected.md`

**Modify - existing eval cases, facts and intent:**
- `eval/using-git-worktrees/samples/pr-head/case.md`
- `eval/using-git-worktrees/samples/pr-head/expected.md`
- `eval/using-git-worktrees/intent.md`
- `eval/brainstorming/samples/spec-pr-regate/case.md`
- `eval/brainstorming/samples/spec-pr-regate/expected.md`
- `eval/brainstorming/samples/pr-list-per-pr-attribution/case.md`
- `eval/brainstorming/samples/pr-list-per-pr-attribution/expected.md`
- `eval/brainstorming/intent.md`
- `eval/spec-gate/samples/option-6-handoff/case.md`
- `eval/spec-gate/samples/option-6-handoff/expected.md`
- `eval/spec-gate/intent.md`
- `eval/finishing-a-development-branch/samples/spec-pr-menu/case.md`
- `eval/finishing-a-development-branch/samples/spec-pr-menu/expected.md`
- `eval/finishing-a-development-branch/samples/pr-subject-push/case.md`
- `eval/finishing-a-development-branch/samples/pr-subject-push/expected.md`
- `eval/finishing-a-development-branch/intent.md`

**Modify - cross-cutting docs:**
- `README.md` (workflow steps 1 and 5; Multi-repo runs)
- `CHANGELOG.md` (Unreleased entry)

**Delete:** none. No changes to target-wide eval configuration, general legs references, the earlier spec, runtime code, settings, personas, or bins.

## Baseline provenance

Initial inventory in jjuraszek/pi-gauntlet at 7b473847: ` M doc/specs/2026-10-29-coordinated-draft-pr-handoff.md`; no other staged, unstaged or untracked paths. Admit only the dispatched plan and spec paths; the caller's In-flight path is that same spec. The endpoint-tree proof from e8985fb2 to 7b473847 outside `doc/specs/` and `doc/plans/` exited 1, so retain no prior evidence. Executed each of Tasks 1, 2 and 3's identical scoped commands separately in the owning checkout: each exited 0 with 14 tests passed, 0 failed. After each execution, HEAD remained 7b473847 and the inventory remained the same. No generated artifacts or contaminated runs. Model comparisons remain for Verification.

## Wave 1 - Existing-branch provisioning and coordinated finishing

Tasks 1 and 2 are file-disjoint and dependency-free. Their deterministic tests create unique OS-temporary fixtures and only read other targets; no shared database, port, fixture write or live forge resource is used. Run model comparisons later, after all instruction edits.

### Task 1: Add companion existing-branch provisioning and coordinated base-sync recovery
Leg: jjuraszek/pi-gauntlet
Rules: skills/forge-skill/SKILL.md

**TDD scenario:** Modifying tested instructions - run existing structural tests first, add failing sample structure, then complete fixtures and the instruction contract. Model verification establishes behavior separately.

**Spec:** doc/specs/2026-10-29-coordinated-draft-pr-handoff.md § "Design" L81-L81, § "Design" L110-L110, § "Design" L114-L114, § "Design" L120-L124, § "Acceptance criteria" L35-L35, § "Acceptance criteria" L39-L39, § "Errors and edge cases" L161-L165, § "Tests" L194-L195

**Files:**
- Modify: `skills/using-git-worktrees/SKILL.md:19-26`
- Modify: `skills/using-git-worktrees/reference/pr-head.md:3-147`
- Create: `eval/using-git-worktrees/samples/pr-head-caller-root/case.md`
- Create: `eval/using-git-worktrees/samples/pr-head-caller-root/expected.md`
- Modify: `eval/using-git-worktrees/samples/pr-head/case.md`
- Modify: `eval/using-git-worktrees/samples/pr-head/expected.md`
- Modify: `eval/using-git-worktrees/intent.md`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: 7b473847 pass
- via: `lintAll`, `skills/using-git-worktrees/SKILL.md` Step 0 and `skills/using-git-worktrees/reference/pr-head.md` companion mode, exercised behaviorally by `eval/using-git-worktrees/samples/pr-head-caller-root/case.md`

Decision: reuse the existing routing value `REMOTE_BRANCH=existing`, supplied with `$ROOT` and `$BRANCH`; a coordinated marked home carries its observed N>1 context rather than another persisted field. The spec Design and pr-head's mode-specific procedures settle this boundary. Keep identity in `## Legs` with `repo` and `branch`, not a new artifact.

- [ ] **Step 1: Run the existing structural test.** Run the Tests command; expect all tests green before adding fixtures.
- [ ] **Step 2: Write the new caller-root case.** Use synthetic `acme/widget` home and `acme/helper` companion under `/work`, branch `spec-export`, distinct full SHAs, and independent supplied observations. Add `bundle+: skills/using-git-worktrees/reference/pr-head.md`; the target already loads the full `SKILL.md` through `skillFiles`. Supply no PR array for the companion. Cover absent local branch, local ancestor, clean selected-home reuse, wrapper `create: helper create -b <branch> <name>`, root distinct from session, race, checked-out-elsewhere, unresolved helper, and valid/invalid recovery. Add only case.md initially.
- [ ] **Step 3: Confirm structural red.** Run the Tests command; expect the real-tree lint assertion to identify the new sample's missing expected.md, not a runtime or credential error.
- [ ] **Step 4: Add facts and the routing clause.** Write expected.md with `anonymized: true` and judged facts for ROOT authority, no PR-field/ref/thread work, exact existing-branch rows, ownership/wrapper safety, affirmative read-back and legacy home preservation. Extend `eval/using-git-worktrees/samples/pr-head` with an explicit ordinary PR-home control and add its must-hold fact without weakening existing facts. In Step 0, route `$ROOT`, `$BRANCH`, `REMOTE_BRANCH=existing` to companion mode instead of Steps 0, 1 and 1a, bypassing the fresh `show-ref` collision stop; fresh coordinated callers retain their existing `-b` path.
- [ ] **Step 5: Implement companion identity resolution before PR reads.** In pr-head, use caller `$ROOT`, the Step 0 submodule guard against it, `$BRANCH`, `git -C "$ROOT" fetch origin`, and the required origin branch. Resolve `ORIGINAL_HEAD` from that branch; obtain nonempty `baseRefName` using positional `gh repo view` (never `-R`) and resolve `BASE_SHA` in the companion. Resolve `home:` and `create:` by that repo's `.pi/settings.json` and overrides, already checked against recorded `contract:` in preflight. Read no `headRefOid`, `MEMBER_HEADS` or `PRE_REWORK_HEAD`, emit no `PR:` or `Pre-rework head:` and write no pre-rework refs. Keep checked-out-elsewhere and ancestry safety, but use the repo identity instead of a PR-number stop. Missing origin uses Task 3's specified originating-machine recovery text. In pr-head's recovery instruction, require `git log -1 --format=%H refs/heads/<branch> -- <spec-dir>/<home spec filename>` to show the leg-file commit before `git push -u origin <branch>`. Name the retained local branch explicitly because the originating primary may be on its default branch; check out nothing. Without that commit on any machine, stop continuation and regenerate nothing.
- [ ] **Step 6: Implement existing-branch rows and merge.** Preserve the existing row order: selected home -> Step 3 dirty-tree ask and `merge --ff-only`, requiring HEAD equal to ORIGINAL_HEAD; no worktree/local ancestor -> ancestry proof then `update-ref` then add; no worktree/no branch -> existing-branch DWIM add, never `-b` or `-B`. Use a compatible existing-branch wrapper only; otherwise retain `create: override skipped (contains -b)`. On post-create mismatch preserve the tree and print its path and both SHAs. Reuse the fetched-base merge recipe with companion `cwd` and `SCOPED_TEST_COMMANDS` from its own `BASE_SHA`; keep helper staging, contained-delta and orchestrator-completion checks, abort on failure and record `merge: unresolved - <files>`. Validate ORIGINAL_HEAD ancestry after merge, then require `worktree list --porcelain` and `branch --show-current` read-back before emitting `Worktree ready at <path>`.
- [ ] **Step 7: Add narrowly gated recovery.** Only a coordinated marked home or companion may use this pre-ancestry recovery. Require origin ancestry of the actual local branch, a nonempty first-parent walk with format `%H %P`, exactly two parents per entry, every second parent ancestral to the fetched default base, and a clean existing worktree. Reuse the validated tip with no reset, `update-ref` or `-b`; a missing tree uses existing-branch add. Merge the base as usual, including `merge: no-op`, and append `Base sync recovered: <sha7>`. Ordinary singleton PR and N-PR rework recovery stay unchanged. A failed proof preserves the existing stop, named by repo; every provisioning failure carries `Preserved created legs:` and removes nothing. Task 3 renders the companion unresolved-merge stop and the `brainstorming #N` gate with `Withheld: draft PR - #N already exists`.
- [ ] **Step 8: Complete local checks and intent.** Run the Tests command; expect green. Run `node --input-type=module -e 'import {lintTarget} from "./eval/lib/lint.mjs"; const e=lintTarget("eval/using-git-worktrees"); if(e.length) throw Error(e.join("\n"));'`; expect exit 0. Review touched instructions against forge-skill and keep every file below 500 lines and the repository size limits. There is no formatter to run. Update intent with intended movements for the new facts, unchanged home behavior and the structural-versus-model evidence distinction; preserve the existing target cap and fact IDs.
- [ ] **Step 9: Commit.** Stage only this task's instruction, sample and intent files; commit `Add existing-branch companion provisioning` with a body stating this changes instruction behavior and names its eval target. Do not stage the read-only Test anchor.

### Task 2: Compose header-linked finish with companion delivery
Leg: jjuraszek/pi-gauntlet
Rules: skills/forge-skill/SKILL.md

**TDD scenario:** Modifying tested instructions - existing structural test, new sample structural red, completed contract and fixtures green; behavioral results come from full-target verification.

**Spec:** doc/specs/2026-10-29-coordinated-draft-pr-handoff.md § "Design" L81-L81, § "Design" L128-L138, § "Acceptance criteria" L43-L45, § "Errors and edge cases" L169-L174, § "Tests" L196-L201

**Files:**
- Modify: `skills/finishing-a-development-branch/reference/spec-pr.md:3-50`
- Create: `eval/finishing-a-development-branch/samples/spec-pr-menu-legs/case.md`
- Create: `eval/finishing-a-development-branch/samples/spec-pr-menu-legs/expected.md`
- Modify: `eval/finishing-a-development-branch/samples/spec-pr-menu/case.md`
- Modify: `eval/finishing-a-development-branch/samples/spec-pr-menu/expected.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-subject-push/case.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-subject-push/expected.md`
- Modify: `eval/finishing-a-development-branch/intent.md`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: 7b473847 pass
- via: `lintAll`, `skills/finishing-a-development-branch/reference/spec-pr.md` and the existing `legs.md` delivery recipe, exercised behaviorally by `eval/finishing-a-development-branch/samples/spec-pr-menu-legs/case.md`

Decision: specialize only the header-linked N>1 route in spec-pr.md; link `finishing-a-development-branch/reference/legs.md` under skills rather than changing its general body-list or PR-subject rules. The spec explicitly preserves the home body and gives `## Rework record` precedence over `**PR:**`. Retain membership `## Legs`, `repo` and `branch` without new fields. Across the change, only four references and `skills/using-git-worktrees/SKILL.md` own instruction edits; this task owns only the finish reference.

- [ ] **Step 1: Run the Tests command.** Expect all existing structural tests green.
- [ ] **Step 2: Write the new narrated case and confirm red.** Add case.md with sample-local bundles for the full finish SKILL.md, its spec-pr.md and legs.md, and brainstorming's legs.md. Supply synthetic home/companion spec blocks, matching Home tuple, verification results, audited tips, live OPEN PR observations, receipt locations and draft flags. Keep live forge actions disabled. Run the Tests command before expected.md exists; expect only the missing-facts structural failure.
- [ ] **Step 3: Complete the fact matrix and controls.** Add judged facts for row-1 ready creates, row-2 draft creates with `--draft`, row-1 retry of a receipt-proven draft, row-2 retry of an already-ready PR, companion create/ready failure, closed receipt, home seal failure, home ready failure, single seal and immutable home body. Require both legs' verification and conformance in their own checkouts, the exact order of delivery, and home-last summaries. Extend `eval/finishing-a-development-branch/samples/spec-pr-menu` with one-leg and legacy controls; extend `eval/finishing-a-development-branch/samples/pr-subject-push` with both `**PR:**` and `## Rework record`, requiring the existing rework route. Preserve their prior facts.
- [ ] **Step 4: Add the coordinated activation and verification route.** After existing deferred-header and rework-precedence checks, N>1 blocks select coordinated verification and closure under legs.md Steps 1 and 3.5, replacing rather than duplicating home-only verification. Retain each leg's recorded commands, Rules, owned ACs, receipt-proven exemptions and freshness checks. Keep existing menu/preflight withholding; no companion fan-out starts for a withheld home action. A one-block or absent Legs spec retains every old header-linked step.
- [ ] **Step 5: Add the rows 1/2 delivery sequence.** Validate receipts and deliver companions in block order under legs.md steps 1-2. Query `gh pr view <url> --json state,headRefOid,isDraft` for receipt-proven companions too. On row 1 create ready PRs and run `gh pr ready <url>` for valid draft receipts, refreshing receipts; on row 2 create drafts and leave already-ready companions unchanged. Do no companion strip or seal. After collecting every companion URL, strip/seal home once with `--option pr --base origin/<baseRefName>` and one `--leg <repo>=<pr-url>` per companion; then perform the existing `push --no-follow-tags` to `headRefName` and row-1-only `gh pr ready <N> -R <owner/repo>`. Never run the standalone home seal as well.
- [ ] **Step 6: Preserve partial-failure and body semantics.** Companion create, `gh pr ready`, closed-receipt or seal failures stop home push, preserve delivered companions and receipts, and print the existing Not shipped reason; on seal failure use `Not shipped: <home repo> <bin output>`. A home-ready failure reports the already-completed home push and all shipped companions. Print `Shipped: <repo> pr <url>` per member, home last. Keep the home PR body byte-for-byte; waive only legs.md's home-body companion-URL insertion on this route, not each companion's `Home:` pointer. State that the user keeps the shipped summary for cross-repo review because receipts are removed after successful home delivery. Retain rows 3-5's coordinated squash/keep/discard behavior and existing cleanup confirmations. Preserve `**Engine:** deferred` -> `spec approved for handoff only - run brainstorming #N`, live OPEN/head checks, and all ordinary `gh pr create`/push failures.
- [ ] **Step 7: Check structure, style and intent.** Run the Tests command and `node --input-type=module -e 'import {lintTarget} from "./eval/lib/lint.mjs"; const e=lintTarget("eval/finishing-a-development-branch"); if(e.length) throw Error(e.join("\n"));'`; expect green and exit 0. Review imperative bounded edits and ASCII/compact tables; no formatter is configured. Update intent for ready/draft reconciliation, one seal, unchanged single/rework controls and unchanged historical variance. Keep target-wide assembly and word cap unchanged.
- [ ] **Step 8: Commit.** Stage only the owned instruction, case, expected and intent paths; commit `Compose header-linked coordinated PR delivery` with a behavior-change body naming the finishing eval target.

## Wave 2 - Publication and re-gate integration

Depends on Wave 1 Task 1: the marked re-gate calls its companion mode and recovery. Task 2 is independent but complete before full-target verification. One task owns both edits to brainstorming's spec-pr.md and both affected eval targets, avoiding competing writers.

### Task 3: Publish every member and re-settle companions at the marked re-gate
Leg: jjuraszek/pi-gauntlet
Rules: skills/forge-skill/SKILL.md

**TDD scenario:** Modifying tested instructions - existing tests, structurally failing new cases, complete fixtures/instructions, then green structural checks. Preserve model evidence as a separate verification gate.

**Spec:** doc/specs/2026-10-29-coordinated-draft-pr-handoff.md § "Design" L81-L81, § "Design" L85-L100, § "Design" L104-L108, § "Design" L112-L116, § "Acceptance criteria" L25-L41, § "Errors and edge cases" L146-L166, § "Errors and edge cases" L176-L176, § "Tests" L180-L193, § "Out of scope" L211-L217

**Files:**
- Modify: `skills/brainstorming/reference/spec-pr.md:3-88`
- Modify: `skills/brainstorming/reference/pr-subject.md:33-47`
- Create: `eval/brainstorming/samples/spec-pr-publish-legs/case.md`
- Create: `eval/brainstorming/samples/spec-pr-publish-legs/expected.md`
- Create: `eval/brainstorming/samples/spec-pr-regate-legs/case.md`
- Create: `eval/brainstorming/samples/spec-pr-regate-legs/expected.md`
- Modify: `eval/brainstorming/samples/spec-pr-regate/case.md`
- Modify: `eval/brainstorming/samples/spec-pr-regate/expected.md`
- Modify: `eval/brainstorming/samples/pr-list-per-pr-attribution/case.md`
- Modify: `eval/brainstorming/samples/pr-list-per-pr-attribution/expected.md`
- Modify: `eval/brainstorming/intent.md`
- Modify: `eval/spec-gate/samples/option-6-handoff/case.md`
- Modify: `eval/spec-gate/samples/option-6-handoff/expected.md`
- Modify: `eval/spec-gate/intent.md`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: 7b473847 pass
- via: `lintAll`, `skills/brainstorming/reference/spec-pr.md` Publish option 6 and Re-gate a marked spec PR, `skills/brainstorming/reference/pr-subject.md` marked classifier; behavioral cases `eval/brainstorming/samples/spec-pr-publish-legs/case.md` and `eval/brainstorming/samples/spec-pr-regate-legs/case.md`

Decision: retain the existing published-home create-only retry, without another amend or push, after a home create failure. The owner already freezes that published handoff commit. Companion-push retries, before home publication, rerun both passes; equality skips companions already published. This preserves the spec's home-failure rule without amending a remote home commit.

Decision: keep coordinated base-sync proof in pr-head (Task 1); the classifier supplies observed N>1 marked context before home provisioning and spec-pr.md invokes `/skill:using-git-worktrees` companion mode after all-member preflight. The mode is routed in `skills/using-git-worktrees/SKILL.md`; do not use a new settings key, PR field or companion PR array.

- [ ] **Step 1: Run the Tests command.** Expect the existing real-target lint test green.
- [ ] **Step 2: Write both new cases and confirm structural red.** Use synthetic home `acme/widget`, companions `acme/helper` and `acme/codec`, shared `spec-export`, recorded spec-dir/home/create values, unique full SHAs and explicit successful or failed tool observations. Bundle spec-pr.md, pr-subject.md, brainstorming legs.md, using-git-worktrees SKILL.md/pr-head.md and finishing cleanup owners only where needed. Keep independent labeled checkpoints and shared command legends within existing word caps. Run the Tests command before expected.md files exist; expect failures naming the two missing expected files.
- [ ] **Step 3: Add the publication fact matrix.** Write `spec-pr-publish-legs/expected.md` with anonymization and judged facts for: never-published companion (ls-remote exit 2); two-leg success; companion shape failure; three-leg home-last shape failure; rejected later companion push and equality-skip retry; foreign remote head with both full SHAs and already-published inventory; preflight command errors; home push/create failure; and cleanup refusal followed by remaining cleanup attempts. Supply concrete outputs for every branch instead of asking the model to infer tool state. Extend `eval/spec-gate/samples/option-6-handoff` with one recorded leg and a fact requiring one push/PR/cleanup and no `pushed:` line.
- [ ] **Step 4: Implement the publication preflight.** Keep clean `6` decoding and home-only `**Amend-grant:** none` plus `**Engine:** deferred` amend/read-back. Read committed `## Legs` in legs.md order and use carried Worktree First paths; keep `repo`, `branch`, `contract:`, `spec-dir:`, `home:` and `create:` authoritative. Run a complete companions-first/home-last preflight before any push. Resolve each companion default with positional `gh repo view` (never `-R`), require nonempty, `fetch` it and inspect `diff --name-status origin/$DEFAULT...HEAD`. Apply the shared predicate: exactly one `A` at its recorded leg-file path, only banner-only `M`s under spec dirs resolved from its `.pi/settings.json` with existing preset rules and defaults `doc/specs`, `docs/specs`; never companion `gauntlet_setting`. Require remote discovery through `ls-remote --exit-code --heads`, not stale tracking state: 2 means absent and must not fetch that branch; 0 means fetch and compare full origin/HEAD SHAs; other exits stop with member and output. Home last keeps its existing default resolution and shape predicate. A shape failure names member, name-status lines and `origin/$DEFAULT`, redraws with `Withheld: draft PR - <repo> diff against origin/<default> is not spec-only (<paths>)` and preserves implementation approvals. `gh repo view`, `fetch` and `ls-remote` errors stop before every push.
- [ ] **Step 5: Implement the publication pass.** Push absent companion branches in declared order; equal remote HEAD skips with `already published`; differing full SHAs stop without force/reconciliation and report earlier published members, retained checkouts and retryable 6 after manual resolution. Rejected pushes print git output/member and re-present 6; rerun both passes on that retry. Then retain home's existing push and `gh pr create --draft` recipe. Home failures keep today's rows and list already-published companions with no rollback. On success print one `pushed: <repo> origin/<branch>` per companion before the single URL and `phase_tracker complete`.
- [ ] **Step 6: Implement branch-preserving cleanup.** Cleanup companions then home using each recorded `contract:` ownership and `destroy:` wrapper/built-in behavior; verify wrappers preserve the branch. Failed/host-owned members report path/output and do not stop remaining attempts. Keep the exact one-block and legacy recipe without companion prefixes. Write no option-6 receipt, companion PR, telemetry or brief.
- [ ] **Step 7: Add marked-only routing and settlement.** In the classifier's Shape and marker pass row only, count carried `### Leg:` blocks from the same original `git show` used for the deferred marker. Zero/one uses today's `SYNC=merge` home-only path. N>1 enables Task 1's coordinated home recovery and, after home Step 4, enters settle -> preflight -> provision in spec-pr.md. Reject unparseable blocks naming missing `repo`, `branch` or `contract:`; keep home preserved. Settle through `legs.md` using the first-found home overrides at `BASE_SHA`, matching only recorded repos to `- sibling:` declarations and resolving `PATH` under the home primary parent; validate declaration, checkout, origin identity and non-home path. Use `leg <repo> matches no sibling declaration in <overrides path>` on unmatched membership.
- [ ] **Step 8: Implement all-companion preflight.** Preflight every companion by `fetch origin`, requiring the shared remote branch and comparing current `home:`/`create:` from its own overrides and `.pi/settings.json` to recorded lines. Remote-tracking updates are allowed; `worktree add`, `update-ref` on `refs/heads/*`, and merges are not. Missing last companion still creates/syncs none. Contract drift prints `contract drift for <repo>: recorded <key>: <recorded value>, resolved <current value>; amend the recorded contract or restore the repo convention, then rerun brainstorming #N`; never silently use either value. Reconcile through the existing home-plus-companion amendment rule.
- [ ] **Step 9: Provision and preserve retry state.** Invoke using-git-worktrees once per companion with `$ROOT`, `$BRANCH`, `REMOTE_BRANCH=existing` only after all pass. No `refs/gauntlet/pre-rework/*`, PR fields, thread fetch or `MEMBER_HEADS` entry for companions. Retain race-backstop origin checks, stop inventories and Task 1's `Base sync recovered:` proof/report. On unresolved companion base use `base merge unresolved for <repo> (<files>) - merge origin/<base> by hand in <worktree> and rerun brainstorming #N`. Every provisioning stop prints `Preserved created legs:`; remove no trees. Print `Worktree ready at` lines home first at the gate, still 1/2/4/5, optional pinned-audit 3, and `Withheld: draft PR - #N already exists`.
- [ ] **Step 10: Implement missing-origin recovery and gate persistence.** Missing remote uses `origin/<branch> is missing in <repo>; on the machine that ran option 6, push <branch> from that companion's checkout, then rerun brainstorming #N`. Explain the originating-machine recovery: verify the leg-file commit with `git log -1 --format=%H refs/heads/<branch> -- <spec-dir>/<home spec filename>`, push the existing branch with `git push -u origin <branch>` from retained worktree or primary, and rerun. The primary may sit on its default branch, so name the retained branch in the log without checking anything out. Without that commit anywhere the handle is incomplete; regenerate nothing. Approval writes home-only `**Engine:**`, `**Amend-grant:**` and `**PR:**` in a new commit. A change request that touches Problem, shared Design, Errors and edge cases, Out of scope, a companion-binding clause or a leg block rewrites/commits affected live companion files before summarizer re-dispatch. Keep the pinned audit and ordinary gate persistence, with no second council or approval implied by artifacts.
- [ ] **Step 11: Complete re-gate facts and regression controls.** Add `spec-pr-regate-legs/expected.md`: no local branches and DWIM on both repos; missing last remote; missing sibling declaration; home/create drift; invalid member identity; malformed Legs; partial provisioning preservation; home recovery after later-leg stop; companion by-hand recovery versus unrelated local commit; wrapper `-b`/`-B` fallback with `create: override skipped (contains -b)`; shared-content change request versus approval-only commit. Extend the missing-remote checkpoint in `spec-pr-regate-legs/case.md` with an originating primary on its default branch, its retained `refs/heads/spec-export` containing the leg file, and no retained worktree. Require the matching expected fact to name `git log -1 --format=%H refs/heads/spec-export -- doc/specs/export.md` before `git push -u origin spec-export`, without checkout or reliance on session HEAD; retain the incomplete-handle stop when no machine has the commit. Extend `eval/brainstorming/samples/spec-pr-regate` for one-leg and absent-Legs controls. Extend `eval/brainstorming/samples/pr-list-per-pr-attribution` to require `brainstorming #12 #13` stays relatedness/rework with `## Rework record` and no companion re-settle. Keep `pr-subject.md` admission/relatedness/rework behavior byte-identical, foreign references rejected, and `gauntlet-resume`/`gauntlet-handoff` untouched.
- [ ] **Step 12: Run structure/style checks and update intent.** Run the Tests command and `node --input-type=module -e 'import {lintTarget} from "./eval/lib/lint.mjs"; const e=[...lintTarget("eval/brainstorming"),...lintTarget("eval/spec-gate")]; if(e.length) throw Error(e.join("\n"));'`; expect green and exit 0. Review exact stop strings, imperative instructions, compact tables, generic paths and bounded file sizes; no formatter is configured. Update both intent files for new behavior and preserved controls without changing target-wide configuration or accepting failures. Model replay remains in Verification; structural green alone proves no publication or recovery behavior.
- [ ] **Step 13: Commit.** Stage only owned instructions, new and extended samples, and intent files; commit `Publish and re-gate coordinated spec handles` with a body identifying instruction behavior changes and both eval targets.

## Wave 3 - User-facing documentation

Depends on Waves 1 and 2: describe the implemented publication, reconstruction and finish composition. Keep this trailing task file-disjoint from instruction/eval tasks.

### Task 4: Document the coordinated draft handle and delivery order
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Documentation-only - source-conformance review and existing verification, no new executable tests.

**Spec:** doc/specs/2026-10-29-coordinated-draft-pr-handoff.md § "Design" L141-L141, § "Documentation impact" L206-L207

**Files:**
- Modify: `README.md:39-45`
- Modify: `README.md:80-90`
- Modify: `CHANGELOG.md:1-5`

**Tests:**
- none: cross-cutting documentation; no Markdown formatter is configured

- [ ] **Step 1: Update workflow step 1.** Explain that option 6 pushes each companion branch, opens one home draft PR and carries no brief; `brainstorming #N` reconstructs companions from origin and re-gates. Link the publication/re-gate owner rather than duplicating its stop tables.
- [ ] **Step 2: Update workflow step 5.** Explain header-linked rows 1/2 deliver companions before the single home seal with every companion PR, then push/readiness on home. State the ready/draft distinction and the shipped-summary location for companion URLs without implying a home-body update.
- [ ] **Step 3: Update Multi-repo runs.** Amend the existing `Handoff carries every member in the brief's \`legs:\` block.` sentence to distinguish the draft-PR handle from the existing brief/resume route. Keep the `### Multi-repo runs` receipt and recorded-contract rules consistent. Reference the prior `doc/specs/2026-10-28-spec-only-draft-pr.md` as extended, not superseded; leave its PR-list exclusion and banners unchanged.
- [ ] **Step 4: Add release notes.** Add a concise `## Unreleased` entry in `CHANGELOG.md` covering companion publication, remote-based re-gate, and header-linked ordered PR delivery. Do not bump package versions or invoke release.
- [ ] **Step 5: Review and commit.** Re-read changed README units against the three instruction owners and verify local links resolve. Keep ASCII and compact tables; no formatting command applies. Commit only README.md and CHANGELOG.md as `Document coordinated draft-PR handoff`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L25-L41 | AC 1: companion pushes before one home draft PR and report | Task 3 |
| § "Acceptance criteria" L25-L41 | AC 2: all-member spec-only preflight before any push | Task 3 |
| § "Acceptance criteria" L25-L41 | AC 3: absent/equal/diverged remote and rejection retry | Task 3 |
| § "Acceptance criteria" L25-L41 | AC 4: recorded cleanup per member, preserve branches and continue | Task 3 |
| § "Acceptance criteria" L25-L41 | AC 5: one-member option 6 unchanged | Task 3 |
| § "Acceptance criteria" L35-L35 | AC 6: companion existing-branch checkout and base merge | Task 1 |
| § "Acceptance criteria" L25-L41 | AC 6: marked classifier, re-settle and home-first ready inventory | Task 3 |
| § "Acceptance criteria" L25-L41 | AC 7: all-companion remote/declaration/contract preflight | Task 3 |
| § "Acceptance criteria" L39-L39 | AC 8: safe local recovery and existing provisioning stops | Task 1 |
| § "Acceptance criteria" L25-L41 | AC 8: unresolved stop and partial-run preserved inventory | Task 3 |
| § "Acceptance criteria" L25-L41 | AC 9: legacy/single marked route and PR lists unchanged | Task 3 |
| § "Acceptance criteria" L43-L45 | AC 10: per-leg verification, ready/draft receipts, one seal, home last | Task 2 |
| § "Acceptance criteria" L43-L45 | AC 11: rework precedence and single-member finish unchanged | Task 2 |
| § "Design" L81-L81 | Four references plus Step 0 only; existing identity, no runtime machinery | Task 1, Task 2, Task 3 |
| § "Design" L85-L100 | Amend only home's deferred/grant header and read committed ordered members | Task 3 |
| § "Design" L85-L100 | Preflight every companion then home without pushes | Task 3 |
| § "Design" L85-L100 | Positional default query and member-local fetch/diff | Task 3 |
| § "Design" L85-L100 | Recorded leg addition and member-settings banner-only predicate | Task 3 |
| § "Design" L85-L100 | Live ls-remote absence/presence/error classification | Task 3 |
| § "Design" L85-L100 | Per-member shape failure redraw and command-error stop | Task 3 |
| § "Design" L85-L100 | Absent push, equality skip, mismatch stop with full SHAs | Task 3 |
| § "Design" L85-L100 | Companion rejection retries both passes and preserves earlier pushes | Task 3 |
| § "Design" L85-L100 | Existing home push/create failures and create-only retry retained | Task 3 |
| § "Design" L85-L100 | Pushed inventory before URL and completion | Task 3 |
| § "Design" L85-L100 | Per-recorded-contract home-last cleanup continues after refusal | Task 3 |
| § "Design" L85-L100 | Single-member recipe and output unchanged | Task 3 |
| § "Design" L104-L108 | Classify same carried spec; only marked N>1 enters companion route | Task 3 |
| § "Design" L104-L108 | Re-settle through BASE_SHA home declarations and validate every identity | Task 3 |
| § "Design" L104-L108 | Fetch all companions before branch/tree/sync writes | Task 3 |
| § "Design" L104-L108 | Contract drift stops and reconciles home plus companion artifact | Task 3 |
| § "Design" L104-L108 | Explicit caller roots and existing-remote mode, no companion PR metadata | Task 3 |
| § "Design" L104-L108 | Provisioning race backstop carries preserved inventory | Task 3 |
| § "Design" L110-L110 | Coordinated-only origin-ancestry, first-parent, two-parent base proof | Task 1 |
| § "Design" L110-L110 | Clean-tip reuse without reset and recovered report | Task 1 |
| § "Design" L112-L116 | Membership/remote/drift/provisioning stops preserve all created trees | Task 3 |
| § "Design" L112-L116 | Originating-machine leg-commit push recovery names the retained branch, not session HEAD; no regeneration | Task 3 |
| § "Design" L114-L114 | Companion-mode recovery logs the retained branch without checkout before push; no regeneration | Task 1 |
| § "Design" L112-L116 | Home-only new approval commit; shared changes update live companions | Task 3 |
| § "Design" L120-L124 | Step 0 marker route bypasses fresh collision and creation | Task 1 |
| § "Design" L120-L124 | Companion root, branch, original head and fetched default values | Task 1 |
| § "Design" L120-L124 | No PR arrays, pre-rework refs, PR-number stops or thread fetch | Task 1 |
| § "Design" L120-L124 | Existing-home/ancestor/DWIM rows and compatible wrapper fallback | Task 1 |
| § "Design" L120-L124 | Post-create equality and race preservation | Task 1 |
| § "Design" L120-L124 | Companion fetched-base helper scope, abort and ancestry validation | Task 1 |
| § "Design" L120-L124 | Coordinated affirmative read-back, ordinary home preserved | Task 1 |
| § "Design" L128-L138 | Header-linked N>1 replaces home-only verification and delivery | Task 2 |
| § "Design" L128-L138 | Recorded leg-local verification, conformance and receipt exemptions | Task 2 |
| § "Design" L128-L138 | Ordered companion delivery, live draft reconciliation, no companion seal | Task 2 |
| § "Design" L128-L138 | Aggregate all URLs before exactly one home strip/seal | Task 2 |
| § "Design" L128-L138 | Existing non-force home push, ready only for row 1 | Task 2 |
| § "Design" L128-L138 | Rows 3-5 retain coordinated behavior | Task 2 |
| § "Design" L128-L138 | Preserve home body, retain companion Home pointer and home-last summary | Task 2 |
| § "Design" L128-L138 | Deferred, non-OPEN, receipt, create and ready failure stops | Task 2 |
| § "Design" L128-L138 | Rework precedence and legacy/single header-linked path | Task 2 |
| § "Design" L141-L141 | Workflow 1, workflow 5, Multi-repo runs and Unreleased docs | Task 4 |
| § "Errors and edge cases" L146-L166 | Shape failure at any position leaves all branches unpushed | Task 3 |
| § "Errors and edge cases" L146-L166 | Absent remote is publishable, never a branch-fetch failure | Task 3 |
| § "Errors and edge cases" L146-L166 | Rejected companion retries equality skips | Task 3 |
| § "Errors and edge cases" L146-L166 | Foreign remote head prints full SHAs and published members | Task 3 |
| § "Errors and edge cases" L146-L166 | Home failure retains and reports published companions | Task 3 |
| § "Errors and edge cases" L146-L166 | Cleanup refusal retains branch and continues other members | Task 3 |
| § "Errors and edge cases" L146-L166 | Command errors distinguish preflight from partial publication | Task 3 |
| § "Errors and edge cases" L146-L166 | Absent Legs stays home-only; malformed block stops | Task 3 |
| § "Errors and edge cases" L146-L166 | Missing sibling declaration stops before companion writes | Task 3 |
| § "Errors and edge cases" L146-L166 | Invalid path/checkout/origin/home identity stops | Task 3 |
| § "Errors and edge cases" L146-L166 | Missing last remote creates no companions; origin-machine recovery only | Task 3 |
| § "Errors and edge cases" L146-L166 | Current home/create drift stops before companion writes | Task 3 |
| § "Errors and edge cases" L161-L165 | Elsewhere and unrelated local commits stop, never reset | Task 1 |
| § "Errors and edge cases" L161-L165 | Validated home/companion base merges recover | Task 1 |
| § "Errors and edge cases" L161-L165 | Unresolved merge returns failure and preserves prior trees | Task 1 |
| § "Errors and edge cases" L146-L166 | Re-gate renders by-hand unresolved stop and preserved inventory | Task 3 |
| § "Errors and edge cases" L161-L165 | Incompatible create wrapper uses DWIM plus skip report | Task 1 |
| § "Errors and edge cases" L146-L166 | Shared change request reconciles companions; approval touches only home | Task 3 |
| § "Errors and edge cases" L169-L174 | Closed receipt needs disposition | Task 2 |
| § "Errors and edge cases" L169-L174 | Row-1 receipt draft readied; row-2 ready state never reversed | Task 2 |
| § "Errors and edge cases" L169-L174 | Companion create/ready failure blocks home and retains receipts | Task 2 |
| § "Errors and edge cases" L169-L174 | Seal failure preserves companions and receipts; home unpushed | Task 2 |
| § "Errors and edge cases" L169-L174 | Home ready failure reports completed push and companions | Task 2 |
| § "Errors and edge cases" L169-L174 | Legacy header-linked finish unchanged | Task 2 |
| § "Errors and edge cases" L176-L176 | Admission, foreign-repo rejection and N-PR rework unchanged | Task 3 |
| § "Tests" L180-L193 | Publication five branches and single-member option-6 control | Task 3 |
| § "Tests" L180-L193 | Re-gate six branches, one/zero-leg and PR-list controls | Task 3 |
| § "Tests" L194-L195 | Companion caller rows and ordinary PR-head control | Task 1 |
| § "Tests" L196-L201 | Ready/draft/retry/seal-failure and rework/single finish controls | Task 2 |
| § "Tests" L202-L202 | New samples pass CI eval structural lint | Verification |
| § "Documentation impact" L206-L207 | README workflow and handoff sentence; CHANGELOG Unreleased | Task 4 |
| § "Documentation impact" L206-L207 | Prior draft-PR spec remains true, referenced rather than superseded | Task 4 |
| § "Out of scope" L211-L217 | No companion option-6 PRs or spec PR-identity field | Task 3 |
| § "Out of scope" L211-L217 | No foreign companion continuation/admission/relatedness/rework changes | Task 3 |
| § "Out of scope" L211-L217 | No handoff/resume edits or option-6 brief | Task 3 |
| § "Out of scope" L211-L217 | No option-6 receipts or publication rollback | Task 3 |
| § "Out of scope" L211-L217 | No telemetry/settings/persona/extension/bin changes | Task 3 |
