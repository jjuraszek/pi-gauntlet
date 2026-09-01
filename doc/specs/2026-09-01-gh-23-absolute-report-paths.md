# Absolute report paths in isolated dispatch examples

## Context

GitHub issue [#23](https://github.com/jjuraszek/pi-gauntlet/issues/23) identifies five relative `output:` values in two copy-pasteable `subagent` examples that also enable `worktree: true`. pi-cohort resolves those relative paths inside each task's throwaway checkout. The report is then captured with the agent's implementation diff and destroyed when the checkout is removed, instead of remaining available to the orchestrator as a standalone artifact.

The affected examples are the parallel-wave dispatch in `skills/subagent-driven-development/SKILL.md` and the fix fan-out dispatch in `skills/dispatching-parallel-agents/SKILL.md`. The latter skill's Output-capture guidance also omits the absolute-path constraint and its consequences.

This is inconsistent with existing guidance in `skills/brainstorming/gatherer.md` and `skills/roasting-the-spec/SKILL.md`, both of which mint an OS temporary directory outside the worktree and require absolute report paths. It will also become an upfront dispatch error after pi-cohort issue [#8](https://github.com/jjuraszek/pi-cohort/issues/8) implements its planned rejection of relative `output:` paths under worktree isolation. Absolute paths already work, so this correction does not require coordinated releases.

## Goal

Make both isolated-dispatch examples independently copy-pasteable without placing reports inside throwaway checkouts, and make the general Output-capture guidance state the governing invariant and present-day failure consequences.

## Non-goals

- Change pi-cohort runtime validation, report persistence, patch capture, or cleanup behavior.
- Coordinate a release or raise the pi-cohort peer-dependency floor.
- Change dispatch fields unrelated to report paths.
- Add CI machinery to semantically lint Markdown dispatch examples.
- Migrate relative `output:` examples outside the two locations named by issue #23.
- Prescribe explicit cleanup for the temporary report directories.

## Design

### Shared example pattern

Immediately before each affected TypeScript dispatch fence, add a bash fence that mints the report directory:

```bash
REPORT_DIR=$(mktemp -d)
```

`mktemp -d` returns an absolute directory under the host OS temporary root, outside every isolated checkout. The following TypeScript fence roots each report path in the named directory, for example:

```ts
output: "<REPORT_DIR>/wave1-task1.md"
```

The shell setup and named interpolation make the examples self-contained: readers are shown where the directory comes from and do not need to invent a safe location. `<REPORT_DIR>` is replaced with the absolute path minted by the preceding bash fence, not typed literally. This follows the established `skills/brainstorming/gatherer.md` convention.

The examples intentionally omit `rm -rf "$REPORT_DIR"`. Their reports are coordination and post-mortem artifacts read after task execution and potentially across waves. Deleting the directory in the dispatch example risks removing those artifacts before their consumers finish; normal OS temporary-directory cleanup is sufficient for this documented flow.

### Parallel-wave example

In `skills/subagent-driven-development/SKILL.md`, add the bash setup immediately before the existing parallel-wave TypeScript example. Change only these values inside the TypeScript fence:

- `output: "wave1-task1.md"` to `output: "<REPORT_DIR>/wave1-task1.md"`
- `output: "wave1-task2.md"` to `output: "<REPORT_DIR>/wave1-task2.md"`

Except for these two values and the separate directory-setup fence, preserve the v5.2.2 TypeScript dispatch byte-for-byte. In particular, do not alter context, cwd, worktree isolation, concurrency, agents, task text, comments, punctuation, or formatting.

### pi-cohort Integration example and guidance

In `skills/dispatching-parallel-agents/SKILL.md`, add the same bash setup immediately before the existing TypeScript example under `## pi-cohort Integration` that contains the `a.md`, `b.md`, and `c.md` report paths. Change only these values inside the TypeScript fence:

- `output: "a.md"` to `output: "<REPORT_DIR>/a.md"`
- `output: "b.md"` to `output: "<REPORT_DIR>/b.md"`
- `output: "c.md"` to `output: "<REPORT_DIR>/c.md"`

Except for these three values and the separate directory-setup fence, preserve the v5.2.2 TypeScript dispatch byte-for-byte.

Amend the existing Output capture bullet to retain its explanation of inline versus file output and `outputMode: "file-only"`. State that when a batch uses `worktree: true`, its `output:` paths must be absolute and outside every isolated checkout. Explain both present-day consequences of a relative path in that isolated case: the report is captured as part of the helper's work, and it is destroyed with the throwaway checkout. For non-isolated batches, state the distinct risk: a relative report lands in the shared working tree and can be committed or overwritten by a later task. Do not document pi-cohort #8's proposed future error shape; the bullet remains accurate before and after that runtime change without coupling this skill to an unreleased implementation detail.

## Data and control flow

1. The orchestrator runs `REPORT_DIR=$(mktemp -d)` before constructing the dispatch.
2. Each isolated task receives a distinct report filename rooted in that absolute directory.
3. Each agent changes source files only in its throwaway worktree while pi-cohort writes its textual summary outside that checkout.
4. pi-cohort captures only intended implementation changes in each worktree diff.
5. The orchestrator reads the persistent report files after the parallel wave or fan-out completes.
6. Worktree removal cannot remove the reports because they are not descendants of the worktree path.

No production data structure or API changes. `output` remains a string path accepted by the existing `subagent` interface.

## Error handling and edge cases

- Relative `output:` paths are the prohibited state in these isolated examples because their resolution depends on the disposable task checkout.
- Each task keeps a distinct filename under the shared temporary directory, avoiding same-path collisions within a dispatch.
- The spec does not add shell error handling for `mktemp` or report-write failure; the surrounding examples do not model shell failure control, and those behaviors are outside issue #23.
- The spec does not silently relocate caller paths. The examples supply correct absolute paths directly, matching current pi-cohort behavior and the intended future validation in pi-cohort #8.
- Read-only or non-isolated examples elsewhere are unchanged. The strengthened guidance still recommends the safe absolute-path contract for batch or isolated output capture.

## Testing and verification

Verification is documentation-focused:

1. Inspect both affected snippets and confirm each directory setup immediately precedes its TypeScript dispatch.
2. Confirm all five affected `output:` values are rooted in `<REPORT_DIR>` and the former bare values no longer appear in those snippets.
3. Compare each modified TypeScript fence with its v5.2.2 version and confirm that only the affected `output:` values changed.
4. Confirm the revised Output capture bullet scopes the absolute/outside-checkout constraint and diff-capture/deletion consequences to `worktree: true`, and accurately describes the shared-working-tree risk for non-isolated batches.
5. Confirm the existing absolute-path statements in `skills/brainstorming/gatherer.md` and `skills/roasting-the-spec/SKILL.md` remain present and are not contradicted.
6. Run `npm test` for repository integrity checks.
7. Run `rg -ni "jjuraszek|/Users/[^/]+" skills/` and expect zero matches, confirming that the change introduces no fork-specific names or user-local paths.

A new CI lint is not justified. Correlating Markdown snippets, `worktree: true`, and path forms would add brittle machinery beyond this focused contract correction; pi-cohort #8 owns enforceable runtime validation.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: none
- Derived / memory docs invalidated: none

The three classes above apply the materiality bar in [reference/documentation-impact.md](../../skills/brainstorming/reference/documentation-impact.md). The two skill bodies are implementation surface and therefore are not documentation-impact entries. No README, AGENTS.md section, topic guide, or index becomes inaccurate.

## Acceptance criteria

- `skills/subagent-driven-development/SKILL.md` shows `REPORT_DIR=$(mktemp -d)` immediately before its parallel-wave dispatch and roots both report paths under `<REPORT_DIR>`.
- `skills/dispatching-parallel-agents/SKILL.md` shows the same setup immediately before its fix fan-out dispatch and roots all three report paths under `<REPORT_DIR>`.
- Both examples remain self-contained and copy-pasteable: directory creation is shown and every report filename has a named absolute base.
- Apart from the five report-path values and the added directory setup, both TypeScript dispatch snippets are byte-identical to v5.2.2.
- The Output capture bullet requires absolute paths outside isolated checkouts when `worktree: true`, explains that a relative path is captured as helper work and destroyed with the throwaway checkout in that case, and separately explains the shared-working-tree risk for non-isolated batches.
- The existing absolute-path requirements in `skills/brainstorming/gatherer.md` and `skills/roasting-the-spec/SKILL.md` remain present, with no contradictory guidance added.
- No runtime logic, settings, agent persona, CI lint, or release dependency changes.
- `npm test` and the generic-skill hygiene scan pass.
