# check-delivery: post-merge detective control (gh-10)

> **Superseded by:** [doc/specs/2026-08-18-check-delivery-consumer-feedback.md](./2026-08-18-check-delivery-consumer-feedback.md) - synthesized-AC blocking-cap clause (now conditional on the `synthesized AC gaps` slot) and the never-acts-on-proposed-descope clause (now conditional on the `descope edits` slot) only

Issue: jjuraszek/pi-gauntlet#10. Ported from a consumer project's post-merge
closeout prompt (`linear-ready.md`), generalized the same way `shape-ticket`
was extracted from that project's ticket-authoring prompt (see
`doc/specs/2026-08-18-gh-8-shape-ticket-skill.md`).

## Context

Every gauntlet gate is preventive and pre-merge; the pipeline ends at the
merge/PR decision. Nothing verifies that an issue's work actually reached the
default branch and its delivery target, or that its acceptance criteria hold
on the shipped artifact. "Merged" gets conflated with "delivered"; an agent
asked to "close out the ticket" marks it done with zero delivery proof.

The source prompt solved this for one project: verify against `origin/main`,
watch the deploy workflow, verify ACs on staging, move the Linear ticket to
`Ready` (never `Done`). Everything portable in it becomes this skill;
everything project-specific becomes slots in the gauntlet overrides file's
`## Delivery` section, so the source project's prompt can shrink to a thin
wrapper ("run `/skill:check-delivery <id>`") plus an overrides block.

## Problem

- No acceptance-evidence artifact exists for a non-author doing final
  acceptance - they would have to read code.
- Issue status advances on claims, not proof.
- The existing closeout prompt is unportable: Linear verbs, a named deploy
  workflow, staging URLs, and browser tooling are baked in.

## Design

### Identity and invocation

New skill `skills/check-delivery/SKILL.md`. Frontmatter: `name`,
`description`, `disable-model-invocation: true` - explicit
`/skill:check-delivery <ticket-ref>` only, matching the shipped shape-ticket
precedent (no `user-invocable` key exists in the loader; the issue bodies'
frontmatter snippet is loose phrasing). Input: exactly one tracker ref -
Linear-style `ABC-123`, GitHub `#N` / `owner/repo#N`, or a ticket URL. No
ref inference from context; missing ref = ask.

Repo-identity preflight: the run must happen inside a checkout of the
repository the ticket's work merged into. Resolve the ticket's target repo
(from the `owner/repo#N` form, the ticket's attached PR links, or the
overrides ref convention) and validate it against the local `origin`
remote; mismatch, or invocation outside a git checkout, = STOP.

Scope statement in the body: post-merge **detective control**. Quality
verification is explicitly not its job - CI and the gauntlet gates already
ran; it verifies **delivery**. It is read-only against the repository (no
branch/tag/worktree mutation, no builds) plus at most one batched tracker
write. It runs from wherever invoked; no worktree is created.

`skills/finishing-a-development-branch/SKILL.md` gains a one-line pointer in
its closing guidance: after the merge lands, `/skill:check-delivery <ref>`
proves delivery. A pointer only - no auto-chain, because delivery commonly
completes minutes-to-hours after merge (CI, deploys) and an auto-run would
routinely check too early.

### Pessimistic stance (the skill's reason to exist)

Every ambiguity resolves toward "stop loudly, write nothing":

- Cannot read the ticket -> STOP ("cannot verify what I cannot read").
- Cannot resolve a deliverable set -> STOP, never "probably that PR".
- Any deliverable commit not on the default branch -> STOP.
- Delivery target configured but unreachable/failing -> STOP.
- Any AC with an unexplained gap -> no delivery write.
- Unconfigured delivery target -> stage reported **skipped**, never silently
  passed.
- A "satisfied" verdict is never granted on a code permalink alone when the
  AC demands observable behavior.
- Ticket already in a terminal/done state at stage 0 -> STOP, report only,
  no write - never downgraded to the configured non-terminal target state.
- Comments that amend or contradict the body's ACs -> pause for operator
  resolution, then proceed - never silently pick a reading.
