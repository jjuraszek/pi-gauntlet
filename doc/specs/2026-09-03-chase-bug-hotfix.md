# chase-bug hotfix flow

## Context

`chase-bug` triages a bug report to an evidenced verdict and offers three real-bug
actions: file a ticket, brainstorm now, respond-only. For a small, isolated,
urgent bug the cheapest honest path is full brainstorming ceremony (worktree,
gather, spec, council, plan, SDD, conformance) - over-ceremony that pressures the
operator into skipping triage discipline. The repo already tiers ceremony
(`README.md` trivial carve-out vs full gauntlet) but ships no middle tier.

## Problem

A real-bug verdict on a small, evidenced, urgent fix has no proportionate outlet.
Brainstorm-now re-asks questions triage already answered; ticket-now defers a fix
that could land in minutes. The gap is a ceremony tier, not new capability.

## Design decisions (locked in questionary, amended by two council rounds)

1. **Branch destination: worktree.** Direct commits on `main` are rejected -
   they kill rollback, bypass review, and contradict
   `subagent-driven-development`'s "implementation never lands directly on
   `main`". The hotfix runs in a dedicated worktree, branch `hotfix/<slug>`.
2. **Eligibility: split.** The menu row is always rendered for real-bug
   verdicts. Six predicates are evaluated once, at menu-render time, from the
   root cause - a prediction of the fix shape, confirmed against the actual
   diff at review (step 7). Judgment predicates (size, dependency shape, test
   writability) are advisory: they steer `[recommended]` and print as one line.
   Safety invariants (no schema/persistence change, no public-contract change,
   one-commit rollback) decide availability: a failed invariant renders the row
   as `unavailable: <invariant>` - visible, never pickable. A failed invariant
   makes the flow's own promises (revert-one-commit, clean cleanup) false.
3. **Delivery: squash-merge by default, unpushed.** PR only when the human says
   so in prose at the menu (the row label advertises it). No finish menu, no
   push without an explicit request.
4. **Placement: companion file** `skills/chase-bug/hotfix.md` (the
   `brainstorming/gatherer.md` precedent), not a new skill. Promotion to a
   standalone skill is a cheap later move if direct invocation proves wanted.
5. **Self-containment.** Zero changes to `finishing-a-development-branch`,
   `subagent-driven-development`, `verification-before-completion`, the tracker
   extensions, `ci.mjs`, or `marketplace.json`. Reuse is dispatch targets only
   (`implementer`, `code-reviewer`, `conformance-reviewer` personas), the
   `.worktrees/<branch>` path convention, and an intra-skill reference to
   chase-bug step 5. Everything else is inlined in `hotfix.md` - copied DNA,
   separate organs. Worktree creation is always the manual `git worktree add`
   path, never a project wrapper: hotfix owns exact cleanup, and `.worktrees/`
   is gauntlet-owned. A project whose scoped tests need wrapper provisioning
   fails red in the worktree and aborts - a safe failure.
6. **No conformance ceremony.** One advisory `conformance-reviewer` dispatch,
   once, before review. Gaps go to the main loop: fix (one round, tests re-run,
   no second audit), reject as not-a-gap with a stated reason, or abort when a
   real gap cannot be fixed in one round. Its model inherits the main loop -
   intentional for a lite pass; no `closureReview` injection.
7. **Review is the last mutation gate.** One `code-reviewer` over the final
   diff; any implementer round after it triggers exactly one re-review. The
   reviewed diff is the landed diff.
8. **Single implementer, one task.** N is locked at 1: parallel implementers in
   one shared worktree race, and a fix that seems to need them is not
   hotfix-shaped - abort to brainstorm. No `plan_tracker`, no spec-reviewer.
9. **Post-squash proof is tree equality, not a re-test.** The flow aborts on a
   moved base, so the squash commit's tree equals the tested hotfix tip:
   `git rev-parse HEAD^{tree}` == `git rev-parse hotfix/<slug>^{tree}`. No
   tests run in the primary checkout; it never accumulates artifacts.
