# Gate-style dispatch fidelity

Sample: gh-30-reviewer-verdict-severity. The installed persona matched the baseline arm (git reference 2166283), not the candidate arm: SHA256 `331b4d46184a915389e37587238986b38f05d3f6a50c9291c6737faabb9fc272`.

Dispatch: `subagent({ agent: "spec-summarizer", context: "fresh", model: "anthropic/claude-opus-5-5", outputMode: "file-only" })`, reading only the sample spec. The driver baseline used `pi -p --no-tools` with the source inlined. The trailing acceptance-report block was stripped before measuring and scoring. Both outputs were scored against the same source, expected facts, and reviewer prompt; each reviewer returned parseable JSON on the first call.

| output | words | backtick_lines | path_tokens | Astra quality | Fable quality | kept/disputed/lost |
|---|---|---|---|---|---|---|
| Driver pi -p baseline | 665 | 18 | 5 | mixed | mixed | 5/0/0 |
| Gate-style subagent | 754 | 21 | 6 | mixed | mixed | 5/0/0 |

differ: none

Every expected fact was yes from both reviewers in both outputs; the gate-style output was 89 words longer with more identifiers but the same quality ratings, so this baseline sample supports fact-scoring fidelity without proving equivalent length or candidate-arm fidelity.

## Gate-style briefing (verbatim)

```markdown
# Spec summary: the code-reviewer verdict follows severity (issue #30)

**Status banner:** a later spec, `2026-09-23-gh-47-review-contract-single-owner.md`, supersedes this one in one respect only. It replaces the accepted residual about leaving the template's "Ready to merge" example untouched. The rule that severity sets the verdict still holds.

## Problem + idea
The `code-reviewer` persona defines three verdicts: `SHIP | FIX_FIRST | REJECT`. It calls Moderate findings "should fix; open for discussion (not strictly blocking)" but never says which severity leads to which verdict. As a result, a report with only Moderate findings can come back as either `SHIP` or `FIX_FIRST`. Every orchestrating skill already treats Critical and Moderate as blocking: requesting-code-review, subagent-driven-development, chase-bug hotfix, gatekeep-pr and the README. The fix writes that existing policy into the persona. The spec says this aligns the persona with the skills and does not change policy.

## Key decisions
- A Critical or Moderate finding means `FIX_FIRST`. Minor-only findings or no findings mean `SHIP`. Minor is the only severity a reviewer can decline without a fix round or re-review.
- `REJECT` does not come from severity. It overrides both other verdicts, for a change that must not land at all. Its triggers stay undefined.
- **Rejected:** making only Critical blocking. That would be a policy change and needs its own brainstorm.
- **Style:** imperative wording with no conditionals, per a user directive. New severity rows keep the list's existing em-dash. That conflicts with the repo's ASCII punctuation rule; the spec chooses consistency with the surrounding list.

## Scope
**In: four edits across two files, nothing else.**
1. `agents/code-reviewer.md`: add a rule paragraph between the closing fence of the report template and the `Severity:` list:
   > "Severity decides SHIP versus FIX_FIRST. A Critical or Moderate finding means FIX_FIRST. Minor-only findings and clean reports mean SHIP. REJECT overrides both: refuse a change that must not land at all."
2. Same file, severity rows:
   - Moderate becomes "must fix before merge (significant defect or drift that does not rise to Critical)".
   - Minor gains "; the only severity declinable without a fix round or re-review".
3. Same file, frontmatter description: "Critical blocks merge" becomes "Critical and Moderate block merge".
4. `CHANGELOG.md`: a new `## Unreleased` section above the top version heading, with one bullet citing #30.

**Out:**
- The dispatch template `skills/requesting-code-review/code-reviewer.md` (hard constraint from #30).
- Other severity definitions.
- Defining when `REJECT` applies.
- Runtime verdict enforcement in `extensions/phase-tracker.ts`.
- The fix-loop rules from #7 and the escalation loop from #29.

## Risk surface
Risk is low: the change is prose only, applies to one persona and can be reverted easily.
- **Contract the skills read:** the persona body is the child's full system prompt (`systemPromptMode: replace`). The change only moves the persona toward what the skills already assume.
- **Report template:** lines 30-45 must stay byte-for-byte unchanged, including the `Verdict:` line. The spec checked that the dispatch template contains no verdict tokens, so nothing else needs to change to match.
- **CI version check:** the spec checked that a `## Unreleased` heading above the top version still passes the check at `scripts/ci.mjs:89`.
- **Accepted residual:** the dispatch template's worked example still ends "Ready to merge: With fixes" and calls Moderate issues "easily fixed". That contradicts the new rule but is out of scope here. The spec says conformance review must not count it as a miss. The superseding spec now covers this point.

## Edge cases
| Findings | Verdict |
|---|---|
| None | `SHIP` |
| Moderate only | `FIX_FIRST` (the case this spec targets) |
| Any mix, change must not land | `REJECT` (overrides the other two) |

## Acceptance
No behavioral test exists for persona prose. CI only checks that the frontmatter `name` and `description` are present. Grep checks are therefore the whole conformance gate:
- `npm test` passes.
- `git diff` touches exactly the two files, and the fenced template shows no change.
- **AC 1:** the rule text, the new Moderate wording and the Minor "only severity declinable" wording are all present, and "open for discussion" returns no match.
- **AC 2:** the rule names the verdict for each severity, and the `^Verdict: SHIP \| FIX_FIRST \| REJECT$` line is unchanged.
- **AC 3:** the CHANGELOG bullet matches `stated function of severity.*\(#30\)`.
- The frontmatter contains "Critical and Moderate block merge".

## Gaps: context the spec relies on but does not include
- **Issue #30:** the source of AC 1-3 and of the "do not alter the template" constraint. The AC text is only paraphrased through grep mappings.
- **The brainstorm:** cited as confirming the direction, with no record included.
- **Issues #7 and #29:** the fix-loop and escalation rules are said to be untouched, but their content is not stated.
- **Superseding spec `2026-09-23-gh-47-review-contract-single-owner.md`:** how it resolves the "Ready to merge" residual is not described here.
```
