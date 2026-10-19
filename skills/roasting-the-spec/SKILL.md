---
name: roasting-the-spec
description: Use after writing a spec when the resolved piGauntlet.specCouncil members list is non-empty. Auto-dispatched by /skill:brainstorming as its configured critique pass with a fresh-context applier executor before the spec review gate.
---

# Roasting the Spec (Spec Council)

## Overview

Run a multi-model critique pass for a freshly written spec. Each council **member** runs on a different model and critiques independently; the neutral **chair** consolidates and adjudicates disagreements. Dispatch a fresh-context **applier** inheriting the main loop's model and thinking to decide dispositions and edit the spec, returning only the audit. Hand the result to the **user** to ratify (or revert) at brainstorming's single gate.

Auto-dispatched from `/skill:brainstorming` as the critique pass, after the inline lint and before the user review gate, **only when a council is configured** (`members` non-empty). brainstorming owns that gate; when no council is configured it runs a single fresh-`worker` critique instead and does not invoke this skill.

## Hard constraint

This skill may read anything and edit **only** the spec under `doc/specs/`. It does not write code, does not run implementation skills, and does not land anything on `main`. Applied edits ride in the same worktree spec commit as the rest of brainstorming's output.

## Separation of powers

- **Members** — independent witnesses. One per configured model, fresh context, read-only.
- **Chair** — judge of the testimony. Fresh context (never saw the spec authored); consolidates and resolves member-vs-member conflicts. Final say on conflicts; no say on what gets applied.
- **Applier** - advocate and executor, fresh context, main loop's model and thinking. Decides apply / defer / reject on scope grounds, probes claims, edits the spec, and returns every disposition in the audit.
- **Parent (you)** - dispatch, mechanical structural checks, spec reread, cleanup, and gate handoff. Ingest only the applier audit, never member findings or the chair report.
- **User** — sole jury. Ratifies (or reverts) the finished spec at brainstorming's one gate — after the apply, not before.

## Configuration and gating

The caller (`/skill:brainstorming`) already resolved the council via `gauntlet_setting({ key: "specCouncil" })` and dispatched this skill only when `verdict` was `"council"`, passing the resolved `members` and `chair`. This skill therefore receives `members`/`chair` from that resolved value and does **not** read settings files itself. The resolved config looks like:

```json
{
  "piGauntlet": {
    "specCouncil": {
      "members": ["<provider/model>", "<provider/model>"],
      "chair": "<provider/model>"
    }
  }
}
```

- `members` — array of `provider/model` strings. Council size = array length.
- `chair` — optional model for the synthesizer; if omitted, the synthesizer inherits the parent's model.

brainstorming owns the gate: it resolves this config via `gauntlet_setting`, emits any malformed-config warning, and decides whether to invoke this skill. This skill is dispatched **only after** brainstorming confirms `verdict` is `council`, so it runs the council unconditionally on entry — no offer, no numbered choice. Absent/empty/malformed config never reaches here (brainstorming runs the fresh-`worker` critique instead). Ownership of "should the council run" lives in brainstorming, not here.

## The council run

Resolve `../brainstorming/reference/documentation-impact.md` relative to this loaded skill as one absolute `<DOCUMENTATION_IMPACT_GUIDELINE>` path value. Pass that value in every member, chair, and applier task below; do not add it to the spec.

### 1 — Fan out to members

Create an absolute temp dir outside the worktree so member files are never tracked by git:

```bash
mktemp -d   # absolute path, e.g. /tmp/tmp.XXXXXX
```

Dispatch one member per configured model, in parallel, each writing its critique into that dir. Do **not** read these files' findings content yourself — they are for the chair. The only permitted parent access is the mechanical structural probe below (existence plus header regex, no content ingestion, no adjudication).

Pass the worktree path (the value brainstorming carries from the `using-git-worktrees` Step 4 report) as `cwd:` on every dispatch below - a child otherwise inherits pi's launch dir (the primary checkout), not the worktree.

