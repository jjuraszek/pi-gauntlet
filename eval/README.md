# Evals

An eval checks change safety on fixed inputs and must-hold facts, not a quality score. Two frozen replay models produce Before and After outputs; one frozen judge reports whether each fact holds in each output. The three model ids and the `medium` thinking level live in `eval/lib/models.mjs`. They are frozen on purpose so only the wording varies.

## Run

```bash
node eval/run.mjs <target> [<sample>] [--baseline-only] [--base <ref>]
```

The default run compares baseline skill text from `git merge-base HEAD origin/main` with the working tree, reuses fresh cells, and judges each pair against `intent.md`. `--base <ref>` selects another baseline commit. `<sample>` selects one sample and writes a report labeled partial, not a target-wide pass. `--baseline-only` seeds or refreshes baseline records without checking intent or judging; fresh baselines require no model call. Commit the records and intent with the change. Models are constants, not CLI options.

A skill file with no version at the baseline refuses the run; use `--base <ref>` to pick a base that has it. Unreadable skill files or unresolved slice headings also refuse with the file and ref.

| Exit | Meaning |
|---|---|
| `0` | Pass: improved or unchanged; baseline-only succeeded |
| `1` | Regressed, inconclusive, or error |
| `2` | Refused: invalid CLI, target/sample, structure, hygiene, intent, or baseline ref |

## Layout

```
eval/
  README.md                  the process: what a run does, how to add a target or sample, record schema, hygiene rule
  run.mjs                    the only driver; CLI: node eval/run.mjs <target> [<sample>] [--baseline-only]
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

The CLI also accepts `--base <ref>`. A baseline-only or refused run does not write `report.md`; a comparison overwrites it with only the cells run in that invocation.

## Files per target

Copy `eval/_template/` to `eval/<target>/`; fill order: [`eval/_template/README.md`](_template/README.md). Its table owns the file-by-file instructions. Sample names state the property under test. `text` targets assemble skill files as a system prompt and replay with no tools; `edit` targets materialize whole skill files, run with read/edit/write tools in a scratch fixture checkout, and capture the staged diff plus resulting tree. File order determines the assembly. Heading slices, frontmatter stripping, `replay.md`, and leading `bundle+` lines apply to `kind: text` only. An edit kind's user turn is `/skill:<name> <request>` with the request from `case.md` plus the fixture file list; lint rejects `bundle+` lines for edits. Edit skill files must all sit under the first skill file's directory.

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

`for:` is the first non-blank line and binds to the SHA-256 of the candidate's bundle-free assembly: only `target.json`'s `skillFiles`, not any sample's `bundle+` files or a commit SHA. The mismatch refusal prints the current assembly SHA. Sample and fact ids use letters, digits, underscores, or hyphens and must name existing facts. The move list may be empty. Missing files/headings, the template stub, malformed or unknown bullets, and a stale `for:` refuse the run before model calls. `--baseline-only` bypasses intent parsing but still requires the file structurally. Git holds intent history.

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

`results/<sample>/{baseline,candidate}.json` holds one record per arm, newest only. The record shape is:

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
      "factsSha": "<sha256 of expected.md>", "judgePromptSha": "<sha256 of eval/judge.md>", "intentSha": "<sha256 of intent.md>",
      "baselineOutputSha": "<sha256>", "candidateOutputSha": "<sha256>",
      "facts": { "<id>": { "before": "holds", "after": "fails", "label": "regression" } },
      "verdict": "regressed", "feedback": "...", "confirmation": { "text": "...", "facts": {} }
    }
  }
}
```

The alternatives above describe a shape, not literal JSON. Shipped records also carry top-level `thinking`; edit records without an assembly setting use `"assembly": "n/a"`. `tree` exists only for edits. Confirmation includes the replay fields and, on successful judgment, facts and feedback; error judgments may contain only verdict and error. Baseline records have no paired `judge` block.

Replay reuse requires matching `skillSha` (including sample bundles), `inputSha` (replay instruction, stripped case, bundle paths, sorted fixture paths and contents), `kind`, `assembly`, replay model membership, and `models.thinking`, with `status: ok`. Only stale or failed cells replay. A stored candidate whose skill SHA matches the base assembly is promoted first, in either mode, with its judge block removed; normal freshness checks still apply.

Judgment currency requires matching `factsSha`, `judgePromptSha`, `intentSha`, `baselineOutputSha`, and `candidateOutputSha`. Changing facts, judge prompt, or intent rejudges reusable outputs without replaying. Records are written only when changed; `repoSha` updates on that write, not on a no-op run. Scratch paths in outputs are stored as `<scratch>`. The comparison report contains the change, bundle-free `for:` SHA, per-cell outcomes and labels, feedback/errors, and final exit code.

## Hygiene and anonymization

Anonymize private material or rewrite it as simpler synthetic text before it lands; never include a secret. The shared definition in `eval/lib/hygiene.mjs` checks three predicates: absolute macOS home-directory paths, the repository owner's handle outside `github.com/<owner>/` URLs or `<owner>/<repo>#N` refs, and token-shaped secrets (private-key headers, GitHub tokens, API keys, AWS access keys, and Slack bot tokens). Bare token prefixes do not suffice. A target's optional `denylist` in `target.json` adds case-insensitive regex checks.

`scanTree` scans every file under `eval/` except `lib/`; it skips the target denylist on `target.json` itself, but still checks the three shared predicates there. The driver refuses on target-file, judge-prompt, or assembled-skill hits before model calls. Output hits fail the cell and store redacted text. `scripts/ci.mjs` runs the same tree scan with every configured target denylist. Use `eval/anonymize-prompt.md` when rewriting source material; anonymization metadata does not exempt a file from scanning.

## CI

The full suite in `scripts/ci.mjs` runs `eval/lib/*.test.mjs`, structural lint over immediate target directories including `_template`, and the shared hygiene scan. Nested `brainstorming/replay/` is outside structural lint, not outside the tree hygiene scan. CI never calls a model. `eval/` is checkout-only, excluded from the npm tarball and from model-literal lint scope.

## Policy

Follow [AGENTS.md, Change process](../AGENTS.md#change-process).
