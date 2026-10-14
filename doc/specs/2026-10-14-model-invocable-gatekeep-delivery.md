# gatekeep-pr and check-delivery: model-invocable on an explicit ask

**Goal:** A model may load `gatekeep-pr` and `check-delivery` when a human instruction (a chat line or a loop task) names the object and the verb, so a Claude Code or pi driver that says "gatekeep PR 123" or "check delivery of ABC-123" gets the skill instead of a refusal - without either skill ever starting because a PR looks ready or a merge just landed.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Supersedes:** `doc/specs/2026-08-18-gh-9-gatekeep-pr-skill.md`, frontmatter `disable-model-invocation` decision only; `doc/specs/2026-08-18-gh-10-check-delivery-skill.md`, frontmatter `disable-model-invocation` decision only.

## Problem

`skills/gatekeep-pr/SKILL.md` and `skills/check-delivery/SKILL.md` carry `disable-model-invocation: true`. Per `skills/forge-skill/SKILL.md` that key means command-only in both pi and Claude Code and excludes the skill from subagent preload. A Claude Code session asked "gatekeep PR 123" therefore refuses to load the skill, which breaks the unattended pattern where a developer loops over tickets or PRs with a one-line task per item and a strong model standing in for human judgment. `shape-ticket` had the same key and had it lifted in v7.7.1 (`CHANGELOG.md`, "model invocation allowed; tracker writes still require the explicit confirmation gate"); its description already reads as an ask-shaped trigger ("Use when asked to file, create, or shape a ticket ... (ticket IDs like ABC-123)"). The other two descriptions do not: `gatekeep-pr`'s is a 484-character step summary (forge-skill: "Description is a trigger ... never summarize its steps"), and `check-delivery`'s says "explicit-only ... (/skill:check-delivery <ticket-ref>)", which tells a model not to call it.

Framing: kept. Checked the three frontmatters, forge-skill's frontmatter table, `scripts/ci.mjs`, `scripts/brainstorming-contract.test.mjs` (pins only `brainstorming` as command-only), and `.claude-plugin/marketplace.json` (all three skills already exported). Nothing outside the two frontmatters blocks the ask.

## Acceptance criteria

none - no ticket

## Design

### Frontmatter

Remove `disable-model-invocation: true` from `skills/gatekeep-pr/SKILL.md` and `skills/check-delivery/SKILL.md`. `name` and `argument-hint` stay byte-identical. `shape-ticket`'s frontmatter and body are untouched (its description is already ask-shaped and its line 23 already states that model-initiated entry changes who starts the pipeline, never who approves the write).

Replace the two descriptions with these exact strings. Both follow `brainstorming`'s positive form ("Use only when the user explicitly requests ...") rather than a prohibition tail (forge-skill, "Recipe over prohibition"), and carry no step summary - the bodies own the mechanism, gates, and write rules:

```yaml
# skills/gatekeep-pr/SKILL.md  (218 characters)
description: Use only when explicitly asked to gatekeep, verify, or gate a named pull request before it merges ("gatekeep PR 123", a loop task naming the PR and the verb); post-merge delivery proof belongs to /skill:check-delivery.
```

```yaml
# skills/check-delivery/SKILL.md  (231 characters)
description: Use only when explicitly asked to prove delivery of a named merged ticket ("check delivery of ABC-123", a loop task naming the ticket and the verb) before its tracker status advances; pre-merge gating belongs to /skill:gatekeep-pr.
```

The trigger rule both descriptions encode: model-triggered entry needs an instruction that names the object (a PR number, a ticket ref) and the verb (gatekeep / verify / gate; check / prove delivery). An instruction that names only the object ("handle PR 123", "look at ABC-123") does not match and the skill stays unloaded - the conservative miss is intended; a loop driver names the verb to get the skill. Neither description names a situation (a ready-looking PR, a fresh merge) as a trigger.

### What this change enables, and what it does not

Lifting the key enables loading on an explicit ask. It does not change how either skill runs once loaded: `gatekeep-pr` renders its menu and records only direct human selections (`reference/post-selection-loop.md` line 13, "Only the orchestrator records direct human selections"); nothing in its body makes a verb on the opening task line ("gatekeep PR 123 and fix it") a pre-selected row. An unattended run therefore reaches the menu and stops there, exactly as a slash invocation does today. Whether the orchestrating model treats a task line that names a gated action as its confirmation is the harness's authorization rule (AGENTS core "Authorization"), not something this spec adds or specifies. Known limit, recorded here so the loop pattern is not oversold.

### Body prose that must stay true

