# Shape-ticket obsolete verdict Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn confirmed obsolete-ticket evidence into a gated close or drop choice and mark exactly one eligible menu option recommended.

**Architecture:** Keep the verdict and menu in the existing repository-audit reference, with tracker operations resolved by the existing capability ladder. Add only the spec's small routing clauses to the skill body; keep the six-label scout contract, draft/roast pipeline, and overlap discovery intact. Use the existing text-eval target for behavioral evidence and its existing structural test for deterministic task checks.

**Tech Stack:** Markdown skill instructions, Node.js node:test, existing text replay/judge eval harness, GitHub and Linear CLI contracts.

**Spec:** `doc/specs/2026-10-26-shape-ticket-obsolete-verdict.md`

**Verification:** `npm test && node eval/run.mjs shape-ticket`

---

## Files

### Skill behavior

**Modify:**
- `skills/shape-ticket/SKILL.md` - narrow routing, gate, no-op and terminal-report clauses.
- `skills/shape-ticket/reference/repo-audit.md` - parent verdict, shared gate menu, selected-close execution rules.
- `skills/shape-ticket/reference/tracker-ladder.md` - close/read verbs, terminal states and override policy.

### Eval inputs and generated evidence

**Create:**
- `eval/shape-ticket/samples/obsolete-premise-contradicted/case.md`
- `eval/shape-ticket/samples/obsolete-premise-contradicted/expected.md`
- `eval/shape-ticket/samples/quiet-audit-no-close-row/case.md`
- `eval/shape-ticket/samples/quiet-audit-no-close-row/expected.md`
- `eval/shape-ticket/samples/obsolete-create-drop-idea/case.md`
- `eval/shape-ticket/samples/obsolete-create-drop-idea/expected.md`
- `eval/shape-ticket/results/obsolete-premise-contradicted/baseline.json`
- `eval/shape-ticket/results/obsolete-premise-contradicted/candidate.json`
- `eval/shape-ticket/results/quiet-audit-no-close-row/baseline.json`
- `eval/shape-ticket/results/quiet-audit-no-close-row/candidate.json`
- `eval/shape-ticket/results/obsolete-create-drop-idea/baseline.json`
- `eval/shape-ticket/results/obsolete-create-drop-idea/candidate.json`

**Modify:**
- `eval/shape-ticket/intent.md`
- `eval/shape-ticket/README.md` - task-local sample table and proof limits.
- `eval/shape-ticket/report.md` - generated; full-target report replaces partial evidence at verification.
- `eval/shape-ticket/results/*/baseline.json` - existing generated records the runner invalidates.
- `eval/shape-ticket/results/*/candidate.json` - existing generated records the runner invalidates.

The record globs declare generated-file ownership, not permission to hand-edit observations. Actual stale cells depend on each sample's assembly and cached hashes. Leave `eval/shape-ticket/target.json`, existing sample inputs, and the historical `eval/shape-ticket/replay/` corpus unchanged.

### User-facing docs

**Modify:**
- `README.md` - Issue tracker override contract adjacent to the existing example.
- `CHANGELOG.md` - add an Unreleased change entry.

**Delete:** None.

## Recon and verification notes

- `skills/shape-ticket/SKILL.md:60-68` loads the audit in both modes and bounds repair gather to one hop. No new discovery or scout dispatch is needed.
- `skills/shape-ticket/reference/repo-audit.md:40-71` owns the scout brief and all-six acceptance test; `:73-108` owns fold-in and no-op routing; `:110-120` owns batch gates.
- `skills/shape-ticket/reference/tracker-ladder.md:3-12` owns capability resolution; `:18-29` owns the current verbs and the state-name prohibition. `skills/linear/SKILL.md:100-107,145-152` supplies the Discuss/Update and duplicate-relation contracts.
- `skills/shape-ticket/reference/overlap-check.md:25-41` owns `Recommended option` and no-write/enrichment alternatives. Consume that contract from the audit menu; do not edit its discovery budget, identity test or protected-body rules.
- `eval/shape-ticket/target.json:1-6` includes the Draft-through-pre-Roast slice, menu layout, Evidence gate, and audit reference. Leading `bundle+:` adds a reference per sample (`eval/lib/replay.mjs:35-58`); tools are disabled (`:61-63`). Inline source excerpts are already-opened evidence, not instructions to perform unavailable tool calls.
- Existing fixture examples: `eval/shape-ticket/samples/audit-repo-fit/case.md:1-23` and `expected.md:1-6`; missing-footer-only gate example: `eval/shape-ticket/samples/repair-source/case.md:1-29`.
- Scoped deterministic command: `node --test eval/lib/lint.test.mjs`. Its test `every committed target and _template pass` at `:80-83` calls `lintAll` on the real eval tree, including the new cases. This proves structure, not model behavior; the three partial replay runs below and full header run supply behavior evidence.
- `package.json:59-64` has no lint or formatter script. The full test entrypoint bundles instruction-size, model-literal, eval structure and hygiene checks (`scripts/ci.mjs:516-553`). There is no configured Markdown formatter; use ASCII punctuation, compact tables and scoped read-back. Scoped lint uses the exported `lintSkillSizes`, `lintModelLiterals`, and `lintTarget` functions, filtering findings to task-owned paths.
- The overrides file contains neither a Happy path table nor deployment topology. Use one plan; no deployment or review-isolation split applies.

