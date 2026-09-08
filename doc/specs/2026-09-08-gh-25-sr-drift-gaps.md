# Close the SR/CR drift gaps that conformance catches a phase late (#25)

Ticket: GitHub issue [#25](https://github.com/jjuraszek/pi-gauntlet/issues/25). Verbatim ask: "make sure each change is surgical and minimal. less code/md instruction = less to maintain."

## Problem

Mined gauntlet sessions show the verify-phase `conformance-reviewer` catching spec drift that `spec-reviewer` (SR) and `code-reviewer` (CR) already passed at task level. Each late catch costs a full implementer -> SR -> CR -> conformance round instead of a per-task fix. The issue's four anchored cases reduce to three contract gaps:

1. **Misrouted coverage table** - a binding clause is waived because it sits under an "Out of scope" heading while stating real behaviour (e.g. `protectedPaths: []`), or is anchored to a task that does not write the deciding code.
2. **Condition blindness** - SR cites a real guard plus a passing test and marks MET without checking that the guard's *condition* equals the spec's condition.
3. **CR-only re-check loop** - after CR requests a behaviour-changing fix, only CR re-reviews; SR's earlier pass silently covers a materially different patch.

## Goals

- One narrow edit per gap, in the existing contract files only. No new files, agents, tools, settings keys, or loop counters.
- Verification is deterministic: `scripts/ci.mjs` token probes and `plan-check.test.ts` cases. `npm test` is the whole gate.

## Non-goals (out of scope)

- Fixture directories and the issue's 3-of-3 model-replay verification. Dropped; prompt contracts in this repo are Markdown plus token probes, not executable snapshots.
- A behaviour-verb vocabulary for the plan_check waiver rule. Backtick-only heuristic instead.
- Per-finding `behaviour-change` tags on CR findings. One report-level sentinel instead.
- Any change to `conformance-reviewer`, model/thinking assignment, CR Moderate-tier noise, or pi-cohort dispatch shapes (no paired release).
- Changes to the plan_check owner parser: `Task N[, Task N]` is already accepted, so cross-cutting owners need no grammar change.

## Design

### Plan side

#### writing-plans waiver criterion

`skills/writing-plans/SKILL.md` states the waiver criterion twice: the requirement-row bullet in § Spec Coverage Table and the **Waiver authorization** bullet in § Self-Review. Both currently read "only when the spec itself marks the item out of scope". Both are replaced by the same wording:

> `waived: <reason>` is only for requirements the spec marks out of scope **and** that exclude work from the change. A requirement whose text carries an inline code span (`` `literal` ``) names concrete behaviour and is never waivable - it maps to a task or `Verification`.

The requirement-row bullet additionally gains: "A cross-cutting requirement (decided in more than one task) lists **every** deciding task as owner, not the first."

The exemplar table's existing waived row (`§ "Out of scope" L131 | fix-round anchoring | waived: out of scope per spec`) contains no backtick span and remains valid; the table shape is unchanged.

#### writing-plans § Self-Review checker enumeration

The **Deterministic checker** bullet's list of covered checks gains `waiver-literal` after `header-only entrypoint`.

#### plan_check: `waiver-literal` check

New function `checkWaiverLiteral(parsed: ParsedPlan): PlanCheckFinding[]` in `extensions/lib/plan-check.ts`, appended in `checkPlan` after `checkHeaderEntrypoint`. Rule:

- For each `CoverageRow` with `isWaived === true`, if `requirementCell` matches `` /`[^`]+`/ ``, emit `{ check: "waiver-literal", line: row.line, text: row.text, reason: "waived row names a code literal; waive only requirements that exclude work" }`.
- Parser, `checkTableClosure`, and `checkQuoteIntegrity` are untouched.

Tests in `extensions/lib/plan-check.test.ts`, inline-string mutations of the existing valid fixture like the neighbours:

- Positive: a coverage row `| § "Out of scope" L131 | \`protectedPaths: []\` stays empty | waived: out of scope |` yields exactly one `waiver-literal` finding on that row's line.
- Negative: the same requirement owned by a task whose body and anchor satisfy the other checks yields an **empty** findings array (whole plan passes, not just this check silent).
- Negative: a waived row whose requirement reads `do not add support for protectedPaths` (no backticks) yields an empty findings array.

The check count "8" becomes "9" in `README.md` (L74), the `plan_check` tool description in `extensions/phase-tracker.ts` (L697), and `doc/configuration.md` (L63, which also enumerates the checks by name - append `waiver-literal`).

### SR side

