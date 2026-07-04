const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.join(root, "data", "performance-examples.js"));
require(path.join(root, "performance-director.js"));
require(path.join(root, "performance-planner.js"));

const data = globalThis.PerformanceExampleData;
const director = globalThis.PerformanceDirector;
const planner = globalThis.PerformancePlanner;

const recallInput = {
  brief: "女主在夜色窗边压住愤怒，准备说出真相。",
  characterState: "克制",
  shotSize: "近景",
  durationSeconds: 2.5,
};
const recall = director.recallExamples(recallInput, data.examples, 6);
const role = {
  id: "role-lin",
  name: "林晚",
  temperament: "冷静、克制，情绪被压在锋利外壳下",
  forbidden: "不要夸张大哭\n不要改变脸型",
};
const project = {
  id: "project-cinematic",
  defaultNegative: "不要塑料皮肤，不要廉价网感。",
};
const plans = planner.buildPlans({
  ...recallInput,
  context: recall.context,
  role,
  project,
}, recall.results);

assert.equal(plans.length, 3);
assert.equal(plans[0].strategyId, "restrained");
assert.equal(plans[0].beats.length, 3);
assert.equal(plans[0].durationSeconds, 2.5);
assert.equal(plans[0].analysis.trigger, "真相或证据出现");
assert.equal(plans[0].analysis.primaryEmotion, "愤怒");
assert.equal(plans[0].analysis.maskEmotion, "镇定");
assert.ok(plans[0].referenceIds.length > 0);
assert.ok(plans[0].channels.length >= 4);
assert.ok(plans[0].channels.some((item) => item.channel === "eyes" && /眼|瞳孔|视线/.test(item.direction)));
assert.ok(plans[0].channels.some((item) => item.channel === "breath" && /呼吸|鼻翼|吸气/.test(item.direction)));
assert.match(plans[0].prompt, /【分秒表演节奏】/);
assert.match(plans[0].prompt, /【表情与身体通道】/);
assert.match(plans[0].prompt, /【表演控制边界】/);
assert.doesNotMatch(plans[0].prompt, /@\{|Isabella|Arthur|Cecilia/);

const shortPlans = planner.buildPlans({
  ...recallInput,
  durationSeconds: 1.5,
  context: { ...recall.context, durationSeconds: 1.5 },
}, recall.results);
assert.equal(shortPlans[0].beats.length, 2);
assert.equal(shortPlans[0].beats[1].end, 1.5);

const releaseRecall = director.recallExamples({
  brief: "男主终于失控爆发，怒吼后逼近对方。",
  durationSeconds: 3,
  shotSize: "近景",
}, data.examples, 6);
const releasePlans = planner.buildPlans({
  brief: "男主终于失控爆发，怒吼后逼近对方。",
  durationSeconds: 3,
  shotSize: "近景",
  context: releaseRecall.context,
}, releaseRecall.results);
assert.equal(releasePlans[0].strategyId, "threshold");

const payload = planner.planToKnowledgePayload(plans[0], {
  brief: recallInput.brief,
  role,
});
assert.equal(payload.libraryType, "expression_case");
assert.equal(payload.status, "published");
assert.equal(payload.structuredData.performance.primaryEmotion, "愤怒");
assert.equal(payload.structuredData.performance.durationSeconds, 2.5);
assert.ok(payload.structuredData.performance.visibleAction.length > 30);
assert.ok(payload.tags.includes("人物表演方案"));

const signatureA = planner.createSignature({ ...recallInput, role, project, selectedReferenceIds: ["a", "b"] });
const signatureB = planner.createSignature({ ...recallInput, role, project, selectedReferenceIds: ["a", "b"] });
assert.equal(signatureA, signatureB);
const signatureChanged = planner.createSignature({ ...recallInput, sceneGoal: "改成走廊对峙", role, project, selectedReferenceIds: ["a", "b"] });
assert.notEqual(signatureA, signatureChanged);

console.log("performance planner tests passed");
