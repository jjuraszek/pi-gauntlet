# Bounded ticket overlap prevention

**Goal:** Reduce duplicate or contradictory tickets by finding a relevant existing concern and offering enrichment at shape-ticket's existing confirmation menu, across supported trackers and ticket classes.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** [#60](https://github.com/jjuraszek/pi-gauntlet/issues/60), acceptance snapshot fetched 2026-10-11, preserved verbatim; AC 9 has a spec-only deviation.
**Supersedes:** `doc/specs/2026-08-18-gh-8-shape-ticket-skill.md` - create-mode duplicate/reversal check and associated overlap comment, confirmation, and write behavior only.
**Supersedes:** `doc/specs/2026-08-18-check-delivery-consumer-feedback.md` - Item 4a's Reporter-note-only comment eligibility, overlap no-op, and associated comment/write restrictions only; other items remain unchanged.

## Problem

The create-time duplicate/reversal check in `skills/shape-ticket/SKILL.md` searches existing work but leaves concern comparison, enrichment, and search limits unspecified. Different descriptions of the same missing capability can become competing tickets. Shared vocabulary can also hide independent outcomes or contradictory requirements. Bugs, feature stories, and improvements all need this check; neither ticket type nor code location establishes concern identity.

Framing: kept for the product; verification narrowed to read-only retrieval and proposals. Traced create and repair through Gather, draft, deterministic gates, roast, confirmation, and Write; traced bug/discovery handoffs in `skills/chase-bug/SKILL.md` and non-bug handoffs in `skills/gauntlet-performance/SKILL.md`. Extend the owning create-time check rather than add a second detector. The identity test in `skills/shape-ticket/reference/split-axes.md` already covers feature work. The checkout replay's session isolation, mapped reads, and recommendation judge remain useful without its approval dialogue or write simulator.

The user approved inline, bounded discovery and one existing menu. Enrichment is advisory: the human can create a new ticket despite the recommendation. This is a stochastic mitigation for independently working humans and sessions, not a uniqueness guarantee or backlog-cleanup system. The reported 1,000+ ticket workload is user-supplied, not a measured baseline. Keep the production edit small; use the approved 16-session comparison rather than rebuilding a workflow simulator to verify it.

## Acceptance criteria

Ticket #60, Acceptance Criteria, rows verbatim:

- [ ] Given an ask whose existing same-concern ticket is discoverable through body content but not its title, with search enabled, the create-time check retrieves that candidate through the resolved tracker before proposing create or enrich, then reads its body and relevant discussion. It reports searches performed and coverage limits; it never sweeps the backlog. Unavailable body search, truncated results, or unreadable evidence are disclosed, never treated as proof that no match exists.
  in-scope
- [ ] Given new evidence or another perspective on the same concern without a separately valuable outcome, the default proposal enriches the existing ticket rather than creates a sibling. It shows what the new material adds. When the existing ticket already contains the material, it names that ticket and proposes no write. In either case, the existing confirmation menu also offers creating a new ticket despite the overlap recommendation, with the overlap evidence shown.
  in-scope
- [ ] Given an unstarted ticket and new requirements belonging to the same concern, the proposal shows an existing-ticket body diff that makes the scope addition explicit, preserves unrelated requirements and references, and awaits approval. A new perspective or an implementation-layer boundary alone never justifies recommending a new ticket.
  in-scope
- [ ] Given started work or unknown workflow status, the check does not propose a body rewrite or automatically create a remainder ticket. It proposes an evidence comment when useful and surfaces any requested scope change for a human decision. Workflow meaning comes from project overrides or tracker documentation; absent a documented mapping, status is unknown and this protective outcome applies.
  in-scope
- [ ] Given shared vocabulary but independent outcomes, an intentional dependency or phased split, conflicting requirements, or a request reversing a recorded decision, the proposal explains the distinction or conflict. It neither silently absorbs the work nor links an unrelated search hit. The agent recommends a separate ticket only for a separately valuable concern; unresolved conflicts remain human decisions. Requests reversing recorded decisions retain the existing supersede, merge, park, or proceed recommendations, with justification rather than silent reversal.
  in-scope
