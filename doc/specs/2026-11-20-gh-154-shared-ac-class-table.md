# Shared AC class table: brainstorming reads a small reference file instead of shape-ticket's main file

**Goal:** The six-row acceptance-criteria class table has one home, `skills/shape-ticket/reference/ac-classes.md`, that shape-ticket's gate and brainstorming's two stage-proof instructions both read on demand, so a ticketed brainstorm reads about 1.6 KB for the check instead of the 48,627-byte `skills/shape-ticket/SKILL.md`, with class wording and both skills' behavior unchanged.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #154
**Date:** 2026-11-20
**Predecessor:** `doc/specs/2026-11-06-workflow-stage-acceptance-rows.md` - supersedes the class table's location, both brainstorming read pointers and the contract-test location only; `doc/specs/2026-11-16-gh-151-delivery-stage-audit-exclusion.md` - supersedes the class table's location in D1 only. Class wording, class semantics, the ticket-gate drop, the cut-question trigger and the drafted-row rule stay live in both.

## Problem

Brainstorming screens ticket rows and its own drafted rows for workflow-stage proof (a row whose only observable is a CI result, pull-request text, a merge or a full-suite run). The class is defined in a six-row table that exists only inside `skills/shape-ticket/SKILL.md`, at lines 164-171 under `## AC integrity gate`. Both of brainstorming's read instructions (`skills/brainstorming/reference/ticket-acceptance.md:30` for ticket rows, `:59` for drafted rows) point at that heading. A ticketed brainstorm that follows them loads the ticket-authoring skill's main file - 48,627 bytes of drafting, review-dispatch and tracker-write text - to use a 1,602-byte table.

Ticket #154 asks to move the section, or just the class table brainstorming needs, into a reference file both skills read on demand, keeping the moved wording. The reporter's constraint across the review that produced the ticket is that the saving must be meaningful.

Source measurements from the ticket, kept as descriptions of the input and not as targets: a consumer-repo run read 553 KB of skill and reference text across 32 files to ship a 33-line change; shape-ticket's main file was the fourth-largest of those files at 41 KB then and 49 KB now; the ticket sizes the gate section at 9.5 KB.

Decisions taken in the questionary:

- Extent of the move: the class table only (answer A of: table only; table plus the classifying rules; whole section). The `## AC integrity gate` heading, the hard-stop question, normalization, AC uniqueness, the two structural tests, the keep-PR-text exception, precedence, hard-stop run semantics, the deploy-window rule, the guards, `### Discovery (exploratory) tickets` and `### Split rule` stay in `skills/shape-ticket/SKILL.md`.
- Home of the table: a dedicated file (answer A of: dedicated `ac-classes.md`; top of the existing `skills/shape-ticket/reference/examples.md`).
- Both skills read the same six class definitions and keep their own recovery rules: shape-ticket applies the table's outcome column; brainstorming asks the cut question for a ticket row and applies its own drafting table (`skills/brainstorming/reference/ticket-acceptance.md:51-59`, which has different recovery actions and a drafted-only `Tree-wide` class) to a drafted row. The two tables are not merged.

Framing: kept - the scout's objection (a table-only move takes 1,602 bytes out of shape-ticket's file, not 9.5 KB) names no alternative to the ask. The ask's problem is brainstorming's read, which drops from 48,627 bytes to the shared file's size at any extent of the move.

Checked claims, at worktree HEAD `16263815`:

