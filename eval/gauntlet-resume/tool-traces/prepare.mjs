import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const env = {
  ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
  GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
};
const run = (cwd, command, ...args) => execFileSync('timeout', ['-k', '30', '10', command, ...args], {
  cwd, env, encoding: 'utf8', timeout: 45_000, stdio: ['ignore', 'pipe', 'pipe'],
}).trimEnd();
const git = (cwd, ...args) => run(cwd, 'git', '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgSign=false', ...args);
const write = (path, content) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content); };

export function prepare() {
  const root = mkdtempSync(join(tmpdir(), 'resume-c1-'));
  const fixture = { root };
  for (const kind of ['ledger', 'plan']) {
    const primary = join(root, kind, 'primary');
    const worktree = join(root, kind, 'worktree');
    mkdirSync(primary, { recursive: true });
    git(primary, 'init', '-q', '-b', 'fixture-base');
    write(join(primary, 'test/widget.test.mjs'), "import assert from 'node:assert/strict';\nimport test from 'node:test';\ntest('widget count', () => assert.equal(1 + 1, 2));\n");
    git(primary, 'add', 'test/widget.test.mjs');
    git(primary, 'commit', '-qm', 'Add the widget fixture');
    const base = git(primary, 'rev-parse', 'HEAD');
    git(primary, 'update-ref', 'refs/remotes/origin/base', base);
    git(primary, 'symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/base');
    git(primary, 'worktree', 'add', '-q', '-b', 'fixture-resume', worktree);
    run(worktree, 'node', '--test', 'test/widget.test.mjs');
    write(join(worktree, 'doc/specs/widget.md'), `# Widget count\n\n**Goal:** Check the widget count.\n**Engine:** ${kind === 'ledger' ? 'loop' : 'waves'}\n**Amend-grant:** none\n\n## Acceptance criteria\n- [ ] Count two widgets.\n\n## Design\nCheck the widget count with the existing fixture.\n`);
    const artifact = `doc/plans/widget${kind === 'ledger' ? '-ledger' : ''}.md`;
    write(join(worktree, artifact), kind === 'ledger' ? `# Ledger - loop engine
**Spec:** \`doc/specs/widget.md\`
base: ${base}
verification: node --test
checks: commands
iterations: 0
allowance: 4
returned: none

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |

## Decisions
` : `# Widget plan

**Spec:** \`doc/specs/widget.md\`
**Verification:** node --test

---

## Wave 1 - Widget

### Task 1: widget

**Files:**
- Modify: \`test/widget.test.mjs\`
- Test: \`test/widget.test.mjs\`

**Tests:**
- \`node --test test/widget.test.mjs\`
- baseline: ${base} pass

Check the widget count.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| - | mechanical: check the widget fixture | Task 1 |
`);
    git(worktree, 'add', 'doc/specs/widget.md', artifact);
    git(worktree, 'commit', '-qm', 'Record the widget run');
    const head = git(worktree, 'rev-parse', 'HEAD');
    const brief = join(root, `${kind}-brief.md`);
    write(brief, `# Handoff: Widget count
## Intent
Resume the approved widget count check.
## Repo state
toplevel: ${worktree}
worktree: yes ${worktree}
branch: fixture-resume
HEAD: ${head}
base: ${base}
dirty: clean
diff-stat: unavailable
test cmd: node --test test/widget.test.mjs
## Decisions
- The widget spec is approved; continue at implement.
## Open questions
- none
## Skills loaded: none
## Process state

Phases:
  ⊘ brainstorm (resume: doc/specs/widget.md)
  ⊘ plan (resume: doc/plans/widget${kind === 'ledger' ? '-ledger' : ''}.md)
  → implement(fixture)
  ○ verify
  ○ ship

Plan: 0/1 done (1 in progress)

  → [0] ${kind === 'ledger' ? 'row 1 | 0/4: Count two widgets.' : 'W1: widget'}

${kind === 'ledger' ? `Ledger: ${artifact}\nLast decision: none` : 'Active task: W1: widget'}
Gate history not restored - re-validate before advancing.
`);
    fixture[kind] = { primary, worktree, brief, artifact, base, head };
  }
  write(join(root, 'fixture.json'), `${JSON.stringify(fixture, null, 2)}\n`);
  return fixture;
}

if (import.meta.main) console.log(JSON.stringify(prepare(), null, 2));
