# C2 coordinated reads and C4 stop equivalence

Use this kit for GH-158 Design 9 C2 and C4. The loop worker prepares the scratch inputs and checks saved evidence; the primary session owns every Pi launch. A passing scratch-fixture check is setup evidence, not a read observation or a paired replay.

## C2 fixture

```bash
timeout -k 30 30 node eval/gauntlet-resume/tool-traces/prepare-coordinated.mjs
```

The helper extends the existing C1 plan fixture with two ordered members, `acme/repo-a` and `acme/repo-b`. It creates the declared sibling primary beside the home primary, linked checkouts on `fixture-resume`, matching origin identities, portable leg blocks, a companion `**Home:**` tuple and per-leg plan baselines. The two trees are clean. The home primary and worktree carry identical sibling declarations. No receipt, PR, remote request or missing-tree exception is needed.

Use the printed `brief`, `home.primary` and `home.worktree`, also saved in `<root>/coordinated-fixture.json`. The inherited C1 directories are setup artifacts; capture only the new coordinated brief. The local test validates the plan with production `checkPlan` and checks live Git identities. Keep scratch directories for the primary session; generate a fresh fixture after any restore mutates its tracker or files.

## C2 capture

Apply [README.md's primary-session capture procedure](README.md#capture-in-the-primary-session), using `home.primary` as cwd and the new `brief` as the resume argument. Load the checkout's current skills and tracker extensions. Supply the fixture's approved-spec confirmation when asked. Stop after restoration and the closing line, before implementation executes or dispatches work. Keep reads and real tracker calls enabled.

Save the normalized artifacts under `results/` beside this file:

| File | Contents |
|---|---|
| `coordinated-brief.md` | Complete consumed brief, with the scratch root normalized to `/fixture/run` |
| `coordinated.jsonl` | Complete JSON-mode session through `agent_settled` with `aborted: false`; normalize scratch and package prefixes consistently |
| `coordinated.json` | The same `traceSha`, `briefSha`, `briefPath` and `instructions` fields as C1 |

Bind `instructions` to these five whole-file reads:

- `skills/gauntlet-resume/SKILL.md`
- `skills/gauntlet-resume/reference/brief-contract.md`
- `skills/gauntlet-resume/reference/reconstruction.md`
- `skills/gauntlet-resume/reference/restore-plan.md`
- `skills/gauntlet-resume/reference/coordinated.md`

The local check requires the successful coordinated read result before the first phase/task tracker mutation, not merely an earlier read request. It also requires the recorded brief read, legal first arming call and successful task initialization, so a pre-admission refusal cannot count. Preserve the raw stream and launch provenance in scratch. Apply the eval hygiene scan before committing normalized artifacts. Never restamp an instruction hash after editing that instruction; recapture instead.

## C4 selected pairs

Use these five existing samples without changing their cases or facts:

| Sample | Observed boundary |
|---|---|
| `legs-membership` | Reordered, missing and extra members |
| `legs-wrong-primary` | Entry from a companion primary |
| `legs-home-mismatch` | Wrong full home tuple or live branch |
| `legs-missing` | Empty lookup, found tree, found-tree tuple mismatch and authoritative explicit path |
| `legs-wrong-repo` | Companion common-directory mismatch |

For each named sample, the primary session first runs `node eval/run.mjs gauntlet-resume <sample> --base 09c9f4e1 --baseline-only`, then `node eval/run.mjs gauntlet-resume <sample> --base 09c9f4e1`. Use the parent's bounded job launcher and process records. Serialize shared report writes; retain unrelated results. Do not launch a target-wide run or run `legs-seed-file` under C4. The local check binds both arms to the same current case and the required baseline/current instruction assemblies, then requires every fact to hold on both frozen replay models with current judgments.

Keep these text replays separate from C2: they compare stops on supplied observations but cannot show a read call. This kit does not cover `legs-ok` or `legs-receipt`, which the spec selects separately, or claim a target-wide pass.

## Local acceptance

```bash
timeout -k 30 30 node --test scripts/resume-coordinated-evidence.test.mjs
```

Run after collecting C2 and C4. Missing traces and stale paired records fail rather than substituting structural assertions. Keep this file-selected acceptance check outside CI beside the existing C1/C3 checks; the repo has no slow-tier convention for these externally supplied observations. No Pi process runs from this check.
