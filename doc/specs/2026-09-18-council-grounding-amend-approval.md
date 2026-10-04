# Council provenance, probe-before-apply, standing amend approval, brainstorming dedup

> **Superseded by:** [doc/specs/2026-09-19-readable-amendment-gates.md](./2026-09-19-readable-amendment-gates.md) - "Standing amend approval" presentation scope only (grant safety boundary carried over)
> **Superseded by:** [doc/specs/2026-10-01-brainstorming-user-entry-boundaries.md](./2026-10-01-brainstorming-user-entry-boundaries.md) - brainstorming dedup ownership/layout only
> **Superseded by:** [doc/specs/2026-10-04-resume-restores-amend-grant.md](./2026-10-04-resume-restores-amend-grant.md) - fresh-session-resume grant boundary only

**Goal:** a chair-suggested edit that asserts a fact about data is never applied to a spec as fact unless a member or the parent checked it against the data; the user can grant standing approval for amend-class spec changes in chat; `skills/brainstorming/SKILL.md` states each rule once.

## Problem

Gridstrong run E-2923 (2026-09-17, kimi-k3, 4-member council) stopped four times post-approval for spec amendments. Three trace to one mechanism: a member flagged `[major] ambiguity @ Fetch ("pairing each document-list section with the richText prose block") - no discriminator`; the chair, which had not seen the page, proposed `nearest preceding richTextField since the previous section`; the parent applied it verbatim (21:09-21:14) with zero probes of the fixture; writing-plans ran the rule ten minutes after approval and found four duplicate events per posting. The chair's cluster line (`agents/spec-council-synthesizer.md:27-38`) carries no signal that nobody looked, and the apply step (`skills/roasting-the-spec/SKILL.md:114-137`) decides on scope grounds only, so an unprobed hypothesis and a member-verified fact land identically.

Each amendment stop was legitimate (`skills/brainstorming/SKILL.md:360` "Wait for approval"), and the user granted a standing approval mid-run ("apply all reasonable spec fixes ... just follow the skill instruction") that the skill has no wording to honour, so the stops continued.

Separately, `skills/brainstorming/SKILL.md` is 393 lines / 5326 words. Against `skills/writing-skills/SKILL.md:158-176` ("cross-reference, don't duplicate") it restates the critique/council mechanics three times (Checklist 9, Spec Self-Review tail, Spec Council), the summary read-verbatim rule twice (Checklist 11, User Review Gate), the spec-writing order twice (Checklist 7, Spec Self-Review 1-4), and Red Flags restates all of them.

## Decision summary

| Decision | Choice |
|---|---|
| Where provenance originates | Member finding line: trailing `probed: <source or check> - <observed result>` or `probed: none` |
| Who labels | Chair, from member testimony only: `grounded` when member probes support every factual assertion in the edit, else `hypothesis` |
| Parent on `apply` of a `hypothesis` data claim | One bounded search for the artifact; at hand -> one bounded read-only probe; confirmed -> apply as fact; anything else -> Open Question naming the probe, its outcome, any obtain-hint, and who settles it; one Open Question per artifact, grouping every edit it settles |
| Standing amend approval | Chat-only user grant in the current flow; the amendment step renders the diff and continues without waiting; redraw and the spec gate still stop; commit body quotes the grant; not inferred after a session resume |
| Brainstorming dedup | Each rule once in its owning section; Checklist and Red Flags link, not restate; every gate, step, red flag, and dispatch field maps to a surviving owner |
| Settings / extensions | None |

## Changes

### `agents/spec-council-member.md`

Finding bullet format becomes:

```
- [blocker|major|minor] <kind> @ <section or quote> — <problem> → <suggested edit> — probed: <source or check> - <observed result> | none
```

`probed:` names what was read or run and what it showed; `none` when the edit rests on the spec text alone. The `over-spec` bullet form is unchanged and carries no `probed:`. One sentence in the verification-hygiene paragraph: "End every finding with `probed:`; `none` is a normal answer."

### `agents/spec-council-synthesizer.md`

Cluster line format becomes:

```
- [blocker|major|minor] <theme> — raised-by: [<model>, <model>] — <consolidated finding> → grounded|hypothesis: <suggested edit>
```

