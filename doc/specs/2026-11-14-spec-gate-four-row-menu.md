# Spec approval gate: four rows, per-engine flags, one recommended row

**Goal:** Replace the six-row spec approval gate with four one-sentence rows (plan engine, loop engine, council explanation, draft PR), make auto-applied amendments the default with `--amends-stop` as the opt-out, move budgets to `--fund-rounds=N` and `--allowance=N` listed under the engine that accepts them, and tag exactly one row `[recommended]` from the session's context usage and the shape of the acceptance rows.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** `doc/specs/2026-11-01-gh-108-loop-single-allowance.md` - superseded for the approval gate's `allowance <n> per row` display on options 4/5 and the `; allowance N` reply suffix only (single-allowance semantics, ledger seeding, and the `run allowance: <n>` carrier stay); `doc/specs/2026-10-04-spec-gate-approval-menu.md` - superseded for the "Gate render" menu rows and the "Reply grammar" digits only (the grant description sentence stays, as the value a default approval persists); `doc/specs/2026-10-05-council-gate-digest.md` - superseded for the `3 - show council dispositions` row label and the three-row menu in "Gate render" only; `doc/specs/2026-10-22-gh-74-respect-amend-grant.md` - superseded for the gate hint line and reply table in "Gate option 2 and the written value" only (the written `**Amend-grant:**` value and its decoding stay); `doc/specs/2026-10-23-gh-68-loop-implement-engine.md` - superseded for "Approval menu and routing sites" rows 4/5, their reply rules, and the "experimental" label only; `doc/specs/2026-10-28-spec-only-draft-pr.md` - superseded for the row number and label in "Option 6 at the User Review Gate" only (publication, classifier, and re-gate stay).

## Problem

The gate in `skills/brainstorming/reference/spec-finalization.md` `## User Review Gate` renders six rows: `1`/`2` approve for the plan engine without/with a standing amendment grant, `4`/`5` do the same for the loop engine, `3` prints the council audit, `6` hands the spec off as a draft PR. Budgets ride as word suffixes (`; fund N fix rounds` on 1/2, `; allowance N` on 4/5). The gate recommends nothing. The operator picks the granting rows (2 and 5) almost exclusively, so rows 1 and 4 read as redundant, and the menu gives no feedback on which row fits this spec and this session.

Request, verbatim:

> "stop on amends" should be option only. final menu should be composed like:
> 1. plan engine
> 2. loop engine
> 3. council explenation
> 4. draft PR with spec
>
> no longer extra redundant options. each option human readable with nice formatting with clear flags possible like `--ammends-stop` and `--fund-rounds=N`. each option one sentence with proper llm driven recommendation like any other menu. recommended option is based on what spec is and how context looks like. so if context is over 30% it should always recomend draft PR with short explenation that next `/skill:brainstorming #<pr-ref>` will make the process less prone to hallucination. selection between plan and loop engine should be based on assessed complexity of ACs. if ACs are actual simple to medium steps recommend loop. if those are rather difficult and plan will split it to more managebale entries than plan is recommended. human can always select any of those options despite recommendation. verify my idea but I feel that we need to have simpler menu there with more feedback for human operator

Decisions the user made during the questionary:

| Question | Answer |
|---|---|
| Draft-PR trigger | Percent of the model's context window, fixed at 25, no settings key ("we need to use percentage as we don't know the model from this"). |
| Engine pick | Loop by default; plan only when the reason names a bundled row, or the spec has no acceptance rows. |
| "Row too big" test | Bundled row: the row commits to two or more separately checkable outcomes, and the reason quotes the row and names them. |
| Source of the context reading | `phase_tracker` `status`, from pi's built-in `ctx.getContextUsage()`; the reading must not be drawn in the TUI. |
| Flag placement | Each engine row lists its own flags beneath it, each explained for that engine with its default; no shared footer. |

Stated assumptions the user did not object to: the flag is spelled `--amends-stop`; the loop row drops its "(experimental)" label; the spec header keeps today's `**Amend-grant:**` and `**Engine:**` values; old digit replies change meaning (breaking); a bare `approve` takes the recommended row.

Checked claims:

| Claim | Lookup | Result |
|---|---|---|
| The gate renders six rows with the meanings above | `skills/brainstorming/reference/spec-finalization.md` `## User Review Gate`, rows and reply table | Held |
| Other numbered menus carry one recommended row | `skills/brainstorming/reference/menu-layout.md` First-line rule: `gauntlet: gate=<skill>/<id>( recommended=<token>)?`, token = number of the row tagged `[recommended]`; `skills/gatekeep-pr/reference/menus.md`, `skills/shape-ticket/reference/repo-audit.md` use it | Held; this gate renders none today |
| A flipped default needs no new persisted format | `skills/brainstorming/reference/amendment-surface.md` Standing grants: `**Amend-grant:**` holds `none`, a granting sentence, a budget token, or both; every reader decodes the header, never the digit | Held: the gate writes the granting sentence on a plain engine pick and `none` on `--amends-stop` |
| Absent or `none` `**Amend-grant:**` means no grant for legacy specs and deferred draft PRs | amendment-surface predicate table; `skills/gauntlet-resume/SKILL.md` grant read | Held: the predicate is untouched; only the gate's write changes |
| The agent can see its context usage | `rg getContextUsage extensions/`; pi 1.5.2 `dist/core/extensions/types.d.ts` `ContextUsage { tokens: number \| null; contextWindow: number; percent: number \| null }`, `getContextUsage(): ContextUsage \| undefined` | Corrected: no model-visible value exists today. pi exposes it on the extension context; `extensions/telemetry.ts` (`turn_end`, `peak_context`) and pi-condense (`index.ts` `turn_end`, `src/budget.ts`) already call it. Every `phase_tracker` `execute` receives the same `ctx`, so a tool result can carry it. |
| pi's `percent` is always present | same type declaration; pi-condense reads `tokens` and `contextWindow` | Corrected: `tokens` and `percent` are null right after a compaction; the reading needs an `unknown` state |
| A tool can send text to the model that the TUI does not draw | `extensions/phase-tracker.ts` `renderResult` (draws from `details.phases`, prints `content` only when `details` is absent), `updateWidget` -> `formatWidget(phases, dispatchCounts, theme)` | Held: a line added to `content` and kept out of `details` is not drawn. It is stored in the session file, so raw tool-result readers show it. |
| No reader copies `status` text verbatim | `skills/gauntlet-handoff/SKILL.md` step 6; `skills/gauntlet-resume/reference/brief-contract.md` `## Producers` and its example block | Corrected: gauntlet-handoff appends the `phase_tracker` status output verbatim into the brief's byte-exact `## Process state`, whose phase block ends at the last phase line. The producer drops the trailing `Context:` line before copying (Design 3); the brief grammar is unchanged. |
| The draft-PR row can always be recommended | spec-finalization: `On every PR subject omit row 6 and print Withheld: draft PR - #N already exists`; `skills/brainstorming/reference/spec-pr.md` withholds on an invalid diff shape | Corrected: the over-threshold recommendation yields to the engine pick when the row is withheld |
| 30% of the window separates heavy brainstorms from light ones | brainstorm `peak_context` in ten `refs/telemetry/records` entries: 113095, 138958, 167099, 205428, 221706, 242627, 247393, 258319, 270259, 281712 tokens, on a 1M window | Corrected: peaks are 11-28%, so a 30% rule fires on 0 of 10; the chosen strict over-25 rule fires on 3 of 10 (247393 reads 24.8 and stays under; 258319 reads 25.9 and fires, which is why the reading keeps one decimal - Design 3) |
| Percent of the advertised window is a sound trigger on 1M models | pi-condense `src/budget.ts` `MAX_BUDGET_WINDOW = 300_000` | Held with a note: 25% of 1M is 250k tokens, under that cap |
| A later `/skill:brainstorming #N` re-gates the draft PR in a fresh session | `skills/brainstorming/reference/pr-subject.md` Spec-PR classifier, marked row; `skills/brainstorming/SKILL.md` entry | Corrected: the command re-gates the draft PR in whatever session runs it; entry resets the workflow trackers, not the session's context. Starting a fresh session is a step the operator takes first, so row 4, its reason line, and the post-publication message say so. |
| brainstorming is pi-only, so the gate may rely on a pi tool | `.claude-plugin/marketplace.json` skill list | Held: brainstorming is not listed |
| Fix-round funding is waves-only and loop allowance is loop-only | spec-finalization reply table | Held: `--fund-rounds=N` belongs to row 1, `--allowance=N` to row 2 |
| A gate-reply `--flag` grammar exists | `rg` over `skills/`, `doc/gate-contract.md` | Not found: existing reply tokens are word suffixes. The flag form is new at this gate. |
| Loop is safe in practice | `refs/telemetry/records`: 9 loop runs, all `status: shipped`, rows 2-21, `conformance_loops` 1-6 | Held: every loop run needed at least one conformance fix round, so the final gate does the catching |
| Loop is faster than the plan engine; hard rows go better through a plan | same records: 1 waves run | Not checkable: one waves record is no comparison |
| Rows fail the loop because they are too big | `git log --all --grep '^loop:'`: 214 `row N done`, 32 `row N failed`, 3 `escalate row N`; 24 readable failure notes | Mostly disproved: about 8 failing eval replays, about 5 missing prerequisites or approvals, about 6 rows contradicting code or another row, 2 a check the worker may not run, 2-3 a row bundling several deliverables. Only the bundled case is something a plan's task split fixes. |
| Drafted rows are already one outcome each | `skills/brainstorming/reference/ticket-acceptance.md` Row production | Held: a bundled row reaches the gate only as a verbatim ticket row or a drafting miss |
| The gate already makes a tool call before rendering | spec-finalization: "resolve `gauntlet_setting({ key: "loopEngine" })` once for this gate" | Held |
| Renumbering is a contract change | `doc/gate-contract.md` Reading a reply; `README.md`; `doc/configuration.md`; `scripts/brainstorming-contract.test.mjs`; `scripts/loop-engine-contract.test.mjs`; `scripts/ci.mjs` token checks | Held: old `2` becomes loop, old `4` becomes draft PR, old `5`/`6` leave the range |
| CI pins the grant sentence | `scripts/ci.mjs`: the sentence appears exactly 1x in spec-finalization.md and 2x in amendment-surface.md; token `2 - approve, auto-apply amends:` required | Held: the new gate keeps the sentence once, as the default grant |
| Release level for a reply-grammar break | `.agents/skills/release/SKILL.md`, `doc/install-internals.md` | `major` is defined for renames, breaking config-schema changes, and extension API removal; the level is the user's call at release |

Implicit dependencies: a model-visible context percent - missing today (delivered by this spec). The worktree has no local pi package (`package.json` lists only the `pi-cohort` peer), so pi's types were read from the installed pi 1.5.2.

Framing: kept

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] The spec approval gate renders at most four numbered rows with fixed numbers and labels - `1 - plan engine`, `2 - loop engine`, `3 - council explanation`, `4 - draft PR` - each described in one sentence.
  in-scope
- [ ] Row 1 lists `--amends-stop` and `--fund-rounds=N` beneath it and row 2 lists `--amends-stop` and `--allowance=N` beneath it, each flag on its own line with a one-sentence explanation ending in its default (the `--allowance=N` default is the resolved `loopEngine.maxIterationsPerRow`); rows 3 and 4 list no flags.
  in-scope
- [ ] Exactly one rendered row among 1, 2, and 4 ends with `[recommended]`, the message's first line is `gauntlet: gate=brainstorming/user-review-gate recommended=<that row's number>`, and a `Recommended: <n> - <reason>` line follows the rows.
  in-scope
- [ ] Outside the create-only retry view, when the status reading is above 25% of the window and row 4 is rendered, row 4 is the recommended row and its reason states the percent and tells the operator to start a fresh session and run `/skill:brainstorming #<N>` there.
  in-scope
- [ ] Outside the create-only retry view, when the status reading is `Context: unknown`, is 25% or lower, or row 4 is withheld, row 4 is not the recommended row.
  in-scope
- [ ] When row 4 is not recommended and the spec has no acceptance rows, row 1 is the recommended row.
  in-scope
