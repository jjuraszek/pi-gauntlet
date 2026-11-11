# gh-32: Premise verdict, per-question recommendation, and lookup-before-asking in brainstorming

> **Superseded by:** [doc/specs/2026-10-01-questionary-options-format.md](./2026-10-01-questionary-options-format.md) - Design: the accept-or-override premise question and the ask-even-when-ticket-recorded clause
> **Superseded by:** [doc/specs/2026-11-11-readable-brainstorm-opening-message.md](./2026-11-11-readable-brainstorm-opening-message.md) - Design "2. Premise verdict paragraph": the plain-prose, no-template form and sources in chat

**Ticket:** jjuraszek/pi-gauntlet#32
**Date:** 2026-09-17

## Problem

The brainstorming questionary asks questions it could have answered itself, offers no recommended answer (leaving the decision cost entirely on the user), and can carry a false premise silently into the design. Issue #32's example: a brainstorm over a superseded predecessor spec produced a design contradiction that only surfaced at review - nothing in the skill would have stated the premise unprompted. The issue's AC is deliberately minimal: sentence-level additions to `skills/brainstorming/SKILL.md` only, no new heading, no other file, one-question-at-a-time unchanged, at most one new Red Flags entry.

## Goal

Before approaches are proposed, the running brainstorm states in chat - in plain, actionable prose a person can act on - what the design depends on, what was verified where, and what could not be verified; a contradiction stops the flow until the user accepts the corrected fact or explicitly overrides it, with the outcome recorded in the spec. Every questionary question ends with a recommendation and its reason. A question whose answer lives in the code, the docs, or the issue tracker is looked up, not asked.

## Design

One file, `skills/brainstorming/SKILL.md`, three additions (approach A from the brainstorm: in-place, each rule next to the behavior it governs).

### 1. Question-asking bullet (`### 3. Understand the idea`)

The existing "Ask questions **one at a time**..." bullet gains two short sentences:

- Before asking, check whether the answer is in the code, the docs, or the issue tracker; if it is, look it up instead of asking (a subagent is fine when the lookup is costly).
- When asking, end the question with the literal suffix `Recommendation: <answer> - <why>`. This includes the accept-or-override question after a contradiction, which recommends the corrected fact.

The one-question-per-message rule stays verbatim. This bullet is the only place the skill defines how a question gets asked, so both rules live here.

### 2. Premise verdict paragraph (end of `### 3. Understand the idea`, before `### 4. Explore approaches`)

One short plain-prose paragraph (3-4 sentences) at the end of section 3, immediately before `### 4. Explore approaches` (the AC's "between Understand the idea and Propose 2-3 approaches" also reads as a checklist-ordering requirement; the checklist step-4 tail in section 3 of this spec satisfies that reading):

- Before proposing approaches, state in chat what the design depends on: which claims the sources support and where (a file and line, a doc, a ticket), which they disprove - with the corrected fact and where it was found - and which remain unverified, naming the failed lookup.
- The message reads as an actionable note for a person: full sentences, no status-keyword lists. No verdict template block.
- If anything the design depends on turned out contradicted, the note is the next message on discovery, and neither the questionary nor approaches continue until the user accepts the corrected fact or explicitly overrides it. Record the outcome by appending it to the draft's `## Appended during questionary`, carried at spec-writing into `## Problem` or the relevant `## Design` decision - a chat-only resolution dies at spec-writing.

Empty-set handling: for a spec with no design-dependent claims, the note is one sentence saying so - never a silent skip.

### 3. Checklist step 4 tail and one Red Flags entry

- Checklist step 4 gets one appended clause - `; then state the chat premise note (section 3) before approaches` - pointing at the verdict (the checklist is the pointer, the section is the definition - no restatement).
- Red Flags gains exactly one entry: proposing approaches while a contradicted claim is unresolved.

### Explicitly out of scope

- No verdict template or status-keyword format (violates the plain-prose requirement).
- No changes to `gatherer.md`, the critique pass, the user gate, or the two design rounds.
- No adoption of the `grilling` provenance skill's full interview model (batch frontier questions, exhaustive design-tree traversal) - behavior is adapted, text is not copied, per the issue.
- No change to the one-question-at-a-time cadence; costly lookups keep the existing foreground dispatch policy.

## Error handling and edge cases

- **Contradiction mid-questionary:** on discovery the premise note is the next message; no further questionary or approaches until the user accepts the corrected fact or explicitly overrides it (the accept-or-override question itself carries a `Recommendation:` suffix recommending the corrected fact).
- **Unverifiable claim:** not a stop - the claim is named with its failed lookup and becomes an Open Question or a stated assumption in the spec.
- **User override:** permitted; the outcome (corrected fact accepted or explicit override) is appended to the draft's `## Appended during questionary` and carried into the spec, so the plan and conformance pass inherit the same fact base.
- **Drift between checklist clause and section paragraph:** checklist is the pointer, section is the definition.

## Testing

Per `skills/writing-skills/SKILL.md` (discipline-skill edit, RED-GREEN-REFACTOR via `subagent`):

**Scenario (used for both RED and GREEN).** A temporary fixture in `$TMPDIR` (a scratch repo plus a fake tracker file, so nothing outside the fixture is touched): a brainstorm request whose premise the fixture's code contradicts, one question the fixture's tracker file already answers, and one genuine decision question no source can answer. The worker enters scoped - "you are at brainstorming checklist step 4 with this draft; follow sections 3-4 of <abs path to skills/brainstorming/SKILL.md>" - so tracker resets, worktree creation, and gather fan-out do not run as side effects. Combined pressures per writing-skills: time pressure, sunk cost (an approach sketched in the prompt), and a hint that the premise "was already checked".

1. **RED:** run the scenario against the unedited skill. Baseline expectation: the tracker-answerable question is asked verbatim, the decision question carries no `Recommendation:` suffix, and approaches are proposed over the false premise without any premise note.
2. **GREEN:** apply the edit, re-run: the tracker-answerable question is replaced by a lookup; the decision question is asked and ends with `Recommendation: <answer> - <why>`; on the contradicted premise the note is the next message (stating the corrected fact and where it was found) and nothing else continues; both continuations work - the user accepting the corrected fact and the user explicitly overriding - and the outcome lands in the draft's `## Appended during questionary`.
3. **REFACTOR:** close any loophole the GREEN run reveals (e.g. "verified mentally" with no citation), re-test. Counter wording stays sentence-level - a rationalization table would violate the no-new-heading AC.
4. **Mechanical gate:** `npm test` (scripts/ci.mjs - frontmatter and historical-token probes; several banned tokens, e.g. "validate each" and "Ask after each", are natural phrasings for a verdict paragraph, so this gate is a real wording constraint on the new sentences).

## Documentation impact

Materiality bar: `reference/documentation-impact.md` (relative to `skills/brainstorming/`).

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none
- Derived / memory docs invalidated: none

The change is sentence-level additions inside an existing skill body - implementation surface, not doc-impact entries. This implementation touches only `skills/brainstorming/SKILL.md`; the CHANGELOG entry (an `## Unreleased` bullet with the `(#32)` trailer) belongs to the release operation, not this diff.

## Open questions

None blocking. Resolved during the questionary: verdict channel (chat, before approaches), verdict format (plain prose), packaging (in-place in section 3), recording path (the draft's `## Appended during questionary`, carried into the spec at spec-writing), citation form (file and line, doc, or ticket - the exact-paths-and-line-ranges practice `gatherer.md` already prescribes for scout recon).
