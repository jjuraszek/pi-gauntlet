import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import test from 'node:test';
import { sha256 } from '../eval/lib/checks.mjs';
import { cellReusable, judgmentCurrent } from '../eval/lib/records.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const coordinated = read('skills/loop-implementation/reference/coordinated-legs.md');
const gatekeep = read('skills/gatekeep-pr/reference/fix-wave.md');
const hotfix = read('skills/chase-bug/hotfix.md');
const transport = read('skills/loop-implementation/reference/return-file.md');
const recipe = marker => {
  const source = marker === 'companion-return-shell' ? coordinated : transport;
  const match = source.match(new RegExp(`<!-- ${marker} -->\\s*\x60\x60\x60bash\\n([\\s\\S]*?)\\n\x60\x60\x60`));
  assert.ok(match, `production recipe: ${marker}`);
  return match[1];
};
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
  GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
const run = (command, args, options = {}) => spawnSync('timeout', ['-k', '30', '20', command, ...args], {
  env, encoding: 'utf8', timeout: 55_000, ...options,
});
const pass = result => { assert.equal(result.status, 0, result.stderr); return result.stdout.trimEnd(); };
const git = (root, ...args) => pass(run('git', ['-C', root, ...args]));
const init = root => {
  mkdirSync(root, { recursive: true });
  git(root, 'init', '-q', '-b', 'fixture');
  writeFileSync(join(root, 'work.txt'), 'Before the supplied worker result\n');
  git(root, 'add', '--', 'work.txt');
  git(root, 'commit', '-qm', 'Start the return fixture');
  return git(root, 'rev-parse', 'HEAD');
};
const evidence = 'timeout -k 30 120 node --test test/totals.test.mjs; 4 passed; 0 failed';
const row = (id, status = 'done', attempts = 1, check = evidence) => `| ${id} | ${status} | ${attempts} | ${check} |`;
const decision = (id, status = 'done') => `row ${id} ${status} | Count imported plants. | Reuse the totals fixture.`;

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

