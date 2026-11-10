import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const batch = readFileSync(new URL("skills/gatekeep-pr/reference/batch.md", root), "utf8");
const sample = new URL("eval/gatekeep-pr/samples/batch-post-menu/", root);

test("set post menus reserve shared cleanup for the last merged PR and retire after one pick", () => {
  assert.match(batch, /copy the child's standing sentence unchanged/);
  assert.match(batch, /one post menu per merged PR, each in its own message/);
  assert.match(batch, /Each post-menu message starts with `gauntlet: gate=gatekeep-pr\/own-merge recommended=1`/);
  assert.match(batch, /summary in a separate message/);
  assert.match(batch, /no PR.*shared.*last merged PR.*row 1/s);
  assert.match(batch, /picked earlier.*runs then.*omit it from every later menu/s);
  assert.match(batch, /shared item.*at most once.*set/s);
  assert.match(batch, /all selected post steps finish.*retire.*no re-render/s);
  assert.match(batch, /per-PR not-run sentences.*final message/s);
  assert.doesNotMatch(batch, /Cleanup does not retire|re-render with cleanup gone|post\/evidence\/stop rows retained|decision-menu\.md/);
});

test("saved batch-post-menu replays satisfy every set-scoped post fact", () => {
  const facts = [...readFileSync(new URL("expected.md", sample), "utf8").matchAll(/^- ([\w-]+): judged:/gm)].map((match) => match[1]);
  assert.equal(facts.length, 6);
  const candidate = JSON.parse(readFileSync(new URL("eval/gatekeep-pr/results/batch-post-menu/candidate.json", root), "utf8"));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, "ok", model);
    for (const id of facts) {
      assert.equal(candidate.judge[model].facts[id]?.after, "holds", `${model}: ${id}`);
    }
    for (const marker of ["gauntlet: gate=gatekeep-pr/own-merge recommended=1", "gauntlet: retired #12", "gauntlet: retired #15", "gauntlet: done retired"]) {
      assert.ok(output.text.includes(marker), `${model}: ${marker}`);
    }
  }
});
