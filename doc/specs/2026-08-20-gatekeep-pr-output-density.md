# gatekeep-pr output density: finding IDs, action vocabulary, pre-composed courses

## Problem

`skills/gatekeep-pr/SKILL.md` (299 lines) is the genericized successor of gridstrong's
`.agents/skills/pr-gatekeeper/SKILL.md` (600 lines). The genericization correctly
dropped project bindings (Linear, `/doc-true-up`, `doc/comms-style.md`, gridstrong gate
commands) but also dropped a project-neutral output protocol that made the predecessor's
reports dense and actionable:

- stable finding IDs (`P#`/`C#`/`L#`/`F#`) - shipped findings are unlabeled prose,
  so the custom menu row has nothing to compose by;
- a reference action vocabulary above the Decision menu - shipped `## Decision` is
  just `<the menu>`;
- numbered pre-composed courses (exactly one `[recommended]`, custom last) - the
  shipped consent table names offered row *types* but the output never renders
  concrete numbered courses;
- an output done-check before persisting any prose payload;
- ID-discipline red flags.

Historical motivation (not a verification target): a gridstrong gatekeep run on
2026-08-20 rendered a correct but coarse menu; the operator missed the predecessor's
density. The golden fixtures for this change are inlined below - nothing external is
needed to verify it.

Goal: ship this protocol generically in pi-gauntlet, out of the box. Consumer
overrides remain last resort for project bindings only.

## Approach (decided)

