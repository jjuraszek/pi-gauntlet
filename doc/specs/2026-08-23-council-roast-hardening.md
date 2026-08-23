# Council roast hardening: dispatch-level input contracts, silence-kill timeouts, quorum salvage

## Context

During a `/skill:shape-ticket` run in a large consumer monorepo (session
`2026-08-23T14-45-13-059Z_01a02f15`, gridstrong), the council member on
`anthropic/claude-opus-5:low` ran
`cd <repo> && grep -rl "regulator_events" --include=* . | head -20` - a repo-root
recursive grep that ignores `.gitignore` over a ~10GB tree - and sat in that single
bash call for 22.7 min (run 1) and 10.6 min (run 2, identical command) until the
user aborted (SIGTERM, exit 143). The member failure failed the whole pi-cohort
parallel step, so the chair never ran even though 3 of 4 member critique files were
on disk; shape-ticket's retry contract re-ran the full 4-member dispatch, which
wedged identically, and the run degraded to `roast unavailable`. Total cost: ~33
minutes and two aborts for a ticket-content roast whose draft was done in minutes.

Root-cause chain (all verified against source):

1. `agents/spec-council-member.md:15` mandates "check the spec's claims against the
   actual codebase" via read/grep/find/ls. `skills/shape-ticket/SKILL.md` step 2
   supersedes only the *spec-axis template*, not the verification mandate - so
   ticket roasts inherit repo excavation they do not need.
