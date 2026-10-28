# Finish a header-linked spec PR

Consume the selected spec path resolved in Input; perform no second discovery. A `## Rework record` wins over `**PR:**` (record wins when both exist): follow the ordinary rework path. For a header-only `**PR:** <owner/repo#N>`, use the header's repository for every gh call and run this check before Step 1 verification:

```bash
gh pr view <N> -R <owner/repo> --json number,url,state,isDraft,headRefName,baseRefName
```

Stop on query failure. Require OPEN, otherwise print `PR #N is <state>; the branch cannot be pushed to it.` Require headRefName == `$FEATURE`, otherwise stop naming both branches. Retain the live baseRefName for Step 3 (skip common-base probing), sealing, and squash. Run full ordinary verification for a header-only PR, not rework-scoped verification. Keep ordinary closure/conformance gates.

## Menu and preflight

At Step 4 fetch `git -C "$WORKTREE" fetch origin` and prove `git -C "$WORKTREE" merge-base --is-ancestor origin/<headRefName> HEAD`. Stop on fetch failure or proof exits other than 0/1. Exit 1 omits rows 1/2 and prints `Withheld: push - origin/<headRefName> is at <sha7>, local HEAD at <sha7>; a non-force push cannot land`; retain numbers 3-5. A hidden 1/2 gets the clarifying question naming rendered rows. Recompute this proof on every menu return.

Render exactly these five rows (plus ordinary nonblocking informational lines):

```text
Implementation complete. What would you like to do?

1. Push to PR #N and mark it ready for review
2. Push to PR #N, keep it a draft
3. Squash-merge to <base-branch> (no PR, no surviving branch; orphans PR #N - close it by hand)
4. Keep the branch as-is (I'll handle it later; nothing is pushed)
5. Discard this work (removes the worktree and local branch; the PR branch on origin is untouched)
```

For observed isDraft false replace row 2 with `2. Push to PR #N (already ready for review)`. Never convert ready to draft. Map rows 3-5 to ordinary Options 3-5, retaining typed discard confirmation and Step 6 ownership/cleanup. Option 3 squash seal uses `--option squash --base origin/<baseRefName>` and the selected spec.

## Push rows 1/2

Run the ordinary strip-and-seal block first, with `--option pr --base origin/<baseRefName>` and the selected spec. Preserve every seal failure stop. Then push non-force:

```bash
git -C "$WORKTREE" push --no-follow-tags origin HEAD:refs/heads/<headRefName>
```

Only after successful push on row 1 run `gh pr ready <N> -R <owner/repo>`. Row 2 pushes only. Report a rejected push once, skip ready, and return to the menu without force or automatic retry. On ready failure report the completed push and that the PR remains a draft for manual action or a later retry; preserve checkout. Preserve the PR body without a Rework block. Complete ship after successful delivery; keep the worktree for both push rows.
