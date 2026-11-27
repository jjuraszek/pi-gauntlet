# Stop note (`waves.md` companion)

## Whole-diff review

Keep `verify` active and leave task states unchanged. Print `gauntlet: question` alone on the first line and `Stopped on whole-diff review.` on the next. Quote the final report's residual findings under `Problem:`. End with the unblocking input under `Needs:` in everyday words, with no options.

## Implementation task

For a `NEEDS_CONTEXT`/`BLOCKED` fact ask, dispatch a delegated answer/evidence child to search the locations documented by the spec, plan, or repo: one bounded lookup per location in documented order, stopping at the first hit. Record each lookup and result, including earlier misses; consume the compact answer/evidence and re-dispatch with the found result. Keep source reads delegated; use the bounded direct-report read rule in waves.md for child reports. On an interruption before the result, use [Recovery](./waves.md#recovery) to repeat an identified read-only lookup once with its retained payload; stop on an unsafe retry, a second failure or another delegated failure.

When lookup exhausts the sources for missing row input with no buildable stand-in, take the delegated amendment route in Implementer Status instead of emitting this note.

Emit when no escalation model resolves, the [transition table](./waves.md#the-wave-loop) reaches a stop, or a `NEEDS_CONTEXT`/`BLOCKED` fact ask exhausts documented locations, needs credentials for a remaining location, or lacks its named lookup tool; an unavailable `gauntlet_setting` tool also ends in this stop note. Inline in the reply; the turn ends; phase stays `implement`, the task stays `in_progress`; no further tasks start. Emit one note per stalled task, after the current batch returns.

### Template

Write the note from structured fields, bounded report findings and lookup observations. Never dispatch a child to relay a report. While a budget token exists, put `budget: <spent> of <N> spent` after `Problem:` and any `Searched:` lines and before findings, including zero-spent stops. On unrecoverable resume use `budget: <N> of <N> spent (not recovered on resume)`. Omit budget without a token.

Start the message with `gauntlet: question` alone on the first output line, followed by a newline before the stop note; this is an implementation decision, not a done or stuck outcome.

```
gauntlet: question
Stopped on task <n> (<title>)[; escalated round on <implModel> did not resolve it].

Problem: <one sentence: what is wrong and why it remains unresolved>
Searched: <where> - <result> [fact asks only; repeat in lookup order]
  <file:line> - <quoted finding from the final review>
  <failing test/command + 1-3 line output snippet, when present>

Needs: <the input that unblocks delivery, in everyday words>
```

### Rules

- Apply the [takeable-decision ladder](./escalation.md#escalation-and-funding) before emitting an execution decision note. Put repeated evidence in `Problem:`. For a stalled task or a task with no way forward, end with `Needs:` and no menu. Only a question about discard, redraw, a correction requiring review, or an unnamed paid or outside-repository action keeps its options and final `Recommendation:` line. For those questions apply [menu-layout](../../menu-layout.md).
- Bracketed header clause only when an escalated round actually ran; omit it when no model was resolvable or the dispatch errored.
- For review stalls, quote only residual issues from the final review report; do not summarize history.
- For fact asks, put one `Searched: <where> - <result>` line per lookup directly under `Problem:`, in lookup order. For an unavailable named tool, write `Searched: <tool> - not available`. Omit `Searched:` for decisions.
- For fact asks, name the missing artifact or access in `Needs:`. Never ask the human where the artifact is.
- When no escalated round ran, state the reason in `Problem:`: exhausted or inaccessible fact lookups, "no escalation model resolvable", or the quoted implementer's non-DONE status text / dispatch error; skip the file:line and test lines.
- No trajectory verdicts, round history, review counts, or paths to spec/plan/review reports.
- Plain words, ASCII, no headings. One screen.

### Example

```
gauntlet: question
Stopped on task 4 (retry policy for the outbound client); escalated round on <provider>/<model>:high did not resolve it.

Problem: `RetryPolicy.next()` returns 0 ms for the first retry, but the client treats 0 as "no
retry", so the first failure is never retried.
  src/net/retry.ts:41 - `return attempt * this.baseMs;`
  npm test -- retry > "retries once after a transient failure":
    expected 1 call after failure, got 0

Needs: Specify the first retry delay so a failed request gets another try.
```
