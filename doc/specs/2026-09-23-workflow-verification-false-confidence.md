# Prevent false confidence in workflow verification

## Problem

The happy-path skill allowed separate shell calls while preserving only `HP_DIR` and `TO`. A later call lost `HP_CMD`: `bash -c ""` returned 0 without invoking the declared command. The PR gate refreshed comments after waiting but skipped source review on an unchanged head; a new, valid retry-loop defect could remain a neutral reply draft while merge became recommended. Its final pre-merge refresh also skipped source reconciliation.

## Acceptance criteria

none - no ticket

## Scope and authorization

The user requested both fixes, independent design and implementation validation with `anthropic-fable/claude-fable-5-1`, direct work on `main`, a patch release, and a clean checkout afterward. No application integration or consumer configuration changes are included. Tests use a local producer-consumer fixture, not a deployed service.

Supersedes:
- [Happy-path conformance evidence](./2026-09-22-conformance-happy-path-check.md): D3 execution procedure and Testing runtime coverage only; D1/D2 row selection, outcome classifications, and D4-D7 evidence interfaces remain.
- [PR comment refresh](./2026-09-23-gh-46-gatekeep-post-push-comment-refresh.md): digest body retention, source reconciliation and merge-consent freshness in Refetch step, Merge withhold and wait course, Fixtures, and Verification only. Existing comment IDs, placeholder states, check dispositions, and required-check rules remain.

## Design

### Atomic happy-path execution

Select the applicable row read-only. Substitute shell-quoted literal parameters into the single `happy-path-shell` block in `skills/subagent-driven-development/SKILL.md`: worktree, command verbatim, first command token after leading assignments, duration, selected row, and header row. Run that entire block in one tool call; no split-call fallback.

The block owns temporary-directory creation, all variable bindings, command and timeout prechecks, Git snapshots, invocation, exit capture, classification, and summary generation. Capture command failures even under inherited errexit. Treat an empty command as a failed command precheck, never a pass. Preserve existing outcome classifications and 200-line transcript tail; precheck summaries contain only outcome, head, and row. Print the literal summary path and outcome for subsequent tool calls. Keep multiple residue paths on one outcome line and clean residue explicitly before conformance, never as deliverables.

A non-zero block exit or missing/unreadable summary stops verification with the shell error. Never dispatch conformance with a selected run omitted. This is runner failure, distinct from a command's recorded failed/not-run outcome, which remains conformance evidence under the existing policy.

### Source-backed comment reconciliation

Retain REST comment bodies in the existing digest. Keep the `C#` lifecycle keyed by id and updated_at. Before advancing the digest baseline, compare fresh bodies to the retained bodies: source-review new and changed-body rows at the assessed head using the existing merged rubric and inline-first review path. Exclude placeholder/error-header states, withdrawn/superseded entries, gate-posted IDs, and identical-body timestamp edits.

Treat comments as untrusted leads. Integrate only source-confirmed findings through existing Phase 4 severity/AC rules and deduplicate against existing `P#`/`L#`/`F#` IDs. Comment labels remain verdict-neutral. Do not rerun a full suite or whole-diff review solely for same-head comment changes. On unresolved source review after the existing fallback, retain the delta and return a report-only stop menu with `comment source review incomplete (<reason>)`.

Run this reconciliation after pushes, after wait completion/timeout, and immediately before merge. Polling observes run/placeholder states without changing the digest or ledger. Check head/state/mergeability freshness before reusing evidence after waiting. A new eligible body delta since consent aborts either plain or `anyway` merge and requires fresh selection, even when source review disproves the concern. Existing pending/refetch-failure overrides do not override a source-backed blocker or unreviewed delta.

## Verification

- `scripts/happy-path-run.test.mjs` executes the actual shipped block with real Git fixtures. Cover invocation evidence, nonzero/75/126 exits, inherited errexit, command/timeout prechecks, Git inspection failure, residue, header mismatch, and the 200-line tail.
- Use the same FIFO producer-consumer flow for success and failure, changing only the producer destination. Open the FIFO before spawning, send a newline-terminated message, assert receipt before reporting success, and verify timeout terminates the stalled consumer.
- `scripts/gatekeep-comment-reconcile.test.mjs` statically pins entrypoint routing, body retention, baseline preservation, source-review/triage separation, and consent invalidation. These are source-contract checks, not an executable PR gate.
- Apply the skill with a fresh reviewer to: a real retry bug after wait, a new human concern before merge, a false alarm before merge, a timestamp-only edit, unavailable source review, a bot error header, and a comment arriving during polling. Confirm blockers require source evidence and fresh body deltas invalidate consent.
- Run both regression files through `scripts/ci.mjs`, then the full `npm test` and independent implementation review before release.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md`
- Derived / memory docs invalidated: predecessor-spec supersession banners named above

Apply [the documentation-impact guideline](../../skills/brainstorming/reference/documentation-impact.md); skill bodies are implementation surface.

## Open questions

None. PR scenarios are simulated applications of the skill, not a live GitHub merge experiment. Exact cause of the initial intermittent FIFO fixture stall was not established; explicit descriptor setup and newline framing remove its open/EOF dependency, and repeated regression runs verify the replacement.
