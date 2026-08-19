# Split axis guard: one shared decomposition test for tickets and specs

## Context

Two skills decide whether one request becomes one artifact or several: `shape-ticket`
(one ticket vs N) and `brainstorming` (one spec vs N). Both currently decide it with
prose that names an anti-pattern instead of applying a test.

`skills/shape-ticket/SKILL.md:157` states the rule as a label:

> **Hard rule: split boundaries are vertical** - feature/capability slices, each
> independently shippable and verifiable end-to-end. Never horizontal architecture
> layers: "backend part" / "frontend part" / "DB migration" tickets are a named
> anti-pattern - one ticket routinely cuts through many layers.

Reinforced only by one rationalization row (`:267`, "Split by layer to keep tickets
small" -> "Layers are not deliverables - slice vertically or do not split").
`skills/brainstorming/SKILL.md:110-112` scope check has no equivalent rule at all, and
its illustration ("a new ingestion pipeline and a new admin UI and a new auth flow")
uses a layer ("admin UI") as an example of an independent subsystem.
`skills/writing-plans/SKILL.md:74` splits plans (hence PRs) on "2+ independent
services / contracts / schemas" - a service-count trigger. `scripts/ci.mjs` inspects
frontmatter, stale tokens, extensions, and packaging - never skill-body semantics - so
prose is the only enforcement anywhere.

All three were defeated in observed consumer runs, on the same day, on the same
underlying request:

1. `shape-ticket` proposed two tickets for one defect (one rejected identifier value
   caused an empty render and an aborted import run). The per-issue metadata rationale
   justified each ticket by *where the fix lived* ("fix is producer-side", "fix is
   consumer-side"), with differing component labels as the stated reason. The inline
   roast asked explicitly whether this was a layer split masquerading as a feature
   split; 2 of 4 council members said yes; the chair overruled them ("where the fix
   lives is not what the user observes") and the parent presented the split as
   adjudicated-correct. The human merged the pair manually.
2. `brainstorming`'s scope check offered two specs for the same request, reasoning
   verbatim that the halves "live in different services and can land separately". The
   human again collapsed it to one.
3. The same run family attempted to land the work as two PRs against a repo whose
   deployment is a single workflow shipping everything at once - a deployable boundary
   asserted without knowing the repo's deploy topology.

## Problem

Four distinct defects, none fixed by a stronger prohibition sentence:

1. **The rule is label-shaped, not a test.** A draft that never says
   "backend"/"frontend" evades it. "Independently shippable, separately verifiable AC
   clusters" is satisfiable by any two layers of one defect (fix the producer / harden
   the consumer), so the only operative criterion admits the case it should reject.
   Any replacement test must reject **relabeling**: complementary halves of one
   failure ("producer emits an unrecognized id" / "consumer does not handle it") are
   two different sentences describing one cause.
2. **The roast can sanction a split, and the chair can bury the objection.** Split
   scope is an ordinary roast quality axis with no dedicated finding token, and
   `agents/spec-council-synthesizer.md` gives the chair final say on member conflicts.
   A parent that consumes only the chair synthesis cannot see a flag the chair
   overruled - the observed failure exactly.
3. **No shared owner.** `brainstorming`, `shape-ticket`, and `writing-plans` make
   variants of the same decision with different (or absent) rules; a spec split
   silently authorizes a ticket split, which authorizes a per-service plan split.
4. **The one axis that legitimately depends on deployment topology infers it.**
   Nothing requires the topology to be a known fact, so "different deployables" is
   asserted from the shape of the diff.

Cost asymmetry sets the default: an under-split artifact costs one extra phased AC
group; an over-split pair costs N bodies, cross-links, duplicated context, and manual
human merge work - paid twice in the observed runs.

## Idea

One shared split test owned by a single reference file and cited by three skills;
`shape-ticket` gains a per-slice justification block plus a member-level split veto
its chair cannot bury; the release-timing axis fails closed on documented deploy
topology.

### 1 - New reference file: `skills/shape-ticket/reference/split-axes.md`

Single source of truth for the vocabulary. Contents:

**Scope statement.** The test governs **tickets and specs**. PR and plan
decomposition is owned by `writing-plans`, which cites this same test (see §5); one
ticket normally ships as one PR. A ticket carrying too many concerns is split by this
test - never by splitting its PRs, and never by layer.

**Identity test (a) - one concern or two.** Two slices are **one** concern when either
holds:

- they remediate the same precipitating failure (one trigger, one incident, one
  missing capability), however many components must change; or
- landing one makes the other's stated outcome true, moot, or unobservable.

A slice is **distinct** only if it remains independently user-valuable when every
sibling is never done, and answers a different top-level need from the source request.
Complementary cause statements are one cause: "A emits something B rejects" and "B
mishandles what A emits" describe one trigger from two vantage points. Rewording a
component's internal step as a "cause" does not create a second concern.

For feature and improvement work there is no root cause, so (a) reduces to the
counterfactual: would each slice still be worth doing alone, and would the requester
call them two different things? This is a judgment call and is labeled as one - it is
weaker than the bug-side test, not a mechanical check in disguise.

**Outcome test (b).** Each slice names an outcome a **user** observes. An outcome
scoped to a component's output ("the exporter emits a recognized identifier") is an
internal step, not a slice outcome - if a slice's headline outcome or AC is phrased at
a component boundary, it is an internal step renamed, and the slices merge.

**Closed axis list (c).** Each axis needs one pass and one fail example in this file:

| Axis | Passes | Fails |
|---|---|---|
| Different actor or user journey | Operator bulk-import UX vs. installer first-run onboarding - different people, neither waits on the other | "API for the operator, UI for the operator" - one journey, two layers |
| Different data domain or lifecycle | Ingest correctness vs. retention/expiry policy - different data questions, separately valuable | "Write path vs. read path of the same record" - one lifecycle, two halves |
| Separable release timing | Only with documented topology + a real A-before-B schedule (see precondition) | "Service A ships from a different repo than service B" - boundary without schedule or topology |
| Genuinely different problem statements sharing code | Two unrelated reported defects that happen to live in one file | One defect whose fix spans two files |
| `other - <justification>` | Never auto-qualifies; explicit human approval, and it may not restate or proxy any Never axis | "other - the fix is split across tiers" |

**Never an axis.** Where the fix lives; which service, package, repo, or deployable
the diff touches; which layer (API, UI, DB, worker, ingest, job); which team owns it;
"keep tickets small". A single feature, bug, concern, or improvement routinely cuts
through many layers - normal, not a decomposition signal. Two slices sharing one
concern are one artifact however cleanly the code divides. A Never-axis failure is not
waivable by rewording; it is waivable only by evidence that the classification was
factually wrong (see §4).

**Discovery-conversion exemption.** A discovery/delivery pair produced by the AC
integrity gate's hard-stop conversion is **not** an audit-detected split and is not
subject to this test: one concern deliberately sequenced by missing knowledge, with
the delivery ticket linked and parked not-ready. The exemption covers exactly that
forced pair - it is not a template for voluntary splits.

**Release-timing precondition (fail closed).** `axis: separable release timing` is
available **only** when the resolved gauntlet overrides file documents a `##
Deployment` section stating independent ship cadences, **and** the slices have a real
schedule separation (A lands and is verified before B starts), **and** each slice is
independently verifiable end-to-end. No inference from CI workflow files, no
ask-and-assume: an undocumented or monolithic topology makes the axis **unavailable**
and the split fails closed to one artifact. The skill may offer to document the
topology in overrides; it may not treat an in-session answer as the documented fact.

**Worked fixtures** (generic - no consumer, domain, or product identifiers), each with
the exact candidate block and the clause that rejects it:

```
Fixture 1 - relabeled layer split (must fail)
  slice 1: root cause: producer emits an unrecognized identifier
           outcome: the producer emits a recognized identifier
           axis: different data domain or lifecycle
  slice 2: root cause: consumer discards the whole run on one bad record
           outcome: the import run completes
           axis: different actor or user journey
  rejected by: identity test (a) - one precipitating failure described from two
  vantage points; slice 1's outcome is also a component-boundary step under (b).
  correct result: one ticket, phased AC groups (identifier fix, then resilience).

Fixture 2 - deployable boundary (must fail)
  two slices differing only in which service/repo the diff touches, axis:
  separable release timing.
  rejected by: Never-axis list plus the release-timing precondition (no documented
  `## Deployment`, no A-before-B schedule).

Fixture 3 - legitimate split (must pass)
  slice 1: root cause: no retry surface exists for failed imports
           outcome: an operator can retry a failed import from the run list
           axis: different actor or user journey
  slice 2: root cause: expired records are never purged
           outcome: a compliance reviewer sees records disappear after the
                    retention window
           axis: different data domain or lifecycle
  passes: distinct triggers, each independently valuable if the other is never
  done, user-observable outcomes, non-locational axes.
```

### 2 - `shape-ticket` split rule (replaces `:153-159`)

Detection sentence and decline path survive; the middle is replaced. Changes:

- "**A split is the exception; one ticket is the default**" stated in the detection
  sentence, before any candidate exists.
- Identity/outcome tests, axis table, Never list, and the release-timing precondition
  cited from `reference/split-axes.md` by relative path, not restated.
- **Split justification** obligation - each proposed slice carries three lines at the
  gate:

  ```
  root cause: <the precipitating failure or missing capability this slice remedies>
  outcome: <what a user observes once it ships>
  axis: <one item from the closed list>
  ```

  No block, no split. A block failing (a), (b), or the axis list -> one ticket with
  phased AC groups. Locational wording anywhere in the block or the metadata rationale
  ("fix is X-side") is an immediate fail.
- Existing over-split guard retained verbatim.
- The rationalization row at `:267` is rewritten - the retired vertical/horizontal
  vocabulary must not survive as normative advice:

  | "Split by layer to keep tickets small" | Layers are not deliverables - apply the split test in `reference/split-axes.md` or keep one ticket |

Step 5 is **not** edited: it already routes to the split rule ("split detection (all
below)"), and stating the obligation twice would duplicate the contract.

### 3 - `shape-ticket` roast: split veto (Roast steps 2, 4, and 5 - `:166`, `:168`, `:169`)

The observed failure was a chair overruling members, so the mechanism must not depend
on the chair:

- **Member brief (step 4)** gains a third axis, *split soundness*, with a required
  finding token `split-axis:` (mirroring the `external-ref:` convention). Members hunt
  for architecture-shaped boundaries and may never propose or endorse a split.
- **Dispatch shape (step 2)** member task text carries the **absolute path** to
  `reference/split-axes.md`, resolved against the skill's own directory at runtime
  (members run with `cwd` = the consumer repo, where a package-relative path does not
  resolve; the SKILL.md body does not travel with the dispatch).
- **Disposition (step 5)**: the parent scans **member outputs directly** for
  `split-axis:` findings, independent of the chair synthesis, and auto-applies a
  **merge** on any such finding - the split is withdrawn, the draft becomes one ticket
  with phased AC groups, inside the existing one-re-pass edit budget. The chair keeps
  its normal role for every other axis; it cannot clear a `split-axis:` finding
  because clearing it is no longer on its path. `agents/spec-council-synthesizer.md`
  is therefore **unchanged** - no persona edit, no carve-out, no blast radius on
  `/skill:roasting-the-spec`.
- The roast may argue toward one ticket, never toward a split; the same directional
  rule binds the `worker` fallback and the no-`subagent()` runtime conditional.
- Step 8 reports a withdrawn split with the finding that killed it.

### 4 - Human override, made sticky

A human re-request of a withdrawn split is **sticky for the rest of the run**: the
merge is not re-applied and the slice pair is not re-offered to the roast. What the
re-request costs depends on how the split was withdrawn:

- **Deterministic failure** (locational wording in the block or metadata rationale;
  shared precipitating failure; release-timing axis claimed without documented
  topology) - mechanically established, so approval alone never waives it. The
  re-request must supply evidence the classification was factually wrong (the slices
  really do have different triggers, or the topology really is documented), and
  `other` may not proxy a Never axis.
- **Member-flag withdrawal** (`split-axis:` finding) - a judgment call by one
  low-effort model, auto-applied without adjudication by design. The flag is reported
  at the gate with the withdrawn split, and a plain human yes resurrects it - the
  human is the jury on judgment calls; demanding new evidence would be circular, since
  the justification block is the evidence the member already read.

This preserves the escape valve while keeping the default merge and the fail-closed
facts.

### 5 - `brainstorming` and `writing-plans` call sites

`brainstorming` (`### 2. Scope check`, `:110-112`, and the red flag at `:382`):

- One spec is the stated default. A multi-spec offer renders the **same** three-line
  justification per proposed spec - root cause / outcome / axis - and passes the full
  test including the release-timing precondition. Any slice failing any part -> one
  spec, and the failed split is not presented to the user as an option.
- The "admin UI" illustration is replaced with genuinely independent subsystems, and
  the "don't design a multi-subsystem monolith" line is rebalanced so it no longer
  pushes toward splitting.
- The red flag fires on a **multi-spec offer that fails the test**, not merely on a
  spec spanning subsystems.
- No roast coupling: `roasting-the-spec` reviews spec text, not decomposition.

`writing-plans` (`## Scope Check`, `:74-81`):

- The "2+ independent services / contracts / schemas" trigger is replaced: plans (and
  therefore PRs) split on **deployable intermediate state under documented topology**
  or **review-risk isolation** (e.g. a large mechanical rename landed apart from the
  behavior change), never on service/schema count. The concern test itself is cited
  from `reference/split-axes.md`; scope-level decomposition remains a ticket/spec
  decision made upstream.

### 6 - Overrides contract: `## Deployment`

A named overrides section, documented in README beside `## Issue tracker`: what ships
together, what ships independently, and the mechanism. It is a **fact to look up,
never to infer**; absent means the release-timing axis is unavailable. Adds a section
name and a README paragraph - no new settings key, no new machinery.

## Out of scope / Follow-up

- `finishing-a-development-branch` is not wired to `## Deployment`, though it could
  later use it.
- No CI check for skill-body semantics - `scripts/ci.mjs` stays as it is.
- No changes to `writing-plans` wave mechanics (task ordering, disjointness); only its
  scope-check split trigger changes.

## Error handling and edge cases

| Case | Behavior |
|---|---|
| Split proposed with no justification block | Not a valid proposal - one ticket with phased AC groups |
| Two slices trace to one precipitating failure | Fails (a) regardless of wording or axis named |
| Landing slice A makes slice B's outcome moot | Fails (a) - sequential steps of one concern |
| A slice's outcome is phrased at a component boundary | Fails (b) - internal step renamed; merge |
| `axis` names a service, repo, layer, or "where the fix lives" | Fails; the wording itself is the failure |
| `axis: other - <justification>` | Never auto-qualifies; explicit human approval; may not proxy a Never axis |
| Deploy topology undocumented or monolithic | Release-timing axis unavailable; fails closed to one artifact |
| Any member emits `split-axis:` | Parent merges from the member output directly; chair cannot clear it |
| Human re-requests after a deterministic failure | Requires evidence the classification was wrong; approval alone refused |
| Human re-requests after a member-flag withdrawal | Plain yes suffices; sticky for the run, pair not re-roasted |
| Discovery/delivery pair from the AC-gate hard stop | Exempt - not an audit-detected split; delivery linked and parked |
| Feature/improvement work with no root cause | (a) degrades to the labeled counterfactual judgment |

## Testing approach

No harness exists for skill-body semantics, so verification is a lint plus a fixture
desk check:

- `npm test` (`scripts/ci.mjs`) green - packaging, frontmatter, manifest, stale tokens.
- The generic-skill grep from `AGENTS.md`, extended: zero matches for consumer, domain,
  or product identifiers in `skills/` **and** `doc/specs/`.
- `rg -n "vertical|horizontal" skills/shape-ticket/` returns nothing - the label
  vocabulary is gone from the split rule **and** the `:267` rationalization row, not
  merely supplemented (scoped to shape-ticket: other skills may use either word in
  unrelated senses).
- Fixture desk check: the three fixtures in `reference/split-axes.md` replayed against
  the final skill text; fixtures 1 and 2 must fail naming the rejecting clause,
  fixture 3 must pass. Result recorded in the implementation plan's verification notes.
- New reference file present in the packed tarball (`files` allowlist covers
  `skills/**`; the existing `npm pack` check in `scripts/ci.mjs` covers it).

## Documentation impact

- Feature / user-facing docs introduced: none (skill bodies and their `reference/`
  sub-docs are implementation surface)
- Materially amended existing docs: `README.md` (new `## Deployment` overrides section
  documented beside `## Issue tracker`), `CHANGELOG.md` (release entry)
- Derived / memory docs invalidated: none - no new skill or agent, so `AGENTS.md`
  skill counts, agent tables, and extension tables are unchanged

## Open questions

None outstanding.
