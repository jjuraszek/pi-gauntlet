# Workflow-stage proof is not an acceptance criterion: drop it at the ticket gate and at spec-writing

**Goal:** An acceptance row whose only observable is a delivery-pipeline stage - a CI or workflow run result, a pull request's state or review, a merge, or a full verification-suite run - never reaches a plan, a loop ledger, or a conformance reviewer: shape-ticket's AC integrity gate drops it (retaining the text in the Reporter note as retired proof), brainstorming screens ticket rows for that shape before question one and asks the cut question with ticket repair recommended as the first ordinary question, and never drafts one from a design.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Date:** 2026-11-06
**Supersedes:** doc/specs/2026-08-18-gh-8-shape-ticket-skill.md, the AC integrity gate class table (five classes become six) and the no-AC trigger only

## Problem

A consumer ticket authored on shape-ticket's template carries the acceptance row "`cd dashboard && mise x -- script/ci` is green on the PR head"; its brainstorm spec keeps the row verbatim with disposition `in-scope`. Downstream every consumer treats an `in-scope` row as implementation work: writing-plans tables it with an owner task (`skills/writing-plans/SKILL.md:271`), loop-implementation seeds it `open` in the ledger (`skills/loop-implementation/SKILL.md:44`), the conformance reviewer grades it as an `Rn` (`agents/conformance-reviewer.md:43`), and gatekeep-pr splits it into a mechanism half (`skills/gatekeep-pr/reference/findings.md:13-18`). An implementer therefore reads "open the PR and get CI green" as a step of the implementation, which exists only after it.

No acceptance gate names this shape. shape-ticket's integrity table has five classes (Wishful, Tautological, Unspecified-but-binding, External-input dependency, Post-deployment) and its deploy-window rule relocates only production-only observations (`skills/shape-ticket/SKILL.md:164-176`). Brainstorming keeps ticket rows verbatim with default `in-scope`, fires its cut question only when the user raises a row or code shows it wrong, and its drafted-row integrity table has no class for it (`skills/brainstorming/reference/ticket-acceptance.md`). The council flags `pr-source` (a row sourced *from* a PR body) and production venues, nothing else (`agents/spec-council-member.md:34`).

Measured over the 410 consumer specs dated 2026-10-09 or later across three consumer repos: 3 AC rows have a pipeline stage as their only observable ("script/ci is green on the PR head", "GitHub CI is green on the head of each pull request", "A spec under ... is merged that inventories ..."), all three ticket rows; about 35 other rows mention CI or `make ci` as the product outcome itself (the CI rule is the change). The class is structural - the row's sole observable is the stage - never a keyword match.

Premises checked: shape-ticket does not already name CI, PR state, merge, or full-suite rows as non-AC (disproved against `SKILL.md:164-176`); acceptance rows are known before the council - ticket rows arrive at gather through the context-builder's verbatim block (`skills/brainstorming/gatherer.md:169-225`) and drafted rows are written at checklist step 7, before council at step 9; `venue:` rows remain implementation work with an owning task, so `venue:` is not a parking slot for a stage proof; a downstream ignore rule would touch four consumers and contradict the approved spec, and is rejected. Unverified: whether the other two measured tickets were shape-ticket-authored (the first was).

Decisions from the questionary (user's words): repair at the source; the class is defined once, in shape-ticket's gate table, and named by reference elsewhere; the main loop screens the verbatim ticket rows at checklist step 4 because the draft is read there anyway; no council or persona change; follow forge-skill's authoring rules and stay under the 50,000-byte instruction-size lint.

Framing: kept - checked shape-ticket's AC gate and deploy-window rule, ticket-acceptance's cut question (option D already invokes shape-ticket repair) and drafted-row integrity table, the council's Logical-gaps classes, gatherer's parallel scout + context-builder batch, and how `venue:` rows flow through plan, ledger, conformance, and gatekeep.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] In shape-ticket repair mode, a body whose Acceptance Criteria hold `- [ ] CI is green on the PR head`, `- [ ] The importer rejects a row without an id and make ci passes`, and `- [ ] The importer names the offending row in its error` is drafted with the first row absent, the second row reading `- [ ] The importer rejects a row without an id` with no `make ci`, the third row byte-identical, the dropped and removed text in the fenced Reporter note, and no hard stop or park for those rows.
  in-scope
- [ ] In brainstorming, when the gather draft's verbatim ticket block holds `- [ ] GitHub CI is green on the head of the pull request` beside behavior rows and nothing else contradicts a row, the first ordinary question - after the holds-statement, or after the framing question when a concern exists - is the cut question for that row with options `A) in-scope`, `B) deviates:`, `C) deferred:`, `D) repair the ticket - /skill:shape-ticket <ref>` in that order and `Recommendation: D`, and no other row is questioned.
  in-scope
- [ ] In brainstorming spec-writing for a ticketless design whose `## Tests` names a full-suite command and whose Design commits to two behaviors, the drafted `## Acceptance criteria` holds one row per behavior and no row whose sole observable is a CI result, PR state, merge, or test-suite run, and no cut question is asked.
  in-scope
- [ ] `skills/shape-ticket/SKILL.md` and `skills/brainstorming/reference/ticket-acceptance.md` stay under 50,000 bytes and 2,000 lines, and a deterministic test in `scripts/brainstorming-contract.test.mjs` asserts the `| Workflow-stage proof |` row in both files' tables, the cut-question trigger naming shape-ticket's gate, and the `**Workflow-stage proof**` pair in `skills/shape-ticket/reference/examples.md`.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: workflow-stage-ac-rows
contract:
- create: git worktree add .worktrees/<name> -b <branch>
- destroy: git worktree remove .worktrees/<name> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (AGENTS.md Testing); node eval/run.mjs <target> <sample> for the samples named in Tests
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: eval/README.md
Rules: README.md
Rules: skills/forge-skill/SKILL.md
scope: AC 1, AC 2, AC 3, AC 4
design: owns every path in Design; observable outcomes are the four AC rows above

## Design

Every added or changed line follows `/skill:forge-skill` `## Authoring rules`: imperative voice, one observable branch at most, the rule stated in the sentence that owns it and linked from elsewhere, no history clauses, one example. shape-ticket's `SKILL.md` is 47,657 bytes before this change; the additions there are one table row, one precedence clause, and two word-level widenings of existing sentences (the no-AC trigger, the step 6 substantive-repair routing).

### D1 - shape-ticket owns the class

`skills/shape-ticket/SKILL.md`, the AC integrity gate table (`| Class | Definition | Outcome after failed recovery |`):

Add, as the sixth row after Post-deployment:

`| Workflow-stage proof | sole observable is a delivery-pipeline stage - a CI or workflow run result, a pull request's state or review, a merge, or a full verification-suite run - not a behavior of the change | **drop**; the row's text stays in the Reporter note as `retired workflow-stage proof: <row text>` |`

Replace, in the precedence sentence, `a clean condition that is merely prod-only relocates.` with `a clean condition that is merely prod-only relocates; one that is only a stage proof drops.`

Replace, in the deploy-window rule, `If relocation empties the AC list, that is the no-AC failure` with `If relocation or a stage-proof drop empties the AC list, that is the no-AC failure`; the recovery (`recover a real pre-prod AC or park the ticket`) is unchanged.

Replace, in the step 6 no-op check, `Any AC text, row, or group change from audit or uniqueness instead takes substantive full-replacement repair` with `Any AC text, row, or group change from audit, uniqueness, or the AC integrity gate (a drop or a relocation) instead takes substantive full-replacement repair`.

Keep the AC uniqueness rule and every other sentence unchanged. A bundled row needs no rule of its own: AC uniqueness already splits independent bundled observations into one row per observation before the class table runs and retains the split text in the Reporter note, so the stage half becomes its own row and drops under this class while the behavior half stays. The class test stays structural, as the table's lead sentence says: "`make ci` rejects a function of complexity 21" names a behavior and stays; "`make ci` is green on the PR head" names a stage and drops; "the tests pass" with no behavior named drops. The `retired workflow-stage proof:` label marks the note text as provenance of a dropped proof, not a requirement; D2 names it at brainstorming's ticket-handling boundary.

`skills/shape-ticket/reference/examples.md`, under `### Bad -> good AC examples`, add after the Unspecified-but-binding pair:

```markdown
**Workflow-stage proof**

- Bad: `- [ ] The importer rejects a row without an id and CI is green on the PR head`
- Good: `- [ ] The importer rejects a row without an id` (the CI result is the PR gate's observation, not an outcome)
```

### D2 - brainstorming names the class by reference, twice

`skills/brainstorming/reference/ticket-acceptance.md`:

The class is read, never restated. Add, after the `# Ticket Handling` paragraph's sentence `Extract ACs from the body only, never comments.`: `A Reporter note line marked `retired workflow-stage proof:` is provenance of a proof shape-ticket's AC integrity gate dropped, never a Design requirement; every other note requirement carries as above.` This is the only sentence touched in that paragraph; gatherer and the context-builder stay unchanged.

Replace, in the `**Cut question.**` paragraph, the sentence beginning `Ask it, in the questionary format, when the user's prompt or an answer raises dropping or changing a row, or when code, a cited contract, or the user shows a row is wrong or impossible:` through the clause `; B and C are never recommended` with: `Ask it, in the questionary format, on any trigger in the table below, with the options `A) in-scope - <reading> B) deviates: <why> C) deferred: <where> D) repair the ticket - /skill:shape-ticket <ref> <row and evidence>` and the table's `Recommendation:`; B and C are never recommended.` and insert the table directly after that paragraph (forge-skill's two-branch ceiling sends the third trigger to a table):

```markdown
| Trigger | Screened | Recommendation |
|---|---|---|
| The user's prompt or an answer raises dropping or changing a row | When raised | A or D with the reason the row ships in this gauntlet |
| Code, a cited contract, or the user shows a row is wrong or impossible | When shown | A or D with the reason the row ships in this gauntlet |
| An observation in a ticket row is a workflow-stage proof under `shape-ticket/SKILL.md` `## AC integrity gate` (read that table at first use; a read, never a `/skill:shape-ticket` invocation) - the row as a whole or a stage-only clause beside a behavior; a row whose CI or suite result is itself the behavior under change is not one | The draft's verbatim block at checklist step 4, before question one, after the framing check; pasted rows when they land at the gate. Ask as the first ordinary question - after the framing question when a concern exists, else after the holds-statement. Never edit or split the ticket row; the intact row goes to the question | D - a stage proof is not an outcome |
```

Add, to the spec-writing integrity table (`| Class | Recovery before writing |`), as the last row:

`| Workflow-stage proof | Before drafting, read `shape-ticket/SKILL.md` `## AC integrity gate` at first use and leave stage-only validation material (a suite command, a CI or workflow result, a PR state, a merge) out of the row set - it is proof, not an outcome, so no row is drafted and no scope decision is involved. For a row already drafted with that proof, keep its committed outcome and rewrite the proof to the Design behavior; delete the row only after its Design commitment is cut through the user's scope-decision procedure |`

Keep the four-option cut question, the `deviates:`/`deferred:` human-only rule, the verbatim-row rule, the D repair path (shape-ticket repair mode, re-fetch, re-extract, cancel returns to the question), the no-`none` rule, the "Preserve each committed outcome and rewrite its proof" lead-in, and every downstream consumer unchanged. The main loop's step 4 read of this file is the only load path; the read of shape-ticket's gate table rides in the table row and the class row above, so a fresh run, a restored session, and a redraw all reach the definition.

### D3 - deterministic test

`scripts/brainstorming-contract.test.mjs`, one new `test(...)`: `skills/shape-ticket/SKILL.md` has a line starting `| Workflow-stage proof |` whose text includes `drop` and `Reporter note`, and its deploy-window rule includes `relocation or a stage-proof drop empties the AC list`; `skills/brainstorming/reference/ticket-acceptance.md` has a line starting `| Workflow-stage proof |` and a cut-question trigger table row including `workflow-stage proof under `shape-ticket/SKILL.md` `## AC integrity gate`` and `D - a stage proof is not an outcome`; `skills/shape-ticket/reference/examples.md` includes `**Workflow-stage proof**`. The byte and line caps are already enforced by the instruction-size lint in `scripts/ci.mjs`.

### D4 - evals

Per `eval/README.md` and AGENTS.md "Change process", one sample per changed behavior, each `samples/<name>/case.md` + `expected.md` in the target's existing shape, `intent.md` of each target gaining this change's paragraph, run selectively with `node eval/run.mjs <target> <sample>`, results committed sample-scoped:

| Target | Sample | Must hold |
|---|---|---|
| `eval/shape-ticket` | `workflow-stage-proof` (repair mode, a two-ref batch: the first body per AC 1, the second body whose only AC is `- [ ] CI is green on the PR head`) | f1 the CI-green row is absent from the first drafted ACs; f2 the bundled row keeps "rejects a row without an id" and has no `make ci`; f3 the third row is byte-identical; f4 the Reporter note carries the dropped text under `retired workflow-stage proof:`; f5 no hard stop or park for the first ticket; f6 the second ticket reaches the no-AC recovery (recover a real pre-prod AC or park), never an empty AC list |
| `eval/brainstorming` | `workflow-stage-ticket-row` (draft per AC 2 plus a bundled row `- [ ] The importer rejects a row without an id and CI is green on the PR head`, a CI-as-product row `- [ ] make ci rejects a function of complexity 21`, and a Reporter note section holding `retired workflow-stage proof: CI is green on the PR head`; overrides `repo:` set, no contradiction elsewhere, no framing concern) | f1 the first ordinary question after the holds-statement is the cut question for the sole-stage CI row; f2 options A-D in order; f3 D names `/skill:shape-ticket <ref>`; f4 `Recommendation: D`; f5 the bundled row is also sent to the cut question intact, with D recommended, its text unedited and unsplit; f6 the CI-as-product row and the other behavior rows are not questioned; f7 the retired note line is not carried as a Design requirement |
| `eval/brainstorming` | `workflow-stage-drafted-row` (ticketless design per AC 3, where the draft states one behavior's proof as "npm test passes") | f1 no drafted row whose sole observable is CI, PR state, merge, or a suite run; f2 one row per committed behavior, including the behavior whose draft proof was the suite run - its row names the behavior, never the suite; f3 no cut question; f4 the full-suite command stays in `## Tests` |

`eval/brainstorming/target.json` and `eval/shape-ticket/target.json` stay unchanged (`eval/shape-ticket` already loads the gate slice `### 4 - Draft` through `## Roast`). The two brainstorming samples each open `case.md` with `bundle+: skills/shape-ticket/SKILL.md` so the replay assembly carries the owning table (`eval/lib/replay.mjs` `parseCase`: `bundle+` adds a whole file, no slice); after adding the line, run `node eval/run.mjs brainstorming <sample> --baseline-only` for each per `eval/README.md`. The denylist and word caps stay.

## Errors and edge cases

- A row that bundles a behavior with a stage: shape-ticket's AC uniqueness splits it in repair mode and the stage half drops (D1); brainstorming never edits or splits a ticket row, so the cut question's D sends the intact row to repair (D2).
- Dropping the only row of a ticket is the no-AC failure, whose trigger D1 widens to a stage-proof drop: recover a real pre-production AC or park.
- A repaired ticket re-fetched after D: the dropped text sits in the Reporter note under `retired workflow-stage proof:`; gather quotes the note as today and brainstorming's ticket-handling boundary (D2) never promotes that line into a Design obligation, while every other note requirement still carries.
- A drafted row whose proof is a suite run: its committed outcome stays and the proof is rewritten to the Design behavior (D2); the row is deleted only after the user cuts the commitment through the scope-decision procedure, and the section never becomes `none`.
- A framing concern exists: the framing question stays question one; the cut question for the stage row is the first ordinary question after it (D2).
- The human answers A on the cut question for a stage row: the row stays `in-scope`, the answer rides in `Human input` as today, nothing downstream changes.
- Ticket not fetched, rows pasted at the gate: pasted rows are ticket rows and get the same screen when they land; the cut question fires then. D still starts shape-ticket repair mode, whose first action reads the full ticket; when that read fails, shape-ticket's Mode routing reports the ref as unfetched and aborts the repair - treat that abort as the cancel: return to the cut question with the row unchanged and never report a repair.
- Repair cancelled at shape-ticket's gate: the question returns with the row unchanged (existing).
- `agents/spec-council-applier.md:43` lists the five integrity classes the applier may rewrite post-council. The new class applies at spec-writing and at the ticket gate, before any council, so that list stays at five and the persona is untouched; a drafted stage row that spec-writing misses reaches the user gate unflagged, and the `workflow-stage-drafted-row` sample is the guard.
- A verification command in `## Tests`, a leg's `verification:` line, or a plan header is not an acceptance row and is untouched by the class.

## Tests

- Shape-ticket drops a stage row, keeps a bundled behavior through the uniqueness split, and routes a sole-stage-row ticket to the no-AC recovery - `eval/shape-ticket/samples/workflow-stage-proof`
- Brainstorming screens ticket rows at step 4 and asks the cut question with D recommended for a sole-stage row and a bundled row as the first ordinary question; a CI-as-product row is not questioned; a retired note line is not a Design requirement - `eval/brainstorming/samples/workflow-stage-ticket-row`
- Brainstorming drafts no stage row from a design and keeps the committed outcome whose draft proof was the suite run - `eval/brainstorming/samples/workflow-stage-drafted-row`
- Table rows, widened no-AC trigger, trigger-table row, and example present; files under the size caps - `scripts/brainstorming-contract.test.mjs` (new test), `scripts/ci.mjs` instruction-size lint, both under `npm test`
- Integrity-gate drop takes the substantive repair path - none: covered by the step 6 sentence edit in D1; the conformance-only byte lock has no fixture
- Framing concern plus a stage row - none: the framing question's slot is existing behavior (`skills/brainstorming/SKILL.md` framing rule); the sample runs the holds-statement path
- Human answers A on the cut question - none: existing path, covered by `eval/brainstorming/samples/wrong-row-cut-question`
- Pasted rows at the gate and a failed repair read - none: the same trigger-table row and shape-ticket's existing unreadable-ref routing; no fixture renders the paste affordance today

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` `## Unreleased` entry (major procedures: the AC integrity gate gains a class)
- Derived / memory docs invalidated: none (README's "an AC integrity check" wording stays true; skill bodies are implementation surface)

## Out of scope

- A council finding class or applier permit for workflow-stage rows (declined at the questionary: all measured cases are ticket rows caught before the questionary).
- A new disposition token that keeps the row in the spec with downstream consumers skipping it.
- Changes to `gatherer.md`, the context-builder task, writing-plans, loop-implementation, the conformance reviewer, or gatekeep-pr.
- Repairing the three measured consumer tickets.

## Open questions

- none
