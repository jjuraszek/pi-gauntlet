# Gauntlet first-line contract Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Give skill-owned waiting and terminal turns one machine-readable first line without changing reply authority or menu bodies.

**Architecture:** Keep presentation grammar in menu-layout.md and the hand-maintained inventory in doc/gate-contract.md. A deterministic lint validates inventory-to-render-site coverage, reverse coverage, citations, and placement; the existing phase-tracker guard supplies only an escalation nudge. Text eval targets exercise first-message-line behavior.

**Tech Stack:** Node.js ESM, node:test, TypeScript with the existing Pi stub loader, Markdown instructions, existing text eval runner.

**Spec:** `doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md`

**Verification:** `npm test`

**Ticket:** `#92`

---

## Files

No source deletions. Task Files blocks enumerate every owned source, sample, report and intent path. Existing generated eval result JSON is task-owned by target; its exact changed subset depends on content-addressed replay caches.

- Lint/runtime (Tasks 1-2): create `scripts/gate-contract-lint.mjs`, `scripts/gate-contract-lint.test.mjs`; modify `scripts/ci.mjs`, `extensions/phase-tracker.ts`, `extensions/phase-tracker.test.ts`.
- Grammar (Task 3): modify `skills/brainstorming/reference/menu-layout.md`.
- Brainstorm/plan/workspace (Task 4): seven rendering files and the brainstorming, writing-plans, using-git-worktrees eval targets.
- Implement/verify/finish (Task 5): five rendering files and the subagent-driven-development, loop-implementation, conformance-check, finishing-a-development-branch eval targets.
- PR/ticket workflows (Task 6): nine rendering files and the gatekeep-pr, chase-bug, check-delivery, shape-ticket eval targets.
- Resume/handoff (Task 7): three rendering files, the gauntlet-resume eval target, and a new gauntlet-handoff eval target with one sample.
- Public contract (Task 8): create `doc/gate-contract.md`; modify `README.md`, `AGENTS.md`, `CHANGELOG.md`.

## Baseline provenance

BASE: `2eb4429b`. Initial inventory on this Amend dispatch: ` M doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md`. Admitted the dispatched spec and plan paths and the parent's In-flight path `doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md`. No other tracked or untracked entries were present.

Prior execution evidence: the endpoint proof `git diff --quiet 336712f7 HEAD -- . ':!doc/specs/' ':!doc/plans/'` exited 1 at HEAD `1fa7b3e0`; no evidence from that older base was retained or re-stamped. All seven baseline bullets were regenerated there. Task 2's unchanged Tests command executed at `1fa7b3e0` and exited 0: 162 tests, 162 pass, 0 fail, 0 skipped. Post-run provenance had the same HEAD and only the admitted spec path. Tasks 1 and 3-7 have only the plan-created `scripts/gate-contract-lint.test.mjs` anchor and received all-created-anchor skips. Task 8 is documentation-only. No full verification or model eval ran during Baseline. No evidence was inferred from source edits.

On this dispatch `git diff --quiet 1fa7b3e0 2eb4429b -- . ':!doc/specs/' ':!doc/plans/'` exited 0. All Tests command text is unchanged and the only admitted in-flight path lies within the spec directory. Retained 7 bullets: `1fa7b3e0` -> `2eb4429b`, tree-equivalent outside `doc/specs`, `doc/plans`.

## Execution conventions

Read `skills/forge-skill/SKILL.md` Authoring rules before instruction edits. Preserve frontmatter, gate choices, authority, tracker transitions and automatic continuation. Use ASCII and compact table separators. The approved amendment settles shared question slices, real headings outside fences, comma-joined outcomes, two carried-open sites, handoff evaluation and in-place finishing markers. Record finishing's oversized-file extraction as follow-up, not part of this change.

Recon: package.json supplies a single full verification entrypoint through scripts/ci.mjs. It bundles instruction lint, syntax checks, unit tests, eval structure/hygiene, bundle freshness and packaging. No formatter or separate general ESLint command is configured. Scoped JavaScript syntax is `node --check` per file; TypeScript syntax is `node --experimental-strip-types --check` per file, matching scripts/ci.mjs:401-409. Instruction style uses forge-skill review, `node scripts/skill-size-lint.mjs`, and `node scripts/model-literal-lint.mjs`. The integrated new lint is `node scripts/gate-contract-lint.mjs` after Task 8 writes the inventory. Preserve menu-layout numeric reply mapping.

No Happy path or Deployment table exists in overrides. This is one change with no independent deployment boundary. No bin regeneration is required: neither bin sources nor extensions/lib changes.

Eval procedure for Tasks 4-7: create each named sample's case.md/expected.md; extend intent.md with the new fact and bind `for:` to the candidate assembly SHA reported by the runner, not a Git SHA. Select existing slices through sample `bundle+`/`bundle-` lines as documented in eval/README.md:95-119. Run the sample first, then the full target after the final instruction edit; commit report.md and generated result JSON. Inspect the new first-line fact for `after: holds` on the sole authorized replay model; exit 0 is not enough because both-arms-fail is pre-existing. Anchor mechanical regexes with `^` without multiline and terminate the first line with `(?:\r?\n|$)`; `^...$/m` alone can match a later line. Keep required regexes and unrelated expected facts unchanged. At question render owners keep the lint-recognized sentence `Start the message with \`gauntlet: question\`.` and require the literal alone at column 0 on the first physical line, followed by a newline before any other text. This strengthens the existing first-line rule, not the behavioral facts.

For this flow's option A only, temporarily set the existing `MODELS` constants in each task's own eval checkout to `replay: Object.freeze(["github-copilot/gpt-6.1-sol"])`, `judge: "github-copilot/gpt-6.1-sol"`, `thinking: "medium"` in `eval/lib/models.mjs:1-6`. Save its original bytes outside the repo and restore them before patch capture; inspect the resulting patch to ensure this file is absent. This is not a shipped file or shared edit. Keep the runner, retry policy and configuration API unchanged. Saved outputs keep their actual provider/model identity; never relabel old outputs or edit verdicts to pass. Reports must cover the sole authorized replay model with truthful judge provenance.

Decision: Judge identity is absent from ordinary judgment-currency keys (`eval/lib/records.mjs:29-32`), so changing constants alone can reuse an old judge's verdict. For each reused sample whose judgment has no evidence from the newly authorized judge, first obtain reusable successful replies through an ordinary run, then use the existing sample-scoped `--refresh-judgments` mode once (`eval/README.md:17-33`, `eval/run.mjs:271-319`). Refresh records the actual judge in `judgeModel` and its audit; historical model metadata is not authority to relabel an old observation. Do not refresh stale replies, suppress failures, widen intent or repeat behavioral failures until pass. Schedule these legacy refreshes before the final renderer edit/full-target observation so its changed gate-line-first cell still causes a real comparison and a target-wide report. A no-op full run can leave a partial report untouched; inspect report scope and records rather than treating that no-op as fresh report evidence. Preserve and surface errors, regressions, inconclusive outcomes and first-line failures.

## Wave 1 - Deterministic enforcement foundations

Tasks 1 and 2 own disjoint files and use isolated in-memory or OS-temp fixtures. They share no mutable service, port, tracker state or fixture path.

### Task 1: Implement inventory lint and wire its fixture tests into CI

**TDD scenario:** New feature - full TDD cycle.

**Spec:** doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md § "The contract (owner: `doc/gate-contract.md`, new)" L74, § "Templates" L100, § "Lint (`scripts/gate-contract-lint.mjs`, called from `scripts/ci.mjs`)" L108-L118, § "Errors and edge cases" L137, § "Tests" L141-L146, § "Tests" L150, § "Out of scope" L165

**Files:**
- Create: `scripts/gate-contract-lint.mjs`
- Create: `scripts/gate-contract-lint.test.mjs`
- Modify: `scripts/ci.mjs:379-423`
- Test: `scripts/gate-contract-lint.test.mjs`

**Tests:**
- `node --test scripts/gate-contract-lint.test.mjs`
- baseline: 2eb4429b skipped - scripts/gate-contract-lint.test.mjs created by this task
- via: `scripts/gate-contract-lint.mjs`

Decision: Export `lintGateContract(root)` returning printable diagnostic strings, shared by the direct CLI and CI import. Root injection permits isolated test trees, following `scripts/stage-skill-lint.mjs:66-90`; scripts/ci.mjs:379-399 already imports a lint. Keep fixtures inline in the test file and materialize only under mkdtemp(os.tmpdir()).

Decision: Parse a terminal report-site cell as relative file path plus ` § ` plus heading prefix; Task 8 writes that encoding. Permit shared question sites, forbid duplicate gate file/site pairs, and permit one gate id at two distinct sites - amended spec L80/L110.

