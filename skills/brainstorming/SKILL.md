---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

> **Related skills:** Use `/skill:using-git-worktrees` **before** writing the spec — the spec is the worktree's first artifact. Then `/skill:writing-plans` for implementation planning.

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Identify the target project → set up an isolated worktree → understand current project context → ask questions one at a time → propose 2-3 approaches with trade-offs → present the design in two rounds → write spec to disk inside the worktree → user reviews before any implementation.

## HARD CONSTRAINT

While this skill is active, do **not** take any implementation action until you have presented a design and the user has approved it. This applies to **every** change regardless of perceived simplicity. An implementation-heavy request ("test it end-to-end", "push a request to rabbit", "run the service") does not lift this gate — it just tells you what the spec must cover.

You **may**:

- Read code and docs
- Run the existing system to observe its **current** behaviour — this is research and feeds the spec (boot a local service, replay a sample request, capture a baseline classification, etc.)
- Write to the project's `doc/specs/` directory
- `edit` a predecessor spec in the project's spec directory to add a supersession banner (see [Marking superseded specs](#marking-superseded-specs)) — the `edit` prohibition at spec-writing binds the spec being written, not a predecessor file

You may **not**:

- Write or edit code outside `doc/specs/`
- Scaffold a project, or take any action that builds, deploys, or validates the **proposed change** — running new/edited code, exercising behaviour that doesn't exist yet, or "testing the fix" before there is one
- Run implementation skills (`/skill:test-driven-development`, `/skill:subagent-driven-development`, etc.)
- Commit the spec directly on `main` in the primary checkout — it must land inside the worktree (see [Worktree First](#worktree-first))
- Start writing the plan (that's `/skill:writing-plans` — separate phase)

The line: exercising the system **as it is today** is research; exercising the **change you're proposing** is implementation and waits for the gate.

This skill ends with a **written, user-reviewed spec inside a worktree**. Nothing else.

## Foreground dispatch policy

Flow-owned execution dispatches run in the foreground: set top-level `async: false` on gather, critique, council, summary, implementation, review, conformance, and retry calls. `forceTopLevelAsync` must remain unset or false; it is incompatible with this flow. See [pi-cohort dispatch configuration](https://github.com/jjuraszek/pi-cohort/blob/main/doc/configuration.md). If a dispatch returns an async handle despite `async: false`, stop and report the configuration error: do not poll it, relaunch work, or advance the flow. An intercom-detached child is likewise incomplete work; use the existing coordination path and never accept or duplicate it.

Foreground does not serialize independent work: preserve existing isolated parallel `tasks` batches and await their terminal results before acceptance or tracker/phase advancement.

## Checklist

Work through the items below **in order**. This is your own checklist to follow, not a `plan_tracker` plan — brainstorming is open-ended exploration, and `plan_tracker` is execution-only (the implement phase). The terminal state is the user review gate; after approval the **only** next skill is `/skill:writing-plans`. Do not jump to implementation, and do not silently drop the critique pass.

1. **Start brainstorm tracking (fresh epoch)** — as the **first action on entry**, before reading code, setting up the worktree, or answering the user, reset **both** trackers and then start the phase. A new brainstorm is a new flow, so it owns a clean slate — clear any stale phases *and* tasks left in the session by earlier work:

   ```
   phase_tracker({ action: "reset" })   // clears all phases
   plan_tracker({ action: "clear" })    // clears all tasks
   phase_tracker({ action: "start", phase: "brainstorm" })
   ```

   Re-entering while a brainstorm is already in progress is safe: mid-brainstorm there are no tasks or later phases to lose, so the reset just re-establishes the same clean slate.
2. **Set up the worktree** — see [Worktree First](#worktree-first)
3. **Gather context** — follow `gatherer.md` (same directory): set substep `gather`,
   dispatch the builders, assemble the context draft at the spec path, clear the
   substep. Unconditional, foreground, no user interaction — the next thing the user
   sees is a questionary question. This produces the draft; the step below consumes it.
4. **Understand the idea against the draft** — `Read` the draft, verify load-bearing
   claims against real code, ask questions one at a time, append citable findings
5. **Propose 2-3 approaches** — with trade-offs and a recommendation
6. **Present the design** — in two rounds, one approval each
7. **Write the spec** — to `doc/specs/` (see [Filename Convention](#filename-convention)); then mark any known superseded predecessor(s) per [Marking superseded specs](#marking-superseded-specs), at the exact-order position defined in [Spec Self-Review](#spec-self-review-before-user-review-gate)
8. **Spec self-review (lint)** — placeholder scan + internal consistency + documentation named, run inline
9. **Critique pass (auto-dispatched)** — scope + ambiguity; the spec council via `/skill:roasting-the-spec` when `gauntlet_setting` returns verdict `council` (it applies its apply-set, including any external-ref inlining, to the spec before returning — see [Spec Council](#spec-council-optional)), else a fresh `worker` that applies its own fixes in place
10. **Re-run placeholder scan** — after the critique pass returns, re-scan the **applied** spec for placeholders its edits may have introduced; if a predecessor banner exists, confirm its `<scope>` still matches the applied spec (critique edits can change what is superseded); surface any ambiguity the critique could not safely resolve at the user gate
11. **Generate spec summary** — dispatch a fresh, spec-only `spec-summarizer` over the **final (post-apply)** spec, writing to an absolute temp-dir path via `outputMode: "file-only"`, then `Read` that file back as the **last content-producing** tool call before composing the gate and render its contents **verbatim** at the top of the gate message — do not paraphrase, condense, re-section, or rewrite it (see [User Review Gate](#user-review-gate)); this is part of the existing gate, not a new one
12. **User review gate** — user reviews the applied spec's verbatim summary plus the council audit (Applied/Deferred/Rejected), with a revert valve for any applied council edit
13. **Transition** — only after approval, invoke `/skill:writing-plans`

## Project Routing

Before brainstorming, identify the target project. The match drives the spec directory, AGENTS.md to read, and verification commands.

Read the repo's top-level `AGENTS.md` (already in pi's context) and any service-level `AGENTS.md` for the area the user mentioned. If the project documents a routing table mapping subprojects to spec directories and verification commands, follow it. Otherwise rely on the conventions you find.

Detection order:

1. Issue tracker reference (Linear, Jira, GitHub Issues) → infer from labels, description, or mentioned file paths
2. cwd inside a service / package directory → use that area
3. Unclear → ask the developer

If the project's `AGENTS.md` calls out additional reading for a specific area (e.g. a TDD workflow doc), read it before brainstorming work in that area.

## Worktree First

The spec is the **first commit in a dedicated worktree**, not a separate commit on `main`. Before drafting any spec content:

1. Invoke `/skill:using-git-worktrees`. Worktrees live under `.worktrees/` at the repo root, or wherever a project-native worktree script places them.
2. Switch into the worktree.
3. From there, write the spec, run self-review, commit, hand off.

Spec doc, plan doc, and implementation are all developed in the same worktree; the squash ships the spec and the implementation, with the ephemeral plan stripped before landing (see `/skill:finishing-a-development-branch`).

**Exception:** trivial one-off edits the user explicitly asks for outside this skill flow (e.g. "fix this typo") do not require a worktree.

## The Process

### 1. Check git state

```bash
git status
git --no-pager log --oneline -5
```

If on a feature branch with uncommitted or unmerged work, ask:

> "You're on `<branch>` with uncommitted changes. Want to finish/merge that first, stash it, or continue here?"

Require one of: finish prior work, stash, or explicit "continue here". If the topic is new, set up the worktree per [Worktree First](#worktree-first) before continuing.

### 2. Scope check

One spec is the default. If the request looks like multiple independent concerns (e.g., "CSV import for operators, plus a partner-facing status API" - different actors, different problem statements), test each candidate slice against `../shape-ticket/reference/split-axes.md` (identity test, outcome test, closed axis list, release-timing precondition). A multi-spec offer renders the three-line justification per proposed spec - root cause / outcome / axis:

    root cause: <the precipitating failure or missing capability this slice remedies>
    outcome: <what a user observes once it ships>
    axis: <one item from the closed list>

a slice failing any part -> one spec, and the failed split is not offered:

> "This looks like 2 independent specs to me - A (axis: <axis>), B (axis: <axis>). Should we brainstorm each separately, or is there a tight coupling I'm missing?"

Never split on service, package, repo, layer, or team boundaries - a single feature, bug, or improvement routinely cuts through many layers, and one spec covers it. A genuinely multi-concern request designed as one spec is still wrong; decompose it, but only along a passing axis.

### 3. Understand the idea

The gather step (see `gatherer.md`) has already assembled a context draft at the spec
path.

- `Read` the draft **unconditionally before composing question one**. The on-disk
  copy is canonical — this one rule defeats both a turn-boundary prune after assembly
  and a session restart.
- The draft is a **helper, not a fence**: judgment still drives exploration. Verify
  load-bearing claims (schemas, contracts, the code being changed) against real code
  via targeted reads (`read_symbol`-grade, not scout's paraphrase) before designing
  against them.
- **Check if the codebase or ecosystem already solves this** — the draft's recon
  section starts that answer; confirm it before designing from scratch.
- Ask questions **one at a time** to refine the idea. Prefer multiple-choice; one
  question per message. Focus on: purpose, constraints, success criteria, who/what
  it touches.
- **Append bar:** append to the draft's `## Appended during questionary` only
  findings the spec will cite — schema shapes, hard constraints, ticket-vs-code
  contradictions, user answers that changed scope. Not a log of every grep.
  (Appending uses `edit`; the `edit` prohibition in the spec-writing step applies
  only there.)

### 4. Explore approaches

- Propose 2-3 different approaches with trade-offs.
- Lead with your recommended option and explain why.
- Present conversationally — don't dump a comparison table unless the user asks.

### 5. Design for clarity and isolation

When sketching the design, prefer:

- **Clear boundaries** — clean interfaces between components, easy to test in isolation.
- **YAGNI ruthlessly** — every component you add is a component you must maintain.
- **Match existing patterns** — if a service has a convention, follow it. Reference the service's `AGENTS.md` and neighboring code.
- **Single source of truth** — point at the schema/contract that owns the data (the migration, type definition, or API contract that defines it); don't invent parallel state.
- **Explicit error and edge cases** — name them. "Out of scope" is a valid answer, but it has to be stated.

### 6. Present the design in two rounds

Two rounds, one approval each. Target 300-500 words per round. A revisit after feedback stays inside the same approval point.

- Round 1: architecture overview, components / responsibilities, data flow, and `supersedes <path>, <scope>` when the draft names a predecessor. Ask once. Approval without correction confirms the predecessor.
- Round 2: error handling and edge cases, testing approach, `## Documentation impact`. Ask once.

The `## Documentation impact` section is required. Cite the materiality bar in `reference/documentation-impact.md` by relative path rather than restating its categories, and reproduce its template block verbatim:

  ```markdown
  ## Documentation impact
  - Feature / user-facing docs introduced: <list, or "none">
  - Materially amended existing docs: <list, or "none">
  - Derived / memory docs invalidated: <routers / AGENTS.md sections / topic guides / indexes, or "none">
  ```

  Each entry answers with a doc name, "none", or "deferred: <trigger>". A new standalone `.md` appears only where no existing doc already owns the topic. Project-specific doc taxonomy goes in a `## documentation` block in the gauntlet overrides file (see Project overrides) (no new settings key; guidance only). Doc updates ship in the same commit and are verified against the spec by the conformance gate.

Be ready to go back and clarify when something doesn't make sense.

## Ticket Handling

When a ticket ID is given, fetch the ticket and treat it as **guidance, not the sole source of truth**. Propose changes to scope, approach, or acceptance criteria when they don't align with the codebase. Surface deviations in the spec doc.

## First-Feature Oversight (Early Project Stages)

For the **first two features** of a new initiative (a new top-level module/package, long-lived component, persistence/schema area, or any pattern that will repeat), round 1 lists these decisions explicitly so the user can correct them there: directory and module structure; naming conventions (public types, files, routes, identifiers); new shared abstractions (location, responsibility, boundary); persistence/schema design (entity names, field types, indexing); proposed additions to AGENTS.md or doc/ files. No separate confirmation. After the first two features establish patterns, follow them.

## Anti-Pattern: "Too simple to need a design"

Watch for the rationalization "this is just a small change, let's skip the spec and code it":

- Small changes that touch shared schemas, contracts, or invariants need a spec.
- "Small" often hides assumptions that the spec process would surface.
- A 5-minute spec saves an hour of rework when the assumption was wrong.

If the change truly is mechanical and contained (rename, formatter run, dependency bump), say so explicitly and skip brainstorming. Otherwise: spec first.

## Filename Convention

Spec lives in the project's `doc/specs/` (see [Project Routing](#project-routing)) with one of:

- With ticket: `YYYY-MM-DD-<ticket-id>-<topic>.md` — `<ticket-id>` is a filename-safe slug of the tracker reference (e.g. `E-12345` for Linear, used verbatim; `gh-123` for GitHub issue `#123`). Plan headers and commit messages use the tracker's native reference form, not the filename slug.
- Without ticket: `YYYY-MM-DD-<topic>.md`

`<topic>` is a short kebab-case slug (3–6 words). Do **not** append `-design` or any other suffix.

The slug is minted **once, at gather time**, from the initial prompt; the spec-writing
overwrite reuses the path. If the questionary invalidated the slug, rename at
spec-writing: write the spec at the new path **and delete the old draft file**
(nothing was committed, so this is free).

## Marking superseded specs

When the new spec replaces a prior spec — fully or in part — (from the draft's scout recon or the request), mark the predecessor. No mechanical sweep: grep or path-overlap hits never decide supersession.

- `edit` the predecessor spec (in the project's spec directory, per [Project Routing](#project-routing)) to insert, after its title line and a blank line, one banner line per successor:

  ```markdown
  > **Superseded by:** [<repo-relative path to successor>](<href relative to THIS file>) - <scope>
  ```

- The visible label is the successor's repo-relative path; the href is computed relative to the predecessor's own directory (Markdown resolves links from the containing file). Same directory: `[doc/specs/B.md](./B.md)`.
- `<scope>` is the value after the ` - ` separator: `fully`, or the named superseded section(s), e.g. `"Settings resolution" section only`. The scope value itself carries no leading dash — the template above already supplies the separator.
- Banners are **append-only**: add below any existing supersession lines, formatted or free-form prose. One old spec may accumulate banners from multiple successors. No migration, no dedup.
- **No transitive rewrite**: if A points at B and B is later superseded by C, A keeps pointing at B; the reader hops.
- **Mark, never delete.** Delete/archive policy is consumer territory via overrides.
- **Coverage limits**: unmarked does NOT mean current (code drift, abandoned designs, and partial ships produce no successor spec); marked does NOT mean dead (partial supersession leaves live sections).
- Predecessor in a **different service's spec directory**: out of scope — record it in the new spec's Open Questions instead of editing outside the write grant.
- **Override contract**: the gauntlet overrides file (see Project overrides) may replace the banner *syntax*; placement, append-only, no-transitive-rewrite, and mark-never-delete stay fixed. A syntax override entry must itself state the scout-citation guidance for its format (the shipped `gatherer.md` guidance names only the default banner).

## Spec Self-Review (Before User Review Gate)

Spec-writing replaces the context draft, in this exact order:

1. `Read` the draft in full — **immediately before** the overwrite. Without this, a
   pruned questionary plus a full-replacement `write` destroys the only copy of the
   gathered context at the moment it feeds the spec.
2. Write the spec with the `write` tool (**full replacement**) at the spec path.
   Using `edit` at this step is a red flag.
3. **Immediately after the write**, confirm line 1 of the file is no longer
   `# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing` — before
   dispatching lint, critique, council, or summarizer. The phase-tracker commit
   guard is a backstop, not the primary check.
4. **After the line-1 check and before the inline lint**, `edit` any known
   predecessor spec to insert its supersession banner (see
   [Marking superseded specs](#marking-superseded-specs)). This position is fixed:
   the banner is written after any slug rename, so it always cites the final path.

After writing the spec to `<project>/doc/specs/<filename>.md` (per [Filename Convention](#filename-convention)) and before showing it to the user, run a self-review pass. **Read all five bullets first, then act:** only the **first three** run here at the main loop (the inline lint); the **last two** (scope + ambiguity) do **not** run inline — they are the dispatched critique pass (checklist item 9). Do not apply scope/ambiguity edits yourself.

- **Placeholder scan.** Any `TODO`, `TBD`, `<fill in>`, `[example]`, `xxx`? Either resolve them or convert to explicit "Open Questions" with names.
- **Internal consistency.** Does Section 4 contradict Section 2? Are component names and field names consistent throughout? If the spec replaces a prior design, confirm the predecessor carries the supersession banner and its href resolves to this spec's final filename.
- **Documentation named.** Does the spec name all three classes (feature/user-facing introduced; materially amended; derived/memory invalidated), or an explicit "none" for each? Enforce the materiality bar in `reference/documentation-impact.md` without restating it: each listed doc names the category it clears, none is a code-mirror, amend-over-create was applied, and skill/agent bodies are implementation surface, not doc-impact entries here.
- **Scope check.** Does every paragraph serve the goal? Cut filler. If something is out of scope, say it's out of scope.
- **Ambiguity check.** Is every "we should…" backed by a concrete decision? Replace "we could probably" with "we will" or "we won't".

The first three checks — **placeholder scan**, **internal consistency**, and **documentation named** — are the inline **lint**: run them here at the main loop and fix what they surface. The last two — **scope** and **ambiguity** — are **not** run inline; they are the **critique pass**, auto-dispatched (per [Spec Council](#spec-council-optional)):

- **Council** (`gauntlet_setting({ key: "specCouncil" })` returns verdict `council`) → invoke `/skill:roasting-the-spec`; it runs the critique, derives dispositions, and **applies the apply-set to the spec** (including inlining any `external-ref:` cluster it has context for) **before returning** — see that skill for apply mechanics. It returns a structured audit: `Applied:` / `Deferred:` / `Rejected:`.
- **Otherwise** → dispatch one fresh `worker` that applies the scope + ambiguity checks and fixes them in place:

  ```
  subagent({ agent: "worker", context: "fresh", async: false, cwd: "<abs worktree path, from git rev-parse --show-toplevel>", task:
    "Problem statement: <the problem the spec addresses + the user's stated intent>.\n" +
    "Read the spec at <abs path to doc/specs/...>. Edit ONLY that file. Apply two checks and\n" +
    "fix what you find in place: (1) Scope — does every paragraph serve the goal? Cut filler;\n" +
    "state out-of-scope explicitly. (2) Ambiguity — is every 'we should' a concrete decision?\n" +
    "Replace 'we could probably' with 'we will'/'we won't'. Also inline any load-bearing\n" +
    "external reference (ticket AC, commit SHA, doc) already given to you in the problem\n" +
    "statement above; if the spec relies on one not provided here, flag it (do NOT fetch) in\n" +
    "your summary. Return a summary of what you changed, and flag any ambiguity you could NOT\n" +
    "safely resolve." })
  ```

  `worker`'s model resolves from `subagents.agentOverrides.worker.model` in `settings.json` (unset → inherits the main loop); the dispatch passes no `model:`.

Both paths apply their fixes **before returning** — the council auto-applies inside `/skill:roasting-the-spec`, the worker edits the spec file directly. After the critique pass returns, re-run the placeholder scan over the **applied** spec to catch anything the edits introduced, and — if a predecessor banner was written — confirm its `<scope>` still matches the applied spec, reconciling the banner if critique edits changed what is superseded. If the worker flagged ambiguities it could not safely resolve, surface them in the [User Review Gate](#user-review-gate) message so the user decides - the worker auto-applies fixes but never silently swallows an open question.

## Spec Council (Optional)

After the inline lint and before the user review gate, **brainstorming owns the critique-pass gate**; council **apply mechanics** live in `/skill:roasting-the-spec` (single source of truth - link, don't restate). Resolve the council with `gauntlet_setting({ key: "specCouncil" })` - the tool returns the merged (repo-over-preset) value as `{ verdict, members, chair, malformed, warning, errors }`. **Do not** hand-roll a settings read. When `verdict` is `"council"`, the council *is* the critique pass - invoke `/skill:roasting-the-spec` automatically (no offer, no prompt), passing `members`/`chair`; also pass the verbatim human input (the original prompt, any ticket AC snapshot, and the questionary answers that changed scope) - roasting-the-spec forwards it to members and chair as the `Human input (verbatim; off-limits for over-spec)` block; it applies its apply-set and returns the audit (Applied/Deferred/Rejected). When `verdict` is `"worker"`, run the fresh-`worker` critique instead (see [Spec Self-Review](#spec-self-review-before-user-review-gate)). If `malformed` is true or `errors` is non-empty, emit the `warning`/error as one line, then branch strictly on `verdict` - `malformed` can accompany *either* verdict (e.g. a bad `chair` with valid `members` still returns `council`), so never infer the worker path from `malformed` alone. If `gauntlet_setting` is unavailable, stop and report - never fall back to a manual bash/JSON settings merge. The already-applied council edits (or the worker's in-place fixes) ride in the same worktree commit. The conceptual precedence rule lives in `verification-before-completion/reference/settings-precedence.md`.

## User Review Gate

After self-review and the critique pass (council or worker, both already applied to the spec - see [Spec Council](#spec-council-optional)), dispatch the spec-only summarizer over the **applied** spec, then commit the spec on the worktree branch and stop. This is the **same** single human gate - the summary is folded into it, not a new gate.

Mint an absolute temp path outside the worktree (so it is never committed), then dispatch the summarizer on a fresh context, reading only the spec, writing to that path via file-only output (no `model:` - it inherits the main loop unless a preset sets `subagents.agentOverrides.spec-summarizer.model`):

```bash
SUMMARY_PATH=$(mktemp "${TMPDIR:-/tmp}/gauntlet-spec-summary.XXXXXX")   # absolute, portable across GNU/BSD mktemp
```

```
subagent({ agent: "spec-summarizer", context: "fresh", async: false, cwd: "<abs worktree path, from git rev-parse --show-toplevel>",
  output: "<SUMMARY_PATH>", outputMode: "file-only", task:
  "Summarize the spec at <abs path to doc/specs/...> for the user review gate. Read ONLY that file." })
```

`<SUMMARY_PATH>` above is a placeholder in the dispatch object; it means substitute the value of the shell variable `$SUMMARY_PATH` set above. The steps below use `$SUMMARY_PATH` (the shell form) once the value is in hand.

Then commit the spec — staging any predecessor spec edited per [Marking superseded specs](#marking-superseded-specs) alongside it; a change request at the gate that renames, materially revises, or drops the spec also reconciles the predecessor's banner before recommitting. This commit is **unconditional**: the summary is only a gate aid, so a degraded or missing summary never blocks it. If the council path ran, include its audit (`Coverage:` when present, then `Applied:` / `Deferred:` / `Rejected:`, verbatim from `/skill:roasting-the-spec`'s return) in the **commit message body** - this is the durable, non-contractual record a finish-time revert reads back; the audit is never a committed spec section. Evaluate the summary in two stages (the **Degrade path** referenced in each is defined just below):

1. **From the dispatch tool result, before the `Read`.** If the result is **not** an `"Output saved to: <path> (<N> KB, <M> lines)"` reference (e.g. an exit-0 save error returns the full inline output plus an "Output file error" line — the prunable shape, no file to read), or the reference reports under ~500 bytes, or a size grossly disproportionate to the spec (under ~2% of its byte size), or over ~45 KB (the `Read` truncates at 50KB / 2000 lines, so a larger file cannot render whole) — skip the `Read` and take the degrade path. Use the reference's reported figures; do not re-derive them.
2. **The `Read` itself, as the last content-producing tool call before composing the gate.** `Read` `$SUMMARY_PATH` and paste its contents verbatim at the top of the gate. If the `Read` fails, returns 0 bytes, or reports truncation — take the degrade path. The `Read` must be last: pi-condense does not protect a `/tmp` read, so any turn boundary between the `Read` and the render lets the ~9KB read result be pruned, reproducing the bug.

**Degrade path** — reach the gate with a one-line "summary generation failed" note; never paraphrase from the file-only reference, never render a stub as the canonical summary.

Either way — summary rendered or degraded — then `rm "$SUMMARY_PATH"` (unconditional cleanup; harmless if the file was never created, since it lives outside the worktree under the OS temp dir).

Render the temp file's contents **verbatim** first — paste it as-is, do **not** paraphrase, condense, re-section, drop sections, or merge it with the council audit. "Fold into the gate" means *place it inside the gate message*, not *rewrite it*. This summary is of the **final (post-apply)** spec, since both critique paths already applied before this dispatch. After the verbatim block, append the commit confirmation, then — as their **own** adjacent lines, not edits to the summary — the council audit (if the council path ran: `Coverage:` when present - omitted at full coverage - then `Applied:` / `Deferred:` / `Rejected:`, one line each), critique-pass-unresolved ambiguities, and every entry from the summarizer's gap/external-context footer (surface **all** of them, not just the top risk):

```
<spec-only summary read back from the temp file — pasted verbatim, unedited>

Spec written and committed to <project>/doc/specs/<filename>.md (worktree: <path>).

Coverage: <N> of <M> members reported; <slug>: <reason> (line present only when coverage was partial)
Applied: <cluster -> edit>, ...
Deferred: <cluster -> where it belongs>, ...
Rejected: <cluster -> one-line reason>, ...
(omit the audit lines above when the worker path ran, not the council)

<unresolved ambiguities; every gap-footer entry from the summary>

Please review. Approve to proceed, tell me what to change in the spec, or say "revert applied council edit <X>" to undo a specific applied edit.
```

If you believe the summary needs correcting, do **not** silently rewrite it — re-dispatch the summarizer or note the discrepancy as an adjacent line beneath the verbatim block.

**Revert valve.** "Revert applied council edit X" is a normal change request: revise the spec to undo edit X, re-dispatch the summarizer with a **fresh** temp path (per the re-dispatch rule below), and re-present the gate. This is cheap here - the spec is not yet plan- or code-bearing.

Wait for the user. On a change request (including a revert), revise the spec and re-present — mint a **fresh** temp path for the re-dispatched summarizer (never reuse a prior round's path, so stale content can never be mistaken for the new summary). On approval, proceed immediately to `/skill:writing-plans` with no further prompt — the plan and execution mode are mechanical derivatives, so the only human gate here is spec approval itself. Don't land the spec on `main`; it stays in the worktree and ships in the same squash commit as the implementation.

Post-approval changes follow [Amending an approved spec](#amending-an-approved-spec).

After approval, mark the brainstorm phase complete:

```
phase_tracker({ action: "complete", phase: "brainstorm" })
```

## Amending an approved spec

Execute this section in place from any later phase. Do not invoke `/skill:brainstorming` (its entry resets both trackers). Worktree, spec commits, and plan survive.

1. Edit the spec. Show `git --no-pager diff -- <spec path>` and one line of impact (affected plan tasks / waves, or "no plan yet").
2. Wait for approval. Change request -> revise, re-show.
3. No plan yet -> commit the spec; continue. Plan exists -> update affected anchors and tasks: `plan_tracker` `add` for new tasks, `update` for changed ones; anchor-changed completed tasks go back to `pending` and re-run the task loop. A removed task is deleted from the plan; then re-`init` the tracker with the remaining tasks in wave order and `update` every already-completed task back to `complete` (the only permitted `init` after handoff; never `clear`). Re-run `plan_check` until it passes, commit spec + plan together; continue. A task reopened while `verify` or `ship` is in progress: `phase_tracker({ action: "skip", phase: "<current>", reason: "amendment reopened Task N" })`, then `phase_tracker({ action: "start", phase: "implement", force: true })`; later phases re-enter with `force: true` and rerun in full.

Redraw test: the diff changes the problem statement, adds or removes a component, or moves a component boundary -> redraw. A change inside one component (a persistence mechanism, a worker's HTTP client, dropping a fallback and its task) -> amend. State the call in the same message as the diff; the user overrides either way.

Redraw: keep the worktree and the approved spec file. `plan_tracker({ action: "clear" })`, `phase_tracker({ action: "reset" })`, `phase_tracker({ action: "start", phase: "brainstorm" })`, delete the plan file, resume at checklist step 4 with the approved spec as the draft (steps 2-3 skipped). Spec-writing overwrites it; the full gate follows.

## Key Principles

- **One question at a time.**
- **Multiple choice preferred** when possible.
- **YAGNI ruthlessly.**
- **Design for testability** — clear boundaries enable TDD.
- **Explore 2-3 approaches** before settling.
- **Two design rounds** — one approval per round.
- **Be flexible** — go back and clarify when something doesn't make sense.

## Red Flags — STOP

- Writing or editing anything outside `doc/specs/` while this skill is active.
- Overwriting the draft without reading it in full in the same turn, or using `edit` for the spec-writing overwrite.
- Dispatching lint, critique, council, or summarizer while the spec file's line 1 is the context-draft marker.
- Running the scope or ambiguity checks inline instead of dispatching the critique pass.
- Reaching the gate after a failed or skipped critique pass, or without re-running the placeholder scan on the applied spec.
- Composing the gate without the summary `Read` as the last content-producing call, or paraphrasing the summary instead of pasting it verbatim.
- Inserting a human stop between gather dispatch and questionary question one.
- Running, deploying, or validating the proposed change before approval.
- Proceeding to `/skill:writing-plans` before the user approves the spec, or invoking `/skill:brainstorming` to amend an approved spec.
- Writing a replacement spec without the known predecessor's banner, or offering a multi-spec split that fails `../shape-ticket/reference/split-axes.md`.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Any sections relevant to this skill — by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention — override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.
