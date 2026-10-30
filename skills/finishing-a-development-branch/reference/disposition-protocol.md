# Carried-open disposition protocol

Consumed by `finishing-a-development-branch` Step 3.5 on the **GAPS branch only** — the CONFORMS fast path never reads this file. Antecedent map for the relocated grammar below: "the reference" = `../../verification-before-completion/reference/conformance-check.md` (canonical for the availability table, the `UNAUTHORIZED` question, the `recommended: none` rule, the freshness rule, and the concern-scoped fix projection); "Revert semantics", "the zero-gap path", and every `Step N` (`Step 1`, `Step 3.5`, `Step 4`) reference = `../SKILL.md`.

**Carried-open render (numbered brief).** Read the `## Closure / conformance` block. The menu text is written after the recommendation is decided, never while deciding it. Negative example: `recommended: custom? Hmm. Dispositions: fix-now ... Actually, the amended spec makes G2 ...`.

Read and apply [menu-layout](../../brainstorming/reference/menu-layout.md). Start the message with `gauntlet: gate=finishing-a-development-branch/carried-open` alone on the first output line, without `recommended=`. Put item 1's plain-words problem sentence on the next line, before summaries or metadata. Render one numbered item per decision unit (a gap by default; a `Gn/Cn` concern only where the reference split it):

```text
gauntlet: gate=finishing-a-development-branch/carried-open
<n>. <plain title> - <what is unresolved and what it costs, one sentence>.
   <why this is a human call, one sentence>.
   A) <option> - <one-line consequence>
   B) <option> - <one-line consequence>
   Custom: <your own answer> - <the availability table's custom effect, one line>
   Recommended: <letter> - <reason>
   Not available: <option> - <missing prerequisite>
```

- Build the problem sentence from the concern card's existing `unresolved` and `impact`; invent no sentence sources at render time. Derive the human-call sentence from the verdict: `UNAUTHORIZED` asks `Should this unrequested behavior become part of the current workflow?` verbatim; `MISSING`/`PARTIAL` says the spec requires it and implementation is incomplete or blocked, naming the missing prerequisite; `DRIFTED` says spec and code disagree and only the human can say which is the contract. For a fix gap carried open because the fix loop cannot run (`maxFixRounds: 0`, no named-branch worktree, unknown ownership), say so and name the prerequisite.
- For a spec-editing recommendation (`accept-into-spec`, `rescope-into-spec`) or a pre-menu escalated item, indent the readable card between the problem sentence and lettered options: `what` and `why` as one sentence each, `Example: <before -> after>`, `Reviewer: <one-line reason verbatim | not reviewed - <the Conformance entry step 1 exclusion that kept it out> | reviewer unavailable: <reason>>`, and `Impact: <spec section>: <approved contract> -> <new contract>; ...`. Adapt the card from `../../brainstorming/reference/amendment-surface.md`; keep escalated items here, not in a second menu.
- Apply the reference's single availability table against current context (worktree state, `maxFixRounds`, ownership, resource accessibility); do not restate it. Letter available named options in table row order (`fix-now`, `accept`, `rescope`, `follow-up`), skipping unavailable ones. Lettering follows availability only - a `No recommendation - pick one` item letters its available options like any other. Give every lettered option the table's one-line effect for this verdict. Keep letters stable for the shown menu; map each pick to its shown disposition token. Use the menu's short forms `accept` and `rescope` for the canonical `accept-into-spec` and `rescope-into-spec`.
- Keep one unlettered `Custom:` line per item as shown. Keep unavailable options visible and unlettered as `Not available: <option> - <missing prerequisite>`; render `UNAUTHORIZED` rescope as `Not available: rescope - scope creep`, and its `fix-now` consequence as removal of the unrequested code. Show no bare option tokens.
- Use exactly `Recommended: <letter> - <reason>`, with a one-sentence reason tied to the end goal or a development practice, or `No recommendation - pick one` when no named choice is executable. Never recommend custom.
- Below the item list, render `Conformance: N decisions needed before shipping.` (when the count is 1, write `Conformance: 1 decision needed before shipping.`), then the informational `happy-path:`, `Deferred/deviates per spec:`, and `whole-diff minors:` lines in their current relative order, above the reply instruction: `Reply: one line per item: <n>. <letter or free text>; bare "1" takes every recommendation and re-asks items without one by number.` Keep handles and durable-card internals (ownership, evidence tokens, identity, hashes) out of the prompt.
- Render `revert conformance fix Gn` for an indexed auto-applied fix on its own line outside the items, never lettered. Name the parent gap and warn that revert undoes the entire gap-level commit (see "Revert semantics").

