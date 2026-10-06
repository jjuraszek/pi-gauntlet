# gatekeep-pr-merge-state eval

Measures whether an edit to `skills/gatekeep-pr/` changes what the gate renders at steps 5-6 (report and menu) for a fixed gather digest. Outside `package.json#files`; `scripts/ci.mjs` runs only `run.test.mjs`. Convention: `../README.md`.

## Persona

`--persona <dir>` takes a directory holding `verification-brief.md` and `reference/{findings,decision-menu,post-selection-loop,report}.md`; the driver concatenates those five files, in that order, as the system prompt. The live target is `skills/gatekeep-pr`. A baseline arm uses a copy of the pre-edit files: `git show <sha>:skills/gatekeep-pr/<file>` into a `$TMPDIR` dir with the same layout.

## One run

`node eval/gatekeep-pr-merge-state/run.mjs run --arm baseline|candidate --persona <dir> --candidate-model <id> --reviewers <id>,<id> [--thinking <level>] [--out <dir>] [--only <slug>]...`

The user prompt is `source.md` plus a fixed instruction: resolve Section B's Evidence resolution table from the digest, then render the report and the menu; a sample with an `## After` section renders a second menu from the refreshed digest. Each reviewer scores the rendering with `reviewer-prompt.md` on `unreadable | cluttered | readable | crisp`; the readable threshold is `readable`, the length cap 600 words, the unanimous-loss tolerance 0.

`node eval/gatekeep-pr-merge-state/run.mjs compare <baseline-dir> <candidate-dir>` prints one table and exits 0 pass, 1 fail, 2 incomplete.

## Samples

Six digests in a fictional domain, authored from shapes observed on a real repository: an exempt viewer with a pending approval status and green CI; a bound viewer with green CI and a blocked merge state; a live workflow check; an unknown merge state after the re-poll; a behind branch that flips after `update branch`; a same-head flip after the pre-menu refresh. `expected.md` facts were approved by the agent under the user's delegation.

## Recorded runs

| run | candidate | reviewers | result |
|---|---|---|---|
| `results/2026-10-06-fable` | `anthropic-fable/claude-fable-5-1` (thinking medium) | `anthropic/claude-opus-5-5`, `github-copilot/gpt-6-astra` | result: fail; baseline arm on skill files at `b173178` |

| sample | words b/c | backtick lines b/c | path tokens b/c | kept/disputed/lost b | kept/disputed/lost c | quality b | quality c |
|---|---|---|---|---|---|---|---|
| bound-viewer-green-ci | 211/398 | 3/10 | 3/4 | 2/0/3 | 5/0/0 | claude-opus-5-5=cluttered gpt-6-astra=cluttered | claude-opus-5-5=cluttered gpt-6-astra=cluttered |
| exempt-viewer-status-pending | 269/271 | 8/11 | 1/6 | 2/0/3 | 4/1/0 | claude-opus-5-5=cluttered gpt-6-astra=cluttered | claude-opus-5-5=readable gpt-6-astra=cluttered |
| flip-after-update-branch | 513/412 | 10/9 | 0/9 | 1/1/3 | 5/0/0 | claude-opus-5-5=cluttered gpt-6-astra=cluttered | claude-opus-5-5=cluttered gpt-6-astra=cluttered |
| live-checkrun-pending | 211/332 | 6/7 | 0/0 | 3/1/0 | 4/0/0 | claude-opus-5-5=readable gpt-6-astra=cluttered | claude-opus-5-5=cluttered gpt-6-astra=cluttered |
| same-head-flip | 478/401 | 15/6 | 2/1 | 3/0/1 | 3/1/0 | claude-opus-5-5=cluttered gpt-6-astra=cluttered | claude-opus-5-5=cluttered gpt-6-astra=cluttered |
| unknown-after-repoll | 303/340 | 11/9 | 0/1 | 3/0/1 | 4/0/0 | claude-opus-5-5=cluttered gpt-6-astra=cluttered | claude-opus-5-5=cluttered gpt-6-astra=cluttered |

The run fails the convention's readability leg on five samples in both arms and the at-or-above-baseline leg on `live-checkrun-pending` for one reviewer; both are recorded and accepted as evidence - the kept-fact delta (14/27 baseline, 25/27 candidate) is the measured outcome.
