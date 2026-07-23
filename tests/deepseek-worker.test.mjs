import assert from "node:assert/strict";
import {
  buildFallbackLightingSearchPlan,
  buildDeepSeekRequest,
  handleRequest,
  renderFallbackLightingPrompt,
  sanitizeLightingContext,
  sanitizePerformanceContext,
  TEXT_MODELS,
} from "../worker/src/index.mjs";

const origin = "https://prompt.jiajiashishagua.online";
const env = {
  DEEPSEEK_API_KEY: "test-secret",
  DEEPSEEK_BASE_URL: "https://api.deepseek.com",
  KIMI_API_KEY: "test-kimi-secret",
  KIMI_BASE_URL: "https://api.moonshot.cn/v1",
  ALLOWED_ORIGINS: `${origin},http://127.0.0.1:8765`,
};

assert.ok(TEXT_MODELS["kimi-k3"]);

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
assert.deepEqual(health.models.map((item) => item.id), ["deepseek-v4-flash", "deepseek-v4-pro", "kimi-k3"]);

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

const kimiPerformanceResponse = await handleRequest(new Request("https://worker.example/api/performance-plans", {
  method: "POST",
  headers: {
    Origin: origin,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "kimi-k3",
    thinking: true,
    context,
  }),
}), env, mockFetch);
assert.equal(kimiPerformanceResponse.status, 200);
const kimiPerformanceBody = await kimiPerformanceResponse.json();
assert.equal(kimiPerformanceBody.meta.provider, "kimi");
assert.equal(kimiPerformanceBody.meta.thinking, false);
assert.equal(upstreamRequest.url, "https://api.moonshot.cn/v1/chat/completions");
assert.equal(upstreamRequest.options.headers.Authorization, "Bearer test-kimi-secret");
assert.equal(upstreamRequest.body.model, "kimi-k3");
assert.equal(upstreamRequest.body.temperature, 1);
assert.equal("max_completion_tokens" in upstreamRequest.body, true);
assert.equal("max_tokens" in upstreamRequest.body, false);

const lightingContext = sanitizeLightingContext({
  sourceBrief: "女主在夜色窗边压住愤怒，准备说出真相。",
  requirement: "需要暗黑、压抑、窗边冷光和克制怒意。",
  referenceImageName: "window-night.png",
  referenceImageUploaded: true,
  selectedDirection: "darker",
  selectedIntensity: "strong",
  parameterControls: {
    exposure: "darker",
    shadow: "heavy",
    atmosphere: "dense",
  },
  project: {
    name: "暗黑中世纪短剧",
    visualTone: "写实真人电影质感",
    colorLogic: "冷灰色调为主，烛光作为暖点。",
    lightingPreference: "深阴影、体积光、窗边侧逆光。",
    defaultNegative: "不要CGI感，不要过度柔焦。",
  },
});
assert.equal(lightingContext.selectedDirection, "darker");
assert.equal(lightingContext.selectedIntensity, "strong");
assert.equal(lightingContext.parameterSummary, "明暗更暗 / 强阴影 / 空气感强烈");

const fallbackSearchPlan = buildFallbackLightingSearchPlan(lightingContext);
assert.equal(fallbackSearchPlan.queries.length, 5);
assert.ok(fallbackSearchPlan.analysis.keywords.length >= 1);

const fallbackLightingPrompt = renderFallbackLightingPrompt({
  ...lightingContext,
  selectedReference: {
    title: "主参考候选",
    searchQuery: "cinematic night window lighting film still",
    reason: "匹配夜色窗边的冷光与压抑氛围。",
  },
});
assert.match(fallbackLightingPrompt, /【电影机参数】/);
assert.match(fallbackLightingPrompt, /参数控制/);

const lightingSearchPayload = {
  analysis: {
    summary: "适合寻找夜色窗边、冷光、深阴影的电影静帧。",
    keywords: ["夜色", "窗边光", "压抑", "克制愤怒"],
  },
  queries: [
    { title: "主参考", query: "night window cinematic film still", reason: "匹配主光方向", direction: "窗边冷光", mood: "压抑", tags: ["夜色"] },
    { title: "阴影参考", query: "deep shadow interior film still", reason: "匹配深阴影", direction: "深阴影", mood: "暗黑", tags: ["阴影"] },
    { title: "色彩参考", query: "cold blue warm practical light film still", reason: "匹配冷暖关系", direction: "冷暖对比", mood: "克制", tags: ["冷暖"] },
    { title: "空间参考", query: "window interior cinematic depth film still", reason: "匹配空间纵深", direction: "空间纵深", mood: "孤独", tags: ["空间"] },
    { title: "氛围参考", query: "restrained anger cinematic lighting film still", reason: "匹配叙事情绪", direction: "情绪光影", mood: "愤怒", tags: ["情绪"] },
  ],
};
let lightingUpstreamRequest;
const lightingMockFetch = async (url, options = {}) => {
  lightingUpstreamRequest = { url, options, body: options.body ? JSON.parse(options.body) : null };
  return new Response(JSON.stringify({
    id: "lighting-chat-test",
    choices: [{ message: { content: JSON.stringify(lightingSearchPayload) } }],
    usage: { prompt_tokens: 50, completion_tokens: 80, total_tokens: 130 },
  }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const lightingSearchResponse = await handleRequest(new Request("https://worker.example/api/lighting/search-references", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "deepseek-v4-flash",
    context: lightingContext,
  }),
}), env, lightingMockFetch);
assert.equal(lightingSearchResponse.status, 200);
const lightingSearchBody = await lightingSearchResponse.json();
assert.equal(lightingSearchBody.references.length, 5);
assert.equal(lightingSearchBody.meta.imageSearchProvider, "placeholder");
assert.equal(lightingUpstreamRequest.body.response_format.type, "json_object");

const lightingComposePayload = {
  prompt: "【创作需求】女主在夜色窗边压住愤怒，准备说出真相。\n【电影机参数】ARRI Amira，24fps，Cooke 35mm，T1.4。",
};
const lightingComposeMockFetch = async () => new Response(JSON.stringify({
  id: "lighting-compose-test",
  choices: [{ message: { content: JSON.stringify(lightingComposePayload) } }],
  usage: { prompt_tokens: 70, completion_tokens: 90, total_tokens: 160 },
}), { status: 200, headers: { "Content-Type": "application/json" } });

const lightingComposeResponse = await handleRequest(new Request("https://worker.example/api/lighting/compose-prompt", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "deepseek-v4-pro",
    context: {
      ...lightingContext,
      selectedReference: lightingSearchBody.references[0],
    },
  }),
}), env, lightingComposeMockFetch);
assert.equal(lightingComposeResponse.status, 200);
const lightingComposeBody = await lightingComposeResponse.json();
assert.match(lightingComposeBody.prompt, /【创作需求】/);
assert.match(lightingComposeBody.prompt, /【电影机参数】/);
assert.equal(lightingComposeBody.meta.model, "deepseek-v4-pro");

console.log("deepseek worker tests passed");