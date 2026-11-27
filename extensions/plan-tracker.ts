/**
 * Plan Tracker Extension
 *
 * A native pi tool for tracking plan progress.
 * Explicit calls keep state in result details; automatic changes store branch snapshots.
 * Shows a persistent TUI widget above the editor.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { StringEnum } from "@earendil-works/pi-ai";
import type { ExtensionAPI, ExtensionContext, Theme } from "@earendil-works/pi-coding-agent";
import { Text } from "@earendil-works/pi-tui";
import { type Static, Type } from "@sinclair/typebox";
import { checkoutOfSync } from "./lib/checkout.ts";
import { latestPlanSnapshot, MAX_STORED_LIST_BYTES, planSnapshot, PLAN_TRACKER_SNAPSHOT, TASK_STATUSES, type Task, type TaskStatus } from "./lib/plan-snapshot.ts";
import { planSpecHeader } from "./lib/telemetry-paths.ts";

interface PlanTrackerDetails { action: "init" | "add" | "update" | "status" | "clear" | "refresh"; tasks: Task[]; error?: string; }

const PlanTrackerParams = Type.Object({
  action: StringEnum(["init", "add", "update", "status", "clear", "refresh"] as const, { description: "Action to perform" }),
  path: Type.Optional(Type.String({ description: "Artifact path for refresh; relative paths resolve against the session cwd" })),
  tasks: Type.Optional(Type.Array(Type.Union([
    Type.String(),
    Type.Object({ name: Type.String(), status: StringEnum(TASK_STATUSES, { description: "Status to recreate the task with (init only)" }) }),
  ]), { description: "Tasks for init and add. A string is a pending task. init also accepts { name, status } to recreate a list with known statuses (fresh session, amendment re-init); the whole list must satisfy the pending-suffix rule." })),
  index: Type.Optional(Type.Integer({ minimum: 0, description: "Task index, 0-based (for update)" })),
  status: Type.Optional(StringEnum(TASK_STATUSES, { description: "New status (for update). failed is terminal-negative (ran and did not pass); skipped is terminal, not applicable in this run, counted as done. pending is set only by init/add; to redo a task, reopen it as in_progress, or re-init with {name, status}[] to recreate a whole list." })),
});

export type PlanTrackerInput = Static<typeof PlanTrackerParams>;

/** Indices of every pending task that has a non-pending task after it (empty = valid snapshot). */
export function validateSnapshot(tasks: Task[]): number[] {
  const offenders: number[] = [];
  let seenNonPending = false;
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].status !== "pending") seenNonPending = true;
    else if (seenNonPending) offenders.unshift(i);
  }
  return offenders;
}

function criterionDescriptions(spec: string): string[] {
  const descriptions: string[] = [];
  let inAcceptance = false;
  let disposition = false;
  let fence: string | undefined;
  for (const line of spec.split("\n")) {
    const delimiter = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
    if (delimiter && !fence) { fence = delimiter; continue; }
    if (fence) {
      if (delimiter?.[0] === fence[0] && delimiter.length >= fence.length) fence = undefined;
      else if (inAcceptance && descriptions.length && !disposition) descriptions[descriptions.length - 1] += ` ${line}`;
      continue;
    }
    if (/^#{1,2}\s/.test(line)) {
      inAcceptance = /^## Acceptance criteria\s*$/i.test(line);
      continue;
    }
    if (!inAcceptance) continue;
    const criterion = /^- \[[ xX]\](?:\s+(.*))?$/.exec(line);
    if (criterion) {
      descriptions.push(criterion[1] ?? "");
      disposition = false;
    } else if (descriptions.length) {
      if (/^\s*(?:in-scope\s*$|(?:deviates|deferred|elsewhere):)/.test(line)) disposition = true;
      if (!disposition) descriptions[descriptions.length - 1] += ` ${line}`;
    }
  }
  return descriptions.map(text => text.replace(/\s+/g, " ").trim());
}

function compactDescription(description: string): string {
  if (description.length <= 80) return description;
  const boundary = description.lastIndexOf(" ", 77);
  return `${description.slice(0, Math.max(0, boundary))}...`;
}

