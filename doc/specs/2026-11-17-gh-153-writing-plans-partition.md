# Partition writing-plans by reader

**Goal:** `/skill:writing-plans` loads only the planning flow into the main session; every plan-authoring rule lives once in one file that only the `plan-writer` child reads, and the main session's open-questions handling lives in one file read on the branch that needs it.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #153
**Supersedes:** `doc/specs/2026-10-18-gh-69-fresh-planner-child.md`, the `skills/writing-plans/SKILL.md` Components row clause keeping the authoring sections in the skill, `### plan-writer persona` items 1 and 3 (the read of `SKILL.md` headings), and the "Out of scope" entry excluding a split

## Problem

`skills/writing-plans/SKILL.md` is 46,338 bytes. The main session loads all of it on `/skill:writing-plans`, but 31,692 bytes (`## File Structure` through `## Self-Review (Before Handoff)`, lines 90-352 at `09c9f4e1`) are executed only by the fresh `plan-writer` child, which reads that span and the 13,087-byte `skills/writing-plans/reference/plan-contract.md` together in one step. The two files state several rules twice, the main session carries branch detail it uses only when the child returns open questions, and about 0.8 KB of plan-authoring reminders reach no plan author at all.

User constraints (initial prompt and round replies): do not assume the current `SKILL.md`/reference split is correct; keep only flow in `SKILL.md`; put subject detail in reference files; text always read together shares one file; follow gatekeep-pr and brainstorming as partition models; every change follows `/skill:forge-skill`; every `.md` stays under the 50,000-byte limit; deduplicate `plan-contract.md` rather than split it.

Framing: kept - the user's partition instruction already adopts the scout's objection to the ticket's single contiguous extraction; checked every reader of the span and the contract, the persona read instruction, the amendment and resume callers, and both role-model skills; no further alternative found.

### Checked claims

| Claim | Lookup | Result |
|---|---|---|
| The child-only span is 31,692 of 46,338 bytes | per-heading byte sum over `SKILL.md` L90-L352; `wc -c` | held |
| The main session never executes the span | `SKILL.md:88` | held |
| pi loads the whole `SKILL.md` into the invoking session | pi `docs/skills.md:3,43` | held |
| The child reads the span and all of `plan-contract.md` in one step | `agents/plan-writer.md:46` | held |
| No other instructed reader of the span or the contract exists | `rg` over `skills agents doc README.md extensions src scripts eval` | held: `doc/configuration.md:266`, `doc/implement-engines.md:70`, `README.md:132` link the contract; `skills/gauntlet-resume/reference/brief-contract.md:223` and `skills/brainstorming/reference/amendment-surface.md:51,156,172,181,183` pass paths or cite steps (`:181,183` cite step 6 for the question presentation); none reads the files |
| `Amend-prepare:` reads neither file; `Amend-apply:` uses the span's implement-local bullets and the contract's implement-only section | `agents/plan-writer.md:29-41,49` | held |
| The span is all of the child's authoring rules | `SKILL.md:353-362` (`## Remember`, 531 bytes), `:377-382` (six plan-quality `## Red Flags` rows, about 250 bytes) | corrected: both sit outside the child's read and reach only the main session, which never writes a plan; the same holds for two `## Overview` authoring sentences (`SKILL.md:12,14`) |
| Rules are stated twice across the span and the contract | line-pair comparison (lists in Design) | held: eight passages restate a rule owned elsewhere (1,777 bytes); four overlapping pairs carry distinct details on both sides |
| Size and line limits | `scripts/skill-size-lint.mjs:22-23`; `skills/forge-skill/SKILL.md` Oversized file | held: 50,000 bytes and 2,000 lines per `skills/**/*.md` and `agents/*.md` (lint); 500 lines (forge-skill) |
| Rules cannot move into the persona body | persona 11,332 + span 31,692 + contract 13,087 = 56,111 bytes | held: over the ceiling; the contract is also linked as a file by three docs |
| Parent step 6 holds conditional detail | byte sum over `SKILL.md:73-84` | held: 3,769 bytes, of which the first-line sentence, row table and pause rule (about 2.7 KB) apply only when the child returns substantive rows |
| Step-6 questions are inventoried gates | `doc/gate-contract.md:30-32`; `scripts/gate-contract-lint.mjs:71-90` | held: three question rows name `skills/writing-plans/SKILL.md`, site `## Author the plan`; the lint requires the `Start the message with` sentence inside the site section and a `menu-layout.md` link in the rendering file |
| Anchors into the contract from outside it | `rg -no 'plan-contract\.md#[a-z0-9-]+'` | held: `#implement-only-historical-evidence` (`doc/implement-engines.md:70`); `#legs-leg-unknown`, `#pr-subject-verification`, `#files-wave-file-disjointness-paths-exist-files-block` (from the span) |
| Callers that spell the five-path task | `rg 'Plan skill\|five (absolute )?paths'` | held: `SKILL.md:58,65,68,70`; `agents/plan-writer.md:24,39,46,49,50` and `:31` (`Keep the five-path inputs.`); `amendment-surface.md:51,156`; `skills/subagent-driven-development/reference/implement-amendments.md:5`; `brief-contract.md:223` (and `:230-231` cite "writing-plans step 6's"); `scripts/implement-amendment.test.mjs:28` pins `five absolute paths` |
| Content pins on moved text | `rg 'writing-plans/(SKILL\|reference)' scripts eval/lib` | held: sites listed in Design |
| Eval target slices name span headings | `eval/writing-plans/target.json`; `eval/README.md:60-68` | held: three of four slices name headings this change removes; a slice must resolve on both arms; a candidate-only file needs `"new": true` |
| A text replay observes no real child read | `eval/writing-plans/target.json` (`kind: text`); `eval/writing-plans/replay.md` | held: rows 1 and 2 are observed through replays and a structural guard (Design, "Reading of the ticket rows"); the generic replay endpoint has a `Role: plan-writer` case write plan text plus a final line with no read narration, and a case overrides the endpoint in its own text (`leg-checkout-by-branch`, `fresh-child-authors-plan`) |
| A sample can drop the skill's `SKILL.md` | `eval/README.md:64`; `eval/lib/lint.mjs` | corrected: the guide says the skill's `SKILL.md` is never dropped; lint does not enforce it, so the child-only drop is a recorded exception with a guide amendment |
| No CI test checks a model-written plan with `plan_check` | `extensions/lib/plan-check.test.ts:253-277`; `scripts/ci.mjs:504` | corrected: the test `removal-only plan declares one Delete owner and passes checkPlan` runs `checkPlan` on both recorded model-written plans in `eval/writing-plans/results/removal-lists-delete/candidate.json`; it runs no live child and observes no read |
| Ticket rows are workflow-stage proofs | `skills/shape-ticket/SKILL.md` `## AC integrity gate` | not triggered: the plan-phase run, the child's reads and `plan_check` on its plan are behaviors of the skill under change |
| No earlier spec covers the partition | `doc/specs/2026-10-18-gh-69-fresh-planner-child.md:49,65,137` | corrected: that spec keeps the authoring sections in `SKILL.md`, has the persona read them there, and lists the split as out of scope; superseded for those clauses |
| Persona copies can lag the skill | `doc/install-internals.md:11-12,23` | held: user install symlinks, project install copies at `postinstall`; an upgrade refreshes both |
| Claude Code surface | `rg writing-plans .claude-plugin/marketplace.json` | held: not listed |
| `CHANGELOG.md` has `## Unreleased` | `rg '^## ' CHANGELOG.md` | corrected: top heading is `## v8.7.1 - 2026-11-16` |
| Consumer run read 553 KB across 32 files | none available (private workspace thread) | not checked: the design rests on local byte counts |

