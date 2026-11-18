# Council telemetry and roster assessment

> **Superseded by:** [doc/specs/2026-11-18-gh-157-skill-read-telemetry.md](./2026-11-18-gh-157-skill-read-telemetry.md) - sections 5 and 6 per-run output and reply layout only

**Goal:** Record per-member and chair outcomes of the brainstorming spec council in the run telemetry record, and give `gauntlet-performance` a council section that aggregates them per roster and flags members that do not earn their place.

Amends `doc/specs/2026-09-18-gh-35-gauntlet-performance-telemetry-report.md`, scope: the performance digest's aggregation and output contract (its `council` run column stays; a council section is added). Bin packaging follows `doc/specs/2026-09-19-gh-39-installed-bins-ship-js.md` unchanged.

## Context

The telemetry extension (`extensions/telemetry.ts`) ingests every `subagent` tool result. For the spec council it stores only `personas.spec-council-member.dispatches` and the distinct effective model strings; finding counts are parsed only for `spec-reviewer`, `code-reviewer`, `conformance-reviewer` (`REVIEWER_AGENTS`, `extensions/lib/telemetry-collect.ts`). The `council` column in `gauntlet-performance` is that dispatch count.

The raw material for per-member outcomes exists but is not joined anywhere:

- The chair (`agents/spec-council-synthesizer.md`) emits `clusters:` lines of the form `- [blocker|major|minor] <theme> — raised-by: [<slug>, <slug>] — <finding> → grounded|hypothesis: <edit>`, where `<slug>` = `slug(configured member string)` recovered from the member filename `member-<i>-<slug>.md`.
- The parent (`skills/roasting-the-spec/SKILL.md` section 4) emits `Applied:` / `Deferred:` / `Rejected:` audit lines that brainstorming pastes into the gate message and the spec commit body. Today those lines name clusters by theme text only, and brainstorming's gate template comma-joins the items on one line per disposition.
- pi-cohort returns the effective model with its thinking suffix (`runs/shared/pi-args.ts:applyThinkingSuffix` appends `:<thinking>` when the configured string has none), and each `SingleResult` carries `savedOutputPath` when the task had an `output:` and exited 0 (`pi-cohort/src/shared/types.ts`). A real record shows `anthropic/claude-opus-5-5:xhigh` and `anthropic-fable/claude-fable-5-1:medium` side by side under `spec-council-member`, while `settings.json#piGauntlet.specCouncil.members` lists `anthropic/claude-opus-5-5` and `anthropic-fable/claude-fable-5-1:high`.

Constraints found during design: `spec-council-member` and `spec-council-synthesizer` are also dispatched by `skills/brainstorming/reference/amendment-surface.md` (amend reviews) and `skills/shape-ticket/SKILL.md` (ticket roast, phase-less), so raw dispatch count is not the council fan-out. `writeRecord()` rebuilds `record.derived` via `derive()` on every flush, carrying `plan`, `tests`, `diff`, `modified_files` and `council`. `onSubagentResult` runs only when `!event.isError`, and pi-cohort's single-agent path sets `isError: true` on a nonzero exit while keeping `details.results`. The council hook now reads the parent's audit at `message_end`.

## Problem

There is no grounded data to decide whether a council member, or a thinking-level variant of one, is worth its cost, or whether swapping the chair changed anything. Roster changes are made on impression. The operator wants per-model counts (total, unique, applied, rejected, split by severity), a report that assesses the current roster and compares it with earlier rosters and chairs, and a recommendation to remove or modify a member that is deterministic and explainable - without storing the full finding text, which already lives in the spec commit body.

## Acceptance criteria

none - no ticket

## Design

### 1. Module layout

All council parsing and joining is a pure module, `extensions/lib/telemetry-council.ts`, with `extensions/lib/telemetry-council.test.ts` (registered in the explicit test list in `scripts/ci.mjs`). `extensions/telemetry.ts` gains wiring only: one in-flight `councilPending` accumulator, two call sites, no parsing; its net growth is bounded to ~40 lines. `extensions/lib/telemetry-record.ts` gains the optional `council` type under `derived`, and `derive()` carries `council: rec.derived.council` through the same way it carries `tests`.

Exports of `telemetry-council.ts`:

