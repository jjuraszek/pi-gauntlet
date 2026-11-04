# check-delivery set mode: one fresh child per ticket, one gate and write per ticket in turn

**Goal:** `/skill:check-delivery #12 #15 #18` verifies each ticket through today's single-ticket pipeline inside its own fresh child context, in parallel, then shows the human each ticket's unchanged report and confirmation gate in turn, performing that ticket's approved write before the next ticket's turn.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Supersedes:** doc/specs/2026-08-18-check-delivery-consumer-feedback.md, `## Item 3 - single-ticket boundary (check-delivery): declined, recorded` only; doc/specs/2026-08-18-gh-10-check-delivery-skill.md, `### Identity and invocation` exactly-one-ref input clause only

## Problem

`/skill:check-delivery` takes exactly one tracker ref (`skills/check-delivery/SKILL.md` `## Hard constraint`: "Input is exactly one tracker ref"). Proving delivery of N merged tickets today means N invocations, each re-running the tracker ladder and `git fetch origin`, with no isolation guarantee between runs that share one session. The ask: accept N refs, verify them in parallel and independently with no cross-ticket context, then present each report for its own decision, one after another.

Premises checked during brainstorming (pi-cohort citations are against the installed `node_modules/pi-cohort` 7.6.6):

- Supported: `/skill:gatekeep-pr` already runs a set of PRs this way (`skills/gatekeep-pr/reference/batch.md`, `agents/pr-gatekeeper.md`, spec `doc/specs/2026-10-23-gh-79-parallel-gatekeep-prs.md`): the parent admits, fetches once, dispatches one fresh `subagent` tasks batch, and renders one report and menu per turn. That precedent is inspiration only: this spec adds no shared file, no cross-reference, and imports none of gatekeep-pr's batch, menu, or persona text. Check-delivery's set mode is self-contained under `skills/check-delivery/`.
- Corrected: "fresh contexts give no cross-ticket pollution" covers the transcript only. pi-cohort `context: "fresh"` starts each child as a clean session with no parent history (pi-cohort `README.md:198`, `Fresh vs. forked context`; only `context: "fork"` passes `originSessionRoot`, `src/runs/foreground/subagent-executor.ts:1078`), so the transcript and the child's own `plan_tracker` state are per child. It does not isolate the checkout's git refs or filesystem. Stage 1 step 2 runs `git fetch origin`; N children fetching the same remote concurrently is the one shared-resource hazard, so the parent fetches once and children skip that step.
- Corrected: `pr-gatekeeper` is not reusable as the child. Its prompt validates a PR worktree HEAD and executes PR picks, and it carries `subagent`, `edit`, and `write`. A delivery child is read-only against the checkout and needs no dispatch rights, so it is a new persona.
- Verified bounds: pi-cohort admits at most `parallel.maxTasks` tasks (default 8, `MAX_PARALLEL`) and runs `parallel.concurrency` at once (default 4, `MAX_CONCURRENCY`) (`src/shared/types.ts:958-1006`); `context` is invocation-level (`src/runs/foreground/subagent-executor.ts:119`); a relative `output:` resolves against the task's cwd (`src/runs/shared/single-output.ts:30-40`, `resolveSingleOutputPath`), so every `output:` is absolute under `mktemp`; duplicate `output:` paths reject the whole parallel batch before execution (`src/runs/foreground/subagent-executor.ts:1407-1440`); with `outputMode: "file-only"` the parent's tool result is only the saved-path pointer while the child's full response is persisted at the path (`src/runs/foreground/attempt-finalization.ts:285-287`), and every `output:` task gets `Write your findings to: <path>` appended (`src/runs/shared/single-output.ts:76`).
- Verified: pi-cohort defaults `inheritProjectContext: false`, `inheritSkills: false`, `systemPromptMode: replace` for a persona that leaves them unset (`src/agents/agents.ts:31-41`); the persona `tools:` list becomes an explicit `--tools` allowlist (`src/runs/shared/pi-args.ts:124-141`); `skill:` accepts an array (`src/extension/schemas.ts:18-22`).
- Unverified: a live parallel smoke against a disposable tracker. No ticket or write was authorized during brainstorming; `## Tests` names the text-eval coverage and the manual smoke.

