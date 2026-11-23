import { join } from 'node:path';
import { PI_FLAGS } from './replay.mjs';
import { replayArg } from './models.mjs';

// Read the registered string literals, without loading either revision as executable code.
export function trackerDescription(source) {
  const expr = /pi\.registerTool\(\{\s*name: "phase_tracker",[^}]*?\bdescription:\s*((?:"(?:[^"\\]|\\.)*"\s*\+\s*)*"(?:[^"\\]|\\.)*")\s*,/.exec(source)?.[1];
  if (!expr) throw new Error('cannot read the registered phase_tracker description');
  return [...expr.matchAll(/"(?:[^"\\]|\\.)*"/g)].map(([literal]) => JSON.parse(literal)).join('');
}

export async function trackerReplayArgs(model, promptPath, dir, cwd, result) {
  const { SessionManager } = await import('@earendil-works/pi-coding-agent');
  const session = SessionManager.create(cwd, join(dir, 'history'));
  const timestamp = Date.now();
  session.appendMessage({ role: 'user', content: result.user, timestamp });
  const call = { type: 'toolCall', name: 'phase_tracker', id: 'call_phase_complete', arguments: result.arguments };
  session.appendMessage({ role: 'assistant', content: [call], provider: 'fixture', model: 'fixture', api: 'anthropic-messages', stopReason: 'toolUse', timestamp,
    usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } });
  session.appendMessage({ role: 'toolResult', toolName: call.name, toolCallId: call.id, content: [{ type: 'text', text: result.text.replace('{{cwd}}', cwd) }], isError: false, timestamp });
  return [...PI_FLAGS.filter(flag => flag !== '--no-session'), '--session', session.getSessionFile(), '--tools', 'read', ...replayArg(model), '--system-prompt', promptPath];
}
