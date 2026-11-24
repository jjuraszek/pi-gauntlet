# One gauntlet entry skill with the run's steps as a phase tree

**Goal:** The package registers eleven skills instead of 22: one hidden entry skill, `gauntlet`, holds every step of the run as a file in a five-phase tree, the phase tracker names the file that comes next, and gate ids, the overrides file and its layout, the run-record key and the eval targets take their names from that tree with no alias for an old name.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #174

## Problem

Ticket #174. The run has five phases (brainstorm, plan, implement, verify, ship). The package publishes each step as its own skill: of 22 skills, eleven are steps or procedures only a run or another skill should reach, and the model sees 16 of the 22, including all eleven steps, so it can start a step on its own from a description. A run advances because each step's text tells the agent which step command to invoke next. The step names also reach consumers: gate ids start with a skill's name, and the overrides file `gauntlet-overrides.md` is one flat list of sections in three spellings (`## shape-ticket`, `## comms style`, `## Issue tracker`) that does not show who reads a section and holds free-text rules (`## conventions`, `## comms style`) that are not settings.

The requester delivers this as one change, released as a major, with the ticket's acceptance criteria as the contract and its Idea as a sketch.

Framing: kept (ticket #174). The smaller remedy, hiding the eleven steps with the `disable-model-invocation: true` header flag, was weighed in the ticket and set aside because the steps stay listed as skills; acceptance row 1 (exactly eleven registered skills) records that decision.

The four Reporter notes on the ticket hold text displaced by three repairs. Every row and paragraph in them is superseded by the current ticket body (for example "`brainstorming` stays as the only entry skill" and "a consumer overrides file written for the previous major applies without an edit"); none adds a requirement.

Redraw framing: kept (ticket #174, repaired row 8). The live issue now permits one pointer to the existing review-reception instructions at integrated-wave review and one at review after a conformance fix. Reading `skills/gauntlet/implement/waves/waves.md` steps 5-6 and `skills/gauntlet/conformance-check.md` Convergence b-c shows each routes findings straight to repair. `skills/gauntlet/receiving-review.md` already requires verification before implementation. Keep the existing review dispatch, checked diff, escalation rules and failed-command handling; apply each pointer to reviewer findings before repair selection. Preserve the existing implementation commits and the AC 3 live-proof deferral.

Redraw checks use `d3190e9a`. Retain `aa54901a..d3190e9a` and the prior evidence for rows 1-20, including the ordinary-request sample and row 3's proof-only deferral, not a live pass. Rows 21-38 remain open; `d3190e9a` records the failing text check for the two missing pointers.

### Decisions taken in the brainstorm

| Decision | Outcome |
|---|---|
| How the tracker learns the engine | The call that completes or skips brainstorm passes it; the tracker stores it with the phase state |
| Shared files | No shared directory; a file read by more than one phase sits beside the entry file |
| Tree | Flat: five phase directories directly below the entry file; no `phase/` wrapper, no `_shared` |
| Gate ids | First part is the phase whose step asks; second part unchanged |
| Overrides file | `gauntlet.md`; a `# shared` block and one block per skill; the run's phases are sections of `# gauntlet`; names lowercase, one token |
| `## conventions`, `## comms style` | No longer read; no free-text home for every-skill rules |
| Old run records | Converted once per repo by a flag on the seal command |
| Run interrupted before the upgrade | Not promised to resume; no code detects an old brief |
| Eval baseline of a moved file | Found through git rename detection; no old path is written |
| Code structure | One overrides reader module for all code readers; a phase-and-engine to file lookup in the tracker |

### Checked claims

Original baseline observations at `590bb884` (Release 8.8.7), before implementation:

- Held: 22 directories under `skills/`, each with a `SKILL.md`; six carry `disable-model-invocation: true` (`brainstorming`, `chase-bug`, `gauntlet-handoff`, `gauntlet-performance`, `gauntlet-resume`, `housekeeping`). Lookup: frontmatter scan of `skills/*/SKILL.md`.
- Held: pi treats a directory containing `SKILL.md` as a skill root and does not recurse below it, so files under `skills/gauntlet/` register nothing else. Lookup: `node_modules/@earendil-works/pi-coding-agent/dist/core/skills.js:117-119`.
- Held: the engine is written to the spec header (`**Engine:** loop` or `waves`, absent means `waves`) just before brainstorm completes, and the tracker state holds no engine. Lookup: `skills/brainstorming/reference/spec-finalization.md:236-256`, `extensions/phase-tracker.ts`.
- Held: five tracker messages name a step skill and one quotes a gate id. Lookup: `extensions/phase-tracker.ts:173,206-207,238,287,316`.
- Held: `doc/gate-contract.md` files 9 rows under `brainstorming/`, 14 under retired step names, and 6 ending rows under `finishing-a-development-branch`. Lookup: prefix scan of its `## Gates` and `## Terminals` tables.
- Held: the 12 directories that move hold 52 files. Lookup: `find` over the 12 directories.
- Held: the overrides file locations are written five times and a section is located five times in three shapes; no shared reader exists. Lookup: `extensions/phase-tracker.ts:1021-1023`, `extensions/verify-before-ship.ts:205-207`, `extensions/lib/telemetry-branch.ts:29-32`, `extensions/lib/telemetry-leg.ts:67-70`, `src/bins/gauntlet-spec-index.mjs:28,143`.
- Held: an extension already resolves the package's `skills/` directory from its own module location. Lookup: `extensions/telemetry.ts:236`.
- Held: the run-record key `brainstorming` is written at `src/bins/gauntlet-telemetry-seal.mjs:100,202` and read at `src/bins/gauntlet-spec-index.mjs:362` and `extensions/telemetry.ts:425`; a record's own text never names the key. The remote ref `refs/telemetry/records` of this repo holds 23 run records, and six repos carry such a ref. Lookup: source grep and a read of the fetched ref.
- Held: the seal command has a one-time migration shape (`--migrate-branch`, `--retire-branch`) with a `nothing to migrate` reply. Lookup: `src/bins/gauntlet-telemetry-seal.mjs:32-33,128`, `doc/configuration.md:395-435`.
- Held: the Claude Code plugin checks out the whole repo and allowlists seven skills, so relative links from those seven into `skills/gauntlet/` resolve. Lookup: `.claude-plugin/marketplace.json`.
- Held: the eval runner builds a `/skill:<name>` input only for its two edit-kind targets (`forge-skill`, `spec-council-applier`), neither a retired step; it reads both revisions of a declared file at the same path and refuses a path absent at the baseline unless declared new. 21 of 29 targets declare a path under a moving directory, about 250 sample files name one, and 2 replay prompts and 24 cases type a step command. Lookup: `eval/run.mjs:28-32,93-107,174-235`, `eval/lib/replay.mjs:36-37`, greps over `eval/`.
- Held: every reference a moved file receives is a Markdown link, a backticked path, a `/skill:` command or a bare step name; after the move the last two become path references, so placement is computable from paths. Lookup: link and name scan over the 52 files.
- Held: pruning protection in the sibling pi-condense keys on `**/skills/**/*.md`, which the tree's paths still match. Lookup: that repo's default settings.
- Corrected: the request asks how the eval runner addresses a step that is no longer a skill. The runner addresses no step by command; the decision narrows to step commands typed in replay prompts and sample inputs, the target directory names, and the moved-file baseline.
- Corrected: a ticket comment says handoff briefs record no skill names. Every brief lists the loaded skills by name (`## Skills loaded`) and resume skips names it cannot match. With cross-upgrade resume not promised, nothing depends on it.
- Corrected: the ticket expects `npm test` to fail when an eval target would be refused, but `.github/workflows/test.yml:12` and the publish job at `.github/workflows/release.yml:19` each check out one commit and `scripts/ci.mjs` resolves no baseline. Both jobs run `npm test`; both fetch full history and `origin/main` (Design, Eval).
- Corrected: the performance report reads every key under the repo label (`src/bins/gauntlet-performance.mjs:63`), so unconverted records under the old key would still be reported. It reads the named keys only (Design, Run records).
- Corrected: the verify step's heading holds prose in the consumer files read, and the verification command sits under `## PR gate` as `- verification command:`. The loop engine's fallback that takes a lone backticked command from the verify step's heading is used by none of the six overrides files read; the ticket drops it.
- Corrected: gatekeep's fix wave does not read the test-first step's heading; it searches every section for a scoped test command and names that heading as an example. Under the regrouped file it reads its own block and `# shared`.
- Corrected: `## conventions` is not needed. Of five rules in two consumer repos, four are repo rules for any agent and one concerns the run; pi loads `AGENTS.md` or `CLAUDE.md` into every session (`dist/core/resource-loader.js:130`) and nine of eleven personas inherit it (`doc/personas.md`).
- Corrected: the placement rule as first worded (lowest directory containing every reader) is unstable, because a file beside the entry file that links into a phase would pull the linked file up, and that file's own links would pull more. Files beside the entry file do not count as readers (Design, Placement rule). The result is 14 files beside the entry file, not the 17 shown in design round 1: `pr-subject.md` and `settings-precedence.md` sit in `brainstorm/`, `disposition-protocol.md` in `ship/`, `parallel-agents.md` in `implement/waves/`, and `whole-diff-minors.md` beside the entry file.

### Implicit dependencies

- CI baseline commit - `.github/workflows/test.yml:12` and the tag-triggered publish job at `.github/workflows/release.yml:19` have no `fetch-depth`, and both run `npm test` - missing in both; the two workflow changes are in Design.
- This run ships under the installed 8.8.7 package, whose ship step and extensions read `gauntlet-overrides.md` - once the branch renames the file they find no cleanup steps - Design names the two post-merge actions explicitly.
- At the original approval gate no tests or model evals of the change had run. The redraw carries forward the implementation evidence identified above.

## Acceptance criteria

Ticket #174, Acceptance Criteria, rows verbatim:

- [ ] With the package installed in pi, the skills it registers are exactly `gauntlet`, `shape-ticket`, `gatekeep-pr`, `check-delivery`, `chase-bug`, `linear`, `forge-skill`, `housekeeping`, `gauntlet-handoff`, `gauntlet-resume` and `gauntlet-performance`; the model-visible skill list and the `/skill:` menu show no other pi-gauntlet entry, and `gauntlet` plus the five others hidden from the model today (`chase-bug`, `housekeeping`, `gauntlet-handoff`, `gauntlet-resume`, `gauntlet-performance`) are hidden.
  in-scope
- [ ] Invoking `/skill:gauntlet` starts a run as `/skill:brainstorming` does today: the phase tracker's status reports brainstorm in progress, and the guards that apply only to an entered run apply (for example, completing verify before the conformance review ran is refused).
  in-scope
- [ ] On each engine, a run started with `/skill:gauntlet` goes from the entry command through the ship ending the person selects, and that ending performs its action, without the person typing a step command; the points where the instructions wait for a person - gates and questions, in order - are the same as before the move.
  deferred: #174 - live proof only; the two-engine behavior remains required
- [ ] Under `skills/gauntlet/` the directories directly below the entry file are exactly `brainstorm`, `plan`, `implement`, `verify` and `ship`. A phase's files sit in its directory or in one optional sub-phase directory below it (for example the two ways implementation runs, under `implement`). No directory in the tree carries a retired step's name.
  in-scope
- [ ] The layout rule - directories mirror the run - has one wording in the repo: the skill-authoring guide's placement rule for a skill's supporting files either states it for files under `skills/gauntlet/` or links to it, and no second wording exists. The rule says where a file goes that more than one phase reads, and where a file goes that skills outside the run read (today: the menu layout rules, the commit-message rules, the return-file cleanup).
  in-scope
- [ ] Adding a directory directly under `skills/gauntlet/` other than the five phases, or a second `SKILL.md` anywhere below `skills/gauntlet/`, makes `npm test` fail with a message naming the path.
  in-scope
- [ ] The instructions of all eleven retired steps (`writing-plans`, `subagent-driven-development`, `loop-implementation`, `roasting-the-spec`, `finishing-a-development-branch`, `using-git-worktrees`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `dispatching-parallel-agents`, `test-driven-development`) live in files of that tree, not in a separately registered skill.
  in-scope
- [ ] Comparing each moved file with its text before the move shows changes only in: file paths and link targets; renamed names (entry skill, step, gate id, overrides file); the menu layout rule that says how a gate id is formed from its owner; the removed skill header of each step; sentences that advertise a step's standalone use or tell a person to invoke it as a command; the hand-off and recovery sentences that the phase tracker or `/skill:gauntlet-resume` replaces; and the sentences that say what to read from the overrides file, which follow the regrouped file - including the end of `## conventions`, the commit-subject convention now taken from the repo's agent instructions, and the loop engine's dropped fallback for the verification command. The sole additional change allowed is one pointer to the existing review-reception instructions at each of two sites: the integrated-wave review and the review after a conformance fix. No other instruction is added, removed or reworded.
  in-scope
- [ ] Searching the shipped skills, agent personas, extensions, bin sources and bundles, scripts, tests, `README.md`, `AGENTS.md`, the guides under `doc/`, this repo's own overrides file, and the eval runner, target definitions and sample inputs (specs, plans, the changelog and saved eval results excluded) finds none of the eleven retired step names, no `/skill:brainstorming`, no `skills/brainstorming` path, no gate id or overrides heading named `brainstorming`, and no `gauntlet-overrides`. The one exception is the input of a check that proves an old name is absent or ignored, plus the input key of a one-time record conversion if the spec picks one. No eval target directory carries a retired step's name.
  in-scope
- [ ] The README skill inventory lists exactly the eleven skills the installed `/skill:` menu shows.
  in-scope
- [ ] Given no run in progress, an ordinary implementation request - no `/skill:gauntlet`, no ask for the gauntlet - starts no phase and loads no step instructions.
  in-scope
- [ ] On the task-plan engine, completing brainstorm, completing plan and completing verify each make the phase tracker's reply name the next phase's instruction file (plan, the task-plan engine's file under `implement`, ship); on the loop engine, completing brainstorm and completing verify do (the loop engine's file under `implement`, ship). Each such reply carries the file pointer, not the step's instructions, and contains no `/skill:` command.
  in-scope
- [ ] Given a run in progress, asking the phase tracker for status names the current phase's instruction file; given no run in progress, it names none.
  in-scope
- [ ] For the five hand-offs the phase tracker announces (three on the task-plan engine, two on the loop engine), no instruction file carries a sentence naming the next phase's file or command; the pointer comes from the phase tracker.
  in-scope
- [ ] Each phase tracker message that names a retired skill today (the ship advisory, the two recovery messages, the branch guard, the parent-write warning) names instead a file under `skills/gauntlet/` that exists; what each guard blocks and when each recovery message fires is unchanged.
  in-scope
- [ ] Given a run saved by the upgraded package at each supported resume point, invoking `/skill:gauntlet-resume` identifies the recorded phase and directs the agent to its next unfinished step without restarting the brainstorm phase or invoking a retired step as a skill.
  in-scope
- [ ] Every reference to a package-owned file in the retained skills and their reference files, the agent personas and the extension messages resolves from its installed caller; consumer-owned paths and illustrative examples are not package files.
  in-scope
- [ ] Where a retained skill cites a numbered step of a moved file (today `gatekeep-pr` cites Step 6 of the ship step and Steps 1a and 2b of the worktree step), the citation names a heading that exists in the moved file.
  in-scope
- [ ] Installing the plugin in Claude Code from the marketplace lists `shape-ticket`, `gatekeep-pr`, `check-delivery`, `chase-bug`, `linear`, `forge-skill` and `housekeeping`, as it does today, and every relative file reference inside those seven resolves in the plugin checkout.
  in-scope
- [ ] With only the Claude Code plugin installed, the parts of `chase-bug`'s hotfix, `gatekeep-pr`'s fix wave and `housekeeping`'s fix that today read a file from a retired step's directory (the commit-message rules, the return-file cleanup) find that content and complete without the pi phase tracker.
  in-scope
- [ ] A run obtains a reviewer result at each of its three review points - per wave in the task-plan engine, over the whole diff at verify in both engines, and after a conformance fix - and the orchestrating agent checks each finding against the diff before acting on it.
  in-scope
- [ ] Given a reviewer finding that the diff contradicts, the orchestrating agent cites the contradicting evidence and makes no edit for that finding.
  in-scope
- [ ] For every row of `doc/gate-contract.md` filed under `brainstorming` or a retired step's name (today 14 gate and question rows under retired step names, 9 under `brainstorming`, and 6 ending rows under `finishing-a-development-branch`), the gate, question or ending still renders and its row names a rendering file that exists. Each gate and question id is renamed to a name taken from the new tree (the spec picks the exact ids); no row and no emitted id starts with `brainstorming` or a retired step's name; and the phase tracker message and the menu layout rules that quote an id quote the new one.
  in-scope
- [ ] The README shows the recognized overrides file as one outline in place of today's heading table: a `# shared` block and one block per skill that reads settings, headed with that skill's name (for example `# gauntlet`, `# gatekeep-pr`, `# shape-ticket`), each with every section it may hold and who reads it. Block and section names are lowercase and one token (for example `## issue-tracker`), and none is named after `brainstorming` or a retired step. The one-token rule applies to block and section headings, not to setting keys.
  in-scope
- [ ] Each skill's overrides paragraph - in the run's files and in the ten other skills - tells the agent to apply the recognized sections of `# shared` and its own skill's block, without a relevance judgment, and nothing else: no other skill's block, no text directly under `# shared`, and no section of `# shared` that the README outline does not list.
  in-scope
- [ ] The run's block `# gauntlet` holds one section per phase: `## brainstorm`, `## plan`, `## implement`, `## verify` and `## ship`. Each moved step's file names the section of the phase it sits in and no other phase's section, both ways implementation runs read `## implement`, and text directly under `# gauntlet`, above its first section, applies to all five phases.
  in-scope
- [ ] A setting that more than one skill reads is written once, as a section of `# shared` - today the issue tracker, the worktree settings, the verification command, the cleanup steps after a merge (read by the pull-request gate and by the run's ship phase), the sibling repos and the deploy layout - and every skill and extension that reads it reads it there.
  in-scope
- [ ] A setting that one skill reads sits in that skill's block - for example `timeout minutes` and `merge policy` directly under `# gatekeep-pr`, with no `## PR gate` section, and the happy path, which only phases of the run read, under `# gauntlet` - and no skill reads a setting from another skill's block.
  in-scope
- [ ] `## conventions` and `## comms style` are no longer read: no shipped skill, agent persona or guide names either as a section to apply, and the commit-message rules take a repo's commit-subject convention from the repo's agent instructions. The README says where such rules go: a repo-wide rule in the repo's agent instructions, a rule for one skill or for the whole run directly under that block's heading.
  in-scope
- [ ] Given an overrides file with no verification command in `# shared`, the loop engine discovers the project's test entrypoint, the step it takes today when no command is configured; it never takes a command in backticks from the verify section as the verification command.
  in-scope
- [ ] This repo's own overrides file follows the README outline.
  in-scope
- [ ] The package reads project overrides from `gauntlet.md` at the three locations it checks today, in the same order (`.pi/gauntlet.md`, `gauntlet.md` at the repo root, `doc/gauntlet.md`; first found wins): every skill's overrides block, including the seven skills of the Claude Code plugin, and every extension and bin that reads the file use that name.
  in-scope
- [ ] Given a repo that holds both `.pi/gauntlet-overrides.md` and `.pi/gauntlet.md` naming different trackers, the extensions that read the tracker use the one from the `## issue-tracker` section of `# shared` in `gauntlet.md`; given a `gauntlet.md` whose only tracker section sits under another block, they find no tracker; given a repo that holds only `gauntlet-overrides.md`, they find no overrides. The other sections that an extension or a bin parses - today the sibling repos and the spec index's docs list - are read only from the block and section the README outline gives them.
  in-scope
- [ ] After the upgrade a new run's records are stored under the new entry's name; `/skill:gauntlet-performance` reports them and the spec search index lists them. Given a telemetry branch that holds records written before the upgrade, both either show those records under the new name or omit them, and the release notes say which (the spec picks one). Outside a one-time conversion, no shipped code reads or writes records under a `brainstorming` key.
  in-scope
- [ ] For every eval target, after the move, the runner prepares each sample's baseline and working-tree prompts without a refusal or a missing-file error and without a model call - covering structure, hygiene, intent binding, every declared skill file at both revisions, and the rule on where an edit target's files sit - and `npm test` fails when a target would be refused.
  in-scope
- [ ] For a target whose instruction files are no longer a registered skill, the prompt the runner builds contains no `/skill:` command naming them.
  in-scope
- [ ] Model-eval evidence for this change is limited to the behavior it alters: at least one selected sample in which the agent follows the phase tracker's pointer at a hand-off, at least one for the ordinary request with no run in progress, and at least one in which a skill applies the recognized sections of `# shared` and its own block of an overrides file and leaves another skill's block unapplied. A file whose only change is the move gets no model-eval re-run; the review-point, reviewer-finding and resume rows above are checked against the moved text and saved-run fixtures.
  in-scope
- [ ] The release notes of the major list, old to new: the entry command, each retired step name with the file that now holds its instructions, each renamed gate id, the overrides file name, and each heading of today's README table with the block and section that replaces it or the statement that it is no longer read. They also say that a run interrupted before the upgrade is to be finished before upgrading, or on the previous major.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gauntlet-entry-phase-tree
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: eval/README.md
Rules: doc/install-internals.md
Rules: .agents/skills/release/SKILL.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/gauntlet-resume/reference/coordinated.md
Rules: skills/gauntlet/legs.md
Rules: skills/gauntlet/ship/legs.md
scope: none
design: owns `skills/`, `agents/`, `extensions/`, `src/bins/`, `bin/`, `scripts/`, `eval/`, `README.md`, `AGENTS.md`, `CHANGELOG.md`, `doc/` guides, `.pi/gauntlet.md`, `.github/workflows/test.yml`, `.github/workflows/release.yml`

## Design

### The tree

Remove: the twelve directories `skills/brainstorming`, `skills/roasting-the-spec`, `skills/writing-plans`, `skills/subagent-driven-development`, `skills/loop-implementation`, `skills/test-driven-development`, `skills/dispatching-parallel-agents`, `skills/requesting-code-review`, `skills/receiving-code-review`, `skills/verification-before-completion`, `skills/finishing-a-development-branch`, `skills/using-git-worktrees`, and the skill header (frontmatter) of the eleven steps.

Add: `skills/gauntlet/` with the same 52 files, moved with `git mv` so history follows:

```
skills/gauntlet/
  SKILL.md                 the entry step (was the entry skill's SKILL.md), moved whole
  menu-layout.md  commit-message.md  return-file.md  legs.md
  worktrees.md  pr-head.md
  amendment-surface.md  documentation-impact.md
  conformance-check.md  whole-diff-minors.md
  requesting-review.md  wave-reviewer.md  receiving-review.md
  brainstorm/
    gatherer.md  opening-message.md  pr-subject.md  spec-finalization.md  spec-pr.md
    superseding.md  ticket-acceptance.md  settings-precedence.md  council.md
  plan/
    plan.md  open-questions.md  plan-contract.md
  implement/
    tdd.md  tdd-examples.md  tdd-rationalizations.md  tdd-when-stuck.md
    testing-anti-patterns.md  happy-path-run.md
    waves/
      waves.md  implementer-prompt.md  wave-reviewer-prompt.md  stop-note.md
      dispatch-contract.md  implement-amendments.md  prerequisites.md  parallel-agents.md
    loop/
      loop.md  coordinated-legs.md  driver-holds.md  empty-child-stagnation.md
      interrupted-recovery.md  unreachable-returns.md
  verify/
    verify.md
  ship/
    ship.md  disposition-protocol.md  legs.md  spec-pr.md  verification-set.md
```

Step file names: `council.md` holds the council step, `plan.md` the plan step, `waves.md` the task-plan engine, `loop.md` the loop engine, `tdd.md` the test-first step, `parallel-agents.md` the parallel-dispatch step, `requesting-review.md` and `receiving-review.md` the two review steps, `verify.md` the verification step, `ship.md` the finish step, `worktrees.md` the worktree step. The former `reference/` level is dropped; `ship/legs.md` and `ship/spec-pr.md` keep their names beside the root `legs.md` and `brainstorm/spec-pr.md`.

The entry file is not split. Acceptance row 8 lets a moved file change only in names, paths and the listed sentence classes, so `skills/gauntlet/SKILL.md` stays the brainstorm step and `brainstorm/` holds its helpers. Its frontmatter is `name: gauntlet` with `disable-model-invocation: true`.

The sub-phase level of row 4 is used only by `implement/waves/` and `implement/loop/`.

### Placement rule

Written once, in the skill-authoring guide's placement rule for supporting files (`skills/forge-skill/SKILL.md`); `AGENTS.md` links to it and states nothing itself. The guide's generic rows that place a skill's supporting files under `reference/<topic>.md` and extract an oversized file into `reference/` say that files under `skills/gauntlet/` follow this rule instead.

Readers are counted on the path graph after the edits of the next section, where every procedural reference a moved file makes to another step is a path reference.

1. The file the tracker names for a phase or engine sits in that phase's or engine's directory. The entry file is brainstorm's and sits at the top because pi requires `SKILL.md` there.
2. An anchored file sits where its anchor says. The anchors cover the steps the tracker does not name whose place the path graph does not settle, and the prompt templates no file references by path:

| File | Anchor | Reason |
|---|---|---|
| `worktrees.md` | beside the entry file | the worktree step belongs to no phase; placed there in the brainstorm |
| `receiving-review.md` | beside the entry file | shared by integrated-wave review in implement and review in verify; anchor it here in the guide because the verify callers sit beside the entry file and do not count as phase readers |
| `tdd.md` | `implement/` | the test-first step; its only run reader, `receiving-review.md`, sits beside the entry file |
| `implementer-prompt.md`, `wave-reviewer-prompt.md` | `implement/waves/`, owner `waves.md` | pasted by the task-plan engine and referenced by path nowhere |

3. For any other file, take the run files that reference it by path and sit in a phase directory; the entry file counts as `brainstorm`, and a file anchored into a phase directory counts there, so the four test-first helpers follow `tdd.md` into `implement/`. The file sits in the lowest directory containing all of them. Two phases give the top level, so a file more than one phase reads sits beside the entry file; both engines give `implement/`.
4. A file beside the entry file is not counted as a reader, because it is shared already.
5. A file referenced only by files beside the entry file sits beside the entry file.
6. A file with no run reader and no anchor has no place: it is a lint failure that names the file, settled by adding an anchor with its owner.
7. Skills outside the run never move a file. They link into the tree wherever rules 1-6 put it; today the menu layout rules, the commit-message rules and the return-file cleanup sit beside the entry file.

The listing above is this rule and its anchors applied to the post-edit path graph. The `placement` lint reads the anchors from the rule and recomputes the rest; a file whose computed place differs from where it sits fails the lint with both paths and is settled by moving the file or adding an anchor to the rule, never by a silent move. File names stay.

### Edits inside moved files

Limited to the classes of acceptance row 8:

The sole review additions are these two sentences, each after the result and before the first instruction selecting repairs:

- `implement/waves/waves.md`, step 5, before the verdict branches: "On every wave review or re-review, before acting on the verdict, use only the verify-before-acting stance from [receiving-review.md](../../receiving-review.md): for `SHIP` with Minors read the existing findings section once within the report bound, check each finding against the assigned diff, cite the contrary hunk in the review outcome and select no edit for a disproved claim; if all findings on a green `FIX_FIRST` are disproved, record the disputed verdict and stop uncommitted without repair or re-review."
- `conformance-check.md`, after Convergence b and before c: "Before selecting repairs, use only the verify-before-acting stance from [receiving-review.md](receiving-review.md): check each finding against b's assigned diff, cite the contrary hunk in the review outcome and select no edit for a disproved claim."

These sentences qualify the existing repair lists; do not rewrite the lists or copy the reception procedure. Only a contradicted finding is excluded by verification; an unverified claim is not a rebutted claim. Apply the wave check before every verdict-driven selection, including escalated and funded re-reviews: a repeated claim contradicted by that review's diff still gets no repair. Keep reviewer inputs, ranges, severity thresholds, escalation and whole-diff review unchanged. The bounded `SHIP` read is solely for checking and citing Minor claims, not routing Minor-only feedback to repair. A red wave gate routes its log straight to repair without review. Convergence c takes every failed command from a plus the surviving Critical/Moderate findings from b.

- Paths and link targets follow the tree.
- A `/skill:` command or bare name of a retired step that carries a procedure - a line telling the agent to use, run or follow that step - becomes a path reference to that step's file, and the procedure stays. This holds inside a `Related skills`, `Called by` or `Pairs with` block too: the review-response step's line "Use `/skill:test-driven-development` for regression tests" stays an instruction and names `implement/tdd.md`.
- Removed: standalone advertisements (a sentence or block line whose only content is that a step can be used on its own, or that another skill calls or pairs with it) and command-invocation wording (telling a person to type a step command). A `Related skills`, `Called by` or `Pairs with` block is removed only when nothing else is left in it.
- At the five announced hand-offs (brainstorm to plan, plan to implement and verify to ship on the task-plan engine; brainstorm to implement and verify to ship on the loop engine) the sentence naming the next step is removed. The entry file's approval step calls `phase_tracker({ action: "complete", phase: "brainstorm", engine })` and stops naming a next file.
- What a removed hand-off sentence carried besides the next step's name stays in the same file and runs before the agent reads the file the tracker names:
  - `plan/plan.md` calls `complete plan` and then initializes the wave tasks with `plan_tracker` `init`, in today's order; the waves file is read after the init.
  - On the loop engine the approval step emits an approved nondefault allowance before the loop file is read and the loop is seeded.
  - `ship/ship.md` takes its worktree from the run's retained absolute worktree path, or on a resumed run from the path the restore re-established, instead of a command argument; it still stops when it has none.
- Implement to verify has no tracker hand-off: both engine files keep running verify from their own text, now by path.
- Recovery sentences that tell a person to type a step command point at `/skill:gauntlet-resume`.
- Each file's overrides paragraph follows the regrouped file (Overrides file below).
- `commit-message.md` takes a repo's commit-subject convention from the repo's agent instructions and names `# shared` `## issue-tracker` for the `refs:` line.
- `loop.md` resolves the verification command from `# shared` `## verification`, then discovery; the backticked-command fallback is removed.
- `menu-layout.md` states the gate-id owner rule (Gate ids below).

### Phase tracker

Add to `extensions/phase-tracker.ts`:

- Parameter `engine: "waves" | "loop"`, accepted on `complete` and `skip` of `brainstorm` only, stored with the phase state, replayed from the session like the rest of that state, and cleared by `reset`. The spec header's `**Engine:**` line stays the durable record; the tracker field is the session's copy.
- A six-entry lookup, resolved to installed absolute paths from the extension's module location as `extensions/telemetry.ts` does for `skills/`:

| Key | File |
|---|---|
| brainstorm | `skills/gauntlet/SKILL.md` |
| plan | `skills/gauntlet/plan/plan.md` |
| implement, `waves` | `skills/gauntlet/implement/waves/waves.md` |
| implement, `loop` | `skills/gauntlet/implement/loop/loop.md` |
| verify | `skills/gauntlet/verify/verify.md` |
| ship | `skills/gauntlet/ship/ship.md` |

- One line, `Instructions: <absolute path>`, appended to the reply of the advancing completions: `complete brainstorm` with an engine (plan file for `waves`, loop file for `loop`), `complete plan` when the recorded engine is `waves` (waves file) and `complete verify` (ship file). `complete plan` is a hand-off on the task-plan engine only; with `loop` or no engine recorded its reply carries no line. No other completion reply carries it. The reply holds the pointer only, never file content and never a `/skill:` command.
- Every pointer to an implement file is routed by the recorded engine.
- The same line in `status`, as a locator, placed after the phase block and before the `Context:` line. In the parent session of an entered run it names the in-progress phase's file, or between phases the file of the next unfinished phase that may start. It is absent when no run is entered, when the run is finished, after the publish-for-handoff ending (brainstorm completed with no engine), in a child session, and when the phase is implement with no engine recorded.
- The tool description says once: after a `complete` reply that carries an `Instructions:` line, finish what the current step's file still requires for the hand-off, then read the named file before the next action. An `Instructions:` line in `status` only locates the file: a caller that asked for status to inspect the run - the resume entry check, the handoff snapshot, the context reading at approval - continues its own operation and reads no phase file because of it.

Change in `extensions/phase-tracker.ts`: the ship advisory and the verify-to-ship recovery message name the ship file; the plan-to-implement recovery message and the parent-write warning name the recorded engine's implement file; the branch guard names `skills/gauntlet/worktrees.md`; the quoted gate id becomes `verify/step-6`. What each guard blocks and when each message fires is unchanged.

Remove from `extensions/phase-tracker.ts`: the five `/skill:` commands in those messages.

The handoff brief drops the `Instructions:` line as it drops `Context:`, because the path is machine-local: `skills/gauntlet-resume/reference/brief-contract.md`, `skills/gauntlet-handoff/SKILL.md` and `scripts/brief-contract-lint.mjs` state and check both drops.

### Resume

`/skill:gauntlet-resume` keeps its routes and entry checks. Its restore references pass `engine` on `skip brainstorm`, taken from a ledger's presence (`loop`) or the spec header. Its post-restore table names tree files by relative link instead of step skills, the `worktree: no` route offers `/skill:gauntlet`, and its warning against the reset-bearing entry names `/skill:gauntlet`. Supported resume points are the rows of that table. No code or text detects a brief or run saved by an earlier major.

### Gate ids

The first part of a run gate's id is the phase whose step asks it, carried from today's owner; the second part is unchanged. The two worktree gates belong to no phase and take `gauntlet`. The other ten skills keep `<skill>/<id>`. The marker grammar is unchanged.

| Old | New |
|---|---|
| `brainstorming/understand-the-idea`, `/present-the-design`, `/cut-question`, `/relatedness-before-provisioning`, `/user-review-gate`, `/human-batch` | `brainstorm/<same>` |
| `writing-plans/step-6-baseline-failure`, `/step-6-baseline-dirty`, `/step-6-contract-questions` | `plan/<same>` |
| `subagent-driven-development/stop-note` | `implement/stop-note` |
| `loop-implementation/human-stop`, `/discard-authorization` | `implement/<same>` |
| `verification-before-completion/step-6` | `verify/step-6` |
| `finishing-a-development-branch/step-4`, `/carried-open`, `/pr-subject-row-1`, `/option-5` | `ship/<same>` |
| `using-git-worktrees/step-3`, `/detached-head` | `gauntlet/<same>` |

A gate's owner can differ from the directory of the file that renders it: `amendment-surface.md` renders `brainstorm/human-batch` and `conformance-check.md` renders `verify/step-6` from beside the entry file. `doc/gate-contract.md` carries the new ids and rendering files, files the six ending rows under `ship`, and `scripts/gate-contract-lint.mjs` checks ids against the table instead of deriving the owner from the path. Gate order and count per file are unchanged.

### Overrides file

The file is `gauntlet.md`, found at `.pi/gauntlet.md`, `gauntlet.md` at the repo root, then `doc/gauntlet.md`; first found wins, never merged. It stays Markdown. A `#` line opens a block, a `##` line a section of that block. The README shows this outline in place of the heading table, with each section's readers:

| Block | Sections | Readers |
|---|---|---|
| `# shared` | `## issue-tracker` | every skill that touches the tracker; the tracker-reading extensions |
| | `## worktrees` (`home`, `create`, `destroy`) | `gauntlet`, `gatekeep-pr`, `housekeeping`, `gauntlet-resume` |
| | `## verification` (`verification command`, `requires credentials`, and prose on how to verify) | `gauntlet`, `gatekeep-pr`, `chase-bug`, `housekeeping` |
| | `## cleanup` | `gatekeep-pr`, `gauntlet` |
| | `## siblings` (`- sibling: <clone url>`) | `shape-ticket`, `gauntlet`, `gauntlet-resume`; the phase tracker extension |
| | `## deployment` | `shape-ticket`, `gauntlet` |
| | `## spec-index` | the spec index bin |
| `# gauntlet` | text above the first section: all five phases | every run file |
| | `## brainstorm`, `## plan`, `## implement`, `## verify`, `## ship` | the files of that phase; both engines read `## implement` |
| | `## happy-path` | the plan step and both engines; the `plan-writer` persona, on behalf of the plan step |
| | `## documentation` | `documentation-impact.md` |
| `# gatekeep-pr` | none; keys `timeout minutes`, `merge policy`, `local verification`, `ci checks`, `issue fetch` and text sit directly under the heading | `gatekeep-pr` |
| `# shape-ticket` | `## capabilities`, `## wording` | `shape-ticket` |
| `# chase-bug` | `## response-channels` | `chase-bug` |
| `# check-delivery` | `## delivery` | `check-delivery` |
| `# housekeeping`, `# linear`, `# forge-skill`, `# gauntlet-handoff`, `# gauntlet-resume`, `# gauntlet-performance` | text only | that skill |

Keys and line grammar inside a section are unchanged. `## conventions` and `## comms style` are not read. The README says a repo-wide rule goes in the repo's agent instructions and a rule for one skill or the whole run directly under that block's heading.

Old to new, for the release notes: `## Issue tracker` -> `# shared` `## issue-tracker`; `## using-git-worktrees` -> `# shared` `## worktrees`; the `verification command` and `requires credentials` keys of `## PR gate` -> `# shared` `## verification`; the other keys of `## PR gate` -> directly under `# gatekeep-pr`; `## cleanup` -> `# shared` `## cleanup`; the sibling lines of `## shape-ticket` -> `# shared` `## siblings`; `## Deployment` -> `# shared` `## deployment`; `## Delivery` -> `# check-delivery` `## delivery`; `## Spec index` -> `# shared` `## spec-index`; `## verification-before-completion` -> `# gauntlet` `## verify` for the run, `# shared` `## verification` for what `gatekeep-pr`, `chase-bug` and `housekeeping` read; every other step-named heading -> the section of its phase under `# gauntlet`; the run-specific prose of a heading named after a step that sits beside the entry file (the two review steps, the worktree step) -> text directly under `# gauntlet`, while a setting mapped above stays in its named section; `## Happy path` -> `# gauntlet` `## happy-path`; `## documentation` -> `# gauntlet` `## documentation`; `## Capabilities`, `## Ticket wording` -> `# shape-ticket` `## capabilities`, `## wording`; `## Response channels` -> `# chase-bug` `## response-channels`; `## housekeeping` and any `## <skill>` heading -> text under `# <skill>`; `## conventions`, `## comms style` -> no longer read.

Skills read the file as prose. Every overrides paragraph - in each run file that has one and in the ten other skills - is rewritten to one of three templates. Each template is self-contained: it writes the seven shared section names out, so a skill running in a consumer repo or in the Claude Code plugin needs no README in context. The README link stays as further reading.

The shared sections every template names: `## issue-tracker`, `## worktrees`, `## verification`, `## cleanup`, `## siblings`, `## deployment`, `## spec-index`. A skill applies whichever of them the file holds, without a relevance judgment. The Readers column of the outline is a different thing: it records which skill or code consumes a setting's keys, and is not a second filter on what a paragraph applies.

Common opening of all three: "If `gauntlet.md` exists - checked in order: `.pi/gauntlet.md`, `<repo root>/gauntlet.md`, `<repo root>/doc/gauntlet.md`; first found wins - read it. Apply, without a relevance judgment, these sections of `# shared`: `## issue-tracker`, `## worktrees`, `## verification`, `## cleanup`, `## siblings`, `## deployment`, `## spec-index`." Common close: "Apply nothing else from the file: no other block, no text directly under `# shared`, no other section of `# shared`." The middle differs:

| Caller | Own-block sentence |
|---|---|
| A retained skill | "Apply the whole `# <this skill>` block." |
| A run file in a phase directory, and the entry file | "Apply `# gauntlet`: its text above the first section, and `## <this phase>`. Apply no other phase's section." `## happy-path` and `## documentation` are named only in their readers' paragraphs |
| A helper beside the entry file | "Apply the block of the skill that invoked this file: inside a run the text directly under `# gauntlet`; from another skill, that skill's block." It names no phase section and never another skill's block |

- Reuse of an earlier read is per repository and trusted revision: a skill skips the read only when that repo's file at that revision is already in context. The existing trusted sources stay: `gatekeep-pr` takes gate configuration from the file at the PR's merge base and never from its head, its tracker display lookup reads the remote default branch, and each leg's contract comes from that member repo's primary checkout.
- `agents/plan-writer.md` reads `# gauntlet` `## happy-path` on behalf of the plan step and nothing else from the file.
- The sentence that an override never lifts a skill's hard constraint stays.

`gatekeep-pr`'s fix wave finds a scoped test command in its own block or `# shared` `## verification`. The README's list of rules an override cannot change names tree files for the two constraint headings that moved.

Add `extensions/lib/overrides.ts`: the one place code finds the file and returns the text of one named section of `# shared`. Callers: `extensions/phase-tracker.ts` (`siblings`), `extensions/verify-before-ship.ts`, `extensions/lib/telemetry-branch.ts` and `extensions/lib/telemetry-leg.ts` (`issue-tracker`), `src/bins/gauntlet-spec-index.mjs` (`spec-index`). It takes the repo root from its caller and keeps nothing between calls, so two member repos each yield their own value. It validates nothing and is not exposed to the agent as a tool; the ticket's out-of-scope item (an agent-facing reader of one section and a check that rejects unknown headings) stays out.

Remove: the five copies of the three locations and the five section lookups in those callers; every read of `## conventions` and `## comms style` in shipped skills, personas and guides; the README heading table; `.pi/gauntlet-overrides.md`.

Add `.pi/gauntlet.md` for this repo: `# shared` with `## issue-tracker` and `## cleanup` carrying today's lines, and `# gauntlet` `## ship` carrying today's release paragraph.

### Run records

New records are written at `<repo>/gauntlet/<spec path>.yaml` on `refs/telemetry/records`. The seal writer, the spec search index, the shipped-spec guard and the resume seed route's remote admission check (`skills/gauntlet-resume/reference/seed.md`, which fetches the ref and stops on a record carrying `shipped_at` or `abandoned_at`) use that key. The performance report reads run records under `<repo>/gauntlet/` and leg records under the three leg-skill keys, and no other key.

Add `--migrate-records` to `src/bins/gauntlet-telemetry-seal.mjs`: it moves every record of the current repo from `<repo>/brainstorming/` to `<repo>/gauntlet/` in one commit on the ref and pushes it, the same shape as `--migrate-branch`. Record content is not rewritten. This flag is the only shipped code that names the old key. Until a repo runs it, the performance report, the search index and the shipped-spec guard do not see that repo's earlier records, and the release notes say so.

Remove: the old key from the seal writer, the spec index reader, the shipped-spec guard and the resume seed route's lookup. Rebuild the three bundles with `npm run build:bins`.

### Eval

- The seven target directories named after the old entry or a retired step are renamed after the tree file they test: `eval/gauntlet`, `eval/council`, `eval/plan`, `eval/waves`, `eval/loop`, `eval/ship`, `eval/worktrees`. Saved results move with them unchanged.
- Declared skill-file paths in every `target.json` and in sample bundle lines follow the tree.
- The 2 replay prompts, 24 cases and 6 `expected.md` files that type a step command, and the legacy replay driver `eval/brainstorming/replay/drive.mjs` (moved with its target), state the situation instead: the tracker reply that names the file.
- Sample inputs that still describe the old contract follow it too: every overrides fixture in a sample input is regrouped to the outline under the file name `gauntlet.md`, and a gate id in a sample input follows the Gate ids table. The `overrides-outline` rule validates each recognized overrides fixture under `eval/` against the outline; saved results and inputs that exist to prove an old name is absent or ignored are excluded. Migrating these inputs schedules no model-eval run.
- `eval/run.mjs`: when a declared path is absent at the baseline and not declared new, the runner asks git which baseline file was renamed to it and reads that file as the baseline. The lookup is one scan per run, `git diff -M --diff-filter=R --name-status -z <base> -- skills/`, at Git's default similarity; the resulting map is reused for every declared path. No old path is written in the runner, a target or a sample.
- Every `new: true` entry in the 29 targets is audited against the baseline under its direct path and its rename-matched path (five targets carry a stale flag at `590bb884`). An entry whose file the baseline holds either way loses the flag and reads the baseline text; the flag, and the empty baseline text it stands for, stays only on a file absent at the baseline both ways. `new: true` is never the way around a moved file git does not match. After a file declared new merges it is at the baseline: on a commit that is its own baseline (main after the merge, a release tag) that entry does not fail preparation, and on a branch whose baseline holds the file it is refused with the path, as the lint does today.
- The baseline arm's instruction text is read from Git verbatim and is never rewritten or filtered, so until the merge the baseline of a moved file still types retired step commands (the council target's baseline says its apply mechanics "live in `/skill:roasting-the-spec`"). The `/skill:` check of the ticket row covers what the runner generates on both arms - the invocation it builds, the replay instructions and the case text - and the candidate arm's instruction text. Only verbatim instruction text loaded from the baseline revision is exempt. This reading of the row goes to the user at the gate (Open questions).
- The runner exposes its preparation - structure, hygiene, intent binding, both revisions of every declared file, edit-target file placement - as a step that makes no model call, and `scripts/ci.mjs` runs it for every target and sample. The baseline is the merge-base of `HEAD` and `origin/main`.
- `.github/workflows/test.yml` checks out with `fetch-depth: 0`. The publish job of `.github/workflows/release.yml` runs `npm test` on a tag checkout, so it checks out with `fetch-depth: 0` too and fetches `origin/main` before `npm test`; the baseline resolves from a detached tag checkout, not only from a branch.
- Three new samples, the only model-eval runs of this change:

| Sample | Must hold |
|---|---|
| `eval/gauntlet/samples/handoff-follows-pointer` | Given a tracker reply to completing brainstorm that carries `Instructions: <fixture path>`, the agent's next action reads that path, shown by the fixture's token in the output; it emits no `/skill:` command and asks the person nothing |
| `eval/gauntlet/samples/ordinary-request-no-run` | Given the entry file in context, no run in progress and a plain implementation request, the agent makes no `phase_tracker` call, creates no worktree and reads no file under `skills/gauntlet/` |
| `eval/gatekeep-pr/samples/overrides-own-block-only` | Given a `gauntlet.md` with one distinctive instruction in `# shared` `## verification`, one directly under `# gatekeep-pr` and one under `# shape-ticket`, the output shows the first two effects and not the third |

`handoff-follows-pointer` measures a read, so narration cannot pass it. The text replay runs with no tools and no extensions, so this sample alone runs with the `read` tool enabled, in a scratch directory holding the sample's fixture. Its prompt carries the tracker tool description as the extension ships it, taken from `extensions/phase-tracker.ts` at each revision and not retyped in the case. The case gives the tracker's reply as a tool result whose `Instructions:` line names the fixture file; that path appears nowhere else in the prompt, and the case carries no instruction to read it. The fixture file holds a token found nowhere else, and the must-hold is a `mechanical:` fact on that token in the output: an agent that only says it read the file fails. The three samples stay the selected set.

Each target's `intent.md` and sample-scoped `report.md` evidence follow `eval/README.md`. A file whose only change is the move gets no model-eval run. The two review pointers change behavior; separately from the three selected samples above, row 37 assigns review evidence to the moved-text check and the verify trace below. No new model sample or paid run for the pointers. When committing them, the implementer records that distinction and evidence in the commit body.

### Test script

Add `scripts/gauntlet-tree-lint.mjs`, run from `scripts/ci.mjs`, with these rules:

| Rule | Fails when |
|---|---|
| `tree-shape` | a directory directly under `skills/gauntlet/` is not one of the five phases, a phase holds a directory other than `implement/waves` and `implement/loop`, or a second `SKILL.md` exists below `skills/gauntlet/`; the message names the path |
| `placement` | a file sits somewhere other than where the placement rule and its anchors put it (the message names both paths), a file has no run reader and no anchor, the rule is missing from the skill-authoring guide, `AGENTS.md` states the rule instead of linking to it, or another shipped file repeats the rule |
| `references` | a package-file reference in a skill, persona or extension message does not resolve from its installed caller, a cited step heading does not exist in the cited file, or the README skill inventory differs from the directories under `skills/` that hold a `SKILL.md`. A reference is one of these written forms: a local Markdown link in running text, resolved from the file that contains it; a `.md`, `.mjs` or `.ts` path in prose under `skills/`, `agents/`, `extensions/`, `bin/` or `doc/`, or a path after a `<package root>/` placeholder, resolved from the package root; any other `.md` or `.mjs` path in a skill's or persona's prose, resolved from the file that contains it. Not references: a link inside a Markdown code span or fence; a path matching the check's fixed list of consumer and scratch names, or a bare `.ts` file name, unless its sentence names the installed package, which resolves it from the package root; a prose path in extension source that is neither package-rooted nor a `../skills/` file nor the `package.json` locator; and a path its sentence places in the source repository - the path, an optional quoted heading and an optional `linked to` clause, then `in the source repository named in` the `package.json` locator, which is still checked. This list summarizes the patterns in `scripts/gauntlet-tree-lint.mjs` (`pathReference`, `packageRooted`, `artifacts`, `installedPackage`, `sourceRepositorySuffix`), which own the exact forms. The check matches those patterns over the text it extracts and parses neither sentences nor TypeScript: in extension source it drops every line that begins with `*`, `//` or `/*` and reads the string and template literals that remain, so a literal that such a line splits and a path inside a nested template expression are not read. The human accepted the check as implemented at the verify gate. The forms above bind as far as a fixture in `scripts/gauntlet-tree-lint.test.mjs` exercises them; an input no fixture covers - among them a path with another extension, a consumer path outside the fixed list, a file name its sentence roots in the installed package without spelling a package directory, a comment-like line of a message, and an attribution worded another way - is outside the requirement, and the packed-install test stays the check that every shipped caller resolves |
| `retired-names` | the search of acceptance row 9 finds a hit; its inputs are the eleven names and the old entry and file names, held in this script |
| `handoff-pointer` | a run file names the next phase's file or a `/skill:` command at one of the five announced hand-offs; or, walking the step files in tracker order for each engine, `plan/plan.md` does not initialize the wave tasks after `complete plan`, the loop approval does not emit the nondefault allowance before seeding, or `ship/ship.md` takes its worktree from a command argument |
| `overrides-outline` | the README outline breaks the naming rule, an overrides paragraph departs from its template (a block or section outside its allowance, a missing shared section name, reuse of a read not qualified by repo and revision), a `gatekeep-pr` file reads gate configuration from the PR head, a shipped file names `## conventions` or `## comms style` as a section to apply, `.pi/gauntlet.md` holds a heading the outline lacks, or a recognized overrides fixture in an eval sample input does not follow the outline (saved results and absence-test inputs excluded) |
| `release-notes` | the changelog section that holds this major's notes - `## Unreleased` until `release.sh` promotes it, that version's heading after - lacks an old-to-new entry or either upgrade statement; the retired names and the old entry and file names it looks for come from the `retired-names` list, not from a second copy |

Change in `scripts/`:

- `ci.mjs` drops its assertions on the twelve removed paths and asserts the registered set through the packed-install smoke, which loads the packed `skills/` directory with pi's exported `loadSkillsFromDir` and compares the exact names and hidden flags.
- `stage-skill-lint.mjs` keeps today's coverage as two file lists by new path, not a tree-wide scope. The cwd rules cover the files moved from the six stage directories (the entry step, plan step, both engines, ship step and worktree step with their helpers), and CI still applies them to `skills/gauntlet-handoff/SKILL.md`. The `temp-path` rule covers those files plus the files moved from the council and verify steps, `skills/gatekeep-pr` and `agents/loop-implementer.md`. The two allowed OS-temp literals map to `skills/gauntlet/return-file.md` and, unchanged, `skills/gatekeep-pr/reference/post-selection-loop.md`. The files of the test-first, parallel-dispatch and two review steps stay outside both rules, so the unchanged `mktemp -d` line in `implement/waves/parallel-agents.md` is not rejected.
- Existing contract tests follow the moved paths and new gate ids.

### Other shipped text

`README.md` (inventory of eleven, entry command, outline), `AGENTS.md`, the guides under `doc/`, the personas under `agents/` and the ten retained skills replace every retired name, old path, old gate id and old heading. `gatekeep-pr`'s citations of Step 6 of the ship step and Steps 1a and 2b of the worktree step name headings of `ship/ship.md` and `worktrees.md`. `chase-bug`'s hotfix, `gatekeep-pr`'s fix wave and `housekeeping`'s fix link `../gauntlet/commit-message.md` and `../gauntlet/return-file.md`. `.claude-plugin/marketplace.json` keeps its seven-skill allowlist.

`CHANGELOG.md` `## Unreleased` lists, old to new: the entry command, each retired step with its file, each gate id, the overrides file name, and each heading of today's README table with its replacement or "no longer read". It states that earlier run records appear only after `--migrate-records`, and that a run interrupted before the upgrade is finished before upgrading or on the previous major.

### Paid and external actions

Run one live Pi session per engine with the candidate installed in disposable repositories if a person can operate the gates. The current noninteractive worker cannot supply a human ship selection. If impractical before merge, the maintainer runs both after merge, before closing #174 or releasing. For each engine record in the delivery verification evidence the installed revision, expected gate and question sequence from the pre-move contract (map renamed ids with the Gate ids table), actual sequence, selected ending and observed action. If either observation fails, keep #174 open and hold the major release until the behavior is fixed and proven. Keep the underlying hand-off and shipping behavior in scope.

Approving this spec authorizes each action below for the whole flow, across seed, rows, repairs and finish, with no per-step prompt. Any count is advisory.

| Action | Runner | Inputs |
|---|---|---|
| Model-eval run `node eval/run.mjs <target> <sample>`, repeated after wording fixes | the main loop | `gauntlet handoff-follows-pointer`, `gauntlet ordinary-request-no-run`, `gatekeep-pr overrides-own-block-only` |
| `gh issue close 174 --comment "Delivered in <pr>, merged <merge-sha>."` | after merge and both successful observations: the ship step for pre-merge proof, the maintainer for post-merge proof | the merge result |
| `/skill:release major` | after the close: the ship step for pre-merge proof, the maintainer for post-merge proof | none |

The two ship actions are named here because the installed package ships this run and finds no cleanup steps once the branch renames the overrides file. This run's own record is sealed under the old key and moves at conversion.

**Post-deployment housekeeping.** After the release the maintainer runs `gauntlet-telemetry-seal --migrate-records` once in each of the six repos that carry the ref, and renames and regroups each consumer repo's overrides file. The companion changes in pi-condense, pi-cohort and pi-quiver listed under Out of scope follow as their own changes.

## Errors and edge cases

- Completing brainstorm without `engine` is the publish-for-handoff ending: the reply carries no `Instructions:` line. In an entered run with no engine recorded, `start plan` and `start implement` are refused with a message that says to complete or skip brainstorm with `engine`.
- `engine` with a value other than `waves` or `loop`, or on any call other than `complete` or `skip` of `brainstorm`, is rejected and changes no state.
- `status` between phases of an entered run names the next unfinished phase's file. It carries no `Instructions:` line with no run entered, in a finished run, after the publish-for-handoff ending, in a child session, or with implement in progress and no engine recorded. `complete plan` with `loop` recorded carries none.
- Overrides reader: no file at the three locations, a file only under the old name, no `# shared` block, the section under another block, or the old spelling of a heading each return nothing, with no warning. A section ends at the next `#` or `##` line or the end of the file. The first of two same-named blocks or sections wins. A `#` or `##` line inside a fenced code block is not a heading and ends no block or section. A block the outline does not list, such as a title line, is skipped.
- `--migrate-records` with no record under the old key prints `nothing to migrate` and exits 0. A record present under both keys with different content stops the run, names the path and moves nothing; identical content under both keeps one copy. A ref that moved between read and push fails with the existing re-run message.
- Eval: a declared path absent at the baseline that git pairs with no renamed file and that is not declared new is refused with the path and the `--base` hint; the refusal does not offer `new: true`. `npm test` fails the same way, and fails with a hint to fetch `origin/main` when no baseline resolves, in the test workflow and in the release workflow's publish job alike.
- A step's instructions no longer advertise standalone use; work outside a run that relied on a step's description gets no prompt from this package.

## Tests

- The packed install registers exactly the eleven skills, six of them hidden, loaded with `loadSkillsFromDir` from the packed `skills/` directory - `scripts/packed-install-smoke.test.mjs`
- Starting brainstorm after the entry reports it in progress and the entered-run guards apply - `extensions/phase-tracker.test.ts`
- A whole run on each engine without a typed step command, gates in the same order - none: needs a live session per engine; its parts are the `handoff-pointer` rule, the tracker reply tests and the gate-contract lint
- Tree shape, a sixth directory and a second `SKILL.md` fail with the path - `scripts/gauntlet-tree-lint.test.mjs` (`tree-shape`)
- One wording of the layout rule, in the skill-authoring guide - `scripts/gauntlet-tree-lint.test.mjs` (`placement`: rule missing from the guide, stated in `AGENTS.md`, or repeated in another shipped file)
- Each file sits where the rule and its anchors put it; a file with no reader and no anchor fails; a misplaced file fails with both paths - `scripts/gauntlet-tree-lint.test.mjs` (`placement`)
- All eleven steps live in the tree - `scripts/gauntlet-tree-lint.test.mjs` (`retired-names`, `tree-shape`)
- Moved files change only in the allowed classes - none: after the merge no earlier text remains to compare; reviewed at verify from `git diff -M --word-diff <merge-base> -- skills/` against row 8's classes. Inspect both pointer sentences, explicitly including the single bounded `SHIP` findings read when Minor count is nonzero; allow no other review-instruction edit.
- No retired name in the searched set - `scripts/gauntlet-tree-lint.test.mjs` (`retired-names`)
- README inventory lists the eleven - `scripts/gauntlet-tree-lint.test.mjs` (`references`: inventory against the `SKILL.md` directories)
- An ordinary request starts no phase - `eval/gauntlet/samples/ordinary-request-no-run`
- Hand-off replies name the next file per engine, with no `/skill:` command and no file content - `extensions/phase-tracker.test.ts`
- Status names the current file in a run and none outside one - `extensions/phase-tracker.test.ts`
- Status boundary states (between phases, finished, publish-for-handoff ending, child session, implement with no engine) and `complete plan` with `loop` recorded - `extensions/phase-tracker.test.ts`
- Observational status callers read no phase file: the resume active-session refusal and the handoff snapshot - `scripts/resume-routes.test.mjs`, `scripts/brief-contract-lint.test.mjs`
- No run file names the next phase at the five hand-offs - `scripts/gauntlet-tree-lint.test.mjs` (`handoff-pointer`)
- Hand-off obligations in order, one deterministic trace per engine with no model call: wave tasks initialized after `complete plan` and before the waves file is read; the nondefault allowance emitted before loop seeding; ship takes the retained absolute worktree - `scripts/gauntlet-tree-lint.test.mjs` (`handoff-pointer`)
- The five tracker messages name existing tree files and fire as before - `extensions/phase-tracker.test.ts`
- Resume from a run saved by this version at each supported point, with the engine passed on skip - `scripts/resume-routes.test.mjs` (run by `scripts/ci.mjs`; `scripts/resume-current-stages.test.mjs` is not run there and fails at `590bb884`, so it holds no proof)
- The resume seed route refuses a spec whose shipped or abandoned record sits under the new key on the remote ref, with no local record - `scripts/resume-routes.test.mjs`
- Package-file references resolve from the installed caller - `scripts/gauntlet-tree-lint.test.mjs` (`references`), `scripts/packed-install-smoke.test.mjs`
- Cited step headings exist in the moved files - `scripts/gauntlet-tree-lint.test.mjs` (`references`)
- The Claude Code plugin lists the seven skills and their relative references resolve - `scripts/claude-plugin-smoke.test.mjs`
- The three Claude-only reads find the commit-message and return-file content - `scripts/claude-plugin-smoke.test.mjs`
- A reviewer result at each of the three review points, findings checked against the diff - `scripts/wave-review.test.mjs`, `scripts/finish-verification.test.mjs`
- Structural text check, not live proof: tighten `scripts/wave-review.test.mjs` to require exactly one resolving path pointer at each changed site, after its reviewer result and before its first repair-selection instruction (wave verdict branches; Convergence c). Reject a late pointer or inline-only substitute and require the wave pointer to govern verdict-driven re-review as well as the first review.
- At verify, the verifier records a separate decision trace in the verification evidence using this synthetic reviewed hunk in `load.js`: `+const result = readConfig();` followed by `+return result.value;`, without checking `result.error`. The two Moderate findings are "read error ignored" and "the return was removed". Independently, `node --test test/format.test.mjs` exits 1 on a formatting assertion.
  - Waves: trace a red gate with the format failure: repair from its log, no reviewer. Once the gate is green, trace a mixed `FIX_FIRST` report: select the missing error check, cite `load.js: +return result.value;` in the review outcome, and make no edit for the return claim. Do not commit until green plus `SHIP`.
  - Convergence: trace the format failure in a and the same mixed report in b. The repair payload in c includes the missing error check and the independent failing format command; cite `load.js: +return result.value;` in the review outcome, with no edit for that claim. Record expected selections and citations, not a claim of live execution.
- Gate-contract rows carry the new ids and existing rendering files; the tracker and menu layout quote the new id - `scripts/gate-contract-lint.test.mjs`
- README outline naming, per-block sections and readers - `scripts/gauntlet-tree-lint.test.mjs` (`overrides-outline`)
- Every overrides paragraph follows its template: the seven shared section names written out, its own block, nothing else - `scripts/gauntlet-tree-lint.test.mjs` (`overrides-outline`)
- Trusted source per repo and revision: two member repos with different files each yield their own value - `extensions/lib/overrides.test.ts`; a paragraph with unqualified reuse, or a `gatekeep-pr` file reading gate configuration from the PR head, fails against a fixture pair whose head and merge-base files differ - `scripts/gauntlet-tree-lint.test.mjs` (`overrides-outline`)
- Overrides fixtures in eval sample inputs follow the outline; saved results and absence-test inputs are skipped - `scripts/gauntlet-tree-lint.test.mjs` (`overrides-outline`)
- Run files name their own phase's section only - `scripts/gauntlet-tree-lint.test.mjs` (`overrides-outline`)
- Code readers read a shared setting from `# shared` - `extensions/lib/overrides.test.ts`
- No skill names a setting in another skill's block - `scripts/gauntlet-tree-lint.test.mjs` (`overrides-outline`)
- `## conventions` and `## comms style` are named nowhere as sections to apply - `scripts/gauntlet-tree-lint.test.mjs` (`overrides-outline`)
- The loop engine's command resolution has no backticked fallback - `scripts/loop-engine-contract.test.mjs`
- This repo's overrides file follows the outline - `scripts/gauntlet-tree-lint.test.mjs` (`overrides-outline`)
- The file name and three locations in every reader - `extensions/lib/overrides.test.ts`, `scripts/gauntlet-tree-lint.test.mjs` (`retired-names`)
- Both files present, tracker under another block, old file only; siblings and spec-index sections - `extensions/lib/overrides.test.ts`, `extensions/verify-before-ship.test.ts`, `bin/gauntlet-spec-index.test.mjs`
- New records under the new key; the report and the index read no other run key - `src/bins/gauntlet-telemetry-seal.test.mjs`, `bin/gauntlet-performance.test.mjs`, `bin/gauntlet-spec-index.test.mjs`
- Every target prepares at both revisions without a model call; `npm test` fails on a refusal - `eval/lib/run.test.mjs`, `scripts/ci.mjs`
- No runner-generated invocation, replay instruction or case text on either arm, and no candidate instruction text, carries a `/skill:` command for an unregistered skill; verbatim baseline instruction text is exempt and unmodified - `eval/lib/run.test.mjs`
- The three model-eval samples - `eval/gauntlet/samples/handoff-follows-pointer`, `eval/gauntlet/samples/ordinary-request-no-run`, `eval/gatekeep-pr/samples/overrides-own-block-only`
- Release notes carry the old-to-new lists and the two upgrade statements, under `## Unreleased` or the promoted version heading, with old names taken from the `retired-names` list - `scripts/gauntlet-tree-lint.test.mjs` (`release-notes`; `scripts/commit-contract-docs.test.mjs` is not run by `scripts/ci.mjs` and fails at `590bb884`, so it holds no proof)
- Engine missing, unknown or on another call - `extensions/phase-tracker.test.ts`
- Overrides reader edge cases (missing file, old name, no shared block, wrong block, old spelling, section end, duplicate, fenced `#`, a fenced `##` that does not truncate a recognized section, unlisted block) - `extensions/lib/overrides.test.ts`
- The brief drops the `Instructions:` line - `scripts/brief-contract-lint.test.mjs`
- `--migrate-records`: nothing to migrate, conflict, identical duplicate, moved ref - `src/bins/gauntlet-telemetry-ref-migration.test.mjs`
- Eval rename lookup: paired, unpaired with the `--base` hint, declared new, no baseline; one scan reused for every declared path - `eval/lib/run.test.mjs`
- `new: true`: absent at the baseline both ways prepares with no baseline text; present directly or through a rename match is refused with the path on a branch; not refused on a commit that is its own baseline - `eval/lib/run.test.mjs`
- The baseline resolves from a detached tag checkout that has `origin/main` - `eval/lib/run.test.mjs`
- Stage lint keeps today's two scopes at the new paths and the two OS-temp literals; `implement/waves/parallel-agents.md` stays outside `temp-path` - `scripts/stage-skill-lint.test.mjs`

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (skill inventory, entry command, overrides outline - operations and tunable parameters); `doc/gate-contract.md` (gate ids - communication contracts); `doc/configuration.md` (verification-command resolution, `--migrate-records`, overrides file - operations and tunable parameters); `doc/implement-engines.md` (engine in phase state, tracker file pointer - architecture); `eval/README.md` (baseline through rename lookup, preparation in `npm test` - major procedures); `CHANGELOG.md` (old-to-new lists under `## Unreleased` - communication contracts)
- Derived / memory docs invalidated: `AGENTS.md` (Package rules, Change process, Testing, Routing); `doc/personas.md`; `doc/install-internals.md`

The materiality bar is `reference/documentation-impact.md`.

## Out of scope

AC 3: only the pre-merge live proof is deferred to the maintainer if impractical here.

- Prompts the model gets today on work outside a run (work test-first, show evidence before claiming completion, verify an outside reviewer's feedback, fan out parallel tasks, set up a worktree, finish a branch): they leave with their skills.
- Merging a step's logic into the step that uses it, or rewording a moved instruction: a follow-up after this release.
- A tracker hand-off from implement to verify.
- Typing a step's command to recover an interrupted run; `/skill:gauntlet-resume` is the recovery path.
- An alias, fallback or warning for an old name: `/skill:brainstorming`, an old gate id, an old overrides heading, `gauntlet-overrides.md`.
- An agent-facing reader that returns one section of the overrides file, and a check that rejects unknown headings or keys.
- Correcting pi-condense's `AGENTS.md`, protecting `gauntlet.md` in pi-condense's default settings, and renaming and regrouping the overrides files of pi-cohort, pi-condense and pi-quiver: companion changes in those repos.
- Resuming, after the upgrade, a run that was interrupted before it.
- A place in the overrides file for free-text rules that bind every skill, and a heading for the pull-request gate's wording rules.
- A `_shared` directory or a `phase/` wrapper in the tree.
- Renaming test scripts whose file names carry the old entry's name.

## Open questions

- The ticket's out-of-scope list names "a reader that returns one section of the settings file". This spec reads it as an agent-facing tool and keeps the internal module chosen in the brainstorm, which replaces five existing code readers and is not exposed to the agent.
- The ticket row "For a target whose instruction files are no longer a registered skill, the prompt the runner builds contains no `/skill:` command naming them" does not say whether the baseline arm counts. Until the merge, the baseline text of a moved file loaded from Git types retired step commands, so a check over both arms' full prompts refuses a faithful baseline. Design (Eval) reads the row as covering runner-generated text on both arms and the candidate arm's instruction text, with verbatim baseline instruction text exempt and unmodified. The user settles this at the gate through the scope-decision procedure: the row keeps `in-scope` under this reading or takes another disposition. Either way the row text is not edited and the baseline is not sanitized. It settles the Eval clause on the baseline arm and the matching Tests line.
