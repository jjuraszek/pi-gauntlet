# gatekeep-pr: send the PR list as reply text and list changes-requested PRs whose request was answered

**Goal:** Every `/skill:gatekeep-pr` run shows its formatted, linked list of PRs as visible reply text before any PR work, and no-argument discovery hides a changes-requested PR only while its change request is unanswered.
**Amend-grant:** none
**Date:** 2026-11-19
**Predecessor:** `doc/specs/2026-11-18-gatekeep-discovery-roster.md` - supersedes the "own intermediate message" list rule and the blanket `CHANGES_REQUESTED` exclusion only; its list entries, ticket display, team-request discovery and report wording stay live. `doc/specs/2026-10-30-gatekeep-pr-default-mine.md` - supersedes the `CHANGES_REQUESTED` drop in "Discovery" only.

## Problem

Request, verbatim: `we need nice TUI formatted preambule before PR work. moreover if PR has "change requested" which is not addressed than this PR shouldn't be listed at all`

Seed, a bug report triaged to a real bug: `gatekeep-pr without arguments didn't show well formated list of PRs! it should always be TUI message not cat over temp md file!`

Framing: kept - the user chose "as framed": only unanswered change requests stay hidden from the discovered list; an answered one returns to it. Typed runs keep listing every typed PR.

Two defects sit behind the request.

**The list is not shown.** The skill asks for the list "as its own intermediate message" and never says where that message goes. In one saved no-argument run with five discovered PRs the model composed the list in its reasoning and sent a reply with no text. The only PR list on screen before the PR work was the run's bookkeeping, written and echoed through `cat`.

**The filter hides answered PRs.** Discovery drops every PR whose review decision is `CHANGES_REQUESTED`. GitHub keeps that decision after the author re-requests review or pushes a fix, so a PR waiting for a second look is hidden.

Checked claims (source - lookup - result):

