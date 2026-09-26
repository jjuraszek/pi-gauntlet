# gauntlet-handoff: gauntlet-owned producer of `## Process state`, one brief contract shared with gauntlet-resume

> **Superseded by:** [doc/specs/2026-09-25-resume-spec-seed.md](./2026-09-25-resume-spec-seed.md) - the "`.md` token is a brief-file, never widened to a scan" classification rule only

Ticket: https://github.com/jjuraszek/pi-gauntlet/issues/40
Cohort counterpart: https://github.com/jjuraszek/pi-cohort/issues/18 (flow-agnostic `handoff` skill with an append seam)
Supersedes: `doc/specs/2026-09-17-gh-31-gauntlet-resume.md`, sections `### Argument grammar` (zero-argument form) and `### Cohort drift verification` (provenance).

**Goal:** A human-only skill `gauntlet-handoff` writes the `## Process state` section of a handoff brief in the package that owns the trackers, by appending to the brief that pi-cohort's `handoff` skill wrote. Producer and consumer (`gauntlet-resume`) read one file for the grammar - `skills/gauntlet-resume/reference/brief-contract.md` - and CI proves neither SKILL.md inlines it. `gauntlet-resume` gains a zero-argument form that lists the briefs in the shared default directory and lets the human pick.

## Why

pi-cohort 7.0.2's `/handoff` prompt emits `## Process state` (tracker output, `Active task:`, the gate-history line) although only pi-gauntlet knows what those mean; #18 removes that from cohort and leaves the section to a caller who appends after `## Skills loaded`. Without a gauntlet producer, briefs lose process state the moment #18 ships. Producing it in gauntlet and keying both roles on one contract file is what makes "the same template" a checked property rather than a convention.

## Stated assumptions (cohort #18, per the user; not yet on cohort `main`)

- The cohort skill is invoked as `/skill:handoff [--out <path> | --key <name>]`. `--out` is a full path; `--key <name>` writes to `<tmpdir>/pi-handoff/<name>.md`. The two are exclusive.
- `<tmpdir>` is Node's `os.tmpdir()` (resolved cross-platform with `node -p "require('os').tmpdir()"`; `${TMPDIR:-/tmp}` on POSIX).
- The skill writes six headings (`# Handoff:`, `## Intent`, `## Repo state`, `## Decisions`, `## Open questions`, `## Skills loaded`) and nothing after `## Skills loaded`; callers may append further `##` sections; the file is truncated on each run.
- `## Repo state` fields are unchanged from `brief-contract.md` (`toplevel`, `worktree`, `branch`, `HEAD`, `base`, `dirty`, `diff-stat`, `test cmd`).

If any assumption turns out false when #18 lands, the reconciliation point is `brief-contract.md` (grammar) and the "Resolve the target" step of `gauntlet-handoff` (path rule) - nowhere else.

## Design

### Components

| Component | Change |
|---|---|
| `skills/gauntlet-resume/reference/brief-contract.md` | stays the single grammar file; gains a `## Producers` paragraph with the byte layout; provenance and consumer lines rewritten |
| `skills/gauntlet-handoff/SKILL.md` | new; human-only producer; cites the contract, inlines no grammar |
| `skills/gauntlet-resume/SKILL.md` | zero-argument scan-and-pick row and brief-path classification rule in `## Arguments`; description and `## Overview` say "a `gauntlet-handoff` brief" instead of "pi-cohort's `/handoff`"; `## Entry checks` and `## Dispatch` unchanged |
| `scripts/ci.mjs` | drift lint, ownership-boundary assertions, path-discipline check for `gauntlet-handoff`, pack assertion extended |
| `README.md` smoke checklist | producer-to-consumer walkthrough, release-gated |
| `README.md`, `AGENTS.md`, `CHANGELOG.md` | see Documentation impact |

### brief-contract.md

