# Plan checker: `Delete:` Files entries and fail-closed unknown kinds (gh-140)

**Ticket:** jjuraszek/pi-gauntlet#140
**Goal:** A plan task can declare `- Delete: <path>` as write ownership that needs no existing file, the checker reads a task's whole Files list in one scan so an unrecognized line is a finding instead of a silent cut-off, and rebuild restores a failed task's Delete paths from the wave base.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** `doc/specs/2026-08-31-gh-19-deterministic-plan-checker.md` - superseded for the "Plan parser" `**Files:**` block bullet only; `doc/specs/2026-10-30-slim-subagent-dispatch.md` - superseded for the path-partition sentence of "Rebuild (the one automatic path)" only. `doc/specs/2026-09-10-gh-28-task-test-contract.md` - superseded for the `^- \w+: ` pattern inside its `**Tests:**` Position sentence (`:21`) only; the position rule itself (the heading directly follows the last Files line, `Delete:` bullets count) stays live.

## Problem

A plan task lists the files it creates, modifies, or runs as tests. `plan_check` validates that list when the plan is written and again during implement-local maintenance. A task has no way to declare a deletion, although the plan overview in `skills/writing-plans/SKILL.md` already shows a Delete group.

Observed on the checker at `1aba5977` (pi-gauntlet 8.4.6) with an in-memory `checkPlan` run:

| Files list of one task | Result today |
|---|---|
| `- Modify: never-existed.ts` | `paths-exist`: `Modify: path "never-existed.ts" does not exist` |
| `- Delete: a.ts`, `- Modify: never-existed.ts` (tests `- none:`) | zero findings, manifest `files: []` |
| `- Modfy: never-existed.ts`, `- Modify: never-existed.ts` | zero findings, manifest `files: []` |
| `- Delete: a.ts`, `- Test: t.test.ts` plus its command | `tests-block`: `segment not anchored: "node --test t.test.ts" names no Test: path of this task` |

Root cause: two loops read the same lines with different rules. The entry loop (`extensions/lib/plan-check.ts:229-244`) matches `^- (Create|Modify|Test): (.+)$` and stops at the first other line. The `**Tests:**` position loop (`:263-270`) accepts every `^- \w+: ` line. An unrecognized line therefore hides itself and every later entry from `paths-exist`, `wave-file-disjointness`, and the manifest while still counting as a Files line for the Tests heading. The checker's own contract promises that malformed structure never passes silently (`doc/specs/2026-08-31-gh-19-deterministic-plan-checker.md:146`).

The second half of the problem is ownership of a removed file. Listing it as `Modify:` records the owner but `paths-exist` requires the file to exist, so the saved checker run fails once the implementer has removed it. The ticket reports one task with 36 such entries and 36 findings.

Constraints carried from the ticket body and its reporter note:

- `Delete:` is write ownership in its owning task, takes a literal path, and has no existence requirement. `Modify:` existence validation is not weakened.
- The manifest kind is exactly `Delete`.
- An unknown kind is reported only inside a task's Files list and never suppresses later entries or their findings.
- Maintenance (including after an amendment) never restores a removed path, changes other task-owned source, or rewrites the task's Files entries. Rebuild is the one operation that restores Delete paths.
- Reporter-note pointers: entry parser `extensions/lib/plan-check.ts:224-244` (the pattern and its `break` at `:235-236`), kind type `:32-37`, `paths-exist` `:875-922`, overlap roles `:969-977` and `:997-1007`, manifest labels `:1376-1386`, maintenance re-run `:1337`.

Premises:

- Supported: the three ticket claims reproduce as tabled above. A parsed Delete entry needs no new overlap code: `fileEntries` (`:969-977`) maps every non-`test` kind to role `write` and compares literal paths by string.
- Corrected: the rebuild row cannot append Delete paths to the existing restore command unfiltered. In a scratch repo `git restore --source=<base> --staged --worktree -- <paths>` exits 1 and restores nothing when one listed path is absent at `<base>` (`error: pathspec 'never.txt' did not match any file(s) known to git`), and the ticket allows a Delete path that never existed. `git ls-tree -r --name-only <base> -- <paths>` prints only the paths present at `<base>` and exits 0; restoring that output exits 0.
- Unverified: the consumer incident (Task 6, 36 findings) has no recorded artifacts (`source: ... none (not recorded at filing)`); the synthetic repro stands in.
- Implicit dependency not checkable as written: rows 9 and 10 observe a plan-writer run that ends in a passing checker. `eval/writing-plans` is `kind: text` (no tools), so a replay cannot call `plan_check`. The user chose split proof (Design, "Proof of rows 9 and 10").
- Implicit dependency missing, harmless: `node_modules/@earendil-works/pi-coding-agent` is absent in the worktree; `plan-check.ts` imports no pi runtime and its tests run under `node --test`.
- Spec and docs index queries returned no rows; the predecessors come from code recon.

