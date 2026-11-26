# One definition of an acceptance criterion and a non-blocking Integration section

**Goal:** Every step of the flow sorts a requirement the same way. One shipped definition says an acceptance criterion is a functionality or constraint that files deliver and a check in the checkout proves; everything else asked around the change is an `Integration` entry that is carried word for word, never judged and never blocking. The `venue:` disposition, the `Post-deployment housekeeping` section name and each step's own sorting rule are removed.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #172
**Predecessor:** doc/specs/2026-11-16-gh-151-delivery-stage-audit-exclusion.md, D2-D8
**Predecessor:** doc/specs/2026-11-20-gh-154-shared-ac-class-table.md, the six-row table content in D1, the cut-question pointer in D3 and their pins in D4
**Predecessor:** doc/specs/2026-11-06-workflow-stage-acceptance-rows.md, fully
**Predecessor:** doc/specs/2026-10-09-ac-coverage-dispositions.md, the `venue:` disposition in Vocabulary, D1's venue stripping, D2's gate line and D3's production-venue blocker
**Predecessor:** doc/specs/2026-09-20-gh-41-ticket-acs-carried-into-spec.md, the `venue:` disposition in every section and "Finish - surface what waits for deploy"

## Problem

The flow has no shared definition of an acceptance criterion. Each step words the boundary itself, so the same row is sorted differently depending on which step reads it, and a row no checkout can prove reaches an implementing worker.

### Where the boundary is worded today (worktree at base `b36016fc`)

| Site | Its own rule |
|---|---|
| `skills/shape-ticket/SKILL.md:160-172` | Behavioral AC is "verifiable pre-prod"; deploy-window rule: fulfillable before production, staging proofs equal, "never names an environment - the spec picks the venue"; prod-only goes to `Post-deployment housekeeping`; stage proof drops |
| `skills/shape-ticket/reference/ac-classes.md:9-10` | `Post-deployment` relocates; `Workflow-stage proof` drops with a retained Reporter note |
| `skills/gauntlet/brainstorm/ticket-acceptance.md:20,30,34,47,58-59` | Five dispositions including `venue: <env> - <observation>`; a stage-proof row triggers a cut question; "Change or post action" sort with a bold housekeeping paragraph in Design; drafted-row classes repeat the table |
| `skills/gauntlet/brainstorm/spec-finalization.md:14,152,160` | Keeps pre-production proof as `venue:`; `Scope cuts:` lists venue rows; engine recommendation reads `in-scope` and `venue:` |
| `agents/spec-council-member.md:23,34` | A `venue:` naming production is `[blocker] scope` |
| `agents/spec-council-applier.md:47` | Its own operator-step and stage-proof sentence |
| `skills/gauntlet/plan/plan-contract.md:232-234` | Tables `in-scope` and `venue:`; separate exclusion list (housekeeping paragraph, person step, commit text, stage clause) with a mixed-row split and an `Excluded citation` line |
| `skills/gauntlet/implement/loop/loop.md:39`, `unreachable-returns.md:9,12` | `venue:` rows start `open`; an unreachable `venue:` row stays on the failed-attempt path |
| `agents/conformance-reviewer.md:43,45,154-155`, `skills/gauntlet/conformance-check.md:63` | "A requirement is something files can deliver" plus a three-part exception with mixed-row truncation; a `venue:` row is delivered through its Design clause |
| `skills/gauntlet/ship/ship.md:315-321` | PR body appendix lists `venue:` rows |
| `skills/gatekeep-pr/reference/findings.md:13-19`, `verification-brief.md:384`, `reference/post-selection-loop.md:218-227` | Mechanism half and observation half, `not judged here`, `venue: ... checked before prod deploy` |
| `skills/check-delivery/SKILL.md:145-151,231-256` | Reads the ticket's AC section only and observes every observable row on the configured target; no sorting rule at all |
| `extensions/plan-tracker.ts:71` | Disposition regex includes `venue` |
| `scripts/ci.mjs:315-320`, `scripts/brainstorming-contract.test.mjs`, `scripts/loop-unreachable-cut.test.mjs:24,52`, `scripts/gatekeep-comment-reconcile.test.mjs:469-470`, `scripts/delivery-stage-authoring.test.mjs` | Wording pins for the rules above |
| `README.md:39,168`, `doc/configuration.md:136,185`, `doc/gate-contract.md:170`, `doc/implement-engines.md:127` | Restate the five dispositions and the post-action term |

Only `ticket-acceptance.md` and `shape-ticket/SKILL.md` point at a common file (`ac-classes.md`).

### Evidence from two private consumer repos (anonymized as A and B)

Read-only survey on 2026-11-25 over committed specs, loop ledgers, overrides files, 24 tracker tickets and recorded sessions. Private references stay out of this file.

