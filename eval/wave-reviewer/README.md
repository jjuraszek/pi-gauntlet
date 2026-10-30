# wave-reviewer eval

Exercise integrated spec-clause and code-quality review on four synthetic scenarios.

| Sample | Contract |
|---|---|
| with-anchor | Select Task 4, not Task 40; combine task/leg Rules; block on a dropped in-slice requirement |
| partial-wave-ship | Review only wave-one clauses; omit later-wave requirements |
| unreadable-anchor | Reject an unreadable union member with its exact identity |
| without-anchor | Emit findings only; keep Minor-only SHIP and spec-observable test calibration |

Load the body of `agents/wave-reviewer.md` and the whole requesting-code-review `wave-reviewer.md` template as a headed assembly. Both files are candidate-only at the baseline (`new: true`). No baseline records are invented.

Process and record schema: [eval/README.md](../README.md). Verification runs the full target and owns generated `report.md` and `results/` records.
