# Configuration front door and a worktree contract in the overrides file

**Goal:** Give a consumer repo one page that lists every `piGauntlet.*` key and every overrides-file heading a shipped skill or bin reads, and let `## using-git-worktrees` in that file drive worktree creation and cleanup end to end.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** #65

## Problem

Configuring pi-gauntlet for a repo has two surfaces - `piGauntlet.*` in `.pi/settings.json` (read by extensions through `extensions/lib/gauntlet-settings.ts`) and the Markdown overrides file (read by skill instructions, plus `## Spec index` by the `gauntlet-spec-index` bin) - and no page enumerates both. `README.md` "Project-specific overrides" (lines 291-496) shows examples without saying which headings and key lines a skill recognizes; `doc/configuration.md` covers settings only and is not in the npm tarball (`package.json` `files` = `skills, extensions, agents, bin, CHANGELOG.md`; `scripts/ci.mjs:641` fails when `doc/` leaks), so an installed skill cannot cite it. The `## Project overrides` paragraph at the tail of all 20 `skills/*/SKILL.md` files (six wording variants, same contract) says nothing about how an override relates to a skill's own `HARD CONSTRAINT`/MUST text, so an agent cannot answer "can this be changed?" from one place.

Worktree placement is the concrete casualty. `skills/using-git-worktrees/SKILL.md` Step 1a (58-71) guesses a wrapper from `AGENTS.md`, the repo root, `script/`, and `bin/`; Step 2a (77-79) says "a project override may define another path" and names no key. `skills/finishing-a-development-branch/SKILL.md` Step 6 (319-334) hardcodes `"$PRIMARY/script/worktree" destroy` and recognizes exactly `<repo>/.worktrees/`, `~/.worktrees/<project>/`, and that wrapper; any other path - including the sibling homes two consumer repos already use (`../<clone>-worktrees/<slug>`, `../<clone>-<name>`) - is reported host-owned and the branch is kept. `skills/gatekeep-pr` has a separate wrapper vocabulary (`## PR gate` `worktree wrapper: <command>`, `reference/assessment.md:35`, digest `worktree.destroy` run by `reference/cleanup.md:9`).

Premise correction: the ticket attributes worktree-first and spec-in-squash to brainstorming's `## HARD CONSTRAINT`; that section (`skills/brainstorming/SKILL.md:13-21`) governs approval-before-implementation only, and the two rules live in `## Worktree First` (64-70). The reading-impression claim stands; the fix is a relationship statement in the tail paragraph, not a rewrite of that heading.

Framing: pivoted to a single `## using-git-worktrees` contract read by using-git-worktrees, finishing-a-development-branch, and gatekeep-pr - `## PR gate` `worktree wrapper:` is removed, so one heading owns "how this repo makes a worktree" and no precedence question between two keys arises. No `piGauntlet.*` worktree key: settings keys are read by extensions in code, a skill reaches them only through `gauntlet_setting` (pi-only, enum at `extensions/phase-tracker.ts:784`, resolver + bins rebuild per key), and the wrappers' per-run arguments (`<subproject>`) do not fit a static string.

## Acceptance criteria

Ticket #65, "Phase 1 - one documented front door" / "Phase 2 - worktree location as an override" checkbox lists, rows verbatim:

- [ ] A single documentation page (new or an existing one) enumerates every `piGauntlet.*` settings key and every overrides-file heading read by a shipped skill or bin, each with its owner (skill or extension), default, and a one-line effect; `README.md` § Project-specific overrides and § Configuring the gates link to it.
  in-scope
- [ ] That page contains one complete worked example for a non-default repo covering a custom `flowGuards.specDirs`, `telemetry.enabled: false`, and a non-default worktree location (built-in or wrapper), with the resulting `.pi/settings.json` and `.pi/gauntlet-overrides.md` shown in full.
  in-scope
- [ ] The `## Project overrides` section of every `skills/*/SKILL.md` links to that page and states how a project override section relates to the skill's own `HARD CONSTRAINT`/MUST sections, so an agent can answer "can this be changed?" without inferring from heading placement.
  in-scope
- [ ] The page names, in one list, the rules that cannot be changed through the overrides file (whether they need a settings key or are fixed), so the question is answered from one place.
  in-scope
