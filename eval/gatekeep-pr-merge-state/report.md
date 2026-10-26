# eval report: gatekeep-pr-merge-state (partial run: unknown-after-repoll)

for: 124b4f8717ce2f5e1e36caee0d780fce359d6508bfe156399cf44818b85f6448

wall: 42s

## Change

Replace per-action repair authority and ordinary wait menus with persistent assess/deliver/deliver-nits courses and the shared menus.md templates. Preserve identity validation, independent claim/mechanism closure, exact-head evidence and terminal cleanup ownership. Source rounds count new repair-wave commits; body-only work and conflict-only syncs have independent accounting. Caps freeze at twice the entry setting, timeout renews only on own push or explicit obstacle continuation, and resumed sync preserves separate restore and lease heads.

Keep BLOCKED/UNKNOWN/check_run/status_context classification unchanged. Course-unset pending reports use initial without an unauthorized watch; bound CI obstacles and eligible delivery paths use the shared templates. Rename neither sample directories nor stable fact IDs.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| unknown-after-repoll | anthropic/claude-opus-5-5 | improved | 14267 | f1: holds -> holds (held); f2: holds -> holds (held); f3: fails -> holds (intended change); f4: holds -> holds (held) |
| unknown-after-repoll | github-copilot/gpt-6.1-sol | improved | 19516 | f1: holds -> holds (held); f2: fails -> holds (unplanned improvement); f3: fails -> holds (intended change); f4: holds -> holds (held) |

## Feedback

- unknown-after-repoll / anthropic/claude-opus-5-5: After delivers the intended move on f3: the post-repoll UNKNOWN now exits through the obstacle template with `stuck - merge state unknown`, no sync, no ordinary wait row, `stop` last and recommended, and an explicit statement that usage stays at rounds 0/10 and syncs 0/10, while merge remains withheld with the unknown-state reason (f1) and crew-approval is still classified binding with `source: pending` (f2, f4). Two spots are worth tightening so later readers don't misread them: the `deliver` row's wording 'retries once GitHub reports a known merge state, no round charged; add 10 to each cap (rounds 0 of 20, syncs 0 of 20)' can look like a wait/poll row and like counters moving in this report, so phrase it as a course selection only (e.g. 'set course to deliver; continuation resumes when GitHub reports a known merge state; caps would freeze at 20/20 on entry') and keep the unchanged 0/10 figures as the only counters shown; and the binding classification should keep Before's general statement ('UNKNOWN makes every pending check binding, so crew-approval is binding') rather than only the single-check conclusion, so f2's 'every pending check' rule is visibly preserved.
- unknown-after-repoll / github-copilot/gpt-6.1-sol: After keeps everything Before kept (merge withheld with the unknown-state reason, no exemption or non-binding claim) and gains two facts: the explicit 'Evidence: pending (crew-approval binding; head 9c1e4f2)' line makes the pending status_context resolve to pending rather than CI, and replacing the recommended 'wait - run one bounded CI watch' row with the stuck verdict, stop-recommended last, and no sync satisfies the post-repoll obstacle exit. One wording risk: the deliver row's 'add 10 to each cap (rounds 0/10 -> 0/20; syncs 0/10 -> 0/20)' sits close to reading as a counter change at exit time; keep the current counters stated plainly as unchanged (rounds 0/10, syncs 0/10) in the report body and describe the cap freeze as a consequence of choosing deliver ('caps freeze at 20 on continuation') so a reader cannot mistake it for the obstacle exit itself charging or resizing anything. Also retain 'no round charged' and the binding note on the evidence line, since those are what carry f2 and f3.

exit: 0
