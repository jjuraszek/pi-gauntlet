# Spec-reviewer clause coverage and plan-code non-authority

## Problem

Four failure modes let a non-conformant implementation pass the spec-review gate:

1. **Lossy transcription passes.** A spec sentence lists three requirements; the plan's task carries two. The mechanical plan checks (quote integrity, anchor resolution) verify ranges and quoted literals, not meaning - the missing third requirement is invisible to them.
2. **Plan bugs are laundered.** The plan includes code, and that code is itself wrong vs the spec. The implementer transcribes it faithfully; the spec-reviewer sees "diff matches task" and approves. The plan's bug becomes "conformant".
3. **Sampling instead of exhaustion.** The spec-reviewer has the spec open at the right lines, but nothing forces it to verdict every clause. It samples: finds two real issues, misses a third three lines away.
4. **Contradicted sentences outside hunks are invisible.** Reviewers read diffs. A statement elsewhere in a touched file that the change now contradicts is never seen.

## Design

Prose edits across four files. No new agents, dispatches, artifacts, schemas, or mechanical gates. All fixes are LLM instructions - surgical, minimal verbosity, minimal conditionality.

### 1. Clause enumeration (kills FM1, FM3)

`agents/spec-reviewer.md`:

- Process step 1 - replace the whole "Extract a flat list..." sentence with:

  > Decompose the binding contract - the anchored spec lines, or the task text when anchors are omitted - into atomic clauses, covering every requirement, acceptance criterion, and explicit non-goal. Each independently checkable statement is one clause; a sentence listing three requirements yields three clauses. Every clause gets a verdict row.

  The anchor-less fallback lives in this persona sentence itself (not only in the dispatch template) because `verification-before-completion/reference/conformance-check.md` dispatches `spec-reviewer` directly without the template.
- Process steps 3 and 6, the intro sentence ("does what its spec or plan says"), and the frontmatter `description` - replace "requirement"/"spec or plan" unit language with the clause unit and spec-only authority, so no per-requirement or plan-as-authority wording survives alongside the new unit.
- Output format - heading `Per-requirement status:` becomes `Per-clause status:`; row IDs `REQ-n` become `C-n`. Statuses (`MET`/`PARTIAL`/`MISSING`/`OUT_OF_SCOPE`) and F-id minting (only `PARTIAL`/`MISSING`/scope-creep rows mint F-ids) are unchanged. The `Parallel-safe:` and `TRAJECTORY:` grammars are untouched.

`skills/subagent-driven-development/spec-reviewer-prompt.md`, `## Your Job` - mirror **only the decomposition sentence** (the first quoted sentence above, through "yields three clauses"). The verdict-row obligation stays persona-side, where the output format enforces it; the template's ✅/❌ report format is unchanged.

### 2. Plan code non-authoritative (kills FM2)

`agents/spec-reviewer.md`, Rules - add one line:

> Plan/task code snippets are implementation guidance, not review authority; a diff matching a snippet never proves compliance. For anchor-less tasks the task text's prose requirements remain your contract.

The second sentence preserves the existing anchor-less contract ("the task text alone is your contract", `spec-reviewer-prompt.md`) - snippets never prove compliance anywhere, but anchor-less review still binds to task text.

`spec-reviewer-prompt.md`, `## Spec Authority` - mirror the same line.

`skills/writing-plans/SKILL.md`, `## Remember` - one sentence immediately after "Complete code in plan (not 'add validation')":

> Plan code is guidance for the implementer, not review authority - reviewers judge the diff against the spec, never against plan snippets.

Complete code stays mandatory in plans (existing and new code alike). The implementer's contract is unchanged; only the code's standing at review time is declared.

### 3. Whole-file reads (kills FM4)

`agents/spec-reviewer.md`, Process step 2 - the full resulting bullet reads:

> Read the implementation. Do not trust summaries. Read every diff-touched file in full, not just the hunks - continue in chunks until the file is exhausted; if you cannot exhaust it, say so in the report instead of treating the file as covered. A statement elsewhere in a touched file that the change now contradicts is in scope.

`spec-reviewer-prompt.md`, `**DO:**` list - mirror: read each touched file in full, not just the diff hunks, continuing in chunks; note in the report any touched file not read to the end.

Scope bound: diff-touched files only, never the repo.

### 4. Extraction re-walk (authoring-time backstop)

`skills/writing-plans/SKILL.md`, `## Spec Coverage Table` - append one clause to the existing extraction-first sentence:

> ...then re-walk the spec once: every normative clause has a row.

Clause is the same atomic unit as review-time (section 1) - a line listing three requirements needs three rows' worth of coverage, not one. Same walk the planner already performs, one extra confirmation pass - not a new check, not a script.

### 5. Code-vs-anchor sanity (authoring-time)

`skills/writing-plans/SKILL.md`, `## Self-Review (Before Handoff)` - one new bullet:

> **Code-vs-anchor sanity.** For each non-waived requirement row, re-read the anchored spec lines and confirm the owner tasks' bodies do what they say - mechanism present, not just the quoted literal. Fix the task, don't annotate.

