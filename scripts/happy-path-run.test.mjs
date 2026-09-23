import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, existsSync, mkdirSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const skill = readFileSync(new URL('../skills/subagent-driven-development/SKILL.md', import.meta.url), 'utf8');
const block = skill.match(/<!-- happy-path-shell -->\s*```bash\n([\s\S]*?)\n\s*```/);
const quote = value => `'${value.replaceAll("'", "'\\''")}'`;
const bashPath = spawnSync('bash', ['-c', 'command -v bash'], { encoding: 'utf8' }).stdout.trim();
const timeout = spawnSync('bash', ['-c', 'command -v timeout || command -v gtimeout'], { encoding: 'utf8' }).stdout.trim();

function run(command, { token = command.split(/\s+/)[0], duration = '2s', header = 'demo', setup, env = {}, shellArgs = ['-c'], expectFailure = false } = {}) {
  assert.ok(block, 'skill must ship one executable happy-path shell template');
  const root = mkdtempSync(join(tmpdir(), 'hp-test-'));
  {
    const repo = join(root, "repo's space");
    const init = spawnSync('git', ['init', '-q', repo]);
    assert.equal(init.status, 0);
    writeFileSync(join(repo, 'tracked'), 'before');
    for (const [key, value] of [['user.name', 'Test'], ['user.email', 'test@example.org'], ['commit.gpgsign', 'false'], ['core.hooksPath', '/dev/null']]) {
      assert.equal(spawnSync('git', ['-C', repo, 'config', key, value]).status, 0);
    }
    assert.equal(spawnSync('git', ['-C', repo, 'add', 'tracked']).status, 0);
    assert.equal(spawnSync('git', ['-C', repo, 'commit', '-qm', 'init']).status, 0);
    const marker = join(root, 'invoked');
    setup?.({ root, repo, marker });
    if (env.PATH === '/nonexistent') {
      const bin = join(root, 'bin');
      mkdirSync(bin);
      for (const name of ['git', 'mktemp', 'tail']) symlinkSync(spawnSync('bash', ['-c', `command -v ${name}`], { encoding: 'utf8' }).stdout.trim(), join(bin, name));
      env.PATH = bin;
    }
    const bindings = { HP_WORKTREE: repo, HP_COMMAND: command.replaceAll('{MARKER}', quote(marker)).replaceAll('{ROOT}', quote(root)), HP_TOKEN: token, HP_DURATION: duration, HP_ROW: 'demo', HP_HEADER: header };
    let script = block[1];
    for (const [key, value] of Object.entries(bindings)) script = script.replaceAll(`{{${key}}}`, () => quote(value));
    assert.doesNotMatch(script, /\{\{HP_[A-Z]+\}\}/);
    const result = spawnSync(bashPath, [...shellArgs, script], { encoding: 'utf8', timeout: 10000, env: { ...process.env, ...env } });
    if (expectFailure) {
      assert.notEqual(result.status, 0);
      assert.doesNotMatch(result.stdout, /summary:|outcome:|happy-path: passed/);
      assert.match(skill, /block exits non-zero[^\n]*stop verification[^\n]*report[^\n]*shell error/i);
      return { stdout: result.stdout };
    }
    assert.equal(result.status, 0, result.stderr);
    const match = result.stdout.match(/summary: (.+)\noutcome: (.+)\n/);
    assert.ok(match, result.stdout);
    const summary = readFileSync(match[1], 'utf8');
    assert.equal(summary.split('\n')[0], match[2]);
    assert.match(summary, /\nhead: [0-9a-f]+\nrow: demo/);
    return { summary, marker: existsSync(marker), transcript: existsSync(join(match[1], '..', 'transcript.log')), root };
  }
}

