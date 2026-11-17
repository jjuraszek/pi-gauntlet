import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const reference = 'skills/finishing-a-development-branch/reference/commit-message.md';
const wording = read(reference);
const spec = read('skills/brainstorming/reference/spec-finalization.md');
const amendment = read('skills/brainstorming/reference/amendment-surface.md');
const housekeeping = read('skills/housekeeping/reference/fix.md');

function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), 'routine-message-'));
  const env = {
    ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
  };
  const run = (program, args, input) => execFileSync('timeout', ['-k', '30', '10', program, ...args], {
    cwd, env, input, encoding: 'utf8', timeout: 45_000, stdio: ['pipe', 'pipe', 'pipe'],
  });
  const git = (args, input) => run('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args], input);
  const put = (path, contents) => {
    mkdirSync(dirname(join(cwd, path)), { recursive: true });
    writeFileSync(join(cwd, path), contents);
  };
  const message = ref => git(['cat-file', 'commit', ref]).split('\n\n').slice(1).join('\n\n');
  git(['init', '-q', '-b', 'fixture']);
  git(['commit', '--allow-empty', '-qm', 'Create fixture base']);
  return { cwd, run, git, put, message };
}

const sites = [
  ['spec', 'skills/brainstorming/reference/spec-finalization.md', 'Spec commit', /spec H1/, /council audit.*verbatim/s],
  ['amendment', 'skills/brainstorming/reference/amendment-surface.md', 'Amendment commit', /one commit per batch from its Amendment commit row/, /retain these audit body lines/],
  ['consent change', 'skills/brainstorming/reference/amendment-surface.md', 'Consent change', /Consent change bookkeeping message/, /one body sentence naming the new consent value/],
  ['plan', 'skills/writing-plans/SKILL.md', 'Plan commit', /compose the plan message from the spec H1 and bound ticket/, /commit -F - --/],
  ['wave', 'skills/subagent-driven-development/SKILL.md', 'Plan task and wave commit', /accepted manifest task headings and held ticket/, /wording: <absolute path>/],
  ['plan citation repair', 'skills/gauntlet-resume/reference/plan-repair.md', 'Plan citation repair', /entire subject verbatim from its Plan citation repair row/, /commit -q -F - --/],
  ['companion spec', 'skills/brainstorming/reference/legs.md', 'Companion spec file commit', /with the home spec subject/, /companion spec commit's wording and ticket rule/],
  ['housekeeping class', 'skills/housekeeping/reference/fix.md', 'Housekeeping class commit', /recipe with the card's title and supplied ticket/, /ticket: <reference or none>/],
];

test('each routine caller binds its word source to the shared reference', async t => {
  for (const [name, path, source, ...patterns] of sites) await t.test(name, () => {
    const text = read(path);
    const links = [...text.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)].map(match => resolve(root, dirname(path), match[1]));
    assert.ok(links.includes(resolve(root, reference)), 'resolving wording citation');
    assert.ok(wording.includes(`| ${source} |`), 'word source exists');
    for (const pattern of patterns) assert.match(text, pattern);
    assert.doesNotMatch(text, /commit[^\n]*-m "(?:plan|amend|grant|resume):/);
  });
  assert.match(wording, /Spec commit \| The spec's H1, shortened to fit: `Add the <topic> spec`/);
  assert.match(wording, /Amendment commit \| `Amend the spec for <first item title, shortened to fit>`, adding ` and <N-1> more`/);
  assert.match(wording, /Plan commit \| `Add the implementation plan for <spec H1, shortened to fit>`/);
  assert.match(wording, /Consent change \| `Change the standing amendment consent`/);
  assert.match(wording, /Plan citation repair \| `Repair <n> plan citations`/);
});

test('the spec commit heredoc preserves audit and body ticket bytes', () => {
  const f = fixture();
  const path = 'doc/specs/cache.md';
  f.put(path, '# Cache profile lookups\n');
  const audit = 'Coverage: 1 of 1\nApplied:\n- cache | Keep `$CACHE` literal | accepted\nDeferred: none\nRejected: none';
  const message = `Add the cache profile lookups spec\n\n${audit}\n\nRefs #241\n`;
  const recipe = spec.match(/```bash\n(git -C <abs worktree path> add -- <spec path>[^\n]*<<'EOF'\n[\s\S]*?\nEOF)\n```/)?.[1];
  assert.ok(recipe, 'production spec heredoc');
  const command = recipe.split('\n')[0]
    .replaceAll('<abs worktree path>', JSON.stringify(f.cwd))
    .replaceAll('<spec path>', JSON.stringify(path)).replaceAll(' [<predecessor path>]', '');
  f.run('bash', ['-c', `${command}\n${message}EOF\n`]);
  assert.equal(f.message('HEAD'), message);
  assert.equal(f.git(['status', '--porcelain']), '');
  assert.match(spec, /followed by any required ticket reference; never alter the audit labels, cluster lines, or counts/);
});

test('amendment body fixtures keep all audit records and the quoted grant on stdin', async t => {
  assert.ok(amendment.includes('- <handle> | <title> | <what> | <auto-apply | accepted | alt-n | custom(<effect>) | granted> | <reviewer line or reason> | <evidence>'));
  assert.match(amendment, /Retain this audit body for ledger batches too/);
  for (const [name, title, kinds] of [
    ['single item', 'Cache lifetime', ['granted']],
    ['several items', 'Cache lifetime and 1 more', ['auto-apply', 'accepted']],
    ['no applied item', 'Cache lifetime', ['custom(follow-up)']],
  ]) await t.test(name, () => {
    const f = fixture();
    const audit = kinds.map((kind, index) => `- cache${index} | Cache lifetime | Keep the measured lifetime | ${kind} | retained reason | literal \`$CACHE\``).join('\n');
    const message = `Amend the spec for ${title}\n\n${audit}\n"auto-apply amends"\n\nRefs #241\n`;
    // The amendment contract specifies audit prose, not an executable composer.
    f.git(['commit', '--allow-empty', '-q', '-F', '-'], message);
    assert.equal(f.message('HEAD'), message);
    assert.equal(f.git(['status', '--porcelain']), '');
  });
});

test('saved message examples cover routine word sources without replaying their workflows', async t => {
  for (const [target, sample, patterns] of [
    ['brainstorming', 'spec-and-amendment-subjects', [/Add the [Pp]rofile caching spec/, /Change the standing amendment consent/, /Amend the spec for [Cc]ache lifetime and 1 more/, /Coverage: 1 of 1\n\s*Applied:/]],
    ['writing-plans', 'plan-commit-wording', [/Add the implementation plan for [Cc]ache profile lookups/]],
    ['subagent-driven-development', 'wave-commit-wording', [/Add the implementation plan for [Cc]ache profile lookups/, /Cache profile lookups and invalidate stale (?:profile cache|cache entries)/]],
    ['housekeeping', 'commit-subject', [/Replace deprecated assertions/]],
  ]) await t.test(`${target}/${sample}`, () => {
    const outputs = Object.values(JSON.parse(read(`eval/${target}/results/${sample}/candidate.json`)).outputs);
    assert.ok(outputs.length > 0, 'saved examples exist, not a current model pass');
    for (const output of outputs) {
      assert.equal(output.status, 'ok');
      for (const pattern of patterns) assert.match(output.text, pattern);
      assert.ok(output.text.includes('Refs #241'));
    }
  });
});

test('housekeeping fold keeps the original raw message, parents and pre-fold tree', async t => {
  const reset = housekeeping.match(/run `(git reset --soft <commit>)`, then `(git commit --amend[^`]+)`/)?.slice(1);
  assert.ok(reset, 'production fold commands');
  assert.match(housekeeping, /its message to equal `commit`'s/);
  for (const [name, message] of [
    ['plain message', 'Cache profile lookups\n\nCache entries expire after one hour.\n'],
    ['audit and trailers', 'Cache profile lookups\n\nKeep `$CACHE` literal.\n\nCo-authored-by: Fixture <fixture@example.invalid>\n'],
    ['verbatim whitespace', 'Cache profile lookups\n\nKeep trailing spaces.  \n\n\n'],
  ]) await t.test(name, () => {
    const f = fixture();
    f.put('cache.txt', 'original\n');
    f.git(['add', '--', 'cache.txt']);
    f.git(['commit', '-q', '--cleanup=verbatim', '-F', '-'], message);
    const original = f.git(['rev-parse', 'HEAD']).trim();
    const originalMessage = f.message(original);
    const parents = f.git(['show', '-s', '--format=%P', original]);
    f.put('cache.txt', 'kept class\n');
    f.git(['add', '--', 'cache.txt']);
    f.git(['commit', '-qm', 'Replace deprecated assertions']);
    const tree = f.git(['rev-parse', 'HEAD^{tree}']);
    // Start at the admitted pre-fold checkpoint; no helpers, review, fetch or push.
    for (const command of reset) f.run('bash', ['-c', command.replace('<commit>', original)]);
    assert.equal(f.message('HEAD'), originalMessage);
    assert.equal(f.git(['show', '-s', '--format=%P', 'HEAD']), parents);
    assert.equal(f.git(['rev-parse', 'HEAD^{tree}']), tree);
    assert.equal(f.git(['status', '--porcelain', '--untracked-files=normal']), '');
  });
});
