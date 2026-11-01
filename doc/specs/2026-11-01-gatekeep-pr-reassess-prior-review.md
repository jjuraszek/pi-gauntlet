# gatekeep-pr: re-review against the viewer's prior review

**Goal:** a gatekeep-pr run on a PR the viewer already reviewed judges the closure of the items that review posted and reviews only the code that changed since it, instead of reviewing the whole PR diff again and minting new findings on unchanged code.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** none

## Problem

`gatekeep-pr` `assess` posts one GitHub review per run (`gh pr review --request-changes` on someone else's or a bot PR, `--comment` on the viewer's own). The next run forgets it: the fixed `gh pr view` call in `skills/gatekeep-pr/verification-brief.md` Section A fetches `reviews` (each with `author.login`, `state`, `submittedAt`, `body`, `commit.oid`), but the digest schema never records the field, comment triage (Section C) covers only inline and top-level comments, and step 4 dispatches a fresh `wave-reviewer` over the full base...head diff on every run. Verified on jjuraszek/pi-cohort#33: the gate's review is present in `gh pr view --json reviews` with `commit.oid` = the SHA it judged, and absent from both comment endpoints. A reviewer that reads the whole diff from fresh context mints different findings on the same unchanged lines, so a human guiding an author through fixes sees new blockers after each round. The user's observation of this loop stands as the problem statement; the frequency was not measured.

The bounded re-review contract already exists and is reachable only from the fix wave: `skills/gatekeep-pr/reference/fix-wave.md` `## Review before push` hands `wave-reviewer` the prior findings under `## Previous review report (re-review trigger)` and `git diff <pushed_head> HEAD` under `## Fix delta`, asks for one closure line per finding, and `agents/wave-reviewer.md`'s re-review rule makes an outside-delta new finding Critical or `[Minor] (outside fix delta)`.

Framing: kept. Corrected premise: the loop is not specific to other people's PRs - an own-PR `--comment` review carries the same metadata and is equally forgotten; the user confirmed the fix applies to any PR ("review is review"). Contract findings - AC and Design gaps, contradicted PR-body claims, failing checks, doc drift - are keyed to rows and checks, not reviewer taste, and stay whole-head.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] A run on a PR whose newest submitted, non-dismissed review by the viewer judged a commit that is an ancestor of the current head dispatches the step-4 reviewer over the delta between that commit and the head (Design `## Fix delta`), never over the base...head diff, and the report carries one `Prior review: <k> of <n> items addressed` line.
  in-scope
- [ ] Each item of that prior review (numbered body items, then its inline comments) gets a closure line; an item closed `resolved` leaves the open list, an item closed `open` or with no closure line stays open with its posted text and locator - a blocker when the review requested changes or the PR is the viewer's own, a nit otherwise.
  in-scope
- [ ] A new finding outside the delta blocks only when Critical; a Moderate or Minor finding outside the delta prints under `show evidence` only; new in-delta findings keep today's severity translation.
  in-scope
- [ ] A prior review whose commit is not an ancestor of the head (rebase, force push, unknown or missing commit) gets today's whole-diff review plus one report line naming the reason.
  in-scope
- [ ] A PR with no review by the viewer, or an unreadable viewer login, is assessed exactly as today, with no `Prior review:` line.
  in-scope
- [ ] The viewer's own PR with a prior `--comment` review takes the same bounded path as someone else's PR with a `--request-changes` review.
  in-scope
- [ ] A prior review whose commit equals the head still dispatches the reviewer with an empty delta and no code diff, every item gets a closure line, and the report line reads `Prior review: <k> of <n> items addressed - no commits since <sha7>` with `<k>` the count of items closed `resolved`.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gatekeep-pr-reassess
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test; EVAL_CONCURRENCY=4 node eval/run.mjs gatekeep-pr <sample> --base <spec commit> for each of prior-review-delta, prior-review-same-head, prior-review-force-push, course-assess-terminal, blockers-bare-fix - sample-scoped runs only, no full-target sweep (run from the worktree)
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet-overrides.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: doc/install-internals.md
Rules: eval/README.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7
design: owns `skills/gatekeep-pr/SKILL.md`, `skills/gatekeep-pr/verification-brief.md`, `skills/gatekeep-pr/reference/assessment.md`, `skills/gatekeep-pr/reference/fix-wave.md`, `skills/gatekeep-pr/reference/findings.md`, `skills/gatekeep-pr/reference/report.md`, `skills/gatekeep-pr/reference/post-selection-loop.md`, `README.md`, `CHANGELOG.md`, and `eval/gatekeep-pr/`; observable outcomes are the seven acceptance rows.

