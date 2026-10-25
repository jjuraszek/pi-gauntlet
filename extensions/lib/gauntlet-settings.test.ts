import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mergeGauntlet,
  resolveSpecCouncil,
  resolveLoopEngine,
  resolveClosureReview,
  resolveEscalationLoop,
  resolvePhaseModels,
  mainLoopModel,
  resolveFlowGuards,
  planDirsFor,
  resolveVerifyBeforeShip,
  resolveTelemetry,
  DEFAULT_TELEMETRY_DIR,
  DEFAULT_TELEMETRY_BUCKETS,
  DEFAULT_TEST_COMMANDS,
  buildTestCmdRegex,
  settingsErrorWarning,
  type PiGauntlet,
} from "./gauntlet-settings.ts";

test("loopEngine resolves defaults, integers, clamps, and malformed values", () => {
  for (const [raw, expected, warns] of [[undefined, 30, false], [7, 7, false], [0, 1, false], [-3, 1, false], [1.5, 30, true], ["5", 30, true]] as const) {
    const result = resolveLoopEngine({ loopEngine: { maxIterations: raw } });
    assert.equal(result.maxIterations, expected);
    assert.equal(Boolean(result.warning), warns);
  }
  assert.deepEqual(resolveLoopEngine({}), { maxIterations: 30, warning: undefined });
});

const CUSTOM_TEST_COMMANDS = ["make ci", "pytest"];

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

test("mergeGauntlet: repo escalationLoop replaces preset whole-object", () => {
  const preset = { escalationLoop: { implModel: "p/preset:high" }, closureReview: { model: "m" } };
  const repo = { escalationLoop: {} };
  const merged = mergeGauntlet(preset, repo);
  assert.deepEqual(merged.escalationLoop, {});
  assert.deepEqual(merged.closureReview, { model: "m" });
});

test("escalationLoop: absent/empty/null/non-string -> mainLoop", () => {
  const main = "p/main:medium";
  assert.equal(resolveEscalationLoop({}, main).implModel, main);
  assert.equal(resolveEscalationLoop({ escalationLoop: {} }, main).implModel, main);
  assert.equal(resolveEscalationLoop({ escalationLoop: { implModel: "" } }, main).implModel, main);
  assert.equal(resolveEscalationLoop({ escalationLoop: { implModel: null } }, main).implModel, main);
  assert.equal(resolveEscalationLoop({ escalationLoop: { implModel: 42 } }, main).implModel, main);
});

test("escalationLoop: non-empty string wins, trimmed; undefined mainLoop passes through", () => {
  assert.equal(
    resolveEscalationLoop({ escalationLoop: { implModel: " p/x:high " } }, "p/main:medium").implModel,
    "p/x:high",
  );
  assert.equal(resolveEscalationLoop({}, undefined).implModel, undefined);
});

test("phaseModels: absent -> empty map, no warning", () => {
  assert.deepEqual(resolvePhaseModels({}), { phaseModels: {}, warning: undefined });
  assert.deepEqual(resolvePhaseModels({ phaseModels: {} }), { phaseModels: {}, warning: undefined });
});

test("phaseModels: non-empty strings kept trimmed; other present values dropped with a warning naming the phase", () => {
  const r = resolvePhaseModels({ phaseModels: { plan: " p/m:low ", implement: "p/m", verify: 7, ship: "" } } as PiGauntlet);
  assert.deepEqual(r.phaseModels, { plan: "p/m:low", implement: "p/m" });
  assert.equal(
    r.warning,
    'piGauntlet.phaseModels.verify must be a "provider/id" or "provider/id:level" string; piGauntlet.phaseModels.ship must be a "provider/id" or "provider/id:level" string',
  );
});

test("phaseModels: unknown keys are ignored; brainstorm is not a phase key", () => {
  const r = resolvePhaseModels({ phaseModels: { brainstorm: "p/m", implement: "p/m" } } as PiGauntlet);
  assert.deepEqual(r.phaseModels, { implement: "p/m" });
  assert.equal(r.warning, undefined);
});

test("mergeGauntlet: repo phaseModels replaces preset whole-object", () => {
  const g = mergeGauntlet({ phaseModels: { plan: "a/b", implement: "a/b" } }, { phaseModels: { verify: "c/d" } });
  assert.deepEqual(g.phaseModels, { verify: "c/d" });
});