| Claim (source) | Lookup | Result |
|---|---|---|
| The class table exists only in shape-ticket's main file (ticket Context) | read `skills/shape-ticket/SKILL.md:141-213`; `rg -n "shape-ticket/(SKILL\|reference)" skills agents` | Held: header, separator and six rows at `skills/shape-ticket/SKILL.md:164-171`; `skills/brainstorming/reference/ticket-acceptance.md:51-59` is a different table, not a copy |
| Two read instructions in `ticket-acceptance.md` point into `shape-ticket/SKILL.md` (ticket Problem) | same `rg` | Held: lines 30 and 59. Line 24's `shape-ticket/SKILL.md:43` names repair mode and is a citation, not a read instruction |
| Baseline is 48,627 bytes and both files equal the pinned commit (ticket AC 2) | `wc -c`; `git diff --stat 09c9f4e10b9e9f1b6f2852cf9c35dc3e14025134 -- skills/shape-ticket/SKILL.md skills/brainstorming/reference/ticket-acceptance.md` | Held: 48627; empty diff |
| Brainstorming uses "one 9.5 KB section" (ticket title, Problem) | `sed -n 'A,Bp' skills/shape-ticket/SKILL.md \| wc -c` per range | Corrected: lines 149-212 are 9,501 bytes and hold the hard-stop procedure (149-159, 2,071), the structural tests (161-163, 516), the class table (164-171, 1,602), exception, precedence, run semantics, deploy window and guards (172-181, 2,101), the examples pointer (182-184), Discovery (185-194, 986) and Split rule (195-212, 2,126). Both read instructions ask for "that table", the 1,602 bytes |
| Brainstorming needs shape-ticket's keep-PR-text exception sentence to screen rows | `sed -n '30p' skills/brainstorming/reference/ticket-acceptance.md` | Not needed: the trigger row carries its own exception inline ("a row whose CI result, suite result, or pull-request text is itself the behavior under change is not one") |
| Consumer run read 553 KB across 32 files (ticket Context) | ticket footer `source: consumer run - none (private workspace thread)` | Not checkable: private thread; motivation only, not a target |
| Ticket comments carry `Reporter note:` sections | `gh` comments API, page 1 of 50 | None: zero comments, short page |
| Only a file under shape-ticket's folder resolves on Claude Code | `cat .claude-plugin/marketplace.json`; `rg -n "reference/[a-z-]+\.md" skills/shape-ticket/SKILL.md` | Corrected: the plugin source is the repo root with a `skills` allowlist, and shape-ticket already reads `../brainstorming/reference/menu-layout.md` (`skills/shape-ticket/SKILL.md:70,141,151`). The file sits in shape-ticket's folder because shape-ticket owns the class (`doc/specs/2026-11-16-gh-151-delivery-stage-audit-exclusion.md:94`) and brainstorming already reads `../shape-ticket/reference/split-axes.md` (`skills/brainstorming/SKILL.md:82`) |
| A new file under `skills/shape-ticket/reference/` ships on npm and Claude Code with no manifest change | `package.json` `files`; `.claude-plugin/marketplace.json` | Held: `files` lists `skills`; the marketplace lists `./skills/shape-ticket` as a directory |
| The gate already reads a companion reference file | `rg -n "examples\.md" skills`; `wc -c skills/shape-ticket/reference/*.md` | Held: `skills/shape-ticket/SKILL.md:183` reads `reference/examples.md` (2,478 bytes) |
| Existing shape-ticket reference reads carry an unreadable clause | `rg -n "Read .*reference/\|[Uu]nreadable" skills/shape-ticket/SKILL.md` | Not found: the reads at `:56,60,183,274,281` carry none |
| `shape-ticket/hard-stop` maps to the `## AC integrity gate` heading | `sed -n '71p' doc/gate-contract.md` | Held; stays true while the heading and the hard-stop text stay |
| No product doc names the table's location | `rg -n "AC integrity gate\|class table" README.md doc/*.md CONTRIBUTING.md eval/README.md eval/shape-ticket/README.md` | Held: `doc/gate-contract.md:71`, `CONTRIBUTING.md:9`, `eval/shape-ticket/README.md:3` name the gate, which keeps its heading and file |
| Instruction-size lint limit | `scripts/skill-size-lint.mjs:4-25`; `wc -c` | Held: 48,627 of 50,000 bytes today |
| Deterministic tests pin the table's location | `sed -n '108,136p' scripts/brainstorming-contract.test.mjs`; `sed -n '222,234p' scripts/ci.mjs` | Held: the contract test requires `^\| Workflow-stage proof \|` in `skills/shape-ticket/SKILL.md`, reads the gate row from it, and requires the trigger to include the old pointer text; `scripts/ci.mjs:230` token-checks the row's observable list in `skills/shape-ticket/SKILL.md` |
| The shape-ticket eval target assembles the class table today | `cat eval/shape-ticket/target.json` | Held: it slices `### 4 - Draft` to `## Roast` of the main file, which spans the gate; no entry for a new reference file |
| Three brainstorming samples load the table through the main file | `sed -n '1,8p' eval/brainstorming/samples/{workflow-stage-ticket-row,workflow-stage-drafted-row,pr-body-drafted-row}/case.md` | Held: each opens `bundle+: skills/shape-ticket/SKILL.md`; `workflow-stage-drafted-row/case.md:5` and `pr-body-drafted-row/case.md:5` say the "owning gate" is available in context |
| A `skillFiles` entry is assembled for every sample of its target | `sed -n '35,47p' eval/lib/replay.mjs` | Held: `assemble` loops `target.skillFiles`, then the sample's `bundle+` paths; a declared-new entry has empty baseline text |
| A file absent at the baseline needs a declared-new entry | `eval/README.md:68`; `eval/lib/lint.mjs:22-23,51`; `rg -n '"new": *true' eval/*/target.json` | Held: 19 such entries already sit in merged targets |
| Removing the `bundle+` line keeps a like-for-like comparison in the three brainstorming samples | same `eval/lib/replay.mjs` lookup | Corrected: their baseline arm then assembles no class table. Evidence for those samples is the candidate arm's must-hold facts |
| Tests pin the exact `skillFiles` list of either target | `sed -n '45,76p' eval/lib/replay.test.mjs`; `rg -n "skillFiles" eval/lib/replay.test.mjs scripts/delivery-stage-authoring.test.mjs` | Corrected: the test `shape-ticket baseline preserves slices and excludes only audit from all existing cases` pins `target.skillFiles` to `[...shapeTicketFiles, { path: auditPath }]` (three entries at `:47-51`, `deepEqual` at `:57`), the non-audit sample count at 17 (`:59`), each such sample's first line `bundle-: skills/shape-ticket/reference/repo-audit.md` except `gate-line-first` and `per-ref-settlement` (`:69`), and each such sample's assembly equal to one built from `shapeTicketFiles` (`:74`). `npm test` runs it (`scripts/ci.mjs:561` runs every `eval/lib/*.test.mjs`). No test pins the brainstorming manifest's list. Lines 80-98 are the audit-sample test (`wordCap` 1600, `# Repository audit`) |
| Five samples cover the change | `cat scripts/delivery-stage-authoring.test.mjs` | Corrected: that CI test requires the committed records of `shape-ticket/pr-body-proof`, `brainstorming/pr-body-drafted-row` and `brainstorming/post-action-sorted` to match the current assembly, and brainstorming's `intent.md` `for:` line to bind to it. Both assemblies change, so the selection is seven samples |
| A shape-ticket sample covers a create-mode stage-proof drop (ticket AC 4) | `cat eval/shape-ticket/samples/workflow-stage-proof/case.md`; `ls eval/shape-ticket/samples` | Not found: `workflow-stage-proof` runs in repair mode; no create-mode sample feeds a CI-only row to the gate |
| Create mode can carry a retired stage proof in a Reporter note | `sed -n '74,90p' skills/shape-ticket/SKILL.md` | Held: step 4 persists displaced text as a trailing `## Proposed Reporter note` in both modes |
| The shape-ticket live replay loads every reference file the main file names | `sed -n '128,137p' eval/shape-ticket/replay/run.mjs` | Corrected: `loadInstructions` matches `/reference\/[a-z-]+\.md/g`, and `reference/ac-classes.md` fits that pattern, so the name needs no harness change. That is regex compatibility only. Separately, a read-only call to `loadInstructions('HEAD')` aborts before returning an instruction map with `ENOENT` for `skills/shape-ticket/reference/menu-layout.md` (the file lives under `skills/brainstorming/reference/`); the failure predates this change, so the live replay is not evidence that the table is loaded |
| CI can compare the moved rows with the pinned commit | `rg -n "fetch-depth\|checkout@" .github/workflows/test.yml` | Not available: a depth-1 checkout without commit `09c9f4e1` |
| Replay models and judge | `cat eval/lib/models.mjs` | Two replay models and one judge, frozen there |
| Another CI test binds a brainstorming or shape-ticket record to the current assembly | `rg -ln "skillSha\|judgmentCurrent\|cellReusable" scripts eval --glob '*.test.mjs'`, then `rg -n "brainstorming\|shape-ticket"` in each hit | Not found: `scripts/commit-message-contract.test.mjs:170-171` checks `brainstorming/spec-and-amendment-subjects` against its own recorded hashes; only `scripts/delivery-stage-authoring.test.mjs` binds to the current assembly |
| `CHANGELOG.md` has an `## Unreleased` heading | `sed -n '1,8p' CHANGELOG.md` | Not found: the top heading is `## v8.8.5 - 2026-11-20` |