10. **Cleanup guarantee, scoped.** Squash exit and pre-land aborts leave no
    hotfix worktree or branch. PR exit and land-stage aborts preserve both and
    report a one-line closing command.

## chase-bug SKILL.md amendments (additive plus exact replacement lines)

Existing gates, verdicts, negative-verdict menus, checkpoints 1-3, and the
channel ladder are unchanged. The edits:

- **Frontmatter `description`**, last clause: replace `not a fix` with
  `; triage itself never fixes - a real-bug verdict may hand off to a bounded
  hotfix after the menu`.
- **Overview**: `Triage a bug report to an evidenced verdict. Triage never
  fixes; a real-bug verdict may hand off to a bounded hotfix (hotfix.md) after
  the menu.`
- **Hard constraint**: `No verdict without evidenced root cause; no fix during
  triage. After a valid hotfix pick, writes follow hotfix.md.`
- **Boundaries, Writes**: append `; after a valid hotfix pick: the hotfix
  worktree and one default-branch squash commit, per hotfix.md.`
- **When to Use**: append `An evidenced, urgent "fix this" request also enters
  here - triage stops at the menu, where the hotfix row is offered.`
- **When NOT to Use**: drop the first bullet (evidenced root cause -> exit into
  brainstorming); the shaped-ticket bullet stays.
- **Handoff check**, named: immediately before handing off to `hotfix.md`, run
  the checkpoint command on the primary checkout and require it to match the
  baseline. Checkpoint 3 stays at skill end, on the primary checkout - a landed
  squash commit and a restored branch leave tracked porcelain clean, so the
  invariant holds literally on both exits.
- **Real-bug menu gains a row**, always rendered, after the brainstorm row.
  Untracked origin:

  ```
  1. [ ] File a ticket - /skill:shape-ticket, seeded with this evidence.
  2. [ ] Brainstorm now - /skill:brainstorming with this evidence as the seed.
  3. [ ] Implement hotfix now - follow hotfix.md; add "as a PR" for a PR.
  4. [ ] Respond to reporter only.
  ```

  Tracker/GitHub origin (ticket row omitted as today, renumbered):

  ```
  1. [ ] Brainstorm now - /skill:brainstorming with this evidence as the seed.
  2. [ ] Implement hotfix now - follow hotfix.md; add "as a PR" for a PR.
  3. [ ] Respond to reporter only.
  ```

  Unaddressable variants adjust the last row's label exactly as today. Exactly
  one `[recommended]` preserved. The eligibility line renders under the menu.

- **Row availability.** The triage loop evaluates the six predicates once, at
  menu-render time, from the root cause (read-only judgment). A failed safety
  invariant renders the row as
  `Implement hotfix now - unavailable: <invariant>`; it is never pickable and
  never carries `[recommended]`. A pick of an unavailable row is a change
  request, as any invalid pick is today.

- **Recommendation heuristic extended** - rows top-down, first match wins:

  | Situation | `[recommended]` |
  |---|---|
  | Pressing or trivially fixable, all predicates pass | Hotfix now |
  | Pressing, any predicate fails | Brainstorm now |
  | Trivially fixable, any predicate fails | Brainstorm now |
  | Real but deferrable | File a ticket (tracker-origin: respond-only) |
  | Blocked on another party | Respond-only |

- **Handoff record**, written at pick time to `$TMPDIR/hotfix-<slug>.md` and
  passed by path into every hotfix dispatch: `delivery-mode` (squash | pr, from
  menu prose), the evidence pack (fault story; trigger, observed, and expected
  values from Phase 1; repro command; `file:line`; falsification result),
  `slug` (kebab-case, from the symptom), origin type + response target (step 1
  values), and the predicate evaluation. `hotfix.md` reads only this record.

