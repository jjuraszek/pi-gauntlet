# Evals

An eval checks change safety on fixed inputs and must-hold facts, not a quality score. Two frozen replay models produce Before and After outputs; one frozen judge reports whether each fact holds in each output. The three model ids and the `medium` thinking level live in `eval/lib/models.mjs`. They are frozen on purpose so only the wording varies.

## Run

```bash
node eval/run.mjs <target> [<sample>] [--baseline-only] [--refresh-judgments] [--base <ref>]
```

The default run compares baseline skill text from `git merge-base HEAD origin/main` with the working tree, reuses fresh cells, and judges each pair against `intent.md`. `--base <ref>` selects another baseline commit. `<sample>` selects one sample and writes a report labeled partial, not a target-wide pass. `--baseline-only` seeds or refreshes baseline records without checking intent or judging; fresh baselines require no model call. Commit the records and intent with the change. Models are constants, not CLI options.

`EVAL_CONCURRENCY=<n>` (default `4`) bounds how many `pi` children run at once; any value other than a positive integer refuses with `EVAL_CONCURRENCY must be a positive integer, got <v>`. Lower it when the provider rate-limits (a limited cell lands as `status: error`; rerun and reuse picks up the finished cells). The completion line reports what the invocation actually called: `<target>: <worst> (report.md written; replay <n>, judge <n>, confirm <n>, wall <s>s)`; `--baseline-only` prints `baseline seeded (replay <n>, wall <s>s)` or `baseline fresh`. An invocation that calls nothing leaves `report.md` untouched and prints `<target>: <worst> (report.md unchanged; replay <n>, judge <n>, confirm <n>, wall <s>s)`. For ordinary runs, Ctrl-C keeps the records of samples that finished, writes nothing for samples in flight, and writes no report. Judgment is noninteractive: the runner uses an LLM judge, not a human runtime approval gate.

### Recover a disputed saved judgment

Use a judgment-only refresh when a saved judgment is disputed and the saved replies still match the inputs:

```bash
node eval/run.mjs <target> <sample> --refresh-judgments
```

Select exactly one sample; omitting it or combining refresh with `--baseline-only` refuses the run. `--base <ref>` still selects the baseline commit. Before any model call or write, the runner checks ordinary structure, hygiene, baseline and intent requirements, then requires reusable successful baseline and candidate replies for every configured replay model. Reuse matches skill and input hashes, kind, assembly, replay-model membership and thinking level. Refresh never promotes a candidate into the baseline. A missing, failed or stale reply refuses refresh rather than generating a replacement. Use an ordinary run to obtain current replies first.

Refresh bypasses judgment currency, recomputes mechanical checks on copies of the saved replies, and calls the LLM judge for every configured replay-model pair. It does not replay either primary arm. A regressed result still gets the normal bounded candidate confirmation replay and judgment; this observation never replaces the saved primary candidate reply. Refresh is not retry-until-pass, automatic acceptance, or evidence that the skill improved.

Read `report.md` together with `results/<sample>/candidate.json`. The completion line names `refresh <sample> [<models>]` and reports actual replay, judge and confirmation call counts. The report is partial, names the sample and models, marks refresh status, and links the candidate audit. `candidate.json` keeps one bounded `refresh` block: input/output and judge identity, the immediately previous judgments (or `null` when absent), refreshed judgments, provenance and any confirmation. Each refresh replaces that block, not an accumulating history; Git retains older versions. An ordinary run preserves the latest block. Primary replies and `baseline.json` remain unchanged. Output text hashes identify the text judged; payload hashes cover the full saved reply, including edit trees and metadata, so the audit can distinguish unchanged text from an unchanged payload.

A completed refresh exits `0` for improved or unchanged, or `1` for regressed, inconclusive or error; `complete` means the attempt finished, not that it passed. Refusal exits `2` without changing records or report. Ctrl-C before admission exits `130` without changing them. After admission, the runner first saves incomplete error judgments, then atomically saves completed cells: Ctrl-C exits `130`, retains completed work, marks remaining work interrupted/error and writes an interrupted partial report. Never read retained old judgments as a successful refresh. A candidate-record save failure exits `1` and leaves `report.md` unchanged; inspect the candidate record for the last successfully saved checkpoint rather than treating the old report as current. An ordinary rerun retries errored judgments while reusing successful current judgments and reusable replies; refresh deliberately re-judges every configured pair, including successful ones.

