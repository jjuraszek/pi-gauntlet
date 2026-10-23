# shape-ticket: batch repair and repo-grounded audit

**Goal:** `/skill:shape-ticket` accepts N issue refs in one run and, for every ticket it creates or repairs, grounds the draft in the repository: claims checked against code, the Idea and the AC rows judged against the repo's own standards for a simpler or existing path, a sibling-repo leg detected, in-motion work named, and a best-effort replication scenario attached - all under the one existing confirmation gate.
**Amend-grant:** none

## Problem

Repair mode takes one ref. The user's shape-ticket sessions in two consumer repos (about 40 invocations over 2026-09..10) list refs in batches (`ABC-101, ABC-102, ... repair mode`) and repeat the same asks on almost every repair: verify every claim against code or data, give a replication scenario on staging with inputs linked so the implementer needs no further data chase, check whether the stated problem leads to an idiomatic fix in this repo or whether a simpler or already-existing path covers it, check whether a sibling repo needs a change too, and name any worktree or PR already addressing it. None of these has a step today:

- Gather is the ticket plus one hop of links (`skills/shape-ticket/SKILL.md` step 2). No step reads the repository.
- The roast is content-only by contract: member and chair task text forbids reading the repository (Roast item 2). `REVIEW.md` and `CLAUDE.md` appear nowhere in `skills/shape-ticket/`.
- The evidence gate checks for `source:` footers and bug repro steps; it never checks whether a scenario is reproducible without production access, and a gap never blocks the write offer (step 8).
- Batch wording exists only for splits. The AC integrity gate's hard-stop rule says a surviving wishful or tautological AC "aborts the write for the entire run - including otherwise-clean repairs in the same batch", which was written for the N bodies of one split, not N unrelated tickets. Step 8's subset selection and step 9's "N gated writes ... honoring subset selection" are split-only.
- `skills/shape-ticket/SKILL.md` is 46,724 bytes; `scripts/skill-size-lint.mjs` fails at 50,000. Any addition pays with an extraction.

Corrected premise: the ask proposed a `--repair` flag. Repair mode is already selected by the argument being an issue ref (Mode routing); the only invocation option is `--skip-overlap`. A list of refs is the batch signal; no flag is added.

Framing: pivoted to a repo-fit audit scoped to the Idea sketch and the ACs - the ticket keeps carrying what and why, never how (SKILL.md Overview); the audit yields gate findings plus at most a rewritten attributed Idea line and how-leakage flags on AC rows, never a verdict on a solution the ticket is designed not to endorse.

Decisions recorded during the questionary: the audit runs as one `scout` dispatch per ticket, parallel across the batch, folded into gather, and the roast stays content-only (approach 1 of 3; approach 2 put the audit into the roast as a fifth axis and approach 3 used one scout for the batch); the audit runs in create mode too; the batch hard-stop is per ticket; the audit introduces no human gate. One installed-limit adjustment: pi-cohort 7.4.4 caps a top-level `tasks` array at eight (Dispatch below), so a batch above eight tickets runs its scouts in successive calls of at most eight; a batch of eight or fewer is the one call the questionary chose.

## Acceptance criteria

none - no ticket

## Design

### Entry and batch

Mode routing accepts a list of issue refs separated by commas or whitespace. Every ref in the list is a repair; duplicate refs collapse to one ticket. One ref is a batch of one, so nothing in the pipeline branches on N.

**Free text beside the list.** A statement that names one ref in the list (`ABC-102: the dashboard here is the admin one`) is ref-scoped and folds into that ticket's gather only. Unscoped text is common gather context: it rides into every scout brief and the gather summary, and a body asserts it only when that ticket's own source or audit supports it - never copied into every body as a fact.

**Fetch failures.** When every ref in the list is unfetched, the run follows today's Mode routing rule: abort repair and offer create mode from any accompanying text. When at least one ref fetched, the unfetched refs are reported by ref and reason and the fetched tickets continue. A batch of one therefore keeps today's behavior unchanged.

