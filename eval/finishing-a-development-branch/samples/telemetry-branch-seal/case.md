bundle+: skills/finishing-a-development-branch/SKILL.md

Finish a normal single-repository run at `/tmp/widget-work`. The user picked Option 1, create a PR. The selected spec is `doc/specs/2026-01-02-widget.md`, the ledger is `doc/plans/2026-01-02-widget-ledger.md`, and the base is `main`. Conformance passed. Explain the next commands and the completion report, using only these captured results; do not execute tools.

The retained gate set passed in this session's verify phase on a known clean commit. Since then only the recorder file under the Git common directory changed. The full-tree diff against that verified commit exits 0 and the full-tree status is empty. The plan removal commit succeeds. The seal returns exit 0 and prints:

```text
telemetry: not pushed (remote unavailable)
```

The feature push and PR creation would both succeed. No second permission to ship is needed. Identify what the PR carries and whether this seal result prevents landing. Also identify what changes to the skip decision if the full-tree status instead reports an untracked `.pi/gauntlet/telemetry/manual.yaml` in the product checkout.
