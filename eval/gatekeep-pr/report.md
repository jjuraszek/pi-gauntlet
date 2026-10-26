# eval report: gatekeep-pr (partial run: pr-body-write-failure)

for: 3c46fbe7f4439f9a0230fd0f3908cc5d32eec082812de67b0245a65e5e698bde

wall: 200s

## Change

Replace per-action repair authority and ordinary wait menus with persistent assess/deliver/deliver-nits courses and the shared menus.md templates. Preserve identity validation, independent claim/mechanism closure, exact-head evidence and terminal cleanup ownership. Source rounds count new repair-wave commits; body-only work and conflict-only syncs have independent accounting. Caps freeze at twice the entry setting, timeout renews only on own push or explicit obstacle continuation, and resumed sync preserves separate restore and lease heads.

Exercise eight course exit/menu scenarios, including successive nit closure, selected one-shot nit readiness, cumulative cap extension, UNKNOWN quarantine, phase guard visibility, owned tracked-clean stop, and batch helper/main-thread agreement. Preserve comment and description snapshot safety under the new course model.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-write-failure | anthropic/claude-opus-5-5 | inconclusive | 13388 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> fails (regression); f4: holds -> holds (held); f5: holds -> holds (held) |
| pr-body-write-failure | github-copilot/gpt-6.1-sol | unchanged | 29800 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held) |

## Feedback

- pr-body-write-failure / anthropic/claude-opus-5-5: The only regression is checkpoint C: After has the description-recheck helper return `P1: resolved (the test claim is gone)` and then mints a new P2 for the contradictory "Reject signed events only." sentence, so P1 is closed on an unexpected readback that never carried the consented text. Before kept the helper result as `P1: open - body does not carry the consented text; ... contradicts src/guard.ts` and regenerated the proposal under the same stable P1. The course/menu changes (deliver/assess/stop rows, cumulative cap extension, stuck verdicts, hint-only show evidence) are fine and don't disturb A, B, D or E; to keep f3 while delivering the Change, state in the description-recheck contract that an unexpected readback (old_text absent, consented text not present) can never close the affected claim - the helper reports the claim `open` and the orchestrator redrafts the correction on the existing P# rather than resolving it and minting a replacement ID.
- pr-body-write-failure / github-copilot/gpt-6.1-sol: No fact moved: A, B and C keep the claim open, name the API failure/unreadable readback/unexpected body, retry nothing blindly and omit merge; E discards run 910 for the moved head, leaves the old operation unconfirmed, and reaches readiness only through a fresh Verify/Review and fresh claim dispositions at 2222..., which is actually stronger than Before's unsupported 'CI green on the assessed head'. The one point to watch is D: After correctly records 'narrow helper leaves P1 open' and does not close it from that recheck, but then runs the second correction and its clean recheck inside the same checkpoint and renders mergeable, so a reader has to infer that closure came from the new 'Not all paths are tested.' write plus a fresh affected-only recheck rather than from the contradicting one. To keep that unambiguous while still delivering the persistent deliver course, have D print the second readback line and an explicit closure line (e.g. `P1: resolved - fresh recheck at 1111... after second replacement`) before the mergeable verdict, so the open-then-resolved transition and its evidence are visible rather than summarized as 'the unspecified helper result is clean'.

exit: 1
