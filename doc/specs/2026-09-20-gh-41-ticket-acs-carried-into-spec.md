# Ticket acceptance criteria carried verbatim into the spec

> **Superseded by:** [doc/specs/2026-10-09-ac-coverage-dispositions.md](./2026-10-09-ac-coverage-dispositions.md) - the AC extraction rule and the disposition ask rule only

**Ticket:** jjuraszek/pi-gauntlet#41
**Date:** 2026-09-20
**Status:** draft, awaiting review

**Goal:** When a gauntlet run starts from a ticket that states acceptance criteria, the spec carries those criteria verbatim with one disposition each, the conformance reviewer checks the in-scope ones as requirements without re-fetching the ticket, and the PR body tells the reader which ones wait for a deploy venue. Runs without a ticket, or with a ticket that states no criteria, behave exactly as today apart from one fixed `none - <reason>` line in the spec.

## Problem

Brainstorming's Ticket Handling is one sentence ("A ticket is guidance, not sole truth. Fetch it; propose scope, approach, or acceptance changes when code disagrees, and record deviations in the spec.") and never asks for the ticket's acceptance criteria to be captured. The conformance reviewer's source-of-truth table reads the ticket only as "Fallback only, when no spec exists" (`agents/conformance-reviewer.md:23-29`, `skills/verification-before-completion/reference/conformance-check.md:55-63`), so once a spec exists the ticket's explicit contract is checked only if the spec author happened to restate it. The finish skill's PR body has only `## Summary` and `## Test Plan` (`skills/finishing-a-development-branch/SKILL.md:223-230`), so a criterion that can only be observed after deploy has no place to be named for the reader who closes the ticket.

Premises checked during brainstorming: the gap above is real (source cited). The issue's opener "a gauntlet run starts from an issue" is not a workflow invariant - `skills/brainstorming/gatherer.md` dispatches the context-builder only when the prompt carries a ref - so the design is conditional on a ticket existing. `writing-plans` already turns spec acceptance criteria into `## Spec coverage` rows (`skills/writing-plans/reference/plan-contract.md:42-71`), but its waiver rule forbids waiving a requirement whose text carries an inline code span (`skills/writing-plans/SKILL.md:234,263`; `extensions/lib/plan-check.ts` `waiver-literal`), and verbatim ticket ACs almost always do - so the plan skill needs one sentence. `/skill:check-delivery` already verifies per-AC behaviour on a deploy target and needs no change. The spec council is already AC-aware: `agents/spec-council-member.md:34` flags a ticket AC the spec does not inline as an `external-ref` gap, and `skills/roasting-the-spec/SKILL.md:68,75` forwards a "ticket AC snapshot" in the `Human input` block. 20 of 75 existing specs already carry a `## Acceptance criteria` heading (10 exact, the rest with a parenthetical such as `(from #37)`), none with disposition lines.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#41, `## Acceptance Criteria` heading, rows verbatim:

- [ ] `skills/brainstorming/SKILL.md` § Ticket Handling states: an issue "has ACs" when its body contains a heading matching `/acceptance criteria/i` or a `- [ ]` / `- [x]` list; when it does, the spec carries an `## Acceptance criteria` section with one `- [ ]` row per issue AC quoted verbatim and exactly one disposition per row from `in-scope`, `deviates: <why>`, `deferred: <ref>`, `venue: <name> - <observation>`; when there is no issue, or the issue has no ACs, the section is omitted and no other spec section changes.
  deviates: extraction is heading-scoped when an AC heading exists (a checkbox list elsewhere in such a body is never an AC, so shape-ticket's `Post-deployment housekeeping` list stays out); the checkbox-list detector applies only to bodies with no AC heading. The section is always present, with a literal `none - <reason>` line when empty, so "checked and empty" is distinguishable from "forgotten". The row format and four dispositions are adopted as written.
- [ ] `agents/conformance-reviewer.md` states: when the spec carries `## Acceptance criteria`, each `in-scope` and `venue:` row yields one `Rn` whose `origin` is `spec "Acceptance criteria" - "<AC verbatim>"`; `deviates:` and `deferred:` rows are listed under `Origin drift` as `recorded in spec? yes` and yield no `Rn`; the reviewer re-fetches the issue to diff its AC list against the section and lists each AC absent from the section or reworded since under `Origin drift` as `recorded in spec? no` (the existing rule "any unrecorded origin drift -> GAPS" is left unchanged and referenced); a `venue:` row's verdict line carries the venue and observation text; source-of-truth row 3 is reworded so the re-fetch-for-diff is distinguished from the still-forbidden re-fetch-as-source-of-truth.
  deviates: when a spec exists the reviewer does not fetch the ticket, so there is no live-diff `recorded in spec? no` path and source-of-truth row 3 is unchanged; omitted or reworded ACs are caught one gate earlier by the spec council, which compares the raw ticket rows against the section. The `Rn`/origin form, the `recorded in spec? yes` listing for `deviates:`/`deferred:` rows, and the venue text on the verdict line are adopted as written.
- [ ] `skills/verification-before-completion/reference/conformance-check.md` lists the spec's `## Acceptance criteria` section among the origin inputs handed to the reviewer, and `skills/finishing-a-development-branch/SKILL.md` renders each `venue:` row's venue and observation text in the PR body's carried-open items.
  in-scope (the PR body block also lists `deferred:` rows; the PR body has no carried-open list today, so the block is introduced, not extended).
- [ ] A fixture directory is added to the repo holding an issue body with three `- [ ]` ACs, a spec whose `## Acceptance criteria` quotes two of them as `in-scope`, and a diff satisfying those two. The PR for this issue attaches one conformance-reviewer report produced on that fixture whose `Origin drift` block contains a `recorded in spec? no` line quoting the third AC verbatim and whose verdict is `GAPS`; and one report on the same fixture with all three ACs quoted, the third tagged `venue: staging - <observation>` and its enabling code present, whose verdict is `CONFORMS` and whose venue row's verdict line contains `staging`.
  deviates: the `recorded in spec? no` report cannot exist without a reviewer re-fetch (row 2). No fixture directory is added; the evidence is the token checks in `scripts/ci.mjs` plus the conformance-reviewer report produced on this worktree, whose spec carries this very section (see Verification).
- [ ] `npm test` passes (skill/agent lint covers the four edited files).
  in-scope (eight files are edited; lint covers the skills and agents, token checks cover each added contract line).

## Design

Every edit is an added sentence, table row, or template line in the file's existing imperative register. No existing line changes meaning; the reviewer's source order (spec, then original prompt, then ticket only when no spec exists) is untouched. Dispositions record decisions, not obligations: an `in-scope` row is a requirement as written; a `venue:` row's enabling change, and any part of a row a `deviates:` reason adopts, is stated as a Design clause; disposition reasons themselves are never normative for the plan or the reviewer.

### Gather - preserve the raw rows

`skills/brainstorming/gatherer.md` context-builder task template adds one clause: quote the ticket's acceptance-criteria rows verbatim, under their own heading, before distilling the rest. The draft thereby carries the raw rows that brainstorming copies into the section and pastes into the council's `Human input` block.

### Brainstorming - create the contract

`skills/brainstorming/SKILL.md` § Ticket Handling keeps its sentence and adds the contract:

- Extraction rule. When the ticket body has a heading matching `/acceptance criteria/i`, every list item under it until the next heading is an AC (numbered, bullet, or checkbox - shape-ticket normalises these to `- [ ]`; hand-written tickets may not) and no other list in the body is. When there is no such heading, every top-level checkbox row in the body is an AC, except rows under a `Post-deployment housekeeping`, `Out of scope`, or `Follow-up` heading. Otherwise the ticket has no ACs. A nested list under an AC row rides with its parent as one row. Checked and unchecked rows are carried alike, all written `- [ ]`.
- Section template, required in every spec, placed after `## Problem`. The heading `## Acceptance criteria` names the ticket contract only; the spec's own requirements stay in Design and never get a second section under this name.

  ```markdown
  ## Acceptance criteria

  Ticket <ref>, <heading or "checkbox list">, rows verbatim:

  - [ ] <row text copied verbatim>
    <disposition>
  ```

  Disposition is exactly one of `in-scope`, `deviates: <why>`, `deferred: <where>`, `venue: <env> - <observation>`. Default is `in-scope`. The row text is never edited; a wrongly stated row is `deviates: <why>`, an ambiguous row stays `in-scope` with the chosen reading written as a Design clause. A `venue:` row's enabling change is named in Design. A disposition can change at any later phase - a reviewer finding `recommended: rescope` at the finish gate, or a wrong row noticed mid-implementation - through the amend path; the row text still never changes.
- No ticket, or ticket without ACs: the section body is the single line `none - no ticket`, `none - ticket has no acceptance criteria`, or `none - ticket not fetched (<reason>)` (context-builder degraded). Brainstorming never authors acceptance criteria on the ticket's behalf; that is `/skill:shape-ticket`'s job.
- Deferral rule. A row is `deferred:` only when the shipped change operates without it. Cost is never a reason to defer; a hard but direct AC stays `in-scope` and ships.
- `deviates:` and `deferred:` are scope decisions: ask them in the questionary and name them in the gate summary. `venue:` is a fact about where the observation can happen, not a scope decision.
- Implied requirements in the ticket body (Context, Problem, Idea) keep landing in the spec body as today; the section carries the ticket's explicit contract only.

§ Spec Self-Review inline lint adds one bullet, **Ticket contract present**: the `## Acceptance criteria` section exists with either rows or a `none - <reason>` line. Presence is enforced here, at authoring, and nowhere later - specs approved before this change are never penalised.

§ Spec Council: the `Human input` block's "ticket AC snapshot" is the raw row text from the gather draft, never the spec section (the section holds the author's dispositions, which the council must be free to critique).

### Spec council - guard the contract

`agents/spec-council-member.md` adds to the logical-gaps check: compare the `Human input` ticket AC rows against the spec's `## Acceptance criteria`; a row absent or reworded is `external-ref`; a `deferred:` row whose reason fails the operates-without-it test (the change needs it to operate) is `scope`. A `deviates:` row is judged as any other design decision. `skills/roasting-the-spec/SKILL.md` is not edited.

