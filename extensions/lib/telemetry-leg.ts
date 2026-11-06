import { stringify } from "yaml";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { Deps } from "../telemetry.ts";
import { checkoutOf } from "./checkout.ts";
import { syncTelemetryBranch, telemetryRepo } from "./telemetry-branch.ts";
import { textOf } from "./telemetry-collect.ts";

const skills = ["shape-ticket", "gatekeep-pr", "check-delivery"] as const;
type LegSkill = (typeof skills)[number];
export interface LegItem {
  kind: "ticket" | "pr";
  key: string;
  outcome: string;
}
export interface LegRecord {
  skill: LegSkill;
  session: string;
  repo: string;
  ts: string;
  items: LegItem[];
}

const legSkill = (name: string | undefined): LegSkill | undefined => skills.find((skill) => skill === name);

export function settlementItems(skill: LegSkill, text: string): LegItem[] | undefined {
  const [marker, ...lines] = text.split("\n");
  if (!/^gauntlet: (?:done|stuck) .+/.test(marker)) return undefined;
  const items = lines.flatMap((line): LegItem[] => {
    const match = /^(\S+): ([a-z][a-z-]*(?: [a-z]+)?)(?: - .+)?$/.exec(line);
    return match ? [{ kind: skill === "gatekeep-pr" ? "pr" : "ticket", key: match[1], outcome: match[2] }] : [];
  });
  return items.length ? items : undefined;
}

export function registerLegTelemetry(pi: ExtensionAPI, deps: Deps): void {
  let active: { skill: LegSkill; session: string; ts: string } | undefined;
  let terminal: LegItem[] | undefined;
  const enabled = (ctx: ExtensionContext) => Number(process.env.PI_SUBAGENT_DEPTH ?? "0") === 0 && deps.settings(ctx.cwd).telemetry.enabled;
  const reset = () => { active = undefined; terminal = undefined; };
  const start = (skill: LegSkill | undefined, ctx: ExtensionContext) => {
    if (!skill || !enabled(ctx)) return;
    if (active?.skill === skill && active.session === ctx.sessionManager.getSessionId()) return;
    active = { skill, session: ctx.sessionManager.getSessionId(), ts: deps.now() };
    terminal = undefined;
  };
  const notify = (reason: string) => pi.sendMessage({
    customType: "telemetry-warning", content: `telemetry: not pushed (${reason.split("\n")[0]})`, display: true,
  });

  for (const event of ["session_start", "session_switch", "session_fork", "session_tree", "session_shutdown"] as const) {
    pi.on(event, async () => reset());
  }
  pi.on("input", async (event, ctx) => {
    terminal = undefined;
    if (event.source !== "extension") start(legSkill(/^\/skill:([^\s]+)/.exec(event.text)?.[1]), ctx);
  });
  pi.on("before_agent_start", async (event, ctx) => {
    terminal = undefined;
    if (event.messageType === "user") start(legSkill(/^<skill name="([^"]+)" location="/.exec(event.prompt)?.[1]), ctx);
  });
  pi.on("tool_call", async () => { terminal = undefined; });
  pi.on("tool_result", async (event, ctx) => {
    if (event.toolName !== "read" || event.isError) return;
    const path = (event.input as { path?: unknown }).path;
    if (typeof path === "string") start(legSkill(/(?:^|\/)skills\/([^/]+)\/SKILL\.md$/.exec(path)?.[1]), ctx);
  });
  pi.on("message_end", async (event, ctx) => {
    if (event.message.role !== "assistant") return;
    terminal = active && enabled(ctx) ? settlementItems(active.skill, textOf(event.message.content)) : undefined;
  });
  // agent_end can precede queued follow-on work; only the final live message at settlement seals.
  pi.on("agent_settled", async (event, ctx) => {
    if (!active || !terminal || event.aborted || !enabled(ctx)) return;
    const run = active;
    const items = terminal;
    reset();
    try {
      const checkout = await checkoutOf(ctx.cwd, deps.git, deps.jj);
      if (!checkout) return notify("no repository");
      if (checkout.via !== "git") return notify("jj workspace: no git remote");
      const repo = (deps.telemetryRepo ?? telemetryRepo)(checkout.toplevel);
      if (!repo) return notify("cannot resolve owner/name from origin");
      const record: LegRecord = { ...run, repo, items };
      const stamp = run.ts.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
      const path = `${repo}/${run.skill}/${stamp}-${run.session}.yaml`;
      const result = (deps.syncTelemetryBranch ?? syncTelemetryBranch)(checkout.toplevel, new Map([[path, stringify(record)]]), deps.settings(ctx.cwd).telemetry.remote);
      if (!result.ok) notify(result.reason ?? "unknown failure");
    } catch (error) {
      notify(String((error as Error).message ?? error));
    }
  });
}
