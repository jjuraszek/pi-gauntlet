# chase-bug: verdict report as a sectioned briefing in elevator register

**Goal:** Replace chase-bug's three-sentence "Verdict shape" with one skill-local report contract, owned by a new `skills/chase-bug/reference/verdict-report.md`, that renders the step-4 gate, the step-5 reporter draft, and the terminal summary as four short sections a PM reads in the TUI - optional Context, What is broken, Why it is broken, then How to fix it (real bug) or What happens next (negative verdict) - each written under the elevator register rules ported from pi-quiver, with the existing numbered menu and `[recommended]` row unchanged below the gate's report.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop

## Problem

Framing: pivoted to a visible four-section template with elevator register - the ask ("WHAT / WHY / HOW plus a menu, like `/elevator`") was checked against `skills/chase-bug/SKILL.md:151-175`, which already mandates three plain sentences under 80 words with a `[recommended]` menu, and against `pi-quiver/prompts/elevator.md:7-21`, which asks for one paragraph within 180 words and no sections; the user rejected a prose-only tightening and chose labeled sections, each written under the elevator rules, reversing the no-labels decision in `doc/specs/2026-10-28-chase-bug-summary-prose.md` on purpose.

The rule the skill carries today does not hold in live use. Four chase-bug sessions from 2026-11-03 show step-4 stories of 80-240 words whose sentences stack identifiers (`intro.css:255`, a 9-character SHA, a CLI invocation) a PM will not open, and terminal `done summary` messages of 180-320 words that open with branch, tip, and worktree housekeeping, carry CI pass counts and revert lines, and reach what broke only in the second paragraph. The reader cannot find the three things that matter - what is broken, why, and what to do - because nothing in the rendered text separates them from evidence and status, and the pi TUI shows the tail of a message, so the decision sentence competes with whatever came last.

Premises. Supported: the live outputs fail readability (session transcripts, dated 2026-11-03; machine-local, anonymized before any lands in `eval/`). Corrected: the skill already has a three-beat contract and a label ban (`SKILL.md:151-175`, introduced by the Oct 28 predecessor); the elevator prompt is one paragraph, not a sectioned template (`elevator.md:7-21`; its Nov 3 successor spec deleted the earlier numbered-question body because it produced form-like answers). Unverified until approval: whether a fresh model run reproduces the live failures and whether the new contract holds under the eval - that is the implementation-phase verification below, not an assumption. Implicit dependencies checked: the gate id `chase-bug/verdict-menu` is inventoried in `doc/gate-contract.md:47`; the numeric reply mapping is owned by `skills/brainstorming/reference/menu-layout.md`; the hotfix handoff copies the fault story into the squash commit body (`hotfix.md:326`); `eval/run.mjs` and `pi` are on PATH; `eval/chase-bug/target.json` slices only step 5 of `SKILL.md`, so samples that render a report bundle the whole skill.

Decisions recorded in the questionary: the third heading varies by verdict (`How to fix it` for a real bug, `What happens next` for a negative verdict) so the heading never promises a fix that does not exist; Context comes first and the decision last because the TUI favors the tail; deep evidence folds into Context under a hard cap, in the same register; lists appear only where they aid readability; the contract is extracted to a reference file so `SKILL.md` stays under forge-skill's 500-line extraction trigger; the before/after against the Nov 3 material is implementation evidence recorded in `eval/chase-bug/report.md`, with model runs authorized for it, and not a gate item.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] On a real-bug verdict the step-4 gate message renders, after the `gauntlet: gate=chase-bug/verdict-menu recommended=<n>` line, the headings `### What is broken`, `### Why it is broken`, `### How to fix it` in that order (an optional `### Context` before them), followed by `Pick one:` and the unchanged menu with exactly one `[recommended]` row and the eligibility line, which ends the message.
  in-scope
- [ ] On a negative verdict (`not-a-bug`, `intended-behavior`, `cannot-replicate`, `already-addressed`, `already-reported`) the third heading reads `### What happens next`, its body names the verdict's citation or the missing input as fact, and the negative-verdict menu follows unchanged.
  in-scope
- [ ] The step-5 reporter draft and the terminal summary render the same sections with no menu; the draft's third section names the reporter's next step and, where gate 2 fires (a write path resolved), is followed by the `send it` confirmation outside the draft - the ungated copy-paste draft and the push-failure fallback end with the last section, no confirmation; the summary states what happens next without reporter-facing framing and ends with its last section.
  in-scope
