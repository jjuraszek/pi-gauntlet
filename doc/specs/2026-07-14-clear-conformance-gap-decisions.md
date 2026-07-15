# Clear Conformance Gap Decisions

## Context

The finish-time conformance gate presented carried-open findings as terse identifiers:

```text
G1: PARTIAL - recommended: rescope - touched-files: unknown
```

then offered a flat D1-D5 menu for the whole gap. A human could not tell what the
concern was, why it mattered, or what each option would do - and a gap could bundle
several independently decidable concerns under one disposition.

A first implementation pass fixed the information gap but overcorrected: per-concern
cards with a five-line disposition block each, an audit-identity/hash freshness
protocol duplicated across three files, and a long execution narrative. Two fresh
reviews judged it bloated and only partially more readable - the user render still
led with schema density and still surfaced the cryptic `touched-files: unknown`
token.

This spec is the corrective contract. It keeps the earlier pass's sound core
(concern decomposition, the single availability table, concern-scoped fix
projection, zero-gap fast path, the durable machine handoff) and **replaces the
user-facing render and the freshness mechanism** with a dense, example-driven,
recommended-set-first design. It changes no runtime code, no reviewer evidence
contract, no verification partitioning, no fix-loop bounds, and no branch-integration
choices.

## Goals

- User render is a dense list: **one line per decision**, plain language, recommended
  choice inline.
- Minimize symbols: show `Gn/Cn` handles only where a reply must target something and
  a gap actually split; single-concern gaps show no `/Cn`.
- One clear recommended set; a two-option reply (`1` = all recommended, `2` =
  recommended-except-overrides).
- Cut context cost: shrink the freshness machinery to one anchor + one rule, and
  de-duplicate finishing against the reference.
- Preserve the zero-gap fast path (no ceremony) and every decision's executable path.

## Non-goals

- Changing `agents/conformance-reviewer.md` or its structured gap-block contract.
- Changing verification partitioning, the bounded fix loop, worktree rules, commit
  naming, or revert tiers.
- Changing the **durable machine handoff's concern schema** (per-concern fields the
  fix projection consumes) - only the identity header shrinks and the user render
  changes.
- Adding an extension, parser, settings key, or manifest.
- Changing the mid-verify cap-exhaustion escalation terminal.
- Re-litigating the two user-ratified decisions from the prior pass (`maxFixRounds: 0`
  is audit-only; light revert runs canonical tests before re-audit).

## Two surfaces

Keep these distinct throughout:

- **Durable block** (machine handoff): the `## Closure / conformance` block the verify
  gate emits and finishing consumes. Survives pruning. Its concern-card fields are
  unchanged from the prior pass; only the identity header shrinks (below).
- **User render** (finishing Step 3.5): the dense bullet list derived from the durable
  block at gate time. Never shows durable-card internals (ownership, evidence tokens,
  identity).

## Architecture

`skills/verification-before-completion/reference/conformance-check.md` stays the
**single source** for the durable handoff schema, concern-decomposition rules (the
single-vs-multi-concern split criteria live here, unchanged), the disposition
availability table, the `UNAUTHORIZED` question text, the `recommended: none`
preflight, and the concern-scoped fix projection.
`skills/finishing-a-development-branch/SKILL.md` Step 3.5 owns only **render, response,
and execute-order**, consuming the reference by link - it applies the availability
table's invariants per concern but does not restate the table, the `UNAUTHORIZED`
question, or the preflight prose.

Decision unit is the **gap by default**. The verifier decomposes a gap into `Gn/Cn`
concerns only when they are independently decidable (reference rules, unchanged); the
render collapses a single-concern gap to one bullet with no `/Cn`, and its reply
handle is the gap ID `Gn`.

## Freshness (replaces the identity/hash protocol)

**Delete** from all three files (`conformance-check.md`, `finishing-a-development-branch/SKILL.md`,
`subagent-driven-development/SKILL.md`): `audited-spec-path`, `audited-diff-hash`,
`audited-spec-hash`, the `git hash-object` recompute block, and the finish-time
untracked-file gate. Grep targets to confirm removal: `audited-spec-path`,
`audited-diff-hash`, `audited-spec-hash`, `hash-object` absent from all three.

**Keep** one cheap anchor so "changed since the audit" stays decidable after pruning
(without an anchor the rule collapses to always-re-audit, defeating the fast path):

- The durable block opens with two lines: `status: CONFORMS (0 open)` or
  `status: GAPS (N open)`, then `audited-base: <full HEAD SHA at audit time>`.
- Finishing's freshness rule, in full: compare `audited-base` to the **current working
  tree** (not to `HEAD` - a two-dot `..HEAD` diff misses staged/unstaged edits when
  HEAD has not moved) with two cheap commands, `git diff --stat <audited-base> -- .`
  (tracked changes) and `git status --porcelain --untracked-files=all` (untracked
  deliverables). **Any output from either, or any doubt, triggers a fresh audit.** A
  closure block not opening with the two-line sentinel, a missing/mismatched sentinel,
  or a malformed structured reviewer block also triggers a fresh audit. No hashes, no
  identity fields.