| Export | Contract |
|---|---|
| `slug(model)` | Replace every character outside `[A-Za-z0-9]` with `-` - the same rule roasting-the-spec uses for member filenames. |
| `memberSlugOf(savedOutputPath)` | Basename matched against `^member-\d+-(.+?)(\.md)?$`; returns the captured slug or `undefined`. Retry files live under `retry/` with the same basename, so the rule holds for both. |
| `normalizeRaisedBy(token)` | Strip a leading `member-\d+-` and trailing `.md`, then `slug()`. Guards against a chair that pastes a filename stem or the raw `provider/model`. |
| `parseChairReport(text)` | Returns `{ clusters: Cluster[] }` or `null`. `null` when `text` has no `^consensus:` line. Clusters are read only between the `clusters:` header and the next top-level header (`resolved:` or end); each bullet yields `{ severity, raisedBy: string[] }` from `[blocker|major|minor]` (case-insensitive) and `raised-by: [...]` (tokens normalized, duplicates collapsed). A bullet under `clusters:` that lacks either attribute makes the whole result `null`. Separators `-`, `--`, `—` are accepted. `clusters:` with no bullets is `{ clusters: [] }`. |
| `parseAudit(text)` | Returns `AuditItem[]` or `null`. Scans lines matching `^\s*(?:[-*]\s*)?(Applied|Deferred|Rejected):\s*(.*)$`. All three prefixes must appear at least once in `text`, else `null`. A body equal to `none` (case-insensitive) contributes no item. Every other body must carry `[severity]` and `raised-by: [...]`; any that lacks either makes the result `null`. `Applied: ... -> cut/shrunk ...` and `Applied: ... -> open question (...)` are `applied`. |
| `resolveMembers(results)` | From council-member `SingleResult`s: `dispatches: Map<model, n>` (every result with a `model`, exit code irrelevant) and `slugToModel: Map<slug, model>` from results that have `savedOutputPath` and exit 0. If one slug maps to two different models, return `null` (ambiguous). |
| `buildCouncil(input)` | `input = { chair: { model, dispatches, clusters }, members: { dispatches, slugToModel }, audit }`. Returns the `council` block or `null` when the batch is incomplete (section 3). |

### 2. Capture - brainstorm phase only

State: `councilPending: { memberResults: SingleResult[], chair?: { model, dispatches, clusters? } } | undefined`, cleared on `phase_tracker reset`, on `phase_tracker start brainstorm`, in `unbind()`, and whenever a council-member batch arrives while `councilPending.chair` is set (a new council, or a re-roast after the gate, supersedes an unfinished one).

`subagent` `tool_result` handling: the existing `!event.isError` guard stays for everything else; when the current phase is `brainstorm` and `event.details?.results` exists, results whose `agent` is `spec-council-member` or `spec-council-synthesizer` are routed to the council hook regardless of `isError`, so a failed chair (`exitCode != 0`, `isError: true`) is still a counted dispatch.

Council hook:

- `spec-council-member` results: appended to `councilPending.memberResults`. Retried and wedge-killed members count as dispatches - the model ran and belongs to the roster.
- `spec-council-synthesizer` result: `chair.dispatches += 1` (create at 1 with `model`). If the result's text parses via `parseChairReport`, `chair.clusters` is replaced - last usable report wins; a later unusable result leaves earlier clusters in place.

`message_end`, when phase is `brainstorm`, `msg.role === "assistant"`, a record is bound, and `councilPending.chair?.clusters` is set: run `parseAudit(textOf(msg.content))` over the text blocks only. When non-null, `buildCouncil`; when that is non-null, set `record.derived.council`, `flush()`, clear `councilPending`. When `buildCouncil` returns `null` (incomplete batch), keep `councilPending` - a later, complete gate message may still parse.

Outside the brainstorm phase both hooks ignore council personas, which excludes amend-class reviews and shape-ticket councils run between flows. A shape-ticket roast invoked *during* a brainstorm feeds `councilPending`; the superseding-batch rule discards it once the spec council fans out, and its own audit (if it emits one in the gate-line format) cannot complete because its clusters and the spec audit never match. Accepted edge.

### 3. Completeness and record shape

`buildCouncil` writes a block only for a complete batch:

- every `raised-by` slug in every cluster and every audit item resolves through `slugToModel`;
- the multiset of `(severity, resolved raised-by set)` over audit items equals the multiset over clusters - every cluster has exactly one disposition, no extra items. `clusters: []` with an all-`none` audit is complete (a sound spec with zero findings).

Anything else returns `null` and nothing is written. No completeness or reason fields exist in the record; a record without `derived.council` means no council data, never zero.

```yaml
derived:
  council:
    chair: { model: p/chair-model:medium, dispatches: 1, clusters: 7, members_reported: 3 }
    members:
      p/alpha:xhigh: { dispatches: 1, total: { blocker: 1, major: 3, minor: 2 }, unique: { blocker: 0, major: 1, minor: 1 }, applied: { blocker: 1, major: 2, minor: 1 }, unique_applied: { blocker: 0, major: 1, minor: 0 }, deferred: { blocker: 0, major: 1, minor: 0 }, rejected: { blocker: 0, major: 0, minor: 1 } }
      p/beta:high: { dispatches: 2, ... }
```