- [ ] `skills/using-git-worktrees/SKILL.md` documents one `## using-git-worktrees` key set that selects how a worktree is made: a built-in location (default `<repo>/.worktrees/<branch>`, or sibling-of-checkout), or a project wrapper given as `create:` and `destroy:` command templates with paths relative to the repo root (for example `create: script/worktree create <name> <subproject>`, `destroy: script/worktree destroy <name>`). Step 1a uses the configured wrapper instead of guessing from `AGENTS.md`, `script/`, and `bin/`.
  in-scope
- [ ] `skills/finishing-a-development-branch/SKILL.md` Step 6 removes a worktree made under any configured option: the configured `destroy:` command run from the primary for a wrapper (replacing the hardcoded `"$PRIMARY/script/worktree" destroy`), or `git worktree remove` + `prune` + branch delete for a built-in location, instead of reporting the worktree host-owned. Shown by an eval case or a before/after transcript.
  in-scope
- [ ] The Phase 1 page carries two worked examples: the sibling-location case, and a wrapper case shaped like `script/worktree create <name> <subproject>` / `destroy <name>`.
  in-scope
- [ ] With no `## using-git-worktrees` section, behavior is unchanged: creation at `<repo>/.worktrees/<branch>`; cleanup still removes exactly the three recognized homes (`<repo>/.worktrees/`, `~/.worktrees/<project>/`, project wrapper) and still leaves any other path host-owned with the branch kept. Shown by an eval case or a before/after transcript.
  in-scope
- [ ] `CHANGELOG.md` records the new key and the documentation page.
  in-scope

