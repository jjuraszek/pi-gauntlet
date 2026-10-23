import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

// The handoff-brief process-state grammar lives in exactly one file under skills/** (#40):
// the producer (gauntlet-handoff) and consumer (gauntlet-resume) cite it and inline nothing.
export const CONTRACT_FILE = "skills/gauntlet-resume/reference/brief-contract.md";
export const CITING_SKILLS = ["skills/gauntlet-handoff/SKILL.md", "skills/gauntlet-resume/SKILL.md"];
export const CITE = "reference/brief-contract.md";

// Line-anchored grammar lines; inline mentions inside prose or table cells never match.
export const GRAMMAR_PATTERNS = [
  /^## Process state\s*$/m,
  /^Active task: /m,
  /^Ledger: /m,
  /^Last decision: /m,
  /^Gate history not restored - re-validate before advancing\.$/m,
];

// files: [{ rel, text }] with rel repo-relative, forward slashes.
// Returns [{ rule, file, text }]; rule is grammar-outside-contract | grammar-missing | cite-missing.
export function lintBriefGrammar(files) {
  const findings = [];
  for (const pattern of GRAMMAR_PATTERNS) {
    let inContract = false;
    for (const { rel, text } of files) {
      const m = text.match(pattern);
      if (!m) continue;
      if (rel === CONTRACT_FILE) inContract = true;
      else findings.push({ rule: "grammar-outside-contract", file: rel, text: m[0].trim() });
    }
    if (!inContract) findings.push({ rule: "grammar-missing", file: CONTRACT_FILE, text: pattern.source });
  }
  for (const rel of CITING_SKILLS) {
    const f = files.find((x) => x.rel === rel);
    if (!f || !f.text.includes(CITE)) findings.push({ rule: "cite-missing", file: rel, text: CITE });
  }
  return findings;
}

export function readSkillFiles(root) {
  const out = [];
  const scan = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) scan(p);
      else if (entry.isFile() && p.endsWith(".md")) {
        out.push({ rel: relative(root, p).split("\\").join("/"), text: readFileSync(p, "utf8") });
      }
    }
  };
  scan(join(root, "skills"));
  return out;
}
