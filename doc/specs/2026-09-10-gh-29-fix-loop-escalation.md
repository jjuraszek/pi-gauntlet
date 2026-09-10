# Fix-loop escalation to a stronger model before the human stop (#29)

## Problem

`subagent-driven-development`'s two review loops (spec-compliance, code-quality) end a stalled fix loop by stopping and reporting to the human (`SKILL.md` "Fix-Loop Rounds", steps 2-4 and "Escalation report"). Two defects:

1. **No stronger attempt before the stop.** The cheap `implementer` (preset `subagents.agentOverrides.implementer.model`) is the only model that ever tries a fix. Issue #29 proposes escalating to a stronger model first. Its mechanism - "omit `model:` to inherit the parent" - is wrong: pi-cohort resolves `params.model ?? agent.model` (`subagent-executor.ts`, single and parallel paths), so omission re-runs the *same* cheap implementer. Nothing inherits the main loop. Thinking parity has the same trap: a recognised `:level` suffix on the model string is what `applyThinkingSuffix` (`pi-args.ts`) honours over configured thinking.
2. **The stop report is a process log.** It reports review counts, `TRAJECTORY` verdicts and whether the convergence exception fired. It does not tell the human what is wrong or what the choices are.

## Decisions

| # | Decision |
|---|---|
| D1 | One new settings block `piGauntlet.escalationLoop` with one leaf `implModel` (string `provider/id[:thinking]`). Strictly optional: absent block, `{}`, `""`, `null`, non-string all mean **main-loop model + thinking**. When the preset's implementer already runs the main-loop model and thinking, the default escalation buys only a fresh context; a genuinely stronger attempt requires setting `implModel`. |
| D2 | `gauntlet_setting({ key: "escalationLoop" })` returns `{ key, implModel, errors }` with `implModel` already resolved (setting if non-empty, else main-loop string built from tool `ctx`). The skill passes it verbatim as `model:` - no provider- or model-name branching in prose; the only branch is `implModel` undefined. |
| D3 | Escalation fires at the **existing** escalate points only. No new trigger, no trajectory carve-out. |
| D4 | Exactly one escalated round: one `implementer` (no fix fan-out) on `implModel`, `context: "fresh"`, reusing the just-used fix dispatch's payload and isolation knobs, then the normal fix-round review gate. `escalationRounds` is not introduced. |
| D5 | The human is bothered only when the escalated round fails: its review gate still has issues, the implementer returns a non-`DONE` status, the dispatch errors, or no escalation model is resolvable. |
| D6 | The stop message is a **stop note**: problem-first, example-driven, self-contained, with 2-3 concrete fix alternatives. Template lives in a companion file. |
| D7 | Scope: the two review loops (spec-compliance, code-quality) in sequential and wave mode. Unchanged, old bare-stop wording stays: conformance remediation loop (`closureReview.maxFixRounds`), the After-All-Tasks whole-diff CR loop (budget in `requesting-code-review`), and "When a Subagent Fails" (2 failed attempts -> stop). |

## Design

### Settings and `gauntlet_setting` (extension surface)

`extensions/lib/gauntlet-settings.ts`:

```ts
export interface EscalationLoopResolved { implModel: string | undefined }
export function resolveEscalationLoop(g: PiGauntlet, mainLoop: string | undefined): EscalationLoopResolved
```

- `nonEmptyString(g.escalationLoop?.implModel)` -> trimmed value; otherwise `mainLoop`.
- Pure; no `ctx` access. Repo-over-preset whole-object precedence comes for free from the generic `mergeGauntlet` spread; the only key enumeration to extend is the prose list in `settings-precedence.md`.

`extensions/phase-tracker.ts` `gauntlet_setting`:

- `key` enum gains `"escalationLoop"`.
- `mainLoop` is built by a pure helper `mainLoopModel(model, thinkingLevel)` next to the resolver, fed from `ctx.model` and `ctx.thinkingLevel` (pi `ExtensionContext`, both present on tool `ctx`): `${provider}/${id}:${level}`. The suffix is **always** present so pi-cohort's `applyThinkingSuffix` never appends the implementer's configured thinking: `level` = `thinkingLevel` when it is one of pi-cohort's recognised `off|minimal|low|medium|high|xhigh`; `max` -> `xhigh`; unset -> `off`. `ctx.model` undefined -> `mainLoop` undefined.
- Payload: `{ key: "escalationLoop", implModel, errors }`. `errors` keeps its existing meaning (settings load errors). `implModel` undefined is itself the signal that no model is resolvable - no extra entry is appended. An empty/absent setting is **not** an error - it is the default.

`PiGauntlet` type gains `escalationLoop?: { implModel?: unknown }`.

### Skill: `skills/subagent-driven-development/SKILL.md`

Edit set (four hunks):

1. "Fix-Loop Rounds": redefine "escalate" once, immediately after the numbered sequence, replacing the current "Escalation report" paragraph:

   > **Escalate** = one escalated round, then stop only if it fails. Call `gauntlet_setting({ key: "escalationLoop" })` at the escalate point (unavailable -> stop and report). `implModel` undefined -> stop note. Otherwise re-dispatch the fix you just dispatched - same payload and isolation knobs (`cwd`, `worktree`, `SCOPED_TEST_COMMANDS`, status protocol, prior patch, spec anchors), plus the prior review report verbatim - overriding only `model: <implModel>`, `context: "fresh"`, `async: false`; one implementer, no fan-out. Then run the normal fix-round review gate (SR then CR on `Behaviour-change: yes`, else the triggering reviewer with the re-review marker). Every review clean -> proceed. Any review with issues, a non-`DONE` status, or a dispatch error -> stop note per `stop-note.md`; no second dispatch. Once per loop; independent of the convergence exception. No `plan_tracker` write during escalation - the task stays `in_progress` until the human decides.

2. "Fix-Loop Rounds" worked examples: drop "with the exception named in the report"; each example ends at "escalate".

3. "Continuous Execution" pause list: the fix-loop bullet becomes "An escalated round fails (stop note per Fix-Loop Rounds)".

4. "Dispatch" block: one commented example line for the escalated implementer next to the existing implementer example.

The conformance comment "omit `model:` if undefined to inherit" is out of scope (adjacent issue).

Wording constraints: imperative, model-agnostic, no provider names, no new conditional beyond `implModel` undefined and non-`DONE`. Net growth of `SKILL.md`: at most +900 bytes (`wc -c` before/after).

### Companion: `skills/subagent-driven-development/stop-note.md`

~40 lines. Referenced from SKILL.md by one sentence. Contents:

Template:

```
Stopped on task <n> (<title>)[; escalated round on <implModel> did not resolve it].

Problem: <one sentence: what is wrong and why the fixes could not resolve it>
  <file:line> - <quoted finding from the final review>
  <failing test/command + 1-3 line output snippet, when present>

Fix options:
  a) <concrete change>
  b) <concrete change - amending spec section X / plan task n is a normal option>
  c) <optional third>

Pick one, or give another fix.
```

Rules:

- The bracketed header clause appears only when an escalated round actually ran (omit it when no model was resolvable or the dispatch errored).
- Residual issues come from the **final** review report only; quote, do not summarise history.
- Options are actionable edits. Spec/plan amendment is a first-class option - stalls are usually a slightly contradictory spec, not a capability gap.
- Never offer "skip the task". If the task is genuinely droppable, say so and name the plan tasks that depend on it.
- No trajectory verdicts, round history, review counts, or paths to spec/plan/review reports. The process record already lives in the review outputs on disk.
- Plain words, ASCII, no headings. One screen.

Worked example (kept in the file as the reference shape):

```
Stopped on task 3 (add escalationLoop resolver); escalated round on openai/gpt-x:high did not resolve it.

Problem: `resolveEscalationLoop` returns "" for an absent key, but the skill passes the value
straight to `model:`, and pi-cohort rejects an empty model id.
  extensions/lib/gauntlet-settings.ts:88 - `return { implModel: cr?.implModel ?? "" }`
  node --test extensions/lib/gauntlet-settings.test.ts > "falls back to main loop":
    expected "anthropic/x:medium", got ""

Fix options:
  a) resolver returns mainLoop when the setting is not a non-empty string (spec D1 already says so)
  b) amend plan task 3 to pass mainLoop into the resolver instead of reading ctx inside it

Pick one, or give another fix.
```