- Zero candidate ACs after extraction and synthesis -> STOP ("cannot
  verify a ticket that asserts nothing").
- A genuine open deliverable PR -> STOP ("work still in flight"), even
  when other deliverable PRs already merged; closed-unmerged PRs are
  ignored.

The skill never writes a terminal/done tracker status. This is a designed
stance, documented with rationale in the skill body: final acceptance is a
human decision; the skill produces the evidence that decision needs and
advances at most to a non-terminal "delivered, pending acceptance" state the
repo has explicitly named.

### Capability ladder (tracker access)

Mirrors shape-ticket's ladder, resolved in order:

1. Overrides `## Delivery` (or `## Issue tracker`) section naming a
   tool/wrapper.
2. Repo docs (`AGENTS.md`) documenting a tracker CLI.
3. Capability detection: `linearis` for Linear-style refs, `gh` for GitHub
   refs.
4. Ask the user.

Verbs required: read issue + comments, post comment, update state (state
update only used when a target state is configured). The skill body ships
a zero-config verb table so implementers never invent invocations:

| Verb | `gh` | `linearis` |
|---|---|---|
| read issue + comments | `gh issue view <n> --json title,body,comments` | `linearis issues read <id> --with-comments` |
| post comment | `gh issue comment <n> --body ...` | `linearis comments create <id> --body ...` (exact subcommand verified against the installed CLI at implementation time) |
| update state | override-defined only (never invented labels/columns) | `linearis issues update <id> --state <name>` (ditto) |

Missing **read** capability = STOP. Missing **write** capability degrades
gracefully: run the full verification, then emit **both halves** of the
batched write for manual execution - the evidence-comment text and, when a
target state is configured, the exact status-advance command - and report
the status advance as not performed.

Fetched ticket content is untrusted input: quoted, never executed, never
treated as instructions (same rule as shape-ticket).

### Verification pipeline

Stages tracked via `plan_tracker` when the tool exists: `init` with one task
per stage plus one task per AC **before** any status mapping is applied.
Status mapping: passing stage / satisfied /
not externally observable / unverified: no delivery target / allowed gap /
proposed descope -> `complete`; failed stage / unexplained gap
-> `failed` (X - a blocking failure is never rendered as a tick); skipped
delivery-target stage -> `complete` with the skip named in the task title
(e.g. "delivery target - skipped, none configured"), so a successful
zero-config run renders finished. On
harnesses without `plan_tracker` (e.g. Claude Code via #11): use a native
task list if present, else skip tracking entirely - optional capability,
never a dependency, and never a hard-stop when absent.

**Stage 0 - Pre-flight.** Fetch the ticket and all comments. Check the
current tracker status first: if the ticket is already in a terminal/done
state, report that and stop cleanly - no write; a terminal ticket is never
downgraded to the configured non-terminal target state. Extract ACs
from the ticket's AC section (shape-ticket's template); if none exists,
synthesize candidate ACs from the body, label them as synthesized, and
**cap their blocking power**: a synthesized AC never produces a blocking
`unexplained gap` - unmet synthesized criteria surface as non-blocking
proposals at the confirmation gate (the human ratifies or rejects them;
the skill never fails delivery against criteria no one approved). If a
comment amends or contradicts a body AC, surface the conflict to the
operator and get an explicit resolution before proceeding - never
silently pick a reading. If extraction and synthesis together yield zero
candidate ACs, STOP: "cannot verify a ticket that asserts nothing" - never
continue with zero criteria. Idempotency check: scan existing comments for the marker line
`Delivered: <sha>`. Resolution of the shipped SHA happens in stage 1; if
after stage 1 the resolved SHA is already recorded **and** the configured
target state (when one exists) was reached, report "already recorded for
<sha>" and stop cleanly (success, not failure, no write); a recorded SHA
whose status advance did not land re-offers only the status write (see
Idempotency below).

**Stage 1 - Merge landed.** One ordered algorithm, not a toolbox:

1. Resolve the default branch explicitly (`gh repo view --json
   defaultBranchRef`, falling back to `origin/HEAD`); never assume `main`.
2. `git fetch origin` - fetch failure = STOP.
3. Find candidate deliverables: merged PRs referencing the ticket
   (`gh pr list --state merged --search "<ref>"` plus `gh issue view`'s
   linked/closing PRs - the default open-PR filter misses merged PRs, so
   the merged state filter is mandatory) and default-branch commits
   matching the ref convention (`git log origin/<default> --grep
   "<ticket-id>"`; the bare ticket ID, e.g. `ABC-123`, is the zero-config
   grep for tracker-style refs; overrides may declare another convention).
4. Apply the mandatory deliverable-vs-mention filter: deliverable means a
   closing keyword (`Fixes/Closes #N`), an explicit tracker
   attachment/link, or an overrides-declared ref-convention match in the
   PR title/body/commits - a mere mention never delivers.
5. Resolve each deliverable PR to its **landed integration commit** on the
   default branch (`gh pr view --json mergeCommit,state,mergedAt`, or the
   log-grep hit for wrapper/squash merges without a PR). Pre-merge PR
   branch commits are association evidence only - after a squash or rebase
   merge they are never ancestors of the default branch, so ancestry is
   checked on the landed commit(s), not on PR source commits.
6. Every landed commit must be an ancestor of `origin/<default>`. The
   newest landed commit becomes **the shipped SHA**; all subsequent
   evidence binds to it.

Also enumerate open PRs referencing the ticket (`gh pr list --state open
--search "<ref>"`). A genuine open deliverable PR - one that satisfies the
same deliverable-vs-mention filter above (closing keyword, tracker
attachment, or ref-convention match), not a closed-unmerged PR and not a mere
mention - STOPs the pipeline with "work still in flight", even when other
deliverable PRs already merged. Closed-unmerged PRs are ignored.

Multiple deliverable PRs are a normal deliverable set, not ambiguity.
STOP triggers: zero candidates after filtering; a candidate whose
deliverable status cannot be determined; candidates that cannot be mapped
unambiguously to landed commits on the default branch; deliverable work
found only on unmerged branches; or a genuine open deliverable PR per
above. Each STOP names its reason.

**Stage 2 - Delivery target.** Runs only when the overrides `## Delivery`
section defines a target (deploy workflow to await, URL/health check,
registry query, or command + success predicate). Ordering: if `deploy
watch` is configured, it runs first and its failure or timeout halts stage
2 immediately (`failed`, STOP) - the `delivery target` check never runs
after a failed watch. The target check must bind to the shipped SHA (e.g.
a version endpoint reporting the SHA, a workflow run for that commit, a
registry version published from it) - "something is up" is not evidence,
and a **configured target whose check cannot bind to the shipped SHA is a
stage-2 failure reported as misconfiguration, never a pass and never a
silent downgrade**. The configured `timeout` slot bounds the whole stage;
timeout or SHA mismatch -> `failed`, STOP. No target configured -> stage
reported **skipped (no delivery target configured)** in both the session
report and the eventual evidence comment. The `target state` and
`delivery target` slots are intentionally independent: a repo may want a
post-merge review state without an automated deploy check, so a stage-2
skip does not by itself block the status advance.

**Stage 3 - AC re-verification.** Each AC gets exactly one verdict:

| Verdict | Meaning | Blocking |
|---|---|---|
| `satisfied` | Evidence matched to what the AC demands | no |
| `not externally observable` | Declared: AC has no runtime-observable surface; evidence is code pinned at the shipped SHA plus the declaration | no |
| `allowed gap` | Evidence-backed proposal: gap exists but is acceptable (e.g. explicitly deferred in the ticket) - routed to the human, never self-ratified | no, if the human approves the write with it present |
| `proposed descope` | Evidence-backed proposal: AC should be dropped/moved - routed to the human, never self-ratified | same as allowed gap |
| `unverified: no delivery target` | AC names observable behavior but no delivery target is configured to observe it against; evidence is code pinned at the shipped SHA plus the explicit downgrade | no, but always called out at the gate |
| `unexplained gap` | AC not met, no sanctioned explanation | **yes** |

`unverified: no delivery target` is deliberately distinct from `not
externally observable`: the former marks a configuration gap on an
observable AC, the latter an inherent property of the AC. Conflating them
would hide the config gap.

Evidence rules: an AC naming observable behavior requires a runtime
observation against the delivery target; when stage 2 was skipped it takes
the `unverified: no delivery target` verdict - never a silent
substitution. Other ACs take code
permalinks pinned at the shipped SHA. Browser/UI evidence is captured only
when a browser tool exists and the overrides define a reachable target;
otherwise UI-facing ACs report with the best non-browser evidence available
and say so.

The report also includes a **reviewer script**: a short, human-runnable
end-to-end scenario (URLs to open, commands to run, expected observations)
so a non-author can accept without reading code. When nothing is externally
observable, the script is replaced by the declared
"not externally observable" statement plus the code evidence - the
declaration is a legitimate outcome, not a failure.

### Verdict gate and the batched write

Any `unexplained gap` or failed stage -> **failure path**: no status
advance, no delivery comment, no marker. The skill reports the findings and
offers to post them as a **findings comment** (which carries no
`Delivered:` line, so it never trips idempotency). This is a deliberate,
narrow exception to write-nothing-on-failure, behind the same explicit
yes-gate as the success-path write - never posted unprompted.

All-clear path -> **one human confirmation gate** (mirrors shape-ticket's
single gated write): present shipped SHA, deliverable set, stage results
including any skip, the per-AC verdict table with evidence, the reviewer
script, and the exact write about to happen. On approval, one batched
write:

1. **Evidence comment** containing: the marker line `Delivered: <sha>`
   (machine-greppable, first line of the comment body), the deliverable set
   (PR links), stage 2 outcome (or "skipped: no delivery target
   configured"), the per-AC verdicts with evidence, and the reviewer
   script.
2. **Status advance** - only when the overrides `## Delivery` section names
   a target non-terminal state. Linear: `linearis` state update to that
   named state. GitHub: whatever the overrides define (label command,
   project-column command). Zero-config GitHub **and** zero-config Linear:
   comment only, reported as "no target state configured". The skill never
   guesses a team's workflow states and never invents labels.

Terminal-state trust model: non-terminality of the configured `target
state` rests on the overrides author - override-defined GitHub commands
carry no terminal/non-terminal metadata to verify. Where the tracker
exposes cheap classification (e.g. Linear's state `type`), the skill
checks it and **refuses a detectably-terminal write**, posts the evidence
comment anyway, and reports the misconfiguration.

Comment first, status last, so a partial failure leaves evidence without a
misleading state. Declining the gate = no write, report stays in-session.

### Idempotency and concurrency

- **Marker-based, append-only.** Re-run with the same shipped SHA already
  in a `Delivered:` marker -> skip the duplicate evidence comment, but the
  run is "already recorded" only if the configured target state (when one
  exists) was also reached - if the prior run's comment landed but its
  status update failed, this run still offers the status write. A newer
  shipped SHA -> a fresh evidence comment appended (audit trail), never an
  edit. Identical semantics on `gh` and `linearis`; trackers without
  comment support declare an alternative in overrides or the skill
  degrades to the inline-text output.
- **At-least-once, not exactly-once.** There is no cross-run lock: two
  concurrent runs can both pass the marker check and double-post. The
  pre-write re-fetch (below) re-checks both the marker and the current
  tracker state immediately before writing, narrowing but not closing the
  window; a rare duplicate comment is harmless noise, never corrupting.
- **Staleness.** Evidence binds to the shipped SHA resolved at stage 1
  after an explicit fetch. If the default branch advances mid-run, the
  evidence remains valid for that SHA; a later re-run produces a fresh
  comment for the newer SHA.
- **Ticket edits between gather and write:** before the batched write,
  re-fetch the ticket; if ACs or status changed since gather, re-present
  the delta at the gate instead of writing (shape-ticket's post-approval
  re-fetch pattern).

### Overrides `## Delivery` contract

Documented in the skill body as a slot table with pessimistic defaults, and
in `README.md`'s "Project-specific overrides" section with a worked example
(in the style of the existing `## Issue tracker` example):

| Slot | Meaning | Default (unset) |
|---|---|---|
| `target state` | Non-terminal tracker state to advance to on success | none - comment only |
| `deploy watch` | Workflow/command to await before the target check | none |
| `delivery target` | URL / health endpoint / registry query / command + success predicate that must reflect the shipped SHA (the skill substitutes `<sha>` in the configured command/predicate) | none - stage 2 skipped, reported |
| `timeout` | Upper bound on the whole stage 2 (watch + target check), with unit | 10 minutes when stage 2 runs at all |
| `browser evidence` | When/how to capture UI evidence (requires a browser tool) | never |
| `ref convention` | How commits/PRs reference tickets (e.g. `(ref ABC-123)`) | tracker-native forms (`#N`, `Fixes #N`, bare `ABC-123`) |
| `AC location` | Where ACs live if not the ticket body | ticket body |

The skill body and the README subsection each carry one complete worked
example block, e.g.:

```markdown
## Delivery
- target state: Ready
- deploy watch: gh run watch --workflow deploy.yml (run for <sha>)
- delivery target: curl -fsS https://staging.example.com/version | grep <sha>
- timeout: 15m
- ref convention: (ref ABC-123)
```

Credentials are the concern of the overrides author's declared command
(the skill runs it as given and treats a credential failure as a stage-2
failure, not a skip).

This enumeration is the thin-wrapper contract: the source project's
closeout prompt reduces to an overrides `## Delivery` block (target state,
deploy workflow, staging URL + SHA predicate, browser-evidence rule, ref
convention) plus a one-line wrapper invoking the skill. Worktree cleanup
stays out of scope - that belongs to `finishing-a-development-branch`.

The overrides file itself is the established convention (discovery ladder
`.pi/gauntlet-overrides.md` -> `<root>/gauntlet-overrides.md` ->
`doc/gauntlet-overrides.md`, first found wins); `## Delivery` is a new
topic-named section inside it, not a new mechanism or settings key.

### Structure and conventions

Single `SKILL.md`, target 250-300 lines (shape-ticket is 267; the 500-line
budget from `writing-skills` is the ceiling). Standard sections: quick
reference table, overview + hard constraints, pipeline, verdict table,
overrides slot table, rationalization/red-flags tables, and the verbatim
"Project overrides" footer. No `reference/` file: the overrides slot table
is the portability contract and belongs in the body.

Claude Code portability (#11 forward constraint) holds by construction: the
skill is `gh`/`linearis`-driven, `plan_tracker` is optional-degrading, and
no pi-only tool is a hard dependency.

## Dependency: plan_tracker `failed` status

The `failed` status (X, error color, additive enum) is **not** implemented
in this change. As of spec time no implementation exists anywhere -
`extensions/plan-tracker.ts` still has `TaskStatus = "pending" |
"in_progress" | "complete"`; the `gh-9-gatekeep-pr` worktree's spec
**plans** the change but has not written it. Per explicit user decision
(overriding issue #10 AC 6's whichever-lands-first arm): **#9 lands
first**, this branch rebases on `main` afterward and **verifies the status
is present**. If at verify time the status is absent, that is a surfaced
blocker, not a reason to silently map failures to `complete` or `pending`.

Rebase-time verification also covers the tool description:
`plan-tracker.ts`'s current description scopes the tool to implement-phase
execution and forbids other uses, which would let a compliant agent refuse
check-delivery's init. If #9's patch did not widen it, this change widens
the description (description text only, no behavior change) to permit
standalone detective-control progress tracking.

## Out of scope

- Worktree cleanup (belongs to `finishing-a-development-branch`).
- PR gatekeeping / pre-merge verification (#9).
- Auto-invocation from any skill (pointer only).
- `plan_tracker` `failed` implementation (ships with #9, see above).
- `REVIEW.md` (a code-review rubric convention; never referenced by the
  source closeout prompt; #9 territory).
- Test/lint/quality re-verification of the shipped code.
- Claude Code marketplace exposure (#11; this spec only avoids creating
  hard pi-tool dependencies).

## Deliverables

1. `skills/check-delivery/SKILL.md` (new).
2. `README.md`: architecture skill count/list (explicit-invocation skills
   named individually), happy-path narrative mentioning check-delivery as
   the optional post-merge closeout, the mermaid flowchart gaining an
   optional check-delivery node after gate 2 (it currently ends
   `G2 --> D([done])`, which would contradict the new step), and a
   `## Delivery` subsection under "Project-specific overrides" with the
   slot table and the worked example.
3. `skills/finishing-a-development-branch/SKILL.md`: one-line pointer.
4. `AGENTS.md`: total shipped skills count 14 -> 15.
5. `CHANGELOG.md`: minor-release entry (at release time, per the release
   skill).

Ship note: on finish, close issue #10 with a comment referencing the
landed commit (status transition + comment are exempt from shape-ticket
per the repo's ticket convention).

## Testing approach

- `npm test` (`scripts/ci.mjs`): frontmatter validity, repo structural
  checks - must stay green.
- Genericity grep over `skills/` for the consumer project's name, user
  paths, and internal service names: zero matches (issue AC 9).
- Pre-ship pressure scenarios (writing-skills RED/GREEN discipline, per the
  shape-ticket precedent): (1) ambiguous deliverable set -> STOP, no write;
  (2) squash-merge SHA resolution - PR branch commits absent from the
  default branch, landed commit resolved correctly; (3) delivery-target
  timeout / SHA mismatch -> STOP; (4) observable AC with stage 2 skipped ->
  `unverified: no delivery target`, not `satisfied`; (5) declined
  confirmation gate -> zero writes; (6) comment-succeeded/status-failed
  re-run -> status write re-offered, comment not duplicated; (7) no AC
  section -> synthesized ACs never block. Pre-ship, these scenarios are
  verified by a reviewed desk-check mapping each scenario to the skill
  clause that mandates it (recorded in the verification run); live-run
  transcripts come from the post-landing smoke below, since RED/GREEN
  execution of a prose-only skill requires a live tracker and a merged
  issue that exist only after landing.
- Manual smoke after landing: run `/skill:check-delivery` against a real
  merged issue in a consumer repo (issue #10 itself is a candidate once
  shipped).

## Documentation impact

- Feature / user-facing docs introduced: none (SKILL.md is the surface)
- Materially amended existing docs: `README.md` (skill list/count, happy
  path, `## Delivery` overrides docs), `AGENTS.md` (skill count),
  `skills/finishing-a-development-branch/SKILL.md` (pointer),
  `CHANGELOG.md` (release entry)
- Derived / memory docs invalidated: none

## Roast objections (from issue #10) - dispositions

| # | Objection | Disposition |
|---|---|---|
| 1 | Delivery-target adapter says nothing about credentials/rollout/right revision | Contract requires binding the check to the shipped SHA; rollout wait/timeout are configurable slots; credentials are the overrides author's declared command's concern |
| 2 | allowed gap / proposed descope verge on acceptance adjudication | Kept as evidence-backed proposals routed to the human at the single gate; the skill never self-ratifies or acts on them |
| 3 | Idempotency is tracker-specific | Fully specified for GitHub default (append-only `Delivered: <sha>` marker comments); identical on linearis; other trackers declare capabilities in overrides or degrade to inline text |
| 4 | "Never terminal status" conflicts with some workflows | Documented as the designed stance with rationale in the skill body |
| 5 | Reviewer script impossible for non-observable changes | `not externally observable` is a declared, legitimate verdict replacing the script |
| 6 | Concurrency/staleness | SHA-bound evidence + append-only markers + pre-write ticket re-fetch with delta re-presentation |
