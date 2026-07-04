# Documentation Impact: the Materiality Bar

The shared materiality bar for a spec's "Documentation impact" section. Several
skills cite this doc by relative path rather than restating its rules.

## Governing principle

The governing principle: document what the code cannot tell you.

The "Documentation impact" section is a **filter with a default of "none,"** not
a prompt to produce documentation. A doc earns a line in that section only when
it clears one of the categories below. Absence is the expected outcome for most
changes - most changes touch no product-facing doc at all.

## Scope + the three doc classes

The section tracks **product-facing docs**: README, `AGENTS.md`, CHANGELOG,
external / API contracts, and genuinely-new standalone guidance docs.

Skill and agent bodies, and their `reference/` sub-docs, are **implementation
surface** - the deliverable itself, tracked in the plan's file list - **not**
doc-impact entries. Listing them here would just restate the diff.

Within that scope, a spec's Documentation impact section enumerates three
classes:

- **Feature / user-facing docs introduced** - a new doc the change adds.
- **Materially amended existing docs** - an existing product doc that gains a
  new section or a changed contract.
- **Derived / memory docs invalidated** - router entries (`AGENTS.md` sections),
  topic guides, taxonomy indexes that go stale because of this change.

## The seven inclusion categories

These seven categories gate classes 1 and 2 (feature/user-facing introduced;
materially amended) - selection by importance. Class 3 (derived/memory
invalidated) uses a different, lighter test; see "Gating class 3" below.

A doc earns its place in classes 1-2 only by clearing at least one of these.
Categories are not mutually exclusive; one match is sufficient.

**Litmus test for every category:** would a competent teammate need this
written down to safely operate or extend the system without reading the diff
or the code? If the code (or its tests) already answers it, it fails the bar.

- **Major procedures / conventions** - how work is done here (workflow, review,
  release discipline).
- **Operations / tunable parameters** - env vars, thresholds, feature flags,
  runbook / recovery steps. PASS: a new `PI_LENS_MAX_FILES` threshold, its
  default, and when to change it. FAIL: restating that a function reads an
  env var - the code already says that.
- **Communication contracts / integrations** - API / wire / queue contracts,
  cross-component boundaries.
- **Architecture** - module boundaries, data flow, structural decisions.
- **Major definitions** - the canonical definition of a load-bearing domain
  term, concept, or invariant that multiple components depend on and no single
  code location fully owns. PASS: the canonical meaning of a domain term
  several components rely on. FAIL: a one-line type alias the code already
  names in full.
- **Non-obvious rationale / decisions that outlive the PR** - the "why," and
  why not the obvious alternative. PASS: why a simpler, obvious approach was
  rejected, recorded so it is not re-litigated later. FAIL: a restatement of
  what the chosen code does.
- **Security, data-access & permissions** - trust boundaries, who can access
  what, data-handling and permission decisions.

## Gating class 3

Class 3 ("Derived / memory docs invalidated") is not gated by the seven
categories above. A router entry, topic guide, or taxonomy index is
invalidated by drift, not selected by topical weight. The test is: an
existing doc's content is now wrong or misleading because of this change.
If so, it belongs in class 3 regardless of whether it would clear any of the
seven categories. A citing skill (for example `writing-plans`, which sources
doc-update tasks from this section) must not apply the seven-category filter
to class 3 entries.

## Exclusion / anti-pattern list

None of the following clears the bar, no matter how it is framed:

- Per-symbol or per-module narration.
- Restating signatures, types, or schemas the code already owns.
- "How it works" prose that reading the code answers directly.
- Anything that would need an edit on every code change - the code-mirror
  tell: if a doc rots the moment the function it describes changes, it was
  never documentation, it was a copy.

In-code doc comments such as RDoc/JSDoc are out of scope for this bar; it
governs standalone `.md` docs only, and the same "no code-mirror" rule
applies to both: a narrow markdown file that mirrors one function or one
module fails the bar the same way an inline doc comment would.

## Amend over create

Clearing the bar does not default to a new file. **Extend the canonical
existing doc that owns the topic.** When ownership is ambiguous, extend the
most specific existing doc that already discusses the surrounding topic; a
new standalone `.md` is justified only when zero existing docs mention the
topic at all - this is the anti-proliferation rule, and it is why most
changes that clear the bar still show up under "materially amended," not
"introduced."

## The section template

Reproduce this block exactly in a spec's "Documentation impact" section:

```markdown
## Documentation impact
- Feature / user-facing docs introduced: <list, or "none">
- Materially amended existing docs: <list, or "none">
- Derived / memory docs invalidated: <routers / AGENTS.md sections / topic guides / indexes, or "none">
```

Each entry answers with a doc name, `"none"`, or `"deferred: <trigger>"` (for
example, `CHANGELOG.md - deferred: release`, when a doc changes on a known
later event and should not be flagged as missing before that event fires).

## Referenced by

Keep this list in sync with the skills that cite this doc:

- `brainstorming` section 6 and its Spec Self-Review check.
- `writing-plans` - sources doc-update tasks from the spec's Documentation
  impact section.
- `verification-before-completion/reference/conformance-check.md` - docs named
  here are origin requirements the conformance pass verifies.
- `finishing-a-development-branch` Step 1's doc-impact pointer.

## Project-specific taxonomy

This doc is generic. Project-specific doc taxonomy (which docs a given
project treats as canonical for which topic) lives in a project's
`.pi/gauntlet-overrides.md`, in a `## documentation` section - not here.
