# Refresh disputed eval judgments over saved replies

**Goal:** Let a caller explicitly refresh one sample's LLM judgments over current saved replies without changing evaluation inputs, while retaining the prior judgment and latest attempt even when refresh fails.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** #64
**Supersedes:** `doc/specs/2026-10-16-eval-granular-staleness-parallel-runs.md`, Component 2 persistence/cancellation and Report and CLI additions, only for explicit judgment refresh and bounded refresh-audit retention. That spec already succeeds the universal eval spec's Records and report scope; its other behavior stands.

## Problem

Framing: kept (ticket #64).

The runner immediately reuses a judgment whose five currency hashes match (`eval/run.mjs`, `judgeEntry`; `eval/lib/records.mjs`, `judgmentCurrent`). Positional sample selection only limits coverage; it does not bypass reuse. A disputed passing or inconclusive result therefore has no supported refresh operation. The ticket reports a synthetic inconclusive rerun that exits 1 with zero model calls. Source inspection supports that path; this design does not claim a separate live reproduction.

The current error path removes currency hashes so ordinary reruns retry errors, and writing the next candidate judgment loses the previous one. Refresh must retain its own evidence without depending on a Git commit. The immutable example cited by #64 records a fact as fails/fails while feedback says "Before holds and After fails." This demonstrates contradictory evidence, not a reliable way to detect it automatically or proof that prompt size caused it.

Changing only intent's `for:` line does not invalidate judgments: `intentBody` excludes that line from `intentSha`. Changing judge-visible intent does. Neither editing intent nor deleting stored judgments is the recovery operation delivered here.

The user selected replacement of active judgments, including errors, and approved an inline bounded audit rather than a second result source. The runtime remains LLM-driven and noninteractive. A coding agent can invoke refresh and consume its result without a human decision, manual verdict, or adoption step.

## Acceptance criteria

Ticket #64, Acceptance Criteria, rows verbatim:

- [ ] Given reusable saved replies and any cached judgment, including a passing one, an explicit refresh request distinct from ordinary sample selection rejudges the selected sample without editing skill text, sample inputs, facts, judge instructions, or intent. Unselected samples receive no model calls or record changes; the affected sample and replay models are reported.
  in-scope
- [ ] Refresh bypasses judgment reuse only. Missing or non-current saved replies cause refusal before model calls or record changes. Saved baseline and candidate replies remain unchanged; any confirmation reply is retained separately. A refreshed regression follows the existing single confirmation-replay rule, without automatic retry-until-pass.
  in-scope
- [ ] Given fixed inputs without accepted-regression entries, stubbed refreshes demonstrate a passing judgment, a reproduced regression, a non-reproducing regression, and judge failure. They produce pass, regressed, inconclusive, and error outcomes respectively; requesting refresh never guarantees exit 0. The selected-sample report remains explicitly partial.
  in-scope
- [ ] For the latest explicit refresh attempt, runner-written artifacts retain the prior judgment and the refreshed judgment or error, including per-fact outcomes, feedback, any confirmation reply/judgment/error, and the identities of saved replies, facts, judge instructions, models/thinking, and intent. Reviewing those artifacts distinguishes changed judgments from changed inputs, including failed attempts, without relying on a human commit.
  in-scope
- [ ] The eval guide documents the refresh operation, the existing accepted-variance entry format in intent.md, and these limits: changed prompt assembly means changed input; contradictory judgments require review; human acceptance of a regression does not establish harmless model variance. Refresh neither widens intent nor records acceptance automatically.
  in-scope

## Design

### Command and ownership

Expose `node eval/run.mjs <target> <sample> --refresh-judgments [--base <ref>]` and the corresponding boolean `refreshJudgments` option on `runTarget`. Require one existing sample. Reject `--refresh-judgments` with `--baseline-only` or without a sample, using exit 2. Preserve existing argument validation and base resolution. The selected set is every model in `MODELS.replay`; there is no target-wide or individual-model refresh option.

Keep orchestration and CLI parsing in `eval/run.mjs`, record operations in `eval/lib/records.mjs`, and presentation in `eval/lib/report.mjs`. Extend existing tests in those modules' test files. No new command, result-file family, schema package, model configuration, prompt, or skill is introduced. The existing judge remains the authority for judged facts; mechanical checks and label/exit derivation remain deterministic.

The flag is an explicit operation, not a human-authorization gate. It accepts agent callers, never prompts for confirmation, never waits for manual review, and automatically makes the new outcome active. Advice to review contradictory evidence is not a blocking human-only stage in this command.

### Preflight before calls or writes

Run existing target lint, hygiene, base resolution, assembly, intent validation, and sample-selection checks. Compute the same per-sample baseline and candidate identities as ordinary execution. Apply `cellReusable` to each configured replay model in both stored arms: `skillSha`, `inputSha`, kind, assembly, thinking, model membership, and successful output status must match the existing rules.

Require the stored baseline and candidate themselves to qualify. Do not promote a candidate, seed an arm, regenerate a stale reply, or repair its identity during refresh. A single missing/non-current cell refuses the whole operation with exit 2 before any model call or record/report mutation; identify sample, arm, and model in the diagnostic. Unreadable or malformed saved records also refuse. Existing invalid-intent refusals still apply; refresh does not repair intent.

No current judgment is required for admission: a passing, non-passing, stale, missing, or error judgment can be refreshed when both replies are reusable. Changed facts, judge instructions, or judge-visible intent can already cause ordinary rejudging; explicit refresh uses the current valid inputs without changing them and records their identities. It does not claim those identities match a historical judgment when they do not.

### Judgment and confirmation

Bypass only the `judgmentCurrent` return for the selected models. Reuse the existing judge prompt builder, parser, labeling, verdict ordering, bounded adapter pool, and maximum two judge attempts. This is not a new judge or retry policy.

Recompute mechanical facts on copies of saved cells for labeling. Never assign recalculated mechanical results back into the saved output payload. Feed the unchanged baseline/candidate reply texts, and their saved edit trees where applicable, to the existing LLM judge. Preserve the ordinary one-confirmation rule: when a new cell verdict is regressed, generate one candidate confirmation replay and judge it against the original baseline. Reproduction means at least one originally regressed/unexplained fact repeats the same label. Non-reproduction becomes inconclusive; replay or judge failure becomes error.

Keep confirmation text, tree when present, mechanical facts, judged facts/labels, feedback, error, and timings separately under that judgment's `confirmation`. Never replace `candidate.outputs[model]` with confirmation output. A confirmation judgment cannot trigger another confirmation. There is no retry-until-pass, automatic intent edit, or acceptance entry.

The refreshed outcome replaces the active `candidate.judge[model]` even when it is error. Preserve ordinary error non-reuse: active error entries do not gain reusable currency hashes merely because the audit retains identities. A later ordinary invocation may retry an error through its existing path, but cannot fall back to the old pass. Successful refreshed judgments remain eligible for ordinary currency-based reuse.

### Bounded inline audit and persistence

Add one optional top-level `refresh` field in `candidate.json`. It is an audit snapshot, not an alternate active-judgment lookup. Use these responsibilities:

| Field | Meaning |
|---|---|
| `status` | `running`, `complete`, or `interrupted`; complete means finished, not passed |
| `identity` | Current attempt's sample, kind/assembly, both skill SHAs, input SHA, facts/judge-prompt/intent SHAs, replay/judge model identifiers, thinking, and saved-output identities per selected model |
| `previous` | Independent snapshots of the pre-refresh selected judgments and their recorded identity/model metadata; no previous `refresh` block |
| `refreshed` | Independent per-model refreshed judgment or error snapshots, including available confirmation evidence |

Saved-output identities include the existing text hashes and a `payloadSha` for each arm/model. Define `payloadSha` as SHA-256 of the complete stored `outputs[model]` object serialized as JSON with recursively sorted object keys and preserved array order. Include mechanical data, word counts, timings, and edit trees when present; exclude judgment/audit fields outside that object. Metadata changes can change `payloadSha` without changing the separate reply-text hash. This identifies the saved payload even after an ordinary run replaces active outputs. Keep existing identity names where they already exist.

Preserve prior recorded hashes and model metadata as recorded, distinguishing them from current-attempt identity. Record-level `models.judge` is not reliable per-judgment provenance: do not infer the prior judge model from it. Preserve explicit per-judgment provenance where available; otherwise use null. New refreshed entries record `judgeModel` and `thinking` alongside their result, including errors, so future refreshes can preserve that provenance. Missing historical identity or a missing prior judgment remains explicitly unknown/null; never copy current values into the past.

Deep-copy snapshots: subsequent active-judgment or output changes must not mutate the audit. All new strings persisted from failures or model outputs use the existing hygiene/redaction rules. Retain parsed outcomes/feedback when available and failure diagnostics when not; do not invent fact outcomes for failed/unstarted judging. Full raw rejected judge responses and every parser retry are not an extra history requirement.

After preflight and before the first model call, atomically persist `refresh.status = running`, prior snapshots, current identities, and an incomplete error for each selected active/refreshed judgment. If this initial save fails, start no models. A previous pass must not remain the active result of an admitted but incomplete refresh. Replace each incomplete result with the actual result as that model finishes; persist the active result and its audit copy together. Mark the attempt complete after all models settle. Each settlement updates the shared current candidate object and atomically replaces its record synchronously, without an asynchronous gap in that sequence. Every save incorporates all earlier settled results; stale whole-record snapshots may not erase another model's result.
Use a uniquely named same-directory temporary file, synchronous write, and rename for atomic candidate replacement; no shared temporary-file collisions, unbounded journal, or second authoritative result artifact.
Refresh never writes `baseline.json` and leaves it byte-identical. Preserve the entire `candidate.outputs` value, including extra historical model outputs, replay metadata, and edit trees. Do not use the existing model-key pruning in `writeChanged` to rewrite saved output payloads on this path. Candidate judgment/audit metadata and `repoSha` may change. Unselected samples receive no model calls or writes.

A later explicit refresh replaces the entire `refresh` snapshot. Its predecessor is the active judgment immediately before that attempt, not a recursively retained older audit. Ordinary reruns preserve the last explicit snapshot unchanged, including when constructing a fresh candidate record after replay staleness.
Baseline promotion strips both `judge` and `refresh` so a candidate audit does not become baseline state. Existing records lacking `refresh` remain valid without migration.
### Reports and outcomes

Write the normal selected-sample report with its existing partial title and model rows. Add a run-level explicit-refresh marker and an audit reference to the selected candidate record. Reuse the report's existing model column.
The completion message identifies refresh, sample, and affected replay models and retains replay/judge/confirm counts and wall time. Ordinary replay count is zero for a refresh; confirmations count separately.
Keep the existing worst-cell order: error, inconclusive, regressed, unchanged, improved. Unchanged/improved produce exit 0; error/inconclusive/regressed produce exit 1. "Pass" is an exit outcome, not a new stored verdict. Refresh does not guarantee exit 0, imply full-target coverage, or satisfy the existing requirement for a committed full-target report by itself. Refusals leave the previous report unchanged. Ordinary zero-call report behavior is unchanged.

## Errors and edge cases

- **Judge or confirmation failure:** retain the prior judgment, current attempt identities, available fact/feedback/confirmation evidence, and the error; activate the error and exit 1. Other selected models finish normally.
- **Orderly interruption:** after an attempt is admitted, SIGINT stops queued calls and cancels running children through the existing adapter. Persist completed results plus interruption errors and available evidence for unfinished models; mark the audit interrupted, write an explicitly partial interrupted report, and exit 130. No human step is needed. Ordinary non-refresh interruption behavior is unchanged.
- **Abort before admission:** no model calls or audit writes; exit 130. Refusals are not refresh attempts and do not rotate audit history.
- **Hard termination:** the most recent atomic candidate snapshot remains the evidence. A running audit and incomplete active errors are explicitly non-success, not a preserved pass. No completed report, process resumption, or power-loss durability is promised.
- **Persistence failure:** any audit-save failure makes the invocation exit 1, even if a later save succeeds or interruption also occurs. Identify the candidate record path and filesystem failure, stop further scheduling, and leave `report.md` unchanged. Already admitted calls may settle and their results may be saved; never present an unsaved outcome as persisted. The last successfully persisted snapshot remains authoritative. An initial-save failure starts no models and cannot promise a new audit artifact. This is an operational failure, not an exit-2 replay-eligibility refusal.
- **Historical identity gaps:** legacy judgments may lack identities or reliable judge-model provenance, especially errors. Preserve what exists and label what is unknown; complete current-attempt identity is still mandatory on failure.
- **Concurrent invocations:** simultaneous processes writing the same target remain outside the existing single-writer contract. This feature adds no cross-process locking or conflict merge. In-process selected-model concurrency remains bounded by `EVAL_CONCURRENCY`.

## Tests

Use injected-spawn fixtures in `eval/lib/run.test.mjs`, plus `eval/lib/records.test.mjs` and `eval/lib/report.test.mjs`. Inputs for the four outcome tests have no accepted-regression entries. No model calls run in CI or in the implementation's required validation.

| Scenario | Must hold |
|---|---|
| Cached pass and cached inconclusive refresh | Each selected model receives fresh LLM judging despite current hashes; no baseline/candidate replay; ordinary selection still reuses judgments |
| Passing refreshed judgment | Exit 0, active new verdict, prior/current snapshots, partial refresh report naming sample and models |
| Reproduced regression | Exactly one confirmation replay for each regressed model, matching fact reproduced, regressed exit 1 |
| Non-reproducing regression | Exactly one confirmation, inconclusive exit 1, unchanged saved outputs |
| Initial judge failure | Existing bounded judge attempts, error exit 1, prior pass retained only as history, full current identity in audit |
| Confirmation replay or judge failure | Error exit 1, available confirmation reply/judgment/error retained separately, no extra confirmation |
| Missing/stale/failed arm or model | Exit 2; zero calls; baseline, candidate, audit, and report bytes unchanged; include otherwise-promotable candidate and partial-model eligibility |
| Invalid invocation or intent; malformed record | No calls or artifact mutations; no audit rotation |
| Saved replies and scope | Baseline bytes and whole candidate output payloads unchanged, including edit trees, old mechanical data, extra model outputs; unselected samples byte-identical |
| Audit lifecycle | Repeated refresh contains only immediate predecessor/latest result; ordinary changed-input rerun preserves that snapshot; promotion excludes it; absent legacy metadata stays unknown; record-level judge model is not attributed to a historical judgment |
| Payload identity | Object-key order does not change `payloadSha`; array order and stored metadata/tree changes do; metadata-only changes leave the text hash unchanged |
| Concurrent settlements | At concurrency >= 2, overlapping completions retain both active judgments and both independent audit copies; no lost update or temporary-file collision |
| Failure before/after calls | Initial audit exists before first spawn; initial save failure starts no calls; initial/later save failure exits 1 and preserves report bytes, including when a subsequent save succeeds |
| Interruption | One model completes and another aborts: retain completed result and interruption error, prior evidence and identities, partial interrupted report, exit 130 |
| Incomplete attempt snapshot | Pre-call persisted result is valid JSON, explicitly incomplete and non-passing; no recursive history or prior active pass |
| Automation | A noninteractive caller completes without approval/adoption callbacks or user input; LLM stub responses drive judged-fact outcomes, not a human supplied verdict |
| Ordinary behavior | Existing retries, zero-call report preservation, full-target reports, pool behavior, and non-refresh abort tests continue to pass |

Implementation verification: run `node --test eval/lib/run.test.mjs eval/lib/records.test.mjs eval/lib/report.test.mjs`, then `npm test`, from the worktree. This changes harness code and operational docs, not skill/persona/prompt behavior; no new model-eval target or `intent.md` change is required. Regenerate shipped bins only if implementation changes their sources/dependencies under the existing package rule; do not change them gratuitously.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `eval/README.md` - explicit noninteractive recovery procedure, admission conditions, bounded audit retention, interruption semantics, and interpretation limits (operations and non-obvious rationale); `CHANGELOG.md` - recovery-operation entry under Unreleased with #64 (operations)
- Derived / memory docs invalidated: `README.md`, Evals - qualify newest-only records with the bounded explicit-refresh audit and retain its canonical guide link

Apply `reference/documentation-impact.md`, the brainstorming documentation-impact guideline. The docs-index small-corpus result is not evidence of no docs impact: direct recon found the canonical eval guide. No new standalone guide or AGENTS routing entry is needed.

In the guide, show the existing `## Expected to move` form `- sample/fact: holds -> fails - <reason>`. Explain that an "accepted variance" phrase is only free-text rationale, not a special parser token; the directional bullet is what makes that observed decline an intended change. Human acceptance of a regression does not establish harmless model variance. Refresh neither inserts these entries nor widens intent. Explain that changed prompt assembly changes replay inputs and requires ordinary regeneration, contradictory judgments require review, and refreshing remains LLM-driven without a human review/adoption gate. Review may be performed by the calling agent; it is not an interactive stage of this command.

Doc updates ship with implementation. Existing commands retain their meaning. Keep universal -> granular -> refresh spec links rather than rewriting an older successor link.

## Out of scope

- Automatic prose/structured-fact contradiction detection, judge stability research, prompt-size causation, or a promise that refresh is more accurate.
- Retry-until-pass, automatic acceptance, intent edits, human-entered judgments, interactive approval, or a separate adoption command.
- A new judge/model choice, changes to judge instructions, fact-level caching, target-wide/model-selective refresh, or stale-reply repair through refresh.
- Every-run history, unbounded refresh history, raw retry transcripts, cross-process locking, and forced-termination resume.
- Changes to the historical accepted-regression decisions from #63 or the decision-menu feature itself.

## Open questions

None. Judge disagreement remains a known limitation, not an unresolved implementation decision or a required human gate.
