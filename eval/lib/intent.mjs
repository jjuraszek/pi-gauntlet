export const INTENT_STUB = `for: <skillSha of the candidate assembly this intent describes>

## Change
<one paragraph: what the edit means to alter in the agent's behavior>

## Expected to move
- <sample>/<fact id>: <holds|fails> -> <holds|fails> - <why>
`;

const BULLET = /^- ([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+): (holds|fails) -> (holds|fails) - (.+)$/;

// Returns { status, reason?, change?, moves? }; status "ok" is the only runnable outcome.
export function parseIntent(text, candidateSha, knownFacts) {
  if (text.trim() === INTENT_STUB.trim()) return { status: "stub", reason: `intent.md is the template stub; candidate skillSha ${candidateSha}` };
  const firstLine = text.split(/\r?\n/).find((line) => line.trim());
  const forLine = /^for: (\S+)\s*$/.exec(firstLine ?? "");
  const change = /^## Change\s*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(text);
  const moves = /^## Expected to move\s*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(text);
  if (!forLine || !change || !moves) return { status: "missing-heading", reason: "intent.md needs a for: line, ## Change, and ## Expected to move" };
  if (forLine[1] !== candidateSha) return { status: "for-mismatch", reason: `intent.md for: ${forLine[1]} does not match the candidate skillSha ${candidateSha}` };
  const parsed = [];
  for (const line of moves[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const m = BULLET.exec(line);
    if (!m) return { status: "bad-bullet", reason: `unparseable Expected to move line: ${line}` };
    if (knownFacts !== undefined && (!Object.hasOwn(knownFacts, m[1]) || !knownFacts[m[1]].includes(m[2]))) {
      return { status: "bad-bullet", reason: `unknown fact: ${m[1]}/${m[2]}` };
    }
    parsed.push({ sample: m[1], fact: m[2], from: m[3], to: m[4], why: m[5].trim() });
  }
  return { status: "ok", change: change[1].trim(), moves: parsed };
}
