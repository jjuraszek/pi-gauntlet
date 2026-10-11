# chase-bug eval

Tests the caller response after a completed shape-ticket handoff returns an existing ticket rather than creating a new one.

| Skill file | Slice |
|---|---|
| `skills/chase-bug/SKILL.md` | `### 5. Response to origin (human gate 2)` through before `## Quick Reference` |

The single synthetic `returned-ticket-link` sample supplies a completed shape-ticket result and asks for the terminal unaddressable summary. The slice includes both addressable and unaddressable return instructions. The facts check citation of the returned reference and absence of a new-creation claim; this no-tool text target does not prove triage, tracker retrieval, approval, or writes.

Run `node eval/run.mjs chase-bug --base c10ba7c`. Process and record schema: `eval/README.md`.
