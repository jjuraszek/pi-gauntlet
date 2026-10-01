# Ticket Handling

A ticket is guidance, not sole truth. Fetch it; propose scope, approach, or acceptance changes when code disagrees, and record deviations in the spec. Implied requirements in the ticket body (Context, Problem, Idea) land in the spec body as any other requirement; the ticket's explicit acceptance criteria land verbatim in the section below.

**Extract the ticket's ACs.** When the ticket body has a heading matching `/acceptance criteria/i`, every list item under it until the next heading is an AC (numbered, bullet, or checkbox) and no other list in the body is. When there is no such heading, every top-level checkbox row in the body is an AC, except rows under a `Post-deployment housekeeping`, `Out of scope`, or `Follow-up` heading. Otherwise the ticket has no ACs. A nested list under an AC row rides with its parent as one row; an AC heading holding prose and no list makes each paragraph one row. Carry checked and unchecked rows alike, all written `- [ ]`. Take the rows from the gather draft's `## Ticket acceptance criteria (verbatim)` heading; when the ticket was not fetched, the gate summary shows the `none` line so the user can paste the rows, which then become rows.

**Write the section in every spec**, after `## Problem`:

```markdown
## Acceptance criteria

Ticket <ref>, <heading or "checkbox list">, rows verbatim:

- [ ] <row text copied verbatim>
  <disposition>
```

The heading `## Acceptance criteria` names the ticket contract only; the spec's own requirements stay in Design. Disposition is exactly one of `in-scope`, `deviates: <why>`, `deferred: <where>`, `venue: <env> - <observation>`; default `in-scope`. Never edit the row text: a wrongly stated row is `deviates: <why>`, an ambiguous row stays `in-scope` with the chosen reading written as a Design clause. Name a `venue:` row's enabling change in Design. An `in-scope` row is a requirement as written; disposition reasons are never normative for the plan or the reviewer, so a `deviates:` reason that adopts part of a row restates that part as a Design clause. Defer a row only when the shipped change operates without it - cost is never a reason; a hard but direct AC stays `in-scope` and ships. Ask a `deviates:`/`deferred:` decision only when it changes what the user observes once the change ships, offering the dispositions themselves as the options (`A) in-scope B) deviates: <why> C) deferred: <where>`); a deviation caused by a workflow artifact (spec, plan, changelog, telemetry file) or a moved path is stated in the disposition, not asked. Name every disposition in the gate summary; `venue:` states where the observation can happen and is not a scope decision. A disposition changes in any later phase - a reviewer finding `recommended: rescope` at the finish gate, a wrong row noticed mid-implementation, or a ticket edited after approval when the user asks - through [Amending an approved spec](../SKILL.md#amending-an-approved-spec) (`amendment-surface.md`); the row text still never changes. With no ticket, or a ticket without ACs, the section body is the single line `none - no ticket`, `none - ticket has no acceptance criteria`, or `none - ticket not fetched (<reason>)`. Never author acceptance criteria on the ticket's behalf; that is `/skill:shape-ticket`'s job.
