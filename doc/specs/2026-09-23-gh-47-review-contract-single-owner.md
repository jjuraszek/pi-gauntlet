# Review contract has one owner per persona

**Goal:** Fix GitHub issue #47. The code-review report shape, verdict vocabulary, and `Parallel-safe:` grammar are written in the `code-reviewer` persona and re-written in the request template and SDD prompts; the copies drifted (`Verdict: SHIP | FIX_FIRST | REJECT` vs `Ready to merge? [Yes/No/With fixes]`). Make each persona the sole owner of what its reviewer writes back, make every dispatching file scope payload plus one pointer sentence, and give each duplicated piece of recipient and dispatch guidance one home. Unification: net markdown shrinks.

Supersedes `doc/specs/2026-09-13-gh-30-code-reviewer-verdict-severity.md`, scope: its accepted residual "the template's `Ready to merge` example stays untouched". Its severity-to-verdict policy stands unchanged.

## Problem

`agents/code-reviewer.md` loads with `systemPromptMode: replace`, so its body is the reviewer's system prompt. It ends the report with `Verdict: SHIP | FIX_FIRST | REJECT` (`:31`) and carries the F-grammar (`:66-70`) and footer sentence (`:80`). The task pasted into the same dispatch, `skills/requesting-code-review/code-reviewer.md`, prescribes a second report shape (`### Strengths / ### Plan Deviations / ### Issues / ### Recommendations / ### Assessment`, `:83-118`), asks `**Ready to merge?** [Yes/No/With fixes]` (`:116`), shows `**Ready to merge: With fixes**` in its example (`:198`), and repeats the grammar (`:127-131`) and footer (`:141`). `skills/subagent-driven-development/code-quality-reviewer-prompt.md:26-30` restates the template's shape ("Strengths, Issues, Assessment") and the footer a third time. `skills/chase-bug/hotfix.md:127` branches on `FIX_FIRST`, so the persona's vocabulary is the one consumers read.

Drift guards failed: the lockstep HTML comments name different partners (`agents/code-reviewer.md:64` names the template; the template `:125` names the conformance persona; `agents/conformance-reviewer.md:116` names both the template and `spec-reviewer-prompt.md`), and `scripts/ci.mjs:180-182` pins one footer sentence in three files while the verdict line drifted anyway.