### Conformance reviewer - check the contract

`agents/conformance-reviewer.md` adds, next to the extraction rules: when the spec has a heading starting `## Acceptance criteria`, that section is an origin alongside the spec body. Each `in-scope` row yields one `Rn` with `origin: spec "Acceptance criteria" - "<AC verbatim>"`; a row with no disposition line is `in-scope`. Each `venue:` row yields one `Rn` that is `DELIVERED` when the Design clauses naming its enabling change are `DELIVERED`, with the venue and observation text on the verdict line; the observation itself is never a finding; a `venue:` row no Design clause names is `MISSING`, `recommended: rescope`. `deviates:` and `deferred:` rows are listed under `Origin drift` as `recorded in spec? yes` and yield no `Rn`. A disposition word outside the four is `DRIFTED`, `recommended: fix` (correct the word). A spec without the section is read as today - spec body and prompt only.

`skills/verification-before-completion/reference/conformance-check.md` § Source of truth adds one row beside "The written spec": the spec's `## Acceptance criteria` section, with the same priority, read per the reviewer persona.

### Plan - disposition-aware coverage

`skills/writing-plans/SKILL.md` § Spec Coverage Table adds one sentence: from the spec's `## Acceptance criteria`, table only `in-scope` and `venue:` rows (a `venue:` row's owner is the task delivering its named enabling change); `deviates:`, `deferred:`, and `none` rows get no table row - their disposition is the record, and any obligation a `deviates:` reason adopts is already a Design clause with its own row.

### Finish - surface what waits for deploy

`skills/finishing-a-development-branch/SKILL.md` Option 2 PR body: when the spec has at least one `venue:` or `deferred:` row, add a `## Acceptance criteria` block after `## Test Plan` listing those rows verbatim with their disposition, so the reader knows what `/skill:check-delivery` verifies after deploy and what a follow-up owns. With no such rows the PR body is byte-identical to today. Option 1's squash commit message is unchanged.

## Edge cases

- Ticket fetched but unreadable: section reads `none - ticket not fetched (<reason>)`; the gate summary shows it so the user can paste the ACs, which then become rows.
- AC heading with prose and no list items: each paragraph is one row.
- Ticket body has both an AC heading and checkbox lists elsewhere: only the heading's items count.
- Ticket edited after the spec was approved: the spec is the baseline; re-fetching is an amend the user asks for, never automatic.
- Disposition changed after approval: amend (inside one component), via `reference/amendment-surface.md`.
- Legacy spec with a `## Acceptance criteria (from #N)` heading and no disposition lines: prefix match, every row `in-scope` - the same reading a reviewer gives those specs' rows today.

## Non-regression

- No-ticket runs: one `none - no ticket` line in the spec; nothing else changes.
- Existing spec-only conformance: the reviewer's source order and every current rule are unchanged; the section is an additional origin; a spec without it is read as today.
- PR bodies for specs without `venue:`/`deferred:` rows are unchanged.
- No new tool, settings key, parser, or bin; nothing under `extensions/` or `src/` changes.

## Verification

- `npm test` passes, including one present-token row per edited contract in `scripts/ci.mjs` `tokenChecks` (repo convention for prose-only skill/agent changes), e.g. `["skills/brainstorming/SKILL.md", "## Acceptance criteria", true]`, `["agents/conformance-reviewer.md", "recorded in spec? yes", true]`, `["skills/finishing-a-development-branch/SKILL.md", "## Acceptance criteria", true]`, `["skills/writing-plans/SKILL.md", "deviates:", true]`, `["agents/spec-council-member.md", "deferred:", true]`, `["skills/brainstorming/gatherer.md", "verbatim", true]`.
- `rg -ni "jjuraszek|/Users/[^/]+" skills/ | rg -v "github.com/jjuraszek/pi-cohort"` returns nothing.
- Before the verify phase, `npm run link-agents` from this worktree so the dispatched `conformance-reviewer` is the edited persona (the profile's agents symlink to whichever checkout last linked). Its report then reads this spec's `## Acceptance criteria`, yields `Rn` rows for the two `in-scope` rows, lists the three `deviates:` rows under `Origin drift` as `recorded in spec? yes`, and the finish PR body carries no `## Acceptance criteria` block (no `venue:`/`deferred:` rows). The `venue:` path is first exercised by the next ticketed run that carries one; `/skill:check-delivery` verifies it after deploy.

## Out of scope

- Repairing badly written ACs (`/skill:shape-ticket`).
- Reviewer re-fetching the ticket or any live-ticket diff.
- A `plan_check` rule over the section.
- A fixture directory or automated reviewer replay.
- #25's spec-to-code controls (plan coverage owners, SR conditions, CR loop routing).

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` workflow overview (one sentence: specs carry ticket ACs verbatim with dispositions, conformance checks them, `/skill:check-delivery` verifies `venue:` rows after deploy); `CHANGELOG.md` `## Unreleased` entry
- Derived / memory docs invalidated: none

## Open questions

None.
