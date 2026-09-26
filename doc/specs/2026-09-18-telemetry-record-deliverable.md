# Telemetry record is a deliverable: salvage script for finish and PR gate

> **Superseded by:** [doc/specs/2026-09-19-gh-39-installed-bins-ship-js.md](./2026-09-19-gh-39-installed-bins-ship-js.md) - the salvage bin's "plain .mjs importing .ts helpers" implementation convention and its pack/test assertions only
> **Superseded by:** [doc/specs/2026-09-25-gauntlet-bound-telemetry.md](./2026-09-25-gauntlet-bound-telemetry.md) - fully

**Goal:** Make the gauntlet telemetry record (`<telemetry.dir>/<spec path with .md -> .yaml>`) a first-class deliverable that ships in the squash beside the spec, and give every landing path - finishing Option 1 (squash-merge), finishing Option 2 (push and PR), and gatekeep-pr's pre-merge step - one shared script, `bin/gauntlet-telemetry-salvage.mjs`, that detects a stripped record and restores it automatically from the last checkpoint commit, never stopping the flow.

Ticket: none (free-text origin, triaged by `/skill:chase-bug` in-session). Consumes the telemetry contract from `doc/specs/2026-09-17-gh-33-run-telemetry-recorder.md` (record path, checkpoint commits) and keeps the index consumer contract of `doc/specs/2026-09-17-gh-34-spec-search-index.md` unchanged.

Supersedes: none.

## Problem

The telemetry extension writes and pathspec-commits the record at every checkpoint (`extensions/telemetry.ts:231-248`: `git add -f -- <record>` then `git commit -- <record>`), and re-commits it on the ship push. Nothing downstream protects it. Neither `skills/finishing-a-development-branch/SKILL.md` nor `skills/gatekeep-pr/SKILL.md` contains the word "telemetry"; the only nearby guidance is "Plans are ephemeral ... ships scaffolding to main" (finishing :185-189, :287-289) and brainstorming's Worktree First (:98), which name the plan as the thing to strip and say nothing about the sibling `.pi/gauntlet/` file.