- [ ] **Step 1: Write a valid fixture and run red.** Build minimal Gates/Terminals tables, fenced gate and prose question renderers, a terminal, resolving links, four-kind rule block and public links. Import the new module, assert no diagnostics, and run the Tests command; expect module-not-found before implementation.
- [ ] **Step 2: Add parser failures.** Cover wrong column count, invalid id, missing file, absent heading, duplicate gate file/site pair, and a marker under the next peer heading. Slice real ATX headings outside fences through the next same-or-higher heading; include nested headings. Resolve heading prefixes without rewriting existing dash characters. Three question rows sharing one sentence pass. Two rows with one gate id at distinct sites pass. An apparent heading inside a fence never starts or ends a slice; cover the ticket-acceptance fenced heading before its real cut-question paragraph.
- [ ] **Step 3: Add placement failures.** A `templates=2` slice with one marked and one unmarked fence fails; two marked fences pass; three fail. Exercise prose with and without `Start the message with`, an explanatory backtick quote, and a marker after another nonblank fence line. Cover gate, question and terminal forms; include `gauntlet: stuck` and the sentence `Start the message with \`gauntlet: question\`.`. Use `menus.md`'s `initial` fence versus its other prose sections as the fixture shapes.
- [ ] **Step 4: Add reverse/link/rule failures.** Cover unregistered gate/done/stuck, question and menu-layout exemptions, examples outside slices, broken relative menu-layout links, missing README/AGENTS links and each missing kind/charset. Exclude extensions, doc, eval and root documentation from reverse scanning.
- [ ] **Step 5: Implement parsing and checks.** Parse only the named contract tables, retain row numbers, validate columns/id/site, derive slices and check literal position/count. Resolve links from the rendering file. Do not generate the inventory or execute Markdown content.
- [ ] **Step 6: Implement diagnostics and CLI.** Preserve the spec's gate/terminal not-found, literal-not-in-contract, citation, documentation-link, and missing-kind messages. Emit one defect per line and nonzero exit on defects. A missing contract is failure, not an empty successful inventory.
- [ ] **Step 7: Wire CI and run green.** Add import/call near brief lint, route diagnostics through fail(), and run the fixture test using process.execPath and captured output like neighboring tests. Run the Tests command; fixtures pass independently of the not-yet-created real inventory.
- [ ] **Step 8: Syntax/style and commit.** Run `node --check scripts/gate-contract-lint.mjs`, `node --check scripts/gate-contract-lint.test.mjs`, and `node --check scripts/ci.mjs`. Stage those three files and commit with `git commit -m "Validate gauntlet render sites against the contract (#92)"`.

Literal contract for the parser: Gates uses `gate id | kind (gate/question) | rendering file | site | layout (N. rows / X) options / 1 - rows / item-letter / free)`, with `site` a heading prefix. An existing `## Step 3` is a prefix, not a demand to rewrite the rest of that heading. Match `gate` and `question`, `gauntlet: question`, `Start the message with`, and the `templates=<N>` layout note (`finishing-a-development-branch/step-4` has three). Shared sites include `## Author the plan` and `## Human stop`. Scan `skills/**/*.md` for `gauntlet: gate=` / `done` / `stuck`; `gauntlet: gate=|done|stuck` describes those three alternatives, not a fourth literal form. Exempt `menu-layout.md`; exclude `extensions/`, `doc/`, `eval/`, `README.md`, `CHANGELOG.md`. Validate links to `skills/brainstorming/reference/menu-layout.md` and `doc/gate-contract.md` from `AGENTS.md` and README. The row-position examples use `Good:` blocks under `brainstorming/SKILL.md` ### 3. Citation-bearing source names in Templates are `spec-finalization.md`, `amendment-surface.md`, `ticket-acceptance.md`, `pr-subject.md`, `writing-plans/SKILL.md`, `subagent-driven-development/stop-note.md`, `loop-implementation/SKILL.md`, `verification-before-completion/reference/conformance-check.md`, `using-git-worktrees/SKILL.md`, `gatekeep-pr/reference/{sync,batch}.md`, `gauntlet-resume/reference/reconstruction.md`, `gauntlet-handoff/SKILL.md`. Preserve diagnostic templates `gate <skill>/<id> not found at <file> <site>`, `terminal <skill>/<ending> not found at <file> <site>`, `<file>:<line> gauntlet: <kind> not in doc/gate-contract.md`, `<file>: no resolving menu-layout citation`, `doc/gate-contract.md not linked from <README.md|AGENTS.md>`, and `menu-layout.md: missing line kind <kind>`. The rule block must name `[A-Za-z0-9.-]+` and four kinds; no generator or driver is added.

### Task 2: Name the cap escalation line in the existing runtime nudge

**TDD scenario:** Modifying tested code - run existing tests first.

**Spec:** doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md § "Extension" L104, § "Errors and edge cases" L136, § "Tests" L147, § "Out of scope" L162-L163, § "Out of scope" L168

**Files:**
- Modify: `extensions/phase-tracker.ts:251-258`
- Modify: `extensions/phase-tracker.test.ts:1559-1571`
- Test: `extensions/phase-tracker.test.ts`

**Tests:**
- `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts`
- baseline: 2eb4429b pass
- via: `fixRoundCapBlockReason`

Decision: Test through the existing blocked sixth-wave harness rather than exporting a private helper; phase-tracker.test.ts:1559-1571 receives the reason. The loader is CI's loader at scripts/ci.mjs:425-437.

- [ ] **Step 1: Run existing tests.** Run the Tests command before editing; preserve cap/grant assertions.
- [ ] **Step 2: Add red assertions.** In the default-five-waves test, require `Start the escalation message with the line: gauntlet: gate=verification-before-completion/step-6`, require the prefix `Conformance fix loop: 5 fix round(s) used against a cap of 5`, and reject a marker-first reason. Run the Tests command; the missing nudge assertion fails.
- [ ] **Step 3: Append the nudge.** Add that exact sentence to fixRoundCapBlockReason without changing existing counts, reason text, grant instruction or settings guidance. Emit no marker or UI event and add no settlement hook.
- [ ] **Step 4: Run green and syntax checks.** Run the Tests command, `node --experimental-strip-types --check extensions/phase-tracker.ts`, and `node --experimental-strip-types --check extensions/phase-tracker.test.ts`; expect pass.
- [ ] **Step 5: Commit.** Run `git add extensions/phase-tracker.ts extensions/phase-tracker.test.ts` and `git commit -m "Name the conformance escalation marker in cap nudges (#92)"`.

Boundary: `used`/`cap` remain in the reason at `extensions/phase-tracker.ts:251`; the caller quotes it at `fix-wave.md:24` and `post-selection-loop.md:74` under `gauntlet: gate=gatekeep-pr/obstacle`. `conformance-check.md` owns `gauntlet: gate=verification-before-completion/step-6` even without rejected dispatch input (`extensions/phase-tracker.ts:697`); Task 5 edits that instruction. Add no `agent_settled` hook, `extension_ui_request`, `done`/`stuck` verification report, or ticket/PR body marker.

## Wave 2 - Shared presentation grammar

Depends on Wave 1: the fixture-backed lint defines placement without changing render owners.

### Task 3: Define the four-kind first-line rule beside numeric menu layout

**TDD scenario:** New instruction behavior - deterministic fixtures first.

**Spec:** doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md § "Acceptance criteria" L40, § "The first-line rule (owner: `skills/brainstorming/reference/menu-layout.md`)" L57-L68, § "Errors and edge cases" L130-L133, § "Errors and edge cases" L137, § "Out of scope" L161, § "Out of scope" L166

**Files:**
- Modify: `skills/brainstorming/reference/menu-layout.md:1-41`
- Test: `scripts/gate-contract-lint.test.mjs`

**Tests:**
- `node --test scripts/gate-contract-lint.test.mjs`
- baseline: 2eb4429b skipped - scripts/gate-contract-lint.test.mjs created by this task
- via: `scripts/gate-contract-lint.mjs`

Decision: Use comma-separated outcome tokens without spaces - amended Design L66 resolves the charset AC as written. Keep menu-layout's numeric reply mapping unchanged.

- [ ] **Step 1: Run rule fixtures.** Run the Tests command and inspect missing-kind and missing-charset tests before editing the owner.
- [ ] **Step 2: Add the four grammar rows.** State `gauntlet: gate=<skill>/<id>( recommended=<token>)?`, `gauntlet: question`, `gauntlet: done <outcome>`, `gauntlet: stuck <reason>`. Require lowercase marker, column zero, first line of the whole message. Define skill/id over `[A-Za-z0-9.-]+`, owning directory and kebab-case step/section; outcome is comma-separated bare or key=value tokens with no spaces, reason free text.
- [ ] **Step 3: State settlement/precedence.** A turn any proper reply advances is gate/question, never terminal. Put the line before premise corrections, summaries and mandatory prose, including `The framing holds: ...`. Mark a combined batch/menu once with the parent; omit ordinary answers and automatic verify-to-finish handoffs. Separate terminal and next-skill turns retain their own kinds.
- [ ] **Step 4: Preserve reply authority.** Include recommended only for the displayed tagged row's number; omit for untagged and item-letter menus. Row text, not marker metadata, defines replies. Add no `picks=`. Preserve Exposure, Permitted layouts and Reply mapping bytes.
- [ ] **Step 5: Validate and commit.** Run the Tests command and `node scripts/skill-size-lint.mjs`; review forge-skill style. Run `git add skills/brainstorming/reference/menu-layout.md` and `git commit -m "Define the gauntlet first-line presentation rule (#92)"`.

Grammar examples and precedence: `recommended=` follows the row tagged `[recommended]`, never the per-item `Recommended: <letter>` at `amendment-surface.md:114-137` / `disposition-protocol.md:14-31`. Question-format `A)` / `Recommendation:` survives. `<skill>` is the directory under `skills/`; examples of `<id>` are `step-4`, `user-review-gate`, `obstacle`, `verdict-menu`; `<outcome>` uses `key=value`; `<reason>` is free text. Do not confuse `/` or `/gauntlet:<skill>` with the marker. Put framing at `SKILL.md:108-113` after the line. Intermediate `## Closure / conformance`, `/skill:finishing-a-development-branch`, `loop-implementation/SKILL.md ## After the loop`, and `subagent-driven-development/SKILL.md ## Continuous Execution` do not emit terminals. Combined parents use `gauntlet: gate=gatekeep-pr/batch-summary` or `gauntlet: gate=finishing-a-development-branch/step-4`; a later `/skill:release` turn is separate. `menu-layout.md` is the reverse-scan exception for grammar examples. All citing files from `doc/gate-contract.md` use resolving relative links; Tasks 4-7 own those edits. Do not mark invented gates.

## Wave 3 - Apply the grammar at rendering owners

Depends on Waves 1-2. Tasks 4-7 own disjoint source and eval target directories. Tests use isolated fixtures; model runs use target-local caches/reports and each task's isolated eval checkout. Each temporary constants override is checkout-local and restored before patch capture; no shared `eval/lib/models.mjs` edit, service or port is introduced.

### Task 4: Mark brainstorm, plan, and workspace questions and approval gates

**TDD scenario:** New instruction behavior - failing first-line eval facts before renderer edits.

