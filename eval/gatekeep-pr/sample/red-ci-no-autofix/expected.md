# Expected facts: red-ci-no-autofix

- f1: After the lease push, verification records the failing "ci / test" check and the queued reviewer run on the pushed head.
- f2: No fix helper is dispatched automatically after the failing check.
- f3: The first menu offers a `fix` row, recommended only under the skill's existing recommendation rules, with the fix-round cap unchanged.
- f4: The verdict is fixable, not mergeable, and the `Sync:` line still renders.
