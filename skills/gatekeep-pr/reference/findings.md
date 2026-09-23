# gatekeep-pr: findings

Read from SKILL.md `## Assess`. Phase 4 mints the IDs the report and menu carry.

## IDs

`<source_ref>` is a `file:line` where one exists, else the disputed thing (a
quoted PR-body claim, a failing gate command, a required check name).

Precedence: Phase 4 and the merged rubric decide blocking vs. follow-up (the
severity translation, AC coverage, claims, and required-check rules). This
section only chooses which namespace (`P#` / `L#` / `F#`) renders that
decision. Category tags and the triage bar never override an upstream
blocking classification - a Phase-4 Moderate is always blocking (`P#` or `L#`
per Total mapping), never demoted to `F#` by tag or by judgment call.

Total mapping: every blocking element of the Verdict maps to a `P#` or `L#` -
a blocking verdict with "None" in both groups is a rendering bug. Map: failed
gate -> `P#` `[test]` referencing the gate command; contradicted or
merge-proof-unverifiable material claim -> `P#` `[spec]` referencing the
claim; scope creep with a linked issue -> `L#` `spec-conflict`; committed doc
drift -> `L#` `doc-drift`; `partial` AC coverage -> `L#` `outdated-AC`;
`missing` AC coverage -> `L#` `missing-behavior`. `L#` covers exactly the
drift the Verdict already blocks on (committed doc drift, AC coverage, spec
conflict); it widens nothing.

`P#` vs `L#` boundary: code-level spec bugs (the diff contradicts the spec)
are `P#` `[spec]`; requirement/doc mismatches (the spec or docs are stale
relative to intent) are `L#`.

Labelled `C#` rows are verdict-neutral drafts: they never gate merge, and
nothing posts until selected. The `pending` state, a queued/in-progress
reviewer run, and a failed comment refetch withhold pre-composed `merge-*`
courses at the menu level (`decision-menu.md` `## Pending-reviewer overlay`);
they are not `## Verdict` preconditions.

**`C#` ledger.** Each `C#` row carries its comment `id` and the `updated_at`
it was minted against; the post-push diff (`post-selection-loop.md`
`### Re-render`) runs against this ledger, never against the report text.
States rendered under a `C#`: a triage label (`already-addressed` /
`reasonable` / `judgment-call`) with a drafted reply; `superseded by C<new>`;
`withdrawn`; `pending`; `reviewer failed (<conclusion>)`. Superseded and
withdrawn rows keep rendering for the rest of the run, so a sticky bot's
chain reads `C1` (old verdict) `superseded by C3`, `C3 pending`, then
`C3 superseded by C5`, `C5 <label> -> <reply>`. The last four states carry no
reply and are not replyable: `reply all` and ranges skip them silently; an
explicitly named non-replyable `C#` is refused with its state named and the
menu re-renders; reply courses are omitted when no replyable `C#` exists.

`F#` items carry an owner (pr-author | tracker | human) so follow-ups don't
evaporate; when no tracker tool resolved, the report itself is their durable
home.

IDs are append-only for the run's lifetime: minted at first assessment, never
renumbered, never reused. A resolved finding keeps its ID annotated
`(fixed in <sha>)`; later rounds continue each namespace's sequence.

Empty groups say "None".

## Triage

A finding lands in `P#` only when it must be fixed before merge (correctness,
security, material performance trap, a convention the repo enforces);
improvements that don't change merge correctness are `F#`, whatever their
category. `[quality]` and `[performance]` on a `P#` are categories, never a
downgrade - every `P#` blocks. This triage bar governs findings the
orchestrator originates itself; it never re-triages a classification Phase 4
already made (see Precedence in `## IDs`).

## Dispositions

Any blocking conclusion in the resolved check set (required or not - per
`../verification-brief.md` Section B, Evidence resolution table) withholds
merge from every pre-composed course until the user explicitly dispositions
it, and mints a `P#` - except the reviewer check. claude-code-action's sticky
mode runs on `pull_request` events, so its job is also a check run: a failing
check whose run id (from its `url` / `detailsUrl`) matches a `reviewer failed`
`C#` row, or whose `workflowName` equals the recorded reviewer `workflowName`
while that run is `reviewer failed`, is inert when it is the only failing
check mapping to that run id (two or more failing checks on one run id: none
inert, each stays a `P#`, fail-safe) - no `P#`, no withhold, one `## Evidence`
line `reviewer check <name> failed - inert (reviewer failure never withholds)`.
With no sibling `success` left, evidence resolves to the Fallback row, not
Failed CI. Reviewer failure never withholds merge; GitHub-enforced
restrictions still apply.

An undispositioned failing check in the resolved set is `P#` `[test]`
referencing the check name; it is never a target of a worktree `fix`. Close
failing checks by disposition, not by fix: the user's Phase-4 disposition
annotates the same ID rather than closing it outright.

| Disposition | Annotation on the `P#` | Counts against unfixed-blocker set | Merge course | Fallback local run |
|---|---|---|---|---|
| undispositioned failing check | none yet | yes | withheld from every pre-composed course | none |
| flaky | `(dispositioned: flaky)` | excepted - no longer counts against "every `P#` blocks" or "every blocking finding fixed" | only the custom row naming the disposition explicitly; no pre-composed course restores | none |
| real | `(dispositioned: real)` | still counts - `P#` keeps blocking | withheld until the check is green | none |
| CI-infrastructure-broken | `(dispositioned: ci-infrastructure-broken)` | still counts - `P#` keeps blocking; the checks themselves are untrustworthy | withheld until the fallback run is green | triggers the fallback local run, and merge stays withheld until that fallback produces green evidence |
| pending required check | mints no `P#`, is never dispositioned | not applicable - not dispositionable | withheld; auto-lifts the moment it turns green, or converts to an undispositioned failing check with its own `P#` on failure | none |
| reviewer check failed (matches a `reviewer failed` `C#`) | mints no `P#`, is never dispositioned | not applicable - inert | not withheld; GitHub-enforced restrictions still apply | none |

A pending required check is wait-until-green, not dispositionable. While
pending, the report notes it under Evidence.

The evidence decision is independent of the merge decision: a green check
elsewhere in the resolved set still satisfies verification evidence while a
pending required check withholds merge. The CI-sufficient path changes no
consent surface: still read-only, no auto-merge, no posting, no menu change
beyond the third disposition.

## Payloads

"Drafted fixes / review" holds, per finding ID, the concrete edit (for
`fix`), the reviewed doc-drift edit (for `push-docs`, keyed to its `L#`), or
the reply text (for `reply`) - each keyed to its finding ID, one selection
mapping 1:1 to its payload.

A posted review body is not itself a finding: compose it at post time from
the ID'd `P#`/`L#` findings being addressed - one summary sentence, then the
numbered findings, ending on the fix or asked action - and give it its own
non-finding slot of this section.
