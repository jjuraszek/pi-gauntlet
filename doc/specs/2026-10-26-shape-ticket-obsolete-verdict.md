# shape-ticket: obsolete verdict, gated close row, recommended menu row

**Goal:** In repair mode, `/skill:shape-ticket` judges from its own repo audit and one-hop gather whether a ticket should still stand, renders a gated close row only when it should not, and tags exactly one row `[recommended]` in every step 8 menu that has a selectable option.
**Amend-grant:** none
**Predecessor:** none superseded; extends `doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md` (fold table and gate section of `repo-audit.md`, verb table of `tracker-ladder.md`); `doc/specs/2026-10-11-gh-60-ticket-overlap-prevention.md` owns create-mode overlap and is untouched

## Problem

Repair mode already gathers the evidence that a ticket is dead and spends it on the wrong outcome. The scout brief in `skills/shape-ticket/reference/repo-audit.md` emits `Claims: <claim> - contradicted: <fact, path:line>`, `In-motion: <PR ref>`, and `Scenario: ... observation: <current behavior>`; the fold table turns a contradicted fact into a `premise: <old> -> <new>` rewrite of the Problem and leaves a contradicted reporter observation as a report line. A ticket whose premise is wrong, whose bug no longer reproduces, whose fix is already merged, or that duplicates a linked ticket therefore gets a polished body instead of a verdict, and a conforming dead ticket exits at step 6 as "conforms, no changes proposed". Mode routing (`SKILL.md:47`) puts status transitions out of scope and `tracker-ladder.md` maps no close verb, so there is no path from that evidence to the human decision "this ticket should not stay".

The step 8 gate also carries no recommendation: it says "Number the options" (`SKILL.md:140`) while every other menu-bearing skill in this repo marks one - gatekeep-pr and chase-bug tag one row `[recommended]`, finishing-a-development-branch and brainstorming render a `Recommended:` / `Recommendation:` line.

Constraints: `SKILL.md` is 46,139 bytes against the 50,000-byte lint (`scripts/skill-size-lint.mjs:22`), so new text lives in reference files; the one-gate hard constraint and the repo's "gated writes to human channels" rule stay as they are; the verdict is the parent's reasoning, never the scout's; close, terminal state, and duplicate are the human's pick. Framing: kept.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] A repair gate for a ticket whose audit evidence shows it should not stand renders `Audit: obsolete: <reason> (<citation>)` above Title and, unless the ticket is stopped or its re-fetched state is already terminal, a numbered close row showing the resolved tracker operation sequence and the closing evidence; a ticket without that audit line renders no close row.
  in-scope
- [ ] Every step 8 menu with a selectable option, in create and repair, carries exactly one `[recommended]` tag: on the close row when it is rendered, otherwise on the approve row, or on the alternative the overlap reference's `Recommended option` table names; a stopped ticket's report carries none.
  in-scope
- [ ] Picking a close row that carries a command runs the displayed operations in order with the `Audit: obsolete:` line as the closing evidence and ends that ticket's line as `<ref>: closed`; a failed operation ends it as `<ref>: close failed (<operation>: <reason>)`; a run-by-hand close row ends it as `<ref>: close by hand` and writes nothing; no other pick changes the ticket's state.
  in-scope
- [ ] With no overrides file, GitHub tickets close through `gh issue close` and Linear tickets through `linearis issues discuss` then `linearis issues update --status`, each with the reason mapped from the verdict; a `- close: <command>` line under `## Issue tracker` replaces the operations, and section prose that forbids the mapped state makes the row print the operations and write nothing.
  in-scope
- [ ] A conforming body whose audit carries an obsolete line reaches the gate with the close row instead of the step 6 no-op report.
  in-scope

## Design

### Verdict (parent judgment, `reference/repo-audit.md`)

The fold table gains one row. Before Draft, after reading a ticket's `audit.md`, the parent weighs the six existing labels together with the repair gather's one-hop linked PRs and tickets (`SKILL.md` step 2) and emits `Audit: obsolete: <reason> (<citation>)` when the ticket should not stand. The reason takes one of four shapes, matched first to last; when more than one holds, the first confirmed shape wins, so a verified load-bearing premise contradiction takes precedence over not reproduced:

| Shape | Evidence it rests on |
|---|---|
| `fixed by <pr>` | a one-hop linked PR, or an `In-motion:` ref, that the parent itself confirms merged and whose diff covers every AC row |
| `premise contradicted: <fact>` | `Claims:` contradicts the Problem's load-bearing fact - the one the ticket's failure depends on, not a side sentence |
| `not reproduced: <scenario>` | `Scenario:` observation equals the ticket's expected result |
| `duplicate of <ref>` | a one-hop linked ticket whose body the parent reads and that describes the same failure (same setup, action, and expected result) |

The parent reads the PR state and diff and the linked ticket body itself; `tracker-ladder.md` names those reads beside the close verb (GitHub `gh pr view <n> --json state,mergedAt` and `gh pr diff <n>`; Linear through `/skill:linear`'s read verb and the linked PR's host). The existing `In-motion:` search returns open PRs only (`gh pr list` defaults to `--state open`), so a merged PR reaches the verdict through the gather, never through a new scout search. The row's rule: open every cited location yourself before writing the line; a citation you could not confirm yields no verdict, and no shape is emitted without confirmed evidence. The scout brief, its six labels, and the all-six acceptance check are unchanged. The obsolete line does not stop the pipeline: draft, step 5 gates, roast, and the body diff run as today, so a declined close falls back to the ordinary repair diff in the same turn. The obsolete row's "Draft effect" column marks it draft-changing, so step 6 and the routing paragraph treat it as non-conforming and the ticket reaches the gate.

### Menu template (`reference/repo-audit.md`, "Complete the batch and present gates")

That section becomes the gate menu template for repair. Rows, numbered under `menu-layout.md`: approve the exact diff; revise; decline; and `Close as <reason> - <resolved operation sequence>` with the closing evidence (the `Audit: obsolete:` line verbatim, with its citations) shown once beneath the row, rendered only when eligible. Eligibility is decided before the tag: a stopped ticket renders no close row (no approval option exists); a ticket whose snapshot state is terminal renders no close row; `audit unavailable` yields no verdict and no row; otherwise an obsolete line renders the row. Then exactly one rendered row is tagged `[recommended]`: the close row when rendered, else the approve row, and a stopped ticket's report carries no tag. The closing evidence is never merged into the Reporter note. A `duplicate` verdict renders the tracker's duplicate operation only when `<ref>` is one the tracker accepts (a number or URL for `gh`, `ABC-123` for Linear); otherwise the reason falls to the not-planned/Canceled mapping and the evidence names the ref.

Selecting the close row is the single authorization for exactly the displayed operation sequence and evidence; it writes no body. Revise may change the terminal reason or the duplicate target within the reason map, and the row re-renders with the resolved operations before any selection. Override prose that leaves ordinary status changes ungated ("announced, not gated") does not waive this row's gate.

`SKILL.md` edits, each one clause or sentence, measured with `wc -c` after the edit and kept under 50,000 bytes (budget: 3,861 bytes): the Quick reference "Ordinary repair already conforms" row and the Edge cases "Ordinary conforming repair -> early no-op" line gain "unless the audit carries an obsolete line"; the hard constraint gains "or, for the close row, the displayed operation sequence and evidence" beside the exact diff; the mode-routing out-of-scope line gains "except the close row the step 8 template renders"; step 6's audit-findings sentence gains the obsolete line as non-conforming; step 8 gains "Render the options from the gate menu template in `reference/repo-audit.md`, including its `[recommended]` tag; in create mode tag the approve row, or the alternative the overlap reference's `Recommended option` table names, with the same tag"; step 9's re-fetch sentence gains "including state, before a close"; the end-of-batch line in step 8 and the identical line at the end of `repo-audit.md` both become `<ref>: written | closed | close failed (<operation>: <reason>) | close by hand | declined | stopped | no-op | unfetched`. `repo-audit.md`'s routing paragraph ("Keep conforming tickets with only quiet findings ...") gains the obsolete line as the one audit finding that reaches the gate on a conforming body.

### Close verb (`reference/tracker-ladder.md`)

The default verb table gains a `close` row with the reason map fixed -> `completed` / `Done`, premise contradicted and not reproduced -> `not planned` / `Canceled`, duplicate -> `duplicate` / `Duplicate`, plus the parent-owned PR reads named under Verdict:

| Tracker | Default operation sequence |
|---|---|
| GitHub | `gh issue close <n> --reason "<reason>" [--duplicate-of <ref>] --comment "<evidence>"` (one command; reasons verified in `gh issue close --help`) |
| Linear | `linearis issues discuss <id> --body "<evidence>"` then `linearis issues update <id> --status <Done|Canceled|Duplicate> [--duplicate-of <ref>]` (`/skill:linear` "Discuss" and "Update" rows); the default team workflow ships those three state names, and a team that renamed them overrides |