## Baseline provenance

Initial BASE: `7cb2bc76`. Initial per-file inventory: `?? doc/plans/2026-10-26-shape-ticket-obsolete-verdict.md`. Admit exactly that plan path and `doc/specs/2026-10-26-shape-ticket-obsolete-verdict.md`; the spec has no status entry. No in-flight paths were supplied. The scoped structural command executed with exit 0: 14 tests, 14 pass, 0 fail. Post-run HEAD and inventory were unchanged; no generated artifacts or source contamination appeared. Header verification and model replay steps were not run during planning.

## Wave 1 - Obsolete verdict and gated choices

### Task 1: Implement the obsolete verdict, close/drop menu and replay cases

**TDD scenario:** Modifying tested instructions - run existing structural tests, write the three replay cases, observe baseline behavior, then implement and rerun the cases.

**Spec:** doc/specs/2026-10-26-shape-ticket-obsolete-verdict.md § "Acceptance criteria" L20, § "Acceptance criteria" L22, § "Acceptance criteria" L24, § "Acceptance criteria" L26, § "Acceptance criteria" L28, § "Acceptance criteria" L30, § "Design" L37, § "Design" L41, § "Design" L42, § "Design" L43, § "Design" L44, § "Design" L45, § "Design" L47, § "Design" L49, § "Design" L53, § "Design" L55, § "Design" L57, § "Design" L61, § "Design" L65, § "Design" L66, § "Design" L68, § "Design" L70, § "Design" L74, § "Errors and edge cases" L78, § "Errors and edge cases" L79, § "Errors and edge cases" L80, § "Errors and edge cases" L81, § "Errors and edge cases" L82, § "Errors and edge cases" L83, § "Errors and edge cases" L84, § "Tests" L88, § "Tests" L89, § "Tests" L90, § "Tests" L91, § "Tests" L92, § "Out of scope" L107

**Files:**
- Modify: `skills/shape-ticket/SKILL.md:8-47`
- Modify: `skills/shape-ticket/SKILL.md:99-146`
- Modify: `skills/shape-ticket/SKILL.md:271-281`
- Modify: `skills/shape-ticket/reference/repo-audit.md:73-120`
- Modify: `skills/shape-ticket/reference/tracker-ladder.md:16-31`
- Create: `eval/shape-ticket/samples/obsolete-premise-contradicted/case.md`
- Create: `eval/shape-ticket/samples/obsolete-premise-contradicted/expected.md`
- Create: `eval/shape-ticket/samples/quiet-audit-no-close-row/case.md`
- Create: `eval/shape-ticket/samples/quiet-audit-no-close-row/expected.md`
- Create: `eval/shape-ticket/samples/obsolete-create-drop-idea/case.md`
- Create: `eval/shape-ticket/samples/obsolete-create-drop-idea/expected.md`
- Create: `eval/shape-ticket/results/obsolete-premise-contradicted/baseline.json`
- Create: `eval/shape-ticket/results/obsolete-premise-contradicted/candidate.json`
- Create: `eval/shape-ticket/results/quiet-audit-no-close-row/baseline.json`
- Create: `eval/shape-ticket/results/quiet-audit-no-close-row/candidate.json`
- Create: `eval/shape-ticket/results/obsolete-create-drop-idea/baseline.json`
- Create: `eval/shape-ticket/results/obsolete-create-drop-idea/candidate.json`
- Modify: `eval/shape-ticket/intent.md`
- Modify: `eval/shape-ticket/README.md:1-36`
- Modify: `eval/shape-ticket/report.md`
- Modify: `eval/shape-ticket/results/*/baseline.json`
- Modify: `eval/shape-ticket/results/*/candidate.json`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: 7cb2bc76 pass
- via: `lintAll()` and `lintTarget()` validate the three new sample files; behavioral replays exercise `/skill:shape-ticket`, `reference/repo-audit.md` fold-in/menu and `reference/tracker-ladder.md` close resolution.

