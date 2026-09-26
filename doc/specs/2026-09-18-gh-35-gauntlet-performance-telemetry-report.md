# /gauntlet-performance: telemetry digest CLI + human-only reasoning skill

> **Superseded by:** [doc/specs/2026-09-19-gh-39-installed-bins-ship-js.md](./2026-09-19-gh-39-installed-bins-ship-js.md) - the performance bin implementation and CI pack-check sections only
> **Superseded by:** [doc/specs/2026-09-25-gauntlet-bound-telemetry.md](./2026-09-25-gauntlet-bound-telemetry.md) - `### bin/gauntlet-telemetry-salvage.mjs change` section only (mark-shipped at landing is replaced by the seal step in finishing)

**Ticket:** #35
**Goal:** A human runs `/skill:gauntlet-performance` and gets, in a short reply, one example-led recommendation and the cornerstone numbers behind it, computed from the committed run telemetry of the current repo (plus any repos named by path). Landing a branch whose recorder lost its binding still leaves the telemetry record `status: shipped`.

## Problem

Nine schema-1 telemetry records exist today (pi-gauntlet 3, gridstrong 5, customer-ops 1; versions 5.8.0 x1, 5.9.1 x7, 5.11.0 x1). Nothing reads them. Two of the nine still say `status: in_progress` although their runs landed on `main`: the recorder binds a record on `session_start` only from a replayed spec write or `plan_check` pass (`extensions/telemetry.ts:423-437`), and later only on a spec write/edit or a plan read (`telemetry.ts:516-532`); a later session that does none of these before shipping never rebinds, so `status: shipped` / `shipped_at` (`telemetry.ts:680-681`) is never written. Such a record is truncated at the last event its bound session saw.

### Deviations from #35 (accepted by the user in questionary)

