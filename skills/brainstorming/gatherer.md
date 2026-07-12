# Context Gather (brainstorming supplementary)

Consumed only by `SKILL.md` in this directory. Runs unconditionally between worktree
setup and the questionary. **Foreground, no user interaction** — the first thing the
operator sees after gather is questionary question one. Do not announce, do not ask.

## Dispatch

Mint a temp dir outside the worktree (never committed):

```bash
GATHER_DIR=$(mktemp -d)
```

Set the substep, then dispatch one parallel-tasks `subagent` call (foreground — no
`async:`; no `model:` — pi-cohort `agentOverrides` owns builder models):

```
phase_tracker({ action: "substep", phase: "brainstorm", substep: "gather" })
subagent({
  tasks: [
    { agent: "scout", cwd: "<abs worktree path>", phase: "context-gather",
      output: "<GATHER_DIR>/scout.md",
      task: "<scout task, template below>" },
    // include ONLY when the trigger rule below fires:
    { agent: "context-builder", cwd: "<abs worktree path>", phase: "context-gather",
      output: "<GATHER_DIR>/external.md",
      task: "<context-builder task, template below>" }
  ]
})
```

Absolute `output:` paths are mandatory: relative paths in parallel mode resolve
against the worktree and would get committed.

## Task templates

Scout (always dispatched):

> Recon for an upcoming design discussion. The request: `<initial prompt verbatim>`.
> Map the territory this change touches: relevant files with line ranges, existing
> patterns and conventions the change must match, test conventions, integration
> points, and whether the codebase or ecosystem already solves any of this. Cite
> exact paths and line ranges. End with an "Open questions that matter for the spec"
> section. Compact handoff, not a dump.

Context-builder (conditional):

> Extract external context for an upcoming design discussion. The request:
> `<initial prompt verbatim>`. Fetch and distill these references:
> `<detected refs, one per line>`. For each: acceptance criteria, hard constraints,
> linked discussion that changes scope, and contradictions with the request as
> stated. Write ONLY the context handoff to your output path; do NOT produce a
> meta-prompt file. End with an "Open questions that matter for the spec" section.
> If a ref is unreadable, say so explicitly and continue.

(The meta-prompt exclusion matters: in chain mode context-builder emits two files —
`context.md` + `meta-prompt.md`; this flow consumes only the context handoff.)

## Context-builder trigger rule

Dispatch context-builder when the initial prompt (or a file it explicitly references)
contains any of:

- an `http(s)://` URL;
- a tracker-style ID matching `[A-Z][A-Z0-9]+-\d+` (Linear/Jira form) **when a fetch
  path exists** (a tracker tool/MCP, or a URL pattern in `.pi/gauntlet-overrides.md`);
- a GitHub-style ref `owner/repo#N`, or a bare `#N` when the repo's tracker is
  GitHub Issues.

Examples: "implement ABC-123" with a Linear tool available → trigger; "add rate
limiting like https://example.com/rfc" → trigger; "rename the settings resolver" →
scout only. An opaque ID with **no** fetch path → do not dispatch; list it in the
draft's `## External context` as an unfetched ref instead of guessing.

## Failure and degradation

A builder **failed** when its task errored **or** its output file is missing or
empty (0 bytes). Degradation never blocks and never surfaces to the user at gather
time:

- scout failed → `## Codebase recon` reads: `Scout recon failed (<one-line reason>).
  Draft is thin; exploration falls to the questionary.` followed by the initial prompt.
- context-builder failed → `## External context` reads: `External refs not fetched
  (<one-line reason>):` followed by the ref list — the critique pass later surfaces
  them as external-ref candidates.

## Draft assembly

Read the temp files and write the draft **to the spec path** (normal filename
convention; slug minted from the initial prompt):

```markdown
# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing

## Codebase recon
<scout output, or the degraded text>

## External context
<context-builder output, degraded text, or unfetched-ref list; omit this section
only when the trigger rule never fired>

## Appended during questionary
<starts empty>
```

The marker line is **line 1, verbatim**. Then clean up and clear the substep:

```bash
rm -rf "$GATHER_DIR"
```

```
phase_tracker({ action: "substep", phase: "brainstorm", substep: null })
```

The questionary runs under plain `brainstorm`.
