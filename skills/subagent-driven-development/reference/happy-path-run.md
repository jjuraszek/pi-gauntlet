# Happy-path run

   **Happy-path run - first action of this step, only when the plan header carries a `**Happy path:**` line or the diff selects a row.** The overrides file's `## Happy path` table (schema in the README overrides contract) names path-prefixed rows; the plan header's line is the plan-time default.

   1. Re-derive the row from `git -C "<worktree>" diff --name-only <base>..HEAD` (`<base>` = the branch point): two or more non-`cross-cutting` rows, or a path inside the `cross-cutting` row's own `Paths` and inside no other row's -> `cross-cutting`, taking precedence (no `cross-cutting` row -> no run and no outcome line); else paths inside exactly one non-`cross-cutting` row's `Paths` -> that row; none -> no run and no outcome line. Run the diff-derived row; when it differs from the header label, record `row: <diff-derived> (header: <label>)` in `summary.txt`.
   2. Substitute shell-quoted literal values for every placeholder in this one bash block: the absolute worktree path, command verbatim, first command token after leading `NAME=value` assignments, duration (default `10m`), diff-derived row, and optional header label (use the row label when absent). Derive the token from the declared command without evaluating it or parsing general shell grammar. Run the entire block in one tool call; do not carry shell variables between calls. Read its printed summary path and outcome for subsequent tools.

      <!-- happy-path-shell -->
      ```bash
      HP_WORKTREE={{HP_WORKTREE}}
      HP_CMD={{HP_COMMAND}}
      HP_TOKEN={{HP_TOKEN}}
      HP_DURATION={{HP_DURATION}}
      HP_ROW={{HP_ROW}}
      HP_HEADER={{HP_HEADER}}
      HP_DIR=$(mktemp -d) || exit 1
      HEAD=$(git -C "$HP_WORKTREE" rev-parse HEAD) || exit 1
      HP_LABEL=$HP_ROW
      if [[ "$HP_HEADER" != "$HP_ROW" ]]; then HP_LABEL="$HP_ROW (header: $HP_HEADER)"; fi
      if ! TO=$(command -v timeout || command -v gtimeout); then
        OUTCOME='happy-path: not run - no timeout binary'
      elif [[ -z "$HP_TOKEN" || -z "${HP_CMD//[[:space:]]/}" ]] || ! (cd "$HP_WORKTREE" && command -v "$HP_TOKEN" >/dev/null); then
        OUTCOME='happy-path: not run - command not found'
      else
        BEFORE=$(git -C "$HP_WORKTREE" status --porcelain --untracked-files=all) || exit 1
        if (cd "$HP_WORKTREE" && "$TO" -k 30s "$HP_DURATION" bash -c "$HP_CMD") >"$HP_DIR/transcript.log" 2>&1; then
          EXIT=0
        else
          EXIT=$?
        fi
        AFTER=$(git -C "$HP_WORKTREE" status --porcelain --untracked-files=all) || exit 1
        if [[ "$BEFORE" != "$AFTER" ]]; then
          OUTCOME="happy-path: failed - dirtied worktree: ${AFTER//$'\n'/; }"
        elif [[ "$EXIT" == 0 ]]; then
          OUTCOME='happy-path: passed'
        elif [[ "$EXIT" == 75 ]]; then
          OUTCOME="happy-path: not run - environment unavailable: $(tail -n 1 "$HP_DIR/transcript.log")"
        elif [[ "$EXIT" == 124 || "$EXIT" == 137 ]]; then
          OUTCOME="happy-path: failed - timed out after $HP_DURATION"
        elif [[ "$EXIT" == 126 ]]; then
          OUTCOME='happy-path: not run - not executable'
        else
          OUTCOME="happy-path: failed (exit $EXIT)"
        fi
      fi
      { printf '%s\nhead: %s\nrow: %s\n' "$OUTCOME" "$HEAD" "$HP_LABEL"; if [[ -f "$HP_DIR/transcript.log" ]]; then printf '\n'; tail -n 200 "$HP_DIR/transcript.log"; fi; } >"$HP_DIR/summary.txt" || exit 1
      printf 'summary: %s\noutcome: %s\n' "$HP_DIR/summary.txt" "$OUTCOME"
      ```

   3. If the block exits non-zero or its printed summary is missing/unreadable, stop verification and report the shell error; never dispatch conformance with the selected run omitted. Distinguish this runner failure from a command's `failed`/`not run` outcome recorded in a readable summary. Treat any status difference (tracked or untracked residue) as failed regardless of exit code. Never stage or commit the listed paths as deliverables; remove untracked residue and restore tracked residue (`git -C "<worktree>" checkout -- <paths>`) explicitly before the conformance dispatch, so the tree is clean when the audit-time input rule runs.

   | Condition | Outcome line |
   |---|---|
   | worktree differs after run | `happy-path: failed - dirtied worktree: <paths>` |
   | exit 0, worktree clean | `happy-path: passed` |
   | exit 75 | `happy-path: not run - environment unavailable: <last line of transcript.log>` |
   | exit 124, or 137 after the `-k` kill | `happy-path: failed - timed out after <duration>` |
   | exit 126 | `happy-path: not run - not executable` |
   | pre-check failed | `happy-path: not run - <reason>` |
   | any other non-zero | `happy-path: failed (exit <n>)` |
   | no header line and no diff-derived row | no run, no outcome line |

   A timeout is `failed`, not `not run`: a consumer that never receives its message hangs, and the reviewer must see it; `not run` is reserved for a command that never executed. `timeout -k 30s` sends `TERM` then `KILL`; a script that does not trap `TERM` leaves its stack up, and the next run's exit 75 surfaces that. The full `transcript.log` stays in `$HP_DIR` for the human; the reviewer receives `summary.txt` only (outcome, `head:`, `row:`, 200-line tail). A `failed` or `not run` outcome never stops the flow and never becomes a repair item at this step - it is evidence for the audit; `$HP_DIR` and the outcome carry into the fix loop per `conformance-check.md`. Never split the shell block across calls.
