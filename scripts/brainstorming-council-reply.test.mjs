import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sha256 } from '../eval/lib/checks.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sample = 'eval/spec-gate/samples/row-3-reply';

test('council explanation reuses the gate snapshot without new settings or context reads', () => {
  const gate = read('skills/gauntlet/brainstorm/spec-finalization.md');
  const reply = gate.slice(gate.indexOf('On `3` or its label alone:'), gate.indexOf('A gate-round recommit'));
  for (const token of [
    'git -C <abs worktree path> show -s --format=%b HEAD',
    'print the audit verbatim', 'no summarizer re-dispatch',
    'nothing in the spec or the commit changes', 'a reply carrying `3` never grants',
    'flag lines, tag, marker, and `Recommended:` line verbatim',
    'no new status or settings call',
  ]) assert.ok(reply.includes(token), token);
});

test('saved council explanation preserves the audit and four-row recommendation on both models', () => {
  const candidate = JSON.parse(read('eval/spec-gate/results/row-3-reply/candidate.json'));
  const factsSha = sha256(read(`${sample}/expected.md`));
  const audit = read(`${sample}/case.md`).split('## Spec commit\n\n')[1].split('\n\n## Spec acceptance criteria')[0];
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, factsSha, `${model}: current facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged output`);
    for (const id of ['f1', 'f2', 'f3', 'f4', 'f5', 'reuse']) {
      assert.equal(judged.facts[id]?.after, 'holds', `${model}/${id}`);
    }
    const markers = [...output.text.matchAll(/^gauntlet: gate=brainstorm\/user-review-gate recommended=(\d+)$/gm)];
    assert.equal(markers.length, 2, `${model}: initial and re-presented gate`);
    assert.equal(markers[0][0], markers[1][0], `${model}: identical marker`);
    const menus = markers.map(({ index }) => {
      const lines = output.text.slice(index).split('\n');
      const start = lines.findIndex((line) => /^1 - /.test(line));
      const end = lines.findIndex((line) => /^Recommended: /.test(line));
      assert.ok(start >= 0 && end > start, `${model}: complete menu`);
      return lines.slice(start, end + 1).join('\n');
    });
    assert.equal(menus[0], menus[1], `${model}: rows, flags, tag and reason reused verbatim`);
    assert.deepEqual([...menus[1].matchAll(/^(\d+) - /gm)].map((match) => match[1]), ['1', '2', '3', '4']);
    assert.equal((menus[1].match(/\[recommended\]/g) ?? []).length, 1);
    assert.ok(output.text.slice(markers[0].index, markers[1].index).includes(audit), `${model}: audit printed verbatim before the re-presented gate`);
  }
});
