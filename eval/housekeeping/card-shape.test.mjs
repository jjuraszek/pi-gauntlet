import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { wordCount } from "../lib/checks.mjs";
import "./pr-card-no-ticket.test.mjs";

const candidate = JSON.parse(readFileSync(new URL("./results/pr-card-no-ticket/candidate.json", import.meta.url), "utf8"));

test("card shape: one counted title, three prose sections and at most 180 words before the picks", () => {
  for (const model of candidate.models.replay) {
    const text = candidate.outputs[model].text;
    const parts = text.split("\nPick one:\n");
    assert.equal(parts.length, 2, `${model}: exactly one card and pick list`);
    const card = parts[0].slice(parts[0].indexOf("### "));
    const headings = [...card.matchAll(/^### (.+)$/gm)].map((match) => match[1]);
    assert.equal(headings.length, 4, `${model}: one title and three sections`);
    assert.match(headings[0], /^1 of 1\. (?:2|Two) .+ in .+/i, `${model}: counted title and place`);
    assert.deepEqual(headings.slice(1), ["What was found", "Why it matters", "What happens if you accept"], `${model}: section order`);
    assert.ok(wordCount(card) <= 180, `${model}: ${wordCount(card)} words exceeds the 180-word cap`);
    const sections = card.split(/^### .+\n/gm).slice(2);
    for (const section of sections) {
      assert.equal(section.trim().split(/\n\s*\n/).length, 1, `${model}: one paragraph per section`);
      assert.doesNotMatch(section, /^\s*(?:[-*]|\d+\.)\s/m, `${model}: prose, not lists`);
    }
    assert.equal(candidate.judge[model].facts["card-prose"]?.after, "holds", `${model}: plain predicate and literal delivery promise`);
  }
});
