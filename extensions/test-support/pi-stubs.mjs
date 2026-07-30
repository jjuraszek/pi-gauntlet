const sources = {
  "@earendil-works/pi-ai": `export const StringEnum = (values, options = {}) => ({ values, ...options });`,
  "@earendil-works/pi-coding-agent": `
    export class SettingsManager {
      static create() { return new SettingsManager(); }
      getGlobalSettings() { return {}; }
      getProjectSettings() { return {}; }
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
