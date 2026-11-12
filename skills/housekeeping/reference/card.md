# Decide

Read `<run>/findings.md`, `<run>/checks.md` and `<run>/run.md`. Group findings by check id into issue classes, one card per class. Record the other classes sharing each class's files. Use only the run record's `picks`, `bounds` and `delivery` fields; do not resolve the input again.

Read [menu-layout](../../brainstorming/reference/menu-layout.md) before rendering or accepting a numeric reply. Apply [verdict-report](../../chase-bug/reference/verdict-report.md) `## Register` and `## Caps and lists` for everyday language and section prose. Render one card per message, no more than 180 words from its title to `Pick one:`.

## Card template

Start the message with `gauntlet: gate=housekeeping/card recommended=<n>`, where `n` is the displayed recommendation's row number, not the card number.

```text
### <card> of <total>. <count> <plain noun> in <place> <plain predicate>

### What was found
<count and up to three example paths; for a change, whether items are in its changed line ranges; for pr-per-class, other cards sharing these files>

### Why it matters
<the rule in everyday words and its source file; name the overridden repo rule and file when the check row's overrides cell is not none>

### What happens if you accept
<the literal change and what the human receives>

Pick one:
1. [ ] Fix - <delivery from the table below>
2. [ ] Ticket - file one ticket listing them and change nothing now
3. [ ] Ignore - leave them as they are
```

Show only the run record's picks, in order, renumbered from 1. Mark exactly one row `[recommended]` and its box `[x]`; leave other boxes `[ ]`. Derive the Fix promise from `delivery`:

| Delivery | Fix row says |
|---|---|
| `pr-per-class` | Build this class in its own worktree and open its own pushed PR against the default branch; leave the primary's tracked files unchanged. |
| `in-place` | Edit the selected files in place, with no commit or push. |
| `commit-push` | Make one commit for this class and push it to the existing PR branch. |

## Availability and recommendation

With `bounds: on`, evaluate the six [hotfix eligibility predicates](../../chase-bug/hotfix.md#eligibility-predicates) once from the card's facts, opening no file to investigate the class. A failed safety invariant (1-3) makes Fix unavailable: show `Fix - unavailable: <everyday reason>`, and reject that pick. Use predicates 4-6 only to steer the recommendation; a `read` class has no regression command, which is a recommendation fact, not a reason to withhold Fix. With `bounds: off`, keep Fix available.

Recommend by the first matching row:

| Card facts | Recommend |
|---|---|
| Rule source in doubt | Ignore |
| Fix unavailable | Ticket when offered, otherwise Ignore |
| Mechanical fix and every item settled by the rule text | Fix |
| Fix needs a design choice and Ticket is offered | Ticket |
| Otherwise | Fix |

## Replies

Keep `<run>/decisions.md` outside the repo. Record the class, pick, excluded items and any verbatim fix instruction. Never edit tracked files, commit, push, create a PR or file a ticket during the walk.

| Reply | Action |
|---|---|
| An available row number | Record its pick, then show the next card. |
| `<n> except 1 3` | Record the pick and leave those numbered items unchanged. |
| Available Fix number followed by text | Record Fix with that text verbatim as this class's instruction; show the next card. |
| `list` | Show the full numbered item list; keep this card open. |
| `go` | End the walk; execute only recorded picks; carry unanswered classes as not decided. |
| `stop` | End per Report with nothing executed; keep the decisions file and name the run folder. |
| An unavailable row, unknown item or unrecognized reply | Explain the invalid selection and ask again on the same card. |

After the last answer or `go`, pass the decisions to Fix. Preserve each ticket's separate `/skill:shape-ticket` exact-text approval; a card pick never supplies that approval.
