# Loop engine on a ticketless spec: drafted acceptance criteria ratified at the gate

**Goal:** Let a brainstorm that has no ticket acceptance criteria still select the loop engine, by having spec-writing draft `## Acceptance criteria` rows from the approved design, showing those rows verbatim at the approval gate, and treating the user's approval as their ratification - while a ticket that carries acceptance criteria keeps today's verbatim-rows path byte-for-byte.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves
**Predecessor:** `doc/specs/2026-10-23-gh-68-loop-implement-engine.md` - extended, not superseded: its edge-table cell "Spec with no AC rows | loop options not rendered" is narrowed by this spec's Design to the not-fetched case; the engine contract stands, the predecessor file is not edited, and no supersession banner is placed.

## Problem

The loop engine (`/skill:loop-implementation`) seeds its ledger from the `- [ ]` rows under the spec's `## Acceptance criteria` section and dispatches one `loop-implementer` per iteration to close a row. The gate rule in `skills/brainstorming/reference/spec-finalization.md:143` is the only place loop availability is decided: when the section reads `none - <reason>` the gate renders options 1-3 and prints "Loop engine unavailable: this spec has no acceptance-criteria rows." `extensions/lib/plan-check.ts:1137-1181` (`checkLedger`) is the only code that reads the section; it fails on zero rows. Today the only row source is a ticket: `skills/brainstorming/reference/ticket-acceptance.md` copies the ticket's rows verbatim and ends with "Never author acceptance criteria on the ticket's behalf; that is `/skill:shape-ticket`'s job." A free-text brainstorm therefore writes `none - no ticket` and can never reach the loop engine, even though the approved spec is a human-ratified contract that the verify phase already treats as a requirement source (`skills/verification-before-completion/reference/conformance-check.md:81`).

Corrected premise: the ticket-only restriction is not a defended design. The predecessor records it as one edge-case table cell with no reason (`2026-10-23-gh-68-loop-implement-engine.md:227`), and the "never author" sentence guards fidelity to a ticket that, in the free-text case, does not exist. Implicit dependency found missing: no row source exists for a ticketless spec - nothing turns design decisions into `- [ ]` rows, and `checkLedger` parses only checkbox rows under `## Acceptance criteria` (checked by reading `checkLedger`, `ticket-acceptance.md`, and brainstorming steps 3 and 7).

Framing: kept - checked the gate rule, `checkLedger`, `agents/loop-implementer.md:28-34` (reads the whole spec, works the target row by index), the conformance priority table, and the predecessor's edge table. The `shape-ticket`-first path exists and remains valid; the user rejected it as the answer because the brainstorm is already underway when rows turn out to be missing.

User constraint (binding): rows are drafted only when the ticket path produced no acceptance-criteria rows. A ticket that carries rows keeps the verbatim-rows rule unchanged, nothing is generated beside its rows, and the gate renders no drafted block for it.

## Acceptance criteria

none - no ticket

## Design

### Row drafting at spec-writing (brainstorming step 7)

Before writing the spec file, spec-writing branches on what the ticket path produced:

| Ticket path result | `## Acceptance criteria` body written |
|---|---|
| Ticket rows extracted | `Ticket <ref>, <heading or "checkbox list">, rows verbatim:` plus the rows and dispositions, exactly as today |
| `none - ticket not fetched (<reason>)` | that `none` line, exactly as today; the gate keeps the paste-rows affordance, and pasted rows are ticket rows (no drafting follows) |
| `none - no ticket` | drafted rows under the header `Drafted from the design, no ticket rows:` |
| `none - ticket has no acceptance criteria` | drafted rows under the header `Drafted from the design, ticket <ref> has no acceptance criteria:` |

Drafting input is the design the two rounds approved plus the original prompt. Output is one `- [ ]` row per observable outcome the design commits to - what a user, reviewer, or test observes once the change ships - never a mechanism ("the resolver gains a key" is rewritten to "a free-text spec offers options 4/5 at the gate"). Each row carries the disposition `in-scope`; a pre-production-observable outcome bound to one environment may carry `venue: <env> - <observation>` under the existing grammar, and a venue requirement alone is never grounds to drop a row. The disposition grammar from `ticket-acceptance.md` applies unchanged. For drafted rows the cut question offers `A) in-scope - <reading> B) deviates: <why> C) deferred: <where>` and omits option D (`repair the ticket - /skill:shape-ticket <ref> ...`): there is no ticket contract to repair and no snapshot to re-fetch. The full question and the user's answer are carried into the council's `Human input` block as today. Ticket rows keep the complete existing question, including D and its re-fetch procedure, unchanged. A cut never happens silently. Workflow artifacts (spec, plan, changelog, telemetry record) are never rows, matching the ticket rule.

