  /**
   * Telemetry extension: records run and session-leg YAML from pi events alone.
   * Session legs seal through telemetry-leg.ts at terminal settlement. Runs bind
   * only after `phase_tracker start brainstorm` armed the
   * flow, writes the record to disk without ever staging or committing it (the seal bin
   * commits once at finish), and blocks `write` into an already-shipped spec while
   * brainstorm is in progress. Pure helpers: extensions/lib/telemetry-*.ts. The default
   * export takes a `deps` seam ({ fs, git, jj, now, settings }) for the harness tests.
   */

  import { execFile } from "node:child_process";
  import { randomUUID } from "node:crypto";
  import * as nodeFs from "node:fs";
  import { dirname, isAbsolute, join, posix, resolve } from "node:path";
  import { fileURLToPath } from "node:url";
  import * as piRuntime from "@earendil-works/pi-coding-agent";
  import { SettingsManager, getAgentDir } from "@earendil-works/pi-coding-agent";
  import type { ExtensionAPI, ExtensionContext, ToolResultEvent } from "@earendil-works/pi-coding-agent";
  import { DEFAULT_TELEMETRY_DIR, DEFAULT_TEST_COMMANDS, planDirsFor, resolveFlowGuards, resolveTelemetry, settingsErrorWarning, type TelemetryResolved } from "./lib/gauntlet-settings.ts";
  import { loadGauntletSettings } from "./lib/gauntlet-settings-loader.ts";
  import { createPendingWarnings } from "./lib/tool-result-warnings.ts";
  import { checkoutOf } from "./lib/checkout.ts";
  import { CONTEXT_DRAFT_MARKER, nextGauntletEntered } from "./lib/phase-tracker-helpers.ts";
  import { sha256 } from "./lib/plan-check.ts";
  import { SUPERSEDED_BY_RE, isPlanPath, isSpecPath, isSupersededByBanner, matchTestStatement, parseSpecLinks, planSpecHeader, recordPathFor, repoRelativeToolPath, skillReadPath, toPosix, truncateCommand } from "./lib/telemetry-paths.ts";
  import { computeJjDiff } from "./lib/telemetry-diff.ts";
  import { COUNTED_USER_PHASES, REVIEWER_AGENTS, countFindings, countStructuredFindings, countOpenGaps, countReopens, insertedText, planTotals, textOf, usageToTokens } from "./lib/telemetry-collect.ts";
  import { addTokens, capEvents, compact, currentPhase, derive, diffPhases, emptyAccumulators, emptyPhases, foldAccumulators, implementAutoCompletes, liveShipEvent, newRecord, parseRecord, serializeRecord, type Accumulators, type BaseEvent, type PhaseAcc, type PhaseKey, type PhaseMap, type TelemetryEvent, type TelemetryRecord, type Tokens } from "./lib/telemetry-record.ts";
  import { guardReason } from "./lib/telemetry-ship.ts";
  import { readTelemetryBranch, telemetryRepo, type syncTelemetryBranch } from "./lib/telemetry-branch.ts";
  import { registerLegTelemetry } from "./lib/telemetry-leg.ts";
  import { buildCouncil, parseAudit, parseChairReport, resolveMembers, type Cluster, type MemberResult } from "./lib/telemetry-council.ts";

  // ---- deps seam -------------------------------------------------------------------

  export interface FsPort {
    readFile(p: string): string | undefined;
    writeFile(p: string, text: string): void;
    rename(from: string, to: string): void;
    mkdirp(p: string): void;
    exists(p: string): boolean;
    unlink(p: string): void;
  }
  export interface GitResult {
    code: number;
    stdout: string;
    stderr: string;
  }
  export interface SettingsSnapshot {
    telemetry: TelemetryResolved;
    specDirs: string[];
    planDirs: string[];
    errors: string[];
    agentOverrides?: Record<string, unknown>;
    versions: Record<string, string>;
    testCommands?: string[];
  }
  export interface Deps {
    syncTelemetryBranch?: typeof syncTelemetryBranch;
    telemetryRepo?: typeof telemetryRepo;
    readTelemetryBranch?: typeof readTelemetryBranch;
    fs: FsPort;
    git: (args: string[], cwd: string) => Promise<GitResult>;
    // jj runner; production uses realJj for both checkout detection and the ship-time diff.
    jj?: (args: string[], cwd: string) => GitResult | Promise<GitResult>;
    now: () => string;
    settings: (cwd: string) => SettingsSnapshot;
  }

  export const realFs: FsPort = {
    readFile: (p) => {
      try {
        return nodeFs.readFileSync(p, "utf8");
      } catch {
        return undefined;
      }
    },
    writeFile: (p, text) => nodeFs.writeFileSync(p, text),
    rename: (a, b) => nodeFs.renameSync(a, b),
    mkdirp: (p) => nodeFs.mkdirSync(p, { recursive: true }),
    exists: (p) => nodeFs.existsSync(p),
    unlink: (p) => nodeFs.rmSync(p, { force: true }),
  };

  // Bounded, never throws.
  export const realGit = (args: string[], cwd: string): Promise<GitResult> =>
    new Promise((res) => {
      execFile("git", args, { cwd, timeout: 10_000, encoding: "utf8" }, (err, stdout, stderr) => {
        const code = err ? (typeof (err as { code?: unknown }).code === "number" ? ((err as { code: number }).code) : 1) : 0;
        res({ code, stdout: String(stdout ?? ""), stderr: String(stderr ?? err?.message ?? "") });
      });
    });

  // jj diff --git returns full patches; execFile's default buffer is too small.
  // On ENOENT stderr is empty, so preserve the error message.
  export const realJj = (args: string[], cwd: string): Promise<GitResult> =>
    new Promise((res) => {
      execFile("jj", args, { cwd, timeout: 10_000, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }, (err, stdout, stderr) => {
        const code = err ? (typeof (err as { code?: unknown }).code === "number" ? ((err as { code: number }).code) : 1) : 0;
        res({ code, stdout: String(stdout ?? ""), stderr: String(stderr ?? "").trim() || String(err?.message ?? "") });
      });
    });

  const isoNow = (): string => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  const readPkgVersion = (p: string): string | undefined => {
    try {
      const v = JSON.parse(nodeFs.readFileSync(p, "utf8")).version;
      return typeof v === "string" ? v : undefined;
    } catch {
      return undefined;
    }
  };

  function realVersions(): Record<string, string> {
    const out: Record<string, string> = {};
    const piVersion = (piRuntime as { VERSION?: unknown }).VERSION;
    if (typeof piVersion === "string") out.pi = piVersion;
    const self = readPkgVersion(join(dirname(new URL(import.meta.url).pathname), "..", "package.json"));
    if (self) out["pi-gauntlet"] = self;
    for (const pkg of ["pi-cohort", "pi-quiver", "pi-condense"]) {
      const v = readPkgVersion(join(getAgentDir(), "npm", "node_modules", pkg, "package.json"));
      if (v) out[pkg] = v;
    }
    return out;
  }

  function realSettings(cwd: string): SettingsSnapshot {
    const { gauntlet, errors, root } = loadGauntletSettings(cwd);
    const telemetry = resolveTelemetry(gauntlet);
    const { specDirs } = resolveFlowGuards(gauntlet);
    const planDirs = planDirsFor(specDirs);
    if (!telemetry.enabled) return { telemetry, specDirs, planDirs, errors, versions: {} };
    const sm = SettingsManager.create(root, getAgentDir());
    const layer = (s: unknown) => ((s as { subagents?: { agentOverrides?: unknown } })?.subagents?.agentOverrides ?? undefined) as Record<string, unknown> | undefined;
    const preset = layer(sm.getGlobalSettings());
    const repo = layer(sm.getProjectSettings());
    const agentOverrides = preset || repo ? { ...(preset ?? {}), ...(repo ?? {}) } : undefined;
    const rawCmds = gauntlet.verifyBeforeShip?.testCommands;
    const testCommands = Array.isArray(rawCmds) && rawCmds.length > 0 && rawCmds.every((c) => typeof c === "string" && c.trim()) ? (rawCmds as string[]) : undefined;
    return { telemetry, specDirs, planDirs, errors, agentOverrides, versions: realVersions(), testCommands };
  }

  export const realDeps: Deps = { fs: realFs, git: realGit, jj: realJj, now: isoNow, settings: realSettings };

  // ---- replay ------------------------------------------------------------------------

  type BindingInput = { tool: "resume" | "plan_check" | "read" | "write" | "edit"; path: string; brainstorming?: boolean };
  type SpecLocation = { toplevel: string; rel: string; via: "git" | "jj" };
  type Binding = SpecLocation & { dir: string; file: string };
  type BindingStep = { input: BindingInput; cwd: string; settings: SettingsSnapshot };
  interface ReplayResult {
    phases: PhaseMap;
    gauntletEntered: boolean;
    bindings: BindingInput[];
    lastPlanTasks?: { name?: string; status: string }[];
  }

  function bindingInput(tool: string | undefined, input: unknown, details: unknown, brainstorming: boolean, specDirs: readonly string[], planDirs: readonly string[], cwd?: string): BindingInput | undefined {
    if (tool === "plan_check") {
      const d = details as { status?: string; specPath?: unknown } | undefined;
      if (d?.status === "pass" && typeof d.specPath === "string" && d.specPath) return { tool, path: d.specPath };
    } else if (tool === "read" || tool === "write" || tool === "edit") {
      const path = (input as { path?: unknown } | undefined)?.path;
      if (typeof path !== "string") return;
      const normalized = toPosix(cwd ? resolve(cwd, path) : path);
      if ((tool !== "read" && isSpecPath(normalized, specDirs)) || isPlanPath(normalized, planDirs)) return { tool, path, brainstorming };
    }
  }

  // gauntlet-resume's reconstruction skips brainstorm with `resume: <spec path>`; the path
  // is the bind candidate on that route because no spec write follows.
  const RESUME_REASON_RE = /^resume: (\S+)$/;
  export function resumeSpecOf(phases: PhaseMap | undefined, specDirs: readonly string[], cwd?: string): string | undefined {
    const b = phases?.brainstorm;
    const path = b?.status === "skipped" && typeof b.reason === "string" ? RESUME_REASON_RE.exec(b.reason)?.[1] : undefined;
    return path && isSpecPath(toPosix(cwd ? resolve(cwd, path) : path), specDirs) ? path : undefined;
  }

  const afterPlanActivity = (phases: PhaseMap, tasks: { status: string }[]): PhaseMap =>
    implementAutoCompletes(phases, tasks) ? { ...phases, implement: { status: "complete" } } : phases;

  // Walks the session branch like phase-tracker.ts: tracker results set the phase
  // map and the flow-entry marker; bind candidates are taken only while armed
  // and dropped on reset. Silent: no events are emitted.
  export function replayBranch(entries: Iterable<unknown>, specDirs: readonly string[], planDirs = planDirsFor(specDirs), cwd?: string): ReplayResult {
    const out: ReplayResult = { phases: emptyPhases(), gauntletEntered: false, bindings: [] };
    const calls = new Map<string, { name: string; args: unknown }>();
    for (const raw of entries) {
      const entry = raw as { type?: string; message?: { role?: string; content?: unknown; toolName?: string; toolCallId?: string; isError?: boolean; details?: unknown } };
      if (entry.type !== "message" || !entry.message) continue;
      const msg = entry.message;
      if (msg.role === "assistant" && Array.isArray(msg.content)) {
        for (const c of msg.content as { type?: string; id?: string; name?: string; arguments?: unknown }[])
          if (c?.type === "toolCall" && c.id && c.name) calls.set(c.id, { name: c.name, args: c.arguments });
        continue;
      }
      if (msg.role !== "toolResult" || msg.isError) continue;
      if (msg.toolName === "phase_tracker") {
        const d = msg.details as { action?: string; phases?: PhaseMap; error?: string } | undefined;
        if (!d?.phases || d.error) continue;
        out.phases = d.phases;
        out.gauntletEntered = nextGauntletEntered(out.gauntletEntered, d.action ?? "", d.phases.brainstorm.status);
        if (d.action === "reset") {
          out.bindings = [];
          out.lastPlanTasks = undefined;
        }
        const resumed = d.action === "skip" ? resumeSpecOf(d.phases, specDirs, cwd) : undefined;
        if (out.gauntletEntered && resumed) out.bindings.push({ tool: "resume", path: resumed });
      } else if (msg.toolName === "plan_tracker") {
        const d = msg.details as { tasks?: { name?: string; status: string }[]; error?: string } | undefined;
        if (d && !d.error && Array.isArray(d.tasks)) {
          out.lastPlanTasks = d.tasks;
          out.phases = afterPlanActivity(out.phases, d.tasks);
        }
      } else if (out.gauntletEntered && out.phases.ship.status !== "complete") {
        const call = msg.toolCallId ? calls.get(msg.toolCallId) : undefined;
        const input = bindingInput(msg.toolName, call?.name === msg.toolName ? call?.args : undefined, msg.details, out.phases.brainstorm.status === "in_progress", specDirs, planDirs, cwd);
        if (input) out.bindings.push(input);
      }
    }
    return out;
  }

  // ---- extension -----------------------------------------------------------------------

  const ownSkills = fileURLToPath(new URL("../skills", import.meta.url));
  const hasSkillReads = (phases: Accumulators["phases"]) => Object.values(phases).some(p => p.skill_reads?.length);
  const isSubagentChild = (): boolean => Number(process.env.PI_SUBAGENT_DEPTH ?? "0") > 0;

  export default function (pi: ExtensionAPI, deps: Deps = realDeps) {
    let phases: PhaseMap = emptyPhases();
    let toplevel: string | undefined; // toplevel of the bound record's checkout; undefined until bind
    let checkoutVia: "git" | "jj" | undefined; // which binary resolved toplevel; undefined until bind
    let boundSpec: string | undefined; // repo-relative
    let record: TelemetryRecord | undefined;
    const predecessorLinks = new Set<string>();
    let recordRel: string | undefined; // absolute record path outside the working tree
    let buffer: TelemetryEvent[] = [];
    let pending: Accumulators = emptyAccumulators();
    let frozen = false;
    let recordWritten = false;
    let gauntletEntered = false;
    let liveReadEntry = false;
    let readGap = false;
    // A disabled capture gap belongs to its run even if navigation drops the binding.
    const pendingCoverageDowngrades = new Set<string>();
    let disabledGap = false;
    // Journal only binding inputs, with paths resolved against the cwd that produced them.
    let deferredBindings: BindingStep[] = [];
    let deferredReplay: BindingStep[] = [];
    const outgoingBindings: { initial?: Binding; writtenRun?: string; replay: BindingStep[]; live: BindingStep[] }[] = [];
    let reconciling: Promise<void> | undefined;
    const readCalls = new Map<string, { cwd: string; input: { path?: unknown } }>();
    let settingsWarned = false;
    let sessionId = "";
    const guardCache = new Map<string, Map<string, string>>();
    let guardWarned = false;
    let currentDir = "";
    let councilPending: { memberResults: MemberResult[]; chair?: { model: string; dispatches: number; clusters?: Cluster[] } } | undefined;

    const noteReadGap = () => {
      disabledGap = true;
      if (record?.derived.skill_read_coverage === "complete") pendingCoverageDowngrades.add(record.run_id);
    };

    const bindingStep = (input: BindingInput, cwd: string, settings: SettingsSnapshot): BindingStep => ({ input, cwd, settings });

    const observeSettings = (s: SettingsSnapshot): SettingsSnapshot | undefined => {
      if (!s.telemetry.enabled) {
        if (gauntletEntered) noteReadGap();
        readCalls.clear();
        pendingTest.clear();
        return undefined;
      }
      if (record?.derived.skill_read_coverage === "complete" && pendingCoverageDowngrades.has(record.run_id)) {
        record.derived.skill_read_coverage = "partial";
        flush();
      }
      return s;
    };
    const enabledSettings = async (ctx: ExtensionContext, settings?: SettingsSnapshot) => {
      if (isSubagentChild()) return undefined;
      const snap = observeSettings(settings ?? deps.settings(ctx.cwd));
      if (!snap) return undefined;
      if (!reconciling && (disabledGap || outgoingBindings.length)) {
        reconciling = reconcileBindings(snap).finally(() => { reconciling = undefined; });
      }
      await reconciling;
      return snap;
    };

    // Resolves a tool path (relative to ctx.cwd or absolute) to its owning checkout and
    // checkout-relative key. undefined outside any checkout.
    const locate = async (cwd: string, p: string): Promise<SpecLocation | undefined> => {
      const candidateAbs = isAbsolute(p) ? p : resolve(cwd, p);
      const co = await checkoutOf(candidateAbs, deps.git, deps.jj);
      const rel = co ? repoRelativeToolPath(co.toplevel, cwd, p) : undefined;
      return co && rel ? { toplevel: co.toplevel, rel, via: co.via } : undefined;
    };

    // Disarmed and unbound: activity outside the gauntlet is never charged to the next run.
    const live = (): Accumulators => record
      ? (record.accumulators[sessionId] ??= emptyAccumulators())
      : legAcc() ?? (gauntletEntered ? pending : emptyAccumulators());

    const canBind = (): boolean => gauntletEntered && !frozen && phases.ship.status !== "complete";

    const abs = (rel: string): string => join(toplevel!, rel);
    const phaseNow = (): PhaseKey => currentPhase(phases);

    const pushEvent = (e: Omit<TelemetryEvent, "ts" | "session" | "phase"> & Partial<BaseEvent>): TelemetryEvent => {
      const full = { ts: deps.now(), session: sessionId, phase: phaseNow(), ...e } as TelemetryEvent;
      if (record) record.events.push(full);
      else if (gauntletEntered) buffer.push(full);
      return full;
    };

    const warn = (message: string) => pushEvent({ kind: "warning", message });

    // ---- record store ----
    // The seal either keeps a stamped file for retry or removes it after committing.
    // Neither may be overwritten by a later recorder flush.
    const sealedAt = (path: string): boolean => {
      const text = deps.fs.readFile(path);
      const parsed = text ? parseRecord(text) : undefined;
      return !!parsed && parsed.status !== "in_progress";
    };

    const recordWritable = () => !!toplevel && deps.fs.exists(toplevel)
      && !!recordRel && (!recordWritten || deps.fs.exists(recordRel)) && !sealedAt(recordRel);

    const writeRecordFile = (target: string, run: TelemetryRecord) => {
      deps.fs.mkdirp(dirname(target));
      deps.fs.writeFile(target + ".tmp", serializeRecord(run));
      deps.fs.rename(target + ".tmp", target);
    };

    const writeRecord = () => {
      if (!record || !recordRel || frozen) return;
      const target = recordRel;
      if (!recordWritable()) {
        readCalls.clear();
        frozen = true;
        return;
      }
      const capped = capEvents(record.events);
      if (capped.dropped) {
        record.events = capped.events;
        live().events_dropped += capped.dropped;
      }
      record.derived = derive(record, deps.now());
      try {
        writeRecordFile(target, record);
        recordWritten = true;
        if (record.derived.skill_read_coverage === "partial") pendingCoverageDowngrades.delete(record.run_id);
      } catch (e) {
        pushEvent({ kind: "warning", message: `record write failed: ${String((e as Error).message ?? e).split("\n")[0]}` });
      }
    };

    const flush = writeRecord;

    const loadOrCreate = (specRel: string): TelemetryRecord => {
      const rel = recordPathFor(currentDir, specRel);
      const existing = deps.fs.readFile(rel);
      const parsed = existing ? parseRecord(existing) : undefined;
      const missedReads = readGap || disabledGap;
      if (parsed) {
        // fold stale live blocks (sessions that died without shutdown) into total
        for (const k of Object.keys(parsed.accumulators)) {
          if (k === "total" || k === sessionId) continue;
          parsed.accumulators.total = foldAccumulators(parsed.accumulators.total ?? emptyAccumulators(), parsed.accumulators[k]);
          delete parsed.accumulators[k];
        }
        if (!parsed.sessions.includes(sessionId)) parsed.sessions.push(sessionId);
        parsed.spec = specRel;
        if (parsed.derived.skill_read_coverage === "complete" && (missedReads || pendingCoverageDowngrades.has(parsed.run_id))) {
          parsed.derived.skill_read_coverage = "partial";
        }
        if (hasSkillReads(pending.phases)) parsed.derived.skill_read_coverage ??= "partial";
        return parsed;
      }
      const fresh = newRecord({ spec: specRel, session: sessionId, now: buffer[0]?.ts ?? deps.now(), runId: randomUUID() });
      fresh.derived.skill_read_coverage = liveReadEntry && !missedReads ? "complete" : "partial";
      return fresh;
    };

    const shippedRecords = (top: string, snap: SettingsSnapshot): Map<string, string> => {
      const key = JSON.stringify([top, snap.telemetry.remote]);
      let records = guardCache.get(key);
      if (!records) {
        records = new Map();
        guardCache.set(key, records);
        const repo = (deps.telemetryRepo ?? telemetryRepo)(top);
        const result = (deps.readTelemetryBranch ?? readTelemetryBranch)(top, { remote: snap.telemetry.remote, prefix: `${repo}/brainstorming/` });
        for (const entry of result.records) {
          const parsed = parseRecord(entry.bytes);
          if (parsed?.shipped_at) records.set(parsed.spec, parsed.shipped_at);
        }
        if (result.warning && !guardWarned) {
          guardWarned = true;
          pi.sendMessage({ customType: "telemetry-warning", content: `telemetry guard unavailable: ${result.warning}`, display: true });
        }
      }
      return records;
    };

    const bindingFor = async (loc: SpecLocation, snap: SettingsSnapshot, observed: boolean): Promise<Binding | undefined> => {
      const { toplevel, rel, via } = loc;
      if (via === "git" && shippedRecords(toplevel, snap).has(rel)) return;
      let metadataDir = join(toplevel, ".jj");
      if (via === "git") {
        const common = await deps.git(["rev-parse", "--path-format=absolute", "--git-common-dir"], toplevel);
        if (common.code !== 0 || !common.stdout.trim()) {
          if (observed) warn(`record bind skipped: git common dir unavailable: ${common.stderr.trim().split("\n")[0]}`);
          return;
        }
        metadataDir = common.stdout.trim();
      }
      const dir = join(metadataDir, "gauntlet", "telemetry");
      return { ...loc, dir, file: recordPathFor(dir, rel) };
    };

    const bind = async (target: Binding, snap: SettingsSnapshot) => {
      if (record) unbind();
      const { rel: specRel } = target;
      toplevel = target.toplevel;
      checkoutVia = target.via;
      currentDir = target.dir;
      boundSpec = specRel;
      recordRel = target.file;
      predecessorLinks.clear();
      record = loadOrCreate(specRel);
      for (const link of record.supersedes ?? []) {
        if (!isSafeSpecLink(link, snap.specDirs)) continue;
        const predecessor = deps.fs.readFile(abs(link));
        if (predecessor !== undefined && isSupersededByBanner(predecessor, record.spec)) predecessorLinks.add(link);
      }
      if (!record.author || !record.branch) {
        const [name, email, branch] = await Promise.all([
          deps.git(["config", "user.name"], toplevel!),
          deps.git(["config", "user.email"], toplevel!),
          deps.git(["rev-parse", "--abbrev-ref", "HEAD"], toplevel!),
        ]);
        const author = compact({ name: name.stdout.trim() || undefined, email: email.stdout.trim() || undefined });
        if (Object.keys(author).length) record.author ??= author;
        if (branch.code === 0 && branch.stdout.trim()) record.branch ??= branch.stdout.trim();
      }
      if (Object.keys(snap.versions).length) record.versions ??= snap.versions;
      if (snap.agentOverrides) record.agent_overrides ??= snap.agentOverrides;
      record.events.push(...buffer);
      record.accumulators[sessionId] = foldAccumulators(record.accumulators[sessionId] ?? emptyAccumulators(), pending);
      pending = emptyAccumulators();
      const approval = record.events.find((e) => e.kind === "phase" && e.name === "brainstorm" && (e.action === "complete" || e.action === "skip"));
      if (approval) record.approved_at ??= approval.ts;
      buffer = [];
      if (!settingsWarned && (snap.errors.length || snap.telemetry.warning)) {
        settingsWarned = true;
        if (snap.errors.length) warn(settingsErrorWarning(snap.errors));
        if (snap.telemetry.warning) warn(snap.telemetry.warning);
      }
      refreshLinks();
    };

    const unbind = () => {
      if (record && hasSkillReads(record.derived.phases)) readGap = true;
      toplevel = undefined;
      checkoutVia = undefined;
      boundSpec = undefined;
      record = undefined;
      recordRel = undefined;
      frozen = false;
      recordWritten = false;
      councilPending = undefined;
    };

    const isSafeSpecLink = (link: string, specDirs: readonly string[]): boolean => {
      const normalized = posix.normalize(link);
      return isSpecPath(link, specDirs) && !posix.isAbsolute(link) && normalized !== ".." && !normalized.startsWith("../");
    };

    const refreshLinks = () => {
      if (!record || !boundSpec) return;
      const body = deps.fs.readFile(abs(boundSpec));
      if (body === undefined) return;
      const links = parseSpecLinks(body);
      const supersedes = [...new Set([...links.supersedes, ...predecessorLinks])];
      record.supersedes = supersedes.length ? supersedes : undefined;
      record.fixes = links.fixes.length ? links.fixes : undefined;
    };

    const currentBinding = (): Binding | undefined => boundSpec && toplevel && checkoutVia && recordRel
      ? { rel: boundSpec, toplevel, via: checkoutVia, dir: currentDir, file: recordRel }
      : undefined;

    const isDraftOrMissing = (spec: SpecLocation): boolean => {
      const body = deps.fs.readFile(join(spec.toplevel, spec.rel));
      return body === undefined || body.split("\n")[0] === CONTEXT_DRAFT_MARKER;
    };

    const rebind = (newSpec: string, observed: boolean): boolean => {
      const from = recordRel!;
      const to = recordPathFor(currentDir, newSpec);
      if (deps.fs.exists(to)) {
        if (observed) warn(`record move skipped: ${to} already exists`);
        return false;
      }
      try {
        deps.fs.mkdirp(dirname(to));
        deps.fs.rename(from, to);
      } catch (e) {
        if (observed) warn(`record move failed: ${String((e as Error).message ?? e).split("\n")[0]}`);
        return false;
      }
      if (observed) pushEvent({ kind: "spec_renamed", from: boundSpec!, to: newSpec });
      boundSpec = newSpec;
      recordRel = to;
      record!.spec = newSpec;
      return true;
    };

    const bindingDecision = async (tool: BindingInput["tool"], loc: SpecLocation | undefined, snap: SettingsSnapshot, current: Binding | undefined, brainstorming: boolean, observed: boolean): Promise<Binding | "move" | undefined> => {
      if (!loc || (loc.rel === current?.rel && loc.toplevel === current.toplevel)) return;
      const spec = isSpecPath(loc.rel, snap.specDirs);
      if (tool === "plan_check" || tool === "resume") {
        if (tool === "plan_check" || (!current && spec)) return bindingFor(loc, snap, observed);
      } else if (tool !== "read" && spec) {
        if (!current || loc.toplevel !== current.toplevel) return bindingFor(loc, snap, observed);
        if (tool === "write" && brainstorming && isDraftOrMissing(current)) return "move";
      } else if (!current && isPlanPath(loc.rel, snap.planDirs)) {
        const path = planSpecHeader(deps.fs.readFile(join(loc.toplevel, loc.rel)) ?? "");
        const rel = path && repoRelativeToolPath(loc.toplevel, loc.toplevel, path);
        if (rel && deps.fs.exists(join(loc.toplevel, rel))) return bindingFor({ ...loc, rel }, snap, observed);
      }
    };

    const resolveStep = async ({ input, cwd, settings }: BindingStep, current: Binding | undefined, observed = false) => {
      const loc = await locate(cwd, input.path);
      const decision = await bindingDecision(input.tool, loc, settings, current, !!input.brainstorming, observed);
      return { loc, decision };
    };

    const applyBinding = async (decision: Binding | "move" | undefined, loc: SpecLocation | undefined, snap: SettingsSnapshot, observed: boolean) => {
      if (decision === "move") return rebind(loc!.rel, observed);
      if (!decision) return false;
      await bind(decision, snap);
      return true;
    };

    const readBinding = (target: Binding) => {
      const text = deps.fs.readFile(target.file);
      return text ? parseRecord(text) : undefined;
    };

    // Replay selects a binding, without creating or moving intermediate records.
    const replayBinding = async (steps: BindingStep[]) => {
      let current: Binding | undefined;
      for (const step of steps) {
        const old = current && readBinding(current);
        if (old && old.status !== "in_progress") break;
        const { loc, decision } = await resolveStep(step, current);
        if (decision === "move") {
          // A rename that already ran left no record at the source.
          if (!deps.fs.exists(current!.file)) {
            const rel = loc!.rel;
            current = { ...current!, rel, file: recordPathFor(current!.dir, rel) };
          }
        } else if (decision) current = decision;
      }
      return current;
    };

    const downgradeBinding = (target: Binding) => {
      const old = readBinding(target);
      if (old?.status !== "in_progress" || old.derived.skill_read_coverage !== "complete") return;
      old.derived.skill_read_coverage = "partial";
      try {
        writeRecordFile(target.file, old);
        pendingCoverageDowngrades.delete(old.run_id);
      } catch {
        pendingCoverageDowngrades.add(old.run_id);
      }
    };

    const reconcileOutgoing = async () => {
      for (const { initial, writtenRun, replay, live } of outgoingBindings.splice(0)) {
        if (initial && writtenRun && readBinding(initial)?.run_id !== writtenRun) continue;
        let current = initial ?? await replayBinding(replay);
        if (!initial && current) downgradeBinding(current);
        for (const step of live) {
          const old = current && readBinding(current);
          if (old && old.status !== "in_progress") break;
          const { decision } = await resolveStep(step, current);
          // A stale event may identify an existing measurement, but cannot move it.
          if (decision && decision !== "move") {
            current = decision;
            downgradeBinding(current);
          }
        }
      }
    };

    const reconcileBindings = async (snap: SettingsSnapshot) => {
      await reconcileOutgoing();
      if (!disabledGap) return;
      if (record && !recordWritable()) {
        readCalls.clear();
        frozen = true;
      }
      if (canBind() && deferredReplay.length) {
        const target = await replayBinding(deferredReplay);
        if (target) {
          await bind(target, snap);
          flush();
        }
      }
      for (const step of deferredBindings) {
        if (!canBind()) break;
        const { loc, decision } = await resolveStep(step, currentBinding());
        if (await applyBinding(decision, loc, snap, false)) flush();
      }
      deferredReplay = [];
      deferredBindings = [];
      readGap ||= !record;
      disabledGap = false;
    };

    // ---- phase mirror ----
    const clearRunState = () => {
      deferredBindings = [];
      deferredReplay = [];
      unbind();
      readCalls.clear();
      liveReadEntry = false;
      readGap = false;
      disabledGap = false;
      lastPlanTasks = undefined;
      pendingTest.clear();
      buffer = [];
      pending = emptyAccumulators();
    };

    const applyPhaseDetails = async (details: { action?: string; phases?: PhaseMap; error?: string; rounds?: number } | undefined, settings: SettingsSnapshot, replay = false) => {
      if (!details?.phases || details.error) return;
      const action = details.action ?? "";
      const snap = settings.telemetry.enabled ? settings : undefined;
      const entered = nextGauntletEntered(gauntletEntered, action, details.phases.brainstorm.status);
      if (!gauntletEntered && entered && snap && !replay) liveReadEntry = true;
      gauntletEntered = entered;
      if (details.phases.ship.status === "complete") {
        readCalls.clear();
        deferredBindings = [];
        deferredReplay = [];
      }
      if (!replay && action === "skip" && canBind() && details.phases.ship.status !== "complete" && lastCtx) {
        const resumed = resumeSpecOf(details.phases, settings.specDirs, lastCtx.cwd);
        if (resumed) {
          const step = bindingStep({ tool: "resume", path: resumed }, lastCtx.cwd, settings);
          if (snap) {
            const { loc, decision } = await resolveStep(step, currentBinding(), true);
            await applyBinding(decision, loc, snap, true);
          } else deferredBindings.push(step);
        }
      }
      if (!snap) {
        phases = details.phases;
        if (action === "reset") clearRunState();
        if (entered) noteReadGap();
        return;
      }
      const transitions = diffPhases(replay ? emptyPhases() : phases, details.phases, action).filter((t) => !replay || t.name === "brainstorm");
      if (action === "grant_fix_rounds") {
        live().gates.fix_round_grants += 1;
        pushEvent({ kind: "gate", gate: "fix_round_grant", rounds: typeof details.rounds === "number" ? details.rounds : undefined });
        flush();
      }
      for (const t of transitions) {
        const model = ctxModel();
        const e = replay ? undefined : pushEvent(
          t.action === "start"
            ? { kind: "phase", action: "start", name: t.name, model, thinking: ctxThinking() }
            : t.action === "reset"
              ? { kind: "phase", action: "reset" }
              : { kind: "phase", action: t.action, name: t.name },
        );
        if (t.action === "start" && t.name === "brainstorm") councilPending = undefined;
        if (record && t.action === "start" && t.name === "implement") record.derived.verification_runs ??= 0;
        phases = details.phases;
        if (record && boundSpec && t.name === "brainstorm" && (t.action === "complete" || t.action === "skip")) {
          if (e) record.approved_at ??= e.ts;
          if (!replay || !record.events.some((event) => event.kind === "engine")) {
            const body = deps.fs.readFile(abs(boundSpec)) ?? "";
            const header = body.split(/^## /m, 1)[0];
            const engine = /^\*\*Engine:\*\*[ \t]+loop[ \t]*$/m.test(header) ? "loop" : "waves";
            pushEvent({ kind: "engine", engine });
          }
        }
        if (record && t.name === "ship" && t.action === "complete" && checkoutVia === "jj") await onShipKeep(snap);
        flush();
        if (t.action === "reset") clearRunState();
      }
      phases = details.phases;
    };

    let lastCtx: ExtensionContext | undefined;
    const ctxModel = (): string | undefined => (lastCtx?.model ? `${lastCtx.model.provider}/${lastCtx.model.id}` : undefined);
    const ctxThinking = (): string | undefined => lastCtx?.thinkingLevel;

    // jj keep-path seal on `phase complete ship`; git checkouts are sealed by the bin. Defined in block 3.
    let onShipKeep: (snap: SettingsSnapshot) => Promise<void>;

    // ---- handlers ----
    // Same lifecycle set as phase-tracker.ts: every navigation rebuilds marker, phases, and
    // binding from the target branch in order.
    const reconstruct = async (ctx: ExtensionContext) => {
      if (isSubagentChild()) return;
      const settings = deps.settings(ctx.cwd);
      const snap = observeSettings(settings);
      if (snap) {
        await reconciling;
        flush();
      }
      if (!frozen && (deferredReplay.length || deferredBindings.length)) {
        outgoingBindings.push({
          initial: currentBinding(), writtenRun: recordWritten ? record?.run_id : undefined,
          replay: deferredReplay, live: deferredBindings,
        });
      }
      if (snap) await reconcileOutgoing();
      // Unscoped disabled gaps cannot follow navigation to an unrelated binding.
      const lostPending = !disabledGap && (hasSkillReads(pending.phases) || (!record && readGap));
      clearRunState();
      lastCtx = ctx;
      amendmentOpen = false;
      const nextSession = ctx.sessionManager.getSessionId();
      const sameSession = nextSession === sessionId;
      if (!sameSession) {
        guardCache.clear();
        guardWarned = false;
      }
      sessionId = nextSession;
      const replay = replayBranch(ctx.sessionManager.getBranch(), settings.specDirs, settings.planDirs, ctx.cwd);
      lastPlanTasks = replay.lastPlanTasks;
      phases = replay.phases;
      gauntletEntered = replay.gauntletEntered;
      readGap = gauntletEntered && sameSession && lostPending;
      if (!canBind()) return;
      const steps = replay.bindings.map(input => bindingStep(input, ctx.cwd, settings));
      if (!snap) {
        deferredReplay = steps;
        noteReadGap();
        return;
      }
      const target = await replayBinding(steps);
      if (target) {
        await bind(target, snap);
        const status = replay.phases.brainstorm.status;
        if (status === "complete" || status === "skipped") {
          await applyPhaseDetails({ action: status === "complete" ? "complete" : "skip", phases: replay.phases }, snap, true);
        }
        flush();
      }
    };
    for (const event of ["session_start", "session_switch", "session_fork", "session_tree"] as const) {
      pi.on(event, async (_event, ctx) => reconstruct(ctx));
    }

    pi.on("session_shutdown", async (_event, ctx) => {
      readCalls.clear();
      const snap = await enabledSettings(ctx);
      if (!snap || !record) return;
      const liveBlock = record.accumulators[sessionId];
      if (liveBlock) {
        record.accumulators.total = foldAccumulators(record.accumulators.total ?? emptyAccumulators(), liveBlock);
        delete record.accumulators[sessionId];
      }
      flush();
    });

    pi.on("tool_result", async (event, ctx) => {
      const text = pendingWarnings.take(event.toolCallId);
      if (text) return pendingWarnings.deliver(event, text);
      lastCtx = ctx;
      if (isSubagentChild()) return undefined;
      const settings = deps.settings(ctx.cwd);
      const snap = await enabledSettings(ctx, settings);
      if (!sessionId) sessionId = ctx.sessionManager.getSessionId();
      if (event.toolName === "phase_tracker" && !event.isError) {
        await applyPhaseDetails(event.details as never, settings);
        return undefined;
      }
      if (!snap) {
        if (canBind() && !event.isError) {
          const input = bindingInput(event.toolName, event.input, event.details, phases.brainstorm.status === "in_progress", settings.specDirs, settings.planDirs, ctx.cwd);
          if (input) deferredBindings.push(bindingStep(input, ctx.cwd, settings));
        }
        return undefined;
      }
      if (event.toolName === "subagent" && legAcc()) {
        await onSubagentResult(event.details, event.content, event.isError);
        return undefined;
      }
      if (!record && !canBind()) return undefined;
      if (event.toolName === "plan_check" && !event.isError) {
        const d = event.details as { status?: string; specPath?: string; planPath?: string } | undefined;
        const specLoc = d?.specPath ? await locate(ctx.cwd, d.specPath) : undefined;
        const planLoc = d?.planPath ? await locate(ctx.cwd, d.planPath) : undefined;
        const spec = specLoc?.rel;
        const plan = planLoc?.rel;
        const pass = d?.status === "pass";
        if (pass && canBind()) {
          const decision = await bindingDecision("plan_check", specLoc, snap, currentBinding(), false, true);
          if (decision && decision !== "move") await bind(decision, snap);
        }
        live().gates.plan_rounds += 1;
        pushEvent({ kind: "plan_check", pass, spec, plan });
        flush();
        return undefined;
      }
      if ((event.toolName === "write" || event.toolName === "edit" || event.toolName === "read") && !event.isError) {
        const rawPath = (event.input as { path?: unknown }).path;
        const loc = typeof rawPath === "string" ? await locate(ctx.cwd, rawPath) : undefined;
        if (!loc) {
          if (typeof rawPath === "string" && isSpecPath(toPosix(rawPath), snap.specDirs)) warn(`spec ${rawPath} is outside a git checkout; telemetry not recorded`);
          return undefined;
        }
        return onSpecInteraction(event.toolName, loc, snap, phases.brainstorm.status === "in_progress", event);
      }
      if (event.toolName === "subagent") {
        if (phaseNow() === "brainstorm") onCouncilResults(event.details, event.content);
        await onSubagentResult(event.details, event.content, event.isError);
        return undefined;
      }
      if (event.toolName === "bash") {
        const matched = pendingTest.get(event.toolCallId);
        if (matched && record) {
          pendingTest.delete(event.toolCallId);
          record.derived.tests = { command: truncateCommand(matched), result: event.isError ? "fail" : "pass" };
          flush();
        }
        return undefined;
      }

      return undefined;
    });

    const onSpecInteraction = async (tool: "write" | "edit" | "read", loc: SpecLocation, snap: SettingsSnapshot, brainstorming: boolean, event: ToolResultEvent): Promise<unknown> => {
      const decision = canBind() ? await bindingDecision(tool, loc, snap, currentBinding(), brainstorming, true) : undefined;
      const changed = await applyBinding(decision, loc, snap, true);
      if (tool !== "read" && loc.toplevel === toplevel && loc.rel === boundSpec) {
        const patch = onBoundSpecWrite(tool, loc.rel, event);
        flush();
        return decision === "move" ? undefined : patch;
      }
      if (tool === "edit" && loc.toplevel === toplevel && isSpecPath(loc.rel, snap.specDirs)) {
        onOtherSpecEdit(loc.rel, event, snap.specDirs);
        flush();
      } else if (changed || decision === "move") flush();
      return undefined;
    };

    // Defined in block 2.
    let onBoundSpecWrite: (tool: "write" | "edit", rel: string, event: ToolResultEvent) => unknown;
    let onOtherSpecEdit: (rel: string, event: { input: unknown }, specDirs: string[]) => void;

    let amendmentOpen = false;
    let lastPlanTasks: { name?: string; status: string }[] | undefined;
    const pendingTest = new Map<string, string>(); // toolCallId -> matched statement
    const pendingWarnings = createPendingWarnings();

    const phaseAcc = (k: PhaseKey = phaseNow()): PhaseAcc => (live().phases[k] ??= {});

    const addPhaseTokens = (t: Tokens | undefined, k: PhaseKey = phaseNow()) => {
      if (!t) return;
      const acc = phaseAcc(k);
      acc.tokens = addTokens(acc.tokens, t);
    };

    const onCouncilResults = (details: unknown, content: unknown) => {
      const results = (details as { results?: unknown[] } | undefined)?.results;
      if (!Array.isArray(results) || !results.length) return;
      const typed = results.map((raw) => raw as { agent?: unknown; exitCode?: unknown; model?: unknown; savedOutputPath?: unknown });
      if (councilPending?.chair && typed.some((r) => r.agent === "spec-council-member")) councilPending = undefined;
      for (const r of typed) {
        if (r.agent === "spec-council-member") {
          (councilPending ??= { memberResults: [] }).memberResults.push({
            model: typeof r.model === "string" ? r.model : undefined,
            exitCode: typeof r.exitCode === "number" ? r.exitCode : undefined,
            savedOutputPath: typeof r.savedOutputPath === "string" ? r.savedOutputPath : undefined,
          });
        } else if (r.agent === "spec-council-synthesizer") {
          const chair = ((councilPending ??= { memberResults: [] }).chair ??= { model: "unknown", dispatches: 0 });
          if (typeof r.model === "string") chair.model = r.model;
          chair.dispatches += 1;
          const parsed = parseChairReport(textOf(content))
            ?? (typeof r.savedOutputPath === "string" ? parseChairReport(deps.fs.readFile(r.savedOutputPath) ?? "") : null);
          if (parsed) chair.clusters = parsed.clusters;
        } else if (r.agent === "spec-council-applier" && r.exitCode === 0) {
          onCouncilAudit(textOf(content));
        }
      }
    };

    const onCouncilAudit = (text: string) => {
      const pending = councilPending;
      const clusters = pending?.chair?.clusters;
      if (!record || !pending?.chair || !clusters) return;
      const audit = parseAudit(text);
      if (!audit) return;
      const members = resolveMembers(pending.memberResults);
      const block = members && buildCouncil({ chair: { ...pending.chair, clusters }, members, audit });
      if (!block) return;
      record.derived.council = block;
      councilPending = undefined;
      flush();
    };

    const onSubagentResult = async (details: unknown, content: unknown, isError: boolean) => {
      const results = (details as { results?: unknown[] } | undefined)?.results;
      if (!Array.isArray(results) || results.length === 0) return;
      const acc = live();
      const text = textOf(content);
      for (const raw of results) {
        const r = raw as { agent?: unknown; exitCode?: unknown; model?: unknown; usage?: unknown };
        const agent = typeof r.agent === "string" ? r.agent : "unknown";
        const exit = typeof r.exitCode === "number" ? r.exitCode : undefined;
        const model = typeof r.model === "string" ? r.model : undefined;
        pushEvent({ kind: "dispatch", agent, model, exit: exit === 0 ? undefined : exit });
        const tokens = usageToTokens(r.usage);
        addPhaseTokens(tokens);
        const persona = (acc.personas[agent] ??= { dispatches: 0, models: [] });
        persona.dispatches += 1;
        if (model && !persona.models.includes(model)) persona.models.push(model);
        if (tokens) persona.tokens = addTokens(persona.tokens, tokens);
        if (!isError && agent === "spec-summarizer") acc.gates.spec_rounds += 1;
        if (REVIEWER_AGENTS.has(agent)) {
          const review = (acc.reviews[agent] ??= { dispatches: 0, nonzero_exit: 0 });
          review.dispatches += 1;
          if (exit !== undefined && exit !== 0) review.nonzero_exit += 1;
          const findings = countStructuredFindings(text) ?? countFindings(text);
          if (findings) {
            review.findings ??= { blocker: 0, major: 0, minor: 0 };
            review.findings.blocker += findings.blocker;
            review.findings.major += findings.major;
            review.findings.minor += findings.minor;
          }
          if (!isError && agent === "conformance-reviewer") {
            if (phases.verify.status === "in_progress") acc.conformance_loops += 1;
            const openGaps = countOpenGaps(text);
            if (openGaps !== undefined) acc.conformance_open_gaps = openGaps;
          }
        }
      }
      flush();
    };

    const onPlanTracker = async (details: unknown, settings: SettingsSnapshot) => {
      const d = details as { tasks?: { name?: string; status: string }[]; error?: string } | undefined;
      if (!d || d.error || !Array.isArray(d.tasks)) return;
      const previous = lastPlanTasks;
      lastPlanTasks = d.tasks;
      const next = afterPlanActivity(phases, d.tasks);
      if (!settings.telemetry.enabled || (!record && !canBind())) {
        phases = next;
        return;
      }
      const reopens = countReopens(previous, d.tasks);
      if (reopens) {
        live().gates.task_reopens += reopens;
        pushEvent({ kind: "gate", gate: "task_reopen" });
      }
      if (next !== phases) {
        if (record) record.derived.plan = planTotals(d.tasks);
        await applyPhaseDetails({ action: "complete", phases: next }, settings);
        return;
      }
      if (record) flush();
    };

    // jj only: finishing cannot run in a plain jj workspace, so `phase complete ship` seals
    // the record in place (jj snapshots the working copy; there is no commit step).
    onShipKeep = async (snap) => {
      if (!record || !toplevel || liveShipEvent(record.events)) return;
      record.status = "shipped";
      record.shipped_at = deps.now();
      const out = await computeJjDiff({ jj: deps.jj ?? realJj, cwd: toplevel, spec: record.spec, dir: DEFAULT_TELEMETRY_DIR, buckets: snap.telemetry.buckets, planDirs: snap.planDirs });
      if (out.warning) warn(out.warning);
      record.derived.modified_files = out.modified_files;
      record.derived.diff = out.diff;
      pushEvent({ kind: "ship", option: "keep" });
    };

    pi.on("tool_call", async (event, ctx) => {
      lastCtx = ctx;
      const snap = await enabledSettings(ctx);
      if (!snap) return undefined;
      if (event.toolName === "read" && canBind()) readCalls.set(event.toolCallId, { cwd: ctx.cwd, input: event.input });
      if (event.toolName === "write") {
        const rawPath = (event.input as { path?: unknown }).path;
        if (typeof rawPath === "string" && phases.brainstorm.status === "in_progress") {
          const loc = await locate(ctx.cwd, rawPath);
          if (loc?.via === "git" && isSpecPath(loc.rel, snap.specDirs)) {
            const shippedAt = shippedRecords(loc.toplevel, snap).get(loc.rel);
            if (shippedAt) return { block: true, reason: guardReason(loc.rel, shippedAt, "refs/telemetry/records") };
          }
        }
        return undefined;
      }
      if (event.toolName === "bash") {
        const command = String((event.input as { command?: unknown }).command ?? "");
        if (phaseNow() === "brainstorm" && /\bgit\b[^\n]*\bcommit\b/.test(command)) onCouncilAudit(command);
        if (record && !frozen) {
          const statement = matchTestStatement(command, snap.testCommands ?? DEFAULT_TEST_COMMANDS);
          if (statement) {
            if (record.events.some((e) => e.kind === "phase" && e.action === "start" && e.name === "implement")) {
              record.derived.verification_runs = (record.derived.verification_runs ?? 0) + 1;
              flush();
            }
            if (phases.verify.status === "in_progress" || phases.ship.status === "in_progress") pendingTest.set(event.toolCallId, statement);
          }
        }
      }
      return undefined;
    });
    pi.on("tool_execution_end", async (event, ctx) => {
      if (event.toolName === "plan_tracker") {
        if (isSubagentChild()) return;
        lastCtx = ctx;
        const settings = deps.settings(ctx.cwd);
        await enabledSettings(ctx, settings);
        if (!sessionId) sessionId = ctx.sessionManager.getSessionId();
        if (!event.isError) await onPlanTracker(event.result?.details, settings);
        return;
      }
      if (event.toolName !== "read" || !await enabledSettings(ctx)) return;
      const call = readCalls.get(event.toolCallId);
      readCalls.delete(event.toolCallId);
      if (!canBind() || event.isError || typeof call?.input.path !== "string") return;
      const path = skillReadPath(call.cwd, call.input.path, ownSkills);
      if (!path || !Array.isArray(event.result?.content)) return;
      let bytes: number | undefined;
      for (const block of event.result.content) {
        if (block?.type === "text" && typeof block.text === "string") bytes = (bytes ?? 0) + Buffer.byteLength(block.text);
      }
      if (bytes === undefined) return;
      // A standalone leg can be live before bind, but skill reads belong only to the entered run.
      const acc = record ? live() : pending;
      const phase: PhaseAcc = (acc.phases[phaseNow()] ??= {});
      (phase.skill_reads ??= []).push({ path, bytes });
      if (record) record.derived.skill_read_coverage ??= "partial";
      flush();
    });
    pi.on("message_end", async (event, ctx) => {
      lastCtx = ctx;
      if (!await enabledSettings(ctx)) return;
      const msg = event.message as { role?: string; usage?: unknown; content?: unknown };
      if (msg.role !== "assistant") return;
      addPhaseTokens(usageToTokens(msg.usage));
      const u = msg.usage as { cacheRead?: unknown; cacheWrite?: unknown; cacheWrite1h?: unknown } | undefined;
      if (u && typeof u === "object") {
        const n = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
        (phaseAcc().parent_calls ??= []).push([n(u.cacheRead), n(u.cacheWrite), n(u.cacheWrite1h)]);
      }
      if (phaseNow() === "brainstorm") onCouncilAudit(textOf(msg.content));
    });

    pi.on("turn_end", async (_event, ctx) => {
      if (!await enabledSettings(ctx)) return;
      const tokens = ctx.getContextUsage?.()?.tokens;
      if (typeof tokens !== "number") return;
      const acc = phaseAcc();
      acc.peak_context = Math.max(acc.peak_context ?? 0, tokens);
    });

    pi.on("input", async (event, ctx) => {
      if (!await enabledSettings(ctx)) return undefined;
      amendmentOpen = false;
      if (!record || event.source === "extension" || event.text.trimStart().startsWith("/")) return undefined;
      const k = phaseNow();
      if (COUNTED_USER_PHASES.has(k)) {
        const acc = phaseAcc(k);
        acc.user_messages = (acc.user_messages ?? 0) + 1;
      }
      return undefined;
    });

    pi.on("model_select", async (event, ctx) => {
      lastCtx = ctx;
      if (!await enabledSettings(ctx) || phaseNow() === "unphased") return;
      pushEvent({ kind: "config_change", model: `${event.model.provider}/${event.model.id}` });
      flush();
    });

    pi.on("thinking_level_select", async (event, ctx) => {
      lastCtx = ctx;
      if (!await enabledSettings(ctx) || phaseNow() === "unphased") return;
      pushEvent({ kind: "config_change", thinking: String(event.level) });
      flush();
    });

    pi.on("session_compact", async (_event, ctx) => {
      if (!await enabledSettings(ctx)) return;
      const acc = phaseAcc();
      acc.compactions = (acc.compactions ?? 0) + 1;
      flush();
    });

    onBoundSpecWrite = (tool, rel, event) => {
      if (!record) return undefined;
      if (tool === "edit" && SUPERSEDED_BY_RE.test(insertedText(event.input))) return undefined;
      const body = deps.fs.readFile(abs(rel));
      if (body === undefined) return undefined;
      const acc = live();
      const k = phaseNow();
      const cur = acc.spec_writes[k] ?? { count: 0, last_sha256: "" };
      acc.spec_writes[k] = { count: cur.count + 1, last_sha256: sha256(new TextEncoder().encode(body)) };
      refreshLinks();
      if (record.shipped_at) {
        const warning = `⚠️ spec shipped at ${record.shipped_at}; write a follow-up spec that supersedes it`;
        return pendingWarnings.deliver(event, warning);
      }
      if (record.approved_at && !amendmentOpen) {
        acc.amendments += 1;
        amendmentOpen = true;
      }
      return undefined;
    };

    onOtherSpecEdit = (rel, event, specDirs) => {
      if (!record || !boundSpec || !isSafeSpecLink(rel, specDirs)) return;
      if (!isSupersededByBanner(insertedText(event.input), boundSpec)) return;
      predecessorLinks.add(rel);
      refreshLinks();
    };

    const legAcc = registerLegTelemetry(pi, deps, () => !!record);
}
