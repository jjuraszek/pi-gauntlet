# pi-gauntlet

Workflow skills, agent personas, and extensions for the pi coding agent. Generic by design — project-specific content lives in consumer repos via `.pi/gauntlet-overrides.md`.

<!-- agents-core:begin v1 - shared across pi-quiver/pi-cohort/pi-gauntlet/pi-condense. Edit AGENTS.core.md, then: node scripts/check-agents-core.mjs --fix -->
## Communication Style

Same rules as the parent `~/.pi/agent*/AGENTS.md`. Applies to chat, commit messages, PR/issue comments, code review, and any artifact authored in this repo.

- **Human, terse, but sharp and precise.** Applies everywhere: interactive session, issue/PR comments, `.md` files. Terse is not vague - keep it exact.
- **Suppress process narration.** No intent classification, phase announcements, tool/subagent preamble, status updates, pleasantries. Start with substance.
- **Output instead:** outcomes, decisions needing input, verification results, blockers.
- **Bullets over prose. Short paragraphs.** No wall-of-text, no tutorial tone unless asked.
- **Show an example when it clarifies a complex point** - a small before/after or a concrete ref beats a paragraph. Examples disambiguate, they don't pad.
- **End on the ask, not a summary.** Diffs/outputs speak for themselves.
- **Match the recipient's register** in human-facing artifacts (issues, PRs, chat).
- **Prefer ASCII.** `-` not em/en-dashes, `...` not the ellipsis glyph, straight quotes. Non-ASCII only for a justified visual mark.

LLM-readable artifacts (`AGENTS.md`, `README.md`, `CHANGELOG.md`, skill bodies, agent personas, spec docs, code comments where the *why* is non-obvious) stay structured: tables, headings, explicit field references, code blocks. Optimize for retrieval over readability.

## Code & Documentation Discipline

- **Code is a liability.** Add only what the task requires. No premature abstractions, no helpers for hypothetical reuse, no fallbacks for branches that can't happen, no commented-out alternatives.
- **Docs are a contract.** Dense, current, no preamble. If a sentence doesn't help a future reader act, cut it - this applies to documentation as much as code.
- **No belt-and-suspenders.** Don't validate / null-check / guard the same thing at multiple layers - validate at the boundary once.
- **Delete dead code, don't comment it out.** Branch from the deletion commit if reversibility matters.
- **Comments only when the *why* is non-obvious.** No docstrings on self-evident params/returns. No banner/separator comments. Don't reference the current task or PR - that belongs in the commit message.
- **Markdown tables use compact `|---|` separators.** Never padded columns.
- **Surface, don't auto-fix.** A bug fix doesn't drag in surrounding cleanup; mention adjacent issues separately.

## Ticket convention

Every GitHub issue follows **Context -> Problem -> Idea (how to address) -> Acceptance Criteria**, then the idea is **roasted by 2 subagents and the consolidated roast is posted as a comment** before the issue is ready. A roast that kills or shrinks the idea is a success - file only what survives.

## Ground Truth Before Reasoning

Never guess Pi's API, message shapes, config, or values - read the source; the source wins; if it is missing, say so and ask, don't fabricate. The pi runtime is the **`@earendil-works`** namespace (matches the host pi install), not `@mariozechner` - treat its shipped `.d.ts` as API truth. Repo-specific source pointers, if any, follow.

<!-- agents-core:end v1 -->

## Package conventions

### Skills must stay generic

Skills in `skills/*/SKILL.md` are reusable across any pi consumer. Project-specific content (service names, file paths, verification commands, routing tables) is **forbidden** in skill bodies.

Every skill ends with a "Project overrides" block pointing to `.pi/gauntlet-overrides.md`. Consumers add project-specific content there; skills read it at runtime.

Before committing skill edits, run:

```bash
rg -ni "<your-company>|jjuraszek|/Users/[^/]+|<your-org-name>|gridstrong" skills/
```

Replace the placeholders above with patterns specific to your fork — company names, your username paths, internal service names. Expected: zero matches. Linear/Jira/`script/worktree`-style references are OK as **examples** but never as canonical paths.