2. No effective kill timeout: shape-ticket's `control: { needsAttentionAfterMs:
   600000 }` is an idle-notice threshold; pi-cohort's silence kill stays at its
   default. Effective kill = `max(inFlightSilenceKillMs, inFlightSilenceCeilingMs +
   needsAttentionAfterMs)` (`pi-cohort src/runs/shared/subagent-control.ts:56-59`;
   defaults 1800s / 600s / 60s) = 30 min.
3. All-or-nothing chair: the observed run fused members and chair into one chain,
   and any nonzero member exit fails a chain parallel step
   (`pi-cohort src/runs/foreground/chain-execution.ts:677-725`), so the chair step
   never ran. (Foreground top-level `tasks` calls report partial `N/M succeeded`
   without erroring the run - chain *fusion* is the all-or-nothing path, which is
   why the fix mandates two separate calls.) shape-ticket step 7's "partial member
   loss with a usable chair synthesis is success" is unreachable under a fused
   chain dispatch.
4. Retry amplification: step 7's "re-run the same full configured dispatch"
   re-runs members that already produced usable critiques into the same wedge.

Non-findings, recorded to prevent re-litigation:

- **Effort is already low for ticket roasts.** shape-ticket step 3 appends `:low`
  to member and chair model strings, and pi-cohort gives the model-string suffix
  precedence over frontmatter/config thinking
  (`src/shared/model-info.ts:33-38`, `resolveEffectiveThinking`). The failed opus
  child's session confirms `thinkingLevel: low`. The persona's `thinking: xhigh`
  pin is inert under a suffixed dispatch; no effort change is part of this spec.
- **`bash` stays in the member toolset.** It is load-bearing for output-file
  persistence (AGENTS.md, agents section); removing it historically produced stub
  or lost critiques.

## Goals

1. Ticket roasts review ticket CONTENT only. The task-text prohibition on
   repository access is the primary control; the silence-kill timeout is the
   enforced backstop for a member that ignores it (the member's toolset and
   inherited project context are unchanged, so this is a contract, not a sandbox).
2. Spec roasts keep codebase verification, but bounded - no unbounded scans.
3. A wedged member is killed in ~5 min (ticket roast) / ~10 min (spec roast), not
   30, and its loss degrades the roast instead of failing it.
4. Retry is targeted: only members without a usable critique are re-run, once.
5. The persona defines HOW a council member operates; the dispatching skill
   defines WHAT it reviews and against what. No *verification-scope* text remains
   in the persona (the axes template stays spec-flavored; dispatching task text
   already supersedes its artifact framing, as shape-ticket does today).

## Non-goals

- No pi-cohort changes. Everything uses existing call-site knobs (`control`,
  `tasks`, `reads`, `output`). The chain partial-failure continuation primitive
  and the `error: null` diagnosability gap on manual aborts are separate pi-cohort
  concerns, out of scope here.
- No new agents, no new `piGauntlet.*` settings keys, no frontmatter changes.
- No change to the worker fallback path in either skill (single agent, no quorum;
  it gets no control block).
- No change to roast effort levels (see non-findings).

## Implementation constraint

Edits are minimal and surgical: touch only the sentences, blocks, and steps this
spec names; preserve surrounding prose, structure, and formatting verbatim. No
opportunistic rewording, restructuring, or cleanup of adjacent skill/persona text.

## Design

### 1. Persona: `agents/spec-council-member.md`

Remove all input-scope content; keep and add HOW-content:

- **Remove** the codebase-verification mandate ("Read the spec in full. Use
  read/grep/find/ls to check the spec's claims against the actual codebase").
  Generalize the persona's *opening framing* to artifact-neutral wording ("you
  receive a problem statement and the artifact under review, as defined by your
  dispatching task"); the dispatching task text now fully defines the artifact
  and the verification depth. The axes template's spec-flavored wording stays
  verbatim - dispatch task text supersedes it where needed (shape-ticket already
  does this).
- **Add** a read-only invariant (universal council truth): the member never
  modifies the repository or any input artifact; its only write is its findings
  file at the dispatched output path. This also documents why `bash` remains in
  the toolset.
- **Add** a verification-hygiene block, applied only when the dispatching task
  asks for codebase verification: prefer `rg` (respects `.gitignore`) over
  recursive `grep`, with `rg`-native bounds (`--max-count`, explicit paths);
  scope every scan to explicit paths, never a repo root; bound scans with the
  portable ladder already documented in `skills/gatekeep-pr/SKILL.md` (`timeout`,
  else `gtimeout`, else fail closed) - a scan that times out or cannot be bounded
  is reported as unverified, never retried broader or run unbounded.
- **Keep** unchanged: the axes template, findings format, severity discipline,
  output-file mechanics, and all frontmatter (tools, `thinking: xhigh` pin,
  fresh context).

`agents/spec-council-synthesizer.md` keeps its no-discovery rule and `reads`
injection, and its contested-claim codebase check (`read/grep/find/ls` when
members disagree) gains the same verification-hygiene bounds as the member
persona. Whether that check is permitted at all is dispatch-supplied, like the
members' scope: shape-ticket's chair task text forbids it (see section 3);
roasting-the-spec's chair keeps it, bounded.

### 2. `skills/roasting-the-spec/SKILL.md`

Already two-call (member fanout, then chair). Changes:

- **Member task text** gains the verification mandate the persona lost: verify the
  spec's load-bearing claims against the codebase, bounded per the persona's
  hygiene rules (`rg`, explicit paths, `timeout 30`).
- **Control block** on the member fanout call becomes
  `control: { needsAttentionAfterMs: 300000, inFlightSilenceCeilingMs: 300000,
  inFlightSilenceKillMs: 600000 }` -> effective kill `max(600s, 300+300) = 600s`
  (10 min; xhigh members legitimately run long tool-less turns). The prose
  explaining the old 10-min idle threshold is updated to explain the kill
  semantics instead.
- **Chair control** becomes `control: { needsAttentionAfterMs: 300000,
  inFlightSilenceCeilingMs: 600000, inFlightSilenceKillMs: 900000 }` -> effective
  kill 15 min. Margin rationale: one observed healthy chair turn ran 506s of
  silence; a 600s kill leaves under 2 min of margin, so the chair gets 900s.
- **Usable-critique definition** (structural, identical in both skills): a member
  file is usable iff it is non-empty AND contains both a
  `^verdict:\s*(sound|needs-work|unsound)` line and an `^addresses-problem:`
  line. A `findings:` header with zero bullets is a valid, usable sound critique
  (the member template omits bullets when there are none). A chair synthesis is
  usable iff it contains a `^consensus:` line. Preamble stubs (the historical
  87-byte failure) fail the header test. The parent applies this as a
  **mechanical structural probe only** - existence plus header regex, no reading
  of findings content, no adjudication; roasting-the-spec's "Do not read these
  files yourself" sentence and its "Reading member critique files yourself" red
  flag are rewritten to name this exception precisely.
- **Targeted retry**: after the fanout returns (success or failure of the tool
  call itself), probe the expected output paths on disk. Members whose file is
  missing or not usable are re-dispatched once, together, in a second parallel
  call carrying the same control block, with fresh output paths that preserve the
  `member-<i>-<slug>` basename under a `retry/` subdir of the same temp dir (the
  chair recovers `raised-by` attribution from that filename pattern). Members
  with usable files are never re-run. The existing skip-and-continue sentence is
  superseded by this contract.
- **Quorum + coverage note**: >= 1 usable file -> dispatch the chair over the
  usable files only; the chair's task text states coverage ("N of M members
  reported; <member>: <one-line reason, e.g. pi-cohort's 'Likely wedged in a tool
  call' diagnostic; fallback when no diagnostic exists: 'no output produced'>").
  With N=1 the task text uses singular wording ("synthesize the single member
  critique"). The audit format gains a fourth line, `Coverage: N of M members
  reported; <slug>: <reason>`, prepended above `Applied:`/`Deferred:`/`Rejected:`
  in roasting-the-spec step 4, and `skills/brainstorming/SKILL.md`'s gate/commit
  template gains one line rendering `Coverage:` when present (omitted at full
  coverage). 0 usable files after retry -> abort the council and return to
  brainstorming's gate (existing behavior).
- **Chair failure**: retry the chair once (existing inherited-model retry stays
  for unreachable configured chairs; a wedge-kill retry uses the same model);
  second failure -> abort to the gate as above.

### 3. `skills/shape-ticket/SKILL.md` (Roast section, steps 2, 7)

- **Two-call dispatch mandated** (step 2): the current wording lets the runner
  build a single chain (observed failure shape). Rewrite to the explicit shape:
  call 1 = one `subagent({ tasks: [...] })` per-member fanout with absolute temp
  `output` paths and the control block; parent inspects files; call 2 = chair with
  `reads` = usable files only. Never fuse members and chair into one chain.
- **Member task text** adds the input contract: content-only review; judge the
  draft against the provided temp artifacts (draft body + source snapshot); the
  temp files **plus the referenced `reference/split-axes.md` path** (which step 2
  already injects) are the entire permitted input - nothing else may be read,
  searched, or scanned. (`cwd` remains the repo root for path resolution, but the
  repo is out of bounds as review input.)
- **Control block** becomes `control: { needsAttentionAfterMs: 60000,
  inFlightSilenceCeilingMs: 240000, inFlightSilenceKillMs: 300000 }` -> effective
  kill `max(300s, 240+60) = 300s` (5 min) for members; the chair uses the same
  block (`:low` chair turns are short; the spec-roast margin concern does not
  apply). The **full-roast escape** (Roast item 3) restores xhigh pins, so a
  full-roast dispatch reuses the roasting-the-spec control blocks instead
  (members 600s, chair 900s) - the 5-min figures are `:low`-only.
- **Chair task text** (ticket roasts) forbids repository access: member
  disagreement on a fact is reported in the synthesis, not verified against the
  repo. This matches the member-side content-only contract.
- **Step 7 rewritten** around the new semantics:
  - *failed member* = output file missing or failing the structural usable test
    (section 2's definition, applied verbatim) after its one targeted retry,
    which follows section 2's retry contract (same control block, `retry/`
    subdir, preserved basename);
  - *failed roast* = zero usable member files after retry, or chair failure after
    its one retry;
  - "partial member loss with a usable chair synthesis is success" stays, now
    reachable; the chair retry (wedge-kill case) uses the same `:low`-suffixed
    model, per section 2's rule;
  - partial coverage is user-visible: the confirmation gate renders the
    `Coverage:` line alongside the draft (mirroring brainstorming's gate);
  - degrade path unchanged: `roast unavailable (<reason>)` rendered inline at the
    confirmation gate;
  - the one-re-pass draft-edit budget is unchanged; retries are dispatch retries
    only.
- The `split-axis:` direct member-file scan (step 5) reads the usable files only.

### 4. Timeout figures (normative)

| Dispatch | needsAttentionAfterMs | inFlightSilenceCeilingMs | inFlightSilenceKillMs | Effective kill |
|---|---|---|---|---|
| shape-ticket members + chair (`:low`; full-roast uses the spec-roast rows) | 60000 | 240000 | 300000 | 300s |
| roasting-the-spec members | 300000 | 300000 | 600000 | 600s |
| roasting-the-spec chair | 300000 | 600000 | 900000 | 900s |

The three-field blocks are recorded verbatim in both skills so a future pi-cohort
default change cannot silently stretch the effective kill (the `max()` clamp binds
only from below when all three fields are explicit).

### 5. Incident replay under the new design

Opus wedges on a forbidden scan (now unlikely - the task text gives it no reason to
touch the repo): killed at 5 min with pi-cohort's "Likely wedged in a tool call"
diagnostic; targeted retry re-runs opus alone (worst case another 5 min); chair
runs over 3-4 usable critiques by ~minute 12 with a coverage note, instead of
`roast unavailable` at minute 33 after two full-council re-runs and two manual
aborts.

## Error handling and edge cases

- **Member file exists but is a stub**: fails the structural header test; enters
  targeted retry; counted as failed after it.
- **Fanout tool call returns error but files are on disk**: the parent judges by
  files, not by the tool result's failed/succeeded labels - a killed member may
  have written a usable critique before the kill.
- **All members fail**: existing degrade paths in both skills, unchanged.
- **Kill diagnostics**: the parent surfaces pi-cohort's per-member kill reason in
  the coverage note rather than a bare "failed".
- **Idle notices**: lowered `needsAttentionAfterMs` values reintroduce
  needs-attention notices on long healthy turns (at 1 min / 5 min); these are
  notices, not kills, and are acceptable.

## Testing approach

- `npm test` (`scripts/ci.mjs`) stays green: marketplace allowlist paths and
  frontmatter for `shape-ticket` are untouched (body-only edits); no version bump
  in this change (release pairing is asserted at release time).
- Generic-skill grep gate (AGENTS.md): no project-specific content in the new
  prose; expected zero matches.
- Conformance review (verify phase) checks this spec against the delivered prose.
- Manual smoke (post-merge, optional): `pi install -l <worktree>` in a consumer
  repo, run a shape-ticket roast, confirm by inspection of the run records that
  members and chair are separate calls and the control block is present.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `AGENTS.md` (agents section: the
  spec-council-member paragraph's "Members do their own read-only verification -
  grep/wc/find" rationale is updated to "verification scope is dispatch-supplied;
  the persona carries hygiene and the read-only invariant"; the bash-is-load-bearing
  note stays), `CHANGELOG.md` (minor entry). Implementation surface also touched
  (not doc-impact entries): `skills/brainstorming/SKILL.md` (one-line `Coverage:`
  rendering in the gate/commit template).
- Derived / memory docs invalidated: none (README does not document council
  dispatch internals)

## Release

Semver: **minor** - persona + skill-body behavior change; no rename, no settings
schema change, no new dispatch shapes required from pi-cohort (README
peer-dependency minimum unchanged).

## Open questions

None blocking. Deferred to pi-cohort (out of scope): structured partial-failure
continuation for chain parallel steps; populating `error` on manual aborts.
