// Isolates the pi runtime import so the pure resolver module stays importable by
// ci.mjs unit tests. Only pi-loaded extensions import this file.
import { SettingsManager, getAgentDir } from "@earendil-works/pi-coding-agent";
import { mergeGauntlet, type PiGauntlet } from "./gauntlet-settings.ts";
import { checkoutOfSync, type Checkout } from "./checkout.ts";

export interface LoadedGauntlet {
  gauntlet: PiGauntlet;
  errors: string[];
  // Checkout toplevel the repo layer was read from (cwd itself outside any checkout).
  root: string;
}

// Reads the preset (agentDir/settings.json) and repo (<root>/.pi/settings.json) layers
// via pi's own SettingsManager, where <root> is the checkout toplevel of cwd (git, falling
// back to `jj root` in a plain jj workspace) - pi launched in a subdirectory or a linked
// worktree still finds that checkout's file (#37). SettingsManager
// never throws on a bad file - it substitutes {} for that layer and records the error,
// surfaced here via errors[] so callers can report a degraded read instead of failing silent.
export function loadGauntletSettings(cwd: string, agentDir: string = getAgentDir(), checkout: (path: string) => Checkout | undefined = checkoutOfSync): LoadedGauntlet {
  const root = checkout(cwd)?.toplevel ?? cwd;
  const sm = SettingsManager.create(root, agentDir);
  const preset = sm.getGlobalSettings() as { piGauntlet?: Record<string, unknown> };
  const repo = sm.getProjectSettings() as { piGauntlet?: Record<string, unknown> };
  const gauntlet = mergeGauntlet(preset?.piGauntlet, repo?.piGauntlet);
  const errors = sm.drainErrors().map((e) => `${e.scope}: ${e.error.message}`);
  return { gauntlet, errors, root };
}
