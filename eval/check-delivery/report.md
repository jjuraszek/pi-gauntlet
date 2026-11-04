# eval report: check-delivery (partial run: menu-after-numbered-findings)

for: abe104947ba8857759d24a70eb0322cffed3b750bae2672d1dfc77d7ef2ada95

wall: 15s

## Change

Add the numbered delivery approval gate and cite the shared menu layout and reply rule while retaining typed yes and the existing write boundary.

Mark confirmation before evidence and exact payloads with the exact confirmation-gate id. Mark ending and STOP reports while keeping Delivered: first in tracker comments, without a gauntlet line in human-channel payloads.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| menu-after-numbered-findings | anthropic/claude-opus-5-5 | unchanged | 13112 | layout: holds -> holds (intended but unchanged); mapped-pick: holds -> holds (intended but unchanged); plain-yes: holds -> holds (intended but unchanged) |
| menu-after-numbered-findings | github-copilot/gpt-6.1-sol | unchanged | 14468 | layout: holds -> holds (intended but unchanged); mapped-pick: holds -> holds (intended but unchanged); plain-yes: holds -> holds (intended but unchanged) |

## Feedback

- menu-after-numbered-findings / anthropic/claude-opus-5-5: Before and After are byte-identical, so no fact moved. In both, checkpoint 1 opens with the exact confirmation-gate id, puts the three ordered findings first, separates them from the gate by prose, the stage table, the exact Delivered:-first payload, and the 'Pick one:' line, so the approve-the-write/decline options render as 1 and 2 and the message waits without writing; checkpoint 2 echoes 'Taking 4 as option 1 - approve the write.' in one sentence before the re-fetch, comment, then Ready advance, the yes subcheck says 'Approved.' with no numeric mapping or resolution echo, and decline writes nothing. The Expected-to-move list predicted layout and mapped-pick going fails -> holds, but Before already held them, so the wording change is a no-op on this case; the only visible tension with the Change paragraph is that the simulated assistant responses in checkpoint 2 still begin with 'gauntlet: done delivered' / 'gauntlet: stuck write declined' lines inside the human-facing text, which is not a listed fact here but is what the 'no gauntlet line in human-channel payloads' instruction targets - if you want After to differ, make the wording explicitly say the gauntlet marker belongs outside the quoted human-channel reply, while keeping the one-sentence label echo and the comment-before-status order.
- menu-after-numbered-findings / github-copilot/gpt-6.1-sol: The After output is textually identical to Before, so nothing moved: both open with the exact confirmation-gate id, present three ordered findings, separate them from the two-choice gate with prose, tables, and a 'Pick one:' line so the options render as 1 and 2, and wait without writing; both resolve the bare `4` by label ('approve the write') in one sentence before the simulated evidence comment → Ready advance after the unchanged-ticket re-fetch, and both treat typed `yes` as explicit approval without mapping it to a number. The Expected-to-move entries claiming Before fails layout and mapped-pick are not borne out by the Before text, which already satisfies them. One gap outside the listed facts: both outputs still emit `gauntlet: done delivered` / `gauntlet: stuck write declined` lines in the human-channel Checkpoint 2 responses, which the Change says should not appear in human-channel payloads; if that is the intended delta, the After wording needs to drop those lines (keeping only the leading gate-id line) while leaving the gate, label echo, and typed-yes handling exactly as they are.

exit: 0