### Implicit dependencies

- pi skill loading - pi `docs/skills.md:3,43` - found.
- Child dispatch and fresh context - `SKILL.md:58-70`, `agents/plan-writer.md:1-7` - found.
- Amend, prepare and apply call paths - `amendment-surface.md:51,156,172`, `implement-amendments.md:5-7`, `agents/plan-writer.md:29-50` - found.
- `plan_check` tool - `extensions/phase-tracker.ts:33,919-980`; it checks plan and spec data, never the Markdown reference - found.
- A new reference file ships in the npm package - `package.json` `files` lists `skills`; the packed tarball is not checkable until the file exists - not checkable: relies on the existing `npm pack` contents check in `scripts/ci.mjs`.
- Eval slice and bundle loader - `eval/README.md:58-68` - found.
- Original consumer transcript - private - not checkable.

## Acceptance criteria

Ticket #153, Acceptance Criteria, rows verbatim:

- [ ] With an approved spec in a worktree, running `/skill:writing-plans` until the plan phase completes: the main session's transcript contains no read result and no outgoing child prompt carrying the rules that today sit between `## File Structure` and the end of `## Self-Review (Before Handoff)` in `skills/writing-plans/SKILL.md`.
  in-scope
- [ ] In that same run, the plan-writer child reads all of those rules and the whole of `skills/writing-plans/reference/plan-contract.md` before it writes the plan, and `plan_check` passes on the plan it writes.
  in-scope
- [ ] The read instruction in `agents/plan-writer.md` names the file that carries those rules, and no instruction under `skills/` or `agents/` points at a `skills/writing-plans/SKILL.md` heading that no longer exists.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-153-writing-plans-partition
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: doc/personas.md
Rules: doc/configuration.md
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
scope: AC 1, AC 2, AC 3
design: owns `skills/writing-plans/`, `agents/plan-writer.md`, the four caller sentences under `skills/`, the retargeted pins under `scripts/`, `eval/writing-plans/`, `eval/README.md`, `doc/gate-contract.md` and `CHANGELOG.md`; the main session reads flow only, the child reads one contract file.

## Design

### Three files, one reader each

| File | Reader | Read when | Size after (limit 50,000 bytes, 500 lines) |
|---|---|---|---|
| `skills/writing-plans/SKILL.md` | main session | on `/skill:writing-plans` | about 11 KB |
| `skills/writing-plans/reference/plan-contract.md` | `plan-writer` child | whole, at its procedure step 2, in every mode that reads it today | about 40 KB, about 340 lines |
| `skills/writing-plans/reference/open-questions.md` | main session | at `## Author the plan` step 6, only when the human must be asked | about 3 KB |

`agents/plan-writer.md` stays about 11 KB. The main session never reads `plan-contract.md`; the child never reads `SKILL.md` or `open-questions.md`.

`SKILL.md` keeps, in order: frontmatter, the related-skills note, `## Overview`, `## Boundaries`, `## Scope Check`, `## Author the plan` (steps 1-7), `## Execution Handoff`, `## Red Flags — STOP` (two rows), `## Project overrides`.

