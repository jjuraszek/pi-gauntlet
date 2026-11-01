---
name: gatekeep-pr
description: Use only when explicitly asked to gatekeep, verify, or gate a named pull request before it merges - or on pi a set of them - ("gatekeep PR 123", "gatekeep PRs 123 124 125", a loop task naming the PR and the verb); post-merge delivery proof belongs to /skill:check-delivery.
argument-hint: "[no argument: my open PRs] | <pr> [issue-ref] [--rebase [base]] | <pr> <pr>... [--rebase [base]]  (e.g. 123, 123 gh-45, 123 --rebase, 123 gh-45 --rebase release/2, 123 124 125 on pi only)"
---

# gatekeep-pr

Verify, don't trust: a PR description is a claim, and over-claimed coverage, hallucinated references, and "tests pass" that never ran are the normal case on generated code. Judge the mechanism only - whether code, tests, and docs at the assessed head make each promised behavior possible - and leave what can be seen only after merge (a staging run, production data, an external system) to `/skill:check-delivery`. Persist one course through `reference/post-selection-loop.md`'s run record; keep final merge/approval and posts separately selected. Before the initial pick, permit only provisioning and the explicit `--rebase` sync; steps 1-5 read, verify and draft. Execute later writes under a set course, terminal pick or the sync's `--rebase` authority. A menu pick authorizes every command that pick needs: run them yourself, never print a command for the human to paste. Running the verification command executes PR code with your ambient credentials and no sandbox - gate only PRs you are willing to execute.

## Arguments

