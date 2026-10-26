import path from "node:path";

// Pure gauntlet-settings resolvers. NO pi runtime import: this module is imported
// by ci.mjs unit tests (node --test) which run outside pi, where
// @earendil-works/pi-coding-agent is unresolvable. The loader
// (gauntlet-settings-loader.ts) owns the pi import.

export interface PiGauntlet {
  specCouncil?: { members?: unknown; chair?: unknown };
  closureReview?: { enforce?: unknown; model?: unknown; maxFixRounds?: unknown };
  flowGuards?: { enforce?: unknown; specDirs?: unknown };
  verifyBeforeShip?: { testCommands?: unknown; warningReference?: unknown };
  escalationLoop?: { implModel?: unknown };
  loopEngine?: { maxIterationsPerRow?: unknown; maxIterations?: unknown };
  phaseModels?: { plan?: unknown; implement?: unknown; verify?: unknown; ship?: unknown };
  telemetry?: { enabled?: unknown; dir?: unknown; buckets?: unknown };
}

// Whole-object second-level merge: each piGauntlet key present in the repo layer
// replaces the preset's wholesale; keys absent from repo fall through to preset.
// Mirrors pi's own deepMergeSettings second-level spread (not exported).
export function mergeGauntlet(
  preset: Record<string, unknown> | undefined,
  repo: Record<string, unknown> | undefined,
): PiGauntlet {
  return { ...(preset ?? {}), ...(repo ?? {}) } as PiGauntlet;
}

const nonEmptyString = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const joinWarn = (ws: string[]): string | undefined => (ws.length ? ws.join("; ") : undefined);

export interface SpecCouncilResolved {
  verdict: "council" | "worker";
  members: string[];
  chair: string | undefined;
  malformed: boolean;
  warning: string | undefined;
}

export function resolveSpecCouncil(g: PiGauntlet): SpecCouncilResolved {
  const sc = g.specCouncil;
  const warnings: string[] = [];
  let malformed = false;

  let chair: string | undefined;
  const rawChair = sc?.chair;
  if (rawChair === undefined) {
    chair = undefined;
  } else if (nonEmptyString(rawChair)) {
    chair = rawChair.trim();
  } else {
    chair = undefined;
    malformed = true;
    warnings.push("specCouncil.chair is not a non-empty string; ignoring it");
  }

  const rawMembers = sc?.members;
  const worker = (extra?: string): SpecCouncilResolved => {
    if (extra) {
      malformed = true;
      warnings.push(extra);
    }
    return { verdict: "worker", members: [], chair, malformed, warning: joinWarn(warnings) };
  };

  if (rawMembers === undefined) return worker();
  if (!Array.isArray(rawMembers)) return worker("specCouncil.members is not an array; using the worker critique");
  if (rawMembers.length === 0) return worker();
  if (!rawMembers.every(nonEmptyString))
    return worker("specCouncil.members has a non-string or empty entry; using the worker critique");

  return {
    verdict: "council",
    members: rawMembers.map((m) => (m as string).trim()),
    chair,
    malformed,
    warning: joinWarn(warnings),
  };
}

export interface ClosureReviewResolved {
  model: string | undefined;
  enforce: boolean;
  maxFixRounds: number;
}

export function resolveClosureReview(g: PiGauntlet): ClosureReviewResolved {
  const cr = g.closureReview;
  const model = nonEmptyString(cr?.model) ? cr!.model.trim() : undefined;
  const enforce = cr?.enforce !== false;
  const raw = cr?.maxFixRounds;
  const maxFixRounds = typeof raw === "number" && Number.isInteger(raw) ? (raw < 0 ? 0 : raw) : 5;
  return { model, enforce, maxFixRounds };
}

export function resolveLoopEngine(g: PiGauntlet): { maxIterationsPerRow: number; warning: string | undefined } {
  const loop = g.loopEngine;
  const raw = loop?.maxIterationsPerRow;
  const valid = typeof raw === "number" && Number.isInteger(raw);
  const maxIterationsPerRow = valid ? Math.max(1, raw) : 4;
  const warnings: string[] = [];
  if (loop && Object.hasOwn(loop, "maxIterations")) {
    warnings.push("loopEngine.maxIterations is removed; set loopEngine.maxIterationsPerRow");
  }
  if (raw !== undefined && !valid) {
    warnings.push("loopEngine.maxIterationsPerRow must be an integer; using default 4");
  }
  return { maxIterationsPerRow, warning: joinWarn(warnings) };
}

export interface EscalationLoopResolved {
  implModel: string | undefined;
}

export function resolveEscalationLoop(g: PiGauntlet, mainLoop: string | undefined): EscalationLoopResolved {
  const raw = g.escalationLoop?.implModel;
  return { implModel: nonEmptyString(raw) ? raw.trim() : mainLoop };
}

export type PhaseModelPhase = "plan" | "implement" | "verify" | "ship";
const PHASE_MODEL_PHASES: PhaseModelPhase[] = ["plan", "implement", "verify", "ship"];
export interface PhaseModelsResolved {
  phaseModels: Partial<Record<PhaseModelPhase, string>>;
  warning: string | undefined;
}

export function resolvePhaseModels(g: PiGauntlet): PhaseModelsResolved {
  const phaseModels: Partial<Record<PhaseModelPhase, string>> = {};
  const warnings: string[] = [];
  for (const phase of PHASE_MODEL_PHASES) {
    const raw = g.phaseModels?.[phase];
    if (raw === undefined) continue;
    if (nonEmptyString(raw)) phaseModels[phase] = raw.trim();
    else warnings.push(`piGauntlet.phaseModels.${phase} must be a "provider/id" or "provider/id:level" string`);
  }
  return { phaseModels, warning: joinWarn(warnings) };
}