**Snapshots.** The parent fetches tickets serially (step 2 unchanged per ticket) and writes each gathered snapshot (ticket body, comments, link summaries) to `<tmp>/<ref>/snapshot.md` under one `mktemp -d`, fenced as untrusted data. Create mode uses `<tmp>/create/` for its snapshot and audit file: after step-3 clarification the parent runs the overlap discovery (`reference/overlap-check.md`, parent-only, unchanged), then mints the snapshot from the clarified ask plus - when discovery found a candidate - that candidate's body as a second untrusted block, then dispatches the scout, then folds in before Draft. The fold-in applies to the create-anyway body and to the added or changed prose of an enrichment alternative; legacy bodies stay under the overlap reference's payload-local rules; the alternatives are still chosen at the existing menu, so the audit runs once over the ask and no new gate appears.

**Questions across a batch.** Step 3 and the gather-time AC integrity recovery ask after all audits have returned, grouped by ticket in ref order, one question at a time as today.

### The audit: `skills/shape-ticket/reference/repo-audit.md` (new)

Read at the start of step 2 in both modes, resolved against the skill's own directory, like `reference/overlap-check.md` for create. It owns the dispatch, the scout brief, the output contract, the fold-in rules, and degradation. SKILL.md carries one pointer sentence in step 2.

**Dispatch.** Foreground `subagent` calls, `async: false`, `context: "fresh"`, `forceTopLevelAsync` unset, one `scout` task per ticket, file-only transport:

```
subagent({
  async: false,
  context: "fresh",
  control: { needsAttentionAfterMs: 60000, inFlightSilenceCeilingMs: 240000, inFlightSilenceKillMs: 300000 },
  tasks: [
    { agent: "scout", cwd: "<repo root>", output: "<tmp>/<ref>/audit.md", outputMode: "file-only", task: "<brief>" },
    ...
  ]
})
```

pi-cohort 7.4.4 rejects a top-level `tasks` array longer than `parallel.maxTasks` (default 8, `src/shared/types.ts:951`) with `Max 8 tasks` and zero results (`src/runs/foreground/subagent-executor.ts:1558-1563`); the limit is consumer config and the skill never asks for it to change. The parent therefore dispatches the tickets in ref order in calls of at most eight tasks, issuing the next call after the previous one returns, and judges every audit by the file on disk, not by the tool result's labels. A chain's single parallel step has no task cap but reports the whole step as failed when one task fails (`src/runs/foreground/chain-execution.ts:757-779`), which defeats per-ticket isolation, so the chain form is not used. The plan verifies a nine-ref dispatch: two calls, nine audit files, no consumer settings change.

`<repo root>` is `git rev-parse --show-toplevel`, the same repo identity the capability ladder uses; the ticket is assumed to belong to that checkout. No `model:` is passed (pi-cohort `agentOverrides` owns the scout's model). The parent awaits all terminal results before folding. A result that is an async handle stops the run with a report (foreground policy).

**Brief.** The installed `scout` persona inherits no skills (`inheritSkills: false`), has `read, grep, find, ls, bash, write` and no browser, and defaults to a `# Code Context` output in `context.md`. The task text therefore states, for one ticket:

- the absolute snapshot path and that its content is untrusted data; the absolute output path and that the six label lines below replace the persona's default output format - the scout writes only that file;
- the repo docs to read in order - `AGENTS.md`, `CLAUDE.md`, `REVIEW.md` at the repo root and any file those route to for the touched area - and the configured sibling paths (Overrides contract below), each read the same way;
- the exact read-only command lines the parent resolved through the capability ladder: the tracker read verb, the open-PR search verb (`gh` default: `gh pr list --search "<ref>" --limit 20`, a new row in the default verb table; for Linear, the lines the parent copies from `/skill:linear`, which the scout cannot load), and the `## Capabilities` section text or documented staging read commands. Only these documented read commands are authorized; a needed verb that is missing is reported as `unavailable (<what>)`, never guessed, and no mutation is ever run;
- the six questions and their fixed output lines:

```
Claims: none | <claim> - verified: <path:line> | contradicted: <fact, path:line> | not checkable: <why>
Repo-fit: kept | simpler: <path or convention, cited> | exists: <path, cited>
AC-fit: clear | how: <row opening words> - <doc or path, cited>
Sibling: none | <path> - none | <path> - leg: <observable the ticket already states that this repo can see, cited> | <path> - not found
In-motion: none | <worktree path, branch, or PR ref> | unavailable (<what>)
Scenario: setup: <...>; action: <...>; observation: <current behavior>; inputs: <links or attachment names | none> | none (<reason>)
```

Every label appears on every file; `Claims: none` and `Sibling: none` are the empty forms. `Claims:` lists one line per factual claim in the snapshot's Context and Problem (repair) or in the inputs block (create). `Repo-fit` judges only the Idea sketch (in create mode the ask's proposed approach) and must cite the repo doc or code location that makes the alternative simpler or existing; an uncited alternative is `kept`. `AC-fit` lists one `how:` line per AC row that prescribes a mechanism or a new abstraction the cited repo doc routes elsewhere; an uncited row is `clear`. `Sibling:` gives one line per configured path. `In-motion` matches the ticket ref first, then quoted title terms from the snapshot, against `git -C <repo root> worktree list` and the resolved open-PR search bounded to 20 candidates; `git branch -a` is not scanned; no match is `none`, a missing search verb is `unavailable`. `Scenario` is best effort: the scout may run the authorized read commands to observe the current system; it never runs a mutation, never opens a browser, never reads a binary attachment (attachments are linked by name), and when it lacks access or the ticket is fresh work with nothing to observe, it writes `none (<reason>)`.