The evidence lands before the transition so a failed second operation never leaves a closed ticket without its evidence; on any non-zero exit the sequence stops and the report names which operation succeeded. The GitHub read verb gains `state` in its `--json` field list; for Linear the `issues read` output's state and its workflow type supply the same input, with a `completed` or `canceled` type treated as terminal. The ladder's "never hardcoded in this skill" sentence gains one carve-out: the close row's zero-config state names, which an override replaces; no other verb hardcodes a state.

A `- close: <command>` line under `## Issue tracker` replaces the operation sequence, like the existing `read:` / `update:` lines in the README example. Section prose governs the row: when it forbids the mapped state (a "humans only set Done" rule), the row renders `Close as <reason> - run by hand: <operations>` and a pick writes nothing; the tag still lands on it. No new overrides key and no `piGauntlet.*` setting.

### Data flow

Repair gather dispatches the scout as today -> fold-in judges obsolete from the audit and the one-hop gather and emits the audit line -> draft, gates, roast unchanged -> the gate renders the template with the conditional close row and the tag -> picking close re-fetches the ticket including state (step 9): an already-terminal state ends the ticket as `<ref>: no-op (already closed)`; a changed body or evidence snapshot loops back to step 8 with the delta and needs a renewed pick; otherwise the displayed operations run in order under the same single gate -> step 9 completes for that ticket and the batch continues.

## Errors and edge cases

- Close operation non-zero exit: stop the sequence, report its output verbatim and which operation succeeded, end the ticket as `<ref>: close failed (<operation>: <reason>)`, no retry, no fallback body write - the gate was consumed; the batch continues with the next ticket.
- Stopped ticket (surviving wishful or tautological AC) with an obsolete line: the hard stop is unchanged; the report shows the `Audit: obsolete:` line, no close row, and no tag, so the human closes by hand.
- Obsolete line on a ticket whose body also changes: approve writes the body as today and closes nothing; close closes and writes no body. The two picks are mutually exclusive rows.
- Run-by-hand close row picked: nothing runs; the ticket ends as `<ref>: close by hand`, never `closed`.
- Headless run: stops at the gate as today; nothing new.
- Create mode: no verdict and no close row; its overlap alternatives already own "do not file this"; its menus gain only the tag.

## Tests

- `eval/shape-ticket/samples/obsolete-premise-contradicted/`: repair of a synthetic GitHub ticket whose audit has `Claims: ... contradicted: <fact, path:line>` on the Problem's load-bearing fact and a `Scenario:` observation equal to the expected result; `case.md` inlines the cited source text as already-opened evidence, since replay disables tools. Must hold (in `expected.md`): an `Audit: obsolete: premise contradicted:` line with a citation; a close row carrying `gh issue close`, `--reason "not planned"`, and `--comment`; that row alone tagged `[recommended]`; the body diff still rendered.
- `eval/shape-ticket/samples/quiet-audit-no-close-row/`: repair of a body with one conformance defect (a missing `source:` footer) and quiet audit findings only, so it reaches the gate. Must hold (in `expected.md`): no emitted `Audit: obsolete:` line; no close row; the approve row tagged `[recommended]`.
- Both samples open `case.md` with `bundle+: skills/shape-ticket/reference/tracker-ladder.md`; `target.json` is unchanged; `intent.md` records the verdict, close-row, and tag behavior change. `node eval/run.mjs shape-ticket` runs the full target before finish.
- `npm test`: instruction-size lint keeps `SKILL.md` under 50,000 bytes; eval structural lint and hygiene scan pass; `rg -ni "jjuraszek|/Users/[^/]+" skills/` stays at zero matches.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` `## Issue tracker` overrides section - the `close:` verb, its GitHub and Linear defaults, the reason map, and that the close row stays behind shape-ticket's gate even where override prose leaves ordinary status changes ungated (operations / tunable parameters: a customer needs the default and when to override without reading the ladder); `CHANGELOG.md` `## Unreleased` entry
- Derived / memory docs invalidated: none (the `AGENTS.md` "Ticket convention" sentence is shared-core text owned by `AGENTS.core.md` and checked for byte equality; the close-gate clarification lives in the README entry above)

Materiality bar: `reference/documentation-impact.md`. Skill and reference files are the deliverable, tracked in the plan.

## Out of scope

- A seventh scout label or any change to the scout brief.
- Obsolete verdicts and close rows in create mode.
- Reopen, status changes other than the terminal close, and a standalone "does this ticket still stand?" verb.
- Extracting step 8's whole menu into a new reference file; revisit only if adding the pointer sentence proves to need a rewrite of step 8's prose.
- A change to `AGENTS.core.md` or its sibling copies.

## Open questions

None.
