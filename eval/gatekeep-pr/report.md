# eval report: gatekeep-pr (partial run: pr-body-write-failure)

for: 737e7b764f47d65ea7089d576497a72da3ea4054204c8e7068aa35bc9507a7ed

wall: 236s

## Change

Replace per-action repair authority and ordinary wait menus with persistent assess/deliver/deliver-nits courses and the shared menus.md templates. Preserve identity validation, independent claim/mechanism closure, exact-head evidence and terminal cleanup ownership. Source rounds count new repair-wave commits; body-only work and conflict-only syncs have independent accounting. Caps freeze at twice the entry setting, timeout renews only on own push or explicit obstacle continuation, and resumed sync preserves separate restore and lease heads.

Exercise eight course exit/menu scenarios, including successive nit closure, selected one-shot nit readiness, cumulative cap extension, UNKNOWN quarantine, phase guard visibility, owned tracked-clean stop, and batch helper/main-thread agreement. Preserve comment and description snapshot safety under the new course model.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-write-failure | anthropic/claude-opus-5-5 | inconclusive | 19738 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> fails (regression) |
| pr-body-write-failure | github-copilot/gpt-6.1-sol | unchanged | 19159 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held) |

## Feedback

- pr-body-write-failure / anthropic/claude-opus-5-5: A-D survive the course rewrite intact: each keeps P1 open, records the failed prerequisite, avoids a blind retry, and (in D) drafts the surviving-sentence correction without re-applying the confirmed one. E is where After breaks: the record says 'Old-head evidence is discarded', but the fresh-head path then declares 'Evidence re-resolves to CI-sufficient, so there is no local run' and renders 'CI (run 910, ci / test green on 2222222)' - run 910 is the 1111111 check and the digest supplies no check or run for 2222222, so the mergeable verdict and P1 closure rest on old-head evidence relabelled to the new head, exactly what f5 forbids. Before got this right by re-gathering with `gh run list -c 2222...`, finding nothing, falling to the local-run row, running `node --test src/guard.test.ts` at HEAD==2222 with provenance checked, and claim-checking the actual body before resolving P1. To keep f5 under the new course model, make the exact-head evidence rule explicit in the resumed-course text: after a head move, evidence must be re-resolved from checks/runs keyed to the new head, an absent check falls through to a bounded local verification whose head_sha must equal the new head, and the final menu's Evidence line may only cite runs recorded at that head; wording like 're-resolves to CI-sufficient' should be replaced with 'resolve evidence strictly for <new head>; reuse nothing recorded at the pre-move head'. Separately (not a fact here, but worth tightening), A-D's deliver row bundles 'add 6 to each cap' into an ordinary resume after a non-cap obstacle, which conflicts with the Change's intent that extension is offered only when a cap is actually exhausted.
- pr-body-write-failure / github-copilot/gpt-6.1-sol: No fact moved: A–D keep the description finding open, report the 503/502/unexpected-readback/surviving-contradiction outcomes without blind retry or false success, and E leaves the old-head write unconfirmed, invalidates old-head readiness, re-enters Verify/Review against the actual body at 2222222 with fresh helpers, and closes only on new-head claim and CI evidence. Two wording points worth tightening so f5 stays robust under the new course model: E should name where the new-head CI evidence comes from (a refreshed status_checks/actions read at 2222222, matched by SHA) rather than the vaguer 'newly resolved evidence', so a reader cannot mistake it for an unsupported clean assertion; and the A–D deliver rows pair 'no round charged' with 'add 6 to each cap, from 0/6 to 0/12', which offers a cumulative extension while usage is 0 — the Change ties extension to the obstacle/exhaustion path, so phrase the deliver row as resuming the retained course after the prerequisite changes and only mention cap extension when a cap is actually exhausted. Keeping the explicit 'readback, not assumed text' language in B and 'does not treat the unexpected body as an accepted contract change' in C is good and should be preserved in the shared menus.md templates.

exit: 1
