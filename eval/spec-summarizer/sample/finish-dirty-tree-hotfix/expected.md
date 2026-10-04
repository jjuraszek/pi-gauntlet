# Expected facts: finish-dirty-tree-hotfix

- f1: Developers can currently finish a branch using stale verification despite uncommitted source changes.
- f2: Reusing verification requires a successful check of a known clean commit in the current session.
- f3: Any later change outside telemetry requires verification to run again.
- f4: Telemetry-only changes remain exempt from rerunning verification.
- f5: Uncertain write history requires verification to run again.
- f6: The change is complete when a hidden staged edit can no longer bypass verification.
