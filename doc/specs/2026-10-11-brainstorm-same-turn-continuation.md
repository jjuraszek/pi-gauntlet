# Brainstorm same-turn continuation

**Goal:** Address unnecessary human nudges throughout brainstorming with one continuation instruction and before/after evaluation, while preserving real human gates.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

## Problem

After an answer includes a side question, or an approved ticket repair finishes, the assistant can end its turn with an acknowledgment or promise instead of resuming the active brainstorm. Observed examples include `I'll use A.` followed by the user's `go with it`, and a completed ticket-update report followed by `and?`. A later-phase example promised spec-writing but required `go` to start. These were normal stops, not provider errors or pending tool calls. These anonymized observations establish the symptom, not that a wording change will cure every instance.

`skills/brainstorming/SKILL.md:35` orders the checklist, and `:94` defines question formatting, but neither explicitly describes returning from a side answer in the same turn. `skills/brainstorming/reference/ticket-acceptance.md:22` returns approved repair to ticket fetch and re-extraction without explicitly requiring discussion to continue. `extensions/lib/phase-tracker-helpers.ts:21-27` deliberately excludes all active phases from automatic transition recovery; within-brainstorm nudging would also reach genuine human gates.

Framing: kept. The fix is prompt-local, applies throughout brainstorming, and follows `/skill:forge-skill`. The user requires a faithful replay first and implementation afterward even if measured improvement remains unproven; an actual eval run and honest reporting remain required. The aborted implementer attempt and its partial eval artifacts are not validation evidence for this change.

Predecessor: none. No prior design is replaced. Initial index search found no matching rows; code and topic recon, not absence from the index alone, determine that finding.

## Acceptance criteria

none - no ticket

## Design

### One continuation owner

Amend the progression instruction in the existing `## Checklist` of `skills/brainstorming/SKILL.md` with this two-sentence affirmative recipe:

> After a user answer or completed side task, resume the current checklist step and perform the next authorized action in the same turn, advancing once that step's required decisions and approvals are satisfied. Continue until a required question is unanswered, an existing approval is pending, the user explicitly pauses, or a failed required tool or unavailable required resource blocks progress.

The instruction applies throughout brainstorming, including completed delegated work and approved design rounds. Answer a side question before continuing. A clarification at an unapproved design gate leaves that approval pending; round-one approval permits presenting round two, not skipping its approval. Round-two approval starts the existing draft-read and spec-finalization/write sequence rather than another promise or an early jump to planning. The existing design-round and ticket-handling instructions retain ownership of their gate details; do not duplicate those exceptions in the checklist. Existing framing decisions, ticket-repair confirmation/cancellation, final spec approval, and explicit pauses retain their meanings.

Keep one owner: do not duplicate the recipe in ticket handling or each design step. Follow forge-skill's minimal-diff and imperative-voice rules. Do not change frontmatter, question formats, approval wording, or runtime recovery. Prefer this direct recipe over a new end-of-turn self-check obligation. Keep the minimal recipe even when the samples show no measured improvement; report that limitation rather than adding more prompt machinery to obtain a favorable result.

### Existing eval, two request shapes

Reuse `eval/brainstorming/` and `eval/run.mjs`; no runner or model-configuration change. The current target assembles the skill from `### 3` to before `### 6`, plus ticket handling, so it omits both the proposed owner and the design-round gate. Retain the existing `### 3` / `### 6` slice and ticket-handling context in `target.json`; add separate `## Checklist` / `## Project Routing` and `### 6` / `## Ticket Handling` slices using the existing heading-slice support. Do not broaden one span through unrelated worktree or scope sections. Both baseline and candidate use the same slice definitions; only their skill revision differs.

Add an explicit `replay: continuation` marker to the five new case files. In `replay.md`, put the entire existing step-four/first-question-plus-approaches request behind the marker-absent condition. For marked cases, request only `Produce the next assistant response from the supplied conversation/state.` Each marked case states its checklist step and recorded answers. This is prompt-level routing, not a parser/schema extension. The continuation request must not instruct the model to continue, ask the next question, or reach a named gate: those are judged behavior, not hints in the task. Continuation facts reject approaches while a required question or approval remains unresolved.

Use small synthetic histories and primary-code facts sufficient for each response. Do not copy private transcripts, repo names, tracker IDs, or local paths into committed samples. A completed-repair fixture supplies the successful repair, ticket reload, and re-extraction as already-observed state; it does not ask a tool-free model to perform them. For `design-approval-return`, start `case.md` with `bundle+: skills/brainstorming/reference/documentation-impact.md` before the replay marker or any blank line; the existing parser accepts bundle lines only at the beginning. Supply the successful guideline-read state and concrete documentation facts so the required round-two read is satisfied, not a legitimate tool-free blocker. Preserve existing sample requirements and question/approach obligations, applying the evaluation-only corrections below.

## Errors and edge cases

- A reply that answers only a side question and leaves the original decision unresolved stays at that decision.
- A clarification alone does not approve a design round. An explicit pause remains a pause.
- A cancelled ticket repair returns to the unchanged cut question, as covered by the existing `repair-cancelled` sample.
- A failed tool or missing required resource can be a concrete blocker; the recipe does not authorize invented facts or skipping a required check.
- Model-call timeouts, empty output, and inconclusive judgments are verification blockers, except the explicitly accepted result below. None is a pass or proof of the behavioral bug. Diagnose them separately without adding orchestration machinery to this fix.
- Text replay tests response continuation, not actual spec-file writes, tool execution, multi-turn liveness, or perfect behavior across models and sessions.

## Tests

Add these samples under `eval/brainstorming/samples/`, each with `case.md` and judgeable fact IDs in `expected.md`:

| Sample | Must-hold facts |
|---|---|
| `side-question-return` | Answer the side question; honor the selected option and present the next unresolved question or approaches in the same response, rather than only acknowledge or promise. |
| `ticket-repair-return` | Use the supplied repaired ticket state; resume the next unresolved question or approaches rather than end at a repair-status report. |
| `design-approval-return` | After explicit round-one approval, present round two and its existing approval request in the next response, rather than promise to present it. |
| `clarification-keeps-gate` | Answer the clarification; keep the existing approval pending and do not present the next design round. |
| `explicit-pause` | Honor the pause without advancing the questionary or design. |

Write the new fixtures and seed the baseline with `node eval/run.mjs brainstorming --baseline-only` before changing the skill; focused sample baseline runs can precede this full seed. The baseline arm reads the merge-base of `HEAD` and `origin/main` under the working-tree slice definitions. Keep before/after inputs identical, including the new replay request and assembly definition. Replay/assembly changes invalidate existing records across the target, so refresh the full target through the existing runner; never compare new candidate input against old-prompt baseline output. Update `intent.md` for this behavior change, naming the continuation facts expected to improve and the gate/pause facts that must hold; do not reuse the previous ticket-handling intent.

Inspect the baseline outputs against the fixed continuation facts before editing the skill. The frozen-model samples already continued, so preserve those results instead of forcing a failure. Before the source edit, replay an actual recorded stalled turn using the original model and thinking level, archived branch/context and tool schemas, without adding a user nudge. Keep private inputs, outputs, and any small SDK adapter in scratch; execute no new tracker or checkout side effects. Observe the first model completion and state unavailable historical-runtime details instead of claiming byte-identical transport replay. After the source edit, compare the same frozen context with only the checklist recipe changed at its actual owning paragraph, not appended as a new instruction elsewhere. Report normal stops, next questions, and attempted tool actions separately from executed work. The user explicitly requested: faithful replay first, then implement this pattern fix anyway. Non-reproduction or unchanged judgments are reportable limitations, not reasons to withhold the minimal recipe. Do not change the frozen model configuration or tune fixtures to manufacture improvement.

