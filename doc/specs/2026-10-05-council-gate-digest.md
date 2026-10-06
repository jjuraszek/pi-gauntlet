# Council gate digest: stats line and on-demand dispositions

**Goal:** The brainstorming user review gate shows one council stats line instead of the per-cluster audit, with the full audit available on demand as a third menu row; telemetry keeps recording the audit by reading it from the spec commit command.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Supersedes:** `doc/specs/2026-10-04-spec-summary-briefing.md` - its Out-of-scope exclusion "Changing the council audit rendering or the gate's adjacent-lines template beyond the one rename"; the briefing cap and the summarizer persona are untouched.

## Problem

At the user review gate the summarizer's briefing (196-216 words in the 2026-10-05 Gridstrong and customer-ops runs) is followed by 11-17 council audit lines (271-407 words), each carrying severity, member slugs, the edit, and the probe parenthetical. The council section outweighs the briefing it is meant to annotate, and the approval decision is buried below it. The gate template in `skills/brainstorming/reference/spec-finalization.md` (User Review Gate) requires those lines verbatim, so this is the documented behavior, not a summarizer regression.

The audit cannot simply disappear: `extensions/telemetry.ts` learns the council dispositions only from assistant text at `message_end` during the brainstorm phase (`onCouncilAudit` -> `parseAudit` in `extensions/lib/telemetry-council.ts`), and in the Gridstrong run the gate message was the only assistant text containing a parseable audit. `telemetry-collect.ts` `textOf` ignores tool-call arguments, so the commit body, which already carries the audit, is invisible to the parser today.

Framing: kept - the gate render is the right place to change; the alternative of stripping probe text from each line still leaves 11-17 lines.

## Acceptance criteria

none - no ticket

## Design

### Gate render (`skills/brainstorming/reference/spec-finalization.md`, User Review Gate)

The template's `Coverage:` / `Applied:` / `Deferred:` / `Rejected:` block and its explanatory parenthetical are removed. Directly below the `Spec written and committed to ...` line, when the council path ran, one line:

```
Council: <A> applied, <D> deferred, <R> rejected
```

with `; coverage <N> of <M>` appended only when roasting-the-spec returned a `Coverage:` line. `A`, `D`, `R` are the counts of non-`none` lines under each label of the returned audit. The per-member coverage reasons stay in the audit, not on the stats line.

The menu becomes three rows:

```
1 - approve: <unchanged text>
2 - approve, auto-apply amends: <unchanged text>
3 - show council dispositions: prints the council audit verbatim, then re-presents this gate. Not an approval.
```