- [ ] Evidence comments and relations proposed by this check are in scope; standalone administrative posts and status transitions remain out. The menu is the existing single confirmation gate. Each write option, including creating a new ticket despite an overlap recommendation, presents its exact changeset; selecting it approves that payload without another authorization prompt. Every proposed body edit, comment, or relation is covered by that approval. A changed source ticket or relevant discussion detected before writing invalidates that approval; failed writes report what actually landed. Nothing is written on a declined or unanswered proposal.
  in-scope
- [ ] Given a create invocation without `--skip-overlap`, candidate search runs. With the flag, it is skipped and reported as skipped, not as no match. Repair continues without candidate search and accepts the same flag without starting one. The flag retains required source-ticket and linked-material reads, conflicts surfaced from known evidence, and the existing approval and pre-write checks.
  in-scope
- [ ] Given an overlap recommendation, continuing into enrichment performs no further candidate search, with or without `--skip-overlap`.
  in-scope
- [ ] Synthetic evaluations exercise the cases above, including the create-new override for same-concern enrichment and no-op recommendations, the explicit search bypass, unflagged repair without search, enrichment continuation with and without the flag, and a body-only match that the check must retrieve rather than receive preselected, same-concern enrichment with added scope, a no-op, started and unknown-status protection, an unrelated match, contradictory requirements, a recorded decision reversal, a documented phased split, and a mid-review edit. Expected outcomes distinguish proposing enrichment from applying it; no live tracker writes occur. The target evaluation and package checks pass.
  deviates: the user chose a spec-only deviation after approving the smaller proof. Retain existing regression evals and package checks; replace the synthetic full-workflow matrix with 16 read-only historical retrieval/proposal sessions and reuse native capability evidence. Do not claim synthetic coverage of every listed case, approval continuation, mid-review edits, or mutation execution. The product requirements above remain in scope; the ticket row stays unchanged.

## Design

### Ownership and change surface

Keep discovery in the current agent. Add `skills/shape-ticket/reference/overlap-check.md`, read at the existing create-mode Gather step. It owns the search budget, comparison procedure, and overlap-specific proposal outcomes. Keep the main skill's changes to the owner sentences for invocation routing, Gather, proposed comments/relations, no-op, confirmation, Write, and their conflicting summaries. Apply `/skill:forge-skill`: imperative voice, one owner per rule, minimal edits, and tables/reference extraction instead of accumulating branches.

Reuse the current source snapshot, per-issue draft, metadata audit, proposed-comment slot, roast, and confirmation path. No new persona, extension, executable, persistent schema, index, cache, settings key, or search-service dependency. The reference is implementation surface, not a new user guide. Native tracker mechanics remain with the existing capability ladder, `/skill:linear` for Linear, and verified GitHub/custom-tracker commands. Do not put specialized queries or search reports in authored ticket bodies.

`skills/chase-bug/SKILL.md` has return wording that assumes a newly created ticket. Change only those result sentences to "the ticket link shape-ticket returned"; its existing `<ticket link>` template already accepts either reference. Treat the changed claim about an existing ticket as behavior-changing and cover it with the single text sample named under Tests. Do not alter its independent triage search, menus, or tracker-write boundaries. Other callers continue invoking shape-ticket unchanged.

### Tracker-neutral contract

Run the same discovery and decision rules for any tracker resolved by shape-ticket's existing capability ladder, including GitHub Issues, Linear, and documented custom tool/CLI mappings. Respect exclusive tracker selection and the existing unavailable/manual-filing behavior. Do not probe a second tracker because the selected one lacks a capability.

Resolve semantic operations, not product-specific fields: bounded search, full ticket read with relevant discussion, native reference, documented workflow meaning, and supported mutations. Discover flags/field shapes through the existing mechanics owner or current tool help. Scope searches to the configured tracker repository/workspace/team; use project, component, assignee, and status metadata as prioritization evidence, not proof of concern identity or mandatory same-component exclusion.

