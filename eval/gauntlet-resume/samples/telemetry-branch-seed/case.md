bundle+: skills/gauntlet-resume/reference/seed.md

Exercise the seed route's Step 3 (Not shipped) in isolation for each captured metadata lookup below. Earlier admission checks are outside this scenario. The seed is `/tmp/widget/doc/specs/2026-01-02-widget.md`, with `<primary>` `/tmp/widget` and `<rel>` `doc/specs/2026-01-02-widget.md`. Telemetry is enabled, `telemetry.remote` is `https://example.test/metrics.git`, and the product repo is `acme/widget`. No checkout YAML file exists. Do not execute tools: state the metadata lookup and ref fetch/read operations you would request and the resulting user reply for each row.

| Row | Captured path resolution | Retained record |
|---|---|---|
| Git common directory | `git -C /tmp/widget rev-parse --git-common-dir` succeeds with `.git`, resolved relative to `/tmp/widget`. | `/tmp/widget/.git/gauntlet/telemetry/doc/specs/2026-01-02-widget.yaml` contains `shipped_at: 2026-01-03T10:00:00Z`; local commit creation failed and the sealed source file remains. |
| jj-only metadata | `git -C /tmp/widget rev-parse --git-common-dir` fails; `jj root` in `/tmp/widget` succeeds with `/tmp/widget`. | `/tmp/widget/.jj/gauntlet/telemetry/doc/specs/2026-01-02-widget.yaml` contains `shipped_at: 2026-01-04T11:00:00Z`; the sealed record remains locally. |
| Ref-only shipped record | Git common directory resolves to `/tmp/widget/.git`; the local record is absent after seal committed and removed it. Fetch of `refs/telemetry/records` from the configured remote succeeds. | `acme/widget/brainstorming/doc/specs/2026-01-02-widget.yaml` on the fetched ref contains `shipped_at: 2026-01-05T12:00:00Z`. |
| Cached abandoned record | Same absent local record; fetch fails, but the last fetched ref exists. | The same ref path contains `abandoned_at: 2026-01-06T13:00:00Z`. |
| Unavailable ref | Same absent local record; fetch fails and no ref has ever been fetched. | No record is available. |

Must hold: keep both local-record stops without fetching, reject the ref-only shipped seed before admission, use the cached abandoned record after fetch failure, and continue the local-only check when no fetched ref is available.

No worktree creation, tracker operation or gate reconstruction has run yet. Stop at the first required decision for each row; do not continue a hypothetical flow.
