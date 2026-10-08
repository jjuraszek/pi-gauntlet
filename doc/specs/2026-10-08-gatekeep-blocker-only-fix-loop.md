# gatekeep-pr: blocker-only fix loop

**Goal:** Make `/skill:gatekeep-pr`'s `fix` pick do only what merge needs - open blockers, scoped tests, a closure review over the wave's own findings - so a fix wave stops re-running the full verification command, re-reviewing the whole report, and polishing nits nobody asked for.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

Amends `doc/specs/2026-10-02-gh-57-gatekeep-pr-production-gate.md` (the fix-wave design: payload selection, scoped tests, pre-push review) and `doc/specs/2026-10-01-gatekeep-pr-capability-gate-compact-report.md` (the nit-default `fix` text). Both keep every other section; no supersession banner, since neither design is replaced as a whole.

## Problem

Measured on two consumer repos, a `fix` pick is the slowest part of the gate and most of the time is spent outside the fix itself. One gridstrong wave ran 5 implementers for 19.3 min and 2 reviewers for 8.9 min, serially; one customer-ops run spent 25.5 min in 5 pre-push runs of `sh scripts/run-all-tests.sh` while the payload helpers themselves took 65 s, 88 s, and 43 s. Three rules in the skill cause this:

1. A bare `fix` with no open blocker applies nit payloads (`post-selection-loop.md` `### Fix wave`, `decision-menu.md` `fix` row), and step 5 drafts a payload for every nit up front (`findings.md` `## Drafted payloads`), so a mergeable PR still gets a wave and a review for cosmetic edits.
2. `fix-wave.md` `## Wave` hands each helper a test *file* ("the test file the payload touches"), never a resolved command, so helpers pick their own runner; in customer-ops that was the full suite. The skill already forbids "the resolved `verification command`" there; it never says what to run instead. Both consumer overrides document a path-taking scoped runner outside `## PR gate` (gridstrong `## routing`: `cd dashboard && mise x -- bin/rspec <paths>` and `uv run pytest <paths>`; customer-ops `## Project`: `uv run --group test python -m pytest <paths> -q`), and `agents/implementer.md:41` already runs only dispatch-supplied commands - the gate just never reads them. (A consumer clause that once named the verification command "inside a fix wave before the push" is already deleted in both repos.)
3. `fix-wave.md` `## Review before push` feeds the reviewer the whole pre-wave findings list and re-dispatches on every new Critical or Moderate anywhere, so each round re-reviews findings the wave never touched. `agents/code-reviewer.md:70` already scopes a re-review to prior-finding closure plus `## Fix delta`, with outside-delta findings reported as Critical or `[Minor] (outside fix delta)`.

Framing: pivoted to no-parallelism - the ask named parallel helpers, but pi-cohort `worktree: true` returns an uncommitted patch and force-removes the child tree (`pi-cohort/src/runs/shared/worktree.ts:440-460, 555-562`), which breaks the one-commit-per-payload and no-orchestrator-commit rules; the measured cost is round count, full-suite reruns, and whole-report reviews, not the serial sum of 43-88 s helpers. Parallel helpers are out of scope until an integrator commit path exists.

## Acceptance criteria

none - no ticket

## Design

Sentence-level edits to the owning rule in each file; every file stays under 500 lines, no extraction, no new reference file, no new config key.

### D1 - `fix` is blocker-only; `fix nits` is its own verb

- `decision-menu.md` `## Verbs`, `fix` row: "apply the drafted payloads for the named blockers (open blockers by default) through fresh implementer helpers ..."; the "with no open blockers, the nit payloads" clause and the "with no drafted payload at all, the human names the change" clause are deleted - the human-named change on a clean PR is dropped. `fix + nits` stays a composition of the two verbs.
- `decision-menu.md` `## Verbs`, new row `fix nits` - apply the nit payloads drafted at this pick through fresh implementer helpers, review the wave, push when `push` is available (`fix-wave.md`).
- `post-selection-loop.md` `### Fix wave`: a `fix` pick takes the payloads for the named blockers, all open blockers by default; `fix nits` takes nit payloads only; `fix + nits` both. The clause "the nit payloads when no blocker is open" is deleted.
- `decision-menu.md` `## Availability`: `fix` is offered while an open blocker exists (a failing-check `P#` included - a blocker with no file-level payload is reported by the wave as not fixable, per `post-selection-loop.md` `### Fix wave`), a helper facility exists, and the round cap is neither `0` nor reached; `fix nits` is offered while a nit exists under the same facility and cap conditions. The compose hint lists `fix nits` and `fix + nits` only when both verbs' rows render.
- `decision-menu.md` consent table: every `mergeable` row set lists `fix nits` in place of `fix`; every `fixable` row set lists `fix` and `fix nits`; an omitted verb is dropped from the row set, not named in `Not offered:`, since it is not a withhold.
- `decision-menu.md` overlays: draft PR - "`review` is recommended on someone else's fixable draft, `fix nits` on their mergeable draft when a nit exists, else `stop`"; head not pushable - "`fix` and `fix nits` stay". Fixture 2 row 2 becomes `fix nits - apply the nit payload in the worktree, review the wave, push` with compose `"fix nits"` dropped from the hint; Fixture 3(a) drops `fix`.
- `report.md`: after the `Nits:` list, one line `<N> nits open - fix nits to take them` (`1 nit open` for one); rendered only while the `fix nits` row renders, so it is omitted with zero nits like any empty section and never points at an unoffered row. The worked example gains that line; the clean-PR example drops its `fix` row.
- `SKILL.md` Red flags, the "open-PR menu ... without `fix`" bullet becomes "without `fix` while an open blocker exists, or without `fix nits` while a nit exists" - the same predicate as the `## Availability` row above.

### D2 - nit payloads are drafted lazily

- `findings.md` `## Drafted payloads`: step 5 drafts a payload for every blocker with a file-level fix; nit payloads are drafted on a `fix nits` or `fix + nits` pick, which is the consent - the orchestrator drafts them, prints them in the `show evidence` payload shape, and dispatches the wave in the same pick with no second confirmation. Pre-pick `show evidence` prints only payloads that exist. Undispatched drafts drop at teardown as today.

### D3 - each helper gets a resolved scoped command

- `fix-wave.md` `## Wave`, the scoped-test bullet, inlines the lookup (no citation to `sync.md`, which stays unchanged): read the overrides file, then `AGENTS.md`, at the merge-base (`assessment.md` `## Configuration` trust rule, `git show "$MB:<path>"`); a scoped runner is a documented test command carrying a `<paths>` or `<files>` placeholder, or a command the doc labels scoped, in any section - `## PR gate`, `## Project`, `## routing`, `## test-driven-development`, `## verification-before-completion` alike; keep its cwd and flags verbatim; with several runners pick the one whose directory prefix matches the payload's test file; substitute the test files the payload touches or writes (for a carried `P#`, the sync record's failing test file); no runner or no test file -> `none`. Never the resolved `verification command`, whatever a consumer sentence says about fix waves. `none` -> the helper reports `no scoped test` and the pre-push reviewer is its only gate (existing rule).
- Examples the rule must produce: gridstrong `cd dashboard && mise x -- bin/rspec spec/models/widget_spec.rb`; customer-ops `uv run --group test python -m pytest projects/x/tests/test_y.py -q`.

### D4 - closure review over the wave's own findings

- `fix-wave.md` `## Review before push`: the reviewer task's `## Previous review report (re-review trigger)` lists only the findings whose payloads this wave dispatched, with their `P#`/`L#` ids; closure lines are asked for those ids only. `## Fix delta` is unchanged, including the three-part form when the round holds a `merge base` commit (`git diff <pushed_head> <merge-sha>^1`, `git show --remerge-diff <merge-sha>`, `git diff <merge-sha> HEAD`) and the remerge-only review at the pre-push conflict check.
- Carried set and re-dispatch (replaces the current "re-dispatch implementers with the report verbatim for the `open` payloads and the new Critical or Moderate findings" sentence): the next round dispatches one fresh implementer, serially, per item in the carried set - each `open` closure line of this wave's ids (its payload), each new Critical or Moderate finding inside `## Fix delta`, and each new Critical finding outside it (the reviewer's finding text, per the existing no-payload rule). A new reviewer finding entering the carried set is minted a `P#` before dispatch and listed under it in the next round's reviewer task. An in-delta Minor translates to a nit as today; a `[Minor] (outside fix delta)` finding, or an outside-delta finding the report tags Moderate, prints under `show evidence` only. Push rule, replacing today's: push only when the carried set holds no Critical or Moderate.
- Unchanged: round cap, `pre_wave_head` empty-round test, lease rules for `rebased locally`, evidence poll, own-push re-render.

## Errors and edge cases

- Zero blockers, zero nits, no withhold: verdict `mergeable`, no `fix` or `fix nits` row, no nit line.
- Zero blockers, N nits, no withhold: verdict `mergeable`, `fix nits` offered, nit line renders.
- Zero blockers with a withhold (reviewer run in progress, binding check pending, ...): verdict stays `fixable - <reason>`, `merge` omitted as today, `fix nits` offered only when a nit exists.
- `fix + nits` with zero blockers behaves as `fix nits`; a composed line naming an unrendered verb is refused by name and the menu re-renders (existing rule).
- `SCOPED_TEST_COMMANDS` resolves to `none` for a doc-only payload: helper reports `no scoped test`, reviewer gates it (existing rule).
- A consumer sentence that names the verification command for fix waves: the wave ignores it; the verification command runs only where `verification-brief.md` Section B's table selects a local-run row.
- A `rebased locally` head: its carried `P#` payloads and the failing test file named in the sync record enter the wave as today; D3's resolution appends that file.

## Tests

`eval/gatekeep-pr/target.json` gains `skills/gatekeep-pr/reference/fix-wave.md`, `reference/findings.md`, `reference/post-selection-loop.md`, and `reference/report.md` in `skillFiles`; `wordCap` bounds the reply and stays `2000` unless a new sample's valid reply exceeds it. `eval/gatekeep-pr/replay.md` gains one sentence: a case whose digest carries an `## Entry` block starts narration from the state that block names (a rendered menu plus a pick, or a returned wave reviewer report) and stops at the point the block names; existing samples carry no block and keep the first-menu stop. Three samples, each with must-hold facts:

| Sample | Case | Must hold |
|---|---|---|
| `nits-only-ready` | report with 0 blockers, 3 nits, CI green, own PR, no withhold | menu has no `fix` row; has `fix nits`; one line `3 nits open - fix nits to take them`; `merge` is `[recommended]` |
| `blockers-bare-fix` | `## Entry`: menu with 2 blockers, 2 nits; pick `fix`; digest carries a synthetic overrides excerpt with a full-suite `## PR gate` command and a `<paths>` runner under another heading; stop before the reviewer dispatch | the wave dispatches exactly the two blocker payloads, serially; no nit payload is drafted or dispatched; each helper task quotes the `<paths>` runner over the payload's test file and never the `## PR gate` command |
| `wave-closure-retry` | `## Entry`: a wave over P1, P2 returned; reviewer report with `P1: resolved`, `P2: open - <why>`, one in-delta Moderate, one outside-delta Critical, one `[Minor] (outside fix delta)`; stop after the next round's dispatch list | the reviewer task listed P1 and P2 only; the next round dispatches P2, the Moderate, and the Critical, each under a `P#`; the Minor is not dispatched; no push happens |

`intent.md` names the three samples under `## Expected to move`; `node eval/run.mjs gatekeep-pr` runs before finish and its `report.md` is committed.

`npm test` covers skill lint, the eval structural lint, and the settings and model-literal bans.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` `## Unreleased` - the `fix` row semantics (blocker-only, `fix nits` for nits, scoped command per helper, wave-scoped closure review); `README.md` - the gatekeep-pr sentence in the skills list names "nits" in the report order and stays accurate, so no edit unless the plan finds it states the nit-default
- Derived / memory docs invalidated: none (`doc/configuration.md`'s `maxFixRounds` paragraph still describes the round cap correctly; no new key)

Per `reference/documentation-impact.md`: skill bodies and `reference/` files are implementation surface, listed in the plan, not here.

## Out of scope

- Parallel fix helpers (needs an integrator commit path; separate spec).
- A new `## PR gate` key for the scoped runner.
- Any change to Verify (step 3), Review (step 4), the sync step, or the post-push evidence poll.
- `sync.md` and its `SCOPED_TEST_COMMANDS` derivation for the conflict helper.

## Open questions

none
