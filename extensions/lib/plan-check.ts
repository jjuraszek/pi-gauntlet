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
  exists(path: string, leg?: string): boolean;
  glob(pattern: string, leg?: string): string[];
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

interface TestsBullet {
  line: number;
  text: string;
  value: string;
}

interface Task {
  orchestrator?: string;
  leg?: string;
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
  testsHeadingLine: number | undefined;
  testsMisplacedLines: number[];
  tests: TestsBullet[];
  testsVia: TestsBullet[];
  testsBaseline: TestsBullet[];
  testsNone: TestsBullet[];
  testsMalformed: TestsBullet[];
}

interface Wave {
  number: number;
  line: number;
  text: string;
  label: string;
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
  happyPathLine: number | undefined;
  happyPathText: string | undefined;
  happyPathCommand: string | undefined;
  separatorLine: number | undefined;
}

export interface ParsedPlan {
  lines: string[];
  header: Header;
  waves: Wave[];
  tasks: Task[];
  coverageTableFound: boolean;
  coverageRows: CoverageRow[];
  openQuestions: { findings: PlanCheckFinding[]; output: Set<number> };
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
const HAPPY_PATH_RE = /^(\S.*?) - `([^`]+)`(?: \(~\d+(?:s|m|h)\))?$/;

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
  let happyPathLine: number | undefined;
  let happyPathText: string | undefined;
  let happyPathCommand: string | undefined;
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
    if (happyPathLine === undefined && /^\*\*Happy path:\*\*/.test(line)) {
      happyPathLine = i + 1;
      happyPathText = line.replace(/^\*\*Happy path:\*\*/, "").trim();
      happyPathCommand = HAPPY_PATH_RE.exec(happyPathText)?.[2];
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
    waves.push({ number: Number(m[1]), line: i + 1, text: lines[i], label: m[3] });
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
      if (filesLine === undefined && /^(?:\*\*Files:\*\*|Files:)/.test(line)) {
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

    let testsHeadingLine: number | undefined;
    const testsMisplacedLines: number[] = [];
    const tests: TestsBullet[] = [];
    const testsVia: TestsBullet[] = [];
    const testsBaseline: TestsBullet[] = [];
    const testsNone: TestsBullet[] = [];
    const testsMalformed: TestsBullet[] = [];

    let headingIdx = -1;
    if (filesLine !== undefined) {
      let lastEntry = filesLine - 1;
      let p = filesLine;
      while (p <= bodyEndIdx) {
        const l = lines[p];
        if (l.trim() === "") { p++; continue; }
        if (/^- \w+: /.test(l)) { lastEntry = p; p++; continue; }
        break;
      }
      let q = lastEntry + 1;
      while (q <= bodyEndIdx && lines[q].trim() === "") q++;
      if (q <= bodyEndIdx && !mask[q] && lines[q] === "**Tests:**") {
        headingIdx = q;
        testsHeadingLine = q + 1;
      }
    }
    for (let k = i; k <= bodyEndIdx; k++) {
      if (mask[k] || k === headingIdx) continue;
      if (/^\*\*Tests:\*\*/.test(lines[k])) testsMisplacedLines.push(k + 1);
    }
    if (headingIdx !== -1) {
      for (let p = headingIdx + 1; p <= bodyEndIdx; p++) {
        const l = lines[p];
        if (l.trim() === "") continue;
        if (mask[p] || !l.startsWith("- ") || l.startsWith("- [ ]")) break;
        const cmd = /^- `([^`]+)`$/.exec(l);
        const via = /^- via: (\S.*)$/.exec(l);
        const none = /^- none: (\S.*)$/.exec(l);
        const baseline = /^- baseline: (\S.*)$/.exec(l);
        const bullet = { line: p + 1, text: l, value: (cmd ?? via ?? none ?? baseline)?.[1] ?? "" };
        if (cmd) tests.push(bullet);
        else if (via) testsVia.push(bullet);
        else if (none) testsNone.push(bullet);
        else if (baseline) testsBaseline.push(bullet);
        else testsMalformed.push(bullet);
      }
    }

    tasks.push({
      number: Number(m[1]),
      line: i + 1,
      text: lines[i],
      bodyStartLine: i + 1,
      bodyEndLine: bodyEndIdx + 1,
      waveNumber,
      orchestrator: lines.slice(i + 1, bodyEndIdx + 1).map(line => /^Orchestrator: (.+)$/.exec(line)).find(match => match)?.[1],
      filesBlockMissing: filesLine === undefined,
      files,
      specAnchorLine,
      anchors,
      anchorParseError,
      testsHeadingLine,
      testsMisplacedLines,
      tests,
      testsVia,
      testsBaseline,
      testsNone,
      testsMalformed,
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

  const questionFindings: PlanCheckFinding[] = [];
  const questionOutput = new Set<number>();
  let inSection = false;
  let row = false;
  let inOutput = false;
  let sentinel: number | undefined;
  let contentCount = 0;
  const malformed = (idx: number) => questionFindings.push({ check: "open-questions", line: idx + 1, text: lines[idx], reason: "## Open Questions malformed: expected `- ` rows or `- none`" });
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    if (!mask[idx] && /^## /.test(line)) {
      if (inSection && sentinel !== undefined && contentCount !== 1) malformed(sentinel);
      inSection = line === "## Open Questions";
      row = false;
      inOutput = false;
      sentinel = undefined;
      contentCount = 0;
      continue;
    }
    if (!inSection) continue;
    if (inOutput) {
      questionOutput.add(idx);
      if (/^\s+```/.test(line)) inOutput = false;
      continue;
    }
    if (!line.trim()) continue;
    contentCount++;
    if (/^- \S/.test(line)) {
      row = line !== "- none";
      if (row) questionFindings.push({ check: "open-questions", line: idx + 1, text: line, reason: `plan has open questions: ${line}` });
      else sentinel = idx;
    } else if (row && /^\s+\S/.test(line)) {
      if (/^\s+```/.test(line)) {
        let end = idx + 1;
        while (end < lines.length && !/^\s+```/.test(lines[end])) {
          if (lines[end].trim() && !/^\s+/.test(lines[end])) break;
          end++;
        }
        if (end < lines.length && /^\s+```/.test(lines[end])) {
          inOutput = true;
          questionOutput.add(idx);
        }
      }
    } else {
      malformed(idx);
      row = false;
    }
  }
  if (inSection && sentinel !== undefined && contentCount !== 1) malformed(sentinel);

  return {
    lines,
    openQuestions: { findings: questionFindings, output: questionOutput },
    header: { specPathLine, specPath, verificationLine, verificationText, happyPathLine, happyPathText, happyPathCommand, separatorLine },
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

function norm(s: string): string {
  return s.replaceAll("`", "").replace(/\s+/g, " ").trim();
}

function backtickSpans(s: string): string[] {
  const out: string[] = [];
  const re = /`([^`]+)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) out.push(m[1]);
  return out;
}

