# Numbered approval menu at the spec gate

> **Superseded by:** [doc/specs/2026-10-04-resume-restores-amend-grant.md](./2026-10-04-resume-restores-amend-grant.md) - "Standing grants matcher and trailer" grant recording (the `Amend-grant:` trailer) only

**Goal:** the brainstorming spec gate ends with a two-item numbered menu - `1` approves, `2` approves and grants auto-apply amends - so the existing standing grant is a visible, one-sentence choice instead of a trailing offer in prose; grant semantics do not change.

Supersedes `doc/specs/2026-09-19-readable-amendment-gates.md`, "Grant offer and matcher" section only (the gate offer text and the literal accepted replies). Its funnel tiers, card fields, aftermath, and finish digest stay live.

## Problem

The standing grant that waives per-diff amendment review already exists (`skills/brainstorming/reference/amendment-surface.md` "Standing grants"), but the spec gate offers it as the last sentence of a paragraph that begins "Please review. Approve to proceed, tell me what to change ..." (`skills/brainstorming/reference/spec-finalization.md:113`). A user scanning for how to reply sees "approve" and misses that a second approval form exists, so flows that would tolerate silent spec fixes still stop at every amendment batch. The request as phrased described the grant as applying only to "small changes whose real alternative is a hard stop"; the source says the grant is broader - it also applies descopes and acceptance-criteria edits without review (`amendment-surface.md:7`, "scope changes included"), and only redraws stop. The user accepted the existing semantics; this spec changes visibility and reply grammar only.

## Human input

Original request, verbatim:

> brainstorming skill should end when accepting spec with menu options: 1. approve, 2. approve with auto-apply amends (for small spec changes which might be necessary during creating a plan or during impl) - its done only such ammedments which real alternative is to hard stop and not actually make core assumption contradicted. there is already such path available

Questionary answers that fixed scope:

> A, its about visibilty of the option. just opt 2 should describe in one sentence what will be auto approved allong the way

> A (two-item numbered menu plus prose for change requests and reverts, not a three-item all-digit menu)

## Acceptance criteria

none - no ticket

## Design

### Gate render

The closing paragraph of the User Review Gate template in `skills/brainstorming/reference/spec-finalization.md` is replaced by a numbered menu and one prose line:

```
1 - approve: proceed to planning under the existing amendment review; a fresh reviewer applies evidence-backed factual corrections on its own, and every other spec amendment (scope, acceptance-criteria, or contract edits, and redraws) stops for your review.
2 - approve, auto-apply amends: every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

Or tell me what to change in the spec, or say "revert applied council edit <X>" to undo a specific applied edit.
```

The option-2 sentence after the colon is the **grant description sentence**. It is one display sentence, used verbatim wherever the grant is offered, and it states the live Standing grants boundary in full: every amend-class change applies, including edits the prefilter would otherwise route to the human (scope, acceptance criteria, public contracts); redraws stop; the grant never satisfies the spec gate. The sentence uses parentheses, not dash-delimited asides, so it reads cleanly after the tier-2 footer's own ` - ` separator. Option 1 describes the default funnel truthfully: without a grant, reviewer-cleared factual corrections already apply with no human stop (`amendment-surface.md` section 3 rubric and section 5), so the delta option 2 buys is the prefilter, the reviewer, and the human batch for everything else. The template's lines above this paragraph (summary, commit line, council audit, predecessor candidates) are unchanged.

### Reply grammar

In `spec-finalization.md`, the "On approval" paragraph names the approval replies: `1`, `approve`, or equivalent prose approves without a grant; `2`, `approve, auto-apply amends`, or equivalent prose approves and grants. Both proceed immediately to `/skill:writing-plans` after reading Standing grants and recording any grant, as today. A reply that mixes approval with a change request ("2 but rename the section") is a change request: revise, re-present, and read the grant only from the reply to the re-presented gate.

### Standing grants matcher and trailer

