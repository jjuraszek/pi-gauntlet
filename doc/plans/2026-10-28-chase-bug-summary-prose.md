# Chase-bug prose briefing Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Render chase-bug's verdict, reporter draft, and terminal summary as three plain sentences for a non-coder while preserving menus and delivery gates.

**Architecture:** Keep one Verdict shape owner in step 4 and point both step-5 branches at it. Extend the existing text eval with bundled whole-skill inputs, retain the target slice, and extend deterministic replay tests to protect assembly and mechanical facts. Keep the skill edit, samples, intent, and generated records together because they share one candidate assembly and report.

**Tech Stack:** Markdown skills, Node.js node:test, existing text replay and judge harness.

**Spec:** `doc/specs/2026-10-28-chase-bug-summary-prose.md`

**Verification:** `npm test`

---

## Files

**Modify - skill:**
- `skills/chase-bug/SKILL.md` (step 4, both step-5 presentations, golden examples, one red flag).

**Create - eval sample and generated records:**
- `eval/chase-bug/samples/prose-verdict-above-menu/case.md`
- `eval/chase-bug/samples/prose-verdict-above-menu/expected.md`
- `eval/chase-bug/results/prose-verdict-above-menu/baseline.json`
- `eval/chase-bug/results/prose-verdict-above-menu/candidate.json`

**Modify - eval inputs, regression tests, and generated records:**
- `eval/chase-bug/samples/returned-ticket-link/case.md`
- `eval/chase-bug/samples/returned-ticket-link/expected.md`
- `eval/lib/replay.test.mjs`
- `eval/chase-bug/intent.md`
- `eval/chase-bug/results/returned-ticket-link/baseline.json`
- `eval/chase-bug/results/returned-ticket-link/candidate.json`
- `eval/chase-bug/results/menu-after-numbered-findings/baseline.json`
- `eval/chase-bug/results/menu-after-numbered-findings/candidate.json`
- `eval/chase-bug/report.md`

**Delete:** none.

The two supersession banners are already present at `doc/specs/2026-08-23-gh-12-chase-bug-triage-skill.md:3-4` and `doc/specs/2026-08-26-chase-bug-conditional-response-draft.md:3`; retain them without another edit. No cross-cutting documentation wave is needed: the spec lists no material documentation change. Generated records are runner-owned; existing records may remain byte-identical on cache hits.

## Recon and verification boundaries

- `skills/chase-bug/SKILL.md:153-279` owns the menu, citations, and handoff; `:281-374` owns responses and delivery; `:388-417` owns golden examples; `:430-445` owns red flags. Preserve frontmatter and Project overrides.
- `skills/chase-bug/hotfix.md:148-153` uses the fault story as the squash commit body. Its structured reader and commit mechanism do not change.
- `eval/chase-bug/target.json:1-6` assembles only `### 5. Response to origin (human gate 2)` through `## Quick Reference`, with wordCap 500. Whole-skill additions belong to samples, not the target.
- `eval/chase-bug/samples/menu-after-numbered-findings/case.md:1-35` supplies the bundle precedent; its two facts in `expected.md:1-2` stay unchanged. `returned-ticket-link/case.md:1-14` and `expected.md:1-2` own the existing-ticket scenario.
- `eval/lib/replay.mjs:37-58` implements `assemble()` and `parseCase()`; `eval/lib/checks.mjs:14-45` parses facts and `:47-60` implements `runMechanical()`. `eval/lib/replay.test.mjs:20-58` already tests real sample assembly and parsed facts; `:166-186` covers bundles. Extend that file rather than adding a harness.
- `eval/run.mjs:161-220` resolves the base and bundle-free hash, `:320-364` seeds/reuses records, and `:373-391` writes reports. Live evals write tracked records and require auth; run them during implementation, not as read-only planning baseline commands. Deterministic fixture tests do not establish model conformance.
- `package.json:69-73` supplies the bundled verification entrypoint. `scripts/ci.mjs:464-466` discovers eval unit tests, `:516-519` checks size, `:528-543` checks model literals, and `:546-554` lints eval structure. It bundles repository style checks and tests but makes no model calls. No Markdown formatter or separate repository format command is configured. Scoped syntax checking uses `node --check eval/lib/replay.test.mjs`; fixture lint uses `lintTarget()` from `eval/lib/lint.mjs`.

