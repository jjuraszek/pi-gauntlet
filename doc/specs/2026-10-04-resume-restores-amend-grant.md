# Resume restores the standing amend grant from the spec

**Goal:** a standing amend grant (`auto-apply amends`) lives as one mechanical line in the spec file, written at spec-writing, set by every grant path through one shared predicate, and persisted in git at the moment of consent, so a fresh-session resume honors it on every spec-bearing route and the commit trailer, the only durable record today, is retired.

**Amend-grant:** approve and approve auto-ammendement

Supersedes `doc/specs/2026-09-18-council-grounding-amend-approval.md`, "fresh-session-resume grant boundary" only; supersedes `doc/specs/2026-09-19-readable-amendment-gates.md`, "Standing grant - recording and the fresh-session-resume boundary" only; supersedes `doc/specs/2026-10-04-spec-gate-approval-menu.md`, "Standing grants matcher and trailer" grant recording (the `Amend-grant:` trailer) only. Those specs' grant offer, matcher, and tier-2 render stay in force.

## Problem

A user who replies `2` or `auto-apply amends` at the spec gate waives per-diff review for every later amend-class change in the flow. After `/skill:gauntlet-handoff` and `/skill:gauntlet-resume`, that waiver is gone: the next amend batch stops for review as if the grant had never been given.

This is specified, not accidental. `skills/brainstorming/reference/amendment-surface.md` § Standing grants says "Start a new brainstorm or a fresh-session resume with no grant; never infer one from history", a marker in `scripts/brainstorming-contract.test.mjs` guards that sentence, and the rule descends from the 2026-09-18 and 2026-09-19 specs as a safety boundary. The boundary exists because the grant's only durable record is a `git commit --amend --trailer "Amend-grant: <sentence>"` on the spec commit plus the sentence quoted in `amend:` batch bodies - evidence that must be inferred from history, dies at the squash, and misses a mid-flow grant that was never exercised. Nothing in the spec directory tells a reader that reviews are waived. `gauntlet-resume/SKILL.md` and `reference/brief-contract.md` have no reader for it, and `gauntlet-handoff` has no writer.

This spec reverses the boundary deliberately: the grant becomes explicit recorded consent in the spec file, so honoring it after a resume is reading, not inference.

## Acceptance criteria

none - no ticket

## Design

### The field

One location: a header line in the spec file, in the span between the H1 and the first `##` heading (the "header block"):

```markdown
**Amend-grant:** none
```

or

```markdown
**Amend-grant:** <granting sentence verbatim, one physical line>
```

Placement for writers: directly below `**Goal:**` when that line exists; otherwise the first line after the H1, its blank line, and any `> **Superseded by:**` banner lines. Readers never depend on the position.

The value is `none` or the user's sentence. When the reply was the digit `2`, the sentence is the grant description from the gate menu (the text after `2 - approve, auto-apply amends:`), never the digit - the substitution rule already in `amendment-surface.md` § Standing grants moves from the trailer to this line. A prose grant is normalized to one physical line before the write: newlines and runs of whitespace collapse to single spaces, wording preserved.

### The predicate

One predicate, used verbatim by every reader (resume at entry, amendment-surface at each batch boundary):

| Header block contains | Reading |
|---|---|
| no `**Amend-grant:**` line | no grant (legacy spec; see "Fresh grant on a legacy spec") |
| exactly one line whose trimmed value is `none` | no grant |
| exactly one line whose trimmed value is any other non-empty single-line text | grant active; the sentence is that value |
| two or more lines, or one line with an empty value | malformed -> stop, print the offending line(s) |

Occurrences below the first `##` (such as the examples in this spec) never count.

### Writers (all in `skills/brainstorming/reference/` unless named)

| Moment | File and section | What it does |
|---|---|---|
| Spec-writing | `spec-finalization.md` spec-writing step 2 | the written spec carries `**Amend-grant:** none` in the header block; the inline lint's internal-consistency bullet checks the predicate reads "no grant" (line present once, value `none`) |
| Critique pass | `spec-finalization.md` worker task; `../../roasting-the-spec/SKILL.md` member and chair tasks | each task gains the sentence: "The `**Amend-grant:**` header line is flow machinery owned by the brainstorming gate; never cut, shrink, flag, or edit it." After the critique's edits are applied and before the spec commit, the predicate is re-checked (`none`, exactly once) and repaired if the pass removed it |
| Spec gate approval | `spec-finalization.md` § User Review Gate, "On approval" | the pre-gate spec commit stays where it is (it is unconditional and lands before the user replies). `1`/`approve`: leave `none`. `2`/`approve, auto-apply amends`/equivalent prose: `edit` the value to the sentence, then `git -C <worktree> add -- <spec path>` and `git -C <worktree> commit --amend --no-edit -q`, so the spec commit carries the line and keeps its council-audit body. Then verify `git -C <worktree> show HEAD:<spec path>` satisfies the predicate as "grant active"; otherwise stop and report, never proceed as granted. The `--trailer "Amend-grant: ..."` instruction in `amendment-surface.md` § Standing grants and the "never proceed as granted without the trailer" sentence in this section are deleted together |
| Mid-flow grant (tier-2 footer reply) | `amendment-surface.md` § Standing grants | `edit` the value to the sentence. Line absent (legacy spec): insert it at the writer placement above. Persist per "Persisting a consent change" below |
| Revocation | `amendment-surface.md` § Standing grants | a reply that withdraws the grant (`revoke auto-apply amends`, `stop auto-applying amends`, or the same intent in other words) sets the value to `none`; persist per "Persisting a consent change". A hand-edited line is not an event: the next batch boundary re-reads it through the predicate and the value found is the current consent |
| Redraw | `spec-finalization.md` (spec-writing overwrites) | the rewritten spec carries `none`; a redraw is a new approval |

