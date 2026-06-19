const STORAGE_KEY = "ai_reelshorts_prompt_control_v1";

const NAV_ITEMS = [
  { id: "workbench", label: "工作台", icon: "wand-sparkles", title: "提示词创建工作台" },
  { id: "roles", label: "角色资产", icon: "user-round-cog", title: "角色资产库" },
  { id: "modules", label: "模块库", icon: "blocks", title: "提示词模块库" },
  { id: "presets", label: "预设库", icon: "library", title: "预设提示词库" },
  { id: "tags", label: "分类标签", icon: "tags", title: "分类与标签管理" },
  { id: "models", label: "模型配置", icon: "cpu", title: "模型配置" },
];

const PROMPT_TYPES = [
  "完整画面提示词",
  "角色提示词",
  "场景提示词",
  "动作提示词",
  "微表情提示词",
  "镜头提示词",
  "光影提示词",
  "视频分镜提示词",
  "负面提示词",
];

const MODULE_TYPES = [
  { id: "scene", label: "场景" },
  { id: "camera", label: "镜头" },
  { id: "action", label: "动作" },
  { id: "expression", label: "微表情" },
  { id: "lighting", label: "光影" },
  { id: "texture", label: "画面质感" },
  { id: "style", label: "风格" },
  { id: "negative", label: "负面提示词" },
  { id: "format", label: "输出格式" },
];

const GOAL_OPTIONS = [
  "人物登场",
  "情绪爆发",
  "对话冲突",
  "回忆画面",
  "战斗场面",
  "亲密互动",
  "悬疑氛围",
  "高级电影感镜头",
];

const OUTPUT_FORMATS = [
  "中文提示词",
  "英文提示词",
  "中英双语",
  "单张图提示词",
  "视频画面提示词",
  "分镜提示词",
  "角色一致性提示词",
  "负面提示词",
  "JSON结构化提示词",
];

const TARGET_TOOLS = ["RunningHub", "Image2", "Banana Pro", "即梦", "可灵", "Midjourney", "Stable Diffusion", "自定义工具"];

