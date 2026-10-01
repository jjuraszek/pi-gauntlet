# User-controlled brainstorming entry and contract-preserving extraction

**Goal:** Start a fresh brainstorming flow only on explicit user intent, and shorten the brainstorming instructions through mechanical extraction and duplication cleanup without changing the opted-in workflow contract.

## Problem

`skills/brainstorming/SKILL.md` advertises "You MUST use this before any creative work" and lacks `disable-model-invocation: true`. This repository's `AGENTS.md` also mandates brainstorming for non-trivial changes. Together these instructions turn ordinary requests into a worktree/spec/review flow without the user choosing that process.

Pi's existing `disable-model-invocation: true` field removes a skill from the model's advertised `available_skills`; it does not prevent filesystem reads or another skill directing the model to load it. Metadata, the skill's own entry rule, and package-owned incoming routes must agree on explicit-user entry.

The main skill also mixes orchestration with long ticket and finalization procedures. Some policies repeat their existing reference owners. Cross-phase amendment callers already share a procedure; they do not justify another skill. The cleanup preserves unique rules and removes only repetition whose equivalent owner survives.

## Acceptance criteria

none - no ticket

## Human input

Initial request:

> I feel like we need change brainstorming to be only user induced skill, agree or not good idea?

Follow-up accompanied by an explicit `/skill:brainstorming` invocation:

> it requires model invocable disabled for pi and probably description should change as well, right? moreover it requires some sanity sweep on brainstorming. does it contain blocks of repetitions? does it contain self sustained blocks which should be siblings?

Entry decision, after being offered explicit command, explicit prose request, or human-selected handoff:

> B or literal /skill:brainstorming

Extraction constraint:

> what overlaps for C really, no new skill only shared resources allowed

Approval of reference-only scope:

> yes

Architecture approval and preservation constraints:

> looks good
>
> changes should be minimal and following forge-skill guide. this should yield actually shorter brainstorming skill in total, right? don't loose any rule only reorg + duplication cleanup
>
> keep the contract intact. so same conditional statements routes. same order of the flow. it should be mechanical mostly right?

Approval of the preservation, verification, and documentation design:

> approve

## Design

### Entry policy

Add YAML boolean `disable-model-invocation: true` to `skills/brainstorming/SKILL.md`. Replace its mandatory-creative-work description with the trigger: "Use only when the user explicitly requests brainstorming or selects a handoff into it."

Place the entry rule before the reset-bearing checklist. Accept the literal `/skill:brainstorming` command, an explicit prose request to run brainstorming/the gauntlet, or the user's selection of a handoff into brainstorming. An ordinary implementation request, a discussion about whether brainstorming is useful, or an agent's recommendation is not consent. Recommend the skill where useful, then wait for the user's choice instead of starting it. Once entry is authorized, execute the existing fresh-entry actions in their existing order.

The flag controls discovery, not authorization enforcement by the harness. `/skill:brainstorming` is the reliable discovery-and-entry command. Explicit prose also authorizes entry when the skill is already loaded or an available instruction/route identifies it; do not promise that an otherwise undiscoverable skill will be found from prose alone. State that distinction in README's explicit-entry guidance. Do not introduce a runtime permission flag, extension guard, or prose parser.

Reconcile incoming routes without changing their selection predicates or destinations:

| Route | Behavior |
|---|---|
| Repository `AGENTS.md` Change process | Replace mandatory entry for non-trivial work with explicit-user entry; preserve enforcement once the flow is entered. Edit the repo-specific section, not `AGENTS.core.md`. |
| Main skill's "Anti-Pattern" / "otherwise spec first" wording | Scope the requirement to an opted-in flow; preserve its mechanical/trivial-work carve-out instead of letting it independently mandate fresh entry. |
| `chase-bug` human-selected "Brainstorm now" | The selection is consent; preserve the existing handoff. |
| `gauntlet-resume` brief without process state and with `worktree: no` | Preserve the route and carried Intent; request the user's choice to start a new brainstorm instead of silently invoking it. |
| `gauntlet-resume` restoration of existing process state | Continue at the recorded/on-disk step, without fresh-entry actions or a new consent requirement. |
| `gauntlet-resume/reference/reconstruction.md` no-spec route | Preserve its existing stop and offer; it already waits without tracker calls. |
| `gauntlet-resume/reference/reconstruction.md` unapproved-spec route | Treat this invocation as fresh entry: no process state was restored. Make the existing approval-status question explicitly offer the unapproved-draft brainstorming handoff. Invoke only when the user selects it; preserve the draft, existing-worktree behavior, and destination. A bare "not approved" answer is not consent. |
| `gauntlet-resume/SKILL.md` Arguments "anything else" route | Preserve the existing stop and recommendation to run `/skill:brainstorming`; it already returns the choice to the user rather than invoking the skill. |
| `writing-plans` missing-spec route | Preserve the no-plan-without-spec rule and destination; recommend brainstorming and await explicit choice before fresh entry. |
| Approved-spec amendment or redraw | Execute the existing in-place path; do not invoke the fresh skill entry or add an entry-consent gate. Preserve existing redraw approval stops. |

Sweep package-owned references to brainstorming for other unsolicited fresh-entry instructions; change only the conflicting authorization wording. Keep reminders, navigation links, valid continuation paths, and downstream automatic chaining. Do not interpret a read of a referenced section as fresh invocation. The only intentional behavior change is fresh-entry consent.

### Main skill and reference ownership

Retain the main skill as the orchestrator: entry, ordered checklist, design dialogue, phase boundaries, and amend/redraw router. Add only two instruction resources, both under `skills/brainstorming/reference/`:

| Resource | Content and loading point |
|---|---|
| `ticket-acceptance.md` | Move the existing Ticket Handling contract, including extraction, exact row/schema rules, dispositions, and no-ticket cases. Explicitly load it before gathering ticket context, including no-ticket runs because every spec still needs the acceptance section. Keep the main Ticket Handling heading as a pointer for existing callers. |
| `spec-finalization.md` | Move the existing Spec Self-Review, Spec Council, and User Review Gate procedures. Explicitly load it before spec-writing; keep short checkpoint sections and the numbered main checklist directing each step to its owner. Preserve the original procedure order across the file boundary. |

Keep the existing `gatherer.md`, `reference/documentation-impact.md`, `reference/amendment-surface.md`, and `reference/superseding.md` as owners of their current concerns. No new skill, command, persona, or shared-directory framework.

Replace the duplicated documentation-impact template/policy in the design step with an explicit read of its existing owner at that step. Retain the requirement to address documentation impact during round 2 and spec authoring. Consolidate standing-grant policy into its existing amendment reference; preserve caller triggers and return points. Keep grant boundary rules that currently exist only in the main skill by moving them to the surviving owner before deleting a restatement. Leave the finish gate's duplicated conformance-amendment recipe unchanged; that adjacent cleanup is not needed to shorten brainstorming or preserve its callers.

Consolidate overlapping worktree-setup descriptions through the existing worktree skill. Preserve the main skill's unique git-state observations and feature-branch/uncommitted-or-unmerged-work choice, artifact ownership, and worktree-path handoff. A navigation link or a safety checkpoint is not itself redundant.

Correct "Read all five bullets" to match the six existing bullets without changing the first-four inline / last-two dispatched split. Clarify the optional-council heading so critique remains mandatory; update its affected anchors. Retain other externally referenced headings as short routing sections, notably `Amending an approved spec`, `Spec Self-Review (Before User Review Gate)`, `Ticket Handling`, and `User Review Gate`.