function savedReplies(name, sample, facts) {
  const dir = `eval/${name}`;
  const candidate = JSON.parse(read(`${dir}/results/${sample}/candidate.json`));
  const baseline = JSON.parse(read(`${dir}/results/${sample}/baseline.json`));
  const target = JSON.parse(read(`${dir}/target.json`));
  read(`${dir}/samples/${sample}/case.md`);
  read(`${dir}/samples/${sample}/expected.md`);
  read(`${dir}/replay.md`);
  assert.match(candidate.skillSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded skill hash');
  assert.match(candidate.inputSha, /^[a-f0-9]{64}$/, 'historical saved replies: recorded input hash');
  const identity = { skillSha: candidate.skillSha, inputSha: candidate.inputSha, kind: target.kind,
    assembly: target.assembly, thinking: candidate.models.thinking };
  assert.ok(candidate.models.replay.length > 0);
  return historicalModels(candidate, baseline).map(model => {
    assert.ok(cellReusable(candidate, model, identity), 'historical saved replies: reply matches recorded identity');
    const judgment = candidate.judge[model];
    const baselineOutputSha = sha256(baseline.outputs[model].text);
    const candidateOutputSha = sha256(candidate.outputs[model].text);
    for (const key of ['factsSha', 'judgePromptSha', 'intentSha']) {
      assert.match(judgment[key], /^[a-f0-9]{64}$/, `historical saved replies: recorded ${key}`);
    }
    assert.ok(judgmentCurrent(judgment, {
      factsSha: judgment.factsSha, judgePromptSha: judgment.judgePromptSha,
      intentSha: judgment.intentSha, baselineOutputSha, candidateOutputSha,
    }), 'historical saved replies: judgment matches recorded outputs');
    for (const fact of facts) assert.equal(judgment.facts[fact]?.after, 'holds', `${name}/${sample}/${model}/${fact}`);
    assert.ok(['improved', 'unchanged'].includes(judgment.verdict), `${name}/${sample}: ${model}`);
    return candidate.outputs[model].text;
  });
}

// Run only the filesystem transport operation, independently of dispatch or admission.
test('production return-file recipes isolate linked checkouts and preserve other attempts', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'loop-return-path-'));
  const primary = join(scratch, 'primary');
  const before = init(primary);
  const common = git(primary, 'rev-parse', '--path-format=absolute', '--git-common-dir');
  const checkouts = [primary, join(scratch, 'one'), join(scratch, 'two')];
  for (const root of checkouts.slice(1)) git(primary, 'worktree', 'add', '-q', '--detach', root, before);
  const paths = [];
  for (const CHECKOUT of checkouts) {
    const variables = { ...env, CHECKOUT, HEAD_BEFORE: before, ITERATION: '6' };
    const resolve = () => pass(run('bash', ['-c', `${recipe('return-path-shell')}\nprintf '%s\\n' "$RETURN_FILE"`], { env: variables }));
    const path = resolve();
    paths.push(path);
    assert.ok(!relative(common, path).startsWith('..'), 'return is under the git common dir');
    const prepare = () => pass(run('bash', ['-c', `${recipe('return-path-shell')}\n${recipe('return-prepare-shell')}`], { env: variables }));
    prepare();
    writeFileSync(path, 'stale result');
    const other = join(dirname(path), `${before}-5.md`);
    writeFileSync(other, 'another attempt');
    prepare();
    assert.equal(existsSync(path), false, 'stale result removed before dispatch');
    assert.equal(readFileSync(other, 'utf8'), 'another attempt');
    writeFileSync(path, 'unadmitted result');
    assert.equal(resolve(), path, 'resume recomputes without deleting');
    assert.equal(readFileSync(path, 'utf8'), 'unadmitted result');
    pass(run('bash', ['-c', recipe('return-delete-shell')], { env: { ...variables, RETURN_FILE: path } }));
    assert.equal(existsSync(path), false);
    assert.equal(existsSync(other), true);
    assert.equal(git(CHECKOUT, 'status', '--porcelain'), '');
  }
  assert.equal(new Set(paths).size, 3, 'same SHA and count do not alias across checkouts');
  const broken = { ...env, CHECKOUT: primary, HEAD_BEFORE: before, ITERATION: '7' };
  const directory = dirname(paths[0]);
  rmSync(directory, { recursive: true });
  writeFileSync(directory, 'a file blocks directory creation');
  assert.notEqual(run('bash', ['-c', `${recipe('return-path-shell')}\n${recipe('return-prepare-shell')}`], { env: broken }).status, 0);
  assert.notEqual(run('bash', ['-c', recipe('return-path-shell')], {
    env: { ...broken, CHECKOUT: join(scratch, 'absent') },
  }).status, 0, 'failed Git read stops path resolution');
  rmSync(directory);
  mkdirSync(paths[0], { recursive: true });
  assert.notEqual(run('bash', ['-c', recipe('return-prepare-shell')], {
    env: { ...broken, RETURN_FILE: paths[0] },
  }).status, 0, 'failed stale-file deletion stops dispatch');
  assert.notEqual(run('bash', ['-c', recipe('return-delete-shell')], {
    env: { ...broken, RETURN_FILE: paths[0] },
  }).status, 0, 'failed deletion is not success');
});

