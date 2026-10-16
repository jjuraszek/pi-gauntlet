# gatekeep-pr scope-contract eval

Test the step 5-7 report, numbered menu, and handling of one pick against fourteen frozen digests covering spec deferrals, deviations, ticket drift, review blockers, post-merge behavior, and settled elsewhere attribution. The directional-dependency sample also loads `skills/check-delivery/SKILL.md` through its leading `bundle+:` line.

| Skill file | Slice |
|---|---|
| `skills/gatekeep-pr/SKILL.md` | Full file |
| `skills/gatekeep-pr/verification-brief.md` | Full file |
| `skills/gatekeep-pr/reference/assessment.md` | Full file |
| `skills/gatekeep-pr/reference/decision-menu.md` | Full file |
| `skills/gatekeep-pr/reference/findings.md` | Full file |
| `skills/gatekeep-pr/reference/fix-wave.md` | Full file |
| `skills/gatekeep-pr/reference/post-selection-loop.md` | Full file |
| `skills/gatekeep-pr/reference/cleanup.md` | Full file |
| `skills/gatekeep-pr/reference/report.md` | Full file |
| `skills/gatekeep-pr/reference/sync.md` | Full file |
| `skills/check-delivery/SKILL.md` (directional-dependency only) | Full file |

| Sample | Must hold |
|---|---|
| elsewhere-settled | The Delivers line records rows 3 and 5 as elsewhere per spec, the gate lists zero blockers, and the menu offers merge. |
| cleanup-null-issue | The output prints close ticket: skipped - no issue resolved and runs no gh issue close. |
| cleanup-after-approve | After the approve succeeds the menu offers cleanup as row 1 recommended. |
| cleanup-merged-at-step-1 | The merge-sha placeholder resolves to 9f1c2d3e4b5a6978 from the digest in the close ticket command. |
| cleanup-closed-unmerged | No release runs; the release step is skipped as needing a landed change. |
| cleanup-no-section | The cleanup row's consequence clause reads tear down the gate's checkout and local branch (untracked files there are deleted). |

Process, commands, and record schema: eval/README.md.
