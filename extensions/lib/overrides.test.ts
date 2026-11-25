import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { retiredNames } from "../../scripts/gauntlet-tree-lint.mjs";
import { readSharedSection } from "./overrides.ts";

test("only the first overrides file in each member supplies its shared settings", t => {
  const root = mkdtempSync(join(tmpdir(), "shared-overrides-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (repo: string, file: string, tracker: string) => {
    const path = join(root, repo, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `# shared\n## issue-tracker\n- tracker: ${tracker}\n`);
  };
  const get = (repo: string) => readSharedSection(join(root, repo), "issue-tracker").trim();
  assert.equal(get("a"), "");
  put("a", `.pi/${retiredNames.overrides}.md`, "ignored");
  assert.equal(get("a"), "");
  for (const [file, tracker] of [["doc/gauntlet.md", "one"], ["gauntlet.md", "two"], [".pi/gauntlet.md", "three"]]) {
    put("a", file, tracker);
    assert.equal(get("a"), `- tracker: ${tracker}`);
  }
  put("b", ".pi/gauntlet.md", "other");
  assert.equal(get("b"), "- tracker: other");
  assert.equal(get("a"), "- tracker: three");
  writeFileSync(join(root, "a/.pi/gauntlet.md"), "# gatekeep-pr\n## issue-tracker\n- tracker: foreign\n");
  assert.equal(get("a"), "", "a missing shared section never falls through to another file");
});

test("section boundaries follow the first shared block's unfenced headings", t => {
  const root = mkdtempSync(join(tmpdir(), "shared-section-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [section, text, expected] of [
    ["issue-tracker", "# shared\n## Issue tracker\nwrong", ""],
    ["siblings", "# title\n## siblings\nwrong\n# shared\n## siblings\none\n## siblings\ntwo", "one"],
    ["spec-index", "# shared\n## spec-index\ndocs\n# unknown\noutside", "docs"],
    ["siblings", "# shared\n# shared\n## siblings\nlater", ""],
    ["siblings", "# example\n````md\n# shared\n```\n## siblings\nwrong\n````\n# shared\n## siblings\nreal", "real"],
    ["siblings", "# shared\n## siblings\none\n~~~md\n## other\n# next\n~~~\ntwo\n## other", "one\n~~~md\n## other\n# next\n~~~\ntwo"],
  ]) {
    writeFileSync(join(root, "gauntlet.md"), text);
    assert.equal(readSharedSection(root, section).trim(), expected, text);
  }
});