Repair relative paths in moved prose, links, and dispatch contexts from their new owning location. Preserve actual resolved resources, dispatch inputs, output grammar, and the portable documentation-impact citation contract; relocation never changes the meaning of a path handed to a child. Update the existing documentation-impact reference's caller list only where extraction makes it stale.

In `gatherer.md`, replace the executable locator's dependence on the skill's advertised system-prompt `<location>` with the actual loaded brainstorming `SKILL.md` path, obtained from the command's skill envelope or the absolute path used to read it. Resolve the same `../../bin/gauntlet-spec-index.mjs` relative to that SKILL.md directory; the new reference directory is not the executable's base. Verify the locator for command entry and reachable prose entry. Preserve all query routes and degradation behavior.

### Mechanical preservation contract

Apply `/skill:forge-skill` to every changed instruction file. Use targeted edits and mechanically move the existing content rather than rewrite it. Added/changed instructions use imperative voice, ASCII punctuation, and owner links; leave unrelated text alone. Move multi-branch procedures into references without simplifying their predicates or inventing new branches.

Map every removed normative clause to its equivalent surviving owner. Preserve every post-entry gate, conditional predicate, route target, dispatch field, exact required output/marker template, tracker/worktree transition, and ordering constraint. Preserve foreground parallel batches, critique resolution, the automatic downstream chain after approval, and project-overrides precedence. Extraction must not make a required load optional or delay a rule until after it is needed.

The finalization sequence remains: read draft immediately before full overwrite; check line 1; second predecessor pass; predecessor banners; inline lint; configured council or worker critique; post-critique scan; summarizer and commit mechanics; verbatim/degraded gate; user approval; phase completion and automatic planning. Preserve the original detailed interleaving, including the summary read's last-content-producing-call requirement and the unconditional spec commit. This sequence summary does not replace the original detailed contract.

Preserve amend/redraw classification and both paths. Preserve all standing-grant boundaries, including no inherited grant after a new brainstorm or fresh-session resume. Do not move amendment ownership into a new skill or use skill entry to execute an amendment.

### Shorter instructions, not hidden growth

The baseline at `a0a3764` is:

| Measurement (`wc -l -w -c`) | Lines | Words | Bytes |
|---|---|---|---|
| `skills/brainstorming/SKILL.md` | 315 | 4845 | 33450 |
| All Markdown under `skills/brainstorming/` | 826 | 9970 | 66830 |

Produce a shorter main skill and a net word-count reduction across the complete brainstorming Markdown tree, including both new references. Report before/after line, word, and byte counts; line rewrapping is not evidence of reduction. Relocation alone does not count as aggregate shrinkage. Do not shift text into another skill to evade the measurement or drop a unique rule to hit a target. Deduplicate only against an equivalent surviving owner.

### Predecessor

supersedes `doc/specs/2026-09-18-council-grounding-amend-approval.md`, brainstorming dedup ownership/layout only.

Retain that predecessor's one-owner-per-rule and gate/step/dispatch survival requirements. The new reference ownership and measured net-shrinkage contract replace its older in-main ownership table and length target. Council grounding and standing-amend behavior are not superseded. Append a scope-specific supersession banner below its existing banner; preserve the existing successor for standing-amend presentation.

## Errors and edge cases

- A recommendation without a user choice does not reset phases, clear tasks, or create a fresh brainstorming worktree. Existing-flow continuation and amendment paths retain their own state transitions.
- A moved reference that cannot be read blocks its step; do not reconstruct its rules from memory or continue without them.
- Malformed council settings can still resolve to a council verdict. Preserve the existing verdict-based branch, warning behavior, missing-tool stop, and worker fallback exactly.
- Preserve gather/predecessor-query degradation, lint/critique gates, and summary degradation as separate paths; a degraded summary does not block the existing unconditional spec commit or authorize skipping critique.
- Preserve fresh temp paths on summary re-dispatch and existing partial-council coverage/audit rendering. Do not change retry budgets or introduce new failure fallbacks.
- Broken relative links or inbound anchors after extraction are implementation defects, not grounds to drop the referenced rule.
- Preserve unique setup and grant constraints even when their surrounding paragraphs look duplicated. Surface an irreconcilable rule conflict rather than silently choosing new behavior under the cleanup label.

