# chase-bug: verdict, draft, and summary as a short briefing for a non-coder

**Goal:** Replace chase-bug's three code-fenced `Label: value` output templates (step-4 fault story, step-5 reporter draft, step-5 terminal summary) with one skill-local "Verdict shape" rule that renders each as three plain sentences a reader who does not know the code can act on, with no code fence and no label lines, while the numbered menu stays exactly as it works today.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves

## Problem

Framing: kept - checked `skills/chase-bug/SKILL.md` step 4 (lines 155-160), the step-5 draft template (297-302) and summary template (363-368), the golden examples (392-416), the eval replay output in `eval/chase-bug/results/returned-ticket-link/candidate.json`, `agents/spec-summarizer.md` (a PM-briefing persona; a dispatch is heavier than a prose rule), and the eval slice in `eval/chase-bug/target.json`.

Today the skill says "Present the verdict as a plain-language fault story" and then shows the agent a code fence holding `Fault story: <trigger> -> <mechanism> -> <effect>` and `Proof: <repro> | <file:line> | <before/after>`. Steps 5's draft and summary are fences holding `Symptom:` / `Verdict:` / `Evidence:` / `Next step:`. The negative-verdict menu carries its own fenced `Verdict: <verdict name> - <citation>` line above its rows. Nothing says to emit prose instead of the fence, so the agent copies the labels, and sometimes the fence, into chat. The `returned-ticket-link` replay shows the label leak (both saved outputs, no fence):

```text
Symptom: Opening `/widgets/` returns 404 instead of 200.
Verdict: Real bug. The router fails to match paths with a trailing slash.
Evidence: `src/router.ts:88` compares paths without stripping the trailing slash.
Next step: Already tracked in https://github.com/example/widgets/issues/42.
```

That is a form with raw identifiers, not a briefing. The fence leak shows in `eval/chase-bug/results/menu-after-numbered-findings/candidate.json`: the opus checkpoint-2 summary sits inside a triple-backtick block, and the gpt output renders the same labels emphasized (`**Symptom:**`). A product manager, or any human not proficient in the code the bug touches, cannot decide from either. The user's ask is that it stays as short as today but is written for that reader.

Premises: supported - all three surfaces are code-fenced label:value templates and no line in the skill says "no fence" (`SKILL.md` lines above, replay output above). Corrected - the step-4 fault story is not invisible to the eval: `eval/chase-bug/samples/menu-after-numbered-findings/case.md` opens with `bundle+: skills/chase-bug/SKILL.md`, which appends the whole skill to that sample's assembly, so a new step-4 sample follows that precedent with a `bundle+` line and `target.json`'s slice stays unchanged. The slice (`### 5. Response to origin (human gate 2)` to `## Quick Reference`) still changes text under this spec, so `skillSha` moves and `intent.md`'s `for:` line is rewritten regardless. Unverified - the frozen eval models' provider auth is checkable only by running a cell; the implement step runs it.

Hard constraint from the user: the skill carries its own wording for the shape. It never references or relies on this repo's `AGENTS.md` or `AGENTS.core.md` Communication Style, because those files are not shipped to consumer repos; a skill-local restatement is the deliverable, not duplication.

Supersedes `doc/specs/2026-08-26-chase-bug-conditional-response-draft.md`, the draft template and summary template ("same four fields") clauses, and `doc/specs/2026-08-23-gh-12-chase-bug-triage-skill.md`, the step-4 fault-story presentation clause.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] At the step-4 verdict menu, the agent renders the verdict as three plain sentences above `Pick one:` with no code fence and no `Fault story:` / `Proof:` / `Symptom:` / `Verdict:` / `Evidence:` / `Next step:` label lines, under 80 words.
  in-scope
- [ ] The step-4 story names the component by what it does and the proof as a value the reader can see; the file, line, commit, or link trails the sentence it supports and never opens a sentence.
  in-scope
- [ ] The unaddressable terminal summary and the addressable reporter draft render in the same shape: three sentences, no fence, no label lines, identifiers trailing; the draft still matches the channel register and the summary still states missing input as fact.
  in-scope
- [ ] The numbered menu rows, the `[ ]`/`[x]` checkboxes, the single `[recommended]` tag, the eligibility line, the `Pick one:` separator, and numeric-reply mapping render exactly as before the change.
  in-scope
- [ ] `skills/chase-bug/SKILL.md` stays under 500 lines and 50,000 bytes after the edit, and `npm test` passes.
  in-scope
