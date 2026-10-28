# Ticket Handling

A ticket is guidance, not sole truth. Fetch it; propose scope, approach, or acceptance changes when code disagrees, and record deviations in the spec. Carry implied requirements and terms from the ticket body (Context, Problem, Idea) and every `Reporter note:` comment section into the spec as any other requirement; keep the ticket body's explicit acceptance criteria verbatim in the section below. Retain concrete details from a requirement-carrying note (paths, source measurements, preserved entry points) within that requirement in Design, not only in a context or premise note. Preserve a source measurement as a description of the input, not a new target or limit. Extract ACs from the body only, never comments. With no fetch path or a whole-ticket fetch failure, list the unfetched ref and use `none - ticket not fetched (<reason>)` in `## Acceptance criteria`; show that existing `none` line at the gate so the user can paste rows. On body success with comments marked `comments not fetched (<reason>)` or `comments incomplete after page <k> (<reason>)`, retain the fetched AC rows and carry an adjacent gate-summary line: `Implied requirements came from the body only - <comment status>; paste missing comment text.` Continue to the gate without a new stop.

**Extract the ticket's ACs.** When the ticket body has a heading matching `/acceptance criteria/i`, every list item under it is an AC (numbered, bullet, or checkbox) until the next heading of that heading's level or higher, and no other list in the body is; a heading one level deeper inside the section is a repo group - it names the repo whose part delivers the rows under it and does not end extraction. When there is no such heading, every top-level checkbox row in the body is an AC, except rows under a `Post-deployment housekeeping`, `Out of scope`, or `Follow-up` heading. Otherwise the ticket has no ACs. A nested list under an AC row rides with its parent as one row; an AC heading holding prose and no list makes each paragraph one row. Carry checked and unchecked rows alike, all written `- [ ]`. Take the rows and their repo-group headings from the gather draft's `## Ticket acceptance criteria (verbatim)` heading; when the ticket was not fetched, the gate summary shows the `none` line so the user can paste the rows, which then become rows.

**This repo** is the `repo:` value of the overrides `## Issue tracker` section, else the `owner/name` path of `git remote get-url origin` with any `.git` suffix stripped; a repo group matches it when the group name equals that value or its basename, case-insensitive. A ticket without repo groups holds only this repo's rows; never guess attribution. A grouped ticket with no group matching this repo stops the brainstorm with that fact.

**Write the section in every spec**, after `## Problem`:

```markdown
## Acceptance criteria

Ticket <ref>, <heading or "checkbox list">, rows verbatim:

- [ ] <row text copied verbatim>
  <disposition>
```

Under `Ticket <ref>, <heading or "checkbox list">, rows verbatim:`, the section names the ticket contract only; the spec's own requirements stay in Design. Keep every provenance form flat - a row's repo lives in its disposition token, never in a heading. Disposition is exactly one of `in-scope`, `deviates: <why>`, `deferred: <where>`, `venue: <env> - <observation>`, `elsewhere: <repo>`; default `in-scope`. For ticket rows, never edit the row text: an ambiguous row stays `in-scope` with the chosen reading written as a Design clause, and a moved path or a workflow artifact (spec, plan, changelog, telemetry file) is a Design clause too, never a disposition and never asked. A row under a repo group that is not this repo is `elsewhere: <repo>`, stated, never asked; a group matching no repo asks `A) this repo B) elsewhere: <name> C) repair the ticket - /skill:shape-ticket <ref>`. Replace `<name>` with the supplied unmatched group heading verbatim in option B, not a request to name a repo. Name a `venue:` row's enabling change in Design; `venue:` states where the observation can happen and is never `prd`, `prod`, or `production` - a row observable only in production is a wrong row. An `in-scope` row is a requirement as written; disposition reasons are never normative for the plan or the reviewer, so a `deviates:` reason that adopts part of a row restates that part as a Design clause. A `deferred:` destination is a tracker ref (`#N`, `owner/repo#N`, `ABC-123`), a spec path, or a URL; a prose destination with none of these is a gap at the PR gate.

**Cut question.**

