# Stop note (subagent-driven-development companion)

Emitted when no escalation model resolves, the escalated dispatch errors, or its one escalated round fails (see `SKILL.md` "Fix-Loop Rounds"); an unavailable `gauntlet_setting` tool is a configuration error - stop and report, no stop note. Inline in the reply; the turn ends; phase stays `implement`, the task stays `in_progress`; no further tasks start. Wave mode: one note per stalled task, after the current batch returns.

## Template

```
Stopped on task <n> (<title>)[; escalated round on <implModel> did not resolve it].

Problem: <one sentence: what is wrong and why the fixes could not resolve it>
  <file:line> - <quoted finding from the final review>
  <failing test/command + 1-3 line output snippet, when present>

Fix options:
  a) <concrete change>
  b) <concrete change - amending spec section X / plan task n is a normal option>
  c) <optional third>

Pick one, or give another fix.
```

## Rules

- Bracketed header clause only when an escalated round actually ran; omit it when no model was resolvable or the dispatch errored.
- Residual issues from the final review report only; quote, do not summarise history.
- When no escalated round ran, the Problem is the reason: "no escalation model resolvable", or the implementer's non-DONE status text / the dispatch error, quoted; skip the file:line and test lines.
- Options are actionable edits. Spec/plan amendment is first-class - stalls are usually a slightly contradictory spec, not a capability gap.
- Never offer "skip the task". If the task is genuinely droppable, say so and name the plan tasks that depend on it.
- No trajectory verdicts, round history, review counts, or paths to spec/plan/review reports.
- Plain words, ASCII, no headings. One screen.

## Example

```
Stopped on task 4 (retry policy for the outbound client); escalated round on <provider>/<model>:high did not resolve it.

Problem: `RetryPolicy.next()` returns 0 ms for the first retry, but the client treats 0 as "no
retry", so the first failure is never retried.
  src/net/retry.ts:41 - `return attempt * this.baseMs;`
  npm test -- retry > "retries once after a transient failure":
    expected 1 call after failure, got 0

Fix options:
  a) start the backoff at `baseMs` (`(attempt + 1) * this.baseMs`)
  b) amend plan task 4 so the client retries on any non-negative delay, and keep the policy as is

Pick one, or give another fix.
```