Head of file becomes: consumed by `gauntlet-resume/SKILL.md` and `gauntlet-handoff/SKILL.md`; grammar lives only here. Provenance: coupled to pi-cohort's `handoff` skill (pi-cohort #18) for exactly six headings, listed literally - `# Handoff:`, `## Intent`, `## Repo state`, `## Decisions`, `## Open questions`, `## Skills loaded` - and the `## Repo state` fields; `## Process state` grammar and its consumer rules are owned here (the "Consumer rules (cohort)" label becomes "Consumer rules"). The presence column drops "both tracker tools exist" (the producer owns the tools) and reads: only when a phase is `in_progress` and no hotfix flow is in context. Add `## Producers`:

> `gauntlet-handoff` is the only writer of `## Process state`; it appends to the file cohort's `handoff` skill wrote, which ends at `## Skills loaded`. Layout: one blank line, the heading on its own line, a blank line, the `phase_tracker status` output verbatim, a blank line, the `plan_tracker status` output verbatim, a blank line, `Active task: <name|none>`, then `Gate history not restored - re-validate before advancing.` - unfenced, nothing after.

No grammar changes otherwise. Headings, `formatStatus` output, `Active task:`, the gate-history line, and the parse stops stay as written.

### gauntlet-handoff/SKILL.md

