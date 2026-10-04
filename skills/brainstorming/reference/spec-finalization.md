# Spec finalization

## Spec Self-Review (Before User Review Gate)

Spec-writing replaces the context draft, in this exact order:

1. `Read` the draft in full - **immediately before** the overwrite. Without this, a
   pruned questionary plus a full-replacement `write` destroys the only copy of the
   gathered context at the moment it feeds the spec.
2. Write the spec with the `write` tool (**full replacement**) at the spec path.
   Using `edit` at this step is a red flag.
3. **Immediately after the write**, confirm line 1 of the file is no longer
   `# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing` - before
   dispatching lint, critique, council, or summarizer. The phase-tracker commit
   guard is a backstop, not the primary check.
4. **After the line-1 check**, run the second predecessor pass. Compose a query from
   the spec's H1 terms, then the terms of every H2 that is not a template heading
   (Problem, Acceptance criteria, Design, Errors and edge cases, Tests, Documentation
   impact, Out of scope, Open questions), then the `**Goal:**` line's terms - same
   token rules as the scout, deduplicated, cut at 15. Run
   `(cd <abs worktree path> && node <SPEC_INDEX> --query '<terms>' --limit 5 --exclude <spec path relative to the worktree>)`
   with `<SPEC_INDEX>` resolved as in `../gatherer.md`. Take the `live` rows and drop every
   path the draft's `Predecessor:` line(s) named (retained from the step-1 read). Carry
   the remainder to the gate as one adjacent line:
   `New predecessor candidates at spec-writing: <path> (<title>), ... - index rows are a hint; code is the source and an absent row proves nothing.`
   or `New predecessor candidates at spec-writing: none.` A non-zero exit degrades to
   `Second predecessor pass unavailable: <first stderr line>`; it never blocks the gate
   or the commit. "yes, <path> is a predecessor" at the gate is a change request that
   adds the `supersedes <path>, <scope>` clause and the banner, then re-presents the gate.
5. **After the second predecessor pass and before the inline lint**, `edit` any known
   predecessor spec to insert its supersession banner (see
   [Marking superseded specs](superseding.md)). This position is fixed:
   the banner is written after any slug rename, so it always cites the final path.

