# Brainstorm context gathering: parallel recon draft at the spec path

## Context

`/skill:brainstorming` step 3 ("Explore project context") tells the main loop to read files, docs, and commits inline, with no method. Two costs in practice:

- **Pollution:** raw whole-file reads burn the main session's context, and pi-condense prunes them — often right before spec-writing, when they are needed most.
- **Serialization:** exploration, worktree setup, and the questionary run strictly sequentially even though exploration has no dependency on the dialogue.

pi-cohort ships the primitives to fix both: `scout` (cheap recon agent, `thinking: low`), `context-builder` (external-resource + requirements extraction agent, `thinking: medium`, has `fetch`), and parallel dispatch with per-task output files. Their relevant behavior is inlined below (Components section) so this spec is self-contained; `prompts/parallel-context-build.md` informed the output-contract shape and `prompts/gather-context-and-clarify.md` informed task wording only — its interview/clarify half is explicitly not adopted.

## Problem

Brainstorming needs gathered context that (a) does not live only in LLM context (pruning/restart loses it), (b) does not pollute the main session with raw reads, and (c) does not add a second human gate or a second questioning mode.

## Decision summary

- **Unconditional gather step** in `brainstorming`, between worktree setup and the questionary. No user interaction: the first thing the operator sees after gather is questionary question one. The gather runs **foreground and synchronous** (`async` not set): question one must already be draft-informed — that sharpness is the point (see Out of scope for the rejected background variant).
- Gather = one `subagent` **parallel-tasks call** (`tasks:` mode, not chain mode): `scout` always; `context-builder` **only when the request carries external refs** (trigger rule below). Fresh contexts, **absolute `mktemp -d` output paths**, `phase: "context-gather"`, no `model:` (pi-cohort `agentOverrides` owns models; no new `piGauntlet.*` key).
- Main loop assembles builder outputs into a **context draft at the spec file path** (normal filename convention, slug minted from the initial prompt). The draft is the persistence mechanism: it survives pruning and session restarts for the whole questionary.
- At spec-writing, the main loop **re-reads the draft, then fully replaces the file** with the `write` tool, and **verifies the marker is gone immediately after the write** — before any downstream dispatch. Nothing downstream of spec-writing (lint, critique, council, summarizer, planner) ever reads draft content.
- Machinery lives in a **supplementary file `skills/brainstorming/gatherer.md`**, referenced by name from `SKILL.md`. It sits flat (not `reference/`) because it has exactly one consumer; `reference/` is the repo convention for cross-skill material (`documentation-impact.md`, `settings-precedence.md`).
- `extensions/phase-tracker.ts` gains **substep visibility** and a **marker commit guard** (details below).

## Components

### 1. `skills/brainstorming/gatherer.md` (new)

Owns the full gather procedure.

**Dispatch template** — parallel-tasks mode, foreground, temp-dir outputs:

```bash
GATHER_DIR=$(mktemp -d)   # absolute, outside the worktree, never committed
```

```
subagent({
  tasks: [
    { agent: "scout", cwd: "<abs worktree path>", phase: "context-gather",
      output: "<GATHER_DIR>/scout.md",
      task: "<scout task skeleton below, instantiated with the initial prompt>" },
    // context-builder task included ONLY when the trigger rule fires:
    { agent: "context-builder", cwd: "<abs worktree path>", phase: "context-gather",
      output: "<GATHER_DIR>/external.md",
      task: "<context-builder task skeleton below, instantiated with the detected refs>" }
  ]
})
```

No `async:` (foreground), no `model:`, `context` defaults are fine (both agents run fresh — `systemPromptMode: replace`, `inheritSkills: false`). Absolute `output:` paths are mandatory: relative paths in parallel mode resolve against the worktree and would be committed.

**Inlined agent behavior** (from pi-cohort `agents/scout.md` and `agents/context-builder.md`; re-verify against the installed pi-cohort when editing gatherer.md). *Conformance disposition 2026-07-12: gatherer.md carries this block in condensed form (the meta-prompt exclusion note plus the task templates) rather than verbatim - the full block below remains spec-level context, not shipped skill text.*

- `scout` writes one file in a fixed format: `# Code Context` with sections `## Files Retrieved` (exact paths + line ranges), `## Key Code` (critical types/functions/snippets), `## Architecture`, `## Start Here`. It cites exact file paths and line ranges and prefers targeted search over whole-file reads.
- `context-builder` reads/fetches every referenced URL, issue, PR, or doc (via its `fetch` tool, never `curl`). **When running in a chain it emits two files** (`context.md` + `meta-prompt.md`); we dispatch it in parallel-tasks mode with a single `output:` path and the task skeleton instructs it to write **only the context handoff** to that path and produce **no meta-prompt** — the meta-prompt is a planner-handoff artifact this flow does not consume.

**Scout task skeleton:**

> Recon for an upcoming design discussion. The request: `<initial prompt verbatim>`. Map the territory this change touches: relevant files with line ranges, existing patterns and conventions the change must match, test conventions, integration points, and whether the codebase or ecosystem already solves any of this. Cite exact paths and line ranges. End with an "Open questions that matter for the spec" section. Compact handoff, not a dump.

