const sources = {
  "@earendil-works/pi-ai": `export const StringEnum = (values, options = {}) => ({ values, ...options });`,
  // Reads only the repo (project) settings layer - guard tests exercise repo-local
  // settings via tempCwd()'s .pi/settings.json; there is no preset layer to stub.
  "@earendil-works/pi-coding-agent": `
    import { readFileSync } from "node:fs";
    export class SettingsManager {
      static create(cwd) { return new SettingsManager(cwd); }
      constructor(cwd) { this.cwd = cwd; }
      getGlobalSettings() { return {}; }
      getProjectSettings() {
        try { return JSON.parse(readFileSync(this.cwd + "/.pi/settings.json", "utf8")); }
        catch { return {}; }
      }
      drainErrors() { return []; }
    }
    export const getAgentDir = () => "/tmp/pi-gauntlet-test-agent";
  `,
  "@earendil-works/pi-tui": `
    export class Text {
      constructor(text) { this.text = text; }
    }
  `,
  "@sinclair/typebox": `
    const schema = (...args) => ({ args });
    export const Type = {
      Object: schema,
      Optional: schema,
      String: schema,
      Boolean: schema,
      Union: schema,
      Null: schema,
      Array: schema,
      Integer: schema,
    };
  `,
};

export async function resolve(specifier, context, nextResolve) {
  if (specifier in sources) return { url: `pi-gauntlet-test:${encodeURIComponent(specifier)}`, shortCircuit: true };
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith("pi-gauntlet-test:")) {
    const specifier = decodeURIComponent(url.slice("pi-gauntlet-test:".length));
    return { format: "module", source: sources[specifier], shortCircuit: true };
  }
  return nextLoad(url, context);
}
