# shape-ticket eval

Tests the draft and AC integrity gate render: multi-repo tickets attribute AC rows to repo groups, and repaired rows retain their measurements without naming a verification venue.

| Skill file | Slice |
|---|---|
| `skills/shape-ticket/SKILL.md` | `### 4 - Draft` through before `## Roast` |

The two original synthetic text samples cover create-mode repo attribution and repair-mode venue removal. Their slice omits Gather and `reference/overlap-check.md`. The third sample, `closed-concern-additions`, alone loads `skills/shape-ticket/reference/overlap-check.md` through a leading `bundle+:` line in its case. It supplies a reviewed completed ticket and compatible parity, empty-input, and documentation additions without a distinguishing new run/version. It permits useful existing-ticket additions or no write, preserves uncertainty about a new regression, and retains create-anyway as an override. This no-tool target proves supplied-evidence proposal wording and drafting/AC regressions, not live retrieval or tracker writes.

Run `node eval/run.mjs shape-ticket --base 9287ab3` against the pre-fix reference text baseline; the matching `--baseline-only` form captures that baseline before the owner-sentence edit. A correct baseline is a guard, not a required failure. The candidate intent binds the unchanged bundle-free draft assembly, while the new sample's record hashes include its reference bundle. Process, commands, and record schema: `eval/README.md`.

Keep the strict historical diagnostics below separate from the first-version delivery review. Historical corpus, labels, scores, and nonzero outcomes remain unchanged. The first-version bar uses source review of four saved overlap responses, clear duplication fixes, this focused regression, and package checks; compatible useful additions do not need perfect no-write wording. The text-target `report.md` records this focused evidence separately from `replay/report.md`, the historical report.

The `member-file-only` sample alone bundles the complete `skills/shape-ticket/SKILL.md` and selects Roast item 2 over the replay's default Draft stage. It checks paired file-only member outputs on initial/retry tasks, cheap `:low` effort, structural quorum, unchanged inline chair and parent-owned split-axis handling. Existing sample bundles and historical replay evidence remain separate. This sample proves prescribed dispatches, not actual file transport or tracker writes.

## Read-only full-skill comparison

`replay/` is a checkout-only history comparison, not a text sample target or a general eval kind. It loads the complete skill and referenced instructions from git for the baseline and the working tree for the candidate. Each cell sends exactly one scenario prompt. Only an instruction-map reader, read-only fixture tracker, controlled clock, and always-unavailable subagent stub are active. Built-in tools, MCP, extensions, and resource discovery are isolated; each cell uses fresh OS scratch cwd/agentDir and in-memory state.

Run deterministic tests without model or network requests, including offline construction/disposal of the installed SDK:

```sh
node --test eval/shape-ticket/replay/tracker.test.mjs eval/shape-ticket/replay/run.test.mjs
```

The historical comparison command is:

```sh
node eval/shape-ticket/replay/run.mjs --suite history --cases "$OVERLAP_HISTORY_MANIFEST" --reps 1 --base c10ba7c5eaf867280a2b21d70d612c2579ecafcf
```

`OVERLAP_HISTORY_MANIFEST` is an operator-supplied path with no default. Keep the immutable private manifest outside `eval/shape-ticket/replay/`. The CLI hashes raw file bytes before SDK construction and requires `e788684e4755609836de92d24e67ccb7b76172f5ffd357c965fcb3e44b54a85d`. Whitespace changes fail the binding. The CLI supports history only and defaults to one repetition. Complete acceptance requires 16 completed cells (four cases, two replay models, two arms), eight passing candidate cells, valid judgments, and no paired baseline-fact regression. `--only <case>` and `--baseline-only` are partial diagnostics, never acceptance evidence; nonstandard repetitions do not establish acceptance. `--out`, `--base`, and `--pi-package` select output, baseline, and SDK paths.

The comparison requires model auth and locally resolvable models from `eval/lib/models.mjs`. Model prompts make authenticated calls; offline tests do not. SDK construction uses `ModelRuntime.create({ allowModelNetwork: false, refreshOnCreate: false })`. Set `PI_PACKAGE` for the offline test or supply `PI_MANAGED_INSTALL_ROOT`: resolution reads `current-version` and `releases/<version>/node_modules/@earendil-works/pi-coding-agent`. The CLI can override this with `--pi-package`; no runtime dependency is added.