- **Step 4 resumes on abort.** A hotfix abort runs the baseline re-check (see
  `hotfix.md` Abort), then chase-bug resumes at the verdict menu - the same
  gate re-fired. The hotfix row stays when the abort created nothing
  (pre-mutation: the human may fix the precondition and re-pick); it is omitted
  after any abort that created resources.

- **Step 5 gains a hotfix branch.** For the hotfix row, the single addressable
  response (draft + `send it` gate) is deferred to hotfix completion and cites
  the outcome (`fixed in <SHA>` or PR link). On abort, step 5 runs its normal
  rules for whatever the re-rendered menu selects, the draft additionally
  citing the abort reason. Gate 2 fires once - never a pre-handoff ack plus a
  post-fix message. Distinct gates stay at two.

- **Rationalization table**, row "Trivial fix, faster to just do it": reality
  becomes `Fixing during triage is forbidden - the hotfix row after the menu is
  the sanctioned path`.
- **Quick Reference** real-bug next-step gains `squash SHA`; the **golden
  example** gains the hotfix row and an eligibility line
  (`eligible - all predicates pass`), with `[recommended]` moving to the hotfix
  row per the heuristic (the 404 example is pressing and hotfix-shaped).

## skills/chase-bug/hotfix.md (new)

Header names the single entry point: consumed only at the chase-bug real-bug
menu handoff, from the handoff record (the `gatherer.md` precedent). Budget
~200 lines; if a section outgrows it, split by writing-skills destination
rule - dispatch payloads become sibling files, deep guidance goes to
`reference/`. The procedure spine stays in `hotfix.md`.

**Boundaries.** Reads: anything. Writes: the hotfix worktree; plus exactly one
squash commit advancing the default branch, made in the primary checkout with a
clean index, the primary's original branch restored afterwards; `$TMPDIR`
scratch. Does NOT: run tests or create files in the primary checkout, push
without explicit request, touch tracker state, commit on the source checkout
during setup, or touch pre-existing dirt or resources this run did not create.

**Ownership.** Two flags, `created-worktree` and `created-branch`, set only on
successful creation. Every destructive cleanup command is gated on its flag.

### Procedure

1. **Read the handoff record; print the eligibility line.** Reprint the
   menu-time evaluation (`eligible` / `not eligible: <predicate>`) - never
   re-derive, never block.
2. **Resolve before mutating.** Resolve `SCOPED_TEST_COMMANDS` through the
   existing ladder: gauntlet overrides file, sections matching the
   verification topic (`## verification-before-completion` or topic match),
   then `AGENTS.md` / the project's documented test command. The result may be
   the full project test target. Unresolvable = no ladder entry yields an exact
   command -> abort (pre-mutation). The evidence pack's repro command joins the
   set when present. Draft the implementer task text; not writable from the
   evidence pack -> abort (pre-mutation).
3. **Worktree.** In the primary checkout, record `PRIMARY_ROOT` (`git rev-parse
   --show-toplevel`), `<default>` (`git symbolic-ref --short
   refs/remotes/origin/HEAD` minus `origin/`), `<base-sha>` (its HEAD),
   `<orig-branch>` (`git branch --show-current`), and the full `git status
   --porcelain` as the primary baseline. Abort (pre-mutation, nothing created)
   on any of: inside a linked worktree; `origin/HEAD` unresolvable (never guess
   a squash target); detached HEAD; tracked files dirty; `.worktrees/` not
   already gitignored (never commit on the source checkout); `hotfix/<slug>`
   branch or `.worktrees/hotfix/<slug>` path exists (never reuse, never
   force); creation failure. Create: `git worktree add .worktrees/hotfix/<slug>
   -b hotfix/<slug> <default>`; set both ownership flags; run the project's
   dependency install in the worktree. Every dispatch below gets `cwd` = the
   worktree path, the handoff record path, and - when `output:` is used - an
   absolute `$TMPDIR` path.