Decision: Use the existing text target, not a new live-tracker test harness - `eval/shape-ticket/replay.md:1` and `eval/lib/replay.mjs:61-63` explicitly disable tools; the spec requires inlined already-opened source evidence. These cases prove rendered verdicts and choices, not successful remote writes. Review the selected-close instruction path separately against the transition table in Step 10.

Decision: Implement the create obsolete reason in `repo-audit.md`'s shared menu, reusing the one no-write row from `overlap-check.md` - its `Recommended option` table at `:27-35` and selection rules at `:37-51` already own overlap alternatives. No new menu file or overlap discovery changes are required.

- [ ] **Step 1: Run the existing structural check**

  Run: `node --test eval/lib/lint.test.mjs`

  Expected: all tests pass, including the real-tree structural check. Read `/skill:forge-skill` Authoring rules before editing instructions. Use imperative voice and change only each rule's owning sentence; none of the touched instruction files exceeds 500 lines, so no oversized-file extraction is needed.

- [ ] **Step 2: Add the contradicted-premise repair case and facts**

  Create `eval/shape-ticket/samples/obsolete-premise-contradicted/` with `case.md` opening exactly `bundle+: skills/shape-ticket/reference/tracker-ladder.md`. Set the stage after audit, before Draft, and ask for the step 8 gate with no approval. State metadata is clean, roast has no unrelated findings, tracker is GitHub, and the open snapshot is synthetic `#42` in `acme/records`.

  Use this source body: Context says support reviews saved import failures; Problem says reopening a failed import drops its failure details, with example run 42 reporting "row 8 rejected" before navigation and only "failed" afterward; include `source: https://example.test/import/42`. Idea attributes retaining the failure details to the reporter. AC: given that failed import, leaving and reopening still displays "row 8 rejected". Inline an already-opened source excerpt at `src/import-history.ts:18` showing that the current reopen view retains "row 8 rejected". Supply all six audit labels: `Claims:` contradicts the load-bearing loss claim with that citation, Repo-fit kept, AC-fit clear, Sibling none, In-motion none, and `Scenario:` setup/action/observation reports the expected retained detail. This deliberately supports both premise contradiction and not reproduced; precedence must select premise contradiction.

  Write the following `expected.md` facts with `anonymized: true` first:

  ```markdown
  - verdict: judged: The emitted Audit: obsolete: premise contradicted: line cites src/import-history.ts:18 and appears above Title; it wins over not reproduced.
  - close: judged: A numbered close option displays gh issue close with --reason "not planned" and --comment containing the obsolete evidence.
  - recommended: judged: Exactly one rendered option bears [recommended], and it is the close option.
  - diff: judged: The ordinary old-to-new body diff still appears beside the mutually exclusive close choice; no live write is claimed.
  ```

- [ ] **Step 3: Add the quiet-audit repair case and facts**

  Create `eval/shape-ticket/samples/quiet-audit-no-close-row/`; open `case.md` with `bundle+: skills/shape-ticket/reference/tracker-ladder.md`. Reuse the import-failure scenario as an independently authored synthetic snapshot, but omit only its `source:` footer and state the failure is still observed. Supply Claims verified, Repo-fit kept, AC-fit clear, Sibling none, In-motion none, and Scenario none with missing current-system access. State no audit edit, no overflow, no metadata change, and no other conformance defect. The missing footer must reach the gate, not the quiet no-op path.

  Write `expected.md` with `anonymized: true` and these facts:

  ```markdown
  - no-verdict: judged: The report emits no Audit: obsolete: line.
  - no-close: judged: The menu has no close option or close operation.
  - recommended: judged: Exactly one option bears [recommended], and it approves the displayed repair diff.
  - footer-only: judged: The body diff adds source: none (not recorded at filing) without changing the existing prose or AC bytes.
  ```

