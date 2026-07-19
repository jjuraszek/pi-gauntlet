import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONTEXT_DRAFT_MARKER,
  checkSubstep,
  closureGateBlocks,
  closureModelGuardApplies,
  flowGuardApplies,
  nextGauntletEntered,
  phaseLabel,
  parseGitCommit,
  resolveRepoDir,
  findMarkerFile,
  markerBlockReason,
  transitionPhaseState,
  markerGuardApplies,
} from "./phase-tracker-helpers.ts";

test("checkSubstep: in_progress -> ok", () => {
  assert.deepEqual(checkSubstep("in_progress"), { ok: true });
});

test("checkSubstep: non-in_progress statuses -> error naming actual status", () => {
  for (const s of ["pending", "complete", "skipped"]) {
    const r = checkSubstep(s);
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.error, new RegExp(s));
  }
});

test("phaseLabel: with and without substep", () => {
  assert.equal(phaseLabel("brainstorm", "gather"), "brainstorm(gather)");
  assert.equal(phaseLabel("brainstorm", undefined), "brainstorm");
});

test("parseGitCommit: plain, -am, chained after &&", () => {
  assert.ok(parseGitCommit('git commit -m "x"'));
  assert.ok(parseGitCommit("git commit -am 'x'"));
  assert.ok(parseGitCommit('git add -A && git commit -m "x"'));
});

test("parseGitCommit: -C path and cd prefix are captured", () => {
  assert.deepEqual(parseGitCommit('git -C /wt commit -m "x"'), { cPath: "/wt", cdPath: undefined });
  assert.deepEqual(parseGitCommit('cd /wt && git commit -m "x"'), { cPath: undefined, cdPath: "/wt" });
});

test("parseGitCommit: non-commit git and non-git -> undefined", () => {
  assert.equal(parseGitCommit("git log --oneline"), undefined);
  assert.equal(parseGitCommit("git commitish"), undefined);
  assert.equal(parseGitCommit('echo "git commit"'), undefined); // statement-start anchor: a quote is not a statement boundary
  assert.equal(parseGitCommit("npm test"), undefined);
});

test("parseGitCommit: -c config flags between git and commit don't bypass the guard", () => {
  assert.deepEqual(parseGitCommit('git -c user.email=x commit -m "y"'), { cPath: undefined, cdPath: undefined });
  assert.deepEqual(parseGitCommit("git -C /wt -c user.email=x commit"), { cPath: "/wt", cdPath: undefined });
});

test("parseGitCommit: commit-graph / commit-tree are not commit", () => {
  assert.equal(parseGitCommit("git commit-graph write"), undefined);
  assert.equal(parseGitCommit("git commit-tree HEAD^{tree}"), undefined);
});

test("parseGitCommit: cd path in subshell (cd /a) captures /a without trailing paren", () => {
  assert.deepEqual(parseGitCommit("(cd /a) && git commit -m x"), { cPath: undefined, cdPath: "/a" });
});

test("parseGitCommit: last cd before the commit wins over an earlier one", () => {
  assert.deepEqual(parseGitCommit("cd /a && cd /b && git commit -m x"), { cPath: undefined, cdPath: "/b" });
});

test("parseGitCommit: cd recognized before non-&& statement separators", () => {
  assert.deepEqual(parseGitCommit("cd /wt; git commit -m x"), { cPath: undefined, cdPath: "/wt" });
  assert.deepEqual(parseGitCommit("cd /wt\ngit commit -m x"), { cPath: undefined, cdPath: "/wt" });
  assert.deepEqual(parseGitCommit("cd /wt || git commit -m x"), { cPath: undefined, cdPath: "/wt" });
});

test("resolveRepoDir: -C wins over cd, cd wins over session cwd, relative -C resolves against cd", () => {
  assert.equal(resolveRepoDir({ cPath: "/b", cdPath: "/a" }, "/s"), "/b");
  assert.equal(resolveRepoDir({ cPath: undefined, cdPath: "/a" }, "/s"), "/a");
  assert.equal(resolveRepoDir({ cPath: undefined, cdPath: undefined }, "/s"), "/s");
  assert.equal(resolveRepoDir({ cPath: "wt", cdPath: "/a" }, "/s"), "/a/wt");
});