- Held: no-argument discovery asks for the linked list as its own intermediate message with no marker - `skills/gatekeep-pr/verification-brief.md` "Argument-resolution discovery" list paragraph; the single typed PR rule sits in the same file's "Gather fixed commands", the typed-set rule in `skills/gatekeep-pr/reference/batch.md` "Admit before effects".
- Held: nothing checks the list was shown and later steps forbid reprinting - the same three paragraphs (`Never repeat the list in a stop, gate or summary`, `print no second one`).
- Held: the human-facing list was composed and never sent - the saved run's reply after the ticket-setting lookup holds two reasoning blocks (`Printing the list now, then reading batch.md` and a summary starting `Five open PRs are ready to gate, smallest first`), no text block, and one `read` call. Across saved runs since the rule shipped (commit `0ff2dab0`), one model showed the list in 8 of 8 runs, another in 0 of 2.
- Held: the user's reading "the session shows the list as `cat` over md" - the saved run's only on-screen list of the five PRs before the PR work is one bash call that writes the per-PR state records and the roster through `cat > <file> <<EOF` and ends with `cat <state file>`. That roster is a required run record, not a stand-in for the list.
- Corrected: "the only trace is a shell echo `discovered, smallest first: ...`" - that line is visible reply text, the text block of the reply that minted the run folder. The same model sends text between commands when the skill gives it the literal line.
- Corrected: "a changes-requested PR is listed" - the discovery union rule excludes `reviewDecision` exactly `APPROVED` or `CHANGES_REQUESTED`. `gh pr view <N> --json reviewDecision,latestReviews,reviews` on the five listed PRs of the saved run returned an empty decision and zero reviews for each; `gh pr list --search reviewed-by:@me` in the same repository returned three open PRs with decision `CHANGES_REQUESTED`, none of them listed. The exclusion is blanket.
- Held: the decision stays `CHANGES_REQUESTED` after the author re-requests review - GraphQL search `is:pr is:open review:changes_requested sort:updated-desc`, first 60 public results: 8 have the change requester in the pending review requests with the decision unchanged (example `sgl-project/rbg#572`).
- Corrected: "a commit pushed by the author re-requests review automatically" - it does not. GitHub's "Requesting a pull request review" page describes the re-request as a click on the reviewer's sync icon. In the same search, first 50: 19 PRs have a last commit dated after the change request with no re-request (example `molgenis/molgenis-emx2#6985`).
- Held: the user's three hidden PRs are unanswered under both signals - `gh pr view` on each: one change request from the viewer, no pending request, zero commits after it. They stay hidden.
- Corrected: "who still requests changes can be read from `latestReviews`" - that field reports a requester's later plain comment as their latest review. Same search, 45 PRs: in 8 a requester's last review is `COMMENTED`, `latestReviews` shows `COMMENTED` and `latestOpinionatedReviews` still shows `CHANGES_REQUESTED`, with no re-request (example `NVIDIA/cuvs#2997`). For all 9 re-requested requesters `latestReviews` has no entry and `latestOpinionatedReviews` still shows `CHANGES_REQUESTED` (example `Pycord-Development/pycord#3252`). `gh pr list --json` does not offer `latestOpinionatedReviews`.
- Held: one GraphQL lookup returns what the answered test needs - the same search read `latestOpinionatedReviews{author{login} state submittedAt}`, `reviewRequests{requestedReviewer{... on User{login}}}` and `commits(last:1){nodes{commit{committedDate}}}` per PR; the largest sampled PR has 197 commits and `commits(last:1)` needs no paging.
- Not available: the commit a review was submitted on, through `gh pr view|list --json latestReviews` - the `commit` key carries an empty `oid`. The commit signal compares dates.
- Held: typed runs list every typed PR regardless of state - `reference/batch.md` (`regardless of PR state`).
- Held: an extension can post a Markdown message - pi `docs/extensions.md` `pi.sendMessage` with `display: true`; `extensions/phase-tracker.ts` does so. The user rejected this route: "other skills just show what they have to without tool".
- Held: Claude Code loads no pi extension - `.claude-plugin/marketplace.json` ships skills only.
- Corrected: "Claude Code lists one PR at most" - it gates one at most. A discovered multi-PR run there lists every eligible PR and then stops: `verification-brief.md` outcome row `2+ Claude Code`; `eval/gatekeep-pr/samples/no-arg-discovery-cc-multi/expected.md` expects three linked entries before a separate marker-first stop, with no command between the sort and the stop.
- Held: the model eval cannot observe message boundaries - `eval/lib/replay.mjs` passes `--no-tools`; `eval/gatekeep-pr/target.json` is `kind: text`. It can check the list's text and a send-or-not decision from fixed inputs (`eval/README.md` "Isolate the behavior under test").
- Held: `eval/gatekeep-pr/target.json` `skillFiles` include `reference/assessment.md` and omit `reference/batch.md`; samples add it with `bundle+`.
- Held: a skill's shell block is testable without a model - `scripts/gatekeep-plan-free-head.test.mjs` extracts a fenced bash block from a gatekeep reference file and runs it over fixtures.
- Corrected: "`scripts/ci.mjs` lists such tests explicitly" - `rg plan-free-head scripts/ci.mjs` has no match, so `npm test` does not run that test. `scripts/ci.mjs` runs the files in its one `--test` list (line 554), which includes `scripts/gatekeep-comment-reconcile.test.mjs`; a new test runs only when added there.
- Held: three existing samples quote the list headings - `eval/gatekeep-pr/samples/{no-arg-discovery-note,no-arg-discovery-single,typed-list-note}/expected.md`.
- Held: an existing CI test pins text this change edits - `scripts/gatekeep-comment-reconcile.test.mjs`: line 133 the "own intermediate message" sentence; lines 146 and 151 the backticked plain typed headings; line 213 the projection with the `CHANGES_REQUESTED` strip; line 219 the first bash fence of the discovery section, which it runs; line 1056 a zero-match check that rejects only a plain heading; line 1088 the plain heading in the saved over-cap and Claude Code multi-PR replies. It also checks each sample's saved `factsSha` against its `expected.md`, and the `for:` hash of `eval/gatekeep-pr-scope/intent.md` and `eval/gatekeep-pr-merge-state/intent.md` against the assembled skill text, which includes `verification-brief.md`.
- Held: `no-arg-discovery-over-cap` encodes the blanket exclusion - its `f1` opens "Exclude drafts, APPROVED and CHANGES_REQUESTED" and `case.md` line 37 carries PR #202 as a stripped `CHANGES_REQUESTED` row with no lookup result.
- Held: discovery runs two queries only - `verification-brief.md` "Argument-resolution discovery": `--author @me` and `--search 'review-requested:@me'`. GitHub's search docs: "Requested reviewers are no longer listed in the search results after they review a pull request".
- Held: the single typed PR list comes after substantive reads - `verification-brief.md` "Gather fixed commands" prints it "after the initial gather", which includes `gh pr diff` and three paginated review and comment calls.
- Held: both provisioning steps serve typed and discovered runs and name no list heading - `reference/assessment.md` "Provision the worktree", `reference/batch.md` "Provision serially". `no-arg-discovery-note` stops "before minting the run folder, gathering PRs or provisioning".
- Held: a replay can supply a failed command as a fixed input - `eval/gatekeep-pr/samples/no-arg-discovery-failed/case.md` Scenario A (`author query exits 1, stderr first line ...`). None of its scenarios is a review lookup.
- Held: the review connection is not limited to writers and a pending request can name a non-`User` - GraphQL introspection: `latestOpinionatedReviews` defaults `writersOnly` to false; `RequestedReviewer` is one of `Bot`, `EnterpriseTeam`, `Mannequin`, `Team`, `User`.
- Not checked: `pageInfo{hasNextPage}` on `latestOpinionatedReviews` and `reviewRequests` - not read from the schema; the plan task that first runs the lookup confirms it.
- Not checked: the pi-cohort `parallel.maxTasks` value in effect - pi-cohort source not read; the design does not depend on it.
- Not checked: how links and bold render in a terminal - pi's Markdown renderer was read, not run.