User constraint: complexity and conditionality of plan reading stays low. No reader of a plan (the checker's Files scan, the plan contract and task template, the wave loop's independence check and rebuild, the implementer prompt) gains a kind-specific branch that an existing rule can carry.

Framing: kept

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#140, "Acceptance Criteria", rows verbatim:

- [ ] An otherwise valid plan whose task lists `- Delete: <path>` for an existing file passes checker validation, and passes again unchanged after the file is removed.
  in-scope
- [ ] The manifest the checker returns for that plan lists the Delete path under its owning task with kind `Delete`, together with every Files entry written after the Delete line.
  in-scope
- [ ] A task whose Files list has a Delete line followed by a Modify entry for a missing file fails checker validation with a paths-exist finding for that Modify entry.
  in-scope
- [ ] An otherwise valid plan declaring Modify ownership for a missing file still fails checker validation with a paths-exist finding.
  in-scope
- [ ] When same-wave tasks declare Delete and Create, Modify, Test, or another Delete for the same literal path, checker validation rejects each conflict, wherever the Delete line sits in its task's Files list and whether or not the file still exists.
  in-scope
- [ ] A line `- <Kind>: <path>` inside a task's Files list whose kind the checker does not recognize (for example `- Rename:` or `- Modfy:`) fails checker validation with a finding naming that line; a Modify entry for a missing file listed after it also produces its paths-exist finding.
  in-scope
- [ ] A `- none:` tests declaration and other `- <word>:` lines outside the Files list produce no unknown-kind finding.
  in-scope
- [ ] A `- Delete:` entry whose path is a glob pattern fails checker validation with a finding naming that entry.
  in-scope
- [ ] Given an otherwise valid plan whose declared Delete paths have been removed, running the plan-writer's maintenance pass, including after a plan amendment, ends with a passing checker result, the removed paths still absent, all other task-owned source contents unchanged, and that task's Files entries identical to before the pass.
  in-scope
- [ ] Given a fixture spec whose only change is removing one named file, the plan the plan-writer produces lists that file as Delete in exactly one task and under no Modify entry, and that plan passes the checker.
  in-scope
- [ ] The plan contract and the plan task template name `Delete:` among the Files entry kinds and state its rules: write ownership, literal path, no existence requirement.
  in-scope
