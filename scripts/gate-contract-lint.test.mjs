import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { test } from "node:test";
import { lintGateContract } from "./gate-contract-lint.mjs";

const file = "skills/demo/SKILL.md";
const menu = "skills/brainstorming/reference/menu-layout.md";
const fence = (text) => `\`\`\`text\n${text}\n\`\`\``;
const gate = "gauntlet: gate=demo/review";
const row = `| demo/review | gate | ${file} | ## Review | N. rows |`;
const question = `| demo/ask | question | ${file} | ## Ask | free |`;
const contract = (rows = row + "\n" + question) => `# Contract\n## Gates\n| gate id | kind (gate/question) | rendering file | site | layout |\n|---|---|---|---|---|\n${rows}\n## Terminals\n| skill | ending | report site | line |\n|---|---|---|---|\n| demo | done ok | ${file} § ## End | gauntlet: done ok |\n## Reading a reply\n`;
const body = `# Demo\n[menu](../brainstorming/reference/menu-layout.md)\n## Review - choices\n${fence(gate + "\nChoose.")}\n## Ask\nStart the message with \`gauntlet: question\`.\n## End\n${fence("gauntlet: done ok")}`;
function fixture(overrides = {}) {
  const root = mkdtempSync(join(tmpdir(), "gate-contract-"));
  const files = { "doc/gate-contract.md": contract(), [file]: body, [menu]: "gauntlet: gate=demo/review\ngauntlet: question\ngauntlet: done ok\ngauntlet: stuck reason\n[A-Za-z0-9.-]+", "README.md": "[contract](doc/gate-contract.md)", "AGENTS.md": "[contract](doc/gate-contract.md)", ...overrides };
  for (const [path, text] of Object.entries(files)) {
    if (text === null) continue;
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return root;
}
test("valid inventory and direct CLI", () => {
  const root = fixture();
  assert.deepEqual(lintGateContract(root), []);
  assert.equal(execFileSync(process.execPath, ["scripts/gate-contract-lint.mjs", root], { encoding: "utf8" }), "");
});
test("table and site parse failures name the row", () => {
  for (const rows of [row.replace("| N. rows |", "|"), row.replace("demo/review", "demo/bad_id"), row.replace(file, "skills/missing.md"), row.replace("## Review", "## Missing"), row + "\n" + row]) {
    assert.match(lintGateContract(fixture({ "doc/gate-contract.md": contract(rows) })).join("\n"), /doc\/gate-contract.md:\d+.*parse error/);
  }
});
test("shared question sites and repeated ids at distinct sites", () => {
  const rows = row + "\n" + question + "\n" + question.replace("demo/ask", "demo/other") + "\n" + question.replace("demo/ask", "demo/third") + "\n" + row.replace("## Review", "## Second");
  assert.deepEqual(lintGateContract(fixture({ "doc/gate-contract.md": contract(rows), [file]: body + `\n## Second\n${fence(gate)}` })), []);
});
test("heading slices ignore fenced headings, include children, and stop at peers", () => {
  for (const [name, content, valid] of [
    ["nested", body.replace(fence(gate + "\nChoose."), `### Child\n${fence(gate)}`), true],
    ["fenced heading", body.replace("Start the message with", `${fence("## Acceptance criteria")}\nStart the message with`), true],
    ["peer", body.replace(fence(gate + "\nChoose."), `## Peer\n${fence(gate)}`), false],
  ]) assert.equal(lintGateContract(fixture({ [file]: content })).length === 0, valid, name);
});
test("literal position and template counts", () => {
  for (const [name, render, layout, valid] of [
    ["two marked", fence(gate) + "\n" + fence(gate), "templates=2", true],
    ["one unmarked", fence(gate) + "\n" + fence("Choose"), "templates=2", false],
    ["three marked", [fence(gate), fence(gate), fence(gate)].join("\n"), "templates=2", false],
    ["prose", `Start the message with \`${gate}\`.`, "free", true],
    ["midparagraph sentence", `Choose an option. Start the message with \`${gate}\`.`, "free", true],
    ["list instruction", `- Start the message with \`${gate}\`.`, "free", true],
    ["table instruction", `| Ask | Start the message with \`${gate}\`. |`, "free", true],
    ["different sentence", `Start the message with a greeting. Explanation: \`${gate}\`.`, "free", false],
    ["quote", `Explanation: \`${gate}\`.`, "free", false],
    ["late", fence("Choose\n" + gate), "free", false],
    ["blank", fence("\n" + gate), "free", true],
  ]) {
    const root = fixture({ "doc/gate-contract.md": contract(row.replace("N. rows", layout) + "\n" + question), [file]: body.replace(fence(gate + "\nChoose."), render) });
    assert.equal(lintGateContract(root).length === 0, valid, name);
  }
  assert.match(lintGateContract(fixture({ [file]: body.replace("Start the message with", "Quote") })).join("\n"), /gate demo\/ask not found/);
  assert.deepEqual(lintGateContract(fixture({ [file]: body.replace("Start the message with `gauntlet: question`.", fence("gauntlet: question")) })), []);
  assert.ok(lintGateContract(fixture({ [file]: body.replace("gauntlet: done ok", "Report first.\ngauntlet: done ok") })).includes(`terminal demo/done ok not found at ${file} ## End`));
  assert.deepEqual(lintGateContract(fixture({ [file]: body.replace(fence("gauntlet: done ok"), "Start the message with `gauntlet: stuck`.") , "doc/gate-contract.md": contract().replace("done ok", "stuck reason").replace("gauntlet: done ok", "gauntlet: stuck") })), []);
});
test("reverse scan covers only skills and exempts questions and menu-layout", () => {
  for (const kind of ["gate=demo/unknown", "done other", "stuck reason"]) {
    const diagnostics = lintGateContract(fixture({ "skills/demo/example.md": `Example \`gauntlet: ${kind}\`` }));
    assert.deepEqual(diagnostics, [`skills/demo/example.md:1 gauntlet: ${kind.split(/[= ]/)[0]} not in doc/gate-contract.md`]);
  }
  assert.deepEqual(lintGateContract(fixture({ "skills/demo/example.md": "gauntlet: question", "doc/example.md": gate, "eval/example.md": gate, "extensions/example.md": gate, "CHANGELOG.md": gate, [file]: body + "\n" /* examples inside inventoried slice are allowed */ + `Explanation \`${gate}\`` })), []);
});
test("resolving citations, public links and all rule kinds and charset", () => {
  for (const [path, content, message] of [
    [file, body.replace("../brainstorming/", "../../brainstorming/"), `${file}: no resolving menu-layout citation`],
    ["README.md", "contract", "doc/gate-contract.md not linked from README.md"],
    ["AGENTS.md", "[contract](missing.md)", "doc/gate-contract.md not linked from AGENTS.md"],
    ...["gate", "question", "done", "stuck"].map((kind) => [menu, ["gate", "question", "done", "stuck"].filter((k) => k !== kind).map((k) => `gauntlet: ${k}`).join("\n") + "\n[A-Za-z0-9.-]+", `menu-layout.md: missing line kind ${kind}`]),
    [menu, "gauntlet: gate\ngauntlet: question\ngauntlet: done\ngauntlet: stuck", "menu-layout.md: missing charset [A-Za-z0-9.-]+"],
  ]) assert.ok(lintGateContract(fixture({ [path]: content })).includes(message), message);
});
test("missing contract and terminal placement fail; CLI prints diagnostics one per line", () => {
  const root = fixture({ "doc/gate-contract.md": null });
  assert.deepEqual(lintGateContract(root), ["doc/gate-contract.md: missing contract"]);
  const result = spawnSync(process.execPath, ["scripts/gate-contract-lint.mjs", root], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.equal(result.stderr, "doc/gate-contract.md: missing contract\n");
  assert.ok(lintGateContract(fixture({ [file]: body.replace("gauntlet: done ok", "unmarked") })).includes(`terminal demo/done ok not found at ${file} ## End`));
});