### Agents

Seven agents ship in `agents/`: `implementer`, `code-reviewer`, `spec-reviewer`, and `conformance-reviewer`, plus `spec-council-member` and `spec-council-synthesizer` (dispatched only by `/skill:roasting-the-spec`, never directly), and `spec-summarizer` (dispatched only by `/skill:brainstorming`'s gate step, never directly). `conformance-reviewer` is the closing-loop intent gate, dispatched by the verify step of `subagent-driven-development` / `verification-before-completion` and surfaced before finish in `finishing-a-development-branch`. Body text becomes the child's system prompt (`systemPromptMode: replace`).

Frontmatter knobs are **not overridable** at `subagent()` call time. Preset-level `subagents.agentOverrides.<agent>` config only **fills fields the frontmatter left unset** (pi-cohort `agents.ts`), so a frontmatter pin kills the config knob. Pick pins carefully:

| Knob | implementer | code-reviewer | spec-reviewer | conformance-reviewer | spec-council-member | spec-council-synthesizer | spec-summarizer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `tools` | `read, write, edit, bash, grep, find, ls` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read, grep, find, ls, bash` | `read` |
| `thinking` | — | — | — | `xhigh` | `xhigh` | `xhigh` | — |
| `defaultContext` | `fork` | `fresh` | `fresh` | `fresh` | `fresh` | `fresh` | `fresh` |
| `inheritProjectContext` | `true` | `true` | `true` | `true` | `true` | `true` | `false` |
| `inheritSkills` | `false` | `false` | `false` | `false` | `false` | `false` | `false` |
| `completionGuard` | `true` | `false` | `false` | `false` | `false` | `false` | `false` |

Rationale: reviewers are read-only and skeptical (fresh context, no edit tools). `thinking` is deliberately **unset** on `implementer`/`code-reviewer`/`spec-reviewer` so each preset supplies it via `subagents.agentOverrides.<agent>.thinking` — consumers on non-thinking models set `false` (→ provider default). Recommended budgets: implementer `medium` (tasks are atomic, plan-driven), code-reviewer `high` (subtle-bug hunting), spec-reviewer `medium` (mechanical spec-vs-code check). `conformance-reviewer` and the council personas stay frontmatter-pinned at `xhigh`: the pin is intentional — the gate often inherits the main session's model (`closureReview.model` unset), and the persona must raise the budget to max regardless of preset config; the council is defined by max-budget critique. Both `spec-council-*` personas keep `bash`: it IS in the output path. `roasting-the-spec` dispatches members with an `output:` path, and pi-cohort injects a `Write your findings to: <path>` instruction into every such task (`single-output.ts` `injectSingleOutputInstruction`, fired per parallel task in `subagent-executor.ts`). Without a write-capable tool the member is ordered to write a file it cannot write: observed failures were 87-byte preamble stubs (glm-5) and stalls (gpt-5.5 at xhigh) - critique content lost before the chair ever saw it. The v3.2.0/v3.3.0 bash removal regressed this from 363/363 historical synthesis-reach to 0/2; v3.3.1 reverts it. (Members do their own read-only verification - grep/wc/find - then `cat > <output>`; the earlier "never in the output path" rationale was empirically false.) Implementer continues the parent's session (fork) but doesn't need to recurse into skill discovery (inheritSkills: false avoids dispatch loops). `inheritProjectContext: true` lets agents adapt to the consumer's `AGENTS.md`.

The two `spec-council-*` agents are the reviewer profile pushed to `thinking: xhigh`; they carry no `model:` — `/skill:roasting-the-spec` injects it per task (members from `piGauntlet.specCouncil.members`, the chair from `specCouncil.chair`), so no model is baked into the persona.

`spec-summarizer` is deliberately the narrowest profile: `tools: read` only and `inheritProjectContext: false` so it reads **only** the spec passed to it - a faithful spec-only projection is the feature (a thin summary signals a thin spec). It carries no `model:`/`thinking:`; summarization is not reasoning-heavy, so each preset supplies the model via `subagents.agentOverrides.spec-summarizer.model` (unset -> inherits the main loop), matching `worker`. It is the downstream **beneficiary** of the `external-ref` chain (it does not carry it): `spec-council-member` emits the `external-ref` finding kind, `spec-council-synthesizer` surfaces it as an `external-ref:`-prefixed cluster, and `brainstorming` scans for that prefix and inlines the referenced content before dispatching the summarizer - so by the time the summary runs, the spec is self-contained. The `brainstorming` gate dispatches it with an `output:` temp path + `outputMode: "file-only"` so the ~9KB summary survives pi-condense (a compact file reference is not a pruning target) and is read back verbatim; because `tools: read` cannot satisfy pi-cohort's injected `Write your findings to: <path>` instruction, the persona instead relies on the harness persisting its final text to that path (`persistSingleOutput` in `single-output.ts`) and a directive telling it not to attempt the write - the read-only counterpart to the `spec-council-*` `bash` remedy for the same injected instruction.

`conformance-reviewer` is the reviewer profile (fresh, read-only, skeptical) pushed to `thinking: xhigh` because it is the **last correctness gate** — the closing loop that confronts the assembled deliverable against the *origin* (spec + verbatim prompt), not the plan. Like the council agents it carries **no `model:`**; its model resolves from `piGauntlet.closureReview.model` **repo-local first** (a repo's `.pi/settings.json` overrides the preset whole-object — same as `specCouncil`; see `skills/verification-before-completion/reference/settings-precedence.md`), injected **call-site** by the verify-step skills (the same mechanism the spec-council chair uses); the phase-tracker guard blocks a dispatch that omits `model:` and warns on one that differs from the configured value, so every profile points the gate at the strongest reasoning model its providers can reach (the frontmatter-pinned `thinking: xhigh`/`defaultContext: fresh` are not call-site overridable, so the config supplies only `model`; unset → omit → inherit parent's model). It diverges from `code-reviewer` deliberately: code-reviewer's priorities and output are code-quality (Correctness/Tests/Security/… → severity-ranked bug list), whereas conformance-reviewer's are requirement coverage and intent fidelity (→ per-requirement DELIVERED/PARTIAL/MISSING/DRIFTED/UNAUTHORIZED verdict). Dispatch it as its **own** call; never fuse it into the whole-PR code review.

If you must override at call site, the only callable knobs are `model`, `task`, `output`, `outputMode`, `reads`, `progress`, `skill` — frontmatter wins for the rest.

### Extensions

All three extensions ship in `extensions/`:

| Extension | Configurable | Settings key |
| --- | --- | --- |
| `plan-tracker.ts` | No | — |
| `phase-tracker.ts` | Yes | `settings.json#piGauntlet.closureReview` (keys: `enforce`, `model`); `settings.json#piGauntlet.flowGuards` (keys: `enforce`, `specDirs`) |
| `verify-before-ship.ts` | Yes | `settings.json#piGauntlet.verifyBeforeShip` (keys: `testCommands`, `warningReference`) |

`phase-tracker.ts` also hosts the `gauntlet_setting` tool (keys `specCouncil`, `closureReview`), through which skills resolve merged `piGauntlet.*` settings. All `piGauntlet.*` reads — skills via that tool, both extensions directly — route through the shared helper `extensions/lib/gauntlet-settings*.ts` (pure resolvers + a `SettingsManager`-backed loader); no extension reads `pi.settings` (which does not exist on `ExtensionAPI` and is enforced empty by `scripts/ci.mjs`).

Hardcoded project paths or commands in extensions are forbidden. If you add a new configurable behavior, surface it as a `piGauntlet.<extensionName>` settings key with a sane default and document it in `README.md`.

## Development

### Change process mandate

Any non-trivial change to this repo rides the full gauntlet - `/skill:brainstorming -> /skill:writing-plans -> /skill:subagent-driven-development -> verify -> /skill:finishing-a-development-branch` - starting at brainstorming: it sets up the worktree, writes the spec, gates on approval, then auto-chains through the rest. 'Non-trivial' is defined by exclusion: everything except the trivial carve-out (typo / formatting / dependency bump / the release commit itself - version bump plus paired CHANGELOG heading, driven by the release skill). Covered surface: skill bodies, agent personas, extension logic, AGENTS.md / README.md / workflow and release docs, and release machinery (scripts/, .github/workflows/). No direct edits to that surface on `main`. The runtime flow-guards enforce this once a gauntlet run is entered, but they cannot force entry in the first place - hence this prose mandate.

### Local iteration

```bash
# In a consumer repo:
pi install -l ~/repos/pi-gauntlet
cd ~/repos/pi-gauntlet && npm run link-agents   # one-time per machine, symlinks agents/*.md into getAgentDir()/agents (default ~/.pi/agent/agents)
```

Edits in `~/repos/pi-gauntlet/skills/` and `~/repos/pi-gauntlet/extensions/` reload on next pi launch. Edits to `agents/*.md` are live via symlinks. During a gauntlet run the worktree created by brainstorming is the install target (`pi install -l <worktree>`), so live-testing skill edits still works before merge.

### Adding a skill

Implement-phase mechanics run once the pipeline reaches implementation - not a shortcut around brainstorming.

1. Create `skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`).
2. Body is generic workflow methodology. No project-specific paths or commands.
3. Append the standard "Project overrides" block at the end (copy from any existing skill).
4. Verify with the grep above.
5. Commit.

