# Telemetry diff in a plain jj workspace (#51)

**Goal:** The telemetry recorder's ship-time diff step derives `derived.modified_files` and `derived.diff` in a plain Jujutsu (jj) workspace - a checkout with no `.git` directory that `checkoutOf` already resolves as `via: "jj"` - in the same record shape the git path emits, and degrades to a jj-named warning plus an intact record on any jj failure.

Ticket: GitHub #51. Supersedes [doc/specs/2026-09-17-gh-33-run-telemetry-recorder.md](./2026-09-17-gh-33-run-telemetry-recorder.md), `### Diff (computed at ship attempt)` section, plain jj workspaces only - the git rules there stay current for `via: "git"` checkouts.

## Problem

`computeDiff` (`extensions/telemetry.ts:637-662`) only knows git. In a plain jj workspace the record binds and writes (#38), but at ship the `git rev-parse --verify` probe over `origin/HEAD`, `main`, `master` fails and the record carries the misleading warning `diff omitted: no base ref among origin/HEAD, main, master` with no `modified_files` and no `diff`. `gauntlet-spec-index` reads `derived.modified_files.length`, so a jj run reads as a run that touched nothing.

Facts verified against `jj 0.42.0` in a scratch non-colocated repo that shape the design:

- `trunk()` consults remote bookmarks only and never fails to resolve under default config: with no remote bookmark it evaluates to `root()`, even when a local `main` bookmark exists. A naive `fork_point(trunk() | @)` would then return the root commit and attribute the repo's whole history to the run. A broken `revset-aliases."trunk()"` override is a `Config error`, exit 1 - it lands on the ordinary command-failure warning below.
- `jj diff` has no `--numstat`. `--stat` truncates long paths with a leading `...`; `-T` receives `TreeDiffEntry` (path and status, no line counts). The only per-file added/removed source is the `--git` patch.
- Every plain `jj` command snapshots the working copy into `@`. The recorder rewrites `<dir>/<spec>.yaml` at each checkpoint, so at ship `@` holds the record and is not empty; `~ empty()` would count it as a revision (probed: two real revisions plus a record-only `@` gives `3`).
- `ui.color = "always"` wraps `-T` and `--git` output in ANSI escapes; `diff.git.show-path-prefix = false` drops the `a/`/`b/` prefixes. Both are ordinary user config and both break parsing unless the commands pin their output format.

## Acceptance criteria

Ticket #51, `## Acceptance Criteria`, rows verbatim:

- [ ] Positive case: a test fixture simulating a plain jj workspace (git rev-parse fails, `jj root` resolves) with a known history - e.g. 2 revisions past the base touching `src/a.ts` (+10/-2) and `test/a.test.ts` (+5/-0) - ships a spec and the record carries `derived.modified_files: [src/a.ts, test/a.test.ts]` and `derived.diff` with the fixture's base id, `commits: 2`, and bucket totals matching those counts, in the same shape the git path emits.
  in-scope
- [ ] Negative case: a plain jj workspace fixture where `trunk()` does not resolve ships a spec; the record has no `derived.diff` and no `derived.modified_files`, and the ship-time warning names jj (e.g. `diff omitted: jj trunk() unresolved`), not `no base ref among origin/HEAD, main, master`.
  in-scope
- [ ] Both cases are unit tests in `extensions/telemetry.test.ts` using the injectable `deps.jj` hook (no real jj binary required); the existing git-path diff tests pass unmodified.
  in-scope
- [ ] `doc/configuration.md`'s telemetry record paragraph states that `modified_files` and diff buckets are derived in plain jj workspaces as well as git checkouts.
  in-scope

The second row's "`trunk()` does not resolve" is read as: the base revset in Design step 1 prints empty stdout - `trunk()` is `root()` and no local `main`/`master` bookmark exists. The row's warning text is an `e.g.`; the exact string is chosen in Warnings and names the real condition.

## Design

### Constraints

- jj support is supplementary. The git path (`via: "git"`, which includes colocated jj+git checkouts) is byte-for-byte unchanged in behavior, warnings, and tests.
- Nothing in the jj arm throws past `computeDiff`. A missing binary (ENOENT), a timeout, a nonzero exit, an empty base, an unparseable patch, or an unparseable count each produce exactly one warning, leave `derived.diff` and `derived.modified_files` absent, and the record is still written at ship. Both fields are assigned together, after every step has succeeded.
- No new settings key, no new module. `extensions/lib/telemetry-paths.ts` gains one pure function; because `src/bins/gauntlet-telemetry-salvage.mjs` imports from that file, the implementation runs `npm run build:bins` and commits the regenerated `bin/*.mjs` bundles if they change (AGENTS.md "Testing").

### Ship trigger in a jj workspace

`shipAttempt` runs on a recognized git ship statement (`git merge --squash`, `git push`, `gh pr create`) or through `onShipKeep` when `phase_tracker` completes `ship` (`extensions/telemetry.ts:408, 688-691`). `jj git push` is not a ship statement, so in a plain jj workspace the diff is computed through the keep path. The positive test drives that path.

### Runner

`realJj(args, cwd)` sits beside `realGit` in `extensions/telemetry.ts`: `execFile("jj", args, { cwd, timeout: 10_000 })`, resolving to the existing `GitResult` shape `{ code, stdout, stderr }`. It never rejects: on error it resolves with a nonzero `code` and `stderr.trim() || err.message` as `stderr` - `execFile` passes `stderr` as `""` on ENOENT, so `realGit`'s `stderr ?? err.message` pattern would lose the reason. `realDeps.jj = realJj`, so production `checkoutOf` receives it too (replacing the `jjSync` default, which discards stderr) and the test harness's `deps.jj` hook drives both detection and diff with one stub. `Deps.jj` is optional and already typed `GitResult | Promise<GitResult>`; `computeJjDiff` uses `deps.jj ?? realJj`, and the stale comment on `Deps.jj` ("production resolves plain jj workspaces via jjSync") is updated.

### Dispatch

`computeDiff(snap: SettingsSnapshot)` is a closure over `record`, `toplevel`, `currentDir`, and `checkoutVia`; it keeps that signature and its single caller `shipAttempt`. Its current body moves verbatim to `computeGitDiff(snap)`; `computeDiff` selects `computeJjDiff(snap)` when `checkoutVia === "jj"`, otherwise `computeGitDiff`.

### jj arm

Three commands run in order against the bound `toplevel`, all with the global `--color=never` flag; each later step runs only if the previous one succeeded (`code === 0`). The commands snapshot the working copy (default jj behavior, kept on purpose: the diff must see the latest record write, and the count revset below is what excludes it). Let `<dir>` be `snap.telemetry.dir` (repo-relative, default `.pi/gauntlet/telemetry`).

1. **Base.** With `M` = `coalesce(trunk() ~ root(), present(main), present(master))`:

   `jj --color=never log -r 'fork_point(M | @) ~ root() & ::M' --no-graph -T 'commit_id ++ "\n"'` (with `M` expanded inline). `base` is the first stdout line, trimmed. `& ::M` makes the result empty, not `@`, when `M` is empty. Empty stdout is the no-mainline case. Probed: local `main` only -> `main`'s id; no bookmark and no remote -> empty, exit 0; `M` on a remote trunk -> the fork point.
2. **Patch.** `jj --color=never --config diff.git.show-path-prefix=true diff --from <base> --to @ --git`. `parsePatchNumstat(stdout)` (new, pure, exported from `extensions/lib/telemetry-paths.ts`) returns `{ added, removed, path }[]` or `null` on a malformed patch. Rows are re-serialized into the tab-separated numstat text `aggregateNumstat(numstat, files, buckets)` consumes today, so bucket classification, the `files`/`insertions`/`deletions` keys, and binary handling stay shared with git. `rows.map((r) => r.path).join("\n")` feeds `modifiedFilesFrom(nameOnly, record.spec, currentDir)` for the same spec / `doc/plans/**` / `<dir>/**` exclusions and sorting.
3. **Count.** `jj --color=never log -r '(<base>::@ ~ <base>) & files(~glob:"<dir>/**")' --count`. `files(~glob:...)` keeps only revisions that change something outside the telemetry directory, which drops both empty revisions and the record-only working-copy commit `@` - the jj analogue of the git arm's `--invert-grep --grep=^telemetry: `. Probed: two real revisions plus a record-only `@` -> `2` (`~ empty()` gave `3`). stdout is trimmed and must match `/^\d+$/`.

On success: `record.derived.modified_files = files` and `record.derived.diff = { base, commits, buckets }` - the same keys the git arm writes. Unlike git's `<base>...HEAD`, `--to @` includes uncommitted working-copy changes; in jj the working copy is a commit, so this is the intended reading.

### `parsePatchNumstat` rules

- Input is split into blocks at lines beginning `diff --git `. Empty or whitespace-only input yields `[]`. Non-empty input whose first non-blank line is not a `diff --git ` header is malformed -> `null`.
- Within a block, lines before the first `@@` are headers; every line from the first `@@` on is hunk content. `added` counts content lines starting with `+`, `removed` those starting with `-`; a content line `----` (a removed YAML front-matter `---`) or `++text` is counted (probed: jj emits `----` for a removed `---` line). `\ No newline at end of file` is ignored.
- `path` is, in order: the `+++ b/<new>` header's path when present and not `/dev/null`; else the `rename to <new>` header (pure rename, no hunks); else, for `--- a/<old>` with `+++ /dev/null` (deletion), `<old>`; else the `diff --git a/P b/P` header where the remainder after `a/` must split as `P b/P` with both halves equal (binary or mode-only block - paths containing ` b/` stay intact). A header that satisfies none of these is malformed -> `null`.
- A block containing `Binary files ... differ` or `GIT binary patch`, and a block with no hunks, yields `0/0` and still contributes its path.
- jj reports a rename as a `rename from`/`rename to` block when it detects one, and as a `deleted file` block plus a `new file` block otherwise (both shapes observed on 0.42). The first yields the new path; the second yields both paths with full-content counts. That is a documented divergence from git's rename-detected `--name-only`; no reconciliation.

### Warnings

Emitted through the existing `warn()` channel (a `{ kind: "warning", message }` event), one per failed ship attempt, formats chosen so `gauntlet-telemetry-salvage` needs no change:

| Condition | Message |
|---|---|
| step 1 exit 0, empty stdout | `diff omitted: jj mainline unresolved (trunk() is root(); no main/master bookmark)` |
| any step nonzero exit (incl. ENOENT/timeout) | `diff omitted: jj <subcommand> failed: <first stderr line \|\| "unknown error">` where `<subcommand>` is `log` or `diff` |
| step 2 `parsePatchNumstat` returns `null` | `diff omitted: jj diff unparseable` |
| step 3 stdout not `/^\d+$/` | `diff omitted: jj log --count unparseable: <trimmed stdout>` |

A jj that prints a warning on stderr but exits 0 is a success; stderr is surfaced only on nonzero exit. The existing per-session `record written, not committed: not a git checkout` warning is unchanged.

### Out of scope

- Committing the telemetry record inside a jj workspace, and recognizing `jj git push` as a ship statement (follow-ups; the keep path covers jj today).
- Colocated jj+git checkouts (they are `via: "git"` and never enter the jj arm).
- jj versions below 0.42 beyond the graceful failure path: `fork_point`, `coalesce`, `present`, `files(~glob:)` and `--count` are assumed present; an older binary rejecting them lands on the `jj log failed:` warning.
- Multiple `fork_point` results (criss-cross merges): only the first line is used; not detected or warned.
- Any mainline symbol other than a remote trunk or a local `main`/`master` bookmark.

## Tests

`extensions/telemetry.test.ts`, existing `harness(o)` (line 23) with its `gitFail` override and the `shipGit` fixtures (lines 622-629). The `jjWorkspace: boolean` option's stub changes from "answer every jj call with the temp root" to a `shipJj` scripted by `args` (`root` keeps its current answer so the binding test at lines 286-303 passes unmodified; `log` with the step-1 revset, `diff`, and `log ... --count` each return fixture values). A `jjFail?: (args: string[], cwd: string) => GitResult | undefined` option mirrors `gitFail`, and `harness()` returns a `jjCalls` array beside the existing git call recorder.

1. Positive (AC row 1), shipped through the keep path (`phase_tracker complete ship`): `jj root` resolves, git probe fails; `shipJj` answers the base revset with a fixture id, `diff` with a `--git` patch holding exactly `src/a.ts` (+10/-2) and `test/a.test.ts` (+5/-0), and `--count` with `2` only when its revset contains `files(~glob:"<dir>/**")` (any other revset -> `3`, so a regression to `~ empty()` fails). Asserts `modified_files: ["src/a.ts", "test/a.test.ts"]`, `diff.base`, `commits: 2`, buckets `code: { files: 1, insertions: 10, deletions: 2 }`, `test: { files: 1, insertions: 5, deletions: 0 }`, and that every jj call carries `--color=never` and the `diff` call carries `--config diff.git.show-path-prefix=true`.
2. Negative (AC row 2): the base revset returns exit 0 with empty stdout -> warning `diff omitted: jj mainline unresolved (trunk() is root(); no main/master bookmark)`, no `diff`, no `modified_files`, record written.
3. `jj diff` nonzero exit with stderr -> `diff omitted: jj diff failed: <line>`.
4. `jjFail` returns an ENOENT-shaped result (`code` nonzero, `stderr: ""`) on step 1 -> `diff omitted: jj log failed: unknown error`, record written.
5. `jj diff` returns exit 0 with `not a patch\n` -> `diff omitted: jj diff unparseable`, neither field set.
6. `--count` returns `abc` -> `diff omitted: jj log --count unparseable: abc`.
7. Regression: a `via: "git"` ship fixture records zero `jjCalls`; all existing git-path assertions pass unmodified.

`extensions/lib/telemetry-paths.test.ts`: `parsePatchNumstat` cases - a plain modification; a `+++ b/sp ace.txt` header (path with spaces); a pure rename (`rename from`/`rename to`, no hunks -> `0/0`, new path); a rename reported as `deleted file` + `new file` blocks (two rows); a binary block for `dir b/icon.png` (path intact); a deleted file (`+++ /dev/null`); a hunk containing `----` and `++text` content lines; `\ No newline at end of file`; empty input -> `[]`; `garbage\n` -> `null`; a header that fits no path rule -> `null`. Fixture text captured from `jj 0.42` where the shape is observable, hand-written for the malformed cases.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` telemetry record paragraph (`modified_files` and diff buckets are derived via git in git checkouts and via jj in plain jj workspaces, using the remote trunk or a local `main`/`master` bookmark as the mainline; the jj ship trigger is the keep path; the four jj warning strings); `CHANGELOG.md` `## Unreleased`
- Derived / memory docs invalidated: none

Per `reference/documentation-impact.md`. The comment on `parsePatchNumstat` records why the patch is parsed (`--stat` truncates paths, `-T` has no line counts) and is implementation surface, not a doc entry.

## Open questions

none
