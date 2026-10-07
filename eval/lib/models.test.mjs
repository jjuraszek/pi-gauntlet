import { test } from "node:test";
import assert from "node:assert/strict";
import { MODELS, replayArg, judgeArg } from "./models.mjs";

test("models are frozen constants", () => {
  assert.deepEqual(MODELS.replay, ["anthropic/claude-opus-5-5", "github-copilot/gpt-6.1-sol"]);
  assert.equal(MODELS.judge, "anthropic-fable/claude-fable-5-1");
  assert.equal(MODELS.thinking, "medium");
  assert.ok(Object.isFrozen(MODELS));
  assert.ok(Object.isFrozen(MODELS.replay));
});
test("model args carry the thinking level", () => {
  assert.deepEqual(replayArg("anthropic/claude-opus-5-5"), ["--model", "anthropic/claude-opus-5-5", "--thinking", "medium"]);
  assert.deepEqual(judgeArg(), ["--model", "anthropic-fable/claude-fable-5-1", "--thinking", "medium"]);
});
