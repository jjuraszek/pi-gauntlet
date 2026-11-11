import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const report = read("skills/gatekeep-pr/reference/report.md");
const skill = read("skills/gatekeep-pr/SKILL.md");
const menus = read("skills/gatekeep-pr/reference/menus.md");

test("reports keep facts and evidence provenance without field scaffolding", () => {
  assert.doesNotMatch(report, /^```/m, "report has no fenced template or examples");
  assert.doesNotMatch(report, /(?:Evidence|Role|Prior review|Sync|Verdict|Delivers):/);
  for (const phrase of ["whole sentences", "standing sentence", "show evidence", "also requested", "no commits since", "not an ancestor", "after merge"]) {
    assert.ok(report.includes(phrase), phrase);
  }
  assert.match(report, /CI.*local|local.*CI/s);
  assert.match(report, /--rebase/);
  assert.match(report, /covered.*deferred.*deviat.*elsewhere/s);
  assert.match(report, /three unlabeled parts/);
  assert.match(report, /one paragraph of exactly two sentences/);
  assert.match(report, /name the behavior, never a row number/);
  assert.match(report, /Start the second part with the standing sentence/);
  assert.match(report, /part three's recommendation sentence and reason immediately above `Pick one:`; follow `menus\.md`\./);
  assert.match(report, /^> This PR /m, 'ship the unfenced report example');
  assert.doesNotMatch(read('skills/gatekeep-pr/reference/batch.md'), /Not offered:/);
  const wording = skill.split("## Wording rules\n")[1].split("## Red flags")[0];
  for (const phrase of ["binding pending check", "merge_state_status BLOCKED", "assessed head", "durable run record", "PR-named action", "coverage post", "withhold", "terminal pick", "post set", "disposition", "cap reached", "nit", "contradicted claim", "observable half", "conflicting / behind", "deferred / deviates / elsewhere", "pending reviewer placeholder", "Output done-check"]) {
    assert.ok(wording.includes(phrase), phrase);
  }
  assert.doesNotMatch(wording, /verdict is one line in the fixed form|Report only non-conformance|Locators trail in parentheses|Menu rows start with a verb/);
});

test("menu explanations use standing prose and put raw evidence behind its hint", () => {
  assert.doesNotMatch(menus, /Evidence:|Not offered:|Delivers:/);
  assert.match(menus, /standing sentence/);
  assert.match(menus, /Type a number; show evidence prints the full record\./);
  assert.doesNotMatch(menus, /course=|source: ci|source: pending|binding-pending count/);
  assert.doesNotMatch(menus, /then approve or stop/, "assess never promises self-approval");
  assert.match(menus.split("## final\n")[1].split("## assess terminal")[0], /print its `\[recommended\]` tag on row 1/);
});

test("saved plain-report candidates prove D5 without labels, numbered requirements or counters", () => {
  const facts = [...read("eval/gatekeep-pr/samples/plain-report/expected.md").matchAll(/^- ([\w-]+): judged:/gm)].map((match) => match[1]);
  assert.equal(facts.length, 8);
  const candidate = JSON.parse(read("eval/gatekeep-pr/results/plain-report/candidate.json"));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, "ok", model);
    for (const id of facts) assert.equal(candidate.judge[model].facts[id]?.after, "holds", `${model}: ${id}`);
    assert.doesNotMatch(output.text, /\b(?:Evidence|Role|Prior review|Sync|Verdict|Delivers):/, model);
    assert.doesNotMatch(output.text, /binding pending check|merge_state_status|assessed head|durable run record|PR-named action|coverage post|withhold|terminal pick|post set|\bdisposition\b|course=/i, model);
    assert.doesNotMatch(output.text, /^(?:>\s*)?(?:Not offered):/mi, model);
    assert.doesNotMatch(output.text, /\bexit_code\b/i, model);
  }
});
