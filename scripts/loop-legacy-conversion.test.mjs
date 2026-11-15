import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { sha256 } from '../eval/lib/checks.mjs';
import { MODELS } from '../eval/lib/models.mjs';
import { judgmentCurrent } from '../eval/lib/records.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function historicalModels(candidate, baseline) {
  const models = [];
  for (const model of candidate.models.replay) {
    let usable = true;
    for (const record of [candidate, baseline]) {
      const output = record.outputs[model];
      const context = `${record.sample}/${record.arm}/${model}`;
      if (output?.status === 'error') {
        assert.equal(output.status, 'error', `${context}: errored replay excluded from evidence`);
        assert.ok(typeof output.error === 'string' && output.error.trim().length > 0, `${context}: errored replay excluded from evidence needs an error string`);
        console.log(`${context}: errored replay excluded from evidence`);
        usable = false;
        continue;
      }
      assert.equal(output?.status, 'ok', context);
      assert.ok(typeof output.text === 'string' && output.text.trim().length > 0, `${context}: nonempty reply text`);
      const hash = candidate.judge?.[model]?.[`${record.arm}OutputSha`];
      if (hash === undefined && candidate.outputs[model]?.status === 'error') { usable = false; continue; }
      assert.equal(hash, sha256(output.text), `${context}: recorded output hash`);
    }
    if (usable) models.push(model);
  }
  assert.ok(models.length > 0, `${candidate.sample}: at least one hash-verified ok reply pair`);
  return models;
}

const reconstruction = read('skills/gauntlet-resume/reference/reconstruction.md');
const subject = read('skills/finishing-a-development-branch/reference/commit-message.md')
  .match(/\| Returns conversion on resume \| `([^`]+)` \|/)[1];

function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), 'loop-legacy-conversion-'));
  const ledger = 'docs/task-ledger.md';
  const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
    CHECKOUT: cwd, ledger_path: ledger, conversion_subject: subject };
  const primary = mkdtempSync(join(tmpdir(), 'loop-legacy-primary-'));
  const git = (...args) => execFileSync('timeout', ['-k', '30', '10', 'git', ...args], {
    cwd, env, encoding: 'utf8', timeout: 45_000, stdio: ['ignore', 'pipe', 'pipe'],
  }).trimEnd();
  git('init', '-q', '-b', 'fixture');
  git('commit', '--allow-empty', '-qm', 'loop: repair seed');
  const base = git('rev-parse', 'HEAD');
  mkdirSync(join(cwd, 'docs'));
  let text = `# Ledger - loop engine\n\n**Spec:** docs/task.md\nbase: ${base}\nverification: echo allowance: 4\nchecks: local\niterations: 0\nallowance: 4\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n| 1 | open | 2 | node --test tests/plants.test.mjs; 1 failed |\n\n## Decisions\nrow 1 failed | Preserve this decision. | Reuse the fixture.\n`;
  const file = join(cwd, ledger);
  const commit = (message, next = text) => {
    text = next;
    writeFileSync(file, text);
    git('add', '--', ledger);
    git('commit', '-qm', message);
  };
  commit('Create the legacy fixture');
  const convert = () => {
    const recipe = reconstruction.match(/<!-- ledger-conversion-shell -->\s*```bash\n([\s\S]*?)\n```/);
    assert.ok(recipe, 'resume must supply an executable legacy conversion recipe');
    return spawnSync('timeout', ['-k', '30', '30', 'bash', '-c', recipe[1]], {
      cwd: primary, env, encoding: 'utf8', timeout: 65_000,
    });
  };
  return { cwd, ledger, file, git, commit, convert, read: () => readFileSync(file, 'utf8') };
}

