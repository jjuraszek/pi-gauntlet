# forge-skill: repo-routed procedure files and the no-history rule

**Ticket:** jjuraszek/pi-gauntlet#66
**Goal:** A consumer repo routes any instruction file to `/skill:forge-skill` through its always-on `AGENTS.md`, and forge-skill's authoring rules keep change history out of the lines an edit changes.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Extends:** `doc/specs/2026-09-30-forge-skill-rename-cc-exposure.md`, `doc/specs/2026-10-04-forge-skill-persona-authoring.md` (adds one description clause and one authoring bullet; supersedes nothing).

## Problem

A capability README used as an executable procedure accumulated a `## History` section of dated entries because the model editing it never loaded forge-skill and, once loaded, forge-skill had no rule against narrating a rule's past. Two gaps in `skills/forge-skill/SKILL.md`: the `description` (line 3) names only skills, reference files, personas, prompt templates, and slash commands, so a file outside those classes does not trigger the load even though the overview (line 10) claims "every file a model reads as instructions"; and `## Authoring rules` (lines 31-45) carries no rule about changelogs, dated entries, or "previously"/"as of" narration.

Framing: pivoted to routing through the consumer's `AGENTS.md`. The ticket proposes a `- procedures: <glob>` row under `## forge-skill` in the overrides file. That file is read inside the skill body after the skill loads (`SKILL.md:83`; pi's skills doc: "At startup, Pi scans configured skill locations and adds each skill's name, description, and path to the system prompt. It does not add the full instructions." - `@earendil-works/pi-coding-agent/docs/skills.md:43`, shipped under the pi install at `~/.pi/agent/install/releases/<version>/node_modules/`), so a row there can govern an edit but never trigger the load that AC 5 asks for. The surface that reaches the model before an edit is the consumer's `AGENTS.md`, which this repo already uses for the same purpose (`AGENTS.md:107`) and which `../customer-ops/AGENTS.md:44-47` already uses for `projects/<name>/README.md`. No option is zero-config or autodiscovery: a consumer writes one `AGENTS.md` bullet; pi-gauntlet adds no key, reader, or lint.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#66, "Acceptance Criteria", rows verbatim:

- [ ] `skills/forge-skill/SKILL.md`: the frontmatter `description` names files a repo declares as procedures; `## Project overrides` states the declaration in one sentence - `## forge-skill` section, one `- procedures: <glob>` row per glob, repo-root relative, `**` allowed - with one example row; `README.md` "Project-specific overrides" documents the `procedures` key with reader `forge-skill` and default "none"; `node scripts/ci.mjs` passes.
  deviates: the overrides file is read only after the skill loads, so a `procedures` key cannot trigger the load AC 5 requires; the declaration surface is the consumer's `AGENTS.md` bullet. The description clause, the README front-door sentence, and the passing `node scripts/ci.mjs` ship as Design clauses.
- [ ] `## Authoring rules` carries one rule that keeps a changelog, a dated entry, "previously"/"as of", and narration of a rule's past out of added or changed lines, names where that content goes (commit body, ticket, spec), keeps a one-clause operational reason, and carries one example.
  in-scope
- [ ] The repo-specific bullet in `AGENTS.md` ("Skill, persona, and prompt edits follow `/skill:forge-skill`") also names repo-declared procedure files.
  in-scope - reading: the bullet at `AGENTS.md:107` gains one category, this repo's own instruction file `.pi/gauntlet-overrides.md` (a file skills read as instructions); the shared core bullet at `AGENTS.md:80` stays untouched.
- [ ] New sample `eval/forge-skill/samples/<name>`: the fixture is an overrides file with a `- procedures:` row plus a README matched by it that holds a `## History` section with three dated bullets, one stating a current rule, plus an unmatched ordinary `NOTES.md`; `case.md` asks for a rule change in the README; `expected.md` judged facts: the history section is gone, the rule the dated bullet carried sits in the section owning its topic, no added line carries a date or narration of the rule's past, `NOTES.md` is untouched. `node eval/run.mjs forge-skill <name>` reports every fact holding.
  deviates: the fixture's declaration is an `AGENTS.md` routing bullet, not an overrides row. The README with its `## History` section, the unmatched `NOTES.md`, the case, every judged fact, and the passing run ship as Design clauses.
- [ ] In a scratch repo with that overrides declaration, an ordinary edit request naming the matched README loads `forge-skill` before the edit, and the same request naming `NOTES.md` does not; the two transcripts are attached to the PR.
  deviates: "that overrides declaration" is the `AGENTS.md` routing bullet. The scratch repo, the matched/unmatched pair, and the two transcripts in the PR body ship as Design clauses; the pair runs pi-only in the verify phase.
