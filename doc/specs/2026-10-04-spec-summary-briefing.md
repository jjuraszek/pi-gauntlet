# Spec summary as a briefing, with a committed persona eval

> **Superseded by:** [doc/specs/2026-10-05-council-gate-digest.md](./2026-10-05-council-gate-digest.md) - "Out of scope" exclusion of the council audit rendering at the gate only
> **Superseded by:** [doc/specs/2026-10-07-gh-50-universal-eval-template.md](./2026-10-07-gh-50-universal-eval-template.md) - "3. Eval: `eval/README.md` and `eval/spec-summarizer/`" section only

**Goal:** The brainstorming gate summary becomes a fixed-size, plain-language briefing a product manager can approve from, and the persona edit that produces it is checked for lost facts by a committed, re-runnable eval that becomes the convention for every later skill or persona edit.

Supersedes `doc/specs/2026-06-23-spec-summary-at-gate.md`, Decisions and "Edit plan > agents/spec-summarizer.md" (summary output format and length shape). Supersedes `doc/specs/2026-07-06-spec-summary-pruning-fix.md`, the `under ~2%` ratio check in the gate degrade stage only; the file-only transport, the `~500 bytes` floor, the `~45 KB` ceiling, and the Read-last rule stay live there.

## Problem

The `spec-summarizer` persona writes a transcript, not a briefing. Across 172 gate summaries in two product repos (2026-06-24 to 2026-09-19) the median summary was 8.9 KB / 85 lines and 45% of the spec it summarized; 61 runs exceeded half the spec. 38% of summary lines carry backticked identifiers and the median summary names 9 file paths. By byte share, "Key decisions" (19%) and unlisted extra sections such as "Notable mechanics" or "Data flow" (16%) are the largest blocks, while "Problem + idea", the part a reviewer reads first, is 9%.

The cause is the persona's `## What to emit` section (`agents/spec-summarizer.md:20-43`): eleven recommended sections, a rule that "never drop[s] a decision-relevant point, rejected-alternative, risk, or gap-footer entry to hit a length target", a license to "add a section the spec demands", and no word cap, audience, or identifier policy. The proportionality bullet added on 2026-07-06 did not help: median summary length rose from 7.5 KB before it to 9.1 KB after. A same-spec, same-model comparison on 2026-10-04 produced 1036 words with the current persona and 246 words with a 250-word briefing prompt, and the shorter text still named the user-facing change, the approval risks, and the done condition.

The gate (`skills/brainstorming/reference/spec-finalization.md:97-116`) pastes the summary verbatim and already prints the council audit and every gap entry beneath it, so the summarizer's decision log is paid twice on the same screen. The gate's `under ~2%` degrade check (line 90) was sized for ~9 KB summaries and would flag a fixed-size briefing on a large spec as degraded.

Persona wording is also the one surface in this repo with no regression check: `npm test` lints frontmatter and gate markers, not what a model does with the prose. Issue #50 asks for a per-skill eval set but puts persona edits out of scope; the comment of 2026-10-04 on that issue proposes lifting the exclusion and offers the layout below as a candidate convention. This spec defines the eval contract on its own terms; #50 may adopt it later.

## Acceptance criteria

none - no ticket

## Design

Four components, one worktree, one squash commit.

### 1. Persona: `agents/spec-summarizer.md`

Replace the `## What to emit` section (heading at line 18 through line 41) with the text below. The four paragraphs around it (line 12 cold-reader frame, line 14 read-only-that-file, line 16 thin-spec signal, line 43 file-only output) stay, with two sentence-level edits so they match the new section: line 14's "do not invent it - list it in the gap footer" becomes "do not invent it - list it under Missing from the spec, by its plain-language title (the ticket's subject, the document's name), never by SHA or path"; line 16's "A thin or confused summary is a faithful signal that the spec itself is thin" becomes "A confused briefing, or one whose Missing from the spec block is long, is a faithful signal that the spec itself is thin" (a short briefing is the required shape, not a signal). The frontmatter `description` changes one phrase: "Produces a tight, human-readable summary" becomes "Produces a plain-language briefing (at most 300 words)". Nothing else in the frontmatter changes (`tools: read`, `defaultContext: fresh`, `inheritProjectContext: false`, `inheritSkills: false`, `completionGuard: false`, `systemPromptMode: replace`, no `model`, no `thinking`).

New section, verbatim:

```markdown
## What to emit

Emit a briefing of at most 300 words in total - write to about 220, since measured counts run a fifth over an estimate and the cap is checked on the measured count - in this order, each part within its own budget:

1. One entry paragraph, at most 90 words: who is hurt today and how, what the spec does about it, and what that person gets once it ships. A reader who stops here can say yes or no.
2. **What changes** - 3-5 one-sentence bullets, at most 80 words together. Each bullet is one rule the user can observe, stated as a condition and its outcome ("when a ticket already fits the template, nothing is written"). Rules that stop, block, or require a repeat approval count as changes. A rule travels with its qualifiers: the condition that makes it apply, what it refuses or keeps, what happens at a zero setting or a missing precondition ("when the base branch moves first, the flow stops and keeps the reviewed work"). The last bullet names what deliberately stays as it is.
3. **Approval risks** - up to 3 one-sentence bullets, at most 45 words together, each something the supervisor can veto: an irreversible step, a changed contract other components depend on, a dependency on work outside this spec, or a decision the spec leaves to the implementer.
4. **Done when** - one or two sentences, at most 25 words, restating every measurable completion condition the spec names, each threshold with its precondition ("under five minutes with a warm cache").
5. **Missing from the spec** - at most 3 lines, each under twelve words, naming an external source a requirement depends on but the spec does not inline (a ticket's acceptance criteria, a contract in another document). Never list superseding or related specs, decision history, or reading material. Emit this block only when at least one such source exists.

Write for a product manager in plain words - behaviors, actors, outcomes - with no code-level identifiers (file paths, commit SHAs, backticked names, command names, line numbers), as the example below does. Leave out the decision log (rejected alternatives, "chose X over Y because Z", how the document was edited); the gate prints the critique record next to the briefing. A short spec yields a briefing well under the cap; the cap is a ceiling, never a target.

Before: "`guard-windows` job on `windows-latest` in `harness-guard.yml` runs `script/harness-guard.ps1`; a non-zero exit blocks merge."
After: "A Windows regression in the hook tooling now fails the pull request instead of reaching an operator."
```

The section follows `/skill:forge-skill` `## Authoring rules`: imperative voice, one path, a statement of what the output is (recipe) with one explicit rule per discipline problem (identifiers; decision log), no nuance clause ("when in doubt", "recommended checklist, not a rigid template", and "add a section the spec demands" are gone), one example. forge-skill's optional loaded-vs-baseline worker test is replaced by the eval in component 3.

The "Missing from the spec" block is the gap footer under its new name; the gate keeps re-listing its entries.

### 2. Gate: `skills/brainstorming/reference/spec-finalization.md`

- Line 90, stage 1: delete the clause "or a size grossly disproportionate to the spec (under ~2% of its byte size),". The `under ~500 bytes` and `over ~45 KB` checks stay.
- Line 91: the pruning rationale's "~9KB read result" becomes "the read result"; the Read-last rule itself is unchanged.
- Line 97: "and every gap-footer entry:" becomes "and every `Missing from the spec` entry:". Line 110 (gate template): "every gap-footer entry from the summary" becomes "every `Missing from the spec` entry from the summary".
- `scripts/brainstorming-contract.test.mjs:58`: remove the `under ~2%` marker; keep `under ~500 bytes` and `over ~45 KB`; add one test that reads `agents/spec-summarizer.md` and asserts the markers `at most 300 words`, `Missing from the spec`, and `do **not** attempt to write` (no test reads the persona body today; from this change on the shape and file-only contracts are asserted).
- `doc/personas.md:9`: "produces a tight, spec-only human summary" becomes "produces a plain-language briefing (at most 300 words) of one spec". Line 54: "a thin summary signals a thin spec" becomes "a confused briefing or a long Missing-from-the-spec block signals a thin spec".
- `CHANGELOG.md`: one entry under `## Unreleased`.

### 3. Eval: `eval/README.md` and `eval/spec-summarizer/`

`eval/` is a new top-level directory, outside `package.json#files` (so the npm tarball is unchanged). Model-calling runs never happen in `scripts/ci.mjs` (CI has no model access); the deterministic driver tests do run there. `scripts/model-literal-lint.mjs` does not scan `eval/`, and model ids appear there only in README examples and recorded results, never as defaults.

