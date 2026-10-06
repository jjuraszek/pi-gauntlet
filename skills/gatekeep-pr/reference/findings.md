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

The `design` section is always part of the judged contract: a Design requirement with no mechanism in the diff is a `gap` blocker whether or not an AC row points at it. A `deferred:` row whose `ref` is empty is a `gap` ("row <n> is deferred to no ticket, spec, or URL"); the gate checks the reference's shape only, never that its destination shipped - delivery is `/skill:check-delivery`'s job. A row the repository cannot satisfy is corrected in the spec (`deviates: <why>` through brainstorming's amendment path) and, for `/skill:check-delivery`, on the ticket through `/skill:shape-ticket`; this gate posts no tracker comment, and no ticket edit lifts a withhold.

**No spec rows** (`source: pr`, or `source: spec` with empty `rows`): no AC rows; `Delivers` states the PR's intent as read from its title and body, `design` is judged when present; `not judged here` and scope creep against rows do not apply.

**Coverage.** With `source: spec`, `Delivers` lists the covered rows, then the `deferred per spec` and `deviates per spec` rows, then the observation halves (`report.md`); any other uncovered row is `gap`. The spec's disposition is the record: a tracker comment, a PR named in the body, or a later PR never widens or narrows it, and a bare `deferred:` is never confirmed by the ticket.

**Claims.** The Verifier's three dispositions stand. `contradicted` is a blocker. `unverifiable-pre-merge` is not evidence and renders nothing: a PR whose only proof of a new path is "verified on stg" is blocked by the untested-path rubric row, not by a claim rule.

## Namespaces

Every finding is one of two:

| Namespace | Contents | Gates merge |
|---|---|---|
| blocker | code defects, security, untested new path, `contradicted` claim, AC `gap`, scope creep (diff content traceable to no `in-scope` row, no `design` clause, and no stated intent), doc drift beyond wording (a doc now describes behavior the code does not have, or omits an operation or parameter the code adds), failed gate or undispositioned failing check | yes |
| nit | wording-only doc drift (typo, label, phrasing with the same meaning), style, reuse of an existing helper, naming | no; take-or-leave at the menu; untracked after the run |

Behavior the spec keeps in scope is a blocker until its mechanism ships; a row the spec defers or deviates is settled, and settled scope lifts no `REVIEW.md` blocker, failing check, contradicted claim, or merge precondition.

**One defect, one blocker.** A missing mechanism surfaces through several rules at once (reviewer finding, AC `gap`, doc drift, `contradicted` claim); render it as one blocker that names the defect and lists every locator, and keep each contributing rule's ID in the ledger.

**Severity translation.** Reviewer Critical and Moderate -> blocker; Minor -> nit. A repo `REVIEW.md` mapping overrides this; a severity it names but does not map is fail-safe blocker, noted in `show evidence`.

**Triage bar** for findings the orchestrator originates itself: blocker only when it must be fixed before merge (correctness, security, a material performance trap, a convention the repo enforces); everything else is a nit, whatever its category. The bar never re-triages a classification the severity translation already made.

**Internal IDs.** `P#` (blocker or nit on code, a claim, a check), `L#` (AC `gap`, doc drift, scope creep), and the comment ledger's `C#` survive as keys for the post-push re-render diff and the fix wave; the human never sees them. IDs are append-only for the run: minted once, never renumbered, never reused. A fixed blocker leaves the rendered list on the next render; its ID stays in the ledger.

**`C#` ledger.** Each ledger row carries its comment `id` and the `updated_at` it was minted against; the post-push diff (`post-selection-loop.md` `### Re-render`) runs against this ledger, never against the report text. Row states: a triage label (`already-addressed` / `reasonable` / `judgment-call`) with a drafted reply; `superseded by C<new>`; `withdrawn`; `pending`; `reviewer failed (<conclusion>)`. The last four carry no reply and are not replyable; `reply` skips them.

## Dispositions

Any blocking conclusion in the resolved check set (required or not - `../verification-brief.md` Section B, Evidence resolution table) withholds `merge` until the user dispositions it, and mints a `P#` - except the reviewer check, whose exception the brief's Section B defines (one `show evidence` line `reviewer check <name> failed - inert`). An undispositioned failing check is never a target of `fix`; close it by disposition. A **binding** pending check (`../verification-brief.md` Section B, binding classification) mints nothing and is not dispositionable: merge waits until it turns green, or `merge_state_status` leaves `BLOCKED`, or it converts to a failing check with its own `P#`. A not-binding pending check withholds nothing, never renders under `PR comments`, and prints under `show evidence` only, as `<name> pending - not binding this viewer (merge_state_status <value>)`; the `required` field stays gathered and no longer withholds on its own.

| Disposition | Annotation on the `P#` |
|---|---|
| undispositioned failing check | none yet |
| flaky | `(dispositioned: flaky)` |
| real | `(dispositioned: real)` |
| CI-infrastructure-broken | `(dispositioned: ci-infrastructure-broken)` |

Only `flaky` lifts the blocker; an undispositioned check, `real`, and `ci-infrastructure-broken` keep it until the check - or, for `ci-infrastructure-broken`, the fallback local run (brief Section B, Failed CI row) - is green.

How each disposition changes the menu: `decision-menu.md` `## Overlays`, CI check row.

## Drafted payloads

Step 5 drafts, never applies. For every blocker and nit with a file-level fix - code and doc drift alike - draft the concrete edit as a payload keyed to the finding's internal ID. For every replyable `C#`, draft the reply. The worktree stays tracked-clean (`git status --porcelain --untracked-files=no` empty) at every menu render; a payload is applied only on a `fix` pick (the same path for code and docs) and dropped at teardown otherwise.

A posted review body is composed at post time from the blockers being addressed - one summary sentence, then the numbered items, ending on the fix or asked action.
