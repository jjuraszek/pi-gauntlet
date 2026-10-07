// eval/ is outside model-literal-lint scope on purpose: the eval freezes these ids.
export const MODELS = Object.freeze({
  replay: Object.freeze(["anthropic/claude-opus-5-5", "github-copilot/gpt-6.1-sol"]),
  judge: "anthropic-fable/claude-fable-5-1",
  thinking: "medium",
});
export function replayArg(model) {
  if (!MODELS.replay.includes(model)) throw new Error(`unknown replay model: ${model}`);
  return ["--model", model, "--thinking", MODELS.thinking];
}
export function judgeArg() {
  return ["--model", MODELS.judge, "--thinking", MODELS.thinking];
}
