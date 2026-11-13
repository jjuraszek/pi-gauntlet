import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../../skills/housekeeping/${path}`, import.meta.url), "utf8");

test("AC 8 conformance: Delete authorizes only accepted spec deletions through the run's delivery", () => {
  const fix = read("reference/fix.md");
  const card = read("reference/card.md");
  assert.match(card, /Record Delete as `fix` and Keep as `ignore`/);
  assert.match(fix, /execute only recorded picks/);
  assert.match(fix, /Carry excluded items and the human's verbatim instruction into each class/);
  assert.match(fix, /Build jobs from `delivery`/);
  assert.match(fix, /\| `in-place` \| Expected copies of `files` and `specs`: contents, existence and modes, plus the recorded index listing\. \|/,
    "Admission must protect specs as well as ordinary selected files");
  assert.match(fix, /For `spec-superseded`, delete only the accepted `specs` paths and edit no file/,
    "The fix duty must allow deletion of accepted specs, not general edits");
  assert.match(fix, /For every other class, edit only the listed items' files inside the target tree; for `in-place`, edit only selected files/,
    "The ordinary files-only duty must not override the spec deletion exception");
  assert.match(fix, /For `spec-superseded`, the allowed files are exactly the accepted `specs` paths and the only allowed change is their deletion/,
    "Diff validation must reject modified specs, excluded specs and unrelated files");
  assert.match(fix, /For every other class, treat a diff touching a spec-dir or plan-dir path as an edit outside allowed files/);
  assert.match(fix, /Leave mentions of deleted specs in other files, telemetry records and index rows unchanged/);
  assert.match(fix, /For `spec-superseded`, repeat the derived search over only the accepted paths and pass only when none exists/,
    "Removing a banner from an existing file must not count as Delete");
  assert.match(fix, /Review only the class's change against its supplied rule and items/);
  assert.match(fix, /For other classes with `bounds: on`, include the six \[hotfix predicates\]/,
    "Spec deletion review must stay rule-bound rather than reintroducing hotfix eligibility");
  assert.match(fix, /Keep a class only with `SHIP`, passing required checks and a valid allowed-file diff/);
  assert.match(fix, /For `in-place`, never commit or run a command that changes the index/);
  assert.match(fix, /For `in-place`, compare the index listing byte for byte with the recorded one/);
  assert.match(fix, /Restore the class's changed files from the pre-class expected copies/);
  assert.match(fix, /an edit outside allowed files or an index change for `in-place`/);

  assert.match(card, /for Delete, state the removal of the accepted specs first, then the same delivery promise/);
  assert.match(card, /1\. \[ \] Delete - remove the listed specs; <delivery from the table below>/);
  assert.ok(card.includes("| `amend` | Make one commit for this class on the default branch in the primary checkout, fold the kept fixes into the last unpushed commit after the last class, and push nothing. |"),
    "The unpushed Delete promise must use the amend delivery, not push");
});