### Modifying an agent

Implement-phase mechanics run once the pipeline reaches implementation - not a shortcut around brainstorming.

1. Edit `agents/<name>.md`.
2. Re-read the knobs table above before changing frontmatter — most are not call-time overridable.
3. If the persona diverges materially from pi-cohort builtins, document why in the body.
4. Commit.

### Modifying an extension

Implement-phase mechanics run once the pipeline reaches implementation - not a shortcut around brainstorming.

1. Any new tunable must read from `settings.json#piGauntlet.<extensionName>`.
2. Provide a sane default that works without configuration.
3. Update `README.md` with the new config key.
4. Commit.

## Release workflow

pi-gauntlet publishes to npm as `pi-gauntlet` (public, unscoped). The release is **tag-triggered and CI-executed** - never `npm publish` from a laptop.

Use the repo-local **`release` skill** (`.agents/skills/release/SKILL.md`), driven by `.agents/skills/release/scripts/release.sh`: it proposes the semver level, gates on a clean state + `npm test`, pushes the tag after approval, then monitors CI and verifies npm + the pi.dev catalog. The skill lives in `.agents/skills/` (not shipped `skills/`) because releasing *this* repo is project-specific; it is excluded from the npm tarball by the `files` allowlist. The machinery (`release.sh`, `test.yml`, `release.yml`) is intentionally kept near-identical to pi-cohort's; `release.sh` differs only in its CONFIG header (package name, repo slug, former name, test command).