Start the message with `gauntlet: question` alone at column zero on the first physical line, followed by a newline, before premise correction or framing. Never append a colon to the marker. Follow the [first-line rule](menu-layout.md). `deviates:` and `deferred:` come only from the user's answer to this question; never propose one. Ask it, in the questionary format, when the user's prompt or an answer raises dropping or changing a row, or when code, a cited contract, or the user shows a row is wrong or impossible: `A) in-scope - <reading> B) deviates: <why> C) deferred: <where> D) repair the ticket - /skill:shape-ticket <ref> <row and evidence>`, `Recommendation:` A or D with the reason the row ships in this gauntlet; B and C are never recommended. On D, run `/skill:shape-ticket <ref> <row and evidence>` (repair mode per `shape-ticket/SKILL.md:43`, its own confirm gate), then re-fetch the ticket, replace the gather draft's `## Ticket acceptance criteria (verbatim)` block, and re-extract; a cancel at that gate returns to this question with the row unchanged. Carry the full question and the user's answer of every question that offered a disposition into the council's `Human input` block. The gate lists every `deferred:`, `deviates:`, and `venue:` row on its `Scope cuts:` line (`spec-finalization.md`). A disposition changes in any later phase - a reviewer finding `recommended: rescope` at the finish gate, a wrong row noticed mid-implementation, or a ticket edited after approval when the user asks - through [Amending an approved spec](../SKILL.md#amending-an-approved-spec) (`amendment-surface.md`); the row text still never changes. For ticket rows, preserve the ticket contract: Never author acceptance criteria on the ticket's behalf; that is `/skill:shape-ticket`'s job.

## Row production at spec-writing

Branch on the gathered result after reading the draft, before writing the spec:

| Gathered result | Section body |
|---|---|
| Ticket rows extracted | Keep the `Ticket <ref>, <heading or "checkbox list">, rows verbatim:` header, rows copied character-for-character from the verbatim block, including terminal punctuation, and dispositions |
| `none - ticket not fetched (<reason>)` | Keep that single line unchanged and the gate's paste-rows affordance |
| `none - no ticket` | Draft under `Drafted from the design, no ticket rows:` |
| `none - ticket has no acceptance criteria` | Draft under `Drafted from the design, ticket <ref> has no acceptance criteria:` |

Pasted rows are ticket rows and never trigger drafting. Never append `## Spec contract` or Design-derived rows to a ticket-row section.

Draft from the approved two-round design plus the original prompt (for an unbound PR, the agreed rework design, not its raw title/body). Write one `- [ ]` row per observable outcome the design commits to, with a two-space-indented disposition, default `in-scope`. State what a user, reviewer, or test observes, not a mechanism. Spec, plan, changelog, and telemetry artifacts are never outcome rows. Keep environment-bound pre-production proof as `venue: <env> - <observation>`; a venue requirement alone never drops an outcome.

Apply these integrity classes inline without invoking ticket shaping. Preserve each committed outcome and rewrite its proof:

| Class | Recovery before writing |
|---|---|
| Wishful | Rewrite to the design's observable with design-sourced baseline, target, and measurement |
| Tautological | Rewrite to a design-sourced, already-enumerated set or observable |
| Tree-wide | Split a drafted row requiring zero/no findings of one or several kinds anywhere in or across a tree or set into one row per family from the explicit complete enumeration in Design for that row, covering every kind it names; give each family's own observable and preserve every outcome across the resulting rows. For an absent, partial, or unrelated enumeration, stop before writing, quote the row, and request the complete enumeration in Design; obtain it from the human or Design; never invent the list in question options or recommendations or infer completion of a partial list. Keep this recovery drafted-only: a ticket row of this shape stays one verbatim row; require human ticket repair through `/skill:shape-ticket` before approval to split it |
| Unspecified-but-binding | Resolve the value from Design and record the resolution there; ask the user for a missing value |
| External-input | Ask the user for the external yardstick before writing |
| Post-deployment | Rewrite to a pre-production observation when available, retaining `venue:`; move production-only observations to a tracked, non-blocking `Post-deployment housekeeping` Design clause, never an AC row |

Preserve behavioral binary outcomes with setup, action, and expected result; require no invented numeric baseline. Use only design-sourced values; never invent a baseline, target, measurement, or enumerated set. Ask for missing inputs before writing; never silently remove an outcome. Let an outcome leave in-scope only through an explicit scope decision by the user (the cut question or a clarification answer); record `deviates:`/`deferred:` and an `## Out of scope` entry so `Scope cuts:` discloses it. With no valid row remaining, stop for clarification or an explicit scope decision before writing; never emit a `none` fallback.

**Drafted cut question.** Use the existing questionary layout with one option per physical line:

```text
A) in-scope - <reading>
B) deviates: <why>
C) deferred: <where>
Recommendation: A - <why the outcome ships>
```

Recommend A, never B/C; omit D because no ticket contract or snapshot exists to repair - ticket rows keep the four-option cut question above, including D. Preserve the full question and answer in council `Human input`. Keep drafted rows themselves out of that block. Before approval, rewrite drafted rows only for integrity; delete one only after its Design commitment is cut through the user's scope-decision procedure. After approval, freeze drafted row text; route text/add/remove changes to redraw and disposition-only changes through the existing cut question and amendment grammar.
