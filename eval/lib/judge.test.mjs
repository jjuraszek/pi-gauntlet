import { test } from "node:test";
import assert from "node:assert/strict";
import { parseJudgeReply, deriveLabels, cellVerdict, worseVerdict, buildJudgePrompt, VERDICT_ORDER } from "./judge.mjs";

test("parses one fenced JSON block", () => {
  const r = parseJudgeReply("text\n```json\n{\"facts\":{\"f1\":{\"before\":\"holds\",\"after\":\"holds\"}},\"feedback\":\"fine\"}\n```\n", ["f1"]);
  assert.deepEqual(r.facts.f1, { before: "holds", after: "holds" });
  assert.equal(r.feedback, "fine");
});
test("malformed replies throw with a reason", () => {
  assert.throws(() => parseJudgeReply("no block", ["f1"]), {
    message: "judge reply must contain exactly one fenced JSON block (found 0)",
  });
  assert.throws(() => parseJudgeReply("```json\n{\"facts\":{}}\n```", ["f1"]), /missing fact f1/);
  assert.throws(() => parseJudgeReply("```json\n{\"facts\":{\"f1\":{\"before\":\"maybe\",\"after\":\"holds\"}},\"feedback\":\"\"}\n```", ["f1"]), /f1 before must be holds or fails/);
});
test("null facts are refused with a reason", () => {
  assert.throws(() => parseJudgeReply('```json\n{"facts":null,"feedback":""}\n```', ["f1"]), {
    message: "judge JSON lacks facts",
  });
});
test("multiple fenced JSON blocks are refused", () => {
  const block = '```json\n{"facts":{"f1":{"before":"holds","after":"holds"}},"feedback":"fine"}\n```';
  assert.throws(() => parseJudgeReply(`${block}\n${block}`, ["f1"]), {
    message: "judge reply must contain exactly one fenced JSON block (found 2)",
  });
});
test("label derivation table", () => {
  const moves = [{ sample: "s", fact: "f2", from: "fails", to: "holds" }, { sample: "s", fact: "f3", from: "holds", to: "fails" }];
  const outcomes = {
    f1: { before: "holds", after: "holds" },
    f2: { before: "fails", after: "holds" },
    f3: { before: "fails", after: "holds" },
  };
  const r = deriveLabels("s", outcomes, moves);
  assert.equal(r.f1.label, "held");
  assert.equal(r.f2.label, "intended change");
  assert.equal(r.f3.label, "unexplained change");
  assert.equal(deriveLabels("s", { f1: { before: "fails", after: "fails" } }, []).f1.label, "pre-existing");
  assert.equal(deriveLabels("s", { f1: { before: "holds", after: "fails" } }, []).f1.label, "regression");
  assert.equal(deriveLabels("s", { f3: { before: "holds", after: "fails" } }, [{ sample: "s", fact: "f3", from: "fails", to: "holds" }]).f3.label, "regression");
  assert.equal(deriveLabels("s", { f3: { before: "holds", after: "holds" } }, [{ sample: "s", fact: "f3", from: "holds", to: "fails" }]).f3.label, "intended but unchanged");
  assert.equal(deriveLabels("other", { f3: { before: "fails", after: "holds" } }, [{ sample: "s", fact: "f3", from: "fails", to: "holds" }]).f3.label, "unexplained change");
});
test("cell verdict", () => {
  assert.equal(cellVerdict({ f1: { label: "held" } }), "unchanged");
  assert.equal(cellVerdict({ f1: { label: "intended change" }, f2: { label: "held" } }), "improved");
  assert.equal(cellVerdict({ f1: { label: "intended change" }, f2: { label: "regression" } }), "regressed");
  assert.equal(cellVerdict({ f1: { label: "unexplained change" } }), "regressed");
  assert.equal(cellVerdict({ f1: { label: "intended but unchanged" } }), "unchanged");
});
test("worse-of-two order", () => {
  assert.deepEqual(VERDICT_ORDER, ["error", "inconclusive", "regressed", "unchanged", "improved"]);
  assert.equal(worseVerdict("improved", "regressed"), "regressed");
  assert.equal(worseVerdict("error", "improved"), "error");
  assert.equal(worseVerdict("inconclusive", "regressed"), "inconclusive");
});
test("judge prompt carries every input", () => {
  const p = buildJudgePrompt({ judgeText: "JUDGE", caseText: "CASE", facts: [{ id: "f1", kind: "judged", text: "T1" }], change: "CH", moves: [], before: "B", after: "A" });
  for (const s of ["JUDGE", "CASE", "f1: T1", "CH", "B", "A"]) assert.ok(p.includes(s), s);
});

test("edit judge prompt includes fixture and both resulting trees only when supplied", () => {
  const inputs = { judgeText: "JUDGE", caseText: "REQUEST", facts: [], change: "CH", moves: [], before: "BASE DIFF", after: "CAND DIFF" };
  const tree = (content) => ({ "SKILL.md": { lines: 1, content } });
  const p = buildJudgePrompt({ ...inputs, beforeTree: tree("original"), baselineTree: tree("baseline"), candidateTree: tree("candidate") });
  assert.match(p, /## Fixture before\n\n#### SKILL.md \(1 lines\)/);
  assert.match(p, /## Before\n\nBASE DIFF\n\n### Resulting tree[\s\S]*baseline/);
  assert.match(p, /## After\n\nCAND DIFF\n\n### Resulting tree[\s\S]*candidate/);
  const plain = buildJudgePrompt(inputs);
  assert.doesNotMatch(plain, /Fixture before|Resulting tree/);
});
