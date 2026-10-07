import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseExpected, runMechanical, wordCount, sha256 } from "./checks.mjs";

test("parses judged and mechanical facts, keeps anonymized flag", () => {
  const r = parseExpected(`anonymized: true\n\n- f1: judged: The reply names the base branch.\n- f2: mechanical: contains "Sync:"\n- f3: mechanical: lacks "DRAFT"\n- f4: mechanical: matches /^exit: [01]$/m\n`);
  assert.equal(r.anonymized, true);
  assert.deepEqual(r.facts.map((f) => f.id), ["f1", "f2", "f3", "f4"]);
  assert.equal(r.facts[0].kind, "judged");
  assert.deepEqual(r.facts[1].check, { op: "contains", value: "Sync:" });
  assert.deepEqual(r.facts[3].check, { op: "matches", source: "^exit: [01]$", flags: "m" });
});
test("parses CRLF expected facts", () => {
  const text = 'anonymized: true\n\n- f1: judged: x\n- f2: mechanical: contains "ok"\n';
  assert.deepEqual(parseExpected(text.replaceAll("\n", "\r\n")), parseExpected(text));
});
test("no anonymized line is fine", () => {
  assert.equal(parseExpected("- f1: judged: x\n").anonymized, false);
});
test("untagged, duplicate, and stray lines are errors", () => {
  assert.throws(() => parseExpected("- f1: The reply names the base branch.\n"), /untagged/);
  assert.throws(() => parseExpected("- f1: judged: a\n- f1: judged: b\n"), /duplicate/);
  assert.throws(() => parseExpected("- f1: judged: a\nnot a fact\n"), /stray/);
  assert.throws(() => parseExpected("- f1: mechanical: startswith x\n"), /malformed mechanical/);
  for (const check of ["matches /(/", "matches /a/z"]) {
    assert.throws(() => parseExpected(`- f1: mechanical: ${check}\n`), {
      message: `expected.md malformed mechanical check: ${check}`,
    });
  }
});
test("mechanical facts evaluate on the whole output", () => {
  const { facts } = parseExpected(`- f2: mechanical: contains "Sync:"\n- f3: mechanical: lacks "DRAFT"\n- f4: mechanical: matches /^exit: [01]$/m\n- f5: judged: x\n`);
  assert.deepEqual(runMechanical(facts, "Sync: ok\nexit: 0\n"), { f2: "holds", f3: "holds", f4: "holds" });
  assert.deepEqual(runMechanical(facts, "DRAFT"), { f2: "fails", f3: "fails", f4: "fails" });
});
test("word count ignores punctuation-only tokens and counts cap boundaries", () => {
  assert.equal(wordCount("a | b - c\n| d |"), 4);
  assert.equal(wordCount(" \t\n| - ... "), 0);
  const atCap = Array(50).fill("hi").join("\t");
  assert.equal(wordCount(`\n${atCap}\n| - `), 50);
  assert.equal(wordCount(`${atCap}\nhi`), 51);
});
test("sha256 preserves part boundaries and is deterministic hex", () => {
  assert.notEqual(sha256("a", "b"), sha256("ab"));
  assert.notEqual(sha256("a.md", "xb"), sha256("a.mdx", "b"));
  assert.equal(sha256("x"), createHash("sha256").update("x").digest("hex"));
  assert.match(sha256("x"), /^[0-9a-f]{64}$/);
});
