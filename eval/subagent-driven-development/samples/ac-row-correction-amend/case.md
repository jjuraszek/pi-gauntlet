bundle+: skills/brainstorming/SKILL.md
bundle+: skills/brainstorming/reference/amendment-surface.md
# Evidence-backed drafted row correction

During waves task 3 "Frame parser", spec header says `**Amend-grant:** auto-apply amends`. An approved drafted AC row says "Reject all empty frames" but the approved existing component rule permits heartbeat markers. Implementer returns BLOCKED and quotes `src/frame.ts:18 - if (kind === HEARTBEAT) return true` and assertion `expected heartbeat allowed, got rejected`. Recommended amendment a: correct that same drafted row to "Reject empty payload frames; permit the existing heartbeat marker". No row is added/removed and no component boundary or problem statement changes. Existing plan available; plan-writer amend returns successfully and plan_check passes. Show same-turn amendment actions through the granted audit commit, quoting the implementer evidence.

For independent negative controls, replace this setup with each: the row originates in the ticket; only reviewer taste supports the correction with no implementer evidence; add or remove a row; change the problem statement; add a component or alter a boundary. Explain whether these auto-apply. Keep redraw-under-grant expectations unchanged.