The same pattern repeats for the spec reviewer (`skills/subagent-driven-development/spec-reviewer-prompt.md:105-125` copies `agents/spec-reviewer.md:80-90`'s grammar, and both carry lockstep comments) and in three skill pairs: recipient guidance (`requesting-code-review/SKILL.md:54-58,62-89,102-115` vs `receiving-code-review/SKILL.md`), the worktree-`cwd` dispatch rule (`subagent-driven-development/SKILL.md:182` vs `dispatching-parallel-agents/SKILL.md:187`), and `failing test first` twice in `implementer-prompt.md:33,106`.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#47, checkbox list, rows verbatim:

- [ ] One verdict vocabulary reaches the reviewer: `rg -n "Ready to merge" agents skills` returns no match, and `Verdict: SHIP | FIX_FIRST | REJECT` appears in agents/code-reviewer.md.
  in-scope
- [ ] One code-reviewer owner for the output contract, plus the conformance persona's G-prefixed twin: `rg -l "Footer order:" agents skills` lists exactly agents/code-reviewer.md and agents/conformance-reviewer.md. skills/requesting-code-review/code-reviewer.md and skills/subagent-driven-development/code-quality-reviewer-prompt.md each contain no `Parallel-safe:` grammar block and no "Footer order:" sentence, and each contains one pointer sentence naming agents/code-reviewer.md as the output-format owner; the SDD prompt still carries the `TRAJECTORY:` re-review block.
  in-scope
- [ ] The "change them together or not at all" lockstep comments are removed from agents/code-reviewer.md and skills/requesting-code-review/code-reviewer.md.
  in-scope
- [ ] scripts/ci.mjs asserts "`Behaviour-change:` on **every** report" only for files that still contain the sentence; the pins for skills/requesting-code-review/code-reviewer.md and skills/subagent-driven-development/code-quality-reviewer-prompt.md are deleted, not inverted.
  in-scope
- [ ] skills/requesting-code-review/SKILL.md contains no "Act on feedback" list, no "If reviewer wrong" list, and no `## Example` section; it links `receiving-code-review` once for the recipient stance. Its fix-round mechanics (SHA capture, `Parallel-safe:` probe, foreground re-review) are byte-identical to today's.
  in-scope
- [ ] skills/receiving-code-review/SKILL.md has no `## Real Examples` section; the "Fix items 1-6" exchange appears exactly once; its frontmatter `description` names human or external (GitHub, human partner) review feedback and states that the subagent-driven-development fix loop is out of its scope.
  in-scope
- [ ] skills/subagent-driven-development/implementer-prompt.md contains the phrase "failing test first" exactly once.
  in-scope
- [ ] skills/subagent-driven-development/SKILL.md states the worktree-base/`cwd` rule as one sentence pointing at dispatching-parallel-agents "pi-cohort Integration"; the phrases "resilience-critical" and "children never see your spec" no longer appear in it; the `subagent({...})` wave code block with its `cwd: "/abs/path/to/this/worktree"  // REQUIRED` comment is retained.
  in-scope
- [ ] skills/dispatching-parallel-agents/SKILL.md `description` names fix fan-out and the `Parallel-safe:` check in addition to the 2+ independent tasks trigger, and stays within pi's 1,024-character description limit.
  in-scope
- [ ] skills/chase-bug/hotfix.md and skills/verification-before-completion/reference/conformance-check.md are unchanged (`git diff --stat` on those paths is empty).
  in-scope
- [ ] No SKILL.md touched by this change exceeds 500 lines; `npm test` passes; `.claude-plugin/marketplace.json` is unchanged.
  in-scope

Deviation from the ticket body (not from an AC): the ticket names two lockstep comments; this change removes all five `grammar identical` lockstep comments (`agents/code-reviewer.md:64`, `skills/requesting-code-review/code-reviewer.md:125`, `agents/conformance-reviewer.md:116`, `skills/subagent-driven-development/spec-reviewer-prompt.md:105`, `agents/spec-reviewer.md:80`): each names a copy this change deletes or a template that no longer carries the grammar. The two `clause decomposition` lockstep comments (`agents/spec-reviewer.md:16`, `spec-reviewer-prompt.md:69`) guard process text this change does not consolidate and stay.

## Design

### Ownership

| Contract | Sole owner | Every other file carries |
|---|---|---|
| Code-review report: verdict, `Reasoning:`, findings, severity rule, F-grammar, footer, review rules | `agents/code-reviewer.md` | scope payload + one pointer sentence |
| Conformance report and G-grammar | `agents/conformance-reviewer.md` | scope payload (no in-repo template copies it) |
| Spec-compliance report: verdict, finding fields, F-grammar | `agents/spec-reviewer.md` | scope payload + one pointer sentence |

`skills/dispatching-parallel-agents/SKILL.md:118-123` keeps its `<group>` production for the consumer-side structural probe and reviewer re-ask; it is a parser's copy, not a reviewer output contract, and stays.
| Acting on review feedback (verify, push back, clarify) | `skills/receiving-code-review/SKILL.md` | one link |
| When to dispatch a reviewer; fix-round rule | `skills/requesting-code-review/SKILL.md` | unchanged pointers |
| Top-level `cwd` / worktree-base rule for `subagent` | `skills/dispatching-parallel-agents/SKILL.md` "pi-cohort Integration" | one pointer sentence |

Invariant the pointer relies on: every in-repo reviewer dispatch names its persona (`agent: "code-reviewer"`, `"spec-reviewer"`, `"conformance-reviewer"`); the persona is the system prompt, so the template needs no copy. A persona-less paste of the template produces a report with no prescribed shape, which is the visible failure, not an invented one.

### Per-file changes

Every new or relocated sentence is written here verbatim; the plan applies it as-is. Wording rules: imperative voice, no `if`/`should`, one sentence per pointer (`/skill:writing-skills` authoring rules).

**`agents/code-reviewer.md`**

1. In the fenced output block (`:30-45`), insert `Reasoning: <one sentence: the finding or absence of findings that decided the verdict>` directly after `Verdict: SHIP | FIX_FIRST | REJECT`.
2. In the same block, change the finding line `— one-sentence problem` (`:35`) to `— one-sentence problem and its consequence`.
3. In the paragraph at `:57-59`, change `(files/resources a fix would touch, or the literal `none`)` to `(files a fix would edit, not only the evidence location; resources a fix or its verification touches; or the literal `none`)`.
4. Insert a `Rules:` lead-in and three bullets directly after the `**Minor**` severity bullet (`:55`), before the `Label every finding` paragraph:
   - `Verify before praising: no "looks good" on code you did not read.`
   - `Report only on code you read.`
   - `Name the concrete change in every Fix; "improve error handling" is not a Fix.`
5. Replace the lockstep HTML comment (`:64`) with `<!-- writing-plans' plan-time Parallel-safe: line is a deliberately different free-text form; do not unify -->`. `Footer order:` sentence (`:80`) unchanged.

**`agents/conformance-reviewer.md`**

1. Delete the lockstep HTML comment (`:116`).
2. Append one sentence after the `conflicts` (conservative default = serial). paragraph (`:132`): `Footer order: `Parallel-safe:` is the final line of the report.` Grammar block and everything else unchanged.

**`agents/spec-reviewer.md`**

1. Delete the lockstep HTML comment (`:80`). Grammar block (`:82-90`) and everything else unchanged.

**`skills/requesting-code-review/code-reviewer.md`**

1. In `**Your task:**` (`:13-19`) replace item 5 `Flag plan deviations explicitly` with `Report each plan deviation as a finding: what the plan says, what the code does, whether the deviation is acceptable.`
2. In `## Calibration` delete the `**Lead with strengths.**` bullet (`:28`) and the `**Plan deviations get their own treatment.**` bullet (`:30`); item 5 carries plan deviations.
3. Delete `## Output Format` (`:83-141`, including `### Fix-concurrency certification`, its grammar block, lockstep comment, and `Footer order:` sentence), `## Critical Rules` (`:143-157`), and `## Example Output` (`:159-end`).
4. Append one pointer sentence in their place: `Report in the output format `agents/code-reviewer.md` defines in your system prompt.`
5. Boundaries, task items 1-4 and 6, `SCOPED_TEST_COMMANDS`, the remaining Calibration bullets, `## Review Checklist`, and placeholders stay byte-identical.

**`skills/subagent-driven-development/code-quality-reviewer-prompt.md`**

1. Replace lines `:26-30` (`**Code reviewer returns:** Strengths, Issues ...`, the `Emit finding IDs ...` sentence, and the `Footer order:` sentence) with one pointer sentence: `Read `Verdict:` and the footer lines from the report; `agents/code-reviewer.md` defines its format.`
2. Keep the dispatch block, the additional-checks list, and the whole `TRAJECTORY:` re-review block (`:32-63`) unchanged.

**`skills/subagent-driven-development/spec-reviewer-prompt.md`**

1. Delete `### Finding IDs and fix-concurrency certification` (`:94-119`: finding-field definitions, partition intro, lockstep comment, grammar, example, disjointness prose) and the closing `Report:` block (`:148-150`, `✅ Spec compliant` / `❌ Issues found`, a second verdict shape beside the persona's `Verdict: COMPLIANT | NEEDS_REWORK | OUT_OF_SCOPE_CHANGES`). Add one pointer sentence where `:94` was: `Report in the output format `agents/spec-reviewer.md` defines in your system prompt.`
2. Keep `## Re-review: trajectory verdict` from its heading onward (`:121-146`) and the `clause decomposition` lockstep comment (`:69`) unchanged. The `A plausible condition is not the specified condition` ci pin (`:37`) is outside the deleted ranges.

**`skills/subagent-driven-development/SKILL.md`**

1. Replace the paragraph at `:182` (`**Set `cwd` to your worktree — resilience-critical.** ...`) with: `Pass the worktree's absolute path as the top-level `cwd` on every dispatch; rule and rationale: `dispatching-parallel-agents` "pi-cohort Integration".`
2. Keep the `**Caveat:**` paragraph (`:180`) and the wave `subagent({...})` code block with its `cwd: "/abs/path/to/this/worktree"  // REQUIRED` comment.

**`skills/subagent-driven-development/implementer-prompt.md`**

1. Change the self-review checklist line (`:106`) `Did I follow TDD — failing test first for production code?` to `Did I follow TDD (step 2)?`. The work instruction at `:33` is the single remaining occurrence.

**`skills/dispatching-parallel-agents/SKILL.md`**

1. Frontmatter `description` becomes the double-quoted YAML scalar `"Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies, when fanning out review-finding fixes in parallel, or when checking a reviewer's Parallel-safe: line before doing so"` (the value contains `: `, which an unquoted scalar cannot carry; pi's loader drops a skill whose frontmatter fails `yaml.parse`). Under 1,024 characters.
2. Body unchanged; "pi-cohort Integration" already states the top-level `cwd` rule.

**`skills/requesting-code-review/SKILL.md`**

1. Delete `**3. Act on feedback:**` and its list (`:54-58`), `## Example` (`:62-89`), and the `**If reviewer wrong:**` header and list in `## Red Flags` (`:110-113`; keep the `See template at:` line at `:115`).
2. Fix-round paragraph (`:60`) stays byte-identical. Append one sentence after it: `Take the recipient stance from `receiving-code-review`: verify each finding, answer a wrong finding with evidence, defer Minor items explicitly.`
3. SHA capture (`:28-32`), foreground dispatch (`:38-44`), and payload placeholders (`:46-52`) stay byte-identical.

**`skills/receiving-code-review/SKILL.md`**

1. Frontmatter `description` becomes: `Use when receiving code review feedback from a human or external reviewer (GitHub review, human partner), before implementing suggestions, especially when feedback is unclear or technically questionable - verify, push back with evidence, never perform agreement; the subagent-driven-development review-fix loop is out of scope`.
2. Delete `## Real Examples` (`:159-184`). Three of its four exchanges already live in their owning sections: the clarification exchange at `## Handling Unclear Feedback` `:52-59`, the performative-agreement line at `:32`, the YAGNI question at `:96`. Change `:54` from `your human partner: "Fix 1-6"` to `your human partner: "Fix items 1-6"` so the AC's literal appears exactly once. Relocate the one unique exchange, "Technical Verification" (`:167-171`, original lines), to the end of `## When To Push Back`, introduced by the line `**Example:**`.

**`scripts/ci.mjs`**

1. Delete the two `Behaviour-change:` on **every** report pins for `skills/requesting-code-review/code-reviewer.md` and `skills/subagent-driven-development/code-quality-reviewer-prompt.md` (`:181-182`). Keep the `agents/code-reviewer.md` pin (`:180`). No new pins: the AC's `rg` checks cover the verdict, and #47's finding is that substring pins do not stop drift.

**`CHANGELOG.md`**

1. Add an `## Unreleased` entry naming #47: personas own the review contracts; templates carry scope plus pointer; `Reasoning:` line added; recipient/dispatch guidance deduplicated.

### Idea-preservation table

Every idea in deleted text and where it lives afterwards.

| Deleted text | Surviving home |
|---|---|
| Template `### Strengths` / DO "Acknowledge strengths" | Dropped by decision: review noise; the persona's `Simplicity` tags carry constructive suggestions |
| Template `### Plan Deviations` (spec said / code does / acceptable) and Calibration bullet `:30` | Template task item 5 (rewritten above) |
| Template Calibration `**Lead with strengths.**` (`:28`) | Dropped with Strengths |
| Template per-issue "Why it matters" / DO "Explain WHY" | Persona finding line `— one-sentence problem and its consequence` |
| Template `touched-files:` qualifier "files a fix would edit (not just the evidence location)" and `touched-resources:` "a fix or its verification touches" | Persona `:57-59` sentence (qualifiers added) |
| Template `### Recommendations` | Dropped by decision: non-finding process notes are noise; Simplicity tags cover architecture cuts |
| Template `### Assessment` `Reasoning:` 1-2 sentences | Persona `Reasoning:` line |
| Template `Ready to merge?` | Replaced by persona `Verdict:` (already the consumers' vocabulary) |
| Template tier gloss ("Architecture problems, missing features, ...") | Persona severity list already defines each tier |
| Template DO "Categorize by actual severity", "Be specific (file:line)", "Give clear verdict"; DON'T "Mark nitpicks as Critical", "Avoid giving a clear verdict" | Already in persona (severity rule, file:line, mandatory `Verdict:`) |
| Template DON'T "looks good without checking", "feedback on code you didn't review", "Be vague" | Three new persona `Rules:` bullets |
| Template `## Example Output` | Dropped: it demonstrated the dead shape; the persona's fenced block is the example |
| Template and SDD-prompt F-grammar and `Footer order:` copies | Persona `:66-80` |
| spec-reviewer-prompt finding fields, grammar copy, `Report: ✅/❌` shape | `agents/spec-reviewer.md` (`:66-78` fields, `:82-90` grammar, `:60` verdict) |
| Five `grammar identical` lockstep comments | Deleted: single owner makes them moot; their "do not unify with writing-plans' plan-time line" clause survives as one comment beside the code-reviewer grammar |
| SDD `:182` cwd paragraph | `dispatching-parallel-agents` "pi-cohort Integration" |
| requesting `Act on feedback` (fix Critical/Moderate, note Minor, push back) | Fix-round paragraph `:60` already covers the first; new pointer sentence covers the other two |
| requesting `## Example` | Dropped: payload placeholders duplicate `:46-52`; the sample response shows the dead shape; its `git log --oneline | grep "Task 1"` BASE_SHA hint is dropped by decision (SHA capture `:28-32` owns the recipe) |
| requesting `If reviewer wrong` list | `receiving-code-review` `## The Response Pattern` / `## Handling Unclear Feedback` |
| receiving `## Real Examples` (4 exchanges) | Three already present in owning sections (`:52-59`, `:32`, `:96`); "Technical Verification" relocated to `## When To Push Back` |
| implementer `:106` duplicate | `:33` |

### Edge cases

- `Reasoning:` is a new second line. SDD, hotfix, and the finish gate read `Verdict:` and the footer lines; no consumer keys on line 2, so nothing breaks. `Footer order:` unchanged.
- SDD's `## Previous review report (re-review trigger)` pastes the prior report verbatim; it carries whatever the persona produced and needs no edit.
- `agents/code-reviewer.md`, `agents/spec-reviewer.md`, and `agents/conformance-reviewer.md` frontmatter unchanged (preset `agentOverrides` knobs unaffected).
- `.claude-plugin/marketplace.json` excludes every touched skill; no Claude Code consumer sees the change.

### Verification

- `npm test` green (skill/agent lint, updated ci pins, model-literal lint, AGENTS core check).
- `rg -n "Ready to merge" agents skills` -> no match. `rg -l "Footer order:" agents skills` -> exactly `agents/code-reviewer.md` and `agents/conformance-reviewer.md`. `rg -lF "Parallel-safe: <group>" skills/requesting-code-review/code-reviewer.md skills/subagent-driven-development/code-quality-reviewer-prompt.md skills/subagent-driven-development/spec-reviewer-prompt.md` -> no match (the pattern matches the current copies at template `:128` and spec prompt `:108` before the change). `rg -n "Spec compliant|Issues found" skills/subagent-driven-development/spec-reviewer-prompt.md` -> no match.
- `rg -l "grammar identical" agents skills` -> no match. `rg -l "change them together" agents skills` -> exactly `agents/spec-reviewer.md` and `skills/subagent-driven-development/spec-reviewer-prompt.md`.
- Frontmatter of every touched `SKILL.md` parses: `node -e 'const {parse}=require("yaml"); ...'` over the `---` block, and the `dispatching-parallel-agents` description length is under 1,024.
- `rg -c "failing test first" skills/subagent-driven-development/implementer-prompt.md` -> 1. `rg -c "Fix items 1-6" skills/receiving-code-review/SKILL.md` -> 1.
- `git diff --stat -- skills/chase-bug/hotfix.md skills/verification-before-completion/reference/conformance-check.md .claude-plugin/marketplace.json` -> empty.
- Byte-identity of preserved ranges: `git diff -U0 skills/requesting-code-review/SKILL.md` shows no hunk inside the SHA-capture, dispatch, or fix-round paragraphs; same for SDD's wave code block.
- `git diff --shortstat -- '*.md'` -> deletions exceed insertions. `wc -l` on every touched `SKILL.md` < 500.
- Read every sentence written above in place: imperative, no conditional.

## Out of scope

- Moving the top-level `cwd`/worktree rule into pi-cohort's `skills/pi-cohort/SKILL.md`. Follow-up ticket in jjuraszek/pi-cohort, filed by the orchestrating session via `/skill:shape-ticket` at the finish step (gated tracker write); the finish report cites the ticket URL. Draft: Context - the `subagent` tool resolves the worktree base from top-level `cwd`, which defaults to the process cwd; Problem - pi-cohort's skill does not state this, so pi-gauntlet's `dispatching-parallel-agents` owns a pi-cohort tool fact; Idea - pi-cohort's skill states the rule once; `dispatching-parallel-agents` then points there.
- Changing #30's severity tiers or verdict mapping.
- The point-of-use `async: false` sentences (rejected in the ticket).

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` (Unreleased entry)
- Derived / memory docs invalidated: none (`doc/personas.md` and `README.md` name no report fields; AGENTS.md routing unchanged; skill and persona bodies are implementation surface per `reference/documentation-impact.md`)