**Context-builder task skeleton:**

> Extract external context for an upcoming design discussion. The request: `<initial prompt verbatim>`. Fetch and distill these references: `<detected refs, one per line>`. For each: acceptance criteria, hard constraints, linked discussion that changes scope, and contradictions with the request as stated. Write ONLY the context handoff to your output path; do NOT produce a meta-prompt file. End with an "Open questions that matter for the spec" section. If a ref is unreadable, say so explicitly and continue.

**Context-builder trigger rule.** Dispatch it when the initial prompt (or an explicitly referenced file in it) contains any of:

- an `http(s)://` URL;
- a tracker-style ID matching `[A-Z][A-Z0-9]+-\d+` (Linear/Jira form) **when the project has a known fetch path for it** (a tracker tool/MCP, or a URL pattern in `.pi/gauntlet-overrides.md`);
- a GitHub-style ref `owner/repo#N` or a bare `#N` when the repo's tracker is GitHub Issues.

Examples: "implement ABC-123" with a Linear tool available → trigger; "add rate limiting like https://example.com/rfc" → trigger; "rename the settings resolver" → no trigger (scout only). An opaque ID with **no** fetch path → no dispatch; list it in the draft's `## External context` as an unfetched ref instead of guessing.

**Failure definition and degradation.** A builder failed when its task errored **or** its output file is missing or empty (0 bytes). Degradation never blocks and never surfaces to the user at gather time:

- scout failed → draft's `## Codebase recon` section reads: `Scout recon failed (<one-line reason>). Draft is thin; exploration falls to the questionary.` followed by the initial prompt.
- context-builder failed → draft's `## External context` section reads: `External refs not fetched (<one-line reason>):` followed by the ref list, so the critique pass later surfaces them as external-ref candidates.

**Draft assembly.** Main loop reads the temp files and writes the draft to the spec path:

```markdown
# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing

## Codebase recon
<scout output, or the degraded text>

## External context
<context-builder output, degraded text, or unfetched-ref list; omit section only when the trigger rule never fired>

## Appended during questionary
<starts empty>
```

Then `rm -rf "$GATHER_DIR"` and clear the substep (see extension changes). The marker line is **line 1, verbatim**: `# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing`.

### 2. `skills/brainstorming/SKILL.md` (amended)

