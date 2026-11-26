# Ticket Handling

A ticket is guidance, not sole truth. Fetch it; propose scope, approach, or acceptance changes when code disagrees, and record deviations in the spec. Carry implied requirements and terms from the ticket body (Context, Problem, Idea) and every `Reporter note:` comment section into the spec as any other requirement; keep explicit ticket rows verbatim wherever the sort places them. Retain concrete details from a requirement-carrying note (paths, source measurements, preserved entry points) within that requirement in Design, not only in a context or premise note. Preserve a source measurement as a description of the input, not a new target or limit. Extract ACs from the body only, never comments. Displaced text in a Reporter note is provenance; apply the same definition before carrying any obligation from it. With no fetch path or a whole-ticket fetch failure, list the unfetched ref and use `none - ticket not fetched (<reason>)` in `## Acceptance criteria`; show that existing `none` line at the gate so the user can paste rows. On body success with comments marked `comments not fetched (<reason>)` or `comments incomplete after page <k> (<reason>)`, retain the fetched AC rows and carry an adjacent gate-summary line: `Implied requirements came from the body only - <comment status>; paste missing comment text.` Continue to the gate without a new stop.

**Extract the ticket's ACs.** When the ticket body has a heading matching `/acceptance criteria/i`, extract every list item under it as a candidate (numbered, bullet, or checkbox) until the next heading of that level or higher. Ignore lists outside the section. A heading one level deeper inside it is a repo group - it names the repo whose part delivers the rows under it and does not end extraction. When there is no such heading, every top-level checkbox row in the body is a candidate, except rows under an `Integration`, `Post-deployment housekeeping`, `Out of scope`, or `Follow-up` heading. Otherwise the ticket has no ACs. A nested list under an AC row rides with its parent as one row; an AC heading holding prose and no list makes each paragraph one row. Carry checked and unchecked rows alike, all written `- [ ]`. Take the rows and their repo-group headings from the gather draft's `## Ticket acceptance criteria (verbatim)` heading; when the ticket was not fetched, the gate summary shows the `none` line so the user can paste the rows, which then become rows.

**Sort at extraction.** Read [`ac-classes.md`](../../shape-ticket/reference/ac-classes.md) and apply its definition to every raw row, including pasted rows, before copying it, assigning a disposition or counting ownership. Ask no question about the sort. Keep the raw verbatim block and council `Human input` unchanged, in ticket order.

| By the definition | Placement |
|---|---|
| Criterion | Copy the whole ticket row verbatim to `## Acceptance criteria` with its disposition. |
| Entry | Move it verbatim to `## Integration`; indent `ticket row, not an acceptance criterion: <kind>` beneath it. This is not a scope cut: no disposition, `## Out of scope` entry or cut question. |
| Mixed | Write in both sections: keep the whole row verbatim as a criterion with its repo-group disposition; copy only its external clause to `## Integration`, without a marker. For `on staging, the importer rejects a row without an id`, the entire Integration item is `- on staging`. |

**This repo** is the `repo:` value of the overrides `# shared` `## issue-tracker` section, else the `owner/name` path of `git remote get-url origin` with any `.git` suffix stripped; a repo group matches it when the group name equals that value or its basename, case-insensitive. Apply [../legs.md](../legs.md)'s identifier-before-basename membership resolution before attribution. A ticket without repo groups holds only this repo's rows; never guess attribution. Stop the brainstorm and say why when a grouped ticket has surviving acceptance rows and no original repo-group heading matches a member.

**Write the section in every spec**, after `## Problem`:

```markdown
## Acceptance criteria

Ticket <ref>, <heading or "checkbox list">, rows verbatim:

- [ ] <row text copied verbatim>
  <disposition>
```

