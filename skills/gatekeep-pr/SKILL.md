---
name: gatekeep-pr
description: Use when gating a pull request before it merges - whether you authored it or are reviewing someone else's work. Judges whether the diff delivers the mechanism each acceptance criterion needs (code, tests, docs) and conforms to the review rubric; what can be seen only after merge belongs to /skill:check-delivery. Consent-gated - every mutation (fixes, pushes, reviews, merges, tracker comments) waits for an explicit menu pick.
disable-model-invocation: true
argument-hint: "<pr> [issue-ref]  (e.g. 123, or 123 gh-45)"
---

# gatekeep-pr

Verify, don't trust: a PR description is a claim, and over-claimed coverage, hallucinated references, and "tests pass" that never ran are the normal case on generated code. Judge the mechanism only - whether code, tests, and docs at the assessed head make each promised behavior possible - and leave what can be seen only after merge (a staging run, production data, an external system) to `/skill:check-delivery`. Nothing mutates before a menu pick: steps 1-5 read, provision a worktree, and draft; fixes, pushes, reviews, comments, merges, and tracker writes happen only on explicit selection. Running the verification command executes PR code with your ambient credentials and no sandbox - gate only PRs you are willing to execute.

## Arguments

- PR number or URL; omitted -> resolved from the current branch per `verification-brief.md` Section A.
- Optional issue reference; omitted -> resolved in step 1 (`verification-brief.md` Section A) and fetched in step 2; none found -> judge the PR's stated intent only, never invent acceptance criteria.

## Steps

Verify (step 3) and Review (step 4) each run as a fresh helper with `cwd` the PR worktree - Verify first, Review after Verify's output file exists (`reference/assessment.md` `## Helpers`); the orchestrator runs every other step itself. Each step reads the sibling(s) its row names and produces exactly one output.

| Step | Read now | Output | Tracker stage |
|---|---|---|---|
| 1 Gather | `verification-brief.md` Section A | PR digest: metadata, diff, checks, comments, worktree discovery | `gather` |
| 2 Provision + configure | `reference/assessment.md` | provisioned worktree; config resolved from the merge-base; ticket fetched; AC rows extracted per `../brainstorming/reference/ticket-acceptance.md` | `provision` |
| 3 Verify | `verification-brief.md` Section B | evidence record (CI-first) and one disposition per material claim | `verify` |
| 4 Review | `verification-brief.md` Section C | reviewer findings and the internal comment ledger | `review` |
| 5 Integrate + report | `reference/findings.md`, then `reference/report.md` | AC outcomes, blockers, nits, drafted payloads, the rendered report | `report` |
| 6 Menu | `reference/decision-menu.md` | the menu under the verdict line, exactly one `[recommended]` | `menu` |
| 7 Loop | `reference/post-selection-loop.md` (a `fix` pick continues in `reference/fix-wave.md`) | the executed pick; re-entry until `merge` or `stop` | (re-opens the re-entered stage) |

Re-entry: a fix wave's own push re-enters step 4 through the own-push sequence (`reference/fix-wave.md` `## Evidence after push`, then `reference/post-selection-loop.md` `### Re-render`); any other head move re-enters step 3; an unchanged head re-enters step 5.

## Progress tracking

Use `plan_tracker`, never `phase_tracker`. `init` with the first three stages of the table. In step 3 `add` one task per material claim and record each verdict: `complete` matched, `failed` contradicted, `skipped` unverifiable-pre-merge. Once every claim is terminal and `verify` is closed, `add` the remaining three stages - the tracker rejects a verdict recorded behind a still-pending stage. A failed stage or claim stays `failed` while the skill stops at the menu. Without a `plan_tracker` tool, keep a plain checklist; behavior is unchanged.

## Harness notes

Every helper is a fresh context with `cwd` the PR worktree; its task names its output path and ends with the output contract. Every dispatch on either harness gets its own output path from `mktemp "${TMPDIR:-/tmp}/gatekeep-<role>.XXXXXX"` outside the worktree. On pi: `subagent({ agent: <persona>, context: "fresh", async: false, cwd: <worktree> })` with `worker` for Verify, `code-reviewer` for Review and the pre-push review, `implementer` for payloads; `gauntlet_setting({ key: "closureReview" })` supplies the fix-round cap. On Claude Code: the harness's subagent dispatch tool with the duty text as the prompt - Verify: `verification-brief.md` Section B; Review, pre-push review, and comment-delta review: Section C plus `review-baseline.md` (the pre-push review adds the closure-line contract); implementer: the payload task of `reference/fix-wave.md` `## Wave`; the cap is 3. A Claude Code helper inherits the session's directory, so its prompt opens with the absolute worktree path and the rule that every command runs as `git -C <worktree> ...` or `(cd <worktree> && ...)`, checks that `git -C <worktree> rev-parse HEAD` equals the head its task names (the assessed head for Verify, Review, and the comment-delta reviewer; the current wave HEAD for wave helpers) before working, and names the output path; the orchestrator awaits the tool result before reading the file. A harness with neither facility is unsupported: stop at step 3 and say so.

## Wording rules

These bind every rendered report, menu, and external payload (review bodies, replies, commit subjects, tracker comments). A `## comms style` section in the overrides file extends them.

1. One item is one or two whole sentences: what is wrong, then why it matters. No fragments, no field separators.
2. Name the behavior, not the artifact: "retries forever" beats "attempts counter not incremented".
3. Locators trail in parentheses (`file:line`, check name, doc path), never inside the sentence.
4. No category tags, severity words, or IDs in prose - the section heading is the severity, the list number is the ID.
5. Report only non-conformance; passing checks, covered ACs, and matched claims print only under `show evidence`.
6. Omit empty sections.
7. `Delivers` is always present and names which ACs this PR covers and which observable half is checked after merge.
8. The verdict is one line in the fixed form.
9. Menu rows start with a verb a human types, carry one clause of consequence, and exactly one row is `[recommended]`; compose grammar lives in the hint line only.
10. ASCII only, American English, no hedges on checked facts, no intensifiers.

## Red flags - STOP

- Any mutation (fix, push, review, comment, merge, tracker write) without an explicit menu pick - owner: the intro.
- A code or doc edit sitting in the worktree when a menu renders - except helper residue that `reference/fix-wave.md` `## Wave` names in the re-rendered menu - owner: `reference/findings.md` `## Drafted payloads`.
- Blocking on an AC's observation half, or on a PR-body claim the gate cannot check - owner: `reference/findings.md` `## AC outcomes`.
- `impossible` without all four conditions and a source read this run - owner: `reference/findings.md` `## AC outcomes`.
- Deferring behavior the ticket promises to a later PR: it is a blocker or an explicit tracker split, nothing else - owner: `reference/findings.md` `## Namespaces`.
- Reading the rubric, the verification command, or any ladder source from the PR's head instead of the base branch's merge-base - owner: `reference/assessment.md` `## Configuration`.
- Raw command output, drafted payloads, or internal IDs in the rendered report - owner: `reference/report.md`.
- An open-PR menu, other than the conflict menu, without `fix` while a helper facility exists and the fix-round cap is neither `0` nor reached (a merged or closed PR offers `show evidence` and `stop` only); any menu without `show evidence`, with two `[recommended]`, or with `stop` not last - owner: `reference/decision-menu.md`.
- A local verification run while CI is pending, or a second push inside one round - owner: `reference/fix-wave.md` `## Evidence after push`.
- The orchestrator resolving a merge conflict itself, or editing or committing a tracked file during a fix wave - owner: `reference/fix-wave.md` `## Conflicts` and `## Wave`.
- A helper's duty run in the orchestrator's own context - owner: `## Harness notes`.
- Approving your own PR - owner: `reference/decision-menu.md` `## Consent table`.
- Merging around an undispositioned failing check or a pending required check - owner: `reference/findings.md` `## Dispositions`.
- A claim verdict recorded behind a pending tracker stage - owner: `## Progress tracking`.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context - check it for project-specific routing tables, service paths, and verification commands. `## PR gate` keys are read in step 2 (`reference/assessment.md`); `## comms style` extends the wording rules.