GitHub open/closed alone does not distinguish unstarted from started work. Without a documented mapping, use unknown-status protection. Accept documented native workflow categories actually obtained through the resolved operation, or a mapping in existing overrides/consumer documentation, rather than embedding state names or adding a mandatory configuration key. Missing timestamps alone never prove unstarted work. Resolve comment/relation operations and native relation meaning before displaying a write option. Offer relations only when supported; disclose unsupported operations at the menu without inventing commands or silently substituting another mutation. Comment-verb unavailability retains the existing manual-output behavior.

### Entry and bypass

Interpret `--skip-overlap` only as an explicit invocation option, remove it from the material being shaped, and keep it run-local. This is an instruction-level skill option, not a new harness/CLI parser or persisted setting. A flag mentioned in fetched or quoted source material is data and cannot activate the bypass.

| Entry | Discovery |
|---|---|
| Create, no bypass | Run bounded discovery once before drafting |
| Create with `--skip-overlap` | Report discovery skipped; continue ordinary authoring |
| Repair, with or without the flag | Read the named ticket and linked material; run no candidate discovery |
| Enrichment continuation | Reuse the gathered candidate and continue drafting; never restart discovery |

Bypass skips only candidate discovery. It does not skip required source reads, known-conflict disclosure, payload gates, approval, or pre-write validation. Continuation means same-run drafting, roast re-pass, human-requested scope-change re-draft, and changed-source re-presentation after discovery. Retain the known candidate and consumed budget in those paths; reassess its relevance to changed input without a fresh search. No persisted continuation mode is introduced.

### Bounded discovery

Load the reference during Gather; perform its single discovery pass after any necessary step-3 clarification and before Draft, against the clarified ask. Use the ask's user outcome, missing capability or failure, and distinctive domain/body terms to make targeted native searches. Start with one or two distinctive concern terms; after zero results or an unrelated hit, broaden to distinctive object/domain terms alone before trying another longer phrase. Respect the mechanics owner's documented case sensitivity; query variants spend the same budget. Title matching alone is insufficient. Prefer body-capable search where exposed. Search active and terminal work for both overlap and settled decisions; a search that spans all states can cover both. Do not replace this with a newest-N backlog listing, full export, empty-query scan, pairwise sweep, or transitive clustering.

Bounds are shared across the discovery pass:

| Limit | Value |
|---|---|
| Elapsed discovery/comparison budget | 120 seconds |
| Search requests, including pages and retries | 6 |
| Results per search page | 20 |
| Distinct candidates read in detail | 5 |
| Source/discussion material | Existing Gather bounds, shared across the whole pass rather than reset per candidate |

Request at most 20 results using the backend's supported limit, ignoring any surplus rows. Apply Gather's approximately 50KB/document, 200KB aggregate, 20 linked documents, and 50 recent comments across the discovery pass; a material limit produces a coverage note, not a fresh allowance for each candidate. Use returned size metadata or request bounds for accounting; without a tighter upper bound, charge each fetched document as 50KB and stop before exceeding the aggregate. These are simultaneous maxima, not a promise to inspect five candidates: four worst-case documents can exhaust the 200KB limit first.

Record the start time, query/filter/page, and counts. Check the elapsed budget before each additional search or candidate read; use the remaining budget as the tool/command timeout where supported. Stop launching discovery when any applicable limit is reached. A tool that cannot enforce cancellation can overrun in-flight; report that overrun instead of claiming an exact wall-clock cap. Do not grant a fresh budget to pagination, retries, or an enrichment continuation. Drafting, roast, human wait time, and mandatory pre-write validation are outside this discovery budget.

Inspect promising results incrementally. Read the candidate's body, ACs, relevant discussion, and metadata, subject to the existing Gather bounds. Distinguish returned descriptions from proof that the backend searches descriptions. Expand targeted queries or inspect the next lead automatically while budget remains. Stop at the first evidenced, reasonably enrichable candidate, including a same-concern candidate whose material is already present. Do not keep searching for a globally best survivor. A bare title or incomplete decisive evidence is not enough to recommend enrichment. Preserve any contradiction or reversal already read in the final proposal; finding an enrichable candidate later never resolves or hides that conflict.

