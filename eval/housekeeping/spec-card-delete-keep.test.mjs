import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../../skills/housekeeping/${path}`, import.meta.url), "utf8");
const select = read("reference/select.md");
const check = read("reference/check.md");
const selection = select.split("## Selection\n")[1]?.split("\n## ")[0] ?? "";

test("AC 1 conformance: split spec candidates from files and exclude content rules", () => {
  assert.match(selection, /spec dir[^\n]*`specs`/i,
    "Selection must put a spec-dir candidate in specs rather than the ordinary files list");
  assert.match(selection, /(?:never in|out of|exclude[^\n]*from) `files`/i,
    "Spec candidates must not remain in files");
  assert.match(check, /`files` against every compiled row except `spec-superseded`/,
    "Content checks must operate on files, not specs");
  assert.match(check, /`specs` against that row alone/,
    "Specs must receive only the spec-superseded check");
  assert.match(check, /no repo or overrides rule compiles against the Specs kind/i,
    "Repo and overrides content rules must not compile for specs");
  assert.match(check, /helpers receive no `specs` path/i,
    "Content-check helpers must not receive spec candidates");
});

test("AC 2 conformance: skip plan-dir candidates before populating either list", () => {
  assert.match(selection, /(?:candidate in a plan dir is skipped|(?:Skip|Drop) (?:every |each )?(?:candidate|path)[^\n.]*plan dir)/i,
    "Selection must skip plan-dir candidates, leaving them in neither files nor specs");
});

test("AC 3 conformance: a harness without gauntlet_setting uses the four default dirs", () => {
  const fallback = selection.split("\n").find((line) => /(?:without|no|unavailable|absent|missing)[^\n]*(?:tool|gauntlet_setting)/i.test(line));
  assert.ok(fallback, "Selection must define a fallback for a harness without the settings tool");
  for (const dir of ["doc/specs", "docs/specs", "doc/plans", "docs/plans"]) {
    assert.ok(fallback.includes(`\`${dir}\``), `The no-tool fallback must include ${dir}`);
  }
});
