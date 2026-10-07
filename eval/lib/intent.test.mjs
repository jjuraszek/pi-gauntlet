import { test } from "node:test";
import assert from "node:assert/strict";
import { parseIntent, INTENT_STUB } from "./intent.mjs";

const sha = "a".repeat(64);
const good = `for: ${sha}\n\n## Change\nThe skill now asks the framing question first.\n\n## Expected to move\n- council-first/f2: fails -> holds - the question now precedes approaches\n- council-first/f4: holds -> fails - the old greeting line is gone\n`;

test("parses a valid intent", () => {
  const r = parseIntent(good, sha);
  assert.equal(r.status, "ok");
  assert.equal(parseIntent(good, sha, { "council-first": ["f2", "f4"] }).status, "ok");
  assert.equal(r.change, "The skill now asks the framing question first.");
  assert.deepEqual(r.moves, [
    { sample: "council-first", fact: "f2", from: "fails", to: "holds", why: "the question now precedes approaches" },
    { sample: "council-first", fact: "f4", from: "holds", to: "fails", why: "the old greeting line is gone" },
  ]);
});
test("parses CRLF intent", () => {
  assert.deepEqual(parseIntent(good.replaceAll("\n", "\r\n"), sha), parseIntent(good, sha));
});
test("for: must be on the first non-blank line", () => {
  const misplaced = good.replace(`for: ${sha}\n\n`, "").replace("## Change\n", `## Change\nfor: ${sha}\n`);
  assert.equal(parseIntent(misplaced, sha).status, "missing-heading");
  assert.deepEqual(parseIntent(`\n\n${good}`, sha), parseIntent(good, sha));
});
test("unknown fact id is refused", () => {
  const r = parseIntent(good.replace("council-first/f2", "council-first/f9"), sha, { "council-first": ["f2", "f4"] });
  assert.equal(r.status, "bad-bullet");
  assert.match(r.reason, /unknown fact: council-first\/f9/);
});
test("stub is refused", () => {
  assert.equal(parseIntent(INTENT_STUB, sha).status, "stub");
  assert.match(parseIntent(INTENT_STUB, sha).reason, new RegExp(sha));
});
test("missing heading is refused", () => {
  assert.equal(parseIntent(good.replace("## Expected to move", "## Moves"), sha).status, "missing-heading");
});
test("malformed bullet is refused with its line", () => {
  const r = parseIntent(good.replace("- council-first/f4: holds -> fails - the old greeting line is gone", "- council-first f4 moves"), sha);
  assert.equal(r.status, "bad-bullet");
  assert.match(r.reason, /council-first f4 moves/);
});
test("for: mismatch is refused and reports the current sha", () => {
  const r = parseIntent(good, "b".repeat(64));
  assert.equal(r.status, "for-mismatch");
  assert.match(r.reason, new RegExp("b".repeat(64)));
});
test("empty move list is valid", () => {
  assert.equal(parseIntent(`for: ${sha}\n\n## Change\nx\n\n## Expected to move\n`, sha).status, "ok");
});
