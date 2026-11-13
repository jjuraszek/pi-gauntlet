# Housekeeping and the gauntlet's own output: spec folders and unpushed default-branch commits

**Goal:** Make `/skill:housekeeping` fit two things the gauntlet workflow produces: it stops content-checking spec and plan folders and offers one Delete-or-Keep card for specs marked fully superseded, and its no-argument run on a clean checkout checks the unpushed default-branch commits and folds accepted fixes into the last one without pushing.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** doc/specs/2026-11-12-repo-housekeeping-skill.md - the candidate filter and no-argument input in "2. Select", the main-checkout boundary in "1. Shape", the "reads no `piGauntlet.*` setting" sentence in Design, the per-run pick rows in "4. Decide", the delivery list in "5. Fix", the counter list in "6. Report", and the Out-of-scope line on unpushed commits

## Problem

Housekeeping (shipped in v8.5.0, `ece0fb3b`) does not fit two artifacts the gauntlet workflow leaves in a repo.

**Specs are the workflow's decision trace, and housekeeping checks them as current documentation.** Select drops only ignored, deleted, symlinked and binary paths (`skills/housekeeping/reference/select.md` `## Selection`), so spec files are selected, and Check runs every base, repo and overrides rule against them. At `d7413a02`, `/skill:housekeeping doc` selects 196 files, 191 of them under `doc/specs`; `/skill:housekeeping .` puts 160 specs in the first 200 (the default budget). A read-only check of two specs against the four Docs base rules returned 11 `doc-current` and `doc-conflict` findings, for example `doc/specs/2026-08-18-gh-8-shape-ticket-skill.md:39` naming `/skill:writing-skills`, a skill that no longer exists. Accepting those cards rewrites history until it matches today's code. The one base rule that speaks about history, `doc-history` ("remove superseded docs with no reader", `skills/housekeeping/reference/base-rules.md:20`), raised no finding.

**A squash-merge leaves an unpushed commit on the default branch, and no run checks it.** `/skill:finishing-a-development-branch` Option 3 ends with "No push. No PR. The squashed commit stays local" (`skills/finishing-a-development-branch/SKILL.md:355`); the chase-bug hotfix commit "stays **unpushed**" too (`skills/chase-bug/hotfix.md:337`). The directory run stops when HEAD differs from the fetched remote (`select.md:34`), and the uncommitted run's candidates are "Modified, staged and untracked files" only. The predecessor left this out expecting that "Unpushed work is checked once it is a draft PR" (`doc/specs/2026-11-12-repo-housekeeping-skill.md:478`); a repo that squash-merges to the default branch with no PR gate, as this one does (`.pi/gauntlet-overrides.md` `## Release (any skill that ships)`), never opens that PR.

Origin: a chase-bug real-bug verdict on a free-text report; no ticket. The human's requests, verbatim:

```text
1. spec dir should be excluded from houskeeping skill as well. its either default or override value, am I correct? housekeeping never ever change historical logs as specs of prev changes, right?
2. retry, and tell me how houskeeping should delete specs? I feel like it should only decide if spec should go or not in single class, right?
3. introduce this specific card as this is not object of full md driven check, right?
4. can we also add unpushed commit mode on main (after squash-merge); this should ammend last unpushed commit and it should operate on set of unpushed commits, make sense?
5. B, both are small ammendments of already established process and they are connected with how pi-gauntlet can operate (squash merge is ship option) and what gauntlet produce as trace of decission (spec). so this spec fills known gaps for housekeeping cooperation with current gauntlet workflow
6. B, no special grammar, just make sure that condition is strict for either case and it cant be true for both
7. ok, make sure forge-skill rules are followed and we stay under 50k with style of text on pair with other skills
```

Framing: kept

The framing question was asked once: a built-in delete card cuts across brainstorming's "Mark, never delete. Delete/archive policy is consumer territory via overrides" (`skills/brainstorming/reference/superseding.md`). The human kept the request as framed. Brainstorming's rule keeps binding brainstorming's own writes; housekeeping's card is the human-gated delete path.

Checked claims:

| Claim | Lookup | Result |
|---|---|---|
| The spec dir is a default or a configured value | `gauntlet_setting({ key: "flowGuards" })`; `extensions/lib/gauntlet-settings.ts:159-188` | Held. `specDirs` defaults to `doc/specs`, `docs/specs`; a valid non-empty `piGauntlet.flowGuards.specDirs` array replaces it; plan dirs are each spec dir's sibling `plans`. No overrides-file heading carries a spec dir. |
| Housekeeping selects and content-checks specs | Select's filter replayed with `git ls-files` and `git check-ignore --no-index`; a read-only shard check of two specs | Held. Counts above. One of the 11 findings did not validate at its quoted line. |
| Brainstorming marks and never deletes | `skills/brainstorming/reference/superseding.md` read whole | Held. |
| Finish ships the spec and strips only the plan | `skills/finishing-a-development-branch/SKILL.md:229`; `git ls-files doc/plans` | Held. 0 tracked plan files on `main`. |
| Delete only a fully superseded spec no other file names | `rg -l` for the `- fully` banner; fixed-string search for the hit's basename | Corrected. 1 of 191 specs is marked `- fully` (`doc/specs/2026-09-18-telemetry-record-deliverable.md`), and its successor names it; a successor always names its predecessor, so the test never passes. The card lists every fully superseded spec and shows which files outside the spec dirs name it (none for this one). |
| The spec-dir setting is readable wherever housekeeping runs | `.claude-plugin/marketplace.json:22`; `extensions/phase-tracker.ts:885`; `skills/gatekeep-pr/reference/assessment.md:76` | Corrected. `gauntlet_setting` is a pi extension tool; Claude Code has none. Gatekeep-pr already ships the fallback "on a harness without that tool, `doc/specs` and `docs/specs`". |
| `gauntlet_setting` reads the session checkout, not a PR merge-base | `extensions/phase-tracker.ts:891` | Held. No bridge to a merge-base settings file exists. |
| A path is in a spec dir by a contiguous component match | `extensions/phase-tracker.ts:294` `pathInSpecDirs` | Held. `services/x/doc/specs/a.md` matches `doc/specs`. |
| The index marks a spec superseded by one pattern in the title block | `src/bins/gauntlet-spec-index.mjs:20,266-271` | Held. `^> \*\*Superseded by:\*\* \[.*\]\(.*\) - fully$`, between the H1 and the first `## ` heading or code fence. |
| An empty `files` list goes straight to Report | `select.md:49` | Held. A selection holding only specs must still reach the spec card. |
| Later steps read run fields, not the input name | `select.md:16` | Held. |
| Picks are per run, not per class | `skills/housekeeping/reference/card.md:29` | Held. The spec card is the one per-class exception. |
| A commit delivery makes one commit per class and undoes one by reset; a repair amends a class commit | `skills/housekeeping/reference/fix.md` Jobs, `### 3. Repair or leave open` | Held. |
| Housekeeping writes the primary checkout only for `in-place` | `skills/housekeeping/SKILL.md:11` | Held; this spec lifts it for one delivery. |
| Report counters are a fixed list, duplicated in the gate contract | `skills/housekeeping/SKILL.md` `## 5. Report`; `doc/gate-contract.md:126` | Held. `prs,commits,edited,tickets,not-filed,ignored,not-decided,open`. |
| Instruction files have room | `wc -c -l`; `scripts/skill-size-lint.mjs:22-23` | Held. Largest touched file is `reference/fix.md` at 7,877 bytes and 82 lines; the limit is 50,000 bytes and 2,000 lines per file. |
| Bare `git status --porcelain` shows untracked files under any user config | `git -c status.showUntrackedFiles=no status --porcelain` in a scratch repo holding one untracked file | Corrected. It prints nothing; with `--untracked-files=normal` added it prints `?? untracked.txt`. The input test pins the flag. |
| The eval target's five housekeeping entries are still candidate-only | `git cat-file -e $(git merge-base HEAD origin/main):skills/housekeeping/SKILL.md` | Corrected. The baseline `d7413a02` holds all of them, and the runner refuses `"new": true` for a file the baseline contains (`eval/README.md` `## Iterating on a skill edit`). |

Implicit dependencies: the `gauntlet_setting` tool - found on pi, missing on Claude Code, covered by the default-dirs fallback. A settings source at a PR's merge-base - not found; the design uses the session checkout's value.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] A run whose candidates are `doc/specs/a.md` and `doc/guide.md` records `doc/guide.md` in `files` and `doc/specs/a.md` in `specs`, and compiles no base, repo or overrides content rule against `doc/specs/a.md`.
  in-scope
- [ ] A candidate under a plan dir (`doc/plans/a.md`) appears in neither `files` nor `specs`.
  in-scope
- [ ] On a harness with no `gauntlet_setting` tool, the run treats `doc/specs`, `docs/specs`, `doc/plans` and `docs/plans` as the spec and plan dirs.
  in-scope
- [ ] A run whose `specs` hold a spec with a `- fully` banner in its title block shows one card for that class with exactly two rows, Delete and Keep, and no Ticket row, in directory, uncommitted, PR and unpushed runs.
  in-scope
- [ ] A spec with only a partial-scope banner, or no banner, is listed on no card.
  in-scope
- [ ] The spec card recommends Keep and names the file when a tracked file outside the spec and plan dirs contains a listed spec's basename as a fixed string; with no such file it recommends Delete.
  in-scope
- [ ] A selection whose `files` list is empty and whose `specs` hold a fully superseded spec reaches the card instead of ending `gauntlet: done empty`.
  in-scope
