bundle-: skills/subagent-driven-development/implementer-prompt.md
bundle+: skills/forge-skill/SKILL.md

Sample: unreadable-anchor
Scenario: blocked-no-edit

Dispatch:
planPath: /workspace/project/plan.md
anchor: "### Task 5:"
Spec: /workspace/project/spec.md
Work from: /workspace/project
SCOPED_TEST_COMMANDS: none

State the next read, consume only these supplied observations, and return a report with structured JSON. The forge-skill text is authoring-policy context, not a request to edit a persona.

Read observation /workspace/project/plan.md:
```markdown
### Task 40: Decoy
Files: Create: wrong.md
### Task 4: Known task
Files: Create: flag.md
## Next wave
### Task 6: Other task
Files: Create: other.md
```
The complete plan contains no Task 5 heading. No file was edited and no command ran. Report the missing anchor and the dispatched task identity. Do not fabricate Task 5, fall back to inline implementation, or make a dummy write.
