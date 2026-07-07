# Subagent personas

Deep reference for the 7 personas in [`agents/`](../agents/), dispatched via [pi-cohort](https://github.com/jjuraszek/pi-cohort). See the [README](../README.md) for the workflow overview and [AGENTS.md](../AGENTS.md#agents) for the frontmatter-knobs table and the rationale behind each pin.

- `implementer` — strict RED→GREEN→REFACTOR TDD, completion-guarded.
- `code-reviewer` — read-only review, Critical/Moderate/Minor severity.
- `spec-reviewer` — verifies an implementation against its plan/spec, per-requirement table.
- `conformance-reviewer` — closing-loop intent gate; confronts the delivered code+docs against the *origin* (spec + verbatim prompt), skipping the plan, and emits a per-requirement coverage verdict. Read-only; proposes remediation, never fixes or decides. Ships model-free — pin its model per preset (see [Configuration: conformance gate model](./configuration.md#conformance-gate-model)).
- `spec-summarizer` - produces a tight, spec-only human summary for the brainstorming user review gate. Fresh context, read-only (`tools: read`), reads only the spec it is given; output is ephemeral (rendered at the gate, never committed). Dispatched only by `brainstorming`; not for direct dispatch. Ships model-free - set `subagents.agentOverrides.spec-summarizer.model` per preset to override (unset -> inherits the main loop).
- `spec-council-member` — adversarial single-model spec critic; one per configured council model. Dispatched only by `roasting-the-spec`.
- `spec-council-synthesizer` — neutral chair that consolidates and adjudicates member critiques. Dispatched only by `roasting-the-spec`.

## Where personas land

On a user install the seven personas in `agents/` are symlinked into `getAgentDir()/agents` (profile-scoped user dir — `$PI_CODING_AGENT_DIR/agents`, default `~/.pi/agent/agents`). On a project install they are copied into `<repo>/.pi/agents/` (project scope, isolated per repo). Override precedence is `project > user > builtin`, so a project install always shadows the user personas for that repo, and you can hand-edit or drop your own `.pi/agents/<name>.md` to shadow them further.

Target dir override: set `PI_GAUNTLET_AGENT_DIR` to force symlinking into a specific dir (leading `~` expanded; always symlink mode). See [install-internals.md](./install-internals.md) for the full symlink-vs-copy mechanics.

## Thinking budgets

`implementer`, `code-reviewer`, and `spec-reviewer` ship without `thinking:` in their frontmatter — pi-cohort `agentOverrides` only fill frontmatter-unset fields, so leaving it unset makes the budget a per-preset config knob. Set it in each preset's `settings.json` (use `false` on non-thinking models → provider default):

```json
{
  "subagents": {
    "agentOverrides": {
      "implementer": { "thinking": "medium" },
      "code-reviewer": { "thinking": "high" },
      "spec-reviewer": { "thinking": "medium" }
    }
  }
}
```

Unset → provider default thinking for that model. `conformance-reviewer` and the two `spec-council-*` personas stay frontmatter-pinned at `xhigh` and are not configurable — the gate and the council must run at max budget even when they inherit the session's model.

For the full frontmatter-knobs table (`tools`, `thinking`, `defaultContext`, `inheritProjectContext`, `inheritSkills`, `completionGuard` per persona) and the rationale behind each pin, see [AGENTS.md#agents](../AGENTS.md#agents).