const DEFAULT_STATE = {
  theme: "dark",
  activeView: "workbench",
  resultTab: "zh",
  workbench: {
    promptType: "完整画面提示词",
    roleId: "role-lin",
    goal: "情绪爆发",
    sceneGoal: "女主在夜色窗边压住愤怒，准备说出真相。",
    frameDescription: "近景，人物站在窗边，窗外是雨夜城市光，室内光线克制。",
    extra: "保持人物真实自然，不要夸张表演，镜头要有高级短剧电影感。",
    outputFormat: "中英双语",
    targetTool: "可灵",
    selectedModuleIds: {
      scene: "module-scene-window",
      camera: "module-camera-close",
      action: "module-action-controlled",
      expression: "module-expression-anger",
      lighting: "module-light-window",
      texture: "module-texture-film",
      style: "module-style-reelshort",
      negative: "module-negative-character",
      format: "module-format-video",
    },
    moduleOverrides: {},
    results: {
      zh: "",
      en: "",
      negative: "",
      json: "",
    },
    lastSavedPresetId: "",
  },
  tags: [
    "女主",
    "男主",
    "ReelShort",
    "电影感",
    "逆光",
    "近景",
    "愤怒",
    "克制",
    "窗边光",
    "情绪爆发",
    "高级感",
    "角色一致性",
    "暗黑",
    "西幻",
  ],
  roles: [
    {
      id: "role-lin",
      name: "林晚",
      gender: "女性",
      age: "26",
      identity: "复仇短剧女主",
      world: "现代都市复仇剧",
      temperament: "冷静、克制、脆弱感被压在锋利外壳下",
      face: "鹅蛋脸，细长眼型，鼻梁清晰，下颌线干净",
      hair: "黑色长卷发，发尾自然垂落",
      hairColor: "黑色",
      skin: "冷白皮",
      body: "纤细但有力量感",
      signature: "银色耳坠，右眼下方极淡的小痣",
      accessories: "银色耳坠，细链项链",
      makeup: "低饱和裸色妆容，眼妆干净",
      outfits: "深色修身长裙，灰黑色风衣，禁止突然变成甜美少女装",
      fixed: "黑色长卷发\n冷白皮\n细长眼型\n银色耳坠\n冷感、克制的气质",
      variable: "服装可随剧情变化\n情绪强度可调整\n镜头景别可变化\n光影可根据场景变化",
      forbidden: "不要改变发色\n不要变成圆脸\n不要幼态化\n不要夸张大笑\n不要过度美颜\n不要欧美化",
      anger: "眼尾微红，嘴唇紧抿，眉头压低，呼吸被压住，眼神克制但带有怒意",
      grievance: "眼眶湿润但不夸张哭泣，声音轻微发紧，眼神短暂闪躲",
      nervous: "眼神躲闪，下颌微收，手指轻扣衣袖",
      cold: "表情克制，眼神疏离，语速平稳",
      collapse: "呼吸急促，眼神失焦，肩颈微微发抖",
      actions: "常用站姿是肩背挺直，情绪激动时会先沉默再抬眼看人，手部动作克制",
      lenses: "适合近景、侧脸、过肩拍、窗边逆光，不适合过度俯拍和可爱角度",
      lighting: "偏好冷光、窗边光、雨夜反射光、高对比阴影、柔和电影光",
      tags: ["女主", "愤怒", "克制", "角色一致性", "电影感"],
      notes: "愤怒时眼尾可以微红，但强度要低，不能变成夸张哭戏。",
      updatedAt: "2026-06-20",
    },
    {
      id: "role-chen",
      name: "陈序",
      gender: "男性",
      age: "31",
      identity: "集团继承人 / 误会型男主",
      world: "现代都市情感剧",
      temperament: "冷硬、压迫感强、外表理性但情绪暗涌",
      face: "长脸，眉骨清晰，眼窝略深",
      hair: "黑色短发，干净利落",
      hairColor: "黑色",
      skin: "自然冷调肤色",
      body: "高挑，肩背挺直",
      signature: "深色西装，极少露出笑容",
      accessories: "腕表，深色领带",
      makeup: "自然无妆感",
      outfits: "黑色或深灰西装，白衬衫，长款大衣",
      fixed: "黑色短发\n深色西装\n冷硬气场\n压迫感强的眼神",
      variable: "领带、外套、场景光线、情绪爆发程度可变化",
      forbidden: "不要变成阳光少年\n不要夸张邪笑\n不要改变发色\n不要穿休闲运动装",
      anger: "下颌收紧，目光压低，声音变轻但有威压",
      grievance: "短暂沉默，视线避开，喉结滚动",
      nervous: "整理袖扣，语速变慢，眼神压抑",
      cold: "眉眼没有明显起伏，语气礼貌但疏离",
      collapse: "肩背僵住，眼神空了一瞬，随后强行恢复理性",
      actions: "习惯站在对方半步之外，先观察再开口，情绪激动时会压低声音",
      lenses: "适合低角度、半身近景、过肩拍和暗光侧脸",
      lighting: "偏好冷硬顶侧光、办公室窗边光、高对比阴影",
      tags: ["男主", "近景", "冷感", "对话冲突"],
      notes: "不要把他拍得油腻，重点是克制和压迫感。",
      updatedAt: "2026-06-20",
    },
  ],
  modules: [
    {
      id: "module-scene-window",
      name: "雨夜窗边对峙",
      type: "scene",
      zh: "雨夜城市窗边，玻璃上有细密水痕，远处霓虹被雨水拉成模糊光带，室内空间安静而压抑。",
      en: "A rainy night by a city window, thin water traces on the glass, distant neon stretched into soft blurred light, the room quiet and tense.",
      tags: ["窗边光", "情绪爆发", "电影感"],
      scenarios: "对峙、真相揭露、回忆前奏",
      favorite: true,
      uses: 8,
      notes: "适合女主压抑情绪，不适合轻喜剧。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-camera-close",
      name: "克制近景镜头",
      type: "camera",
      zh: "近景镜头，人物面部占画面主要视觉重心，镜头稳定，轻微推近，保留肩颈和手部细节。",
      en: "A close shot with the face as the visual focus, stable camera, a subtle push-in, keeping shoulder, neck, and hand details visible.",
      tags: ["近景", "高级感", "微表情"],
      scenarios: "情绪爆发、内心戏、对话冲突",
      favorite: true,
      uses: 13,
      notes: "能突出微表情，避免过度大头照。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-action-controlled",
      name: "压抑情绪动作",
      type: "action",
      zh: "人物没有立刻爆发，而是先停顿半秒，手指轻轻收紧，肩颈保持克制，随后缓慢抬眼看向对方。",
      en: "The character does not explode immediately, pauses for half a second, fingers gently tightening, shoulders controlled, then slowly raises the eyes toward the other person.",
      tags: ["克制", "情绪爆发", "动作"],
      scenarios: "争执、揭露真相、复仇转折",
      favorite: true,
      uses: 11,
      notes: "用于增强真实感。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-expression-anger",
      name: "愤怒但克制的微表情",
      type: "expression",
      zh: "眉头压低，眼尾微红，嘴唇紧抿，呼吸压抑，眼神克制但带有怒意，表情不要夸张。",
      en: "Brows lowered, the outer corners of the eyes slightly red, lips pressed tight, restrained breathing, controlled eyes carrying anger, without exaggerated expression.",
      tags: ["愤怒", "克制", "女主"],
      scenarios: "情绪爆发、争吵、背叛揭露",
      favorite: true,
      uses: 18,
      notes: "眼尾发红强度要低。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-light-window",
      name: "冷调窗边电影光",
      type: "lighting",
      zh: "冷调窗边光从侧后方进入，脸部一侧被柔和照亮，另一侧留有细腻阴影，整体高对比但不过暗。",
      en: "Cool window light enters from the rear side, softly lighting one side of the face while leaving delicate shadow on the other, high contrast but not too dark.",
      tags: ["窗边光", "逆光", "电影感"],
      scenarios: "夜戏、对峙、回忆",
      favorite: true,
      uses: 16,
      notes: "黑夜模式视觉参考，灰调高级。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-texture-film",
      name: "高级短剧电影质感",
      type: "texture",
      zh: "画面精致干净，皮肤保留真实纹理，浅景深，低饱和色彩，细腻胶片颗粒，整体有高端短剧电影感。",
      en: "A refined clean image, natural skin texture preserved, shallow depth of field, low saturation, delicate film grain, premium short-drama cinematic look.",
      tags: ["高级感", "电影感", "ReelShort"],
      scenarios: "完整画面提示词、人物近景",
      favorite: true,
      uses: 20,
      notes: "常用基础质感。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-style-reelshort",
      name: "ReelShort戏剧张力",
      type: "style",
      zh: "节奏紧凑，情绪清晰，人物关系有强烈戏剧张力，画面真实自然，不要廉价网感。",
      en: "Tight pacing, clear emotion, strong dramatic tension between characters, realistic and natural visuals, avoiding cheap social-media aesthetics.",
      tags: ["ReelShort", "情绪爆发", "高级感"],
      scenarios: "短剧、冲突、复仇、反转",
      favorite: true,
      uses: 14,
      notes: "适合作为短剧通用风格。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-negative-character",
      name: "角色一致性负面约束",
      type: "negative",
      zh: "不要改变角色脸型、发色、服装主色调和年龄感；不要卡通化，不要过度柔焦，不要夸张表情，不要廉价塑料质感。",
      en: "Do not change the character's face shape, hair color, main outfit color, or age impression; no cartoon style, no excessive soft focus, no exaggerated expression, no cheap plastic texture.",
      tags: ["角色一致性", "负面提示词"],
      scenarios: "角色提示词、完整画面提示词",
      favorite: true,
      uses: 24,
      notes: "所有角色通用基础约束。",
      updatedAt: "2026-06-20",
    },
    {
      id: "module-format-video",
      name: "视频画面输出格式",
      type: "format",
      zh: "输出为适合视频生成工具的画面提示词，优先描述主体、场景、动作、镜头、光影、质感、风格和负面约束。",
      en: "Format the output as a video-generation visual prompt, prioritizing subject, scene, action, camera, lighting, texture, style, and negative constraints.",
      tags: ["视频画面提示词", "输出格式"],
      scenarios: "可灵、即梦、RunningHub",
      favorite: true,
      uses: 9,
      notes: "第一阶段不调用模型，只做结构组合。",
      updatedAt: "2026-06-20",
    },
  ],
  presets: [
    {
      id: "preset-lin-anger-v1",
      title: "林晚雨夜愤怒近景 v1",
      type: "完整画面提示词",
      zh: "林晚站在雨夜城市窗边，黑色长卷发自然垂落，银色耳坠在冷调窗边光下微微反光。她先停顿半秒，手指轻轻收紧，随后缓慢抬眼看向对方。眉头压低，眼尾微红，嘴唇紧抿，呼吸压抑，眼神克制但带有怒意。近景镜头，轻微推近，画面低饱和、浅景深、保留真实皮肤纹理，高级短剧电影感。",
      en: "Lin Wan stands by a rainy city window, her long black wavy hair falling naturally, silver earrings catching the cool window light. She pauses for half a second, fingers gently tightening, then slowly raises her eyes. Brows lowered, outer eye corners slightly red, lips pressed tight, restrained breathing, controlled anger in her eyes. Close shot with a subtle push-in, low saturation, shallow depth of field, natural skin texture, premium short-drama cinematic look.",
      negative: "不要改变发色，不要圆脸，不要幼态化，不要夸张大笑，不要卡通化，不要过度柔焦，不要廉价塑料质感。",
      roleId: "role-lin",
      scene: "雨夜窗边对峙",
      tags: ["女主", "愤怒", "近景", "窗边光", "电影感"],
      model: "本地组合器",
      effect: "效果很好，角色稳定，下一版可降低眼尾发红强度。",
      versions: [
        {
          id: "version-lin-anger-v1",
          name: "v1",
          note: "第一版可用，适合情绪爆发前一秒。",
          zh: "林晚雨夜窗边愤怒近景。",
          en: "Lin Wan close shot by the rainy window.",
          negative: "角色一致性负面约束。",
          createdAt: "2026-06-20",
        },
      ],
      createdAt: "2026-06-20",
      updatedAt: "2026-06-20",
    },
  ],
  models: [
    {
      id: "model-local",
      name: "本地组合器",
      type: "文本",
      usage: "不调用API，按照已选资产和模块自动组合提示词",
      language: "中英双语",
      enabled: true,
      priority: 1,
      apiKey: "",
      notes: "MVP第一阶段默认方案。",
    },
    {
      id: "model-vision-placeholder",
      name: "视觉模型占位",
      type: "视觉",
      usage: "第二阶段用于参考图识别、角色特征分析、光影分析",
      language: "中文",
      enabled: false,
      priority: 9,
      apiKey: "",
      notes: "待接入。",
    },
  ],
};

let state = loadState();
let modalMode = null;
let modalEditingId = null;

const dom = {
  nav: document.getElementById("mainNav"),
  view: document.getElementById("appView"),
  pageTitle: document.getElementById("pageTitle"),
  search: document.getElementById("globalSearch"),
  themeToggle: document.getElementById("themeToggle"),
  quickCreate: document.getElementById("quickCreateBtn"),
  exportData: document.getElementById("exportDataBtn"),
  modal: document.getElementById("entityModal"),
  modalForm: document.getElementById("entityForm"),
  modalBody: document.getElementById("modalBody"),
  modalTitle: document.getElementById("modalTitle"),
  modalEyebrow: document.getElementById("modalEyebrow"),
  modalClose: document.getElementById("modalClose"),
  modalCancel: document.getElementById("modalCancel"),
  toast: document.getElementById("toast"),
};