- `skills/check-delivery/SKILL.md` line 56, "Explicit invocation only (`/skill:check-delivery <ticket-ref>`), read-only against the repository ..." becomes "Explicit ask only (`/skill:check-delivery <ticket-ref>`, or a task that names the ticket and the verb), read-only against the repository ...". The rest of the sentence is unchanged.
- `README.md` line 80 is one paragraph with two lists: "Thirteen activate automatically when pi sees the matching kind of task ..." and "Seven more require explicit entry (`disable-model-invocation: true`): ...". The explicit-entry list holds a long `gatekeep-pr` sentence (ending "run it with `/skill:gatekeep-pr <pr> [--rebase [base]]`") and a `check-delivery` sentence (ending "run it with `/skill:check-delivery <ref>`"). Edit: move both sentences verbatim out of the explicit-entry list and append them after the `shape-ticket` clause in the first list, each prefixed with its own qualifier - "model-invocable on an explicit ask that names the PR and the verb; the gates still need your selection -" for `gatekeep-pr`, "model-invocable on an explicit ask that names the ticket and the verb; the gates still need your selection -" for `check-delivery`; change "Thirteen" to "Fifteen" and "Seven more" to "Five more". The explicit-entry list keeps `brainstorming`, `chase-bug`, `gauntlet-performance`, `gauntlet-handoff`, `gauntlet-resume` - the five skills that still carry the key after this change (`forge-skill` mentions the key in its body table only; its frontmatter has no pin).
- `README.md` line 44, "Explicit invocation only, no auto-chain: deploys commonly lag merges ..." becomes "Explicit ask only, no auto-chain: deploys commonly lag merges ..."; the no-auto-chain rule and its reason stay.
- `skills/finishing-a-development-branch/SKILL.md` line 366 ("not run automatically here") and `doc/configuration.md` line 75 (names only `gauntlet-resume` as human-only) stay as written; both remain true.

### What does not change

- Every in-body gate: `gatekeep-pr`'s decision menu and per-row selection (`reference/decision-menu.md`, `reference/post-selection-loop.md`), action-scoped run grants, the `--rebase` sync's own write authority, the non-merge stop that "offers teardown, never autonomous"; `check-delivery`'s read-only contract and zero-writes-on-failure; `shape-ticket`'s single confirmation gate that stops on a headless run (`skills/shape-ticket/SKILL.md` line 37).
- `skills/brainstorming/SKILL.md` keeps `disable-model-invocation: true`; `scripts/brainstorming-contract.test.mjs` continues to pin it.
- `.claude-plugin/marketplace.json` - all three skills are already listed.

### Preload side effect

Lifting the key makes both skills eligible for subagent preload in both harnesses. In pi, every persona under `agents/` sets `inheritSkills: false` and none names either skill, so no pi child preloads them. In Claude Code the plugin's skill descriptions become preload-eligible for its subagents; that is accepted prompt growth of about 450 characters for the two descriptions, which is the reason the descriptions are kept short.

### Pattern

Follows the v7.7.1 `shape-ticket` precedent (`CHANGELOG.md` v7.7.1 entry): lift the key, keep the body gates, write the description as an ask-shaped trigger. Cuts across nothing.

## Errors and edge cases

- Eager invocation: the only new behavior is loading without a slash command. The descriptions open with "Use only when explicitly asked" and name no situation; the bodies are unchanged, so a loaded skill behaves exactly as under `/skill:`.
- Object without verb ("handle PR 123"): no match, skill not loaded; the driver names the verb.
- Verb without object ("gatekeep this"): model-triggered entry does not match - the descriptions require a named PR / ticket. Under an explicit slash command the existing, unchanged behavior applies: `gatekeep-pr` resolves an omitted PR from the current branch (`skills/gatekeep-pr/SKILL.md` "Arguments") and stops when none exists; `check-delivery` asks for a missing ref (`skills/check-delivery/SKILL.md` line 74, "missing ref = ask").
- Headless `shape-ticket` run reaches its gate and stops - unchanged and intended: tracker writes stay human-confirmed.

## Tests

`npm test` covers: skill lint in `scripts/ci.mjs` (frontmatter present with `name` and `description`; no length check - the 1024-character cap is a loader constraint, unenforced in CI), marketplace assertions, `scripts/brainstorming-contract.test.mjs` (pins only `brainstorming`), `scripts/gatekeep-comment-reconcile.test.mjs` (reads the gatekeep-pr body, which is unchanged). It does not assert the two keys are gone.

One-off readback, run before the finish and quoted in the commit body: `rg -n "disable-model-invocation" skills/gatekeep-pr/SKILL.md skills/check-delivery/SKILL.md` returns nothing; `rg -n "^disable-model-invocation" skills/shape-ticket/SKILL.md` returns nothing; `sed -n 3p` on both edited files prints the exact description strings above; `name:` and `argument-hint:` lines are byte-identical to `main`. No new test file.

Eval: this edit changes trigger behavior (when the agent loads the skill), which `AGENTS.md` "Change process" would route to `eval/<target>/`. The user instructed "don't run full eval on it"; a user instruction outranks AGENTS.md (AGENTS core "Ground Truth Before Reasoning"), so no eval is run and no `eval/<target>/report.md` is produced for this change. The commit body quotes that instruction so a later reader of the Change process paragraph sees the waiver; no conformance tool parses it.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (line 80 invocation lists and counts, line 44 wording; clears "major procedures / conventions" - the reader's contract for which skills a model may start on an ask); `CHANGELOG.md` - `## Unreleased` entry (major procedures / conventions)
- Derived / memory docs invalidated: none

## Out of scope

- Any change to `shape-ticket`'s description or body.
- Any change to the gates, menus, selection flow, or write rules inside the three skills, including a task-line pre-selection of a menu row.
- Adding an auto-chain from `finishing-a-development-branch` to `check-delivery`.
- Adding the two skills to any persona's preload list.
- Extending any `eval/<target>/`.

## Open questions

none