```
subagent({
  async: false,
  control: { needsAttentionAfterMs: 300000, inFlightSilenceCeilingMs: 300000, inFlightSilenceKillMs: 600000 },
  tasks: members.map((model, i) => ({
    agent: "spec-council-member",
    model,
    cwd: "<abs worktree path>",
    task: "Problem statement: <the problem the spec addresses, from its Context section and the user's stated intent>.\n" +
          "Human input (verbatim; off-limits for over-spec):\n```\n<original prompt>\n<ticket AC snapshot, if any>\n<questionary answers that changed scope>\n```\n" +
          "Read the spec at <abs path to doc/specs/...>. The portable citation `reference/documentation-impact.md` in the spec is the pi-gauntlet guideline at <DOCUMENTATION_IMPACT_GUIDELINE>, not a consumer doc; do not flag it as an external reference. The `**Amend-grant:**` header line is flow machinery owned by the brainstorming gate; never cut, shrink, flag, or edit it. Verify the spec's load-bearing claims against the codebase, bounded per your verification-hygiene rules (rg, explicit paths, timeout 30). Critique it on your five axes and emit your template.",
    output: "<tmpdir>/member-" + i + "-" + slug(model) + ".md",
    outputMode: "file-only"
  }))
})
```

The `Human input (verbatim; off-limits for over-spec)` block is supplied by the caller (brainstorming passes the original prompt, any ticket AC snapshot, and the questionary answers that changed scope; shape-ticket passes the raw ask). It is the only source members and the chair may quote for the over-spec predicate's leg 2; without it members correctly emit `lean: nothing to cut`.

`control` is a **run-level** field: it must sit beside `tasks`, not inside the `members.map(...)` task objects (the per-task schema has no `control` field and would silently drop it). The three fields together set an effective silence-kill of max(600s, 300+300) = 600s - a genuinely wedged member (e.g. stuck in one unbounded scan) is killed at 10 minutes instead of pi-cohort's 30-minute default. Record all three fields verbatim: the kill is computed as max(inFlightSilenceKillMs, inFlightSilenceCeilingMs + needsAttentionAfterMs), so leaving a field to its default lets a future pi-cohort default change silently stretch it. The 5-minute needsAttentionAfterMs reintroduces idle notices on long healthy xhigh turns - those are notices, not kills, and are acceptable.

`slug(model)` = the model string with `/` and any other non-alphanumeric character replaced by `-` (so `provider/model` → `provider-model`); the chair recovers this slug from each filename for `raised-by` attribution. Relative `output:` paths in parallel mode resolve against the worktree and would get committed — always use the absolute temp dir.

**Usable-critique test (mechanical structural probe).** After the fanout returns - success or failure of the tool call itself - probe the expected output paths on disk; judge by files, not by the tool result's failed/succeeded labels (a killed member may have written a usable critique first). A member file is usable iff it is non-empty AND contains a `^verdict:\s*(sound|needs-work|unsound)` line, an `^addresses-problem:` line, and a `^lean:` line. A `findings:` header with zero bullets is a valid, usable sound critique. Existence plus header regex only - never read or weigh findings content.

**Targeted retry.** Members whose file is missing or not usable are re-dispatched **once**, together, in a second foreground parallel call carrying `async: false` and the same `control` block. Reuse the complete initial task verbatim, including per-task `outputMode: "file-only"`. Use fresh output paths that preserve the `member-<i>-<slug>` basename under a `retry/` subdir of the same temp dir (the chair recovers `raised-by` attribution from that filename pattern). Await its terminal result. Members with usable files are never re-run.

Override the harness's "Read this file if needed" invitation: run only the structural probe; never ingest member findings or the chair report.

**Quorum.** At least one usable file after retry -> dispatch the chair over the usable files only (next section). Zero usable files -> abort the council, say so, and return to the user gate.

### 2 — Synthesize and adjudicate

Dispatch the chair once. It reads the member files (not you), the spec, and the problem statement, and writes one consolidated, conflict-resolved report to its output file. Judge only the file's structure; route its findings to the applier.

