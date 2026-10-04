# spec-summarizer eval

Target: `agents/spec-summarizer.md`, the persona that writes the brainstorming gate summary. Convention and shared rules: `../README.md`.

## One run

The candidate call is `pi -p --model <candidate> --no-tools --no-skills --no-extensions --no-context-files --no-session --system-prompt "<persona body without frontmatter>"` from a scratch cwd, with the user message being the gate's dispatch sentence with `<path>` replaced by `the path below` (`Summarize the spec at the path below for the user review gate. Read ONLY that file.`) followed by `source.md` in a fenced block - the persona's `read` tool is unavailable under `--no-tools`, so the spec is inlined. Reviewer calls use the same flags with `reviewer-prompt.md` as the system prompt. Running outside a brainstorming flow and with `--no-extensions` keeps telemetry's `spec_rounds` counter untouched.

```bash
# baseline: the pre-edit persona, from an immutable reference
git show 2166283:agents/spec-summarizer.md > "$TMPDIR/persona-baseline.md"
node eval/spec-summarizer/run.mjs run --arm baseline --persona "$TMPDIR/persona-baseline.md" \
  --candidate-model <candidate-id> --reviewers <reviewer-a>,<reviewer-b> --out "$TMPDIR/eval-baseline"
# candidate: the worktree persona
node eval/spec-summarizer/run.mjs run --arm candidate --persona agents/spec-summarizer.md \
  --candidate-model <candidate-id> --reviewers <reviewer-a>,<reviewer-b> --out "$TMPDIR/eval-candidate"
node eval/spec-summarizer/run.mjs compare "$TMPDIR/eval-baseline" "$TMPDIR/eval-candidate"
```

`2166283` is the Release 7.1.0 commit, the last one carrying the pre-edit wording. `--only <slug>` (repeatable) restricts a run to named samples.

## Metrics and pass predicate

The driver measures without a model: `words`, `backtick_lines` (lines containing a backtick), `path_tokens` (whitespace-delimited tokens containing `/` between word characters, or ending in `.md`, `.mjs`, `.ts`, `.json`, `.yml`). Readable threshold: `readable`. Measured word ceiling (`WORD_CEILING`): 350 words; the persona writes to about 220 under a 300-word instruction. `compare` passes (exit 0) when at most two facts across the run are rejected by every candidate reviewer, each printed as `lost: <sample> <fid>` for human review; three or more losses print every lost fact as `fail:` and fail the run. The tolerance reflects six runs that kept or disputed 45-46 of 47 facts while the one or two losses moved between runs. On every sample, candidate quality is not below the baseline level for each reviewer and reaches `readable` or above for at least one reviewer, and no candidate briefing exceeds the measured ceiling. Split fact judgments pass and are listed as `disputed: <sample> <fid> (<reviewer short id>: no)`; unparsed or missing judgments make the run incomplete; exit 1 on any failed clause; exit 2 when an arm is missing, a `pi` call failed, a reviewer answer was unparsed twice, or the two dirs disagree on samples, `input_sha256`, or reviewer set.

## Samples

| Slug | Source | Why |
|---|---|---|
| `finish-dirty-tree-hotfix` | `doc/specs/2026-09-22-finish-verification-dirty-tree-hotfix.md` | thin hotfix; briefing must stay well under the cap |
| `chase-bug-hotfix` | `doc/specs/2026-09-03-chase-bug-hotfix.md` | process-heavy design with many gates |
| `conformance-dispatch-guard` | `doc/specs/2026-09-13-conformance-dispatch-guard.md` | mid-size, carries a supersession banner |
| `gh-30-reviewer-verdict-severity` | `doc/specs/2026-09-13-gh-30-code-reviewer-verdict-severity.md` | ticketed, carries a banner, has verbatim AC rows |
| `gh-8-shape-ticket-skill` | `doc/specs/2026-08-18-gh-8-shape-ticket-skill.md` | large ticketed skill design |
| `gh-57-gatekeep-production-gate` | `doc/specs/2026-10-02-gh-57-gatekeep-pr-production-gate.md` | largest spec in the corpus |
| two anonymized product specs | private repos, rewritten with `../anonymize-prompt.md` and human-reviewed | non-meta product specs; slugs come from the fictional domain |

## Results

`results/<run-id>/` holds both arms of the first run plus `compare.log` (the table) and [fidelity.md](results/20261004-200728/fidelity.md) (driver output vs. a live `spec-summarizer` dispatch on one sample, scored by the same reviewers).
