---
name: gatekeep-pr
description: Use when gating a pull request before it merges - whether you authored it or are reviewing someone else's work. Consent-gated - verification is read-only, every externally visible mutation (fix commits, pushes, reviews, merges) waits for explicit selection.
disable-model-invocation: true
argument-hint: "<pr> [issue-ref]  (e.g. 123, or 123 gh-45)"
---

# gatekeep-pr

Verify, don't trust. A PR description is a claim, not proof: over-claimed coverage,
hallucinated references, and "tests pass" that were never rerun are the normal case,
not the exception - especially on generated code. Gather evidence, accept green CI on
the exact assessed head as verification evidence (run the project's own verification
command only as the fallback), review the diff against a rubric, and present a
deterministic, authorship-aware menu. Authorship sets which row carries
`[recommended]`; it never changes which rows are offered.

**Consent gate.** The only actions performed before a menu row is picked are:
read-only gathering, provisioning the worktree, and applying uncommitted, worktree-local
doc-drift fixes discovered as a blocking finding. Every other action - code fixes,
pushes, reviews, comments, merges - happens only on explicit selection.

**Residual risk.** Running the verification command executes PR code with the
operator's ambient credentials. There is no sandbox. Run this skill only against PRs
you are willing to execute.

## Arguments

- PR number or URL. If omitted: `gh pr view --json number,url` on the current branch;
  no PR found there -> STOP and report.
- Optional issue reference. If omitted: infer from `closingIssuesReferences`, then
  branch name, PR title, body, or commits. None found -> judge the PR against its
  stated intent only; never invent acceptance criteria.

## Configuration resolution

Apply per concern, first match wins, evaluated unconditionally - never delegated to
a wrapper skill:

1. **Repo root `REVIEW.md`** (rubric concerns only). Wins over the shipped
   baseline and reviewer-persona defaults on any conflict.
2. **Gauntlet overrides file** (3-location discovery, first found wins): the
   `## PR gate` section (verification command, `timeout minutes`, `requires credentials`, issue
   fetch, worktree wrapper, merge policy, `local verification`, `ci checks`). An existing `## verification-before-completion`
   section is an accepted equivalent source for the verification command.
3. **Repo documentation** - an explicitly documented command or tool (e.g. `AGENTS.md`'s
   canonical test entrypoint, a documented worktree wrapper, a documented tracker CLI,
   or documented merge policy/branch rules). Reading documentation is not inference.
   Discovery-only: never tell consumers to add gatekeep-pr configuration here.
4. **Ask the user.** Never guess from lockfiles, file heuristics, or vibes.

The `## PR gate` overrides schema (all keys optional except the verification command,
which is required unless documented elsewhere):

```markdown
## PR gate
- verification command: <command>            # required unless documented elsewhere
- timeout minutes: 15                        # optional; default 15
- requires credentials: false                # optional; true => skill reports "not run" as missing evidence
- local verification: always                 # optional; default (absent) = CI-first; "always" forces the local run even when exact-head CI is green
- ci checks: <comma-separated check names>   # optional; narrows which checks count as evidence; absent = all checks on the assessed head
- worktree wrapper: <command>                # optional
- issue fetch: <command with <ref> placeholder>   # optional, replaces gh issue view
- merge policy: squash | merge-commit        # optional
```

**Thin-wrapper contract.** A consumer wrapper skill is a pure proxy: trigger phrases
plus "follow `/skill:gatekeep-pr`" - zero configuration data. All customization lives
in the repo's `REVIEW.md` (rubric) and the gauntlet overrides file's `## PR gate`
section (everything else); anything a wrapper carries beyond trigger phrases is
misplaced and belongs in one of those two homes instead.

Read the ladder from the **merge-base of the PR's base branch**, never from
the PR's head tree - a PR cannot weaken its own rubric or swap the command that will
gate it. Recipe: `MB=$(git merge-base origin/<baseRefName> <headRefOid>)`, then for
each ladder source `git show "$MB:<path>"` (e.g. `git show "$MB:REVIEW.md"`,
`git show "$MB:AGENTS.md"`). A plain cwd read (`cat REVIEW.md`, reading the file open
in the PR worktree) is invalid for any ladder source - it reads the PR's head, exactly
what this rule forbids - even when the assessment happens to run from inside the PR's
worktree. Exception: if the PR itself changes `REVIEW.md` or the overrides file, that
diff is review subject matter, surfaced as a finding - it is not applied to this run's
configuration.

## Progress tracking

Use `plan_tracker`, never `phase_tracker`. Init with the first four stages:
`gather`, `provision worktree`, `resolve evidence`, `claim-check`. While
`claim-check` is `in_progress`, `add` one task per material claim as the
Verifier enumerates them and record each verdict: a matched claim ->
`complete`, a contradicted claim -> `failed` (shown crossed, error color).
Once every claim is terminal and `claim-check` is closed, `add` `review` and
`consent menu` and continue. Never init stages ahead of the claims: the
tracker rejects a verdict recorded behind a still-pending stage. A
failed stage or claim stays `failed` while the skill stops at the menu -
never marked complete to move on. On a harness without the `plan_tracker`
tool: fall back to a plain checklist (or skip if none is available);
functionality is unchanged either way.

## Assess

Run four phases in order - gather, provision worktree, verify then review, integrate.
Read `reference/assessment.md` and `reference/findings.md` now.

## Verdict

Three states: **blocking findings** (failed gate, contradicted material claim, a
merge-proof unverifiable claim, `partial`/`missing` AC coverage, scope creep when an
issue is linked, committed doc drift, anything the merged rubric maps to blocking),
**follow-ups only** (never gate merge), or **clean**.

**Merge preconditions** (all must hold):

