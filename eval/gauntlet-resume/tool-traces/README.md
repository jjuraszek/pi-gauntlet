# C1 single-repo read traces

Use this kit for the two tool-enabled resume observations in GH-158 Design 9 C1. These synthetic inputs use the current handoff layout; they are not model outputs or claims that handoff ran. The local check validates both engine artifacts with the production `checkPlan` function. Text-only `eval/run.mjs` results cannot establish read-call behavior.

## Prepare

Run from the package checkout:

```bash
timeout -k 30 30 node eval/gauntlet-resume/tool-traces/prepare.mjs
```

The command creates a unique directory under the OS temp directory and prints `root`, plus `primary`, `worktree`, `brief`, `artifact`, `base` and `head` for each of `ledger` and `plan`. It also saves those values in `<root>/fixture.json`. It starts no Pi process, installs no dependency and touches no product checkout. Keep the generated directory until both captures are admitted.

Each run has its own primary and linked worktree, a committed spec and engine artifact added after base, a clean branch, an existing passing scoped test, and a complete brief outside the worktree. The ledger carries `allowance: 4`, `returned: none` and no pending dispatch. The task plan has one active task and a measured baseline. The briefs contain no `legs:` block, PR identity or loaded skill list.

## Capture in the primary session

1. Complete the resume reference split before collecting passing C1 evidence. The ledger route needs `restore-loop.md`; the task route needs `restore-plan.md`. Do not change a fixture to bypass an admission failure.
2. Start a fresh tool-enabled Pi session in the generated `primary` for each engine. Load the package checkout's skills and tracker extensions, not a globally installed copy. Use the installed Pi CLI's JSON mode (`--mode json`) and retain stdout as JSONL and stderr separately. Follow the parent's bounded-launch and process-provenance contract; the loop worker never launches Pi.
3. Read the checkout's `skills/gauntlet-resume/SKILL.md` in full, then invoke `/skill:gauntlet-resume <brief>` on that engine's generated brief. Supply approval if resume asks for it. Ask to stop after restoration and its closing line, before the owning skill executes any task or dispatch. Keep the actual admission, tracker tools and filesystem reads enabled; narrating tool outcomes does not count.
4. Capture through the final `agent_settled` event with `aborted: false`. Keep the full raw stream in scratch. Do not splice sessions, strip failed tool events, manufacture tool results, or truncate after a favorable read.
5. Copy each consumed brief and its JSONL stream into `results/<engine>-brief.md` and `results/<engine>.jsonl` beside this README. Before committing, replace machine-local prefixes consistently in both files: the generated root with `/fixture/run` and the package checkout with `/fixture/package`. Preserve suffixes, event order, tool arguments and returned text. Review all other machine-local content and apply `eval/lib/hygiene.mjs`'s scan; keep raw provenance in scratch, never commit credentials or personal home paths.
6. Write `results/<engine>.json` with the fields below. Compute SHA-256 over the saved normalized stream and brief and over the exact instruction files used by the session. Record the normalized brief path from the read call. Do not restamp hashes after editing an instruction; recapture that engine instead.

| Field | Value |
|---|---|
| `traceSha` | SHA-256 of the complete saved `<engine>.jsonl` bytes |
| `briefSha` | SHA-256 of the saved `<engine>-brief.md` bytes |
| `briefPath` | Normalized absolute path passed to the brief's `read` call |
| `instructions` | Object mapping each of the four repo-relative instruction paths below to its SHA-256 |

Both engines include `skills/gauntlet-resume/SKILL.md`, `skills/gauntlet-resume/reference/brief-contract.md` and `skills/gauntlet-resume/reference/reconstruction.md`. Ledger adds `skills/gauntlet-resume/reference/restore-loop.md`; plan adds `skills/gauntlet-resume/reference/restore-plan.md`. Retain each whole-file read in the stream. Pi's JSON event contract defines `tool_execution_start` (`toolCallId`, `toolName`, `args`), `tool_execution_end` (`result`, `isError`) and terminal `agent_settled`; assistant prose and `toolcall_end` requests alone are not execution evidence.

## Local acceptance

```bash
timeout -k 30 30 node --test scripts/resume-read-traces.test.mjs
```

The check fails when either saved capture is missing. It verifies the recorded brief was read, correlates successful read and task-projection results, checks the first tracker mutation arms brainstorm, rejects any coordinated-file read, binds instruction hashes to the current checkout and checks the 42,000/37,000-byte ceilings. A pre-restore refusal cannot pass by reading nothing. Keep this file-selected check outside CI: CI cannot produce C1 traces, and the deterministic fixture test is not acceptance by itself.

Coverage is C1 ledger and task-plan briefs only. This kit does not establish stage equivalence, coordinated admission, handoff behavior or a target-wide eval pass.
