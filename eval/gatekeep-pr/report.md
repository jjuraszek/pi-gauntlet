# eval report: gatekeep-pr (partial run: pr-body-write-failure)

for: 777c8811b8a60323ad07a1e95d97289b87ea5d8e402eaecb4490da1528a3cdca

wall: 215s

## Change

Replace per-action repair authority and ordinary wait menus with persistent assess/deliver/deliver-nits courses and the shared menus.md templates. Preserve identity validation, independent claim/mechanism closure, exact-head evidence and terminal cleanup ownership. Source rounds count new repair-wave commits; body-only work and conflict-only syncs have independent accounting. Caps freeze at twice the entry setting, timeout renews only on own push or explicit obstacle continuation, and resumed sync preserves separate restore and lease heads.

Exercise eight course exit/menu scenarios, including successive nit closure, selected one-shot nit readiness, cumulative cap extension, UNKNOWN quarantine, phase guard visibility, owned tracked-clean stop, and batch helper/main-thread agreement. Preserve comment and description snapshot safety under the new course model.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-write-failure | anthropic/claude-opus-5-5 | inconclusive | 35445 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> fails (regression) |
| pr-body-write-failure | github-copilot/gpt-6.1-sol | unchanged | 18999 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held) |

## Feedback

- pr-body-write-failure / anthropic/claude-opus-5-5: A-D carry over cleanly: After keeps P1 open on the 503, on the unreadable 502, on the unexpected readback, and on the surviving-sentence recheck, with no blind retry and no success claimed for an unconfirmed write; D's auto-continuation to a second delivery iteration is consistent with the Change (new proposal applied on the next iteration under the retained course) and only closes P1 after a fresh write and a fresh recheck, so f4 still holds, though the menu-less continuation should state explicitly that the second recheck result is the hypothetical clean default rather than an observed one. E is where After slipped: it correctly leaves the raced write unconfirmed and P1 initially open, but then asserts `ci / test completed success on 2222222` even though the only supplied check (run 910) is bound to head 1111111 and no run is supplied for 2222222; that is either old-head evidence re-labelled for the new head or an unsupported clean assertion, and P1 is closed on it. Before avoided this by resolving to the fallback row (local verification command on 2222222, log captured, claim check matched). To keep f5 while delivering the new course model, have E's Verify at 2222222 state that no check/run exists for the new head, run `node --test src/guard.test.ts` bounded at 15 min with provenance (`head_sha 2222222`, log path) as the evidence, keep the fresh claim-check of the actual body, and only then record `P1: resolved` and render the final merge/stop menu with the evidence line naming the local run rather than CI.
- pr-body-write-failure / github-copilot/gpt-6.1-sol: No fact moved: After A–D each keep the claim finding open, name the exact failure (503, unreadable 502, mismatched readback, surviving-contradiction helper line), refuse to repeat the write, and render the new assess/deliver/stop template with merge in the Not-offered line; After E leaves the original operation unconfirmed, re-enters Verify and Review at 2222222 with fresh worker/code-reviewer runs that check the actual description, and resolves the claim only from that new-head assessment. Two spots in After E are thinner than Before and are worth tightening so the fact stays robust under stricter readers: Before E said explicitly 'Do not repeat the old-head write or reuse old-head readiness' and 'initially leave its claim open', whereas After E only says 'leave the original description operation unconfirmed' and 'invalidate readiness' — add a sentence like 'Keep P1 open until the new-head description recheck closes it; the stale write is not re-applied' — and After E's report dropped the head-bound 'Evidence: CI (run …, ci / test green on 2222222…)' line that A–D carry, so restore that line at the new head so the mergeable verdict visibly binds to exact-head evidence. Otherwise the course-based wording ('resume the retained course … no round charged; add 6 to each cap', 'Not offered: approve (this is your own PR)') delivers the Change without weakening the snapshot-safety behaviour.

exit: 1
