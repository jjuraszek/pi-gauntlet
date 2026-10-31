# Subagent personas

Deep reference for the 10 personas in [`agents/`](../agents/), dispatched via [pi-cohort](https://github.com/jjuraszek/pi-cohort). See the [README](../README.md) for the workflow overview; the frontmatter-knobs table and the rationale behind each pin are in [Frontmatter knobs](#frontmatter-knobs) below.

- `implementer` - strict RED -> GREEN -> REFACTOR TDD with test-economy defaults.
- `wave-reviewer` - read-only integrated wave review: a clause table over supplied spec anchors plus Critical/Moderate/Minor findings; without spec anchors, findings only. Critical and Moderate findings block; Minor findings are nits.
- `conformance-reviewer` — closing-loop intent gate; confronts the delivered code+docs against the *origin* (spec + verbatim prompt), skipping the plan, and emits a per-requirement coverage verdict. Spec clauses no human input required and nothing depends on are reported once as `UNAUTHORIZED` (over-spec), with `recommended: fix` only when removal is contained. Read-only; proposes remediation, never fixes or decides. Ships model-free — pin its model per preset (see [Configuration: conformance gate model](./configuration.md#conformance-gate-model)).
- `spec-summarizer` - produces a plain-language briefing (at most 300 words) of one spec for the brainstorming user review gate. Fresh context, read-only (`tools: read`), reads only the spec it is given; output is ephemeral (rendered at the gate, never committed). Dispatched only by `brainstorming`; not for direct dispatch. Ships model-free - set `subagents.agentOverrides.spec-summarizer.model` per preset to override (unset -> inherits the main loop).
- `loop-implementer` - guarded single-row implementation for the experimental loop engine, with evidence, one commit and one bounded decision line; seed alone covers all open rows. Fresh context; tools `read, write, edit, bash`; model and thinking unset. Pin `subagents.agentOverrides.loop-implementer.model` independently of the parent. See [Loop engine operations](configuration.md#loop-engine-operations).
- `plan-writer` - writes, checks, and repairs the implementation plan for one approved spec in a fresh context; the plan file is its only output and its reply is one line (`PLAN WRITTEN <path>` or `OPEN QUESTIONS <path>`). Runs its own `plan_check` loop (the stamp still comes from the parent's call). Dispatched only by `writing-plans`; not for direct dispatch. Ships model-free - set `subagents.agentOverrides.plan-writer.model` per preset to override (unset -> inherits the main loop, the same as `spec-summarizer`).
- `spec-council-member` — adversarial single-model spec critic; one per configured council model. Flags unrelated extras or sufficient in-scope simplifications as `over-spec`; every report closes with a mandatory `lean:` line; findings other than `over-spec` end with `probed: <source or check> - <result>` or `probed: none`. Dispatched by `roasting-the-spec` and `shape-ticket` (the latter at `:low` thinking via a model-suffix override, for ticket roasts), and by brainstorming's `reference/amendment-surface.md` in `Mode: amendment-review` (a task-text discriminator; one `auto-apply | escalate` line per proposed spec amendment) on the main loop's own model and reasoning level.
- `spec-council-synthesizer` — neutral chair that consolidates and adjudicates member critiques. Preserves `over-spec:` as a cluster prefix (an over-spec cluster loses only to a finding proving the clause load-bearing) and tallies `lean:` across members; tags each suggested edit `grounded:` (member probes support every assertion) or `hypothesis:`. Dispatched only by `roasting-the-spec` and `shape-ticket` (the latter at `:low` thinking via a model-suffix override, for ticket roasts).

- `spec-council-applier` - fresh-context scope advocate and executor dispatched only by `roasting-the-spec`; edits only the supplied spec and returns the Applied/Deferred/Rejected audit. Inherits the main loop's model and thinking unless `subagents.agentOverrides['spec-council-applier']` overrides either; not for direct dispatch.

- `pr-gatekeeper` - orchestrates one PR's assessment or queued action in a multi-PR `gatekeep-pr` set; returns a result line to the parent, never a human menu. Ships with model and thinking unset, resolved through `subagents.agentOverrides.pr-gatekeeper`, else inherited from the main loop. Not for direct dispatch.

## Where personas land

On a user install the ten personas in `agents/` are symlinked into `getAgentDir()/agents` (profile-scoped user dir - `$PI_CODING_AGENT_DIR/agents`, default `~/.pi/agent/agents`). On a project install they are copied into `<repo>/.pi/agents/` (project scope, isolated per repo). Override precedence is `project > user > builtin`, so a project install always shadows the user personas for that repo, and you can hand-edit or drop your own `.pi/agents/<name>.md` to shadow them further.

Target dir override: set `PI_GAUNTLET_AGENT_DIR` to force symlinking into a specific dir (leading `~` expanded; always symlink mode). See [install-internals.md](./install-internals.md) for the full symlink-vs-copy mechanics.

## Thinking budgets

`implementer` and `wave-reviewer` ship without `thinking:` in their frontmatter — pi-cohort `agentOverrides` only fill frontmatter-unset fields, so leaving it unset makes the budget a per-preset config knob. Set it in each preset's `settings.json` (use `false` on non-thinking models → provider default):

```json
{
  "subagents": {
    "agentOverrides": {
      "implementer": { "thinking": "medium" },
      "wave-reviewer": { "thinking": "high" }
    }
  }
}
```

Move both `.model` and `.thinking` pins from `subagents.agentOverrides.code-reviewer` and `.spec-reviewer` to `subagents.agentOverrides.wave-reviewer`, choosing one review budget; remove the old keys, which no longer select a shipped persona.

Unset → provider default thinking for that model. `conformance-reviewer` and the two pinned council personas (`spec-council-member` and `spec-council-synthesizer`) stay frontmatter-pinned at `xhigh` and preset-level `agentOverrides` cannot unset that pin - the gate and those critics run at max budget even when they inherit the session's model; the applier is unpinned and inherits the main loop's thinking unless overridden. A call-site model-string thinking suffix is a separate override path and does bypass the pin: `shape-ticket` dispatches the council members/synthesizer at `:low` this way for cheap ticket roasts (see above), and brainstorming's amendment review dispatches `spec-council-member` with the main loop's own level (`$PI_REASONING_LEVEL`; `max` maps to `xhigh`, `off` drops the suffix).

## Frontmatter knobs

Body text becomes the child's system prompt (`systemPromptMode: replace`). Frontmatter knobs are **not overridable** at `subagent()` call time; the only callable knobs are `model`, `task`, `output`, `outputMode`, `reads`, `progress`, `skill`. Preset-level `subagents.agentOverrides.<agent>` fills only fields the frontmatter left unset (pi-cohort `agents.ts`), so a frontmatter pin kills the config knob. Editing a persona body or frontmatter follows `/skill:forge-skill` `## Persona rules`.

| Knob | loop-implementer | implementer | wave-reviewer | conformance-reviewer | spec-council-member | spec-council-synthesizer | spec-summarizer | plan-writer | spec-council-applier | pr-gatekeeper |
|---|---|---|---|---|---|---|---|---|---|---|
| `tools` | `read, write, edit, bash` | `read, write, edit, bash, grep, find, ls` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read` | `read, grep, find, ls, bash, write, plan_check` | `read, grep, find, ls, bash, edit, write` | `read, grep, find, ls, bash, edit, write, subagent, gauntlet_setting, plan_tracker` |
| `thinking` | - | - | - | `xhigh` | `xhigh` | `xhigh` | - | - | - | - |
| `defaultContext` | `fresh` | `fork` | `fresh` | `fresh` | `fresh` | `fresh` | `fresh` | - | `fresh` | `fresh` |
| `inheritProjectContext` | `true` | `true` | `true` | `true` | `true` | `true` | `false` | `false` | `true` | `true` |
| `inheritSkills` | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` | `false` |
| `completionGuard` | `true` | `false` | `false` | `false` | `false` | `false` | `false` | `true` | `false` | `false` |

Why each pin:

- **`pr-gatekeeper` is the first persona combining `subagent` with extension-tool rights for per-PR orchestration.** `plan-writer` already allows the extension tool `plan_check`; the new boundary adds nested dispatch plus `gauntlet_setting` and session-local `plan_tracker`. Each child runs fresh Verify then Review sequentially in its supplied worktree and delegates tracked source edits and commits to implementer. The parent supplies `skill: "gatekeep-pr"`, the batch contract, and an absolute installed procedure root explicitly; `inheritSkills: false` prevents unrelated discovery, not this task-scoped injection. `defaultContext: fresh`, `inheritProjectContext: true`, `systemPromptMode: replace`, and `completionGuard: false` isolate the orchestrator without treating its result-line handoff as implementation completion. Model and thinking stay unset. The parent retains human menus, confirmations, and teardown; see the [batch contract](../skills/gatekeep-pr/reference/batch.md).

- **`plan-writer` runs baseline commands and writes only the plan.** It uses `bash` for git/jj provenance and task test commands on the base commit, never for source edits or VCS mutations, and validates the plan with `plan_check`, the extension tool a `tools:` allowlist would otherwise exclude; `defaultContext` is unset because `writing-plans` names `context: "fresh"` on every dispatch, `inheritProjectContext: false` because the body reads `AGENTS.md` and the overrides file itself, and `completionGuard: true` because it is an implementing persona.

- **Reviewers are fresh and read-only** (no edit tools) so they stay skeptical of the parent's context.
- **`implementer` forks** the parent's session but `inheritSkills: false` avoids dispatch loops through skill discovery. Its explicit `completionGuard: false` lets structured `NEEDS_CONTEXT` and `BLOCKED` returns survive without edits; the guard hid those statuses. The isolated-wave caller owns the equivalent edit-less-completion check: its patch requirement rejects an edit-less `DONE` as a failed attempt before integration. In-place waves and non-wave callers retain gate/review coverage, not a new patch detector.
- **`inheritProjectContext: true`** lets agents adapt to the consumer's `AGENTS.md`; `spec-summarizer` sets it `false` and takes `tools: read` only, so it reads nothing but the spec passed to it - a confused briefing or a long Missing-from-the-spec block signals a thin spec.
- **`thinking` unset on `implementer`/`wave-reviewer`** so each preset supplies it (see [Thinking budgets](#thinking-budgets)). `conformance-reviewer` and the two pinned council personas pin `xhigh`: the gate often inherits the main session's model (`closureReview.model` unset) and must run at max budget regardless of preset config; the applier is unpinned.
- **`spec-council-applier` leaves `thinking` unset** so it tracks the main loop unless `agentOverrides` supplies a budget. Its edit/write tools serve spec-only edits; `completionGuard: false` keeps this spec executor outside the implementation completion guard.
- **`spec-council-member` and `spec-council-synthesizer` keep `bash`** because it is in the output path: `roasting-the-spec` dispatches members with an `output:` path and pi-cohort injects `Write your findings to: <path>` into every such task (`single-output.ts` `injectSingleOutputInstruction`). Without a write-capable tool the member is told to write a file it cannot write; observed failures were preamble stubs and stalls, critique lost before the chair saw it. Members write via `cat > <output>`; the persona pins a read-only invariant otherwise, and verification scope is dispatch-supplied.
- **`spec-summarizer` cannot satisfy that injected instruction** with `tools: read`; it relies on the harness persisting its final text to the path (`persistSingleOutput`) and a directive not to attempt the write. `brainstorming` dispatches it with an `output:` temp path + `outputMode: "file-only"` so the summary survives pi-condense and is read back verbatim.
- **No `model:` on `spec-council-member`, `spec-council-synthesizer`, `spec-council-applier`, `spec-summarizer`, `plan-writer`, `conformance-reviewer`.** Member/chair models come from `piGauntlet.specCouncil.members` / `.chair`, with the main loop's model as the chair fallback. `spec-summarizer`, `plan-writer`, and `spec-council-applier` omit dispatch `model:` so pi-cohort resolves their `subagents.agentOverrides` model, else the main loop's model. Conformance uses `piGauntlet.closureReview.model` (repo-local first; `skills/verification-before-completion/reference/settings-precedence.md`). The phase-tracker guard blocks a conformance dispatch that omits `model:` inside a brainstorming-entered flow.

`conformance-reviewer` diverges from `wave-reviewer` deliberately: wave-reviewer checks anchored spec clauses and ranks bugs by severity; conformance-reviewer confronts the deliverable against the origin (spec + verbatim prompt, not the plan) and emits per-requirement `DELIVERED/PARTIAL/MISSING/DRIFTED/UNAUTHORIZED`. `UNAUTHORIZED` also covers spec-laundered excess: a spec clause no human input required and nothing depends on is reported once with origin `none (scope creep)` and an `evidence:` line opening `spec "<section>" - "<clause>" (over-spec)`; each row follows its `recommended` value (`fix` only when removal is contained). Dispatch it as its own call, never fused into the whole-PR code review.

The `external-ref` chain: `spec-council-member` emits the `external-ref` finding kind, `spec-council-synthesizer` surfaces it as an `external-ref:` cluster, `brainstorming` inlines the referenced content before dispatching `spec-summarizer`, so the summarized spec is self-contained.