function commandSegments(cmd: string): string[] {
  return norm(cmd).split(/\s*(?:&&|\|\||;|\|)\s*/).map((s) => s.trim()).filter(Boolean);
}

function headerSegments(parsed: ParsedPlan): string[] {
  const values = [parsed.header.verificationText ?? "", parsed.header.happyPathCommand ?? ""].filter(Boolean);
  return values
    .flatMap((value) => {
      const spans = backtickSpans(value);
      const parts = spans.length > 0 ? spans : [value];
      return parts.flatMap((p) => norm(p).split(/\s*(?:&&|\|\||;|,)\s*/));
    })
    .map((s) => s.trim())
    .filter(Boolean);
}

const RUN_RE = /^\s*(- \[ \] )?Run:\s*(.*)$/;

function runPayloadSegments(line: string): string[] | undefined {
  const m = RUN_RE.exec(line);
  if (!m) return undefined;
  const spans = backtickSpans(m[2]);
  return (spans.length > 0 ? spans : [m[2]]).flatMap(commandSegments);
}

const UNSUPPORTED_SHELL = ["cd ", "sh -c", "bash -c", "eval ", "$("];

function isBroadening(token: string): boolean {
  return /[*?[]/.test(token) || token.endsWith("/");
}

function checkTestsBlock(parsed: ParsedPlan, fs: FsPort): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  const push = (task: Task, line: number, text: string, reason: string) =>
    findings.push({ check: "tests-block", line, text, reason: `Task ${task.number}: ${reason}` });
  const createPaths = new Set(
    parsed.tasks.flatMap((t) => t.files.filter((f) => f.kind === "create").map((f) => `${t.leg ?? ""}\0${stripLineSuffix(f.path)}`)),
  );
  const header = headerSegments(parsed);

  for (const task of parsed.tasks) {
    const testEntries = task.files.filter((f) => f.kind === "test");
    const testPaths = testEntries.map((f) => stripLineSuffix(f.path));

    for (const f of testEntries) {
      const p = stripLineSuffix(f.path);
      if (!createPaths.has(`${task.leg ?? ""}\0${p}`) && !fs.exists(p, task.leg)) push(task, f.line, f.text, `unknown \`Test:\` path "${p}" (neither exists nor is a Create: path of any task)`);
    }

    if (task.testsMisplacedLines.length > 0) {
      for (const ln of task.testsMisplacedLines) push(task, ln, parsed.lines[ln - 1], "misplaced block: `**Tests:**` must be the bare line directly after the Files: entries");
    } else if (task.testsHeadingLine === undefined) {
      push(task, task.line, task.text, "block missing: no `**Tests:**` directly after the Files: entries");
    }
    if (task.testsHeadingLine === undefined) continue;

    const headingText = parsed.lines[task.testsHeadingLine - 1];
    if (task.tests.length === 0 && task.testsNone.length === 0) push(task, task.testsHeadingLine, headingText, "block empty: no command bullet and no `none:`");
    for (const b of task.testsMalformed) push(task, b.line, b.text, "malformed bullet: expected `- \\`command\\``, `- baseline: <evidence>`, `- via: <seam>`, or `- none: <category>`");
    if (task.testsNone.length > 1 || (task.testsNone.length > 0 && (task.tests.length > 0 || task.testsVia.length > 0))) {
      push(task, task.testsNone[0].line, task.testsNone[0].text, "contradictory block: `none:` with a command or `via:`, or more than one `none:`");
    }
    if (task.testsNone.length > 0) {
      for (const f of testEntries) push(task, f.line, f.text, "unused `Test:` path: task declares `none:`");
    }

    const anchors = testPaths.filter((p) => !isBroadening(p));
    for (const b of task.tests) {
      if (UNSUPPORTED_SHELL.some((s) => b.value.includes(s))) {
        push(task, b.line, b.text, "unsupported shell: `cd `, `sh -c`, `bash -c`, `eval `, `$(` are not allowed");
        continue;
      }
      for (const seg of commandSegments(b.value)) {
        const tokens = seg.split(" ");
        const isAnchor = (t: string) => anchors.some((p) => t === p || t.startsWith(p + "::") || t.startsWith(p + "#") || t.startsWith(p + ":"));
        if (!tokens.some(isAnchor)) push(task, b.line, b.text, `segment not anchored: "${seg}" names no Test: path of this task`);
        for (const t of tokens) {
          if (!isAnchor(t) && isBroadening(t)) push(task, b.line, b.text, `broadening selector "${t}" in "${seg}"`);
        }
        if (header.includes(seg)) push(task, b.line, b.text, `full-suite command in task: "${seg}" equals a header **Verification:** or **Happy path:** segment`);
      }
    }
  }
  return findings;
}