test('companion production admission reads the file, including seed and malformed-file boundaries', async t => {
  const scratch = mkdtempSync(join(tmpdir(), 'loop-return-admission-'));
  const root = join(scratch, 'companion');
  const before = init(root);
  const saved = join(scratch, 'home-ledger.md');
  const returnPath = join(git(root, 'rev-parse', '--path-format=absolute', '--git-dir'), 'gauntlet', 'returns', `${before}-6.md`);
  mkdirSync(dirname(returnPath), { recursive: true });
  // Supply a completed worker delta; implementation and parent ledger mutation are not replayed.
  writeFileSync(join(root, 'work.txt'), 'Supplied completed worker result\n');
  git(root, 'add', '--', 'work.txt');
  git(root, 'commit', '-qm', 'A message with no attribution');
  const sha = git(root, 'rev-parse', 'HEAD');
  const cases = [
    { name: 'ordinary', rows: [row(2)], decisions: [decision(2)] },
    { name: 'failed with open extra', rows: [row(2, 'failed'), row(3, 'done', 0)], decisions: [decision(2, 'failed'), decision(3)] },
    { name: 'partial seed', target: 'seed', rows: [row(2, 'done', 0), row(3, 'open', 0, '')], decisions: ['row 0 done | seeded 1 rows, closed 1 on baseline | row 3'] },
    ...['missing', 'unreadable', 'tuple', 'iteration', 'foreign', 'attempts', 'duplicate', 'status', 'decision'].map(fault => ({ name: fault, fault })),
    { name: 'seed missing', target: 'seed', fault: 'missing' },
    { name: 'seed unreadable', target: 'seed', fault: 'unreadable' },
    { name: 'seed wrong tuple', target: 'seed', fault: 'tuple' },
  ];
  for (const value of cases) await t.test(value.name, () => {
    rmSync(returnPath, { force: true, recursive: true });
    const target = value.target ?? '2';
    const pending = `pending: ${target} | companion | ${before}`;
    const ledger = `# Ledger - loop engine\niterations: 6\nallowance: 4\nreturned: none\n${pending}\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n| 1 | open | 0 | |\n| 2 | open | 0 | |\n| 3 | open | 0 | |\n\n## Leg mapping\n| row | ac | leg |\n|---|---|---|\n| 1 | 1 | home |\n| 2 | 2 | companion |\n| 3 | 3 | companion |\n\n## Decisions\n`;
    writeFileSync(saved, ledger);
    let rows = value.rows ?? [row(2)];
    let decisions = value.decisions ?? [decision(2)];
    if (value.fault === 'foreign') rows = [row(1)];
    if (value.fault === 'attempts') rows = [row(2, 'done', 0)];
    if (value.fault === 'duplicate') rows = [row(2), row(2)];
    if (value.fault === 'status') rows = [row(2, 'open')];
    if (value.fault === 'decision') decisions = [decision(3)];
    const content = `${value.fault === 'tuple' ? pending.replace('companion', 'other') : pending}\niteration: ${value.fault === 'iteration' ? 5 : 6}\n\n${rows.join('\n')}\n\n${decisions.join('\n')}\n`;
    if (value.fault === 'unreadable') mkdirSync(returnPath); // EISDIR, deterministic even for privileged test runners.
    else if (value.fault !== 'missing') writeFileSync(returnPath, content);
    const result = run('bash', ['-c', recipe('companion-return-shell')], { env: { ...env,
      CHECKOUT: root, PENDING: pending, ITERATION: '6', SAVED_LEDGER: saved, RETURN_FILE: returnPath } });
    if (value.fault) {
      assert.notEqual(result.status, 0, value.name);
      const error = { missing: /ENOENT/, unreadable: /EISDIR/, tuple: /pending mismatch/, iteration: /iteration mismatch/ }[value.fault];
      if (error) assert.match(result.stderr, error);
    } else {
      const admitted = JSON.parse(pass(result));
      assert.deepEqual(admitted, { sha, rows, decisions, decision: decisions[0] });
    }
    assert.equal(readFileSync(saved, 'utf8'), ledger, 'read-only admission');
    assert.equal(git(root, 'rev-list', '--count', `${before}..HEAD`), '1');
    assert.equal(git(root, 'status', '--porcelain'), '');
  });
  const parser = recipe('companion-return-shell');
  assert.doesNotMatch(parser, /format=%[bBs]|--grep|subject/, 'messages supply no admission input');
});

