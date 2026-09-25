# Context Gather (brainstorming supplementary)

Consumed only by `SKILL.md` in this directory. Runs unconditionally between worktree
setup and the questionary. **Foreground, no user interaction** — the first thing the
operator sees after gather is questionary question one. Do not announce, do not ask.

## Dispatch

Mint a temp dir outside the worktree (never committed):

```bash
GATHER_DIR=$(mktemp -d)
```

Set the substep, then dispatch one foreground parallel-tasks `subagent` call (`async: false`; no
`model:` — pi-cohort `agentOverrides` owns builder models). Preserve the parallel batch and await
its terminal result before assembling the draft:

```
phase_tracker({ action: "substep", phase: "brainstorm", substep: "gather" })
subagent({
  async: false,
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

`<SPEC_INDEX>` is `<directory of this skill's SKILL.md>/../../bin/gauntlet-spec-index.mjs`,
resolved to an absolute path by the main loop from the skill's `<location>` in the system prompt
before pasting the task.

## Task templates

Scout (always dispatched):

> Recon for an upcoming design discussion. The request: `<initial prompt verbatim>`.
> Map the territory this change touches: relevant files with line ranges, existing
> patterns and conventions the change must match, test conventions, integration
> points, and whether the codebase or ecosystem already solves any of this. Cite
> exact paths and line ranges. If a spec you cite carries a supersession marker
> (default: a `> **Superseded by:**` banner; the project's overrides may define
> another format), follow the successor for the superseded scope and cite it
> instead; cite the old spec only for its unsuperseded sections (banner contract:
> `reference/superseding.md`). Predecessor check: compose a 5-15 term keyword query
> from the request (topic nouns, component names, file names - not stop words; if
> the request is only a ticket reference, take the terms from the ticket title via
> the tracker CLI when one is available, otherwise use the fallback below). Run
> `node <SPEC_INDEX> --query '<keywords>' --limit 10` from the worktree root,
> keeping the keywords inside single quotes, and treat its rows as the candidate
> list. If the command fails, fall back to listing the project's spec directory
> and reading titles and `**Goal:**` lines, and write
> `Spec index unavailable - predecessor check used directory listing.` in your
> handoff. Either way open at
> most five candidates whose topic matches this request, and name any whose design
> this request replaces or amends with the section(s) affected - `Predecessor:
> <path>, <scope>` - or `Predecessor: none`.
> Judge by topic; shared file paths never decide.
> The `files` column of each candidate row is the `;`-separated list of repo-relative
> paths that predecessor's ship modified and that still exist, or the literal `missing`,
> or blank; do not recompute it from git or telemetry. After the `Predecessor:` line(s),
> and only when at least one predecessor is named, render a `Predecessor anchors`
> section: list every attributed path exactly once, attributed to the first named
> predecessor in index output order whose cell lists it, with no per-path commentary
> (bookkeeping paths such as `CHANGELOG.md` are listed like any other); for each named
> predecessor whose cell is `missing`, write one line
> `<spec>: modified file list missing for this spec`, where `<spec>` is the path exactly
> as written in its `Predecessor:` line. A blank cell contributes nothing for that spec;
> a named predecessor with no index row (reached through a supersession banner, or named
> from the directory-listing fallback) contributes no path and no `missing` line. When
> no path and no `missing` line results - including whenever the index was unavailable -
> omit the section entirely; `Predecessor: none` produces no anchors section. The anchors
> are a recon hint, never a selection input. End with an
> "Open questions that matter for the spec"
> section. Compact handoff, not a dump.

Context-builder (conditional):

> Extract external context for an upcoming design discussion. The request:
> `<initial prompt verbatim>`. Fetch and distill these references:
> `<detected refs, one per line>`. For each: acceptance criteria, hard constraints,
> linked discussion that changes scope, and contradictions with the request as
> stated. Quote the ticket's acceptance-criteria rows verbatim under their own
> `## Ticket acceptance criteria (verbatim)` heading before distilling the rest;
> brainstorming copies these rows unchanged into the spec and the council's
> `Human input` block. Write ONLY the context handoff to your output path; do NOT
> produce a meta-prompt file. End with an "Open questions that matter for the spec"
> section.
> If a ref is unreadable, say so explicitly and continue.

(The meta-prompt exclusion matters: in chain mode context-builder emits two files —
`context.md` + `meta-prompt.md`; this flow consumes only the context handoff.)

## Context-builder trigger rule

Dispatch context-builder when the initial prompt (or a file it explicitly references)
contains any of:

- an `http(s)://` URL;
- a tracker-style ID matching `[A-Z][A-Z0-9]+-\d+` (Linear/Jira form) **when a fetch
  path exists** (a tracker tool/MCP, or a URL pattern in the gauntlet overrides file,
  see Project overrides). A tracker excluded by an overrides `## Issue tracker`
  `tracker:` key has no fetch path regardless of installed tools; its IDs are listed
  as unfetched refs;
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
