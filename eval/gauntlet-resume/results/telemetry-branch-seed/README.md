# telemetry-branch-seed evidence status

`baseline.json` and `candidate.json` contain fresh replays of the current local-metadata sample from `node eval/run.mjs gauntlet-resume telemetry-branch-seed`. Both model cells are `improved`: `metadata` and `shipped` move from `fails` to `holds`, and `stop` remains `holds`. All three candidate must-hold facts pass in both cells.

The candidate reads Git common-directory or jj-only local metadata after failed publication, without a telemetry-branch fetch. The matching sample-scoped summary is in `../../report.md`; this run provides no target-wide or live tool-execution coverage.

The runner retains an older remote-fetch judgment archive under `candidate.json`'s `refresh` field. That archive has different input and fact hashes and is not acceptance evidence for the current sample. Use the top-level `outputs` and `judge` fields for current results.