**Spec:** doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md § "Acceptance criteria" L40, § "Acceptance criteria" L44, § "The contract (owner: `doc/gate-contract.md`, new)" L75-L76, § "The contract (owner: `doc/gate-contract.md`, new)" L81, § "Templates" L100, § "Errors and edge cases" L131, § "Errors and edge cases" L133, § "Tests" L148, § "Out of scope" L164, § "Out of scope" L166

**Files:**
- Modify: `skills/brainstorming/SKILL.md:93-166`
- Modify: `skills/brainstorming/reference/spec-finalization.md:109-229`
- Modify: `skills/brainstorming/reference/amendment-surface.md:114-170`
- Modify: `skills/brainstorming/reference/ticket-acceptance.md:1-82`
- Modify: `skills/brainstorming/reference/pr-subject.md:26-32`
- Modify: `skills/writing-plans/SKILL.md:78-145`
- Modify: `skills/using-git-worktrees/SKILL.md:171-214`
- Create: `eval/brainstorming/samples/gate-line-first/case.md`
- Create: `eval/brainstorming/samples/gate-line-first/expected.md`
- Modify: `eval/brainstorming/intent.md`
- Modify: `eval/brainstorming/report.md`
- Modify: `eval/brainstorming/results/**/*.json`
- Create: `eval/writing-plans/samples/gate-line-first/case.md`
- Create: `eval/writing-plans/samples/gate-line-first/expected.md`
- Modify: `eval/writing-plans/intent.md`
- Modify: `eval/writing-plans/report.md`
- Modify: `eval/writing-plans/results/**/*.json`
- Create: `eval/using-git-worktrees/samples/gate-line-first/case.md`
- Create: `eval/using-git-worktrees/samples/gate-line-first/expected.md`
- Modify: `eval/using-git-worktrees/intent.md`
- Modify: `eval/using-git-worktrees/report.md`
- Modify: `eval/using-git-worktrees/results/**/*.json`
- Test: `scripts/gate-contract-lint.test.mjs`

**Tests:**
- `node --test scripts/gate-contract-lint.test.mjs`
- baseline: 2eb4429b skipped - scripts/gate-contract-lint.test.mjs created by this task
- via: `scripts/gate-contract-lint.mjs`

Decision: Cite cut-question at `reference/ticket-acceptance.md # Ticket Handling`, the actual `**Cut question.**` paragraph; leave the fenced `## Acceptance criteria` example intact. Keep three planning ids at one shared `## Author the plan` site with one common first-line instruction - amended spec L75/L76/L110.

- [ ] **Step 1: Add the brainstorm sample.** Input a verified premise correction followed by the framing question. Require `matches /^gauntlet: question(?:\r?\n|$)/` and retain correction, options and Recommendation after it. Load the existing ### 3 slice and shared grammar through sample bundle directives. Before any eval invocation apply the temporary checkout-local option A constants: sole replay and judge `github-copilot/gpt-6.1-sol`, thinking `medium`; save the original file outside the repo.
- [ ] **Step 2: Add plan/workspace samples and run red.** Adapt the existing parent-offers-fix-first-narrow-amend sample to a synthetic failing task using the observed input filename `tests/timeout.test.ts` consistently in the Open Questions command, task Tests command and expected filename fact. Require question first and the same three options; do not broaden or remove any other fact. Give worktrees observed detached HEAD; require question first and existing branch/base choice. Run `node eval/run.mjs brainstorming gate-line-first`, `node eval/run.mjs writing-plans gate-line-first`, and `node eval/run.mjs using-git-worktrees gate-line-first` before instruction edits; confirm new facts fail. Refresh reusable legacy judgments lacking the authorized judge once before the final renderer edits; the existing command is sample-scoped `--refresh-judgments`.
- [ ] **Step 3: Mark brainstorming questions.** Add question-first sentences and resolving relative menu-layout links at ### 3, ### 6, the Cut question paragraph under # Ticket Handling and Relatedness before provisioning. Require `gauntlet: question` alone at column 0 on the first physical line, then a newline before correction or other prose. Prefix both ### 3 Good blocks with question; keep their remaining text. Require the framing/premise sentence after the marker. Preserve disposition and round-approval authority.
- [ ] **Step 4: Mark spec approval/amendments.** Prefix User Review Gate with `gauntlet: gate=brainstorming/user-review-gate` before the verbatim summary. Prefix Human batch with `gauntlet: gate=brainstorming/human-batch`, no recommended field. Add local links and preserve every grant, funding suffix, audit line and reply rule.
- [ ] **Step 5: Mark planning branches.** Add one `Start the message with \`gauntlet: question\`.` sentence governing baseline failure, dirty-source and substantive-contract branches in Author the plan step 6. State that the literal occupies the entire first physical line and a newline separates it from all following prose. Preserve restoration options and second-verbatim-FAIL escalation; the three inventory ids share the sentence and heading.
- [ ] **Step 6: Mark workspace questions.** Add question-first sentences and links at dirty-base Step 3 and Detached HEAD. Require the exact standalone marker, then a newline and the existing ask. Keep clean-path automatic continuation and workspace safety. A nested workspace question remains that owner's question, not a caller's gate.
- [ ] **Step 7: Run green and full targets.** Run the Tests command and `node eval/run.mjs brainstorming`, `node eval/run.mjs writing-plans`, `node eval/run.mjs using-git-worktrees` under the same option A constants; the full runs include the changed gate-line-first cells' green checks. Inspect the authorized model's new first-line fact, actual judge provenance and all regression results. Require every new marker fact to show `after: holds`; retain reviewed non-marker regressions and inconclusive results as explicit open concerns in truthful reports/results and list them at the finish gate, without claiming a full model eval suite pass or broadening behavior repairs. The header's deterministic verification must pass. An interrupted full run is incomplete, not passed: retain its partial report; completing the observation without instruction changes is allowed, reusing successful new-marker cells instead of replaying them. A reused current planning judgment needing the authorized judge can use `node eval/run.mjs writing-plans gate-line-first --refresh-judgments` once; preserve its audit and inspect report scope after the final full command. Surface failures instead of retrying them until pass.
- [ ] **Step 8: Style and commit.** Restore the original `eval/lib/models.mjs` bytes before patch capture and verify it is absent from the patch. Run `node scripts/skill-size-lint.mjs` and `node scripts/model-literal-lint.mjs`; inspect links/body preservation. Stage declared files and commit with `git commit -m "Prefix design and planning decision turns (#92)"`; state behavior-change, the three evaluated targets and the temporary option A model choice in its body.

Inventory keys/site spellings: `brainstorming/understand-the-idea` at `SKILL.md ### 3. Understand the idea`; `brainstorming/present-the-design` at `SKILL.md ### 6. Present the design in two rounds`; `brainstorming/cut-question`; `brainstorming/relatedness-before-provisioning` at `reference/pr-subject.md ## Relatedness before provisioning`; `brainstorming/user-review-gate` at `reference/spec-finalization.md ## User Review Gate` (`1 - ` rows); `brainstorming/human-batch` at `reference/amendment-surface.md ## 4. Human batch - one menu`. `SKILL.md ## Author the plan` owns `writing-plans/step-6-baseline-failure`, `writing-plans/step-6-baseline-dirty`, `writing-plans/step-6-contract-questions`, including second `FAIL`. Worktrees owns `using-git-worktrees/step-3` at `SKILL.md ## Step 3 - Verify Clean Base`, and `using-git-worktrees/detached-head` at `SKILL.md ## Detached HEAD`.

Citation/format contract: apply `skills/brainstorming/reference/menu-layout.md` and its `[A-Za-z0-9.-]+` rule via relative links, recorded in `doc/gate-contract.md`. Retain `Recommendation:` and omit `recommended=` on untagged/item-letter gates. Templates' citation inventory names `spec-finalization.md`, `amendment-surface.md`, `ticket-acceptance.md`, `pr-subject.md`, `writing-plans/SKILL.md`, `subagent-driven-development/stop-note.md`, `loop-implementation/SKILL.md`, `verification-before-completion/reference/conformance-check.md`, `using-git-worktrees/SKILL.md`, `gatekeep-pr/reference/{sync,batch}.md`, `gauntlet-resume/reference/reconstruction.md`, `gauntlet-handoff/SKILL.md`; this task owns the seven declared files only. Prefix `Good:` in `brainstorming/SKILL.md`. Follow `Start the message with` placement, not explanatory quotation alone; the lint also covers the `initial` fence versus prose in `menus.md`. Preserve runner/retry policy and use only the temporary option A override; each new `question` fact must show `after: holds`, not `pre-existing` (`eval/lib/judge.mjs:24`, `eval/run.mjs:367-370`); commit the corresponding `eval/<target>/report.md`. Do not substitute a `done <outcome>` check for these waiting turns.

### Task 5: Mark implementation stalls, conformance escalation, and finish outcomes

**TDD scenario:** New instruction behavior - failing first-line eval facts before renderer edits.

**Spec:** doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md § "Acceptance criteria" L40, § "Acceptance criteria" L44, § "The contract (owner: `doc/gate-contract.md`, new)" L77-L80, § "The contract (owner: `doc/gate-contract.md`, new)" L89, § "Templates" L100, § "Extension" L104, § "Errors and edge cases" L130, § "Errors and edge cases" L132-L133, § "Tests" L148, § "Out of scope" L164, § "Out of scope" L166, § "Out of scope" L166-L168

