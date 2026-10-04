# code-reviewer verdict is a function of severity

> **Superseded by:** [doc/specs/2026-09-23-gh-47-review-contract-single-owner.md](./2026-09-23-gh-47-review-contract-single-owner.md) - accepted residual "template `Ready to merge` example left untouched" only; severity-to-verdict policy stands

**Goal:** Fix GitHub issue #30. `agents/code-reviewer.md` labels Moderate as "should fix; open for discussion (significant but not strictly blocking)" but never maps severity to a verdict, so a Moderate-only report nondeterministically returns `FIX_FIRST` or `SHIP`. Make the verdict a stated function of severity, matching the policy the orchestrating skills already enforce. Alignment, not a policy change.

## Problem

The live persona (`agents/code-reviewer.md`, loaded with `systemPromptMode: replace`, so its body *is* the child system prompt) declares `Verdict: SHIP | FIX_FIRST | REJECT` (`agents/code-reviewer.md:31`, inside the fenced report template at lines 30-45) and defines Moderate as "should fix; open for discussion (significant but not strictly blocking)" (`agents/code-reviewer.md:50`). Nothing in the file says which severity yields which verdict.

Meanwhile every orchestrator surface already treats Critical and Moderate as blocking:

- `skills/requesting-code-review/SKILL.md:55-60` - "Fix Critical and Moderate issues before proceeding"; re-review after fixes.
- `skills/subagent-driven-development/SKILL.md:238-240` - whole-diff review: address Critical and Moderate findings before verify.
- `skills/chase-bug/hotfix.md:90` - a `FIX_FIRST` round fixes every Critical and Moderate finding.
- `README.md:347-348` and `skills/gatekeep-pr/SKILL.md:166-168,301-302` state the same mapping.

So a Moderate-only report can textually justify `SHIP` inside the persona while every consumer assumes `FIX_FIRST`. The fix closes that contradiction inside the persona.

## Decided direction (issue #30, confirmed in brainstorm)

- Critical or Moderate finding -> `FIX_FIRST`.
- Minor-only findings and clean reports -> `SHIP`.
- Minor is the only severity declinable without a fix round or re-review.
- REJECT semantics unchanged: the refusal for a change that must not land at all, not severity-derived. It overrides the severity-driven choice rather than extending it.
- Style: imperative statements, no conditional phrasing (user directive).

## Changes

Four edits, two files. Nothing else.

### 1. `agents/code-reviewer.md` - verdict rule (core fix)

The fenced report template (lines 30-45) stays byte-unchanged. Insert the rule as prose between the closing fence and the `Severity:` list (i.e. a new paragraph after line 45, before line 47):

```text
Severity decides SHIP versus FIX_FIRST. A Critical or Moderate finding means
FIX_FIRST. Minor-only findings and clean reports mean SHIP. REJECT overrides
both: refuse a change that must not land at all.
```

### 2. `agents/code-reviewer.md` - severity rows (lines 50-51)

Byte-exact current text (em-dash, trailing period):

```text
- **Moderate** — should fix; open for discussion (significant but not strictly blocking).
- **Minor** — nit, style, preference, suggestion.
```

Replacement, matching the list's existing em-dash style:

```text
- **Moderate** — must fix before merge (significant defect or drift that does not rise to Critical).
- **Minor** — nit, style, preference, suggestion; the only severity declinable without a fix round or re-review.
```

This delivers AC 1: Moderate is merge-blocking, both optionality phrases ("should fix; open for discussion", "not strictly blocking") are gone, and Minor is named the sole declinable severity.

### 3. `agents/code-reviewer.md` - frontmatter description (line 3)

The description is the persona's own policy summary; today it contradicts the body by omission ("Critical blocks merge, Minor is a nit."). Fix the contradiction in place:

```diff
-Critical blocks merge, Minor is a nit.
+Critical and Moderate block merge, Minor is a nit.
```

### 4. `CHANGELOG.md` - new `## Unreleased` section

Add an `## Unreleased` section above the top version heading with exactly this bullet:

```markdown
## Unreleased

- `code-reviewer`: verdict is a stated function of severity - a Critical or Moderate finding means `FIX_FIRST`, Minor-only and clean reports mean `SHIP`, matching the orchestrating skills. (#30)
```

Verified: `scripts/ci.mjs:89` matches the first `## vX.Y.Z` heading via `/^##\s+v(\d+\.\d+\.\d+)/m`, so `## Unreleased` above the top version passes the version-alignment check.

## What stays the same

- The fenced report template (`agents/code-reviewer.md:30-45`), including the `Verdict: SHIP | FIX_FIRST | REJECT` grammar line, is byte-unchanged. That grammar is persona-local: `skills/requesting-code-review/code-reviewer.md` contains no `Verdict`/`SHIP`/`FIX_FIRST`/`REJECT` tokens (verified by rg), so there is no verdict grammar to sync.
- The grammar-sync comment at `agents/code-reviewer.md:60` governs the `Parallel-safe:` block, which this change does not touch; it does not fire.
- `skills/requesting-code-review`, `skills/subagent-driven-development`, `skills/chase-bug/hotfix.md`: untouched; their policy is the target state.
- Fix-loop trajectory/convergence rules from #7 and the escalation loop from #29: untouched.
- **Accepted residual:** the dispatch template's worked example (`skills/requesting-code-review/code-reviewer.md:198-200`) ends `**Ready to merge: With fixes**`, reasoning that "Moderate issues ... are easily fixed" - the framing #30 removes from the persona. Editing that template is hard-constrained out of scope by #30 ("Do not alter `skills/requesting-code-review/code-reviewer.md`"); conformance must not score this as a miss.

## Out of scope

- Editing the dispatch template `skills/requesting-code-review/code-reviewer.md` (hard constraint from #30).
- Changing severity definitions beyond the Moderate and Minor rows above.
- Defining REJECT's trigger conditions beyond the one-line characterization in the rule.
- Critical-only blocking (a policy change requiring its own brainstorm; explicitly rejected in #30).
- Runtime verdict enforcement in `extensions/phase-tracker.ts` (separate brainstorm).

## Edge cases

- **Zero findings:** SHIP, stated by "clean reports mean SHIP".
- **Moderate-only report:** FIX_FIRST. The target case; the rule states it directly.
- **REJECT with any finding mix:** "REJECT overrides both" keeps it available for a must-not-land change regardless of findings; its triggers are undefined today and stay undefined.

## Testing and verification

No behavioral test exists for persona prose; `scripts/ci.mjs` asserts only frontmatter `name`/`description` presence for agents (`scripts/ci.mjs:131`), so the grep checks below are the whole conformance gate.

1. `npm test` passes with the frontmatter and body edits and the new `## Unreleased` section.
2. `git diff` touches exactly `agents/code-reviewer.md` and `CHANGELOG.md`; the fenced template in `agents/code-reviewer.md` shows no changes.
3. Grep-able expected strings, one per AC:
   - AC 1: `rg -n "Severity decides SHIP versus FIX_FIRST" agents/code-reviewer.md` (rule present, scoped); `rg -n "must fix before merge \(significant defect or drift" agents/code-reviewer.md` (Moderate blocking); `rg -n "the only severity declinable without a fix round" agents/code-reviewer.md` (Minor sole-declinable); `rg -n "open for discussion" agents/code-reviewer.md` -> no match (framing removed).
   - AC 2: the rule paragraph names FIX_FIRST for Critical-or-Moderate and SHIP for Minor-only/clean (same grep as above covers both halves); `rg -n "^Verdict: SHIP \| FIX_FIRST \| REJECT$" agents/code-reviewer.md` -> unchanged grammar line.
   - AC 3: `rg -n "stated function of severity.*\(#30\)" CHANGELOG.md`.
   - Frontmatter: `rg -n "Critical and Moderate block merge" agents/code-reviewer.md`.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: none
- Derived / memory docs invalidated: none

(Persona body and frontmatter are implementation surface, not doc-impact entries; the CHANGELOG bullet is issue AC 3, not a docs-class entry.)
