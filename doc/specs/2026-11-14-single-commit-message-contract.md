# One commit-message contract: plain subjects, ledger-held loop state, composed landed messages

**Goal:** Every commit, squash message and pull request title the framework writes takes its wording from one shared reference (a short plain subject, no file references, readable without the code, no internal label such as `loop:`), and the loop engine keeps its bookkeeping in the ledger and a return file so no check reads commit text.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** `doc/specs/2026-10-23-gh-68-loop-implement-engine.md` - supersedes the commit-subject markers and the commit-body attribution in its Persona, Driver and Ledger amendments clauses; the engine, ledger table and approval gate stay live.
**Predecessor:** `doc/specs/2026-11-02-gh-119-escalate-after-row-history.md` - supersedes the `loop: escalate row <n>` parent-commit subject in "Driver threshold rule" and "Hotfix"; the threshold rule and the `row <n> escalated` decision line stay live.
**Predecessor:** `doc/specs/2026-11-01-chase-bug-loop-hotfix.md` - supersedes the `loop: seed evidence` / `loop: row 1 <status>` subject requirements, the commit-body result block in "Dispatch" and its acceptance rows, and the `fix: <slug>` landing subject; seed-then-row dispatch, budgets and conformance stay live.
**Predecessor:** `doc/specs/2026-11-04-gatekeep-fix-loop-engine.md` - supersedes the `loop: row <n> <done|failed>` subject requirement and the commit-body result block in "Row dispatch" and "Harness"; the derived spec, external ledger, budgets and round charging stay live.
**Predecessor:** `doc/specs/2026-10-28-multi-repo-coordinated-flow.md` - supersedes the spec path on the `Home:` line of companion squash messages in "Finishing"; companion PR bodies and every other clause stay live.
**Predecessor:** `doc/specs/2026-11-01-gh-110-loop-multi-row-close.md` - supersedes the "validated `loop: seed evidence` commit ... survives on the branch" predicate in its seed-selection acceptance row and the Driver restatement of it; "a validated partial seed never re-seeds", the per-leg seeded state and every other clause stay live.

## Problem

The framework writes commits in the loop engine, the plan engine, plan writing, brainstorming, resume, finish, gatekeep-pr, the chase-bug hotfix and housekeeping. No shared wording rule exists, and the loop engine's subjects are a parsed protocol (`loop: row 5 done`, `loop: amend`, `loop: repair seed`, ...). Those labels and the machine block in worker commit bodies reach consumer default branches: GitHub-side squashes paste every branch commit, and teammates land branches unsquashed.

Original request, verbatim: "commit messages are not very informative in this framework. take a look at squash merge commits on ../gridstrong/. "loop: amend" is pure garbage. check all places where commits are generated: loop engine, plan driven engine, gatekeep-pr deliver path, chase-bug hotfix path, housekeeping fix. all those places should generate meanigful messages. message should be: short, human readable, no file refs, understandable without reading actual code. squash merge can be long, should be condense it? can we create some common git message template? for loop engine its even easier as each ledger step is message but I'm not sure if it qualifies as such, verify based on ../gridstrong/ and ../customer-ops/. my goal is that we have single place which aid in creating proper commit no matter what the context of usage is. make sure internals prefix like "loop: ..." is never part of commit msg."

Framing: kept - the user answered "as framed": every commit gets a plain subject and the landed message is written fresh. Later answers added: no check should count or match commit text; no major reorganization of the implementation flows; gauntlet-handoff and gauntlet-resume keep working; ledger-only bookkeeping for the loop engine (no machine line in any commit message); no extra file is ever committed to a final outcome; no regression in orchestration.

### Checked claims

| # | Claim | Lookup | Result |
|---|---|---|---|
| 1 | Consumer landings carry uninformative text | last 200 first-parent commits of `gridstrong` and `customer-ops`, bodies scanned for internal lines | Held. gridstrong 9/200, customer-ops 33/200 bodies with internal lines; body length max 383 and 4214 lines. Machine-line counts in those bodies: customer-ops `iteration:` 569, `pending:` 568, `loop: row` 515, `loop: amend` 57. |
| 2 | `loop: amend` reaches a default branch | gridstrong, 600 first-parent commits | Held. 3 commits (`7920b8cfc6`, `c6886a32d4`, `b701e10daa`). |
| 3 | The five named flows write commits | read of each commit site | Held. Unnamed writers also exist: spec commit, amendment commit, consent-change commit, plan commit, plan-citation repair, PR titles, companion squash messages. |
| 4 | The commit writers produce the damage | `gh api repos/{owner}/{repo}`; `gh pr merge --help`; `skills/gatekeep-pr/reference/post-selection-loop.md:159` | Corrected. Both consumers and this repo use `squash_merge_commit_message: COMMIT_MESSAGES`; gatekeep's merge passes no `--subject`/`--body`, so GitHub joins every branch commit's subject and body. Local squashes (finish, hotfix) already pass their own message. |
| 5 | A ledger step is a ready commit message | consumer ledgers at `ae00aa34b1` (gridstrong) and `docs/plans/2026-10-29-E-4273-workflow-assessment-recipe-ledger.md` (customer-ops) | Corrected. Rows are `row \| status \| attempts \| evidence`; only the decision line's middle cell reads like a sentence, and about half of 12 samples name files, temp paths or blocked work. Subjects are written from the spec's acceptance row, not copied. |
| 6 | One shared place can serve every flow | `rg -i commit skills agents` | Held. No shared rule exists; skills already cite each other's reference files by relative path; the Claude Code plugin source is the repo root, so those paths resolve there. A copied persona has no stable path to `skills/` (`doc/personas.md:47`), so dispatchers pass the absolute path. |
| 7 | Internal prefixes can be dropped | `skills/loop-implementation/SKILL.md:51,61,70,101,114,173`; `reference/coordinated-legs.md:27,89,94`; `skills/gatekeep-pr/reference/fix-wave.md:143`; `skills/chase-bug/hotfix.md:184,196`; `skills/gauntlet-resume/reference/reconstruction.md:98-125`; `skills/finishing-a-development-branch/SKILL.md:158` | Corrected. Commit text is the engine's durable record in six uses: return admission (subject plus body lines 1-2), result transport for workers whose ledger is outside their repo, the seed-repair and verification-repair budgets, the stuck-row windows, resume's pending recovery, and finish's amendment digest. 13 `loop:` subjects, plus `amend:`, are read. `grant:`, `plan:` and `resume:` subjects have writers and no reader. No extension or bin parses a subject. |
| 8 | Who ran the dirty landings | committer of each dirty first-parent commit | 42 of 45 are committer `GitHub` (button or `gh pr merge`, indistinguishable); 3 in gridstrong are branch commits a teammate landed unsquashed, one with subject `amend: 1 item(s) - ...`. Branch-commit subjects and bodies both reach default branches. |
| 9 | A worker commit needs a label once the subject is prose | `agents/loop-implementer.md:42,45,93` | Corrected. The subject repeats the body tuple's target and the row's status; dropping it loses no identity. No trailer is added. |
| 10 | A home worker's body lines duplicate the ledger | `agents/loop-implementer.md` step 7; `reconstruction.md` Pending recovery | Corrected. `iteration:` duplicates the `iterations:` header, but the tuple's pre-dispatch SHA exists nowhere else once the child deletes `pending:`. The design keeps the tuple in the committed ledger on a `returned:` line. |
| 11 | Ledger readers tolerate new lines | `extensions/plan-tracker.ts:86-125`; `extensions/lib/plan-check.ts:1297-1323` | Held. `allowance:` and `pending:` are found by anchored regex; `## Decisions` matches only `row <n> done` and `row <n> retry`; plan_check reads the table only. |
| 12 | A temp-folder result file is as durable as today's commit body | `fix-wave.md` Finding artifacts; `hotfix.md:77-104`; `coordinated-legs.md` Resume | Held for gatekeep and hotfix (their ledgers are in OS temp today). Disproved for coordinated companions, whose home ledger survives a temp wipe. The design puts the return file under the worker checkout's git common dir (precedent: receipts at `<home git common dir>/gauntlet/receipts/`, `skills/finishing-a-development-branch/reference/legs.md:23`). |
| 13 | Worker commits can be found without subjects | scratch repo, git 2.56.0: `git log -G'^returned: ' -- <ledger>` | Held. It listed the two worker commits and skipped the driver's decision-only commit. |
| 14 | gauntlet-handoff reads commit text | `rg` over `skills/gauntlet-handoff` | Held: it reads none. |
| 15 | gauntlet-resume reads commit text | `reconstruction.md:98-125`; `brief-contract.md:257-260` | Three touch points: pending recovery reads the latest child commit's subject and body; it writes `loop: migrate allowance`; it writes `resume: plan citation repair - <n> findings` and relies on finish's subject filter to ignore it. |
| 16 | The plan engine keeps bookkeeping in commit text | `skills/subagent-driven-development/SKILL.md:45,130`; `reconstruction.md` "Spec with plan" | Disproved. Task state is `plan_tracker`; resume finds finished tasks by touched path. The plan engine needs the wording rule only. |
| 17 | Other code reads commit text | `rg` for `--format=%[sBb]`, `show -s`, `--grep` | Three readers of human content: `src/bins/gauntlet-telemetry-seal.mjs:182` (tracker refs from `%B`), `skills/check-delivery/SKILL.md:188` (ticket id on the default branch), `skills/finishing-a-development-branch/SKILL.md:262` (review thread ids). The ticket reference is therefore required wherever a ticket is bound. |
| 18 | The spec-review and amendment audits can leave commit bodies | `skills/brainstorming/reference/spec-finalization.md:136,206`; `reference/spec-pr.md:122`; `reference/amendment-surface.md:200-209` | Disproved. The spec-PR re-gate reads the council audit from a pushed branch, and `git revert` of an amendment commit undoes its audit with it. Both stay in commit bodies (user choice). |
| 19 | Plans and ledgers never reach a default branch | `git ls-tree` on consumer default branches | Disproved. customer-ops `9eba139f9` (PR #1172, committer GitHub) landed a loop ledger from a branch that never ran finish's strip. No gatekeep or check-delivery check exists for it. |
| 20 | Clean commits make a button squash short | customer-ops `ec4dde63e7`: 25 commits, 0 machine lines, 325-line body | Disproved. Only the repo setting or a framework-run merge shortens it. `squash_merge_commit_message` accepts `PR_BODY`, `COMMIT_MESSAGES`, `BLANK` (GitHub OpenAPI description). |
| 21 | `gh pr merge` can carry a message | `gh pr merge --help` | Held: `-t/--subject`, `-b/--body`, `-F/--body-file`, documented for the merge commit; behavior under `--rebase` is undocumented. |
| 22 | The hotfix PR path sets a title | `skills/chase-bug/hotfix.md:342-344` | Corrected: `gh pr create --base <default> --head hotfix/<slug>` passes neither title nor body. |
| 23 | The wave commit has a message rule | `skills/subagent-driven-development/SKILL.md:130` | Corrected: `commit -m <message>` with no rule. |
| 24 | The `Home:` line in companion squash messages is parsed | `rg 'Home: ' skills extensions src/bins` | Held as unread: written at `skills/finishing-a-development-branch/reference/legs.md:67`; it carries a spec path. |
| 25 | Existing eval samples assert the old labels | `rg` over `eval/*/samples` | Held: 71 samples in 8 targets (loop-implementation 34, gauntlet-resume 10, loop-implementer 9, brainstorming 7, subagent-driven-development 4, finishing-a-development-branch 3, gatekeep-pr 2, writing-plans 2). |
| 26 | Label-shaped strings that are not commit subjects | `rg` for quoted `resume: ` in `skills/` | Held: the phase-skip reason `resume: <spec path>` (`reconstruction.md:78,94,95`, `brief-contract.md:197`, `gauntlet-resume/SKILL.md:150`) is not a commit. |

Not checked: GitHub's treatment of an explicit squash title was not exercised (this flow merges no real pull request); see Open questions. Whether `--subject` / `--body-file` reach the landed commit when the target branch uses a merge queue is unverified: `gh pr merge --help` says only that the queue needs no merge strategy.

Found by the spec review after these lookups, and covered in Design sections 2, 3, 5 and 6: claim 7's list is incomplete. Commit text is also read by seed selection (`skills/loop-implementation/SKILL.md` Before each dispatch: "a validated `loop: seed evidence` commit ... survives"), by member-merge recovery (`skills/using-git-worktrees/reference/pr-head.md:72`, exact subject `merge PR #<N> head <sha7> into PR #<home>`) and by finish's review-thread count (claim 17). Claim 3's writer list also misses `conformance fix Gn` / `conformance fix CR` (`skills/verification-before-completion/reference/conformance-check.md:161-163`), `whole-diff minors fix` (`skills/finishing-a-development-branch/SKILL.md:223`), the loop driver's commit of verification-produced changes (After the loop step 1) and `Ignore .worktrees/` (`skills/using-git-worktrees/SKILL.md:139`).

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] One file, `skills/finishing-a-development-branch/reference/commit-message.md`, states the subject rule, the body rule, the landed-message shape, the word source for each commit situation and the squash-default note, and every commit site listed in Design "Commit sites" cites it instead of carrying its own subject template.
  in-scope