Mechanics:

```bash
# 1. Bump version in package.json + add the matching `## vX.Y.Z` CHANGELOG.md heading.
#    package.json version == tag == CHANGELOG top heading (scripts/ci.mjs asserts this).
git commit -m "Release vX.Y.Z"
# 2. release.sh current runs npm test (the CI gate), tags, pushes, then verifies.
bash .agents/skills/release/scripts/release.sh propose   # advisory level from git log
bash .agents/skills/release/scripts/release.sh current   # test + tag + push + verify
```

A pushed `v[0-9]+.[0-9]+.[0-9]+` tag fires `.github/workflows/release.yml`, which verifies the tag matches `package.json`, runs `npm test` (`scripts/ci.mjs`, which asserts version == CHANGELOG top), then runs `npm publish --provenance --access public` via **OIDC trusted publishing** (no `NPM_TOKEN` secret). After a successful publish, a `release-notes` job posts the `CHANGELOG.md` section matching the pushed tag (extracted with a version-matching `awk` that skips any `## [Unreleased]` block, failing the job if no section matches) as the GitHub Release body via `gh` - no LLM or API key, only `contents: write`. This job is byte-identical across pi-gauntlet, pi-cohort, pi-condense, and pi-quiver. `.github/workflows/test.yml` runs `npm test` on every push + PR. The pi.dev catalog at `https://pi.dev/packages/pi-gauntlet` crawls npm for the `pi-package` keyword on its own cadence - it is a downstream effect of publish, not a target.

