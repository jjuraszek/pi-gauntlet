# Loop engine: row-scaled iteration cap, durable cap grants, tree-wide AC splitting

**Goal:** Size the loop engine's total iteration cap from the ledger's row count, record it and every human grant in the ledger so rule 4 and resume read one durable value, and split "zero findings anywhere" drafted acceptance rows into per-family rows at spec-writing so a single row can no longer absorb a run.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves

Supersedes `doc/specs/2026-10-23-gh-68-loop-implement-engine.md`, iteration cap and `loopEngine` config only (its AC "bounds the total iterations of any run" and `maxIterations` default, the Driver `Cap:` step, the "never bypasses `maxIterations`" funding clause, the `Settings and telemetry` key, and the `maxIterations reached` edge-table row). Ledger grammar, row allowance, funding, retry, amendments, and telemetry stay live there.

## Problem

`piGauntlet.loopEngine.maxIterations` is a flat total (default 30) that ignores ledger size. A 3-row ledger gets ten dispatches per row; a 24-row ledger gets fewer than two, below its own per-row allowance of 3, so rule 4 (`skills/loop-implementation/SKILL.md`, ordered table) fires on a healthy large run. The cap is skill prose only - nothing in `extensions/` counts iterations - and when it fires the stop note offers only retry, amend, or stop (`SKILL.md` "Human stop" table), so a human's "give me 50 more rounds" has no grammar. The observed run (a 24-row ledger seeded 2026-10-25) reached `iterations: 43` with row 2 at 37 attempts through 23 `row 2 retry` decisions and funding escalated through `fund 10`, `20`, `60`, `110`, `140 fix rounds`; at iteration 30 the orchestrator improvised `iteration cap 70 | user: <grant> | run-local increase from 30; preserve consumed iterations and row attempts` decision lines, then `120` and `150`, a grammar the skill never defines and resume cannot read (`skills/gauntlet-resume/reference/reconstruction.md` step 4 re-resolves the setting and reads only `iterations:`).

Row 2 itself was the larger cost: its acceptance row was "zero prose, engine, and size findings across the whole tree", so each child fixed one family and honestly reported `failed`. Ledger rows are 1:1 with spec `- [ ]` rows (`extensions/lib/plan-check.ts` `checkLedger`, `expected exactly one row per spec AC`) and the driver never reads row text, so no ledger-side split exists; the only place a tree-wide row can become several rows is brainstorming's drafted-row integrity table, before the ledger exists.

Framing: pivoted to three parts - a row-scaled cap for sizing, a durable mid-run cap-grant decision grammar, and a tree-wide drafted-row integrity class in brainstorming - because the observed run burned on a tree-wide AC and on an improvised cap-grant line; a scaled cap alone would have set 73 and still stalled on row 2.

Premises carried from the questionary:

- The cap stays skill-prose enforced; the ledger header and decisions were enough to reconstruct the observed run, so no runtime counter in `extensions/` (approach 1 over a `phase_tracker` guard).
- `maxIterations` is removed, not aliased - the loop engine is experimental and the user accepted the break.
- `plan_check` ignores header lines it does not know (`plan-check.ts` `checkLedger`), so a new `cap:` header passes lint without a `plan-check.ts` change.
- The loop's row-funding phrase `fund N fix rounds` shares its words with the verify-phase `closureReview.maxFixRounds`; renaming it is out of scope here.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] With `.pi/settings.json` carrying no `piGauntlet.loopEngine` key, `resolveLoopEngine` returns `{ maxIterationsPerRow: 4, warning: undefined }` and `gauntlet_setting({ key: "loopEngine" })` returns `details.maxIterationsPerRow` of 4 with no loopEngine warning, its wrapper fields (`key`, `errors`, joined settings-load warnings) unchanged; with `maxIterationsPerRow: "4"` or `4.5` the resolver returns 4 with the warning `loopEngine.maxIterationsPerRow must be an integer; using default 4`; with `maxIterationsPerRow: 0` it returns 1; with a `maxIterations` key present it returns the new value (or default) plus the warning `loopEngine.maxIterations is removed; set loopEngine.maxIterationsPerRow`, and the old value is never used; when both warnings apply the `warning` field reads the removed-key message, then `; `, then the integer message.
  in-scope
