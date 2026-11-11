# eval report: gatekeep-pr-scope (partial run: cleanup-after-approve)

for: 1c5817f14a6cda876abbf9f16359759b71d586267873b398acb6608eb7aa8b63

wall: 16s

## Change

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and post-merge observations; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Coverage and authority

Coverage is sample-scoped, not a target-wide pass. cleanup-after-approve runs against the final skill text, and all its current must-hold cells hold on both models. Its D7 expectation states that unselected release and close-ticket overrides remain unrun and appear in the menu and closing not-run list; selecting cleanup executes only its worktree, branch and base sub-steps.

Preserved earlier-revision results: cleanup-closed-unmerged, cleanup-merged-at-step-1, cleanup-no-section, cleanup-null-issue, deferred-with-ref, deferred-without-ref, deviates, directional-dependency, elsewhere-settled, mixed-coverage, no-spec-quality, post-merge-menu and ticket-drifted. Their recorded skillSha identifies the revision that produced each result; they do not establish final-text coverage.

The caller excludes the two base-existing unchanged-mechanics failures in gatekeep-pr without a spec amendment. This target keeps its saved results; none of its current must-hold cells requires another run.

D8 baseline limitation: the frozen baseline uses the working-tree skillFiles list, with menus.md and without decision-menu.md. It does not establish the original 11-template flow. Judge candidate facts absolutely, not from improved or unchanged comparison direction. Mechanical preservation rests on the migrated deterministic assertions and selected candidate facts. No live PR or target-wide sweep runs.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| cleanup-after-approve | anthropic/claude-opus-5-5 | improved | 15742 | f1: holds -> holds (intended but unchanged); f2: fails -> holds (unplanned improvement); f3: holds -> holds (held) |
| cleanup-after-approve | github-copilot/gpt-6.1-sol | improved | 15012 | f1: holds -> holds (intended but unchanged); f2: fails -> holds (unplanned improvement); f3: holds -> holds (held) |

## Feedback

- cleanup-after-approve / anthropic/claude-opus-5-5: After keeps every fact Before kept and moves f2 to holds: the post-approve menu's "Skipped, not numbered" block states that close ticket needs the merge commit and release needs a landed change, the closing not-run list repeats those reasons with the commands, and the cleanup execution prints only worktree/branch/base lines instead of folding close ticket and release into cleanup's result lines as Before did (Before's not-run list also merely named `gh issue close` and `/skill:release` without the prerequisite). Two wording risks to tighten: the post-approve menu says "Pick one, or several separated by commas" while the Change asks for a single validated selection executed once, so prefer "Pick one"; and the cleanup commands run with `git -C <scratch>` while the menu promised "from the primary checkout", so use the primary path consistently to preserve the cleanup guard story.
- cleanup-after-approve / github-copilot/gpt-6.1-sol: After keeps every fact Before kept and repairs f2: Before listed close ticket and release as cleanup result lines ('close ticket: skipped - needs a landed change') and its closing 'Not run:' list merely named ticket closure and release without a reason, which reads as if those overrides were cleanup sub-steps that happened to be skipped. After moves the landed-change/merge-commit prerequisite into the menu text and into the closing not-run list, prints only worktree/branch/base/cleanup as result lines, quotes each override's configured command without invoking it, and still prints 'branch: skipped - PR not merged' with no git branch -D. The two-sentence opening uses behavior names rather than row numbers or AC labels while preserving the deferred reference and the post-merge speed observation. One wording nit that does not affect the facts: the menu says 'Pick one, or several separated by commas' while the handled reply is a single numeric selection; keeping 'Pick one' would match the single-selection execution model more precisely.

exit: 0
