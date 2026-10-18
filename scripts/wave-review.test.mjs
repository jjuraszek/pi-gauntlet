import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const skill = readFileSync(new URL('../skills/subagent-driven-development/SKILL.md', import.meta.url), 'utf8');
const template = readFileSync(new URL('../skills/requesting-code-review/code-reviewer.md', import.meta.url), 'utf8');
const quote = value => `'${value.replaceAll("'", "'\\''")}'`;
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' }).trim();

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'wave-review-'));
  const repo = join(root, "repo's space");
  git(root, 'init', '-q', repo);
  for (const [key, value] of [['user.name', 'Test'], ['user.email', 'test@example.org'], ['commit.gpgsign', 'false'], ['core.hooksPath', '/dev/null']]) git(repo, 'config', key, value);
  writeFileSync(join(repo, 'existing.txt'), 'before\n');
  writeFileSync(join(repo, 'removed.txt'), 'remove me\n');
  git(repo, 'add', '.');
  git(repo, 'commit', '-qm', 'base');
  const base = git(repo, 'rev-parse', 'HEAD');
  writeFileSync(join(repo, 'existing.txt'), 'after\n');
  writeFileSync(join(repo, 'new.txt'), 'new content\n');
  git(repo, 'rm', 'removed.txt');
  git(repo, 'add', '.');
  const patch = join(root, 'task.patch');
  writeFileSync(patch, git(repo, 'diff', '--cached', '--binary', base) + '\n');
  return { root, repo, base, patch };
}

function snapshot({ repo, base, patch }) {
  const block = skill.match(/<!-- spec-review-snapshot-shell -->\s*```bash\n([\s\S]*?)\n```/);
  assert.ok(block, 'per-patch spec review must materialize the implementation before whole-file reads');
  let script = block[1];
  for (const [key, value] of Object.entries({ WORKTREE: repo, BASE_SHA: base, PATCH_PATH: patch })) script = script.replaceAll(`{{${key}}}`, () => quote(value));
  return spawnSync('bash', ['-c', script], { encoding: 'utf8' });
}

function review(repo, base, head) {
  const block = template.match(/```bash\n([\s\S]*?)\n```/);
  assert.ok(block);
  const command = block[1].replaceAll('{BASE_SHA}', base).replaceAll('{HEAD_SHA}', head);
  return spawnSync('bash', ['-e', '-c', command], { cwd: repo, encoding: 'utf8' });
}

test('per-patch spec review reads changed, added and deleted files without changing the parent', () => {
  const f = fixture();
  git(f.repo, 'reset', '--hard', f.base);
  const before = git(f.repo, 'status', '--porcelain');
  const result = snapshot(f);
  assert.equal(result.status, 0, result.stderr);
  const path = result.stdout.match(/^snapshot: (.+)$/m)?.[1];
  assert.ok(path, result.stdout);
  assert.equal(readFileSync(join(path, 'existing.txt'), 'utf8'), 'after\n');
  assert.equal(readFileSync(join(path, 'new.txt'), 'utf8'), 'new content\n');
  assert.equal(existsSync(join(path, 'removed.txt')), false);
  assert.equal(readFileSync(join(f.repo, 'existing.txt'), 'utf8'), 'before\n');
  assert.equal(existsSync(join(f.repo, 'new.txt')), false);
  assert.equal(git(f.repo, 'status', '--porcelain'), before);
  assert.equal(git(f.repo, 'rev-parse', 'HEAD'), f.base);
  git(f.repo, 'worktree', 'remove', '--force', path);
});

test('an invalid patch cannot produce a reviewable snapshot', () => {
  const f = fixture();
  writeFileSync(f.patch, 'not a patch\n');
  const result = snapshot(f);
  assert.notEqual(result.status, 0);
  assert.doesNotMatch(result.stdout, /^snapshot:/m);
});

test('uncommitted wave review includes staged additions and unstaged fixes while HEAD stays at base', () => {
  const f = fixture();
  writeFileSync(join(f.repo, 'existing.txt'), 'after repair\n');
  const result = review(f.repo, f.base, 'WORKTREE');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\+after repair/);
  assert.match(result.stdout, /\+new content/);
  assert.match(result.stdout, /deleted file mode/);
  assert.equal(git(f.repo, 'rev-parse', 'HEAD'), f.base);
});

test('committed review keeps the explicit range and excludes later uncommitted edits', () => {
  const f = fixture();
  git(f.repo, 'commit', '-qm', 'implementation');
  const head = git(f.repo, 'rev-parse', 'HEAD');
  writeFileSync(join(f.repo, 'existing.txt'), 'not reviewed\n');
  const result = review(f.repo, f.base, head);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\+after/);
  assert.match(result.stdout, /\+new content/);
  assert.doesNotMatch(result.stdout, /not reviewed/);
});