- [ ] Rebuilding a failed task that declares Delete paths starts the new attempt with those paths restored to their wave-base content.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-140-plan-check-delete-entries
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`); scoped `node --test extensions/lib/plan-check.test.ts scripts/wave-review.test.mjs`; selected eval samples through `node eval/run.mjs <target> <sample>` as bounded in Design "Actions"
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: eval/README.md
Rules: .pi/gauntlet-overrides.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9, AC 10, AC 11, AC 12
design: owns `extensions/lib/plan-check.ts`, `extensions/lib/plan-check.test.ts`, `skills/writing-plans/reference/plan-contract.md`, `skills/writing-plans/SKILL.md`, `skills/subagent-driven-development/SKILL.md`, `scripts/wave-review.test.mjs`, `eval/writing-plans/`, `eval/subagent-driven-development/`, `CHANGELOG.md`, and the three predecessor spec banners; observable outcomes are the twelve AC rows.

## Design

Approach: one Files scan, `Delete` as a plain fourth kind. Rejected: a per-kind table (must-exist is true only for `Modify` and literal-only only for `Delete`, so its columns hold one true cell each), and widening both loops in place (keeps the duplicate boundary whose disagreement is the bug).

Data flow: plan text -> parser (entries plus the Files lines that are not entries, per task) -> `files-block`, `paths-exist`, `tests-block`, `wave-file-disjointness` findings -> with zero findings the manifest carries the Delete entries -> the wave loop's independence check and rebuild read them.

### Files scan (`extensions/lib/plan-check.ts`)

The Files list of a task is the run of lines after its `**Files:**` line that match `^- [^\s:]+: ` (a bullet whose first token ends in a colon), blank lines skipped; the first other non-blank line ends it. The pattern widens the `^- \w+: ` boundary the Tests-position loop uses today (`:263-270`), so a punctuated kind such as `- Mod-ify: old.ts` stays in the run instead of ending it; a step line (`- [ ] **Step 1: ...**`) and a backticked command bullet still end it. The run has this one boundary, and the kind is validated inside the same scan.

Remove:

- the Tests-position boundary loop (`:263-270`: `lastEntry`, `p`, and the `while`); the heading lookup that follows it (`:271-276`) stays and reads the last Files line recorded by the entry loop.

Add:

- `"delete"` in `FileEntry.kind` (`:33`).
- The entry loop (`:229-244`) walks the whole run. A line matching `^- (Create|Modify|Test|Delete): (.*\S.*)$` becomes a `FileEntry` as today; the capture must hold a non-whitespace character, so `- Create: ` and `- Create:   ` are not entries while `- Create:   x` still is. Any other line in the run is appended to a new per-task list `filesUnknown: { line: number; text: string }[]` on `Task`, and the loop continues. The loop records the last line of the run for the Tests heading lookup.
- `checkFilesBlock(parsed)`, called in `checkPlan` directly after `checkPathsExist`. It emits, with check id `files-block`:
  - one finding per `filesUnknown` line: `line` and `text` are that line, `reason` is `Task <n>: Files line "<text>" is not a Create, Modify, Test or Delete entry with a path`. The one reason covers an unknown kind and a recognized kind with no path; there is no second branch;
  - one finding per `delete` entry whose path, after `stripLineSuffix`, satisfies `isGlob`: `line` and `text` are the entry, `reason` is `Task <n>: Delete: path "<path>" is a glob; Delete takes a literal path`.
- `delete: "Delete"` in the `renderManifest` label map (`:1376-1386`).

Unchanged, by design:

- `checkPathsExist` (`:875-922`) checks only `modify`, so a Delete path never has to exist.
- `fileEntries` and `checkWaveFileDisjointness` (`:969-1052`): every non-`test` kind is a writer and literal paths compare by string per `(leg, path)`, so Delete conflicts with Create, Modify, Test, and Delete on the same literal path whether or not the file exists.
- `checkTestsBlock`: its `create` / `modify` comparisons (`:515`, `:520`, `:577`, `:580`) do not concern Delete.
- A `:line[-line]` suffix on a Delete path is kept by the parser and by `renderManifest` as written, like on every other kind. `fileEntries` strips it with `stripLineSuffix` for the overlap comparison (`:971`), and the glob check above strips it the same way. The rebuild strips it at its own path boundary (Wave loop).

`plan-check.ts` is under `extensions/lib/`, so the change runs `npm run build:bins`. No bin source imports `plan-check.ts`; `git status --porcelain -- bin/` is expected to stay empty, and a regenerated bundle is committed when it is not.

### Plan contract and task template

Skill edits follow `/skill:forge-skill` authoring rules; the commit body states that they change behavior.

`skills/writing-plans/reference/plan-contract.md`:

- Heading `## Files (...)` lists `files-block` beside `wave-file-disjointness` and `paths-exist`.
- The paragraph at `:24` states the rule once, replacing the `Test` vs `Create`/`Modify` pair list: `Create`, `Modify`, and `Delete` are writers; `Test:` entries are run anchors, not ownership, so `Test`/`Test` on the same path across same-wave tasks is allowed and every other same-path pair is a conflict. `Modify:` paths must exist. A `Delete:` entry is write ownership with a literal path and no existence requirement. A file the task removes is listed as `Delete:` in exactly one task and is not also listed as `Modify:`. Any other `- <token>:` line in the Files list is a `files-block` finding.
- The removal sentence is the writer guidance AC 10 depends on. At plan time the file still exists, so a `Modify:` entry would also pass. The whole contract file is in the `eval/writing-plans` assembly; the `## File Structure` overview with its Delete group is not (`eval/writing-plans/target.json` ends the first slice at `## File Structure`).
- The `## Legs` path-resolution sentence at `:16` names `Delete:` beside `Modify:`/`Create:`/`Test:`.