test('the shipped conversion recipe preserves legacy counts and commits exactly once', () => {
  const f = fixture();
  const markers = [
    ['loop: repair seed', 'Seed timed out | rerun locally\nDo not copy this second line', 'repair seed', 'Seed timed out \\| rerun locally'],
    ['loop: repair verification', 'Fix the failing check', 'repair verification', 'Fix the failing check'],
    ['loop: repair seed', '', 'repair seed', 'converted'],
    ['loop: repair row 1', 'Not a seed or verification repair'],
    ['loop: repair verification', '', 'repair verification', 'converted'],
    ['loop: repair verification extra', 'Not an exact marker'],
    ['Keep unrelated ledger prose', 'Not a repair'],
  ];
  const repairs = [];
  for (const [index, [marker, body, kind, reason]] of markers.entries()) {
    f.commit(marker + (body ? `\n\n${body}` : ''), f.read().replace(/^iterations: \d+$/m, `iterations: ${index + 1}`));
    if (kind) repairs.push(`${kind} | ${reason} | converted ${f.git('rev-parse', '--short=7', 'HEAD')}`);
  }
  writeFileSync(join(f.cwd, 'unrelated.txt'), 'Not a ledger repair\n');
  f.git('add', '--', 'unrelated.txt');
  f.git('commit', '-qm', 'loop: repair seed');
  repairs.push(`repair seed | converted | converted ${f.git('rev-parse', '--short=7', 'HEAD')}`);
  f.git('commit', '--allow-empty', '-qm', 'loop: repair verification');
  repairs.push(`repair verification | converted | converted ${f.git('rev-parse', '--short=7', 'HEAD')}`);
  const base = f.read().match(/^base: (.+)$/m)[1];
  const legacySubjects = f.git('log', '--format=%s', `${base}..HEAD`).split('\n');
  const before = f.read();
  const head = f.git('rev-parse', 'HEAD');
  const result = f.convert();
  assert.equal(result.status, 0, result.stderr);
  const converted = f.read();
  assert.equal(converted, before.replace('\nallowance: 4\n', '\nallowance: 4\nreturned: none\n') + repairs.join('\n') + '\n');
  for (const kind of ['seed', 'verification']) {
    const legacyCount = legacySubjects.filter(value => value === `loop: repair ${kind}`).length;
    assert.equal(legacyCount, 3, `${kind}: fixture includes a marker without a ledger diff`);
    assert.equal(converted.match(new RegExp(`^repair ${kind} \\|`, 'gm'))?.length, legacyCount);
  }
  assert.equal(f.git('rev-list', '--count', `${head}..HEAD`), '1');
  assert.equal(f.git('show', '-s', '--format=%B', 'HEAD'), subject);
  assert.equal(f.git('diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'), f.ledger);
  assert.equal(f.git('status', '--porcelain'), '');
  const convertedHead = f.git('rev-parse', 'HEAD');
  const again = f.convert();
  assert.equal(again.status, 0, again.stderr);
  assert.equal(f.git('rev-parse', 'HEAD'), convertedHead, 'already returned means no second commit');
  assert.equal(f.read(), converted, 'second conversion preserves every byte');
});

test('conversion refuses a dirty tree, pending tuple or unreadable repair snapshot before mutation', async t => {
  for (const variant of ['dirty', 'pending', 'snapshot']) {
    await t.test(variant, () => {
      const f = fixture();
      if (variant === 'dirty') writeFileSync(join(f.cwd, 'untracked.txt'), 'Keep this dirt\n');
      if (variant === 'pending') f.commit('Keep pending state', f.read().replace('\nallowance: 4\n', `\nallowance: 4\npending: 1 | home | ${f.git('rev-parse', 'HEAD')}\n`));
      if (variant === 'snapshot') {
        f.commit('loop: repair seed', f.read().replace('iterations: 0', 'iterations: unavailable'));
        f.commit('Restore valid current count', f.read().replace('iterations: unavailable', 'iterations: 1'));
      }
      const before = f.read();
      const head = f.git('rev-parse', 'HEAD');
      const status = f.git('status', '--porcelain');
      const result = f.convert();
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, { dirty: /clean tree/, pending: /pending recovery/, snapshot: /iterations/ }[variant]);
      assert.equal(f.read(), before);
      assert.equal(f.git('rev-parse', 'HEAD'), head);
      assert.equal(f.git('status', '--porcelain'), status);
    });
  }
});

