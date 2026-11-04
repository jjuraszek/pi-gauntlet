# eval report: check-delivery (partial run: gate-line-first)

for: abe104947ba8857759d24a70eb0322cffed3b750bae2672d1dfc77d7ef2ada95

wall: 24s

## Change

Add the numbered delivery approval gate and cite the shared menu layout and reply rule while retaining typed yes and the existing write boundary.

Mark confirmation before evidence and exact payloads with the exact confirmation-gate id. Mark ending and STOP reports while keeping Delivered: first in tracker comments, without a gauntlet line in human-channel payloads.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| gate-line-first | anthropic/claude-opus-5-5 | unchanged | 8135 | gate-first: holds -> holds (intended but unchanged); first-line: holds -> holds (intended but unchanged) |
| gate-line-first | github-copilot/gpt-6.1-sol | unchanged | 6477 | gate-first: holds -> holds (intended but unchanged); first-line: holds -> holds (intended but unchanged) |

## Feedback

- gate-line-first / anthropic/claude-opus-5-5: Both outputs open with the exact `gauntlet: gate=check-delivery/confirmation-gate` line, keep all evidence and the exact tracker payload beneath it, start the fenced tracker comment with `Delivered: a123456` with no gauntlet marker inside the payload, and end on a two-choice gate that waits for approval, so the fact holds in both despite the expectation that Before would fail. After keeps everything Before kept; the only notable divergences are cosmetic (changing the fence from `markdown` to `text`, moving the 'no status advance / re-fetch before write' notes below the payload rather than above it, and adding the `blob/a123456/<test path>` link form). If the author wants a visible move on this fact the Before wording would need to actually lack the gate line, which it does not; otherwise the After wording is fine as is - just keep the re-fetch/delta sentence and the 'comment only' note adjacent to the payload so the write boundary stays obvious next to the approval menu.
- gate-line-first / github-copilot/gpt-6.1-sol: Both outputs open with the exact line `gauntlet: gate=check-delivery/confirmation-gate`, place the evidence tables and the fenced tracker comment below it, begin that comment with `Delivered: a123456`, contain no gauntlet marker inside the payload, and end on the two-choice `Pick one:` menu without performing any write — so gate-first holds in Before and After and nothing moved. The After wording is safe for this fact; if you continue iterating, keep the gate line as the literal first line of the response (no heading above it), keep `Delivered:` as the first payload line, and keep the `1. approve the write / 2. decline` menu after all findings so the typed-yes and numbered-pick paths both remain available.

exit: 0