`skills/writing-plans/SKILL.md`:

- The task template's `**Files:**` block (`:213-216`) gains `- Delete: \`exact/path/to/removed.py\`` after the `Modify:` line.
- One sentence after the template's closing fence, beside the `**Anchor rules.**` note, states the rules: a `Delete:` entry is write ownership with a literal path and no existence requirement, with a link to the contract's Files section. The note sits outside the fence because the parser reads everything after `- Delete: ` as the path. The contract stays the full explanation; the template note only repeats the three rules AC 11 names.

The plan-writer persona (`agents/plan-writer.md`) and the maintenance text in `skills/writing-plans/SKILL.md` (`Implement-local Baseline`, `Deterministic checker`) stay unchanged: they name no Files kind and restore no source. For a removed path that only `Delete:` entries list, `Delete:` is parsed and exempt from the existence check, so the maintenance pass has no finding to repair for it. A removed path that another task also lists as `Modify:` or `Test:` still produces a finding (Errors and edge cases, cross-wave bullet).

### Wave loop (`skills/subagent-driven-development/SKILL.md`)

Byte budget: the file is 49,971 bytes and `scripts/skill-size-lint.mjs` fails a skill file at 50,000 bytes or more. Both edits are compact in-place replacements of one sentence each; the file ends under 50,000 bytes (49,986 with the text below). No `reference/` file is extracted, so `eval/subagent-driven-development/target.json` and the eval assembly do not change.

Replace the independence sentence (`:120`, 116 -> 75 bytes):

```text
Assert pairwise-disjoint manifest `files`: only Test/Test may share a path.
```

Replace the path-partition sentence of Rebuild (`:175`), from `partition the task's manifest paths` through `(step 1 guarantees disjointness).` (466 -> 522 bytes):

```text
partition the task's manifest paths, trailing `:N[-M]` stripped. Remove every `Create` path: `git -C <worktree> rm -q -f --ignore-unmatch -- <paths>`. Restore the `Modify` / `Test` paths plus the `Delete` paths `git -C <worktree> ls-tree -r --name-only "$WAVE_BASE_SHA" -- <Delete paths>` prints, deduplicated and excluding every `Create` path: `git -C <worktree> restore --source="$WAVE_BASE_SHA" --staged --worktree -- <paths>`. Skip a command with no paths. Sibling paths are untouched (step 1 guarantees disjointness).
```

Wording shortened inside the two touched sentences to pay for the additions:

- the three-pair list `Test/Create, Test/Modify and Modify/Modify overlap`;
- the parenthetical `(including a new test file declared as both \`Create\` and \`Test\`)`; the kept `excluding every \`Create\` path` still carries its rule;
- `is removed` / `are restored from the wave base`, now imperative, with `--source="$WAVE_BASE_SHA"` naming the base.

What the Rebuild replacement binds:

- Path boundary: every manifest path the rebuild passes to `rm`, `ls-tree`, or `restore` has a trailing `:digits[-digits]` stripped first. This is one rule for all kinds, not a Delete-only branch. Parser and manifest output do not change.
- Restore set: the `Modify` / `Test` paths plus the `Delete` paths that `ls-tree` prints, deduplicated and excluding every `Create` path. A Delete path absent at the wave base is in neither set; it has no wave-base content (reading of AC 12).
- Empty lists: a command with an empty path list is skipped. A task with no Delete entries never invokes `ls-tree`, because `ls-tree -r` with no pathspec prints every file at the base and would put sibling work into the restore set. An empty final restore set never invokes `git restore`.
- The `rm` and `restore` commands themselves are unchanged.

Size check: after the edit `wc -c skills/subagent-driven-development/SKILL.md` prints a value under 50000 and the instruction-size lint in `npm test` passes. Final wording that differs from the text above stays inside the two touched sentences and inside this budget.

Wave commit, review staging, and patch integration need no change: they use `git add -A` and `git apply --index`, which name no path per kind. Repair attribution and the test gate read manifest `files` by path only.

`skills/subagent-driven-development/implementer-prompt.md` (`:19`) needs no change and gains no kind-specific rule: the implementer reads the task's Files itself, and its exported patch (`git add -A`, then a binary cached diff) carries deletions.

### Proof of rows 9 and 10