After writing the spec to `<project>/doc/specs/<filename>.md` (per [Filename Convention](../SKILL.md#filename-convention)) and before showing it to the user, run a self-review pass. Read all six bullets first, then act.

- **Placeholder scan.** Any `TODO`, `TBD`, `<fill in>`, `[example]`, `xxx`? Either resolve them or convert to explicit "Open Questions" with names.
- **Internal consistency.** Does Section 4 contradict Section 2? Are component names and field names consistent throughout? If the spec replaces a prior design, confirm the predecessor carries the supersession banner and its href resolves to this spec's final filename.
- **Documentation named.** Does the spec name all three classes (feature/user-facing introduced; materially amended; derived/memory invalidated), or an explicit "none" for each? Enforce the materiality bar in `documentation-impact.md` without restating it: each listed doc names the category it clears, none is a code-mirror, amend-over-create was applied, and skill/agent bodies are implementation surface, not doc-impact entries here.
- **Ticket contract present.** Does `## Acceptance criteria` exist with either verbatim ticket rows plus dispositions or one `none - <reason>` line? Presence is enforced here, at authoring, and nowhere later.
- **Scope check.** Does every paragraph serve the goal? Cut filler. If something is out of scope, say it's out of scope.
- **Ambiguity check.** Is every "we should..." backed by a concrete decision? Replace "we could probably" with "we will" or "we won't".

The first four are the inline **lint**: run them here and fix what they surface. The last two are the **critique pass**, dispatched per [Spec Council](#spec-council). After it returns, re-run the placeholder scan over the applied spec; if a predecessor banner exists, confirm its `<scope>` still matches and reconcile it; carry any ambiguity the critique could not resolve to the [User Review Gate](#user-review-gate).

## Spec Council

Before dispatching the worker below, resolve `documentation-impact.md` relative to this loaded reference as one absolute `<DOCUMENTATION_IMPACT_GUIDELINE>` path value. Pass that value in the worker task; do not add it to the spec.

After the inline lint and before the user review gate, **brainstorming owns the critique-pass gate**; council **apply mechanics** live in `/skill:roasting-the-spec` (single source of truth - link, don't restate). Resolve the council with `gauntlet_setting({ key: "specCouncil" })` - the tool returns the merged (repo-over-preset) value as `{ verdict, members, chair, malformed, warning, errors }`. **Do not** hand-roll a settings read. When `verdict` is `"council"`, the council *is* the critique pass - invoke `/skill:roasting-the-spec` automatically (no offer, no prompt), passing `members`/`chair`; also pass the verbatim human input (the original prompt, any ticket AC snapshot - the raw rows under the gather draft's `## Ticket acceptance criteria (verbatim)` heading, never the spec's section, which holds the author's dispositions - and the questionary answers that changed scope) - roasting-the-spec forwards it to members and chair as the `Human input (verbatim; off-limits for over-spec)` block; it applies its apply-set and returns the audit (Applied/Deferred/Rejected). When `verdict` is `"worker"`, dispatch the worker below. If `malformed` is true or `errors` is non-empty, emit the `warning`/error as one line, then branch strictly on `verdict` - `malformed` can accompany *either* verdict (e.g. a bad `chair` with valid `members` still returns `council`), so never infer the worker path from `malformed` alone. If `gauntlet_setting` is unavailable, stop and report - never fall back to a manual bash/JSON settings merge. The already-applied council edits (or the worker's in-place fixes) ride in the same worktree commit. The conceptual precedence rule lives in `../../verification-before-completion/reference/settings-precedence.md`.

When `verdict` is `"worker"`, dispatch one fresh `worker` that applies the scope + ambiguity checks and fixes them in place:

```
subagent({ agent: "worker", context: "fresh", async: false, cwd: "<abs worktree path, from the using-git-worktrees Step 4 report>", task:
  "Problem statement: <the problem the spec addresses + the user's stated intent>.\n" +
  "Read the spec at <abs path to doc/specs/...>. Edit ONLY that file.\n" +
  "The portable citation `reference/documentation-impact.md` in the spec is the pi-gauntlet guideline at <DOCUMENTATION_IMPACT_GUIDELINE>, not a consumer doc; do not flag it as an external reference, and preserve it - never remove it as redundant or replace it with the resolved absolute path.\n" +
  "Apply two checks and fix what you find in place: (1) Scope - does every paragraph serve the goal? Cut filler;\n" +
  "state out-of-scope explicitly. (2) Ambiguity - is every 'we should' a concrete decision?\n" +
  "Replace 'we could probably' with 'we will'/'we won't'. Also inline any load-bearing\n" +
  "external reference (ticket AC, commit SHA, doc) already given to you in the problem\n" +
  "statement above; if the spec relies on one not provided here, flag it (do NOT fetch) in\n" +
  "your summary. Return a summary of what you changed, and flag any ambiguity you could NOT\n" +
  "safely resolve." })
```

`worker`'s model resolves from `subagents.agentOverrides.worker.model` in `settings.json` (unset -> inherits the main loop); the dispatch passes no `model:`.

## User Review Gate

After self-review and the critique pass (council or worker, both already applied to the spec - see [Spec Council](#spec-council)), dispatch the spec-only summarizer over the **applied** spec, then commit the spec on the worktree branch and stop. The summary is folded into the one human gate, not a new gate.

Mint an absolute temp path outside the worktree (so it is never committed), then dispatch the summarizer on a fresh context, reading only the spec, writing to that path via file-only output (no `model:` - it inherits the main loop unless a preset sets `subagents.agentOverrides.spec-summarizer.model`):

```bash
SUMMARY_PATH=$(mktemp "${TMPDIR:-/tmp}/gauntlet-spec-summary.XXXXXX")   # absolute, portable across GNU/BSD mktemp
```

```
subagent({ agent: "spec-summarizer", context: "fresh", async: false, cwd: "<abs worktree path, from the using-git-worktrees Step 4 report>",
  output: "<SUMMARY_PATH>", outputMode: "file-only", task:
  "Summarize the spec at <abs path to doc/specs/...> for the user review gate. Read ONLY that file." })
```

`<SUMMARY_PATH>` above is a placeholder in the dispatch object; it means substitute the value of the shell variable `$SUMMARY_PATH` set above. The steps below use `$SUMMARY_PATH` (the shell form) once the value is in hand.

Then commit the spec - staging any predecessor spec edited per [Marking superseded specs](superseding.md) alongside it; a change request at the gate that renames, materially revises, or drops the spec also reconciles the predecessor's banner before recommitting. This commit is **unconditional**: the summary is only a gate aid, so a degraded or missing summary never blocks it. If the council path ran, include its audit (`Coverage:` when present, then `Applied:` / `Deferred:` / `Rejected:`, verbatim from `/skill:roasting-the-spec`'s return) in the **commit message body** - this is the durable, non-contractual record a finish-time revert reads back; the audit is never a committed spec section. Evaluate the summary in two stages (the **Degrade path** referenced in each is defined just below):

1. **From the dispatch tool result, before the `Read`.** If the result is **not** an `"Output saved to: <path> (<N> KB, <M> lines)"` reference (e.g. an exit-0 save error returns the full inline output plus an "Output file error" line - the prunable shape, no file to read), or the reference reports under ~500 bytes, or a size grossly disproportionate to the spec (under ~2% of its byte size), or over ~45 KB (the `Read` truncates at 50KB / 2000 lines, so a larger file cannot render whole) - skip the `Read` and take the degrade path. Use the reference's reported figures; do not re-derive them.
2. **The `Read` itself, as the last content-producing tool call before composing the gate.** `Read` `$SUMMARY_PATH` and paste its contents verbatim at the top of the gate. If the `Read` fails, returns 0 bytes, or reports truncation - take the degrade path. The `Read` must be last: pi-condense does not protect a `/tmp` read, so any turn boundary between the `Read` and the render lets the ~9KB read result be pruned, reproducing the bug.

**Degrade path** - reach the gate with a one-line "summary generation failed" note; never paraphrase from the file-only reference, never render a stub as the canonical summary.

Either way - summary rendered or degraded - then `rm "$SUMMARY_PATH"` (unconditional cleanup; harmless if the file was never created, since it lives outside the worktree under the OS temp dir).

Paste the summary verbatim, unedited in the template below; use adjacent lines for the audit, unresolved ambiguities, and every gap-footer entry:

```
<spec-only summary read back from the temp file - pasted verbatim, unedited>

Spec written and committed to <project>/doc/specs/<filename>.md (worktree: <path>).

Coverage: <N> of <M> members reported; <slug>: <reason> (line present only when coverage was partial)
Applied: [<severity>] <cluster> - raised-by: [<slugs>] -> <edit>
Deferred: [<severity>] <cluster> - raised-by: [<slugs>] -> <where it belongs>
Rejected: [<severity>] <cluster> - raised-by: [<slugs>] -> <one-line reason>
(one line per item, exactly as returned by roasting-the-spec - `Applied: none` / `Deferred: none` / `Rejected: none` when a list is empty; omit the audit lines when the worker path ran, not the council)

<unresolved ambiguities; every gap-footer entry from the summary>
New predecessor candidates at spec-writing: <path> (<title>), ... - index rows are a hint; code is the source and an absent row proves nothing.

1 - approve: proceed to planning under the existing amendment review; a fresh reviewer applies evidence-backed factual corrections on its own, and every other spec amendment (scope, acceptance-criteria, or contract edits, and redraws) stops for your review.
2 - approve, auto-apply amends: every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

Or tell me what to change in the spec, or say "revert applied council edit <X>" to undo a specific applied edit.
```

If you believe the summary needs correcting, do **not** silently rewrite it - re-dispatch the summarizer or note the discrepancy as an adjacent line beneath the verbatim block.

**Revert valve.** "Revert applied council edit X" is a normal change request: revise the spec to undo edit X, re-dispatch the summarizer with a **fresh** temp path (per the re-dispatch rule below), and re-present the gate. This is cheap here - the spec is not yet plan- or code-bearing.

Wait for the user. On a change request (including a revert), revise the spec and re-present - mint a **fresh** temp path for the re-dispatched summarizer (never reuse a prior round's path, so stale content can never be mistaken for the new summary). On approval - `1`, `approve`, or equivalent prose approves without a grant; `2`, `approve, auto-apply amends`, or equivalent prose approves and grants - proceed immediately to `/skill:writing-plans` with no further prompt; first read [Standing grants](amendment-surface.md#standing-grants) (stop if unreadable) and record any grant. A reply that mixes approval with a change request ("2 but rename the section") is a change request: revise, re-present, and read the grant only from the reply to the re-presented gate. If the grant's `git commit --amend --trailer` step fails, stop and report; never proceed as granted without the trailer. The plan and execution mode are mechanical derivatives, so the only human gate here is spec approval itself. Don't land the spec on `main`; it stays in the worktree and ships in the same squash commit as the implementation.

Post-approval changes follow [Amending an approved spec](../SKILL.md#amending-an-approved-spec).

After approval, mark the brainstorm phase complete:

```
phase_tracker({ action: "complete", phase: "brainstorm" })
```
