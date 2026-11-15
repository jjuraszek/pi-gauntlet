# Bare-worktree reconstruction (gauntlet-resume supplementary)

Consumed only by `SKILL.md` in this directory, for a resolved worktree with no
`## Process state` to restore from - a bare worktree argument, or a brief without
process state whose worktree exists. Artifact presence never implies approval; task
commits never imply review acceptance. Every question below is a human question, and
no tracker call happens before the human answers.

Brief context: when the input was a brief, carry its `## Intent`/`## Decisions` verbatim
into every prompt below. When the input was a bare worktree, say so - "no brief context
available" - and never invent Intent or Decisions.

## Base

```bash
git -C <worktree> merge-base HEAD origin/HEAD 2>/dev/null \
  || git -C <worktree> merge-base HEAD main 2>/dev/null \
  || git -C <worktree> merge-base HEAD master 2>/dev/null
```

Base = `git -C <worktree> merge-base HEAD origin/HEAD`, else `main`/`master`. Empty -> ask the human
for a base ref before reading any artifact.

## Candidates

A pinned spec (seed route, `seed.md`) skips this section.

When the brief carries PR pairs, use its full `Rework base:` SHA as `<base>` when present, else the first pair's full `Pre-rework head:` SHA for spec
and plan candidate scans instead of the merge-base from "Base"; the PR's earlier
spec remains input, not an added candidate, so it does not trigger a multi-spec pick.
Keep pairing, untracked candidates, task evidence, and human confirmation below.
Without the optional pairs, including a bare worktree, use the ordinary base.

Resolve with `gauntlet_setting({ key: "flowGuards" })`; `<dirs>` below is its `specDirs` plus `planDirs` (each spec dir's sibling `plans` dir), space-separated.

```bash
git -C <worktree> diff --diff-filter=A --name-only <base>..HEAD -- <dirs>
git -C <worktree> ls-files --others --exclude-standard -- <dirs>
```

Take files under those directories added after base, plus untracked files there, as candidates. For a brief with PR pairs, also admit the spec whose run-worktree `## Rework record` lists the brief's `PR:` identities, even when tracked at `<base>`; pair it with a task plan at `<planDir>/<same basename>` or a ledger whose `**Spec:**` header resolves to it, whether or not either file was added after `<base>`. Paths returned by these commands are relative to `<worktree>`; resolve them to
absolute paths under `<worktree>` before reading artifacts, showing paths in prompts,
or calling `plan_check`. Read candidate contents before choosing. For a PR-list brief,
read the rework candidate's `## Rework record` and the member-carried spec paths listed
under each member in `## Problem`; exclude exactly those paths from new-rework spec
candidates before the multi-spec prompt. Keep this explicit exclusion set authoritative through plan/ledger pairing: when a task plan's basename or a ledger's `**Spec:**` header resolves to an excluded member spec, skip that pair in route candidates. Never promote an excluded member spec through its carried plan or ledger. Keep all other plan/spec pairing below, including
base-tracked specs. Artifact presence never supplies approval. Never choose by filename
when remaining candidates are genuinely ambiguous; ask the human.
Read every plan-directory candidate's first line. A line exactly `# Ledger - loop engine` pairs by its path-only `**Spec:**` header, not basename; resolve that spec under the worktree's configured spec dirs, including a spec tracked from base. Stop on a missing or foreign spec. A task-plan candidate pairs with
`<worktree>/<specDir>/<same basename>` whether that spec is a candidate or tracked
from base; count a base-tracked spec so paired as a spec in the route table below.
The plan commit is the first
post-base commit that added the plan file: `git -C <worktree> log --diff-filter=A
--format=%H --reverse <base>..HEAD -- <plan>`, first line. For a brief with `Rework base:`, when that lookup is empty and `git -C <worktree> cat-file -e <base>:<plan>` exits 0, use the `Rework base:` commit itself as the plan commit. An uncommitted plan has no
plan commit; treat every task as `pending`.

| Candidates | Route |
|---|---|
| no spec | stop; offer `/skill:brainstorming` or pass the spec: `/skill:gauntlet-resume <specDir>/<name>.md`; no tracker call |
| more than one spec | the human picks one, then continue below with that spec |
| one spec, no plan | "Spec without plan" |
| one spec with ledger | "Spec with ledger" (takes precedence over a task plan) |
| one spec with task plan only | "Spec with plan" |

For a coordinated brief, use `brief-contract.md` "Coordinated admission" before tracker writes. Resolve the home spec, never a companion leg file, and retain every approval question. For a ship-stage retry whose plan is stripped, use that section's receipt-validated exception rather than proposing a new plan.

## Spec without plan

Run SKILL.md entry check 6's deferred-header admission on the resolved spec before the approval/handoff question below; apply it to both routes, including the unapproved-draft brainstorming handoff. Keep grant decoding exempt for the unapproved route.

Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../brainstorming/reference/menu-layout.md).