- gate green with every blocking finding fixed, not deferred
- verification evidence present per the brief's Evidence resolution table (a CI claim
  or a green local run - a table-sanctioned CI skip is evidence, not missing;
  "not run" blocks only when the table required a fallback run that didn't happen)
- `mergeable == MERGEABLE` (`UNKNOWN` after the one post-provision re-poll withholds
  merge, same as `CONFLICTING`)
- no undispositioned failing check in the resolved set, no pending required check
- evidence pasted with clean provenance
- worktree clean and synced with the remote head (fixes pushed first)
- explicit selection with a head compare-and-swap that passes

Define `<bin>` = `<directory of this skill's SKILL.md>/../../bin`. Merge execution
per `reference/post-selection-loop.md` `### Merge course`.

## Report

The rendered report is terse by design: deciding factor, evidence lines, ID'd
findings, menu. No restating diffs, no narration, no recap prose.

```markdown
## Outcome
<one line + the deciding factor>

## Evidence
<CI path: satisfying check name(s)/conclusion/sha/url; local path: verbatim command + raw_tail per run; claims checked; resolved-set check dispositions>

## Findings (blocking)
Blocking findings (P#):
  P1. **<source_ref>** - <defect>. Fix: <concrete change> | Action: <disposition/what unblocks>. [code | test | spec | security | performance | quality]
Requirement/doc drift (linked issue, committed doc drift, or spec conflict):
  L1. <doc-drift | spec-conflict | outdated-AC | missing-behavior> -> <action>

## Comment-thread replies
  C1. <thread ref> -> <drafted reply>  (already-addressed | reasonable | judgment-call)
  C2. <thread ref> -> <superseded by C<new> | withdrawn | pending <run url> | reviewer failed (<conclusion>) <run url>>

## Non-blocking follow-ups
  F1. **<source_ref>** - <action>. Owner: <pr-author | tracker | human>

## Decision
<action vocabulary + numbered courses>

## Drafted fixes / review
<payloads, each keyed by its finding ID>
```

Consent table and courses per `reference/decision-menu.md`.

## Decide

Render `## Decision` from the consent table for the PR's author and state. Read
`reference/decision-menu.md` now.

## Act

The menu is a state machine that loops until merge or an explicit stop. Read
`reference/post-selection-loop.md` now.

## Output done-check

Before posting or committing any externally persisted payload - review bodies,
thread replies, commit subjects, tracker comments - re-read it against:

- ASCII only: `-`, `...`, straight quotes.
- No headings or template scaffolding on payloads under ~150 words - bullets and
  prose carry short content.
- Review findings are file:line-specific where one exists, else keyed to the
  finding's `source_ref`, and end on the fix or asked action, not a recap.
- Empty sections say "None"; never invent content to fill a section.

The check governs external payloads only - the skill's own rendered report keeps
its fixed headings regardless of length. Project rules extend this list via the
overrides file - see Project overrides.

## Red flags - STOP

- Approving your own PR - owner: `reference/decision-menu.md` `## Consent table`
- Any mutation (fix, push, review, merge) without an explicit menu selection - owner: **Consent gate** (intro)
- Pasting paraphrased evidence instead of verbatim `raw_tail` - owner: `reference/assessment.md` `## Phase 4 - Integrate`
- A provenance mismatch (worktree, `run_cwd`, or `head_sha`) noticed and ignored - owner: `reference/assessment.md` `## Phase 4 - Integrate`
- Merging around an undispositioned blocking finding or failing-check `P#` - owner: `reference/findings.md` `## Dispositions`
- Reading configuration (rubric, verification command, or ladder sources) from the PR's head instead of the base branch's merge-base - owner: `## Configuration resolution`
- Renumbering or reusing a finding ID between menu rounds - owner: `reference/findings.md` `## IDs`
- Presenting findings without IDs, or a blocking verdict with no `P#`/`L#` - owner: `reference/findings.md` `## IDs`
- A `## Decision` rendered without its action vocabulary - owner: `reference/decision-menu.md` `## Actions`
- Treating `[quality]` or `[performance]` as a downgrade signal on a `P#` - only an explicit Phase-4 flaky disposition excepts a failing-check `P#` from the unfixed-blocker set, never a category tag - owner: `reference/findings.md` `## Triage`
- A course (pre-composed or custom) bundling a push-producing action with `merge-*` - owner: `reference/decision-menu.md` `## Courses`
- A pre-composed course, or a custom row, composing an action the overlay or the cell lists as unavailable - `merge-squash anyway` / `merge-commit anyway` on a reviewer-withheld merge is the sanctioned exception; GitHub-refused rows stay uncomposable - owner: `reference/decision-menu.md` `## Fork overlay`, `## Pending-reviewer overlay`
- Batching a file-less `P#` (a claim or a gate command as `source_ref`, no draft touching a file) into a parallel dispatch - a claim `P#` with a drafted file edit is worktree-fixable and batches - dispatching parallel implementers over batches that share a file, or letting a fix-wave child run git commands or a verification pass in the shared worktree, or dispatching a fix-wave child with `worktree: true` - owner: `reference/post-selection-loop.md` `### Fix wave`
- A second execution of the verification command, a second push, or pushing fix commits after a red gate, within one fix wave - re-running Verify/Review to re-confirm claims and annotate IDs is not a second gate execution - owner: `reference/post-selection-loop.md` `### Fix wave`
- Posting or committing an external payload without the output done-check - owner: `## Output done-check`

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Any sections relevant to this skill - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - override or extend the instructions above. Project-local `AGENTS.md` is already in context - check it for project-specific routing tables, service paths, and verification commands. A `## comms style` section in the overrides file extends the output done-check with project rules.
