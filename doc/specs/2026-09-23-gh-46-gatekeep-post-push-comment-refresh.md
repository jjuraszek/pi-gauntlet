# gatekeep-pr: refresh and re-triage PR comments after a push, withhold merge while the reviewer bot runs

Ticket: [jjuraszek/pi-gauntlet#46](https://github.com/jjuraszek/pi-gauntlet/issues/46)

Amends: `doc/specs/2026-08-18-gh-9-gatekeep-pr-skill.md` (comment gather/triage and post-selection re-review), `doc/specs/2026-08-20-gatekeep-pr-output-density.md` (section 5a re-review by ID). Both carry a supersession banner scoped to those sections.

## Problem

`skills/gatekeep-pr` snapshots PR comments once, in the Section A gather (`verification-brief.md`, digest field `comments: { inline[], top_level[], review_threads[]? }`, no per-comment identity). After a fix-wave push, `reference/post-selection-loop.md` `### Re-render` re-runs the claim-check and Review against the new head but never refetches comments. A sticky reviewer bot (claude-code-action in `use_sticky_comment` mode, verified in its `create-initial.ts`: it finds its previous comment and rewrites it in place via `updateComment`) first replaces its verdict with an in-progress placeholder, then with a new verdict on the new head. The gate sees neither: the menu offers merge against the pre-push comment set.

Two compounding gaps make the withheld state unreachable today:

- The digest has no `id` or `updated_at`, so even a refetch could not tell an edited comment from an untouched one.
- The evidence table (`verification-brief.md` "Evidence resolution") excludes pending checks from the CI-sufficient predicate. A green sibling check satisfies evidence while the reviewer workflow still runs, so nothing else withholds merge.

The ticket's walkthrough is constructed from documented behavior, not a captured incident; the gap is confirmed from the source files above.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#46, `## Acceptance criteria`, rows verbatim:

- [ ] `skills/gatekeep-pr/SKILL.md` Post-selection loop step 3 states that, after a fix-wave push (or any head move), the re-check re-fetches inline review comments and top-level comments with the same paginated calls Section A uses, and re-runs Section C comment triage over the fresh set; the verification command remains not re-executed.
  in-scope (reading: the post-selection loop lives in `skills/gatekeep-pr/reference/post-selection-loop.md` since the #43 split; the edit lands there, `SKILL.md` keeps its pointer - see Design "File ownership")
- [ ] The re-triage rule names `updated_at` and the comment id: a comment unchanged since the gather digest is re-triaged against the new head under its existing `C#`; a comment whose `updated_at` differs from the digest, or whose id is absent from the digest, appears under a new `C#` with a freshly computed label and a regenerated reply, and its pre-push label is not shown; a comment present in the digest but absent from the fresh fetch is rendered as `withdrawn` under its existing `C#`.
  in-scope (reading: "the gather digest" is the current digest - the baseline advances after every refetch, so a second round diffs against the first round's fresh set; identity is kept in the `C#` ledger - see Design "`C#` ledger and lifecycle")
- [ ] A comment whose body is claude-code-action's sticky in-progress placeholder (the skill names the body literally) is rendered in `## Comment-thread replies` as `pending` with no drafted reply and no triage label.
  in-scope (reading: the placeholder body carries a per-run URL, so the skill names the stable first line `Claude Code is working` and matches on that prefix - see Design "Placeholder detection")
- [ ] SKILL.md's golden fixture for the post-fix re-render (currently "Golden fixture 2") shows a `C#` line for a comment edited after the push and a `pending` line for a placeholder comment.
  in-scope (reading: Golden fixture 2 lives in `skills/gatekeep-pr/reference/decision-menu.md` since the #43 split; the edit lands there)
- [ ] `verification-brief.md` Section A records `updated_at` per inline and per top-level comment in the `comments` digest so the comparison in the second criterion has a baseline.
  in-scope
- [ ] `CHANGELOG.md` `## Unreleased` carries an entry for this change ending `(#46)`.
  in-scope (reading: `CHANGELOG.md` currently starts at `## v5.18.0 - 2026-09-23`; this change adds the `## Unreleased` heading above it)

### Deviation from the ticket body

The ticket's `Out of scope` list excludes withholding merge on a pending placeholder and any waiting/polling for the bot. The author overrode both in the questionary: the reviewer's verdict on the new head is part of the gate, so a `pending` placeholder withholds merge, and a `wait` course follows the run to completion. Rationale: a `pending` row above an available merge option is easy to miss, and the evidence table already lets a green sibling check carry merge while the reviewer runs. The ticket's other exclusions stand: no other bots' placeholder conventions, no second execution of the verification command in the post-push re-render. The compare-and-swap placeholder check before a merge executes is the only post-refetch consistency the design offers.

## Design

### File ownership

| Concern | File |
|---|---|
| Per-comment `id` / `updated_at` in the digest; `gh run view` / `gh run list` added to the fixed command set; `pending` and `reviewer failed` rendering rules beside the triage labels; reviewer-check exception in Evidence resolution | `skills/gatekeep-pr/verification-brief.md` Section A (command set, digest schema), Section B (Evidence resolution), Section C (comment triage) |
| Refetch, diff, re-triage step in the post-push re-render; placeholder check in compare-and-swap; `wait` course execution | `skills/gatekeep-pr/reference/post-selection-loop.md` `### Compare-and-swap`, `### Re-render`, and a new `### Wait course` |
| `C#` ledger and lifecycle: unchanged / superseded / withdrawn / pending / reviewer failed; verdict-neutral sentence amended; reviewer-check exception in Dispositions | `skills/gatekeep-pr/reference/findings.md` `## IDs` and `## Dispositions` |
| `wait` action, `anyway` override grammar, pending-reviewer overlay in the consent table, CI-check gate precedence, Golden fixture 2 extension, new Golden fixture 3 | `skills/gatekeep-pr/reference/decision-menu.md` |
| Report heading `## Comment-thread replies`, Red flag exception for the `anyway` override, action summary | `skills/gatekeep-pr/SKILL.md` (pointer-level; no rule duplicated) |
| Release note | `CHANGELOG.md` `## Unreleased` |

No new file, no new settings key, no extension or bin change.

### Digest identity (Section A)

Every entry under `comments.inline[]` and `comments.top_level[]` records `id` and `updated_at` from the REST payload the existing `--paginate` calls already return. `review_threads[]` stays as today (resolution flags only); `C#` identity comes from inline and top-level comment ids, so a thread's inline comments are diffed once, as inline comments. Digest schema line becomes:

```text
- comments: { inline[ { id, updated_at, ... } ], top_level[ { id, updated_at, ... } ], review_threads[]? }
```

The ~200 KB truncation rule now truncates bodies only: every fetched comment keeps its `id` and `updated_at` entry, so identity coverage is complete whenever the paginated calls complete. A fetch whose pagination fails part-way is a refetch failure (below), never a partial digest.

Section A's fixed command set gains two read-only commands, orchestrator-owned:

```bash
gh run view <run-id> -R <owner/repo from the URL> --json status,conclusion,workflowName   # per placeholder row with a parsed run URL
gh run list -R <owner/repo> -w <workflowName> -c <headRefOid> --json databaseId,status,conclusion,url   # reviewer run on the assessed head
```

### Placeholder detection (Section C)

A comment - inline or top-level - whose body's first line starts with the literal `Claude Code is working` is claude-code-action's in-progress placeholder (the producer posts the same body as a sticky top-level comment and as an inline review reply). The skill names the prefix and one clause of reason: the rest of the body carries a per-run URL, so only the first line is stable. The producer source (`src/github/operations/comments/common.ts`, `createCommentBody`: `Claude Code is working…` with U+2026, spinner image, `I'll analyze this and get back to you.`, `[View job run](<url>)`) is recorded here, not in the skill. No author heuristic; other bots' placeholders are out of scope.

Detecting a placeholder (initial triage or refetch) triggers one `gh run view` for its parsed `[View job run](<url>)`; the result decides the row's state:

| Observation | Row state | Withholds pre-composed merge |
|---|---|---|
| run `status != completed`, or no parsable URL, or `gh run view` failed | `pending` | yes |
| run completed with any conclusion other than `success` (`failure`, `timed_out`, `cancelled`, `action_required`, ...) while the prefix persists | `reviewer failed (<conclusion>)` | no |
| body first line starts with `**Claude encountered an error` (the producer's failure header, which replaces the placeholder on an ordinary failure) | `reviewer failed (error)` | no |
| run completed `success` while the prefix persists | `pending` until the body changes or one `wait` deadline expires, then `reviewer failed (stale placeholder)` | yes, then no |

`pending` and `reviewer failed` rows carry the `C#`, thread ref, state, and run URL; neither a drafted reply nor a triage label. A failed reviewer is information, never a withhold.

**Reviewer run on the new head.** The placeholder is written from inside the reviewer's job, so a refetch seconds after a push sees the pre-push verdict unchanged while the run is still queued. To cover that window: when a comment whose first line starts with `Claude Code is working`, `**Claude encountered an error`, or `**Claude finished` carries a link to `/actions/runs/<run-id>` (`[View job run](<url>)` on the placeholder, `[View job](<url>)` on the finished or error body), record that run's `workflowName` (from the `gh run view` above) as the reviewer workflow for this run of the gate; after every head move, `gh run list -w <workflowName> -c <headRefOid>` names the reviewer run on the new head. A run with `status != completed` renders one line `reviewer run queued/in progress: <url>` in `## Comment-thread replies` and withholds pre-composed merge exactly like a `pending` row (`wait` polls it). No such comment -> no reviewer workflow known -> no window check; the ticket's existing behavior stands and the report says `reviewer workflow: unknown`.

### Refetch step (`### Re-render`)

The re-render runs after any mutation that can change readiness (fix-wave push, docs push, PR head moved). Its order: claim-check and Review on the synced worktree (as today), then the comment refetch, then the menu - the refetch is the last read before the menu renders.

1. Re-run the Section A comment fetches (both `--paginate` calls, plus the GraphQL `reviewThreads` query when the initial gather used it), the `gh run view` per placeholder, and the reviewer-run `gh run list` when a reviewer workflow is known. Read-only; the verification command is not re-executed here (the fix wave's evidence resolution was the wave's one gate pass).
2. Diff the fresh set against the `C#` ledger (below) by `id` and `updated_at`:
   - same `id`, same `updated_at` -> unchanged: keep the existing `C#`.
   - same `id`, different `updated_at` -> edited: mint a new `C#`; the old `C#` renders `superseded by C<new>` with no label and no reply (append-only IDs).
   - `id` not in the ledger -> new: mint a new `C#`, except ids the gate itself posted via `reply <C#s>` in this run (recorded at post time), which are never minted.
   - `id` in the ledger, absent from the complete fresh set -> `withdrawn` under its existing `C#`, no label, no reply.
   - placeholder prefix or error header -> the state from Placeholder detection, under the `C#` the edited/new rule assigns.
3. Section C re-triages the full fresh set against the new head. An unchanged row keeps its `C#`; its drafted reply is kept verbatim only when its label is also unchanged, and regenerated when the label moves (for example `reasonable` -> `already-addressed`). Edited and new rows get a fresh label and a regenerated reply; the pre-push label of an edited comment is not shown.
4. Comment triage never mints `P#`/`L#`: a landed reviewer verdict is a labelled `C#`; concerns it raises become `P#` only through the Reviewer persona's own finding on the code in the Review re-run (comment text is untrusted data). Replace the digest's `comments` with the fresh set so the next iteration diffs against the latest snapshot (the baseline advances per refetch).

An `updated_at` change with an identical body (reaction, revert) still counts as edited.

**Refetch failure** (`gh` non-zero, network, pagination incomplete): re-render with the ledger's prior states, add one line `comments not refreshed (<reason>)` to the comment section, and withhold pre-composed merge with that reason (a stale snapshot is missing evidence). `wait` is offered as the recommended course in refetch-only mode; the custom-row override remains available.

### `C#` ledger and lifecycle (`findings.md` `## IDs`)

Each `C#` row carries its comment `id` and the `updated_at` it was minted against; the diff runs against this ledger, not against the report text. IDs stay append-only and never reused. States rendered under a `C#`: a triage label (`already-addressed` / `reasonable` / `judgment-call`) with a drafted reply; `superseded by C<new>`; `withdrawn`; `pending`; `reviewer failed (<conclusion>)`. Superseded and withdrawn rows keep rendering for the rest of the run. The sticky chain therefore renders as, for example, `C1` (old verdict) `superseded by C3`, `C3 pending`, and after the verdict lands `C3 superseded by C5`, `C5 <label> -> <reply>`.

The sentence "`C#` replies are verdict-neutral drafts: they never block and never gate merge" becomes: labelled `C#` rows are verdict-neutral and never gate merge; the `pending` state, a queued/in-progress reviewer run, and a failed refetch withhold pre-composed `merge-*` courses at the menu level (per `decision-menu.md`), and are not `## Verdict` preconditions. `SKILL.md`'s report heading `## Comment-thread replies (existing discussion - verdict-neutral)` drops the parenthetical to match.

The last four states carry no reply and are not replyable: `reply all` and ranges skip them silently, an explicitly named non-replyable `C#` is refused with its state named and the menu re-renders, and reply courses are omitted when no replyable `C#` exists (replacing the current "omitted when the `C#` group is None").

### Reviewer check exception (Section B, `findings.md` `## Dispositions`)

claude-code-action's sticky mode runs on `pull_request` events, so its job is also a check run on the head. Without an exception the unamended Failed CI row mints a `P#` for the failed reviewer and the CI-check gate withholds merge - the outcome Q2 forbids. Rule: a resolved-set check whose run id (from its `url` / `detailsUrl`) equals a `reviewer failed` row's run id, or whose `workflowName` equals the recorded reviewer `workflowName` while that run is `reviewer failed`, is inert for both the evidence predicate and the merge decision - provided it is the only failing check mapping to that run id; when two or more failing checks map to one run id, none is inert and each stays a `P#` (fail-safe): no `P#`, one `## Evidence` line `reviewer check <name> failed - inert (reviewer failure never withholds)`. Unrelated failing checks and GitHub-enforced restrictions (required-check branch protection) are untouched - GitHub may still refuse the merge, and the row then renders listed-but-unavailable with GitHub's reason as today. With no sibling `success` after the exception, the table resolves to the Fallback row (local run), not Failed CI.

### Merge withhold and `wait` course (decision menu)

- **Withhold.** While any `C#` row is `pending`, a reviewer run on the assessed head is queued/in progress, or the last refetch failed, every pre-composed `merge-squash` / `merge-commit` course renders listed-but-unavailable with the reason (`reviewer still running` / `comments not refreshed`). This is a menu-level gate modelled on the `flaky` disposition's custom-row path, never a `## Verdict` precondition, so `### Merge course` does not refuse the override. Precedence: when the CI-check gate (pending required check) also applies, its rendering wins - merge rows are absent and the CI-check gate line names both reasons.
- **Override grammar** (`## Actions`): `merge-squash anyway | merge-commit anyway` - the custom row composes the merge action with the literal `anyway`, which names the withheld reason as accepted. It executes under the normal Merge course rules (salvage, `--match-head-commit`). `SKILL.md`'s Red flag "a custom row composing an action the overlay or the cell lists as unavailable" gains the exception: `anyway` on a reviewer-withheld merge is the sanctioned path; GitHub-refused rows stay uncomposable.
- **Compare-and-swap.** Before a merge executes (plain or `anyway`), the existing compare-and-swap adds one comment refetch with placeholder detection and the reviewer-run check. A newly `pending` row, a queued run, or a failed refetch (`comments not refreshed (<reason>)`) refuses a plain merge and re-renders; `anyway` proceeds and prints what it overrode.
- **`wait` action and overlay.** New action `wait             poll the reviewer run and comment set, then re-render`. The consent table gains a pending-reviewer overlay beside the fork and CI overlays: `wait` is `[recommended]` in cells whose recommended course would otherwise be `merge-*` or `approve` (clean / follow-ups only, and the post-fix re-render); in blocking cells the existing first course (`fix`, `request-changes`) stays recommended and `wait` renders as row 2. Draft and merged/closed cells do not offer `wait`.
- **`wait` execution** (`### Wait course`): a sequence of short bounded calls, never one long bash call - each iteration runs `gh run view -R <repo> <run-id> --json status,conclusion` for every tracked run (placeholder-linked and head-listed) plus, when any row has no parsable URL or its run is completed while the prefix persists, one comment refetch; then sleeps 30 s. The orchestrator checks the deadline (resolved `timeout minutes`, default 15, the same knob as the local verification run) between iterations. Stop when every tracked run is completed and no row is in the "completed `success`, prefix persists" state, or the deadline passes. Then: re-fetch `statusCheckRollup`, `headRefOid`, `state`, `mergeable` for the assessed head and re-resolve the Evidence table on the fresh rollup; run the verification command only when the re-resolved table selects the Fallback row and no evidence exists yet for this head (the Pending row never ran it) - otherwise the existing evidence stands (head unchanged, Stale head row does not fire); run the Refetch step; re-render the comment section, evidence, and menu (no claim-check or Review re-run - the head did not move). On timeout: rows in the completed-`success`/prefix-persists state become `reviewer failed (stale placeholder)` (per the placeholder table); every other `pending` row stays `pending`, merge stays withheld, `wait` is row 1 again, then the cell's courses, then Custom.
- The two existing sentences "after a fix wave the menu re-renders with merge as row 1" (`decision-menu.md` `## Courses`) and "Merge, if now available, renders as row 1" (`post-selection-loop.md`) gain "unless withheld (`reviewer still running` / `comments not refreshed`)".

These rules apply on the initial assessment too: a PR gated while the reviewer is mid-run withholds pre-composed merge from the first menu.

### Fixtures (`decision-menu.md`)

Golden fixture 2 (post-fix re-render) gains the comment section above its menu, showing the sticky chain `C1 superseded by C3` and `C3 pending <run url>`, plus an independent edited comment `C2 superseded by C4` and `C4 <label> -> <reply>`; its menu renders `wait [recommended]` first and both merge rows listed-but-unavailable with `reviewer still running`. Golden fixture 3 (new) has two parts on the same PR after `wait` completes: (a) run concluded `failure`, comment rewritten to the error header: `C3 superseded by C5`, `C5 reviewer failed (error)`, `## Evidence` line naming the inert reviewer check, merge-squash back as row 1; (b) run concluded `success`, the reviewer check moves from pending to `success` in the refreshed rollup, `C5 <label> -> <reply>` carries the verdict, merge-squash row 1.

### Out of scope

Other bots' placeholder conventions; withholding merge on a `reviewer failed` row; re-executing the verification command in the post-push re-render, or after `wait` when evidence for the head already exists; overriding GitHub-enforced merge restrictions; CI probes over the new prose (no executable path exists, `npm test` static lint stays the regression check).

## Verification

- `npm test` green (skill lint, stage-skill lint, marketplace reference integrity, changelog/version check with the new `## Unreleased` heading present).
- Read-through of Golden fixture 2 and 3 (both parts) against the consent table, the pending-reviewer overlay, and the rules above; the fixtures are the oracle.
- `scripts/ci.mjs` post-selection-loop probes (telemetry salvage call, same-line no-delete rule) still match after the `### Re-render` edit.
- `rg -ni "jjuraszek|/Users/[^/]+" skills/` returns nothing new.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` (`## Unreleased` entry ending `(#46)`); `skills/gatekeep-pr/SKILL.md` only where its `## Act` / `## Decide` summary or report template enumerates actions or `C#` states
- Derived / memory docs invalidated: none (skill bodies are implementation surface per `reference/documentation-impact.md`)

## Open questions

None blocking. Unverified at authoring: whether `statusCheckRollup` exposes the check run's `detailsUrl` for every check type (the reviewer-check exception matches by run id first and falls back to `workflowName` equality, so a missing URL degrades to the name match, not to a blocked merge).