function baselinePolicy(parsed: ParsedPlan): { policies: string[]; local: boolean } {
  const mask = fenceMask(parsed.lines);
  const declarations = parsed.lines.flatMap((line, index) => !mask[index] && line.startsWith("**Baseline policy:**") ? [{ line, index }] : []);
  return {
    policies: declarations.map(d => d.line),
    local: declarations.length === 1 && declarations[0].index < (parsed.header.separatorLine ?? 0) && declarations[0].line === "**Baseline policy:** implement-local",
  };
}

function checkBaselineLines(parsed: ParsedPlan, fs: FsPort, local: boolean): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  const shas = new Set<string>();
  const creates = new Set(parsed.tasks.flatMap(t => t.files.filter(f => f.kind === "create").map(f => stripLineSuffix(f.path))));
  for (const task of parsed.tasks) {
    const push = (bullet: TestsBullet, reason: string) => findings.push({ check: "baseline-line", line: bullet.line, text: bullet.text, reason: `Task ${task.number}: ${reason}` });
    const paths = task.files.filter(f => f.kind === "test").map(f => stripLineSuffix(f.path)).filter(p => !isBroadening(p));
    const anchors = (command: string) => commandSegments(command).flatMap(segment => segment.split(" ").flatMap(token => paths.filter(p => token === p || token.startsWith(p + "::") || token.startsWith(p + "#") || token.startsWith(p + ":"))));
    for (const command of task.tests) {
      if (!task.testsBaseline.some(b => b.line === command.line + 1)) push(command, `command \`${command.value}\` has no baseline: bullet`);
    }
    for (const bullet of task.testsBaseline) {
      const command = task.tests.find(c => c.line + 1 === bullet.line);
      if (task.testsNone.length) push(bullet, "baseline: under a none: task");
      else if (!command) push(bullet, "baseline: not directly after its command");
      const match = /^([a-f0-9]{7,40}) (?:pass(?: via `([^`]+)`)?(?: - artifacts: (\S.*))?|skipped - (\S.*) created by this task)$/.exec(bullet.value);
      if (!match || (match[2] !== undefined && !match[2].trim()) || (match[3] !== undefined && !match[3].split(", ").every(p => p.trim().length > 0))) {
        push(bullet, `baseline: bullet malformed: ${bullet.text}`);
        continue;
      }
      shas.add(match[1]);
      if (match[4] !== undefined && command) {
        const listed = match[4].split(", ");
        const expected = new Set(anchors(command.value));
        for (const path of new Set([...expected, ...listed])) {
          if (!creates.has(path)) push(bullet, `baseline: skipped but \`${path}\` is not a Create: path`);
          else if (!expected.has(path) || !listed.includes(path)) push(bullet, `baseline: bullet malformed: ${bullet.text}`);
          else if (local && fs.exists(path, task.leg) && !parsed.lines.includes(`Baseline provenance: retained ${task.leg ?? "home"} | ${command.value} | ${bullet.value}`)) push(bullet, `baseline: existing created anchor \`${path}\` needs matching retained provenance`);
        }
        if (!expected.size || listed.length !== new Set(listed).size) push(bullet, `baseline: bullet malformed: ${bullet.text}`);
      }
      if (match[2] !== undefined) {
        const segments = commandSegments(match[2]);
        if (!segments.length) {
          push(bullet, `baseline: bullet malformed: ${bullet.text}`);
          continue;
        }
        for (const segment of segments) {
          const found = anchors(segment);
          const created = [...creates].filter(p => segment.split(" ").some(token => token === p || token.startsWith(p + "::") || token.startsWith(p + "#") || token.startsWith(p + ":")));
          for (const path of created.filter(p => !local || !fs.exists(p, task.leg))) push(bullet, `baseline: pass via \`${match[2]}\` segment \`${segment}\` anchors Create: path ${path}`);
          if (!found.some(p => (local || !creates.has(p)) && fs.exists(p, task.leg))) push(bullet, `baseline: pass via \`${match[2]}\` segment \`${segment}\` anchors no existing Test: path`);
        }
      }
    }
  }
  if (!local && shas.size > 1) findings.push({ check: "baseline-line", line: 0, text: "", reason: `baseline SHAs differ: ${[...shas].join(", ")}` });
  return findings;
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

