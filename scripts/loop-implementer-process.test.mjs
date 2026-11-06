import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const persona = read('../agents/loop-implementer.md');

test('worker bounds blocking calls and fences owned-session cleanup', () => {
  for (const phrase of [
    'timeout -k 30 <n>', 'at most 600 seconds', 'foreground command, a poll, a wait',
    'Preflight python3 and timeout', 'start_new_session=True',
    '["timeout", "-k", "30", "3600", ...command]',
    '${TMPDIR:-/tmp}/loop-<base SHA>-<iteration>.jobs',
    'pre-bump task iteration', 'OS-observed process start identity',
    'each poll in a separate tool call', 'Recheck identity and command immediately before signaling',
    'cleanup incomplete', 'timed out after <n> s',
    'Include bookkeeping commands', 'Let the controller outlive',
    'with the executed preflight as the evidence command',
  ]) assert.ok(persona.includes(phrase), `missing: ${phrase}`);
  assert.ok(Buffer.byteLength(persona) < 50_000);
  assert.ok(persona.split('\n').length <= 2000);
});

test('controlled Python session times out, reaps the job and clears its record', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'loop-process-check-'));
  const controller = join(scratch, 'controller.py');
  writeFileSync(controller, `import os, pathlib, subprocess, sys
root = pathlib.Path(sys.argv[1])
jobs = root / 'loop-probe-0.jobs'
log = root / 'job.log'
with log.open('w') as out:
    job = subprocess.Popen(['timeout', '-k', '30', '2', 'sleep', '30'], start_new_session=True, stdout=out, stderr=subprocess.STDOUT)
    def observe():
        start = subprocess.check_output(['ps', '-o', 'lstart=', '-p', str(job.pid)], timeout=5, text=True).strip().replace(' ', '_')
        command = subprocess.check_output(['ps', '-ww', '-o', 'command=', '-p', str(job.pid)], timeout=5, text=True).strip()
        return start, command
    start, command = observe()
    assert start and command
    jobs.write_text(f'{job.pid} {start} {command}\\n')
    assert os.getpgid(job.pid) == job.pid == os.getsid(job.pid)
    assert observe() == (start, command)
    code = job.wait(timeout=35)
    assert code == 124, code
    out.write('timed out after 2 s\\n')
for target in (job.pid, -job.pid):
    try:
        os.kill(target, 0)
    except ProcessLookupError:
        pass
    else:
        raise AssertionError(f'job or group still alive: {target}')
jobs.write_text('')
print(log.read_text().splitlines()[-1])
print('jobs file empty' if jobs.read_text() == '' else 'jobs file not empty')
print('kill -0 pid failed; process group absent')
`);
  const result = spawnSync('timeout', ['-k', '30', '60', 'python3', controller, scratch], { encoding: 'utf8', timeout: 95_000 });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}\nScratch: ${scratch}`);
  assert.equal(result.stdout, 'timed out after 2 s\njobs file empty\nkill -0 pid failed; process group absent\n');
  console.log(result.stdout.trim());
});

test('selected stored replay holds blocking bounds and safe cleanup', () => {
  const candidate = JSON.parse(read('../eval/loop-implementer/results/silence-bound-and-unreachable/candidate.json'));
  const cells = Object.entries(candidate.judge);
  assert.ok(cells.length > 0);
  for (const [model, cell] of cells) {
    assert.equal(candidate.outputs[model].status, 'ok');
    for (const fact of ['blocking-bound', 'owned-session', 'timeout-cleanup', 'safe-stop']) {
      assert.equal(cell.facts[fact]?.after, 'holds', `${model}: ${fact}`);
    }
  }
});
