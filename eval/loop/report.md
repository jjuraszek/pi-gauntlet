# eval report: loop (selected samples only)

Both replay models met every candidate must-hold in the four selected samples. These are text replays of supplied observations, not live dispatch or tracker evidence.

| Sample | Observed behavior |
|---|---|
| [tracker-boundary](results/tracker-boundary/report.md) | Both replies repaired rejected returns without a tracker call, including on resume. |
| [tracker-refresh](results/tracker-refresh/report.md) | Both replies kept the one seed call and projected the returned row before retry. |
| [tracker-verify](results/tracker-verify/report.md) | Both replies handled repair, conformance and reopened rows without an extra ledger list call. |
| [seed-dispositions](results/seed-dispositions/report.md) | Both replies seeded the acceptance rows without assigning Integration entries. |
