bundle+: skills/gatekeep-pr/review-baseline.md
bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
bundle-: skills/gauntlet/commit-message.md
## Entry

Start at step 5 with the supplied review already returned. Integrate it and render the first report and menu for each independent checkpoint below. Put each checkpoint's label outside its message and start the message with its gate line. Stop at each menu's hint. No human has picked a row; simulate no repair, post, merge, cleanup, watch or helper. The completed refresh and source checks below need no further narration.

## Shared observations

- PR 88 in example/widgets is OPEN, non-draft, head aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, base main. Viewer delta-example is a requested reviewer, not the author; robin-example is the author and no other users or teams are requested.
- The worktree /work/widgets-pr-88 is tracked-clean with no unpushed commits. Pre-menu refresh succeeds with head, body and base unchanged. course null, work_started false, reject_withdrawn false, reject null. No prior review, comments, nits, contract proposal or PR-named after-merge step exists.
- Permissions: WRITE, head pushable, helpers available, maxFixRounds 5, squash merge policy. GitHub reports MERGEABLE and CLEAN. No merge prerequisite fails except what the checkpoint explicitly names.
- Scope source pr: the PR adds an on-demand catalog download through the existing export handler. No spec is selected, no observation is deferred, and the verifier matches that claim. Tests and docs cover the behavior except for B's concrete defect below.
- The merged rubric is the shipped baseline with no REVIEW.md overlay. The approach check found no conflict. Every checkpoint's review ends with the literal appendix:

```text
## Approach conflicts
none
```

| Checkpoint | Completed evidence and native review |
|---|---|
| A | Exact-head CI passed, native verdict SHIP, no findings. All merge prerequisites hold. |
| B | Exact-head CI passed, native verdict DO-NOT-SHIP. One ordinary Moderate defect: an empty catalog raises an exception instead of returning an empty download (src/export.mjs:24). The scoped test src/export.test.mjs, test name empty catalog download, demonstrates it. A concrete source repair is drafted and preserves the PR's settled intent; no author decision is needed. |
| C | Native verdict SHIP with no findings. The required ci / test check on the assessed head is still running and binding. Its result is the only thing preventing readiness; there is no failed check. |

## Arguments

`88`
