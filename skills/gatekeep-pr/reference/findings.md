# gatekeep-pr: step 5 - integrate

Read from SKILL.md step 5, before `report.md`. Inputs: the digest, the step-2 AC rows, the step-3 evidence and claim dispositions, the step-4 reviewer output and comment ledger. Output: AC outcomes, blockers, nits, drafted payloads - the report's content, not its rendering.

## Provenance

Local evidence: `worktree_root` matches the provisioned path, every `run_cwd` sits inside it, `head_sha` matches the digest's `headRefOid`. On mismatch, re-fetch the PR head once and re-sync + re-run steps 3-4 when it advanced; a second mismatch, or any path mismatch, is missing evidence. The evidence clause names its source exactly: local -> `verification command passed locally`; CI -> `CI green on the assessed head (<check name>)`, never worded as a local run.

## AC outcomes

Inputs: the ticket AC rows (step 2), the source behind the diff at the assessed `headRefOid`, tests in the diff and existing tests the diff reaches, docs in the diff and docs the diff makes stale, CI per the brief's Evidence resolution table. PR body, PR comments, and a spec inside the PR are leads to verify, never evidence.

Split each AC row once into a **mechanism half** (code + test + doc that make the behavior possible) and, when the row names an observation that needs an environment, dataset, deployed target, or external system that repository tests cannot reach, an **observation half**. Behavior a unit test can assert ("retries three times then fails", "rejects a nil name") is mechanism, never an observation half. A `venue:` disposition in the PR's spec is a lead to compare against the ticket's own AC text, never proof and never an exemption. Judge the mechanism half only; the observation half is checked after merge, not here, and blocks nothing.

| Outcome | Condition | Renders as | Blocks |
|---|---|---|---|
| `covered` | evidence matches what the AC promises: executable behavior needs the code path plus a real test that exercises it; a documentation-only AC is judged against the promised doc text and demands no test; in both cases docs that describe the behavior agree with it | counted in `Delivers` | no |
| `gap` | any part of the mechanism absent in this PR and the row not explicitly split (see Whole or part) | one `Blockers` item | yes - a mechanism `gap` is a blocker |
| `not judged here` | the observation half; the mechanism half of the same row is still judged `covered`/`gap` | one `Delivers` clause ("<row>'s observable half is checked after merge, not here"); nothing is written, listed, or handed to check-delivery | no |
| `impossible` | a `gap` whose fix is on the ticket - all four conditions below hold | one `Ticket changes` item with a drafted replacement AC text, in state `drafted` or `proposed` | withholds `merge` until the ticket body changes or the human picks `merge anyway - accept AC<n> as impossible` |

`impossible` requires all of: (1) no change to this repository can satisfy the mechanism half; (2) the constraint is cited - a vendor/platform doc URL, a dependency's released API at `file:line` or in its changelog, a repo policy at `file:line`, or a second AC in the same ticket whose quoted text contradicts this one; (3) the cited source was read this run; (4) the reason is none of: cost, effort, "needs another PR", "needs a deploy first" (that is `not judged here`), a `deviates:`/`deferred:` disposition in the PR's spec, "the AC is ambiguous" (an ambiguous row stays judged as written). Anything failing a condition is `gap`. Passes: the AC asks the export to include the customer's credit score and the vendor API the repository reads returns no such field (vendor doc URL cited). Fails: the AC asks for the user's local timezone and the browser sends no timezone header - a request parameter is a repository-side mechanism, so this is `gap`.

**Impossible-AC lifecycle.** Three states in order: `drafted` (the proposal exists in the run), `proposed` (`propose ticket change` posted it as a tracker comment; a comment is not an edit), `resolved` (a human edited the ticket body). Every step-5 re-entry re-fetches the ticket and re-extracts the AC rows; a changed row is re-judged on the current head, so a human edit to the ticket body lifts the withhold without a PR head change. `Ticket changes` keeps one item per unresolved row, labeled `drafted` or `proposed`, and drops it only after the re-extracted row no longer meets the four conditions.

**No ticket** (none linked, or fetch failed): no AC rows; `Delivers` states the PR's intent as read from its title and body; `not judged here`, `impossible`, `Ticket changes`, and scope creep do not apply.

**Whole or part.** With a ticket linked, `Delivers` names coverage: *whole* when every row is `covered` or is `not judged here` with its mechanism half `covered`; *part, acceptable* when every uncovered row is either an observation half or **explicitly split** - the ticket body or a human-authored ticket comment, read from the tracker this run, names another tracker ref or a PR in another repository for that row; a cross-repo PR named there waives exactly the rows whose mechanism lives in that repository; a commit SHA, branch name, or deploy note names no PR and never splits a row; a comment whose author cannot be read from the tracker is not human-authored for this rule, so the row stays `gap` and the `Delivers` line names the unreadable field. Only the tracker waives an obligation: a spec `deferred: <where>`, a later PR in the same repository, a PR named only in this PR's body, or a `proposed` (not yet `resolved`) ticket change is a lead to check the tracker, never a waiver. Any other uncovered row is `gap`: "a later PR will add X" in the PR body, an unchecked box with no tracker split, a `deferred:` the ticket does not confirm.

**Claims.** The Verifier's three dispositions stand. `contradicted` is a blocker. `unverifiable-pre-merge` is not evidence and renders nothing: a PR whose only proof of a new path is "verified on stg" is blocked by the untested-path rubric row, not by a claim rule.

## Namespaces

Every finding is one of two:

| Namespace | Contents | Gates merge |
|---|---|---|
| blocker | code defects, security, untested new path, `contradicted` claim, AC `gap`, scope creep against a linked ticket (diff content traceable to no AC and no stated intent), doc drift beyond wording (a doc now describes behavior the code does not have, or omits an operation or parameter the code adds), failed gate or undispositioned failing check | yes |
| nit | wording-only doc drift (typo, label, phrasing with the same meaning), style, reuse of an existing helper, naming | no; take-or-leave at the menu; untracked after the run |

Behavior the ticket promises is a blocker or an explicit tracker split - never deferred to a PR nobody opened.

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

Step 5 drafts, never applies. For every blocker and nit with a file-level fix - code and doc drift alike - draft the concrete edit as a payload keyed to the finding's internal ID. For every `impossible` row, draft the replacement AC text. For every replyable `C#`, draft the reply. The worktree stays tracked-clean (`git status --porcelain --untracked-files=no` empty) at every menu render; a payload is applied only on a `fix` pick (the same path for code and docs) and dropped at teardown otherwise.

A posted review body is composed at post time from the blockers being addressed - one summary sentence, then the numbered items, ending on the fix or asked action.