- [ ] `node scripts/commit-subject-lint.mjs` exits nonzero on a fixture that prescribes a commit subject starting with `loop: `, `amend: `, `grant: `, `plan: `, `resume: ` or `fix: <`, one fixture per label, and exits 0 on this repo's `skills/` and `agents/`, where the only such strings sit inside the marked legacy block of `skills/gauntlet-resume/reference/reconstruction.md` or follow `reason`.
  in-scope
- [ ] A loop worker dispatched on a home row commits exactly once with a one-sentence subject naming what the commit changes in the spec's terms; its commit message holds no `pending:` line, `iteration:` line, ledger row or decision line; the committed ledger holds `returned: <the dispatched tuple>` and no `pending:` line.
  in-scope
- [ ] The loop driver admits that home return from the committed ledger (the `returned:` tuple, `iterations:` plus one, the row cells and decision lines) without reading the commit message, and a clean one-commit return whose ledger carries the dispatched tuple on neither the `returned:` line nor a retained `pending:` line takes interrupted recovery with one attempt spent.
  in-scope
- [ ] A worker whose ledger is outside its repo (a second-repo leg, a gatekeep fix row, a hotfix seed or row) writes its tuple, iteration, rows and decisions to the return file under its checkout's git common dir before committing, and its parent admits the return from that file; a clean one-commit return with a missing, unreadable or mismatched return file takes its flow's validation-miss outcome (an ordinary or seed repair in the coordinated loop, one `validation miss` charged in the gatekeep fix wave, one row validation miss for a hotfix row, an abort before landing with no retry for a hotfix seed), and the parent deletes the file at admission, repair and recovery.
  in-scope
- [ ] Every loop-driver bookkeeping commit (ledger start, retry, allowance raise, escalation, row repair, seed repair, verification repair, companion record, amendment or cut, ledger conversion) carries its fixed sentence from the reference, or for an amendment or cut the reference's patterned amendment subject, and row repairs, seed repairs, verification repairs and amendments each append their line to the ledger's `## Decisions`.
  in-scope
- [ ] With allowance 3 and three `repair seed` lines in `## Decisions`, the driver renders `Stopped on seed` with `seed: 3 of 3` and dispatches nothing; with two `repair verification` lines and a `pending: verify` tuple on disk it counts 3 verification repairs; neither count reads a commit subject.
  in-scope
- [ ] The stuck-row hint for a row is set from the last two worker commits found through changes of the ledger's `returned:` value, and a driver commit that only appends a decision line is not counted as a worker commit.
  in-scope
- [ ] A session that dies after a home worker's commit and before admission is resumed through `/skill:gauntlet-resume`: the dispatch tuple and before-image are recovered from the committed `returned:` line, the return is admitted or recovered once, and the row's attempts and the ledger's iterations each rise by exactly one for that dispatch.
  in-scope
- [ ] Resuming a ledger with no `returned:` line converts it once: one `repair seed` line per legacy `loop: repair seed` commit and one `repair verification` line per legacy `loop: repair verification` commit since ledger base, plus `returned: none`, in one commit with the fixed plain subject; the seed and verification repair counts after conversion equal the legacy commit counts; a second resume writes nothing; the loop driver given an unconverted ledger stops with `ledger has no returned: line - resume through /skill:gauntlet-resume`.
  in-scope
- [ ] Finish's squash commit and its pull request title carry the landed message from the reference: the plain subject with the ticket reference when a ticket is bound, and for the squash a paragraph of at most three sentences and at most five outcome bullets drawn from the spec's in-scope acceptance rows.
  in-scope
- [ ] On a branch whose amendment commits carry plain subjects, finish's amendment digest lists every `auto-apply` and `granted` record those commits hold, and a plan-citation repair commit contributes none.
  in-scope
- [ ] The gatekeep merge passes an explicit landed subject and body to `gh pr merge` under the `squash` and `merge-commit` policies and passes neither under `rebase`.
  in-scope