## Baseline provenance

Original execution BASE: `006c8b70`. Initial porcelain inventory: `?? doc/plans/2026-10-28-chase-bug-summary-prose.md`. Admitted exactly that plan path; the dispatched spec path was clean and no in-flight source paths were supplied. Ran the sole task Tests command unchanged: exit 0, 25 tests passed, 0 failed. Post-run HEAD remained `006c8b70` and porcelain remained the same single untracked plan path; no generated artifacts or tracked-source contamination.

Amendment BASE: `896a9adb`. Initial porcelain inventory: ` M doc/specs/2026-10-28-chase-bug-summary-prose.md`. Admitted that dispatched spec path, also explicitly supplied under In-flight; no source edits were present. `git diff --quiet 006c8b70 HEAD -- . ':!doc/specs/' ':!doc/plans/'` exited 0 at this BASE. Retained 1 bullets: `006c8b70` -> `896a9adb`, tree-equivalent outside `doc/specs`, `doc/plans`. The sole Tests command is unchanged; no deterministic rerun or live eval was needed for this amendment.

## Wave 1 - Briefing shape and regression evidence

One task owns the skill and target records to avoid concurrent writes to the same report, intent, and replay cache.

### Task 1: Replace chase-bug briefing templates and record eval conformance

**TDD scenario:** Modifying tested code - run existing tests first, add fixture regression assertions, observe red, implement skill and fixture changes, then run deterministic and live eval checks.

**Spec:** doc/specs/2026-10-28-chase-bug-summary-prose.md § "Problem" L24, § "Acceptance criteria" L32-L42, § "Design" L47-L49, § "Remove" L53-L59, § "Add" L63-L64, § "Add" L66-L86, § "Add" L89-L103, § "Eval (`eval/chase-bug/`)" L107-L123, § "Errors and edge cases" L127-L133, § "Tests" L137-L144, § "Documentation impact" L149-L153, § "Out of scope" L157-L160

**Files:**
- Modify: `skills/chase-bug/SKILL.md:153-445`
- Create: `eval/chase-bug/samples/prose-verdict-above-menu/case.md`
- Create: `eval/chase-bug/samples/prose-verdict-above-menu/expected.md`
- Create: `eval/chase-bug/results/prose-verdict-above-menu/baseline.json`
- Create: `eval/chase-bug/results/prose-verdict-above-menu/candidate.json`
- Modify: `eval/chase-bug/samples/returned-ticket-link/case.md:1-14`
- Modify: `eval/chase-bug/samples/returned-ticket-link/expected.md:1-2`
- Modify: `eval/lib/replay.test.mjs`
- Modify: `eval/chase-bug/intent.md`
- Modify: `eval/chase-bug/results/returned-ticket-link/baseline.json`
- Modify: `eval/chase-bug/results/returned-ticket-link/candidate.json`
- Modify: `eval/chase-bug/results/menu-after-numbered-findings/baseline.json`
- Modify: `eval/chase-bug/results/menu-after-numbered-findings/candidate.json`
- Modify: `eval/chase-bug/report.md`
- Test: `eval/lib/replay.test.mjs`

**Tests:**
- `node --test eval/lib/replay.test.mjs`
- baseline: 896a9adb pass
- via: `assemble()`, `parseCase()`, `parseExpected()`, `runMechanical()`; `eval/lib/checks.mjs` whole-output mechanical checks.

Decision: Record held facts as prose under `## Change`, with only directional moves under `## Expected to move` - `eval/lib/intent.mjs:27-35` only accepts directional bullets there; `eval/README.md` Intent and Judge sections define unchanged outcomes. For mixed baseline outcomes across replay models, name that observation in the fails -> holds rationale; never claim both failed. Apply this to `returned-ticket-link/no-fence`: declare its failing baseline's move and state that the other baseline remains held, not that both were already held.

Decision: Keep menu-selection echoes under the shared mapping rule, outside the story/draft/summary sentence and word budgets - `skills/brainstorming/reference/menu-layout.md:35-39` requires a mapped reply echo before acting, and `eval/chase-bug/samples/menu-after-numbered-findings/expected.md:2` checks that echo before the summary. The Verdict shape owner alone specifies this boundary; do not change the shared rule or sample.