4. **Implement.** Dispatch one `implementer` (fork context). Task text: the
   evidence pack (inline + path); "the evidence pack replaces plan and spec -
   do not report BLOCKED for a missing plan"; TDD mandated - failing regression
   test first, then minimal fix (dependency-bump fallback: when no unit test is
   writable, the repro re-run is the regression evidence); `SCOPED_TEST_COMMANDS`;
   commit on `hotfix/<slug>` before reporting; the SDD status line verbatim.
   `DONE` -> continue. `DONE_WITH_CONCERNS` -> continue unless a concern names
   a safety invariant -> abort. `NEEDS_CONTEXT` or `BLOCKED` -> abort. A
   regression command named in the report joins `SCOPED_TEST_COMMANDS` only
   when it invokes the same runner as the resolved command.
5. **Test.** Run `SCOPED_TEST_COMMANDS` in the worktree. Red -> one implementer
   retry -> still red -> abort.
6. **Verify.** Dispatch one fresh `conformance-reviewer`, advisory. The task's
   entire origin blob is three requirements, located as `prompt`: R1 the
   trigger from the evidence pack now yields the expected value, not the
   observed one (values quoted); R2 regression evidence exists; R3 the diff
   stays inside the envelope - files implementing the root-cause mechanism at
   the recorded `file:line`, the regression test, and (dependency exception)
   manifest + lockfile. Parent filter: only rows located as `prompt` count; a
   row sourced from a spec file or a ticket is auto-rejected as not-a-gap. Real
   gaps: one implementer fix round, then re-run step 5 - no second audit;
   unfixable -> abort. Dispatch failure or malformed output -> note it, proceed.
7. **Review - last mutation gate.** Dispatch one `code-reviewer` (fresh,
   read-only) over `<base-sha>..HEAD` in the worktree, with the evidence pack,
   `SCOPED_TEST_COMMANDS`, invariants 1-3 and predicates 4-6 as named review
   items (a predicate miss is Moderate unless it trips an invariant). Verdict
   drives control: `SHIP` -> step 8. `FIX_FIRST` -> one implementer round
   fixing every Critical and Moderate finding -> re-run step 5 -> one
   re-review; `SHIP` -> step 8, anything else -> abort. `REJECT`, or any
   invariant violation -> abort, no round. Dispatch failure or malformed output
   -> one redispatch, then abort.
8. **Finish, automatic.** Every primary command runs from `PRIMARY_ROOT`.
   Squash path, by state:
   - *pre-squash*: tracked files clean; `<default>` HEAD == `<base-sha>` else
     land-abort (base moved); `git checkout <default>`, failure -> land-abort.
   - *squash-applied*: `git merge --squash hotfix/<slug>`; `git diff --cached
     --quiet` true (empty) or any failure -> `git reset --hard <base-sha>` (on
     `<default>`) -> land-abort.
   - *committed*: `git commit -m "fix: <slug>"` with the fault story in the
     body; failure (hook) -> `git reset --hard <base-sha>` -> land-abort.
   - *proven*: `git rev-parse HEAD^{tree}` == `git rev-parse
     hotfix/<slug>^{tree}`; mismatch -> `git reset --hard <base-sha>` ->
     land-abort. After this point `<default>` is never reset.
   - *restored*: `git checkout <orig-branch>` when it differs; failure ->
     report, commit stays.
   - *cleaned*: `git worktree remove --force <path>` (test artifacts may exist;
     the commit is landed and proven), `git worktree prune`, `git branch -D
     hotfix/<slug>` (forced: squash commits never contain the branch tip as an
     ancestor, so `-d` always refuses; the proven tree is the loss guard).
     Cleanup failure -> keep the commit, report residual state.
   - *report*: SHA; revert line `git checkout <default> && git reset --hard
     <base-sha>` (unpushed) / `git revert <sha>` (after any push); primary
     porcelain delta vs baseline (expected none); push nudge. The commit stays
     **unpushed**.
   PR path, cwd = the worktree: `git push -u origin hotfix/<slug>`; failure ->
   report branch + worktree path, no URL, preserve. `gh pr create --base
   <default> --head hotfix/<slug>`; `gh` missing or failing after one retry ->
   report the pushed branch and compare URL. Worktree and branch preserved with
   the closing line.