- [ ] `node eval/run.mjs chase-bug` passes with a new sample `prose-verdict-above-menu` and the two existing samples, and the committed `eval/chase-bug/report.md` shows its facts holding.
  in-scope

## Design

One file carries the behavior change: `skills/chase-bug/SKILL.md`. Edits follow `/skill:forge-skill` authoring rules (imperative voice, one rule owner, minimal diff, one example per rule, no history). `skills/chase-bug/hotfix.md` is untouched.

Two one-line supersession banners ride with the change, already drafted as uncommitted edits and part of this spec's commit: `doc/specs/2026-08-23-gh-12-chase-bug-triage-skill.md` gains `> **Superseded by:** [doc/specs/2026-10-28-chase-bug-summary-prose.md](./2026-10-28-chase-bug-summary-prose.md) - the step-4 fault-story presentation clause only` under its existing banner, and `doc/specs/2026-08-26-chase-bug-conditional-response-draft.md` gains `> **Superseded by:** [doc/specs/2026-10-28-chase-bug-summary-prose.md](./2026-10-28-chase-bug-summary-prose.md) - the draft template and the summary template ("same four fields") clauses only` above `## Context`. Nothing else in the older specs changes.

### Remove

- The fenced `Fault story:` / `Proof:` template in step 4 (the fence and its two lines, between "Present the verdict as a **plain-language fault story**, not a wall of evidence:" and "Deep evidence ...").
- In the negative-verdict menu fence in step 4: the `Verdict: <verdict name> - <citation>` line and the blank line under it. The two menu rows and their fence stay as today.
- The `**Draft template:**` label and its fenced four-line block in step 5.
- The `**Summary template** (same four fields as the draft - the difference is framing and delivery, not headings):` lead and its fenced four-line block in step 5.
- In the real-bug golden example: the fence around the whole example and the `Fault story:` / `Proof:` lines inside it.
- In the negative-verdict golden example: the fence, the `not-a-bug:` / `intended-behavior:` openers, and the `Citation:` label lines.
- Red flag: "Presenting the verdict as a wall of text instead of fault story + minimal proof".

### Add

Step 4, directly after the sentence "Present the verdict as a **plain-language fault story**, not a wall of evidence." (the colon at its end becomes a period), this paragraph:

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

The example is 69 words. The sentence "Deep evidence (full repro transcript, hypothesis list, falsification results) goes **below** this, never above it." stays unchanged after it.

Step 4, hotfix handoff paragraph: `the evidence pack (fault story; trigger, ...` becomes `the evidence pack (fault story - sentences one and two of the Verdict shape, never the decision sentence; trigger, ...`. The field names stay; `hotfix.md` keeps writing `<fault story>` as the squash commit body unchanged.

Step 4, negative verdicts: the lead "For a negative verdict, render the verdict with its citation, then a short numbered menu:" becomes "For a negative verdict, render the Verdict shape - sentence two names the verdict in plain words with its citation trailing - then a short numbered menu:". The menu fence keeps only its two rows (see Remove).

Step 5, addressable branch: replace the removed `**Draft template:**` block with one sentence before "Match register to the channel": `Write the draft in the Verdict shape (step 4); its third sentence names the reporter's next step - the ticket link, the fix branch or SHA, the correct usage, or the input the reporter supplies.`

Step 5, unaddressable branch: replace the removed summary-template lead and block with: `Render the summary in the Verdict shape (step 4); its third sentence names what happens next - the ticket link, the fix branch or SHA, the correct usage, or what input is missing.` The following paragraph "What makes it a summary, not a draft: ..." stays unchanged.

Negative verdicts: the citation each verdict requires (contract, decision, commit/PR, search hit) is the provenance trailing sentence two; add no new rule, the existing "A verdict without its named citation is a red flag" sentence covers it.

Golden examples: the real-bug example becomes the three-sentence story from the Verdict shape example above, unfenced, then `Pick one:`, then the four menu rows and `eligible - all predicates pass` inside their own fence as today. The fence around the rows is a source illustration carried over unchanged; what keeps the menu-layout contract and the existing `menu-after-numbered-findings` sample matching is the `Pick one:` separator and the numeric-reply mapping, not the fence. The "Read and apply [menu-layout]" line stays. The negative-verdict contrast example becomes two unfenced three-sentence stories with no verdict-name opener: the first says in sentence two "this is the documented behavior, not a bug" with the API doc's routing section trailing it, the second says "normalization was removed on purpose" with commit `a1b2c3d` trailing it; each sentence three names the next step (explain the contract; point to the decision). The "(citation-source contrast)" lead stays.