When interpreting a dispute, distinguish a wrong or ambiguous fact/judge interpretation from intended variance. Correct an unclear fact or judge instruction, then judge again; refresh never widens intent. If a behavior change is genuinely accepted, record its exact fact and direction in `intent.md` as described below and rerun. A different refreshed verdict, a clean rerun, or repeated attempts alone do not justify accepting a deviation.

## Iterating on a skill edit

A full target run replays every stale cell on both replay models and judges each pair, four calls at a time by default. A cell is stale only when the text that sample sends changed: each `case.md` may open with `bundle-: <path>` lines that drop `target.json` `skillFiles` entries from that sample's assembly, so an edit to a dropped reference file replays nothing for that sample. A `SKILL.md` edit still replays every sample that keeps it. Keep the loop cheap:

1. Edit, then run only the samples the edit targets plus the ones the last report flagged: `node eval/run.mjs <target> <sample>` per sample (partial report).
2. Batch every wording fix the partial reports ask for into one edit before the next run.
3. Run the full target once, when every targeted cell holds, to produce the committed `report.md`; the completion line's counts show how many cells the edit actually cost. A judge note on a sample the edit did not touch is a finding to record in the commit body, not a reason to edit the skill again.
4. Change only what the spec names. A clause added on the agent's own judgment (a reordering, an extra guard) is the usual cause of a regression on an untouched sample.

A dropped file is also removed from that sample's replay prompt, so the sample sends fewer system-prompt tokens per cell; for example, a `gatekeep-pr` sample that drops three of nine reference files sends roughly a third less skill text.

After adding or changing `bundle-` lines, run `node eval/run.mjs <target> --baseline-only` once to re-seed the baseline arm for the new subsets before the candidate run, because the subset changes `skillSha` on both arms.

Committed `gatekeep-pr` records average 48 s per replay cell (max 173 s); a serial full run measured 20-29 minutes in past sessions; with the default pool of four, wall time is roughly a quarter of the serial sum, and the committed `report.md`'s `wall:` line is the current measurement for each target; a per-sample partial run takes 2-5 minutes depending on the number of stale cells.

Declaring drops: a sample keeps a reference file when any of its facts belongs to a workflow step whose skill table reads that file, or when the author is unsure; the skill's `SKILL.md` is never dropped. Lint refuses a `bundle-` path outside `skillFiles`, a subset that drops every file, `bundle-` on `kind: edit`, and a path listed under both `bundle+` and `bundle-`.

A skill file with no version at the baseline refuses the run; use `--base <ref>` to pick a base that has it. Unreadable skill files or unresolved slice headings also refuse with the file and ref.

| Exit | Meaning |
|---|---|
| `0` | Pass: improved or unchanged; baseline-only succeeded |
| `1` | Regressed, inconclusive, or error |
| `2` | Refused: invalid CLI, target/sample, structure, hygiene, intent, baseline ref, or unusable saved replies for refresh |
| `130` | Interrupted; refresh preserves checkpointed results and writes an interrupted partial report after admission |

## Layout

```
eval/
  README.md                  the process: what a run does, how to add a target or sample, record schema, hygiene rule
  run.mjs                    the only driver; CLI and recovery flags: see Run above
  judge.md                   the only judge prompt
  anonymize-prompt.md        anonymization prompt for rewriting private material
  lib/
    models.mjs               the three frozen model ids and the thinking level
    replay.mjs               runs one arm for one sample (text or edit kind)
    judge.mjs                builds the judge call, parses its JSON block
    records.mjs              read/write records, freshness decision
    checks.mjs               mechanical checks: hashes, word cap, mechanical facts
    hygiene.mjs              the one hygiene definition (patterns, exemptions, scope)
    intent.mjs               intent.md parsing, stub detection, for: check
    report.mjs               renders report.md from records
    lint.mjs                 structural lint: every target matches the template shape
    *.test.mjs               node:test, no model calls
  _template/
    README.md                how to add a target or a sample; restates the anonymization rule
    target.json              kind, skill files, word cap
    replay.md                text kind only: instruction prepended to case.md as the user turn
    intent.md                stub with the two required headings
    samples/<sample-name>/
      case.md                the replay input for this sample
      expected.md            must-hold facts, one per line, each tagged mechanical: or judged:
      fixture/               kind: edit only; files the worker edits
  <target>/                  same shape as _template, plus:
    results/<sample>/baseline.json
    results/<sample>/candidate.json
    report.md                newest judge report, overwritten each run
  brainstorming/replay/      legacy live-replay harness, outside the template and the lint
```

The CLI also accepts `--base <ref>`. A baseline-only or refused run does not write `report.md`; a comparison that made at least one model call overwrites it with the cells of that invocation; a run that reused everything leaves it untouched.

