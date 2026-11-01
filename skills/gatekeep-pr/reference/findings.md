# gatekeep-pr: step 5 - integrate

Read from SKILL.md step 5, before `report.md`. Inputs: the digest, the step-2 `scope` block, the step-3 evidence and claim dispositions, the step-4 reviewer output and comment ledger. Output: AC outcomes, blockers, nits, drafted payloads - the report's content, not its rendering.

## Provenance

Local evidence: `worktree_root` matches the provisioned path, every `run_cwd` sits inside it, `head_sha` matches the digest's `headRefOid`. On mismatch, re-fetch the PR head once and re-sync + re-run steps 3-4 when it advanced; a second mismatch, or any path mismatch, is missing evidence. The evidence clause names its source exactly: local -> `verification command passed locally`; CI -> `CI green on the assessed head (<check name>)`, never worded as a local run.

## AC outcomes

Inputs: the digest's `scope` block (step 2: the spec's rows with dispositions and its `design`, or the PR's stated intent), the source behind the diff at the assessed `headRefOid`, tests in the diff and existing tests the diff reaches, docs in the diff and docs the diff makes stale, CI per the brief's Evidence resolution table. PR body, PR comments, and the live ticket are leads to verify, never evidence; the spec at the assessed head is the contract.

Split each AC row once into a **mechanism half** (code + test + doc that make the behavior possible) and, when the row names an observation that needs an environment, dataset, deployed target, or external system that repository tests cannot reach, an **observation half**. Behavior a unit test can assert ("retries three times then fails", "rejects a nil name") is mechanism, never an observation half. A `venue:` row's mechanism half is judged like an `in-scope` row. Judge the mechanism half only; the observation half is checked after merge, not here, and blocks nothing.

| Outcome | Condition | Renders as | Blocks |
|---|---|---|---|
| `covered` | evidence matches what the AC promises: executable behavior needs the code path plus a real test that exercises it; a documentation-only AC is judged against the promised doc text and demands no test; in both cases docs that describe the behavior agree with it | counted in `Delivers` | no |
| `gap` | any part of the mechanism absent in this PR for an `in-scope` or `venue:` row, a `deferred:` row with empty `ref`, or a Design clause | one `Blockers` item | yes - a mechanism `gap` is a blocker |
| `not judged here` | the observation half; the mechanism half of the same row is still judged `covered`/`gap` | one `Delivers` clause ("<row>'s observable half is checked after merge, not here"); nothing is written, listed, or handed to check-delivery | no |
| `deferred per spec` | a `deferred: <ref>` row with non-empty `ref` | one `Delivers` clause (`<n> deferred per spec to <ref>`) | no |
| `deviates per spec` | a `deviates: <why>` row; the Design clauses the `<why>` names or quotes are judged for mechanism like an `in-scope` row | one `Delivers` clause (`<n> deviates per spec: <why>`); a missing adopted clause is one `Blockers` item | only an adopted clause's `gap` |
| `elsewhere per spec` | an `elsewhere: <repo>` row | one `Delivers` clause (`<n> elsewhere per spec: <repo>`) | no |

