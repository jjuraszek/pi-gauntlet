bundle+: skills/gatekeep-pr/review-baseline.md
bundle+: skills/chase-bug/reference/verdict-report.md
bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
bundle-: skills/gauntlet/commit-message.md
## Entry

Start at step 5 with the supplied review already returned. Integrate it, prepare any rejection note the skill requires, and render the first report through its note preview, stopping before the recommendation or menu. Narrate any note preparation before the report; finish the response at the note's last word. No helper, repair, post, cleanup or other external action runs. This isolates approach evidence and note composition, not later choices. Treat the note save and SHA-256 calculation as successful; read back the exact text you saved for the preview.

## Digest

- PR 88, OPEN, not draft, head aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, base main, author robin-example; viewer delta-example is a requested reviewer.
- Worktree /work/widgets-pr-88 is tracked-clean at the assessed head. Pre-menu refresh succeeds with head, body and base unchanged. course null, work_started false, reject_withdrawn false, reject null. No prior review, comments, nits or other blockers exist.
- PR intent: update the search index when catalog entries change and let operators export the index on demand. Both behaviors are implemented and tested; exact-head CI is green and the verifier matched the claims. No spec is selected; scope source pr retains this intent.
- Merged rubric is the shipped baseline with no REVIEW.md overlay.
- Base file docs/architecture.md exists. At line 12 it says the catalog is owned by the catalog store; other consumers receive changes through its change feed. git cat-file -e origin/main:docs/architecture.md exits 0.
- The PR adds a nightly job with its own catalog table for indexing. It also adds a lasting export queue, scheduler and worker. Operators only need an on-demand download, which fits the existing export handler without a queue. Source and tests confirm these mechanisms and the stated smaller alternative.
- The review's native verdict is SHIP with no native findings. The appended section is:

```text
## Approach conflicts
A1: Second mechanism
builds: A nightly indexing job keeps its own catalog table.
path: docs/architecture.md:12
conflicts with: Other consumers read catalog changes through the owner's change feed.
instead: Drop the catalog copy and nightly job and update the index from the change feed.
replaces: main mechanism
A2: Needless machinery
builds: An export queue, scheduler and worker serve on-demand downloads.
smaller: Extend the existing export handler to stream a download on request; it gives operators the same export without a queue or background worker.
instead: Remove the export queue, scheduler and worker and stream downloads from the existing handler.
replaces: main mechanism
```

## Arguments

`88`