- **Checklist** gains one step after worktree setup: "Gather context — follow `gatherer.md`; assemble the draft at the spec path; set substep `gather` on dispatch, clear it when the draft is assembled." The existing step 3 is not duplicated by this: gather produces the draft, step 3 consumes it.
- **Process step 3 ("Understand the idea")** is rewritten **in place** around the draft:
  - `Read` the draft **unconditionally before composing question one**. The on-disk copy is canonical; the unconditional read defeats both a turn-boundary prune after assembly and a session restart, with one simple rule.
  - The draft is a **helper, not a fence**: judgment still drives exploration. Verify load-bearing claims (schemas, contracts, the code being changed) against real code via targeted reads (`read_symbol`-grade, not scout's paraphrase) before designing against them.
  - **Append bar:** during the questionary, append to `## Appended during questionary` only findings the spec will cite — schema shapes, hard constraints, ticket-vs-code contradictions, user answers that changed scope. Not a log of every grep. (Appending uses `edit`; the `edit` prohibition below applies only at the spec-writing step.)
- **Spec-writing step** gets the overwrite discipline, in execution order:
  1. `Read` the draft in full — **immediately before** the overwrite. Without this, a pruned questionary plus a full-replacement `write` destroys the only copy of the gathered context at the moment it feeds the spec.
  2. Write the spec with the `write` tool (full replacement) at the spec path. Using `edit` at this step is a red flag.
  3. **Immediately after the write**, confirm line 1 of the file is no longer the marker — before dispatching lint, critique, council, or summarizer. The extension commit guard is a backstop, not the primary check.
- **Filename rule:** the slug is minted once at gather time from the initial prompt; the overwrite reuses the path. If the questionary invalidated the slug, rename at spec-writing: write the spec at the new path **and delete the old draft file** (nothing was committed, so this is free).
- **Red Flags** gains, verbatim:
  - "About to dispatch lint, critique, council, or summarizer while the spec file's line 1 is still the context-draft marker"
  - "About to run the spec-writing overwrite without re-reading the draft in the same turn"
  - "About to use `edit` instead of `write` for the spec-writing overwrite"
  - "About to insert a human gate, announcement, or question between gather dispatch and questionary question one"

### 3. `extensions/phase-tracker.ts` (amended)

- **Substep action.** The tool's `action` `StringEnum` (`["start","complete","skip","status","reset"]`, phase-tracker.ts:158) gains `"substep"`, with a new optional `substep: string | null` param. Semantics: valid only when the target `phase` is `in_progress` (else the call errors with the phase's actual status); sets or clears (`null`/omitted) a `substep` string on that phase's entry in the persisted `details.phases` state, so it survives session restart like the rest of the tracker. Cleared implicitly by `complete`, `skip`, and `reset`. `formatWidget` (phase-tracker.ts:200) renders an in-progress phase with a substep as `brainstorm(gather)`; `formatStatus` mirrors it. Generic mechanism; `gather` is the only consumer today. The skill sets it when dispatching the builders and clears it once the draft is assembled — the questionary runs under plain `brainstorm`.
- **Marker commit guard.** Enters through the same bash `tool_call` intercept as Guards 2/3, as an independent block between them (brainstorm is already in `GUARD_PHASES`, phase-tracker.ts:70). When brainstorm is `in_progress` and the bash command matches a `git commit` form — a regex covering `git commit`, `git -C <path> commit`, and a leading `cd <path> && git commit`, including `-a`/`-m`/pathspec variants — the guard resolves the repo dir (the `-C`/`cd` path when present, else the session cwd) and reads **line 1** of each file under the resolved `flowGuards.specDirs` (default `doc/specs`) in the **working tree**. If any line 1 equals the marker string, the commit is **blocked** (like Guard 2's branch-op block; the bash call does not run) with a reason naming the offending file, stating the spec-writing overwrite has not happened, and citing the `flowGuards.enforce` escape hatch. Line-1 anchoring prevents false positives on specs that *quote* the marker (this spec quotes it three times). Working-tree-vs-index divergence is an accepted false-negative window for a backstop whose primary check lives in the skill. When `piGauntlet.flowGuards.enforce` is `false`, the guard is **skipped entirely** — matching the real Guard 2/3 semantics (there is no advisory mode for disabled guards). **No new settings key.**
- The existing `brainstormWriteWarning` (Guard 3 spec-dir confinement) needs no change: the draft is written inside `specDirs`, so it passes clean.

## Data flow

```
initial prompt (+ external refs)
  -> mktemp -d; subagent tasks: [ scout || context-builder? ] -> temp output files
  -> main loop assembles draft at doc/specs/<date>-<topic>.md; rm -rf temp dir
     (substep gather set at dispatch -> cleared at assembly)
  -> questionary: Read draft first; one question at a time; append citable findings
  -> spec-writing: Read draft -> write tool full replacement -> marker-gone check
     (slug rename here if needed: new path + delete old draft)
  -> inline lint -> critique pass -> placeholder re-scan -> summary -> commit -> gate
```

Draft lifetime: exists only between gather and spec-writing; never committed (the only spec commit is at the gate, post-overwrite; the marker guard backstops).

## Error handling and edge cases

- **Builder failure:** degrade per gatherer.md rules above; never block, never prompt.
- **Session restart mid-questionary:** draft is on disk in the worktree; the unconditional-read rule re-establishes it.
- **Slug drift:** rename at spec-writing (new path + delete old draft); uncommitted, so free.
- **Marker survives the overwrite:** caught by the skill's post-write line-1 check before any downstream dispatch; the extension guard backstops the commit (block, or skipped when `enforce: false`).
- **No external refs in request:** context-builder not dispatched; draft has no `## External context` section. Gather remains unconditional via scout.
- **Opaque tracker ID, no fetch path:** listed in the draft as an unfetched ref; never guessed.

## Out of scope

- Any batched/interview-style clarify step (option rejected; one-at-a-time questionary is the only questioning mode).
- **Backgrounded/async gather overlapping the questionary** — rejected: question one must already be draft-informed (blind early questions forfeit the feature's point), and the join-point + background-substep complexity outweighs the ~1-2 min of wall clock a foreground gather costs.
- Persisting the draft past spec-writing, or letting the council/planner consume it (the spec must be self-contained; the external-ref machinery already enforces that).
- New `piGauntlet.*` settings keys; builder model configuration (owned by pi-cohort `subagents.agentOverrides`).
- Changes to `plan-tracker.ts`, `verify-before-ship.ts`, or any other skill's exploration behavior.

## Testing approach

- **Extension:** extract the new pure logic — substep state transition, widget line rendering with substep, and the commit-guard check (commit-form regex + repo-dir resolution + a line-1 matcher taking an injected file-reader) — into `extensions/lib/phase-tracker-helpers.ts`, tested by `extensions/lib/phase-tracker-helpers.test.ts` via `node --test`, registered in `scripts/ci.mjs` alongside the existing resolver-test invocation (ci.mjs:141). Cases: substep set/clear/complete/skip/reset semantics and the in-progress-only constraint; widget string with and without substep; commit forms (`git commit -am`, `git -C x commit`, `cd x && git commit`) vs non-commit bash; line-1 marker hit vs quoted-marker miss; `enforce: false` skip.
- **Skills:** AGENTS.md generic-content grep over `skills/` (zero matches); `npm pack` allowlist confirms `gatherer.md` ships (`files` includes `skills/`).
- **Conformance gate** at the end of this gauntlet run verifies spec-vs-implementation.
- **Live validation:** next real brainstorm in a consumer repo exercises gather -> draft -> overwrite end-to-end.

## Documentation impact

See `../../skills/brainstorming/reference/documentation-impact.md` for the materiality bar.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` (flow-guards section gains the marker commit guard; phase-tracker tool row gains the `substep` action)
- Derived / memory docs invalidated: `AGENTS.md` extensions table — no new settings key, row text unchanged; confirm-only
