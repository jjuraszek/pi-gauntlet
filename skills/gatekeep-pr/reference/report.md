# gatekeep-pr: step 5 - report

Read from SKILL.md step 5, after `findings.md`. Input: the integration output. Output: the rendered report, then the menu (`decision-menu.md`). SKILL.md `## Wording rules` bind every line.

## Order

Render bottom-up for a terminal: least important first, verdict and menu last. Empty sections are omitted - never "None". A failed comment refresh, an incomplete comment source review (`post-selection-loop.md` `### Re-render`), a blocked or unknown merge state, or a binding pending check renders its one line under `PR comments` as well.

Section order is fixed:

```
Delivers: <one sentence: what the PR does. With a ticket, a second sentence built from these clauses in
          order, each present only when it applies: coverage ("The PR covers the whole <ref>" | "covers
          AC1-2 of <ref>" | "covers none of <ref>'s ACs"); split ("AC3 belongs to <split ref>");
          observation ("AC4's observable half (<what>) is checked after merge, not here"); joined with
          semicolons.>

Ticket changes:          (one item per unresolved `impossible` row)
- AC<n> asks for <X>, and <cited constraint>. Proposed wording: "<new AC text>". (drafted | proposed <comment url>; <source>)

PR comments:             (replyable review comments, a pending reviewer run, a blocked or unknown merge state, a binding pending check, a failed refresh, or an incomplete source review - see the paragraph above)
- <reviewer>'s comment on <topic> <verdict clause>, so the drafted reply <what it says>. (<locator>)
- The reviewer run is still in progress, so merge waits. (<run url>)
- <the line from decision-menu.md `## Withhold reason resolver`>

Nits:
- <1-2 sentences>. (<file:line>)

Blockers:                (numbered; menu picks reference these numbers)
1. <1-2 sentences: what is wrong, why it matters>. (<file:line> | <check name> | <doc path>)

Sync: <one whole sentence from the digest's sync field; only when --rebase was passed>

Verdict: mergeable - <evidence clause> | fixable - <N> blockers | fixable - <withhold reason>

<menu>
```

The `Sync:` line renders only when `--rebase` was passed, as one whole sentence built from the digest's `sync` field (for example `Sync: rebased a1b2c3d..e4f5a6b onto origin/main, one stop resolved in src/parser.ts and src/parser.test.ts.`). SKILL.md wording rule 5 (passing facts only under `show evidence`) does not apply to it: it names the resolved files even when the sync succeeded.

## Verdict

Two states: `mergeable` or `fixable`. `mergeable` carries the evidence clause from `findings.md` `## Provenance`: `CI green on the assessed head (<check name>)` or `verification command passed locally`. `fixable - <N> blockers` when `Blockers` is non-empty; `fixable - <withhold reason>` when it is empty but a merge prerequisite is unmet: `ticket change pending on AC<n>` (for example `ticket change pending on AC4`), `reviewer run in progress`, `binding check pending`, `blocked by GitHub`, `merge state unknown`, `failed gate` (listed for spec parity; a red gate mints a blocker per `findings.md` `## Namespaces`, so `Blockers` is non-empty), `comments not refreshed`, `comment source review incomplete`, `verification not run` (the command needed credentials or no command resolved, with nothing else blocking), `mergeable unknown`, `behind base`, `merge conflict` (for `mergeable == CONFLICTING`).

`<N> blockers` reads `1 blocker` for one.

## What stays out

Verbatim command output stays in its `log_path` file and never prints; `show evidence` prints its `show evidence: <log_path>` line instead. CI run URLs and conclusions (the pending-reviewer locator in `PR comments` is the one URL that prints in the report), drafted edits, drafted replies, matched claims, covered ACs, internal IDs, and disposition annotations print only under the `show evidence` pick. A clean run with a linked ticket renders `Delivers`, the verdict line, and the menu - about four lines.

`show evidence` prints, in this order: the evidence record (CI: each satisfying check's name, conclusion, SHA, run URL; local: each run's command, `result`, `exit_code`, and one `show evidence: <log_path>` line pointing at its captured output - never the output itself); claim dispositions; AC outcomes per row; check dispositions; drafted payloads keyed by the blocker or nit number they fix; drafted replies keyed by the `PR comments` item they answer.

## Worked example

Own PR, ticket gh-45:

```
Delivers: the reports page exports CSV on demand. The PR covers AC1-2 of gh-45; AC3
(export completes under 5s on production data) is checked after merge, not here.

Ticket changes:
- AC4 asks for the customer's credit score in the export, and the vendor API this
  service reads returns no such field.
  Proposed wording: "Exports include the customer's risk tier." (drafted; vendor doc api.example.com/v2/customers)

PR comments:
- maria's comment on the missing CSV header is already addressed, so the drafted reply points her at the fix. (3f2a1c0)

Nits:
- The export pages results with its own loop instead of the shared paging helper, so a paging bug fixed once would need fixing twice. (src/api/export.ts:31, lib/page.ts)

Blockers:
1. The export endpoint ships with no test, so nothing proves it works and nothing
   catches it breaking. (src/api/export.ts:10-58)
2. The export guide still says exports run nightly; the PR makes them on-demand, so a
   reader following the docs waits for a job that no longer exists; the doc fix is drafted.
   (docs/exports.rst:88)

Verdict: fixable - 2 blockers

1. fix - apply both blockers in the worktree, review the wave, push        [recommended]
2. propose ticket change - show the AC4 edit for approval before it posts
3. review - post the blockers as a comment on your PR
4. reply - post the drafted reply to maria
5. show evidence - gate output, CI run, drafted edits
6. stop - leave the PR as-is
Type a number, or compose: "fix 2", "fix nits", "fix + nits", "fix 1 + reply".
```

A clean own PR with ticket gh-45 and CI green:

```
Delivers: the reports page exports CSV on demand. The PR covers the whole gh-45.

Verdict: mergeable - CI green on the assessed head (test)

1. merge - squash onto main                                               [recommended]
2. fix - name the change to apply in the worktree, review the wave, push
3. show evidence - gate output, CI run
4. stop - leave the PR as-is
Type a number.
```