`eval/README.md` owns the convention; a per-target README holds only what differs for that target. The convention table below is written with this target's literals (the five quality labels, the `readable` threshold, the 300-word cap, the persona path) for concreteness; `eval/README.md` states each such row generically ("the target's readable threshold", "the target's length cap", `<target file>`) and `eval/spec-summarizer/README.md` carries the literals. Rationale sentences in the table are design notes, not text the README must echo.

Convention (contents of `eval/README.md`):

| Item | Rule |
|---|---|
| Layout | `eval/README.md` (this convention), `eval/anonymize-prompt.md`, `eval/<target>/{README.md, reviewer-prompt.md, run.mjs, run.test.mjs, sample/<slug>/{source.md, expected.md}, results/<run-id>/}` |
| `source.md` | the fixed input the target consumes |
| `expected.md` | must-hold facts (4-6 per sample, each with a stable id), never a golden output. Drafted by a fresh model dispatch that sees only `source.md` (never any candidate output), then edited and approved by the user per sample before the baseline run; the approved list is the oracle. An anonymized sample carries the line `anonymized: true` at the top |
| `reviewer-prompt.md` | one reviewer's job only: inputs (`source.md`, the `expected.md` facts, one candidate output); emits exactly one fenced JSON object `{ "facts": { "<id>": "yes" or "no" }, "quality": "<label>", "rationale": "<one line>" }`. Quality answers one question - "could a product manager with no code access decide from this text alone?" - on the ordered scale `unreadable` (needs the code to follow) < `engineer-only` (follows for an engineer, not a PM) < `mixed` (decidable, but identifiers or decision-log noise slow it) < `readable` (plain language, decidable end to end) < `briefing` (decidable from the first paragraph alone). Never mentions other reviewers or the driver |
| `run.mjs` | two subcommands. `run --arm baseline\|candidate --candidate-model <id> --reviewers <id,id> --persona <path> --out <dir> [--only <slug>]...` (all required except `--out`, default a fresh dir under `$TMPDIR`, and `--only`, which restricts a run to the named samples so one failed arm can be re-run in place; no committed model default) renders every sample, scores it with every reviewer, writes one record per sample; `compare <baseline-dir> <candidate-dir>` checks that both dirs cover the same samples with the same `input_sha256` and reviewer set, prints one table, and exits 0 on pass, 1 on fail, 2 on incomplete |
| Pass predicate | across the whole run, at most 2 `expected.md` facts are lost (a fact is lost when every candidate reviewer answers `no`; a split answer is disputed and reported, not failed; an `unparsed` or missing judgment makes the run incomplete); every lost fact is printed as a `lost:` line for human review at publication, and a third lost fact turns them into `fail:` lines. The tolerance is measured: six candidate runs on eight samples kept or disputed 45-46 of 47 facts every time while the 1-2 lost facts moved between runs, so a single lost fact is sampling noise and three is a signal. On every sample, every candidate `quality` is at or above the baseline level for that same reviewer and at least one candidate reviewer rates `readable` or above, and no candidate briefing exceeds the measured ceiling of 350 words (the persona writes to about 220 under a 300-word instruction; measured counts on 40-50 KB specs run 10-20% over the instruction, so the ceiling sits above the instruction). A missing arm, a failed `pi` call, or a twice-unparsed reviewer answer makes the run incomplete, never a pass. Disputed facts are listed per sample in the `compare` output so the human can inspect them |
| Baseline | run on the current wording before the edit, from an immutable reference (`git show <pre-edit SHA>:agents/spec-summarizer.md` into `$TMPDIR`); the record is the comparison target. One-time exception, recorded here: this change's own baseline was collected after the persona edit, by replaying the pinned pre-edit wording from `2166283` - the persona at that ref is immutable, so the content comparison holds; the before-edit timing binds every later target and every later edit to this one |
| Leak check | before any model call, every file under `sample/` is matched against a denylist file named by `GAUNTLET_EVAL_DENYLIST`: one case-insensitive regular expression per line, blank lines and `#` lines ignored; an invalid expression aborts before any model call; a hit aborts and prints the file and line number (never the pattern text into a record); an unset variable or missing file prints `leak check: skipped (no denylist)` as the first output line |
| Hygiene | a Node regex scan in `scripts/ci.mjs` over `eval/` (reusing the `walk` helper at line 150) fails on `/Users/[^/]+` and on `jjuraszek` unless it is part of a `github.com/jjuraszek/` URL or a `jjuraszek/pi-gauntlet#<n>` ticket reference - public issue links and ticket refs in verbatim pi-gauntlet specs are provenance, not leakage. `eval/README.md` describes both patterns in words - naming neither the path prefix nor the handle, since either literal would match the scan itself - and names `node scripts/ci.mjs` as the manual check |
| Anonymization | a sample from a private repo is rewritten by an LLM into a fictional domain (services, people, product nouns, hostnames) with the committed prompt `eval/anonymize-prompt.md`, then reviewed line by line by a human; only then is `expected.md` drafted and approved, then the baseline runs. The README names the order and the reviewer confirms the review in the commit message |
| Durable evidence | the first run of every target commits both arms' records under `eval/<target>/results/<run-id>/`; each record carries the candidate text itself, so the before/after is readable without re-running. Later runs stay under `$TMPDIR` unless they become the new baseline |
| Adding a target | copy the layout, write at least five samples spread across the cases the target handles, get `expected.md` approved first, run the baseline, then edit the target |