Red flag: add "Rendering the story, draft, or summary inside a code fence or as `Label:` lines" in place of the removed one.

### Eval (`eval/chase-bug/`)

The label regex used below, `NO_LABELS`, is `/^(?:(?!(?:Fault story|Proof|Symptom|Verdict|Evidence|Next step):)[\s\S])*$/`: it matches only when none of the six prefixes appears anywhere in the output, plain or emphasized, so it runs as a whole-output mechanical check (`eval/lib/checks.mjs` `matches /<regex>/`). `Pick one:` and the eligibility line never match it.

- New sample `samples/prose-verdict-above-menu/`: `case.md` opens with `bundle+: skills/brainstorming/reference/menu-layout.md` and `bundle+: skills/chase-bug/SKILL.md`, then asks for one response with two independent checkpoints, all writes and handoffs simulated, no tools.
  - Checkpoint 1 - generate the gate: step 4, origin free text, response target none, baseline clean, prior-report search completed without a match, real bug confirmed by local repro and falsification (`/widgets/` returns 404 instead of 200; `src/router.ts:88` compares paths without normalization), all six hotfix predicates pass; generate the gate and stop for a pick.
  - Checkpoint 2 - addressable draft: independent of checkpoint 1. Origin a GitHub issue, response target set, `gh` available so the channel resolves to `gh issue comment`; verdict `cannot-replicate` after two Phase 1 repro attempts (Chrome and Firefox on a clean profile both render the page) and a report that names no browser or version; the human picked `Respond to reporter`. Draft the response and show it with the `send it` confirmation; do not push.
  - `expected.md` facts:
    - `no-fence: judged:` the checkpoint-1 story above `Pick one:` and the checkpoint-2 draft text are not inside a triple-backtick block; judge only those two spans, not the menu rows, deep evidence, or the confirmation line.
    - `no-labels: mechanical: matches NO_LABELS`.
    - `three-sentences: judged:` the checkpoint-1 story above `Pick one:` is exactly three sentences, and the checkpoint-2 draft text is exactly three sentences.
    - `under-80-words: judged:` each of those two spans is under 80 words, counting the story and the draft text only, not the menu, eligibility line, or confirmation line.
    - `plain-reader: judged:` in both spans the component is named by what it does, the proof is a value the reader can see, and every file path, line number, commit SHA, or link that supports a claim comes after that claim in the same sentence and never opens a sentence; a URL path quoted as the reported symptom (`/widgets/`) may open sentence one.
    - `menu-intact: judged:` checkpoint 1 renders four rows `1.`-`4.`, one `[recommended]`, an eligibility line, separated from the story by the `Pick one:` line.
    - `draft-asks-reporter: judged:` the checkpoint-2 draft's third sentence asks the reporter for the missing browser and version, the draft is shown with the `send it` confirmation, and the output does not claim a push happened.
- `samples/returned-ticket-link/case.md` gains `bundle+: skills/chase-bug/SKILL.md` as its first line so the replay sees the Verdict shape rule step 5 points at; `target.json`'s slice stays unchanged and `intent.md`'s bundle-free `for:` is unaffected by the bundle. Its `expected.md` gains `no-fence: mechanical: lacks "<three backticks>"` (the literal triple-backtick string), `no-labels: mechanical: matches NO_LABELS`, `three-sentences: judged:` (the summary is exactly three sentences), `under-80-words: judged:` (the summary is under 80 words), and `plain-reader: judged:` with the wording above applied to the summary.
- `samples/menu-after-numbered-findings/` stays as is; its checkpoint 1 wording "Present the fault story and proof" still produces the Verdict shape under the new skill and its `layout` and `mapped-pick` facts must keep holding.
- `intent.md`: rewrite `for:` to the new bundle-free `skillSha`; `## Change` describes the Verdict shape; `## Expected to move` lists `returned-ticket-link/no-labels: fails -> holds` (both saved outputs carry label lines) and records the reseeded `returned-ticket-link/no-fence` outcomes as mixed: one replay baseline fences the summary and moves `fails -> holds`; the other is already unfenced and stays held. The remaining new facts on both samples get their entries after the baseline-only run below, from the seeded baseline outputs: a fact the baseline fails is listed `fails -> holds`; a fact the baseline already holds is listed as staying held, never promised as a move in advance. `returned-ticket-link/returned-reference`, `returned-ticket-link/no-new-creation`, `menu-after-numbered-findings/layout`, `menu-after-numbered-findings/mapped-pick` stay held.
- Run order: add the sample and the `bundle+` line, run `node eval/run.mjs chase-bug --baseline-only` once (it bypasses intent parsing and reseeds both bundled samples), write the move list from the seeded baselines, then run the full target; commit the records and `report.md`.