Implicit dependencies: `gh`, `jq`, origin remote - `command -v` and `git remote get-url origin` - found. Spec index bin - both prescribed queries ran - found. Live discovery output - not checkable without a credentialed run in a target repository.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] A no-argument run lists a changes-requested PR when every reviewer whose latest approving or change-requesting review requests changes has a pending review request.
  in-scope
- [ ] A no-argument run lists a changes-requested PR with no such re-request when its last commit is dated after the latest change-requesting review.
  in-scope
- [ ] A no-argument run leaves out of the list and the gated set a changes-requested PR that has a requester without a pending review request and no later commit, including when that requester commented afterwards.
  in-scope
- [ ] A failed review lookup stops a no-argument run with `discovery failed: <first gh error line>` and no list.
  in-scope
- [ ] An unreadable review lookup result stops a no-argument run with `discovery failed: malformed review lookup for #<N>` and no list.
  in-scope
- [ ] The list heading is bold in discovered, single typed and typed-set runs.
  in-scope
- [ ] The three list rules name the reply's visible text as the place for the list and no longer ask for an "intermediate message" or "own message".
  in-scope
- [ ] A run that reaches the first PR checkout step with no earlier reply carrying the list writes the list in that step's reply, before the checkout command.
  in-scope
- [ ] A run whose earlier reply carries the list does not repeat it at the checkout step.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gatekeep-visible-roster
contract:
- create: git worktree add .worktrees/<name> -b <branch>
- destroy: git worktree remove .worktrees/<name> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (AGENTS.md Testing); node eval/run.mjs gatekeep-pr <sample> for the seven samples in "Evals"
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/gauntlet-resume/reference/coordinated.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9
design: owns every path in Design; observable outcomes are the nine AC rows above

## Design

Wording only: no extension, no tool, no code-side discovery. The list stays skill text the model writes, the same on pi and Claude Code. Skill edits follow `/skill:forge-skill`.

### List placement

The three list sites are `verification-brief.md` "Argument-resolution discovery" (discovered list), `verification-brief.md` "Gather fixed commands" (one typed PR) and `reference/batch.md` "Admit before effects" (typed set).

Remove:
- "as its own intermediate message" in the discovered-list rule.
- "Send the list as its own message" in the single typed PR rule and the typed-set rule.

Add, at each of the three sites:
- The reply-text rule: write the list as the visible text of the assistant reply, the words the user reads, in the reply that carries the next tool call, a file read included. Reasoning and command output are not the reply.
- Bold headings: `**Open PR to gate:**`, `**Open PRs to gate, smallest first:**`, `**PR to gate:**`, `**PRs to gate:**`.

