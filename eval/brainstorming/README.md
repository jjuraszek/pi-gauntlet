# brainstorming eval

Tests questionary and approaches messages (checklist steps 3-5) and same-turn continuation through design rounds (step 6) against gathered drafts and recorded state: premise notes, framing question, 2-3 approaches with `Pattern:` lines, ticket cut questions, repo attribution, and human approval/pause boundaries.

| Skill file | Slice |
|---|---|
| `skills/brainstorming/SKILL.md` | `## Checklist` through before `## Project Routing` |
| `skills/brainstorming/SKILL.md` | `### 3` through before `### 6` |
| `skills/brainstorming/SKILL.md` | `### 6` through before `## Ticket Handling` |
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
| `side-question-return` | Answer the side question, retain the selected resolver, and ask the unresolved reset-behavior question in the same response. |
| `ticket-repair-return` | Use the supplied repaired criterion and resume the unresolved reset-behavior question without another repair approval. |
| `design-approval-return` | Present substantive round two after round-one approval and stop at round two's approval request. |
| `clarification-keeps-gate` | Answer the settings-file clarification while leaving round-one approval pending. |
| `explicit-pause` | Honor the explicit pause without advancing the questionary or design. |
| `shared-helper-option` | In a tool-free next response, name the shared helper and its gap, order each approach's `Removes:` before `Adds:`, and recommend reuse without a caller-side copy; this is not evidence of actual spec writes. |
| `moving-parts-design-return` | In tool-free next responses, carry the selected Remove/Add imperatives into round one and map each acceptance observable and Design edge or error clause to a test in round two; this is not evidence of actual spec writes. |

Cases marked `replay: continuation` request only the next assistant response from the supplied conversation/state. `human-raised-drop` starts after completed placement and approaches, with the user's approach selection and drop request as the final conversation message; fixture material stays outside that conversation. Unmarked cases request the first questionary message and the approaches message, assuming the recorded answers. For `latest-run-indicator`, the first message itself must explicitly raise both false file/item provenance from a workspace-wide revision and the required date missing from a revision-only badge; implications, date-field listings, and approaches-only concerns do not satisfy `framing`. `design-approval-return` bundles `skills/brainstorming/reference/documentation-impact.md` and supplies a completed guideline-read observation; the repair-return case supplies completed repair, re-fetch, and re-extraction observations rather than requesting tool execution.

Matched baseline/candidate comparisons use identical case inputs and slice definitions with different skill revisions. The continuation comparisons remain unchanged; their approval and pause controls hold, so they do not demonstrate improvement. One supplementary original-context first-completion pair changed from a repair acknowledgment to a design choice. It emitted and executed no tools and does not establish a frequency estimate or byte-identical historical transport.

The full report has 27 unchanged cells and one inconclusive cell: a confirmation misses explicit framing and puts the version behind hover rather than beside the date. The user accepts this specific recorded result for landing, not as an eval pass or a blanket waiver; see the spec's [accepted evaluation limitation](../../doc/specs/2026-10-11-brainstorm-same-turn-continuation.md#accepted-evaluation-limitation).

Tool-free response comparison cannot prove actual spec-file writes, tool execution, multi-turn liveness, or perfect compliance across models and sessions. These cases do not cover round-two approval starting the required spec-file write; a prose spec response is not write evidence.

Process, commands, and record schema: `eval/README.md`. The live-tool harness in `replay/` is separate and not a target.
