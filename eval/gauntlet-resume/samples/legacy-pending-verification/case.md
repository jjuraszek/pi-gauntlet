bundle-: skills/gauntlet-resume/reference/brief-contract.md
## Entry boundary
Classify the supplied legacy pending verification return at reconstruction step 4.1, before Returns conversion. Entry checks, approval and phase restoration have passed. Do not execute tools or continue through gates.

## Fixed observations
The home ledger has allowance 4, iterations 6, all rows done and no returned header. Its only dirt is the already-consumed iterations bump from 5 to 6 and this tuple:

```text
pending: verify | companion | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

Home HEAD is unchanged from the saved pre-dispatch HEAD, and the saved before-image is readable. Companion HEAD is bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, its tree is clean, and the complete tuple-SHA..HEAD range contains exactly that one repair commit. The worker returned DONE. The repair fixes the supplied failing check without changing any ledger state. No companion return file exists. The repair commit body is:

```text
pending: verify | companion | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
iteration: 6

Fix the failing check.
```

No home repair marker has admitted this tuple yet. Rows, attempts, mapping, allowance and prior decisions match the saved ledger. All local reads and checks succeed.

## Output and stop boundary
State admit or interrupted, identify the attribution source and validator, and describe the single home marker and subsequent conversion's effect on the repair count. State whether the companion repair commit survives and whether iterations or row attempts change. Stop at this decision; do not execute settlement, conversion, refresh, a dispatch or a gate run.

## Validation
This isolated narrative tests legacy verification routing, not live restoration. scripts/loop-legacy-conversion.test.mjs executes the body adapter, verification attribution check and conversion recipe in disposable Git fixtures, including wrong tuple/iteration rejection and a second conversion.
