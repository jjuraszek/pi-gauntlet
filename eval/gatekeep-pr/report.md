# eval report: gatekeep-pr (partial run: plain-report)

for: b0b184db21bc8d5a2905cef03df6cadf0ecdb346d59fa4c0b9a4b35a3d96ecee

wall: 59s

## Change

Replace gatekeep-pr's labeled report and evidence lines with whole-sentence prose that preserves scope, role, prior-review and sync facts, concrete findings and one standing sentence before the choices. Translate internal vocabulary and field/value pairs in reports and menus; keep full evidence behind show evidence and distinguish CI from local verification. Preserve numeric selection, recommendation ordering and machine markers. Keep assess's consequence free of self-approval promises and retain the recommendation tag in the final menu.

Select only plain-report for this increment. Its three snapshots cover a repairable report with a running required check and prior sync, a clean CI-backed final report, and a GitHub-blocked obstacle with no local repair. Other saved samples are historical evidence, not current coverage. This text-only replay makes no live PR, tracker or cleanup calls.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| plain-report | anthropic/claude-opus-5-5 | improved | 21595 | prose: fails -> holds (intended change); role: holds -> holds (held); sync: fails -> holds (intended change); scope: holds -> holds (held); findings: holds -> holds (held); standing: fails -> holds (intended change); language: fails -> holds (intended change); choices: fails -> holds (intended change) |
| plain-report | github-copilot/gpt-6.1-sol | improved | 24183 | prose: fails -> holds (intended change); role: holds -> holds (held); sync: fails -> holds (intended change); scope: holds -> holds (held); findings: holds -> holds (held); standing: fails -> holds (intended change); language: fails -> holds (intended change); choices: fails -> holds (intended change) |

## Feedback

- plain-report / anthropic/claude-opus-5-5: After moves every expected fact and loses none: the labeled Delivers/Role/Prior review/Sync/Verdict/Evidence/Not offered lines are gone, the sync outcome is explained in a sentence, each snapshot ends with one plain standing sentence before the choices, raw tokens like merge_state_status CLEAN/BLOCKED, reviewDecision REVIEW_REQUIRED, 'binding pending' and 'assessed head' are translated, the final/obstacle hints no longer print CI run records, and the recommended choice sits on row 1 in all three menus (deliver, merge, stop). Role, scope, prior-review, sync and concrete findings are all preserved with the same specifics as Before, including maria's comment-73, the export_header failure attributed to a local run, the nit at src/export.ts:44, and C's 'no commits since' with 2 of 3 items. Two small refinements would make the wording tighter without risking any fact: in snapshot C the deliver choice could be shortened to a single clause about retrying only after GitHub lifts the block (the cap arithmetic reads as leaked bookkeeping even though it is translated), and the initial-menu trailer 'The selected work continues until a decision is needed' could name what that decision is (the next menu) so a reader does not have to infer it.
- plain-report / github-copilot/gpt-6.1-sol: After moves every expected fact to holds and keeps the ones Before held: the labeled Delivers/Role/Prior review/Sync/Verdict/Evidence lines are gone, the rebase is explained in a sentence, each snapshot ends with one standing sentence immediately before its choices, raw values like merge_state_status and binding pending are translated, the recommendation sits on row 1 under the correct initial/final/obstacle markers, and B and C correctly attribute evidence to CI with no local run claimed. Role, scope, prior-review counts and A's concrete findings are all preserved. Two small spots to tighten so nothing drifts in later increments: A's "No CI watch has run" and "One conflict stop was resolved" lean on near-internal vocabulary (watch, stop) that a reader can still infer from context — plainer forms like "CI has not been monitored yet" and "one merge conflict in src/export.ts was resolved" would remove any doubt; and A's blocker list uses a "## Blockers" heading, which the facts allow, but keep headings limited to comments, nits and blockers so the report never reacquires field scaffolding.

exit: 0
