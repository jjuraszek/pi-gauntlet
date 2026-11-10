# eval report: gatekeep-pr (partial run: plain-payloads)

for: fe358e7663fd355de996c77d65f132ac020aa311733e3cd6be4e5dfc2a223dfd

wall: 26s

## Change

Keep reports, menus and posted payloads unfenced. Remove the coverage template's fence without changing its heading, informational line or checkbox rows. Apply the shared wording rules to review findings and thread replies: trailing file/line locators in reviews, plain replies without internal fields or ids. Keep posting authority, freshness checks and protocol strings unchanged.

Select only plain-payloads for this increment. It exercises a selected review, a selected thread reply and a selected coverage comment as independent text-only snapshots, with no live PR or tracker write. Preserve all earlier sample results as historical evidence.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| plain-payloads | anthropic/claude-opus-5-5 | improved | 14084 | fences: fails -> holds (intended change); review: holds -> holds (held); reply: fails -> holds (unplanned improvement); coverage: fails -> holds (intended change); authority: holds -> holds (held) |
| plain-payloads | github-copilot/gpt-6.1-sol | unchanged | 10954 | fences: holds -> holds (intended but unchanged); review: holds -> holds (held); reply: holds -> holds (held); coverage: holds -> holds (intended but unchanged); authority: holds -> holds (held) |

## Feedback

- plain-payloads / anthropic/claude-opus-5-5: After delivers the Change cleanly: all three payloads are plain text under bare labels, the coverage block is reproduced verbatim with its heading, informational line and three unchecked rows in order, and the review keeps both findings with their consequences and trailing parenthesized locators. The reply also improved beyond the expected list — Before leaked the commit id 9c1e4f2 and the test name in a trailing parenthetical, which the 'plain replies without internal fields or ids' rule correctly strips; After says only that the header test passes in CI, acknowledges the question, and makes no merge promise. No fact regressed. One small wording note for the author: the reply capitalizes 'Maria' while the input gives the handle as 'maria'; if the skill wants to address the asker, prefer reusing the handle exactly as supplied or omitting the name, so the reply never invents a form of the name that was not in the thread.
- plain-payloads / github-copilot/gpt-6.1-sol: Nothing moved: both outputs render all three payloads unfenced, keep the coverage block verbatim with its heading, informational line and three unchecked rows, trail the review findings with (src/export.ts:31) and (docs/export.md:8), and keep the reply free of run ids, commit ids, BLOCKED and repair counters. The expected fences/coverage moves did not show up as failures in Before on this sample, so the After wording confirms rather than changes behaviour here. After's reply is a small improvement over Before, which appended a stray '(export_header)' locator to prose where the shared reply rule asks for plain sentences; After folds the test name into the sentence instead. One caution: After's opening review line 'before this PR can merge' edges toward merge-gating language — a wording like 'Two fixes are needed' alone keeps the request-changes intent without implying the reviewer controls merging, which is safer for the authority fact across other samples.

exit: 0
