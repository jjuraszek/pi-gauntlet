# eval report: spec-gate (partial run: worker-path)

for: 37ebc5026080ed6a54d74babab22ee4ac95dea786c0311dcad6cedbef299be5c

wall: 71s

## Change

Omit council row 3 and the Council counts line whenever no audit exists, on both the worker path and an aborted council path. Apply that omission independently of zero-row and PR-subject withholding without renumbering the remaining choices. A reply naming the hidden council row asks for a rendered choice without printing an audit or approving implementation.

Extend worker-path with zero-worker, pr-worker, zero-pr-worker, and aborted-audit cases plus hidden-row replies. Run only spec-gate/worker-path against base 855e872a42f9cac7a795704f3e0b383b182950ab. This text replay checks narrated gates and actions, not live git operations. Preserve all other sample records; coverage is partial. Keep the deterministic contract beside its scripts/brainstorming-*.test.mjs siblings; paid replay remains outside CI.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| worker-path | anthropic/claude-opus-5-5 | improved | 13668 | f1: holds -> holds (held); f2: holds -> holds (held); f3: fails -> holds (intended change); f4: holds -> holds (held); f5: holds -> holds (held); combined: fails -> holds (intended change); aborted: fails -> holds (intended change); hidden: fails -> holds (intended change) |
| worker-path | github-copilot/gpt-6.1-sol | improved | 12974 | f1: holds -> holds (held); f2: holds -> holds (held); f3: fails -> holds (intended change); f4: holds -> holds (held); f5: holds -> holds (held); combined: fails -> holds (intended change); aborted: fails -> holds (intended change); hidden: fails -> holds (intended change) |

## Feedback

- worker-path / anthropic/claude-opus-5-5: The After wording moved all four expected facts and lost none that Before kept. f3 moved because the initial worker gate now renders exactly rows 1 (plan engine), 2 (loop engine) and 4 (draft PR), where Before rendered 1, 2, 4, 5, 6 under a different numbering. combined and aborted moved because the zero-row and PR-subject withholdings now compose with the missing-audit omission: rows keep their original numbers and labels, the zero-row gates drop the loop flags including --allowance and print the unavailability line, the Withheld line sits outside the numbered list, and marker, [recommended] tag and Recommended line agree in every gate. hidden moved because each reply `3` now asks one question naming only that gate's rendered rows and states the gate is still waiting with no file, spec or commit change; Before named unrendered digits and added a second paste-rows alternative. Two things to tighten, neither of which flipped a fact: After drops the `Context: unknown` line from every gate even though the case asks for it, so say explicitly that the context line survives when row 3 and the Council line are omitted; and on reply `1` After pastes the whole auto-apply sentence into `**Amend-grant:**`, so name a short grant value for the default so that approval of the plan engine stays unambiguous.
- worker-path / github-copilot/gpt-6.1-sol: The After wording moved all four expected facts (f3, combined, aborted, hidden) from fails to holds and lost nothing Before kept (f1, f2, f4, f5). Before rendered a 1/2/4/5/6 menu with loop rows still present under PR and aborted cases, recommended row 1 everywhere, and had its reply-3 clarifications name rows such as 5 and 6. After renders the fixed 1/2/4 numbering with row 3 simply absent on both the worker and aborted paths, and composes zero-row and PR withholding without renumbering. It drops row 2 and its flags, including `--allowance`, on zero-row gates, and prints the `Loop engine unavailable` and `Withheld: draft PR - #42 already exists` lines outside the numbered list. Marker, `[recommended]` tag and Recommended line agree in every gate, and each reply `3` asks one question naming only the rendered rows while leaving the gate waiting. To keep this stable, keep explicit that the briefing body is reproduced word for word; the added `## Briefing` heading is harmless, but paraphrase would break f1. Keep the aborted-path explanation in the reply rather than as a gate line, so no line starting with `Council` can drift into a `Council:` counts line. Keep the hidden-row reply to a single question that lists only rendered digits, without appending extra alternatives such as 'or request a spec change'.

exit: 0