### Flow

```
review N has issues at an escalate point
  -> gauntlet_setting({ key: "escalationLoop" })
  -> implModel undefined -> stop note ("no escalation model resolvable" as the Problem)
  -> implementer: the just-used fix dispatch + prior report verbatim; override model=implModel, context=fresh, async=false
     (wave mode: worktree: true stays; the returned patch supersedes the prior one at integrate)
  -> non-DONE status / dispatch error -> stop note (status text or error as the Problem)
  -> normal fix-round review gate (SR then CR on Behaviour-change: yes, else triggering reviewer with the re-review marker)
  -> all clean -> proceed
  -> issues    -> stop note
```

Stop note delivery: inline in the parent's reply; the turn ends; phase stays `implement`, the task stays `in_progress`; no further tasks start.

Edge cases:

| Case | Behaviour |
|---|---|
| Escalated implementer dispatch errors (bad model id, provider down) | Stop note; dispatch error is the Problem. No retry. |
| Parallel wave | A stalled task escalates on its own; siblings are not aborted. Stop notes are issued after the current parallel batch has returned - one note per stalled task. |
| Convergence exception already ran | Independent; escalation still fires once at review 4 issues. |
| `plan_tracker` | New rule: no tracker write during escalation; the task stays `in_progress` until the human decides (`failed` remains the human-decided terminal-negative). |
| `gauntlet_setting` unavailable | Stop and report (existing rule for every settings read). |

## Testing

`extensions/lib/gauntlet-settings.test.ts` (node:test, node:assert/strict; run by `npm test` -> `scripts/ci.mjs`):

- `resolveEscalationLoop`: absent block, `{}`, `implModel: ""`, `null`, `42` -> `implModel === mainLoop`.
- Non-empty string -> trimmed value, `mainLoop` ignored.
- No setting and `mainLoop` undefined -> `implModel` undefined.
- Repo `escalationLoop` replaces preset whole-object (mirror the existing `closureReview` merge case).
- `mainLoopModel`: level unset -> `provider/id:off`; `"off"`, `"medium"`, `"xhigh"` -> passed through; `"max"` -> `provider/id:xhigh`; model undefined -> undefined.

`extensions/phase-tracker.test.ts`: extend the harness `ctx` with `model` + `thinkingLevel` and assert one `gauntlet_setting({ key: "escalationLoop" })` payload (setting absent -> `implModel` equals the ctx-derived string).

Skill prose: `rg -ni <forbidden patterns> skills/` hygiene grep; `wc -c skills/subagent-driven-development/SKILL.md` before/after, delta <= 900 bytes.

## Documentation impact

Materiality bar: `reference/documentation-impact.md` (brainstorming skill).

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` (new `## Escalation loop` section: key, default = main loop, `gauntlet_setting` key list at "phase-tracker" and the extensions summary table); `AGENTS.md` (extensions table row for `phase-tracker.ts`, `gauntlet_setting` key list); `skills/verification-before-completion/reference/settings-precedence.md` (add `escalationLoop` to the whole-object key list); `CHANGELOG.md` (entry under the next release heading)
- Derived / memory docs invalidated: none

`stop-note.md` and the `SKILL.md` edit are implementation surface, not doc-impact entries. No agent-written comment on #29; the PR closes it.

## Out of scope

- Conformance remediation loop and `closureReview.maxFixRounds`; the After-All-Tasks whole-diff CR loop; "When a Subagent Fails" - all keep their current stop wording.
- `escalationRounds` or any retry count.
- Provider-specific thinking heuristics.
- Reviewer prompt or `TRAJECTORY` grammar changes.
- Rewriting the conformance dispatch comment ("omit `model:` to inherit") - adjacent issue, surfaced separately.

## Open questions

None.