Run focused samples during iteration, then run `node eval/run.mjs brainstorming` from the worktree as required evaluation evidence. Preserve and report its actual exit and judgments, including the explicitly accepted limitation below.
Commit the updated intent, actual replay results, and generated `report.md` per `eval/README.md`. Baseline/candidate JSON records retain their compared `skillSha` and matching `inputSha`; `report.md` retains observed outcomes and the candidate assembly identity. Do not change the renderer or hand-edit generated results to make the change pass. The implementation commit body identifies this as a behavior change and cites the eval evidence.

The five response-level cases do not directly measure the round-two-approval-to-file-writing boundary. A prose spec dump in a tool-free replay is not evidence that the required write actually starts; disclose that remaining coverage limit rather than prescribe spec text in the request and count it as execution evidence.

Completion requires the faithful replay attempt before implementation, the minimal recipe, candidate gate/pause controls to hold, and no unaccepted regressions or verification errors; the single pinned inconclusive result below is accepted for landing. Follow the existing runner's judgment/confirmation rules. Report any measured improvement and disclose unchanged outcomes, remaining continuation failures, and model/scenario limits. An unchanged all-pass run does not demonstrate improvement but no longer blocks implementation. Keep a sanitized account of the supplementary original-context comparison in the existing eval intent; never commit private transcripts or claim a file write ran from an emitted tool call.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` - release note for the changed human-stop workflow (major procedures / conventions)
- Derived / memory docs invalidated: `eval/brainstorming/README.md` - its first-question/approaches-only scope and assembly description become incomplete; describe continuation coverage and tool-free evidence limits

Apply `reference/documentation-impact.md`. Extend the existing eval guide rather than create a new guide. Skill and eval prompt bodies are implementation surface, not documentation-impact entries.

## Out of scope

Runtime auto-nudging, transition-recovery changes, new settings or dependencies, a new shipped eval runner, timeout/retry machinery, repairing the aborted hotfix infrastructure, provider-specific instructions, and a guarantee that every brainstorm continues correctly. No existing approval gate is removed.

## Open questions

None blocking design. The user explicitly authorizes implementation after the faithful replay even without measured improvement; efficacy remains an empirical result to report, not a new approval gate.

## Legacy eval repair

Repair `human-raised-drop` by using the existing `replay: continuation` marker at the recorded reply after approach selection, with the user's drop request as the last message; preserve its acceptance rows, source facts, and all three judged facts. Do not inject the expected cut question or recommendation into the case.

Clarify only `latest-run-indicator`'s `framing` fact: the first message must explicitly raise both false per-file/item provenance from a workspace revision and the missing required date in a revision-only badge; implied concerns, merely mentioning a date field, or raising either concern only in the approaches do not satisfy it. Keep its case input, fact ID, other facts, and required outcomes unchanged.

Refresh changed inputs on both arms and rejudge changed facts through the runner, preserving earlier failures in git. Do not delete caches, reroll unchanged inputs, rewrite intent retrospectively, modify runner or model policy, or change the two-sentence skill rule for this eval-only repair. Preserve any repeated unplanned improvement as an acknowledged policy flag, not a manufactured pass.

Document the repaired conversation boundary and explicit first-message framing requirement in the existing eval guide without adding a new guide.

## Accepted evaluation limitation

The user explicitly accepts the single inconclusive `latest-run-indicator` / `anthropic/claude-opus-5-5` result for landing: the first candidate improves framing, while its distinct confirmation misses explicit framing and moves the version behind hover instead of beside the date. The full report remains 27 unchanged cells and one inconclusive cell, with exit 1; do not describe it as passing or infer a stable causal regression from one pair. This acceptance is limited to the existing `eval/brainstorming/results/latest-run-indicator/candidate.json` with SHA-256 `cd82eb2eb823629d0ffce3bae01b3df82263499080e8f36dcaef086dd996a3be` and full `eval/brainstorming/report.md` with SHA-256 `96aedb16ce3dae43ee750c35372e0f286706ebfe67e62227ebab7a8f4acddfce`; any different failure or new result needs its own decision. Retain these artifacts, the original intent, and unchanged runner policy.

Run `npm test` as the mandatory passing repository verification gate.

Record this accepted limitation in the existing eval guide and landing commit, without editing generated results or adding new verification machinery.