A text-replay eval cannot call `plan_check`, so each row's proof is split (user decision):

| Row | Writer half (eval sample, `eval/writing-plans`) | Checker half (`extensions/lib/plan-check.test.ts`) |
|---|---|---|
| 9 | `maintenance-after-delete`: on a Findings re-dispatch and on an implement-phase Amend-apply, the writer leaves the task's Files entries identical, runs no command that restores or recreates a removed path, and edits no other task-owned source | a plan with Delete entries passes with the paths absent (AC 1 test); the removed paths are owned only by `Delete:` entries |
| 10 | `removal-lists-delete`: for a spec whose only change removes one named file, the path appears as `- Delete:` in exactly one task and under no `Modify:` entry | a plan of that shape passes `checkPlan` |

Reading of AC 9: "otherwise valid" means the plan has no other finding after the removal. A plan where another task lists a removed path as `Modify:` or `Test:` is not otherwise valid at that point, because AC 4 keeps a missing `Modify:` path a `paths-exist` finding. AC 9 therefore binds removed paths that only `Delete:` entries list.

### Eval samples

Each sample is a `case.md` plus `expected.md` with synthetic, anonymized inputs, following `eval/README.md`. `maintenance-after-delete` carries `bundle+: agents/plan-writer.md`, as `eval/writing-plans/samples/implement-amend-from-head` does. `removal-lists-delete` carries no persona bundle: it asks for the plan Markdown as reply text, and the persona's reply contract is exactly one status line (`agents/plan-writer.md:15`), so the sample exercises the target's skill slices and plan contract, which own the Delete rule.

| Target | Sample | Must-hold facts |
|---|---|---|
| `eval/writing-plans` | `removal-lists-delete` | the removed path is a `- Delete:` entry in exactly one task; it appears under no `Modify:` entry |
| `eval/writing-plans` | `maintenance-after-delete` | Files entries of the deleting task unchanged in both passes; no restore or recreate of the removed paths; no other task-owned source edited; Delete entries neither rewritten to `Modify:` nor dropped |
| `eval/subagent-driven-development` | `rebuild-delete-paths` | Create paths removed first; the Delete path present at the wave base joins the restore set from `WAVE_BASE_SHA`; the Delete path absent there is in neither set; the `ls-tree` filter is the stated source of that split; sibling paths untouched |

Inputs of `maintenance-after-delete`, the same for the Findings pass and the Amend-apply pass:

- The removed paths are listed only as `Delete:`, in one task; no task lists them as `Modify:` or `Test:`.
- The removals are committed, or the parent's `In-flight:` input lists them, so the writer's unknown-dirty-path stop does not fire before the Delete behavior is exercised.
- The Findings pass supplies one finding from a check other than `files-block`, `paths-exist`, and `wave-file-disjointness` (for example an `anchor-resolution` finding on another task), so its repair touches no Files entry.

Both targets' `intent.md` gain a Change paragraph for this edit, the refreshed `for:` line, and the new samples' expected moves. The committed `eval/<target>/report.md` is sample-scoped evidence; the commit body names the tested samples and the partial coverage. No target-wide run.

### Actions

The only paid or external action is `node eval/run.mjs <target> <sample>` (including its `--baseline-only` form) for the three samples above, run by the implementing agent in the worktree. Inputs: the sample directory and the working-tree skill text; each invocation makes replay, judge, and confirmation model calls with the frozen models in `eval/lib/models.mjs`. Bound for the whole flow, across seed, rows, repairs, and finish: four invocations per sample, twelve in total. Design approval authorizes these runs without per-step prompts. The loop treats any action not named here as unreachable; adding one needs separate explicit authorization.

### Docs

`CHANGELOG.md` gains a `## Unreleased` heading above `## v8.4.6` with one entry ending `(#140)`: plan tasks can declare `- Delete:` entries; an unrecognized Files line is a `files-block` finding; rebuild restores Delete paths from the wave base.

## Errors and edge cases