Surgical augmentation of `skills/gatekeep-pr/SKILL.md` - approach A from the
brainstorm. The existing skeleton is kept byte-identical in meaning: the `## Verdict`
section (states and merge preconditions - including "push and merge are never bundled
into one selection", which this spec preserves), the consent-menu table as the
**single oracle** for offered rows, the post-selection compare-and-swap loop. The
shipped table's coverage of bot authors, drafts, and merged/closed
PRs - which the predecessor's course table lacked - is preserved and extended, never
regressed. Net growth ~+80-90 lines. No new files, no new settings keys, no
`reference/` extraction (the grammar is unconditional, a read hop buys nothing).

Non-goals: no change to assessment mechanics, gate execution, provenance rules,
worktree provisioning, or any other skill. `check-delivery` and
`finishing-a-development-branch` are out of scope. One deliberate scope widening:
the post-selection **fix-wave execution** gains a delegation/parallelism protocol
(Design 6) - it changes how selected fixes are applied, never what the gate or the
consent model do.

## Design

### 1. Findings grammar (stable IDs)

The `## Findings (blocking)` and `## Non-blocking follow-ups` sections of the output
template gain labeled groups with fixed per-line templates:

```markdown
## Findings (blocking)
Blocking findings (P#):
  P1. **<source_ref>** - <defect>. Fix: <concrete change> | Action: <disposition/what unblocks>. [code | test | spec | security | performance | quality]
Requirement/doc drift (linked issue, committed doc drift, or spec conflict):
  L1. <doc-drift | spec-conflict | outdated-AC | missing-behavior> -> <action>

## Comment-thread replies (existing discussion - verdict-neutral)
  C1. <thread ref> -> <drafted reply>  (already-addressed | reasonable | judgment-call)

## Non-blocking follow-ups
  F1. **source_ref** - <action>. Owner: <pr-author | tracker | human>
```

`source_ref` is `file:line` where one exists; otherwise the thing being disputed - a
quoted PR-body claim, a failing gate command, a required check name. **Every Verdict
blocker maps to an ID** (total mapping, stated in the skill body): failed gate ->
`P#` `[test]` referencing the gate command; contradicted or merge-proof-unverifiable
material claim -> `P#` `[spec]` referencing the claim; undispositioned failing
required check -> `P#` `[test]` referencing the check (a **pending** required
check withholds merge the same way but mints no `P#` - a merge-precondition
withhold, not a finding); scope creep -> `L#`
`spec-conflict`; committed doc drift / AC gaps -> `L#` as before. A blocking verdict
therefore always has at least one `P#`/`L#` - "all groups None" cannot coexist with
a blocking verdict. Code-level spec bugs are `P#` `[spec]`; requirement/doc
mismatches are `L#`.

Rules (stated in the skill body):

- IDs are **append-only per namespace for the run's lifetime**: resolved items keep
  their number annotated `(fixed in <sha>)` and are never reused or renumbered;
  findings surfaced by later re-review rounds continue the sequence (`P11` after
  `P1-P10`). If an external head change invalidates the assessment, the re-assessment
  still continues the sequence - retired IDs stay retired.
- Empty groups say "None".
- `[quality]` is a category tag, not a severity downgrade - every `P#` blocks.
- Severity is decided at triage, not by the category tag: a finding lands in `P#`
  only when it must be fixed before merge (correctness, security, material perf
  trap, a convention the repo enforces); improvements that don't change merge
  correctness are `F#`, whatever their category.
- `C#` entries are verdict-neutral drafts (they never make a clean PR blocking);
  nothing posts until selected.
- `L#` gives an addressable handle to drift the Verdict section already treats as
  blocking (committed doc drift, `partial`/`missing` AC coverage); it does not widen
  what blocks.
- `F#` carries an owner; when no tracker tool resolved, the follow-up's durable home
  is the rendered report itself - the skill never invents a persistence command.

### 2. Decision menu: action vocabulary + pre-composed courses

`## Decision` is specified as two parts.

**Action vocabulary** - bare-verb action IDs (no letter prefix; verbs self-describe,
and letter prefixes would collide with the `C#`/`F#` finding namespaces). Rendered as
reference lines with availability constraints inline:

```markdown
## Decision
Actions (compose freely in the custom row):
  fix <P#s|all>    apply blocking fixes in worktree, re-run gate, push  (in-repo PRs only)
  push-docs        push already-applied doc-drift edits                 (only when uncommitted
                                                                         reviewed doc edits exist
                                                                         in the worktree)
  merge-squash | merge-commit                                           (preconditions per Verdict;
                                                                         never bundled with a push)
  request-changes | review-comment | approve                            (approve: never own PR)
  reply <C#s>      post drafted thread replies
  tracker <act>    tracker action                                       (only when a tracker tool resolved)
  stop             leave the PR as-is / report-only exit
```

**Courses stay atomic across pushes.** The shipped invariant "push and merge are
never bundled into one selection" is preserved: no pre-composed course may contain
both a push-producing action (`fix`, `push-docs`) and `merge-*`. After a fix wave the
post-selection loop re-runs the claim-check and Review (verification command not
re-executed; see Design 5a) and re-renders the menu on the new head;
if the gate is green and preconditions hold, `merge-squash` is then row 1
`[recommended]`. Ten findings still resolve with two single-digit replies: "1"
(fix all), then "1" (merge). The custom row obeys the same rule - a composition
mixing a push action with `merge-*` is refused, naming the invariant.

**Numbered courses** - pre-composed rows plus a custom row (always last), rendered
from the consent table (which stays the single oracle for what is *offered*; the
course table below is its normative *rendering* in the vocabulary - it introduces no
new offers and no second recommendation source). Exactly one course per cell is
`[recommended]`. The skill body carries this table:

| Author | State | Courses (first = `[recommended]`) |
|---|---|---|
| you | clean / follow-ups only | 1. merge-squash; 2. merge-commit; 3. stop; 4. review-comment (post no-blockers note) |
| you | blocking | 1. fix (worktree-fixable P#s only - `all` covers only those) [+ push-docs when uncommitted doc edits exist]; 2. push-docs (alone, when doc edits exist); 3. stop; 4. review-comment (post findings). When no P# is worktree-fixable (blocking is required-check-only or L#-only), course 1 (fix) is not rendered: push-docs becomes first when doc edits exist, else stop is first |
| you | blocking, post-fix re-render (gate green, preconditions hold) | 1. merge-squash; 2. merge-commit; 3. stop; 4. review-comment |
| someone else | clean / follow-ups only | 1. approve; 2. merge-squash (offered-unrecommended); 3. review-comment (no-blockers note) |
| someone else | blocking | 1. request-changes; 2. fix all (courtesy, their branch - omitted when nothing is worktree-fixable); 3. reply <C#s> (omitted when the `C#` group is None); 4. review-comment |
| bot author | any | someone-else's rows for the same state; review actions recommended |
| any | draft | 1. request-changes / review-comment / reply <C#s> (omit the reply course when the `C#` group is None) / stop - `[recommended]` follows the same authorship rule as the non-draft cells, **except** on your own draft PR `request-changes` is never recommended (you cannot request changes on your own PR any more than you can approve it); the fallback recommendation there is `review-comment` when findings exist, else `stop`. Custom present but cannot compose `merge-*`/`approve`/`fix`/`push-docs` until ready-for-review |
| any | merged / closed | 1. stop; report-only, no other mutation courses at all; Custom present but cannot compose `merge-*`/`approve`/`fix`/`push-docs`/`request-changes`/`review-comment`/`reply`/`tracker` - nothing remains actionable |

**Fork overlay:** the consent-table fork row renders as an overlay on the authorship
cells (push/merge/fix absent; approve also dropped when the viewer authored the PR) -
it is not a distinct authorship cell. It overlays whichever authorship row above
applies (you vs. someone else), removing `fix`, `push-docs`, and `merge-*` (never
available on a fork). When you authored the fork PR, `approve` is
also dropped (never offered on your own PR) - fork|you|clean renders
`review-comment`/`stop` only; fork|you|blocking renders
`request-changes`/`review-comment`/`stop` (the someone-else courtesy fix-on-their-
branch course is also absent, since it is your own PR). A fork PR authored by someone
else uses the someone-else cells above with `fix`/`push-docs`/`merge-*` removed.

**Required-check gate on merge courses:** an undispositioned failing **or pending**
required check withholds every pre-composed course containing `merge-*` (per the
Verdict merge preconditions) - none render, whatever the author/state cell says. A
pending check mints no `P#`; a failing one does (see the total-mapping paragraph
above). A **flaky** disposition does not restore them to a pre-composed course;
merge proceeds only via the custom row naming the disposition explicitly. A
**real** disposition, or an unresolved pending check, keeps every merge course
withheld until the check is green. This never falls through to the clean cell's
recommended `merge-squash` - a required-check failure or pend means the PR is not
in the clean state to begin with.

Rows a cell offers but GitHub would refuse (branch protection, missing permission)
render listed-but-unavailable with the reason, exactly as the shipped table already
specifies. A `+ tracker <act>` suffix is available on any mutation course when a
tracker tool resolved. Zero mutation courses is a legal render (merged/closed) -
the menu still appears, carrying findings and `stop`; a draft PR is not a zero-
mutation render either - it renders request-changes/review-comment/reply/stop per
the draft cell above.

Below the table, an example render (golden fixture 1 - own PR, blocking findings
including committed doc drift, so uncommitted reviewed doc edits exist):

```markdown
Pick one:
  1. fix all (P1-P10) + push-docs   [recommended]
  2. push-docs (docs only, hold code fixes)
  3. stop (leave as-is)
  4. review-comment (post findings, act later)
  5. Custom - compose: e.g. "fix P1-P8,P10 + push-docs" or "reply C1 + tracker comment"
```

Golden fixture 2 - the post-fix re-render after course 1's gate re-run passes:

```markdown
Pick one:
  1. merge-squash   [recommended]
  2. merge-commit
  3. stop (leave as-is)
  4. review-comment
  5. Custom
```

Nothing executes until explicit selection - the consent gate is unchanged.

`## Drafted fixes / review` is unchanged except each draft is keyed by its finding ID
(`P1:`, `C2:`), so a selection maps 1:1 to payloads.

### 3. Output done-check

New short subsection, run before any persisted payload is posted or committed
(review bodies, `C#` replies, commit subjects on `fix` waves, tracker comments):

- ASCII only: `-`, `...`, straight quotes.
- No headings or template scaffolding on short payloads (under ~150 words).
- Posted findings are file:line-specific where one exists, else keyed to the
  finding's `source_ref`, and end on the fix, not a recap.
- Empty sections say "None"; no invented content.

Scope: the done-check applies to **externally posted/committed bodies only** (review
bodies, thread replies, commit messages, tracker comments) - not to the skill's own
rendered report, whose `##` section structure is fixed by the output template.

The four rules are embedded generically (mechanical, project-neutral). The existing
"Project overrides" block gains one sentence: a `## comms style` section in the
overrides file extends the done-check. No new settings key.

### 4. Terse-output norm

One explicit norm added to the output-template guidance: the rendered report carries
essential context only - deciding factor, evidence lines, ID'd findings, the menu.
No restating diffs, no recap prose, no narration of assessment steps. Density is a
goal of the report, not a side effect of the template.

### 5a. Fix-wave execution (delegation + parallel implementers, single gate)

The shipped post-selection loop applies selected fixes inline, then re-runs the gate
once per wave and re-runs the claim-check and Review to re-confirm claims against
the new head and annotate IDs - the verification command itself is not re-executed
at that step; the gate run is the wave's one and only execution of it. That
per-wave structure is kept; the skill body gains an execution protocol for the edit
step:

- First, filter the selected set to **worktree-fixable** `P#`s: drop any closed by
  disposition (an undispositioned required-check failure is never a `fix` target),
  and route file-less `P#`s (a claim or gate command as `source_ref`, no draft
  touching a file) to run inline/sequentially, never as part of a parallel batch.
- Batch the remainder by the **union of files each finding's drafted edit touches**
  (mechanical - every finding's draft in `## Drafted fixes / review` names its
  files; fallback to the `source_ref` file only when a finding has no draft) -
  findings whose drafts share a file share a batch.
- **Child contract, identical at any batch count:** children are `implementer`
  dispatches (`subagent({ agent: "implementer", context: "fresh", cwd: <PR
  worktree> })`), matching Inline-first execution's persona-naming style - this is
  the pi-cohort optimization path, inline is always valid per that section.
  `worktree: true` forbidden (would break the shared-tree contract); edit-only, no
  git commands, no verification runs; task = the batch's `P#` lines plus each ID's
  drafted edit - the child applies the consented payload, it does not re-solve the
  finding. Below a count-based cutoff (<= 2 worktree-fixable findings) the
  orchestrator applies inline instead of dispatching, consistent with Inline-first
  execution's always-valid inline path; above the cutoff, more than one batch
  dispatches its children **in parallel** under the same contract.
- The orchestrator commits the golden course as one local commit set (code fixes
  plus any already-applied doc edits selected alongside them; one commit, or one
  per batch sequentially), then re-runs the gate **once**. **On green**, push
  **once** and the assessed head updates to the pushed SHA. **On red**, do not
  push - the commit(s) stay local, unresolved `P#`s stay open, and the unpushed
  fix commits carry the same discard-warning as unpushed doc edits. Gate and push
  are per-wave invariants, never per-fix or per-batch.
- Re-review closes findings **by ID**: each selected `P#` is confirmed resolved and
  annotated `(fixed in <sha>)`; unresolved ones stay open under their original ID.

This is sdd's wave shape (parallel impl -> single verify -> single review) adapted to
a fixed branch: worktree-per-task is replaced by file-disjointness in one worktree,
and spec-review is replaced by findings-resolution (the findings list is the spec).
Explicitly rejected: per-fix worktrees with merge-back (machinery disproportionate to
review-fix-sized edits) and per-fix gate runs (the gate dominates wall clock; it runs
once per wave by design).

### 5b. Red flags (added to the existing list)

- Renumbering or reusing finding IDs between menu rounds.
- A course (pre-composed or custom) bundling a push-producing action with `merge-*`.
- Posting or committing a persisted payload without the done-check.
- Presenting findings without IDs, or a menu without the vocabulary block.
- A pre-composed course, or a custom row, composing an action the overlay or the
  cell lists as unavailable.
- Treating `[quality]` as non-blocking, or a blocking verdict with no `P#`/`L#`.
- Parallel implementers over batches that share a file, or a fix-wave child running
  git commands or a verification pass in the shared worktree.
- A second execution of the verification command, or a second push, within one fix
  wave - re-running Verify/Review to annotate IDs is not a second gate execution.

## What stays consumer territory

Tracker semantics (`tracker` action body), doc-repair commands, style-guide files,
gate commands, worktree wrappers - all via the existing overrides ladder. The
forbidden-content grep from AGENTS.md ("Skills must stay generic") is the acceptance
boundary for every phrase ported from the predecessor: no `/linear`, `/doc-true-up`,
`doc/comms-style.md`, `script/worktree`, `E-<num>`, or environment taxonomy may
appear in the skill body.

## Testing approach

- `npm test` (`scripts/ci.mjs`) green.
- Forbidden-content grep over `skills/` returns zero matches; concrete tokens beyond
  the AGENTS.md placeholders: `linear`, `doc-true-up`, `comms-style`,
  `script/worktree`, `gridstrong`, `stg`, `exp`, `prd`, `E-[0-9]` (case-insensitive
  where sensible; whole-word for `stg`/`exp`/`prd`).
- Golden-fixture read-through: every cell of the course table renders only rows the
  consent-table oracle offers, exactly one `[recommended]` per cell, custom last, no
  push+merge bundling anywhere; fixtures 1 and 2 (inlined in Design 2) match the
  course table's you/blocking and post-fix cells verbatim. No runtime harness exists
  for skills; the read-through is the behavioral verification.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md (gatekeep-pr feature bullet, one line;
  plus the overrides-schema section gains the `## comms style` hook), CHANGELOG.md
  (release entry)
- Derived / memory docs invalidated: none

## Open questions

None. All brainstorm questions were resolved: bare-verb action IDs (user-decided),
`L#` bounded to already-blocking drift, done-check rules embedded with an
override extension hook, all four finding namespaces kept, shipped state coverage
(bot/draft/merged) extended not regressed, follow-up persistence degrades to the
report when no tracker resolved, `push-docs` gated on uncommitted reviewed doc edits
actually present in the worktree (not mere `L#` existence). Council-driven
resolutions: courses stay atomic across pushes (the "never bundled" invariant is
preserved; merge is re-offered on the post-fix re-render), the course table above is
normative for every consent-table cell, IDs are append-only for the run's lifetime.
User-driven additions after the first gate round: the explicit triage bar (P# vs F#
decided at triage, tags never carry severity) and the fix-wave execution protocol
(Design 5a: file-disjoint batching, parallel edit-only implementers, single
gate/re-review/push per wave; per-fix worktrees and per-fix gate runs rejected).
