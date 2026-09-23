# gatekeep-pr: decision menu

Read from SKILL.md `## Decide`. `## Decision` in the report has two parts: the
action vocabulary, then the numbered courses.

## Actions

```markdown
Actions (compose freely in the custom row):
  fix <P#s|all>    apply blocking fixes in worktree, re-run gate, push  (in-repo PRs only)
  push-docs        push already-applied doc-drift edits                 (only when uncommitted
                                                                        reviewed doc edits exist
                                                                        in the worktree)
  merge-squash | merge-commit                                          (preconditions per Verdict;
                                                                        never bundled with a push,
                                                                        except the telemetry: restore commit)
  merge-squash anyway | merge-commit anyway                            (custom row only: overrides a
                                                                        reviewer-withheld merge - the literal
                                                                        `anyway` accepts the named reason;
                                                                        GitHub-refused rows stay uncomposable)
  wait             poll the reviewer run and comment set, then re-render
  request-changes | review-comment | approve                           (approve: never own PR)
  reply <C#s>      post drafted thread replies
  tracker <act>    tracker action                                      (only when a tracker tool resolved)
  stop             leave the PR as-is / report-only exit
```

A `+ tracker <act>` suffix is available on any mutation course when a tracker tool
resolved.

Selection grammar: ID sets accept `all`, ranges (`P1-P4`), comma lists
(`P1,P3`), and exclusions (`all but P2`).

## Consent table

Deterministic - this table is the golden-scenario oracle.

| Author | State | Offered rows (first = `[recommended]`) |
|---|---|---|
| you | clean / follow-ups only | merge (squash); merge (merge-commit); do not merge (leave it); post no-blockers comment |
| you | blocking | apply code fixes (named finding subset): skill edits in worktree, commits, re-runs gate, pushes - then merge re-offered; push applied doc fixes; do not act; post review-comment of findings |
| someone else | clean / follow-ups only | approve; merge (squash, offered-unrecommended); post no-blockers comment |
| someone else | blocking | post request-changes review; apply fixes on their branch (courtesy option 2); reply to existing threads; post comment |
| bot author | any | someone-else's rows for the same state, review actions recommended |
| fork (any) | any | post review (request-changes / comment / approve per state) - push and merge rows absent |
| any | draft PR | assessment rows only; merge and approve rows absent until ready-for-review |
| any | merged / closed | report-only; no mutation rows |

This table is the single oracle for what is offered; `## Courses` renders its
rows as actions and numbered courses. Rows GitHub would refuse (branch protection,
missing permissions, `viewerPermission` too low) render listed-but-unavailable with
the reason. Approving your own PR is never offered. Nothing executes until explicit
selection. The fork, pending-reviewer, and CI-check overlays below modify the cell's rows; they are never a second offer source.

## Courses

A normative rendering of the consent table (never a second offer source): per
author x state cell, exactly one `[recommended]` course renders first, the custom
row renders last. Courses are atomic across pushes: no course, pre-composed or
custom, bundles a push-producing action (`fix`, `push-docs`) with `merge-*`; after
a fix wave the menu re-renders with merge as row 1 unless withheld (`reviewer still running` / `comments not refreshed`).