Framing: kept - user chose the set form with per-ticket gates in turn and immediate per-ticket writes, over the report-only revisit shape that the superseded Item 3 recorded. The refusal's stated reason was consent dilution ("N tickets means N gates, or a batch gate that dilutes per-ticket consent"); per-ticket gates in turn keep consent exact, so the refusal's premise is answered rather than cut across.

User constraints: the skill edit follows `/skill:forge-skill`; the instruction-size lint (50,000 bytes / 2,000 lines per `skills/**/*.md` and `agents/*.md`) is strict; set mode lives in a sibling `reference/batch.md`, not inlined in `SKILL.md` (26,963 bytes / 439 lines today).

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] `/skill:check-delivery <ref>` with one ref behaves exactly as before this change: same stages, same gate text, same write order, same first lines; the two existing eval samples `gate-line-first` and `menu-after-numbered-findings` still hold.
  in-scope
- [ ] Two or more refs (space- or comma-separated, each in one of the four accepted forms, a trailing comma stripped) run every ticket's stages 0-3 in its own fresh child context in parallel, and the parent then renders each ticket's report and confirmation gate one ticket per message in supplied order, never two gates in one message, each message opening with exactly one `gauntlet:` marker at column zero.
  in-scope
- [ ] A declined, skipped, stopped, or failed ticket leaves every other ticket's report, gate, and write unaffected: ticket 1 declined still renders ticket 2's gate, and ticket 2's approval still performs ticket 2's write.
  in-scope
- [ ] An approved ticket's write (pre-write re-fetch against the child's handoff baseline, then exactly the write halves the handoff names, in the single-ticket order) runs in that ticket's turn, before the next ticket's report is shown; the message that performs it opens with the next ticket's gate marker (or the set-level settlement line after the last ticket) and states the written ticket's outcome as a plain `<ref>: delivered` / `<ref>: manual` / `<ref>: failed - <halves>` line with no `gauntlet:` prefix.
  in-scope
- [ ] Before any tracker call or fetch, the parent rejects the whole set with one `gauntlet: stuck <line>` message for, in this order: no `subagent` tool in the harness (`set mode requires pi's nested dispatch`), a token matching none of the four forms, more refs than pi-cohort `parallel.maxTasks` (`set mode takes at most <max> tickets (pi-cohort parallel.maxTasks); got <n>`), and - after the one `git remote get-url origin` read that admission makes - a duplicate identity after normalization.
  in-scope
- [ ] A child never posts a comment, edits a body, or advances a status: every tracker write in set mode is performed by the parent after that ticket's gate approval.
  in-scope
- [ ] `git fetch origin` runs once per set, in the parent; a fetch failure stops the whole set before dispatch, and no child runs its own fetch.
  in-scope
- [ ] A ticket whose child hit the stage 0 comment-contradicts-AC pause renders in its turn under `gauntlet: gate=check-delivery/set-recovery` as `STOPPED - AC conflict - <quoted rows>` with options `1. retry` and `2. skip`; on `1` the parent asks for the reading in a `gauntlet: question` turn and re-dispatches that one ticket alone, with the nonempty typed reading in its task, only after receiving it.
  in-scope
- [ ] `agents/delivery-checker.md` exists, passes the agent lint in `npm test`, carries tools `read, grep, find, ls, bash, plan_tracker` and nothing else, `defaultContext: fresh`, `inheritProjectContext: true`, `inheritSkills: false`, `systemPromptMode: replace`, `completionGuard: false`, and a description that says it is not for direct dispatch.
  in-scope
- [ ] `skills/check-delivery/SKILL.md` and `skills/check-delivery/reference/batch.md` each stay under 50,000 bytes and 2,000 lines, and `SKILL.md` no longer contains the sentence "Input is exactly one tracker ref".
  in-scope