**One-time npm setup:** `pi-gauntlet` must be registered as a **trusted publisher** on npmjs.com (repo `jjuraszek/pi-gauntlet`, workflow `release.yml`) or the publish step fails with 403. This mirrors pi-cohort's tokenless setup under the same account.

Consumers install explicitly:

```bash
pi install -l npm:pi-gauntlet@X.Y.Z
```

**Pair with pi-cohort.** pi-gauntlet depends on the [pi-cohort](https://github.com/jjuraszek/pi-cohort) dispatch package (the `subagent()` tool). The two version independently, but **release together whenever dispatch semantics change** — a skill that starts relying on a new pi-cohort dispatch shape must ship alongside the pi-cohort release that provides it, and the README peer-dependency minimum (`pi-cohort >= X.Y.Z`) must be bumped in the same pi-gauntlet release. When only pi-gauntlet-internal content changes (skill prose, agent frontmatter, extension logic that uses existing dispatch shapes), release pi-gauntlet alone.

Semver:

- **minor** — new skill, agent, or extension.
- **major** — skill/agent rename, breaking config schema change (settings-key rename, package rename), extension API removal.

## Lineage and credits

pi-gauntlet is a diverged reinterpretation of [obra/superpowers](https://github.com/obra/superpowers) (MIT, Copyright (c) 2025 Jesse Vincent), reached by way of [coctostan/pi-superpowers-plus](https://github.com/coctostan/pi-superpowers-plus). The skill methodology owes its shape to that upstream work; the pi runtime integration, the enforced gates, the spec council, conformance review, and the parallel-wave execution model are pi-gauntlet's own. See the README `Lineage` section for the user-facing summary; `LICENSE` preserves obra's copyright notice.

This is no longer tracked as a live fork — there is no active re-sync workflow. The table below is a **historical record** of the upstream revisions pi-gauntlet drew from at extraction time; it is not a sync target.

| Source | SHA | Date | Tag |
| --- | --- | --- | --- |
| `obra/superpowers` | `f2cbfbefebbf` | 2026-05-04 | v5.1.0 |
| `coctostan/pi-superpowers-plus` | `661d6cd0575b` | 2026-02-22 | v0.4.1 |

**Material divergence from obra v5.1.0:** upstream deleted their `agents/` directory in v5.1.0, merging `code-reviewer` into the `requesting-code-review` skill as a Task-dispatch template. We keep `agents/` because pi-cohort treats named agents as a first-class dispatch primitive (the `subagent({ agent: "code-reviewer" })` call in skills resolves to our profile, not a prompt template).

**Skills coverage:** we ship 12 of obra's 14 v5.1.0 skills. Two are not shipped: `using-superpowers` (a Claude-Code-specific bootstrap skill that forces invocation of the `Skill` tool — pi's discovery model surfaces skill descriptions automatically, so the bootstrap isn't needed) and `executing-plans` (shipped through v2.x, deleted in v3.0.0 as unused; its separate-session batch-execution role is subsumed by `subagent-driven-development`). `roasting-the-spec` is an original skill with no obra equivalent, so the 12-of-14 count tracks obra-sourced skills only (total shipped skills: 13).

## Ground truth pointers

Repo-specific sources (the principle is in the shared core above):

- Pi runtime: `@earendil-works/pi-coding-agent` docs (`packages.md`, `skills.md`).
- Agent dispatch: `jjuraszek/pi-cohort` source (`src/agents/agents.ts`) and `skills/pi-cohort/SKILL.md`.
