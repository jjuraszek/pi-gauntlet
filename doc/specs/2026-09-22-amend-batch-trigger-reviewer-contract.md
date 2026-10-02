# Amend batch card: trigger, reviewer objection, contract shift

> **Superseded by:** [doc/specs/2026-10-02-amendment-aftermath-tracker-drift.md](./2026-10-02-amendment-aftermath-tracker-drift.md) - `restarts implement, then verify` phase consequence only

**Goal:** Make the spec-amendment human batch informative without opening the spec: the header names what raised the batch and what applying does to the run, each item carries the reviewer's verdict verbatim, and `Impact:` states the approved-contract shift in plain words instead of a plan-task list.

Supersedes `doc/specs/2026-09-19-readable-amendment-gates.md` § Tier-2 render (human batch), card fields only; every other section of that spec stands.

## Problem

The card rendered by `skills/brainstorming/reference/amendment-surface.md` § 4 (lines 71-85) carries `what`, `why`, `Example`, `Impact` (plan tasks), `Recommended`, `Alternatives`. It has no line for the batch trigger, none for the reviewer's `escalate` reason (already collected in § 3 and stored in the § 5 commit body), and no plain-words statement of how the approved design changes; the spec `old -> new` sits under `Details`, below the fold, as raw text.

Consumer run E-3177 (2026-09-20, pi-gauntlet 5.16.1): a verify-phase code review returned `FIX_FIRST` F1-F3; the orchestrator drafted three design-adding items; the reviewer escalated all three ("not a factual correction but a new behavior ... changes Remove's exclusivity and the AC semantics"; "introduces unasked numeric limits ... on a payload the AC requires to be complete"). The human saw `Impact: Task 2 (model + spec) reopened` and `Recommended: accept (Remove stays available; this just closes the gap ...)`, no trigger, no objection, and replied `apply all recommended` in 53 s. Same shape in E-3183. The reviewer step works; the render hides its result, so the gate is theatre. The consumer repo's overrides and AGENTS.md say nothing about amendments - the defect is in this template.

## Human input (verbatim; off-limits for over-spec)

```
we have still problem with execution phase which gives vague sign-off request for changed spec in the middle of the run. explain how its possible in context of recent changes allowing mechanical spec changes? is this ../gridstrong instruction problem or pi-gauntlet is not clear about it? the problem is both that those gate are only theatre and doesn't explain what is changed with context of entire change not only task. Human need to read entire spec to understand the problem.
we need to make changes in verbatim minimal and following the convention. imperative lang is a must
Q1 trigger placement: A (header clause). Q2 reviewer line: A (verbatim reason line above Recommended); be minimal in skill wording change and follow the convention. keep it lean for smaller model is a key. Q3 Impact repurposed to spec-level shift: A. Q4 finish-gate mirror Reviewer + Impact only: A.
```

## Acceptance criteria

none - no ticket

## Design

### Card grammar (`amendment-surface.md` § 4)

Header line:

```
Spec amendments: <N> need your call - from <trigger>; applying as recommended <reopens | adds | removes> <task ids | no tasks>; <phase consequence | no phase change>.
```

- `<trigger>` is the step the main loop is running when the batch forms, in plain words: `the spec review`, `planning Task <n>`, `Task <n> BLOCKED`, `the verify-phase code review (FIX_FIRST <ids>)`, `the finish-gate council-edit revert`, `the <phase> phase` when none of these fits, `your request` only when the user raised the amend in prose.
- The plan clause is the § 5 aftermath computed before the reply over reviewer-cleared items plus rendered items as `recommended` would land; any subset of `reopens <ids>`, `adds <n> task(s)`, `removes <ids>`, `,`-joined. `<phase consequence>` is `restarts implement, then verify` when the reopen happens in `verify`/`ship`. Compute it by reading the plan file and tracker state; call no `plan_tracker`/`phase_tracker` before the reply. A `2:` reply can change the outcome; § 5 recomputes from the actual reply as today.

Item bullet:

```
* <handle> - <title>: <what>. <why>.
  Example: <before -> after>
  Reviewer: <one-line reason verbatim | not reviewed - <prefilter rule> | reviewer unavailable: <reason>>
  Impact: <spec section>: <approved contract> -> <new contract>; ...
  Recommended: <accept | alt-n> (<one-clause why>).
  Alternatives: alt-1 <one line>; alt-2 <one line>
```

- `Reviewer:` quotes the `<one-line reason>` half of the § 3 reply exactly; the `probed:` half stays in the commit body. A § 2 prefiltered item carries `not reviewed - <the rule that prefiltered it>`.
- `Impact:` restates the design-contract shift in the reader's words, never quoted spec text; one clause per touched decision, `;`-separated; `(none) -> <new>` for an addition, `<old> -> (removed)` for a removal. Its source is the item's `location` field. It no longer lists plan tasks (the header does). `Details` keeps the verbatim `old -> new`.

Nothing else in § 4 changes: reply grammar, standing-grant line, `Details` block, "Take no action before the reply".

### Feeding steps

- § 1 item schema: unchanged; § 4's `Impact:` bullet names `location` as its source.
- § 3: one clause - on reviewer failure each affected item's `Reviewer:` line carries `reviewer unavailable: <reason>` (replaces the batch-menu placement).
- § 5: unchanged grammar; the plan aftermath rule runs once before render (header) and once after the reply (apply). `amended the spec:` lines unchanged.
- Standing grant path: unchanged - the card never renders under a grant.
- § Conformance entry step 4: field list gains `Reviewer:` and `Impact:` to match the mirror below.

### Finish-gate mirror (`finishing-a-development-branch/reference/disposition-protocol.md:14`)

The conformance bullet gains `Reviewer:` and `Impact:` with the same grammar; rows that skipped the funnel carry `Reviewer: not reviewed - <the Conformance entry step 1 exclusion that kept it out>`. No trigger clause, per Q4.

### Worked example

Update the example in `amendment-surface.md` (lines 115-158) to the new header and bullet shape: the escalated items quote the reviewer, the prefiltered items `scope` and `count` show `not reviewed - ...`, and `Example`, `Impact`, `Details` read visibly differently.

### Wording constraint

Edits are minimal and imperative per `/skill:writing-skills`: change the template lines and the sentences that define them; add no new section, no prose explaining the change.

## Errors and edges

| Case | Render |
|---|---|
| Trigger matches no named step | `from the <phase> phase` |
| Plan untouched / no plan yet | `applying as recommended reopens no tasks; no phase change` |
| Reviewer dispatch failed | `Reviewer: reviewer unavailable: <reason>` on each affected item |
| Prefiltered item | `Reviewer: not reviewed - <rule>` |
| Pure addition / removal | `Impact: <section>: (none) -> <new>` / `<old> -> (removed)` |
| Several decisions touched by one item | one `Impact:` clause per decision, `;`-separated, same line |
| Mixed batch | `<N>` counts rendered card items (escalated + prefiltered), never auto-applied ones |
| Standing grant active | no card; unchanged one-line records |

## Tests

`scripts/ci.mjs:225-231` presence checks gain: `Reviewer:` in `skills/brainstorming/reference/amendment-surface.md` and in `skills/finishing-a-development-branch/reference/disposition-protocol.md`; `applying as recommended` present and `or: no plan yet` absent in `amendment-surface.md`.

RED-GREEN scenario (per `/skill:writing-skills`, run once, not in CI): a fresh subagent renders an E-3177-shaped batch (three reviewer-escalated design-adding items, one prefiltered) from the pre-change and post-change reference. Expected after: the header names the trigger and the plan clause; every item carries a `Reviewer:` line; `Impact:` names a spec section and a contract shift, never a plan task.

Verification: `npm test`.

## Out of scope

`agents/spec-council-member.md`, telemetry YAML, the § 5 commit-record grammar, caller SKILL.md files (`subagent-driven-development`, `writing-plans`, `finishing-a-development-branch`), per-item attribution of reopened tasks in the header, and any heavier gate for design-adding escalations.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` (Unreleased entry); `doc/specs/2026-09-19-readable-amendment-gates.md` (supersession banner)
- Derived / memory docs invalidated: none

Per `reference/documentation-impact.md`, skill reference bodies are implementation surface, not doc-impact entries.

## Open questions

none
