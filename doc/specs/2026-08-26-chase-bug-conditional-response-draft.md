# chase-bug: response draft only for addressable origins

## Context

`skills/chase-bug/SKILL.md` currently offers a drafted response for **every** terminal verdict (step 5, gate 2): the draft template is composed, the channel ladder resolves a destination, and - when a push will happen - the human is asked for the exact `send it` token. When no write path resolves (Slack paste, free text), today's behavior renders the draft as an ungated copy-paste block ("Copy-paste delivery is terminal and ungated"): message-shaped output addressed to a reporter nobody can reach. The original design is in `doc/specs/2026-08-23-gh-12-chase-bug-triage-skill.md`; this spec supersedes the parts of that design listed under [Supersession](#supersession).

Precedent inside the repo: `skills/shape-ticket/SKILL.md` emits tracker comments only on overflow or an explicit in-session ask - optional external writes are ask- or need-driven, not unconditional.

## Problem

For Slack pastes and free-text reports there is no reachable reply destination (the paste's origin is lost; free text never had one). Composing a "response to the reporter" is ceremony without a recipient: the human gets a copy-paste block they will never paste anywhere, framed as a message instead of as the triage result. The verdict menus reinforce it - "Respond to reporter only" is offered even when no reporter is reachable.

## Design

Files changed: `skills/chase-bug/SKILL.md` (the behavior), the supersession banner on `doc/specs/2026-08-23-gh-12-chase-bug-triage-skill.md`, and one README.md sentence (see [Documentation impact](#documentation-impact)). Prose-only; one new classification bit, surgical wording edits, no new gates, no new machinery.

### Addressability (step 1 - origin intake)

Intake already records origin type and origin channel. The change makes the channel field honest and adds one derived bit:

- **Origin type** - unchanged, immutable for the run (it also keeps driving the file-a-ticket menu-omission rule).
- **Response target** - the origin channel when one exists, else `none`. A GitHub issue or tracker ticket origin has a response target; a Slack paste or free text does not (the paste's origin is lost).
- **Addressable** = response target is not `none`.

The response target can be *set* mid-chase: if at any point the human explicitly asks for a comment on a specific channel ("comment on gh-14", "draft a Slack reply"), that channel becomes the response target and the run is addressable from then on. An explicit ask sets the response target **only** - it does not reclassify origin type and does not affect the file-a-ticket menu-omission rule.

### One delivery rule

Gate 2 (`send it`) exists only where a push will happen. Uniform rule, both branches of step 5:

- Response target set **and** the channel ladder resolves a write path -> draft + gate 2 (`send it`) + push; push failure falls back to an ungated copy-paste render, as today.
- Response target set, **no** write path -> draft rendered as an ungated copy-paste block (the human is the courier), as today.
- No response target -> no draft at all; the rendered summary below.

### Step 5 branch

Step 5 opens with the branch:

- **Addressable** -> today's behavior: draft template, channel resolution ladder, delivery per the rule above, sequencing rules (shape-ticket first so the draft cites the new ticket link; draft before brainstorm handoff).
- **Unaddressable** -> no draft. The terminal action renders the verdict as a **summary to the human**, then the skill ends (or hands off). Sequencing mirrors the addressable branch with the summary in the draft's place:
  - File a ticket / discovery ticket chosen -> `/skill:shape-ticket` runs (its own gate) -> render the summary citing the new ticket link -> done. If shape-ticket is cancelled at its gate, render the summary without a ticket link.
  - Brainstorm now chosen -> render the summary -> hand off to `/skill:brainstorming`.
  - Finish with rendered summary chosen -> render the summary -> done.

**Summary template** (literal; reuses the draft's four fields - the distinction from the draft is framing and delivery affordances, not headings):

```
Symptom: <restate what was reported>
Verdict: <the verdict, one line - the fault story or citation from the menu>
Evidence: <file:line / commit / repro result>
Next step: <ticket link | fix branch | correct usage | what input is missing>
```

What makes it a summary, not a draft: no resolved channel named, no `send it` token, no reporter-facing framing (no salutation, no "please provide X" addressed to a reporter - state what is missing as fact).

Gate count: the skill retains **at most two chase-bug-owned human gates** (delegated skills' gates, e.g. shape-ticket's, are excluded from the count, matching the gh-12 spec's "bounding chase-bug's own flow" qualifier). Unaddressable runs have exactly one chase-bug-owned gate (the verdict menu). No third gate is introduced anywhere.

### Step 4 menu rewording

Only rows and lines that name a reporter or gate 2 change, and only for unaddressable origins:

- Real-bug menu: action 3 "Respond to reporter only" -> "Finish with rendered summary". Actions 1-2 (file a ticket / brainstorm now) keep their labels; action 2's "Handoff happens AFTER gate 2 (step 5)" becomes origin-conditional ("after gate 2, or after the rendered summary when unaddressable"). Exactly one rendered action still carries `[recommended]`.
- `[recommended]` heuristic: the "blocked on another party -> recommend respond-only" branch maps to "Finish with rendered summary" for unaddressable origins.
- Negative-verdict menu: row 1 "Respond to reporter with this verdict and citation" -> "Finish with rendered summary"; row 2 "Finish without a response" is dropped for unaddressable origins (the summary *is* the finish). The `cannot-replicate` discovery-ticket row stays.

Addressable origins keep today's menus verbatim.

### Consequential wording edits (each one line)

- **Boundaries**: "plus one gated push to the origin's response channel at the very end" -> "plus **at most** one gated push...".
- **Invariant checkpoint 3**: "(after a push or after rendering a copy-paste draft)" -> add "or after rendering the summary".
- **Step 4 gate-count sentence**: "There are exactly two human gates in this whole skill" -> "at most two chase-bug-owned human gates ... (gate 2 only when a response target is set)".
- **Rationalization table**: reality column of the drafting row -> "Every addressable origin gets a drafted response at gate 2; unaddressable ones get the rendered summary" (excuse column unchanged).
- **Red flags**: "Handing off to /skill:brainstorming, or ending the skill, without offering gate 2" -> "...without offering gate 2 (addressable) or rendering the summary (unaddressable)".
- **Golden real-bug example**: one added line noting the example assumes an addressable origin (its action 3 label is the addressable one).

Deliberately unchanged: the Quick Reference table (its "Response next-step" column describes content, not delivery), the channel resolution ladder itself, the `## Response channels` / `## Issue tracker` override extension points, the prior-report search ladder, and the rationalization row "Reporter is waiting, skip the gate" (still guards the addressable case).

## Edge cases

- **Tracker-ticket origin with no CLI/write path**: addressable; per the delivery rule the draft renders as an ungated copy-paste block (the human is the courier). No gate 2 - there is nothing to push. Unchanged from today.
- **Explicit ask for a channel with no write path** (e.g. Slack-paste origin, human asks for a Slack reply): response target set, no write path -> draft as ungated copy-paste block. Same rule.
- **Explicit ask after the summary rendered**: out of skill scope - the skill has ended; a subsequent request is normal conversation. The exception covers asks *during* the chase.

## Supersession

`doc/specs/2026-08-23-gh-12-chase-bug-triage-skill.md` gets the standard banner. Superseded clauses, by that spec's own structure:

- Section "6. Response-to-origin (human gate 2)" - the unconditional "offered for every terminal verdict/action" design.
- The "Design decisions" bullet "Exactly two human gates, bounding chase-bug's own flow" - becomes "at most two chase-bug-owned gates" (the "bounding chase-bug's own flow" qualifier itself stays authoritative and is restated above).
- Verification line "two human gates only" (in its skill-structure checklist).
- Appendix AC 7: "Response-to-origin is offered for every terminal verdict and action" - replaced by the conditional behavior here. The rest of AC 7 (exact-text confirmation for pushes, copy-paste fallback attempts nothing) stays authoritative and is preserved by the delivery rule above.

Banner text: `> **Superseded by:** [doc/specs/2026-08-26-chase-bug-conditional-response-draft.md](./2026-08-26-chase-bug-conditional-response-draft.md) - section 6 response-to-origin design, the "exactly two human gates" decision, and appendix AC 7's "offered for every terminal verdict" clause only`. All other sections of that spec remain live; the inherited constraints this spec relies on (exact `send it` for pushes; copy-paste fallback attempts nothing; fixture-smoke verification convention) are restated inline above so no mental merge is required.

## Testing approach

No mechanical semantic coverage exists for skill bodies (`scripts/ci.mjs` validates frontmatter, marketplace allowlist, and packaging only). Verification is:

- **RED baseline first** (per `skills/writing-skills/SKILL.md` RED-GREEN-REFACTOR): a fresh-context run against the *unmodified* skill with a free-text report, capturing today's unwanted behavior (draft composed, copy-paste block rendered as a reporter-facing message). Record prompt and output.
- Apply the edits; `npm test` (structural CI) passes.
- Re-read of the edited skill for internal consistency: response target defined once in step 1, referenced (not redefined) in steps 4-5, the delivery rule holds everywhere, no row offers a reporter response for an unaddressable origin.
- **GREEN fixture smoke**, fresh context per case: (a) free-text report -> rendered summary only: no resolved channel named, no `send it` token, no reporter-facing framing; (b) GitHub-issue report -> unchanged draft + gate 2; (c) free-text report with a mid-chase "comment on issue #N" ask -> draft + gate 2 for that channel; (d) tracker-ticket report with no CLI -> draft as ungated copy-paste block. Record prompts and outputs; re-run affected cases after any example/rationalization edits.

## Out of scope

- Any change to shape-ticket, check-delivery, gatekeep-pr, flow skills, extensions, or the Claude marketplace allowlist.
- Ask-driven-only responses for addressable origins (rejected during brainstorm: GitHub/tracker origins keep the default draft path).
- New settings keys or override sections - the existing `## Response channels` extension point is untouched.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - the chase-bug sentence in the Architecture skill list ("...then a gated response to the reporter...") gains the conditional: gated response for addressable origins, rendered summary otherwise. One-sentence edit, same register.
- Derived / memory docs invalidated: none

(The supersession banner on the gh-12 spec is part of this spec's own mechanics, not a doc amendment.)