## Errors and edge cases

- A negative verdict uses the same three sentences; the required citation trails sentence two, so an uncited verdict still trips the existing red flag.
- `cannot-replicate`: the summary's third sentence states the missing input as fact ("the report does not say which browser"); the draft's third sentence asks the reporter for it. This is the existing summary-versus-draft distinction, unchanged; the new sample's checkpoint 2 exercises the draft side.
- The hotfix evidence pack (`$TMPDIR/hotfix-<slug>.md`) keeps its structured fields and names; `hotfix.md` reads them by name and is unchanged. Its `fault story` field stores sentences one and two of the Verdict shape - the causal story - never sentence three, so the squash commit body `hotfix.md` writes from it carries no decision prompt.
- Register: the draft still matches the channel (terse tracker comment, conversational Slack); the Verdict shape fixes sentence count and reader, not tone.
- Fence leak: an agent that still fences fails the `no-fence` eval fact; no runtime guard exists beyond the red flag.
- A story with no visible proof in sentence two is the existing "no verdict without evidenced root cause" violation; nothing new.
- Size: `SKILL.md` is 455 lines / 22,778 bytes today and the edit nets within a few lines either way. The 500-line bound is this spec's local acceptance check, read with `wc -l` / `wc -c` in the implement step; the `scripts/ci.mjs` instruction-size lint (under 2,000 lines and 50,000 bytes, `scripts/skill-size-lint.mjs`) is only the backstop and does not enforce 500.

## Tests

- Three plain sentences above `Pick one:`, no fence, no label lines, under 80 words (AC 1) - `eval/chase-bug/samples/prose-verdict-above-menu` facts `no-fence`, `no-labels`, `three-sentences`, `under-80-words`
- Component by role, visible proof, identifiers trailing (AC 2) - `prose-verdict-above-menu` fact `plain-reader`
- Menu rows, `[recommended]`, eligibility line, separator unchanged (AC 4) - `prose-verdict-above-menu` fact `menu-intact`; `menu-after-numbered-findings` facts `layout`, `mapped-pick`
- Terminal summary in the shape with the returned ticket link (AC 3, summary half) - `returned-ticket-link` facts `no-fence`, `no-labels`, `three-sentences`, `under-80-words`, `plain-reader`, `returned-reference`, `no-new-creation`
- Reporter draft in the shape, channel register and `send it` gate intact, `cannot-replicate` asks the reporter (AC 3, draft half) - `prose-verdict-above-menu` checkpoint 2 facts `no-fence`, `no-labels`, `three-sentences`, `under-80-words`, `plain-reader`, `draft-asks-reporter`
- `SKILL.md` under 500 lines and 50,000 bytes (AC 5) - `wc -l` / `wc -c` in the implement step is the 500-line check; `scripts/ci.mjs` instruction-size lint via `npm test` backstops at 2,000 lines / 50,000 bytes
- `hotfix.md` untouched - none: no diff
- Negative-verdict citation trailing sentence two - none: no sample today; the golden example demonstrates it and the existing red flag enforces it

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: none
- Derived / memory docs invalidated: none; `CHANGELOG.md - deferred: release`

README's chase-bug sentences describe the menu and gates, not the briefing format, and stay correct. Skill bodies and eval files are implementation surface.

Stale outside the touched unit, flagged not fixed: `eval/chase-bug/README.md` says "The single synthetic `returned-ticket-link` sample" while two samples exist today and this spec adds a third. That inventory sentence is not part of the briefing-format change; it needs its own one-line doc fix.

## Out of scope

- Menu rows, checkboxes, `[recommended]`, eligibility line, numeric-reply mapping (`menu-layout.md`): unchanged.
- `hotfix.md` and the hotfix evidence pack format.
- Other skills' human-facing renders (brainstorming gate, finishing, gatekeep-pr, shape-ticket).
- Widening `eval/chase-bug/target.json`'s slice; the `bundle+` precedent gives both the new sample and `returned-ticket-link` the whole skill.

## Open questions

None.
