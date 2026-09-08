// Pure plan-checker library. NO pi runtime import: this module is imported
// by plan-check.test.ts (node --test), which runs outside pi, where
// @earendil-works/pi-coding-agent is unresolvable. extensions/phase-tracker.ts
// owns the pi-facing tool registration and the real FsPort.

import { createHash } from "node:crypto";

export interface PlanCheckFinding {
  check: string;
  line: number;
  text: string;
  reason: string;
}

export interface FsPort {
  exists(path: string): boolean;
  glob(pattern: string): string[];
}

export function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

const BANNED_TOKENS = ["TODO", "TBD", "xxx", "[fill in]", "<example>", "etc.", "probably", "something like"];

interface Anchor {
  heading: string;
  start: number;
  end: number;
}

interface FileEntry {
  kind: "create" | "modify" | "test";
  line: number;
  text: string;
  path: string;
}

interface Task {
  number: number;
  line: number;
  text: string;
  bodyStartLine: number;
  bodyEndLine: number;
  waveNumber: number;
  filesBlockMissing: boolean;
  files: FileEntry[];
  specAnchorLine: number | undefined;
  anchors: Anchor[];
  anchorParseError: boolean;
}

interface Wave {
  number: number;
  line: number;
  text: string;
  label: string;
  soloLine: number | undefined;
  soloReason: string | undefined;
}

interface CoverageRow {
  line: number;
  text: string;
  anchorCell: string;
  requirementCell: string;
  ownerCell: string;
  isMechanical: boolean;
  isWaived: boolean;
  ownerTasks: number[];
  ownerMalformed: boolean;
  isVerification: boolean;
  anchor: Anchor | undefined;
}

interface Header {
  specPathLine: number | undefined;
  specPath: string | undefined;
  verificationLine: number | undefined;
  verificationText: string | undefined;
  separatorLine: number | undefined;
}

interface ParsedPlan {
  lines: string[];
  header: Header;
  waves: Wave[];
  tasks: Task[];
  coverageTableFound: boolean;
  coverageRows: CoverageRow[];
}

interface SpecHeading {
  line: number;
  level: number;
  title: string;
}

function fenceMask(lines: string[]): boolean[] {
  const mask: boolean[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      mask.push(inFence);
      inFence = !inFence;
    } else {
      mask.push(inFence);
    }
  }
  return mask;
}

const ANCHOR_RE = /\u00a7\s*"([^"]+)"\s*L(\d+)(?:-L(\d+))?/g;

function parseAnchors(text: string): Anchor[] {
  const anchors: Anchor[] = [];
  const re = new RegExp(ANCHOR_RE.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    anchors.push({ heading: m[1], start: Number(m[2]), end: m[3] !== undefined ? Number(m[3]) : Number(m[2]) });
  }
  return anchors;
}