- [ ] The gatekeep merge is withheld, naming the path, while the tree at the assessed head holds the task plan paired with its carried spec or that spec's loop ledger; a pull request whose head only deletes such a file is not withheld, and a failed tree lookup withholds with the lookup error instead of counting as absent.
  in-scope
- [ ] When the repo's `squash_merge_commit_message` is `COMMIT_MESSAGES`, finish's two pull request options and the gatekeep merge print the one-line squash-default note naming the setting and the values `PR_BODY` and `BLANK`; when the setting cannot be read they print nothing; no step writes a repo setting.
  in-scope
- [ ] The hotfix squash lands with a plain subject naming the fixed fault and the fault story as its body, and the hotfix pull request path passes that subject as the title and the fault story as the body.
  in-scope
- [ ] Spec, amendment, consent-change, plan, wave, plan-citation-repair, companion-spec and housekeeping class commits take their subjects from the reference; spec and amendment commits keep their audit bodies; housekeeping's amend delivery leaves the original message byte-identical.
  in-scope
- [ ] A loop, gatekeep-fix or hotfix run under this design adds no tracked path to any repo beyond the plan-dir ledger the loop engine already writes and finish already strips: return files exist only under a git common dir and `git status --porcelain` in every worker checkout is empty after each admitted return.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: single-commit-message-contract
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`); `node eval/run.mjs <target> <sample>` for each sample named in Design "Eval samples"
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
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9, AC 10, AC 11, AC 12, AC 13, AC 14, AC 15, AC 16, AC 17, AC 18
design: owns the new `skills/finishing-a-development-branch/reference/commit-message.md`, the skill, reference and persona files named in Design "Commit sites" and "Loop ledger protocol", `scripts/commit-subject-lint.mjs` with its `scripts/ci.mjs` wiring, the tests named in Tests, the eval samples named in Design, and the doc amendments named in Documentation impact.

## Design

Every skill, reference and persona edit follows `/skill:forge-skill` `## Authoring rules` (and `## Persona rules` for `agents/loop-implementer.md`). This is a behavior change, not a wording-only edit; the commit body says so.

### 1. The wording reference

Add `skills/finishing-a-development-branch/reference/commit-message.md`. It is the only place that states commit wording. It holds five parts.

**Subject rule.**

- One imperative sentence stating what the commit changes, for a reader who has not seen the code. Capitalized first word, no trailing period.
- At most 72 characters, not counting a trailing ticket or pull request reference.
- No file paths, code identifiers or commit ids. A ledger row number appears only in the fixed bookkeeping sentences below.
- No framework label: the subject never starts with `loop:`, `amend:`, `grant:`, `plan:`, `resume:`, `fix: <slug>` or any other framework-internal word followed by a colon.
- A project's own subject convention from the overrides file (`## conventions`, for example a scope prefix) applies on top of this rule.
- Ticket reference: when a ticket is bound to the spec or the run, the landed message, the pull request title, and every worker, wave, spec and amendment commit carry it in the place and form the overrides `## Issue tracker` `refs:` line names; with no `refs:` line, as a trailing `(ref <ticket-id>)` in the subject. With no bound ticket, no reference. Ledger bookkeeping commits carry none.
- Ticket source: the committing skill or dispatcher resolves the bound ticket once and never guesses. Spec-driven flows (spec, amendment, plan, loop, wave, verification repair, finish) read the spec header's `**Ticket:**` line; the plan engine's plan header carries the same value. Gatekeep reads the carried spec's `**Ticket:**` line, else the ticket its roster row already takes from the pull request title or the body's first line under the `refs:` convention. The hotfix and housekeeping use the ticket their handoff record or card names, when it names one. No value at the source means `none`. Every worker dispatch passes `ticket: <reference or none>` beside `wording:`; a worker never derives the ticket itself.

**Body rule.** Empty, or whole sentences saying what changed and why. No `pending:` or `iteration:` line, no ledger row, no decision line. Two bodies keep record lines: the spec commit's council audit and the amendment commit's audit rows. Git trailers such as `Co-authored-by:` are allowed.

**Landed message.** Used for finish's squash, the gatekeep merge and the hotfix squash:

```text
<subject>

<one paragraph, at most three sentences: what changed for the user and why>

- <outcome, one in-scope acceptance row restated as something observed>
- <at most five bullets; related rows merge into one bullet, never a sixth>
```

The hotfix landing uses the fault story as its paragraph and has no bullets. A coordinated companion squash ends with `Home: <repo> <shared branch>` (no spec path); the home squash keeps its list of companion squash ids. Illustration (invented):

```text
Count dedicated-import plants in compliance pagination (ref E-1234)

Compliance pages skipped plants that exist only in the dedicated
import, so page counts disagreed with totals. The query now includes them.

- Page counts match the plant total for single-company views
- Imported profile answers appear on the plant's compliance page
```

**Word sources.**

| Situation | The words come from |
|---|---|
| Loop worker, row target | the target acceptance row in the spec: what this commit makes true, or on a failed attempt the part it built; never that an attempt failed |
| Loop worker, seed target | the checks it added or recorded, in the spec's terms |
| Verification repair worker | the failing check it repaired |
| Gatekeep fix row or helper | the finding it closes |
| Hotfix seed or row | the fault under repair, from the handoff record |
| Spec commit | the spec's H1, shortened to fit: `Add the <topic> spec` |
| Companion spec file commit | the same subject as the home spec commit |
| Amendment commit | `Amend the spec for <first item title, shortened so the whole subject fits the limit>`, plus ` and <N-1> more` for N > 1 |
| Plan commit | `Add the implementation plan for <spec H1, shortened to fit>` |
| Plan task and wave commit | the wave's task titles in the plan: one sentence naming what the wave delivers |
| Housekeeping class commit | the card's title |
| Conformance gap fix commit | the gap's title: what the fix makes true |
| Convergence repair commit | the failing commands and review findings it repairs, as one sentence |
| Whole-diff minors fix commit | the selected Minor findings, as one sentence |
| Member pull request merge commit | the member pull request's title, shortened to fit, with a trailing `(#<N>)` |
| Landed message and pull request title | the spec's `**Goal:**` line and in-scope acceptance rows; with no spec, the pull request's title and description |
| Hotfix landing and hotfix pull request | the fault story in the handoff record |

**Fixed bookkeeping sentences.** The loop driver may not read the spec inside the loop, so its commits use these subjects verbatim:

| Event | Subject |
|---|---|
| Ledger skeleton | `Start the acceptance ledger` |
| Retry | `Grant acceptance row <n> one more attempt` |
| Allowance raise | `Raise the attempt allowance by <n>` |
| Escalation | `Escalate acceptance row <n> to the stronger model` |
| Row repair (validation miss or interrupted) | `Record a failed attempt on acceptance row <n>` |
| Seed repair | `Record a failed baseline attempt` |
| Verification repair marker | `Record a verification repair` |
| Companion record | `Record the <repo> result for acceptance row <n>`; for seed `Record the <repo> baseline` |
| Allowance migration (resume) | `Convert the ledger to a per-row allowance` |
| Returns conversion (resume) | `Convert the ledger to ledger-held returns` |
| Consent change | `Change the standing amendment consent` |
| Verification-produced changes (After the loop step 1) | `Keep the changes the verification run produced` |
| Worktree directory ignore (worktree setup) | `Ignore the worktree directory` |
| Plan citation repair (resume) | `Repair <n> plan citations` |

**Squash-default note.** One read and one line, cited by finish and gatekeep:

- Read `gh api repos/<owner>/<repo> --jq .squash_merge_commit_message`. Gatekeep adds the field to the read it already makes at `post-selection-loop.md:130`.
- On `COMMIT_MESSAGES` print exactly: `Note: this repo's squash default (squash_merge_commit_message: COMMIT_MESSAGES) pastes every branch commit into the landed message when someone merges from the GitHub button; set it to PR_BODY or BLANK in the repo settings to stop that.`
- On any other value, or a failed read, print nothing. Never write a repo setting.

Personas cannot resolve a path under `skills/`. Each dispatcher resolves the reference to an absolute path from its own loaded `SKILL.md` directory and passes it as a `wording: <absolute path>` task line, with the `ticket:` line from the subject rule. A worker that cannot read the file writes one plain imperative sentence naming what the commit changes and continues; nothing inspects a subject at run time.

### 2. Commit sites

Each site drops its own template and cites the reference (relative path from the citing file).

