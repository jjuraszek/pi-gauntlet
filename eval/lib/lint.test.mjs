import { test, after } from "node:test";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { lintTarget, lintAll } from "./lint.mjs";
import { INTENT_STUB } from "./intent.mjs";

const scratchDirs = [];
after(() => { for (const dir of scratchDirs) rmSync(dir, { recursive: true, force: true }); });

function mk(kind, { fixture = true, fact = "- f1: judged: x\n" } = {}) {
  const root = mkdtempSync(join(tmpdir(), "lint-"));
  scratchDirs.push(root);
  const t = join(root, "t");
  mkdirSync(join(t, "samples", "one"), { recursive: true });
  writeFileSync(join(t, "target.json"), JSON.stringify({ kind, skillFiles: [{ path: "skills/x/SKILL.md" }], assembly: "concat", wordCap: 100 }));
  writeFileSync(join(t, "replay.md"), "Do it.\n");
  writeFileSync(join(t, "intent.md"), INTENT_STUB);
  writeFileSync(join(t, "README.md"), "# t\n");
  writeFileSync(join(t, "samples", "one", "case.md"), "case\n");
  writeFileSync(join(t, "samples", "one", "expected.md"), fact);
  if (kind === "edit" && fixture) { mkdirSync(join(t, "samples", "one", "fixture")); writeFileSync(join(t, "samples", "one", "fixture", "SKILL.md"), "s\n"); }
  return { root, t };
}

test("valid text and edit targets pass", () => {
  assert.deepEqual(lintTarget(mk("text").t), []);
  assert.deepEqual(lintTarget(mk("edit").t), []);
  const { t } = mk("edit");
  writeFileSync(join(t, "target.json"), JSON.stringify({ kind: "edit", skillFiles: [{ path: "skills/x/SKILL.md" }] }));
  assert.deepEqual(lintTarget(t), []);
});
test("edit cases reject bundle+ lines", () => {
  const { t } = mk("edit");
  writeFileSync(join(t, "samples/one/case.md"), "bundle+: skills/x/extra.md\ncase\n");
  assert.match(lintTarget(t).join("\n"), /one: bundle\+ not allowed for kind edit/);
});

test("edit skill files must stay under the first file directory", () => {
  for (const path of ["skills/y/reference.md", "skills/x/../outside.md", "/outside.md"]) {
    const { t } = mk("edit");
    writeFileSync(join(t, "target.json"), JSON.stringify({ kind: "edit", skillFiles: [{ path: "skills/x/SKILL.md" }, { path }] }));
    assert.match(lintTarget(t).join("\n"), /must be under skills\/x/);
  }
});

test("edit without fixture fails", () => {
  assert.match(lintTarget(mk("edit", { fixture: false }).t).join("\n"), /one: kind edit needs fixture\//);
});
test("untagged fact fails", () => {
  assert.match(lintTarget(mk("text", { fact: "- f1: x\n" }).t).join("\n"), /untagged/);
});
test("unknown kind or assembly, missing files", () => {
  const { t } = mk("text");
  writeFileSync(join(t, "target.json"), JSON.stringify({ kind: "voice", skillFiles: [], assembly: "zip" }));
  const out = lintTarget(t).join("\n");
  assert.match(out, /unknown kind/); assert.match(out, /unknown assembly/); assert.match(out, /skillFiles empty/);
  writeFileSync(join(t, "target.json"), JSON.stringify({ kind: "text", skillFiles: [{ path: "skills/x/SKILL.md" }], wordCap: 100 }));
  assert.deepEqual(lintTarget(t), ["unknown assembly: undefined"]);
});
test("lintAll skips brainstorming/replay and lib, includes _template", () => {
  const { root } = mk("text");
  mkdirSync(join(root, "lib")); mkdirSync(join(root, "brainstorming", "replay"), { recursive: true });
  writeFileSync(join(root, "README.md"), "");
  const r = lintAll(root);
  assert.deepEqual(Object.keys(r), ["brainstorming", "t"]);
  assert.match(r.brainstorming.join("\n"), /target.json missing/);
  mkdirSync(join(root, "_template"));
  assert.deepEqual(Object.keys(lintAll(root)), ["_template", "brainstorming", "t"]);
});
test("every committed target and _template pass", () => {
  const r = lintAll(fileURLToPath(new URL("..", import.meta.url)));
  assert.deepEqual(Object.values(r).flat(), []);
});

test("edit skill entries reject slicing and body even when false", () => {
  for (const key of ["slice", "sliceTo", "body"]) {
    const { t } = mk("edit");
    writeFileSync(join(t, "target.json"), JSON.stringify({ kind: "edit", skillFiles: [{ path: "skills/x/SKILL.md", [key]: false }] }));
    assert.deepEqual(lintTarget(t), ["skillFiles entry skills/x/SKILL.md: slice/body not allowed for kind edit"]);
  }
});