test("findMarkerFile: line-1 hit found, quoted-in-body miss, missing dir -> undefined", () => {
  const files: Record<string, string> = {
    "/r/doc/specs/a.md": CONTEXT_DRAFT_MARKER + "\n\nbody",
    "/r/doc/specs/b.md": "# Real spec\n\n`" + CONTEXT_DRAFT_MARKER + "` quoted in body",
  };
  const listFiles = (dir: string) =>
    dir === "/r/doc/specs" ? Object.keys(files) : [];
  const readFirstLine = (f: string) => files[f]?.split("\n", 1)[0];
  assert.equal(findMarkerFile("/r", ["doc/specs"], listFiles, readFirstLine), "/r/doc/specs/a.md");
  delete files["/r/doc/specs/a.md"];
  assert.equal(
    findMarkerFile("/r", ["doc/specs"], (d) => (d === "/r/doc/specs" ? Object.keys(files) : []), readFirstLine),
    undefined,
  );
  assert.equal(findMarkerFile("/r", ["nope"], () => [], readFirstLine), undefined);
});

test("markerBlockReason names the file and the enforce escape hatch", () => {
  const r = markerBlockReason("/r/doc/specs/a.md");
  assert.match(r, /\/r\/doc\/specs\/a\.md/);
  assert.match(r, /flowGuards\.enforce/);
});

test("transitionPhaseState: complete/skipped/pending drop any prior substep", () => {
  for (const status of ["complete", "skipped", "pending"]) {
    const r = transitionPhaseState(status);
    assert.equal(r.status, status);
    assert.ok(!("substep" in r));
  }
});

test("transitionPhaseState: reason propagates when provided", () => {
  assert.deepEqual(transitionPhaseState("skipped", "why"), { status: "skipped", reason: "why" });
});

test("markerGuardApplies: gated by flowGuards.enforce and brainstorm in_progress", () => {
  assert.equal(markerGuardApplies(false, "in_progress"), false);
  assert.equal(markerGuardApplies(true, "in_progress"), true);
  assert.equal(markerGuardApplies(true, "pending"), false);
});

test("nextGauntletEntered: arms only when a start makes brainstorm in_progress", () => {
  assert.equal(nextGauntletEntered(false, "start", "in_progress"), true);
  assert.equal(nextGauntletEntered(true, "start", "in_progress"), true); // re-arm idempotent
});

test("nextGauntletEntered: reset always disarms", () => {
  assert.equal(nextGauntletEntered(true, "reset", "pending"), false);
  assert.equal(nextGauntletEntered(true, "reset", "in_progress"), false);
  assert.equal(nextGauntletEntered(false, "reset", "pending"), false);
});

test("nextGauntletEntered: marker survives downstream actions", () => {
  assert.equal(nextGauntletEntered(true, "start", "complete"), true); // start plan/implement (brainstorm already complete)
  assert.equal(nextGauntletEntered(true, "complete", "complete"), true);
  assert.equal(nextGauntletEntered(true, "substep", "in_progress"), true);
});

test("nextGauntletEntered: a non-brainstorm start never arms a dormant flow", () => {
  assert.equal(nextGauntletEntered(false, "start", "complete"), false); // cold start verify/implement
  assert.equal(nextGauntletEntered(false, "start", "skipped"), false);
  assert.equal(nextGauntletEntered(false, "complete", "pending"), false);
});

test("closureGateBlocks: blocks only for verify + entered + enforce + not-yet-dispatched", () => {
  assert.equal(closureGateBlocks("verify", true, true, false), true);
  assert.equal(closureGateBlocks("verify", false, true, false), false); // incident: not entered -> no block
  assert.equal(closureGateBlocks("verify", true, true, true), false); // already dispatched
  assert.equal(closureGateBlocks("verify", true, false, false), false); // enforce off
  assert.equal(closureGateBlocks("plan", true, true, false), false); // wrong phase
});

test("flowGuardApplies: requires both an active guard phase and an entered flow", () => {
  assert.equal(flowGuardApplies(true, true), true);
  assert.equal(flowGuardApplies(true, false), false); // not entered
  assert.equal(flowGuardApplies(false, true), false); // phase not active
  assert.equal(flowGuardApplies(false, false), false);
});

test("closureModelGuardApplies: requires both an entered flow and closure enforcement", () => {
  assert.equal(closureModelGuardApplies(true, true), true);
  assert.equal(closureModelGuardApplies(false, true), false); // not entered -> dormant
  assert.equal(closureModelGuardApplies(true, false), false); // enforce off
  assert.equal(closureModelGuardApplies(false, false), false);
});
