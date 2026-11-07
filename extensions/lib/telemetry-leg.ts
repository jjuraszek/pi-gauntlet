import { join } from "node:path";
import { stringify } from "yaml";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { Deps } from "../telemetry.ts";
import { checkoutOf } from "./checkout.ts";
import { syncTelemetryBranch, telemetryRepo, trackerRefs } from "./telemetry-branch.ts";
import { textOf } from "./telemetry-collect.ts";
import { addTokens, compact, emptyAccumulators, zeroTokens, type Accumulators, type Tokens } from "./telemetry-record.ts";

const skills = ["shape-ticket", "gatekeep-pr", "check-delivery"] as const;
type LegSkill = (typeof skills)[number];
export interface LegItem {
  kind: "ticket" | "pr";
  key?: string;
  ticket?: string;
  outcome: string;
}
export interface LegRecord {
  skill: LegSkill;
  session: string;
  author: { name?: string; email?: string };
  gauntlet_version?: string;
  models: string[];
  tokens: Omit<Tokens, "cost">;
  cost: number;
  repo: string;
  ts: string;
  items: LegItem[];
}

const legSkill = (name: string | undefined): LegSkill | undefined => skills.find((skill) => skill === name);

const ticketRef = (ref: string) => trackerRefs(ref).includes(ref);
const outcomes: Record<LegSkill, string> = {
  "shape-ticket": "written|created|closed|close failed \\(.*\\)|close by hand|dropped|declined|stopped|no-op|unfetched",
  "gatekeep-pr": "approved|merged|closed-pr|final|merge-queued|stopped|stuck - .+",
  "check-delivery": "delivered|manual|declined|already recorded|skipped|failed - .+",
};

export function settlementItems(skill: LegSkill, text: string, trackerless = false): LegItem[] | undefined {
  const [marker, ...lines] = text.split("\n");
  if (!/^gauntlet: (?:done|stuck)\b/.test(marker)) return undefined;
  const row = new RegExp(`^(.+?): (${outcomes[skill]})$`);
  const items = lines.flatMap((line): LegItem[] => {
    let ticket: string | undefined;
    const annotation = / \(([^()]+)\)$/.exec(line);
    if (skill === "gatekeep-pr" && annotation && (trackerless || ticketRef(annotation[1]))) {
      ticket = annotation[1];
      line = line.slice(0, annotation.index);
    }
    const match = row.exec(line);
    if (!match || match[1].startsWith("# ") || match[1].startsWith("#### ")) return [];
    const [, ref, outcome] = match;
    const pr = /^#\d+@[a-f\d]+$/i.test(ref) || /^https?:\/\/\S+\/pull\/\d+(?:@[a-f\d]+)?$/i.test(ref);
    if (trackerless || pr || ticketRef(ref)) return [compact({ kind: pr || skill === "gatekeep-pr" ? "pr" : "ticket", key: ref, ticket, outcome }) as LegItem];
    if (skill === "shape-ticket" && (outcome === "dropped" || outcome === "declined")) return [{ kind: "ticket", outcome }];
    return [];
  });
  return items;
}

