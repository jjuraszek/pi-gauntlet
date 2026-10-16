# Decision briefs for mid-flow gates

**Goal:** the carried-open conformance menu and the spec-amendment batch menu render as numbered decision briefs - each item leads with the problem in plain words, letters its options with one-line consequences, and carries `Recommended: <letter> - <reason>` or `No recommendation - pick one` - and accept one reply line per item (`1. B`), so a returning human can decide without knowing the session's handle grammar; gates, availability, execute order, and durable audit records do not change.

**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

Supersedes `doc/specs/2026-07-14-clear-conformance-gap-decisions.md`, its "User render" and "Response grammar" sections only (the human-facing reply layer; its durable card schema, freshness rule, and execute order stay live).
Supersedes `doc/specs/2026-09-19-readable-amendment-gates.md`, its "Human batch" reply grammar and item render only (the remainder left live by the 09-22 and 10-04 supersessions).

## Problem

Ticket #63 (jjuraszek/pi-gauntlet). Reporter's session data: 93 mid-flow decision menus across six repos in 45 days; 40 replies used the formal grammar, 31 were free text, 22 were ad-hoc tokens; 11 menus contained an item with no recommendation, and on 3 of those 11 the first reply was rejected (twice a bare `1`, once `apply recommended`). Counts are ticket-reported, not independently verified; the design does not depend on them.

The ticket's captured menu (one item, no executable recommendation):

> `1` is withheld here: `manifest` (sha256 table of the archive in the PR description) has no executable recommendation, so it needs an explicit choice. Available: `custom(append the 446-line manifest from /tmp/.../evidence.md as a "## Archive sha256" table in the PR body when the PR is created)`, `follow-up`, `accept`, `rescope`.
> Reply `2: manifest=custom(append the manifest to the PR body)` to take the proposed path.

Root causes in the current text:

1. `skills/finishing-a-development-branch/reference/disposition-protocol.md` renders a shared bare-token options line (`Other options per item: fix-now / accept / rescope / follow-up / custom`) with no per-option consequence, and its response grammar withholds option 1 until every open item has an executable recommendation; `skills/verification-before-completion/reference/conformance-check.md` backs that with a preflight demanding a targeted custom approval before the recommended set. The most natural reply bounces.
2. Both menus ask the human to type `<handle>=<choice>`, an internal encoding the returning human has never seen. No durable record uses that form today: finishing records `Gn/Cn - <title>: <disposition>`; amendment batches record pipe rows `<handle> | <title> | <what> | <kind> | ...` (`amendment-surface.md` section 5).
3. Deliberation leaks into the render - the ticket's quoted fragment: `recommended: custom? Hmm. Dispositions: fix-now ... Actually, the amended spec makes G2 ...` - because no rule requires the menu text to be written after the recommendation is decided.

`skills/subagent-driven-development/stop-note.md` already leads with the problem and lettered options (`Problem:` / `Fix options: a) b) c)` / `Pick one, or give another fix.`) and is the shape to mirror; it stays untouched.

Framing: kept - recon found no case that the ask is misdiagnosed or already solved; the one cut-across (a reply `2. B` sharing the digit namespace with the spec-gate bare `2` grant and the dying `2:` tier-2 form) is dissolved by the reply-format rule in Design (reply lines are `<n>.`-prefixed; bare digits other than `1` are invalid in these two menus; the spec-gate menu is a different render, unchanged).

## Human input

Original request, verbatim:

> #63

Questionary answers that fixed scope:

> A (a reply typed in the old `2: <handle>=<choice>` form after the new menu ships is accepted silently as the same picks and recorded normally; never advertised, never bounced)

> 1 (rewrite both menus in place; no shared reference extraction)

> approve (design round 1), with: follow `/skill:forge-skill` authoring rules for the skill edits; write the menu text in pi-condense register - terse, economy-first wording, short lines, no filler

> approve (design round 2)

## Acceptance criteria

Ticket #63, Acceptance Criteria heading, rows verbatim:

- [ ] The carried-open render in `skills/finishing-a-development-branch/reference/disposition-protocol.md` and the amendment menu render in `skills/brainstorming/reference/amendment-surface.md` each specify, per numbered decision item: a plain-words sentence of what is unresolved and what it costs; one sentence on why it is a human call; lettered options each with a one-line consequence; and either `Recommended: <letter> - <one-sentence reason tied to the end goal or a development practice>` or `No recommendation - pick one`. No option may appear as a bare token without consequence text.
  in-scope