| Author | State | Courses (first = `[recommended]`) |
|---|---|---|
| you | clean / follow-ups only | 1. merge-squash; 2. merge-commit; 3. stop; 4. review-comment (post no-blockers note) |
| you | blocking | 1. fix (worktree-fixable P#s only - `all` covers only those) [+ push-docs when uncommitted doc edits exist]; 2. push-docs (alone, when doc edits exist); 3. stop; 4. review-comment (post findings). When no P# is worktree-fixable (blocking is failing-check-only or L#-only), course 1 (fix) does not render: push-docs becomes first when doc edits exist, else stop is first |
| you | blocking, post-fix re-render (gate green, preconditions hold) | 1. merge-squash; 2. merge-commit; 3. stop; 4. review-comment |
| someone else | clean / follow-ups only | 1. approve; 2. merge-squash (offered-unrecommended); 3. review-comment (no-blockers note) |
| someone else | blocking | 1. request-changes; 2. fix all (courtesy, their branch - omitted when nothing is worktree-fixable); 3. reply <C#s> (omitted when no replyable `C#` exists - `findings.md` `## IDs`; `reply all` and ranges skip non-replyable rows); 4. review-comment |
| bot author | any | someone-else's rows for the same state; review actions recommended |
| any | draft | 1. request-changes / review-comment / reply <C#s> (omit the reply course when no replyable `C#` exists) / stop - `[recommended]` follows the same authorship rule as the non-draft cells, except on your own draft PR `request-changes` is never recommended (you cannot request changes on your own PR any more than you can approve it); the fallback recommendation there is `review-comment` when findings exist, else `stop`. Custom present but cannot compose `merge-*`/`approve`/`fix`/`push-docs` until ready-for-review |
| any | merged / closed | 1. stop; report-only, no other mutation courses at all; Custom present but cannot compose `merge-*`/`approve`/`fix`/`push-docs`/`request-changes`/`review-comment`/`reply`/`tracker` - nothing remains actionable |

## Fork overlay

The consent-table fork row renders as an overlay on the authorship cells
(push/merge/fix absent; approve also dropped when the viewer authored the PR) - it
is not a distinct authorship cell. It overlays the applicable authorship cell (you
or someone else), removing `fix`, `push-docs`, and `merge-*` (never available on a
fork). When you authored the fork PR, `approve` is also dropped (never offered on
your own PR) - fork|you|clean renders `review-comment`/`stop` only; fork|you|blocking
renders `request-changes`/`review-comment`/`stop` (the someone-else courtesy
fix-on-their-branch course is also absent, since it is your own PR). A fork PR
authored by someone else uses the someone-else cells with `fix`/`push-docs`/
`merge-*` removed.

## Pending-reviewer overlay

While any `C#` row is `pending`, a reviewer run on the assessed head is
queued/in progress, or the last comment refetch failed
(`post-selection-loop.md` `### Re-render`), every pre-composed
`merge-squash` / `merge-commit` course renders listed-but-unavailable with
the reason: `reviewer still running` or `comments not refreshed`. This is a
menu-level gate modelled on the `flaky` disposition's custom-row path, never
a `## Verdict` precondition: `### Merge course` does not refuse the override.
Only the custom row's `merge-squash anyway` / `merge-commit anyway` executes
merge in that state, under the normal Merge course rules. Apply the comment-delta consent and incomplete-review rules in `post-selection-loop.md` `### Compare-and-swap` and `### Re-render`; `anyway` does not bypass an unreviewed delta or a blocking finding.

`wait` is `[recommended]` in cells whose recommended course would otherwise
be `merge-*` or `approve` (clean / follow-ups only, and the post-fix
re-render); in blocking cells the existing first course (`fix`,
`request-changes`) stays recommended and `wait` renders as row 2. Draft and
merged/closed cells do not offer `wait`. A `reviewer failed (<conclusion>)`
row changes nothing: the cell renders as it would without it.

The overlay applies on the initial assessment too: a PR gated while the
reviewer is mid-run withholds pre-composed merge from the first menu.

Precedence: when the CI-check gate below also applies, its rendering wins -
merge rows are absent and the CI-check gate line names both reasons.

## CI-check gate

An undispositioned failing check in the resolved set, or a pending required check,
withholds every pre-composed course containing `merge-*` (merge preconditions per
SKILL.md `## Verdict`) - none render, whatever the author/state cell says.
Disposition and pending-check definitions per `findings.md` `## Dispositions`.

| Disposition | Merge courses |
|---|---|
| Flaky | Not restored to a pre-composed course; merge proceeds only via the custom row naming the disposition explicitly |
| Real, or an unresolved pending check | Withheld until the check is green |
| CI-infrastructure-broken | Withheld until the triggered fallback run is green |

A pending-only render is not itself a blocking verdict (findings groups can all
read "None"); the recommended course falls to `stop` or `review-comment` in the
meantime. This never falls through to the clean cell's recommended `merge-squash` -
a failing resolved-set check or a pending required check means the PR is not in the
clean state to begin with.

## Fixtures

Refused rows render per `## Consent table`. Zero mutation courses is a legal
render (merged/closed) - the menu still appears, carrying findings and `stop`.

Example render (golden fixture 1 - own PR, blocking findings including committed
doc drift, so uncommitted reviewed doc edits exist):

```markdown
Pick one:
  1. fix all (P1-P10) + push-docs   [recommended]
  2. push-docs (docs only, hold code fixes)
  3. stop (leave as-is)
  4. review-comment (post findings, act later)
  5. Custom - compose: e.g. "fix P1-P8,P10 + push-docs" or "reply C1 + tracker comment"
```

Golden fixture 2 - the post-fix re-render after course 1's gate re-run passes,
with the sticky reviewer bot mid-run and one independently edited comment:

```markdown
## Comment-thread replies
  C1. <thread ref> -> superseded by C3
  C2. <thread ref> -> superseded by C4
  C3. <thread ref> -> pending  https://github.com/<owner>/<repo>/actions/runs/<run-id>
  C4. <thread ref> -> <drafted reply>  (reasonable)

Pick one:
  1. wait   [recommended]
  2. merge-squash   (unavailable: reviewer still running)
  3. merge-commit   (unavailable: reviewer still running)
  4. stop (leave as-is)
  5. review-comment
  6. Custom - compose: e.g. "merge-squash anyway" or "reply C4"
```

Golden fixture 3 - the same PR after `wait` completes. (a) The run concluded
`failure` and the bot rewrote its comment to the error header:

```markdown
## Evidence
  reviewer check <name> failed - inert (reviewer failure never withholds)

## Comment-thread replies
  C1. <thread ref> -> superseded by C3
  C2. <thread ref> -> superseded by C4
  C3. <thread ref> -> superseded by C5
  C4. <thread ref> -> <drafted reply>  (reasonable)
  C5. <thread ref> -> reviewer failed (error)  https://github.com/<owner>/<repo>/actions/runs/<run-id>

Pick one:
  1. merge-squash   [recommended]
  2. merge-commit
  3. stop (leave as-is)
  4. review-comment
  5. Custom
```

(b) The run concluded `success`; the reviewer check moved from pending to
`success` in the refreshed rollup and the comment carries the verdict. Reconcile C5 against source at the assessed head. For a confirmed retry bug missed by the previous source review, mint source-backed P11 and withhold merge; C5's triage label remains verdict-neutral:

```markdown
## Findings (blocking)
Blocking findings (P#):
  P11. **<source_ref>** - Retry attempts never increment. Fix: increment attempts on failure and throw after the retry limit. | Action: fix P11. [code]
## Comment-thread replies
  C1. <thread ref> -> superseded by C3
  C2. <thread ref> -> superseded by C4
  C3. <thread ref> -> superseded by C5
  C4. <thread ref> -> <drafted reply>  (reasonable)
  C5. <thread ref> -> <drafted reply>  (reasonable)
Pick one:
  1. fix P11   [recommended]
  2. stop
  3. review-comment
  4. Custom
```

When source review instead disproves C5's concern, mint no `P#` and retain the clean menu:

```markdown
## Comment-thread replies
  C1. <thread ref> -> superseded by C3
  C2. <thread ref> -> superseded by C4
  C3. <thread ref> -> superseded by C5
  C4. <thread ref> -> <drafted reply>  (reasonable)
  C5. <thread ref> -> <drafted reply>  (judgment-call)

Pick one:
  1. merge-squash   [recommended]
  2. merge-commit
  3. stop (leave as-is)
  4. review-comment
  5. Custom
```

Golden fixture 4 - last premerge refetch finds a new human comment after merge consent. Reconcile it against source at the assessed head, abort that merge even when the concern is false, and show the refreshed menu for a new selection. A same-head identical-body timestamp edit mints the next `C#` but causes no repeat source review or test run. A bot placeholder or error header keeps its existing state and does not enter source review.