Readings carried as Design clauses: the "single documentation page" is `README.md`, whose two sections are the page (row 1's "link to it" is satisfied by the sections themselves plus cross-anchors between them); "sibling-of-checkout" is `home:` without `create:`; row 8's "creation at `<repo>/.worktrees/<branch>`" is the legacy ladder's fallback (native tool, then a discovered wrapper, then `.worktrees/`), and its three recognized homes are kept verbatim on the legacy path, so the legacy wrapper line and `~/.worktrees/<project>/` survive there (this narrows the round-1 statement that they "go away" - they go away only when the keyed contract is active).

## Design

### 1. README front door

`README.md` "Project-specific overrides" is rewritten as the front door for the Markdown surface, in this order:

1. Lead paragraph: what the file is, the discovery ladder (`.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`, first found wins, never merged), that skills read it as instructions and `gauntlet-spec-index` reads `## Spec index`.
2. **Overrides table** - one row per heading and key line a shipped skill or bin reads from the overrides file, columns `Heading / key`, `Read by`, `Default (absent)`, `Extends or overrides`, `Effect`. Rows, verified at implementation by reading each reader (a heading counts only when a skill or bin reads it from the overrides file; skill-local headings do not count): `## conventions`; `## <skill-name>`; `## using-git-worktrees` with `home:`, `create:`, `destroy:`; `## cleanup` items (`<label>: <command or /skill:...>`; inherits `## PR gate` `timeout minutes:`); `## Spec index` `- docs:`; `## Issue tracker` keys; `## PR gate` keys (`verification command`, `timeout minutes`, `requires credentials`, `local verification`, `ci checks`, `issue fetch`, `merge policy` - `worktree wrapper` removed); `## comms style`; `## Deployment`; `## Delivery`; `## Happy path`; `## Ticket wording`; `## Capabilities` (`skills/shape-ticket/SKILL.md:221`); `## Response channels` (`skills/chase-bug/SKILL.md:307`); `## documentation`. `Default (absent)` is "no added instructions" for prose headings and the concrete fallback for structured keys. `Extends or overrides` is `extends` (adds rules; the skill's text stays binding) or `overrides` (replaces the named step's default).
3. **Fixed rules list** - what the overrides file cannot change, each tagged `fixed` or `settings: <key>`: worktree-first and spec-in-squash (fixed); the design approval gate and the ship verification gate (fixed); the plan strip at finish (fixed); first-found-wins discovery (fixed); spec directory (`settings: flowGuards.specDirs`); gate enforcement (`settings: flowGuards.enforce`); council, closure review, escalation model, telemetry, verify-before-ship (`settings:` their keys). The inventory sweeps constraint headings case-insensitively - `## HARD CONSTRAINT` (brainstorming), `## Hard constraint` (chase-bug, check-delivery, roasting-the-spec, shape-ticket), `## The Iron Law` (test-driven-development, verification-before-completion) - and every MUST rule they state is listed as `fixed` or `settings:`.
4. **Relationship statement** (the one the skills cite), two sentences: a project override section extends or replaces the step it names and never lifts a `fixed` rule or a skill's `HARD CONSTRAINT`/MUST text; a rule tagged `settings:` changes only through that settings key, never through the overrides file.
5. **Worked examples**, each a complete `.pi/settings.json` and `.pi/gauntlet-overrides.md` pair with concrete names (no angle-bracket placeholder other than the contract's substitution tokens): (a) repo `acme-api` with `flowGuards.specDirs: ["docs/specs"]`, `telemetry.enabled: false`, and sibling placement `home: ../acme-api-worktrees/<name>`; (b) repo `acme-mono` with `create: script/worktree create <name> <subproject> --branch <branch>`, `destroy: script/worktree destroy <name>`, `home: ../acme-mono-<name>`. Example (a) satisfies rows 2 and 7's sibling case; (b) satisfies row 7's wrapper case. The existing prose-only `## using-git-worktrees` example (README 308-315) is replaced by (b); existing example headings (`## Issue tracker`, `## cleanup`, ...) move inside these two files rather than standing as separate snippets.

"Configuring the gates" gains a **settings table** - one row per `piGauntlet.*` key path in `extensions/lib/gauntlet-settings.ts` (`closureReview.*`, `specCouncil.*`, `escalationLoop.*`, `flowGuards.*`, `verifyBeforeShip.*`, `telemetry.*`), columns `Key`, `Owner (extension)`, `Default`, `Effect`, each row linking to its `doc/configuration.md` anchor. The two README sections cross-link. `doc/configuration.md` keeps per-key detail and gains one back-link line to the README front door; no key semantics change.

### 2. The `## using-git-worktrees` contract

Three recognized key lines, written like `## cleanup` items (`- <key>: <value>`), prose allowed before, between, and after them; prose is still read as instruction. The **keyed contract is active** when the section contains at least one recognized key; a section with none (both consumer repos and README's current example) is the **legacy path**: exactly today's behavior, prose-driven, no absent-key defaults.

| Key | Meaning | Absent (keyed contract active) |
|---|---|---|
| `home: <path pattern>` | Where this repo's worktrees live, relative to the primary checkout (absolute allowed, used as-is); `<name>` substitutes and must appear exactly once, inside one path segment that may carry a literal prefix or suffix (`../acme-mono-<name>`). Ownership test for finishing Step 6 and gatekeep cleanup. | `<primary>/.worktrees/<name>` |
| `create: <command>` | Shell command run from the primary with `<name>` and `<branch>` substituted. Any other `<token>` stays literal: the skill resolves it from the task context and asks once when it cannot. | built-in: `git worktree add "<home>" -b "<branch>"` (gitignore-first only when `home:` is inside the primary) |
| `destroy: <command>` | Removal command run from the primary, same substitution. | `git worktree remove "<path>" && git worktree prune` when the path matches `home:`; host-owned, keep, when it does not |

**`<name>`** is the creation identifier: for gauntlet flows the branch name with every `/` replaced by `-` (`jacek/fix-x` -> `jacek-fix-x`), for gatekeep-pr `pr-<N>`. It is not necessarily the directory basename (`home: ../acme-mono-<name>` makes the basename `acme-mono-fix-x`).

**Ownership match** (finish and gatekeep cleanup): resolve `home:` against `$PRIMARY`, treat the `<name>` segment as `<prefix>*<suffix>` with the `*` matching one whole segment's remainder, canonicalize both sides (`realpath`), and compare `$WORKTREE` to the pattern; the text the `*` matched is the recovered identifier passed to `destroy:` (`../acme-mono-<name>` against `/work/acme-mono-fix-x` recovers `fix-x`). No match -> host-owned. Ambiguous match (pattern cannot isolate one segment) -> stop and report.

**Substitution**: each resolved token is inserted as one single-quoted shell word (`'...'`, embedded `'` escaped), including when the template already quotes it; an unresolved `<token>` is never executed - the skill asks once for its value. Literal tokens resolve from the task context by one rule: the value the plan, ticket, or user prompt names exactly once for that token (for `<subproject>`: the one top-level directory the change touches); zero or more than one candidate -> ask.

**Post-create check** (always, including a defaulted `home:`): after `create:` or the built-in add succeeds, `git worktree list --porcelain` run from the primary must list the resolved `home:` path; otherwise stop with the mismatch, no `Worktree ready` report.

Duplicate key: first wins, the skill names the duplicate.

### 3. Readers

- **using-git-worktrees** Step 1a is reordered: read the overrides section first. Keyed contract active: with `create:` run it (after the Step 3 clean-base check), with `home:` only run the built-in add at that path; then the post-create check; `$WORKTREE` = resolved `home:`; no native-tool or `AGENTS.md`/`script/`/`bin/` discovery. Legacy path (no section, or keyless section): today's ladder unchanged - native tool, heuristic wrapper discovery, `.worktrees/` fallback with gitignore-first. Step 2a names the keys. Step 4 report unchanged. Quick Reference and Red Flags rows name the keys instead of "the project's configured path".
- **finishing-a-development-branch** Step 6 re-reads the overrides file at finish time (no state is carried from creation; the file is the contract). Keyed contract active: ownership match -> `destroy:` with the recovered `<name>` if set, else `git worktree remove` + `prune`; no match -> host-owned, keep, branch kept. Legacy path: today's three homes and the hardcoded wrapper line, verbatim. Branch deletion follows removal in both options as today. Quick Reference, Common Mistakes ("Cleaning up harness-owned worktrees"), and the Never/Always lists reference the ownership match.
- **gatekeep-pr** `reference/assessment.md`: `## using-git-worktrees` is a ladder source read from the merge-base file (`git show "$MB:<overrides path>"`), like `## PR gate`. Provisioning keeps the fetch, unconditional reuse, divergence stops, and the HEAD == `headRefOid` check; the keyed contract replaces only the add/wrapper step of the "Nothing exists" row: `<name>` = `pr-<N>`, `<branch>` = `headRefName` for in-repo PRs and `pr-<N>` for fork PRs (fetched into that local branch first, as today); the built-in default for gatekeep is the existing-branch form `git worktree add "<home>" <branch>`, never `-b`; `create:` runs with those values. The digest records `path` = the worktree actually selected (the resolved `home:` when this run created it; a reused tree keeps its real path), `branch`, `created`, and `destroy` = `destroy:` substituted with the identifier the ownership match recovers from `path` (null when there is no `destroy:` or no match). Legacy path: today's rung 3 (`.worktrees/pr-<N>`, `AGENTS.md` wrapper discovery). `worktree wrapper:` is removed from `## PR gate` in README and `assessment.md`, and the digest comment in `skills/gatekeep-pr/verification-brief.md:84` is reworded to name `destroy:`; a leftover line is named once as unrecognized and ignored. `reference/cleanup.md` step 1: when the keyed contract is active, eligibility additionally requires the ownership match before `worktree.destroy` or `git worktree remove --force`; a non-match prints `worktree: skipped - outside configured home, left at <path>` and keeps the branch. Legacy path: step 1 unchanged.
- **All 20 `## Project overrides` paragraphs** gain one sentence, identical in each, appended as the paragraph's final line (the existing wording variants stay as they are): `The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.` The relative path resolves from `skills/<x>/SKILL.md` in the repo and under `node_modules/pi-gauntlet/` (npm always packs `README.md`), and passes the marketplace ref lint (`scripts/ci.mjs:601-611`, which resolves every bare `*.md` token against the mentioning file's directory).
- **AGENTS.md** routing row for `piGauntlet.*` settings gains README's front door as the first stop; the "Package rules" skills bullet keeps its `rg` hygiene check.
- **CHANGELOG.md** `## Unreleased` - Added: the `## using-git-worktrees` keys and the README front door; Changed: `## PR gate` `worktree wrapper:` removed in favor of the section.

No extension, bin, or settings-file change.

## Errors and edge cases

- `create:` exits non-zero: stop with the command's output; no fallback to `git worktree add`; no `Worktree ready` report.
- `create:` carries a literal token the context rule cannot resolve: ask the user for the value once, then run; never guess, never execute the raw `<token>`.
- Post-create check fails (resolved `home:` not in `git worktree list`): stop and report the mismatch (likely a wrong `home:` pattern or a wrapper that places trees elsewhere).
- `destroy:` fails in Step 6 or gatekeep cleanup: report its output, keep the branch, never retry with `git worktree remove --force`.
- Ownership match never widens deletion: a path outside the pattern is host-owned, as today; an ambiguous match stops.
- `home:` without a `<name>` segment, or with it twice: stop at first read and name the line.
- Overrides file found but unreadable: the reader's existing stop.
- `worktree wrapper:` still present in `## PR gate`: ignored, named once.
- Keyless `## using-git-worktrees` section (both consumer repos today): legacy path, prose still applied - no behavior change until they add a key.
- A branch or name containing spaces, quotes, or `;` reaches the wrapper as one literal argument (substitution rule), never as extra shell syntax.

## Tests

Skill edits that change behavior extend evals per `eval/README.md`; each target gets `intent.md` and a committed `report.md`, run with `node eval/run.mjs <target>` once at the end.

- New `eval/using-git-worktrees/`: (1) `create:` with a literal `<subproject>` resolvable from the plan - must run the substituted, single-quoted command from the primary and report the `home:`-derived path after the post-create check; (2) `home:` only (sibling) - must run the built-in add at that path with no gitignore edit; (3) no section, fixture with no native tool and no wrapper - must create `<repo>/.worktrees/<branch>` after the gitignore-first step; (4) keyless prose section plus a `script/worktree` in the fixture - must use the discovered wrapper (legacy path), not `git worktree add`; (5) `create:` with a branch `topic;id` - the command must receive it as one literal argument.
- New `eval/finishing-a-development-branch/`: (1) `home:` match, no `destroy:` - must run `git worktree remove` + `prune` then `branch -D`; (2) `home: ../acme-mono-<name>` with `destroy:` - must run the substituted `destroy:` from `$PRIMARY` with the recovered `<name>` (`fix-x`, not `acme-mono-fix-x`), then `branch -D`; a non-zero `destroy:` keeps the branch and never runs `git worktree remove --force`; (3) no section, worktree at a sibling path - must report host-owned and keep the branch; (4) no section, worktree under `.worktrees/` - must remove it; the Step 6 `~/.worktrees/<project>/` home and the legacy wrapper line are asserted present in the skill text by an `rg` check in the implementing task (row 8 evidence).
- `eval/gatekeep-pr` gains two samples, both entering at a terminal menu's `cleanup` pick (its `replay.md` starts after step 2, so provisioning is not replayable there; the assessment-side changes - `<branch>` = `headRefName`, the leftover `worktree wrapper:` named once - are verified by the conformance review of the diff): (1) keyed contract active, `worktree.created` true at a `home:`-matching path with `worktree.destroy` recorded from `destroy:` - cleanup must run the recorded `destroy` from the primary and print `worktree: done`; (2) keyed contract active, reused worktree outside `home:` on a landed PR - cleanup must print the `outside configured home` skip and keep the branch.
- `npm test` covers skill/agent lint, the marketplace ref lint over the new relative link, the hygiene scan over the 20 edited paragraphs, and the pack-contents check (README stays packed, the doc directory stays out).

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - "Project-specific overrides" rewritten as the front door (overrides table with defaults, fixed-rules list, relationship statement, two full worked examples replacing the prose-only worktree example) and "Configuring the gates" gains the settings table; `## PR gate` loses `worktree wrapper:` (operations / tunable parameters; major conventions). `doc/configuration.md` - back-link to the README front door (derived pointer). `CHANGELOG.md - deferred: release`.
- Derived / memory docs invalidated: `AGENTS.md` routing row "`piGauntlet.*` settings ..." (first stop becomes the README front door).

Materiality bar: `reference/documentation-impact.md`. Skill bodies and their `reference/` files are implementation surface, tracked in the plan.

## Out of scope

- A `piGauntlet.worktree` settings key or any resolver/bin change.
- Local-only or git-ignored specs; changing the default `<repo>/.worktrees/<branch>` location; lifting worktree-first.
- A CI check that the README tables match the readers (worth a follow-up ticket; not required by #65).
- Rewriting the consumer repos' overrides files to add the keys.

## Open questions

none
