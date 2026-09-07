# Final-verification ownership in plan coverage (gh-24)

**Ticket:** jjuraszek/pi-gauntlet#24
**Amends:** `doc/specs/2026-08-31-gh-19-deterministic-plan-checker.md` - the "Plan parser" owner-grammar bullet ("Requirement rows: owner = comma-separated `Task <n>` list, or `waived: <reason>`") and check catalog rows `table-closure` and `quote-integrity`. Replacement owner grammar: `Task <n>` list, or `Verification`, or `waived: <reason>`. Everything else in gh-19 stays binding. The predecessor banner is already applied in-tree (line 3 of gh-19, uncommitted); commit it, do not re-author.

## Context

The plan checker (`extensions/lib/plan-check.ts`) closes every `## Spec coverage` requirement row against a `Task <n>` list or `waived: <reason>`. The `header-entrypoint` check forbids the header's `**Verification:**` text (backticks retained, trimmed) from appearing as a substring of any wave/task-scoped line; it may live only in the plan header.

## Problem

A spec requirement of the form "the full suite passes: `npm test`" cannot be truthfully owned:

- owned by a task -> `quote-integrity` requires `npm test` verbatim in that task body; when the task quotes it the way SKILL.md "No Placeholders" demands (backticked, equal to the header text) `header-entrypoint` fails;
- `waived:` -> misrepresents an in-scope requirement as out of scope.

## Design

### Owner grammar

Coverage-row owner cell accepts a third form: the exact string `Verification`.

- Case-sensitive. `verification`, `Verify`, `VERIFICATION` are not owners -> `table-closure` finding (existing orphan-owner leg).
- Single owner. `Task 1, Verification` is not an owner -> `table-closure` finding.
- `waived:` stays reserved for requirements the spec itself marks out of scope.
- The orphan-owner reason string changes to `owner cell is not a 'Task <n>' list, 'Verification', or 'waived: <reason>'`. Update the existing test assertions on the old string in `extensions/lib/plan-check.test.ts`.

### Parser

`CoverageRow` gains `isVerification: boolean`. Owner cell exactly `Verification` parses to `{ ownerTasks: [], isWaived: false, ownerMalformed: false, isVerification: true }`. All other rows parse as today with `isVerification: false`.

### `table-closure`

- A `Verification` row with a parseable `§ "heading" L<n>[-L<m>]` anchor is a closed row; no orphan finding.
- A `Verification` row whose anchor is not parseable (including `-`) -> `table-closure`, existing reason `requirement row anchor is not a parseable § "heading" L<n>-L<n> anchor`. Hoist the parseability check out of the per-owner-task loop so it runs for `Verification` rows.
- A `Verification` row whose anchored spec lines yield zero backtick literals -> `table-closure`, reason `Verification row has no backtick literal to check against the header`.
- A mechanical row (`mechanical:` requirement) owned by `Verification` -> `table-closure`, reason `mechanical row owner must be a Task <n>`.
- The anchor-containment leg skips `Verification` rows (no task `**Spec:**` line to contain the anchor).
- `Verification` rows do not count toward the "every `### Task N` heading appears in >= 1 row" leg.

### `quote-integrity`

For a `Verification` row: every backtick-quoted literal inside the row's anchored spec lines (backticks stripped; `<placeholder>` spans skipped, as today) must be a verbatim substring of `header.verificationText` with every backtick character removed (`replaceAll` with `""`). Strip-all applies to this check only; `header-entrypoint` keeps comparing the unstripped text. Header `npm test && npm run lint` contains `npm test`. Two-span header `npm test`, `npm run lint` becomes `npm test, npm run lint` and contains both `npm test` and `npm run lint`.

Missing literal -> finding `{ check: "quote-integrity", line: <coverage row line>, text: <coverage row line quoted>, reason: "verification header does not contain the required verbatim literal <literal> (backticked)" }`. No new finding kind. Do not `continue` past `Verification` rows in `checkQuoteIntegrity`; branch on `isVerification` before the `ownerTasks` loop.

Absent `**Verification:**` header: header text is empty, so every literal of a `Verification` row fails `quote-integrity`, in addition to the pre-existing `header-entrypoint` missing-header finding.

### Untouched