function init() {
  document.body.classList.toggle("dark", state.theme === "dark");
  if (!location.hash) {
    location.hash = "#workbench";
  }
  state.activeView = getHashView();
  ensureWorkbenchResults();
  bindShellEvents();
  renderNav();
  render();
}

function bindShellEvents() {
  window.addEventListener("hashchange", () => {
    state.activeView = getHashView();
    saveState();
    render();
  });

  dom.search.addEventListener("input", render);

  dom.themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.body.classList.toggle("dark", state.theme === "dark");
    saveState();
    refreshIcons();
  });

  dom.quickCreate.addEventListener("click", () => {
    if (state.activeView === "roles" || state.activeView === "workbench") openRoleModal();
    if (state.activeView === "modules") openModuleModal();
    if (state.activeView === "presets") openPresetModal();
    if (state.activeView === "tags") openTagModal();
    if (state.activeView === "models") openModelModal();
  });

  dom.exportData.addEventListener("click", exportData);
  dom.modalClose.addEventListener("click", closeModal);
  dom.modalCancel.addEventListener("click", closeModal);
  dom.modal.addEventListener("click", (event) => {
    if (event.target === dom.modal) closeModal();
  });
  dom.modalForm.addEventListener("submit", handleModalSubmit);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULT_STATE);
    const saved = JSON.parse(raw);
    return mergeState(clone(DEFAULT_STATE), saved);
  } catch (error) {
    console.warn(error);
    return clone(DEFAULT_STATE);
  }
}

