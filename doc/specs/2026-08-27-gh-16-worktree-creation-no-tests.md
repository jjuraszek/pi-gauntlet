# using-git-worktrees: creation never runs tests - non-dirty base replaces the full-suite baseline

Ticket: [jjuraszek/pi-gauntlet#16](https://github.com/jjuraszek/pi-gauntlet/issues/16)

## Problem

`skills/using-git-worktrees/SKILL.md` Step 3 ("Verify Clean Baseline") instructs every entry path - fresh manual creation (Steps 2b-2d), native/wrapper creation (Step 1a), and the already-in-a-worktree path (Step 0) - to run the project's full test suite (`make ci`, `pnpm test`, `uv run pytest`, `bundle exec rspec`, `cargo test`, `go test ./...`) before any work starts. On real projects this is minutes of CI-grade execution paid at worktree-creation time, for a guarantee ("the base is sound") that a much cheaper check delivers: the base is the intended ref and the source checkout is clean.

## Change

One-file prose edit to `skills/using-git-worktrees/SKILL.md`, in-place and surgical (approach A: Step 3 keeps its number and position; every section not named in the edits below stays byte-identical). No other file changes.

### 1. Step 3 becomes "Verify Clean Base"

Delete the six-command table and its pass/fail branch. Replace with:

- **When and where the check runs.** The check targets the *source* checkout and executes **before creation** on the fresh paths (see edit 2a below), so pre-existing dirt is caught before any branch, commit, or worktree exists:
  - Fresh creation (Steps 1a/2 paths): bare `git status --porcelain` in the source checkout, run before invoking the wrapper (1a) or before the Step 2b `git worktree add` sequence. No `$ROOT` plumbing or `git worktree list` derivation needed - pre-creation, the current directory *is* the source checkout. Step 3's section body defines the check; Steps 1a/2b carry a one-line pointer to run it first (edit 2a).
  - Already-linked path (Step 0): the same check against the current worktree, on arrival at Step 3.
- **Cleanliness semantics.** Bare `git status --porcelain` - untracked files count as dirty. Never `--untracked-files=no` / `-uno` (AC1 is explicit; other skills' `-uno` usage is deliberately not copied here). Empty output means clean only when the command exits 0; a nonzero exit is an error to surface, never treated as clean.
- **Clean** -> proceed (create, then Step 4).
- **Dirty** -> report the porcelain output verbatim and ask whether to clean up first (stash/commit) or proceed - the same report+ask shape the old test step used. Never run tests as a fallback; never auto-stash or auto-clean. Because the check runs pre-creation, a user who *meant* the dirt to be part of the base simply commits it and creation proceeds from the new HEAD - no abort/recreate path needed. The rationale differs per path: on fresh paths the ask is about base hygiene; on Step 0 the ask is "continue working in a dirty workspace?" (the dirt is already in the workspace, not merely beside it).
- **Provenance note (report-only, never a gate).** Fresh-creation paths only - never Step 0 (an already-linked worktree was branched in some earlier invocation; there is no "created from" to compare this run). Resolve the default branch as `git symbolic-ref --short refs/remotes/origin/HEAD` with the leading `origin/` stripped; compare that short name to the source checkout's `git branch --show-current`. If they differ and the user did not name a base in the request, append one declarative line to the Step 4 report: `Note: branching from <ref>, not <default>.` - execution continues, no confirmation is awaited. If resolution fails (no remote, no `origin/HEAD`), skip the note silently. No other default-branch machinery.

### 2. Step 0 / Step 1a / Step 2b pointers and ordering

- **2a.** Step 1a gains one line: run the Step 3 clean-base check in the source checkout *before* invoking the wrapper. Step 2b likewise: run it before the `git worktree add` sequence.
- **2b.** Step 0's pointer parenthetical retitles from "(Verify Clean Baseline)" to "(Verify Clean Base)". Step 1a's bare "skip to Step 3" pointer text is unchanged (it carries no parenthetical today; the retitle is vacuous there).
- **2c.** Step 2b's gitignore commit becomes pathspec-limited: `git commit -m "Ignore .worktrees/" -- .gitignore`. Today's unrestricted `git commit` absorbs the entire staged index; on the proceed-with-dirt path that would silently fold the user's staged changes into the "Ignore .worktrees/" commit.

### 3. Step 4 report

`Baseline: <test-result>` becomes one of two forms - `Base: <ref> (clean)` when porcelain was empty, or `Base: <ref> (dirty - proceeded after ask)` when the user chose to proceed - plus the provenance note line when it fired (fresh paths only). `<ref>` per path: fresh creation, the branch/commit the worktree was created from (the user-requested base when one was given); Step 0, the current branch/HEAD of the existing worktree, with no provenance line.

### 4. Quick Reference

The row `Tests fail at baseline | Report + ask` becomes `Source checkout dirty | Report + ask`.

### 5. Red Flags

- `Tests fail at baseline and you proceed anyway` becomes `Source checkout dirty and you proceed without asking`.
- Add: `About to run a test suite during worktree creation`.

### Untouched

- Step 2c setup commands (`npm install`, `cargo build`, `uv sync`, ...) - installs and builds are not tests; the ban covers test-suite execution only.
- "Keeping a Worktree Current" rebase-time re-testing - explicitly out of scope per the issue; a separate policy decision.
- Step 2c setup remains where it is (after creation); only the cleanliness check moves pre-creation.
- Sandbox fallback (2d), detached-HEAD section, Integration section, Project overrides block.

## Edge cases

- **Detached HEAD**: the existing section already gates before creation; the provenance note never fires there (no branch to compare).
- **No remote / unresolvable default branch**: provenance note silently skipped; cleanliness check unaffected.
- **Wrapper-created worktree with cwd already switched**: moot - the check runs before the wrapper is invoked, while cwd is still the source checkout.
- **Porcelain command fails (nonzero exit)**: surface the error and stop; never classify a failed check as clean.
- **Dirty new worktree**: out of scope - it is empty at creation by construction.
- **Origin freshness** (behind/diverged vs `origin/<default>`, fetch-before-create): out of scope per the issue; local cleanliness is the only gate.
- **Consumer repos wanting different behavior**: gauntlet overrides file, no generic-skill accommodation (existing override block already covers this).

## Verification

- `npm test` (repo validator: frontmatter, package integrity, extension tests) - it does not assert skill prose, so the content checks below carry the ACs.
- AC5 grep gate, deliberately narrower than the issue's literal "grep for 'test' in creation steps returns none": within the creation-scoped sections of `skills/using-git-worktrees/SKILL.md` (Steps 0-4, Quick Reference, Red Flags), zero hits for `make ci|pnpm test|uv run pytest|bundle exec rspec|cargo test|go test` and no *instruction to execute* a test suite. A bare word-grep for "test" is unsatisfiable and wrong: two in-scope occurrences are intentional exemptions - Step 1a's existing "Isolated dev/test DB provisioning" bullet (a wrapper capability description, untouched) and the new Red Flag "About to run a test suite during worktree creation" (a prohibition, not an instruction). Implementers and conformance checks must not reword either to chase the literal grep. "Keeping a Worktree Current" is exempt entirely (rebase-time re-testing, out of scope).
- AC6 walk-through: a manual read of the three entry paths (fresh manual, wrapper/Step 1a, already-linked/Step 0) confirming each reaches Verify Clean Base and issues zero test-execution commands. A read-through, not new machinery.
- No new test files, no CI changes.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none (the skill body is the implementation surface here, not a doc-impact entry)
- Derived / memory docs invalidated: none (README and AGENTS.md do not describe Step 3's internals; grep confirms the baseline-test wording exists only in this one skill file)

## Supersession

None. No prior spec governs `using-git-worktrees`; nothing to mark.

## Out of scope (restated)

- Origin-freshness / fetch-before-create policy.
- Rebase-time re-testing in "Keeping a Worktree Current".
- Any edit outside `skills/using-git-worktrees/SKILL.md`.