- Sentinel validation: `CONFORMS` requires `N = 0` and no bullets; `GAPS` requires
  `N > 0` matching the decision-unit count. A mismatch is stale -> re-audit.
- `N` = count of open concerns (decision units), matching the rendered bullet count.

**Audit-input rule (kept, one sentence, at audit time in the reference):** stage or
commit untracked deliverables before auditing, since `git diff <base> -- .` omits
untracked files from the reviewer payload. This is the audit-time correctness rule,
distinct from the deleted finish-time recompute gate.

SDD "After All Tasks" step 3 is in the change set: rewrite its header sentence so the
emitted block opens with the `status`/`audited-base` sentinel above, not the six
fields.

## Durable card schema (unchanged, stated for clarity)

Each open concern in the durable block keeps its prior-pass fields: `Gn/Cn` label,
title, `verdict`, `origin`, `evidence`, `impact`, `remediation`, `touched-files`,
`touched-resources`, `recommended` (a disposition or `none`), and `rationale`. The
fix projection consumes these. The user render derives its one-line bullet from
`title` + `evidence`/`impact` + `recommended` + `rationale`; it does not print the
other fields.

## User render

**Zero-gap:** print exactly `Closure / conformance: CONFORMS`, continue to Step 4.
No approval prompt, no menu, no sign-off, no shared options line. An
auto-applied-fix index, if present, is one informational non-blocking line with a
revert offer.

**Carried-open:** a header line with the decision count, then one bullet per decision
unit, then the shared options line, then the recommended-set reply. Each bullet:
`* <handle> - <plain title>: <what's unresolved, one clause>. <short question> Recommended: <choice> (<one-clause why>).`

Rules:

- The `<handle>` leads each bullet and is a short human word derived from the title
  (`Cache coverage` -> `cache`); it must be unique across the render (on collision,
  append a digit) and is the token option 2 targets. When a gap split and no clean word
  fits, use the bare `Gn/Cn`; a single-concern gap uses its gap ID `Gn`.
- Alternative dispositions collapse to a **single shared line** below the bullets
  (`Other options per item: fix-now / accept / rescope / follow-up / custom`), listing
  the options **generally available across items**. When a specific item's availability
  deviates - an option unavailable for it, or an `UNAUTHORIZED` item whose `rescope` is
  unavailable and whose `fix-now` means removal - note that deviation as a short
  parenthetical on **that item's bullet** (one clause, not a block), e.g.
  `(rescope N/A: scope creep)`. No per-concern five-line block. Full per-option effects
  only on request or when option 2 targets an unclear choice. This line appears **only
  in the carried-open render**, never in the zero-gap path.
- **No identity, hash, ownership, or evidence-token lines in the user render.** Those
  stay in the durable block.
- `UNAUTHORIZED` bullet uses the reference's existing question verbatim
  (`Should this unrequested behavior become part of the current workflow?`); per the
  availability table `rescope-into-spec` is shown **unavailable** (not dropped) and
  `fix-now` means **removal** of the unrequested code (availability keyed on removal
  feasibility, not on any artifact).
- `revert conformance fix Gn`, when the gap has an auto-applied fix, renders on the
  shared options line as a separate one-off action - never inside a bullet's
  recommendation and never in the option-2 list.

Representative carried-open render (multi-concern gap G1; single-concern gap shown as `cache`; `UNAUTHORIZED` gap `auth`):

```
Conformance: 3 decisions needed before shipping.

* e2e - Source-image E2E validation: not run; blocked (HYDRA1.png, HTTP 401).
  Still in scope for this branch? Recommended: rescope (defer until image available) (fix-now N/A: needs HYDRA1.png).
* cache - Cache coverage: implemented but the spec is silent on it.
  In scope? Recommended: accept into spec (behavior is intentional).
* auth - Unrequested admin bypass: adds an unlisted route. Should this unrequested behavior become part of the current workflow? Recommended: fix-now = remove it (rescope N/A: scope creep).

Other options per item: fix-now / accept / rescope / follow-up / custom.

1. Go with recommended
2. Recommended except <handle>=<choice>   e.g. "2: cache=follow-up"
```

Single-concern render is identical minus the split: one bullet whose handle is the gap
ID or word, no sibling.

## Response grammar

```
1                                  -> apply every recommendation
2: cache=follow-up                 -> recommendeds, except cache -> follow-up
2: e2e=custom(open ticket after image lands), cache=follow-up
```

- `1` (or `apply recommended`) applies all recommendations.
- `2:` takes a comma-separated override list, each `<handle>=<choice>`; omitted items
  keep their recommendation. A handle may appear at most once (repeat = invalid).
- `custom(<concrete effect>)` supplies an inline effect. Manual fix-in-place is
  expressed only as `custom(...)` where isolated `fix-now` is unavailable.
- `recommended: none` items follow the reference's preflight (finishing links, does not
  restate): the item is listed as needing a `<handle>=custom(...)` decision, and
  option 1 is withheld until every open item has an executable recommendation; after
  the custom decision the menu re-renders for the remainder.
