import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { lintSkillSizes } from "./skill-size-lint.mjs";

for (const [name, content, bytes, lines, fails] of [
  ["below both limits", "x".repeat(48001) + "\n".repeat(1998), 49999, 1999, false],
  ["byte boundary with multibyte text", "é".repeat(25000), 50000, 1, true],
  ["line boundary", "x\n".repeat(2000), 4000, 2000, true],
  ["no trailing newline", "x\n".repeat(1999) + "x", 3999, 2000, true],
  ["empty", "", 0, 0, false],
]) {
  test(name, () => {
    const root = mkdtempSync(join(tmpdir(), "skill-size-"));
    for (const file of ["skills/example/reference/detail.md", "agents/example.md"]) {
      const path = join(root, file);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    }
    const errors = lintSkillSizes(root);
    assert.equal(errors.length, fails ? 2 : 0);
    if (fails) {
      for (const file of ["skills/example/reference/detail.md", "agents/example.md"]) {
        const error = errors.find((value) => value.includes(file));
        assert.ok(error);
        assert.ok(error.includes(`${bytes} bytes`));
        assert.ok(error.includes(`${lines} lines`));
        assert.match(error, /reference\//);
      }
    }
  });
}

test("nested agents and non-Markdown files are outside the scan", () => {
  const root = mkdtempSync(join(tmpdir(), "skill-size-"));
  for (const file of ["agents/nested/example.md", "skills/example/data.txt", "other/example.md"]) {
    const path = join(root, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, "x".repeat(50000));
  }
  assert.deepEqual(lintSkillSizes(root), []);
});