**Usable audit.** A file is usable iff it is non-empty and each of the six labels starts at least one line (`^Claims:`, `^Repo-fit:`, `^AC-fit:`, `^Sibling:`, `^In-motion:`, `^Scenario:`); item counts never matter. Anything else is `audit unavailable (<reason>)` for that ticket.

**Fold-in (parent, per ticket, before step 4 Draft).**

| Audit line | Effect on the draft | Gate or no-op rendering |
|---|---|---|
| `Claims: ... contradicted: <fact>` where the claim is itself a code, config, or documentation fact (a path, a setting, a documented behavior) | Problem states the cited fact; the original claim moves verbatim to the accumulated Reporter note | `premise: <old> -> <new> (<path:line>)` |
| `Claims: ... contradicted: <fact>` where the claim is reported behavior (what the reporter observed) | none - a code reading does not disprove an observation | `premise: <claim> vs <fact> (<path:line>)`, surfaced-ambiguous; no question, no blocking status |
| `Claims: ... not checkable` | none | `unverified: <claim> - <why>` |
| `Repo-fit: simpler` / `exists` | the one attributed Idea line becomes `reporter proposes <X>; <doc or path> routes this through <Y>`; the original sketch moves to the Reporter note if it overflows | `repo-fit: <simpler or exists> - <citation>` |
| `AC-fit: how: <row>` | the row is restated around its observable under the existing what-not-how rule; its mechanism text moves verbatim to the Reporter note; the restated row never names the cited alternative | `ac-fit: <row> - <citation>` |
| `Sibling: <path> - leg` | the parent resolves `<path>` to the name the tracker uses (`git -C <path> remote get-url origin` as `owner/name` with `.git` stripped, or a repo-documented name from the ladder's docs); when the name resolves and the ticket already states the cited observable, that row moves under a `### <repo>` group per the existing repo-group rule and Idea names the repo; otherwise no AC change | `sibling: <repo or path> - <what> (<citation>)` |
| `In-motion: <ref>` / `unavailable` | none | `in-motion: <ref>` / `in-motion: unavailable (<what>)` |
| `Scenario: setup...` | setup and action feed the AC row(s) that state that failure, with environment names and credentials stripped (deploy-window rule); each row's result stays the ticket's expected outcome, never the observation; a feature ticket with nothing failing changes no row; a `scenario:` footer (grammar below) carries the observation and inputs | `scenario: present` |
| `Scenario: none (<reason>)` | `scenario: none (<reason>)` footer when a body is drafted; never alone a reason to draft | `scenario: none (<reason>)` |
| file unusable | none; ticket proceeds on today's path | `audit unavailable (<reason>)` |

**Scenario footer.** One line under the Problem's `source:` footers: `scenario: setup: <...>; action: <...>; observed: <...>; inputs: <links or attachment names | none>` or `scenario: none (<reason>)`. It is not a `source:` footer: it counts toward no source gap, takes part in no step-8 gap resolution, and names environments and inputs freely because it is evidence, not an AC.

**Repair path classification.** A repair whose fold-in or uniqueness pass changes any AC row (scenario setup or action, sibling group, AC-fit restatement, a removed or split row) is a substantive full-replacement repair: step 4's normal path with `- [ ]` normalization. The conformance-only AC byte lock and the missing-footer-only rule apply only when the audit folded nothing into the ACs and uniqueness changed nothing; a quiet audit on a prose-only repair keeps byte-identical ACs exactly as today. Every text the fold-in displaces (an original claim, the original sketch, a removed row, a flagged row's mechanism) is newly displaced detail under step 4's Reporter note rules: a new comment is proposed, an existing comment is never edited.