## Files per target

Copy `eval/_template/` to `eval/<target>/`; fill order: [`eval/_template/README.md`](_template/README.md). Its table owns the file-by-file instructions. Sample names state the property under test. `text` targets assemble skill files as a system prompt and replay with no tools; `edit` targets materialize whole skill files, run with read/edit/write tools in a scratch fixture checkout, and capture the staged diff plus resulting tree. File order determines the assembly. Heading slices, frontmatter stripping, `replay.md`, and leading `bundle+` lines apply to `kind: text` only, as do leading `bundle-` lines, which drop `skillFiles` entries for one sample. An edit kind's user turn is `/skill:<name> <request>` with the request from `case.md` plus the fixture file list; lint rejects `bundle+` lines for edits. Edit skill files must all sit under the first skill file's directory.

`expected.md` has one stable, unique fact id per line: `- <id>: judged: <sentence>` or `- <id>: mechanical: <check>`. An optional first line is `anonymized: true`; other non-blank lines are errors. Mechanical checks are substring tests `contains "<literal>"` and `lacks "<literal>"`, or JavaScript regex tests `matches /<regex>/<flags>`. They run in code, not in the judge. Empty text or an empty edit diff fails the cell. For text only, `wordCap` limits whitespace-delimited tokens containing a letter or digit.

## Intent

Commit one `intent.md` per target with the wording change:

```markdown
for: <skillSha of the candidate assembly this intent describes>

## Change
<one paragraph: what the edit means to alter in the agent's behavior>

## Expected to move
- <sample>/<fact id>: <holds|fails> -> <holds|fails> - <why>
```

`for:` is the first non-blank line and binds to the SHA-256 of the candidate's bundle-free assembly: only `target.json`'s `skillFiles`, not any sample's `bundle+` files or a commit SHA. The mismatch refusal prints the current assembly SHA. Sample and fact ids use letters, digits, underscores, or hyphens and must name existing facts. The move list may be empty. Missing files/headings, the template stub, malformed or unknown bullets, and a stale `for:` refuse the run before model calls. `--baseline-only` bypasses intent parsing but still requires the file structurally. Git holds intent history. Judgment currency hashes the intent without its `for:` line, so a `for:` bump alone re-judges nothing.

For accepted variance, use the existing `## Expected to move` list, for example:

```markdown
- sample/fact: holds -> fails - The approved edit replaces the old response format.
```

Name only the accepted fact and direction and explain why the change is intended. A matching observed move becomes `intended change`; other deviations remain regressions or unexplained changes. The rationale is free-form text, not proof of harmless variance. A changed assembly changes the replay input, so it needs current replies rather than a judgment-only refresh of old ones. Contradictions between the fact, intent and observed behavior require review, which may be agent-driven; there is no human runtime adoption stage. Refresh neither inserts these entries nor records acceptance. Do not add one merely to silence a disputed judgment or because a rerun passed.

## Judge

The question in `eval/judge.md` is: does this output satisfy the fact as written, before and after? The judge sees the case, judged facts, change paragraph, parsed move list, and both outputs; for edits it also sees the fixture before and each resulting tree. It reports `holds` or `fails` for each judged fact plus feedback in exactly one fenced JSON block. Intent does not override observed outcomes. The driver derives labels, including for mechanical facts:

| before -> after | in `Expected to move` with that direction | label |
|---|---|---|
| same | - | `held` (both hold) or `pre-existing` (both fail) |
| moved | yes | `intended change` |
| holds -> fails | no, or listed with the opposite direction | `regression` |
| fails -> holds | no | `unexplained change` |

A listed fact that stays the same is `intended but unchanged`, overriding the table's same-outcome row. A fails-to-holds move listed with the opposite direction is also `unexplained change`. Any regression or unexplained change makes the cell `regressed`; otherwise an intended change makes it `improved`, and the rest are `unchanged`. Failed arms or a judge failure after one retry make it `error`. Calls have a 10-minute timeout.

A regressed cell gets one candidate replay and a new judgment; the label stands when it reproduces, otherwise the cell is `inconclusive`. At least one original `regression` or `unexplained change` label must reproduce on the same fact id with the same label; a failed confirmation becomes `error`. Both observations stay in the record, with the second under `judge[model].confirmation`, not in a widened intent. The worse verdict wins across cells: `error > inconclusive > regressed > unchanged > improved`.

## Records

`results/<sample>/{baseline,candidate}.json` holds one record per arm, newest only, with one bounded previous/refreshed judgment audit in the candidate's `refresh` block after judgment recovery (see Run). Primary replies are not a run history. The record shape is:

```json
{
  "sample": "council-dispatch-after-lint",
  "arm": "candidate",
  "kind": "text",
  "assembly": "concat",
  "skillSha": "<sha256 of the assembled skill text>",
  "inputSha": "<sha256 of replay.md + case.md + bundle+ paths + sorted fixture tree>",
  "repoSha": "<git HEAD>",
  "models": { "replay": ["anthropic/claude-opus-5-5", "github-copilot/gpt-6.1-sol"], "judge": "anthropic-fable/claude-fable-5-1", "thinking": "medium" },
  "outputs": {
    "<replay model>": { "status": "ok" | "error", "error": "<reason or absent>", "text": "...", "tree": { "<path>": { "lines": 0, "content": "..." } }, "words": 0, "wallMs": 0, "mechanical": { "<fact id>": "holds" | "fails" } }
  },
  "judge": {
    "<replay model>": {
      "factsSha": "<sha256 of expected.md>", "judgePromptSha": "<sha256 of eval/judge.md>", "intentSha": "<sha256 of intent.md without its for: line>",
      "baselineOutputSha": "<sha256>", "candidateOutputSha": "<sha256>",
      "facts": { "<id>": { "before": "holds", "after": "fails", "label": "regression" } },
      "verdict": "regressed", "feedback": "...", "wallMs": 0, "confirmation": { "text": "...", "facts": {}, "judgeWallMs": 0 }
    }
  }
}
```

The alternatives above describe a shape, not literal JSON. Shipped records also carry top-level `thinking`; edit records without an assembly setting use `"assembly": "n/a"`. `tree` exists only for edits. Confirmation includes the replay fields and, on successful judgment, facts and feedback; error judgments may contain only verdict and error. Baseline records have no paired `judge` block.

Replay reuse requires matching `skillSha` (the sample's own assembly after `bundle+` and `bundle-`), `inputSha` (replay instruction, stripped case, bundle paths, sorted fixture paths and contents), `kind`, `assembly`, replay model membership, and `models.thinking`, with `status: ok`. Only stale or failed cells replay. In ordinary comparison or baseline-only mode (not judgment refresh), a stored candidate whose `skillSha` matches the base assembly is promoted first, with its judge block removed only when the existing baseline is missing or stale for at least one replay model; a baseline that is fresh for every replay model is kept, and normal freshness checks follow.

Judgment currency requires matching `factsSha`, `judgePromptSha`, `intentSha`, `baselineOutputSha`, and `candidateOutputSha`. `wallMs` on a judge entry sums its attempts; `confirmation.judgeWallMs` times the confirmation judgment; both are optional and never affect currency. The report carries a `wall:` line and a `judge ms` column. Changing facts, judge prompt, or intent rejudges reusable outputs without replaying. Ordinary runs write records only when changed; `repoSha` updates on that write, not on a no-op run. Explicit refresh writes audit checkpoints even when primary replies are unchanged. Scratch paths in outputs are stored as `<scratch>`. The comparison report contains the change, bundle-free `for:` SHA, per-cell outcomes and labels, feedback/errors, and final exit code.

## Hygiene and anonymization

Anonymize private material or rewrite it as simpler synthetic text before it lands; never include a secret. The shared definition in `eval/lib/hygiene.mjs` checks three predicates: absolute macOS home-directory paths, the repository owner's handle outside `github.com/<owner>/` URLs or `<owner>/<repo>#N` refs, and token-shaped secrets (private-key headers, GitHub tokens, API keys, AWS access keys, and Slack bot tokens). Bare token prefixes do not suffice. A target's optional `denylist` in `target.json` adds case-insensitive regex checks.

`scanTree` scans every file under `eval/` except `lib/`; it skips the target denylist on `target.json` itself, but still checks the three shared predicates there. The driver refuses on target-file, judge-prompt, or assembled-skill hits before model calls. Output hits fail the cell and store redacted text. `scripts/ci.mjs` runs the same tree scan with every configured target denylist. Use `eval/anonymize-prompt.md` when rewriting source material; anonymization metadata does not exempt a file from scanning.

## CI

The full suite in `scripts/ci.mjs` runs `eval/lib/*.test.mjs`, structural lint over immediate target directories including `_template`, and the shared hygiene scan. Nested `brainstorming/replay/` is outside structural lint, not outside the tree hygiene scan. CI never calls a model. `eval/` is checkout-only, excluded from the npm tarball and from model-literal lint scope.

## Policy

Follow [AGENTS.md, Change process](../AGENTS.md#change-process).
