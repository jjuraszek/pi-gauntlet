# brainstorming eval

Tests the questionary and approaches messages (checklist steps 3-5) against gathered drafts: premise notes, framing question, 2-3 approaches with `Pattern:` lines, ticket cut questions, and repo attribution.

| Skill file | Slice |
|---|---|
| `skills/brainstorming/SKILL.md` | `### 3` through before `### 6` |
| `skills/brainstorming/reference/ticket-acceptance.md` | Whole file |

| Sample | Must-hold behavior |
|---|---|
| `explicit-unit-normalization` | Correct the premise and preserve the shared representation contract. |
| `latest-run-indicator` | Keep per-surface provenance and persisted run metadata. |
| `review-and-apply-containment` | Keep the producer out of scope and reuse field candidates. |
| `cut-without-human-words` | Hard rows stay in-scope without author-proposed cuts; other repo rows are settled attribution. |
| `other-repo-group` | Assign mailer rows elsewhere without asking and keep the spec AC section flat. |
| `unmatched-group-asked` | Ask the three-way attribution question instead of assigning an unknown group silently. |
| `wrong-row-cut-question` | Ask the ordered cut question for a contradicted row and recommend only A or D. |
| `human-raised-drop` | Ask the ordered cut question for a human-raised drop, recommend only A or D, and leave the row uncut until answered. |
| `repair-cancelled` | Return to the unchanged row's cut question after cancelled repair. |

Process, commands, and record schema: `eval/README.md`. The live-tool harness in `replay/` is separate and not a target.
