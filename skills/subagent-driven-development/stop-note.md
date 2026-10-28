# Stop note (subagent-driven-development companion)

For a `NEEDS_CONTEXT`/`BLOCKED` fact ask, search the locations documented by the spec, plan, or repo: one bounded lookup per location in documented order, stopping at the first hit. Record each lookup and result, including earlier misses; re-dispatch with the found result in the task text.

Emit when no escalation model resolves, the escalated dispatch errors, its one escalated round fails (see `SKILL.md` "Fix-Loop Rounds"), or a `NEEDS_CONTEXT`/`BLOCKED` fact ask exhausts documented locations, needs credentials for a remaining location, or lacks its named lookup tool; an unavailable `gauntlet_setting` tool is a configuration error - stop and report, no stop note. Inline in the reply; the turn ends; phase stays `implement`, the task stays `in_progress`; no further tasks start. Emit one note per stalled task, after the current batch returns.

## Template

Read and apply [menu-layout](../brainstorming/reference/menu-layout.md). Start the message with `gauntlet: question` alone on the first output line, followed by a newline before the stop note; this is an implementation decision, not a done or stuck outcome.

```
gauntlet: question
Stopped on task <n> (<title>)[; escalated round on <implModel> did not resolve it].

Problem: <one sentence: what is wrong and why it remains unresolved>
Searched: <where> - <result> [fact asks only; repeat in lookup order]
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
- For review stalls, quote only residual issues from the final review report; do not summarize history.
- For fact asks, put one `Searched: <where> - <result>` line per lookup directly under `Problem:`, in lookup order. For an unavailable named tool, write `Searched: <tool> - not available`. Omit `Searched:` for decisions, including extra-round approval.
- For fact asks, offer supplying the artifact or access, or amending the spec or plan task to drop the requirement. Never ask the human where the artifact is.
- When no escalated round ran, state the reason in `Problem:`: exhausted or inaccessible fact lookups, "no escalation model resolvable", or the quoted implementer's non-DONE status text / dispatch error; skip the file:line and test lines.
- Options are actionable edits. Spec/plan amendment is first-class - stalls are usually a slightly contradictory spec, not a capability gap.
- Never offer "skip the task". If the task is genuinely droppable, say so and name the plan tasks that depend on it.
- No trajectory verdicts, round history, review counts, or paths to spec/plan/review reports.
- Plain words, ASCII, no headings. One screen.

## Example

```
gauntlet: question
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
