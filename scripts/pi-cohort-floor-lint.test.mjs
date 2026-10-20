import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lintPiCohortFloor } from "./pi-cohort-floor-lint.mjs";

const declaration = (value) => `- [pi-cohort](https://github.com/jjuraszek/pi-cohort) ${value} - required peer package.\n`;
for (const [name, peer, readme, expectedPeer, expectedReadme] of [
  ["matching", ">=7.4.3", declaration(">= 7.4.3"), null, null],
  ["mismatch", ">=7.4.3", declaration(">= 7.4.1"), ">=7.4.3", "7.4.1"],
  ["missing peer", undefined, declaration(">= 7.4.3"), "missing", "7.4.3"],
  ...["^7.4.3", ">=7.4.3 <8.0.0", ">=7.4.3-beta.1", ">= 7.4.3", "7.4.3"].map((peer) =>
    [`malformed ${peer}`, peer, declaration(">= 7.4.3"), peer, "7.4.3"]),
  ["missing README floor ignores prose", ">=7.4.3", "The newest pi-cohort is 7.4.3.\n", ">=7.4.3", "missing"],
  ["README prerelease", ">=7.4.3", declaration(">= 7.4.3-beta.1"), ">=7.4.3", "7.4.3-beta.1"],
]) {
  test(name, () => {
    const root = mkdtempSync(join(tmpdir(), "cohort-floor-"));
    writeFileSync(join(root, "package.json"), JSON.stringify({ peerDependencies: { "pi-cohort": peer } }));
    writeFileSync(join(root, "README.md"), readme);
    const errors = lintPiCohortFloor(root);
    if (expectedPeer === null) assert.deepEqual(errors, []);
    else {
      assert.equal(errors.length, 1);
      assert.ok(errors[0].includes(expectedPeer));
      assert.ok(errors[0].includes(expectedReadme));
      assert.match(errors[0], /package\.json/);
      assert.match(errors[0], /README\.md/);
    }
  });
}

for (const file of ["package.json", "README.md"]) {
  for (const state of ["missing", "unreadable"]) {
    test(`${file} ${state}`, () => {
      const root = mkdtempSync(join(tmpdir(), "cohort-floor-"));
      writeFileSync(join(root, file === "package.json" ? "README.md" : "package.json"),
        file === "package.json" ? declaration(">= 7.4.3") : JSON.stringify({ peerDependencies: { "pi-cohort": ">=7.4.3" } }));
      if (state === "unreadable") mkdirSync(join(root, file));
      const errors = lintPiCohortFloor(root);
      assert.equal(errors.length, 1);
      assert.match(errors[0], /package\.json/);
      assert.match(errors[0], /README\.md/);
      assert.ok(errors[0].includes(state));
      assert.ok(errors[0].includes("7.4.3"));
    });
  }
}
