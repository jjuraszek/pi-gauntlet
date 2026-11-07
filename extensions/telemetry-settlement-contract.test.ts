import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { settlementItems } from "./lib/telemetry-leg.ts";
import { MODELS } from "../eval/lib/models.mjs";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const head = "abc123456789abcdef0123456789abcdef01234567";
const otherHead = "def123456789abcdef0123456789abcdef01234567";

for (const [skill, items] of [
  ["shape-ticket", [{ kind: "ticket", key: "#83", outcome: "written" }]],
  ["gatekeep-pr", [
    { kind: "pr", key: `#31@${head}`, ticket: "#12", outcome: "merged" },
    { kind: "pr", key: `#32@${otherHead}`, outcome: "stuck - CI pending past 15 minutes" },
  ]],
  ["check-delivery", [{ kind: "ticket", key: "#52", outcome: "delivered" }]],
] as const) {
  test(`${skill} selected eval replies parse into settled item identities`, () => {
    const result = JSON.parse(read(`eval/${skill}/results/per-ref-settlement/candidate.json`));
    for (const model of MODELS.replay) {
      const output = result.outputs[model];
      assert.equal(output?.status, "ok", output?.error ?? model);
      assert.match(output.text, /^gauntlet: (done|stuck)\b/);
      assert.equal(output.text.match(/^gauntlet: (done|stuck)\b/gm)?.length, 1);
      assert.deepEqual(settlementItems(skill, output.text), items, model);
      assert.ok(Object.values(output.mechanical).every((value) => value === "holds"), model);
      assert.ok(["improved", "unchanged"].includes(result.judge[model]?.verdict), model);
    }
  });
}

test("skill owners keep terminal rows after writes and cleanup", () => {
  const shape = read("skills/shape-ticket/reference/repo-audit.md");
  assert.match(shape, /actual ref returned by the write/);
  assert.doesNotMatch(shape, /use the drafted title for create/);
  assert.match(shape, /after every selected write/);
  const delivery = read("skills/check-delivery/SKILL.md");
  assert.match(delivery, /<ref>: <outcome>/);
  assert.match(delivery, /already recorded/);
  const gate = read("skills/gatekeep-pr/reference/post-selection-loop.md");
  assert.ok(gate.includes("#<N>@<head sha>: <outcome>"));
  assert.match(gate, /full assessed `headRefOid`/);
  assert.match(gate, /cleanup pick is answered/);
  assert.match(read("skills/gatekeep-pr/reference/batch.md"), /gauntlet: retired #<N> - <reason>/);
  assert.match(read("skills/gatekeep-pr/reference/cleanup.md"), /### Settlement rows/);
  const ci = read("scripts/ci.mjs");
  assert.ok(ci.includes('includes("#<N>@<head sha>: <outcome>")'));
  assert.ok(ci.includes("gatekeep-pr must not mention telemetry"));
  for (const file of readdirSync(new URL("../skills/gatekeep-pr/", import.meta.url), { recursive: true })) {
    if (file.endsWith(".md")) assert.doesNotMatch(read(`skills/gatekeep-pr/${file}`), /telemetry/i);
  }
});

test("configuration names the settlement grammar and per-skill tokens", () => {
  const docs = read("doc/configuration.md");
  assert.ok(docs.includes("<ref>: <outcome>[ (<ticket ref>)]"));
  for (const tokens of [
    ["shape-ticket", "written", "closed", "close failed (<operation>: <reason>)", "close by hand", "dropped", "declined", "stopped", "no-op", "unfetched"],
    ["gatekeep-pr", "approved", "merged", "closed-pr", "final", "merge-queued", "stuck - <reason>"],
    ["check-delivery", "delivered", "manual", "declined", "already recorded", "skipped", "failed - <reason>"],
  ]) {
    const row = docs.split("\n").find((line) => line.startsWith(`| ${tokens[0]} |`));
    assert.ok(row, tokens[0]);
    for (const token of tokens.slice(1)) assert.ok(row.includes(`\`${token}\``), token);
  }
});
