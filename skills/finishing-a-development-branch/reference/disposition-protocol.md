# Carried-open disposition protocol

Consumed by `finishing-a-development-branch` Step 3.5 on the **GAPS branch only** — the CONFORMS fast path never reads this file. Antecedent map for the relocated grammar below: "the reference" = `../../verification-before-completion/reference/conformance-check.md` (canonical for the availability table, the `UNAUTHORIZED` question, the `recommended: none` preflight, the freshness rule, and the concern-scoped fix projection); "Revert semantics", "the zero-gap path", and every `Step N` (`Step 1`, `Step 3.5`, `Step 4`) reference = `../SKILL.md`.

**Carried-open render (dense).** Read the `## Closure / conformance` block. Render a header with the decision count, one bullet per decision unit (a gap by default; a `Gn/Cn` concern only where the reference split it), then the shared options line, then the recommended-set reply. Never show durable-card internals (ownership, evidence tokens, identity, hashes) in the render.

Each bullet:

`* <handle> - <plain title>: <what's unresolved, one clause>. <short question> Recommended: <choice> (<one-clause why>).`

- `<handle>` leads the bullet and is a short unique human word derived from the title (`Cache coverage` -> `cache`); on collision append a digit. It is the token option 2 targets. When a gap split and no clean word fits, use the bare `Gn/Cn`; a single-concern gap uses its gap ID `Gn`.
- The shared options line sits below the bullets: `Other options per item: fix-now / accept / rescope / follow-up / custom`, listing the options **generally available across items**. When a specific item's availability deviates - an option unavailable for it, or an `UNAUTHORIZED` item whose `rescope` is unavailable and whose `fix-now` means removal - note that deviation as a short parenthetical on **that item's bullet** (one clause, not a block), e.g. `(rescope N/A: scope creep)`. The shared line appears **only in the carried-open render**, never in the zero-gap path. Full per-option effects only on request, or when option 2 targets an unclear choice.
- Group items under one recommended line only when they share a disposition and rationale; each grouped handle repeats its title.
- Availability per concern comes from the reference's single availability table - apply it against current context (worktree state, `maxFixRounds`, ownership, resource accessibility), do not restate it. `UNAUTHORIZED` bullets ask the reference's question verbatim (`Should this unrequested behavior become part of the current workflow?`); `rescope-into-spec` is shown **unavailable** (not dropped) and `fix-now` means **removal** of the unrequested code.
- `revert conformance fix Gn`, when the gap has an auto-applied fix, renders on the shared options line as a **separate one-off action** - never inside a bullet's recommendation and never in the option-2 list. Name the parent gap and warn that revert undoes the entire gap-level commit (see "Revert semantics").

#### Response grammar

```
1                                  -> apply every recommendation
2: cache=follow-up
2: e2e=custom(open ticket after image lands), cache=follow-up
```

- `1` (or `apply recommended`) applies all recommendations.
- `2:` takes a comma-separated override list, each `<handle>=<choice>`; omitted items keep their recommendation. A handle may appear at most once (repeat = invalid).
- `custom(<concrete effect>)` supplies an inline effect. Manual fix-in-place is expressed only as `custom(...)` where isolated `fix-now` is unavailable.
- `recommended: none` items follow the reference's preflight (linked, not restated): the item needs a `<handle>=custom(...)` decision, and option 1 is withheld until every open item has an executable recommendation; after the custom decision the menu re-renders for the remainder.
- `revert conformance fix Gn` is a valid standalone reply, mutually exclusive with `1` and `2:`; it never appears inside a `2:` override list.
- Invalid handle or choice -> focused reprompt naming only that item, retaining every valid pick and never reopening the gate. Unknown token: list the valid titled handles. Known item, bad choice: repeat its title + its available choices.

#### Execute order

Take **no** disposition action before the reply. Then, once, in order:

1. **Normalize** every `custom(...)` into explicit operations; classify state-changing (edits code or spec) vs not. Clarify only an ambiguous or unexecutable effect.
2. **Commit spec edits** (`accept-into-spec`, `rescope-into-spec`, state-changing spec `custom`) - the main session edits the spec directly, before any fix dispatch (a dirty tree rejects `worktree: true`, and the re-audit must read the amended spec).
3. **Re-audit if step 2 changed the spec**; regenerate the inventory and re-render if it changed. Project `fix-now` only from the refreshed inventory.
4. **fix-now + code-changing custom:** project the selected concerns per gap into the reference's concern-scoped fix contract (excluding accepted/rescoped/followed-up siblings); run the reference "Fix loop" (unchanged - do not re-describe it). A code-changing `custom` runs the project's tests + `code-reviewer` on its delta before proceeding. Re-run Step 1's canonical tests.
5. **Re-audit after all state-changing work;** obtain fresh decisions **only if** the refreshed inventory differs from the approved one, else proceed.
6. **follow-up** from the current inventory: create the item via the project's issue-tracker convention (the gauntlet overrides file, see Project overrides in `finishing-a-development-branch/SKILL.md`), record the ticket ID/URL; on failure keep the concern open.
7. **Non-state-changing custom:** execute and record the result.
8. **revert** (`revert conformance fix Gn`): light-revert the indexed commit, re-run Step 1's canonical tests; on failure stop; on pass re-audit and regenerate.
9. Re-enter Step 3.5 with the re-audited block if any concern remains open.

Record every final disposition with its **stable ID** as `Gn/Cn - <title>: <disposition>` (or `Gn - <title>: <disposition>` for a single-concern gap) - ticket ID/URL for `follow-up`, result for `custom`; never relabel a `custom` result as a recommendation. This durable record is the machine/audit surface; the interactive render stays handle-based. Then continue to Step 4:
