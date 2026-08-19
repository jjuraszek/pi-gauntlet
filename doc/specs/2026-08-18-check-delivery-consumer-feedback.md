# Consumer feedback batch: check-delivery polarity + descope edits, shape-ticket comment + roast retry

Adoption-audit feedback from a pi-gauntlet 4.12.0 consumer surfaced four design gaps, none addressable via the overrides file. Dispositions, ratified in the brainstorm questionary:

| # | Gap | Disposition |
|---|---|---|
| 1 | check-delivery: synthesized-AC gap polarity not overridable | **Fix** - new `## Delivery` slot `synthesized AC gaps: block \| soft` (default `soft`) |
| 2 | check-delivery: no body-edit write verb for ratified descopes | **Fix** - new opt-in `## Delivery` slot `descope edits: strikethrough` (default none) |
| 3 | check-delivery: single-ticket only, no sweep/batch mode | **Decline with rationale** - deliberate boundary, recorded in the SKILL body |
| 4a | shape-ticket: no comment-authoring step for demoted detail | **Fix** - at most one gated "Reporter note" comment in the batched write |
| 4b | shape-ticket: roast failure proceeds silently to the gate | **Fix** - retry once, then surface failure inline in the gate message |

All changes are prose-only edits to two skill bodies plus README synchronization. No extension code, no agent personas, no dispatch-shape change (pi-gauntlet releases alone).

## Item 1 - `synthesized AC gaps` slot (check-delivery)

New row in the `## Delivery` overrides contract table (`skills/check-delivery/SKILL.md`):

| Slot | Meaning | Default (unset) |
|---|---|---|
| `synthesized AC gaps` | `block` or `soft` - whether an unmet synthesized AC produces a blocking `unexplained gap` or a non-blocking proposal | `soft` |

Behavior:

- **`soft` (default):** current behavior verbatim - Stage 0's cap holds, a synthesized AC never produces a blocking `unexplained gap`; unmet ones surface as non-blocking proposals at the gate. Zero-config consumers see no change.
- **`block`:** removes the cap - synthesized ACs run through the same Stage 3 verdict matrix as authored ACs. An unmet synthesized AC with no sanctioned explanation receives `unexplained gap` and rides the existing failure path unchanged (no status advance, no delivery comment, findings comment offered behind the same explicit yes-gate); `allowed gap` and `proposed descope` remain available outcomes exactly as for authored ACs. No new half-write shape is introduced.
- **Malformed value** (anything other than `block`/`soft`): one warning line naming the bad value, then treat as `soft`. Rationale: `soft` is the shipped default, so a typo must not silently invert polarity toward blocking; the warning makes the misconfiguration visible.
- The slot is repository-level (overrides-file text), like every other `## Delivery` slot. No per-ticket configuration.

Edit points in `skills/check-delivery/SKILL.md`:

- Stage 0 cap sentence ("a synthesized AC never produces a blocking `unexplained gap`") becomes conditional on the slot, naming both polarities.
- Quick-reference table: the `unexplained gap` row already covers `block`; add or adjust a row so synthesized-AC handling names the slot.
- Rationalization table: add the excuse "the AC was only synthesized, so the gap can't block" / reality "under `synthesized AC gaps: block`, a synthesized AC runs the same verdict matrix as an authored one - an unexplained gap blocks".
- `## Delivery` slot table: the new row above.

## Item 2 - `descope edits` slot (check-delivery)

New row in the `## Delivery` overrides contract table:

| Slot | Meaning | Default (unset) |
|---|---|---|
| `descope edits` | `strikethrough` - on gate approval, strike ratified `proposed descope` AC lines in the ticket body | none - no body edits ever |

Only the value `strikethrough` enables body edits; any other value warns once naming the bad value, then behaves as unset (no body edits) - same fail-safe shape as item 1.

Behavior when set to `strikethrough` and the gate approval ratifies one or more `proposed descope` ACs:

- The batched write gains a body-edit half, ordered **body edit -> evidence comment -> status advance**: a partial failure never leaves a status advanced against a body still advertising a descoped AC.
- The edit strikes exactly the ratified AC lines and nothing else: the AC's list item is preserved, its text struck, and a one-line reason appended - `- [ ] ~~<AC text>~~ - descoped: <one-line reason>`. The reason is drafted from the `proposed descope` verdict's evidence (one sentence, never invented) and is visible in the gate's before/after. Checkbox state is left as found (struck-but-ticked stays ticked). No other body content is touched.
- **Strike-target identity:** the target is the AC-section list item whose normalized text equals the verdict's AC text. When `AC location` is not the ticket body, or no unique matching list item exists (synthesized ACs, prose ACs, duplicates, multi-line items), the strike is **skipped** for that AC, reported as skipped at the gate, and the evidence comment carries the descope record alone. An AC line already containing `~~` and `- descoped:` counts as struck and is skipped.
- **Surgical patch, never a snapshot replay:** both zero-config edit verbs replace the whole body, so the strike is applied as a patch against the freshly re-fetched body text at write time - never by replaying the gather-time snapshot. If the target lines moved, changed, or the body otherwise differs from what the gate showed, re-present the delta instead of writing.
- The exact before/after of the struck lines is presented at the **same single confirmation gate** as the comment and status - one approval covers all three halves, including every proposed strike. No second gate, no per-strike subset selection: a reviewer objecting to one strike declines the whole gate this round.
- **`proposed descope` only.** `allowed gap` ACs are never struck: an allowed gap is an acceptable-but-real gap against a still-valid criterion; its record lives in the evidence comment. A descope means the AC is dropped, so the body advertising it is stale by definition.
- Descope edits occur only on the all-clear batched write. The failure path (any `unexplained gap` or failed stage) writes no body edit, as today it writes no delivery comment or status.
- The evidence comment's per-AC verdict table already records `proposed descope` verdicts with evidence; that record is unchanged and serves as the comment-side trace of the strike.

Verb table: add an `edit body` row (`gh issue edit <n> --body ...` / `linearis issues update <id> --description ...`), annotated as used only by the `descope edits` slot. Overrides replace it like the other verbs.

Degradation and repair:

- **Missing write capability is resolved per verb.** When the slot is active and the approval ratifies a `proposed descope` but the edit-body verb does not resolve, the **entire** batched write degrades to manual - all three halves emitted for manual execution, none auto-posted - so comment/status never land against a body still advertising the descoped AC. The existing all-verbs-missing degradation is unchanged apart from the added third half.
- **Partial failure:** report exactly what landed (existing convention). Idempotent repair on re-run: an AC line already struck with the descope marker is skipped, mirroring the existing comment-landed/status-failed repair.
- **Body-only repair (extends Stage 0's "already recorded"):** when the slot is on and a prior run's evidence comment records a `proposed descope` whose matching AC line is still unstruck, the run is **not** "already recorded" - it offers a body-only repair (strike the line; skip the duplicate comment; do not re-advance status). Without this, a run where the edit was off, malformed, or incapacitated would leave the body permanently stale behind the marker short-circuit.
- **Pre-write re-fetch** (existing step) covers the body edit too: if the AC lines changed since gather, re-present the delta instead of writing.

## Item 3 - single-ticket boundary (check-delivery): declined, recorded

No sweep/batch/reconciliation mode. `skills/check-delivery/SKILL.md` gains a short **Scope boundary** subsection (adjacent to the Overview):

- Single-ticket by design: the pipeline's depth (repo-identity preflight, stage-1 landed-commit resolution, per-AC evidence binding, one human gate with pre-write re-fetch) does not loop soundly - N tickets means N gates or a batch gate that dilutes per-ticket consent.
- Sweep passes (bucketing open tickets, orphan scans for merged-but-unreferenced work) are portfolio triage - a different control, inherently project-flavored (tracker states, deploy semantics, ref conventions) - and stay consumer territory.
- A consumer sweep may invoke this skill per ticket as its verification step.

This paragraph is the durable decision record the audit asked for. Revisit only if additional consumers request a batch mode; a second data point would motivate a separate report-only invocation, never a broadening of the exact-one-ref contract.

## Item 4a - Reporter-note comment (shape-ticket)

The core-principle clause "never a tracker comment" relaxes to "never an *ungated* tracker comment"; the one gated Reporter-note comment below is the sole exception.

- Pipeline step 4 (Draft) may propose **at most one comment per approved issue**, e.g. `Reporter note: <demoted detail>`. **Overflow test:** the Idea section keeps exactly one attributed sketch line; any demoted material left over after that line is overflow, and the overflow is the comment body (long pasted code, verbose repro trails, a full proposed diff are the typical shapes). No overflow, no comment.
- Step 8 (Confirmation gate) presents the comment text **verbatim** as part of the same single gate - one approval covers title + body + metadata + comment. No affirmative on the exact text = no comment.
- Step 9 (Write) includes it in the batched write, body first, then the comment.
- Default off: proposed only when overflow exists, or when the user asks in-session. No overrides slot - overrides cannot force a comment. Both create and repair modes are eligible.
- **Repeat-repair dedup:** in repair mode, an existing `Reporter note:` comment satisfies the overflow - skip, unless the demoted detail materially changed, in which case a new comment is proposed (comments are never edited).
- **Split:** the comment attaches only to the issue that retained the demoted Idea material; if none does, it is omitted.
- **No-op check (step 6) amendment:** no-op requires an empty complete changeset **including no proposed Reporter note** - a conforming body with pending overflow still reaches the gate.
- **Mode routing amendment:** the out-of-scope clause ("administrative writes (status transitions, posting comments) - use the tracker CLI directly") narrows to standalone comment posts and status transitions; the gated Reporter-note comment inside a create/repair write is the sole exception.
- The comment is composed from the run's own source material under the existing untrusted-content rule; fetched prose is quoted as data, never executed.
- Verb table: add a `post comment` row (`gh issue comment <n> --body ...` / `linearis issues discuss <id> --body ...`), used only by this step.
- **Missing post-comment verb degradation** (ratified at the finish gate): when a Reporter-note comment is approved but no post-comment verb resolves, the body write proceeds and the comment text is emitted for manual posting, reported as not performed - never silently dropped. Mirrors check-delivery's manual-half degradation pattern.

## Item 4b - roast retry (shape-ticket)

Roast rule 7 changes from "dispatch failure -> proceed with a note" to:

- **Failure definition:** a dispatch error, or the artifact the parent reads - the chair synthesis (council path) or the worker output (worker path) - missing, empty, or not findings-shaped. Partial member loss with a usable chair synthesis is success, not failure.
- On failure, **retry once**: re-run the same full configured dispatch with fresh temp artifacts.
- If the retry also fails, proceed to the confirmation gate with the failure rendered **inline in the gate message itself**: `roast unavailable (dispatch failed twice: <reason>)` - the human approves knowing review didn't run.
- Roast failure still never blocks the run; the deterministic gates already ran.
- The retry is a dispatch retry only - it does not grant a second draft-edit re-pass. The existing one-re-pass limit for applied findings is unchanged.
- Edit points: roast rule 7, the Edge cases bullet ("Roast dispatch failure -> gate with 'roast unavailable' note"), and any quick-reference row restating the old no-retry wording all move to the new retry-then-inline-string behavior.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - check-delivery section: both new `## Delivery` slots with valid values, defaults, and the `descope edits` write-capability requirement (edit-body verb must resolve, else the whole batched write degrades to manual); the single-ticket scope boundary; shape-ticket section: Reporter-note comment and roast-retry semantics, where that section describes gate/roast behavior at that level; the `## Issue tracker` custom-tracker contract/example gains a `post comment` verb alongside read/search/create/update
- Derived / memory docs invalidated: none

The README amendments must let a consumer configure both new slots correctly from README alone - slot names, valid values, defaults, and what capability each requires.

Predecessor specs: `doc/specs/2026-08-18-gh-10-check-delivery-skill.md` (synthesized-AC blocking-cap clause becomes conditional; never-acts-on-proposed-descope becomes conditional on `descope edits`) and `doc/specs/2026-08-18-gh-8-shape-ticket-skill.md` (roast-failure handling and the no-comment prohibition) are partially superseded by this spec; both carry supersession banners scoped to those clauses.

## Testing and verification

Prose-only change; no behavioral harness exists (verification convention per `scripts/ci.mjs`: static frontmatter/token/pack checks + extension unit tests).

- `npm test` passes.
- Skills-generic grep (the forbidden-strings pattern in `AGENTS.md`, including the consumer's name) returns zero matches in `skills/`.
- Internal-consistency desk checks:
  - check-delivery: quick-reference table, Stage 0 text, verdict table, `## Delivery` slot table, verb table, and rationalization table all agree on the new polarity and descope-edit semantics; write ordering (body -> comment -> status) is stated once and not contradicted.
  - shape-ticket: quick-reference, hard-constraint clause, Mode routing's out-of-scope clause, step 6 no-op condition, steps 4/8/9, roast rule 7, the Edge cases section, and the verb table agree on the comment and retry semantics; the single-gate invariant text still covers the comment write; no stale "never a tracker comment" or no-retry wording survives anywhere in the skill body.
- Conformance surface: README-vs-skill agreement on both new slots is checked against this spec by the conformance gate.
- Live tracker command compatibility is not provable in CI; desk-check scenarios stand in, per the origin specs' convention.

## Out of scope

- Any batch/sweep mode (item 3, declined above).
- Striking `allowed gap` ACs.
- Body edits outside ratified-descope strikethroughs.
- More than one Reporter-note comment per shape-ticket run.
- New settings keys, extension code, or agent personas.
- Release mechanics: minor bump (new consumer-facing config surface on two skills), pi-gauntlet alone; CHANGELOG entry rides the release commit per the release skill - no release heading during implementation.