- [ ] When row 4 is not recommended and an `in-scope` or `venue:` acceptance row commits to two or more separately checkable outcomes, row 1 is the recommended row and its reason quotes that row and names the outcomes.
  in-scope
- [ ] When row 4 is not recommended, acceptance rows exist, and none is bundled, row 2 is the recommended row with the reason `no row bundles more than one outcome`.
  in-scope
- [ ] `phase_tracker({ action: "status" })` returns model-visible text ending in `Context: <p>% of window`, where p is tokens divided by the context window from pi's context usage, as a percent with one decimal place, rounded up.
  in-scope
- [ ] The same call returns `Context: unknown` when pi reports no usage, a null token count, or a zero window.
  in-scope
- [ ] The TUI row drawn for a `status` call and the phase widget show no context line.
  in-scope
- [ ] Reply `1` persists the default grant sentence as the spec's `**Amend-grant:**` value and `**Engine:** waves`, completes the brainstorm phase, and invokes `/skill:writing-plans`.
  in-scope
- [ ] Reply `2` persists the default grant sentence and `**Engine:** loop`, completes the brainstorm phase, and invokes `/skill:loop-implementation`.
  in-scope
- [ ] `--amends-stop` on row 1 or row 2 persists `**Amend-grant:** none` with that row's engine.
  in-scope
- [ ] Reply `1 --fund-rounds=3` persists the default grant sentence followed by `; fund 3 fix rounds`.
  in-scope
- [ ] Reply `1 --amends-stop --fund-rounds=3` persists `**Amend-grant:** fund 3 fix rounds`.
  in-scope
- [ ] Reply `2 --allowance=6` prints `run allowance: 6` immediately before invoking `/skill:loop-implementation` and writes no allowance to the spec.
  in-scope
- [ ] A reply listed under "Rejected replies" in Design gets exactly one clarifying question that quotes the offending token or names the rendered rows, and no file or commit changes.
  in-scope
- [ ] Reply `3` prints the council audit verbatim and re-presents the gate with the same rows, tag, and reason, recording no approval and no grant.
  in-scope
- [ ] Reply `4` writes `**Amend-grant:** none` and `**Engine:** deferred`, pushes the branch, and opens the draft PR carrying only the spec.
  in-scope
- [ ] On a PR subject the gate omits row 4 and prints the line `Withheld: draft PR - #N already exists`.
  in-scope
- [ ] With no acceptance rows the gate omits row 2 and its flag lines, so no `--allowance` line renders, and prints the line `Loop engine unavailable: this spec has no acceptance-criteria rows.`
  in-scope
- [ ] Without a council audit the gate omits row 3.
  in-scope
- [ ] A bare `approve` takes the recommended row after echoing `Taking "approve" as option <n> - <label>`.
  in-scope
- [ ] On a marked draft-PR re-gate, reply `1` or `2` with its flags persists the engine, the decoded grant, and `**PR:**` as a new commit.
  in-scope
- [ ] The gate's loop row and the loop-engine passages in `README.md`, `doc/configuration.md`, `doc/implement-engines.md`, and `doc/personas.md` no longer call the loop engine experimental.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: spec-gate-four-options
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`: skill lint, instruction-size lint, gate-contract lint, token checks, contract tests, extension tests, eval lib tests, eval structural lint and hygiene), run by the orchestrator; `node eval/run.mjs <target> <sample>` for each sample named in Design "Evals"
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: doc/gate-contract.md
Rules: doc/install-internals.md
Rules: doc/implement-engines.md
Rules: .pi/gauntlet-overrides.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9, AC 10, AC 11, AC 12, AC 13, AC 14, AC 15, AC 16, AC 17, AC 18, AC 19, AC 20, AC 21, AC 22, AC 23, AC 24, AC 25, AC 26
design: owns the `## User Review Gate` section of `skills/brainstorming/reference/spec-finalization.md`, the dependent sentences in the skill, doc, and script files listed in Design "Dependent text", the `status` branch of `extensions/phase-tracker.ts` with its test, step 6 of `skills/gauntlet-handoff/SKILL.md` with the matching producer sentence in `skills/gauntlet-resume/reference/brief-contract.md`, and the `eval/spec-gate/`, `eval/brainstorming/`, and `eval/gauntlet-handoff/` samples named in Design "Evals".

## Design

Skill and reference edits follow `/skill:forge-skill` authoring rules. No file under `extensions/lib/` or `src/bins/` changes, so no bin rebuild is needed.

### 1. Gate template

The option block of the gate template in `spec-finalization.md` becomes the block below. Everything above it in the template (summary, `Spec written and committed`, `Scope cuts:`, drafted rows, `Council:`, adjacent lines, predecessor candidates) is unchanged.

```
gauntlet: gate=brainstorming/user-review-gate recommended=<n>
<unchanged template lines>

Pick one:
1 - plan engine: write a task plan, then implement it in reviewed waves.
- `--amends-stop`: stop for my review before a blocked task changes the spec's scope, acceptance criteria, or contracts (default: apply it and list it at the finish gate; a redraw always stops).
- `--fund-rounds=N`: fund up to N extra fix rounds per task after its escalated round (default: stop and ask there).

2 - loop engine: skip the plan and iterate a fresh implementer over the acceptance criteria. [recommended]
- `--amends-stop`: stop for my review before the loop rewords or cuts a row it is stuck on (default: apply it and list it at the finish gate; a redraw always stops).
- `--allowance=N`: attempts per row before the loop stops and asks (default: <allowance>).

3 - council explanation: print what the council changed in the spec, then show this menu again.

4 - draft PR: approve the spec's content only and publish it as a draft PR; to continue, start a fresh session and run `/skill:brainstorming #<N>` there.

Recommended: <n> - <reason>