The block serializes through the existing `derived` flow rule (`flowLeafChildren`), so `chair` and each member row are flow maps as shown. `dispatches > 1` means retried.

Counter semantics, per member, split by severity; all counters read the audit items (which carry severity and the resolved raised-by set), `chair.clusters` reads the cluster count:

- `total` - items whose raised-by set contains this member.
- `unique` - items whose raised-by set is exactly this member.
- `applied` / `deferred` / `rejected` - `total` split by disposition; `total = applied + deferred + rejected` by construction.
- `unique_applied` - `unique` with disposition `applied`.
- `members_reported` - distinct resolved members across clusters.
- A member with dispatches but no attributed item appears with all-zero counters.

Severity is the chair's consolidated severity (the highest any co-raiser assigned), not the member's own; the report states this.

### 4. Skill contract changes

`skills/roasting-the-spec/SKILL.md` section 4: one line per audit item, each carrying the cluster's `[severity]` tag and `raised-by: [...]` list verbatim from the chair report, e.g. `Applied: [major] over-spec: S6 checksum — raised-by: [p-alpha] -> cut (was adds: 2 files / 6 tests / 1 AC)`; an empty disposition is the single line `Applied: none` (likewise `Deferred: none`, `Rejected: none`), so all three prefixes are always present.

`skills/brainstorming/SKILL.md` gate template: replace the comma-joined `Applied: <cluster -> edit>, ...` lines with "one `Applied:` / `Deferred:` / `Rejected:` line per item, exactly as returned by roasting-the-spec". The commit-body instruction is unchanged.

`agents/spec-council-synthesizer.md` is unchanged.

### 5. Performance bin sections

`src/bins/gauntlet-performance.mjs` becomes the CLI entry (args, corpus loading, `--since`, dedup, `skipped`, output assembly) importing `src/bins/performance/runs.mjs`, `versions.mjs`, `council.mjs`. `loadRecord` returns `{ row, council }` with `row` unchanged and `council = derived.council ?? null`. Each section exports `{ key, aggregate(entries, opts), renderText(agg) }` over the post-filter `{ row, council }[]`; `runs` and `versions` read `.row`. Text: sections in order separated by one blank line, then `skipped:` lines; the `rows.length === 0` path keeps today's single `no records found` line and prints no sections. JSON: `json[key]` per section; `runs` / `by_version` are byte-identical to today; `council` is added. esbuild bundles the imports; `bin/gauntlet-performance.mjs` stays one file.

`council.aggregate`: entries with a `council` block. Roster key = sorted member model keys. Group by roster, most recent roster first (entry order already used by `runs`). Per roster: `runs`, per-member sums of every counter plus `unique_applied_nonminor_per_run` = `(sum unique_applied.blocker + major) / runs`, per-chair summaries (one per distinct chair model within the roster: `runs`, `avg_clusters`, `avg_members_reported`, `retried_runs` where `dispatches > 1`), and `flags`.

Flag rule, evaluated only when the roster has `runs >= 5`:

- `low_unique_applied` - member's `unique_applied_nonminor_per_run < 0.2` (fewer than one unique-and-applied blocker or major per five runs). Unique minors never keep a member.
- `high_rejection` - member's rejected share `sum(rejected) / sum(total) > 0.5` while another member on the roster has share `< 0.25`. Members with `sum(total) === 0` have no share.

Flag details always include the member's `total` so an attribution gap (all-zero) is visible next to the verdict.

`council.renderText`:

```
council
roster (6 runs): p/alpha:xhigh, p/beta:high, p/gamma:high
  member          total   unique  applied  uniq_appl  deferred  rejected  uniq_appl_nonminor/run
  p/alpha:xhigh   3/8/4   1/2/1   3/6/2    1/2/0      0/1/1     0/1/1     0.50
  ...
  chair: p/chair:medium - 4 runs, avg 6.5 clusters from 2.8 members reported, retried in 1
  chair: p/other:high - 2 runs, avg 9.0 clusters from 3.0 members reported, retried in 0
  flag: p/gamma:high - 0.00 unique-and-applied blocker/major per run in 6 runs (total 1/3/5)
  flag: p/gamma:high - rejected 62% vs p/alpha:xhigh 18% (total 1/3/5)
roster (2 runs): ...
  not enough runs to assess (2 of 5)
```

Cells are `blocker/major/minor`. With no entry carrying a block the section prints `council` and `no council data in selected records`. JSON: `council: [{ roster: string[], runs, members: { [model]: { dispatches, total, unique, applied, unique_applied, deferred, rejected, unique_applied_nonminor_per_run } }, chairs: [{ model, runs, avg_clusters, avg_members_reported, retried_runs }], flags: [{ member, rule, detail }] }]`, `[]` when no data.