Ticket-row screen for workflow-stage proof: none of the four ticket rows is a stage proof - rows 1-2 observe file content, rows 3-4 observe skill behavior. No cut question was asked.

## Acceptance criteria

Ticket #154, Acceptance Criteria, rows verbatim:

- [ ] Both read instructions in `skills/brainstorming/reference/ticket-acceptance.md` name the shared reference file that carries the class table, and neither instructs a read of `skills/shape-ticket/SKILL.md`.
  in-scope
- [ ] `skills/shape-ticket/SKILL.md` no longer contains the class table and is smaller than its 48,627-byte baseline; the moved class rows are unchanged from commit 09c9f4e10b9e9f1b6f2852cf9c35dc3e14025134.
  in-scope
- [ ] Given a ticket row whose only proof is a CI result, brainstorming's workflow-stage-proof check gives the recommendation that the trigger table in `skills/brainstorming/reference/ticket-acceptance.md` specifies at that commit.
  in-scope
- [ ] Given a draft containing that row, `/skill:shape-ticket` in create mode and in repair mode gives the row the disposition the gate specifies at that commit, reading the class rows from the same file brainstorming reads.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-154-shared-ac-class-table
contract:
- create: git worktree add .worktrees/<name> -b <branch>
- destroy: git worktree remove .worktrees/<name> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (AGENTS.md Testing); node eval/run.mjs <target> <sample> for the samples named in Tests
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/gauntlet-resume/reference/coordinated.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4
design: owns every path in Design; observable outcomes are the four AC rows above