**Non-conformance and the no-op report.** A draft-changing finding makes an otherwise conforming repair non-conforming for step 6: a contradicted code/config/doc fact, a `simpler`/`exists` repo-fit, an `AC-fit: how`, a grounded sibling group, or a scenario that feeds an AC row routes to the gate. `kept`, `clear`, `none`, a behavior-only premise conflict, `in-motion`, `unverified`, `scenario: none`, and `audit unavailable` alone do not; a conforming ticket with only those lines stays a step-6 no-op, and its "conforms, no changes proposed" report carries that ticket's `Audit:` lines so an active PR, an uncheckable claim, or a failed audit is never hidden. No gate opens and no write is proposed for a no-op.

**Gate rendering.** One `Audit:` block per issue, immediately above that issue's Title line; when step 8 already renders `source missing:` rows before Title (bugs with repro steps), the block follows them. Other source-gap rows keep their existing place after Evidence.

**Roast.** The roast receives `audit.md` beside the snapshot as untrusted, cited grounding. Roast item 2's member task text gains `audit.md` in the permitted-input list, and item 4's fidelity clause gains: a draft change that traces to a cited audit line - the Problem fact rewrite, the attributed Idea line, an AC-fit restatement, a sibling group, scenario setup/action in an AC row, the `scenario:` footer - and the Reporter-note move it caused are source-grounded, not `added`, `lost`, or over-spec; an addition with no audit line or source, and any scope beyond the ticket's concern, stays `added`. Members and chair remain content-only: they read the audit file and never re-verify it against the repository. In a batch the roast contract (items 1-7) runs independently per eligible ticket in ref order, with per-ticket artifacts under `<tmp>/<ref>/` (`draft.md`, `snapshot.md`, `audit.md`, `member-<i>-<slug>.md`, `chair.md`); a stopped ticket is not roasted.

