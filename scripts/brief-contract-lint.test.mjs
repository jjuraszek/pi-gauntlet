import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { CONTRACT_FILE, CITING_SKILLS, lintBriefGrammar, readSkillFiles } from "./brief-contract-lint.mjs";

const contract = [
  "# Handoff brief contract",
  "## Process state",
  "```text",
  "Active task: W2: producer",
  "Ledger: doc/plans/example-ledger.md",
  "Last decision: row 1 failed | check failed | retry",
  "Gate history not restored - re-validate before advancing.",
  "```",
].join("\n");
const handoff = "# Gauntlet Handoff\n\nStep 4 checks for `^## Process state\\s*$`. See reference/brief-contract.md.\n";
const resume = "# Gauntlet Resume\n\n| brief with `## Process state` | restore |\n\nGrammar: reference/brief-contract.md.\n";
const other = "# reconstruction\n\nA brief without `## Process state` is reconstructed.\n";

const files = (overrides = {}) => [
  { rel: CONTRACT_FILE, text: contract },
  { rel: "skills/gauntlet-handoff/SKILL.md", text: handoff },
  { rel: "skills/gauntlet-resume/SKILL.md", text: resume },
  { rel: "skills/gauntlet-resume/reference/reconstruction.md", text: other },
].map((f) => (f.rel in overrides ? { ...f, text: overrides[f.rel] } : f));

const rules = (fs) => lintBriefGrammar(fs).map((f) => `${f.rule}:${f.file}`).sort();

assert.equal(CONTRACT_FILE, "skills/gauntlet-resume/reference/brief-contract.md");
assert.deepEqual(CITING_SKILLS, ["skills/gauntlet-handoff/SKILL.md", "skills/gauntlet-resume/SKILL.md"]);

// clean repo shape: zero findings; inline mentions of the heading are legal
assert.deepEqual(rules(files()), []);

// negative: a standalone heading line inserted into the producer skill
assert.deepEqual(
  rules(files({ "skills/gauntlet-handoff/SKILL.md": handoff + "\n## Process state\n" })),
  ["grammar-outside-contract:skills/gauntlet-handoff/SKILL.md"],
);

// negative: active-task line inlined into the consumer skill
assert.deepEqual(
  rules(files({ "skills/gauntlet-resume/SKILL.md": resume + "Active task: none\n" })),
  ["grammar-outside-contract:skills/gauntlet-resume/SKILL.md"],
);

for (const field of ["Ledger: doc/plans/example-ledger.md", "Last decision: row 1 failed | check failed | retry"]) {
  assert.deepEqual(
    rules(files({ "skills/gauntlet-handoff/SKILL.md": handoff + field + "\n" })),
    ["grammar-outside-contract:skills/gauntlet-handoff/SKILL.md"],
  );
}

// negative: contract lost the gate-history line
assert.deepEqual(
  rules(files({ [CONTRACT_FILE]: contract.replace("Gate history not restored - re-validate before advancing.\n", "") })),
  [`grammar-missing:${CONTRACT_FILE}`],
);

// negative: producer skill stopped citing the contract
assert.deepEqual(
  rules(files({ "skills/gauntlet-handoff/SKILL.md": handoff.replace("reference/brief-contract.md", "the contract") })),
  ["cite-missing:skills/gauntlet-handoff/SKILL.md"],
);

// findings name the offending line text
const [hit] = lintBriefGrammar(files({ "skills/gauntlet-handoff/SKILL.md": handoff + "\n## Process state  \n" }));
assert.equal(hit.text, "## Process state");

const root = fileURLToPath(new URL("..", import.meta.url));
const realFiles = readSkillFiles(root);
assert.deepEqual(rules(realFiles), []);
for (const rel of [
  "skills/gauntlet-resume/SKILL.md",
  "skills/gauntlet-resume/reference/reconstruction.md",
  CONTRACT_FILE,
]) {
  assert.ok(realFiles.find((f) => f.rel === rel).text.includes("resume: <spec> (loop engine)"), `${rel}: exact ledger skip reason`);
}
assert.ok(realFiles.some((f) => f.rel === "skills/gauntlet-handoff/SKILL.md"));
const mutated = realFiles.map((f) =>
  f.rel === "skills/gauntlet-handoff/SKILL.md" ? { ...f, text: f.text + "\n## Process state\n" } : f,
);
assert.deepEqual(rules(mutated), ["grammar-outside-contract:skills/gauntlet-handoff/SKILL.md"]);

console.log("brief-contract lint fixtures pass");
