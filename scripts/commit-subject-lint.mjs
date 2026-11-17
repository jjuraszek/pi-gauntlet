import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const LABEL = /\b(?:loop: |amend: |grant: |plan: |resume: |fix: <)/g;

function markdownFiles(root, dir, recursive) {
  if (!existsSync(join(root, dir))) return [];
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory() && recursive) return markdownFiles(root, file, true);
    return entry.isFile() && entry.name.endsWith(".md") ? [file] : [];
  });
}

export function lintCommitSubjects(root) {
  const files = [...markdownFiles(root, "skills", true), ...markdownFiles(root, "agents", false)].sort();
  const findings = [];
  for (const file of files) {
    const lines = readFileSync(join(root, file), "utf8").split(/\r?\n/);
    let fence;
    for (const [index, raw] of lines.entries()) {
      const marker = raw.match(/^ {0,3}(`{3,}|~{3,})/);
      if (marker) {
        if (!fence) fence = marker[1];
        else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = undefined;
        continue;
      }
      for (const match of raw.matchAll(LABEL)) {
        const prefix = raw.slice(0, match.index);
        const context = `${lines[index - 1] ?? ""}\n${prefix}`;
        if (/\breason[`"']?(?:\s*[:=])?\s*[`"']?\s*$/i.test(context)) continue;
        // A label starts a subject value, not a phrase such as "Standing grant:"
        // or a tracker reason embedded in "skip brainstorm resume:".
        const literal = /[`"']\s*$/.test(prefix);
        const subject = /\bsubject(?:\s+(?:is|starting with|starts with))?\s*[:=]?\s*$/i.test(context.replace(/[*_]/g, ""));
        const argument = /(?:-m|--message|--subject)(?:=|\s+)\s*$/.test(prefix);
        const markdown = /(?:^\s*(?:[-*+>]|\d+[.)]|#{1,6})\s+|\|\s*)[*_]*$/.test(prefix);
        const standalone = !prefix.trim() && (fence || index === 0 || !lines[index - 1].trim());
        if (literal || subject || argument || markdown || standalone) {
          findings.push({ path: file, line: index + 1, text: raw.trim() });
          break;
        }
      }
    }
  }
  return findings;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const findings = lintCommitSubjects(process.cwd());
  for (const { path, line, text } of findings) console.error(`${path}:${line}: retired commit subject label: ${text}`);
  process.exitCode = findings.length ? 1 : 0;
}