`## Overview` keeps flow only: its first sentence (`Translate an approved spec into bite-sized, ordered, TDD-shaped tasks.`) as the summary, the announce line, the `phase_tracker` paragraph, `**Input:**`, `**Save plans to:**` with its table, and the no-spec paragraph. Its second sentence (`Assume the engineer is skilled ... test design.`, `SKILL.md:12`) is plan-authoring guidance with no counterpart in the contract: it moves to the contract's Intro. Its line `DRY. YAGNI. TDD. Frequent commits.` (`SKILL.md:14`) is on the Dropped list.

`plan-contract.md` sections, in order. Every existing contract heading keeps its level and its text byte for byte, so every existing anchor resolves. The file's `##` headings are flat siblings: a numbered item below is a reading-order group, never a container, and no existing heading is demoted under a new one.

1. Intro: the H1 `# Plan contract` and the contract's opening paragraph, plus one sentence naming the child as its only reader, then the `## Overview` sentence `Assume the engineer is skilled ... test design.`
2. `## File structure` - the span's `## File Structure`.
3. `## Legs (`leg-unknown`)` - merged pair 3.
4. `## Waves and tasks` - the span's `## Wave Grouping` and `## Bite-Sized Task Granularity`, then the contract's nesting and `Orchestrator:` bullets.
5. `## Files (`wave-file-disjointness`, `paths-exist`, `files-block`)` - contract section.
6. `## Plan header` - the span's `## Plan Document Header` template, then the contract's `## Header-only entrypoint (`header-entrypoint`)`, `## Happy path line (`header-happy-path`)` and `## PR-subject verification` (merged pairs 1 and 2).
7. `## Task structure` - the span's `## Task Structure`, then the contract's `## Spec anchors (`anchor-resolution`)` and `## Tests (`tests-block`)` with `### Implement-only historical evidence`.
8. `## Spec coverage table (`table-closure`, `waiver-literal`)` - the span's `## Spec Coverage Table` text, then the contract section.
9. `## Placeholders and quote integrity (`placeholder-scan`, `quote-integrity`)` - the span's `## No Placeholders` text, then the contract section.
10. `## Open Questions (`open-questions`)` - merged pair 4.
11. `## Self-review (before handoff)` - the span's `## Self-Review (Before Handoff)`.

Heading inventory of `plan-contract.md`, in file order. Headings inside fenced plan templates (`## Files`, `## Wave 1 — Foundations`, `### Task N: [Component Name]`, `## Spec coverage`) are template text and stay as written.

| Final heading | Source |
|---|---|
| `# Plan contract` | contract, kept |
| `## File structure` | span `## File Structure`, renamed |
| `## Legs (`leg-unknown`)` | contract, kept; takes the merged text of span `## Leg routing`, whose heading is removed |
| `## Waves and tasks` | contract, kept; takes the text of span `## Wave Grouping` and `## Bite-Sized Task Granularity`, whose headings are removed |
| `## Files (`wave-file-disjointness`, `paths-exist`, `files-block`)` | contract, kept |
| `## Plan header` | span `## Plan Document Header`, renamed |
| `## Header-only entrypoint (`header-entrypoint`)` | contract, kept |
| `## Happy path line (`header-happy-path`)` | contract, kept |
| `## PR-subject verification` | contract, kept |
| `## Task structure` | span `## Task Structure`, renamed |
| `## Spec anchors (`anchor-resolution`)` | contract, kept |
| `## Tests (`tests-block`)` | contract, kept |
| `### Implement-only historical evidence` | contract, kept at `###` inside `## Tests` |
| `## Spec coverage table (`table-closure`, `waiver-literal`)` | contract, kept; takes the text of span `## Spec Coverage Table`, whose heading is removed |
| `## Placeholders and quote integrity (`placeholder-scan`, `quote-integrity`)` | contract, kept; takes the text of span `## No Placeholders`, whose heading is removed |
| `## Open Questions (`open-questions`)` | contract, kept |
| `## Self-review (before handoff)` | span `## Self-Review (Before Handoff)`, renamed |

The ten headings removed from `SKILL.md`, which the guard test forbids there as whole lines: `## File Structure`, `## Leg routing`, `## Wave Grouping`, `## Bite-Sized Task Granularity`, `## Plan Document Header`, `## Task Structure`, `## Spec Coverage Table`, `## No Placeholders`, `## Self-Review (Before Handoff)`, `## Remember`. Every test delimiter that slices on one of them takes the final heading from the inventory (Add, retargeted pins).

`open-questions.md` holds one section, `## Ask the human`: step 6's three first-line marker sentences (`Start the message with ... including a second verbatim `FAIL`.`, `Never append a colon to the marker.`, `Follow the [first-line rule](...)` with its link re-based and its closing colon as a period), the three-row row-handling table, the pause rule sentence (`On a pause retain phase `plan` as `in_progress` and its substep; no stamp or `plan_tracker` init.`), and the second-identical-FAIL presentation sentence (Data flow).

### Word-for-word rule

Every paragraph, list item, table row and fenced block of the span, the contract, and step 6's moved text appears exactly once in its new file, unchanged, except:

- the passages on the Dropped list, which are deleted;
- the pairs on the Merged list, whose final text is given under "Merged passages, final text";
- the step-6 sentences the Data flow table splits or re-hosts, and the `## Overview` sentence moved to the contract's Intro;
- prose punctuation in a line this change adds to `plan-contract.md` or `open-questions.md` (moved span, Overview or step-6 text, merged passages), which takes its ASCII form with no change of meaning: an em dash becomes ` - `, an en dash in a range becomes `-`. Fenced blocks, inline code spans (including the `## Wave N — <label>` header form) and the `❌` marks stay byte-identical;
- a relative link target, re-based to the new file's directory (`../using-git-worktrees/reference/pr-head.md` becomes `../../using-git-worktrees/reference/pr-head.md`; a link to `reference/plan-contract.md` from inside it becomes a same-file anchor);
- a reference to a moved heading or step, rewritten to the new location (`writing-plans` Self-Review becomes this file's `## Self-review (before handoff)`; `step 3` and `step 5` inside `open-questions.md` name `SKILL.md` `## Author the plan`).

Paired passages on neither list stay as written.

**Dropped** (each restates a rule whose owner stays; line numbers at `09c9f4e1`):

| Passage | Line | Rule stays in |
|---|---|---|
| Contract wave definition `A wave is a maximal set ...` | `plan-contract.md:7` | span `## Wave Grouping` opening paragraph |
| `**File-ownership contract.** See ...` stub | `SKILL.md:131` | contract `## Files` |
| Self-Review `**Test contract.**` bullet | `SKILL.md:345` | span `**Test contract.**` paragraph (`:133`) |
| Self-Review `**Waiver authorization.**` bullet | `SKILL.md:347` | span `**Requirement rows:**` (`:283`) |
| `**`Verification` owner:** only ...` stub | `SKILL.md:284` | contract `**`Verification` owner:**` |
| `Declare `Delete:` as write ownership ...` sentence | `SKILL.md:271` | contract `## Files` |
| `**Anchor rules.** See ...` paragraph | `SKILL.md:273` | contract `## Spec anchors` |
| `Quote integrity and the banned-token list: ...` stub | `SKILL.md:299` | contract `## Placeholders and quote integrity` |
| `## Remember` section | `SKILL.md:353-362` | none: no plan author reads it today |
| Six plan-quality `## Red Flags` rows | `SKILL.md:377-382` | none: no plan author reads them today |
| `The sections from `## File Structure` through `## Self-Review` are the plan contract ...` sentence | `SKILL.md:88` | replaced by the Add sentence naming the contract as child-only |
| `## Overview` line `DRY. YAGNI. TDD. Frequent commits.` | `SKILL.md:14` | none: no plan author reads it today; it copies the `## Remember` line `DRY, YAGNI, TDD, frequent commits`, deleted above |

**Merged** (the surviving text is the named sentences, each once):

| Pair | Survives |
|---|---|
| 1. Span header-entrypoint paragraph (`SKILL.md:191`) with contract `## Header-only entrypoint` and `## Happy path line` | Both contract sections whole. From the span paragraph: the sentence `Execution runs it in the worktree via the subshell form ... dispatch `cwd` is the worktree path.` joins `## Header-only entrypoint`; the clause `present only when File Structure selected a row, with the row label, the row's command in backticks, and the row's `Timeout` as `(~<duration>)` (omit the suffix when the cell is absent or malformed)` joins `## Happy path line`. The paragraph's other sentences are deleted. |
| 2. Span `**PR-subject header.**` (`SKILL.md:189`) with contract `## PR-subject verification` | The contract section whole, plus the span sentence `Keep the original spelling; resolve duplication by separating the task tests from header lint/format, not by disguising commands.` The paragraph's other sentences are deleted. |
| 3. Span `## Leg routing` (`SKILL.md:115-121`) with contract `## Legs (`leg-unknown`)` | The contract's three paragraphs whole. From the span: `before recon` on the opening read sentence; `admit task ownership through `plan_check`, never from `design:` prose`; `retain missing-link evidence`; and the third paragraph (`Run Baseline independently in each owning checkout. ...`) whole. The span's other sentences are deleted. |
| 4. Self-Review Baseline step 4 row forms (`SKILL.md:332-338`) with contract `## Open Questions (`open-questions`)` | Step 4 keeps its procedure sentences (regenerate, preserve contract rows, placement, the `OPEN QUESTIONS <abs plan path>` reply) and names the contract section for the row forms. The contract section keeps its forms and gains the details only step 4 carries: `quoting the original Tests command`, the `<one-line result summary>` placeholder, the fenced output block under every failure row (derived or not) with `(or all output when shorter)`, and `Keep failure output verbatim`. The four form bullets in step 4 and the contract sentence `Baseline regenerates these rows; contract rows remain until answered.` are deleted. |

#### Merged passages, final text

These blocks are the text the implementer writes; contract paragraphs not shown stay unchanged. Prose punctuation is already in its ASCII form.

Pair 1, `## Header-only entrypoint (`header-entrypoint`)`, first paragraph (the second and third paragraphs stay):

````markdown
The `**Verification:**` line is the **only** place the full verification entrypoint may appear - never in any task or wave step. The verify phase reads it from the plan instead of re-deriving it; execution runs scoped commands only. Execution runs it in the worktree via the subshell form `(cd "<abs worktree path>" && <command>)`; the process cwd stays in the primary checkout, and dispatch `cwd` is the worktree path.
````

Pair 1, `## Happy path line (`header-happy-path`)`, whole section:

````markdown
Optional: present only when `## File structure` selected a row, with the row label, the row's command in backticks, and the row's `Timeout` as `(~<duration>)` (omit the suffix when the cell is absent or malformed). When present, the header line reads `**Happy path:** <label> - \`<command>\`` with an optional ` (~<duration>)` suffix, `<duration>` matching `\d+(s|m|h)`. A present line that does not parse is a finding; absence is never a finding. The label names the row of the overrides file's `## Happy path` table the plan selected; the verify phase reads the line from the plan and re-derives the row from the real diff.
````

Pair 2, `## PR-subject verification`, whole section:

````markdown
Detect this specialization only from `## Rework record` in the approved spec. Put only the overrides' documented lint and format commands in `**Verification:**`, or the literal `none - PR subject, scoped` when neither is documented. Treat the sentinel as no header command. Keep scoped tests in task `Tests:` blocks, never copy them into the header or change their spelling to evade `header-entrypoint` or `tests-block` rejection. Keep the original spelling; resolve duplication by separating the task tests from header lint/format, not by disguising commands. Retain baseline evidence and all existing checker grammar. At verify, run the union of every task's `Tests:` commands plus the header's lint/format commands; omit `none:` entries and the sentinel from executable commands. This policy specializes the command set, not freshness, conformance or phase gates. Without the record, keep the ordinary full verification entrypoint.
````

Pair 3, `## Legs (`leg-unknown`)`, whole section:

````markdown
Read the home spec's `## Legs` using [the leg contract](../../brainstorming/reference/legs.md) before recon. Write `Leg: <repo>` immediately after each task heading, before `**Files:**`; absence means home. Keep the plan and its `**Spec:**` header at home, citing the home spec. Repair a `leg-unknown` task in the plan, never by adding spec membership.

Write one `Baseline <repo>: <sha>` header per member. Match each task's baseline bullets to its own leg's SHA; require equality within a leg, not across legs. Resolve `Modify:`/`Create:`/`Test:`/`Delete:` paths and globs against the admitted leg checkout from [Locate a leg tree](../../brainstorming/reference/legs.md#locate-a-leg-tree), keeping home at the session's home worktree; admit task ownership through `plan_check`, never from `design:` prose. Stop plan writing on a failed lookup and report its reason; create no plan against a guessed checkout. Key file overlap and cross-task created anchors on `(leg, path)`.

Split mixed waves into consecutive leg-homogeneous waves, preserving dependencies. Re-walk each task's `Files:` under its leg using the leg contract's Gather rules procedure. Append task `Rules:` for files missing from the spec list; resolve `Rules: root only - paths unresolved`; retain missing-link evidence. Read the combined lists before execution and review.

Run Baseline independently in each owning checkout. Apply every provenance, dirty-tree, tree-equivalence, created-anchor, selector, contamination, artifact and blocked-command rule below within that repo. Qualify provenance notes, dirty/global/Open Questions and blocked evidence by repo; compare and retain SHAs only within the same leg. Write one `Baseline <repo>: <sha>` per member and execute each task's `Tests:` at that leg's root. Preserve all evidence rules and keep full verification for verify.
````

Pair 4, `## Self-review (before handoff)`, Baseline step 4:

````markdown
4. Regenerate every baseline-form Open Questions row from this pass's collection; resolved rows disappear and `blocked:` lines are recomputed. Preserve unresolved contract rows until Findings answers them. Put `## Open Questions` at the top when any rows remain; omit it otherwise. Use the exact row forms in [Open Questions](#open-questions-open-questions).

   With substantive rows remaining reply `OPEN QUESTIONS <abs plan path>` immediately; do not spend repair rounds on them.
````

Pair 4, `## Open Questions (`open-questions`)`, second and third paragraphs (the first paragraph stays):

````markdown
Baseline failure: `- Task N: `<command>` fails on <sha> (exit <n>): <one-line result summary>`, quoting the original Tests command. Derived runs add an indented `ran: `<base command>`` continuation. Under every failure row, below the `ran:` line when one is present, add a fenced block containing the last 20 output lines (or all output when shorter). Contamination: `- Task N: `<command>` dirtied tracked source on <sha>: <paths>` or `- Task N: `<command>` moved HEAD to <sha>`. Global rows: `- Baseline: worktree dirty on <sha>: <paths>` and `- Baseline: in-flight source edits on <sha>: <paths>`. Add indented `blocked: Task M `<command>`` continuations for every command each contamination/global row blocked.

Keep failure output verbatim. Only fenced output continuing a well-formed row is exempt from `placeholder-scan` (verbatim tails can contain `TODO` or `etc.`). Row first lines, `ran:`/`blocked:` and authored task prose remain scanned.
````

The Deterministic checker bullet's closing link (`SKILL.md:341`) becomes `Findings are defined in [this contract](#plan-contract).`, the anchor of the retained H1 `# Plan contract`.

### Data flow

The dispatch task carries four absolute paths: worktree, spec, plan, plan contract. The child's procedure step 2 reads the whole plan contract.

Step 6 keeps its opener and its four reply branches. Each instruction has one owner:

| Step-6 part | Stays in `SKILL.md` | Moves to `open-questions.md` |
|---|---|---|
| Opener | `Branch on the pair (child reply, parent check).` | the three first-line marker sentences |
| `PLAN WRITTEN` + `PASS` | the whole line (`-> step 7`) | nothing |
| `OPEN QUESTIONS` + any result | `read the section; absent or exactly `- none` takes the `PLAN WRITTEN` branch`; for substantive rows the pointer, which replaces `For substantive rows, use the table below.` | the row-handling table and the pause rule sentence |
| `PLAN WRITTEN` + `FAIL` | the first-FAIL re-dispatch sentence (`re-dispatch per step 3 with the verbatim `FAIL (...)` output as the `Findings:` block, then step 5.`) and the routing condition `Once per verbatim FAIL output: the same FAIL a second time goes to the user as an open question`, followed by the pointer | the presentation words `(the FAIL lines, verbatim), as an exhausted finding does`, hosted as `For a second identical FAIL, present the FAIL lines, verbatim, as an exhausted finding does.` |
| No child reply | the whole line, including `a `FAIL` re-dispatch overwrites the restored plan with a repaired one` | nothing: a restored plan with substantive Open Questions rows takes the `OPEN QUESTIONS` branch and reaches its pointer |

Each of the two pointers says to read `reference/open-questions.md` now, before asking, and to stop with a blocking error when it is unreadable.

### Remove

- From `skills/writing-plans/SKILL.md`: `## File Structure` through `## Self-Review (Before Handoff)`; `## Remember`; the six plan-quality `## Red Flags — STOP` rows; `## Overview`'s second sentence (`:12`) and its `DRY. YAGNI. TDD. Frequent commits.` line (`:14`); step 6's three first-line marker sentences, the `OPEN QUESTIONS` row table, the pause rule sentence, the sentence `For substantive rows, use the table below.` and the presentation words `(the FAIL lines, verbatim), as an exhausted finding does`; the sentence at `:88`; `Plan skill:` in the task template; `this `SKILL.md`` as a resolved path in step 2; the count `five` in steps 2 and 3; `Self-Review` in the `## Boundaries` bullet (`:38`), which names the parent `plan_check` instead.
- From `agents/plan-writer.md` (body only, frontmatter byte-identical): the plan-skill path and every sentence naming the plan skill, the skill's Self-Review, or a `SKILL.md` heading (lines 24, 39, 46, 49, 50); the count in `Keep the five-path inputs.` (line 31).
- The plan-skill path from the path lists in `skills/brainstorming/reference/amendment-surface.md` (2 sentences), `skills/subagent-driven-development/reference/implement-amendments.md` (1) and `skills/gauntlet-resume/reference/brief-contract.md` (1).
- From `eval/writing-plans/target.json`: the four `SKILL.md` slices.
- From the five child-side samples: `Plan skill: ...` in the case text of `maintenance-after-delete` and `removal-lists-delete`; the `bundle+: skills/writing-plans/SKILL.md` line of `leg-checkout-by-branch`, `pr-subject-sync-repair` and `pr-subject-threads`.

### Add

- The regrouped, deduplicated sections in `plan-contract.md` as listed above.
- `skills/writing-plans/reference/open-questions.md` with `## Ask the human`, linking `../../brainstorming/reference/menu-layout.md`.
- In `SKILL.md`: the four-path wording in steps 2 and 3 and the task template; two `read `reference/open-questions.md` now` pointers in step 6, each with its unreadable-stop; one sentence stating that `reference/plan-contract.md` is the plan contract, read and executed by `plan-writer` and never by the main loop.
- In `agents/plan-writer.md`: `four absolute paths`; `Keep the four-path inputs.` for both implement-only amendment modes (line 31); procedure step 2 reads the plan contract in full; Baseline and repair sentences name the contract's Self-review.
- `four absolute paths` (with the four names) in the three caller files; `brief-contract.md:230-231` cites `writing-plans/reference/open-questions.md` for the three options and the restore path.
- Retargeted pins:
  - `scripts/ci.mjs:237,238,314,315` name `skills/writing-plans/reference/plan-contract.md`.
  - `scripts/brainstorming-contract.test.mjs:170-171` and `:919-930` read the contract (the `pr-head.md` marker takes its re-based form); `:175-177` reads `open-questions.md` whole for its menu markers, without the `6. Branch` to `7. Clear` slice, which no longer bounds them; the two unreadable-stop pointers are asserted separately on `SKILL.md` step 6 (`6. Branch` to `7. Clear`); the `same grant-aware step-6 path` assertion at `:179` stays.
  - `scripts/implement-amendment.test.mjs:28` pins `four absolute paths`; `:59` drops `SKILL.md` from its list.
  - `scripts/wave-review.test.mjs:64-84` asserts the leg tokens and the `Delete:` ownership tokens (`write ownership`, `literal path`, `no existence requirement`, owned by `## Files` after the Dropped `Delete:` sentence) on the contract alone; the task-template slice runs from `## Task structure` to `## Spec anchors (` and keeps the `- Delete: `exact/path/to/removed.py`` line assertion. Line 85 asserts `skills/subagent-driven-development/SKILL.md` and stays untouched.
  - `scripts/commit-message-contract.test.mjs` adds the contract to `sites` and takes the slice from `**Step 6: Commit**` to `## Spec anchors (` from it.
- A lasting guard test in `scripts/brainstorming-contract.test.mjs` (Tests).
- `doc/gate-contract.md`: the three `writing-plans/step-6-*` rows name `skills/writing-plans/reference/open-questions.md`, site `## Ask the human`. Gate ids stay.
- `eval/writing-plans/target.json`: one `SKILL.md` slice `## Boundaries` to `## Red Flags`, the whole `plan-contract.md`, `reference/open-questions.md` with `"new": true`, the unchanged `commit-message.md` entry.
- `eval/README.md` "Declaring drops": one clause recording the narrow exception to `the skill's `SKILL.md` is never dropped` - a sample that replays a child persona which never reads the skill's `SKILL.md` drops it.
- `eval/writing-plans/`: the `child-reads-one-contract` sample, a rewritten `intent.md`, the README slice and sample tables, the committed `report.md` and results of the runs below.
- `CHANGELOG.md`: a `## Unreleased` heading with one Changed entry, `(#153)`.
- The supersession banner in `doc/specs/2026-10-18-gh-69-fresh-planner-child.md`.

### Authoring rules

Every added or changed line in `SKILL.md`, both reference files and the three caller files follows `/skill:forge-skill` `## Authoring rules`. The persona edit follows its `## Persona rules`: body only, and the path-count marker changes together with its callers and its pin. The four caller sentences that change the path count are corrected-path wording, exempt from eval samples in their own targets under `AGENTS.md` "Change process".

### Reading of the ticket rows

- Row 1 and row 2 name "the rules that today sit between" the two headings. Those rules are every rule of the span, each stated once after deduplication; the Dropped and Merged lists remove restatements, never a rule.
- Row 2's `skills/writing-plans/reference/plan-contract.md` keeps its path; after the change it carries those rules too, so one read satisfies both halves of the row.
- Rows 1 and 2 describe one plan-phase run. The eval target is a text replay, so the run is observed in two parts: parent-side replays show the dispatch and reads the main session makes; child-side replays show the child's read and the plan it writes. A narrated read is replay evidence of the instructed read order, not proof that a tool call ran. The guard test proves the file contents that make the transcript claim hold by construction: `SKILL.md` carries none of the rules and the task template carries paths only.

### Paid action: model eval

The main session runs `node eval/run.mjs writing-plans <sample>` from the worktree for each sample below, with `node eval/run.mjs writing-plans <sample> --baseline-only` first for a sample whose `bundle` lines change. Approving this spec authorizes these runs for the whole flow across seed, rows, repairs and finish, without per-step permission prompts; no count applies. Evidence is sample-scoped; no target-wide pass is claimed.

| Sample | Input change | Must hold |
|---|---|---|
| `child-reads-one-contract` (new) | `bundle+: agents/plan-writer.md`, `bundle-: skills/writing-plans/SKILL.md` (the recorded exception to the eval guide's no-drop rule); a four-path task; the case text overrides the generic replay endpoint, as `leg-checkout-by-branch` does: narrate each read call with its path before writing, then show the single-task plan fragment and the final reply line | `reads-contract`: the narration reads the plan contract at the task's path in full before the plan fragment. `no-skill-read`: the narration names no read of a `SKILL.md`. `four-paths`: proceeds on four paths and asks for no fifth. |
| `fresh-child-authors-plan` | none | f1-f6, plus `four-paths`: the task names the worktree, spec, plan and plan-contract paths and no skill path; `no-reference-read`: no read of `plan-contract.md` or `open-questions.md`. |
| `parent-offers-fix-first-narrow-amend` | none | failure, menu, pause, plus `reads-open-questions`: the narration reads `reference/open-questions.md` before the menu (its case asks for narrated handling). |
| `gate-line-first` | none | first-line, failure, menu, pause: its current facts only. Its case forbids narration and pins the first line, so it carries no read fact. |
| `baseline-fails-on-base` | none | original-command, failure-row, no-evidence-fiction, reply (merged pair 4). |
| `removal-lists-delete` | case text | delete-owner, no-modify, checker-shape, scoped-check (dropped `Delete:` copy). |
| `maintenance-after-delete` | case text | its current facts. |
| `leg-checkout-by-branch` | bundle line | baseline, branch-lookup, home-plan, missing, path-roots, recorded-home (merged pair 3). |
| `pr-subject-threads` | bundle line | merge-first, thread-tasks, nonfix, header-style-only, verify-union, sentinel, ordinary-gates (merged pair 2). |
| `pr-subject-sync-repair` | bundle line | its current facts. |

## Errors and edge cases

- `reference/open-questions.md` unreadable at step 6: stop with a blocking error; never rebuild the menu from memory.
- A restored plan with substantive Open Questions rows and no child reply reads `open-questions.md` through the same pointer.
- The second identical parent FAIL reads `open-questions.md` before asking, because the first-line marker sentence lives there.
- Amendment and resume callers send four paths; every `Amend:`, `Amend-prepare:` and `Amend-apply:` rule the child needs stays inside `plan-contract.md`.
- `amendment-surface.md:181,183` keep their step-6 citations (`render the writing-plans step-6 branch in full`, `use the same grant-aware step-6 path`, `handing dirty paths to step 6`) as written. They are two-hop references: step 6 routes through its mandatory `open-questions.md` pointer, so the caller duplicates no presentation text.
- The headings `## Legs (`leg-unknown`)`, `## Files (...)`, `## PR-subject verification` and `### Implement-only historical evidence` keep their text, so `doc/implement-engines.md:70` and every in-file anchor resolve.
- An old persona beside a new skill gets no compatibility path: both ship in one package and install refreshes the persona copy.
- `leg-checkout-by-branch` results are re-committed with the same six fact ids, all `holds`, because `scripts/wave-review.test.mjs:72-78` reads them.
- `removal-lists-delete` results are re-committed in the shape `extensions/lib/plan-check.test.ts:253-277` reads: exactly two outputs with `status: ok`, each recorded plan passing `checkPlan` with zero findings and parsing to exactly `delete src/legacy.ts` and `test tests/retirement.test.mjs`, and exactly four facts, all `holds`.
- No new size check: `scripts/skill-size-lint.mjs` (every `skills/**/*.md` and `agents/*.md` under 50,000 bytes and 2,000 lines) covers all three files.

## Tests

- The main session's skill file carries none of the span's rules and sends a paths-only, four-path task (row 1) - `scripts/brainstorming-contract.test.mjs`, new test `writing-plans keeps flow in the skill and child rules in the plan contract`: `SKILL.md` has none of the ten removed headings (Design, heading inventory), no `Plan skill`, and a task template naming exactly worktree, spec, plan path and plan contract.
- The main session reads neither reference on a clean run (row 1) - sample `fresh-child-authors-plan`, facts `four-paths`, `no-reference-read`.
- The child reads the whole plan contract and no skill file before writing (row 2) - sample `child-reads-one-contract`: narrated replay evidence of the read order, not proof of a tool call.
- `plan_check` passes on the child's plan (row 2) - `extensions/lib/plan-check.test.ts`, existing test `removal-only plan declares one Delete owner and passes checkPlan` (run by `scripts/ci.mjs`): `checkPlan` returns zero findings on both recorded model-written plans of `removal-lists-delete`. It validates recorded plans; it runs no live child and observes no read. The other child-side samples add sample-scoped replay evidence.
- The persona names the file carrying the rules (row 3) - the new guard test: `agents/plan-writer.md` names the plan contract read and contains no `SKILL.md`.
- No instruction under `skills/` or `agents/` cites a missing writing-plans heading or step (row 3) - the new guard test: every relative link and anchor in the three writing-plans files resolves, every `plan-contract.md#` anchor cited under `skills/`, `agents/` and `doc/` resolves, and no file under `skills/` or `agents/` cites a removed `SKILL.md` heading.
- Every old paragraph is present word for word or on the Dropped or Merged list - none committed: a committed test needs a 45 KB copy of the old text; the main session runs a one-time paragraph comparison of the merge base against the three files at verify. The comparison's exceptions are the Word-for-word rule's: the Dropped passages, the merged passages compared against "Merged passages, final text", the step-6 sentences the Data flow table splits or re-hosts, the moved `## Overview` sentence, re-based links and rewritten heading references, and ASCII prose punctuation.
- Open-questions file unreadable stops - `scripts/brainstorming-contract.test.mjs`, the retargeted step-6 test asserts on the `SKILL.md` step-6 slice that both pointers carry the unreadable-stop.
- Restored plan and second identical FAIL read the file - no replay covers these two branches: `parent-offers-fix-first-narrow-amend` (fact `reads-open-questions`) starts from a real `OPEN QUESTIONS` child reply and covers only the ordinary questions branch. The guard test asserts on step 6 that the no-child-reply line routes a plan with substantive Open Questions rows to the `OPEN QUESTIONS` branch, that this branch carries the read pointer with its unreadable-stop, and that the `PLAN WRITTEN` + `FAIL` line carries the read-before-asking pointer with its unreadable-stop after the second-identical-FAIL routing condition.
- Four-path callers - `scripts/implement-amendment.test.mjs` marker `four absolute paths`; the guard test asserts no `five absolute paths`, `five-path` or `plan skill` under `skills/` or `agents/`.
- Kept anchors resolve - the guard test's anchor check.
- Old persona beside a new skill - none: no behavior is designed for it.
- `leg-checkout-by-branch` record shape - `scripts/wave-review.test.mjs` (existing assertion).
- `removal-lists-delete` record shape - `extensions/lib/plan-check.test.ts` (existing assertion).
- Sizes - existing instruction-size lint `scripts/skill-size-lint.mjs`.
- Gate rows resolve at the new file and site - `scripts/gate-contract-lint.test.mjs` and the lint run in `scripts/ci.mjs`.
- Moved pins hold at their owner - `scripts/ci.mjs`, `scripts/brainstorming-contract.test.mjs`, `scripts/wave-review.test.mjs`, `scripts/commit-message-contract.test.mjs`, `scripts/implement-amendment.test.mjs`.
- A new reference file ships - existing `npm pack` contents check in `scripts/ci.mjs`.

## Documentation impact

Materiality bar: `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: doc/gate-contract.md (communication contracts: the three `writing-plans/step-6-*` rows' rendering file and site); CHANGELOG.md (communication contracts: the plan-writer task carries four paths, `(#153)`); eval/README.md (major procedures / conventions: "Declaring drops" gains the child-persona exception to the never-drop-`SKILL.md` rule)
- Derived / memory docs invalidated: eval/writing-plans/README.md (slice table and sample table)

## Out of scope

- Per-run-type child files (implement-phase amendment rules, reworked-PR rules): they change what ticket row 2 promises; the implement-phase set is the first extraction if `plan-contract.md` nears 500 lines.
- Merging paired passages beyond the four listed pairs.
- Moving any `Remember` line into the child's rules.
- A live instrumented plan-phase run of the changed skill: it needs the worktree installed into a pi session.
- A numeric context or token target: the ticket sets none.
- Partition changes to any other skill.
- Rerunning eval samples whose inputs this change does not edit.

## Open questions

- none