Decision: Live eval runs remain implementation steps because they generate tracked evidence. The file-addressable node:test regression protects fixtures during planning; only the full target's report proves model behavior.

- [ ] **Step 1: Run existing tests and read the instruction owner.**

  Run: `node --test eval/lib/replay.test.mjs`

  Expected: all existing tests pass with at least one executed. Read the whole skill, sample files, saved candidates, target, intent, and `/skill:forge-skill` authoring rules. Follow imperative voice, minimal changed units, one rule owner, present tense, and ASCII punctuation. Keep the shape skill-local: never reference or rely on `AGENTS.md` or `AGENTS.core.md` Communication Style. Leave `skills/chase-bug/hotfix.md` unchanged.

- [ ] **Step 2: Add regression assertions to the existing replay tests.**

  Extend the checks import with `runMechanical`. Add `chase-bug prose samples preserve slices and reject label leaks`, using existing `treeReader`, `parseCase`, `assemble`, and `parseExpected`. Assert the sole target skillFiles entry remains `{ path: "skills/chase-bug/SKILL.md", slice: "### 5. Response to origin (human gate 2)", sliceTo: "## Quick Reference" }`. Assert the new case bundles menu-layout then full chase-bug, and returned-ticket bundles full chase-bug alone. Assert each assembly includes the full skill and the step-4 Verdict shape owner, including its menu-selection echo exclusion and whole-render label scope, and facts contain the specified ids.

  Read actual expected.md files rather than duplicating their regex in tests. Select `no-labels` and assert each of `Fault story:`, `Proof:`, `Symptom:`, `Verdict:`, `Evidence:`, `Next step:` fails plain and emphasized (including `**Symptom:**`), after preceding prose and on later lines, in headings and in supporting evidence below the story. Assert prose followed by `Pick one:` and `eligible - all predicates pass` holds. Select returned-ticket's `no-fence` and assert triple-backtick fenced text fails while inline code passes. Require the new sample's no-fence fact to be judged, not a whole-output fence ban. Do not change production parser or replay code.

- [ ] **Step 3: Confirm regression red.**

  Run: `node --test eval/lib/replay.test.mjs`

  Expected: new test fails because the new sample or returned-ticket bundle/facts are absent; existing tests remain green. Keep failure evidence.

- [ ] **Step 4: Create the two-checkpoint sample and seven facts.**

  Start new `case.md` with:

  ```text
  bundle+: skills/brainstorming/reference/menu-layout.md
  bundle+: skills/chase-bug/SKILL.md
  ```

  Ask for one response with two independent checkpoints, no tools, simulated writes/handoffs. Checkpoint 1: step 4, free-text origin, target none, clean baseline, completed no-match search, local repro and falsification confirm `/widgets/` returns 404 instead of 200 at `src/router.ts:88` because paths are compared without normalization; all six hotfix predicates pass; generate the gate and stop. Checkpoint 2: independent GitHub-issue origin, response target set, `gh` available and channel `gh issue comment`, `cannot-replicate` after Chrome and Firefox clean-profile attempts both render the page, report lacks browser and version, human picked `Respond to reporter`; show draft with `send it`, no push.

  Write expected.md with these fact prefixes and scopes:

  - `no-fence: judged:` - story above `Pick one:` and draft are unfenced; exclude menu, deep evidence, confirmation.
  - `no-labels: mechanical: matches NO_LABELS` - substitute the exact regex below for `NO_LABELS`, checking the whole output.
  - `three-sentences: judged:` - exactly three sentences in each of those two spans.
  - `under-80-words: judged:` - each span under 80 words; exclude menu, eligibility, confirmation.
  - `plain-reader: judged:` - role-named component, visible proof, claim-supporting file/line/SHA/link after the claim in the same sentence, never opening it; reported symptom `/widgets/` may open sentence one.
  - `menu-intact: judged:` - four rows `1.`-`4.`, one `[recommended]`, eligibility, separated by `Pick one:`.
  - `draft-asks-reporter: judged:` - third sentence asks for browser and version, draft has `send it` confirmation, no push claim.

  ```text
  - no-labels: mechanical: matches /^(?:(?!(?:Fault story|Proof|Symptom|Verdict|Evidence|Next step):)[\s\S])*$/
  ```

