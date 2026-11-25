import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { prepareTarget } from "../run.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
for (const dir of readdirSync(new URL("../", import.meta.url), { withFileTypes: true })) {
  if (!dir.isDirectory() || ["lib", "_template"].includes(dir.name)) continue;
  test(`prepare both arms of every ${dir.name} sample without replay`, () => {
    const prepared = prepareTarget({ root, target: dir.name });
    assert.ok(prepared.plans?.length, prepared.message);
  });
}
