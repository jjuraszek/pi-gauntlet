# gatekeep-pr session scan

Pre/post measurement for gatekeep-pr runs from pi session logs; the full suite does not run these.

| Script | Prints |
|---|---|
| `scan.mjs` | one row per user-invoked `/skill:gatekeep-pr` run: start, repo, argument, minutes to first report, assistant turns, subagent dispatches, cost, model; inputs default to the sessions root; `GK_ROWS_OUT=<path>` saves the rows JSON |
| `split.mjs <session files>` | medians per skill version bucket: time to first report, minutes inside `gh` poll/watch calls, dispatches, PR-body blocker share, body-only reports |
| `where.mjs <session files>` | per run: total, subagent, bash, CI-wait, and test minutes |

Sessions root: `PI_SESSIONS_DIR` (default `~/.pi/agent/sessions/`, the pi session logs under `~/.pi/agent/sessions`). A run is one user-invoked `/skill:gatekeep-pr` turn; the skill version is attributed from the skill text that turn loaded. Metrics: time from invocation to the first rendered report, subagent dispatches, minutes inside `gh` bash calls, reports whose Blockers are all `target: description`.

Protocol (spec `## Tests`): three open PRs, each gated twice on the same head and body with CI finished - v7.10.0 first, then the branch via `pi install -l` - picks `stop` at the first menu for the first-report metric and one `fix` for the body-blocker metric. Bar: branch median time to first report at or under 15 min and zero body-only reports. Anonymized rows go in the PR body.