9. **Cleanup evidence.** Squash exit and pre-land aborts: `git worktree list`
   without the hotfix entry, `git branch --list hotfix/<slug>` empty, primary
   porcelain delta none. PR exit and land-stage aborts: both present, plus the
   closing line `git worktree remove --force <path> && git branch -D
   hotfix/<slug>`.
10. **Response.** Per chase-bug step 5's channel and draft rules (referenced,
    intra-skill - not duplicated): addressable origins get the draft citing
    `fixed in <SHA>` or the PR link, then the `send it` gate; unaddressable get
    the summary. Abort never reaches this step - it returns to the menu.

### Eligibility predicates

Safety invariants (decide row availability; re-checked at review):

1. No schema, migration, or persistence change.
2. No public API, contract, or config-shape change.
3. Rollback is reverting one commit - no data or state side effects.

Judgment predicates (advisory; steer `[recommended]`; review items at Moderate):

4. Fix touches existing code only - new files limited to the regression test.
5. Dependencies unchanged, one exception: a patch/minor bump qualifies when the
   bump is the evidenced fix (upstream issue or changelog names the symptom)
   and the diff is manifest + lockfile only, no call-site changes. Replacement,
   major/breaking upgrade, or a new dependency fails the predicate - brainstorm
   territory.
6. Regression evidence writable in the existing harness (dependency-bump
   fallback: the triage repro).

### Abort

Two classes; both end with the baseline re-check and a return to the menu.

**Pre-land** (steps 2-7): commands or task text unresolvable; worktree
preconditions unmet; implementer `NEEDS_CONTEXT`/`BLOCKED`, or a concern naming
an invariant; red tests after retry; an unfixable conformance gap; review
`REJECT`, invariant violation, or a non-`SHIP` re-review. Mechanics: `git
worktree remove --force <path>` if `created-worktree`; `git worktree prune`;
`git branch -D hotfix/<slug>` if `created-branch`. Nothing else is touched. The
menu re-renders with the hotfix row when neither flag was set, without it
otherwise.

**Land-stage** (step 8 before *proven*, after review `SHIP`): base moved,
checkout failure, empty squash, merge/commit failure, tree mismatch. Mechanics:
`git reset --hard <base-sha>` only when this run moved `<default>`
(squash-applied or later) and `<default>` is checked out; on base moved,
`<default>` is never touched and both SHAs are reported; restore
`<orig-branch>`; preserve worktree and branch (reviewed work); report path, tip
SHA, and the closing line. The menu re-renders without the hotfix row.

**Baseline re-check**: tracked porcelain matches the triage baseline; full
porcelain delta reported; `<default>` == `<base-sha>` asserted only when this
run touched `<default>`. Pre-existing dirt is never touched.

### Harness fallback

chase-bug is marketplace-exposed with `agents: []` - on that surface neither
`subagent` nor the personas exist. The fallback paragraph inlines the duties,
same order, all in the main loop: TDD manually (failing regression test first),
commit on the hotfix branch, self-review the diff against the evidence pack,
invariants 1-3 and predicates 4-6, run the scoped commands, apply the abort
classes, finish and clean up per steps 8-9.

## Gates

Zero new human gates. chase-bug's existing two (verdict menu, `send it`) are
the only ones: row availability is rendered into gate 1, abort re-fires gate 1,
and for the hotfix row gate 2 fires once, after the outcome is known. Between
them the flow is automatic: eligibility line, resolve, worktree, implement,
test, verify, review, squash, cleanup.

## Testing approach

Per writing-skills' Iron Law (skill edits are TDD for process docs):