Or tell me what to change in the spec, or say "revert applied council edit <X>" to undo a specific applied edit.
```

Layout rules:

- Row numbers are fixed. A withheld row is omitted and the other rows keep their numbers.
- Flag lines are `- ` bullets directly under their engine row, and a blank line separates each row group from the next row. The gate message is rendered as Markdown; an indented line under a paragraph is a continuation that loses its indent, and a row line directly after a bullet joins that bullet. Bullets plus the blank line keep each flag on its own line under its row in any renderer.
- A withheld engine row takes its flag lines with it.
- `<allowance>` is `maxIterationsPerRow` from the existing one-time `gauntlet_setting({ key: "loopEngine" })` lookup; the stop on an unavailable settings tool is unchanged.
- The `[recommended]` tag sits at the end of the recommended row's sentence. Exactly one of rows 1, 2, 4 carries it. Row 3 never does.
- `<N>` in row 4 is the literal placeholder; the PR number exists only after publication.

Withheld-row cases (the explanatory lines are today's, unchanged in wording):

| Condition | Row omitted | Line printed |
|---|---|---|
| Zero `- [ ]` rows under `## Acceptance criteria` | 2, with its flag lines | `Loop engine unavailable: this spec has no acceptance-criteria rows.` |
| PR subject | 4 | `Withheld: draft PR - #N already exists` |
| Worker path, or the council aborted before an audit existed | 3 | none |
| Draft publication withheld for an invalid diff shape (`spec-pr.md`) | 4 | the existing `Withheld: draft PR - ...` line |

Every applicable condition removes its row and prints its line; a row no condition removes is rendered. With one condition the rendered rows are 1, 3, 4 (zero rows), 1, 2, 3 (PR subject or invalid diff shape), or 1, 2, 4 (no audit). Combined: zero rows on the worker path renders 1, 4; a PR subject on the worker path renders 1, 2; a zero-row PR subject renders 1, 3; a zero-row PR subject on the worker path renders row 1 only.

The create-only retry view of `spec-pr.md` (push succeeded, PR creation failed) is not one of these cases: it renders only `4 - retry opening the draft PR` and its `Withheld: implementation approvals - ...` line (section 5).

### 2. Recommendation rule

Decide the recommended row and its reason before writing the menu text; never print the deliberation. The create-only retry view (section 5) takes precedence over this table and always recommends its sole row 4. Everywhere else, apply the first rule that matches:

| Order | Condition | Row | Reason line |
|---|---|---|---|
| 1 | The context reading is a number above 25, and row 4 is rendered | 4 | `Recommended: 4 - context is at <P>% of the window; start a fresh session and run \`/skill:brainstorming #<N>\` on the draft PR there, which is less prone to hallucination.` |
| 2 | The spec has zero acceptance rows | 1 | `Recommended: 1 - the spec has no acceptance rows, so the loop engine has nothing to iterate.` |
| 3 | An `in-scope` or `venue:` row is bundled | 1 | `Recommended: 1 - row <k> "<row text, first 60 chars>" commits to <outcome>, <outcome>[, ...]; a plan splits it into tasks.` |
| 4 | Otherwise | 2 | `Recommended: 2 - no row bundles more than one outcome.` |

Bundled row: the row commits to two or more separately checkable outcomes. Several facets of one observation (the fields of one rendered line, a value and where it is stored) are one outcome. `deviates:`, `deferred:`, and `elsewhere:` rows are not assessed. The first bundled row in section order is the one quoted; `<k>` is its one-based index among all rows. The main loop makes this judgment from the committed spec's `## Acceptance criteria` section; no tool or subagent is involved.

The recommendation is advisory: every rendered row stays selectable.

### 3. Context reading

- Add: in the `status` branch of the `phase_tracker` tool in `extensions/phase-tracker.ts`, append one line to the returned `content` text after `formatStatus(phases)`: `Context: <p>% of window` or `Context: unknown`.
- `<p>` is `(Math.ceil(tokens * 1000 / contextWindow) / 10).toFixed(1)` from `ctx.getContextUsage?.()`: the percent with one decimal place, rounded up to that decimal. The reading is `unknown` when the call is absent or returns `undefined`, `tokens` is null, or `contextWindow` is not greater than zero. `percent` is not read.
- `details` is unchanged, so the tool's `renderResult` and the phase widget draw nothing new. The tool description is unchanged.
- The gate calls `phase_tracker({ action: "status" })` once, beside the `loopEngine` settings lookup and before the summary `Read`, which stays the last content-producing tool call. A status result without a `Context:` line, an `unknown` reading, or a failed call all read as unknown; the gate never stops for a missing reading.
- Rule 1 compares the reading with 25 as a number and fires only above it. Rounding up to one decimal keeps the comparison strict: usage of exactly 25% reads `25.0` and does not fire, any usage above 25% reads `25.1` or more and fires (250001 of 1000000 tokens reads `25.1`), and 26% reads `26.0`. The reading is never floored before the comparison.
- The threshold 25 is a constant in the gate text. No settings key is added.
- `gauntlet-handoff` step 6 copies the `phase_tracker` status output into the brief's `## Process state`. It drops exactly the trailing `Context:` line - the last line, when it starts with `Context: ` - before copying, and copies the rest verbatim. The brief's byte-exact layout, tracker grammar, example block, and resume parsing in `brief-contract.md` are unchanged; no brief carries a context reading.

### 4. Reply decoding and persistence

The header fields, their placement, the amend-and-verify recipe (`edit`, `git add`, `git commit --amend --no-edit -q`, HEAD check through the grant predicate and Value decoding), the narration rule (quote the exact resulting `**Amend-grant:**` value in full), and the phase completion call are unchanged. Only the mapping from reply to values changes.

Default grant sentence (`G`), kept exactly once in `spec-finalization.md` on a line labeled as the default grant, byte-identical to today's option-2 description:

`every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.`

Flag grammar: after the row digit, a row label, or `approve`, whitespace-separated tokens from `--amends-stop`, `--fund-rounds=N`, `--allowance=N`, in any order, each at most once. `N` matches `[1-9][0-9]*` and is a positive safe integer.

Accepted replies:

| Reply | `**Amend-grant:**` | `**Engine:**` | Then |
|---|---|---|---|
| `1` | `G` | `waves` | invoke `/skill:writing-plans` |
| `1 --amends-stop` | `none` | `waves` | invoke `/skill:writing-plans` |
| `1 --fund-rounds=N` | `G; fund N fix rounds` | `waves` | invoke `/skill:writing-plans` |
| `1 --amends-stop --fund-rounds=N` | `fund N fix rounds` | `waves` | invoke `/skill:writing-plans` |
| `2` | `G` | `loop` | invoke `/skill:loop-implementation` with the settings allowance |
| `2 --amends-stop` | `none` | `loop` | invoke `/skill:loop-implementation` with the settings allowance |
| `2 --allowance=N` | `G` | `loop` | print `run allowance: N`, then invoke `/skill:loop-implementation` |
| `2 --amends-stop --allowance=N` | `none` | `loop` | print `run allowance: N`, then invoke `/skill:loop-implementation` |
| `3` or its label alone | nothing written | nothing written | print the audit, re-present (section 5) |
| `4` | `none` | `deferred` | publish per `spec-pr.md` (section 5) |
| a rendered row's label without a digit (`plan engine`, `loop engine`, `draft PR`), alone or followed by flags | as that row's digit with the same flags | as that row | as that row; the flags pass the same per-row validation as after a digit (`loop engine --allowance=6` is `2 --allowance=6`) |
| bare `approve`, or approval prose that names no row and carries no amendment, grant, or budget wording | as the recommended row's plain digit | as that row | echo `Taking "approve" as option <n> - <label>`, then act as that row |
| `approve` followed by flags (`approve --amends-stop`) | as the recommended row's digit with those flags | as that row | echo `Taking "approve" as option <n> - <label>`, then act as that row with those flags; a flag the recommended row does not accept (any flag when row 4 is recommended, `--allowance=N` when row 1 is) is a rejected reply |

The `run allowance: N` carrier line, its position immediately before the loop invocation, and its absence from the spec and settings are unchanged. Stored budget tokens keep today's `fund N fix rounds` form, so Value decoding and every later reader are unchanged.

Rejected replies - each gets exactly one clarifying question, writes nothing, and leaves the gate waiting; a second invalid reply leaves the gate waiting too. Run these checks, the worded-intent row included, before the plain-approval rows above and before the change-request rule below, so worded stop, grant, or budget intent never persists `G` silently and never becomes a spec change request:

| Reply | Question content |
|---|---|
| `--fund-rounds=N` on row 2, `--allowance=N` on row 1, any flag on row 3 or 4 - whether the row came from a digit, a label, or `approve` taking the recommended row | quotes the flag and names the row that accepts it |
| amendment, grant, or budget intent in words rather than a flag, beside a digit, a row label, or approval prose (`approve, stop on amends`, `1, stop on amends`, `approve and fund 3 more rounds`, `2 with an allowance of 6`, `approve, auto-apply amends`) | quotes the words and names the matching flag (`--amends-stop`, `--fund-rounds=N`, `--allowance=N`); for auto-apply wording, says it is the default and names `--amends-stop` as the opt-out |
| malformed `N` (`--allowance=0`, `--fund-rounds=-2`, `--fund-rounds=three`, an unsafe integer, a flag without `=N`), a repeated flag, an unknown `--` token | quotes the token |
| the old suffix forms `; allowance N`, `, allowance N`, `; fund N fix rounds`, `, fund N fix rounds`, `N more fix rounds` beside a digit, a row label, or `approve` | quotes the token and names the replacing flag |
| a flag with no row digit, row label, or `approve` | asks for a row |
| `5`, `6`, any other out-of-range digit, or the digit of a withheld row | names the rendered rows |

Unchanged rules, applied after the rejected-reply checks: a digit plus other non-flag text ("2 but rename the section") is a change request - revise, re-present, and read the approval only from the reply to the re-presented gate; `3` plus a change request is a change request; `3` plus another row digit prints the audit and re-presents, and the approval is read only from a clean reply; "revert applied council edit X" is a change request.

### 5. Rows 3 and 4

- Row 3 keeps today's behavior: print the audit verbatim from `git -C <abs worktree path> show -s --format=%b HEAD`, then re-present the same gate. The re-presented gate reuses the rendered rows, flag lines, tag, marker, and `Recommended:` line verbatim; it makes no new status or settings call. A re-present after a change request or revert reads the status and settings again and recomputes the recommendation.
- Row 4 is the former row 6, unchanged in effect: `**Amend-grant:** none`, exactly one `**Engine:** deferred`, publication, create-only retry, and cleanup per `skills/brainstorming/reference/spec-pr.md`. A `4` never grants. A later `/skill:brainstorming #N` re-gates the draft PR in whatever session runs it; the command does not reset context, so after `Create succeeds` prints the PR URL the gate prints one line with the created PR's number: ``Continue: start a fresh session, then run `/skill:brainstorming #<N>`.``
- Create-only retry view (push succeeded, PR creation failed): `spec-pr.md` renders only `4 - retry opening the draft PR` and `Withheld: implementation approvals - the handoff commit is published; an approval would amend it`. This view takes precedence over section 2 at any context reading, `unknown` included, and with any acceptance rows: row 4 carries `[recommended]`, the marker is `recommended=4`, and the reason line is `Recommended: 4 - the handoff commit is published; retrying the draft PR is the only action left.` Bare `approve` (after the echo) and `4` both run the existing retry - refresh, `origin/<branch>` == HEAD check, create only, no amend, no push. `1`, `2`, and `3` are withheld rows there and get the clarifying question naming the rendered rows.
- Marked and unmarked spec-PR re-gates render the same template with row 4 withheld, apply the recommendation rule, accept the same flags on rows 1 and 2, and keep their new-commit persistence.

### 6. Dependent text

Remove:

- the six option rows, the "Add ..." suffix line, and the six-row reply table in `spec-finalization.md` `## User Review Gate`
- the `; fund N fix rounds`, `N more fix rounds`, and `; allowance N` gate reply forms (no aliases; the stored header token is not a reply form and stays)
- "(experimental)" and "experimental" as a label on the loop engine in `spec-finalization.md`, `README.md` (the passages near lines 40 and 640), `doc/configuration.md` (near line 79), `doc/implement-engines.md` (line 3), `doc/personas.md` (line 9)
- the literal six-row assertions in `scripts/brainstorming-contract.test.mjs` and the `2 - approve, auto-apply amends:` and `` `2` at the spec gate `` token checks in `scripts/ci.mjs`

Add or reword:

| File | Change |
|---|---|
| `skills/brainstorming/reference/spec-finalization.md` | Sections 1, 2, 4, 5 above; the status call of section 3; zero-row text omits row 2 and its flag lines and composes with the other withholding conditions per section 1; every `1/2/4/5`, `4/5`, `1/2`, and `6` reference follows the new numbers. |
| `skills/brainstorming/SKILL.md` | Checklist preamble, step 13, and the User Review Gate pointer: route `1` to `/skill:writing-plans` and `2` to `/skill:loop-implementation`; `4` ends the flow after publishing. |
| `skills/brainstorming/reference/amendment-surface.md` | Standing grants: the gate grants on a `1` or `2` approval without `--amends-stop`, and a prose grant after an `--amends-stop` approval still counts; "The line." takes the sentence from the gate's default grant line, never the digit. The grant sentence count stays 2. The predicate, Value decoding, writers table, and the human-batch grammar are unchanged. |
| `skills/brainstorming/reference/spec-pr.md` | "Publish option 6" becomes row 4 (heading and every link to its anchor). Every draft-PR reply digit `6` in the file becomes `4`: the hidden, `3` plus, and change-request decodes, `On clean`, `A 6 never grants`, `replacing 6`, `re-present with 6 retryable` in the single and coordinated push tables, `6 - retry opening the draft PR`, and `Retry 6`. The link to finishing's `Step 6` and other unrelated numbers stay. "A funded `6` is malformed" becomes: a `4` with any flag is rejected. Approvals `1/2/4/5` become `1/2`; "omit 4/5" becomes "omit 2". The create-failure row gains the retry view's tag, marker, reason line, and reply handling from section 5; `Create succeeds` gains the `Continue:` line. |
| `skills/gauntlet-handoff/SKILL.md` | Step 6: before copying the `phase_tracker` status output, drop exactly its trailing `Context:` line (section 3); the rest stays verbatim. |
| `skills/brainstorming/reference/pr-subject.md` | Unmarked route: "with 6 withheld" becomes "with 4 withheld"; "On approval 1/2/4/5" becomes "On approval 1/2". |
| `skills/gauntlet-resume/reference/brief-contract.md` | "option 6's push" becomes "row 4's push". `## Producers`: the copied `phase_tracker status` output excludes its trailing `Context:` line; the layout, tracker grammar, example block, and consumer rules are unchanged. |
| `skills/loop-implementation/SKILL.md`, `skills/loop-implementation/reference/interrupted-recovery.md` | "approval option 4 and option 5 alike" becomes "with or without amend permission"; "Option 4 stops for amendments, option 5 auto-applies amends" is restated by amend permission; the carrier sentence names the `--allowance=N` flag. These keep every instruction's meaning. |
| `scripts/brainstorming-contract.test.mjs` | Pin the four row labels, the four flag lines, the `Recommended:` line, the absence of "(experimental)", and the absence of the old suffix forms as reply grammar. Replace, not keep, the old gate and doc assertions: the `4; allowance 6` / `5; allowance 6` gate tokens with their `bare option` and `waves-only` companions, and the `doc/gate-contract.md` match on `` `; allowance N` ``...`4/5`...`` `; fund N fix rounds` ``...`1/2`, each with the flag-grammar equivalent. |
| `scripts/loop-engine-contract.test.mjs` | Follow the reworded loop-skill literals. Replace, not keep, the assertions that pin the old gate and docs: `^4 -` / `^5 -` rows rendering `allowance <n> per row`, the `4` or `5` with a funding token reply row, README's `4; allowance 6`, and `doc/gate-contract.md`'s `funding on 4/5 and malformed tokens re-present` and `allowance <n> per row`, each with the row-2 `--allowance=N` equivalent. |
| `scripts/ci.mjs` | Token checks for the new gate (`1 - plan engine:`, `2 - loop engine:`, `--amends-stop`) and the reworded amendment-surface phrase; the grant-sentence count check stays 1 and 2, with its comment naming the default grant line. Absent-token checks for the loop-experimental phrases only: `Experimental approval options` and `experimental loop` in `README.md`, `experimental option` in `doc/configuration.md`, `experimental loop engine` in `doc/implement-engines.md` and `doc/personas.md`; other uses of "experimental" are not banned. A required-token check that `skills/gauntlet-handoff/SKILL.md` carries the `Context:` drop rule. |
| `extensions/phase-tracker.ts`, `extensions/phase-tracker.test.ts` | Section 3. |
| `doc/gate-contract.md`, `README.md`, `doc/configuration.md`, `doc/implement-engines.md`, `doc/personas.md`, `CHANGELOG.md` | Per Documentation impact. |

References to "Option 1/2" in `skills/finishing-a-development-branch/` and its docs name that skill's own menu and are untouched.

### 7. Evals (paid actions)

The gate text change alters what the agent says, so the two eval targets that render this gate are updated per `eval/README.md`, and `eval/spec-gate/intent.md` and `eval/brainstorming/intent.md` are rewritten for this change. The handoff producer's dropped line changes what `gauntlet-handoff` writes, so `eval/gauntlet-handoff/` gains one sample and its `intent.md` is rewritten too.