| Ticket claim | Result |
|---|---|
| A loop run stopped seven times in six hours on one row; the human replied "you should end with PR and post merge actions" | Held in count, duration and quote. Corrected in cause: the row was a ticket row stating a repository end state, `in-scope`; the spec's Design made it wait on an external data move and on delivery receipts nobody held. Every stop followed a worker `unreachable:` return. |
| Rows a checkout cannot prove reach workers | Held. B: 46 of 125 loop ledgers carry `unreachable:`, for 27 distinct reasons (human approval or ticket comment pending 9, data unavailable 6, tool or sandbox 5, not deployed 2, CI 2, other 3). |
| The same kind of row is sorted differently | Held. Non-change rows are 9.0% of 652 rows (A) and 3.7% of 779 (B) and carry `in-scope`, `venue:`, `deviates:` and `deferred:`; one identical row is `venue: stg` in one spec and `deferred:` in another. |
| `venue:` marks a staging observation beside a behavior | Corrected. A: 16 of 20 recent tags name no deployed environment (CI, a person's machine, external state, a local stand-in). B: about 50 of 65 are real deployed-environment checks. |
| Largest non-change class | Corrected: pipeline-stage proof is the largest class in A (29 of 52) and is absent from the ticket's definition. |
| Tracker-write rows | Comment rows: 0 in A, 3 in B, all requiring a comment that predates the work; two runs stalled on them. Status or label rows: 0. |
| Before-merge and before-deploy work has no place | Held: 7 sections under the post-deploy heading hold such steps; 160+ author-named rollout or sequencing headings; several procedures run 5-26 lines. |
| Entries lack timing, actor or done-check | Held: all three present in 5 of 16 (A) and 10 of 33 (B) sections. |
| Rows depending on data the ticket does not supply | Held, small: 2-5 rows per repo. |
| An unconfigured delivery target beside documentation naming one | Not found: both repos configure a target. |
| Consumer overrides restate the old rule | Held: B has two lines sorting rows by environment, A one. |
| Multi-leg | Held: ownership is by `scope: AC <n>`; cross-repo order lives in Design prose; the ticket has no multi-leg row. |

### Premises checked in this repository

| Claim | Lookup | Result |
|---|---|---|
| Ticket shaping relocates only production-only observations | `skills/shape-ticket/reference/ac-classes.md:9`, `SKILL.md:172` | Held |
| Spec writing tags pre-production proof `venue:` and sends post actions to a bold paragraph | `ticket-acceptance.md:20,34,56` | Held |
| Loop seeds `venue:` rows `open`; a worker missing an environment returns `unreachable:` | `loop.md:39`, `agents/loop-implementer.md:42-43` | Held |
| A row with no recognized disposition line is seeded as in-scope | `loop.md:39` ("explicit/absent `in-scope`") | Held |
| The merge gate judges ticket-level delivery | `skills/gatekeep-pr/reference/findings.md:11-28`, `reference/assessment.md:98-103` | Corrected: it reads the spec at the assessed head; its ticket cross-check is informational and "never judges a ticket row the spec does not carry" |
| Removing `venue:` leaves staging checks ungraded | `skills/check-delivery/SKILL.md:145-151,245-248` | Corrected: the delivery check reads the ticket's rows and observes them on the configured target; it never reads a disposition |
| The delivery check treats a missing target as non-blocking | `skills/check-delivery/SKILL.md:215-241` | Held: stage 2 skipped, `unverified: no delivery target` |
| Ticket shaping keeps displaced rows | `skills/shape-ticket/SKILL.md:90,157`, `reference/repo-audit.md:115` | Held: every moved, removed or split row is kept verbatim in the accumulated Reporter note |
| The drafted-row `Tree-wide` split is the only rule forcing finer rows | `skills/shape-ticket/SKILL.md:157` | Corrected: ticket shaping's uniqueness rule also says "Split independent bundled observations into one row per observation" |
| No `extensions/lib` source names `venue` | `rg venue extensions` | Held: one regex in `extensions/plan-tracker.ts:71`; fixtures in `extensions/plan-tracker.test.ts:621` and `extensions/lib/plan-check.test.ts:12,58,68` |
| Unconfigured delivery target in a live run | Both consumer overrides files | Not checked: both configure one; today's verdict stays |

Implicit dependencies: ticket-named source paths - `git cat-file -e HEAD:<path>` on 17 names - found. `bin/gauntlet-spec-index.mjs` - run from the worktree - found. Deterministic and replay-backed eval tests - `scripts/ci.mjs:558`, `eval/README.md` `## CI` - found.

### Decisions from the questionary

Framing: pivoted to boundary only - the requester picked it and named its core: "B also brings changes to ACs definition. its essential that ACs are defined as checkable from file change perspective. current failure mode is related to AC not having common def shared across the repo!" The ticket's ticket-comment lifecycle, delivery-target discovery, entry format and listings, sample-data handling and legacy guards leave this spec; the rows that ask for them take `deviates:`.

Requester constraints, carried as requirements:

- "make sure we don't enforce ACs to be to granular, they still need to define functionality to be delivered or constraints in non prescriptive way".
- Integration never blocks implementation, the pull request or the delivery check; it is a TODO list and a sanity-check list for the target environment.
- Brainstorming gets no extra question; the first ticket check gets the capability.
- No belt-and-suspenders; fewer conditionals; a badly shaped ticket must not bring the problem back; the flow works with any input.
- Ticket shaping is the first layer, brainstorming with council and conformance the second, the delivery check the last; the merge gate judges one pull request's code. Multi-leg tickets keep working.

Approach: one owner file, two buckets (acceptance criterion or Integration entry). Pipeline-result rows become Integration entries instead of being dropped with a retained note.

Ticket #172's Reporter notes hold earlier bodies displaced by five repairs. They add no requirement beyond the current body; the delivery-target and comment decisions among them are the ones rows 25, 30-34 and 48-51 state.

## Acceptance criteria

Ticket #172, Acceptance Criteria, rows verbatim:

- [ ] Ticket shaping, spec writing, the review after implementation (`agents/conformance-reviewer.md`) and spec-council edits (`agents/spec-council-applier.md`) each carry this definition word for word, or point to the one shipped file that does: "An acceptance criterion is a requirement that a change to the repository's files or a comment on the ticket delivers. It names no environment, unless the behavior it requires is itself the handling of an environment name. A check in the checkout proves a file change with data the ticket supplies, links or describes. A comment is proved by its text: the draft before it is posted, the ticket afterwards. `Integration` holds what the change needs around its deployment that neither delivers: a step a person performs, a condition that must hold before the change merges or deploys, a state an environment must reach, and a sanity check or data verification that needs a deployed environment or real data. An entry may name an environment and states when it applies, who acts, and how to tell it is done. Neither implementation, the review after it, the pull request offer, the merge gate nor the delivery check blocks on an entry, gives it a verdict or performs it; the one exception is the merge gate, which may run an after-merge entry assigned to the person merging, on that person's pick."
  deviates: the shared definition ships in other words - no ticket-comment clause, no required entry details, no merge-gate exception sentence; the four named places point to the one file that holds it
- [ ] Given a fetched ticket whose acceptance rows are these seven - "the importer rejects a row without an id", "the cutover steps are posted as a comment on the ticket", "the operator runs the cutover", "the change merges only after the vendor confirms the fix", "the staging queue is empty before the deploy", "after deploy to staging, login succeeds against the real identity provider" and "the ticket is moved to In Review" - and a spec that carries only the first two as acceptance rows, the review after implementation reports none of the other five as missing from the spec's acceptance criteria.
  in-scope
- [ ] Given the same ticket and spec, a spec-council edit adds none of those five rows to the spec's acceptance criteria and reports none as missing from them.
  in-scope
- [ ] After the change, none of the four places that state a rule of their own today (`skills/shape-ticket/reference/ac-classes.md`, the deploy-window rule in `skills/shape-ticket/SKILL.md`, "Change or post action" and the drafted-row class table in `skills/gauntlet/brainstorm/ticket-acceptance.md`, and `agents/conformance-reviewer.md`) and none of the three that apply one (`agents/spec-council-applier.md`, `skills/gauntlet/plan/plan-contract.md`, and `skills/gatekeep-pr/reference/findings.md`) states a rule that sorts one of those seven rows differently from the definition, or that sorts a sanity check differently when it names production instead of another deployed environment.
  in-scope
- [ ] Given source material with a row that names an environment beside a behavior a file change delivers (for example "on staging, the importer rejects a row without an id"), when ticket shaping creates or repairs the ticket, the row at its confirmation gate states the behavior without the environment name, and the original row text is kept in the Reporter note.
  in-scope
- [ ] Given source material with a row whose behavior is itself the handling of an environment name (for example "the deploy script refuses the target `production` without the confirm flag"), when ticket shaping creates or repairs the ticket, the row at its confirmation gate reads as written.
  in-scope
- [ ] Given source material with a row of one of these kinds - a step a person performs ("the operator runs the cutover"), a condition on merging or deploying ("the change merges only after the vendor confirms the fix"), a state an environment must reach ("the staging queue is empty before the deploy"), a check only real data can show ("after the cutover, no production order carries the legacy status"), or a sanity check on a deployed environment ("after deploy to staging, login succeeds against the real identity provider") - when ticket shaping creates or repairs the ticket, the body at its confirmation gate lists it under `Integration` and not under Acceptance Criteria, with the original row text kept in the Reporter note.
  in-scope
- [ ] Given the source row "once it is live on production, the operator compares the order total with the total read before the deploy", the `Integration` entry in the body at ticket shaping's confirmation gate is one list item that states when it applies (`after deploy to production`), who acts (the operator), what is done or must hold (compare the order total) and how to tell it is done (it equals the total read before the deploy); the timing keeps the source's own trigger relative to merge or to a deploy, with the environment when the source names one.
  deviates: an entry is one list item in its source's words with no required details
- [ ] Given source material that names, in this order, a step due after deploy to production, a step due before merge and a step with no timing, the `Integration` section at that gate lists the before-merge entry first, the after-deploy entry second and the entry with no timing last.
  deviates: entries keep their source order; no timing sort
- [ ] Given only the source row "the operator runs the cutover", the entry at that gate reads `not stated` for when it applies and for how to tell it is done; ticket shaping invents neither.
  deviates: no `not stated` placeholder; the entry reads as the source wrote it
- [ ] Given a body with an entry that reads `not stated` for a detail, ticket shaping's confirmation gate names those entries once, and the ticket is not filed as not-ready for that reason.
  deviates: with no required details the gate has nothing to name
- [ ] Given a ticket or spec written before this change whose section is headed `Post-deployment housekeeping`, spec writing, both implementation engines, the review after implementation, the pull request offer, `gatekeep-pr` and `check-delivery` each handle its entries as the rows of this ticket describe for an `Integration` section.
  deviates: no step reads the old heading as a second section name; an old-heading ticket section is raw input whose entries the first ticket check carries to the spec's `Integration`
- [ ] Given such a section with the entry "the operator runs the cutover", which states no timing, the pull request offer and `gatekeep-pr`'s report list it with the entries whose timing is `not stated`, not as an entry due after deploy.
  deviates: neither the pull request offer nor the merge-gate report lists entries
- [ ] Given such a section, `gatekeep-pr` offers the person merging the same after-merge actions from it that it offers today.
  in-scope
- [ ] Given a ticket with such a section, when ticket shaping repairs it, the body at its confirmation gate carries the heading `Integration` and no `Post-deployment housekeeping` heading, with every entry kept.
  in-scope
- [ ] Given source material with a mixed row (a migration script and its run on live data), when ticket shaping creates or repairs the ticket, the script requirement stays under Acceptance Criteria and the run moves to `Integration`.
  in-scope
- [ ] Given source material with a row asking for a written note, whether the note lives in the repository (for example "the changelog tells the operator to set the flag before deploying") or on the ticket ("the cutover steps are posted as a comment on the ticket"), when ticket shaping creates or repairs the ticket, the row stays under Acceptance Criteria.
  deviates: a note in the repository stays an acceptance row; a comment on the ticket is a tracker update and moves to `Integration`
- [ ] Given source material with a row asking for a tracker write other than a comment on the ticket (for example "the ticket is moved to In Review" or "the ticket carries the label migrated"), when ticket shaping creates or repairs the ticket, the body at its confirmation gate does not list the row under Acceptance Criteria, the gate says once that a comment is the only tracker write an acceptance row may ask for, and the original row text is kept in the Reporter note.
  deviates: the row moves to `Integration` like every tracker update; the gate carries no sentence about comments
- [ ] Given an acceptance row whose proof depends on data (for example "the importer rejects the three malformed rows"), when ticket shaping creates or repairs the ticket, the body at its confirmation gate contains the sample data, a link to it, or instructions to create synthetic data that restate facts the source or the human supplied; when neither supplies them, the ticket is filed as not-ready with the missing data named.
  deviates: no sample-data requirement and no not-ready filing for it
- [ ] Given a fetched ticket that was never repaired, with the acceptance rows "the importer rejects a row without an id", "the operator runs the cutover", "the change merges only after the vendor confirms the fix", "the staging queue is empty before the deploy" and "after deploy to staging, login succeeds against the real identity provider", the spec brainstorming writes carries only the first as an acceptance row, and the other four appear as entries in the spec's `Integration` section.
  in-scope
- [ ] Given that ticket, the design-approval summary lists each of the four once as not an acceptance criterion with the reason, and brainstorming asks no question about them.
  in-scope
- [ ] Given a fetched ticket whose only acceptance row is "the operator runs the cutover", brainstorming says the ticket has no usable acceptance criteria, treats the ticket as a prompt, and drafts acceptance rows from the design as it does today for a ticket with none.
  in-scope
- [ ] Given a fetched ticket with the acceptance row "on staging, the importer rejects a row without an id", the spec carries the behavior "the importer rejects a row without an id" as the in-scope acceptance criterion with no environment tag, keeps the ticket's original wording visible as its source, and implementation closes it with a check run in the checkout.
  deviates: the ticket row stays word for word as the in-scope row with no environment tag and is proved by a check in the checkout; the row is also copied to `Integration` as a live check
- [ ] Given a fetched ticket with the acceptance row "the importer rejects the three malformed rows" and no rows supplied, linked or described, brainstorming asks once for the data before design approval and records the answer in the spec; it invents no rows. When the answer supplies no sample, link or recipe, the row is listed once as not an acceptance criterion with the missing data named.
  deviates: brainstorming asks no data question
- [ ] Given a fetched ticket with the acceptance row "the cutover steps are posted as a comment on the ticket", the spec carries it as an in-scope acceptance row; brainstorming neither lists it as not an acceptance criterion nor moves it to `Integration`.
  deviates: the row is a tracker update and moves to `Integration`
- [ ] Given a fetched ticket that was never repaired, with the acceptance row "the ticket is moved to In Review", the spec does not carry it as an acceptance row; the design-approval summary lists it once as not an acceptance criterion with the reason, and brainstorming asks no question about it. Neither the review after implementation, a spec-council edit nor `gatekeep-pr` reports the row as missing.
  in-scope
- [ ] Given a fetched ticket whose `Integration` section holds "before deploy to staging - operator: drain the queue; done when the queue length reads 0", the spec's `Integration` section carries that entry word for word.
  in-scope
- [ ] Given that entry and a design that adds the commands, their order and the way back for it, the spec writes them beneath the entry in its `Integration` section, never as an acceptance row, a Tests line or a Design imperative.
  in-scope
- [ ] Given a design that itself finds an entry of any kind - a step, a condition, a state, a sanity check or a data verification - in a run with a ticket or without one (for example "after deploy to production, the order total equals the total read before the deploy"), the spec writes it in its `Integration` section as one entry line with when it applies, who acts and how to tell it is done, and not in the design text.
  deviates: the entry is one line in the design's own words with no required details; it is written in `Integration` and not in the design text
- [ ] Given an approved spec with the in-scope row "the cutover steps are posted as a comment on the ticket", implementation drafts the comment and posts nothing, and the review and the pull request offer use that same draft: when the run offers its pull request, the ticket carries no such comment yet, the run shows the human the exact comment the review judged, formatted as it will appear on the ticket, once and only at that offer, and neither implementation engine (loop, task plan) has stopped to ask about the row, cut it, or reported it as a manual step.
  deviates: a ticket comment is an `Integration` entry; no step drafts, shows, posts or judges it
- [ ] Given that pull request offer, when the human approves the displayed comment, the run posts it to the ticket unchanged; without that approval nothing is posted.
  deviates: a ticket comment is an `Integration` entry; the run posts nothing
- [ ] Given an approved spec with the in-scope row "the cutover steps are posted as a comment on the ticket", the review after implementation, which runs before the comment is posted, judges the row from the drafted comment: met when the draft carries the cutover steps, with posting still waiting for the human's approval, and missing when there is no draft or the draft lacks them. It does not report the row missing because the ticket has no such comment yet.
  deviates: a ticket comment is an `Integration` entry; the review gives it no verdict
- [ ] Given a pull request whose spec has the in-scope row "the cutover steps are posted as a comment on the ticket" and whose diff contains no change for it, `gatekeep-pr` judges the row from a read of the ticket: covered when a comment carries the cutover steps, a gap when none does; the missing change in the diff alone is not a gap.
  deviates: a ticket comment is an `Integration` entry; the merge gate reads no ticket for it
- [ ] Given a delivered ticket with the acceptance row "the cutover steps are posted as a comment on the ticket", `check-delivery` judges it from the ticket's comments, which it already reads: satisfied when a comment carries the steps, not met when none does, as for any unmet row today. The row needs no delivery target.
  deviates: a ticket comment is an `Integration` entry; the delivery check lists it without a verdict
- [ ] Given a ticket or approved spec whose `Integration` section holds these six entries - "before merge - requester: confirm the vendor shipped the fix; done when the vendor's release notes list it", "before deploy to staging - operator: drain the queue; done when the queue length reads 0", "`not stated` - operator: run the cutover; done when `not stated`", "after merge - person merging: tag the release; done when the tag exists", "after deploy to staging - operator: log in through the real identity provider; done when the login succeeds" and "after deploy to production - operator: compare the order total; done when it equals the total read before the deploy" - neither implementation engine (loop, task plan) gives one to a worker or task.
  in-scope
- [ ] Given the same six entries, the review after implementation gives none a verdict and raises none as a blocker.
  in-scope
- [ ] Given the same six entries, `gatekeep-pr` gives none a verdict and raises none as a blocker.
  in-scope
- [ ] Given the same six entries, `gatekeep-pr` offers the person merging the after-merge actions it offers today, the entry "tag the release" among them, and runs one only on that person's pick.
  in-scope
- [ ] Given the same six entries on a delivered ticket, `check-delivery` lists each once in its report as not checked, gives none a verdict, executes none, and none changes its outcome.
  in-scope
- [ ] Given an approved spec with the same six entries, when the run offers its pull request it lists the first three entry lines word for word above its options, once, without what the design wrote beneath them, and not the last three.
  deviates: the pull request body carries the whole section; the offer lists nothing above its options
- [ ] At that offer the run asks no question about any entry, and none changes which options are offered.
  in-scope
- [ ] Given a pull request whose spec has the same six entries, `gatekeep-pr`'s report lists the first three entry lines word for word before its merge option, and merging stays the human's pick as today.
  deviates: the merge-gate report lists no entries
- [ ] Given a delivered ticket that was never repaired, whose Acceptance Criteria section holds "the importer rejects a row without an id", "on staging, the importer rejects a row without a name", "the operator runs the cutover", "after deploy to staging, login succeeds against the real identity provider" and "the ticket is moved to In Review", and a configured `delivery target` that is not staging: `check-delivery` judges the first two against the configured target (the word "staging" selects nothing) and gives the last three no verdict - its report lists each once as not an acceptance criterion with the reason, none changes the outcome, and the status row causes no tracker write.
  in-scope
- [ ] Spec writing gives an acceptance row one of four dispositions (`in-scope`, `deviates:`, `deferred:`, `elsewhere:`) and never `venue:`.
  in-scope
- [ ] No shipped skill, agent persona, extension, `doc/` page or `README.md` describes or accepts `venue:` as a disposition; this covers the disposition parser in `extensions/plan-tracker.ts`, the assertion in `scripts/ci.mjs`, `README.md`, `doc/configuration.md`, `doc/gate-contract.md`, `doc/implement-engines.md`, `skills/gauntlet/brainstorm/spec-finalization.md`, `skills/gauntlet/plan/plan-contract.md` and `skills/gatekeep-pr/`.
  in-scope
- [ ] Given a spec approved before this change with the acceptance row disposition `venue: staging - the importer rejects a row without an id`: the review after implementation reports the disposition as outside the allowed set, as it does today for any unknown word, and neither implementation engine gives the row to a worker or task - each reports the row and its unknown disposition instead.
  deviates: the review reports the unknown disposition as today; the engines add no guard and run the row as in-scope, the default for a row with no recognized disposition
- [ ] Given a `## delivery` configuration with a `delivery target`, `check-delivery` verifies against it, the slot it reads today, and the report names that target.
  in-scope
- [ ] Given no `delivery target` and repository documentation that names exactly one place to check a shipped change and how to read the shipped version there (for example a README with one staging URL and its version endpoint, or for a package a registry query), `check-delivery` uses that documentation as its target without asking: its report and evidence comment name the document as the source, and the row "the importer rejects a row without an id" is judged from an observed rejection only after the deployed version matches the shipped commit; when the version cannot be matched, the row is reported unverified with the missing evidence named.
  deviates: the delivery check reads no documentation for a target; without a configured target an observable row stays `unverified: no delivery target`
- [ ] Given no `delivery target`, a ticket with the rows "the importer rejects a row without an id" and "the cutover steps are posted as a comment on the ticket", and repository documentation that names two deployed environments without saying which one verifies delivery, `check-delivery` stops before judging any row, writes nothing to the tracker and does not offer to record delivery; its message names both environments and the configuration line to add and asks which one to use. It continues only after the human names one, and picks no target itself.
  deviates: the delivery check adds no stop for a missing or ambiguous target
- [ ] Given no `delivery target`, a ticket with the rows "the importer rejects a row without an id" and "the cutover steps are posted as a comment on the ticket", and repository documentation that does not say both where a shipped change is checked and how to read the shipped version there (no mention at all, or a README that gives only a staging URL), `check-delivery` stops before judging any row, writes nothing to the tracker and does not offer to record delivery; its message names what is missing and the configuration line to add. It continues only after the human supplies a target, and invents none.
  deviates: the delivery check adds no stop for a missing or ambiguous target
- [ ] Given no `delivery target`, no such documentation, and a ticket none of whose rows describes behavior observable on a running system (for example "the README documents the flag" and "the cutover steps are posted as a comment on the ticket"), `check-delivery` does not stop for a target and judges the rows from the shipped files and the tracker.
  deviates: no target discovery exists, so there is no stop to skip; the comment row is an `Integration` entry
- [ ] Given a ticket with the acceptance row "the importer rejects the three malformed rows" and, beneath it, the sample rows `,Ann`, `7,` and `x,"Bo`, the end-to-end scenario in `check-delivery`'s report feeds those three rows to the importer, expects three rejections, and names the sample as its data; given the same row with no sample, link or instructions, the report names the gap for that row and invents no data.
  deviates: no sample-data handling in the delivery check

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: ac-integration-section
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/configuration.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: doc/install-internals.md
Rules: doc/personas.md
Rules: .pi/gauntlet.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/forge-skill/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/gauntlet-resume/reference/coordinated.md
Rules: skills/gauntlet/legs.md
Rules: skills/gauntlet/ship/legs.md
scope: none
design: owns every path named in Design D1-D8 under `skills/`, `agents/`, `extensions/`, `scripts/`, `eval/`, `README.md`, `doc/configuration.md`, `doc/gate-contract.md`, `doc/implement-engines.md` and `CHANGELOG.md`; the observable outcomes are the in-scope rows above and the clauses of Design and Errors and edge cases.

## Design

Three roles. The **owner file** states the definition once. **Sorters** apply it where rows arrive raw: ticket shaping, brainstorming's first ticket check, the delivery check. **Readers** of a spec trust its two sections and carry no sorting rule: the plan, both engines, the loop worker, the merge gate, the pull request step. Council and the conformance reviewer are the second layer: they read the definition and check the sorters' result.

Every skill, persona and prompt edit below follows `skills/forge-skill/SKILL.md` authoring rules; persona frontmatter stays byte-identical.

### D1 - the owner file

Replace the content of `skills/shape-ticket/reference/ac-classes.md` (path unchanged) with three parts.

**Definition**, in these words:

> An acceptance criterion states a functionality or a constraint the change delivers: what is observed, not how it is built. One row may cover several scenarios of one functionality. It holds when the files at the delivered commit make it true and a check run in a checkout of that commit shows it.
>
> Everything else asked around the change is an `Integration` entry. An entry is one list item in its source's words, never judged and never blocking.

**Entry kinds**, the reason a sorter names. The kinds say why a row is an entry; the definition is the boundary. An obligation no file delivers is an entry also when no kind names it exactly, and the sorter names the nearest kind:

| Kind | Example |
|---|---|
| `person step` | "the operator runs the cutover" |
| `merge or deploy condition` | "the change merges only after the vendor confirms the fix" |
| `environment state` | "the staging queue is empty before the deploy"; a deploy or a data move that happens outside the change |
| `live check` | "after deploy to staging, login succeeds against the real identity provider"; "after the cutover, no production order carries the legacy status" |
| `tracker update` | "the ticket is moved to In Review"; "the cutover steps are posted as a comment on the ticket" |
| `pipeline result` | a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run; commit message text |

**Sorting rules**:

1. A row whose functionality is itself the handling of an environment name, pull-request text or a pipeline (a deploy script that refuses a target, a workflow file, code that writes pull-request text) is an acceptance criterion.
2. A row that joins a functionality with an entry (an environment it is observed on, a run on live data, a person's step) is an acceptance criterion for the functionality alone; the rest is an entry. Only the external observation or obligation is the entry: a literal or term that defines the functionality (the target `production` in a script's rejection rule) stays part of the criterion.
3. In doubt whether files deliver the functionality, the row is an acceptance criterion. Doubt about which kind names an entry is not that doubt.
4. Production is an environment like any other: a check sorts the same whether it names production or staging.

Keep the class table below these parts with four rows, byte-identical to today: `Wishful`, `Tautological`, `Unspecified-but-binding`, `External-input dependency`.

- Remove: the `Post-deployment` and `Workflow-stage proof` class rows, with the `retired workflow-stage proof:` retention wording.
- Add: the definition, the kinds table and the four sorting rules.

### D2 - ticket shaping (first layer)

In `skills/shape-ticket/SKILL.md`:

- Remove: the deploy-window rule paragraph (`:172`); the pull-request-text exception sentence (`:166`, now sorting rule 1); the "merely prod-only relocates; one that is only a stage proof drops" half of the precedence sentence (`:168`); `Post-deployment housekeeping` in the body template (`:76`) and the heading-scaffolding list (`:271`).
- Add: one instruction to sort every source row and clause by the definition in `reference/ac-classes.md`. An acceptance criterion stays under Acceptance Criteria. An entry becomes one list item under an optional `## Integration` section in the source's words. For a mixed row (sorting rule 2) the functionality stays under Acceptance Criteria, stated without the external clause (the environment it is observed on, the live run, the person's step), and that clause moves to `Integration`; a literal that defines the functionality stays in the row. The existing displaced-text rule keeps every moved or rewritten row in the Reporter note; no label is added to it.
- Add: on repair, a section headed `Post-deployment housekeeping` is renamed `Integration` with every entry kept.
- Add: `Integration` in the body template and the heading-scaffolding list in place of the old name.
- Replace, in AC uniqueness (`:157`), "Split independent bundled observations into one row per observation; keep nested detail attached to its row and same-subject rows with different results separate" with: split a row only when it bundles different functionalities; scenarios of one functionality stay one row, and nested detail stays attached to its row. The implied-row test in the same paragraph compares an observable with another row's text, not with its "setup, action, and result text".
- Replace, in the behavioral-AC bullet (`:160`), "must name setup, action, and observable expected result, verifiable pre-prod" with: states a functionality or a constraint whose result is observable; no setup/action/result format is required and one row may cover several scenarios.
- Replace, in the evidence gate's bug-ticket sentence, "Require bug repro steps + observed-vs-expected in the gate's Evidence list and the AC rows' setup/action/result" with: require bug repro steps and observed-versus-expected in the gate's Evidence list; the acceptance row states the expected result and takes no setup/action/result format.
- Keep: the no-AC failure. A ticket whose rows all sort out recovers a real acceptance row or is parked, as today.

