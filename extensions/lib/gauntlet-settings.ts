// Pure gauntlet-settings resolvers. NO pi runtime import: this module is imported
// by ci.mjs unit tests (node --test) which run outside pi, where
// @earendil-works/pi-coding-agent is unresolvable. The loader
// (gauntlet-settings-loader.ts) owns the pi import.

export interface PiGauntlet {
  specCouncil?: { members?: unknown; chair?: unknown };
  closureReview?: { enforce?: unknown; model?: unknown; maxFixRounds?: unknown };
  flowGuards?: { enforce?: unknown; specDirs?: unknown };
  verifyBeforeShip?: { testCommands?: unknown; warningReference?: unknown };
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
  const maxFixRounds = typeof raw === "number" && Number.isInteger(raw) ? (raw < 0 ? 0 : raw) : 2;
  return { model, enforce, maxFixRounds };
}

export interface FlowGuardsResolved {
  enforce: boolean;
  specDirs: string[];
}

export function resolveFlowGuards(g: PiGauntlet): FlowGuardsResolved {
  const fg = g.flowGuards;
  const enforce = fg?.enforce !== false;
  const rawDirs = fg?.specDirs;
  const specDirs =
    Array.isArray(rawDirs) && rawDirs.length > 0 && rawDirs.every(nonEmptyString)
      ? (rawDirs as string[]).map((d) => d.trim())
      : ["doc/specs"];
  return { enforce, specDirs };
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

export function settingsErrorWarning(errors: string[]): string {
  return `\u26a0\ufe0f gauntlet settings load error (using defaults): ${errors.join("; ")}`;
}