LLM judgment only, no script. It catches "spec says three things, task code does two" and "plan snippet contradicts anchored lines" at authoring time, where quote integrity is blind to semantics.

### 6. Executor framing alignment

`skills/subagent-driven-development/SKILL.md` - two parent-facing lines still assert diff-only review and would keep reproducing FM4 framing:

- Sequential step 3: "Verify the diff matches the anchored spec - nothing missing, nothing extra." becomes "Verify the change satisfies the anchored spec - nothing missing, nothing extra."
- Parallel step 3: "Review is **diff-based**: the diff's hunks carry `file:line`, ..." becomes "Review starts from the diff (its hunks carry `file:line`) and reads each touched file in full, ..." - the rest of the sentence (test execution never the reviewer's job) unchanged.

No dispatch-shape change - task text, diff, spec path, and anchors are passed exactly as today.

### Persona/template lockstep

`agents/spec-reviewer.md` and `spec-reviewer-prompt.md` each gain **one** HTML comment, placed immediately above the edited Process-step-1 sentence (persona) and the edited `## Your Job` decomposition sentence (template), distinct from and in addition to the existing `Parallel-safe:` comment pair:

> `<!-- clause decomposition / snippet non-authority / whole-file reads: keep in lockstep with <counterpart file> — change them together or not at all -->`

with `<counterpart file>` = `skills/subagent-driven-development/spec-reviewer-prompt.md` in the persona and `agents/spec-reviewer.md` in the template.

## Edge cases

- **Anchor-less mechanical tasks:** handled inside the section-1 persona sentence itself ("or the task text when anchors are omitted") and the section-2 rule's second sentence; the template's existing anchor-less block is unchanged.
- **Clause count:** no cap. Tasks are atomic and anchor ranges small; a huge clause list signals an oversized plan task, which the report makes visible rather than hides.
- **Large or generated touched files:** no name-pattern exemption (minimal conditionality); the reviewer reads in chunks to exhaustion and reports any file it could not exhaust - a truncated read is surfaced, never silently treated as covered.
- **F-id / trajectory counts:** unaffected - clause rows are verdict rows; F-ids mint exactly where they do today.
- **Quote integrity:** unaffected - it scans spec-side literals, not plan snippets, so snippet non-authority does not weaken it.
- **Re-reviews:** unchanged - re-reviews already judge the diff against the spec, not stale task prose; clause rows re-enumerate from the same anchored lines.

## Out of scope

- Removing new-code snippets from plans (rejected: the implementer persona is transcription-oriented - "stop and report, do not guess" - and half of writing-plans' self-review assumes complete code; prose pseudocode is harder to review than wrong literal code).
- Any new mechanical/scripted gate in writing-plans' Self-Review.
- Changes to `code-reviewer`, `conformance-reviewer`, the implementer persona, or any dispatch shape.
- Changes to the F1..Fn, `Parallel-safe:`, or `TRAJECTORY:` grammars.

## Testing approach

Prose-only change; no executable surface. Verification:

- `npm test` (`scripts/ci.mjs`)
- Skills-genericity grep (resolved for this repo): `rg -ni "jjuraszek|/Users/[^/]+" skills/` - expected: zero matches (exit 1)

Behavioral validation is empirical on the next gauntlet run.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none
- Derived / memory docs invalidated: none

Skill/agent bodies are implementation surface, not doc-impact entries (bar: `brainstorming/reference/documentation-impact.md`). The AGENTS.md agents knobs table is untouched (no frontmatter knob change; the persona `description` reword is not a knob). CHANGELOG rides the release commit.

## Acceptance criteria

1. `agents/spec-reviewer.md` instructs clause-level decomposition of the binding contract (anchored spec lines, or task text when anchors are omitted) covering requirements, acceptance criteria, and explicit non-goals, with one verdict row per clause; no "per-requirement" or "spec or plan" authority wording survives (intro, steps 3/6, frontmatter description, output heading all updated); output heading is `Per-clause status:` with `C-n` rows; F-id minting rules unchanged.
2. `agents/spec-reviewer.md` and `spec-reviewer-prompt.md` both carry the snippet non-authority rule including the anchor-less task-text sentence.
3. Both files instruct whole-file reads of diff-touched files (chunked to exhaustion, unexhausted files reported), bounded to touched files; the persona's step 2 retains "Do not trust summaries".
4. Both files carry the quoted lockstep comment, one per file, placed above their decomposition sentences, naming the counterpart file.
5. `skills/writing-plans/SKILL.md` `## Remember` declares plan code's review-time standing in one sentence after "Complete code in plan"; complete-code mandate unchanged.
6. `skills/writing-plans/SKILL.md` extraction-first sentence gains the one-clause re-walk ("every normative clause has a row"); Self-Review gains the single code-vs-anchor sanity bullet (owner tasks' bodies, non-waived rows); no other Self-Review changes, no scripts.
7. `skills/subagent-driven-development/SKILL.md` sequential step 3 and parallel step 3 are reworded per Design section 6; nothing else in that file changes.
8. `npm test` passes; `rg -ni "jjuraszek|/Users/[^/]+" skills/` returns zero matches (exit 1).