**Files:**
- Modify: `skills/subagent-driven-development/stop-note.md:7-70`
- Modify: `skills/loop-implementation/SKILL.md:109-136`
- Modify: `skills/verification-before-completion/reference/conformance-check.md:127-209`
- Modify: `skills/finishing-a-development-branch/SKILL.md:64-458`
- Modify: `skills/finishing-a-development-branch/reference/disposition-protocol.md:1-31`
- Create: `eval/subagent-driven-development/samples/gate-line-first/case.md`
- Create: `eval/subagent-driven-development/samples/gate-line-first/expected.md`
- Modify: `eval/subagent-driven-development/intent.md`
- Modify: `eval/subagent-driven-development/report.md`
- Modify: `eval/subagent-driven-development/results/**/*.json`
- Create: `eval/loop-implementation/samples/gate-line-first/case.md`
- Create: `eval/loop-implementation/samples/gate-line-first/expected.md`
- Modify: `eval/loop-implementation/intent.md`
- Modify: `eval/loop-implementation/report.md`
- Modify: `eval/loop-implementation/results/**/*.json`
- Create: `eval/conformance-check/samples/gate-line-first/case.md`
- Create: `eval/conformance-check/samples/gate-line-first/expected.md`
- Modify: `eval/conformance-check/intent.md`
- Modify: `eval/conformance-check/report.md`
- Modify: `eval/conformance-check/results/**/*.json`
- Create: `eval/finishing-a-development-branch/samples/gate-line-first/case.md`
- Create: `eval/finishing-a-development-branch/samples/gate-line-first/expected.md`
- Modify: `eval/finishing-a-development-branch/intent.md`
- Modify: `eval/finishing-a-development-branch/report.md`
- Modify: `eval/finishing-a-development-branch/results/**/*.json`
- Test: `scripts/gate-contract-lint.test.mjs`

**Tests:**
- `node --test scripts/gate-contract-lint.test.mjs`
- baseline: 2eb4429b skipped - scripts/gate-contract-lint.test.mjs created by this task
- via: `scripts/gate-contract-lint.mjs`

Decision: Conformance step 6 at source lines 181-194 accepts grant_fix_rounds, so proactive and rejected-dispatch escalation are gates. Task 2 owns only the runtime nudge. Finish Step 4 source uses N. rows; preserve those bytes and record the layout in Task 8, as specified at L80.

Decision: Mark both carried-open render sites in place and flag extraction as a follow-up, not an implementation action - amended spec L80/L167 explicitly settles the oversized-file exception. Keep the two loop question ids under their shared heading and one first-line instruction.

Decision: The `tests/timeout.test.ts` fixture correction at spec Tests L148 belongs to Task 4's writing-plans sample, not these four targets; this task preserves all their other facts and strengthens only the exact standalone marker instruction.

- [ ] **Step 1: Add stall samples.** SDD input exhausts documented fact lookups; loop input has a dirty return needing discard authorization. Require `gauntlet: question` first, actionable choices and preserved state, not done/stuck. Before evals apply the temporary checkout-local option A constants: sole replay and judge `github-copilot/gpt-6.1-sol`, thinking `medium`; save original bytes outside the repo. Run `node eval/run.mjs subagent-driven-development gate-line-first` and `node eval/run.mjs loop-implementation gate-line-first` before instruction edits.
- [ ] **Step 2: Add escalation/finish samples.** Conformance reaches its positive cap with an open gap and no guard error; load its reference and require `matches /^gauntlet: gate=verification-before-completion\/step-6(?:\r?\n|$)/` plus a funding ask. Finish reaches normal Step 4 with a clean closure digest; require `matches /^gauntlet: gate=finishing-a-development-branch\/step-4(?:\r?\n|$)/`, full options, no recommended field, one marker. Run `node eval/run.mjs conformance-check gate-line-first` and `node eval/run.mjs finishing-a-development-branch gate-line-first` before editing. Preserve these regexes and all other facts. Refresh reusable legacy judgments lacking the authorized judge once before final renderer edits using the existing sample-scoped mode.
- [ ] **Step 3: Mark stalls.** Prefix stop-note Template and Example with question and add a link; preserve Problem/Searched/options. Add one question-first sentence governing loop Human stop and discard authorization. At both owners require the exact `gauntlet: question` literal alone at column 0 on the first physical line, then a newline before all other text. Keep attempts, cap, funding and discard authorization unchanged.
- [ ] **Step 4: Mark proactive cap escalation.** Add `Start the message with \`gauntlet: gate=verification-before-completion/step-6\`.` at Fix loop step 6, including Convergence's delegated cap exhaustion. Preserve grant_fix_rounds and non-completion; link menu-layout. Add no done/stuck to the intermediate closure report.
- [ ] **Step 5: Mark finish gates.** Prefix all three Step 4 fences with the step-4 literal and no recommended field. Prefix both the canonical carried-open template and the representative Step 3.5 render with `gauntlet: gate=finishing-a-development-branch/carried-open`; put item 1 immediately after the marker instead of claiming item 1 opens the message. Mark close-absorbed with `gauntlet: gate=finishing-a-development-branch/pr-subject-row-1`, typed discard with the exact standalone question marker and a newline before the ask. Preserve bodies, approvals and modifiers; keep extraction out of the diff.
- [ ] **Step 6: Mark finish reports.** Add Start-the-message sentences at option/report owners for `gauntlet: done pr-created`, `gauntlet: done merged`, `gauntlet: done kept`, `gauntlet: done discarded`, `gauntlet: done pushed`; failed executed choices use `gauntlet: stuck` plus reason. Delay pushed until close-members is answered or none qualifies. Keep strip/seal, cleanup and ship-state behavior.
- [ ] **Step 7: Run green/full targets.** Run the Tests command, `node eval/run.mjs subagent-driven-development`, `node eval/run.mjs loop-implementation`, `node eval/run.mjs conformance-check`, and `node eval/run.mjs finishing-a-development-branch` under the option A constants; these include the changed gate-line-first cells' green checks. A reused current gate sample needing the authorized judge can use `node eval/run.mjs conformance-check gate-line-first --refresh-judgments` once; use the existing sample-scoped mode for other reused judgments lacking that judge's evidence. Inspect report scope after the final full command. Inspect the authorized model's new facts, including proactive funding without guard input, and actual judge provenance. Require every new marker fact to show `after: holds`; retain reviewed non-marker regressions and inconclusive results as explicit open concerns in truthful reports/results and list them at the finish gate. Do not claim a full model eval suite pass, change unrelated facts, broaden behavior repairs or retry behavioral failures until pass. The header's deterministic verification must pass. An interrupted full run is incomplete, not passed: retain its partial report; completing the observation without instruction changes is allowed, reusing successful new-marker cells instead of replaying them.
- [ ] **Step 8: Style and commit.** Restore original `eval/lib/models.mjs` bytes before patch capture and verify the file is absent from the patch. Run `node scripts/skill-size-lint.mjs` and `node scripts/model-literal-lint.mjs`. Stage declared files and commit with `git commit -m "Classify implementation and finishing turns (#92)"`; record behavior-change, four evaluated targets and temporary option A model choice in its body. Flag the oversized finishing concern in the commit body without creating a tracker item.

Owner/site contract: `subagent-driven-development/stop-note` uses `skills/subagent-driven-development/stop-note.md ## Template`; `loop-implementation/human-stop` and `loop-implementation/discard-authorization` use `SKILL.md ## Human stop`. `verification-before-completion/step-6` uses `reference/conformance-check.md ### Fix loop - SDD wave-loop mirror, per round` and `grant_fix_rounds`. Finish's `finishing-a-development-branch/step-4` uses `SKILL.md ### Step 4: Present Options`, with `fix minors` as an extra reply. `finishing-a-development-branch/carried-open` has rows for `reference/disposition-protocol.md # Carried-open disposition protocol` and `SKILL.md ### Step 3.5: Closure / Conformance Disposition Gate` (`SKILL.md:90`). `finishing-a-development-branch/pr-subject-row-1` is the `Close the absorbed PRs with these comments?` gate at `SKILL.md #### PR-subject row 1: Push to the PR branch`; `finishing-a-development-branch/option-5` is the typed `discard` ask at `SKILL.md #### Option 5: Discard`. Preserve `1 - ` where actually present; Step 4's actual layout is N. Report sites live in `SKILL.md` and `## Completion`. Preserve a later `/skill:release` turn as separate from `done`.

Citation/format contract: apply `skills/brainstorming/reference/menu-layout.md`, `[A-Za-z0-9.-]+`, and the `doc/gate-contract.md` inventory. Add `Start the message with` rules or fence-first literals. Templates' citation inventory names `spec-finalization.md`, `amendment-surface.md`, `ticket-acceptance.md`, `pr-subject.md`, `writing-plans/SKILL.md`, `subagent-driven-development/stop-note.md`, `loop-implementation/SKILL.md`, `verification-before-completion/reference/conformance-check.md`, `using-git-worktrees/SKILL.md`, `gatekeep-pr/reference/{sync,batch}.md`, `gauntlet-resume/reference/reconstruction.md`, `gauntlet-handoff/SKILL.md`; this task owns only its declared files, not `brainstorming/SKILL.md`'s `Good:` examples or `menus.md`'s `initial` fence. Preserve `Recommendation:` and omit `recommended=` when no row is tagged. Task 2's `fixRoundCapBlockReason` preserves `used`/`cap` at `extensions/phase-tracker.ts:251` and adds `Start the escalation message with the line: gauntlet: gate=verification-before-completion/step-6`; its quotes at `fix-wave.md:24` and `post-selection-loop.md:74` stay inside `gauntlet: gate=gatekeep-pr/obstacle`, while proactive instruction applies independently of `extensions/phase-tracker.ts:697`. Each `question` / gate fact must show `after: holds`, never rely on `pre-existing` (`eval/lib/judge.mjs:24`, `eval/run.mjs:367-370`), and commit `eval/<target>/report.md`. The `done <outcome>` form is for terminal reports only.

### Task 6: Mark PR, bug, delivery, and ticket workflow settlement

**TDD scenario:** New instruction behavior - failing first-line eval facts before renderer edits.

**Spec:** doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md § "Acceptance criteria" L40, § "Acceptance criteria" L44, § "The contract (owner: `doc/gate-contract.md`, new)" L82-L85, § "The contract (owner: `doc/gate-contract.md`, new)" L90-L93, § "Templates" L100, § "Extension" L104, § "Errors and edge cases" L130, § "Errors and edge cases" L132-L133, § "Errors and edge cases" L135-L136, § "Tests" L148, § "Tests" L148-L149, § "Out of scope" L162, § "Out of scope" L164, § "Out of scope" L166