test("mainLoopModel: always suffixed; unset -> off, max -> xhigh, recognised pass through", () => {
  const m = { provider: "p", id: "id" };
  assert.equal(mainLoopModel(m, undefined), "p/id:off");
  assert.equal(mainLoopModel(m, "off"), "p/id:off");
  assert.equal(mainLoopModel(m, "medium"), "p/id:medium");
  assert.equal(mainLoopModel(m, "xhigh"), "p/id:xhigh");
  assert.equal(mainLoopModel(m, "max"), "p/id:xhigh");
  assert.equal(mainLoopModel(undefined, "medium"), undefined);
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

test("closureReview: maxFixRounds default 5, <0 -> 0, non-int -> 5", () => {
  assert.equal(resolveClosureReview({}).maxFixRounds, 5);
  assert.equal(resolveClosureReview({ closureReview: { maxFixRounds: 3 } }).maxFixRounds, 3);
  assert.equal(resolveClosureReview({ closureReview: { maxFixRounds: 0 } }).maxFixRounds, 0);
  assert.equal(resolveClosureReview({ closureReview: { maxFixRounds: -3 } }).maxFixRounds, 0);
  assert.equal(resolveClosureReview({ closureReview: { maxFixRounds: 1.5 } }).maxFixRounds, 5);
});

test("flowGuards: defaults + overrides + normalization", () => {
  assert.deepEqual(resolveFlowGuards({}), { enforce: true, specDirs: ["doc/specs", "docs/specs"] });
  assert.equal(resolveFlowGuards({ flowGuards: { enforce: false } }).enforce, false);
  assert.deepEqual(resolveFlowGuards({ flowGuards: { specDirs: ["a/b"] } }).specDirs, ["a/b"]);
  assert.deepEqual(resolveFlowGuards({ flowGuards: { specDirs: [] } }).specDirs, ["doc/specs", "docs/specs"]);
  assert.deepEqual(resolveFlowGuards({ flowGuards: { specDirs: "x" } }).specDirs, ["doc/specs", "docs/specs"]);
  assert.deepEqual(resolveFlowGuards({ flowGuards: { specDirs: ["docs/specs/", "./design/specs"] } }).specDirs, ["docs/specs", "design/specs"]);
});

test("planDirsFor: sibling plans dir per spec dir, deduplicated", () => {
  assert.deepEqual(planDirsFor(["doc/specs", "design/specs"]), ["doc/plans", "design/plans"]);
  assert.deepEqual(planDirsFor(["doc/specs", "docs/specs"]), ["doc/plans", "docs/plans"]);
  assert.deepEqual(planDirsFor(["specs"]), ["plans"]);
  assert.deepEqual(planDirsFor(["a/plans", "a/specs"]), ["a/plans"]);
});

test("settingsErrorWarning: includes prefix and joined errors", () => {
  const w = settingsErrorWarning(["bad json", "missing field"]);
  assert.match(w, /gauntlet settings load error \(using defaults\)/);
  assert.ok(w.includes("bad json; missing field"));
});

test("verifyBeforeShip: default vs override", () => {
  const d = resolveVerifyBeforeShip({}, CUSTOM_TEST_COMMANDS);
  assert.deepEqual(d.testCommands, CUSTOM_TEST_COMMANDS);
  assert.equal(d.warningReference, undefined);
  const o = resolveVerifyBeforeShip(
    { verifyBeforeShip: { testCommands: ["x"], warningReference: "doc/t.md" } },
    CUSTOM_TEST_COMMANDS,
  );
  assert.deepEqual(o.testCommands, ["x"]);
  assert.equal(o.warningReference, "doc/t.md");
});

test("telemetry: absent block -> enabled, default dir, default buckets, no warning", () => {
  const r = resolveTelemetry({});
  assert.equal(r.enabled, true);
  assert.equal(r.dir, DEFAULT_TELEMETRY_DIR);
  assert.equal(r.dir, ".pi/gauntlet/telemetry");
  assert.deepEqual(r.buckets, DEFAULT_TELEMETRY_BUCKETS);
  assert.equal(r.warning, undefined);
});

test("telemetry: enabled false is the only way to disable", () => {
  assert.equal(resolveTelemetry({ telemetry: { enabled: false } }).enabled, false);
  assert.equal(resolveTelemetry({ telemetry: { enabled: "no" } }).enabled, true);
  assert.equal(resolveTelemetry({ telemetry: { enabled: 0 } }).enabled, true);
});

test("telemetry: dir accepts a non-empty relative path, otherwise default + warning", () => {
  assert.equal(resolveTelemetry({ telemetry: { dir: "telemetry/" } }).dir, "telemetry");
  assert.equal(resolveTelemetry({ telemetry: { dir: "a/../b" } }).dir, "b");
  for (const bad of [
    "",
    "   ",
    5,
    null,
    ["x"],
    "/abs/dir",
    "C:\\outside",
    "C:/outside",
    "C:outside",
    "C:",
    "\\\\server\\share",
    "../outside",
    "a/../../outside",
    "..",
  ]) {
    const r = resolveTelemetry({ telemetry: { dir: bad } });
    assert.equal(r.dir, DEFAULT_TELEMETRY_DIR);
    assert.match(r.warning ?? "", /telemetry\.dir/);
  }
});

test("telemetry: buckets replaces the default list wholesale, preserving key order", () => {
  const r = resolveTelemetry({ telemetry: { buckets: { spec: ["doc/specs/**"], test: ["**/*.test.ts"] } } });
  assert.deepEqual(r.buckets, [
    ["spec", ["doc/specs/**"]],
    ["test", ["**/*.test.ts"]],
  ]);
  assert.equal(r.warning, undefined);
});

test("telemetry: malformed buckets -> default + warning", () => {
  for (const bad of [[], "x", { test: "**/*.ts" }, { test: [""] }, { test: [1] }, {}]) {
    const r = resolveTelemetry({ telemetry: { buckets: bad } });
    assert.deepEqual(r.buckets, DEFAULT_TELEMETRY_BUCKETS);
    assert.match(r.warning ?? "", /telemetry\.buckets/);
  }
});

test("telemetry: dir and buckets warnings join with '; '", () => {
  const r = resolveTelemetry({ telemetry: { dir: 1, buckets: 2 } });
  assert.match(r.warning ?? "", /telemetry\.dir.*; .*telemetry\.buckets/);
});

test("DEFAULT_TEST_COMMANDS + buildTestCmdRegex match the documented entrypoints", () => {
  const re = buildTestCmdRegex(DEFAULT_TEST_COMMANDS);
  for (const cmd of ["make ci", "make test", "npm test", "npm run test", "pnpm test", "yarn test", "pytest -q", "rspec", "cargo test", "go test ./..."])
    assert.ok(re.test(cmd), cmd);
  assert.equal(re.test("make test-smoke"), false);
  assert.equal(re.test("ls"), false);
});