- [ ] The response grammar in both files accepts one line per decision item of the form `<item number>. <option letter or free text>`; a bare `1` applies every item that has a recommendation and re-asks only the items without one, by number, never re-rendering the whole menu; the `<handle>=<choice>` form appears only in the recorded disposition line, not in the prompt to the human.
  in-scope
- [ ] The `recommended: none` preflight in `skills/verification-before-completion/reference/conformance-check.md` no longer withholds option 1; an item with no recommendation renders as `No recommendation - pick one` with its lettered options.
  in-scope
- [ ] `disposition-protocol.md` and `amendment-surface.md` each carry a rule that the menu text is written after the recommendation is decided, never while deciding it, with the leaked-deliberation line quoted in Problem as the negative example.
  in-scope
- [ ] `eval/conformance-check/` carries a sample reproducing the withheld-recommendation menu quoted in Problem (one item, no executable recommendation); must-hold facts: the rendered message opens with a plain-words problem sentence; the item lists lettered options each with a consequence; the line `No recommendation - pick one` is present; a reply of `1` yields a re-ask of that item by number, not a rejection. `node eval/run.mjs conformance-check` passes.
  in-scope
- [ ] `eval/brainstorming/target.json` includes `skills/brainstorming/reference/amendment-surface.md`, and the target carries a sample with a two-item amendment batch (`crosscut`: options A accept / B alt-1; `exit126`: options A accept) answered `1. B` / `2. keep 126 as failed, document it`; must-hold facts: the recorded dispositions are `crosscut=alt-1` and `exit126=custom(keep 126 as failed, document it)`, and the rendered menu satisfies the first criterion's per-item shape. `node eval/run.mjs brainstorming` passes.
  in-scope
- [ ] `npm test` passes; the CHANGELOG entry names both renders and the reply format.
  in-scope

## Design

### Per-item render (both menus)

Each owner file specifies the same item shape in its own vocabulary. One numbered item per decision unit:

```
<n>. <plain title> - <what is unresolved and what it costs, one plain-words sentence>.
   <why this is a human call, one sentence>.
   A) <option> - <one-line consequence>
   B) <option> - <one-line consequence>
   Recommended: A - <one-sentence reason tied to the end goal or a development practice>
   (or, when nothing is executable: No recommendation - pick one)
   Not available: <option> - <missing prerequisite>
```

Rules, stated once per owner file:

- Sentence sources, never invented at render time. Carried-open items: the opening sentence is built from the concern card's existing `unresolved` and `impact` fields (`conformance-check.md` "Closure / conformance" schema); the human-call sentence comes from the verdict - `UNAUTHORIZED` keeps its verbatim question (`Should this unrequested behavior become part of the current workflow?`); `MISSING`/`PARTIAL`: the spec requires it and the implementation is incomplete or blocked, with the missing prerequisite named; `DRIFTED`: spec and code disagree and only the human can say which is the contract; a fix gap carried open because the fix loop cannot run (`maxFixRounds: 0`, no named-branch worktree, unknown ownership) says so and names the prerequisite. Amendment items: the opening sentence is the prepared item's `<what>. <why>`; the human-call sentence is the prefilter rule or the reviewer's escalate reason in plain words; the `Reviewer:` line stays verbatim beneath it.
- Every lettered option carries a one-line consequence. Carried-open consequences come from the canonical availability table's effect text (`conformance-check.md`, unchanged); amendment consequences are the choice's effect (`accept` = the spec reads the new text, `alt-n` = the alternative's own line).
- Lettering order is fixed so a letter is a stable pick: carried-open letters follow the availability-table row order (`fix-now`, `accept`, `rescope`, `follow-up`), skipping unavailable ones; amendment letters are `A) accept`, then `B) alt-1`, `C) alt-2` in index order. A letter records the shown option's disposition token; the durable `Gn/Cn` record keeps the canonical tokens (`accept-into-spec`, `rescope-into-spec`) as today, while the human-facing `Recorded:` line uses the menu's short forms (`accept`, `rescope`).
- Free text is the custom path, always: any `<n>. <free text>` line is `custom(<text>)`, even when the text equals a shown option's name - letters pick options, text instructs. The custom path stays visible as one unlettered line per item, `Custom: <your own answer> - <the availability table's custom effect, one line>`, so it never appears as a bare token; the reply instruction owns the `<n>.` form, so the Custom line itself carries no number (a number inside the item reads as a nested item).
- An unavailable option stays visible but unlettered, as `Not available: <option> - <missing prerequisite>` (mirrors the gatekeep menu's `Not offered:` convention); no bare tokens anywhere.
- The recommendation line is exactly `Recommended: <letter> - <reason>` or `No recommendation - pick one`; both owner files carry both forms verbatim (the amendment schema keeps requiring a recommendation, so the second form is conformance-only in practice).
- Write-after-deciding (AC4), verbatim rule in both files: the menu text is written after the recommendation is decided, never while deciding it; the negative example is the leaked-deliberation line quoted in this spec's Problem (`recommended: custom? Hmm. Dispositions: fix-now ... Actually, the amended spec makes G2 ...`).

### disposition-protocol.md (carried-open render and grammar)

- The handle-first bullet format and the shared `Other options per item` line are replaced by the numbered item render above. Handles leave the prompt entirely.
- The message opens with the numbered items, item 1's problem sentence first - never with metadata. The `Conformance: N decisions needed before shipping.` count header and the sentinel's informational lines (`happy-path:`, `Deferred/deviates per spec:`, `whole-diff minors:`) move below the item list, in their current relative order, above the reply instruction. (AC5: the rendered message opens with a plain-words problem sentence.)
- The readable card survives the bullet replacement: a spec-editing or escalated item keeps its `what`, `why`, `Example:`, `Reviewer:`, `Impact:` fields, indented under the item block between the problem sentence and the lettered options. The `Reviewer:` CI pin on this file (`scripts/ci.mjs`) stays satisfied.
- Response grammar, replacing the `1` / `2:` grammar: one reply line per item, `<n>. <letter or free text>`; bare `1` (or its existing alias `apply recommended`, still accepted, never advertised) applies every item that has a recommendation and re-asks only the items without one, by number, never re-rendering the whole menu; an omitted item keeps its recommendation (an omitted no-recommendation item is re-asked by number, same as after a bare `1`); a legacy `2: <handle>=<choice>` reply is accepted silently as the same picks (user decision, Q1-A); an invalid number or letter gets a focused reprompt naming only that item, retaining every valid pick, never reopening the gate; a bare digit other than `1` is an invalid reply and reprompts the same way. No other reply forms: no bare letters, no mixing bare `1` with item lines.
- The `recommended: none` withholding sentence is deleted; its replacement is the re-ask rule above.
- `revert conformance fix Gn` stays a standalone reply on its own line, outside the per-item options; it never takes a letter. The decide-everything-first barrier applies to disposition batches only: a standalone revert still runs its own revert/test/re-audit path (execute-order step 8) without waiting for other items' decisions and without applying any recommendation.
- After the reply, the skill prints one record line per decided item as `Recorded: <handle>=<choice>, ...` (e.g. `Recorded: cache=accept, e2e=rescope`). This is the ticket's recorded disposition line - the only place `<handle>=<choice>` appears. The handle-derivation rule (short unique word from the title, digit on collision, `Gn`/`Gn/Cn` fallback) stays as an internal rule, relocated into this record paragraph - the record line and silent legacy-reply acceptance still need it; the trailing sentence "the interactive render stays handle-based" is deleted. The durable `Gn/Cn - <title>: <disposition>` record and the 9-step execute order are unchanged.
- Nothing in a disposition batch executes until every item has a decision: bare `1` decides the recommended items, the re-ask collects the rest, and the execute order then runs once. Today's decide-then-execute ordering and the re-audit barriers (execute-order steps 3 and 5) are preserved; no re-audit can remap numbers the human has seen, because execution has not started.

### amendment-surface.md (spec-amendment batch menu)

- Section 4's template, reply paragraph, and the worked example are rewritten to the numbered item render, with the fixed lettering `A) accept`, then `alt-n` in index order. The batch fields stay: `Example:`, `Reviewer:`, `Impact:`, `Details`, the header sentence (keeping the CI-pinned phrase `applying as recommended`), and the `Standing grant:` footer, byte-identical (CI byte-counts it, 2x in this file, 1x in `spec-finalization.md`).
- The `Reply: 1 (apply all recommendations) | 2: <handle>=<accept|alt-n|custom(<effect>)>, ...` line is replaced by the numbered-reply instruction (`one line per item: <n>. <letter or free text>; bare "1" takes every recommendation`).
- The reply-grammar paragraph is rewritten to the disposition-protocol grammar above, in amendment vocabulary (`accept`, `alt-n`, free text = `custom(...)`). The tier-2 form dies; the sentence "a bare `2` without a colon is an invalid tier-2 reply" is replaced by a sentence containing the literal `is an invalid reply and never a grant`. Legacy `2:` replies are accepted silently (Q1-A).
- The reply grammar gains the `Recorded: <handle>=<choice>, ...` confirmation line (printed when the batch applies; e.g. `crosscut=alt-1`, `exit126=custom(keep 126 as failed, document it)`); the pipe-row `amend:` commit body is unchanged.
- The prepared-item schema keeps requiring a recommendation (`accept` or `alt-n`).
- Conformance entry (finishing's pre-menu funnel) keeps its funnel semantics; its step 4 clause "adapted to the disposition bullet grammar" is reworded to "adapted to the numbered item render" - the bullet grammar it names no longer exists.

### conformance-check.md (preflight rewrite)

The `recommended: none` preflight paragraph (targeted custom approval before any recommended set, pending-approved-custom tracking) is replaced by: a `recommended: none` concern is excluded from the recommended set, renders as `No recommendation - pick one` with its lettered options, and is re-asked by number after a bare `1` or when omitted from a numbered reply; finishing still owns the exact reply syntax. The durable serialization `recommended: none` stays; `custom` is never auto-recommended, so `none` never silently resolves to `custom`; the availability table, freshness rule, and closure block are untouched.

### finishing SKILL.md Step 3.5 (second carrier)

The embedded representative render (the `e2e`/`cache`/`auth` example) is re-rendered in the new shape, opening with item 1's problem sentence; the `Other options per item` line and the `1. Go with recommended / 2. Recommended except <handle>=<choice>` lines are replaced by the numbered-reply instruction. Two adjacent sentences ride in the same sync: the zero-gap path's "No approval prompt, no menu, no shared options line" loses its last clause, and "A single-concern render is identical minus the split: one bullet whose handle is the gap ID or word" is reworded to the numbered single-item render. The zero-gap path also states the fall-through render order - Step 4's menu renders in full, options included, never stopping at the question line (ratified at the finish gate; it fixes a replay-model truncation the eval suite pins). This slice sits inside the eval/conformance-check assembly (`target.json` slice `### Step 3.5`..`### Step 5`), so leaving it would teach the old grammar. Synchronization only; no structural change to Step 3.5.