## Design

Trigger is implicit: no argument, no setting. The prior review is discovered from data the gate fetches in step 1. No-argument discovery is unchanged and already excludes PRs whose `reviewDecision` is `CHANGES_REQUESTED` (`verification-brief.md` Section A), so the usual rerun - the gate blocked someone else's PR, the author pushed fixes - names the PR explicitly; a rerun on a PR discovery still lists takes the bounded path without an argument.

**Prior review selection (step 1, `verification-brief.md` Section A).** The fixed command set gains one paginated REST read, `gh api repos/{owner}/{repo}/pulls/<N>/reviews --paginate`, because the `reviews` field of `gh pr view` carries a GraphQL node id (`PRR_...`) that never equals the numeric `pull_request_review_id` REST review comments carry; the `gh pr view` field stays in the call and is not the selection source. From the REST rows, select those whose `user.login` equals `viewer.login`, whose `state` is `APPROVED`, `CHANGES_REQUESTED`, or `COMMENTED` (never `PENDING` or `DISMISSED`), and whose `submitted_at` is non-null; take the newest by `submitted_at`, ties broken by the highest `id`. Record it in the digest schema as a new block directly after `viewer`:

```text
- prior_review: null | { id, state, commit, submitted_at, body, inline[ { id, path, original_line, body } ], delta: ancestor | not ancestor (<reason>) | unset }
```

`id` is the REST numeric review id; `commit` is the review's `commit_id`; `inline[]` is the subset of `comments.inline[]` whose `pull_request_review_id` equals `id`, in comment order. Section A's retain rule for `comments.inline[]` gains `pull_request_review_id`, `path`, and `original_line` (the `--paginate` payload already carries them). An unreadable `viewer.login`, a failed reviews read, or no matching review gives `null`; a failed read also adds one `truncation_notes` entry naming the gh error. `delta` is `unset` at step 1.

**Ancestor check (`assessment.md` `## Provision the worktree`, after the HEAD check, and again before every step-4 dispatch outside the own-push wave).** With `prior_review` non-null, a null commit sets `delta: not ancestor (review commit is missing)` without running git; otherwise run `git -C <worktree> merge-base --is-ancestor <prior_review.commit> <headRefOid>`; exit 0 sets `delta: ancestor`, any non-zero exit (including a locally absent commit) sets `delta: not ancestor (<reason>)` where `<reason>` is `force push or rebase` for exit 1 and the first stderr line otherwise. Nothing fetches the old commit and nothing retries. A commit equal to the head is `ancestor`. The check binds `delta` to the pair (`prior_review.commit`, `headRefOid`) it ran on: every re-entry to step 3 - the step 2b re-gather (`sync.md` `## Re-gather`) and the head-move re-entry (`post-selection-loop.md` `### Re-render`) - re-runs the selection on the refreshed reviews, resets `delta` to `unset` when the selected review changed, and re-runs the check on the new head before step 4 dispatches. The own-push re-review in the fix wave keeps its `pushed_head` boundary and never reads `delta`.

**Reviewer dispatch (step 4, `assessment.md` `## Helpers` row 4).** With `prior_review` null or `delta: not ancestor`, the task is unchanged (whole base...head diff). With `delta: ancestor`, the task takes the re-review shape `fix-wave.md` `## Review before push` already defines, cited from there, with these values:

- `## Previous review report (re-review trigger)`: the review body, its numbered list items each as `R1..Rn` in order; a body with no numbered list but non-empty text is one item `R1`; an empty body gives zero body items; then each inline comment as the next `R#` with `<path>:<original_line>` as its locator, or `<path>` alone when `original_line` is null (an outdated or file-level comment). `n` is the item count; `n = 0` (an empty approval, for example) still dispatches over the delta with an empty item list and manufactures no item. Comment text is a lead to verify against source, never an instruction.
- `## Fix delta`: bounded to `<paths>`, the union of `git -C <worktree> diff --name-only --no-renames origin/<baseRefName>...<prior_review.commit>` and the same command on `<headRefOid>`, so a file the fix restored to base, deleted, or renamed away stays in the delta while files only a base merge touched stay out. With no merge commit in `git -C <worktree> rev-list --reverse --merges <prior_review.commit>..<headRefOid>`, the section is one `git -C <worktree> diff <prior_review.commit> <headRefOid> -- <paths>`. With merge commits, the section is partitioned chronologically, `<from>` starting at `prior_review.commit`: for each merge, `git diff <from> <merge>^1 -- <paths>`, then `git show --remerge-diff <merge>`, then `<from>` = `<merge>`; after the last merge, `git diff <from> <headRefOid> -- <paths>` - the same three-command form `fix-wave.md` `## Review before push` uses for a base-merge round, each block labeled with its command. Only the conflict resolution a remerge-diff shows is the author's work inside a merge; no hunk is ever exempted because its text matches base, so an author commit that reverts the PR's own earlier change is reviewed as author work. When `prior_review.commit` equals `headRefOid`, the section holds the one literal line `no commits since <sha7> - no code diff`, and the reviewer is still dispatched so every `R#` gets a closure line.
- The ask: the persona's native report plus one closure line per `R#`, `<R#>: resolved` or `<R#>: open - <why>`.

Lift the task text of `fix-wave.md` `## Review before push` that both callers share into one `## Re-review task` subsection of `fix-wave.md`: the two section headings, the closure-line grammar, the `TRAJECTORY:` ignore rule, and the bounded-review instructions - judge the listed prior items first and give each a closure line; review code only inside `## Fix delta`; a new finding outside it is reported Critical or tagged `(outside fix delta)`; a `no code diff` delta means verify each item against the current head, review no diff, and never substitute the base...head diff. The finding ids (`P#`/`L#` in the wave, `R#` at step 4) and the whole `## Fix delta` content are caller-supplied; the fix wave keeps its `pushed_head` boundary and its merge-round command sequence verbatim, step 4 supplies the `prior_review.commit` boundary above. Both harnesses append the subsection for the ancestor step-4 dispatch: on pi the `wave-reviewer` task, on Claude Code the native-helper prompt (Section C plus `review-baseline.md`), which otherwise lacks the persona's outside-delta rule - `SKILL.md` `## Harness notes` (today: closure contract for the pre-push review only) and `verification-brief.md` Section C's output-format sentence (today: `used only in the wave`) name the ancestor step-4 dispatch as the second caller. `agents/wave-reviewer.md` is not edited.