- [ ] An accepted Delete removes exactly the accepted spec files, lands by the run's own delivery, and changes no other file.
  in-scope
- [ ] `/skill:housekeeping` with no argument on a primary checkout where `git status --porcelain --untracked-files=normal` prints at least one line runs the uncommitted check; when the local `origin/<default>` ref exists and HEAD is at least one commit ahead of it, counted without a fetch, its report lists those commits as not checked.
  in-scope
- [ ] `/skill:housekeeping` with no argument on a primary checkout where `git status --porcelain --untracked-files=normal` prints nothing and HEAD is two commits ahead of the fetched `origin/<default>` selects the files those two commits added, modified or renamed and offers Fix and Ignore.
  in-scope
- [ ] The same clean checkout at zero commits ahead of the fetched `origin/<default>`, HEAD equal to it or behind it, ends `gauntlet: done empty`; at one or more commits ahead with `origin/<default>` not an ancestor of HEAD, or with the fetch failing, it ends `gauntlet: stuck` naming both commits or the fetch error, with nothing changed.
  in-scope
- [ ] After an unpushed run keeps two fixed classes, `origin/<default>..HEAD` holds the same number of commits as before the run, the last commit keeps its message and contains both fixes, no ref was pushed, and the report starts `gauntlet: done amended=2`.
  in-scope
