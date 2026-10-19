# Council outputs to files, apply step moves to a dispatched applier

**Goal:** The main loop never ingests a member critique or the chair report; member and chair dispatches return only a saved-file reference, a fresh `spec-council-applier` persona (main loop's model and thinking) decides and applies the chair's clusters and returns the audit, and the main loop re-reads the spec before the unchanged user gate.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Supersedes:** `doc/specs/2026-05-31-spec-council.md`, "Separation of powers" parent-as-executor clause and the member/chair dispatch shape only; `doc/specs/2026-09-18-council-grounding-amend-approval.md`, placement of the probe-before-apply step only (the probe rule itself is unchanged, it runs in the applier instead of the main loop).

## Problem

`skills/roasting-the-spec/SKILL.md` step 1 dispatches members with `output:` and no `outputMode`. In pi-cohort parallel mode `runs/foreground/attempt-finalization.ts:285-287` sets `finalOutput = fullOutput` unless `outputMode === "file-only"`, and `aggregateParallelOutputs` (`runs/foreground/subagent-executor.ts:1826-1837`) joins every member's full text into the tool result. The skill forbids the main loop from reading those files ("Do not read these files' findings content yourself", line 56) while the dispatch hands it their content: across 166 chair runs on this machine the member text landing in the main loop was 25.7 KB median, 219 KB max. The chair report (4.9 KB median) is ingested by design, and the main loop then applies every cluster itself: every parsed audit shows applied == clusters (653 applied, 0 deferred, 2 rejected). The advocate step filters nothing, and all of this text - member critiques, chair clusters, apply narration - stays in the parent's context through plan, implement, and verify.

Premises checked against the source:

- `outputMode: "file-only"` is a per-task field in parallel `tasks[]` (pi-cohort `extension/schemas.ts:311`, top-level single-mode field at `:216`); it requires `output:` (`runs/shared/single-output.ts:109-112`). The result text per task becomes `Output saved to: <abs path> (<size>, <N> lines). Read this file if needed.` - the "read this file" invitation is harness text, and the skill overrides it.
- A persona with `bash` that writes its own output file does not fight the harness: `resolveSingleOutput` (`single-output.ts:141-178`) stats the path before the run and, when the child changed it, reads the file as the output; otherwise it persists the child's final text. Members already write their files because `output:` injects a `**Output:** Write your findings to: <path>` instruction. The chair has no `output:` today, so adding one injects the same instruction; a child-written file wins over the emitted text, so the chair file must hold the complete report.
- On a non-zero exit or a save error with no file on disk, both single mode (`single-output.ts:193-203`) and parallel mode (`attempt-finalization.ts:285-287`, no `savedOutputPath`) return the child's text inline regardless of `outputMode`. Closing that path needs a pi-cohort change; see Errors and edge cases.
- `reads:` is applied only in parallel and chain mode (`buildChainInstructions`, called from `runs/foreground/subagent-executor.ts:1425` and `runs/foreground/chain-execution.ts:234,1073`), where it prefixes `[Read from: <paths>]` to the task (`shared/settings.ts:323-327`); single-mode dispatch ignores it. The chair finds the member files from the paths listed in its task text, which the skill already requires. The skill's "injects their contents" wording at line 113 is wrong and is corrected by this change.
- `extensions/telemetry.ts:649-655` (`onCouncilResults`) parses chair clusters with `parseChairReport(textOf(content))` from the chair's inline tool result; a file-only chair makes `parsed` undefined and `derived.council` silently disappears. `onCouncilAudit` (`:659`) runs from two sources: the `git ... commit` bash command during the brainstorm phase (`:761`) and assistant text blocks (`:780`). `deps.fs.readFile` is injected (`:32`, `:63-65`).
- pi-cohort resolves a child's model as dispatch `model:` ?? persona `model` (frontmatter, else `agentOverrides` fill, `agents/agents.ts:618-626`) ?? parent model, and thinking as persona `thinking` ?? parent thinking (`runs/foreground/execution.ts:700`, `runs/background/async-execution.ts:488-491`, `shared/types.ts:829-832`).
- pi-cohort's chain summary (`buildChainSummary`, `shared/formatters.ts:105-137`) carries a status header and the artifacts dir, not step outputs; chain mode has no equivalent of the council's per-stage structural probe, targeted member retry, or chair retry.

Framing: kept. The scout's objection - the main loop applies because only it holds the human input and fetched tickets - names no alternative: both already travel to members and chair as the `Human input` block, and the 653/0/2 record shows the main loop never used that context to filter.

## Acceptance criteria

none - no ticket

## Design

### Member fanout returns references only

`skills/roasting-the-spec/SKILL.md` step 1 and `skills/shape-ticket/SKILL.md` Roast item 2 add `outputMode: "file-only"` beside `output:` on every member task, including the targeted retry (which reuses the task verbatim). The parallel tool result is one saved-file line per member. The structural probe, targeted retry, and quorum rule already judge the files on disk and are unchanged. The skill states that the harness's "Read this file if needed" line does not apply: the parent runs the structural probe (existence plus header regex) and never reads member findings or the chair report. A member that exits non-zero with no file on disk still returns inline (see Errors and edge cases).

### Chair returns a reference only

The chair dispatch in `roasting-the-spec` gains `output: "<tmpdir>/chair.md"` and `outputMode: "file-only"` and drops the dead `reads:` key; the member paths stay listed in the task text. `agents/spec-council-synthesizer.md` gets two factual corrections: its input sentence says member critique paths are supplied in the task and must be read directly, not injected by `reads`; its output section says the report goes to the output path named in the dispatch, complete and identical to what it would emit (the harness's injected `**Output:**` instruction names the path; an acknowledgment or partial file replaces the report, so the file is the report). Tools, `thinking: xhigh`, and the `consensus:/lean:/clusters:/resolved:` contract are unchanged. The chair's usability test (`^consensus:` and `^lean:` lines) moves from the result text to the file at that path; the retry ladder (unreachable configured model -> inherited model once; wedge or unusable -> same model once; second failure aborts the council to the gate) is unchanged. shape-ticket's chair stays inline (its parent applies to an in-context tracker draft and scans member files for `split-axis:` itself); shape-ticket's "via `reads`" wording for its chair is corrected the same way.

### New persona `agents/spec-council-applier.md`

Frontmatter: `name: spec-council-applier`; `description` as a routing label ("Applies a spec-council chair report to the spec under review and returns the audit. Dispatched by the roasting-the-spec skill; not for direct dispatch."); `tools: read, grep, find, ls, bash, edit, write`; `defaultContext: fresh`; `inheritProjectContext: true`; `inheritSkills: false`; `completionGuard: false`; `systemPromptMode: replace`. No `model` and no `thinking` key, so both resolve to the parent's; no preset `agentOverrides` entry ships for it. An operator may pin either through `subagents.agentOverrides['spec-council-applier']`.

Body (moved out of `roasting-the-spec` step 3, same rules, imperative voice):

- Inputs named in the task: the problem statement (the same one members and the chair received), the spec path (the only file the persona may edit), the chair file path, the usable member file paths, the worktree path, the `Human input (verbatim; off-limits for over-spec)` block (the authoritative scope boundary), the fetched external context when brainstorming fetched any (ticket body and comments from the gather draft's `## External context`, with the ticket reference), the coverage line, and the `DOCUMENTATION_IMPACT_GUIDELINE` path with the same "not an external reference" sentence members get.
- Read the chair file. For each cluster decide `apply`, `defer` (name where it belongs), or `reject` (one-line reason), on scope grounds against the human input; never suppress a cluster. Member files are read only to recover the cited probe of a `grounded` cluster for its audit line; they are never a second adjudication.
- `hypothesis` clusters (and untagged clusters, read as `hypothesis`) that assert data shape, ordering, or semantics are applied only after one bounded probe: one `rg --max-count` under `timeout 30` over the worktree and its docs, config, and script directories; at hand -> one read-only check; confirmed -> apply as fact; anything else -> one `## Open questions` entry per artifact (create the section if absent) with the probe, outcome, obtain-hint, and the settlement path (user at the gate, or the first plan task that obtains the artifact via brainstorming's amendment path). Never fetch, build, or run the proposed change.
- `external-ref:` clusters: inline when the human-input block or the fetched external context carries the reference; otherwise `defer` with `-> user supplies at gate`.
- `over-spec:` clusters decided `apply`: delete or shrink the quoted clause and any acceptance-criteria or testing-approach line that exists only for it; audit line `-> cut (was adds: M files / N tests / K ACs)` or `-> shrunk to <replacement> (was adds: ...)`.
- Never cut, shrink, flag, or edit the `**Amend-grant:**` header line; never edit any file other than the spec path.
- Final message is the audit and nothing else: optional `Coverage:` line copied from the task, then `Applied:` / `Deferred:` / `Rejected:` lists in the existing grammar (`[<severity>] <cluster> — raised-by: [<slugs>] -> <edit> (grounded: ...)` | `(probed: <check> - <result>)` | `-> open question (...)`; `[<severity>]` and `raised-by: [...]` copied verbatim from the cluster line; `Applied: none` etc. when a list is empty).

### Applier dispatch in `roasting-the-spec` step 3

Before the dispatch the main loop snapshots `cp <spec> <tmpdir>/spec.before.md` and `git -C <wt> status --porcelain > <tmpdir>/status.before`. Step 3 is one single-mode dispatch, foreground, no `model:`, no `output:`, with the chair's control block (the applier reasons and edits; the member block's 600s kill was sized for a read-only critique):

```
subagent({
  agent: "spec-council-applier",
  async: false,
  cwd: "<abs worktree path>",
  control: { needsAttentionAfterMs: 300000, inFlightSilenceCeilingMs: 600000, inFlightSilenceKillMs: 900000 },
  task: "Problem statement: <paste>. Spec: <abs path>. Chair report: <tmpdir>/chair.md. Member critiques (probe evidence only): <usable member paths>. Worktree: <abs worktree path>.\n" +
        "Human input (verbatim; off-limits for over-spec):\n```\n<same block>\n```\n" +
        "External context fetched during brainstorming: <ticket ref + body/comments, or 'none'>.\n" +
        "Coverage: <line, or omitted at full coverage>.\n" +
        "<documentation-impact and Amend-grant sentences as given to members>\n" +
        "Decide and apply the chair's clusters to the spec, then return the audit."
})
```

The result is usable iff it carries all three labels (`^Applied:`, `^Deferred:`, `^Rejected:`) and the number of its disposition lines (lines containing `raised-by:`) equals the number of cluster lines in the chair file (`^- \[(blocker|major|minor)\]`), counted mechanically with `grep -c` - no reading of either text. Unusable or killed -> restore `<tmpdir>/spec.before.md` over the spec and retry once with the task verbatim; second failure -> restore again, abort the council, say so, and continue to the gate with the pre-council spec (no `Council:` line, no row 3, same as today's abort). The chair report never enters the main loop; the audit does, once, because the commit body and row 3 need it verbatim.

### Main loop after the applier

In order, before anything else: `read` the spec from disk (the applier's edits are not in the main loop's context otherwise); diff `git -C <wt> status --porcelain` against `<tmpdir>/status.before` and, for every path that is new in the after-set and is not the spec: tracked -> `git -C <wt> checkout -- <path>`, untracked -> `rm`; append `; reverted applier edit outside the spec: <path>` to the gate's `Council:` line. Paths already dirty before the dispatch (the spec, predecessor banners, anything the user left) are never touched; an applier edit to such a path is not attributable from status alone and is the accepted gap of this backstop. Then re-run the placeholder scan; re-apply the Amend-grant predicate; `rm -rf` the temp dir. Then `spec-finalization.md` continues unchanged: summarizer, heredoc commit with the audit as body, the gate with `Council:` counts, row 3 printing `git show -s --format=%b HEAD`, revert valve. No new human stop.

### Telemetry follows the artifacts

`extensions/telemetry.ts`:

- `onCouncilResults`: for a `spec-council-synthesizer` result, when `parseChairReport(textOf(content))` yields nothing and `r.savedOutputPath` is set, parse `deps.fs.readFile(r.savedOutputPath)` instead. The read happens in the hook (the temp dir is removed by the skill later in the same turn sequence, after the applier returns).
- `onCouncilResults`: for a `spec-council-applier` result that exited 0, call `onCouncilAudit(textOf(content))`; ignore failed attempts and keep pending council state for the retry. The existing commit-command (`:761`) and assistant-text (`:780`) sources stay; the first parse wins because `onCouncilAudit` clears `councilPending`.
- `derived.council` shape, `resolveMembers`, `buildCouncil`, and the completeness rule are unchanged.

### Doc and contract updates in the same change

- `skills/roasting-the-spec/SKILL.md`: frontmatter description, Overview, "Separation of powers", and steps 3-5 name the applier (fresh context, main loop's model and thinking) as the executor; the parent's role is dispatch, structural probes, re-read, cleanup, and the gate; every "you apply" sentence goes. Red flags gain "ingesting the chair report or a member file in the main loop", "following the harness's 'Read this file if needed' line", and "applier result without all three labels or with a cluster count mismatch treated as applied".
- `skills/brainstorming/reference/spec-finalization.md`: the Spec Council paragraph says the council returns the audit from the applier; the heredoc commit sentence drops "telemetry reads them from this command" in favor of the three-source statement.
- `doc/personas.md`: roster row, knobs table column, "no model on" bullet, "why each pin" entry (no `thinking` so it tracks the main loop), and the "two council personas" wording becomes "the two pinned council personas; the applier is unpinned". `doc/configuration.md` Spec council and telemetry council paragraphs. `README.md` persona count and Spec council row. `CHANGELOG.md` gains `## Unreleased` with this entry.
- `scripts/ci.mjs` token pins: `["skills/roasting-the-spec/SKILL.md", "clusters that assert data shape, ordering, or semantics", true]` moves to `agents/spec-council-applier.md`; the `agents/spec-council-synthesizer.md` `grounded|hypothesis:` and `lean:` pins and the `skills/shape-ticket/SKILL.md` `` `^lean:` line `` pin stay; add `["skills/roasting-the-spec/SKILL.md", "outputMode: \"file-only\"", true]` and `["skills/shape-ticket/SKILL.md", "outputMode: \"file-only\"", true]` - the literal `outputMode: "file-only"` appears in shape-ticket's item 2 prose, not only in a code block.
- Supersession banners on the two predecessor specs with the scopes in the header.
- `skills/brainstorming/reference/documentation-impact.md` "Referenced by": add the applier dispatch.

## Errors and edge cases

- Member file missing or unusable after retry, zero usable files: unchanged (abort to the gate).
- Chair file missing, or present without `^consensus:`/`^lean:`: same retry ladder as today, judged on the file.
- Applier result missing a label or with a disposition/cluster count mismatch, or applier killed mid-edit: the main loop restores `<tmpdir>/spec.before.md`, retries once verbatim, and on a second failure restores again and aborts - no partial edit ever reaches the gate, and a retry never stacks on a half-applied spec.
- Applier edits or creates a file other than the spec: reverted or removed by the main loop's status diff and named on the `Council:` line. Backstop, not a gate; edits to paths that were already dirty are not detected.
- A member or chair that exits non-zero with no file on disk, or whose save fails, returns its text inline (`attempt-finalization.ts:285-287`, `single-output.ts:193-203`). pi-gauntlet cannot close this from the skill side: the text is in the tool result before the skill sees it. The skill names it, the parent does not read it, and the fail-closed fix (honor `file-only` on failure: return the diagnostic and the path only) is a pi-cohort change tracked as a follow-up in that repo; its CHANGELOG and this skill's text drop the exception when it ships.
- Telemetry: chair file unreadable (ENOENT after cleanup, permission) -> `chair.clusters` stays undefined and no `derived.council` is written, same as a malformed chair today; no throw.
- Operator pins `agentOverrides['spec-council-applier'].model` or `.thinking`: honored as for any persona; nothing in the skill passes `model:`.
- shape-ticket `:low` suffix rule and inline chair: unchanged; only its member fanout gains `outputMode`.
- amendment-review single member (`amendment-surface.md:89`): unchanged.

## Tests

`npm test` (`scripts/ci.mjs`):

- `extensions/telemetry.test.ts`: (a) chair result whose text is a saved-file line and whose `savedOutputPath` points at a fixture chair report -> clusters parsed from the file; (b) chair result with inline clusters -> file not read; (c) applier result carrying an audit -> `derived.council` written with the same roster as the chair clusters; (d) existing commit-command and assistant-text audit fixtures still pass; (e) unreadable chair path -> no council block, no throw.
- `scripts/brainstorming-contract.test.mjs` or a sibling: the roasting skill text carries the pre-dispatch snapshot, the three-label plus count check, and the restore-before-retry sentence (string pins, same style as the existing `Council:` pins).
- Skill/agent lint picks up the new persona frontmatter; the moved and added token pins above.
- Eval per `eval/README.md`: new `eval/roasting-the-spec/` target with `intent.md` and samples for the member fanout (every task carries `outputMode: "file-only"`), the chair dispatch (output + file-only, usability judged on the file, no `reads:`), the applier dispatch, the mechanical audit check, and the post-applier spec re-read; new `eval/spec-council-applier/` edit-kind target with a fixture spec, chair report with a grounded cluster (its probe only in a member file), a data-shape hypothesis cluster, and an over-spec cluster. Judge dependent-clause removal and Amend-grant preservation from the resulting spec tree, never from audit narration. Assert corrected facts and probe-or-open-question in the edited spec, plus the audit's recovered probe, cut line, three labels, and one disposition per cluster. Keep the case request neutral and the audit contract unchanged; `eval/shape-ticket/` gains a sample for the file-only member fanout. The applier target has no persona at `origin/main`, so the persona lands in its own commit first and the target runs as `node eval/run.mjs spec-council-applier --base <that commit>` (`eval/README.md`: "use `--base <ref>` to pick a base that has it"); the other targets run with the default base. All three run before finish.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/personas.md` (roster, knobs table, pin rationale - architecture, operations/tunable parameters); `doc/configuration.md` Spec council and telemetry council paragraphs (communication contracts); `README.md` persona count and Spec council row (architecture); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: `doc/specs/2026-05-31-spec-council.md` and `doc/specs/2026-09-18-council-grounding-amend-approval.md` (supersession banners); `skills/brainstorming/reference/documentation-impact.md` "Referenced by" list

## Out of scope

- An applier for shape-ticket's roast (its parent applies to an in-context draft with the split-axis merge rule).
- The amendment-review member dispatch.
- Replacing the per-stage dispatches with a pi-cohort chain.
- Fail-closed `file-only` on child failure (pi-cohort follow-up).
- Changing the chair's thinking, tools, or output contract.
- Any change to the gate text, row numbering, or the revert valve.

## Open questions

none