| #35 said | This spec does | Why (user answer) |
|---|---|---|
| >= 10 real runs before starting | start with 9 | "9 is enough" |
| cross-repo aggregation out of scope | `--dir <path>` (repeatable) adds repos; default = current repo | "on default scans current repo only unless pointed to other repo with path. this gauntlet uses different repo to properly observe different use cases" |
| default = installed pi-gauntlet version | default = all versions, grouped by version; `--since` narrows | chose option 1 "default all versions, `--since` narrows" over option 2 "installed version, `--all-versions` widens" |
| skill never writes files | writes a markdown report only when the user picks the render action | "report should be rendered and write only if requested" |
| Node built-ins only | `yaml` (already the package's only runtime dependency) | hand-rolled YAML is the bigger risk |
| threshold rules, `## gauntlet-performance` overrides section, author handle mapping | none | chose "CLI parses/retrieves, LLM makes reasoning"; no code-side judgement means no thresholds |
| "fix-round rate" | `gates.fix_round_grants` per run, named as the proxy in output | "granularity at CR level was impractical so we need to use fix round grants as proxy" |
| mandatory 4-item action menu | numbered menu, max 3 items | chose option 2 "keep compact numbered menu (3 items max)" over option 1 "drop the menu" |
| model trends | per-run distinct model list + per-version model tally in the digest; the LLM reads trends from it | kept; the skill cannot open YAML, so the digest carries the identities |

## Decisions

1. **CLI parses, LLM reasons.** `bin/gauntlet-performance.mjs` reads records, prints a per-run digest and per-version aggregates. It contains no recommendation rules, thresholds, or prose.
2. **Corpus = current repo by default.** `--dir <path>` adds a repo root or a telemetry dir; no sibling scan, no settings key.
3. **All versions by default**, grouped by `versions.pi-gauntlet`; `--since <version>` drops older records.
4. **Truncated records get finished at landing by salvage**, chosen as option 1 ("extend salvage, which already runs on every landing path") over option 2 ("fix the recorder rebind") with the user's rider "no new machinery. fix what is broken not layer over layer": `gauntlet-telemetry-salvage.mjs` stamps `status: shipped` + `shipped_at` on a record that is `in_progress` **and has no `derived.phases.ship`** when the branch lands. No new field; truncation stays visible from the missing phases.
5. **The two already-landed unfinished records are backfilled by hand** (one commit each on the owning repo's `main`): pi-gauntlet's `2026-09-17-gh-37-worktree-by-path.yaml` in this worktree; gridstrong's `2026-09-17-E-2570-ser-ascii-capabilities.yaml` by the user (outside this repo). `shipped_at` = the landing commit's author date.
6. **Reply shape is fixed:** recommendation with its example run first, 3-5 cornerstone facts, then a numbered menu of at most 3 actions.
7. **Human-only skill:** `disable-model-invocation: true`.

## Design

### `bin/gauntlet-performance.mjs`

Exported in `package.json#bin` as `gauntlet-performance`. Imports: `yaml`, `node:fs`, `node:path`, `node:os`, `node:child_process` (git toplevel), `../extensions/lib/gauntlet-settings.ts` (`mergeGauntlet`, `resolveTelemetry`). It re-implements salvage's two-layer settings read (preset `$PI_CODING_AGENT_DIR/settings.json` then `<toplevel>/.pi/settings.json`) - salvage's helper is private to a script that runs `main()` on import. Exit 0 on every outcome; usage errors exit 1 with a one-line stderr message.

Arguments:

| Flag | Meaning |
|---|---|
| `--dir <path>` (repeatable) | Extra corpus. If `<path>` is a git toplevel (`git -C <path> rev-parse --show-toplevel` equals it), resolve its `telemetry.dir` (default `.pi/gauntlet/telemetry`); absent dir -> `skipped: <path>: no telemetry dir`. Otherwise `<path>` itself is the telemetry dir; absent -> `skipped: <path>: not found`. Never walk a repo root. |
| `--since <version>` | Keep records whose `versions.pi-gauntlet`, compared as numeric `[major, minor, patch]`, is >= the given version. |
| `--json` | Emit the digest as JSON instead of text. |

Default corpus: the telemetry dir of the git toplevel at cwd; if settings resolution warns, print the warning to stderr and use the default dir.

**Record loading.** Recursive `*.yaml` walk under each telemetry dir. Each file: `yaml.parse`; failure -> `skipped: <file>: unparseable`; `schema !== 1` -> `skipped: <file>: schema <n>`; missing string `spec` or `run_id` -> `skipped: <file>: not a record`. Consumed fields are read defensively at this boundary: a value that is not the expected type (number, string, object) is `null`, never 0. Duplicate `run_id` across corpora keeps the first, notes `skipped: <file>: duplicate run_id`. Repo label = basename of the repo root (or of the `--dir` path). Rows are ordered by `created_at` then `run_id`.

**Per-run fields** (all from `derived`, never `events`/`accumulators`; `null` in JSON, `-` in text, when the source is absent):

| Field | Source |
|---|---|
| `run_id` | header (text shows first 8 chars) |
| `repo`, `spec` (slug = basename without `.yaml`), `version` (`versions.pi-gauntlet`, else `unknown`), `status` | header |
| `truncated` | `true` when `derived.phases.ship` is absent |
| `wall_s` | `duration_s`, but `null` when `truncated` (salvage stamps `shipped_at` without re-deriving, so the stored value is stale) |
| `phase_min` `{brainstorm, plan, implement, verify, ship}` | `phases.<p>.duration_s / 60`, per phase |
| `tokens` | sum over the five named phases (never `unphased`) of `input + output + cache_read + cache_write` |
| `cost` | sum over the five named phases of `tokens.cost` |
| `models` | distinct `phases.<p>.model` over the five named phases, sorted |
| `dispatches` | sum of `personas.*.dispatches` |
| `grants`, `reopens`, `spec_rounds`, `plan_rounds` | `gates.fix_round_grants`, `gates.task_reopens`, `gates.spec_rounds`, `gates.plan_rounds` |
| `loops`, `open_gaps` | `conformance_loops`, `conformance_open_gaps` |
| `findings` `{blocker, major, minor}` | sum over `reviews.*.findings`; `null` when `reviews` is absent, `0/0/0` when present with no findings |
| `council` | `personas.spec-council-member.dispatches`; `null` when absent |
| `ship_option`, `tests` | `gates.ship_option`, `tests.result` |

**Aggregates**, one group per `version`: `n` (all rows), `shipped` (rows with `status: shipped` and `truncated: false` - the only rows that feed statistics), `truncated` (count), then `p50/max` of `wall_s`, `tokens`, `cost`, `grants`, `reopens`, `loops` and `p50` only of `dispatches` and `findings.*` over `shipped` rows with a non-null value; `models` = tally `{model: runs}` over `shipped` rows. p50 of an even count = arithmetic mean of the two central values.

**Text output:**

```
corpus: pi-gauntlet=3, gridstrong=5   since: 5.9.0
runs (8)
run_id    repo         spec                                     version  status    wall  b/p/i/v/s min      tokens  cost   models                         disp  grants  reopens  loops  findings  council
0c49b112  pi-gauntlet  2026-09-18-telemetry-record-deliverable  5.9.1    shipped   116m  12/31/48/19/6      41.2M   12.40  gpt-6-astra:xhigh,kimi-k3      14    0       0        2      0/1/3     4
07d2838a  pi-gauntlet  2026-09-17-gh-37-worktree-by-path        5.8.0    shipped*  -     9/12/-/-/-         3.1M    0.90   kimi-k3                        3     0       0        0      -         4

by version
version  n  shipped  truncated  wall p50/max  tokens p50/max  cost p50/max  disp p50  grants p50/max  reopens p50/max  loops p50/max  findings p50 b/M/m  models
5.9.1    7  7        0          ...

skipped: <file>: <reason>
```

`shipped*` = `truncated`. Zero rows after filtering: print the `corpus:` line, then `no records found in <dirs>`, and stop.

**JSON output** (`--json`): `{ corpus: {<repo>: n}, since: string|null, runs: [<per-run fields above, full run_id>], by_version: [{version, n, shipped, truncated, wall_s: {p50, max}, tokens: {...}, cost: {...}, dispatches: {p50}, grants: {...}, reopens: {...}, loops: {...}, findings: {blocker: {p50}, major: {p50}, minor: {p50}}, models: {<model>: runs}}], skipped: [{file, reason}] }`. Absent values are `null`.

### `bin/gauntlet-telemetry-salvage.mjs` change

Stamp rule: a record is **unfinished** when `status === "in_progress"` and `derived.phases.ship` is absent. A bound session records `phase start ship` at finishing step 1, before salvage runs, so a normally bound landing is never stamped; a record stuck at `in_progress` with a ship phase is left to the recorder, which writes `shipped` on the ship command.

- **Restore path:** after `git checkout <del>^ -- <rec>` (or when using the on-disk copy), parse the record; if unfinished, set `status = "shipped"`, `shipped_at = <now ISO>`, write with `yaml.stringify` of the parsed document (no re-derive), then the existing single `git add` + `git commit`. Line: `restored <rec> from <sha> (marked shipped)`.
- **Present path** (`HEAD:<rec>` exists): if the worktree copy is missing, or differs from HEAD, or the index differs from HEAD -> untouched, existing `present <rec>` line. Otherwise, if unfinished: stamp as above, `git add -f -- <rec>`, `git commit -q -m "telemetry: mark <rec> shipped at landing" -- <rec>` (same `COMMIT_TIMEOUT_MS`); on commit failure restore the HEAD bytes, unstage, and return `restore failed <rec>: <reason>`. Success line: `present <rec> (marked shipped)`.
- **`--check`:** never writes; an unfinished record that would be stamped prints `unfinished <rec>` instead of `present <rec>`.
- `abandoned` and `shipped` records: untouched.

Consumers of the salvage vocabulary change in the same commit:

| Consumer | Change |
|---|---|
| `skills/finishing-a-development-branch/SKILL.md` outcome list | add `present ... (marked shipped)` and `restored ... (marked shipped)`; the stamp commit rides in the squash / push like any branch commit |
| `skills/gatekeep-pr/SKILL.md` `--check` at assessment | `unfinished <rec>` lands in `## Evidence` as one line, non-blocking (pre-landing `in_progress` is normal; the merge course repairs it) |
| `skills/gatekeep-pr/SKILL.md` merge course | a `(marked shipped)` line is handled exactly like `restored`: push that single `telemetry:` commit, re-fetch `headRefOid`, pass the new SHA to `--match-head-commit`. Fix-wave salvage (before the wave's push) may also produce the stamp commit; it goes out with that push |
| `doc/configuration.md` telemetry section | outcome list and the stamp rule |

### `skills/gauntlet-performance/SKILL.md`

Frontmatter: `name`, `description: Use when a human asks how gauntlet runs perform ...`, `disable-model-invocation: true`. Body imperative and minimal, under 60 lines:

1. Resolve the CLI: `<skill dir>/../../bin/gauntlet-performance.mjs`. Run it from the repo root with the user's `--dir`/`--since` arguments verbatim. If the command is missing or prints `no records found`, relay the line and stop.
2. Read the digest. Reason over it only - never open a YAML record.
3. Reply, in this order and nothing else:
   - **Recommendation** (2-4 sentences): one claim, led by the run that exemplifies it, quoting its slug, `run_id`, and the 1-3 numbers that carry the claim. Name `fix_round_grants` as a proxy when it is the evidence. If no version group has `shipped >= 2`, the recommendation is "sample too small" with the counts.
   - **Cornerstones**: 3-5 bullets of aggregate facts from `by version` (corpus size, truncated count, the p50s and model tallies that moved between versions).
   - **Menu**, numbered, at most 3: `1. render report` (asks for a target path, then writes markdown: the digest verbatim plus the reply above; asks again before overwriting an existing file), `2. open recommendation as ticket` (hands the claim and its numbers to `/skill:shape-ticket`; never creates a ticket directly), `3. drill into <slug>` (re-run the CLI with `--json`, show that run's fields).
4. Standard "Project overrides" block.

**Skill verification** (manual scenarios, run in the verify phase against this repo's corpus; pass criteria are the reply shape above):

| Scenario | Pass when |
|---|---|
| plain `/skill:gauntlet-performance` | reply = recommendation + 3-5 cornerstones + <= 3 menu items; no file written; no YAML read |
| `--since 9.9.9` | reply relays `no records found`, no menu |
| menu item 1 | asks for a path, writes exactly that file, refuses to overwrite silently |

## Errors and edges

| Case | Behaviour |
|---|---|
| Telemetry dir missing / no `.yaml` | `no records found in <dirs>`, exit 0; skill stops, no menu |
| Unparseable YAML, `schema != 1`, not a record | `skipped: <file>: unparseable | schema <n> | not a record` |
| Field with wrong type | `null` for that field only; record kept |
| Truncated record | row shown with `-` cells; counted in `n` and `truncated`; excluded from every aggregate |
| `--dir` repo root without telemetry dir | `skipped: <path>: no telemetry dir`; never walks the checkout |
| Same `run_id` in two corpora | first wins; `skipped: <file>: duplicate run_id` |
| `versions.pi-gauntlet` absent or not semver | group `unknown`; `--since` drops it |
| Salvage: `abandoned` / `shipped` / `in_progress` with `phases.ship` | untouched |
| Salvage: present but worktree or index differs from HEAD | untouched, `present <rec>` |
| Salvage: stamp commit fails | HEAD bytes restored, unstaged, `restore failed <rec>: <reason>` |
| Render target exists | skill asks before overwriting |

## Tests

`bin/gauntlet-performance.test.mjs` (`node:test`, `mkdtempSync` git fixtures, `spawnSync(process.execPath, ...)`; registered in `scripts/ci.mjs` next to the two existing bin tests). `scripts/ci.mjs` also gains: `package.json#bin.gauntlet-performance` assertion, and `bin/gauntlet-performance.mjs` + `extensions/lib/telemetry-record.ts` in the `npm pack` allowlist (salvage now imports it too). Fixtures: complete shipped record (cache-dominated tokens, `unphased` block, mixed models), truncated `shipped` record with nonzero `duration_s` and zero gates, `in_progress` record, duplicate `run_id` in a second corpus, `reviews` absent vs present-empty, malformed file, `schema: 2` file, record with `derived.gates: "nope"`. Assertions: every per-run field incl. `null`/`-` rules, `unphased` excluded, wall `-` on truncated, p50 (odd and even n)/max, `shipped`/`truncated` counts, models tally, `--since` (numeric compare, e.g. `5.10.0 > 5.9.1`), `--dir` on a repo root with and without a telemetry dir and on a bare dir, duplicate collapse, row order, `skipped:` reasons, `--json` shape, `no records found` exit 0, usage exit 1.

`bin/gauntlet-telemetry-salvage.test.mjs` gains: present + unfinished -> `status: shipped`, `shipped_at`, one new commit, line `present ... (marked shipped)`; present + `in_progress` + `phases.ship` -> untouched; present + dirty worktree copy -> untouched; restore of an unfinished record -> single commit, restored bytes carry the stamp; `--check` on unfinished -> `unfinished <rec>`, nothing changes; already-`shipped` record byte-identical.

Skill lint runs via `npm test`; the `rg -ni "jjuraszek|/Users/[^/]+" skills/` check is the manual AGENTS.md step.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (skill roster: "19 skills", six explicit-invocation names incl. `gauntlet-performance`; extensions paragraph line on salvage stamping unfinished records; bin list), `doc/configuration.md` telemetry section (salvage outcome list + stamp rule), `CHANGELOG.md` `## Unreleased` (new skill + CLI, salvage stamp, backfill, `(#35)`), `AGENTS.md` Testing sentence (new bin test)
- Derived / memory docs invalidated: none

Per `reference/documentation-impact.md` (brainstorming skill): skill bodies (`finishing-a-development-branch`, `gatekeep-pr`, the new skill) are implementation surface, not doc-impact entries.

## Out of scope

- Fixing the recorder's `session_start` rebind (root cause of truncation) - separate ticket; salvage covers the landed-record outcome.
- Thresholds, overrides section, author handle mapping from #35.
- Re-deriving anything from `events` or `accumulators`; re-running `derive()` on stamped records.
- Sibling-repo auto-discovery.

## Open questions

None.