## Design

### Routing in `skills/check-delivery/SKILL.md`

Remove: the sentence "Input is exactly one tracker ref (`ABC-123`, `#N`, `owner/repo#N`, or a ticket URL) - no inference from surrounding context; missing ref = ask." in `## Hard constraint`; the paragraph in `## Scope boundary` beginning "Single-ticket by design: the pipeline's depth ... does not loop soundly" through "dilutes per-ticket consent."; the sentence "A consumer sweep may invoke this skill per ticket as its verification step."

Add, in `## Hard constraint`: "Input is one or more tracker refs (`ABC-123`, `#N`, `owner/repo#N`, or a ticket URL: `https://github.com/<owner>/<repo>/issues/<n>` or `https://linear.app/<workspace>/issue/<KEY-N>[/<slug>]`), space- or comma-separated, never inferred from surrounding context; zero refs = ask. One ref runs the pipeline below. Two or more refs route to `reference/batch.md` before any tracker call or fetch and return through it; the single-ticket text below is the procedure each child runs and the parent's gate and write." Keep the repo-identity preflight and untrusted-content sentences unchanged.

Add, in `## Scope boundary`, replacing the removed paragraph: "Explicit refs only: set mode takes the list the user supplies and never discovers tickets. Sweep passes (bucketing open tickets, orphan scans for merged-but-unreferenced work) are portfolio triage - a different control, inherently project-flavored - and stay consumer territory; a consumer sweep supplies its list to set mode."

Add, in the `## Quick reference` table, one row: `Two or more refs | set mode - reference/batch.md: parallel fresh children verify, the parent gates and writes per ticket in turn`.

Keep `## Confirmation gate and the batched write`, `## Idempotency and concurrency`, and every stage's text unchanged. Set mode reuses them by reference: the child runs stages 0-3 as written, the parent runs the gate and write as written.

Update the frontmatter `description` to name both forms: "Use only when explicitly asked to prove delivery of one or more named merged tickets ("check delivery of ABC-123", "check delivery of #12 #15", a loop task naming the ticket and the verb) before their tracker status advances; pre-merge gating belongs to /skill:gatekeep-pr." Add `argument-hint: "<ref> | <ref> <ref>... (e.g. ABC-123, #12 #15 #18, owner/repo#12)"`.

### `skills/check-delivery/reference/batch.md` - the parent

Add: this file, in imperative voice, four sections in execution order. It cites `SKILL.md` sections by heading and restates nothing from them. Every set-level STOP it emits is a message starting with `gauntlet: stuck ` followed by the line below, matching `SKILL.md` `## Quick reference`.

**`## Admit`.** Before any tracker call or fetch. Reject the whole set with exactly one `gauntlet: stuck <line>` message and no further action, checking in this order:

| Order | Condition | Line |
|---|---|---|
| 1 | No `subagent` tool in the harness (Claude Code) - branch on the tool's absence, never on a harness name | `set mode requires pi's nested dispatch` |
| 2 | A token matching none of the four forms: `[A-Z][A-Z0-9]+-[0-9]+`, `#[0-9]+`, `<owner>/<repo>#[0-9]+`, `https://github.com/<owner>/<repo>/issues/<n>`, or `https://linear.app/<workspace>/issue/<KEY-N>[/<slug>]` | `<token> is not a tracker ref; set mode takes ABC-123, #N, owner/repo#N, or a ticket URL` |
| 3 | More refs than pi-cohort `parallel.maxTasks` (read from the active pi-cohort configuration, default 8; `gauntlet_setting` is not its source) | `set mode takes at most <max> tickets (pi-cohort parallel.maxTasks); got <n>` |
| 4 | Duplicate identity after normalization: read `git remote get-url origin` once (the one git read admission makes; outside a checkout = the single path's preflight STOP), map `#N` and the GitHub URL to lowercase `<origin owner>/<origin repo>#N` and `owner/repo#N` to its lowercase form, map `ABC-123` and the Linear URL to the uppercase key | `<ref> is listed twice; list each ticket once` |

Checks 1-3 touch nothing outside the argument string. Never chunk an oversized set. Supplied order is the roster order for dispatch, turns, tracker rows, and the closing summary; the roster carries each ticket's 1-based index and canonical ref.

**`## Shared prep`.** Resolve the overrides `## Delivery` and `## Issue tracker` sections once. Resolve the tracker capability ladder (`SKILL.md` `## Tracker capability ladder`) per ref: an exclusive `tracker:` override (rung 0) applies to every ref; otherwise rung 3 keys on each ref's form (Linear key or URL -> `linearis`, GitHub forms -> `gh`), so a set mixing `ABC-123` and `#12` resolves two trackers. Probe each selected tracker's capabilities once and cache the result; never route every ticket through the first ticket's tracker, and never add a same-tracker-only restriction. Each ticket's read verb must be callable from the child's tools (`bash` running a CLI such as `gh` or `linearis`); a read path that exists only through an MCP or extension tool the child lacks is missing read capability for that ticket: `gauntlet: stuck missing read capability for <ref>: <verb> is not callable from delivery-checker's tools`, before dispatch. The ladder's own missing-read STOP applies per ticket the same way. Resolve the default branch once with stage 1 step 1. Run `git fetch origin` once; a failure stops the set: `gauntlet: stuck git fetch origin failed: <first stderr line>`. Mint `REPORT_DIR=$(mktemp -d "${TMPDIR:-/tmp}/check-delivery-set.XXXXXX")`; each ticket's report path is `<REPORT_DIR>/<two-digit roster index>-<normalized ref with / and # replaced by ->.md` (`01-org-a-widget-12.md`), so distinct identities never share a file. Initialize `plan_tracker` with one task per ticket, `ticket <ref>`, in roster order; without `plan_tracker`, keep a plain checklist.

**`## Dispatch`.** One foreground batch, awaited whole:

```
subagent({
  async: false,
  context: "fresh",
  tasks: [
    { agent: "delivery-checker", cwd: "<abs checkout path>",
      skill: "check-delivery",            // ["check-delivery", "linear"] when this ticket's tracker is Linear
      output: "<REPORT_DIR>/<ticket file>", outputMode: "file-only",
      acceptance: { level: "none", reason: "the result line is the handoff" },
      task: "<task text>" },
    ...one per ticket in roster order
  ]
})
```

Task text supplies, in this order: the one ref; that ticket's resolved tracker name and resolved verb table (read, post comment, update state, edit body - the parent's resolution, so the child never re-probes); the `## Delivery` slot values verbatim or `none`; the default branch name; the statement `fetch done - skip stage 1 step 2`; the ref convention and `AC location` when configured; the response contract below, including `return the report as your response; do not write the output file - the harness persists your response there`. For a retry after an AC conflict, append `AC conflict resolution: <typed reading>` and the child applies it as the operator's resolution in stage 0. Supply nothing about sibling tickets. Mark each `plan_tracker` row `in_progress` at dispatch. Leave `forceTopLevelAsync` unset; a returned async handle for any task is that ticket's failure (`FAILED - detached child`), never polled.

Response contract - the child's whole response, in this order:

1. `## Handoff` - metadata the parent needs for the write, never displayed: `status: <gathered tracker status>`; `acs:` the normalized AC texts as gathered (stripped list marker and checkbox, collapsed whitespace), one per line, with `(resolved: <reading>)` on any row an AC-conflict resolution settled; `write: full | status-only | body-only | none`, per `SKILL.md` stage 0 (`full` when no `Delivered: <sha>` marker exists for the shipped SHA; `status-only` when the marker exists but the configured target state was not reached; `body-only` for the unstruck ratified-descope repair; `none` on the failure path or a STOP); then the exact payload of each half approval may post (evidence comment text starting `Delivered: <sha>`, status command, body-edit before/after lines).
2. `## Report` - the display report in the shape `SKILL.md` `## Confirmation gate and the batched write` presents: shipped SHA, deliverable set, stage results including skips, per-AC verdict table with evidence, reviewer script, and the write about to happen.
3. The result line, the last line of the response, exactly one of the table below. Result lines and the handoff block are private transport, never a message first line.