test('historical saved replies: outside-ledger publication writes only the private return before committing', () => {
  for (const output of savedReplies('loop-implementer', 'companion-return-file', ['return-file', 'external-ledger', 'message', 'one-commit'])) {
    const publication = /pending: 2 \| lib \| d{40}\n\s*iteration: 6\n\n\s*(\| 2 \| done \| 1 \| [^\n]+)\n\n\s*(row 2 done \| [^\n]+)/.exec(output);
    assert.ok(publication, 'extract only the published result, not the implementation trace');
    const commit = /git (?:-C \/workspace\/lib\/\.worktrees\/paging )?commit -m "([^"]+)"/.exec(output);
    const add = /git (?:-C \/workspace\/lib\/\.worktrees\/paging )?add -- ([^\n]+)/.exec(output);
    assert.ok(commit && add);
    assert.ok(publication.index < commit.index, 'publication precedes commit');
    assert.equal(add[1].trim(), 'src/totals.mjs');
    const scratch = mkdtempSync(join(tmpdir(), 'loop-outside-publication-'));
    const root = join(scratch, 'companion');
    const before = init(root);
    const home = join(scratch, 'home');
    const homeHead = init(home);
    const ledger = join(home, 'ledger.md');
    writeFileSync(ledger, 'Parent-owned ledger bytes\n');
    const variables = { ...env, CHECKOUT: root, HEAD_BEFORE: before, ITERATION: '6' };
    const path = pass(run('bash', ['-c', `${recipe('return-path-shell')}\n${recipe('return-prepare-shell')}\nprintf '%s\\n' "$RETURN_FILE"`], { env: variables }));
    const content = `pending: 2 | lib | ${before}\niteration: 6\n\n${publication[1].trim()}\n\n${publication[2].trim()}\n`;
    writeFileSync(path, content);
    mkdirSync(join(root, 'src'));
    writeFileSync(join(root, 'src/totals.mjs'), '// Supplied worker delta; row implementation is outside this fixture.\n');
    git(root, 'add', '--', add[1].trim());
    git(root, 'commit', '-qm', commit[1]);
    assert.equal(git(root, 'show', '-s', '--format=%B'), 'Include imported plants in pagination totals');
    assert.equal(git(root, 'diff', '--name-only', before, 'HEAD'), 'src/totals.mjs');
    assert.equal(git(root, 'rev-list', '--count', `${before}..HEAD`), '1');
    assert.equal(git(root, 'status', '--porcelain'), '');
    assert.equal(readFileSync(path, 'utf8'), content, 'worker leaves private file for parent');
    assert.equal(git(home, 'rev-parse', 'HEAD'), homeHead);
    assert.equal(readFileSync(ledger, 'utf8'), 'Parent-owned ledger bytes\n');
  }
});

test('historical saved replies: parent decisions distinguish gatekeep misses, hotfix seed aborts and hotfix row misses', () => {
  savedReplies('gatekeep-pr', 'fix-row-file-observation', ['admission']);
  for (const sample of ['hotfix-seed-file-observation', 'hotfix-row-return-file']) {
    savedReplies('chase-bug', sample, ['admission']);
  }
});

// These assertions cover instruction wiring, not execution of a model-owned parent.
test('outside-ledger parents keep pending-only state and name every file failure and teardown', () => {
  for (const [name, source] of [['gatekeep', gatekeep], ['hotfix', hotfix]]) {
    assert.doesNotMatch(source, /returned:/, `${name} has no returned header per Design`);
    assert.match(source, /missing, unreadable or mismatched return file/, name);
    assert.match(source, /return-file\.md|coordinated-legs\.md#return-file/, `${name} consumes the shared filesystem recipes`);
  }
  assert.match(gatekeep, /validation miss[\s\S]*attempts = saved attempts \+ 1/);
  assert.match(gatekeep, /Charge no round for a validation miss/);
  assert.match(hotfix, /any other seed miss \| Abort \(pre-land\), no seed retry/);
  assert.match(hotfix, /Remove any remaining return file.*every exit/);
  assert.match(coordinated, /Delete this file after admission, after a validation-miss repair and in interrupted recovery/);
});