- [ ] The ledger the driver writes at entry carries a header line `cap: <n>` directly below `iterations: 0`, where `<n>` equals the count of rows not initialized `cut` times `maxIterationsPerRow`, plus one; `plan_check` on that ledger passes; a ledger seeded from a 24-row spec with no cut rows under the default setting reads `cap: 97`, and a later `loop: cut row <n>` commit leaves the `cap:` line unchanged.
  in-scope
- [ ] When the ledger's `iterations` is at or above its `cap:` with an `open` or `failed` row, the driver stops before any dispatch and before verification with a note that names the cap value, every unresolved row with its attempts, and offers `cap +N` beside retry, amend, and stop; a ledger with `iterations: 97`, `cap: 97`, and one open row produces that stop.
  in-scope
- [ ] A human reply `cap +50` at that stop produces exactly one parent commit `loop: raise cap` whose diff adds the `## Decisions` row `cap +50 | <the trimmed words after the token, empty when the reply carries none>` (the bare reply `cap +50` writes `cap +50 |`) and rewrites the header to `cap: 147`, with every row's attempts and the `iterations:` value unchanged; the driver then resumes at the ordered table; a reply `cap +0`, `cap +x`, or `cap -5` asks once and commits nothing, and a second invalid reply leaves the driver at the same stop with nothing committed.
  in-scope
- [ ] A ledger whose line 1 is `# Ledger - loop engine` and that has no `cap:` header stops the driver and the resume route with the note `ledger has no cap: line - seeded under the old loopEngine contract`, offers `cap +N` which writes `cap: <iterations + N>`, and never derives a cap from settings.
  in-scope
- [ ] The resume route, restoring a ledger that carries `cap: 97`, reads that value from the ledger and makes no `gauntlet_setting({ key: "loopEngine" })` call; its rendered state shows `cap: 97`.
  in-scope
- [ ] At spec-writing, a drafted acceptance row whose observable is a tree-wide or set-wide negative - zero/no findings of one or several kinds anywhere in or across a tree or set, such as `zero prose, renderer and size findings across the tree` or `no lint findings anywhere in src/` - is written as one row per family the Design section explicitly enumerates for that row, each row naming its family and its own observable (`zero findings in recipe prose`, `zero findings in renderer routing`, `zero findings in file-size`) so that every outcome the original row committed is preserved across the resulting rows; for a Design that enumerates the families `recipe prose`, `renderer routing`, and `file-size`, that drafted row becomes those three rows; a Design whose enumeration is absent, covers only part of the kinds the row names, or names an unrelated set stops spec-writing with the row quoted and a request to record the complete enumeration in Design; and a ticket row of the same shape stays one verbatim row.
  in-scope
- [ ] `doc/configuration.md` "Loop engine operations" documents `maxIterationsPerRow` (default, floor, non-integer fallback, removed-key warning), the `cap:` header and its derivation, and the `cap +N` grant; `doc/implement-engines.md` names the row-scaled cap where it names the total iteration bound; neither document mentions `loopEngine.maxIterations` except as the removed key.
  in-scope
- [ ] `npm test` passes, and `node eval/run.mjs loop-implementation`, `node eval/run.mjs gauntlet-resume`, and `node eval/run.mjs brainstorming` pass with their committed `report.md`, each target carrying at least one sample added for this change (cap stop and `cap +N` grant; legacy ledger without `cap:`; `cap:` read on resume; tree-wide drafted row split).
  deviates: `node eval/run.mjs brainstorming` exits 1 only on `grant-budget-reply/funded-value`, a pre-existing trailing-period judge flip on a sample this change does not touch (the base report at def71189 shows the same fact flipping on the other model); `loop-implementation`, `gauntlet-resume`, and every sample added for this change hold

## Design

### Settings resolver