| Result | Line | Parent rendering |
|---|---|---|
| Stages 0-3 completed, gate-ready or failure path | `REPORT` | the display report under the confirmation gate |
| A single-ticket STOP branch, or the AC-conflict pause | `STOPPED - <stuck reason as SKILL.md words it>` | the reason under the recovery gate |
| Marker for the shipped SHA already recorded: terminal ticket with the marker, or non-terminal with marker and target state both reached | `STOPPED - already recorded` | plain outcome `<ref>: already recorded`, no gate |
| Anything else: error, missing, unreadable, empty, or off-contract file, timeout, async handle | parent classifies as `FAILED - <first error line>` | the reason under the recovery gate |

Once the batch returns, read every report file from `<REPORT_DIR>` yourself; the tool result is only a saved-path pointer and is never pasted. Classify each ticket by its file's last line, keep `## Handoff` for the write step, and render only `## Report`.

**`## Turns`.** After every child returns, render one ticket per message in roster order, never two tickets' gates or menus in one message, never a combined pick. Open every advancing message at column zero with exactly one marker per `menu-layout.md`, then the `#### <ref>` heading:

- `REPORT`: open with `gauntlet: gate=check-delivery/confirmation-gate`, then `#### <ref>`, then the `## Report` section verbatim (without `## Handoff` and the result line). Render the gate as `SKILL.md` `## Confirmation gate and the batched write` does: same two options, same `menu-layout.md` rule. On `1` or typed `yes`: re-fetch the ticket and compare its status and normalized AC texts with the `## Handoff` baseline; a delta re-presents this ticket's gate with the delta, not the next ticket's. No delta: perform exactly the halves `write:` names, in the single-ticket order (body edit for a ratified `proposed descope` -> evidence comment with `Delivered: <sha>` first -> status advance when configured; `status-only` posts no comment; `body-only` posts no comment and no status), patching the re-fetched body. Mark the tracker row `complete` (written or manual) or `failed` (partial write). On `2` or any other reply except `stop`: no write, outcome `declined`, row `complete`. A report on the failure path (any `unexplained gap` or failed stage) offers the findings comment behind the same gate, per ticket.
- `STOPPED - <reason>` (other than already recorded) and every `FAILED`: open with `gauntlet: gate=check-delivery/set-recovery`, then `#### <ref>`, then the quoted reason (for an AC conflict, the quoted rows), then `1. retry` / `2. skip`. On `1` for an AC conflict: a separate `gauntlet: question` turn asks for the reading (`Type the AC reading to apply, or skip`); an empty reply or `skip` marks the row `skipped`; a nonempty reading re-dispatches that one ticket alone with the same task text plus `AC conflict resolution: <reading>`, awaited, then re-renders this ticket's turn. On `1` otherwise: re-dispatch with the same task text and re-render. On `2`: row `skipped`; a failed row left unretried stays `failed`.
- `STOPPED - already recorded`: no options; row `complete`; outcome `already recorded`, stated as plain text in the next advancing message or the closing summary.

After a decision, perform that ticket's approved write first, then compose one message: the next ticket's marker at column zero, the previous ticket's outcome as plain text under its own `#### <ref>` heading (`<ref>: delivered | manual | declined | already recorded | skipped | failed - <reason or halves landed>`, no `gauntlet:` prefix), then the next ticket's heading and body. Per-ticket `gauntlet: done` and `gauntlet: stuck` lines are never emitted while the roster continues.

After the last ticket settles, close with one set-level marker, then one line per ticket in roster order (`<ref>: delivered | manual | declined | already recorded | skipped | failed - <reason>`), then `rm -rf "$REPORT_DIR"`. The marker is `gauntlet: done <counters>` with nonzero `<key>=<count>` counters comma-joined without spaces in the fixed order `delivered,manual,declined,already-recorded,skipped,failed`; when `failed` is nonzero use `gauntlet: stuck <same counters>`. Declined and skipped are human decisions, not failures.

