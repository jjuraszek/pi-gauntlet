bundle-: skills/brainstorming/reference/spec-finalization.md
replay: continuation

## Current state
Checklist step 4. The gathered draft has been read. No design round has been approved. No ticket. Request only the next questionary response, not approaches or a design.

## Gathered draft and completed recon
Add a workspace-switch filter policy to the report view through the existing settings resolver. Framing: kept. settings/resolver.ts:12 owns defaults; ui/report-view.ts:30 consumes resolved settings. Recon traced the resolver's caller in app/start.ts:18 and the resolver-to-view data path. The view's workspace-change handler retains active filters; no existing policy selects different behavior. The framing holds and no premise correction remains.

## Recorded conversation
User: Brainstorm a workspace-switch filter policy for the report view.
Assistant: The framing holds: I traced app/start.ts:18 through settings/resolver.ts:12 to ui/report-view.ts:30 and checked the workspace-change handler. The existing settings path can own this policy.
User: Keep that framing. The remaining decision has exactly three choices: clear all filters on every workspace switch, preserve all active filters across switches, or restore each workspace's last filters. Please ask me that question next with those three choices and your recommendation.
