bundle+: skills/gauntlet-resume/reference/seed.md

Exercise the seed route's Step 3 (Not shipped) in isolation for each captured metadata lookup below. Earlier admission checks are outside this scenario. The seed is `/tmp/widget/doc/specs/2026-01-02-widget.md`, with `<primary>` `/tmp/widget` and `<rel>` `doc/specs/2026-01-02-widget.md`. Telemetry is enabled. No checkout YAML file exists and publication has failed, so no fetched telemetry record exists. Do not execute tools: state the local path-resolution/read operations you would request and the resulting user reply for each row.

| Row | Captured path resolution | Retained record |
|---|---|---|
| Git common directory | `git -C /tmp/widget rev-parse --git-common-dir` succeeds with `.git`, resolved relative to `/tmp/widget`. | `/tmp/widget/.git/gauntlet/telemetry/doc/specs/2026-01-02-widget.yaml` contains `shipped_at: 2026-01-03T10:00:00Z`; local commit creation failed and the sealed source file remains. |
| jj-only metadata | `git -C /tmp/widget rev-parse --git-common-dir` fails; `jj root` in `/tmp/widget` succeeds with `/tmp/widget`. | `/tmp/widget/.jj/gauntlet/telemetry/doc/specs/2026-01-02-widget.yaml` contains `shipped_at: 2026-01-04T11:00:00Z`; the sealed record remains locally. |

No worktree creation, tracker operation or gate reconstruction has run yet. Stop at the first required decision for each row; do not continue a hypothetical flow.