In `skills/shape-ticket/reference/examples.md`: replace the `Workflow-stage proof` example (`:22`) with one showing a pipeline-result row landing under `Integration`.

In `skills/shape-ticket/reference/repo-audit.md:128` (the supported-scenario fold-in): replace "strip venue names and credentials from ACs" with: strip credentials from ACs; an environment, run or step clause is left to the sort above, which removes the external clause and keeps a literal that defines the functionality. In the same row, replace "Fill setup/action gaps in rows stating the failure" with: record the scenario's setup and action in the gate's Evidence list; the row keeps the expected result. In the scenario-footer paragraph of the same file, scenario setup/action and observed-versus-expected lines go in the gate's Evidence list only, with the expected result retained in the acceptance rows. In its roast-input sentence, replace "exactly the draft, snapshot, and two reference paths" with a pointer to the reference paths the main file's roast dispatch shape names, so the definition file reaches the reviewers and the count lives in one place.

The main file stays under the 50,000-byte instruction-size limit: the definition lives only in the reference file.

### D3 - brainstorming's first ticket check and spec writing

In `skills/gauntlet/brainstorm/ticket-acceptance.md`:

- Remove: `venue: <env> - <observation>` from the disposition list and the sentences about a venue row's enabling change and production venues (`:20`); the workflow-stage row of the cut-question trigger table (`:30`); the "Change or post action" paragraph (`:34`); "Keep environment-bound pre-production proof as `venue:`" (`:47`); the `Post-deployment` and `Workflow-stage proof` rows of the drafted-row class table (`:58-59`); the `retired workflow-stage proof:` sentence in the opening paragraph; `venue:` from the `Scope cuts:` sentence of the cut-question paragraph (`:24`).
- Add: **sort at extraction**. After extracting the ticket's rows, and before copying a row or assigning a disposition or a `scope:` index, read `../../shape-ticket/reference/ac-classes.md` and sort every raw row by its definition, with no question. The gather draft's `## Ticket acceptance criteria (verbatim)` block and the council `Human input` block keep every raw row in ticket order; the sort changes neither.