const THINKING_SUFFIXES = new Set(["off", "minimal", "low", "medium", "high", "xhigh"]);

// Always emit a suffix so pi-cohort's applyThinkingSuffix never falls back to the
// implementer's configured thinking; pi's "max" has no pi-cohort equivalent -> xhigh.
export function mainLoopModel(
  model: { provider: string; id: string } | undefined,
  thinkingLevel: string | undefined,
): string | undefined {
  if (!model) return undefined;
  const level =
    thinkingLevel === "max" ? "xhigh" : THINKING_SUFFIXES.has(thinkingLevel ?? "") ? thinkingLevel : "off";
  return `${model.provider}/${model.id}:${level}`;
}

export interface FlowGuardsResolved {
  enforce: boolean;
  specDirs: string[];
}

export const DEFAULT_SPEC_DIRS = ["doc/specs", "docs/specs"];

// Strip a leading ./ and trailing slashes so "docs/specs/" and "./docs/specs" match the same paths.
const normalizeDir = (d: string): string => d.trim().replace(/^\.\//, "").replace(/\/+$/, "");

export function resolveFlowGuards(g: PiGauntlet): FlowGuardsResolved {
  const fg = g.flowGuards;
  const enforce = fg?.enforce !== false;
  const rawDirs = fg?.specDirs;
  const specDirs =
    Array.isArray(rawDirs) && rawDirs.length > 0 && rawDirs.every(nonEmptyString)
      ? (rawDirs as string[]).map(normalizeDir)
      : [...DEFAULT_SPEC_DIRS];
  return { enforce, specDirs };
}

// Each spec dir's sibling `plans` dir (doc/specs -> doc/plans); plans live there per writing-plans.
export function planDirsFor(specDirs: readonly string[]): string[] {
  const out = new Set<string>();
  for (const dir of specDirs) {
    const parts = dir.split("/").filter((c) => c.length > 0);
    if (parts.length === 0) continue;
    out.add([...parts.slice(0, -1), "plans"].join("/"));
  }
  return [...out];
}

export interface VerifyBeforeShipResolved {
  testCommands: string[];
  warningReference: string | undefined;
}

export function resolveVerifyBeforeShip(g: PiGauntlet, defaultTestCommands: string[]): VerifyBeforeShipResolved {
  const vbs = g.verifyBeforeShip;
  const rawCmds = vbs?.testCommands;
  const testCommands =
    Array.isArray(rawCmds) && rawCmds.length > 0 && rawCmds.every(nonEmptyString)
      ? (rawCmds as string[])
      : defaultTestCommands;
  const warningReference = nonEmptyString(vbs?.warningReference) ? vbs!.warningReference.trim() : undefined;
  return { testCommands, warningReference };
}

// Default verification entrypoints shared by verify-before-ship (advisory) and
// telemetry (derived.tests). Regex fragments; buildTestCmdRegex anchors them with \b.
export const DEFAULT_TEST_COMMANDS = [
  "make\\s+(?:ci|test)(?![-\\w])", // rejects make test-smoke and make test-corpus
  "npm\\s+(?:test|run\\s+test)",
  "pnpm\\s+test",
  "yarn\\s+test",
  "pytest",
  "rspec",
  "cargo\\s+test",
  "go\\s+test",
];

export const buildTestCmdRegex = (commands: string[]): RegExp => new RegExp(`\\b(${commands.join("|")})\\b`);

export const DEFAULT_TELEMETRY_DIR = ".pi/gauntlet/telemetry";

// Ordered: first matching bucket wins; anything unmatched is "code".
export const DEFAULT_TELEMETRY_BUCKETS: [string, string[]][] = [
  ["test", ["**/test/**", "**/tests/**", "**/__tests__/**", "**/*.test.*", "**/*.spec.*", "**/*_test.*"]],
  ["docs", ["**/*.md"]],
  ["config", ["**/*.json", "**/*.yaml", "**/*.yml", "**/*.toml", "**/*.lock", "**/*-lock.*"]],
];

export interface TelemetryResolved {
  enabled: boolean;
  dir: string;
  buckets: [string, string[]][];
  warning: string | undefined;
}

export function resolveTelemetry(g: PiGauntlet): TelemetryResolved {
  const t = g.telemetry;
  const warnings: string[] = [];
  const enabled = t?.enabled !== false;

  let dir = DEFAULT_TELEMETRY_DIR;
  if (t?.dir !== undefined) {
    const value = nonEmptyString(t.dir) ? t.dir.trim().replace(/\/+$/, "") : "";
    const canonical = value.replace(/\\/g, "/");
    const normalized = path.posix.normalize(canonical);
    if (
      value &&
      path.win32.parse(canonical).root === "" &&
      normalized !== ".." &&
      !normalized.startsWith("../")
    ) dir = normalized;
    else warnings.push("telemetry.dir must be a non-empty path relative to the git toplevel; using the default");
  }

  let buckets = DEFAULT_TELEMETRY_BUCKETS;
  if (t?.buckets !== undefined) {
    const b = t.buckets;
    const valid =
      b !== null &&
      typeof b === "object" &&
      !Array.isArray(b) &&
      Object.keys(b).length > 0 &&
      Object.values(b).every((v) => Array.isArray(v) && v.length > 0 && v.every(nonEmptyString));
    if (valid) buckets = Object.entries(b as Record<string, string[]>).map(([name, globs]) => [name, [...globs]]);
    else warnings.push("telemetry.buckets is not an object of non-empty glob arrays; using the defaults");
  }

  return { enabled, dir, buckets, warning: joinWarn(warnings) };
}

export function settingsErrorWarning(errors: string[]): string {
  return `\u26a0\ufe0f gauntlet settings load error (using defaults): ${errors.join("; ")}`;
}