Paid action: the implementer or orchestrator runs `node eval/run.mjs <target> <sample>` for each sample below (with `--baseline-only` first when a sample's `bundle` lines change), in parallel with bounded concurrency. Approving this spec authorizes every such run for the whole flow - seed, rows, repairs, wording-fix reruns, and finish - with no per-step permission prompt. No target-wide sweep is run.

New samples:

| Sample | Must-hold facts |
|---|---|
| `spec-gate/recommended-row` | A full render shows exactly rows 1-4 with the fixed labels, one `[recommended]` tag, the matching `recommended=` marker, and a `Recommended:` line. Each flag appears only under the engine that accepts it, with the allowance default from the case's settings value. Independent branches: `Context: 12.0% of window` with single-outcome rows recommends 2; `Context: 31.0% of window` recommends 4 and the reason carries the percent and the instruction to start a fresh session and run `/skill:brainstorming #<N>` there, never a claim that the command resets context; the boundary readings `25.0` (engine row), `25.1` (row 4), and `26.0` (row 4); `Context: 31.0% of window` on a PR subject recommends an engine row and prints the `Withheld:` line; `Context: unknown` recommends an engine row; a row committing to two separately checkable outcomes recommends 1 and the reason quotes it and names them, while a row listing several facets of one observation (the fields of one rendered line) is not bundled and recommends 2; zero rows on the council path with no PR subject renders 1, 3, 4 with no `--allowance` line and recommends 1. Row 3 is never tagged. |
| `spec-gate/flag-replies` | Every accepted reply in section 4 persists the listed `**Amend-grant:**` and `**Engine:**` values, with the narration quoting the full grant value. Every rejected reply gets one clarifying question with the listed content and writes nothing. `2 --allowance=6` prints `run allowance: 6` immediately before the loop invocation. Bare `approve` echoes and takes the recommended row. `approve --amends-stop` echoes and persists `none` with the recommended engine row. `loop engine --allowance=6` acts as `2 --allowance=6`. `approve, stop on amends` and `1, stop on amends` each get one question naming `--amends-stop`; a worded funding request (`approve and fund 3 more rounds`) gets one question naming `--fund-rounds=N`; none of the three writes anything, persists the default grant, or is treated as a spec change request. |
| `gauntlet-handoff/status-context-line` | Given a `phase_tracker` status output ending in `Context: 31.0% of window`, the appended `## Process state` phase block ends at the last phase line, no `Context:` line appears anywhere in the brief, and every other status line is copied verbatim. |

Existing samples whose `case.md` or `expected.md` assert the six-row menu or its replies are rewritten to the new grammar, keeping each sample's subject, and rerun:

| Target | Samples |
|---|---|
| `spec-gate` | `full-council`, `partial-coverage`, `all-none`, `worker-path`, `drafted-rows-block`, `row-3-reply`, `option-6-handoff` |
| `brainstorming` | `loop-gate`, `loop-funded-reply`, `grant-budget-reply`, `engine-waves`, `spec-pr-regate`, `spec-pr-regate-legs`, `spec-pr-unmarked`, `spec-pr-publish-legs`, `pr-subject-gate`, `drafted-ac-rows` |

Facts these rewrites carry beyond the renumbering:

- `spec-gate/worker-path`: besides the no-audit render (1, 2, 4), the combined withholding cases - zero rows on the worker path renders 1, 4; a PR subject on the worker path renders 1, 2; a zero-row PR subject on the worker path renders row 1 only - each with its explanatory line.
- `spec-gate/option-6-handoff`: in the create-failure view, at `Context: 12.0% of window` and at `Context: unknown`, the only row is the retry row 4, tagged `[recommended]` with `recommended=4`; bare `approve` reruns create only, with no amend and no push; `1` and `2` get the clarifying question and write nothing. On success the `Continue: start a fresh session, then run ...` line follows the PR URL.
- `brainstorming/spec-pr-unmarked`: its `persist` fact flips - reply `1` on the unmarked route persists `**Engine:** waves`, the default grant sentence, and `**PR:**`.

The commit body names the tested samples, their outcomes, and the partial coverage; it states that the loop-skill rewording is meaning-preserving.

## Errors and edge cases

- Context reading unavailable (older extension without the line, `unknown`, failed status call): rule 1 is skipped; the gate renders normally.
- Context above 25% with row 4 withheld: the engine rules decide; the reason line does not mention context.
- Zero acceptance rows with context above 25% and row 4 rendered: rule 1 wins and row 4 is recommended.
- Create-only retry view at any context reading: row 4 is the only row and the recommended one; bare `approve` retries PR creation without amending or pushing; an engine digit gets the clarifying question.
- `/skill:brainstorming #<N>` typed into the same session re-gates there with the same context; only the operator starting a fresh session resets it.
- Approval with worded stop, grant, or budget intent (`approve, stop on amends`): one clarifying question naming the flag, nothing written; it never falls back to the default grant.
- Bare `approve` when row 4 is recommended publishes the draft PR, after the echo.
- A reply that names a withheld row's digit gets the clarifying question naming the rendered rows; it is never remapped to another row.
- `--amends-stop` chosen at the gate does not block a later grant: "auto-apply amends" at an amendment batch footer still grants, per the unchanged Standing grants writers table.
- A legacy spec, a deferred draft PR, and a resumed flow are read through the unchanged grant predicate: an absent or `none` line means no grant. The default flips only in what the gate writes on a new approval.
- A reply in the old grammar after upgrade: `2` now selects the loop engine, `4` the draft PR, `5` and `6` get the clarifying question. `CHANGELOG.md` names this as breaking.
- An external driver that reads `doc/gate-contract.md`: the marker gains `recommended=<n>`; row bodies still define accepted replies.
- The status `Context:` line appears on every `status` call in any phase; it is stored in the session file and visible to raw tool-result readers, and absent from the TUI row, the widget, and HTML export rows (which reuse the tool renderer). `gauntlet-handoff` drops it before copying the status output, so no brief carries it.

## Tests

- Four fixed rows, one sentence each (AC 1) - `scripts/brainstorming-contract.test.mjs`; sample `spec-gate/recommended-row`
- Per-engine flag lines with defaults (AC 2) - `scripts/brainstorming-contract.test.mjs`; samples `spec-gate/recommended-row`, `brainstorming/loop-gate`
- One tag, matching marker, `Recommended:` line (AC 3) - sample `spec-gate/recommended-row`; `scripts/gate-contract-lint.mjs` accepts the marker
- Context above 25% recommends row 4, with the readings `25.1` and `26.0`, and the reason tells the operator to start a fresh session before the command (AC 4) - sample `spec-gate/recommended-row`
- Unknown, 25% or lower (reading `25.0` included), or withheld row 4 never recommends 4 outside the retry view (AC 5) - sample `spec-gate/recommended-row`
- Zero rows recommends 1 (AC 6) - sample `spec-gate/recommended-row`
- Bundled row recommends 1 with the quoted row (AC 7) - sample `spec-gate/recommended-row`
- Plain case recommends 2 (AC 8) - sample `spec-gate/recommended-row`
- Status content ends in `Context: <p>% of window`, one decimal rounded up: 250000 of 1000000 tokens reads `25.0`, 250001 reads `25.1`, 260000 reads `26.0` (AC 9) - `extensions/phase-tracker.test.ts`
- Status content ends in `Context: unknown` for no usage, null tokens, zero window (AC 10) - `extensions/phase-tracker.test.ts`
- `details` of a status result is unchanged (AC 11) - `extensions/phase-tracker.test.ts`
- Reply `1` persistence and route (AC 12) - samples `brainstorming/engine-waves`, `spec-gate/flag-replies`
- Reply `2` persistence and route (AC 13) - samples `brainstorming/loop-gate`, `spec-gate/flag-replies`
- `--amends-stop` persists `none` (AC 14) - sample `spec-gate/flag-replies`
- `1 --fund-rounds=3` (AC 15) - samples `brainstorming/grant-budget-reply`, `spec-gate/flag-replies`
- `1 --amends-stop --fund-rounds=3` (AC 16) - samples `brainstorming/grant-budget-reply`, `spec-gate/flag-replies`
- `2 --allowance=6` carrier (AC 17) - samples `brainstorming/loop-funded-reply`, `spec-gate/flag-replies`
- Rejected replies, worded stop and funding intent included (AC 18) - samples `spec-gate/flag-replies`, `brainstorming/loop-funded-reply`
- Reply `3` (AC 19) - sample `spec-gate/row-3-reply`
- Reply `4`, with the `Continue:` line after the PR URL (AC 20) - samples `spec-gate/option-6-handoff`, `brainstorming/spec-pr-publish-legs`
- Create-only retry view recommends row 4 at low and unknown context, bare `approve` retries create only, engine digits are rejected - sample `spec-gate/option-6-handoff`
- PR subject omits row 4 (AC 21) - sample `brainstorming/pr-subject-gate`
- Zero rows omit row 2 and its flag lines (AC 22) - samples `brainstorming/loop-gate`, `spec-gate/option-6-handoff`
- No audit omits row 3 (AC 23) - sample `spec-gate/worker-path`
- Combined withholding: zero rows plus worker path, worker path plus PR subject, and all three (AC 21, AC 22, AC 23) - sample `spec-gate/worker-path`
- Bare `approve`, `approve` with flags, and a row label with flags (AC 24) - samples `spec-gate/all-none`, `spec-gate/flag-replies`
- Marked re-gate persistence (AC 25) - samples `brainstorming/spec-pr-regate`, `brainstorming/spec-pr-regate-legs`
- Unmarked-route reply `1` persists the default grant - sample `brainstorming/spec-pr-unmarked`
- No experimental label (AC 26) - `scripts/brainstorming-contract.test.mjs` for the gate; the `scripts/ci.mjs` absent-token checks for the four docs
- Handoff brief carries no `Context:` line - sample `gauntlet-handoff/status-context-line`; `scripts/ci.mjs` required token in `skills/gauntlet-handoff/SKILL.md`; `scripts/brief-contract-lint.test.mjs` stays green with the grammar unchanged
- No stale gate numbering on the changed surfaces - `rg -n -i 'options? [456]\b|\b4/5\b|1/2/4/5|approval option' README.md doc/gate-contract.md doc/configuration.md doc/implement-engines.md doc/personas.md skills/brainstorming skills/loop-implementation skills/gauntlet-handoff/SKILL.md skills/gauntlet-resume/reference/brief-contract.md`: every remaining hit names another skill's own menu (finishing's `Option 4` / `Option 5` rows in `doc/gate-contract.md`) or quotes an old form as a rejected reply
- Grant sentence count 1 and 2 - `scripts/ci.mjs`
- Loop-skill rewording keeps its pinned literals in step, and the old gate and doc pins are replaced - `scripts/loop-engine-contract.test.mjs`, `scripts/brainstorming-contract.test.mjs`
- Context above 25% with row 4 withheld, and zero rows with context above 25% - sample `spec-gate/recommended-row`
- Loop is faster than the plan engine - none: one plan-engine run on record, not a claim this spec makes