- [ ] **Step 5: Extend returned-ticket without weakening original facts.**

  Prepend `bundle+: skills/chase-bug/SKILL.md`. Preserve the existing-ticket result and both original facts. Add the same no-labels regex, judged summary-only three-sentences, under-80-words, and plain-reader facts. Add no-fence as mechanical lacks with a quoted literal value of three backticks. Keep `samples/menu-after-numbered-findings/` under the target unchanged, including its `layout` and `mapped-pick` facts. Keep `target.json` unchanged.

- [ ] **Step 6: Seed live baselines before writing intent.**

  Run: `node eval/run.mjs chase-bug --baseline-only`

  Expected: exit 0, baseline seeded or fresh, successful outputs for both configured replay models on all three samples. Intent parsing is bypassed and changed bundles reseeded from the git baseline skill. Read each seeded output and evaluate new facts within their stated scopes before predicting movements. For returned-ticket/no-fence, use the reseeded bundled outputs, not the older unbundled candidates: the amended spec records one fenced baseline and one unfenced baseline. On auth/runtime error or refusal, stop and report; never fabricate records, change frozen models, or substitute deterministic tests for live evidence.

- [ ] **Step 7: Install Verdict shape and adjust the handoff.**

  Change the introductory colon to a period, remove the old fenced fault-story/proof template, then insert the following Markdown without a surrounding fence:

  ```markdown
  **Verdict shape.** Write for a reader who does not know the code the bug
  touches. Apply the three-sentence and under-80-word limits only to the story,
  draft, or summary itself. Keep menu-selection echoes outside those spans and
  under the shared menu-layout rule, not this shape. Write three whole sentences,
  under 80 words, in plain chat text: what happened, in the reporter's own terms; what it means - the verdict and one
  proof the reader can see (a before/after value or the one repro line); what
  the human decides or does next, and why. Name a component by what it does
  ("the part that matches URLs to pages"), never by its file alone. Put the
  file, line, commit, or link at the end of the sentence it supports, after the
  role name ("the matcher in the router, `src/router.ts:88`"). No code fence
  around the story. Omit the six label prefixes everywhere in all rendered text,
  including headings and deep evidence below the story - `Fault story:`, `Proof:`,
  `Symptom:`, `Verdict:`, `Evidence:`, `Next step:` - plain or emphasized (`**Symptom:**`);
  `Pick one:` is the menu separator and the eligibility line stays, neither is
  a label. No `->` chains.
  Example: "Opening `/widgets/` with a trailing slash shows the 404 page while
  `/widgets` works. The part that matches URLs to pages compares the text
  exactly instead of ignoring the slash, so the page is never found (the
  matcher in the router, `src/router.ts:88`; `curl /widgets/` returns 404 where
  200 is expected). Ignoring the slash in that one comparison is a small, safe
  fix, so the hotfix is the recommended pick below."
  ```

  Preserve the Deep evidence paragraph immediately after it. In the handoff, replace the prefix `the evidence pack (fault story; trigger, ...` with `the evidence pack (fault story - sentences one and two of the Verdict shape, never the decision sentence; trigger, ...`, retaining the actual trailing fields rather than writing an ellipsis into the skill. Keep the structured `$TMPDIR/hotfix-<slug>.md` pack and `hotfix.md` consumer unchanged: only sentences one and two become its fault story, so no decision prompt enters the squash body.

  Replace the negative-verdict lead with: "For a negative verdict, render the Verdict shape - sentence two names the verdict in plain words with its citation trailing - then a short numbered menu:". Remove only the verdict line and following blank from its fence. Keep both menu rows and fence, menu-layout reads, all five named citation sources, uncited-verdict red flag, discovery-ticket handling, numeric mapping, `[ ]`/`[x]` checkboxes, and the single `[recommended]` tag unchanged.

- [ ] **Step 8: Point both response branches at the owner.**

  Remove `**Draft template:**` and its fence, replacing them with:

  ```text
  Write the draft in the Verdict shape (step 4); its third sentence names the reporter's next step - the ticket link, the fix branch or SHA, the correct usage, or the input the reporter supplies.
  ```

  Remove `**Summary template** (same four fields as the draft - the difference is framing and delivery, not headings):` and its fence, replacing them with:

  ```text
  Render the summary in the Verdict shape (step 4); its third sentence names what happens next - the ticket link, the fix branch or SHA, the correct usage, or what input is missing.
  ```

  Preserve channel register, resolution, confirmation, fallback, and the following summary-versus-draft paragraph. For cannot-replicate, a draft asks for input while the summary states its absence as fact. Add no runtime guard or duplicate citation rule.

