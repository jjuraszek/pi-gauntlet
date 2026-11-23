# Finish a header-linked spec PR

## Input

Resolve the selected run spec once: use the carried spec path or the active plan/ledger's path-only `**Spec:**` header; with neither, enumerate candidates under resolved `flowGuards.specDirs`, read them, and ask on ambiguity. Carry this path through finish; perform no second discovery. Read its header before announcing or starting ship. An exact `**Engine:** deferred` before the first `##` stops with `spec approved for handoff only - run brainstorming #N`; perform no phase change, verification, strip, seal, or push. A `## Rework record` wins over `**PR:**` (record wins when both exist): follow the ordinary rework path. For a header-only `**PR:** <owner/repo#N>`, use the header's repository for every gh call and run this check before Step 1 verification:

```bash
gh pr view <N> -R <owner/repo> --json number,url,state,isDraft,headRefName,baseRefName
```

Stop on query failure. Require OPEN, otherwise print `PR #N is <state>; the branch cannot be pushed to it.` Require headRefName == `$FEATURE`, otherwise stop naming both branches. Retain the live baseRefName for Step 3 (skip common-base probing), sealing, and squash. For N>1 `## Legs` blocks, read [Coordinated finish](legs.md) now: apply its activation/identity checks and "Verification and closure - Steps 1 and 3.5" instead of home-only verification. Retain every leg's recorded commands, own checkout cwd, Rules, original owned ACs, receipt-proven exemptions and audited-head/tree freshness checks. For one block or no `## Legs`, run full ordinary verification, not rework-scoped verification. Keep ordinary closure/conformance gates.

## Menu and preflight

At Step 4, the header-linked route bypasses both menus below the amendment digest in SKILL.md and uses this preflight, five-row menu, and rows 1/2 push recipe; retain the shared amendment digest and informational lines. At Step 4 fetch `git -C "$WORKTREE" fetch origin` and prove `git -C "$WORKTREE" merge-base --is-ancestor origin/<headRefName> HEAD`. Stop on fetch failure or proof exits other than 0/1. Exit 1 omits rows 1/2 and prints `Withheld: push - origin/<headRefName> is at <sha7>, local HEAD at <sha7>; a non-force push cannot land`; retain numbers 3-5. A hidden 1/2 gets the clarifying question naming rendered rows. Recompute this proof on every menu return.

Render exactly these five rows (plus ordinary nonblocking informational lines):

```text
Implementation complete. What would you like to do?

1. Push to PR #N and mark it ready for review
2. Push to PR #N, keep it a draft
3. Squash-merge to <base-branch> (no PR, no surviving branch; orphans PR #N - close it by hand)
4. Keep the branch as-is (I'll handle it later; nothing is pushed)
5. Discard this work (removes the worktree and local branch; the PR branch on origin is untouched)
```

For observed isDraft false replace row 2 with `2. Push to PR #N (already ready for review)`. Never convert ready to draft. Map rows 3-5 to ordinary Options 3-5, using legs.md's coordinated squash/keep/discard mechanics for N>1 blocks; retain typed discard confirmation and recorded ownership/cleanup. Option 3 squash seal uses `--option squash --base origin/<baseRefName>` and the selected spec.

## Push rows 1/2

For N>1 blocks, use this sequence instead of the standalone strip-and-seal recipe. Complete steps 1-2 for each companion in block order before the next companion. Start no companion fan-out for a home action withheld by menu preflight.

1. Apply legs.md "Execute one choice" steps 1-2 to companions in block order: validate receipts, check freshness, push `origin <branch>` and create each missing PR in its own worktree. Add `--draft` on row 2 creates; create ready PRs on row 1. Write home-owned receipts after delivery. Keep each companion body's `Home:` pointer. Run no companion strip or seal.
2. Reconcile receipt-proven companions too: query `gh pr view <url> --json state,headRefOid,isDraft` in that repository and apply legs.md's live identity/head/verification proofs. On row 1 run `gh pr ready <url>` for a valid draft, then refresh its receipt before home delivery. On row 2 leave already-ready companions unchanged; never redraft. A closed receipt takes legs.md's disposition stop, not a skip or duplicate create.
3. Collect every companion URL, including validated skips, before stripping/sealing home exactly once: use `--option pr --base origin/<baseRefName>`, the selected spec and one `--leg <repo>=<pr-url>` per companion. Preserve legs.md's existing-seal result comparison. On seal failure print `Not shipped: <home repo> <bin output>` and stop before home push, retaining companions and receipts. Never seal partial results or run the standalone home seal as well.

For one block or absent `## Legs`, run the ordinary strip-and-seal block first, with `--option pr --base origin/<baseRefName>` and the selected spec. Preserve every seal failure stop. After successful sealing, push home non-force:

```bash
git -C "$WORKTREE" push --no-follow-tags origin HEAD:refs/heads/<headRefName>
```

Only after successful push on row 1 run `gh pr ready <N> -R <owner/repo>`. Row 2 pushes only. Report a rejected push once, skip ready, and return to the menu without force or automatic retry. On ready failure report the completed push and that the PR remains a draft for manual action or a later retry; preserve checkout. For coordinated delivery, report all shipped companions too and retain receipts. Companion create/ready failures stop before home push with legs.md's `Not shipped: <repo> <reason>`; preserve delivered companions and receipts, report untouched members and perform no rollback. Apply the same retained-results reporting to home push failure.

Preserve the home PR body byte-for-byte without a Rework block. For N>1 blocks on this header-linked route only, waive legs.md's home-body companion-URL insertion; retain each companion's `Home:` pointer. For coordinated delivery, print `Shipped: <repo> pr <url>` for every delivered member, companions first and home last. Tell the user to keep this summary for cross-repo review because the home body does not list companions and receipts are removed after successful home delivery under legs.md. Complete ship only after successful delivery of every member; keep every worktree for both push rows.
