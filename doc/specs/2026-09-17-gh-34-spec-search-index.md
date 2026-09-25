# Spec search index: FTS5 bin plus gatherer query step (#34)

> **Superseded by:** [doc/specs/2026-09-24-gh-52-scout-predecessor-anchors.md](./2026-09-24-gh-52-scout-predecessor-anchors.md) - `files` column semantics (count -> path list) and its test

**Goal:** Give the brainstorming gatherer lexical recall over the whole spec corpus - every `doc/specs/*.md` at the repo root and one service level down - through a `gauntlet-spec-index` CLI backed by `node:sqlite` FTS5 that adds no new npm dependency, so the predecessor check opens the specs whose *bodies* match the request instead of sampling titles and Goal lines. In the same change, shrink `skills/brainstorming/SKILL.md` by moving `## Marking superseded specs` into a reference file.

Ticket: [#34](https://github.com/jjuraszek/pi-gauntlet/issues/34). Consumes the telemetry contract shipped by #33 (read-only). #35 owns telemetry analysis and any index filter flags (boundary recorded in [this #35 comment](https://github.com/jjuraszek/pi-gauntlet/issues/35#issuecomment-5717640754)).

Supersedes: none.

## Problem

`skills/brainstorming/gatherer.md:46-56` tells the scout to "list the project's spec directory, read titles and `**Goal:**` lines, open at most five whose topic matches this request". A decision recorded only inside a spec body - a rejected alternative, a schema field, a constraint - is invisible to that sample. As `doc/specs/` grows past a few dozen files across services, predecessor detection degrades to filename matching.

Verified facts the design depends on:

| Claim | Evidence |
|---|---|
| No spec-search tooling exists in the repo or is vendored | repo-wide search for `sqlite`, `FTS5`, `spec-index`: zero hits |
| `node:sqlite` is Stability 1.2 (release candidate) on Node 24.x and 26.x, never "Stable" | nodejs.org/api/sqlite.html history: "v24.15.0, v25.7.0: SQLite is now a release candidate"; 22.13.0 only dropped `--experimental-sqlite` |
| FTS5 is compiled into Node's bundled SQLite | Node 26.5.1 / SQLite 3.53.3: `sqlite_compileoption_used('ENABLE_FTS5')` = 1; `bm25()` and `snippet()` returned results |
| `yaml` is already a runtime dependency | `package.json#dependencies` = `{ "yaml": "^2.9.0" }` (added by #33) |
| Telemetry record path | `extensions/lib/telemetry-paths.ts:26` `recordPathFor`: `<dir>/<spec path with .md -> .yaml>`, default dir `.pi/gauntlet/telemetry`; one record per spec path; `status`, `shipped_at` top-level, `modified_files` optional under `derived` (`extensions/lib/telemetry-record.ts:94`) |
| Telemetry records are read from disk when present | #33 commits records with `git add -f`, but a consumer may have none yet (this tree has zero) - the index never assumes a record exists |
| pi tells the main loop where each skill lives | pi-coding-agent `dist/core/skills.js:293` emits `<location><SKILL.md path></location>` per skill in the system prompt |
| `pi install` does not put package bins on `PATH` | packages land under `~/.pi/agent/npm/node_modules/<pkg>` (`docs/packages.md`); `npx gauntlet-spec-index` from a consumer repo resolves against the npm registry (404, and the name is unregistered) |
| `## Amending an approved spec` must stay in SKILL.md | `scripts/ci.mjs:178-184` asserts it; writing-plans, subagent-driven-development, finishing-a-development-branch link `#amending-an-approved-spec` |
| Current `#marking-superseded-specs` referrers | `skills/brainstorming/SKILL.md` lines 25, 68, 276, 331; the section itself starts at line 242 |

Two ticket ACs are corrected here (accepted by the user during the questionary):

- **Node floor.** The AC asks for "the lowest Node line where `node:sqlite` with FTS5 is stable". No such line exists. We pin `engines.node` to `>=24.15.0` - the oldest LTS where Node itself labels the module release-candidate, so the API surface we code against no longer shifts.
- **Dependencies.** The AC says `package.json` "gains no `dependencies`". `yaml` is already there. The checkable form is: this change adds **no new** npm dependency; it may reuse `yaml`.

## Design

### Approach

One ESM script, build-on-query. Every invocation refreshes the index incrementally, then answers the query. There is no separate `build`/`--ensure` subcommand to forget and no coupling to the telemetry extension. Alternatives rejected: (B) `build` + `query` subcommands with the telemetry extension refreshing the index on ship - two moving parts and a stale-index failure mode when specs are edited outside a gauntlet run; (C) in-memory scoring without SQLite - drops the ticket's explicit FTS5/bm25 requirement and rescans every file on every call.

### Component 1: `bin/gauntlet-spec-index.mjs` (new)

Imports: `node:fs`, `node:path`, `node:child_process`, `node:process`, and `yaml`; `node:sqlite` is loaded with a dynamic `await import()` after the version check below. Nothing else. Registered in `package.json`:

```json
"bin": { "gauntlet-spec-index": "bin/gauntlet-spec-index.mjs" },
"engines": { "node": ">=24.15.0" }
```

`bin/` is already in `files`, so the pack allowlist is unchanged. The `bin` map is for humans who `npm install -g pi-gauntlet`; the gatherer invokes the file by path (Component 2).

**CLI surface** (v1, complete):

```
node bin/gauntlet-spec-index.mjs --query "<text>" [--limit N]
```

`--limit` defaults to 10 and must be a positive integer. No other flags; telemetry fields are output-only columns (filtering deferred to #35). Exit codes: 0 success (including zero hits); 1 usage error (missing `--query`, empty query after sanitising, bad `--limit`, unknown flag); 2 environment error (not a git repo, Node below floor, FTS5 missing, lock wait exhausted).

**Per-invocation sequence:**

1. **Runtime guard.** Compare `process.versions.node` to `24.15.0` before the dynamic `import('node:sqlite')`; below it -> stderr `gauntlet-spec-index needs Node >=24.15.0 (found <version>)`, exit 2. `engines` is advisory; this is the real guard.
2. **Repo root.** `git rev-parse --show-toplevel` from `process.cwd()`. Failure -> one stderr line, exit 2.
3. **Corpus discovery.** `<root>/doc/specs/*.md` plus `<root>/*/doc/specs/*.md` - exactly one directory level, the ticket's boundary. This is intentionally stricter than `isSpecPath` in `extensions/lib/telemetry-paths.ts:23`, which also accepts deeper paths; the helper is not reused or changed. Skip directory names `.worktrees`, `node_modules`, `build`, and any dotdir. A service directory that is a symlink is followed once (`fs.realpath` cycle guard); the stored path is always the literal root-relative POSIX path as discovered, never the realpath, so it equals the telemetry key form. Skip any file whose first line is `# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing` - a draft left behind by an aborted gather would otherwise match every later prompt on the same topic.
4. **Open or create** `<root>/.pi/gauntlet/index.sqlite` (`mkdir -p` the directory; `busy_timeout` 2000 ms; `SQLITE_BUSY` after the wait -> stderr line, exit 2). On first creation, append the line `/.pi/gauntlet/index.sqlite*` to `$(git rev-parse --git-path info/exclude)` if absent - this keeps the cache and its `-journal`/`-wal`/`-shm` sidecars out of `git status` in every consumer repo without touching the consumer's `.gitignore`, and `info/exclude` in the common git dir is shared by all worktrees of that repo. Schema:

   ```sql
   CREATE TABLE IF NOT EXISTS meta  (key TEXT PRIMARY KEY, value TEXT);
   CREATE TABLE IF NOT EXISTS files (path TEXT PRIMARY KEY, mtime_ms INTEGER, size INTEGER);
   CREATE VIRTUAL TABLE IF NOT EXISTS specs USING fts5(
     path UNINDEXED, service UNINDEXED, title, goal, headings, body,
     tokenize = 'porter unicode61');
   INSERT OR REPLACE INTO meta VALUES ('schema_version', ?);
   ```

   `schema_version` is an integer constant in the script, written on every create and rebuild. If the stored value differs, or open raises `SQLITE_CORRUPT`/`SQLITE_NOTADB`, the script deletes the file and recreates it in the same run. The index is a cache; nothing in it is authoritative.
5. **Incremental refresh**, in one write transaction (`BEGIN IMMEDIATE` ... `COMMIT`, rollback on any error). Delete `files` and `specs` rows whose path is no longer in the corpus. For each corpus file whose `(mtime_ms, size)` differs from its `files` row (or has no row): `DELETE FROM specs WHERE path = ?`, then `INSERT` the fresh row (FTS5 has no primary key and no UPSERT), then `INSERT OR REPLACE` the `files` row. Extraction: `title` = text of the first `# ` line (filename stem if none); `goal` = text of the first line starting `**Goal:**` (empty if none); `headings` = all `##`/`###` heading texts joined by newline; `body` = full file text; `service` = `root` for root specs, else the first path segment. Supersession banners are indexed as plain body text only - no status field, no parsing.
6. **Query.** Split `--query` on whitespace, drop tokens shorter than 2 characters, replace each embedded `"` with `""`, wrap each token in double quotes, join with ` OR `. Free prose therefore never reaches FTS5 as syntax. Empty after sanitising -> usage, exit 1.

   ```sql
   SELECT path, service, title,
          bm25(specs, 0, 0, 10.0, 5.0, 2.0, 1.0) AS score,
          snippet(specs, 5, '', '', '...', 12) AS snippet
   FROM specs WHERE specs MATCH ?
   ORDER BY score LIMIT ?;
   ```

   Weights: title 10, goal 5, headings 2, body 1 - the ticket's `title > goal > headings > body` order. Column 5 is `body` in the declared zero-based column order.
7. **Telemetry join** (output time only, never indexed, never part of freshness). For each hit, read `<root>/.pi/gauntlet/telemetry/<path with .md -> .yaml>` when it exists and pull `status`, `shipped_at`, and `derived.modified_files.length`. Each key is independently blank when absent; a missing file blanks all three. A YAML that fails to parse -> blank columns plus one stderr warning naming the file; the query still succeeds. The script reads exactly those three keys and owns no other part of the #33 shape.
8. **Output.** Header row then one row per hit, tab-separated, columns `score | path | service | title | status | shipped_at | files | snippet`. Every field has runs of whitespace (including tab, CR, LF) collapsed to one space before printing, so a row is always one line and splits on tab. Zero hits -> header only, exit 0.

**Deviations from #34 as filed** (each accepted in the design rounds; the user approved build-on-query and the blank-column telemetry behaviour explicitly):

| Ticket | This spec | Why |
|---|---|---|
| `--ensure` + `--query` subcommands | build-on-query only | `--ensure`'s create/refresh semantics run on every `--query`; a refresh-only flag would have no caller |
| freshness = hash of `git ls-files -s` blob IDs | per-file `mtime_ms` + `size` | no git call in the hot path; correct for tracked and untracked files alike. Known gap: a same-size replacement with a deliberately restored mtime is not detected; `git checkout`, editors, and `write` all bump mtime |
| missing telemetry -> `modified_files` from `git log --name-only` | blank columns | the gatherer consumer never reads these columns; #35 owns the fallback if it needs one |
| first/last commit date + author per spec | not stored | no v1 reader |

### Component 2: `skills/brainstorming/gatherer.md` scout template

Only the predecessor-check sentence of the scout task template (currently `gatherer.md:50-55`) changes, plus one substitution instruction in the Dispatch section. New template wording:

> Predecessor check: compose a 5-15 term keyword query from the request (topic nouns, component names, file names - not stop words; if the request is only a ticket reference, take the terms from the ticket title via the tracker CLI when one is available, otherwise use the fallback below). Run `node <SPEC_INDEX> --query '<keywords>' --limit 10` from the worktree root, keeping the keywords inside single quotes, and treat its rows as the candidate list. If the command fails, fall back to listing the project's spec directory and reading titles and `**Goal:**` lines, and write `Spec index unavailable - predecessor check used directory listing.` in your handoff. Either way open at most five candidates whose topic matches this request, and name any whose design this request replaces or amends with the section(s) affected - `Predecessor: <path>, <scope>` - or `Predecessor: none`. Judge by topic; shared file paths never decide.

The Dispatch section gains: "`<SPEC_INDEX>` is `<directory of this skill's SKILL.md>/../../bin/gauntlet-spec-index.mjs`, resolved to an absolute path by the main loop from the skill's `<location>` in the system prompt before pasting the task." This is the ticket's `node <skill-dir>/../../bin/...` form; the path is correct in the npm package layout (`skills/brainstorming/` and `bin/` are siblings under the package root) and in a local `pi install -l` checkout.

The supersession-banner sentence that precedes the predecessor check gains a pointer: "(banner contract: `reference/superseding.md`)". No new dispatch, substep, or draft section.

### Component 3: `skills/brainstorming/reference/superseding.md` (new) and SKILL.md shrink

`## Marking superseded specs` (SKILL.md lines 242-259, 2110 B) moves into `reference/superseding.md` under a `# Marking superseded specs` heading, following the existing `reference/documentation-impact.md` pattern. The body moves unchanged except for its two intra-SKILL links, which are retargeted so they resolve from the new file: `[Project Routing](#project-routing)` -> `[Project Routing](../SKILL.md#project-routing)` and "see Project overrides" -> "see `../SKILL.md#project-overrides`".

The four existing `#marking-superseded-specs` referrers in SKILL.md are retargeted to `reference/superseding.md` with their wording otherwise unchanged:

| SKILL.md line | Location |
|---|---|
| 25 | "You may" bullet under HARD CONSTRAINT |
| 68 | Checklist step 7 |
| 276 | Spec Self-Review step 4 |
| 331 | User Review Gate commit paragraph |

The section body is deleted from SKILL.md. No other SKILL.md text changes. Net effect: SKILL.md shrinks by about 1.5 KB. The verify phase records `wc -lc skills/brainstorming/SKILL.md` before and after; the after value must not exceed today's 410 lines / 37,525 bytes. This is a one-time check for this change, not a CI ratchet.

### Component 4: housekeeping

- `scripts/ci.mjs` gains assertions: `bin/gauntlet-spec-index.mjs` appears in the `npm pack --dry-run` listing; `package.json#engines.node` equals `>=24.15.0`; `package.json#dependencies` keys equal exactly `["yaml"]`; `skills/brainstorming/reference/superseding.md` exists; `skills/brainstorming/SKILL.md` contains neither the heading `## Marking superseded specs` nor the string `#marking-superseded-specs`; `skills/brainstorming/../../bin/gauntlet-spec-index.mjs` resolves from the repo root. The new unit test file is added to the explicit test list.
- `CHANGELOG.md` `## Unreleased` gains an Added bullet ending `(#34)`.

## Error handling

| Condition | Behaviour |
|---|---|
| Node below `24.15.0` | stderr line with found version, exit 2, before `node:sqlite` is imported |
| Not a git repo / `git` missing | stderr line, exit 2 |
| FTS5 missing (custom Node linked to system SQLite) | `CREATE VIRTUAL TABLE` throws -> stderr line naming FTS5, exit 2 |
| Corrupt db or schema mismatch | delete and rebuild in the same run, no exit |
| Refresh interrupted or fails mid-way | transaction rolls back; next run redoes the refresh |
| Lock not acquired within `busy_timeout` 2000 ms | stderr line, exit 2 |
| Unparseable telemetry YAML | blank telemetry columns for that row, one stderr warning, exit 0 |
| Missing `--query`, empty query after sanitising, `--limit` not a positive integer, unknown flag | usage on stderr, exit 1 |

Any non-zero exit from the scout's point of view triggers the directory-listing fallback in Component 2. The gather never blocks on the index.

## Edge cases

- Spec without `# ` title -> `title` = filename stem; without `**Goal:**` -> empty `goal`.
- Superseded specs are indexed and ranked like any other; the scout follows the banner as today.
- `README.md` or other `.md` inside a spec dir -> indexed; harmless.
- Each worktree has its own `.pi/gauntlet/index.sqlite` under its own root; caches never cross worktrees. The `info/exclude` line is shared, so the second worktree finds it already present.
- Windows: paths stored with `/` separators.

## Testing

`bin/gauntlet-spec-index.test.mjs` under `node:test`, listed explicitly in `scripts/ci.mjs`, each case in a `mktemp -d` fixture with `git init` and **no** `.gitignore`:

1. Fixture with `doc/specs/a.md` (title match), `svc-a/doc/specs/b.md` (body-only match), decoys at `.worktrees/x/doc/specs/`, `build/doc/specs/`, `apps/svc/doc/specs/` (two levels deep), and a `CONTEXT DRAFT` file -> `--query` returns `a.md` then `b.md`, `service` is `root` and `svc-a`, no decoy or draft appears, `git status --porcelain` is empty after the run, and `.git/info/exclude` contains `/.pi/gauntlet/index.sqlite*` exactly once after two runs.
2. Title-only match outranks body-only match; `--limit 1` returns one row; default returns up to 10.
3. Incremental refresh: edit one spec -> only its `files` row changes, the new term is queryable, and `SELECT count(*) FROM specs WHERE path = ?` is 1; delete a spec -> its rows are gone.
4. `meta.schema_version` set to a different value by hand -> db recreated, query still succeeds.
5. Telemetry: adding `.pi/gauntlet/telemetry/doc/specs/a.yaml` with `status: shipped`, `shipped_at`, and two `derived.modified_files` changes the next output (`status`, `shipped_at`, `files` = 2) without touching `files` rows; a record lacking `derived.modified_files` yields blank `files` with the other two populated; a malformed YAML yields blank columns, a stderr warning, exit 0.
6. Query sanitising: a keyword containing `"` and a keyword `foo"bar` both run without error and match the expected body.
7. Output framing: a spec whose title and matching body span contain tabs and newlines produces exactly one output line with eight tab-separated fields.
8. Supersession banner text is queryable as body; no output column carries a status derived from it.
9. Usage and environment errors: no `--query`, `--limit 0`, `--limit x`, unknown flag -> exit 1; run outside a git repo -> exit 2.

CI assertions listed in Component 4 cover packaging and the SKILL.md extraction. `npm test` must pass.

## Documentation impact

- Feature / user-facing docs introduced: none - the command is documented inside existing docs
- Materially amended existing docs: `README.md` (one "Spec search index" paragraph: command, what it indexes, Node floor, cache location and the `info/exclude` line); `doc/install-internals.md` (Node `>=24.15.0` floor and the `.pi/gauntlet/index.sqlite` cache); `CHANGELOG.md` `## Unreleased`
- Derived / memory docs invalidated: `AGENTS.md` routing table gains a row "Search the spec corpus -> README.md#spec-search-index"

`skills/brainstorming/gatherer.md`, `SKILL.md`, and `reference/superseding.md` are implementation surface, not doc-impact entries.

## Out of scope

Filter flags on telemetry columns, a `--json` output mode, telemetry aggregation or reports (#35), LLM summaries or embeddings, sqlite-vec/DuckDB/LanceDB, indexing non-spec documents, a committed index, git-history metadata per spec, honoring a configurable `piGauntlet.telemetry.dir` (the script hardcodes the #33 default path, as #33 left to #34), any change to the scout's code/doc recon steps, any move of SKILL.md sections other than `## Marking superseded specs`.

## Open questions

None.
