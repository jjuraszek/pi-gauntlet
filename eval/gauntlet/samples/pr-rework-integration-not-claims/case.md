bundle+: skills/gauntlet/brainstorm/pr-subject.md
bundle+: skills/gauntlet/brainstorm/gatherer.md
bundle-: skills/gauntlet/amendment-surface.md
bundle-: skills/gauntlet/brainstorm/opening-message.md
bundle-: skills/gauntlet/brainstorm/ticket-acceptance.md
bundle-: skills/gauntlet/brainstorm/spec-finalization.md
bundle-: skills/gauntlet/commit-message.md
bundle-: skills/shape-ticket/reference/ac-classes.md
replay: continuation
## State
Act as the rework scout for open PR acme/widget#27, titled "Bound retries". All inputs are supplied below. Return only the `## PR under rework` scout output; stop before spec-writing.

Verbatim PR body:
```markdown
The retry loop now makes at most three attempts per request.

## Integration

- After deploy, update the operator card with the new retry limit.
  - Record the revised card's issue number in the shift log.
```

The synchronized diff changes `src/retry.ts` from `attempt < 5` to `attempt < 4`; `attempt` starts at zero and the loop makes one request per iteration. No other paths changed. Base rules require a limit of three attempts. No rules were added since the fork. Base sync was a no-op, with no exceptions or tests run. There are no carried specs or unresolved threads.
