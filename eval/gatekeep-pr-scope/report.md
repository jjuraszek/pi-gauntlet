# eval report: gatekeep-pr-scope (partial run: cleanup-after-approve)

for: 41ac0349b50f7d2e8e900bfdb94ac4b06b94779ce7e72fa549866fe9b5cd2430

wall: 45s

## Change

Route PR sets through the pi-only batch procedure before the unchanged single-PR pipeline. Preserve all scope-target verdicts and existing facts.

Terminal gatekeep-pr menus (own merge, approved, merged or closed at step 1) offer cleanup as row 1 recommended; the pick tears down the gate's worktree and local branch, fast-forwards the base, then runs the overrides file's ordered cleanup items with issue, pr, and merge-sha placeholders substituted and guarded steps skipped with a reason. stop under a terminal menu leaves the checkout as found and names it.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| cleanup-after-approve | anthropic/claude-opus-5-5 | unchanged | 9321 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held) |
| cleanup-after-approve | github-copilot/gpt-6.1-sol | unchanged | 11031 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held) |

## Feedback

- cleanup-after-approve / anthropic/claude-opus-5-5: Nothing moved: After still offers cleanup as row 1 [recommended] immediately after the approve exits 0, still prints `close ticket: skipped - needs a landed change` and `release: skipped - needs a landed change` from the landed-change guard, and still prints `branch: skipped - PR not merged` with no `git branch -D` anywhere. The After wording adds a pre-menu refresh that re-renders the Delivers/Verdict block above the terminal menu and relabels the base step as `pull main` in the menu row while the result line still says `base:`; neither affects the facts, but if you want the menu row and the result line to stay traceable to each other, keep one label (`base (skipped - PR not merged)` or `base: pull main`) in both places. The post-cleanup stop row also narrowed from 'worktree and branch stay' to 'local branch csv-export stays', which is correct since the worktree is gone - keep that.
- cleanup-after-approve / github-copilot/gpt-6.1-sol: Nothing moved: After still offers cleanup as row 1 [recommended] immediately after the approval succeeds, prints 'branch: skipped - PR not merged' and 'base: skipped - PR not merged' with no git branch -D, and prints both 'close ticket: skipped - needs a landed change' and 'release: skipped - needs a landed change'. The Change's terminal-menu procedure (teardown worktree, guarded steps skipped with a reason, stop leaving the checkout as found) is delivered in both the menu row text and the step ledger. Two wording observations that do not affect the facts but could in future runs: After re-prints the full Delivers/Nits/Verdict block before every menu and adds a long pre-menu refresh command list with a placeholder <headRefOid>; if you want to keep the output tight, consider emitting the refresh commands once (or only when the fixture supplies a real SHA) and reprinting only the menu after cleanup, since the Before wording showed the facts hold without the repetition. Also, After's cleanup row packs the skip reasons inline in parentheses, which is fine, but keep the 'because the PR is not merged' phrasing so the branch/base skip reason stays explicit in the row as well as the ledger.

exit: 0
