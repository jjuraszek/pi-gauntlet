import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mergeGauntlet,
  resolveSpecCouncil,
  resolveClosureReview,
  resolveFlowGuards,
  resolveVerifyBeforeShip,
  settingsErrorWarning,
  type PiGauntlet,
} from "./gauntlet-settings.ts";

const DEFAULT_TEST_COMMANDS = ["make ci", "pytest"];

test("mergeGauntlet: repo key replaces preset key whole-object", () => {
  const preset = { specCouncil: { members: ["a"], chair: "c" }, closureReview: { model: "m" } };
  const repo = { specCouncil: { members: ["b"] } };
  const merged = mergeGauntlet(preset, repo);
  assert.deepEqual(merged.specCouncil, { members: ["b"] });
  assert.deepEqual(merged.closureReview, { model: "m" });
});

test("mergeGauntlet: undefined layers -> {}", () => {
  assert.deepEqual(mergeGauntlet(undefined, undefined), {});
});

test("specCouncil: non-empty string array -> council", () => {
  const r = resolveSpecCouncil({ specCouncil: { members: ["p/m1", " p/m2 "], chair: "p/c" } });
  assert.equal(r.verdict, "council");
  assert.deepEqual(r.members, ["p/m1", "p/m2"]);
  assert.equal(r.chair, "p/c");
  assert.equal(r.malformed, false);
  assert.equal(r.warning, undefined);
});

test("specCouncil: absent -> worker, not malformed", () => {
  const r = resolveSpecCouncil({});
  assert.equal(r.verdict, "worker");
  assert.deepEqual(r.members, []);
  assert.equal(r.malformed, false);
});

test("specCouncil: empty array -> worker, not malformed", () => {
  const r = resolveSpecCouncil({ specCouncil: { members: [] } });
  assert.equal(r.verdict, "worker");
  assert.equal(r.malformed, false);
});

test("specCouncil: non-array members -> worker + malformed + warning", () => {
  const r = resolveSpecCouncil({ specCouncil: { members: "p/m" as unknown as string[] } });
  assert.equal(r.verdict, "worker");
  assert.equal(r.malformed, true);
  assert.ok(r.warning);
});

test("specCouncil: entry not a non-empty string -> worker + malformed", () => {
  const r = resolveSpecCouncil({ specCouncil: { members: ["p/m", ""] } });
  assert.equal(r.verdict, "worker");
  assert.equal(r.malformed, true);
});

test("specCouncil: chair echoed in worker path", () => {
  const r = resolveSpecCouncil({ specCouncil: { members: [], chair: "p/c" } });
  assert.equal(r.verdict, "worker");
  assert.equal(r.chair, "p/c");
});

test("specCouncil: non-string chair does NOT downgrade a valid members verdict", () => {
  const r = resolveSpecCouncil({ specCouncil: { members: ["p/m"], chair: 5 as unknown as string } });
  assert.equal(r.verdict, "council");
  assert.equal(r.chair, undefined);
  assert.equal(r.malformed, true);
  assert.ok(r.warning);
});

test("closureReview: model present/non-string/absent", () => {
  assert.equal(resolveClosureReview({ closureReview: { model: " m " } }).model, "m");
  assert.equal(resolveClosureReview({ closureReview: { model: 5 as unknown as string } }).model, undefined);
  assert.equal(resolveClosureReview({}).model, undefined);
});

test("closureReview: enforce default true; false only when explicitly false", () => {
  assert.equal(resolveClosureReview({}).enforce, true);
  assert.equal(resolveClosureReview({ closureReview: { enforce: false } }).enforce, false);
  assert.equal(resolveClosureReview({ closureReview: { enforce: true } }).enforce, true);
});

test("closureReview: maxFixRounds default 2, <0 -> 0, non-int -> 2", () => {
  assert.equal(resolveClosureReview({}).maxFixRounds, 2);
  assert.equal(resolveClosureReview({ closureReview: { maxFixRounds: 5 } }).maxFixRounds, 5);
  assert.equal(resolveClosureReview({ closureReview: { maxFixRounds: -3 } }).maxFixRounds, 0);
  assert.equal(resolveClosureReview({ closureReview: { maxFixRounds: 1.5 } }).maxFixRounds, 2);
});

test("flowGuards: defaults + overrides", () => {
  assert.deepEqual(resolveFlowGuards({}), { enforce: true, specDirs: ["doc/specs"] });
  assert.equal(resolveFlowGuards({ flowGuards: { enforce: false } }).enforce, false);
  assert.deepEqual(resolveFlowGuards({ flowGuards: { specDirs: ["a/b"] } }).specDirs, ["a/b"]);
  assert.deepEqual(resolveFlowGuards({ flowGuards: { specDirs: [] } }).specDirs, ["doc/specs"]);
});

test("settingsErrorWarning: includes prefix and joined errors", () => {
  const w = settingsErrorWarning(["bad json", "missing field"]);
  assert.match(w, /gauntlet settings load error \(using defaults\)/);
  assert.ok(w.includes("bad json; missing field"));
});

test("verifyBeforeShip: default vs override", () => {
  const d = resolveVerifyBeforeShip({}, DEFAULT_TEST_COMMANDS);
  assert.deepEqual(d.testCommands, DEFAULT_TEST_COMMANDS);
  assert.equal(d.warningReference, undefined);
  const o = resolveVerifyBeforeShip(
    { verifyBeforeShip: { testCommands: ["x"], warningReference: "doc/t.md" } },
    DEFAULT_TEST_COMMANDS,
  );
  assert.deepEqual(o.testCommands, ["x"]);
  assert.equal(o.warningReference, "doc/t.md");
});