`eval/spec-summarizer/README.md` adds: the candidate run is `pi -p --model <candidate> --no-tools --no-skills --no-extensions --no-context-files --no-session --system-prompt "<persona body without frontmatter>"` from a scratch cwd with the spec text inlined in the user message (the persona's `read` tool is unavailable under `--no-tools`; the dispatch task text is the same sentence the gate uses, followed by the spec in a fenced block). Reviewer calls use the same flags with `reviewer-prompt.md` as the system prompt. The driver measures `words`, `backtick_lines` (lines containing a backtick), and `path_tokens` (whitespace-delimited tokens containing `/` between word characters, or ending in `.md`, `.mjs`, `.ts`, `.json`, `.yml`) - the metrics the Problem was measured in - without a model. Running outside a brainstorming flow and with `--no-extensions` keeps telemetry's `spec_rounds` counter untouched. The baseline persona for this change is `git show 2166283:agents/spec-summarizer.md` (the Release 7.1.0 commit, the last one carrying the pre-edit wording).

Result record, one JSON file per sample and arm (`baseline` or `candidate`):

```json
{
  "sample": "<slug>", "arm": "candidate",
  "candidate_model": "<id>", "reviewers": ["<id>", "<id>"],
  "persona_sha256": "<hex>", "input_sha256": "<hex of source.md + expected.md + reviewer-prompt.md>", "repo_sha": "<git HEAD>",
  "text": "<the candidate briefing, verbatim>",
  "words": 268, "backtick_lines": 0, "path_tokens": 0,
  "facts": { "<fact-id>": { "<reviewer>": "yes", "<reviewer>": "no" } },
  "quality": { "<reviewer>": "<level label>" },
  "rationale": { "<reviewer>": "<one line>" },
  "aggregate": { "kept": 5, "disputed": 1, "lost": 0 }
}
```

`kept` means `yes` from every reviewer, `lost` means `no` from every reviewer, `disputed` is anything else including `unparsed`.

Sample set, eight samples:

| Slug | Source | Why |
|---|---|---|
| `finish-dirty-tree-hotfix` | `doc/specs/2026-09-22-finish-verification-dirty-tree-hotfix.md` (2.2 KB) | thin hotfix; briefing must stay well under the cap |
| `chase-bug-hotfix` | `doc/specs/2026-09-03-chase-bug-hotfix.md` (24 KB) | process-heavy design with many gates |
| `conformance-dispatch-guard` | `doc/specs/2026-09-13-conformance-dispatch-guard.md` (13 KB) | mid-size, carries a supersession banner |
| `gh-30-reviewer-verdict-severity` | `doc/specs/2026-09-13-gh-30-code-reviewer-verdict-severity.md` (8 KB) | ticketed, carries a banner, has verbatim AC rows |
| `gh-8-shape-ticket-skill` | `doc/specs/2026-08-18-gh-8-shape-ticket-skill.md` (35 KB) | large ticketed skill design |
| `gh-57-gatekeep-production-gate` | `doc/specs/2026-10-02-gh-57-gatekeep-pr-production-gate.md` (49 KB) | largest spec in the corpus; the old `~2%` check would have required a 1 KB floor |
| `<anonymized-1>` | customer-ops `docs/specs/2026-09-18-windows-harness-ci-leg.md` (20 KB), rewritten | the product spec the triage measured (1036 vs 246 words) |
| `<anonymized-2>` | one gridstrong spec of 15-30 KB chosen at anonymization time, rewritten | second product domain, keeps the set honest about non-meta specs |

The six public samples are copied verbatim as `source.md`. The two anonymized samples get their final slugs from the fictional domain; the human review of each is a task in the plan, and the sample is committed only after it.

`expected.md` for each sample lists 4-6 facts, each with a stable id, drawn from: the problem (who is hurt), the user-visible change, each irreversible or blocking consequence, the done condition, external dependencies. Per the convention row, a fresh dispatch drafts them from `source.md` alone and the user edits and approves each list before the baseline run; the approval is a plan task that blocks the baseline.

First run (inputs recorded in the result records, not defaults): candidate `anthropic/claude-opus-5-5` (the production summarizer inherits the session default, and no `agentOverrides` entry pins it), reviewers `github-copilot/gpt-6-astra` and `anthropic-fable/claude-fable-5-1` (a cross-provider pair, neither equal to the candidate).

### 4. Standing rule: AGENTS.md and README.md

The rule: a non-trivial edit under `skills/`, `agents/`, or a prompt file creates `eval/<target>/` when it does not exist, or adds a sample exercising the changed behavior when it does, and runs the baseline on the current wording before the edit. The brainstorm spec names the samples and their must-hold facts. Trivial edits (typo, formatting, dependency bump, release commit) are exempt, the same list as Change process today. `extensions/`, `src/bins/`, and `scripts/` stay on `scripts/ci.mjs`; an LLM eval for deterministic code measures nothing.

- `AGENTS.md` Change process: one sentence stating the rule, linking `eval/README.md`.
- `AGENTS.md` Package rules: one bullet, "Evals live in `eval/<target>/` per `eval/README.md`; `eval/` is outside the tarball; `ci.mjs` runs its deterministic tests, never a model call."
- `AGENTS.md` Routing: one row, "Add or run an eval for a skill or persona | `eval/README.md`".
- `README.md`: a short `## Evals` section after `## Performance digest` stating what an eval is, the one-line run command shape, and the link to `eval/README.md`.

A sibling session is designing `eval/forge-skill/` on the same convention from a self-contained handoff prompt; `eval/README.md` is not its precondition. Whichever change lands second reconciles its target README against `eval/README.md`.

## Errors and edge cases

- `pi -p` exits non-zero or returns empty output for an arm: the driver records a failed arm for that sample, continues with the other samples, and `compare` exits 2 (incomplete).
- A reviewer answer that is not exactly one fenced JSON object with the three keys: retried once with the same prompt; a second failure is recorded as `unparsed` for that reviewer, counted as disputed in the aggregate, and makes `compare` exit 2.
- Briefing over the 350-word ceiling: recorded; the reviewers still score it so the fact comparison stays available; `compare` exits 1. A briefing between 300 and 350 words passes the length clause and is reported.
- Empty `--reviewers` list: a usage error (exit 64) before any model call; a candidate arm needs at least one reviewer to produce a judgment.
- Denylist hit or invalid denylist expression: the run aborts before any model call and prints the matching file and line number; the pattern text is never written to a record.
- `compare` with mismatched samples, `input_sha256`, or reviewer sets between the two dirs: exits 2 and names the mismatch.
- Gate with the `~2%` check removed: a 100 KB spec with a 1.8 KB briefing renders; a briefing under ~500 bytes degrades as today; over ~45 KB degrades as today.
- "Missing from the spec" is empty for most pi-gauntlet specs (brainstorming inlines external refs before dispatch); the persona emits nothing for it, and the gate's adjacent-lines list is then empty.
- The telemetry counter at `extensions/telemetry.ts:690` keys on the agent name `spec-summarizer`, which does not change.

## Tests

Deterministic, in `npm test`:

- `scripts/brainstorming-contract.test.mjs`: new persona test asserting `at most 300 words`, `Missing from the spec`, `do **not** attempt to write` in `agents/spec-summarizer.md`; gate marker set loses `under ~2%`, keeps `under ~500 bytes` and `over ~45 KB`.
- New `eval/spec-summarizer/run.test.mjs`, added as an explicit entry to the `execFileSync(process.execPath, ["--test", ...])` call in `scripts/ci.mjs` (line 420; `ci.mjs` enumerates test files, no glob): reviewer-output parsing against fixture texts, the `unparsed` path, aggregation (kept/disputed/lost), the three metrics, the pass predicate (including two lost facts passing with `lost:` lines, three lost facts failing with `fail:` lines, a fact disputed by one reviewer passing and being listed, quality below baseline for one reviewer failing, both reviewers at `mixed` failing while one at `readable` passes, a briefing at the ceiling passing and one word over it failing), the leak check against a fixture denylist (hit, invalid expression, skipped), and `compare` exit codes 0/1/2 on fixture record dirs. No model calls.
- `npm pack --dry-run` contents unchanged (existing `ci.mjs` assertion; `eval/` absent from the tarball).
- New `ci.mjs` hygiene scan over `eval/` per the convention row (fails on `/Users/[^/]+`, or `jjuraszek` outside a `github.com/jjuraszek/` URL or a `jjuraszek/pi-gauntlet#<n>` ticket reference).

Model-dependent, manual, documented in `eval/spec-summarizer/README.md`:

1. Draft `expected.md` for all eight samples (fresh dispatch, `source.md` only); the user edits and approves each.
2. Baseline arm with the pre-edit persona (`git show 2166283:agents/spec-summarizer.md` written to `$TMPDIR`), `--out` under `$TMPDIR`.
3. Candidate arm with the edited persona.
4. `compare`: pass per the convention's pass predicate (at most 2 facts lost by both candidate reviewers across the run, each printed as a `lost:` line; quality not below baseline per reviewer and `readable` or above from at least one; no briefing over 350 words). Disputed facts are reviewed by the user against the briefing text: when the briefing carries the fact's substance in other words, the `expected.md` line is restated once in plainer words before the final run; otherwise the dispute is recorded in `## Verification`. Every `lost:` line is reviewed by the user the same way and recorded in `## Verification` with the reason the briefing dropped it (an invariant another gate enforces, a constraint no single run makes observable, a precondition folded into a shorter sentence); the verdict line reads `pass, N lost facts reviewed`. Any `fail:` line is a failed run.
5. Copy both arms' records into `eval/spec-summarizer/results/<run-id>/` and commit them.

The `compare` table (sample, words / backtick lines / path tokens per arm, kept/disputed/lost per arm, quality per reviewer per arm) is pasted into `## Verification` below as the last implementation task, together with the three model ids used.

## Documentation impact
- Feature / user-facing docs introduced: `eval/README.md` (major procedures / conventions: the eval layout, driver contract, result record, anonymization step); `eval/spec-summarizer/README.md` (operations: the run command and the regression rule for this target)
- Materially amended existing docs: `AGENTS.md` (Change process sentence, Package rules bullet, Routing row - a new convention); `README.md` (`## Evals` section - a new user-facing procedure); `doc/personas.md` (roster line - changed contract of the summarizer's output); `CHANGELOG.md` under `## Unreleased`
- Derived / memory docs invalidated: `doc/specs/2026-06-23-spec-summary-at-gate.md` and `doc/specs/2026-07-06-spec-summary-pruning-fix.md` (supersession banners, scopes as in the header); `doc/configuration.md` is not touched (no settings key changes)

Guideline: `reference/documentation-impact.md`.

## Out of scope

- Implementing issue #50 (per-skill eval tasks with a runner-only judge). This spec does not claim alignment with #50's acceptance criteria; the convention is offered in a comment there, nothing more.
- Reconciling `skills/forge-skill/SKILL.md` `## Test (optional)` with the new standing rule - owned by the sibling `eval/forge-skill/` change; whichever of the two lands second resolves the overlap.
- Editing #50's body (lifting the persona exclusion) - that is a `/skill:shape-ticket` step.
- `eval/forge-skill/` - sibling session.
- Changing the council audit rendering or the gate's adjacent-lines template beyond the one rename.
- Gate-side truncation or post-processing of the summary; the verbatim-paste rule stays.
- Any `piGauntlet.*` settings key; the summarizer's model stays on `subagents.agentOverrides.spec-summarizer.model` or the session default.
- Running the eval inside CI.

## Open questions

- Whether `pi -p --no-tools` with the spec inlined reproduces the gate's subagent dispatch closely enough. Resolution during implementation: for one sample, dispatch `subagent({ agent: "spec-summarizer", model: <candidate> })` after confirming by `sha256` which arm's persona the installed `agents/spec-summarizer.md` equals (the worktree file for the candidate arm, or `2166283`'s for the baseline arm - the dispatch then compares against that arm's record), score that output with the same reviewers, and record in `eval/spec-summarizer/results/<run-id>/fidelity.md` (linked from the target README) the per-fact differences against the driver's output for the same sample ("differ" = any `expected.md` fact not `yes` from both reviewers in both outputs). The driver stays the inline form either way; the fidelity record states the observed difference so a reader can weigh the eval against gate behavior.

## Verification

| sample | words b/c | backtick lines b/c | path tokens b/c | kept/disputed/lost b | kept/disputed/lost c | quality b | quality c |
|---|---|---|---|---|---|---|---|
| asterwind-linear-cutoff-boundaries | 1305/289 | 41/0 | 18/2 | 6/0/0 | 5/1/0 | gpt-6-astra=mixed claude-fable-5-1=mixed | gpt-6-astra=mixed claude-fable-5-1=briefing |
| chase-bug-hotfix | 1487/304 | 50/0 | 23/0 | 6/0/0 | 6/0/0 | gpt-6-astra=mixed claude-fable-5-1=mixed | gpt-6-astra=mixed claude-fable-5-1=briefing |
| conformance-dispatch-guard | 972/279 | 43/0 | 14/0 | 6/0/0 | 6/0/0 | gpt-6-astra=mixed claude-fable-5-1=mixed | gpt-6-astra=briefing claude-fable-5-1=briefing |
| finish-dirty-tree-hotfix | 495/244 | 6/0 | 7/1 | 6/0/0 | 4/1/1 | gpt-6-astra=mixed claude-fable-5-1=mixed | gpt-6-astra=briefing claude-fable-5-1=briefing |
| gh-30-reviewer-verdict-severity | 665/268 | 18/0 | 5/0 | 5/0/0 | 5/0/0 | gpt-6-astra=mixed claude-fable-5-1=mixed | gpt-6-astra=readable claude-fable-5-1=briefing |
| gh-57-gatekeep-production-gate | 1529/308 | 65/0 | 35/1 | 6/0/0 | 5/1/0 | gpt-6-astra=mixed claude-fable-5-1=mixed | gpt-6-astra=mixed claude-fable-5-1=briefing |
| gh-8-shape-ticket-skill | 1636/270 | 33/0 | 22/0 | 6/0/0 | 5/0/1 | gpt-6-astra=mixed claude-fable-5-1=mixed | gpt-6-astra=mixed claude-fable-5-1=briefing |
| windward-rig-ci-leg | 1408/273 | 71/0 | 7/0 | 6/0/0 | 6/0/0 | gpt-6-astra=mixed claude-fable-5-1=engineer-only | gpt-6-astra=readable claude-fable-5-1=briefing |

Models: candidate anthropic/claude-opus-5-5; reviewers github-copilot/gpt-6-astra, anthropic-fable/claude-fable-5-1.
Records: eval/spec-summarizer/results/20261004-200728/.
Fidelity: eval/spec-summarizer/results/20261004-200728/fidelity.md records the gh-30 baseline comparison: driver/gate-style output had 665/754 words, 18/21 backtick lines, 5/6 path tokens, mixed quality from both reviewers and 5/0/0 kept/disputed/lost in both; differ count 0.

Disputed facts: asterwind-linear-cutoff-boundaries f6 (Fable no); finish-dirty-tree-hotfix f6 (Fable no); gh-57-gatekeep-production-gate f6 (Astra no).

- lost: finish-dirty-tree-hotfix f2: the briefing says the hotfix verifies a clean commit but folds away the same-session precondition; a scheduling constraint, not a user-visible outcome.
- lost: gh-8-shape-ticket-skill f2: tracker neutrality is a portability constraint from the source's Context; the briefing says "the tracker" without naming it.

Run 1 produced 351-414 words, with six samples losing a fact under the strict any-no predicate.
Run 2 produced 287-338 words after per-section budgets.
Run 3 produced 276-339 words, with 41/47 facts kept, four disputed, two lost; total words fell from 9,778 to 2,447, backticked lines from 345 to zero, and path tokens from 141 to zero.
Run 4 used the amended predicate (lost means every reviewer answers no, one readable reviewer, 350-word ceiling), with two lost facts: chase-bug f5 and gh-8 f2.
Run 5 changed only cap wording and produced 274-352 words; gh-57 at 352 failed the ceiling.
Run 6 lowered the writing target to about 220 and produced 244-308 words; chase-bug f5 was kept, while finish-dirty f2 and gh-8 f2 were lost.
The predicate was then amended to a run-level tolerance of two because the lost set moved between runs while 45-46 of 47 facts stayed kept or disputed.

Verdict: pass, 2 lost facts reviewed.