**Persisting a consent change** (mid-flow grant and revocation): if the value in HEAD already equals the new value, no commit. Otherwise, when the spec file has no other uncommitted change, commit the one file immediately with the message piped on stdin so free text never breaks quoting:

```bash
printf 'grant: %s\n' "<new value>" | git -C <worktree> commit -q -F - -- <spec path>
```

When the spec file is mid-batch (uncommitted amend edits), the consent edit rides in that batch's `amend:` commit and the footer acknowledgment says so. Either way, verify HEAD's copy of the spec satisfies the predicate with the new value; on failure stop and report. When the line was inserted (legacy spec) and a plan exists, run the amendment aftermath's anchor repair (`plan_check` until PASS) and commit spec and plan together, because the insertion shifts every heading by one line. After initialization, every later change is a same-line value edit.

**Consent survives rollback.** `amendment-surface.md` § 5's "Wrong apply -> `git revert` the batch commit" gains one step: after the revert, read the line from the pre-revert HEAD (`git -C <worktree> show HEAD^:<spec path>` through the predicate); if the working tree's line differs, restore that value and persist it per the rule above before re-entering the surface. The pre-revert HEAD holds every consent change committed so far, revocations included, so this is the current consent read from a file, not inferred from history.

The grant-active batch procedure (`amendment-surface.md` § 1 "Standing grant active", § 5 batch commit template) keeps quoting the sentence in the `amend:` body - the per-batch provenance `finishing-a-development-branch` Step 4's digest already reads by record kind (`granted`), unchanged. The `amend:` body quotes the line's value.

### Boundary sentence

`amendment-surface.md` § Standing grants, replacing "Start a new brainstorm or a fresh-session resume with no grant; never infer one from history":

> A grant is the spec's `**Amend-grant:**` line read through the shared predicate; `none` or a missing line means no grant. A new brainstorm writes `none`; a resume honors the line as written. Never take a grant from commit history, a handoff brief, or the transcript; the one read of a prior commit is the post-revert restore, which reads the pre-revert HEAD's spec line.

### Readers

| Reader | Behavior |
|---|---|
| `amendment-surface.md` § 1 "Standing grant active" | re-read the line through the predicate at every batch boundary; active when it reads "grant active"; malformed stops the batch with the offending line(s) |
| `skills/gauntlet-resume/SKILL.md` § Entry checks | new check 6, **Grant field**, runs after the route has resolved `<spec path>` and before that route's first tracker call (routes resolve the path inside Dispatch), so before any tracker mutation. Apply the predicate; malformed -> stop, print the offending line(s), no tracker call. Routes that resolve no approved spec (hotfix, `worktree: no`, a brief whose active phase is brainstorm) skip the check and print no grant line - a grant presupposes an approved spec |
| `skills/gauntlet-resume/SKILL.md` § Post-restore continuation | after the existing closing line, print one more line, verbatim one of `Standing grant active: <sentence>` or `No standing grant.` Resume reports; it never writes the line |
| `<spec path>` per route | process-state restore: the `S` path `brief-contract.md` already resolves for `skip brainstorm`, whose resolver widens from "the single `*.md` spec added after base" to `reconstruction.md` "Candidates" (a base-tracked spec paired with a post-base plan counts), so a seeded spec with a later plan is found; the path is carried to check 6 and Post-restore, never re-resolved. Reconstruction: the spec the human confirmed. Seed: the pinned `<full-path>/<rel>` from `seed.md`. No route re-runs candidate selection for the grant |
| `skills/gauntlet-handoff/SKILL.md`, `reference/brief-contract.md` grammar | no grant field in the brief; the spec carries it. The resolver widening above is the only `brief-contract.md` change. A drift check keeps the grammar grant-free (Tests) |
| `skills/finishing-a-development-branch/SKILL.md` Step 4 digest | no change (reads `auto-apply`/`granted` record kinds) |

### Data flow

```
spec-writing: line = none -> critique pass (line preserved) -> spec commit
   -> gate reply 2: line = sentence -> add + commit --amend --no-edit -> HEAD verified
   -> amend batch: predicate reads active -> apply without review, quote sentence in amend: body
   -> gauntlet-handoff (no grant field)
   -> gauntlet-resume: resolve <spec path> -> check 6 (predicate) -> arm trackers -> announce
   -> amend batch: same as before the handoff

mid-flow footer reply or revocation: line = value -> grant: commit (or rides the batch) -> HEAD verified -> same downstream
```