- [ ] **Step 4: Add the delivered-feature create case and facts**

  Create `eval/shape-ticket/samples/obsolete-create-drop-idea/`; open `case.md` with `bundle+: skills/shape-ticket/reference/overlap-check.md`. Use a fresh feature ask to download report rows without losing them. Supply an already-opened `src/report-download.ts:12` excerpt implementing that capability and a six-label audit whose `Repo-fit: exists:` cites that path. State bounded overlap discovery found no candidate, necessary clarification is complete, gates/roast have no blockers, and no approval has been given. Request the gate, not prescribed tool calls, under 1200 words. Do not name a tracker command in the requested output.

  Write `expected.md` with `anonymized: true` and these facts:

  ```markdown
  - verdict: judged: The gate emits Audit: obsolete: delivered: with src/report-download.ts as the confirmed capability and a citation above Title.
  - drop: judged: One Drop the idea option alone bears [recommended]; a mutually exclusive create-anyway option and its as-new body remain available.
  - no-commands: mechanical: matches /^(?![\s\S]*\b(?:gh|linearis)\b)[\s\S]*$/
  - no-write: judged: The gate stops for a selection and claims no ticket creation or other live write.
  ```

- [ ] **Step 5: Record intent and observe the pre-edit behavior**

  Extend `intent.md`'s Change section to name the parent obsolete verdict, repair close/create drop choice and single `[recommended]` tag. Preserve existing accepted moves; add only the new intended failing-to-holding facts that the baseline observations support. Do not mark a changed old fact accepted merely to clear a regression. Keep `target.json` byte-identical, including its slices and word cap.

  Compute the current `for:` using the same bundle-free assembly as the runner (`eval/run.mjs:215-218`):

  ```bash
  node --input-type=module -e 'import {readFileSync} from "node:fs"; import {assemble,treeReader} from "./eval/lib/replay.mjs"; import {sha256} from "./eval/lib/checks.mjs"; const target=JSON.parse(readFileSync("eval/shape-ticket/target.json","utf8")); console.log(sha256(assemble(target,treeReader(process.cwd()))));'
  ```

  Copy its output to the first `for:` line. Run these commands one at a time:

  ```bash
  node eval/run.mjs shape-ticket obsolete-premise-contradicted
  node eval/run.mjs shape-ticket quiet-audit-no-close-row
  node eval/run.mjs shape-ticket obsolete-create-drop-idea
  ```

  Inspect saved outputs, not only exit codes: unchanged pre-edit output can produce exit 0 while the newly required facts fail in both arms. Expect missing obsolete exit choices or recommendation tags; use the actual baseline facts as red evidence. The deterministic structure must still pass. Record refusals, unavailable model access, or unexpected already-holding facts honestly rather than inventing a red failure. Each replay is its own short step when model latency exceeds a few minutes.

- [ ] **Step 6: Add tracker close resolution and parent-owned reads**

  In `tracker-ladder.md` add `state` to the GitHub full-read `--json` fields. Add parent-owned `gh pr view <n> --json state,mergedAt` and `gh pr diff <n>` beside the close capability; resolve Linear linked tickets through `/skill:linear` and linked PRs through their host. Preserve `gh pr list`'s `--state open` default and existing bounded scout command unchanged.

  Add the close mapping table:

  | Verdict | GitHub reason | Linear status |
  |---|---|---|
  | delivered | `completed` | `Done` |
  | superseded, premise contradicted, not reproduced | `not planned` | `Canceled` |
  | duplicate with accepted native target | `duplicate` | `Duplicate` |

  GitHub uses `gh issue close <n> --reason "<reason>" [--duplicate-of <ref>] --comment "<evidence>"`. Keep the spec's verified `gh issue close --help` spellings; resolve current capabilities before displaying a real operation. Linear uses `linearis issues discuss <id> --body "<evidence>"` then `linearis issues update <id> --status <Done|Canceled|Duplicate> [--duplicate-of <ref>]`, in that order. These are the `linearis issues discuss` and `linearis issues update --status` operations named by the acceptance criterion; use the ID-bearing executable forms, not the abbreviated capability name. Use `issues read` state plus workflow type; `completed` or `canceled` types are terminal, and GitHub CLOSED is terminal.

  Extend the "never hardcoded in this skill" state sentence only for these zero-config close names. Under `## Issue tracker`, resolve `- close: <command>` as replacement of the whole operation sequence, using the existing `read:` / `update:` mapping convention. A forbidden mapped state yields `Close as <reason> - run by hand: <operations>`; selection runs nothing but retains the recommendation. Do not introduce an overrides key or `piGauntlet.*` setting. Keep ordinary "announced, not gated" status prose from waiving this skill's close gate.

