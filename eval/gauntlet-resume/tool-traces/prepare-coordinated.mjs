import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { prepare } from './prepare.mjs';

const env = {
  ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
  GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
};
const git = (cwd, ...args) => execFileSync('timeout', [
  '-k', '30', '10', 'git', '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgSign=false', '-C', cwd, ...args,
], { env, encoding: 'utf8', timeout: 45_000, stdio: ['ignore', 'pipe', 'pipe'] }).trimEnd();
const read = path => readFileSync(path, 'utf8');
const write = (path, content) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content); };

export function prepareCoordinated() {
  const source = prepare();
  const home = { ...source.plan, repo: 'acme/repo-a' };
  const companion = { repo: 'acme/repo-b', primary: join(dirname(home.primary), 'repo-b') };
  companion.worktree = join(companion.primary, '.worktrees/fixture-resume');
  mkdirSync(companion.primary, { recursive: true });
  git(companion.primary, 'init', '-q', '-b', 'fixture-base');
  write(join(companion.primary, '.gitignore'), '.worktrees/\n');
  write(join(companion.primary, 'test/widget.test.mjs'), read(join(home.primary, 'test/widget.test.mjs')));
  const rules = '# Widget fixture\n\nRun the existing widget test with Node.\n';
  write(join(companion.primary, 'README.md'), rules);
  git(companion.primary, 'add', '.gitignore', 'test/widget.test.mjs', 'README.md');
  git(companion.primary, 'commit', '-qm', 'Add the companion widget fixture');
  companion.base = git(companion.primary, 'rev-parse', 'HEAD');
  git(companion.primary, 'worktree', 'add', '-q', '-b', 'fixture-resume', companion.worktree);
  for (const leg of [home, companion]) {
    git(leg.primary, 'config', 'remote.origin.url', `https://example.test/${leg.repo}.git`);
  }
  const overrides = '# shared\n\n## issue-tracker\n- repo: acme/repo-a\n\n## siblings\n- sibling: https://example.test/acme/repo-b.git\n';
  for (const path of [home.primary, home.worktree]) {
    write(join(path, '.pi/gauntlet.md'), overrides);
    write(join(path, 'README.md'), rules);
  }
  git(home.primary, 'add', '.pi/gauntlet.md', 'README.md');
  git(home.primary, 'commit', '-qm', 'Declare the companion fixture');

  const block = (repo, scope, design) => `### Leg: ${repo}
branch: fixture-resume
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: node --test test/widget.test.mjs
Rules: README.md
scope: ${scope}
design: ${design}
`;
  const companionBlock = block(companion.repo, 'none', 'Keep the supporting test/widget.test.mjs fixture.');
  const problem = 'Check the widget count across an approved two-repository run.';
  const design = 'Check the widget count with the existing fixture.';
  const homeSpecPath = join(home.worktree, 'doc/specs/widget.md');
  write(homeSpecPath, read(homeSpecPath)
    .replace('## Acceptance criteria', `## Problem\n${problem}\n\n## Acceptance criteria`)
    .replace('## Design', `## Legs\n\n${block(home.repo, 'AC 1', 'Check two widgets in test/widget.test.mjs.')}\n${companionBlock}\n## Design`));
  const planPath = join(home.worktree, home.artifact);
  write(planPath, read(planPath).replace('---', `Baseline ${home.repo}: ${home.base}\nBaseline ${companion.repo}: ${companion.base}\n\n---`));
  git(home.worktree, 'add', '.pi/gauntlet.md', 'README.md', 'doc/specs/widget.md', home.artifact);
  git(home.worktree, 'commit', '-qm', 'Record the coordinated widget run');
  home.head = git(home.worktree, 'rev-parse', 'HEAD');
  write(join(companion.worktree, 'doc/specs/widget.md'), `# Widget count\n\n**Home:** ${home.repo} fixture-resume doc/specs/widget.md\n\n## Problem\n${problem}\n\n## Decisions\n${design}\n\n${companionBlock}`);
  git(companion.worktree, 'add', 'doc/specs/widget.md');
  git(companion.worktree, 'commit', '-qm', 'Record the coordinated widget run');
  companion.head = git(companion.worktree, 'rev-parse', 'HEAD');

  const brief = join(source.root, 'coordinated-brief.md');
  const legs = [home, companion].map(leg => `  - repo: ${leg.repo}\n    worktree: ${leg.worktree}\n    branch: fixture-resume\n    HEAD: ${leg.head}\n    dirty: clean`).join('\n');
  write(brief, read(home.brief).replace(/^HEAD: .+$/m, `HEAD: ${home.head}`)
    .replace('Gate history not restored', `legs:\n${legs}\nGate history not restored`));
  delete home.brief;
  const fixture = { root: source.root, brief, home, companion };
  write(join(source.root, 'coordinated-fixture.json'), `${JSON.stringify(fixture, null, 2)}\n`);
  return fixture;
}

if (import.meta.main) console.log(JSON.stringify(prepareCoordinated(), null, 2));
