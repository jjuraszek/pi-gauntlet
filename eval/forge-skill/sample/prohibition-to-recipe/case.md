```file SKILL.md
---
name: answer-question
description: Use when the user asks a factual question about the codebase and wants a direct answer.
---

# Answer Question

## Overview

Find the answer in the source and state it.

## Procedure

1. Restate nothing; open the file the question names, or search for the symbol with `rg`.
2. Read the definition end to end.
3. Answer in one paragraph: the fact, the file and line it comes from, and the one caveat the source shows.
4. Stop.

## Output

One paragraph. The first sentence is the answer. The second sentence names the source as `path:line`. A third sentence exists only when the source shows a caveat.

## Rules

- Read before answering; never answer from memory.
- One term per concept.
- ASCII punctuation.

## Red flags

- An answer with no `path:line`.
- A paragraph that opens by restating the question.

## Examples

### Configuration default

Question: What is the default retry count?
Good: The default retry count is three. The default is defined at `src/config.ts:18`.
Bad: The retries probably use a typical default.

Use the literal value from the definition, not an estimate.

### Boundary behavior

Question: What happens for an empty list?
Good: An empty list returns zero. The return branch is at `src/count.ts:12`. The branch runs before the filter.
Bad: An empty list causes an error, based on the function name.

Check the branch before describing its result.

## Edge cases

- Follow an imported constant to its definition.
- Name the missing definition before asking for another file.
- Distinguish a test expectation from the implementation's return value.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it and apply its `## conventions` section.
```
```request
Stop the model from adding a summary sentence at the end of the answer. It keeps closing with "In summary, ..." even for one-fact answers.
```
