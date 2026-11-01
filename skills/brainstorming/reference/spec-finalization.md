# Spec finalization

## Spec Self-Review (Before User Review Gate)

Spec-writing replaces the context draft, in this exact order:

1. `Read` the draft in full - **immediately before** the overwrite. Without this, a
   pruned questionary plus a full-replacement `write` destroys the only copy of the
   gathered context at the moment it feeds the spec.
2. Write the spec with the `write` tool (**full replacement**) at the spec path.
   After the mandatory draft read and before the full replacement, apply
   `ticket-acceptance.md`'s row-production branch to the approved two-round design plus the original prompt.
   Keep `## Acceptance criteria` after Problem; draft one observable outcome per row,
   default `in-scope`, retaining environment-bound pre-production proof as `venue:`.
   Apply the inline integrity recovery and cut question there before writing.
   Using `edit` at this step is a red flag. The header block (between the H1 and the
   first `##`) carries `**Amend-grant:** none` directly below `**Goal:**`; a redraw's
   rewrite carries `none` too - a redraw is a new approval, with no carry-over.
   For a rework PR subject (a draft carrying `## PR under rework`), follow `pr-subject.md`'s spec contract:
   carry the draft's `## PR under rework` into `## Rework record` after `## Acceptance criteria`,
   preserving its repeated PR/Pre-rework head/Threads groups, one per retained PR,
   home first, each 40-character pre-rework SHA, sync result, rework base, and member replay lines,
   keeps/changes/dropped claims, thread dispositions and fetch status, contract exceptions,
   and scoped test results (including failures and reasons none ran), then one
   `### PR #<N>` provenance subsection per PR with lowercase claims. Carry every PR's
   stated intent and constraints added since fork into Problem. Open Design with the
   unresolved sync repair when present. Omit the record from a ticket or free-text spec.
   Then write `## Legs` after `## Acceptance criteria` and optional `## Rework record`,
   using [legs.md](legs.md): one `### Leg: <repo>` block per member, home first,
   with `branch:`, portable `contract:`, `Rules:`, exactly one `scope:` line and
   `design:` prose for owned paths and observable outcomes.
   Validate every block using [legs.md](legs.md)'s scope grammar before committing.
   Keep machine-local paths out of committed blocks. Even a single-member spec
   carries exactly one block; legacy specs without the section remain home-only.
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

