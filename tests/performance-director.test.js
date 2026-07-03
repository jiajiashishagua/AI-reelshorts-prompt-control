const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.join(root, "data", "performance-examples.js"));
require(path.join(root, "performance-director.js"));

const data = globalThis.PerformanceExampleData;
const director = globalThis.PerformanceDirector;

assert.equal(data.stats.sourceRows, 392);
assert.equal(data.stats.expressionRows, 370);
assert.equal(data.stats.uniqueExamples, 366);
assert.equal(data.stats.excludedMissingExpression, 22);
assert.equal(data.stats.duplicateCount, 4);
assert.equal(data.stats.publishedCount, 354);
assert.equal(data.stats.reviewCount, 12);
assert.equal(data.examples.length, 366);
assert.equal(data.examples.filter((item) => item.eligibleForRecall).length, 354);
assert.equal(data.examples.filter((item) => item.status === "review").length, 12);
assert.equal(data.examples.reduce((sum, item) => sum + Math.max(0, item.sourceLocations.length - 1), 0), 4);
assert.ok(data.examples.every((item) => item.visibleAction));
assert.ok(data.examples.every((item) => item.triggerType && item.primaryEmotion && item.performancePhase));

const input = {
  brief: "女主在夜色窗边压住愤怒，准备说出真相。",
  characterState: "克制",
  shotSize: "近景",
  durationSeconds: 2.5,
};
const recalled = director.recallExamples(input, data.examples, 5);
assert.equal(recalled.context.triggerType, "真相或证据出现");
assert.equal(recalled.context.primaryEmotion, "愤怒");
assert.equal(recalled.context.maskEmotion, "镇定");
assert.equal(recalled.context.performancePhase, "压制");
assert.equal(recalled.results[0].example.primaryEmotion, "愤怒");
assert.equal(recalled.results[0].example.performancePhase, "压制");
assert.ok(recalled.results[0].reasons.length > 0);
assert.ok(recalled.results.every((item) => item.example.status === "published"));

const lockedId = recalled.results[4].example.id;
const lockedRecall = director.recallExamples({
  brief: "角色释然地微笑，关系逐渐缓和。",
  lockedIds: [lockedId],
}, data.examples, 3);
assert.equal(lockedRecall.results[0].example.id, lockedId);
assert.equal(lockedRecall.results[0].reasons[0], "用户已锁定");

const userEntry = {
  id: "user-expression",
  libraryType: "expression_case",
  title: "秘密暴露时强行镇定",
  contentZh: "听见秘密时眼睫停住半拍，随后抿紧唇线，但手指逐渐攥紧。",
  tags: ["秘密", "恐惧", "克制"],
  status: "published",
  confidence: 0.9,
  structuredData: {
    performance: {
      triggerType: "秘密可能暴露",
      primaryEmotion: "恐惧",
      maskEmotion: "镇定",
      performancePhase: "压制",
      durationSeconds: 2.5,
      shotSize: "近景",
    },
  },
};
const userExample = director.knowledgeEntryToExample(userEntry);
assert.equal(userExample.id, "knowledge-performance:user-expression");
assert.equal(userExample.eligibleForRecall, true);
assert.equal(userExample.triggerType, "秘密可能暴露");

const reference = director.exampleToReferenceModule(userExample);
assert.equal(reference.type, "expression");
assert.equal(reference.performanceExampleId, userExample.id);
assert.match(reference.zh, /眼睫停住半拍/);

const builtInReference = director.exampleToReferenceModule(recalled.results[0].example);
assert.doesNotMatch(builtInReference.zh, /@\{|Isabella|Arthur|Cecilia/);
assert.match(builtInReference.zh, /人物/);

console.log("performance director tests passed");
