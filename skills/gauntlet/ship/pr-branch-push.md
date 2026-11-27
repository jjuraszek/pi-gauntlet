# PR-subject row 1: Push to the PR branch

For the close-absorbed-PR question, start the message with `gauntlet: gate=ship/pr-subject-row-1`. Read and apply [menu-layout](../menu-layout.md). Do not report `done pushed` while this gate awaits an answer. Capture the scoped verification set and accepted-complete task/thread evidence before the strip. Refetch threads per recorded PR using the paginated single-`$n` query (one invocation per PR) owned by [pr-head](../pr-head.md); retain PR attribution and use the query's location rendering. For home, use the table below and omit threads now resolved on GitHub. For members, copy recorded dispositions and mark newly resolved or newly opened states from the refresh; never use home's first-parent history as member-fix proof.
| Refetched thread / evidence | Resolution |
|---|---|
| Recorded `fix`, matching task title carries id, task accepted by spec and code review and `complete`, with an explicitly recorded fix SHA | `fixed in <sha7>` |
| Same accepted-complete task, no recorded fix SHA | `fixed (task "<title>" complete; no single commit names <thread id>)` |
| Missing or incomplete task; recorded `keep open`; newly opened thread | `still open` |
| Recorded `decline` | `declined - <reason>` |
| Successful fetch, empty set | `Threads: none` |
| Fetch failure | `Threads: not fetched (<reason>)` |
Emit `fixed in <sha7>` only when the rework flow actually recorded that fix SHA for the thread, for example in the plan task's receipt field. Use the accepted-complete fallback when no SHA is recorded; do not search commit messages. A touched file alone is not completion proof.
Run the [existing strip-and-seal block](ship.md#strip-the-plan-seal-the-record-options-1-3) with `--option pr --base origin/<baseRefName>` and the selected spec; retain its stop-on-error behavior. This seal measures the whole PR, not rework-only; never use PRE_REWORK_HEAD as its base. Then probe each recorded PR with its own number using `git -C "$WORKTREE" rev-parse -q --verify refs/gauntlet/pre-rework/pr-<N>`; only when absent, run `git -C "$WORKTREE" update-ref refs/gauntlet/pre-rework/pr-<N> <PRE_REWORK_HEAD>` with that PR's original SHA. Preserve existing refs and stop on command error or update-ref failure. Push only home with the preflight-selected form: lease case `git -C "$WORKTREE" push --no-follow-tags --force-with-lease=<home headRefName>:<PRE_REWORK_HEAD> origin HEAD:refs/heads/<home headRefName>`; other admitted cases (including merge records) `git -C "$WORKTREE" push --no-follow-tags origin HEAD:refs/heads/<home headRefName>`.
Save the pushed home head SHA on success. A lease refusal (`stale info`) skips body editing and closure, names members left open, preserves the worktree, and returns with row 1 withheld: `push withheld: origin/<headRefName> moved past <PRE_REWORK_HEAD7>`; no retry, no reset. Report any other rejected push once, skip body editing and closure, name members left open, and return to the menu without retrying or forcing. Preserve the worktree.
After a successful push, fetch only home's description fresh with `gh pr view <N> --json body` in the record's repository. Decode the JSON body without trimming or shell command substitution (which loses trailing newlines). Resolve `SCRATCH` for `$WORKTREE` through [scratch folder](../return-file.md#scratch-folder), then create a body file with `mktemp "$SCRATCH/pr-body.XXXXXX"`; preserve the existing body bytes, then append one blank line and this block. Reconcile `## Integration` per [Option 1](ship.md#option-1-push-and-create-pr) in that edit: leave a matching section alone; otherwise remove the obsolete block, if any, and carry the spec's current section at the end of the appended Rework block:
```markdown
## Rework

Before: <PRE_REWORK_HEAD> (local ref `refs/gauntlet/pre-rework/pr-<N>` in the rework checkout)
Absorbs: #13 (<url>), #14 (<url>)
Spec: <spec path> at <HEAD7>
Keeps: <from the record>
Changes: <from the record>
Dropped claims: <none | one "No longer true: <claim>" line per dropped claim>
Verification: scoped - <commands>; CI on this push holds the full run. Telemetry: whole PR against <baseRefName>.
Threads:
#<N>:
- <path>:<line> - <resolution for this PR>
```
Instantiate `Absorbs:` from every non-home pair in record order; omit it for N=1. Label each PR Threads list `#<N>:` for N>1; retain the unchanged unlabeled list for N=1. Put `supersedes the description above` on the block's second line only when every original claim is dropped. Use `Threads: none` or `Threads: not fetched (<reason>)` instead of the list for those outcomes. Run `gh pr edit <N> --body-file <scratch-file>` in the record's repository without another approval. On body fetch/edit failure, keep the push and print the block for manual paste with the error; never replace the description with just the block. Skip closure on body fetch/edit failure and name members left open.
Only after a successful push and successful home body edit, refresh each member with `gh pr view <N> -R <owner/repo> --json state,headRefOid`. Fetch each refreshed head that is not yet local (`git -C "$WORKTREE" fetch origin <current headRefOid>`; for a fork member use its head repository URL) before the ancestry test. Skip and name a member whose head fetch fails: `#14 skipped: head <sha7> not fetchable`. Require state `OPEN` in both modes; otherwise name `#14 skipped: state CLOSED`. In merge mode require `git -C "$WORKTREE" merge-base --is-ancestor <current headRefOid> <pushed home head>` exit 0; otherwise name `#14 skipped: head moved to <sha7>, not in home`. In rebase mode require current head equal to its recorded pre-rework head; otherwise name `#14 skipped: head moved to <sha7>`. Validate that member's recorded replay outcome:
| Outcome | Rebase eligibility proof |
|---|---|
| `<first7>..<last7>` | `git -C "$WORKTREE" merge-base --is-ancestor <last7> <pushed home head>` exits 0. |
| `empty` or `(already landed)` | `git -C "$WORKTREE" cherry <pushed home head> <pre-rework head>` succeeds with no `+` line. |
| Missing, unresolved, pending, or failed proof | Withhold closure and name the member and reason. |
Treat unexpected Git exits and failed refreshes as errors, withhold closure and report the reason; merge nothing implicitly.
Ask nothing when none qualify or N=1. Otherwise render one gated question before marking ship complete. Instantiate each actual eligible target and its exact comment using its recorded pre-rework SHA7 and home's number/URL; the two-member rendering is:
```text
gauntlet: gate=ship/pr-subject-row-1
Close the absorbed PRs with these comments?
#13: "Reworked into #12 (<home url>) by the gauntlet; this PR's commits are merged there and remain reachable as <#13 pre-rework sha7>."
#14: "Reworked into #12 (<home url>) by the gauntlet; this PR's commits are merged there and remain reachable as <#14 pre-rework sha7>."
1 - yes, close #13, #14
2 - no, leave them open
```
In rebase mode replace each displayed comment with `Reworked into #12 (<home url>) by the gauntlet; this PR's commits are replayed there as <first7>..<last7>.` for a range, or `Reworked into #12 (<home url>) by the gauntlet; this PR's commits are already contained there.` for `empty` or `(already landed)`. Keep the displayed merge comments in merge mode.
On `1`, re-fetch state/head immediately before each `gh pr close <N> --comment "<that line's text>" -R <owner/repo>`. Execute only the displayed target/text pairs in the displayed repository; never pass `--delete-branch`. Skip and report any target whose state or head changed after approval, or whose refresh fails, rather than acting under stale authorization. Report a failed close once, never retry. On `2`, leave members open. Then mark ship complete and report each member outcome: `Closed: #13, #14`, `Closed: #13; #14 close failed (<error>)`, or `Member PRs #13, #14 left open.` Instantiate actual members in all summaries, including partial outcomes and skipped members; for N=1 omit every member line and question.
Rows 2-6, withheld/failed ancestry, withheld/rejected push, and failed body fetch/edit never offer closure; name untouched members with `Member PRs #13, #14 left open.` Post no review-thread replies, merge no PR, change no ticket state, and close no PR other than the absorbed members through the question above.
