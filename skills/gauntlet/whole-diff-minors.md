# Whole-diff minors section

The trailing section of every `## Closure / conformance` block
(conformance-check.md "Closure / conformance"); the spec contract is D3 of the
change that introduced it.

Then, in every block (a `CONFORMS` handoff too), the whole-diff review's Minor
findings - the source is the final `SHIP` whole-diff report (SDD "After All
Tasks Complete" step 2; a `FIX_FIRST` whole-diff review's re-review `SHIP`
report when one ran):

```text
whole-diff minors: none
```

```text
whole-diff minors:
[Minor] F3: [shrink] path.ts:30 - ...
[Minor] F7: [yagni] other.ts:12 - ...
```

Use one persona finding line per Minor, verbatim (`Fn` is the selector), or
`whole-diff minors: not recorded` when no whole-diff review ran in this flow.
This section is not a concern card: the sentinel `N`, the card count, and the
freshness rule ignore it. After a `fix minors` round
(`finishing-a-development-branch` Step 4) the regenerated block carries the
prior list minus the selected `Fn` lines plus one line
`whole-diff minors fix: <full SHA>`, so the spent round survives pruning and
resume. On any other re-audit that regenerates the block without the source
report, copy the prior block's `whole-diff minors:` section minus lines selected
by `fix minors`.