### CI pins

`scripts/ci.mjs`: the present-token check `without a colon is an invalid` (pins the dying tier-2 sentence) moves to the literal `is an invalid reply and never a grant` in the same commit. The Standing-grant byte counts and the remaining tokens (`Mode: amendment-review`, `auto-apply`, `escalate`, `Reviewer:` on both menu files, `applying as recommended`, `` `2` at the spec gate ``) are untouched. `scripts/brainstorming-contract.test.mjs` markers (`recommended: accept`, grant sentences) are unaffected.

### Evals

Each new scenario is two samples, because the render and the post-reply behavior are different turns: a **render case** (the model produces the menu from supplied state; facts judge the per-item shape) and a **continuation case** (the case supplies the already-rendered menu plus the human's reply; facts judge only the next response). The continuation convention already exists as `replay: continuation` in `eval/brainstorming/replay.md`; `eval/conformance-check/replay.md` gains the same per-case marker (existing samples keep the default mode, and the default replay text - including its "through the first line of Step 4's options" boundary, which names Step 4's menu, not the disposition grammar - is unchanged). A conformance continuation case stops at the re-ask; it never renders into Step 4.

- `eval/conformance-check/`: four samples cover the grammar. `no-recommendation-render` reproduces the ticket's withheld-recommendation menu (one item, no executable recommendation) with AC5's render facts (opens with a plain-words problem sentence; lettered options each with a consequence; `No recommendation - pick one` present). `no-recommendation-reask` supplies that menu plus the reply `1`, expecting the focused re-ask naming the item's number, not a rejection. `no-recommendation-execute` continues through a free-text custom answer, pinning the verbatim `custom(<text>)` record and the execute-order re-audit barrier before any conformance claim. `no-recommendation-letter` answers the re-ask with `1. B`, pinning that a lettered pick records the named disposition (`rescope`), never `custom(...)`. The pre-existing `in-scope-gap` sample modernizes its f4 fact to the clarify-before-execute property - the old fact pinned the re-audit mention in the menu render, which the one-line Custom consequence retires (ratified at the finish gate; the re-audit barrier itself is unchanged and pinned by no-recommendation-execute/f3). `intent.md` is rewritten for the new assembly.
- `eval/brainstorming/`: `target.json` gains `skills/brainstorming/reference/amendment-surface.md` as a `slice` of the human-batch section (`slice` `## 4. Human batch`, `sliceTo` `## 5. Apply`; the `Recorded:` rule sits in section 4's reply grammar, so the section-4 slice keeps every AC6 fact's contract in the assembly while the apply/aftermath machinery stays out of the prompt). A render sample carries the two-item batch from AC6 (`crosscut`: A accept / B alt-1; `exit126`: A accept) with the AC1 per-item shape facts; a continuation sample supplies that menu plus the reply lines `1. B` / `2. keep 126 as failed, document it` and expects the recorded dispositions `crosscut=alt-1` and `exit126=custom(keep 126 as failed, document it)`. Sample items are synthetic (eval hygiene rules). `intent.md` is rewritten. `wordCap` caps the replay's generated output words (`eval/run.mjs`), not the assembled skill text: the slice bounds the system prompt, and the cap is raised only to fit the longer menu-plus-record output of the new samples.
- Iteration per `eval/README.md`: per-sample partial runs while iterating, full `node eval/run.mjs conformance-check` and `node eval/run.mjs brainstorming` once at the end; `report.md` and `results/` committed. The commit body states the edit is a behavior change.

### Unchanged

Gate inventory and approval semantics; the execute order and its re-audit barriers; the availability table; the `UNAUTHORIZED` question and removal semantics; stable `Gn/Cn` IDs and both durable record formats; `stop-note.md`; the spec-gate approval menu in `spec-finalization.md` (its bare `2` grant included); reviewer personas and the `spec-council-member` reply grammar; gauntlet-resume's grant read; historical specs quoting the old grammar (frozen deliverables).

## Errors and edge cases

- Invalid reply line (unknown number, unknown letter): focused reprompt naming only that item; valid picks retained; the gate never reopens. A bare digit other than `1` reprompts the same way and is never a grant.
- Legacy `2: <handle>=<choice>` reply: accepted silently as the same picks and recorded normally (Q1-A); the form is never rendered in a prompt.
- Bare `1` with a no-recommendation item present: recommended items are decided, the no-recommendation items are re-asked by their original numbers, and only then does the execute order run - no mid-flight re-audit can remap shown numbers.
- Free-text line: normalized per execute-order step 1 (`custom(...)` semantics); clarified only when ambiguous or unexecutable; an amendment-side custom may still redirect away from the spec and drop the item, recorded as today.
- `UNAUTHORIZED` item: `rescope` renders as `Not available: rescope - scope creep`; the verbatim question is the item's human-call sentence.
- `revert conformance fix Gn` remains a standalone reply on its own line; never lettered, never inside an item, and never blocked by undecided items - the all-decisions barrier binds disposition batches only.
- A `1`-line reply mixing with numbered item lines, a bare letter, or free text matching a shown option's name: not special-cased - the first two are invalid (focused reprompt), the last is `custom(<text>)` by the free-text rule.
- The eval word cap is on generated output, so it rises only for the new samples' longer renders; the amendment slice bounds the system prompt, not the cap.

## Tests

- `node eval/run.mjs conformance-check` and `node eval/run.mjs brainstorming` pass (AC5, AC6), with the two new samples and rewritten `intent.md` files; per-sample runs while iterating per `eval/README.md`.
- `npm test` passes (AC7): lint, the moved ci.mjs token, contract tests, eval structural lint and hygiene, packed-install smoke.
- CHANGELOG `## Unreleased` entry names both renders and the reply format (AC7).
- Ordering per `eval/README.md`: the skill edits and their eval samples ride together; the ci.mjs token moves in the same commit as the text it pins.

## Documentation impact

Per `reference/documentation-impact.md`:

- Feature / user-facing docs introduced: none
- Materially amended existing docs: CHANGELOG.md - ## Unreleased entry naming both renders and the reply format (AC7); README.md - the two descriptions of the carried-open menu (the step-4 workflow bullet and the "Conformance gate" glossary row, which today show the dense list and the `2:` override form) updated to the numbered-brief render and reply grammar - a current-contract correction; leaving them would advertise the retired form
- Derived / memory docs invalidated: none

The four menu files are skill/reference bodies - implementation surface, not doc-impact entries. The gather draft's docs check returned `Docs touched: none`; the council's README finding was verified against README.md directly and admitted under the materiality bar (the workflow's human-facing reply contract lives nowhere else in prose).

## Out of scope

- `skills/subagent-driven-development/stop-note.md` - already the target shape; read-only precedent (ticket).
- Which stops exist: no gate added, removed, reordered, or relaxed (ticket).
- The spec-gate approval menu (`spec-finalization.md`), including the bare `2` grant.
- Reviewer contracts (`agents/spec-council-member.md` reply grammar) and the amendment prepared-item schema's mandatory recommendation.
- Historical specs quoting the old grammar - frozen deliverables, edited only if a future spec supersedes them for this scope.

## Open questions

None blocking. Implementation-detail calls deferred to the plan: the exact `slice`/`sliceTo` markers for the amendment-surface eval assembly and the raised `wordCap` value.
