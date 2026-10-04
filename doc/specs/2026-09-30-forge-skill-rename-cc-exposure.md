# forge-skill: rename writing-skills, rewrite the body, expose to Claude Code

> **Superseded by:** [doc/specs/2026-10-04-forge-skill-persona-authoring.md](./2026-10-04-forge-skill-persona-authoring.md) - `### SKILL.md contract` body only (gains `## Persona rules`, skill-only markers, persona reload step)

**Goal:** Replace `skills/writing-skills/` with `skills/forge-skill/` - a single rules-first `SKILL.md` of at most 120 lines that serves pi and Claude Code authors alike - expose it in the Claude Code marketplace, and rename every live reference across pi-gauntlet, its three siblings, and gridstrong.

## Problem

`skills/writing-skills/SKILL.md` is 441 lines whose spine is mandatory TDD-for-documentation (baseline scenario, Iron Law, rationalization tables). It breaks the four `## Authoring rules` it declares: hedged instructions ("consider an `extensions/*.ts` hook", "Labels should carry semantic meaning"), an experiment narrative at lines 149-150, the rationalization table twice (255-265, 332-340), Red Flags three times, non-ASCII arrows and dashes throughout, and a test procedure that prescribes pi's `subagent` and `plan_tracker` with no Claude Code path. Its three `reference/` files (1130 + 187 + 384 lines) are a copy of a public Anthropic guide, research rationale, and pressure-scenario recipes - educational material, not rules.

The skill is not in `.claude-plugin/marketplace.json`, so Claude Code users of the gauntlet plugin get no authoring rules. Its name collides with superpowers' `writing-skills`, which shares the TDD-mandatory shape; CC namespaces plugin skills (`superpowers:writing-skills` vs `gauntlet:forge-skill`), so the collision is one of purpose, not registration.

Live references bind the old name: `AGENTS.core.md:73` (shared core block v7, copied into pi-quiver, pi-cohort, pi-condense), `AGENTS.md:78,105`, `README.md:72,116`, `scripts/model-literal-lint.mjs:9` and its test, gridstrong `doc/skills-and-prompts.md:105`.

## Acceptance criteria

none - no ticket

## Design

### Skill directory

`git mv skills/writing-skills skills/forge-skill`; delete `reference/anthropic-best-practices.md`, `reference/persuasion.md`, `reference/testing-skills-with-subagents.md`. The directory holds `SKILL.md` only.

### SKILL.md contract

Frontmatter:

```yaml
---
name: forge-skill
description: Use when creating or editing a SKILL.md, a skill's reference file, an agent persona, a prompt template, or a slash command in pi or Claude Code - including one-line edits - or when such a file exceeds 500 lines, gains if/else branching, or drifts from imperative voice; the authoring skill for repos that follow gauntlet's conventions.
---
```

No `disable-model-invocation`; the skill is model-invocable in both harnesses (same as `linear`, the one CC-exposed skill without the flag).

Body sections, in order, at most 120 lines total:

| Section | Content |
|---|---|
| `## Overview` | Two sentences: what the skill governs (skills, personas, prompt templates, slash commands), and that every sentence below is a rule or a checkable fact. |
| `## Conventions` | One table, columns `Item / pi / Claude Code`: frontmatter on line 1; `name` == directory name, lowercase letters, digits, hyphens, <=64 chars; `description` <=1024 chars (CC listing truncates `description` + `when_to_use` at 1536); harness-only fields (`argument-hint`, `arguments`, `when_to_use`, `user-invocable` are CC-only and ignored by pi; `allowed-tools` is an Agent Skills spec field pi documents but does not enforce and Claude Code enforces; `disable-model-invocation` is shared); invocation `/skill:name` vs `/name` or `/plugin:name`; supporting files `reference/` (pi-gauntlet) vs `references/`, `scripts/`, `assets/` (CC); substitutions: the arguments token described in prose (backslash, dollar, ARGUMENTS) and the skill-directory variable named bare as `CLAUDE_SKILL_DIR` without a `${...}` expression (CC expands live tokens in skill bodies before the model reads them and strips the escaping backslash, so a literal example cannot survive rendering); locations `.pi/skills/`, `~/.pi/agent/skills/`, `.agents/skills/`, `~/.agents/skills/`, package `skills/` (pi), `.claude/skills/`, `~/.claude/skills/`, plugin `skills/` (CC); reload `/reload` (pi) vs new session or plugin reload (CC). Every row is re-verified during implement against pi's `docs/skills.md` (`@earendil-works/pi-coding-agent`) and Claude Code's current skills documentation (`code.claude.com/docs/en/skills`); a row that cannot be verified is dropped, never guessed. |
| `## Authoring rules` | One bulleted list, each rule one or two sentences: imperative voice; low conditionality (branch only on an observable runtime fact, two branches max, a third goes to a table or reference file); minimal diff (edit the owning sentence, never restate a rule elsewhere - link the owner); oversized file (over 500 lines: extract the touched concern or the largest self-contained `##` section to `reference/<topic>.md` in the same change, leave a one-line pointer); recipe over prohibition (a shape or quality problem gets a statement of what the output is, a discipline problem gets an explicit rule); no nuance clauses ("unless it matters", "when appropriate" reopen the decision); description is a trigger, never a workflow summary; one example, never three; skip what the model already knows; never `@`-force-load another file; ASCII punctuation; compact `|---|` tables; present tense. |
| `## Edit procedure` | Five numbered steps: 1 read the whole file; 2 locate and edit the sentence that owns the rule being changed (linking the minimal-diff rule); 3 read the changed lines back against `## Authoring rules`; 4 `wc -l`, extract when over 500; 5 pi: `/reload`; CC: start a new session. |
| `## Test (optional)` | About ten lines: pick one scenario the rule governs; dispatch two fresh workers in the same turn - the loaded worker's task is the scenario plus the full `SKILL.md` body, the baseline task is the scenario alone; compare; fold any excuse the baseline gives into the rule sentence it evades. Table with one row per harness: pi `subagent({ agent: "worker", context: "fresh", task })`, CC the harness's subagent dispatch tool. |
| `## Project overrides` | Standard block, verbatim from `skills/linear/SKILL.md` (the ASCII variant; twelve skills carry an em-dash variant that fails the ASCII rule). |

Excluded from the body: Red Flags, rationalization tables, Iron Law, CSO rationale, persuasion research, skill-type taxonomy, creation checklist, deployment checklist. The four existing authoring rules keep their wording where they already satisfy the rules themselves.

### Marketplace

Append `"./skills/forge-skill"` to `plugins[0].skills` in `.claude-plugin/marketplace.json`. Rewrite both `description` fields: top-level to `Selective Claude Code exposure of pi-gauntlet's harness-portable skills.`, plugin to name all six skills and drop "tracker-facing". `scripts/ci.mjs` marketplace assertions need no change (they validate each listed path exists with `name` + `description` frontmatter and that no `.md` reference inside the bundle dangles - the new bundle has none).

### Lint

`scripts/model-literal-lint.mjs:9`: `EXCLUDED_PREFIXES = []`. `scripts/model-literal-lint.test.mjs`: assert `[]`, delete the exclusion-path test case. `MODEL_LITERAL` does not match "Claude Code", so the body passes unexempted.

### Live references in pi-gauntlet

