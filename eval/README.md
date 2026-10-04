# Evals

An eval is a fixed set of inputs plus human-approved must-hold facts, run against one target (a skill or persona) before and after a wording edit, and scored by independent reviewer models. It answers one question: did the edit lose anything a reader must know, and did it make the output more readable? Model-calling runs happen by hand; `scripts/ci.mjs` runs only each target's deterministic tests and the hygiene scan below. `eval/` is outside `package.json#files` (never in the npm tarball) and outside the directories `scripts/model-literal-lint.mjs` scans; model ids appear here only as command-line arguments, README examples, and recorded results, never as defaults.

## Convention

| Item | Rule |
|---|---|
| Layout | `eval/README.md` (this convention), `eval/anonymize-prompt.md`, `eval/<target>/{README.md, reviewer-prompt.md, run.mjs, run.test.mjs, sample/<slug>/{source.md, expected.md}, results/<run-id>/}` |
| `source.md` | the fixed input the target consumes |
| `expected.md` | must-hold facts (4-6 per sample, each with a stable id), never a golden output. Drafted by a fresh model dispatch that sees only `source.md` (never any candidate output), then edited and approved by the user per sample before the baseline run; the approved list is the oracle. An anonymized sample carries the line `anonymized: true` at the top |
| `reviewer-prompt.md` | one reviewer's job only: inputs (`source.md`, the `expected.md` facts, one candidate output); emits exactly one fenced JSON object `{ "facts": { "<id>": "yes" or "no" }, "quality": "<label>", "rationale": "<one line>" }` on a labeled ordinal scale of at most five levels. Never mentions other reviewers or the driver |
| `run.mjs` | two subcommands. `run --arm baseline|candidate --candidate-model <id> --reviewers <id,id> --persona <path> [--out <dir>] [--only <slug>]...` (no committed model default; `--out` defaults to a fresh dir under `$TMPDIR`) renders every sample, scores it with every reviewer, writes one record per sample; `compare <baseline-dir> <candidate-dir>` checks that both dirs cover the same samples with the same `input_sha256` and reviewer set, prints one table, and exits 0 on pass, 1 on fail, 2 on incomplete |
| Pass predicate | a target names a run-level tolerance for facts rejected by every candidate reviewer, each printed for human review; above that tolerance the run fails. A split answer passes and is reported as disputed. Candidate quality stays at or above baseline for each reviewer and reaches the target's readable threshold for at least one reviewer. Candidate length stays within the target's measured ceiling. A missing or twice-unparsed judgment, a missing arm, or a failed `pi` call makes the run incomplete, never a pass |
| Baseline | run on the current wording before the edit, from an immutable reference (`git show <pre-edit SHA>:<target file>` into `$TMPDIR`); the record is the comparison target |
| Leak check | before any model call, every file under `sample/` is matched against a denylist file named by `GAUNTLET_EVAL_DENYLIST`: one case-insensitive regular expression per line, blank lines and `#` lines ignored; an invalid expression aborts before any model call; a hit aborts and prints the file and line number (never the pattern text); an unset variable or missing file prints `leak check: skipped (no denylist)` as the first output line |
| Hygiene | `scripts/ci.mjs` scans `eval/` and fails on any absolute macOS home-directory path (the `Users` directory followed by an account name) and on the repository owner's GitHub handle unless it is part of a `github.com/<owner>/` URL or a `<owner>/pi-gauntlet#<n>` ticket reference - public issue links and ticket refs in verbatim pi-gauntlet specs are provenance, not leakage. Neither literal appears in this directory, because either would match the scan itself; `node scripts/ci.mjs` is the manual check |
| Anonymization | a sample from a private repo is rewritten by an LLM into a fictional domain (services, people, product nouns, hostnames) with the committed prompt `eval/anonymize-prompt.md`, then reviewed line by line by a human; only then is `expected.md` drafted and approved, then the baseline runs. The reviewer confirms the review in the commit message |
| Durable evidence | the first run of every target commits both arms' records under `eval/<target>/results/<run-id>/`; each record carries the candidate text itself, so the before/after is readable without re-running. Later runs stay under `$TMPDIR` unless they become the new baseline |
| Adding a target | copy the layout, write at least five samples spread across the cases the target handles, get `expected.md` approved first, run the baseline, then edit the target |

## Result record

Write one JSON file per sample and arm (`baseline` or `candidate`).

```json
{
  "sample": "<slug>", "arm": "candidate",
  "candidate_model": "<id>", "reviewers": ["<id>", "<id>"],
  "persona_sha256": "<hex>", "input_sha256": "<hex of source.md + expected.md + reviewer-prompt.md>", "repo_sha": "<git HEAD>",
  "text": "<the candidate output, verbatim>",
  "words": 268, "backtick_lines": 0, "path_tokens": 0,
  "facts": { "<fact-id>": { "<reviewer>": "yes", "<reviewer>": "no" } },
  "quality": { "<reviewer>": "<level label>" },
  "rationale": { "<reviewer>": "<one line>" },
  "aggregate": { "kept": 5, "disputed": 1, "lost": 0 }
}
```

`kept` means `yes` from every reviewer, `lost` means `no` from every reviewer, `disputed` is anything else including `unparsed`. A failed arm writes `{ "sample", "arm", ..., "error": "<reason>" }` instead.

## Drafting `expected.md`

Run the drafting model once per sample with this system prompt and `source.md` as the whole user message; the reply is the draft the user edits and approves:

```text
You read one design document and list the facts a product manager must know before approving it. Output 4 to 6 lines, nothing else, each in the form `- f<n>: <fact>` with n starting at 1. Cover, in this order where the document supports it: who is hurt today and how; what the user observes once it ships; each irreversible or blocking consequence; the completion condition; every dependency on work or decisions outside the document. Write each fact as one plain sentence a reader could mark present or absent in a summary; no file paths, identifiers, or commit references.
```

`expected.md` format:

```markdown
# Expected facts: <slug>

- f1: <fact>
- f2: <fact>
```

An anonymized sample puts `anonymized: true` as its first line, before the heading.

## Standing rule

Follow [AGENTS.md Change process](../AGENTS.md#change-process).