| Row is | Spec placement |
|---|---|
| an acceptance criterion | `## Acceptance criteria`, word for word, with a disposition |
| an Integration entry | `## Integration`, word for word, with one indented line beneath it: `ticket row, not an acceptance criterion: <kind>` |
| mixed (sorting rule 2) | `## Acceptance criteria`, word for word, with a disposition like any acceptance criterion; only its external clause is copied to `## Integration`, in the row's own words (`on staging`), as a plain entry |

- Replace: the "rows copied character-for-character" cell of the gathered-result table (`:40`) covers the rows that sort as acceptance criteria. The outcome-removal rule (`:61`) gains: placing an entry under `## Integration` is not a scope cut - it takes no `deviates:` or `deferred:`, no `## Out of scope` entry and no question.
- Add: **dispositions and ownership follow the sort.** The existing repo-group rule applies to every surviving acceptance criterion, a mixed row included: `in-scope` under this repo or a member group, `elsewhere: <repo>` under a known nonmember group. `scope: AC <n>` indices count the checkbox rows of the spec's `## Acceptance criteria` section in section order, cut rows that remain there included; `## Integration` entries are not counted. This count replaces "original AC indices" in the disposition paragraph (`:20`).
- Add: entries of the ticket's `Integration` section, and of a section headed `Post-deployment housekeeping` on a ticket not yet repaired, are carried to the spec's `## Integration` word for word, nested lines included, from the gather draft's `## Ticket Integration entries (verbatim)` block.
- Add: when every extracted row sorts out, the gathered result is `none - ticket has no acceptance criteria` and rows are drafted from the design under that existing branch; the moved rows keep their marker lines.
- Add: **design-found entries**. A commitment of the approved design that is an entry by the definition is written in `## Integration` as one list item in the design's words, never as an acceptance row, a Tests line or a Design imperative. Detail the design adds to any entry (commands, their order, the way back) is written as indented lines beneath that entry. A verification method the design authorizes to prove a file-delivered requirement (a test command, a selected eval run, an action under `### Paid and external actions`) is not an entry: its runner and inputs stay in Design and Tests, and its run result is never an acceptance row. A `## Legs` contract line stays in `## Legs`.
- Replace, in row drafting: "Write one `- [ ]` row per observable outcome the design commits to" (`:47`) with one row per functionality or constraint the design commits to, which may cover several scenarios; "Preserve behavioral binary outcomes with setup, action, and expected result" (`:61`) with: preserve each committed outcome's observable result, with no required setup/action/result format.
- Add: `Integration` to the list of headings whose checkboxes are not acceptance rows when the ticket has no AC heading (beside `Post-deployment housekeeping`, `Out of scope`, `Follow-up`).
- Keep: the cut question with its two remaining triggers, the verbatim rule for ticket rows (a row is never edited, wherever it is placed), the `Tree-wide` and three other drafted-row classes, the council `Human input` block built from the raw verbatim ticket block.

