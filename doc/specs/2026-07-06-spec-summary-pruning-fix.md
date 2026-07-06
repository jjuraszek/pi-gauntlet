# Spec: spec-summary pruning fix at the brainstorming gate

## Problem

`brainstorming`'s User Review Gate dispatches `spec-summarizer` and must render its returned text **verbatim** at the top of the gate message. The current dispatch uses an **inline return** (no `output:` path) - a deliberate choice in the 2026-06-23 spec (`doc/specs/2026-06-23-spec-summary-at-gate.md`, Decision 3), made because `spec-summarizer` is `tools: read` and to keep the summary ephemeral.

That inline return is the bug. A spec summary is ~9KB of text carried in a single subagent tool result. At the turn boundary, pi-condense compresses that large tool result **before** the main loop gets to render it, so the gate shows a pruned paraphrase, not the verbatim summary - defeating the entire point of the `spec-summarizer` (a faithful spec-only projection).

Evidence: session `2026-07-06T06-59-26-915Z_019f3639-8443-7337-9859-c434d4bd7d30.jsonl` (gridstrong). Concrete facts from that trace, inlined so this spec is self-contained:

- The `spec-summarizer` was dispatched inline; its ~9KB summary rode back in one subagent tool result and was condensed to a pruner-summary stub before the main loop's render turn - the gate would have shown the paraphrase.
- The operator re-dispatched the same agent with `output: <abs temp path>` + `outputMode: "file-only"`. The harness persisted the child's final text to that path (**9451 bytes** written despite the agent being `tools: read`), the tool result was the compact `"Output saved to: ..."` reference, and a subsequent `Read` rendered the full summary verbatim.

This spec promotes that proven workaround into the skill.

## Idea

Change the transport, not the summarizer's job. Dispatch `spec-summarizer` with an `output:` path in the system temp dir plus `outputMode: "file-only"`; the main loop then `Read`s that file and renders it verbatim as the last action before composing the gate message.

Why this fixes it, grounded in `pi-cohort/src/runs/shared/single-output.ts` (mechanism inlined here so the spec is self-contained):

- `finalizeSingleOutput` with `outputMode: "file-only"` returns only the compact `outputReference.message` (`"Output saved to: <path> ..."`) as the tool result. Small result -> **never a pruning target**.
- `resolveSingleOutput` -> `persistSingleOutput` writes the child's final text response (`fallbackOutput`) to the path when the child did not write the file itself. A `tools: read` agent never writes, so the harness persists its summary. Confirmed empirically (session above: 9451 bytes).
- The main loop `Read`s the path and renders verbatim. Deterministic transport - pruning cannot touch a compact tool result, and the `Read` lands the full text in-context immediately before the render.

The transport is fully deterministic. Summary *generation* remains model-dependent, as it always was (it is a summarizer).

## Decisions

### Decision 1: Transport via `output:` + `outputMode: "file-only"`, read back as the last pre-gate action