After writing the spec to `<project>/doc/specs/<filename>.md` (per [Filename Convention](../SKILL.md#filename-convention)) and before showing it to the user, run a self-review pass. Read all seven bullets first, then act.

- **Placeholder scan.** Any `TODO`, `TBD`, `<fill in>`, `[example]`, `xxx`? Either resolve them or convert to explicit "Open Questions" with names.
- **Internal consistency.** Does Section 4 contradict Section 2? Does the header block carry `**Amend-grant:**` exactly once with the value `none` (the [predicate](amendment-surface.md#standing-grants))? Are component names and field names consistent throughout? If the spec replaces a prior design, confirm the predecessor carries the supersession banner and its href resolves to this spec's final filename.
- **Documentation named.** Does the spec name all three classes (feature/user-facing introduced; materially amended; derived/memory invalidated), or an explicit "none" for each? Enforce the materiality bar in `documentation-impact.md` without restating it: each listed doc names the category it clears, none is a code-mirror, amend-over-create was applied, and skill/agent bodies are implementation surface, not doc-impact entries here.
- **Ticket contract present.** Require `## Acceptance criteria` in exactly three forms: ticket provenance (`Ticket <ref>, <heading or "checkbox list">, rows verbatim:`) with verbatim rows and dispositions; drafted provenance (`Drafted from the design, no ticket rows:` or `Drafted from the design, ticket <ref> has no acceptance criteria:`) with at least one `- [ ]` row and a disposition on every row; or the single line `none - ticket not fetched (<reason>)`. Reject `none - no ticket` and `none - ticket has no acceptance criteria` as final bodies. For a rework PR subject (a draft carrying `## PR under rework`), require the complete `## Rework record` per `pr-subject.md`; absence fails inline lint, including after a full replacement or redraw. Build expected identities and original heads from the provisioning Step 4 report (home plus `MEMBER_HEADS`), not from the record itself. Require each expected identity's `PR:`/`Pre-rework head:`/`Threads:` group with its full matching head and a `### PR #<N>` provenance subsection; reject a missing group or subsection naming the missing PR. Apply the same predicate for N=1.
- **Scope check.** Does every paragraph serve the goal? Cut filler. If something is out of scope, say it's out of scope.
- **Ambiguity check.** Is every "we should..." backed by a concrete decision? Replace "we could probably" with "we will" or "we won't".
- **PR-source check.** Apply the commitment-source predicate and re-source-or-ask correction in the worker payload below on the worker route; the council member owns the same check on the council route, including PR rework.

The first four are the inline **lint**: run them here and fix what they surface. The last three are the **critique pass**, dispatched per [Spec Council](#spec-council). After it returns, re-run the placeholder scan over the applied spec and reapply the same whole-section predicate from **Ticket contract present**: a correct provenance header with zero rows still fails. Have the main loop repair an invalid drafted section (including erased provenance, a triggering `none` line, or a header with no rows) from the applied Design by re-drafting at least one valid row using `ticket-acceptance.md`'s integrity recovery; never delegate drafting to the applier. With no valid outcome, obtain clarification or an explicit scope decision before the gate. On successful repair, append `Drafted AC repair: restored acceptance rows from the applied Design.` after the existing commit-body audit, preserving council cluster lines and counts; on the worker path append it to the otherwise empty body. Then re-apply the predicate to the header block - if the critique pass removed or altered the `**Amend-grant:**` line, repair it to `none`, exactly once; if a predecessor banner exists, confirm its `<scope>` still matches and reconcile it; carry any ambiguity the critique could not resolve to the [User Review Gate](#user-review-gate).

## Spec Council

Exclude drafted rows from `Human input (verbatim; off-limits for over-spec)`; they are spec requirements, not a ticket snapshot. Keep the original prompt, ticket snapshot, PR input, and human scope answers in today's transport.

Before dispatching the worker below, resolve `documentation-impact.md` relative to this loaded reference as one absolute `<DOCUMENTATION_IMPACT_GUIDELINE>` path value. Pass that value in the worker task; do not add it to the spec.

After the inline lint and before the user review gate, **brainstorming owns the critique-pass gate**; council **apply mechanics** live in `/skill:roasting-the-spec` (single source of truth - link, don't restate). Resolve the council with `gauntlet_setting({ key: "specCouncil" })` - the tool returns the merged (repo-over-preset) value as `{ verdict, members, chair, malformed, warning, errors }`. **Do not** hand-roll a settings read. When `verdict` is `"council"`, the council *is* the critique pass - invoke `/skill:roasting-the-spec` automatically (no offer, no prompt), passing `members`/`chair`; for a PR subject include every retained PR title and body verbatim beside the home-bound ticket rows in `Human input`; also pass the verbatim human input (the original prompt, any ticket AC snapshot - the raw rows under the gather draft's `## Ticket acceptance criteria (verbatim)` heading, never the spec's section, which holds the author's dispositions - and, for every question that offered a disposition (the cut question and the unmatched-group question in `ticket-acceptance.md`), the full question and the user's answer) - roasting-the-spec forwards it to members, chair, and applier as the `Human input (verbatim; off-limits for over-spec)` block; its dispatched applier applies the spec edits and supplies the returned audit (Applied/Deferred/Rejected). When `verdict` is `"worker"`, dispatch the worker below. If `malformed` is true or `errors` is non-empty, emit the `warning`/error as one line, then branch strictly on `verdict` - `malformed` can accompany *either* verdict (e.g. a bad `chair` with valid `members` still returns `council`), so never infer the worker path from `malformed` alone. If `gauntlet_setting` is unavailable, stop and report - never fall back to a manual bash/JSON settings merge. The already-applied council edits (or the worker's in-place fixes) ride in the same worktree commit. The conceptual precedence rule lives in `../../verification-before-completion/reference/settings-precedence.md`.

When `verdict` is `"worker"`, dispatch one fresh `worker` that applies the scope + ambiguity + PR-source checks and fixes them in place:

```
subagent({ agent: "worker", context: "fresh", async: false, cwd: "<abs worktree path, from the using-git-worktrees Step 4 report>", task:
  "Problem statement: <the problem the spec addresses + the user's stated intent>.\n" +
  "Read the spec at <abs path to doc/specs/...>. Edit ONLY that file.\n" +
  "The portable citation `reference/documentation-impact.md` in the spec is the pi-gauntlet guideline at <DOCUMENTATION_IMPACT_GUIDELINE>, not a consumer doc; do not flag it as an external reference, and preserve it - never remove it as redundant or replace it with the resolved absolute path.\n" +
  "The `**Amend-grant:**` header line is flow machinery owned by the brainstorming gate; never cut, shrink, flag, or edit it.\n" +
  "Drafted rows are spec requirements, not Human input; permit pre-approval rewrites only for integrity. Preserve every committed outcome and rewrite only its proof using Design-sourced values; never invent a baseline, target, measurement, or missing value. Flag missing inputs for main-loop clarification before the gate rather than dropping the outcome.\n" +
  "Delete a drafted row only after its Design commitment is cut through the user's scope-decision procedure; quoting the row alone never permits deletion, and never replace the section with `none`. Preserve the cut's `deviates:`/`deferred:` disposition and `## Out of scope` entry for gate disclosure. Never draft new rows; leave drafting and integrity recovery requiring clarification to the main loop under `ticket-acceptance.md`.\n" +
  "Apply three checks and fix what you find in place: (1) Scope - does every paragraph serve the goal? Cut filler;\n" +
  "state out-of-scope explicitly. (2) Ambiguity - is every 'we should' a concrete decision?\n" +
  "Replace 'we could probably' with 'we will'/'we won't'. (3) PR-source - flag a requirement, acceptance-criteria row, or Design clause whose stated source is a PR title or body as a [major] gap with pr-source in the finding text, including PR rework: the spec produces the PR, never the reverse.\n" +
  "Re-source from the approved human input or the agreed design; without that evidence, flag the clause for the main loop to ask for the user's Design scope decision before cutting the commitment or its drafted row. Never replace rows with `none`; never draft rows.\n" +
  "Exempt a `supersedes` line, `## Rework record`, `## Problem` thread lists, `## PR under rework`, any other provenance mention of a PR number, and rework rows sourced from the agreed design. Also inline any load-bearing\n" +
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

Then commit the spec - staging any predecessor spec edited per [Marking superseded specs](superseding.md) alongside it; a change request at the gate that renames, materially revises, or drops the spec also reconciles the predecessor's banner before recommitting. This commit is **unconditional**: the summary is only a gate aid, so a degraded or missing summary never blocks it. Commit with the message on stdin through a quoted heredoc - the only permitted form, so audit lines carrying backticks or `$` land unchanged and each starts a line (telemetry accepts the applier result, this commit command, or assistant text; the first parsed audit wins):

```bash
git -C <abs worktree path> add -- <spec path> [<predecessor path>] && git -C <abs worktree path> commit -q -F - -- <spec path> [<predecessor path>] <<'EOF'
<subject>

<audit lines, verbatim>
EOF
```

After the home commit, write and commit every companion leg file through
`git -C <companion worktree>` using [legs.md](legs.md)'s artifact grammar:
`**Home:**` tuple, copied `## Problem`, `## Decisions` from shared
Design/Errors/Out-of-scope and repo-binding clauses, and its own block verbatim.
Stop naming any failed companion; do not present artifact completion until all
files agree. A single-member run writes no companion file.

If the council path ran, the body is its audit (`Coverage:` when present, then `Applied:` / `Deferred:` / `Rejected:`, verbatim from `/skill:roasting-the-spec`'s return) - the durable, non-contractual record a finish-time revert and row 3 below read back; the audit is never a committed spec section. On the worker path the body is empty except for a main-loop drafted-AC repair audit line when a repair occurred. Append that repair line after the council audit on the council path; never alter its labels, cluster lines, or counts. `-m`, `-F <file>`, `printf | ... -F -`, and `$'...'` strings are not used for this commit. The `add` on the same line is required because the spec is untracked at its first commit and `commit -- <path>` rejects an untracked path.

Evaluate the summary in two stages (the **Degrade path** referenced in each is defined just below):

1. **From the dispatch tool result, before the `Read`.** If the result is **not** an `"Output saved to: <path> (<N> KB, <M> lines)"` reference (an exit-0 save error returns the save error plus a `Full reply preserved at` / `not preserved` pointer, no inline output), or the reference reports under ~500 bytes, or over ~45 KB (the `Read` truncates at 50KB / 2000 lines, so a larger file cannot render whole) - skip the `Read` and take the degrade path. Use the reference's reported figures; do not re-derive them.
2. **The `Read` itself, as the last content-producing tool call before composing the gate.** `Read` `$SUMMARY_PATH` and paste its contents verbatim immediately after the gate marker. If the `Read` fails, returns 0 bytes, or reports truncation - take the degrade path. The `Read` must be last: pi-condense does not protect a `/tmp` read, so any turn boundary between the `Read` and the render lets the read result be pruned, reproducing the bug.

**Degrade path** - reach the gate with a one-line "summary generation failed" note; never paraphrase from the file-only reference, never render a stub as the canonical summary.

Either way - summary rendered or degraded - then `rm "$SUMMARY_PATH"` (unconditional cleanup; harmless if the file was never created, since it lives outside the worktree under the OS temp dir).

Follow the [first-line rule](menu-layout.md). Paste the summary verbatim, unedited in the template below; use adjacent lines for the `Council:` counts, unresolved ambiguities, and every `Missing from the spec` entry; render the `Scope cuts:` line yourself from the spec's `## Acceptance criteria` section - every `deferred:`, `deviates:`, and `venue:` row, `none` when there is none - never from the summary; the audit itself is shown only on row 3:

```
gauntlet: gate=brainstorming/user-review-gate
<spec-only summary read back from the temp file - pasted verbatim, unedited>

Spec written and committed to <project>/doc/specs/<filename>.md (worktree: <path>).
Scope cuts: <row text, first 60 chars> - <disposition>; ... | none

Drafted acceptance criteria (approval ratifies):
- [ ] <row text verbatim>
  <disposition verbatim>
<every drafted row and disposition, verbatim; drafted provenance only>

Council: <A> applied, <D> deferred, <R> rejected
(council path only: A, D, R count the non-`none` lines under each label of the returned audit; append `; coverage <N> of <M>` only when the return carried a `Coverage:` line, e.g. `Council: 11 applied, 0 deferred, 0 rejected; coverage 2 of 3`; omit the whole line and row 3 on the worker path or when the council aborted before an audit existed)

<unresolved ambiguities; every `Missing from the spec` entry from the summary>
New predecessor candidates at spec-writing: <path> (<title>), ... - index rows are a hint; code is the source and an absent row proves nothing.

1 - approve: proceed to planning under the existing amendment review; a fresh reviewer applies evidence-backed factual corrections on its own, and every other spec amendment (scope, acceptance-criteria, or contract edits, and redraws) stops for your review.
2 - approve, auto-apply amends: every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
3 - show council dispositions: prints the council audit verbatim, then re-presents this gate. Not an approval.
4 - approve, loop engine (experimental): skip the plan; iterate a fresh loop-implementer over the acceptance-criteria ledger; amendments stop for your review as under 1.
5 - approve, loop engine, auto-apply amends: as 4 with option 2's amendment grant.
6 - approve, hand off as draft PR: approve the spec's content only; push this branch and open a draft PR carrying just the spec; engine and amendment grant are chosen later by whoever runs `brainstorming #N` on that PR. Ends this flow without planning.
Add "; allowance N" to 4 or 5 to set this run's per-row attempt allowance; otherwise use loopEngine.maxIterationsPerRow (default 4).
Add "; fund N fix rounds" (or "N more fix rounds") to 1 or 2 to fund N implement fix rounds past the escalated waves round.

Or tell me what to change in the spec, or say "revert applied council edit <X>" to undo a specific applied edit.
```

For zero `- [ ]` rows under `## Acceptance criteria`, render only options 1, 2, 3, 6 (PR subject: 1, 2, 3) and explain: "Loop engine unavailable: this spec has no acceptance-criteria rows." The only legal zero-row body is `none - ticket not fetched (<reason>)`; retain its paste-rows affordance. Whenever rows exist, render options 4/5. Keep the worker-path omission of option 3; do not invent a council audit.

On every PR subject omit row 6 and print `Withheld: draft PR - #N already exists` under the list, reusing finishing's withheld-row layout; a hidden 6 gets the clarifying question naming rendered choices. Read [spec-pr.md](spec-pr.md) for option-6 reply decoding, publication, and marked-PR re-gating; its published-branch persistence replaces the local amend recipe below on the marked re-gate and the unmarked spec-only route only; a rework PR subject keeps the amend recipe.

Render the drafted-only block in the template from the applied spec section, never from the summarizer: copy every row and disposition verbatim. Include it for a fetched ticket without ACs; omit it for ticket-row provenance. Approval ratifies these rows at this gate, with no pre-gate acceptance stop. On reply `3`, keep the block reused verbatim with the briefing; on a row-touching change request, render from the recommitted section; on redraw, render from the re-drafted section.

If you believe the summary needs correcting, do **not** silently rewrite it - re-dispatch the summarizer or note the discrepancy as an adjacent line beneath the verbatim block.

**Revert valve.** "Revert applied council edit X" is a normal change request: revise the spec to undo edit X, re-dispatch the summarizer with a **fresh** temp path (per the re-dispatch rule below), and re-present the gate. This is cheap here - the spec is not yet plan- or code-bearing.

Wait for the user. Interpret budget replies with this table before routing change requests. For 4/5, accept one optional `; allowance N` suffix with N matching `[1-9][0-9]*` and a positive safe integer. Carry the accepted value to loop entry and persist it only in the ledger, not in the spec or settings. On a malformed allowance suffix (zero, negative, non-numeric, unsafe, duplicate or trailing text), ask exactly one clarifying question quoting it, then wait without writing; a second invalid reply leaves the gate waiting.

| Reply | Action / written value |
|---|---|
| bare `2` | approve; persist the option-2 description above |
| `2; fund 3 fix rounds` or `2, fund 3 fix rounds` | approve; persist that description plus `; fund 3 fix rounds`, not a change request |
| `1` with a budget token | approve; persist `fund 3 fix rounds` alone for that token (budget-only) |
| bare `4` or `5` | approve; persist `none` for 4 or the option-2 description above for 5; engine loop; use the settings allowance |
| `4; allowance 6` or `5; allowance 6` | approve as the corresponding bare option; carry `allowance: 6` to ledger seeding |
| `4` or `5` with a funding token | Say once that funding is waves-only; ignore the funding token and treat the reply as the corresponding bare option, without persisting funding |
| waves approval prose with a funding token | approve; preserve the prose collapsed to one physical line |
| budget token alone (`fund 3 fix rounds` or `allowance 6`) | re-present the gate asking for an approval option; write nothing |
| waves funding token with malformed N, or allowance suffix on an option other than 4/5 | re-present the gate quoting the token; write nothing, never imply a change request |

For every value to persist, read [Standing grants](amendment-surface.md#standing-grants) and run Value decoding. Decode before `edit` or `--amend`; never persist a malformed token. Use the decoded table value in the approval persistence below, including waves budget-only approvals. Strip the loop allowance suffix or ignored funding token before decoding the grant; keep the run allowance separate from `**Amend-grant:**`. In persistence narration, quote the exact resulting `**Amend-grant:**` value in full, including any funding suffix; never substitute an option name or "option-2 description plus suffix" for the persisted text.

On a change request (including a revert), revise the spec and re-present - mint a **fresh** temp path for the re-dispatched summarizer (never reuse a prior round's path, so stale content can never be mistaken for the new summary). On `3` or its label alone: print the audit verbatim from `git -C <abs worktree path> show -s --format=%b HEAD` (never from a held tool result; the body survives the grant's `--amend --no-edit`), then re-present the same gate - the briefing text of the gate message just rendered, reused verbatim (no summarizer re-dispatch, no read of the removed `$SUMMARY_PATH`; if that text is no longer in context, the one-line degrade note takes its place), the `Council:` line, the adjacent lines, the rendered option rows; nothing in the spec or the commit changes. `3` plus a change request is a change request. `3` plus `1`/`2`/`4`/`5` prints and re-presents, and the approval is read only from a clean `1`/`2`/`4`/`5` on the re-presented gate - a reply carrying `3` never grants. A gate-round recommit (change request or revert) re-runs the same heredoc commit with the audit as its body, so HEAD always carries it; on a revert of edit X, move X's `Applied:` line to `Rejected:` with `-> reverted at gate` and recompute the `Council:` counts from the revised audit. On approval - `1`, `approve`, or equivalent prose approves without a grant; `2`, `approve, auto-apply amends`, or equivalent prose approves and grants; `4` approves without a grant; `5` approves and grants using option 2's description - first read [Standing grants](amendment-surface.md#standing-grants) (stop if unreadable). On every implementation approval (1/2/4/5), `edit` the spec's `**Amend-grant:**` value to the decoded table value for funded replies, otherwise the granting sentence for 2/5 or `none` for 1/4. Write exactly one `**Engine:** loop` for 4/5 or `**Engine:** waves` for 1/2 directly below `**Amend-grant:**` in the header block (readers: absent -> `waves`). Then `git -C <abs worktree path> add -- <spec path>` and `git -C <abs worktree path> commit --amend --no-edit -q`, keeping the council-audit body; confirm `git -C <abs worktree path> show HEAD:<spec path>` contains both fields with the selected values and satisfies the grant predicate and Value decoding. A reply that mixes approval with a change request ("2 but rename the section") is a change request: revise, re-present, and read the grant only from the reply to the re-presented gate. If the amend or the HEAD check fails, stop and report; never proceed as granted. The plan and execution mode are mechanical derivatives, so the only human gate here is spec approval itself. Don't land the spec on `main`; it stays in the worktree and ships in the same squash commit as the implementation.

Post-approval changes follow [Amending an approved spec](../SKILL.md#amending-an-approved-spec).

After implementation approval (1/2/4/5), mark the brainstorm phase complete:

```
phase_tracker({ action: "complete", phase: "brainstorm" })
```

Then invoke `/skill:writing-plans` on 1/2 or `/skill:loop-implementation` on 4/5 immediately, with no further prompt.