## Design

supersedes `doc/specs/2026-11-06-workflow-stage-acceptance-rows.md`, the class table's location, both brainstorming read pointers and the contract-test location only
supersedes `doc/specs/2026-11-16-gh-151-delivery-stage-audit-exclusion.md`, the class table's location in D1 only

The change is a move plus re-pointed readers. No class is added, removed or reworded, and neither skill's recovery rules change. Every skill and reference edit follows `/skill:forge-skill`'s authoring rules: minimal diff, imperative voice.

Readings of ticket rows, as Design clauses:

- AC 2, "the moved class rows": the table header, its separator and the six class rows, byte-for-byte equal to `skills/shape-ticket/SKILL.md` lines 164-171 at commit `09c9f4e10b9e9f1b6f2852cf9c35dc3e14025134`.
- AC 3, "the recommendation that the trigger table specifies": `D - a stage proof is not an outcome`, from the trigger row's `Recommendation` cell, which this change does not touch.
- AC 4, "the disposition the gate specifies": the row is dropped and its text is retained in the Reporter note as `retired workflow-stage proof: <row text>`; surviving rows keep their wording.
- AC 4, "the same file brainstorming reads": the gate's read line and both brainstorming instructions resolve to `skills/shape-ticket/reference/ac-classes.md`. The gate keeps the skill-relative spelling `reference/ac-classes.md` (D2), like its `reference/examples.md` read; brainstorming keeps the relative link `../../shape-ticket/reference/ac-classes.md` (D3).