| Site | Today | After |
|---|---|---|
| `agents/loop-implementer.md` steps 7, seed, Companion result commit, Boundaries, the coordinated-home sentence | `loop: row <n> <status>` / `loop: seed evidence`; body block; "ledger headers (except removal of `pending:`)" | subject from the `wording:` file; message without machine lines; protocol per section 3; both header-preservation sentences also permit setting `returned:` to the dispatched tuple |
| `skills/loop-implementation/SKILL.md` (Entry 5, Before each dispatch, Validate the return, Human stop, After the loop 1) | 11 `loop:` parent subjects; seed selection by a surviving `loop: seed evidence` commit; "Commit verification-produced tracked changes" with no subject rule | fixed bookkeeping sentences; decision lines, header deltas and seed completion per section 3 |
| `skills/loop-implementation/reference/interrupted-recovery.md` | `loop: repair row <n>`, `loop: repair seed` | fixed sentences plus `repair row` / `repair seed` lines |
| `skills/loop-implementation/reference/coordinated-legs.md` | `loop: record <repo> row <n>`; subject and body checks in the admission shell | fixed sentence; shell reads the return file |
| `skills/loop-implementation/reference/unreachable-returns.md` | amendment through the loop subject | amendment subject from the reference |
| `skills/gatekeep-pr/reference/fix-wave.md` (pi tail, Claude Code tail, Admission) | `loop: row <n> <done\|failed>` plus body block; "a subject naming the fix" | return file; subject from the reference on both harnesses |
| `skills/gatekeep-pr/reference/post-selection-loop.md:130,159`, `reference/menus.md:67` | `gh pr merge --match-head-commit <sha>` with a policy flag only | section 6 |
| `skills/chase-bug/hotfix.md` (step 4 admission, seed hint, step 8) | `loop:` subjects plus body block; `fix: <slug>`; PR with no title | return file; plain landing subject; PR title and body |
| `skills/housekeeping/reference/fix.md` | class commit with no subject rule | subject from the reference (source: the card's title) |
| `skills/subagent-driven-development/SKILL.md:45,130` | `plan: <spec title>`; `commit -m <message>` | plan commit and wave commit sources |
| `skills/writing-plans/SKILL.md:260,359` | `<imperative subject> (ref <ticket-id>)` template; `plan: <spec title>` | cites the reference |
| `skills/brainstorming/reference/spec-finalization.md:122` | `<subject>` with no rule | spec commit source; audit body unchanged |
| `skills/brainstorming/reference/amendment-surface.md:36,201-209` | `grant: <value>` subject; `amend: <N> item(s) - ...`; loop subject for a ledger batch | `Change the standing amendment consent` with one whole sentence naming the new value as the body; amendment subject from the reference for plan and ledger batches alike; audit rows unchanged |
| `skills/brainstorming/reference/legs.md:206` | companion spec file commit with no subject rule | companion spec source |
| `skills/gauntlet-resume/reference/brief-contract.md:257,260`, `reference/reconstruction.md:98` | `resume: plan citation repair - <n> findings`; `loop: migrate allowance` | fixed sentences; line 260's "finish ignores it by subject" sentence goes |
| `skills/finishing-a-development-branch/SKILL.md:158,311,344`, `reference/legs.md:67` | subject grep for the digest; `--title "<title>"`; `commit -m "<imperative summary> (ref <ticket-id>)"`; `Home:` with a spec path | section 5 |
| `skills/finishing-a-development-branch/SKILL.md:223` | commit `whole-diff minors fix` | minors-fix source; the block's `whole-diff minors fix: <full SHA>` line keeps its name and stays the only record of the spent round |
| `skills/finishing-a-development-branch/SKILL.md:256-262` (PR-subject row 1) | counts commits whose message names a thread id (`--grep '<thread id>'`) | section 5 |
| `skills/verification-before-completion/reference/conformance-check.md:161-163,203-205` and its restatements at `:327,396,430,459` | commit messages `conformance fix Gn` and `conformance fix CR`, "so the finish gate and any revert can identify auto-applied fixes" | gap-fix and convergence-repair sources; the `auto-applied fix commits: <Gn: SHA>, ...` index, already written, is the only identity of a gap fix; a convergence repair stays out of that index |
| `skills/finishing-a-development-branch/reference/disposition-protocol.md:26,36,50`, `SKILL.md:152` | `revert conformance fix Gn` reverts "the `conformance fix Gn` commit" | the action token `revert conformance fix Gn` keeps its grammar (it is menu text, not a commit subject); the revert takes the SHA the index holds for `Gn` |
| `skills/using-git-worktrees/SKILL.md:139` | `commit -m "Ignore .worktrees/"` | fixed sentence `Ignore the worktree directory` |
| `skills/using-git-worktrees/reference/pr-head.md:72,74,118,120,122` | `merge PR #<N> head <sha7> into PR #<home>` as the merge message and as an exact-subject recovery predicate; "Preserve the canonical subject" | member-merge source; recovery per "Member-merge recovery" below |

**Member-merge recovery.** `pr-head.md` "Recover an interrupted sync" recognizes a member merge by structure only. The first-parent walk drops `%s` (`log --first-parent --format='%H %P' <headRefOid>..<local home tip>`). Recognition needs a nonempty walk in which every entry has exactly two parents: the first on the home line (the first-parent walk guarantees it, down to the home `headRefOid`) and the second equal to the full original `headRefOid` of an admitted member of the list, each member at most once. `<N>` and `<sha7>` in the `Member merge: #<N> <sha7> (already landed)` report come from that matched member and the merge commit. Any other entry takes the existing carries-commits-beyond stop. The two instructions to preserve or retain the canonical subject go; a hand-made merge with any message is recognized.

Unchanged fixed-text commits: `Remove ephemeral plan doc`, `Release <version>`, and the scratch-tree `wave integrated snapshot`.

### 3. Loop ledger protocol

The home ledger stays in the branch's plan dir and finish strips it, as today. Three things change: where the dispatch tuple lives after a return, where an outside-ledger worker puts its result, and where the driver counts.

**The `returned:` line.** The ledger header holds exactly one `returned:` line, directly after `allowance:`. The skeleton writes `returned: none`. The driver's pre-dispatch write is unchanged (bump `iterations:`, add `pending: <target> | <repo> | <HEAD sha>`).

- Home worker: in its one commit it sets the `returned:` value to the dispatched tuple and deletes the `pending:` line, beside its row and decision changes. Its commit message carries no tuple, iteration, row or decision.
- Companion return: the home record commit sets `returned:` to the companion tuple when it writes the admitted rows and removes `pending:`.
- Repairs: an ordinary-miss or seed-miss repair restores headers from the saved copy except `returned:`, which it leaves at the dispatched tuple when the child wrote it and sets to that tuple when the child left `pending:` in place. Without this exemption the restore would put the previous tuple back and the stagnation scan would list an older return a second time. An interrupted-recovery repair restores the saved copy's `returned:` value: its reset removed the worker commit, so no return exists. Verification repair markers never change `returned:`.
- The loop driver requires a `returned:` line before each dispatch; without one it stops with `ledger has no returned: line - resume through /skill:gauntlet-resume`. The external gatekeep and hotfix ledgers carry no `returned:` line; their parents own them and keep `pending:` as the only in-flight marker.

**Home admission (`## Validate the return` step 1).** Require a DONE return, a clean tree, exactly one commit after `HEAD_BEFORE`, and the ledger at HEAD carrying the dispatched tuple on the `returned:` line, or on a retained `pending:` line (that case stays a validation miss, as today). Any other result, including a tuple on neither line, takes `## Interrupted recovery` with reason `wrong attribution`. The consumed iteration is the committed `iterations:` header. Step 2 admits exactly three header changes against the saved copy: `iterations` +1, removal of the dispatched `pending:` line, and `returned:` changing from the saved value to the dispatched tuple. It still rejects every other header change, including allowance, and the Ordinary row's "apart from the dispatch header changes" names the same three. The rest of the table is unchanged. No step reads a commit subject or body.

**The return file.** For a worker whose ledger is outside its repo (coordinated companion, gatekeep fix row, hotfix seed and row):

- Path: `<git dir>/gauntlet/returns/<pre-dispatch HEAD sha>-<consumed iteration>.md`, with `<git dir>` from `git -C <worker checkout> rev-parse --path-format=absolute --git-dir`. That is the checkout's own git dir: the common dir itself in a primary checkout and `<common dir>/worktrees/<id>` in a linked worktree, so the file always sits under the git common dir and two worktrees of one repo dispatching from the same base at the same iteration (two hotfixes cut from one default-branch HEAD) never share it. Resume recomputes the path from the same checkout, the tuple's SHA and the consumed iteration; nothing else stores it. The parent creates the directory, deletes any file already at that path, and passes `return: <absolute path>` in the task.
- Content, written by the worker before it commits: line 1 the dispatched `pending:` tuple, line 2 `iteration: <consumed>`, a blank line, the four-column rows without a header, a blank line, one decision line per row with the target first. This is the grammar the commit body carries today, unchanged.
- Admission keeps the boundary (clean tree, exactly one commit) and reads the file where it read the commit body. Every subject check goes. The `<!-- companion-return-shell -->` script takes the return file path as a fifth argument in place of `git show -s --format=%B` and drops its two subject assertions.
- A clean one-commit return with a missing, unreadable or mismatched file is a validation miss: ordinary or seed repair in the coordinated loop, `validation miss` in the gatekeep fix wave, `any other seed miss` (abort, pre-land) or a row validation miss in the hotfix.
- The parent deletes the file after admission, after a validation-miss repair and in interrupted recovery. The hotfix removes any remaining file with its ledger on every exit.

**Decision lines.** Four new kinds under `## Decisions`, each written in the commit that performs the action:

| Line | Written by |
|---|---|
| `repair row <n> \| <concrete miss, or interrupted - <reason>> \| iteration <i>` | ordinary-miss repair and interrupted recovery for a numbered target |
| `repair seed \| <seed miss: <miss>, or seed interrupted: <reason>> \| iteration <i>` | seed repair |
| `repair verification \| <repo> <child sha7, or interrupted - <reason>> \| iteration <i>` | the verification repair marker |
| `amended \| <cut row <n>, or <N> item(s)> \| <first item title>` | the amendment or cut commit, beside its spec change |

Existing lines keep their grammar: child `row <n> done|failed`, `row <n> retry`, `row <n> escalated`, `rows +<n>`, the hotfix's `row 1 reopened`. A repair line is driver bookkeeping, never a child decision: it is not a `previous decision:` input and not the "latest operational decision".

**Counting.**

- Seed completion: the driver selects `seed` until the ledger at HEAD holds an admitted `row 0 done | seeded ...` decision line; a coordinated leg is seeded when its `seeded <repo>: yes` value is set, which only an admitted seed return writes. A seed-miss or interrupted seed repair restores decisions from the saved copy, so a missed seed leaves no such line. No surviving commit or subject is consulted, and a validated partial seed still never re-seeds.
- Seed attempts: the number of `repair seed` lines. The retry hint is the second cell of the latest one.
- Verification repairs: the number of `repair verification` lines, plus one for a `pending: verify` tuple on disk. The line is written in the commit that clears that tuple, so one dispatch is never counted twice.
- A row's window starts after the later of its latest `row <n> retry` line and the latest `amended` line. With neither line the window starts at ledger base and every return in `<ledger base>..HEAD` is inside it. On a converted ledger no window reaches back past the conversion commit (section 4). Raising the allowance resets no window.
- Consecutive validation misses on row n: among the window's `row <n> done|failed` child decisions and `repair row <n>` lines whose second cell does not start `interrupted - `, the last two are both repair lines.
- Empty-child stagnation on row n: list the commits in `<ledger base>..HEAD` whose ledger `returned:` value differs from their first parent's (`git log -G'^returned: ' --format=%H <base>..HEAD -- <ledger path>`, then compare values with `git show <sha>:<ledger path>`). Each is one return with tuple `<target> | <repo> | <S>`; skip `none`. Its worker commit is the first commit after `S` on that repo's branch, read in the checkout that owns the tuple's repo (`git -C <that leg's checkout> rev-list --reverse --ancestry-path <S>..HEAD`, first line); its changed files come from `git -C <that leg's checkout> show --format= --name-only <worker sha>`. A companion commit is not in the home object store, so neither read runs in home for a companion tuple, and a failed read stops the driver naming the command instead of counting as "no files". Row status comes from the home ledger before and after the return: at `S` and at the worker commit for a home tuple, at the listing commit's first parent and at the listing commit for a companion tuple. Membership binds to the worker's dispatch, not to the commit that recorded the return: a return is inside the window when the home ledger its worker was dispatched against already holds the window's starting line (the ledger at `S` for a home tuple; the ledger at the listing commit's first parent for a companion tuple, because home HEAD does not move during a companion dispatch). A repair that writes `returned:` later than the worker commit therefore never moves that worker into a newer window. The hint is set when the last two worker commits for row n inside the window each changed no file outside the ledger and no row status.

`## Driver holds` drops `show -s --format=%b` and `log --format=%s <base>..HEAD` from the permitted reads and gains the git reads above (the `-G` listing and ledger snapshots in home, `rev-list` and `show --format= --name-only` in the tuple's owning checkout) and the return file.

**Verification repair (After the loop step 1).** The pre-dispatch write is unchanged: save the home ledger and the home and failing-leg HEADs, bump `iterations:` once, write `pending: verify | <repo> | <HEAD>` on disk. The `implementer` task keeps the exact tuple, the consumed iteration and the pre-bump iteration it carries today (attribution evidence and the jobs-file identity) and gains `wording:` and `ticket:`; a companion repair also gets `return:`. None of it goes into the commit message. The existing validation matrix stays whole; only the two commit-body reads are replaced:

- Boundary, as today: DONE, a clean failing checkout, exactly one commit after `HEAD_BEFORE`.
- Home attribution: the child's one commit includes the already-bumped ledger, so the ledger at that commit holds `iterations:` equal to saved + 1 and the retained `pending: verify` tuple equal to the dispatched one.
- Companion attribution: the return file's first two lines are the dispatched tuple and `iteration: <consumed>`, with no row or decision after them; home HEAD is unchanged and home's only dirt is the bump and the tuple.
- Unchanged state, as today: every ledger row, attempts cell, mapping, `allowance:`, `returned:` and prior decision equals the saved copy.
- A clean single commit that fails attribution, or a commit that changed any protected ledger field, is `wrong attribution` or an invalid repair and takes the existing interrupted path (reset, one empty marker, no second bump).

The parent marker commit appends the `repair verification` line and removes `pending:`; a companion's return file is deleted with it. On resume, a `pending: verify` tuple on disk is admitted only through this same matrix, so an unrelated commit made while the session was dead is never recorded as the repair; anything else is recovered by the existing path.

### 4. Resume

`skills/gauntlet-resume/reference/reconstruction.md` Pending recovery, for a converted ledger:

- With no `pending:` on disk, read the `returned:` tuple from `HEAD:<ledger path>`. `none` means no return to recover. Classify the tuple from home-ledger evidence before reconstructing anything; the home-worker recipe below applies only to an unsuperseded home return.
  - Companion tuple (its repo is not the home member): the home record commit or a home repair commit wrote it, after admission or recovery finished and the return file was deleted. It is settled and there is nothing to recover: keep the current ledger. Its SHA belongs to the companion repo and is never looked up in home.
  - Home tuple superseded by a parent commit: a later home commit whose ledger diff appends the `repair row <n>` or `repair seed` line for that return, or an approved ledger mutation, as the existing settled-evidence rules already prove from the actual ledger diff. Settled; never replayed.
  - Unsuperseded home return: the return commit is the first commit after the tuple's SHA; the consumed iteration is that commit's `iterations:` header; the before-image is the ledger at the tuple's SHA.
  The settled-evidence rules, the human question on ambiguous history and the recovery table are unchanged.
- Pending companion recovery (a companion `pending:` tuple on disk) takes its before-image from home history, as `coordinated-legs.md` `## Resume` does today: home HEAD does not move during a companion dispatch, so the pre-dispatch ledger is home `HEAD:<ledger path>`. It matches attribution against the return file's first two lines, with the path recomputed from the companion checkout, the tuple's SHA and the on-disk consumed iteration. A missing file at a clean one-commit boundary is the ordinary or seed repair of section 3.

A ledger with no `returned:` line was seeded before this change. One block in `reconstruction.md`, fenced by `<!-- legacy-commit-labels:begin -->` and `<!-- legacy-commit-labels:end -->`, is the only place legacy commit text is read:

1. Pending recovery for such a ledger uses the legacy attribution: subject `loop: row <n> <status>` or `loop: seed evidence`, body lines 1-2 as the tuple and iteration; for a companion, write the commit body (`git show -s --format=%b`) to a temp file and pass it to the admission shell as the return file.
2. Conversion runs on a clean, tuple-free ledger, after the allowance migration and before the post-migration validation and the single `plan_tracker refresh`. It ships as an embedded script under `<!-- ledger-conversion-shell -->`: for each commit in `<ledger base>..HEAD`, oldest first, whose subject is exactly `loop: repair seed` or `loop: repair verification`, append `repair seed | <body line 1, pipes escaped, or converted> | converted <sha7>` or the `repair verification` equivalent; insert `returned: none` after `allowance:`. A ledger that already has a `returned:` line is left untouched and the script exits 0.
3. Commit the converted ledger as `Convert the ledger to ledger-held returns`. Step 4.3's validation also requires the `returned:` line.

The two hint windows start at the conversion: legacy row repairs, amendments and worker commits are not converted, because they feed only the rule-3 hint, never a stop. Row attempts, iterations, allowance, escalation markers and both repair budgets carry over exactly.

`skills/gauntlet-handoff` is unchanged.

### 5. Finish

- Option 3: `git -C "$PRIMARY" commit -F -` with the landed message on a quoted heredoc, replacing `commit -m "<imperative summary> (ref <ticket-id>)"`.
- Options 1 and 2: `--title` is the landed subject. The pull request body keeps its `## Summary` / `## Test Plan` layout. After `gh pr create`, apply the squash-default note.
- Amendment digest (Step 4): read `git -C "$WORKTREE" log <base-branch>..HEAD --format=%b` and take every line matching `^- [^|]+ \| [^|]+ \| [^|]+ \| (auto-apply|granted) \| `. The `--grep` on subjects goes.
- Review threads (PR-subject row 1): the `git log --grep '<thread id>'` count goes, and no commit message has to carry a thread id. `fixed in <sha7>` renders only when the accepted-complete task evidence captured before the strip records one fix commit SHA for the thread's task; with none recorded the row renders the existing `fixed (task "<title>" complete; no single commit names <thread id>)` form. Both row conditions lose "naming commit"; the other rows are unchanged. Where each engine records that SHA is an Open question; until it is settled every such thread takes the second form.
- `reference/legs.md`: companion squash messages end with `Home: <repo> <shared branch>`; companion pull request bodies keep the full `Home:` line with the spec path.

### 6. Gatekeep merge

- Message: under `squash` and `merge-commit` the merge runs `gh pr merge --match-head-commit <assessed-sha> <policy flag> --subject "<landed subject> (#<N>)" --body-file -` with the landed body on stdin. Under `rebase` it passes neither. Words come from the carried spec at the assessed head when the run has one (`scope.source: spec`), else from the pull request's title and description; a title that already meets the subject rule is used as the subject. On a branch behind a merge queue the flags are still passed, but the queue owns the landing and the framework does not guarantee the landed text there (Open questions); the existing `merge queued` path is unchanged.
- New merge precondition (`### Merge preconditions`): with a carried spec, the tree at the assessed head holds neither the task plan paired with that spec by basename nor `<sibling plans dir>/<spec stem>-ledger.md` (the two candidates of finish's strip block). The check looks up those two exact paths in the tree at `<assessed-sha>`, never the pull request's file list: a file list is a diff, so it would withhold a head that correctly deletes a base-tracked plan and miss an unchanged base-tracked plan that still lands. With a local object the lookup is `git ls-tree --name-only <assessed-sha> -- <path>`: exit 0 with no output is absence, exit 0 with the path is a hit. On a hit the `merge` row is withheld with `<path> is a plan file finish removes before landing`. A lookup that fails (nonzero exit or an API error) withholds `merge` with that error and is never read as absence. With no carried spec the check is skipped.
- The settings read at `post-selection-loop.md:130` gains `squash_merge_commit_message`, and the merge course applies the squash-default note.

### 7. Lint

Add `scripts/commit-subject-lint.mjs`, run from `scripts/ci.mjs`. It scans `skills/**/*.md` and `agents/*.md` and fails, naming file and line, on a backtick-, single-quote- or double-quote-opened string that starts with `loop: `, `amend: `, `grant: `, `plan: `, `resume: ` or `fix: <` (case-sensitive), and on a line inside a fenced code block whose first non-blank text is one of those labels (the unquoted template and heredoc forms). Two exemptions: text between the `legacy-commit-labels` markers, allowed only in `skills/gauntlet-resume/reference/reconstruction.md`, and a string directly preceded by `reason ` or `reason: ` (the phase-skip reason).

The lint does not scan `doc/`. `scripts/commit-message-contract.test.mjs` asserts that `doc/configuration.md`, `doc/implement-engines.md` and `doc/gate-contract.md` state no such label as current contract.

### 8. Moving parts

Remove:
- every `loop:` subject template (13 kinds) in `skills/loop-implementation/`, `agents/loop-implementer.md`, `skills/gatekeep-pr/reference/fix-wave.md`, `skills/chase-bug/hotfix.md`, `skills/gauntlet-resume/reference/reconstruction.md` (outside the legacy block);
- the `amend:`, `grant:`, `plan:`, `resume:` and `fix: <slug>` subject templates at the sites in section 2;
- the worker commit-body block (tuple, iteration, rows, decisions) in the persona and the four admission texts;
- the subject and body comparisons in `## Validate the return`, the companion admission shell, fix-wave Admission and hotfix step 4;
- the three history scans by subject (seed repairs, verification repairs, row windows), seed selection by a surviving `loop: seed evidence` commit (skill and `doc/configuration.md:140`) and the two commit-text reads in `## Driver holds`;
- the subject `--grep` in finish Step 4 and the sentence in `brief-contract.md:260` that depends on it; the thread-id `--grep` count in finish PR-subject row 1;
- the `conformance fix Gn` / `conformance fix CR`, `whole-diff minors fix`, `Ignore .worktrees/` and `merge PR #<N> head <sha7> into PR #<home>` message templates, the canonical-subject recovery predicate in `pr-head.md` and its two preserve-the-subject instructions;
- the "retained committed tuple" row's dependence on a deleted `pending:` line, replaced by the `returned:` rule;
- the spec path on the `Home:` line of companion squash messages.

Add:
- `skills/finishing-a-development-branch/reference/commit-message.md`;
- the `wording:` task line at every worker dispatch (loop Dispatch, coordinated dispatch, verification repair, fix-wave row task and helper, hotfix dispatch) with the `ticket:` line beside it, and the `return:` task line at the three outside-ledger dispatches and the companion verification repair;
- the `returned:` header line, its skeleton value, and the driver's missing-line stop;
- the return file path rule, its lifecycle, and the fifth argument of the admission shell;
- the four decision-line kinds and the counting rules;
- the legacy block with its conversion script in `reconstruction.md`;
- the landed-message commit forms in finish Option 3, the gatekeep merge and the hotfix squash; `--title` and `--body` on the hotfix pull request;
- the plan-file merge precondition and the squash-default note at finish Options 1 and 2 and the gatekeep merge;
- `scripts/commit-subject-lint.mjs`, its test, and its `scripts/ci.mjs` entry;
- the isolated tests in Tests and selected eval samples below;
- the isolation policy in `eval/README.md` and its authoring pointer and sample-scoped run commands in `eval/_template/README.md`.

No extension or bin source changes are planned: the ledger readers already skip unknown lines (claim 11). If a parser test in Tests fails, the fix lands in that reader and `npm run build:bins` regenerates the bundles.

### 9. Eval samples

Existing samples: the 71 samples of claim 25 state the old labels or the commit-body block in `case.md` or `expected.md`. Reword each to the ledger contract in the same change (fixture ledgers gain `returned:`; expected facts name decision lines and return files). They are not rerun; the evidence names them as coverage not re-proven.

The following table is a behavior coverage map, not a requirement to run eighteen model samples. Test each piece in isolation, with no end-to-end model eval. Use deterministic fixtures for executable parsers, counters, git recipes, return-file lifecycle and caller wiring. Use selected model samples only where interpreting the changed instructions or composing prose needs observation. Each target's `intent.md` names the behavior its selected sample covers; report any coverage moved to deterministic checks rather than claiming a model pass.

For each selected model sample, record its entry boundary, fixed upstream state, inspected output and stop boundary in `case.md`. Start immediately before the changed decision and stop at its output: compose a message without implementing or delivering the change; decide admission without running the worker or the next attempt; decide recovery without continuing implementation. Keep variants to one decision axis and separate independent decisions. Preserve the table's behavioral obligations through isolated tests or samples; never relax the return, recovery, budget or migration contract to shorten a check.

Update `eval/README.md` with this isolation-first policy, the deterministic-test/model-eval distinction, a concrete commit-message example and the requirement to justify each model call. Route sample authors there from `eval/_template/README.md`, and fix its baseline-seeding example to require an explicit sample selector. These documentation changes ship in this work. Do not change the eval runner or add a new enforcement subsystem. Preserve completed records; changed inputs invalidate their currency rather than retroactively proving the narrowed case. Do not rewrite all 71 legacy samples as a prerequisite to the current isolated check; handle only stale contract text required by a changed target's integrity, and disclose untested coverage.

| Target / sample | Must hold |
|---|---|
| `loop-implementer/home-plain-commit` | one commit; subject is one plain sentence in the spec's terms with no label; message has no tuple, iteration, row or decision line; ledger has `returned: <tuple>` and no `pending:` |
| `loop-implementer/outside-ledger-return-file` | writes the return file at the `return:` path before committing; file starts with the tuple and iteration lines; commit message has none of them; home ledger untouched |
| `loop-implementation/returned-line-admission` | admits a home return from the committed ledger without reading the commit message; routes a tuple on neither line to interrupted recovery; stops on a ledger with no `returned:` line with the resume pointer |
| `loop-implementation/repair-lines-budget` | writes `repair seed` / `repair row` lines with the fixed subjects; selects `seed` again after a seed-miss repair and stops selecting it once the ledger holds the admitted `row 0 done \| seeded ...` line, reading no commit; stops on seed at allowance from line count; counts a `pending: verify` tuple once |
| `loop-implementation/bookkeeping-subjects` | retry, allowance raise, escalation, companion record and amendment commits use the fixed sentences and the `amended` line; no `loop:` subject |
| `gauntlet-resume/returned-line-recovery` | recovers tuple and before-image from the committed `returned:` line; admits once; no second iteration bump; treats a companion tuple left by an admitted return whose return file is deleted as settled and looks up no companion SHA in home; with a `pending: verify` tuple, does not record an unrelated single commit or a commit that changed a ledger row as the repair |
| `gauntlet-resume/legacy-ledger-conversion` | recovers a legacy pending return by the legacy attribution, converts with one line per legacy repair marker and `returned: none`, commits `Convert the ledger to ledger-held returns` before refresh; second resume writes nothing |
| `gatekeep-pr/merge-landed-message` | squash merge carries `--subject` and a body; rebase carries neither; prints the squash-default note on `COMMIT_MESSAGES` and nothing on a failed read |
| `gatekeep-pr/merge-plan-file-withheld` | withholds `merge` naming the ledger path when the head adds it and when an unchanged base-tracked plan is still in the head tree; a head that only deletes the plan does not withhold; a hand-added file elsewhere in the plans dir does not withhold |
| `gatekeep-pr/fix-row-return-file` | admits a fix row from the return file; a commit with no file is one validation miss; no subject requirement |
| `chase-bug/hotfix-return-file` | seed and row admitted from return files; a missing seed file aborts pre-land |
| `chase-bug/hotfix-plain-landing` | squash subject is a plain sentence naming the fault, not `fix: <slug>`; the PR path passes title and body |
| `finishing-a-development-branch/landed-message` | squash message has the subject, at most three sentences, at most five bullets and the ticket reference; PR title equals the subject; squash-default note printed on the PR options |
| `finishing-a-development-branch/digest-from-record-lines` | digest lists `auto-apply` and `granted` records from plain-subject amendment commits; a plan-citation repair commit adds none |
| `subagent-driven-development/wave-commit-subject` | wave commit and plan commit subjects are plain sentences from the plan and spec title with the ticket reference; no `plan:` |
| `writing-plans/plan-commit-subject` | plan commit `Add the implementation plan for ...`; task commit steps cite the reference |
| `brainstorming/spec-and-amendment-subjects` | spec commit subject from the H1 with the audit body intact; amendment commit `Amend the spec for ...` with audit rows intact; consent change commit with one sentence naming the value as body |
| `housekeeping/class-commit-subject` | class commit subject from the card title; amend delivery keeps the original message |

### Paid and external actions

| Action | Runner | Inputs |
|---|---|---|
| `node eval/run.mjs <target> <sample>` (model calls), and `node eval/run.mjs <target> <sample> --baseline-only` where a sample declares `bundle-` lines | the main loop or owning implementer, from the worktree root, bounded parallel per `eval/README.md` | explicitly selected isolated samples from the behavior map above; name the model-dependent fact before each call and rerun only affected cases after batched wording fixes; no end-to-end or target-wide replay |

Approving this spec authorizes every named action for the whole flow across seed, rows, repairs and finish, without per-step permission prompts; any count is advisory. No other paid or external action is needed: no real pull request is opened or merged, and no repo setting is read outside fixtures.

## Errors and edge cases

- Home return with a dirty tree, zero or several commits, a dispatch error or a non-DONE reply: interrupted recovery as today; the repair appends `repair row <n> | interrupted - <reason> | iteration <i>` (or the seed line).
- Home return whose committed ledger still has the `pending:` line: validation miss as today; the repair sets `returned:` to that tuple and removes `pending:`.
- Return file present from an earlier run at the same path: the parent deletes it before dispatch, so it never admits.
- Worker wrote the return file and died before committing: zero commits, interrupted recovery, file deleted.
- Clean one-commit return with a missing, unreadable or mismatched return file: an ordinary or seed repair in the coordinated loop; one `validation miss` in the gatekeep fix wave; one row validation miss for a hotfix row; an abort before landing with no retry for a hotfix seed.
- Two linked worktrees of one repo dispatching from the same base at the same iteration: each return file sits under its own checkout's git dir, so neither parent deletes or admits the other's.
- Resume after an admitted companion return, return file already deleted: the companion tuple on `returned:` is settled; nothing is reconstructed and no companion SHA is read in home.
- Fresh ledger with no retry or `amended` line: both hint windows start at ledger base.
- Return directory not writable: the parent's directory creation fails before dispatch; the loop stops naming the path, the gatekeep wave exits `stuck`, the hotfix aborts pre-land. No dispatch runs.
- Legacy ledger with a pending return in flight: recovered by the legacy attribution, then converted.
- Legacy gatekeep fix row or hotfix row in flight at upgrade (commit body, no return file): one validation miss, the step reruns under the row's budget. A legacy hotfix seed in flight at upgrade aborts before landing, as any hotfix seed miss does; it is not rerun.
- Conversion on a ledger with no legacy repair commits: only `returned: none` is added.
- No ticket bound: no reference anywhere. More than five in-scope outcomes: related rows merge; never a sixth bullet.
- Spec H1 or card title longer than the limit: shortened to fit; never truncated mid-word with an ellipsis.
- Gatekeep merge with no carried spec: words from the pull request title and description; the plan-file precondition is skipped.
- Gatekeep merge whose head deletes a base-tracked plan: not withheld. Head that leaves a base-tracked plan unchanged: withheld. Tree lookup fails: withheld with the lookup error.
- Gatekeep merge behind a merge queue: the message flags are passed; the landed text is not guaranteed.
- Review thread whose task records no single fix commit: rendered in the no-single-commit form; no commit message is searched.
- Member merge made by hand with any message: recognized by its parents and the member's recorded original head.
- Squash-default read fails, or `gh` lacks the field: no note, no stop.
- Amendment batch where nothing applied: the empty commit still lands with its audit; it has no `auto-apply` or `granted` row, so the digest lists nothing for it.
- Unreadable `wording:` file: the worker writes one plain imperative sentence and continues.
- Housekeeping amend delivery: the original message stays byte-identical, including a poor one.

## Tests

Each row names its target kind. "Runs" means the test extracts a named embedded script or git recipe from the skill text and executes it on a scratch repo; today only `scripts/loop-engine-contract.test.mjs` and `scripts/finish-verification.test.mjs` execute anything, and a file that gains a run gains its scratch-repo setup with it. "Text" means an assertion on skill, persona or doc wording. Driver prose has no executable form: an isolated model sample observes its decision on supplied state, and a text assertion checks its written contract; neither is a claim that a test runs the driver. The named samples below are coverage candidates subject to section 9's isolation and selection rules, not a mandatory model-run checklist. Test each executable piece independently; do not make a local wording or protocol assertion depend on replaying setup, implementation, review and delivery.

- Eval authoring docs require one boundary, fixture upstream state, explicit stop and sample-selected commands - text/doc check: `eval/README.md` and `eval/_template/README.md`; no model call for documentation wording.
- Reference cited by every commit site and no site keeps a template - text: `scripts/commit-message-contract.test.mjs` (new; the citation at each row of "Commit sites", including the conformance, convergence, minors, verification-produced, worktree-ignore and member-merge rows; the three docs of section 7)
- Lint fails per label and passes on the tree - runs the lint: `scripts/commit-subject-lint.test.mjs` (new; six quoted fixtures, a fenced-code line starting with a label, the legacy-block exemption, the `reason` exemption)
- Home worker commit shape - sample `loop-implementer/home-plain-commit`; text: persona assertions in `scripts/loop-engine-contract.test.mjs`, including both header-preservation sentences permitting `returned:`
- Home admission from the ledger: the three admitted header changes, every other header change rejected, tuple on neither line to interrupted recovery, `returned:` exempt from the saved-header restore on ordinary and seed repairs - text: `scripts/loop-engine-contract.test.mjs` (its header-delta assertion is rewritten) and `scripts/loop-boundary-integration.test.mjs`; sample `loop-implementation/returned-line-admission`
- Return file admission, missing or mismatched file - runs `companion-return-shell` with the fifth argument: `scripts/loop-engine-contract.test.mjs` (it runs that shell today). Stale file deleted before dispatch and the per-flow miss outcomes - text: `scripts/loop-companion-recovery.test.mjs`, `scripts/gatekeep-fix-loop-contract.test.mjs`
- Return path differs between two linked worktrees of one scratch repo at the same base and iteration, and sits under the common dir - runs the `rev-parse --path-format=absolute --git-dir` recipe: `scripts/loop-engine-contract.test.mjs`
- Fixed bookkeeping subjects and the four line kinds - text: `scripts/loop-engine-contract.test.mjs`
- Seed and verification repair counts from lines, `pending: verify` counted once, seed completion from the `row 0 done` decision line - text: `scripts/loop-verification-repair.test.mjs`; sample `loop-implementation/repair-lines-budget`
- Verification repair keeps its matrix: home attribution from the bumped ledger and the retained tuple, companion attribution from the return file, an unrelated single commit or a mutated ledger rejected on resume - text: `scripts/loop-verification-repair.test.mjs`; sample `gauntlet-resume/returned-line-recovery`
- Stuck-row scan lists worker commits and skips decision-only driver commits; with no starting line the window is ledger base; a repair that writes `returned:` late does not move a worker into a newer window; a companion tuple's reads run in the companion checkout - runs the `-G'^returned: '`, `rev-list` and `show --format= --name-only` recipes on scratch repos: `scripts/loop-boundary-integration.test.mjs`
- Crash after a worker commit recovered from `returned:`; a settled companion tuple is not reconstructed - text: `scripts/loop-boundary-integration.test.mjs`; sample `gauntlet-resume/returned-line-recovery`
- Member-merge recovery recognizes a two-parent merge by its second parent and drops the subject read - text: `scripts/brainstorming-contract.test.mjs` (the file that asserts `pr-head.md` today)
- Conformance revert takes the SHA from the fix index; review-thread rendering takes a recorded SHA and no `--grep` - text: `scripts/finish-verification.test.mjs`
- Conversion: equal counts, idempotent second run, unconverted-ledger stop text - `scripts/loop-ledger-conversion.test.mjs` (new; extracts and runs the embedded script on a scratch repo)
- Ledger readers accept `returned:` and the four line kinds - `extensions/plan-tracker.test.ts`, `extensions/lib/plan-check.test.ts`
- Landed message on finish squash and PR title - text: `scripts/finish-verification.test.mjs`; sample `finishing-a-development-branch/landed-message`
- Digest from record lines - runs the Step 4 `log --format=%b` recipe and record-line pattern: `scripts/finish-verification.test.mjs` (scratch repo with a plain-subject amendment commit and a plan-citation repair commit)
- Gatekeep merge flags per policy, plan-file precondition on the head tree, squash-default note - text: `scripts/gatekeep-fix-loop-contract.test.mjs`; samples `gatekeep-pr/merge-landed-message`, `gatekeep-pr/merge-plan-file-withheld` (added, deleted-only and unchanged-base plan)
- Gatekeep fix row and hotfix admission from return files - text: `scripts/gatekeep-fix-loop-contract.test.mjs`; samples `gatekeep-pr/fix-row-return-file`, `chase-bug/hotfix-return-file`
- Hotfix landing subject and PR title - `chase-bug/hotfix-plain-landing`
- Spec, amendment, consent, plan, wave, citation-repair and housekeeping subjects - text: `scripts/brainstorming-contract.test.mjs`, `scripts/brief-contract-lint.test.mjs`; the four samples for brainstorming, writing-plans, subagent-driven-development and housekeeping
- No tracked path added; return files only under the common dir - runs with the `companion-return-shell` run above: `scripts/loop-engine-contract.test.mjs` (asserts `git status --porcelain` empty and `git ls-files` unchanged after the shell admits from a file under the git dir)
- Existing assertions on labeled subjects are rewritten against the ledger contract in these ten files under `scripts/`: `gatekeep-fix-loop-contract.test.mjs`, `loop-boundary-integration.test.mjs`, `loop-unreachable-cut.test.mjs`, `brief-contract-lint.test.mjs`, `finish-verification.test.mjs`, `loop-verification-repair.test.mjs`, `loop-dirty-tree-stop.test.mjs`, `loop-engine-contract.test.mjs`, `implement-amendment.test.mjs`, `brainstorming-contract.test.mjs`.
- Unreadable `wording:` file fallback - none: nothing inspects a subject at run time, so there is no observable beyond the lint.
- Return directory not writable - text: the loop stop naming the path in `scripts/loop-companion-recovery.test.mjs` and the `stuck` exit in `scripts/gatekeep-fix-loop-contract.test.mjs`; the hotfix pre-land abort in `scripts/commit-message-contract.test.mjs`. No fixture runs it: the directory creation is driver prose.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/implement-engines.md` (communication contracts: ledger returns, the `returned:` line, decision-line kinds, the return file); `doc/configuration.md` (operations: ledger recovery, seed completion from the ledger, and the one-time conversion at resume); `README.md` (major procedures: the landed message on merges the framework runs, the squash-default note, the plan-file merge precondition); `CHANGELOG.md` `## Unreleased` (release discipline); `eval/README.md` (major procedures: isolation-first validation and no end-to-end model replay for local changes); `eval/_template/README.md` (sample-authoring route and explicit sample selection)
- Derived / memory docs invalidated: `doc/gate-contract.md` (how verification repairs are counted and the stop texts that name commit labels)

The materiality bar is `reference/documentation-impact.md`.

## Out of scope

- The pull request body layout (`## Summary` / `## Test Plan`).
- Writing any repo setting; the note only names one.
- A GitHub-button merge of a branch pushed without finish: the framework cannot stop it pasting commits or landing a plan file.
- Moving the spec-review audit or the amendment audit out of commit bodies.
- A ledger for the plan engine.
- Any run-time check of a subject's wording.
- Recovering an old-format gatekeep or hotfix step that is in flight at upgrade.
- Rewriting existing branch or default-branch history in any repo.
- The squash-default note on hotfix and housekeeping pull requests.
- `AGENTS.core.md` and the sibling repos: no cross-repo contract changes.
- Rerunning the 71 reworded eval samples.
- End-to-end model evals, including simulated multi-stage workflow replays; local behaviors use isolated tests or decision samples.

## Open questions

- GitHub replaces its default squash title, which carries ` (#<N>)`, with an explicit one. Section 6 appends ` (#<N>)` on that basis; the plan confirms it against GitHub's merge API documentation before the text lands, and drops the suffix if GitHub adds it.
- Merge queue: whether `--subject` / `--body-file` reach the commit a merge queue lands is unverified. Probe: `gh pr merge --help` says "no merge strategy is required" for a queued branch and lists `-t`, `-b`, `-F`; it says nothing about the queued commit's text. Affected: section 6's message bullet and the merge-queue edge case, which claim only that the flags are passed. Settled by the user at the gate or by the plan task that confirms the squash title against GitHub's documentation; a confirmed answer lands through the amendment path.
- Review-thread fix SHA: no skill records a fix commit SHA per review-thread task today. Probe: `rg -i 'thread id' skills agents` finds only the `--grep` count (`skills/finishing-a-development-branch/SKILL.md:262`) and the thread record line (`skills/brainstorming/reference/pr-subject.md:76`). Affected: the section 5 review-thread bullet, which renders `fixed in <sha7>` only from a recorded SHA. Settled by the user at the gate (which existing task record carries the SHA) or by the first plan task that reads the two engines' task records, through the amendment path; until then every such thread renders the no-single-commit form.
- Other specs describe the same `loop:` labels without owning them (`2026-10-29-implement-grant-continuity.md`, `2026-11-01-gh-108-loop-single-allowance.md`, `2026-11-06-loop-hands-free-boundaries.md`, `2026-11-11-loop-interrupted-recovery-exit.md`, `2026-10-31-gh-107-coordinated-legs-reference.md`). They carry no banner from this spec; name any that should at the gate.