- [ ] **Step 9: Replace golden presentations and red flag.**

  Use the exact three-sentence story from the owner's example as the unfenced real-bug golden story, followed by `Pick one:` and a fence containing only the unchanged four rows and `eligible - all predicates pass`. Preserve the menu-layout read and addressable-origin note.

  Retain `(citation-source contrast)`, remove the negative example's outer fence and `not-a-bug:`, `intended-behavior:`, `Citation:` labels. Use these two unfenced three-sentence stories separated by the existing contrast marker:

  Opening `/widgets/` shows the 404 page rather than the requested page. The part that matches URLs to pages leaves trailing slashes unchanged, so this is the documented behavior, not a bug (the API doc's routing section). Explain that contract to the reporter so they can use the URL without the trailing slash.

  Opening `/widgets/` shows the 404 page rather than the requested page. The part that matches URLs to pages no longer strips trailing slashes because normalization was removed on purpose (commit `a1b2c3d`). Point the reporter to that decision so they can understand why the URL must omit the slash.

  Replace the old wall-of-text red flag with "Rendering the story, draft, or summary inside a code fence or as `Label:` lines". Preserve existing citation/evidence enforcement; no visible proof in sentence two still violates the existing evidence bar.

- [ ] **Step 10: Write observed intent and the new assembly hash.**

  Compute bundle-free `skillSha`:

  Run: `node --input-type=module -e 'import {readFileSync} from "node:fs"; import {assemble,treeReader} from "./eval/lib/replay.mjs"; import {sha256} from "./eval/lib/checks.mjs"; const target=JSON.parse(readFileSync("eval/chase-bug/target.json","utf8")); console.log(sha256(assemble(target,treeReader(process.cwd()))));'`

  Put the printed hash after `for:` in `intent.md`. Describe Verdict shape under `## Change`, including story-only budgets and the whole-render label rule, and use `## Expected to move` for movements. Include `returned-ticket-link/no-labels: fails -> holds`. Include `returned-ticket-link/no-fence: fails -> holds` with a rationale recording the mixed reseeded baselines: one fences the summary and must move, while the other is already unfenced and stays held. State the held half under `## Change` too; never claim both were held or both failed. Inspect seeded outputs for every other new fact: list observed failures as `fails -> holds`; describe already-held facts as held, never promise a speculative move. Preserve `returned-ticket-link/returned-reference`, `returned-ticket-link/no-new-creation`, `menu-after-numbered-findings/layout`, and `menu-after-numbered-findings/mapped-pick` as held expectations, replacing the obsolete menu movement promises. Never edit saved output or judgments by hand.

- [ ] **Step 11: Confirm deterministic green and targeted live conformance.**

  Run: `node --test eval/lib/replay.test.mjs`

  Expected: existing and new assertions pass. Run the changed scenarios separately:

  Run: `node eval/run.mjs chase-bug prose-verdict-above-menu`

  Run: `node eval/run.mjs chase-bug returned-ticket-link`

  Expected: exit 0 and every candidate fact holds for both replay models. Read candidate text and judgments; zero exit alone can include pre-existing failures. Check the six prefixes across headings and supporting evidence as well as story/draft/summary spans; apply sentence and word budgets only to those spans, never a menu-selection echo. Batch only spec-scoped wording repairs, update intent hash after skill edits, and rerun affected samples. Never widen intent to accept a missed fact.

- [ ] **Step 12: Check syntax, fixture lint, and size.**

  Run: `node --check eval/lib/replay.test.mjs`

  Run: `node --input-type=module -e 'import assert from "node:assert/strict"; import {lintTarget} from "./eval/lib/lint.mjs"; assert.deepEqual(lintTarget("eval/chase-bug"),[]); console.log("chase-bug fixture lint passes");'`

  Run: `wc -l skills/chase-bug/SKILL.md`

  Run: `wc -c skills/chase-bug/SKILL.md`

  Expected: no errors, fewer than 500 lines and 50,000 bytes. Review Markdown manually against forge-skill; no formatter is configured. The header verification gate runs `scripts/ci.mjs`, including `scripts/skill-size-lint.mjs`, but its 2,000-line backstop does not replace these local counts. Require that gate to pass before completion.

- [ ] **Step 13: Check untouched surfaces and existing supersession banners.**

  Confirm no diff in hotfix, target slice, shared `menu-layout.md`, other skills, older spec bodies, README files, or CHANGELOG. Preserve `CHANGELOG.md - deferred: release`; do not repair the stale inventory sentence in `eval/chase-bug/README.md`.

  In `doc/specs/2026-08-23-gh-12-chase-bug-triage-skill.md`, retain this existing banner under its earlier one: `> **Superseded by:** [doc/specs/2026-10-28-chase-bug-summary-prose.md](./2026-10-28-chase-bug-summary-prose.md) - the step-4 fault-story presentation clause only`.

  In `doc/specs/2026-08-26-chase-bug-conditional-response-draft.md`, retain this existing banner above `## Context`: `> **Superseded by:** [doc/specs/2026-10-28-chase-bug-summary-prose.md](./2026-10-28-chase-bug-summary-prose.md) - the draft template and the summary template ("same four fields") clauses only`.

  Confirm no provider/model literals enter the skill and no local Communication Style reference is introduced. These are preservation checks, not new doc edits.

- [ ] **Step 14: Generate the final full-target report.**

  Run: `node eval/run.mjs chase-bug`

  Expected: exit 0, non-partial `report.md` includes all three samples and both replay models, with every required candidate fact holding, including layout and mapped-pick. Check the mapped-pick echo precedes the summary and remains outside its three-sentence/80-word budgets. Commit runner-written records and `eval/chase-bug/report.md`. Refused, errored, inconclusive, regressed, partial, or fact-failing results block completion; never hand-author evidence or claim a pass from an older report.

- [ ] **Step 15: Commit the behavior and its evidence.**

  ```bash
  git add skills/chase-bug/SKILL.md eval/lib/replay.test.mjs eval/chase-bug/samples/prose-verdict-above-menu eval/chase-bug/samples/returned-ticket-link eval/chase-bug/intent.md eval/chase-bug/results eval/chase-bug/report.md
  git commit -m "Render chase-bug briefings as three plain sentences" -m "Behavior change: replace labeled output templates with a skill-local Verdict shape; include the chase-bug eval intent, regression assertions, and generated report."
  ```

  Stage only declared changes. The body classifies this as behavior change, not meaning-preserving wording. Do not release or change versions.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Problem" L24 | Keep output shape independent of repository Communication Style | Task 1 |
| § "Acceptance criteria" L32-L42 | Three sentences, under 80 words, above separator, without labels or fence | Task 1 |
| § "Acceptance criteria" L32-L42 | Role-named component, visible proof, trailing provenance | Task 1 |
| § "Acceptance criteria" L32-L42 | Draft and summary share shape; preserve register and missing-input framing | Task 1 |
| § "Acceptance criteria" L32-L42 | Preserve checkboxes, recommendation, separator, eligibility and numeric mapping | Task 1 |
| § "Acceptance criteria" L32-L42 | Skill below 500 lines and 50,000 bytes; require header verification pass | Task 1 |
| § "Acceptance criteria" L32-L42 | Full target passes and committed report covers three samples | Task 1 |
| § "Design" L47-L49 | Skill owns behavior; obey forge-skill and preserve hotfix | Task 1 |
| § "Design" L47-L49 | Retain two already-landed banners and older bodies | Task 1 |
| § "Remove" L53-L59 | Remove fenced fault story and proof template | Task 1 |
| § "Remove" L53-L59 | Remove negative menu verdict and blank line, not rows/fence | Task 1 |
| § "Remove" L53-L59 | Remove draft label and four-line fence | Task 1 |
| § "Remove" L53-L59 | Remove summary lead and four-line fence | Task 1 |
| § "Remove" L53-L59 | Remove real-bug golden outer fence and labels | Task 1 |
| § "Remove" L53-L59 | Remove negative golden fence, verdict openers, citation labels | Task 1 |
| § "Remove" L53-L59 | Replace obsolete wall-of-text red flag | Task 1 |
| § "Add" L63-L64 | Insert owner after the step-4 introductory sentence | Task 1 |
| § "Add" L66-L86 | Install prescribed paragraph with three sentence roles and length cap | Task 1 |
| § "Add" L66-L86 | Apply sentence and word budgets only to story/draft/summary; keep menu-selection echoes under shared mapping rule | Task 1 |
| § "Add" L66-L86 | Name component by function and trail provenance after role | Task 1 |
| § "Add" L66-L86 | Prohibit story fences and arrows; exempt separator/eligibility from labels | Task 1 |
| § "Add" L66-L86 | Omit all six label prefixes across rendered text, including headings and deep evidence, plain or emphasized | Task 1 |
| § "Add" L66-L86 | Use prescribed 69-word example | Task 1 |
| § "Add" L89-L103 | Preserve deep evidence below story | Task 1 |
| § "Add" L89-L103 | Handoff stores sentences one and two, not decision; keep fields | Task 1 |
| § "Add" L89-L103 | Negative lead names shared shape and trailing citation | Task 1 |
| § "Add" L89-L103 | Draft references shared shape and reporter next step | Task 1 |
| § "Add" L89-L103 | Summary references shape; preserve distinction paragraph | Task 1 |
| § "Add" L89-L103 | Preserve citation-source rule without duplication | Task 1 |
| § "Add" L89-L103 | Real-bug golden story is unfenced, followed by separator and fenced menu | Task 1 |
| § "Add" L89-L103 | Negative contrast has two three-sentence stories, specified phrases and citations | Task 1 |
| § "Add" L89-L103 | Red flag rejects fenced/labeled story, draft, summary | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Whole-output regex rejects six prefixes, plain and emphasized | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | New sample bundles menu/full skill and simulates two checkpoints without tools | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Checkpoint 1 supplies clean real-bug evidence and passing predicates | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Checkpoint 2 supplies addressable failed repro, missing browser/version, confirmation | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Judge no-fence on two prose spans only | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Check labels mechanically over whole reply | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Judge exactly three sentences per span | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Judge under 80 words per span, excluding surrounding menu/gate | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Judge role, visible proof, trailing provenance with symptom URL exception | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Judge four rows, recommendation, eligibility, separator | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Judge third-sentence request, confirmation and no push claim | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Bundle returned-ticket skill and add five summary facts; preserve slice | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Preserve existing menu sample and both facts | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Rewrite bundle-free hash and describe shape | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Declare label move and mixed reseeded no-fence baselines: one fails -> holds, the other stays held; observe other facts first | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Keep original ticket and menu facts held | Task 1 |
| § "Eval (`eval/chase-bug/`)" L107-L123 | Seed after sample edits, write intent, run target, commit evidence | Task 1 |
| § "Errors and edge cases" L127-L133 | Negative citations trail sentence two; uncited verdict remains red flag | Task 1 |
| § "Errors and edge cases" L127-L133 | Missing input is fact in summary and request in draft | Task 1 |
| § "Errors and edge cases" L127-L133 | Structured hotfix record intact; exclude decision from commit story | Task 1 |
| § "Errors and edge cases" L127-L133 | Preserve channel tone | Task 1 |
| § "Errors and edge cases" L127-L133 | Fence leak fails eval; add no runtime guard | Task 1 |
| § "Errors and edge cases" L127-L133 | Visible proof retains evidence bar | Task 1 |
| § "Errors and edge cases" L127-L133 | Measure local size bounds separately from CI backstop | Task 1 |
| § "Tests" L137-L144 | Live facts cover story, summary, draft and menu regressions | Task 1 |
| § "Tests" L137-L144 | Run line and byte counts | Task 1 |
| § "Tests" L137-L144 | Check untouched hotfix and negative contrast without claiming a new citation eval | Task 1 |
| § "Documentation impact" L149-L153 | Leave release-owned CHANGELOG update deferred | Task 1 |
| § "Documentation impact" L149-L153 | Leave README surfaces, including stale inventory, unchanged | Task 1 |
| § "Out of scope" L157-L160 | Preserve menu contract and output mapping | Task 1 |
| § "Out of scope" L157-L160 | Preserve hotfix implementation and record format | Task 1 |
| § "Out of scope" L159 | Other skills' human-facing renders | waived: excluded by spec |
| § "Out of scope" L157-L160 | Keep slice unchanged and use sample bundles | Task 1 |