function parsePlan(planText: string): ParsedPlan {
  const lines = planText.split("\n");
  const mask = fenceMask(lines);

  let separatorLine: number | undefined;
  for (let i = 0; i < lines.length; i++) {
    if (!mask[i] && lines[i].trim() === "---") {
      separatorLine = i + 1;
      break;
    }
  }

  const headerRangeEnd = separatorLine ?? lines.length;
  let specPathLine: number | undefined;
  let specPath: string | undefined;
  let verificationLine: number | undefined;
  let verificationText: string | undefined;
  for (let i = 0; i < headerRangeEnd; i++) {
    if (mask[i]) continue;
    const line = lines[i];
    if (specPathLine === undefined && /^\*\*Spec:\*\*/.test(line) && !line.includes("\u00a7")) {
      specPathLine = i + 1;
      specPath = line
        .replace(/^\*\*Spec:\*\*/, "")
        .trim()
        .replace(/^`|`$/g, "");
    }
    if (verificationLine === undefined && /^\*\*Verification:\*\*/.test(line)) {
      verificationLine = i + 1;
      verificationText = line.replace(/^\*\*Verification:\*\*/, "").trim();
    }
  }

  const waveRe = /^## Wave (\d+) (\u2014|-) (.+)$/;
  const taskRe = /^### Task (\d+): (.*)$/;
  const headingBoundaryRe = /^#{2,3}\s/;

  const waves: Wave[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (mask[i]) continue;
    const m = waveRe.exec(lines[i]);
    if (!m) continue;
    let soloLine: number | undefined;
    let soloReason: string | undefined;
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j++;
    if (j < lines.length) {
      const sm = /^Solo: (.+)$/.exec(lines[j]);
      if (sm) {
        soloLine = j + 1;
        soloReason = sm[1];
      }
    }
    waves.push({ number: Number(m[1]), line: i + 1, text: lines[i], label: m[3], soloLine, soloReason });
  }

  const taskHeaderIdxs: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (mask[i]) continue;
    if (taskRe.test(lines[i])) taskHeaderIdxs.push(i);
  }

  const tasks: Task[] = [];
  for (const i of taskHeaderIdxs) {
    const m = taskRe.exec(lines[i])!;
    let bodyEndIdx = lines.length - 1;
    for (let k = i + 1; k < lines.length; k++) {
      if (mask[k]) continue;
      if (headingBoundaryRe.test(lines[k])) {
        bodyEndIdx = k - 1;
        break;
      }
    }
    let waveNumber = -1;
    for (const w of waves) {
      if (w.line - 1 <= i) waveNumber = w.number;
    }

    let filesLine: number | undefined;
    const files: FileEntry[] = [];
    let specAnchorLine: number | undefined;
    let anchors: Anchor[] = [];
    let anchorParseError = false;

    for (let k = i; k <= bodyEndIdx; k++) {
      const line = lines[k];
      if (filesLine === undefined && /^\*\*Files:\*\*/.test(line)) {
        filesLine = k + 1;
        let p = k + 1;
        while (p <= bodyEndIdx) {
          const l = lines[p];
          if (l.trim() === "") {
            p++;
            continue;
          }
          const fm = /^- (Create|Modify|Test): (.+)$/.exec(l);
          if (!fm) break;
          files.push({
            kind: fm[1].toLowerCase() as FileEntry["kind"],
            line: p + 1,
            text: l,
            path: fm[2].trim().replace(/^`|`$/g, ""),
          });
          p++;
        }
      }
      if (specAnchorLine === undefined && /^\*\*Spec:\*\*/.test(line) && line.includes("\u00a7")) {
        specAnchorLine = k + 1;
        anchors = parseAnchors(line);
        if (anchors.length === 0) anchorParseError = true;
      }
    }

    tasks.push({
      number: Number(m[1]),
      line: i + 1,
      text: lines[i],
      bodyStartLine: i + 1,
      bodyEndLine: bodyEndIdx + 1,
      waveNumber,
      filesBlockMissing: filesLine === undefined,
      files,
      specAnchorLine,
      anchors,
      anchorParseError,
    });
  }

  let coverageTableFound = false;
  const coverageRows: CoverageRow[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (mask[i]) continue;
    if (!/^##\s+Spec coverage\s*$/i.test(lines[i])) continue;
    coverageTableFound = true;
    let p = i + 1;
    while (p < lines.length && lines[p].trim() === "") p++;
    if (p < lines.length && lines[p].trim().startsWith("|")) p++; // header row
    if (p < lines.length && lines[p].trim().startsWith("|")) p++; // separator row
    while (p < lines.length && lines[p].trim().startsWith("|")) {
      const raw = lines[p];
      const inner = raw.trim().replace(/^\|/, "").replace(/\|$/, "");
      const cells = inner.split("|").map((c) => c.trim());
      const [anchorCell = "", requirementCell = "", ownerCell = ""] = cells;
      const isMechanical = /^mechanical:\s*/i.test(requirementCell);
      const waivedMatch = /^waived:\s*(.*)$/i.exec(ownerCell);
      const isTaskList = /^Task \d+(?:\s*,\s*Task \d+)*$/.test(ownerCell);
      let isWaived = false;
      let ownerTasks: number[] = [];
      let ownerMalformed = false;
      const isVerification = ownerCell === "Verification";
      if (waivedMatch) {
        if (waivedMatch[1].trim().length === 0) {
          ownerMalformed = true;
        } else {
          isWaived = true;
        }
      } else if (isTaskList) {
        ownerTasks = [...ownerCell.matchAll(/Task (\d+)/g)].map((mm) => Number(mm[1]));
      } else if (!isVerification) {
        ownerMalformed = true;
      }
      let anchor: Anchor | undefined;
      if (anchorCell !== "-") {
        const am = new RegExp(ANCHOR_RE.source).exec(anchorCell);
        if (am) anchor = { heading: am[1], start: Number(am[2]), end: am[3] !== undefined ? Number(am[3]) : Number(am[2]) };
      }
      coverageRows.push({
        line: p + 1,
        text: raw,
        anchorCell,
        requirementCell,
        ownerCell,
        isMechanical,
        isWaived,
        ownerTasks,
        ownerMalformed,
        isVerification,
        anchor,
      });
      p++;
    }
    break;
  }

  return {
    lines,
    header: { specPathLine, specPath, verificationLine, verificationText, separatorLine },
    waves,
    tasks,
    coverageTableFound,
    coverageRows,
  };
}