Rule, one paragraph: `grounded` when the raising members' `probed:` results support every factual assertion the edit makes; otherwise `hypothesis`. A missing `probed:` reads as `none`. The chair does not probe to upgrade a label. `external-ref:` and `over-spec:` clusters carry no tag.

### `skills/roasting-the-spec/SKILL.md`

Section 3 "Decide and apply" gains one block after the disposition list:

> **`hypothesis` clusters that assert data shape, ordering, or semantics** (a parsing rule, a field's meaning, a sort or date order, an identity key) are applied only after a probe. Search once for the artifact: one `rg --max-count` under `timeout` over `<abs worktree path>` and its docs, config, and script directories, for the artifact or for how it is obtained. At hand -> one bounded read-only check: a read, an `rg` over explicit paths, or a project script whose source you read and which only reads local files. Confirmed -> apply as fact. Anything else (not found, inconclusive, timed out, contradicted) -> write the edit into `## Open questions` (create the section if absent) with the probe run, its outcome, the obtain-hint if found, and the settlement path: the user supplies the fact at the gate, or the first plan task that obtains the artifact settles it via brainstorming's Amending an approved spec. One Open Question per artifact, listing every edit it settles - never one per assertion. Never fetch, build, or run the proposed change to obtain the artifact.

Audit forms in section 4: `Applied: <cluster> -> <edit> (grounded: <member probe>)` for grounded clusters; `Applied: <cluster> -> <edit> (probed: <check> - <result>)` for a confirmed hypothesis; `Applied: <cluster> -> open question (<not found | inconclusive: <check> | contradicted: <result>>)` otherwise. Grounded provenance is on the audit line because member files are removed in section 5.

A cluster without a tag is read as `hypothesis`. `skills/shape-ticket/SKILL.md` roasts read the tag as informational; its disposition step is unchanged.

### `skills/brainstorming/SKILL.md`

**Standing amend approval.** "Amending an approved spec" step 2 becomes:

> 2. Render the diff and impact line. A user instruction in this flow that waives per-diff review for later amends ("auto-apply amends, stop only for redraws", "apply spec fixes without asking") is the approval: quote it in the amendment commit body and continue. Otherwise wait for approval; change request -> revise, re-show. Redraws always wait.

A grant never satisfies the spec gate or a redraw; a grant given with or before spec approval applies to later amends in the same flow. A new brainstorm (checklist step 1) and a fresh-session resume start with no grant.

**Dedup.** Rules move to one owning section each; other mentions become a link:

| Rule | Owner | Removed from |
|---|---|---|
| Spec-writing order (read draft, `write` full replacement, line-1 check, predecessor banner) | Spec Self-Review steps 1-4 | Checklist 7 (keep one line + anchor) |
| Critique dispatch: `gauntlet_setting` verdict branch, council vs worker, malformed handling; the worker dispatch block moves here unchanged | Spec Council | Checklist 9, Spec Self-Review tail (keep the five-bullet list and "first three inline, last two dispatched") |
| Post-critique placeholder re-scan and banner reconcile | Spec Self-Review tail | Checklist 10 (keep one line + anchor) |
| Summarizer dispatch, two-stage degrade, `Read` last, paste verbatim, fresh temp path on re-dispatch | User Review Gate | Checklist 11 (keep one line + anchor) |

Red Flags keeps every entry as one line each with no rationale. Checklist items keep their numbering and anchors. Both dispatch blocks (worker, summarizer) keep every field (`agent`, `context`, `async: false`, `cwd`, `output`, `outputMode`, `task`). Anchors referenced by `scripts/ci.mjs:183-197`, `skills/writing-plans/SKILL.md`, `skills/subagent-driven-development/SKILL.md`, `skills/finishing-a-development-branch/SKILL.md`, and `skills/roasting-the-spec/SKILL.md` keep their heading text; the absence tokens at `scripts/ci.mjs:188-194,207` bind rewording. Target: <= 300 lines and <= 4000 words.

### `scripts/ci.mjs`

`tokenChecks` presence entries: `agents/spec-council-member.md` `probed:`; `agents/spec-council-synthesizer.md` `grounded|hypothesis:`; `skills/roasting-the-spec/SKILL.md` `hypothesis` cluster block opener; `skills/brainstorming/SKILL.md` `waives per-diff review`.

### `doc/personas.md`

The `spec-council-member` and `spec-council-synthesizer` bullets (lines 10-11) name the `probed:` line and the `grounded|hypothesis:` tag.

### `README.md`

Line 66 "Changing an approved spec later is a conditional diff-approval stop" gains "(or, under a standing grant, a diff render that continues)".

### `CHANGELOG.md`

`## Unreleased` entries for the changes above, plus one limitation line: under a standing grant, back-to-back amendments with no user input between them count as one in telemetry `derived.amendments` (`extensions/telemetry.ts:782-784` coalesces until the next input event).

## Flow walk-through

1. Members write findings; each bullet ends `probed: <x> - <result>` or `probed: none`.
2. Chair clusters; each `->` is prefixed `grounded:` or `hypothesis:`.
3. Parent applies. A `hypothesis` cluster proposing "pair each section with the nearest preceding richTextField" is a data-shape claim: the parent's one bounded `rg` finds `script/fetch-rop-page` documenting where the page lands but no captured page; it does not run the script (its source fetches). It writes one entry into `## Open questions` for the captured page, listing every edit it settles (pairing, page identity, posting date, appendix parsing): "obtain via `script/fetch-rop-page`; settled at the gate or by the first plan task that captures the page". Audit: `Applied: parser rules -> open question (not found; obtain: script/fetch-rop-page; groups 4 edits)`.
4. Gate summary lists the open question; the user approves and adds "auto-apply amends".
5. The first plan task captures the page and settles the whole group in one amendment; it renders its diff, quotes the grant, commits, continues.

## Edge cases

- Member omits `probed:` -> chair reads `none` -> `hypothesis`; the omission path can only add an Open Question.
- A `grounded` label rests on the chair's reading of `probed:`; the supporting probe is on the audit line, so the user sees it at the gate.
- Chair emits an untagged cluster -> parent reads `hypothesis`.
- Probe would write into the worktree, need network, or cannot be bounded -> not at hand.
- Probe contradicts the edit -> Open Question names edit, probe, and result; the parent does not invent a replacement rule.
- `hypothesis` cluster that asserts nothing about data (naming, scope cut, doc impact) -> applies as today.
- Standing grant and a redraw-class diff -> stops as today.

## Explicitly rejected

- A `piGauntlet` setting for standing approval: the stop is skill text with no extension guard, so a setting adds resolver, docs, and tests with nothing behind it and weakens a human gate across every future spec in the repo.
- A separate verify-claims dispatch after the chair: a sixth dispatch for what is usually one or two clusters.
- Parent-only classification without member/chair labels: loses the record of who probed what, which is the information E-2923 lacked.
- Chair probing to upgrade `hypothesis` to `grounded`: the chair weighs testimony; a second job re-opens the unbounded-scan failure the bounding text exists for.
- Fixing the telemetry coalesce: extension changes are out of scope; the limitation is documented.

## Testing

- `npm test`: skill/agent frontmatter lint, `tokenChecks` presence and absence tokens, stage-skill lint.
- Dedup inventory (one-off, in the plan, recorded in the PR body): list every gate, step, red flag, dispatch field, and ordering rule in `skills/brainstorming/SKILL.md` at base; map each to its surviving owner at head. Compare normalized sentences (wrapped paragraphs joined) rather than lines. Record before/after line and word counts.
- Post-implement scenarios, run on a sample spec after the personas change: a member-verified edit -> `grounded:` and `Applied ... (grounded: ...)`; an unprobed data edit with no artifact -> `hypothesis:` and `Applied ... open question (not found)`; an amendment with a grant renders the diff and continues; without a grant it waits; a redraw waits. The first live e2e is the next spec roast after release.

## Documentation impact

Materiality bar: `skills/brainstorming/reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/personas.md` (member/chair bullets), `README.md:66` (amendment stop wording), `CHANGELOG.md`
- Derived / memory docs invalidated: none

## Semver

Minor: member and chair output contracts gain a field; the apply step gains a rule; no settings or extension changes.

## Open questions

None.