Lockstep edit to `skills/subagent-driven-development/spec-reviewer-prompt.md` and `agents/spec-reviewer.md`. The rule is one bullet in each file - in the prompt's `## Spec Authority` bullet list (beside **Finding grammar**), in the agent's `## Output format` section:

> **Condition match:** for every anchored clause that fixes a value, threshold, comparison, or trigger ("only when", "unless", "if", a literal), the clause row carries two indented sub-lines, before `touched-files:` where present:
>
> ```
> spec-condition: <clause fragment quoted from the spec>
> code-condition: <what the code checks, file:line>
> ```
>
> If the two differ, the clause is `PARTIAL` at most - regardless of passing tests. A plausible condition is not the specified condition.

Only `agents/spec-reviewer.md` has a per-clause example; its `[MET]` and `[PARTIAL]` rows each gain the pair, e.g.:

```
  - [PARTIAL]      F1: C-2: ... — evidence: file.ts:80; missing: ...
        spec-condition: "only when the path normalizes outside the leaf"
        code-condition: `startsWith("..")` file.ts:80
        touched-files: file.ts
        touched-resources: none
```

The prompt file's ✅/❌ report contract is unchanged (the pair rides in the F1..Fn findings it already lists). `Verdict`, `Parallel-safe:`, and `TRAJECTORY:` grammar are unchanged.

### CR side

One report-level sentinel in three files: `agents/code-reviewer.md`, `skills/requesting-code-review/code-reviewer.md`, `skills/subagent-driven-development/code-quality-reviewer-prompt.md`.

```
Behaviour-change: yes | no
```

Footer order, stated identically in all three files: `Parallel-safe:` when present (issue-bearing reviews only, as today), then `Behaviour-change:` on **every** report including clean ones, then `TRAJECTORY:` when a re-review trigger fired - `TRAJECTORY:` stays the true final line. The two existing sentences that place `TRAJECTORY:` "directly after `Parallel-safe:`" (`code-quality-reviewer-prompt.md` § Re-review, `agents/code-reviewer.md` finding-ID paragraph) are reworded to "after `Behaviour-change:`".

Rule text (same in all three): `yes` when applying any Critical or Moderate fix would alter observable behaviour - values, control flow, routing, emitted output, persisted state; `no` when every fix is structural or stylistic, and on clean reports.

### Loop side

`skills/subagent-driven-development/SKILL.md` § Fix-Loop Rounds gains one paragraph after **Fix fan-out**:

> **Behaviour-change reroute.** When the triggering CR report carries `Behaviour-change: yes`, the fix round's re-review is SR first, then CR. The SR dispatch reviews the fix diff against the task's spec anchors as a first review (no `## Previous review report` marker, so no `TRAJECTORY:` line; SR carries no test commands), but its ordinal continues the task's SR-loop count - a task whose SR loop ended at review 2 gets review 3 here, and an issue-bearing rerouted SR after review 4 escalates. Issues follow the normal sequence: fix, then SR re-review pasting this SR's report. CR round numbering is unchanged. `Behaviour-change: no` re-reviews with CR only. A missing or malformed `Behaviour-change:` line is re-asked once like `Parallel-safe:` (see `dispatching-parallel-agents` "Structural probe"); still missing -> route through SR, never default to `no`. In wave mode the SR re-review targets the task(s) whose files the fix touched.

No new cap, tracker state, or sentinel other than `Behaviour-change:`.

## Verification

`scripts/ci.mjs` `tokenChecks` array gains present-probes on normative fragments (not bare labels):

| File | Token |
|---|---|
| `skills/subagent-driven-development/spec-reviewer-prompt.md` | `A plausible condition is not the specified condition` |
| `agents/spec-reviewer.md` | `A plausible condition is not the specified condition` |
| `agents/spec-reviewer.md` | `code-condition:` |
| `agents/code-reviewer.md` | `Behaviour-change:` on **every** report |
| `skills/requesting-code-review/code-reviewer.md` | `Behaviour-change:` on **every** report |
| `skills/subagent-driven-development/code-quality-reviewer-prompt.md` | `Behaviour-change:` on **every** report |
| `skills/subagent-driven-development/SKILL.md` | `never default to ` + "`no`" |
| `skills/writing-plans/SKILL.md` | `is never waivable` |

Plus the three `plan-check.test.ts` cases above. `npm test` (which runs `scripts/ci.mjs` and the unit tests) is the gate; no other commands.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` (`## [Unreleased]` entry for the three contract changes and the new check); `README.md` and `doc/configuration.md` (check count 8 -> 9, name appended in configuration.md)
- Derived / memory docs invalidated: none (AGENTS.md knobs table unaffected; skill and agent bodies are implementation surface)

## Open Questions

None.