Supersedes Decision 3 of the 2026-06-23 spec (that spec's history is not rewritten; this spec is the current authority on the mechanism). The ephemeral / never-committed property from that decision is **preserved** by the temp-path rule below, not discarded.

**Ordering is load-bearing.** The `Read` of the temp file MUST be the last content-producing tool call, performed immediately before composing the gate message (after the spec commit). Rationale: pi-condense does not protect a `/tmp/...` `Read` result (its `protectedPaths` covers `**/skills/**/*.md`, not temp reads); if any turn boundary sits between the `Read` and the render, the ~9KB read result is exactly as prunable as today's inline return, reproducing the bug. So the gate flow becomes: dispatch summarizer (writes temp file) -> commit the spec -> `Read` the temp file -> render the gate message.

### Decision 2: Temp path is absolute and outside the worktree

The gate dispatches with `cwd = <worktree>` (per the current dispatch snippet, `skills/brainstorming/SKILL.md:242`, `cwd: "<abs worktree path, from git rev-parse --show-toplevel>"`). `resolveSingleOutputPath` resolves a relative `output:` against that cwd, so a relative path would land the summary **inside the worktree** and risk it being committed.

Mechanics the skill body must specify: before dispatching, mint an absolute temp path with `mktemp` (portable form `SUMMARY_PATH=$(mktemp "${TMPDIR:-/tmp}/gauntlet-spec-summary.XXXXXX")` - the bare `mktemp -t <prefix>` form is rejected by GNU coreutils' `mktemp`, which requires a trailing `XXXXXX` template); pass that exact value as `output:`; `Read` that same value back. The path MUST be absolute and outside the worktree. This keeps the "ephemeral, never committed" guarantee intact. On a change-request re-dispatch, mint a fresh temp path (or reuse the same one) - the same absolute-path rule applies.

### Decision 3: Keep `spec-summarizer` at `tools: read`; add a persona directive to dodge the injected write instruction (Option C, chosen over Option B)

Setting `output:` makes pi-cohort's `injectSingleOutputInstruction` append `"Write your findings to: <path>"` to the task. For a `tools: read` agent that instruction is impossible. AGENTS.md (the `spec-council-*`/`bash` note) documents the failure precedent: read-only agents handed that instruction produced "87-byte preamble stubs (glm-5)" and "stalls (gpt-5.5)" - the model tries to write, fails, and emits a short "cannot write" as its final text, which the harness then faithfully persists as the "summary". The transport would deliver a stub.

Two ways to neutralize this:

- **Option B (rejected):** give `spec-summarizer` `bash` (mirrors the council-member v3.3.1 fix) so the write instruction becomes satisfiable. Rejected: `bash` gives the agent grep/find/cat, eroding the `tools: read` spec-only-faithfulness guarantee that is the persona's entire reason to exist. The council members independently need `bash` for their own read-only verification, so it is free for them; for `spec-summarizer` it is pure downside except for this one write.
- **Option C (chosen):** keep `tools: read` and add a directive to the persona. It replaces the persona's current final line - `Output the summary as your final text response. Do not write any file.` - with, verbatim:

  > Output the summary as your final text response. You have no write tool. If your task instructs you to write your findings to a file path, do **not** attempt to write, create, or edit any file and do **not** treat the inability to write as a failure - just emit the full summary as your final text response. The harness persists that response to the requested path for you.

  This pre-empts the try-fail-giveup loop at its root and preserves the narrowest-profile guarantee. This **extends** the failure-prevention pattern AGENTS.md documents for the `spec-council-*` agents to a different agent: the council members were given `bash` so the injected write instruction becomes satisfiable, whereas `spec-summarizer` deliberately stays read-only and instead relies on the directive + harness-persist path. Same failure mode (stub/stall on the impossible write), opposite remedy.

The harness-persist path (Decision 1) makes Option C's transport deterministic; the directive only steers *generation* off the impossible instruction.

### Decision 4: Add a length-proportionality directive to the persona

The persona already carries anti-verbosity levers (omit empty sections, "tight, human-readable, no obvious statements"), but nothing anchors summary length to spec size - so it expands every recommended section to full depth even for a small spec, producing a summary far larger than the spec warrants (observed this session: a ~9KB summary of a ~250-line spec). Add one bullet to the persona's "What to emit" list, before the recommended-sections list:

> **Scale length to the spec.** The summary is proportional to the spec's size and complexity - a short or simple spec gets a short summary. Do not expand every recommended section to full depth to look thorough; the summary should be a fraction of the spec, not a near-copy of it. This is proportionality, **not** aggressive compression - never drop a decision-relevant point, rejected-alternative, risk, or gap-footer entry to hit a length target. When in doubt, keep the point and cut the words around it.

This is a deliberate non-aggressive knob: the failure mode we are correcting is over-expansion, not under-inclusion. The gap footer, decisions, and risks stay complete; only prose padding shrinks.

### Deviations

- 2026-07-06 accept G1: `package.json` version bump + `[Unreleased]` -> `## v4.3.1` promotion deferred to the release skill (repo `AGENTS.md` release-workflow carve-out; the bump is tag-triggered and CI-executed, never hand-applied on a feature branch) - conformance gate. This change ships only the `## [Unreleased]` CHANGELOG note; `package.json` stays at `4.3.0` so `npm test` (`scripts/ci.mjs`, version == first `## vX.Y.Z` heading) stays green.

## Implementation shape (skill edits)

`skills/brainstorming/SKILL.md` User Review Gate, before/after.

Before (current, lines 239-244):

```
Dispatch the summarizer on a fresh context, reading only the spec (no `output:` path - capture the return inline; no `model:` ...):

subagent({ agent: "spec-summarizer", context: "fresh", cwd: "<abs worktree path, from git rev-parse --show-toplevel>", task:
  "Summarize the spec at <abs path to doc/specs/...> for the user review gate. Read ONLY that file." })
```

After (target shape):

```
Mint an absolute temp path first (outside the worktree so it is never committed):

  SUMMARY_PATH=$(mktemp "${TMPDIR:-/tmp}/gauntlet-spec-summary.XXXXXX")   # absolute, portable across GNU/BSD mktemp

Dispatch the summarizer on a fresh context, reading only the spec, writing to that temp
path via file-only output (no `model:` - it inherits the main loop unless a preset sets
`subagents.agentOverrides.spec-summarizer.model`):

subagent({ agent: "spec-summarizer", context: "fresh", cwd: "<abs worktree path, from git rev-parse --show-toplevel>",
  output: "<SUMMARY_PATH>", outputMode: "file-only", task:
  "Summarize the spec at <abs path to doc/specs/...> for the user review gate. Read ONLY that file." })

Then commit the spec, and as the LAST content-producing tool call before composing the gate
message, `Read` <SUMMARY_PATH> and paste its contents verbatim at the top of the gate. Either
way - summary rendered or degraded - then `rm "$SUMMARY_PATH"` (unconditional cleanup; the
render has captured the text in-context, and the file is harmless if it was never created).
```

Degrade path (extends the existing "if the dispatch fails" note to the new read-back leg). Reach the gate with the one-line `"summary generation failed"` note - never paraphrase from the file-only reference, never render a stub as the canonical summary - when any of:

- the subagent tool result is **not** an `"Output saved to:"` reference (e.g. an exit-0 `saveError` returns the full inline output plus an "Output file error" line - the prunable shape, with no file to read); or
- the `Read` fails or the file is 0 bytes; or
- the summary is a **stub**: the file-only reference already prints exact size metadata (`"Output saved to: <path> (<N> KB, <M> lines)"`), so treat as a stub when it reports **under ~500 bytes**, or when the byte count is grossly disproportionate to the spec (e.g. under ~2% of the spec's byte size). Use the reference's reported figures - do not re-derive them.

Large-spec ceiling: the `Read` tool truncates at 2000 lines / 50KB. Decision 4's proportionality directive keeps a summary a fraction of its spec, so a summary would only approach the cap for a spec well over ~1MB (implausible), but the render must still be complete: if the `Read` result reports truncation, or the file-only reference reports **over ~45 KB**, degrade to the "summary generation failed" note rather than render a silently truncated summary.

Every mechanism-coupled phrase in SKILL.md moves from "returned text captured inline" to "temp-file contents": checklist item 11 (line 60), the `no `output:` - capture the return inline` prose (line 239), the "Render the summarizer's returned text verbatim" gate prose (line 248), the verbatim-block placeholder (line 251), the re-dispatch note (line 260, which now mints a **fresh** temp path per re-dispatch - never reuse a prior round's path, so stale content can never be mistaken for the new summary), and the red-flag line (line 288). Update every occurrence. Also **add** a new red-flag bullet: "About to compose the gate message when the summary `Read` was not the last content-producing tool call before it (a following `rm` of the temp file is fine) - a turn boundary between the `Read` and the render lets pi-condense prune the ~9KB read result, reproducing the original bug."

Rejected alternative (recorded, not applied): instead of pinning the `Read` last, a consumer could add the temp-path glob to pi-condense's `protectedPaths`. Rejected - that is cross-package consumer configuration, pi-condense is not guaranteed installed in every consumer, and the skill must be self-contained. Pinning the `Read` order needs no external config.

## Scope

In:

- `skills/brainstorming/SKILL.md` - the User Review Gate dispatch snippet (add the `mktemp` temp-path step, `output:` + `outputMode: "file-only"`, and the last-action `Read` + verbatim-render step), the read-back degrade path, and **every** mechanism-coupled occurrence enumerated in [Implementation shape](#implementation-shape-skill-edits) (checklist item 11 and lines 239, 248, 251, 260, 288).
- `agents/spec-summarizer.md` - two edits: (1) replace the final line with the Option C directive quoted verbatim in Decision 3; (2) add the length-proportionality bullet quoted verbatim in Decision 4 to the "What to emit" list (before the recommended-sections enumeration).
- `AGENTS.md` - append `outputMode` to the callable-knobs list (line 80). Explicit before/after: `... the only callable knobs are `model`, `task`, `output`, `reads`, `progress`, `skill` ...` becomes `... the only callable knobs are `model`, `task`, `output`, `outputMode`, `reads`, `progress`, `skill` ...`. And add a one-line note that `spec-summarizer` intentionally ships read-only + `output:` and relies on the directive + harness-persist pattern (distinct from the council members' `bash`-writes-its-own-file approach).
- New spec doc (this file).
- `CHANGELOG.md` - a `## [Unreleased]` change note. **Not** `package.json`: the version bump and the `[Unreleased]` -> `## vX.Y.Z` promotion are the release skill's tag-triggered carve-out (repo `AGENTS.md` release workflow), never hand-applied on a feature branch. See the dated decision below.

Out (non-goals):

- The **transport** change must not drop sections or gap-footer entries - the summary text and its gap footer live in the child's final response and thus in the persisted file; rendering the file verbatim surfaces them unchanged. (Decision 4 *does* intentionally change output *verbosity* - shorter prose, same completeness of decisions/risks/gap-footer; that is in scope, and is not a contradiction of this transport non-goal.)
- No change to pi-cohort. The fix uses existing dispatch shapes (`output:`, `outputMode`); this is a pi-gauntlet-alone release.
- No rewrite of the 2026-06-23 spec.
- No change to the council/worker critique-pass dispatches, which already return small summaries and are not affected by this bug.

## Risk surface

- **Injected write instruction across models.** Option C's directive is the only defense against the documented stub/stall failure on weak models. If a model ignores the directive and still stubs, the harness persists the stub - which the read-back degrade path (short/empty file) is designed to catch and downgrade to the "summary generation failed" note rather than render as canonical. Opus already handled it without the directive, so the directive strictly widens the safe-model set. Residual risk accepted - strictly better than today's guaranteed-pruned inline path.
- **Read-back leg failure modes.** `finalizeSingleOutput` on exit-0 `saveError` returns the full inline output plus an "Output file error" line (the prunable shape, no file); a stalled/stubbing child persists a near-empty file. Both are handled by the degrade path in [Implementation shape](#implementation-shape-skill-edits).
- **Temp-path leakage into the worktree.** Mitigated by Decision 2 (absolute system-temp path via `mktemp`, enforced in the skill snippet).
- **Read truncation on large specs.** The `Read` tool truncates at 2000 lines / 50KB; today's summaries are ~9KB / ~70 lines. Decision 4 keeps a summary a fraction of its spec, so the cap is only reachable for implausibly large specs, but a silently truncated verbatim render would be a correctness bug - so the degrade path treats a truncated `Read` or an over-~45KB file-only reference as a failure (see [Implementation shape](#implementation-shape-skill-edits)) rather than dismissing the risk.

## Testing approach

This is a skill-body + persona-prose change; there is no unit test surface. Verification:

- `npm test` (`scripts/ci.mjs`) passes - asserts version == CHANGELOG top heading and the no-`pi.settings` invariant; unaffected by prose but must stay green.
- The placeholder/generic-content grep from AGENTS.md ("Skills must stay generic") over `skills/` returns zero matches.
- Manual read-through: the edited gate snippet is internally consistent (dispatch writes the file; commit; main loop reads the same path as the last action; render is verbatim) and the checklist / red-flag / prose wording matches the new mechanism at every enumerated line.
- **Dry run before ship (relink precondition first).** `spec-summarizer` resolves via `~/.pi/agent/agents/spec-summarizer.md`, a symlink to the **installed** package, not the worktree - so a dry run without relinking exercises the *old* persona (no Option C directive, no proportionality bullet) and proves only the transport. Before the dry run, point the install at the worktree: from the worktree, `pi install -l <worktree>` then `npm run link-agents` (re-symlinks `agents/*.md` into `getAgentDir()/agents`). Then the concrete steps: (1) `SUMMARY_PATH=$(mktemp "${TMPDIR:-/tmp}/gauntlet-spec-summary.XXXXXX")`; (2) dispatch `spec-summarizer` with `output: "$SUMMARY_PATH"`, `outputMode: "file-only"` against this spec; (3) assert the tool result is an `"Output saved to:"` reference (not inline output); (4) assert the file exists and is `> ~500 bytes` and not truncated; (5) `Read` it and confirm it renders the full summary with a gap footer; (6) confirm the summary length is a fraction of the spec (proportionality directive in effect, provable only post-relink). A pre-relink run is acceptable to prove transport alone, but must be labelled as such.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `skills/brainstorming/SKILL.md` (gate mechanism), `agents/spec-summarizer.md` (persona: write-instruction directive + length-proportionality bullet), `AGENTS.md` (callable-knobs list gains `outputMode`; note the `spec-summarizer` harness-persist pattern) - the skill body and agent persona are implementation surface amended in the same commit, not standalone doc-impact entries per the materiality bar in `reference/documentation-impact.md`; `AGENTS.md` is a derived/memory doc whose knob list and persona rationale this change would otherwise falsify; `CHANGELOG.md` (release record)
- Derived / memory docs invalidated: `AGENTS.md` (handled above via amendment). README's "output is ephemeral, never committed" remains true under the temp-path rule; no router or index change

(`reference/documentation-impact.md` is resolved relative to `skills/brainstorming/`.)