- `computeRequiredLiteralsPerTask` and the placeholder path skip `Verification` rows (no task body).
- `header-entrypoint` unchanged: still fails when a wave/task-scoped line contains the full header string.
- All task-owned checks, the pass stamp, `flowGuards.enforce`, and review/verification gates unchanged.

### `skills/writing-plans/SKILL.md`

Imperative wording, no rationale paragraphs.

1. "Spec Coverage Table" requirement-rows bullet: owner = task-ID list, or `Verification`, or `waived: <reason>`. `Verification` = the requirement is proven by the header `**Verification:**` command; its quoted literals must be contained in that header; anchor the single requirement line; tasks own only their scoped commands.
2. Example table: add a paired example - a task-owned scoped-command row and a `Verification`-owned full-suite row:

   ```markdown
   | § "Testing" L84 | checker fixtures: `node --test extensions/lib/plan-check.test.ts` | Task 3 |
   | § "Acceptance" L88 | full suite passes: `npm test` | Verification |
   ```

3. Self-Review "Code-vs-anchor sanity": scope to task-owned rows; add: for `Verification` rows, confirm the header command exercises the anchored requirement.
4. Self-Review: add bullet "Verification-ownership authorization" - `Verification` on a requirement no header command exercises is a Self-Review failure.

## Edge cases

| Case | Result |
|---|---|
| `Verification` row, literal contained in single-span header | no finding |
| `Verification` row, two-span header, both literals contained | no finding |
| `Verification` row, literal not in header | `quote-integrity` |
| `Verification` row, no header | `quote-integrity` per literal + existing `header-entrypoint` missing-header finding |
| `Verification` row, anchor `-` or unparseable | `table-closure` (parseability reason) |
| `Verification` row, anchored lines have no backtick literal | `table-closure` (no-literal reason) |
| `mechanical:` row owned by `Verification` | `table-closure` (mechanical-owner reason) |
| task body contains full header string | `header-entrypoint` (unchanged) |
| task body contains a sub-command of a multi-command header | not caught - pre-existing `header-entrypoint` scope, out of scope here |
| owner `verification` / `Verify` | `table-closure` (orphan-owner reason, new string) |
| owner `Task 1, Verification` | `table-closure` (orphan-owner reason, new string) |
| task-owned row with literal missing from task body | `quote-integrity` (unchanged) |

## Out of scope

- Multi-owner rows mixing tasks and `Verification`.
- Case-insensitive `Verification`.
- Widening `header-entrypoint` to sub-commands.
- A mechanical single-line-anchor check for `Verification` rows (guidance only, in SKILL.md).
- Any settings key, gate, or test-cadence change.
- Fixing existing consumer plans.

## Testing

`extensions/lib/plan-check.test.ts` (`node --test`): one fixture per Edge-cases row above; add a `Verification` row with a header-contained literal to the shared `VALID_PLAN` fixture, keeping its empty-findings assertion. Run:

```bash
node --test extensions/lib/plan-check.test.ts
npm test
git diff --check
rg -ni "<your-company>|jjuraszek|/Users/[^/]+|<your-org-name>|<forbidden-project>" skills/
```

Expected for the last command: only the pre-existing `https://github.com/jjuraszek/pi-cohort/...` link hits; no new matches.

## Acceptance criteria

1. `Verification` (exact) accepted as a single coverage-row owner.
2. `Verification`-row literals resolved by verbatim containment in the stripped `**Verification:**` header text; miss -> `quote-integrity` with the reason above.
3. Case variants, mixed owners, unparseable anchors, literal-free anchors, and mechanical rows under `Verification` -> `table-closure`.
4. Task-owned `quote-integrity` and `header-entrypoint` behavior unchanged, with fixtures proving it.
5. `skills/writing-plans/SKILL.md` carries the four edits in "Design > skills/writing-plans/SKILL.md" (owner rule, paired example, Code-vs-anchor branch, authorization bullet).
6. gh-19 spec carries the supersession banner scoped to the parser owner-grammar bullet and catalog rows `table-closure` and `quote-integrity`.

## Documentation impact

Materiality bar: `skills/brainstorming/reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none (`skills/writing-plans/SKILL.md` is implementation surface; `README.md` does not list owner forms)
- Derived / memory docs invalidated: none
