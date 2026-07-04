# Docs as First-Class Origin + Review-Stack Dedup + Self-Hosted Workflow Mandate

**Source:** GitHub issue [#1](https://github.com/jjuraszek/pi-gauntlet/issues/1) (Part A, inlined verbatim in the Appendix). Parts B through E are extensions raised during brainstorming. B and C share issue #1's own non-goal "no second/third pass" (anti-redundancy, applied to code review and to ephemeral artifacts); D is a repo-specific self-hosting fix - make pi-gauntlet develop *through* its own gauntlet; E codifies an existing-but-unwritten skill-file placement convention (`reference/` vs sibling). D and E are same-worktree doc edits surfaced during this session, not from issue #1.

## Problem

Five gaps in the gauntlet workflow. The first three are unified by one theme - what belongs in the durable record, and verifying it exactly once; the fourth is a self-hosting gap (this repo does not make its own contributors use the workflow); the fifth codifies a skill-file placement convention the repo already follows but never wrote down. The last two are bundled as same-worktree doc edits surfaced in the same session - Part D from the self-hosting question, Part E while placing Part A's new reference doc.

1. **Memory docs rot invisibly (issue #1).** Markdown docs are a project's durable memory - routers (`AGENTS.md`), topic guides, contracts, READMEs. As code changes, that layer rots: the closing-loop `conformance-reviewer` audits the deliverable against the *origin* (spec + prompt), and memory docs are almost never named in the origin, so a stale router is invisible to it. The fix is not a new closure step; it is making docs a first-class origin requirement so the *existing* single conformance pass already covers them.

2. **The post-execution review stack runs the same whole-diff code review twice, plus an auto-fired consumer skill.** In `subagent-driven-development` "After All Tasks Complete":
   - Step 1 dispatches a "final reviewer over the full diff."
   - Step 2 runs `/skill:requesting-code-review` "against the worktree's full diff vs main."
   `requesting-code-review` dispatches the same `code-reviewer` persona over the same whole-diff scope as step 1 - same reference point, run twice. They are literal duplicates. Step 2 then also auto-invokes any project-specific audit skill (SDD's example path is `.agents/skills/self-audit/`) with "Do not ask the user - just run it." A consumer's project audit is typically optional and opt-in, yet pi-gauntlet auto-firing a *consumer's* skill unprompted is a layering violation.

3. **The PR finish path leaks the ephemeral plan doc onto the base branch.** `finishing-a-development-branch` Option 1 (squash-merge) deletes `doc/plans/<plan>.md` ("Plans are ephemeral"). Option 2 (Push + PR) does not - it pushes the branch as-is, so the plan rides the PR onto base when it merges. The two landing paths are asymmetric.

4. **This repo does not dogfood its own workflow.** `AGENTS.md`'s `## Development` section documents *mechanical* edit steps ("Adding a skill", "Modifying an agent", "Modifying an extension") but never states that a non-trivial change must ride the pipeline (brainstorm -> plan -> implement -> verify -> ship). In a consumer repo the work presents as a feature, so `brainstorming` triggers; here the work *is* "edit a skill file," which reads as a direct edit, and agents skip the workflow (observed repeatedly - it holds in consumer repos but not here). pi-gauntlet ships no `.pi/gauntlet-overrides.md`, so `AGENTS.md` - always in context - is the only surface where the mandate can live.

5. **The skill-file placement convention is unwritten.** `writing-skills` documents `reference/` (line 42: "the pi pattern for keeping SKILL.md tight while still shipping deep guidance") but never states the other half: prompt templates / dispatch payloads - filled and passed to a subagent - live as **siblings** next to `SKILL.md` (`requesting-code-review/code-reviewer.md`, the three `subagent-driven-development/*-prompt.md`). The convention is real and consistently followed for templates, but only *implied*; the directory-layout diagram (line 39) even miscalls "examples" a sibling though the canonical example puts `examples.md` in `reference/`. Surfaced directly by Part A: choosing sibling-vs-`reference/` for the new doc meant reverse-engineering an unwritten rule.

## Goals

- Formalize docs as origin requirements verified by the *existing* conformance pass - no new pass, agent, or file family (issue #1 verbatim).
- Collapse the duplicated whole-diff code review into a single pass and remove the consumer-skill auto-invoke, leaving two post-execution axes: code quality (`requesting-code-review`) and intent (`conformance-reviewer`).
- Make plan-doc removal symmetric across every finish path that lands on base.
- Make this repo dogfood its own gauntlet: `AGENTS.md` mandates the full pipeline for non-trivial changes so contributors (human or agent) *enter* the workflow instead of hand-editing skill/agent/extension files directly.
- State the skill-file placement rule in `writing-skills` so it is documented, not inferred: dispatch-payload templates as siblings to `SKILL.md`, deep guidance in `reference/`.

## Non-goals

From issue #1 (Part A):

- In-code doc comments (RDoc/JSDoc) - out of scope; md files only.
- A dedicated `doc-author` persona - `implementer` is already the edit-capable actor.
- A second/third conformance pass - the single pass suffices once docs are in the origin.
- The `verify`-phase stale-doc grep advisory (issue #1 "Follow-up") - separate ticket.

Parts B-E:

- **No change to any in-execution review.** The per-task spec-review and code-review inside the execution loop ("The Process" steps 3-6), and Parallel-Wave Mode's per-task spec review + per-wave quality review, are untouched. They run at a different reference point (early catch before issues compound) and are not the duplication Part B targets. Part B edits **only** the "After All Tasks Complete" post-execution section.
- No change to how implementers run, how waves are grouped, or how conformance remediation loops.
- No new settings key anywhere in this change.
- **Part D adds no runtime guard.** The existing flow-guards (phase-tracker worktree discipline + spec-phase confinement) already enforce discipline *once the workflow is entered*; they cannot force entry. Part D is the instruction that gets contributors to enter it - a doc edit, not an extension change.
- **Part E does not normalize the existing layout.** It states the rule; it does not move older skills' flat deep-guidance `*.md` files (e.g. `systematic-debugging/root-cause-tracing.md`) into `reference/`. That housekeeping is a separate PR (surface, don't auto-fix).

## Design

Coordinated edits to gauntlet skill docs. One new file - Part A's `documentation-impact.md` reference doc; otherwise no new agents, extensions, or settings keys. All artifacts here are LLM-readable (skill bodies, spec docs) and stay structured.

### Part A - docs as first-class origin (issue #1)

Three moves, no new pass:

1. **Spec gets a required "Documentation impact" section, gated by a shared materiality bar.** Promote `brainstorming` section 6 from a loose prompt into a mandatory spec section. **Scope of the section:** it tracks *product-facing docs* - README, `AGENTS.md`, CHANGELOG, external / API contracts, and genuinely-new standalone guidance docs. Skill / agent bodies and their `reference/` sub-docs are the *deliverable* (code-equivalent) and belong in the plan's implementation surface, **not** here - otherwise the section just restates the diff. Within that scope, enumerate three doc classes:
   - *Feature / user-facing docs introduced* (README, API contracts, CHANGELOG, topic guides).
   - *Materially amended* existing product docs - a new `AGENTS.md` section, a changed contract.
   - *Derived / memory docs invalidated* - router entries (`AGENTS.md` sections), topic guides, taxonomy indexes.
   "none" per class is a valid, explicit answer; so is "deferred: <trigger>" for a doc that changes on a known later event (e.g. `CHANGELOG.md - deferred: release`), so conformance does not flag its absence now. Naming a doc here puts it in the origin - that is the entire fix: origin-anchored conformance now sees it.

   The **materiality bar** - what earns a doc, what does not, and where it goes - is generic methodology reused by several skills, so it lives in its **own home** as a shared reference doc, `skills/brainstorming/reference/documentation-impact.md` (following the `verification-before-completion/reference/conformance-check.md` pattern: one reference doc, many referrers). Governing principle: **document what the code cannot tell you**; the section is a *filter with default "none,"* not a prompt to produce. A doc earns its place only by clearing one bar:
   - **Major procedures / conventions** - how work is done here (workflow, review, release discipline).
   - **Operations / tunable parameters** - env vars, thresholds, feature flags, runbook / recovery.
   - **Communication contracts / integrations** - API / wire / queue contracts, cross-component boundaries.
   - **Architecture** - module boundaries, data flow, structural decisions.
   - **Major definitions** - the canonical definition of a load-bearing domain term / concept / invariant that multiple components depend on and no single code location fully owns.
   - **Non-obvious rationale / decisions that outlive the PR** - the "why," and why-not-the-obvious-alternative.
   - **Security, data-access & permissions** - trust boundaries, who-can-access-what, data-handling and permission decisions.

   **Excluded (extends issue #1's RDoc/JSDoc non-goal to standalone files):** per-symbol / per-module narration; restating signatures, types, or schemas the code owns; "how it works" that reading the code answers; anything needing an edit on every code change (the code-mirror tell). **Amend over create:** clear the bar -> extend the canonical existing doc; a new standalone `.md` only when no existing doc owns the topic (the anti-proliferation rule).

2. **Execution owns the writing.** Doc updates become real plan tasks, edited by the existing `implementer`. Task-local docs ride their task; cross-cutting / index docs go in a **dedicated trailing doc-only wave** (docs describing settled behavior get written once, after code stops moving; an isolated wave keeps them file-disjoint from code tasks so wave-grouping's pairwise-disjoint contract stays valid).

3. **Conformance mechanism is unchanged; its scope expands to docs.** It already audits "code AND docs vs origin"; the *mechanic* does not change. Because docs are now origin requirements, the existing single pass verifies them together - same dispatch, wider coverage.

**Accepted residual gap (from issue #1):** spec-time enumeration only catches docs the author anticipated. A derived doc nobody listed still goes stale invisibly. Accepted for v1 - spec review and code review already pressure-test the doc list, and the cost is far below a mandatory closure wave. Likewise, a `deferred: <trigger>` entry is not tracked to its trigger by any machinery - re-checking it when the trigger fires is left to the author / release process; automated deferral-tracking is a follow-up, not built here (YAGNI).

### Part B - review-stack dedup

Target: `subagent-driven-development` "After All Tasks Complete" only. The standalone `verification-before-completion` skill does not carry this stack (confirmed: it references `requesting-code-review` as a follow-up and conformance as the closing loop, but does not itself run a final-reviewer + requesting-code-review + audit sequence).

**Boundary (do not blur):** the execution loop's reviews - per-task spec-review and code-review in "The Process" (steps 3-6), and Parallel-Wave Mode's per-task spec review + per-wave quality review - are **out of scope and unedited**. They fire during execution at a different reference point (catch issues before they compound). What *does* change: the *post-execution* "After All Tasks Complete" section, plus the one-line **closing handoff** at the end of "The Process" (`SKILL.md:63`, "After all tasks: dispatch a final reviewer over the full diff") - that line points *into* the post-execution section and names the pass being merged, so it is edited; it is not a per-task review step. Every "step N" below refers to the "After All Tasks Complete" section unless stated otherwise.

- **Merge the duplicated whole-diff review.** Both duplicated passes live in **"After All Tasks Complete"** (the post-execution section), not the execution loop. Collapse that section's step 1 (final reviewer over the full diff) and the `requesting-code-review` half of its step 2 into a single step: run `/skill:requesting-code-review` over the full diff vs `main`. Keep "Address Critical and Moderate findings before handoff." `requesting-code-review` *is* the final whole-diff review; this is a merge, not a coverage cut.
- **Remove the project-specific audit auto-invoke.** Drop the "if the project ships a project-specific audit skill ... Do not ask the user - just run it" block. Consumers wanting an in-flow audit wire it via `.pi/gauntlet-overrides.md` (SDD already reads it via its "Project overrides" block). The supported form is an explicit manual `/self-audit` or a consumer-documented step - not a re-created default-on hook.
- **Result:** two post-execution passes - code quality (`requesting-code-review`) then intent (`conformance-reviewer`, its own dispatch, never fused) - down from four.

The two axes are distinct and neither is redundant:

- `requesting-code-review` finds quality bugs in what was built.
- `conformance-reviewer` finds requirement drift vs origin and drives remediation (propose gaps -> disposition menu `fix`/`accept`/`rescope` -> `implementer` fix or spec amendment -> bounded re-audit). Not a code-quality review; the skill is emphatic it must never be fused into the whole-PR review.

### Part C - plan-doc cleanup parity

Target: `finishing-a-development-branch`. Make plan-doc removal symmetric on every path that lands on base. The plan is ephemeral and is not a review artifact - reviewers read code and the durable spec, not the plan - so it is removed via explicit `git rm` before the PR is presented (deterministic, independent of the GitHub merge-button choice).

- **The `Option 2: Push and Create PR` block** (shared by the standard menu's Option 2 and the detached-HEAD menu's Option 1): before `git push`, if `doc/plans/<plan>.md` exists, `git rm` it and commit.
- **Option 1 (squash-merge)**: already deletes the plan - unchanged.
- **In-flow visibility (accepted):** the in-flow `requesting-code-review` and `conformance-reviewer` run against "full diff vs main," which includes the committed plan. Left as-is: in-flow the plan is the execution *contract* reviewers may legitimately consult; the "must not be reviewed" intent targets the durable/PR record, which this part fixes. Not excluded from in-flow diffs.
- **Excluded:** Option 3 (Keep as-is - branch not landing yet; plan removed when it eventually finishes) and Option 4 (Discard - whole branch goes).

### Part D - self-hosted workflow mandate

Target: `AGENTS.md` (repo root). pi-gauntlet is the framework, but *developing* it must use the framework - a non-trivial change here rides the full pipeline, same as in any consumer.

The observed failure: `AGENTS.md`'s `## Development` subsections read as standalone direct-edit recipes, so an agent edits a skill file on the spot and skips brainstorming. In a consumer repo the task presents as a feature and brainstorming triggers; here the task *is* a file edit, so the trigger is weaker, and no `.pi/gauntlet-overrides.md` exists to reinforce it. `AGENTS.md` is the only always-in-context surface for the mandate.

Add an explicit mandate as a new subsection immediately after the `## Development` heading, before `### Local iteration`:

- Any non-trivial change goes through the full gauntlet: `/skill:brainstorming` -> `/skill:writing-plans` -> `/skill:subagent-driven-development` -> verify -> `/skill:finishing-a-development-branch`. Start at brainstorming; it sets up the worktree, writes the spec, and gates on approval, then auto-chains the rest.
- **"Non-trivial" is defined by exclusion:** everything except the trivial carve-out below. The covered surface is skill bodies, agent personas, extension logic, `AGENTS.md` / `README.md` / other workflow and release docs, and release machinery (`scripts/`, `.github/workflows/`). Do not hand-edit any of that surface directly on `main`.
- The **only** carve-out: trivial, contained edits - typo, formatting, dependency bump, and the release commit itself (version bump + paired CHANGELOG heading, driven by the `release` skill) - may skip, matching `brainstorming`'s own "too simple to need a design" anti-pattern. The documented release workflow commits `package.json` + CHANGELOG directly; the mandate must not contradict it.
- The existing "Adding a skill / Modifying an agent / Modifying an extension" subsections are the *implement-phase mechanics* - what the implementer does once the pipeline reaches implementation - not a license to skip the workflow. Reframe with a one-line lead-in; do not delete them.
- Reconcile with "Local iteration": its `pi install -l ~/repos/pi-gauntlet` targets the primary checkout, but during a gauntlet run the edits live in the worktree - point the local install at the worktree (`pi install -l <worktree>`) to test before merge. The mandate presupposes the gauntlet is loadable here (the "Local iteration" setup: `pi install` + `npm run link-agents`).
- The runtime flow-guards enforce this once the workflow is entered but cannot force entry - which is why the mandate is stated in prose here.

Instruction only - no runtime/extension change, no new settings key.

### Part E - codify the skill-file placement convention

Target: `skills/writing-skills/SKILL.md`. State the rule the repo already follows so future authors (and agents) do not reverse-engineer it:

- **Prompt templates / dispatch payloads live as siblings to `SKILL.md`** - files filled and passed to a subagent (`requesting-code-review/code-reviewer.md`, `subagent-driven-development/{implementer,spec-reviewer,code-quality-reviewer}-prompt.md`). Operational, 1:1 coupled to the skill, not progressive-disclosure reading.
- **Deep guidance lives in `reference/`** - the existing rule (line 42), unchanged.
- **Decision criterion (state it):** if the file is passed *wholesale* into a subagent's `task` (a dispatch payload / fill-in template), it is a sibling; if it is *read at a decision point* (deep guidance, examples, rationale tables), it lives in `reference/`. The test is destination, not format.
- The diagram at lines 36-39 already lists both; the gap is prose (line 42 explains only `reference/`) and the line-39 comment miscalling "examples" a sibling. Fix both so the stated rule matches the diagram and the repo.
- One clause acknowledging that older skills (systematic-debugging, test-driven-development) keep some deep-guidance `*.md` flat as siblings, predating the `reference/` convention (obra/superpowers lineage) - so a reader who spots `root-cause-tracing.md` is not misled. Descriptive, not a mandate to move them.

Doc-only edit to one skill body. No new file, agent, extension, or settings key.

## Implementation surface

Exact per-file edits. Current text is the reference point; each edit is behavior-preserving except where noted.

### `skills/brainstorming/reference/documentation-impact.md` (new file)

The shared home for the doc-materiality methodology, following the `verification-before-completion/reference/conformance-check.md` precedent (one reference doc cited by many skills). Generic only - project doc taxonomy stays in `.pi/gauntlet-overrides.md` `## documentation`. Contents:
- **Governing principle:** *document what the code cannot tell you*; the Documentation impact section is a filter with default "none," not a prompt to produce.
- **Scope + the doc classes** - the section tracks product-facing docs (README, AGENTS.md, CHANGELOG, contracts, genuinely-new standalone guidance docs); skill / agent bodies and their `reference/` sub-docs are implementation surface, not doc-impact. Three classes: feature/user-facing introduced; materially amended; derived/memory invalidated.
- **The seven inclusion categories** (verbatim from Design Part A move 1): major procedures/conventions; operations/tunable parameters; communication contracts/integrations; architecture; major definitions; non-obvious rationale/decisions; security/data-access/permissions.
- **The exclusion / anti-pattern list** - code-mirror docs (per-symbol narration, restating signatures/types/schemas, "how it works" the code answers, anything edited on every code change).
- **Amend over create** - extend the canonical existing doc; a new standalone `.md` only when none owns the topic.
- **The section template** + per-entry answers ("none" / doc name / "deferred: <trigger>").

Referenced (relative-path cross-ref, no restatement) by: `brainstorming` §6 + Spec Self-Review; `writing-plans` (doc-task sourcing); `verification-before-completion/reference/conformance-check.md` (docs as origin requirements); `finishing` Step 1's doc-impact pointer.

### `skills/brainstorming/SKILL.md`

- Section 6 "Present the design in sections" -> "Cover at minimum" list: expand the single "Documentation impact" bullet into a required section naming both doc classes, each answerable with an explicit "none." The current bullet reads "README, AGENTS.md, CHANGELOG, API contracts, inline docs" - **drop "inline docs"** (Part A non-goal excludes in-code comments). Cite the materiality bar in `brainstorming/reference/documentation-impact.md` by relative path (matching how `settings-precedence.md` is cited at `SKILL.md:218`) instead of restating the categories inline. Give the section a template:

  ```markdown
  ## Documentation impact
  - Feature / user-facing docs introduced: <list, or "none" - only docs clearing the materiality bar>
  - Materially amended existing docs: <list, or "none">
  - Derived / memory docs invalidated: <routers / AGENTS.md sections / topic guides / indexes, or "none">
  ```
  Each entry answers with a doc name, "none", or "deferred: <trigger>" (e.g. `CHANGELOG.md - deferred: release`). A new standalone `.md` appears here only when no existing doc owns the topic (amend over create, per the reference doc).
- Add one sentence pointing project-specific doc taxonomy to a `## documentation` block in `.pi/gauntlet-overrides.md` (no new settings key; guidance only - this repo ships no override file, and there is no `.pi/gauntlet-doc.md` family).
- "Spec Self-Review" -> "Documentation named" check: reference all three classes by name (introduced; materially amended; derived/memory invalidated), not a single "which docs change." Add a materiality-bar enforcement sub-check (cite the reference doc, do not restate): each listed doc names the category it clears; none is a code-mirror (per the exclusion list); amend-over-create was applied (a new standalone `.md` only where no existing doc owns the topic); and skill/agent bodies sit in the implementation surface, not here. A doc clearing no category is cut.
- **(Part C fallout)** Line 81 - "Spec doc, plan doc, and implementation all live in the same worktree and ship together as a single squash commit" - claims the plan ships. Reword to match Part C: all three are *developed* in the worktree; the squash ships spec + implementation; the ephemeral plan is stripped before landing. (Line 247, "ships in the same squash commit as the implementation," refers to the *spec* and is correct - leave it.)

### `skills/writing-plans/SKILL.md`

- Add doc updates as real plan tasks: task-local docs ride their task; cross-cutting / index docs sequence into a **dedicated trailing doc-only wave** - the last wave by convention (file-disjoint from code tasks, so wave-grouping's pairwise-disjoint contract stays satisfied). Land this in the task-structure / wave-grouping guidance. **Collision rule:** amend-over-create concentrates edits into a few hub docs (README, `AGENTS.md`), and a doc wave with >=2 tasks auto-selects Parallel-Wave Mode, which requires pairwise-disjoint files - so doc tasks touching the *same* file merge into one task. A single-task trailing doc wave is the expected shape, not a smell.
- Keep the `❌ "Probably also need to update the docs"` anti-pattern line (it illustrates a real failure mode); add the positive rule next to it - docs are named plan tasks, sourced from the spec's Documentation impact section (materiality bar in `brainstorming/reference/documentation-impact.md`).
- Self-Review "Spec coverage" check: the spec's Documentation impact entries must each map to a plan task (or an explicit "none").

### `skills/verification-before-completion/reference/conformance-check.md`

- State that spec-named docs (both classes) are origin requirements the pass verifies, and cite `brainstorming/reference/documentation-impact.md` for what the spec's Documentation impact section contains (relative-path cross-ref, no restatement). Wording confirmation - the "code AND docs vs origin" mechanic already exists; no protocol change.

### `skills/subagent-driven-development/SKILL.md` (Part B)

- "The Process" closing line ("After all tasks: dispatch a final reviewer over the full diff") -> "run the whole-diff code review (`requesting-code-review`)".
- "After All Tasks Complete": merge current steps 1 and 2 into one step (whole-diff `requesting-code-review`, drop the self-audit supplement block); renumber accordingly. **Final step list (state verbatim so the implementer does not re-derive it):** 0 `phase_tracker start verify`; 1 whole-diff `requesting-code-review` (address Critical/Moderate before handoff); 2 close-the-loop conformance (`conformance-reviewer`, its own dispatch); 3 summarize (with the closure/conformance section); 4 proceed to finishing. Only the old duplicate review collapses; the other steps keep their bodies.
- Update internal cross-references that name the old numbering: the conformance step's "The audit in step 2 is plan-vs-code (single-step)" and "never fused into the step-1 final review"; the summary step's "self-audit verdict" -> "code-review verdict" and its "not buried in the audit verdict" -> "not buried in the review verdict" (`SKILL.md:194`).
- Model Selection table: **delete the "Final reviewer" row** (the merged pass is the existing "Code-quality review" row, already Most-capable tier); do not leave a separate final-reviewer entry.
- Scan Red Flags / Integration for stale "final reviewer" / self-audit references; sync.
- **Do not edit** "The Process" per-task review steps (3-6) or Parallel-Wave Mode's per-task spec review / per-wave quality review. Part B is confined to the post-execution "After All Tasks Complete" section, the Model Selection row deletion, and stale cross-references.

### `agents/code-reviewer.md` (Part B fallout)

- Line 43 `Severity (aligned with the `self-audit` skill):` - drop the `(aligned with the `self-audit` skill)` parenthetical. A shipped generic agent must not couple to a consumer skill; the Critical/Moderate/Minor levels stand alone.

### `README.md`

- **(Part B)** The verify-stack overview line (numbered item 4, "verify"): current text names "a whole-diff review (`requesting-code-review`, plus any project-specific `self-audit` supplement), then the `conformance-reviewer`". Drop the `self-audit` supplement clause; reflect the single merged review pass followed by conformance.
- **(Part C)** The "Spec, plan, and implementation all live in the same worktree and ship as one squash commit" line implies the plan lands in the squash. Reword: all three are *developed* in the same worktree, the squash ships spec + implementation, and the ephemeral plan is stripped before any landing path. (Option 1 already strips it; Part C extends the same to the PR path.)

### `skills/finishing-a-development-branch/SKILL.md` (Part C)

- Step 5 `Option 2: Push and Create PR` block (shared by the standard menu's Option 2 and the detached-HEAD menu's Option 1 - there is no separate detached-HEAD execute block): before `git push` (and therefore before `gh pr create`, so the PR diff never shows the removal), add a guarded removal. The plan path mirrors Option 1's convention - `doc/plans/<plan>.md`, or `<service>/doc/plans/<plan>.md` for a service-scoped plan (filename matches the spec's, per `writing-plans`); Option 1 already carries the `<service>/` variant, so Option 2 must too or service-scoped plans still leak. Guard on tracked existence with `git ls-files --error-unmatch <plan-path>` (true only when the plan is committed on this branch), then `git rm <plan-path> && git commit -m "Remove ephemeral plan doc"`. The guard is **new** (Option 1 removes unconditionally; the PR path may run where no plan was committed). No path-discovery beyond the known convention.
- "Common Mistakes" -> "Skipping the plan-doc deletion in Option 1": generalize to "Options 1 and 2 (any path that lands on base)."
- "Quick Reference" table and "Red Flags": note plan-doc removal on both landing paths.
- Step 1 doc-impact pointer: sync naming to the formalized "Documentation impact" spec section, and cite `brainstorming/reference/documentation-impact.md` where Step 1 explains what that section covers (Part A touchpoint).

### `AGENTS.md` (Part D)

- Insert a new subsection immediately after the `## Development` heading, before `### Local iteration`: non-trivial changes ride the full `brainstorming -> writing-plans -> subagent-driven-development -> verify -> finishing-a-development-branch` pipeline, starting at `brainstorming`. "Non-trivial" = everything except the trivial carve-out (typo / formatting / dependency + version bump); the covered surface is skills, agents, extensions, `AGENTS.md` / `README.md` / workflow+release docs, and release machinery (`scripts/`, `.github/workflows/`). No direct edits to that surface on `main`.
- Add a one-line lead-in to the existing "Adding a skill" / "Modifying an agent" / "Modifying an extension" subsections - e.g. "The steps below are the *implement-phase mechanics* the implementer runs once the pipeline reaches implementation, not a shortcut around brainstorming." Do not delete or rewrite those steps.
- In or adjacent to "Local iteration", note that during a gauntlet run the worktree is the install target (`pi install -l <worktree>`), so live-testing skill edits still works before merge - the mandate does not break the local loop.
- No change to any other `AGENTS.md` section (see Documentation impact - the rest was audited and is accurate).

### `skills/writing-skills/SKILL.md` (Part E)

- Next to the line-42 `reference/` explanation, add the sibling rule: prompt templates / dispatch payloads (filled and passed to a subagent) live as siblings to `SKILL.md`; cite `requesting-code-review/code-reviewer.md` and the three `subagent-driven-development/*-prompt.md` as examples. State the decision criterion: passed wholesale into a subagent `task` = sibling; read at a decision point = `reference/`.
- Correct the directory-layout diagram (line 39): the `<supporting>.md` comment becomes "prompt templates (dispatch payloads)"; show `examples.md` under `reference/`, not as a sibling (matches `test-driven-development/reference/examples.md`).
- Add one clause noting the flat deep-guidance docs in older skills are pre-convention lineage, not a counter-rule; do **not** move them (out of scope, see non-goals).
- Reflect the rule in the checklist (line ~376) only if it fits in one line; skip if it bloats the list.

## Edge cases and risks

- **Consumer audit coverage (Part B):** no real loss. A project audit skill exists precisely to add project-specific convention checks the generic reviewer lacks; those checks were never in generic `requesting-code-review` and are outside `conformance-reviewer`'s scope, so no pass silently drops them. Removing the auto-invoke moves them from automatic to explicit (a manual `/self-audit` run, or a `.pi/gauntlet-overrides.md` wire-up) - auto -> manual, not present -> absent.
- **Consumer migration (Part B):** removing the auto-invoke is a behavior change for any consumer that relied on it firing automatically. The SDD edit that drops the block should name the migration inline - re-add the audit as an explicit step in `.pi/gauntlet-overrides.md`, or run `/self-audit` manually - so the change is discoverable, not silent.
- **Step renumbering churn (Part B):** the conformance and summary steps cross-reference step numbers. All references synced in the same edit to avoid dangling "step 2".
- **PR-path plan deletion (Part C):** add+delete of the plan collapses under any GitHub merge mode -> the final base *tree* has no plan. The plan remains in *branch history* (recoverable via `git log` until the branch is deleted) - accepted; ephemerality targets the tree that lands on base, not git history. No dependency on the plan for `gh pr create` (its body is authored bullets, not the plan doc).
- **Four-touchpoint drift (Part A):** brainstorming section 6, writing-plans, finishing Step 1, and `conformance-check.md` must name the *same* "Documentation impact" section / reference doc. Synced together, and kept in sync with the reference doc's own "Referenced by" list (which names these four).

## Testing

- `npm test` (`scripts/ci.mjs`): validates skill/agent frontmatter, stale rename tokens, extension syntax, `package.json` fields, and npm-pack contents (`doc/` must not leak into the tarball - the spec and plan stay out of the shipped package). Placeholder discipline is enforced by the self-review pass, not ci.
- **No CHANGELOG / version bump in this worktree.** `ci.mjs` asserts `package.json` version == CHANGELOG top heading at all times; that pairing is a release-time action via the `release` skill, not a feature commit. Adding a CHANGELOG heading here without bumping the version would fail ci.
- Skill-flow correctness is verified by reading the edited flows end-to-end plus a targeted grep checklist (the artifacts are prose contracts, not executable code; no runtime harness):
  - No surviving "final reviewer" as a *separate* pass in `subagent-driven-development` (only the merged `requesting-code-review` step).
  - The diff to `subagent-driven-development` touches only: (a) the one-line closing/handoff at the end of "The Process" (`SKILL.md:63`) that points into the post-execution section - not a per-task step; (b) the "After All Tasks Complete" section; (c) the Model Selection "Final reviewer" row deletion; (d) Red-Flags/Integration cross-refs. "The Process" per-task review steps 3-6 and Parallel-Wave Mode's per-task/per-wave review steps are unchanged.
  - No "self-audit verdict" / project-audit auto-invoke language in the SDD after-all-tasks flow; no `(aligned with the self-audit skill)` in `agents/code-reviewer.md`.
  - `README.md`: no "self-audit supplement" clause in the verify-stack line; the "one squash commit" line no longer implies the plan ships. `skills/brainstorming/SKILL.md:81` likewise no longer claims the plan ships (`:247` unchanged).
  - The `Option 2` PR block in `finishing-a-development-branch` contains the guarded plan `git rm`.
  - The four Part A touchpoints (`brainstorming` section 6, `writing-plans`, `finishing` Step 1, `conformance-check.md`) all name the same "Documentation impact" section, matching the reference doc's "Referenced by" list.
  - `AGENTS.md`: the `## Development` section opens with the full-pipeline mandate (names `brainstorming` as the entry point) and the "Adding a skill / Modifying an agent / Modifying an extension" subsections are framed as implement-phase mechanics, not a direct-edit bypass.
  - `skills/writing-skills/SKILL.md`: states both halves of the placement rule (dispatch-payload templates as siblings; deep guidance in `reference/`), and the line-39 layout diagram no longer calls "examples" a sibling.
  - **Anti-proliferation + no private coupling:** every doc named in this spec's Documentation impact clears a materiality-bar category (spot-check), and no *new* standalone `.md` was introduced where an existing doc already owns the topic. Scan changed public files for private-consumer identifiers using the generic-skills guard in `AGENTS.md` ("Skills must stay generic", the `rg -ni` company / username / service pattern) - expected zero matches.

## Documentation impact

Dogfooding Part A's own bar **and scope** for this change. **Scope note:** the skill / agent body edits and the new `reference/documentation-impact.md` sub-doc are *implementation surface* (the deliverable, listed above under Implementation surface), **not** entries here - this section tracks only product-facing docs, so it does not restate the diff.

- **Feature / user-facing docs introduced:** none. This change introduces no new product-facing doc. (The new `reference/documentation-impact.md` is a skill sub-doc = implementation surface, per the scope rule - a deliberate dogfood of "don't inflate doc-impact with implementation artifacts.")
- **Materially amended existing docs:**
  - `AGENTS.md` (repo root) - Part D adds a workflow-mandate subsection to `## Development` (clears *major procedures / conventions*). A product-facing governance doc, so it lands here; the deliverable of Part D.
- **Derived / memory docs invalidated:**
  - `README.md` (verify-stack line, item 4) - names a "project-specific `self-audit` supplement"; stale after Part B. Drop it, reflect the single merged review pass.
  - `README.md` ("ship as one squash commit" line) - implies the plan ships; Part C makes plan-ephemerality explicit, so reword to spec + implementation ship, plan stripped before landing.
  - `skills/brainstorming/SKILL.md:81` - "Spec doc, plan doc, and implementation ... ship together as a single squash commit" carries the same inaccuracy, invalidated by Part C. Reword identically. (`:247` refers to the *spec* shipping, correct - unchanged.)
- **No change (verified, not assumed):** apart from Part D's new block, no other `AGENTS.md` section changes - `grep -nE "final reviewer|self-audit|requesting-code-review"` hits only the pi-cohort `agents/` divergence note (line ~171), unrelated to the after-all-tasks sequence or plan lifecycle.
- **Full repo-state audit (per request):** README.md and AGENTS.md audited section-by-section against the repo. Verified accurate: 13 skills (names + categories), 7 personas (match `agents/*.md`), 3 extensions, the `piGauntlet.*` settings-key inventory, and the install / lineage / versioning sections - no README/AGENTS section other than the lines above goes stale. A separate skill-body sweep for the plan-ships-in-squash claim surfaced `skills/brainstorming/SKILL.md:81` (above).
- **CHANGELOG.md:** deferred: release (version-locked by ci; not a feature-commit edit).

## Decisions / deviations

- **Materiality bar lives in a shared reference doc** (`skills/brainstorming/reference/documentation-impact.md`), not inlined in `brainstorming` §6. Chosen for DRY and to match the established `verification-before-completion/reference/conformance-check.md` pattern (one reference doc, many referrers cite it by relative path). The bar is generic; project-specific doc taxonomy stays in `.pi/gauntlet-overrides.md` `## documentation`. Governing rule captured there: *document what the code cannot tell you*; the section is a filter (default "none"), not a prompt to produce - the anti-flooding guard.
- Parts B and C are not in issue #1. They are folded in because they share the file surface (finishing, SDD) and the anti-redundancy theme, and were explicitly requested during brainstorming. The spec is a single-PR unit (A-E kept together, confirmed at the user gate). **Semver + CHANGELOG:** the release semver level is decided at release time by the `release` skill, not here; Part B's auto-invoke removal is a consumer-visible behavior change to a shipped skill (no settings-key / API / rename change), so it reads as **minor** under the AGENTS.md semver table, but the release step makes the final call and the CHANGELOG entry should partition the change by part (A-E), not one opaque line.
- Part B removes a generic pi-gauntlet hook (project-audit auto-invoke), not one consumer's use of it. Chosen over a default-off opt-in hook for simplicity and to match issue #1's "taxonomy goes in overrides" philosophy - the override file is the escape hatch.
- In-flow plan visibility: the plan stays visible to in-flow reviews (it is the execution contract there); Part C's removal targets only the durable/PR record. Chosen over excluding `doc/plans/` from in-flow diffs, to avoid extra diff-scoping machinery.
- Part D is doc-only and repo-specific (self-hosting), outside issue #1 and the durable-record theme; bundled because it is an `AGENTS.md` edit requested in the same session that ships in the same worktree. It adds no runtime guard: the flow-guards already enforce discipline once the workflow is entered, so the unmet need was *entering* it - an instruction problem, fixed with an instruction. Chosen over a new phase-tracker guard that tries to force workflow entry (unforceable without a heavier hook, and out of scope).
- Part E codifies an existing convention rather than changing it: dispatch-payload templates stay siblings, deep guidance stays in `reference/`. Chosen over *normalizing* the drift (moving older skills' flat technique docs into `reference/`), deferred as separate housekeeping. In-theme with Part A - both are documentation-placement discipline.
- **Testing deviates from `writing-skills`' Iron Law ("no skill edit without a failing test first") - recorded, not skipped silently.** These are prose-contract edits to skill bodies; the repo's `npm test` (`scripts/ci.mjs`) is static validation (frontmatter, tokens, pack contents) with no behavioral skill-test harness, and a behavioral test would be non-deterministic and would not run under ci. Verification is instead read-through of each edited flow, the Testing grep checklist, and the spec's own conformance pass dogfooding Part A. A behavioral test was explicitly declined for this change (user decision). If a future change adds executable skill behavior, the Iron Law applies normally.
- 2026-07-04 accept G1: the `## Documentation impact` template's first bullet omits the "only docs clearing the materiality bar" qualifier so all three bullets read uniformly (the prose above the block already binds the bar). The deliverable (uniform bullets in both `documentation-impact.md` and `brainstorming` §6) is correct; this Implementation-surface prose, which still describes the qualifier on bullet 1, is the stale side and is superseded by this decision. (conformance gate)
- 2026-07-04 accept G2: `documentation-impact.md` carries a "Gating class 3" clarification (classes 1-2 are gated by the seven categories; class 3 - derived/memory invalidated - is gated by the lighter "content now wrong or misleading" staleness test, not required to clear a category). Added during Wave-1 code review of the reference doc as an ambiguity fix, not scope creep; spec-consistent (writing-plans sources doc tasks from this distinction). Kept. (conformance gate)

## Appendix: GitHub issue #1 (verbatim)

*This spec is the canonical source. Issue #1 is inlined verbatim below for context; Part A traces to it. Where spec and issue differ, the spec wins.*

> **Title:** Docs as first-class origin requirements (verified by the existing conformance pass)

### Problem

Markdown docs are a project's durable memory - routers (`AGENTS.md`), topic guides, contracts, READMEs. As code changes, that layer rots: the closing-loop `conformance-reviewer` audits the deliverable against the *origin* (spec + prompt), and memory docs are almost never named in the origin - so a stale router is invisible to it.

The gap is real. The fix is not a new closure step; it's making docs a **first-class origin requirement** so the *existing* single conformance pass already covers them.

### Design

Three moves, no new pass, no new agent, no new file family:

1. **Spec gets a required "Documentation impact" section.** Formalize `brainstorming` section 6 from a loose prompt into a mandatory spec section. It enumerates two doc classes:
   - *Feature / user-facing docs* the change introduces.
   - *Derived / memory docs it invalidates* - router entries, topic guides, `AGENTS.md` sections, taxonomy indexes.

   Naming a doc here puts it in the origin, which is the entire fix: origin-anchored conformance now sees it.

2. **Execution owns the writing.** Doc updates become real plan tasks, edited by the existing `implementer`. Task-local docs ride their task; cross-cutting / index docs go in a final doc task in the last wave (docs describing settled behavior get written once, after code stops moving).

3. **Conformance is unchanged.** It already audits "code AND docs vs origin". Because the docs are now origin requirements, the existing single pass verifies them together - current cost, one dispatch.

### Non-goals

- In-code doc comments (RDoc/JSDoc) - out of scope; md files only.
- A dedicated `doc-author` persona - not needed; `implementer` is already the edit-capable actor.
- A second/third conformance pass - the single pass suffices once docs are in the origin.

### Implementation surface

- `skills/brainstorming/SKILL.md` - promote the doc-impact prompt to a required spec section enumerating both doc classes.
- `skills/writing-plans/SKILL.md` - doc updates are real tasks; index/cross-cutting docs sequence into the final wave.
- `skills/verification-before-completion/reference/conformance-check.md` - state that spec-named docs are origin requirements the pass verifies (mostly a wording confirmation; the mechanic already exists).
- Sync wording across the three doc-contract touchpoints so they point at the one spec section: `brainstorming` section 6, `writing-plans`, `finishing-a-development-branch` Step 1.
- Any project-specific doc taxonomy goes in a `## documentation` section of the existing `.pi/gauntlet-overrides.md` - no new settings key, no `.pi/gauntlet-doc.md` family.

### Accepted residual gap

Spec-time enumeration only catches docs the author anticipated. A derived doc nobody listed still goes stale invisibly, since conformance is origin-anchored. Accepted for v1: spec review and code review already pressure-test the doc list, and the cost is far below a mandatory closure wave.

### Follow-up (separate ticket, optional)

A `verify`-phase advisory that greps stock docs for references to moved/renamed paths or symbols and surfaces staleness candidates - advisory only, never a gate, never auto-edits. Only defensible remnant of a diff-driven scanner; out of scope here.