**Files:**
- Modify: `skills/gatekeep-pr/reference/menus.md:1-112`
- Modify: `skills/gatekeep-pr/reference/sync.md:11-91`
- Modify: `skills/gatekeep-pr/reference/batch.md:17-125`
- Modify: `skills/gatekeep-pr/reference/post-selection-loop.md:45-238`
- Modify: `skills/gatekeep-pr/reference/cleanup.md:27-49`
- Modify: `skills/chase-bug/SKILL.md:155-381`
- Modify: `skills/check-delivery/SKILL.md:7-310`
- Modify: `skills/shape-ticket/SKILL.md:61-180`
- Modify: `skills/shape-ticket/reference/repo-audit.md:122-188`
- Create: `eval/gatekeep-pr/samples/gate-line-first/case.md`
- Create: `eval/gatekeep-pr/samples/gate-line-first/expected.md`
- Modify: `eval/gatekeep-pr/intent.md`
- Modify: `eval/gatekeep-pr/report.md`
- Modify: `eval/gatekeep-pr/results/**/*.json`
- Create: `eval/chase-bug/samples/gate-line-first/case.md`
- Create: `eval/chase-bug/samples/gate-line-first/expected.md`
- Modify: `eval/chase-bug/intent.md`
- Modify: `eval/chase-bug/report.md`
- Modify: `eval/chase-bug/results/**/*.json`
- Create: `eval/check-delivery/samples/gate-line-first/case.md`
- Create: `eval/check-delivery/samples/gate-line-first/expected.md`
- Modify: `eval/check-delivery/intent.md`
- Modify: `eval/check-delivery/report.md`
- Modify: `eval/check-delivery/results/**/*.json`
- Create: `eval/shape-ticket/samples/gate-line-first/case.md`
- Create: `eval/shape-ticket/samples/gate-line-first/expected.md`
- Modify: `eval/shape-ticket/intent.md`
- Modify: `eval/shape-ticket/report.md`
- Modify: `eval/shape-ticket/results/**/*.json`
- Test: `scripts/gate-contract-lint.test.mjs`

**Tests:**
- `node --test scripts/gate-contract-lint.test.mjs`
- baseline: 2eb4429b skipped - scripts/gate-contract-lint.test.mjs created by this task
- via: `scripts/gate-contract-lint.mjs`

Decision: Keep batch.md's REPORT/CONFLICTING/FAILED/STOPPED child closing lines: they are tool handoffs, not user-facing settlement. Only the parent marks the batch round. For fix-wave assertion failures, put the terminal rendering rule in the already-listed post-selection-loop owner that calls the recovery; do not add a duplicate instruction file.

Decision: Join the ordered shape-ticket counter list with commas for both done and stuck, with no spaces - the amended terminal rule says stuck uses the same keys and order, while the outcome grammar fixes serialization.

Decision: The `tests/timeout.test.ts` fixture correction at spec Tests L148 belongs to Task 4's writing-plans sample, not these four targets; this task preserves all their other facts and strengthens only the exact standalone marker instruction.

- [ ] **Step 1: Add PR/bug samples.** Gatekeep receives an obstacle quoting the cap nudge; require gatekeep-pr/obstacle first, stop tagged with matching recommended number, no second standalone marker. Chase-bug receives a real-bug verdict with response target; require chase-bug/verdict-menu first and existing row availability. Apply the temporary checkout-local option A constants before evals: sole replay and judge `github-copilot/gpt-6.1-sol`, thinking `medium`; save original bytes outside the repo. Run `node eval/run.mjs gatekeep-pr gate-line-first` and `node eval/run.mjs chase-bug gate-line-first` before edits.
- [ ] **Step 2: Add delivery/ticket samples.** Delivery reaches exact-write confirmation; require check-delivery/confirmation-gate first and unchanged consent. Shape-ticket has completed written=2, declined=1, stopped=1, unfetched=1, close failed=1 with no pending question. Require `matches /^gauntlet: stuck written=2,declined=1,stopped=1,unfetched=1,close-failed=1(?:\r?\n|$)/` and unchanged per-ref lines. Judge the distinction between an active hard-stop question and ended stopped ticket. Run `node eval/run.mjs check-delivery gate-line-first` and `node eval/run.mjs shape-ticket gate-line-first` before edits. Keep required regexes and all unrelated expected facts unchanged. Refresh reusable legacy judgments lacking the authorized judge once before final renderer edits using the existing sample-scoped mode.
- [ ] **Step 3: Mark ten PR menu owners.** Assign initial, final, assess-terminal, obstacle, contract-exception, own-merge, merge-queued, approved, closed-pr, batch-summary their gatekeep-pr ids. Prefix initial's fence; add Start-the-message sentences to the others. Tie recommended to the rendered tagged row. Combined batch/child-menu output uses only `gauntlet: gate=gatekeep-pr/batch-summary` before the summary.
- [ ] **Step 4: Mark PR confirmations.** Preconditions uses gatekeep-pr/sync-preconditions for stop-only menu; Other-author confirmation and Provision serially use `Start the message with \`gauntlet: question\`.`. Require the literal alone at column 0 on the first physical line, then a newline before the existing ask. Add local links and preserve yes/no authority and child private result contracts.
- [ ] **Step 5: Mark PR endings.** Teardown maps terminal-template stop to done approved/merged/closed-pr/final/merge-queued. Non-final stop uses stuck with obstacle text or stopped-at-template reason. Cover failed recovery assertions at Sync Failure path and its loop caller. A quoted runtime nudge stays body text under the obstacle gate marker.
- [ ] **Step 6: Mark bug workflow.** Prefix real/negative verdict variants with chase-bug/verdict-menu and response variants with chase-bug/response-to-origin. Terminals use done responded/summary/draft. Automatic brainstorming/shape-ticket/hotfix handoffs are unmarked intermediate output; preserve eligibility and actual recommended row.
- [ ] **Step 7: Mark delivery workflow.** Put the confirmation marker before evidence and exact payload for success and failure-comment asks. Add done delivered/already-recorded/manual and stuck for STOP/final failure reports. Preserve Delivered: as first line of the tracker payload; markers never enter tracker text.
- [ ] **Step 8: Mark ticket workflow.** Use the exact standalone `gauntlet: question` line followed by a newline at Interactive questioning and recoverable integrity hard stop; shape-ticket/step-8 at repo-audit's exact-diff owner before source gaps and Title. At end-of-run require counter order `written closed declined dropped no-op stopped unfetched close-failed close-by-hand`, omit zeros, join emitted key=value pairs with commas and no spaces, use stuck iff close-failed/close-by-hand/unfetched is nonzero, otherwise done. Keep per-ref lines and exact-diff authority; no batch line while a hard-stop ask awaits values.
- [ ] **Step 9: Run green/full targets.** Run the Tests command, `node eval/run.mjs gatekeep-pr`, `node eval/run.mjs chase-bug`, `node eval/run.mjs check-delivery`, and `node eval/run.mjs shape-ticket` with option A constants still active; these include the changed gate-line-first cells' green checks. A reused current gate sample needing the authorized judge can use `node eval/run.mjs gatekeep-pr gate-line-first --refresh-judgments` once; use the existing sample-scoped mode for other reused judgments lacking that judge's evidence. Inspect report scope after the final full command. Inspect the authorized model's new fact, actual judge provenance and mixed counters, not only process exit. Require every new marker fact to show `after: holds`; retain reviewed non-marker regressions and inconclusive results as explicit open concerns in truthful reports/results and list them at the finish gate, never as passing results. Do not claim a full model eval suite pass, broaden behavior repairs, change other facts or intent scope, or retry failures until pass. The header's deterministic verification must pass. An interrupted full run is incomplete, not passed: retain its partial report; completing the observation without instruction changes is allowed, reusing successful new-marker cells instead of replaying them.
- [ ] **Step 10: Style and commit.** Restore original `eval/lib/models.mjs` bytes before patch capture and verify the file is absent from the patch. Run `node scripts/skill-size-lint.mjs` and `node scripts/model-literal-lint.mjs`. Stage declared files and commit with `git commit -m "Mark PR and ticket workflow gates and outcomes (#92)"`; record behavior-change, evaluated targets and temporary option A model choice in its body.

Owner/site contract: `N.` rows at every waiting `##` section in `reference/menus.md`: `initial`, `final`, `assess-terminal`, `obstacle`, `contract-exception`, `own-merge`, `merge-queued`, `approved`, `closed-pr`, `batch-summary`. `gatekeep-pr/sync-preconditions` uses `reference/sync.md ## Preconditions`, the `stop` row and `show evidence` hint. `gatekeep-pr/other-author-confirmation` uses `reference/sync.md ## Other-author confirmation`; `gatekeep-pr/provision-serially` uses `reference/batch.md ## Provision serially`. `chase-bug/verdict-menu` / `chase-bug/response-to-origin` use `SKILL.md ### 4` / `### 5`; `check-delivery/confirmation-gate` uses `SKILL.md ## Confirmation gate and the batched write`. `shape-ticket/step-3` uses `SKILL.md ### 3 - Interactive questioning`; `shape-ticket/step-8` renders only in `reference/repo-audit.md ## Complete the batch and present gates`, called by `SKILL.md ### 8 - Confirmation gate`; `shape-ticket/hard-stop` uses `SKILL.md ## AC integrity gate`.

Terminal mapping: `reference/post-selection-loop.md ### Teardown` reports `done approved`, `done merged`, `done closed-pr`, `done final`, `done merge-queued`. `cleanup.md ## Non-final stop` uses the obstacle's `stuck - ` text. Include assertion failures at `fix-wave.md:20`, `post-selection-loop.md:70-71` and `sync.md ## Failure path`; never mark `report.md ## Verdict` as terminal. Shape's singleton forms are `done written=1` and `done stopped=1`. Failure contributors are `close failed`, `close by hand`, `unfetched`; `declined`/`dropped` are human decisions, `stopped` is ended unrecovered integrity work, while an active `hard-stop` remains `gauntlet: question`. Delivery maps `done delivered`, `done already-recorded`, `done manual`; mark all `STOP` branches in `## Quick reference` and failure endings at `SKILL.md ## Confirmation gate and the batched write`. Bug endings `done responded`, `done summary` (`Finish with rendered summary`), `done draft` belong to `SKILL.md ### 5. Response to origin (human gate 2)`; no terminal on handoff.

