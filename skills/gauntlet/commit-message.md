# Commit messages

Read this reference at every framework commit site. Derive wording here; keep return attribution and accounting in their owning ledger or return file, never in the message.

## Subject

Write one imperative sentence stating what the commit changes for a reader who has not seen the code. Capitalize its first word and omit the trailing period. Use at most 72 characters, excluding a trailing ticket or pull request reference.

Keep file paths, code identifiers and commit ids out of the subject. Use ledger row numbers only in the fixed bookkeeping sentences below. Never start a subject with a framework label (`loop:`, `amend:`, `grant:`, `plan:`, `resume:`, `fix:`, or another framework-internal word followed by a colon). Apply the project's subject convention from the repo's agent instructions on top of these rules.

Resolve the bound ticket once at the committing skill or dispatcher:

| Flow | Ticket source |
|---|---|
| Spec, amendment, plan, loop, wave, verification repair, finish | The spec header's `**Ticket:**` line; carry the same value in the plan header |
| Gatekeep | The carried spec's `**Ticket:**` line, else the ticket the roster row already takes from the pull request title or body's first line under the overrides `refs:` convention |
| Hotfix | The ticket named in the handoff record |
| Housekeeping | The ticket named on the card |

Use `none` when the source has no value; never guess a ticket. Put the bound ticket on the landed message, pull request title and every worker, wave, spec and amendment commit, in the place and form named by the overrides `## Issue tracker` `refs:` line. Without that convention, append `(ref <ticket-id>)` to the subject. With no bound ticket, add no reference. Put no ticket reference on ledger bookkeeping commits.

For worker dispatches, resolve this file to an absolute path relative to the installed file that links to it. Pass `wording: <absolute path>` and `ticket: <reference or none>` in the task. As the worker, read the supplied file and use the supplied ticket; never derive the ticket yourself. On an unreadable wording file, write one plain imperative sentence naming what the commit changes and continue. Inspect no subject at run time for attribution, admission or accounting.

## Body

Leave the body empty or write whole sentences saying what changed and why. Keep `pending:` lines, `iteration:` lines, ledger rows and decision lines out of it. Preserve record lines only for the spec commit's council audit and the amendment commit's audit rows. Allow Git trailers such as `Co-authored-by:`.

## Landed message

Use this shape for finish's squash, the gatekeep merge and the hotfix squash. Use the same subject for the pull request title; apply the ticket rule above.

```text
<subject>

<one paragraph, at most three sentences: what changed for the user and why>

- <outcome: one in-scope acceptance row restated as something observed>
- <at most five outcome bullets total>
```

Combine related acceptance rows into one bullet rather than adding a sixth. For a hotfix, use the handoff's fault story as the paragraph and omit bullets. End a coordinated companion squash with `Home: <repo> <shared branch>`, without a spec path. Keep the list of companion squash ids in the home squash's body.

Example:

```text
Count imported plants in compliance pagination (ref E-1234)

Compliance pages skipped plants that exist only in the dedicated import,
so page counts disagreed with totals. The query now includes them.

- Page counts match the plant total for single-company views
- Imported profile answers appear on the plant's compliance page
```

## Word sources

Take the words from the source for the commit situation, then apply the subject and body rules.

| Situation | Word source |
|---|---|
| Loop worker, row target | The target acceptance row in the spec: what this commit makes true, or the part a failed attempt built; never that the attempt failed |
| Loop worker, seed target | The checks added or recorded, in the spec's terms |
| Verification repair worker | The failing check repaired |
| Gatekeep fix row or helper | The finding closed |
| Hotfix seed or row | The fault under repair, from the handoff record |
| Spec commit | The spec's H1, shortened to fit: `Add the <topic> spec` |
| Companion spec file commit | The same subject as the home spec commit |
| Amendment commit | `Amend the spec for <first item title, shortened to fit>`, adding ` and <N-1> more` for N > 1 within the subject limit |
| Plan commit | `Add the implementation plan for <spec H1, shortened to fit>` |
| Plan task and wave commit | The wave's task titles in the plan, as one sentence naming what the wave delivers |
| Housekeeping class commit | The card's title |
| Conformance gap fix commit | The gap's title: what the fix makes true |
| Convergence repair commit | The failing commands and review findings repaired, as one sentence |
| Whole-diff minors fix commit | The selected Minor findings, as one sentence |
| Member pull request merge commit | The member pull request's title, shortened to fit, with a trailing `(#<N>)` |
| Base-sync merge commit | The fetched base being integrated: `Sync with the fetched base` |
| Landed message and pull request title | The spec's `**Goal:**` line and in-scope acceptance rows; without a spec, the pull request's title and description |
| Hotfix landing and hotfix pull request | The fault story in the handoff record |

### Fixed bookkeeping sentences

Use these subjects verbatim, substituting only the named values. Read no spec inside the loop to compose them. Use the amendment pattern above for an amendment or cut, not a bookkeeping label.

| Event | Subject |
|---|---|
| Ledger skeleton | `Start the acceptance ledger` |
| Retry | `Grant acceptance row <n> one more attempt` |
| Allowance raise | `Raise the attempt allowance by <n>` |
| Escalation | `Escalate acceptance row <n> to the stronger model` |
| Row repair, validation miss or interrupted | `Record a failed attempt on acceptance row <n>` |
| Seed repair | `Record a failed baseline attempt` |
| Verification repair marker | `Record a verification repair` |
| Companion row record | `Record the <repo> result for acceptance row <n>` |
| Companion seed record | `Record the <repo> baseline` |
| Consent change | `Change the standing amendment consent` |
| Verification-produced changes | `Keep the changes the verification run produced` |
| Worktree directory ignore | `Ignore the worktree directory` |
| Plan citation repair | `Repair <n> plan citations` |

Retain the fixed-text subjects `Remove ephemeral plan doc`, `Release <version>` and `wave integrated snapshot` at their existing sites.

## Squash-default note

Read `gh api repos/<owner>/<repo> --jq .squash_merge_commit_message` once for finish's pull request options and the gatekeep merge. In gatekeep, add the field to the existing repository-settings read instead of making a second request.

On `COMMIT_MESSAGES`, print exactly this line:

```text
Note: this repo's squash default (squash_merge_commit_message: COMMIT_MESSAGES) pastes every branch commit into the landed message when someone merges from the GitHub button; set it to PR_BODY or BLANK in the repo settings to stop that.
```

On any other value or a failed read, print nothing. Never write a repository setting.
