# eval report: check-delivery (partial run: per-ref-settlement)

for: 918654767620334760c8323c15d63ef51c7c52612eab0b6edec1370d388b686f

wall: 21s

## Change

Require one plain per-ref outcome row below the terminal marker on singleton success and early stops, after selected writes or follow-ons finish. Preserve set settlement and tracker payload boundaries. Run only per-ref-settlement for this edit and preserve historical results; coverage is sample-scoped, not a target-wide pass.

Add the numbered delivery approval gate and cite the shared menu layout and reply rule while retaining typed yes and the existing write boundary.

Mark confirmation before evidence and exact payloads with the exact confirmation-gate id. Mark ending and STOP reports while keeping Delivered: first in tracker comments, without a gauntlet line in human-channel payloads.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| per-ref-settlement | anthropic/claude-opus-5-5 | improved | 6099 | settled: fails -> holds (unplanned improvement); terminal: holds -> holds (held); identity: fails -> holds (intended change) |
| per-ref-settlement | github-copilot/gpt-6.1-sol | improved | 6864 | settled: fails -> holds (unplanned improvement); terminal: holds -> holds (held); identity: fails -> holds (intended change) |

## Feedback

- per-ref-settlement / anthropic/claude-opus-5-5: After adds the plain `#52: delivered` row at the end of the message, below the `gauntlet: done delivered` terminal marker, which is exactly what the Change asked for; it also opens no gate and adds no tracker payload or new write, so the settled fact holds. Before lacked that per-ref row entirely, so it failed on the row requirement even though it otherwise opened no gate and added no payload. Keep the row as a bare `#<ref>: <outcome>` line after the closing status sentence; to avoid any reader taking it as a new write, retain the explicit 'Nothing is pending' sentence immediately before it, and consider restoring the explicit mention that the two halves landed in order (comment first, then status) so the readback and write-boundary detail from Before is not lost in the compressed After wording.
- per-ref-settlement / github-copilot/gpt-6.1-sol: Before closes with "#52 delivered at `fedcba9`." inside a prose sentence, so there is no plain `#52: delivered` row under the `gauntlet: done delivered` marker and the fact fails there. After places a bare `#52: delivered` line directly below the terminal marker, then reports the readback and shipped SHA as separate prose, with no gate opened, no tracker comment reconstructed, and no new write, so the fact holds. The After wording already satisfies the Change for this case; keep the row exactly as a standalone `<ref>: <outcome>` line immediately after the marker and keep the SHA/readback detail in the trailing prose rather than folding it back into the row, which is what caused Before to miss.

exit: 0