Citation/format contract: apply `skills/brainstorming/reference/menu-layout.md`, `[A-Za-z0-9.-]+`, and `doc/gate-contract.md`. Preserve `Recommendation:` and `recommended=` row matching. Templates' citation inventory names `spec-finalization.md`, `amendment-surface.md`, `ticket-acceptance.md`, `pr-subject.md`, `writing-plans/SKILL.md`, `subagent-driven-development/stop-note.md`, `loop-implementation/SKILL.md`, `verification-before-completion/reference/conformance-check.md`, `using-git-worktrees/SKILL.md`, `gatekeep-pr/reference/{sync,batch}.md`, `gauntlet-resume/reference/reconstruction.md`, `gauntlet-handoff/SKILL.md`; this task owns its declared files, not `brainstorming/SKILL.md`'s `Good:` blocks. Use `Start the message with` sentences, including prose sections of `menus.md`. The extension `fixRoundCapBlockReason` at `extensions/phase-tracker.ts:251` keeps `used`/`cap`, adding `Start the escalation message with the line: gauntlet: gate=verification-before-completion/step-6`; `fix-wave.md:24` / `post-selection-loop.md:74` quote it under `gauntlet: gate=gatekeep-pr/obstacle`. `conformance-check.md` owns the independent proactive gate, not the runtime branch at `extensions/phase-tracker.ts:697`. A later `/skill:release` turn is separate; do not add an `agent_settled` hook or body markers. Each gate/`question`/`done <outcome>` fact must show `after: holds`, not rely on `pre-existing` (`eval/lib/judge.mjs:24`, `eval/run.mjs:367-370`), with `eval/<target>/report.md` committed.

### Task 7: Mark resume and handoff asks without changing brief state

**TDD scenario:** New instruction behavior - failing first-line eval facts before renderer edits.

**Spec:** doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md § "Acceptance criteria" L40, § "Acceptance criteria" L44, § "The contract (owner: `doc/gate-contract.md`, new)" L86-L87, § "The contract (owner: `doc/gate-contract.md`, new)" L94-L95, § "Templates" L100, § "Errors and edge cases" L132, § "Errors and edge cases" L134, § "Tests" L148, § "Out of scope" L164, § "Out of scope" L166

**Files:**
- Modify: `skills/gauntlet-resume/SKILL.md:38-178`
- Modify: `skills/gauntlet-resume/reference/reconstruction.md:66-140`
- Modify: `skills/gauntlet-handoff/SKILL.md:35-110`
- Create: `eval/gauntlet-resume/samples/gate-line-first/case.md`
- Create: `eval/gauntlet-resume/samples/gate-line-first/expected.md`
- Modify: `eval/gauntlet-resume/intent.md`
- Modify: `eval/gauntlet-resume/report.md`
- Modify: `eval/gauntlet-resume/results/**/*.json`
- Create: `eval/gauntlet-handoff/README.md`
- Create: `eval/gauntlet-handoff/target.json`
- Create: `eval/gauntlet-handoff/replay.md`
- Create: `eval/gauntlet-handoff/intent.md`
- Create: `eval/gauntlet-handoff/samples/gate-line-first/case.md`
- Create: `eval/gauntlet-handoff/samples/gate-line-first/expected.md`
- Create: `eval/gauntlet-handoff/results/gate-line-first/baseline.json`
- Create: `eval/gauntlet-handoff/results/gate-line-first/candidate.json`
- Create: `eval/gauntlet-handoff/report.md`
- Test: `scripts/gate-contract-lint.test.mjs`

**Tests:**
- `node --test scripts/gate-contract-lint.test.mjs`
- baseline: 2eb4429b skipped - scripts/gate-contract-lint.test.mjs created by this task
- via: `scripts/gate-contract-lint.mjs`

Decision: Create a text handoff target using the existing eval template shape (`eval/_template/README.md:5-14`), not a resume surrogate. Set kind=text, assembly=headed, wordCap=1000, skillFiles to `skills/gauntlet-handoff/SKILL.md` with body=true and `skills/brainstorming/reference/menu-layout.md`. Both files exist on the base; no new runner behavior is required. The full handoff body keeps its announcement/STOP precedence in scope for the first-line test.

Decision: The `tests/timeout.test.ts` fixture correction at spec Tests L148 belongs to Task 4's writing-plans sample, not the resume/handoff samples; this task preserves their other facts and strengthens only the exact standalone marker instruction.

- [ ] **Step 1: Add the resume sample and run red.** Supply a same-repository bare worktree with spec, no approval, no plan. Require `matches /^gauntlet: question(?:\r?\n|$)/`, existing approved-or-brainstorm ask and no pre-answer tracker mutation. Bundle reconstruction's Spec without plan slice because target.json currently includes Candidates/post-restore slices. Apply temporary checkout-local option A constants before evals: sole replay and judge `github-copilot/gpt-6.1-sol`, thinking `medium`; save original bytes outside the repo. Run `node eval/run.mjs gauntlet-resume gate-line-first` before edits.
- [ ] **Step 2: Add the handoff target/sample and run red.** Create the declared target files from the template shape; replay.md asks for the skill's next user-facing message from supplied observations with no tools. Supply a human handoff invocation without --key/--out, no run worktree, an observed detached HEAD and an already-read brief contract. Require `matches /^gauntlet: question(?:\r?\n|$)/`, an ask for key or output path, and no brief/tracker write. Document this scope in README and intent; bind for: to the runner's candidate assembly SHA. Run `node eval/run.mjs gauntlet-handoff --baseline-only`, then `node eval/run.mjs gauntlet-handoff gate-line-first`; confirm the new first-line fact fails before the marker edit. Preserve regexes and all other behavioral facts. Refresh reusable legacy judgments lacking the authorized judge once before final renderer edits using the existing sample-scoped mode.
- [ ] **Step 3: Mark discovery/reconstruction.** Prefix numbered brief discovery with gauntlet-resume/discovery. Add `Start the message with \`gauntlet: question\`.` at Spec without plan, Spec with ledger, Spec with plan and Dispatch's worktree:no offer. Require the exact literal alone at column 0 on the first physical line, then a newline before all other text. Add local links. Preserve ordering, one-candidate confirmation, cap boundaries and approvals.
- [ ] **Step 4: Mark resume failures.** Use stuck for no briefs, Arguments stop routes, Entry checks and ledger plan_check FAIL. No done for successful resume, no brief field, no approval inference; the next resumed skill owns its waiting turn.
- [ ] **Step 5: Mark handoff.** Sequence step 1 uses the exact standalone question marker and a newline before the key/out request, and stuck for mutually exclusive --out/--key. Step 7 uses done brief-written before path/invocation prose. Link menu-layout, leaving brief core/process-state grammar and cohort result strings unchanged. Put announcements after the marker on these settled messages.
- [ ] **Step 6: Run green/full targets.** Run the Tests command, `node eval/run.mjs gauntlet-resume`, and `node eval/run.mjs gauntlet-handoff` with option A constants still active; these include the changed gate-line-first cells' green checks. Reused current judgments lacking the authorized judge can use `node eval/run.mjs gauntlet-resume gate-line-first --refresh-judgments` and `node eval/run.mjs gauntlet-handoff gate-line-first --refresh-judgments` once when those samples need it. Apply that existing mode to reused legacy samples lacking the new judge's evidence, never stale replies. Inspect report scope after the final full command. Inspect new facts and actual judge provenance, and preserve restore invariants. Require every new marker fact to show `after: holds`; commit truthful reports and both arms' generated records, keeping the handoff target to one sample. Retain reviewed non-marker regressions and inconclusive results as explicit open concerns and list them at the finish gate; never claim a full model eval suite pass or broaden behavior repairs. The header's deterministic verification must pass. An interrupted full run is incomplete, not passed: retain its partial report; completing the observation without instruction changes is allowed, reusing successful new-marker cells instead of replaying them. Surface failures without suppressing or retrying them until pass.
- [ ] **Step 7: Style and commit.** Restore original `eval/lib/models.mjs` bytes before patch capture and verify it is absent from the patch. Run `node scripts/skill-size-lint.mjs` and `node scripts/model-literal-lint.mjs`. Stage declared files and commit with `git commit -m "Mark resume and handoff decision turns (#92)"`; record behavior-change, both evaluated targets and temporary option A model choice in its body.

Owner/site contract: `gauntlet-resume/discovery` uses `N.` rows in `SKILL.md ## Arguments`; `gauntlet-resume/spec-without-plan` uses `reference/reconstruction.md ## Spec without plan`; `gauntlet-resume/spec-with-ledger` uses `reference/reconstruction.md ## Spec with ledger`; `gauntlet-resume/spec-with-plan` uses `reference/reconstruction.md ## Spec with plan`; `gauntlet-resume/dispatch` uses `SKILL.md ## Dispatch` for the `/skill:brainstorming` offer on `worktree: no`. `gauntlet-handoff/step-1` at `SKILL.md ## Sequence` asks `--key` or `--out`. Keep the six `stop:` routes in `## Arguments` and `plan_check` `FAIL` as stuck endings, never `done` on resume. Handoff `## Sequence` step 7 emits `done brief-written` and step 1 exclusivity emits stuck. The `gauntlet-handoff` brief adds no field; automatic handoffs have no terminal, while a separate `/skill:release` turn remains separate.