function specHeadings(specLines: string[]): SpecHeading[] {
  const mask = fenceMask(specLines);
  const out: SpecHeading[] = [];
  specLines.forEach((line, idx) => {
    if (mask[idx]) return;
    const m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (m) out.push({ line: idx + 1, level: m[1].length, title: m[2].trim() });
  });
  return out;
}

function sectionEnd(headings: SpecHeading[], idx: number, totalLines: number): number {
  const h = headings[idx];
  for (let j = idx + 1; j < headings.length; j++) {
    if (headings[j].level <= h.level) return headings[j].line - 1;
  }
  return totalLines;
}

function stripLineSuffix(p: string): string {
  return p.replace(/:\d+(-\d+)?$/, "");
}

function isGlob(p: string): boolean {
  return /[*?{[\]]/.test(p);
}

function taskBodyText(task: Task, lines: string[]): string {
  return lines.slice(task.bodyStartLine - 1, task.bodyEndLine).join("\n");
}

function extractLiterals(text: string): string[] {
  const out: string[] = [];
  const re = /`([^`]+)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const inner = m[1];
    if (/<[^>]*>/.test(inner)) continue;
    out.push(inner);
  }
  return out;
}

function requiredLiteralsForRow(row: CoverageRow, specLines: string[]): string[] {
  if (!row.anchor) return [];
  const { start, end } = row.anchor;
  if (start < 1 || end > specLines.length || start > end) return [];
  const text = specLines.slice(start - 1, end).join("\n");
  return extractLiterals(text);
}

function computeRequiredLiteralsPerTask(parsed: ParsedPlan, specLines: string[]): Map<number, string[]> {
  const map = new Map<number, string[]>();
  if (!parsed.coverageTableFound) return map;
  for (const row of parsed.coverageRows) {
    if (row.ownerMalformed || row.isWaived || row.isMechanical) continue;
    const literals = requiredLiteralsForRow(row, specLines);
    if (literals.length === 0) continue;
    for (const n of row.ownerTasks) {
      const arr = map.get(n) ?? [];
      arr.push(...literals);
      map.set(n, arr);
    }
  }
  return map;
}

