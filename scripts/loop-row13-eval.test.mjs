import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { sha256 } from '../eval/lib/checks.mjs';
import { scanTree } from '../eval/lib/hygiene.mjs';
import { intentBody } from '../eval/lib/intent.mjs';
import { lintAll } from '../eval/lib/lint.mjs';
import { MODELS } from '../eval/lib/models.mjs';
import { baselineFresh, cellReusable, judgmentCurrent, readRecord } from '../eval/lib/records.mjs';
import { assemble, baseReader, inputSha, parseCase, treeReader } from '../eval/lib/replay.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const evalRoot = join(root, 'eval');
const judgePromptSha = sha256(readFileSync(join(evalRoot, 'judge.md'), 'utf8'));

const CORE_SAMPLES = [
  ['loop-implementation', 'interrupted-child-redispatch'],
  ['loop-implementation', 'seed-interrupted-count'],
  ['loop-implementation', 'companion-interrupted-recovery'],
  ['loop-implementation', 'verify-repair-count'],
  ['loop-implementation', 'unreachable-cut'],
  ['loop-implementer', 'silence-bound-and-unreachable'],
  ['loop-implementer', 'seed-recovery'],
  ['loop-implementer', 'seed-evidence-carry'],
  ['gauntlet-resume', 'interrupted-ownership'],
  ['brainstorming', 'design-names-paid-actions'],
];

const MIGRATED_SAMPLES = [
  ['loop-implementation', 'allowance-10-escalate-after'],
  ['loop-implementation', 'commit-boundary'],
  ['loop-implementation', 'exit-repair-capability'],
  ['loop-implementation', 'exit-verification-escalates'],
  ['loop-implementation', 'human-stop-counts'],
  ['loop-implementation', 'multi-row-return'],
  ['loop-implementation', 'row-budget-actions'],
  ['loop-implementation', 'seed-retry'],
  ['loop-implementation', 'spent-row-escalation'],
  ['loop-implementation', 'tracker-boundary'],
  ['loop-implementation', 'legacy-cap'],
  ['loop-implementation', 'gate-line-first'],
  ['gauntlet-resume', 'migration-recovery'],
  ['gauntlet-resume', 'ledger-tracker-recovery'],
];

const ALL_ROW13_SAMPLES = [...CORE_SAMPLES, ...MIGRATED_SAMPLES];

test('row 13 eval prerequisites and structural/hygiene checks pass', () => {
  assert.equal(MODELS.judge, 'anthropic-fable/claude-fable-5-2');
  const lintErrors = Object.entries(lintAll(evalRoot)).filter(([, errs]) => errs.length > 0);
  assert.deepEqual(lintErrors, []);
  const denylists = {};
  for (const name of readdirSync(evalRoot)) {
    const tf = join(evalRoot, name, 'target.json');
    if (existsSync(tf) && statSync(tf).isFile()) {
      denylists[name] = JSON.parse(readFileSync(tf, 'utf8')).denylist ?? [];
    }
  }
  assert.deepEqual(scanTree(evalRoot, { denylists }), []);
});

test('all 24 selected row 13 eval samples have fresh baselines, reusable candidates, and passing judgments', () => {
  const baseRef = execFileSync('git', ['-C', root, 'merge-base', 'HEAD', 'origin/main'], { encoding: 'utf8' }).trim();
  const baseRead = baseReader(root, baseRef);
  const treeRead = treeReader(root);

  assert.equal(ALL_ROW13_SAMPLES.length, 24);

  for (const [targetName, sample] of ALL_ROW13_SAMPLES) {
    const targetDir = join(evalRoot, targetName);
    const target = JSON.parse(readFileSync(join(targetDir, 'target.json'), 'utf8'));
    const newPaths = target.skillFiles.filter(f => f.new === true).map(f => f.path);
    const replayText = readFileSync(join(targetDir, 'replay.md'), 'utf8');
    const intentText = readFileSync(join(targetDir, 'intent.md'), 'utf8');
    const intentSha = sha256(intentBody(intentText));
    const sdir = join(targetDir, 'samples', sample);
    const { bundle, drop, text: caseText } = parseCase(readFileSync(join(sdir, 'case.md'), 'utf8'));
    const skillFiles = target.skillFiles.filter(f => !drop.includes(f.path));
    const expectedText = readFileSync(join(sdir, 'expected.md'), 'utf8');
    const fixtureDir = join(sdir, 'fixture');
    const inSha = inputSha(replayText, caseText, bundle, target.kind === 'edit' ? fixtureDir : null);

    const buildSkill = (reader, arm) => {
      const options = { arm, newPaths };
      const parts = skillFiles.map(file => assemble({ ...target, skillFiles: [file] }, reader, [], options));
      if (bundle.length) parts.push(assemble({ ...target, skillFiles: [] }, reader, bundle, options));
      return parts.join('\n');
    };

    const baseSkill = buildSkill(baseRead, 'baseline');
    const candSkill = buildSkill(treeRead, 'candidate');
    const identityFor = skill => ({
      skillSha: sha256(skill),
      inputSha: inSha,
      kind: target.kind,
      assembly: target.assembly ?? 'n/a',
      thinking: MODELS.thinking,
    });

    const resultsDir = join(targetDir, 'results');
    const bRec = readRecord(resultsDir, sample, 'baseline');
    const cRec = readRecord(resultsDir, sample, 'candidate');
    assert.ok(bRec, `${targetName}/${sample}: baseline.json exists`);
    assert.ok(cRec, `${targetName}/${sample}: candidate.json exists`);

    const bf = baselineFresh(bRec, MODELS.replay, identityFor(baseSkill));
    assert.ok(bf.fresh, `${targetName}/${sample}: baseline fresh (stale: ${bf.stale.join(',')})`);

    for (const model of MODELS.replay) {
      assert.ok(
        cellReusable(cRec, model, identityFor(candSkill)),
        `${targetName}/${sample} (${model}): candidate cell reusable`,
      );
      const current = {
        factsSha: sha256(expectedText),
        judgePromptSha,
        intentSha,
        baselineOutputSha: sha256(bRec.outputs[model].text),
        candidateOutputSha: sha256(cRec.outputs[model].text),
      };
      assert.ok(
        judgmentCurrent(cRec.judge?.[model], current),
        `${targetName}/${sample} (${model}): judgment current`,
      );
      const verdict = cRec.judge[model].verdict;
      assert.ok(
        verdict === 'improved' || verdict === 'unchanged',
        `${targetName}/${sample} (${model}): expected improved or unchanged, got ${verdict}`,
      );
    }
  }
});

test('target READMEs record sample-scoped partial coverage for row 13', () => {
  for (const [path, sample] of [
    ['eval/loop-implementation/README.md', 'interrupted-child-redispatch'],
    ['eval/loop-implementer/README.md', 'silence-bound-and-unreachable'],
    ['eval/gauntlet-resume/README.md', 'migration-recovery'],
    ['eval/brainstorming/README.md', 'design-names-paid-actions'],
  ]) {
    const text = readFileSync(join(root, path), 'utf8');
    assert.ok(text.includes(sample), `${path}: ${sample}`);
    assert.match(text, /partial coverage/i, `${path}: partial coverage`);
  }
});