Under `Ticket <ref>, <heading or "checkbox list">, rows verbatim:`, the section names the ticket contract only; the spec's own requirements stay in Design. Keep every provenance form flat - a row's repo lives in its disposition token, never in a heading. Disposition is exactly one of `in-scope`, `deviates: <why>`, `deferred: <where>`, `elsewhere: <repo>`; default `in-scope`. For ticket rows, never edit the row text: an ambiguous row stays `in-scope` with the chosen reading written as a Design clause, and a moved path or a workflow artifact (spec, plan, changelog, telemetry file) is a Design clause too, never a disposition and never asked. A row under a repo group matching a settled member is `in-scope`; encode that member's ownership through its leg's `scope: AC <n>` indices (count only checkbox rows under the spec's `## Acceptance criteria` in section order, including cut rows, never Integration entries) using [../legs.md](../legs.md), with owned paths only in `design:`. A known nonmember repo group is `elsewhere: <repo>`, stated, never asked; `elsewhere:` creates no leg. For an unmatched group with a surviving acceptance row, ask `A) this repo B) elsewhere: <name> C) repair the ticket - /skill:shape-ticket <ref>`. Replace `<name>` with the supplied unmatched group heading verbatim in option B, not a request to name a repo. An `in-scope` row is a requirement as written; disposition reasons are never normative for the plan or the reviewer, so a `deviates:` reason that adopts part of a row restates that part as a Design clause. A `deferred:` destination is a tracker ref (`#N`, `owner/repo#N`, `ABC-123`), a spec path, or a URL; a prose destination with none of these is a gap at the PR gate.

**Cut question.**

Start the message with `gauntlet: question` alone at column zero on the first physical line, followed by a newline, before premise correction or framing. Never append a colon to the marker. Follow the [first-line rule](../menu-layout.md). `deviates:` and `deferred:` come only from the user's answer to this question; never propose one. Ask it, in the questionary format, on any trigger in the table below, with the options `A) in-scope - <reading> B) deviates: <why> C) deferred: <where> D) repair the ticket - /skill:shape-ticket <ref> <row and evidence>` and the table's `Recommendation:`; B and C are never recommended. On D, run `/skill:shape-ticket <ref> <row and evidence>` (repair mode per `../../shape-ticket/SKILL.md:43`, its own confirm gate), then re-fetch the ticket and refresh both gather draft blocks from that fetch before re-extracting: `## Ticket acceptance criteria (verbatim)` and `## Ticket Integration entries (verbatim)`. Remove the latter when neither Integration source heading below is present. On a cancel at that gate or an initial ticket-read abort, return to this question with the row unchanged and report no repair. Carry the full question and the user's answer of every question that offered a disposition into the council's `Human input` block. The gate lists every `deferred:` and `deviates:` row on its `Scope cuts:` line (`spec-finalization.md`). A disposition changes in any later phase - a reviewer finding `recommended: rescope` at the finish gate, a wrong row noticed mid-implementation, or a ticket edited after approval when the user asks - through [Amending an approved spec](../SKILL.md#amending-an-approved-spec) (`../amendment-surface.md`); the row text still never changes. For ticket rows, preserve the ticket contract: Never author acceptance criteria on the ticket's behalf; that is `/skill:shape-ticket`'s job.

| Trigger | Screened | Recommendation |
|---|---|---|
| The user's prompt or an answer raises dropping or changing a row | When raised | A or D with the reason the row ships in this gauntlet |
| Code, a cited contract, or the user shows a row is wrong or impossible | When shown | A or D with the reason the row ships in this gauntlet |

## Row production at spec-writing

**Write `## Integration`** directly before `## Errors and edge cases`; omit it when empty. Write plain `- ` items (drop source checkbox prefixes) in source order:

1. Copy the gather draft's `## Ticket Integration entries (verbatim)` from the ticket's `Integration` or `Post-deployment housekeeping` section, including nested lines.
2. Add moved ticket rows with their marker lines, and external clauses of mixed rows without markers, in ticket order.
3. Apply the same definition to design commitments. Write each entry in the design's words here, not as an acceptance row, Tests line or Design imperative. Indent any detail the design adds under the entry it describes.

Keep authorized methods of proving file requirements (including selected evals and paid actions) in Design and Tests; a run result is not an acceptance row. Keep leg contract lines under `## Legs`.

Branch on the gathered result after reading the draft, before writing the spec:

| Gathered result | Section body |
|---|---|
| Ticket criteria remain after sorting | Keep the `Ticket <ref>, <heading or "checkbox list">, rows verbatim:` header. Copy those rows character-for-character from the verbatim block, including terminal punctuation, and give each a disposition |
| `none - ticket not fetched (<reason>)` | Keep that single line unchanged and the gate's paste-rows affordance |
| `none - no ticket` | Draft under `Drafted from the design, no ticket rows:` |
| `none - ticket has no acceptance criteria` (including all extracted rows sorted out; retain their entries and markers) | Draft under `Drafted from the design, ticket <ref> has no acceptance criteria:` |

Pasted rows are ticket rows: sort them before choosing the branch. Never append `## Spec contract` or Design-derived rows to a ticket-row section.

Draft from the approved two-round design plus the original prompt (for an unbound PR, the agreed rework design, not its raw title/body). Write one `- [ ]` row per functionality or constraint the design commits to, with a two-space-indented disposition, default `in-scope`. One row may cover several scenarios. State what a user, reviewer, or test observes, not a mechanism. Spec, plan, changelog, and telemetry artifacts are never outcome rows.

Apply these integrity classes inline without invoking ticket shaping. Preserve each committed outcome and rewrite its proof:

| Class | Recovery before writing |
|---|---|
| Wishful | Rewrite to the design's observable with design-sourced baseline, target, and measurement |
| Tautological | Rewrite to a design-sourced, already-enumerated set or observable |
| Tree-wide | Split a drafted row requiring zero/no findings of one or several kinds anywhere in or across a tree or set into one row per family from the explicit complete enumeration in Design for that row, covering every kind it names; give each family's own observable and preserve every outcome across the resulting rows. For an absent, partial, or unrelated enumeration, stop before writing, quote the row, and request the complete enumeration in Design; obtain it from the human or Design; never invent the list in question options or recommendations or infer completion of a partial list. Keep this recovery drafted-only: a ticket row of this shape stays one verbatim row; require human ticket repair through `/skill:shape-ticket` before approval to split it |
| Unspecified-but-binding | Resolve the value from Design and record the resolution there; ask the user for a missing value |
| External-input | Ask the user for the external yardstick before writing |

Preserve each committed outcome's observable result, without a required setup/action/result format; require no invented numeric baseline. Use only design-sourced values; never invent a baseline, target, measurement, or enumerated set. Ask for missing inputs before writing; never silently remove an outcome. Let an outcome leave in-scope only through an explicit scope decision by the user (the cut question or a clarification answer); record `deviates:`/`deferred:` and an `## Out of scope` entry so `Scope cuts:` discloses it. With no valid row remaining, stop for clarification or an explicit scope decision before writing; never emit a `none` fallback.

**Drafted cut question.** Use the existing questionary layout with one option per physical line:

```text
A) in-scope - <reading>
B) deviates: <why>
C) deferred: <where>
Recommendation: A - <why the outcome ships>
```

Recommend A, never B/C; omit D because no ticket contract or snapshot exists to repair - ticket rows keep the four-option cut question above, including D. Preserve the full question and answer in council `Human input`. Keep drafted rows themselves out of that block. Before approval, rewrite drafted rows only for integrity; delete one only after its Design commitment is cut through the user's scope-decision procedure. After approval, freeze drafted row text; route text/add/remove changes to redraw and disposition-only changes through the existing cut question and amendment grammar.