function checkTableClosure(parsed: ParsedPlan, specLines: string[]): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  if (!parsed.coverageTableFound) {
    findings.push({ check: "table-closure", line: 0, text: "", reason: "no '## Spec coverage' table found" });
    return findings;
  }
  const taskByNumber = new Map(parsed.tasks.map((t) => [t.number, t]));
  const coveredTasks = new Set<number>();
  const mechanicalCoveredTasks = new Set<number>();

  for (const row of parsed.coverageRows) {
    if (row.ownerMalformed) {
      findings.push({
        check: "table-closure",
        line: row.line,
        text: row.text,
        reason: "owner cell is not a 'Task <n>' list, 'Verification', or 'waived: <reason>'",
      });
      continue;
    }
    if (row.isVerification && row.isMechanical) {
      findings.push({
        check: "table-closure",
        line: row.line,
        text: row.text,
        reason: "mechanical row owner must be a Task <n>",
      });
      continue;
    }
    if (row.isWaived) continue;
    const anchorUnparseable = !row.isMechanical && !row.anchor;
    if (anchorUnparseable) {
      findings.push({
        check: "table-closure",
        line: row.line,
        text: row.text,
        reason: 'requirement row anchor is not a parseable § "heading" L<n>-L<n> anchor',
      });
    }
    if (row.isVerification) {
      if (!anchorUnparseable && requiredLiteralsForRow(row, specLines).length === 0) {
        findings.push({
          check: "table-closure",
          line: row.line,
          text: row.text,
          reason: "Verification row has no backtick literal to check against the header",
        });
      }
      continue;
    }
    for (const n of row.ownerTasks) {
      coveredTasks.add(n);
      if (row.isMechanical) mechanicalCoveredTasks.add(n);
      const task = taskByNumber.get(n);
      if (!task) {
        findings.push({
          check: "table-closure",
          line: row.line,
          text: row.text,
          reason: `row references Task ${n} but no such task exists`,
        });
        continue;
      }
      if (row.isMechanical || anchorUnparseable) continue;
      const contained = task.anchors.some(
        (a) => a.heading === row.anchor!.heading && a.start === row.anchor!.start && a.end === row.anchor!.end,
      );
      if (!contained) {
        findings.push({
          check: "table-closure",
          line: row.line,
          text: row.text,
          reason: `row anchor \u00a7 "${row.anchor.heading}" L${row.anchor.start}-L${row.anchor.end} is not in Task ${n}'s **Spec:** anchor set`,
        });
      }
    }
  }

  for (const task of parsed.tasks) {
    if (!coveredTasks.has(task.number)) {
      findings.push({
        check: "table-closure",
        line: task.line,
        text: task.text,
        reason: `Task ${task.number} does not appear as an owner in any '## Spec coverage' row`,
      });
      continue;
    }
    const anchorless = task.anchors.length === 0;
    if (anchorless && !mechanicalCoveredTasks.has(task.number)) {
      findings.push({
        check: "table-closure",
        line: task.line,
        text: task.text,
        reason: `Task ${task.number} has no **Spec:** anchor and no mechanical coverage row`,
      });
    }
  }
  return findings;
}

function checkQuoteIntegrity(parsed: ParsedPlan, specLines: string[]): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  if (!parsed.coverageTableFound) return findings;
  const taskByNumber = new Map(parsed.tasks.map((t) => [t.number, t]));
  const headerText = (parsed.header.verificationText ?? "").replaceAll("`", "");
  for (const row of parsed.coverageRows) {
    if (row.ownerMalformed || row.isWaived || row.isMechanical) continue;
    const literals = requiredLiteralsForRow(row, specLines);
    if (literals.length === 0) continue;
    if (row.isVerification) {
      for (const lit of literals) {
        if (!headerText.includes(lit)) {
          findings.push({
            check: "quote-integrity",
            line: row.line,
            text: row.text,
            reason: `verification header does not contain the required verbatim literal \`${lit}\``,
          });
        }
      }
      continue;
    }
    for (const n of row.ownerTasks) {
      const task = taskByNumber.get(n);
      if (!task) continue;
      const body = taskBodyText(task, parsed.lines);
      for (const lit of literals) {
        if (!body.includes(lit)) {
          findings.push({
            check: "quote-integrity",
            line: row.line,
            text: row.text,
            reason: `Task ${n} body does not contain the required verbatim literal \`${lit}\` from its anchored spec lines`,
          });
        }
      }
    }
  }
  return findings;
}

