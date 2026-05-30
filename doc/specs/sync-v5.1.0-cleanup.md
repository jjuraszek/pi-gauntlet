# Spec: sync v5.1.0 cleanup + phase-tracker extension

## Context

Audit comparing pi-superpowers HEAD against `obra/superpowers@f2cbfbefebbf` (v5.1.0, May 4 2026) and `coctostan/pi-superpowers-plus` found:

| # | Class | Issue |
|---|---|---|
| 1 | Bug | `skills/writing-plans/SKILL.md:174` still dispatches `plan-document-reviewer-prompt.md`. Upstream v5.0.6 dropped this subagent loop after 5×5 trials (~25 min/run cost, zero quality gain). We do inline self-review AND dispatch — contradicts our own "no belt-and-suspenders" AGENTS.md rule. |
| 2 | Bug | `skills/using-git-worktrees/SKILL.md` Step 0 uses raw `git rev-parse --git-dir` without `cd && pwd -P` wrapping. Submodule guard uses `.git is a file` heuristic instead of `git rev-parse --show-superproject-working-tree`. Upstream v5.1.0 has both. |
| 3 | Bug | `skills/using-git-worktrees/SKILL.md` Step 1a frames native tools abstractly. Upstream proved (TDD: 2/6 → 50/50 compliance) that **explicit tool-name anchors** (`EnterWorktree`, `WorktreeCreate`, `/worktree`, `--worktree`) are load-bearing. |
| 4 | Bug | `skills/writing-skills/reference/testing-skills-with-subagents.md:15` references `examples/CLAUDE_MD_TESTING.md` which we never ported. Dead link. |
| 5 | Bug | `README.md:3,31` link to `https://github.com/mariozechner/pi` — 404. Correct repo is `https://github.com/badlogic/pi-mono`. |
| 6 | Bug | `AGENTS.md:48` verification grep uses `<your-company>\|specific.company.name` — second pattern is a meaningless placeholder. |
| 7 | Design | Six skills call `plan_tracker.update` to mark "phase complete" but never `init` a phase list. Calls either no-op or mutate an unrelated task list. Two distinct concerns (phase vs task) share one tracker. |

## Scope

Three phases, each landing as one or more commits, each verified by `code-reviewer` subagent against this spec, final verification by orchestrator.

| Phase | Touches | Adds | Deletes |
|---|---|---|---|
| 1 | 4 skill SKILL.md files, `README.md`, `AGENTS.md` | — | `skills/writing-plans/plan-document-reviewer-prompt.md` |
| 2 | `package.json` | `extensions/phase-tracker.ts` | — |
| 3 | 4 skill SKILL.md files, `README.md`, `AGENTS.md`, `CHANGELOG.md` | — | — |

## Non-goals

- Porting `using-superpowers` skill from upstream (intentional omission — pi loads skill descriptions into the system prompt automatically).
- Porting `coctostan/pi-superpowers-plus` runtime workflow-monitor extension (separate decision, larger scope).
- Touching `agents/*.md` — frontmatter and personas are aligned.
- Refactoring split SKILL.md → reference/ structure for any other skill — current split is fine.
- Bumping pi-coding-agent or pi-subagents version pins.

---

## Phase 1 — Cleanup bugs (#1, #2, #3, #4, #5, #6)

### Files to edit

**`skills/writing-plans/SKILL.md`**

Replace the "Self-Review (Before Handoff)" section (currently ends with "Then dispatch the plan-document reviewer...") with inline-only language. Keep the three checks (Spec coverage / Placeholder scan / Type-API consistency). Drop the dispatch sentence and the "fresh-context subagent that audits the plan as a document" sentence. Replace with a one-line note: "This is a checklist you run yourself — not a subagent dispatch."

**`skills/writing-plans/plan-document-reviewer-prompt.md`**

Delete the file. No remaining references after the SKILL.md edit.

**`skills/using-git-worktrees/SKILL.md`** — Step 0

Replace the current Step 0 detection block with the upstream v5.1.0 robust version:

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