Ask exactly one question: is this spec approved, or do you select `/skill:brainstorming`
with this unapproved spec as the draft? Show the spec path (and the brief's
`## Intent`/`## Decisions` when present).

- Approved: honor SKILL.md entry check 6's deferred stop before any arming; run SKILL.md entry check 6 on `<spec path>` first (a malformed `**Amend-grant:**` line stops here, no tracker call). Read the spec's `**Engine:**` line and take the matching route:
  - `loop`: call `start brainstorm`, then `skip brainstorm` with reason `resume: <spec path>` to arm the flow before `plan_check`. Carry absolute worktree/spec paths and the resolved plan directory into `/skill:loop-implementation` Entry steps 1-5: resolve settings at step 1 and verification at step 2, retain the driver's `skip plan` at step 3, create the ledger at step 4, then check/commit it, start implement and refresh by ledger path at step 5. Never enter the writing-plans body or initialize a derived task list.
  - `waves` or absent: `start brainstorm`; `skip brainstorm resume: <spec path>`; `start plan`; continue in writing-plans, skipping its `start plan` call.
- Selected unapproved-draft brainstorming handoff: invoke [`/skill:brainstorming`](../../brainstorming/SKILL.md) with
  the spec as the draft; arm nothing. using-git-worktrees Step 0 detects the existing
  worktree and creates none. A bare "not approved" answer is not consent; wait for
  explicit handoff selection.

## Spec with ledger

Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../brainstorming/reference/menu-layout.md).

Show the spec and ledger paths, current rows, iterations, last decision, and `git -C <worktree> status --porcelain`. Ask the human to confirm the approved spec and continuation; carry brief Intent/Decisions when present. Keep entry and same-repository checks.

After confirmation:

1. Read ledger line 1: require `# Ledger - loop engine`. Resolve its path-only `**Spec:**` header to an absolute spec path under the worktree's configured spec directories, not by basename. Run SKILL.md entry checks 1-6 in order, including check 6, **Grant field**, on that spec, before any tracker mutation. Run Pending recovery's read-only admission-evidence check below.
2. Call `phase_tracker({ action: "start", phase: "brainstorm" })`, then `phase_tracker({ action: "skip", phase: "brainstorm", reason: "resume: <spec path>" })`, then `phase_tracker({ action: "start", phase: "plan" })`.
3. Admit exactly one positive safe-integer `cap:` or `allowance:` header; both or neither is `ledger header malformed: <observed header lines>`, requiring human repair by hand. Call `plan_check({ planPath: <absolute ledger path> })` with legacy-compatible admission. On FAIL, stop with findings, retaining plan in_progress. Start the message with `gauntlet: stuck` followed by the findings reason on that line; never enter `## Plan repair` or writing-plans. On PASS, call `phase_tracker({ action: "skip", phase: "plan", reason: "resume: <spec> (loop engine)" })`, then `phase_tracker({ action: "start", phase: "implement" })`. Use the resolved absolute spec path as `<spec>` in the reason. Restore implement through refresh, not `init`.
4. **Shared allowance boundary (every ledger restore, before phase continuation).** Read `/skill:loop-implementation`. Skip Entry step 1's allowance seeding; restore base, verification, iterations, row attempts and decisions from the ledger without reseeding. Resolve `gauntlet_setting({ key: "loopEngine" })` exactly once at the driver's authorized-restore grant boundary and retain `escalateAfter` in driver memory for this run; share this read with step 4.2, never refresh it inside the loop. On an unavailable tool, stop before any dispatch or write with `cannot resolve escalation threshold: settings tool unavailable (loopEngine.escalateAfter)`. Apply the following order on bare-worktree and brief routes alike:
   1. Apply pending recovery below against the unmigrated ledger, including home returns whose child commit removed the tuple. Validate the original one-commit `<pre-dispatch HEAD>..HEAD` range against its unchanged before-image. For companions, retain unchanged home HEAD and admit the expected iterations-bump-plus-tuple dirt. With a recoverable on-disk tuple and before-image, treat wrong attribution, unexpected home dirt and home movement as interrupted boundaries; reset the selected companion and home through common recovery before the home-only repair. Stop before refresh only when the tuple or before-image is unrecoverable. Resolve ambiguous-history admission before tracker calls as required below. Apply the driver's unconditional interrupted recovery before migration; migration changes neither admission ranges nor the home HEAD used for recovery.
   2. Migrate only a clean, tuple-free ledger after admission or completed interrupted recovery. Read [commit-message.md](../../finishing-a-development-branch/reference/commit-message.md) for every migration or repair message. With `cap:` and no `allowance:`, reuse the single restore-boundary settings read and replace the cap line with `allowance: <maxIterationsPerRow>`. Commit only that header replacement using the Allowance migration on resume sentence; preserve iterations, every attempts cell and all decisions. With an existing allowance, use it without allowance resolution or a migration commit; the restore read supplies `escalateAfter` only. Then run Returns conversion below. Defer both migrations through a missing-history stop or the dirty-tree stop; after recovery reaches a clean, tuple-free tree, migrate before the next dispatch or verification.
   3. Require `allowance:`, no `cap:` and exactly one `returned:` immediately after step 4.2 and before the single `plan_tracker refresh` in step 4.4, including for all-closed ledgers. On missing allowance stop with `ledger has no allowance: line - resume through /skill:gauntlet-resume`; on missing returned stop with `ledger has no returned: line - resume through /skill:gauntlet-resume`; name malformed or duplicate headers. State this post-migration validation step explicitly. For a missing-history stop or unresolved dirty tree, defer final validation with migration and project the unmigrated ledger solely to report the stop.
   4. Call `plan_tracker({ action: "refresh", path: <absolute ledger path> })` exactly once for the restore after phase restoration, recovery, eligible migration commits and step 4.3's final header validation, before any unresolved dirty-tree stop or dispatch. On verify/ship, restore the saved mixed task list first as `brief-contract.md` specifies; on implement, use no `init`. On refresh failure, stop with its findings and leave the existing task list untouched. Read `plan_tracker status` and report its exact observed state, never an inferred list.
   Render the allowance header, rows, iterations, attempts, effective allowances and all decisions; distinguish the latest operational `row <n> ...` decision from the last physical history line. Compute each effective allowance as the header plus one per matching retry decision; ignore the retry's audit ceiling. Keep `cap +N` history as inert text and restore no funded rounds. For an interrupted return with a recovered pending tuple and before-image, apply the driver's [## Interrupted recovery](../../loop-implementation/reference/interrupted-recovery.md) without a human turn. Preserve the already-consumed iteration, count the failed attempt once, and return to the ordered table after repair; check allowance only there. Keep unrecoverable before-image and ambiguous-history stops. Resume the original phase only after this boundary: implement at `Before each dispatch`; verify/ship at `After the loop` step 1.
5. Continue at loop step 5, the delivered driver's `Before each dispatch`, with durable iterations and retry data; an all-closed ledger completes implement through refresh and takes `After the loop` step 0. A migrated unresolved row at or above its effective allowance stops under rule 2 without an attempt; keep an allowance-stopped row `failed`. Only at a missing-history stop, render a row whose `pending:` tuple stays on disk as `row <n> in_progress (pending tuple restored)`. Never reset counters or reseed a validated seed.

### Pending recovery

Select the decoder before any tracker call: no `returned:` line -> Legacy pending recovery below, then Returns conversion at step 4.2; exactly one -> the ledger-held route here. Reject duplicate or malformed values without writes. Recover before dispatch or verification, preserving the consumed iteration and the before-image rather than bumping again.

For an on-disk `pending:` tuple, use the loop driver's return admission and interrupted recovery with the pre-dispatch ledger at the tuple SHA (home) or the saved home snapshot (companion). For `pending: verify`, use After the loop step 1's repair contract: require the exact retained tuple and consumed count, unchanged row cells and all other protected ledger state in the single home commit, or the matching companion return file with unchanged home HEAD. An unrelated commit or a repair that changed a row is rejected, never recorded as a verification repair.

With no `pending:`, read `returned:` from the committed home ledger. `none` leaves nothing to recover. A companion tuple is already settled: the home record commit proves admission; do not require its deleted return file or look up its SHA in home. A home tuple identifies the pre-dispatch SHA S. Read the ledger at S as the before-image. Find the commit introducing that tuple with `git -C <worktree> log -G'^returned: ' --format=%H <base>..HEAD -- <ledger path>`, comparing each candidate's ledger to its first parent's; use that introducing commit's ledger `iterations:` as the consumed count, never the live ledger's. Require matching target/home identity and count = before-image iterations +1; stop on an unavailable before-image or malformed attribution. Read no commit message. A tuple introduced by a parent repair is settled when that ledger diff appends its matching repair decision; never replay it as a child return. Classify settled evidence before comparing the live ledger to the original dispatch count: a later proven repair or approved ledger mutation may advance iterations while retaining the admitted tuple.

For an unsuperseded home child return, apply the driver's Validate the return checks to the entire S..HEAD range, allowing only the consumed iteration, tuple removal and `returned:` replacement as header deltas. Admit a clean single return once with no second count or attempt increment. Prove a later repair or approved ledger mutation from its ledger diff, not a subject. A saved clean post-admission snapshot also settles it: require child ancestor of saved HEAD, saved HEAD ancestor of live HEAD, unchanged ledger since that saved HEAD, and matching canonical task names/statuses as defined in `brief-contract.md`.

With later commits or dirt and no settled evidence, ask before tracker calls: `Was home return <sha> admitted before the later commits or dirty changes, or did the session stop before admission?` List S..HEAD and every dirty path. Disclose that `interrupted` discards them through `reset --hard <S>` and `clean -fd`. Keep bytes, counters and tasks unchanged until answered. Confirmed settled preserves the current ledger and requires fresh gates; confirmed interrupted runs the driver's interrupted recovery against S and its before-image without another bump; unknown stops without mutation. For an actual companion pending tuple, recompute the return file through `coordinated-legs.md` Resume and retain its unchanged-home and expected-dirt checks.

### Returns conversion

At step 4.2, after pending recovery and allowance migration reach a clean tuple-free tree, skip conversion when `returned:` already exists. Otherwise decode the legacy repair markers below, insert `returned: none` directly after `allowance:`, and append the decoded repair decisions in commit order. Preserve iterations, attempts, existing decisions and all other headers. Commit only the ledger using the shared Returns conversion on resume sentence before the single refresh. Keep row windows from reaching behind this conversion boundary. A second resume makes no conversion commit.

<!-- legacy-commit-labels:begin -->
### Legacy repair markers

Use this decoder only for a ledger without `returned:`. After legacy pending recovery, run the Conversion recipe below. It lists home commits since ledger base with `git -C <worktree> log --reverse --format='%H %s' <base>..HEAD`, validates each matching repair's committed iterations and reads its body, then writes the header and decisions together. Use the body's first line with pipes escaped, or `converted` when empty, and retain `converted <sha7>` as provenance. Keep all subject decoding inside this legacy converter.

#### Conversion recipe

Run from the supplied home worktree after step 4.2 reaches a clean, tuple-free allowance ledger. Set `ledger_path` to its repo-relative path and `conversion_subject` to the shared Returns conversion on resume sentence. Require Python 3; on an unavailable interpreter stop before writing. Use this recipe for the conversion commit, not a second hand-written edit or commit. Stop on a failed command and retain its error and working state.

<!-- ledger-conversion-shell -->
```bash
python3 - "$ledger_path" "$conversion_subject" <<'PY'
from pathlib import Path
import re
import subprocess
import sys

path, subject = sys.argv[1:]

def git(*args, **kwargs):
    return subprocess.check_output(["git", *args], text=True, **kwargs)

text = Path(path).read_bytes().decode("utf-8")
header_text = text.split("\n|", 1)[0]
if re.search(r"^returned:", header_text, re.M):
    sys.exit(0)
if git("status", "--porcelain"):
    sys.exit("returns conversion requires a clean tree")
if re.search(r"^pending:", header_text, re.M):
    sys.exit("finish pending recovery before returns conversion")

def field(snapshot, name, pattern):
    values = re.findall(r"^" + name + r": (.*)$", snapshot.split("\n|", 1)[0], re.M)
    if len(values) != 1 or not re.fullmatch(pattern, values[0]):
        sys.exit("cannot convert ledger: malformed " + name)
    return values[0]

base = field(text, "base", r"[0-9a-f]{40}")
allowance = field(text, "allowance", r"[1-9][0-9]*")
markers = {"loop: repair seed": "repair seed", "loop: repair verification": "repair verification"}
decisions = []
for line in git("log", "--reverse", "--format=%H %s", base + "..HEAD").splitlines():
    sha, old_subject = line.split(" ", 1)
    if old_subject not in markers:
        continue
    snapshot = git("show", sha + ":" + path)
    count = field(snapshot, "iterations", r"0|[1-9][0-9]*")
    if int(count) > 9007199254740991:
        sys.exit("cannot convert ledger: unsafe iterations at " + sha)
    body = git("show", "-s", "--format=%b", sha).splitlines()
    reason = (body[0] if body and body[0] else "converted").replace("|", r"\|")
    decisions.append(markers[old_subject] + " | " + reason + " | converted " + sha[:7])
if text.count("\n## Decisions\n") != 1:
    sys.exit("cannot convert ledger: missing or duplicate Decisions section")
converted = re.sub(r"^allowance: " + allowance + r"$", r"\g<0>\nreturned: none", text, count=1, flags=re.M)
if decisions:
    converted += ("" if converted.endswith("\n") else "\n") + "\n".join(decisions) + "\n"
Path(path).write_bytes(converted.encode("utf-8"))
git("add", "--", path)
git("commit", "-q", "-F", "-", "--", path, input=subject + "\n")
PY
```

### Legacy pending recovery

For this decoder, apply the driver's row/decision and boundary checks with legacy attribution below instead of `returned:` or a return file; allow only the consumed iteration and pending removal header deltas. Use the legacy companion body's attributed rows when the tuple names a companion. After the unchanged-home and one-clean-companion-commit boundary passes, set `CHECKOUT`, `PENDING`, `ITERATION` and `SAVED_LEDGER` as `coordinated-legs.md` Companion commit admission requires, then run this adapter:

<!-- legacy-companion-body-shell -->
```bash
RETURN_FILE=$(mktemp) || exit 1
git -C "$CHECKOUT" show -s --format=%b HEAD > "$RETURN_FILE" || exit 1
```

Pass this temporary path as the fifth argument (`"$RETURN_FILE"`) to that reference's `companion-return-shell` recipe. Apply its row/seed checks unchanged to the extracted body; never search for a new-format return file during legacy recovery. Remove the temporary file after the home record or validation-miss repair. Finish this recovery before Returns conversion; retain all ambiguous-history questions and before-image stops.

Recover before dispatch or verification on every ledger restore. Run the read-only admission-evidence check below before phase/task restoration on every ledger route, including briefs; resolve its human question before any tracker call. Apply recovery writes only at the ordered pending-recovery step. Read the durable `pending:` tuple (target row, seed or verify, repo, pre-dispatch HEAD); the parent's uncommitted iterations bump plus tuple is expected dispatch dirt, not a reason to skip recovery. Route `pending: verify` through the loop driver's After the loop step 1 repair admission/recovery before the row/seed paths below; preserve its reserved count and consumed iteration without a second marker or bump.

With no `pending:` on disk, inspect home commit history before any refresh. Find the latest home child row/seed commit that changed this ledger, even when unrelated commits follow it; read its subject and body with `git -C <worktree> log --format=%H -- <ledger path>` and `git -C <worktree> show -s --format=%B <sha>`. Exclude returns superseded by a parent admission/repair or approved ledger mutation proven by the evidence below; never replay those over the parent's current ledger.

Treat ordinary home admission as a refresh with no parent commit or ledger mutation. Prove a later parent repair or approved mutation from its actual ledger diff, not its subject alone. Use a saved post-admission snapshot only with its observed HEAD and clean `dirty` state: the brief's core fields plus task rows, or existing parent admission/refresh output bound to that checked HEAD. Require the child to be an ancestor of the saved HEAD, that HEAD to be an ancestor of live HEAD, and the ledger to be unchanged from the saved HEAD through live HEAD and the working tree. Match the snapshot's ledger task names/statuses to that HEAD's tuple-free ledger after stripping only the recognized ledger-description suffix or legacy ledger-label prefix defined in `brief-contract.md`; keep Gn and other names byte-identical. Ignore label differences in this comparison; the post-restore refresh recomputes descriptions and allowance labels from the current spec and ledger without duplicating tasks. Treat a matching snapshot as settled evidence and retain the current ledger without replaying the old dispatch. Terminal rows, a verify phase label or the child's attribution alone prove no admission.

For an unsuperseded home return, recover the commit body's first two lines as the exact `pending:` tuple and consumed `iteration:`. Require the tuple's home identity and target to match the spec and subject, its pre-dispatch SHA to be an ancestor of live HEAD, and its consumed count to equal the committed ledger's iterations and pre-dispatch ledger's iterations +1. Read the before-image at that SHA, not at `HEAD^`. On missing, malformed or mismatched attribution, or unavailable pre-dispatch bytes, stop before refresh, dispatch or verification; name the commit and failed check rather than inferring admission from terminal rows. With no home child return to recover, retain the existing ledger restore path.

Revalidate a clean, exactly-one-commit return through the home row below. For later commits or dirty changes, require settled evidence above or a parent return record/human confirmation that admission was still pending when those changes occurred. Without either, history alone cannot distinguish interruption from admitted work followed by verification changes. Start the message with `gauntlet: question` on its own line and ask: `Was home return <sha> admitted before the later commits or dirty changes, or did the session stop before admission?` Name the candidate and live HEAD. List the commits in `<pre-dispatch HEAD>..HEAD` and every dirty path before accepting an answer. State explicitly: answering `interrupted` discards those commits and dirty files through `reset --hard <pre-dispatch HEAD>` and `clean -fd`. Keep ledger bytes, counters and task list unchanged while awaiting the answer: no refresh and no target/tuple restoration.

| Confirmed admission state | Action |
|---|---|
| Confirmed settled | Preserve the current ledger and continue normal restore; require fresh verification/conformance, not historical gate credit. |
| Confirmed interrupted | Validate the entire `<pre-dispatch HEAD>..HEAD` range, never just `HEAD^..HEAD`, through the home row below. Use the recovered tuple and before-image without another bump. Apply the driver's unconditional interrupted recovery to a rejected boundary, including later writes; write the failed attempt from the saved ledger with iterations at the recovered consumed count, refresh and return to the ordered table. Use the disclosed `interrupted` answer as authorization for that recovery. |
| Still unknown | Stop without mutation; ask for the missing admission evidence, never turn uncertainty into a discard/reset decision. |

| Tuple target | Recovery |
|---|---|
| Home leg or single-member `home` | Reconstruct the pre-dispatch ledger from `HEAD:<ledger path>` when HEAD is the tuple SHA, otherwise from `<pre-dispatch HEAD>:<ledger path>`. Compare live HEAD with that SHA. Admit exactly one new home commit with subject `loop: row <n> <status>` or `loop: seed evidence` only through the driver's `## Validate the return`: require a clean tree and the bounded row/decision result, allowing only the consumed iteration and pending removal header deltas, with no second iteration bump or repeated attempt increment. Clear the tuple through the admitted close or ordinary-miss repair. Route zero new commits, multiple commits, dirty or non-DONE returns through the driver's `## Interrupted recovery` against the tuple HEAD and its ledger before-image. Use the driver's job checks and reset/clean procedure without a provenance or process-exit gate; write the repair with the already-consumed iteration, clear pending and continue at Before each dispatch. Route reset/repair-write failures through the driver's counted failure pass, never dispatching from the wrong HEAD. With a recoverable tuple and before-image, route wrong attribution through the driver's `## Interrupted recovery` without a human turn. Stop only for an unrecoverable tuple or before-image, without redispatch or double counting. |
| Actual multi-member companion | Apply `/skill:loop-implementation` `reference/coordinated-legs.md` `## Resume`: require unchanged home HEAD and exactly one new companion commit with tuple attribution, then validate its result. Record that leg's admitted rows, decisions or seeded state and SHA, removing the tuple in the home-ledger commit; never rerun the recovered row or its admitted extras. Route dirty, zero/multiple-commit or non-DONE boundaries through that reference's unconditional interrupted recovery, using the companion tuple HEAD and saved home ledger; reset the companion to the tuple HEAD and home to the saved home HEAD; commit the repair only in home. With a recoverable tuple and before-image, route wrong attribution, unexpected home dirt and home movement through that same interrupted recovery. Preserve state only on an unrecoverable tuple or before-image; route post-boundary result-validation misses through ordinary `loop: repair row <n>` or seed `loop: repair seed` repair in that protocol, clear `pending:` and preserve the consumed iteration. |

<!-- legacy-commit-labels:end -->

## Spec with plan

Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../brainstorming/reference/menu-layout.md).