- [ ] Every section reads in everyday words: a component is named by what it does, a code term is explained on first use, and a path, line, SHA, or link appears only trailing the claim it supports and only when the reader has to open it; in the report bodies no code fence, no `->` chain, and none of the prefixes `Fault story:`, `Proof:`, `Symptom:`, `Verdict:`, `Evidence:`, `Next step:` plain or emphasized (`**Symptom:**`) - the four `###` headings are allowed, and the marker line, `Pick one:`, the menu, the eligibility line, and the confirmation token are outside this check.
  in-scope
- [ ] Context, when present, is at most 5 source lines (a list item is one line; TUI wrapping does not count) and holds the repro in one line, the explanation that survived testing, and what could not be checked; the whole report from the first heading to `Pick one:` (or to the confirmation or end of message), headings included, is under 180 words.
  in-scope
- [ ] A bulleted list appears only where three or more parallel facts read better as a list, and a numbered list only where steps happen in order; otherwise sections are one short paragraph, and a section body is one paragraph or one list, never both.
  in-scope
- [ ] The hotfix handoff record's fault story is a two-sentence prose rendering of the What-is-broken and Why sections - one sentence per section, no heading, no list marker, one paragraph - so the squash commit body written by `hotfix.md` carries two plain sentences and no section heading.
  in-scope
- [ ] Replaying two anonymized cases derived from the 2026-11-03 sessions (a slow CI job that rescans a tree twice; a slide deck whose font lacks a glyph) through `node eval/run.mjs chase-bug nov3-replay` records the baseline cell's actual outcome on the section-order and plain-reader facts and a candidate cell that passes them, in `eval/chase-bug/report.md`.
  in-scope
- [ ] `skills/chase-bug/SKILL.md` stays under 500 lines and both `skills/chase-bug/SKILL.md` and `skills/chase-bug/reference/verdict-report.md` stay under 50,000 bytes and 2,000 lines, so `npm test`'s instruction-size lint passes.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: chase-bug-elevator-report
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (runs scripts/ci.mjs) against the worktree; node eval/run.mjs chase-bug <sample> for the selected samples named in Tests
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet-overrides.md
Rules: doc/gate-contract.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: doc/implement-engines.md
Rules: doc/install-internals.md
Rules: eval/README.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9
design: owns `skills/chase-bug/SKILL.md`, `skills/chase-bug/reference/verdict-report.md`, `skills/chase-bug/hotfix.md` (step-10 presentation sentence only), `eval/chase-bug/**`, `doc/specs/2026-10-28-chase-bug-summary-prose.md` (banner), `CHANGELOG.md`; observable outcomes are the rendered gate, draft, and summary shapes above and the committed eval report.

## Design

### The report contract: `skills/chase-bug/reference/verdict-report.md` (new)

