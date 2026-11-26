# Spec-gate render eval

This target tests the user review gate's verbatim briefing, council counts, approval menu, and reply handling across full-council, partial-coverage, all-none, worker-path, and row-3-reply samples.

| Skill file | Slice |
|---|---|
| `skills/gauntlet/brainstorm/spec-finalization.md` | `## User Review Gate` |

| Sample | Must hold |
|---|---|
| scope-cuts-listed | Scope cuts lists only deferred and deviating rows. The next line names each marked Integration row once with its kind; moving a row prompts no question. |
| scope-cuts-none | The briefing renders `Scope cuts: none`. |

Process, commands, and record schema: eval/README.md.
