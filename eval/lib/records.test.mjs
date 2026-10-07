import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { cellReusable, baselineFresh, judgmentCurrent, promote, readRecord, writeRecord } from "./records.mjs";

const id = { skillSha: "s", inputSha: "i", kind: "text", assembly: "concat", thinking: "medium" };
const rec = (over = {}) => ({ sample: "x", arm: "baseline", kind: "text", assembly: "concat", skillSha: "s", inputSha: "i", repoSha: "r",
  models: { replay: ["m1", "m2"], judge: "j", thinking: "medium" },
  outputs: { m1: { status: "ok", text: "a" }, m2: { status: "ok", text: "b" } }, ...over });

test("cell reuse needs every identity field and status ok", () => {
  assert.equal(cellReusable(rec(), "m1", id), true);
  assert.equal(cellReusable(rec({ skillSha: "z" }), "m1", id), false);
  assert.equal(cellReusable(rec({ inputSha: "z" }), "m1", id), false);
  assert.equal(cellReusable(rec({ kind: "edit" }), "m1", id), false);
  assert.equal(cellReusable(rec({ assembly: "headed" }), "m1", id), false);
  assert.equal(cellReusable(rec({ models: { replay: ["m1"], judge: "j", thinking: "high" } }), "m1", id), false);
  assert.equal(cellReusable(rec({ models: { replay: ["m2"], judge: "j", thinking: "medium" } }), "m1", id), false);
  assert.equal(cellReusable(rec({ outputs: { m1: { status: "error" } } }), "m1", id), false);
  assert.equal(cellReusable(rec(), "m3", id), false);
  assert.equal(cellReusable(null, "m1", id), false);
});
test("baseline fresh only when all cells reusable", () => {
  assert.deepEqual(baselineFresh(rec(), ["m1", "m2"], id), { fresh: true, stale: [] });
  assert.deepEqual(baselineFresh(rec({ outputs: { m1: { status: "ok" }, m2: { status: "error" } } }), ["m1", "m2"], id), { fresh: false, stale: ["m2"] });
});
test("judgment currency", () => {
  const j = { factsSha: "f", judgePromptSha: "p", intentSha: "n", baselineOutputSha: "b", candidateOutputSha: "c" };
  assert.equal(judgmentCurrent(j, j), true);
  for (const key of Object.keys(j)) assert.equal(judgmentCurrent({ ...j, [key]: "z" }, j), false, key);
  assert.equal(judgmentCurrent(undefined, j), false);
});
test("promotion strips judge and relabels arm", () => {
  const candidate = rec({ arm: "candidate", judge: { m1: {} } });
  const p = promote(candidate);
  assert.deepEqual(p, rec());
  assert.equal("judge" in p, false);
  assert.equal(candidate.arm, "candidate");
  assert.deepEqual(candidate.judge, { m1: {} });
});
test("read/write round trip", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "rec-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeRecord(dir, "x", "baseline", rec());
  assert.ok(existsSync(join(dir, "x", "baseline.json")));
  assert.deepEqual(readRecord(dir, "x", "baseline"), rec());
  assert.equal(readRecord(dir, "x", "candidate"), null);
  assert.equal(readFileSync(join(dir, "x", "baseline.json"), "utf8"), JSON.stringify(rec(), null, 2) + "\n");
  const newest = rec({ skillSha: "new" });
  writeRecord(dir, "x", "baseline", newest);
  assert.deepEqual(readRecord(dir, "x", "baseline"), newest);
  const candidate = rec({ arm: "candidate" });
  writeRecord(dir, "x", "candidate", candidate);
  assert.deepEqual(readRecord(dir, "x", "candidate"), candidate);
});