- **RED** - each pressure scenario run via a fresh `worker` subagent without
  the content it targets, captured verbatim:
  A. small evidenced bug + "reporter is waiting" pressure - current chase-bug;
  B. schema-change bug (invariant 1 fails) - current chase-bug;
  C. implementer `BLOCKED` with a dirty worktree - a bare "abort the hotfix"
     instruction, no `hotfix.md`;
  D. dependency cases (evidenced patch bump vs replacement) - current chase-bug.
- **GREEN** - same scenarios with the amended menu + `hotfix.md` present:
  A -> hotfix row recommended, flow followed, unpushed squash landed, worktree
  and branch gone, original branch restored;
  B -> row rendered `unavailable: <invariant>`, brainstorm recommended;
  C -> abort force-removes the worktree, deletes the branch, baseline
  re-check passes, menu re-renders without the hotfix row;
  D -> evidenced bump eligible (live run); the replacement -> not-eligible
  branch is verified from predicate 5's text only - accepted at finish: three
  fixture designs each yielded a correct smaller fix leaving the dependency
  unchanged, which is the skill's intended minimal-fix behavior.
- **REFACTOR** - harvest observed rationalizations into chase-bug's table and
  `hotfix.md`'s red flags; re-run until bulletproof.
- **Git-state fault injection** - scripted scratch repo (cloned from a bare
  remote so `origin/HEAD` resolves), one scenario per transition, each
  asserting branch refs, primary branch/HEAD/porcelain, worktree registrations,
  and ownership: primary on a non-default branch (restored); detached primary
  (pre-mutation abort, nothing created); externally moved base (land-abort,
  `<default>` untouched, work preserved); pre-existing `hotfix/<slug>`
  (pre-mutation abort, untouched); commit-hook failure (reset, land-abort);
  cleanup failure after commit (commit kept); PR path pushed from the worktree
  branch (`gh pr create` itself not exercised - accepted at finish, one fixed
  command line); squash path tree-equality proof.
- **Mechanical** - `npm test` (ci.mjs frontmatter + marketplace reference
  integrity - the existing walk at `scripts/ci.mjs:254-270` covers the
  `hotfix.md` reference with no ci.mjs change), then one end-to-end
  dogfood: seed a small bug in the scratch repo, run `/skill:chase-bug`, pick
  the hotfix row, land an unpushed squash with no worktree litter.

## Documentation impact

Materiality bar: `skills/brainstorming/reference/documentation-impact.md`.

```markdown
## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md - the step-0 handoff sentence
  ("can hand off to shape-ticket or brainstorming"), the Architecture
  real-bug parenthetical ("real bug -> ticket/brainstorm/respond"), and one
  sentence in "When to use / when NOT to use" naming the chase-bug hotfix as
  the middle tier between the trivial carve-out and the full gauntlet, entered
  only through the verdict menu; the "never fixes during triage" claim stays
  true
- Derived / memory docs invalidated: none (AGENTS.md stays accurate: skill
  count unchanged at 17, no new agent, marketplace allowlist unchanged)
```

Doc updates ship in the same commit.

## Wording constraints

Minimal, imperative text; sibling-skill conventions verbatim (menu-row format,
two-column rationalization table, red-flags list, numbered procedure);
conditionality near zero - defaults fixed, no internal menus; automatic between
the two pre-existing gates.

## Out of scope

- Direct commits on `main` (rejected, see decision 1).
- A standalone `/skill:hotfix` skill (promotion path noted, decision 4).
- A direct ASAP entry point that skips the verdict menu (rejected by the
  council; ASAP requests enter chase-bug with the hotfix row `[recommended]`).
- Parallel implementer waves (decision 8).
- Rebasing the hotfix onto a moved default branch (land-abort preserves the
  work instead).
- Project worktree wrappers (decision 5).
- Changes to finishing, SDD, verification-before-completion, extensions, ci.mjs,
  marketplace.json (decision 5).
- Push automation. Push happens only on explicit human request.

## Open questions

None. What counts as "pressing" or "trivially fixable" is judgment by design;
the eligibility line keeps the human informed without blocking.