- Unknown kind: `files-block`, `Task <n>: Files line "- Modfy: a.ts" is not a Create, Modify, Test or Delete entry with a path`. The scan continues, so a later missing `Modify:` still gets its `paths-exist` finding and later entries stay in overlap checks.
- Punctuated unknown kind (`- Mod-ify: old.ts`): inside the run under the `^- [^\s:]+: ` boundary, so it gets the same finding and does not hide a later entry.
- Glob Delete: `files-block`, `Task <n>: Delete: path "src/*.ts" is a glob; Delete takes a literal path`.
- A plan with any finding returns no manifest (`extensions/phase-tracker.ts` renders it only on zero findings); this is unchanged.
- `- none:` under `**Tests:**` is outside the Files run and raises no `files-block` finding. A `- <token>:` line written directly under the Files entries with no `**Tests:**` heading between is inside the run and is a `files-block` finding, next to the existing `tests-block` finding for the missing heading.
- A recognized kind with no path, single-space (`- Create: `) or whitespace-only (`- Create:   `), does not match the entry pattern and gets the same `files-block` finding; the reason names the missing path. An empty path never becomes an entry, so it reaches neither ownership nor the rebuild.
- Inherited from `isGlob` (`/[*?{[\]]/`): a literal path with brackets or braces (`app/[id]/page.tsx`) counts as a glob, so it cannot be declared `Delete:`. Path escaping is not part of this change.
- Inherited from the exact-string overlap compare: `- Delete: legacy/` does not overlap a sibling's `legacy/a.ts`, although `ls-tree -r` expands a directory at rebuild. Directory-descendant ownership checks are not part of this change.
- Cross-wave limitation, existing behavior: a plan where one task lists `Modify:` or `Test:` for a path and a later-wave task lists `Delete:` for it passes before the removal and fails unchanged after it. `checkPathsExist` checks every task's `Modify:` entry regardless of wave, and `checkTestsBlock` reports the missing `Test:` path. `Modify:` existence validation is not weakened to cover this. The AC 9 proof uses removed paths owned only by `Delete:` entries (Design, "Reading of AC 9"); the cross-wave shape is Out of scope.
- A Delete path that never existed passes (ticket Out of scope).
- After the removal, another same-wave task's glob no longer expands to the deleted file, so Delete-versus-glob overlap is caught only by the check that runs before the removal (ticket Out of scope).
- Rebuild with a Delete path absent at the wave base: the `ls-tree` filter omits it, the restore exits 0, nothing is removed for it.
- Rebuild of a task with no Delete entries: `ls-tree` is not invoked and the Delete paths contribute nothing. This differs from a nonempty Delete list whose paths are all absent at the base, where `ls-tree` runs and prints nothing.
- Rebuild when the final restore set is empty (every Delete path absent, no `Modify` / `Test` path): `git restore` is not invoked. The recipe's `Skip a command with no paths` sentence covers both cases.
- Rebuild with a suffixed Delete path (`- Delete: a.ts:1-2`): the suffix is stripped before `ls-tree`, so `a.ts` is restored when it exists at the wave base. Unstripped, `ls-tree` prints nothing for `a.ts:1-2` and exits 0, which would skip the restore silently.
- Resume plan repair (`skills/gauntlet-resume/reference/brief-contract.md:245-262`) has no row for `files-block`; such a finding stops for the human like every other unlisted check. Its `paths-exist` row for a dead `Modify:` entry of a completed task is unchanged and serves plans written before `Delete:` existed.

## Tests

In `extensions/lib/plan-check.test.ts`:

- Delete entry passes with the file present and again with it absent (AC 1) - `Delete entry passes before and after removal`
- manifest lists the Delete path with kind `Delete` and every entry after it (AC 2) - `manifest carries Delete and later entries`
- missing `Modify:` after a Delete line gets `paths-exist` (AC 3) - `Modify after Delete is still existence-checked`
- missing `Modify:` alone fails (AC 4) - existing `paths-exist` tests (`:662-721`), unchanged
- same-wave Delete against Create, Modify, Test, and Delete on one literal path is rejected, Delete line first and last, file present and absent (AC 5) - `Delete conflicts with every same-wave kind`
- unknown kind gets a `files-block` finding naming the line, and the later missing `Modify:` is also reported; cases `- Modfy:`, `- Rename:`, and the punctuated `- Mod-ify:`, each followed by a missing `Modify:` entry (AC 6) - `unknown Files kind is a finding and does not end the list`
- `- none:` under `**Tests:**` and `- <word>:` lines outside the Files run raise no `files-block` finding (AC 7) - `lines outside the Files run are not files-block findings`
- glob Delete gets a `files-block` finding (AC 8) - `glob Delete is a files-block finding`
- a plan shaped like the row 10 sample (one task, one Delete, no Modify for that path) passes (AC 10, checker half) - `removal-only plan passes`
- a suffixed Delete path (`- Delete: a.ts:1-2`) overlaps a same-wave sibling's bare `a.ts` - `suffixed Delete overlaps a bare sibling path`
- Delete path that never existed passes - covered by `Delete entry passes before and after removal` (absent case)
- `- <word>:` directly under Files entries without a `**Tests:**` heading - `unheaded line in the Files run is a files-block finding`
- recognized kind with an empty path, single-space (`- Create: `) and whitespace-only (`- Delete:   `): each gets the `files-block` finding and adds no entry - `empty-path Files line is a files-block finding`
- `Delete:` bullet before `**Tests:**` keeps the heading legal - existing gh-28 position test, unchanged