function checkAnchorResolution(parsed: ParsedPlan, specLines: string[]): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  const headings = specHeadings(specLines);
  for (const task of parsed.tasks) {
    if (task.specAnchorLine === undefined) continue;
    const anchorLineText = parsed.lines[task.specAnchorLine - 1];
    if (task.anchorParseError) {
      findings.push({
        check: "anchor-resolution",
        line: task.specAnchorLine,
        text: anchorLineText,
        reason: 'unparseable **Spec:** anchor line (expected \u00a7 "heading" L<n>-L<n>)',
      });
      continue;
    }
    for (const a of task.anchors) {
      const matches = headings.filter((h) => h.title === a.heading);
      if (matches.length === 0) {
        findings.push({
          check: "anchor-resolution",
          line: task.specAnchorLine,
          text: anchorLineText,
          reason: `no spec heading matches "${a.heading}"`,
        });
        continue;
      }
      if (matches.length >= 2) {
        findings.push({
          check: "anchor-resolution",
          line: task.specAnchorLine,
          text: anchorLineText,
          reason: `ambiguous spec heading "${a.heading}" matches ${matches.length} headings`,
        });
        continue;
      }
      const idx = headings.indexOf(matches[0]);
      const end = sectionEnd(headings, idx, specLines.length);
      const headingLine = matches[0].line;
      if (!(a.start <= a.end && a.start >= 1 && a.end <= specLines.length)) {
        findings.push({
          check: "anchor-resolution",
          line: task.specAnchorLine,
          text: anchorLineText,
          reason: `anchor range L${a.start}-L${a.end} is not in-bounds/non-empty`,
        });
        continue;
      }
      if (!(a.start >= headingLine && a.end <= end)) {
        findings.push({
          check: "anchor-resolution",
          line: task.specAnchorLine,
          text: anchorLineText,
          reason: `anchor range L${a.start}-L${a.end} is outside heading "${a.heading}"'s section (L${headingLine}-L${end})`,
        });
      }
    }
  }
  return findings;
}

function checkPathsExist(parsed: ParsedPlan, fs: FsPort): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  for (const task of parsed.tasks) {
    if (task.filesBlockMissing) {
      findings.push({
        check: "paths-exist",
        line: task.line,
        text: task.text,
        reason: "task is missing a **Files:** block",
      });
      continue;
    }
    for (const f of task.files) {
      if (f.kind !== "modify") continue;
      const path = stripLineSuffix(f.path);
      if (isGlob(path)) {
        let matches: string[];
        try {
          matches = fs.glob(path);
        } catch (err) {
          findings.push({
            check: "paths-exist",
            line: f.line,
            text: f.text,
            reason: `Modify: glob "${path}" is invalid: ${String(err)}`,
          });
          continue;
        }
        if (matches.length === 0) {
          findings.push({
            check: "paths-exist",
            line: f.line,
            text: f.text,
            reason: `Modify: glob "${path}" matched no files`,
          });
        }
      } else if (!fs.exists(path)) {
        findings.push({
          check: "paths-exist",
          line: f.line,
          text: f.text,
          reason: `Modify: path "${path}" does not exist`,
        });
      }
    }
  }
  return findings;
}

