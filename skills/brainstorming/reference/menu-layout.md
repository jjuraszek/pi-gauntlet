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