Carry a compact coverage note to the existing menu: searches/filters used, candidates read, elapsed time, stop reason, and unavailable/truncated evidence. Early stopping names that later hits were not compared; evidence for one candidate does not prove the absence of other contradictions. Exhaustion or a failed search is uncertainty, not proof of absence and not a new human gate. Reaching no supported candidate permits an ordinary create proposal with that uncertainty disclosed.

### Compare concerns and propose outcomes

Apply the existing concern-identity test in `reference/split-axes.md`; do not copy or invent a second taxonomy. For features, explicitly judge independent user value and top-level needs. Shared code or tightly coupled changes justify reading both tickets, not automatic absorption. Respect documented intentional dependencies and phases. Check body requirements and relevant decisions for contradiction even when symptoms match.

| Evidence | Proposal at the existing menu |
|---|---|
| Same concern, useful new evidence | Recommend enrichment and show what is added, normally as an evidence comment |
| Same concern, new compatible requirements, documented unstarted ticket | Recommend an explicit body diff preserving unrelated requirements/references/fields |
| Same concern, already covered | Recommend no write and cite the existing ticket |
| Started, terminal, or unknown status | No scope/body rewrite; offer useful evidence, surface requested scope changes |
| Independent user outcomes or documented intentional separation | Explain why a separate concern remains valuable; recommend create when supported |
| Contradictory requirements or reversal of a recorded decision | Explain the conflict and justified supersede/merge/park/proceed recommendation; never silently reconcile scope |
| Unrelated search hit | No enrichment or relation to that hit |

Always retain create-new as a human override for an overlap/no-op recommendation. That choice overrides the recommendation, not AC integrity, evidence, or write safety. Enrichment and create-new are mutually exclusive options, not a split or two writes; label them as alternatives so split detection and `split-axis:` auto-merge cannot merge their bodies. For a repeated defect, neither completion nor compatible same-concern additions establishes a new concern. Without evidence distinguishing a new regression, recommend useful existing-ticket additions or no write, retaining create-anyway as an override. A genuinely distinct regression or independent outcome can justify create; useful evidence about completed work can enrich without a body rewrite. Scope changes requested by the human still need their concrete diff before selection can authorize them. Keep supersede/merge/park/proceed as recommendation prose, not new mutation verbs: supersede or proceed can propose an exact create-new changeset, merge can propose a supported additive enrichment changeset, and park proposes no write while naming the unresolved decision. No label authorizes a status transition, automatic merge, or extra relation. Show unavailable operations as unavailable or manual output under the existing capability contract.

For evidence-only enrichment, retain the source body as read-only context; do not turn it into an unsolicited repair. Gate each overlap alternative independently. A failing alternative is shown as unavailable with its offending criterion; it cannot suppress a clean alternative or become selectable by choosing create-anyway. Hard stops still abort every write within an ordinary run/batch or within the selected alternative. If no write alternative passes, retain the hard-stop/no-write outcome. Never silently remove a failing proposed AC.

Make an existing-ticket enrichment diff additive: preserve unrelated rows verbatim, gate added/changed ACs, and surface legacy defects without normalizing or repairing them. Gate the entire as-new body for the create alternative. Vet proposed evidence/comments and metadata/relations normally. This payload-local rule is confined to overlap alternatives, not a relaxation of ordinary repair or split-batch gates.

Explicitly widen the Reporter-note-only exception to permit overlap evidence comments without overflow or a separate in-session comment request. Reuse the existing one-comment-per-issue slot. When both new evidence and required Reporter-note material belong to that issue, combine them as clearly labeled parts of one exact comment, preserving both; an already-present Reporter note still satisfies its existing dedup rule. Outside overlap evidence, retain the existing Reporter-note eligibility rules. Include all available alternative payloads and the read-only source in the existing roast artifacts; preserve untrusted-data fencing and roast failure handling.

### Single menu and write

Present the existing confirmation menu once, adding enrichment only when supported and shifting the recommendation when warranted. Each selectable write option includes its exact title/body/metadata/comment/relation changeset before selection. The human can choose enrichment, create-new despite overlap, or no write; there is no search-expansion, strategy-selection, or second authorization prompt. Declined or unanswered options produce no writes. Ordinary conforming repair retains its early no-op; an overlap no-op recommendation still roasts its proposed create-new body and exposes it at this menu. Reconcile the Quick reference, no-op, and hard-constraint summaries with that distinction.