- `revert conformance fix Gn` is a valid standalone reply, mutually exclusive with `1`
  and `2:`; it never appears inside a `2:` override list.
- Invalid handle or choice -> focused reprompt naming only that item (unknown token:
  list the valid titled handles; known item, bad choice: repeat its title + available
  choices); all valid picks retained, gate not reopened.

## Execute order

Take no action before the reply. Then, once, in order (same guarantees as the prior
pass, stated once):

1. **Normalize** every `custom(...)` into explicit operations; classify state-changing
   (edits code or spec) vs not. Clarify only an ambiguous or unexecutable effect.
2. **Commit spec edits** (`accept-into-spec`, `rescope-into-spec`, state-changing
   spec `custom`) - main session edits the spec directly, before any fix dispatch.
3. **Re-audit** if step 2 changed the spec; regenerate the inventory and re-render if
   it changed. Project `fix-now` only from the refreshed inventory.
4. **fix-now + code-changing custom:** project selected `fix-now` concerns per gap into
   the reference's concern-scoped fix contract (excluding accepted/rescoped/followed-up
   siblings); run the reference "Fix loop" (that section survives unchanged - only the
   identity header and the render are deletion targets). A code-changing `custom` runs
   tests + `code-reviewer` on its delta before proceeding. Re-run canonical tests.
5. **Re-audit** after all state-changing work; obtain fresh decisions **only if** the
   refreshed inventory differs from the approved one, else proceed to follow-up.
6. **follow-up** from the current inventory: create the item via the project's
   issue-tracker convention (`.pi/gauntlet-overrides.md`), record ticket ID/URL; on
   failure keep the concern open.
7. **Non-state-changing custom:** execute and record the result.
8. **revert** (`revert conformance fix Gn`): light-revert the indexed commit, re-run
   canonical tests; on failure stop; on pass re-audit and regenerate.
9. Re-enter Step 3.5 if any concern remains open.

Record every final disposition with its stable ID as `Gn/Cn - <title>: <disposition>`
(or `Gn - <title>: <disposition>` for a single-concern gap; ticket for `follow-up`,
result for `custom`), then continue to Step 4. This durable record is the machine/audit
surface; the interactive render stays handle-based.

## Edge cases

- Single-concern gap: one bullet, no `/Cn`; reply handle is the gap ID `Gn` or its word.
- `recommended: none`: withhold option 1 until a `custom(...)` decision is supplied
  (reference preflight).
- `fix-now` unavailable (non-worktree / detached-HEAD / `maxFixRounds: 0` /
  `touched-files: unknown` / inaccessible resource): noted as an inline deviation on
  that item's bullet with the reason (the shared options line lists only generally
  available options); resolve via another disposition.
- `UNAUTHORIZED`: reference question verbatim; `rescope` unavailable and `fix-now` =
  removal, both as an inline deviation on that item's bullet.
- Legacy terse row / stale sentinel / malformed block / any working-tree change vs
  `audited-base` (the two-command freshness check above): fresh audit, never the old
  menu, never inference from pruned history.
- Grouping under the recommended set only when items share a disposition and rationale;
  each grouped handle repeats its title.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md - conformance-gate entry now describes a dense one-line-per-decision list with a recommended set and a `1`/`2` reply; remove any audit-identity/hash freshness wording
- Derived / memory docs invalidated: none

## Testing

Workflow-contract change, no runtime code.

- **Fixture re-run.** Recreate the ten fresh-context scenarios (they live only in prior
  session history, not the repo) under a temp dir and review each against the updated
  contracts. The ten: F1 zero-gap CONFORMS -> direct to branch options, no ceremony;
  F2 one gap / two independent concerns -> two bullets; F3 compatible recommendations
  grouped across gaps; F4 same disposition / different rationale stays separate; F5
  external blocker -> `fix-now` unavailable with reason; F6 normal-checkout /
  detached-HEAD -> `fix-now` unavailable; F7 legacy terse row -> fresh audit, no old
  menu; F8 recommended-set override inheritance + final titled record; F9 invalid
  override -> focused reprompt, approvals retained; F10 auto-fixed gap -> commit index
  informational/non-blocking. Add F11: a single-concern gap renders no `/Cn` symbol.
  Assert each output is one bullet per decision unit, recommended-first, `1`/`2` reply,
  no identity/hash/ownership lines.
- **Density check.** A reviewer confirms the HYDRA1 case reaches the actionable menu in
  under a screen and shows no bare meaningless symbols.
- **Removal greps:** `audited-spec-path`, `audited-diff-hash`, `audited-spec-hash`,
  `hash-object` absent from all three files; availability table defined once (reference
  only). Pair regression greps with a pre-change token that must disappear from
  finishing's render block (`Available dispositions:`) so the check proves the edit
  landed, plus `audited-base` still present exactly once as the retained anchor.
- `npm test` -> `PASS: repo valid`.
- Final conformance re-audit vs this spec and the original condense/surgical/
  dense-readable intent.