**Harness fallback.** On a harness with no `subagent()` (Roast item 6's conditional), dispatch the same brief through the harness's native subagent facility at low effort with the same temp-file artifacts; this is the only conditional in the reference.

### Deterministic gate changes (SKILL.md)

- **Per-ticket hard stop.** The AC integrity gate's "entire run" sentence becomes: a surviving wishful or tautological AC stops that ticket - it is presented with its hard-stop report and receives no option number; the remaining tickets reach the one gate, every eligible repair numbered, with subset selection. A split keeps today's all-or-nothing rule because its N bodies are one change. The resume and never-silently-drop sentences bind per stopped ticket: approved tickets write; a stopped ticket whose values arrive in-session re-drafts and re-gates, returning to step 8 with its own exact diff for the existing confirmation - never added to a previous approval, never a new mandatory stage.
- **Numbered batch.** Step 8 numbers every eligible repair in a batch, clean or not, and step 9 honors the subset for a repair batch as it does for a split: N gated writes under the one approval.
- **AC uniqueness.** Runs after fold-in and after normalization. A row is implied when another row's setup, action, and result text already contains its observable; an implied row is removed and its text moves to the Reporter note. A row that bundles independent observations is split into one row per observation; a nested list under a row stays detail of that row; rows that share a subject but observe different results stay separate. Legacy rows in overlap enrichment are never touched.

### Overrides contract

A `## shape-ticket` section in the gauntlet overrides file (the existing `## <skill-name>` shape) carries `- sibling: <path relative to the repo root>` lines; these lines are the only sibling source. No section means a single-repo audit. The README named-section table gains one row: `## shape-ticket` `- sibling: <path>` | shape-ticket | single-repo audit | extends | sibling checkouts the repo audit reads for a second leg. `.pi/gauntlet-overrides.md` in this repo gains no section (pi-gauntlet has no sibling leg to configure).

### Byte budget

Edits to SKILL.md are pointers and single sentences: Mode routing (ref list, ref-scoped free text, the all-unfetched rule), step 2 (read `reference/repo-audit.md`), step 4 ("create no third file" becomes: the snapshot and `audit.md` sit beside the draft artifact, nothing else), step 5 ("Before any subagent dispatch" becomes "Before the roast dispatch"; the gather audit precedes the deterministic gates), step 6 ("A conforming ticket never pays for a dispatch" becomes "never pays for a roast dispatch; the gather audit already ran and its lines ride on the no-op report"; draft-changing audit findings are non-conforming), step 8 (`Audit:` block position, numbered batch), step 9 (subset for repair batches), Roast items 2 and 4 (audit grounding clauses), AC integrity gate (per-ticket stop with recovery, uniqueness), default verb table (`gh pr list` row), Project overrides (`## shape-ticket` `- sibling:`). To fund them, `## Examples and rationalizations` (2,266 bytes) moves to `reference/examples.md`, with its two in-body pointers ("Bad->good examples ... below", "One built-in bad->good ticket exemplar ... below") retargeted to that file. If the edited SKILL.md still reaches 49,000 bytes, `## Tracker abstraction and capability ladder` (3,651 bytes) moves to `reference/tracker-ladder.md` next. The eval slice anchors `### 4 - Draft`, `## Roast`, `## Evidence gate`, `## Ticket wording` stay in SKILL.md, so `eval/shape-ticket/target.json` slices are unchanged; `target.json` gains a `skillFiles` entry for `reference/repo-audit.md` so samples can see it, and existing samples that do not exercise the audit declare `bundle-: skills/shape-ticket/reference/repo-audit.md`.

## Errors and edge cases

- Scout task errors, writes nothing, or writes a file missing any of the six labels -> `audit unavailable (<reason>)` for that ticket only; the other tasks' files on disk still fold in.
- Async handle returned from the audit dispatch -> stop the run and report; never poll or relaunch.
- More than eight refs -> successive calls of at most eight; a `Max 8 tasks` error is a plan bug, never a degradation path.
- Fetch failure for one ref in a batch -> listed as unfetched, skipped; never guessed. Every ref unfetched -> abort repair, offer create mode from free text.
- `- sibling:` path absent on disk -> `Sibling: <path> - not found`; never fails the run. Sibling name unresolvable or observable ungrounded -> gate line only, no AC group.
- Outside a git checkout (create mode from a bare prompt) -> `audit unavailable (no repository)`.
- Scenario needs credentials or a browser the scout lacks -> `none (no access to <what>)`; a note, never a park and never a blocking AC.
- In-motion search verb missing -> `in-motion: unavailable (<what>)`, distinct from `none`.
- Ticket conforming and audit all-quiet -> step-6 no-op with the audit lines on the report.
- Repo-fit or AC-fit alternative without a citation -> treated as `kept` / `clear`.
- Attachments -> linked by name in the `scenario:` footer; content never read.
- Duplicate refs in the list -> one ticket.
- The audit introduces no question to the human: findings surface only as draft rewrites, lines inside the existing gate block, or lines on the no-op report.

## Tests

`npm test` (`scripts/ci.mjs`) covers the size lint, the marketplace allowlist, and eval structural lint.

**Baseline preparation.** `eval/run.mjs` reads every retained `skillFiles` entry from both arms, so the new reference must exist at the baseline commit. Sequence: commit A adds `skills/shape-ticket/reference/repo-audit.md` (unreferenced from SKILL.md, old behavior intact), the `target.json` `skillFiles` entry, and the `bundle-` lines on existing samples; refresh `intent.md`'s `for:` to the new bundle-free assembly SHA; seed with `node eval/run.mjs shape-ticket --base <A> --baseline-only`. Behavioral edits land after A. The final run is `node eval/run.mjs shape-ticket --base <A>`; a post-behavior-change baseline is never used.

**Samples.** Text cases carry the snapshot and the audit file inline (replay has no tools) and state a reply budget under the 1,600-word `wordCap`, as `repair-overflow` does; the plan reads each cell's recorded word count and does not assume three tickets overflow. `intent.md` names the samples under "Expected to move". `repair-overflow`'s `invalid` fact (hard stop "for the entire run") keeps holding for its batch of one.

| Sample | Case | Must hold |
|---|---|---|
| `batch-repair` | `ABC-101, ABC-102 ABC-102, ABC-103` with one wishful AC in `ABC-102` and an implied row in `ABC-103`; three audit texts pasted | the list parses to three tickets (duplicate collapsed); the stopped ticket shows its report and no option number; the other two are numbered with subset selection; the implied row moves to the Reporter note while a same-subject different-result row stays; one gate; no "entire run" abort |
| `audit-repo-fit` | a repair whose Idea prescribes a mechanism the fixture repo's AGENTS.md routes elsewhere; audit says `Repo-fit: exists: <path>`; branch: the mechanism appears only in an AC row and the audit says `AC-fit: how: <row> - <path>` | the Idea line is one attributed sentence naming the existing path; the gate shows `repo-fit:` with the citation; in the branch the row is restated around its observable without naming the alternative, the mechanism sits in the Reporter note, and the gate shows `ac-fit:`; no new question to the human |
| `scenario-best-effort` | a fresh feature with audit `Scenario: none (nothing to observe - new capability)`; branch: a bug with `Scenario: setup...; observation: <the defect>; inputs: <link>` | the body carries `scenario: none (...)` under the source footers; the write is offered; no park and no `Blocked on:`; in the branch the AC row takes setup and action, its result is the expected behavior and not the observed defect, and the `scenario:` footer holds the observation and link |
| `audit-quiet-noop` | a conforming ticket whose audit is `In-motion: <PR ref>` and otherwise quiet; branch: the audit file is empty | "conforms, no changes proposed" with `in-motion: <PR ref>` on the report; no gate, no write; in the branch the report carries `audit unavailable (empty file)` |
| `audit-byte-lock` | a prose-only non-conforming repair with mixed checked and numbered ACs and a quiet audit; branch: the same ticket with a scenario that feeds an AC row | the AC bytes are identical with a byte check before the gate; in the branch the repair is a full draft with `- [ ]` rows and no byte-mismatch failure |

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - the workflow paragraph (line 38, "create or repair a single tracker issue") and the skills bullet (line 80, "one tracker issue per run") describe batch repair and the repo audit (major procedures / conventions); `README.md` named-section table gains the `## shape-ticket` `- sibling:` row (operations / tunable parameters); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: `README.md` "What you cannot change here" row "one explicit exact-diff confirmation for the entire batch" - reworded so "batch" covers N-ticket repair as well as a split

Skill and reference bodies (`skills/shape-ticket/SKILL.md`, `reference/repo-audit.md`, `reference/examples.md`) are implementation surface, tracked in the plan, not listed here. `doc/configuration.md` points to the README table for override headings and needs no edit.

## Out of scope

- A `--repair` flag or any new invocation option, including invocation-named sibling paths.
- Repo access for roast members or a fifth roast axis.
- Detecting that a ref belongs to a repo other than the cwd checkout.
- Reading attachment content or driving a browser from the scout.
- Changing the split rule's all-or-nothing hard stop.
- Raising pi-cohort's `parallel.maxTasks` in any consumer.
- Batching in `check-delivery` or `gatekeep-pr`.

## Open questions

- None blocking.