- [ ] **Step 7: Add the parent verdict at audit fold-in**

  Add one fold-table row in `repo-audit.md`, before Draft. Read `audit.md` and the mode's gather together, open every cited location, and emit `Audit: obsolete: <reason> (<citation>)` only from confirmed evidence. Mark its Draft effect draft-changing so a conforming body still reaches the gate. Keep the existing `premise:` rewrite; do not stop draft, deterministic gates, roast or the body diff.

  Add the ordered judgment table below the fold table, using the spec's five shape spellings:

  | Priority | Shape and confirmation |
  |---|---|
  | 1 | `delivered: <pr or path>` - parent verifies merged PR state and diff covering every AC, or opens the `Repo-fit: exists: <path>` implementation and verifies the requested capability. |
  | 2 | `superseded by <ref>` - one-hop linked spec, ticket or decision cancels/replaces the ask; include supersession-banner evidence. |
  | 3 | `premise contradicted: <fact>` - `Claims:` contradicts the load-bearing Problem fact, including a removed target module, surface or dependency, not a side sentence. |
  | 4 | `not reproduced: <scenario>` - `Scenario:` observation equals the ticket/prompt's expected result. With no expected result in a create prompt, omit the verdict and keep the ordinary scenario report. |
  | 5 | `duplicate of <ref>` - repair only; parent reads the linked ticket's body and confirms same setup/action/expected result. Create duplicates stay with overlap. |

  Take the first confirmed shape. Missing or unconfirmed citations, `audit unavailable`, and uncited "no longer wanted" produce no verdict or exit row. A merged PR comes from one-hop gather; `In-motion:` and its open-only search do not gain a new query. Keep the scout brief, labels and all-six acceptance test byte-identical. Change the routing paragraph's conforming no-op sentence only to exclude obsolete findings from the quiet path.

- [ ] **Step 8: Render the shared gate and select the recommendation**

  Extend "Complete the batch and present gates" in `reference/repo-audit.md` as the menu owner for both modes. Put the Audit block immediately above Title, after pre-Title source gaps. Keep the exact body diff and existing comment separate from closing evidence; never append closing evidence to the Reporter note.

  Number rows using `menu-layout.md`: approve exact diff (create anyway in create), revise, decline, and the conditional exit. Repair's row is `Close as <reason> - <resolved operation sequence>`; create's is `Drop the idea - <reason>`. Beneath the exit show the `Audit: obsolete:` line verbatim, with citations, once as closing evidence. This is the same verdict already carried above Title, not a new rationale or Reporter-note payload.

  Resolve eligibility before tagging. Stopped tickets have no exit/approval option and no tag; they still show the obsolete audit line. A terminal repair snapshot has no close option. A missing/unavailable audit has no verdict/exit. Otherwise an obsolete finding renders the exit. Put exactly one `[recommended]` tag on the rendered exit; otherwise use the approve row or the alternative named by overlap's `Recommended option` table. Retain source-gap approval alternatives and tag only one eligible approve row. Keep stopped reports untagged.

  For create with overlap evidence, render one no-write `Drop the idea` row carrying both reasons, retain supported enrichment and create-anyway alternatives, and let obsolete override overlap's recommendation. Do not change overlap discovery or authorize status writes through enrichment labels. In repair, accept duplicate targets only as a number/URL for `gh` or `ABC-123` form for Linear; otherwise resolve the close through `not planned` / `Canceled` and retain the reference in evidence. Revise can change the mapped terminal reason or duplicate target; rerender resolved operations before a fresh selection.

- [ ] **Step 9: Add the selected-close execution branch**

  Keep the execution recipe with the audit gate template, consumed by step 9 after the small skill pointer. Picking close authorizes only the displayed operations and evidence, never the body or Reporter note; picking approve writes the body and closes nothing. Picking drop writes nothing and ends create as `dropped`, using the drafted title in place of a ticket ref. Create anyway files the premise-rewritten body with the contradiction already in its `premise:` report.

  After a command-bearing close selection, re-fetch the ticket including state and compare body and evidence snapshot with the one shown. A terminal state yields `<ref>: no-op (already closed)` without operations. A changed body or evidence snapshot returns to step 8 with the delta and requires a renewed selection. Otherwise execute the displayed sequence in order. A run-by-hand selection skips all operations and ends `<ref>: close by hand`.

  On the first non-zero operation, stop, quote its output verbatim, identify which earlier operation succeeded, and end `<ref>: close failed (<operation>: <reason>)`; do not retry or fall back to a body write. On success end `<ref>: closed`. Continue the batch after either result. Preserve headless stopping, one-ticket-at-a-time approval, hard AC stops and split subset selection.