### D1 - the shared file

Add `skills/shape-ticket/reference/ac-classes.md`: the title line `# Acceptance criteria classes`, one blank line, then the eight table lines from D-clause AC 2 above with no byte changed. The file holds nothing else. Brainstorming's read for the stage-proof check is this file, about 1.6 KB, which is the meaningful saving the reporter asks for: 48,627 bytes before, about 1.6 KB after.

### D2 - shape-ticket's gate reads it

Remove `skills/shape-ticket/SKILL.md` lines 164-171 (the table). Add in their place one line in the gate's existing read style:

```markdown
Read `reference/ac-classes.md` now for the class table: each class's definition and its outcome after failed recovery.
```

Everything else in the main file stays byte-identical, including the `## AC integrity gate` heading and every part listed under the extent decision in Problem. The main file shrinks from 48,627 bytes to about 47.1 KB. `doc/gate-contract.md:71` stays correct with no edit. The gate runs in create mode and repair mode alike, so one read line serves both.

### D3 - brainstorming's two instructions name it

In `skills/brainstorming/reference/ticket-acceptance.md`:

- Line 30 (the ticket-row trigger): replace `` `shape-ticket/SKILL.md` `## AC integrity gate` `` with ``[`shape-ticket/reference/ac-classes.md`](../../shape-ticket/reference/ac-classes.md)``.
- Line 59 (the drafted `Workflow-stage proof` row): replace the same pointer text with the same link.

No other word in either row changes: the "read that table at first use; a read, never a `/skill:shape-ticket` invocation" wording, the inline exception, the screening column and the `Recommendation` cell stay. The citation `shape-ticket/SKILL.md:43` on line 24 stays; it is not a read instruction.

### D4 - deterministic pins

In `scripts/brainstorming-contract.test.mjs`, test `workflow-stage proof has an owning gate, ticket trigger, drafting rule, and example`:

- Keep the loop's byte-limit and line-limit checks for both `skills/shape-ticket/SKILL.md` and `skills/brainstorming/reference/ticket-acceptance.md`, and keep the `^\| Workflow-stage proof \|` match for the brainstorming reference, which holds its own drafting row. Drop only that class-row match for `skills/shape-ticket/SKILL.md`.
- Read the gate row from `skills/shape-ticket/reference/ac-classes.md` instead of the main file; its existing marker checks stay.
- Locate the trigger row by the new link text ``workflow-stage proof under [`shape-ticket/reference/ac-classes.md`](../../shape-ticket/reference/ac-classes.md)`` in place of the old pointer text ``workflow-stage proof under `shape-ticket/SKILL.md` `## AC integrity gate` ``. That text is the locator, not an assertion; the two assertions that depend on the located row (`D - a stage proof is not an outcome`, `pull-request text is itself the behavior under change`) stay.
- Add: the shared file holds exactly six class rows named Wishful, Tautological, Unspecified-but-binding, External-input dependency, Post-deployment and Workflow-stage proof; `skills/shape-ticket/SKILL.md` contains no line starting `| Class | Definition |`; `skills/shape-ticket/SKILL.md` names `reference/ac-classes.md`; the ticket-row trigger (the row starting `| An observation in a ticket row`) and the drafted row (the row starting `| Workflow-stage proof |`) of the brainstorming reference, each located by its row text and not by line number, contain the link target `../../shape-ticket/reference/ac-classes.md`, and neither contains `shape-ticket/SKILL.md`.
- Every other assertion in the test stays.

