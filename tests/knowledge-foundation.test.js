const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const storageKey = "ai_reelshorts_prompt_control_v1";
const savedState = {
  theme: "dark",
  activeView: "workbench",
  workbench: {
    sourceBrief: "女主在夜色窗边压住愤怒，准备说出真相。",
    sceneGoal: "女主在夜色窗边压住愤怒，准备说出真相。",
  },
  roles: [{ id: "legacy-role", name: "旧角色数据", tags: ["兼容测试"] }],
  knowledge: {
    schemaVersion: 1,
    libraryDefinitions: [],
    entries: [
      {
        id: "published-expression",
        libraryType: "expression_case",
        title: "夜色窗边压住愤怒案例",
        contentZh: "听见真相后眼睫停住半拍，随后抿紧唇线，手指无意识收紧。",
        tags: ["夜色", "窗边", "愤怒", "克制", "真相"],
        scenarios: ["真相揭露", "对话冲突"],
        status: "published",
        uses: 0,
      },
      {
        id: "draft-expression",
        libraryType: "expression_case",
        title: "夜色窗边草稿案例",
        contentZh: "草稿内容不能参与召回。",
        tags: ["夜色", "窗边", "愤怒"],
        status: "draft",
      },
    ],
  },
};

const storage = new Map([[storageKey, JSON.stringify(savedState)]]);
const toast = {
  textContent: "",
  classList: {
    add() {},
    remove() {},
  },
};
const sandbox = {
  console,
  location: { hash: "#workbench" },
  localStorage: {
    getItem(key) {
      return storage.get(key) || null;
    },
    setItem(key, value) {
      storage.set(key, value);
    },
  },
  document: {
    getElementById(id) {
      return id === "toast" ? toast : null;
    },
  },
  navigator: {},
  setTimeout,
  clearTimeout,
  confirm() {
    return true;
  },
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const coreSource = fs.readFileSync(path.join(root, "knowledge-core.js"), "utf8");
vm.runInContext(coreSource, sandbox, { filename: "knowledge-core.js" });

let appSource = fs.readFileSync(path.join(root, "script.js"), "utf8");
appSource = appSource.replace(/\binit\(\);\s*$/, "");
appSource += `
  globalThis.__knowledgeTest = {
    state,
    getSmartRecallEntries,
    applyRecalledModule,
    toggleRecallLock,
    getRepositoryReferenceModules,
    renderKnowledgeFoundationSummary,
  };
`;
vm.runInContext(appSource, sandbox, { filename: "script.js" });

const api = sandbox.__knowledgeTest;
assert.equal(api.state.knowledge.schemaVersion, 1);
assert.equal(api.state.knowledge.libraryDefinitions.length, 14);
assert.ok(api.state.roles.some((role) => role.id === "legacy-role"), "旧角色数据应保留");
assert.deepEqual(Array.from(api.state.workbench.selectedKnowledgeEntryIds), []);

const recalled = api.getSmartRecallEntries(50);
const publishedRecall = recalled.find((entry) => entry.module.knowledgeEntryId === "published-expression");
const draftRecall = recalled.find((entry) => entry.module.knowledgeEntryId === "draft-expression");
assert.ok(publishedRecall, "已发布知识词条应参与召回");
assert.equal(draftRecall, undefined, "草稿知识词条不能参与召回");
assert.ok(publishedRecall.reasons.length > 0, "召回结果应包含匹配原因");

api.applyRecalledModule(publishedRecall.module.id);
assert.ok(api.state.workbench.selectedKnowledgeEntryIds.includes("published-expression"));
assert.equal(api.state.knowledge.entries.find((entry) => entry.id === "published-expression").uses, 1);

api.toggleRecallLock(publishedRecall.module.id);
assert.ok(api.state.workbench.lockedRecallIds.includes(publishedRecall.module.id));

const references = api.getRepositoryReferenceModules([], "完整画面提示词", "完整视频画面提示词");
assert.ok(references.some((entry) => entry.knowledgeEntryId === "published-expression"));

const summary = api.renderKnowledgeFoundationSummary();
assert.match(summary, /14/);
assert.match(summary, /已发布/);

const customKnowledge = sandbox.KnowledgeCore.registerLibraryDefinition(api.state.knowledge, {
  id: "costume_material",
  label: "服装材质",
  moduleType: "style",
  structuredFields: ["material", "surface", "movement"],
});
assert.ok(customKnowledge.libraryDefinitions.some((item) => item.id === "costume_material"));

console.log("knowledge foundation tests passed");