Row 23 as adopted: the ticket row keeps `on staging`, carries no `venue:` disposition (what its disposition line calls "no environment tag"), is proved by a check in the checkout, and the clause `on staging` alone is copied to `## Integration`.

**The spec's `## Integration` section.** Optional; placed directly before `## Errors and edge cases`; omitted when there is no entry. Entries are plain `- ` list items, never checkboxes; a checkbox prefix in the source is dropped. Entries keep their source order: ticket `Integration` entries, then moved ticket rows, then design-found entries.

In `skills/gauntlet/brainstorm/spec-finalization.md`:

- Remove: "retaining environment-bound pre-production proof as `venue:`" (`:14`); `venue:` from the `Scope cuts:` rule and from the engine-recommendation row filter.
- Replace: "draft one observable outcome per row" (`:13`) with: draft one functionality or constraint per row.
- Add: `Integration` to the template headings the second predecessor pass skips.
- Add: one gate line rendered by the main loop from the spec's marker lines, directly below `Scope cuts:`, omitted when no ticket row was moved: `Not acceptance criteria: <row text, first 60 chars> - <kind>; ...`.

In `skills/gauntlet/brainstorm/gatherer.md` (the context-builder prompt, `:174-194`): after the acceptance-criteria rows, the handoff quotes every entry under a ticket heading `Integration` or `Post-deployment housekeeping` verbatim, nested lines included, under its own `## Ticket Integration entries (verbatim)` heading. The `## Ticket acceptance criteria (verbatim)` block is unchanged.

In `skills/gauntlet/legs.md`: the companion file grammar gains `## Integration`, copied verbatim from home between `## Problem` and `## Decisions`, under the same amendment rewrite rule as the other carried parts. The scope grammar (`:169-172,178-179,191,200`) counts indices as `ticket-acceptance.md` does above: checkbox rows of the `## Acceptance criteria` section in section order, cut rows included, `## Integration` entries excluded.

### D4 - council and conformance (second layer)