Citation/format contract: apply `skills/brainstorming/reference/menu-layout.md`, `[A-Za-z0-9.-]+`, and `doc/gate-contract.md`; preserve `Recommendation:` where present. Templates' citation inventory names `spec-finalization.md`, `amendment-surface.md`, `ticket-acceptance.md`, `pr-subject.md`, `writing-plans/SKILL.md`, `subagent-driven-development/stop-note.md`, `loop-implementation/SKILL.md`, `verification-before-completion/reference/conformance-check.md`, `using-git-worktrees/SKILL.md`, `gatekeep-pr/reference/{sync,batch}.md`, `gauntlet-resume/reference/reconstruction.md`, `gauntlet-handoff/SKILL.md`; this task owns its three files, not `brainstorming/SKILL.md`'s `Good:` blocks or `menus.md`'s `initial` fence. Use `Start the message with` sentences. Each `question` / gate fact must show `after: holds`, never rely on `pre-existing` (`eval/lib/judge.mjs:24`, `eval/run.mjs:367-370`); commit `eval/<target>/report.md`. The `done <outcome>` form applies only to actual terminal reports.

## Wave 4 - Contract inventory and public documentation

Depends on Waves 1-3: inventory records the actual renderer owners and the lint now exercises integrated source. This is the dedicated trailing documentation wave.

### Task 8: Publish the gate inventory, reply layouts, and terminal mapping

**TDD scenario:** Documentation - executable inventory/link lint.

**Spec:** doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md § "Acceptance criteria" L50, § "The contract (owner: `doc/gate-contract.md`, new)" L72-L96, § "Remove / Add" L122-L124, § "Tests" L141-L146, § "Tests" L150, § "Documentation impact" L153-L155, § "Out of scope" L161, § "Out of scope" L165, § "Out of scope" L167

**Files:**
- Create: `doc/gate-contract.md`
- Modify: `README.md:579-585`
- Modify: `AGENTS.md:126-149`
- Modify: `CHANGELOG.md:1-5`

**Tests:**
- none: documentation; real inventory/link validation uses the scoped lint below

Decision: The contract records actual reply layouts, preserving source menus rather than renumbering them. Step 4 in finishing uses N. rows at source lines 176-215, matching spec L80; document N. rows and the existing fix-minors extras. The approved amendment explicitly requires both carried-open sites, shared question slices and real headings outside fences.

- [ ] **Step 1: Run red inventory lint.** Run `node scripts/gate-contract-lint.mjs` before creating the doc; expect missing-contract failure.
- [ ] **Step 2: Write Gates.** Give every id in spec L75-L87 a row with kind, relative rendering file, real ATX heading prefix and actual layout. Keep writing-plans' three questions and loop's two at shared sites; only gate rows need distinct file/site pairs. Cite cut-question at # Ticket Handling, never the fenced Acceptance criteria heading. Add two carried-open rows for its canonical and representative sites with the same id. Step 4 has templates=3 and actual N. rows; spec approval and close-members use 1 - rows. Questions keep inventory ids but emit only question. Link shared grammar instead of copying it.
- [ ] **Step 3: Write Terminals.** Use `skill | ending | report site | line`, report site encoded as relative path plus ` § ` plus heading prefix. Enumerate spec L89-L95 mappings at actual report slices, including shared outcomes, shape-ticket comma-joined counters/contributors, failed finish choices, gatekeep hard stops, delivery STOPs, resume failures and handoff completion. Do not invent terminal rows to cover unrelated examples.
- [ ] **Step 4: Write Reading a reply.** Cover N. rows, 1 - rows, X) options, item-letter, free and question once each. Preserve remap/echo, show evidence/check/change-request rules, `; fund N fix rounds`, `fix minors`, `fix minors F3, F9`, item-letter replies and typed discard/cap +N/yes/no. Rows, not marker metadata, define replies; no per-gate token lists.
- [ ] **Step 5: Link and log.** Add a README Configuring-the-gates paragraph linking doc/gate-contract.md. Add AGENTS routing row `Answer gauntlet gates from a program` outside the shared-core block. Add `## Unreleased` before v7.37.0 and an entry naming gate/question/done/stuck and #92; do not release or bump a version. Flag finishing extraction as follow-up in the change's commit body, not a new instruction file or tracker write.
- [ ] **Step 6: Validate integrated docs.** Run `node scripts/gate-contract-lint.mjs` and `node scripts/check-agents-core.mjs`; expect zero defects and unchanged core. Walk the complete spec inventory against the doc and actual sites; lint cannot discover omitted gates. Verify external payloads and automatic handoffs have no new marker. Audit the Add list against owned files and all thirteen eval targets, including the new handoff target; keep removal empty.
- [ ] **Step 7: Commit.** Run `git add doc/gate-contract.md README.md AGENTS.md CHANGELOG.md` and `git commit -m "Document gauntlet first-line gates and outcomes (#92)"`. Release promotion remains separate.

Inventory transcription contract (relative paths in final tables include the skills directory, even where spec uses owner-relative shorthand):

- Gates schema: `gate id | kind (gate/question) | rendering file | site | layout (N. rows / X) options / 1 - rows / item-letter / free)`. Match `site` to real heading prefixes, including existing `## Step 3` without rewriting its dash.
- Brainstorm: `brainstorming/understand-the-idea` at `SKILL.md ### 3. Understand the idea`, `brainstorming/present-the-design` at `SKILL.md ### 6. Present the design in two rounds`, `brainstorming/cut-question` at `reference/ticket-acceptance.md # Ticket Handling` (`**Cut question.**`, not fenced `## Acceptance criteria`), `brainstorming/relatedness-before-provisioning` at `reference/pr-subject.md ## Relatedness before provisioning`, `brainstorming/user-review-gate` at `reference/spec-finalization.md ## User Review Gate` (`1 - ` rows), `brainstorming/human-batch` at `reference/amendment-surface.md ## 4. Human batch - one menu`.
- Planning: `SKILL.md ## Author the plan` for `writing-plans/step-6-baseline-failure`, `writing-plans/step-6-baseline-dirty`, `writing-plans/step-6-contract-questions`, including `FAIL` and `Recommendation:`. SDD: `subagent-driven-development/stop-note` at `skills/subagent-driven-development/stop-note.md ## Template`. Loop: `loop-implementation/human-stop`, `loop-implementation/discard-authorization` at `SKILL.md ## Human stop`.
- Verify: `verification-before-completion/step-6` at `reference/conformance-check.md ### Fix loop - SDD wave-loop mirror, per round`, advanced by `grant_fix_rounds`.
- Finish: `finishing-a-development-branch/step-4` at `SKILL.md ### Step 4: Present Options`, with `fix minors` extra reply; `finishing-a-development-branch/carried-open` at `reference/disposition-protocol.md # Carried-open disposition protocol` and `SKILL.md ### Step 3.5: Closure / Conformance Disposition Gate` (`SKILL.md:90`); `finishing-a-development-branch/pr-subject-row-1` at `SKILL.md #### PR-subject row 1: Push to the PR branch` (`Close the absorbed PRs with these comments?`); `finishing-a-development-branch/option-5` at `SKILL.md #### Option 5: Discard` (typed `discard`). Use `templates=3` on Step 4.
- Worktrees: `using-git-worktrees/step-3` at `SKILL.md ## Step 3 - Verify Clean Base`, `using-git-worktrees/detached-head` at `SKILL.md ## Detached HEAD`.
- PR: `N.` rows at waiting `##` sections of `reference/menus.md`: `initial`, `final`, `assess-terminal`, `obstacle`, `contract-exception`, `own-merge`, `merge-queued`, `approved`, `closed-pr`, `batch-summary`; `gatekeep-pr/sync-preconditions` at `reference/sync.md ## Preconditions` (`stop`, `show evidence`); `gatekeep-pr/other-author-confirmation` at `reference/sync.md ## Other-author confirmation`; `gatekeep-pr/provision-serially` at `reference/batch.md ## Provision serially`.
- Bug: `chase-bug/verdict-menu`, `chase-bug/response-to-origin` at `SKILL.md ### 4`, `### 5`. Delivery: `check-delivery/confirmation-gate` at `SKILL.md ## Confirmation gate and the batched write`. Shaping: `shape-ticket/step-3` at `SKILL.md ### 3 - Interactive questioning`; `shape-ticket/step-8` at `reference/repo-audit.md ## Complete the batch and present gates` (called by `SKILL.md ### 8 - Confirmation gate`, not a duplicate renderer; `repo-audit.md` renders); `shape-ticket/hard-stop` at `SKILL.md ## AC integrity gate`.
- Resume: `gauntlet-resume/discovery` at `SKILL.md ## Arguments`; `gauntlet-resume/spec-without-plan` at `reference/reconstruction.md ## Spec without plan`; `gauntlet-resume/spec-with-ledger` at `reference/reconstruction.md ## Spec with ledger`; `gauntlet-resume/spec-with-plan` at `reference/reconstruction.md ## Spec with plan`; `gauntlet-resume/dispatch` at `SKILL.md ## Dispatch` (`/skill:brainstorming`, `worktree: no`). Handoff: `gauntlet-handoff/step-1` at `SKILL.md ## Sequence`, asking for `--key` or `--out`.
- Finish terminals at `SKILL.md` option blocks and `## Completion`: `done pr-created`, `done merged`, `done kept`, `done discarded`, `done pushed`, plus failed choices stuck; delay pushed until close-members is answered or absent.
- PR terminals: `reference/post-selection-loop.md ### Teardown` has `done approved`, `done merged`, `done closed-pr`, `done final`, `done merge-queued`; `cleanup.md ## Non-final stop` preserves `stuck - ` reason; assertion failures from `fix-wave.md:20` / `post-selection-loop.md:70-71` and `sync.md ## Failure path` are stuck. `report.md ## Verdict` is never terminal.
- Shaping counters: `written closed declined dropped no-op stopped unfetched close-failed close-by-hand`, zero omitted, comma-joined with no spaces. Singletons `done written=1`, `done stopped=1`; `close failed`, `close by hand`, `unfetched` make the same counter line stuck. `declined` / `dropped` remain human decisions; `stopped` counts ended unrecovered work. An active hard stop emits `gauntlet: question`, never the batch line.
- Delivery terminals: `done delivered`, `done already-recorded`, `done manual`; every `STOP` in `## Quick reference` and final failure after comment-gate handling is stuck. Bug terminals at `SKILL.md ### 5. Response to origin (human gate 2)`: `done responded`, `done summary` (`Finish with rendered summary`), `done draft`; no terminal on automatic handoff. Resume: six `stop:` routes at `## Arguments`, entry failures and `plan_check` `FAIL` are stuck, never `done`. Handoff: `## Sequence` step 7 `done brief-written`; `--out`/`--key` exclusivity is stuck.
- Reply layouts: `N.` remap/echo, `show evidence`, `check <name> flaky | real | ci-broken`, other strings are change requests per `post-selection-loop.md:29`; `1 - ` suffixes `; fund N fix rounds`, `fix minors` / `fix minors F3, F9` on `user-review-gate` / `step-4`; `X)` letter/free-text; item-letter per `disposition-protocol.md`; `free` round counts/stop; `question` free text including `discard` on `option-5`, `cap +N` on `human-stop`, `yes`/`no` on confirmations. Add no `picks=`.