Add to the discovered-list rule only, for a branch that ends in a stop with no metadata call left after the sort (the `2+ Claude Code` rejection): write the list as the text of the reply that reads the stop-format instructions (the first-line rule in brainstorming's `reference/menu-layout.md`), then send the stop as its own reply, marker first. The list never shares the stop reply.

Change in the single typed PR rule: the list moves from "after the initial gather" to before the substantive reads. Run the first `gh pr view` and the two viewer lookups first; with the Ticket display reads they are the only calls before the list. Write the list in the reply that carries the next gather command, before `gh pr diff`, the CI run reads and the paginated review and comment reads. The rest of the gather reuses those results and reruns none of them. The typed-set site already gathers only list metadata before its list and keeps its order.

Keep unchanged: the entry grammar and ticket display, no first-line marker, no question, no wait, no list on zero matches or a discovery failure, the separate marker-first stop message, and "never repeat the list" once a reply in view carries it.

Add to `SKILL.md` "Arguments", second bullet: "no drafts or decided PRs" becomes "no drafts, approved PRs, or unanswered change requests", and "Print the linked list before gating" names the reply text.

### Send-if-missing

Add the provisioning check to `reference/assessment.md` "Provision the worktree" (single-PR path) and to `reference/batch.md` "Provision serially" (set parent): before the first provisioning command of the run, when no earlier reply text in view carries the list, write it now as that reply's text; when one carries it, write nothing.

- Heading, by input and roster size: no PR token typed and one PR - `**Open PR to gate:**`; no PR token typed and two or more - `**Open PRs to gate, smallest first:**`; one typed PR - `**PR to gate:**`; a typed set - `**PRs to gate:**`.
- First provisioning only: a provisioning retry, a re-gather or a loop re-entry never runs the check.
- Entries come from the PR fields the run already holds for the admitted roster, in roster order. The check runs no lookup of its own.
- A set child never sends the list; the parent owns it.
- History limit: the check reads only reply text still in view. A model that cannot see its earlier replies sends the list, so the user can see it twice in that run. That is the one accepted repeat; no state records that the list was sent, because the fix stays wording-only.

### Discovery filter

All edits are in `verification-brief.md` "Argument-resolution discovery". The `gh pr list` field list stays unchanged.

Remove:
- `.reviewDecision == "CHANGES_REQUESTED"` from the projection's strip condition, so a changes-requested row keeps its title, links, `linearRefs` and cut body.
- `CHANGES_REQUESTED` from the union rule's blanket exclusion.

Add:
- The union rule, in this order: validate both list results, union and deduplicate by number, exclude `isDraft` true or `reviewDecision` exactly `APPROVED`, then run the review lookup for each surviving `CHANGES_REQUESTED` row and exclude that row only when the answered test prints `unanswered`. A draft or approved row never gets a lookup.
- The review lookup and the answered test, one fenced bash block run as one shell call per surviving `CHANGES_REQUESTED` row, sequentially in ascending PR number, before the sort. The fence sits under its own `#### Review lookup` subheading inside "Argument-resolution discovery", after the list-command fence. It starts with the lookup:

```bash
lookup=$(gh api graphql -f query='query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){pullRequest(number:$n){latestOpinionatedReviews(first:100){pageInfo{hasNextPage} nodes{author{login} state submittedAt}} reviewRequests(first:100){pageInfo{hasNextPage} nodes{requestedReviewer{__typename ... on User{login}}}} commits(last:1){nodes{commit{committedDate}}}}}}' -f o=<owner> -f r=<repo> -F n=<N>) || exit $?
```

  and continues in the same shell call with the answered test: it pipes `$lookup` to `jq`. A separate shell call would lose the variable. Block outcomes:

  | Case | stdout | Exit | Discovery |
  |---|---|---|---|
  | The `gh` call fails | empty | `gh`'s nonzero status, its stderr passed through | stop `discovery failed: <first gh error line>` |
  | The response is unreadable ("Errors and edge cases") | exactly `malformed` | nonzero | stop `discovery failed: malformed review lookup for #<N>` |
  | Either review connection reports `pageInfo.hasNextPage` true | exactly `incomplete` | nonzero | stop `discovery failed: incomplete review lookup for #<N>` |
  | Otherwise | exactly `answered` or `unanswered` | 0 | keep or exclude the row |

- The answered test's rule, in order:
  1. A requester is a `latestOpinionatedReviews` node with state `CHANGES_REQUESTED`. No requester: `answered`.
  2. Every requester's login equals, case-insensitively, the login of a `reviewRequests` node whose reviewer is a `User`: `answered`.
  3. The last commit's `committedDate` is later than the latest requester `submittedAt`, compared as instants: `answered`.
  4. Otherwise `unanswered`.

  Rules 2 and 3 each judge the whole PR and do not combine across requesters: a re-request to some requesters plus a commit later than only the other requesters' reviews is `unanswered`.

An answered PR's list entry follows the existing entry rules with no extra wording. The 0 / 1 / 2+ outcome table counts PRs after the filter. Typed runs list every typed PR regardless of review state.

### Evals

Rewrite `eval/gatekeep-pr/intent.md` for this change. Samples and must-hold facts:

| Sample | State | Must hold |
|---|---|---|
| `no-arg-discovery-answered` | new | main scenario: lookup narrated for the three surviving changes-requested PRs only, in ascending number, not for the changes-requested draft, the approved or the undecided ones; the re-requested PR and the later-commit PR are listed; the PR whose requester only commented afterwards is absent from the list and the routed set; heading `**Open PRs to gate, smallest first:**`, ascending size. Three isolated stop scenarios, none printing a list: a lookup call that exits nonzero stops with `discovery failed: <first gh error line>`; block output `malformed` stops with `discovery failed: malformed review lookup for #<N>`; block output `incomplete` stops with `discovery failed: incomplete review lookup for #<N>` |
| `list-send-if-missing` | new | three runs, each starting at the first provisioning step. Typed single PR, no earlier reply carrying the list: the reply text carries `**PR to gate:**` and one linked entry before the checkout command, once, with no marker or wait. Discovered set parent (`bundle+` `reference/batch.md`), no earlier reply carrying the list: `**Open PRs to gate, smallest first:**` and the entries in roster order before the first provisioning command. Earlier reply in view carries the list: no list at the provisioning step |
| `no-arg-discovery-note` | expected text updated | `n1` quotes the bold heading and keeps "once"; `n3` reads reply text instead of intermediate message |
| `no-arg-discovery-single` | expected text updated | `f1` quotes `**Open PR to gate:**` |
| `typed-list-note` | expected text updated | `e1` and `e3` quote `**PRs to gate:**` and `**PR to gate:**`; the single typed entry follows the `gh pr view` and viewer lookups and precedes the diff, CI and comment reads |
| `no-arg-discovery-over-cap` | fixture and expected text updated | PR #202's row keeps its title, url, author and the other retained list fields; the case supplies its lookup result with block output `unanswered`; `f1` leaves #202 out as an unanswered change request, the six eligible PRs still reach the cap stop `got 6`, and the heading is bold |
| `no-arg-discovery-cc-multi` | expected text updated | no metadata lookup remains after the sort; the three entries under `**Open PRs to gate, smallest first:**` are the text of the reply that reads the stop-format instructions; the marker-first stop follows as a separate reply |

Each new or changed case supplies upstream command results as fixed inputs: each lookup's JSON with its block output (`answered`, `unanswered`, `malformed`, `incomplete`), or the failed call's exit status and stderr. The model never derives a verdict from the JSON; the deterministic test owns classification.

Update `eval/gatekeep-pr/README.md`: the inventory rows of the seven samples (two of them new), with each heading quoted as the sample's facts quote it.

Refresh the `for:` line of `eval/gatekeep-pr-scope/intent.md` and `eval/gatekeep-pr-merge-state/intent.md` to the new assembled-skill hash. Nothing else in those two targets changes and no sibling sample runs.

**Paid actions.** Model calls through `node eval/run.mjs gatekeep-pr <sample>` for the seven samples in the table, with `--baseline-only` seeding where the runner requires it. Design round 2 approved five; the council added `no-arg-discovery-over-cap` and `no-arg-discovery-cc-multi`, whose saved fact hashes change with their expected text. Runner: the implementing session, from the worktree. Inputs: the sample name. Approving this spec authorizes every such call for the whole flow, those two samples included, across seed, rows, repairs and finish, without per-step permission prompts.

**Operator step.** Before the release, the maintainer installs this worktree through the local-install route in `doc/install-internals.md` (`npm install` in the checkout, then `pi install -l <checkout>`), selects the model that showed the list in 0 of 2 saved runs, and runs `/skill:gatekeep-pr` with no arguments in a repository where discovery leaves at least one eligible PR. The maintainer then opens the saved session and confirms that an assistant reply before the first provisioning call holds a text block with the bold heading and the linked entries. The shell display of the run records does not count. That model's identifier is not in this spec; the user supplies it at the gate.

## Errors and edge cases

- A review lookup that exits nonzero stops discovery with the existing `discovery failed: <first gh error line>`; no list.
- A lookup result without `data.repository.pullRequest`, without one of the three connections, without `pageInfo.hasNextPage` on either review connection, with zero commit nodes, or with a requester lacking `submittedAt` stops with `discovery failed: malformed review lookup for #<N>`; no list.
- A commit dated at or before the latest change request does not count, including one committed earlier and pushed later; only a re-request brings that PR back.
- A rebase or a merge from the base branch produces a later commit and counts as an answer. The user accepted this cost.
- A re-request to a team does not count; only one to the requester. A pending request whose reviewer is not a `User` (`Team`, `Bot`, `Mannequin`, `EnterpriseTeam`) never satisfies rule 2; a later commit can still answer the PR through rule 3.
- The review connection returns change requests from reviewers without write access; each counts as a requester.
- A requester with no author login (deleted account) can never match a pending request, so rule 2 fails for the whole PR; only rule 3, a commit later than the latest change request of any requester, answers that PR.
- Two requesters, a commit between their reviews, and a re-request to the later one only: `unanswered`. Rule 2 misses the earlier requester and rule 3 misses the later review; the signals do not combine.
- A draft with `reviewDecision` `CHANGES_REQUESTED` is excluded as a draft before any lookup, so its lookup can never stop discovery.
- The lookup reads the first 100 nodes of each review connection. When either reports `pageInfo.hasNextPage` true the PR is not classified: discovery stops with `discovery failed: incomplete review lookup for #<N>`; no list.
- Discovery's two queries bound the filter's reach. A PR on which the viewer requested changes leaves the `review-requested:@me` results once the viewer has reviewed, so when its author pushes a fix without a re-request no query returns it and the answered test never sees it. The second acceptance row holds inside the two-query union: the viewer's own PRs, and other authors' PRs on which the viewer's review is still requested. Whether to widen discovery is the scope decision in "Open questions".
- A dismissed change request is not a requester: its state is no longer `CHANGES_REQUESTED`.
- Every PR filtered out: the existing `no open PRs ...` stop, unchanged.
- A discovered set rejected for size or for running on Claude Code never reaches a provisioning step, so the send-if-missing check never covers its list. Its list rides the next tool call after the sort; on the Claude Code rejection, where no metadata call is left, that call is the read of the stop-format instructions, and the stop follows as a separate reply.
- After lost history the provisioning check can show the list a second time; see "Send-if-missing".

## Tests

New file `scripts/gatekeep-discovery-answered.test.mjs` covers the review lookup and its classification only. It extracts the fence under `#### Review lookup` in `verification-brief.md` and runs it with a stub `gh` on `PATH` that prints fixture JSON or fails. It is added to the `--test` list in `scripts/ci.mjs`.

- Re-requested requester yields `answered` - new file
- Later commit without re-request yields `answered` - new file
- Requester commented later, no re-request, no later commit yields `unanswered` - new file
- One of two requesters re-requested, no later commit yields `unanswered` - new file
- Commit between two change requests, only the later requester re-requested, yields `unanswered` - new file
- Commit instant equal to the change request yields `unanswered` - new file
- No requester yields `answered` - new file
- Team-only re-request yields `unanswered` - new file
- Requester without author login is answered only by a later commit - new file
- Unreadable lookup result prints `malformed` and exits nonzero - new file
- `hasNextPage` true on either review connection prints `incomplete` and exits nonzero - new file
- Failing `gh` stub: the block exits nonzero, prints nothing on stdout and passes the stub's first stderr line through - new file

Existing file `scripts/gatekeep-comment-reconcile.test.mjs` already runs in CI and pins text this change edits. Its pins are updated in place, not re-created in the new file; its link, ordering and non-wait checks stay.

- A changes-requested row keeps title, url and `linearRefs` through the projection; draft and approved rows are stripped - existing file; it selects the list-command fence by its `projection=` line instead of taking the section's first bash fence
- The three list paragraphs carry the reply-text wording and none of the three carries "intermediate message" or "own message" - existing file; the check reads those three paragraphs only (`reference/batch.md` keeps "each in its own message" for post menus)
- Typed heading pins read `**PR to gate:**` and `**PRs to gate:**` - existing file
- The zero-match reply carries no list heading, bold or plain - existing file
- Saved-reply heading checks expect the bold heading for a sample refreshed by this change and keep matching the saved output of a sample that is not - existing file

Samples:

- Lookup runs only for surviving changes-requested PRs; answered ones listed, unanswered left out of list and set - sample `no-arg-discovery-answered`
- Failed lookup stops with `discovery failed: <first gh error line>` and no list - sample `no-arg-discovery-answered` (failed-call scenario) for the stop; the new file for the block
- Unreadable lookup stops with `discovery failed: malformed review lookup for #<N>` and no list - sample `no-arg-discovery-answered` (`malformed` scenario) for the stop; the new file for the block
- Incomplete lookup stops with `discovery failed: incomplete review lookup for #<N>` and no list - sample `no-arg-discovery-answered` (`incomplete` scenario) for the stop; the new file for the block
- List written at the first provisioning step when no earlier reply carries it, under the heading for the input - sample `list-send-if-missing` (typed single run, discovered set-parent run)
- List not repeated when an earlier reply in view carries it - sample `list-send-if-missing` (earlier-list run)
- Bold headings - samples `no-arg-discovery-note`, `no-arg-discovery-single`, `typed-list-note`, `no-arg-discovery-over-cap`, `no-arg-discovery-cc-multi`
- Single typed list precedes the diff, CI and comment reads - sample `typed-list-note`
- Over-cap set still counts six with #202 left out as unanswered - sample `no-arg-discovery-over-cap`
- Claude Code multi-PR list rides the stop-format read, then a separate marker-first stop - sample `no-arg-discovery-cc-multi`
- Discovered single-PR and typed-set headings at the provisioning check - none: the heading rule is one sentence shared with the two replayed cases, and no replay starts there
- A live reply carries the list beside a tool call - none: the model eval runs with tools off; the operator step in "Evals" observes it

## Documentation impact

Bar: `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` gatekeep-pr discovery sentence (which states it excludes `CHANGES_REQUESTED`) - communication contract; `CHANGELOG.md` `## Unreleased` - release procedure
- Derived / memory docs invalidated: none

## Out of scope

- A pi extension, tool or custom message that posts the list; the user rejected it.
- Filtering typed runs by review state.
- A closing line counting what discovery left out.
- Telling a real fix from a rebase in the commit signal.
- The ticket-guess patterns that miss one-letter keys such as `E-123` and misread `ABC-025-2`; noticed during triage, not filed.
- Adding `reference/batch.md` to `eval/gatekeep-pr/target.json` `skillFiles`.

## Open questions

- Whether wording alone makes the model that skipped the list send it is unknown until the operator step in "Evals" runs before the release; no automated test can observe it. A miss there goes back to the user before the release.
- Scope decision for the user at the gate: should a PR on which the viewer requested changes return to the list when its author pushes a fix without a re-request? Discovery's two queries never return that PR ("Errors and edge cases"), and it is the case the commit signal was added for: the user's three hidden PRs were found with `reviewed-by:@me`, not with a discovery query. Council recommendation: admit the viewer's still-outstanding change requests as discovery candidates, then apply the same answered filter; do not admit every PR the viewer ever reviewed. The alternative is to accept the limit, so such a PR returns only on a re-request. The candidate query is not designed or checked here (`--search 'reviewed-by:@me review:changes_requested'` was suggested, unverified). The second acceptance row stays as drafted until the user decides; a yes adds the candidate query to "Discovery filter" before approval.
- Whether GitHub returns a draft row with `reviewDecision` `CHANGES_REQUESTED`. Probe: `rg` for a row with `isDraft` true and `reviewDecision` `CHANGES_REQUESTED` across `eval/gatekeep-pr`, `scripts`, `doc` and `skills` - not found; the list projection in `verification-brief.md` tests the two fields independently. Obtain: `gh pr list --json number,isDraft,reviewDecision` in a repository that has such a PR. Affected edits: none depends on the answer - the exclude-before-lookup order holds either way, and the changes-requested draft in `no-arg-discovery-answered` is a synthetic row. Settlement: the user supplies the fact at the gate, or the first plan task that obtains such a row settles it through brainstorming's amendment path.