In `scripts/wave-review.test.mjs`:

- contract and task template name `Delete:` and its three rules (AC 11) - token assertions beside the existing planning-contract tokens (`:43-46`), per file: `skills/writing-plans/reference/plan-contract.md` contains `Delete:`, `write ownership`, `literal path`, and `no existence requirement`; `skills/writing-plans/SKILL.md` contains `- Delete: `, `write ownership`, `literal path`, and `no existence requirement`
- rebuild restores a Delete path present at the base to base content, skips one absent there, and the restore exits 0 (AC 12) - the existing `rebuild removes Create/Test paths and restores deduplicated existing paths only` fixture gains Delete paths, one of them written with a `:1-2` suffix and restored to base content after the strip
- rebuild of a task with no Delete entries runs no `ls-tree`, and an empty final restore set runs no `git restore`; sibling contents are unchanged in both - same fixture
- `skills/subagent-driven-development/SKILL.md` stays under 50,000 bytes - the existing instruction-size lint in `npm test`
- independence sentence is kind-agnostic - none: the checker rejects such a plan before the wave loop reads a manifest; the AC 5 test covers the pairs

Eval samples (model replay, run only as selected samples):

- maintenance leaves Files entries and removed paths alone (AC 9, writer half) - `eval/writing-plans/samples/maintenance-after-delete`
- removal-only spec yields one Delete entry and no Modify (AC 10, writer half) - `eval/writing-plans/samples/removal-lists-delete`
- rebuild narrates the Delete restore split (AC 12) - `eval/subagent-driven-development/samples/rebuild-delete-paths`

Not tested:

- unchanged wave commit, review staging, and patch integration - none: no text or code changes
- `CHANGELOG.md` entry - none: prose, read by the conformance reviewer

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` - `## Unreleased` entry referencing #140 (major procedures / conventions: a new Files entry kind plan authors use, and a new checker finding id)
- Derived / memory docs invalidated: `doc/specs/2026-08-31-gh-19-deterministic-plan-checker.md` - supersession banner ("Plan parser" `**Files:**` block bullet only); `doc/specs/2026-10-30-slim-subagent-dispatch.md` - supersession banner (path-partition sentence of "Rebuild (the one automatic path)" only); `doc/specs/2026-09-10-gh-28-task-test-contract.md` - supersession banner (the `^- \w+: ` pattern of the `**Tests:**` Position sentence only); `CHANGELOG.md` - deferred: release

Materiality bar: `reference/documentation-impact.md`. The scout's candidates under `skills/` (plan contract, task template, rebuild recipe, resume brief contract) are implementation surface, not entries. `doc/configuration.md` links to the plan contract for the check definitions and needs no edit.

## Out of scope

- Detecting a `Delete:` path that never existed (ticket): it needs file history the checker does not read.
- Delete-versus-glob overlap after the removal (ticket).
- A `Rename:` kind, or any kind table.
- Changes to the resume plan-repair rows in `skills/gauntlet-resume/reference/brief-contract.md`.
- A live plan-writer dispatch against a fixture repo as proof of rows 9 and 10.
- Conflicts between two entries of the same task (for example `Delete:` and `Test:` on one path); the overlap check is across tasks.
- A plan that still passes after the removal when another task, in any wave, lists the removed path as `Modify:` or `Test:`. AC 4 keeps the missing `Modify:` path a finding, and exempting it needs a design this spec does not contain.

## Open questions

- none