- [ ] **Step 10: Add only the small SKILL.md routing clauses and audit the transition table**

  Apply each sentence-sized edit from spec L57 at its owning location:
  - Quick reference adds `Audit shows the ticket should not stand | Obsolete line above Title; close row (repair) or drop-the-idea row (create), tagged recommended`.
  - Quick reference ordinary repair and Edge cases early no-op gain "unless the audit carries an obsolete line".
  - Hard constraint gains "or, for the close row, the displayed operation sequence and evidence" beside exact diff authorization; the diff-only reminder in step 8 points to the same exception rather than contradicting it.
  - Mode routing's administrative-write exclusion gains "except the close row the step 8 template renders".
  - Step 6 names the obsolete line as non-conforming alongside draft-changing audit findings; its no-roast sentence preserves that exception.
  - Step 8 says "Render the options from the gate menu template in `reference/repo-audit.md`, including its mode's exit row and `[recommended]` tag".
  - Step 9 re-fetch adds "including state, before a close" and routes selected close to the reference recipe, before the existing body-first branch.
  - Both step 8 and the audit reference end-of-batch line use exactly `<ref>: written | closed | close failed (<operation>: <reason>) | close by hand | dropped | declined | stopped | no-op | unfetched`; state create uses the drafted title for `<ref>`.

  Review these inputs against the resulting instructions, without live tracker writes:

  | Input / selected row | Required outcome |
  |---|---|
  | Conforming body, confirmed obsolete | Draft/gates/roast still lead to the close choice. |
  | Stopped AC plus obsolete | Audit reported; no close, approval or recommendation. |
  | Body diff plus obsolete, approve selected | Body/comment path only, no close. |
  | Body diff plus obsolete, close selected | Close evidence/operations only, no body/comment draft write. |
  | Terminal snapshot before gate | Close row absent; normal remaining menu recommendation. |
  | Ticket terminal at post-pick re-fetch | No operations; no-op already closed. |
  | Changed body or evidence after pick | Show delta, renew selection; no stale execution. |
  | Linear discuss succeeds, update fails | Evidence landed, status not claimed changed; report failure and continue batch. |
  | First operation fails | Report output and no succeeded operation; no retry or body fallback. |
  | Override forbids mapped state | Recommended run-by-hand row; no operations when selected. |
  | Duplicate target not tracker-native | Not-planned/Canceled close, original target retained in evidence. |
  | Create obsolete plus overlap | One combined-reason no-write choice; enrichment retained, drop recommended. |
  | Headless | Stop at gate; no mutation. |

  Leave `AGENTS.core.md`, `AGENTS.md`, sibling copies, non-close status transitions, standalone verdict commands and the scout brief untouched. Do not extract step 8 into a new reference file.

- [ ] **Step 11: Refresh intent and rerun each behavioral case**

  Recompute `intent.md`'s `for:` with Step 5's exact assembly command. Run each of the three partial sample commands from Step 5 separately. Expected: candidate facts hold, especially reason precedence, the single recommended exit, quiet-audit approve fallback, and command-free create output. Read candidate records and report feedback; fix only instruction/fact mismatches covered by the spec. Preserve before records and genuine failure evidence. A baseline arm already holding a new fact is a guard, not permission to weaken it.

  Update `eval/shape-ticket/README.md`'s sample table with the three new samples and explain their proof limits: pre-opened evidence and rendered menus, not live retrieval, remote state changes or write atomicity. Preserve the separate historical replay contract. The verify phase runs the full target through the header command once the task is green, then retains the full `report.md` and changed generated records for the final commit; a partial report is not the final acceptance artifact.

- [ ] **Step 12: Check instruction size, style and eval structure**

  Run: `wc -c skills/shape-ticket/SKILL.md`

  Expected: strictly under 50,000 bytes; the spec's 3,861-byte addition budget is a ceiling, not a target. Run `wc -l` on the three touched instruction files and keep each below 500 lines without adding a new reference.

  Run the scoped lint calls:

  ```bash
  node --input-type=module -e 'import assert from "node:assert/strict"; import {lintSkillSizes} from "./scripts/skill-size-lint.mjs"; import {lintModelLiterals} from "./scripts/model-literal-lint.mjs"; import {lintTarget} from "./eval/lib/lint.mjs"; const root=process.cwd(); assert.deepEqual(lintSkillSizes(root).filter(x=>x.startsWith("skills/shape-ticket/")),[]); assert.deepEqual(lintModelLiterals(root).filter(x=>x.path.startsWith("skills/shape-ticket/")),[]); assert.deepEqual(lintTarget("eval/shape-ticket"),[]);'
  ```

  Expected: exit 0. Read changed Markdown for ASCII punctuation, compact tables, imperative instructions and unchanged frontmatter. No formatter command is configured. Repository instruction-size, eval structure and hygiene checks are bundled by `npm test`, scheduled only as part of header verification.

  Run: `rg -ni "jjuraszek|/Users/[^/]+" skills/`

  Expected: no output, exit 1 for no matches; an error exit is not a pass. This is the spec's separate generic-skill scan, not a source rewrite. Run the task's deterministic Tests command again; expect all tests green.