Handle a typed `stop` before the generic reply rule, at any gate or recovery menu: at a confirmation gate the current ticket's outcome is `declined`; at the recovery gate it is `skipped`; no write; every unrendered ticket is `skipped`; the same message renders the closing marker and summary, naming the reports as still readable until cleanup.

Set mode performs no cleanup of git state: it created none. Two set runs at once keep `SKILL.md` `## Idempotency and concurrency` as written.

### `agents/delivery-checker.md` - the child

Add: this persona, following the persona rules in `/skill:forge-skill`. Frontmatter: `name: delivery-checker`; `description: Runs one ticket of a check-delivery set: stages 0-3 of the injected skill, read-only, returning the report as its response. Not for direct dispatch.`; `tools: read, grep, find, ls, bash, plan_tracker`; `defaultContext: fresh`; `inheritProjectContext: true` (project `AGENTS.md` and the overrides file carry the consumer's verification routing the injected skill assumes is in context; the parent transcript and sibling ticket data are never inherited); `inheritSkills: false` (the parent injects `check-delivery`, plus `linear` for a Linear ticket); `systemPromptMode: replace`; `completionGuard: false`; `model` and `thinking` unset so the preset's `agentOverrides` knobs apply.

Body, whole-prompt: you verify delivery of exactly the one ticket your task names, using the injected `check-delivery` skill's stages 0-3 as your procedure, in a checkout you never mutate (no fetch, no checkout, no worktree, no file edit). Use the task's resolved tracker, verb table, default branch, and `## Delivery` values; do not re-run the ladder. Skip stage 1 step 2: the parent fetched. Never post, edit, or advance anything in the tracker; the write verbs in your task are for the parent. The stage 0 "pause for operator" branch is unavailable to you: return it as `STOPPED - AC conflict - <quoted rows>`. Every other STOP branch returns `STOPPED - <reason in the skill's words>`; a marker for the shipped SHA already recorded (terminal ticket, or target state already reached) returns `STOPPED - already recorded`. Return your whole response in the task's response contract: `## Handoff` (gathered status, normalized AC texts, resolved readings, the write shape and exact halves), `## Report` in the shape the skill's confirmation gate presents, then exactly one result line: `REPORT`, `STOPPED - <reason>`, or `FAILED - <reason>`. Do not write the output file your task names; the harness persists your response there. `plan_tracker` stages and AC rows are yours and session-local; use them when the tool exists.

### Documentation and records

- `README.md`: in the rules an override cannot change, replace "check-delivery requires exactly one explicit ticket ref" with "check-delivery takes explicit ticket refs and never discovers them; set mode is pi-only"; in the skill summary name the set form alongside the single form; in the `## Delivery` overrides explanation replace "Delivery is single-ticket." with "A single ref runs in-session as before; two or more refs run set mode (pi only), one fresh child per ticket and one gate per ticket in turn."
- `doc/gate-contract.md` `## Gates`: the existing `check-delivery/confirmation-gate` row gains a second site row `skills/check-delivery/reference/batch.md | ## Turns | N. rows`; new rows `check-delivery/set-recovery | gate | skills/check-delivery/reference/batch.md | ## Turns | N. rows` and `check-delivery/ac-conflict-reading | question | skills/check-delivery/reference/batch.md | ## Turns | free`. `## Terminals`: rows for the set settlement line (`skills/check-delivery/reference/batch.md § ## Turns | gauntlet: done delivered=1`, dynamic counters in the fixed order above, `stuck` with the same counters when `failed` is nonzero) and for the set-level admission and shared-prep stops (`§ ## Admit`, `§ ## Shared prep` | `gauntlet: stuck`). `## Reading a reply`: the recovery gate takes `1`/`2` or `stop`; the reading question takes free text or `skip`. `node scripts/gate-contract-lint.mjs` passes.
- `doc/personas.md`: roster entry and knobs-table column for `delivery-checker` (`tools` as approved, `thinking` and model unset, `defaultContext: fresh`, `inheritProjectContext: true`, `inheritSkills: false`, `completionGuard: false`, no `subagent`), with a "why each pin" bullet stating that project context is inherited and the transcript is not.
- `CHANGELOG.md` `## Unreleased`: one entry for set mode, the persona, and the superseded Item 3.
- `doc/specs/2026-08-18-check-delivery-consumer-feedback.md` and `doc/specs/2026-08-18-gh-10-check-delivery-skill.md`: supersession banners for the named sections only, per `reference/superseding.md`.
- `eval/check-delivery/`: see `## Tests`.

## Errors and edge cases

| Case | Behavior |
|---|---|
| Set-level: no `subagent` tool, bad token, oversized, duplicate, fetch failure, missing read capability (ladder or child-uncallable verb) | whole set rejected or stopped with one `gauntlet: stuck <line>` message before dispatch; nothing written, nothing dispatched |
| Per-ticket STOP in a child (unreadable ref, repo mismatch, zero ACs, open deliverable PR, ambiguous deliverable set, stage 2 unreachable or unbound, already terminal without the marker) | that ticket renders `STOPPED - <reason>` under `check-delivery/set-recovery` with retry/skip; siblings unaffected; never downgraded |
| Marker for the shipped SHA already recorded (terminal, or target state reached) | outcome `already recorded` as plain text, no gate, no write |
| Marker present, target state not reached | `write: status-only` in the handoff; on approval the parent posts no comment and advances the status only |
| Unstruck ratified descope under `descope edits: strikethrough` | `write: body-only`; on approval the parent patches the re-fetched body only |
| AC conflict in stage 0 | `STOPPED - AC conflict - <rows>` under the recovery gate; retry asks for the reading in a `gauntlet: question` turn; a nonempty reading re-dispatches that ticket alone |
| Child error, missing or unreadable or malformed report file, empty or off-contract output, timeout, async handle | `FAILED - <first error line>`; retry/skip; the parent never relaunches on its own and never accepts a detached child's later result |
| `unexplained gap` or failed stage in a report | failure path for that ticket: no delivery write, findings comment offered behind the gate |
| Pre-write re-fetch differs from the handoff baseline (status or normalized AC texts) | re-present this ticket's delta and gate; no write; the roster waits |
| Partial write in one ticket | outcome `failed - <halves landed>`; row `failed`; next ticket's turn proceeds |
| Missing write capability | each approved ticket emits its manual halves, outcome `manual`; roster continues |
| Mixed trackers in one set | each ticket resolves and probes its own tracker once; a child receives only its ticket's verb table |
| Concurrency | children run read-only git against one checkout after the parent's fetch; two set runs at once keep the single path's duplicate-comment guarantee |
| Typed `stop` mid-roster | current ticket `declined` (gate) or `skipped` (recovery); remaining tickets `skipped`; closing marker and lines in the same message; no write |

## Tests

- One ref behaves as before - existing samples `eval/check-delivery/samples/gate-line-first` and `menu-after-numbered-findings` hold.
- Two refs render one report and one gate per turn, never two gates in one message - `eval/check-delivery/samples/batch-one-gate-per-turn` (case: three `REPORT` report files read; expected: the first message starts with `gauntlet: gate=check-delivery/confirmation-gate`, carries only ticket 1's heading, display report, and gate, and contains no `## Handoff` or `REPORT` line).
- A declined ticket isolates - `eval/check-delivery/samples/batch-decline-isolates` (case: ticket 1 declined; expected: the next message opens with ticket 2's `gauntlet: gate=check-delivery/confirmation-gate`, states `<ref 1>: declined` as plain text, renders ticket 2's gate unchanged, no ticket 1 write, no ticket 2 write before its own approval).
- An approved write runs in that ticket's turn - covered by `batch-decline-isolates` expected text (ticket 2 approval -> re-fetch against the handoff baseline -> the named halves -> next message opens with ticket 3's gate marker and states `<ref 2>: delivered` before any ticket 3 body; no `gauntlet: done` line while ticket 3 is pending).
- Set-level rejection lines are exact - none: the four strings are fixed text in `reference/batch.md` `## Admit`; no deterministic hook exists for prose, and a text sample would only compare the string to itself.
- Child never writes to the tracker - none: a text eval cannot observe tool calls; the persona's tool list and prompt are the control, and the manual smoke below observes it.
- `git fetch origin` once in the parent - none: same reason; the task statement `fetch done - skip stage 1 step 2` is the control.
- AC-conflict `STOPPED` row with retry/skip - `eval/check-delivery/samples/batch-ac-conflict-row` (case: one report file ending `STOPPED - AC conflict - ...`; expected: the message opens with `gauntlet: gate=check-delivery/set-recovery`, shows the rows and `1. retry` / `2. skip`, no confirmation gate, no reading requested in that message).
- Set settlement marker - `eval/check-delivery/samples/batch-closing-marker` (case: last ticket declined after two delivered; expected: the message opens with `gauntlet: done delivered=2,declined=1`, then the three per-ticket lines).
- `delivery-checker` frontmatter - `scripts/ci.mjs` agent lint and the packed-install persona smoke in `npm test`.
- Gate inventory - `node scripts/gate-contract-lint.mjs` passes with the new gate, question, and terminal rows.
- Size caps and the removed sentence - instruction-size lint in `npm test`; `rg -c "Input is exactly one tracker ref" skills/check-delivery/SKILL.md` returns 0 (conformance check).
- Manual smoke, recorded in the PR body, not an eval: `/skill:check-delivery <two non-terminal tickets in this repo whose deliverable PRs have merged, each with an AC section and no Delivered: marker>` on pi with `tracker: github`, declining both gates; observed from the child and tool trace: two children, one parent `git fetch origin`, two confirmation gates in two messages, zero tracker writes. A closed ticket is a separate STOP scenario: its turn renders `STOPPED - already terminal` under the recovery gate (or `already recorded` when the marker exists).

`eval/check-delivery/target.json` gains `skills/check-delivery/reference/batch.md` `## Turns` as a second slice; if the assembled bundle exceeds `wordCap`, the plan splits the batch samples into `eval/check-delivery-batch/` with its own `target.json` and `intent.md`. `intent.md` names the new samples and their must-hold facts (one marker and one gate per message; decline isolates; the AC-conflict row opens with the recovery gate and asks no reading; the closing message opens with the set-level marker).

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md (override-immutable rule reworded to explicit-refs-never-discover, skill summary names the set form, `## Delivery` explanation drops "Delivery is single-ticket." - major procedure), doc/gate-contract.md (second confirmation-gate site, `set-recovery` gate, `ac-conflict-reading` question, set settlement and set-level stop terminal rows - communication contract), doc/personas.md (`delivery-checker` roster entry and knobs column - operations / tunable parameters), CHANGELOG.md - deferred: release
- Derived / memory docs invalidated: none (`.claude-plugin/marketplace.json` keeps `check-delivery`: the single path stays harness-portable and the set form rejects a harness without `subagent` with its own line; `eval/README.md` describes the runner, not this skill)

## Out of scope

- Ticket discovery, sweeps, or orphan scans: set mode takes an explicit list only.
- Queued picks executed after all tickets are decided: writes are immediate per ticket by decision.
- A child-rendered write payload file: the handoff block rides in the report artifact; the parent renders the write from the re-fetched state, as the gate section requires.
- Any change to `skills/gatekeep-pr/` or `agents/pr-gatekeeper.md`; no shared batch helper between the two skills.
- Claude Code set mode.
- A cross-run lock for concurrent set runs.
- Widening the child's tool list to reach MCP-only tracker reads.

## Open questions

- Whether `eval/check-delivery/target.json`'s `wordCap: 1200` admits the `## Turns` slice beside the gate slice is decided at plan time by assembling the bundle; the split target is the fallback.