Show, and ask the human to confirm or edit both in one reply:

1. Per task, in plan order: the commits after the plan commit that touch any path in
   the task's declared `Files:` block, taking the union of the block in the working
   copy and in `git -C <worktree> show <plan-commit>:<plan path relative to the worktree>`
   (an object path inside the repository, never the absolute `planPath`; a `Modify:` row
   dropped by `brief-contract.md` "Plan repair" still yields its `complete` evidence).
   Strip a trailing `:digits[-digits]` range from
   each `Modify:` path before matching `git -C <worktree> log -- <path>`:
   `git -C <worktree> log --format=%h --oneline <plan-commit>..HEAD -- <path>`.
   Uncommitted plan (no
   plan commit): skip this query entirely - there is no range to search - and show
   "plan uncommitted; no task evidence" in its place; every task is proposed `pending`.
   For a plan tracked at the `Rework base:` with no post-base add commit, use that base as the plan commit and query post-base task evidence as above. Otherwise, when the lookup is empty but `git -C <worktree> cat-file -e <base>:<plan>` exits 0, skip the log query, show
   `plan predates base; no post-base task evidence`, every task proposed `pending`.
2. Uncommitted files: `git -C <worktree> status --porcelain`.
3. Proposed task statuses: `complete` iff at least one matching commit, else `pending`.
4. Proposed stage: `implement` if any task is `pending`, else `verify`.

Validate the confirmed snapshot before any tracker call:

- pending-suffix order - every `pending` task trails every non-pending one;
- all tasks complete/skipped with stage `implement` is infeasible (implement would
  auto-complete on `init`).

Reject an infeasible edit by citing the offending rows and re-asking. Confirmation
edits override proposals; never rewrite confirmed state silently.

After confirmation:

1. Run SKILL.md entry check 6 on `<spec path>` (a malformed `**Amend-grant:**` line stops here, no tracker call); then `start brainstorm`; `skip brainstorm resume: <spec path>`; `start plan`.
2. `plan_check` with `planPath` = the plan's absolute path. FAIL -> run `brief-contract.md`
   `## Plan repair`; its PASS continues at step 3, its stop ends the restore with plan
   in_progress, no `init`.
3. PASS -> `skip plan` with the same `resume:` reason; for stage verify also
   `skip implement`; `start <stage>`.
4. `init` the confirmed non-empty task list as `{name, status}` elements.
5. `phase_tracker status` and `plan_tracker status` must match the confirmed active
   stage and task list exactly; a mismatch is reported verbatim, not patched.

End with the standard line from `brief-contract.md`. `<task>` follows the same rule as
there: there is no brief `Active task` on this route, so it is the first confirmed
`in_progress` task, else `none` (whole-deliverable re-validation).
