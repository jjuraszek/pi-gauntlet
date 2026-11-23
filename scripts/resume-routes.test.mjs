import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const resume = 'skills/gauntlet-resume';
const handoffPath = 'skills/gauntlet-handoff/SKILL.md';
const names = ['SKILL.md', ...readdirSync(join(root, resume, 'reference')).map(name => `reference/${name}`)];
const file = Object.fromEntries(names.map(name => [name.replace('reference/', ''), read(`${resume}/${name}`)]));
const skill = file['SKILL.md'];
const handoff = read(handoffPath);
const bytes = (...texts) => texts.reduce((sum, text) => sum + Buffer.byteLength(text), 0);
const section = (text, heading) => {
  const start = text.indexOf(`\n${heading}\n`);
  assert.ok(start >= 0, heading);
  const level = heading.match(/^#+/)[0].length;
  const rest = text.slice(start + heading.length + 2);
  const next = rest.search(new RegExp(`^#{1,${level}} `, 'm'));
  return next < 0 ? rest : rest.slice(0, next);
};
const ordered = (text, tokens) => tokens.reduce((from, token) => {
  const at = text.indexOf(token, from);
  assert.ok(at >= 0, `missing or out of order: ${token}`);
  return at + token.length;
}, 0);

test('route read sets stay within their byte ceilings', () => {
  const shared = [skill, file['brief-contract.md'], file['reconstruction.md']];
  assert.ok(bytes(...shared, file['restore-loop.md']) <= 42000, `loop route ${bytes(...shared, file['restore-loop.md'])}`);
  assert.ok(bytes(...shared, file['restore-plan.md']) <= 37000, `plan route ${bytes(...shared, file['restore-plan.md'])}`);
  assert.ok(bytes(handoff, file['brief-contract.md']) <= 17000, `handoff ${bytes(handoff, file['brief-contract.md'])}`);
  assert.deepEqual(Object.keys(file).sort(), ['SKILL.md', 'brief-contract.md', 'coordinated.md', 'plan-repair.md', 'reconstruction.md', 'restore-loop.md', 'restore-plan.md', 'seed.md']);
});

test('the idle-session check treats the status locator as observational', () => {
  const idle = section(skill, '## Entry checks').split('2. **')[0];
  ordered(idle, ['action: "status"', 'Read no phase file from status', 'Any phase not pending', 'stop: "session already carries flow state']);
});

test('only the current formats remain', () => {
  for (const [name, text] of [...Object.entries(file), [handoffPath, handoff]]) {
    assert.doesNotMatch(text, /legacy|migrat|conversion/i, name);
    assert.doesNotMatch(text, /^#{3,4} (?:Returns conversion|Legacy repair markers|Conversion recipe|Legacy pending recovery)$/m, name);
    assert.doesNotMatch(text, /7\.1\.0/, name);
  }
  assert.doesNotMatch(handoff, /double section|already has a line matching/);
});

test('a single-repo route reads no coordinated rule', () => {
  for (const [name, text] of [...Object.entries(file), [handoffPath, handoff]]) {
    if (name === 'coordinated.md') continue;
    for (const line of text.split('\n').filter(line => line.includes('coordinated.md'))) {
      assert.match(line, /`legs:` block|more than one member|For a coordinated brief/i, `${name}: ${line}`);
    }
    assert.doesNotMatch(text, /^## Coordinated/m, name);
    assert.doesNotMatch(text, /home is <repo>; restart there|\*\*Home:\*\*` tuple|per leg\b/, name);
  }
  const checks = section(skill, '## Entry checks');
  assert.match(checks, /\*\*Membership test\.\*\* A brief that carries a `legs:` block is multi-repo: `Read` `reference\/coordinated\.md` in full before check 3[\s\S]*before any tracker write\. Without that block, read nothing from\s+that file\./);
  assert.doesNotMatch(checks, /^3b\./m);
  ordered(checks, ['3. **Same-repository binding.**', '--git-common-dir', 'belongs to a\n   different repository', '4. **Drift notice.**', '`HEAD` and `dirty`', 'Informational, never a stop.']);
  for (const token of ['## Coordinated brief grammar', '## Coordinated admission', '**Check 3b. Coordinated admission.**', 'home is <repo>; restart there', 'name the missing, extra or reordered leg and both lists on mismatch', 'Stop naming the offending leg and expected/observed path, branch or full tuple', 'An absent plan without this fully validated ship retry remains a stop', 'for a ledger subject, recover gate pairs from the committed pre-strip ledger', 'Single-member briefs carry no coordinated block']) {
    assert.ok(file['coordinated.md'].includes(token), token);
  }
});

test('the engine test selects one restore reference per input', () => {
  const dispatch = section(skill, '## Dispatch');
  const row = start => dispatch.split('\n').find(line => line.startsWith(`| ${start}`));
  const ledgerBrief = row('brief with `## Process state` and a `Ledger:` field');
  const planBrief = row('brief with `## Process state` and no `Ledger:` field, at any stage');
  assert.match(ledgerBrief, /`reference\/reconstruction\.md`, then `reference\/restore-loop\.md`/);
  assert.ok(!ledgerBrief.includes('restore-plan.md'));
  assert.match(planBrief, /`reference\/reconstruction\.md`, then `reference\/restore-plan\.md`/);
  assert.ok(!planBrief.includes('restore-loop.md'));
  const engine = dispatch.split('**Engine test.**')[1].split('**Hotfix route.**')[0].replace(/\s+/g, ' ');
  ordered(engine, ['one spec with a ledger', 'takes precedence over a task plan) -> `reference/restore-loop.md`', 'one spec with a task plan only, or seed step 8 finding a plan beside the pinned spec -> `reference/restore-plan.md` "Spec with plan"', 'no spec, more than one spec, or one spec without a plan -> no restore reference']);
  assert.equal(engine.split('restore-plan.md').length, 2);
  const candidates = section(file['reconstruction.md'], '## Candidates');
  for (const start of ['| no spec | stop;', '| more than one spec | the human picks one', '| one spec, no plan | "Spec without plan" |', '| one spec with ledger | `restore-loop.md` (takes precedence over a task plan) |', '| one spec with task plan only | `restore-plan.md` "Spec with plan" |']) {
    assert.ok(candidates.includes(start), start);
  }
  assert.match(candidates, /For a coordinated brief, use `coordinated\.md` "Coordinated admission" before tracker writes/);
  const noPlan = section(file['reconstruction.md'], '## Spec without plan');
  ordered(noPlan, ['Ask exactly one question: is this spec approved', '- Approved:', '  - `loop`:', '  - `waves` or absent:', '- Selected unapproved-draft brainstorming handoff:']);
  for (const [branch, engine] of [['`loop`', 'loop'], ['`waves` or absent', 'waves']]) {
    const skip = noPlan.split('\n').find(line => line.startsWith(`  - ${branch}:`));
    ordered(skip, ['start brainstorm', 'skip brainstorm resume: <spec path>', `engine: "${engine}"`]);
  }
  assert.match(file['seed.md'], /8\. \*\*Continue\*\* with the spec pinned at `<full-path>\/<rel>`, skipping `reconstruction\.md`\s+"Candidates": `<full-path>\/<sibling plans dir>\/<basename of rel>` exists ->\s+`restore-plan\.md` "Spec with plan"; otherwise `reconstruction\.md` "Spec without plan"\./);
});

test('spec seed refuses remote terminal records when no local record exists', t => {
  const seed = file['seed.md'];
  assert.match(section(skill, '## Dispatch'), /^\| spec seed \| `reference\/seed\.md` \|$/m);
  ordered(seed, ['every stop names the path', '3. **Not shipped.**', '5. **Reuse or create.**', '8. **Continue**']);
  const guard = seed.match(/^3\. \*\*Not shipped\.\*\* (.+)$/m)?.[1];
  assert.ok(guard, 'seed admission step');
  const lookup = guard.match(/read `<git common dir>\/([^`]+)`.*When the local record is absent, fetch `([^`]+)` from `telemetry\.remote` \(default `([^`]+)`\) and read `([^`]+)` from the fetched ref.*A valued `(\w+):` or `(\w+):` stops: `([^`]+)`/);
  assert.ok(lookup, 'local-miss lookup must read the fetched record and stop on terminal timestamps');
  const [, localPath, ref, remote, remotePath, firstField, secondField, message] = lookup;
  const terminalField = new RegExp(`^(?:${firstField}|${secondField}): (.+)$`, 'm');
  const rows = [
    ['shipped', 'shipped_at', '2026-01-05T12:00:00Z'],
    ['abandoned', 'abandoned_at', '2026-01-06T13:00:00Z'],
  ];
  const dir = mkdtempSync(join(tmpdir(), 'resume-seed-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const git = (cwd, args, input) => execFileSync('git', args, {
    cwd, input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 5000,
  }).trim();
  const origin = join(dir, 'origin.git');
  git(dir, ['init', '--bare', origin]);
  git(dir, ['init']);
  git(dir, ['remote', 'add', 'origin', origin]);
  const tree = git(origin, ['mktree'], rows.map(([name, field, ts]) => {
    const blob = git(origin, ['hash-object', '-w', '--stdin'], `${field}: ${ts}\n`);
    return `100644 blob ${blob}\t${name}.yaml\n`;
  }).join(''));
  const records = ['specs', 'gauntlet', 'widget', 'acme'].reduce((child, name) =>
    git(origin, ['mktree'], `040000 tree ${child}\t${name}\n`), tree);
  git(origin, ['update-ref', 'refs/telemetry/records', records]);

  const expand = (path, name) => path.replace('<owner>/<repo>', 'acme/widget')
    .replace('<rel with .md -> .yaml>', `specs/${name}.yaml`);
  const commonDir = git(dir, ['rev-parse', '--path-format=absolute', '--git-common-dir']);
  for (const [name] of rows) {
    assert.equal(existsSync(join(commonDir, expand(localPath, name))), false, `${name}: local record`);
  }
  git(dir, ['fetch', remote, ref]);
  for (const [name, field, ts] of rows) {
    const record = git(dir, ['show', `FETCH_HEAD:${expand(remotePath, name)}`]);
    const terminal = record.match(terminalField);
    assert.ok(terminal, `${name}: ${field} must trigger the seed stop`);
    assert.equal(message.replace('<ts>', terminal[1]), `spec already shipped at ${ts} - write a superseding spec`, name);
  }
});

test('PR identity stops precede every restore reference', () => {
  const pairs = section(file['reconstruction.md'], '## PR pairs');
  ordered(pairs, ['Before any tracker write', 'brief names PR #N on <headRefName>, worktree is on <branch>', 'brief lists <brief order>, record lists <record order>', 'before any tracker call']);
});

test('ledger admission accepts only the current ledger format', () => {
  const loop = file['restore-loop.md'];
  const admission = section(loop, '## Ledger admission');
  const unsupported = ' - unsupported ledger format; finish this run on the pi-gauntlet release that wrote it`';
  ordered(admission, [
    'before the confirmation question and any tracker write',
    'ship-stage brief with a `legs:` block whose `Ledger:` file is absent, take `coordinated.md` "Coordinated admission"\'s receipt-validated retry',
    'Start the message with `gauntlet: stuck`',
    '1. The ledger file is absent: `ledger not found: <path>`',
    '2. Line 1 is not `# Ledger - loop engine`, or `**Spec:**` is missing or not path-only: `ledger header malformed: <observed header lines>`',
    `3. A \`cap:\` line is present, with or without \`allowance:\`: \`ledger carries a cap: line${unsupported}`,
    `4. No \`allowance:\` line: \`ledger has no allowance: line${unsupported}`,
    `5. No \`returned:\` line: \`ledger has no returned: line${unsupported}`,
    '6. A duplicate `allowance:` or `returned:`, or an `allowance:` value that is not a positive safe integer: `ledger header malformed: <observed header lines>`',
    '`recovery: doc/configuration.md "Loop engine operations"`',
  ]);
  ordered(loop, ['\n## Ledger admission\n', '\n## Spec with ledger\n', 'Ask the human to confirm the approved spec and continuation', '`start brainstorm`', '`plan_check({ planPath: <absolute ledger path> })`', '`start implement`', 'Apply `## Pending recovery` before refresh', 'plan_tracker({ action: "refresh"', '\n## Pending recovery\n']);
  ordered(section(loop, '## Spec with ledger'), ['`start brainstorm`', '`skip brainstorm`', '`engine: "loop"`', '`start plan`']);
  assert.match(section(loop, '## Spec with ledger'), /verify or ship brief: `skip implement R`; `start verify`[^\n]*SKILL\.md "Restore rules"[^\n]*Never call `start implement` on this route/);
});

test('restore rules live in SKILL.md and plan repair is read only on FAIL', () => {
  const rules = section(skill, '## Restore rules');
  for (const token of ['Arming happens only on `start brainstorm`', '"Exact" restoration binds', 'pending-suffix order', 'the implement auto-complete edge', 'Gate history not restored; re-validating `<task>` before any stage advance', '`<task>` is `ledger rows` for a ledger', "the brief's `Active task`,\nelse the first in-progress task, else `none`"]) {
    assert.ok(rules.includes(token), token);
    assert.ok(!file['plan-repair.md'].includes(token), `plan-repair.md: ${token}`);
  }
  assert.match(file['restore-plan.md'], /Apply \.\.\/SKILL\.md "Restore rules" at every `plan_tracker init`/);
  assert.match(section(file['restore-plan.md'], '## Spec with plan'), /Validate the confirmed snapshot against \.\.\/SKILL\.md "Restore rules"/);
  for (const [name, text] of [...Object.entries(file), [handoffPath, handoff]]) {
    const lines = text.split('\n').filter(line => line.includes('plan-repair.md'));
    if (name !== 'restore-plan.md') assert.deepEqual(lines, [], name);
    else {
      assert.equal(lines.length, 2);
      for (const line of lines) assert.match(line, /FAIL[^\n]*`Read` `plan-repair\.md` in full/);
    }
  }
  for (const heading of ['## Boundaries', '## Post-restore continuation']) assert.match(section(skill, heading), /plan repair/);
  for (const name of ['restore-plan.md', 'plan-repair.md']) assert.ok(!file[name].includes('restore-loop.md'), name);
  for (const token of ['## Plan repair', '### Baseline continuation', '### Citation repair', 'Repair stopped: <check> - <reason> is outside citation repair', 'Repair stopped: <check> - <reason> survived 3 rounds', 'Repaired plan: <n> findings']) {
    assert.ok(file['plan-repair.md'].includes(token), token);
  }
});

test('task-plan restore keeps each stage call sequence', () => {
  const restore = section(file['restore-plan.md'], '## Process-state restore');
  const row = stage => restore.split('\n').find(line => line.startsWith(`| ${stage} |`));
  assert.equal(row('brainstorm'), '| brainstorm | `start brainstorm`; `substep` if the brief shows one |');
  assert.match(file['restore-plan.md'], /`engine` from the approved spec's `\*\*Engine:\*\*` header \(`waves` when absent\)/);
  for (const call of file['restore-plan.md'].matchAll(/`skip brainstorm [^`]+`([^;]*);/g)) assert.match(call[1], /with `engine`/);
  assert.equal(row('plan'), '| plan | `start brainstorm`; `skip brainstorm S` with `engine`; `start plan`; `substep` if shown |');
  assert.match(row('implement'), /`plan_check\(\{ planPath \}\)`; on FAIL[^|]*on PASS `skip plan R`; `start implement`; `substep` if shown; `plan_tracker init` \|$/);
  assert.match(row('verify'), /`skip implement R`; `start verify`; `substep` if shown; `plan_tracker init`\. Never call `start implement`\./);
  assert.match(row('ship'), /as verify[^|]*`legs:` block[^|]*Restoration stops at verify in_progress/);
});

test('saved runs continue at the linked step, never the reset-bearing entry', () => {
  const table = section(skill, '## Post-restore continuation');
  const sample = name => read(`eval/gauntlet-resume/samples/${name}/case.md`);
  const check = (condition, stepFile, boundary) => {
    const row = table.split('\n').find(line => line.startsWith(`| ${condition} |`));
    assert.ok(row, condition);
    const [, target, entry] = row.split(' | ');
    const [, link] = target.match(/^\[[^\]]+\]\(([^)]+)\)$/) ?? [];
    assert.ok(link, `${condition}: missing file link`);
    const [path, anchor] = link.split('#');
    assert.equal(path, `../gauntlet/${stepFile}`, condition);
    const headings = read(`${resume}/${path}`).match(/^## .+$/gm);
    if (anchor) assert.ok(headings.some(h => h.slice(3).toLowerCase().replaceAll(' ', '-') === anchor), link);
    assert.match(entry, boundary, condition);
  };
  for (const [name, qualifier, path, boundary] of [
    ['current-brainstorm-brief', '', 'SKILL.md', /step 3.*step 4.*step 8.*Never `\/skill:gauntlet` entry/],
    ['current-plan-brief', ' with task engine', 'plan/plan.md', /skip its `start plan`/],
    ['clean-pass-unchanged', ' with task plan', 'implement/waves/waves.md', /re-run its `Tests:`/],
    ['baseline-upgrade-preserves-statuses', ' without `Ledger:`', 'verify/verify.md', /full conformance gate/],
    ['current-ship-brief', ' without `Ledger:`', 'verify/verify.md', /full conformance gate/],
  ]) {
    const [, active] = sample(name).match(/^  → (\w+)/m);
    check((active === 'ship' ? 'verify' : active) + qualifier, path, boundary);
  }
  const ledger = read('eval/gauntlet-resume/tool-traces/results/ledger-brief.md');
  assert.match(ledger, /^Ledger: .+$/m);
  check(`${ledger.match(/^  → (\w+)/m)[1]} with a ledger`, 'implement/loop/loop.md', /Before each dispatch/);
  assert.match(sample('ledger-tracker-verify'), /verify and ship briefs each save tasks/);
  check('verify with `Ledger:` (including ship-stage ledger briefs restored at verify)', 'implement/loop/loop.md', /After the loop` step 1/);
  const [, engine] = sample('loop-no-ledger').match(/no plan or ledger\..*?\*\*Engine:\*\* (\w+)/);
  check(`approved spec with \`**Engine:** ${engine}\`, no ledger`, 'implement/loop/loop.md', /Entry steps 1-5/);
});
