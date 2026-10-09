# Conformance-check render eval

This target tests the durable closure block and the finishing Step 3.5 render the operator sees. Seven samples cover deferred items with references, deviations, directional dependencies, in-scope gaps, mixed dispositions, no dispositions, and settled elsewhere attribution.

| Skill file | Slice |
|---|---|
| `skills/verification-before-completion/reference/conformance-check.md` | Full file |
| `skills/finishing-a-development-branch/reference/disposition-protocol.md` | Full file |
| `skills/finishing-a-development-branch/SKILL.md` | From `### Step 3.5` up to but not including `### Step 5` |

| Sample | Must hold |
|---|---|
| elsewhere-settled | Rows 3 and 5 remain recorded elsewhere attribution, produce no decision items, and reach Step 4. |

Process, commands, and record schema: eval/README.md.