In `amendment-surface.md` "Standing grants", the literal accepted-reply list gains the digit `2` at the spec gate (the matcher text reads: a bare `2` at the spec gate) and keeps `approve, auto-apply amends`; the "same intent in other words" clause stays, so a later prose grant after a `1` approval still counts. The same paragraph states that the digit grants only at the spec gate. Because the amendment loop loads only `amendment-surface.md` mid-flow, the tier-2 disambiguation lives there too: section 4's reply grammar gains the clause that a bare `2` without a colon is an invalid tier-2 reply (reprompt, as for any invalid choice) and never a grant. The trailer rule gains one clause: when the user replied with the digit, `Amend-grant:` quotes the grant description sentence, so the worktree history still shows a readable sentence rather than `2`. The per-batch commit body rule ("the granting sentence, quoted") inherits the same substitution.

### Tier-2 footer

The `Standing grant:` footer line in the section 4 template and the worked example (`amendment-surface.md`, two occurrences) becomes:

```
Standing grant: reply "auto-apply amends" - <grant description sentence>
```

unnumbered, because that menu's reply line already uses `1 | 2:`.

### Predecessor

`doc/specs/2026-09-19-readable-amendment-gates.md` gets a second supersession banner, appended below the existing one, scoped to "Grant offer and matcher" section only.

### Unchanged

Grant semantics, the amendment funnel (prefilter, reviewer, human batch), aftermath, `amend:` commit records, the finish digest, telemetry, settings keys, extensions, personas, and the fresh-session-resume rule (no grant carried) are untouched. No bin rebuild.

## Errors and edge cases

- `2` with no spec commit to amend cannot occur: the gate commits the spec unconditionally before rendering. If `git commit --amend --trailer` fails, stop and report; never proceed as granted without the trailer.
- Grant description sentence drifts between `spec-finalization.md` and `amendment-surface.md`: `npm test` fails on the token check (see Tests).
- Mixed approve-plus-change reply: handled as a change request (Reply grammar above).
- Fresh-session resume: starts with no grant, unchanged; the trailer is history, not state.

## Tests

`scripts/ci.mjs` token checks (the existing `[file, token, present]` table, which supports `false` for must-be-absent) gain:

- `skills/brainstorming/reference/spec-finalization.md` contains `2 - approve, auto-apply amends:` and the full grant description sentence; `Approve to proceed` is absent.
- `skills/brainstorming/reference/amendment-surface.md` contains the full grant description sentence, the text `2` at the spec gate (digit in a code span), and `without a colon is an invalid`.

One additional check (a dedicated block after the token loop, since `includes()` cannot count): the grant description sentence occurs exactly once in `spec-finalization.md` and exactly twice in `amendment-surface.md` (section 4 template and worked example), so a footer that keeps or acquires different wording fails even when the other footer matches.

- `scripts/brainstorming-contract.test.mjs` existing markers (`scope changes included`, `Amend-grant:`, and the writing-plans handoff marker `proceed immediately to`) must still pass; no test is deleted.
- Verification command: `npm test`.
- Skill edits follow `/skill:forge-skill` authoring rules and the repo's allowlisted generic-skill check (`rg -ni "jjuraszek|/Users/[^/]+" skills/ | rg -v "github.com/jjuraszek/pi-cohort"`, zero matches).

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` - `## Unreleased` entry naming the numbered gate menu and the `2` reply (major procedures category)
- Derived / memory docs invalidated: none - `README.md`, `doc/configuration.md`, and `doc/personas.md` do not describe the gate's reply text (`rg` for `auto-apply`, `Amend-grant`, `spec gate`; `doc/personas.md:10` describes amendment-review mode, which is unchanged)

Materiality bar: `reference/documentation-impact.md`. Skill reference files are implementation surface and ship in the plan's file list.

## Out of scope

- Narrowing the grant to evidence-backed, non-human-owned amends (option B in the questionary) or auto-accepting reviewer recommendations (option C).
- Recording the grant outside git (telemetry, tracker state) or carrying it across a fresh-session resume.
- A three-item all-digit menu with a numbered change-request option.

## Open questions

none