Observed failure (gridstrong PR #3396, branch `jacek/e-2444-hints-vf-conflict`, squash `78915c624e`): the record `.pi/gauntlet/telemetry/doc/specs/2026-09-17-E-2444-sungrow-hints-vf-conflict.yaml` was committed 14+ times, then deleted twice by gauntlet-driven agents:

| Deletion | Commit | Path | Stated reason |
|---|---|---|---|
| 1 | `666528b011` at 05:17:12Z, 30s before `gh pr create` | finishing Option 2 plan-strip step, widened to the YAML | "Strip ephemeral plan and telemetry scaffolding" |
| 2 | `454a62b291` at 06:45:39Z, inside the gatekeep-pr fix window | gate fix commit (a11y fix) | "main tracks no files under `.pi/gauntlet/telemetry/`" - true only because this was the first PR-shipped run since the recorder landed |

The extension re-committed the record between the two (`4cc999daca`, ship push), so the pushed branch had it; the head tree did not; the squash carried nothing. Consequence: `bin/gauntlet-spec-index.mjs:178-192` reads `status`, `shipped_at`, and `derived.modified_files` from disk only, so brainstorming's predecessor search sees no data for E-2444. The record was restored to gridstrong main by hand as `cf93b38d18`.

Verified facts the design depends on:

| Claim | Evidence |
|---|---|
| Record path is derivable without the extension | `extensions/lib/telemetry-paths.ts:26` `recordPathFor`: `<dir>/<spec path with .md -> .yaml>`; `DEFAULT_TELEMETRY_DIR = ".pi/gauntlet/telemetry"` (`extensions/lib/gauntlet-settings.ts`) |
| The latest checkpoint copy is always one commit behind a deletion | pathspec commits at every checkpoint (`extensions/telemetry.ts:250-255`); `git checkout <deleting-sha>^ -- <record>` restored E-2444 byte-identical to `4cc999daca` |
| A shipped bin script with a co-located test is the existing pattern | `bin/gauntlet-spec-index.mjs`, `bin/gauntlet-spec-index.test.mjs`, `package.json#bin` (:35), `scripts/ci.mjs:33,241-242,300,435` |
| Skills locate bins from their own `<location>` | `skills/brainstorming/gatherer.md`: `<directory of this skill's SKILL.md>/../../bin/gauntlet-spec-index.mjs` |
| Ship base resolution | `extensions/lib/telemetry-ship.ts:4` `BASE_REFS = ["origin/HEAD", "main", "master"]` |
| `telemetry.enabled: false` means no record and no commits | `doc/configuration.md:144` |
| Finishing Option 1 strips the plan on the primary after the squash | `skills/finishing-a-development-branch/SKILL.md:170-171`: `git -C "$PRIMARY" merge --squash "$FEATURE"` then `git -C "$PRIMARY" rm doc/plans/<plan-file>.md` on the staged index; Option 2 (:185-189) strips on the feature branch and commits |
| gatekeep-pr mutates only on a selected course | `skills/gatekeep-pr/SKILL.md:18-21`: pre-selection actions are read-only gathering, worktree provisioning, and uncommitted doc-drift edits; fix waves commit and push once per wave (:448-470); merge is `gh pr merge --match-head-commit <assessed sha>` and requires the worktree clean and synced with the remote head |
| Recorder settings come from two layers | `extensions/lib/gauntlet-settings-loader.ts:20-27`: preset `<agentDir>/settings.json` (`PI_CODING_AGENT_DIR`, default `~/.pi/agent`) under repo `<toplevel>/.pi/settings.json`, merged by `mergeGauntlet`, resolved by `resolveTelemetry` (`gauntlet-settings.ts:180`, pure, no pi import) |
| Spec-path predicate | `extensions/lib/telemetry-paths.ts:23` `isSpecPath = /(^|\/)doc\/specs\/[^/]+\.md$/` - one level under `doc/specs/`, segment-anchored |
| Recorder excludes `telemetry: ` commits from its implementation-commit count | `extensions/telemetry.ts:644`: `rev-list --count --invert-grep --grep=^telemetry: ` |
| Recorder rewrites the record on disk at every flush | `extensions/telemetry.ts:220-228` `writeRecord`; after a `git rm` the file often reappears untracked with newer content |
| Recorder bounds git calls | `extensions/telemetry.ts:71-79`: 10 s timeout per git call |
| hotfix lands no spec | `skills/chase-bug/hotfix.md:90-94`: the evidence pack replaces plan and spec - there is no record to protect |
| gridstrong overrides carry no telemetry rule | `.pi/gauntlet-overrides.md` in gridstrong: no `telemetry` anywhere; `## Finish: Squash-to-Main Deltas` and `## PR gate` add spec-reaping and self-audit only |
| Stage-skill lint bans | `scripts/stage-skill-lint.mjs:9-16`: no fenced bare `cd`, no fenced `git rev-parse --show-toplevel`, no "switch into the worktree" prose in the five stage skills |

## Design

### Components

1. **Deliverable rule (prose).** One sentence, identical in the two procedural statements of the plan-strip convention (brainstorming's Worktree First and finishing's shared strip block); Red Flags, Common Mistakes, and gatekeep-pr's fix-wave rule restate it in their own register: *The spec and its telemetry record (`<telemetry.dir>/<spec path with .md -> .yaml>`, default `.pi/gauntlet/telemetry/doc/specs/<spec>.yaml`) are deliverables and ship in the squash; only the plan is stripped.* Landing sites:
   - `skills/brainstorming/SKILL.md` Worktree First (:98).
   - `skills/finishing-a-development-branch/SKILL.md` Option 1 (the `git rm doc/plans` line, :287-289 neighbourhood), Option 2 (the plan-strip block, :185-189), Red Flags, Common Mistakes.
   - `skills/gatekeep-pr/SKILL.md` Post-selection loop, fix-wave child contract: fix waves never delete `.pi/gauntlet/telemetry/**` (or the configured `telemetry.dir`); a fix that "cleans up" the record is a defect in the fix.
   - `doc/configuration.md#telemetry`: the record is a deliverable; what the salvage script does and where it runs.
2. **`bin/gauntlet-telemetry-salvage.mjs`** (new, shipped in the tarball, `package.json#bin` entry `gauntlet-telemetry-salvage`). Plain Node ESM, no new dependency (`yaml` is not needed - the script never parses the record). It imports `mergeGauntlet`, `resolveTelemetry` from `extensions/lib/gauntlet-settings.ts` (the default dir comes out of `resolveTelemetry`), `isSpecPath` and `recordPathFor` from `extensions/lib/telemetry-paths.ts`, and `BASE_REFS` from `extensions/lib/telemetry-ship.ts` - all pure modules already in the tarball, loaded via Node's native type stripping (`engines.node >= 24.15.0`); nothing is duplicated.
3. **`bin/gauntlet-telemetry-salvage.test.mjs`** (new), run by `scripts/ci.mjs` alongside the spec-index test.
4. **`scripts/ci.mjs`**: bin-map assertion, path-resolves assertion from finishing and gatekeep-pr, tarball inclusion, and required-token probes (below).
5. **Call sites**: finishing Option 1, finishing Option 2, gatekeep-pr Phase 4 / post-selection.

### Script contract

```
node <bin>/gauntlet-telemetry-salvage.mjs --worktree <abs path> [--base <ref>] [--dir <telemetry dir>] [--check]
```

Resolution, in order:

1. **Settings.** The same two layers the recorder reads: preset `<agentDir>/settings.json` (`PI_CODING_AGENT_DIR`, default `~/.pi/agent`) under repo `<worktree toplevel>/.pi/settings.json`, each parsed as JSON (missing -> `{}` silently, the normal case for a repo without `.pi/settings.json`; unparsable -> `{}` for that layer plus one stderr warning), merged with `mergeGauntlet(preset.piGauntlet, repo.piGauntlet)` and resolved with `resolveTelemetry` -> `enabled`, `dir`. `--dir` overrides `dir`. No pi runtime import (the loader's `SettingsManager` is pi-only); the file paths and merge are the loader's, so a preset-only custom `dir` resolves identically.
2. **Base.** `--base`, else the first of `BASE_REFS` (`origin/HEAD`, `main`, `master`) that resolves. None -> `no base ref`.
3. **Specs on branch.** `git diff --name-only <base>...HEAD`, post-filtered with `isSpecPath` and to paths present in `HEAD` (a spec deleted on the branch - e.g. a reaped superseded predecessor - has no record to protect). Zero -> `no spec on branch`.
4. **Per spec.** `REC = <dir>/<spec with .md -> .yaml>`. Presence is tested against the committed tree: `git cat-file -e HEAD:REC` -> `present`. Otherwise:
   - `git log <base>..HEAD --grep='^telemetry: ' -1` empty -> `no telemetry run <path>` (the recorder never ran on this branch; nothing to restore).
   - Else `DEL = git log -1 --diff-filter=D --format=%H <base>..HEAD -- REC`. Empty -> `never written <path>` (recorder ran, but never committed this record - e.g. a rename left the old path).
   - Else, with `--check`: `stripped <path> in <DEL>`, no mutation. Without `--check`: if `REC` exists on disk (the recorder rewrote it after the `git rm`), stage that copy with `git add -f -- REC` - it is at least as new as `DEL^`'s and must not be clobbered; otherwise `git checkout DEL^ -- REC`. Then `git commit -q -m "telemetry: restore record stripped in <DEL[0:10]>" -- REC` -> `restored <path> from <DEL>`. The `telemetry: ` prefix keeps the commit out of the recorder's implementation-commit count.
   - Any git failure or timeout in the restore -> roll back only what the script did (`git reset -q -- REC`; delete the file only if the script created it from `DEL^`), leave every pre-existing index and worktree state untouched, and print `restore failed <path>: <first line of stderr>`.

Every git call runs non-interactively (`GIT_TERMINAL_PROMPT=0`, `GIT_EDITOR=true`) with a 10 s timeout (30 s for the commit, which may run hooks; `GAUNTLET_SALVAGE_COMMIT_TIMEOUT_MS` overrides the commit bound and exists only so the hanging-hook test finishes in seconds - not a user-facing knob, undocumented outside this spec). A timeout anywhere in a record's handling - detection queries included - is a `restore failed <path>: timed out`; a timed-out presence or history query is never reported as `present`, `never written`, or `no telemetry run`.

Output: one line per outcome on stdout: `<outcome> <record path>[ ...]`, or the bare outcome for `telemetry disabled`, `no base ref`, `no spec on branch`. Exit code 0 in every outcome, including `restore failed` - the script never blocks a ship; the sole non-zero exit is a malformed invocation (missing `--worktree`, unknown flag), which prints usage on stderr and exits 1 before touching the repo - the documented call sites never produce one. It never pushes; the caller owns pushing. Multiple specs on the branch each get a line; restore commits are one per record. `--check` never mutates anything and reports `stripped` where a plain run would restore.

### Call sites

Both finishing options pass `--base <base-branch>` (already resolved in finishing Step 3); gatekeep-pr passes `--base origin/<baseRefName>` (already held for its merge-base check). The `BASE_REFS` fallback serves bare invocations only.

- **Finishing Option 1 (squash-merge).** The plan strip moves onto the feature branch: Option 1 reuses Option 2's strip-and-commit block (`git -C "$WORKTREE" rm <plan>` + commit) instead of `git -C "$PRIMARY" rm` on the staged index. New order: strip plan on `$WORKTREE` -> run the script with `--worktree "$WORKTREE"` -> `git -C "$PRIMARY" merge --squash "$FEATURE"`. Any deletion the strip widened is then inside the script's detection window, the restore commit is on `$FEATURE`, and the squash's staged tree carries the record; the primary-side `rm` line is deleted. The ship completion message to the user prints the script's stdout verbatim.
- **Finishing Option 2 (push and PR).** After the existing plan strip, before `git push`: same call. Stdout in the ship completion message.
- **gatekeep-pr.** Two hooks, both on the provisioned PR worktree, respecting the consent boundary (nothing commits before a course is selected):
  - *Assessment (Phase 4)*: run with `--check`. `present` / `no telemetry run` / `never written` land in `## Evidence` as one line. `stripped <path> in <sha>` mints a `P#` (blocking, source `gauntlet-telemetry-salvage`) whose drafted fix is "run the salvage without `--check`"; on authorship cells with no push row (fork PRs, report-only) the same `P#` is a non-blocking follow-up instead - the record stays recoverable from the PR head ref after merge, and blocking would violate "never stop".
  - *Every fix wave*: after the wave's fix commit(s) and before the wave's single push, run without `--check`; a `restored` commit rides that push (one push per wave is preserved), and the pushed SHA becomes the assessed head under the existing course's-own-push rule. This is the hook that catches deletion 2.
  - *Selected merge course*: run once more (no `--check`) as the course's first step. `present` -> merge as today. `restored` -> push the restore commit as part of this course (an explicit, documented exception to "push and merge are never bundled", scoped to `telemetry: restore` commits), re-fetch `headRefOid`, and pass the new SHA to `--match-head-commit`. `restore failed` -> merge proceeds, the reason is printed, and the follow-up says how to recover from the PR head ref.
- **Not a call site:** `skills/chase-bug/hotfix.md` (no spec, no record); `check-delivery` (post-merge, out of scope).

Under Claude Code (`.claude-plugin/marketplace.json`, plugin source `./`) the skill directory is the plugin's `skills/gatekeep-pr`, so the same `<skill dir>/../../bin/...` path resolves; Node is the only runtime requirement.

Skill text references the bin as `<directory of this skill's SKILL.md>/../../bin/gauntlet-telemetry-salvage.mjs`, resolved by the main loop from the `<location>` in the system prompt, exactly as `gatherer.md` does for the spec index.

### CI

`scripts/ci.mjs` gains:

- `pkg.bin["gauntlet-telemetry-salvage"] === "bin/gauntlet-telemetry-salvage.mjs"`.
- Path resolves from `skills/finishing-a-development-branch/../../bin/gauntlet-telemetry-salvage.mjs` and `skills/gatekeep-pr/../../bin/gauntlet-telemetry-salvage.mjs`.
- `bin/gauntlet-telemetry-salvage.test.mjs` in the unit-test list; `bin/gauntlet-telemetry-salvage.mjs` in the `npm pack` required-files list.
- Required-token probes: `gauntlet-telemetry-salvage.mjs` in finishing and gatekeep-pr; the phrase `telemetry record` in brainstorming's Worktree First section and in finishing's Option 1 and Option 2 blocks; inside gatekeep-pr's Post-selection loop section specifically, both `gauntlet-telemetry-salvage.mjs` and the phrase `never delete` with `telemetry` on the same line. A future edit that drops the rule fails `npm test`.
- The bin's `.ts` imports resolve inside the packed tarball (`npm pack` file list contains each imported module).

Stage-skill lint constraints apply to brainstorming and finishing edits: the call is written as `node <bin> --worktree "$WORKTREE"`, no `cd`, no `--show-toplevel`.

### Error handling and edge cases

| Case | Behaviour |
|---|---|
| `telemetry.enabled: false` after `mergeGauntlet` (a repo `telemetry` block replaces the preset's whole block, exactly as for the recorder) | `telemetry disabled`, exit 0, nothing else runs |
| No `isSpecPath` file added/modified vs base | `no spec on branch`, exit 0 |
| Record in `HEAD` tree | `present <path>`, no commit (an indexed-but-uncommitted copy is not `present`; it is committed as-is when index and worktree agree - `git diff --quiet -- REC` - and otherwise, worktree missing or differing, the state is user-owned and the outcome is `restore failed <path>: staged copy differs from worktree` with no mutation, since `git commit -- REC` would record the worktree, not the staged blob) |
| Record deleted once or several times | restore from the latest deletion's parent (`git log -1` picks the newest), one commit |
| No `telemetry: ` commit on the branch | `no telemetry run <path>`, exit 0 - the recorder never ran here (non-gauntlet branch, or disabled at run time) |
| Recorder ran, no deletion of this path found | `never written <path>`, exit 0 |
| Deleted in the commit that introduced it (the introducing commit rewritten without it) | git records no `D` entry whose parent lacks the blob, so no deletion is found -> `never written <path>`, exit 0, nothing left behind (stated limitation: the copy is unrecoverable from history) |
| Record present on disk but untracked (recorder rewrote it after the `rm`) | staged with `git add -f` and committed; never overwritten from `DEL^` |
| Hook rejects, git prompts, or the commit hangs | non-interactive env + timeout -> `restore failed <path>: <reason>`, exit 0; the script's own index/worktree changes are rolled back, pre-existing state untouched; the record stays recoverable from the branch ref |
| Base ref unresolvable and no `--base` | `no base ref`, exit 0 |
| PR targets a non-default branch | callers pass `--base`; the fallback is for bare invocations only |
| Several specs on the branch (supersession, multi-spec squash) | one line and, if needed, one restore commit per record |
| Custom `telemetry.dir` in the preset layer only | resolved (both layers read); `--dir` still overrides |
| `--check` | detect-only: `stripped <path> in <sha>` instead of a restore; never mutates |
| Worktree path missing or not a git checkout | `not a git worktree: <path>` on stderr, empty stdout, exit 0 - the caller proceeds; this is the one case where the script cannot help |

`derived.modified_files` semantics are unchanged: the record stays excluded from its own diff (`telemetry-ship.ts:9-16`), because #34 consumes its length as an implementation-file count.

## Testing

`bin/gauntlet-telemetry-salvage.test.mjs` builds a temp git repo per case (same style as `bin/gauntlet-spec-index.test.mjs`) with a `main` branch, a feature branch adding `doc/specs/x.md`, and a telemetry record committed at `.pi/gauntlet/telemetry/doc/specs/x.yaml`. Cases:

- record present -> `present`, no new commit.
- record deleted once -> `restored ... from <sha>`, file byte-identical to the pre-deletion blob, exactly one new commit whose only path is the record and whose subject starts `telemetry: `.
- record deleted, re-added with new content, deleted again -> restores the second (newest) content.
- record deleted, then rewritten on disk untracked with different content -> the on-disk copy is committed, not `DEL^`'s.
- record deleted and staged again but uncommitted, index == worktree -> not `present`; the staged copy is committed; staged copy with the worktree file missing, or differing from it -> `restore failed ... staged copy differs from worktree`, index and worktree untouched, HEAD unchanged.
- deleted in its introducing commit (amended away) -> `never written`, no file, clean index, HEAD unchanged.
- branch with no `telemetry: ` commit and no record -> `no telemetry run`, no new commit.
- branch with a `telemetry: ` commit for another path, no deletion of this one -> `never written`.
- `--check` on a stripped record -> `stripped ... in <sha>`, no commit, no file.
- repo `.pi/settings.json` with `telemetry.enabled: false` -> `telemetry disabled`, nothing else on stdout.
- preset-only `telemetry.dir: "custom/dir"` (via `PI_CODING_AGENT_DIR` pointing at a temp agent dir) -> record resolved under `custom/dir` with no `--dir`; `--dir` overrides both layers.
- rejecting `pre-commit` hook -> `restore failed`, index and worktree identical to before the run.
- hanging `pre-commit` hook (`sleep 60`) -> `restore failed ... timed out` within the bound, state rolled back.
- two specs on the branch, one record stripped -> two lines, one restore.
- spec deleted on the branch -> skipped, `no spec on branch` when it was the only one.
- unresolvable base without `--base` -> `no base ref`; `--base main` works.
- `--worktree` pointing at a non-git directory -> stderr `not a git worktree:`, empty stdout.
- exit code is 0 in every case above; with a bare remote configured, every remote ref is unchanged after a successful restore (the script never pushes).
- finishing Option 1 integration fixture: feature branch with spec, plan, record, and a widened strip commit -> after strip-on-branch + salvage + `merge --squash`, the staged primary tree contains the record and not the plan.

`npm test` (`scripts/ci.mjs`) runs the test file and the new assertions listed under CI.

## Documentation impact
- Feature / user-facing docs introduced: none (`doc/configuration.md#telemetry` owns the topic)
- Materially amended existing docs: `doc/configuration.md` (telemetry section: the record is a deliverable that ships in the squash; `gauntlet-telemetry-salvage` contract, outcomes, call sites, the two-layer settings read and `--dir`); `README.md` (the "one committed YAML record per gauntlet run" line gains "ships in the squash beside the spec; finish and the PR gate restore a stripped record"); `CHANGELOG.md` `## Unreleased`
- Derived / memory docs invalidated: `AGENTS.md` Testing sentence (add the salvage unit test to the `scripts/ci.mjs` list); gridstrong `.pi/gauntlet-overrides.md` needs no change (it never mentions telemetry; the package default now protects the record)

`doc/configuration.md` also documents the finishing Option 1 order change (plan strip on the feature branch) and the gate's push-with-merge exception for `telemetry: restore` commits. Materiality bar: `skills/brainstorming/reference/documentation-impact.md`. Skill bodies (`brainstorming`, `finishing-a-development-branch`, `gatekeep-pr`) are implementation surface, not doc-impact entries.

## Out of scope

- A runtime guard in `extensions/telemetry.ts` that fights `git rm` (rejected: new machinery instructing agents through side effects instead of text).
- Index fallback to git history for records missing on main (the salvage keeps them on main in the first place).
- Restoring records for gridstrong runs other than E-2444 - none exist (`git log main --grep='^\* telemetry:'` matches only #3396).
- Any change to `derived.modified_files`.

## Open questions

None.