One file, loaded with `read` (path resolved against this skill's directory) at every render entry - the step-4 gate including its re-fire after a hotfix abort, the negative-verdict gate, the step-5 draft, the terminal summary, and the draft or summary rendered after a hotfix return (unreadable -> stop with a blocking error naming the path, never reconstruct the shape from memory). A reference file is not injected with the skill, so each of those sites carries its own read instruction in `SKILL.md`. It holds, in this order:

1. **Shape.** Four `###` headings with a blank line between sections, each body one short paragraph or one list, never both: `### Context` (optional), `### What is broken`, `### Why it is broken`, then `### How to fix it` on a real bug or `### What happens next` on a negative verdict - the heading follows the verdict on every surface. The gate's `Pick one:` and menu come after the last section; the gated draft's `send it` confirmation sits outside the report; the summary and the ungated terminal draft end with the last section. **The message ends with the eligibility line (real-bug gate), the negative-verdict menu (negative gate, which has no eligibility line), the confirmation token (gated draft), or the last section (summary, ungated draft); no evidence, transcript, status, or housekeeping renders after it - what does not fit the cap is dropped, not appended.** Heading words are fixed so a reader learns them once.
2. **Per-section content.** Context: the repro in one line, the explanation that survived testing, and what could not be checked - the evidence the human asks about later, never a transcript. What is broken: on a real bug, the failure as the reporter sees it, in the reporter's terms; on a negative verdict, the reported behavior against what the chase observed. Why it is broken: on a real bug, the root cause in everyday words with one concrete proof the reader can see (a before/after value or the one repro line); on a negative verdict, the evidence that settles the verdict - the contract, the decision commit, the fixing commit, the existing ticket, or the repro attempts that failed - naming the kind of source so the reader knows what decides it, and stating an unknown cause as unknown, never inventing one. **Third section, body by surface:** the gate gives the concrete change and its size (real bug) or the cited fact or missing input (negative verdict), ending with the recommended pick and one because-clause; the reporter draft gives the reporter's next step - the ticket link, the fix SHA or PR, the correct usage, or the input to supply - with no pick; the summary states what happens next as fact, with no pick and no reporter address. Cost uncertainty on a real bug is stated in How to fix it.
3. **Register** (ported from the elevator prompt, generic, no cross-repo reference): everyday words a PM follows without the code open; explain a code term on first use; name a component by what it does, then its location trailing the claim only when the reader has to open it; only claims backed by a concrete example from the facts gathered, including judgments about cost or risk; the mandatory baseline (tests pass, lint clean) stays unsaid; no code fence and no `->` chain in a body; no `Label:` line in a body - in particular none of `Fault story:`, `Proof:`, `Symptom:`, `Verdict:`, `Evidence:`, `Next step:`, plain or emphasized (`**Symptom:**`). The four headings, the marker line, `Pick one:`, the menu, the eligibility line, and the confirmation token are the envelope, not labels. Channel register (terse for a tracker comment, conversational for Slack) changes wording inside sections, never a heading, the section order, or where the confirmation sits.
4. **Caps.** Context at most 5 source lines (a list item is one line; TUI wrapping does not count); the whole report under 180 words counted from the first heading to `Pick one:`, the confirmation, or the end of message, headings included, excluding the marker line, menu, eligibility line, and confirmation token. When the report does not fit, cut Context first, then shorten the proof in Why; never drop a required section.
5. **Lists.** A bulleted list only where three or more parallel facts read better as a list; a numbered list only where steps happen in order (an algorithm in Context, a causal chain in Why); otherwise prose.
6. **Hotfix record.** The handoff's fault story is a separate two-sentence prose rendering of What is broken and Why - one sentence per section, one paragraph, no heading, no list marker - written into the handoff record and from there by `hotfix.md` into the squash commit body. It is not a concatenation of the displayed bodies, which keep their lists; `hotfix.md`'s commit line treats the value as data under its own shell quoting, so ordinary punctuation is allowed. `fault story` in `SKILL.md` names only this handoff value.
7. **Hotfix return.** `hotfix.md` step 8's `$SHA`, revert line, porcelain delta, and push nudge and step 9's cleanup evidence are operational evidence, not the PM report: the step-5 draft or summary after a hotfix carries the SHA or PR link trailing the claim in its third section, states the revert line in plain words there when the commit is unpushed ("it is not pushed yet; undo it with ... if needed"), and puts a residual (a worktree or branch that could not be removed, a porcelain delta) as one Context line; cleanup that went as expected stays unsaid. None of it opens the message before the marker or trails the last section.
8. **Three golden examples**, each a complete step-4 gate message with marker line, `Pick one:`, and menu - the real-bug example also carries the eligibility line - labeled as step-4 gates only: one real bug (the `/widgets/` trailing-slash case the skill uses today, re-rendered in the four sections with Context carrying the one repro line), one `cannot-replicate` ending in `### What happens next` and the negative menu, and one `not-a-bug` whose Why section names the contract the behavior satisfies by kind (a documented API rule) and whose `### What happens next` points the reporter at the correct usage, so the contract-satisfied case is shown, not only described. The draft and summary reuse the section bodies, never the marker, `Pick one:`, or the menu - their markers are `gauntlet: gate=chase-bug/response-to-origin`, `gauntlet: done draft`, and `gauntlet: done summary` per step 5. The reference is the single owner of examples; the citation-source contrast from `SKILL.md`'s old negative examples (doc section vs decision commit) survives as the "naming the kind of source" rule in item 2.

Target size 100-150 lines.

### `skills/chase-bug/SKILL.md` edits

Remove: the Verdict shape paragraph, its inline `/widgets/` example, the six-label ban, and the "Deep evidence ... goes below this" sentence (today lines 155-175); the phrase "sentences one and two of the Verdict shape, never the decision sentence" in the hotfix handoff (line 240); "render the Verdict shape - sentence two names the verdict in plain words with its citation trailing" in the negative-verdict paragraph (line 295); "Write the draft in the Verdict shape (step 4); its third sentence names ..." (line 346) and "Render the summary in the Verdict shape (step 4); its third sentence names ..." (line 404); the whole `## Golden examples` section (lines 422-447: the three-sentence `/widgets/` real-bug story with its fenced menu and the two negative citation-contrast stories), replaced by one line - "Golden examples live in `reference/verdict-report.md`." - so the skill ships one shape, not two. Surviving `fault story` wording is remapped: the step-4 marker sentence (line 153) reads "before the report or verdict in every variant"; the cost-uncertainty sentence (line 235) reads "state the uncertainty plainly in How to fix it".

Add, in their places, the same read instruction at every render site - "Read `reference/verdict-report.md` now (resolve against this skill's directory; unreadable -> stop, naming the path) and render the report in its shape" - at step 4 (the gate, including its re-fire after a hotfix abort), in the negative-verdict paragraph ("... with `### What happens next` as its third section, then a short numbered menu"), at the step-5 draft ("... its third section names the reporter's next step - ...; the message ends with the `send it` token where gate 2 fires, otherwise with the last section"), and at the step-5 summary ("... its third section names what happens next - ...; the message ends with the last section"), the trailing lists of next-step kinds kept as they are. Step 4 keeps the marker sentence, the menu tables, predicates, the `[recommended]` heuristic, and the eligibility line byte-identical, and adds "`Pick one:` and the menu follow the last section; the eligibility line ends a real-bug message and the menu ends a negative-verdict message". In the hotfix handoff: "the fault story (a two-sentence prose rendering of What is broken and Why per `reference/verdict-report.md`, never the third section)". The channel-register sentence at step 5 ("Match register to the channel: terse for a tracker comment, conversational for Slack.") stays and gains "- tone changes wording inside sections, never a heading, the section order, or where `send it` sits". The file ends under 500 lines (today 484, net change negative: about 46 lines removed, about 10 added).

`hotfix.md`: operations, aborts, predicates, and the step 8-9 reporting obligations are unchanged; its `<fault story>` placeholder (line 326) takes the two-sentence value step 4's handoff now defines. One presentation-only sentence is appended to step 10 ("Response."): "The draft or summary is rendered per `reference/verdict-report.md`, which carries step 8's SHA, revert line, and push nudge in its third section and any step 9 residual as one Context line; nothing from steps 8-9 renders before the marker line or after the report."

### Predecessor

`doc/specs/2026-10-28-chase-bug-summary-prose.md` gets the banner `> **Superseded by:** [doc/specs/2026-11-04-chase-bug-elevator-report.md](./2026-11-04-chase-bug-elevator-report.md) - "Verdict shape" rule and golden examples only`; its menu, gate-marker, and eval-structure decisions stand.

### Eval: `eval/chase-bug/`

- `target.json`: add `{ "path": "skills/chase-bug/reference/verdict-report.md", "new": true }` (whole file) to `skillFiles` so every candidate sample sees the contract; the step-5 slice of `SKILL.md` stays. The reference has no version at the merge-base, and the runner refuses an undeclared path absent at the baseline (`eval/run.mjs:184`, `eval/README.md` "Declare a candidate-only `skillFiles` entry with `"new": true`"); with the declaration the baseline arm assembles the reference as empty text and the candidate arm includes the file, so the before/after is the old bundled `SKILL.md` against the new `SKILL.md` plus the reference, both against the ordinary merge-base baseline. Raise `wordCap` from 500 to 700: `wordCap` bounds the whole reply, and a reply over it lands as `status: error` (`eval/run.mjs:130`), not as a fact result; a two-checkpoint sample holds two reports of up to 180 words plus two marker-menu-eligibility envelopes, which can cross 500. The per-report 180-word bound is the separate `under-cap` fact; a runner error is never read as a report-fact outcome. Samples that render the step-4 gate keep `bundle+: skills/chase-bug/SKILL.md` and `bundle+: skills/brainstorming/reference/menu-layout.md`.
- `intent.md`: rewritten for this change - the shape, the register, the facts expected to move, with the matching `for:` assembly hash.
- `samples/prose-verdict-above-menu/expected.md`: `three-sentences` and `under-80-words` are replaced by `section-order` (mechanical: one `matches` regex anchored on the `gate=chase-bug/verdict-menu` marker and then on the `gate=chase-bug/response-to-origin` marker, each followed by `### What is broken`, `### Why it is broken`, and the verdict's third heading in order, so both checkpoints are checked separately) and `under-cap` (judged, per report: under 180 words headings included, Context at most 5 source lines); `no-labels` keeps its existing regex on the six prefixes (the emphasized `**Symptom:**` form still contains `Symptom:` and is rejected by it; the headings and the envelope never contain a prefix), `no-fence` keeps its existing check; `plain-reader`, `menu-intact`, and `draft-asks-reporter` are reworded to the third section, and `draft-asks-reporter` keeps `send it` outside the draft and no push claim; new judged fact `ends-at-envelope`: checkpoint 1 ends with the eligibility line and checkpoint 2 with the confirmation token, with no evidence, status, or "deeper detail" after either. Checkpoint 2 is a `cannot-replicate` reporter draft for a GitHub issue, not a terminal summary.
- `samples/sectioned-report-order/`: new; checkpoint 1 is a confirmed real bug rendering the step-4 gate (addressable origin, all predicates pass), checkpoint 2 a `cannot-replicate` verdict rendering the negative-verdict gate; facts: `section-order` (mechanical, marker-anchored per checkpoint as above), `third-heading-by-verdict` (judged: checkpoint 1's third heading is `### How to fix it`, checkpoint 2's is `### What happens next`, and checkpoint 2's Why names the failed repro attempts without inventing a cause), `plain-reader`, `no-labels` (mechanical, same regex), `under-cap`, `lists-earn-place`, `menu-intact`, `ends-at-envelope`.
- `samples/nov3-replay/`: new; two synthetic cases written from the 2026-11-03 failures with every customer name, repo path, SHA, and tool name replaced, each fixed as a real bug so the mechanical third-heading check and the menu row count are determined: case 1, a CI job whose last minutes rescan a tree the lint step already scanned - tracker-ticket origin with a CLI (addressable), all predicates pass, hotfix recommended; case 2, a slide deck whose heading font lacks one glyph so a fallback font overflows the card - free-text origin (unaddressable), one predicate fails (the fix touches a font asset outside the repo), so the eligibility line reads `not eligible: <predicate>` and "Finish with rendered summary" is the fourth row. One checkpoint each rendering the step-4 gate; `expected.md` opens with `anonymized: true` on its first line, where `parseExpected` reads it (`eval/lib/checks.mjs:18`); same facts as `sectioned-report-order` minus `third-heading-by-verdict`. The runner's baseline (merge-base) and candidate cells are the before/after; the baseline outcome on each fact is recorded as observed, not predetermined.
- `samples/returned-ticket-link/expected.md`: the only sample that renders the terminal summary (real bug, File a ticket pick, free-text origin, existing ticket returned); `three-sentences` and `under-80-words` are replaced by `section-order` (mechanical regex: `gauntlet: done summary` marker then `### What is broken`, `### Why it is broken`, `### How to fix it` in order) and `under-cap`; `no-labels`, `no-fence`, `returned-reference`, and `no-new-creation` stay as they are; `plain-reader` is reworded to the sections; new judged fact `summary-not-draft`: no menu, no `send it`, no reporter-facing framing, and the message ends with the last section. Its `bundle+: skills/chase-bug/SKILL.md` makes it stale by construction, so it is a selected run.
- `README.md` under `eval/chase-bug/`: lists the six samples (today it still says single-sample).
- `report.md`: the runner overwrites it on every comparison that made a model call and takes one sample per invocation, so the four selected samples run in the order `prose-verdict-above-menu`, `sectioned-report-order`, `returned-ticket-link`, `nov3-replay`; the per-sample cell records under `eval/chase-bug/results/<sample>/` are committed for all four, and the final `report.md` carries `nov3-replay`'s cells and a partial-coverage line naming all four samples run (with their results paths) and `gate-line-first` and `menu-after-numbered-findings` as not rerun.

### CHANGELOG

`## Unreleased` gains one bullet: chase-bug's verdict gate, reporter draft, and terminal summary render as four short sections (optional Context, What is broken, Why it is broken, How to fix it or What happens next) under a PM-readable register defined in `skills/chase-bug/reference/verdict-report.md`; the menu is unchanged.

## Errors and edge cases

- Reference file unreadable at render time: stop with a blocking error naming the path; never improvise the shape.
- No surviving technical fact for Context: omit the heading, never render an empty section.
- Report over 180 words: cut Context first, then the proof in Why; the three required sections always render.
- `cannot-replicate`: What is broken states the reported behavior against what the repro attempts showed; Why names the attempts that failed and says the cause is unknown; What happens next names the input that is missing as fact; the reporter draft's third section turns that into the ask; the discovery-ticket row stays in the menu.
- Hotfix return: the draft or summary carries the SHA or PR link and the plain-words revert line in its third section and a cleanup residual as one Context line; branch, worktree, tip, CI counts, and status lines from `hotfix.md` steps 8-9 never open the message or trail the report.
- Ungated terminal draft (no write path, push failure): renders the same sections and ends with the last section; no confirmation token is added.
- Reply over the runner's `wordCap`: the cell is `status: error`, not a fact result; fix the sample's preamble or the envelope, never relax the 180-word report rule.
- Unaddressable origin: the summary renders the same sections with no menu and no reporter-facing framing; the "Finish with rendered summary" row is unchanged.
- Hotfix abort re-fires the step-4 gate: the report re-renders in the same shape with the menu rules `SKILL.md` already has.
- A section body that happens to be exactly three parallel facts may be a list or prose; the judged fact accepts either when readability holds.
- Size lint: the reference file is a new `skills/**/*.md` and falls under the 50,000-byte / 2,000-line lint automatically.

## Tests

- real-bug gate renders Context (optional), What is broken, Why, How to fix it, then the menu - `eval/chase-bug/samples/sectioned-report-order` checkpoint 1, `section-order` mechanical (marker-anchored per checkpoint)
- negative verdict renders What happens next, Why names the failed attempts without inventing a cause - `samples/sectioned-report-order` checkpoint 2, `third-heading-by-verdict` judged
- draft renders the same sections, no menu, `send it` outside the draft - `samples/prose-verdict-above-menu` checkpoint 2, `draft-asks-reporter` and `section-order`
- terminal summary renders the same sections, no menu, no reporter-facing framing, ends with the last section - `samples/returned-ticket-link`, `section-order`, `under-cap`, `summary-not-draft`, `plain-reader`
- everyday words, code term explained on first use, identifiers trailing and only when needed, no fence, no `->` - `plain-reader` and `no-fence` across `sectioned-report-order`, `prose-verdict-above-menu`, `nov3-replay`, `returned-ticket-link`
- no `Fault story:`, `Proof:`, `Symptom:`, `Verdict:`, `Evidence:`, `Next step:` prefix, plain or emphasized, in any report body - `no-labels` mechanical regex across the same four samples
- Context at most 5 source lines, report under 180 words headings included - `under-cap` across the same four samples
- lists only where they earn their place - `lists-earn-place`, `sectioned-report-order` and `nov3-replay`
- nothing after the eligibility line, the negative menu, the confirmation, or the last section - `ends-at-envelope` in `prose-verdict-above-menu`, `sectioned-report-order`, `nov3-replay`; `summary-not-draft` in `returned-ticket-link`
- hotfix commit body carries two plain sentences, no headings, no list markers - none: the hotfix path writes code and needs a model run with mutations; verified in conformance by reading the handoff sentence in `SKILL.md`, the two-sentence rule in `reference/verdict-report.md`, and the `<fault story>` placeholder in `hotfix.md:326`
- hotfix housekeeping stays out of the report - none: conformance reading of `hotfix.md` step 10's appended sentence and the reference's hotfix-return item
- before/after on the anonymized Nov 3 cases - `samples/nov3-replay`, baseline vs candidate cells in `report.md`, baseline outcomes recorded as observed
- runner cap is the whole reply, not the report - `target.json` `wordCap: 700`, read in conformance; a `status: error` cell is a runner result, not a fact
- size lint - `npm test` (instruction-size lint in `scripts/ci.mjs`)
- menu, `[recommended]`, eligibility, numeric mapping intact - existing `menu-intact` fact in `prose-verdict-above-menu`, `sectioned-report-order`, `nov3-replay`; `gate-line-first` and `menu-after-numbered-findings` are not rerun, and `report.md` names them as partial coverage

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` `## Unreleased` (communication contract - the rendered gate shape changes for every chase-bug user)
- Derived / memory docs invalidated: none - `doc/gate-contract.md:47` describes the gate as `N. rows`, which still holds; `README.md`'s chase-bug sentences do not name the three-sentence shape; `eval/chase-bug/README.md` and `intent.md` are eval surface, updated as part of the eval work above

## Out of scope

- A gauntlet-wide human-report reference shared by finishing's closure digest or gatekeep's batch summary (approach 3); revisit when a second consumer shows the same failure.
- Any change to the pi-quiver `/elevator` prompt or skill; the register is ported as generic wording, not referenced.
- The hotfix procedure in `hotfix.md` - its commands, aborts, predicates, and step 8-9 reporting obligations (only the step-10 presentation sentence above changes) - the menu rows, the `[recommended]` heuristic, the predicates, the gate ids, and the numeric reply mapping.
- Re-running the full chase-bug eval target or any cross-target sweep.

## Open questions

none