The `design` section is always part of the judged contract: a Design requirement with no mechanism in the diff is a `gap` blocker whether or not an AC row points at it. A `deferred:` row whose `ref` is empty is a `gap` ("row <n> is deferred to no ticket, spec, or URL"); the gate checks the reference's shape only, never that its destination shipped - delivery is `/skill:check-delivery`'s job. A row the repository cannot satisfy is corrected in the spec (`deviates: <why>` through brainstorming's amendment path) and, for `/skill:check-delivery`, on the ticket through `/skill:shape-ticket`; this gate posts no tracker comment, and no ticket edit lifts a withhold.

**No spec rows** (`source: pr`, or `source: spec` with empty `rows`): no AC rows; `Delivers` states the PR's intent as read from its title and body, `design` is judged when present; `not judged here` and scope creep against rows do not apply.

**Coverage.** With `source: spec`, `Delivers` lists the covered rows, then the `deferred per spec`, `deviates per spec`, and `elsewhere per spec` rows, then the observation halves (`report.md`); any other uncovered row is `gap`. The spec's disposition is the record: a tracker comment, a PR named in the body, or a later PR never widens or narrows it, and a bare `deferred:` is never confirmed by the ticket.

**Claims.** Treat `contradicted` as a blocker and draft a scope-neutral exact description correction; when a correction would narrow either spec-owned or PR-owned scope, pause the correction and route to the explicit contract-decision course in `post-selection-loop.md` `### Continuation record`, retaining the independent mechanism blocker. Render `unverifiable-pre-merge` as optional non-blocking Description uncertainty naming what the gate cannot verify, not as a nit or proof. Assess supplied evidence; leave `matched`, explicitly pending observations, and qualitative prose alone. Never invent unperformed work or a future commitment. Draft requested factual clarification only after an explicit human request; preserve the assertion with the two-part replacement `Author's statement: <assertion> (not verified by this gate). Gate evidence: <evidence>`, rather than deleting it. Use pending-work wording only with an explicit record in the assessed body, approved spec, linked ticket, or request; conflicting records remain uncertain.

Treat a human body rewording dropping a mechanism sentence as a description defect; repair the description without amending untouched spec requirements. Keep spec-owned scope and independent mechanism blockers in force. Record a real proposed contract change and its paused continuation through `post-selection-loop.md` `### Contract decision`; limit it to the requested obligation, not omitted description mechanisms.

## Namespaces

Every finding is one of two:

| Namespace | Contents | Gates merge |
|---|---|---|
| blocker | code defects, security, untested new path, `contradicted` claim, AC `gap`, scope creep (diff content traceable to no `in-scope` row, no `design` clause, and no stated intent), doc drift beyond wording (a doc now describes behavior the code does not have, or omits an operation or parameter the code adds), failed gate or undispositioned failing check | yes |
| nit | wording-only doc drift (typo, label, phrasing with the same meaning), style, reuse of an existing helper, naming | no; take-or-leave at the menu; untracked after the run |

Behavior the spec keeps in scope is a blocker until its mechanism ships; a row the spec defers or deviates is settled, and settled scope lifts no `REVIEW.md` blocker, failing check, contradicted claim, or merge precondition.

**One defect, one blocker.** A missing mechanism surfaces through several rules at once (reviewer finding, AC `gap`, doc drift, `contradicted` claim); render it as one blocker that names the defect and lists every locator, and keep each contributing rule's ID in the ledger.

**Severity translation.** Translate reviewer Critical and Moderate to blocker, Minor to nit. Apply a repo `REVIEW.md` mapping instead when present; treat a severity it names but does not map as fail-safe blocker, noted in `show evidence`.

For an ancestor step-4 re-review, integrate prior items through **Prior-item closure** below, then classify new reviewer findings by the supplied `## Fix delta` hunks, not merely by file membership. Apply this boundary before the default or repo severity mapping:

| New finding | Integration |
|---|---|
| Inside the delta | Use the severity translation above. |
| Outside the delta, Critical | Keep as a blocker. |
| Outside the delta, Moderate or Minor | Print only under `show evidence` as `[Moderate] (outside fix delta)` or `[Minor] (outside fix delta)`, retaining text and locator; exclude from both `Blockers` and `Nits`. |

Judge contract findings (AC outcomes, Design clauses, claim dispositions, check dispositions, doc drift) on the whole assessed head; apply no delta exemption to them.

**Triage bar** for findings the orchestrator originates itself: blocker only when it must be fixed before merge (correctness, security, a material performance trap, a convention the repo enforces); everything else is a nit, whatever its category. The bar never re-triages a classification the severity translation already made.

**Internal IDs.** `P#` (blocker or nit on code, a claim, a check), `L#` (AC `gap`, doc drift, scope creep), and the comment ledger's `C#` survive as keys for the post-push re-render diff and the fix wave; the human never sees them. IDs are append-only for the run: minted once, never renumbered, never reused. A fixed blocker leaves the rendered list on the next render; its ID stays in the ledger.

**Prior-item closure.** For an ancestor step-4 review, integrate each supplied `R#` before new findings:

| Closure line | Integration |
|---|---|
| `R<n>: resolved` | Drop the prior item from the rendered findings; retain its ledger identity. |
| `R<n>: open - <why>` | Keep it open with its posted text and locator. |
| No line for `R<n>` | Keep it open with its posted text and locator; add one `show evidence` line `R<n>: no closure line - kept open`. |

Mint each open item's `P#` once, keyed to the selected review id and `R#`; reuse it on re-integration. Deduplicate a native finding for the same defect into that `P#` under the one-defect rule; retain independent contributors. Classify the prior item from `prior_review.state` and `viewer.is_author`, never today's reviewer severity: blocker for `CHANGES_REQUESTED` or an own PR, nit otherwise. List open prior items first under `Blockers` or `Nits`. Keep `R#` keys and missing-line diagnostics under `show evidence`, not in the rendered lists.

**`C#` ledger.** Each ledger row carries its comment `id` and the `updated_at` it was minted against; the post-push diff (`post-selection-loop.md` `### Re-render`) runs against this ledger, never against the report text. Row states: a triage label (`already-addressed` / `reasonable` / `judgment-call`) with a drafted reply; `superseded by C<new>`; `withdrawn`; `pending`; `reviewer failed (<conclusion>)`; `represented by R<n>`. Only triage-labeled rows carry replies; `reply` skips every other state.

For an ancestor step-4 review, match each live inline `C#` comment id to `prior_review.inline[]` and its supplied `R#`. Set that row to `represented by R<n>` instead of a triage label and discard any drafted reply; keep closure on `R#`, whether resolved or open. Apply this mapping at initial triage and re-triage; preserve comment identity and the body-delta source-review rules.

## Dispositions

Any blocking conclusion in the resolved check set (required or not - `../verification-brief.md` Section B, Evidence resolution table) withholds `merge` until the user dispositions it, and mints a `P#` - except the reviewer check, whose exception the brief's Section B defines (one `show evidence` line `reviewer check <name> failed - inert`). A **binding** pending check (`../verification-brief.md` Section B, binding classification) mints nothing and is not dispositionable: merge waits until it turns green, or `merge_state_status` leaves `BLOCKED`, or it converts to a failing check with its own `P#`. A not-binding pending check withholds nothing, never renders under `PR comments`, and prints under `show evidence` only, as `<name> pending - not binding this viewer (merge_state_status <value>)`; the `required` field stays gathered and no longer withholds on its own.

| Disposition | Annotation on the `P#` |
|---|---|
| undispositioned failing check | none yet |
| flaky | `(dispositioned: flaky)` |
| real | `(dispositioned: real)` |
| CI-infrastructure-broken | `(dispositioned: ci-infrastructure-broken)` |

Only `flaky` lifts the blocker; an undispositioned check, `real`, and `ci-infrastructure-broken` keep it until the check - or, for `ci-infrastructure-broken`, the fallback local run (brief Section B, Failed CI row) - is green.

Record dispositions only from direct human check commands. A flaky disposition followed by numeric deliver can resume; no helper can disposition a check. With BLOCKED and no dispositionable local repair, render the obstacle template from `menus.md`, even with course unset, and use verdict `GitHub reports BLOCKED, no local repair applies`. Render its PR-comments line as `GitHub reports this actor's merge as blocked, so merge waits. (merge_state_status BLOCKED; reviewDecision <value>)`; keep the locator and never attribute a named rule.

## Drafted payloads

Step 5 drafts, never applies. For every blocker with a file-level fix - code and doc drift alike - draft the concrete edit as a payload keyed to the finding's internal ID. Draft nit payloads under `deliver-nits` or a terminal `fix nits` pick: print them in the `show evidence` payload shape and dispatch the wave in the same pick with no second confirmation; before that pick `show evidence` prints only the payloads that exist. For every replyable `C#`, draft the reply. The worktree stays tracked-clean (`git status --porcelain --untracked-files=no` empty) at every menu render; a payload is applied only under a delivery course or a terminal `fix nits` pick (the same path for code and docs) and dropped at teardown otherwise. A `P#` carried by a `rebased locally` sync record is drafted like any blocker, from the helper's test output and `git show <stopped commit>`; a `P#` whose smallest fix needs another repo, infrastructure, or a credential stays open. Keep the stored scope baseline authoritative; an implementer needing a contract change returns open - contract exception without changing it.

Extend each finding-keyed evidence pack with `target: file | description`. For file targets retain the concrete edit and scoped test files. For description targets store `{ finding_id, contributor_ids, assessed_head, original_body, old_text, new_text, replacement_body, source_evidence }` with exact old-to-new text and unrelated body text preserved. Keep independent contributions under all their IDs when one finding combines a claim and test/scope/check gap; close only source-backed resolved claim contributions, never the whole combined finding from a body edit. Judge source: pr gaps against original_intent, not the shortened body.

A payload is the smallest in-repo edit that turns the finding green and keeps the behavior the PR promises; it never adds infrastructure, a dependency, or a new module. A failure caused outside the repo (image pull, toolchain, credentials, external service) gets the smallest in-repo workaround with its reason in one sentence; a skip never removes a test an AC row relies on. A finding whose smallest fix needs another repo, infrastructure, or a credential stays open with the implementer's `open - needs <what>` sentence. A delivery course applies a description payload alongside the file payloads through `post-selection-loop.md` `### Description repair`; show compact exact old-to-new text under the blocker and the full replacement body under `show evidence`. Apply a requested factual clarification only within selected course work; mint no fake blocker. Never draft an unsolicited style rewrite.

A posted review body is composed at post time from the blockers being addressed - one summary sentence, then the numbered items, ending on the fix or asked action.