In `eval/lib/replay.test.mjs`, test `shape-ticket baseline preserves slices and excludes only audit from all existing cases`:

- Add `{ path: "skills/shape-ticket/reference/ac-classes.md", new: true }` as the fourth entry of `shapeTicketFiles`, mirroring the manifest order in D5, so the `deepEqual` on `target.skillFiles` and the per-sample assembly equality both include the shared file.
- Change the non-audit sample count from 17 to 18 for `workflow-stage-proof-create`.
- Keep `auditSamples`, the first-line `bundle-:` assertion, the `drop` assertion, the assembly equality and the `# Repository audit` exclusion unchanged; the new sample satisfies them through its first line (D5).

In `scripts/ci.mjs`, re-point the token check at line 230 from `skills/shape-ticket/SKILL.md` to `skills/shape-ticket/reference/ac-classes.md`; its literal stays.

### D5 - evals

Targets:

- Add the whole-file entry `{ "path": "skills/shape-ticket/reference/ac-classes.md", "new": true }` to `skillFiles` in both manifests. In `eval/shape-ticket/target.json` it sits after the three existing slice entries and before the `skills/shape-ticket/reference/repo-audit.md` entry; in `eval/brainstorming/target.json` it is appended as the last entry. Entry order is part of the assembly, so it sets `skillSha` and each `for:` binding. Every sample of both targets then assembles the table on the candidate arm.
- `"new": true` is for the pre-move comparison only, where the baseline lacks the file. Baseline-aware lint (`eval/lib/lint.mjs:22-24`, called from `eval/run.mjs:174-184`) refuses every sample of both targets with `new file exists at baseline` once the chosen baseline contains `ac-classes.md`. Operator step, not part of this change's implementation: at the first comparison whose baseline contains the file, the eval operator removes only the `"new": true` marker from that entry in both manifests and from the fourth `shapeTicketFiles` entry in `eval/lib/replay.test.mjs`, keeping the entry and its order.
- Target READMEs. In `eval/shape-ticket/README.md`: add a `skills/shape-ticket/reference/ac-classes.md` whole-file row to the `Skill file | Slice` table between the `## Evidence gate` slice row and the `repo-audit.md` row; extend the sentence "Retain the original three slices plus the audit reference in target.json." to name the class-table file as well; and state that `workflow-stage-proof-create` is a create-mode step-4 checkpoint that excludes the audit reference. In `eval/brainstorming/README.md`: add the same file as a whole-file row to its `Skill file | Slice` table. `eval/README.md` and every other inventory entry in both READMEs stay unchanged.

Samples:

- Remove the line `bundle+: skills/shape-ticket/SKILL.md` from `eval/brainstorming/samples/workflow-stage-ticket-row/case.md`, `workflow-stage-drafted-row/case.md` and `pr-body-drafted-row/case.md`. In the last two, reword "owning gate" to "class table" so the case text names what is assembled. Their `expected.md` files stay unchanged.
- Add `eval/shape-ticket/samples/workflow-stage-proof-create/` with `case.md` and `expected.md`, modeled on the existing step-4 checkpoint `eval/shape-ticket/samples/workflow-stage-proof/` (step 4 Draft and the AC integrity gate, no tools). `obsolete-create-drop-idea` is not the model: it exercises a step-8 audit decision and is listed in the replay test's `auditSamples`. The first line of `case.md` is `bundle-: skills/shape-ticket/reference/repo-audit.md`, which places the sample in the non-audit group that `eval/lib/replay.test.mjs` pins (D4). The case is a free-text create request, synthetic and with no ticket reference, that states two acceptance criteria: one behavior with setup, action and result, and one whose only observable is that CI passes on the pull request. No tool call and no tracker write occur.

Must-hold facts:

| Sample | Must hold |
|---|---|
| `shape-ticket/workflow-stage-proof-create` (new) | The drafted acceptance criteria keep the behavior criterion with its wording; no drafted acceptance row names the CI result; the `## Proposed Reporter note` carries `retired workflow-stage proof:` followed by the CI criterion's text; the turn is not a hard stop and does not park the ticket |
| `shape-ticket/workflow-stage-proof` | Its existing `expected.md`: in repair mode a standalone stage-proof row and a stage-only clause are dropped, surviving wording is preserved, each retained original is labeled `retired workflow-stage proof:`, and an emptied list is recovered or parked |
| `shape-ticket/pr-body-proof` | Its existing `expected.md`, unchanged |
| `brainstorming/workflow-stage-ticket-row` | Its existing `expected.md`: the ticket row stays verbatim and the cut question recommends D |
| `brainstorming/workflow-stage-drafted-row` | Its existing `expected.md`: the drafted row keeps its committed outcome and carries no stage-only proof |
| `brainstorming/pr-body-drafted-row` | Its existing `expected.md`, unchanged |
| `brainstorming/post-action-sorted` | Its existing `expected.md`, unchanged; it is re-run because `scripts/delivery-stage-authoring.test.mjs` binds its committed record to the current assembly |

Records and intent:

- Commit the records and the sample-scoped partial reports of those seven samples per `eval/README.md#iterating-on-a-skill-edit`.
- Add a `## Change` entry to `eval/shape-ticket/intent.md` and `eval/brainstorming/intent.md` and refresh each `for:` line to the new assembly. The brainstorming entry states that the baseline arm of the three samples that lost their `bundle+` line assembles no class table, so their evidence is the candidate arm's must-hold facts. Both entries state that the `"new": true` marker on the `ac-classes.md` entry is for the pre-move comparison only and name the removal trigger from Targets: the first comparison whose baseline contains the file.

Paid actions. The only paid action is `node eval/run.mjs <target> <sample>`, run by the implementer or the main loop from the worktree with the runner's default baseline, for the seven samples in the table above; `--baseline-only` re-seeds a baseline first where `eval/README.md` requires it for a changed bundle line. Before the first paid run, `node --test eval/lib/replay.test.mjs` passes against the changed manifests and the new sample. Each run calls the two replay models and the judge frozen in `eval/lib/models.mjs`. Approving this spec authorizes that action for the whole flow - seed, rows, repairs after wording fixes, and finish - with no per-step permission prompt and no count. A sample outside the seven is reached only through the rule in Errors and edge cases; a target-wide or cross-target sweep is never run.

### D6 - changelog

Add one bullet under `## Unreleased` in `CHANGELOG.md` (create that heading above `## v8.8.5` - the file has none today) saying that the acceptance-criteria class table moved to `skills/shape-ticket/reference/ac-classes.md` and that brainstorming reads that file instead of shape-ticket's main file, ending `(#154)`.

## Errors and edge cases

- Shape-ticket's new read line carries no "unreadable" clause. Its five existing reference reads carry none and the file ships in the same folder, so no new stop path is added.
- The integrity gate runs during gather and again on the assembled draft for every ticket, batch mode included (`skills/shape-ticket/SKILL.md:153`, `skills/shape-ticket/reference/repo-audit.md:76`). D2's read line is the whole instruction: it says "now", like the examples read below it (`skills/shape-ticket/SKILL.md:176`), and carries no reuse wording. The table is in context after the first gate run, so the second run needs no further instruction; each run judges the current ticket's rows, never a prior gate result.
- Brainstorming's first-use rule is unchanged: the table is read once at checklist step 4 and reused at spec-writing.
- A consumer's overrides file that cites `shape-ticket/SKILL.md` `## AC integrity gate` for the class table still resolves to the gate, whose read line leads to the table. No migration is needed.
- When `npm test` reports a committed eval record or an `intent.md` binding outside the seven samples as stale against the changed assembly, that sample is re-run with the same paid action and its record committed; the selection grows by exactly the samples the test names.
- When a must-hold fact of `shape-ticket/workflow-stage-proof-create` fails on both the baseline arm and the candidate arm, the failure predates the move: the implementer reports the baseline failure and stops for user review. The gate is not reworded and the expected fact is not relaxed as part of this extraction.
- The instruction-size lint covers the new file; it is far under both limits.
- Both predecessor specs carry a supersession banner pointing at this spec for the scopes named in the header.

