# Skill-read telemetry and tuning recommendations

**Ticket:** #157
**Goal:** Show which skills and references a run read, how many bytes each contributed, and when recurring read volume supports a specific pi-gauntlet tuning recommendation.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** doc/specs/2026-09-18-gh-35-gauntlet-performance-telemetry-report.md, performance skill recommendation evidence and reply layout only; doc/specs/2026-09-26-council-telemetry-roster-assessment.md, sections 5 and 6 per-run output and reply layout only.

## Problem

Framing: kept (ticket #157). The ticket asks about the text a main-session read returned, not the text ultimately delivered to a model. Its example reports 553 KB across 32 files, eight over 27 KB, for a 33-line change. No trace, replay command, or reporter notes accompanied it (the issue body and empty first comments page were fetched). The figures are unverified motivation, not a threshold. A source-size lint (50,000 bytes / 2,000 lines) cannot tell whether one reference was read ten times. Read volume alone does not establish wasted tokens, cache behavior, time, or cost.

- In Pi 1.5.2, successive `tool_result` handlers can replace text or turn success into an error. For both direct and nested reads, `tool_execution_end` exposes the outcome after those handlers (`core/extensions/runner.js`, `pi-agent-core/dist/agent-loop.js`, `core/nested-tool-calls.js`). A ranged read can return a continuation notice. Count the final read result's text, not the enclosing script's output or what eventually enters model context. Nested call history does not retain successful bodies, so no later pass can recover those bytes. Bash, auto-loaded instructions, internal filesystem access and child sessions are not main-session read-tool results. Support at the advertised Pi floor is an open question below.
- The recorder in `extensions/telemetry.ts` already gates on parent sessions, enabled telemetry and run entry, buffers before binding, and maps no active phase to `unphased`. Its checkout path lookup can reject an installed skill; its spec/plan read handling has a different purpose and must continue. `extensions/lib/telemetry-record.ts` folds session accumulators explicitly and derives schema-1 phase fields. Its `parent_calls` list, unlike events subject to the 300-event cap, survives aggregation. The seal parses, re-derives and serializes that record before publication.
- The performance loader selects/deduplicates schema-1 runs, handles leg records separately, and groups shipped, non-truncated runs by repository and version. The CLI computes; the skill interprets the digest, not raw YAML. The existing main recommendation requires two shipped runs in a group; council's separate roster assessment requires five. The cache-write metric is not a file-read measure. The 17 local brainstorming records inspected had no read fields; neither the ticket nor the current skill supplies a measured baseline. Both the installed index and recorder/record/seal/CLI test entry points exist; the spec index found the predecessors above and the docs index returned no rows. Field survival is an implementation test, not an observed result.
- The manifest exposes `./skills` separately from extension entry points. The repo has nested skill Markdown such as `skills/brainstorming/reference/legs.md`; an extension package can have the same layout under its own directory. Installed paths need not belong to the run checkout. Anyone with access to the telemetry ref can read what is recorded.

## Acceptance criteria

Ticket #157, Acceptance Criteria, rows verbatim:

- [ ] After a run in which the main session reads skill and reference files in at least two phases, the run's telemetry record lists, per phase, each read's file path and bytes delivered. Skill and reference files are markdown files under a `skills/` directory.
  in-scope
- [ ] A qualifying read made while no phase is active is recorded under the existing `unphased` bucket.
  in-scope
- [ ] After a codemode script in the main session reads a qualifying file during an active phase, the telemetry record contains an entry under that phase with its path and bytes delivered.
  in-scope
- [ ] After a main-session read returns only part of a qualifying file, the entry records the bytes of text returned, not the file's size on disk.
  in-scope
- [ ] A second read of the same file in the same phase adds a second entry.
  in-scope
- [ ] `/skill:gauntlet-performance` prints, per run, the total bytes of skill and reference text the main session read, and lists each file once, ranked by the sum of bytes delivered across all its reads and phases, largest first.
  in-scope
- [ ] A telemetry record written before this change loads and reports as before, with no file section.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-157-skill-read-telemetry
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: run npm run build:bins, npm test and the explicitly selected gauntlet-performance samples in this leg's worktree; follow the repository's verification and release policy.
Rules: AGENTS.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: eval/README.md
Rules: doc/install-internals.md
Rules: .agents/skills/release/SKILL.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet-overrides.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/gauntlet-resume/reference/coordinated.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
Rules: AGENTS.core.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7
design: The recorder and phase record supply named read observations; the performance bin ranks them, and its skill uses qualifying runs for advice. All sources, tests, evals and documentation below belong to this leg.

## Design

Supersedes doc/specs/2026-09-18-gh-35-gauntlet-performance-telemetry-report.md, performance skill recommendation evidence and reply layout only.
Supersedes doc/specs/2026-09-26-council-telemetry-roster-assessment.md, sections 5 and 6 per-run output and reply layout only. No council assessment rule changes.

**Remove:** Nothing.

**Add:** Extend the existing components as follows; no new entry point, data source, opt-in flag, or cross-run comparison table.

1. **Capture.** In `extensions/telemetry.ts`, retain each main-session `read` call's input path and tool cwd by call ID in an entered, telemetry-enabled run, independently of spec/plan path lookup. Consume that ID once at `tool_execution_end`. If the final result succeeded and qualifies, append one entry in the phase active at completion (`unphased` between phases). A nested `read` has its own ID; ignore the enclosing codemode result even if the script echoes the text. Sum the UTF-8 byte lengths of the final result's text blocks, including any returned continuation notice, without adding separators or charging image/binary data. Do not stat or reread file content, or reconstruct reads from a transcript. Repeated and overlapping ranges are separate calls. Preserve existing plan-read binding behavior.
2. **Identity.** In `extensions/lib/telemetry-paths.ts`, normalize the input as the built-in read tool does before qualification or canonical lookup: handle the leading `@`, expand `~`, and resolve relative paths against the call's cwd. An `.md` path qualifies under its nearest lexical directory component named `skills`, including in an installed extension outside the checkout. A linked reference beside extension code but outside `skills/` does not qualify on that basis.

   The stored `path` is both the grouping key and the display path. Derive it without publishing machine paths or file contents:

   - Resolve the file and roots canonically. Only a file contained in the running extension's own canonical `../skills` directory earns `pi-gauntlet:skills/<path relative to that directory>`. The recorded version belongs to that extension, not to another checkout. Compare reserved keys exactly across runs; neither a package name nor a suffix proves ownership.
   - For other files, use `source:<root-digest>:skills/<relative-path>`. Use the canonical skills root and canonical relative path when containment is known, so aliases converge. For a link leaving the opened root, use the target's nearest canonical `skills` ancestor if it has one; otherwise use the opened root's digest and the lexical skills-relative path. A link out of the trusted root still counts, but not under a reserved key.
   - The digest is the lowercase hex SHA-256 of the UTF-8 canonical root path. If canonical lookup fails, use `source:lex-<root-digest>:skills/<lexical-relative-path>`, hashing the normalized absolute lexical skills root instead. Recompute the same discriminator on resume; do not store the underlying root or infer equivalence from suffixes.

   For the same suffix, the running package yields `pi-gauntlet:skills/brainstorming/reference/legs.md`; a different pi-gauntlet checkout yields `source:<checkout-digest>:skills/brainstorming/reference/legs.md`; another extension yields `source:<extension-digest>:skills/brainstorming/reference/legs.md`; failed lookup yields `source:lex-<lexical-digest>:skills/brainstorming/reference/legs.md`. The angle brackets stand for digests, not package names.
3. **Record and coverage.** Keep schema 1. Add optional `PhaseAcc.skill_reads: {path: string; bytes: number}[]` with nonnegative integer byte lengths to the session and derived phase payloads in `extensions/lib/telemetry-record.ts`, outside capped events. While an entered run has no bound record, send qualifying reads to the run's pending phase list even if a matching skill started a leg accumulator. Fold pending reads into the bound record once. A truly standalone leg is not a run. Reset discards unbound observations.

   `derived.skill_read_coverage` distinguishes a measured zero from missing data:

   | Recorder event | Coverage |
   |---|---|
   | First bind of a new record | Set `complete` even with no reads if the recorder saw live `start brainstorm` with capture enabled and no intervening gap or pending-data loss. Otherwise set `partial`, including entry learned by replay or reconstruction that cleared pending reads before bind. |
   | Same-record resume | Retain known coverage. For an existing unmeasured record, leave the field absent until the first new qualifying observation (including one folded from pending), then set `partial`. |
   | Rebind to a different record after earlier reads went to the previous record | Do not move those reads. Mark the new binding `partial`; for an existing unmeasured record, apply the first-observation rule above. |
   | Capture gap observed while entered, including disabled telemetry | Remember the gap without recording disabled reads or writing records while disabled. On re-enable, downgrade measured coverage to `partial`, or carry the gap to first bind. An unmeasured legacy record stays absent until its first new observation. |

   Never upgrade `partial`. Preserve phase entries and known coverage through fold, derive, serialization and seal. Parse and seal do not synthesize coverage for old records; the seal uses the shared model without a parallel counter.
4. **Digest.** Extend `loadRecord` in `src/bins/gauntlet-performance.mjs` and the run renderer in `src/bins/performance/runs.mjs`. After corpus selection and deduplication, combine each measured run's derived phase lists, including `unphased`. The JSON run row gains optional `skill_reads: {coverage, total_bytes, files: [{path, bytes, reads, share}]}`. Share is the file's byte sum divided by all qualifying bytes observed in that run, including other packages. Rank files by descending byte sum, then portable path ascending. Do not change leg, cost, council, or version aggregates.

   After the runs table, text uses this block for each measured run (synthetic examples). Print the full run ID and the same rows as JSON; round percentages to one decimal place in text only.

   ```text
   skill reads: run=6320d345-5166-45f1-b7b0-31bc5f232854 coverage=complete total_bytes=16000
   path                                                bytes  reads  share
   pi-gauntlet:skills/brainstorming/reference/legs.md  12000      3  75.0%
   pi-gauntlet:skills/brainstorming/SKILL.md            4000      1  25.0%

   skill reads: run=44418c32-9395-4db4-b24f-d53090163b87 coverage=partial total_bytes=3000
   path                                                bytes  reads   share
   pi-gauntlet:skills/brainstorming/reference/legs.md   3000      1  100.0%
   ```

   A partial total and its shares describe only observed bytes. A complete empty run prints its header with total 0 and no file rows. At total 0 omit percentages, even for a recorded zero-byte read (`share: null` in JSON). A legacy run gets neither a text block nor a JSON key.
5. **Interpretation.** In `skills/gauntlet-performance/SKILL.md`, if bash reports truncated CLI output, read the saved CLI output in bounded pages through the end before comparing or rendering rankings. The displayed tail alone is not the digest; do not open raw telemetry YAML. After Cornerstones and before the independent Council assessment, show the full ID, coverage, total and every ranked file row of every measured run. Do not restate the rest of the digest or silently take a top-N. Preserve the marker, menu, report-write authorization and sample-too-small rule.

   Keep one recommendation. When the same exact `pi-gauntlet:skills/...` key accounts for an unusually large share and a material byte volume in at least two distinct complete, shipped, non-truncated runs with the same known repo and pi-gauntlet version, compare their rankings. If the pattern supports a specific tuning action, lead the single recommendation with that action and its example run. Identify both supporting runs; quote the file's bytes and share in each. The ordinary 1-3-number cap does not apply to file advice. Include other evidence only if it supports the same claim. Use judgment, not a fixed share, byte or rank cutoff. For example, check callers that repeatedly load the same long reference; counts alone do not prove redundant reads because ranges can differ. Without actionable file evidence, leave the rankings visible and use the normal recommendation rules, including sample-too-small. Never apply the tuning automatically.
6. **Delivery and checks.** Extend the existing test files and skill eval named below, the three product docs in Documentation impact, and the changed generated bundles under `bin/` via `npm run build:bins`. For the new eval samples add `case.md` and `expected.md`, update the target intent, and retain sample-scoped evidence in the existing results/report structure. Use the existing harness and scope each model invocation to one named sample. Keep the 1,000-word eval cap on the selected fixture replies; it is not a product limit on file rankings. No new settings.

**Actions authorized by final spec approval.** Run configured flow agents via `subagent` with the spec, acceptance rows, code/diff and test evidence for the selected engine and reviews. If dependencies are needed, run `npm install --no-audit --no-fund` in the worktree with an isolated installer home, as CI does not require a lockfile. Run the existing scoped tests, `npm run build:bins` and `npm test` in the worktree; use synthetic records/local Git fixtures for seal and reporting. Run `node eval/run.mjs gauntlet-performance <sample>` only for `recurring-skill-reads`, `isolated-skill-reads`, and `gate-line-first` with the target's baseline/candidate instructions, synthetic cases and expected facts; this includes configured paid replay and judge calls. Spec approval authorizes these named actions across seed, rows, repairs and finish, without per-step prompts or a flow-wide count. Any other needed paid or external action requires separate explicit authorization. Delivery choices retain their existing gate.

## Errors and edge cases

- Failed reads, unrelated paths, standalone legs, disarmed/disabled sessions, and child sessions produce no entries; shell, extension-internal filesystem reads and automatically loaded skill text have no qualifying tool result. Capturing a skill read does not bind or reopen a record. Reset/seal clears outstanding call IDs so a late completion cannot leak into the next run.
- Source resolution must not break the original read, falsely credit pi-gauntlet or leak a machine prefix. Failed canonical lookup uses the lexical digest namespace in Design 2; do not claim alias equivalence without evidence.
- Unmeasured is not zero. Unknown/malformed coverage, a malformed list, or an invalid path/byte entry cannot make an otherwise valid schema-1 run disappear or provide recommendation evidence. For an invalid measured block omit that run's file section rather than guessing totals. Do not change the normal report for unmeasured historical records. A one-off, a partial run, or recurrence only in unrelated packages, repos or versions does not qualify as tuning evidence.

## Tests

- AC 1: a skill in brainstorm and its reference in verify retain their own paths, bytes and phase - `extensions/telemetry.test.ts`, two-phase reads.
- AC 2: an entered run's between-phase read appears under unphased - `extensions/telemetry.test.ts`, between phases.
- AC 3: a nested read with its own call ID counts once in the phase active at completion, even if the script discards or echoes the text. A later `tool_result` handler that shortens text changes the counted bytes; one that changes success to error leaves no entry. Exercise the final event for direct and nested reads - `extensions/telemetry.test.ts`.
- AC 4: a ranged read whose final text includes multibyte text and a continuation notice counts those UTF-8 bytes, not source size - `extensions/telemetry.test.ts`, partial text.
- AC 5: identical consecutive reads append two entries - `extensions/telemetry.test.ts`, reread.
- AC 6: one row per distinct file in both outputs, exact total, descending byte sum, read count, stable tie break, correct share including unphased/other-package bytes - `bin/gauntlet-performance.test.mjs`, per-run ranking.
- AC 7: legacy-only text/JSON remains unchanged, and mixed records omit file data only for the unmeasured run - `bin/gauntlet-performance.test.mjs`, legacy fixture.
- `extensions/lib/telemetry-paths.test.ts`, `extensions/telemetry.test.ts`: qualify a nested extension's `SKILL.md` and reference using the nearest lexical `skills` ancestor; exclude a reference outside `skills`. Relative, `@`-prefixed, `~`-expanded, resolved and symlink spellings of the same installed file converge. Only the running package earns the reserved key; a different checkout, another extension with the same suffix, an escaping symlink and a lookup failure do not. Distinct roots stay distinct. A fresh read of a third-party file after resume reuses its pre-resume opaque key. No stored path contains the machine prefix or file body.
- `extensions/telemetry.test.ts`: enter brainstorm, read `skills/shape-ticket/SKILL.md` before bind, then bind. The run gets that pending read once even with a leg accumulator; the same read in a standalone leg produces no run entry. Reset does not leak; plan reads still bind. Errors, binary-only results, disarmed/disabled or child sessions, unrelated tools and internal filesystem reads without a read result add nothing.
- `extensions/lib/telemetry-record.test.ts`, `extensions/telemetry.test.ts`, `bin/gauntlet-telemetry-seal.test.mjs`: live entry and first bind with no reads gives a complete zero. Reconstruction before first bind gives partial. An enabled-to-disabled-read-to-enabled sequence writes nothing while disabled and seals as partial; later reads never restore complete. Same-record resume preserves measured coverage; legacy resume without a read stays absent and the first new read makes it partial. Rebinding after reads went to another record does not claim complete. Fold, reload and seal retain every observed entry exactly once, including beyond the event cap.
- `bin/gauntlet-performance.test.mjs`: complete empty, partial, legacy and malformed records; full run IDs, coverage and rounded text shares in the format above, no percentage for a zero denominator. Filtered and duplicate corpus entries do not invent evidence or disturb run reports.
- `eval/gauntlet-performance/samples/recurring-skill-reads`: supply a synthetic truncated bash result and bounded pages of its saved digest. One supporting run is only on an earlier page; the other is in the visible tail. The single recommendation uses the recurring trusted reference even with a competing signal, cites each run's bytes and share, and proposes one supported action. The reply includes all measured runs and file rows, council and menu; no raw records are needed.
- `eval/gauntlet-performance/samples/isolated-skill-reads`: a one-off spike, unmeasured/partial or mismatched peers, and a similarly named third-party file do not justify file advice. Include a distinct pair of otherwise eligible runs where the same trusted file accounts for 8 of 8 bytes in each. Show both 100.0% rankings without recommending tuning: the byte volume is immaterial. These are fixture values, not cutoffs.
- Legacy reply and menu still start with their prescribed marker - `eval/gauntlet-performance/samples/gate-line-first`. Run these three selected samples, not all targets.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` (bytes measure final tool-return text, not model input; coverage and the published path trust boundary); `README.md` (Performance digest: what complete/partial rankings mean and when comparisons support advice); `CHANGELOG.md` (user-visible reporting contract, Unreleased).
- Derived / memory docs invalidated: none

Selection follows `reference/documentation-impact.md`. The performance skill is implementation surface.

## Open questions

- **Does Pi 1.5.0 expose finalized direct and nested `read` results at `tool_execution_end`?** Probe in the worktree: `timeout 30 rg --max-count 2 --max-columns 300 --max-columns-preview --hidden --no-ignore -g '!.git' -g '!bin/*.mjs' -n '(1\.5\.0|@earendil-works/pi-(coding-agent|agent-core)@|tool_execution_end)' .`. A bounded follow-up `rg` over `README.md`, `package.json`, the #132 and #133 specs and `eval/gauntlet-resume/tool-traces/README.md` was inconclusive: the README advertises 1.5.0; the evidence for that version covers intermediate nested hooks or blocked calls, not successful direct and nested reads after result handlers. Inspect the 1.5.0 distribution of `@earendil-works/pi-coding-agent` (`dist/core/nested-tool-calls.js` and the extension event bridge) and its matching `pi-agent-core/dist/agent-loop.js`, or supply a version-identified trace with final content and status for both call types. The user can supply this evidence at the gate; otherwise the first plan task that obtains it settles the question through brainstorming's amendment path. The answer settles AC 3 capture and its floor test, which runtimes may be marked `complete` and used for advice, and any measurement-specific minimum in `README.md` and `doc/configuration.md`. If the floor cannot supply these results, document the minimum verified measurement runtime and do not mark unsupported runs `complete`; do not infer a project-wide floor change.

## Out of scope

Historical backfill, model-context or token/cost attribution by file, filesystem-wide instrumentation, a read budget, automatic slimming, a new input flag, a separate cross-run table, and changes to council assessment or external packages. No replay of private consumer data.