- [ ] When the last unpushed commit is found on a remote-tracking ref before the fold, the class commits stay on top of it unfolded and the report starts `gauntlet: stuck` with those classes counted under `open`.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: housekeeping-spec-dir-card
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`: skill lint, instruction-size lint, gate-contract lint, marketplace assertions, eval lib tests, eval structural lint and hygiene); `node --test eval/housekeeping/spec-card-delete-keep.test.mjs eval/housekeeping/spec-card-named-keep.test.mjs eval/housekeeping/unpushed-amend-report.test.mjs eval/housekeeping/unpushed-remote-ahead-stop.test.mjs eval/housekeeping/feature-branch-stop.test.mjs eval/housekeeping/pr-card-no-ticket.test.mjs` exiting 0, required because `npm test` runs no target-local `eval/housekeeping/*.test.mjs`; selected model evals `node eval/run.mjs housekeeping <sample>` for the six samples named in Design 7
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: doc/gate-contract.md
Rules: doc/install-internals.md
Rules: doc/implement-engines.md
Rules: .pi/gauntlet-overrides.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9, AC 10, AC 11, AC 12, AC 13
design: owns `skills/housekeeping/SKILL.md` and its five `reference/` files, one sentence in `skills/brainstorming/reference/superseding.md`, `eval/housekeeping/`, and the `doc/gate-contract.md`, `README.md`, `doc/configuration.md` and `CHANGELOG.md` amendments named in Documentation impact.

## Design

supersedes doc/specs/2026-11-12-repo-housekeeping-skill.md, the scope on the `**Predecessor:**` line. Everything else in the predecessor stands: the five steps, the run folder, the card walk's write gate, the three existing inputs and their deliveries.

Every addition is a cell, row or sentence in a table or paragraph the skill already has. Remove: none. No file under `agents/`, `extensions/`, `src/bins/`, `bin/` or `scripts/` changes; the skill gains no script, no settings key and no argument form; `skills/housekeeping/SKILL.md` frontmatter stays byte-identical.

### 1. Authoring constraints

These bind every edit under `skills/`:

- Follow `/skill:forge-skill` `## Authoring rules` and `## Edit procedure`: imperative voice; one path per step, a third branch as a table row; edit the sentence that owns the rule and restate it nowhere; no history; one example per rule; ASCII; compact `|---|` separators.
- Every touched file stays under 50,000 bytes and 2,000 lines (`scripts/skill-size-lint.mjs`) and under forge-skill's 500-line extraction threshold.
- New text takes the shape of the file it lands in: a new run is a column in Select's admission table, a new delivery is a row in each of Fix's delivery-keyed tables, a new rule is a `base-rules.md` row. No housekeeping file gains a `##` section.

### 2. Select (`reference/select.md`)

Add: two rows replace the argument table's `None` row, and a no-argument run changes the resolution order. Today the argument resolves first and the primary checkout and default branch after it (`select.md:3-12`). With no argument, resolve the primary checkout and the default branch first, test the shared precondition (primary checkout, default branch checked out) as a no-argument run, then take one observation on the primary, once, to pick the input. The observation must exit 0; a nonzero exit picks neither input and stops before Check.

| Argument | Input |
|---|---|
| None, and `git -C <primary> status --porcelain --untracked-files=normal` prints at least one line | uncommitted |
| None, and that command prints nothing | unpushed |

The two rows are the two outcomes of one command, so exactly one holds. Untracked files count; ignored files do not. The command pins `--untracked-files=normal`: with a user's `status.showUntrackedFiles=no`, the bare command prints nothing for an untracked-only checkout and would pick the unpushed run. The fold's clean-status checks in Design 5 use the same pinned command. The input is written to `<run>/run.md` and never re-resolved; a checkout that changes later is caught by the existing expected-state comparison. A checkout whose only uncommitted paths Selection then skips (a tracked file matching an ignore rule, a symlink, a binary) is still an uncommitted run.

Add: an `unpushed` column in the admission table, appended after the PR column so the existing columns keep their positions.

| Field | unpushed |
|---|---|
| Precondition | Primary checkout, default branch checked out, `git status --porcelain --untracked-files=normal` empty; fetch `origin <default>`. With `git rev-list --count origin/<default>..HEAD` at zero, end as an empty selection. Otherwise require `origin/<default>` to be an ancestor of HEAD, `git branch -r --contains HEAD` to print nothing, and no delivery receipt to name HEAD. |
| Candidates | Files added, modified or renamed across `origin/<default>..HEAD`. |
| `root` | Primary checkout |
| `rules-from` | Working tree |
| `picks` | fix, ignore |
| `bounds` | off |
| `delivery` | `amend` |
| `parallel` | 1 |

Zero commits ahead of the fetched `origin/<default>` - HEAD equal to it or behind it - yields no candidates and ends as an empty selection, whether or not `origin/<default>` is an ancestor of HEAD; a checkout that is only behind has nothing to amend. The ancestor stop applies only at one or more commits ahead.

The receipt check: no file under `<common dir>/gauntlet/receipts/`, where `<common dir>` is `git -C <primary> rev-parse --path-format=absolute --git-common-dir`, holds a `delivered:` line naming `squash <HEAD's full SHA>`. A missing folder holds no receipt. A coordinated finish writes these files and, on retry, requires the recorded squash to stay reachable from the default branch (`skills/finishing-a-development-branch/reference/legs.md` `## Durable receipts`); a one-member or no-`## Legs` finish writes none. Housekeeping reads receipts and never writes or removes one.

Changed line ranges are recorded against `origin/<default>`, as for any change-based selection. `commit` (HEAD at Select) is the last unpushed commit; no new run field records the remote head.

Add: five rows in the failed-observation table. The existing off-primary row reads `Directory or no-argument run outside the primary or off the default branch`, because the shared precondition fails before either no-argument input is picked.

| Failed observation | Stop before Check |
|---|---|
| Unpushed run: fetch of `origin <default>` failed, or `origin/<default>` does not exist | Carry the fetch error; never treat it as nothing to check. |
| No-argument run: the status observation exits nonzero | Carry its error; pick neither input. |
| Unpushed run: one or more commits ahead and fetched `origin/<default>` is not an ancestor of HEAD | State the two commits; an amend must not rewrite a commit the remote has moved past. |
| Unpushed run: `git branch -r --contains HEAD` prints a ref | Name the ref; an amend must not rewrite a commit a remote-tracking ref holds. |
| Unpushed run: a delivery receipt names HEAD as its squash | Name the receipt file; a coordinated-finish retry needs that commit reachable from the default branch. |

Add: the uncommitted run counts `git rev-list --count origin/<default>..HEAD` against the local ref, without fetching, and, when the count is above zero, lists `<n> commits ahead of the local origin/<default> ref (not fetched) - not checked while the checkout has uncommitted files` in `not-checked`. The line compares HEAD with the local ref; it is not a current reading of the remote. With no `origin/<default>` ref, or a zero count, it lists nothing.

Add: Selection's filter sentence reads "Use one filter for every input's candidate set" in place of "all three candidate sets". The unpushed candidates get the same handling as the others: ignored and deleted paths dropped, a rename's old path skipped, symlinks and binary files excluded. The filter runs before the split below.

Add: the spec and plan dir split in `## Selection`, applied to every input before the sort and the budget.

- Resolve the dirs once from the session checkout: `gauntlet_setting({ key: "flowGuards" })` -> `specDirs` and `planDirs`; on a harness without that tool, `doc/specs`, `docs/specs`, `doc/plans`, `docs/plans`. Record them in `<run>/run.md` and carry any `errors` entry the tool returns into Report's rule-sources list. A PR run uses the same session value; it reads no settings file at the merge-base.
- A path is in a dir when the dir's components appear as a contiguous run in the path's components, the rule `pathInSpecDirs` applies (`extensions/phase-tracker.ts:294`), so `services/x/doc/specs/a.md` is in `doc/specs`.
- A candidate in a plan dir is skipped, as an ignored path is.
- A candidate in a spec dir that survives the existing filter (not ignored, not deleted, not a symlink or binary, and for a directory run without an uncommitted change) goes to the run field `specs`, sorted, outside `budget`. It is never in `files`.
- An empty `files` list together with an empty `specs` list skips Check, Decide and Fix. An empty `files` list with a non-empty `specs` list goes to Check. This sentence replaces both existing shortcuts: `select.md`'s "An empty `files` list skips Check, Decide and Fix and goes to Report" and `SKILL.md` `## 1. Select`'s "An empty selection goes directly to Report". Report's `Empty selection` ending means both lists are empty.
- Expected state holds copies of every `specs` file with its mode, as for `files`.

Selection reads only `budget` from the overrides file. A path skip is applied at Check (Design 3), not here.

### 3. Check (`reference/check.md`, `reference/base-rules.md`)

Add: one row in `base-rules.md`.

| Id | Kind | Rule |
|---|---|---|
| `spec-superseded` | Specs | Remove a spec whose title block carries a fully-superseded banner. |

Add in `check.md`, in the sentences that own them:

- Check `files` against every compiled row except `spec-superseded`, and `specs` against that row alone. No repo or overrides rule compiles against the Specs kind; helpers receive no `specs` path.
- `spec-superseded` runs in mode `derived`: over `specs`, find a line matching `^> \*\*Superseded by:\*\* \[.*\]\(.*\) - fully$` between the H1 and the first `## ` heading or code fence, the pattern `gauntlet-spec-index` uses for `state: superseded`. Each hit is one `line` finding quoting the banner. A partial-scope banner and a repo's own banner syntax match nothing.
- For each hit, run a second read-only search: tracked files at `root` that contain the spec's basename (`a.md` for `doc/specs/a.md`, never its repo-relative path) as a fixed string. Count only matches in files outside both the spec dirs and the plan dirs; record those paths with the finding.
- Derived searches for other rows keep running over `files`.
- A content command is a documented command that checks the content of files of a kind the spec or plan dirs hold (a Markdown lint, a link check). For a content command this replaces `check.md`'s "the full command otherwise": run its documented scoped form when that form leaves out the spec and plan dirs. With no such form, list the command under checks not run with the reason that no documented form excludes the spec and plan folders; never run it over them and invent no command. A documented command that reads no such file (a test or build command) runs as documented; its failure stays a command finding.
- Drop at validation any finding of a row other than `spec-superseded` whose item sits in a spec or plan dir. No other class lists a `specs` or plan-dir path as an item.
- A path skip from the `rules-from` sources (a repo rule file or the overrides `## housekeeping` section, read at Compile checks) applies before the banner search: a skipped spec path leaves the `spec-superseded` search and reaches no card. Skipping paths scopes the base rule; it does not remove or weaken it. A spec that survives the skip is checked by `spec-superseded` alone.

With no surviving findings, including an all-`specs` selection with no banner hit, the run ends `gauntlet: done clean`.

### 4. Decide (`reference/card.md`)

Add: a row rule beside "Show only the run record's picks". The `spec-superseded` class shows these two rows in every run, whatever `picks` holds:

```text
1. [ ] Delete - remove the listed specs; <delivery from the Fix-promise table>
2. [ ] Keep - leave them in the spec folder
```

Record Delete as `fix` and Keep as `ignore`, so Fix and Report read the picks they already know. `<n> except 1 3`, `list`, `go`, `stop` and Delete followed by instruction text behave as on any card. The marker stays `gauntlet: gate=housekeeping/card recommended=<n>`.

Card sections for this class: What was found gives the count and up to three example paths; Why it matters says each spec's own banner states another spec fully replaces it, citing the housekeeping base rules; What happens if you accept says the listed files are deleted and how that lands, names up to three files outside the spec folders that mention a listed spec or says none do, and says git history keeps the deleted text.

Add: an `amend` row in the Fix-promise table (`| Delivery | Fix row says |`). Fix rows and the Delete row on an unpushed run both read it.

| Delivery | Fix row says |
|---|---|
| `amend` | Make one commit for this class on the default branch in the primary checkout, fold the kept fixes into the last unpushed commit after the last class, and push nothing. |

For every delivery the Delete row states the removal of the accepted specs first, then that run's promise from the table.

Add: `bounds: on` evaluates no hotfix predicate for this class; Delete is always available.

Add: one row in the recommendation table, above "Mechanical fix and every item settled by the rule text":

| Card facts | Recommend |
|---|---|
| `spec-superseded` class and a file outside the spec and plan dirs names a listed spec | Keep |

Without such a file the existing "Mechanical fix" row recommends Delete.

### 5. Fix (`reference/fix.md`) and the spine

A Delete is an ordinary Fix-picked class: the fix helper removes the accepted files (for `in-place`, without touching the index), the diff check allows only those paths, Verify repeats the search over the accepted paths and passes when none exists, and the review helper reviews the deletion against the rule. Mentions of a deleted spec in other files, its telemetry record and its index row are left as they are.

Add in `fix.md`, in the three sentences that own write authority. "Selected files" keeps meaning `files`; a `specs` path is writable by the `spec-superseded` class alone, and only by deletion.

- Helper duty ("for `in-place`, edit only selected files"): for the `spec-superseded` class, delete only the accepted `specs` paths and edit no file.
- `in-place` Required match ("Selected files' contents, existence and modes"): the comparison covers the expected copies of `specs` as well as `files`.
- Allowed-file diff ("Validate the output and diff against the allowed files"): for `spec-superseded` the allowed files are exactly the accepted `specs` paths and the only allowed change is their deletion; for every other class a diff touching a spec-dir or plan-dir path is an edit outside allowed files.

Add: `amend` wherever `fix.md` keys on delivery. `amend` is a commit delivery in every sentence that says "commit delivery".

| Table | `amend` |
|---|---|
| Jobs | One job in `root`, Fix-picked classes in card order; one commit per kept class on top of the recorded `commit`. |
| Required match (`### 1. Fix`) | Shares the `pr-per-class`, `commit-push` row: expected HEAD and clean status. |
| Undo | Shares the `commit-push` row: reset to the pre-class commit, preserving earlier kept class commits. |
| Batches sentence | Runs one class after another, with `commit-push` and `in-place`. |
| Delivery | Below. |

`amend` delivery, after the last class and only with at least one kept class:

1. Fetch `origin <default>`.
2. Require `git branch -r --contains <commit>` to print nothing, and repeat Select's receipt check for `<commit>`.
3. Immediately before the reset, recheck the primary: the recorded default branch is checked out, HEAD equals expected HEAD, and the index and worktree are clean.
4. Record the pre-fold HEAD, its tree (`git rev-parse HEAD^{tree}`) and `<commit>`'s complete ordered parent list and message; run `git reset --soft <commit>`, then `git commit --amend --no-edit`.
5. Require the new HEAD's complete ordered parent list to equal `<commit>`'s, its message to equal `<commit>`'s, its tree to equal the recorded pre-fold tree, and a clean status. Only then advance expected HEAD to it.

A non-empty step 2 (a remote ref or a receipt), a failed fetch, a step 3 difference, or a failed step 4 or 5 keeps the class commits: restore them with `git reset --soft <pre-fold HEAD>` when step 4 moved HEAD, record every kept class as left open with the reason (the remote ref, the receipt file, the fetch error, the changed paths or commits, the commit's output or the differing tree), and continue to Report. A step 3 difference resets nothing, folds nothing and reverts nothing in the primary, so the human's change and the kept class commits both stay. Push nothing in any case.

Add in `SKILL.md`: the boundary sentence allows writing the primary checkout for `delivery: in-place` and `delivery: amend`, and staging and committing there for `amend` only; stashing and force-pushing stay forbidden.

Add in `fix.md`: the whole Jobs paragraph that opens "Leave the primary checkout's tracked files unchanged for `pr-per-class`" is scoped to `pr-per-class` - its second sentence ("Never stage, unstage, stash or commit there") and its third (the comparison with Select's expected state before jobs and after delivery) as well as its first. For `amend`, staging and committing on the primary are allowed for the class commits and the fold. After a successful fold, compare the primary with the post-fold expected HEAD and a clean status, not with Select's snapshot; stop per Report on a difference.

### 6. Report (`SKILL.md` `## 5. Report`) and `superseding.md`

Add: the counter `amended`, the number of classes folded into the last unpushed commit, after `commits`: `prs,commits,amended,edited,tickets,not-filed,ignored,not-decided,open`. A Keep counts under `ignored`. For an `amend` run the list names the last unpushed commit before and after the fold and states it is not pushed. One line gives the number of `specs` searched for the banner only. `doc/gate-contract.md` carries the same counter list.

Add in `skills/brainstorming/reference/superseding.md`: the second sentence of the "Mark, never delete" bullet names `/skill:housekeeping`'s Delete card beside the consumer's overrides as where deletion happens. Brainstorming's own instruction is unchanged: it marks and never deletes.

### 7. Eval and paid actions

`eval/housekeeping/`:

- `target.json`: remove `"new": true` from the five housekeeping entries; the baseline holds them.
- Four samples, each with `case.md`, `expected.md` and a deterministic `eval/housekeeping/<sample>.test.mjs` in the shape of `pr-card-no-ticket.test.mjs`, which asserts the owning skill-text cells and the sample's structure:

| Sample | Seeds | Must hold |
|---|---|---|
| `spec-card-delete-keep` | A PR run after Check with one `spec-superseded` finding and no outside file naming it | Exactly two rows, Delete then Keep; Delete recommended; the Delete row says the listed specs are removed and promises a commit pushed to the PR branch |
| `spec-card-named-keep` | A directory run after Check with one finding and `README.md` naming the spec | No Ticket row; Keep recommended; the card names `README.md` |
| `unpushed-amend-report` | An unpushed run after Fix with two kept classes folded | First line `gauntlet: done amended=2`; names the commit before and after; says nothing was pushed |
| `unpushed-remote-ahead-stop` | No argument, clean checkout, `origin/<default>` not an ancestor of HEAD | First line `gauntlet: stuck`; both commits named; no card |

- `unpushed-amend-report/case.md` opens with `bundle+: skills/housekeeping/reference/fix.md`; `skillFiles` stays without it, so the other samples' assemblies gain nothing.
- `intent.md` is rewritten for this change, with `for:` bound to the new bundle-free assembly.
- `unpushed-amend-report.test.mjs` asserts the unpushed Fix and Delete promise: the `amend` row of `card.md`'s Fix-promise table and the Delete row's removal wording.
- `unpushed-amend-report.test.mjs` also holds one executed check that makes no model call. In a `mktemp -d` scratch repo with a local bare `origin`, it runs the fold's Git commands as `fix.md` words them over two class commits on top of a last unpushed commit and asserts: the commit count of `origin/<default>..HEAD`, the complete ordered parent list, the message, the tree equal to the pre-fold tree, and unchanged remote refs. A second case puts the last unpushed commit on a remote-tracking ref and asserts step 2 prints that ref with both class commits still on top. A third case fails the amend with a failing commit hook and asserts `git reset --soft <pre-fold HEAD>` restores both class commits. It removes the scratch folder.
- Two existing tests pin `select.md` text this change edits. `feature-branch-stop.test.mjs` asserts the off-primary row verbatim; update that assertion to the new row text. `pr-card-no-ticket.test.mjs` reads the PR column as `split("|")[4]`; the `unpushed` column is appended last, so that index holds. Both run in the leg's `node --test` verification command.
- `eval/housekeeping/README.md`: add the four samples, restate coverage as it stands after this change (which samples hold evidence against the new assembly, which are archived against an older one, what stays a conformance read, what the scratch check executes), and replace the bundle-free assembly hash, which `intent.md`'s `for:` line carries too. `report.md` is regenerated by the selected runs and stays sample-scoped.
- Text replays cannot prove live selection or the dir split; the deterministic tests pin those as conformance reads of the owning skill sentences. The scratch check executes the fold's Git sequence; that a run follows that sequence stays a conformance read.

Paid action, authorized for the whole flow by this spec's approval with no per-step prompt and no count: `node eval/run.mjs housekeeping <sample>`, with `--baseline-only` first for a sample whose `bundle` lines are new, for the four new samples and for `pr-card-no-ticket` and `directory-three-picks` (their card row rule changes). Runner: the implementing session, from the worktree. Inputs: each sample's `case.md` and `expected.md`, `eval/housekeeping/target.json`, `eval/housekeeping/intent.md`. This authorization supersedes the three-invocation per-sample bound that `eval/housekeeping/README.md` records for `pr-card-no-ticket` and `directory-three-picks`. No target-wide run. Implementation and verification push nothing and write to no tracker.

## Errors and edge cases

- A spec with an uncommitted change in a directory run goes to `not-checked` with the other dirty candidates, not to `specs`.
- A modified spec in an uncommitted, PR or unpushed run is in `specs`; this is how the change that just added a `- fully` banner meets the card.
- A banner line inside a code fence or below the first `## ` heading lists nothing.
- A Delete under `in-place` is undone by restoring the file from its expected copy.
- A human commit or edit during the walk fails the expected-state comparison and stops the run, as today.
- A failed class commit in an `amend` run follows the `commit-push` undo.
- The fold runs commit hooks; a hook failure is a failed step 4. A hook that succeeds and changes the committed tree fails step 5's tree comparison, so no class is reported amended.
- A human commit, staged change or edit between the last class and the fold fails step 3; nothing is reset or folded.
- A last unpushed commit that is a locally made merge has several parents; step 5 compares the whole ordered list.
- A coordinated-finish receipt naming the last unpushed commit as its squash refuses the run at Select, and at step 2 when the receipt appears during the walk. Report names the receipt file. Housekeeping changes neither the receipt nor `skills/finishing-a-development-branch/`.
- A commit that reaches a remote-tracking ref during the walk passes Select and is refused at step 2.
- A content command with no documented form that leaves out the spec and plan dirs is listed under checks not run; its rule's findings are not raised for any file in that run.
- A nested fixture path such as `eval/<target>/samples/<sample>/fixture/doc/specs/a.md` matches by the same contiguous-component rule: it leaves every content check, a fixture under a plan dir is skipped, and a fixture spec carrying a `- fully` banner reaches the human-gated Delete-or-Keep card.
- An `amend` run with every class ignored or left open folds nothing and leaves HEAD at `commit`.
- A status that is not clean after restoring the pre-fold HEAD stops per Report, naming the paths and reverting nothing.
- `gauntlet_setting` returning `errors` still returns usable dirs; the run continues on them.

## Tests

A line that says a sentence is asserted names a conformance read of the owning skill sentence, not an executed run. The executed scratch-Git check is named where it applies.

- Spec candidate goes to `specs`, content rules skip it (AC 1) - none: live selection; the Selection and Check sentences are asserted in `eval/housekeeping/spec-card-delete-keep.test.mjs`
- Plan-dir candidate is skipped (AC 2) - none: live selection; sentence asserted in `eval/housekeeping/spec-card-delete-keep.test.mjs`
- Default dirs without the settings tool (AC 3) - none: harness-dependent; sentence asserted in `eval/housekeeping/spec-card-delete-keep.test.mjs`
- Two rows, Delete and Keep, no Ticket (AC 4) - samples `spec-card-delete-keep` (PR run) and `spec-card-named-keep` (directory run)
- Partial or missing banner lists nothing (AC 5) - none: live search; the pattern, the title-block sentence and the Check-time path-skip sentence are asserted in `eval/housekeeping/spec-card-named-keep.test.mjs`
- Keep recommended and file named, else Delete (AC 6) - samples `spec-card-named-keep` and `spec-card-delete-keep`
- Specs-only selection reaches the card (AC 7) - none: live selection; the empty-selection sentence is asserted in `eval/housekeeping/spec-card-named-keep.test.mjs`
- Delete removes only accepted files and lands by the run's delivery (AC 8) - none: live Fix; the Delete row promise is judged in `spec-card-delete-keep`, and the unpushed Delete promise is asserted in `eval/housekeeping/unpushed-amend-report.test.mjs`
- Dirty checkout runs uncommitted and reports unpushed commits (AC 9) - none: live git; the two argument rows and the not-checked sentence are asserted in `eval/housekeeping/unpushed-remote-ahead-stop.test.mjs`
- Clean checkout ahead of the remote selects the commits' files (AC 10) - none: live git; the `unpushed` column cells are asserted in `eval/housekeeping/unpushed-remote-ahead-stop.test.mjs`, and the `amend` Fix-promise row in `eval/housekeeping/unpushed-amend-report.test.mjs`
- Zero ahead ends empty; remote not an ancestor or fetch failure stops (AC 11) - sample `unpushed-remote-ahead-stop`; the zero-ahead and fetch-failure rows are asserted in its test file
- Folded report (AC 12) - sample `unpushed-amend-report`; the fold's commit count, parent list, message, tree and unpushed refs - the executed scratch-Git check in `eval/housekeeping/unpushed-amend-report.test.mjs`; its five steps are asserted in the same file
- Commit found on a remote keeps class commits and reports open (AC 13) - the executed scratch-Git check's remote-ref case in `eval/housekeeping/unpushed-amend-report.test.mjs`; the failure sentence and the `open` count are asserted in the same file
- Card row rule leaves existing cards unchanged - samples `pr-card-no-ticket` and `directory-three-picks`, rerun
- Existing `select.md` pins hold - `eval/housekeeping/feature-branch-stop.test.mjs` (off-primary row text) and `eval/housekeeping/pr-card-no-ticket.test.mjs` (PR column cells), run by the leg's `node --test` command
- Edge clauses (dirty spec in a directory run, banner in a fence, `in-place` undo, hook failure, nothing kept, unclean restore, settings `errors`) - none: live git or harness state; each owning sentence is covered by the instruction-size and skill lint only
- Instruction files stay under the size limit - `scripts/skill-size-lint.mjs` in `npm test`

## Documentation impact

Bar: `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (major procedures: what the no-argument run checks, the spec-folder skip and the Delete card, the REVIEW.md convention no longer reaching spec and plan folders, the `## housekeeping` overrides row and its fixed-rules line); `doc/gate-contract.md` (communication contracts: the `amended` counter and the Delete and Keep rows recorded as fix and ignore); `doc/configuration.md` (operations: housekeeping joins the consumers of `flowGuards.specDirs`); `CHANGELOG.md` (major procedures: `## Unreleased` entry)
- Derived / memory docs invalidated: none

## Out of scope

- Partly superseded specs, unmarked stale specs, and a repo's own banner syntax: none reaches the card.
- Archiving or moving a spec, rewriting references to a deleted spec, and deleting its telemetry record.
- A Ticket row on the spec card, and a card for plan files.
- A new argument form or a combined uncommitted-and-unpushed run.
- Starting the unpushed run from another skill after its squash-merge; housekeeping stays human-invoked.
- Pushing the amended commit.
- Reading settings at a PR's merge-base.
- Folding fixes into any commit other than the last unpushed one.
- Changes to `skills/finishing-a-development-branch/`, `skills/chase-bug/` and `skills/gatekeep-pr/`.

## Open questions

- Readers of a spec path outside the repo (PR bodies, tracker comments) cannot be searched from a checkout. Assumption: git history is the recovery path for a deleted spec, and the card says so.
- The spec-index query's side effects (cache refresh, possible telemetry fetch) were reported by recon and not traced. Not load-bearing: housekeeping does not call the index.
