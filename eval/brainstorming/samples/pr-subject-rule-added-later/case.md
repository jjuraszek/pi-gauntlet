bundle+: skills/brainstorming/reference/pr-subject.md
replay: continuation
## State
Gather and questionary are complete for open PR acme/widget#61, title "Cache retry policy", body "Cache retry settings without changing request behavior." No bound ticket. The user approved both design rounds, retaining the original implementation. You are replacing the gathered draft with a spec, not approving it. Required references are already read. Return only Problem, Acceptance criteria, and Rework record sections of the spec.

## Gathered draft facts
Pre-rework head: 2222222222222222222222222222222222222222
Base: main @ aaaaaaa - merge: bbbbbbb (clean merge, first appended rework commit).
The PR was compliant at fork point. BASE_SHA AGENTS.md now requires every cache key to include tenantId. The fork-point policy lacked that rule. This authoritative rule was read with git show from the fetched base, not inferred from worktree files.
Code recon: existing cache implementation is sound; adding tenantId to the cache-key input repairs it. Keep every original commit reachable from the pre-rework head and the cache implementation. The approved user-observable outcome is that a tenant never receives another tenant's cached result; this is the complete agreed isolation change with no unresolved inputs. Claim "request behavior is unchanged" needs tenant isolation to hold. Framing: kept.
No unresolved threads were returned by a successful query. No conflict tests ran: clean merge. No contract exceptions.
