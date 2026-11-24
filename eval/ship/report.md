# eval report: ship (partial run: deferred-spec-stop)

for: 7ebcf0ef9a82a98e5ef879e0062d7f249acab95738f8b56d22877668b4065adf

wall: 17s

## Change

Read current ledger pending recovery from restore-loop.md before verification or stripping, and read coordinated recovery rules only for multi-leg delivery. Preserve once-only admission from ledger-held home attribution or a companion return file, consumed iterations, allowance accounting, rejected-boundary recovery and the stop on an unavailable before-image. Preserve post-strip verification ownership and receipt-validated recovery after the owner split. The selected ledger-pending-return fixture uses allowance: and returned: rather than an old cap header or commit-body decoder. Selected text replays inspect supplied recovery and delivery observations; they do not prove live Git or tracker execution. Coverage is sample-scoped, not a target-wide pass.

For a deferred spec, print the numbered gauntlet command before starting delivery so the user can open the PR in a fresh session.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| deferred-spec-stop | anthropic/claude-opus-5-5 | improved | 5383 | boundary: holds -> holds (held); notice: fails -> holds (intended change) |
| deferred-spec-stop | github-copilot/gpt-6.1-sol | improved | 7386 | boundary: holds -> holds (held); notice: fails -> holds (intended change) |

## Feedback

- deferred-spec-stop / anthropic/claude-opus-5-5: The boundary fact holds in both outputs: in each, all three variants stop at the resolved `**Engine:** deferred` header before the announcement, ship phase start, verification, strip, seal or push; grant `all` is explicitly said not to lift the stop; the absent-PR variant uses the known subject #42; and no delivery or tracker call is narrated as happening after the stop. The After wording changed only the printed notice from `run brainstorming #42` to `run /skill:gauntlet #42`, which delivers the intended gauntlet-entry naming without disturbing the boundary. After also consolidates the entry steps into a shared section; this still reads as applying to every variant because each variant says the steps are the same and restates its own outcome. To keep this fact safe, retain the explicit per-variant statement that nothing runs after the stop (Variant A and C are terser than Before here, e.g. 'nothing ran' rather than listing announce/verify/strip/seal/push), and keep the lines stating that the grant does not exempt the stop and that #42 comes from the known subject when the PR header is absent.
- deferred-spec-stop / github-copilot/gpt-6.1-sol: The boundary fact did not move: in both Before and After, all three variants (PR header present, PR header absent with known subject #42, and grant all) end in a single stop line, 'spec approved for handoff only', with no announce/start ship, tracker mutation, verification, strip, seal or push narrated afterwards. Grant all gets the same stop as the others, and the absent-header variant resolves to #42. The only visible difference is that After names the explicit '/skill:gauntlet #42' entry where Before said 'run brainstorming #42'; this delivers the intended notice change without disturbing the boundary. To keep it that way, keep the wording that prints the gauntlet command as part of the stop itself, before any delivery starts, and keep stating that grant values do not exempt deferred admission and that a missing PR header falls back to the known subject number. One small risk: After's variant labels dropped the explicit 'acme/widget#42' and, in the second line, the grant value, so consider having the output state the resolved Engine: deferred header as the reason for the stop, so the boundary is explicit in the text rather than implied by the stop line alone.

exit: 0