test('legacy companion bodies feed the production five-argument admission shell', async t => {
  const adapter = reconstruction.match(/<!-- legacy-companion-body-shell -->\s*```bash\n([\s\S]*?)\n```/);
  assert.ok(adapter, 'legacy recovery must supply the body-to-file adapter');
  const admission = read('skills/loop-implementation/reference/coordinated-legs.md')
    .match(/<!-- companion-return-shell -->\s*```bash\n([\s\S]*?)\n```/)[1];
  for (const target of ['1', 'seed']) await t.test(target, () => {
    const f = fixture();
    const before = f.git('rev-parse', 'HEAD');
    const pending = `pending: ${target} | companion | ${before}`;
    const rows = `| 1 | done | ${target === 'seed' ? 0 : 1} | Count plants; 1 passed |`;
    const decision = target === 'seed'
      ? 'row 0 done | seeded 1 rows, closed 1 on baseline | Keep the small fixture'
      : 'row 1 done | Count plants | Keep the small fixture';
    f.git('commit', '--allow-empty', '-qm', `loop: ${target === 'seed' ? 'seed evidence' : 'row 1 done'}\n\n${pending}\niteration: 1\n\n${rows}\n${decision}`);
    const saved = join(mkdtempSync(join(tmpdir(), 'legacy-home-')), 'ledger.md');
    writeFileSync(saved, `iterations: 1\n${pending}\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n| 1 | open | 0 | |\n\n## Leg mapping\n| row | AC | leg |\n|---|---|---|\n| 1 | 1 | companion |\n\n## Decisions\n`);
    const result = spawnSync('timeout', ['-k', '30', '30', 'bash', '-ec', `${adapter[1]}\n${admission}`], {
      cwd: mkdtempSync(join(tmpdir(), 'legacy-adapter-primary-')), encoding: 'utf8', timeout: 65_000,
      env: { ...process.env, CHECKOUT: f.cwd, PENDING: pending, ITERATION: '1', SAVED_LEDGER: saved },
    });
    assert.equal(result.status, 0, result.stderr);
    const admitted = JSON.parse(result.stdout);
    assert.equal(admitted.sha, f.git('rev-parse', 'HEAD'));
    assert.deepEqual(admitted.rows, [rows]);
    assert.deepEqual(admitted.decisions, [decision]);
    assert.equal(f.git('status', '--porcelain'), '');
  });
});

test('historical saved replies: isolated decisions select conversion only for an unconverted ledger', async t => {
  const dir = 'eval/gauntlet-resume';
  const sample = 'legacy-ledger-conversion';
  const target = JSON.parse(read(`${dir}/target.json`));
  const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate-isolated.json`));
  const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline-isolated.json`));
  read(`${dir}/samples/${sample}/case.md`);
  read(`${dir}/samples/${sample}/expected.md`);
  read(`${dir}/replay.md`);
  assert.match(candidate.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
  assert.match(candidate.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
  const identity = {
    kind: target.kind, assembly: target.assembly, thinking: MODELS.thinking,
  };
  assert.deepEqual(candidate.models.replay, MODELS.replay);
  for (const model of historicalModels(candidate, baseline)) {
    await t.test(model, () => {
      assert.equal(candidate.kind, identity.kind);
      assert.equal(candidate.assembly, identity.assembly);
      assert.equal(candidate.models.thinking, identity.thinking);
      assert.equal(candidate.outputs[model]?.status, 'ok');
      assert.equal(baseline.outputs[model]?.status, 'ok');
      const judgment = candidate.judge[model];
      for (const key of ['factsSha', 'judgePromptSha', 'intentSha']) {
        assert.match(judgment[key], /^[a-f0-9]{64}$/, `historical saved replies: recorded ${key}`);
      }
      assert.ok(judgmentCurrent(judgment, {
        factsSha: judgment.factsSha,
        judgePromptSha: judgment.judgePromptSha,
        intentSha: judgment.intentSha,
        baselineOutputSha: sha256(baseline.outputs[model].text),
        candidateOutputSha: sha256(candidate.outputs[model].text),
      }), 'historical saved replies: judgment matches recorded outputs');
      assert.equal(judgment.facts.eligibility?.after, 'holds');
    });
  }
});

test('an unconverted ledger stops before the ordered dispatch table', () => {
  const boundary = read('skills/loop-implementation/SKILL.md').split('## Before each dispatch')[1].split('| Order |')[0];
  assert.ok(boundary.includes('Require exactly one `returned:` line before each dispatch; without one stop with `ledger has no returned: line - resume through /skill:gauntlet-resume`'));
});
