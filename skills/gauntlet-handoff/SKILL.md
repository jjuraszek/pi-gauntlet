---
name: gauntlet-handoff
description: Human-only producer of a gauntlet handoff brief - invokes pi-cohort's `handoff` skill, then appends the gauntlet process-state section (phase/plan tracker status) to the brief it wrote, per the shared brief contract. Run at the end of a session whose flow a fresh session will continue with /skill:gauntlet-resume.
disable-model-invocation: true
argument-hint: "[--out <path> | --key <name>]"
---

> **Related skills:** Pairs with `/skill:gauntlet-resume`, the sole consumer of the brief this skill finishes. The grammar both read is `../gauntlet-resume/reference/brief-contract.md` - this file cites it and restates none of it.

# Gauntlet Handoff

## Overview

pi-cohort's `handoff` skill writes the flow-agnostic core of a brief (six headings,
ending at `## Skills loaded`). Only this package knows what `phase_tracker` and
`plan_tracker` state mean, so this skill appends that state as one more section, in
the layout fixed by `reference/brief-contract.md` (`## Producers`). Runs in the main
loop: tracker state is extension state no subagent can read.

**Announce at start:** "I'm using the gauntlet-handoff skill to write a resumable handoff brief."

## Boundaries

- Reads: `../gauntlet-resume/reference/brief-contract.md` in full (resolve against this
  skill's directory) before any other action; the transcript; git metadata by path.
- Writes: only an append to the brief cohort wrote, wherever the resolved path puts it
  (a repository-local `--out` included). Never a second file, never the trackers, never
  any other repository file.
- Every STOP below prints the offending path or fact and writes nothing further.

## Sequence

1. **Resolve the target.**
   - `--out` and `--key` both given -> STOP: they are exclusive in cohort's grammar.
   - `--out <path>` -> resolve to an absolute path against the session cwd
     (`node -p "require('path').resolve(process.argv[1])" -- "<path>"`); that is the
     form passed to cohort.
   - Otherwise the key is `--key <name>` when given, else derived from the **run
     worktree**: the path a flow skill reported as `Worktree ready at <path>` in this
     transcript (the same evidence cohort's snapshot uses):

     ```bash
     git -C "<run worktree>" branch --show-current
     ```

     No run worktree in the transcript -> the session cwd branch:

     ```bash
     BRANCH=$(git branch --show-current)
     DEFAULT=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##')
     ```

     `BRANCH` empty (detached HEAD) or equal to `DEFAULT` -> STOP asking for `--key` or
     `--out` (a default-branch key would collide across flows).
   - A derived key has every `/` replaced by `-` (`hotfix/x` -> `hotfix-x`) so the file
     lands flat in the default directory. A human-given `--key` is passed verbatim.
   - With `--key`, cohort writes `<tmpdir>/pi-handoff/<key>.md`, `<tmpdir>` from
     `node -p "require('os').tmpdir()"`; the authoritative path is the one cohort
     reports in step 2.
2. **Run cohort's handoff procedure.** A skill cannot expand `/skill:handoff` (pi expands
   skill commands on typed input only). Find `handoff` in the session skill list, `Read`
   its `SKILL.md` at the location listed there, and follow its procedure with the output
   option resolved in step 1 - the brief's core (six headings, ending at `## Skills loaded`)
   is cohort's to write, by cohort's rules. Absent from the skill list -> STOP: "cohort
   `handoff` skill not in the session skill list - install or upgrade to pi-cohort >= 7.1.0".
   No fallback to the `/handoff` prompt.
3. **Take the path from the report.** Cohort's procedure ends with `Handoff written: <abs
   path>` or `Handoff not written: <reason>`. `Handoff not written` -> STOP with that reason.
   Otherwise that path is the brief; line 1 not starting `# Handoff:` -> STOP with the path.
4. **Refuse a double section.** The file already has a line matching
   `^## Process state\s*$` -> STOP: "the installed pi-cohort still writes process state
   itself - upgrade to pi-cohort >= 7.1.0".
5. **Hotfix exclusion.** `skills/chase-bug/hotfix.md` is in this session's context ->
   append nothing; report a plain hotfix handoff and go to step 7. Checked before the
   trackers: chase-bug never touches tracker state, and a stale armed flow appended here
   would steer resume away from its hotfix route.
6. **Append.** `phase_tracker({ action: "status" })`, then `plan_tracker({ action: "status" })`.
   - No phase `in_progress` -> append nothing; say the brief is a plain handoff.
   - A phase `in_progress` (verify or ship included - resume stops at verify on its own)
     -> append the process-state section exactly as `## Producers` in
     `reference/brief-contract.md` lays it out: both status outputs verbatim
     (`No plan active.` verbatim when there is no plan), the active-task line naming
     the first `→` task else `none`, the gate-history line. Append with a single
     `cat >> "<brief path>" <<'EOF' ... EOF` whose body is that block.
   - Re-read the file tail and confirm it ends with the gate-history line from the
     contract and nothing after.
7. **Report.** Print the path and `/skill:gauntlet-resume <path>`. When a section was
   appended and the brief's `worktree:` field is `no`, resume's entry check 2 needs an
   override: print `/skill:gauntlet-resume <path> <override>` where `<override>` is the
   run worktree from step 1 when one was found, else the session checkout root,
   `dirname "$(git rev-parse --path-format=absolute --git-common-dir)"`. If that command
   fails (session cwd is not inside a git repository), print the one-argument form and
   the line `No resumable worktree found - pass the worktree path as the second argument.`

## Red flags - STOP

- Writing the brief's core yourself instead of following cohort's `handoff` procedure (the
  six core headings are cohort's; this skill appends one section).
- Recomputing the brief path instead of taking it from `Handoff written:`.
- Restating the section layout here instead of reading `reference/brief-contract.md`.
- Appending when step 4 or step 5 fired.
- Deriving the key from the primary checkout's branch while a run worktree exists.

## Project overrides

If a gauntlet overrides file exists - checked in order:
`.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`,
`<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read
and apply `## conventions` whenever present, without a relevance
judgment.
Give this skill's named section precedence over conflicting
`## conventions` rules. Use other relevant sections - by name match,
by topic (routing,
verification, worktrees, etc.), or by workflow convention - to override or
extend the instructions above. Project-local `AGENTS.md` is already in
context - check it for project-specific routing tables, service paths, and
verification commands.