Before any selected mutation, re-fetch the existing source ticket and relevant discussion that justified that option, even when the selected option creates a new ticket instead of editing the source. Compare against the approved snapshot, including workflow evidence. A change reopens the same gate with the delta. Use native version preconditions where exposed; this first iteration adds no lock or atomic uniqueness guarantee. Revalidation reads the known source, not a fresh candidate search. An unrelated hit mentioned only as rejected coverage is not automatically a source for the selected option. A requested payload revision is not approval of that revised text; show it before selection.

Create-anyway carries its exact as-new body and metadata. Include an overlap reference, supported relation, or source comment only when justified and explicitly displayed in that option; overlap alone does not authorize an extra source mutation.

Execute only the selected approved operations. Skip unchanged bodies on comment-only proposals. Resolve the operation order before approval: create/update first where later operations depend on it, then the supported comment/relation operations in their documented dependency order. Report confirmed landed, confirmed not landed, and unknown outcomes per operation. A lost response is unknown, not permission to retry: stop, reconcile with a supported read if possible, otherwise report that verification is required. Retain the unperformed changeset without blindly repeating an operation that might have landed. Return the actual existing or new ticket reference to the caller; no-op names the existing ticket without implying a write.

### Verification boundary

Retain the established text regression target and package checks. Replace the checkout-only full-workflow simulator with a read-only retrieval/proposal probe in the existing `eval/shape-ticket/replay/` files. Delete the automated approval dialogue, payload-selection interpreter, mutation ledger, source-revision simulator, and tests/fixtures that exist only to drive them, including the old synthetic matrix in `cases.mjs`. Do not replace them with another parser or general framework. Reuse session isolation, scoped instruction reads, tracker reads, deadlines, and the existing semantic recommendation/fact judge. Load each arm's actual skill and required references; do not parse Markdown to infer menu selections, returned-ticket meaning, or approved payload bytes.

Run four frozen historical cases once per model and arm: four cases x two frozen replay models x baseline/candidate x one repetition = 16 sessions. Send exactly one scenario prompt and grade its final assistant text; a clarification-only response or missing recommendation fails as unknown without a follow-up prompt. Send no simulated approvals or continuation turns. Expose only instruction reads, mapped tracker search/read/read-document, clock, and an explicitly unavailable roast stub. Disable builtin shell/filesystem/network tools and MCP; advertise only read operations, but reject and record any raw create/update/comment/relation attempt at the tracker-tool boundary without changing fixture state. The host loads the private corpus, but the replayed agent sees candidate content only through the mapped reads, never through a corpus file or preselected candidate in its prompt. Apply the same isolation and unavailable-roast behavior to both arms.

Keep model/judge/thinking selection in `eval/lib/models.mjs` unchanged from the frozen evidence. Use baseline `c10ba7c5eaf867280a2b21d70d612c2579ecafcf`, not a moving branch. Bind the run to the existing v2 manifest with SHA-256 `e788684e4755609836de92d24e67ccb7b76172f5ffd357c965fcb3e44b54a85d` and the private blind-review records described by `eval/shape-ticket/replay/selection.md`. Before starting any cell, have the runner hash the raw `--cases` file bytes and compare with that frozen digest; do not hash reserialized JSON as manifest identity. Record the raw digest in run metadata and fail with incomplete proof on mismatch. Leave the manifest immutable; record the approved one-repetition setting in run metadata and the public selection/report text rather than editing the frozen inputs. Retain their prompts, pools, labels, and known limitations; missing data or unsettled labels blocks the historical proof rather than authorizing replacement cases.

The bound manifest has empty dialogue arrays and four invariant names on every case. Retain `caps` and `search-before-read`. For every case carrying the search invariant, require at least one successful search response with an items array, even an empty array; unsupported calls and failed searches do not satisfy it. Candidate-bearing cases additionally require discovery of that candidate before its successful read. Enforce `no-live-writers` as probe isolation and attempted-write rejection, not simulated mutation safety. Inventory `approved-payload` as not evaluated under the approved redraw, never as a pass. Accept the empty legacy dialogue field without executing it; reject nonempty dialogue and unknown invariant names before model calls. Report this compatibility inventory alongside results instead of silently dropping checks or editing frozen inputs.

