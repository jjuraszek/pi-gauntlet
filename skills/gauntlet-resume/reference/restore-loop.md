# Ledger restore (gauntlet-resume supplementary)

Read for a brief with a `Ledger:` field and for a worktree whose spec pairs with a ledger, after `reconstruction.md`, which defines `<base>`.

## Ledger admission

Run when the ledger is first read, before the confirmation question and any tracker write. For a ship-stage brief with a `legs:` block whose `Ledger:` file is absent, take `coordinated.md` "Coordinated admission"'s receipt-validated retry instead of the checks below.

Check in this order; the first miss stops. Start the message with `gauntlet: stuck` followed by its sentence:

1. The ledger file is absent: `ledger not found: <path>`
2. Line 1 is not `# Ledger - loop engine`, or `**Spec:**` is missing or not path-only: `ledger header malformed: <observed header lines>`
3. A `cap:` line is present, with or without `allowance:`: `ledger carries a cap: line - unsupported ledger format; finish this run on the pi-gauntlet release that wrote it`
4. No `allowance:` line: `ledger has no allowance: line - unsupported ledger format; finish this run on the pi-gauntlet release that wrote it`
5. No `returned:` line: `ledger has no returned: line - unsupported ledger format; finish this run on the pi-gauntlet release that wrote it`
6. A duplicate `allowance:` or `returned:`, or an `allowance:` value that is not a positive safe integer: `ledger header malformed: <observed header lines>`

After the sentence of check 3, 4 or 5, print one more line: `recovery: doc/configuration.md "Loop engine operations"`.

Pair by the path-only `**Spec:**` header as `reconstruction.md` "Candidates" does, never by basename; for a brief, also require the ledger under the spec directory's sibling plans directory.

## Spec with ledger

`R = resume: <brief file or "pasted brief">`.

Worktree input, after admission. Start the message with exactly `gauntlet: question` on its own line, with no suffix. Apply [menu-layout](../../gauntlet/menu-layout.md). Show the spec and ledger paths, current rows, iterations, last decision, and `git -C <worktree> status --porcelain`. Ask the human to confirm the approved spec and continuation; carry brief Intent/Decisions when present. For a ledger brief keep same-repository binding and human confirmation.

Then, stating the entire ordered sequence explicitly even when entry checks are already reported as passed:

1. Run SKILL.md entry checks 1-6 in order on the resolved spec, naming check 6 (**Grant field**), before any tracker mutation. Classify `## Pending recovery`'s settled evidence read-only and resolve its question before any tracker call.
2. `start brainstorm`; `skip brainstorm` with reason `resume: <spec path>`; `start plan`.
3. `plan_check({ planPath: <absolute ledger path> })`. On FAIL stop with the findings and keep plan in_progress. Start the message with `gauntlet: stuck` followed by the findings reason on that line. Never send a ledger task list through task-plan repair or writing-plans. On PASS `skip plan` with reason `resume: <spec> (loop engine)`, using the resolved absolute spec path as `<spec>`.
4. Restore the phase:
   - implement brief or worktree: `start implement`. Restore tasks through refresh, never `init`.
   - verify or ship brief: `skip implement R`; `start verify`; `substep` if shown; then `plan_tracker init` with the full saved task list under SKILL.md "Restore rules": ledger rows by canonical name per "Ledger task names" below, order and mixed statuses unchanged. `No plan active.` -> no `init`. Never call `start implement` on this route or invent completed Gn tasks. Ship stops at verify for fresh conformance.
5. **Restore boundary.** Read `/skill:loop-implementation`. Skip Entry step 1's allowance seeding; restore base, verification, iterations, row attempts and decisions from the ledger without reseeding. Resolve `gauntlet_setting({ key: "loopEngine" })` exactly once at the driver's authorized-restore grant boundary and retain `escalateAfter` in driver memory for this run; never refresh it inside the loop. On an unavailable tool, stop before any dispatch or write with `cannot resolve escalation threshold: settings tool unavailable (loopEngine.escalateAfter)`.
6. Apply `## Pending recovery` before refresh, including home returns whose child commit removed the tuple. Validate the original one-commit `<pre-dispatch HEAD>..HEAD` range against its unchanged before-image. For companions, retain unchanged home HEAD and admit the expected iterations-bump-plus-tuple dirt. With a recoverable on-disk tuple and before-image, treat wrong attribution, unexpected home dirt and home movement as interrupted boundaries; reset the selected companion and home through common recovery before the home-only repair. Stop before refresh only when the tuple or before-image is unrecoverable. For an interrupted return with a recovered pending tuple and before-image, apply the driver's [## Interrupted recovery](../../gauntlet/implement/loop/interrupted-recovery.md) without a human turn: preserve the already-consumed iteration, count the failed attempt once, and return to the ordered table after repair; check allowance only there.
7. Call `plan_tracker({ action: "refresh", path: <absolute ledger path> })` exactly once for the restore, after phase restoration and recovery, before any unresolved dirty-tree stop or dispatch. Refresh replaces only ledger entries and preserves every non-ledger name and status. On refresh failure, stop with its findings and leave the existing task list untouched. Read `plan_tracker status` and report its exact observed state, never an inferred list.
8. Render the allowance header, rows, iterations, attempts, effective allowances and all decisions from disk; distinguish the latest operational `row <n> ...` decision from the last physical history line. Compute each effective allowance as the header plus one per matching retry decision; ignore the retry's audit ceiling. Print SKILL.md's closing line.
9. Continue in `/skill:loop-implementation`, which owns execution; resume runs no gate itself.
   - implement: loop step 5, the driver's `Before each dispatch`, with durable iterations and retry data. An all-closed ledger completes implement through refresh and takes `After the loop` step 0. An unresolved row at or above its effective allowance stops under rule 2 without an attempt; keep an allowance-stopped row `failed`. Only at a missing-history stop, render a row whose `pending:` tuple stays on disk as `row <n> in_progress (pending tuple restored)`. Never reset counters or reseed a validated seed.
   - verify or ship: read `After the loop` and its references and continue from `After the loop` step 1, the gate set per the loop skill's `## Gate set`, retaining whole-diff code review, happy path when triggered, fresh home conformance review and finishing; never synthesize Gn completion.