function dropHeaderEntrypoint(literals: string[], parsed: ParsedPlan): string[] {
  const entrypoint = (parsed.header.verificationText ?? "").replaceAll("`", "");
  if (!entrypoint) return literals;
  return literals.filter((lit) => lit !== entrypoint);
}

function computeRequiredLiteralsPerTask(parsed: ParsedPlan, specLines: string[]): Map<number, string[]> {
  const map = new Map<number, string[]>();
  if (!parsed.coverageTableFound) return map;
  for (const row of parsed.coverageRows) {
    if (row.ownerMalformed || row.isWaived || row.isMechanical) continue;
    const literals = row.isVerification
      ? requiredLiteralsForRow(row, specLines)
      : dropHeaderEntrypoint(requiredLiteralsForRow(row, specLines), parsed);
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
    const taskLiterals = dropHeaderEntrypoint(literals, parsed);
    for (const n of row.ownerTasks) {
      const task = taskByNumber.get(n);
      if (!task) continue;
      const body = taskBodyText(task, parsed.lines);
      for (const lit of taskLiterals) {
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
          matches = fs.glob(path, task.leg);
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
      } else if (!fs.exists(path, task.leg)) {
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
    if (parsed.openQuestions.output.has(idx)) return;
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

function fileEntries(task: Task): { path: string; kind: "literal" | "glob"; role: "test" | "write" }[] {
  return task.files.map((f) => {
    const p = stripLineSuffix(f.path);
    return {
      path: p,
      kind: (isGlob(p) ? "glob" : "literal") as "literal" | "glob",
      role: f.kind === "test" ? "test" : "write",
    };
  });
}

function checkWaveFileDisjointness(parsed: ParsedPlan, fs: FsPort): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  const globCache = new Map<string, string[] | Error>();
  const expand = (pattern: string, leg?: string): string[] | Error => {
    const key = `${leg ?? ""}\0${pattern}`;
    const cached = globCache.get(key);
    if (cached !== undefined) return cached;
    let result: string[] | Error;
    try {
      result = fs.glob(pattern, leg);
    } catch (err) {
      result = err instanceof Error ? err : new Error(String(err));
    }
    globCache.set(key, result);
    return result;
  };

  for (const wave of parsed.waves) {
    const tasks = parsed.tasks.filter((t) => t.waveNumber === wave.number);
    if (tasks.length < 2) continue;
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        if (tasks[i].leg !== tasks[j].leg) continue;
        const a = fileEntries(tasks[i]);
        const b = fileEntries(tasks[j]);
        for (const ea of a) {
          for (const eb of b) {
            if (ea.role === "test" && eb.role === "test") continue;
            let overlap = false;
            let errFinding: PlanCheckFinding | undefined;
            if (ea.kind === "literal" && eb.kind === "literal") {
              overlap = ea.path === eb.path;
            } else if (ea.kind === "glob" && eb.kind === "literal") {
              const exp = expand(ea.path, tasks[i].leg);
              if (exp instanceof Error) errFinding = globErrFinding(wave, ea.path, exp);
              else overlap = exp.includes(eb.path);
            } else if (ea.kind === "literal" && eb.kind === "glob") {
              const exp = expand(eb.path, tasks[j].leg);
              if (exp instanceof Error) errFinding = globErrFinding(wave, eb.path, exp);
              else overlap = exp.includes(ea.path);
            } else {
              const expA = expand(ea.path, tasks[i].leg);
              const expB = expand(eb.path, tasks[j].leg);
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

function checkHappyPathLine(parsed: ParsedPlan): PlanCheckFinding[] {
  const { happyPathLine, happyPathText, happyPathCommand } = parsed.header;
  if (happyPathLine === undefined || happyPathCommand !== undefined) return [];
  return [
    {
      check: "header-happy-path",
      line: happyPathLine,
      text: parsed.lines[happyPathLine - 1],
      reason: `malformed **Happy path:** line "${happyPathText ?? ""}" (expected \`<label> - \\\`<command>\\\`\` with optional \` (~<duration>)\`, duration \\d+(s|m|h))`,
    },
  ];
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

  const header = headerSegments(parsed);
  const entrypoints = [entrypoint, parsed.header.happyPathCommand].filter((e): e is string => Boolean(e));
  const executable = new Set<number>();
  for (const task of parsed.tasks) {
    for (const bullet of [...task.tests, ...task.testsVia, ...task.testsBaseline, ...task.testsNone, ...task.testsMalformed]) {
      executable.add(bullet.line);
    }
  }
  const mask = fenceMask(parsed.lines);

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
    if (executable.has(ln)) continue;
    const segments = runPayloadSegments(line);
    if (segments) {
      if (mask[ln - 1]) continue;
      const hit = segments.find((segment) => header.includes(segment));
      if (hit !== undefined) {
        findings.push({
          check: "header-entrypoint",
          line: ln,
          text: line,
          reason: `Run: segment "${hit}" equals a header **Verification:** or **Happy path:** segment (full suite belongs to the verify phase)`,
        });
      }
      continue;
    }
    const hitEntry = entrypoints.find((e) => line.includes(e));
    if (hitEntry !== undefined) {
      findings.push({
        check: "header-entrypoint",
        line: ln,
        text: line,
        reason: `header entrypoint "${hitEntry}" also appears outside the header (must be header-only)`,
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

export function parseLegs(specText: string): { repo: string; body: string; line: number }[] {
  const lines = specText.split("\n");
  const mask = fenceMask(lines);
  const legs: { repo: string; body: string; line: number }[] = [];
  let inside = false;
  let current: typeof legs[number] | undefined;
  for (const [i, line] of lines.entries()) {
    if (mask[i]) continue;
    if (/^## /.test(line)) { inside = /^## Legs\s*$/.test(line); current = undefined; continue; }
    if (!inside) continue;
    const match = /^### Leg: (\S+)\s*$/.exec(line);
    if (match) { current = { repo: match[1].toLowerCase(), body: "", line: i + 1 }; legs.push(current); }
    else if (current) current.body += line + "\n";
  }
  return legs;
}

export function legOwnership(specText: string) {
  const legs = parseLegs(specText);
  const findings: PlanCheckFinding[] = [];
  const lines = specText.split("\n");
  const mask = fenceMask(lines);
  let inAcceptance = false;
  let count = 0;
  for (const [i, line] of lines.entries()) {
    if (mask[i]) continue;
    if (/^##\s+/.test(line)) inAcceptance = /^## Acceptance criteria\s*$/i.test(line);
    else if (inAcceptance && /^- \[[ xX]\]\s+/.test(line)) count++;
  }
  const owners = Array.from({ length: count }, () => [] as string[]);
  if (legs.length > 1) {
    const seen = new Set<string>();
    for (const leg of legs) {
      const scopes = leg.body.split("\n").filter(l => /^scope:/.test(l));
      const value = scopes[0]?.slice(6).trim() ?? "";
      const ids = [...value.matchAll(/AC ([1-9]\d*)/g)].map(m => Number(m[1]));
      if (seen.has(leg.repo) || scopes.length !== 1 || (value !== "none" && (!/^AC [1-9]\d*(?:, AC [1-9]\d*)*$/.test(value) || new Set(ids).size !== ids.length || ids.some(n => n > count || !Number.isSafeInteger(n))))) {
        findings.push({ check: "leg-scope", line: leg.line, text: leg.repo, reason: "expected exactly one scope: none or scope: AC n, AC m with unique original AC indices" });
      } else for (const n of ids) owners[n - 1].push(leg.repo);
      seen.add(leg.repo);
    }
    for (const owner of owners) if (!owner.length) owner.push(legs[0].repo);
  }
  return { legs, owners, findings };
}

function coordinatedMetadata(lines: string[], legs: ReturnType<typeof parseLegs>, pairs: { ac: number; leg: string }[], add: (i: number, reason: string) => void) {
  const header = (key: string) => lines.flatMap((l, i) => l.startsWith(key + ":") ? [{ value: l.slice(key.length + 1).trim(), i }] : []);
  const one = (key: string, pattern: RegExp) => {
    const rows = header(key);
    if (rows.length !== 1 || !pattern.test(rows[0]?.value ?? "")) add(rows[0]?.i ?? 0, `invalid or missing ${key} header`);
    return rows[0]?.value;
  };
  const sha = /^[a-f0-9]{7,40}$/;
  const base = one("base", sha);
  const iterations = one("iterations", /^(?:0|[1-9]\d*)$/);
  const cap = one("cap", /^[1-9]\d*$/);
  if (!Number.isSafeInteger(Number(iterations))) add(0, "iterations must be a safe integer");
  if (!Number.isSafeInteger(Number(cap))) add(0, "cap must be a safe integer");
  for (const [i, l] of lines.entries()) {
    const m = /^(base|seeded) ([^:]+):/.exec(l);
    if (m && !legs.some(leg => leg.repo === m[2].toLowerCase())) add(i, "foreign member header");
  }
  for (const [index, leg] of legs.entries()) {
    for (const key of ["base", "seeded"]) {
      const rows = lines.flatMap((l, i) => {
        const m = /^(base|seeded) ([^:]+):\s*(.*)$/.exec(l);
        return m && m[1] === key && m[2].toLowerCase() === leg.repo ? [{ value: m[3], i }] : [];
      });
      if (rows.length !== 1 || !(key === "base" ? sha : /^(no|yes)$/).test(rows[0]?.value ?? "")) add(rows[0]?.i ?? 0, `invalid or missing ${key} ${leg.repo}`);
      if (key === "base" && index === 0 && rows[0]?.value !== base) add(rows[0]?.i ?? 0, "home base mismatch");
    }
  }
  const pending = header("pending");
  if (pending.length > 1) add(pending[1].i, "duplicate pending tuple");
  for (const row of pending) {
    const m = /^(seed|[1-9]\d*) \| (\S+) \| ([a-f0-9]{7,40})$/.exec(row.value);
    const repo = m?.[2].toLowerCase();
    if (!m || !legs.some(l => l.repo === repo) || (m[1] !== "seed" && pairs[Number(m[1]) - 1]?.leg !== repo)) add(row.i, "invalid pending tuple or target leg");
  }
  const mapping = lines.findIndex(l => l === "## Leg mapping");
  if (lines.filter(l => l === "## Leg mapping").length > 1) add(mapping, "duplicate leg mapping section");
  let i = mapping + 1;
  while (lines[i]?.trim() === "") i++;
  if (mapping < 0 || !/^\|\s*row\s*\|\s*ac\s*\|\s*leg\s*\|$/.test(lines[i] ?? "") || !/^\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|$/.test(lines[i + 1] ?? "")) { add(Math.max(mapping, 0), "missing leg mapping table"); return; }
  let count = 0;
  for (i += 2; lines[i]?.startsWith("|"); i++) {
    const cells = lines[i].split("|").slice(1, -1).map(c => c.trim());
    const expected = pairs[count];
    if (!expected || cells.length !== 3 || cells[0] !== String(count + 1) || cells[1] !== String(expected.ac) || cells[2].toLowerCase() !== expected.leg) add(i, "leg mapping must match original AC and membership order exactly once");
    count++;
  }
  if (count !== pairs.length) add(Math.max(mapping, 0), "missing leg mapping entries");
}

function checkLedger(planText: string, specText: string): PlanCheckFinding[] {
  const findings: PlanCheckFinding[] = [];
  const dispositions: boolean[] = [];
  const specLines = specText.split("\n");
  const masked = fenceMask(specLines);
  let inAcceptance = false;
  for (const [i, line] of specLines.entries()) {
    if (masked[i]) continue;
    if (/^##\s+/.test(line)) {
      inAcceptance = /^## Acceptance criteria\s*$/i.test(line);
      continue;
    }
    if (!inAcceptance) continue;
    if (/^- \[[ xX]\]\s+/.test(line)) dispositions.push(false);
    else if (dispositions.length && /^\s*(?:deviates|deferred|elsewhere):/.test(line)) dispositions[dispositions.length - 1] = true;
  }
  const ownership = legOwnership(specText);
  const pairs = ownership.owners.flatMap((owners, i) => owners.map(leg => ({ ac: i + 1, leg })));
  const coordinated = ownership.legs.length > 1;
  const expectedDispositions = coordinated ? pairs.map(pair => dispositions[pair.ac - 1]) : dispositions;
  const lines = planText.split("\n");
  const add = (i: number, reason: string) => findings.push({ check: "ledger", line: i + 1, text: lines[i] ?? "", reason });
  if (coordinated) coordinatedMetadata(lines, ownership.legs, pairs, add);
  const header = lines.findIndex(l => /^\|\s*row\s*\|\s*status\s*\|\s*attempts\s*\|\s*evidence\s*\|$/.test(l));
  if (header < 0) {
    add(0, "missing ledger table");
    return findings;
  }
  if (!/^\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|$/.test(lines[header + 1] ?? "")) add(header + 1, "missing ledger table separator");
  let count = 0;
  for (let i = header + 2; i < lines.length && lines[i].startsWith("|"); i++) {
    const cells = lines[i].split(/(?<!\\)\|/).slice(1, -1).map(c => c.trim());
    const [row, status, attempts, evidence] = cells;
    count++;
    if (cells.length !== 4 || !lines[i].endsWith("|")) { add(i, "expected four ledger cells"); continue; }
    if (row !== String(count) || count > expectedDispositions.length) add(i, "expected exactly one row per spec AC in order");
    if (!["open", "done", "failed", "cut"].includes(status)) add(i, "invalid ledger status");
    else if ((status === "cut") !== expectedDispositions[count - 1]) add(i, "status does not match spec disposition");
    if (!/^\d+$/.test(attempts) || !Number.isSafeInteger(Number(attempts))) add(i, "attempts must be a non-negative integer");
    if (!evidence && status !== "open") add(i, "evidence is required on non-open rows");
    if (/<[^>]*>|\b(?:TODO|TBD|probably)\b|etc\./i.test(evidence)) add(i, "placeholder in ledger evidence");
  }
  if (count !== expectedDispositions.length || count === 0) add(header, "expected exactly one row per spec AC");
  return findings;
}

export function checkPlan(planText: string, specText: string, fs: FsPort): { findings: PlanCheckFinding[]; parsed?: ParsedPlan; ledger: boolean } {
  const ledger = planText.split("\n", 1)[0] === "# Ledger - loop engine";
  try {
    const ownership = legOwnership(specText);
    if (ownership.findings.length) return { findings: ownership.findings, ledger };
    if (ledger) return { findings: checkLedger(planText, specText), ledger };
    const parsed = parsePlan(planText);
    const findings: PlanCheckFinding[] = [];
    if (ownership.legs.length) {
      for (const task of parsed.tasks) {
        const first = parsed.lines[task.line];
        const explicit = /^Leg: (\S+)\s*$/.exec(first ?? "");
        task.leg = explicit?.[1].toLowerCase() ?? ownership.legs[0].repo;
        if (!ownership.legs.some(l => l.repo === task.leg)) findings.push({ check: "leg-unknown", line: task.line + 1, text: first, reason: `unknown task leg ${task.leg}` });
        if (parsed.lines.slice(task.line + (explicit ? 1 : 0), task.bodyEndLine).some(l => /^Leg:/.test(l))) findings.push({ check: "leg-unknown", line: task.line, text: task.text, reason: "Leg: must be the first line after the task heading" });
      }
      if (findings.length) return { findings, parsed, ledger };
      for (const wave of parsed.waves) if (new Set(parsed.tasks.filter(t => t.waveNumber === wave.number).map(t => t.leg)).size > 1) findings.push({ check: "wave-leg", line: wave.line, text: wave.text, reason: "wave mixes task legs" });
    }

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
    findings.push(...checkTestsBlock(parsed, fs));
    const { policies, local } = baselinePolicy(parsed);
    if (policies.length && !local) findings.push({ check: "baseline-line", line: 0, text: policies.join("\n"), reason: "expected one header Baseline policy: implement-local" });
    if (ownership.legs.length) {
      const declarations = parsed.lines.slice(0, parsed.header.separatorLine ?? 0).flatMap((line, i) => {
        const m = /^Baseline (\S+): ([a-f0-9]{7,40})$/.exec(line);
        return m ? [{ repo: m[1].toLowerCase(), sha: m[2], line: i + 1 }] : [];
      });
      for (const leg of ownership.legs) {
        const tasks = parsed.tasks.filter(t => t.leg === leg.repo);
        findings.push(...checkBaselineLines({ ...parsed, tasks }, fs, local));
        const declarationsForLeg = declarations.filter(d => d.repo === leg.repo);
        if (declarationsForLeg.length !== 1) findings.push({ check: "baseline-line", line: 0, text: leg.repo, reason: "expected one Baseline declaration per leg" });
        for (const task of tasks) for (const bullet of task.testsBaseline) if (!local && bullet.value.split(" ")[0] !== declarationsForLeg[0]?.sha) findings.push({ check: "baseline-line", line: bullet.line, text: bullet.text, reason: `Task ${task.number}: baseline differs from ${leg.repo} declaration` });
      }
      for (const declaration of declarations) if (!ownership.legs.some(l => l.repo === declaration.repo)) findings.push({ check: "baseline-line", line: declaration.line, text: declaration.repo, reason: "unknown baseline leg" });
    } else findings.push(...checkBaselineLines(parsed, fs, local));
    findings.push(...parsed.openQuestions.findings);
    const requiredLiterals = computeRequiredLiteralsPerTask(parsed, specLines);
    findings.push(...checkPlaceholderScan(parsed, requiredLiterals));
    findings.push(...checkWaveFileDisjointness(parsed, fs));
    findings.push(...checkHeaderEntrypoint(parsed));
    findings.push(...checkHappyPathLine(parsed));
    findings.push(...checkWaiverLiteral(parsed));
    return { findings, parsed, ledger };
  } catch (err) {
    const message = String(err instanceof Error ? err.message : err);
    return { ledger, findings: [
      {
        check: "internal",
        line: 0,
        text: "",
        reason: message.split("\n")[0],
      },
    ] };
  }
}

export function renderManifest(parsed: ParsedPlan, planAbs: string, specAbs: string): string {
  const kinds = { create: "Create", modify: "Modify", test: "Test" };
  return [
    `manifest: ${planAbs} | spec: ${specAbs} | tasks: ${parsed.tasks.length} | waves: ${parsed.waves.length}`,
    ...parsed.tasks.map(task => JSON.stringify({
      task: task.number,
      wave: task.waveNumber,
      ...(/\bin-place\b/.test(parsed.waves.find(wave => wave.number === task.waveNumber)?.label ?? "") ? { mode: "in-place" } : {}),
      heading: task.text.replace(/^### Task \d+: /, ""),
      files: task.files.map(file => ({ kind: kinds[file.kind], path: file.path })),
      tests: task.tests.map(bullet => bullet.value),
      ...(task.leg !== undefined ? { leg: task.leg } : {}),
      ...(task.orchestrator !== undefined ? { orchestrator: task.orchestrator } : {}),
    })),
  ].join("\n");
}