Add-list audit: preserve `scripts/gate-contract-lint.mjs`, `scripts/ci.mjs`, `scripts/gate-contract-lint.test.mjs` and its `Start the message with` fixtures. Audit `skills/brainstorming/reference/menu-layout.md`, `skills/brainstorming/SKILL.md`, `skills/brainstorming/reference/{spec-finalization,amendment-surface,ticket-acceptance,pr-subject}.md`, `skills/writing-plans/SKILL.md`, `skills/subagent-driven-development/stop-note.md`, `skills/loop-implementation/SKILL.md`, `skills/verification-before-completion/reference/conformance-check.md`, `skills/finishing-a-development-branch/SKILL.md` and `reference/disposition-protocol.md`, `skills/using-git-worktrees/SKILL.md`, `skills/gatekeep-pr/reference/{menus,sync,batch,post-selection-loop,cleanup}.md`, `skills/chase-bug/SKILL.md`, `skills/check-delivery/SKILL.md`, `skills/shape-ticket/SKILL.md` and `reference/repo-audit.md`, `skills/gauntlet-resume/SKILL.md` and `reference/reconstruction.md`, `skills/gauntlet-handoff/SKILL.md`; verify `menu-layout.md` citations. Audit nudge coverage in `extensions/phase-tracker.ts` / `extensions/phase-tracker.test.ts` and per-target `intent.md`, reports and first-line facts for `eval/brainstorming`, `eval/writing-plans`, `eval/subagent-driven-development`, `eval/loop-implementation`, `eval/conformance-check` (loads `reference/conformance-check.md`, emits `gauntlet: gate=verification-before-completion/step-6` proactively), `eval/finishing-a-development-branch`, `eval/using-git-worktrees`, `eval/gatekeep-pr`, `eval/chase-bug`, `eval/check-delivery`, `eval/shape-ticket`, `eval/gauntlet-resume`, and new `eval/gauntlet-handoff` per `eval/README.md ## Files per target`. The position rule checks `gauntlet: gate=|done|stuck` under `skills/**/*.md`; inventory/lint is the driver proxy, not a driver implementation. `README.md`, `AGENTS.md` and `CHANGELOG.md` carry the declared links/log; `## Unreleased` promotion is `deferred: release`. This audit owns the whole-file Add/Remove accounting, while Tasks 1-7 own implementation at their per-behavior coverage rows. Do not generate the inventory or extract finishing.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L40 | Grammar and charset owner; all rendering files gain relative citations | Task 3, Task 4, Task 5, Task 6, Task 7 |
| § "Acceptance criteria" L44 | Question first; keep existing one-question form | Task 4, Task 5, Task 6, Task 7 |
| § "Acceptance criteria" L50 | Public links and four-kind changelog entry | Task 8 |
| § "The first-line rule (owner: `skills/brainstorming/reference/menu-layout.md`)" L57-L68 | Four kinds, comma-separated grammar, settlement and parent precedence; no ordinary/intermediate marker | Task 3 |
| § "The contract (owner: `doc/gate-contract.md`, new)" L74 | Parse Gates schema and real heading-prefix sites | Task 1 |
| § "The contract (owner: `doc/gate-contract.md`, new)" L75-L76 | Brainstorm ids, actual cut-question heading and three shared planning questions | Task 4 |
| § "The contract (owner: `doc/gate-contract.md`, new)" L77-L80 | Stalls, cap gate, finish variants, two carried-open sites, close-members and discard | Task 5 |
| § "The contract (owner: `doc/gate-contract.md`, new)" L81 | Dirty-base and detached workspace asks | Task 4 |
| § "The contract (owner: `doc/gate-contract.md`, new)" L82-L85 | PR menus/confirmations, bug, delivery and ticket gates | Task 6 |
| § "The contract (owner: `doc/gate-contract.md`, new)" L86-L87 | Resume discovery/reconstruction and handoff key/out asks | Task 7 |
| § "The contract (owner: `doc/gate-contract.md`, new)" L89 | Finish success/failure and delayed-push terminal branches | Task 5 |
| § "The contract (owner: `doc/gate-contract.md`, new)" L90-L93 | PR teardown/hard stops, comma-joined shaping counters, delivery and bug endings | Task 6 |
| § "The contract (owner: `doc/gate-contract.md`, new)" L94-L95 | Resume failure-only terminals; handoff written/exclusivity endings | Task 7 |
| § "The contract (owner: `doc/gate-contract.md`, new)" L72-L96 | Publish every inventory row, terminal mapping and reply layout; manually review completeness | Task 8 |
| § "Templates" L100 | Fence/prose placement, local citations and brainstorm Good blocks | Task 1, Task 4, Task 5, Task 6, Task 7 |
| § "Extension" L104 | Append exact nudge; proactive instruction and quoted obstacle behavior | Task 2, Task 5, Task 6 |
| § "Lint (`scripts/gate-contract-lint.mjs`, called from `scripts/ci.mjs`)" L108-L118 | Table parsing, shared-question/distinct-gate sites, fence-aware slicing, placement/count, reverse/link/rule checks and diagnostics | Task 1 |
| § "Remove / Add" L122-L124 | Audit the full Add list and no-removal constraint, including thirteen targets and one new handoff sample | Task 8 |
| § "Errors and edge cases" L130-L133 | Define parent precedence, nested owner, terminal/handoff boundary, recommendation omission | Task 3 |
| § "Errors and edge cases" L130 | Apply parent precedence to combined finish/PR renderers | Task 5, Task 6 |
| § "Errors and edge cases" L131 | Nested workspace ask retains its own owner | Task 4 |
| § "Errors and edge cases" L132-L133 | Finish/PR handoff versus terminal and recommendation omission | Task 5, Task 6 |
| § "Errors and edge cases" L133 | Untagged/item-letter brainstorm recommendations omitted | Task 4 |
| § "Errors and edge cases" L132 | Resume/handoff settlement versus continuation | Task 7 |
| § "Errors and edge cases" L134 | No brief field; restored owner renders next gate | Task 7 |
| § "Errors and edge cases" L135-L136 | Ended stopped batch versus live ask; quoted runtime nudge remains body text | Task 6 |
| § "Errors and edge cases" L136 | Runtime reason stays a nudge, not an emitted marker | Task 2 |
| § "Errors and edge cases" L137 | Angle-segment grammar examples are not literal ids | Task 1, Task 3 |
| § "Tests" L141-L146 | Negative fixtures and integrated row/reverse/position/rule/citation/link checks | Task 1, Task 8 |
| § "Tests" L147 | Assert exact nudge and preserved count prefix through existing cap harness | Task 2 |
| § "Tests" L148 | Each design/planning target proves first physical line; correct timeout fixture filename and exact standalone question; full observations committed, interrupted reports retained as incomplete | Task 4 |
| § "Tests" L148 | Each implementation/finish target proves first line; proactive funding has no guard input | Task 5 |
| § "Tests" L148-L149 | PR/ticket targets prove first line and mixed shaping counters/contributors | Task 6 |
| § "Tests" L148 | Resume and new handoff target prove exact standalone first line; commit truthful reports | Task 7 |
| § "Tests" L148 | Option A sole replay and judge at medium via existing checkout-local constants; truthful provenance, one needed refresh for reused judgments, restore before patch capture; new marker facts hold, reviewed non-marker regressions/inconclusive remain finish-gate concerns, never a full model eval passing claim; interrupted runs remain incomplete and may finish unchanged without replaying successful marker cells; no new runner feature or changed retry policy, no weakened facts or hidden failures | Task 4, Task 5, Task 6, Task 7 |
| § "Tests" L150 | Driver outside repo; contract and lint are proxy only | Task 1, Task 8 |
| § "Documentation impact" L153-L155 | Communication doc, README paragraph, Unreleased entry and AGENTS route; promotion stays separate | Task 8 |
| § "Out of scope" L161 | No picks field or per-gate first-line token list | Task 3, Task 8 |
| § "Out of scope" L162-L163 | No driver/runtime settlement hook/body marker or structured UI replacement | Task 2 |
| § "Out of scope" L162 | Keep ticket/PR payloads free of markers | Task 6 |
| § "Out of scope" L164 | One sample per target, no shipped runner/retry-policy changes | Task 4, Task 5, Task 6, Task 7 |
| § "Out of scope" L165 | Hand-maintained inventory, no generator | Task 1, Task 8 |
| § "Out of scope" L166 | Do not mark invented gates outside skill templates | Task 3, Task 4, Task 5, Task 6, Task 7 |
| § "Out of scope" L167 | Mark finishing in place and flag extraction as follow-up | Task 8 |
| § "Out of scope" L166-L168 | Finish extraction stays out; no verification terminal marker | Task 5 |
| § "Out of scope" L168 | Runtime nudge names cap gate, never verification done/stuck | Task 2 |