Every drafted row passes the AC integrity classes of `skills/shape-ticket/SKILL.md` (wishful, tautological, unspecified-but-binding, external-input, post-deployment) inline before the spec lands. The ticket outcomes (hard stop, park, relocate) adapt to a spec that has no ticket to park on with one invariant: a committed outcome is preserved and only its proof is rewritten. A wishful or tautological candidate is rewritten into the observable the design commits to, with baseline, target, and measurement taken from the design, never invented. An unspecified-but-binding candidate's value is resolved by the design (the resolution is a Design clause and the row states the outcome). A missing input - an external yardstick, a value the design does not fix - is resolved by a clarification question to the user before the spec is written, never by inventing it and never by dropping the outcome. A post-deployment candidate whose outcome is observable pre-production is rewritten to that observation (with `venue:` when it is environment-bound); one observable only in production is recorded as a `Post-deployment housekeeping` Design clause (tracked, non-blocking, never a row), matching the ticket rule. An outcome leaves the in-scope rows only through an explicit scope decision by the user - the cut question or a clarification answer - recorded as the row's `deviates:`/`deferred:` disposition (so the gate's `Scope cuts:` line discloses it) and as an `## Out of scope` entry. Drafting never emits a `none` fallback: if no valid row remains after integrity, the main loop stops for clarification or a scope decision before writing the spec rather than inventing a row.

An unbound PR subject (`none - no ticket` under `reference/pr-subject.md`) drafts too; the rows come from the agreed rework design, not from the PR title or body. `pr-subject.md`'s sentence "carry raw title/body as stated intent, not invented AC rows" narrows to the title/body carry-over and no longer forbids the drafted section.

### Ownership and critique

`ticket-acceptance.md` keeps "Never author acceptance criteria on the ticket's behalf" for the ticket case and gains the drafted branch beside it, keyed on the two triggering `none` lines. Its two unconditional sentences are scoped to the `Ticket <ref>, ... rows verbatim:` header: "names the ticket contract only; the spec's own requirements stay in Design" and "Never edit the row text" bind ticket rows; under a drafted header the rows are the spec's own requirements and pre-approval edits are integrity rewrites only. The section's provenance is readable from its header line alone; no other reader needs to know how the rows arose.

Drafted rows are spec content: the council (`/skill:roasting-the-spec`) critiques them like any other section and its applier may rewrite a row pre-approval for an integrity class. They are never part of the `Human input (verbatim; off-limits for over-spec)` block, which stays the original prompt plus any ticket rows - and a drafted row is not an over-spec candidate on that ground alone. The council task in `roasting-the-spec/SKILL.md` and `agents/spec-council-applier.md` gain the rule: a drafted `- [ ]` row is deleted only when the Design commitment it observes is itself cut through the scope-decision procedure above, never on an over-spec finding that quotes the row alone, and never by replacing the section with a `none` line; the post-council legal-body check in "Gate rendering and routing" catches the latter before the gate.

After gate approval drafted row text is frozen exactly as ticket row text is (`reference/amendment-surface.md`, acceptance criteria = human-owned section): dispositions move only through the existing cut question and amendment grammar (`deviates:`/`deferred:` -> ledger `cut`, re-bounded -> `open`), stopping for review under option 1/4 and auto-applying under 2/5 as for ticket rows today. Changing a drafted row's text, adding a row, or removing one is a redraw - re-draft from the new design and ratify at the full gate again - never an amendment and never an auto-applied grant item, because `amendment-surface.md:145` reconciles only dispositions and `checkLedger` requires exactly one ledger row per spec AC.

### Gate rendering and routing

`spec-finalization.md:143` changes from "`none - <reason>` -> options 1-3" to "zero `- [ ]` rows under `## Acceptance criteria` -> options 1-3 plus the unavailable line", which after this change happens only for `none - ticket not fetched (<reason>)`. Whenever rows exist, drafted or ticket, options 4/5 render.

Block visibility follows the absence of ticket rows, not the absence of a ticket reference: the Q3 answer "only if ticket is not provided" is read as "only when the ticket path produced no rows", so a fetched ticket without acceptance criteria renders the drafted block (its rows are new and cannot be ratified unseen) and a ticket with acceptance criteria never does.

For a drafted header the gate adds one adjacent block in the slot after the `Scope cuts:` line and before the `Council:` line, keeping the commit-line-before-`Scope cuts:` order pinned by `scripts/brainstorming-contract.test.mjs:89-96`; the main loop renders it from the spec section (the same way `Scope cuts:` is rendered today, never from the summarizer):

```text
Drafted acceptance criteria (approval ratifies):
- [ ] <row text verbatim>
  in-scope
...
```

A ticket-row spec renders no such block. On reply `3` the block is reused verbatim with the briefing text; on a change request that touches rows the block is re-rendered from the recommitted section; on a redraw it is rendered from the re-drafted section.

The inline lint bullet keeps its pinned title "Ticket contract present" (`scripts/ci.mjs:260`); its predicate at `spec-finalization.md:49` is replaced, not extended. `## Acceptance criteria` is legal in exactly three forms: the `Ticket <ref>, ...` header plus verbatim rows and dispositions; a drafted header plus at least one `- [ ]` row, each with a disposition; or the single line `none - ticket not fetched (<reason>)`. The lines `none - no ticket` and `none - ticket has no acceptance criteria` fail lint at authoring and again at the post-council placeholder re-scan, which re-applies the whole predicate (header and body, not the header alone) so an applier that cut every row or restored a triggering `none` line is caught before the gate. On failure the main loop repairs the section from the applied Design - re-drafts at least one row and appends the audit line; if no valid outcome remains, it obtains a clarification or an explicit scope decision from the user before presenting the gate.

### What does not change

`extensions/lib/plan-check.ts` (`checkLedger`), the ledger grammar, `skills/loop-implementation/SKILL.md`, `agents/loop-implementer.md`, `conformance-check.md`, and the finish skill's PR-body AC block read the section by row index and header-agnostically; none of them changes. The ticket path with rows is untouched end to end: same header, same verbatim rows, same summarizer and council inputs, no drafted block at the gate. The predecessor spec is not edited; its narrowed edge-table cell is explained by this spec's header and gate rule.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` (Loop engine operations - replace "Specs without AC rows do not offer loop options" with when options 4/5 appear, that a ticketless spec gets drafted rows ratified by approval, and that only a not-fetched ticket leaves the loop unavailable; operations category); `CHANGELOG.md` - deferred: release
- Derived / memory docs invalidated: none

Scout candidates `doc/implement-engines.md` ("checklist is spec AC rows against the ledger") and `README.md` (loop alternative in the workflow steps) stay true as written and are dropped.

## Tests

- `scripts/brainstorming-contract.test.mjs:79` (asserts against `ticket-acceptance.md`) keeps every existing marker (`none - no ticket`, `none - ticket has no acceptance criteria`, `none - ticket not fetched (<reason>)`, `Never author acceptance criteria`) and gains the drafting provenance marker `Drafted from the design`. The ratification marker `Drafted acceptance criteria (approval ratifies):` is asserted against `spec-finalization.md` in the gate-template test (lines 89-96), together with the slot order commit line -> `Scope cuts:` -> drafted block -> `Council:`.
- `scripts/brainstorming-contract.test.mjs:365` is updated for the new zero-row gate rule: its `none -` and `render only options 1-3` markers are replaced by the rewritten sentence's wording (the phrases "zero `- [ ]` rows", "render only options 1-3", and "Loop engine unavailable"), and the three-form "Ticket contract present" predicate gains a marker for the drafted form.
- `eval/brainstorming`: new sample `drafted-ac-rows` with five cells - (a) free-text design -> rows under `Drafted from the design, no ticket rows:`, every row `in-scope`, outcomes not mechanisms, at least one row; (b) a ticket with rows -> verbatim header and rows, no drafted text; (c) `none - ticket not fetched (<reason>)` -> the `none` line unchanged; (d) a fetched ticket without acceptance criteria -> design-derived rows under `Drafted from the design, ticket <ref> has no acceptance criteria:`, the block rendered verbatim at the gate, options 4/5 present; (e) an unbound PR subject -> rows under `Drafted from the design, no ticket rows:` drawn from the rework design, not the PR title or body. The existing `loop-gate` sample gets two separate inputs replacing its single `none - no ticket` spec: a drafted-row spec (block rendered, options 4/5) and a not-fetched zero-row spec (options 1-3 plus the unavailable line); its `no-ac` fact is rewritten accordingly. The existing unbound-PR facts change to expect design-derived rows and the drafted provenance header: `pr-subject-rule-added-later/no-ticket` (today `mechanical: contains "none - no ticket"`) and `pr-subject-resolution/open` (today "carries ... none - no ticket into ACs"); `pr-subject-resolution/issue` stays unchanged as the ticket-row regression. `intent.md` gains the drafted-rows change and names the three rewritten facts.
- `eval/spec-gate`: new sample `drafted-rows-block` - the block renders after `Scope cuts:` and before `Council:` with the rows verbatim and five options; a ticket-row spec renders no block. `intent.md` gains the change.
- Remaining existing samples in both targets rerun as regression; `node eval/run.mjs brainstorming` and `node eval/run.mjs spec-gate` run before finish per `AGENTS.md`. `npm test` covers the contract test and skill lint.

## Out of scope

- Deriving rows mechanically from Design clauses at ledger seeding (declined at Q1).
- A separate `## Spec contract` section beside ticket rows; ticket specs gain no Design-derived rows.
- Drafting for `none - ticket not fetched (<reason>)` (declined at Q2 - rows may exist and drafting would race them).
- A dedicated pre-gate stop to accept or edit the drafted rows (declined at Q3 - the single gate ratifies).
- A dispatched drafter persona or council-applier drafting (approaches 2 and 3, declined).
- Any change to `checkLedger`, the ledger grammar, the loop driver, or the loop-implementer persona.
- Editing the predecessor spec's edge-case table in place (cut by the council as over-spec; this spec's header records the narrowing).

## Open questions

none