#### Response grammar

One reply line per item: `<n>. <letter or free text>`. Free text is always the custom path (`custom(<text>)`), even when it matches a shown option's name - letters pick options, text instructs. No other forms: no bare letters, no mixing bare `1` with item lines.

- Bare `1` (or `apply recommended`, accepted, never advertised) applies every item that has a recommendation and re-asks only the items without one, by number, never re-rendering the whole menu.
- An omitted item keeps its recommendation; an omitted no-recommendation item is re-asked by number, same as after a bare `1`.
- A legacy `2: <handle>=<choice>` reply is accepted silently as the same picks and recorded normally; the form is never rendered in a prompt.
- An invalid number or letter gets a focused reprompt naming only that item, retaining every valid pick, never reopening the gate. A bare digit other than `1` is an invalid reply and reprompts the same way.
- `revert conformance fix Gn` is a standalone reply, mutually exclusive with numbered lines and bare `1`; it never takes a letter and never waits on undecided items - the decide-everything-first barrier binds disposition batches only. Run execute-order step 8 without applying any recommendation.
- Nothing in a disposition batch executes until every item has a decision; then the execute order below runs once. Keep original item numbers through re-asks; no re-audit runs before the batch is decided.

#### Execute order

Take **no** disposition action before the reply. Then, once, in order:

1. **Normalize** every `custom(...)` into explicit operations; classify state-changing (edits code or spec) vs not. Clarify only an ambiguous or unexecutable effect.
2. **Commit spec edits** (`accept-into-spec`, `rescope-into-spec`, state-changing spec `custom`) - the main session edits the spec directly, before any fix dispatch (a dirty tree rejects `worktree: true`, and the re-audit must read the amended spec). A disposition chosen here is already approved: it bypasses the amendment surface's reviewer and batch. Items the pre-menu funnel auto-applied are recorded `Gn - <title>: accept-into-spec (auto-applied)`.
3. **Re-audit if step 2 changed the spec**; regenerate the inventory and re-render if it changed. Project `fix-now` only from the refreshed inventory.
4. **fix-now + code-changing custom:** project the selected concerns per gap into the reference's concern-scoped fix contract (excluding accepted/rescoped/followed-up siblings); run the reference "Fix loop" (unchanged - do not re-describe it). A code-changing `custom` runs the project's tests + `wave-reviewer` on its delta before proceeding. Re-run Step 1's canonical tests.
5. **Re-audit after all state-changing work;** obtain fresh decisions **only if** the refreshed inventory differs from the approved one, else proceed.
6. **follow-up** from the current inventory: create the item via the project's issue-tracker convention (the gauntlet overrides file, see Project overrides in `finishing-a-development-branch/SKILL.md`), record the ticket ID/URL; on failure keep the concern open.
7. **Non-state-changing custom:** execute and record the result.
8. **revert** (`revert conformance fix Gn`): light-revert the indexed commit, re-run Step 1's canonical tests; on failure stop; on pass re-audit and regenerate.
9. Re-enter Step 3.5 with the re-audited block if any concern remains open.

Record every final disposition with its **stable ID** as `Gn/Cn - <title>: <disposition>` (or `Gn - <title>: <disposition>` for a single-concern gap) - ticket ID/URL for `follow-up`, result for `custom`; never relabel a `custom` result as a recommendation. This durable record is the machine/audit surface; keep canonical disposition tokens. After the reply, print each decided item's short-form choice in `Recorded: <handle>=<choice>, ...` (e.g. `Recorded: cache=accept, e2e=rescope`); keep custom choices as `custom(<text>)` with the reply's free text verbatim. Derive handles internally from a short unique word in the title; append a digit on collision. When no clean word fits, use `Gn/Cn` for a split concern or `Gn` for a single-concern gap. Use `<handle>=<choice>` only in this record line and silently accepted legacy replies, never in a prompt. Then continue to Step 4:
