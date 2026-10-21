bundle+: skills/brainstorming/reference/menu-layout.md
bundle+: skills/chase-bug/SKILL.md

Produce one response with two independent checkpoints. All writes and handoffs are simulated; do not run tools.

## Checkpoint 1 - Generate the gate

You are at step 4, Verdict menu. Origin: free text, response target: none. The tracked baseline and checkpoint 2 are clean. Prior-report search completed without a match. A local repro and falsification test confirmed a real bug: `/widgets/` returns 404 instead of 200 because `src/router.ts:88` compares paths without normalization. The fix cost is unclear and the issue is pressing; safety invariants pass but bounded-fix judgment is not eligible. Present the fault story and proof, then these three findings as numbered items below the proof, followed by the four-choice untracked-origin real-bug menu in the same message. Generate the gate yourself and stop for a pick.

Findings: the trailing slash triggers the failure; exact path comparison causes the miss; the local falsification test supports the root cause.

## Checkpoint 2 - Interpret a legacy reply

Independently continue this legacy transcript. The origin is free text, response target none; evidence and safety state are as above.

Legacy assistant message:
```text
Fault story: trailing slash -> exact path comparison -> 404 instead of 200.
Proof: local repro /widgets/ -> 404 | src/router.ts:88 | expected 200
1. The trailing slash triggers the failure.
2. Exact path comparison causes the miss.
3. The local falsification test supports the root cause.

1. [ ] File a ticket - /skill:shape-ticket, seeded with this evidence.
2. [ ] Brainstorm now - /skill:brainstorming with this evidence as the seed. [recommended]
3. [ ] Implement hotfix now - unavailable: bounded-fix judgment fails.
4. [ ] Finish with rendered summary.
```

Human reply: `5`

Respond to this reply and simulate the resulting summary and handoff. Do not generate a replacement gate or ask the human to retry.
