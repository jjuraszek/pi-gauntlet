# telemetry-branch-seed evidence status

`baseline.json` and `candidate.json` contain fresh replays of the five-row sample from `node eval/run.mjs gauntlet-resume telemetry-branch-seed`, using the merge-base with origin/main. The two model cells are `improved` and `unchanged`; all five candidate must-hold facts (`metadata`, `shipped`, `branch`, `cached`, `stop`) hold in both cells.

The candidate reads Git common-directory or jj-only local metadata after failed publication. When no local record exists, it fetches the telemetry branch, retains the cached ref on fetch failure, and degrades to the local-only check without a ref. The sample covers branch-only shipped, cached abandoned and unavailable-branch admission alongside the local-record cases. The matching sample-scoped summary is in `../../report.md`; this run provides partial, narrated coverage, not target-wide or live tool-execution proof.

The runner retains an older remote-fetch judgment archive under `candidate.json`'s `refresh` field. That archive has different input and fact hashes and is not acceptance evidence for the current sample. Use the top-level `outputs` and `judge` fields for current results.
