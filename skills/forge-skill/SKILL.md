---
name: forge-skill
description: Use when creating or editing a SKILL.md, a skill's reference file, an agent persona, a prompt template, or a slash command in pi or Claude Code - including one-line edits - or when such a file exceeds 500 lines, gains if/else branching, or drifts from imperative voice; the authoring skill for repos that follow gauntlet's conventions.
---

# Forge Skill

## Overview

This skill governs every file a model reads as instructions: `SKILL.md` and its reference files, agent personas, prompt templates, and slash commands, in pi and in Claude Code. Every sentence below is a rule to apply or a fact to check.

## Conventions

Skills only; persona conventions are in ## Persona rules.

Sources: pi - `docs/skills` in `@earendil-works/pi-coding-agent`; Claude Code - `code.claude.com/docs/en/skills`.

| Item | pi | Claude Code |
|---|---|---|
| Frontmatter | `---` on line 1, `name` and `description`, closing `---` | Same; an unknown field is ignored silently; unparseable YAML loads the skill with no fields |
| `name` | Lowercase letters, digits, hyphens; no leading, trailing, or doubled hyphen; at most 64 chars; match the directory name (Agent Skills standard; pi does not enforce it) | Display label for a personal or project skill (the command is the directory name); the last command segment for a plugin skill |
| `description` | At most 1024 chars; a skill without one is not loaded | Recommended; `description` plus `when_to_use` is cut at 1536 chars in the listing |
| Harness-only fields | `license`, `compatibility`, `metadata`, `allowed-tools` (spec-listed, not enforced) | `when_to_use`, `argument-hint`, `arguments`, `user-invocable`, `allowed-tools` (enforced) |
| `disable-model-invocation: true` | Command-only skill | Same; also excluded from subagent preload |
| Invocation | `/skill:name [args]` | `/name [args]`, or `/plugin:name` for a plugin skill |
| Supporting files | `reference/<topic>.md` (gauntlet convention; pi docs show `references/`), read at the step that names it; dispatch payloads sit beside `SKILL.md` | Any file linked by relative path; `references/`, `scripts/`, `assets/` by convention; `scripts/` files are executed, not loaded |
| Substitutions | None; the body is read as written | Argument tokens and `CLAUDE_*` variables in the dollar form expand before the model reads the body. In prose, prefix an argument token with one backslash (backslash, dollar, ARGUMENTS) and name a variable bare (`CLAUDE_SKILL_DIR`) |
| Locations | `.pi/skills/`, `~/.pi/agent/skills/`, `.agents/skills/`, `~/.agents/skills/`, a package's `skills/` dir | `.claude/skills/`, `~/.claude/skills/`, a plugin's `skills/` dir; `.agents/skills/` is not read |
| Reload after edit | `/reload` | Watched for `.claude/skills/` and `~/.claude/skills/`; a plugin skill needs a new session |

## Authoring rules

These rules bind the lines an edit adds or changes. Leave other lines alone.

- Imperative voice. Write instructions as commands. Never "should", "consider", "you may want to", "it is recommended".
- Low conditionality. One path per step: branch only on a runtime fact the model can observe - a tool result, a file's presence, a settings value - never on the reader's judgment. Two branches is the ceiling; a third goes into a table, or for a skill a reference/ file.
- Minimal diff. A rule change touches the sentence that owns the rule, not the section. Never restate a rule in a second place; link the owner.
- Skills only: Oversized file. A change touching a file over 500 lines extracts the concern it touches - or the largest self-contained `##` section - into `reference/<topic>.md` in the same change, and leaves a one-line "read X now" pointer at the step that needs it.
- Recipe over prohibition. A shape or quality problem gets a statement of what the output is; a discipline problem gets one explicit rule. Never a list of things to avoid.
- No nuance clauses. "Unless it matters", "when appropriate", "if needed" reopen the decision; delete them or name the observable condition.
- Skills only: Description is a trigger. State when to load the skill (symptoms, file types, situations); never summarize its steps.
- One example. One concrete example per rule, never three.
- Skip what the model knows. No explanations of git, shell, or the harness.
- Skills only: Never force-load. Cross-reference a skill by its invocation name (pi `/skill:name`, Claude Code `/name` or `/plugin:name`); never with `@`.
- ASCII punctuation, compact `|---|` table separators, present tense.

## Persona rules

A persona is an `agents/<name>.md` file dispatched by name (pi-cohort `subagent({ agent })`, Claude Code subagents); its body is the child's entire system prompt. Frontmatter fields: the "Agent frontmatter" table in pi-cohort's agents-and-chains doc; a project's pins: its personas doc ("Frontmatter knobs" in this repo's `doc/personas`). Every `## Authoring rules` bullet without a `Skills only:` marker binds here too.

- Whole prompt. pi-cohort assembles no base prompt, AGENTS.md, or skills catalog around the body unless `inheritProjectContext` or `inheritSkills` opts in; Claude Code replaces its default prompt with it. Open with the role and why it exists, state the output contract the caller parses before any method; when the caller parses a closing line, keep it last.
- Routing label. `description` is the one-sentence dispatch label the orchestrator's agent list shows: name when to dispatch, and write `Not for direct dispatch` when a skill owns the call. Never a summary of the body.
- Frontmatter pin. Leave every line the edit does not touch byte-identical, and leave frontmatter untouched unless the request names a knob - a pinned field removes the matching `agentOverrides` knob, so the request states the pin; a line the edit rewrites follows the ASCII rule like any other. Never pin `model`.
- Narrow tools. `tools` and `inherit*` list the operations the job performs and nothing else; a reviewer keeps `bash` when its caller injects a scoped command. A non-implementing persona with `bash` sets `completionGuard: false`; an implementing persona keeps the guard.
- Contract strings. A sentence a caller parses - closing line, mode discriminator, verdict word - changes only together with its caller; the project's validator pins them. Example: `lean: nothing to cut` stays verbatim.
- No skill machinery. No `/skill:` cross-reference and no `reference/` file: the body is read whole and nothing beside it is loaded (frontmatter `skills:` injects named skills; it is a knob, not a file split). A persona over 500 lines splits by job into a second persona.
- Reload. pi-cohort re-reads `agents/` on every dispatch, so an edit is live at the next call; Claude Code needs a new session.

## Edit procedure

1. Read the whole file.
2. Locate and edit the sentence that owns the rule you are changing (see Minimal diff).
3. Read the changed lines back against `## Authoring rules`.
4. Run wc -l; over 500 lines, a skill extracts per the oversized-file rule, a persona splits by job.
5. Skill, pi: run /reload. Persona, pi: nothing. Claude Code: start a new session.

## Test (optional)

Run after adding a rule or rewording a discipline rule.

1. Write one scenario prompt the rule governs.
2. In one turn dispatch two fresh workers: the loaded worker's task is the scenario plus the full `SKILL.md` body; the baseline worker's task is the scenario alone.
3. Compare the two outputs. Fold every excuse the baseline gives into the rule sentence it evades.

| Harness | Dispatch |
|---|---|
| pi | `subagent({ agent: "worker", context: "fresh", task })` twice, one task with the body appended |
| Claude Code | The harness's subagent dispatch tool, twice, same split |
| pi, persona | baseline: `subagent({ agent: "worker", context: "fresh", task })` with the pre-edit body appended; loaded: `subagent({ agent: "<name>", context: "fresh", task })` after the edit - pi-cohort re-reads `agents/` per dispatch, so capture the pre-edit body first |

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context - check it for project-specific routing tables, service paths, and verification commands.
