import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { scanText, scanTree, redact, OWNER } from "./hygiene.mjs";

const userPath = ["/Us", "ers/alice/x"].join("");
const owner = OWNER;

test("each predicate fires", () => {
  assert.deepEqual(scanText(`see ${userPath}`).map((h) => h.rule), ["user-path"]);
  assert.deepEqual(scanText(`by ${owner} today`).map((h) => h.rule), ["owner-handle"]);
  for (const secret of ["-----BEGIN RSA PRIVATE KEY-----", `ghp_${"A".repeat(24)}`, `AKIA${"A".repeat(16)}`, `xoxb-${"1".repeat(24)}`, `sk-${"a".repeat(24)}`]) {
    assert.deepEqual(scanText(secret).map((h) => h.rule), ["secret"]);
    assert.equal(redact(secret), "[redacted:secret]");
  }
  assert.deepEqual(scanText(`ok\n${userPath}\n${userPath}`), [
    { rule: "user-path", line: 2 }, { rule: "user-path", line: 3 },
  ]);
});
test("URL and ticket-ref exemptions", () => {
  const exempt = `https://github.com/${owner}/pi-gauntlet ${owner}/pi-gauntlet#50`;
  assert.deepEqual(scanText(exempt), []);
  assert.equal(redact(exempt), exempt);
  assert.deepEqual(scanText(`${exempt} by ${owner}`).map((h) => h.rule), ["owner-handle"]);
  assert.equal(redact(`${exempt} by ${owner}`), `${exempt} by [redacted:owner-handle]`);
});
test("prefix-shaped words do not match", () => {
  assert.deepEqual(scanText("task-bound task-contract ask-me"), []);
  assert.deepEqual(scanText('- m1: mechanical: lacks "/Users"'), []);
  assert.deepEqual(scanText(`ask-${"a".repeat(24)} aghp_${"A".repeat(24)} AKIA${"A".repeat(17)} axoxb-${"1".repeat(24)}`), []);
});
test("denylist adds target-local patterns", () => {
  assert.deepEqual(scanText("ACME-corp ticket", ["acme-corp"]).map((h) => h.rule), ["denylist"]);
  assert.equal(redact("ACME-corp ticket", ["acme-corp"]), "[redacted:denylist] ticket");
});
test("tree scan skips lib and reports file:line", () => {
  const root = mkdtempSync(join(tmpdir(), "hyg-"));
  mkdirSync(join(root, "lib"), { recursive: true });
  mkdirSync(join(root, "t", "samples", "s"), { recursive: true });
  writeFileSync(join(root, "lib", "x.mjs"), userPath);
  writeFileSync(join(root, "t", "samples", "s", "case.md"), `ok\n${userPath}\n`);
  const hits = scanTree(root, { denylists: {} });
  assert.equal(hits.length, 1);
  assert.equal(hits[0].where, "t/samples/s/case.md:2");
  writeFileSync(join(root, "t", "local.md"), "acme-corp");
  assert.equal(scanTree(root, { denylists: { t: ["acme-corp"] } })[0].where, "t/local.md:1");
});
test("redact replaces hits", () => {
  assert.equal(redact(`a ${userPath} b`), "a [redacted:user-path] b");
});

test("target.json skips only denylist predicates", () => {
  const root = mkdtempSync(join(tmpdir(), "hyg-"));
  mkdirSync(join(root, "t"));
  writeFileSync(join(root, "t/target.json"), JSON.stringify({ denylist: ["acme-corp"], note: userPath }));
  writeFileSync(join(root, "t/case.md"), "acme-corp");
  const hits = scanTree(root, { denylists: { t: ["acme-corp"] } });
  assert.deepEqual(hits.map(({ rule, where }) => [rule, where]), [["denylist", "t/case.md:1"], ["user-path", "t/target.json:1"]]);
});
