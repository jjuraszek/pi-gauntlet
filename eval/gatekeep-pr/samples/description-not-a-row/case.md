bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
## Digest

- harness: pi; fresh sequential helpers and gauntlet_setting available
- pr: { number: 83, title: "Reject unsigned events", body: "Reject unsigned events. The rejected path has a test. Keep this note.", headRefOid: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, baseRefName: main, state: OPEN, mergeable: MERGEABLE, mergeStateStatus: CLEAN }
- base_repository: orchard/widgets; viewer: { login: river-example, is_author: true }; permissions: { viewer_permission: WRITE, head_pushable: true }
- worktree: /work/widgets-pr-83; tracked-clean HEAD equals the assessed head; no unpushed commits, sync trigger, new comments or reviewer placeholders
- scope: { source: pr, original_intent: { title: "Reject unsigned events", body: "Reject unsigned events. The rejected path has a test. Keep this note." } }; code rejects unsigned events, but test/guard.test.mjs tests only the accepted path
- configuration: verification command npm test; closureReview.maxFixRounds 5; timeout 15 minutes
- evidence: CI sufficient on the assessed head; claim K1 (rejected-path test exists) is contradicted; unrelated K2 (unsigned events rejected) is matched
- P1 is the only blocker: a description-target finding for K1. The selected drafted payload changes only `The rejected path has a test.` to `The rejected path has no test yet.` C1 has an unselected drafted reply. There is no file payload and no nit.
- retained same-run record: /tmp/gatekeep-83.record; course deliver from the human's numeric selection; repair.rounds_used 0; repair.syncs_used 0; both caps 10; assessed head/body match the digest; no finding spec or companion ledger exists
- simulations: hypothetical operations only. The first fresh pre-write read keeps head aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa but changes the actual body's last sentence to `Keep this updated note.` Every subsequent read keeps that head and updated note. The body write succeeds; its readback exactly matches the submitted body. A fresh claim-recheck helper on actual head/body returns K1 matched and leaves K2 matched. No file changes, commits, pending checks or other blockers arise.

## Entry

Narrate description-only delivery from the held course through the stale-proposal iteration and the next iteration's successful repair, readback and affected-claim recheck. Show actual body comparisons and the final body. Show whether P1 or C1 becomes a finding AC or ledger row, whether any finding artifact or file worker is created, and the retained round/sync counters. Stop at the next final menu with no terminal selection. Do not execute live operations. Keep the narration under 900 words.

## Arguments

`83`
