# Subagent personas

Deep reference for the 7 personas in [`agents/`](../agents/), dispatched via [pi-cohort](https://github.com/jjuraszek/pi-cohort). See the [README](../README.md) for the workflow overview; the frontmatter-knobs table and the rationale behind each pin are in [Frontmatter knobs](#frontmatter-knobs) below.

- `implementer` — strict RED→GREEN→REFACTOR TDD, completion-guarded.
- `code-reviewer` — read-only review, Critical/Moderate/Minor severity.
- `spec-reviewer` — verifies an implementation against its plan/spec, per-requirement table.
- `conformance-reviewer` — closing-loop intent gate; confronts the delivered code+docs against the *origin* (spec + verbatim prompt), skipping the plan, and emits a per-requirement coverage verdict. Spec clauses no human input required and nothing depends on are reported once as `UNAUTHORIZED` (over-spec), with `recommended: fix` only when removal is contained. Read-only; proposes remediation, never fixes or decides. Ships model-free — pin its model per preset (see [Configuration: conformance gate model](./configuration.md#conformance-gate-model)).
- `spec-summarizer` - produces a tight, spec-only human summary for the brainstorming user review gate. Fresh context, read-only (`tools: read`), reads only the spec it is given; output is ephemeral (rendered at the gate, never committed). Dispatched only by `brainstorming`; not for direct dispatch. Ships model-free - set `subagents.agentOverrides.spec-summarizer.model` per preset to override (unset -> inherits the main loop).
- `spec-council-member` — adversarial single-model spec critic; one per configured council model. Emits an `over-spec` finding for clauses outside the problem, unrequested by any human input, and unnecessary to deliver; every report closes with a mandatory `lean:` line. Dispatched only by `roasting-the-spec` and `shape-ticket` (the latter at `:low` thinking via a model-suffix override, for ticket roasts).
- `spec-council-synthesizer` — neutral chair that consolidates and adjudicates member critiques. Preserves `over-spec:` as a cluster prefix (an over-spec cluster loses only to a finding proving the clause load-bearing) and tallies `lean:` across members. Dispatched only by `roasting-the-spec` and `shape-ticket` (the latter at `:low` thinking via a model-suffix override, for ticket roasts).

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

Unset → provider default thinking for that model. `conformance-reviewer` and the two `spec-council-*` personas stay frontmatter-pinned at `xhigh` and preset-level `agentOverrides` cannot unset that pin — the gate and the council run at max budget even when they inherit the session's model. A call-site model-string thinking suffix is a separate override path and does bypass the pin: `shape-ticket` dispatches the council members/synthesizer at `:low` this way for cheap ticket roasts (see above).

## Frontmatter knobs

Body text becomes the child's system prompt (`systemPromptMode: replace`). Frontmatter knobs are **not overridable** at `subagent()` call time; the only callable knobs are `model`, `task`, `output`, `outputMode`, `reads`, `progress`, `skill`. Preset-level `subagents.agentOverrides.<agent>` fills only fields the frontmatter left unset (pi-cohort `agents.ts`), so a frontmatter pin kills the config knob.

| Knob | implementer | code-reviewer | spec-reviewer | conformance-reviewer | spec-council-member | spec-council-synthesizer | spec-summarizer |
|---|---|---|---|---|---|---|---|
| `tools` | `read, write, edit, bash, grep, find, ls` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read` |
| `thinking` | - | - | - | `xhigh` | `xhigh` | `xhigh` | - |
| `defaultContext` | `fork` | `fresh` | `fresh` | `fresh` | `fresh` | `fresh` | `fresh` |
| `inheritProjectContext` | `true` | `true` | `true` | `true` | `true` | `true` | `false` |
| `inheritSkills` | `false` | `false` | `false` | `false` | `false` | `false` | `false` |
| `completionGuard` | `true` | `false` | `false` | `false` | `false` | `false` | `false` |

Why each pin:

- **Reviewers are fresh and read-only** (no edit tools) so they stay skeptical of the parent's context.
- **`implementer` forks** the parent's session but `inheritSkills: false` avoids dispatch loops through skill discovery.
- **`inheritProjectContext: true`** lets agents adapt to the consumer's `AGENTS.md`; `spec-summarizer` sets it `false` and takes `tools: read` only, so it reads nothing but the spec passed to it - a thin summary signals a thin spec.
- **`thinking` unset on `implementer`/`code-reviewer`/`spec-reviewer`** so each preset supplies it (see [Thinking budgets](#thinking-budgets)). `conformance-reviewer` and the council pin `xhigh`: the gate often inherits the main session's model (`closureReview.model` unset) and must run at max budget regardless of preset config.
- **`spec-council-*` keep `bash`** because it is in the output path: `roasting-the-spec` dispatches members with an `output:` path and pi-cohort injects `Write your findings to: <path>` into every such task (`single-output.ts` `injectSingleOutputInstruction`). Without a write-capable tool the member is told to write a file it cannot write; observed failures were preamble stubs and stalls, critique lost before the chair saw it. Members write via `cat > <output>`; the persona pins a read-only invariant otherwise, and verification scope is dispatch-supplied.
- **`spec-summarizer` cannot satisfy that injected instruction** with `tools: read`; it relies on the harness persisting its final text to the path (`persistSingleOutput`) and a directive not to attempt the write. `brainstorming` dispatches it with an `output:` temp path + `outputMode: "file-only"` so the summary survives pi-condense and is read back verbatim.
- **No `model:` on `spec-council-*`, `spec-summarizer`, `conformance-reviewer`.** The dispatching skill injects it per task: council from `piGauntlet.specCouncil.members` / `.chair`, summarizer from `subagents.agentOverrides.spec-summarizer.model`, conformance from `piGauntlet.closureReview.model` (repo-local first; `skills/verification-before-completion/reference/settings-precedence.md`). The phase-tracker guard blocks a conformance dispatch that omits `model:` inside a brainstorming-entered flow.

`conformance-reviewer` diverges from `code-reviewer` deliberately: code-reviewer ranks bugs by severity; conformance-reviewer confronts the deliverable against the origin (spec + verbatim prompt, not the plan) and emits per-requirement `DELIVERED/PARTIAL/MISSING/DRIFTED/UNAUTHORIZED`. `UNAUTHORIZED` also covers spec-laundered excess: a spec clause no human input required and nothing depends on is reported once with origin `none (scope creep)` and an `evidence:` line opening `spec "<section>" - "<clause>" (over-spec)`; each row follows its `recommended` value (`fix` only when removal is contained). Dispatch it as its own call, never fused into the whole-PR code review.

The `external-ref` chain: `spec-council-member` emits the `external-ref` finding kind, `spec-council-synthesizer` surfaces it as an `external-ref:` cluster, `brainstorming` inlines the referenced content before dispatching `spec-summarizer`, so the summarized spec is self-contained.
