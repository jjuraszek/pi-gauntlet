import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

test('the standalone verification gate runs the loop contract regression', () => {
  const name = 'the loop uses the shared verification command or discovers the project test entrypoint';
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const output = execFileSync(process.execPath, [
    '--test', '--test-reporter=tap', `--test-name-pattern=^${name}$`,
    fileURLToPath(new URL('./loop-engine-contract.test.mjs', import.meta.url)),
  ], { env, encoding: 'utf8' });
  assert.match(output, new RegExp(`^ok \\d+ - ${name}$`, 'm'), 'the selector must execute the regression');
});