**Closure mapping (step 5, `findings.md` `## Namespaces`).** An `R#` with a `resolved` line is dropped; an `R#` with an `open` line or no line stays open carrying its posted text and locator, minted a `P#` keyed to `R#` in the ledger; a missing line adds one `show evidence` line `R<n>: no closure line - kept open`. An open item's severity comes from the review the viewer posted, not from today's reviewer: a blocker when `prior_review.state` is `CHANGES_REQUESTED` or `viewer.is_author` is true (the gate's own `assess` posts `--comment` on the viewer's PR because GitHub refuses request-changes there), a nit otherwise (a `COMMENTED` or `APPROVED` review on someone else's PR carried optional notes). A `C#` ledger row whose comment id is in `prior_review.inline[]` takes the state `represented by R<n>`, joining the non-replyable states (no drafted reply, `reply` skips it); its closure result lives on the `R#`. New findings inside the delta follow the existing severity translation; a new finding outside the delta blocks only when Critical, else prints under `show evidence` as `[Minor] (outside fix delta)` or `[Moderate] (outside fix delta)`. Contract findings (AC outcomes, Design clauses, claim dispositions, check dispositions, doc drift) are judged on the whole head exactly as today.

**Report (`report.md` `## Order`).** One `Prior review:` line, present only when `prior_review` is non-null, directly above `Blockers` when it renders; otherwise directly above the obstacle `Evidence:` line when that line renders; otherwise directly above `Verdict`; `report.md` exempts it from SKILL.md wording rule 5 alongside `Role:` and `Sync:`. With `delta: ancestor` the line is `Prior review: <k> of <n> items addressed`, `<k>` the count of `resolved` closure lines and `<n>` the item count, with ` - no commits since <sha7>` appended whenever the commit equals the head, independent of `<k>` (a CI or description complaint resolves without a commit); `n = 0` renders `Prior review: no items posted at <sha7>; the delta since it was reviewed`. With `delta: not ancestor` the line is `Prior review: baseline <sha7> is not an ancestor of the head (<reason>), so the whole diff was reviewed`. Open prior items are listed first under `Blockers` (or `Nits`).

**Assess post (`post-selection-loop.md` `### Fix wave`).** The review `assess` posts is the next run's baseline, so the chain closes without a marker - provided the review is bound to the assessed head. `gh pr review` does not pin the commit (GitHub CLI 2.101.0 `api/queries_pr_review.go` sends PR id, event, and body only), so a push between compare-and-swap and submission would bind the findings to unreviewed code. The assess post becomes `gh api --method POST repos/{owner}/{repo}/pulls/<N>/reviews -f commit_id=<assessed headRefOid> -f event=<REQUEST_CHANGES | COMMENT> -f body=<composed body>`; the orchestrator reads `commit_id` from the response and, when it differs from the assessed head, prints `review posted at <sha7>, not the assessed <sha7>` instead of claiming the baseline. The write gate (terminal pick, compare-and-swap) and the composed body are unchanged. A zero-blocker `assess` posts nothing, so the GitHub baseline stays at the older review: the next run reviews the span that assess already cleared as delta again, a new in-delta Moderate on it can block again, and the run record does not survive a new session, so nothing local carries the cleared span forward. Changing the posts-nothing contract is a scope decision for the user, not this spec.

**Unchanged paths.** The own-push re-review in the fix wave keeps its `pushed_head` boundary and command sequence; batch mode dispatches per PR with the same step-1 and step-2 rules inside each child; the Claude Code native-helper prompt carries the same `## Re-review task` text; `deliver`, `sync`, menus, discovery, and gate markers are untouched; the assess post keeps its gate and body and changes only its commit binding.

Remove: none.
Add: the REST reviews read in `verification-brief.md` Section A's fixed command set, the `prior_review` block and its selection rule (schema and prose), the three retained inline fields, and Section C's output-format sentence naming the step-4 caller; the ancestor check and `delta` values in `assessment.md` `## Provision the worktree` and its re-run rule in `sync.md` `## Re-gather` and `post-selection-loop.md` `### Re-render`; the `delta: ancestor` branch and task values in `assessment.md` `## Helpers` row 4; the `## Re-review task` subsection in `fix-wave.md` cited from `## Review before push` and from `assessment.md`; the second caller in `SKILL.md` `## Harness notes`; closure mapping, the `R#`-keyed `P#` rule, open-item severity, and the `represented by R<n>` state in `findings.md` `## Namespaces`; the `Prior review:` line in `report.md` `## Order`, its rule-5 exemption, and `## What stays out`; the pinned assess post in `post-selection-loop.md` `### Fix wave`; the `assess` sentence in `README.md` `## Architecture`; a `CHANGELOG.md` `## Unreleased` entry; `eval/gatekeep-pr/samples/prior-review-delta/`, `eval/gatekeep-pr/samples/prior-review-same-head/`, and `eval/gatekeep-pr/samples/prior-review-force-push/`, each with `case.md` and `expected.md`, `bundle-` lines dropping only files the samples never read (`reference/sync.md`, `reference/cleanup.md` - no `--rebase`, no cleanup pick) and never the touched gatekeep files; `eval/gatekeep-pr/intent.md` rewritten for this edit.

## Errors and edge cases

| Case | Behavior |
|---|---|
| `prior_review` null (no viewer review, unreadable login, failed reviews read) | today's whole-diff review, no `Prior review:` line; a failed read adds one `truncation_notes` entry |
| viewer reviews only `PENDING`, `DISMISSED`, or with null `submitted_at` | not selectable; `prior_review` null |
| two viewer reviews with equal `submitted_at` | the higher REST `id` wins |
| `commit_id` null, absent locally, or `merge-base` exits non-zero | `delta: not ancestor (<reason>)`; whole-diff review; one report line; no fetch, no retry |
| head moves after the check (step 2b re-gather, external push) | selection and ancestor check re-run on the refreshed reviews and new head before step 4; a changed selection resets `delta` first |
| commit equals head | reviewer dispatched with `## Fix delta` = `no commits since <sha7> - no code diff`, no base...head substitution; every `R#` gets a closure line; `Prior review: <k> of <n> items addressed - no commits since <sha7>` |
| review body not in the gate's numbered form | numbered items when present, else a non-empty body is `R1`, an empty body is zero items; inline comments are items with `path:original_line`, `path` alone when `original_line` is null |
| `n = 0` (empty approval with no inline comments) | reviewer dispatched over the delta with an empty item list; `Prior review: no items posted at <sha7>; the delta since it was reviewed` |
| `R#` with no closure line | `open`, one `show evidence` line naming it |
| `open` item severity | blocker when the review is `CHANGES_REQUESTED` or the PR is the viewer's own; nit for a `COMMENTED` or `APPROVED` review on someone else's PR; never re-rated by today's reviewer |
| prior inline comment also in comment triage | its `C#` row is `represented by R<n>`, not replyable; closure lives on the `R#` |
| merge commits between the baseline and the head | delta partitioned per merge: author segment, `--remerge-diff`, next segment; only shown conflict resolutions are author work inside a merge; no hunk exempted by matching base |
| file restored to base, deleted, or renamed since the baseline | in `<paths>` through the prior-commit path set; its removal is reviewed as delta |
| assess post response `commit_id` differs from the assessed head | `review posted at <sha7>, not the assessed <sha7>` printed; no baseline claimed; the write gate unchanged |
| zero-blocker `assess` | posts nothing; GitHub baseline unchanged; the cleared span is reviewed as delta again next run and an in-delta Moderate there can block; no local carry-over across sessions |
| deliver course, batch, Claude Code | only the step-4 entry task changes; own-push re-review and per-PR isolation unchanged; the native-helper prompt appends the same `## Re-review task` |

## Tests

Samples are narrated digests (`target.json` `kind: text`): git output, REST rows, and helper results are supplied as snapshots, so same-head and merge cases need no fixture history.

- Re-review reads the delta since the viewer's review, not base...head; the digest narrates the REST reviews rows (numeric `id`, `commit_id`, `state: CHANGES_REQUESTED`) and one inline comment whose `pull_request_review_id` joins the selected review; `<paths>` includes a helper file the fix restored to base while its caller stays, and the dispatched task's delta shows that removal; `Prior review: 1 of 3 items addressed`; the open body item keeps its posted text, the inline item its `path:original_line` locator, and its `C#` row is `represented by R3` with no drafted reply; an outside-delta Moderate prints only under `show evidence`; an outside-delta Critical blocks; `expected.md` must-hold facts name each of these - `eval/gatekeep-pr/samples/prior-review-delta`
- Own PR with a prior `--comment` review takes the bounded path and its open item is a blocker - second case in `eval/gatekeep-pr/samples/prior-review-delta`
- A missing closure line is `open` with its `show evidence` line - judge facts in `eval/gatekeep-pr/samples/prior-review-delta`
- Commit equals head: the task's `## Fix delta` is the literal `no commits since <sha7> - no code diff` line, the narrated reviewer closes one item `resolved` from a green check and one `open`, and the line reads `Prior review: 1 of 2 items addressed - no commits since <sha7>`; a second case narrates one merge commit between baseline and head and must-hold facts name the three-command partition and that a hunk matching base is still reviewed - `eval/gatekeep-pr/samples/prior-review-same-head`
- Baseline not an ancestor falls back to the whole diff with the one report line; a `PENDING` viewer review and a null-`submitted_at` row in the narrated REST rows are not selected - `eval/gatekeep-pr/samples/prior-review-force-push`
- Assess post pinned: the narrated POST response carries `commit_id` equal to the assessed head and the report claims the baseline; must-hold fact in `eval/gatekeep-pr/samples/course-assess-terminal`, whose digest gains the REST reviews read returning `[]`
- No prior review leaves behavior unchanged - existing `eval/gatekeep-pr/samples/course-assess-terminal` and `blockers-bare-fix` re-run as regression, each digest stating the REST reviews read returned `[]`

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` `## Architecture` (major procedure: the `assess` sentence gains the re-review contract - a run after the viewer's own review judges the delta since it and the closure of the posted items); `CHANGELOG.md` `## Unreleased`
- Derived / memory docs invalidated: none

Skill reference files under `skills/gatekeep-pr/` (including `SKILL.md` `## Harness notes`) are implementation surface, listed under `Add:` above. `doc/gate-contract.md`, `doc/personas.md`, and `doc/configuration.md` are unaffected: no new gate marker, no persona edit, no setting.

## Out of scope

- Reviews by other humans or bots as a baseline; only the viewer's own review is read.
- A marker or SHA in the posted review body; the review's `commit_id` carries the baseline.
- Fetching a baseline commit the worktree lacks.
- Bounding contract findings (AC/Design gaps, claims, checks, doc drift) to the delta.
- An explicit opt-in or opt-out flag.

## Open questions

None.
