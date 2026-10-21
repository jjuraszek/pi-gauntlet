bundle+: skills/brainstorming/reference/menu-layout.md
bundle+: skills/finishing-a-development-branch/SKILL.md
Workflow stage: Step 4, named-branch worktree.

Produce one output with two independent checkpoints. Simulate every action and handoff; do not run commands.

## Checkpoint 1: Generate the gate

Implementation and verification are complete on feature branch fix-x in a named-branch worktree. The base branch is main. The conformance and whole-diff gates passed. There are no amendments, open decisions, or Minor findings. Present the Step 4 gate after these three observations in the same assistant message: tests passed, conformance passed, whole-diff review passed. Write the observations as three numbered items, then generate the named-branch options yourself.

## Checkpoint 2: Respond to a legacy transcript

This is independent of checkpoint 1. The assistant previously sent exactly this message (there is no separator between the observations and options):

```markdown
1. Tests passed.
2. Conformance passed.
3. Whole-diff review passed.

1. Push and create a Pull Request
2. Push and create a draft Pull Request
3. Squash-merge to <base-branch> (no PR, no surviving branch)
4. Keep the branch as-is (I'll handle it later)
5. Discard this work
```

The human replies: `6`.

Respond to that reply. Name the resolved option by number and label in one sentence before any simulated landing action. Use main as <base-branch>. Then briefly state the selected simulated next action; do not execute it.