## Errors and edge cases

- Search/description capability missing, page truncated, timeout, or decisive discussion unreadable: report the limitation at the existing menu. Never upgrade unknown evidence into an enrichment verdict or claim exhaustive coverage.
- Tracker disabled/unavailable: preserve the existing capability ladder's authoring/manual-output path and report discovery not performed.
- Multiple promising hits: inspect in evidence-driven order inside the same bounds; stop at the first supported enrichment candidate rather than establish a canonical survivor. Carry any conflict already read to the menu unresolved; later enrichment cannot erase it.
- Contradiction found in known evidence with bypass active: surface it; bypass does not erase evidence.
- Source changes while approval is pending: invalidate approval and re-present, including a status change from unstarted to started.
- Unsupported relation/comment operation: disclose the unsupported part before approval and preserve the existing manual-output contract; do not invent a tracker-specific workaround.
- Independent sessions can both propose create before either writes. Record this residual race; do not add cross-session state or a sweep to close it.

## Tests

### Existing regressions and probe checks

Follow `eval/README.md`. Retain `eval/shape-ticket/samples/multi-repo-groups` and `venue-stripped`; add `eval/shape-ticket/samples/closed-concern-additions/` with synthetic gathered evidence: a reviewed closed ticket already covers the repeated defect, while the new ask adds companion-checker parity, empty-input behavior, and documentation without a new run/version. Bundle the existing overlap reference only for this sample using the standard text-target mechanism. Require a useful existing-ticket addition/scope question or no-write recommendation, no asserted verified regression, and create-anyway retained only as an override; do not demand perfect no-write wording. Update `intent.md` and run `node eval/run.mjs shape-ticket --base 9287ab3`, the pre-fix baseline where the reference exists. Preserve the existing target/replay and its two older samples; this no-tool target tests proposal wording and drafting/AC regressions, not retrieval or tracker mutations. Keep historical inputs unchanged in the checkout-only probe.

Add `eval/chase-bug/samples/returned-ticket-link/` under a minimal text target following `eval/_template/`, with intent and report. Supply a synthetic shape-ticket result naming an existing ticket and no newly created ticket; the must-hold is that the caller cites the returned reference without claiming a new ticket was created. Run `node eval/run.mjs chase-bug --base c10ba7c`. This text regression adds no tracker tools or simulated approval turns. Record both skill edits as behavior-changing in the commit body; identify the four historical samples, `eval/shape-ticket/replay/report.md`, and the refreshed text-target reports for conformance.

Adapt `eval/shape-ticket/replay/run.test.mjs` and `tracker.test.mjs` to the reduced read-only boundary. Keep deterministic checks for search/read visibility and ordering, pagination/material/time limits, timeout cleanup, active-tool isolation, attempted-write rejection, missing/invalid judge output, report completeness, and redaction. Use small synthetic inputs for these implementation checks, not another stochastic synthetic workflow suite. Run `node --test eval/shape-ticket/replay/tracker.test.mjs eval/shape-ticket/replay/run.test.mjs`. Delete obsolete approval/write simulator tests rather than preserving unused production machinery to satisfy them.

### Frozen read-only comparison

Use the four existing v2 cases as current-snapshot re-filing examples, not recreations of the original historical backlog. Their sources share one tracker workspace/team and are not independent populations. All four replay through the frozen Linear mapping. The historical pools contain three or five snapshots; an independent-create result means no supported overlap in that bounded pool, not in the whole workspace.

| Sample | Must hold |
|---|---|
| `history-a-overlap` | Retrieve and read the covering candidate; recommend useful compatible additions/questions on that ticket or no write, not a sibling solely because it is completed and the ask adds same-concern requirements |
| `history-a-independent` | Recommend create for the independent feature outcome, not absorption into a vocabulary-sharing hit |
| `history-b-overlap` | Retrieve and read the covering umbrella; useful compatible additions or no write pass the first-version review, while the recorded implementation dependency stays intact |
| `history-b-independent` | Recommend create for the separate bug outcome rather than umbrella absorption; preserve the selection record's Moderate-high confidence and weaker umbrella alternative in the report, not as a required model utterance |