`resolveLoopEngine` in `extensions/lib/gauntlet-settings.ts` reads `piGauntlet.loopEngine.maxIterationsPerRow`: integer >= 1 (integers below 1 floor to 1), default 4; any non-integer (string, fraction, boolean) falls back to 4 with `loopEngine.maxIterationsPerRow must be an integer; using default 4`. A present `maxIterations` key, whatever its value, adds the warning `loopEngine.maxIterations is removed; set loopEngine.maxIterationsPerRow` and contributes nothing to the result. Both warnings travel in the `warning` field `gauntlet_setting` already returns; when both apply the resolver joins the removed-key message first, then the integer message, with `; `. The resolver's return shape is `{ maxIterationsPerRow, warning }`. `extensions/phase-tracker.ts` spreads it into the tool payload as today (`{ key: "loopEngine", ...loop, warning, errors }`, settings-load warnings joined onto `warning`), so tool callers read `details.maxIterationsPerRow`. `npm run build:bins` after the lib change.

### Loop driver (`skills/loop-implementation/SKILL.md`)

Entry step 1 retains `maxIterationsPerRow` (default 4) instead of `maxIterations`. Entry step 4 writes `cap: <n>` as the header line after `iterations: 0`, with `n = (rows not initialized cut) * maxIterationsPerRow + 1`; the `+ 1` is the seed dispatch. The cap is computed once from the ledger as written at entry: a later `cut` does not shrink it, a reopened row does not grow it, and a redraw deletes the ledger so its re-seed recomputes. The ledger grammar block gains the `cap:` line; `doc/configuration.md`'s copy of the grammar matches.

Ordered-table rule 4 becomes `iterations >= cap` (the header value), action: human stop naming the cap, unresolved rows and attempts, before verification; seed and interrupted dispatches count. The stop note for rule 4 and every other stop keep the sentence `Preserve every row's attempts and the total iteration cap.` (asserted by `scripts/loop-engine-contract.test.mjs`).

The Human stop table gains one row, offered only at the rule 4 stop and at the legacy missing-`cap:` stop below, both on a clean tree; the dirty-tree and commit-boundary stops keep their discard-authorization path and never offer `cap +N`:

| Human choice | Durable action |
|---|---|
| Raise cap (`cap +N`) | Parse the reply as the anchored token `cap +<n>` with `<n>` matching `[1-9][0-9]*`, followed by an optional remainder; the words cell is the trimmed remainder after the token and its optional `|` separator, and may be empty (the bare reply `cap +50` writes `cap +50 |`). Append `cap +<n> | <words>` under `## Decisions`, rewrite the header `cap:` to the previous value plus N, commit both as `loop: raise cap`. Never touch attempts or iterations. A malformed token (`cap +0`, `cap +x`, `cap -5`) asks once; a second invalid reply leaves the driver at the same stop with nothing committed. |

Rule 2 (row at allowance) and rule 4 are independent: funding raises one row's allowance, a cap grant raises the total; a stop that satisfies both lists both offers, and the human answers each through its own reply and contract - `cap +N` here, funding through the spec's `**Amend-grant:**` token as today; the driver defines no combined reply. The `loop: raise cap` commit is a parent commit, not a child `loop: row ...` commit: rule 3 does not count it, and it resets neither the empty-commit window nor the validation-miss window - only `loop: retry row <n>` starts those windows. Row selection ("the still-failed row named by the previous decision") and the child's `previous decision:` input read the latest operational `row <n> ...` decision, skipping `cap +<n>` rows; cap rows stay under `## Decisions` as durable history, and resume renders them with the rest.

A ledger without a `cap:` header (seeded before this change) stops at the ledger read before the ordered table is applied, with `ledger has no cap: line - seeded under the old loopEngine contract`, offering `cap +N`, which writes `cap: <iterations + N>` in a `loop: raise cap` commit with the decision row `cap +<n> | <words>`; the driver never recomputes a cap from settings for such a ledger.

The funding sentence "Funding buys neither cap bypass nor empty-commit bypass nor an escalated model" stays; `cap +N` is the one way to extend the cap.

### Resume (`skills/gauntlet-resume/SKILL.md`, `reference/reconstruction.md`, `reference/brief-contract.md`)