### Ledger task names

Match the suffix pattern `^(row \d+(?: \(\S+\))?) \| .+$` against a ledger task row's text after `[i] ` and restore only capture 1. Treat everything after the first canonical name's ` | ` as display text, including pipes and row-like text; never derive identity from the description. For example, `row 3 | 2/5: Verify loop behavior and recovery` restores `row 3`. Strip the suffix before verify/ship `plan_tracker init` and snapshot name comparisons. Keep Gn and every other task name byte-identical, including numeric prefixes. Never restore labels from a brief: the post-restore refresh recomputes descriptions and allowance from the current spec and ledger, so a changed description or denominator is not drift or a second task.

## Pending recovery

Recover before dispatch or verification on every ledger restore, verify and ship included, preserving the consumed iteration and the before-image rather than bumping again. Use the home return contract for a home tuple and the companion protocol only for an actual multi-member companion; record a validated interrupted return before continuing.

For an on-disk `pending:` tuple, use the loop driver's return admission and interrupted recovery with the pre-dispatch ledger at the tuple SHA (home) or the saved home snapshot (companion). For `pending: verify`, use After the loop step 1's repair contract: require the exact retained tuple and consumed count, unchanged row cells and all other protected ledger state in the single home commit, or the matching companion return file with unchanged home HEAD. An unrelated commit or a repair that changed a row is rejected, never recorded as a verification repair.

With no `pending:`, read `returned:` from the committed home ledger. `none` leaves nothing to recover. A companion tuple is already settled: the home record commit proves admission; do not require its deleted return file or look up its SHA in home. A home tuple identifies the pre-dispatch SHA S. Read the ledger at S as the before-image. Find the commit introducing that tuple with `git -C <worktree> log -G'^returned: ' --format=%H <base>..HEAD -- <ledger path>`, comparing each candidate's ledger to its first parent's; use that introducing commit's ledger `iterations:` as the consumed count, never the live ledger's. Require matching target/home identity and count = before-image iterations +1; stop on an unavailable before-image or malformed attribution. Read no commit message. A tuple introduced by a parent repair is settled when that ledger diff appends its matching repair decision; never replay it as a child return. Classify settled evidence before comparing the live ledger to the original dispatch count: a later proven repair or approved ledger mutation may advance iterations while retaining the admitted tuple.

For an unsuperseded home child return, apply the driver's Validate the return checks to the entire S..HEAD range, allowing only the consumed iteration, tuple removal and `returned:` replacement as header deltas. Admit a clean single return once with no second count or attempt increment. Prove a later repair or approved ledger mutation from its ledger diff, not a subject. A saved clean post-admission snapshot also settles it: require child ancestor of saved HEAD, saved HEAD ancestor of live HEAD, unchanged ledger since that saved HEAD, and matching canonical task names/statuses as defined in "Ledger task names".

With later commits or dirt and no settled evidence, ask before tracker calls: `Was home return <sha> admitted before the later commits or dirty changes, or did the session stop before admission?` List S..HEAD and every dirty path. Disclose that `interrupted` discards them through `reset --hard <S>` and `clean -fd`. Keep bytes, counters and tasks unchanged until answered. Confirmed settled preserves the current ledger and requires fresh gates; confirmed interrupted runs the driver's interrupted recovery against S and its before-image without another bump; unknown stops without mutation. On `interrupted`, first validate the entire `<pre-dispatch HEAD>..HEAD` range, never just its last commit. For an actual companion pending tuple, recompute the return file through `coordinated-legs.md` Resume and retain its unchanged-home and expected-dirt checks.
