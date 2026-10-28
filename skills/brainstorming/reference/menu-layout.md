## First-line rule
Start each settled, skill-owned turn at column zero of the whole assistant message with exactly one lowercase marker line:

| Kind | Grammar | Use |
|---|---|---|
| gate | `gauntlet: gate=<skill>/<id>( recommended=<token>)?` | Render an inventoried skill template that waits for a reply. |
| question | `gauntlet: question` | Ask one questionary-format question or a skill-named yes/no question and wait. |
| done | `gauntlet: done <outcome>` | Report the skill's terminal outcome with nothing awaited. |
| stuck | `gauntlet: stuck <reason>` | End the skill without its outcome and without an advancing reply. |

Use `[A-Za-z0-9.-]+` for `<skill>`, `<id>`, and outcome tokens. Set `<skill>` to the owning directory under `skills/`, including for reference files; set `<id>` to the gate's step or section label in kebab-case. Write `<outcome>` as comma-separated bare tokens or `key=value` tokens with no spaces. Write `<reason>` as free text to the end of the line.

Classify a turn that any proper reply can advance as a gate or question, never `done` or `stuck`. Place the marker before all prose, including premise corrections, summaries, and mandatory framing; retain the existing prose and question format (`A)` options and `Recommendation:`) after it. Use the lowercase `gauntlet:` marker without a leading slash; treat the `/gauntlet:` slash-command namespace as unrelated.

For `recommended=`, use only the number of the displayed row tagged `[recommended]`; omit it for untagged and item-letter menus, including per-item `Recommended: <letter>` lines. Let the displayed row text define accepted replies; omit `picks=`.

Mark a combined batch/menu or closure digest/options message once with its parent template's marker: `gauntlet: gate=gatekeep-pr/batch-summary` or `gauntlet: gate=finishing-a-development-branch/step-4`, respectively. Give a nested skill's ask its own skill id. Give a terminal report turn and a later new-skill gate turn their own kinds.

Omit markers from ordinary answers, gates invented outside skill templates, and intermediate reports followed by automatic continuation without a human turn. Treat verification's Closure / conformance before finishing, subagent-driven-development's Continuous Execution, and loop-implementation's After the loop as intermediate, not terminal; mark the gate the continuation renders instead.

## Exposure
A numbered option list directly after an ordered list with only a blank line merges under CommonMark, displaying `N+1.`-`N+k.` after `N` preceding items. This control renders the options as `4.`-`6.`:
```markdown
1. Finding A
2. Finding B
3. Finding C

1. Keep
2. Merge
3. Stop
```

## Permitted layouts
Separate numbered options from preceding ordered content. Default to a prose line (`Pick one:` or `Verdict:`); alternatively insert a `---` rule or write preceding content as bullets:
```markdown
1. Finding

Pick one:
1. Merge
```
```markdown
1. Finding

---

1. Merge
```
```markdown
- Finding

1. Merge
```

## Reply mapping
Apply only to bare numeric replies to numbered option menus. Leave #63 compound replies such as `1: cache=A` and its bare-`1` shortcut to [disposition-protocol.md](../../finishing-a-development-branch/reference/disposition-protocol.md).
Count `N` options and let `L` count every preceding item in the entire contiguous ordered run adjoining the options through blank lines alone. Stop at prose, a rule, or bullets; earlier separated lists contribute nothing. Set `L = 0` after a separator.
Take replies `1`-`N` unchanged, without echo, even when they also equal `L + k`. Only map `R > N` with `1 <= R - L <= N` to option `R - L`; echo the resolution before acting: `Taking 5 as option 2 - merge`. For every other out-of-range reply, ask a clarifying question naming the valid range `1`-`N`.