Every ledger restore - reconstruction's "Spec with ledger" step 4, the brief-contract `implement with ledger` row, and the verify/ship ledger-brief rows that continue in `After the loop` - reads `cap:` from the ledger header at one shared ledger-restore boundary, before any phase-specific continuation, and renders `cap: <n>` beside the restored iterations, attempts, funding and retry allowances. Reconstruction step 4 skips the driver's Entry step 1 entirely when restoring a ledger: no `gauntlet_setting({ key: "loopEngine" })` call and no cap derived from settings; the unavailable-settings-tool stop applies to fresh seeding, not to ledger restoration. A ledger without the header enters the driver's legacy stop at that boundary, before dispatch and before verification, so a verify/ship ledger brief and a completed legacy ledger stop there too; after the grant writes `cap:`, the restore continues on its original phase-specific path (`Before each dispatch` for implement, `After the loop` step 1 for verify/ship).

### Brainstorming drafted-row integrity (`skills/brainstorming/reference/ticket-acceptance.md`)

The integrity-classes table under "Row production at spec-writing" gains one row:

| Class | Recovery before writing |
|---|---|
| Tree-wide | A drafted row whose observable is a tree-wide or set-wide negative - zero/no findings of one or several kinds anywhere in or across a tree or set - becomes one row per family Design explicitly enumerates for it, each with that family's own observable, every outcome the original row committed preserved across the resulting rows; the enumeration is an explicit list in Design covering every kind the row names (as Tautological reads a design-sourced, already-enumerated set); an absent, partial, or unrelated enumeration stops before writing, quoting the row and asking for the complete enumeration in Design, as Unspecified-but-binding stops for a missing value |

The class applies to drafted rows only. Ticket rows keep the verbatim contract; a ticket row of that shape stays one row, and the human repairs the ticket through `/skill:shape-ticket` before approval if they want the split.

### Documentation

`doc/configuration.md` "Loop engine operations": the `maxIterations` paragraph is rewritten for `maxIterationsPerRow` (default 4, floor 1, non-integer fallback message, removed-key warning); the ledger grammar block gains `cap: <n>`; the attempts/funding/cap prose names the cap derivation, that cuts do not shrink it, and the `cap +N` grant with its decision row and commit. `doc/implement-engines.md`: the sentence naming total iterations names the row-scaled cap, and its resume restore list (`Restore base, verification, iterations, attempts, funding and retry allowances`) gains `cap`. `skills/gauntlet-resume/SKILL.md`: the `implement with line-1 ledger` route row restores `cap` beside `ledger iterations/retry data`. `CHANGELOG.md` `## Unreleased` records the breaking key rename.

### Evals

Existing samples that encode the removed contract migrate first, keeping their original coverage: `eval/loop-implementation/samples/cap-and-exit-verification` (`maxIterations=2`, no `cap:` line) and `commit-boundary` (`if maxIterations is 1`), and `eval/gauntlet-resume/samples/loop-no-ledger` (`loopEngine maxIterations is 12`, fact `resolves maxIterations 12`), `loop-ledger-worktree`, and `loop-ledger-brief` (cap-less ledgers at `iterations 7`/`5` expecting immediate continuation). Fresh-seed cases use `maxIterationsPerRow`; continuation fixtures carry an explicit `cap:` header; each sample's `expected.md` is re-derived so interrupted-seed, retry, routing, and exit-verification facts still hold, and every moved fact is listed under `## Expected to move` in the target's `intent.md`. The legacy missing-`cap:` stop gets its own dedicated fixtures rather than reusing the migrated ones.