The caller passes one line `AC definition: <absolute path of ac-classes.md>` in the task, resolved the way `<DOCUMENTATION_IMPACT_GUIDELINE>` is, at every dispatch of a second-layer persona: in `skills/gauntlet/brainstorm/council.md` (member and applier tasks), `skills/gauntlet/amendment-surface.md` (its council-member dispatch), `skills/gauntlet/conformance-check.md` (its reviewer dispatch), `skills/chase-bug/hotfix.md` (its prompt-only `conformance-reviewer` dispatch, `:220`) and `skills/shape-ticket/SKILL.md` (its roast's `spec-council-member` dispatch, `:210`). Every dispatch passes the line, so the personas carry no rule for a task without it.

`agents/spec-council-member.md`:

- Remove: the `venue:` production blocker (`:34`) and the `venue:` escalation clause (`:23`).
- Add: read the definition at the passed path and check placement against it in both directions. Each of these is one `[blocker] scope` finding naming the row or clause and its kind: a spec acceptance row that is purely an entry (no functionality left under sorting rules 1-3); a `Human input` ticket row that is an acceptance criterion by the definition and sits only under `## Integration`; a Design imperative that is a deployment or operational obligation no file delivers. None of these is a finding: a mixed row kept under `## Acceptance criteria`, whatever environment, run or step it names; a `Human input` ticket row that is an entry and is found word for word under `## Integration`; a verification method the design authorizes; a `## Legs` contract line. No entry is graded.

`agents/spec-council-applier.md`:

- Remove: the operator-step and stage-proof paragraph (`:47`).
- Add: read the definition at the passed path. Write an entry a cluster asks for into `## Integration`; never write an acceptance row or Design clause that is an entry by the definition; never add a ticket row that is an entry and sits under `## Integration` to `## Acceptance criteria`.
- Add: before approval, correct a placement a cluster flags, from the `Human input` snapshot and with no question. A pure entry left under `## Acceptance criteria` moves verbatim to `## Integration`, a ticket row with the marker line `ticket row, not an acceptance criterion: <kind>` so that the gate's `Not acceptance criteria:` line lists it. A file-checkable ticket row found only under `## Integration` returns verbatim to `## Acceptance criteria` with the disposition the repo-group rule gives it, and its entry and marker line are removed. A correction that adds or removes an acceptance row changes the row positions the `## Legs` `scope:` lines count: in the same edit the applier rewrites every `scope:` line so each leg owns the same rows in the new order, a removed row leaves every list, and a returned row joins no list (unlisted rows default home). The applier never edits a ticket row's text and never grades or runs an entry.

`agents/conformance-reviewer.md`:

- Remove: the delivery-stage and operator-step exception with its mixed-row truncation (`:43`); the `venue:` sentence (`:45`); the restatements at `:154-155`.
- Add: read the definition at the passed path and apply it to every origin: a ticket row, a prompt sentence, a spec body sentence or clause, a `## Legs` contract line or clause. One that is an entry by it, or that only names a procedural run (a `verification:` command, a suite or CI run, an authorized eval run), is not a requirement and gets no `Rn`, whether or not the spec lists it; a file clause inside such a sentence keeps its own `Rn`. Authorized proof methods and the `## Legs` grammar stay where their runners read them. A spec `## Integration` entry gets no `Rn`, no verdict and is never a finding. An acceptance row is judged on its functionality: the external observation or obligation it names (the environment it is observed on, a live run, a person's step) is not part of the requirement, and a literal that defines the functionality is.
- Keep: a disposition word outside the four is `DRIFTED`, `recommended: fix`.

`skills/gauntlet/conformance-check.md:63`: `in-scope` rows are requirements; drop `venue:`.

### D5 - readers lose their rule

Each reader gains one sentence - `## Integration` entries are not work and not requirements - and loses the rule named. The plan and the merge gate apply one distinction to a mixed acceptance row or Design clause: they table, task, check and judge the file-delivered functionality alone; its external clause, and a Design clause that is only a deployment or operational obligation, is not work, not evidence and not a gap.

| File | Remove | Add |
|---|---|---|
| `skills/gauntlet/plan/plan-contract.md:232-234` | `venue:` from the tabled rows; the exclusion paragraph's own list of excluded classes (`:234`, first sentence) | entries get no table row and no task. Keep, reworded to the definition's terms: a mixed row or clause is tabled for its functionality alone, with its owning task citing the row's anchor in the Spec line and the whole row never omitted; an inline code span in the row's external clause is repeated exactly once, only in the owning task on the line opening `Excluded citation (not work, not an acceptance condition):`, and in no step, acceptance condition or table cell. `extensions/lib/plan-check.ts` checks every inline span of the verbatim anchor, so the citation line lets the plan pass without the external command becoming a task step |
| `skills/gauntlet/implement/loop/loop.md:39` | `venue:` from the rows that start `open` | none |
| `skills/gauntlet/implement/loop/unreachable-returns.md:9,12` | the `venue:` branch and "never convert the disposition to `venue:`"; every row takes the amendment action | none |
| `agents/loop-implementer.md` | none | the sentence, plus: the external observation or obligation a row names (the environment it is observed on, a live run, a person's step) is not part of the row; a literal that defines the functionality is |
| `skills/gatekeep-pr/reference/findings.md:13-19` | the mechanism half and observation half split, the `venue:` clauses, the `not judged here` outcome row | each `in-scope` row and each Design clause is judged on its file-delivered functionality as `covered` or `gap`; the external clause it names is not evidence and not a gap; entries get no outcome and are never a blocker |
| `skills/gatekeep-pr/reference/findings.md:26,28` | `not judged here` from the no-spec-rows sentence; "and observation-half outcomes" from the Coverage sentence | none |
| `skills/gatekeep-pr/reference/report.md:11` | "and observations checked after merge"; "Count a covered mechanism as covered even when its observation waits" | none |
| `skills/gatekeep-pr/reference/report.md:56` (the worked example's opening) | ", and the speed target needs checking after merge" | none |
| `skills/gatekeep-pr/SKILL.md:78` | the `observable half` glossary row | none |
| `skills/gatekeep-pr/reference/assessment.md:103` (the informational cross-check) | none | a ticket row found word for word under the spec's `## Integration` with its marker line `ticket row, not an acceptance criterion: <kind>` is accounted for, each occurrence matched once; the remaining ticket rows are compared with `rows[].text` as today, so a differing or missing row still renders `differs`. `## Integration` is read for this accounting only: it is not added to `rows` or to the judged contract |
| `skills/gatekeep-pr/verification-brief.md:351-361` (the material-claim check) | none | the pull request body's `## Integration` section and its nested text are not claim-checked and get no claim disposition |
| `skills/gatekeep-pr/verification-brief.md:384` | `not judged here` and `venue:` | none |
| `skills/gatekeep-pr/reference/post-selection-loop.md:218-227` | the `venue:` line and "covered; observable half checked after merge" in the coverage block | none |
| `skills/gauntlet/ship/ship.md:315-321` | `venue:` from the disposition appendix and its "before the prod deploy" clause | when the spec has `## Integration`, the pull request body carries that section verbatim after `## Test Plan`, before the disposition appendix; not in the squash-landed message |

`## Integration` is not execution authority: no step runs an entry because it is listed there. The merge gate's PR-named steps (`findings.md` `## PR-named steps`) are a separate, unchanged mechanism: a sentence in the pull request body or spec that assigns the merger an after-merge action is offered as today, whether it sits under `## Integration` or under an old heading, and runs only on the merger's pick; a declined action is not run. The pull request offer in `ship.md` gains no list and no question.

**Every pull request body writer carries the section.** The `ship.md:315-321` template covers a newly created pull request; the other writers carry the same verbatim `## Integration` section, each from its own leg's spec file:

| Writer | Where the section goes |
|---|---|
| `skills/gauntlet/brainstorm/spec-pr.md:30-38` (spec-only draft, at creation) | after the gate summary |
| `skills/gauntlet/ship/ship.md:259-275` (rework) | inside the appended `## Rework` block, the part of the body the flow owns |
| `skills/gauntlet/ship/legs.md` "Execute one choice" and `skills/gauntlet/ship/spec-pr.md` "Push rows 1/2" (coordinated create and update) | each member's body, from that leg's own spec file |

The section is a block the flow owns. A writer that meets an existing body (draft finish, update, rework) compares the body's `## Integration` block with the spec's: when they differ - an amendment added, changed or removed entries - it replaces that block alone, leaving one current copy and every other body byte unchanged; when they are equal, or neither has one, the body is not touched, so `ship/spec-pr.md:47` stays byte-preserving.

### D6 - the delivery check (last layer)

In `skills/check-delivery/SKILL.md`, stage 0:

- Add: after extraction, read `../shape-ticket/reference/ac-classes.md` and sort the rows by its definition before repo-group attribution. A row that is an entry gets no verdict and no AC task; the report and the evidence comment list it once under `Not acceptance criteria:` with its kind. It never changes the outcome and causes no tracker write of its own.
- Add: a mixed row is judged on its functionality against the configured target; an environment name in a row selects nothing.
- Add: entries of the ticket's `Integration` section are listed once under `Integration (not checked):`, with no verdict; none is executed and none changes the outcome.
- Add: one order - extract, sort, synthesize when no acceptance criterion remains, sort the candidates. When the ticket has no AC section or every extracted row sorts out, candidates are synthesized once from the rest of the body: the `Integration` section and the rows already sorted out are not synthesis input. The synthesized candidates are sorted once by the same definition, and a candidate that is an entry is listed like any sorted-out row. When no acceptance criterion remains after that, the entries are listed without verdicts and the existing "Zero ACs after extraction and synthesis" stop (`:163`) applies; the stop is for the missing criteria, never for an entry.
- Add: the stage 2 line of the report and of the evidence comment names the configured target.
- Keep: every existing verdict, stop and write rule, `unverified: no delivery target` included; repo groups, `elsewhere: <repo>` and set mode.

### D7 - parser, pins and docs

- `extensions/plan-tracker.ts:71`: the disposition alternation is `deviates|deferred|elsewhere`.
- `extensions/plan-tracker.test.ts`, `extensions/lib/plan-check.test.ts`: fixtures use the four dispositions; one case asserts a `venue:` line under a row is not a disposition. Run `npm run build:bins` and commit any regenerated bundle.
- Add `scripts/ac-definition-owner.test.mjs`, wired into `scripts/ci.mjs`, asserting:
  1. the definition's first sentence appears in `skills/shape-ticket/reference/ac-classes.md` and in no other file under `skills/`, `agents/`, `extensions/`, `doc/` (outside `doc/specs/`) or `README.md`;
  2. these retired terms appear in none of those places: `observation half`, `observable half`, `mechanism half`, `not judged here`, `Workflow-stage proof`, `Deploy-window rule`, `operator step`, `post action`. `Excluded citation` is not on the list: `plan-contract.md` keeps that line (D5);
  3. the token `venue:`, with or without backticks, appears in no file under `skills/`, `agents/`, `doc/` (outside `doc/specs/`), in `README.md`, or in an extension source file under `extensions/`; extension test files (`*.test.ts`) are outside this check, so the negative parser fixture below stays, and so is a loop ledger under `doc/plans/` (a `*-ledger.md` file whose line 1 is `# Ledger - loop engine`), which is flow bookkeeping removed at finish and may quote the token in its evidence cells;
  4. `Post-deployment housekeeping` appears only in `ticket-acceptance.md` (the heading list and the old-section carry), `gatherer.md` (the handoff's source heading) and `shape-ticket/SKILL.md` (the repair rename);
  5. `ac-classes.md` is named by `shape-ticket/SKILL.md`, `ticket-acceptance.md`, `check-delivery/SKILL.md`, and `AC definition:` by `council.md`, `amendment-surface.md`, `conformance-check.md`, `chase-bug/hotfix.md`, `shape-ticket/SKILL.md` and the three second-layer personas;
  6. `skills/gauntlet/legs.md` names `## Integration` in the companion file grammar.
- Remove the wording pins for the removed rules: `scripts/ci.mjs:315,317,320`; the class-name, post-action and stage-proof assertions in `scripts/brainstorming-contract.test.mjs`; `scripts/loop-unreachable-cut.test.mjs:24,52`; `scripts/gatekeep-comment-reconcile.test.mjs:469-470`. Keep every assertion in those files that pins an unchanged rule.
- Update the pins that quote wording this change moves or rewrites:

  | Pin | Change |
  |---|---|
  | `scripts/ci.mjs:232` (the full-suite-run clause in `ac-classes.md`) | kept: the `pipeline result` kind in D1 carries the clause in the pinned words |
  | `scripts/ci.mjs:234,240,246` (the same clause in `agents/conformance-reviewer.md`, `plan-contract.md`, `agents/spec-council-applier.md`) | removed with the sentences D4 and D5 remove; `ci.mjs:235` (`This is the only exception to`, pinned absent) stays |
  | `scripts/brainstorming-contract.test.mjs:442` ("Assess only `in-scope` and `venue:` rows") | pins the reworded engine-recommendation sentence, which assesses `in-scope` rows |
  | `scripts/brainstorming-contract.test.mjs:449-453` (the `bundle-venue` check id and the `expected.md` pattern) | follow the reworked `spec-gate/recommended-row` sample (D8) |
- Docs: `README.md:39` (four dispositions; the delivery check sentence without `venue:`; a link to `ac-classes.md` in place of any definition text), `README.md:168` (the glossary row becomes `Integration entry`), `doc/configuration.md:136,185`, `doc/gate-contract.md:170` (also the new `Not acceptance criteria:` gate line), `doc/implement-engines.md:127`, and a `CHANGELOG.md` `## Unreleased` entry naming the removed `venue:` disposition and the renamed ticket section as breaking for specs and overrides files that use them.

### D8 - evals

Each target gets its `intent.md` per `eval/README.md`. Samples, one decision each:

| Target / sample | Action | Must hold |
|---|---|---|
| `shape-ticket/venue-stripped` | rework | the row states the functionality without the environment; the original row is in the Reporter note |
| `shape-ticket/workflow-stage-proof`, `workflow-stage-proof-create` | rework | the pipeline-result row is listed under `Integration`; no `retired` label |
| `shape-ticket/pr-body-proof` | rerun | a row whose functionality writes pull-request text stays an acceptance row |
| `shape-ticket/bug-repro-in-evidence` | new | a bug ask with repro steps: the steps and observed-versus-expected are in the Evidence list; the acceptance row states the expected result in the author's words and is not rewritten into setup/action/result |
| `shape-ticket/integration-sort` | new | the five kinds land under `Integration`; a mixed row splits; an environment-handling row reads as written, its `production` literal kept; an old heading is renamed; a row covering three scenarios of one functionality stays one row; a constraint row with no setup/action/result format is kept as written |
| `gauntlet/workflow-stage-ticket-row` | rework | an unrepaired ticket's non-criterion rows land under `## Integration` with marker lines, a ticket `Integration` entry is carried word for word with its nested lines, a mixed row stays under `## Acceptance criteria` word for word with only its external clause copied to `## Integration`, and no question is asked |
| `gauntlet/legs-integration-sorted` | new | on a grouped multi-repo ticket: an earlier pure-entry row moves to `## Integration`; a later surviving row under a companion heading is `in-scope` with `scope: AC <n>` counted in the spec's acceptance section; a mixed row under a known nonmember heading is `elsewhere: <repo>`; the companion file carries `## Integration` verbatim |
| `gauntlet/drafted-row-scenarios` | new | a free-text request for one constraint covering three malformed inputs drafts one row |
| `gauntlet/tree-wide-drafted-row` | rerun | the `Tree-wide` split is unchanged |
| `gauntlet/post-action-sorted` | rework | a design-found step is one entry under `## Integration` with the design's detail beneath it |
| `gauntlet/workflow-stage-drafted-row`, `pr-body-drafted-row` | rerun | no pipeline-result row is drafted |
| `gauntlet/ticket-all-rows-sorted` | new | a ticket whose only row is a person step yields drafted rows under the no-acceptance-criteria header |
| `spec-gate/scope-cuts-listed` | rework | `Scope cuts:` names no `venue:` row; `Not acceptance criteria:` lists each moved row once with its kind |
| `spec-gate/recommended-row` | rework | no check depends on a `venue:` row: the `bundle-venue` check is replaced by one whose first bundled qualifying row follows rows excluded by the three remaining dispositions |
| `spec-council-member/venue-production`, renamed `non-criterion-row-flagged` | rework | a pure live-check row left under `## Acceptance criteria` is a `[blocker] scope` finding; a mixed row that names an environment is no finding; a file-checkable ticket row placed only under `## Integration` is a finding; a ticket row that is an entry and sits under `## Integration` is not reported missing |
| `spec-council-applier/pr-description-finding` | rework | the entry is written under `## Integration`; no ticket row that is an entry is added to the acceptance rows; a flagged pure-entry acceptance row moves to `## Integration` with its marker line and a flagged file-checkable row returns to the acceptance rows, both word for word and with no question |
| `spec-council-applier/placement-keeps-leg-scope` | new | a two-leg spec whose first acceptance row is a flagged pure entry: after the row moves to `## Integration`, each leg's `scope:` line names the same rows it owned before, at their new positions |
| `conformance-reviewer/post-merge-action` | rework | with the seven-row sample ticket, none of the non-criterion rows is reported missing and no entry gets a verdict |
| `conformance-reviewer/mixed-row` | rework | the row is judged on its functionality alone; a literal that defines the functionality stays part of the requirement |
| `conformance-reviewer/legs-verification-line` | rework | a `## Legs` `verification:` line gets no `Rn` and is never `MISSING`; the leg's file clauses keep theirs |
| `conformance-reviewer/prompt-stage-sentence` | rerun | a prompt sentence that names only a stage or a person's step gets no `Rn` |
| `conformance-reviewer/stage-only-sentences` | rerun | a spec body sentence that names only a procedural run gets no `Rn`; a file clause in the same sentence keeps its own |
| `conformance-reviewer/ci-step-is-the-change` | rerun | a workflow file that is the change is a requirement |
| `loop/seed-dispositions` | rework | four dispositions; entries seed no ledger row |
| `loop/unreachable-cut` | rework | every unreachable row takes the amendment cut |
| `plan/post-action-no-task` | rework | entries get no coverage row and no task; for one acceptance row that carries a required behavior literal and an external command, the plan tasks the behavior, the command appears once on the `Excluded citation` line and in no step, and the plan check passes |
| `gatekeep-pr-scope/integration-not-judged` | new | rows are `covered` or `gap`; a mixed row's external clause is not a gap; no entry gets an outcome or is a blocker; the cross-check does not report a ticket row the spec moved with its marker line and still renders `differs` for a ticket row whose text drifted; a live observation under the pull request body's `## Integration` gets no claim disposition |
| `gatekeep-pr-scope/post-merge-menu` | rework | the case names an after-merge action under `## Integration` ("tag the release"); it is offered as today, runs on the merger's pick, and is not run when the merger declines |
| `gatekeep-pr/plain-report` | rework | the scope fact states functionality-only coverage: no observation waiting for after merge, no `not judged` mapping |
| `gatekeep-pr/overrides-own-block-only` | rerun only | no fact changes; `scripts/entry-phase-evals.test.mjs` requires its saved replies to be fresh, and the report-file edit makes them stale |
| `check-delivery/non-ac-row-listed` | new | with the five-row unrepaired ticket and a configured non-staging target, two rows are judged on that target, three are listed as not acceptance criteria, six `Integration` entries are listed as not checked, and the write still goes ahead |
| `ship/pr-body-integration` | new | the pull request body carries `## Integration` verbatim; an existing body whose section differs from the spec's ends with one current copy and its other text unchanged; the offer asks nothing about entries and its options are unchanged |

In rows 2-4 and in every sample that uses the seven-row ticket, "the definition" is D1's: "the cutover steps are posted as a comment on the ticket" is a `tracker update` entry and is treated like the other five non-criterion rows. The quoted ticket rows are unchanged.

A replay reads only its bundle, so the selected samples add the changed instructions through the runner's sample-scoped `bundle+:` line (`eval/lib/replay.mjs`): `check-delivery/non-ac-row-listed` bundles the stage 0 instructions of `skills/check-delivery/SKILL.md` and `ac-classes.md`; the selected `spec-council-member` and `conformance-reviewer` samples bundle `ac-classes.md`, the file their `AC definition:` line names.

Update `scripts/delivery-stage-authoring.test.mjs`, `eval/conformance-reviewer/*.test.mjs` and `eval/spec-council-applier/pr-description-finding.test.mjs` to the reworked samples' committed outputs.

### Paid and external actions

`node eval/run.mjs <target> <sample>` for each sample in D8, run by the implementing agent from the worktree, including baseline seeding and reruns after wording fixes. Approving this spec authorizes these runs for the whole flow, across seed, rows, repairs and finish, with no per-step permission prompt. No other paid or external action is needed.

## Integration

- after the release that carries this change, before a consumer repo upgrades to it - the person upgrading: search that repo's specs for acceptance rows with a `venue:` disposition on work not yet merged; done when there is none, or each such spec is re-approved without the disposition.
- after a consumer repo upgrades - that repo's maintainer: reread its gauntlet overrides file against the definition above and rewrite any line that restates the old rule (for example one that sends production checks to `Post-deployment housekeeping` and proves acceptance rows on a named environment); done when no line of the file sorts one of the seven sample rows differently from the definition.
- The requester repairs #173 through `/skill:shape-ticket` so it reads the `Integration` section as defined here, without the entry details this spec does not adopt.

## Errors and edge cases

- A sorter that cannot tell whether files deliver a row keeps it as an acceptance criterion (sorting rule 3). Council flags it; if it still reaches the loop, the worker's `unreachable:` return cuts it through the amendment path, which now applies to every row.
- A ticket whose rows all sort out takes the existing no-acceptance-criteria path in each sorter (D2, D3, D6).
- A design step no file delivers that is left in Design is a council `[blocker] scope` finding.
- An approved spec that still carries `venue:` runs that row as `in-scope` in both engines and the merge gate; the conformance reviewer reports the unknown disposition. No legacy branch exists.
- A spec with no entry has no `## Integration` section; the pull request body and every reader are unchanged for it.
- A run with no ticket has design-found entries only: no marker line and no `Not acceptance criteria:` gate line.
- A ticket that was not fetched keeps the `none - ticket not fetched (<reason>)` path; rows pasted at the gate are sorted by D3 when they land.
- Moving a row between `## Acceptance criteria` and `## Integration` after approval is a row add or remove and takes the existing redraw path.
- A finish without a pull request prints nothing about entries; the spec that ships with the code is the record.
- Multi-leg: the sort runs first, the repo-group rule then gives every surviving row its disposition (a mixed row under a nonmember heading is `elsewhere: <repo>`), and `scope: AC <n>` indices count the checkbox rows of the spec's `## Acceptance criteria` section, cut rows included and `## Integration` entries excluded; each companion file carries `## Integration` and each leg's pull request body carries it from that leg's file.
- An entry that spans several lines keeps its nested lines with it everywhere it is copied.

## Tests

- Row 2: the review reports none of the non-criterion rows missing - `eval/conformance-reviewer` `post-merge-action`
- Row 3: a council edit adds none of them and reports none missing - `eval/spec-council-applier` `pr-description-finding`, `eval/spec-council-member` `non-criterion-row-flagged`
- Row 4: no place states its own sorting rule - `scripts/ac-definition-owner.test.mjs`
- Row 5: environment name removed from the row, original kept - `eval/shape-ticket` `venue-stripped`
- Row 6: environment-handling row reads as written - `eval/shape-ticket` `integration-sort`
- Row 7: the five kinds land under `Integration` - `eval/shape-ticket` `integration-sort`
- Row 14: after-merge actions offered as today - `eval/gatekeep-pr-scope` `post-merge-menu`
- Row 15: old heading renamed on repair - `eval/shape-ticket` `integration-sort`
- Row 16: mixed row splits - `eval/shape-ticket` `integration-sort`
- Row 20: unrepaired ticket's rows sorted into the spec - `eval/gauntlet` `workflow-stage-ticket-row`
- Row 21: gate lists each moved row once, no question - `eval/spec-gate` `scope-cuts-listed`, `eval/gauntlet` `workflow-stage-ticket-row`
- Row 22: ticket with only a person step yields drafted rows - `eval/gauntlet` `ticket-all-rows-sorted`
- Row 26: tracker-update row moved, listed, not reported missing - `eval/gauntlet` `workflow-stage-ticket-row`, `eval/conformance-reviewer` `post-merge-action`, `eval/gatekeep-pr-scope` `integration-not-judged`
- Row 27: ticket entry carried word for word - `eval/gauntlet` `workflow-stage-ticket-row`
- Row 28: design detail written beneath the entry - `eval/gauntlet` `post-action-sorted`
- Row 35: neither engine gives an entry to a worker or task - `eval/loop` `seed-dispositions`, `eval/plan` `post-action-no-task`
- Row 36: the review gives entries no verdict - `eval/conformance-reviewer` `post-merge-action`
- Row 37: the merge gate gives entries no verdict - `eval/gatekeep-pr-scope` `integration-not-judged`
- Row 38: "tag the release" offered, run only on pick - `eval/gatekeep-pr-scope` `post-merge-menu`
- Row 39: the delivery check lists entries as not checked - `eval/check-delivery` `non-ac-row-listed`
- Row 41: the offer asks nothing about entries - `eval/ship` `pr-body-integration`
- Row 43: unrepaired delivered ticket judged on the configured target, three rows listed - `eval/check-delivery` `non-ac-row-listed`
- Row 44: four dispositions - `extensions/plan-tracker.test.ts`, `eval/loop` `seed-dispositions`
- Row 45: `venue:` appears nowhere shipped - `scripts/ac-definition-owner.test.mjs`
- Row 47: the report names the configured target - `eval/check-delivery` `non-ac-row-listed`
- D1 definition and pointers (row 1 as adopted) - `scripts/ac-definition-owner.test.mjs`
- D2 a multi-scenario row stays one row - `eval/shape-ticket` `integration-sort`
- D2 a bug ticket's repro steps stay in the Evidence list - `eval/shape-ticket` `bug-repro-in-evidence`
- D3 mixed ticket row stays word for word and only its external clause is copied (row 23 as adopted) - `eval/gauntlet` `workflow-stage-ticket-row`
- D3 a free-text constraint covering several scenarios drafts one row; the `Tree-wide` split is unchanged - `eval/gauntlet` `drafted-row-scenarios`, `tree-wide-drafted-row`
- D3 design-found entry written under `## Integration` (row 29 as adopted) - `eval/gauntlet` `post-action-sorted`
- D4 placement is checked in both directions and a mixed row is no finding - `eval/spec-council-member` `non-criterion-row-flagged`
- D4 the applier corrects a flagged placement with no question - `eval/spec-council-applier` `pr-description-finding`
- D4 a placement correction keeps each leg's rows - `eval/spec-council-applier` `placement-keeps-leg-scope`
- D4 a procedural run or a `## Legs` contract line gets no `Rn` - `eval/conformance-reviewer` `legs-verification-line`, `prompt-stage-sentence`, `stage-only-sentences`
- D4 a mixed row is judged on its functionality - `eval/conformance-reviewer` `mixed-row`
- D5 every unreachable row takes the cut - `scripts/loop-unreachable-cut.test.mjs`, `eval/loop` `unreachable-cut`
- D5 pull request body carries the section, one current copy on an existing body - `eval/ship` `pr-body-integration`
- D5 a mixed row's external command is cited, not tasked - `eval/plan` `post-action-no-task`
- D5 the cross-check accounts for moved rows and keeps drift visible; the body's `## Integration` is not claim-checked - `eval/gatekeep-pr-scope` `integration-not-judged`
- D5 the merge-gate report states functionality-only coverage - `eval/gatekeep-pr` `plain-report`
- D6 synthesis order and the zero-AC stop - none: instruction text in stage 0, no selected sample
- D7 engine-recommendation pin without `venue:` - `scripts/brainstorming-contract.test.mjs`, `eval/spec-gate` `recommended-row`
- D7 a `venue:` line is not a disposition - `extensions/plan-tracker.test.ts`
- Edge: approved spec carrying `venue:` runs as in-scope - `extensions/lib/plan-check.test.ts`
- Edge: multi-leg sort, ownership, indices and the companion copy - `eval/gauntlet` `legs-integration-sorted`, `scripts/ac-definition-owner.test.mjs`
- Edge: finish without a pull request prints nothing - none: absence of an instruction
- Edge: rows pasted at the gate are sorted - none: same instruction as row 20, no separate path
- Whole suite - `npm test`

## Documentation impact

Materiality bar: `documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md (major definition: a link to `skills/shape-ticket/reference/ac-classes.md` for the acceptance-criterion definition, which the README does not restate; the four dispositions and the `Integration entry` glossary row), CHANGELOG.md (communication contract: `venue:` removed, ticket section renamed), doc/gate-contract.md (communication contract: the `Not acceptance criteria:` gate line)
- Derived / memory docs invalidated: doc/configuration.md, doc/implement-engines.md, doc/gate-contract.md (each restates the five dispositions or the `venue:` failure path)

## Out of scope

- A ticket comment as an acceptance row with a draft, an approval at the pull request offer and a posting step (rows 25, 30-34 and the comment clauses of rows 1, 17, 18).
- Delivery-target discovery from repository documentation and its two stops (rows 48-51).
- Required entry details, `not stated`, timing order, and entry listings at the pull request offer and in the merge-gate report (rows 8-11, 13, 40, 42 and the detail clauses of rows 1, 29).
- Sample-data parking, the brainstorming data question and sample feeding in the delivery check (rows 19, 24, 52).
- Reading the old heading in every step and an engine guard for `venue:` (row 12 and the engine half of row 46).
- Rewriting a ticket row in the spec without its environment name (row 23): the row stays word for word.
- The drafted-row `Tree-wide` split in `ticket-acceptance.md`: unchanged.
- Working through `Integration` entries after delivery - performing, checking and recording them: #173.
- A worker's `unreachable:` report cutting an in-scope row under the default approval: unchanged.
- Choosing the delivery-check environment in the request; checking that a before-merge entry holds.
- Rewriting consumer overrides files: listed under `## Integration` above.

## Open questions

- Not checked: what the delivery check does in a live run with no target configured. Both surveyed repos configure one; this spec leaves today's `unverified: no delivery target` verdict alone.
- #173's body assumes the entry details and the old heading this spec does not adopt; its repair is listed under `## Integration`.