## Case contract and fixture behavior

Cases contain `id`, `tracker`, `prompt`, `tickets`, and runner-only `expected`. Historical labels require `settled: true`, identifiable allowed `outcomes`, and nonempty judged `facts` (`id`, `text`). Optional `dialogue` is accepted only when empty. Only `caps`, `search-before-read`, `no-live-writers`, and legacy `approved-payload` invariant names are accepted before factories run. The inventory explicitly marks `approved-payload` as not evaluated. There is no selection judge, approval, continuation, source-change simulator, returned-reference interpretation, or mutation ledger. Clarification-only and unknown recommendations fail rather than count as completion.

Tickets contain `id`, `url`, `title`, `body`, `comments`, `metadata`, `workflow`, and `revision`; comment bodies and fixture-defined workflow meanings remain source evidence. Optional `documents`, `faults`, and private provenance remain outside instructions. Search lowercases ASCII tokens, requires every query token, filters fixture workflow meaning, and paginates stable order with a decimal cursor. It returns only ID/title/reference. An undiscovered source cannot be read except when explicitly named in the prompt. GitHub fields are `body/workflow/url`, Linear fields are `description/state/url`, and custom fields are `content/phase/reference`. These mappings and lexical matching do not emulate native search or establish indexed fields.

Reads honor `bodyBytes`, `commentLimit`, and `linkLimit` and disclose truncation; omitted limits return full fixture material. Returned links expose fixture documents for `read-document`. Reads never fetch a network. Faults expose unavailable search/body search, unsupported read operations, unreadable sources, and deterministic discovery time advancement. Raw create/update/comment/relation attempts are rejected and traced without modifying source bodies, comments, or metadata, even if supplied approval arguments.

Budgets remain detectable rather than automatically enforced: six search requests, 20 results/page, five detailed candidates, 120 seconds, 50KB/document, 200KB aggregate material, 50 comments, and 20 distinct fetched linked documents. UTF-8 body and comment content bytes count; metadata and transport envelopes do not. Link previews and repeated fetches do not add distinct documents. An in-flight deadline crossing records `elapsed-overrun`. Every case carrying `search-before-read` requires a successful search response with an `items` array, including an empty array; missing, unsupported, or failed searches do not qualify. Candidate cases additionally check returned-hit-before-successful-read ordering. Final text is graded independently for the recommended ticket action and every frozen fact. A clearly recommended new-ticket proposal is create even when not-ready or blocked on evidence; a compatible existing-ticket update or evidence comment is enrich even when blocked on evidence. Park defers the ticket-action decision itself without recommending create or enrich, and no-write intentionally leaves already-covered work unchanged. Clarification alone or an ambiguous menu without an identifiable recommendation is unknown; the first option does not imply recommendation. Supersede/proceed retain their conflict meanings, and recording unresolved evidence does not automatically mean park. Each frozen fact is judged from its own statement, supplied input, and observed output/tools without the expected recommendation enum. Readiness blockers alone do not fail concern identity; explicit evidence and contradiction facts still bind. The shared ten-minute deadline includes prompting and judging; failure paths abort/dispose and preserve scratch diagnostics.

## Artifacts and proof limits

Default output is fresh OS scratch. `report.json` checkpoints raw manifest hash, instruction hashes, model/thinking values, repetitions, elapsed time, available numeric usage, completion, acceptance, and invariant inventory. It excludes private case/fact IDs, prompts, source strings, outputs, and diagnostics. `raw-traces.json` and per-cell `trace.json` retain private evidence and must not be committed. Failure and incomplete reports persist; progress prints only cell number, arm, repetition, and status.

Deterministic tests prove probe behavior and fail-closed routing, not skill behavior or semantic judge accuracy. The revised rubric classifies ticket action separately from readiness and requires valid search on every search-invariant case. Old sixteen-session scores are not regraded; future comparison results must identify their use of this revised rubric. The later paired comparison provides model evidence only for frozen current candidate snapshots, not historical-time backlogs. No simulator proves approved writes, atomic uniqueness, or locking. Native recall and collection limitations, unchanged frozen bindings, and original collection cost remain in `replay/selection.md`.