## Tests

Use the existing `scripts/ci.mjs` validation structure. Retarget assertions whose contracts move into references; do not delete their coverage because their text left `SKILL.md`. Add focused checks for the boolean explicit-only frontmatter, required reference-load pointers, and critical branch/order contracts. Check links and inbound anchors for the moved/renamed sections without building a new general-purpose Markdown framework.

Review the normalized before/after instructions clause by clause, mapping every deletion to a surviving owner. Compare predicates, route targets, dispatch shapes, required templates, and ordering separately from formatting. Record the mapping in implementation/review evidence, not as a new permanent instruction resource. Existing prose token tests are a backstop, not a semantic-equivalence proof.

Run these manual post-implementation instruction smokes against the updated files: supply each scenario's facts, walk the next action and ordered path, and record the trace against the expected result below. Label this evidence as a manual instruction walkthrough, not a runtime end-to-end test. Static `scripts/ci.mjs` checks do not execute these scenarios; add no separate test framework.

| Scenario | Expected first action or ordered trace |
|---|---|
| Ordinary task or mere recommendation | No fresh-entry tracker reset/clear or brainstorming worktree creation. A recommendation, when made, waits for a user choice. |
| Explicit command, reachable explicit prose, or selected handoff | Enter directly: reset phases, clear tasks, start brainstorm, then existing worktree/gather sequence. Resolve the executable from the loaded skill path, not an absent advertisement. |
| Existing process-state resume versus no-state entry | Restored brainstorm continues at step 4 or 8 as before. A no-state/no-worktree route offers a new brainstorm and waits. A reconstructed unapproved draft enters only on the explicitly offered handoff selection. |
| Council/worker settings | Branch on `verdict`; emit malformed warnings without replacing a valid council verdict; retain the missing-tool stop and worker path. |
| Spec finalization | Read draft, overwrite, check marker, second predecessor pass, banners, inline lint, critique, re-scan, then the original summary/commit/read/gate interleaving. No approval-to-plan bypass. |
| Summary faults and revision | Apply the existing reported-size/read-result degrade conditions; retain the unconditional commit. A change request uses a fresh summary temp path. |
| Amend/grant/redraw | Amend without grant follows prefilter/reviewer/escalation/apply aftermath; a grant skips its existing review steps only; redraw retains its stop and in-place restart at step 4. No fresh skill entry for amendments. |

After implementation, run `npm test`, the existing skill genericity scan, changed-file link/anchor checks, and the before/after size measurement. Run no proposed-change exercises during this design phase. Reload Pi after installing the changed skills, per forge-skill; a worktree edit alone does not reload the installed package.

## Documentation impact

Apply `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - explicit entry in What a run looks like and Architecture, automatic/explicit skill classification and counts (major workflow convention); `AGENTS.md` - repo-specific Change process (major workflow convention); `CHANGELOG.md` - user-visible entry contract and reference-only cleanup
- Derived / memory docs invalidated: `README.md` automatic/explicit roster and `AGENTS.md` routing, corrected by the same edits

The README and AGENTS candidates from recon qualify because their current workflow contract becomes wrong, not because they mirror the diff. Skill/reference files are implementation surface and belong in the plan's file list, not this section. No shared `AGENTS.core.md` or sibling-repository contract change is needed.

## Out of scope

New skills, commands, personas, runtime guards, settings, or dispatch protocols; changed review/approval policy after entry; changed amend/redraw semantics; broad rewriting or formatting of untouched instructions; the finish gate's adjacent conformance-amendment dedup; a new shared-resource hierarchy; release/publish; edits to consumer repositories or unrelated sibling packages.

## Open questions

None.