export function registerLegTelemetry(pi: ExtensionAPI, deps: Deps, runBound: () => boolean): () => Accumulators | undefined {
  let active: { skill: LegSkill; provisional: boolean; session: string; ts: string; acc: Accumulators; models: Set<string> } | undefined;
  let terminal: string | undefined;
  let lastSkill: LegSkill | undefined;
  const trackerless = (root: string): boolean => {
    for (const path of [".pi/gauntlet-overrides.md", "gauntlet-overrides.md", "doc/gauntlet-overrides.md"]) {
      const text = deps.fs.readFile(join(root, path));
      if (text === undefined) continue;
      const section = text.split(/^##\s+Issue tracker\s*$/m)[1]?.split(/^##\s/m)[0] ?? "";
      return /^-\s*tracker:\s*none\s*$/m.test(section);
    }
    return false;
  };
  const enabled = (ctx: ExtensionContext) => Number(process.env.PI_SUBAGENT_DEPTH ?? "0") === 0 && deps.settings(ctx.cwd).telemetry.enabled;
  const reset = () => { active = undefined; terminal = undefined; };
  const start = (skill: LegSkill | undefined, ctx: ExtensionContext, provisional = false) => {
    if (!skill || !enabled(ctx) || runBound()) return;
    if (active) {
      if (active.provisional && !provisional) {
        active.skill = skill;
        active.provisional = false;
        lastSkill = skill;
      }
      return;
    }
    lastSkill = skill;
    active = { skill, provisional, session: ctx.sessionManager.getSessionId(), ts: deps.now(), acc: emptyAccumulators(), models: new Set() };
    if (ctx.model) active.models.add(`${ctx.model.provider}/${ctx.model.id}`);
    terminal = undefined;
  };
  const notify = (reason: string) => pi.sendMessage({
    customType: "telemetry-warning", content: `telemetry: not pushed (${reason.split("\n")[0]})`, display: true,
  });

  for (const event of ["session_start", "session_switch", "session_fork", "session_tree", "session_shutdown"] as const) {
    pi.on(event, async () => { reset(); lastSkill = undefined; });
  }
  pi.on("input", async (event, ctx) => {
    terminal = undefined;
    if (event.source !== "extension") start(legSkill(/^\/skill:([^\s]+)/.exec(event.text)?.[1]), ctx);
  });
  pi.on("before_agent_start", async (event, ctx) => {
    terminal = undefined;
    if (event.messageType === "user") {
      const skill = legSkill(/^<skill name="([^"]+)" location="/.exec(event.prompt)?.[1]);
      start(skill ?? lastSkill, ctx, !skill);
    }
  });
  pi.on("tool_call", async (event, ctx) => {
    terminal = undefined;
    if (event.toolName !== "read") return;
    const path = (event.input as { path?: unknown }).path;
    if (typeof path === "string") start(legSkill(/(?:^|\/)skills\/([^/]+)\/SKILL\.md$/.exec(path)?.[1]), ctx);
  });
  pi.on("model_select", async (event, ctx) => {
    if (active && enabled(ctx) && !runBound()) active.models.add(`${event.model.provider}/${event.model.id}`);
  });
  pi.on("message_end", async (event, ctx) => {
    if (event.message.role !== "assistant") return;
    if (active && enabled(ctx) && !runBound()) {
      if (event.message.provider && event.message.model) active.models.add(`${event.message.provider}/${event.message.model}`);
      const text = textOf(event.message.content);
      terminal = /^gauntlet: (?:done|stuck)\b/.test(text) ? text : undefined;
    } else terminal = undefined;
  });
  // agent_end can precede queued follow-on work; only the final live message at settlement seals.
  pi.on("agent_settled", async (event, ctx) => {
    if (!active || !terminal || event.aborted || !enabled(ctx) || runBound()) return;
    const run = active;
    const text = terminal;
    try {
      const checkout = await checkoutOf(ctx.cwd, deps.git, deps.jj);
      if (!checkout || checkout.via !== "git") {
        reset();
        return notify(checkout ? "jj workspace: no git remote" : "no repository");
      }
      const items = settlementItems(run.skill, text, trackerless(checkout.toplevel));
      if (!items) return;
      reset();
      const repo = (deps.telemetryRepo ?? telemetryRepo)(checkout.toplevel);
      const [name, email] = await Promise.all([
        deps.git(["config", "user.name"], checkout.toplevel),
        deps.git(["config", "user.email"], checkout.toplevel),
      ]);
      const { cost, ...tokens } = Object.values(run.acc.phases).reduce((total, phase) => addTokens(total, phase.tokens ?? zeroTokens()), zeroTokens());
      for (const persona of Object.values(run.acc.personas)) for (const model of persona.models) run.models.add(model);
      const record: LegRecord = {
        skill: run.skill, session: run.session, ts: run.ts, repo, items,
        author: compact({ name: name.stdout.trim() || undefined, email: email.stdout.trim() || undefined }),
        gauntlet_version: deps.settings(ctx.cwd).versions["pi-gauntlet"], models: [...run.models], tokens, cost,
      };
      const stamp = run.ts.replace(/[-:]/g, "");
      const path = `${repo}/${run.skill}/${stamp}-${run.session}.yaml`;
      const result = (deps.syncTelemetryBranch ?? syncTelemetryBranch)(checkout.toplevel, new Map([[path, stringify(record)]]), deps.settings(ctx.cwd).telemetry.remote);
      if (!result.ok) notify(result.reason ?? "unknown failure");
    } catch (error) {
      reset();
      notify(String((error as Error).message ?? error));
    }
  });
  return () => runBound() ? undefined : active?.acc;
}