Frontmatter: `name: gauntlet-handoff`, `description` (human-only producer that appends gauntlet process state to a cohort handoff brief; CI and pi's skill loader both require it), `disable-model-invocation: true`, `argument-hint: "[--out <path> | --key <name>]"`. Runs in the main loop - tracker state is extension state no subagent can read. Ends with the standard Project overrides block.

Sequence, in order; every STOP prints the offending path or fact and writes nothing further:

1. **Resolve the target.** Both `--out` and `--key` given -> STOP (exclusive in cohort's grammar). `--out <path>` -> resolve to an absolute path against the session cwd; that is the expected path and the form passed to cohort. Otherwise the key is `--key <name>` if given, else derived from the **run worktree**: the path a flow skill reported as `Worktree ready at <path>` in this transcript (the same evidence cohort's snapshot uses), `git -C <run worktree> branch --show-current`. No run worktree in the transcript -> the session cwd branch, but if that branch is the repository default (`git symbolic-ref --short refs/remotes/origin/HEAD` minus `origin/`) or HEAD is detached -> STOP asking for `--key` or `--out` (a default-branch key would collide across flows). The derived key has every `/` replaced by `-` (`hotfix/x` -> `hotfix-x`), so the file always lands flat in the default directory. Expected path = `<tmpdir>/pi-handoff/<key>.md`, `<tmpdir>` via `node -p "require('os').tmpdir()"`. This step is the one place gauntlet restates cohort's default-path rule; step 3 verifies it.
2. **Invoke cohort.** `/skill:handoff` with `--out <absolute path>` or `--key <key>` as resolved in step 1. The skill must be present in the session skill list under `name: handoff`; absent (pi-cohort not installed, or a version that ships only the `/handoff` prompt) -> STOP: "cohort `handoff` skill not in the session skill list - install or upgrade pi-cohort to the release that ships pi-cohort #18". No version lookup (the skill may not name another package's install path), no fallback to `/handoff`.
3. **Verify the file.** Expected path missing, or line 1 not starting `# Handoff:` -> STOP with the expected path.
4. **Refuse a double section.** File already has a line matching `^## Process state\s*$` -> STOP: "the installed pi-cohort still writes process state itself - upgrade to the release that ships #18".
5. **Hotfix exclusion.** If `skills/chase-bug/hotfix.md` is in this session's context, append nothing and report a plain hotfix handoff - checked before the trackers, because chase-bug never touches tracker state and a stale armed flow would otherwise be appended and steer resume away from its hotfix route.
6. **Append.** `phase_tracker({ action: "status" })` and `plan_tracker({ action: "status" })`. If a phase is `in_progress`, append the section per `brief-contract.md` `## Producers` (layout fixed there): both status outputs verbatim (`No plan active.` verbatim when there is no plan), `Active task: <first → task name, else none>`, the gate-history line. Verify/ship in progress append as-is (resume already stops at verify). No phase `in_progress` -> append nothing and say the brief is a plain handoff.
7. **Report.** Print the path and `/skill:gauntlet-resume <path>`; when a section was appended and the brief's `worktree:` field is `no`, print `/skill:gauntlet-resume <path> <run worktree>` instead, because resume's entry check 2 needs the override.

The body cites `../gauntlet-resume/reference/brief-contract.md` for every heading and line. It may name the heading inline (step 4 detection) but never carries the grammar lines the drift lint guards.

### gauntlet-resume/SKILL.md

`## Arguments` gains:

| Form | Meaning |
|---|---|
| (no tokens, no pasted text) | discovery: `<tmpdir>` via `node -p "require('os').tmpdir()"`; candidates are the regular files directly under `<tmpdir>/pi-handoff/` ending `.md` (non-recursive) whose line 1 starts `# Handoff:`; sorted by mtime, newest first; displayed one per line as `<n>. <title line> - <worktree: field value> - <mtime ISO-8601>` with `worktree: unavailable` when the field is absent; the human picks `<n>` (a single candidate is still confirmed); none -> STOP "no handoff briefs found under <tmpdir>/pi-handoff" |

Classification of a single token, before anything else: a token that is an absolute path, contains a path separator, or ends in `.md` is a `<brief-file>` - never a worktree name, never widened to a scan; missing, unreadable, or line 1 not `# Handoff:` -> STOP with that path. Any other single token is tried as `<worktree>`. A picked or given brief then runs entry checks 1-5 unchanged, so a stale or foreign-repo brief stops there. The "anything else -> run brainstorming" row stays for free-form text.

### scripts/ci.mjs

- **Drift lint** (grammar lines, not mentions). Three line-anchored patterns - `^## Process state\s*$`, `^Active task: `, `^Gate history not restored - re-validate before advancing\.$` - each match in exactly one file under `skills/**`, and that file is `skills/gauntlet-resume/reference/brief-contract.md`. Inline mentions of the heading (resume's Dispatch row, `reconstruction.md`, gauntlet-handoff's step 4) are routing references and stay legal. `skills/gauntlet-handoff/SKILL.md` and `skills/gauntlet-resume/SKILL.md` each contain the literal `reference/brief-contract.md`. Negative check: a temp copy of `gauntlet-handoff/SKILL.md` with a standalone `## Process state` line inserted must fail the lint function.
- **Ownership boundary** on `skills/gauntlet-handoff/SKILL.md`, via the existing `[file, token, present]` assertion table: present `phase_tracker`, `plan_tracker`, `reference/brief-contract.md`, `/skill:handoff`; absent `node_modules/pi-cohort`, `.pi/agent`, and any line-anchored core heading (`^## (Intent|Repo state|Decisions|Open questions|Skills loaded)\s*$`) - the skill delegates the core brief, never copies it.
- **Path discipline.** The stage-skill roster in `scripts/stage-skill-lint.mjs` is unchanged (gauntlet-handoff is not a stage skill); `ci.mjs` runs the same banned-token list (`cd `, `--show-toplevel`, "switch into the worktree") over `skills/gauntlet-handoff/SKILL.md` as a dedicated assertion.
- `npm pack` contents assertion includes `skills/gauntlet-handoff/SKILL.md`.

## Error handling and edge cases

- Rerun on the same key: cohort truncates and rewrites; gauntlet appends once. Step 4 catches any cohort that stops truncating.
- Several `→` tasks in the plan: `Active task:` is the first, matching resume's "else the first in-progress task". `No plan active.` -> `Active task: none`.
- Substep appears as `name(substep)` inside the verbatim phase output; no extra field.
- Slash-bearing branches (`hotfix/<slug>`, `feat/x`): flattened to `-` by gauntlet before the key reaches cohort, so the default file is always a direct child of `pi-handoff/` and the non-recursive scan finds it. A human-given `--key` is passed verbatim; if cohort nests or rewrites it, step 3 stops on the expected path and the human uses `--out`.
- Session in the primary checkout with a flow in `.worktrees/<branch>` (the normal case): key is the worktree branch, and cohort (#17, shipped in 7.0.1) records `worktree: yes <path>` from the transcript, so resume's entry check 2 passes without an override. Step 7 covers the `worktree: no` case.
- Hotfix handoff while the trackers still show an armed flow from earlier in the session: step 5 wins; no section, resume takes the `chase-bug` route.
- Windows: path from `os.tmpdir()`; separators left to Node; listing sorts by mtime, never by name.
- A listed candidate with `## Repo state: not a git repo` is shown; resume's entry check 2 handles it after the pick.
- tmp volatility (briefs vanish on reboot/cleanup) is accepted; `--out` is the escape hatch.
- Transition window (#18 unmerged, or gauntlet upgraded before cohort): gauntlet-handoff stops at step 2 or 4; the old `/handoff` prompt keeps working for resume. No dual-mode support.

## Testing

Deterministic, in `scripts/ci.mjs` via `npm test`: the drift lint with its negative check, the ownership-boundary assertions, the path-discipline assertion, the pack assertion, plus the existing skill frontmatter lint.

Release-gated smoke walkthrough, added to the README smoke checklist and run by a human against the pi-cohort release that ships #18 before this package's release notes claim the pair works (until then the CHANGELOG entry says "requires pi-cohort >= <release shipping #18>" and the walkthrough result is recorded in the release commit body):

1. Implement phase with tasks `complete`/`in_progress`/`pending` in a `.worktrees/<branch>` flow, session in the primary checkout: `/skill:gauntlet-handoff` writes `<tmpdir>/pi-handoff/<branch>.md` with six core headings then `## Process state` last; fresh session `/skill:gauntlet-resume <path>` restores implement with the three statuses and ends `Gate history not restored; re-validating <task> before any stage advance`.
2. Plan phase, `No plan active.`: brief keeps that line, `Active task: none`; resume restores phase-only with no `plan_tracker init`.
3. Hotfix context with non-pending trackers: brief ends at `## Skills loaded`; resume takes the `chase-bug` route.
4. Fresh session, zero arguments: listing shows the briefs from 1-3, pick restores; `/skill:gauntlet-resume /nonexistent.md` STOPs naming that path without listing anything.
5. Branch `hotfix/x`: default file is `pi-handoff/hotfix-x.md` and appears in the zero-argument listing.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (explicit-invocation roster and count gain `gauntlet-handoff`; handoff/resume pair and the `<tmpdir>/pi-handoff/<key>.md` convention; minimum pi-cohort version once #18 releases), `CHANGELOG.md` (new `## Unreleased` bullet linking #40 and pi-cohort #18), `skills/gauntlet-resume/reference/brief-contract.md` (provenance + `## Producers`), pi-cohort's handoff skill doc gains one line that consumers may append `##` sections and pi-gauntlet does (cross-repo contract; lands with #18)
- Derived / memory docs invalidated: `AGENTS.md` Routing row for resume becomes the handoff/resume pair; `doc/specs/2026-09-17-gh-31-gauntlet-resume.md` carries the supersession banner

Categories per `reference/documentation-impact.md` (brainstorming skill).

## Out of scope

- A cohort `--template` parameter or any change to the six core headings.
- Exporting gate history, `plan_check` stamps, or fix-round evidence.
- Changes to resume's `## Entry checks` or `## Dispatch`.
- A repo-local default output dir; `--out` covers users who need durability.

## Open questions

- Minimum pi-cohort version for the README and CHANGELOG lines: known only when #18 releases; the STOP messages name #18 rather than a version, so only the doc lines are filled at release time.