function checkPlaceholderScan(parsed: ParsedPlan, requiredLiterals: Map<number, string[]>): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  const lineTask = new Map<number, Task>();
  for (const t of parsed.tasks) {
    for (let ln = t.bodyStartLine; ln <= t.bodyEndLine; ln++) lineTask.set(ln, t);
  }
  parsed.lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    const lower = line.toLowerCase();
    const task = lineTask.get(lineNo);
    const literals = task ? (requiredLiterals.get(task.number) ?? []) : [];
    const exemptSpans: [number, number][] = [];
    for (const lit of literals) {
      let from = 0;
      for (;;) {
        const at = line.indexOf(lit, from);
        if (at === -1) break;
        exemptSpans.push([at, at + lit.length]);
        from = at + lit.length;
      }
    }
    for (const token of BANNED_TOKENS) {
      const tokenLower = token.toLowerCase();
      let from = 0;
      for (;;) {
        const at = lower.indexOf(tokenLower, from);
        if (at === -1) break;
        const end = at + token.length;
        const exempt = exemptSpans.some(([s, e]) => at >= s && end <= e);
        if (!exempt) {
          findings.push({
            check: "placeholder-scan",
            line: lineNo,
            text: line,
            reason: `banned placeholder token "${token}" found`,
          });
        }
        from = at + token.length;
      }
    }
  });
  return findings;
}

function fileEntries(task: Task): { path: string; kind: "literal" | "glob" }[] {
  return task.files.map((f) => {
    const p = stripLineSuffix(f.path);
    return { path: p, kind: (isGlob(p) ? "glob" : "literal") as "literal" | "glob" };
  });
}

function checkWaveFileDisjointness(parsed: ParsedPlan, fs: FsPort): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  const globCache = new Map<string, string[] | Error>();
  const expand = (pattern: string): string[] | Error => {
    const cached = globCache.get(pattern);
    if (cached !== undefined) return cached;
    let result: string[] | Error;
    try {
      result = fs.glob(pattern);
    } catch (err) {
      result = err instanceof Error ? err : new Error(String(err));
    }
    globCache.set(pattern, result);
    return result;
  };

  for (const wave of parsed.waves) {
    const tasks = parsed.tasks.filter((t) => t.waveNumber === wave.number);
    if (tasks.length < 2) continue;
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        const a = fileEntries(tasks[i]);
        const b = fileEntries(tasks[j]);
        for (const ea of a) {
          for (const eb of b) {
            let overlap = false;
            let errFinding: PlanCheckFinding | undefined;
            if (ea.kind === "literal" && eb.kind === "literal") {
              overlap = ea.path === eb.path;
            } else if (ea.kind === "glob" && eb.kind === "literal") {
              const exp = expand(ea.path);
              if (exp instanceof Error) errFinding = globErrFinding(wave, ea.path, exp);
              else overlap = exp.includes(eb.path);
            } else if (ea.kind === "literal" && eb.kind === "glob") {
              const exp = expand(eb.path);
              if (exp instanceof Error) errFinding = globErrFinding(wave, eb.path, exp);
              else overlap = exp.includes(ea.path);
            } else {
              const expA = expand(ea.path);
              const expB = expand(eb.path);
              if (expA instanceof Error) errFinding = globErrFinding(wave, ea.path, expA);
              else if (expB instanceof Error) errFinding = globErrFinding(wave, eb.path, expB);
              else overlap = expA.some((p) => expB.includes(p));
            }
            if (errFinding) {
              findings.push(errFinding);
              continue;
            }
            if (overlap) {
              findings.push({
                check: "wave-file-disjointness",
                line: wave.line,
                text: wave.text,
                reason: `Task ${tasks[i].number} and Task ${tasks[j].number} in Wave ${wave.number} both declare "${ea.path}" / "${eb.path}"`,
              });
            }
          }
        }
      }
    }
  }
  return findings;
}

function globErrFinding(wave: Wave, pattern: string, err: Error): PlanCheckFinding {
  return {
    check: "wave-file-disjointness",
    line: wave.line,
    text: wave.text,
    reason: `invalid glob pattern "${pattern}": ${err.message}`,
  };
}

