# Live-tool brainstorming replay

This harness replays brainstorming checklist steps 3-5 through the Pi SDK against real checkouts of a consumer repo. It extracts historical cases, runs a live-tool scout under two skill variants, resumes the driver at step 4, and uses a user simulator restricted to recorded answers. Three judges compare the before/after transcripts by majority vote. P1 and P2 are positive cases; N1 is the negative control.

The [parent eval](../README.md) uses frozen fixtures and no tools. This replay measures discovery as well as message shape: scouts and drivers read the consumer checkout, and drivers have editing tools. Checkouts and agent homes are isolated in scratch directories; tracker CLIs are unavailable. Model calls are manual, not part of CI. [results.md](results.md) retains the three experiment verdict tables without model identities or rationales.

## Run

Provide a private `cases.json` beside `run-all.mjs`, using [cases.example.json](cases.example.json) as the contract, then run from this directory:

```bash
node run-all.mjs
node run-all.mjs --smoke
node run-all.mjs --only P1,P2 --reps 2
```

`--smoke` selects the first case, candidate, and judge, with one repetition. `--only` selects comma-separated case labels; `--reps` overrides the configured repetition count. A full run uses all configured judges. Each run deletes the existing `runs/` and `report.md`, extracts cases, prepares variants, runs scouts and drivers, judges cells, and writes `report.md`. It also writes `variants.json` with skill hashes and scratch paths. Treat these generated files as private local artifacts, not commit inputs.

The runner reports `pass`, `fail`, or `not demonstrated` in the report and console; the outcome is not an exit-code gate. The original pass clause requires exactly one candidate with a compliant baseline, all cells resolved without regression, and progression on that candidate. The final recorded run is not demonstrated under that clause.

## Configuration and case extraction

The top-level contract contains:

- `piPackage`: absolute path to the installed SDK package, including `dist/index.js` and its TypeBox dependency.
- `agentDir`: agent directory containing `auth.json` and `models.json` for the model runtime.
- `sessionsDir`: root of the historical Pi session store.
- `scoutPersona`: absolute path to the scout persona Markdown file.
- `gauntletWorktree`: checkout with the after-skill, bundled spec-index bin, and installed `node_modules/yaml`.
- `gauntletBaseCommit`: immutable before-skill commit in that checkout.
- `consumerRepo`: local consumer Git repo with each case's base commit and shipped spec available at `HEAD`.
- `models`: `candidates` array, `scout`, `judges` array, and `userSim`; values use `provider/model` with an optional `:thinking` suffix. Configure two candidates and three judges for the full comparison.
- `reps` and `turnCap`: repetitions per variant and maximum driver turns.
- `cases`: objects with `label` (`P1`, `P2`, or `N1`), `ask` (initial prompt verbatim), `session` (path relative to `sessionsDir`), `spec` (path relative to the consumer repo), and `base` (consumer commit before the change).

To extract cases without running the full replay:

```bash
node extract.mjs
```

`extract.mjs` reads each Pi JSONL transcript, finds the first assistant `write` beginning with `# CONTEXT DRAFT`, and collects question/answer pairs until the next write to that draft path. It reads the shipped spec with `git show HEAD:<spec>` and checks the base commit exists. It writes `cases/<label>/ask.md`, `recorded-draft.md`, `shipped-spec.md`, and `case.json`. The generated case record adds `baselineModel`, `draftPath`, `worktreeRoot`, `external`, and `qa` (question/answer objects). These extracted records supply the live replay, not the public example configuration.

## What is not committed, and why

- `cases.json` and `cases/` contain verbatim consumer asks, drafts, recorded answers, and shipped specs proprietary to the consumer repo. Configuration also identifies private session locations, repository paths, and commits.
- `runs*/` transcripts and judgments quote consumer code, paths, and ticket ids. Generated `report.md`, `variants.json`, and logs also carry private identifiers or paths.
- The full experiment notes' rationales quote the same consumer evidence. Only anonymized verdict tables and fact labels are retained in `results.md`.

The anonymized frozen-fixture samples in [../samples/](../samples/) are the public counterpart derived from the same three cases. Re-running the live replay requires access to the consumer repo and its Pi session store, plus configured SDK credentials. Keep private inputs and generated artifacts out of commits.