Rewrite `writing-skills` -> `forge-skill` in `AGENTS.core.md:73`; edit both `agents-core:begin`/`agents-core:end` marker lines in `AGENTS.md` (lines 5 and 84) from `v7` to `v8`, then run `node scripts/check-agents-core.mjs --fix` (the fixer preserves marker lines, so the bump is a manual edit). Rewrite `AGENTS.md:78,105`, `README.md:72,116` plus the Claude Code section (six exposed skills; one sentence that `gauntlet:forge-skill` coexists with superpowers' skill-authoring skill under CC plugin namespacing and carries gauntlet's conventions - the other plugin's skill name is never spelled, so the zero-match scan holds), every skill body that cross-references the skill (enumerate with `rg -l writing-skills skills/`), and every released `CHANGELOG.md` section (mechanical substitution). Add a `## Unreleased` CHANGELOG entry that names `forge-skill`, the CC exposure, and the reference-file removal without using the old token.

Files under any `doc/specs/` directory keep the old name.

### Sibling repos and gridstrong

One implement-phase task, run after the pi-gauntlet edits, for each of `~/repos/pi-quiver`, `~/repos/pi-cohort`, `~/repos/pi-condense`, `~/repos/gridstrong`:

1. `git -C <repo> status --porcelain` must be empty and `git -C <repo> checkout main && git -C <repo> pull --ff-only` must succeed; otherwise stop and report the porcelain output.
2. Repos carrying the `agents-core` marker: copy `AGENTS.core.md` from the worktree, edit both marker lines in `AGENTS.md` from `v7` to `v8`, run `node scripts/check-agents-core.mjs --fix`. Gridstrong: check for the marker first; when absent, skip this step.
3. Rewrite every remaining `writing-skills` outside `doc/specs/` directories (`rg -l writing-skills --glob '!**/doc/specs/**'`).
4. Inspect `git diff`; the expected diff is the core block, the two marker lines, and the rewritten lines - anything else is reported, not committed.
5. Commit `Rename writing-skills routing to forge-skill (agents-core v8)` and `git push origin main`; confirm with `git status -sb` showing no ahead count.

## Errors and edge cases

- Sibling `main` dirty or diverged: stop with the porcelain output; never stash or force.
- `check-agents-core.mjs --fix` touches lines outside the core block and the two marker lines: a sibling drifted from v7; report the diff, do not commit.
- `.agents/skills/` is a pi discovery root only; CC does not read it. A CC author who wants a shared skill uses `.claude/skills/` or plugin distribution.
- Gridstrong has no core marker: line rewrites only.
- Both plugins installed in CC: two skills are eligible on a skill edit; the description's "gauntlet's authoring conventions" clause and the README sentence distinguish them. No further mitigation.
- Historical specs in all five repos still contain `writing-skills` by design.

## Tests

- `npm test` in the worktree: skill lint accepts `forge-skill` frontmatter; marketplace assertions pass with six entries; model-literal lint runs over `skills/forge-skill/SKILL.md` with `EXCLUDED_PREFIXES = []` and its unit test passes; AGENTS core check confirms the block content (it does not check the version stamp); `npm pack` contents exclude `.claude-plugin/`.
- `rg -n 'agents-core:(begin|end) v8' AGENTS.md` returns two lines in pi-gauntlet and each of the three siblings.
- Every `## Conventions` row cites its source when checked: pi `docs/skills.md`, Claude Code skills documentation.
- CC smoke check reads the rendered skill body and confirms the Substitutions row and `CLAUDE_SKILL_DIR` appear as written, with no expanded token.
- `wc -l skills/forge-skill/SKILL.md` <= 120.
- `rg -l writing-skills --glob '!**/doc/specs/**'` returns nothing in each of the five repos; in the pi-gauntlet worktree the plan under `doc/plans/` is the one permitted match until `/skill:finishing-a-development-branch` strips it, so the pre-finish scan adds `--glob '!**/doc/plans/**'`.
- `pi install -l <worktree>` then a fresh pi session resolves `/skill:forge-skill`.
- A Claude Code session with the plugin reloaded lists `/gauntlet:forge-skill`.
- `git -C <repo> status -sb` in each external repo shows `## main...origin/main` with no ahead count.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (Claude Code section), `AGENTS.md` + `AGENTS.core.md` (routing, core v8), `CHANGELOG.md`; siblings' `AGENTS.md`/`AGENTS.core.md`; gridstrong `doc/skills-and-prompts.md`
- Derived / memory docs invalidated: none

Materiality per `reference/documentation-impact.md`: each listed doc changes a routing contract or the supported CC skill set; none mirrors code.

## Out of scope

- A style lint for imperative voice or conditionality (GH-42 left it out; unchanged).
- Rewriting historical specs.
- Any change to superpowers or to how CC ranks competing skills.
- Editing pi-cohort personas or extension code (nothing reads the skill name).

## Open questions

none
