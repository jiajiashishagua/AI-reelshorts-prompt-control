import assert from "node:assert/strict";
import {
  buildDeepSeekRequest,
  handleRequest,
  sanitizePerformanceContext,
} from "../worker/src/index.mjs";

const origin = "https://prompt.jiajiashishagua.online";
const env = {
  DEEPSEEK_API_KEY: "test-secret",
  DEEPSEEK_BASE_URL: "https://api.deepseek.com",
  ALLOWED_ORIGINS: `${origin},http://127.0.0.1:8765`,
};

const context = {
  input: {
    brief: "女主在夜色窗边压住愤怒，准备说出真相。",
    durationSeconds: 2.5,
    shotSize: "近景",
    context: {
      triggerType: "真相或证据出现",
      primaryEmotion: "愤怒",
      maskEmotion: "镇定",
      characterBaseline: "克制控制",
      powerPosition: "相对平衡",
      performancePhase: "压制",
    },
    role: {
      name: "林晚",
      temperament: "冷静克制",
      forbidden: "不要夸张大哭",
    },
    project: {
      name: "高级短剧",
      visualTone: "写实电影感",
    },
  },
  recallResults: [
    {
      example: {
        id: "example-1",
        character: "Source Name",
        visibleAction: "人物视线停顿，随后下颌轻微绷紧。",
        primaryEmotion: "愤怒",
        maskEmotion: "镇定",
        expressionChannels: ["眼神", "下颌与咬肌"],
      },
    },
  ],
};

const sanitized = sanitizePerformanceContext(context);
assert.equal(sanitized.brief, context.input.brief);
assert.equal(sanitized.recalledExamples.length, 1);
assert.equal(sanitized.recalledExamples[0].id, "example-1");
assert.equal("character" in sanitized.recalledExamples[0], false);

const standardRequest = buildDeepSeekRequest("deepseek-v4-flash", false, sanitized);
assert.equal(standardRequest.model, "deepseek-v4-flash");
assert.equal(standardRequest.thinking.type, "disabled");
assert.equal(standardRequest.temperature, 0.35);
assert.equal(standardRequest.response_format.type, "json_object");

const thinkingRequest = buildDeepSeekRequest("deepseek-v4-pro", true, sanitized);
assert.equal(thinkingRequest.thinking.type, "enabled");
assert.equal(thinkingRequest.reasoning_effort, "high");
assert.equal("temperature" in thinkingRequest, false);

const healthResponse = await handleRequest(new Request("https://worker.example/health"), env);
assert.equal(healthResponse.status, 200);
const health = await healthResponse.json();
assert.equal(health.ok, true);
assert.equal(health.v3Available, false);
assert.deepEqual(health.models.map((item) => item.id), ["deepseek-v4-flash", "deepseek-v4-pro"]);

const blockedResponse = await handleRequest(new Request("https://worker.example/api/models", {
  headers: { Origin: "https://attacker.example" },
}), env);
assert.equal(blockedResponse.status, 403);

function createRawPlan(strategyId, title, intensity) {
  return {
    strategyId,
    title,
    intensity,
    summary: `${title}方案`,
    fitScore: 90,
    analysis: {
      roleName: "人物",
      trigger: "真相出现",
      primaryEmotion: "愤怒",
      maskEmotion: "镇定",
      performancePhase: "压制",
      characterBaseline: "克制控制",
      powerPosition: "相对平衡",
    },
    durationSeconds: 2.5,
    shotSize: "近景",
    beats: [
      { start: 0, end: 0.5, label: "0-0.5s", phase: "刺激进入", action: "视线停顿半拍。" },
      { start: 0.5, end: 2.5, label: "0.5-2.5s", phase: "控制泄露", action: "下颌绷紧，呼吸压低。" },
    ],
    channels: [
      { channel: "eyes", label: "眼神与眼睑", direction: "视线停顿后重新聚焦。" },
      { channel: "jaw", label: "下颌与咬肌", direction: "咬肌逐渐绷紧。" },
      { channel: "breath", label: "呼吸与鼻翼", direction: "呼吸停顿后转浅。" },
    ],
    cameraGuidance: "近景稳定拍摄。",
    negativeConstraints: ["不要夸张瞪眼"],
    referenceIds: ["example-1"],
    visibleSummary: "视线停顿，下颌绷紧，呼吸转浅。",
    prompt: `【表演策略】${title}`,
  };
}

const upstreamPayload = {
  plans: [
    createRawPlan("restrained", "克制留白", "低至中"),
    createRawPlan("progressive", "递进泄露", "中"),
    createRawPlan("threshold", "临界释放", "中至高"),
  ],
};
let upstreamRequest;
const mockFetch = async (url, options) => {
  upstreamRequest = { url, options, body: JSON.parse(options.body) };
  return new Response(JSON.stringify({
    id: "chat-test",
    choices: [{ message: { content: JSON.stringify(upstreamPayload) } }],
    usage: { prompt_tokens: 100, completion_tokens: 200, total_tokens: 300 },
  }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const apiResponse = await handleRequest(new Request("https://worker.example/api/performance-plans", {
  method: "POST",
  headers: {
    Origin: origin,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "deepseek-v4-pro",
    thinking: true,
    context,
  }),
}), env, mockFetch);
assert.equal(apiResponse.status, 200);
assert.equal(apiResponse.headers.get("Access-Control-Allow-Origin"), origin);
const apiBody = await apiResponse.json();
assert.equal(apiBody.plans.length, 3);
assert.equal(apiBody.plans[0].id, "performance-plan-restrained");
assert.equal(apiBody.meta.model, "deepseek-v4-pro");
assert.equal(apiBody.meta.thinking, true);
assert.equal(upstreamRequest.url, "https://api.deepseek.com/chat/completions");
assert.equal(upstreamRequest.options.headers.Authorization, "Bearer test-secret");
assert.equal(upstreamRequest.body.response_format.type, "json_object");

const invalidModelResponse = await handleRequest(new Request("https://worker.example/api/performance-plans", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ model: "deepseek-v3", context }),
}), env, mockFetch);
assert.equal(invalidModelResponse.status, 400);

console.log("deepseek worker tests passed");
