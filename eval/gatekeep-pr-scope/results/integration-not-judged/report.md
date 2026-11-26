# eval report: gatekeep-pr-scope (partial run: integration-not-judged)

for: 02ffb799ff2ffd5a86fcafc25504d8ac87ec8f895789c331a7885606773325d4

wall: 56s

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. With one ticket row absent from both spec sections, report `differs` for that original ticket row only. Omit Integration entries and their statuses from the report, evidence, and menus; retain the informational cross-check and actions already offered by the post-merge menu.

Select the contract from spec paths outside the PR body's Integration block. `integration-names-spec-path` checks that an absent path in a nested Integration line neither selects a contract nor blocks the gate. Rerun `integration-not-judged` and `post-merge-menu` to check that scope accounting and explicitly picked actions remain unchanged.

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| integration-not-judged | anthropic/claude-opus-5-5 | improved | 11683 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change) |
| integration-not-judged | github-copilot/gpt-6.1-sol | improved | 13801 | cross-check: fails -> holds (intended change); functionality: holds -> holds (held); entries: holds -> holds (held); claims: fails -> holds (intended change) |

## Feedback

- integration-not-judged / anthropic/claude-opus-5-5: After moved two facts in the intended direction and lost none. The cross-check now reads "differs on row 3" instead of "differs on rows 2, 3", so the tracker update is accounted for by its marked Integration entry and only the added column number shows as drift, still non-blocking. The claim dispositions now list only the importer's missing-id assertion as matched; the body's staging-total line no longer gets "unverifiable-pre-merge" and is no longer mentioned in the opening. Functionality held in both: missing-id rejection is covered from src/importer.mjs:12 and the test, the absent line number is the single gap and blocker, and neither the staging confirmation nor the column number adds a gap. Entries held in both, since no operational entry or the tracker update gets a coverage outcome or a blocker; After goes further by dropping Before's "PR-named after-merge steps" section and its sentence about other Integration items, as the Change intends. To keep this stable, keep the wording that says a verbatim, marked ticket row is matched once without being judged, and that anything under the body's Integration heading gets no claim disposition of any kind. Also keep the Row 1 phrasing that the staging confirmation is an observation left to /skill:check-delivery, so it cannot be read as either a gap or a coverage outcome. One risk to watch: After's cross-check says "row 3" without saying it is the ticket's row, next to AC outcomes that use spec row numbers, so writing "ticket row 3 (adds column number)" would remove the ambiguity.
- integration-not-judged / github-copilot/gpt-6.1-sol: After moved two facts in the intended direction and lost none. The cross-check line now reads "differs on rows 3", which names only the ticket row that adds the column number and no longer flags the tracker update, where Before said "differs on row 2". The material-claims list now holds only the missing-id assertion, which is matched against src/importer.mjs:12 and the test, where Before gave the staging-totals assertion an "unverifiable-pre-merge" disposition. Functionality held in both: rejection is covered, the line number is the single gap and blocker, and the staging confirmation is explicitly called not a pre-merge gap. Entries also held in both, since no operational entry or the tracker update receives a coverage outcome or raises a blocker. To keep these while delivering the Change more fully, keep the wording that counts a verbatim, marked ticket row as accounted for without judging it, and that gives no claim disposition to anything under the body's Integration heading. Two residual points need tightening. First, the cross-check renders as "rows 3" for a single row, so the singular/plural should be fixed. Second, After still prints the tag-the-release entry with "Resolution: open" in both the opening and the evidence block, which sits uneasily with "omit Integration entries and their statuses from the report, evidence, and menus". If that after-merge assignment is meant to appear only in the post-merge menu, say so explicitly, and state that such an entry never gets a covered/gap outcome so the entries fact stays safe.

exit: 0
