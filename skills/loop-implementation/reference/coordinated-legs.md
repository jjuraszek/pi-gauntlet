Read this reference with the loop driver when its held membership has more than one leg.

## Entry

At seed, read `## Legs` with [the scope grammar](../../brainstorming/reference/legs.md#scope-grammar-and-validation) before skeleton commit. Require exactly one `scope:` per block: `scope: AC 1, AC 3` or `scope: none`. Reject missing/duplicate scope lines, duplicate indices within a list, malformed tokens and out-of-range original indices through the amendment stop. Include cut original AC indices; never infer ownership from a `design:` mention or path. Default only indices absent from every valid list to home; repeat shared indices in every owner's list.

Retain the home skeleton's `**Spec:**`, `verification:`, `checks: commands`, `iterations:`, `allowance:` and `## Decisions` fields and its `plan_check`/commit admission. Use the driver's gate set grouped by `## Leg mapping` for verification; keep the home verification header as the CI command.

For coordinated exit, apply the driver's `## Gate set` and `## After the loop` step 1 in verify, routing each pair through its mapped checkout. Keep `loop: repair verification` once per flow, not per failing leg. Success only after every leg passes; retain each verified HEAD and clean status.

Assign numeric entries in original AC order, then membership order for shared ACs, independent of scope-list order. Leave spec rows untouched and copy each cut disposition to every expanded entry. Keep the four-column table and add `## Leg mapping` with `row | ac | leg`, one mapping per entry exactly once. Reject duplicate/missing mappings. Keep `base:` as home base; record one actual `base repo-a: <sha>` / `seeded repo-a: no` pair per member, including home. Resolve bases with each member's `git -C`, not home HEAD.

Use the same allowance seed value as the home driver's Entry step 1; never multiply by entry or leg count or add seed dispatches. One shared home/companion AC and one home-only AC produce three entries, two seeds and allowance 4 at default 4; a wholly cut third leg adds no seed. All-cut ledgers exit without seed and retain that allowance. Preserve allowance after cuts, reopens, requirement-preserving amendments and recovery.

## Resume

Use the held membership and checkout paths captured by the driver's Entry at seed or authorized restore. Recover pending companion work before generic dirty checks and before any new dispatch. Read the durable home ledger's `pending:` tuple and consumed iteration, selected companion HEAD and saved pre-dispatch state. Reconstruct the pre-dispatch ledger from home `HEAD:<ledger path>` on resume and admit only the expected on-disk iterations bump and tuple against it. Admit only the known iterations bump and exact pending tuple as pre-dispatch dirt; stop on other dirt. Reapply companion return validation below only when exactly one new commit after the recorded HEAD matches attribution and result. Apply the home-ledger commit without another attempt or iteration bump, clear pending and retain prior decisions. Stop preserving state on zero commits, unrelated movement, multiple commits or attribution/result mismatch. Never rerun that row or seed. After a successful parent commit no pending tuple remains, so a subsequent resume cannot duplicate the update.

## Targeting and dispatch

For coordinated targeting, select the next unseeded leg with non-cut entries in membership order before ordinary targeting. Use the existing retry/failed/open priority only after those seeds validate. Skip wholly cut legs; never mark foreign legs seeded. Map each numeric target to its original AC and leg via `## Leg mapping`.

For coordinated dispatch, capture home and selected leg heads and save a pre-dispatch ledger snapshot before the iterations bump and tuple write for the expected-dirt comparison. Select the leg worktree as `cwd` and git root, its own base, mapped original AC, `Leg:` and combined spec/task `Rules:` as additive task inputs. Pass absolute home spec and ledger paths for the child to read; the driver reads only the ledger. Read the current `iterations:` count as i. Before every dispatch, home or companion including seed, persist the exact tuple such as `pending: 2 | repo-b | abc1234` (or `pending: seed | repo-b | abc1234`) with actual target, member repo and pre-dispatch HEAD in the home ledger. Keep that expected bump/tuple durable on disk before generic dirty checks; admit no other dirt. After persisting the bump and pending tuple, bind `SAVED_LEDGER` to the durable home ledger for companion admission, not the pre-dispatch snapshot. Send `iteration: i` as the saved pre-bump dispatch index (for i = 2, send `iteration: 2`), not the consumed count; write `iterations: i + 1` before dispatch; admission requires the child commit body to carry `i + 1`, read from the bumped ledger header. State that difference when rendering a dispatch or admission: the task line carries the pre-bump count by design, the body line and `ITERATION` carry the consumed count `i + 1`, and the two never compare to each other. Pass the exact `pending:` as attribution. Leave home iterations on the existing single child commit path, validating only home entries and home seeded state, with tuple removal in the admitted home commit. Apply the driver's pre-dispatch refresh after the durable write.

## Companion return validation

For a companion, validate from its commit, not the reply. Require a clean companion and exactly one commit after pending HEAD; require unchanged home HEAD and no home edits except the expected persisted bump/tuple. Match subject `loop: row <n> <status>` or `loop: seed evidence`, exact pending tuple and consumed `iteration:` in the body. Parse only the resulting four-column target row (all and only that leg's non-cut rows for seed), followed by one bounded decision. Apply the evidence and decision bounds in the driver's `## Validate the return` table. Reject a wrong target, foreign entry, header changes, fabricated counts, malformed evidence or extra results. Validate seed counts against actual rows and baseline closures; preserve attempts and set only this leg's seeded value to `yes` after every non-cut entry validates. Keep seed misses a human stop. Apply ordinary repair only to the target, retaining consumed iterations and saved cap.

After validation update only that leg's target or seed entries, append the validated decision, record companion SHA in evidence, and remove `pending:` in one home-ledger commit. Preserve every other row, header and prior decision. That home-ledger commit (`loop: record <repo> row <n>`) is a parent commit, not a child `loop: row ...` commit: it never counts toward child-only empty-commit stagnation; only the companion's own commits are counted at the boundary. Record a rejected companion return in the same parent commit while preserving the pending tuple and every row. Recover interrupted returns by this same validation, never trusted reply text.

For coordinated home returns apply it only to home entries/seeded state, preserving foreign entries, mappings and bases.

### Companion commit admission

Require the unchanged home HEAD and expected-only home dirt boundary above, then run this read-only admission recipe on both immediate returns and pending recovery. Set `CHECKOUT` to the companion root, `PENDING` to the exact persisted tuple including `pending:`, `ITERATION` to the consumed count and `SAVED_LEDGER` to the durable home ledger after the iterations bump and pending write, including on recovery. Use the pre-dispatch snapshot only for the expected-dirt comparison. On failure preserve pending and stop. On success use the emitted object for the single parent ledger commit described above; never treat it as permission for another dispatch.

<!-- companion-return-shell -->
```bash
node - "$CHECKOUT" "$PENDING" "$ITERATION" "$SAVED_LEDGER" <<'NODE'
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const [root, pending, iteration, savedPath] = process.argv.slice(2);
const requireThat = (ok, why) => { if (!ok) throw new Error(why); };
const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
const tuple = /^pending: (seed|\d+) \| (\S+) \| ([a-f0-9]{7,40})$/.exec(pending);
requireThat(tuple, 'invalid pending');
const saved = fs.readFileSync(savedPath, 'utf8');
requireThat(saved.split('\n').filter(line => line.startsWith('pending:')).length === 1 && saved.split('\n').includes(pending) && saved.split('\n').includes(`iterations: ${iteration}`), 'pending already applied or iteration mismatch');
const [, target, leg, before] = tuple;
requireThat(git('status', '--porcelain') === '', 'dirty companion');
requireThat(git('merge-base', '--is-ancestor', before, 'HEAD') === '', 'unrelated HEAD');
requireThat(git('rev-list', '--count', `${before}..HEAD`) === '1', 'expected one companion commit');
const commit = git('rev-parse', 'HEAD');
const message = git('show', '-s', '--format=%B', 'HEAD').split('\n');
const subject = message.shift();
requireThat(message.shift() === '', 'missing body separator');
requireThat(message.shift() === pending, 'pending mismatch');
requireThat(message.shift() === `iteration: ${iteration}`, 'iteration mismatch');
const resultLines = message.filter(line => line.trim() !== '');
const cells = line => line.split(/(?<!\\)\|/).slice(1, -1).map(s => s.trim());
const table = text => text.split('\n').filter(line => /^\|\s*\d+\s*\|/.test(line)).map(cells);
const [ledger, mapping] = saved.split('## Leg mapping\n');
requireThat(mapping, 'missing mapping');
const map = table(mapping.split('## Decisions')[0]);
const oldRows = table(ledger);
requireThat(new Set(map.map(r => r[0])).size === map.length && map.length === oldRows.length && oldRows.every(r => map.some(m => m[0] === r[0])), 'invalid mapping');
const expected = oldRows.filter(r => map.some(m => m[0] === r[0] && m[2] === leg) && (target === 'seed' ? r[1] !== 'cut' : r[0] === target));
requireThat(expected.length && expected.every(r => r[1] !== 'cut'), 'foreign or cut target');
const decision = resultLines.pop();
const rows = resultLines.map(cells);
requireThat(rows.length === expected.length && resultLines.every(l => l.startsWith('|') && l.endsWith('|')), 'extra result');
for (const [i, row] of rows.entries()) {
  const old = expected[i];
  requireThat(row.length === 4 && row[0] === old[0], 'foreign row');
  requireThat((target === 'seed' ? /^(open|done)$/ : /^(done|failed)$/).test(row[1]), 'invalid status');
  requireThat(/^\d+$/.test(row[2]) && Number(row[2]) === Number(old[2]) + (target === 'seed' ? 0 : 1), 'attempt mismatch');
  requireThat(row[3].length > 0 && row[3].split(';').length <= 4 && !/[<>]/.test(row[3]), 'unbounded evidence');
  requireThat(target !== 'seed' || old[1] !== 'done' || row[1] === 'done', 'lost baseline closure');
}
if (target === 'seed') {
  requireThat(subject === 'loop: seed evidence', 'seed subject mismatch');
  const d = /^row 0 done \| seeded (\d+) rows, closed (\d+) on baseline \| .{1,200}$/.exec(decision);
  requireThat(d && Number(d[1]) === expected.length && Number(d[2]) === rows.filter(r => r[1] === 'done').length, 'seed counts mismatch');
} else {
  requireThat(subject === `loop: row ${target} ${rows[0][1]}`, 'row subject mismatch');
  requireThat(new RegExp(`^row ${target} ${rows[0][1]} \\| .{1,200} \\| .{1,200}$`).test(decision), 'invalid decision');
}
console.log(JSON.stringify({ sha: commit, rows: resultLines, decision }));
NODE
```

## Amendments

For coordinated amendments, reconcile by original AC/leg mapping without resetting attempts, iterations or cap. Re-read explicit scope lists after approved ownership amendments and reconcile expanded entries; a disposition-only cut changes neither original indices nor ownership. Preserve unchanged mapped entries and their histories.