New samples, marked baseline-skipped: `eval/loop-implementation`: a sample with a 24-row ledger at `iterations: 97`, `cap: 97`, one open row - the stop names `cap 97`, the row and its attempts, offers `cap +N`; the reply `cap +50` yields the decision row, `cap: 147`, commit `loop: raise cap`, attempts untouched. A second sample with a ledger lacking `cap:` - the legacy stop, no `gauntlet_setting` recompute. `eval/gauntlet-resume`: a sample restoring a ledger with `cap: 97` - rendered state shows it, no loopEngine settings call; the existing brief-route coverage is extended so a verify/ship ledger brief without `cap:` hits the legacy stop before `After the loop` step 1 and one with `cap:` renders it and continues there. `eval/brainstorming`: a sample whose Design enumerates three families and whose drafted row is tree-wide - three rows result. All three targets' `intent.md` files name the cap, resume-boundary, or tree-wide contract they now hold. Each target's `report.md` is committed after `node eval/run.mjs <target>`.

## Errors and edge cases

| Case | Behavior |
|---|---|
| `maxIterationsPerRow` string, fraction, or boolean | default 4 plus the integer warning |
| `maxIterationsPerRow` integer < 1 | floored to 1, no warning |
| `maxIterations` present (alone or beside the new key) | one removed-key warning; value ignored; new key or default used |
| All-cut seed (every AC `deviates:`/`deferred:`/`elsewhere:`) | the newly seeded ledger gets `cap: 1` from the formula and follows rule 1's normal exit-verification path without a seed dispatch; distinct from an old ledger missing its mandatory `cap:` header, which is the legacy stop below |
| `cut` after seed | `cap:` unchanged |
| Redraw | ledger deleted with the plan; the new ledger recomputes `cap:` at entry |
| `cap +N` with N not a positive integer | ask once; a second invalid reply stays at the same stop; no commit |
| `cap +N` at a dirty-tree or commit-boundary stop | not offered; the discard-authorization path runs first |
| Stop satisfying rule 2 and rule 4 | both offers listed; cap and funding are answered in separate replies, each under its own contract |
| Ledger without `cap:` (pre-change) | legacy stop; `cap +N` writes `cap: <iterations + N>`; never recomputed from settings |
| Child commit edits the `cap:` header | a changed-header validation miss, as for any header, repaired by the parent |
| Tree-wide drafted row, Design enumeration absent, partial, or unrelated | spec-writing stops quoting the row and asks for the complete enumeration in Design |
| Tree-wide ticket row | stays one verbatim row; repair through `/skill:shape-ticket` before approval |

## Tests

- `extensions/lib/gauntlet-settings.test.ts`: assertions against `{ maxIterationsPerRow, warning }` - default 4 and no warning; floor at 1; string and fraction fall back with the exact message; `maxIterations` alone warns and returns default; both keys present warn once and return the new value; `maxIterations` present beside a non-integer `maxIterationsPerRow` yields the removed-key message, `; `, then the integer message.
- `extensions/phase-tracker.test.ts`: both existing loopEngine cases migrate - `gauntlet_setting loopEngine resolves the key` asserts `details.maxIterationsPerRow`, and `gauntlet_setting loopEngine composes settings load warnings` keeps its settings-load warning composition and wrapper fields while reading `details.maxIterationsPerRow`.
- `scripts/loop-engine-contract.test.mjs`: its existing assertions on `SKILL.md` keep passing (`iterations: 0`, the preserve-cap sentence, the step order); one assertion added for `cap:` in the ledger grammar and `loop: raise cap` in the stop table.
- `npm test` (bundle freshness after `npm run build:bins`, skill lint, instruction-size lint).
- Evals per Design, outside `npm test`.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` - Loop engine operations (operations / tunable parameters: new key, default, removed-key warning, `cap:` header, `cap +N` grant); `doc/implement-engines.md` - loop engine description (architecture: cap derivation, resume restore list); `CHANGELOG.md` - deferred: release
- Derived / memory docs invalidated: none (`README.md`, `AGENTS.md` do not name `loopEngine.maxIterations`)

Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- A runtime iteration counter or `phase_tracker` guard for the cap (approach 2); revisit if an orchestrator is observed dispatching past a `cap:` it wrote.
- Renaming the row-funding phrase `fund N fix rounds` to disambiguate it from `closureReview.maxFixRounds`.
- Changing the per-row allowance of 3 or the funding and retry grammar.
- Splitting ticket rows; the ticket contract stays verbatim.
- `plan_check` validation of the `cap:` value.

## Open questions

- None.