Run `node eval/shape-ticket/replay/run.mjs --suite history --cases "$OVERLAP_HISTORY_MANIFEST" --reps 1 --base c10ba7c5eaf867280a2b21d70d612c2579ecafcf` with output under OS scratch. `OVERLAP_HISTORY_MANIFEST` is an operator-supplied external file path with no default; missing input refuses the run. Keep the command's history-only path; remove the old synthetic suite and set the history default to one repetition. Update `eval/shape-ticket/README.md` and `replay/selection.md` for this read-only command, defaults, and proof limits. Mark `--only` or `--baseline-only` results partial and ineligible as acceptance evidence; a different acceptance run needs a new bounded-run decision. Record exactly 16 completed cells, per-cell elapsed time and available usage, repetitions, the manifest hash, instruction hashes, and frozen model/settings. Bound each cell, including judging, to the existing ten-minute deadline; report incomplete or timed-out cells without automatic matrix retries.

Assert successful search on every search-invariant case and search-before-candidate-read-before-recommendation on overlap cases. Use the existing recommendation field and semantic judge to classify the recommended ticket action, not filing readiness: a clearly recommended new-ticket proposal remains create when marked not-ready or blocked on evidence; a compatible existing-ticket update or evidence comment remains enrich when blocked on evidence. Park means deferring the ticket-action decision itself without recommending a new-ticket or enrichment proposal; no-write means intentionally leaving already-covered work unchanged. Clarification alone or an ambiguous menu without an identifiable recommendation remains unknown, never inferred from the first option. Preserve supersede/proceed meanings and reject conflicting scope adoption through the frozen facts; merely recording unresolved evidence is not automatic park. Judge each frozen fact from its own statement, supplied input, and observed output/tools, without passing the expected recommendation enum to the facts judge. Do not treat a readiness blocker as a failed concern-identity fact, or suppress a fact that explicitly concerns evidence or contradictions. Add no readiness field, output parser, or score override; the source text retains readiness evidence. Candidate acceptance requires all eight candidate cells to satisfy their expected recommendation, frozen facts, and retained read-only invariants, with no regression on paired baseline facts. Baseline misses are comparison evidence, not a requirement to repair baseline. Missing/invalid judgment, a failed candidate, or fewer than 16 completed cells leaves the proof incomplete and exits nonzero. Do not silently rerun, substitute models/cases, or tune labels after seeing results; any later iteration records its exposure and requires a new bounded run decision.

Write a sanitized comparison to `eval/shape-ticket/replay/report.md`, separate from the existing text-target `report.md`. The preceding machine acceptance criterion remains an unchanged strict diagnostic, not the first-version delivery gate: preserve its nonzero exits, frozen labels, invalid judgments and prior scores rather than regrading them. The delivery gate is a source-based review of the four saved candidate overlap responses plus the focused closed-concern regression and normal package checks. Fix only clear recommended duplication, unsupported assertions of a new regression, silent contradictory scope adoption, or unapproved mutation; compatible useful updates and harmless redundant wording are not blockers. Record each response's actual recommendation, supported addition, blocker/disposition, and the focused fix evidence; a create-anyway alternative alone is not a recommendation defect. Stop the fix loop when that bar is met; do not run another historical matrix or tune prompts to force perfect no-write scores. Report retrieval and recommendation separately; describe write blocking as probe isolation, not proof of real write safety. Keep raw traces, private bodies/identifiers/workspace names/local paths, and provenance maps outside the public checkout. Disclose the frozen feature prompt's dangling attached-plan reference and unrelated source identifiers without publishing them. Do not repair that prompt silently or claim the small, previously exposed set is an unbiased holdout, a variance estimate, production accuracy, whole-backlog recall, or statistical superiority.

### Native evidence and proof limits