- [ ] `CHANGELOG.md` carries the entry under its not-yet-released heading, naming repo-declared procedure files and the no-record rule; no version is cut by this ticket.
  in-scope - reading: `CHANGELOG.md` has no `## Unreleased` heading at HEAD (top heading `## v7.14.0`); the change adds one.

## Design

### Routing

A consumer repo routes a file to forge-skill with one bullet in its `AGENTS.md` that names the files and the invocation, for example `Edits to projects/*/README.md follow /skill:forge-skill`. That bullet is always in context, so the model loads the skill before the edit. In Claude Code the always-on file is `CLAUDE.md` (README.md:232: it reads `CLAUDE.md` unless it is a symlink to `AGENTS.md`). This repo's own `AGENTS.md:107` is the reference shape. The overrides file plays no part; its `## <skill-name>` row and forge-skill's `## Project overrides` block stay unchanged.

### `skills/forge-skill/SKILL.md` - three sentence-level edits

1. `description` (line 3): the file-type list gains one clause at its end - `..., a slash command, or a file the repo's AGENTS.md or CLAUDE.md routes here, in pi or Claude Code - ...`. The rest of the description is byte-identical.
2. `## Authoring rules` gains one bullet directly after "Minimal diff":

   > No history. An instruction file states current rules only: an added or changed line carries no date, no "previously"/"formerly"/"as of" clause, and no narration of a rule's past - that goes to the commit body, the ticket, or the spec; a one-clause operational reason stays, and a date that is itself a rule (a freeze window) stays. The one exception to Minimal diff and to "Leave other lines alone": an edit that changes a rule inside a changelog, a dated-entry list, or a "previously" section moves that section's surviving rules into the section that owns their topic and deletes the history section in the same edit; a history section the edit does not touch stays. Example: `2025-03-02: builds now use the release profile because debug ran out of memory` under `## History` becomes `Build with the release profile (debug runs out of memory)` under `## Deploy`, and `## History` is deleted.

   The bullet names its own trigger: the changed rule sits inside the history section ("Leave other lines alone" is line 33; Minimal diff is line 37). Nothing else in the file is cleaned. A dated bullet holding a rule plus narration folds only the rule; the narration leaves with the section.
3. `## Edit procedure` step 2 (line 62) gains one clause: `Locate and edit the sentence that owns the rule you are changing (see Minimal diff; under No history, the history section it sits in).`

The overview sentence (line 10), the `Skills only:` bullets, the 500-line extraction rule, `## Persona rules`, `## Test`, and `## Project overrides` are untouched. A routed file is bound by the `## Authoring rules` bullets without a `Skills only:` marker, exactly as a persona is (line 49); the description clause adds a file class, not a new rule set.

### `README.md` - two sentences

1. "Project-specific overrides": append one sentence to the intro paragraph (line 293), after "a lower-priority file cannot supplement the selected file": a repo declares procedure files for forge-skill in its `AGENTS.md` (Claude Code: `CLAUDE.md`), not here, because the overrides file is read only after a skill loads - example `Edits to projects/*/README.md follow /skill:forge-skill`. No new table row; no `procedures` key.
2. The Claude Code blurb (lines 181-182) "the authoring skill for skills, personas, prompt templates, and slash commands" gains the category: "..., slash commands, and files the repo routes to it".

### `AGENTS.md` (this repo)

The Package rules bullet at line 107 gains one category: `**Skill, persona, prompt, and `.pi/gauntlet-overrides.md` edits** follow /skill:forge-skill ...` - the overrides file is the instruction file this repo owns beyond skills, personas, and prompts. The shared core bullet (line 80, `AGENTS.core.md`) is untouched.

### `eval/forge-skill/`

- `intent.md`: replace the template stub with the skill's purpose (every file a model reads as instructions states current rules in imperative voice, minimal diff) and the fact this change adds (a changed rule inside a history section is moved to its topic section and the history section deleted; an untouched history section stays). Bind `for:` per `eval/README.md` "Intent", and list under `## Expected to move` the three `history-section-cleanup` facts that flip `fails -> holds` on the candidate arm (no `## History` heading remains; the rule sits in `## Deploy`; no added line carries a date - the baseline edits the dated bullet in place), reason: the no-history rule folds the section.
- Two new samples, `kind: edit` under the existing `target.json`, sharing one fixture shape:
  - `fixture/AGENTS.md`: one bullet `Edits to doc/runbook.md follow /skill:forge-skill`.
  - `fixture/doc/runbook.md`: `## Deploy` holds the build and deploy steps and names no build profile; `## History` holds three dated bullets - one carries the sole current profile rule ("2025-03-02: builds now use the `release` profile because `debug` ran out of memory"), the other two are narration with no surviving rule ("2025-01-10: moved the runbook here from the wiki", "2024-11-03: first draft").
  - `fixture/NOTES.md`: ordinary notes, no rules.
  - `samples/history-section-cleanup/`: `case.md` asks to change the build profile (`release` -> `prod`). Judged facts: the profile rule appears in `## Deploy` with the new value; no `## History` heading remains; no added line carries a date or a narration of the rule's past; every section other than `## Deploy` and `## History` is byte-identical to the fixture; `NOTES.md` and `AGENTS.md` are byte-identical to the fixture.
  - `samples/untouched-history-stays/`: `case.md` asks to change a deploy step inside `## Deploy` (a command flag). Judged facts: the step is changed in `## Deploy`; `## History` is byte-identical to the fixture; no added line carries a date or a narration; `NOTES.md` and `AGENTS.md` are byte-identical.