## Tests

- Both brainstorming read instructions name the shared file and neither names `shape-ticket/SKILL.md` (AC 1) - `scripts/brainstorming-contract.test.mjs`
- The main file holds no class-table header and the shared file holds the six class rows (AC 2) - `scripts/brainstorming-contract.test.mjs`
- The gate's read line and both brainstorming instructions resolve to the same file (AC 4) - `scripts/brainstorming-contract.test.mjs`
- The shape-ticket manifest's entry order, the 18 non-audit samples' audit exclusion and their assembled inputs match the pinned expectation - `eval/lib/replay.test.mjs`
- The stage-proof observable list is present in the shared file - token check in `scripts/ci.mjs`
- The main file is under 48,627 bytes and the moved rows equal the pinned commit (AC 2) - none: CI's depth-1 checkout lacks the commit; verification runs `wc -c skills/shape-ticket/SKILL.md` and `git show 09c9f4e10b9e9f1b6f2852cf9c35dc3e14025134:skills/shape-ticket/SKILL.md | sed -n '164,171p' | cmp - <(tail -n +3 skills/shape-ticket/reference/ac-classes.md)` once in the worktree
- A ticket row whose only proof is a CI result gets the cut question recommending D (AC 3) - `eval/brainstorming/samples/workflow-stage-ticket-row`
- A drafted row with stage-only proof keeps its outcome and loses the proof - `eval/brainstorming/samples/workflow-stage-drafted-row`, `eval/brainstorming/samples/pr-body-drafted-row`
- Repair mode drops the stage-proof row and labels the retained text (AC 4) - `eval/shape-ticket/samples/workflow-stage-proof`, `eval/shape-ticket/samples/pr-body-proof`
- Create mode keeps the behavior criterion, drops the CI-only criterion and carries the retired line in the proposed Reporter note (AC 4) - `eval/shape-ticket/samples/workflow-stage-proof-create`
- Committed records and the brainstorming `intent.md` binding match the current assembly - `scripts/delivery-stage-authoring.test.mjs`
- The new `skillFiles` entries pass eval lint as declared-new - `eval/lib/lint.mjs` through `npm test`
- No unreadable clause on the new read line - none: no new error path
- A consumer override citing the gate still reaches the table - none: prose reachability, no executable surface

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` (`## Unreleased` bullet; Architecture - the class table's owning file is a boundary between two skills)
- Derived / memory docs invalidated: none

The bar is `reference/documentation-impact.md`. The gather draft's two candidates fail it: `doc/gate-contract.md` stays correct because the gate keeps its heading and file, and `eval/README.md` gains no new convention. Skill and reference files are implementation surface, tracked in Design. The two eval target READMEs mirror their `target.json` inventories and are updated as eval surface in D5.

## Out of scope

- Moving any other part of the gate section (structural tests, exception sentence, precedence, Discovery, Split rule) out of the main file.
- Merging shape-ticket's class table with brainstorming's drafting table, or changing any class's wording, definition or outcome.
- The citation `shape-ticket/SKILL.md:43` at `skills/brainstorming/reference/ticket-acceptance.md:24`: it names repair mode, while line 43 is the `--skip-overlap` sentence and the repair bullet is line 45. Reported as an adjacent finding, not fixed here.
- Extracting conditional blocks from the three largest skills (#155) and releasing already-read instructions after a phase (#156).
- Runtime, extension, bin and settings changes; none is needed.
- Rewriting historical specs or saved eval records that quote the table at its old location.
- Repairing or running the shape-ticket live replay (`eval/shape-ticket/replay/run.mjs`), whose loader fails before this change.

## Open questions

None.