- [ ] **Step 13: Commit the behavior change and task-local eval artifacts**

  ```bash
  git add skills/shape-ticket/SKILL.md skills/shape-ticket/reference/repo-audit.md skills/shape-ticket/reference/tracker-ladder.md eval/shape-ticket
  git commit -m "Add gated obsolete-ticket choices to shape-ticket" -m "Behavior change: add parent obsolete verdicts, close/drop choices and one recommended menu row; extend shape-ticket replay cases and intent."
  ```

  Stage only declared changed files; retain generated observations rather than hand-editing them. Do not bump the package version or rebuild bins; no bin or extension library source changes.

## Wave 2 - User-facing contract

Depends on Wave 1: document the implemented reason map, operation sequences and single close gate. This trailing doc-only task owns the shared README and CHANGELOG, not any instruction or eval file.

### Task 2: Document close overrides and the obsolete-ticket menu

**TDD scenario:** Documentation-only change - use source comparison and Markdown review.

**Spec:** doc/specs/2026-10-26-shape-ticket-obsolete-verdict.md § "Documentation impact" L96, § "Documentation impact" L97, § "Documentation impact" L99

**Files:**
- Modify: `README.md:378-409`
- Modify: `CHANGELOG.md:1-7`

**Tests:**
- none: user-facing Markdown documentation; no configured Markdown formatter

Decision: Add close mapping documentation adjacent to the existing `## Issue tracker` example and coexistence explanation rather than inventing a new configuration setting - `README.md:378-409` already owns free-form tracker verbs. Keep the shared-core `AGENTS.md` Ticket convention untouched; `AGENTS.core.md` owns that sentence and the approved Documentation impact routes clarification to README.

- [ ] **Step 1: Document defaults and override behavior**

  Add a short close-verb subsection immediately after the Issue tracker example/coexistence text, naming `close:` as a free-form command mapping under `## Issue tracker`, not a sixth Linear setting. Document GitHub's single close-with-evidence command and Linear's evidence-first discuss then status update. Include the delivered -> completed/Done, superseded/premise-contradicted/not-reproduced -> not planned/Canceled, and native duplicate -> duplicate/Duplicate reason map. Explain native duplicate targets and fallback evidence handling.

  State `- close: <command>` replaces the entire resolved operation sequence; teams with renamed Linear terminal states override it. A section rule reserving the mapped state to humans yields a run-by-hand row that writes nothing. Explain that selecting shape-ticket's close row authorizes only its displayed operations and evidence, even where ordinary status changes are "announced, not gated". Keep close distinct from the existing cleanup `close ticket` convention and leave that example intact. Link `skills/shape-ticket/reference/tracker-ladder.md` for capability resolution details.

- [ ] **Step 2: Add the release-note entry**

  Create `## Unreleased` above the current version in `CHANGELOG.md`, with a Changed bullet describing the evidence-backed parent verdict, repair close/create drop choices, and one recommended option. Mention that closing remains explicitly gated and conforming obsolete repairs now reach that gate. Keep the current released heading and version unchanged.

- [ ] **Step 3: Read back the amended documentation against the implementation**

  Compare each operation, reason and override claim with Wave 1's ladder and gate template. Check the link target exists and the touched example's commands keep their documented meanings. Use ASCII punctuation and compact Markdown tables. Documentation impact adds no new guide and invalidates no memory doc; `reference/documentation-impact.md` remains the policy reference, not a new file to create.