Row 3 prints the audit verbatim from the durable record - the spec commit message body, read with `git -C <abs worktree path> show -s --format=%b HEAD` (the body survives the grant's `--amend --no-edit`) - never from a held tool result, which a turn boundary may have pruned. It then re-renders the same gate: the briefing text of the gate message just rendered, reused verbatim (no summarizer re-dispatch, no read of the already-removed `$SUMMARY_PATH`; if that text is no longer in context, the one-line degrade note takes its place), the `Council:` line, the adjacent lines, the three rows. It changes nothing in the spec or the commit. The "Wait for the user" paragraph gains explicit branches: `3` or its label alone -> print and re-present; `3` plus a change request -> a change request (revise, re-present); `3` plus `1`/`2` -> print and re-present, and require a clean `1`/`2` on the re-presented gate - the grant is never read from a reply that carries `3`. The sentence "say `revert applied council edit <X>`" stays, since row 3 is where the user reads the edit names. A gate-round recommit (change request or revert) re-runs the same heredoc commit with the audit as its body, so HEAD always carries it; on a revert of edit X, X's `Applied:` line moves to `Rejected:` with `-> reverted at gate` and the `Council:` counts are recomputed from the revised audit. The template's instruction "use adjacent lines for the audit" is reworded to name the `Council:` line and the on-demand audit.

Worker path (no council), or a council aborted before an audit exists: no `Council:` line and no row 3; the menu is the two approval rows.

### Spec commit transport

The commit-body rule keeps its content (the full audit, verbatim, in the spec commit message body) and gains a prescribed command shape so the audit text is in the bash command itself, one line per line, with no shell quoting or expansion:

```bash
git -C <abs worktree path> add -- <spec path> [<predecessor path>] && git -C <abs worktree path> commit -q -F - -- <spec path> [<predecessor path>] <<'EOF'
<subject>

<audit lines, verbatim>
EOF
```

`-F <file>`, `-m`, `printf | ... -F -`, and `$'...'` strings are not permitted for the spec commit: the quoted heredoc is the only form, so audit lines carrying backticks or `$` land unchanged and start at line starts; the `add` on the same line is required because the spec is untracked at its first commit and `commit -- <path>` rejects an untracked path. The contract test asserts the skill text carries this shape (`add -- <spec path>` and the heredoc). The grant amend (`commit --amend --no-edit`) is unchanged.

### Roasting-the-spec (`skills/roasting-the-spec/SKILL.md`)

Four sentences are reworded to "counts at the gate, verbatim audit on request (row 3), full audit in the spec commit body": the frontmatter `description` ("returns an audit for the user to ratify at brainstorming's gate"), the section-3 over-spec clause ("so the gate shows what was removed" -> "so row 3 shows what was removed"), the section-4 hand-off sentence, and the Red flags entry "Applying edits without surfacing the audit at brainstorming's gate" (-> "without the `Council:` counts and the row-3 audit at brainstorming's gate"). The audit grammar and the `[severity]` / `raised-by:` requirements are unchanged.

### Telemetry (`extensions/telemetry.ts`, `tool_call` bash branch)

`onCouncilAudit` changes its parameter from `content: unknown` to `text: string`; the `message_end` hook passes `textOf(msg.content)`. The bash branch of the `tool_call` handler gains one condition: when `phaseNow() === "brainstorm"` and the command string matches `/\bgit\b[^\n]*\bcommit\b/`, call `onCouncilAudit(command)`. `onCouncilAudit`'s existing `!pending?.chair` early return is the only chair guard. With the heredoc shape above, `parseAudit`'s `^Applied:` / `^Deferred:` / `^Rejected:` line-start matches hit the audit lines unchanged; a `null` parse (a commit without an audit, the grant's `--amend --no-edit`) is a no-op and leaves pending state intact. A successful parse clears `councilPending` as today, so the `message_end` path (kept unchanged as the fallback for a row-3 render and for older skill versions) records nothing twice. Recording happens at call time, before the command runs: a commit that fails (hook, nothing staged) has already recorded and cleared pending; the retry carries the same audit, so nothing is lost.

`derived.council` semantics, the chair-cluster cross-check, and the record schema are unchanged.

## Errors and edge cases

- Partial coverage: `Council: 11 applied, 0 deferred, 0 rejected; coverage 2 of 3`.
- Council aborted (zero usable members, chair failed twice): the existing abort note renders, no `Council:` line, no row 3.
- Commit parsed but the user picks 3: the audit prints from `git show -s --format=%b HEAD`; telemetry ignores the render (pending already cleared).
- An audit line missing `[severity]`/`raised-by:`: `parseAudit` returns `null` for the commit; the first assistant text that parses wins (row 3); if none does, nothing is recorded, silently - same as today.
- A commit that deviates from the heredoc shape is a skill violation, not a telemetry case; the contract test on the skill text is the guard.

## Tests

- `extensions/telemetry.test.ts`: (1) a `tool_call` bash command in the literal heredoc shape (subject, blank line, `AUDIT_TEXT`, `EOF`) during brainstorm after a chair result writes `EXPECTED_COUNCIL` with no `message_end` audit afterwards; (2) a subsequent `message_end` with the same audit does not change the record; (3) the same command outside brainstorm, or before a chair result, writes nothing; (4) `git commit --amend --no-edit` during brainstorm leaves `councilPending` intact and a later `message_end` audit still records; (5) an all-`none` audit (`Applied: none` / `Deferred: none` / `Rejected: none`) in the heredoc records an empty disposition list; (6) a non-git bash command during brainstorm with a chair pending leaves the record untouched.
- `scripts/brainstorming-contract.test.mjs`: the existing bare-marker assertions (`Coverage:`, `Applied:`, `Deferred:`, `Rejected:` present in the file - they survive in the commit-body rule) are unchanged; new assertions: the gate template contains `Council:` and `3 - show council dispositions`, the file contains the heredoc commit shape (`commit -q -F - ` and `<<'EOF'`), and the template no longer contains the per-cluster forms `Applied: [<severity>]`, `Deferred: [<severity>]`, `Rejected: [<severity>]`.
- Eval: new target `eval/spec-gate/` per `eval/README.md`, target text the User Review Gate section of `skills/brainstorming/reference/spec-finalization.md` (sliced by heading, as `eval/brainstorming/run.mjs` slices sections 3-5). `source.md` per sample is a rendered briefing plus a roasting-the-spec return plus a user reply; the candidate renders the gate. Five samples with must-hold facts: `full-council` (11 applied, 0/0 - the `Council:` line carries the counts; the gate shows no per-cluster line; three rows), `partial-coverage` (`; coverage 2 of 3` present; no per-member reason on the stats line), `all-none` (`Council: 0 applied, 0 deferred, 0 rejected`; row 3 still offered), `worker-path` (no `Council:` line; two rows), `row-3-reply` (audit printed verbatim; same gate re-presented; no approval taken, no spec edit). `expected.md` is drafted and approved before the baseline; the baseline runs on the pre-edit section from `git show <pre-edit SHA>:<file>`; the first run's records are committed under `eval/spec-gate/results/`. `scripts/ci.mjs` runs its `run.test.mjs`. The summarizer persona is untouched, so `eval/spec-summarizer` needs no run.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` `### telemetry` (under `## Extensions`) - one sentence that council dispositions are recorded from the spec commit's heredoc command text or, as fallback, from assistant text (operations contract); `CHANGELOG.md` - new `## Unreleased` / `### Changed` entry
- Derived / memory docs invalidated: none (`README.md` Spec council row stays true)

Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- The summarizer persona, its 300-word cap, and the briefing shape (`doc/specs/2026-10-04-spec-summary-briefing.md`).
- The audit grammar, the chair-cluster join, or the telemetry record schema (`doc/specs/2026-09-26-council-telemetry-roster-assessment.md`).
- A general shell-command or message-file parser: only the prescribed heredoc shape is read.
- Any change to the two approval rows' semantics.

## Open questions

none