- Route two or more PR tokens (numbers or URLs, space-separated, before any `--rebase`) through the set-routing row before steps 1-7; reject a positional issue reference in a set with a one-line error. Apply `--rebase [base]` to every PR in the set; keep one PR token on the single-PR path below; zero tokens discover per verification-brief.md Section A before this row runs and re-enter it with the discovered roster when the roster holds two or more; a trailing comma on a PR token is stripped before identity normalization, so a pasted discovered, smallest first: list is a valid set.
- PR number or URL; omitted -> discovered per verification-brief.md Section A during argument resolution (my open PRs in origin: authored or directly requested, no drafts or decided PRs, smallest first); one match gates on this path, two or more re-enter the set-routing row on pi and stop with the discovered list on Claude Code.
- Optional issue reference; omitted -> resolved in step 1 (`verification-brief.md` Section A) and fetched in step 2; none found -> select the scope contract in step 2 (spec at the head, else the PR's stated intent), never invent acceptance criteria.
- Optional `--rebase [base]`, parsed after `<pr> [issue-ref]`: the token after it, when present, is the base branch name (`123 --rebase gh-45` means base `gh-45`, not an issue ref); absent, the base is the digest's `baseRefName`. Step 2b fetches `origin/<base>` and validates it: a missing ref stops with a one-line error before any rebase or push. Without `--rebase` the run performs no additional fetch, rebase, or push before a menu pick and renders no sync line.

## Steps

Verify (step 3) and Review (step 4) each run as a fresh helper with `cwd` the PR worktree - Verify first, Review after Verify's output file exists (`reference/assessment.md` `## Helpers`); the orchestrator runs every other step itself. Each step reads the sibling(s) its row names and produces exactly one output.

| Step | Read now | Output | Tracker stage |
|---|---|---|---|
| Set routing | `reference/batch.md` | pi-only admission and isolated per-PR assessment, summary, queued menus, and execution for two or more PRs; return through that procedure | - |
| 1 Gather | `verification-brief.md` Section A | PR digest: metadata, diff, checks, comments, worktree discovery | `gather` |
| 2 Provision + configure | `reference/assessment.md` | provisioned worktree; config resolved from the merge-base; ticket fetched; the `scope` block selected (spec rows and `design`, or stated intent) | `provision` |
| 2b Sync (only with `--rebase`) | `reference/sync.md` | the PR worktree on the rebased, pushed head with a refreshed digest, or a `sync` record and the unsynced head, or a rebased, unpushed head (`rebased locally`, `complete`) | `sync` |
| 3 Verify | `verification-brief.md` Section B | evidence record (CI-first) and one disposition per material claim | `verify` |
| 4 Review | `verification-brief.md` Section C | reviewer findings and the internal comment ledger | `review` |
| 5 Integrate + report | `reference/post-selection-loop.md` `### Pre-menu refresh`, then `reference/findings.md`, then `reference/report.md` | AC outcomes, blockers, nits, drafted payloads, the rendered report | `report` |
| 6 Menu | `reference/decision-menu.md`, then `reference/menus.md` | initial for a repairable or pending-only not-ready first report, obstacle for undispositionable BLOCKED even with course unset, final for first-report readiness or a readiness exit, assess terminal after assess, obstacle at obstacle/cap, or the matching terminal/contract-exception template; exactly one `[recommended]` | `menu` |
| 7 Loop | `reference/post-selection-loop.md` (delivery continues in `reference/fix-wave.md`) | the fixed delivery body until readiness, obstacle or cap; terminal picks and contract decisions through `reference/menus.md`; re-entry until stop | (re-opens the re-entered stage) |

Re-entry: a fix wave's own push re-enters step 4 through the own-push sequence (`reference/fix-wave.md` `## Evidence after push`, then `reference/post-selection-loop.md` `### Re-render`); any other head move re-enters step 3; an unchanged head re-enters step 5 through `reference/post-selection-loop.md` `### Pre-menu refresh`. A loop re-entry never re-runs step 2b; the sync runs once per invocation.

## Progress tracking

Mint and initialize the continuation record before progress initialization (`reference/post-selection-loop.md` `### Continuation record`). Use `plan_tracker`, never `phase_tracker`. `init` with the first three stages of the table, four when `--rebase` is present (`gather, provision, sync, verify, ...`); `reference/sync.md` closes `sync` before step 3 starts - `complete` after a push, a `no-op`, or a rebased, unpushed head (`rebased locally`), `skipped` when step 3 runs unsynced, `failed` on a terminal stop. In step 3 `add` one task per claim whose evidence is the head's source and record its verdict: `complete` matched, `failed` contradicted, `skipped` unverifiable-pre-merge. Leave claims `pending` on CI outside the tracker for now; close `verify`. From then on, `add` each later stage (`review`, `report`, `menu`, ...) only when it starts, never ahead of time. When the claim-check-only helper runs after a green watch, `add` one task per pending claim then and record its verdict in the same step. A failed stage or claim stays `failed` while the skill stops at the menu. Without a `plan_tracker` tool, keep a plain checklist; behavior is unchanged.

## Harness notes

Every helper is a fresh context with `cwd` the PR worktree; its task names its output path and ends with the output contract. Every dispatch on either harness gets its own output path from `mktemp "${TMPDIR:-/tmp}/gatekeep-<role>.XXXXXX"` outside the worktree. On pi: `subagent({ agent: <persona>, context: "fresh", async: false, cwd: <worktree> })` with `worker` for Verify, `wave-reviewer` for Review and the pre-push review, `implementer` for payloads; `gauntlet_setting({ key: "closureReview" })` supplies the fix-round cap. On Claude Code: the harness's subagent dispatch tool with the duty text as the prompt - Verify: `verification-brief.md` Section B; Review, pre-push review, and comment-delta review: Section C plus `review-baseline.md` (append `reference/fix-wave.md` `## Re-review task` for the pre-push review and ancestor step-4 review, on both harnesses); implementer: the payload task of `reference/fix-wave.md` `## Wave`; sync conflict stop: the task `reference/sync.md` `## Conflict stop` builds; sync review: Section C plus `review-baseline.md` with the `## Review before push` subject, no closure lines; the no-tool accounting fallback is `2 x 5`. A Claude Code helper inherits the session's directory, so its prompt opens with the absolute worktree path and the rule that every command runs as `git -C <worktree> ...` or `(cd <worktree> && ...)`, checks that `git -C <worktree> rev-parse HEAD` equals the head its task names (the assessed head for Verify, Review, and the comment-delta reviewer; the current wave HEAD for wave helpers) before working, and names the output path; the orchestrator awaits the tool result before reading the file. For description recheck on pi, use the fresh worker duty in Section B with mode `description recheck`; on Claude Code, use Section B's separate recheck duty as the native helper prompt. Both tasks supply actual body/head, affected claim IDs, existing evidence, and the affected-only disposition/closure contract, never the CI-emitting claim-only contract. A harness with neither facility is unsupported: stop at step 3 and say so - at step 2b, before any sync write, when `--rebase` was passed (`reference/sync.md`).

## Wording rules

These bind every rendered report, menu, and external payload (review bodies, replies, commit subjects, tracker comments). A `## comms style` section in the overrides file extends them.

1. One item is one or two whole sentences: what is wrong, then why it matters. No fragments, no field separators.
2. Name the behavior, not the artifact: "retries forever" beats "attempts counter not incremented".
3. Locators trail in parentheses (`file:line`, check name, doc path), never inside the sentence.
4. No category tags, severity words, or IDs in prose - the section heading is the severity, the list number is the ID.
5. Report only non-conformance; passing checks, per-row AC outcomes, and matched claims print only under `show evidence`; `Delivers` names the covered and settled rows.
6. Omit empty sections.
7. `Delivers` is always present and names which spec rows this PR covers, which are `deferred per spec`, `deviates per spec`, or `elsewhere per spec`, and which observable half is checked after merge.
8. The verdict is one line in the fixed form.
9. Menu rows start with a verb selected numerically, carry one clause of consequence, and exactly one row is `[recommended]`; typed evidence/reply/check commands live in the hint line only.
10. ASCII only, American English, no hedges on checked facts, no intensifiers.

## Red flags - STOP

- A mutation without a set course, a terminal pick, or the sync's `--rebase` authority - owner: `reference/post-selection-loop.md` `### Continuation record`.
- A code or doc edit sitting in the worktree when a menu renders - except helper residue that `reference/fix-wave.md` `## Wave` names in the re-rendered menu - owner: `reference/findings.md` `## Drafted payloads`.
- Blocking on an AC's observation half, or on a PR-body claim the gate cannot check - owner: `reference/findings.md` `## AC outcomes`.
- Judging a ticket row the spec does not carry, or treating a spec `deferred: <ref>` row as a gap - owner: `reference/findings.md` `## AC outcomes`.
- Reading the rubric, the verification command, or any ladder source from the PR's head instead of the base branch's merge-base - owner: `reference/assessment.md` `## Configuration`.
- Raw command output, drafted payloads except the exact description consent preview, or internal IDs in the rendered report - owner: `reference/report.md`.
- A menu rendered under deliver before an exit condition, other than the contract-exception template; a menu not rendered from `reference/menus.md`, two recommendations, stop not last or no show evidence hint - owner: `reference/menus.md`.
- `cleanup` rendered on a non-terminal template, or cleanup steps 2-4 run on non-final stop - owner: `reference/cleanup.md` `## Non-final stop`.
- A CI watch outside D3 step 4 or before the first report, or a second push inside one iteration - owner: `reference/post-selection-loop.md` `### Next action`.
- The orchestrator resolving a merge conflict itself, or editing or committing a tracked file during a fix wave - owner: `reference/fix-wave.md` `## Sync` and `## Wave`.
- A helper's duty run in the orchestrator's own context - owner: `## Harness notes`.
- Approving your own PR - owner: `reference/decision-menu.md` `## Availability`.
- Merging around an undispositioned failing check or a binding pending check, or a `BLOCKED`/`UNKNOWN`/`unreadable` merge state - owner: `reference/findings.md` `## Dispositions`.
- A menu rendered without the pre-menu refresh - owner: `reference/post-selection-loop.md` `### Pre-menu refresh`.
- Reading `mergeStateStatus` from anything but a `gh pr view` invocation, attributing a `BLOCKED` to a named rule, or treating a non-`BLOCKED` value as a merge verdict - owner: `verification-brief.md` Section A.
- A claim verdict recorded behind a pending tracker stage - owner: `## Progress tracking`.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context - check it for project-specific routing tables, service paths, and verification commands. `## PR gate` keys are read in step 2 (`reference/assessment.md`); `## comms style` extends the wording rules. `## cleanup` steps run on the `cleanup` pick (`reference/cleanup.md`).

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