function ledgerTasks(text: string, path: string): Task[] {
  const lines = text.split("\n");
  if (lines[0] !== "# Ledger - loop engine") {
    throw new Error(`refresh: ${path} line 1 is ${JSON.stringify(lines[0])}, not a loop ledger`);
  }
  const malformed = (index: number): never => { throw new Error(`refresh: ${path} row table malformed at line ${index + 1}`); };
  const header = lines.findIndex(line => /^\|\s*row\s*\|\s*status\s*\|\s*attempts\s*\|\s*evidence\s*\|$/.test(line));
  if (header < 0) malformed(0);
  if (!/^\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|$/.test(lines[header + 1] ?? "")) malformed(header + 1);
  const allowanceMatch = lines.slice(1, header).map(line => /^allowance:\s*([1-9]\d*)\s*$/.exec(line)).find(Boolean);
  const allowance = allowanceMatch ? Number(allowanceMatch[1]) : undefined;
  const rows: { row: number; status: string; attempts: number }[] = [];
  for (let i = header + 2; i < lines.length && lines[i].trim() && !/^#{1,2}\s/.test(lines[i]); i++) {
    const cells = lines[i].split(/(?<!\\)\|/).slice(1, -1).map(cell => cell.trim());
    if (!lines[i].startsWith("|") || !lines[i].endsWith("|") || cells.length !== 4 || !/^\d+$/.test(cells[0]) || !/^(open|done|failed|cut)$/.test(cells[1]) || !/^\d+$/.test(cells[2])) malformed(i);
    rows.push({ row: Number(cells[0]), status: cells[1], attempts: Number(cells[2]) });
  }
  if (!rows.length) malformed(header + 2);
  const byRow = new Map(rows.map(row => [row.row, row]));
  const pendingMatch = lines.map(line => /^pending: (seed|\d+) \| (\S+) \| ([a-f0-9]{7,40})$/.exec(line)).find(Boolean);
  const pending = pendingMatch && pendingMatch[1] !== "seed" ? Number(pendingMatch[1]) : undefined;
  if (pending !== undefined && !byRow.has(pending)) {
    throw new Error(`refresh: ${path} pending: names row ${pending} which is absent`);
  }
  const dispatched = new Set<number>();
  const retries = new Map<number, number>();
  let mapping: { row: number; ac: number; repo: string }[] | undefined;
  let section = "";
  for (const line of lines) {
    if (/^#{1,2}\s/.test(line)) {
      section = line;
      if (section === "## Leg mapping") mapping = [];
      continue;
    }
    if (section === "## Decisions") {
      const decision = /^row (\d+) done \| .+ \| .+$/.exec(line);
      if (decision) dispatched.add(Number(decision[1]));
      const retry = /^row (\d+) retry \| .* \| allowed attempts \d+$/.exec(line);
      if (retry) {
        const row = Number(retry[1]);
        retries.set(row, (retries.get(row) ?? 0) + 1);
      }
    } else if (section === "## Leg mapping") {
      const entry = /^\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\S+)\s*\|$/.exec(line);
      if (!entry) continue;
      const row = Number(entry[1]);
      if (!byRow.has(row)) throw new Error(`refresh: ${path} leg mapping names row ${row} which is absent`);
      mapping!.push({ row, ac: Number(entry[2]), repo: entry[3] });
    }
  }
  const status = (row: number): TaskStatus => {
    const value = byRow.get(row)!.status;
    if (value === "cut") return "skipped";
    if (value === "done") return dispatched.has(row) ? "complete" : "skipped";
    if (row === pending) return "in_progress";
    return value === "failed" ? "failed" : "pending";
  };
  const specRef = planSpecHeader(lines.slice(0, header).join("\n"));
  if (!specRef) throw new Error(`refresh: ${path} missing Spec reference`);
  const checkout = checkoutOfSync(path);
  if (!checkout) throw new Error(`refresh: ${path} cannot resolve repository root for Spec reference ${specRef}`);
  const specPath = resolve(checkout.toplevel, specRef);
  let spec: string;
  try {
    spec = readFileSync(specPath, "utf8");
  } catch (error) {
    throw new Error(`refresh: ${path} cannot read spec ${specPath}: ${error instanceof Error ? error.message : String(error)}`);
  }
  const descriptions = criterionDescriptions(spec);
  const entries = mapping ?? rows.map(({ row }) => ({ row, ac: row, repo: undefined }));
  return entries.sort((a, b) => a.row - b.row).map(({ row, ac, repo }) => {
    const description = descriptions[ac - 1];
    if (!description) throw new Error(`refresh: ${path} row ${row}: spec ${specPath} AC ${ac} ${description === undefined ? "is missing" : "has an empty description"}`);
    const value = byRow.get(row)!;
    const owner = repo === undefined ? "" : ` (${repo})`;
    const budget = allowance !== undefined && value.status !== "cut" && (value.status !== "done" || value.attempts > 0)
      ? `${value.attempts}/${allowance + (retries.get(row) ?? 0)}: ` : "";
    return { name: `row ${row}${owner}`, status: status(row), label: `${budget}${compactDescription(description)}${owner}` };
  });
}

