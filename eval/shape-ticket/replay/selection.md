# Frozen historical selection

Four independently labeled curated cases are frozen before either replay arm. Private inputs and every earlier proposal remain private; only the final hash identifies the runtime manifest.

| Synthetic alias | Stratum | Incoming kind | Allowed outcome | Review confidence |
|---|---|---|---|---|
| history-a-overlap | Consumer A overlap | Bug | no-write | High on identity; minor extras unverified |
| history-a-independent | Consumer A independent near-match | Feature | create | Medium-high |
| history-b-overlap | Consumer B overlap | Bug | no-write | High |
| history-b-independent | Consumer B independent near-match | Bug | create | Moderate-high; weaker umbrella alternative retained |

All four labels are settled by a fresh independent read-only source reviewer shown only a source-only input: asks and candidate snapshots, with neutral case and ticket ordering and no expected labels, proposed rationale or case strata. The reviewer saw no skill changes or candidate outputs. The earlier non-blind confirmation remains historical evidence, not the claimed blind judgment. Both overlap labels are no-write; A-overlap retains uncertainty about minor unverified extras, not permission to enrich terminal work. B-independent retains a weaker umbrella-enrichment interpretation despite its settled create label. Settlement does not remove residual uncertainty.

Both overlap cases include the known covering candidate. The independent feature case contrasts a genuine incoming capability ask with a delivered neighboring feature, rather than treating delivered work as missing. Candidate pools contain 3, 5, 3 and 5 current snapshots respectively, with plausible neighboring concerns. Each incoming ticket is excluded from its own pool; all four prompts contain no candidate IDs or URLs. Substantive prompts, tickets and provenance remain unchanged; only source labels are corrected before trials.

## Frozen replay binding

| Setting | Frozen value |
|---|---|
| Final manifest SHA-256 | e788684e4755609836de92d24e67ccb7b76172f5ffd357c965fcb3e44b54a85d |
| Pre-change public baseline | c10ba7c5eaf867280a2b21d70d612c2579ecafcf |
| Replay models | anthropic/claude-opus-5-5; github-copilot/gpt-6.1-sol |
| Judge model | anthropic-fable/claude-fable-5-1 |
| Thinking | medium |
| Repetitions | 1 per arm/model |
| Model settings source | eval/lib/models.mjs |
| Blind report SHA-256 | ec3de1c939de845935f89cd84f407a6b65784e417ead12fb6cf119a8d7af60c8 |
| Blind source input SHA-256 | f1296e9476a3aee2d5a1b728caa37d00cddb4e57eeca81ce23e71d402624c096 |
| Blind alias mapping SHA-256 | 25c5823bc1de71aebbac0061a164cf8bbe9d476b6fc93ec77a5e9becdaca3c93 |

The private read-only manifest and binding supersede the runtime selection while preserving the old frozen manifest and binding. They record blind input, labels and alias mapping hashes, native probe evidence, incoming snapshot hashes/revisions and unchanged embedded candidate snapshots. A-overlap narrows from no-write or enrich to no-write; all four labels remain settled. This is a pre-trial source-label correction. The selection record contains prepared inputs, not candidate outputs or replay results.

## Preparation and native capability

Preserved request records total 7 selection searches and 17 detailed fetches. Including both separately preserved native probes gives 9 searches and 19 detailed fetches; local help, version and usage captures are not retrieval calls. The human authorized the bounded correction. This record does not claim that the initial preparation allowance held. No sweep or export was performed, and production discovery limits are unchanged.

GitHub demonstrates one specific native body-field retrieval with a fetched known hit whose title lacks the queried term. The prior incidental Linear selection search did not establish body indexing. A new dedicated bounded Linear probe returned exactly the known ticket, and a separate fetch confirmed the queried term in its current full body but not its title or returned comments. This is positive non-title retrieval for one case, not proof of body indexing: full-text help does not enumerate indexed fields, and hidden or unreturned fields, comments and attachment text remain unknown. Linear body-index attribution remains inconclusive; neither probe guarantees full-body coverage or whole-backlog recall. The dedicated probe adds one search and one fetch to the prior 8/18 total. No native calls were repeated during this correction. The two source consumers share a Linear workspace; the GitHub capability demonstration is not a second source-corpus validation.

## One-turn comparison

Supply `OVERLAP_HISTORY_MANIFEST` as an operator-owned immutable path outside `eval/shape-ticket/replay/`; it has no default. The runner checks its raw bytes against the final manifest digest before constructing sessions.

```sh
node eval/shape-ticket/replay/run.mjs --suite history --cases "$OVERLAP_HISTORY_MANIFEST" --reps 1 --base c10ba7c5eaf867280a2b21d70d612c2579ecafcf
```

Each cell sends one prompt and grades the final recommendation and all frozen facts. Complete acceptance requires 16 cells, eight passing candidate cells, and no paired baseline-fact regression. Optional `--only <case>` or `--baseline-only` runs are partial diagnostics, not acceptance evidence. The report records instruction hashes, raw manifest hash, frozen model/thinking values, repetitions, elapsed time, available usage, completion, and invariant inventory. `approved-payload` is explicitly not evaluated; the read-only boundary rejects and traces writes rather than simulating approval or mutation. Deterministic probes establish harness behavior only. This record does not assert a live comparison has run.

## Interpretation limits

These are historical asks re-filed against frozen CURRENT snapshots, not historical-time backlog reconstruction. One independent bug incoming is actually completed and deliberately withheld from its own pool: create describes this prospective corpus exercise, not a recommendation to open a duplicate live ticket. Independent feature comments are preserved in private source review, and its prompt retains a dangling attached-plan pointer.

Create means absence of a covering concern in the bounded candidate pool, not across the whole backlog. Curated examples in a shared workspace cannot establish whole-backlog recall or general search quality. Incoming-only comments not projected into a prompt are not extra evidence available to that replay. Confidence and corpus limits survive settlement. Raw source material, source identifiers, source terminology and private locations remain outside this public record.