Reuse the captured native GitHub and Linear checks bound by the private selection records; do not collect a new corpus. GitHub demonstrates one title-disjoint body-restricted search hit. Linear demonstrates one non-title hit, but its indexed-field attribution remains inconclusive. Preserve that distinction in the public report and capability claims. Use the dedicated Linear probe, not the earlier stale evidence index. Retain the selection record's cumulative preparation cost of nine searches and 19 fetches; do not describe it as within the initial allowance. Custom mappings remain a product contract, not a demonstrated native-backend result from these four Linear cases.

Review the changed skill/reference instructions against the eight product AC rows and Design, including bypass, protected workflows, exact menu payloads, source revalidation, and partial-write reporting. Identify this as instruction review rather than executed scenario coverage. The read-only comparison does not demonstrate applying enrichment, create-anyway selection, repair/continuation, mid-review edits, lost-response handling, or every synthetic case listed in the deviating ninth AC. No live tracker writes occur during any eval.

Run `npm test` for package checks. Perform the refreshed regressions, deterministic probe checks, read-only comparison, package verification, and required reviews after final spec approval; no proposed-check execution occurs during brainstorming.

## Documentation impact
- Feature / user-facing docs introduced: none.
- Materially amended existing docs: `README.md` - operations/tunable-parameter guidance for `--skip-overlap` and communication contract for the existing menu, enrichment comments, and tracker-neutral capability behavior; `CHANGELOG.md` - user-visible behavior and the single-menu/bypass contract.
- Derived / memory docs invalidated: none.

Apply `reference/documentation-impact.md`. Admit the gathered README and CHANGELOG candidates under the categories above; amend their existing ownership rather than create a product guide. No new settings or persona invalidates `doc/configuration.md` or `doc/personas.md`. Skill/reference files and eval instructions are implementation/test surface, not product-doc entries. The shared AGENTS ticket route remains valid and needs no cross-repo core synchronization.

## Out of scope

- Backlog-wide listing, export, sweeps, clustering, canonical-survivor selection, and duplicate/status transitions. [#61](https://github.com/jjuraszek/pi-gauntlet/issues/61) is separate read-only discovery, not permission for a sweep here.
- Default repair-mode discovery, new runtime tools/services, a search index, persisted cache, cross-session locks, or a general eval-framework extension.
- Automatically merging, absorbing conflicting scope, reopening terminal work, creating remainder tickets, or applying both menu alternatives.
- Making a tracker-specific implementation the generic policy, or guessing unavailable native commands/fields.
- The automated approval/write simulator, its synthetic full-workflow matrix, and claims of exhaustive write-sequence verification.
- Editing the ticket's evaluation criterion; the approved deviation is spec-only.

## Open questions

- Native Linear body-only recall remains unverified after the dedicated read-only probe. Returned descriptions and a non-title hit do not settle indexed fields. Disclose the limitation; no further native probe is required by this proof.
- The four historical labels retain their recorded uncertainty and tuning exposure. A failed or inconclusive read-only comparison is not grounds to change those inputs or claim success; the bounded-run decision returns to the human.
- The 120-second/request/candidate limits are approved first-iteration choices, not calibrated measurements. Record observed cost and overrun; a change to the agreed bounds follows the spec-amendment path, not silent tuning after results.

## Human input

The carried approval removes the automated approval/write simulator and keeps bounded discovery, enrichment recommendations, the existing menu and create-new, established regression evals, four historical cases x two models x before/after x one repetition, and captured native evidence. The user's question was "can we simplify it?" and the reply to that smaller design was "approve". This redraw applies that decision rather than reopening the product architecture.

The remaining contract question and answer were:

> One contract mismatch needs recording: [the ticket's final acceptance criterion](https://github.com/jjuraszek/pi-gauntlet/issues/60) still requires synthetic continuation and mid-review-edit evaluations that the approved 16 read-only sessions will not demonstrate. The simplification stays approved; this choice only determines where that reduced proof scope is recorded.
>
> A) Record a spec deviation, preserving the ticket row verbatim.
> B) Repair the ticket's evaluation criterion to match the approved proof, preserving its product requirements.
>
> Recommendation: B - keep the ticket and implementation contract aligned.

User: A