## Documentation impact

Per `reference/documentation-impact.md`:

- Feature / user-facing docs introduced: none
- Materially amended existing docs: doc/gate-contract.md (Reading a reply: four rows, three flags, `recommended=` on this gate; the loop stop table restated by amend permission - communication contract), README.md (What a run looks like, including its loop stop table and the workflow diagram's `option 6` edge label, the draft-PR handle paragraph, the settings table's `approval 4/5` cell, and the loop-engine operations pointer: four rows, default auto-apply, the 25% draft-PR recommendation - major procedure), doc/configuration.md (Loop engine operations and the approval-header paragraph: rows, flags, defaults; `### phase-tracker`: the `status` result's model-visible `Context:` line, kept out of the TUI and out of the handoff brief - operations), doc/implement-engines.md (Resume and amendments: the option 4 / option 5 wording restated by amend permission; Stops, models and telemetry: the `Stop / Option 4 / Option 5` table restated by amend permission and "written by gate option 6" becomes row 4 - communication contract), CHANGELOG.md (Unreleased: names the reply-grammar break)
- Derived / memory docs invalidated: doc/personas.md (the loop-implementer line calls the engine experimental)

## Out of scope

- The amendment review procedure, the grant predicate, Value decoding, and the mid-flow grant and revocation writers.
- The loop engine's and the plan engine's behavior after approval; `loopEngine` settings.
- A settings key for the 25% threshold or for the default grant.
- Aliases for the old digit meanings or the old suffix forms.
- Recommendations at any other gate; a dedicated context tool.
- Eval cases under `eval/loop-implementation/` and `eval/gauntlet-resume/`, and `eval/brainstorming/samples/loop-ledger-amend`, that label a run "option 4" or "option 5": they stay unedited in this change. Three rely on the label alone (`loop-implementation/interrupted-child-redispatch`, `loop-implementation/unreachable-cut`, `gauntlet-resume/interrupted-ownership`), and `brainstorming/loop-ledger-amend` judges against an "option 4" label too; after this change no skill file defines those labels. Before any selected rerun of one of these four samples - at the latest in the next change that edits its case - the label is translated into explicit amendment permission ("with amend permission" for option 5, "without amend permission" for option 4).
- The release level; it is chosen at release.

## Open questions

None.