- Fixture text is synthetic (eval hygiene scan).
- `node eval/run.mjs forge-skill <sample>` while iterating; `node eval/run.mjs forge-skill` once before finish; `report.md` committed.

### `CHANGELOG.md`

Add `## Unreleased` above `## v7.14.0` with one entry: forge-skill's description covers files a repo's `AGENTS.md` or `CLAUDE.md` routes to it, and `## Authoring rules` gains the no-history rule (#66).

### Data flow at edit time

`AGENTS.md` bullet -> model loads `/skill:forge-skill` -> authoring rules bind the changed lines -> when the changed rule sits in a history section, the section's rules are folded into their topic sections and the section deleted -> edit procedure step 3 reads the changed lines back.

## Errors and edge cases

- No runtime errors: there is no reader, parser, or key. The failure mode is the model not honoring the `AGENTS.md` bullet; the verify-phase transcript pair is the only evidence for it (the eval replay invokes the skill explicitly - `eval/run.mjs:32` - and cannot test discovery).
- A history section the edit does not touch stays byte-identical (`untouched-history-stays` sample).
- A repo with no routing bullet sees no behavior change; the description clause says "routes here".
- A date that is a rule is not a trigger (the bullet says so).

## Tests

- `node eval/run.mjs forge-skill history-section-cleanup`: every judged fact holds.
- `node eval/run.mjs forge-skill`: full target before finish; `report.md` committed.
- `npm test` (`scripts/ci.mjs`): skill lint, eval structural lint against `eval/_template`, eval hygiene scan, model-literal lint, AGENTS core block unchanged.
- Transcript pair (AC 5), the plan's last task after the docs land, read by the verify-phase conformance check: in a scratch repo (temp dir, `git init`) holding the fixture's `AGENTS.md`, `doc/runbook.md`, and `NOTES.md`, two one-shot pi sessions with the scratch repo as cwd, `pi --print --mode json --no-skills --skill <worktree>/skills/forge-skill "<request>"` (`docs/cli.md:41-47`, `:200-203`: `--no-skills` drops the installed pi-gauntlet copy, `--skill` loads the worktree's forge-skill so only its name and description sit in the system prompt), each with an ordinary edit request ("change the build profile in doc/runbook.md to prod" / "add a line to NOTES.md"). The JSONL event stream is the transcript. "Loaded" is a `read` tool call whose path ends in `forge-skill/SKILL.md` before the first `edit` or `write` on the named file; the runbook transcript shows it, the NOTES transcript shows no such read. Both transcripts, reduced to their tool-call lines, go into the PR body at the finish step that opens the PR (a local squash-merge carries them in the ship report instead); the pair itself runs as the plan's last task, before that step. pi only; no Claude Code run.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` "Project-specific overrides" - one sentence that procedure files are declared in the consumer's `AGENTS.md` and why not here (major procedures / conventions; non-obvious rationale); `CHANGELOG.md` - `## Unreleased` entry
- Derived / memory docs invalidated: `README.md` Claude Code blurb (lines 181-182) - names forge-skill's file classes and omits the new one; `AGENTS.md:107` Package rules bullet - gains the `.pi/gauntlet-overrides.md` category; `eval/forge-skill/README.md` sample-count sentence - 10 -> 12 samples, naming history-section handling in routed files; `doc/configuration.md` names no `## forge-skill` key, so nothing there drifts

Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- A `procedures` key, glob grammar, or any overrides-file reader for forge-skill.
- A lint or validator that fails CI on history sections.
- Edits to `AGENTS.core.md` or the sibling repos; migration notes for `../gridstrong/` and `../customer-ops/` are printed in chat at ship, never written by this flow.
- Cleaning history sections the edit does not touch; special handling for a file made only of dated entries.
- A Claude Code transcript pair.
- A version cut.

## Open questions

none
