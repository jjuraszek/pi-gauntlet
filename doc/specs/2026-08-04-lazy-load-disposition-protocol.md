# Lazy-load the conformance disposition protocol off finishing's CONFORMS fast path

Source ticket: [jjuraszek/pi-gauntlet#5](https://github.com/jjuraszek/pi-gauntlet/issues/5).

## Context

`finishing-a-development-branch/SKILL.md` Step 3.5 ("Closure / Conformance
Disposition Gate") carries the full carried-open disposition protocol inline:
the dense-render grammar, the response grammar, and the 9-step execute order
(current `SKILL.md:91-151`; exact per-chunk ranges in the Primary workstream).
Every finish loads all of it, but the common
outcome is `CONFORMS` (zero gaps): the run prints one line and continues to
Step 4. On that path the ~45 lines of carried-open grammar are dead weight the
reader (LLM) pays for on every ship.

The disposition protocol is stable, self-contained, and only ever consumed on
the GAPS branch. It is a textbook progressive-disclosure candidate: keep the
common path lean, load the heavy grammar only when a gap actually forces a
disposition decision.

## Problem

1. **Primary.** Step 3.5's carried-open grammar is inline and unconditional, so
   the CONFORMS fast path (the common case) pays its full token cost for content
   it never uses.
2. **Secondary.** In `verification-before-completion/reference/conformance-check.md`
   the "precondition-unavailable -> carry the `fix` gap OPEN" rule
   (`maxFixRounds: 0`, or no eligible named-branch worktree) is stated at five
   sites. That is a genuine intra-file restatement: one authoritative statement
   plus back-references would remove the drift risk without losing any contract.

## Approach (decided)

**Design B** (chosen at the brainstorming gate over Design A, the fully
contiguous move): keep the human-facing decision surface inline; relocate only
the mechanical grammar. The GAPS branch stays legible in the SKILL body (the
reader still sees the menu the human picks from), while the bullet-construction
rules, response parsing, and execute-order move to a reference read only when a
gap forces a decision. This is a **relocation, not a rewrite** — the moved prose
is byte-identical; behavior is unchanged.

Non-goals: no gate is added, removed, reworded, or reordered; no disposition
semantics change; the freshness rule, availability table, closure schema, and
Step 4 menus are untouched except for the mechanical relocation described below.

## Acceptance criteria (ticket #5, verbatim)

Inlined so this spec is self-contained against the source (the reviewer diffs
against these, not a live ticket):

- The disposition render/response/execute-order block is removed from
  `finishing/SKILL.md` and present **byte-for-byte** in the new reference file
  (verifiable: the relocated block greps identical to the removed block — this is
  a move, so behavior cannot change).
- `finishing` Step 3.5 retains the freshness gate, the zero-gap
  `Closure / conformance: CONFORMS` render, and the 4-option (and 3-option
  detached-HEAD) menu, all behaviorally unchanged.
- Step 3.5 reads the reference **only on the GAPS branch**; the CONFORMS fast path
  issues no read of it.
- `conformance-check.md`: the `maxFixRounds: 0` rule stated once + 4
  back-references; every other contract (dispatch shape, partition rule,
  disposition catalog, availability table, closure schema, fix projection,
  sentinel/freshness) present and grep-verifiable.
- `scripts/ci.mjs` passes; generic-skill grep guard (no project-specific paths)
  passes.
- No gate added, removed, or reworded. Reviewer diffs the *relocated bytes*, not
  paraphrase.

Note on carve-out: the AC's "render/response/execute-order block" is the dense
grammar + response + execute chunks; the ticket Idea explicitly carves the
**human menu** (representative render) and the CONFORMS/summary render out of the
move, so Design B keeping those inline satisfies the AC rather than contradicting
it.

## Primary workstream — relocate the disposition grammar

### New file

`skills/finishing-a-development-branch/reference/disposition-protocol.md`
(finishing has no `reference/` dir today; five other skills already ship one, so
the pattern is established). Reference files carry no YAML frontmatter (CI checks
frontmatter on `SKILL.md`/`agents/*.md` only). The file is a leading `#` title, a
short antecedent-map preamble, then the moved chunks with their **original heading
markers preserved verbatim** (`#### Response grammar` / `#### Execute order` move
unchanged, nested under the `#` title). No heading is invented over moved prose.

### Moved into the reference, verbatim (original order)

Cut from Step 3.5 and pasted into the reference, prose byte-identical:

1. **Carried-open render (dense) grammar** — `SKILL.md:91-101`: the
   `**Carried-open render (dense).**` paragraph, the `Each bullet:` line, the
   bullet-format template line, and the five rule bullets (`<handle>` derivation;
   shared-options-line rules; grouping; per-concern availability; the
   `revert conformance fix Gn` render note).
2. **Response grammar** — `SKILL.md:122-135` (the entire `#### Response grammar`
   section body).
3. **Execute order** — `SKILL.md:137-151` (steps 1-9 plus the trailing
   "Record every final disposition ..." durable-record paragraph, which ends at
   line 151, *before* the summary-render fence at line 153).

Extraction follows these prose-described chunk boundaries, **not** raw line
ranges: line 152 is blank and 153-157 is the kept-inline summary-render fenced
block, so a naive `sed -n 137,155p` would split that ``` fence across both
destinations. Cut the execute-order chunk at the durable-record paragraph's end
(line 151); leave 153-159 inline.

**No mechanical adjustment to the moved bytes.** Heading markers move verbatim
(`#### Response grammar`, `#### Execute order`), the bold-lead
`**Carried-open render (dense).**` paragraph moves as-is with no heading invented
over it, and all body prose is byte-identical. The only new bytes in the reference
are the additive `#` title and the antecedent-map preamble below — insertions
around the moved block, never edits to it. This satisfies ticket #5's "greps
identical to the removed block" criterion literally: every moved line, headings
included, matches the pre-change source.

### Antecedent map (new preamble, not part of the moved bytes)

The moved grammar contains references whose antecedents lived in the surrounding
SKILL body ("the reference" = `conformance-check.md`; `"Revert semantics"`,
`"the zero-gap path"`, `Step 1`/`Step 4`/`Step 3.5` = the SKILL). Moving the
prose verbatim would orphan those antecedents. The reference file therefore opens
with a short preamble (new prose, outside the byte-for-byte move) that:

- states it is consumed by `finishing-a-development-branch` Step 3.5 on the
  **GAPS branch only** (the CONFORMS fast path never reads it), and
- maps the antecedents: in this file, "the reference" =
  `../../verification-before-completion/reference/conformance-check.md` (canonical
  for the availability table, `UNAUTHORIZED` question, `recommended: none`
  preflight, freshness rule, concern-scoped fix projection); `"Revert semantics"`,
  `"the zero-gap path"`, and the numbered `Step N` references =
  `../SKILL.md`.

This preserves every cross-reference the moved grammar depends on without editing
the moved bytes. Draft preamble text (literal, to remove wording drift):

> # Carried-open disposition protocol
>
> Consumed by `finishing-a-development-branch` Step 3.5 on the **GAPS branch
> only** — the CONFORMS fast path never reads this file. Antecedent map for the
> relocated grammar below: "the reference" =
> `../../verification-before-completion/reference/conformance-check.md` (canonical
> for the availability table, the `UNAUTHORIZED` question, the `recommended: none`
> preflight, the freshness rule, and the concern-scoped fix projection);
> "Revert semantics", "the zero-gap path", and every `Step N` (`Step 1`, `Step
> 3.5`, `Step 4`) reference = `../SKILL.md`.

Exact relative link depth is confirmed at implementation time against the
reference file's actual location.

### Kept inline in Step 3.5 (verbatim, unchanged behavior)

- **Freshness precondition** (`SKILL.md:81`) — stays in place, untouched.
- **Zero-gap fast path / `CONFORMS` render** (`SKILL.md:83-89`) — stays in place,
  untouched. This path issues **no** read of the reference.
- **The carried-open human menu** — the representative carried-open render fenced
  block and its intro line (`SKILL.md:103-118`) plus the "A single-concern render
  is identical ..." line (`SKILL.md:120`). This is the decision surface the human
  picks from (`1. Go with recommended` / `2. Recommended except <handle>=<choice>`)
  and stays visible in the SKILL body.
- **The summary render** — the post-disposition `Closure / conformance: CONFORMS
  (or: GAPS resolved ...)` fenced block and the "No auto-proceed ..." line
  (`SKILL.md:153-159`) — stays inline as the closure summary.

### New inline connective (the only new SKILL prose)

The GAPS branch gains a short lead-in that fires **only** when the freshness-
validated sentinel is `status: GAPS (N open)`: it instructs the reader to read
`reference/disposition-protocol.md` for the bullet-construction grammar, response
grammar, and execute-order, and frames the inline representative render as the
shape to produce. A one-line bridge before the summary render preserves the
"after dispositions execute, print the summary and continue to Step 4" flow. The
CONFORMS fast path is untouched and does not read
`reference/disposition-protocol.md`.

Draft lead-in text (literal, to remove wording drift):

> **Carried-open (`status: GAPS (N open)`).** Read
> `reference/disposition-protocol.md` and follow it for the carried-open render
> (dense) grammar, the response grammar, and the 9-step execute order. Render the
> human decision menu in the shape below, drive the dispositions per that
> reference, then print the summary render and continue to Step 4. If that
> reference file cannot be read, stop and surface a blocking error — do **not**
> improvise the grammar from memory.

Resulting inline Step 3.5 flow: intro paragraphs (unchanged) -> freshness
precondition (unchanged) -> zero-gap `CONFORMS` fast path (unchanged) -> GAPS
lead-in + "read the reference" pointer -> human menu (representative render) ->
[dispositions execute per the reference] -> summary render -> Step 4.

## Secondary workstream — single-source `maxFixRounds: 0` in conformance-check.md

State the "precondition-unavailable -> carry the `fix` gap OPEN" rule once,
authoritatively, in the **partition step**, and replace the restatement at the
four other sites with a one-line back-reference — **without** removing any
distinct contract those sites also own.

- **Authoritative site — partition step** (`conformance-check.md:104-107`, the
  `recommended: fix` bullet). State the rule fully and self-containedly:
  `recommended: fix` auto-runs the fix loop **unless** a declared fix-loop
  precondition is unavailable (`maxFixRounds: 0`, or no eligible named-branch
  worktree — normal checkout / detached HEAD), in which case carry the gap OPEN
  to the finish gate. Drop its current *downward* pointer ("see the fix loop's
  precondition and `maxFixRounds: 0` notes") — this bullet is now the source, and
  the four sites below sit after it, so they reference *up* to it.
- **Back-reference sites** (keep the distinct contract, replace only the carry-OPEN
  restatement with a pointer to the partition rule):
  1. **Fix-loop worktree precondition** (`:134`) — keeps the "loop needs a
     worktree HEAD to branch from; normal checkout / detached HEAD has none"
     mechanics; the carry-OPEN clause becomes "carry every `fix` gap OPEN per the
     partition rule above."
  2. **Dedicated `maxFixRounds: 0` paragraph** (`:187-190`) — keeps the
     load-bearing **opted-out vs. exhausted** contrast (`maxFixRounds: 0` carries
     OPEN because the user opted out, distinct from a positive cap that *tried and
     could not converge*, which escalates mid-verify); the carry-OPEN clause
     becomes a back-reference.
  3. **Availability table** (`:276` row + `:287-288` prose) — the table **row**
     stays verbatim (the `fix-now` availability contract:
     `maxFixRounds > 0` + named-branch worktree + known ownership + accessible
     resources). The prose keeps its distinct statements (`fix-now` stays
     *visible but unavailable*; finish-time selection never bypasses or resets the
     cap; a concrete `custom`/manual-fix disposition remains possible) and
     back-references the partition rule for the carry-OPEN consequence.
  4. **Closure section** (`:342-347`) — keeps the distinct
     **closure-inventory-vs-escalation** contract (a precondition-unavailable
     carried-open `fix` gap is *valid closure inventory*, **not** escalation;
     escalation is the one non-completing terminal state); the "carried open
     because a precondition was unavailable (`maxFixRounds: 0` / no eligible
     worktree)" restatement becomes a back-reference.

Canonical back-reference wording, reused at all four sites (adapt only the leading
clause that names each site's distinct contract): `... per the
precondition-unavailable carry-OPEN rule in the partition step above.` The
implementer confirms each rewritten sentence still reads naturally in place and
that all four references resolve to the single partition-step statement.

## Error handling and edge cases

- **Orphaned antecedents.** Verbatim relocation would break "the reference" /
  "Revert semantics" / "Step N" references. Mitigated by the reference preamble's
  antecedent map (above); no moved byte is edited to fix a reference.
- **No heading normalization.** Moved heading markers (`####`) and the bold-lead
  render paragraph move verbatim; nothing in the moved block is re-levelled or
  re-titled, so the byte-for-byte grep holds on every moved line.
- **Missing/unreadable reference.** The GAPS lead-in treats a failed read of
  `reference/disposition-protocol.md` as a blocking error — stop and surface it,
  never improvise the grammar from memory.
- **CONFORMS path must not read `reference/disposition-protocol.md`.** The "read
  the reference" instruction lives strictly under the GAPS lead-in, after the
  zero-gap fast path's "continue to Step 4". Verified by grep: the reference
  filename must not appear above or within the fast-path block. (The CONFORMS path
  still applies the existing freshness rule, which reads `conformance-check.md` —
  "reads nothing" is scoped to the new file only.)
- **Secondary over-cut risk.** The single-source edit must not delete the
  availability-table row, the opted-out-vs-exhausted contrast, or the
  closure-inventory-vs-escalation distinction. Each is called out above as
  must-retain; the conformance gate diffs against this spec, and the tests below
  grep for each surviving contract.
- **Generic-skill guard.** The new reference file must contain no project-specific
  paths/company names (the moved grammar is already generic; the preamble's
  relative links stay generic).

## Testing approach

No runtime code changes; verification is structural.

1. **Byte-for-byte move check (positive + negative).** Name an immutable
   pre-relocation baseline — the branch-point SHA (`git merge-base HEAD main`),
   not bare `HEAD` (which becomes the edited tree once the relocation commit
   lands). *Positive:* extract the three moved chunks from
   `git show <branch-point>:skills/finishing-a-development-branch/SKILL.md` and
   confirm each appears byte-identical (headings included) in the new reference
   file, ignoring only the additive title + preamble. *Negative (guards
   copy-not-move):* grep each moved chunk's distinguishing text against the
   **post-change** `SKILL.md` and require **zero** matches — a copy that leaves the
   grammar inline would pass the positive check while leaving the CONFORMS fast
   path's token cost unchanged, defeating the ticket. The reviewer diffs relocated
   bytes, not paraphrase.
2. **Inline retention check.** Grep the post-change `SKILL.md` for the freshness
   precondition, the `Closure / conformance: CONFORMS` fast-path render, the
   representative carried-open render + `1.`/`2.` menu, the summary render, and the
   4-option (and 3-option detached-HEAD) Step 4 menus — all present, behaviorally
   unchanged.
3. **Lazy-load check.** Confirm `disposition-protocol.md` is referenced **only**
   under the GAPS branch and never in or above the CONFORMS fast path.
4. **Secondary single-source check.** Grep `conformance-check.md`: the carry-OPEN
   rule appears authoritatively once (partition step) + four back-references; the
   availability-table row, the opted-out-vs-exhausted contrast, and the
   closure-inventory-vs-escalation distinction each still grep-present.
5. `npm test` (`scripts/ci.mjs`) passes.
6. Generic-skill grep guard passes over `skills/` (including the new reference
   file): the `AGENTS.md` guard (`rg -ni` over the fork's company/username/
   internal-service patterns) returns 0 matches.
7. Conformance gate (verify phase) confronts the full diff against this spec.

## Documentation impact
- Feature / user-facing docs introduced: none (the new
  `reference/disposition-protocol.md` and the edited skill bodies are
  implementation surface, not doc-impact entries per
  `brainstorming/reference/documentation-impact.md`).
- Materially amended existing docs: none (CHANGELOG.md - deferred: release).
- Derived / memory docs invalidated: none.

## Out of scope

- Design A (fully contiguous move: the entire render + response + execute block,
  human menu included, relocated as one span, GAPS branch shrinking to a bare
  "read the reference" pointer) — rejected at the gate because it removes the human
  decision surface from the SKILL body; B keeps the menu inline so the GAPS
  decision stays legible without a reference read.
- Any change to disposition semantics, the fix loop, the availability contract,
  the freshness rule, or the closure schema beyond the mechanical relocation and
  single-sourcing above.
- A shared/multi-consumer home for the disposition protocol — it is finishing-only
  today; relocating to a shared location is deferred until a second consumer exists.