### 6. Performance skill reply

`skills/gauntlet-performance/SKILL.md` `## Reply` gains one council block after the cornerstones, gated independently of the version sample gate: when the CLI's `council` array is empty, the block is the single line `council: no data`; when the most recent roster has fewer than 5 runs, `council: <roster> - not enough runs to assess (N of 5)`; otherwise one line per flag (the recommendation for roster changes) and, when an older roster exists, one line comparing the two rosters' `unique_applied_nonminor_per_run` and rejected share. Rosters are compared as groups, never a member across rosters. The reading guide states the consolidated-severity caveat.

### 7. Seal and finish

`gauntlet-telemetry-seal` reads the record through `parseRecord` and re-serializes it when sealing, so `derived.council` must survive `parseRecord` -> `serializeRecord`; one test in `bin/gauntlet-telemetry-seal.test.mjs` covers a sealed record.

## Errors and edges

- Chair report with no `^consensus:` line - not parsed; the dispatch is counted; a retry that succeeds replaces clusters.
- Audit missing a prefix, an item missing an attribute, an unresolved slug, or a cluster/audit multiset mismatch - nothing written, `councilPending` kept; old skill versions produce no block rather than a skewed one.
- Audit lines with no `councilPending.chair.clusters` (worker path, user pasting old text) - ignored.
- One slug resolving to two models (misconfigured duplicate member) - `resolveMembers` returns `null`, nothing written.
- Session resume between chair result and audit - `councilPending` is in-memory and lost; no block for that run. Accepted.
- Thinking-suffix change on one member - a new roster; uniqueness is roster-relative by design. A chair-only change stays in the same roster and shows as a second chair line.
- Record from before this change - no `derived.council`; absent from the section; the `runs` column still projects `personas.spec-council-member.dispatches`.

## Testing approach

Model strings in `extensions/`, `skills/`, `agents/`, `README.md` use neutral names (`p/alpha:high`) because `scripts/model-literal-lint.mjs` scans them; real names stay in `bin/` fixtures and `doc/`.

- `extensions/lib/telemetry-council.test.ts` (added to `scripts/ci.mjs`): slug and `memberSlugOf` (plain and `retry/` paths); `normalizeRaisedBy` on `member-0-x`, `x.md`, raw `p/x`; chair parse with `—` and `-` separators, `resolved:` bullets ignored, missing `consensus:` -> `null`, bullet without attribute -> `null`, empty `clusters:`; audit parse for all three dispositions, over-spec cut, open question, `none` bodies, leading `- `, missing prefix -> `null`, missing attribute -> `null`; `resolveMembers` with a retried member and an ambiguous slug; `buildCouncil` against the section 3 fixture (invariant `total = applied + deferred + rejected`, zero-counter member present), and `null` for an unresolved slug, an extra audit item, a missing disposition.
- `extensions/telemetry.test.ts` (existing dependency-injected harness): member results + chair result + assistant audit in `brainstorm` writes `derived.council` to disk and it survives a second `writeRecord`; same sequence in `plan` writes nothing; failed chair (`isError: true`) then successful retry gives `chair.dispatches: 2`; audit with incomplete items writes nothing and a later complete audit writes; `phase_tracker reset` clears `councilPending`; a second member batch after a chair supersedes the first.
- `extensions/lib/telemetry-record.test.ts`: `derive()` carries `council`; round-trip with and without the block.
- `bin/gauntlet-performance.test.mjs`: corpus with one roster of 6 runs firing both flags and two chair lines, one roster of 2 runs printing `not enough runs to assess (2 of 5)`, `--since` excluding a roster, JSON shape; a corpus without council data prints `no council data in selected records` and `council: []`; existing runs/by-version assertions unchanged; `runs` JSON byte-identical.
- `bin/gauntlet-telemetry-seal.test.mjs`: a record with `derived.council` survives sealing.
- `npm test` covers bin bundle freshness (`npm run build:bins`), skill lint, `pi.settings` and model-literal bans.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` (telemetry record `derived.council` block and completeness rule; performance report `council` section and flag rule), `README.md` (the `gauntlet-performance` paragraph enumerating report sections), `CHANGELOG.md`
- Derived / memory docs invalidated: none

## Out of scope

- Raw pre-dedup member finding counts (member files are walled off from the parent and deleted).
- Any chair quality score; chair lines are descriptive.
- User reverts at the gate; `applied` means the parent applied it.
- Councils run by shape-ticket or amend-class reviews.
- A telemetry tool for skills to push structured data; the gate message is the contract.