Replace the submodule guard with:

```bash
# If this returns a path, you're in a submodule, not a worktree — treat as normal repo
git rev-parse --show-superproject-working-tree 2>/dev/null
```

Add branch state reporting ("On a branch: …" vs "Detached HEAD: …") after the detection block.

**`skills/using-git-worktrees/SKILL.md`** — Step 1a

Replace the current "Step 1a — Prefer the Project's Native Tool" with upstream v5.1.0's wording, which explicitly names tool patterns:

> The user has asked for an isolated workspace (Step 0 consent). Do you already have a way to create a worktree? It might be a tool with a name like `EnterWorktree`, `WorktreeCreate`, a `/worktree` command, or a `--worktree` flag. If you do, use it and skip to Step 3.

Keep our existing wrapper-script content (`script/worktree`, `bin/worktree`) but frame it as "If your project ships a wrapper instead of a native tool" so it's clearly secondary to native tools.

**`skills/writing-skills/reference/testing-skills-with-subagents.md`**

Replace the line referencing `examples/CLAUDE_MD_TESTING.md` with a pointer to upstream:

> **Complete worked example:** See `obra/superpowers` repository, `skills/writing-skills/examples/CLAUDE_MD_TESTING.md` for a Claude-Code-flavored test campaign that illustrates the methodology end-to-end.

**`README.md`**

Replace both occurrences of `https://github.com/mariozechner/pi` (lines 3 and 31) with `https://github.com/badlogic/pi-mono`.

**`AGENTS.md`**

Replace the verification grep line:

```bash
rg -ni "<your-company>|specific.company.name" skills/
```

With more useful examples:

```bash
rg -ni "<your-company>|jjuraszek|/Users/[^/]+|<your-org-name>" skills/
```

And expand the explanation: "Replace the placeholders above with patterns specific to your fork — company names, your username paths, internal service names."

### Verification

- `rg -n "plan-document-reviewer-prompt" skills/` — zero matches.
- `rg -n "mariozechner/pi[^-]" README.md` — zero matches (the `/pi-mono` form should still match without trailing `-`, hence the negative-char-class).
- `rg -n "examples/CLAUDE_MD_TESTING" skills/` — zero matches.
- `rg -n "EnterWorktree\|WorktreeCreate" skills/using-git-worktrees/SKILL.md` — at least one match.
- `git ls-files skills/writing-plans/plan-document-reviewer-prompt.md` — empty output.
- All 5 edited SKILL.md files still end with the `## Project overrides` block (use `tail -5`).

### Reviewer prompt addendum

Verify against this spec's "Files to edit" list. Flag any of:
- Removed content beyond what's specified.
- Left-behind references to `plan-document-reviewer-prompt.md` in any file (including AGENTS.md, README.md, CHANGELOG.md).
- Step 1a wording that doesn't explicitly name at least 3 of: `EnterWorktree`, `WorktreeCreate`, `/worktree`, `--worktree`.
- Submodule guard still using `.git is a file` heuristic.
- Project overrides block stripped from any skill.

---

## Phase 2 — `phase-tracker` extension

### New file

**`extensions/phase-tracker.ts`** — single file, no disk persistence. Mirror the structure of `extensions/plan-tracker.ts` but with a fixed phase model.

Required API surface:

| Tool action | Params | Effect |
|---|---|---|
| `start` | `phase: Phase` | Mark phase `in_progress`. If another phase is already `in_progress`, error unless it's `complete`/`skipped`. |
| `complete` | `phase: Phase` | Mark phase `complete`. Phase must currently be `in_progress` or `pending`. |
| `skip` | `phase: Phase`, `reason: string` | Mark phase `skipped` with reason. Reason is rendered in widget tooltip / status output. |
| `status` | — | Return current state of all phases as text. |
| `reset` | — | Wipe phase state (for new feature start). |

Phase enum (fixed order):

```typescript
type Phase = "brainstorm" | "plan" | "implement" | "verify" | "ship";
```

Phase status:

```typescript
type PhaseStatus = "pending" | "in_progress" | "complete" | "skipped";
```

State reconstruction: walk `ctx.sessionManager.getBranch()` for tool results with `details.kind === "phase-tracker-state"` (same idiom as `plan-tracker`). No disk writes. Branches/forks inherit state automatically.

Widget: single-line above editor (or below `plan-tracker` if both active), format:

```
Phases: ✓ brainstorm → ✓ plan → → implement → ○ verify → ○ ship
```

Symbol legend:
- `○` pending
- `→` in_progress
- `✓` complete
- `⊘` skipped

Skipped phases render dimmed.

### `package.json`

Add `extensions/phase-tracker.ts` to whatever array/field registers extensions. Mirror the `plan-tracker.ts` entry exactly.

### Verification

- `node --check extensions/phase-tracker.ts` (or `tsc --noEmit` if TS config supports it) passes.
- Extension loads in pi: `cd <consumer-repo> && pi` shows no extension-load error in the welcome banner.
- Manual smoke: call `phase_tracker({ action: "start", phase: "brainstorm" })` → widget appears. Call `complete` → check next phase. Call `reset` → state clears.
- `plan-tracker` widget still renders correctly when both are active (no layout collision).

### Reviewer prompt addendum

Compare against `extensions/plan-tracker.ts` line-by-line for structural parity. Flag any of:
- Disk writes (`fs.writeFile`, etc.) — must be session-state only.
- Direct globals or module-level state — state lives in tool results.
- Missing reconstruction handlers for `session_start`, `session_switch`, `session_fork`, `session_tree`.
- Phase order hardcoded inconsistently across functions.
- Typebox schema missing `action` or `phase` constraints.
- Widget render uses `console.log` instead of the TUI render API.

---

## Phase 3 — Skill rewiring + docs

### Files to edit

**`skills/brainstorming/SKILL.md`**

Find the `plan_tracker({ action: "update", ... })` call (currently marks "brainstorm phase complete"). Replace with:

```
phase_tracker({ action: "complete", phase: "brainstorm" })
```

Add a setup line at the start of the skill: "If no phase-tracker state exists (status returns pending across the board), call `phase_tracker({ action: "start", phase: "brainstorm" })` before drafting."

**`skills/writing-plans/SKILL.md`**

Replace the `plan_tracker` call near the end of the skill (marks planning phase complete) with:

```
phase_tracker({ action: "complete", phase: "plan" })
```

Add a setup line: "Before drafting the plan, call `phase_tracker({ action: "start", phase: "plan" })`."

**`skills/test-driven-development/SKILL.md`**

Replace the `plan_tracker` "phase complete" call with `phase_tracker({ action: "complete", phase: "implement" })`. If `plan_tracker` is used elsewhere for per-task tracking, leave those calls intact.

Add a setup line: "Before starting implementation, call `phase_tracker({ action: "start", phase: "implement" })`."

**`skills/verification-before-completion/SKILL.md`**

Replace the `plan_tracker` "verify phase complete" call with `phase_tracker({ action: "complete", phase: "verify" })`.

Add a setup line: "Before running the verification gate, call `phase_tracker({ action: "start", phase: "verify" })`."

**`skills/finishing-a-development-branch/SKILL.md`** (if it calls `plan_tracker` for ship phase)

Replace with `phase_tracker({ action: "complete", phase: "ship" })`.

**`skills/subagent-driven-development/SKILL.md`** and **`skills/executing-plans/SKILL.md`**

Leave intact. These use `plan_tracker` for per-task progress (correct usage). Do NOT rewire them to `phase_tracker`.

**`AGENTS.md`**

Update the Extensions table to add `phase-tracker.ts`:

| Extension | Configurable | Settings key |
|---|---|---|
| `plan-tracker.ts` | No | — |
| `phase-tracker.ts` | No | — |
| `verify-before-ship.ts` | Yes | `settings.json#piSuperpowers.verifyBeforeShip` |

Update the "Modifying an extension" section if it references the count.

**`README.md`**

Update the "What you get" section:

- Change "**2 runtime extensions**" to "**3 runtime extensions**".
- Add `phase-tracker` bullet between `plan-tracker` and `verify-before-ship`:

> - `phase-tracker` — tracks workflow phase (brainstorm → plan → implement → verify → ship) with a TUI widget. Use the `phase_tracker` tool from skills. Distinct from `plan-tracker` which tracks per-task progress within the implement phase.

Add a brief "Extensions / phase-tracker" subsection mirroring the `plan-tracker` and `verify-before-ship` subsections.

Also: in the "What you get" header counts, update "13 skills" → keep as 13 (skill count unchanged).

**`CHANGELOG.md`**

Add a new `## [Unreleased]` (or `## [0.2.0]`) section above the current entries summarizing:

- Dropped `plan-document-reviewer-prompt.md` subagent dispatch in `writing-plans` (align with obra v5.0.6 — inline self-review only).
- Ported obra v5.1.0 Step 0 and Step 1a improvements in `using-git-worktrees` (robust path resolution, explicit native-tool naming).
- Fixed dead link in `writing-skills/reference/testing-skills-with-subagents.md`.
- Fixed broken `mariozechner/pi` → `badlogic/pi-mono` link in README.
- Improved verification grep example in AGENTS.md.
- Added `phase-tracker` extension for workflow phase tracking.
- Rewired `brainstorming`, `writing-plans`, `test-driven-development`, `verification-before-completion`, `finishing-a-development-branch` to call `phase_tracker` instead of (mis)using `plan_tracker` for phase progress.

### Verification

- `rg -n "plan_tracker.*phase" skills/` — should only match in comments or doc strings, not as active calls in brainstorming/writing-plans/TDD/verification/finishing.
- `rg -n "phase_tracker" skills/` — at least 5 matches across the rewired skills.
- `rg -n "phase-tracker" README.md AGENTS.md` — present in both.
- `rg -n "13 skills" README.md` — present, unchanged (no skill count change).
- Re-walk a fake workflow in a consumer repo: `phase_tracker status` → see all 5 phases → run through brainstorming → status should show brainstorm complete.

### Reviewer prompt addendum

Check that:
- `subagent-driven-development` and `executing-plans` were NOT touched (they correctly use `plan_tracker` for tasks).
- Each rewired skill has both a `start` call (early) and a `complete` call (late). Asymmetric calls indicate incomplete rewiring.
- The phase name in each skill matches the phase being executed (brainstorming → "brainstorm", writing-plans → "plan", etc.). No copy-paste errors like brainstorming calling `complete: "plan"`.
- AGENTS.md table row count matches the file list in `extensions/`.
- README extension count updated everywhere it appears (search for "2 runtime extensions" / "2 extensions" / "extensions count").
- CHANGELOG entry exists with all 7 bullets.

---

## Order of execution

Phases must be sequential — Phase 3 depends on Phase 2's `phase_tracker` tool existing, and Phase 1's cleanup should land first so reviewers aren't distracted by unrelated diffs.

```
Phase 1 (cleanup) → reviewer → orchestrator gate
       ↓
Phase 2 (phase-tracker extension) → reviewer → orchestrator gate
       ↓
Phase 3 (skill rewiring + docs) → reviewer → orchestrator final verification
```

Each implementer dispatch gets the full spec file plus the phase-specific section. Each reviewer dispatch gets the full spec plus the phase-specific "Reviewer prompt addendum".

## Definition of done

- Spec verification commands (under each phase) return expected results.
- `git log --oneline` on the `sync-v5.1.0-cleanup` branch shows 3-5 commits (one per phase, plus possibly one for the spec itself).
- `git diff main...HEAD --stat` shows: 6 modified skill SKILL.md files, 1 deleted prompt file, 1 new extension TS file, modified `README.md`, `AGENTS.md`, `CHANGELOG.md`, `package.json`.
- Working tree is clean.
- Worktree is ready for the consumer to `/skill:finishing-a-development-branch` (squash-merge to main, version bump in a separate commit).
