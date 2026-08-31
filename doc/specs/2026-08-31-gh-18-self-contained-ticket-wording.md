# Self-contained ticket wording for shape-ticket

Ticket: [jjuraszek/pi-gauntlet#18](https://github.com/jjuraszek/pi-gauntlet/issues/18)

## Problem

shape-ticket's `## Ticket wording` defaults ("shortest body a stranger can act on AND verify") produce tickets only a codebase insider can read. Three reinforcing causes, all observed on the first real ticket the skill produced (pi-condense#13, called "extremely hard to read" by the reporter):

1. "Stranger" is readable as stranger-to-the-ticket, not stranger-to-the-codebase, and "shortest body" rewards compression over comprehension.
2. Repo-wide density norms ("dense", "optimize for retrieval over readability") bleed into ticket prose via the section's opener: "The repo's own documented comms style (found via the ladder) overrides these defaults."
3. Neither the roast nor repair mode can catch or heal the defect: members have no wording contract to check against, and repair mode's no-op check reports a violating body as "conforms".

This spec extends the #8-era defaults (it does not reverse them - the AC integrity machinery, template, and process are untouched).

## Design overview

No settings keys, no agents, no extension changes. Complete changed-file list:

- **New: `skills/shape-ticket/reference/ticket-wording.md`** - the full self-containment contract plus a bad->good body exemplar. Single source of truth and the dispatch artifact handed to roast reviewers (council members are content-only and cannot read SKILL.md; precedent: `reference/split-axes.md`).
- **Edited: `skills/shape-ticket/SKILL.md`** at six points, detailed below.
- **Edited: `doc/specs/2026-08-18-gh-8-shape-ticket-skill.md`** - scoped supersession banner (already applied in this worktree).
- **Edited: `CHANGELOG.md`** - unreleased entry.

## The contract (`reference/ticket-wording.md`)

The file states, as normative rules:

1. **Reader definition.** The "stranger" the body serves is a reader who has never opened the repo. ACs are exempt throughout - they address the implementer and may name files, symbols, and settings freely.
2. **Self-containment test.** Remove every code/doc reference from Context, Problem, and Idea; what remains must still make the problem and its impact understandable and triagable by that reader. Deleting the references may lose depth, never comprehension. The test is a reviewer judgment with a mechanical framing (strip, re-read, ask "triagable?"), not a keyword scan.
3. **Precedence.** Self-contained human comprehension wins over brevity and retrieval-density norms; compression applies only after the test passes. "Shortest body" survives as a constraint on what may be *omitted*, never a license to leave jargon undefined or mechanisms unexplained.
4. **Plain-words lead.** Each independently asserted failure or impact in Problem opens with a plain-words sentence of what goes wrong and what it costs, before any mechanism. (The lead and example rules bind Problem, per the ticket; Context and Idea are bound by the general self-containment test.)
5. **Example per failure.** Each independently asserted failure carries a concrete example: real numbers, a before/after, or a short transcript. One example may serve multiple sentences describing the same failure. `none (<reason>)` is permitted only when no observable exists yet (pure rename/removal, or discovery work whose deliverable is the observable); the reason is part of the draft and thus roast-reviewable by construction. A disputed reason is an ordinary roast finding handled by the existing disposition machinery (applied if unambiguous, surfaced at the gate if not) - no new disposition class.
6. **Jargon.** Domain jargon - including repo-native terms - is defined at first use in plain words, or dropped. A link is not a definition when the term is load-bearing for triage.
7. **Pointer demotion.** Code/doc references in Context/Problem/Idea are demoted to parenthetical pointers whose deletion loses no meaning, e.g. "(Pointer for the implementer: detectChains, src/chain-detector.ts.)". Composition with the existing tracker-native-links bullet: that bullet governs *how* a reference is written (native link/mention form, never bare identifiers); pointer demotion governs *where* it may sit (parenthetical, deletion-safe).
8. **Link-vs-inline rule (anti-spiderman).** Linking stays legitimate for targets impractical to inline - a whole design doc, a KB page, a long log - and for general-knowledge material; every such link carries a one-line plain-words statement of what the reader needs from it. What is forbidden is the spiderman shape: many small load-bearing hops, where the full picture must be assembled from N places even when each individual inline would be cheap. Discriminator: "is this definition load-bearing for triage?" - load-bearing small definitions get inlined; big chunks get linked with a summary line.
9. **Exemplar.** One bad->good body pair: a reference-laden mechanism-first fragment vs its self-contained rewrite. Genericized from the pi-condense#13 pair quoted in #18 - shape and numbers kept (they carry the persuasive force), repo-specific identifiers swapped for neutral ones, references reduced to the parenthetical-pointer form rule 7 mandates. The exemplar anchors roast review of the mechanism-first failure mode (the most common one); the other rules are checked from their normative statements. Normative exemplar text, verbatim:

   > Bad: "detectSpans stayed idle from the previous span's close (11:05) until the next real user message (22:26): the registry jumps from s25 (10:47-11:05) directly to s26 (22:26-00:02), leaving the active 11:06->13:43 work stretch unspanned."
   >
   > Good: "When the workflow auto-continues from one phase to the next, no human message marks the transition - and the context-trimming machinery only recognizes work that starts with a human message. So a 2.5-hour stretch of work became invisible to trimming: every prompt sent to helper agents during it (169KB, a quarter of what remains in the model's context) is stuck there for the rest of the session. (Pointer for the implementer: detectSpans, src/span-detector.ts.)"

   Both versions are accurate; only the second is understandable without opening the repo.

Scope of the contract: Context/Problem/Idea prose only. ACs, split justification blocks, metadata rationale lines, and Reporter-note comments are out of its scope.

## SKILL.md edits

1. **`## Ticket wording` rewrite.** The opener "The repo's own documented comms style (found via the ladder) overrides these defaults" is replaced by a narrowed precedence statement: repo comms style still tunes tone and format (where "tone and format" explicitly excludes density/brevity), but the self-containment contract (rules 2-8) yields only to an overrides-file section that explicitly addresses ticket wording (e.g. a `## Ticket wording` heading in the gauntlet overrides file). Generic density/brevity doc norms never reach ticket prose: neither the capability ladder's comms-style rung, nor AGENTS.md density language, nor the skill's closing "Project overrides" block (whose by-topic relevance matching does not reach the contract) can weaken it. The headline bullet is restated with split scoping: Context/Problem/Idea are the shortest prose **that passes the self-containment test** - understandable and triagable by a reader who has never opened the repo; ACs remain the part a stranger (human or LLM) can act on AND verify, implementer-facing per contract rule 1. The section instructs the parent to **read and apply** `reference/ticket-wording.md` (resolved against the skill's own directory) - a link alone is not the contract in hand. The remaining bullets (active voice/no filler, heading scaffolding, ASCII, tracker-native links) survive unchanged.
2. **Pipeline step 4 (draft).** "Apply the wording rules (below)" becomes an explicit instruction to read `reference/ticket-wording.md` (resolved against the skill's own directory) and apply it at draft time - mirroring the split rule's "Apply `reference/split-axes.md`" phrasing.
3. **Roast item 4 (brief).** The quality axis becomes: "problem framing, AC integrity beyond the deterministic gate, scope, wording, and conformance to the ticket wording contract (reference path provided in every roast brief)". The fidelity axis gains one sentence: unpacking existing claims to satisfy the wording contract is not `added`; contract-conformance findings on Context/Problem/Idea outrank fidelity flags that only object to extra explanation of the same claims (so a repair rewrite's plain-words expansion cannot be stripped back by a `:low` fidelity finding).
4. **Roast dispatch - all variants.** The absolute path to `reference/ticket-wording.md` (resolved against the skill's own directory) is carried by **every** roast path: council member task text (alongside `reference/split-axes.md`, same content-only rules - temp files plus the two reference paths are the members' entire permitted input), the `worker` fallback task, and the runtime-conditional (item 6, harness-native subagents e.g. Claude Code) brief. This matters doubly on Claude Code, where shape-ticket is marketplace-exposed and the runtime conditional IS the roast.
5. **Step 6 no-op check.** "Body already conforms" explicitly includes the full wording contract, applied inline by the parent against the reference file as a short checklist over Context/Problem/Idea: strip test passes (rule 2)? plain-words lead per asserted failure (rule 4)? example or `none (<reason>)` per failure (rule 5)? jargon defined or dropped (rule 6)? references parenthetical and deletion-safe (rule 7)? links summarized, no spiderman hops (rule 8)? Any "no" makes the body non-conforming: repair mode proposes a rewrite through the normal draft -> gates -> roast -> gate path instead of reporting "conforms". The invariant "a conforming ticket never pays for a dispatch" is preserved; the contract-briefed roast backstops the parent's inline judgment (a false "non-conforming" just triggers a rewrite that faces roast and human gate; a false "conforms" is the leak the checklist framing exists to make hard).
6. **Examples and rationalizations.** Gains one line pointing at the exemplar in `reference/ticket-wording.md` (not a duplicate), and one rationalization-table row: excuse "shortest body / our docs say dense" -> reality "density norms bind docs, not ticket prose; compression starts only after the self-containment test passes".

Repair-mode rewrite scope: the conformance-driven rewrite touches Context/Problem/Idea prose; ACs are not rewritten for self-containment (they remain subject to the existing AC integrity gate as always).

## Decisions on open questions

- **Roast thinking budget stays `:low`.** No change to #8's cost model. The exemplar anchors the most common failure mode (mechanism-first prose) as a pattern match; the remaining rules are checked from their normative statements, and the full-roast escape already exists for when the user wants more. The `:low` bet is validated by the third manual acceptance scenario below.
- **Consumer-repo overrides (Q1: option A).** Non-overridable by generic comms/density norms; overridable only by an explicit ticket-wording override section. This is the one deliberate narrowing of #8's opener.
- **No AGENTS.md / README / CONTRIBUTING / issue-template edits.** The fix lives entirely in shape-ticket's own contract, per #18's scope. The density norms in AGENTS.md stay as-is; the new precedence statement in `## Ticket wording` is what stops their bleed into ticket prose.
- **Predecessor spec.** `doc/specs/2026-08-18-gh-8-shape-ticket-skill.md` gets a supersession banner scoped to its ticket-wording defaults, since this design replaces that section's opener and headline rule (existing banners on that spec cover other scopes; append-only).

## Out of scope

- Consumer-repo doc changes (pi-condense AGENTS/overrides) - repo-local, handled there.
- Repairing pi-condense#13 itself - a repair-mode run in that repo once this ships.
- Wording rules of other tracker-facing skills (gatekeep-pr, check-delivery) - only if the complaint recurs there.
- Any change to the AC integrity gate, split rule, roast dispatch mechanics, or write gate.

## Testing and verification

- `npm test` (`scripts/ci.mjs`): the marketplace bundle checks already assert bundle-local `.md` reference integrity for shape-ticket; the new reference file and its SKILL.md link fall under them automatically.
- Forbidden-patterns grep over `skills/` (AGENTS.md convention): zero matches.
- Manual acceptance, three scenarios (scenario validation - no automated harness for skill behavior exists in this repo). Repair mode is entered only by an issue ref, so the dry runs use a non-mutating tracker fixture: a scratch overrides file with an `## Issue tracker` section whose read verb is a fixture script serving two canned issues - ref `#900` with the exemplar's "bad" fragment as its Problem, ref `#901` with the "good" rewrite.
  1. `/skill:shape-ticket #900` -> reaches the confirmation gate with a proposed rewrite diff (decline it; nothing is written).
  2. `/skill:shape-ticket #901` -> reports "conforms, no changes proposed" and stops (no gate, no write).
  3. Roast wiring: run the roast dispatch on the `#900` draft and confirm at least one `:low` member files a wording-contract finding.

## Documentation impact

- Feature / user-facing docs introduced: `skills/shape-ticket/reference/ticket-wording.md`
- Materially amended existing docs: `skills/shape-ticket/SKILL.md`; `CHANGELOG.md` (unreleased entry)
- Derived / memory docs invalidated: none

## Acceptance criteria (from #18)

- [ ] `## Ticket wording` redefines "stranger" as a reader who has never opened the repo and restates the headline rule so shortest-body applies only after the self-containment test passes.
- [ ] The self-containment test is stated (strip code/doc references from Context/Problem/Idea; remainder understandable and triagable; ACs exempt).
- [ ] Precedence stated: comprehension over brevity/density; compression only after comprehension; generic repo density norms cannot override it, only an explicit ticket-wording override section can.
- [ ] Plain-words lead sentence required per independently asserted failure in Problem, before any mechanism.
- [ ] Concrete example required per asserted failure, with the bounded `none (<reason>)` valve, the reason roast-reviewable.
- [ ] Jargon defined at first use or dropped; references demoted to deletable parenthetical pointers; the link-vs-inline (anti-spiderman) rule permits big-chunk links with a plain-words summary line.
- [ ] Built-in bad->good body exemplar ships in `reference/ticket-wording.md`, pointed to from Examples and rationalizations.
- [ ] Roast brief's quality axis names contract conformance; every roast variant (members, worker fallback, runtime conditional) receives the reference path; fidelity axis exempts contract-driven unpacking from `added`.
- [ ] A violating body is non-conforming for the repair-mode no-op check (step 6 applies the test inline); repair proposes a rewrite instead of "conforms".
- [ ] Predecessor spec `2026-08-18-gh-8-shape-ticket-skill.md` carries a scoped supersession banner.