function checkSoloLine(parsed: ParsedPlan): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  for (const wave of parsed.waves) {
    const count = parsed.tasks.filter((t) => t.waveNumber === wave.number).length;
    if (count !== 1) continue;
    if (wave.soloLine === undefined || !wave.soloReason || wave.soloReason.trim().length === 0) {
      findings.push({
        check: "solo-line",
        line: wave.line,
        text: wave.text,
        reason: `single-task Wave ${wave.number} is missing a 'Solo: <reason>' line directly under its header`,
      });
    }
  }
  return findings;
}

function checkHeaderEntrypoint(parsed: ParsedPlan): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  if (parsed.header.verificationText === undefined || parsed.header.separatorLine === undefined) {
    findings.push({
      check: "header-entrypoint",
      line: 0,
      text: "",
      reason: "missing header **Verification:** line or '---' separator",
    });
    return findings;
  }
  const entrypoint = parsed.header.verificationText.trim();
  if (!entrypoint) return findings;

  const waveBoundaryRe = /^##\s/;
  const inScope = new Set<number>();
  for (const wave of parsed.waves) {
    const hIdx = wave.line - 1;
    let endIdx = parsed.lines.length - 1;
    for (let idx = hIdx + 1; idx < parsed.lines.length; idx++) {
      if (waveBoundaryRe.test(parsed.lines[idx])) {
        endIdx = idx - 1;
        break;
      }
    }
    for (let idx = hIdx; idx <= endIdx; idx++) inScope.add(idx + 1);
  }

  for (const ln of [...inScope].sort((a, b) => a - b)) {
    const line = parsed.lines[ln - 1];
    if (line.includes(entrypoint)) {
      findings.push({
        check: "header-entrypoint",
        line: ln,
        text: line,
        reason: `header entrypoint "${entrypoint}" also appears outside the header (must be header-only)`,
      });
    }
  }
  return findings;
}

function checkWaiverLiteral(parsed: ParsedPlan): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  for (const row of parsed.coverageRows) {
    if (!row.isWaived) continue;
    if (!/`[^`]+`/.test(row.requirementCell)) continue;
    findings.push({
      check: "waiver-literal",
      line: row.line,
      text: row.text,
      reason: "waived row names a code literal; waive only requirements that exclude work",
    });
  }
  return findings;
}

export function checkPlan(planText: string, specText: string, fs: FsPort): PlanCheckFinding[] {
  try {
    const parsed = parsePlan(planText);
    const findings: PlanCheckFinding[] = [];

    if (parsed.waves.length === 0 && parsed.tasks.length === 0) {
      if (parsed.waves.length === 0) {
        findings.push({
          check: "input",
          line: 0,
          text: "",
          reason: "no wave headers found (expected '## Wave N \u2014 label' or '## Wave N - label')",
        });
      }
      if (parsed.tasks.length === 0) {
        findings.push({
          check: "input",
          line: 0,
          text: "",
          reason: "no task headers found (expected '### Task N: label')",
        });
      }
    }

    const specLines = specText.split("\n");
    findings.push(...checkTableClosure(parsed, specLines));
    findings.push(...checkQuoteIntegrity(parsed, specLines));
    findings.push(...checkAnchorResolution(parsed, specLines));
    findings.push(...checkPathsExist(parsed, fs));
    const requiredLiterals = computeRequiredLiteralsPerTask(parsed, specLines);
    findings.push(...checkPlaceholderScan(parsed, requiredLiterals));
    findings.push(...checkWaveFileDisjointness(parsed, fs));
    findings.push(...checkSoloLine(parsed));
    findings.push(...checkHeaderEntrypoint(parsed));
    findings.push(...checkWaiverLiteral(parsed));
    return findings;
  } catch (err) {
    const message = String(err instanceof Error ? err.message : err);
    return [
      {
        check: "internal",
        line: 0,
        text: "",
        reason: message.split("\n")[0],
      },
    ];
  }
}
