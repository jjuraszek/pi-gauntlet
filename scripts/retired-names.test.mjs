import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { retiredNames, lintRetiredNames } from "./gauntlet-tree-lint.mjs";

test("retired-names checks shipped text, executable contracts and eval inputs, not saved evidence", (t) => {
  const root = mkdtempSync(join(tmpdir(), "gauntlet-names-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const { steps, entry, overrides } = retiredNames;
  const samples = [
    ["skills/gauntlet/plan/plan.md", `/skill:${entry}`],
    ["agents/reviewer.md", `skills/${entry}/SKILL.md`],
    ["extensions/tracker.ts", `gauntlet: gate=${entry}/the`],
    ["bin/example.mjs", overrides],
    ["src/bins/example.mjs", steps[0]],
    ["scripts/example.test.mjs", steps[1]],
    ["tests/names.py", steps[2]],
    ["README.md", `Read \`## ${entry}\`. `],
    ["AGENTS.md", steps[3]],
    [".pi/gauntlet.md", `# ${entry}`],
    ["doc/nested/guide.md", steps[4]],
    ["eval/run.mjs", steps[5]],
    ["eval/example/target.json", steps[6]],
    ["eval/example/replay.md", steps[7]],
    ["eval/example/samples/input/fixture/instructions.md", steps[8]],
    ["eval/example/samples/input/expected.md", steps[9]],
    ["eval/example/samples/other/case.md", steps[10]],
  ];
  for (const [file, text] of [
    ...samples,
    ["skills/gauntlet/SKILL.md", `Start fresh only on explicit prose requesting ${entry}/the gauntlet, or a human-selected handoff.`],
    ...[
      "CHANGELOG.md", "doc/specs/archived.md", "doc/plans/completed.md", "eval/example/results/input/transcript.md", "eval/example/report.md",
    ].map(file => [file, steps[0]]),
  ]) {
    mkdirSync(join(root, dirname(file)), { recursive: true });
    writeFileSync(join(root, file), text);
  }
  mkdirSync(join(root, "eval", steps[10]));
  const hits = lintRetiredNames(root);
  for (const [file] of samples) assert.ok(hits.some(hit => hit.startsWith(`${file}:`)), file);
  assert.ok(hits.includes(`eval/${steps[10]}: retired target name`));
  assert.equal(hits.length, samples.length + 1);
});
