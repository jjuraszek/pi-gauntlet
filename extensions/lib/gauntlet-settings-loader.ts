// Isolates the pi runtime import so the pure resolver module stays importable by
// ci.mjs unit tests. Only pi-loaded extensions import this file.
import { SettingsManager, getAgentDir } from "@earendil-works/pi-coding-agent";
import { mergeGauntlet, type PiGauntlet } from "./gauntlet-settings.ts";

export interface LoadedGauntlet {
  gauntlet: PiGauntlet;
  errors: string[];
}

// Reads the preset (agentDir/settings.json) and repo (cwd/.pi/settings.json)
// layers via pi's own SettingsManager and returns the whole-object second-level
// merge (repo over preset). SettingsManager never throws on a bad file - it
// substitutes {} for that layer and records the error, surfaced here via errors[]
// so callers can report a degraded read instead of failing silent.
export function loadGauntletSettings(cwd: string, agentDir: string = getAgentDir()): LoadedGauntlet {
  const sm = SettingsManager.create(cwd, agentDir);
  const preset = sm.getGlobalSettings() as { piGauntlet?: Record<string, unknown> };
  const repo = sm.getProjectSettings() as { piGauntlet?: Record<string, unknown> };
  const gauntlet = mergeGauntlet(preset?.piGauntlet, repo?.piGauntlet);
  const errors = sm.drainErrors().map((e) => `${e.scope}: ${e.error.message}`);
  return { gauntlet, errors };
}