- [ ] **Step 4: Commit the user-facing documentation**

  ```bash
  git add README.md CHANGELOG.md
  git commit -m "Document obsolete-ticket close defaults and overrides"
  ```

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L20 | Emit confirmed obsolete reason above Title; no unconfirmed verdict/exit | Task 1 |
| § "Acceptance criteria" L22 | Eligible repair close and create drop beside create anyway | Task 1 |
| § "Acceptance criteria" L24 | Exactly one recommended selectable row; stopped report has none | Task 1 |
| § "Acceptance criteria" L26 | Execute only selected close operations; success, failure and manual outcomes | Task 1 |
| § "Acceptance criteria" L28 | Zero-config close defaults, overriding sequence and forbidden-state manual row | Task 1 |
| § "Acceptance criteria" L30 | Conforming obsolete repair bypasses no-op | Task 1 |
| § "Design" L37 | Parent folds six labels and mode gather before Draft; first confirmed shape | Task 1 |
| § "Design" L41 | Delivered requires merged full-AC diff or opened capability implementation | Task 1 |
| § "Design" L42 | Superseded requires one-hop cancellation/replacement record | Task 1 |
| § "Design" L43 | Contradiction targets load-bearing fact, including removed target | Task 1 |
| § "Design" L44 | Not reproduced compares observation to expected result | Task 1 |
| § "Design" L45 | Repair duplicate requires read body and same failure; create stays with overlap | Task 1 |
| § "Design" L47 | No uncited no-longer-wanted shape | Task 1 |
| § "Design" L49 | Parent owns reads/citation checks; scout and search unchanged; keep draft/roast/diff and gate routing | Task 1 |
| § "Design" L53 | Shared numbered template, eligibility before tag, combined no-write reasons, separate evidence and native duplicate mapping | Task 1 |
| § "Design" L55 | Selection authorizes one payload; drop writes nothing; revisions rerender and override prose cannot waive gate | Task 1 |
| § "Design" L57 | Small skill clauses, size budget, non-conforming routing and matching terminal report lines | Task 1 |
| § "Design" L61 | Add reason map and parent-owned reads | Task 1 |
| § "Design" L65 | GitHub close-with-evidence operation | Task 1 |
| § "Design" L66 | Linear discuss then update with zero-config terminal names | Task 1 |
| § "Design" L68 | Evidence-first, stop on failure, read state/type and narrow state-name carve-out | Task 1 |
| § "Design" L70 | Replacement close mapping, human-only state manual row, no new settings | Task 1 |
| § "Design" L74 | Re-fetch after close pick; terminal no-op, changed-snapshot renewed gate, otherwise execute and continue | Task 1 |
| § "Errors and edge cases" L78 | Failed close stops without retry/body fallback and reports successful prefix | Task 1 |
| § "Errors and edge cases" L79 | Stopped ticket retains audit without close or recommendation | Task 1 |
| § "Errors and edge cases" L80 | Body approval and close are mutually exclusive | Task 1 |
| § "Errors and edge cases" L81 | Run-by-hand selection performs no operation and never reports closed | Task 1 |
| § "Errors and edge cases" L82 | Headless remains gated | Task 1 |
| § "Errors and edge cases" L83 | Combined obsolete/overlap no-write row wins recommendation, enrichment retained | Task 1 |
| § "Errors and edge cases" L84 | No create expected result means no not-reproduced verdict | Task 1 |
| § "Tests" L88 | Contradiction replay: precedence, close operation/evidence, sole tag and diff | Task 1 |
| § "Tests" L89 | Quiet replay: missing-footer gate without obsolete/close, approve recommended | Task 1 |
| § "Tests" L90 | Create replay: confirmed delivered capability, drop recommended, create anyway and no commands | Task 1 |
| § "Tests" L91 | Per-sample reference bundles, unchanged target, intent and full-target verification evidence | Task 1 |
| § "Tests" L92 | Instruction size, eval structural/hygiene checks and generic-skill scan | Task 1 |
| § "Documentation impact" L96 | Amend README close contract and Unreleased changelog | Task 2 |
| § "Documentation impact" L97 | No shared-core or memory-doc edits; README owns gate clarification | Task 2 |
| § "Documentation impact" L99 | Skill/reference deliverables and documentation materiality policy | Task 2 |
| § "Out of scope" L103 | No seventh scout label or scout brief changes | waived: excluded by approved spec |
| § "Out of scope" L104 | No uncited no-longer-wanted shape | waived: excluded by approved spec |
| § "Out of scope" L105 | No reopen, non-close transitions or standalone verdict verb | waived: excluded by approved spec |
| § "Out of scope" L106 | No extraction of whole step 8 menu | waived: excluded by approved spec; existing reference suffices |
| § "Out of scope" L107 | Leave `AGENTS.core.md` and sibling copies unchanged | Task 1 |
