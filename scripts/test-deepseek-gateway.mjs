import { handleRequest } from "../worker/src/index.mjs";

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) throw new Error("请通过 DEEPSEEK_API_KEY 环境变量提供测试密钥");

const origin = "http://127.0.0.1:8765";
const env = {
  DEEPSEEK_API_KEY: apiKey,
  DEEPSEEK_BASE_URL: "https://api.deepseek.com",
  ALLOWED_ORIGINS: origin,
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
      name: "测试角色",
      temperament: "冷静、克制，情绪泄露幅度很低",
      forbidden: "不要瞪眼，不要夸张哭喊",
    },
    project: {
      name: "写实短剧",
      visualTone: "写实真人电影感，表演自然克制",
    },
  },
  recallResults: [
    {
      example: {
        id: "test-reference-1",
        visibleAction: "视线停顿半拍，瞳孔轻微收缩，下颌咬肌逐渐绷紧，鼻翼随一次深吸气轻微扩张。",
        triggerType: "真相或证据出现",
        primaryEmotion: "愤怒",
        maskEmotion: "镇定",
        characterBaseline: "克制控制",
        performancePhase: "压制",
        expressionChannels: ["眼神", "下颌与咬肌", "呼吸与鼻翼"],
        shotSize: "近景",
        durationSeconds: 2.5,
        qualityScore: 0.95,
      },
    },
  ],
};

const response = await handleRequest(new Request("https://local.worker/api/performance-plans", {
  method: "POST",
  headers: {
    Origin: origin,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: process.argv[2] || "deepseek-v4-flash",
    thinking: process.argv.includes("--thinking"),
    context,
  }),
}), env);

const data = await response.json();
if (!response.ok) throw new Error(data.error || `请求失败（${response.status}）`);

console.log(JSON.stringify({
  status: response.status,
  model: data.meta.model,
  thinking: data.meta.thinking,
  plans: data.plans.map((plan) => ({
    id: plan.id,
    title: plan.title,
    beats: plan.beats.length,
    channels: plan.channels.length,
    promptLength: plan.prompt.length,
  })),
  usage: data.meta.usage,
}, null, 2));