function boundLedger(ctx: ExtensionContext): { path: string; text: string } | undefined {
  const branch = ctx.sessionManager.getBranch();
  for (let i = branch.length - 1; i >= 0; i--) {
    const entry = branch[i];
    if (entry.type !== "message") continue;
    const msg = entry.message;
    if (msg.role !== "toolResult" || msg.isError) continue;
    const details = msg.details as { action?: string; error?: string; status?: string; planPath?: string } | undefined;
    if (!details || details.error) continue;
    if (msg.toolName === "plan_tracker" && (details.action === "init" || details.action === "clear")) return;
    if (msg.toolName !== "plan_check" || details.status !== "pass" || !details.planPath) continue;
    const path = resolve(ctx.cwd, details.planPath);
    try {
      const text = readFileSync(path, "utf8");
      if (text.split("\n", 1)[0] === "# Ledger - loop engine") return { text, path };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    return;
  }
}

function implementing(ctx: ExtensionContext): boolean {
  const branch = ctx.sessionManager.getBranch();
  for (let i = branch.length - 1; i >= 0; i--) {
    const entry = branch[i];
    if (entry.type !== "message" || entry.message.role !== "toolResult" || entry.message.isError) continue;
    if (entry.message.toolName === "phase_tracker") {
      const d = entry.message.details as { error?: string; phases?: { implement: { status: string } } } | undefined;
      if (d?.phases && !d.error) return d.phases.implement.status === "in_progress";
    } else if (entry.message.toolName === "plan_tracker") {
      const tasks = planSnapshot(entry);
      if (tasks?.length && tasks.every(t => t.status === "complete" || t.status === "skipped")) return false;
    }
  }
  return false;
}

function latestDispatchBlocked(ctx: ExtensionContext): boolean {
  const branch = ctx.sessionManager.getBranch();
  for (let i = branch.length - 1; i >= 0; i--) {
    const entry = branch[i];
    if (entry.type !== "message") continue;
    const msg = entry.message;
    if (msg.role !== "toolResult" || msg.toolName !== "subagent") continue;
    return msg.isError === true && msg.details !== null && typeof msg.details === "object" && Object.keys(msg.details).length === 0;
  }
  return false;
}

function markedStop(ctx: ExtensionContext): boolean {
  const branch = ctx.sessionManager.getBranch();
  for (let i = branch.length - 1; i >= 0; i--) {
    const entry = branch[i];
    if (entry.type !== "message") continue;
    const msg = entry.message;
    if (msg.role === "toolResult" && msg.toolName === "subagent") return false;
    if (msg.role !== "assistant") continue;
    const line = msg.content.find(part => part.type === "text")?.text.split(/\r?\n/, 1)[0] ?? "";
    return /^gauntlet: (?:question|gate=[A-Za-z0-9.-]+\/[A-Za-z0-9.-]+(?: recommended=[0-9]+)?)$/.test(line);
  }
  return false;
}

function projectLedger(text: string, path: string, tasks: Task[]): Task[] {
  const projected = ledgerTasks(text, path);
  const kept = tasks.filter(task => !/^row \d+(?: \(\S+\))?$/.test(task.name));
  const merged = [
    ...projected.filter(task => task.status !== "pending"),
    ...kept.filter(task => task.status !== "pending"),
    ...projected.filter(task => task.status === "pending"),
    ...kept.filter(task => task.status === "pending"),
  ];
  if (validateSnapshot(merged).length) throw new Error(`refresh: ${path}: ${RULE_LINE}`);
  return merged;
}

const RULE_LINE = "Rule: pending tasks must trail every started or finished task.";
const ORDER_FIX = "Fix first, then retry: update each listed task to in_progress (working on it now), complete, failed, or skipped (not applicable in this run); or, if the list order itself is wrong, re-init with {name, status}[] keeping every task and its true status so the untouched ones trail.";
const KEEP_TASKS = "Never clear, drop tasks, or record a status the work has not actually reached.";

interface DispatchItem { agent?: string; task?: string; }
interface DispatchInput extends DispatchItem {
  tasks?: DispatchItem[];
  chain?: (DispatchItem & { parallel?: DispatchItem[] })[];
}

function wavePlan(path: string) {
  const headings = new Map<string, { wave: number; name: string }>();
  let text: string;
  try { text = readFileSync(path, "utf8"); }
  catch { return; }
  let wave: string | undefined;
  let fence: string | undefined;
  for (const line of text.split(/\r?\n/)) {
    const delimiter = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
    if (fence) {
      if (delimiter?.[0] === fence[0] && delimiter.length >= fence.length) fence = undefined;
      continue;
    }
    if (delimiter) { fence = delimiter; continue; }
    const waveHeading = /^## Wave (\d+)(?:\s|$)/.exec(line);
    if (waveHeading) wave = waveHeading[1];
    const task = /^(### Task \d+:) (.+)$/.exec(line);
    if (task && wave !== undefined) headings.set(task[1], { wave: Number(wave), name: `W${wave}: ${task[2].trimEnd()}` });
  }
  return headings;
}

function wavesStart(input: DispatchInput, tasks: Task[], cwd: string): Task[] | string | undefined {
  const waveNumbers = tasks.map(task => /^W(\d+): .+/.exec(task.name)?.[1]);
  if (!waveNumbers.some(wave => wave !== undefined)) return;

  const items = [input, ...(input.tasks ?? []), ...(input.chain ?? []).flatMap(step => step.parallel ?? [step])];
  const plans = new Map<string, ReturnType<typeof wavePlan>>();
  const resolved = new Map<number, number>();
  const unresolved: string[] = [];
  for (const item of items) {
    if (item.agent !== "implementer" || typeof item.task !== "string") continue;
    const plan = /(?:^|[;\n])[ \t]*planPath:[ \t]*([^;\r\n]+)/.exec(item.task)?.[1].trim();
    const field = /(?:^|[;\n])[ \t]*(?:anchor:[ \t]*([^;\r\n]+)|anchors:[ \t]*\[([^\]]*)\])/.exec(item.task);
    if (!plan || !field) continue;
    const prefixes = (field[1] ?? field[2]).match(/### Task \d+:/g);
    if (!prefixes) continue;
    const path = resolve(cwd, plan);
    if (!plans.has(path)) plans.set(path, wavePlan(path));
    const headings = plans.get(path);
    for (const prefix of prefixes) {
      const heading = headings?.get(prefix);
      if (!heading) {
        unresolved.push(`${prefix} expected a wave task in ${path}, found 0 (${headings ? "heading missing" : "plan unreadable"})`);
        continue;
      }
      const matches = tasks.flatMap((task, index) => task.name === heading.name ? [index] : []);
      if (matches.length === 1) resolved.set(matches[0], heading.wave);
      else unresolved.push(`${prefix} expected ${JSON.stringify(heading.name)}, found ${matches.length}`);
    }
  }
  if (unresolved.length) return `Unresolved wave tasks: ${unresolved.join("; ")}. Add the missing task with add, or re-init with {name, status}[] keeping every task and its true status.`;
  if (!resolved.size) return;

  const latestWave = Math.max(...resolved.values());
  const earlier = tasks.flatMap((task, index) => Number(waveNumbers[index]) < latestWave && (task.status === "pending" || task.status === "in_progress")
    ? [`${index}: ${task.name} (${task.status})`] : []);
  if (earlier.length) return `Earlier wave open: ${earlier.join(", ")}. Use plan_tracker({ action: "update", index, status }) with each task's true status, then retry.`;

  const starts = [...resolved.keys()].filter(index => tasks[index].status === "pending");
  if (!starts.length) return;
  const starting = new Set(starts);
  const candidate: Task[] = tasks.map((task, index) => starting.has(index) ? { ...task, status: "in_progress" } : task);
  const offenders = validateSnapshot(candidate);
  if (offenders.length) {
    const pending = offenders.map(index => `${index}: ${candidate[index].name} (pending)`);
    return `Start order: ${pending.join(", ")}.\n${RULE_LINE}\n${ORDER_FIX}\n${KEEP_TASKS}`;
  }
  return candidate;
}

const snapshotLine = (tasks: Task[]): string => tasks.map((t, i) => `${i} ${t.name}=${t.status}`).join(", ");
const offenderList = (tasks: Task[], indices: number[]): string => indices.map((i) => `${i} "${tasks[i].name}"`).join(", ");
const normalizeTask = (t: string | { name: string; status: TaskStatus }): Task => typeof t === "string" ? { name: t, status: "pending" } : { name: t.name, status: t.status };

const statusName = (task: Task): string => task.label ? `${task.name} | ${task.label}` : task.name;

const glyph = (status: TaskStatus, theme?: Theme): string => {
  const [color, icon]: [string, string] = status === "complete" ? ["success", "✓"] : status === "in_progress" ? ["warning", "→"] : status === "failed" ? ["error", "✗"] : status === "skipped" ? ["dim", "⊘"] : ["dim", "○"];
  return theme ? theme.fg(color as Parameters<Theme["fg"]>[0], icon) : icon;
};

const counts = (tasks: Task[]) => {
  const by = (s: TaskStatus) => tasks.filter((t) => t.status === s).length;
  const failed = by("failed");
  const skipped = by("skipped");
  return { done: by("complete") + skipped, inProgress: by("in_progress"), pending: by("pending"), failed, skipped, suffix: `${failed > 0 ? `, ${failed} failed` : ""}${skipped > 0 ? `, ${skipped} skipped` : ""}` };
};

function formatWidget(tasks: Task[], theme: Theme): string {
  if (tasks.length === 0) return "";
  const { done } = counts(tasks);
  const icons = tasks.map((t) => glyph(t.status, theme)).join("");
  const current = tasks.find((t) => t.status === "in_progress") ?? tasks.find((t) => t.status === "pending");
  const currentName = current ? `  ${current.label ?? current.name}` : "";
  return `${theme.fg("muted", "Tasks:")} ${icons} ${theme.fg("muted", `(${done}/${tasks.length})`)}${currentName}`;
}

function formatStatus(tasks: Task[]): string {
  if (tasks.length === 0) return "No plan active.";
  const c = counts(tasks);
  const groups = [[c.inProgress, "in progress"], [c.pending, "pending"], [c.failed, "failed"], [c.skipped, "skipped"]] as const;
  const detail = groups.filter(([n]) => n > 0).map(([n, label]) => `${n} ${label}`);
  const lines: string[] = [`Plan: ${c.done}/${tasks.length} done${detail.length > 0 ? ` (${detail.join(", ")})` : ""}`, ""];
  for (let i = 0; i < tasks.length; i++) lines.push(`  ${glyph(tasks[i].status)} [${i}] ${statusName(tasks[i])}`);
  return lines.join("\n");
}

export default function (pi: ExtensionAPI) {
  let tasks: Task[] = [];

  const reconstructState = (ctx: ExtensionContext) => {
    tasks = latestPlanSnapshot(ctx.sessionManager.getBranch());
  };

  const updateWidget = (ctx: ExtensionContext) => {
    if (!ctx.hasUI) return;
    if (tasks.length === 0) {
      ctx.ui.setWidget("plan_tracker", undefined);
    } else {
      ctx.ui.setWidget("plan_tracker", (_tui, theme) => {
        return new Text(formatWidget(tasks, theme), 0, 0);
      });
    }
  };

  const batched = new Set<string>();
  const warned = new Set<string>();
  const warn = (error: unknown, ctx: ExtensionContext, key?: string) => {
    const reason = error instanceof Error ? error.message : String(error);
    key ??= reason;
    if (ctx.hasUI && !warned.has(key)) {
      ctx.ui.notify(reason, "warning");
      warned.add(key);
    }
    return reason;
  };

  const store = (next: Task[], ctx: ExtensionContext) => {
    if (tasks.length === next.length && next.every((t, i) => t.name === tasks[i].name && t.label === tasks[i].label && t.status === tasks[i].status)) return;
    const payload = { tasks: next };
    const serialized = JSON.stringify(payload);
    const bytes = Buffer.byteLength(serialized, "utf8");
    if (bytes > MAX_STORED_LIST_BYTES) {
      if (ctx.hasUI) {
        const digest = createHash("sha256").update(serialized).digest("hex");
        warn(`Plan tracker: automatic list update skipped (${bytes} bytes exceeds the ${MAX_STORED_LIST_BYTES}-byte limit).`, ctx, `overflow:${digest}`);
      }
      return;
    }
    pi.appendEntry(PLAN_TRACKER_SNAPSHOT, payload);
    tasks = next;
    updateWidget(ctx);
  };

  const reconcile = (ctx: ExtensionContext, point: "stop" | "activation") => {
    if (Number(process.env.PI_SUBAGENT_DEPTH) > 0) return;
    try {
      const ledger = boundLedger(ctx);
      if (!ledger) return;
      const projected = projectLedger(ledger.text, ledger.path, tasks);
      if (markedStop(ctx) || (point === "stop" && latestDispatchBlocked(ctx))) store(projected, ctx);
    } catch (error) {
      warn(error, ctx);
    }
  };
  pi.on("agent_settled", (event, ctx) => {
    if (!event.aborted) reconcile(ctx, "stop");
  });
  pi.on("message_end", ({ message }) => {
    if (message.role !== "assistant") return;
    batched.clear();
    const calls = message.content.filter(part => part.type === "toolCall");
    if (calls.length > 1) for (const call of calls) batched.add(call.id);
  });
  pi.on("tool_call", (event, ctx) => {
    if (Number(process.env.PI_SUBAGENT_DEPTH) > 0) return;
    const verifyStart = event.toolName === "phase_tracker" && event.input?.action === "start" && event.input?.phase === "verify";
    if (event.toolName !== "subagent" && !verifyStart) return;
    try {
      const ledger = boundLedger(ctx);
      if (!ledger) {
        if (event.toolName !== "subagent") return;
        const next = wavesStart(event.input as DispatchInput, tasks, ctx.cwd);
        if (typeof next === "string") return { block: true, reason: next };
        if (next) store(next, ctx);
        return;
      }
      if (verifyStart) {
        const projected = projectLedger(ledger.text, ledger.path, tasks);
        if (implementing(ctx)) store(projected, ctx);
        return;
      }
      if (batched.has(event.toolCallId)) return { block: true, reason: "The ledger write must finish first. Issue the dispatch again, alone in its own message." };
      const started = projectLedger(ledger.text, ledger.path, tasks);
      const withoutTuple = ledger.text.replace(/^pending: .*(?:\n|$)/m, "");
      if (withoutTuple !== ledger.text) store(projectLedger(withoutTuple, ledger.path, tasks), ctx);
      store(started, ctx);
    } catch (error) {
      return { block: true, reason: warn(error, ctx) };
    }
  });

  // Reconstruct state + widget on session events
  for (const event of ["session_start", "session_switch", "session_fork", "session_tree"] as const) {
    pi.on(event, async (_event, ctx) => {
      reconstructState(ctx);
      const restored = tasks;
      reconcile(ctx, "activation");
      if (tasks === restored) updateWidget(ctx);
    });
  }

  pi.registerTool({
    name: "plan_tracker",
    exposure: "model-only",
    label: "Plan Tracker",
    description:
      "Track progress while EXECUTING an implementation plan (the implement phase), a verify-phase conformance fix wave, or another bounded gate checklist (e.g. pre-merge PR verification). Statuses: pending (not yet touched), in_progress (started; several at once is fine), complete, failed (terminal-negative: ran and did not pass; never counted done), skipped (terminal: not applicable in this run; counted done). Rule: pending tasks must trail every started or finished task - an update that would leave a pending task ahead of a non-pending one is rejected with the fix. update never sets pending; init and add do. Actions: init (set task list; elements are task-name strings or { name, status } to recreate a list with known statuses), add (append tasks as pending; existing statuses preserved), update (change task status), status (show current state), clear (remove plan), refresh (derive tasks from an artifact path while retaining other tasks). Do NOT use for brainstorming, research, or planning checklists: those phases are open-ended and a bounded task list misrepresents them as a fixed N-step process.",
    parameters: PlanTrackerParams,
    executionMode: "sequential",

    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      switch (params.action) {
        case "refresh": {
          let proposed: Task[];
          try {
            if (!params.path) throw new Error("refresh: cannot read <missing>: path required");
            const path = resolve(ctx.cwd, params.path);
            let text: string;
            try {
              text = readFileSync(path, "utf8");
            } catch (error) {
              throw new Error(`refresh: cannot read ${path}: ${error instanceof Error ? error.message : String(error)}`);
            }
            proposed = projectLedger(text, path, tasks);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return {
              content: [{ type: "text", text: `Error: ${message}` }],
              details: { action: "refresh", error: message } as PlanTrackerDetails,
            };
          }
          tasks = proposed;
          updateWidget(ctx);
          return {
            content: [{ type: "text", text: `Plan refreshed with ${tasks.length} tasks.\n${formatStatus(tasks)}` }],
            details: { action: "refresh", tasks: tasks.map(t => ({ ...t })) } as PlanTrackerDetails,
          };
        }

        case "init": {
          if (!params.tasks || params.tasks.length === 0) {
            return {
              content: [{ type: "text", text: "Error: tasks array required for init" }],
              details: {
                action: "init",
                tasks: tasks.map((t) => ({ ...t })),
                error: "tasks required",
              } as PlanTrackerDetails,
            };
          }
          const proposed = params.tasks.map(normalizeTask);
          const offenders = validateSnapshot(proposed);
          if (offenders.length > 0) {
            return {
              content: [{ type: "text", text: [
                `Error: cannot init: pending tasks precede started or finished ones: ${offenderList(proposed, offenders)}.`,
                RULE_LINE,
                "Reorder the list or restate those statuses truthfully, then retry.",
                `Proposed: ${snapshotLine(proposed)}`,
              ].join("\n") }],
              details: { action: "init", tasks: tasks.map((t) => ({ ...t })), error: `pending-suffix violation: ${offenders.join(",")}` } as PlanTrackerDetails,
            };
          }
          tasks = proposed;
          updateWidget(ctx);
          return {
            content: [
              {
                type: "text",
                text: `Plan initialized with ${tasks.length} tasks.\n${formatStatus(tasks)}`,
              },
            ],
            details: { action: "init", tasks: tasks.map((t) => ({ ...t })) } as PlanTrackerDetails,
          };
        }

        case "add": {
          if (!params.tasks || params.tasks.length === 0) {
            return {
              content: [{ type: "text", text: "Error: tasks array required for add" }],
              details: {
                action: "add",
                tasks: tasks.map((t) => ({ ...t })),
                error: "tasks required",
              } as PlanTrackerDetails,
            };
          }
          tasks = tasks.concat(params.tasks.map((t) => ({ name: normalizeTask(t).name, status: "pending" as TaskStatus })));
          updateWidget(ctx);
          return {
            content: [
              {
                type: "text",
                text: `Added ${params.tasks.length} tasks (${tasks.length} total).\n${formatStatus(tasks)}`,
              },
            ],
            details: { action: "add", tasks: tasks.map((t) => ({ ...t })) } as PlanTrackerDetails,
          };
        }

        case "update": {
          if (params.index === undefined || !params.status) {
            return {
              content: [{ type: "text", text: "Error: index and status required for update" }],
              details: {
                action: "update",
                tasks: tasks.map((t) => ({ ...t })),
                error: "index and status required",
              } as PlanTrackerDetails,
            };
          }
          if (tasks.length === 0) {
            return {
              content: [{ type: "text", text: "Error: no plan active. Use init first." }],
              details: {
                action: "update",
                tasks: [],
                error: "no plan active",
              } as PlanTrackerDetails,
            };
          }
          if (params.index < 0 || params.index >= tasks.length) {
            return {
              content: [
                {
                  type: "text",
                  text: `Error: index ${params.index} out of range (0-${tasks.length - 1})`,
                },
              ],
              details: {
                action: "update",
                tasks: tasks.map((t) => ({ ...t })),
                error: `index ${params.index} out of range`,
              } as PlanTrackerDetails,
            };
          }
          const target = tasks[params.index];
          if (params.status === "pending") {
            return {
              content: [{ type: "text", text: [
                `Error: cannot set task ${params.index} "${target.name}" to pending: update never sets pending; a task is pending only from init/add.`,
                "To redo it, update it to in_progress. To recreate the whole list, re-init with {name, status}[].",
                `Current: ${snapshotLine(tasks)}`,
              ].join("\n") }],
              details: { action: "update", tasks: tasks.map((t) => ({ ...t })), error: "update cannot set pending" } as PlanTrackerDetails,
            };
          }
          const candidate = tasks.map((t, i) => (i === params.index ? { ...t, status: params.status as TaskStatus } : { ...t }));
          const offenders = validateSnapshot(candidate);
          if (offenders.length > 0) {
            return {
              content: [{ type: "text", text: [
                `Error: cannot set task ${params.index} "${target.name}" to ${params.status}: pending tasks precede it: ${offenderList(tasks, offenders)}.`,
                RULE_LINE,
                ORDER_FIX,
                KEEP_TASKS,
                `Current: ${snapshotLine(tasks)}`,
              ].join("\n") }],
              details: { action: "update", tasks: tasks.map((t) => ({ ...t })), error: `pending-suffix violation: ${offenders.join(",")}` } as PlanTrackerDetails,
            };
          }
          tasks = candidate;
          updateWidget(ctx);
          return {
            content: [
              {
                type: "text",
                text: `Task ${params.index} "${tasks[params.index].name}" → ${params.status}\n${formatStatus(tasks)}`,
              },
            ],
            details: { action: "update", tasks: tasks.map((t) => ({ ...t })) } as PlanTrackerDetails,
          };
        }

        case "status": {
          return {
            content: [{ type: "text", text: formatStatus(tasks) }],
            details: { action: "status", tasks: tasks.map((t) => ({ ...t })) } as PlanTrackerDetails,
          };
        }

        case "clear": {
          const count = tasks.length;
          tasks = [];
          updateWidget(ctx);
          return {
            content: [
              {
                type: "text",
                text: count > 0 ? `Plan cleared (${count} tasks removed).` : "No plan was active.",
              },
            ],
            details: { action: "clear", tasks: [] } as PlanTrackerDetails,
          };
        }

        default:
          return {
            content: [{ type: "text", text: `Unknown action: ${params.action}` }],
            details: {
              action: "status",
              tasks: tasks.map((t) => ({ ...t })),
              error: `unknown action`,
            } as PlanTrackerDetails,
          };
      }
    },

    renderCall(args, theme) {
      let text = theme.fg("toolTitle", theme.bold("plan_tracker "));
      text += theme.fg("muted", args.action);
      if (args.action === "update" && args.index !== undefined) {
        text += ` ${theme.fg("accent", `[${args.index}]`)}`;
        if (args.status) text += ` → ${theme.fg("dim", args.status)}`;
      }
      if ((args.action === "init" || args.action === "add") && args.tasks) {
        text += ` ${theme.fg("dim", `(${args.tasks.length} tasks)`)}`;
      }
      return new Text(text, 0, 0);
    },

    renderResult(result, _options, theme) {
      const details = result.details as PlanTrackerDetails | undefined;
      if (!details) {
        const text = result.content[0];
        return new Text(text?.type === "text" ? text.text : "", 0, 0);
      }

      if (details.error) {
        return new Text(theme.fg("error", `Error: ${details.error}`), 0, 0);
      }

      const taskList = details.tasks;
      switch (details.action) {
        case "refresh":
          return new Text(theme.fg("success", "✓ ") + theme.fg("muted", `Plan refreshed with ${taskList.length} tasks`), 0, 0);
        case "init":
          return new Text(
            theme.fg("success", "✓ ") + theme.fg("muted", `Plan initialized with ${taskList.length} tasks`),
            0,
            0,
          );
        case "add":
          return new Text(
            theme.fg("success", "✓ ") + theme.fg("muted", `Added tasks (${taskList.length} total)`),
            0,
            0,
          );
        case "update": {
          const c = counts(taskList);
          return new Text(
            theme.fg("success", "✓ ") + theme.fg("muted", `Updated (${c.done}/${taskList.length} done${c.suffix})`),
            0,
            0,
          );
        }
        case "status": {
          if (taskList.length === 0) {
            return new Text(theme.fg("dim", "No plan active"), 0, 0);
          }
          const c = counts(taskList);
          let text = theme.fg("muted", `${c.done}/${taskList.length} done${c.suffix}`);
          for (const t of taskList) {
            const icon = glyph(t.status, theme);
            text += `\n${icon} ${theme.fg("muted", statusName(t))}`;
          }
          return new Text(text, 0, 0);
        }
        case "clear":
          return new Text(theme.fg("success", "✓ ") + theme.fg("muted", "Plan cleared"), 0, 0);
        default:
          return new Text(theme.fg("dim", "Done"), 0, 0);
      }
    },
  });
}
