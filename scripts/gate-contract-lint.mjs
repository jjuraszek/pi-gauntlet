import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CONTRACT = "doc/gate-contract.md";
const MENU = "skills/brainstorming/reference/menu-layout.md";
const TOKEN = /^[A-Za-z0-9.-]+$/;

function markdown(text) {
  const lines = text.split("\n");
  const headings = [];
  const blocks = [];
  const prose = [];
  let fence;
  lines.forEach((line, index) => {
    if (fence) {
      const close = line.match(/^ {0,3}(`+|~+)\s*$/)?.[1];
      if (close?.[0] === fence.char && close.length >= fence.length) {
        blocks.push({ start: fence.start, end: index, first: lines.slice(fence.start + 1, index).find((s) => s.trim())?.trim() });
        fence = undefined;
      }
      return;
    }
    const open = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (open) { fence = { char: open[1][0], length: open[1].length, start: index }; return; }
    const heading = line.match(/^(#{1,6})\s+/);
    if (heading) headings.push({ start: index, level: heading[1].length, text: line });
    prose.push({ index, text: line });
  });
  return { lines, headings, blocks, prose };
}

function linked(text, file, target, root) {
  return [...text.matchAll(/\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+"[^"]*")?\)/g)].some((m) => {
    const path = m[1].split("#")[0];
    return path && !/^(?:[a-z]+:|\/)/i.test(path) && resolve(root, dirname(file), path) === resolve(root, target) && existsSync(join(root, target));
  });
}

export function lintGateContract(root) {
  const read = (file) => existsSync(join(root, file)) ? readFileSync(join(root, file), "utf8") : null;
  const contract = read(CONTRACT);
  if (contract === null) return [`${CONTRACT}: missing contract`];
  const diagnostics = [];
  const rows = [];
  const contractDoc = markdown(contract);
  let table;
  for (let i = 0; i < contractDoc.lines.length; i++) {
    const line = contractDoc.lines[i];
    const tableHeading = contractDoc.headings.find((h) => h.start === i);
    if (tableHeading) { table = /^## Gates\s*$/.test(line) ? "gate" : /^## Terminals\s*$/.test(line) ? "terminal" : undefined; continue; }
    if (!table || !line.trim().startsWith("|")) continue;
    const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((s) => s.trim().replace(/^`(.*)`$/, "$1"));
    if (cells.every((s) => /^:?-+:?$/.test(s)) || cells[0] === "gate id" || cells[0] === "skill") continue;
    const error = (reason) => diagnostics.push(`${CONTRACT}:${i + 1} parse error: ${reason}`);
    if (cells.length !== (table === "gate" ? 5 : 4)) { error("wrong column count"); continue; }
    let id, kind, file, site, literal, count;
    if (table === "gate") {
      [id, kind, file, site] = cells;
      if (id.split("/").length !== 2 || !id.split("/").every((s) => TOKEN.test(s)) || !["gate", "question"].includes(kind)) { error("invalid gate id or kind"); continue; }
      literal = kind === "gate" ? `gauntlet: gate=${id}` : "gauntlet: question";
      count = cells[4].match(/\btemplates=(\d+)\b/)?.[1];
    } else {
      const [skill, ending, report, lineText] = cells;
      id = `${skill}/${ending}`;
      [file, site] = report.split(" § ");
      literal = lineText;
      if (!TOKEN.test(skill) || !/^(?:gauntlet: done [A-Za-z0-9.-]+(?:=[A-Za-z0-9.-]+)?(?:,[A-Za-z0-9.-]+(?:=[A-Za-z0-9.-]+)?)*|gauntlet: stuck(?: .*)?)$/.test(literal)) { error("invalid terminal"); continue; }
    }
    const text = file && read(file);
    if (text === null || text === undefined) { error(`missing file ${file}`); continue; }
    const doc = markdown(text);
    const heading = doc.headings.find((h) => h.text.startsWith(site) && /^#{1,6}\s/.test(site));
    if (!heading) { error(`absent heading ${site}`); continue; }
    if (kind === "gate" && rows.some((r) => r.kind === "gate" && r.file === file && r.site === site)) { error(`duplicate gate file/site ${file} ${site}`); continue; }
    const start = heading.start;
    const end = doc.headings.find((h) => h.start > start && h.level <= heading.level)?.start ?? doc.lines.length;
    const blocks = doc.blocks.filter((b) => b.start > start && b.end < end);
    const marked = blocks.filter((b) => b.first === literal || b.first?.startsWith(literal + " recommended="));
    const sentence = doc.prose.some((p) => p.index > start && p.index < end && p.text.split(/(?<=[.!?])\s+|\|/).some((part) => {
      const text = part.trim().replace(/^(?:[-*+]|\d+[.)])\s+/, "");
      return text.startsWith("Start the message with") && text.includes(`\`${literal}\``);
    }));
    if (count ? marked.length !== Number(count) : !marked.length && !sentence) diagnostics.push(`${table} ${id} not found at ${file} ${site}`);
    rows.push({ file, site, kind, start, end });
  }
  for (const file of new Set(rows.filter((r) => r.kind).map((r) => r.file))) {
    if (!linked(read(file), file, MENU, root)) diagnostics.push(`${file}: no resolving menu-layout citation`);
  }
  function scan(dir) {
    if (!existsSync(join(root, dir))) return;
    for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
      const file = `${dir}/${entry.name}`;
      if (entry.isDirectory()) scan(file);
      else if (file.endsWith(".md") && file !== MENU) {
        read(file).split("\n").forEach((line, index) => {
          if (rows.some((r) => r.file === file && index >= r.start && index < r.end)) return;
          for (const match of line.matchAll(/gauntlet: (gate=[A-Za-z0-9.-]+\/[A-Za-z0-9.-]+|done\b|stuck\b)/g)) diagnostics.push(`${file}:${index + 1} gauntlet: ${match[1].split("=")[0]} not in ${CONTRACT}`);
        });
      }
    }
  }
  scan("skills");
  for (const file of ["README.md", "AGENTS.md"]) if (!linked(read(file) ?? "", file, CONTRACT, root)) diagnostics.push(`${CONTRACT} not linked from ${file}`);
  const rules = read(MENU) ?? "";
  for (const kind of ["gate", "question", "done", "stuck"]) if (!new RegExp(`gauntlet: ${kind}\\b`).test(rules)) diagnostics.push(`menu-layout.md: missing line kind ${kind}`);
  if (!rules.includes("[A-Za-z0-9.-]+")) diagnostics.push("menu-layout.md: missing charset [A-Za-z0-9.-]+");
  return diagnostics;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const diagnostics = lintGateContract(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), ".."));
  for (const diagnostic of diagnostics) console.error(diagnostic);
  if (diagnostics.length) process.exitCode = 1;
}