### Lints and specs

- `scripts/brainstorming-contract.test.mjs` "standing grants own boundaries" test: marker `'new brainstorm or a fresh-session resume with no grant'` becomes `'a resume honors the line as written'`; marker `'Amend-grant:'` becomes `'**Amend-grant:**'`; new assertions: no file under `skills/` contains `--trailer "Amend-grant`; in `spec-finalization.md` the `commit --amend --no-edit` instruction appears after the "On approval" sentence; in `gauntlet-resume/SKILL.md` the `**Amend-grant:**` check appears before the `## Dispatch` heading; in `amendment-surface.md` the legacy insertion row names `plan_check`; `roasting-the-spec/SKILL.md` and the worker task carry the preserve sentence.
- `scripts/ci.mjs` `tokenChecks`: add `["skills/gauntlet-resume/SKILL.md", "**Amend-grant:**", true]`, `["skills/gauntlet-resume/SKILL.md", "Standing grant active:", true]`, `["skills/gauntlet-resume/SKILL.md", "No standing grant.", true]`, `["skills/gauntlet-handoff/SKILL.md", "Amend-grant", false]`, `["skills/gauntlet-resume/reference/brief-contract.md", "Amend-grant", false]`. The `GRANT_SENTENCE` byte-identical count (1x spec-finalization, 2x amendment-surface) is unchanged.
- Supersession banners on the three predecessor specs named at the top.

## Errors and edge cases

| Case | Behavior |
|---|---|
| Spec has no `**Amend-grant:**` line (pre-change spec, hand-written seed) | reads "no grant"; resume prints `No standing grant.`; batches escalate as today; a fresh explicit grant inserts the line once (with anchor repair when a plan exists) |
| Two lines, or an empty value | resume stops at check 6 with the offending line(s), trackers untouched; amendment-surface stops the batch the same way |
| Line elsewhere in the header block | legal; readers scan the whole header block |
| `**Amend-grant:**` text below the first `##` | ignored by the predicate |
| Multi-line prose grant | normalized to one physical line before the write; a multi-line value found on read is malformed |
| Sentence containing quotes | the commit message is piped with `-F -`; the spec line stores it verbatim |
| Mid-flow consent change, unrelated dirt in the worktree | the `grant:` commit names only the spec path; other dirt stays |
| Mid-flow consent change while the spec has uncommitted amend edits | rides that batch's `amend:` commit; footer says so |
| Consent change whose value already matches HEAD | no commit |
| Batch commit reverted | the pre-revert HEAD's line value is restored and persisted before re-entry |
| Grant given in a resumed session | ordinary mid-flow grant; resume itself never writes |
| Redraw | fresh `none`; no carry-over |
| Resume route without an approved spec (hotfix, `worktree: no`, brainstorm-active brief) | no check, no grant line |
| Seed route (spec tracked on `main`) | the line is in the tracked file; read through the pinned path |
| Critique pass deletes the line | re-check before the spec commit repairs it to `none` |

## Tests

- `scripts/brainstorming-contract.test.mjs`: the marker changes and the five ordering/presence assertions above.
- `scripts/ci.mjs`: the five `tokenChecks` rows above; the `GRANT_SENTENCE` counts stay 1x and 2x.
- `README.md` § Handoff and resume "Smoke walkthrough" gains step 9: spec approved with `2`, handoff, fresh `/skill:gauntlet-resume <brief>` prints `Standing grant active: <sentence>` after the closing line and the next amend batch applies without a menu; a spec approved with `1` prints `No standing grant.`; a spec with two `**Amend-grant:**` lines stops before any tracker call.
- Verification command: `npm test`.

## Documentation impact

Bar: `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` § Handoff and resume - one sentence that a resume honors the spec's `**Amend-grant:**` line and prints its status on the line after the closing line, plus smoke step 9 (communication contract between the handoff/resume pair and brainstorming's amendment surface); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: none (`doc/configuration.md`'s `grant_fix_rounds` is a different grant and stays correct; `AGENTS.md` routing unaffected)

`amendment-surface.md`, `spec-finalization.md`, `roasting-the-spec/SKILL.md`, `gauntlet-resume/SKILL.md`, and `brief-contract.md` are implementation surface (plan file list), not doc-impact entries.

## Out of scope

- A grant field in the handoff brief or in `phase_tracker`/telemetry state (rejected: duplicates the spec line, widens the cohort-coupled brief grammar, and leaves bare-worktree and seed resumes blind).
- Scanning `git log` for the trailer (rejected: inference, dies at squash, misses unexercised mid-flow grants).
- Any change to what the grant permits (scope changes apply, redraws stop, the spec gate is never satisfied by it).
- A runtime parser for the field; the predicate is skill prose, verified by text assertions and the human smoke step.
- `grant_fix_rounds` (verify-phase fix-round credits) - a different mechanism.

## Open questions

none