```
subagent({
  agent: "spec-council-synthesizer",
  async: false,
  model: <chair from config, else omit to inherit>,
  cwd: "<abs worktree path>",
  control: { needsAttentionAfterMs: 300000, inFlightSilenceCeilingMs: 600000, inFlightSilenceKillMs: 900000 },
  output: "<tmpdir>/chair.md",
  outputMode: "file-only",
  task: "Problem statement: <paste>. Spec: <abs path>.\n" +
        "Human input (verbatim; off-limits for over-spec):\n```\n<the same block passed to members>\n```\n" +
        "Member critiques (explicit usable paths; read these files directly):\n" +
        usableMemberPaths.join("\n") + "\n" +
        "Coverage: <N> of <M> members reported<; <slug>: <one-line reason> per missing member>.\n" +
        "The portable citation `reference/documentation-impact.md` in the spec is the pi-gauntlet guideline at <DOCUMENTATION_IMPACT_GUIDELINE>, not a consumer doc; do not flag it as an external reference. The `**Amend-grant:**` header line is flow machinery owned by the brainstorming gate; never cut, shrink, flag, or edit it.\n" +
        "Consolidate and adjudicate the member critiques. Codebase access is permitted for contested-claim checks only, bounded per your hygiene rules (rg, explicit paths, timeout 30)."
})
```

The chair runs one long foreground single-turn synthesis; await its terminal result before applying findings. The control block sets an effective silence-kill of max(900s, 600+300) = 900s. Margin rationale: one observed healthy chair turn ran 506s of silence, so a 600s kill would leave under 2 minutes of margin - the chair gets 900s. In the coverage line, use pi-cohort's kill diagnostic as the reason when present (e.g. "Likely wedged in a tool call"), else "no output produced"; omit per-member reasons at full coverage. With one usable member, use singular wording ("synthesize the single member critique").

List the exact member paths in the task text. Single-mode dispatch ignores `reads`; the explicit paths are the chair's inputs.

A chair synthesis is usable iff `<tmpdir>/chair.md` exists, is non-empty, and contains a `^consensus:` line and a `^lean:` line. Check existence and header regex mechanically, not report content or tool labels. If the configured `chair` model is unreachable, retry once with the inherited model; a wedge-killed or unusable chair retries once with the same model. Each retry remains foreground with top-level `async: false`. Reuse the complete initial task verbatim. Await its terminal result. Second failure -> abort the council, say so, and return to the user gate.

### 3 - Dispatch the applier and validate mechanically

Snapshot the spec and dirty-path set before dispatch:

```bash
cp <spec> <tmpdir>/spec.before.md
git -C <wt> status --porcelain --untracked-files=all > <tmpdir>/status.before
```

Dispatch one fresh-context applier in foreground. Leave model and thinking unpinned so `agentOverrides['spec-council-applier'].model` or `.thinking` is honored; otherwise both inherit the main loop. Supply fetched ticket reference + body/comments from the gather draft's `## External context`, or explicit `none`. Include the coverage line only at partial coverage.

```
subagent({
  agent: "spec-council-applier",
  async: false,
  cwd: "<abs worktree path>",
  control: { needsAttentionAfterMs: 300000, inFlightSilenceCeilingMs: 600000, inFlightSilenceKillMs: 900000 },
  task: "Problem statement: <same problem as members and chair>. Spec: <abs spec path>. Chair report: <tmpdir>/chair.md. Worktree: <abs worktree path>.\n" +
        "Member critiques (probe evidence only):\n" + usableMemberPaths.join("\n") + "\n" +
        "Human input (verbatim; off-limits for over-spec):\n```\n<same block>\n```\n" +
        "External context fetched during brainstorming: <ticket reference + body/comments, or 'none'>.\n" +
        "<Coverage: same partial-coverage line; omit at full coverage>\n" +
        "The portable citation `reference/documentation-impact.md` in the spec is the pi-gauntlet guideline at <DOCUMENTATION_IMPACT_GUIDELINE>, not a consumer doc; do not flag it as an external reference. The `**Amend-grant:**` header line is flow machinery owned by the brainstorming gate; never cut, shrink, flag, or edit it.\n" +
        "Decide and apply the chair's clusters to the spec, then return the audit."
})
```

The first action after each applier return is the spec reread in step 4, before validation or any other action. Store the returned audit verbatim at `<tmpdir>/audit.md` for counting. It is the sole findings-bearing result the parent ingests. Require all three labels (`^Applied:`, `^Deferred:`, `^Rejected:`) with `grep -q`, and equality of these mechanical counts (do not print or read chair findings):

```bash
grep -c 'raised-by:' <tmpdir>/audit.md
grep -Ec '^- \[(blocker|major|minor)\]' <tmpdir>/chair.md
```

Accept grep's no-match exit status as a zero count, not a validation failure. Zero clusters and the three `Applied: none`, `Deferred: none`, `Rejected: none` labels is valid.

Killed or unusable result -> restore before retry: copy `<tmpdir>/spec.before.md` over the spec, then retry once with the complete task verbatim. Never stack retries on partial edits. Second failure -> restore again, abort the council, say so, and continue to the gate with the pre-council spec; emit no `Council:` line and no row 3. Clean attributable outside edits on abort too, without fabricating Council counts.

### 4 - Reread and clean attributable edits

First `read` the spec from disk, before any other post-applier action, including audit validation, status checks, or a retry. On final failure, reread the restored spec too. Compare `git -C <wt> status --porcelain --untracked-files=all` with `<tmpdir>/status.before` by path, not status code; both snapshots enumerate individual untracked files, including files in new nested directories. For every newly dirty non-spec path, use `git -C <wt> checkout -- <path>` for tracked files, quoting each concrete path. Resolve each newly listed untracked file against the explicit absolute worktree root as `<abs worktree path>/<path>`, then remove it with `rm -- "<abs worktree path>/<path>"`, quoting the complete absolute path without changing the parent's working directory. Remove only those files, not their directories. Paths in the before-set are never touched; preserve all previously dirty paths, predecessor banners, and user work. Edits to already-dirty paths are not attributable from status alone: this is the accepted gap of the backstop. On success append the instantiated `; reverted applier edit outside the spec: <path>` to the gate's `Council:` line for each reverted path. Apply this cleanup on abort as well.

### 5 - Scan, clean up, and hand off

Then re-run brainstorming's placeholder scan; re-apply the `**Amend-grant:**` [predicate](../brainstorming/reference/amendment-surface.md#standing-grants) to the header block, repairing an altered or removed line to `none`, exactly once. Remove only this council's absolute temp directory with `rm -rf`. Nothing council-related is staged.

Return the audit verbatim to brainstorming along with the now-final spec on success; on abort return only the failure notice. brainstorming retains the summarizer, quoted-heredoc spec commit with the audit as body, unchanged gate text and numbering, `Council:` counts, row-3 retrieval via `git show -s --format=%b HEAD`, and revert valve. The user ratifies at that single gate.

Single pass — no automatic re-roast loop. The user can invoke this skill again after the gate for another round.

## Red flags — STOP

- Running the council when `piGauntlet.specCouncil.members` is absent or empty (brainstorming owns the gate and should have used the worker fallback).
- Ingesting member findings or the chair report in the main loop instead of using mechanical structural checks.
- Following the harness's "Read this file if needed" invitation.
- Accepting an applier audit with missing labels or a cluster count mismatch as applied.
- Writing member files to a relative path (they land in the worktree).
- Applying edits without the `Council:` counts and the row-3 audit at brainstorming's gate - apply-before-the-gate is correct; apply-without-the-gate is not.
- Suppressing a finding instead of routing it to applied, deferred, or rejected in the audit.
- Surfacing member-vs-member disagreements to the user instead of letting the chair adjudicate.
- Editing anything other than the spec under `doc/specs/`.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