test('executes shipped command and records its output', { skip: !timeout && 'timeout binary unavailable' }, () => {
  const result = run('printf delivered; touch {MARKER}', { token: 'printf' });
  assert.equal(result.marker, true);
  assert.match(result.summary, /^happy-path: passed/);
  assert.match(result.summary, /delivered/);
  assert.equal(result.transcript, true);
  assert.match(run('VALUE=ok echo "$VALUE"', { token: 'echo', header: 'old row' }).summary, /row: demo \(header: old row\)/);
});
test('nonzero and environment exits retain classification', { skip: !timeout && 'timeout binary unavailable' }, () => {
  assert.match(run('exit 7', { token: 'bash' }).summary, /^happy-path: failed \(exit 7\)/);
  assert.match(run('echo unavailable; exit 75', { token: 'bash' }).summary, /^happy-path: not run - environment unavailable: unavailable/);
});
test('missing and empty commands precheck without transcript', { skip: !timeout && 'timeout binary unavailable' }, () => {
  assert.match(run('missing-hp-command', { token: 'missing-hp-command' }).summary, /^happy-path: not run - command not found/);
  const empty = run('', { token: '' });
  assert.match(empty.summary, /^happy-path: not run - command not found/);
  assert.equal(empty.transcript, false);
  assert.equal(empty.summary.split('\n').filter(Boolean).length, 3);
});
test('missing timeout prechecks without transcript', () => {
  const result = run('echo hi', { token: 'echo', env: { PATH: '/nonexistent' } });
  assert.match(result.summary, /^happy-path: not run - no timeout binary/);
  assert.equal(result.transcript, false);
});
test('timeout is failed and residue overrides exit', { skip: !timeout && 'timeout binary unavailable' }, () => {
  assert.match(run('sleep 3', { token: 'sleep', duration: '1s' }).summary, /^happy-path: failed - timed out after 1s/);
  assert.match(run('echo changed > tracked', { token: 'echo' }).summary, /^happy-path: failed - dirtied worktree:  M tracked/);
  assert.match(run('echo added > extra', { token: 'echo' }).summary, /\?\? extra/);
  const multiple = run('touch first second', { token: 'touch' }).summary;
  assert.match(multiple.split('\n')[0], /\?\? first.*\?\? second/);
  assert.match(multiple, /^happy-path: failed - dirtied worktree: [^\n]+\nhead: [0-9a-f]+\nrow: demo\n/);
});
test('exit 126 and inherited errexit classify without aborting the summary', { skip: !timeout && 'timeout binary unavailable' }, () => {
  assert.match(run('exit 126', { token: 'bash' }).summary, /^happy-path: not run - not executable/);
  assert.match(run('exit 7', { token: 'bash', shellArgs: ['-e', '-c'] }).summary, /^happy-path: failed \(exit 7\)/);
});
test('Git inspection failure cannot produce a passed summary', { skip: !timeout && 'timeout binary unavailable' }, () => {
  run('mv .git .git-away', { token: 'mv', expectFailure: true });
});
test('summary contains only the final 200 transcript lines', { skip: !timeout && 'timeout binary unavailable' }, () => {
  const result = run('for ((i=1;i<=205;i++)); do echo "line-$i"; done', { token: 'bash' });
  assert.doesNotMatch(result.summary, /line-1\n/);
  assert.match(result.summary, /line-6\n/);
  assert.match(result.summary, /line-205\n/);
  assert.equal(result.summary.match(/line-\d+\n/g)?.length, 200);
});
test('local producer-consumer delivery succeeds and broken delivery times out', { skip: !timeout && 'timeout binary unavailable' }, () => {
  const flow = destination => `mkfifo {ROOT}/pipe; exec 3<> {ROOT}/pipe; (printf 'message\\n' > ${destination}) & read -r msg <&3 && wait && test "$msg" = message && echo "consumer received $msg"`;
  assert.match(run(flow('{ROOT}/pipe'), { token: 'mkfifo' }).summary, /happy-path: passed[\s\S]*consumer received message/);
  const stalled = run(`echo $$ > {ROOT}/consumer.pid; ${flow('/dev/null')}`, { token: 'echo', duration: '1s' });
  assert.match(stalled.summary, /^happy-path: failed - timed out/);
  const pid = Number(readFileSync(join(stalled.root, 'consumer.pid'), 'utf8'));
  assert.ok(Number.isInteger(pid) && pid > 0, `invalid consumer PID: ${readFileSync(join(stalled.root, 'consumer.pid'), 'utf8')}`);
  assert.throws(() => process.kill(pid, 0), { code: 'ESRCH' });
});