function mergeState(base, saved) {
  return {
    ...base,
    ...saved,
    workbench: { ...base.workbench, ...(saved.workbench || {}) },
    roles: Array.isArray(saved.roles) ? saved.roles : base.roles,
    modules: Array.isArray(saved.modules) ? saved.modules : base.modules,
    presets: Array.isArray(saved.presets) ? saved.presets : base.presets,
    tags: Array.isArray(saved.tags) ? saved.tags : base.tags,
    models: Array.isArray(saved.models) ? saved.models : base.models,
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getHashView() {
  const view = location.hash.replace("#", "");
  return NAV_ITEMS.some((item) => item.id === view) ? view : "workbench";
}

function renderNav() {
  dom.nav.innerHTML = NAV_ITEMS.map(
    (item) => `
      <a class="nav-item ${item.id === state.activeView ? "is-active" : ""}" href="#${item.id}">
        <i data-lucide="${item.icon}"></i>
        <span>${item.label}</span>
      </a>
    `
  ).join("");
  refreshIcons();
}

function render() {
  const item = NAV_ITEMS.find((entry) => entry.id === state.activeView) || NAV_ITEMS[0];
  dom.pageTitle.textContent = item.title;
  renderNav();

  if (state.activeView === "workbench") renderWorkbench();
  if (state.activeView === "roles") renderRoles();
  if (state.activeView === "modules") renderModules();
  if (state.activeView === "presets") renderPresets();
  if (state.activeView === "tags") renderTags();
  if (state.activeView === "models") renderModels();

  refreshIcons();
}

function renderWorkbench() {
  ensureWorkbenchResults();
  const wb = state.workbench;
  const role = getRole(wb.roleId);
  const stats = getStats();

  dom.view.innerHTML = `
    <div class="dashboard-grid">
      <div class="stat-grid">
        ${statCard("角色资产", stats.roles)}
        ${statCard("提示词模块", stats.modules)}
        ${statCard("完整预设", stats.presets)}
        ${statCard("标签数量", stats.tags)}
      </div>

      <div class="workbench-layout">
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>引导式选择</h2>
              <p>先选类型、角色和关键控制项。</p>
            </div>
          </div>
          <div class="panel-body">
            ${renderStepper()}
            <div class="field">
              <label for="wbPromptType">创建类型</label>
              <select id="wbPromptType">${optionList(PROMPT_TYPES, wb.promptType)}</select>
            </div>
            <div class="field">
              <label for="wbRole">角色资产</label>
              <select id="wbRole">
                <option value="">不使用角色</option>
                ${state.roles.map((item) => `<option value="${item.id}" ${item.id === wb.roleId ? "selected" : ""}>${escapeHtml(item.name)} / ${escapeHtml(item.identity)}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <span class="label">画面目标</span>
              <div class="chip-row">
                ${GOAL_OPTIONS.map((goal) => `<button class="chip ${goal === wb.goal ? "is-selected" : ""}" type="button" data-goal="${escapeHtml(goal)}">${escapeHtml(goal)}</button>`).join("")}
              </div>
            </div>
            <div class="module-picker">
              ${MODULE_TYPES.map((type) => renderModuleSelect(type)).join("")}
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>当前画面编辑</h2>
              <p>半固定资产可以在这里临时调整。</p>
            </div>
            <button class="secondary-button compact" type="button" id="resetWorkbenchBtn">
              <i data-lucide="rotate-ccw"></i>
              重置
            </button>
          </div>
          <div class="panel-body">
            <div class="field-grid two-col">
              <div class="field">
                <label for="wbOutputFormat">输出格式</label>
                <select id="wbOutputFormat">${optionList(OUTPUT_FORMATS, wb.outputFormat)}</select>
              </div>
              <div class="field">
                <label for="wbTargetTool">目标工具</label>
                <select id="wbTargetTool">${optionList(TARGET_TOOLS, wb.targetTool)}</select>
              </div>
            </div>
            <div class="field">
              <label for="wbSceneGoal">当前创作目标</label>
              <textarea id="wbSceneGoal">${escapeHtml(wb.sceneGoal)}</textarea>
            </div>
            <div class="field">
              <label for="wbFrameDescription">当前画面描述</label>
              <textarea id="wbFrameDescription">${escapeHtml(wb.frameDescription)}</textarea>
            </div>
            <div class="field">
              <label for="wbExtra">临时补充要求</label>
              <textarea id="wbExtra">${escapeHtml(wb.extra)}</textarea>
            </div>
            ${role ? renderRoleSnapshot(role) : ""}
            <div>
              <p class="eyebrow">已选模块预览</p>
              <div class="selected-modules">
                ${MODULE_TYPES.map((type) => renderModuleEditor(type)).join("")}
              </div>
            </div>
          </div>
        </section>

        <section class="panel result-column">
          <div class="panel-head">
            <div>
              <h2>生成结果</h2>
              <p>结果可编辑、复制、保存为预设或新版本。</p>
            </div>
          </div>
          <div class="result-box">
            <div class="result-tabs">
              ${[
                ["zh", "中文"],
                ["en", "英文"],
                ["negative", "负面"],
                ["json", "JSON"],
              ].map(([id, label]) => `<button class="result-tab ${state.resultTab === id ? "is-active" : ""}" type="button" data-result-tab="${id}">${label}</button>`).join("")}
            </div>
            <textarea class="result-text" id="resultText">${escapeHtml(wb.results[state.resultTab] || "")}</textarea>
            <div class="result-actions">
              <div class="button-row">
                <button class="primary-button" type="button" id="copyResultBtn">
                  <i data-lucide="copy"></i>
                  复制当前结果
                </button>
                <button class="secondary-button" type="button" id="regenerateBtn">
                  <i data-lucide="refresh-cw"></i>
                  重新组合
                </button>
              </div>
              <div class="button-row">
                <button class="secondary-button" type="button" id="savePresetBtn">
                  <i data-lucide="save"></i>
                  保存为预设
                </button>
                <button class="secondary-button" type="button" id="saveVersionBtn">
                  <i data-lucide="git-branch-plus"></i>
                  保存为新版本
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;

  bindWorkbenchEvents();
}

function statCard(label, value) {
  return `<div class="stat-card"><span>${label}</span><strong>${value}</strong></div>`;
}

function getStats() {
  return {
    roles: state.roles.length,
    modules: state.modules.length,
    presets: state.presets.length,
    tags: state.tags.length,
  };
}

function renderStepper() {
  const wb = state.workbench;
  const checks = [
    ["选择类型", Boolean(wb.promptType)],
    ["选择角色", true],
    ["画面目标", Boolean(wb.goal || wb.sceneGoal)],
    ["关键控制项", Object.values(wb.selectedModuleIds || {}).some(Boolean)],
    ["生成保存", Boolean(wb.results.zh)],
  ];
  return `
    <div class="stepper">
      ${checks.map(([label, done], index) => `
        <div class="step-item ${done ? "is-done" : ""}">
          <span class="step-number">${index + 1}</span>
          <span>${label}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderModuleSelect(type) {
  const selected = state.workbench.selectedModuleIds[type.id] || "";
  const modules = state.modules.filter((item) => item.type === type.id);
  return `
    <div class="module-row">
      <span>${type.label}</span>
      <select data-module-select="${type.id}">
        <option value="">不使用</option>
        ${modules.map((item) => `<option value="${item.id}" ${item.id === selected ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
      </select>
    </div>
  `;
}

function renderModuleEditor(type) {
  const module = getModule(state.workbench.selectedModuleIds[type.id]);
  if (!module) {
    return `
      <details class="module-editor">
        <summary><strong>${type.label}</strong><span>未选择</span></summary>
      </details>
    `;
  }
  const text = state.workbench.moduleOverrides[type.id] ?? module.zh;
  return `
    <details class="module-editor" open>
      <summary>
        <strong>${escapeHtml(type.label)} / ${escapeHtml(module.name)}</strong>
        <span>${escapeHtml(module.tags.join("、"))}</span>
      </summary>
      <textarea data-module-override="${type.id}">${escapeHtml(text)}</textarea>
    </details>
  `;
}

function renderRoleSnapshot(role) {
  return `
    <div class="role-snapshot">
      <div class="snapshot-row"><strong>固定项</strong><span>${escapeHtml(compactText(role.fixed))}</span></div>
      <div class="snapshot-row"><strong>可变项</strong><span>${escapeHtml(compactText(role.variable))}</span></div>
      <div class="snapshot-row"><strong>禁止项</strong><span>${escapeHtml(compactText(role.forbidden))}</span></div>
      <div class="snapshot-row"><strong>表情</strong><span>${escapeHtml(role.anger || role.temperament)}</span></div>
    </div>
  `;
}

function bindWorkbenchEvents() {
  const wb = state.workbench;

  document.getElementById("wbPromptType").addEventListener("change", (event) => {
    wb.promptType = event.target.value;
    regenerateResults();
  });
  document.getElementById("wbRole").addEventListener("change", (event) => {
    wb.roleId = event.target.value;
    regenerateResults();
    renderWorkbench();
    refreshIcons();
  });
  document.getElementById("wbOutputFormat").addEventListener("change", (event) => {
    wb.outputFormat = event.target.value;
    regenerateResults();
  });
  document.getElementById("wbTargetTool").addEventListener("change", (event) => {
    wb.targetTool = event.target.value;
    regenerateResults();
  });
  document.getElementById("wbSceneGoal").addEventListener("input", (event) => {
    wb.sceneGoal = event.target.value;
    regenerateResults();
  });
  document.getElementById("wbFrameDescription").addEventListener("input", (event) => {
    wb.frameDescription = event.target.value;
    regenerateResults();
  });
  document.getElementById("wbExtra").addEventListener("input", (event) => {
    wb.extra = event.target.value;
    regenerateResults();
  });

  document.querySelectorAll("[data-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      wb.goal = button.dataset.goal;
      regenerateResults();
      renderWorkbench();
      refreshIcons();
    });
  });

  document.querySelectorAll("[data-module-select]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const type = event.target.dataset.moduleSelect;
      wb.selectedModuleIds[type] = event.target.value;
      delete wb.moduleOverrides[type];
      regenerateResults();
      renderWorkbench();
      refreshIcons();
    });
  });

  document.querySelectorAll("[data-module-override]").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      wb.moduleOverrides[event.target.dataset.moduleOverride] = event.target.value;
      regenerateResults();
    });
  });

  document.querySelectorAll("[data-result-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.resultTab = button.dataset.resultTab;
      saveState();
      renderWorkbench();
      refreshIcons();
    });
  });

  document.getElementById("resultText").addEventListener("input", (event) => {
    wb.results[state.resultTab] = event.target.value;
    saveState();
  });

  document.getElementById("copyResultBtn").addEventListener("click", () => copyText(wb.results[state.resultTab] || ""));
  document.getElementById("regenerateBtn").addEventListener("click", () => {
    regenerateResults();
    renderWorkbench();
    showToast("已按当前资产重新组合提示词");
  });
  document.getElementById("savePresetBtn").addEventListener("click", saveCurrentPreset);
  document.getElementById("saveVersionBtn").addEventListener("click", saveCurrentVersion);
  document.getElementById("resetWorkbenchBtn").addEventListener("click", () => {
    state.workbench = clone(DEFAULT_STATE.workbench);
    regenerateResults();
    saveState();
    renderWorkbench();
    showToast("工作台已恢复为示例配置");
  });
}

function ensureWorkbenchResults() {
  if (!state.workbench.results || !state.workbench.results.zh) {
    regenerateResults();
  }
}

function regenerateResults() {
  state.workbench.results = composePrompt();
  saveState();
  const textarea = document.getElementById("resultText");
  if (textarea) textarea.value = state.workbench.results[state.resultTab] || "";
}

function composePrompt() {
  const wb = state.workbench;
  const role = getRole(wb.roleId);
  const selectedModules = MODULE_TYPES.map((type) => {
    const module = getModule(wb.selectedModuleIds[type.id]);
    if (!module) return null;
    return {
      type,
      module,
      zh: wb.moduleOverrides[type.id] ?? module.zh,
      en: module.en,
    };
  }).filter(Boolean);

  const moduleZh = selectedModules
    .filter((item) => item.type.id !== "negative")
    .map((item) => `【${item.type.label}】${item.zh}`)
    .join("\n");

  const moduleEn = selectedModules
    .filter((item) => item.type.id !== "negative")
    .map((item) => `[${item.type.label}] ${item.en || item.zh}`)
    .join("\n");

  const negativeModule = selectedModules.find((item) => item.type.id === "negative");
  const negative = [
    role?.forbidden ? `角色禁止项：${lineToSentence(role.forbidden)}` : "",
    negativeModule ? `模块负面约束：${negativeModule.zh}` : "",
    "不要出现肢体扭曲、面部崩坏、五官漂移、手指错误、镜头脏污、低清晰度、廉价塑料质感。",
  ].filter(Boolean).join("\n");

  const roleZh = role
    ? [
        `角色名称：${role.name}`,
        `身份：${role.identity}，${role.age}岁，${role.gender}`,
        `世界观 / 剧集：${role.world}`,
        `气质：${role.temperament}`,
        `外观固定项：${lineToSentence(role.fixed)}`,
        `服装设定：${role.outfits}`,
        `表情范围：愤怒时${role.anger}；委屈时${role.grievance}；冷漠时${role.cold}`,
        `动作习惯：${role.actions}`,
        `镜头偏好：${role.lenses}`,
        `光影偏好：${role.lighting}`,
      ].join("\n")
    : "不使用固定角色资产。";

  const roleEn = role
    ? [
        `Character: ${role.name}`,
        `Identity: ${role.identity}, age ${role.age}, ${role.gender}`,
        `World / Series: ${role.world}`,
        `Temperament: ${role.temperament}`,
        `Fixed traits: ${lineToSentence(role.fixed)}`,
        `Outfit setting: ${role.outfits}`,
        `Expression range: anger - ${role.anger}; grievance - ${role.grievance}; coldness - ${role.cold}`,
        `Action habits: ${role.actions}`,
        `Camera preference: ${role.lenses}`,
        `Lighting preference: ${role.lighting}`,
      ].join("\n")
    : "No fixed character asset.";

  const zh = [
    `【提示词类型】${wb.promptType}`,
    `【目标工具】${wb.targetTool}`,
    `【输出格式】${wb.outputFormat}`,
    `【画面目标】${wb.goal || "未选择"}`,
    "",
    "【角色资产】",
    roleZh,
    "",
    "【当前创作目标】",
    wb.sceneGoal || "请补充当前创作目标。",
    "",
    "【当前画面描述】",
    wb.frameDescription || "请补充画面描述。",
    "",
    "【关键控制模块】",
    moduleZh || "未选择模块。",
    "",
    "【临时补充要求】",
    wb.extra || "无。",
    "",
    "【负面提示词】",
    negative,
  ].join("\n");

  const en = [
    `[Prompt Type] ${wb.promptType}`,
    `[Target Tool] ${wb.targetTool}`,
    `[Output Format] ${wb.outputFormat}`,
    `[Scene Goal] ${wb.goal || "Not selected"}`,
    "",
    "[Character Asset]",
    roleEn,
    "",
    "[Creative Goal]",
    wb.sceneGoal || "Please add the current creative goal.",
    "",
    "[Frame Description]",
    wb.frameDescription || "Please add the current frame description.",
    "",
    "[Control Modules]",
    moduleEn || "No module selected.",
    "",
    "[Extra Requirements]",
    wb.extra || "None.",
    "",
    "[Negative Prompt]",
    negative,
  ].join("\n");

  const json = JSON.stringify(
    {
      promptType: wb.promptType,
      targetTool: wb.targetTool,
      outputFormat: wb.outputFormat,
      goal: wb.goal,
      role: role ? { id: role.id, name: role.name, fixed: lines(role.fixed), variable: lines(role.variable), forbidden: lines(role.forbidden) } : null,
      sceneGoal: wb.sceneGoal,
      frameDescription: wb.frameDescription,
      modules: selectedModules.map((item) => ({
        type: item.type.label,
        name: item.module.name,
        zh: item.zh,
        en: item.en,
        tags: item.module.tags,
      })),
      negativePrompt: negative,
      extra: wb.extra,
    },
    null,
    2
  );

  return { zh, en, negative, json };
}

function renderRoles() {
  const query = currentQuery();
  const roles = state.roles.filter((role) => searchable(role).includes(query));
  dom.view.innerHTML = `
    ${renderToolbar("角色资产库", "沉淀角色外观、表情范围、动作习惯、镜头偏好和禁止项。", "新建角色", "role")}
    ${roles.length ? `<div class="asset-grid">${roles.map(renderRoleCard).join("")}</div>` : emptyState("还没有匹配的角色资产", "新建一个角色后，就可以在工作台直接调用。")}
  `;
  bindAssetEvents();
}

function renderRoleCard(role) {
  return `
    <article class="asset-card">
      <div class="asset-head">
        <div>
          <h3>${escapeHtml(role.name)}</h3>
          <p>${escapeHtml(role.identity)} / ${escapeHtml(role.world)}</p>
        </div>
        <span class="tag strong">${escapeHtml(role.gender || "角色")}</span>
      </div>
      <div class="asset-meta">
        <span><b>气质</b> ${escapeHtml(role.temperament)}</span>
        <span><b>固定项</b> ${escapeHtml(compactText(role.fixed))}</span>
        <span><b>愤怒时</b> ${escapeHtml(role.anger)}</span>
        <span><b>禁止项</b> ${escapeHtml(compactText(role.forbidden))}</span>
      </div>
      <div class="tag-list">${(role.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="asset-actions">
        <button class="secondary-button compact" type="button" data-use-role="${role.id}"><i data-lucide="wand-sparkles"></i>调用生成</button>
        <button class="ghost-button compact" type="button" data-edit-role="${role.id}"><i data-lucide="pencil"></i>编辑</button>
        <button class="danger-button compact" type="button" data-delete-role="${role.id}"><i data-lucide="trash-2"></i>删除</button>
      </div>
    </article>
  `;
}

function renderModules() {
  const query = currentQuery();
  const filterType = getTempFilter("moduleType", "all");
  const modules = state.modules.filter((item) => {
    const matchQuery = searchable(item).includes(query);
    const matchType = filterType === "all" || item.type === filterType;
    return matchQuery && matchType;
  });
  dom.view.innerHTML = `
    ${renderToolbar("提示词模块库", "保存可反复组合的小积木：光影、镜头、动作、微表情、质感与负面约束。", "新建模块", "module")}
    <div class="toolbar">
      <div class="toolbar-filters">
        <select id="moduleTypeFilter">
          <option value="all">全部模块类型</option>
          ${MODULE_TYPES.map((type) => `<option value="${type.id}" ${type.id === filterType ? "selected" : ""}>${type.label}</option>`).join("")}
        </select>
      </div>
    </div>
    ${modules.length ? `<div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>模块</th>
            <th>类型</th>
            <th>中文内容</th>
            <th>标签</th>
            <th>使用</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>${modules.map(renderModuleRow).join("")}</tbody>
      </table>
    </div>` : emptyState("还没有匹配的模块", "把常用光影、动作和微表情拆成模块，后续组合会轻很多。")}
  `;
  document.getElementById("moduleTypeFilter").addEventListener("change", (event) => {
    setTempFilter("moduleType", event.target.value);
    renderModules();
  });
  bindAssetEvents();
}

function renderModuleRow(module) {
  const type = MODULE_TYPES.find((item) => item.id === module.type)?.label || module.type;
  return `
    <tr>
      <td><strong>${escapeHtml(module.name)}</strong><p class="hint">${escapeHtml(module.scenarios || "")}</p></td>
      <td>${escapeHtml(type)}</td>
      <td class="preset-preview">${escapeHtml(module.zh)}</td>
      <td><div class="tag-list">${(module.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div></td>
      <td>${module.favorite ? "常用" : "普通"} / ${module.uses || 0}次</td>
      <td>
        <div class="button-row">
          <button class="ghost-button compact" type="button" data-edit-module="${module.id}"><i data-lucide="pencil"></i>编辑</button>
          <button class="danger-button compact" type="button" data-delete-module="${module.id}"><i data-lucide="trash-2"></i>删除</button>
        </div>
      </td>
    </tr>
  `;
}

function renderPresets() {
  const query = currentQuery();
  const presets = state.presets.filter((preset) => searchable(preset).includes(query));
  dom.view.innerHTML = `
    ${renderToolbar("预设提示词库", "保存完整提示词、效果备注和版本记录，逐渐形成创作经验库。", "新建预设", "preset")}
    ${presets.length ? `<div class="asset-grid">${presets.map(renderPresetCard).join("")}</div>` : emptyState("还没有匹配的预设提示词", "在工作台保存结果后，这里会积累完整提示词版本。")}
  `;
  bindAssetEvents();
}

function renderPresetCard(preset) {
  const role = getRole(preset.roleId);
  return `
    <article class="asset-card">
      <div class="asset-head">
        <div>
          <h3>${escapeHtml(preset.title)}</h3>
          <p>${escapeHtml(preset.type)} / ${escapeHtml(role?.name || "未关联角色")}</p>
        </div>
        <span class="tag strong">${preset.versions?.length || 0} 版</span>
      </div>
      <p class="preset-preview">${escapeHtml(preset.zh)}</p>
      <div class="asset-meta">
        <span><b>模型</b> ${escapeHtml(preset.model || "本地组合器")}</span>
        <span><b>效果备注</b> ${escapeHtml(preset.effect || "未记录")}</span>
      </div>
      <div class="tag-list">${(preset.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="version-list">
        ${(preset.versions || []).slice(-2).map((version) => `
          <div class="version-row">
            <strong>${escapeHtml(version.name)}</strong>
            <p>${escapeHtml(version.note || "无备注")}</p>
          </div>
        `).join("")}
      </div>
      <div class="asset-actions">
        <button class="secondary-button compact" type="button" data-use-preset="${preset.id}"><i data-lucide="wand-sparkles"></i>基于它创作</button>
        <button class="ghost-button compact" type="button" data-copy-preset="${preset.id}"><i data-lucide="copy"></i>复制</button>
        <button class="ghost-button compact" type="button" data-edit-preset="${preset.id}"><i data-lucide="pencil"></i>编辑</button>
        <button class="danger-button compact" type="button" data-delete-preset="${preset.id}"><i data-lucide="trash-2"></i>删除</button>
      </div>
    </article>
  `;
}

function renderTags() {
  const query = currentQuery();
  const tags = state.tags.filter((tag) => tag.toLowerCase().includes(query));
  dom.view.innerHTML = `
    ${renderToolbar("分类与标签管理", "用标签把角色、模块和完整提示词串起来，方便长期搜索复用。", "新建标签", "tag")}
    <div class="tag-manager">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>标签云</h2>
            <p>删除标签会同步从角色、模块和预设中移除。</p>
          </div>
        </div>
        <div class="panel-body">
          <div class="tag-cloud">
            ${tags.map((tag) => `<span class="tag-pill">${escapeHtml(tag)}<button type="button" aria-label="删除${escapeHtml(tag)}" data-delete-tag="${escapeHtml(tag)}"><i data-lucide="x"></i></button></span>`).join("")}
          </div>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>合并标签</h2>
            <p>将旧标签合并为统一命名。</p>
          </div>
        </div>
        <div class="panel-body">
          <div class="field">
            <label for="mergeFrom">源标签</label>
            <select id="mergeFrom">${state.tags.map((tag) => `<option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>`).join("")}</select>
          </div>
          <div class="field">
            <label for="mergeTo">目标标签</label>
            <select id="mergeTo">${state.tags.map((tag) => `<option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>`).join("")}</select>
          </div>
          <button class="primary-button" type="button" id="mergeTagBtn"><i data-lucide="combine"></i>合并标签</button>
        </div>
      </section>
    </div>
  `;
  bindAssetEvents();
  document.getElementById("mergeTagBtn").addEventListener("click", mergeTags);
}

function renderModels() {
  const query = currentQuery();
  const models = state.models.filter((model) => searchable(model).includes(query));
  dom.view.innerHTML = `
    ${renderToolbar("模型配置", "第一阶段以本地组合为主，第二阶段可接入多个文本模型和视觉模型。", "添加模型", "model")}
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>模型</th>
            <th>类型</th>
            <th>用途</th>
            <th>语言</th>
            <th>状态</th>
            <th>优先级</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>${models.map(renderModelRow).join("")}</tbody>
      </table>
    </div>
  `;
  bindAssetEvents();
}

function renderModelRow(model) {
  return `
    <tr>
      <td><strong>${escapeHtml(model.name)}</strong><p class="hint">${model.apiKey ? "API Key 已本地保存" : "未配置 API Key"}</p></td>
      <td>${escapeHtml(model.type)}</td>
      <td>${escapeHtml(model.usage)}</td>
      <td>${escapeHtml(model.language)}</td>
      <td><span class="model-status ${model.enabled ? "is-on" : "is-off"}">${model.enabled ? "启用" : "停用"}</span></td>
      <td>${Number(model.priority) || 0}</td>
      <td>
        <div class="button-row">
          <button class="ghost-button compact" type="button" data-edit-model="${model.id}"><i data-lucide="pencil"></i>编辑</button>
          <button class="danger-button compact" type="button" data-delete-model="${model.id}"><i data-lucide="trash-2"></i>删除</button>
        </div>
      </td>
    </tr>
  `;
}

function renderToolbar(title, description, buttonLabel, entity) {
  return `
    <div class="toolbar">
      <div>
        <p class="eyebrow">${escapeHtml(title)}</p>
        <h2 style="margin:0">${escapeHtml(description)}</h2>
      </div>
      <button class="primary-button" type="button" data-create="${entity}">
        <i data-lucide="plus"></i>
        ${escapeHtml(buttonLabel)}
      </button>
    </div>
  `;
}

function bindAssetEvents() {
  dom.view.querySelectorAll("[data-create]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.create === "role") openRoleModal();
      if (button.dataset.create === "module") openModuleModal();
      if (button.dataset.create === "preset") openPresetModal();
      if (button.dataset.create === "tag") openTagModal();
      if (button.dataset.create === "model") openModelModal();
    });
  });

  dom.view.querySelectorAll("[data-use-role]").forEach((button) => {
    button.addEventListener("click", () => {
      state.workbench.roleId = button.dataset.useRole;
      regenerateResults();
      location.hash = "#workbench";
      showToast("角色已带入工作台");
    });
  });

  dom.view.querySelectorAll("[data-edit-role]").forEach((button) => button.addEventListener("click", () => openRoleModal(getRole(button.dataset.editRole))));
  dom.view.querySelectorAll("[data-delete-role]").forEach((button) => button.addEventListener("click", () => deleteEntity("roles", button.dataset.deleteRole, "角色")));

  dom.view.querySelectorAll("[data-edit-module]").forEach((button) => button.addEventListener("click", () => openModuleModal(getModule(button.dataset.editModule))));
  dom.view.querySelectorAll("[data-delete-module]").forEach((button) => button.addEventListener("click", () => deleteEntity("modules", button.dataset.deleteModule, "模块")));

  dom.view.querySelectorAll("[data-use-preset]").forEach((button) => button.addEventListener("click", () => usePreset(button.dataset.usePreset)));
  dom.view.querySelectorAll("[data-copy-preset]").forEach((button) => button.addEventListener("click", () => {
    const preset = getPreset(button.dataset.copyPreset);
    copyText([preset.zh, preset.en, preset.negative].filter(Boolean).join("\n\n"));
  }));
  dom.view.querySelectorAll("[data-edit-preset]").forEach((button) => button.addEventListener("click", () => openPresetModal(getPreset(button.dataset.editPreset))));
  dom.view.querySelectorAll("[data-delete-preset]").forEach((button) => button.addEventListener("click", () => deleteEntity("presets", button.dataset.deletePreset, "预设")));

  dom.view.querySelectorAll("[data-delete-tag]").forEach((button) => button.addEventListener("click", () => deleteTag(button.dataset.deleteTag)));

  dom.view.querySelectorAll("[data-edit-model]").forEach((button) => button.addEventListener("click", () => openModelModal(getModel(button.dataset.editModel))));
  dom.view.querySelectorAll("[data-delete-model]").forEach((button) => button.addEventListener("click", () => deleteEntity("models", button.dataset.deleteModel, "模型")));
}

function openRoleModal(role = null) {
  modalMode = "role";
  modalEditingId = role?.id || null;
  dom.modalEyebrow.textContent = "角色资产";
  dom.modalTitle.textContent = role ? `编辑 ${role.name}` : "新建角色";
  const item = role || {};
  dom.modalBody.innerHTML = `
    <section class="form-section">
      <h3>基础信息</h3>
      <div class="field-grid three-col">
        ${inputField("name", "角色名称", item.name)}
        ${inputField("gender", "性别", item.gender)}
        ${inputField("age", "年龄", item.age)}
      </div>
      <div class="field-grid two-col">
        ${inputField("identity", "身份", item.identity)}
        ${inputField("world", "世界观 / 剧集名称", item.world)}
      </div>
      ${textareaField("temperament", "角色气质关键词", item.temperament)}
      ${inputField("tags", "标签，用逗号分隔", (item.tags || []).join(", "))}
    </section>
    <section class="form-section">
      <h3>外观固定项</h3>
      <div class="field-grid three-col">
        ${inputField("face", "脸型 / 五官", item.face)}
        ${inputField("hair", "发型", item.hair)}
        ${inputField("hairColor", "发色", item.hairColor)}
        ${inputField("skin", "肤色", item.skin)}
        ${inputField("body", "身材", item.body)}
        ${inputField("signature", "标志性特征", item.signature)}
      </div>
      <div class="field-grid two-col">
        ${inputField("accessories", "配饰", item.accessories)}
        ${inputField("makeup", "妆容", item.makeup)}
      </div>
      ${textareaField("outfits", "服装设定", item.outfits)}
    </section>
    <section class="form-section">
      <h3>固定项 / 可变项 / 禁止项</h3>
      <div class="field-grid three-col">
        ${textareaField("fixed", "固定项", item.fixed)}
        ${textareaField("variable", "可变项", item.variable)}
        ${textareaField("forbidden", "禁止项", item.forbidden)}
      </div>
    </section>
    <section class="form-section">
      <h3>表情范围</h3>
      <div class="field-grid two-col">
        ${textareaField("anger", "愤怒时", item.anger)}
        ${textareaField("grievance", "委屈时", item.grievance)}
        ${textareaField("nervous", "紧张时", item.nervous)}
        ${textareaField("cold", "冷漠时", item.cold)}
        ${textareaField("collapse", "崩溃时", item.collapse)}
      </div>
    </section>
    <section class="form-section">
      <h3>习惯与偏好</h3>
      ${textareaField("actions", "动作习惯", item.actions)}
      ${textareaField("lenses", "镜头偏好", item.lenses)}
      ${textareaField("lighting", "光影偏好", item.lighting)}
      ${textareaField("notes", "效果备注 / 细节记录", item.notes)}
    </section>
  `;
  openModal();
}

function openModuleModal(module = null) {
  modalMode = "module";
  modalEditingId = module?.id || null;
  dom.modalEyebrow.textContent = "提示词模块";
  dom.modalTitle.textContent = module ? `编辑 ${module.name}` : "新建模块";
  const item = module || {};
  dom.modalBody.innerHTML = `
    <section class="form-section">
      <h3>模块信息</h3>
      <div class="field-grid two-col">
        ${inputField("name", "模块名称", item.name)}
        <div class="field">
          <label for="field-type">模块类型</label>
          <select name="type" id="field-type">${MODULE_TYPES.map((type) => `<option value="${type.id}" ${type.id === item.type ? "selected" : ""}>${type.label}</option>`).join("")}</select>
        </div>
      </div>
      ${textareaField("zh", "中文内容", item.zh)}
      ${textareaField("en", "英文内容", item.en)}
      <div class="field-grid two-col">
        ${inputField("tags", "标签，用逗号分隔", (item.tags || []).join(", "))}
        ${inputField("scenarios", "适用场景", item.scenarios)}
      </div>
      <div class="field-grid three-col">
        <div class="field">
          <label for="field-favorite">是否常用</label>
          <select name="favorite" id="field-favorite">
            <option value="true" ${item.favorite ? "selected" : ""}>常用</option>
            <option value="false" ${!item.favorite ? "selected" : ""}>普通</option>
          </select>
        </div>
        ${inputField("uses", "使用次数", item.uses || 0, "number")}
        ${inputField("updatedAt", "最近使用时间", item.updatedAt || today())}
      </div>
      ${textareaField("notes", "效果备注", item.notes)}
    </section>
  `;
  openModal();
}

function openPresetModal(preset = null) {
  modalMode = "preset";
  modalEditingId = preset?.id || null;
  dom.modalEyebrow.textContent = "完整提示词";
  dom.modalTitle.textContent = preset ? `编辑 ${preset.title}` : "新建预设";
  const item = preset || {};
  dom.modalBody.innerHTML = `
    <section class="form-section">
      <h3>预设信息</h3>
      <div class="field-grid two-col">
        ${inputField("title", "标题", item.title)}
        <div class="field">
          <label for="field-type">提示词类型</label>
          <select name="type" id="field-type">${optionList(PROMPT_TYPES, item.type || "完整画面提示词")}</select>
        </div>
      </div>
      <div class="field-grid two-col">
        <div class="field">
          <label for="field-roleId">关联角色</label>
          <select name="roleId" id="field-roleId">
            <option value="">不关联</option>
            ${state.roles.map((role) => `<option value="${role.id}" ${role.id === item.roleId ? "selected" : ""}>${escapeHtml(role.name)}</option>`).join("")}
          </select>
        </div>
        ${inputField("scene", "关联场景", item.scene)}
      </div>
      ${textareaField("zh", "中文提示词", item.zh)}
      ${textareaField("en", "英文提示词", item.en)}
      ${textareaField("negative", "负面提示词", item.negative)}
      <div class="field-grid two-col">
        ${inputField("tags", "标签，用逗号分隔", (item.tags || []).join(", "))}
        ${inputField("model", "使用模型", item.model || "本地组合器")}
      </div>
      ${textareaField("effect", "使用效果备注", item.effect)}
    </section>
  `;
  openModal();
}

function openTagModal() {
  modalMode = "tag";
  modalEditingId = null;
  dom.modalEyebrow.textContent = "分类标签";
  dom.modalTitle.textContent = "新建标签";
  dom.modalBody.innerHTML = `
    <section class="form-section">
      ${inputField("tag", "标签名称")}
      <p class="hint">标签会用于角色、模块和完整提示词搜索。</p>
    </section>
  `;
  openModal();
}

function openModelModal(model = null) {
  modalMode = "model";
  modalEditingId = model?.id || null;
  dom.modalEyebrow.textContent = "模型配置";
  dom.modalTitle.textContent = model ? `编辑 ${model.name}` : "添加模型";
  const item = model || {};
  dom.modalBody.innerHTML = `
    <section class="form-section">
      <h3>模型信息</h3>
      <div class="field-grid two-col">
        ${inputField("name", "模型名称", item.name)}
        <div class="field">
          <label for="field-type">模型类型</label>
          <select name="type" id="field-type">
            <option value="文本" ${item.type === "文本" ? "selected" : ""}>文本</option>
            <option value="视觉" ${item.type === "视觉" ? "selected" : ""}>视觉</option>
          </select>
        </div>
      </div>
      ${textareaField("usage", "用途说明", item.usage)}
      <div class="field-grid three-col">
        ${inputField("language", "默认输出语言", item.language || "中英双语")}
        ${inputField("priority", "优先级", item.priority || 1, "number")}
        <div class="field">
          <label for="field-enabled">是否启用</label>
          <select name="enabled" id="field-enabled">
            <option value="true" ${item.enabled ? "selected" : ""}>启用</option>
            <option value="false" ${!item.enabled ? "selected" : ""}>停用</option>
          </select>
        </div>
      </div>
      ${inputField("apiKey", "API Key，本地保存", item.apiKey || "", "password")}
      ${textareaField("notes", "备注", item.notes)}
    </section>
  `;
  openModal();
}

function handleModalSubmit(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(dom.modalForm).entries());
  if (modalMode === "role") saveRole(data);
  if (modalMode === "module") saveModule(data);
  if (modalMode === "preset") savePreset(data);
  if (modalMode === "tag") saveTag(data.tag);
  if (modalMode === "model") saveModel(data);
  closeModal();
  saveState();
  render();
  showToast("已保存");
}

function saveRole(data) {
  const role = {
    id: modalEditingId || createId("role"),
    ...data,
    tags: parseTags(data.tags),
    updatedAt: today(),
  };
  upsert(state.roles, role);
  addTags(role.tags);
}

function saveModule(data) {
  const module = {
    id: modalEditingId || createId("module"),
    ...data,
    tags: parseTags(data.tags),
    favorite: data.favorite === "true",
    uses: Number(data.uses) || 0,
    updatedAt: data.updatedAt || today(),
  };
  upsert(state.modules, module);
  addTags(module.tags);
}

function savePreset(data) {
  const now = today();
  const existing = modalEditingId ? getPreset(modalEditingId) : null;
  const preset = {
    id: modalEditingId || createId("preset"),
    ...data,
    tags: parseTags(data.tags),
    versions: existing?.versions || [],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  upsert(state.presets, preset);
  addTags(preset.tags);
}

function saveTag(tag) {
  const clean = String(tag || "").trim();
  if (!clean) return;
  addTags([clean]);
}

function saveModel(data) {
  const model = {
    id: modalEditingId || createId("model"),
    ...data,
    enabled: data.enabled === "true",
    priority: Number(data.priority) || 0,
  };
  upsert(state.models, model);
}

function saveCurrentPreset() {
  regenerateResults();
  const wb = state.workbench;
  const role = getRole(wb.roleId);
  const titleBase = role ? `${role.name}${wb.goal || wb.promptType}` : wb.goal || wb.promptType;
  const preset = {
    id: createId("preset"),
    title: `${titleBase} ${versionLabel()}`,
    type: wb.promptType,
    zh: wb.results.zh,
    en: wb.results.en,
    negative: wb.results.negative,
    roleId: wb.roleId,
    scene: wb.frameDescription,
    tags: unique([...(role?.tags || []), wb.goal, wb.promptType].filter(Boolean)),
    model: "本地组合器",
    effect: "待记录使用效果。",
    versions: [
      {
        id: createId("version"),
        name: "v1",
        note: "由工作台保存的初始版本。",
        zh: wb.results.zh,
        en: wb.results.en,
        negative: wb.results.negative,
        createdAt: today(),
      },
    ],
    createdAt: today(),
    updatedAt: today(),
  };
  state.presets.unshift(preset);
  wb.lastSavedPresetId = preset.id;
  addTags(preset.tags);
  saveState();
  showToast("已保存到预设提示词库");
}

function saveCurrentVersion() {
  regenerateResults();
  const wb = state.workbench;
  let preset = getPreset(wb.lastSavedPresetId);
  if (!preset) {
    saveCurrentPreset();
    preset = getPreset(state.workbench.lastSavedPresetId);
  }
  const next = (preset.versions?.length || 0) + 1;
  preset.versions = preset.versions || [];
  preset.versions.push({
    id: createId("version"),
    name: `v${next}`,
    note: "由工作台保存的新版本，可在预设库继续编辑效果备注。",
    zh: wb.results.zh,
    en: wb.results.en,
    negative: wb.results.negative,
    createdAt: today(),
  });
  preset.zh = wb.results.zh;
  preset.en = wb.results.en;
  preset.negative = wb.results.negative;
  preset.updatedAt = today();
  saveState();
  showToast(`已保存为 ${preset.title} 的 v${next}`);
}

function usePreset(id) {
  const preset = getPreset(id);
  if (!preset) return;
  state.workbench.promptType = preset.type;
  state.workbench.roleId = preset.roleId || "";
  state.workbench.sceneGoal = preset.title;
  state.workbench.frameDescription = preset.scene || "";
  state.workbench.extra = preset.effect || "";
  state.workbench.results = {
    zh: preset.zh || "",
    en: preset.en || "",
    negative: preset.negative || "",
    json: JSON.stringify(preset, null, 2),
  };
  state.workbench.lastSavedPresetId = preset.id;
  saveState();
  location.hash = "#workbench";
  showToast("预设已带入工作台");
}

function deleteEntity(collection, id, label) {
  const ok = confirm(`确认删除这个${label}吗？`);
  if (!ok) return;
  state[collection] = state[collection].filter((item) => item.id !== id);
  saveState();
  render();
  showToast(`${label}已删除`);
}

function deleteTag(tag) {
  const ok = confirm(`确认删除标签「${tag}」吗？`);
  if (!ok) return;
  state.tags = state.tags.filter((item) => item !== tag);
  for (const collection of [state.roles, state.modules, state.presets]) {
    collection.forEach((item) => {
      item.tags = (item.tags || []).filter((entry) => entry !== tag);
    });
  }
  saveState();
  render();
  showToast("标签已删除");
}

function mergeTags() {
  const from = document.getElementById("mergeFrom").value;
  const to = document.getElementById("mergeTo").value;
  if (!from || !to || from === to) {
    showToast("请选择两个不同标签");
    return;
  }
  for (const collection of [state.roles, state.modules, state.presets]) {
    collection.forEach((item) => {
      if ((item.tags || []).includes(from)) {
        item.tags = unique(item.tags.map((tag) => (tag === from ? to : tag)));
      }
    });
  }
  state.tags = unique(state.tags.filter((tag) => tag !== from));
  saveState();
  renderTags();
  showToast(`已合并为「${to}」`);
}

function openModal() {
  dom.modal.showModal();
  refreshIcons();
}

function closeModal() {
  dom.modal.close();
  modalMode = null;
  modalEditingId = null;
  dom.modalForm.reset();
}

function inputField(name, label, value = "", type = "text") {
  return `
    <div class="field">
      <label for="field-${name}">${escapeHtml(label)}</label>
      <input id="field-${name}" name="${name}" type="${type}" value="${escapeHtml(value ?? "")}" />
    </div>
  `;
}

function textareaField(name, label, value = "") {
  return `
    <div class="field">
      <label for="field-${name}">${escapeHtml(label)}</label>
      <textarea id="field-${name}" name="${name}">${escapeHtml(value ?? "")}</textarea>
    </div>
  `;
}

function optionList(options, selected) {
  return options.map((item) => `<option value="${escapeHtml(item)}" ${item === selected ? "selected" : ""}>${escapeHtml(item)}</option>`).join("");
}

function emptyState(title, detail) {
  return `
    <div class="empty-state">
      <div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(detail)}</p>
      </div>
    </div>
  `;
}

function getRole(id) {
  return state.roles.find((item) => item.id === id);
}

function getModule(id) {
  return state.modules.find((item) => item.id === id);
}

function getPreset(id) {
  return state.presets.find((item) => item.id === id);
}

function getModel(id) {
  return state.models.find((item) => item.id === id);
}

function upsert(collection, item) {
  const index = collection.findIndex((entry) => entry.id === item.id);
  if (index >= 0) collection[index] = item;
  else collection.unshift(item);
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function versionLabel() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  return `${month}${day}-${hour}${minute}`;
}

function currentQuery() {
  return dom.search.value.trim().toLowerCase();
}

function searchable(value) {
  return JSON.stringify(value || "").toLowerCase();
}

function parseTags(value) {
  return unique(String(value || "").split(/[,，\n]/).map((tag) => tag.trim()).filter(Boolean));
}

function addTags(tags) {
  state.tags = unique([...(state.tags || []), ...tags.filter(Boolean)]);
}

function unique(list) {
  return [...new Set(list)];
}

function lines(value) {
  return String(value || "").split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function lineToSentence(value) {
  return lines(value).join("；");
}

function compactText(value) {
  const text = lineToSentence(value);
  return text.length > 100 ? `${text.slice(0, 100)}...` : text;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function copyText(text) {
  if (!text) {
    showToast("当前没有可复制内容");
    return;
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast("已复制到剪贴板")).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  showToast("已复制到剪贴板");
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => dom.toast.classList.remove("is-visible"), 2200);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  const icon = state.theme === "dark" ? "sun" : "moon";
  dom.themeToggle.innerHTML = `<i data-lucide="${icon}"></i>`;
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `prompt-control-backup-${today()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("数据已导出");
}

function getTempFilter(key, fallback) {
  return sessionStorage.getItem(`prompt_control_${key}`) || fallback;
}

function setTempFilter(key, value) {
  sessionStorage.setItem(`prompt_control_${key}`, value);
}

init();
